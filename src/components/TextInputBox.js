import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

const TextInputBox = ({ 
  placeholder, 
  secureTextEntry = false, 
  value, 
  onChangeText, 
  icon = false, 
  iconSource, 
  onIconPress,
  error = false,
  keyboardType = "default",
  editable = true,
  multiline = false ,
  maxLength
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
      style={[
        styles.inputContainer,
        multiline && styles.multilineContainer, // ✅ adjust style if multiline
        isFocused || value ? styles.focusedBorder : styles.defaultBorder,
        error && styles.errorBorder
      ]}
    >
      <Text style={[
        styles.placeholder, 
        (isFocused || value) && styles.placeholderActive,
        error && styles.placeholderError
      ]}>
        {placeholder}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]} // ✅ apply multiline input style
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline} // ✅ passed multiline prop
        numberOfLines={multiline ? 4 : 1}
        {...(maxLength && { maxLength })}
      />
      {icon && (
        <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
          <Image source={iconSource} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    marginVertical: 8,
    position: "relative",
    height: 50,
  },
  multilineContainer: {
    alignItems: "flex-start",
    height: 120, // ✅ taller for multiline
    paddingTop: 20,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
    paddingTop: 12,
  },
  multilineInput: {
    textAlignVertical: "top", // ✅ makes text start from top in multiline
  },
  placeholder: {
    position: "absolute",
    left: 14,
    top: 15,
    fontSize: 16,
    color: "#777",
    backgroundColor: "#FFF",
    paddingHorizontal: 4,
  },
  placeholderActive: {
    top: -10,
    left: 12,
    fontSize: 12,
    color: "#093759",
  },
  placeholderError: {
    color: "red",
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 20,
  },
});

export default TextInputBox;
