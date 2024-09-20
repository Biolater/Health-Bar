"use client";
import { useAuth } from "@/contexts/AuthContext";
import UserPost from "./UserPost";
import { type Schema } from "@/amplify/data/resource";
import MyPost from "./MyPost";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAllPosts } from "@/lib/api";
import PostCardSkeleton from "./PostCardSkeleton";
import defaultImg from "@/assets/defaultProfileImg.png";
const Posts = () => {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Schema["Post"]["type"][] | undefined>(
    undefined
  );
  const [usernames, setUsernames] = useState<Record<string, string>>({}); // State to store usernames
  const [postsLoading, setPostsLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await getAllPosts();
        const usernamesMap: Record<string, string> = {};
        for (const post of posts) {
          const { data, errors } = await post.user();
          if (errors && errors[0].message) {
            throw new Error(errors[0].message);
          }
          if (data) {
            usernamesMap[post.id] = data.username;
          }
        }
        setUsernames(usernamesMap);
        setPosts(posts);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
  if (postsLoading || loading)
    return Array.from({ length: 15 }).map((_, idx) => (
      <PostCardSkeleton key={idx} />
    ));

  return posts?.map((post, idx) => {
    if (post.userId === user?.userId) {
      return (
        <MyPost
          postContent={post.content}
          postId={post.id}
          profileImage={user?.profilePicture || defaultImg.src}
          username={user?.username || ""}
          postDate={formatDate(post.createdAt)}
          commentCount={post.commentsCount || 0}
          likeCount={post.likesCount || 0}
          key={idx}
        />
      );
    } else {
      return (
        <UserPost
          postContent={post.content}
          postId={post.id}
          profileImage={user?.profilePicture || defaultImg.src}
          postDate={formatDate(post.createdAt)}
          username={usernames[post.id] || ""}
          commentCount={post.commentsCount || 0}
          likeCount={post.likesCount || 0}
          key={idx}
        />
      );
    }
  });
};

export default Posts;
