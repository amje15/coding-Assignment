// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: 'customer' | 'admin';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number; // in minutes
  images: string[];
  provider: ServiceProvider;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  features: string[];
  requirements?: string[];
  cancellationPolicy: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: Address;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  profileImage?: string;
  businessImages: string[];
  workingHours: WorkingHours;
  services: string[]; // Service IDs
}

// Address Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Working Hours
export interface WorkingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  isAvailable: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  providerId: string;
  status: BookingStatus;
  scheduledDate: Date;
  timeSlot: TimeSlot;
  totalAmount: number;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  rating?: number;
  review?: string;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'cash_on_service';

// Cart Types
export interface CartItem {
  serviceId: string;
  service: Service;
  quantity: number;
  scheduledDate: Date;
  timeSlot: TimeSlot;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode?: string;
}

// Review Types
export interface Review {
  id: string;
  customerId: string;
  serviceId: string;
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  isVerified: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'payment_success'
  | 'payment_failed'
  | 'review_request'
  | 'general';

// Navigation Types
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined;
  Main: undefined;
  ServiceDetails: { serviceId: string };
  BookingConfirmation: { bookingId: string };
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { phoneNumber: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface ServiceFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  availability?: {
    date: Date;
    timeSlots: TimeSlot[];
  };
  features?: string[];
}

// Search Types
export interface SearchQuery {
  query: string;
  filters: ServiceFilters;
  sortBy: 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
}

// Import TextStyle from React Native
import { TextStyle } from 'react-native';