// import React, { useEffect } from 'react';
// import { Alert } from 'react-native';
// import { useDispatch } from 'react-redux';
// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const NotificationHandler = () => {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const requestUserPermission = async () => {
//             const authStatus = await messaging().requestPermission();
//             const enabled =
//                 authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//                 authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//             if (enabled) {
//                 console.log('✅ FCM Permission granted:', authStatus);
//                 getFcmToken();
//             } else {
//                 console.log('❌ FCM Permission denied');
//             }
//         };

//         const getFcmToken = async () => {
//             try {
//                 const token = await messaging().getToken();
//                 console.log('🔥 FCM Token:', token);
//                 if (token) {
//                     await AsyncStorage.setItem('fcmToken', token);
//                 }
//             } catch (error) {
//                 console.error('⚠️ Error fetching FCM Token:', error);
//             }
//         };

//         // Listen for foreground notifications
//         const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
//             Alert.alert('📩 New Notification', remoteMessage.notification?.body);
//         });

//         // Handle notifications that open the app
//         const unsubscribeOnOpen = messaging().onNotificationOpenedApp(remoteMessage => {
//             console.log('📌 Notification caused app to open:', remoteMessage);
//         });

//         requestUserPermission();

//         return () => {
//             unsubscribeOnMessage();
//             unsubscribeOnOpen();
//         };
//     }, [dispatch]);

//     return null;
// };

// export default NotificationHandler;notificationsound.wav

import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Sound from 'react-native-sound';
import { updateFcmToken, fetchAllServiceTypes, fetchBanners ,sendServiceProviderLocation,fetchProviderDashboard,fetchUnassignedBookings,acceptBooking,fetchBookingByFilter,deActivateprovider,Activateprovider} from "./redux/AuthSlice";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



Sound.setCategory('Playback'); // iOS: Allow playback with silent switch

const NotificationHandler = () => {
    const dispatch = useDispatch();

    const getUserData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('userData');
          if (jsonValue != null) {
            const user = JSON.parse(jsonValue);
            console.log('User Data:', user);
            return user;
          }
        } catch (e) {
          console.error('Error fetching userData from AsyncStorage:', e);
        }
      };
      

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

        const playNotificationSound = () => {
            const sound = new Sound('notificationsound.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('🔇 Sound load error:', error);
                    return;
                }
                sound.play(() => sound.release());
            });
        };

        // Listen for foreground notifications
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('📥 Foreground Notification:', remoteMessage);

            Alert.alert('📩 New Notification', remoteMessage.notification?.body);

            // 🔊 Play notification sound
            playNotificationSound();

            // 🌐 Call API
            try {
                const user = await getUserData();
                dispatch(fetchUnassignedBookings(user?.service_provider_id));
              } catch (err) {
                console.error('❌ Error calling booking API from notification:', err);
              }
        });

        // Handle when user taps on a notification
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
