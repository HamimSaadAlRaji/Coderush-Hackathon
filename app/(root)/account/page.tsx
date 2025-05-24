"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  TbSchool,
  TbBuildingCommunity,
  TbBook,
  TbPhone,
  TbCalendar,
  TbShield,
  TbListCheck,
  TbUserCircle,
  TbX,
  TbCheck,
  TbInfoCircle,
  TbEdit,
} from "react-icons/tb";
import { FaGraduationCap } from "react-icons/fa";
import Image from "next/image";

export default function AccountPage() {
  const { isLoaded, user } = useUser();

  // Form state - all fields start empty
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    university: "",
    department: "",
    program: "",
    yearOfStudy: "",
    phoneNumber: "",
    publicProfile: false,
    showUniversity: false,
    showDepartment: false,
    showProgram: false,
    showYearOfStudy: false,
  });

  // Loading state UI
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send this data to your backend
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  // Calculate completion percentage based on filled fields
  const calculateCompletionPercentage = () => {
    const fields = [
      "university",
      "department", 
      "program",
      "yearOfStudy",
      "phoneNumber",
    ];
    const filledFields = fields.filter(
      (field) => formData[field].trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Check verification status based on filled data
  const getVerificationStatus = () => {
    const hasPhoneNumber = formData.phoneNumber.trim() !== "";
    const hasAcademicInfo = formData.university.trim() !== "" && 
                           formData.department.trim() !== "" && 
                           formData.program.trim() !== "" && 
                           formData.yearOfStudy.trim() !== "";
    
    return {
      email: "verified", // Always verified
      phone: hasPhoneNumber ? "verified" : "unverified",
      academic: hasAcademicInfo ? "verified" : "unverified"
    };
  };

  const completionPercentage = calculateCompletionPercentage();
  const verificationStatus = getVerificationStatus();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold flex items-center">
          <TbUserCircle className="mr-2 text-blue-600" />
          Academic Profile
        </h1>
        <p className="text-gray-600 mt-2">
          Add your academic details to build trust with other students in the
          marketplace.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white overflow-hidden mb-4 border-4 border-white">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <TbUserCircle size={48} className="text-blue-500" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">
                {user?.fullName || "Student User"}
              </h2>
              <p className="text-blue-100">
                {user?.primaryEmailAddress?.emailAddress ||
                  "student@university.edu"}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <TbShield className={`mr-2 ${verificationStatus.email === 'verified' && verificationStatus.phone === 'verified' && verificationStatus.academic === 'verified' ? 'text-green-500' : 'text-orange-500'}`} /> Verification Status
                </h3>
                <div className="space-y-3">
                  {/* Email - Always Verified */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <TbCheck className="mr-2 text-green-500" /> Email
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Verified
                    </span>
                  </div>
                  
                  {/* Phone - Verified when phone number is provided */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      {verificationStatus.phone === 'verified' ? (
                        <TbCheck className="mr-2 text-green-500" />
                      ) : (
                        <TbX className="mr-2 text-red-500" />
                      )} Phone
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      verificationStatus.phone === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {verificationStatus.phone === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  
                  {/* Academic - Verified when all academic fields are filled */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      {verificationStatus.academic === 'verified' ? (
                        <TbCheck className="mr-2 text-green-500" />
                      ) : (
                        <TbX className="mr-2 text-red-500" />
                      )} Academic Profile
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      verificationStatus.academic === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {verificationStatus.academic === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`rounded-lg p-4 text-sm ${
                  verificationStatus.phone === 'verified' && verificationStatus.academic === 'verified'
                    ? 'bg-green-50 dark:bg-green-900/30'
                    : 'bg-orange-50 dark:bg-orange-900/30'
                }`}>
                  <div className="flex items-start">
                    <TbInfoCircle className={`mr-2 mt-1 flex-shrink-0 ${
                      verificationStatus.phone === 'verified' && verificationStatus.academic === 'verified'
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`} />
                    <p className={
                      verificationStatus.phone === 'verified' && verificationStatus.academic === 'verified'
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-orange-800 dark:text-orange-200'
                    }>
                      {verificationStatus.phone === 'verified' && verificationStatus.academic === 'verified'
                        ? 'Great! Your profile is fully verified. This helps build trust with other students in the marketplace.'
                        : 'Complete your profile and verify your information to build trust and increase your visibility in the marketplace.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Information Form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <FaGraduationCap className="mr-2 text-blue-600" />
                Academic Information
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-sm font-medium px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <TbEdit className="mr-1" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>

            <form onSubmit={handleSubmit}>
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <TbSchool className="mr-2 text-blue-600" /> University
                      {formData.university && (
                        <TbCheck className="ml-2 text-green-500 text-xs" />
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your university"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500">
                        {formData.university || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <TbBuildingCommunity className="mr-2 text-blue-600" /> Department
                      {formData.department && (
                        <TbCheck className="ml-2 text-green-500 text-xs" />
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your department"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500">
                        {formData.department || "Not specified"}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Program */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <TbBook className="mr-2 text-blue-600" /> Program of Study
                      {formData.program && (
                        <TbCheck className="ml-2 text-green-500 text-xs" />
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your program"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500">
                        {formData.program || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <TbCalendar className="mr-2 text-blue-600" /> Year of Study
                      {formData.yearOfStudy && (
                        <TbCheck className="ml-2 text-green-500 text-xs" />
                      )}
                    </label>
                    {isEditing ? (
                      <select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="5th Year">5th Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500">
                        {formData.yearOfStudy || "Not specified"}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <TbPhone className="mr-2 text-blue-600" /> Phone Number
                      {formData.phoneNumber && (
                        <TbCheck className="ml-2 text-green-500 text-xs" />
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500">
                        {formData.phoneNumber || "Not specified"}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Rest of the form components remain the same... */}
                {isEditing && (
                  <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-200 dark:border-gray-700 pt-6"
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <TbListCheck className="mr-2 text-blue-600" /> Privacy Settings
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="publicProfile"
                          name="publicProfile"
                          checked={formData.publicProfile}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="publicProfile"
                          className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                        >
                          Make my profile public to other students
                        </label>
                      </div>

                      <div className="pl-7 space-y-3 pt-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showUniversity"
                            name="showUniversity"
                            checked={formData.showUniversity}
                            onChange={handleInputChange}
                            disabled={!formData.publicProfile}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="showUniversity"
                            className={`ml-3 text-sm ${
                              formData.publicProfile
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            Show university in my listings
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showDepartment"
                            name="showDepartment"
                            checked={formData.showDepartment}
                            onChange={handleInputChange}
                            disabled={!formData.publicProfile}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="showDepartment"
                            className={`ml-3 text-sm ${
                              formData.publicProfile
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            Show department in my listings
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showProgram"
                            name="showProgram"
                            checked={formData.showProgram}
                            onChange={handleInputChange}
                            disabled={!formData.publicProfile}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="showProgram"
                            className={`ml-3 text-sm ${
                              formData.publicProfile
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            Show program in my listings
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="showYearOfStudy"
                            name="showYearOfStudy"
                            checked={formData.showYearOfStudy}
                            onChange={handleInputChange}
                            disabled={!formData.publicProfile}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="showYearOfStudy"
                            className={`ml-3 text-sm ${
                              formData.publicProfile
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            Show year of study in my listings
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isEditing && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-end"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Save Changes
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </form>

            {!isEditing && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`mt-8 border rounded-lg p-4 ${
                  completionPercentage === 100
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800'
                    : 'bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-800'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <TbShield className={`text-lg ${
                      completionPercentage === 100 ? 'text-green-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      completionPercentage === 100 
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-orange-800 dark:text-orange-200'
                    }`}>
                      Profile Completion
                    </h3>
                    <div className={`mt-2 text-sm ${
                      completionPercentage === 100
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-orange-700 dark:text-orange-300'
                    }`}>
                      <p>
                        Your academic profile is{" "}
                        <span className="font-medium">
                          {completionPercentage}%
                        </span>{" "}
                        complete.
                        {completionPercentage < 100 ? (
                          <span>
                            {" "}
                            Complete your profile to increase your visibility
                            and build trust with other students.
                          </span>
                        ) : (
                          <span> Great! Your profile is complete and fully verified.</span>
                        )}
                      </p>
                      <div className="mt-2 bg-white dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            completionPercentage === 0
                              ? "bg-red-500"
                              : completionPercentage < 50
                              ? "bg-orange-500"
                              : completionPercentage < 100
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.max(completionPercentage, 5)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
