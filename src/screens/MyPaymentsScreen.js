import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
  Switch, 
  ImageBackground,
  Platform,
  Modal
} from "react-native";
// import { ScrollView } from 'react-native-gesture-handler';
// import { Ionicons } from '@expo/vector-icons';

const MyPaymentsScreen = ({navigation}) => {

  const [isWithdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
const [isPaymentModeModalVisible, setPaymentModeModalVisible] = useState(false);
const [isHandoverModalVisible, setHandoverModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
          <Text style={styles.title}>My Payments</Text>
        </TouchableOpacity>

      {/* Earnings and Remittance */}
      <View style={styles.earningsContainer}>
        <View style={styles.earningsBox}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.greenValue}>₹22,245</Text>
        </View>
        <View style={styles.earningsBox}>
          <Text style={styles.earningsLabel}>Incentives</Text>
          <Text style={styles.orangeValue}>₹55,245</Text>
        </View>
        <View style={styles.earningsBox}>
          <Text style={styles.earningsLabel}>Salary</Text>
          <Text style={styles.redValue}>₹22,245</Text>
        </View>
        <View style={styles.earningsBox}>
          <Text style={styles.earningsLabel}>Remittance</Text>
          <Text style={styles.blueValue}>₹55,245</Text>
        </View>
      </View>

      <View style={styles.cashSummaryCard}>
  <Text style={styles.cardTitle}>Cash Summary</Text>

  <View style={styles.summaryGrid}>
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>Total Cash Received</Text>
      <Text style={styles.summaryAmount}>₹4,500</Text>
    </View>
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>Paid Online</Text>
      <Text style={styles.summaryAmount}>₹1,000</Text>
    </View>
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>Handed Over</Text>
      <Text style={styles.summaryAmount}>₹4,500</Text>
    </View>
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>Current Cash on Hand</Text>
      <Text style={styles.summaryAmount}>₹1,500</Text>
    </View>
  </View>

  <TouchableOpacity onPress={()=> setWithdrawalModalVisible(true)} style={styles.withdrawButton}>
    <Text style={styles.withdrawText}>Withdrawal</Text>
    {/* <Image
      source={require('../assets/Chat.png')} // dummy image
      style={styles.withdrawIcon}
    /> */}
  </TouchableOpacity>
</View>


      {/* Transaction Buttons */}
      <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}  style={styles.navButton}>
        <View style={styles.navLeft}>
          {/* <Ionicons name="document-text-outline" size={20} color="#FC7A1E" /> */}
          <Image
      source={require('../assets/Document.png')} // dummy image
      style={styles.withdrawIcon}
    />
          <Text style={styles.navText}>Transaction History</Text>
        </View>
        {/* <Ionicons name="chevron-forward" size={20} color="#000" /> */}
        <Image
      source={require('../assets/Stroke.png')} // dummy image
      style={styles.withdrawIcon}
    />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PendingPayments')} style={styles.navButton}>
        <View style={styles.navLeft}>
          {/* <Ionicons name="time-outline" size={20} color="#FC7A1E" /> */}
          <Image
      source={require('../assets/Documentpending.png')} // dummy image
      style={styles.withdrawIcon}
    />
          <Text style={styles.navText}>Pending Payments</Text>
        </View>
        {/* <Ionicons name="chevron-forward" size={20} color="#000" /> */}
        <Image
      source={require('../assets/Stroke.png')} // dummy image
      style={styles.withdrawIcon}
    />
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Payment Due ₹1,000</Text>
      </TouchableOpacity>

       {/* Withdrawal Button */}
       <TouchableOpacity onPress={() => setWithdrawalModalVisible(true)}>
        <Text>Withdrawal</Text>
      </TouchableOpacity>

      {/* Modal 1: Withdrawal Summary */}
      {/* <Modal visible={isWithdrawalModalVisible} transparent animationType="slide"> */}
      <Modal visible={isWithdrawalModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={()=> setWithdrawalModalVisible(false)}>
           <Text style={{color:'black',fontWeight:'bold'}}>X</Text>
          </TouchableOpacity>

          <Text style={styles.title2}>Withdrawal</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Salary</Text>
            <Text style={styles.greenText}>₹4,500</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Incentives</Text>
            <Text style={styles.greenText}>₹2,000</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Due</Text>
            <Text style={styles.redText}>- ₹562</Text>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Salary</Text>
            <Text style={styles.totalAmount}>₹21,500</Text>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={()=>''}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      {/* Modal 2: Choose Payment Type */}
      <Modal visible={isPaymentModeModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title2}>Choose Payment Method</Text>
          <TouchableOpacity onPress={() => alert('Online flow not implemented')}>
            <Text style={styles.title2}>Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPaymentModeModalVisible(false);
              setHandoverModalVisible(true);
            }}
          >
            <Text style={styles.title2}>Hand Over</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal 3: Handover Details */}
      <Modal visible={isHandoverModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Handover Details</Text>
          <Text>Cash Amount: ₹4,500</Text>
          <Text>Date: 22 July 2025</Text>
          <Text>Status: Awaiting approval</Text>

          <View style={styles.approvalBox}>
            <Text style={{ color: 'orange' }}>Approval Required</Text>
            <Text>Your handover request will require admin approval...</Text>
          </View>

          <TextInput
            placeholder="Add note (Optional)"
            style={styles.noteInput}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => setHandoverModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setHandoverModalVisible(false);
              alert("Handover submitted");
            }}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MyPaymentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    color:'black'
  },
  earningsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningsBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  earningsLabel: {
    color: '#777',
    fontSize: 13,
  },
  greenValue: { color: '#3BBE4B', fontSize: 16, fontWeight: 'bold' },
  orangeValue: { color: '#FC7A1E', fontSize: 16, fontWeight: 'bold' },
  redValue: { color: '#E53935', fontSize: 16, fontWeight: 'bold' },
  blueValue: { color: '#1E88E5', fontSize: 16, fontWeight: 'bold' },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color:'black'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color:'black'
  },
  withdrawButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E7F0FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignItems: 'center',
  },
  withdrawText: {
    fontSize: 14,
    marginRight: 6,
    color:'black'
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
    color:'black'
  },
  footerButton: {
    backgroundColor: '#001F3F',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cashSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  summaryBox: {
    width: '48%',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  summaryAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
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
    color: '#28a745', // green
  },
  redText: {
    fontSize: 15,
    color: '#dc3545', // red
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
  title2:{
    color:'black',
    fontSize: 17,
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
