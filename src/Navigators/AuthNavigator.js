// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import PersonalDetailsScreen from '../screens/Auth/PersonalDetailsScreen';
import AdditionalDetailsScreen from '../screens/Auth/AdditionalDetailsScreen';
import IDVerificationScreen from '../screens/Auth/IDVerificationScreen';
import BankDetailsScreen from '../screens/Auth/BankDetailsScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="AdditionalDetails" component={AdditionalDetailsScreen} />
      <Stack.Screen name="IDVerification" component={IDVerificationScreen} />
      <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
    </Stack.Navigator>
  );
}
