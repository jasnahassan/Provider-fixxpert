import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import GradientButton from '../components/GradientButton';
import TextInputBox from '../components/TextInputBox';
import { useDispatch } from 'react-redux';
import { resetPassword, forgotPassword } from '../redux/AuthSlice';  // Import the resetPassword action

const OtpVerificationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { email } = route.params; // Get email from navigation params

  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleResendOtp = () => {
    if (!resendEnabled) return;

    dispatch(forgotPassword({ email }));  // Make sure you pass email here
    setTimer(30); // Restart timer
    setResendEnabled(false);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && index > 0 && otp[index] === '') {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const response = await dispatch(resetPassword({ email, reset_code: otpCode, new_password: password })).unwrap();

      Alert.alert('Success', 'Password reset successfully.');
      navigation.navigate('Login'); // Navigate to login after successful reset
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the verification code sent to {email}</Text>
      <View style={styles.spaceBeforeButton} />

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpRefs.current[index] = ref)}
            style={[styles.otpInput, digit ? styles.activeInput : null]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleResendOtp} disabled={!resendEnabled}>
        <Text style={[styles.resendOtp, { color: resendEnabled ? '#0C56CD' : '#999' }]}>
          {resendEnabled ? 'Resend OTP' : `Resend in ${timer}s`}
        </Text>
      </TouchableOpacity>

      <View style={styles.spaceBeforeButton} />

      <TextInputBox
        placeholder="New Password"
        secureTextEntry={!isPasswordVisible}
        value={password}
        onChangeText={setPassword}
        icon={true}
        iconSource={isPasswordVisible ? require('../assets/eyeopen.png') : require('../assets/hidden.png')}
        onIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
      />

      <TextInputBox
        placeholder="Re-enter Password"
        secureTextEntry={!isPasswordVisible}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon={true}
        iconSource={isPasswordVisible ? require('../assets/eyeopen.png') : require('../assets/hidden.png')}
        onIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
      />
      <View style={{ height: 50 }} />
      <GradientButton title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeInput: {
    borderColor: '#DB3043',
    borderWidth: 2,
  },
  resendOtp: {
    color: '#0C56CD',
    marginBottom: 20,
  },
  spaceBeforeButton: { height: 25 },
});

export default OtpVerificationScreen;
