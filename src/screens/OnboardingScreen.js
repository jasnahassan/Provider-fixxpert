import React, { useRef, useState, useEffect } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
    Dimensions, SafeAreaView, ImageBackground, Alert, Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientButton from '../components/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import VersionCheck from 'react-native-version-check';
import { saveFirstTimeStatus } from '../utils/AsyncStorageHelper';

const { width, height } = Dimensions.get('window');

const slides = [
    { id: 1, image: require('../../src/assets/onboarding1.png'), title: 'Welcome To Fixxpert', text: '' },
    { id: 2, image: require('../../src/assets/onboarding2.png'), title: 'Browse Our Services', text: 'Discover Your Ideal Service.' },
    { id: 3, image: require('../../src/assets/onboarding3.png'), title: 'Flexible Booking', text: 'Schedule Services on Your Terms' }
];

const OnboardingScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        // checkForUpdate();
    }, []);

    const checkForUpdate = async () => {
        try {
            const latestVersion = await VersionCheck.getLatestVersion();
            const currentVersion = VersionCheck.getCurrentVersion();
            if (latestVersion !== currentVersion) {
                Alert.alert(
                    'Update Available',
                    'A new version of the app is available. Please update to continue.',
                    [
                        { text: 'Update', onPress: () => Linking.openURL(VersionCheck.getPlayStoreUrl()) }
                    ],
                    { cancelable: false }
                );
            }
        } catch (error) {
            console.error('Error checking app version:', error);
        }
    };

    const handleScroll = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
    };

    const handleNext = async () => {
        if (currentIndex < slides.length - 1) {
            scrollViewRef.current.scrollTo({ x: width * (currentIndex + 1), animated: true });
        } else {
            await saveFirstTimeStatus(true);
            navigation.navigate('Auth');
        }
    };

    const handleSkip = async () => {
        await saveFirstTimeStatus(true);
        navigation.navigate('Auth');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={require('../../src/assets/onboarding4.png')} style={styles.backgroundImage}>

                {/* Skip Button */}
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    snapToInterval={width}
                    decelerationRate="fast"
                    bounces={false}
                >
                    {slides.map((slide) => (
                        <View key={slide.id} style={[styles.slide, { width }]}>
                            <Image source={slide.image} style={styles.image} />
                            <LinearGradient
                                colors={['#F5F5F5', '#E0E0E0']}
                                style={styles.gradientOverlay}
                            >

                                <Text style={styles.title}>{slide.title}</Text>
                                <Text style={styles.text}>{slide.text}</Text>

                                <GradientButton
                                    // title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                                    title={
                                        // currentIndex === slides.length - 1 ? (
                                        //     'Get Started'
                                        // ) : (
                                            <Image  source={require('../assets/whitearrow.png')}  resizeMode="contain"
                                            style={{ width: 30, height: 25,}}  />
                                        // )
                                    }
                                    onPress={handleNext}
                                    borderRadius={30}
                                    width={'100%'}
                                    color={['#D32F2F', '#6D1818']}
                                />

                                <View style={styles.indicatorContainer}>
                                    {slides.map((_, index) => (
                                        <View key={index} style={[styles.indicator, currentIndex === index && styles.activeIndicator]} />
                                    ))}
                                </View>
                            </LinearGradient>
                        </View>
                    ))}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    skipButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20
    },
    skipText: {
        color: '#07347C',
        fontSize: 14,
        fontWeight: '600'
    },
    slide: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        // paddingHorizontal: 20,
        position: 'relative',
        flex: 1
    },
    image: {
        width: width - 50,
        height: height * 0.50,
        resizeMode: 'contain',
        marginBottom: 0,
    },
    gradientOverlay: {
        width: '100%',
        height: height * 0.45,
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0
    },
    title: {
        fontSize: 22,
        fontWeight: '400',
        textAlign: 'center',
        color: '#1C1F34',
        marginBottom: 8,
        // fontStyle: 'italic'
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: '#D32F2F',
        marginBottom: 20
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#062B67',
        marginHorizontal: 5
    },
    activeIndicator: {
        backgroundColor: '#D32F2F'
    }
});

export default OnboardingScreen;
