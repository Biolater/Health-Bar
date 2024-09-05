"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { Pen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSettingsSchema } from "@/schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
const ProfileSettings = () => {
  const client = generateClient<Schema>();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      location: "",
      websiteUrl: "",
      pronouns: "",
    },
  });
  const USER_SETTING_INPUTS = [
    {
      label: "Username",
      name: "username",
      type: "text",
      value: user?.username || "",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      value: user?.email || "",
    },
    {
      label: "Bio",
      name: "bio",
      type: "text",
      value: user?.bio || "",
    },
    {
      label: "Location",
      name: "location",
      type: "text",
      value: user?.location || "",
      placeholder: "San Francisco, CA",
    },
    {
      label: "Website",
      name: "websiteUrl",
      type: "text",
      value: user?.websiteUrl || "",
      placeholder: "https://example.com",
    },
    {
      label: "Pronouns",
      name: "pronouns",
      type: "text",
      value: user?.pronouns || "",
      placeholder: "they/them",
    },
  ];
  const [userSettingInputs, setUserSettingInputs] = useState<
    typeof USER_SETTING_INPUTS | null
  >(null);
  const [userUpdatedTrigger, setUserUpdatedTrigger] = useState(false);
  const onSubmit = async (values: z.infer<typeof userSettingsSchema>) => {
    const { username, email, bio, location, websiteUrl, pronouns } = values;
    try {
      if (user) {
        const { errors, data: updatedUser } = await client.models.User.update({
          id: user.id,
          username: username || user.username,
          email: email || user.email,
          bio: bio || user.bio,
          location: location || user.location,
          websiteUrl: websiteUrl || user.websiteUrl,
          pronouns: pronouns || user.pronouns,
        });
        if (errors) {
          throw new Error(errors[0].message);
        }
        if (updatedUser) {
          setUserUpdatedTrigger(true);
          toast({
            title: "Success",
            description: "User successfully updated",
          });
        }
      }
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
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }
  };
  useEffect(() => {
    if (user && !userSettingInputs) {
      setUserSettingInputs(USER_SETTING_INPUTS);
    }
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        bio: user.bio ?? "No bio yet",
        location: user.location ?? "",
        websiteUrl: user.websiteUrl ?? "",
        pronouns: user.pronouns ?? "",
      });
    }
  }, [user, form]);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (userUpdatedTrigger) {
      timeoutId = setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userUpdatedTrigger]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg bg-primary md:basis-3/4"
    >
      <h2 className="text-white text-3xl font-bold mb-2">User</h2>
      <Form {...form}>
        <form
          className="gap-4 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="size-36 relative bg-red-500 hover:bg-red-600 transition-all duration-200 rounded-full self-center">
            <div className="absolute group/profile-pen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full flex items-center justify-center hover:bg-black/60 cursor-pointer transition-colors duration-300 rounded-full">
              <Pen className="group-hover/profile-pen:opacity-100 opacity-0 transition-all duration-300" />
              <Input type="file" className="w-full h-full absolute opacity-0" />
            </div>
          </div>
          {userSettingInputs &&
            userSettingInputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name as keyof z.infer<typeof userSettingsSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{input.label}</FormLabel>
                    <FormControl>
                      <Input
                        className="text-white placeholder:text-white/60"
                        placeholder={input.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <Button className="w-full md:w-auto self-end" variant="secondary">
            Save Settings
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default ProfileSettings;
