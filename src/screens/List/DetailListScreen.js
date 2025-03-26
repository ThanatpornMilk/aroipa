import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const DetailListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>หน้าที่กดเข้าไปในเพลิสแล้วแสดงรายการร้านที่เพิ่มไว้</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
});

export default DetailListScreen;
