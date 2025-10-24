import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Booking } from '../types';
import { formatCurrency, formatDate, formatDateTime } from '../utils/format';
import BookingStatusBadge from './BookingStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onCancel?: (bookingId: number) => void;
  onConfirm?: (bookingId: number) => void;
  className?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  showActions = false,
  onCancel,
  onConfirm,
  className = ''
}) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel?.(booking.id);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm?.(booking.id);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
              <Link to={`/tours/${booking.tour?.id}`}>{booking.tour?.name}</Link>
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{booking.tour?.destination}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {formatCurrency(booking.totalAmount)}
            </div>
            <div className="text-sm text-gray-500">total</div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center space-x-3">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{formatDate(booking.tour?.startDate || '')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{formatCurrency(booking.tour?.price || 0)} per person</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{formatDateTime(booking.createdAt)}</span>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Special Requests:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Link
              to={`/tours/${booking.tour?.id}`}
              className="btn-outline text-sm"
            >
              View Tour
            </Link>
            
            {booking.status === 'PENDING' && (
              <>
                <button
                  onClick={handleConfirm}
                  className="btn-primary bg-green-600 hover:bg-green-700 text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-primary bg-red-600 hover:bg-red-700 text-sm"
                >
                  Cancel
                </button>
              </>
            )}
            
            {booking.status === 'CONFIRMED' && (
              <button
                onClick={handleCancel}
                className="btn-outline text-sm text-red-600 hover:text-red-700"
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

