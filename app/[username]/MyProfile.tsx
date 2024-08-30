import EditProfileButton from "./EditProfileButton";
import { Cake, Link, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import MetaDataItem from "./MetaDataItem";
import { formatTimestamp } from "@/lib/utils";

const MyProfile: React.FC<{
  imageSrc: string;
  username: string;
  bio: string;
  joinDate: string;
  email: string;
  websiteUrl: string | null;
  location: string | null;
  pronouns: string | null;
}> = ({
  imageSrc,
  username,
  bio,
  joinDate,
  email,
  websiteUrl,
  location,
  pronouns,
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
        <Image
          width={55}
          height={55}
          src={imageSrc}
          quality={100}
          alt="User photo"
          className="absolute sm:size-16 left-3 -top-7 md:-top-16 md:left-1/2 md:-translate-x-1/2 rounded-full md:size-28 border-background border-4"
        />
        <EditProfileButton />
        <div className="flex flex-col gap-2 py-4">
          <div className="flex flex-col gap-1 px-3 md:text-center">
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
        </div>
      </div>
    </main>
  );
};

export default MyProfile;