import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { logAction } from '../lib/audit';
import {
  MessageSquare,
  Star,
  CheckCircle,
  EyeOff,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Delete modal state
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      const fetched = [];
      snap.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() });
      });
      setReviews(fetched);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Permission denied accessing Firestore reviews.');
      } else {
        setErrorMessage(`Failed to load reviews: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (review, newStatus) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await updateDoc(doc(db, 'reviews', review.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      await logAction('UPDATE_REVIEW', review.id, {
        productName: review.productName || 'Product',
        oldStatus: review.status,
        newStatus
      });
      setSuccessMessage(`Review for "${review.productName || 'Product'}" marked as ${newStatus}.`);
      await fetchReviews();
    } catch (err) {
      console.error('Error updating review status:', err);
      setErrorMessage(`Failed to update review status: ${err?.message || 'Error'}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    setErrorMessage('');
    try {
      await deleteDoc(doc(db, 'reviews', reviewToDelete.id));
      await logAction('DELETE_REVIEW', reviewToDelete.id, {
        productName: reviewToDelete.productName || 'Product',
        reviewer: reviewToDelete.name
      });
      setSuccessMessage('Review deleted successfully.');
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      setErrorMessage(`Failed to delete review: ${err?.message || 'Error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed a sample review if reviews collection is empty
  const handleSeedSampleReview = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: 'sample-prod-1',
        productName: 'Extrovat Royal White Musk Signature Attar',
        name: 'Rahim Ahmed',
        rating: 5,
        comment: 'Absolutly stunning fragrance! Long lasting, pure white musk scent.',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await logAction('CREATE_REVIEW', 'sample-prod-1', { info: 'Sample review seeded' });
      setSuccessMessage('Sample review created.');
      await fetchReviews();
    } catch (err) {
      setErrorMessage(`Failed to seed review: ${err?.message || 'Error'}`);
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedStatus === 'All') return true;
    return (r.status || 'pending').toLowerCase() === selectedStatus.toLowerCase();
  });

  const renderStars = (rating = 5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-[#FFC933] fill-[#FFC933]' : 'text-gray-300'
          }`}
        />
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330]">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold uppercase text-[#0E1330] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#2436F5]" /> Customer Reviews
          </h1>
          <p className="text-xs font-sans text-[#5B6079] mt-0.5">
            Moderate customer product feedback. Approved reviews are displayed on product pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReviews}
            title="Reload reviews"
            className="p-2.5 bg-[#F7F8FC] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {reviews.length === 0 && !loading && (
            <button
              type="button"
              onClick={handleSeedSampleReview}
              className="px-4 py-2.5 bg-[#FFC933] hover:bg-[#e6b42d] text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0E1330]" /> Add Sample Review
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-[#0E1330] rounded-2xl flex items-center justify-between text-xs font-bold text-red-700 shadow-[2px_2px_0px_#0E1330]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="p-1 hover:bg-red-100 rounded-lg text-red-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border-2 border-[#0E1330] rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800 shadow-[2px_2px_0px_#0E1330]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="p-1 hover:bg-green-100 rounded-lg text-emerald-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-[#FFFFFF] p-4 rounded-[20px] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl px-3 py-1.5">
          <Filter className="w-4 h-4 text-[#5B6079] shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#0E1330] focus:outline-none cursor-pointer"
          >
            <option value="All">All Reviews ({reviews.length})</option>
            <option value="Pending">Pending ({reviews.filter(r => (r.status || 'pending') === 'pending').length})</option>
            <option value="Approved">Approved ({reviews.filter(r => r.status === 'approved').length})</option>
            <option value="Hidden">Hidden ({reviews.filter(r => r.status === 'hidden').length})</option>
          </select>
        </div>

        <span className="text-xs font-heading font-extrabold text-[#5B6079]">
          Showing {filteredReviews.length} review(s)
        </span>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-12 text-center space-y-3 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px]">
          <div className="w-8 h-8 border-4 border-[#2436F5] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-heading font-bold text-[#5B6079]">Loading customer reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px] p-8 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-gray-400 mx-auto" />
          <p className="text-sm font-heading font-bold text-[#0E1330]">
            No reviews match the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const status = rev.status || 'pending';
            const dateStr = rev.createdAt?.seconds
              ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString()
              : 'Recent';

            return (
              <div
                key={rev.id}
                className="bg-[#FFFFFF] p-5 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#0E1330]/10 pb-3">
                  <div>
                    <span className="text-[10px] font-heading font-black text-[#2436F5] uppercase tracking-wider">
                      Product: {rev.productName || 'Extrovat Product'}
                    </span>
                    <h3 className="font-heading font-extrabold text-sm text-[#0E1330] mt-0.5">
                      Review by {rev.name || 'Anonymous Customer'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {renderStars(rev.rating || 5)}
                    <span
                      className={`px-2.5 py-0.5 rounded-md border text-[10px] font-heading font-black uppercase ${
                        status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                          : status === 'hidden'
                          ? 'bg-gray-100 text-gray-700 border-gray-400'
                          : 'bg-amber-100 text-amber-900 border-amber-600'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-sans text-[#0E1330] leading-relaxed">
                  "{rev.comment || 'No comment text provided.'}"
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-[#5B6079]">
                  <span>Date: {dateStr}</span>

                  <div className="flex items-center gap-2">
                    {status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(rev, 'approved')}
                        className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-2 border-[#0E1330] rounded-xl font-heading font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {status !== 'hidden' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(rev, 'hidden')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-[#0E1330] rounded-xl font-heading font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setReviewToDelete(rev)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-[#0E1330] rounded-xl font-heading font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-md w-full p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative space-y-4 text-[#0E1330]">
            <button
              type="button"
              onClick={() => setReviewToDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-red-100 border-2 border-[#0E1330] rounded-2xl flex items-center justify-center text-red-600 shadow-[2px_2px_0px_#0E1330]">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">
                Delete Review Confirmation
              </h3>
              <p className="text-xs font-sans text-[#5B6079] mt-1">
                Are you sure you want to delete review by <strong className="text-[#0E1330]">"{reviewToDelete.name}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Review'}
              </button>
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="flex-1 py-2.5 bg-[#F7F8FC] hover:bg-gray-200 text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
