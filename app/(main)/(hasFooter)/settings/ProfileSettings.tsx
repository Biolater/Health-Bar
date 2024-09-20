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
import {
  updateUserAttribute,
  type UpdateUserAttributeOutput,
} from "aws-amplify/auth";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import defaultImg from "@/assets/defaultProfileImg.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
const USER_SETTING_INPUTS = [
  {
    label: "Username",
    name: "username",
    type: "text",
    value: "",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    value: "",
  },
  {
    label: "Bio",
    name: "bio",
    type: "text",
    value: "",
  },
  {
    label: "Location",
    name: "location",
    type: "text",
    value: "",
    placeholder: "San Francisco, CA",
  },
  {
    label: "Website",
    name: "websiteUrl",
    type: "text",
    value: "",
    placeholder: "https://example.com",
  },
  {
    label: "Pronouns",
    name: "pronouns",
    type: "text",
    value: "",
    placeholder: "they/them",
  },
];
const ProfileSettings = () => {
  const router = useRouter();
  function handleUpdateUserAttributeNextSteps(
    output: UpdateUserAttributeOutput
  ) {
    const { nextStep } = output;
    setUserAttributeUpdateDetails(output);
    
    switch (nextStep.updateAttributeStep) {
      case "CONFIRM_ATTRIBUTE_WITH_CODE":
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        toast({
          title: "Confirmation Code",
          description: `Please enter the code sent to ${codeDeliveryDetails?.destination}.`,
          variant: "default",
        });
        router.push("/confirm-user-attribute");
        break;
      case "DONE":
        toast({
          title: "Success",
          description: "User attribute updated.",
        });
        break;
    }
  }
  async function handleUpdateUserAttribute(
    attributeKey: string,
    value: string
  ) {
    try {
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value,
        },
      });
      handleUpdateUserAttributeNextSteps(output);
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
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    }
  }
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

  const [userSettingInputs, setUserSettingInputs] = useState<
    typeof USER_SETTING_INPUTS | null
  >(null);
  const [userUpdatedTrigger, setUserUpdatedTrigger] = useState(false);
  const [userUpdateLoading, setUserUpdateLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [userAttributeUpdateDetails, setUserAttributeUpdateDetails] =
    useState<UpdateUserAttributeOutput | null>(null);
  const onSubmit = async (values: z.infer<typeof userSettingsSchema>) => {
    const { username, email, bio, location, websiteUrl, pronouns } = values;
    let emailTimeoutId;
    try {
      setUserUpdateLoading(true);
      if (user) {
        const { errors, data: updatedUser } = await client.models.User.update({
          userId: user.userId,
          username: username || user.username,
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
        if (email !== user.email) {
          emailTimeoutId = setTimeout(async() => {
          }, 1000)
          setPendingEmail(email)
          await handleUpdateUserAttribute("email", email);  
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
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
  useEffect(() => {
    const codeDelivery =
      userAttributeUpdateDetails?.nextStep?.codeDeliveryDetails;
    if (
      userAttributeUpdateDetails &&
      codeDelivery &&
      codeDelivery.attributeName
    ) {
      localStorage.setItem("updatedAttribute", codeDelivery.attributeName);
    }
  }, [userAttributeUpdateDetails]);
  useEffect(() => {
    if(pendingEmail) localStorage.setItem("pendingEmail", pendingEmail)
  }, [pendingEmail])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg bg-primary md:basis-3/4"
    >
      <h2 className="text-white text-3xl font-bold mb-2">User</h2>
      <div className="flex flex-col mb-1 gap-1 text-center">
        <div className="size-36 cursor-pointer relative  transition-all duration-200 rounded-full self-center">
          <Image
            priority
            className="rounded-full object-cover cursor-pointer size-36"
            alt={`${user?.username}'s profile picture`}
            src={user?.profilePicture || defaultImg.src}
            width={144}
            height={144}
          />
          <div className="absolute group/profile-pen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full flex items-center justify-center hover:bg-black/40 cursor-pointer transition-colors duration-300 rounded-full">
            <Pen className="group-hover/profile-pen:opacity-100 stroke-white opacity-0 transition-all duration-300" />
            <CldUploadWidget
              options={{
                multiple: false,
                sources: ["local", "url", "camera"],
              }}
              uploadPreset="healthbar"
              onSuccess={(results) => {
                const handleProfilePicUpload = async (url: string) => {
                  try {
                    if (user) {
                      const { errors, data: updatedUser } =
                        await client.models.User.update({
                          userId: user.userId,
                          profilePicture: url.toString(),
                        });
                      if (errors && errors[0].message) {
                        throw new Error(errors[0].message);
                      }
                      if (updatedUser) {
                        toast({
                          title: "Success",
                          description: "Profile picture successfully updated",
                        });
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                };
                if (results.info && typeof results.info === "object") {
                  const info: CloudinaryUploadWidgetInfo = results.info;
                  handleProfilePicUpload(info.secure_url);
                }
              }}
            >
              {({ open }) => {
                return (
                  <button
                    className="w-full h-full opacity-0 absolute"
                    onClick={() => open()}
                  >
                    Upload an Image
                  </button>
                );
              }}
            </CldUploadWidget>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          className="gap-4 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          <Button
            disabled={userUpdateLoading}
            type="submit"
            className="w-full md:w-auto self-end"
            variant="secondary"
          >
            Save Settings
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default ProfileSettings;
