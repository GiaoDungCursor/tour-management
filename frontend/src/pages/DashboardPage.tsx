import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">User Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard! Manage your bookings and profile here.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
