"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import type { Comment } from "./PostInner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallbackNameGenerator } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Send, Trash2 } from "lucide-react";
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
import defaultImage from "@/assets/defaultProfileImg.png";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Skeleton } from "@/components/ui/skeleton";
import { type dataTypeForPostId } from "@/lib/api";
import { revalidateAfterLike } from "@/lib/actions";

interface PostCommentsProps {
  loadingComments: boolean;
  comments: Comment[];
  userId: string | undefined;
  data: dataTypeForPostId;
  user: Schema["User"]["type"] | null;
  commentInputRef: React.RefObject<HTMLInputElement>;
  onCommentEdit: (commentId: string, newContent: string) => void;
  onCommentDelete: (commentId: string) => void;
  onCommentCreate: (newComment: Comment) => void;
}

const PostComments: React.FC<PostCommentsProps> = ({
  loadingComments,
  comments,
  userId,
  data,
  user,
  commentInputRef,
  onCommentEdit,
  onCommentDelete,
  onCommentCreate,
}) => {
  const client = generateClient<Schema>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [newComment, setNewComment] = useState("");

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

      onCommentEdit(commentId, newContent);
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

      onCommentDelete(commentId);
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
          onCommentCreate({
            id: commentData.id,
            content: commentData.content,
            createdAt: commentData.createdAt,
            userId: user.userId,
            user: {
              username: user?.username || "Anonymous",
              profilePicture: user?.profilePicture || defaultImage.src,
            },
          });
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
        duration: 2000,
      });
    }
  };

  return (
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
                <div className="flex justify-between flex-grow">
                  <div>
                    <Link
                      className="cursor-pointer inline-block"
                      href={`/${comment.user.username}`}
                    >
                      <p className="font-semibold">{comment.user.username}</p>
                    </Link>
                    {editingCommentId !== comment.id && (
                      <p className="text-sm">{comment.content}</p>
                    )}
                  </div>
                  {editingCommentId !== comment.id && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
                {editingCommentId === comment.id && (
                  <div className="mt-2">
                    <Textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
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
                )}
                {userId !== comment.userId && !editingCommentId && (
                  <div className="w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 block text-gray-400 hover:text-white"
                    >
                      Reply
                    </Button>
                  </div>
                )}
                {userId === comment.userId && !editingCommentId && (
                  <div className="mt-2 space-x-2 w-full">
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

export default PostComments;
