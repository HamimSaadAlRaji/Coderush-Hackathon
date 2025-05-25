"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { TbShoppingBag, TbSettings } from "react-icons/tb";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userId) {
        try {
          const response = await fetch('/api/users');
          const data = await response.json();
          if (data.success && data.user && (data.user.role === 'admin' || data.user.role === 'superadmin')) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();
  }, [userId]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title (leftmost) */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg"
            >
              <TbShoppingBag className="text-white text-xl" />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">Campus হাট</h1>
              <span className="text-xs text-gray-500 -mt-1">
                Student Marketplace
              </span>
            </div>
          </Link>          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <TbSettings className="text-lg" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            )}
          </div>

          {/* User Button */}
          <div className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                  userButtonPopoverActionButton: "hover:bg-gray-50",
                },
              }}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
