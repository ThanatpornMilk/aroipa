import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputField = ({ value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="ชื่อรายการของฉัน"
      placeholderTextColor="#696969"
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#a9a9a9',
    color: 'black',
    fontSize: 14,
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
});

export default InputField;