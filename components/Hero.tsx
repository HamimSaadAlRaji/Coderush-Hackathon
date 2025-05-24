"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden bg-white dark:bg-gray-900 py-24 sm:py-32"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-70"></div>

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 opacity-10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-10 left-20 w-60 h-60 bg-blue-300 dark:bg-blue-800 opacity-10 rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="mb-2 inline-block">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 animate-pulse">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-500"></span>
                Now Available
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
              Transform Student{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-shimmer">
                  Trading
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full"></span>
              </span>{" "}
              with Our Marketplace
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-600 dark:text-gray-300 max-w-2xl transition-all duration-1000 delay-300 ease-in-out">
              Join a student-only marketplace designed for secure buying,
              selling, and skill exchange within trusted campus communities
            </p>
            <div className="flex flex-wrap gap-4 transition-all duration-1000 delay-500 ease-in-out">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transform hover:scale-105 transition-all duration-300">
                Get Started
              </button>
              <button className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium transform hover:scale-105 transition-all duration-300">
                View Components
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 transition-all duration-1000 delay-700 ease-in-out">
              <div className="flex -space-x-2">
                <Image
                  src="https://scontent.fdac2-1.fna.fbcdn.net/v/t39.30808-1/434551686_1575643826557251_2894847690793064110_n.jpg?stp=c271.170.429.428a_dst-jpg_s428x428_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEljXkLkgGD6R3kersUVbpqELfDMyTNBe8Qt8MzJM0F7yZYYxoOrPevSxv9yOIVUn-x6HKIiaelDQUifkCQESpY&_nc_ohc=ulgFOrqeaYIQ7kNvwExA6dr&_nc_oc=AdmGYN4ip90eureZgTtLgyPYKez5hhxeQfUB_TxudNk-VDdChNNfcwvPCUEokfMsg7M&_nc_zt=24&_nc_ht=scontent.fdac2-1.fna&_nc_gid=K1VX7HfIQqHBpWOn0avsDA&oh=00_AfJEvZ8Y6PFyCGjcJ26HiQBmMzEiEso4yt1zhiuOmvyPbw&oe=68373F7E"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white dark:border-gray-900"
                />
                <Image
                  src="https://scontent.fdac2-2.fna.fbcdn.net/v/t39.30808-6/494676732_1719271838676073_9176152075671512278_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHbsUBy6KerBRxddf7VINb09xue0h0kfu73G57SHSR-7n8O9QS9L8Siv2yPXWN8A4iPvZGE3uZpQFrOzWgmVbG4&_nc_ohc=n1hNr4kBqZ8Q7kNvwHp2Yxu&_nc_oc=AdlROdfRWGccPYa5_jm1SurGErDLEg1KPVwKo66pDeMTMO6eUC4PqzHci_LLpaCSSA8&_nc_zt=23&_nc_ht=scontent.fdac2-2.fna&_nc_gid=hZPWr-6ll-ImukQ-iPls6w&oh=00_AfIMxJIDmgR-ocMiIKgSKSWfuQOY_DSYaIc4ufYtqvlhbw&oe=683727A6"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white dark:border-gray-900"
                />
                <Image
                  src="https://scontent.fdac2-2.fna.fbcdn.net/v/t39.30808-1/473711139_580222511441183_3280579709863055323_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFG1JxTHRWInhQX6CevoN2yo64Dta0U2RyjrgO1rRTZHA0w_tH9_Fl3xLYGKRGZyuOTYYGxsLW284jb7WecyeZB&_nc_ohc=D1g1w4JCgXAQ7kNvwEsm4IZ&_nc_oc=Adnc5MuRbkVRb6RHAZuKrt0B-17jJS_RQybLtQ8pYsyi3IVvfdZrqXIo0TS2vGyo9EM&_nc_zt=24&_nc_ht=scontent.fdac2-2.fna&_nc_gid=JYj9yOZzJMvmd4fbzt1Ogg&oh=00_AfJ6M2LarkZqWt1A3gSIvq3VwdB3mycBg-lhRL1bUxAChQ&oe=68374232"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white dark:border-gray-900"
                />
              </div>
              <span>
                Trusted by{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  1,000+
                </span>{" "}
                Students
              </span>
            </div>
          </div>

          {/* Right Side - Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white dark:from-gray-800 dark:to-gray-700"></div>
              <div className="relative h-full w-full transform transition-transform duration-500 hover:scale-105">
                <Image
                  src=""
                  alt="Dashboard Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "";
                  }}
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-6 right-6 w-28 h-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg animate-float-slow p-2 flex items-center justify-center font-medium text-sm text-green-600 dark:text-green-400">
                + 24% Growth
              </div>
              <div className="absolute bottom-6 left-6 w-32 h-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg animate-float-medium p-2 flex items-center justify-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium">Trade Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes shimmer {
          from {
            background-position: 0% 50%;
          }
          to {
            background-position: 100% 50%;
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
