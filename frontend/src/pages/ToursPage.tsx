import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  MapPinIcon, 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { toursAPI, categoriesAPI } from '../services/api';
import { formatCurrency } from '../utils/format';
import { testMockData } from '../services/testMockData';
import { useQueryClient } from 'react-query';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import FilterDropdown, { FilterOption } from '../components/FilterDropdown';
import Pagination from '../components/Pagination';

const ToursPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000000 });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Manual refresh function
  const handleRefresh = () => {
    queryClient.invalidateQueries('tours');
    queryClient.invalidateQueries('categories');
    testMockData();
  };

  // Test mock data on component mount
  useEffect(() => {
    testMockData();
  }, []);

  // Force fetch data on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, forcing data fetch...');
    queryClient.invalidateQueries('tours');
    queryClient.invalidateQueries('categories');
  }, [queryClient]);

  // Fetch tours and categories
  const { data: tours, isLoading: toursLoading, error: toursError } = useQuery(
    'tours',
    async () => {
      console.log('🔍 React Query calling toursAPI.getAll...');
      try {
        const result = await toursAPI.getAll();
        console.log('✅ React Query received tours:', result);
        console.log('📊 Tours length:', result?.length);
        return result;
      } catch (error) {
        console.error('❌ React Query error:', error);
        throw error;
      }
    },
    {
      retry: 3,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Force fetch on mount
    }
  );

  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    async () => {
      console.log('React Query calling categoriesAPI.getAll...');
      const result = await categoriesAPI.getAll();
      console.log('React Query received categories:', result);
      return result;
    },
    {
      retry: 3,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: true, // Force fetch on mount
    }
  );

  // Debug: Log tours data
  console.log('🎯 Component render - Tours data:', tours);
  console.log('🎯 Component render - Tours loading:', toursLoading);
  console.log('🎯 Component render - Tours error:', toursError);
  console.log('🎯 Component render - Tours type:', typeof tours);
  console.log('🎯 Component render - Tours is array:', Array.isArray(tours));

  // Filter and search logic
  const filteredTours = useMemo(() => {
    console.log('🔍 Filtering tours - Input tours:', tours);
    console.log('🔍 Filtering tours - Tours length:', tours?.length);
    
    if (!tours) {
      console.log('❌ No tours data to filter');
      return [];
    }

    let filtered = tours.filter(tour => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!tour.name.toLowerCase().includes(searchLower) &&
            !tour.destination.toLowerCase().includes(searchLower) &&
            !(tour.description?.toLowerCase().includes(searchLower) || false)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && tour.category?.id.toString() !== selectedCategory) {
        return false;
      }

      // Price filter
      if (tour.price < priceRange.min || tour.price > priceRange.max) {
        return false;
      }

      return true;
    });

    // Sort tours
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return a.duration - b.duration;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    console.log('✅ Filtered tours result:', filtered);
    console.log('✅ Filtered tours length:', filtered.length);
    return filtered;
  }, [tours, searchTerm, selectedCategory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Category options for filter
  const categoryOptions: FilterOption[] = [
    { value: '', label: 'Tất cả danh mục' },
    ...(categories?.map(cat => ({
      value: cat.id.toString(),
      label: cat.name,
      count: tours?.filter(tour => tour.category?.id === cat.id).length
    })) || [])
  ];

  // Sort options
  const sortOptions: FilterOption[] = [
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price-low', label: 'Giá thấp đến cao' },
    { value: 'price-high', label: 'Giá cao đến thấp' },
    { value: 'duration', label: 'Thời gian' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
  ];

  if (toursLoading || categoriesLoading) {
    return <LoadingSpinner fullScreen text="Đang tải danh sách tours..." />;
  }

  if (toursError) {
    return (
      <ErrorMessage
        fullScreen
        title="Lỗi tải dữ liệu"
        message="Không thể tải danh sách tours. Vui lòng thử lại sau."
      />
    );
  }

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Khám phá các tour du lịch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tìm kiếm và đặt những chuyến du lịch tuyệt vời nhất với Smart Tour
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
            <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
            >
                  <FunnelIcon className="h-5 w-5" />
            </button>
          </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm
                  </label>
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Tìm tour theo tên, địa điểm..."
                  />
                </div>

                {/* Category Filter */}
                <FilterDropdown
                  label="Danh mục"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(Array.isArray(value) ? value[0] : value)}
                />

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={priceRange.min || ''}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Đến"
                        value={priceRange.max || ''}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 10000000 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
                    </div>
                  </div>
              </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange({ min: 0, max: 10000000 });
                  }}
                  className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Results Info */}
                <div className="text-sm text-gray-600">
                  Tìm thấy <span className="font-semibold text-gray-900">{filteredTours.length}</span> tour
                  {searchTerm && (
                    <span> cho "<span className="font-semibold">{searchTerm}</span>"</span>
          )}
        </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Refresh data"
                  >
                    🔄 Refresh
                  </button>
                  
                  {/* Sort */}
                  <FilterDropdown
                    label="Sắp xếp"
                    options={sortOptions}
                    value={sortBy}
                    onChange={(value) => setSortBy(typeof value === 'string' ? value : value[0] || '')}
                    className="w-48"
                  />
                  {/* View Mode */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Squares2X2Icon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ListBulletIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </button>
                </div>
              </div>
            </div>

            {/* Tours Grid/List */}
            {toursLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner text="Đang tải tours..." />
              </div>
            ) : paginatedTours.length > 0 ? (
              <>
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }`}>
                  {paginatedTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} viewMode={viewMode} />
            ))}
          </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={filteredTours.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
        ) : (
          <div className="text-center py-12">
                <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy tour nào
                </h3>
            <p className="text-gray-600 mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange({ min: 0, max: 10000000 });
                  }}
              className="btn-primary"
            >
                  Xóa bộ lọc
            </button>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursPage;