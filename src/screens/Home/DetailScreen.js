import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DetailScreen = ({ route }) => {
  const { placeId, reviews } = route.params; // รับ placeId และ reviews ที่ส่งมาจาก HomeScreen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>กำลังโหลดรีวิว...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={{ color: 'red' }}>{error}</Text>} 
      
      {reviews.length === 0 ? (
        <Text>ไม่มีรีวิว</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewAuthor}>{item.source}</Text>
              <Text>{item.snippet}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewAuthor: {
    fontWeight: 'bold',
  },
});

export default DetailScreen;
