import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }
from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import EditRecipeScreen from '../screens/EditRecipeScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details"
          component={RecipeDetailScreen} />
        <Stack.Screen name="AddRecipe"
          component={AddRecipeScreen} />
        <Stack.Screen name="EditRecipe"
          component={EditRecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}