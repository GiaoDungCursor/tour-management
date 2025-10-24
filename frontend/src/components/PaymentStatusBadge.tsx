import React from 'react';
import { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
  PaymentStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pending',
  },
  COMPLETED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Completed',
  },
  FAILED: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Failed',
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

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = statusConfig[status] ?? statusConfig.PENDING;
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`${config.bg} ${config.text} ${sizeClass} rounded-full font-medium inline-block`}
    >
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;
