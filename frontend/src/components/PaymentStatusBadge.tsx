import React from 'react';

interface PaymentStatusBadgeProps {
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  size?: 'sm' | 'md' | 'lg';
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    UNPAID: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Unpaid',
    },
    PARTIAL: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Partial',
    },
    PAID: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Paid',
    },
    REFUNDED: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Refunded',
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

export default PaymentStatusBadge;

