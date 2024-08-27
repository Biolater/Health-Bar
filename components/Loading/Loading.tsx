"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { InfinitySpin } from "react-loader-spinner";

const Loading = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return (
    mounted &&
    createPortal(
      <div className="loading inset-0 bg-black fixed z-50 w-[100vw] h-[100vh] flex items-center justify-center">
        <InfinitySpin width="200" color="hsl(var(--primary))" />
      </div>,
      document.body
    )
  );
};

export default Loading;
