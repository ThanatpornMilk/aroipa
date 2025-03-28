import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { searchPlacesWithReviews } from '../../services/SearchPlacesReview';

const HomeScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);  // ข้อมูลทั้งหมด
  const [filteredPlaces, setFilteredPlaces] = useState([]);  // ข้อมูลที่กรองแล้ว
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(''); // state สำหรับคำค้นหา

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      const data = await searchPlacesWithReviews();
      console.log("ข้อมูลที่ได้จาก API:", data);
      setPlaces(data);
      setFilteredPlaces(data); // กำหนด places ที่กรองแล้วให้เป็นข้อมูลเริ่มต้น
      setLoading(false);
    };
    fetchPlaces();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = places.filter(item => 
      item.title.toLowerCase().includes(text.toLowerCase()) || // ค้นหาจากชื่อสถานที่
      (item.description && item.description.toLowerCase().includes(text.toLowerCase())) // หรือจากคำบรรยาย (ถ้ามี)
    );
    setFilteredPlaces(filteredData); // แสดงข้อมูลที่กรองแล้ว
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8c00" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="ค้นหา..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={handleSearch} // เมื่อพิมพ์ข้อความจะทำการค้นหาทันที
      />
      
      <FlatList
        data={filteredPlaces} // แสดงข้อมูลที่กรองแล้ว
        keyExtractor={(item, index) => item.place_id ? item.place_id.toString() : index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.placeCard}
            onPress={() => navigation.navigate('DetailScreen', { 
              placeId: item.place_id,
              placeData: item // ส่งข้อมูลร้านไปด้วย
            })}
          >
            {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.rating}>{item.rating} ⭐</Text>
              {/* <Text style={styles.rating}>{item.rating} ⭐ | {item.review_count} รีวิว</Text> */}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  searchBar: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#fff',
  },
  placeCard: {
    backgroundColor: '#B86707', 
    borderRadius: 10,
    margin: 5,
    flex: 1,
    paddingBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  rating: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
});

export default HomeScreen;
