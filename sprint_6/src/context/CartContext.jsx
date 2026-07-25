import { createContext, useContext, useReducer, useEffect } from 'react'

const STORE_KEY = 'shopzone_cart_v1'

const initial = {
  cartItems: [],
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {

    case 'INIT_CART':
      return { ...state, cartItems: action.payload }

    case 'ADD_TO_CART': {
      const existing = state.cartItems.find(item => item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      }

    case 'INCREMENT_QTY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }

    case 'DECREMENT_QTY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      }

    case 'CLEAR_CART':
      return { ...state, cartItems: [] }

    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    const saved = load()
    if (saved.length > 0) {
      dispatch({ type: 'INIT_CART', payload: saved })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(state.cartItems))
  }, [state.cartItems])

  const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const value = {
    cartItems: state.cartItems,
    totalItems,
    totalPrice,
    dispatch,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return ctx
}
