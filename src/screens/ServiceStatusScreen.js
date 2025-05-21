import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GradientButton from '../components/GradientButton';

const ServiceStatusScreen = ({navigation}) => {
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

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
            <Text style={styles.serviceName}>Plumbing</Text>

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
<TouchableOpacity onPress={()=>navigation.navigate('AdditionalAmountScreen')}>
    <Text style={{color:'black',fontSize:17}}>
        Additional Amount
    </Text>
</TouchableOpacity>
            {/* Services List */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Services list</Text>
                <Text style={styles.serviceItem}>- Regular Inspections</Text>
                <Text style={styles.serviceItem}>- Drain Maintenance</Text>
                <Text style={styles.serviceItem}>- Pipe Insulation</Text>
            </View>

            {/* Payment Info */}
            <View style={styles.paymentBox}>
                <Text style={styles.paymentIcon}>❌</Text>
                <Text style={styles.paymentText}>Payment not Received</Text>
            </View>

            <Text style={styles.note}>⚠️ Customer needs to pay before service completion</Text>

            <GradientButton title="Complete" onPress={() => { }} />
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

    paymentBox: {
        backgroundColor: '#F0F0F0',
        padding: 12,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
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
});

export default ServiceStatusScreen;
