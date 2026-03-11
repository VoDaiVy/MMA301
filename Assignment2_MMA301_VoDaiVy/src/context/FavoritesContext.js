import React, { createContext, useReducer, useCallback } from 'react';

// ─── Action Types ─────────────────────────────────────────────────────────────
export const FAV_ACTIONS = {
  TOGGLE:       'TOGGLE',
  REMOVE:       'REMOVE',
  CLEAR_FAVS:   'CLEAR_FAVS',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function favReducer(state, action) {
  switch (action.type) {
    case FAV_ACTIONS.TOGGLE: {
      const exists = state.items.some((p) => p.id === action.payload.id);
      return {
        ...state,
        items: exists
          ? state.items.filter((p) => p.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }
    case FAV_ACTIONS.REMOVE:
      return { ...state, items: state.items.filter((p) => p.id !== action.payload.id) };

    case FAV_ACTIONS.CLEAR_FAVS:
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const FavoritesContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(favReducer, { items: [] });

  const toggleFavorite = useCallback((product) => {
    dispatch({ type: FAV_ACTIONS.TOGGLE, payload: product });
  }, []);

  const removeFavorite = useCallback((id) => {
    dispatch({ type: FAV_ACTIONS.REMOVE, payload: { id } });
  }, []);

  const clearFavorites = useCallback(() => {
    dispatch({ type: FAV_ACTIONS.CLEAR_FAVS });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ state, toggleFavorite, removeFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
