import React, { createContext, useReducer, useCallback } from 'react';

const initialState = {
  items: [],
};

export const CART_ACTIONS = {
  ADD_TO_CART:      'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY:  'UPDATE_QUANTITY',
  CLEAR_CART:       'CLEAR_CART',
  REMOVE_BY_PRICE:  'REMOVE_BY_PRICE',
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (existingIndex >= 0) {
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity ?? 1) }
            : item,
        );
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity ?? 1 },
        ],
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case CART_ACTIONS.REMOVE_BY_PRICE: {
      const { mode, value, lo, hi } = action.payload;
      const TOLERANCE = 0.20;
      return {
        ...state,
        items: state.items.filter((item) => {
          if (mode === 'range') return !(item.price >= lo && item.price <= hi);
          if (mode === 'under') return !(item.price <= value);
          if (mode === 'over')  return !(item.price >= value);
          return !(
            item.price >= value * (1 - TOLERANCE) &&
            item.price <= value * (1 + TOLERANCE)
          );
        }),
      };
    }

    default:
      return state;
  }
}

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { id } });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  const removeByPrice = useCallback((condition) => {
    dispatch({ type: CART_ACTIONS.REMOVE_BY_PRICE, payload: condition });
  }, []);

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart, removeByPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
