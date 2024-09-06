import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "healthBarUsersDrive",
  isDefault: true,
  access: (allow) => ({
    "profile-pictures/*": [
      allow.authenticated.to(["read"]),
      allow.guest.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
