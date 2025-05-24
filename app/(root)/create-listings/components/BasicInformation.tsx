"use client";

import { motion } from "framer-motion";
import { TbEdit, TbArrowLeft } from "react-icons/tb";

interface BasicInformationProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  validationErrors: any;
  onBack: () => void;
  onNext: () => void;
  itemVariants: any;
}

const itemSubcategories = [
  { value: "textbook", label: "Textbook" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "other", label: "Other" },
];

const serviceSubcategories = [
  { value: "tutoring", label: "Tutoring/Academic Help" },
  { value: "skillExchange", label: "Skill Exchange" },
  { value: "techSupport", label: "Tech Support" },
  { value: "eventServices", label: "Event Services" },
  { value: "taskHelp", label: "Task Help" },
  { value: "other", label: "Other" },
];

const itemConditions = [
  { value: "new", label: "New" },
  { value: "likeNew", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export default function BasicInformation({
  formData,
  handleChange,
  validationErrors,
  onBack,
  onNext,
  itemVariants,
}: BasicInformationProps) {
  const handleConditionSelect = (condition: string) => {
    const event = {
      target: { name: "condition", value: condition },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TbEdit className="mr-2 text-blue-600" /> Basic Information
      </h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., 'Calculus Textbook 10th Edition' or 'Python Programming Tutoring'"
            required
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              validationErrors.title ? "border-red-300" : "border-gray-300"
            }`}
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.title}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Provide details about what you're offering..."
            required
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              validationErrors.description
                ? "border-red-300"
                : "border-gray-300"
            }`}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.description}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="subCategory"
            className="block text-gray-700 font-medium mb-2"
          >
            Subcategory <span className="text-red-500">*</span>
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              validationErrors.subCategory
                ? "border-red-300"
                : "border-gray-300"
            }`}
          >
            <option value="">Select a subcategory</option>
            {formData.category === "item"
              ? itemSubcategories.map((subcat) => (
                  <option key={subcat.value} value={subcat.value}>
                    {subcat.label}
                  </option>
                ))
              : serviceSubcategories.map((subcat) => (
                  <option key={subcat.value} value={subcat.value}>
                    {subcat.label}
                  </option>
                ))}
          </select>
          {validationErrors.subCategory && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.subCategory}
            </p>
          )}
        </motion.div>

        {formData.category === "item" && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-gray-700 font-medium mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {itemConditions.map((condition) => (
                <div
                  key={condition.value}
                  onClick={() => handleConditionSelect(condition.value)}
                  className={`cursor-pointer border px-4 py-2 rounded-full transition-all ${
                    formData.condition === condition.value
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 hover:border-blue-300"
                  } ${validationErrors.condition ? "border-red-300" : ""}`}
                >
                  {condition.label}
                </div>
              ))}
            </div>
            {validationErrors.condition && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.condition}
              </p>
            )}
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <label
            htmlFor="tags"
            className="block text-gray-700 font-medium mb-2"
          >
            Tags (Optional)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., math, textbook, 2023 (comma separated)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add relevant keywords to help others find your listing
          </p>
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
            Next: Pricing
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
