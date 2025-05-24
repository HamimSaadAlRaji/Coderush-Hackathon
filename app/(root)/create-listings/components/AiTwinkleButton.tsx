"use client";

import React from "react";

interface AiTwinkleButtonProps {
  onClick?: () => void;
  className?: string;
  title?: string;
}

export default function AiTwinkleButton({
  onClick,
  className = "",
  title = "Generate with AI",
}: AiTwinkleButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-full  hover:bg-blue-100 cursor-pointer transition-colors group ${className}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <g>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 12 8"
              to="360 12 8"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 3l0.5 1.5L21 5l-1.5 0.5L19 7l-0.5-1.5L17 5l1.5-0.5L19 3z"
          >
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="scale"
              values="0.8;1.2;0.8"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 17l0.5 1.5L7 19l-1.5 0.5L5 21l-0.5-1.5L3 19l1.5-0.5L5 17z"
          >
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="1.8s"
              begin="1s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="scale"
              values="0.9;1.1;0.9"
              dur="2.2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}