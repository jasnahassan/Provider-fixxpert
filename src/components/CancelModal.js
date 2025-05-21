// import React, { useState } from 'react';
// import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');

// const CancelModal = ({ visible, booking, onClose, onCancelSubmit }) => {
//   const [reason, setReason] = useState('');

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.backdrop}>
//         <View style={styles.modalBox}>
//           <Text style={styles.title}>Cancel Booking</Text>
//           <Text style={styles.subtitle}>Why do you want to cancel?</Text>

//           <TextInput
//             style={styles.input}
//             value={reason}
//             onChangeText={setReason}
//             placeholder="Type your reason here..."
//             placeholderTextColor="#999"
//             multiline
//           />

//           <View style={styles.buttonRow}>
//             <TouchableOpacity onPress={onClose} style={styles.secondaryBtn}>
//               <Text style={styles.secondaryBtnText}>Close</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => onCancelSubmit(reason)} style={styles.primaryBtn}>
//               <Text style={styles.primaryBtnText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     width: width * 0.9,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#222',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#777',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     padding: 12,
//     width: '100%',
//     minHeight: 80,
//     textAlignVertical: 'top',
//     backgroundColor: '#fafafa',
//     fontSize: 14,
//     marginBottom: 20,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-between',
//   },
//   secondaryBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#D61F1F',
//     borderRadius: 10,
//     paddingVertical: 12,
//     marginRight: 8,
//     alignItems: 'center',
//   },
//   secondaryBtnText: {
//     color: '#D61F1F',
//     fontWeight: '600',
//   },
//   primaryBtn: {
//     flex: 1,
//     backgroundColor: '#D61F1F',
//     borderRadius: 10,
//     paddingVertical: 12,
//     marginLeft: 8,
//     alignItems: 'center',
//   },
//   primaryBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// export default CancelModal;

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const CancelModal = ({ onCancelAnyway, onReschedule ,visible, booking, onClose, onCancelSubmit}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.handle} />

          <Text style={styles.question}>Are you sure about cancelling this booking?</Text>
          <Text style={styles.note}>You can always reschedule it.</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity onPress={onCancelSubmit} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel anyway</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onReschedule} style={styles.rescheduleBtn}>
              <Text style={styles.rescheduleBtnText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 30
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10
  },
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D61F1F',
    borderRadius: 10,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center'
  },
  cancelBtnText: { color: '#D61F1F', fontWeight: '600' },
  rescheduleBtn: {
    flex: 1,
    backgroundColor: '#D61F1F',
    borderRadius: 10,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center'
  },
  rescheduleBtnText: { color: '#fff', fontWeight: '600' }
});

export default CancelModal;
