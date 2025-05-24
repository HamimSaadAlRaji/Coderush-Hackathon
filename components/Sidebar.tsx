"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdAccountCircle,
  MdDashboard,
  MdFormatListBulleted,
  MdChat,
} from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { FiHelpCircle } from "react-icons/fi";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // desktop breakpoint
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div className="flex flex-row">
      <div
        className={`fixed top-20 left-0 h-full bg-sky-50 z-50 shadow-2xl transition-all duration-300 ${
          isOpen ? "w-56" : "w-14"
        }`}
      >
        <nav
          className={`flex flex-col ${
            isOpen ? "p-4 pr-12 space-y-2" : "px-2 pt-14 space-y-6"
          }`}
        >
          {/* Section 1 - Dashboard */}
          <div
            className={`${
              isOpen ? "space-y-2 pb-4 border-b border-sky-200" : "space-y-6"
            }`}
          >
            <Link
              href="/dashboard"
              className={`flex items-center text-sky-800 hover:text-sky-600 hover:bg-white rounded-lg ${
                !isOpen ? "p-1.5 justify-center" : "p-2"
              } transition-all duration-300 relative group`}
              title="Dashboard"
            >
              <MdDashboard
                className={`transition-all duration-300 min-w-[24px] min-h-[24px] ${
                  isOpen ? "mr-2 text-xl" : "text-2xl"
                }`}
              />
              {!isOpen && (
                <div className="absolute left-full ml-4 scale-0 group-hover:scale-100 transition-all duration-300 origin-left">
                  <div className="bg-white text-sky-800 px-4 py-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium">
                    Dashboard
                  </div>
                </div>
              )}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {isOpen && "Dashboard"}
              </span>
            </Link>
          </div>

          {/* Section 2 - Listing & Orders */}
          <div
            className={`${
              isOpen ? "space-y-2 py-4 border-b border-sky-200" : "space-y-6"
            }`}
          >
            <Link
              href="/my-listings "
              className={`flex items-center text-sky-800 hover:text-sky-600 hover:bg-white rounded-lg ${
                !isOpen ? "p-1.5 justify-center" : "p-2"
              } transition-all duration-300 relative group`}
              title="My Listing"
            >
              <MdFormatListBulleted
                className={`transition-all duration-300 min-w-[24px] min-h-[24px] ${
                  isOpen ? "mr-2 text-xl" : "text-2xl"
                }`}
              />
              {!isOpen && (
                <div className="absolute left-full ml-4 scale-0 group-hover:scale-100 transition-all duration-300 origin-left">
                  <div className="bg-white text-sky-800 px-4 py-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium">
                    My Listing
                  </div>
                </div>
              )}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {isOpen && "My Listing"}
              </span>
            </Link>

            <Link
              href="/orders"
              className={`flex items-center text-sky-800 hover:text-sky-600 hover:bg-white rounded-lg ${
                !isOpen ? "p-1.5 justify-center" : "p-2"
              } transition-all duration-300 relative group`}
              title="My Orders"
            >
              <BsCart3
                className={`transition-all duration-300 min-w-[24px] min-h-[24px] ${
                  isOpen ? "mr-2 text-xl" : "text-2xl"
                }`}
              />
              {!isOpen && (
                <div className="absolute left-full ml-4 scale-0 group-hover:scale-100 transition-all duration-300 origin-left">
                  <div className="bg-white text-sky-800 px-4 py-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium">
                    My Orders
                  </div>
                </div>
              )}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {isOpen && "My Orders"}
              </span>
            </Link>
          </div>

          {/* Section 3 - My Chats */}
          <div
            className={`${
              isOpen ? "space-y-2 py-4 border-b border-sky-200" : "space-y-6"
            }`}
          >
            <Link
              href="/chat"
              className={`flex items-center text-sky-800 hover:text-sky-600 hover:bg-white rounded-lg ${
                !isOpen ? "p-1.5 justify-center" : "p-2"
              } transition-all duration-300 relative group`}
              title="My Chats"
            >
              <MdChat
                className={`transition-all duration-300 min-w-[24px] min-h-[24px] ${
                  isOpen ? "mr-2 text-xl" : "text-2xl"
                }`}
              />
              {!isOpen && (
                <div className="absolute left-full ml-4 scale-0 group-hover:scale-100 transition-all duration-300 origin-left">
                  <div className="bg-white text-sky-800 px-4 py-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium">
                    My Chats
                  </div>
                </div>
              )}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {isOpen && "My Chats"}
              </span>
            </Link>
          </div>

          {/* Section 4 - Account & FAQ */}
          <div className={`${isOpen ? "space-y-2 pt-4" : "space-y-6"}`}>
            <Link
              href="/account"
              className={`flex items-center text-sky-800 hover:text-sky-600 hover:bg-white rounded-lg ${
                !isOpen ? "p-1.5 justify-center" : "p-2"
              } transition-all duration-300 relative group`}
              title="Account"
            >
              <MdAccountCircle
                className={`transition-all duration-300 min-w-[24px] min-h-[24px] ${
                  isOpen ? "mr-2 text-xl" : "text-2xl"
                }`}
              />
              {!isOpen && (
                <div className="absolute left-full ml-4 scale-0 group-hover:scale-100 transition-all duration-300 origin-left">
                  <div className="bg-white text-sky-800 px-4 py-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium">
                    Account
                  </div>
                </div>
              )}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {isOpen && "Account"}
              </span>
            </Link>

            <Link
              href="/faq"
              className={`flex items-center text-sky-800 hover:text-sky-600 hover:bg-white rounded-lg ${
                !isOpen ? "p-1.5 justify-center" : "p-2"
              } transition-all duration-300 relative group`}
              title="Help & FAQ"
            >
              <FiHelpCircle
                className={`transition-all duration-300 min-w-[24px] min-h-[24px] ${
                  isOpen ? "mr-2 text-xl" : "text-2xl"
                }`}
              />
              {!isOpen && (
                <div className="absolute left-full ml-4 scale-0 group-hover:scale-100 transition-all duration-300 origin-left">
                  <div className="bg-white text-sky-800 px-4 py-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium whitespace-nowrap">
                    Help & FAQ
                  </div>
                </div>
              )}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {isOpen && "Help & FAQ"}
              </span>
            </Link>
          </div>
        </nav>

        <div className="absolute right-2 top-2">
          {!isOpen ? (
            <button
              onClick={toggleSidebar}
              className="text-sky-700 hover:text-sky-500 rounded-lg p-0.5"
            >
              <TbLayoutSidebarLeftExpandFilled className="text-2xl min-w-[24px] min-h-[24px]" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="text-sky-700 hover:text-sky-500 rounded-lg p-0.5"
            >
              <TbLayoutSidebarLeftCollapseFilled className="text-2xl min-w-[24px] min-h-[24px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
