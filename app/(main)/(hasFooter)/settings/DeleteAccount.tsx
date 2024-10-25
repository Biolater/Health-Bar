"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { type Schema } from "@/amplify/data/resource";
import { deleteUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const DeleteAccount = () => {
  const { user } = useAuth();
  const client = generateClient<Schema>();
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (accountDeleteLoading) return;

    try {
      setAccountDeleteLoading(true);

      if (user) {
        const { data: userPosts } = await user.posts({ authMode: "userPool" });
        const { data: userLikes } = await client.models.Like.list({
          authMode: "userPool",
          filter: { userId: { eq: user.userId } },
        });
        const { data: userComments } = await user.comments();

        // Delete posts and their comments
        const postDeletionPromises = userPosts.map(async (post) => {
          await client.models.Post.delete(
            { id: post.id },
            { authMode: "userPool" }
          );
          const { data: postComments } = await post.comments({
            authMode: "userPool",
          });
          return Promise.all(
            postComments.map((comment) =>
              client.models.Comment.delete(
                { id: comment.id },
                { authMode: "userPool" }
              )
            )
          );
        });

        // Delete likes and update liked posts
        const likeDeletionPromises = userLikes.map(async (like) => {
          await client.models.Like.delete(
            { postId: like.postId, userId: user.userId },
            { authMode: "userPool" }
          );
          const { data: likedPost } = await like.post();
          if (likedPost && likedPost.userId !== user.userId) {
            await client.models.Post.update(
              { id: likedPost.id, likesCount: (likedPost.likesCount || 1) - 1 },
              { authMode: "userPool" }
            );
          }
        });

        // Delete comments and update commented posts
        const commentDeletionPromises = userComments.map(async (comment) => {
          await client.models.Comment.delete(
            { id: comment.id },
            { authMode: "userPool" }
          );
          const { data: commentedPost } = await comment.post();
          if (commentedPost && commentedPost.userId !== user.userId) {
            await client.models.Post.update(
              {
                id: commentedPost.id,
                commentsCount: (commentedPost.commentsCount || 1) - 1,
              },
              { authMode: "userPool" }
            );
          }
        });

        // Execute deletion processes concurrently
        await Promise.all([
          Promise.all(postDeletionPromises),
          Promise.allSettled(likeDeletionPromises),
          Promise.allSettled(commentDeletionPromises),
        ]);

        // Delete user account
        const { errors } = await client.models.User.delete(
          { userId: user.userId },
          { authMode: "userPool" }
        );

        if (errors?.length) throw new Error(errors[0].message);

        await deleteUser();

        toast({
          title: "Success",
          description: "Your account has been successfully deleted.",
          duration: 2000,
        });

        // Optionally redirect after deletion
        // router.push("/sign-in");
      }
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 2000,
        
      });
    } finally {
      setAccountDeleteLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg bg-primary md:basis-3/4"
    >
      <h2 className="text-white text-3xl font-bold mb-2">Delete Account</h2>
      <p className="text-white mb-4">
        Warning: Deleting your account will permanently remove all your data.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={accountDeleteLoading}
              onClick={handleDelete}
            >
              {accountDeleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DeleteAccount;
