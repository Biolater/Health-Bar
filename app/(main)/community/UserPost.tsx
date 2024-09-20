import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { myPostProps as userPostProps } from "./MyPost";

const UserPost: React.FC<userPostProps> = ({
  profileImage,
  username,
  postId,
  postDate,
  postContent,
  likeCount,
  commentCount,
}) => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage alt="Your profile picture" src={profileImage} />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{username}</p>
          <p className="text-xs text-muted-foreground">
            {/* Posted on April 20, 2023 */}
            Posted on {postDate}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{postContent}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Heart className="w-4 h-4 mr-2" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircle className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserPost;
