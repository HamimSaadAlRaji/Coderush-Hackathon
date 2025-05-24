import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import ClientLayout from "../ClientLayout";
import Navbar from "@/components/Navbar";

const Rootlayout = async ({ children }: { children: ReactNode }) => {
  // Authenticate Check Here
  return (
    <div className="min-h-screen flex flex-col p-3">
      <Navbar />
      <main className="flex-1">
        <ClientLayout>{children}</ClientLayout>
      </main>
    </div>
  );
};

export default Rootlayout;
