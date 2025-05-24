"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@heroui/react";
import {
  TbSearch,
  TbFilter,
  TbGrid3X3,
  TbList,
  TbChevronDown,
  TbMapPin,
  TbTag,
  TbCurrencyDollar,
  TbCalendar,
  TbEye,
  TbHeart,
  TbShare,
  TbSortAscending,
  TbSortDescending,
  TbX,
  TbAdjustments,
  TbChevronLeft,
  TbChevronRight,
} from "react-icons/tb";

interface IListing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  condition?: string;
  images: string[];
  sellerId: string;
  sellerUniversity: string;
  pricingType: "fixed" | "negotiable" | "auction";
  status: "active" | "sold" | "expired" | "removed";
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface ListingStats {
  totalListings: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  universities: string[];
}

interface CategoryBreakdown {
  _id: string;
  count: number;
  averagePrice: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface FiltersData {
  category?: string;
  subCategory?: string;
  university?: string;
  status?: string;
  pricingType?: string;
  condition?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function AllListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ListingStats | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedUniversity, setSelectedUniversity] = useState(
    searchParams.get("university") || ""
  );
  const [selectedCondition, setSelectedCondition] = useState(
    searchParams.get("condition") || ""
  );
  const [selectedPricingType, setSelectedPricingType] = useState(
    searchParams.get("pricingType") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "desc"
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );

  // UI states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(false);

  // Constants
  const categories = [
    "Textbooks",
    "Electronics",
    "Furniture",
    "Clothing",
    "Sports Equipment",
    "Musical Instruments",
    "Vehicles",
    "Services",
    "Housing",
    "Other",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];
  const pricingTypes = ["fixed", "negotiable", "auction"];
  const sortOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "price", label: "Price" },
    { value: "title", label: "Title" },
    { value: "views", label: "Popularity" },
  ];

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedUniversity) params.set("university", selectedUniversity);
    if (selectedCondition) params.set("condition", selectedCondition);
    if (selectedPricingType) params.set("pricingType", selectedPricingType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (currentPage > 1) params.set("page", currentPage.toString());

    return params;
  }, [
    searchQuery,
    selectedCategory,
    selectedUniversity,
    selectedCondition,
    selectedPricingType,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams();
      const response = await fetch(`/api/listings?${params.toString()}`);
      const result = await response.json();

      console.log("API Response:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch listings");
      }

      if (result.success) {
        // Handle different possible data structures
        let listingsData = [];

        if (Array.isArray(result.data)) {
          // If result.data is directly an array
          listingsData = result.data;
        } else if (result.data && Array.isArray(result.data.listings)) {
          // If result.data has a listings property
          listingsData = result.data.listings;
        } else if (result.listings && Array.isArray(result.listings)) {
          // If result has listings property directly
          listingsData = result.listings;
        } else {
          console.error("Unexpected data structure:", result);
          throw new Error("Invalid data structure received from API");
        }

        setListings(listingsData);
        setPagination(result.pagination || null);
        setStats(result.stats || null);
        setCategoryBreakdown(result.categoryBreakdown || []);
      } else {
        throw new Error(result.error || "Failed to fetch listings");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
      // Set empty array on error to prevent map error
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Update URL
  const updateURL = useCallback(() => {
    const params = buildQueryParams();
    const newURL = params.toString()
      ? `/all-listings?${params.toString()}`
      : "/all-listings";

    router.push(newURL, { scroll: false });
  }, [buildQueryParams, router]);

  // Effects
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Event handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchListings();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedUniversity("");
    setSelectedCondition("");
    setSelectedPricingType("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <TbChevronLeft />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <TbChevronRight />
        </button>
      </div>
    );
  };

  const renderListingCard = (listing: IListing) => (
    <motion.div
      key={listing._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/product/${listing._id}`)}
    >
      <div className="relative h-48">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <TbTag className="text-gray-400 text-6xl" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
            <TbHeart className="text-gray-600 text-sm" />
          </button>
          <button className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
            <TbShare className="text-gray-600 text-sm" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-blue-600">
            ${listing.price.toFixed(2)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              listing.pricingType === "auction"
                ? "bg-red-100 text-red-700"
                : listing.pricingType === "negotiable"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {listing.pricingType}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <TbMapPin className="mr-1" />
          <span>{listing.sellerUniversity}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <TbEye className="mr-1" />
            <span>{listing.views || 0} views</span>
          </div>
          <div className="flex items-center">
            <TbCalendar className="mr-1" />
            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Listings
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchListings}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Listings</h1>
        <p className="text-gray-600">
          {pagination
            ? `${pagination.total} listings found`
            : `${listings.length} listings found`}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <TbFilter />
            <span>Filters</span>
            <TbChevronDown
              className={`transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleFilterChange();
                }}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  handleFilterChange();
                }}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {sortOrder === "asc" ? (
                  <TbSortAscending />
                ) : (
                  <TbSortDescending />
                )}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <TbGrid3X3 />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <TbList />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* University Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => {
                      setSelectedUniversity(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Universities</option>
                    {stats?.universities?.map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => {
                      setSelectedCondition(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Any Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Type
                  </label>
                  <select
                    value={selectedPricingType}
                    onChange={(e) => {
                      setSelectedPricingType(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Types</option>
                    {pricingTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onBlur={handleFilterChange}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onBlur={handleFilterChange}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TbTag className="text-blue-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalListings}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TbCurrencyDollar className="text-green-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.averagePrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TbCurrencyDollar className="text-red-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Min Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.minPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TbCurrencyDollar className="text-blue-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Max Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.maxPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton className="h-48" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !Array.isArray(listings) || listings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            No listings found
          </h2>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <AnimatePresence>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {listings.map(renderListingCard)}
            </div>
          </AnimatePresence>

          {renderPagination()}
        </>
      )}
    </div>
  );
}
