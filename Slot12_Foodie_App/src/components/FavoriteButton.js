import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RecipeContext } from '../context/RecipeContext';

export default function FavoriteButton({ recipe, size = 24, style }) {
  const { toggleFavorite, isFavorite } = useContext(RecipeContext);
  const isLiked = isFavorite(recipe.id);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => toggleFavorite(recipe)}
    >
      <MaterialIcons
        name={isLiked ? 'favorite' : 'favorite-border'}
        size={size}
        color={isLiked ? '#f44336' : '#fff'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
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
});