import ProfileSkeleton from "./ProfileSkeleton";
import { getUserByUsername } from "@/lib/api";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ClientProfile from "./ClientProfile";

const Profile: React.FC<{ params: { username: string } }> = async ({
  params,
}) => {
  const { username } = params;

  // Await fetching the user data and current user data
  const { user } = await getUserByUsername(username);
  // If no user is found, return a 404 page
  if (!user) {
    return notFound();
  }

  // Return the appropriate profile component
  return <ClientProfile username={username} userDetails={user} />;
};

const ProfileWithSkeleton: React.FC<{ params: { username: string } }> = ({
  params,
}) => {
  // Wrap the Profile component with Suspense to display the loading skeleton
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile params={params} />
    </Suspense>
  );
};

export default ProfileWithSkeleton;
