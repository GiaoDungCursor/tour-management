import axios from 'axios';
import { 
  Tour, 
  Booking, 
  Review, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  BookingRequest,
  TourSearchFilters 
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<any> =>
    api.post('/auth/register', data).then(res => res.data),
};

// Tours API
export const toursAPI = {
  getAll: (): Promise<Tour[]> =>
    api.get('/tours').then(res => res.data),
  
  getById: (id: number): Promise<Tour> =>
    api.get(`/tours/${id}`).then(res => res.data),
  
  search: (filters: TourSearchFilters): Promise<Tour[]> =>
    api.get('/tours/search', { params: filters }).then(res => res.data),
  
  getUpcoming: (): Promise<Tour[]> =>
    api.get('/tours/upcoming').then(res => res.data),
  
  getOpenRegistration: (): Promise<Tour[]> =>
    api.get('/tours/open-registration').then(res => res.data),
  
  getByDestination: (destination: string): Promise<Tour[]> =>
    api.get(`/tours/destination/${destination}`).then(res => res.data),
  
  getByType: (tourType: string): Promise<Tour[]> =>
    api.get(`/tours/type/${tourType}`).then(res => res.data),
  
  getByDifficulty: (difficultyLevel: string): Promise<Tour[]> =>
    api.get(`/tours/difficulty/${difficultyLevel}`).then(res => res.data),
  
  getByPriceRange: (minPrice: number, maxPrice: number): Promise<Tour[]> =>
    api.get('/tours/price-range', { params: { minPrice, maxPrice } }).then(res => res.data),
  
  getByDurationRange: (minDuration: number, maxDuration: number): Promise<Tour[]> =>
    api.get('/tours/duration-range', { params: { minDuration, maxDuration } }).then(res => res.data),
};

// Bookings API
export const bookingsAPI = {
  create: (data: BookingRequest): Promise<Booking> =>
    api.post('/bookings', data).then(res => res.data),
  
  getUserBookings: (): Promise<Booking[]> =>
    api.get('/bookings').then(res => res.data),
  
  getById: (id: number): Promise<Booking> =>
    api.get(`/bookings/${id}`).then(res => res.data),
  
  confirm: (id: number): Promise<Booking> =>
    api.put(`/bookings/${id}/confirm`).then(res => res.data),
  
  cancel: (id: number): Promise<Booking> =>
    api.put(`/bookings/${id}/cancel`).then(res => res.data),
  
  complete: (id: number): Promise<Booking> =>
    api.put(`/bookings/${id}/complete`).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/bookings/${id}`).then(res => res.data),
};

// Reviews API
export const reviewsAPI = {
  getByTour: (tourId: number): Promise<Review[]> =>
    api.get(`/reviews/tour/${tourId}`).then(res => res.data),
  
  create: (data: { tourId: number; rating: number; comment: string }): Promise<Review> =>
    api.post('/reviews', data).then(res => res.data),
  
  update: (id: number, data: { rating: number; comment: string }): Promise<Review> =>
    api.put(`/reviews/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/reviews/${id}`).then(res => res.data),
};

export default api;
