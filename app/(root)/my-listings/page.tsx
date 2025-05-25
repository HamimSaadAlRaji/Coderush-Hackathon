"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@heroui/react";
import {
  TbPackage,
  TbShoppingBag,
  TbPlus,
  TbTrash,
  TbEdit,
  TbCalendar,
  TbTag,
  TbCurrencyDollar,
  TbPhoto,
  TbClockHour4,
  TbCheck,
  TbX,
  TbAlertTriangle,
} from "react-icons/tb";
import { IListing } from "@/models/Listing";

export default function MyListingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/listings?sellerId=${user!.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch listings");
      }

      if (result.success) {
        setListings(result.data.listings);
      } else {
        throw new Error(result.error || "Failed to fetch listings");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchMyListings();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, user, fetchMyListings]);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete listing");
      }

      if (result.success) {
        setListings(
          listings.filter((listing) => String(listing._id) !== listingId)
        );
        alert("Listing deleted successfully");
      } else {
        throw new Error(result.error || "Failed to delete listing");
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert(
        `Error deleting listing: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <TbCheck className="text-green-600" />;
      case "sold":
        return <TbShoppingBag className="text-blue-600" />;
      case "expired":
        return <TbClockHour4 className="text-yellow-600" />;
      case "removed":
        return <TbX className="text-gray-600" />;
      default:
        return <TbAlertTriangle className="text-gray-600" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "sold":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "expired":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "removed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getApprovalStatusIcon = (approvalStatus: string) => {
    switch (approvalStatus) {
      case "approved":
        return <TbCheck className="text-green-600" />;
      case "rejected":
        return <TbX className="text-red-600" />;
      case "pending":
        return <TbClockHour4 className="text-yellow-600" />;
      default:
        return <TbAlertTriangle className="text-gray-600" />;
    }
  };

  const getApprovalStatusColor = (approvalStatus: string) => {
    switch (approvalStatus) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <Skeleton className="h-8 w-48 rounded-lg mb-2" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>

        {/* Table Header Skeleton */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-lg mb-4">
          <div className="col-span-4">
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-16 rounded-lg" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-12 rounded-lg" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-14 rounded-lg" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-16 rounded-lg" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16 rounded-lg" />
          </div>
        </div>

        {/* Listing Rows Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              {/* Mobile Layout Skeleton */}
              <div className="md:hidden space-y-4">
                <div className="flex space-x-4">
                  <Skeleton className="flex rounded-lg w-20 h-20" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16 rounded-lg" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
                <div className="flex space-x-2 pt-2 border-t">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>

              {/* Desktop Layout Skeleton */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                {/* Product Info */}
                <div className="col-span-4 flex items-center space-x-4">
                  <Skeleton className="flex rounded-lg w-16 h-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Price */}
                <div className="col-span-1">
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Created Date */}
                <div className="col-span-2">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex space-x-2 justify-center">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <TbShoppingBag className="mx-auto text-gray-400 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600">
            You need to be signed in to view your listings.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <TbAlertTriangle className="mx-auto text-red-500 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMyListings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TbShoppingBag className="mr-3 text-blue-600" />
            My Listings
          </h1>
          <p className="text-gray-600 mt-1 flex items-center">
            <TbPackage className="mr-2 text-sm" />
            Manage your marketplace listings ({listings.length} total)
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/create-listings"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 w-fit shadow-lg hover:shadow-xl"
          >
            <TbPlus className="text-lg" />
            <span>Create New Listing</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Listings */}
      {listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TbPackage className="mx-auto text-gray-400 text-8xl mb-6" />
          </motion.div>
          <h3 className="text-2xl font-medium text-gray-900 mb-3">
            No listings yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start your marketplace journey by creating your first listing and
            reach thousands of potential buyers!
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/create-listings"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <TbPlus className="mr-2 text-lg" />
              Create Your First Listing
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Table Header */}          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-lg font-medium text-gray-700 text-sm border"
          >
            <div className="col-span-3 flex items-center">
              <TbPhoto className="mr-2" />
              Product
            </div>
            <div className="col-span-2 flex items-center">
              <TbTag className="mr-2" />
              Category
            </div>
            <div className="col-span-1 flex items-center">
              <TbCurrencyDollar className="mr-2" />
              Price
            </div>
            <div className="col-span-2 flex items-center">
              <TbCheck className="mr-2" />
              Status
            </div>
            <div className="col-span-2 flex items-center">
              <TbClockHour4 className="mr-2" />
              Approval
            </div>
            <div className="col-span-1 flex items-center">
              <TbCalendar className="mr-2" />
              Created
            </div>
            <div className="col-span-1 text-center">Actions</div>
          </motion.div>

          {/* Listings Rows */}
          <AnimatePresence>
            {listings.map((listing, index) => (
              <motion.div
                key={String(listing._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => router.push(`/product/${String(listing._id)}`)}
              >
                {/* Mobile Layout */}
                <div className="md:hidden p-4 space-y-4">
                  <div className="flex space-x-4">
                    <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images.length > 0 ? (
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
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                        {listing.description}
                      </p>
                      <div className="flex items-center justify-between">                        <span className="text-lg font-bold text-gray-900">
                          ৳{listing.price.toFixed(2)}
                        </span>
                        <div
                          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            listing.status
                          )}`}
                        >
                          {getStatusIcon(listing.status)}
                          <span className="ml-1 capitalize">
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <TbTag className="mr-1" />
                      {listing.category}
                    </span>
                    <span className="flex items-center">
                      <TbCalendar className="mr-1" />
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>                  {/* Approval Status for Mobile */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Approval Status:</span>
                    <div
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getApprovalStatusColor(
                        listing.approvalStatus || 'pending'
                      )}`}
                    >
                      {getApprovalStatusIcon(listing.approvalStatus || 'pending')}
                      <span className="ml-2 capitalize">
                        {listing.approvalStatus || 'pending'}
                      </span>
                    </div>
                  </div>

                  {listing.rejectionReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">
                        <strong>Rejection Reason:</strong> {listing.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2 border-t">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        /* TODO: Implement edit functionality */
                      }}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <TbEdit className="mr-1" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteListing(String(listing._id));
                      }}
                      className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <TbTrash />
                    </motion.button>
                  </div>
                </div>                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-3 flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <TbPackage className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {listing.description}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <TbTag className="mr-1 text-xs" />
                      {listing.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="col-span-1">
                    <span className="text-lg font-bold text-gray-900 flex items-center">
                      <TbCurrencyDollar className="mr-1 text-green-600" />
                      {listing.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        listing.status
                      )}`}
                    >
                      {getStatusIcon(listing.status)}
                      <span className="ml-2 capitalize">{listing.status}</span>
                    </div>
                  </div>                  {/* Approval Status */}
                  <div className="col-span-2">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getApprovalStatusColor(
                        listing.approvalStatus || 'pending'
                      )}`}
                    >
                      {getApprovalStatusIcon(listing.approvalStatus || 'pending')}
                      <span className="ml-2 capitalize">
                        {listing.approvalStatus || 'pending'}
                      </span>
                    </div>
                    {listing.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1 truncate" title={listing.rejectionReason}>
                        {listing.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="col-span-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <TbCalendar className="mr-1" />
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex space-x-2 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        /* TODO: Implement edit functionality */
                      }}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      title="Edit listing"
                    >
                      <TbEdit className="text-sm" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteListing(String(listing._id));
                      }}
                      className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      title="Delete listing"
                    >
                      <TbTrash className="text-sm" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
