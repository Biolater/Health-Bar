"use client";
import defaultImage from "@/assets/defaultProfileImg.png";
import { useAuth } from "@/contexts/AuthContext";
import { validateUsername } from "@/lib/utils";
import MyProfile from "./MyProfile";
import UserProfile from "./UserProfile";
import ProfileSkeleton from "./ProfileSkeleton";
import { useEffect, useState } from "react";
import UserDetails from "@/types/userDetails";
const Profile: React.FC<{ params: { username: string } }> = ({ params }) => {
  const { user, loading, isLoggedIn } = useAuth();
  const userProfileOrMyProfile =
    validateUsername(user?.username || "") === params.username ? (
      <>
        {user && (
          <MyProfile
            username={params.username}
            bio={user?.bio || "No bio yet"}
            imageSrc={defaultImage.src}
            joinDate={user.createdAt}
            email={user.email}
            location={user.location}
            pronouns={user.pronouns}
            websiteUrl={user.websiteUrl}
          />
        )}
      </> 
    ) : (
      <UserProfile />
    );

  return (
    <>
      {!isLoggedIn && loading && <ProfileSkeleton />}
      {!loading && userProfileOrMyProfile}
    </>
  );
};

export default Profile;
