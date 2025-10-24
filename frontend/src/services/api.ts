import axios from 'axios';
import { 
  Tour, 
  Booking, 
  Category,
  Review, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  BookingRequest,
  TourSearchFilters,
  TourCreateRequest 
} from '../types';
import { mockDataService } from './mockDataService';

const API_BASE_URL = 'http://localhost:8080/api';
const USE_MOCK_DATA = true; // Set to false when backend is ready

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    USE_MOCK_DATA ? mockDataService.login(data) : api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<any> =>
    USE_MOCK_DATA ? mockDataService.register(data) : api.post('/auth/register', data).then(res => res.data),
};

// Tours API
export const toursAPI = {
  getAll: (): Promise<Tour[]> => {
    console.log('🚀 toursAPI.getAll called, USE_MOCK_DATA:', USE_MOCK_DATA);
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data service...');
      return mockDataService.getTours().then(result => {
        console.log('📤 Mock service returned:', result);
        return result;
      });
    } else {
      console.log('🌐 Using real API...');
      return api.get('/tours').then(res => res.data);
    }
  },
  
  getById: (id: number): Promise<Tour> =>
    USE_MOCK_DATA ? mockDataService.getTourById(id) : api.get(`/tours/${id}`).then(res => res.data),
  
  search: (filters: TourSearchFilters): Promise<Tour[]> => {
    if (USE_MOCK_DATA) {
      return mockDataService.searchTours(filters);
    }
    const params = new URLSearchParams();
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.status) params.append('status', filters.status);
    return api.get(`/tours/search?${params.toString()}`).then(res => res.data);
  },
  
  getAvailable: (): Promise<Tour[]> =>
    USE_MOCK_DATA ? mockDataService.getTours() : api.get('/tours/available').then(res => res.data),
  
  getByCategory: (categoryId: number): Promise<Tour[]> =>
    USE_MOCK_DATA ? mockDataService.getTours().then(tours => tours.filter(t => t.categoryId === categoryId)) : api.get(`/tours/category/${categoryId}`).then(res => res.data),
  
  create: (data: TourCreateRequest): Promise<Tour> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.post('/tours', data).then(res => res.data),
  
  update: (id: number, data: Partial<TourCreateRequest>): Promise<Tour> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.put(`/tours/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.delete(`/tours/${id}`).then(res => res.data),
};

// Bookings API
export const bookingsAPI = {
  create: (data: BookingRequest): Promise<Booking> =>
    USE_MOCK_DATA ? mockDataService.createBooking(data) : api.post('/bookings', data).then(res => res.data),
  
  getAll: (): Promise<Booking[]> =>
    USE_MOCK_DATA ? mockDataService.getBookings() : api.get('/bookings').then(res => res.data),
  
  getMyBookings: (): Promise<Booking[]> =>
    USE_MOCK_DATA ? mockDataService.getBookingsByUserId(3) : api.get('/bookings/my').then(res => res.data),
  
  getById: (id: number): Promise<Booking> =>
    USE_MOCK_DATA ? mockDataService.getBookings().then(bookings => bookings.find(b => b.id === id)) : api.get(`/bookings/${id}`).then(res => res.data),
  
  updateStatus: (id: number, status: string): Promise<Booking> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.put(`/bookings/${id}/status`, { status }).then(res => res.data),
  
  cancel: (id: number): Promise<Booking> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.put(`/bookings/${id}/cancel`).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.delete(`/bookings/${id}`).then(res => res.data),
};

// Categories API
export const categoriesAPI = {
  getAll: (): Promise<Category[]> => {
    console.log('categoriesAPI.getAll called, USE_MOCK_DATA:', USE_MOCK_DATA);
    if (USE_MOCK_DATA) {
      console.log('Using mock data service for categories...');
      return mockDataService.getCategories();
    } else {
      console.log('Using real API for categories...');
      return api.get('/categories').then(res => res.data);
    }
  },
  
  getById: (id: number): Promise<Category> =>
    USE_MOCK_DATA ? mockDataService.getCategories().then(categories => categories.find(c => c.id === id)) : api.get(`/categories/${id}`).then(res => res.data),
  
  create: (data: { name: string; description?: string }): Promise<Category> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.post('/categories', data).then(res => res.data),
  
  update: (id: number, data: { name: string; description?: string }): Promise<Category> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.put(`/categories/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.delete(`/categories/${id}`).then(res => res.data),
};

// Reviews API (for future use)
export const reviewsAPI = {
  getByTour: (tourId: number): Promise<Review[]> =>
    USE_MOCK_DATA ? mockDataService.getReviews().then(reviews => reviews.filter(r => r.tourId === tourId)) : api.get(`/reviews/tour/${tourId}`).then(res => res.data),
  
  create: (data: { tourId: number; rating: number; comment: string }): Promise<Review> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.post('/reviews', data).then(res => res.data),
  
  update: (id: number, data: { rating: number; comment: string }): Promise<Review> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.put(`/reviews/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.delete(`/reviews/${id}`).then(res => res.data),
};

// Users API
export const usersAPI = {
  getById: (id: number): Promise<any> =>
    USE_MOCK_DATA ? mockDataService.getUsers().then(users => users.find(u => u.id === id)) : api.get(`/users/${id}`).then(res => res.data),
  
  update: (id: number, data: any): Promise<any> =>
    USE_MOCK_DATA ? Promise.reject('Not implemented in mock') : api.put(`/users/${id}`, data).then(res => res.data),
  
  getAll: (): Promise<any[]> =>
    USE_MOCK_DATA ? mockDataService.getUsers() : api.get('/users').then(res => res.data),
};

export default api;
