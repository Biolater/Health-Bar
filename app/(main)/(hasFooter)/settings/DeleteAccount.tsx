"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { type Schema } from "@/amplify/data/resource";
import { deleteUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
const DeleteAccount = () => {
  const { user } = useAuth();
  const client = generateClient<Schema>();
  const router = useRouter();
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);
  const handleDelete = async () => {
    if (!accountDeleteLoading) {
      try {
        setAccountDeleteLoading(true);
        if (user) {
          const { data: userPosts } = await user.posts({
            authMode: "userPool",
          });

          for (const post of userPosts) {
            await client.models.Post.delete(
              {
                id: post.id,
              },
              { authMode: "userPool" }
            );
            const { data: postComments } = await post.comments({
              authMode: "userPool",
            });
            for (const comment of postComments) {
              await client.models.Comment.delete(
                {
                  id: comment.id,
                },
                { authMode: "userPool" }
              );
            }
          }

          const { data: userLikes } = await client.models.Like.list({
            authMode: "userPool",
            filter: {
              userId: {
                eq: user.userId,
              },
            },
          });

          for (const like of userLikes) {
            await client.models.Like.delete(
              {
                postId: like.postId,
                userId: user.userId,
              },
              { authMode: "userPool" }
            );
          }

          const { data: userComments } = await user.comments();

          for (const comment of userComments) {
            await client.models.Comment.delete(
              {
                id: comment.id,
              },
              { authMode: "userPool", selectionSet: ["id"] }
            );
          }

          const { errors } = await client.models.User.delete(
            {
              userId: user.userId,
            },
            { authMode: "userPool" }
          );

          if (errors && errors[0].message) {
            throw new Error(errors[0].message);
          }
          await deleteUser();
          router.push("/sign-in");
          toast({
            title: "Success",
            description: "Your account has successfully deleted.",
          });
        }
      } catch (error) {
        toast({
          description:
            error instanceof Error ? error.message : "An unknown Error occured",
          variant: "destructive",
        });
      } finally {
        setAccountDeleteLoading(false);
      }
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
