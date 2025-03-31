import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewCard = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <Text style={styles.noReviewsText}>ไม่มีรีวิว</Text>;
  }

  return (
    <View style={styles.reviewsContainer}>
      <Text style={styles.sectionTitle}>รีวิวจากผู้ใช้:</Text>
      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewItem}>
          <View style={styles.reviewProfileContainer}>
            <View style={styles.reviewProfileImage}>
              <Ionicons name="person-circle" size={40} color="#FF8A02" />
            </View>
            <View>
              <Text style={styles.reviewAuthor}>{review.source}</Text>
              <Text style={styles.reviewRating}>{Array(review.rating).fill('⭐').join('')}</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>{review.snippet}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewsContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  reviewItem: {
    backgroundColor: '#2E2E2E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF8A02',
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 10,
    color: 'lightgreen',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#fff',
  },
  noReviewsText: {
    color: '#fff',
    paddingHorizontal: 15,
    marginTop: 10,
  },
});

export default ReviewCard;
