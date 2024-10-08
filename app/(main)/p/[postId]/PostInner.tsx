"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import Image from "next/image";
import defaultImage from "@/assets/defaultProfileImg.png";
import { fallbackNameGenerator } from "@/lib/utils";
import { toggleLike, type dataTypeForPostId } from "@/lib/api";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { revalidateAfterLike } from "@/lib/actions";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    profilePicture?: string;
  };
};

const PostInner: React.FC<{ data: dataTypeForPostId }> = ({ data }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const [likes, setLikes] = useState(data?.postDetails?.likesCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingLikeClick, setLoadingLikeClick] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const client = generateClient<Schema>();

  const handleLike = async () => {
    if (user) {
      if (data && data.postDetails) {
        const postId = data.postDetails.id;
        const userId = user.userId;
        try {
          setLoadingLikeClick(true);
          if (isLiked) {
            setLikes((prevLikeCount) => (prevLikeCount || 1) - 1);
            setIsLiked(false);
            await toggleLike(postId, userId, "dislike");
          } else if (isLiked === false) {
            setLikes((prevLikeCount) => (prevLikeCount || 0) + 1);
            setIsLiked(true);
            await toggleLike(postId, userId, "like");
          }
        } catch (error) {
          if (isLiked) {
            setLikes((prevLikeCount) => (prevLikeCount || 0) + 1);
          } else {
            setLikes((prevLikeCount) => (prevLikeCount || 1) - 1);
          }
          throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        } finally {
          setLoadingLikeClick(false);
        }
      }
    } else {
      toast({
        title: "Error",
        description: "Please sign in to like a post",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (data && data.postDetails && user) {
      try {
        const { data: commentData, errors } =
          await client.models.Comment.create(
            {
              content: newComment,
              postId: data.postDetails.id,
              userId: user.userId,
              commentOwner: user.userId,
            },
            { authMode: "userPool" }
          );

        if (errors) throw new Error(errors[0].message);

        if (commentData) {
          setComments((prevComments) => [
            ...prevComments,
            {
              id: commentData.id,
              content: commentData.content,
              createdAt: commentData.createdAt,
              user: {
                username: user?.username || "Anonymous",
                profilePicture: user?.profilePicture || defaultImage.src,
              },
            },
          ]);
        }
        setNewComment("");
        await client.models.Post.update(
          { id: data.postDetails.id, commentsCount: comments.length + 1 },
          { authMode: "userPool" }
        );
        revalidateAfterLike(`/p/${data.postDetails.id}`);
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    } else {
      toast({
        title: "Error",
        description: "Please sign in to post a comment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchLikeAndComments = async () => {
      if (data && data.postDetails && data.user) {
        setLoadingComments(true);
        try {
          // Fetch like status
          const { data: likeData } = await client.models.Like.get(
            { postId: data.postDetails.id, userId: user ? user.userId : "" },
            { authMode: "apiKey" }
          );
          setIsLiked(!!likeData);

          // Fetch comments
          const { data: commentsData, errors } =
            await client.models.Comment.list({
              authMode: "apiKey",
              filter: { postId: { eq: data.postDetails.id } },
              selectionSet: [
                "id",
                "content",
                "postId",
                "userId",
                "createdAt",
                "user.username",
                "user.profilePicture",
              ],
            });

          if (errors) {
            console.error("Error fetching comments:", errors);
          } else {
            setComments(
              commentsData.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                  username: comment.user?.username || "Anonymous",
                  profilePicture:
                    comment.user?.profilePicture || defaultImage.src,
                },
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingComments(false);
        }
      }
    };
    fetchLikeAndComments();
    console.log(data);
  }, [data, user]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={data?.user?.profilePicture || defaultImage.src}
            alt={data?.user?.username || "Profile Picture"}
          />
          <AvatarFallback>
            {fallbackNameGenerator(data.user?.username || "")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">
            {data?.user?.username || ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.postDetails?.createdAt
              ? new Date(data.postDetails.createdAt).toLocaleDateString()
              : "Unknown date"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base">{data.postDetails?.content}</p>
        {data.postDetails?.media && data.postDetails.media.type === "image" && (
          <div className="relative w-full h-[400px]">
            <Image
              src={data.postDetails.media.url}
              alt="Post image"
              layout="fill"
              objectFit="cover"
              className="rounded-md object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleLike}
          disabled={isLiked === undefined || likes === null || loadingLikeClick}
          variant="ghost"
          size="sm"
          className={`text-muted-foreground flex items-center space-x-2 ${
            isLiked ? "text-red-500" : ""
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span>
            {likes} <span className="hidden sm:inline">Likes</span>
          </span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>
            {comments.length} <span className="hidden sm:inline">Comments</span>
          </span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </CardFooter>
      <CardContent>
        <h3 className="font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          {loadingComments ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    className="object-cover"
                    src={comment.user.profilePicture || defaultImage.src}
                    alt={comment.user.username}
                  />
                  <AvatarFallback>
                    {fallbackNameGenerator(comment.user.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{comment.user.username}</p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-4 flex space-x-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const CommentSkeleton = () => (
  <div className="flex items-start space-x-3">
    <Skeleton className="w-8 h-8 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);

export default PostInner;
