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
        // if (!certification.trim()) return Alert.alert('Validation Error', 'Please enter Certificate/Training');
        if (!experience.trim()) return Alert.alert('Validation Error', 'Please enter Experience');
        if (!inhandexperience.trim()) return Alert.alert('Validation Error', 'Please enter Total In-Hand Experience');
        if (!workTimings.trim()) return Alert.alert('Validation Error', 'Please enter Work Timings');
        // if (!workLocation.trim()) return Alert.alert('Validation Error', 'Please enter Work Location');

        const additionalDetails = {
            expertise,
            education,
            certification,
            experience,
            inhandexperience,
            workTimings,
            // workLocation,
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
                label={"Select one"}
                selectedValue={expertise}
                onValueChange={setExpertise}
                items={combinedServices.map(item => ({
                    city_id: item?.service_type_id,
                    city_name: item?.service_type_name
                }))}
            />
            {/* <TextInputBox placeholder="Area of Expertise" value={expertise} onChangeText={setExpertise} /> */}
            {/* <TextInputBox placeholder="Education" value={education} onChangeText={setEducation} /> */}
            <CityPickerBox
  placeholder="Education"
  label={""}
  selectedValue={education}
  onValueChange={setEducation}
  items={[
    { city_id: 'Bachelors Degree', city_name: 'Bachelors Degree' },
    { city_id: 'Masters', city_name: 'Masters' },
    { city_id: 'Diploma', city_name: 'Diploma' },
    { city_id: 'Other Professional Course', city_name: 'Other Professional Course' }
  ]}
/>
            <TextInputBox placeholder="Certificate/Training" value={certification} onChangeText={setCertification} />
            <TextInputBox   maxLength={2}  keyboardType="numeric"  placeholder="Experience(yrs)" value={experience} onChangeText={setExperience} />
            {/* <TextInputBox placeholder="Tool in Hand" value={inhandexperience} onChangeText={setinhandExperience} /> */}
            <CityPickerBox
                placeholder="Tool In Hand"
                label={""}
                selectedValue={inhandexperience}
                onValueChange={setinhandExperience}
                items={[
                    { city_id: 'Yes', city_name: 'Yes' },
                    { city_id: 'No', city_name: 'No' }
                ]}
            />
            <CityPickerBox
  placeholder="Work Timings"
  label={""}
  selectedValue={workTimings}
  onValueChange={setWorkTimings}
  items={[
    { city_id: 'full_time', city_name: 'Full Time' },
    { city_id: 'half_time', city_name: 'Half Time' }
  ]}
/>
            {/* <TextInputBox placeholder="Work Timings" value={workTimings} onChangeText={setWorkTimings} /> */}
            {/* <TextInputBox placeholder="Work Location" value={workLocation} onChangeText={setWorkLocation} /> */}
            <GradientButton width={'100%'} title="Next" onPress={handleNext} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#062B67' },
});

export default AdditionalDetailsScreen;
