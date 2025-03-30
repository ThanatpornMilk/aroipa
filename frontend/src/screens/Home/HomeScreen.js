import axios from "axios";
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { searchPlacesWithReviews } from '../../services/SearchPlacesReview'; // assuming you have this method already
import SearchBox from '../../components/SearchBox';
import PlaceCard from '../../components/PlaceCard';

const DEFAULT_API_KEY = "2JDE2HnTp59vjVwJboatbgck"; // ค่าเริ่มต้น API Key ใหม่ของคุณ
const CACHE_KEY = 'cachedPlaces';
const CACHE_DURATION = 3600 * 1000; // 1 ชั่วโมง (ปรับตามที่ต้องการ)

const HomeScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const hasFetched = useRef(false);
  const [currentApiKey, setCurrentApiKey] = useState(DEFAULT_API_KEY);

  // ฟังก์ชันเพื่อตรวจสอบการเปลี่ยน API Key
  const checkApiKeyChange = async () => {
    const storedApiKey = await SecureStore.getItemAsync('storedApiKey');
    if (storedApiKey !== currentApiKey) {
      // หาก API Key เปลี่ยนแปลง ให้ลบ cache และโหลดข้อมูลใหม่
      await SecureStore.deleteItemAsync(CACHE_KEY); // ลบข้อมูลเก่าใน cache
      await SecureStore.setItemAsync('storedApiKey', currentApiKey); // เก็บ API Key ใหม่
      return true; // Return true for API key changed
    }
    return false;
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const apiKeyChanged = await checkApiKeyChange();

        // ถ้า API Key เปลี่ยนแปลง หรือไม่มีแคช หรือแคชหมดอายุ
        const cachedData = await SecureStore.getItemAsync(CACHE_KEY);
        if (apiKeyChanged || !cachedData) {
          // ดึงข้อมูลใหม่จาก API
          const data = await searchPlacesWithReviews(currentApiKey);  // ใช้ currentApiKey ที่เปลี่ยนแปลง
          console.log("ข้อมูลที่ดึงมาจาก API:", data); // ตรวจสอบข้อมูลที่ได้รับจาก API
          setPlaces(data);
          setFilteredPlaces(data);
          await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && parsedData.data && parsedData.timestamp) {
            if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
              setPlaces(parsedData.data);
              setFilteredPlaces(parsedData.data);
            } else {
              // ถ้าแคชหมดอายุ
              const data = await searchPlacesWithReviews(currentApiKey);  // ใช้ currentApiKey ที่เปลี่ยนแปลง
              console.log("ข้อมูลที่ดึงมาจาก API หลังจากแคชหมดอายุ:", data); // ตรวจสอบข้อมูลที่ได้รับจาก API
              setPlaces(data);
              setFilteredPlaces(data);
              await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchPlaces();
  }, [currentApiKey]); // เมื่อ currentApiKey เปลี่ยนจะทำการเรียก useEffect ใหม่

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredPlaces(
      places.filter(item => item.title.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const adjustedData = filteredPlaces.length % 2 !== 0 
    ? [...filteredPlaces, { dummy: true }] 
    : filteredPlaces;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8c00" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>ไม่มีข้อมูลที่แสดง</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBox
        placeholder="ค้นหา..."
        value={searchText}
        onChangeText={handleSearch} 
      />

      <FlatList
        data={adjustedData} 
        keyExtractor={(item, index) => item.place_id ? item.place_id.toString() : `dummy-${index}`}
        numColumns={2}
        renderItem={({ item }) => (
          <PlaceCard
            item={item}
            onPress={() => navigation.navigate('DetailScreen', { placeId: item.place_id, placeData: item })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});

export default HomeScreen;