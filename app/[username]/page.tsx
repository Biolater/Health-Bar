"use client";
import defaultImage from "@/assets/defaultProfileImg.png";
import { useAuth } from "@/contexts/AuthContext";
import { validateUsername } from "@/lib/utils";
import MyProfile from "./MyProfile";
import UserProfile from "./UserProfile";
import ProfileSkeleton from "./ProfileSkeleton";
import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
const Profile: React.FC<{ params: { username: string } }> = ({ params }) => {
  const client = generateClient<Schema>();
  const { user, loading, isLoggedIn } = useAuth();
  const [userDetails, setUserDetails] = useState<Schema["User"]["type"] | null>(
    null
  );

  // Loading state for when user checks a different page
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const userProfileOrMyProfile =
    validateUsername(user?.username || "") === params.username ? (
      <>
        {user && (
          <MyProfile
            username={params.username}
            bio={user?.bio || "No bio yet"}
            profilePicture={user?.profilePicture || defaultImage.src}
            joinDate={user.createdAt}
            email={user.email}
            location={user.location}
            pronouns={user.pronouns}
            websiteUrl={user.websiteUrl}
          />
        )}
      </>
    ) : (
      <>{userDetails && <UserProfile userDetails={userDetails} />}</>
    );
  const fetchUserDetails = async (username: string) => {
    try {
      const { data, errors } = await client.models.User.listUserByUsername(
        {
          username,
        },
        {
          authMode: "apiKey",
        }
      );
      if (errors && errors[0].message) throw new Error(errors[0].message);
      if (data.length > 0) {
        setUserDetails(data[0]);
        setUserDetailsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unkown error occured",
          variant: "destructive",
        });
      }
    }
  };
  useEffect(() => {
    // If user checking their own page set loading state to false if not fetch specific details for that page
    if (user && params.username === user.username) setUserDetailsLoading(false);
    if (!user) fetchUserDetails(params.username);
  }, []);
  return (
    <>
      {!isLoggedIn && (loading || userDetailsLoading) && <ProfileSkeleton />}
      {!loading && !userDetailsLoading && userProfileOrMyProfile}
    </>
  );
};

export default Profile;
