"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Conditionally render Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className={`w-full transition-all duration-300 ${
          isOpen &&
          isMounted &&
          typeof window !== "undefined" &&
          window.innerWidth >= 768
            ? "pl-56"
            : "pl-8"
        }`}
      >
        {children}
      </main>
    </>
  );
}
