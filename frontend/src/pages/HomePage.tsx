import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  MapPinIcon, 
  ClockIcon, 
  UsersIcon, 
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { toursAPI } from '../services/api';
import TourCard from '../components/TourCard';

const HomePage: React.FC = () => {
  // Fetch available tours
  const { data: allTours } = useQuery('available-tours', toursAPI.getAvailable, {
    initialData: []
  });

  // Get featured tours (first 3 available tours)
  const featuredTours = allTours?.slice(0, 3) || [];

  const features = [
    {
      icon: MapPinIcon,
      title: "Smart Recommendations",
      description: "AI-powered tour suggestions based on your preferences and interests."
    },
    {
      icon: ClockIcon,
      title: "Real-time Tracking",
      description: "Track your tour progress and get live updates from your guide."
    },
    {
      icon: UsersIcon,
      title: "Group Management",
      description: "Easy group coordination and communication tools for seamless travel."
    },
    {
      icon: StarIcon,
      title: "Quality Guaranteed",
      description: "Carefully curated tours with verified guides and premium experiences."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Adventure
              <span className="block text-secondary-400">Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover amazing destinations, connect with fellow travelers, and create unforgettable memories with our smart tour management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tours" className="btn-secondary text-lg px-8 py-3">
                Explore Tours
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link to="/register" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart Tour?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel with our innovative features designed to make your journey seamless and memorable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked experiences that will take your breath away
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.length > 0 ? (
              featuredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p>No tours available at the moment. Please check back later!</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/tours" className="btn-outline text-lg px-8 py-3">
              View All Tours
              <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-200">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-200">Amazing Tours</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-200">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-primary-200">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers who have discovered amazing destinations with Smart Tour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Create Account
            </Link>
            <Link to="/tours" className="btn-outline text-lg px-8 py-3">
              Browse Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
