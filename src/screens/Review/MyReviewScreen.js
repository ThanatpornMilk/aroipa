import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const MyReviewScreen = () => {
  return (
    <View style={styles.content}>
        <Text>รีวิวของฉัน</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
  },
});

export default MyReviewScreen;
