import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeContext } from '../context/RecipeContext';

export default function MyFoodScreen({ navigation }) {
  const { myRecipes, deleteRecipe } = useContext(RecipeContext);

  const handleDelete = (recipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecipe(recipe.id),
        },
      ]
    );
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <TouchableOpacity
        style={styles.recipeContent}
        onPress={() => navigation.navigate('Details', { recipe: item })}
      >
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.name}</Text>
          {item.category && (
            <Text style={styles.categoryText}>{item.category}</Text>
          )}
          <Text style={styles.detailsText}>
            ⏱ {item.prepTime} • 🔥 {item.calories} cal
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditRecipe', { recipe: item })}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Recipes</Text>
      </View>

      {/* Add Recipe Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRecipe')}
      >
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>

      {/* Recipe List */}
      <FlatList
        data={myRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👨‍🍳</Text>
            <Text style={styles.emptyText}>No recipes yet</Text>
            <Text style={styles.emptySubtext}>
              Start creating your own delicious recipes!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC107',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recipeContent: {
    flexDirection: 'row',
    padding: 15,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFC107',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 13,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#f8f8f8',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f8f8f8',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f44336',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});