import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Button, Alert } from 'react-native';
import { getPlaceDetails } from '../../services/SearchPlacesReview';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewCard from '../../components/ReviewCard';

const DetailScreen = ({ route, navigation }) => {
  const { placeId, placeData } = route.params;
  const [placeDetails, setPlaceDetails] = useState(placeData || null);
  const [loading, setLoading] = useState(!placeData);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [lists, setLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkIfFavoriteAndBookmarked = async () => {
      try {
        const storedFavorite = await AsyncStorage.getItem(`favorite-${placeId}`);
        const storedBookmark = await AsyncStorage.getItem(`bookmark-${placeId}`);
        setIsFavorite(storedFavorite === 'true');
        setIsBookmarked(storedBookmark === 'true');
      } catch (error) {
        console.error("Error checking status", error);
      }
    };

    checkIfFavoriteAndBookmarked();

    if (!placeData) {
      const fetchDetails = async () => {
        try {
          const details = await getPlaceDetails(placeId);
          setPlaceDetails(details);
        } catch (error) {
          console.error("Error fetching place details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [placeId, placeData]);

  const handleFavorite = async () => {
    try {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      await AsyncStorage.setItem(`favorite-${placeId}`, newFavoriteStatus ? 'true' : 'false');

      let favoritePlaces = await AsyncStorage.getItem('favoritePlaces');
      favoritePlaces = favoritePlaces ? JSON.parse(favoritePlaces) : [];

      if (newFavoriteStatus) {
        favoritePlaces.push(placeDetails);
      } else {
        favoritePlaces = favoritePlaces.filter(item => item.place_id !== placeId);
      }

      await AsyncStorage.setItem('favoritePlaces', JSON.stringify(favoritePlaces));
      navigation.setParams({ refreshFavorites: true });
    } catch (error) {
      console.error("Error updating favorite status", error);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarked) {
      // ถ้ากดแล้วเป็นบุคมาร์คแล้ว ให้ลบบุคมาร์ค
      handleRemoveBookmark();
    } else {
      try {
        // ดึงรายการที่ถูกบันทึกใน AsyncStorage
        const storedLists = await AsyncStorage.getItem('savedList');
        const existingLists = storedLists ? JSON.parse(storedLists) : [];
  
        if (existingLists.length === 0) {
          Alert.alert("ไม่มีรายการที่บันทึกไว้", "โปรดสร้างรายการก่อน");
          return;
        }
        setLists(existingLists); // อัพเดตสถานะลิสต์ที่บันทึกไว้
        setModalVisible(true); // แสดง Modal สำหรับเลือกเพิ่มในลิสต์
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก", error);
      }
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      const storedLists = await AsyncStorage.getItem('savedList');
      const existingLists = storedLists ? JSON.parse(storedLists) : [];
  
      const updatedLists = existingLists.map(list => ({
        ...list,
        places: list.places ? list.places.filter(place => place.placeId !== placeId) : [] // ป้องกัน undefined
      }));
  
      await AsyncStorage.setItem('savedList', JSON.stringify(updatedLists));
      setIsBookmarked(false);
      Alert.alert("ลบสำเร็จ", "รายการนี้ถูกลบออกจากลิสต์ของคุณแล้ว");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบสถานที่ออกจากลิสต์", error);
    }
  };

const handleAddToList = async (selectedListId) => {
  try {
    const storedLists = await AsyncStorage.getItem('savedList');
    let existingLists = storedLists ? JSON.parse(storedLists) : [];

    // หา list ที่ถูกเลือก
    const updatedLists = existingLists.map(list => {
      if (list.id === selectedListId) {
        const updatedPlaces = [...(list.places || [])];
        
        // ตรวจสอบว่ามี placeId นี้ใน list หรือยัง
        if (!updatedPlaces.some(place => place.placeId === placeId)) {
          updatedPlaces.push({
            placeId,
            title: placeDetails.title || "ชื่อร้านไม่ระบุ",
            thumbnail: placeDetails.thumbnail || "",
            address: placeDetails.address || "ไม่มีข้อมูลที่อยู่",
          });
        }

        return {
          ...list,
          places: updatedPlaces
        };
      }
      return list;
    });

    // บันทึกกลับไปที่ AsyncStorage
    await AsyncStorage.setItem('savedList', JSON.stringify(updatedLists));
    setIsBookmarked(true);
    setModalVisible(false);
    Alert.alert("เพิ่มสำเร็จ", "รายการนี้ถูกเพิ่มเข้าไปในลิสต์ของคุณแล้ว");

    // หา list ที่ถูกเลือกและ navigate ไปยัง DetailListScreen
    const selectedList = updatedLists.find(list => list.id === selectedListId);
    navigation.navigate('DetailListScreen', { selectedList });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มสถานที่เข้าไปในลิสต์", error);
  }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8c00" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!placeDetails) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>ไม่พบข้อมูลร้านค้า</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {placeDetails.thumbnail ? (
        <Image source={{ uri: placeDetails.thumbnail }} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={{ color: 'red', textAlign: 'center' }}>ไม่พบรูปภาพ</Text>
      )}
  
      <View style={styles.header}>
        <Text style={styles.title}>{placeDetails.title || "ชื่อร้านไม่ระบุ"}</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={handleFavorite}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkIcon}>
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={28} color="#CECECE" />
          </TouchableOpacity>
        </View>
      </View>
  
      <Text style={styles.rating}>⭐ {placeDetails.rating}</Text>
  
      <View style={styles.divider} />
  
      <View style={styles.addressContainer}>
        <View style={styles.addressBackground}>
          <View style={styles.locationIconWrapper}>
            <Ionicons name="location-sharp" size={20} color="#FF8A02" />
          </View>
          <Text style={styles.addressText}>{placeDetails.address || "ที่อยู่นี้ไม่มีข้อมูล"}</Text>
        </View>
      </View>
  
      {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
        <ReviewCard reviews={placeDetails.reviews} />
      ) : (
        <Text style={styles.noReviewsText}>ไม่มีรีวิว</Text>
      )}
          
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                เลือกเพิ่มเข้าลิสต์
                <TouchableOpacity onPress={() => navigation.navigate('NewListScreen')}>
                  <Ionicons name="add-circle" size={24} color="#FF8A02" />
                </TouchableOpacity>
              </Text>
              <FlatList
                data={lists}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => handleAddToList(item.id)}
                  >
                    <Text style={styles.listItemText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="ยกเลิก" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

    </ScrollView>
  );  
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#141414' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#fff' 
  },
  image: { 
    width: '100%', 
    height: 160, 
    marginBottom: 10 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    marginTop: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff', flex: 1 
  },
  iconGroup: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end' 
  },
  bookmarkIcon: { 
    marginLeft: 15 
  },
  rating: { color: '#fff', 
    paddingHorizontal: 15, 
    marginTop: 5 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#444', 
    marginHorizontal: 15, 
    marginVertical: 10 
  },
  addressContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 15, 
    marginTop: 4 
  },
  addressBackground: { 
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: '#2E2E2E', 
    borderRadius: 10, 
    padding: 10 
  },
  locationIconWrapper: { 
    backgroundColor: '#D9D9D9', 
    borderRadius: 10, 
    padding: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  addressText: { color: '#fff', 
    fontSize: 14, 
    flexShrink: 1 
  },
  sectionTitle: { 
    fontSize: 16,
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: 10 
  },
  reviewItem: { 
    backgroundColor: '#2E2E2E', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 12 
  },
  reviewProfileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 5 
  },
  reviewProfileImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center'  
  },
  reviewAuthor: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#FF8A02', 
    marginBottom: 5 
  },
  noReviewsText: { 
    color: '#fff', 
    paddingHorizontal: 15, 
    marginTop: 10 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  listItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  listItemText: { 
    fontSize: 16 
  },
});

export default DetailScreen;