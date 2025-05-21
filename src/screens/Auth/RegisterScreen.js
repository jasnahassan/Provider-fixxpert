
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, sendOtp, verifyOtp, resendOtp } from '../../redux/AuthSlice';
import TextInputBox from '../../components/TextInputBox';
import GradientButton from '../../components/GradientButton';
import CountryPickerComponent from "../../components/CountryPickerComponent";

const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(null);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }

        const payload = {
            mobileNumber: countryCode + whatsappNumber,
            otp
        };

        console.log('Sending request with:', payload); // 🔍 Debug log

        try {
            const response = await dispatch(verifyOtp(payload)).unwrap();
            console.log(response, 'here rep');

            if (response.status) {
                setOtpVerified(true);
                Alert.alert('Success', 'OTP Verified Successfully');
            } else {
                setOtpVerified(false);
                Alert.alert('Error', response.message || 'Invalid OTP');
            }
        } catch (error) {
            setOtpVerified(false);
            console.log('hr', error);
        }
    };

    const handleReSendOTP = () => {
        if (!whatsappNumber.trim()) {
            Alert.alert('Error', 'Please add WhatsApp number to continue');
            return;
        }
        // dispatch(sendOtp(countryCode+whatsappNumber));
        dispatch(resendOtp({ mobileNumber: countryCode + whatsappNumber }))
        // setOtpSent(true);
        console.log(countryCode + whatsappNumber, 'OTP Sent');
    };


    const handleSendOTP = () => {
        if (!whatsappNumber.trim()) {
            Alert.alert('Error', 'Please add WhatsApp number to continue');
            return;
        }
        // dispatch(sendOtp(countryCode+whatsappNumber));
        dispatch(sendOtp({ mobileNumber: countryCode + whatsappNumber }))
        setOtpSent(true);
        console.log(countryCode + whatsappNumber, 'OTP Sent');
    };

    const handleRegister = () => {
        // navigation.navigate('PersonalDetails', registerData);
     
        if (!fullName.trim()) {
            Alert.alert('Error', 'Full Name is required');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (!whatsappNumber.trim()) {
            Alert.alert('Error', 'WhatsApp number is required');
            return;
        }
        if (password.length < 8 || password.length > 15) {
            Alert.alert('Error', 'Password must be between 8 to 15 characters');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (!isChecked) {
            Alert.alert('Error', 'You must agree to the terms and conditions');
            return;
        }
        // navigation.navigate('PersonalDetails');
        const registerData = {
            fullName,
            email,
            mobile: countryCode + whatsappNumber,
            password,
        };
    
        navigation.navigate('PersonalDetails', registerData);
        

        // dispatch(registerUser({ name: fullName, email, mobile: whatsappNumber, password }))
        //     .then((response) => {
        //         if (response.meta.requestStatus === 'fulfilled') {
        //             console.log(response, 'reg api')
        //             Alert.alert('Success', 'Registration Successful');
        //             navigation.navigate('Login');
        //         } else {
        //             Alert.alert('Error', response.payload || 'Registration Failed');
        //         }
        //     });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Image source={require('../../assets/logo.png')} resizeMode='contain' style={styles.image} />

                    <Text style={styles.title}>Sign Up</Text>
                    {/* <Text style={styles.subtitle}>Please fill the fields</Text> */}

                    <TextInputBox placeholder="Full Name" value={fullName} onChangeText={setFullName} />
                    <TextInputBox placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <TextInputBox
                                placeholder="WhatsApp Number"
                                value={whatsappNumber}
                                onChangeText={setWhatsappNumber}
                                height={40}
                                style={{ flex: 3 }}
                                keyboardType="phone-pad"
                    />




                    <TextInputBox
                        placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                        style={{ flex: 1 }}
                        icon={true}
                        iconSource={
                            isPasswordVisible
                                ? require('../../assets/eyeopen.png') // Replace with the correct eye open image
                                : require('../../assets/hidden.png')
                        }
                        onIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    />



                    <TextInputBox
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={{ flex: 1 }}
                        icon={true}
                        iconSource={
                            showConfirmPassword
                                ? require('../../assets/eyeopen.png') // Replace with the correct eye open image
                                : require('../../assets/hidden.png')
                        }
                        onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />



                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setIsChecked(!isChecked)}
                    >
                        <Image
                            source={isChecked
                                ? require('../../assets/checkboxtick.png')
                                : require('../../assets/unchecked.png')
                            }
                            style={styles.checkboxIcon}
                        />
                        <Text style={styles.checkboxText}>I agree to the terms & conditions</Text>
                    </TouchableOpacity>
                    <View style={styles.spaceBeforeButton} />
                    <GradientButton
                        title="Register"
                        onPress={handleRegister}
                        margintop={20}

                    />

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signupLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    {/* {whatsappNumber !== '' && !otpSent && (
                        <TouchableOpacity onPress={() => setWhatsappNumber('')} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Reset Mobile Number ?</Text>
                        </TouchableOpacity>
                    )}



                    <View style={styles.spaceBeforeButton} />
                    <GradientButton
                        title={otpSent ? "Verify OTP" : "Send OTP"}

                        onPress={otpSent ? handleVerifyOTP : handleSendOTP}
                        margintop={20}
                    />

                    {otpSent && (
                        <>
                            <TouchableOpacity onPress={handleReSendOTP} style={styles.resetButton}>
                                <Text style={styles.resetButtonText}>Resend OTP</Text>
                            </TouchableOpacity>





                            <View style={{ marginTop: 15 }} />
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setIsChecked(!isChecked)}
                            >
                                <Image
                                    source={isChecked
                                        ? require('../../assets/checkboxtick.png')
                                        : require('../../assets/unchecked.png')
                                    }
                                    style={styles.checkboxIcon}
                                />
                                <Text style={styles.checkboxText}>I agree to the terms & conditions</Text>
                            </TouchableOpacity>
                            <View style={styles.spaceBeforeButton} />

                            <GradientButton
                                title="Register"
                                onPress={handleRegister}
                                margintop={20}
                                color={['#FF5B00', '#993700']}
                            />
                        </>
                    )} */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: '7%',
        paddingBottom: 40,
    },
    image: {
        width: 95,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#062B67',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        marginBottom: 10,
    },
    whatsappContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '28%',
        marginRight: '2%',
    },
    whatsappContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
    },
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
    spaceBeforeButton: { height: 25 },
    resetButton: {
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    resetButtonText: {
        color: '#062B67',
        fontSize: 14,
    },
    phoneContainer: {
        marginVertical: 7,
        backgroundColor: '#F5F5F5',
        // backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        height :54,
        width:100
      },
    signupContainer: { flexDirection: 'row', marginTop: 20 },
    signupText: { fontSize: 16, color: '#777' },
    signupLink: { fontSize: 16, color: '#093759', fontWeight: 'bold' },
});

export default RegisterScreen;


