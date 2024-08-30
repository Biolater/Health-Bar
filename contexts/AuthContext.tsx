"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, type AuthUser } from "aws-amplify/auth";
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { Hub } from "aws-amplify/utils";

Amplify.configure(outputs);

interface User {
  createdAt: string;
  email: string;
  username: string;
  userId: string;
  bio: "No bio yet" | string;
  websiteUrl: string | null;
  location: string | null;
  pronouns: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const client = generateClient<Schema>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUsers = async (userId: string) => {
    const { errors, data: users } = await client.models.User.list({
      authMode: "apiKey",
    });

    if (errors) {
      throw new Error(errors[0].message);
    }
    if (users) {
      const user = users.filter((user) => user.userId === userId);
      console.log(user)
      return user;
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const user = await fetchUsers(currentUser.userId);
          if (Array.isArray(user) && user.length > 0) {
            setUser(user[0]);
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          const { userId } = payload.data;
          const fetchUser = async () => {
            const user = await fetchUsers(userId);
            if (Array.isArray(user) && user.length > 0) {
              setUser(user[0]);
            }
            setLoading(false);
          };
          fetchUser();
          break;
        case "signedOut":
          setUser(null);
          break;
        default:
          break;
      }
    });
    return () => hubListenerCancelToken();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
