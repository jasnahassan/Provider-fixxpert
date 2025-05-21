
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import TextInputBox from "./TextInputBox";
import CityPickerBox from "./CityPickerBox";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const AddAddressModal = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const { cities } = useSelector((state) => state.auth);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter the house/flat number.");
      return;
    }
  
    if (!detail.trim()) {
      alert("Please enter the address detail.");
      return;
    }
  
    if (!city) {
      alert("Please select a city.");
      return;
    }
  
    const addressData = {
      title,
      detail,
      city,
    };
  
    console.log("Saving from modal:", addressData);
    onSave(addressData);
  
    // Clear after save
    setTitle("");
    setDetail("");
    setCity("");
  };
  

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add New Address</Text>

          {/* Address Title Input */}

          <TextInputBox
            placeholder="House no/flat number"
            value={title}
            onChangeText={setTitle}
          />

          {/* Address Detail Input */}
          <TextInputBox

            placeholder="Adress Details"
            value={detail}
            onChangeText={setDetail}
          />
          <CityPickerBox
            placeholder="Select City"
            selectedValue={city}
            onValueChange={setCity}
            items={cities}
          />

          {/* Phone Number Input */}
          {/* <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          /> */}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  closeText: {
    fontSize: 22,
    color: "black",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: width - 40,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: width - 40,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 10,
    width: width - 40,
  },
  cancelButtonText: {
    color: "red",
    fontSize: 16,
  },
});

export default AddAddressModal;

