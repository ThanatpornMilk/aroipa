import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DetailListScreen = () => {
  const route = useRoute();
  const [selectedList, setSelectedList] = useState(route.params?.selectedList || { places: [] });

  useFocusEffect(
    useCallback(() => {
      const fetchList = async () => {
        try {
          const storedLists = await AsyncStorage.getItem('savedList');
          const lists = storedLists ? JSON.parse(storedLists) : [];
          const updatedList = lists.find(list => list.id === route.params?.selectedList?.id);
          setSelectedList(updatedList || { places: [] });
          console.log("Updated selectedList:", updatedList);
        } catch (error) {
          console.error("Error fetching list from storage:", error);
        }
      };
      fetchList();
    }, [route.params?.selectedList?.id])
  );

  const placeCount = selectedList?.places?.length || 0;

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={80} color="#555" />
      <Text style={styles.noDataText}>ไม่มีข้อมูลรายการที่บันทึกไว้</Text>
      <Text style={styles.noDataSubText}>บันทึกสถานที่เพื่อเพิ่มลงในรายการนี้</Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      {selectedList?.image ? (
        <Image source={{ uri: selectedList.image }} style={styles.headerImage} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="images-outline" size={50} color="#555" />
        </View>
      )}
      <View style={styles.headerInfo}>
        <Text style={styles.title}>{selectedList.title || "ไม่มีชื่อรายการ"}</Text>
        <Text style={styles.placeCount}>
          <Ionicons name="bookmark" size={16} color="#FF8A02" /> 
          {placeCount} สถานที่
        </Text>
        {selectedList.description && (
          <Text style={styles.description}>{selectedList.description}</Text>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/100' }}
        style={styles.placeImage}
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeTitle}>{item.title}</Text>
        <View style={styles.detailsContainer}>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
          {item.address && (
            <Text style={styles.addressText} numberOfLines={2}>
              <Ionicons name="location-outline" size={14} color="#bbb" /> {item.address}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!selectedList || placeCount === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {renderListHeader()}
        <View style={styles.divider} />
        {renderEmptyList()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={selectedList.places}
        keyExtractor={(item) => item.placeId.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {renderListHeader()}
            <View style={styles.divider} />
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#141414', 
  },
  listContent: {
    paddingBottom: 16,
  },
  headerContainer: {
    padding: 16,
  },
  headerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#2E2E2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  placeCount: {
    fontSize: 16,
    color: '#FF8A02',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    position: 'relative',
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  detailsContainer: {
    gap: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#FFD700',
  },
  addressText: {
    fontSize: 14,
    color: '#bbb',
  },
  indexBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  indexText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noDataText: { 
    color: 'white', 
    textAlign: 'center', 
    marginTop: 16, 
    fontSize: 18,
    fontWeight: 'bold',
  },
  noDataSubText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
});

export default DetailListScreen;