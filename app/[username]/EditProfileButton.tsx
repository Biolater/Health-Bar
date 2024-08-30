"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const EditProfileButton = () => {
  const router = useRouter();
  const handleEditProfileClick = () => {
    router.push("/settings");
  };
  return (
    <div className="edit-profile__button flex w-full justify-end p-3">
      <Button onClick={handleEditProfileClick} variant="secondary">
        Edit profile
      </Button>
    </div>
  );
};

export default EditProfileButton;
