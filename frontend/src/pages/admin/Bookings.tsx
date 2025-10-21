import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { bookingsAPI } from '../../services/api';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import PaymentStatusBadge from '../../components/PaymentStatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

const Bookings: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [actionBookingId, setActionBookingId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);

  const { data: bookings, isLoading, error, refetch } = useQuery(
    'admin-bookings',
    bookingsAPI.getAll
  );

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: number; status: string }) => bookingsAPI.updateStatus(id, status),
    {
      onSuccess: () => {
        toast.success('Booking status updated');
        queryClient.invalidateQueries('admin-bookings');
        setActionBookingId(null);
        setActionType(null);
      },
      onError: () => {
        toast.error('Failed to update booking status');
      }
    }
  );

  const handleConfirmAction = () => {
    if (!actionBookingId || !actionType) return;
    
    const status = actionType === 'confirm' ? 'CONFIRMED' : 'CANCELLED';
    updateStatusMutation.mutate({ id: actionBookingId, status });
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.id.toString().includes(searchTerm) ||
      booking.tour?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || booking.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  }) || [];

  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === 'PENDING').length || 0,
    confirmed: bookings?.filter(b => b.status === 'CONFIRMED').length || 0,
    cancelled: bookings?.filter(b => b.status === 'CANCELLED').length || 0,
    completed: bookings?.filter(b => b.status === 'COMPLETED').length || 0,
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading bookings..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        title="Error Loading Bookings"
        message="Unable to load bookings. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">Manage and track all customer bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
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

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, tour name, or customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ALL">All Payments</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="PAID">Paid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    People
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">#{booking.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.customer?.fullName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{booking.customer?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.tour?.name || 'Unknown Tour'}</div>
                        <div className="text-xs text-gray-500">{booking.tour?.destination}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.numberOfPeople}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <BookingStatusBadge status={booking.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5 inline" />
                        </button>
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => {
                                setActionBookingId(booking.id);
                                setActionType('confirm');
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm Booking"
                            >
                              <CheckCircleIcon className="h-5 w-5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                setActionBookingId(booking.id);
                                setActionType('cancel');
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Booking"
                            >
                              <XMarkIcon className="h-5 w-5 inline" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Booking ID</div>
                    <div className="font-medium">#{selectedBooking.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Booking Date</div>
                    <div className="font-medium">{formatDateTime(selectedBooking.createdAt)}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Customer Information</div>
                  <div className="space-y-2">
                    <div><span className="text-gray-600">Name:</span> {selectedBooking.customer?.fullName}</div>
                    <div><span className="text-gray-600">Email:</span> {selectedBooking.customer?.email}</div>
                    {selectedBooking.customer?.phone && (
                      <div><span className="text-gray-600">Phone:</span> {selectedBooking.customer.phone}</div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Tour Information</div>
                  <div className="space-y-2">
                    <div><span className="text-gray-600">Tour:</span> {selectedBooking.tour?.name}</div>
                    <div><span className="text-gray-600">Destination:</span> {selectedBooking.tour?.destination}</div>
                    <div><span className="text-gray-600">Date:</span> {formatDate(selectedBooking.tour?.startDate || '')}</div>
                    <div><span className="text-gray-600">Duration:</span> {selectedBooking.tour?.duration} days</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Booking Details</div>
                  <div className="space-y-2">
                    <div><span className="text-gray-600">Number of People:</span> {selectedBooking.numberOfPeople}</div>
                    <div><span className="text-gray-600">Total Amount:</span> {formatCurrency(selectedBooking.totalAmount)}</div>
                    <div><span className="text-gray-600">Status:</span> <BookingStatusBadge status={selectedBooking.status} size="sm" /></div>
                    <div><span className="text-gray-600">Payment:</span> <PaymentStatusBadge status={selectedBooking.paymentStatus} size="sm" /></div>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Special Requests</div>
                    <div className="text-gray-700">{selectedBooking.specialRequests}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm/Cancel Action Dialog */}
      <ConfirmDialog
        isOpen={actionBookingId !== null && actionType !== null}
        title={actionType === 'confirm' ? 'Confirm Booking' : 'Cancel Booking'}
        message={
          actionType === 'confirm'
            ? 'Are you sure you want to confirm this booking?'
            : 'Are you sure you want to cancel this booking? This action cannot be undone.'
        }
        confirmLabel={actionType === 'confirm' ? 'Confirm' : 'Cancel Booking'}
        cancelLabel="Go Back"
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setActionBookingId(null);
          setActionType(null);
        }}
        type={actionType === 'cancel' ? 'danger' : 'info'}
      />
    </div>
  );
};

export default Bookings;

