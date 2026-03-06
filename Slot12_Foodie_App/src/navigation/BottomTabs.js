import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MyFoodScreen from '../screens/MyFoodScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="home" size={focused ? 30 : 26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="favorite" size={focused ? 30 : 26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyFood"
        component={MyFoodScreen}
        options={{
          tabBarLabel: 'My Food',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="restaurant" size={focused ? 30 : 26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}