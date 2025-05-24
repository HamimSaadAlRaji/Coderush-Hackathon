"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for system/user preferred color scheme
  useEffect(() => {
    // Check if user prefers dark mode or has it set in localStorage
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <footer
      className={`relative w-full ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } py-12 mt-12 overflow-hidden transition-colors duration-300`}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`animate-float-${(i % 4) + 1} absolute w-${
              (i % 5) + 2
            } h-${(i % 5) + 2} ${
              isDarkMode ? "bg-white" : "bg-black"
            } opacity-${(i % 3) + 1}0 rounded-full`}
            style={{
              left: `${((i * 13) % 90) + 5}%`,
              top: `${((i * 17) % 70) + 10}%`,
              animationDelay: `${i * 0.7}s`,
              filter: `blur(${(i % 3) + 1}px)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {/* Company Info */}
          <div className="animate-fadeIn">
            <h3
              className={`text-xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Hackathon Components
            </h3>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } max-w-xs`}
            >
              Building the future of web components, one hackathon at a time.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://twitter.com"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-black"
                } transition-all hover:scale-110`}
              >
                <svg width="24" height="24" fill="currentColor">
                  <path d="M28 5.3a11.4 11.4 0 0 1-3.3.9A5.7 5.7 0 0 0 27.2 3a11.4 11.4 0 0 1-3.6 1.4A5.7 5.7 0 0 0 13.7 9a16.2 16.2 0 0 1-11.8-6A5.7 5.7 0 0 0 4 12.2a5.7 5.7 0 0 1-2.6-.7v.1a5.7 5.7 0 0 0 4.6 5.6 5.7 5.7 0 0 1-2.6.1 5.7 5.7 0 0 0 5.3 3.9A11.4 11.4 0 0 1 0 24.6a16.2 16.2 0 0 0 8.8 2.6c10.6 0 16.4-8.8 16.4-16.4v-.7A11.7 11.7 0 0 0 28 5.3z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-black"
                } transition-all hover:scale-110`}
              >
                <svg width="24" height="24" fill="currentColor">
                  <path d="M14 2C7 2 1.5 7.5 1.5 14c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 2.1 2.7 2.1.8-.6 1.2-1.2 1.4-1.7-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.4-2.7 5.4-5.3 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C23.1 23.8 26.5 19.3 26.5 14 26.5 7.5 21 2 14 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fadeIn animation-delay-200">
            <h3
              className={`text-xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Links
            </h3>
            <ul
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } space-y-2`}
            >
              {["Home", "About", "Features", "Pricing", "Contact"].map(
                (item, idx) => (
                  <li key={idx} className="hover-underline-animation">
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-fadeIn animation-delay-400">
            <h3
              className={`text-xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Stay Updated
            </h3>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mb-4`}
            >
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l focus:outline-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-r font-medium transition-transform hover:scale-105 ${
                  isDarkMode ? "bg-white text-gray-900" : "bg-black text-white"
                }`}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div
          className={`mt-12 pt-6 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          } text-center animate-fadeIn animation-delay-600`}
        >
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            &copy; {new Date().getFullYear()} CodeRush. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(15px);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-15px) translateX(-20px) scale(1.1);
          }
        }
        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) translateX(-15px) rotate(-5deg);
          }
        }

        .animate-float-1 {
          animation: float-1 6s infinite ease-in-out;
        }
        .animate-float-2 {
          animation: float-2 8s infinite ease-in-out;
        }
        .animate-float-3 {
          animation: float-3 9s infinite ease-in-out;
        }
        .animate-float-4 {
          animation: float-4 10s infinite ease-in-out;
        }

        .animate-fadeIn {
          animation: fadeIn 1s both;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hover-underline-animation {
          display: inline-block;
          position: relative;
        }

        .hover-underline-animation:after {
          content: "";
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom right;
          transition: transform 0.3s ease-out;
        }

        .hover-underline-animation:hover:after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
    </footer>
  );
}
