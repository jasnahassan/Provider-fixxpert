import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ActionSheetIOS
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextInputBox from '../../components/TextInputBox';
import GradientButton from '../../components/GradientButton';

const IDVerificationScreen = ({ navigation, route }) => {
  const [identityProof, setIdentityProof] = useState('');
  const [addressProof, setAddressProof] = useState('');
  const [identityImage, setIdentityImage] = useState(null);
  const [addressImage, setAddressImage] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handlePickImage = async (type) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage or camera permission is required.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.5,
    };

    const callback = (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets?.length > 0) {
        const uri = response.assets[0].uri;
        if (type === 'identity') setIdentityImage(uri);
        else if (type === 'address') setAddressImage(uri);
        else setSelfie(uri);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) launchCamera(options, callback);
          else if (buttonIndex === 2) launchImageLibrary(options, callback);
        }
      );
    } else {
      Alert.alert('Choose Option', '', [
        { text: 'Camera', onPress: () => launchCamera(options, callback) },
        { text: 'Gallery', onPress: () => launchImageLibrary(options, callback) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleNext = () => {
    if (!identityProof.trim()) {
      Alert.alert('Error', 'Please enter Identity Proof');
      return;
    }
    if (!addressProof.trim()) {
      Alert.alert('Error', 'Please enter Address Proof');
      return;
    }
    if (!identityImage || !addressImage || !selfie) {
      Alert.alert('Error', 'Please upload all required documents.');
      return;
    }

    const idData = {
      identityProof,
      addressProof,
      identityImage,
      addressImage,
      selfie,
    };

    navigation.navigate('BankDetails', {
      ...route.params,
      idVerification: idData,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ID Verification</Text>

      <TextInputBox
        placeholder="Identity Proof (Aadhaar/PAN)"
        value={identityProof}
        onChangeText={setIdentityProof}
      />
      <Text style={styles.label}>Upload Identity Proof</Text>
      <TouchableOpacity onPress={() => handlePickImage('identity')} style={styles.uploadBox}>
        {identityImage ? (
          <Image source={{ uri: identityImage }} style={styles.selfie} />
        ) : (
          <Text style={styles.uploadText}>Tap to Upload</Text>
        )}
      </TouchableOpacity>
      <TextInputBox
        placeholder="Address Proof"
        value={addressProof}
        onChangeText={setAddressProof}
      />



      <Text style={styles.label}>Upload Address Proof</Text>
      <TouchableOpacity onPress={() => handlePickImage('address')} style={styles.uploadBox}>
        {addressImage ? (
          <Image source={{ uri: addressImage }} style={styles.selfie} />
        ) : (
          <Text style={styles.uploadText}>Tap to Upload</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Upload Selfie</Text>
      <TouchableOpacity onPress={() => handlePickImage('selfie')} style={styles.uploadBox}>
        {selfie ? (
          <Image source={{ uri: selfie }} style={styles.selfie} />
        ) : (
          <Text style={styles.uploadText}>Tap to Upload</Text>
        )}
      </TouchableOpacity>

      <GradientButton width={'100%'} title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#062B67' },
  label: { marginBottom: 6, fontSize: 16, color: '#333' },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  uploadText: { color: '#666' },
  selfie: { width: '100%', height: '100%', resizeMode: 'cover' },
});

export default IDVerificationScreen;
