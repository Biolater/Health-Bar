import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePasswordFormSchema } from "@/schema";
import { updatePassword } from "aws-amplify/auth";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";

const UPDATE_PASSWORD_INPUTS = [
  {
    label: "Current Password",
    name: "currentPassword",
    type: "password",
  },
  {
    label: "New Password",
    name: "newPassword",
    type: "password",
  },
  {
    label: "Confirm New Password",
    name: "confirmPassword",
    type: "password",
  },
];

const AccountSettings = () => {
  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (values: z.infer<typeof updatePasswordFormSchema>) => {
    const { currentPassword, newPassword } = values;
    const oldPassword = currentPassword;
    const handleUpdatePassword = async () => {
      try{
        await updatePassword({
          oldPassword,
          newPassword,
        });
        toast({
          title: "Success",
          description: "Password successfully updated",
        })
        redirect('/')
      }catch(error){
        if(error instanceof Error){
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          })
        }else{
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive"
          })
        }
      }
    }
    handleUpdatePassword()
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg bg-primary md:basis-3/4"
    >
      <h2 className="text-white text-3xl font-bold mb-2">Update Password</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {UPDATE_PASSWORD_INPUTS.map((item, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={item.name as keyof z.infer<typeof updatePasswordFormSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{item.label}</FormLabel>
                  <FormControl>
                    <Input
                      className="text-white placeholder:text-white/60"
                      type={item.type}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            // disabled={userUpdateLoading}
            type="submit"
            className="w-full md:w-auto self-end"
            variant="secondary"
          >
            Update Password
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default AccountSettings;
