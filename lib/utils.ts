import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function validateUsername(username: string): string {
  function sanitizeUsername(username: string): string {
    // 1. Remove spaces
    let sanitizedUsername = username.replace(/\s+/g, "_");
  
    // 2. Ensure minimum length
    if (sanitizedUsername.length < 3) {
      sanitizedUsername += "_"; // Add underscores until it's at least 3 characters long
    }
    return sanitizedUsername;
  }
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  if(!usernameRegex.test(username)) {
    return sanitizeUsername(username);
  }else{
    return username
  }
}



export { cn, validateUsername };
