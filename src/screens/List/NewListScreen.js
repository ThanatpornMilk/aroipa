import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const NewListScreen = () => {
  return (
    <View style={styles.container}>
        <Text>หน้าที่เอาไว้สร้างรายการของฉัน</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
});

export default NewListScreen;
