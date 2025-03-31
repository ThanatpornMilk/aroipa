import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ImagePickerComponent from '../../components/ImagePickerComponent';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';

const NewListScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  // เลือกรูปจากอุปกรณ์
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // บันทึกข้อมูลลง AsyncStorage
  const handleSave = async () => {
    if (title.trim() === '') {
      alert('กรุณากรอกชื่อรายการ');
      return;
    }
    if (!image) {
      alert('กรุณาเลือกรูปภาพ');
      return;
    }

    const newItem = { title, image };

    try {
      // ดึงข้อมูลเก่าจาก AsyncStorage
      const existingData = await AsyncStorage.getItem('savedList');
      const savedList = existingData ? JSON.parse(existingData) : [];

      // เพิ่มรายการใหม่
      savedList.push(newItem);

      // บันทึกกลับเข้า AsyncStorage
      await AsyncStorage.setItem('savedList', JSON.stringify(savedList));

      // รีเซ็ตไปยังหน้า "ที่บันทึกไว้"
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            params: { screen: 'ที่บันทึกไว้' },
          },
        ],
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} />

      <InputField 
        value={title} 
        onChangeText={setTitle} 
      />

      <ImagePickerComponent image={image} pickImage={pickImage} />

      <CustomButton 
        onPress={handleSave} 
        title = "บันทึก"
        backgroundColor="#FFD700"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
});

export default NewListScreen;