import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "healthBarUsersDrive",
  isDefault: true,
  access: (allow) => ({
    // File path for user profile pictures
    "profile-pictures/{user_id}/*": [
      // Owner of the file (authenticated user) can read, write, and delete their own profile picture
      allow.entity("identity").to(["read", "write", "delete"]),

      // Authenticated users can read the profile pictures of others
      allow.authenticated.to(["read"]),

      // Guests can also read the profile pictures if required
      allow.guest.to(["read"]),
    ],
  }),
});
