import { notFound } from "next/navigation";
import { getPostDetails } from "@/lib/api";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultImage from "@/assets/defaultProfileImg.png";
import { fallbackNameGenerator } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

const Post: React.FC<{ postId: string }> = async ({ postId }) => {
  const { data } = await getPostDetails(postId);
  if (!data.isFound) notFound();
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={data?.user?.profilePicture || defaultImage.src}
              alt={data?.user?.username || "Profile Picture"}
            />
            <AvatarFallback>
              {fallbackNameGenerator(data.user?.username || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {data?.user?.username || ""}
            </h2>
            <p className="text-sm text-muted-foreground">
              {data.postDetails?.createdAt
                ? new Date(data.postDetails.createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base">{data.postDetails?.content}</p>
          {data.postDetails?.media &&
            data.postDetails.media.type === "image" && (
              <div className="relative w-full h-[400px]">
                <Image
                  src={data.postDetails.media.url}
                  alt="Post image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>{data.postDetails?.likesCount} Likes</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>{data.postDetails?.commentsCount} Comments</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

const PostSkeleton: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-pulse">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-64 w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
};

const PostWithSkeleton: React.FC<{ params: { postId: string } }> = ({
  params,
}) => {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <Post postId={params.postId} />
    </Suspense>
  );
};

export default PostWithSkeleton;
