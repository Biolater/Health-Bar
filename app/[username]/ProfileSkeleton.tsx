import { Skeleton } from "@/components/ui/skeleton";
const ProfileSkeleton = () => {
  const widthsForMetaItems = ["w-36", "w-28", "w-48", "w-40"];
  return (
    <main className="pt-9 md:px-4 lg:px-16 xl:px-32 md:pt-20 pb-1">
      <div className="user-details max-w-7xl mx-auto w-full bg-primary rounded-lg relative">
        <Skeleton className="absolute bg-secondary/60 size-14 sm:size-16 left-3 -top-7 md:-top-16 md:left-1/2 md:-translate-x-1/2 rounded-full md:size-28 border-background border-4" />
        <div className="flex w-full justify-end p-3">
          <Skeleton className="w-28 h-9 rounded-lg bg-secondary/60" />
        </div>
        <div className="flex flex-col gap-2 py-4">
          <div className="flex flex-col gap-2 px-3 md:items-center">
            <Skeleton className="w-28 h-8 sm:h-9 bg-secondary/60" />
            <Skeleton className="w-32 bg-secondary/60 h-6" />
          </div>
          <div className="flex flex-wrap gap-2 px-3 md:justify-center">
            {widthsForMetaItems.map((width, idx) => (
              <Skeleton key={idx} className={`bg-secondary/60 ${width} h-6`} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSkeleton;
