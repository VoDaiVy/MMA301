import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStackNavigator from './navigation/RootStackNavigator';
import { SelectedCarProvider } from './context/SelectedCarContext';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    border: '#e2e8f0',
    primary: '#2563eb'
  }
};

function MobileApp() {
  return (
    <SelectedCarProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={appTheme}>
          <StatusBar style="dark" backgroundColor="#f8fafc" />
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </SelectedCarProvider>
  );
}

export default MobileApp;
