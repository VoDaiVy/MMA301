// App.js
import 'react-native-gesture-handler'; // Bắt buộc cho Stack Navigator
import React from 'react';
import { AppProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator'; // Chúng ta sẽ tạo ở bước sau
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
      {/* StatusBar tự động chỉnh màu theo theme sau này */}
    </AppProvider>
  );
}