import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import * as ImagePicker from 'expo-image-picker';

const NewPostScreen = () => {
  const [place, setPlace] = useState("");
  const [titlereview, setTitleReview] = useState("");
  const [categories, setCategories] = useState({
    food: false,
    bakery: false,
    coffee: false,
    cafe: false,
  });
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null); // ✅ เพิ่ม state เก็บรูป

  const toggleCategory = (key) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const navigation = useNavigation();

  const handlePost = () => {
  const newReview = {
    place,
    titlereview,
    review,
    rating,
    date: new Date().toLocaleDateString(), // ✅ เพิ่มวันที่
  };

  navigation.navigate('รีวิวของฉัน', { newReview });
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="สถานที่" 
        placeholderTextColor="#656161"
        value={place}
        onChangeText={setPlace}
      />

      <View style={styles.checkboxGroup}>
        {["food", "bakery", "coffee", "cafe"].map((key) => (
          <TouchableOpacity key={key} style={styles.checkboxContainer} onPress={() => toggleCategory(key)}>
            <Text style={styles.checkbox}>{categories[key] ? "☑" : "☐"}</Text>
            <Text style={styles.checkboxText}>
              {key === "food" ? "ร้านอาหาร" : key === "bakery" ? "ร้านเบเกอรี่" : key === "coffee" ? "กาแฟ" : "ร้านกาแฟ/ชา"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="หัวข้อรีวิว" 
        placeholderTextColor="#656161"
        value={titlereview}
        onChangeText={setTitleReview}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="เนื้อหารีวิว (สั้นๆ)"
        placeholderTextColor="#656161"
        multiline
        value={review}
        onChangeText={setReview}
      />
    
      <Text style={styles.label}>ให้คะแนนร้าน</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Text style={[styles.star, num <= rating && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* กล่องเลือกรูปภาพ */}
      <View style={styles.imageContainer}>
        <ImagePickerComponent 
          image={image} 
          pickImage={pickImage} 
          width={54} // กำหนดขนาดตามต้องการ
          height={52}
          style={{ alignSelf: 'flex-start' }} // ปรับตำแหน่ง
        />
      </View>

      <CustomButton
        title="โพส"
        backgroundColor="#FDDF1C"
        onPress={handlePost}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#1a1a1a", 
    padding: 20 
  },
  input: { 
    backgroundColor: "#C9C1C1", 
    padding: 10, 
    borderRadius: 25, 
    marginBottom: 10 
  },
  textArea: { 
    height: 80
  },
  label: { 
    color: "white", 
    marginBottom: 5,
    textAlign: "center",
  },
  checkboxGroup: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" // จัดเรียงให้เว้นระยะ
  },
  checkboxContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    width: "48%", // ทำให้แต่ละอันกว้าง 48% ของหน้าจอ (2 อันต่อแถว)
    marginBottom: 10
  },
  checkbox: { 
    color: "white", 
    fontSize: 16, 
    marginRight: 10 
  },
  checkboxText: { 
    color: "white" 
  },
  starContainer: { 
    flexDirection: "row", 
    marginBottom: 10,
    justifyContent: "center",  // จัดตำแหน่งกลางแนวนอน
    alignItems: "center",      // จัดตำแหน่งกลางแนวตั้ง
    backgroundColor: "#C9C1C1",
    paddingHorizontal: 5,      // เพิ่มช่องว่างด้านข้างให้กับคอนเทนเนอร์
    borderRadius: 10, 
    width: 200, 
    alignSelf: "center",       // ทำให้คอนเทนเนอร์อยู่กลางหน้าจอ
  },
  
  star: { 
    fontSize: 30, 
    color: "gray", 
    marginRight: 5 
  },
  starActive: { 
    color: "gold" 
  },
  imageContainer: { 
    alignItems: "center", 
    marginBottom: 10 
  },
});

export default NewPostScreen;
