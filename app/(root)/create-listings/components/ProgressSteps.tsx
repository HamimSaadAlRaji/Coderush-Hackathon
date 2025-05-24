"use client";

import { motion } from "framer-motion";

interface ProgressStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Category" },
  { number: 2, title: "Details" },
  { number: 3, title: "Pricing" },
  { number: 4, title: "Location" },
];

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`relative flex items-center ${
                currentStep >= step.number ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === step.number ? 1.1 : 1,
                  backgroundColor:
                    currentStep >= step.number ? "#2563eb" : "#d1d5db",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                {step.number}
              </motion.div>
              <span className="ml-2 font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-gray-300 self-center ml-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
