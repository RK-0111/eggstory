import { createContext, useContext, useMemo, useReducer } from 'react';

/**
 * Cart state lives here. Any component can call useCart() to read the
 * cart or change it — no prop drilling, easy to extend (coupons,
 * delivery slots, etc. would be new actions in the reducer).
 */

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      const items = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { product: action.product, quantity: 1 }];
      return { ...state, items, isOpen: true };
    }
    case 'SET_QTY': {
      const items = state.items
        .map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.max(0, action.quantity) }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case 'SYNC_PRODUCTS': {
      const productsById = new Map(action.products.map((product) => [product.id, product]));
      const items = state.items.map((item) => {
        const latestProduct = productsById.get(item.product.id);
        return latestProduct ? { ...item, product: latestProduct } : item;
      });
      return { ...state, items };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const value = useMemo(() => {
    const totalPaise = state.items.reduce(
      (sum, i) => sum + i.product.pricePaise * i.quantity,
      0
    );
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      items: state.items,
      isOpen: state.isOpen,
      totalPaise,
      count,
      addItem: (product) => dispatch({ type: 'ADD', product }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QTY', productId, quantity }),
      removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
      syncProducts: (products) => dispatch({ type: 'SYNC_PRODUCTS', products }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
