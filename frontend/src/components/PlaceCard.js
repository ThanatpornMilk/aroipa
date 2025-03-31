import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PlaceCard = ({ item, onPress }) => {
  if (item.dummy) {
    return <View style={[styles.placeCard, { backgroundColor: 'transparent' }]} />;
  }

  return (
    <TouchableOpacity style={styles.placeCard} onPress={onPress}>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.ratingText}>{item.rating} ⭐</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeCard: {
    backgroundColor: '#B86707',
    borderRadius: 10,
    margin: 5,
    flex: 1,
    paddingBottom: 10,
    maxWidth: '48%', // จำกัดขนาดให้พอดีกับคอลัมน์
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
  category: {
    fontSize: 12,
    color: '#ddd',
  },
  ratingText: {
    fontSize: 12,
    color: '#FDDF1C',
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default PlaceCard;