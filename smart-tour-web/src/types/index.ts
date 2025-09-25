export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN' | 'GUIDE';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Tour {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number; // in days
  maxParticipants: number;
  minParticipants: number;
  tourType: 'ADVENTURE' | 'CULTURAL' | 'RELAXATION' | 'BUSINESS' | 'FAMILY' | 'SOLO' | 'GROUP';
  difficultyLevel: 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images?: TourImage[];
  itineraries?: Itinerary[];
  guide?: User;
}

export interface TourImage {
  id: number;
  tourId: number;
  imageUrl: string;
  altText: string;
  isMain: boolean;
  sortOrder: number;
}

export interface Itinerary {
  id: number;
  tourId: number;
  dayNumber: number;
  title: string;
  description: string;
  location?: string;
  activities?: string;
  meals?: string;
  accommodation?: string;
  startTime?: string;
  endTime?: string;
}

export interface Booking {
  id: number;
  userId: number;
  tourId: number;
  numberOfParticipants: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  specialRequests?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  user?: User;
  tour?: Tour;
}

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
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface BookingRequest {
  tourId: number;
  numberOfParticipants: number;
  specialRequests?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface TourSearchFilters {
  destination?: string;
  tourType?: string;
  difficultyLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
}
