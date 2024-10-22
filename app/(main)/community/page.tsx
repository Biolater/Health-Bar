import CreatePostDialog from "./CreatePost";
import Posts from "./Posts";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Healthbar | Community",
};
const Community = () => {
  return (
    <main id="community" className="px-4 py-8 sm:px-16 md:px-32 relative">
      <div className="mx-auto max-w-[38rem] flex flex-col gap-6">
        <h1 className="text-center text-3xl text-primary font-semibold">
          Community
        </h1>
        <div className="flex flex-wrap gap-4 max-w-4xl w-full mx-auto">
          <Posts />
        </div>
      </div>
      <CreatePostDialog />
    </main>
  );
};

export default Community;
