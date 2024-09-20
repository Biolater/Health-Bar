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

export type myPostProps = {
  postContent: string;
  postId: string;
  profileImage: string;
  username: string;
  postDate: string;
  likeCount: number;
  commentCount: number;
};

export default function MyPost({
  postContent,
  postId,
  profileImage,
  username,
  postDate,
  likeCount,
  commentCount,
}: myPostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(postContent);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically send the updated content to your backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(postContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Here you would typically send a delete request to your backend
    console.log("Post deleted");
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
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
            <Button size="sm" disabled={!content} onClick={handleSave}>
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
