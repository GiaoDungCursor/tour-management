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
  
  search: (filters: TourSearchFilters): Promise<Tour[]> => {
    const params = new URLSearchParams();
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.status) params.append('status', filters.status);
    return api.get(`/tours/search?${params.toString()}`).then(res => res.data);
  },
  
  getAvailable: (): Promise<Tour[]> =>
    api.get('/tours/available').then(res => res.data),
  
  getByCategory: (categoryId: number): Promise<Tour[]> =>
    api.get(`/tours/category/${categoryId}`).then(res => res.data),
  
  create: (data: TourCreateRequest): Promise<Tour> =>
    api.post('/tours', data).then(res => res.data),
  
  update: (id: number, data: Partial<TourCreateRequest>): Promise<Tour> =>
    api.put(`/tours/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/tours/${id}`).then(res => res.data),
};

// Bookings API
export const bookingsAPI = {
  create: (data: BookingRequest): Promise<Booking> =>
    api.post('/bookings', data).then(res => res.data),
  
  getAll: (): Promise<Booking[]> =>
    api.get('/bookings').then(res => res.data),
  
  getMyBookings: (): Promise<Booking[]> =>
    api.get('/bookings/my').then(res => res.data),
  
  getById: (id: number): Promise<Booking> =>
    api.get(`/bookings/${id}`).then(res => res.data),
  
  updateStatus: (id: number, status: string): Promise<Booking> =>
    api.put(`/bookings/${id}/status`, { status }).then(res => res.data),
  
  cancel: (id: number): Promise<Booking> =>
    api.put(`/bookings/${id}/cancel`).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/bookings/${id}`).then(res => res.data),
};

// Categories API
export const categoriesAPI = {
  getAll: (): Promise<Category[]> =>
    api.get('/categories').then(res => res.data),
  
  getById: (id: number): Promise<Category> =>
    api.get(`/categories/${id}`).then(res => res.data),
  
  create: (data: { name: string; description?: string }): Promise<Category> =>
    api.post('/categories', data).then(res => res.data),
  
  update: (id: number, data: { name: string; description?: string }): Promise<Category> =>
    api.put(`/categories/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/categories/${id}`).then(res => res.data),
};

// Reviews API (for future use)
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
