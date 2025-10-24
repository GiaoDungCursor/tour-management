import mockData from './mock-data.json';

// Debug: Log mock data
console.log('Mock data loaded:', mockData);

export interface MockDataService {
  getUsers: () => Promise<any[]>;
  getCategories: () => Promise<any[]>;
  getTours: () => Promise<any[]>;
  getBookings: () => Promise<any[]>;
  getPayments: () => Promise<any[]>;
  getReviews: () => Promise<any[]>;
  getAnalytics: () => Promise<any>;
  searchTours: (filters: any) => Promise<any[]>;
  getTourById: (id: number) => Promise<any>;
  getBookingsByUserId: (userId: number) => Promise<any[]>;
}

class MockDataServiceImpl implements MockDataService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getUsers(): Promise<any[]> {
    await this.delay(300); // Simulate API delay
    return mockData.users;
  }

  async getCategories(): Promise<any[]> {
    await this.delay(200);
    
    // Fallback data if mockData.categories is empty or undefined
    if (!mockData.categories || mockData.categories.length === 0) {
      console.warn('Mock data categories is empty, returning fallback data');
      return [
        { id: 1, name: "Du lịch biển", description: "Các tour du lịch biển" },
        { id: 2, name: "Du lịch núi", description: "Các tour du lịch núi" },
        { id: 3, name: "Du lịch thành phố", description: "Các tour du lịch thành phố" }
      ];
    }
    
    return mockData.categories;
  }

  async getTours(): Promise<any[]> {
    await this.delay(400);
    console.log('getTours called, returning:', mockData.tours);
    console.log('getTours return type:', typeof mockData.tours);
    console.log('getTours is array:', Array.isArray(mockData.tours));
    
    // Fallback data if mockData.tours is empty or undefined
    if (!mockData.tours || mockData.tours.length === 0) {
      console.warn('Mock data tours is empty, returning fallback data');
      return [
        {
          id: 1,
          name: "Phú Quốc Discovery",
          destination: "Phú Quốc",
          description: "Khám phá đảo ngọc Phú Quốc với những bãi biển tuyệt đẹp",
          price: 2500000,
          duration: 3,
          imageUrl: "https://via.placeholder.com/400x300",
          startDate: "2024-12-25",
          endDate: "2024-12-27",
          availableSeats: 20,
          maxParticipants: 25,
          status: "ACTIVE",
          categoryId: 1,
          category: { id: 1, name: "Du lịch biển" }
        }
      ];
    }
    
    console.log('Returning mock data tours:', mockData.tours);
    return mockData.tours;
  }

  async getBookings(): Promise<any[]> {
    await this.delay(300);
    return mockData.bookings;
  }

  async getPayments(): Promise<any[]> {
    await this.delay(200);
    return mockData.payments;
  }

  async getReviews(): Promise<any[]> {
    await this.delay(200);
    return mockData.reviews;
  }

  async getAnalytics(): Promise<any> {
    await this.delay(300);
    return mockData.analytics;
  }

  async searchTours(filters: any): Promise<any[]> {
    await this.delay(500);
    
    let filteredTours = [...mockData.tours];

    // Apply filters
    if (filters.destination) {
      const searchTerm = filters.destination.toLowerCase();
      filteredTours = filteredTours.filter(tour => 
        tour.destination.toLowerCase().includes(searchTerm) ||
        tour.name.toLowerCase().includes(searchTerm) ||
        tour.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.categoryId) {
      filteredTours = filteredTours.filter(tour => tour.categoryId === filters.categoryId);
    }

    if (filters.minPrice) {
      filteredTours = filteredTours.filter(tour => tour.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filteredTours = filteredTours.filter(tour => tour.price <= filters.maxPrice);
    }

    if (filters.status) {
      filteredTours = filteredTours.filter(tour => tour.status === filters.status);
    }

    return filteredTours;
  }

  async getTourById(id: number): Promise<any> {
    await this.delay(200);
    return mockData.tours.find((tour: any) => tour.id === id);
  }

  async getBookingsByUserId(userId: number): Promise<any[]> {
    await this.delay(300);
    return mockData.bookings.filter((booking: any) => booking.customerId === userId);
  }

  // Authentication methods
  async login(credentials: { username: string; password: string }): Promise<any> {
    await this.delay(500);
    
    // For mock data, accept password "123" for all users
    const user = mockData.users.find((u: any) => 
      (u.username === credentials.username || u.email === credentials.username) && 
      u.active &&
      (credentials.password === '123' || credentials.password === u.password)
    );
    
    if (user) {
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          address: user.address
        },
        token: 'mock-jwt-token-' + user.id,
        expiresIn: 3600
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async register(userData: any): Promise<any> {
    await this.delay(600);
    
    // Simulate successful registration
    const newUser = {
      id: mockData.users.length + 1,
      ...userData,
      role: 'CUSTOMER',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      user: newUser,
      token: 'mock-jwt-token-' + newUser.id,
      expiresIn: 3600
    };
  }

  async createBooking(bookingData: any): Promise<any> {
    await this.delay(800);
    
    const tour = mockData.tours.find((t: any) => t.id === bookingData.tourId);
    if (!tour) {
      throw new Error('Tour not found');
    }

    const newBooking = {
      id: mockData.bookings.length + 1,
      customerId: bookingData.customerId || 3, // Default to customer1
      customer: mockData.users.find((u: any) => u.id === 3),
      tourId: bookingData.tourId,
      tour: tour,
      numberOfPeople: bookingData.numberOfPeople,
      totalAmount: tour.price * bookingData.numberOfPeople,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      specialRequests: bookingData.specialRequests || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newBooking;
  }
}

export const mockDataService = new MockDataServiceImpl();