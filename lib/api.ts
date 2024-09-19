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
      throw new Error(errors[0].message);
    }

    // If data is available, return the first user in the list
    if (data && data.length > 0) {
      const { posts, ...userWithoutPosts } = data[0];
      const user = userWithoutPosts;
      return { user };
    }

    // Return null if no user is found
    return { user: null };
  } catch (error) {
    // Handle any other errors
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

async function getLoggedInUser() {
  const currentUser = await getCurrentUser();
  if (currentUser) return currentUser;
  throw new Error("You have to login to call this");
}

export { getUserByUsername, getLoggedInUser };
