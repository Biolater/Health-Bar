"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icons";
import { signInWithRedirect } from "aws-amplify/auth";
import React from "react";

const GoogleSignInButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handleGoogleSignIn = async () => {
    await signInWithRedirect({ provider: "Google" });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant={"outline"}
      className="flex items-center gap-2 w-full h-10"
    >
      <GoogleIcon />
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
