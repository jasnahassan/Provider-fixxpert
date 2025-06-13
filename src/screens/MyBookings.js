
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image ,ActivityIndicator} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingByFilter } from '../redux/AuthSlice'; // Adjust path if needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

const MyBookings = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState('Latest');
  const [loadingindicator, setLoadingindicator] = useState(false);

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          <Text style={styles.title}> Services </Text>
        </TouchableOpacity>
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
              <Text style={styles.rowText}>{moment.utc(item?.booked_date_time).local().format("YYYY-MM-DD")} , {moment.utc(item?.booked_date_time).local().format("hh:mm A")}</Text>
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
    {loading && ( <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#093759" />
    </View>) } 
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
    width: 20,
    height: 20,
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
  backButton: { marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999
  }
});
