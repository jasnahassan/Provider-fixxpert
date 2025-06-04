import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthProvider, useAuth } from '../context/AuthContext';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import HomeScreen from '../screens/HomeScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ViewAllServicesScreen from '../screens/ViewAllServicesScreen';

import AllRatingsScreen from '../screens/AllRatingsScreen';

import CancelBookingScreen from '../screens/CancelBookingScreen';

import RequestDetailScreen from '../screens/RequestDetailScreen';
import TrackingScreen from '../screens/TrackingScreen';
import EstimationScreen from '../screens/EstimationScreen';
import ServiceStatusScreen from '../screens/ServiceStatusScreen';
import AdditionalAmountScreen from '../screens/AdditionalAmountScreen';
import MessageScreen from '../screens/MessageScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import PendingPaymentsScreen from '../screens/PendingPaymentsScreen';

const Stack = createStackNavigator();

function AppStack() {
  const { isAuthenticated } = useAuth(); // Use authentication state

  return (
    // <Stack.Navigator screenOptions={{ headerShown: false }}>
    //   {isAuthenticated ? (
    //     <Stack.Screen name="Main" component={BottomTabNavigator} />
    //   ) : (
    //     <Stack.Screen name="Auth" component={AuthNavigator} />
    //   )}
    // </Stack.Navigator>
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
  
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
     
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ViewAllServices" component={ViewAllServicesScreen} />
     
      <Stack.Screen name="AllRatings" component={AllRatingsScreen} />
    
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
    
      <Stack.Screen name="RequestDetails" component={RequestDetailScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      <Stack.Screen name="EstimationScreen" component={EstimationScreen} />
      <Stack.Screen name="ServiceStatusScreen" component={ServiceStatusScreen} />
      <Stack.Screen name="AdditionalAmountScreen" component={AdditionalAmountScreen} />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="PendingPayments" component={PendingPaymentsScreen} />
     

    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
