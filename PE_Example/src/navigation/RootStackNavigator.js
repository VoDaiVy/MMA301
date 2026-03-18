import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import CarDetailScreen from '../screens/CarDetailScreen';

const Stack = createNativeStackNavigator();

function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff'
        },
        headerTitleStyle: {
          color: '#0f172a',
          fontWeight: '700'
        },
        headerTintColor: '#0f172a'
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CarDetail"
        component={CarDetailScreen}
        options={{ title: 'View Details' }}
      />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
