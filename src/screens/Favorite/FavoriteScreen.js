import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const FavoriteScreen = () => {
  return (
    <View style={styles.container}>
      <Text>หน้าร้านที่ถูกใจ</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
});

export default FavoriteScreen;
