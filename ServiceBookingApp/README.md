# ServiceBook - Service Booking Mobile App

A comprehensive React Native mobile application that allows users to discover, book, and pay for various services while providing service providers with tools to manage their offerings.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure login/registration with email and social login options
- **Service Discovery**: Browse and search services by category, location, and filters
- **Service Details**: View detailed service information, pricing, and provider details
- **Booking Management**: Book services with time slot selection and special instructions
- **Shopping Cart**: Add multiple services to cart and manage bookings
- **Payment Integration**: Multiple payment options including cards and digital wallets
- **Favorites**: Save favorite services for quick access
- **Booking History**: View past and upcoming bookings
- **Real-time Updates**: Push notifications for booking status changes
- **Reviews & Ratings**: Rate and review services

### Service Provider Features
- **Service Management**: Add, edit, and manage service offerings
- **Booking Management**: View and manage customer bookings
- **Analytics Dashboard**: Track bookings, revenue, and customer feedback
- **Profile Management**: Manage business profile and contact information

## 🛠 Technology Stack

- **Frontend**: React Native with TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **Backend**: Node.js/Express (planned)
- **Database**: MongoDB/Firebase (planned)
- **Authentication**: Firebase Auth (planned)
- **Payment**: Stripe/PayPal SDK (planned)
- **Maps**: Google Maps API (planned)

## 📱 Screens

### Authentication Flow
- Landing/Onboarding Screen
- Login Screen
- Registration Screen
- Forgot Password Screen
- OTP Verification Screen

### Main App Screens
- Home Screen with featured services
- Search Screen with filters
- Service Details Screen
- Shopping Cart Screen
- Booking Confirmation Screen
- Bookings History Screen
- Favorites Screen
- Profile Screen

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   └── main/          # Main app screens
├── navigation/         # Navigation configuration
├── store/             # Redux store and slices
│   └── slices/        # Redux slices for state management
├── types/             # TypeScript type definitions
├── services/          # API services
├── utils/             # Utility functions
└── constants/         # App constants and configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ServiceBookingApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   npx react-native run-ios
   ```

## 📦 Dependencies

### Core Dependencies
- `@react-navigation/native` - Navigation library
- `@react-navigation/bottom-tabs` - Bottom tab navigation
- `@react-navigation/stack` - Stack navigation
- `@reduxjs/toolkit` - State management
- `react-redux` - React Redux bindings
- `react-native-vector-icons` - Icon library
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screen optimization

### Development Dependencies
- `@types/react` - React TypeScript types
- `@types/react-native` - React Native TypeScript types
- `typescript` - TypeScript support

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.servicebook.com/v1
FIREBASE_API_KEY=your_firebase_api_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Add your app to the Firebase project
4. Download configuration files:
   - `google-services.json` for Android (place in `android/app/`)
   - `GoogleService-Info.plist` for iOS (place in `ios/ServiceBookingApp/`)

## 🎨 Design System

The app follows a consistent design system with:
- **Primary Color**: #007AFF (iOS Blue)
- **Typography**: System fonts with defined hierarchy
- **Spacing**: 4px base unit with consistent spacing scale
- **Components**: Reusable UI components following Material Design principles

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Platform Support

- **iOS**: 11.0+
- **Android**: API level 21+ (Android 5.0)

## 🚀 Deployment

### Android
1. Generate a signed APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. Upload to Google Play Store

### iOS
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@servicebook.com or join our Slack channel.

## 🗺 Roadmap

### Phase 1 (Current)
- [x] Basic app structure and navigation
- [x] Authentication system
- [x] Core screens and UI components
- [x] Redux state management

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] Payment processing
- [ ] Push notifications
- [ ] Maps integration

### Phase 3 (Future)
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Offline mode

---

**ServiceBook** - Making service booking simple and convenient! 🎉