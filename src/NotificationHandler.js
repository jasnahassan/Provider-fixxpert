import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('✅ FCM Permission granted:', authStatus);
                getFcmToken();
            } else {
                console.log('❌ FCM Permission denied');
            }
        };

        const getFcmToken = async () => {
            try {
                const token = await messaging().getToken();
                console.log('🔥 FCM Token:', token);
                if (token) {
                    await AsyncStorage.setItem('fcmToken', token);
                }
            } catch (error) {
                console.error('⚠️ Error fetching FCM Token:', error);
            }
        };

        // Listen for foreground notifications
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            Alert.alert('📩 New Notification', remoteMessage.notification?.body);
        });

        // Handle notifications that open the app
        const unsubscribeOnOpen = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('📌 Notification caused app to open:', remoteMessage);
        });

        requestUserPermission();

        return () => {
            unsubscribeOnMessage();
            unsubscribeOnOpen();
        };
    }, [dispatch]);

    return null;
};

export default NotificationHandler;
