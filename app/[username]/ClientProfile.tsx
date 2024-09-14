"use client";

import MyProfile from "./MyProfile";
import UserProfile from "./UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import defaultImage from "@/assets/defaultProfileImg.png";
import { type Schema } from "@/amplify/data/resource";
import ProfileSkeleton from "./ProfileSkeleton";

const ClientProfile: React.FC<{
  username: string;
  userDetails: Schema["User"]["type"];
}> = ({ username, userDetails }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <ProfileSkeleton />; // or any skeleton/loading state
  }

  // Check if the logged-in user is viewing their own profile
  if (user && user.username === username) {
    return (
      <MyProfile
        username={user.username}
        bio={user.bio || "No bio yet"}
        profilePicture={user.profilePicture || defaultImage.src}
        joinDate={user.createdAt}
        email={user.email}
        location={user.location}
        pronouns={user.pronouns}
        websiteUrl={user.websiteUrl}
      />
    );
  }

  return <UserProfile userDetails={userDetails} />;
};

export default ClientProfile;
