"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { Hub } from "aws-amplify/utils";
import {
  fetchUserAttributes,
  type FetchUserAttributesOutput,
} from "aws-amplify/auth";

Amplify.configure(outputs);

interface User {
  userId: string;
  username: string;
  email: string;
  bio: string | null;
  websiteUrl: string | null;
  location: string | null;
  pronouns: string | null;
  profilePicture: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
}

type AuthContextType = {
  user: User | null;
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

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAttributes, setUserAttributes] =
    useState<FetchUserAttributesOutput | null>(null);

  const fetchUsers = async (userId: string) => {
    const { errors, data: users } = await client.models.User.list({
      authMode: "apiKey",
    });

    if (errors) {
      throw new Error(errors[0].message);
    }
    return users?.filter((user) => user.userId === userId) || [];
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const fetchedUsers = await fetchUsers(currentUser.userId);
          if (fetchedUsers.length > 0) {
            setUser(fetchedUsers[0]);
            setIsLoggedIn(true);
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
        case "signedIn":
          setIsLoggedIn(true);
          const { userId } = payload.data;
          const fetchUser = async () => {
            const fetchedUsers = await fetchUsers(userId);
            if (fetchedUsers.length > 0) {
              setUser(fetchedUsers[0]);
            }
            setLoading(false);
          };
          fetchUser();
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
