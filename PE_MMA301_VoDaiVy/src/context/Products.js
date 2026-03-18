export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';

export const INITIAL_PRODUCTS = [
  { id: '1', name: 'Laptop', price: 1250, quantity: 2 },
  { id: '2', name: 'Phone 15', price: 950, quantity: 4 },
  { id: '3', name: 'Headphones', price: 180, quantity: 8 },
  { id: '4', name: 'Smart Watch', price: 240, quantity: 5 },
  { id: '5', name: 'Mechanical Keyboard', price: 140, quantity: 6 },
];

export const addProductAction = (product) => ({
  type: ADD_PRODUCT,
  payload: {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ...product,
  },
});

export const removeProductAction = (productId) => ({
  type: REMOVE_PRODUCT,
  payload: productId,
});

export const productReducer = (state, action) => {
  switch (action.type) {
    case ADD_PRODUCT:
      return [...state, action.payload];
    case REMOVE_PRODUCT:
      return state.filter((product) => product.id !== action.payload);
    default:
      return state;
  }
};
