import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function CategoryBar({ selected, setSelected }) {
  const categories = [
    'All',
    'My Food',
    'My Favorites',
    'Beef',
    'Chicken',
    'Dessert',
    'Salad',
    'Pasta'
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelected(cat)}
            style={[
              styles.categoryButton,
              selected === cat && styles.categoryButtonActive
            ]}
          >
            <Text style={[
              styles.categoryText,
              selected === cat && styles.categoryTextActive
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});