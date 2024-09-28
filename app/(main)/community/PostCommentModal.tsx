"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { formatPostDate } from "./postUtils";

interface CommentModalProps {
  userId: string;
  postId: string;
  postContent: string;
  postAuthor: string;
  postAuthorImage: string;
  postDate: string;
  triggerButton: React.ReactNode;
  commentAddedCallback: () => void;
  commentFailedCallback: () => void;
}

export function CommentModal({
  userId,
  postId,
  postContent,
  postAuthor,
  postAuthorImage,
  postDate,
  triggerButton,
  commentAddedCallback,
  commentFailedCallback
}: CommentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const client = generateClient<Schema>();

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) {
      toast({
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, errors } = await client.models.Comment.create(
        {
          content: comment,
          postId,
          userId,
        },
        {
          authMode: "userPool",
        }
      );

      commentAddedCallback();

      if (errors && errors[0].message) {
        throw new Error(errors[0].message);
      }

      if (data) {
        toast({
          description: "Comment added successfully",
        });
        setComment("");
        setIsOpen(false);
      }
    } catch (error) {
      commentFailedCallback();
      toast({
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a comment</DialogTitle>
          <DialogDescription>
            Respond to the post below. Your comment will be visible to others.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={postAuthorImage} alt={postAuthor} />
              <AvatarFallback>
                {postAuthor.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{postAuthor}</h4>
                <span className="text-sm text-muted-foreground">
                  {formatPostDate(postDate)}
                </span>
              </div>
              <p className="mt-1 text-sm">{postContent}</p>
            </div>
          </div>
          <form onSubmit={handleSubmitComment}>
            <Textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
