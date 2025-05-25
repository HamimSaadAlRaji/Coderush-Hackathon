"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/NavbarComponents";
import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function Header() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // const navItems = [
  //   {
  //     name: "Features",
  //     link: "#features",
  //   },
  //   {
  //     name: "Pricing",
  //     link: "#pricing",
  //   },
  //   {
  //     name: "Contact",
  //     link: "#contact",
  //   },

  // ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleGetStarted = () => {
    if (!isSignedIn) {
      router.push("/post-sign-in");
    }
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          {/* <NavItems items={navItems} /> */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="redirect" forceRedirectUrl="/post-sign-in">
                <NavbarButton variant="primary">
                  Get Started
                </NavbarButton>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* ...existing mobile menu items... */}
            <div className="flex w-full flex-col gap-4">
              <SignedOut>
                <SignInButton mode="redirect" forceRedirectUrl="/post-sign-in">
                  <NavbarButton variant="primary" className="w-full">
                    Get Started
                  </NavbarButton>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
