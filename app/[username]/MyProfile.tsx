import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const MyProfile: React.FC<{
  imageSrc: string;
  username: string;
  bio: string;
}> = ({ imageSrc, username, bio }) => {
  return (
    <main className="pt-9 pb-1">
      <div className="user-details w-full h-[200px] bg-primary rounded-lg relative">
        <Image
          width={55}
          height={55}
          src={imageSrc}
          alt="User photo"
          className="absolute left-3 -top-7 rounded-full border-background border-4"
        />
        <div className="edit-profile__button flex w-full justify-end p-3">
          <Button variant="secondary">Edit profile</Button>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <h1 className="text-2xl break-all font-bold text-white">
            {username}
          </h1>
          <p className="text-white">{bio}</p>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
