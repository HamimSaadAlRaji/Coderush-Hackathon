'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Listing {
  _id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  pricingType: string;
  images: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  seller: {
    firstName: string;
    lastName: string;
    email: string;
    university: string;
  };
  rejectionReason?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    listings: Listing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    statusBreakdown: Array<{ _id: string; count: number }>;
  };
  message: string;
}

export default function AdminPanel() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [statusBreakdown, setStatusBreakdown] = useState<Array<{ _id: string; count: number }>>([]);
  const [actionLoading, setActionLoading] = useState<string>('');  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
      return;
    }
    
    const fetchListings = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10'
        });
        
        if (filterStatus) {
          queryParams.append('approvalStatus', filterStatus);
        }

        const response = await fetch(`/api/admin/listings?${queryParams}`);
        const data: ApiResponse = await response.json();

        if (data.success) {
          setListings(data.data.listings);
          setTotalPages(data.data.pagination.pages);
          setStatusBreakdown(data.data.statusBreakdown);
        } else {
          setError(data.message || 'Failed to fetch listings');
          if (response.status === 401) {
            router.push('/');
          }
        }
      } catch (err) {
        setError('An error occurred while fetching listings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoaded && userId) {
      fetchListings();
    }
  }, [isLoaded, userId, currentPage, filterStatus, router]);
  const handleApproval = async (listingId: string, action: 'approve' | 'reject', rejectionReason?: string) => {
    try {
      setActionLoading(listingId);
      const response = await fetch('/api/admin/listings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          action,
          rejectionReason
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Trigger a re-fetch by updating a dependency
        setCurrentPage(currentPage);
      } else {
        setError(data.error || 'Failed to update listing');
      }
    } catch (err) {
      setError('An error occurred while updating the listing');
      console.error(err);
    } finally {
      setActionLoading('');
    }
  };

  const handleReject = (listingId: string) => {
    const reason = prompt('Please provide a reason for rejecting this listing:');
    if (reason && reason.trim()) {
      handleApproval(listingId, 'reject', reason.trim());
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel - Listing Management</h1>
          <p className="text-gray-600">Review and manage marketplace listings</p>
        </div>        {/* Status Breakdown */}
        {statusBreakdown.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {statusBreakdown.map((status) => (
              <div key={status._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {status._id === 'pending' && <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"><span className="text-yellow-600 font-bold">P</span></div>}
                    {status._id === 'approved' && <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span className="text-green-600 font-bold">A</span></div>}
                    {status._id === 'rejected' && <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><span className="text-red-600 font-bold">R</span></div>}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold capitalize text-gray-700">{status._id} Listings</h3>
                    <p className="text-3xl font-bold text-blue-600">{status.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="grid gap-6">
              {listings.map((listing) => (
                <div key={listing._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Images */}
                    <div className="lg:w-1/4">
                      {listing.images.length > 0 && (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Listing Details */}
                    <div className="lg:w-1/2">                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(listing.approvalStatus)}`}>
                          {(listing.approvalStatus || 'pending').toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-3">{listing.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Category:</span> {listing.category} - {listing.subCategory}
                        </div>                        <div>
                          <span className="font-medium">Price:</span> ৳{listing.price} ({listing.pricingType})
                        </div>
                        <div>
                          <span className="font-medium">Seller:</span> {listing.seller.firstName} {listing.seller.lastName}
                        </div>
                        <div>
                          <span className="font-medium">University:</span> {listing.seller.university}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {listing.seller.email}
                        </div>
                        <div>
                          <span className="font-medium">Posted:</span> {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {listing.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <span className="font-medium text-red-800">Rejection Reason:</span>
                          <p className="text-red-700 mt-1">{listing.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/4">
                      {listing.approvalStatus === 'pending' && (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => handleApproval(listing._id, 'approve')}
                            disabled={actionLoading === listing._id}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                          >
                            {actionLoading === listing._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(listing._id)}
                            disabled={actionLoading === listing._id}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                          >
                            {actionLoading === listing._id ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      )}
                      
                      {listing.approvalStatus === 'approved' && (
                        <div className="text-center">
                          <span className="text-green-600 font-medium">✓ Approved</span>
                        </div>
                      )}
                      
                      {listing.approvalStatus === 'rejected' && (
                        <div className="text-center">
                          <span className="text-red-600 font-medium">✗ Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {listings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No listings found for the selected criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
