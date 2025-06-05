// import BackgroundJob from 'react-native-background-actions';
// import Geolocation from '@react-native-community/geolocation';

// const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

// const getCurrentPosition = () => new Promise((resolve, reject) => {
//   Geolocation.getCurrentPosition(
//     (position) => {
//       console.log('Current Position:', position);
//       resolve(position);
//     },
//     (error) => {
//       console.log('Geolocation error:', error.code, error.message);
//       reject(error);
//     },
//     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//   );
// });

// const backgroundTask = async () => {
//   await new Promise((resolve) => {
//     const intervalId = setInterval(async () => {
//       if (!BackgroundJob.isRunning()) {
//         clearInterval(intervalId);
//         resolve();
//         return;
//       }
//       try {
//         await getCurrentPosition();
//         await BackgroundJob.updateNotification({ taskDesc: 'Getting position...' });
//       } catch (error) {
//         console.log('Error getting position:', error);
//       }
//     }, 10000); // 10 sec
//   });
// };

// const options = {
//   taskName: 'Location Fetch',
//   taskTitle: 'Fetching Location',
//   taskDesc: 'Fetching user location every 10 seconds',
//   taskIcon: {
//     name: 'ic_launcher',
//     type: 'mipmap',
//   },
//   color: '#ff00ff',
//   linkingURI: 'yourapp://home',
//   parameters: {
//     delay: 1000,
//   },
// };

// export const startBackgroundJob = async () => {
//   try {
//     console.log('Starting background service');
//     await BackgroundJob.start(backgroundTask, options);
//     console.log('Background service started successfully!');
//   } catch (e) {
//     console.log('Error starting background service:', e);
//   }
// };

// export const stopBackgroundJob = async () => {
//   try {
//     console.log('Stopping background service');
//     await BackgroundJob.stop();
//     console.log('Background service stopped successfully!');
//   } catch (e) {
//     console.log('Error stopping background service:', e);
//   }
// };
