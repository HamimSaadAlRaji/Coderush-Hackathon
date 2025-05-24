"use client";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  FaUserGraduate,
  FaListUl,
  FaComments,
  FaMapMarkerAlt,
  FaRobot,
  FaStar,
} from "react-icons/fa";

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
      icon: <FaUserGraduate className="w-10 h-10" />,
      title: "Verified Student Community",
      description:
        "Ensures trust and exclusivity through university email verification and detailed academic profiles.",
    },
    {
      icon: <FaListUl className="w-10 h-10" />,
      title: "Smart Listings & Discovery",
      description:
        "Post items or services with flexible pricing, advanced filters, and visibility control within or across campuses.",
    },
    {
      icon: <FaComments className="w-10 h-10" />,
      title: "Real-Time Communication",
      description:
        "Chat instantly, share images, and negotiate seamlessly within a secure platform.",
    },
    {
      icon: <FaMapMarkerAlt className="w-10 h-10" />,
      title: "Safe Campus Meetups",
      description:
        "Plan exchanges confidently with interactive campus maps highlighting safe meeting points.",
    },
    {
      icon: <FaRobot className="w-10 h-10" />,
      title: "AI-Powered Tools",
      description:
        "Get price recommendations and condition estimates with AI-powered insights for smarter transactions.",
    },
    {
      icon: <FaStar className="w-10 h-10" />,
      title: "Transparent Ratings & Moderation",
      description:
        "Build trust with transaction reviews, student-led moderation, and monitored user feedback.",
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
              Student Marketplace
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Our platform is built with students in mind, focusing on security,
            convenience, and community
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
