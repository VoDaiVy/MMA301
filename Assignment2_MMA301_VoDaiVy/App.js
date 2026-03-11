import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CartProvider } from './src/context/CartContext';
import useCart from './src/hooks/useCart';

import ProductListScreen  from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen          from './src/screens/CartScreen';

import { COLORS, FONT_SIZES, FONT_WEIGHTS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

// ─── Cart Icon Button ─────────────────────────────────────────────────────────
// Wrapped in its own component so it can consume useCart inside CartProvider
function CartHeaderButton({ navigation }) {
  const { totalItems } = useCart();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}
      style={styles.cartBtn}
      activeOpacity={0.7}
    >
      <View style={styles.cartIconWrap}>
        <Text style={styles.cartIcon}>🛒</Text>
      </View>
      {totalItems > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // ── Flat header styling ──────────────────────────────────────────────
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerShadowVisible: false,       // removes the bottom border / shadow → flat design
        headerTitleStyle: {
          fontSize: FONT_SIZES.lg,
          fontWeight: FONT_WEIGHTS.bold,
          color: COLORS.textPrimary,
          letterSpacing: 0.2,
        },
        headerTintColor: COLORS.primary,  // back-arrow colour
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        // ── Cart icon on every screen ────────────────────────────────────────
        headerRight: () => <CartHeaderButton navigation={navigation} />,
      })}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Shop' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params?.product?.name ?? 'Detail' })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'My Cart', headerRight: () => null }}
      />
    </Stack.Navigator>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={COLORS.surface} />
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  cartBtn: {
    marginRight: 4,
    position: 'relative',
    padding: 4,
  },
  cartIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 19,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 10,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
