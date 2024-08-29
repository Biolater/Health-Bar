import { Button } from "@/components/ui/button";
import { Cake, Link, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import MetaDataItem from "./MetaDataItem";


const META_DATA = [
  {
    title: "Join date",
    value: "Joined on 01/01/2023",
    icon: <Cake />,
    isLink: false,
  },
  {
    title: "Email",
    value: "john.doe@example.com",
    icon: <Mail />,
    isLink: true,
    link: "mailto:john.doe@example.com",
  },
  {
    title: "Location",
    value: "Lagos, Nigeria",
    icon: <MapPin />,
    isLink: false,
  },
  {
    title: "Personal website",
    value: "https://john.doe.com",
    icon: <Link />,
    isLink: true,
    link: "https://john.doe.com",
  }
]

const MyProfile: React.FC<{
  imageSrc: string;
  username: string;
  bio: string;
  joinDate: string;
}> = ({ imageSrc, username, bio, joinDate }) => {
  return (
    <main className="pt-9 pb-1">
      <div className="user-details w-full bg-primary rounded-lg relative">
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
        <div className="flex flex-wrap p-3">
          {META_DATA.map((item, index) => (
            <MetaDataItem key={index} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
