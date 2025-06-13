import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import GradientButton from '../components/GradientButton';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPaymentHistory, updateBookingstatus, fetchAdditionalAmount, updateAdditionalAmount } from '../redux/AuthSlice';
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';


const ServiceStatusScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { bookingItem, additionalAmountResponse } = route.params;
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [cashAmount, setCashAmount] = useState('');
    const [userdetails, setUserdetails] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const timerRef = useRef(null);
    const [loadingindicator, setLoadingindicator] = useState(false);
    const additionalAmount = useSelector(state => state.auth.additionalAmount);

    const serviceList = additionalAmountResponse?.description
        ? additionalAmountResponse.description.split(/\n|,/).map(item => item.trim()).filter(Boolean)
        : [];

    const isPaid = additionalAmountResponse?.paid === 1;

    const totalAmount = additionalAmount?.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
    }, 0);

    const unpaidItems = additionalAmount?.filter(item => item.paid === 0) || [];
    const pendingAmount = unpaidItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const allPaid = unpaidItems.length === 0;

    const formatTime = (s) => {
        const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
        const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const secs = String(s % 60).padStart(2, '0');
        return { hrs, mins, secs };
    };

    useFocusEffect(
        React.useCallback(() => {
          if (!bookingItem?.booking_id) return;
      
          console.log('⏱ Fetching additional amount...');
      
          dispatch(fetchAdditionalAmount(bookingItem.booking_id));
      
          const intervalId = setInterval(() => {
            console.log('🔁 Polling additional amount...');
            dispatch(fetchAdditionalAmount(bookingItem.booking_id));
          }, 10000);
      
          return () => {
            console.log('🛑 Clearing interval');
            clearInterval(intervalId);
          };
        }, [bookingItem?.booking_id])
      );
      
    
    useEffect(() => {
        if (bookingItem?.booking_id) {
            dispatch(fetchAdditionalAmount(bookingItem?.booking_id));
        }
    }, [bookingItem, dispatch])

    const handleTimerToggle = () => {
        if (isRunning) {
            clearInterval(timerRef.current);
            dispatch(updateBookingstatus({ bookingId: bookingItem?.booking_id, booking_status: 15 }));
        } else {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
            dispatch(updateBookingstatus({ bookingId: bookingItem?.booking_id, booking_status: 14 }));
        }
        setIsRunning(!isRunning);
    };
    

    // const handleTimerToggle = () => {
    //     if (isRunning) {
    //         clearInterval(timerRef.current);
    //     } else {
    //         timerRef.current = setInterval(() => {
    //             setSeconds((prev) => prev + 1);
    //         }, 1000);
    //     }
    //     setIsRunning(!isRunning);
    // };

    const { hrs, mins, secs } = formatTime(seconds);

    const getUserData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userData');
            if (jsonValue != null) {
                const user = JSON.parse(jsonValue);
                console.log('User Data:', user);
                console.log('User addamount', additionalAmount);
                // console.log('User Data service:', serviceDetails);
                // setFinalAmount(serviceDetails?.basic_amount)
                return user;
            }
        } catch (e) {
            console.error('Error fetching userData from AsyncStorage:', e);
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserData();
            console.log(user, 'userdata')
            setUserdetails(user)

        };
        fetchUser();

    }, [dispatch])


    const ConfirmBookingPayment = async () => {
        try {
            //   const totalAmount = additionalAmount.reduce((sum, item) => {
            //     return sum + parseFloat(item.amount);
            //   }, 0);

            const amountInPaise = additionalAmountResponse?.amount * 100;
            // const amountInPaise = additionalAmount[0].amount * 100;

            const options = {
                description: 'Service Booking Payment',
                image: 'https://media-hosting.imagekit.io/48237198e4264b42/f4x.png?Expires=1841417217&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mtzLy7P-JFKwcbdxZLAseEUXV2vqtwcxVPIpPc5t~Saa9eedJ7zUy7JO7-YkaWlnrHuwYgCv6MGmNSL8ocvr~22BLlmLfnYY7pt44nw4dSOIgntAMtzBu~MN3gS-KDJCT0lnw6OSnIP9Zz8SDeBSuCxCHs9cwDalI6FtHP8ONwLx7RRkOjmZCB9v46~xlh2nuAQTjWbhWP0eB2YWw9PNUdcGcVH9jRAI~cDth1fKJdRoiMtC0nnW6ETYHdi24qse-F0WLbaINBhXhAYmAF2oHkYi45LgSx3hW5ay4rVuTPTjpdQL4Qgn2rsULcmzCEM5vJitUKVw91ZPB2cqHtvcAA__',
                currency: 'INR',
                key: 'rzp_test_KaTmpqw5X6NA0S',
                amount: amountInPaise.toString(),
                name: 'FixXpert',
                prefill: {
                    email: userdetails?.email,
                    contact: userdetails?.mobile,
                    name: userdetails?.name,
                },
                theme: { color: '#DB3043' }
            };

            RazorpayCheckout.open(options)
                .then(async (paymentData) => {
                    console.log('✅ Payment Success', paymentData);

                    const paidOn = new Date().toISOString().split('.')[0];
                    const paymentHistoryData = {
                        booking_id: bookingItem?.booking_id,
                        transaction_id: `TXN${Date.now()}`,
                        description: 'Payment for service booking',
                        payment_type: 1,
                        paid_on: paidOn,
                        amount: additionalAmountResponse?.amount?.toString(),
                        razorpay_id: paymentData?.razorpay_payment_id || '',
                        additional_amount_id: null,
                    };

                    const response = await dispatch(createPaymentHistory(paymentHistoryData)).unwrap();
                    console.log("✅ Payment History Created:", response);
                    //   dispatch(StatusUpdate({ bookingId: bookingId, bookingstatus: 12 }))
                    dispatch(updateBookingstatus({ bookingId: bookingItem?.booking_id, booking_status: 12 }))

                    const payload = {
                        amount: parseFloat(additionalAmountResponse.amount),
                        booking_id: bookingItem?.booking_id,
                        description: additionalAmountResponse?.description,
                        number_of_days_to_completed: additionalAmountResponse?.number_of_days_to_completed,
                        number_of_hours_to_completed: parseInt(additionalAmountResponse?.number_of_hours_to_completed),
                        paid: 1
                    };

                    dispatch(updateAdditionalAmount({ payload, additional_amount_id: additionalAmountResponse?.additional_amount_id }))
                        .unwrap()
                        .then(res => {
                            Alert.alert('Additional amount Payed successfully!');
                            console.log(res)
                            dispatch(fetchAdditionalAmount(bookingItem?.booking_id));

                            // navigation.goBack();
                        })
                        .catch(err => {
                            console.error('❌ Update Error:', err);
                            Alert.alert(`Error: ${err}`);
                        });

                    //   dispatch(fetchBookingHistoryById(bookingId));

                })
                .catch((error) => {
                    console.error("❌ Payment Failed:", error);
                    Alert.alert("Payment Failed", error);
                });

        } catch (err) {
            console.error("❌ Something went wrong:", err);
            Alert.alert('Error', 'Something went wrong during payment.');
        }
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.title}>Service status</Text>
            </TouchableOpacity>
            {/* <Text style={styles.header}>Service status</Text> */}
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
                    borderRadius={5}
                    color={['#03AE85','#03AE85']}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AdditionalAmountScreen', { bookingItem: bookingItem,additionalAmountResponse:additionalAmountResponse })}>
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
                    <Text style={styles.serviceItem}></Text>
                )}
            </View>


            {/* Payment Info */}
            <View style={styles.paymentBox}>
                <Image
                    source={
                        allPaid
                            ? require('../assets/greencheck.png')  // ✅ Use green tick
                            : require('../assets/delete.png') // ❌ Use red X
                    }
                    style={{ width: 30, height: 30, marginRight: 10, marginBottom: 10 }}
                />
                <Text style={styles.paymentText}>
                    {allPaid ? 'Payment Received' : 'Payment not Received'}
                </Text>
            </View>

            <Text style={styles.note}>⚠️ Customer needs to pay before service completion</Text>
            {/* <Text style={styles.note}> if offline paid</Text> */}
            {/* <TouchableOpacity onPress={() => setShowModal(true)} style={{ width: 90, height: 30, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Pay now</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setIsChecked(!isChecked)}
                    >
                        <Image
                            source={isChecked
                                ? require('../assets/checkboxtick.png')
                                : require('../assets/unchecked.png')
                            }
                            style={styles.checkboxIcon}
                        />
                        <Text style={styles.checkboxText}>Cash by hand recieved</Text>
                    </TouchableOpacity>
            {/* 
            <GradientButton
    title="Pay Now"
    onPress={() => setShowModal(true)}
    width={200}
    margintop={10}
/> */}
            {/* <GradientButton title="Complete" onPress={() => {
                console.log(allPaid,'here')
                { allPaid ? dispatch(updateBookingstatus({ bookingId: bookingItem?.booking_id, booking_status: 13 })) : Alert.alert('Please do pending payments to complete ') }
            }} /> */}
            <GradientButton
                title="Complete"
                onPress={() => {
                    console.log(allPaid, 'here');
                    if (allPaid || isChecked) {
                        dispatch(updateBookingstatus({ bookingId: bookingItem?.booking_id, booking_status: 13 }))
                            .unwrap()
                            .then(res => {
                                if(isChecked & allPaid ){
                                   
                                    Alert.alert('Bokking completed successfully!');
                                    navigation.navigate('Main')
                                }else if(allPaid & !isChecked){
                                    Alert.alert('Bokking completed successfully!');
                                    navigation.navigate('Main')
                                }
                                
                            else{
                                    setShowModal(true)
                                }
                              

                                // navigation.goBack();
                            })
                            .catch(err => {
                                console.error('❌ Update Error:', err);
                                Alert.alert(`Error: ${err}`);
                            });

                    } else {
                        Alert.alert('Please do pending payments to complete the service');
                    }
                }}
            />

            {showModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Payment verification</Text>
                        <View style={{backgroundColor:'#FDEEEE',padding:20,width:'100%',marginBottom:10}}>

                        <Text style={styles.modalSubText}>
                            ⚠️ Online payment is not detected{'\n'}If customer paid in cash, please pay the amount below
                        </Text>
                        </View>

                        {/* <Text style={styles.customerName}>Customer: {bookingItem?.user_name || 'N/A'}</Text> */}
                        {/* <Text style={styles.amountText}>₹ {additionalAmountResponse?.amount || '0'}</Text> */}
                        <Text style={styles.amountText}>₹ {additionalAmountResponse?.amount}</Text>
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
                            <TouchableOpacity onPress={() => {


                                setShowModal(false)
                                navigation.navigate('MyPayments')
                            }
                            } style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Pay later</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                ConfirmBookingPayment()
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
        color: '#000000',
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
        height: 120,
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
        marginBottom:20
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
    backIcon: {
        height: 20,
        width: 20,
        marginTop: 5,
        marginRight: 15,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 20,
        color: 'black'
    },
    backButton: { marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    checkboxIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    checkboxText: {
        fontSize: 14,
        color: '#333',
    },


});

export default ServiceStatusScreen;
