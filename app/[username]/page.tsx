"use client";
import defaultImage from "@/assets/defaultProfileImg.png";
import { useAuth } from "@/contexts/AuthContext";
import { validateUsername } from "@/lib/utils";
import MyProfile from "./MyProfile";
import UserProfile from "./UserProfile";
import { useEffect, useState } from "react";
import UserDetails from "@/types/userDetails";
const Profile: React.FC<{ params: { username: string } }> = ({ params }) => {
  const { user } = useAuth();
  const [additionalUserDetails, setAdditionalUserDetails] =
    useState<UserDetails>({} as UserDetails);
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
    validateUsername(user?.displayName || "") === params.username ? (
      <MyProfile
        username={params.username}
        bio={additionalUserDetails.bio}
        imageSrc={user?.photoURL || defaultImage.src}
      />
    ) : (
      <UserProfile />
    );
  return userProfileOrMyProfile;
};

export default Profile;
