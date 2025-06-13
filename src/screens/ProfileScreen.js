import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid,
  Keyboard,
  Modal,
  Linking,
  ActivityIndicator
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInputBox from '../components/TextInputBox';
import GradientButton from '../components/GradientButton';
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';

import { updateUserProfile, fetchUserProfile, fetchAllAddresses, deleteProfile, uploadProviderDocuments } from '../redux/AuthSlice';

const ProfileScreen = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userdetails, setUserdetails] = useState(false);
  const [fetchedAddresses, setFetchedAddresses] = useState([]);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loadingindicator, setLoadingindicator] = useState(false);

  const dispatch = useDispatch();

  const googleLogout = async () => {
    try {
      await GoogleSignin.revokeAccess(); // Optional, removes access token
      await GoogleSignin.signOut();
      console.log('User signed out from Google');
  
      // Optional: Clear any local user state
    } catch (error) {
      console.error('Error signing out from Google:', error);
    }
  };

  const handleSave = async () => {
    if (!userdetails?.service_provider_id) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      // Only upload if profilePic is a new local image URI
      let uploadedFilePath = profilePic;

      if (profilePic && profilePic.startsWith('file://')) {
        const imageFile = {
          uri: profilePic,
          type: 'image/jpeg',
          name: 'profile.jpg',
        };
       
        const result = await dispatch(
          uploadProviderDocuments({
            provider_id: 0,
            documents: [imageFile],
          })
        );

        if (!uploadProviderDocuments.fulfilled.match(result)) {
          throw new Error('Profile image upload failed');
        }

        uploadedFilePath = result.payload?.[0]?.path;

        if (!uploadedFilePath) {
          throw new Error('Failed to retrieve uploaded profile image path');
        }
      }
      setLoadingindicator(true)
      // Now update the profile
      await dispatch(updateUserProfile({
        user_id: userdetails?.service_provider_id,
        name: fullName,
        profile_image_file_id: uploadedFilePath,
      })).unwrap();

      Alert.alert('Success', 'Profile updated successfully');
      dispatch(fetchUserProfile(userdetails?.service_provider_id))
        .unwrap()
        .then((profileData) => {
          setLoadingindicator(false)
          console.log('User profile loaded:', profileData);
          // set state if needed
          setAddress(
            [profileData?.service_provider_address1]
              .filter(Boolean)
              .join(', ')
          )
        
          setFullName(profileData?.service_provider_name); // example usage
          setEmail(profileData?.service_provider_email);
          setContactNumber(profileData?.service_provider_mobile)
          setProfilePic(profileData?.service_provider_profile_image_file_id)
        
        })
        .catch((err) => {
          console.log('Failed to fetch profile:', err);
        })
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };


  // const handleSave = async () => {
  //   console.log(userdetails?.service_provider_id, fullName, profilePic, 'here send details')
  //   if (!userdetails?.service_provider_id) {
  //     Alert.alert('Error', 'User ID not found');
  //     return;
  //   }

  //   const selfieFile = {
  //     uri: idVerification?.selfie,
  //     type: 'image/jpeg',
  //     name: 'selfie.jpg',
  //   };

  //   const selfieResult = await dispatch(
  //     uploadProviderDocuments({
  //       provider_id: 0,
  //       documents: [selfieFile],
  //     })
  //   );


  // if (!uploadProviderDocuments.fulfilled.match(selfieResult)) {
  //   throw new Error('Selfie upload failed');
  // }

  // const selfieUploadData = selfieResult.payload;
  // const profileImagePath = selfieUploadData?.[0]?.path;

  // if (!profileImagePath) {
  //   throw new Error('Failed to get profile image path');
  // }

  //   dispatch(updateUserProfile({
  //     user_id: userdetails?.service_provider_id,
  //     name: fullName,
  //     profile_image_file_id: profileImagePath,
  //   }))
  //     .unwrap()
  //     .then((res) => {
  //       Alert.alert('Success', 'Profile updated successfully');
  //     })
  //     .catch((err) => {
  //       Alert.alert('Error', err);
  //     });
  // };
  // useEffect(() => {
  //   dispatch(fetchAllAddresses())
  //     .unwrap()
  //     .then(data => {
  //       console.log('Fetched addresses:', data[0]);
  //       setFetchedAddresses(data[0]);
  //       setAddress(data?.length > 0 ? data[0]?.address_line1 + "," + data[0]?.address_line2 : '') // This goes to your state
  //     })
  //     .catch(error => {
  //       console.error('Error fetching addresses:', error);
  //     });
  // }, [dispatch]);

  // Add Logout Button to Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logoutHandler} style={{ marginRight: 16 }}>
          <Text style={{ color: '#E65201', fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      if (jsonValue != null) {
        const user = JSON.parse(jsonValue);
        console.log('User Data:', user);
        return user;
      }
    } catch (e) {
      console.error('Error fetching userData from AsyncStorage:', e);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserData();
      console.log(user?.service_provider_id, 'userdata')
      setUserdetails(user)
      if (user) {
        setLoadingindicator(true)
        dispatch(fetchUserProfile(user?.service_provider_id))
          .unwrap()
          .then((profileData) => {
            setLoadingindicator(false)
            console.log('User profile loaded:', profileData);
            // set state if needed

            setFullName(profileData?.service_provider_name); // example usage
            setEmail(profileData?.service_provider_email);
            setContactNumber(profileData?.service_provider_mobile)
            setProfilePic(profileData?.service_provider_profile_image_file_id)
            setAddress(
              [profileData?.service_provider_address1]
                .filter(Boolean)
                .join(', ')
            )
          })
          .catch((err) => {
            console.log('Failed to fetch profile:', err);
          });



      }
    };

    fetchUser();
  }, []);
  async function requestStoragePermission() {
    if (Platform.OS === 'android' && Platform.Version < 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  const openPrivacyPolicy = () => {
    Linking.openURL('http://65.1.185.205:5000/documents/technicianPrivacyPolicy.pdf')
      .catch(err => console.error("Failed to open URL:", err));
  };

  const openTerms = () => {
    Linking.openURL('http://65.1.185.205:5000/documents/tecnicianTermsAndConditions.pdf')
      .catch(err => console.error("Failed to open URL:", err));
  };

  const downloadLocalPdf = async () => {
    const granted = await requestStoragePermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Cannot write to storage');
      return;
    }

    const fileName = 'terms_conditions.pdf';
    // const fileName = require('../assets/terms_conditions.pdf');
    const downloadsPath = Platform.select({
      android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      ios: `${RNFS.DocumentDirectoryPath}/${fileName}`, // iOS doesn't have a public Downloads folder
    });

    try {
      if (Platform.OS === 'android') {
        const data = await RNFS.readFileAssets(fileName, 'base64');
        await RNFS.writeFile(downloadsPath, data, 'base64');
      } else {
        const sourcePath = `${RNFS.MainBundlePath}/${fileName}`;
        await RNFS.copyFile(sourcePath, downloadsPath);
      }

      Alert.alert('Success', `PDF saved to: ${downloadsPath}`);
    } catch (err) {
      console.error('Download failed:', err);
      Alert.alert('Error', 'Failed to save PDF');
    }
  };

  const downloadLocalPdfprivacy = async () => {
    const granted = await requestStoragePermission();
    if (!granted) {
      Alert.alert('Permission denied', 'Cannot write to storage');
      return;
    }

    const fileName = 'PrivacyPolicy.pdf';
    // const fileName = require('../assets/terms_conditions.pdf');
    const downloadsPath = Platform.select({
      android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      ios: `${RNFS.DocumentDirectoryPath}/${fileName}`, // iOS doesn't have a public Downloads folder
    });

    try {
      if (Platform.OS === 'android') {
        const data = await RNFS.readFileAssets(fileName, 'base64');
        await RNFS.writeFile(downloadsPath, data, 'base64');
      } else {
        const sourcePath = `${RNFS.MainBundlePath}/${fileName}`;
        await RNFS.copyFile(sourcePath, downloadsPath);
      }

      Alert.alert('Success', `PDF saved to: ${downloadsPath}`);
    } catch (err) {
      console.error('Download failed:', err);
      Alert.alert('Error', 'Failed to save PDF');
    }
  };

  // const handleDownloadReceipt = async () => {
  //   const fileUrl = 'https://pdfobject.com/pdf/sample.pdf'; // Replace with real URL
  //   const fileName = 'Service_Receipt.pdf';
  //   const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  //   try {
  //     if (Platform.OS === 'android' && Platform.Version < 29) {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       ]);

  //       const readGranted = granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
  //       const writeGranted = granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;

  //       if (!readGranted || !writeGranted) {
  //         alert('Storage permission denied');
  //         return;
  //       }
  //     }

  //     // Download and open file
  //     const result = await RNFS.downloadFile({
  //       fromUrl: fileUrl,
  //       toFile: localPath,
  //     }).promise;

  //     if (result.statusCode === 200) {
  //       await FileViewer.open(localPath);
  //     } else {
  //       alert('Failed to download receipt.');
  //     }
  //   } catch (err) {
  //     console.error('Download error:', err);
  //     alert('An error occurred while downloading the receipt.');
  //   }
  // };

  const handleDeleteAccount = () => {
    // Your logic here
    console.log('Account deletion requested');

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your profile?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            dispatch(deleteProfile(userdetails?.service_provider_id)); // Dispatch deleteProfile action with userId
          }
        }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    // Navigate to Privacy Policy screen or open a webview
    console.log('Privacy Policy clicked');
    navigation.navigate('PrivacyPolicy');
  };

  const logoutHandler = () => {
    Alert.alert(
      'Are you sure?',
      'Do you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => logoutHandler2() }, // Replace with actual logout logic
      ],
      { cancelable: true }
    );
  };

  const logoutHandler2 = async () => {
    try {
      await AsyncStorage.clear();
      googleLogout()
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={{ marginRight: 16 }}>
          <Text style={{ color: '#093758', fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, []);
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const openPickerOptions = () => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: pickCamera },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const pickCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Camera permission not granted');
      return;
    }
    const options = { mediaType: 'photo', quality: 1 };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfilePic(response.assets[0].uri);
      }
    });
  };

  const pickImage = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfilePic(response.assets[0].uri);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          <Text style={styles.title}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={{ marginRight: 16, alignSelf: 'flex-end' }}>
          <Text style={{ color: '#093758', fontWeight: '800', fontSize: 20 }}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.profilePicContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Image
                  source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAx4m1Iu7nHxuybT7Xuw4YREAVcm98Oobpv4UT-GJNQ8M_i4l9NuqbpRpPLBdvNe-aTbc&usqp=CAU' }}
                  style={styles.profileImage}
                />
            </View>
          )}
          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={openPickerOptions}
          >
            <Image
              source={require('../assets/Camera.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>

        <TextInputBox placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <TextInputBox  placeholder="Email" editable={false} value={email} onChangeText={setEmail} />
        {contactNumber ? <TextInputBox placeholder="Contact Number" editable={false} value={contactNumber} onChangeText={setContactNumber} /> : ''}
       
          <TextInputBox placeholder="Address" value={address} editable={false} onChangeText={setAddress} /> 
     
        {/* <TextInputBox placeholder="Select Country" value={country} onChangeText={setCountry} /> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


          <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
            <Text style={styles.deleteText}>Delete Account ?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.changePasswordButton}
          >
            <Text style={styles.changePasswordText}>Change Password ?</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {!keyboardVisible && (
        <View style={styles.bottomContainer}>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.changePasswordButton}
          >
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 20 }} onPress={handlePrivacyPolicy}>
            <Text style={styles.privacyPolicy}>Privacy Policy and Terms & Conditions</Text>
          </TouchableOpacity> */}
          <View style={{ alignItems: 'center', marginBottom: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* <Text style={styles.normalText}>Read our </Text> */}

            <Text style={styles.privacyPolicy} onPress={openPrivacyPolicy}>
              Privacy Policy
            </Text>

            <Text style={styles.normalText}> and </Text>
            {/* <TouchableOpacity> */}
            <Text style={styles.privacyPolicy} onPress={openTerms}>
              Terms & Conditions
            </Text>
            {/* </TouchableOpacity> */}
          </View>
          <GradientButton
            title="Save"
            onPress={handleSave}
            margintop={20}
            width={'100%'}

          />
          {/* <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity> */}
        </View>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Confirm Logout</Text>
              <TouchableOpacity
                onPress={() => {
                  setLogoutModalVisible(false);
                  setDeleteModalVisible(false);
                }}
                style={styles.closeIcon}
              >
                <Text style={styles.closeIconText}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.okayButton}
                onPress={() => {
                  logoutHandler2() // call your logout function
                  setLogoutModalVisible(false);
                }}
              >
                <Text style={styles.okayButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Confirm Delete</Text>
            </View>
            <Text style={styles.modalMessage}>Are you sure you want to delete your account?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.okayButton}
                onPress={() => {
                  dispatch(deleteProfile(userdetails?.user_id)); // call your delete function
                  logoutHandler2()
                  setDeleteModalVisible(false);
                }}
              >
                <Text style={styles.okayButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {loadingindicator ? ( <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#093759" />
    </View>) :''} 

    </KeyboardAvoidingView>
  );
};

// styles (unchanged)...



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 120, // extra space for bottom container
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginVertical: 16,
    position: 'relative',
    backgroundColor: 'gray',
    borderRadius: 50,
    borderColor: 'red',
    borderWidth: 1
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 28,
    height: 28,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    tintColor: '#E65201',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    // backgroundColor:'green'
  },
  changePasswordButton: {
    alignSelf: 'flex-end',
    // marginBottom: 10,
    marginTop: 20,
    marginLeft: 40
  },
  changePasswordText: {
    color: '#093758',

    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20
  },
  saveButton: {
    backgroundColor: '#E65201',
    borderRadius: 10,
    paddingVertical: 14,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
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
  deleteButton: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  deleteText: {
    color: '#093758',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyPolicy: {
    marginTop: 10,
    alignItems: 'flex-start',
    color: 'gray',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalHeader: {
    width: '100%',
    backgroundColor: '#093758',
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  closeIconText: {
    color: 'white',
    fontSize: 24,
  },
  modalMessage: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#093758',
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#093758',
    fontSize: 16,
  },
  okayButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#093758',
    borderRadius: 6,
  },
  okayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalText: {
    color: 'black'
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999
  }
});

export default ProfileScreen;