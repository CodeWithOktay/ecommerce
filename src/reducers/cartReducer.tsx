import { CartAction, CartState } from '../types';

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items: cartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity: 1 }];
      }
      const { totalItems, totalPrice } = calculateTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_FROM_CART': {
      const productId = action.payload;
      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    }
    case 'UPDATE_QUANTITY': {
      const { producId, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, {
          type: 'REMOVE_FROM_CART',
          payload: producId,
        });
      }
      const newItems = state.items.map((item) =>
        item.product.id === producId ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART': {
      return initialCartState;
    }
    case 'LOAD_CART': {
      const items = action.payload;
      const { totalItems, totalPrice } = calculateTotals(items);
      return {
        items,
        totalItems,
        totalPrice,
      };
    }
    default:
        return state;
  }
};
