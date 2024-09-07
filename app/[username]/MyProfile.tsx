import EditProfileButton from "./EditProfileButton";
import { Cake, Link, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import MetaDataItem from "./MetaDataItem";
import { formatTimestamp } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
const MyProfile: React.FC<{
  username: string;
  bio: string;
  joinDate: string;
  email: string;
  websiteUrl: string | null;
  location: string | null;
  pronouns: string | null;
  profilePicture: string;
}> = ({
  username,
  bio,
  joinDate,
  email,
  websiteUrl,
  location,
  pronouns,
  profilePicture,
}) => {
  const META_DATA = [
    {
      title: "Join date",
      value: `Joined on ${formatTimestamp(joinDate)}`,
      icon: <Cake />,
    },
    {
      title: "Email",
      value: email,
      icon: <Mail />,
      isLink: true,
      link: `mailto:${email}`,
    },
    ...(location
      ? [
          {
            title: "Location",
            value: location,
            icon: <MapPin />,
          },
        ]
      : []),
    ...(websiteUrl
      ? [
          {
            title: "Personal website",
            value: websiteUrl,
            icon: <Link />,
            isLink: true,
            link: websiteUrl,
          },
        ]
      : []),
  ];
  return (
    <main className="pt-9 md:px-4 lg:px-16 xl:px-32 md:pt-20 pb-1">
      <div className="user-details max-w-7xl mx-auto w-full bg-primary rounded-lg relative">
        <div className="absolute size-14 sm:size-16 md:size-28 left-3 -top-7 md:-top-16 md:left-1/2 md:-translate-x-1/2">
          <Image
            priority
            className=" object-cover rounded-full  border-background border-4"
            alt={`${username}'s profile picture`}
            src={profilePicture}
            fill
            sizes="(100vw - 4rem) 20rem, 18rem"
          />
        </div>
        <EditProfileButton />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col pt-4 gap-1 px-3 md:text-center">
            <h1 className="text-2xl sm:text-3xl break-all font-bold text-white">
              {username}
            </h1>
            <p className="text-white sm:text-lg">{bio}</p>
          </div>
          <div className="flex flex-wrap px-3 md:justify-center">
            {META_DATA.map((item, index) => (
              <MetaDataItem key={index} {...item} />
            ))}
          </div>
          <Separator />
          <div className="w-full h-full pb-2 flex flex-col px-3 md:items-center md:justify-center">
            <p className="text-sm text-muted">Pronouns</p>
            <p className="text-white">{pronouns ?? "No pronouns yet"}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
