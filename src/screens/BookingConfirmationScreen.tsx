import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types';
import { RootState, AppDispatch } from '../store';
import { fetchBookingById } from '../store/slices/bookingSlice';

type BookingConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingConfirmation'>;
type BookingConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'BookingConfirmation'>;

const BookingConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<BookingConfirmationScreenNavigationProp>();
  const route = useRoute<BookingConfirmationScreenRouteProp>();
  const { bookingId } = route.params;
  
  const dispatch = useDispatch<AppDispatch>();
  const { currentBooking, isLoading } = useSelector((state: RootState) => state.bookings);

  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    setIsLoadingDetails(true);
    try {
      await dispatch(fetchBookingById(bookingId)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleShareBooking = () => {
    // TODO: Implement share functionality
    Alert.alert('Coming Soon', 'Share functionality will be available soon');
  };

  const handleAddToCalendar = () => {
    // TODO: Implement calendar integration
    Alert.alert('Coming Soon', 'Calendar integration will be available soon');
  };

  const handleContactProvider = () => {
    // TODO: Implement contact functionality
    Alert.alert('Coming Soon', 'Contact provider functionality will be available soon');
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cancel booking
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled');
          },
        },
      ]
    );
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeSlot: any): string => {
    return `${timeSlot.start} - ${timeSlot.end}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return '#34C759';
      case 'pending':
        return '#FFA500';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending Confirmation';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (isLoadingDetails || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentBooking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your booking has been confirmed. You'll receive a confirmation email shortly.
          </Text>
        </View>

        {/* Booking Details */}
        <View style={styles.bookingDetails}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{currentBooking.id}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{currentBooking.service?.name || 'Service'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{currentBooking.provider?.businessName || 'Provider'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {formatDate(currentBooking.scheduledDate)} at {formatTime(currentBooking.timeSlot)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>${currentBooking.totalAmount}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentBooking.status) }]}>
              <Text style={styles.statusText}>{getStatusText(currentBooking.status)}</Text>
            </View>
          </View>

          {currentBooking.specialInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.detailLabel}>Special Instructions</Text>
              <Text style={styles.instructionsText}>{currentBooking.specialInstructions}</Text>
            </View>
          )}
        </View>

        {/* Provider Contact */}
        <View style={styles.providerContact}>
          <Text style={styles.sectionTitle}>Provider Contact</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{currentBooking.provider?.contactPerson || 'Contact Person'}</Text>
            <Text style={styles.contactBusiness}>{currentBooking.provider?.businessName || 'Business Name'}</Text>
            <Text style={styles.contactPhone}>{currentBooking.provider?.phoneNumber || 'Phone Number'}</Text>
            <Text style={styles.contactEmail}>{currentBooking.provider?.email || 'Email Address'}</Text>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactProvider}>
            <Text style={styles.contactButtonText}>Contact Provider</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code */}
        <View style={styles.qrCodeContainer}>
          <Text style={styles.sectionTitle}>Booking QR Code</Text>
          <View style={styles.qrCode}>
            <Text style={styles.qrCodePlaceholder}>QR CODE</Text>
            <Text style={styles.qrCodeText}>Show this code to your service provider</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareBooking}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share Booking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>ℹ️</Text>
            <Text style={styles.noteText}>
              Please arrive 10 minutes before your scheduled time
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>ℹ️</Text>
            <Text style={styles.noteText}>
              Bring a valid ID for verification
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>ℹ️</Text>
            <Text style={styles.noteText}>
              Contact the provider if you need to reschedule
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {currentBooking.status === 'confirmed' && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  successHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingDetails: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  instructionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  instructionsText: {
    fontSize: 16,
    color: '#333333',
    fontStyle: 'italic',
    marginTop: 8,
  },
  providerContact: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  contactBusiness: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 16,
    color: '#007AFF',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  qrCodePlaceholder: {
    fontSize: 24,
    color: '#666666',
    marginBottom: 8,
  },
  qrCodeText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
    lineHeight: 24,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingConfirmationScreen;