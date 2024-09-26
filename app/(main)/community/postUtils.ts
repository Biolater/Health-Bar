import { formatDistanceToNow } from "date-fns";

export interface PostProps {
  postId: string;
  profileImage: string;
  username: string;
  postDate: string;
  postContent: string;
  userId: string;
  media?: {
    type: "image" | "video";
    url: string;
  };
}

export const formatPostDate = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};