"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, type AuthUser } from 'aws-amplify/auth';
import outputs from "@/amplify_outputs.json"
import { Amplify } from 'aws-amplify'

Amplify.configure(outputs)

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const currentUser = await getCurrentUser();
        console.log(currentUser)
        if (currentUser) {
          setUser(currentUser);
        }
      }catch(error){
        setUser(null)
      }finally{
        setLoading(false);
      }
    };
    fetchUser();
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
