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

import PostInner from "./PostInner";

const Post: React.FC<{ postId: string }> = async ({ postId }) => {
  const { data } = await getPostDetails(postId);
  if (!data.isFound) notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <PostInner data={data} />
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
