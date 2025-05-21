// AdditionalDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import TextInputBox from '../../components/TextInputBox';
import GradientButton from '../../components/GradientButton';
import CityPickerBox from "../../components/CityPickerBox";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllServiceTypes } from '../../redux/AuthSlice';

const AdditionalDetailsScreen = ({ navigation, route }) => {
    const [expertise, setExpertise] = useState('');
    const [education, setEducation] = useState('');
    const [certification, setCertification] = useState('');
    const [experience, setExperience] = useState('');
    const [inhandexperience, setinhandExperience] = useState('');
    const [workTimings, setWorkTimings] = useState('');
    const [workLocation, setWorkLocation] = useState('');
    const dispatch = useDispatch();
    const { cities } = useSelector((state) => state.auth);
    const serviceTypes = useSelector((state) => state.auth.serviceTypes);
    const combinedServices = [
        ...(serviceTypes?.service || []),
        ...(serviceTypes?.emergency_service || [])
    ];


    useEffect(() => {
        dispatch(fetchAllServiceTypes());
    }, [dispatch]);
    useEffect(() => {
        console.log(serviceTypes, 'here val ')
    }, [dispatch]);

    const handleNext = () => {
        if (!expertise) return Alert.alert('Validation Error', 'Please enter Area of Expertise');
        if (!education.trim()) return Alert.alert('Validation Error', 'Please enter Education');
        if (!certification.trim()) return Alert.alert('Validation Error', 'Please enter Certificate/Training');
        if (!experience.trim()) return Alert.alert('Validation Error', 'Please enter Experience');
        if (!inhandexperience.trim()) return Alert.alert('Validation Error', 'Please enter Total In-Hand Experience');
        if (!workTimings.trim()) return Alert.alert('Validation Error', 'Please enter Work Timings');
        if (!workLocation.trim()) return Alert.alert('Validation Error', 'Please enter Work Location');

        const additionalDetails = {
            expertise,
            education,
            certification,
            experience,
            inhandexperience,
            workTimings,
            workLocation,
        };

        navigation.navigate('IDVerification', {
            ...route.params,
            additionalDetails,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Professional Details</Text>
            <CityPickerBox
                placeholder="Area of Expertise"
                label={"Area of Expertise"}
                selectedValue={expertise}
                onValueChange={setExpertise}
                items={combinedServices.map(item => ({
                    city_id: item?.service_type_id,
                    city_name: item?.service_type_name
                }))}
            />
            {/* <TextInputBox placeholder="Area of Expertise" value={expertise} onChangeText={setExpertise} /> */}
            <TextInputBox placeholder="Education" value={education} onChangeText={setEducation} />
            <TextInputBox placeholder="Certificate/Training" value={certification} onChangeText={setCertification} />
            <TextInputBox placeholder="Experience" value={experience} onChangeText={setExperience} />
            <TextInputBox placeholder="Total in Hand" value={inhandexperience} onChangeText={setinhandExperience} />
            <TextInputBox placeholder="Work Timings" value={workTimings} onChangeText={setWorkTimings} />
            <TextInputBox placeholder="Work Location" value={workLocation} onChangeText={setWorkLocation} />
            <GradientButton width={'100%'} title="Next" onPress={handleNext} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#062B67' },
});

export default AdditionalDetailsScreen;
