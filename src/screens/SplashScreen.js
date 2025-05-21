import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { getAuthStatus, getFirstTimeStatus } from '../utils/AsyncStorageHelper';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const checkAuthStatus = async () => {
            const isAuthenticated = await getAuthStatus();
            const isFirstTime = await getFirstTimeStatus();
            if (!isFirstTime) {
                navigation.replace('OnboardingScreen');
            }
             else if (isAuthenticated) {
                navigation.replace('Main');
                
            }
             else {
                navigation.replace('Auth');
                // navigation.replace('HomeScreen');
            }
        };

        setTimeout(checkAuthStatus, 5000); // Small delay for splash effect
    }, []);

    return (
        <View style={styles.container}>
            {/* <Image 
                source={require('../../src/assets/splashscreen.png')} 
                style={styles.logo} 
                resizeMode="stretch" // Changed from 'contain' to 'cover'
            /> */}
                <Video
                source={require('../assets/QuickBusinessIntro.mp4')}
                style={styles.backgroundVideo}
                resizeMode="cover"
                repeat={true}
                paused={false}
                muted={false} // 🔊 enable audio
                ignoreSilentSwitch="ignore" // force sound even if phone is in silent mode (iOS)
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensure full screen coverage
        // backgroundColor: '#FFDAB9', // Pet-inspired color
    },
    logo: {
        width: width, 
        height: height,
    },
    backgroundVideo: {
        width: width,
        height: height,
        position: 'absolute',
    },

});

export default SplashScreen;