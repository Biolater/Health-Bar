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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
const Settings = () => {
  const { user } = useAuth();
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
      type: "text",
      value: user?.username,
    },
    {
      label: "Email",
      type: "email",
      value: user?.email,
    },
    {
      label: "Bio",
      type: "text",
      value: user?.bio,
    },
    {
      label: "Location",
      type: "text",
      value: user?.location,
    },
    {
      label: "Website",
      type: "text",
      value: user?.websiteUrl,
    },
    {
      label: "Pronouns",
      type: "text",
      value: user?.pronouns,
    },
  ];
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
        <div className="flex p-4 rounded-lg flex-col gap-4 bg-primary">
          <h2 className="text-white text-3xl font-bold">User</h2>
          {USER_SETTING_INPUTS.map((input) => (
            <div
              className="grid w-full max-w-sm items-center gap-1.5"
              key={input.label}
            >
              <Label className="text-white">{input.label}</Label>
              <Input
                className="text-white"
                type={input.type}
                value={input.value || ""}
              />
            </div>
          ))}
          <Button variant="secondary">Save Settings</Button>
        </div>
      </div>
    </main>
  );
};

export default Settings;
