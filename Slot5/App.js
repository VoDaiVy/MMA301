import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext'; 
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}