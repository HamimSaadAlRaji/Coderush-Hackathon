"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TbEdit,
  TbPackage,
  TbBookUpload,
  TbSchool,
  TbArrowLeft,
} from "react-icons/tb";
import { FaTag, FaCoins, FaEye, FaCamera, FaUniversity } from "react-icons/fa";
import ImageUploadComponent from "@/components/ImageUpload";
import { ImageUploadResult } from "@/lib/hooks/useImageUpload";

const categories = [
  { value: "item", label: "Item (Physical Product)" },
  { value: "service", label: "Service" },
];

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

const pricingTypes = [
  { value: "fixed", label: "Fixed Price" },
  { value: "bidding", label: "Accept Bids" },
  { value: "hourly", label: "Hourly Rate (Services)" },
];

export default function CreateListingPage() {  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "item",
    subCategory: "",
    price: "",
    pricingType: "fixed",
    condition: "good",
    imageUrls: [] as string[],
    visibility: "university",
    tags: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };  const handleImageUploadSuccess = (result: ImageUploadResult) => {
    // Add image URL to form data
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, result.url]
    }));
    console.log('Image uploaded successfully:', result.url);
  };

  const handleImageUploadError = (error: string) => {
    console.error('Image upload error:', error);
    // You can add toast notification here
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Validate that at least one image is uploaded
      if (formData.imageUrls.length === 0) {
        alert('Please upload at least one image');
        setIsSubmitting(false);
        return;
      }

      // Prepare submission data
      const submissionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        price: parseFloat(formData.price),
        pricingType: formData.pricingType,
        condition: formData.category === 'item' ? formData.condition : undefined,
        images: formData.imageUrls,
        visibility: formData.visibility,
        tags: formData.tags
      };

      console.log("Submitting listing data:", submissionData);

      // Submit to API
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create listing');
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to create listing');
      }

      console.log('Listing created successfully:', result.data);
      
      // Show success message (you can replace with a toast notification)
      alert('Listing created successfully!');

      // Redirect to my listings page
      router.push("/my-listings");
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert(`Error creating listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TbEdit className="mr-2 text-blue-600" /> Basic Information
            </h2>

            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-2">
                  What are you listing?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.value}
                      onClick={() =>
                        setFormData({ ...formData, category: category.value })
                      }
                      className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                        formData.category === category.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
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
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                </div>

                {formData.category === "item" && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <label
                      htmlFor="condition"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Condition
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {itemConditions.map((condition) => (
                        <div
                          key={condition.value}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              condition: condition.value,
                            })
                          }
                          className={`cursor-pointer border px-4 py-2 rounded-full transition-all ${
                            formData.condition === condition.value
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-300 hover:border-blue-300"
                          }`}
                        >
                          {condition.label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium flex items-center"
                >
                  Next: Pricing & Visibility
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
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaCoins className="mr-2 text-blue-600" /> Pricing & Visibility
            </h2>

            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-2">
                  Pricing Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricingTypes
                    .filter((type) =>
                      formData.category === "service"
                        ? true
                        : type.value !== "hourly"
                    )
                    .map((type) => (
                      <div
                        key={type.value}
                        onClick={() =>
                          setFormData({ ...formData, pricingType: type.value })
                        }
                        className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                          formData.pricingType === type.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
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
                    className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-2">
                  Visibility
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() =>
                      setFormData({ ...formData, visibility: "university" })
                    }
                    className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                      formData.visibility === "university"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
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
                    onClick={() =>
                      setFormData({ ...formData, visibility: "all" })
                    }
                    className={`cursor-pointer border-2 p-4 rounded-lg flex items-center transition-all ${
                      formData.visibility === "all"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
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
              </motion.div>

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

              <motion.div
                variants={itemVariants}
                className="flex justify-between"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium flex items-center hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium flex items-center"
                >
                  Next: Add Images
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
            </motion.div>
          </motion.div>
        );      case 3:
        return (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaCamera className="mr-2 text-blue-600" /> Add Images
            </h2>

            <motion.div className="space-y-6" variants={containerVariants}>
              {/* Image Upload Component */}
              <motion.div variants={itemVariants}>
                <ImageUploadComponent
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  maxFiles={5}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium flex items-center hover:bg-gray-50"
                >
                  <TbArrowLeft className="mr-1" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-medium flex items-center shadow-lg ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Create Listing
                      <TbBookUpload className="ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-8 flex items-center space-x-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => router.push("/my-listings")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <TbArrowLeft className="mr-1" />
          Back to My Listings
        </button>
      </motion.div>

      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Create New Listing
      </motion.h1>

      <motion.div
        className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <div
              className={`relative flex items-center ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === 1 ? 1.1 : 1,
                  backgroundColor: currentStep >= 1 ? "#2563eb" : "#d1d5db",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                1
              </motion.div>
              <span className="ml-2 font-medium">Basics</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300 self-center"></div>

            <div
              className={`relative flex items-center ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === 2 ? 1.1 : 1,
                  backgroundColor: currentStep >= 2 ? "#2563eb" : "#d1d5db",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                2
              </motion.div>
              <span className="ml-2 font-medium">Pricing</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300 self-center"></div>

            <div
              className={`relative flex items-center ${
                currentStep >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === 3 ? 1.1 : 1,
                  backgroundColor: currentStep >= 3 ? "#2563eb" : "#d1d5db",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                3
              </motion.div>
              <span className="ml-2 font-medium">Images</span>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>{getStepContent()}</form>
      </motion.div>
    </div>
  );
}
