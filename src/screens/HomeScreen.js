import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
  Switch, 
  ImageBackground,
  Platform
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import messaging from '@react-native-firebase/messaging';
import { updateFcmToken, fetchAllServiceTypes, fetchBanners ,sendServiceProviderLocation,fetchProviderDashboard,fetchUnassignedBookings,acceptBooking,fetchBookingByFilter,deActivateprovider,Activateprovider} from "../redux/AuthSlice";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Geolocation from 'react-native-geolocation-service';

const { width } = Dimensions.get("window");

const banners = [
  { id: 1, image: require("../assets/banner.png") },
  { id: 2, image: require("../assets/banner.png") },
];

const popularServices = [
  { id: 1, name: "Plumbing" },
  { id: 2, name: "HVAC" },
  { id: 3, name: "Electrical" },
  { id: 4, name: "Roofing" },
  { id: 5, name: "Painting" },
  { id: 6, name: "Carpentry" },
];

const emergencyServices = [
  { id: 1, name: "Sanitization" },
  { id: 2, name: "Handyman" },
  { id: 3, name: "Electrical" },
  { id: 4, name: "Locksmith" },
];

const HomeScreen = ({ navigation }) => {
  const carouselRef = useRef(null);
  const dispatch = useDispatch();
  const serviceTypes = useSelector((state) => state.auth.serviceTypes);
  const { banners, loading, error ,dashboardDetails,unassignedBookings,acceptedBooking,bookings} = useSelector((state) => state.auth);
  const [isActive, setIsActive] = useState(true);
  const [providerid, setproviderid] = useState('');
  

  const stats = [
    { count: dashboardDetails?.total_bookings, label: "Total Booking", image: require("../assets/appointment.png"), backimage: require("../assets/Blueimg.png") },
    { count: dashboardDetails?.total_completed_works, label: "Total completed Service", image: require("../assets/costumer-service.png"), backimage: require("../assets/Blueimg.png") },
    { count: dashboardDetails?.total_upcoming_bookings, label: "Upcoming Booking", image: require("../assets/repairing-service.png"), backimage: require("../assets/Blueimg.png") },
    { count: dashboardDetails?.total_revenue, label: "Total Earning", image: require("../assets/bar-chart.png"), backimage: require("../assets/Blueimg.png") },
  ];

  const services = [
    { title: "Plumbing", location: "123 Street", time: "04:00 PM" },
    // { title: "Cleaning", location: "456 Avenue", time: "06:00 PM" },
  ];
  useEffect(() => {
    const fetchBookingsInterval = setInterval(async () => {
      const user = await getUserData();
      console.log(user?.service_provider_id, 'fetch bookings interval');
      dispatch(fetchUnassignedBookings(user?.service_provider_id));
      dispatch(fetchBookingByFilter({ providerId: user?.service_provider_id, filterType: 'Latest', searchQuery: '' }));
    }, 10000); // every 10 seconds
  
    const locationInterval = setInterval(() => {
      getCurrentLocation();
    }, 10000); // fetch location every 10 seconds
  
    return () => {
      clearInterval(fetchBookingsInterval);
      clearInterval(locationInterval); // clear intervals on unmount
    };
  }, []);
  
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const user = await getUserData();
  //     console.log(user?.service_provider_id,'here time call' )
  //     dispatch(fetchUnassignedBookings(user?.service_provider_id));
  //   }, 10000); // 10 seconds
  
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);
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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      // Fetch location permission and current location when screen is focused
      requestLocationPermission();
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );
  useEffect(()=>{
    requestLocationPermission();
  },[])
  
  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       // Prevent going back from HomeScreen
  //       return true;
  //     };
  
  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
  //     // Clean up the event listener when screen loses focus
  //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [])
  // );

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission granted");
          getCurrentLocation();
        } else {
          console.log("Location permission denied");
        }
      } else {
        getCurrentLocation(); // iOS permissions handled via Info.plist
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const getCurrentLocation = async() => {
    const user = await getUserData();
        console.log(user?.service_provider_id, 'userdatatt')
       
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        const providerId = 2; // Replace with actual ID
      
        
        dispatch(sendServiceProviderLocation({
          service_provider_id: user?.service_provider_id,
          lat: latitude,
          long: longitude
        }));
      },
      (error) => {
        console.warn("Location error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      }
    );
  };
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData();
        console.log(user?.service_provider_id, 'userdatatt 123');
        setproviderid(user?.service_provider_id)
  
        dispatch(fetchProviderDashboard(user?.service_provider_id));
        dispatch(fetchUnassignedBookings(user?.service_provider_id));
        dispatch(fetchBookingByFilter({ providerId: user?.service_provider_id, filterType: 'Latest', searchQuery: '' }));

        requestLocationPermission(); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [dispatch]);

  

  useEffect(() => {
    // const backAction = () => true;
    // const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Notification permission not granted");
        }
      }
    };

    const getFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        if (token) {
          // dispatch(updateFcmToken({ token }));
          dispatch(updateFcmToken({ token: token }));
        }
      } catch (error) {
        console.error("Error fetching FCM token:", error);
      }
    };

    requestNotificationPermission();
   requestLocationPermission();
    getFcmToken();
    dispatch(fetchBanners())
    dispatch(fetchAllServiceTypes());
    


    // return () => backHandler.remove();
  }, [dispatch]);

  const renderBanner = ({ item }) => (
    <Image source={{ uri: item?.banner_path }} resizeMethod='resize' resizeMode="stretch" style={styles.banner} />
  );

  const renderService = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ServiceDetail', { serviceId: item?.service_type_id })} style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.icon }} style={styles.serviceIcon} />
        <Text style={styles.serviceText}>{item.service_type_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Location Section */}
        <Text style={styles.greetingText}>Hi User</Text>
        {/* Greeting and Toggle */}
        <View style={styles.headerRow}>
          <Text style={styles.toggleText}>Active</Text>
          <View style={styles.toggleContainer}>

            <Switch
              value={isActive}
              // onValueChange={setIsActive}
              onValueChange={(value) => {

                setIsActive(value);
                if (value) {
                  dispatch(Activateprovider(providerid));         // Call activate API
                } else {
                  dispatch(deActivateprovider(providerid)); // Call deactivate API
                }
              }}
              thumbColor={isActive ? "#fff" : "#ccc"}
              trackColor={{ false: "#aaa", true: "#093759" }}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <ImageBackground
              key={index}
              source={item.backimage}
              style={styles.statCard}
              resizeMode="cover"
              imageStyle={styles.imageBackgroundStyle} 

            >
              <View style={styles.innerContent}>
                {/* <Image source={item.image} style={styles.statIcon} /> */}
                <Image source={item.image} style={{ width: 50, height: 50, alignSelf: 'flex-end', marginTop: 7 }} />
                <Text style={styles.statNumber}>{item.count}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>

            </ImageBackground>
          ))}
        </View>

        {/* Popular Services Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate("ViewAllServices", { title: "All Services" })}> */}
            {/* <Text style={styles.viewAll}>›</Text> */}
          {/* </TouchableOpacity> */}
        </View>



        {/* Emergency Services Header */}
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ViewAllServices", { title: "Emergency Services" })}>
            <Text style={styles.viewAll}>›</Text>
          </TouchableOpacity>
        </View> */}

        {/* Emergency Services Grid */}
        <FlatList
          data={unassignedBookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View  onPress={() => navigation.navigate('RequestDetails', { serviceItem: item })} style={styles.serviceCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.serviceTitle2}>{item?.service_name}</Text>
                <Text style={styles.serviceId}>#{item?.booking_id}</Text>
              </View>

              <View style={styles.cardRow}>
                <Image source={require('../assets/Locationred.png')} style={styles.icon} />
                <Text style={styles.cardText}>{item?.city_name}</Text>
              </View>

              <View style={styles.cardRow}>
                <Image resizeMode='contain' source={require('../assets/Calendar.png')} style={styles.icon} />
                <Text style={styles.cardText}>{item?.created_on}</Text>
              </View>

              <View style={styles.cardRow}>
                <Image source={require('../assets/Profilered.png')} style={styles.icon} />
                <Text style={styles.cardText}>{item?.user?.name}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={()=>{
                   dispatch(acceptBooking(item?.booking_id))
                   dispatch(fetchProviderDashboard(providerid));
                   dispatch(fetchUnassignedBookings(providerid));
                }
                  
                  } style={styles.acceptBtn}>
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.btnText2}>Decline</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          )}
        />


        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services Reques</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ViewAllServices", { title: "All Services" })}>
            <Text style={styles.viewAll}>›</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={bookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity  onPress={() => navigation.navigate('RequestDetails', { serviceItem: item })} style={styles.serviceRequestCard}>
              <View style={styles.grayBox} >
              <Image source={{uri:item?.service_icon}} style={{width:'80%',height:'80%'}} />
              </View>
              <View style={{
                flex: 1,             // Takes up remaining space
                // backgroundColor: "red",
                padding: 10,         // Only this box gets padding
                justifyContent: "center"
              }}>
                <Text style={styles.serviceTitle}>{item?.service_name}</Text>
                <Text style={styles.serviceMeta}>{item?.address_details?.address_line1},{item?.address_details?.address_line2}</Text>
                <Text style={styles.serviceMeta}>{item?.booked_date_time}</Text>
                <Text style={styles.serviceMeta}>{item?.booking_status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  scrollView: { paddingHorizontal: 15, paddingTop: 20, paddingBottom: 30 },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  mapIcon: { width: 20, height: 20, marginRight: 10 },
  locationText: { fontSize: 16, fontWeight: "bold", color: 'black' },
  searchBar: { backgroundColor: "#F0F0F0", padding: 12, borderRadius: 8, marginBottom: 20 },
  banner: { width: "100%", height: 150, borderRadius: 10, marginBottom: 25 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: 'black' },
  viewAll: { fontSize: 22, color: "blue" },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
    minWidth: "28%", // fit 3 in row
    maxWidth: "32%",
  },

  cardContent: {
    alignItems: "center",
  },

  serviceIcon: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },

  serviceText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: 'lightgray',
    padding: 15,
    margintop: 20
  },

  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 25
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  toggleText: {
    marginRight: 10,
    fontSize: 14,
    color: "black",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,

  },

  statCard: {
    width: "47%",
    height: 100,
    borderRadius: 10,

    marginBottom: 15,
    justifyContent: "flex-end",
    backgroundColor: "#E0F0FF",
    borderRadius: 10,
    overflow: "hidden",
    overflow: "hidden",        // Important for rounded corners
    // padding: 10,
  },

  innerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 7, // Padding INSIDE the image background
  },

  imageBackgroundStyle: {
    borderRadius: 10,  // moved to imageStyle of ImageBackground
    width: '100%',
    padding: 10
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  statLabel: {
    fontSize: 12,
    color: "white",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },

  serviceRequestCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    height: 100, // or whatever fixed height you want
  },

  grayBox: {
    width: 80,
    backgroundColor: "gray",
    justifyContent:'center',
    alignItems:'center'
  },
  // serviceRequestCard: {
  //   flexDirection: "row",
  //   backgroundColor: "#F2F2F2",
  //   borderRadius: 10,
  //   // padding: 15,
  //   alignItems: "center",
  //   marginBottom: 10,
  // },

  // grayBox: {
  //   width: 60,
  //   height: 60,
  //   backgroundColor: "#CCC",
  //   borderRadius: 8,
  //   marginRight: 15,
  // },

  serviceTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
    marginTop: 10
    // padding:50
  },

  serviceMeta: {
    fontSize: 12,
    color: "#666",
    // marginBottom:10
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
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
    color: "#444",
    fontSize: 14,
    color: 'black'
  },
  icon: {
    width: 16,
    height: 16,
    // tintColor: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  acceptBtn: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#002B5B",
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  declineBtn: {
    flex: 1,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#002B5B",
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  btnText2: {
    color: "#002B5B",
    fontWeight: "600",
  },

});

export default HomeScreen;
