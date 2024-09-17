"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icons";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import SignUpForm from "./SignupForm";
import { useRouter } from "next/navigation";
import { validateUsername } from "@/lib/utils";
const RightSignUp = () => {
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      // const { user } = await signInWithPopup(auth, googleProvider);

      // Check if user already exists in Firestore
      // const userRef = doc(db, "users", user.uid);
      // const userDoc = await getDoc(userRef);

      // if (!userDoc.exists()) {
      //   // New user - create a document in Firestore
      //   let username = validateUsername(user?.displayName || "");
      //   const email = user.email;
      //   const uid = user.uid;
      //   const bio = "No bio"
      //   await setDoc(userRef, {
      //     email,
      //     username,
      //     uid,
      //     bio,
      //   });
      // }

      toast({
        title: "Success",
        description: "You signed in successfully",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);

      // Centralized error handling with a switch statement
      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          toast({
            title: "Error",
            description:
              "You already have an account with this email. Please sign in with that provider.",
            variant: "destructive",
          });
          break;
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          toast({
            title: "Sign-in Cancelled",
            description: "You cancelled the Google sign-in process.",
          });
          break;
        default:
          toast({
            title: "Error",
            description: error.code,
            variant: "destructive",
          });
      }
    }
  };
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
          <Button
            onClick={handleGoogleSignIn}
            variant={"outline"}
            className="flex items-center gap-2 w-full h-10"
          >
            <GoogleIcon />
            Sign up with Google
          </Button>
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
