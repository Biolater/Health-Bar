import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      userId: a.id().required(),
      username: a.string().required(),
      email: a.email().required(),
      bio: a.string().default("No bio yet"),
      websiteUrl: a.url(),
      userOwner: a.id().required(),
      location: a.string(),
      pronouns: a.string(),
      profilePicture: a.string(),
      posts: a.hasMany("Post", "userId"),
      comments: a.hasMany("Comment", "userId"),
    })
    .identifier(["userId"])
    .secondaryIndexes((index) => [index("username")])
    .authorization((allow) => [
      allow.publicApiKey().to(["read", "create"]),
      allow.guest().to(["read", "create"]),
      allow.ownerDefinedIn("userOwner"),
    ]),
  Post: a
    .model({
      content: a.string().required(),
      likesCount: a
        .integer()
        .default(0)
        .authorization((allow) => [
          allow.publicApiKey().to(["read"]),
          allow.authenticated().to(["read", "update"]),
          allow.guest().to(["read"]),
          allow.ownerDefinedIn("postOwner"),
        ]),
      likes: a.hasMany("Like", "postId"),
      comments: a.hasMany("Comment", "postId"),
      commentsCount: a
        .integer()
        .default(0)
        .authorization((allow) => [
          allow.publicApiKey().to(["read"]),
          allow.authenticated().to(["read", "update"]),
          allow.guest().to(["read"]),
          allow.ownerDefinedIn("postOwner"),
        ]),
      postOwner: a.id().required(),
      userId: a.id().required(),
      media: a.customType({
        type: a.string().required(),
        url: a.url().required(),
      }),
      user: a.belongsTo("User", "userId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.ownerDefinedIn("postOwner"),
    ]),
  Like: a
    .model({
      postId: a.id().required(),
      likeOwner: a.id().required(),
      userId: a.id().required(),
      post: a.belongsTo("Post", "postId"),
    })
    .identifier(["postId", "userId"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.guest().to(["read"]),
      allow.authenticated().to(["read", "create"]),
      allow.ownerDefinedIn("likeOwner").to(["read", "create", "delete"]),
    ]),
  Comment: a
    .model({
      content: a.string().required(),
      postId: a.id().required(),
      userId: a.id().required(),
      commentOwner: a.id().required(),
      parentCommentId: a.id(),
      post: a.belongsTo("Post", "postId"),
      user: a.belongsTo("User", "userId"),
      replies: a.hasMany("Comment", "parentCommentId"),
      parentComment: a.belongsTo("Comment", "parentCommentId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.guest().to(["read"]),
      allow.authenticated().to(["read", "create"]),
      allow.ownerDefinedIn("commentOwner"),
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
