import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { getCurrentUser } from "aws-amplify/auth";

// Configure Amplify
Amplify.configure(outputs);

const client = generateClient<Schema>();
async function getUserByUsername(username: string) {
  try {
    // Fetch user data by username
    const { data, errors } = await client.models.User.listUserByUsername({
      username,
    });

    // Handle errors from the API response
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message); // Throw first error message
    }

    // If no data or empty array, return null for user
    if (!data || data.length === 0) {
      return { user: null };
    }

    // Return user without posts, assuming 'posts' needs to be excluded
    const { posts, ...userWithoutPosts } = data[0];

    return { user: userWithoutPosts }; // Return user object without posts
  } catch (error) {
    // Handle errors gracefully and throw them to the caller
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

async function getLoggedInUser() {
  const currentUser = await getCurrentUser();
  if (currentUser) return currentUser;
  throw new Error("You have to login to call this");
}

async function getAllPosts(): Promise<{ posts: Schema["Post"]["type"][] }> {
  try {
    const { data, errors } = await client.models.Post.list({
      authMode: "apiKey",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message); // Throw the first error message
    }

    return { posts: data || [] }; // Always return an array, even if it's empty
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occured"
    );
  }
}

async function deletePost(postId: string) {
  try {
    const { errors } = await client.models.Post.delete(
      {
        id: postId,
      },
      {
        authMode: "userPool",
      }
    );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message); // Throw the first error message
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occured"
    );
  }
}

async function updatePostContent(postId: string, newContent: string) {
  try {
    const { errors } = await client.models.Post.update(
      {
        id: postId,
        content: newContent,
      },
      {
        authMode: "userPool",
      }
    );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message); // Throw the first error message
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occured"
    );
  }
}

async function toggleLike(
  postId: string,
  userId: string,
  action: "like" | "dislike"
) {
  try {
    if (action === "like") {
      const existingLike = await client.models.Like.get(
        {
          postId,
          userId,
        },
        {
          authMode: "userPool",
        }
      );
      if (!existingLike?.data) {
        const { errors } = await client.models.Like.create(
          { postId, userId },
          { authMode: "userPool" }
        );
        if (errors && errors.length > 0) {
          throw new Error(errors[0].message); // Specific error handling for create
        }
      }
    } else {
      const { errors } = await client.models.Like.delete(
        {
          postId,
          userId,
        },
        { authMode: "userPool" }
      );
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message); // Specific error handling for delete
      }
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occured"
    );
  }
}

export {
  getUserByUsername,
  getLoggedInUser,
  getAllPosts,
  deletePost,
  updatePostContent,
  toggleLike,
};
