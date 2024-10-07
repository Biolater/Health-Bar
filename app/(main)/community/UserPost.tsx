"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostProps, formatPostDate, truncateText } from "./postUtils";
import { toggleLike } from "@/lib/api";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { CommentModal } from "./PostCommentModal";
import defaultImg from "@/assets/defaultProfileImg.png";

interface UserPostProps extends PostProps {
  postOwnerId: string;
}

export default function UserPost({
  postId,
  username,
  postDate,
  postContent,
  media,
  userId,
  postOwnerId,
}: UserPostProps) {
  const client = generateClient<Schema>();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [comments, setComments] = useState<number | null>(null);
  const [likes, setLikes] = useState<number | null>(null);
  const [loadingLikeClick, setLoadingLikeClick] = useState(false);
  const [postOwnerProfileImg, setPostOwnerProfileImg] = useState(
    defaultImg.src
  );

  const handleLike = async () => {
    if (userId) {
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
          error instanceof Error ? error.message : "An unknown error occured"
        );
      } finally {
        setLoadingLikeClick(false);
      }
    } else {
      toast({
        title: "Error",
        description: "You must be logged in to like a post",
        variant: "destructive",
      });
      router.push("/sign-in");
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/p/${postId}`);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Sharing post:", postId);
  };

  const toggleContent = () => setShowFullContent((prev) => !prev);

  useEffect(() => {
    const fetchLike = async () => {
      const { data, errors } = await client.models.Like.get(
        { postId, userId },
        { authMode: "apiKey" }
      );
      if (errors) {
        setIsLiked(false);
      }
      if (data) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };
    const postDetails = async () => {
      const { data: postData } = await client.models.Post.get(
        {
          id: postId,
        },
        { authMode: "apiKey" }
      );

      if (postData) {
        const { data: likeData } = await postData.likes();
        const { data: commentsData } = await postData.comments();
        if (likeData) setLikes(likeData.length || 0);
        if (commentsData) setComments(commentsData.length || 0);
      }
    };
    const userDetails = async () => {
      try {
        const { data } = await client.models.User.get(
          { userId: postOwnerId },
          { authMode: "apiKey", selectionSet: ["profilePicture"] }
        );
        if (data && data?.profilePicture) {
          setPostOwnerProfileImg(data.profilePicture);
        }
      } catch (error) {
        console.log("Error while fetching user data: ", error);
      }
    };
    fetchLike();
    postDetails();
    userDetails();
  }, []);

  return (
    <Card
      onClick={() => handlePostClick(postId)}
      className="w-full mx-auto hover:bg-muted transition-colors duration-300 cursor-pointer"
    >
      <CardHeader className="flex items-start">
        <Link
          href={`/${username}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex flex-row gap-4 items-center"
        >
          <Avatar>
            <AvatarImage
              className="object-cover"
              alt={`${username}'s profile picture`}
              src={postOwnerProfileImg}
            />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{username}</p>
            <p className="text-xs text-muted-foreground">
              {formatPostDate(postDate)}
            </p>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {showFullContent ? postContent : truncateText(postContent, 150)}
        </p>
        {postContent.length > 150 && (
          <Button
            variant="link"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleContent();
            }}
          >
            {showFullContent ? "Show less" : "Show more"}
          </Button>
        )}
        {media && (
          <div className="mt-4">
            {media.type === "image" ? (
              <Image
                src={media.url}
                alt="Post image"
                width={500}
                height={300}
                className="rounded-lg object-cover"
              />
            ) : (
              <video src={media.url} controls className="w-full rounded-lg">
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          disabled={isLiked === undefined || likes === null || loadingLikeClick}
          variant="ghost"
          size="sm"
          className={`text-muted-foreground ${isLiked ? "text-red-500" : ""}`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />{" "}
          <span>{likes}</span>
        </Button>
        {userId ? (
          <CommentModal
            postId={postId}
            userId={userId}
            postContent={postContent}
            postAuthor={username}
            postAuthorImage={postOwnerProfileImg}
            postDate={postDate}
            commentAddedCallback={() => setComments((prev) => (prev || 0) + 1)}
            commentFailedCallback={() => setComments((prev) => (prev || 1) - 1)}
            triggerButton={
              <Button
                onClick={(e) => e.stopPropagation()}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>{comments}</span>
              </Button>
            }
            commentCount={comments || 0}
          />
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toast({
                title: "Error",
                description: "Please sign in to comment",
                variant: "destructive",
              });
              router.push("/sign-in");
            }}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>{comments}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
