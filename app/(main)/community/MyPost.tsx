"use client";
import { useState } from "react";
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
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { toast } from "@/components/ui/use-toast";
import { deletePost } from "@/lib/api";
import Link from "next/link";

export type myPostProps = {
  postContent: string;
  postId: string;
  profileImage: string;
  username: string;
  postDate: string;
  likeCount: number;
  commentCount: number;
  onDelete?: (postId: string) => void;
};

export default function MyPost({
  postContent,
  postId,
  profileImage,
  username,
  postDate,
  likeCount,
  commentCount,
  onDelete,
}: myPostProps) {
  const client = generateClient<Schema>();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(postContent);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data, errors } = await client.models.Post.update(
        {
          id: postId,
          content,
        },
        {
          authMode: "userPool",
        }
      );
      if (errors && errors[0].message) {
        throw new Error(errors[0].message);
      }
      if (data) {
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      }
      setIsEditing(false);
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "An unknown Error occured",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(postContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const { isDeleted } = await deletePost(postId);
      if (onDelete) onDelete(postId);

      if (isDeleted) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        setIsDeleteDialogOpen(false);
      }
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

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <Link href={`/${username}`} >
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage alt="Your profile picture" src={profileImage} />
              <AvatarFallback>
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{username}</p>
              <p className="text-xs text-muted-foreground">
                {/* Posted on April 20, 2023 */}
                Posted on {postDate}
              </p>
            </div>
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
              <Button disabled={deleting} variant="ghost" size="icon">
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
                <Button variant="destructive" onClick={handleDelete}>
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
          <p className="text-sm">{content}</p>
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
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
