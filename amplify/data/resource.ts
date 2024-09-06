import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      userId: a.id().required(),
      username: a.string().required(),
      email: a.email().required(),
      bio: a.string().default("No bio yet"),
      websiteUrl: a.url(),
      location: a.string(),
      pronouns: a.string(),
      profilePicture: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey(),
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
