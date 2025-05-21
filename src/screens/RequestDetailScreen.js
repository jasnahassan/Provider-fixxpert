// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';

// const RequestDetailScreen = ({ navigation }) => {
//   const dummyBooking = {
//     booking_id: '524545',
//     service: 'Plumbing',
//     date: '26 Jun, 2022',
//     time: '04:00 PM',
//     customer: {
//       name: 'Customer',
//       phone: '9821252522',
//       email: 'user@gmail.com',
//       address: 'BANGALORE, KARNATAKA, India, 560002',
//     },
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Text style={styles.header}>Booking</Text>

//       {/* Service Info */}
//       <View style={styles.card}>
//         <Text style={styles.serviceTitle}>{dummyBooking.service}</Text>
//         <Text style={styles.bookingId}>Booking ID : #{dummyBooking.booking_id}</Text>
//         <Text style={styles.date}>Date : {dummyBooking.date}</Text>
//         <Text style={styles.time}>Scheduled Time : {dummyBooking.time}</Text>
//       </View>

//       {/* Customer Info */}
//       <Text style={styles.subHeader}>About Customer</Text>
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Image
//             source={require('../assets/Chat.png')}
//             style={styles.avatar}
//           />
//           <View style={styles.info}>
//             <Text style={styles.name}>{dummyBooking.customer.name}</Text>
//             <Text style={styles.contact}>{dummyBooking.customer.phone}</Text>
//             <Text style={styles.contact}>{dummyBooking.customer.email}</Text>
//             <Text style={styles.contact}>{dummyBooking.customer.address}</Text>
//           </View>
//         </View>

//         {/* Call / Chat buttons */}
//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={styles.callBtn}>
//             <Text style={styles.btnTextWhite}>Call</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.chatBtn}>
//             <Text style={styles.btnTextPrimary}>Chat</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Location Placeholder */}
//       <Text style={styles.subHeader}>Location</Text>
//       <Image
//         source={require('../assets/Chat.png')}
//         style={styles.map}
//       />

//       {/* Start / Cancel Buttons */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.startBtn}>
//           <Text style={styles.btnTextWhite}>Start</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.cancelBtn}>
//           <Text style={styles.btnTextPrimary}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default RequestDetailScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     padding: 16,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#062B67',
//     marginBottom: 16,
//   },
//   subHeader: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#062B67',
//     marginVertical: 10,
//   },
//   card: {
//     backgroundColor: '#F9F9F9',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   serviceTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#062B67',
//     marginBottom: 4,
//   },
//   bookingId: {
//     fontSize: 14,
//     color: '#333',
//   },
//   date: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 4,
//   },
//   time: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 4,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#CCC',
//     marginRight: 16,
//   },
//   info: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#062B67',
//   },
//   contact: {
//     fontSize: 14,
//     color: '#777',
//     marginTop: 4,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   callBtn: {
//     backgroundColor: '#062B67',
//     padding: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//     alignItems: 'center',
//   },
//   chatBtn: {
//     borderColor: '#062B67',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginLeft: 8,
//     alignItems: 'center',
//   },
//   startBtn: {
//     backgroundColor: '#062B67',
//     padding: 14,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//     alignItems: 'center',
//   },
//   cancelBtn: {
//     borderColor: '#062B67',
//     borderWidth: 1,
//     padding: 14,
//     borderRadius: 8,
//     flex: 1,
//     marginLeft: 8,
//     alignItems: 'center',
//   },
//   btnTextWhite: {
//     color: '#FFF',
//     fontWeight: '600',
//   },
//   btnTextPrimary: {
//     color: '#062B67',
//     fontWeight: '600',
//   },
//   map: {
//     height: 160,
//     borderRadius: 12,
//     backgroundColor: '#EEE',
//     marginBottom: 16,
//     resizeMode: 'cover',
//   },
// });
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const RequestDetailScreen = ({ navigation }) => {
  const dummyBooking = {
    booking_id: '524545',
    service: 'Plumbing',
    date: '26 Jun, 2022',
    time: '04:00 PM',
    customer: {
      name: 'Customer',
      phone: '9821252522',
      email: 'user@gmail.com',
      address: 'BANGALORE, KARNATAKA, India, 560002',
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Booking</Text>

      {/* Service Info with Image */}
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceTitle}>{dummyBooking.service}</Text>
          <Text style={styles.bookingId}>Booking ID : #{dummyBooking.booking_id}</Text>
          <Text style={styles.date}>Date : {dummyBooking.date}</Text>
          <Text style={styles.time}>Scheduled Time : {dummyBooking.time}</Text>
        </View>
        <Image
          source={require('../assets/Chat.png')} // Replace with your image
          style={styles.serviceImage}
        />
      </View>

      {/* Customer Info */}
      <Text style={styles.subHeader}>About Customer</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={require('../assets/Chat.png')}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{dummyBooking.customer.name}</Text>
            <Text style={styles.contact}>{dummyBooking.customer.phone}</Text>
            <Text style={styles.contact}>{dummyBooking.customer.email}</Text>
            <Text style={styles.contact}>{dummyBooking.customer.address}</Text>
          </View>
        </View>

        {/* Call / Chat buttons with Icons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.callBtn}>
            <Image source={require('../assets/Chat.png')} style={styles.icon} />
            <Text style={styles.btnTextWhite}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBtn}>
            <Image source={require('../assets/Chat.png')} style={styles.icon} />
            <Text style={styles.btnTextPrimary}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location with Google Map */}
      <Text style={styles.subHeader}>Location</Text>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 12.9716, longitude: 77.5946 }}
          title="Customer Location"
        />
      </MapView> */}

      {/* Start / Cancel Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={()=>navigation.navigate('TrackingScreen', { bookingId: 1 ,selectedBooking:2})}  style={styles.startBtn}>
          <Text style={styles.btnTextWhite}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('CancelBooking', { bookingId: 1 ,selectedBooking:2})} style={styles.cancelBtn}>
          <Text style={styles.btnTextPrimary}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RequestDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#062B67',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#062B67',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#062B67',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  time: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCC',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#062B67',
  },
  contact: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  callBtn: {
    backgroundColor: '#062B67',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chatBtn: {
    borderColor: '#062B67',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: '#062B67',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    borderColor: '#062B67',
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  btnTextWhite: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  btnTextPrimary: {
    color: '#062B67',
    fontWeight: '600',
    marginLeft: 6,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  map: {
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    width: width - 32,
  },
});

