"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from "@/components/index";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
const SettingsContent = () => {
  const { loading } = useAuth();
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
  const [selectValue, setSelectValue] = useState("profile");
  const handleSelectValueChange = (value: string) => {
    setSelectValue(value);
  };

  return loading ? (
    <Loading />
  ) : (
    <main
      id="settings"
      className="py-4 max-w-7xl mx-auto w-full sm:px-16 md:px-32"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="px-4 sm:p-0 md:basis-1/4">
          <Select onValueChange={handleSelectValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={SELECT_ITEMS[0].text} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SELECT_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.text}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {selectValue === "profile" && <ProfileSettings />}
        {selectValue === "account" && <AccountSettings />}
      </div>
    </main>
  );
};

export default SettingsContent;
