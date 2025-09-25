import React from 'react';
import { useParams } from 'react-router-dom';

const BookingPage: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Page</h1>
          <p className="text-gray-600">Tour ID: {tourId}</p>
          <p className="text-gray-600 mt-4">This page will allow users to book the selected tour.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
