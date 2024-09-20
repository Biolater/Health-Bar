import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[120px]" /> {/* Username skeleton */}
          <Skeleton className="h-3 w-[100px]" /> {/* Post date skeleton */}
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" /> {/* Content line 1 */}
        <Skeleton className="h-4 w-full mb-2" /> {/* Content line 2 */}
        <Skeleton className="h-4 w-2/3" /> {/* Content line 3 (shorter) */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Like icon skeleton */}
          <Skeleton className="h-4 w-[30px]" /> {/* Like count skeleton */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Comment icon skeleton */}
          <Skeleton className="h-4 w-[30px]" /> {/* Comment count skeleton */}
        </div>
      </CardFooter>
    </Card>
  );
}
