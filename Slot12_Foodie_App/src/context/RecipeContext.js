import React, { createContext, useState } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {

  const [recipes, setRecipes] = useState([
    {
      id: '1',
      name: 'Pizza',
      image: 'https://picsum.photos/400',
      ingredients: ['Cheese', 'Flour', 'Tomato'],
      steps: ['Prepare dough', 'Add topping', 'Bake 20 mins'],
      time: '30 mins',
      servings: 2,
      calories: 500,
      difficulty: 'Easy',
      isMyFood: false
    }
  ]);

  const [favorites, setFavorites] = useState([]);

  const addRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const editRecipe = (updated) => {
    setRecipes(recipes.map(r =>
      r.id === updated.id ? updated : r
    ));
  };

  const toggleFavorite = (recipe) => {
    if (favorites.find(r => r.id === recipe.id)) {
      setFavorites(favorites.filter(r => r.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      favorites,
      addRecipe,
      deleteRecipe,
      editRecipe,
      toggleFavorite
    }}>
      {children}
    </RecipeContext.Provider>
  );
};