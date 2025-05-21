import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

const CountryPickerComponent = ({ onSelect }) => {
  const [countryCode, setCountryCode] = useState("IN"); // Default country code
  const [callingCode, setCallingCode] = useState("91"); // Default calling code
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleSelect = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setShowCountryPicker(false);
    onSelect(country.callingCode[0], country.cca2); // Pass data to parent
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowCountryPicker(true)} style={styles.countryPicker}>
        <Text>+{callingCode} ▼</Text>
      </TouchableOpacity>

      {/* Country Picker Modal */}
      <CountryPicker
        visible={showCountryPicker}
        withFilter
        withFlag
        withCallingCode
        withModal
        countryCode={countryCode}
        onSelect={handleSelect}
        onClose={() => setShowCountryPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryPicker: {
    paddingHorizontal: 4,
    marginRight: 2,
  },
});

export default CountryPickerComponent;
