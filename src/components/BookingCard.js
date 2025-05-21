import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // or use `react-native-vector-icons` if you're not using Expo

const BookingCard = ({ booking, isUpcoming, onCancel, onReschedule, onFeedback }) => {
    return (
        <View style={styles.card}>
            {/* Header Section */}
            <View style={styles.row}>
                <Image
                    source={require('../assets/home_active.png')} // use your image asset
                    style={styles.serviceImage}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.serviceTitle}>{booking?.service_name}</Text>
                    <Text style={styles.price}>₹{booking?.price || 0}</Text>
                </View>
                {booking?.status === 'completed' && (
                    <TouchableOpacity onPress={onFeedback}>
                        {/* <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FF4C4C" /> */}
                    </TouchableOpacity>
                )}
            </View>

            {/* Address */}
            <View style={styles.infoRow}>
            <Image
                    source={require('../assets/adress.png')} // use your image asset
                    style={styles.serviceImage2}
                />
                <View>
                <Text style={styles.infoText}>{booking?.address_details?.address_line1}</Text>
                <Text style={styles.infoText}>{booking?.address_details?.address_line2}</Text>
                </View>
              
            </View>
          

            {/* Date and Time */}
            <View style={styles.infoRow}>
            <Image
                    source={require('../assets/time.png')} // use your image asset
                    style={styles.serviceImage2}
                />
                <Text style={styles.infoText}>{booking?.booked_date_time}</Text>
            </View>

            {/* Provider and Payment */}
            <View style={styles.infoBoxContainer}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoBoxLabel}>Provider</Text>
                    <Text style={styles.infoBoxValue}>{booking?.provider_details?.name}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoBoxLabel}>Payment</Text>
                    <Text style={styles.infoBoxValue}>{booking?.payment_method}</Text>
                </View>
            </View>


            {/* Buttons */}
            {isUpcoming && (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.rescheduleBtn} onPress={onReschedule}>
                        <Text style={styles.btnText}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                        <Text style={styles.btnText2}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    serviceImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#eee',
    },
    serviceImage2: {
        width: 28,
        height: 28,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#eee',
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    price: {
        color: '#FF4C4C',
        fontSize: 15,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    infoText: {
        marginLeft: 6,
        color: '#555',
        fontSize: 14,
        flex: 1,
        flexWrap: 'wrap',
    },
    metaText: {
        color: '#999',
        fontSize: 13,
    },
    metaValue: {
        color: '#333',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    rescheduleBtn: {
        backgroundColor: '#fff',
        borderColor: '#DB3043',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#FF4C4C',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 1,
        alignItems: 'center',
    },
    btnText: {
        color: '#DB3043',
        fontWeight: '600',
    },
    btnText2: {
        color: 'white',
        fontWeight: '600',
    },
    infoBoxContainer: {
        flexDirection: 'column',
        gap: 10,
        marginTop: 12,
    },
    infoBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#fafafa',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoBoxLabel: {
        fontSize: 13,
        color: '#999',
        marginBottom: 4,
    },
    infoBoxValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },

});

export default BookingCard;
