import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/userSlice';

type ServiceDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceDetails'>;
type ServiceDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ServiceDetails'>;

const ServiceDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ServiceDetailsScreenNavigationProp>();
  const route = useRoute<ServiceDetailsScreenRouteProp>();
  const { serviceId } = route.params;
  
  const dispatch = useDispatch<AppDispatch>();
  const { favorites } = useSelector((state: RootState) => state.user);

  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Mock service data
  const mockService = {
    id: serviceId,
    name: 'Professional Hair Cut & Styling',
    description: 'Get a professional haircut and styling service from our experienced stylists. We use high-quality products and the latest techniques to give you the perfect look.',
    category: 'Beauty',
    price: 45,
    duration: 60,
    rating: 4.8,
    reviewCount: 124,
    provider: {
      businessName: 'Beauty Salon Pro',
      contactPerson: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 89,
      isVerified: true,
    },
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    features: [
      'Professional consultation',
      'High-quality products',
      'Latest styling techniques',
      'Complimentary wash',
    ],
    requirements: [
      'Please arrive 10 minutes early',
      'Bring a photo of desired style',
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours before appointment',
    workingHours: {
      monday: [{ start: '09:00', end: '18:00', isAvailable: true }],
      tuesday: [{ start: '09:00', end: '18:00', isAvailable: true }],
      wednesday: [{ start: '09:00', end: '18:00', isAvailable: true }],
      thursday: [{ start: '09:00', end: '18:00', isAvailable: true }],
      friday: [{ start: '09:00', end: '18:00', isAvailable: true }],
      saturday: [{ start: '10:00', end: '16:00', isAvailable: true }],
      sunday: [],
    },
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  useEffect(() => {
    setIsFavorite(favorites.includes(serviceId));
  }, [favorites, serviceId]);

  const loadServiceDetails = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to fetch service details
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setService(mockService);
    } catch (error) {
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    dispatch(addToCart({
      service: service!,
      scheduledDate: selectedDate,
      timeSlot: {
        start: selectedTimeSlot,
        end: addMinutesToTime(selectedTimeSlot, service!.duration),
        isAvailable: true,
      },
    }));

    Alert.alert('Added to Cart', 'Service has been added to your cart');
  };

  const handleToggleFavorite = async () => {
    try {
      await dispatch(toggleFavorite(serviceId)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleBookNow = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    // TODO: Navigate to booking flow
    Alert.alert('Coming Soon', 'Direct booking functionality will be available soon');
  };

  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading service details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Service not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Service Image */}
        <View style={styles.imageContainer}>
          <View style={styles.serviceImage}>
            <Text style={styles.imagePlaceholder}>📸</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Service Info */}
        <View style={styles.content}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {service.rating}</Text>
            <Text style={styles.reviewCount}>({service.reviewCount} reviews)</Text>
          </View>

          <Text style={styles.price}>${service.price}</Text>
          <Text style={styles.duration}>{service.duration} minutes</Text>

          {/* Provider Info */}
          <View style={styles.providerContainer}>
            <Text style={styles.providerTitle}>Service Provider</Text>
            <Text style={styles.providerName}>{service.provider.businessName}</Text>
            <Text style={styles.providerContact}>{service.provider.contactPerson}</Text>
            <View style={styles.providerRating}>
              <Text style={styles.providerRatingText}>⭐ {service.provider.rating}</Text>
              <Text style={styles.providerReviewCount}>({service.provider.reviewCount} reviews)</Text>
              {service.provider.isVerified && (
                <Text style={styles.verifiedBadge}>✓ Verified</Text>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {service.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Requirements */}
          {service.requirements && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {service.requirements.map((requirement: string, index: number) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.requirementIcon}>ℹ️</Text>
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date & Time</Text>
            <Text style={styles.selectedDate}>{formatDate(selectedDate)}</Text>
            
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTimeSlot === time && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTimeSlot(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTimeSlot === time && styles.selectedTimeSlotText,
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            <Text style={styles.policyText}>{service.cancellationPolicy}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
  },
  imageContainer: {
    position: 'relative',
  },
  serviceImage: {
    height: 250,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 60,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    padding: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  serviceCategory: {
    fontSize: 16,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFA500',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 16,
    color: '#666666',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  providerContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  providerContact: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerRatingText: {
    fontSize: 14,
    color: '#FFA500',
    marginRight: 8,
  },
  providerReviewCount: {
    fontSize: 14,
    color: '#666666',
    marginRight: 12,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    color: '#34C759',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  requirementText: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
    lineHeight: 24,
  },
  selectedDate: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
    fontWeight: '600',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  policyText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addToCartText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  bookNowButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  bookNowText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ServiceDetailsScreen;