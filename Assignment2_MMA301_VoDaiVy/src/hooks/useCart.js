import { useContext, useMemo } from 'react';
import { CartContext } from '../context/CartContext';

export default function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
  }

  const { state, addToCart, removeFromCart, updateQuantity, clearCart, removeByPrice } = context;

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [state.items],
  );

  const formattedTotalPrice = useMemo(
    () =>
      totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }),
    [totalPrice],
  );

  const isEmpty = state.items.length === 0;

  const getItemQuantity = (productId) => {
    const item = state.items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) =>
    state.items.some((i) => i.id === productId);

  return {
    // State
    items:               state.items,
    isEmpty,

    // Computed
    totalItems,
    totalPrice,
    formattedTotalPrice,

    // Helpers
    getItemQuantity,
    isInCart,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    removeByPrice,
  };
}
