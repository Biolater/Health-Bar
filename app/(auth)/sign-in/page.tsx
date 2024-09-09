import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import SignInContent from "./SignIn"
export const metadata: Metadata = {
  title: "Sign In",
};

const SignIn = () => {
  return (
    <div className="max-w-md w-full mx-auto px-4  flex justify-center flex-col min-h-svh overflow-y-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-8">
        Sign in to Health Bar
      </h1>
      <SignInContent />
      <p className="text-sm mt-4 text-muted-foreground text-center">
        Dont have an account?
        <Link href="/sign-up" className="ms-1">
          <Button className="p-0" variant={"link"}>
            Sign Up
          </Button>
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
