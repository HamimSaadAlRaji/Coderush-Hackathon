"use client";

import { motion } from "framer-motion";
import { TbEdit, TbPackage, TbSchool, TbX } from "react-icons/tb";
import { FaCamera } from "react-icons/fa";
import ImageUploadComponent from "@/components/ImageUpload";
import { ImageUploadResult } from "@/lib/hooks/useImageUpload";

interface CategorySelectionProps {
  formData: any;
  setFormData: (data: any) => void;
  validationErrors: any;
  setValidationErrors: (errors: any) => void;
  onImageUploadSuccess: (result: ImageUploadResult) => void;
  onImageUploadError: (error: string) => void;
  onImageRemove: (index: number) => void;
  onNext: () => void;
  itemVariants: any;
}

const categories = [
  { value: "item", label: "Item (Physical Product)" },
  { value: "service", label: "Service" },
];

export default function CategorySelection({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors,
  onImageUploadSuccess,
  onImageUploadError,
  onImageRemove,
  onNext,
  itemVariants,
}: CategorySelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TbEdit className="mr-2 text-blue-600" /> What are you listing?
      </h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <label className="block text-gray-700 font-medium mb-2">
            Select Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.value}
                onClick={() => {
                  setFormData({ ...formData, category: category.value });
                  if (validationErrors.category) {
                    setValidationErrors((prev: any) => ({
                      ...prev,
                      category: undefined,
                    }));
                  }
                }}
                className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                  formData.category === category.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-blue-300"
                } ${validationErrors.category ? "border-red-300" : ""}`}
              >
                {category.value === "item" ? (
                  <TbPackage className="text-2xl mr-3 text-blue-600" />
                ) : (
                  <TbSchool className="text-2xl mr-3 text-blue-600" />
                )}
                <div>
                  <div className="font-medium">{category.label}</div>
                  <div className="text-sm text-gray-500">
                    {category.value === "item"
                      ? "Sell physical products like textbooks, gadgets, etc."
                      : "Offer services like tutoring, skill sharing, etc."}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {validationErrors.category && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.category}
            </p>
          )}
        </motion.div>

        {formData.category === "item" && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaCamera className="mr-2 text-blue-600" />
              Add Images <span className="text-red-500">*</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Images are required for physical items. You can add up to 5
              images.
            </p>

            <ImageUploadComponent
              onUploadSuccess={onImageUploadSuccess}
              onUploadError={onImageUploadError}
              maxFiles={5}
            />

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => onImageRemove(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TbX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {validationErrors.images && (
              <p className="text-red-500 text-sm">{validationErrors.images}</p>
            )}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium flex items-center"
          >
            Next: Basic Information
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
