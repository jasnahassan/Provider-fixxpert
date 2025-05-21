import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity ,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  // Import SafeAreaView
import TextInputBox from '../components/TextInputBox';
import GradientButton from '../components/GradientButton';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../redux/AuthSlice'; // Import the forgotPassword action

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassword = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        try {
            // Dispatch the forgotPassword action
            const response = await dispatch(forgotPassword({ email })).unwrap();
            console.log(response,'hre')
            // if (response) {
                // Navigate to OTP verification screen if successful
                navigation.navigate('OtpVerification', { email });
            // }
        } catch (error) {
            Alert.alert('Error', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.backText}>Forgot Password</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>Enter your email for password reset</Text>

            <TextInputBox 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
            />

            <View style={styles.spaceBeforeButton} />
            <GradientButton
                title="Password Reset"
                onPress={handleForgotPassword}
                borderRadius={8}
                // width={'100%'}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 80, // Push content below back button
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginTop:80
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 80,
        alignSelf: 'flex-start',
    },
    spaceBeforeButton: {
        height: 25,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 20,
        width: 20,
        marginRight: 10,
    },
    backText: {
        fontSize: 16,
        color: '#083885',
        fontWeight: '600',
    },
});



export default ForgotPasswordScreen;
