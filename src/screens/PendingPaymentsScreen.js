import React, { useRef, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Image } from 'react-native';

const pendingPayments = [
  { id: '1', service: 'Home Service Call', date: '25 May 2024', amount: '₹11,44' },
];

const PendingPaymentsScreen = ({navigation}) => {
  const [isPaymentModeModalVisible, setPaymentModeModalVisible] = useState(false);
  const [isHandoverModalVisible, setHandoverModalVisible] = useState(false);

  const handlePay = () => {
    setPaymentModeModalVisible(true)
    // alert('Redirecting to payment...');
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          <Text style={styles.title}>Pending Payments</Text>
        </TouchableOpacity>
      <FlatList
        data={pendingPayments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>

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

      {/* Modal 2: Choose Payment Type */}
      <Modal visible={isPaymentModeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Choose Payment Method</Text>

            <TouchableOpacity onPress={() => ''} style={styles.navButton}>
              <View style={styles.navLeft}>
                <Image
                  source={require('../assets/Documentpending.png')} // dummy image
                  style={styles.withdrawIcon}
                />
                <Text style={styles.navText}>Pay online</Text>
              </View>
              <Image
                source={require('../assets/Stroke.png')} // dummy image
                style={styles.withdrawIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setHandoverModalVisible(true), setPaymentModeModalVisible(false) }} style={styles.navButton}>
              <View style={styles.navLeft}>
                <Image
                  source={require('../assets/Documentpending.png')} // dummy image
                  style={styles.withdrawIcon}
                />
                <Text style={styles.navText}>Cash Handed Over to Office</Text>
              </View>
              <Image
                source={require('../assets/Stroke.png')} // dummy image
                style={styles.withdrawIcon}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => alert('Online flow not implemented')}>
            <Text style={styles.title}>Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPaymentModeModalVisible(false);
              setHandoverModalVisible(true);
            }}
          >
            <Text style={styles.title}>Hand Over</Text>
          </TouchableOpacity> */}
          </View>
        </View>
      </Modal>

      {/* Modal 3: Handover Details */}
      <Modal visible={isHandoverModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
           
            <View style={styles.row}>
            <Text style={styles.label}>Cash Amount:</Text>
            <Text style={styles.redText}>₹4,500</Text>
           
            </View>
            <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.redText}>22 July 2025</Text>
           
            </View>
           
            <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.greenText}>waiting approval</Text>
           
            </View>
            <View style={styles.separator} />
            <View style={styles.approvalBox}>
              <Text style={{ color: 'orange' }}>Approval Required</Text>
              <Text style={{color:'gray'}}>Your handover request will require admin approval...</Text>
            </View>

            <TextInput
              placeholder="Add note (Optional)"
              style={styles.noteInput}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.cancel} onPress={() => setHandoverModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.payNow}  onPress={() => {
                setHandoverModalVisible(false);
                alert("Handover submitted");
              }}>
                <Text style={styles.payNowText}t>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  service: { fontWeight: 'bold', fontSize: 16, color: 'black' },
  date: { color: '#777' },
  amount: { fontSize: 16, color: 'black' },
  status: { color: 'orange', fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  cancel: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelText: { textAlign: 'center', color: '#093759' },
  payNow: {
    padding: 10,
    backgroundColor: '#093759',
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  payNowText: { color: '#fff', textAlign: 'center' },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    elevation: 10,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: 'black'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#000',
  },
  greenText: {
    fontSize: 15,
    color: '#FFB91E', // green
  },
  redText: {
    fontSize: 15,
    color: 'black', // red
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  navButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'black'
  },
  approvalBox:{
    backgroundColor:'#FDEEEE',
    padding:16,
    margin:10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#000',
  },
 
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545', // red
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#002244',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});
