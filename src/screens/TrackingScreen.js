import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GradientButton from '../components/GradientButton'; // Adjust path accordingly

const TrackingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Location</Text>
      <Image source={require('../assets/Chat.png')} style={styles.map} />
      <View style={styles.details}>
        <Text style={styles.name}>Animesh Dave</Text>
        <Text style={styles.location}>Bangalore, Karnataka, India, 560002.</Text>
        <Text style={styles.time}>11 July 2025 at 11:30 AM</Text>
        <Text style={styles.person}>Charlotte</Text>
      </View>
      <GradientButton title="Arrived" onPress={() => {navigation.navigate('EstimationScreen')}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  map: { height: 200, width: '100%', resizeMode: 'contain', marginBottom: 20 },
  details: { marginBottom: 20 },
  name: { fontSize: 18, fontWeight: '600' },
  location: { color: '#555', marginTop: 4 },
  time: { color: '#555', marginTop: 4 },
  person: { color: '#555', marginTop: 4 },
});

export default TrackingScreen;
