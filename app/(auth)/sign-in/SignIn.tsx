import SignInForm from "./SignInForm";
import GoogleSignInButton from "./GoogleSignInButton";
// import { validateUsername } from "@/lib/utils";
import { JSX } from "react";

const SignInContent = () => {
  return (
    <>
      <GoogleSignInButton />
      <div className="my-5 text-sm text-muted-foreground h-[1px] w-full  bg-border signup-line relative">
        <div className="divider bg-background">or sign in with email</div>
      </div>
      <SignInForm />
    </>
  );
};

export default SignInContent;
