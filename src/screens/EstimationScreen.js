import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextInputBox from '../components/TextInputBox';
import GradientButton from '../components/GradientButton';
import { createAdditionalAmount } from '../redux/AuthSlice';
import { useDispatch } from 'react-redux';

const EstimationScreen = ({ navigation,route }) => {
  const { bookingItem } = route.params;
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null); // ✅ new state
  const dispatch = useDispatch();


  const handleSave = () => {
    if ( !amount || !hours || !minutes || !description) {
      Alert.alert('Validation Error', 'Please fill in all fields .');
      return;
    }
  
    const payload = {
      // additional_amount_id: parseInt(additionalAmount),
      amount: parseFloat(amount),
      booking_id: bookingItem?.booking_id,
      description: description,
      number_of_days_to_completed: parseInt(hours),
      number_of_hours_to_completed: parseInt(minutes),
    };
  
    dispatch(createAdditionalAmount(payload))
      .unwrap()
      .then(res => {
        Alert.alert('Success', 'Estimation submitted!');
        navigation.navigate('ServiceStatusScreen', {
          bookingItem,
          additionalAmountResponse: res, // Pass response
        });
      })
      .catch(err => {
        Alert.alert('Error', err);
      });
  };

  const handleImagePick = () => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.5 });
    if (!result.didCancel && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.5 });
    if (!result.didCancel && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Service</Text>

      <TouchableOpacity style={styles.imageBox} onPress={handleImagePick}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <>
            <Image source={require('../assets/Chat.png')} style={styles.imageIcon} />
            <Text style={styles.imageText}>Choose Image</Text>
          </>
        )}
      </TouchableOpacity>

      <TextInputBox placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <TextInputBox placeholder="Duration Days" value={hours} onChangeText={setHours} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <TextInputBox placeholder="Duration Hours" value={minutes} onChangeText={setMinutes} keyboardType="numeric" />
        </View>
      </View>
      <TextInputBox 
        placeholder="Description of service" 
        value={description} 
        onChangeText={setDescription} 
        multiline={true} // ✅ enable multiline
      />

      <GradientButton title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  imageBox: {
    borderWidth: 1,
    borderColor: '#093759',
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    height: 180,
    justifyContent: 'center',
  },
  imageIcon: { width: 40, height: 40, marginBottom: 8 },
  imageText: { color: '#093759' },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default EstimationScreen;
