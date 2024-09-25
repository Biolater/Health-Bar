"use client";

import { useState } from "react";
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

export default function UserPost({
  postId,
  profileImage,
  username,
  postDate,
  postContent,
  media
}: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically update the like status on the backend
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Sharing post:", postId);
  };

  const toggleContent = () => setShowFullContent(!showFullContent);

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex items-start">
        <Link
          href={`/${username}`}
          className="inline-flex flex-row gap-4 items-center"
        >
          <Avatar>
            <AvatarImage
              alt={`${username}'s profile picture`}
              src={profileImage}
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
          <Button variant="link" size="sm" onClick={toggleContent}>
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
          variant="ghost"
          size="sm"
          className={`text-muted-foreground ${isLiked ? "text-red-500" : ""}`}
          onClick={toggleLike}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
          <span>0</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircle className="w-4 h-4 mr-2" />
          <span>0</span>
        </Button>
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
