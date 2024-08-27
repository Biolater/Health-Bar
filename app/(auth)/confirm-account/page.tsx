"use client";
import { confirmSignUp } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
const ConfirmAccount = () => {
  const router = useRouter(); 
  const [emailForConfirmation, setEmailForConfirmation] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmationDone, setConfirmationDone] = useState(false)
  useEffect(() => {
    const email = localStorage.getItem("emailForConfirmation") || "";
    setEmailForConfirmation(email);
  }, []);
  useEffect(() => {
    if(confirmationDone){
      localStorage.removeItem("emailForConfirmation")
    }
  }, [confirmationDone])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const { isSignUpComplete } = await confirmSignUp({
        username: emailForConfirmation,
        confirmationCode,
      });
      if(isSignUpComplete){
        setConfirmationDone(true)
        toast({
          title: "Success",
          description: "Your account has confirmed!"
        })
        router.push("/sign-in")
      }
    }catch(error){
      console.log(error)
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="confirmationCode"
          type="text"
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Enter confirmation code"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ConfirmAccount;
