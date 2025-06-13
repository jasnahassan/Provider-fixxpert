// PersonalDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView ,Alert, TouchableOpacity} from 'react-native';
import TextInputBox from '../../components/TextInputBox';
import GradientButton from '../../components/GradientButton';
import CityPickerBox from "../../components/CityPickerBox";
import { useDispatch, useSelector } from 'react-redux';
import {  fetchCities } from '../../redux/AuthSlice';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const PersonalDetailsScreen = ({ navigation, route }) => {
  const [dob, setDob] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [parentName, setParentName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setstate] = useState('');
  const [pincode, setPincode] = useState('');
  const dispatch = useDispatch();
  const { cities } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCities());
}, [dispatch]);

const handleNext = () => {
    if (!dob.trim()) return Alert.alert('Validation Error', 'Please enter Date of Birth');
    if (!gender.trim()) return Alert.alert('Validation Error', 'Please enter Gender');
    if (!nationality.trim()) return Alert.alert('Validation Error', 'Please enter Nationality');
    if (!parentName.trim()) return Alert.alert('Validation Error', 'Please enter Parent/Spouse Name');
    if (!address.trim()) return Alert.alert('Validation Error', 'Please enter Full Address');
    if (!city) return Alert.alert('Validation Error', 'Please enter City');
    if (!state.trim()) return Alert.alert('Validation Error', 'Please enter State');
    if (!pincode.trim()) return Alert.alert('Validation Error', 'Please enter Pincode');
    if (pincode.length != 6 ) return Alert.alert('Validation Error', 'Please enter a valid 6-digit pincodee');

    const personalDetails = {
      dob,
      gender,
      nationality,
      parentName,
      address,
      city,
      state,
      pincode,
    };

    navigation.navigate('AdditionalDetails', {
      ...route.params,
      personalDetails,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personal Details</Text>
      {/* <TextInputBox placeholder="Date of Birth (DD/MM/YYYY)" editable={false} value={dob} onChangeText={setDob} /> */}
      <TouchableOpacity  onPress={() => setOpenDatePicker(true)} >
      <TextInputBox 
  placeholder="Date of Birth (DD/MM/YYYY)" 
  value={dob} 
  editable={false} 
  onChangeText={setDob}
  // onPress={() => setOpenDatePicker(true)} 
/>
</TouchableOpacity>
      <DatePicker
  modal
  open={openDatePicker}
  date={dob ? moment(dob, 'DD/MM/YYYY').toDate() : new Date()}
  mode="date"
  maximumDate={new Date()}
  onConfirm={(selectedDate) => {
    setOpenDatePicker(false);
    const formattedDate = moment(selectedDate).format('DD/MM/YYYY');
    setDob(formattedDate);
  }}
  onCancel={() => setOpenDatePicker(false)}
/>
      {/* <TextInputBox placeholder="Gender" value={gender} onChangeText={setGender} /> */}
      <CityPickerBox
  placeholder=" Select Gender"
  label={"Select Gender"}
  selectedValue={gender}
  onValueChange={setGender}
  items={[
    { city_id: 'Male', city_name: 'Male' },
    { city_id: 'Female', city_name: 'Female' },
    { city_id: 'Others', city_name: 'Others' }
  ]}
/>
      <TextInputBox placeholder="Nationality" value={nationality} onChangeText={setNationality} />
      <TextInputBox placeholder="Father/Mother/Spouse Name" value={parentName} onChangeText={setParentName} />
      <TextInputBox placeholder="Full Address" value={address} onChangeText={setAddress} />
      {/* <TextInputBox placeholder="City" value={city} onChangeText={setCity} /> */}
      <CityPickerBox
            placeholder="Select City"
            selectedValue={city}
            onValueChange={setCity}
            items={cities}
          />
      <TextInputBox placeholder="State" value={state} onChangeText={setstate} />
      <TextInputBox placeholder="Pincode"  maxLength={6}  value={pincode} keyboardType="numeric" onChangeText={setPincode} />
      <GradientButton title="Next" width={'100%'} onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 , backgroundColor: "#FFF",},
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#062B67' },
});

export default PersonalDetailsScreen;
