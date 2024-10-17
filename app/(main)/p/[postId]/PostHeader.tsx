import type { Schema } from "@/amplify/data/resource";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { revalidateAfterLike } from "@/lib/actions";
import { fallbackNameGenerator } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";

interface CommentHeaderProps {
  profilePicture: string;
  username: string;
  createdAt: string;
  isOwner: boolean;
  postDetailsExist: boolean;
  postId: string;
  onEdit: () => void;
}

const PostHeader: React.FC<CommentHeaderProps> = ({
  profilePicture,
  username,
  createdAt,
  isOwner,
  postDetailsExist,
  postId,
  onEdit,
}) => {
  const router = useRouter();
  const client = generateClient<Schema>();
  const handleDelete = async () => {
    if (!isOwner || !postDetailsExist) return;

    try {
      const { errors } = await client.models.Post.delete(
        {
          id: postId,
        },
        { authMode: "userPool" }
      );

      if (errors) throw new Error(errors[0].message);

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      revalidateAfterLike(postId);
      // Redirect to the user's profile or home page after deletion
      router.push("/community");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div className="inline-flex flex-row items-center space-x-4">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={profilePicture}
              alt={username || "Profile Picture"}
            />
            <AvatarFallback>{fallbackNameGenerator(username)}</AvatarFallback>
          </Avatar>
          <div>
            <Link className="cursor-pointer" href={`/${username}`}>
              <h2 className="text-lg font-semibold">{username}</h2>
            </Link>
            <p className="text-sm text-muted-foreground">
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default PostHeader;
