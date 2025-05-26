import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, createMessage } from '../redux/AuthSlice';

const MessageScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const { messages, loading, error } = useSelector((state) => state.auth);
  const { bookingId, userId, providerId } = route.params;

  // Initial fetch
  useEffect(() => {
    dispatch(fetchMessages(bookingId));
  }, [bookingId, dispatch]);

  // Auto fetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchMessages(bookingId));
    }, 30000); // 30 sec
    return () => clearInterval(interval);
  }, [bookingId, dispatch]);

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(createMessage({
        user_id: userId,
        provider_id: providerId,
        message,
        is_from_user_to_provider: 0, // user sending to provider
        booking_id: bookingId
      }));
      setMessage('');
    }
  };

  const renderItem = ({ item }) => {
    const isSender = item.is_from_user_to_provider === 0;
    return (
        <View
        style={[
          styles.messageContainer,
          isSender ? styles.userMessage : styles.providerMessage,
        ]}
      >
        <Text style={styles.senderName}>
          {isSender ? item.provider_name : item.user_name}
        </Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.chatContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item?.message_id?.toString()}
            renderItem={renderItem}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 10,
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffcccc',
  },
  providerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    fontSize: 16,
    color: 'black'
  },
  sendButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 25,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessageScreen;
