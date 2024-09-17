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

const UserPost = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            alt="User's profile picture"
            src="/placeholder-avatar.jpg"
          />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">Username</p>
          <p className="text-xs text-muted-foreground">
            Posted on April 20, 2023
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This is a sample post content. It can be a longer text describing the
          user's thoughts, experiences, or any other content they want to share
          with their followers or friends.
        </p>
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
