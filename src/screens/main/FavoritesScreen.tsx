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
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { fetchFavorites, toggleFavorite } from '../../store/slices/userSlice';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, isLoading } = useSelector((state: RootState) => state.user);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      await dispatch(fetchFavorites()).unwrap();
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleServicePress = (serviceId: string) => {
    navigation.navigate('ServiceDetails', { serviceId });
  };

  const handleRemoveFavorite = async (serviceId: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this service from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(toggleFavorite(serviceId)).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleBookNow = (serviceId: string) => {
    // TODO: Navigate to booking flow
    Alert.alert('Coming Soon', 'Booking functionality will be available soon');
  };

  // Mock data for demonstration
  const mockFavorites = [
    {
      id: '1',
      name: 'Hair Cut & Styling',
      provider: 'Beauty Salon Pro',
      price: 45,
      rating: 4.8,
      reviewCount: 124,
      image: '💇‍♀️',
      category: 'Beauty',
    },
    {
      id: '2',
      name: 'House Cleaning',
      provider: 'Clean Home Services',
      price: 80,
      rating: 4.9,
      reviewCount: 89,
      image: '🏠',
      category: 'Home',
    },
    {
      id: '3',
      name: 'Car Wash & Wax',
      provider: 'Auto Care Center',
      price: 35,
      rating: 4.7,
      reviewCount: 156,
      image: '🚗',
      category: 'Automotive',
    },
  ];

  const renderFavoriteItem = (service: any) => (
    <View key={service.id} style={styles.favoriteItem}>
      <TouchableOpacity
        style={styles.serviceContent}
        onPress={() => handleServicePress(service.id)}
      >
        <View style={styles.serviceImage}>
          <Text style={styles.serviceImageIcon}>{service.image}</Text>
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceProvider}>{service.provider}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
          <View style={styles.serviceRating}>
            <Text style={styles.ratingText}>⭐ {service.rating}</Text>
            <Text style={styles.reviewCount}>({service.reviewCount})</Text>
          </View>
          <Text style={styles.servicePrice}>${service.price}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.favoriteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleBookNow(service.id)}
        >
          <Text style={styles.actionButtonText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(service.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>❤️</Text>
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateText}>
        Services you favorite will appear here. Start exploring and add some services to your favorites!
      </Text>
      <TouchableOpacity style={styles.browseButton}>
        <Text style={styles.browseButtonText}>Browse Services</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.subtitle}>
          {mockFavorites.length} {mockFavorites.length === 1 ? 'service' : 'services'} saved
        </Text>
      </View>

      {/* Favorites List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading favorites...</Text>
          </View>
        ) : mockFavorites.length > 0 ? (
          <View style={styles.favoritesList}>
            {mockFavorites.map(renderFavoriteItem)}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
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
  favoritesList: {
    padding: 20,
  },
  favoriteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  serviceContent: {
    flexDirection: 'row',
    padding: 16,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceImageIcon: {
    fontSize: 32,
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
  serviceProvider: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666666',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  favoriteActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  removeButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
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

export default FavoritesScreen;