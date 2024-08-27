"use client";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icons";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import SignInForm from "./SignInForm";
import { validateUsername } from "@/lib/utils";
const SignInContent = () => {
  const router = useRouter();

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const { user } = await signInWithPopup(auth, googleProvider);
  //     const username = validateUsername(user?.displayName || "");
  //     const email = user.email;
  //     const uid = user.uid;
  //     const bio = "No bio"
  //     const userRef = doc(db, "users", uid);

  //     const userSnapshot = await getDoc(userRef);

  //     if (!userSnapshot.exists()) {
  //       await setDoc(userRef, {
  //         email,
  //         username,
  //         uid,
  //         bio,
  //       });
  //     }

  //     toast({
  //       title: "Success",
  //       description: "You signed in successfully",
  //     });
  //     router.push("/");
  //   } catch (error: any) {
  //     console.error("Error during Google sign-in:", error);

  //     // 4. Handle Firebase and Custom Errors
  //     switch (error.code) {
  //       case "auth/account-exists-with-different-credential":
  //         toast({
  //           title: "Error",
  //           description:
  //             "You already have an account with this email. Please sign in with that provider.",
  //           variant: "destructive",
  //         });
  //         break;
  //       case "auth/popup-closed-by-user":
  //       case "auth/cancelled-popup-request":
  //         toast({
  //           title: "Sign-in Cancelled",
  //           description: "You cancelled the Google sign-in process.",
  //         });
  //         break;
  //       default:
  //         // Handle your custom errors here as well (e.g., "Email already in use")
  //         toast({
  //           title: "Error",
  //           description:
  //             error.message ||
  //             "An unexpected error occurred during sign-in. Please try again later.",
  //           variant: "destructive",
  //         });
  //     }
  //   }
  // };
  return (
    <>
      <Button
        // onClick={handleGoogleSignIn}
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
