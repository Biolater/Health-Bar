import UserPost from "./UserPost";
import MyPost from "./MyPost";
const Community = () => {
  return (
    <main id="community" className="px-4 py-8 sm:px-16 md:px-32">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <h1 className="text-center text-3xl text-primary font-semibold">
          Community
        </h1>
        <div className="flex flex-wrap gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 10 }).map((_, i) =>
            i % 2 == 0 ? <MyPost key={i} /> : <UserPost key={i} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Community;
