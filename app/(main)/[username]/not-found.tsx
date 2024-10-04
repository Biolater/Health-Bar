"use client";

import React from "react";
import { UserX, Home, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserProfileNotFound() {
  return (
    <main className="w-full min-h-[calc(100svh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          <UserX className="size-32 text-primary mb-6" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">User Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Oops! The user profile you're looking for doesn't seem to exist. They
          may have changed their username or deleted their account.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button asChild className="flex-1">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/search/users">
              <Search className="mr-2 size-4" />
              Find Users
            </Link>
          </Button>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 text-sm text-muted-foreground"
      >
        If you believe this is an error, please contact our support team.
      </motion.p>
    </main>
  );
}
