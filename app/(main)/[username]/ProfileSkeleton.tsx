import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full mt-8 max-w-3xl mx-auto p-6 bg-primary text-primary-foreground rounded-lg shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="w-24 h-24 bg-secondary/60 rounded-full" />
        <Skeleton className="h-8 w-48 bg-secondary/60" />
        <Skeleton className="h-4 w-32 bg-secondary/60" />
        <div className="flex space-x-2 items-center">
          <Skeleton className="h-4 w-4 bg-secondary/60" />
          <Skeleton className="h-4 w-32 bg-secondary/60" />
        </div>
        <div className="flex space-x-2 items-center">
          <Skeleton className="h-4 w-4 bg-secondary/60" />
          <Skeleton className="h-4 w-48 bg-secondary/60" />
        </div>
        <div className="w-full pt-4">
          <Skeleton className="h-4 w-24 mb-2 bg-secondary/60" />
          <Skeleton className="h-4 w-32 bg-secondary/60" />
        </div>
      </div>
    </div>
  );
}
