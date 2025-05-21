import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Alert } from 'react-native';
import GradientButton from '../components/GradientButton';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, fetchServiceTypeById, fetchAllAddresses, uploadBookingImages } from '../redux/AuthSlice';

const BookingSummaryScreen = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const {
        addressId, selectedTab, selecteddate, selectedTime, description, serviceId, imagesToUpload
    } = route.params;
    const { serviceDetails, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log(addressId, serviceId, imagesToUpload, selecteddate, selectedTime, 'heree dataaa')
        if (serviceId) {
            //   dispatch(fetchServiceTypeById(serviceId));
            dispatch(fetchServiceTypeById(1));
        }
    }, [serviceId])
    const handleConfirmBooking = async () => {
        try {
            // Safely get time in 24-hour format if selectedTime is like "07:30 PM"
            const convertTo24Hour = (time12h) => {
                const [time, modifier] = time12h.split(' ');
                let [hours, minutes] = time.split(':');
                if (modifier === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
                if (modifier === 'AM' && hours === '12') hours = '00';
                return `${hours}:${minutes}`;
            };

            // Convert time to 24-hour
            const time24 = convertTo24Hour(selectedTime); // "10:00"

            // Ensure selecteddate is a Date object
            let dateObj;
            if (selecteddate instanceof Date) {
                dateObj = selecteddate;
            } else if (typeof selecteddate === 'string') {
                dateObj = new Date(selecteddate); // assumes it's in ISO format or 'YYYY-MM-DD'
            } else {
                throw new Error("Invalid date format");
            }

            // Extract date part in YYYY-MM-DD
            const datePart = dateObj.toISOString().split("T")[0]; // "2025-04-15"

            const bookedDateTime = new Date(`${datePart}T${time24}:00Z`).toISOString();

            const bookingData = {
                service_type_id: serviceId,
                city_id: addressId?.city || 1, // or use hardcoded value
                booking_time_amount: null,
                booking_time_currency_id: null,
                booked_date_time: bookedDateTime,
                payment_type_id: 1,
                building_type: 1,
                service_description: description,
                address_id: addressId?.address_id,
                cancel_reason: null,
                coupon_id: null,
            };

            console.log("📦 Sending bookingData:", bookingData);

            const data = await dispatch(createBooking(bookingData)).unwrap();
            console.log("✅ Booking response:", data);
            setModalVisible(true);

            if (imagesToUpload?.length > 0) {
                try {
                    console.log("🖼️ Preparing to upload images:", imagesToUpload);
                    const formattedImages = imagesToUpload.map((imgUri, index) => ({
                        uri: imgUri,
                        type: 'image/jpeg',
                        name: `photo_${index}.jpg`,
                    }));

                    const imageUploadResponse = await dispatch(uploadBookingImages({
                        booking_id: data?.booking_id,
                        booking_images: formattedImages,
                    })).unwrap();

                    if (imageUploadResponse?.success) {
                        console.log("✅ Images uploaded successfully!", imageUploadResponse);
                    } else {
                        console.log("⚠️ Upload failed or partially succeeded:", imageUploadResponse);
                    }

                } catch (error) {
                    console.error("❌ Image upload failed:", error);
                    Alert.alert("Image Upload Failed", "Please try uploading again later.");
                }
            }

        } catch (error) {
            console.error("❌ Booking failed:", error);
            Alert.alert("Booking Failed", error?.toString());
        }
    };





    const handlesuccess = () => {
        setModalVisible(false)
        navigation.navigate('Main')
    }
    return (
        <View style={styles.container}>
            {/* Address Section */}
            <View style={styles.card}>
                <View style={styles.row}>
                    {/* Image on the left */}
                    <Image
                        source={require('../assets/adress.png')}
                        style={styles.icon}
                    />

                    {/* Address info on the right */}
                    <View style={styles.addressColumn}>
                        <Text style={styles.sectionTitle}>Home</Text>
                        <Text style={styles.addressText}>{addressId?.address_line1}</Text>
                        <Text style={styles.addressText}>{addressId?.address_line2}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    {/* Image on the left */}
                    <Image
                        source={require('../assets/time.png')}
                        style={styles.icon}
                    />

                    {/* Address info on the right */}
                    <View style={styles.addressColumn}>

                        <Text style={styles.addressText}>{addressId?.created_on}</Text>
                        <Text style={styles.addressText}></Text>
                    </View>
                </View>

            </View>

            {/* Selected Service Section */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Selected Service</Text>
                <View style={styles.serviceRow}>
                    <View style={styles.imagePlaceholder}>
                        <Image source={{ uri: serviceDetails?.icon }} style={styles.serviceImage} />
                    </View>
                    <View>
                        <Text style={styles.serviceName}>{serviceDetails?.service_type_name}</Text>
                        <Text style={styles.servicePrice}>₹{serviceDetails?.basic_amount}</Text>
                        <Text style={styles.serviceDetails}>• 45 mins</Text>
                        <Text style={styles.serviceDetails}>
                            {serviceDetails?.description}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Payment Summary</Text>
                {/* <View style={styles.row}><Text style={{ color: 'black' }}>Price</Text><Text style={{ color: 'black' }}>₹{serviceDetails?.basic_amount}</Text></View>
                <View style={styles.row}><Text style={{ color: 'black' }}>Sub Total</Text><Text style={{ color: 'black' }}>₹50</Text></View>
                <View style={styles.row}><Text style={{ color: 'black' }}>Discount (5% off)</Text><Text style={{ color: 'black' }}>-₹50</Text></View>
                <View style={styles.row}><Text style={{ color: 'black' }}>Tax</Text><Text style={styles.tax}>₹15.12</Text></View>
                <View style={styles.row}><Text style={{ color: 'black' }}>Coupon</Text><Text style={styles.coupon}>Apply Coupon</Text></View> */}
                <View style={styles.totalRow}><Text style={{ color: 'black' }}>Total Amount</Text><Text style={styles.totalAmount}>₹255.12</Text></View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.previousButton}>
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookButton} onPress={() => handleConfirmBooking()}>
                    <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>

                {/* Booking Successful Modal */}
                <Modal transparent={true} visible={modalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* <Icon name="check-circle" size={60} color="#e53935" /> */}
                            <Image source={require('../assets/Check.png')} style={styles.image} />
                            <Text style={styles.successText}>Booking Successful</Text>
                            <Text style={styles.modalDescription}>It is a long established fact that a reader will be distracted by the readable </Text>

                            <GradientButton
                                title="Back To Home"
                                onPress={handlesuccess}
                                margintop={20}

                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#f5f5f5", flex: 1 },
    card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: 'black' },
    addressText: { color: "#555", marginBottom: 5 },
    dateText: { color: "#777" },
    serviceRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    imagePlaceholder: { width: 60, height: 60, backgroundColor: "#ccc", borderRadius: 10, marginRight: 10 },
    serviceName: { fontSize: 14, fontWeight: "bold" },
    servicePrice: { fontSize: 14, color: "#000" },
    serviceDetails: { fontSize: 12, color: "#777" },
    row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, fontWeight: "bold" },
    totalAmount: { fontSize: 16, color: "red", fontWeight: "bold" },
    tax: { color: "blue" },
    coupon: { color: "blue", textDecorationLine: "underline" },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    previousButton: { backgroundColor: "#ccc", padding: 12, borderRadius: 8, flex: 1, marginRight: 10 },
    bookButton: { backgroundColor: "#e60023", padding: 12, borderRadius: 8, flex: 1 },
    buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
    bookButtonText: { color: "#000", textAlign: "center", fontWeight: "bold" },
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    icon: {
        width: 22,
        height: 22,
        marginRight: 12,
        marginTop: 4,
    },
    addressColumn: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
    },

});

export default BookingSummaryScreen;