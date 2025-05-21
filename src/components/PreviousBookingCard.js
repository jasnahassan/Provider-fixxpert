import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';

const PreviousBookingCard = ({ booking, onFeedback }) => {
    return (
        <View style={styles.cardWrapper}>
            {/* Top Section: Image + Title + Price */}
            <View style={styles.topRow}>
            <Image  source={{ uri: 'https://ritikamirchandani.com/uploads/383/20240508055131.jpg' }}  style={styles.imagePlaceholder} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.service}>{booking?.service_name}</Text>
                    <Text style={styles.price}>₹699</Text>
                </View>
            </View>

            {/* White Box with Details */}
            <View style={styles.whiteCard}>
                {/* Top Divider Line */}
               

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Date & Time</Text>
                    <Text style={styles.value}>{booking?.booked_date_time}]</Text>
                </View>
                {/* <View style={styles.topBorder} />
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.value}>{booking.time}</Text>
                </View> */}
                <View style={styles.topBorder} />
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Provider</Text>
                    <Text style={styles.value}>{booking?.provider_details?.name}</Text>
                </View>
                <View style={styles.topBorder} />
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Payment</Text>
                    <Text style={styles.value}>{booking?.payment_method}</Text>
                </View>
                <View style={styles.topBorder} />
                <TouchableOpacity style={styles.feedbackBtn} onPress={onFeedback}>
                    <Text style={styles.feedbackText}>Share Feedback</Text>
                </TouchableOpacity>
            </View>

      
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    imagePlaceholder: {
        width: 48,
        height: 48,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
    },
    service: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    price: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginTop: 4,
    },
    whiteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        marginTop: 4,
    },
    topBorder: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginBottom: 8,
        marginTop:10
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    label: {
        fontSize: 13,
        color: '#888',
    },
    value: {
        fontSize: 13,
        color: '#000',
        fontWeight: '500',
    },
    feedbackBtn: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    feedbackText: {
        fontSize: 14,
        color: '#E53935',
        fontWeight: '600',
    },
});

export default PreviousBookingCard;
