import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const features = [
    {
      id: 1,
      title: 'Discover Services',
      description: 'Find the best local services near you',
      icon: '🔍',
    },
    {
      id: 2,
      title: 'Easy Booking',
      description: 'Book services with just a few taps',
      icon: '📅',
    },
    {
      id: 3,
      title: 'Secure Payment',
      description: 'Pay safely with multiple payment options',
      icon: '💳',
    },
    {
      id: 4,
      title: 'Real-time Updates',
      description: 'Get instant notifications about your bookings',
      icon: '🔔',
    },
  ];

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentSlide(Math.round(index));
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  const handleSkip = () => {
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ServiceBook</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Features Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
          >
            {features.map((feature) => (
              <View key={feature.id} style={styles.slide}>
                <View style={styles.featureContainer}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {features.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentSlide === index && styles.activeDot,
                ]}
                onPress={() => goToSlide(index)}
              />
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleGetStarted}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>

        {/* App Preview */}
        <View style={styles.previewContainer}>
          <View style={styles.phoneMockup}>
            <View style={styles.phoneScreen}>
              <View style={styles.mockupHeader}>
                <View style={styles.mockupSearchBar}>
                  <Text style={styles.mockupSearchText}>Search services...</Text>
                </View>
              </View>
              <View style={styles.mockupContent}>
                <View style={styles.mockupCard}>
                  <Text style={styles.mockupCardTitle}>Beauty Services</Text>
                </View>
                <View style={styles.mockupCard}>
                  <Text style={styles.mockupCardTitle}>Home Services</Text>
                </View>
                <View style={styles.mockupCard}>
                  <Text style={styles.mockupCardTitle}>Health & Wellness</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
  },
  carouselContainer: {
    height: height * 0.4,
    marginVertical: 20,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  featureContainer: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  getStartedButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  phoneMockup: {
    width: 200,
    height: 400,
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  mockupHeader: {
    marginBottom: 20,
  },
  mockupSearchBar: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  mockupSearchText: {
    color: '#999999',
    fontSize: 14,
  },
  mockupContent: {
    flex: 1,
  },
  mockupCard: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  mockupCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});

export default LandingScreen;