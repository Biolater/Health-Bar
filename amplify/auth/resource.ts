import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("LOGINWITHGOOGLE_CLIENT_ID"),
        clientSecret: secret("LOGINWITHGOOGLE_CLIENT_SECRET"),
        scopes: ["profile", "email", "openid"],
      },
      callbackUrls: [
        "http://localhost:3000",
        "https://main.dt7psbukvsr7k.amplifyapp.com",
      ],
      logoutUrls: [
        "http://localhost:3000",
        "https://main.dt7psbukvsr7k.amplifyapp.com",
      ],
    },
  },
});
