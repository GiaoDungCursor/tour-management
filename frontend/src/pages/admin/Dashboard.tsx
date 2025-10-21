import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  MapIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { toursAPI, bookingsAPI, categoriesAPI } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { data: tours, isLoading: toursLoading } = useQuery('admin-tours', toursAPI.getAll);
  const { data: bookings, isLoading: bookingsLoading } = useQuery('admin-bookings', bookingsAPI.getAll);
  const { isLoading: categoriesLoading } = useQuery('admin-categories', categoriesAPI.getAll);

  const isLoading = toursLoading || bookingsLoading || categoriesLoading;

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  // Calculate statistics
  const totalTours = tours?.length || 0;
  const activeTours = tours?.filter(t => t.status === 'AVAILABLE').length || 0;
  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'PENDING').length || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'CONFIRMED').length || 0;
  const totalRevenue = bookings?.reduce((sum, b) => sum + (b.status !== 'CANCELLED' ? b.totalAmount : 0), 0) || 0;
  const paidBookings = bookings?.filter(b => b.paymentStatus === 'PAID').length || 0;

  // Recent bookings (last 5)
  const recentBookings = bookings?.slice().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5) || [];

  // Popular tours (most bookings)
  const tourBookingCounts = tours?.map(tour => ({
    tour,
    bookingCount: bookings?.filter(b => b.tour?.id === tour.id && b.status !== 'CANCELLED').length || 0
  })).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your tour management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tours */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {activeTours} active
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalTours}</div>
            <div className="text-sm text-gray-600">Total Tours</div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TicketIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-yellow-600 font-medium">
                {pendingBookings} pending
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">
                {paidBookings} paid
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{confirmedBookings}</div>
            <div className="text-sm text-gray-600">Confirmed Bookings</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {booking.tour?.name || 'Unknown Tour'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.customer?.fullName || 'Customer'} • {booking.numberOfPeople} people
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <div className={`text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'text-green-600' :
                        booking.status === 'PENDING' ? 'text-yellow-600' :
                        booking.status === 'CANCELLED' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Tours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Popular Tours</h2>
              <Link to="/admin/tours" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {tourBookingCounts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tours yet</p>
              ) : (
                tourBookingCounts.map(({ tour, bookingCount }, index) => (
                  <div key={tour.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {tour.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {tour.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{bookingCount}</div>
                      <div className="text-xs text-gray-500">bookings</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/tours"
              className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <MapIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Tours</div>
                <div className="text-sm text-gray-600">Add, edit or delete tours</div>
              </div>
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
            >
              <TicketIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-green-600">View Bookings</div>
                <div className="text-sm text-gray-600">Manage customer bookings</div>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
            >
              <CalendarIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-purple-600">Categories</div>
                <div className="text-sm text-gray-600">Manage tour categories</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

