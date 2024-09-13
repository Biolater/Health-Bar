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

const ConfirmUserAttribute = () => {
  const client = generateClient<Schema>();
  const { user } = useAuth();

  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [userAttributeKey, setUserAttributeKey] =
    useState<AuthVerifiableAttributeKey | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [userEmailConfirmed, setUserEmailConfirmed] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    async function handleConfirmUserAttribute({
      userAttributeKey,
      confirmationCode,
    }: ConfirmUserAttributeInput) {
      try {
        await confirmUserAttribute({ userAttributeKey, confirmationCode });
        await updateUserEmail(pendingEmail!);
        setUserEmailConfirmed(true);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
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
        const { errors, data } = await client.models.User.update({
          id: user.id,
          email,
        });
        if (errors && errors[0].message) {
          throw new Error(errors[0].message);
        }
        console.log(data);
        toast({
          title: "Success",
          description: userAttributeKey
            ? `${
                userAttributeKey[0].toUpperCase() + userAttributeKey.slice(1)
              } confirmed`
            : "",
        });
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unknown error occurred",
            variant: "destructive",
          });
        }
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
    <main className="w-full h-svh flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setConfirmationCode(e.target.value)}
          value={confirmationCode || ""}
          type="text"
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default ConfirmUserAttribute;
