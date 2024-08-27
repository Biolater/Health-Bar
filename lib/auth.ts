import { signOut } from "aws-amplify/auth";

export const logout = async () => {
  await signOut();
};
