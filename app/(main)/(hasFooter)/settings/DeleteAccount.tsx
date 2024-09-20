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
          const { errors } = await client.models.User.delete({
            userId: user.userId,
          });
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
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
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
            <Button disabled={accountDeleteLoading} onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DeleteAccount;
