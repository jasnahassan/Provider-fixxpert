import React, { useEffect,useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../redux/AuthSlice';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loadingindicator, setLoadingindicator] = useState(false);

  const { notifications, loadingNotifications } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Info', 'Delete functionality can be implemented here if API supports it.');
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      // onPress={() => Alert.alert(item.title, item.body)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>🔔</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.description}>{item?.message}</Text>
        <Text style={styles.time}>{item?.created_on || 'Just now'}</Text>
      </View>
      {/* <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
     
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerContainer}>
      <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
        <Text style={styles.screenTitle}>Notifications</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {loadingNotifications ? (
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        ) : notifications?.length == 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/nonotification.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Notifications!</Text>
            <Text style={styles.emptySubtitle}>You don't have any notification yet</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={renderNotification}
              contentContainerStyle={styles.listContainer}
            />
            {/* <TouchableOpacity style={styles.markAllButton} onPress={() => Alert.alert('Marked all as read')}>
              <Text style={styles.markAllText}>Mark All as Read</Text>
            </TouchableOpacity> */}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
    flexDirection:'row'
  },
  screenTitle: { fontSize: 20, fontWeight: '600', color: '#1E1E1E' },
  container: { flex: 1, padding: 10, backgroundColor: '#F9F9F9' },
  listContainer: { paddingBottom: 20 },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    // borderRadius: 12,
    // marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBox: { marginRight: 12 },
  icon: { fontSize: 24 },
  textBox: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#161616' },
  description: { color: '#666', marginVertical: 2 },
  time: { color: '#AAA', fontSize: 12 },
  deleteText: { fontSize: 20, color: '#FF3B30', paddingHorizontal: 8 },

  markAllButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  markAllText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  backButton: { marginBottom: 20, flexDirection: 'row',alignItems:'center' },
  backIcon: {
      height: 20,
      width: 20,
      marginTop: 5,
      marginRight: 15
  },
  title:{
      fontSize:20
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999
  }
});

export default NotificationScreen;
