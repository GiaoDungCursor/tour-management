import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { StarIcon, ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { bookingsAPI } from '../services/api';
import { Review } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { formatDate } from '../utils/format';
import toast from 'react-hot-toast';

const ReviewsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  // Get user's bookings that can be reviewed
  const { data: bookings, isLoading, error, refetch } = useQuery(
    'my-bookings-for-review',
    () => bookingsAPI.getMyBookings(),
    { initialData: [] }
  );

  // Filter bookings that are completed and can be reviewed
  const reviewableBookings = bookings?.filter(booking => 
    booking.status === 'CONFIRMED' && 
    booking.tour?.endDate && 
    new Date(booking.tour.endDate) < new Date()
  ) || [];

  // Create review mutation
  const createReviewMutation = useMutation(
    (reviewData: { bookingId: number; rating: number; comment: string }) => {
      // Mock API call - in real app, this would call reviewsAPI.create
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            bookingId: reviewData.bookingId,
            rating: reviewData.rating,
            comment: reviewData.comment,
            createdAt: new Date().toISOString(),
          });
        }, 1000);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-bookings-for-review');
        setIsCreateModalOpen(false);
        setSelectedBooking(null);
        setReviewForm({ rating: 5, comment: '' });
        toast.success('Review submitted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to submit review');
      },
    }
  );

  const handleCreateReview = (booking: any) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 5, comment: '' });
    setIsCreateModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBooking) {
      createReviewMutation.mutate({
        bookingId: selectedBooking.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading bookings..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        title="Error Loading Bookings"
        message="Could not load your bookings. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write Reviews</h1>
          <p className="text-gray-600">Share your experience and help other travelers</p>
        </div>

        {/* Reviewable Bookings */}
        <div className="space-y-6">
          {reviewableBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Available</h3>
              <p className="text-gray-600">
                You don't have any completed tours to review yet. Book a tour and complete it to write a review!
              </p>
            </div>
          ) : (
            reviewableBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={booking.tour?.imageUrl || 'https://via.placeholder.com/100'}
                        alt={booking.tour?.name || 'Tour'}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.tour?.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{booking.tour?.destination}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Completed: {formatDate(booking.tour?.endDate || '')}</span>
                          <span>•</span>
                          <span>{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCreateReview(booking)}
                      className="btn-primary"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Review Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedBooking(null);
            setReviewForm({ rating: 5, comment: '' });
          }}
          title="Write a Review"
          size="md"
        >
          {selectedBooking && (
            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Tour Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedBooking.tour.imageUrl || 'https://via.placeholder.com/60'}
                    alt={selectedBooking.tour.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedBooking.tour.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBooking.tour.destination}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <StarRating
                  rating={reviewForm.rating}
                  onRatingChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                  interactive={true}
                  size="lg"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="input-field w-full"
                  placeholder="Share your experience with this tour..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedBooking(null);
                    setReviewForm({ rating: 5, comment: '' });
                  }}
                  className="btn-outline"
                  disabled={createReviewMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createReviewMutation.isLoading || !reviewForm.comment.trim()}
                >
                  {createReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReviewsPage;
