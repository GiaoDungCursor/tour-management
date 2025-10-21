import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  title?: string;
  message: string;
  fullScreen?: boolean;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  fullScreen = false,
  onRetry,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">{content}</div>;
  }

  return <div className="p-8">{content}</div>;
};

export default ErrorMessage;

