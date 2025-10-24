import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  UserIcon,
  TicketIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import NotificationCenter, { useNotifications } from './NotificationCenter';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications, removeNotification, markAsRead, markAllAsRead, clearAll } = useNotifications();

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { name: 'Home', path: '/', icon: MapPinIcon },
    { name: 'Tours', path: '/tours', icon: MagnifyingGlassIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Smart Tour</span>
                <div className="text-xs text-gray-500 -mt-1">Travel Management</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Main Navigation */}
            <div className="flex items-center space-x-1 mr-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Notifications */}
            {isLoggedIn && (
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onRemove={removeNotification}
                onClearAll={clearAll}
              />
            )}

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="hidden lg:block">{user?.fullName}</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>

                    {/* Customer Menu */}
                    <Link 
                      to="/my-bookings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <TicketIcon className="h-4 w-4 mr-3" />
                      My Bookings
                    </Link>
                    <Link 
                      to="/reviews" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-3" />
                      Write Reviews
                    </Link>

                    {/* Admin Menu */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                        <Link 
                          to="/admin/dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-3" />
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/tours" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <MapPinIcon className="h-4 w-4 mr-3" />
                          Manage Tours
                        </Link>
                        <Link 
                          to="/admin/bookings" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <TicketIcon className="h-4 w-4 mr-3" />
                          Manage Bookings
                        </Link>
                        <Link 
                          to="/admin/categories" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-3" />
                          Categories
                        </Link>
                        <Link 
                          to="/admin/users" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          Manage Users
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-600 p-2 rounded-lg">
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-gray-900">Smart Tour</span>
                      <div className="text-xs text-gray-500 -mt-1">Travel Management</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Main Navigation */}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                      isActive(item.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}

                {/* User Section */}
                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {/* User Info */}
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>

                    {/* Customer Menu */}
                    <Link 
                      to="/my-bookings" 
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <TicketIcon className="h-5 w-5 mr-3" />
                      My Bookings
                    </Link>
                    <Link 
                      to="/reviews" 
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-3" />
                      Write Reviews
                    </Link>

                    {/* Admin Menu */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                        <Link 
                          to="/admin/dashboard" 
                          className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-3" />
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/tours" 
                          className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <MapPinIcon className="h-5 w-5 mr-3" />
                          Manage Tours
                        </Link>
                        <Link 
                          to="/admin/bookings" 
                          className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <TicketIcon className="h-5 w-5 mr-3" />
                          Manage Bookings
                        </Link>
                        <Link 
                          to="/admin/categories" 
                          className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-3" />
                          Categories
                        </Link>
                        <Link 
                          to="/admin/users" 
                          className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserIcon className="h-5 w-5 mr-3" />
                          Manage Users
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link 
                      to="/login" 
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
