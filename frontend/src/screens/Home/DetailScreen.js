import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getPlaceDetails } from '../../services/SearchPlacesReview';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailScreen = ({ route, navigation }) => {
  const { placeId, placeData } = route.params;
  const [placeDetails, setPlaceDetails] = useState(placeData || null);
  const [loading, setLoading] = useState(!placeData);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false); 

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
        favoritePlaces = favoritePlaces.filter(item => item.placeId !== placeId);
      }
        await AsyncStorage.setItem('favoritePlaces', JSON.stringify(favoritePlaces));
        navigation.setParams({ refreshFavorites: true }); // เพิ่มพารามิเตอร์นี้ให้ FavoriteScreen
    } catch (error) {
      console.error("Error updating favorite status", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const newBookmarkStatus = !isBookmarked;
      setIsBookmarked(newBookmarkStatus);
      await AsyncStorage.setItem(`bookmark-${placeId}`, newBookmarkStatus ? 'true' : 'false');
    } catch (error) {
      console.error("Error updating bookmark status", error);
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
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>รีวิวจากผู้ใช้:</Text>
          {placeDetails.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewProfileContainer}>
                <View style={styles.reviewProfileImage}>
                  <Ionicons name="person-circle" size={40} color="#FF8A02" />
                </View>
                <View>
                  <Text style={styles.reviewAuthor}>{review.source}</Text>
                  <Text style={styles.reviewRating}>{Array(review.rating).fill('⭐').join('')}</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.snippet}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noReviewsText}>ไม่มีรีวิว</Text>
      )}
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
    color: '#fff', 
    flex: 1 
  },
  iconGroup: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end' 
  },
  bookmarkIcon: { 
    marginLeft: 15 
  },
  rating: { 
    color: '#fff', 
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
  addressText: { 
    color: '#fff', 
    fontSize: 14, 
    flexShrink: 1 
  },
  reviewsContainer: { 
    paddingHorizontal: 15, 
    marginTop: 20 
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
  reviewRating: { 
    fontSize: 10, 
    color: 'lightgreen', 
    marginBottom: 5 
  },
  reviewText: { 
    fontSize: 14, 
    color: '#fff' 
  },
  noReviewsText: { 
    color: '#fff', 
    paddingHorizontal: 15, 
    marginTop: 10 
  }
});

export default DetailScreen;
