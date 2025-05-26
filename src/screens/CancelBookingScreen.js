import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Modal
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateBookingstatus } from '../redux/AuthSlice';
import GradientButton from '../components/GradientButton';


const CancelBookingScreen = ({ navigation }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const dispatch = useDispatch();
    const route = useRoute();
    const { bookingId } = route.params;
    const [successModalVisible, setSuccessModalVisible] = useState(false);


    useEffect(() => {
        console.log('Received Booking ID:', bookingId);
        // use it to fetch or display info related to this booking
    }, []);

    const reasons = [
        'Found another service',
        'Price is too high',
        'Change of plans',
        'Booked by mistake',
        'Service no longer needed'
    ];

    const handleCancelPress = () => {
        if (!selectedReason && !customReason.trim()) {
            alert('Please select or enter a reason');
            return;
        }

        dispatch(updateBookingstatus({ bookingId:bookingId,booking_status:4 }))
            .unwrap()
            .then(() => {
                setSuccessModalVisible(true);
                // navigation.navigate('CancelConfirmation');
            })
            .catch((err) => {
                console.log('Cancel error:', err);
                alert('Failed to cancel booking');
            });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Title & Amount Card with Image */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.title}>Cancel Booking</Text>
            </TouchableOpacity>
            <View style={styles.card}>
                <Image
                    source={{ uri: 'https://ritikamirchandani.com/uploads/383/20240508055131.jpg' }} // replace with your image URL or local path
                    style={styles.image}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.serviceTitle}>Cabinet maintenance</Text>
                    <Text style={styles.price}>₹699</Text>
                </View>

            </View>

            <Text style={styles.label}>Reason For Cancellation</Text>

            {reasons.map((reason, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.optionRow}
                    onPress={() => setSelectedReason(reason)}
                >
                    <View style={[styles.radioCircle, selectedReason === reason && styles.selectedRadio]} />
                    <Text style={styles.optionText}>{reason}</Text>
                </TouchableOpacity>
            ))}

            <TextInput
                style={styles.input}
                placeholder="A reason here for cancellation of booking..."
                placeholderTextColor={'gray'}
                multiline
                value={customReason}
                onChangeText={setCustomReason}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelPress}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <Modal transparent={true} visible={successModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image source={require('../assets/Check.png')} style={styles.image} />
                        <Text style={styles.successText}>Booking Cancelled</Text>
                        <Text style={styles.modalDescription}>
                            Your booking has been successfully cancelled.
                        </Text>
                        <GradientButton
                            title="Back To Home"
                            onPress={() => {
                                setSuccessModalVisible(false);
                                navigation.navigate('Main') 
                            }}
                            margintop={20}
                        />
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center'
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10

    },
    serviceTitle: { fontSize: 18, fontWeight: '600',color:'black' },
    price: { fontSize: 16, color: '#888', marginTop: 4 },
    label: { fontSize: 15, fontWeight: '500', marginBottom: 10 ,color:'black'},
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    radioCircle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#093759',
        marginRight: 10
    },
    selectedRadio: {
        backgroundColor: '#093759'
    },
    optionText: {
        fontSize: 14,
        color: '#333'
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginTop: 20,
        minHeight: 80,
        textAlignVertical: 'top',
        backgroundColor: '#f9f9f9',
        color:'black'
    },
    cancelBtn: {
        backgroundColor: '#093759',
        borderRadius: 12,
        marginTop: 30,
        paddingVertical: 15,
        alignItems: 'center'
    },
    cancelBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600'
    },
    backIcon: {
        height: 20,
        width: 20,
        marginTop: 5,
        marginRight: 15
    },
    title: {
        fontSize: 20,
        color: 'black'
    },
    backButton: { marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
    successText: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#DB3043' },
    modalDescription: { textAlign: 'center', marginBottom: 15 },
    modalButton: { backgroundColor: '#e53935', padding: 10, borderRadius: 5 },
    modalButtonText: { color: '#fff', fontWeight: 'bold' },
    image: {
        width: 115,
        height: 115,
        marginBottom: 25,
        marginTop: 20
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },

});

export default CancelBookingScreen;
