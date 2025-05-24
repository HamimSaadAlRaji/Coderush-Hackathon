"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@heroui/react";
import {
  TbSearch,
  TbFilter,
  TbSortAscending,
  TbSortDescending,
  TbGrid3X3,
  TbList,
  TbPackage,
  TbShoppingBag,
  TbTag,
  TbCurrencyDollar,
  TbMapPin,
  TbCalendar,
  TbEye,
  TbHeart,
  TbX,
  TbAdjustments,
  TbChevronDown,
  TbChevronUp,
  TbRefresh,
  TbArrowLeft,
  TbArrowRight,
  TbBookmarks,
  TbSchool,
  TbStar,
  TbStarFilled,
  TbCheck,
} from "react-icons/tb";
import { IListing } from "@/models/Listing";

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

export default function AllListingsPage() {
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
    params.set("limit", "20");
    params.set("status", "active");

    return params.toString();
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

      const queryString = buildQueryParams();
      const response = await fetch(`/api/all-listings?${queryString}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch listings");
      }

      if (result.success) {
        setListings(result.data.listings);
        setStats(result.data.stats);
        setCategoryBreakdown(result.data.categoryBreakdown);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.error || "Failed to fetch listings");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Update URL when filters change
  useEffect(() => {
    const queryString = buildQueryParams();
    const newUrl = queryString
      ? `/all-listings?${queryString}`
      : "/all-listings";
    router.replace(newUrl, { scroll: false });
  }, [buildQueryParams, router]);

  // Fetch listings when query changes
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  // Clear all filters
  const clearFilters = () => {
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

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory) count++;
    if (selectedUniversity) count++;
    if (selectedCondition) count++;
    if (selectedPricingType) count++;
    if (minPrice || maxPrice) count++;
    return count;
  }, [
    searchQuery,
    selectedCategory,
    selectedUniversity,
    selectedCondition,
    selectedPricingType,
    minPrice,
    maxPrice,
  ]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 rounded-lg mb-4" />
          <Skeleton className="h-6 w-96 rounded-lg" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border">
              <Skeleton className="h-8 w-8 rounded-lg mb-2" />
              <Skeleton className="h-6 w-16 rounded-lg mb-1" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Listings Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <TbPackage className="mx-auto text-red-500 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <TbRefresh className="mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <TbShoppingBag className="mr-3 text-blue-600" />
          All Listings
        </h1>
        <p className="text-gray-600 flex items-center">
          <TbPackage className="mr-2 text-sm" />
          Discover amazing deals from your campus community
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for items, services, or anything..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <TbSearch className="mr-2" />
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center relative"
          >
            <TbFilter className="mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </form>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-6 border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbTag className="inline mr-1" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* University Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbSchool className="inline mr-1" />
                    University
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Universities</option>
                    {stats?.universities.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbStar className="inline mr-1" />
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbCurrencyDollar className="inline mr-1" />
                    Pricing Type
                  </label>
                  <select
                    value={selectedPricingType}
                    onChange={(e) => setSelectedPricingType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Type</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="negotiable">Negotiable</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbCurrencyDollar className="inline mr-1" />
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbAdjustments className="inline mr-1" />
                    Sort By
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {sortOrder === "asc" ? (
                        <TbSortAscending />
                      ) : (
                        <TbSortDescending />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <TbX className="mr-1" />
                  Clear All
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <TbGrid3X3 />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <TbList />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <TbPackage className="mx-auto text-blue-600 text-3xl mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalListings}
            </div>
            <div className="text-sm text-gray-600">Total Listings</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <TbTag className="mx-auto text-purple-600 text-3xl mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.categories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <TbSchool className="mx-auto text-orange-600 text-3xl mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.universities.length}
            </div>
            <div className="text-sm text-gray-600">Universities</div>
          </div>
        </motion.div>
      )}

      {/* Results Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="text-gray-600">
          {pagination && (
            <>
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} listings
            </>
          )}
        </div>
      </motion.div>

      {/* Listings Grid/List */}
      {listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
        >
          <TbPackage className="mx-auto text-gray-400 text-8xl mb-6" />
          <h3 className="text-2xl font-medium text-gray-900 mb-3">
            No listings found
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Try adjusting your search criteria or filters to find what you're
            looking for.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }`}
          >
            {listings.map((listing, index) => (
              <motion.div
                key={String(listing._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => router.push(`/product/${String(listing._id)}`)}
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <>
                    <div className="relative h-48 bg-gray-200">
                      {listing.images && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <TbPackage className="text-gray-400 text-4xl" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
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
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold text-gray-900">
                          ${listing.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <TbMapPin className="mr-1" />
                          {listing.sellerUniversity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <TbTag className="mr-1" />
                          {listing.category}
                        </span>
                        <span className="flex items-center">
                          <TbCalendar className="mr-1" />
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="p-4 flex items-center space-x-4">
                    <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <TbPackage className="text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {listing.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                            {listing.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <TbTag className="mr-1" />
                              {listing.category}
                            </span>
                            <span className="flex items-center">
                              <TbMapPin className="mr-1" />
                              {listing.sellerUniversity}
                            </span>
                            <span className="flex items-center">
                              <TbCalendar className="mr-1" />
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            ${listing.price.toFixed(2)}
                          </div>
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
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center space-x-2 mt-8"
        >
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={!pagination.hasPrev}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <TbArrowLeft />
          </button>

          {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
            const pageNum = Math.max(
              1,
              Math.min(pagination.pages, currentPage - 2 + i)
            );
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage(Math.min(pagination.pages, currentPage + 1))
            }
            disabled={!pagination.hasNext}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <TbArrowRight />
          </button>
        </motion.div>
      )}
    </div>
  );
}
