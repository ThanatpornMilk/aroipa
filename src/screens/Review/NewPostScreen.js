import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NewPostScreen = () => {
  return (
    <View style={styles.container}>
        <Text>สร้างโพสใหม่</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
});

export default NewPostScreen;
