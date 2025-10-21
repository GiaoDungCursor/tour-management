import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { toursAPI, bookingsAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import ImageGallery from '../components/ImageGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const { data: tour, isLoading, error, refetch } = useQuery(
    ['tour', id],
    () => toursAPI.getById(Number(id)),
    {
      enabled: !!id,
    }
  );

  const handleBooking = async () => {
    if (!tour) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book a tour');
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }

    if (numberOfPeople > tour.availableSeats) {
      toast.error('Not enough seats available');
      return;
    }

    if (numberOfPeople < 1) {
      toast.error('Please select at least 1 person');
      return;
    }

    try {
      setIsBooking(true);
      const bookingData = {
        tourId: tour.id,
        numberOfPeople,
        specialRequests: specialRequests.trim() || undefined,
      };

      await bookingsAPI.create(bookingData);
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err: any) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const totalPrice = tour ? tour.price * numberOfPeople : 0;

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading tour details..." />;
  }

  if (error || !tour) {
    return (
      <ErrorMessage
        fullScreen
        title="Tour Not Found"
        message="The tour you're looking for doesn't exist or has been removed."
        onRetry={() => refetch()}
      />
    );
  }

  const images = tour.imageUrl ? [tour.imageUrl] : [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800',
  ];

  const isAvailable = tour.status === 'AVAILABLE' && tour.availableSeats > 0;

  // Parse itinerary, included, excluded (assuming they're stored as JSON strings or newline-separated)
  const itineraryItems = tour.itinerary ? tour.itinerary.split('\n').filter(item => item.trim()) : [];
  const includedItems = tour.included ? tour.included.split('\n').filter(item => item.trim()) : [];
  const excludedItems = tour.excluded ? tour.excluded.split('\n').filter(item => item.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-primary-600">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/tours')} className="hover:text-primary-600">
                Tours
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate">{tour.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={images} altText={tour.name} />

            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{tour.name}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span className="text-lg">{tour.destination}</span>
                  </div>
                </div>
                {tour.category && (
                  <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
                    {tour.category.name}
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="text-center">
                  <ClockIcon className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-semibold">{tour.duration} days</div>
                </div>
                <div className="text-center">
                  <UsersIcon className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                  <div className="text-sm text-gray-500">Available</div>
                  <div className="font-semibold">
                    {tour.availableSeats}/{tour.maxParticipants}
                  </div>
                </div>
                <div className="text-center">
                  <CalendarIcon className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                  <div className="text-sm text-gray-500">Start Date</div>
                  <div className="font-semibold">{formatDate(tour.startDate)}</div>
                </div>
                <div className="text-center">
                  <CalendarIcon className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                  <div className="text-sm text-gray-500">End Date</div>
                  <div className="font-semibold">{formatDate(tour.endDate)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {tour.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{tour.description}</p>
              </div>
            )}

            {/* Itinerary */}
            {itineraryItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {itineraryItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included / Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Included */}
              {includedItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {includedItems.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Excluded */}
              {excludedItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
                    What's Not Included
                  </h3>
                  <ul className="space-y-2">
                    {excludedItems.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <XCircleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                Important Information
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Cancellation policy: Free cancellation up to 7 days before departure</li>
                <li>• Minimum age requirement: 18 years old (unless accompanied by an adult)</li>
                <li>• Please bring valid ID/passport for verification</li>
                <li>• Tour may be subject to weather conditions</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Price per person</div>
                <div className="text-3xl font-bold text-primary-600">{formatCurrency(tour.price)}</div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                {tour.status === 'AVAILABLE' ? (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                    ✓ Available for Booking
                  </div>
                ) : tour.status === 'FULL' ? (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-center font-medium">
                    ✗ Fully Booked
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-center font-medium">
                    {tour.status}
                  </div>
                )}
              </div>

              {isAvailable && (
                <>
                  {/* Number of People */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={tour.availableSeats}
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum {tour.availableSeats} seats available
                    </p>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  {/* Total Price */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        {formatCurrency(tour.price)} × {numberOfPeople} {numberOfPeople > 1 ? 'people' : 'person'}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {isBooking ? 'Processing...' : 'Book Now'}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    You won't be charged yet. Review your booking before payment.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
