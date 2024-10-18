"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import defaultImage from "@/assets/defaultProfileImg.png";
import { type dataTypeForPostId } from "@/lib/api";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { PostHeader, PostBody, PostFooter, PostComments } from "./PostParts";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    username: string;
    profilePicture?: string;
  };
};

const PostInner: React.FC<{ data: dataTypeForPostId }> = ({ data }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const [likes, setLikes] = useState(data?.postDetails?.likesCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const client = generateClient<Schema>();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const isOwner = user?.userId === data.postDetails?.userId;

  useEffect(() => {
    const fetchLikeAndComments = async () => {
      if (data && data.postDetails && data.user) {
        setLoadingComments(true);
        try {
          // Fetch like status
          const { data: likeData } = await client.models.Like.get(
            { postId: data.postDetails.id, userId: user ? user.userId : "" },
            { authMode: "apiKey" }
          );
          setIsLiked(!!likeData);

          // Fetch comments
          const { data: commentsData, errors } =
            await client.models.Comment.list({
              authMode: "apiKey",
              filter: { postId: { eq: data.postDetails.id } },
              selectionSet: [
                "id",
                "content",
                "postId",
                "userId",
                "createdAt",
                "user.username",
                "user.profilePicture",
              ],
            });

          if (errors) {
            console.error("Error fetching comments:", errors);
          } else {
            setComments(
              commentsData
                .map((comment) => ({
                  id: comment.id,
                  content: comment.content,
                  createdAt: comment.createdAt,
                  userId: comment.userId,
                  user: {
                    username: comment.user?.username || "Anonymous",
                    profilePicture:
                      comment.user?.profilePicture || defaultImage.src,
                  },
                }))
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingComments(false);
        }
      }
    };
    fetchLikeAndComments();
  }, [user]);

  return (
    <Card className="max-w-2xl mx-auto">
      <PostHeader
        username={data.user?.username || ""}
        createdAt={data.postDetails?.createdAt || ""}
        isOwner={isOwner}
        profilePicture={data.user?.profilePicture || defaultImage.src}
        postDetailsExist={data.postDetails ? true : false}
        postId={data.postDetails?.id || ""}
        onEdit={() => setIsEditing((prev) => !prev)}
      />
      <PostBody
        defaultContent={data.postDetails?.content || ""}
        isEditing={isEditing}
        isOwner={isOwner}
        postDetailsExist={data.postDetails ? true : false}
        postId={data.postDetails?.id || ""}
        onEdit={(value) => setIsEditing(value)}
        media={data.postDetails?.media}
      />
      <PostFooter
        isLiked={isLiked}
        likes={likes}
        data={data}
        user={user}
        comments={comments}
        onLike={async () => {
          setLikes((prevLikeCount) => (prevLikeCount || 0) + 1);
          setIsLiked(true);
        }}
        onDislike={async () => {
          setLikes((prevLikeCount) => (prevLikeCount || 0) - 1);
          setIsLiked(false);
        }}
        onCommentsClick={() => commentInputRef.current?.focus()}
      />
      <PostComments
        comments={comments}
        userId={user?.userId}
        loadingComments={loadingComments}
        data={data}
        user={user}
        commentInputRef={commentInputRef}
        onCommentEdit={(commentId, newContent) =>
          setComments(
            comments.map((comment) =>
              comment.id === commentId
                ? { ...comment, content: newContent }
                : comment
            )
          )
        }
        onCommentDelete={(commentId) =>
          setComments(comments.filter((comment) => comment.id !== commentId))
        }
        onCommentCreate={(newComment) =>
          setComments((prevComments) => [newComment, ...prevComments])
        }
      />
    </Card>
  );
};

export default PostInner;
