import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert, Button, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

const MyReviewScreen = ({ route, navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const savedReviews = await AsyncStorage.getItem("reviews");
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews));
        }
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
      }
    };
    loadReviews();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newReview) {
        setReviews((prevReviews) => {
          const isDuplicate = prevReviews.some((rev) => rev.titlereview === route.params.newReview.titlereview);
          if (isDuplicate) return prevReviews;

          const updatedReviews = [route.params.newReview, ...prevReviews];
          AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews)).catch((error) =>
            console.error("บันทึกข้อมูลล้มเหลว:", error)
          );

          return updatedReviews;
        });

        navigation.setParams({ newReview: null });
      }
    }, [route.params?.newReview])
  );

  const deleteReview = async (index) => {
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);
    await AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews));
  };

  const editItem = (index) => {
    const selectedReview = reviews[index];
    setSelectedItem(index);
    setForm({
      place: selectedReview.place || "",
      titlereview: selectedReview.titlereview || "",
      review: selectedReview.review || "",
      rating: selectedReview.rating || 0,
      image: selectedReview.image || null,
      categories: selectedReview.categories || { food: false, bakery: false, coffee: false, cafe: false },
    });
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!form.place.trim() || !form.titlereview.trim() || !form.review.trim()) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const updatedReviews = [...reviews];
    updatedReviews[selectedItem] = { ...form };
    setReviews(updatedReviews);
    await AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setModalVisible(false);
  };

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

  const handleStarPressInModal = (selectedRating) => {
    setForm((prev) => ({ ...prev, rating: selectedRating }));
  };

  const handleStarPressInList = (index, selectedRating) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].rating = selectedRating;
    setReviews(updatedReviews);
    AsyncStorage.setItem("reviews", JSON.stringify(updatedReviews));
  };

  const renderStars = (rating, isEditable = false, onStarPress = () => {}) => {
    return [1, 2, 3, 4, 5].map((num) => (
      <TouchableOpacity key={num} onPress={() => isEditable && onStarPress(num)}>
        <Text style={[styles.star, num <= rating && styles.starActive]}>
          ★
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ReviewDetail", { review: item })}>
            <View style={styles.reviewItem}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
              <View style={styles.detailsContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.place}</Text>
                  <TouchableOpacity onPress={() => editItem(index)} style={styles.editIcon}>
                    <Ionicons name="create-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* แสดงหมวดหมู่ที่เลือก */}
                <View style={styles.categoryContainer}>
                  {Object.keys(item.categories).map((key) => (
                    item.categories[key] && (
                      <Text key={key} style={styles.categoryText}>
                        {key === "food" ? "ร้านอาหาร" :
                        key === "bakery" ? "ร้านเบเกอรี่" :
                        key === "coffee" ? "ร้านกาแฟ/ชา" :
                        "คาเฟ่"}
                      </Text>
                    )
                  ))}
                </View>
                <View style={styles.starContainer}>
                  {renderStars(item.rating, true, (selectedRating) => handleStarPressInList(index, selectedRating))}
                </View>

                <Text style={styles.review}>{item.titlereview}</Text>

              </View>

              <TouchableOpacity onPress={() => deleteReview(index)} style={styles.deleteIcon}>
                <Ionicons name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="ชื่อร้าน"
            value={form.place}
            onChangeText={(text) => setForm((prev) => ({ ...prev, place: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="หัวข้อรีวิว"
            value={form.titlereview}
            onChangeText={(text) => setForm((prev) => ({ ...prev, titlereview: text }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="เนื้อหารีวิว"
            value={form.review}
            onChangeText={(text) => setForm((prev) => ({ ...prev, review: text }))}
            multiline
          />

          <Text style={styles.label}>ให้คะแนนร้าน</Text>
          <View style={styles.starContainer}>
            {renderStars(form.rating, true, handleStarPressInModal)}
          </View>

          <View style={styles.checkboxGroup}>
            <Text style={styles.labelCat}>หมวดหมู่</Text>
            <View style={styles.checkboxRow}>
              {Object.keys(form.categories).map((key) => (
                <TouchableOpacity key={key} style={styles.checkboxContainer} onPress={() => toggleCategory(key)}>
                  <Text style={styles.checkbox}>{form.categories[key] ? "☑" : "☐"}</Text>
                  <Text style={styles.checkboxText}>
                    {key === "food" ? "ร้านอาหาร" :
                    key === "bakery" ? "ร้านเบเกอรี่" :
                    key === "coffee" ? "ร้านกาแฟ/ชา" :
                    "คาเฟ่"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={pickImage} style={styles.input}>
            <Text style={styles.buttonText}>📷 เลือกภาพ</Text>
          </TouchableOpacity>
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
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: "#343333",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    position: "relative",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  editIcon: {
    marginLeft: 5,
  },
  categoryText:{
    fontSize: 14,
    color: "white",
  },
  review: {
    fontSize: 14,
    color: "white",
  },
  label: {
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  star: {
    fontSize: 20,
    color: "white",
    marginRight: 3,
  },
  starActive: {
    color: "gold",
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
    marginBottom: 10
  },
  checkbox: {
    fontSize: 18,
    color: "white",
    marginRight: 5,
  },
  checkboxText: {
    color: "white",
  },
  labelCat: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
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
    height: 80,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  buttonText: {
    color: "#1a1a1a",
  },
});

export default MyReviewScreen;
