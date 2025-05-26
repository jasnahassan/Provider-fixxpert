import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image ,TextInput} from 'react-native';
import GradientButton from '../components/GradientButton';

const ServiceStatusScreen = ({ navigation, route }) => {
    const { bookingItem, additionalAmountResponse } = route.params;
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [cashAmount, setCashAmount] = useState('');
    const timerRef = useRef(null);
    const serviceList = additionalAmountResponse?.description
        ? additionalAmountResponse.description.split(/\n|,/).map(item => item.trim()).filter(Boolean)
        : [];

    const isPaid = additionalAmountResponse?.paid === 1;


    const formatTime = (s) => {
        const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
        const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const secs = String(s % 60).padStart(2, '0');
        return { hrs, mins, secs };
    };

    const handleTimerToggle = () => {
        if (isRunning) {
            clearInterval(timerRef.current);
        } else {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }
        setIsRunning(!isRunning);
    };

    const { hrs, mins, secs } = formatTime(seconds);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Service status</Text>
            <Text style={styles.serviceName}>{bookingItem?.service_name}</Text>

            {/* Timer Section */}
            <View style={styles.timerCard}>
                <View style={styles.timerBox}>
                    <View style={styles.timerBox}>
                        <View style={styles.timeColumn}>
                            <Text style={styles.timerText}>{hrs}</Text>
                            <Text style={styles.label}>HOURS</Text>
                        </View>
                        <Text style={styles.colon}>:</Text>
                        <View style={styles.timeColumn}>
                            <Text style={styles.timerText}>{mins}</Text>
                            <Text style={styles.label}>MINUTES</Text>
                        </View>
                        <Text style={styles.colon}>:</Text>
                        <View style={styles.timeColumn}>
                            <Text style={styles.timerText}>{secs}</Text>
                            <Text style={styles.label}>SECONDS</Text>
                        </View>
                    </View>
                </View>

                <GradientButton
                    title={isRunning ? 'STOP' : 'START'}
                    onPress={handleTimerToggle}
                    width={150}
                    margintop={10}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AdditionalAmountScreen', { bookingItem: bookingItem })}>
                <Text style={{ color: 'black', fontSize: 17 }}>
                    Additional Amount
                </Text>
            </TouchableOpacity>
            {/* Services List */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Services list</Text>
                {serviceList.length > 0 ? (
                    serviceList.map((item, index) => (
                        <View key={index} style={styles.serviceRow}>
                            <Image
                                source={require('../assets/redcheck.png')}
                                style={styles.bulletIcon}
                            />
                            <Text style={styles.serviceItem}>{item}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.serviceItem}>No services listed</Text>
                )}
            </View>


            {/* Payment Info */}
            <View style={styles.paymentBox}>
                <Image
                    source={
                        isPaid
                            ? require('../assets/greencheck.png')  // ✅ Use green tick
                            : require('../assets/delete.png') // ❌ Use red X
                    }
                    style={{ width: 30, height: 30, marginRight: 10, marginBottom: 10 }}
                />
                <Text style={styles.paymentText}>
                    {isPaid ? 'Payment Received' : 'Payment not Received'}
                </Text>
            </View>

            <Text style={styles.note}>⚠️ Customer needs to pay before service completion</Text>

            <GradientButton
    title="Pay Now"
    onPress={() => setShowModal(true)}
    width={200}
    margintop={10}
/>

            <GradientButton title="Complete" onPress={() => { }} />

            {showModal && (
    <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment verification</Text>
            <Text style={styles.modalSubText}>
                ⚠️ Online payment is not detected{'\n'}If customer paid in cash, please enter the amount below
            </Text>

            {/* <Text style={styles.customerName}>Customer: {bookingItem?.user_name || 'N/A'}</Text> */}
            <Text style={styles.amountText}>₹ {additionalAmountResponse?.amount || '0'}</Text>
{/* 
            <View style={styles.inputBox}>
                <Text>₹</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter the Amount"
                    keyboardType="numeric"
                    value={cashAmount}
                    onChangeText={setCashAmount}
                />
            </View> */}

            <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    // You can validate and send the cash amount here
                    setShowModal(false);
                }} style={styles.confirmButton}>
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
)}

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
    header: { fontSize: 20, fontWeight: 'bold', color: 'black' },
    serviceName: { fontSize: 18, marginVertical: 10, color: 'black' },

    timerCard: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        marginBottom: 20,
        marginTop: 10,
    },

    timerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    timerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'green',
        paddingHorizontal: 8,
    },
    colon: { fontSize: 24, color: 'green' },

    section: { marginVertical: 15 },
    sectionTitle: { fontWeight: 'bold', marginBottom: 5, color: 'black' },
    serviceItem: { marginLeft: 10, marginBottom: 3, color: 'black' },

    // paymentBox: {
    //     backgroundColor: 'red',
    //     padding: 12,
    //     borderRadius: 12,
    //     marginTop: 20,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     height: 150,
    // },
    paymentIcon: {
        fontSize: 16,
        color: 'red',
        marginBottom: 13,
    },
    paymentText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black',
    },

    note: { fontSize: 12, color: '#555', marginVertical: 10 },
    timeColumn: {
        alignItems: 'center',
        marginHorizontal: 8,
    },

    label: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    section: {
        marginVertical: 16,
    },

    serviceItem: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
    },
    paymentBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        height: 150,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    bulletIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    serviceItem: {
        fontSize: 14,
        color: '#333',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '85%',
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    modalSubText: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginBottom: 15,
    },
    customerName: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    amountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 16,
    },
    input: {
        marginLeft: 6,
        flex: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: '#000',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#001f54',
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    

});

export default ServiceStatusScreen;
