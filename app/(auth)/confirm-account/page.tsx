"use client";

import { confirmSignUp } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const ConfirmAccount = () => {
  const router = useRouter();
  const [emailForConfirmation, setEmailForConfirmation] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmationDone, setConfirmationDone] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("emailForConfirmation") || "";
    setEmailForConfirmation(email);
  }, []);

  useEffect(() => {
    if (confirmationDone) {
      localStorage.removeItem("emailForConfirmation");
    }
  }, [confirmationDone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmationLoading(true);
    if (confirmationCode.length < 6) {
      toast({
        title: "Error",
        description: "Confirmation code must be at least 6 characters long.",
        variant: "destructive",
        duration: 2000,
      });
      setConfirmationLoading(false);
      return;
    }
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: emailForConfirmation,
        confirmationCode,
      });
      if (isSignUpComplete) {
        setConfirmationDone(true);
        toast({
          title: "Success",
          description: "Your account has been confirmed!",
          duration: 2000,
        });
        router.push("/sign-in");
      }
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "An unknown Error occurred",
        variant: "destructive",
        duration: 2000,

      });
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailForConfirmation).then(() => {
      toast({
        title: "Copied",
        description: "Email address copied to clipboard",
        duration: 2000,
      });
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 h-svh flex flex-col gap-4 justify-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Confirm your account</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            We sent a code to {emailForConfirmation}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopyEmail}
            title="Copy email address"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input
          name="confirmationCode"
          type="number"
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Enter confirmation code"
          value={confirmationCode}
          required
        />
        <Button disabled={confirmationLoading} className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ConfirmAccount;
