// Shared domain types for the Smart Tour frontend

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

// User related types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TourStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED' | 'COMPLETED';

// Tour related types
export interface Tour {
  id: number;
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
  status: TourStatus;
  itinerary?: string;
  included?: string;
  excluded?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  category?: Category;
  rating?: number;
  reviewCount?: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Booking related types
export interface Booking {
  id: number;
  customerId?: number;
  tourId?: number;
  tour?: Tour;
  customer?: User;
  numberOfPeople: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
}

// Payment types
export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'E_WALLET';

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: string;
  paymentDate?: string;
  createdAt?: string;
}

// Review types (for future use)
export interface Review {
  id: number;
  userId: number;
  tourId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  tour?: Tour;
}

export interface AuthResponse {
  accessToken: string;
  token: string;
  tokenType: string;
  username: string;
  user: User;
  expiresIn?: number;
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
  status?: TourStatus;
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
  status?: TourStatus;
}
