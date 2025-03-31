import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const DetailReviewScreen = ({ route }) => {
  const { review } = route.params; // รับข้อมูลรีวิวจาก navigation

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {review.image && <Image source={{ uri: review.image }} style={styles.image} />}
      <View style={styles.containerText}>
        <Text>
        <Text style={styles.title}>{review.place} | </Text>
        <Text style={styles.category}>
          {Object.keys(review.categories)
            .filter((key) => review.categories[key])
            .map((key) =>
              key === "food"
                ? "ร้านอาหาร"
                : key === "bakery"
                ? "ร้านเบเกอรี่"
                : key === "coffee"
                ? "กาแฟ"
                : "ร้านกาแฟ/ชา"
            )
            .join(", ")}
        </Text>
        </Text>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Text key={num} style={[styles.star, num <= review.rating && styles.starActive]}>
              ★
            </Text>
          ))}
        </View>

        </View>
        <View style={styles.reviewContainer}>
            <View style={styles.titlereviewContainer}>
                <Text style={styles.titlereview}>{review.titlereview}</Text>
                <Text style={styles.review}>{review.review}</Text>
            </View>
            
        </View>
            
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#1a1a1a",
  },
  image: {
    width: "100%",
    height: 170,
    marginBottom: 10, 
    borderBottomEndRadius: 5,
  },
  containerText: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  category: {
    fontSize: 15,
    color: "white",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 24,
    color: "white",
    marginRight: 2,
  },
  starActive: {
    color: "gold",
  },
  titlereviewContainer: {
    marginTop: 10, 
    paddingLeft: 20,
  },
  reviewContainer: {
    width: "100%", 
    borderTopWidth: 1,
    borderColor: "#343333",
    marginTop: 10, 
    paddingTop: 5, 
  },
  titlereview: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  review: {
    padding: 10,
    fontSize: 16,
    color: "white",
  },
});

export default DetailReviewScreen;
