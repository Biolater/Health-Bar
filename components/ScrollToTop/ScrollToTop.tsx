"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const ScrollToTop: React.FC<ButtonProps> = ({
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "bg-secondary text-secondary-foreground border border-border shadow-lg fixed bottom-4 right-4 p-3 z-50 rounded-full",
            className
          )}
        >
          <ChevronUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
