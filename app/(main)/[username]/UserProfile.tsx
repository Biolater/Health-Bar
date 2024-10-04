"use client";
import { type Schema } from "@/amplify/data/resource";
import Image from "next/image";
import defaultImg from "@/assets/defaultProfileImg.png";
import { Separator } from "@radix-ui/react-separator";
import MetaDataItem from "./MetaDataItem";
import { formatTimestamp } from "@/lib/utils";
import { Cake, Link, Mail, MapPin } from "lucide-react";
const UserProfile: React.FC<{
  userDetails: Omit<Schema["User"]["type"], "posts">;
}> = ({ userDetails }) => {
  const META_DATA = [
    {
      title: "Join date",
      value: `Joined on ${formatTimestamp(userDetails.createdAt)}`,
      icon: <Cake />,
    },
    {
      title: "Email",
      value: userDetails.email,
      icon: <Mail />,
      isLink: true,
      link: `mailto:${userDetails.email}`,
    },
    ...(userDetails.location
      ? [
          {
            title: "Location",
            value: userDetails.location,
            icon: <MapPin />,
          },
        ]
      : []),
    ...(userDetails.websiteUrl
      ? [
          {
            title: "Personal website",
            value: userDetails.websiteUrl,
            icon: <Link />,
            isLink: true,
            link: userDetails.websiteUrl,
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
            alt={`${userDetails.username}'s profile picture`}
            src={userDetails?.profilePicture || defaultImg.src}
            fill
            sizes="(100vw - 4rem) 20rem, 18rem"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col pt-4 gap-1 px-3 md:text-center">
            <h1 className="text-2xl sm:text-3xl break-all font-bold mt-11 text-white">
              {userDetails?.username}
            </h1>
            <p className="text-white sm:text-lg">{userDetails.bio}</p>
          </div>
          <div className="flex flex-wrap px-3 md:justify-center">
            {META_DATA.map((item, index) => (
              <MetaDataItem key={index} {...item} />
            ))}
          </div>
          <Separator className="shrink-0 bg-border h-[1px] w-full" />
          <div className="w-full h-full pb-2 flex flex-col px-3 md:items-center md:justify-center">
            <p className="text-sm text-muted">Pronouns</p>
            <p className="text-white">
              {userDetails?.pronouns ?? "No pronouns yet"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
