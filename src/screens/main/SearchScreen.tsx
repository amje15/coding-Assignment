import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { searchServices, setSearchQuery, clearSearchResults } from '../../store/slices/serviceSlice';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, searchQuery, isLoading } = useSelector((state: RootState) => state.services);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    sortBy: 'popularity' as 'price' | 'rating' | 'distance' | 'popularity',
  });

  const categories = [
    { id: '1', name: 'Beauty', icon: '💄' },
    { id: '2', name: 'Health', icon: '🏥' },
    { id: '3', name: 'Home', icon: '🏠' },
    { id: '4', name: 'Automotive', icon: '🚗' },
    { id: '5', name: 'Education', icon: '📚' },
    { id: '6', name: 'Technology', icon: '💻' },
  ];

  const handleSearch = async () => {
    if (!localSearchQuery.trim()) {
      dispatch(clearSearchResults());
      return;
    }

    dispatch(setSearchQuery(localSearchQuery));
    
    try {
      await dispatch(searchServices({
        query: localSearchQuery,
        filters: {
          category: selectedCategory || undefined,
          ...selectedFilters,
        },
        sortBy: selectedFilters.sortBy,
        sortOrder: 'desc',
      })).unwrap();
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleServicePress = (serviceId: string) => {
    navigation.navigate('ServiceDetails', { serviceId });
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        selectedCategory === category.id && styles.categoryItemSelected,
      ]}
      onPress={() => handleCategoryPress(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryName,
        selectedCategory === category.id && styles.categoryNameSelected,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServicePress(item.id)}
    >
      <View style={styles.serviceImage}>
        <Text style={styles.serviceImagePlaceholder}>📸</Text>
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceProvider}>{item.provider?.businessName}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.serviceFooter}>
          <View style={styles.serviceRating}>
            <Text style={styles.ratingText}>⭐ {item.rating || '4.5'}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount || 0})</Text>
          </View>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>No services found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search terms or filters
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            placeholderTextColor="#999999"
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(renderCategoryItem)}
        </ScrollView>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>Filters</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterText}>Price Range</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterText}>Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterText}>Distance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem}>
            <Text style={styles.filterText}>Availability</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchResults.length} services found
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  searchHeader: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
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
  categoriesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  categoryItemSelected: {
    backgroundColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  categoryNameSelected: {
    color: '#FFFFFF',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    marginRight: 12,
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  resultsSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
  },
  sortText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  serviceItem: {
    flexDirection: 'row',
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
  serviceImage: {
    width: 100,
    height: 100,
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImagePlaceholder: {
    fontSize: 30,
  },
  serviceInfo: {
    flex: 1,
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
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
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
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SearchScreen;