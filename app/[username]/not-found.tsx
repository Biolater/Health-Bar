import { UserRoundX } from "lucide-react";
import React from "react";

const UserProfileNotFound = () => {
  return (
    <main className="w-full h-[calc(100svh-4rem)] flex flex-col gap-2 items-center justify-center">
      <UserRoundX className="size-24 stroke-primary" />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Couldn't find this account</h1>
        <p className="text-sm text-muted-foreground">
          The account you are looking for does not exist
        </p>
      </div>
    </main>
  );
};

export default UserProfileNotFound;
