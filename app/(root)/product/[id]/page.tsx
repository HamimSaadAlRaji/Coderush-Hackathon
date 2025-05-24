"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
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
} from "react-icons/tb";
import { FaUniversity } from "react-icons/fa";
import { toast } from "sonner";

interface Listing {
  _id: string;
  title: string;
  description: string;
  category: "item" | "service";
  subCategory: string;
  price: number;
  pricingType: "fixed" | "bidding" | "hourly";
  currentBid?: number;
  bids?: Array<{
    userId: string;
    amount: number;
    createdAt: Date;
  }>;
  condition?: "new" | "likeNew" | "good" | "fair" | "poor";
  images: string[];
  sellerId: string;
  sellerUniversity: string;
  visibility: "university" | "all";
  status: "active" | "sold" | "expired" | "removed";
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  locations?: Array<{
    type: "Point";
    coordinates: [number, number];
  }>;
  editedFields?: string[];
}

interface SellerInfo {
  name: string;
  university?: string;
  rating?: number;
}

export default function ProductPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [editFormData, setEditFormData] = useState<Partial<Listing>>({});
  const [editedFields, setEditedFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch listing data from API
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch listing details
        const listingResponse = await fetch(`/api/listings/${productId}`);
        const listingResult = await listingResponse.json();

        if (!listingResponse.ok) {
          throw new Error(listingResult.error || 'Failed to fetch listing');
        }

        if (listingResult.success) {
          const listingData = listingResult.data;
          
          // Set listing data
          setListing({
            ...listingData,
            createdAt: new Date(listingData.createdAt),
            updatedAt: new Date(listingData.updatedAt),
            editedFields: []
          });
          
          // Check if current user is the owner
          setIsOwner(user?.id === listingData.sellerId);
          
          // Set initial edit form data
          setEditFormData(listingData);

          // Fetch seller information
          try {
            const sellerResponse = await fetch(`/api/users?clerkId=${listingData.sellerId}`);
            const sellerResult = await sellerResponse.json();
            
            if (sellerResponse.ok && sellerResult.success) {
              const seller = sellerResult.data;
              setSellerInfo({
                name: `${seller.firstName} ${seller.lastName}`,
                university: seller.university,
                rating: seller.rating || 4.8
              });
            } else {
              // Fallback seller info
              setSellerInfo({
                name: 'User',
                university: listingData.sellerUniversity || 'Unknown University',
                rating: 4.8
              });
            }
          } catch (sellerError) {
            console.error('Error fetching seller info:', sellerError);
            // Set fallback seller info
            setSellerInfo({
              name: 'User',
              university: listingData.sellerUniversity || 'Unknown University',
              rating: 4.8
            });
          }
        } else {
          throw new Error(listingResult.error || 'Failed to fetch listing');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (productId && isLoaded) {
      fetchListing();
    }
  }, [productId, user?.id, isLoaded]);
  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const handleEdit = (field: string, value: string | number) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (!editedFields.includes(field)) {
      setEditedFields((prev) => [...prev, field]);
    }
  };

  const saveChanges = () => {
    // In real app, send to API
    setListing((prev) =>
      prev ? { ...prev, ...editFormData, editedFields } : null
    );
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditFormData(listing);
    setEditedFields([]);
    setIsEditing(false);
  };
  const placeBid = () => {
    if (
      !bidAmount ||
      parseFloat(bidAmount) <= (listing?.currentBid || listing?.price || 0)
    ) {
      toast.error("Bid must be higher than current bid", {
        style: { background: "#fee2e2", color: "#b91c1c" }
      });
      return;
    }

    // In real app, send to API
    const newBid = {
      userId: user?.id || "current-user",
      amount: parseFloat(bidAmount),
      createdAt: new Date(),
    };

    setListing((prev) =>
      prev
        ? {
            ...prev,
            currentBid: parseFloat(bidAmount),
            bids: [...(prev.bids || []), newBid],
          }
        : null
    );

    // Show success toast
    toast.success(
      `Bid placed successfully! Your bid: $${parseFloat(bidAmount).toFixed(2)}`,
      {
        style: { background: "#dcfce7", color: "#166534" }
      }
    );

    setBidAmount("");
  };

  const startChat = () => {
    // In real app, initiate chat with seller
    alert("Chat feature would be implemented here");
  };
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (listing?.images.length || 1));
  };

  const previousImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + (listing?.images.length || 1)) % (listing?.images.length || 1)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <TbChevronLeft className="mr-1" />
        Back to Listings
      </motion.button>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Image Gallery */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
            <Image
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              fill
              style={{ objectFit: "cover" }}
              className="transition-opacity duration-300"
            />

            {listing.images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <TbChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <TbChevronRight size={20} />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {listing.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover" }}
                    className="w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing && isOwner ? (
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => handleEdit("title", e.target.value)}
                  className="text-2xl font-bold w-full border-b-2 border-blue-500 bg-transparent outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  {listing.title}
                  {listing.editedFields?.includes("title") && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Edited
                    </span>
                  )}
                </h1>
              )}

              <div className="flex items-center mt-2 text-sm text-gray-600">
                <TbClock className="mr-1" />
                Listed {listing.createdAt.toLocaleDateString()}
                {listing.updatedAt > listing.createdAt && (
                  <span className="ml-2 text-yellow-600">
                    • Updated {listing.updatedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50"
              >
                <TbHeart size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50"
              >
                <TbShare size={24} />
              </motion.button>
            </div>
          </div>

          {/* Price & Bidding */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            {listing.pricingType === "bidding" ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Bid</p>
                    <p className="text-3xl font-bold text-blue-600 flex items-center">
                      <TbCurrencyDollar />
                      {listing.currentBid?.toFixed(2) ||
                        listing.price.toFixed(2)}
                    </p>
                  </div>
                  <TbGavel className="text-blue-600 text-3xl" />
                </div>

                {!isOwner && (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        min={(listing.currentBid || listing.price) + 0.01}
                        step="0.01"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={placeBid}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
                      >
                        Bid
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum bid: $
                      {((listing.currentBid || listing.price) + 0.01).toFixed(
                        2
                      )}
                    </p>
                  </div>
                )}

                {listing.bids && listing.bids.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Recent Bids
                    </p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {listing.bids
                        .slice(-3)
                        .reverse()
                        .map((bid, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs text-gray-600"
                          >
                            <span>Bidder {bid.userId.slice(-4)}</span>
                            <span>${bid.amount.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {listing.pricingType === "hourly" ? "Hourly Rate" : "Price"}
                  </p>
                  {isEditing && isOwner ? (
                    <div className="flex items-center">
                      <TbCurrencyDollar className="text-2xl text-blue-600" />
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) =>
                          handleEdit("price", parseFloat(e.target.value))
                        }
                        className="text-2xl font-bold text-blue-600 bg-transparent border-b-2 border-blue-500 outline-none w-32"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-blue-600 flex items-center">
                      <TbCurrencyDollar />
                      {listing.price.toFixed(2)}
                      {listing.pricingType === "hourly" && (
                        <span className="text-lg">/hr</span>
                      )}
                      {listing.editedFields?.includes("price") && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Edited
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <TbTag className="text-blue-600 text-3xl" />
              </div>
            )}
          </div>          {/* Seller Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <TbUser className="mr-2 text-blue-600" />
              Seller Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <TbUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{sellerInfo?.name || 'Unknown User'}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUniversity className="mr-1" />
                      {sellerInfo?.university || listing.sellerUniversity || 'Unknown University'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-yellow-500">
                  <TbStar className="mr-1" />
                  <span className="text-sm font-medium">{sellerInfo?.rating?.toFixed(1) || '4.8'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwner ? (
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveChanges}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <TbCheck className="mr-2" />
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <TbX className="mr-2" />
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  <TbEdit className="mr-2" />
                  Edit Listing
                </motion.button>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startChat}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center shadow-lg"
            >
              <TbMessage className="mr-2" />
              Message Seller
            </motion.button>
          )}

          {/* Product Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center">
              <TbPackage className="mr-2 text-blue-600" />
              Product Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium capitalize">{listing.category}</p>
              </div>
              <div>
                <p className="text-gray-600">Subcategory</p>
                <p className="font-medium capitalize">{listing.subCategory}</p>
              </div>
              {listing.condition && (
                <div>
                  <p className="text-gray-600">Condition</p>
                  {isEditing && isOwner ? (
                    <select
                      value={editFormData.condition}
                      onChange={(e) => handleEdit("condition", e.target.value)}
                      className="font-medium capitalize border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="likeNew">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  ) : (
                    <p className="font-medium capitalize flex items-center">
                      {listing.condition}
                      {listing.editedFields?.includes("condition") && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Edited
                        </span>
                      )}
                    </p>
                  )}
                </div>
              )}
              <div>
                <p className="text-gray-600">Visibility</p>
                <p className="font-medium capitalize">{listing.visibility}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Description</p>
              {isEditing && isOwner ? (
                <textarea
                  value={editFormData.description}
                  onChange={(e) => handleEdit("description", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <p className="text-gray-900">
                  {listing.description}
                  {listing.editedFields?.includes("description") && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Edited
                    </span>
                  )}
                </p>
              )}
            </div>

            {listing.tags && listing.tags.length > 0 && (
              <div>
                <p className="text-gray-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {listing.locations && listing.locations.length > 0 && (
              <div>
                <p className="text-gray-600 mb-2 flex items-center">
                  <TbMapPin className="mr-1" />
                  Pickup Location
                </p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                  Coordinates: {listing.locations[0].coordinates[1].toFixed(4)},{" "}
                  {listing.locations[0].coordinates[0].toFixed(4)}
                  <br />
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    View on Map
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status Alerts */}
          {listing.status !== "active" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
              <TbAlertCircle className="text-yellow-600 mr-3" />
              <p className="text-yellow-800">
                This listing is currently{" "}
                <span className="font-medium">{listing.status}</span>
              </p>
            </div>
          )}

          {editedFields.length > 0 && isOwner && !isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <TbAlertCircle className="inline mr-2" />
                Some fields have been edited since the original listing. Edited
                fields are marked with "Edited" labels.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
