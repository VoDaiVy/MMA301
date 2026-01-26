import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTab = () => {
  const { totalQuantity } = useCart(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Shop') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Shop" component={ShopScreen} options={{ title: 'Cửa hàng' }} />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ 
          title: 'Giỏ hàng',
          tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined 
        }} 
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? <MainTab /> : <AuthStack />}
    </NavigationContainer>
  );
}