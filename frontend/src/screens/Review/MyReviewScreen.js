import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const MyReviewScreen = ({ route }) => {
  const [reviews, setReviews] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newReview) {
        setReviews((prevReviews) => [route.params.newReview, ...prevReviews]);
      }
    }, [route.params?.newReview])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.title}>{item.titlereview}</Text>
            <Text>📍 {item.place}</Text>
            <Text>{item.review}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  reviewItem: { backgroundColor: "#C9C1C1", padding: 10, marginBottom: 10, borderRadius: 10 },
  title: { fontWeight: "bold", fontSize: 16 },
  date: { fontSize: 12, color: "gray" },
});

export default MyReviewScreen;
