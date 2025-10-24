import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  MapPinIcon,
  TicketIcon,
  CalendarIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  BellIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { bookingsAPI, toursAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TourCard from '../components/TourCard';
import BookingStatusBadge from '../components/BookingStatusBadge';

const CustomerDashboard: React.FC = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Fetch user's bookings
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery(
    'my-bookings',
    bookingsAPI.getMyBookings,
    {
      initialData: []
    }
  );

  // Fetch upcoming tours
  const { data: upcomingTours, isLoading: toursLoading } = useQuery(
    'upcoming-tours',
    toursAPI.getAvailable,
    {
      initialData: []
    }
  );

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!bookings) return { totalBookings: 0, upcomingBookings: 0, completedBookings: 0, totalSpent: 0 };
    
    const totalBookings = bookings.length;
    const upcomingBookings = bookings.filter(booking => 
      booking.status === 'CONFIRMED' || booking.status === 'PENDING'
    ).length;
    const completedBookings = bookings.filter(booking => 
      booking.status === 'COMPLETED'
    ).length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    return { totalBookings, upcomingBookings, completedBookings, totalSpent };
  }, [bookings]);

  // Get recent bookings (last 3)
  const recentBookings = bookings?.slice(0, 3) || [];

  // Get upcoming tours (first 3)
  const featuredTours = upcomingTours?.slice(0, 3) || [];

  if (bookingsLoading) {
    return <LoadingSpinner fullScreen text="Đang tải dashboard..." />;
  }

  if (bookingsError) {
    return (
      <ErrorMessage
        fullScreen
        title="Lỗi tải dữ liệu"
        message="Không thể tải thông tin dashboard. Vui lòng thử lại sau."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Xin chào, {user?.fullName || user?.username}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Chào mừng bạn quay trở lại với Smart Tour
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-lg">
                <BellIcon className="h-6 w-6" />
              </button>
              <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <UserIcon className="h-6 w-6" />
                <span className="hidden sm:block">Hồ sơ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TicketIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">
                Tổng cộng
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Tổng số booking</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">
                Sắp tới
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</div>
            <div className="text-sm text-gray-600">Tours sắp tới</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-600 font-medium">
                Hoàn thành
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedBookings}</div>
            <div className="text-sm text-gray-600">Tours đã hoàn thành</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-orange-600 font-medium">
                Đã chi
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</div>
            <div className="text-sm text-gray-600">Tổng chi phí</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Bookings gần đây</h2>
                <Link 
                  to="/my-bookings" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  Xem tất cả
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <MapPinIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.tour?.name}</h3>
                          <p className="text-sm text-gray-600">
                            {booking.numberOfPeople} người • {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookingStatusBadge status={booking.status} />
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có booking nào
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bắt đầu khám phá và đặt tour đầu tiên của bạn
                  </p>
                  <Link to="/tours" className="btn-primary">
                    Khám phá tours
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Featured Tours */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hành động nhanh</h2>
              <div className="space-y-3">
                <Link 
                  to="/tours" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MapPinIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <span>Khám phá tours</span>
                </Link>
                <Link 
                  to="/my-bookings" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <TicketIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <span>Xem bookings</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UserIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <span>Cập nhật hồ sơ</span>
                </Link>
                <Link 
                  to="/reviews" 
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <StarIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <span>Viết đánh giá</span>
                </Link>
              </div>
            </div>

            {/* Featured Tours */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Tours nổi bật</h2>
                <Link 
                  to="/tours" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Xem tất cả
                </Link>
              </div>
              
              {featuredTours.length > 0 ? (
                <div className="space-y-4">
                  {featuredTours.map((tour) => (
                    <div key={tour.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <img
                        src={tour.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                        alt={tour.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{tour.name}</h3>
                        <p className="text-sm text-gray-600">{tour.destination}</p>
                        <p className="text-sm font-semibold text-primary-600">
                          {formatCurrency(tour.price)}
                        </p>
                      </div>
                      <Link
                        to={`/tours/${tour.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">Không có tours nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
