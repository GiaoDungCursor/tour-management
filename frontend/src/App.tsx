import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Layout
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookings from './pages/MyBookings';
import CustomerDashboard from './pages/CustomerDashboard';
import ProfilePage from './pages/ProfilePage';
import ReviewsPage from './pages/ReviewsPage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminTours from './pages/admin/Tours';
import AdminBookings from './pages/admin/Bookings';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="tours" element={<ToursPage />} />
            <Route path="tours/:id" element={<TourDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected Customer Routes */}
            <Route path="my-bookings" element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            } />
            <Route path="dashboard" element={
              <PrivateRoute>
                <CustomerDashboard />
              </PrivateRoute>
            } />
            <Route path="profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="reviews" element={
              <PrivateRoute>
                <ReviewsPage />
              </PrivateRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="admin/dashboard" element={
              <PrivateRoute requireAdmin>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="admin/tours" element={
              <PrivateRoute requireAdmin>
                <AdminTours />
              </PrivateRoute>
            } />
            <Route path="admin/bookings" element={
              <PrivateRoute requireAdmin>
                <AdminBookings />
              </PrivateRoute>
            } />
            <Route path="admin/categories" element={
              <PrivateRoute requireAdmin>
                <AdminCategories />
              </PrivateRoute>
            } />
            <Route path="admin/users" element={
              <PrivateRoute requireAdmin>
                <AdminUsers />
              </PrivateRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Trang không tìm thấy</p>
                  <a href="/" className="btn-primary">Về trang chủ</a>
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
