import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import TextInputBox from '../../components/TextInputBox';
import GradientButton from '../../components/GradientButton';
import { useDispatch, useSelector } from 'react-redux';
import {  registerUser,uploadProviderDocuments , createBankDetails} from '../../redux/AuthSlice';

const BankDetailsScreen = ({ navigation, route }) => {
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      // Validation
      if (!bankName || !accountHolderName || !accountNumber || !confirmAccountNumber || !ifsc) {
        return Alert.alert('Missing Fields', 'Please fill all bank details');
      }
      if (accountNumber !== confirmAccountNumber) {
        return Alert.alert('Mismatch', 'Account numbers do not match');
      }

      const bankData = { bankName, accountHolderName, accountNumber, ifsc };
      const allUserData = { ...route.params, bankDetails: bankData };
      const { idVerification } = allUserData;

      // 1. Upload selfie (provider_id: 0)
      const selfieFile = {
        uri: idVerification?.selfie,
        type: 'image/jpeg',
        name: 'selfie.jpg',
      };

      const selfieResult = await dispatch(
        uploadProviderDocuments({
          provider_id: 0,
          documents: [selfieFile],
        })
      );

     
    if (!uploadProviderDocuments.fulfilled.match(selfieResult)) {
      throw new Error('Selfie upload failed');
    }

    const selfieUploadData = selfieResult.payload;
    const profileImagePath = selfieUploadData?.[0]?.path;

    if (!profileImagePath) {
      throw new Error('Failed to get profile image path');
    }

      // 2. Register user
      const registrationPayload = {
        name: allUserData?.fullName,
        email: allUserData?.email,
        mobile: allUserData?.mobile,
        password: allUserData?.password,
        address1: allUserData?.personalDetails?.address,
        address2: allUserData?.personalDetails?.address,
        city: allUserData?.personalDetails?.city,
        profile_image_file_id: profileImagePath,
        active: true,
        dob: allUserData?.personalDetails?.dob,
        gender: allUserData?.personalDetails?.gender,
        nationality: allUserData?.personalDetails?.nationality,
        parent_or_spouse_name: allUserData?.personalDetails?.parentName,
        state: allUserData?.personalDetails?.state,
        pin: allUserData?.personalDetails?.pincode,
        service_type_id: allUserData?.additionalDetails?.expertise,
        education: allUserData?.additionalDetails?.education,
        experience: allUserData?.additionalDetails?.experience,
        tools_in_hand: true,
        work_time: allUserData?.additionalDetails?.workTimings,
      };

      const regResult = await dispatch(registerUser(registrationPayload)).unwrap();
      console.log(regResult,'resul ref')
      const providerId = regResult?.service_provider_id || regResult?.service_provider_id;

      if (!providerId) {
        throw new Error('Provider ID not returned from registration');
      }

      // 3. Upload identity and address proofs
      const docFiles = [];

      if (idVerification?.identityFile) {
        docFiles.push({
          uri: idVerification.identityFile,
          type: 'image/jpeg',
          name: 'identity_proof.jpg',
        });
      }

      if (idVerification?.addressFile) {
        docFiles.push({
          uri: idVerification.addressFile,
          type: 'image/jpeg',
          name: 'address_proof.jpg',
        });
      }

      if (docFiles.length > 0) {
        const docResult = await dispatch(
          uploadProviderDocuments({
            provider_id: providerId,
            documents: docFiles,
          })
        );

        if (!uploadProviderDocuments.fulfilled.match(docResult)) {
          throw new Error('Documents upload failed');
        }
      }
      const bankResult = await dispatch(createBankDetails({
        bank_name: bankName,
        account_holder_name: accountHolderName,
        account_number: accountNumber,
        ifsc_code: ifsc,
        provider_id: providerId,

      }));
      
      console.log(bankResult,'heree')
      // if (!createBankDetails.fulfilled.match(bankResult)) {
      //   throw new Error('Bank details creation failed');
      // }
      
      Alert.alert('Success', 'Registration completed successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Registration Error', error);
      
    }
  };

  // const handleSubmit = () => {
  //   // Field-specific validation
  //   if (!bankName) {
  //     Alert.alert('Missing Field', 'Please enter the Bank Name.');
  //     return;
  //   }
  //   if (!accountHolderName) {
  //     Alert.alert('Missing Field', 'Please enter the Account Holder Name.');
  //     return;
  //   }
  //   if (!accountNumber) {
  //     Alert.alert('Missing Field', 'Please enter the Account Number.');
  //     return;
  //   }
  //   if (!confirmAccountNumber) {
  //     Alert.alert('Missing Field', 'Please confirm the Account Number.');
  //     return;
  //   }
  //   if (accountNumber !== confirmAccountNumber) {
  //     Alert.alert('Mismatch', 'Account Number and Confirm Account Number do not match.');
  //     return;
  //   }
  //   if (!ifsc) {
  //     Alert.alert('Missing Field', 'Please enter the IFSC Code.');
  //     return;
  //   }

  //   const bankData = {
  //     bankName,
  //     accountHolderName,
  //     accountNumber,
  //     ifsc,
  //   };

  //   const allUserData = {
  //     ...route.params,
  //     bankDetails: bankData,
  //   };

  //   console.log('All Collected Data:', allUserData);
  //   dispatch(registerUser({
  //       name: allUserData?.fullName,
  //       email: allUserData?.email,
  //       mobile: allUserData?.mobile,
  //       password:allUserData ?.password,
  //       address1: allUserData?.personalDetails?.address,
  //       address2: allUserData?.personalDetails?.address,
  //       city: allUserData?.personalDetails?.city,
  //       profile_image_file_id: 1,
  //       active: true,
  //       dob: allUserData?.personalDetails?.dob,
  //       gender: allUserData?.personalDetails?.gender,
  //       nationality: allUserData?.personalDetails?.nationality,
  //       parent_or_spouse_name: allUserData?.personalDetails?.parentName,
  //       state:allUserData?.personalDetails?.state,
  //       pin: allUserData?.personalDetails?.pincode,
  //       service_type_id: allUserData?.additionalDetails?.expertise,
  //       education:allUserData?.additionalDetails?.education,
  //       experience: allUserData?.additionalDetails?.experience,
  //       tools_in_hand: true,
  //       work_time: allUserData?.additionalDetails?.workTimings,
  //     }))
  //     .unwrap()
  // .then((res) => {
  //   Alert.alert('Success', 'Registration completed successfully');
  //   navigation.navigate('Login'); // or any screen you want
  // })
  // .catch((err) => {
  //   Alert.alert('Registration Error', err); // This shows the exact backend error
  // });
  //   // Alert.alert('Success', 'All user data collected. You can now call the API.');

  //   // Call your API here if needed
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bank Details</Text>
      <TextInputBox placeholder="Bank Name" value={bankName} onChangeText={setBankName} />
      <TextInputBox placeholder="Account Holder Name" value={accountHolderName} onChangeText={setAccountHolderName} />
      <TextInputBox placeholder="Account Number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="numeric" />
      <TextInputBox placeholder="Confirm Account Number" value={confirmAccountNumber} onChangeText={setConfirmAccountNumber} keyboardType="numeric" />
      <TextInputBox placeholder="IFSC Code" value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" />
      <GradientButton width={'100%'} title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#062B67' },
});

export default BankDetailsScreen;
