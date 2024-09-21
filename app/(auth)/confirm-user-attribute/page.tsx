"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmUserAttribute,
  type ConfirmUserAttributeInput,
} from "aws-amplify/auth";
import { type AuthVerifiableAttributeKey } from "@aws-amplify/core/internals/utils";
import { toast } from "@/components/ui/use-toast";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ConfirmUserAttribute = () => {
  const client = generateClient<Schema>();
  const { user } = useAuth();

  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [userAttributeKey, setUserAttributeKey] =
    useState<AuthVerifiableAttributeKey | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [userEmailConfirmed, setUserEmailConfirmed] = useState(false);
  const [emailConfirming, setEmailConfirming] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    async function handleConfirmUserAttribute({
      userAttributeKey,
      confirmationCode,
    }: ConfirmUserAttributeInput) {
      try {
        setEmailConfirming(true);
        await confirmUserAttribute({ userAttributeKey, confirmationCode });
        await updateUserEmail(pendingEmail!);
        setUserEmailConfirmed(true);
        setEmailConfirming(false);
      } catch (error) {
        setEmailConfirming(false);
        toast({
          description:
            error instanceof Error ? error.message : "An unknown Error occured",
          variant: "destructive",
        });
      }
    }
    if (confirmationCode && userAttributeKey) {
      await handleConfirmUserAttribute({
        userAttributeKey,
        confirmationCode,
      });
    } else {
      toast({
        title: "Error",
        description: "User attribute not confirmed",
        variant: "destructive",
      });
    }
  };

  const updateUserEmail = async (email: string) => {
    if (user) {
      try {
        const { errors } = await client.models.User.update({
          userId: user.userId,
          email,
        });
        if (errors && errors[0].message) {
          throw new Error(errors[0].message);
        }
        toast({
          title: "Success",
          description: userAttributeKey
            ? `${
                userAttributeKey[0].toUpperCase() + userAttributeKey.slice(1)
              } confirmed`
            : "",
        });
      } catch (err) {
        toast({
          description: err instanceof Error ? err.message : "An unknown Error occured",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const userAttributeKey = localStorage.getItem("updatedAttribute");
    const pendingEmail = localStorage.getItem("pendingEmail");
    if (pendingEmail) setPendingEmail(pendingEmail);
    if (userAttributeKey)
      setUserAttributeKey(userAttributeKey as AuthVerifiableAttributeKey);
  }, []);

  useEffect(() => {
    if (userEmailConfirmed) {
      localStorage.removeItem("updatedAttribute");
      localStorage.removeItem("pendingEmail");
      window.location.reload();
      router.push("/");
    }
  }, [userEmailConfirmed]);

  return (
    <main className="w-full max-w-lg mx-auto p-4 h-svh flex flex-col gap-4 justify-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Confirm your new email</h1>
        <p>We sent a code to your new email</p>
      </div>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setConfirmationCode(e.target.value)}
          value={confirmationCode || ""}
          type="text"
          required
        />
        <Button disabled={emailConfirming} className="w-full text-white" type="submit">
          Submit
        </Button>
      </form>
    </main>
  );
};

export default ConfirmUserAttribute;
