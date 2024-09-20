"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X } from "lucide-react";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
export default function CreatePostDialog() {
  const client = generateClient<Schema>();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
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
      } else {
        toast({
          description: "Please sign in to create a post",
          variant: "destructive",
        });
      }
      setOpen(false);
      // Reset form
      setMessage("");
      setMediaUrl("");
      setMediaFile(null);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Sign up Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically send the post data to your backend
    console.log("Submitting post:", { message, mediaUrl, mediaFile });
    await createPost();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaUrl("");
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CreatePostButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                <Input
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setMediaFile(null);
                  }}
                  placeholder="Or enter media URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={removeMedia}
                  disabled={!mediaFile && !mediaUrl}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {(mediaFile || mediaUrl) && (
              <div className="text-sm text-muted-foreground">
                {mediaFile
                  ? `File selected: ${mediaFile.name}`
                  : `URL: ${mediaUrl}`}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Post</Button>
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
