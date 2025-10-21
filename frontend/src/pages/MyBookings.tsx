import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { bookingsAPI } from '../services/api';
import { formatCurrency, formatDate, formatDateTime } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import BookingStatusBadge from '../components/BookingStatusBadge';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: bookings, isLoading, error, refetch } = useQuery(
    'my-bookings',
    bookingsAPI.getMyBookings,
    {
      onError: (err: any) => {
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    }
  );

  const handleCancelBooking = async () => {
    if (!cancellingBookingId) return;

    try {
      await bookingsAPI.cancel(cancellingBookingId);
      toast.success('Booking cancelled successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setShowCancelDialog(false);
      setCancellingBookingId(null);
    }
  };

  const openCancelDialog = (bookingId: number) => {
    setCancellingBookingId(bookingId);
    setShowCancelDialog(true);
  };

  const filteredBookings = bookings?.filter(booking => {
    if (selectedStatus === 'ALL') return true;
    return booking.status === selectedStatus;
  }) || [];

  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === 'PENDING').length || 0,
    confirmed: bookings?.filter(b => b.status === 'CONFIRMED').length || 0,
    completed: bookings?.filter(b => b.status === 'COMPLETED').length || 0,
    cancelled: bookings?.filter(b => b.status === 'CANCELLED').length || 0,
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading your bookings..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        title="Error Loading Bookings"
        message="Unable to load your bookings. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track your tour bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-green-800">{stats.confirmed}</div>
            <div className="text-sm text-green-700">Confirmed</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-blue-800">{stats.completed}</div>
            <div className="text-sm text-blue-700">Completed</div>
          </div>
          <div className="bg-gray-50 rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-800">{stats.cancelled}</div>
            <div className="text-sm text-gray-700">Cancelled</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === 'ALL' 
                ? "You haven't made any bookings yet."
                : `No ${selectedStatus.toLowerCase()} bookings.`}
            </p>
            <button
              onClick={() => navigate('/tours')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Tours
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Tour Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {booking.tour?.name || 'Unknown Tour'}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{booking.tour?.destination}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <BookingStatusBadge status={booking.status} />
                          <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">Booking ID</div>
                          <div className="font-medium text-gray-900">#{booking.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">People</div>
                          <div className="font-medium text-gray-900 flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {booking.numberOfPeople}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Tour Date</div>
                          <div className="font-medium text-gray-900 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(booking.tour?.startDate || '')}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Total Amount</div>
                          <div className="font-bold text-primary-600">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Special Requests</div>
                          <div className="text-sm text-gray-700">{booking.specialRequests}</div>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Booked on {formatDateTime(booking.createdAt)}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => navigate(`/tours/${booking.tour?.id}`)}
                        className="flex-1 lg:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Tour
                      </button>
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => openCancelDialog(booking.id)}
                          className="flex-1 lg:flex-none bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        onConfirm={handleCancelBooking}
        onCancel={() => {
          setShowCancelDialog(false);
          setCancellingBookingId(null);
        }}
        type="danger"
      />
    </div>
  );
};

export default MyBookings;

