import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextInputBox from '../components/TextInputBox';
import GradientButton from '../components/GradientButton';
import { createAdditionalAmount ,uploadProviderDocuments,updateBookingstatus} from '../redux/AuthSlice';
import { useDispatch } from 'react-redux';

const EstimationScreen = ({ navigation,route }) => {
  const { bookingItem } = route.params;
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null); // ✅ new state
  const dispatch = useDispatch();


  const handleSave = async () => {
    if ( !amount  || !minutes || !description) {
      Alert.alert('Validation Error', 'Please fill in all fields .');
      return;
    }
    if ( !imageUri ) {
      Alert.alert('Validation Error', 'Please upload an image ');
      return;
    }

        // 1. Upload selfie (provider_id: 0)
        const selfieFile = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'selfie.jpg',
        };
  
        const selfieResult = await dispatch(
          uploadProviderDocuments({
            provider_id: 0,
            documents: [selfieFile],
          })
        );
  
       
      if (!uploadProviderDocuments.fulfilled.match(selfieResult)) {
        throw new Error('Selfie upload failed');
      }
  
      const selfieUploadData = selfieResult.payload;
      const profileImagePath = selfieUploadData?.[0]?.path

      const originalAmount = parseFloat(amount);
const gstAmount = parseFloat((originalAmount * 0.18).toFixed(2));
const totalAmountWithGst = parseFloat((originalAmount + gstAmount).toFixed(2));
  
    const payload = {
      // additional_amount_id: parseInt(additionalAmount),
      // amount: parseFloat(amount),
      amount: parseFloat((parseFloat(amount) * 1.18).toFixed(2)),
      booking_id: bookingItem?.booking_id,
      description: description,
      number_of_days_to_completed: 0,
      number_of_hours_to_completed: parseInt(minutes),
      image:profileImagePath
    };
  
    dispatch(createAdditionalAmount(payload))
    .unwrap()
    .then(res => {
      // First update booking status
      dispatch(updateBookingstatus({ bookingId: bookingItem?.booking_id, booking_status: 10 }))
        .unwrap()
        .then(() => {
          // After status update, show alert and navigate
          Alert.alert('Success', 'Additional amount submitted!');
          navigation.navigate('ServiceStatusScreen', {
            bookingItem,
            additionalAmountResponse: res,
          });
        })
        .catch(statusErr => {
          Alert.alert('Error', `Booking status update failed: ${statusErr}`);
        });
    })
    .catch(err => {
      Alert.alert('Error', `Additional amount submission failed: ${err}`);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          <Text style={styles.title}>Add Service additional amount</Text>
        </TouchableOpacity>
      {/* <Text style={styles.header}>Add Service</Text> */}

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

      {/* <TextInputBox placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" /> */}
      <View style={{ marginBottom: 8 }}>
  <TextInputBox
    placeholder="Amount"
    value={amount}
    onChangeText={setAmount}
    keyboardType="numeric"
  />
  <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>+18% GST</Text>
</View>
      {/* <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <TextInputBox placeholder="Duration Days" value={hours} onChangeText={setHours} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <TextInputBox placeholder="Duration Hours" value={minutes} onChangeText={setMinutes} keyboardType="numeric" />
        </View>
      </View> */}
               <TextInputBox placeholder="Duration Hours" value={minutes} onChangeText={setMinutes} keyboardType="numeric" />

      <TextInputBox 
        placeholder="Description of service" 
        value={description} 
        onChangeText={setDescription} 
        keyboardType="default"
        multiline={true} // ✅ enable multiline
        returnKeyType="done"
        blurOnSubmit={true}
      />

      <GradientButton title="Save" onPress={handleSave} width={'100%'} />

      <Image source={require('../assets/Image.png')} resizeMethod='resize' resizeMode="stretch" style={styles.banner} />

    </View>
  </TouchableWithoutFeedback>
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
    height: 150,
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
  banner: { width: "100%", height: 100, borderRadius: 10, marginBottom: 20 ,marginTop:12},


});

export default EstimationScreen;
