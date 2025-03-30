import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ImagePickerComponent = ({ image, pickImage, width = 150, height = 150, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>รูปภาพ</Text>
      <TouchableOpacity style={[styles.imagePicker, { width, height }]} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={[styles.image, { width, height }]} />
        ) : (
          <Image source={require('../../src/img/images1.png')} style={[styles.placeholder, { width, height }]} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20
  },
  label: { 
    color: 'white', 
    fontSize: 14, 
    marginBottom: 10 
  },
  imagePicker: {
    backgroundColor: '#808080',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  placeholder: { 
    opacity: 0.5 
  },
  image: { 
    borderRadius: 20,
    color: "white",
  },
});

export default ImagePickerComponent;
