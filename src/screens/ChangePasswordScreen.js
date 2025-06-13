import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import TextInputBox from "../components/TextInputBox";
import GradientButton from '../components/GradientButton';
import { changePassword } from '../redux/AuthSlice';
import { useDispatch } from 'react-redux';

const ChangePasswordScreen = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleConfirm = async () => {
        if (newPassword?.length < 8 ) {
            // setError(true);
            Alert.alert('Password must be between 8 to 15 characters ')
            return;
        }
        if ( newPassword !== confirmPassword) {
            // setError(true);
            Alert.alert('Passwords do not match ')
            return;
        }

        setError(false);

        dispatch(changePassword({
            old_password: oldPassword,
            new_password: newPassword,
        }))
            .unwrap()
            .then(() => {
                Alert.alert('Success', 'Password changed successfully!');
                navigation.navigate('Auth');
            })
            .catch((err) => {
                Alert.alert('Error', err);
            });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                <Text style={styles.title}>Change Password</Text>
            </TouchableOpacity>

            <Text style={styles.info}>Your new password must be different from previous used password</Text>
            <View style={{ height: 40 }} />

            <TextInputBox
                placeholder="Old Password"
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
                error={error && oldPassword.length < 8}
                icon={true}
                iconSource={showOldPassword ? require('../assets/eyeopen.png') : require('../assets/hidden.png')}
                onIconPress={() => setShowOldPassword(!showOldPassword)}
            />
  {/* <TouchableOpacity style={styles.deleteButton} onPress={() => navigation?.navigate('ForgotPassword')}>
            <Text style={styles.deleteText}>Try another way ?</Text>
      </TouchableOpacity> */}
            <TextInputBox
                placeholder="New Password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                error={error && newPassword.length < 8}
                icon={true}
                iconSource={showNewPassword ? require('../assets/eyeopen.png') : require('../assets/hidden.png')}
                onIconPress={() => setShowNewPassword(!showNewPassword)}
            />

            <TextInputBox
                placeholder="Re-enter New Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={error && newPassword !== confirmPassword}
                icon={true}
                iconSource={showConfirmPassword ? require('../assets/eyeopen.png') : require('../assets/hidden.png')}
                onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {error && (
                <Text style={styles.errorText}>
                    Passwords must match and be at least 8 characters long
                </Text>
            )}

            <View style={{ height: 40 }} />

            <GradientButton
                title="Confirm"
                onPress={handleConfirm}
                borderRadius={8}
                margintop={20}
                width={'100%'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFF",
    },
    info: {
        fontSize: 14,
        color: "#6C757D",
        textAlign: "center",
        marginBottom: 20,
        marginTop: 40,
    },
    errorText: {
        color: "#093758",
        fontSize: 12,
        textAlign: "center",
        marginTop: 10,
    },
    backButton: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
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
    deleteButton: {
        marginBottom: 20,
        alignItems: 'flex-start',
      },
      deleteText: {
        color: '#D83042',
        fontSize: 16,
        fontWeight: 'bold',
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

export default ChangePasswordScreen;