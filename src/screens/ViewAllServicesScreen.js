import React, { useRef, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { updateFcmToken, fetchAllServiceTypes } from "../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const services = [
  { id: 1, name: "Plumbing" },
  { id: 2, name: "HVAC Maintenance" },
  { id: 3, name: "Electrical" },
  { id: 4, name: "Roofing & Gutter" },
  { id: 5, name: "Painting & Interior" },
  { id: 6, name: "Pest Control" },
];

const ViewAllServicesScreen = ({ navigation, route }) => {
  const { title } = route.params || { title: "All Services" };
  const dispatch = useDispatch();
  const serviceTypes = useSelector((state) => state.auth.serviceTypes);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RequestDetails', { serviceId: item?.service_type_id })}  style={styles.serviceRequestCard}>
        <View style={styles.grayBox} >
        <Image source={{ uri: item?.icon }} style={styles.serviceIcon} />
        </View>
              <View style={{
                flex: 1,             // Takes up remaining space
                // backgroundColor: "red",
                padding: 10,         // Only this box gets padding
                justifyContent: "center"
              }}>
                <Text style={styles.serviceTitle}>{item?.service_type_name}</Text>
                <Text style={styles.serviceMeta}>{item?.location}</Text>
                <Text style={styles.serviceMeta}>{item?.time}</Text>
              </View>
      {/* <Image source={{ uri: item?.icon }} style={styles.serviceIcon} />
      <Text style={styles.serviceText}>{item?.service_type_name}</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.header}>Service requests</Text>
            </TouchableOpacity>

      {/* Dynamic Title */}
      {/* <Text style={styles.header}>{title}</Text> */}

      <FlatList
        data={title== "All Services"?  serviceTypes?.service :serviceTypes?.emergency_service }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#FFF" },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: "#007BFF" },
  header: { fontSize: 22, fontWeight: "bold", color:'black'},
  listContainer: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: { width: 40, height: 40, marginRight: 15 },
  serviceText: { fontSize: 16, fontWeight: "500" },
  backButton: { marginBottom: 20, flexDirection: 'row',alignItems:'center' },
  backIcon: {
      height: 20,
      width: 20,
      marginTop: 5,
      marginRight: 15
  },
  serviceRequestCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    height: 100, // or whatever fixed height you want
  },

  statCard: {
    width: "47%",
    height: 100,
    borderRadius: 10,

    marginBottom: 15,
    justifyContent: "flex-end",
    backgroundColor: "#E0F0FF",
    borderRadius: 10,
    overflow: "hidden",
    overflow: "hidden",        // Important for rounded corners
    // padding: 10,
  },
  innerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 7, // Padding INSIDE the image background
  },

  imageBackgroundStyle: {
    borderRadius: 10,  // moved to imageStyle of ImageBackground
    width: '100%',
    padding: 10
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  statLabel: {
    fontSize: 12,
    color: "white",
  },
  grayBox: {
    width: 80,
    backgroundColor: "gray",
    alignItems:'center',
    justifyContent:'center'
  },
  serviceMeta: {
    fontSize: 12,
    color: "#666",
    // marginBottom:10
  },
  serviceTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: 'black'
  },
});

export default ViewAllServicesScreen;
