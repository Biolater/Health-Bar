"use client";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";
const AiLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[75%] flex flex-col gap-2 bg-secondary h-full w-full me-auto px-3 py-2 rounded-lg"
    >
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Skeleton className="w-full h-[20px]" />
      </motion.div>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Skeleton className="w-full h-[20px]" />
      </motion.div>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "70%" }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Skeleton className="w-full h-[20px]" />
      </motion.div>
    </motion.div>
  );
};

export default AiLoading;
