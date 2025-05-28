import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TextInputBox from '../components/TextInputBox';
import { useDispatch } from 'react-redux';
import { createAdditionalAmount,updateAdditionalAmount } from '../redux/AuthSlice';

const AdditionalAmountScreen = ({navigation,route}) => {
  const { bookingItem ,additionalAmountResponse} = route.params;
  const [amount, setAmount] = useState(additionalAmountResponse?.amount);
  const [additionalAmount, setAdditionalAmount] = useState(additionalAmountResponse.amount);
  const [completionTime, setCompletionTime] = useState(additionalAmountResponse.amount);
  const [works, setWorks] = useState(additionalAmountResponse.amount);
  const [description, setDescription] = useState(additionalAmountResponse?.description);
  const dispatch = useDispatch();

useEffect(()=>{
console.log(additionalAmountResponse,'heree resp')
},[])
  // const handleUpdate = () => {
  //   // Handle form submission logic here
  //   console.log({
  //     amount,
  //     additionalAmount,
  //     completionTime,
  //     works,
  //     description,
  //   });
  // };

  const handleUpdate = () => {
    if (!amount || !additionalAmount || !completionTime || !works || !description) {
      alert('Please fill in all fields.');
      return;
    }
  
    const payload = {
      // additional_amount_id: parseInt(additionalAmount),
      amount: parseFloat(amount),
      booking_id: bookingItem?.booking_id,
      description: description,
      number_of_days_to_completed: works,
      number_of_hours_to_completed: parseInt(completionTime),
    };
  
    dispatch(updateAdditionalAmount({ payload, additional_amount_id: additionalAmountResponse?.additional_amount_id }))

      .unwrap()
      .then(res => {
        alert('Additional amount created successfully!');
        console.log(res)
        navigation.navigate('ServiceStatusScreen', { bookingItem:bookingItem, additionalAmountResponse: res })

        // navigation.goBack();
      })
      .catch(err => {
        alert(`Error: ${err}`);
      });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.idRow}>
        <Text style={styles.idLabel}>ID</Text>
        <Text style={styles.idValue}>#{bookingItem?.booking_id}</Text>
      </View>

      <TextInputBox
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* <TextInputBox
        placeholder="Additional Amount"
        value={additionalAmount}
        onChangeText={setAdditionalAmount}
        keyboardType="numeric"
      /> */}

      {/* <TextInputBox
        placeholder="Completion time"
        value={completionTime}
        onChangeText={setCompletionTime}
        keyboardType="numeric"
      /> */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <TextInputBox placeholder="Duration Days" value={works} onChangeText={setWorks} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <TextInputBox placeholder="Duration Hours" value={completionTime} onChangeText={setCompletionTime} keyboardType="numeric" />
        </View>
      </View>

      <TextInputBox
        placeholder="Works"
        value={works}
        onChangeText={setWorks}
        keyboardType="decimal-pad"
      />

      <TextInputBox
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  idText: {
    fontSize: 16,
    color: '#D22B2B',
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  updateButton: {
    backgroundColor: '#093759',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  idLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#093759',
  },
  idValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D22B2B',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});

export default AdditionalAmountScreen;
