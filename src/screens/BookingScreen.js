

import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet,
    ScrollView, Image, PermissionsAndroid,
    Platform,
} from 'react-native';
import CheckoutModal from '../components/CheckoutModal';
import GradientButton from '../components/GradientButton';
import AddAddressModal from '../components/AddAddressModal';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, createAddress, fetchAllAddresses, uploadBookingImages, fetchCities } from '../redux/AuthSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const BookingScreen = ({ route, navigation }) => {
    const { serviceId } = route.params;
    const dispatch = useDispatch();
    const addresses = useSelector(state => state.auth.addresses);
    const { cities, loadingCities } = useSelector((state) => state.auth);

    const [selectedTab, setSelectedTab] = useState('Residential');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [customDate, setCustomDate] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([null, null, null, null]);
    const [description, setDescription] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [fetchedAddresses, setFetchedAddresses] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selecteadressdId, setSelectedaddressId] = useState(null);

    const pickImage = async (index = null) => {
        // Ask for permission on Android
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs camera permission to take pictures',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                alert('Camera permission denied');
                return;
            }
        }

        // Ask user where they want to pick image from
        const options = ['Camera', 'Gallery', 'Cancel'];
        const response = await new Promise((resolve) => {
            const Alert = require('react-native').Alert;
            Alert.alert(
                'Select Image Source',
                'Choose an option',
                [
                    { text: options[0], onPress: () => resolve('camera') },
                    { text: options[1], onPress: () => resolve('gallery') },
                    { text: options[2], onPress: () => resolve(null), style: 'cancel' },
                ],
                { cancelable: true }
            );
        });

        if (!response) return;

        const pickerOptions = {
            mediaType: 'photo',
            quality: 1,
        };

        const callback = (res) => {
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.errorCode) {
                console.log('Image Picker Error: ', res.errorMessage);
            } else if (res.assets && res.assets.length > 0) {
                const selectedUri = res.assets[0].uri;
                console.log("Selected URI:", selectedUri);
                if (index === null) {
                    setMainImage(selectedUri);
                } else {
                    setSubImages((prev) => {
                        const updated = [...prev];
                        updated[index] = selectedUri;
                        return updated;
                    });
                }
            }
        };

        if (response === 'camera') {
            launchCamera(pickerOptions, callback);
        } else {
            launchImageLibrary(pickerOptions, callback);
        }
    };




    const removeImage = (index = null) => {
        if (index === null) {
            setMainImage(null);
        } else {
            setSubImages(prev => {
                const updated = [...prev];
                updated[index] = null;
                return updated;
            });
        }
    };
    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);


    useEffect(() => {
        dispatch(fetchAllAddresses())
            .unwrap()
            .then(data => {
                console.log('Fetched addresses:', data);
                setFetchedAddresses(data); // This goes to your state
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });
    }, [dispatch]);

    const handleDeleteAddress = (id) => {
        const updated = addresses.filter((addr) => addr.id !== id);
        // setAddresses(updated);
    };



    const handleCreateBooking = (addressId) => {
        console.log("Selected Address ID: ", addressId);
        setSelectedaddressId(addressId)

        const imagesToUpload = [mainImage, ...subImages.filter(Boolean)];

        navigation.navigate("BookingSummary", { addressId, selectedTab, selecteddate: selectedDate || customDate, selectedTime, description, serviceId, imagesToUpload });



        // ✨ Call your createBooking API here with addressId
        // eg: createBooking({ addressId, ...otherBookingData });
    };

    const getNextDates = () => {
        const today = new Date();
        return Array.from({ length: 4 }, (_, i) => {
            let date = new Date();
            date.setDate(today.getDate() + i);
            return {
                fullDate: date,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.getDate()
            };
        });
    };

    const timeSlots = ['06:30 PM', '07:30 PM', '08:30 PM'];

    const handleProceedToCheckout = () => {
        if (!selectedDate && !customDate) return alert('Please select a date');
        if (!selectedTime) return alert('Please select a time');

        if (!selecteadressdId) {
            setModalVisible(true);
        }



    };


    const handleAddAddress = async (addressInput) => {
        console.log(addressInput, 'gvg')
        const payload = {
            cityId: addressInput?.city, // Example city ID, replace it with dynamic value if needed
            title: addressInput?.title, // Address line 1
            detail: addressInput?.detail, // Address line 2
        };
        console.log(payload, 'heree')
        try {
            const result = await dispatch(createAddress(payload)).unwrap();
            setFetchedAddresses("")
            dispatch(fetchAllAddresses())
                .unwrap()
                .then(data => {
                    console.log('Fetched addresses:', data);
                    setFetchedAddresses(data); // This goes to your state
                })
                .catch(error => {
                    console.error('Error fetching addresses:', error);
                });

            // Add the created address to list (if API returns it)
            setFetchedAddresses(prev => [...prev, result]);
            console.log('Address added:', result);
        } catch (error) {
            console.error('Address creation failed:here', error);
        }
    };

    const handleConfirmBooking = () => {
        const bookingData = {
            serviceId,
            addressId: selectedAddressId,
            date: selectedDate || customDate,
            time: selectedTime,
            description,
            images: [mainImage, ...subImages.filter(Boolean)]
        };
        dispatch(createBooking(bookingData));
        setModalVisible(false);
    };

    const dates = getNextDates();



    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.title}>Book Service</Text>
            </TouchableOpacity>

            <View style={styles.tabContainer}>
                {['Residential', 'Commercial'].map(type => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.tab, selectedTab === type && styles.activeTab]}
                        onPress={() => setSelectedTab(type)}
                    >
                        <Text style={selectedTab === type ? styles.activeTabText : styles.tabText}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Select date and time</Text>
            <View style={styles.dateContainer}>
                {dates.map(({ day, date, fullDate }) => (
                    <TouchableOpacity
                        key={date}
                        style={[styles.dateButton, selectedDate?.toDateString() === fullDate.toDateString() && styles.selectedDate]}
                        onPress={() => setSelectedDate(fullDate)}
                    >
                        <Text style={styles.dateDay}>{day.substring(0, 3)}</Text> 
                        <Text style={selectedDate?.toDateString() === fullDate.toDateString() ? styles.selectedDateText : styles.dateText}>{date}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={[styles.dateButton, customDate && styles.selectedDate]}
                    onPress={() => setOpenDatePicker(true)}
                >
                    <Text style={styles.dateDay}>{customDate ? customDate.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3) : 'Custom'}</Text>
                    <Text style={customDate ? styles.selectedDateText : styles.dateText}>
                        {customDate ? customDate.getDate() : '📅'}
                    </Text>
                </TouchableOpacity>
            </View>

            <DatePicker
                modal
                open={openDatePicker}
                date={customDate || new Date()}
                mode="date"
                onConfirm={(date) => {
                    setOpenDatePicker(false);
                    setCustomDate(date);
                    setSelectedDate(date);
                }}
                onCancel={() => setOpenDatePicker(false)}
            />

            <View style={styles.timeContainer}>
                {timeSlots.map(time => (
                    <TouchableOpacity
                        key={time}
                        style={[styles.timeSlot, selectedTime === time && styles.selectedTime]}
                        onPress={() => setSelectedTime(time)}
                    >
                        <Text style={selectedTime === time ? styles.selectedTimeText : styles.timeText}>{time}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Service Description</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Provide more information about your service"
                placeholderTextColor={'#161616'}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <Text style={styles.label}>Upload Images</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage()}>
                {mainImage ? (
                    <View style={styles.imageWrapper2}>
                        {/* <Image source={{ uri: 'https://ritikamirchandani.com/uploads/383/20240508055131.jpg' }} style={styles.uploadImage} /> */}
                        <Image source={{ uri: mainImage }} style={{ width: '100%', height: '100%' }} />
                        <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage()}>
                            <Text style={styles.removeText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={{color:'#161616'}}t>Upload Main Image</Text>
                )}
            </TouchableOpacity>
            <View style={styles.subUploadContainer}>
                {subImages.map((img, index) => (
                    <TouchableOpacity key={index} style={styles.subUploadBox} onPress={() => pickImage(index)}>
                        {img ? (
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: img }} style={styles.uploadImage} />
                                <TouchableOpacity style={styles.removeIconSub} onPress={() => removeImage(index)}>
                                    <Text style={styles.removeText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.plusText}>+</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* <Text style={styles.label}>Upload Images</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage()}>
                {mainImage ? <Image source={{ uri: mainImage }} style={styles.uploadImage} /> : <Text>Upload Main Image</Text>}
            </TouchableOpacity>
            <View style={styles.subUploadContainer}>
                {subImages.map((img, index) => (
                    <TouchableOpacity key={index} style={styles.subUploadBox} onPress={() => pickImage(index)}>
                        {img ? <Image source={{ uri: img }} style={styles.uploadImage} /> : <Text>+</Text>}
                    </TouchableOpacity>
                ))}
            </View> */}

            <GradientButton
                title="Confirm"
                onPress={handleProceedToCheckout}
                borderRadius={8}
            />

            <CheckoutModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                addresses={fetchedAddresses}
                selectedAddressId={selectedId}
                setSelectedAddressId={setSelectedId}
                onAddAddress={handleAddAddress}
                // onAddAddress={(newAddr) => {
                //     console.log("New Address Added:", newAddr); // 👈 Logs to console
                //     setFetchedAddresses(prev => [...prev, newAddr]);
                // }}
                // onConfirm={() => setModalVisible(false)}
                handleDeleteAddress={handleDeleteAddress}
                onConfirm={(id) => {
                    setModalVisible(false);
                    handleCreateBooking(id);


                }}
            />


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    backButton: { marginBottom: 1, flexDirection: 'row', },
    backText: { fontSize: 18, color: '#333' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20,color:'black' },

    tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginTop: 20 },
    tab: { padding: 10, borderRadius: 10, backgroundColor: '#E0E0E0', marginHorizontal: 5, width: 140, justifyContent: 'center', alignItems: 'center', height: 44 },
    activeTab: { backgroundColor: '#DB3043' },
    tabText: { color: '#666', fontSize: 14 },
    activeTabText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5,color:'#161616' },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    dateButton: { padding: 13, borderRadius: 8, backgroundColor: '#E0E0E0', alignItems: 'center', marginTop: 10 },
    selectedDate: { backgroundColor: '#DB3043' },
    dateDay: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    dateText: { fontSize: 16, color: '#333' },
    selectedDateText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },

    timeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, marginTop: 10 },
    timeSlot: { padding: 10, borderRadius: 8, backgroundColor: '#E0E0E0' },
    selectedTime: { backgroundColor: '#DB3043' },
    timeText: { color: '#333' },
    selectedTimeText: { color: '#fff', fontWeight: 'bold' },

    textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
    uploadBox: { width: '100%', height: 200, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    subUploadContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    subUploadBox: { width: 80, height: 80, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
    uploadImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    backIcon: {
        height: 20,
        width: 20,
        marginTop: 5,
        marginRight: 15
    },
    uploadImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    removeIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        zIndex: 1,
    },
    removeIconSub: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        zIndex: 1,
    },
    removeText: { color: '#fff', fontSize: 12 },
    plusText: { fontSize: 24, color: '#666' },
    imageWrapper: {
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
    },
    imageWrapper2: {
        position: 'relative',
        width: '100%',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
    }
});

export default BookingScreen;

