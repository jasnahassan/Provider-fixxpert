import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const CityPickerBox = ({
  placeholder,
  selectedValue,
  onValueChange,
  items = [],
  error = false,
  width = 300,
  label="SelectCity"
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused || selectedValue ? styles.focusedBorder : styles.defaultBorder,
        error && styles.errorBorder
      ]}
    >
      <Text style={[
        styles.label,
        (isFocused || selectedValue) && styles.labelFocused,
        error && styles.labelError
      ]}>
        {placeholder}
      </Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dropdownIconColor="#093759"
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label={label} value="" />
        {items.map((item) => (
          <Picker.Item label={item.city_name} value={item.city_id} key={item.city_id} />
        ))}
      </Picker>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginVertical: 8,
    position: "relative",
    height: 50,
    justifyContent: "center",

  },
  defaultBorder: {
    borderColor: "#ccc",
  },
  focusedBorder: {
    borderColor: "#093759",
  },
  errorBorder: {
    borderColor: "red",
  },
  label: {
    position: "absolute",
    left: 14,
    top: 15,
    fontSize: 16,
    color: "#777",
    backgroundColor: "#FFF",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelFocused: {
    top: -10,
    left: 12,
    fontSize: 12,
    color: "#093759",
  },
  labelError: {
    color: "#093759",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black",
    marginTop: 10,
  },
  pickerItem: {
    fontSize: 8,
    color: 'black',
  },
});

export default CityPickerBox;
