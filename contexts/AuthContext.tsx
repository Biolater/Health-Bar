"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import "aws-amplify/auth/enable-oauth-listener";
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { Hub } from "aws-amplify/utils";
import { type FetchUserAttributesOutput } from "aws-amplify/auth";

Amplify.configure(outputs);

type AuthContextType = {
  user: Schema["User"]["type"] | null;
  loading: boolean;
  isLoggedIn: boolean;
  userAttributes: FetchUserAttributesOutput | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  userAttributes: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const client = generateClient<Schema>();

  const [user, setUser] = useState<Schema["User"]["type"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAttributes, setUserAttributes] =
    useState<FetchUserAttributesOutput | null>(null);

  const fetchUser = async (userId: string) => {
    const { errors, data: user } = await client.models.User.get(
      { userId },
      { authMode: "apiKey" }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }
    return user;
  };

  const handleSignInWithRedirect = async (
    userId: string,
    username: string,
    email: string,
    profilePicture?: string
  ) => {
    try {
      // check if a user with that userId exists
      const { data } = await client.models.User.get(
        { userId },
        { authMode: "apiKey", selectionSet: ["userId"] }
      );
      // if user doesn't exist create a new user
      if (!data) {
        await client.models.User.create(
          { userId, userOwner: userId, username, email, profilePicture },
          { authMode: "apiKey" }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const currentUserAttributes = await fetchUserAttributes();
        if (currentUser) {
          const fetchedUser = await fetchUser(currentUser.userId);
          if (fetchedUser) {
            setUser(fetchedUser);
            setIsLoggedIn(true);
          } else if (
            currentUser &&
            currentUserAttributes.identities &&
            currentUserAttributes.email &&
            !user
          ) {
            const providerName = JSON.parse(currentUserAttributes.identities)[0]
              .providerName;
            const userId = currentUser.userId;
            const username =
              `${currentUserAttributes.nickname}_${userId}` ||
              currentUser.username;
            const email = currentUserAttributes.email;
            const profilePicture = currentUserAttributes.picture;
            if (providerName === "Google") {
              await handleSignInWithRedirect(
                userId,
                username,
                email,
                profilePicture
              );
              window.location.reload();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthEvents = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          // localStorage.setItem("aa", "31")
          // const onSignInWithRedirect = async () => {
          //   const user = await getCurrentUser();
          //   const { email } = await fetchUserAttributes();
          //   console.log(user, email);
          //   if (user && email) {
          //     await handleSignInWithRedirect(user.userId, user.username, email);
          //   }
          // };
          // onSignInWithRedirect();
          break;
        case "signInWithRedirect_failure":
          break;
        case "signedIn":
          setIsLoggedIn(true);
          const { userId } = payload.data;
          const fetchSignedinUser = async () => {
            const fetchedUser = await fetchUser(userId);
            if (fetchedUser) {
              setUser(fetchedUser);
            }
            setLoading(false);
          };
          fetchSignedinUser();
          break;
        case "signedOut":
          setIsLoggedIn(false);
          setUser(null);
          break;
        default:
          break;
      }
    });

    return () => handleAuthEvents();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, userAttributes }}>
      {children}
    </AuthContext.Provider>
  );
};
