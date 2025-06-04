import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const pendingPayments = [
  { id: '1', service: 'Home Service Call', date: '25 May 2024', amount: '₹11,44' },
];

const PendingPaymentsScreen = () => {
  const handlePay = () => {
    alert('Redirecting to payment...');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingPayments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>

            <View>

            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.date}>{item.date}</Text>
            </View>
            <View>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.status}>Pending</Text>
            </View>
         </View>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.payNow} onPress={handlePay}>
                <Text style={styles.payNowText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PendingPaymentsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 8,
  },
  service: { fontWeight: 'bold', fontSize: 16 ,color:'black'},
  date: { color: '#777' },
  amount: { fontSize: 16 ,color:'black'},
  status: { color: 'orange', fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  cancel: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelText: { textAlign: 'center' ,color:'#093759'},
  payNow: {
    padding: 10,
    backgroundColor: '#093759',
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  payNowText: { color: '#fff', textAlign: 'center' },
});
