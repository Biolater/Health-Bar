import Link from "next/link";
import { Button } from "../ui/button";
import communityImg from "@/assets/community.jpg";
const Community = () => {
  return (
    <section id="community" className="py-8 px-4 sm:px-16 md:px-32">
      <div className="mx-auto max-w-7xl ">
        <h1 className="text-3xl md:text-5xl mb-8 md:mb-12 text-primary font-bold text-center">
          Join our community
        </h1>
        <div className="w-full banner-card flex p-8 sm:p-0 rounded-xl border-border border shadow-md bg-primary sm:rounded-xl">
          <div className="banner-card__body sm:px-4 flex flex-col items-center justify-center sm:py-12 lg:py-24 flex-grow basis-1/2 w-full">
            <p className="text-center text-white text-lg font-semibold mb-2">
              Join the community now!
            </p>
            <p className="text-center mb-4 text-sm md:text-base lg:max-w-sm lg:mx-auto text-white/80">
              Find support, motivation, and friendship in our growing health
              community.
            </p>
            <Link href="/community">
              <Button className="w-full" variant="secondary">
                Get started
              </Button>
            </Link>
          </div>
          <div
            style={{
              backgroundImage: `url(${communityImg.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="banner-card__image rounded-e-xl flex-grow basis-1/2 hidden w-full sm:block"
          />
        </div>
      </div>
    </section>
  );
};

export default Community;
