import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

const ListItem = ({ item, index, onEdit, onDelete, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, { width: CARD_WIDTH }]} onPress={onPress}>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(index)}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(index)}>
        <Ionicons name="create-outline" size={20} color="white" />
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

      <Text style={styles.countText}>{item.places?.length || 0} สถานที่</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    backgroundColor: '#717171',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '75%', 
    borderRadius: 10,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 5,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  editButton: {
    position: 'absolute',
    top: 5,   
    right: 5, 
    padding: 5,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});

export default ListItem;
