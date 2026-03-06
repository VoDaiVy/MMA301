import React, { createContext, useState } from 'react';
import { recipes as initialRecipes } from '../data/dummyData';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Add a new recipe to myRecipes
  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      isMyFood: true
    };
    setMyRecipes([...myRecipes, newRecipe]);
  };

  // Delete a recipe from myRecipes
  const deleteRecipe = (id) => {
    setMyRecipes(myRecipes.filter(r => r.id !== id));
    // Also remove from favorites if it's there
    setFavorites(favorites.filter(r => r.id !== id));
  };

  // Edit/Update a recipe in myRecipes
  const editRecipe = (updatedRecipe) => {
    setMyRecipes(myRecipes.map(r =>
      r.id === updatedRecipe.id ? { ...updatedRecipe, isMyFood: true } : r
    ));
    // Update in favorites if it exists there
    setFavorites(favorites.map(r =>
      r.id === updatedRecipe.id ? { ...updatedRecipe, isMyFood: true } : r
    ));
  };

  // Toggle favorite status
  const toggleFavorite = (recipe) => {
    const isFavorite = favorites.some(r => r.id === recipe.id);
    if (isFavorite) {
      setFavorites(favorites.filter(r => r.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  // Check if a recipe is in favorites
  const isFavorite = (recipeId) => {
    return favorites.some(r => r.id === recipeId);
  };

  // Get all recipes (both default and user-created)
  const allRecipes = [...recipes, ...myRecipes];

  return (
    <RecipeContext.Provider value={{
      recipes,
      myRecipes,
      favorites,
      allRecipes,
      addRecipe,
      deleteRecipe,
      editRecipe,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </RecipeContext.Provider>
  );
};