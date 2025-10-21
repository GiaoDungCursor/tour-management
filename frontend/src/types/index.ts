// User related types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Tour related types
export interface Tour {
  id: number;
  name: string;
  description?: string;
  destination: string;
  duration: number; // số ngày
  price: number;
  maxParticipants: number;
  availableSeats: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  status: 'AVAILABLE' | 'FULL' | 'CANCELLED' | 'COMPLETED';
  itinerary?: string; // lịch trình chi tiết (text)
  included?: string; // bao gồm (text)
  excluded?: string; // không bao gồm (text)
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Booking related types
export interface Booking {
  id: number;
  tour?: Tour;
  customer?: User;
  numberOfPeople: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
}

// Payment types
export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  paymentDate: string;
}

// Review types (for future use)
export interface Review {
  id: number;
  userId: number;
  tourId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  tour?: Tour;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export interface BookingRequest {
  tourId: number;
  numberOfPeople: number;
  specialRequests?: string;
}

export interface TourSearchFilters {
  destination?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  status?: 'AVAILABLE' | 'FULL' | 'CANCELLED' | 'COMPLETED';
}

// For tour creation/update (admin)
export interface TourCreateRequest {
  name: string;
  description?: string;
  destination: string;
  duration: number;
  price: number;
  maxParticipants: number;
  availableSeats: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  itinerary?: string;
  included?: string;
  excluded?: string;
  categoryId?: number;
}
