import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, Button, Alert, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ListItem from '../../components/ListItem';
import * as ImagePicker from 'expo-image-picker';

const MyListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [myLists, setMyLists] = useState([]); // รายการที่ดึงมาจาก AsyncStorage หรือที่เพิ่มใหม่
  const [selectedItem, setSelectedItem] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [form, setForm] = useState({ title: '', image: '' }); 

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
      setForm({ ...itemToEdit });
      setModalVisible(true);
    }
  };

  const saveEdit = () => {
    const updatedList = [...myLists];
    const updatedItem = { ...selectedItem, ...form }; 
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
    itemToUpdate.isBookmarked = !itemToUpdate.isBookmarked;
    saveListToStorage(updatedList);
  };

  const pickImage = async () => {
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
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
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
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="ชื่อรายการของฉัน"
            value={form.title}
            onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
          />
          <TouchableOpacity onPress={pickImage} style={styles.input}>
            <Text style={styles.buttonText}>📷 เลือกรูปภาพใหม่</Text>
          </TouchableOpacity>
          {form.image ? <Image source={{ uri: form.image }} style={styles.imagePreview} /> : null}
          <View style={styles.modalButtonRow}>
            <Button title="ยกเลิก" color="#FF8A02" onPress={() => setModalVisible(false)} />
            <Button title="บันทึก" color="#FF8A02" onPress={saveEdit} />
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
    padding: 10,
  },
  emptyText: { 
    textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
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
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default MyListScreen;
