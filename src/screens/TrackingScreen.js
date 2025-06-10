import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions,
  TouchableOpacity, PermissionsAndroid, Platform
} from 'react-native';
import GradientButton from '../components/GradientButton';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { updateBookingstatus } from '../redux/AuthSlice';
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get('window');

const TrackingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { bookingItem } = route.params;
  const mapRef = useRef(null);

  const [providerLocation, setProviderLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const destinationLocation = {
    latitude: parseFloat(bookingItem?.address_details?.lat || 0),
    longitude: parseFloat(bookingItem?.address_details?.long || 0),
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Fixxpert Location Permission',
          message: 'Fixxpert needs access to your location to track your route',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setProviderLocation({ latitude, longitude });
      },
      error => {
        console.error('Location Error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const startWatchingLocation = () => {
    const id = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setProviderLocation({ latitude, longitude });
      },
      error => {
        console.error('Watch Error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000, // 10 seconds
        fastestInterval: 5000,
      }
    );
    setWatchId(id);
  };

  const calculateBearing = (origin, destination) => {
    const lat1 = origin.latitude * (Math.PI / 180);
    const lon1 = origin.longitude * (Math.PI / 180);
    const lat2 = destination.latitude * (Math.PI / 180);
    const lon2 = destination.longitude * (Math.PI / 180);

    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);

    return (bearing * (180 / Math.PI) + 360) % 360;
  };

  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted) {
        getCurrentLocation();
        startWatchingLocation();
      }
    });

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const handleArrivePress = () => {
    // if (!selectedReason && !customReason.trim()) {
    //     alert('Please select or enter a reason');
    //     return;
    // }

    dispatch(updateBookingstatus({ bookingId:bookingItem?.booking_id,booking_status:8 }))
        .unwrap()
        .then(() => {
          navigation.navigate('EstimationScreen',{ bookingItem:bookingItem})
            // setSuccessModalVisible(true);
            // navigation.navigate('CancelConfirmation');
        })
        .catch((err) => {
            console.log('Cancel error:', err);
            alert('Failed to cancel booking');
        });
};

  useEffect(() => {
    if (providerLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: providerLocation.latitude,
          longitude: providerLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  }, [providerLocation]);

  const bearing = providerLocation
    ? calculateBearing(providerLocation, destinationLocation)
    : 0;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Location</Text> */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
        <Text style={styles.title}>LocationTracking</Text>
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {providerLocation && (
          <>
            <Polyline
              coordinates={[providerLocation, destinationLocation]}
              strokeColor="#DB3043"
              strokeWidth={4}
            />
            <Marker coordinate={providerLocation} title="Provider Location" rotation={bearing}>
              <Image
                source={require('../assets/scooty.png')}
                style={{
                  width: 35,
                  height: 35,
                  transform: [{ rotate: `${bearing}deg` }],
                }}
              />
            </Marker>
          </>
        )}
        <Marker coordinate={destinationLocation} title="Destination" />
      </MapView>

      <View style={styles.serviceCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceTitle2}>{bookingItem?.service_name}</Text>
          <Text style={styles.serviceId}>#{bookingItem?.booking_id}</Text>
        </View>

        <View style={styles.cardRow}>
          <Image source={require('../assets/Locationred.png')} style={styles.icon} />
          <Text style={styles.cardText}>{bookingItem?.address_details?.address_line1},{bookingItem?.address_details?.address_line2}</Text>
        </View>

        <View style={styles.cardRow}>
          <Image resizeMode="contain" source={require('../assets/Calendar.png')} style={styles.icon} />
          <Text style={styles.cardText}>{bookingItem?.booked_date_time}</Text>
        </View>

        <View style={styles.cardRow}>
          <Image source={require('../assets/Profilered.png')} style={styles.icon} />
          <Text style={styles.cardText}>{bookingItem?.user?.name}</Text>
        </View>
      </View>
      <GradientButton title="Arrived" onPress={() => handleArrivePress()} />
      <Image source={require('../assets/Image.png')} resizeMethod='resize' resizeMode="stretch" style={styles.banner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  map: { height: 300, width: '100%', marginBottom: 20 },
  backIcon: {
    height: 20,
    width: 20,
    marginTop: 5,
    marginRight: 15,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 20,
    color: 'black'
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginVertical: 0,
    marginHorizontal: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  serviceTitle2: {
    fontWeight: "bold",
    fontSize: 16,
    color: 'black'
  },
  serviceId: {
    color: "red",
    fontWeight: "600",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  cardText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'black'
  },
  icon: {
    width: 16,
    height: 16,
  },
  backButton: { marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  banner: { width: "100%", height: 100, borderRadius: 10, marginBottom: 20 ,marginTop:12},
});

export default TrackingScreen;


// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, Image,TouchableOpacity} from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import { fetchProvidersByLocation } from '../redux/AuthSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import polyline from '@mapbox/polyline';
// import { BackHandler } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const TrackingScreen = ({ route, navigation }) => {
//   const { address_details, provider_id, providerDetails, fromEmergency } = route.params;

//   const dispatch = useDispatch();
//   const mapApiKey = "AIzaSyCfKNxF7Y7uR0z_I48G8-LDf3uSlBQRbuE";

//   const { providers, loadingProviders, providersError } = useSelector(state => state.auth);
//   const [directionsCoordinates, setDirectionsCoordinates] = useState([]);
//   const [providerLocation, setProviderLocation] = useState(null);
//   const [destinationLocation, setDestinationLocation] = useState(null);
//   const mapRef = useRef(null);

//   useFocusEffect(
//     React.useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('Main');
//         return true; // Prevent default behavior (exit app)
//       };
  
//       BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
//       return () =>
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation])
//   );

//   useEffect(() => {
    
//     const interval = setInterval(() => {
//       dispatch(fetchProvidersByLocation(provider_id));
//     }, 10000); // 10 seconds

//     // Clean up the interval on component unmount
//     return () => clearInterval(interval);
//   }, [provider_id]);

//   useEffect(() => {
//     console.log(address_details?.lat && providers[0]?.lat,'heree laat',providerDetails)
//     if (address_details?.lat && providers[0]?.lat) {
//       const origin = `${providers[0]?.lat},${providers[0]?.long}`;
//       const destination = `${address_details?.lat},${address_details?.long}`;
//       setDestinationLocation({
//         latitude: Number(address_details?.lat),
//         longitude: Number(address_details?.long)
//       });

//       setProviderLocation({
//         latitude: Number(providers[0]?.lat),
//         longitude: Number(providers[0]?.long)
//       });

//       const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${mapApiKey}`;

//       fetch(url)
//         .then(res => res.json())
//         .then(data => {
//           if (data.routes.length) {
//             const points = polyline.decode(data.routes[0].overview_polyline.points);
//             const coords = points.map(([latitude, longitude]) => ({ latitude, longitude }));
//             setDirectionsCoordinates(coords);
//           }
//         })
//         .catch(err => {
//           console.error('Error fetching directions:', err);
//         });
//     }
//   }, [providers, address_details]);

//   useEffect(() => {
//     if (providerLocation && mapRef.current) {
//       mapRef.current.animateCamera({
//         center: {
//           latitude: providerLocation.latitude,
//           longitude: providerLocation.longitude,
//         },
//         zoom: 20, // Adjust zoom level
//         pitch: 0,
//         heading: 0,
//       }, { duration: 3000 });
//     }
//   }, [providerLocation]);

//   // Calculate the bearing (angle/direction) between provider and destination
//   const calculateBearing = (origin, destination) => {
//     const lat1 = origin.latitude * (Math.PI / 180);
//     const lon1 = origin.longitude * (Math.PI / 180);
//     const lat2 = destination.latitude * (Math.PI / 180);
//     const lon2 = destination.longitude * (Math.PI / 180);

//     const dLon = lon2 - lon1;
//     const y = Math.sin(dLon) * Math.cos(lat2);
//     const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
//     const bearing = Math.atan2(y, x);

//     return (bearing * (180 / Math.PI) + 360) % 360; // Convert radian to degree
//   };

//   // Get the bearing (heading) between the provider and destination
//   const bearing = providerLocation && destinationLocation ?
//     calculateBearing(providerLocation, destinationLocation) : 0;

//   return (
//     <View style={styles.container}>
//         <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
//                 <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
//                 <Text style={styles.title2}>Location</Text>
//             </TouchableOpacity>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: 0,
//           longitude: 0,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//         zoomEnabled={true}
//       >
//         {directionsCoordinates.length > 0 && (
//           <Polyline
//             coordinates={directionsCoordinates}
//             strokeColor="#DB3043"
//             strokeWidth={4}
//           />
//         )}

//         {providerLocation && (
//           <Marker
//             coordinate={providerLocation}
//             title="Provider Location"
//             rotation={bearing} // Rotate the marker based on the bearing
//           >
//             <Image
//               source={require('../assets/scooty.png')}
//               style={{
//                 width: 35,
//                 height: 35,
//                 transform: [{ rotate: `${bearing}deg` }], // Ensure rotation in degrees
//               }}
//             />
//           </Marker>
//         )}

//         {destinationLocation && (
//           <Marker coordinate={destinationLocation} title="Destination" />
//         )}
//       </MapView>

//       {/* Bottom Card */}
//       <View style={styles.bottomContainer}>
//         <View style={styles.statusBanner}>
//           <Text style={styles.statusBannerText}> {providerDetails?.name} is on the way</Text>
//           <View style={styles.statusTimeBox}>
//             <Text style={styles.statusTimeText}>11 Min</Text>
//           </View>
//         </View>
//         <View style={styles.serviceCard}>
//           <Image
//             source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
//             style={styles.avatar}
//           />
//           <View style={styles.serviceDetails}>
//             <Text style={styles.serviceTitle}>Plumbing service</Text>
//             <Text style={styles.serviceProvider}>{providerDetails?.name}</Text>
//           </View>
//           {/* {fromEmergency && (
//             <TouchableOpacity
//             onPress={()=> navigation.navigate('ServiceStatus',{bookingId:bookingDetails?.booking_id,serviceType:'test',address_details:bookingDetails?.address_details,provider_id:provider_id,bookingDetails:bookingDetails})}
//               style={styles.statusButton}
//             >
//               <Text style={styles.statusButtonText}>Status</Text>
//             </TouchableOpacity>
//           )} */}
//         </View>


//         {/* Promo Cards */}
//         <View style={styles.promoCard}>
//           <Image source={require('../assets/plus.png')} style={styles.promoIcon} />
//           <View>
//             <Text style={styles.promoTitle}>Invite friends & earn upto ₹200</Text>
//             <Text style={styles.promoSubtitle}>Get 25% off on your next order</Text>
//           </View>
//         </View>

//         <View style={styles.promoCard}>
//           <Image source={require('../assets/plus.png')} style={styles.promoIcon} />
//           <View>
//             <Text style={styles.promoTitle}>Use code APP20 at checkout</Text>
//             <Text style={styles.promoSubtitle}>Receive 20% off your first purchase</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default TrackingScreen;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width,
//     height,
//   },
//   bottomContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: -2 },
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#DB3043',
//   },
//   timeBox: {
//     backgroundColor: '#DB3043',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   timeText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   serviceCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F6F6F6',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   serviceDetails: {
//     flex: 1, // This makes the details section take up the remaining space
//   },
//   serviceTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: 'black',
//   },
//   serviceProvider: {
//     fontSize: 14,
//     color: '#888',
//   },
//   statusButton: {
//     width: '30%', // This makes the button take up 30% of the width
//     backgroundColor: 'green',
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   statusButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   promoCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F6F6F6',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   promoIcon: {
//     width: 32,
//     height: 32,
//     marginRight: 12,
//   },
//   promoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   promoSubtitle: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statusBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#DB3043',
//     paddingVertical: 2,
//     paddingHorizontal: 5,
//     borderRadius: 10,
//     marginBottom: 12,
//   },
//   statusBannerText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   statusTimeBox: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 0,
//     borderTopRightRadius: 6,
//     borderBottomRightRadius: 6,
//     height: 39,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   statusTimeText: {
//     color: '#DB3043',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   backButton: { marginBottom: 1, flexDirection: 'row', marginBottom: 10, marginTop: 5 },
//   backText: { fontSize: 18, color: '#333' },
//   backIcon: {
//       height: 20,
//       width: 20,
//       marginTop: 5,
//       marginRight: 15,
//       resizeMode: 'contain'
//   },
//   title2: { fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: 'black' },

// });