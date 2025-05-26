// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import BookingCard from '../components/BookingCard';
// import CancelModal from '../components/CancelModal';
// import PreviousBookingCard from '../components/PreviousBookingCard';
// import { fetchBookings } from '../redux/AuthSlice';

// const MyBookings = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const { bookings, loadingBookings } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const status = activeTab === 'upcoming' ? '2' : '';
//     dispatch(fetchBookings({ booking_status: status }));
//   }, [activeTab]);

//   const openCancelModal = (booking) => {
//     setSelectedBooking(booking);
//     setModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Tabs */}
//       <View style={styles.tabs}>
//         <TouchableOpacity onPress={() => setActiveTab('upcoming')}>
//           <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTab]}>
//             Upcoming
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setActiveTab('previous')}>
//           <Text style={[styles.tabText, activeTab === 'previous' && styles.activeTab]}>
//             Previous
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {loadingBookings ? (
//         <ActivityIndicator size="large" color="#4C9EEB" style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={bookings}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) =>
//             activeTab === 'upcoming' ? (
//               <BookingCard
//                 booking={item}
//                 isUpcoming={true}
//                 onCancel={() => openCancelModal(item)}
//                 onReschedule={() => {
//                   navigation.navigate('RescheduleBooking', { bookingId: item });
//                 }}
//               />
//             ) : (
//               <PreviousBookingCard
//                 booking={item}
//                 onFeedback={() => console.log('Feedback for:', item.id)}
//               />
//             )
//           }
//         />
//       )}

//       <CancelModal
//         visible={modalVisible}
//         booking={selectedBooking}
//         onClose={() => setModalVisible(false)}
//         onCancelSubmit={(reason) => {
//           setModalVisible(false);
//           navigation.navigate('CancelBooking', { bookingId: selectedBooking?.booking_id });
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#999',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   activeTab: {
//     color: '#000',
//     fontWeight: 'bold',
//     borderBottomColor: '#4C9EEB',
//   },
// });

// export default MyBookings;
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingByFilter } from '../redux/AuthSlice'; // Adjust path if needed
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyBookings = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState('Latest');

  const { bookings, loading, error } = useSelector((state) =>state.auth); 

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
    const fetchData = async () => {
      try {
        const user = await getUserData();
        console.log(user?.service_provider_id, 'userdatatt 123');
        // setproviderid(user?.service_provider_id)
        dispatch(fetchBookingByFilter({ providerId: user?.service_provider_id, filterType: selectedStatus, searchQuery: '' }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [selectedStatus, dispatch]);



  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
        style={styles.picker}
        dropdownIconColor="#093759"
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Latest" value="Latest" />
        <Picker.Item label="OnGoing" value="OnGoing" />
        <Picker.Item label="Cancelled" value="Cancelled" />
        <Picker.Item label="Complete" value="Completed" />
      </Picker>

      {loading && <Text>Loading...</Text>}
      {/* {error && <Text style={{ color: 'red' }}>Error: {error}</Text>} */}

      <FlatList
        data={bookings}
        keyExtractor={(item) => item?.booking_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('RequestDetails', { serviceItem: item })}
            style={styles.card}
          >
            <Image source={{uri:item?.service_icon}} style={styles.serviceImage} />
            <Text style={styles.service}>{item.type}</Text>
            <Text style={styles.code}>{item.code}</Text>

            <View style={styles.row}>
              <Image source={require('../assets/Locationred.png')} style={styles.serviceImage2} />
              <Text style={styles.rowText}>{item?.address_details?.address_line1},{item?.address_details?.address_line2}</Text>
            </View>

            <View style={styles.row}>
              <Image source={require('../assets/Calendar.png')} style={styles.serviceImage2} />
              <Text style={styles.rowText}>{item?.booked_date_time}</Text>
            </View>

            <View style={styles.row}>
              <Image source={require('../assets/Profilered.png')} style={styles.serviceImage2} />
              <Text style={styles.rowText}>{item?.user?.name}</Text>
            </View>

            {/* <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cancel (30 sec)</Text>
            </TouchableOpacity> */}
          </TouchableOpacity>
        )}
      />

{!loading && bookings.length === 0 && (
  <Text style={{ textAlign: 'center', marginTop: 20 ,color:'black'}}>No bookings found.</Text>
)}
    </View>
  );
};

export default MyBookings;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    color: 'black',
  },
  pickerItem: {
    fontSize: 8,
    color: 'black',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  serviceImage: {
    width: '70%',
    height: 90,
    resizeMode: 'contain',
    marginBottom: 8,
    alignSelf:'center'
  },
  serviceImage2: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 8,
    alignSelf:'center'
  },
  service: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  code: {
    color: 'red',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowText: {
    marginLeft: 6,
    color: 'black',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'blue',
  },
});
