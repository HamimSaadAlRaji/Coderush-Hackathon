"use client"

import { motion } from "framer-motion";
import { TbArrowLeft } from "react-icons/tb";
import { FaCoins, FaTag, FaUniversity, FaEye } from "react-icons/fa";

interface PricingVisibilityProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  validationErrors: any;
  setFormData: (data: any) => void;
  setValidationErrors: (errors: any) => void;
  onBack: () => void;
  onNext: () => void;
  itemVariants: any;
}

const pricingTypes = [
  { value: "fixed", label: "Fixed Price" },
  { value: "bidding", label: "Accept Bids" },
  { value: "hourly", label: "Hourly Rate (Services)" },
];

export default function PricingVisibility({
  formData,
  handleChange,
  validationErrors,
  setFormData,
  setValidationErrors,
  onBack,
  onNext,
  itemVariants,
}: PricingVisibilityProps) {
  const handlePricingTypeSelect = (type: string) => {
    setFormData({ ...formData, pricingType: type });
    if (validationErrors.pricingType) {
      setValidationErrors((prev) => ({ ...prev, pricingType: undefined }));
    }
  };

  const handleVisibilitySelect = (visibility: string) => {
    setFormData({ ...formData, visibility });
    if (validationErrors.visibility) {
      setValidationErrors((prev) => ({ ...prev, visibility: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaCoins className="mr-2 text-blue-600" /> Pricing & Visibility
      </h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 font-medium mb-2">
            Pricing Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTypes
              .filter((type) =>
                formData.category === "service" ? true : type.value !== "hourly"
              )
              .map((type) => (
                <div
                  key={type.value}
                  onClick={() => handlePricingTypeSelect(type.value)}
                  className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                    formData.pricingType === type.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-blue-300"
                  } ${validationErrors.pricingType ? "border-red-300" : ""}`}
                >
                  <FaTag className="text-xl mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500">
                      {type.value === "fixed"
                        ? "Set a specific price"
                        : type.value === "bidding"
                        ? "Allow others to make offers"
                        : "Charge per hour of service"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {validationErrors.pricingType && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.pricingType}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="price"
            className="block text-gray-700 font-medium mb-2"
          >
            {formData.pricingType === "fixed"
              ? "Price"
              : formData.pricingType === "bidding"
              ? "Starting Price (for bids)"
              : "Hourly Rate"}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="0"
              step="0.01"
              className={`w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                validationErrors.price ? "border-red-300" : "border-gray-300"
              }`}
            />
          </div>
          {validationErrors.price && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.price}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 font-medium mb-2">
            Visibility <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => handleVisibilitySelect("university")}
              className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                formData.visibility === "university"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 hover:border-blue-300"
              } ${validationErrors.visibility ? "border-red-300" : ""}`}
            >
              <FaUniversity className="text-xl mr-3 text-blue-600" />
              <div>
                <div className="font-medium">My University Only</div>
                <div className="text-sm text-gray-500">
                  Only students from your university can see this listing
                </div>
              </div>
            </div>

            <div
              onClick={() => handleVisibilitySelect("all")}
              className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                formData.visibility === "all"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 hover:border-blue-300"
              } ${validationErrors.visibility ? "border-red-300" : ""}`}
            >
              <FaEye className="text-xl mr-3 text-blue-600" />
              <div>
                <div className="font-medium">All Universities</div>
                <div className="text-sm text-gray-500">
                  Students from all universities can see this listing
                </div>
              </div>
            </div>
          </div>
          {validationErrors.visibility && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.visibility}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium flex items-center hover:bg-gray-50"
          >
            <TbArrowLeft className="mr-1" />
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium flex items-center"
          >
            Next: Add Locations
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
