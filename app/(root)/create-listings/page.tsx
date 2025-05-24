"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TbArrowLeft } from "react-icons/tb";
import { ImageUploadResult } from "@/lib/hooks/useImageUpload";
import { toast } from "sonner";

// Import components
import CategorySelection from "./components/CategorySelection";
import BasicInformation from "./components/BasicInformation";
import PricingVisibility from "./components/PricingVisibility";
import LocationSelection from "./components/LocationSelection";
import ProgressSteps from "./components/ProgressSteps";

interface LocationPoint {
  type: "Point";
  coordinates: [number, number];
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
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
    locations: [] as LocationPoint[],
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
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleLocationAdd = (location: LocationPoint) => {
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, location],
    }));

    // Clear location validation error
    if (validationErrors.locations) {
      setValidationErrors((prev) => ({
        ...prev,
        locations: undefined,
      }));
    }
  };

  const handleLocationRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleImageUploadSuccess = (result: ImageUploadResult) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, result.url],
    }));

    // Clear image validation error
    if (validationErrors.images) {
      setValidationErrors((prev) => ({
        ...prev,
        images: undefined,
      }));
    }

    console.log("Image uploaded successfully:", result.url);
  };

  const handleImageUploadError = (error: string) => {
    console.error("Image upload error:", error);
    toast.error("Failed to upload image. Please try again.");
  };

  const handleImageRemove = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
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
      setCurrentStep((prev) => prev + 1);
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
        condition:
          formData.category === "item" ? formData.condition : undefined,
        images: formData.images,
        visibility: formData.visibility,
        tags: formData.tags,
        locations: formData.locations.map((location) => ({
          type: "Point",
          coordinates: [
            parseFloat(location.coordinates[0].toString()),
            parseFloat(location.coordinates[1].toString()),
          ],
          name: location.name,
          isUniversity: location.isUniversity,
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
          <motion.div key="step1" variants={containerVariants}>
            <CategorySelection
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              onImageUploadSuccess={handleImageUploadSuccess}
              onImageUploadError={handleImageUploadError}
              onImageRemove={handleImageRemove}
              onNext={handleNextStep}
              itemVariants={itemVariants}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step2" variants={containerVariants}>
            <BasicInformation
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}  
              validationErrors={validationErrors}
              onBack={() => setCurrentStep(1)}
              onNext={handleNextStep}
              itemVariants={itemVariants}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step3" variants={containerVariants}>
            <PricingVisibility
              formData={formData}
              handleChange={handleChange}
              validationErrors={validationErrors}
              setFormData={setFormData}
              setValidationErrors={setValidationErrors}
              onBack={() => setCurrentStep(2)}
              onNext={handleNextStep}
              itemVariants={itemVariants}
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="step4" variants={containerVariants}>
            <LocationSelection
              formData={formData}
              validationErrors={validationErrors}
              onLocationAdd={handleLocationAdd}
              onLocationRemove={handleLocationRemove}
              onBack={() => setCurrentStep(3)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              itemVariants={itemVariants}
            />
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
        <ProgressSteps currentStep={currentStep} />
        <form onSubmit={(e) => e.preventDefault()}>{renderStep()}</form>
      </motion.div>
    </div>
  );
}
