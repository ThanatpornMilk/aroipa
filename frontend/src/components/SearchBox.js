import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBox = ({ 
  placeholder, 
  value, 
  onChangeText, 
  backgroundColor = '#333', 
  iconColor = '#fff', 
  textColor = '#fff',
  placeholderTextColor = '#bbb',
  secureTextEntry = false, 
  rightIcon, 
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name="search" size={20} color={iconColor} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {rightIcon && (
        <Ionicons 
          name={rightIcon.name} 
          size={rightIcon.size || 24} 
          color={rightIcon.color || iconColor} 
          onPress={rightIcon.onPress} 
          style={styles.icon} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});

export default SearchBox;
