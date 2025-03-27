import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteScreen = ({ route }) => {
  const { favoritePlaces } = route.params || {}; // ตรวจสอบว่า route.params ไม่เป็น undefined หรือ null

  if (!favoritePlaces || favoritePlaces.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>ยังไม่มีร้านที่ถูกใจ</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ร้านที่ถูกใจ</Text>
      <FlatList
        data={favoritePlaces}
        keyExtractor={(item) => item.placeId ? item.placeId.toString() : item.id ? item.id.toString() : 'unknown'} // ตรวจสอบว่า placeId หรือ id มีค่าก่อน
        renderItem={({ item }) => (
          <View style={styles.favoriteCard}>
            <Text style={styles.favoriteTitle}>{item.title}</Text>
            <Text style={styles.favoriteRating}>⭐ {item.rating} ({item.review_count} รีวิว)</Text>
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#141414',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  favoriteCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  favoriteTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  favoriteRating: {
    fontSize: 16,
    color: '#ff8c00',
  },
});

export default FavoriteScreen;
