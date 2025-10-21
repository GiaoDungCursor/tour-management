import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Tour } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      AVAILABLE: { bg: 'bg-green-100', text: 'text-green-800' },
      FULL: { bg: 'bg-red-100', text: 'text-red-800' },
      CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800' },
    };
    const badge = badges[status] || badges.AVAILABLE;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={tour.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {getStatusBadge(tour.status)}
        </div>
        {tour.category && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-900">
            {tour.category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {tour.name}
        </h3>

        {/* Destination */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{tour.destination}</span>
        </div>

        {/* Description */}
        {tour.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tour.description}
          </p>
        )}

        {/* Tour Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{tour.duration} days</span>
          </div>
          <div className="flex items-center text-gray-600">
            <UsersIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{tour.availableSeats}/{tour.maxParticipants} seats</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="text-sm text-gray-500 mb-4">
          {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-500 text-sm">From</span>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(tour.price)}
            </div>
          </div>
          <Link
            to={`/tours/${tour.id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;

