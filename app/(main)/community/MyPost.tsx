"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { deletePost, updatePostContent, toggleLike } from "@/lib/api";
import Link from "next/link";
import { PostProps, formatPostDate, truncateText } from "./postUtils";
import { CommentModal } from "./PostCommentModal";
import Image from "next/image";
import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

interface MyPostProps extends PostProps {
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, newContent: string) => void;
}

export default function MyPost({
  postId,
  profileImage,
  username,
  postDate,
  postContent,
  userId,
  media,
  onDelete,
  onUpdate,
}: MyPostProps) {
  const client = generateClient<Schema>();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(postContent);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const [comments, setComments] = useState<number | null>(null);
  const [loadingLikeClick, setLoadingLikeClick] = useState(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePostContent(postId, content);
      if (onUpdate) await onUpdate(postId, content);
      setIsEditing(false);
      toast({ title: "Success", description: "Post updated successfully" });
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async () => {
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
  };

  const handleCancel = () => {
    setContent(postContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(postId);
      if (onDelete) onDelete(postId);
      toast({ title: "Success", description: "Post deleted successfully" });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const toggleContent = () => setShowFullContent((prev) => !prev);

  useEffect(() => {
    const fetchLike = async () => {
      const { data, errors } = await client.models.Like.get(
        { postId, userId },
        { authMode: "userPool" }
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
        { authMode: "userPool" }
      );

      if (postData) {
        const { data: likeData } = await postData.likes();
        const { data: commentsData } = await postData.comments();
        if (likeData) setLikes(likeData.length || 0);
        if (commentsData) setComments(commentsData.length || 0);
      }
    };
    fetchLike();
    postDetails();
  }, []);

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <Link href={`/${username}`} className="flex items-center gap-4">
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
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit post</span>
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete post</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this post?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your post.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={deleting}
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={content}
            disabled={saving}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <>
            <p className="text-sm">
              {showFullContent ? postContent : truncateText(postContent, 150)}
            </p>
            {postContent.length > 150 && (
              <Button variant="link" size="sm" onClick={toggleContent}>
                {showFullContent ? "Show less" : "Show more"}
              </Button>
            )}
          </>
        )}
        {media && (
          <div className="mt-4">
            {media.type === "image" ? (
              <Image
                src={media.url}
                alt="Post image"
                width={500}
                height={300}
                className="rounded-lg object-cover w-full"
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
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!content || saving}
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleLike}
              disabled={
                isLiked === undefined || likes === null || loadingLikeClick
              }
              variant="ghost"
              size="sm"
              className={`text-muted-foreground ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
              />{" "}
              <span>{likes}</span>
            </Button>
            <CommentModal
              postId={postId}
              userId={userId}
              postContent={postContent}
              postAuthor={username}
              postAuthorImage={profileImage}
              postDate={postDate}
              commentAddedCallback={() =>
                setComments((prev) => (prev || 0) + 1)
              }
              commentFailedCallback={() =>
                setComments((prev) => (prev || 1) - 1)
              }
              triggerButton={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>{comments}</span>
                </Button>
              }
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
