import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import CustomButton from '../../components/CustomButton';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import * as ImagePicker from 'expo-image-picker';

// ใช้ Dimensions เพื่อดึงขนาดหน้าจอ
const { width, height } = Dimensions.get('window');

const NewPostScreen = () => {
  const navigation = useNavigation();

  const initialState = {
    place: "",
    titlereview: "",
    review: "",
    rating: 0,
    image: null,
    categories: {
      food: false,
      bakery: false,
      coffee: false,
      cafe: false,
    },
  };

  const [form, setForm] = useState(initialState);

  useFocusEffect(
    useCallback(() => {
      setForm(initialState);
    }, [])
  );

  const toggleCategory = (key) => {
    setForm((prev) => ({
      ...prev,
      categories: { ...prev.categories, [key]: !prev.categories[key] },
    }));
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

  const validateForm = () => {
    if (!form.place || !form.titlereview || !form.review || form.rating === 0) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนโพสต์");
      return false;
    }
    return true;
  };

  const handlePost = () => {
    if (!validateForm()) return;

    navigation.navigate('รีวิวของฉัน', { newReview: form });
    setForm(initialState);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { minHeight: height }]}>
      <TextInput
        style={styles.input}
        placeholder="สถานที่"
        placeholderTextColor="#656161"
        value={form.place}
        onChangeText={(text) => setForm((prev) => ({ ...prev, place: text }))}
      />

      <View style={styles.checkboxGroup}>
        <Text style={styles.labelCat}>หมวดหมู่</Text>
        <View style={styles.checkboxRow}>
          {Object.keys(form.categories).map((key) => (
            <TouchableOpacity key={key} style={styles.checkboxContainer} onPress={() => toggleCategory(key)}>
              <Text style={styles.checkbox}>{form.categories[key] ? "☑" : "☐"}</Text>
              <Text style={styles.checkboxText}>
                {key === "food"
                  ? "ร้านอาหาร"
                  : key === "bakery"
                  ? "ร้านเบเกอรี่"
                  : key === "coffee"
                  ? "ร้านกาแฟ/ชา"
                  : "คาเฟ่"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="หัวข้อรีวิว"
        placeholderTextColor="#656161"
        value={form.titlereview}
        onChangeText={(text) => setForm((prev) => ({ ...prev, titlereview: text }))}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="เนื้อหารีวิว (สั้นๆ)"
        placeholderTextColor="#656161"
        multiline
        value={form.review}
        onChangeText={(text) => setForm((prev) => ({ ...prev, review: text }))}
      />

      <Text style={styles.label}>ให้คะแนนร้าน</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setForm((prev) => ({ ...prev, rating: num }))}>
            <Text style={[styles.star, num <= form.rating && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.imageContainer}>
        <ImagePickerComponent
          image={form.image}
          pickImage={pickImage}
          width={54}
          height={52}
          style={{ alignSelf: 'flex-start' }}
        />
      </View>

      <CustomButton title="โพส" backgroundColor="#FDDF1C" onPress={handlePost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
    paddingBottom: 40, // เพิ่มที่ว่างด้านล่างเพื่อให้คอนเทนต์ไม่ซ้อนกับปุ่ม
  },
  input: {
    backgroundColor: "#C9C1C1",
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
    width: '100%',
  },
  textArea: {
    height: 80,
  },
  label: {
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  labelCat: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  checkboxGroup: {
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  checkbox: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  checkboxText: {
    color: "white",
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C9C1C1",
    paddingHorizontal: 5,
    borderRadius: 10,
    width: 200,
    alignSelf: "center",
  },
  star: {
    fontSize: 30,
    color: "white",
    marginRight: 5,
  },
  starActive: {
    color: "gold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
});

export default NewPostScreen;
