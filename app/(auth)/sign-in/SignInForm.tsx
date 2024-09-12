"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInFormSchema } from "@/schema";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, confirmSignIn } from "aws-amplify/auth";

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { nextStep } = await signIn({
        username: email,
        password: password,
      });

      // Handle different next steps after sign-in
      switch (nextStep.signInStep) {
        case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
          toast({
            title: "New Password Required",
            description: "Please set a new password.",
            variant: "destructive",
          });
          break;

        case "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE":
          toast({
            title: "Custom Challenge",
            description: "Please complete the custom challenge.",
            variant: "destructive",
          });
          break;

        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
          toast({
            title: "TOTP Code Required",
            description: "Please enter your TOTP code.",
            variant: "destructive",
          });
          break;

        case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
          toast({
            title: "TOTP Setup Required",
            description: "Please complete the TOTP setup process.",
            variant: "destructive",
          });
          break;

        case "CONFIRM_SIGN_IN_WITH_SMS_CODE":
          toast({
            title: "SMS Code Required",
            description: "Please enter the SMS code sent to your phone.",
            variant: "destructive",
          });
          break;

        case "CONTINUE_SIGN_IN_WITH_MFA_SELECTION":
          toast({
            title: "MFA Required",
            description: "Please select your mode of MFA verification.",
            variant: "destructive",
          });
          break;

        case "RESET_PASSWORD":
          toast({
            title: "Reset Password Required",
            description: "Please reset your password before logging in.",
            variant: "destructive",
          });
          break;

        case "CONFIRM_SIGN_UP":
          toast({
            title: "Account Confirmation Required",
            description:
              "Please confirm your account via the confirmation email.",
            variant: "destructive",
          });
          router.push("/confirm-account");
          break;

        case "DONE":
          toast({
            title: "Success",
            description: "You signed in successfully",
          });
          router.push("/");
          break;

        default:
          toast({
            title: "Unexpected Error",
            description: "An unexpected error occurred during sign-in.",
            variant: "destructive",
          });
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast({
          title: "An Error Occurred!",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: "An unknown error occurred!",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          handleSignIn(values.email, values.password);
        })}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} className="w-full" type="submit">
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
