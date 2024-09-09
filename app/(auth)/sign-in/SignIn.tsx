import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icons";
import SignInForm from "./SignInForm";
// import { validateUsername } from "@/lib/utils";
const SignInContent = () => {

  return (
    <>
      <Button
        variant={"outline"}
        className="flex items-center gap-2 w-full h-10"
      >
        <GoogleIcon />
        Sign in with Google
      </Button>
      <div className="my-5 text-sm text-muted-foreground h-[1px] w-full  bg-border signup-line relative">
        <div className="divider">or sign in with email</div>
      </div>
      <SignInForm />
    </>
  );
};

export default SignInContent;
