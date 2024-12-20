"use client";
import { useAuth } from "@/contexts/AuthContext";
import UserPost from "./UserPost";
import MyPost from "./MyPost";
import PostComposer from "./PostComposer";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAllPosts } from "@/lib/api";
import PostCardSkeleton from "./PostCardSkeleton";
import defaultImg from "@/assets/defaultProfileImg.png";
import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
const Posts = () => {
  const client = generateClient<Schema>();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Schema["Post"]["type"][] | undefined>(
    undefined
  );
  const [usernames, setUsernames] = useState<Record<string, string>>({}); // State to store usernames for each post
  const [postsLoading, setPostsLoading] = useState(true);
  const [currentEditingPostId, setCurrentEditingPostId] = useState<
    string | null
  >(null);
  const handlePostUpdate = (postId: string, newContent: string) => {
    setPosts((prevPosts) =>
      prevPosts?.map((post) =>
        postId === post.id ? { ...post, content: newContent } : post
      )
    );
  };
  const handlePostDelete = (postId: string) => {
    setPosts((prevPosts) => prevPosts?.filter((post) => post.id !== postId));
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await getAllPosts();
        const usernamesMap: Record<string, string> = {};
        const userPromises = posts.map(async (post) => {
          const { data, errors } = await post.user();
          if (errors && errors[0].message) {
            throw new Error(errors[0].message);
          }
          return { id: post.id, username: data?.username };
        });
        const results = await Promise.all(userPromises);
        for (const result of results) {
          if (result.username) {
            usernamesMap[result.id] = result.username;
          }
        }
        const sortedPosts = posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsernames(usernamesMap);
        setPosts(sortedPosts);
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
    const sub = client.models.Post.onCreate().subscribe({
      next: (post) =>
        post.userId === user?.userId &&
        setPosts((prevPosts) => [post, ...(prevPosts || [])]),
      error: (error) => {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
      },
    });
    fetchPosts();
    return () => sub.unsubscribe();
  }, [user?.userId]);

  if (postsLoading || loading)
    return Array.from({ length: 15 }).map((_, idx) => (
      <PostCardSkeleton key={idx} />
    ));

  return (
    <>
      {user && (
        <PostComposer
          userAvatarFallback={user.username}
          userAvatarSrc={user?.profilePicture || defaultImg.src}
        />
      )}
      {posts?.map((post) => {
        if (post.userId === user?.userId) {
          return (
            <MyPost
              postContent={post.content}
              postId={post.id}
              profileImage={user?.profilePicture || defaultImg.src}
              userId={user?.userId || ""}
              username={user?.username || ""}
              postDate={post.createdAt}
              media={post.media}
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
              onEdit={(postId) => setCurrentEditingPostId(postId)}
              isBeingEdited={currentEditingPostId === post.id}
              onEditFinish={() => setCurrentEditingPostId(null)}
              key={post.id}
            />
          );
        } else {
          return (
            <UserPost
              postContent={post.content}
              postId={post.id}
              postDate={post.createdAt}
              postOwnerId={post.userId}
              userId={user?.userId || ""}
              username={usernames[post.id] || ""}
              key={post.id}
            />
          );
        }
      })}
    </>
  );
};

export default Posts;
