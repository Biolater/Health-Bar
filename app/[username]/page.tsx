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
  const { user, loading } = useAuth();
  const fetchUserDetails = async () => {
    // const usersRef = collection(db, "users");
    // const q = query(usersRef, where("username", "==", params.username));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   setAdditionalUserDetails(doc.data() as UserDetails);
    // });
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  const userProfileOrMyProfile =
    validateUsername(user?.username || "") === params.username ? (
      <>
        {user && !loading && (
          <MyProfile
            username={params.username}
            bio={user.bio}
            imageSrc={defaultImage.src}
            joinDate={user.createdAt}
            email={user.email}
          />
        )}
      </>
    ) : (
      <UserProfile />
    );

  return (
    <>
      {!user && loading && <ProfileSkeleton />}
      {!loading && userProfileOrMyProfile}
    </>
  );
};

export default Profile;
