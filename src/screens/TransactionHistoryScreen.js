import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const transactions = [
  { id: '1', service: 'Home Service Call', date: '25 May 2024', amount: '₹11,44', status: 'Completed' },
  { id: '2', service: 'Home Service Call', date: '24 May 2024', amount: '₹11,44', status: 'Completed' },
];

const TransactionHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('Online');

  return (
    <View style={styles.container}>
      {/* Tab Switch */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Online' && styles.activeTab]}
          onPress={() => setActiveTab('Online')}
        >
          <Text style={[styles.tabText, activeTab === 'Online' && styles.activeTabText]}>Online Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Cash' && styles.activeTab]}
          onPress={() => setActiveTab('Cash')}
        >
          <Text style={[styles.tabText, activeTab === 'Cash' && styles.activeTabText]}>Cash on Hand</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <Text style={styles.service}>{item.service}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 5,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#093759',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  leftSection: {},
  rightSection: { alignItems: 'flex-end' },

  service: { fontSize: 16, fontWeight: '600', color: '#333' },
  date: { fontSize: 13, color: '#777' },
  amount: { fontSize: 16, fontWeight: '600', color: '#111' },
  status: { fontSize: 13, color: '#1aa260', fontWeight: '500' },
});
