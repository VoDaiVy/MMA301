import React from 'react';
import { StatusBar } from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import { RecipeProvider } from './src/context/RecipeContext';

export default function App() {
  return (
    <RecipeProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <MainNavigator />
    </RecipeProvider>
  );
}