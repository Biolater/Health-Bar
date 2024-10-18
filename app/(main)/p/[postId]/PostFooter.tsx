"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { Comment } from "./PostInner";
import type { Schema } from "@/amplify/data/resource";
import { toggleLike, type dataTypeForPostId } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface PostFooterProps {
  isLiked: boolean | undefined;
  likes: number | null;
  comments: Comment[];
  user: Schema["User"]["type"] | null;
  data: dataTypeForPostId;
  onDislike: () => void;
  onLike: () => void;
  onCommentsClick: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({
  isLiked,
  likes,
  comments,
  user,
  data,
  onDislike,
  onLike,
  onCommentsClick
}) => {
  const [loadingLikeClick, setLoadingLikeClick] = useState(false);
  const handleLike = async () => {
    if (user) {
      if (data && data.postDetails) {
        const postId = data.postDetails.id;
        const userId = user.userId;
        try {
          setLoadingLikeClick(true);
          if (isLiked) {
            onDislike();
            await toggleLike(postId, userId, "dislike");
          } else if (isLiked === false) {
            onLike();

            await toggleLike(postId, userId, "like");
          }
        } catch (error) {
          if (isLiked) {
            onLike();
          } else {
            onDislike();
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

  return (
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
        onClick={onCommentsClick}
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
  );
};

export default PostFooter;
