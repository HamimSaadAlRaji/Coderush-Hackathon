"use client";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function FeatureSection() {
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      setAnimationTriggered(true);
    }
  }, [inView]);

  const features = [
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      ),
      title: "Lightning Fast",
      description:
        "Our components are optimized for speed and performance, loading in milliseconds for the best user experience.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          ></path>
        </svg>
      ),
      title: "Customizable",
      description:
        "Easily customize every aspect of our components to match your brand and design requirements.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
      ),
      title: "Secure & Tested",
      description:
        "All our components undergo rigorous testing to ensure they're secure, accessible, and bug-free.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          ></path>
        </svg>
      ),
      title: "Developer Friendly",
      description:
        "Well-documented code with TypeScript support makes implementation a breeze for developers of all skill levels.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          ></path>
        </svg>
      ),
      title: "Database Compatible",
      description:
        "Seamlessly integrates with all popular databases and backend services with built-in adaptors.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          ></path>
        </svg>
      ),
      title: "Cloud Ready",
      description:
        "Deploy with confidence knowing our components work flawlessly across all cloud environments and platforms.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Powerful Features for
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {" "}
              Modern Development
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Our component library is built with the latest technologies and best
            practices
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group overflow-hidden relative ${
                animationTriggered ? "animate-card-pop" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Glowing background effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

              {/* Icon with animation */}
              <div className="relative z-10 mb-5 inline-flex p-3 rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-gray-700 ring-opacity-60 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>

              {/* Floating particles (visible on hover) */}
              <div className="absolute w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-300 opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-sm top-6 right-8 animate-float-particle-1"></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-300 opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-sm bottom-10 right-10 animate-float-particle-2"></div>

              <h3 className="relative z-10 text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative z-10 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>

              {/* Bottom highlight bar that animates on hover */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 w-0 group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes cardPop {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          70% {
            transform: translateY(-10px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes floatParticle1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -10px);
          }
        }

        @keyframes floatParticle2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-8px, -12px);
          }
        }

        .animate-card-pop {
          animation: cardPop 0.8s forwards ease-out;
        }

        .animate-float-particle-1 {
          animation: floatParticle1 4s infinite ease-in-out;
        }

        .animate-float-particle-2 {
          animation: floatParticle2 5s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
