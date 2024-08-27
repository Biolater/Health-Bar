"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
const SidebarOverlay = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  return (
    isMounted &&
    createPortal(
      <motion.div
        transition={{ duration: 0.3, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="sidebar__overlay fixed z-[9998] w-full h-screen top-0 left-0 right-0 bottom-0 bg-black/80"
      ></motion.div>,
      document.body
    )
  );
};

export default SidebarOverlay;
