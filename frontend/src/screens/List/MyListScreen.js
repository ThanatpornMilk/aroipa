import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const MyListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>หน้ารายการของฉันที่รวมเพลลิส</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
});

export default MyListScreen;
