import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { bookingsAPI } from '../../services/api';
import { Booking } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import PaymentStatusBadge from '../../components/PaymentStatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format';
import toast from 'react-hot-toast';

const AdminBookings: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings
  const { data: bookings, isLoading, error, refetch } = useQuery(
    'admin-bookings',
    bookingsAPI.getAll,
    { initialData: [] }
  );

  // Update booking status mutation
  const updateStatusMutation = useMutation(
    ({ id, status }: { id: number; status: string }) => 
      bookingsAPI.updateStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-bookings');
        toast.success('Booking status updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update booking status');
      },
    }
  );

  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.tour?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Table columns
  const columns = [
    {
      key: 'customer',
      title: 'Customer',
      render: (value: any, record: Booking) => (
        <div>
          <div className="font-medium text-gray-900">{record.customer?.fullName}</div>
          <div className="text-sm text-gray-500">{record.customer?.email}</div>
        </div>
      ),
    },
    {
      key: 'tour',
      title: 'Tour',
      render: (value: any, record: Booking) => (
        <div>
          <div className="font-medium text-gray-900">{record.tour?.name}</div>
          <div className="text-sm text-gray-500">{record.tour?.destination}</div>
        </div>
      ),
    },
    {
      key: 'numberOfPeople',
      title: 'People',
      render: (value: number) => (
        <span className="font-medium">{value} {value === 1 ? 'person' : 'people'}</span>
      ),
    },
    {
      key: 'totalAmount',
      title: 'Total Amount',
      render: (value: number) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => <BookingStatusBadge status={value as any} />,
    },
    {
      key: 'paymentStatus',
      title: 'Payment',
      render: (value: string) => <PaymentStatusBadge status={value as any} />,
    },
    {
      key: 'createdAt',
      title: 'Booked Date',
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, record: Booking) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(record)}
            className="text-blue-600 hover:text-blue-900"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {record.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleUpdateStatus(record.id, 'CONFIRMED')}
                className="text-green-600 hover:text-green-900"
                title="Confirm"
              >
                <CheckCircleIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(record.id, 'CANCELLED')}
                className="text-red-600 hover:text-red-900"
                title="Cancel"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Statistics
  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === 'PENDING').length || 0,
    confirmed: bookings?.filter(b => b.status === 'CONFIRMED').length || 0,
    cancelled: bookings?.filter(b => b.status === 'CANCELLED').length || 0,
    totalRevenue: bookings?.reduce((sum, b) => sum + b.totalAmount, 0) || 0,
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading bookings..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        title="Error Loading Bookings"
        message="Could not load bookings data. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage customer bookings and payments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, or tour name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredBookings}
          columns={columns}
          emptyMessage="No bookings found"
          className="shadow-lg"
        />

        {/* Booking Details Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedBooking(null);
          }}
          title="Booking Details"
          size="lg"
        >
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedBooking.customer?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedBooking.customer?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedBooking.customer?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Tour Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tour:</span>
                    <span className="font-medium">{selectedBooking.tour?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{selectedBooking.tour?.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedBooking.tour?.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(selectedBooking.tour?.startDate || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(selectedBooking.tour?.endDate || '')}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of People:</span>
                    <span className="font-medium">{selectedBooking.numberOfPeople}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Person:</span>
                    <span className="font-medium">{formatCurrency(selectedBooking.tour?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">{formatCurrency(selectedBooking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <BookingStatusBadge status={selectedBooking.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <PaymentStatusBadge status={selectedBooking.paymentStatus} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked Date:</span>
                    <span className="font-medium">{formatDateTime(selectedBooking.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedBooking(null);
                  }}
                  className="btn-outline"
                >
                  Close
                </button>
                {selectedBooking.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedBooking.id, 'CONFIRMED');
                        setIsDetailModalOpen(false);
                        setSelectedBooking(null);
                      }}
                      className="btn-primary bg-green-600 hover:bg-green-700"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedBooking.id, 'CANCELLED');
                        setIsDetailModalOpen(false);
                        setSelectedBooking(null);
                      }}
                      className="btn-primary bg-red-600 hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminBookings;