import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LandingScreen from '../screens/LandingScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';

import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
        
        {/* Shared screens accessible from anywhere */}
        <Stack.Screen 
          name="ServiceDetails" 
          component={ServiceDetailsScreen}
          options={{
            headerShown: true,
            title: 'Service Details',
          }}
        />
        <Stack.Screen 
          name="BookingConfirmation" 
          component={BookingConfirmationScreen}
          options={{
            headerShown: true,
            title: 'Booking Confirmation',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;