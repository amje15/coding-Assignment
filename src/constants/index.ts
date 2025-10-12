// API Configuration
export const API_BASE_URL = 'https://api.servicebook.com/v1';

// App Configuration
export const APP_NAME = 'ServiceBook';
export const APP_VERSION = '1.0.0';

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F8F8F8',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFA500',
  info: '#007AFF',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
};

// Service Categories
export const SERVICE_CATEGORIES = [
  { id: '1', name: 'Beauty', icon: '💄', color: '#FF69B4' },
  { id: '2', name: 'Health', icon: '🏥', color: '#FF6B6B' },
  { id: '3', name: 'Home', icon: '🏠', color: '#4ECDC4' },
  { id: '4', name: 'Automotive', icon: '🚗', color: '#45B7D1' },
  { id: '5', name: 'Education', icon: '📚', color: '#96CEB4' },
  { id: '6', name: 'Technology', icon: '💻', color: '#FFEAA7' },
  { id: '7', name: 'Fitness', icon: '💪', color: '#DDA0DD' },
  { id: '8', name: 'Pet Care', icon: '🐕', color: '#98D8C8' },
];

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  CASH_ON_SERVICE: 'cash_on_service',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REMINDER: 'booking_reminder',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  REVIEW_REQUEST: 'review_request',
  GENERAL: 'general',
} as const;

// Time Slots
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
];

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  FAVORITES: 'favorites',
  SETTINGS: 'settings',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 6 characters long.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
  PHONE_INVALID: 'Please enter a valid phone number.',
  BOOKING_FAILED: 'Failed to create booking. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  BOOKING_SUCCESS: 'Booking confirmed successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET: 'Password reset link sent to your email.',
} as const;