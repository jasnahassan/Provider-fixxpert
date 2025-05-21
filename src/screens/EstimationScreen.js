import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextInputBox from '../components/TextInputBox';
import GradientButton from '../components/GradientButton';

const EstimationScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null); // ✅ new state

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
          <TextInputBox placeholder="Duration Hours" value={hours} onChangeText={setHours} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <TextInputBox placeholder="Duration Mint" value={minutes} onChangeText={setMinutes} keyboardType="numeric" />
        </View>
      </View>
      <TextInputBox 
        placeholder="Description of service" 
        value={description} 
        onChangeText={setDescription} 
        multiline={true} // ✅ enable multiline
      />

      <GradientButton title="Save" onPress={() => navigation.navigate('ServiceStatusScreen')} />
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
