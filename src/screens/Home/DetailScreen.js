import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getPlaceDetails } from '../../services/SearchPlacesReview';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // นำเข้า AsyncStorage

const DetailScreen = ({ route, navigation }) => {
  const { placeId, placeData, addToFavorites } = route.params;
  const [placeDetails, setPlaceDetails] = useState(placeData || null);
  const [loading, setLoading] = useState(placeData ? false : true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const storedFavorite = await AsyncStorage.getItem(`favorite-${placeId}`);
        if (storedFavorite === 'true') {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        console.error("Error checking favorite status", error);
      }
    };

    checkIfFavorite();

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
    }
  }, [placeId, placeData]);

  const handleFavorite = async () => {
    try {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      await AsyncStorage.setItem(`favorite-${placeId}`, newFavoriteStatus ? 'true' : 'false');
      if (newFavoriteStatus) {
        addToFavorites(placeDetails); // เพิ่มร้านที่ถูกใจ
      } else {
        addToFavorites(null); // ลบร้านที่ถูกใจออก (ถ้าต้องการ)
      }
    } catch (error) {
      console.error("Error updating favorite status", error);
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

  const imageUrl = placeDetails.thumbnail || '';
  const isImageValid = imageUrl.startsWith('http');

  return (
    <FlatList
      style={styles.container}
      data={placeDetails.reviews}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          {isImageValid ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Text style={{ color: 'red', textAlign: 'center' }}>ไม่พบรูปภาพ</Text>
          )}
          <View style={styles.header}>
            <Text style={styles.title}>{placeDetails.title || "ชื่อร้านไม่ระบุ"}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert('Add to bookmarks')}>
                <Ionicons name="bookmark-outline" size={28} color="orange" style={styles.bookmarkIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.rating}>⭐ {placeDetails.rating} ({placeDetails.review_count} รีวิว)</Text>
          <Text style={styles.openStatus}>
            <Ionicons name="time-outline" size={16} color="lightgreen" />
            {Array.isArray(placeDetails.opening_hours) ? placeDetails.opening_hours.join(', ') : placeDetails.opening_hours || "ไม่ระบุ"}
          </Text>

          <View style={styles.infoContainer}>
            <Ionicons name="location-outline" size={18} color="#fff" />
            <Text style={styles.infoText}>{placeDetails.address}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text style={styles.infoText}>{placeDetails.phone_number || "ไม่ระบุ"}</Text>
          </View>

          <Text style={styles.sectionTitle}>รีวิวจากลูกค้า</Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewAuthor}>{item.source}</Text>
          <Text style={styles.reviewText}>{item.snippet}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#141414', 
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
    marginLeft: 0, 
    marginRight: 0, 
    borderRadius: 0, 
    resizeMode: 'cover' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 ,
    paddingHorizontal: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff',
  },
  iconContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  bookmarkIcon: {
    marginLeft: 10, 
  },
  rating: { 
    color: '#fff', 
    marginTop: 5 ,
    paddingHorizontal: 10 
  },
  openStatus: { 
    color: 'lightgreen', 
    marginTop: 10 ,
    paddingHorizontal: 10 
  },
  infoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10 ,
    paddingHorizontal: 10 
  },
  infoText: { 
    color: '#fff', 
    marginLeft: 5 
  },
  sectionTitle: { 
    fontSize: 16, 
    color: '#fff', 
    marginTop: 20, 
    fontWeight: 'bold' ,
    paddingHorizontal: 10 
  },
  reviewCard: { 
    backgroundColor: '#333', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 10 ,
  },
  reviewAuthor: { 
    color: '#ff8c00', 
    fontWeight: 'bold' 
  },
  reviewText: { 
    color: '#fff', 
    marginTop: 5 
  },
});

export default DetailScreen;
