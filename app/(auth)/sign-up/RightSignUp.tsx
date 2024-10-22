"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import SignUpForm from "./SignupForm";
import GoogleSignInButton from "../sign-in/GoogleSignInButton";
const RightSignUp = () => {
  const [continueWithEmail, setContinueWithEmail] = useState(false);
  const handleContinueWithEmail = () => {
    setContinueWithEmail(true);
  };
  const handleGoBack = () => {
    setContinueWithEmail(false);
  };
  return (
    <div className="max-w-md w-full mx-auto lg:ml-6 xl:ms-36 px-4  flex justify-center flex-col min-h-svh overflow-y-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-8">
        Sign up to Health Bar
      </h1>
      {!continueWithEmail ? (
        <div className="flex flex-col">
          <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
          <div className="my-5 text-sm text-muted-foreground h-[1px] w-full  bg-border signup-line relative">
            <div className="divider bg-background">or</div>
          </div>
          <Button onClick={handleContinueWithEmail} className="h-10">
            Continue with email
          </Button>
        </div>
      ) : (
        <SignUpForm onGoBack={handleGoBack} />
      )}
      <p className="text-sm mt-4 text-muted-foreground text-center">
        Already have an account?
        <Link href="/sign-in" className="ms-1">
          <Button className="p-0" variant={"link"}>
            Sign In
          </Button>
        </Link>
      </p>
    </div>
  );
};

export default RightSignUp;
