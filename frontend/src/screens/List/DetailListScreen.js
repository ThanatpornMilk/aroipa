import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DetailListScreen = () => {
  const route = useRoute();
  const selectedList = route.params?.selectedList;

  if (!selectedList) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>ไม่มีข้อมูลรายการที่บันทึกไว้</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* แสดงชื่อและรูปของรายการ */}
      <View style={styles.listHeader}>
        {selectedList.thumbnail ? (
          <Image source={{ uri: selectedList.thumbnail }} style={styles.listImage} resizeMode="cover" />
        ) : (
          <Text style={styles.noImageText}>ไม่มีรูปภาพ</Text>
        )}
        <Text style={styles.listTitle}>{selectedList.title}</Text>
      </View>

      {/* แสดงรายการบุ๊คมาร์คที่เพิ่มเข้าไป */}
      <FlatList
        data={selectedList.places}
        keyExtractor={(item) => item.placeId.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="cover" />
            ) : (
              <Text style={styles.noImageText}>ไม่มีรูปภาพ</Text>
            )}
            <Text style={styles.listItemText}>{item.title}</Text>
            <Text style={styles.listItemText}>ที่อยู่: {item.address}</Text>
            <Text style={styles.listItemText}>หมวดหมู่: {item.category}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111',
    padding: 15
  },
  listHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  listTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff',
    marginTop: 10 
  },
  listImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 10 
  },
  listItem: { 
    padding: 15, 
    backgroundColor: '#2E2E2E', 
    marginBottom: 10, 
    borderRadius: 8 
  },
  listItemText: { 
    color: '#fff', 
    fontSize: 16 
  },
  image: { 
    width: '100%', 
    height: 200, 
    marginBottom: 10 
  },
  noImageText: { 
    color: 'gray', 
    textAlign: 'center' 
  },
  noDataText: { 
    color: 'white', 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 
  }
});

export default DetailListScreen;
