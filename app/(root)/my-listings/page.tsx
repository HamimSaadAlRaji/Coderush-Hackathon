"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TbPackage, TbShoppingBag, TbPlus, TbTrash, TbEdit } from "react-icons/tb";
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
        throw new Error(result.error || 'Failed to fetch listings');
      }

      if (result.success) {
        setListings(result.data.listings);
      } else {
        throw new Error(result.error || 'Failed to fetch listings');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listings');
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
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete listing');
      }

      if (result.success) {        // Remove the listing from state
        setListings(listings.filter(listing => String(listing._id) !== listingId));
        alert('Listing deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert(`Error deleting listing: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your listings.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMyListings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TbShoppingBag className="mr-2 text-blue-600" />
            My Listings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your marketplace listings
          </p>
        </div>
        <Link
          href="/create-listings"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 w-fit"
        >
          <TbPlus className="text-lg" />
          <span>Create New Listing</span>
        </Link>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <TbPackage className="mx-auto text-gray-400 text-6xl mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Start selling by creating your first listing!</p>
          <Link
            href="/create-listings"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            <TbPlus className="mr-2" />
            Create Your First Listing
          </Link>
        </div>
      ) : (        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <motion.div
              key={String(listing._id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/product/${String(listing._id)}`)}
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {listing.images.length > 0 ? (
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
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${{
                      active: 'bg-green-100 text-green-800',
                      sold: 'bg-blue-100 text-blue-800',
                      expired: 'bg-yellow-100 text-yellow-800',
                      removed: 'bg-gray-100 text-gray-800',
                    }[listing.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {listing.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {listing.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${listing.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {listing.category}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Created: {new Date(listing.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking edit
                      /* TODO: Implement edit functionality */
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <TbEdit className="mr-1" />
                    Edit
                  </button>                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking delete
                      handleDeleteListing(String(listing._id));
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <TbTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
