import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { searchPlacesWithReviews } from '../../services/SearchPlacesReview';

const HomeScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]); 
  const [loading, setLoading] = useState(true); // ตรวจสอบสถานะการโหลดข้อมูล

  useEffect(() => {
    const fetchPlaces = async () => {
      const data = await searchPlacesWithReviews(); // ดึงข้อมูลสถานที่พร้อมรีวิว
      setPlaces(data); 
      setLoading(false); 
    };

    fetchPlaces(); 
  }, []); 

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id ? item.place_id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.placeCard}
            onPress={() => navigation.navigate('Detail', { placeId: item.place_id })} // นำทางไปหน้า Detail
          >
            {item.thumbnail && (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  placeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default HomeScreen;
