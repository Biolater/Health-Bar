"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultImage from "@/assets/defaultProfileImg.png";
import { fallbackNameGenerator } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import type { dataTypeForPostId } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { useAuth } from "@/contexts/AuthContext";

const PostInner: React.FC<{ data: dataTypeForPostId }> = ({ data }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loadingLikeClick, setLoadingLikeClick] = useState(false);
  const client = generateClient<Schema>();

  useEffect(() => {
    const fetchLike = async () => {
      if (data && data.postDetails && data.user) {
        const { data: likeData, errors } = await client.models.Like.get(
          { postId: data.postDetails.id, userId: user ? user.userId : "" },
          { authMode: "apiKey" }
        );
        if (errors) {
          setIsLiked(false);
        }
        if (likeData) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    };
    fetchLike();    
  }, [user]);

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
              className="rounded-md"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          disabled={isLiked === undefined || likes === null || loadingLikeClick}
          variant="ghost"
          size="sm"
          className={`text-muted-foreground flex items-center space-x-2 ${
            isLiked ? "text-red-500" : ""
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span>
            {data.postDetails?.likesCount}{" "}
            <span className="hidden sm:inline">Likes</span>
          </span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>
            {data.postDetails?.commentsCount}{" "}
            <span className="hidden sm:inline">Comments</span>
          </span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Share2 className="w-5 h-5" />
          <span className="">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostInner;
