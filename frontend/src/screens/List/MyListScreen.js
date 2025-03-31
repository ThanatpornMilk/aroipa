import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, Button, Alert, Image, StyleSheet } from 'react-native'; // เพิ่มการนำเข้า StyleSheet ที่นี่
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ListItem from '../../components/ListItem';
import * as ImagePicker from 'expo-image-picker';

const MyListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [myLists, setMyLists] = useState([]); // รายการที่ดึงมาจาก AsyncStorage หรือที่เพิ่มใหม่
  const [selectedItem, setSelectedItem] = useState(null); // ข้อมูลของรายการที่ผู้ใช้เลือกเพื่อแก้ไข
  const [modalVisible, setModalVisible] = useState(false); // การแสดง/ซ่อน Modal
  const [form, setForm] = useState({ title: '', image: '' }); // ฟอร์มที่ใช้ใน Modal

  // โหลดรายการที่เก็บใน AsyncStorage
  const loadSavedList = async () => {
    try {
      const data = await AsyncStorage.getItem('savedList');
      if (data) {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          setMyLists(parsedData);
        } else {
          console.warn('รูปแบบข้อมูล savedList ผิดพลาด');
        }
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
    }
  };

  // บันทึกรายการไปยัง AsyncStorage
  const saveListToStorage = async (updatedList) => {
    try {
      await AsyncStorage.setItem('savedList', JSON.stringify(updatedList));
      setMyLists(updatedList);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadLists = async () => {
        const storedLists = await AsyncStorage.getItem('savedList');
        setLists(storedLists ? JSON.parse(storedLists) : []);
      };
      loadLists();
    }, [])
  );

  useEffect(() => {
    // โหลดลิสต์ที่บันทึกไว้จาก AsyncStorage
    loadSavedList();
  }, []);
  
  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = route.params.newItem; // รับข้อมูลใหม่ที่มาจากหน้า DetailScreen
  
      // เพิ่มรายการบุ๊คมาร์คลงในลิสต์ที่มีอยู่แล้ว
      const updatedList = [...myLists, newItem];
      saveListToStorage(updatedList); // บันทึกรายการที่อัพเดตลงใน AsyncStorage
    }
  }, [route.params?.newItem]); // เมื่อมี newItem เข้ามาให้ทำงานนี้
  

  const deleteItem = (index) => {
    Alert.alert("ยืนยันการลบ", "แน่ใจหรือไม่ว่าต้องการลบรายการนี้?", [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", onPress: () => {
          const updatedList = myLists.filter((_, i) => i !== index);
          saveListToStorage(updatedList);
        }
      }
    ]);
  };

  const editItem = (index) => {
    const itemToEdit = myLists[index];
    if (itemToEdit) {
      setSelectedItem({ index, ...itemToEdit });
      setForm({ ...itemToEdit }); // ตั้งค่า form ให้ตรงกับข้อมูลที่เลือก
      setModalVisible(true);
    }
  };

  const saveEdit = () => {
    const updatedList = [...myLists];
    const updatedItem = { ...selectedItem, ...form }; // อัพเดตข้อมูลใน selectedItem ด้วยข้อมูลจาก form
    updatedList[selectedItem.index] = updatedItem;
    saveListToStorage(updatedList);
    setModalVisible(false); // ปิด Modal
  };

  const handleItemPress = (item) => {
    navigation.navigate('DetailListScreen', { item });
  };
  
  const toggleBookmark = (index) => {
    const updatedList = [...myLists];
    const itemToUpdate = updatedList[index];
    itemToUpdate.isBookmarked = !itemToUpdate.isBookmarked; // สลับสถานะบุ๊คมาร์ค
    saveListToStorage(updatedList);
  };

  const pickImage = async () => {
    // ขออนุญาตเข้าถึงรูปภาพในอุปกรณ์
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setForm((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  
  return (
    <View style={styles.container}>
      {myLists.length === 0 ? (
        <Text style={styles.emptyText}>ยังไม่มีรายการ</Text>
      ) : (
        <FlatList
          data={myLists}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 5 }}
          renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <ListItem 
              item={item} 
              index={index} 
              onEdit={editItem} 
              onDelete={deleteItem} 
              onPress={() => handleItemPress(item)}
            />
            {/* <TouchableOpacity onPress={() => toggleBookmark(index)} style={styles.bookmarkButton}>
                <Text style={styles.bookmarkText}>{item.isBookmarked ? 'ลบจากบุ๊คมาร์ค' : 'เพิ่มในบุ๊คมาร์ค'}</Text>
              </TouchableOpacity> */}
            </View>
          )}
        />
      )}

<Modal visible={modalVisible} transparent={true} animationType="slide">
  <View style={styles.modalContent}>
    {/* ช่องแก้ไขชื่อ */}
    <TextInput
      style={styles.input}
      placeholder="ชื่อรายการของฉัน"
      value={form.title}
      onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))} // เมื่อเปลี่ยนชื่อในฟอร์ม
    />

    {/* ปุ่มเลือกรูปภาพ */}
    <TouchableOpacity onPress={pickImage} style={styles.input}>
      <Text style={styles.buttonText}>📷 เลือกรูปภาพใหม่</Text>
    </TouchableOpacity>

    {/* แสดงภาพที่เลือก */}
    {form.image ? <Image source={{ uri: form.image }} style={styles.imagePreview} /> : null}

    <View style={styles.modalButtonRow}>
      <Button title="ยกเลิก" onPress={() => setModalVisible(false)} />
      <Button title="บันทึก" onPress={saveEdit} />
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111', 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16, color: 'gray' 
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
  label: {
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkboxGroup: {
    marginTop: 20,
  },
  labelCat: {
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox: {
    fontSize: 20,
  },
  checkboxText: {
    marginLeft: 5,
  },
  buttonText: {
    color: "#1a1a1a",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  }
});

export default MyListScreen;