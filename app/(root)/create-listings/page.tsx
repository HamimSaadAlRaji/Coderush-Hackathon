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
  TbMapPin,
  TbCurrentLocation,
  TbSearch,
  TbX,
} from "react-icons/tb";
import { FaTag, FaCoins, FaEye, FaCamera, FaUniversity } from "react-icons/fa";
import ImageUploadComponent from "@/components/ImageUpload";
import { ImageUploadResult } from "@/lib/hooks/useImageUpload";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const LocationMapComponent = dynamic(
  () => import("@/components/LocationMap"),
  { ssr: false }
);

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

interface LocationPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  name?: string;
  isUniversity?: boolean;
}

interface ValidationErrors {
  category?: string;
  images?: string;
  title?: string;
  description?: string;
  subCategory?: string;
  condition?: string;
  price?: string;
  pricingType?: string;
  visibility?: string;
  locations?: string;
}

export default function CreateListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    pricingType: "fixed",
    condition: "good",
    images: [] as string[],
    visibility: "university",
    tags: "",
    locations: [] as LocationPoint[]
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
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleLocationAdd = (location: LocationPoint) => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, location]
    }));
    
    // Clear location validation error
    if (validationErrors.locations) {
      setValidationErrors(prev => ({
        ...prev,
        locations: undefined
      }));
    }
  };

  const handleLocationRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleImageUploadSuccess = (result: ImageUploadResult) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, result.url],
    }));
    
    // Clear image validation error
    if (validationErrors.images) {
      setValidationErrors(prev => ({
        ...prev,
        images: undefined
      }));
    }
    
    console.log("Image uploaded successfully:", result.url);
  };

  const handleImageUploadError = (error: string) => {
    console.error("Image upload error:", error);
    toast.error("Failed to upload image. Please try again.");
  };

  const handleImageRemove = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Validation functions for each step
  const validateStep1 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.category) {
      errors.category = "Please select what you're listing (Item or Service)";
    }
    
    // For items, images are mandatory
    if (formData.category === "item" && formData.images.length === 0) {
      errors.images = "At least one image is required for items";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters long";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters long";
    }
    
    if (!formData.subCategory) {
      errors.subCategory = "Please select a subcategory";
    }
    
    // For items, condition is required
    if (formData.category === "item" && !formData.condition) {
      errors.condition = "Please select the item condition";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Please enter a valid price greater than 0";
    }
    
    if (!formData.pricingType) {
      errors.pricingType = "Please select a pricing type";
    }
    
    if (!formData.visibility) {
      errors.visibility = "Please select visibility settings";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (formData.locations.length === 0) {
      errors.locations = "Please add at least one pickup/meeting location";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Show error toast
      toast.error("Please fix the errors before proceeding");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!validateStep4()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submissionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        price: parseFloat(formData.price),
        pricingType: formData.pricingType,
        condition: formData.category === "item" ? formData.condition : undefined,
        images: formData.images,
        visibility: formData.visibility,
        tags: formData.tags,
        locations: formData.locations.map(location => ({
          type: 'Point',
          coordinates: [
            parseFloat(location.coordinates[0].toString()),
            parseFloat(location.coordinates[1].toString())
          ],
          name: location.name,
          isUniversity: location.isUniversity
        })),
      };

      console.log("Submitting listing data:", submissionData);

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create listing");
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to create listing");
      }

      console.log("Listing created successfully:", result.data);

      toast.success("Listing created successfully!", {
        style: { background: "#22c55e", color: "#fff" },
      });

      router.push("/my-listings");
    } catch (error) {
      console.error("Error submitting listing:", error);
      toast.error(
        `Error creating listing: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" variants={containerVariants} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TbEdit className="mr-2 text-blue-600" /> What are you listing?
            </h2>

            <motion.div className="space-y-6" variants={containerVariants}>
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
                          setValidationErrors(prev => ({ ...prev, category: undefined }));
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
                  <p className="text-red-500 text-sm mt-2">{validationErrors.category}</p>
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
                    Images are required for physical items. You can add up to 5 images.
                  </p>
                  
                  <ImageUploadComponent
                    onUploadSuccess={handleImageUploadSuccess}
                    onUploadError={handleImageUploadError}
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
                            onClick={() => handleImageRemove(index)}
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
                  onClick={handleNextStep}
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
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step2" variants={containerVariants} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TbEdit className="mr-2 text-blue-600" /> Basic Information
            </h2>

            <motion.div className="space-y-6" variants={containerVariants}>
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
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
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
                    validationErrors.description ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
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
                    validationErrors.subCategory ? "border-red-300" : "border-gray-300"
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
                  <p className="text-red-500 text-sm mt-1">{validationErrors.subCategory}</p>
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
                        onClick={() => {
                          setFormData({
                            ...formData,
                            condition: condition.value,
                          });
                          if (validationErrors.condition) {
                            setValidationErrors(prev => ({ ...prev, condition: undefined }));
                          }
                        }}
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
                    <p className="text-red-500 text-sm mt-2">{validationErrors.condition}</p>
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
                  <TbArrowLeft className="mr-1" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNextStep}
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
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step3" variants={containerVariants} className="space-y-6">
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
                        onClick={() => {
                          setFormData({ ...formData, pricingType: type.value });
                          if (validationErrors.pricingType) {
                            setValidationErrors(prev => ({ ...prev, pricingType: undefined }));
                          }
                        }}
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
                  <p className="text-red-500 text-sm mt-2">{validationErrors.pricingType}</p>
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
                  <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-700 font-medium mb-2">
                  Visibility <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setFormData({ ...formData, visibility: "university" });
                      if (validationErrors.visibility) {
                        setValidationErrors(prev => ({ ...prev, visibility: undefined }));
                      }
                    }}
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
                    onClick={() => {
                      setFormData({ ...formData, visibility: "all" });
                      if (validationErrors.visibility) {
                        setValidationErrors(prev => ({ ...prev, visibility: undefined }));
                      }
                    }}
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
                  <p className="text-red-500 text-sm mt-2">{validationErrors.visibility}</p>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between"
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
                  onClick={handleNextStep}
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
            </motion.div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TbMapPin className="mr-2 text-blue-600" /> Add Locations
            </h2>

            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <div className="text-center mb-6">
                  <TbMapPin className="mx-auto text-blue-600 mb-3" size={48} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Add Pickup/Meeting Locations</h3>
                  <p className="text-gray-600">
                    Add locations where buyers can pick up items or meet for services. At least one location is required.
                  </p>
                </div>

                {/* University Location Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FaUniversity className="text-blue-600 mr-3 text-xl" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">University Location</h4>
                      <p className="text-sm text-blue-700">
                        Your university will be automatically added as a pickup location
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Locations */}
                {formData.locations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Selected Locations ({formData.locations.length})</h4>
                    <div className="space-y-2">
                      {formData.locations.map((location, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center">
                            {location.isUniversity ? (
                              <FaUniversity className="text-blue-600 mr-3" />
                            ) : (
                              <TbMapPin className="text-gray-600 mr-3" />
                            )}
                            <div>
                              <p className="font-medium">
                                {location.name || `Location ${index + 1}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
                              </p>
                            </div>
                          </div>
                          {!location.isUniversity && (
                            <button
                              onClick={() => handleLocationRemove(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <TbX size={18} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map Component */}
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <LocationMapComponent
                    onLocationSelect={handleLocationAdd}
                    existingLocations={formData.locations}
                    userUniversity="Stanford University"
                  />
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  <p>💡 Tip: Search for locations or click directly on the map to add pickup points</p>
                </div>

                {validationErrors.locations && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.locations}</p>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(3)}
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

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Category";
      case 2: return "Details";
      case 3: return "Pricing";
      case 4: return "Location";
      default: return "";
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
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`relative flex items-center ${
                    currentStep >= step ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep === step ? 1.1 : 1,
                      backgroundColor: currentStep >= step ? "#2563eb" : "#d1d5db",
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  >
                    {step}
                  </motion.div>
                  <span className="ml-2 font-medium">{getStepTitle(step)}</span>
                </div>
                {index < 3 && (
                  <div className="w-12 h-0.5 bg-gray-300 self-center ml-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>{renderStep()}</form>
      </motion.div>
    </div>
  );
}