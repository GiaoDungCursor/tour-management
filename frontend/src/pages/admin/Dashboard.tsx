import React from 'react';
import { useQuery } from 'react-query';
import {
  ChartBarIcon,
  UsersIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { toursAPI, bookingsAPI, categoriesAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { formatCurrency, formatDate } from '../../utils/format';

const AdminDashboard: React.FC = () => {
  const { data: tours, isLoading: toursLoading, error: toursError, refetch: refetchTours } = useQuery(
    'admin-dashboard-tours',
    toursAPI.getAll,
    { initialData: [] }
  );

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useQuery(
    'admin-dashboard-bookings',
    bookingsAPI.getAll,
    { initialData: [] }
  );

  const { data: categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery(
    'admin-dashboard-categories',
    categoriesAPI.getAll,
    { initialData: [] }
  );

  if (toursLoading || bookingsLoading || categoriesLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (toursError || bookingsError || categoriesError) {
    return (
      <ErrorMessage
        fullScreen
        title="Error Loading Dashboard"
        message="Could not load dashboard data. Please try again."
        onRetry={() => { refetchTours(); refetchBookings(); refetchCategories(); }}
      />
    );
  }

  // Calculate statistics
  const stats = {
    totalTours: tours?.length || 0,
    activeTours: tours?.filter(tour => tour.status === 'AVAILABLE').length || 0,
    totalBookings: bookings?.length || 0,
    pendingBookings: bookings?.filter(booking => booking.status === 'PENDING').length || 0,
    confirmedBookings: bookings?.filter(booking => booking.status === 'CONFIRMED').length || 0,
    cancelledBookings: bookings?.filter(booking => booking.status === 'CANCELLED').length || 0,
    totalRevenue: bookings?.reduce((sum, booking) => sum + booking.totalAmount, 0) || 0,
    totalCategories: categories?.length || 0,
  };

  // Recent bookings
  const recentBookings = bookings?.slice(0, 5) || [];

  // Popular tours (by number of bookings)
  const tourBookingCounts = bookings?.reduce((acc, booking) => {
    if (booking.tour?.id) {
      acc[booking.tour.id] = (acc[booking.tour.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>) || {};

  const popularTours = tours?.map(tour => ({
    ...tour,
    bookingCount: tourBookingCounts[tour.id] || 0,
  })).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of your tour management system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTours}</p>
                <p className="text-sm text-gray-500">{stats.activeTours} active</p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                <p className="text-sm text-gray-500">{stats.pendingBookings} pending</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-gray-500">All time</p>
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
                <p className="text-sm text-gray-500">Tour types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Booking Status Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Confirmed</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.confirmedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.cancelledBookings}</span>
              </div>
            </div>
          </div>

          {/* Tour Status Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.activeTours}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Full</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {tours?.filter(tour => tour.status === 'FULL').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {tours?.filter(tour => tour.status === 'CANCELLED').length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/tours"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Manage Tours
              </a>
              <a
                href="/admin/bookings"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                View Bookings
              </a>
              <a
                href="/admin/categories"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Manage Categories
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent bookings</p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer?.fullName}</p>
                      <p className="text-sm text-gray-600">{booking.tour?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Tours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tours</h3>
            <div className="space-y-3">
              {popularTours.length === 0 ? (
                <p className="text-gray-500 text-sm">No tours available</p>
              ) : (
                popularTours.map((tour) => (
                  <div key={tour.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{tour.name}</p>
                      <p className="text-sm text-gray-600">{tour.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{tour.bookingCount} bookings</p>
                      <p className="text-xs text-gray-500">{formatCurrency(tour.price)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;