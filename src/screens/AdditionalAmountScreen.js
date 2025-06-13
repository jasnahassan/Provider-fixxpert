import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity ,Image} from 'react-native';
import TextInputBox from '../components/TextInputBox';
import { useDispatch } from 'react-redux';
import { createAdditionalAmount,updateAdditionalAmount ,fetchAds} from '../redux/AuthSlice';

const AdditionalAmountScreen = ({navigation,route}) => {
  const { bookingItem ,additionalAmountResponse} = route.params;
  const [amount, setAmount] = useState('');
  const [additionalAmount, setAdditionalAmount] = useState(additionalAmountResponse.amount);
  const [completionTime, setCompletionTime] = useState('');
  const [works, setWorks] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const { ads, loading, error } = useSelector(state => state.auth); 


  useEffect(() => {
    dispatch(fetchAds());
  }, []);


useEffect(()=>{
console.log(additionalAmountResponse,'heree resp')
const originalAmount = parseFloat(additionalAmountResponse.amount); // e.g. 35.4
const baseAmount = parseFloat((originalAmount / 1.18).toFixed(2));  // ≈ 30.0
const gstAmount = parseFloat((originalAmount - baseAmount).toFixed(2)); // ≈ 5.4

setAmount(baseAmount.toString())
setCompletionTime(additionalAmountResponse?.number_of_hours_to_completed.toString())
setWorks(additionalAmountResponse?.number_of_days_to_completed.toString())
setDescription(additionalAmountResponse?.description)
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
    if (!amount  || !completionTime  || !description) {
      alert('Please fill in all fields.');
      return;
    }
  
    const originalAmount = parseFloat(amount);
const gstAmount = parseFloat((originalAmount * 0.18).toFixed(2));
const totalAmountWithGst = parseFloat((originalAmount + gstAmount).toFixed(2));
    const payload = {
      // additional_amount_id: parseInt(additionalAmount),
      amount: parseFloat(totalAmountWithGst),
      booking_id: bookingItem?.booking_id,
      description: description,
      number_of_days_to_completed: 0,
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          <Text style={styles.title}>Update additional amount</Text>
        </TouchableOpacity>
       <View style={styles.idRow}>
        <Text style={styles.idLabel}>ID</Text>
        <Text style={styles.idValue}>#{bookingItem?.booking_id}</Text>
      </View>

      {/* <TextInputBox
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      /> */}
           <View style={{ marginBottom: 8 }}>
  <TextInputBox
    placeholder="Amount"
    value={amount}
    onChangeText={setAmount}
    keyboardType="numeric"
  />
  <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>+18% GST</Text>
</View>

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
      {/* <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <TextInputBox placeholder="Duration Days" value={works} onChangeText={setWorks} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <TextInputBox placeholder="Duration Hours" value={completionTime} onChangeText={setCompletionTime} keyboardType="numeric" />
        </View>
      </View> */}
      <TextInputBox placeholder="Duration Hours" value={completionTime} onChangeText={setCompletionTime} keyboardType="numeric" />

      {/* <TextInputBox
        placeholder="Works"
        value={works}
        onChangeText={setWorks}
        keyboardType="decimal-pad"
      /> */}

      <TextInputBox
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
      <Image source={{uri:ads[1]?.image}} resizeMethod='resize' resizeMode="stretch" style={styles.banner} />


      {/* <Image source={require('../assets/Image.png')} resizeMethod='resize' resizeMode="stretch" style={styles.banner} /> */}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // paddingTop: 40,
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
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  banner: { width: "100%", height: 100, borderRadius: 10, marginBottom: 20 ,marginTop:52},
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
});

export default AdditionalAmountScreen;
