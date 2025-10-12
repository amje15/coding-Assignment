import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList, BookingStatus } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { fetchBookings, updateBookingStatus } from '../../store/slices/bookingSlice';

type BookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<BookingsScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadBookings();
  }, [selectedTab]);

  const loadBookings = async () => {
    try {
      const status = selectedTab === 'upcoming' ? 'confirmed' : 'completed';
      await dispatch(fetchBookings({ status })).unwrap();
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('BookingConfirmation', { bookingId });
  };

  const handleCancelBooking = async (bookingId: string) => {
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
          onPress: async () => {
            try {
              await dispatch(updateBookingStatus({
                bookingId,
                status: 'cancelled',
                cancellationReason: 'Cancelled by customer',
              })).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRescheduleBooking = (bookingId: string) => {
    // TODO: Navigate to reschedule screen
    Alert.alert('Coming Soon', 'Reschedule functionality will be available soon');
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'confirmed':
        return '#007AFF';
      case 'in_progress':
        return '#FFA500';
      case 'completed':
        return '#34C759';
      case 'cancelled':
        return '#FF3B30';
      case 'pending':
        return '#FFA500';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: BookingStatus): string => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      case 'no_show':
        return 'No Show';
      default:
        return status;
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeSlot: any): string => {
    return `${timeSlot.start} - ${timeSlot.end}`;
  };

  const renderBookingItem = (booking: any) => (
    <TouchableOpacity
      key={booking.id}
      style={styles.bookingItem}
      onPress={() => handleBookingPress(booking.id)}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{booking.service?.name || 'Service'}</Text>
          <Text style={styles.providerName}>{booking.provider?.businessName || 'Provider'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {formatDate(booking.scheduledDate)} at {formatTime(booking.timeSlot)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>${booking.totalAmount}</Text>
        </View>
        {booking.specialInstructions && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📝</Text>
            <Text style={styles.detailText} numberOfLines={2}>
              {booking.specialInstructions}
            </Text>
          </View>
        )}
      </View>

      {selectedTab === 'upcoming' && booking.status === 'confirmed' && (
        <View style={styles.bookingActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRescheduleBooking(booking.id)}
          >
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelBooking(booking.id)}
          >
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>
        {selectedTab === 'upcoming' ? '📅' : '📋'}
      </Text>
      <Text style={styles.emptyStateTitle}>
        {selectedTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
      </Text>
      <Text style={styles.emptyStateText}>
        {selectedTab === 'upcoming'
          ? 'You don\'t have any upcoming bookings. Start exploring services!'
          : 'Your completed bookings will appear here.'}
      </Text>
      {selectedTab === 'upcoming' && (
        <TouchableOpacity style={styles.browseButton}>
          <Text style={styles.browseButtonText}>Browse Services</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : bookings.length > 0 ? (
          <View style={styles.bookingsList}>
            {bookings.map(renderBookingItem)}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  bookingsList: {
    padding: 20,
  },
  bookingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#666666',
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
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingsScreen;