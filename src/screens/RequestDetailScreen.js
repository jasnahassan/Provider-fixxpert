import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { updateBookingstatus ,fetchAdditionalAmount} from '../redux/AuthSlice';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const { width } = Dimensions.get('window');

const RequestDetailScreen = ({ navigation,route }) => {
  const { serviceItem } = route.params;
  const [loadingindicator, setLoadingindicator] = useState(false);
  const dispatch = useDispatch();
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

  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => {
      console.warn('Failed to make call:', err);
    });
  };

  useEffect(()=>{
console.log(serviceItem,'hhh')

  },[])
  const handleStartPress = () => {
    // if (!selectedReason && !customReason.trim()) {
    //     alert('Please select or enter a reason');
    //     return;
    // }
    if (serviceItem?.booking_status_id >= 10) {
      dispatch(fetchAdditionalAmount(serviceItem?.booking_id))
      .unwrap()
      .then(res => {
        // First update booking status
           console.log(res,'here additional amount')

            navigation.navigate('ServiceStatusScreen', { bookingItem: serviceItem ,additionalAmountResponse: res[0],});
            // After status update, show alert and navigate
            // Alert.alert('Success', 'Additional amount submitted!');
            // navigation.navigate('ServiceStatusScreen', {
            //   bookingItem,
            //   additionalAmountResponse: res,
            // });
        
      })
      .catch(err => {
        Alert.alert('Error', `Additional amount submission failed: ${err}`);
      });
    
      return;
  }


    dispatch(updateBookingstatus({ bookingId:serviceItem?.booking_id,booking_status:7 }))
        .unwrap()
        .then(() => {

          navigation.navigate('TrackingScreen', { bookingItem:serviceItem })
            // setSuccessModalVisible(true);
            // navigation.navigate('CancelConfirmation');
        })
        .catch((err) => {
            console.log('Cancel error:', err);
            alert('Failed to cancel booking');
        });
};


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Booking</Text>

      {/* Service Info with Image */}
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceTitle}>{serviceItem?.service_name}</Text>
          <Text style={styles.bookingId}>Booking ID : #{serviceItem?.booking_id}</Text>
          <Text style={styles.date}>Date : {moment.utc(serviceItem?.booked_date_time).local().format("YYYY-MM-DD")}</Text>
          <Text style={styles.time}>Scheduled Time :  {moment.utc(serviceItem?.booked_date_time).local().format("hh:mm A")}</Text>
        </View>
        <Image
          source={{uri:serviceItem?.service_icon}} // Replace with your image
          style={styles.serviceImage}
        />
      </View>

      {/* Customer Info */}
      <Text style={styles.subHeader}>About Customer</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          {/* <View  style={styles.avatar}>
            
          </View> */}
          <Image
            source={{uri:serviceItem?.user.image}}
            style={styles.avatar}
          />
          <View style={styles.info}>
          <View style={styles.cardRow}>
          {/* <Image source={require('../assets/Profilered.png')} style={styles.icon} /> */}
          <Text style={styles.name}>{serviceItem?.user?.name}</Text>
        </View>
       

        <View style={styles.cardRow}>
          <Image resizeMode="contain" source={require('../assets/Callingred.png')} style={styles.icon} />
          
          <Text style={styles.contact}>{serviceItem?.user?.mobile}</Text>
           
        </View>
        <View style={styles.cardRow}>
          <Image resizeMode="contain" source={require('../assets/Emailred.png')} style={styles.icon} />
          
          <Text style={styles.contact}> {serviceItem?.user?.email}</Text>
           
        </View>
        <View style={styles.cardRow}>
          <Image source={require('../assets/Locationred.png')} style={styles.icon} />
          <Text style={styles.contact}> {serviceItem?.address_details?.address_line1},{serviceItem?.address_details?.address_line2}</Text>
          </View>    
           
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => handleCall(serviceItem?.user?.mobile)} style={styles.callBtn}>
            <Image source={require('../assets/Calling.png')} style={styles.icon} />
            <Text style={styles.btnTextWhite}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MessageScreen', { bookingId: serviceItem?.booking_id, userId: serviceItem?.user_id, providerId: serviceItem?.provider_id })} style={styles.chatBtn}>
            <Image source={require('../assets/Chat.png')} style={styles.icon} />
            <Text style={styles.btnTextPrimary}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subHeader}>Location</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(serviceItem?.address_details?.lat), 
          longitude: parseFloat(serviceItem?.address_details?.long),
         
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: parseFloat(serviceItem?.address_details?.lat), 
            longitude: parseFloat(serviceItem?.address_details?.long)}}
          title="Customer Location"
        />
      </MapView>
{serviceItem.booking_status_id != 13 && (
    <View style={styles.buttonRow}>
    <TouchableOpacity onPress={()=> handleStartPress()}  style={styles.startBtn}>
      <Text style={styles.btnTextWhite}>Start</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>navigation.navigate('CancelBooking', { selectedBooking:serviceItem})} style={styles.cancelBtn}>
      <Text style={styles.btnTextPrimary}>Cancel</Text>
    </TouchableOpacity>
  </View>

 )}   
      {/* Start / Cancel Buttons */}
    
    </ScrollView>
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
    marginVertical: 5,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardRow: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginTop: 15,
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
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999
  }
});

