"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import defaultImage from "@/assets/defaultProfileImg.png";
import { type dataTypeForPostId } from "@/lib/api";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { useAuth } from "@/contexts/AuthContext";
import { PostHeader, PostBody, PostFooter, PostComments } from "./PostParts";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  parentCommentId: string | undefined;
  user: {
    username: string;
    profilePicture?: string;
  };
  replies: Comment[];
};

export default function Component({ data }: { data: dataTypeForPostId }) {
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
        try {
          if (user) {
            const { data: likeData } = await client.models.Like.get(
              { postId: data.postDetails.id, userId: user ? user.userId : "" },
              { authMode: "apiKey" }
            );
            setIsLiked(!!likeData);
          }

          const { data: commentsData } = await client.models.Comment.list({
            authMode: "apiKey",
            filter: { postId: { eq: data.postDetails.id } },
            selectionSet: [
              "id",
              "content",
              "postId",
              "userId",
              "parentCommentId",
              "createdAt",
              "user.username",
              "user.profilePicture",
              "replies.id",
              "replies.content",
              "replies.userId",
              "replies.parentCommentId",
              "replies.createdAt",
              "replies.user.username",
              "replies.user.profilePicture",
            ],
          });
          setComments(
            commentsData
              .map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                userId: comment.userId,
                parentCommentId: comment.parentCommentId || undefined,
                user: {
                  username: comment.user?.username || "Anonymous",
                  profilePicture:
                    comment.user?.profilePicture || defaultImage.src,
                },
                replies:
                  comment.replies.map((reply) => ({
                    id: reply.id,
                    content: reply.content,
                    createdAt: reply.createdAt,
                    userId: reply.userId,
                    parentCommentId: reply.parentCommentId || undefined,
                    user: {
                      username: reply.user?.username || "Anonymous",
                      profilePicture:
                        reply.user?.profilePicture || defaultImage.src,
                    },
                    replies: [],
                  })) || [],
              }))
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingComments(false);
        }
      }
    };
    fetchLikeAndComments();
  }, [user]);

  const handleCommentEdit = (
    commentId: string,
    newContent: string,
    isReply: boolean
  ) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (!isReply && comment.id === commentId) {
          return { ...comment, content: newContent };
        }
        if (isReply) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, content: newContent } : reply
            ),
          };
        }
        return comment;
      });
    });
  };

  const handleCommentDelete = (commentId: string, isReply: boolean) => {
    setComments((prevComments) => {
      if (!isReply) {
        return prevComments.filter((c) => c.id !== commentId);
      }
      return prevComments.map((comment) => ({
        ...comment,
        replies: comment.replies.filter((reply) => reply.id !== commentId),
      }));
    });
  };

  const handleCommentCreate = (comment: Comment, isReply: boolean) => {
    if (!isReply) {
      return setComments((prevComments) => [comment, ...prevComments]);
    }

    // Update the replies correctly
    return setComments((prevComments) =>
      prevComments.map(
        (c) =>
          c.id === comment.parentCommentId
            ? { ...c, replies: [comment, ...c.replies] } // Correctly spread and update replies
            : c // Return the comment unchanged
      )
    );
  };

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
        onCommentEdit={handleCommentEdit}
        onCommentDelete={handleCommentDelete}
        onCommentCreate={handleCommentCreate}
      />
    </Card>
  );
}
