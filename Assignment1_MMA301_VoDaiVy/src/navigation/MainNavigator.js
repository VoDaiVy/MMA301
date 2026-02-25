// src/navigation/MainNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import 6 màn hình vừa tạo
import HomeScreen from '../screens/HomeScreen';
import RoomListScreen from '../screens/RoomListScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import BookingFormScreen from '../screens/BookingFormScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useApp } from '../context/AppContext';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { theme } = useApp(); // Lấy theme từ Context để chỉnh màu Header

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.card }, // Màu nền Header
          headerTintColor: theme.text, // Màu chữ Header
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyle: { backgroundColor: theme.background }, // Màu nền App
        }}
        initialRouteName="Home"
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'FPTU Booking', headerShown: false }} // Ẩn header ở trang chủ cho đẹp
        />
        <Stack.Screen 
          name="RoomList" 
          component={RoomListScreen} 
          options={{ title: 'Danh sách phòng' }}
        />
        <Stack.Screen 
          name="RoomDetail" 
          component={RoomDetailScreen} 
          options={{ title: 'Chi tiết phòng' }}
        />
        <Stack.Screen 
          name="BookingForm" 
          component={BookingFormScreen} 
          options={{ title: 'Đặt phòng' }}
        />
        <Stack.Screen 
          name="MyBookings" 
          component={MyBookingsScreen} 
          options={{ title: 'Lịch sử đặt phòng' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Cài đặt' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;