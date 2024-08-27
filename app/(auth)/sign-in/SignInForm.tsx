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
import { signIn } from 'aws-amplify/auth'

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
      await signIn({
        username: email,
        password: password,
      })
      toast({
        title: "Success",
        description: "You signed in successfully",
      });
      router.push("/");
    } catch (error: any) {
      if(error instanceof Error){
        toast({
          title: "An Error occured!",
          description: error.message,
          variant: "destructive"
        })
      }else{
        toast({
          description: "An unknown error occured!",
          variant: "destructive"
        })
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
