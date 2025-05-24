"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/react";
import {
  TbMapPin,
  TbMessage,
  TbEdit,
  TbCheck,
  TbX,
  TbUser,
  TbClock,
  TbTag,
  TbHeart,
  TbShare,
  TbGavel,
  TbCurrencyDollar,
  TbPackage,
  TbChevronLeft,
  TbChevronRight,
  TbAlertCircle,
  TbStar,
  TbLoader2,
} from "react-icons/tb";
import { FaUniversity } from "react-icons/fa";
import { toast } from "sonner";

interface Listing {
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
  createdAt: Date;
  updatedAt: Date;
  editedFields: string[];
}

interface SellerInfo {
  name: string;
  university: string;
  rating: number;
}

export default function ProductPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch listing details
        const listingResponse = await fetch(`/api/listings/${productId}`);
        const listingResult = await listingResponse.json();

        if (!listingResponse.ok) {
          throw new Error(listingResult.error || "Failed to fetch listing");
        }

        if (listingResult.success) {
          const listingData = listingResult.data;

          // Set listing data
          setListing({
            ...listingData,
            createdAt: new Date(listingData.createdAt),
            updatedAt: new Date(listingData.updatedAt),
            editedFields: [],
          });

          // Check if current user is the owner
          setIsOwner(user?.id === listingData.sellerId);

          // Set initial edit form data
          setEditFormData(listingData);

          // Fetch seller information
          try {
            const sellerResponse = await fetch(
              `/api/users?clerkId=${listingData.sellerId}`
            );
            const sellerResult = await sellerResponse.json();

            if (sellerResponse.ok && sellerResult.success) {
              const seller = sellerResult.data;
              setSellerInfo({
                name: `${seller.firstName} ${seller.lastName}`,
                university: seller.university,
                rating: seller.rating || 4.8,
              });
            } else {
              // Fallback seller info
              setSellerInfo({
                name: "User",
                university:
                  listingData.sellerUniversity || "Unknown University",
                rating: 4.8,
              });
            }
          } catch (sellerError) {
            console.error("Error fetching seller info:", sellerError);
            // Set fallback seller info
            setSellerInfo({
              name: "User",
              university: listingData.sellerUniversity || "Unknown University",
              rating: 4.8,
            });
          }
        } else {
          throw new Error(listingResult.error || "Failed to fetch listing");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (productId && isLoaded) {
      fetchListing();
    }
  }, [productId, user?.id, isLoaded]);

  // Message seller function
  const handleMessageSeller = async () => {
    if (!user || !listing || isOwner) {
      if (!user) {
        toast.error("Please sign in to message the seller");
        router.push("/sign-in");
        return;
      }
      if (isOwner) {
        toast.error("You cannot message yourself");
        return;
      }
      return;
    }

    setIsMessaging(true);

    try {
      // Create or find existing conversation
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing._id,
          sellerId: listing.sellerId,
          buyerId: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create conversation");
      }

      if (result.success) {
        const conversationId = result.data._id;
        toast.success("Chat started successfully!");

        // Redirect to the conversation
        router.push(`/chat/${conversationId}`);
      } else {
        throw new Error(result.error || "Failed to create conversation");
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to start conversation"
      );
    } finally {
      setIsMessaging(false);
    }
  };

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const handleSaveEdit = async () => {
    if (!listing || !editFormData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/listings/${listing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update listing");
      }

      if (result.success) {
        setListing((prev) => (prev ? { ...prev, ...editFormData } : null));
        setIsEditing(false);
        toast.success("Listing updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update listing");
      }
    } catch (err) {
      console.error("Error updating listing:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update listing"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <TbAlertCircle className="mx-auto text-red-500 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Listing not found"}
          </h1>
          <p className="text-gray-600 mb-4">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/all-listings")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Listings
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <>
                <Image
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <TbChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <TbChevronRight />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <TbPackage className="text-gray-400 text-6xl" />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {listing.images && listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            {isEditing && isOwner ? (
              <input
                type="text"
                value={editFormData.title || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                className="text-3xl font-bold text-gray-900 w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                {listing.title}
              </h1>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">
                  ${listing.price.toFixed(2)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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

              {isOwner && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {isEditing ? <TbX /> : <TbEdit />}
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <TbTag className="mr-1" />
                {listing.category}
              </span>
              <span className="flex items-center">
                <TbMapPin className="mr-1" />
                {listing.sellerUniversity}
              </span>
              <span className="flex items-center">
                <TbClock className="mr-1" />
                {listing.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            {isEditing && isOwner ? (
              <textarea
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            )}
          </div>

          {/* Seller Information */}
          {sellerInfo && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Seller Information
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {sellerInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {sellerInfo.name}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaUniversity className="text-xs" />
                      <span>{sellerInfo.university}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TbStar className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">
                    {sellerInfo.rating}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isEditing && isOwner ? (
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <TbLoader2 className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <TbCheck className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            ) : !isOwner ? (
              <>
                <button
                  onClick={handleMessageSeller}
                  disabled={isMessaging}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isMessaging ? (
                    <>
                      <TbLoader2 className="mr-2 animate-spin" />
                      Starting Chat...
                    </>
                  ) : (
                    <>
                      <TbMessage className="mr-2" />
                      Message Seller
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <TbHeart />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <TbShare />
                    <span>Share</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-600">
                <TbUser className="mx-auto text-2xl mb-2" />
                <p>This is your listing</p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-medium capitalize">{listing.status}</p>
              </div>
              <div>
                <span className="text-gray-600">Views:</span>
                <p className="font-medium">{listing.views || 0}</p>
              </div>
              {listing.condition && (
                <div>
                  <span className="text-gray-600">Condition:</span>
                  <p className="font-medium">{listing.condition}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600">Listed:</span>
                <p className="font-medium">
                  {listing.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>

            {listing.tags && listing.tags.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {listing.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
