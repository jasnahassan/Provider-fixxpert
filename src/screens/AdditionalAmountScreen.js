import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import TextInputBox from '../components/TextInputBox';

const AdditionalAmountScreen = () => {
  const [amount, setAmount] = useState('');
  const [additionalAmount, setAdditionalAmount] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [works, setWorks] = useState('');
  const [description, setDescription] = useState('');

  const handleUpdate = () => {
    // Handle form submission logic here
    console.log({
      amount,
      additionalAmount,
      completionTime,
      works,
      description,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.idRow}>
        <Text style={styles.idLabel}>ID</Text>
        <Text style={styles.idValue}>4545515</Text>
      </View>

      <TextInputBox
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInputBox
        placeholder="Additional Amount"
        value={additionalAmount}
        onChangeText={setAdditionalAmount}
        keyboardType="numeric"
      />

      <TextInputBox
        placeholder="Completion time"
        value={completionTime}
        onChangeText={setCompletionTime}
        keyboardType="numeric"
      />

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
});

export default AdditionalAmountScreen;
