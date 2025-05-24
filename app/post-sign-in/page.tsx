"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function PostSignIn() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    const role = user?.publicMetadata?.role;

    if (!role) {
      user?.update({ unsafeMetadata: { role: "user" } }).then(() => {
        router.replace("/all-listings");
      });
      return;
    }

    if (role === "admin") {
      router.replace("/admin-dashboard");
    } else {
      router.replace("/all-listings");
    }
  }, [user, isLoaded, router]);

  return <div>Redirecting...</div>;
}
