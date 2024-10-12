"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, X } from "lucide-react";
import { fallbackNameGenerator } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@uploadcare/upload-client";
import { toast } from "@/components/ui/use-toast";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
interface PostComposerProps {
  userAvatarSrc: string;
  userAvatarFallback: string;
}

export default function PostComposer({
  userAvatarSrc,
  userAvatarFallback,
}: PostComposerProps) {
  const client = generateClient<Schema>();
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const postButtonRef = useRef<HTMLButtonElement>(null);

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      toast({
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    try {
      if (user) {
        setLoading(true);
        // TODO: Implement file upload logic here
        if (selectedMedia) {
          const result = await uploadFile(selectedMedia, {
            publicKey: "1d847a0dfe61deca953d",
            store: "auto",
            source: "",
          });
          const fileType = result.isImage ? "image" : "video";
          const { data, errors } = await client.models.Post.create(
            {
              content: postContent,
              userId: user.userId,
              media: { type: fileType, url: result.cdnUrl || "" },
              postOwner: user.userId,
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
              content: postContent,
              userId: user.userId,
              postOwner: user.userId,
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
      // Reset form
      setPostContent("");
      setSelectedMedia(null);
      setPreviewUrl(null);
    } catch (error) {
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

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const listenForCtrlEnter = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        e.key === "Enter" &&
        contentInputRef.current &&
        postButtonRef.current
      ) {
        if (document.activeElement === contentInputRef.current) {
          postButtonRef.current.click();
        }
      }
    };

    document.addEventListener("keydown", listenForCtrlEnter);

    return () => {
      document.removeEventListener("keydown", listenForCtrlEnter);
    };
  }, []);

  return (
    <div className="bg-white hidden sm:block w-full dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={userAvatarSrc}
            alt="User avatar"
          />
          <AvatarFallback>
            {fallbackNameGenerator(userAvatarFallback)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Input
            ref={contentInputRef}
            placeholder="What is happening?!"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full mb-2 bg-transparent border-none text-lg placeholder-gray-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
            aria-label="Post content"
          />
          {previewUrl && (
            <div className="relative mb-2 group">
              {selectedMedia?.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Selected media"
                  className="max-w-full h-auto rounded"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="max-w-full h-auto rounded"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute transition-all top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
                onClick={removeMedia}
                aria-label="Remove media"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleMediaSelect}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIconClick}
                aria-label="Add image or video"
              >
                <ImageIcon className="h-5 w-5 text-blue-400" />
              </Button>
            </div>
            <Button
              ref={postButtonRef}
              onClick={handlePostSubmit}
              disabled={!postContent.trim() || loading}
              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
