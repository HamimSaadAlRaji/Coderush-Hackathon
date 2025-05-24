"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TbSearch, TbMapPin, TbCurrentLocation, TbX } from "react-icons/tb";
import { FaUniversity } from "react-icons/fa";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  name?: string;
  isUniversity?: boolean;
}

interface LocationMapProps {
  onLocationSelect: (location: Location) => void;
  existingLocations: Location[];
  userUniversity: string;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  onLocationSelect,
  existingLocations,
  userUniversity,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    37.4419, -122.143,
  ]); // Default to Stanford
  const [iconsReady, setIconsReady] = useState(false);

  // Initialize Leaflet icons
  useEffect(() => {
    const initIcons = async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet");

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        setIconsReady(true);
      }
    };

    initIcons();
  }, []);

  // Auto-add university location when component mounts
  useEffect(() => {
    if (!iconsReady) return;

    const addUniversityLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            userUniversity
          )}&limit=1`
        );
        const data = await response.json();

        if (data.length > 0) {
          const university = data[0];
          const longitude = parseFloat(university.lon);
          const latitude = parseFloat(university.lat);

          // Validate coordinates
          if (!isNaN(longitude) && !isNaN(latitude)) {
            const universityLocation: Location = {
              type: "Point",
              coordinates: [longitude, latitude], // [longitude, latitude] as numbers
              name: userUniversity,
              isUniversity: true,
            };

            // Only add if not already exists
            const alreadyExists = existingLocations.some(
              (loc) => loc.isUniversity && loc.name === userUniversity
            );

            if (!alreadyExists) {
              onLocationSelect(universityLocation);
              setMapCenter([latitude, longitude]); // For leaflet [lat, lng]
            }
          }
        }
      } catch (error) {
        console.error("Error fetching university location:", error);
      }
    };

    addUniversityLocation();
  }, [userUniversity, onLocationSelect, iconsReady, existingLocations]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    const longitude = parseFloat(result.lon);
    const latitude = parseFloat(result.lat);

    // Validate coordinates
    if (!isNaN(longitude) && !isNaN(latitude)) {
      const location: Location = {
        type: "Point",
        coordinates: [longitude, latitude], // [longitude, latitude] as numbers
        name: result.display_name,
        isUniversity: false,
      };

      onLocationSelect(location);
      setMapCenter([latitude, longitude]); // For leaflet [lat, lng]
      setSearchResults([]);
      setSearchQuery("");
    }
  };

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) return;

    try {
      // Reverse geocoding to get location name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      const location: Location = {
        type: "Point",
        coordinates: [lng, lat], // [longitude, latitude] as numbers
        name:
          data.display_name ||
          `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        isUniversity: false,
      };

      onLocationSelect(location);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Add location without name if reverse geocoding fails
      const location: Location = {
        type: "Point",
        coordinates: [lng, lat], // [longitude, latitude] as numbers
        name: `Custom Location`,
        isUniversity: false,
      };
      onLocationSelect(location);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();

            const location: Location = {
              type: "Point",
              coordinates: [longitude, latitude], // [longitude, latitude] as numbers
              name: data.display_name || "Your Current Location",
              isUniversity: false,
            };

            onLocationSelect(location);
            setMapCenter([latitude, longitude]); // For leaflet [lat, lng]
          } catch (error) {
            console.error("Error getting current location details:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your current location. Please ensure location permissions are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!iconsReady) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Section */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <TbSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <TbSearch size={18} />
            )}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={getCurrentLocation}
          className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
        >
          <TbCurrentLocation size={18} />
          Use My Current Location
        </motion.button>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {searchResults.map((result, index) => (
              <button
                key={result.place_id}
                onClick={() => handleSearchResultClick(result)}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <TbMapPin
                    className="text-gray-400 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {result.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          eventHandlers={{
            click: handleMapClick,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {existingLocations.map((location, index) => {
            // Ensure coordinates are valid numbers
            const lat = parseFloat(location.coordinates[1]?.toString() || "0");
            const lng = parseFloat(location.coordinates[0]?.toString() || "0");

            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={index}
                position={[lat, lng]} // [lat, lng] for leaflet
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {location.isUniversity ? (
                        <FaUniversity className="text-blue-600" size={16} />
                      ) : (
                        <TbMapPin className="text-gray-600" size={16} />
                      )}
                      <span className="font-medium text-sm">
                        {location.isUniversity
                          ? "University Location"
                          : "Pickup Location"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{location.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map instruction overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TbMapPin className="text-blue-600" size={16} />
            <span>Click anywhere on the map to add a pickup location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
