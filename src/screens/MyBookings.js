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
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const dummyBookings = [
  {
    id: '1',
    type: 'Plumbing',
    status: 'Pending',
    location: 'Bangalore, KAR, India, 560002',
    date: '18 July 2025 at 11:30 AM',
    name: 'Charlotte',
    code: '#524545',
    image: require('../assets/maintenance.png'), // Replace with your asset path
  },
  {
    id: '2',
    type: 'Cleaning',
    status: 'Scheduled',
    location: 'Chennai, TN, India, 600001',
    date: '20 July 2025 at 3:00 PM',
    name: 'Daniel',
    code: '#524546',
    image: require('../assets/maintenance.png'), // Replace with your asset path
  },
];

const MyBookings = ({navigation}) => {
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const filteredBookings = dummyBookings.filter(item => item.status === selectedStatus);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
        style={styles.picker}
        dropdownIconColor="#093759"
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Scheduled" value="Scheduled" />
        <Picker.Item label="Cancelled" value="Cancelled" />
        <Picker.Item label="Emergency Services" value="Emergency" />
      </Picker>

      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>navigation.navigate('RequestDetails', { serviceId: item?.service_type_id })} style={styles.card}>
            {/* Main Service Image */}
            <Image source={item.image} style={styles.serviceImage} />

            <Text style={styles.service}>{item.type}</Text>
            <Text style={styles.code}>{item.code}</Text>

            {/* Location with Icon */}
            <View style={styles.row}>
              {/* <Icon name="map-marker" size={16} color="#333" /> */}
              <Image source={item.image} style={styles.serviceImage2} />
              <Text style={styles.rowText}>{item.location}</Text>
            </View>

            {/* Date/Time with Icon */}
            <View style={styles.row}>
            <Image source={item.image} style={styles.serviceImage2} />
              <Text style={styles.rowText}>{item.date}</Text>
            </View>

            {/* Name with Icon */}
            <View style={styles.row}>
            <Image source={item.image} style={styles.serviceImage2} />
              <Text style={styles.rowText}>{item.name}</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cancel (30 sec)</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
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
