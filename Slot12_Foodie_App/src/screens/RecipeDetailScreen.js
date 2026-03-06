import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeContext } from '../context/RecipeContext';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.35;

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const { toggleFavorite, isFavorite } = useContext(RecipeContext);

  const isLiked = isFavorite(recipe.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Image Section with Overlays */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />

        {/* Safe Area for Top Buttons */}
        <SafeAreaView style={styles.topButtonsContainer} edges={['top']}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(recipe)}
          >
            <Text style={styles.favoriteIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipe Name */}
        <Text style={styles.recipeName}>{recipe.name}</Text>

        {/* Category */}
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱</Text>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🍽</Text>
            <Text style={styles.infoLabel}>Servings</Text>
            <Text style={styles.infoValue}>{recipe.servings}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔥</Text>
            <Text style={styles.infoLabel}>Calories</Text>
            <Text style={styles.infoValue}>{recipe.calories}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📊</Text>
            <Text style={styles.infoLabel}>Difficulty</Text>
            <Text style={styles.infoValue}>{recipe.difficulty}</Text>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: width,
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFC107',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredientsList: {
    backgroundColor: '#fefefe',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  instructionsList: {
    backgroundColor: '#fefefe',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    lineHeight: 24,
  },
});