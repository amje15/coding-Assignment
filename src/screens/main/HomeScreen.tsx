import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { fetchFeaturedServices, fetchCategories } from '../../store/slices/serviceSlice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { featuredServices, categories, isLoading } = useSelector((state: RootState) => state.services);
  const { user } = useSelector((state: RootState) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchFeaturedServices()).unwrap(),
        dispatch(fetchCategories()).unwrap(),
      ]);
    } catch (error) {
      console.error('Failed to load home data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    // TODO: Navigate to search screen with query
    console.log('Search query:', searchQuery);
  };

  const handleCategoryPress = (categoryId: string) => {
    // TODO: Navigate to category screen
    console.log('Category pressed:', categoryId);
  };

  const handleServicePress = (serviceId: string) => {
    navigation.navigate('ServiceDetails', { serviceId });
  };

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(category.id)}
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryEmoji}>{category.icon || '🔧'}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedService = (service: any) => (
    <TouchableOpacity
      key={service.id}
      style={styles.featuredServiceItem}
      onPress={() => handleServicePress(service.id)}
    >
      <View style={styles.serviceImage}>
        <Text style={styles.serviceImagePlaceholder}>📸</Text>
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceProvider}>{service.provider?.businessName}</Text>
        <View style={styles.serviceRating}>
          <Text style={styles.ratingText}>⭐ {service.rating || '4.5'}</Text>
          <Text style={styles.priceText}>${service.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}!</Text>
            <Text style={styles.subtitle}>What service do you need today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryItem)}
          </ScrollView>
        </View>

        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredServicesContainer}
          >
            {featuredServices.map(renderFeaturedService)}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionItem}>
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={styles.quickActionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Text style={styles.quickActionIcon}>📍</Text>
              <Text style={styles.quickActionText}>Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <Text style={styles.quickActionIcon}>⭐</Text>
              <Text style={styles.quickActionText}>Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <View style={styles.recentBookingsContainer}>
            <Text style={styles.emptyStateText}>No recent bookings</Text>
            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Services</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  featuredServicesContainer: {
    paddingHorizontal: 20,
  },
  featuredServiceItem: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    height: 120,
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImagePlaceholder: {
    fontSize: 40,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  serviceProvider: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  serviceRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  quickActionItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  recentBookingsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
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

export default HomeScreen;