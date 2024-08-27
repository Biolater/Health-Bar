"use client";
import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import {
  Bell,
  CircleUserRound,
  Cog,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { validateUsername } from "@/lib/utils";
type Props = {
  handleEscClick: () => void;
};

const UserProfileMenu: React.FC<Props> = ({ handleEscClick }) => {
  const [isMounted, setIsMounted] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth()
  const { toast } = useToast();
  const router = useRouter();
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node)
    ) {
      handleEscClick();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    setIsMounted(true);
    return () => {
      document.removeEventListener("click", handleOutsideClick);

      setIsMounted(false);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleEscClick();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleEscClick]);
  const handleLogOut = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have successfully logged out.",
      });
      router.push("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  };
  const MENU_ITEMS = [
    {
      text: "Profile",
      icon: <CircleUserRound />,
      link: `/${validateUsername(user?.displayName || "")}`,
    },
    {
      text: "Notifications",
      icon: <Bell />,
      link: "/notifications",
    },
    {
      text: "Settings",
      icon: <Cog />,
      link: "/settings",
    },
    {
      text: "Messages",
      icon: <MessageCircle />,
      link: "/messages",
    },
  ];

  const BOTTOM_MENU_ITEMS = [
    {
      text: "Log out",
      action: async () => {
        await handleLogOut();
        handleEscClick();
      },
      icon: <LogOut />,
    },
  ];
  return (
    isMounted &&
    createPortal(
      <motion.div
        ref={profileMenuRef}
        initial={{ y: -10, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -10, opacity: 0, scale: 0.95 }}
        className="user-profile__menu origin-top block fixed z-[9999] top-14 right-4"
      >
        <div className="min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md w-56">
          <div className="px-3 py-2.5 text-sm font-semibold">
            <span>My Account</span>
          </div>
          <Separator />
          <div className="p-1 text-sm">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className="flex items-center gap-2 transition-colors px-2 py-1.5 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <span>{item.icon}</span>
                {item.text}
              </Link>
            ))}
          </div>
          <Separator />
          <div className="p-1 text-sm">
            {BOTTOM_MENU_ITEMS.map((item) => (
              <div
                onClick={item.action}
                key={item.text}
                className="flex items-center gap-2 cursor-pointer transition-colors px-2 py-1.5 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </motion.div>,
      document.body
    )
  );
};

export default UserProfileMenu;
