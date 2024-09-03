"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
const Settings = () => {
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
  const SELECT_ITEMS = [
    {
      value: "profile",
      text: "Profile",
    },
    {
      value: "account",
      text: "Account",
    },
  ];
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
          throw new Error(errors[0].message)
        }
        if (updatedUser) {
          toast({
            title: "Success",
            description: "User successfully updated",
          })
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
  return (
    <main id="settings" className="py-4 sm:px-16 md:px-32">
      <div className="flex flex-col gap-4">
        <div className="px-4">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={SELECT_ITEMS[0].text} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{SELECT_ITEMS[0].text}</SelectLabel>
                {SELECT_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.text}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-4 rounded-lg bg-primary">
          <h2 className="text-white text-3xl font-bold">User</h2>
          <Form {...form}>

            <form
              className="gap-4 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {userSettingInputs &&
                userSettingInputs.map((input) => (
                  <FormField
                    control={form.control}
                    name={
                      input.name as keyof z.infer<typeof userSettingsSchema>
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          {input.label}
                        </FormLabel>
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
              <Button className="w-full" variant="secondary">
                Save Settings
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Settings;
