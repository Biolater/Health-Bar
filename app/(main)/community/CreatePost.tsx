"use client";

import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, X } from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@uploadcare/upload-client";

export default function CreatePostDialog() {
  const client = generateClient<Schema>();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // State for media preview
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const createPost = async () => {
    try {
      if (!message) {
        toast({
          description: "Please enter a message",
          variant: "destructive",
        });
        return;
      }

      if (user) {
        setLoading(true);
        // TODO: Implement file upload logic here
        if (mediaFile) {
          const result = await uploadFile(mediaFile, {
            publicKey: "1d847a0dfe61deca953d",
            store: "auto",
            source: "",
          });
          const fileType = result.isImage ? "image" : "video";
          const { data, errors } = await client.models.Post.create(
            {
              content: message,
              userId: user.userId,
              media: { type: fileType, url: result.cdnUrl || "" },
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
              description: "Post created successfully",
            });
          }
        } else {
          const { data, errors } = await client.models.Post.create(
            {
              content: message,
              userId: user.userId,
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
              description: "Post created successfully",
            });
          }
        }
      } else {
        toast({
          description: "Please sign in to create a post",
          variant: "destructive",
        });
      }
      setOpen(false);
      // Reset form
      setMessage("");
      setMediaFile(null);
      setPreview(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createPost();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileType = file?.type;
    if (!file || !fileType) {
      // Handle invalid input
      toast({
        title: "Error",
        description: "Please select a valid file.",
        variant: "destructive",
      });
      return;
    }

    const allowedMimeTypes = ["image/", "video/"];

    if (!allowedMimeTypes.some((mimeType) => fileType.startsWith(mimeType))) {
      toast({
        title: "Error",
        description: "Invalid file type. Only images and videos are allowed.",
        variant: "destructive",
      });
      return;
    }

    setMediaFile(file);
    const blob = URL.createObjectURL(file);
    setPreview(blob);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CreatePostButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90svh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            Share your thoughts and media with your followers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
              />
            </div>
            <div className="grid gap-2">
              <Label>Media</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                {mediaFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {mediaFile && (
              <div className="text-sm text-muted-foreground">
                File selected: {mediaFile.name}
              </div>
            )}
            {preview && mediaFile?.type.startsWith("image/") && (
              <img
                src={preview}
                alt="Media preview"
                className="max-w-full w-full object-cover rounded max-h-64"
              />
            )}
            {preview && mediaFile?.type.startsWith("video/") && (
              <video
                controls
                src={preview}
                className="max-w-full rounded max-h-64"
              />
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const CreatePostButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="size-12 p-0 rounded-full fixed right-8 bottom-8"
    >
      <Plus />
    </Button>
  );
};
