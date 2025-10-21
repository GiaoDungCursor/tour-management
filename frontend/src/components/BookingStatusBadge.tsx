import React from 'react';

interface BookingStatusBadgeProps {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  size?: 'sm' | 'md' | 'lg';
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    PENDING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    CONFIRMED: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Confirmed',
    },
    CANCELLED: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled',
    },
    COMPLETED: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Completed',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const config = statusConfig[status];
  const sizeClass = sizeClasses[size];

  return (
    <span className={`${config.bg} ${config.text} ${sizeClass} rounded-full font-medium inline-block`}>
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;

