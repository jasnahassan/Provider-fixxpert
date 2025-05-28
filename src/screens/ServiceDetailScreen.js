import React, { useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import GradientButton from '../components/GradientButton';
import StarView from 'react-native-star-view';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceTypeById } from '../redux/AuthSlice';

const ServiceDetailScreen = ({ navigation ,route}) => {
    const rating = 4.8;
    const { serviceId } = route.params;
    const dispatch = useDispatch();
    const { serviceDetails, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (serviceId) {
        //   dispatch(fetchServiceTypeById(serviceId));
          dispatch(fetchServiceTypeById(1));
        }
      }, [serviceId]);

    return (
        <ScrollView style={styles.container}>
            {/* Service Image */}
            <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.title}>Back</Text>
            </TouchableOpacity>
                <Image source={{ uri: serviceDetails?.icon}} style={styles.serviceImage} />
                <TouchableOpacity style={styles.heartIcon}>
                    {/* <Ionicons name="heart-outline" size={24} color="#DB3043" /> */}
                </TouchableOpacity>
            </View>

            {/* Service Details */}
            <View style={styles.detailContainer}>
                

                {/* Rating & Price */}
                <View style={styles.ratingContainer}>
                <Text style={styles.serviceTitle}> {serviceDetails?.service_type_name}</Text>
                    {/* <StarView score={rating} style={styles.starView} /> */}
                    <Text style={styles.price}>₹{serviceDetails?.basic_amount}</Text>
                </View>

                <Text style={styles.description}>
                {serviceDetails?.description}
                    Leaky faucets and pipes can be a nuisance and a waste of water. Here are some key points related to leaky faucets and pipes.
                </Text>

                {/* Book Now Button */}
               

                {/* Reviews */}
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 }}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllRatings')}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.reviewItem}>
                    <Text style={styles.reviewUser}>Donna Bins - dec 03</Text>
                    <StarView score={rating} style={styles.starView} />
                    <Text style={styles.reviewText}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet.</Text>
                </View>
                <View style={styles.reviewItem}>
                    <Text style={styles.reviewUser}>Ashutosh Pandey - dec 02</Text>
                    <StarView score={rating} style={styles.starView} />
                    <Text style={styles.reviewText}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet.</Text>
                </View> */}
            </View>
            <GradientButton
                    title="Book Now"
                    onPress={() => navigation.navigate('BookingScreen', { serviceId: 1 })} 
                    borderRadius={8}
                />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:16
       

     
    },
    imageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 20,
    },
    detailContainer: {
        padding: 20,
        marginTop:100
    },
    serviceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color:'black'
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',  // Align items on both ends
        alignItems: 'center',
        marginVertical: 5,
        marginBottom:80
    },
    starView: {
        width: 100, // Adjust width based on design
        height: 20, // Adjust height based on design
    },
    price: {
        fontSize: 18,
        color: '#DB3043',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 120,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reviewItem: {
        marginBottom: 15,
    },
    reviewUser: {
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 14,
        color: '#666',
        marginTop:10
    },
    backButton: { marginBottom: 20, flexDirection: 'row',alignItems:'center' },
    backIcon: {
        height: 20,
        width: 20,
        marginTop: 5,
        marginRight: 15
    },
    title:{
        fontSize:20
    }
});

export default ServiceDetailScreen;
