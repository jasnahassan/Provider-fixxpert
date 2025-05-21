import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Chat from '../screens/Chat';
import MyBookings from '../screens/MyBookings';


const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused) => {
  let icon;

  if (route.name === 'Home') {
    icon = focused
      ? require('../assets/home_active.png') // Active image
      : require('../assets/home_inactive.png'); // Inactive image
  } else if (route.name === 'Notification') {
    icon = focused
      ? require('../assets/notificationactive.png')
      : require('../assets/Notification.png');
  } else if (route.name === 'Profile') {
    icon = focused
      ? require('../assets/Profileactive.png')
      : require('../assets/Profile.png');
  }
  else if (route.name === 'MyBookings') {
    icon = focused
      ? require('../assets/Ticketactive.png')
      : require('../assets/Ticket.png');
  }
  else if (route.name === 'Chat') {
    icon = focused
      ? require('../assets/chatactive.png')
      : require('../assets/Chat.png');
  }

  return <Image source={icon} style={styles.icon} />;
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabBarIcon(route, focused),
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Hide tab name
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="MyBookings" component={MyBookings} options={{ headerShown: false }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
     
      <Tab.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
