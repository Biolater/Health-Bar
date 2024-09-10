import { Metadata } from "next";
import SettingsContent from "./SettingsContent";
export const metadata: Metadata = {
  title: "Settings",
};
const Settings = () => {
  return <SettingsContent />;
};

export default Settings;
