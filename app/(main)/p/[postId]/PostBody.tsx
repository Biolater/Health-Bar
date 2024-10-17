"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PostDefaultTypes } from "./PostType";
import { toast } from "@/components/ui/use-toast";
import { revalidateAfterLike } from "@/lib/actions";
import Image from "next/image";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";

interface PostBodyProps extends PostDefaultTypes {
  isEditing: boolean;
  defaultContent: string;
  onEdit: (value: boolean) => void;
  media:
    | {
        type: string;
        url: string;
      }
    | null
    | undefined;
}

const PostBody: React.FC<PostBodyProps> = ({
  isEditing,
  defaultContent,
  isOwner,
  postId,
  postDetailsExist,
  media,
  onEdit,
}) => {
  const client = generateClient<Schema>();
  const [editedContent, setEditedContent] = useState(defaultContent);
  const handleEdit = async () => {
    if (!isOwner || !postDetailsExist) return;

    try {
      const { errors } = await client.models.Post.update(
        {
          id: postId,
          content: editedContent,
        },
        { authMode: "userPool" }
      );

      if (errors) throw new Error(errors[0].message);

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      onEdit(false);
      // Update the local state to reflect the changes
      //   defaultContent = editedContent;
      revalidateAfterLike(postId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };
  return (
    <CardContent className="space-y-4">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </div>
        </div>
      ) : (
        <p className="text-base">{editedContent}</p>
      )}
      {media && media.type === "image" && (
        <div className="relative w-full h-[400px]">
          <Image
            src={media.url}
            alt="Post image"
            layout="fill"
            objectFit="cover"
            className="rounded-md object-cover"
          />
        </div>
      )}
    </CardContent>
  );
};

export default PostBody;
