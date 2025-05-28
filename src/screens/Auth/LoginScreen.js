


import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  CheckBox
} from 'react-native';
import { useDispatch } from 'react-redux';
import { saveAuthStatus, saveFirstTimeStatus } from '../../utils/AsyncStorageHelper';
import TextInputBox from '../../components/TextInputBox';
import GradientButton from '../../components/GradientButton';
import { loginUser } from '../../redux/AuthSlice';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '../../redux/AuthSlice';


const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
// const handleLogin = async () => {
//     let valid = true;
    
//     if (!validateEmail(username)) {
//       setEmailError(true);
//       valid = false;
//     }

//     if (password.length < 8 || password.length > 15) {
//       setPasswordError(true);
//       valid = false;
//     }

//     if (!valid) return;

//     try {
//       const response = await dispatch(loginUser({ username, password })).unwrap();
//       if (response.status) {
//         await saveAuthStatus(true);
//         await saveFirstTimeStatus(true);
//         navigation.replace('HomeScreen');
//       } else {
//         Alert.alert("Login Failed", response.message || "Invalid credentials");
//       }
//     } catch (error) {
//       Alert.alert("Login Failed", error);
//     }
//   };

useEffect(() => {
  GoogleSignin.configure({
    webClientId: '466988466843-pq38idt9trhv1r2gp41nrvtl00o7o2hc.apps.googleusercontent.com', // Get this from Google Cloud Console
    offlineAccess: true, // Enables refresh tokens
  });
}, []);

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('Google User Info:', userInfo);
    // if (userInfo == null) {
    //   return;
    // }

    // You can now send this token to your backend for authentication
    const idToken = userInfo?.data?.idToken;

    const response = await dispatch(loginWithGoogle({
      token: idToken,
      google_client_id: '466988466843-pq38idt9trhv1r2gp41nrvtl00o7o2hc.apps.googleusercontent.com'
    })).unwrap();

    console.log('response12353', response);
    
    // Alert.alert(response)

    if (response.token) {
      await saveAuthStatus(true);
      await saveFirstTimeStatus(true);
      navigation.replace('Main');
    } else {
      Alert.alert("Login Failed", response.error || "Google login failed");
      navigation.navigate('Register')
    }

  } catch (error) {
    console.error('Google Sign-In Error:', error);
  }
};


  const handleLogin = async () => {
    if (!validateEmail(username)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (password.length < 8 || password.length > 15) {
      Alert.alert("Invalid Password", "Password must be between 8 to 15 characters.");
      return;
    }

    try {
      const response = await dispatch(loginUser({email:username, password })).unwrap();
      if (response.token) {
        await saveAuthStatus(true);
        await saveFirstTimeStatus(true);
        navigation.replace('Main');
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Login Failed", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* <Image source={require('../../assets/profile_placeholder.png')} style={styles.profileImage} /> */}
        <Image source={require('../../assets/logo.png')} resizeMode='contain' style={styles.image} />
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.welcomeText}>Welcome back, please sign in to continue</Text>

        <TextInputBox placeholder="Email" value={username} onChangeText={setUsername} keyboardType="email-address" autoCapitalize="none" outlined />
        <TextInputBox
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          icon
          iconSource={isPasswordVisible ? require('../../assets/eyeopen.png') : require('../../assets/hidden.png')}
          onIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
          outlined
        />
  <TouchableOpacity style={{marginBottom:20,alignSelf:'flex-start'}} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
        <View style={styles.rememberMeContainer}>
          {/* <CheckBox value={rememberMe} onValueChange={setRememberMe} /> */}
          {/* <Text style={styles.rememberMeText}>Remember Me</Text> */}
        </View>
      

        <GradientButton title="Login"
          // width={'100%'}
          onPress={handleLogin}
          style={styles.loginButton} />


        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.googleButton} onPress={() => signInWithGoogle()}> 
          <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      
       
        
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: '7%' },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  welcomeText: { fontSize: 16, color: '#777', marginBottom: 20 },
  rememberMeContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginVertical: 10 },
  rememberMeText: { marginLeft: 8, fontSize: 16, color: '#333' },
  loginButton: { backgroundColor: 'red', fontWeight: 'bold' },
  forgotPassword: { color: '#093759', marginTop: 10, alignSelf: 'flex-start' },
  googleButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', marginTop: 20 },
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  googleText: { fontSize: 16, color: '#333' },
  signupContainer: { flexDirection: 'row', marginTop: 20 },
  signupText: { fontSize: 16, color: '#777' },
  signupLink: { fontSize: 16, color: '#093759', fontWeight: 'bold' },
  image: {
    width: 75,
    height: 70,
    marginBottom: 20,

},
});

export default LoginScreen;
