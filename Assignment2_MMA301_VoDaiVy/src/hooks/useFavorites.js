import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

export default function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a <FavoritesProvider>');
  }

  const { state, toggleFavorite, removeFavorite, clearFavorites } = context;

  const isFavorite = (productId) => state.items.some((p) => p.id === productId);

  return {
    favorites:      state.items,
    totalFavorites: state.items.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
}
