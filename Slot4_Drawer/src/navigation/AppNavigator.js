import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import các màn hình từ thư mục screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#0891b2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: '#0891b2',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home', drawerLabel: 'Home' }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile', drawerLabel: 'Profile' }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings', drawerLabel: 'Settings' }} 
      />
    </Drawer.Navigator>
  );
}