"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { HamburgerIcon } from "../Icons/index";
import { Search } from "lucide-react";
import HamburgerSidebarMenu from "./HamburgerSidebarMenu";
import SidebarOverlay from "./SidebarOverlay";
import UserProfileMenu from "./UserProfileMenu";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import NavLink from "./NavLink";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import defaultProfileImg from "@/assets/defaultProfileImg.png"
interface AUTH_BUTTON {
  label: string;
  href: string;
  variant:
    | "ghost"
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | null
    | undefined;
}

const AUTH_BUTTONS: AUTH_BUTTON[] = [
  {
    label: "Sign In",
    href: "/sign-in",
    variant: "ghost",
  },
  {
    label: "Sign Up",
    href: "/sign-up",
    variant: "secondary",
  },
];
const Navbar = () => {
  const pathName = usePathname();
  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Diseases & Conditions",
      href: "/diseases-conditions",
    },
    {
      label: "Symptom Checker",
      href: "/symptom-checker",
    },
    {
      label: "News",
      href: "/news",
    },
    {
      label: "Community",
      href: "/community",
    },
  ];
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownMenuOpen, setUserDropdownMenuOpen] = useState(false);
  const handleSidebarOpen = () => {
    setSidebarOpen(true);
    document.body.style.overflow = "hidden";
  };
  const handleSidebarClose = () => {
    setSidebarOpen(false);
    document.body.style.overflow = "auto";
  };
  const handleAvatarClick = () => {
    setUserDropdownMenuOpen((prev) => !prev);
  };
  const handleEscClick = () => {
    setUserDropdownMenuOpen(false);
  };
  return (
    <header className="main-header z-[60] sticky top-0 py-2 px-4 bg-primary text-primary-foreground">
      <div className="flex mx-auto max-w-7xl items-center justify-between">
        <AnimatePresence>
          {sidebarOpen && <HamburgerSidebarMenu onClose={handleSidebarClose} />}
        </AnimatePresence>
        <AnimatePresence>{sidebarOpen && <SidebarOverlay />}</AnimatePresence>
        <AnimatePresence>
          {userDropdownMenuOpen && (
            <UserProfileMenu handleEscClick={handleEscClick} />
          )}
        </AnimatePresence>
        <Link href="/">
          <Image
            quality={100}
            priority
            src={Logo}
            alt="Health Bar Logo"
            width={40}
            height={40}
          />
        </Link>
        <div className={`hidden lg:flex items-center gap-3`}>
          {navLinks.map((link) => (
            <NavLink
              isActive={pathName === link.href}
              label={link.label}
              href={link.href}
              key={link.href}
            />
          ))}
        </div>
        <div className="main-header__right flex items-center gap-2 sm:gap-3 md:gap-4">
          {!loading && user && (
            <>
              {/* <div className="relative group/searchbar">
                <div className="absolute z-10 left-[5px] size-4 top-1/2 -translate-y-1/2">
                  <Search className="w-full h-full group-hover/searchbar:stroke-primary transition-all" />
                </div>
                <Input
                  className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground pe-4 ps-6 py-2 relative h-8 justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none w-44 sm:w-56 lg:w-64"
                  placeholder="Search for diseases, symptoms, or articles"
                  title="Search for diseases, symptoms, or articles"
                />
              </div> */}
              <button onClick={handleAvatarClick}>
                <Avatar className="block text-foreground cursor-pointer">
                  <AvatarImage
                    src={user?.photoURL || defaultProfileImg.src}
                    alt={user?.displayName || "Profile avatar"}
                  />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
              </button>
            </>
          )}
          {!loading &&
            !user &&
            AUTH_BUTTONS.map((button) => (
              <Link href={button.href} key={button.label}>
                <Button key={button.label} variant={button.variant}>
                  {button.label}
                </Button>
              </Link>
            ))}
          {loading && (
            <Skeleton className="size-10 rounded-full bg-secondary/60" />
          )}
          {!loading && (
            <button
              className="cursor-pointer lg:hidden"
              onClick={handleSidebarOpen}
            >
              <HamburgerIcon />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
