import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import PlaceCard from '../../components/PlaceCard';

const FavoriteScreen = ({ navigation }) => {
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  const loadFavorites = async () => {
    try {
      const favoriteStore = await AsyncStorage.getItem('favoritePlaces');
      let places = favoriteStore ? JSON.parse(favoriteStore) : [];

      const uniquePlaces = places.filter((place, index, self) =>
        index === self.findIndex((p) => p.place_id === place.place_id)
      );

      setFavoritePlaces(uniquePlaces);
    } catch (error) {
      console.error("Error loading favorite places", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []) 
  );

  return (
    <View style={styles.container}>
      {favoritePlaces.length === 0 ? (
        <Text style={styles.message}>ยังไม่มีร้านที่ถูกใจ</Text>
      ) : (
        <FlatList
          data={favoritePlaces}
          keyExtractor={(item) => item.place_id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <PlaceCard
              item={item}
              onPress={() => {
                navigation.navigate('DetailScreen', {
                  placeId: item.place_id,
                  placeData: item,
                });
              }}
            />
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
    backgroundColor: '#141414',
  },
  message: { 
    color: '#fff', 
    fontSize: 16, 
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoriteScreen;
