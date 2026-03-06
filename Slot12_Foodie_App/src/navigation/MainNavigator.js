import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import EditRecipeScreen from '../screens/EditRecipeScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFC107',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={RecipeDetailScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="AddRecipe"
          component={AddRecipeScreen}
          options={{ title: 'Add Recipe' }}
        />
        <Stack.Screen
          name="EditRecipe"
          component={EditRecipeScreen}
          options={{ title: 'Edit Recipe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}