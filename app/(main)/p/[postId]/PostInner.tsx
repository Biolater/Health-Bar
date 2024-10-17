"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Send, Edit, Trash2 } from "lucide-react";
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
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(
    data?.postDetails?.content || ""
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const router = useRouter();
  const client = generateClient<Schema>();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const isOwner = user?.userId === data.postDetails?.userId;

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
    if (!newComment.trim() || submittingComment) return;
    if (data && data.postDetails && user) {
      setSubmittingComment(true);
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
            {
              id: commentData.id,
              content: commentData.content,
              createdAt: commentData.createdAt,
              userId: user.userId,
              user: {
                username: user?.username || "Anonymous",
                profilePicture: user?.profilePicture || defaultImage.src,
              },
            },
            ...prevComments,
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
      } finally {
        setSubmittingComment(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please sign in to post a comment",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!isOwner || !data.postDetails) return;

    try {
      const { errors } = await client.models.Post.update(
        {
          id: data.postDetails.id,
          content: editedContent,
        },
        { authMode: "userPool" }
      );

      if (errors) throw new Error(errors[0].message);

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      setIsEditing(false);
      // Update the local state to reflect the changes
      data.postDetails.content = editedContent;
      revalidateAfterLike(data.postDetails.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  // const handleDelete = async () => {
  //   if (!isOwner || !data.postDetails) return;

  //   try {
  //     const { errors } = await client.models.Post.delete(
  //       {
  //         id: data.postDetails.id,
  //       },
  //       { authMode: "userPool" }
  //     );

  //     if (errors) throw new Error(errors[0].message);

  //     toast({
  //       title: "Success",
  //       description: "Post deleted successfully",
  //     });
  //     revalidateAfterLike(data.postDetails.id);
  //     // Redirect to the user's profile or home page after deletion
  //     router.push(`/${user?.username || ""}`);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete post",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const { errors } = await client.models.Comment.update(
        {
          id: commentId,
          content: newContent,
        },
        { authMode: "userPool" }
      );

      if (errors) throw new Error(errors[0].message);

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: newContent }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditedCommentContent("");
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { errors } = await client.models.Comment.delete(
        { id: commentId },
        { authMode: "userPool" }
      );

      if (errors) throw new Error(errors[0].message);

      setComments(comments.filter((comment) => comment.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
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
              commentsData
                .map((comment) => ({
                  id: comment.id,
                  content: comment.content,
                  createdAt: comment.createdAt,
                  userId: comment.userId,
                  user: {
                    username: comment.user?.username || "Anonymous",
                    profilePicture:
                      comment.user?.profilePicture || defaultImage.src,
                  },
                }))
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
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
  }, [user]);

  return (
    <Card className="max-w-2xl mx-auto">
      {/* <CardHeader>
        <div className="flex justify-between items-center">
          <div className="inline-flex flex-row items-center space-x-4">
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
              <Link
                className="cursor-pointer"
                href={`/${data.user?.username || ""}`}
              >
                <h2 className="text-lg font-semibold">
                  {data?.user?.username || ""}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground">
                {data.postDetails?.createdAt
                  ? new Date(data.postDetails.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader> */}
      <PostHeader
        username={data.user?.username || ""}
        createdAt={data.postDetails?.createdAt || ""}
        isOwner={isOwner}
        profilePicture={data.user?.profilePicture || defaultImage.src}
        postDetailsExist={data.postDetails ? true : false}
        postId={data.postDetails?.id || ""}
        onEdit={() => setIsEditing((prev) => !prev)}
      />
      {/* <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save</Button>
            </div>
          </div>
        ) : (
          <p className="text-base">{data.postDetails?.content}</p>
        )}
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
      </CardContent> */}
      <PostBody
        defaultContent={data.postDetails?.content || ""}
        isEditing={isEditing}
        isOwner={isOwner}
        postDetailsExist={data.postDetails ? true : false}
        postId={data.postDetails?.id || ""}
        onEdit={(value) => setIsEditing(value)}
        media={data.postDetails?.media}
      />
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
        <Button
          onClick={() => commentInputRef.current?.focus()}
          variant="ghost"
          className="flex items-center space-x-2"
        >
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
        <div className="space-y-4 max-h-72 overflow-y-auto">
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
                <div className="flex-1">
                  <Link
                    className="cursor-pointer"
                    href={`/${comment.user.username}`}
                  >
                    <p className="font-semibold">{comment.user.username}</p>
                  </Link>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <Textarea
                        value={editedCommentContent}
                        onChange={(e) =>
                          setEditedCommentContent(e.target.value)
                        }
                        className="w-full mb-2"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditedCommentContent("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleEditComment(comment.id, editedCommentContent)
                          }
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </>
                  )}
                  {user?.userId === comment.userId && !editingCommentId && (
                    <div className="mt-2 space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditedCommentContent(comment.content);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-4 flex space-x-2">
          <Input
            ref={commentInputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow"
          />
          <Button disabled={submittingComment} type="submit" size="icon">
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
