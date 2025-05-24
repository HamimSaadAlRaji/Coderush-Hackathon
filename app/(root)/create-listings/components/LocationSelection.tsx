"use client";

import { motion } from "framer-motion";
import { TbMapPin, TbArrowLeft, TbBookUpload, TbX } from "react-icons/tb";
import { FaUniversity } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const LocationMapComponent = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
});

interface LocationPoint {
  type: "Point";
  coordinates: [number, number];
  name?: string;
  isUniversity?: boolean;
}

interface LocationSelectionProps {
  formData: any;
  validationErrors: any;
  onLocationAdd: (location: LocationPoint) => void;
  onLocationRemove: (index: number) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  itemVariants: any;
}

export default function LocationSelection({
  formData,
  validationErrors,
  onLocationAdd,
  onLocationRemove,
  onBack,
  onSubmit,
  isSubmitting,
  itemVariants,
}: LocationSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TbMapPin className="mr-2 text-blue-600" /> Add Locations
      </h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <div className="text-center mb-6">
            <TbMapPin className="mx-auto text-blue-600 mb-3" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Add Pickup/Meeting Locations
            </h3>
            <p className="text-gray-600">
              Add locations where buyers can pick up items or meet for services.
              At least one location is required.
            </p>
          </div>

          {/* University Location Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FaUniversity className="text-blue-600 mr-3 text-xl" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">
                  University Location
                </h4>
                <p className="text-sm text-blue-700">
                  Your university will be automatically added as a pickup
                  location
                </p>
              </div>
            </div>
          </div>

          {/* Current Locations */}
          {formData.locations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Selected Locations ({formData.locations.length})
              </h4>
              <div className="space-y-2">
                {formData.locations.map(
                  (location: LocationPoint, index: number) => (
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
                            {location.coordinates[1].toFixed(4)},{" "}
                            {location.coordinates[0].toFixed(4)}
                          </p>
                        </div>
                      </div>
                      {!location.isUniversity && (
                        <button
                          onClick={() => onLocationRemove(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <TbX size={18} />
                        </button>
                      )}
                    </motion.div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Map Component */}
          <div
            className="bg-gray-100 rounded-lg overflow-hidden"
            style={{ height: "400px" }}
          >
            <LocationMapComponent
              onLocationSelect={onLocationAdd}
              existingLocations={formData.locations}
              userUniversity="Islamic University of Technology"
            />
          </div>

          <div className="text-sm text-gray-500 mt-2">
            <p>
              💡 Tip: Search for locations or click directly on the map to add
              pickup points
            </p>
          </div>

          {validationErrors.locations && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.locations}
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
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-medium flex items-center shadow-lg ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
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
      </div>
    </div>
  );
}
