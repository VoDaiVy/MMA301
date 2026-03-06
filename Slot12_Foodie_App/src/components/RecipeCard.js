import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function RecipeCard({ recipe, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        source={{ uri: recipe.image }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>⏱ {recipe.prepTime}</Text>
          <Text style={styles.infoText}>🔥 {recipe.calories} cal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    height: 200,
    width: '100%',
  },
  content: {
    padding: 15,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFC107',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
});