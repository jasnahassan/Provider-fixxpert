import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity,ImageBackground } from 'react-native';
import Sound from 'react-native-sound';

// Sound config
Sound.setCategory('Playback');

const playReminderSound = () => {
  const reminderSound = new Sound('notificationsound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    reminderSound.play(() => {
      reminderSound.release(); // Free up memory
    });
  });
};

const ReminderModal = ({ visible, onClose, hoursLeft, jobType }) => {
  useEffect(() => {
    if (visible) {
      playReminderSound();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 280, borderRadius: 20, backgroundColor: 'white', overflow: 'hidden' }}>
          {/* Header */}
          <View style={{ backgroundColor: '#014D84', padding: 15, position: 'relative' }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
              Job Reminder
            </Text>
            <TouchableOpacity onPress={onClose} style={{ position: 'absolute', right: 15, top: 10 }}>
              <Text style={{ color: 'white', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={{ alignItems: 'center', padding: 25 }}>
            {/* <View
              style={{
                backgroundColor: '#E0F0FF',
                width: 80,
                height: 80,
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text style={{ color: '#014D84', fontWeight: 'bold', fontSize: 20 }}>{hoursLeft}H</Text>
            </View> */}

<View style={{ alignItems: 'center', padding: 25 }}>
  <ImageBackground
    source={require('../assets/achievement.png')} // Replace with your image path
    style={{
      width: 80,
      height: 80,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      overflow: 'hidden', // Ensures rounded corners clip image
    }}
    imageStyle={{
      borderRadius: 999, // Ensures image itself is circular
    }}
  >
    <Text style={{ color: '#014D84', fontWeight: 'bold', fontSize: 20 }}>{hoursLeft}H</Text>
  </ImageBackground>
</View>

            <Text style={{ fontSize: 16, marginBottom: 20 }}>{jobType}</Text>

            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: '#014D84',
                borderRadius: 25,
                paddingVertical: 10,
                paddingHorizontal: 40,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>STOP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderModal;
