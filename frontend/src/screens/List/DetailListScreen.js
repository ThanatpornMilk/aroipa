import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native'; // ใช้ useRoute เพื่อรับ params

const DetailListScreen = () => {
  const route = useRoute();
  const { item } = route.params; // รับข้อมูล item ที่ส่งมาจาก MyListScreen

  // ตรวจสอบว่า item และ item.title มีค่าหรือไม่
  const itemName = item?.title || "ไม่มีชื่อรายการ"; // ถ้าไม่มีชื่อรายการจะใช้ข้อความ "ไม่มีชื่อรายการ"
  const itemImage = item?.image || null; // ถ้าไม่มีรูปภาพจะให้เป็น null

  return (
    <View style={styles.container}>
      {/* แสดงรูปภาพ */}
      {itemImage ? (
        <Image source={{ uri: itemImage }} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={styles.noImageText}>ไม่มีรูปภาพ</Text>
      )}
      
      {/* แสดงชื่อรายการทางซ้าย */}
      <Text style={styles.title}>{itemName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#111',
    justifyContent: 'flex-start',  
    alignItems: 'center',
    alignItems: 'flex-start',      // จัดตำแหน่งเนื้อหาทางซ้าย      
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10, 
    width: '100%', 
    paddingLeft: 15, 
  },
  image: {
    width: '100%', 
    height: 200, 
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 10,
  },
});

export default DetailListScreen;