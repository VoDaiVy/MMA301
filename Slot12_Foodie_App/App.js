import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { RecipeProvider }
from './src/context/RecipeContext';

export default function App() {
  return (
    <RecipeProvider>
      <MainNavigator/>
    </RecipeProvider>
  );
}