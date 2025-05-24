import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import ClientLayout from "../ClientLayout";

const Rootlayout = async ({ children }: { children: ReactNode }) => {
  // Authenticate Check Here
  return (
    <div className="root-layout">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default Rootlayout;
