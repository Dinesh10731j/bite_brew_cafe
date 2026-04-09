import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  menuItemId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string | null;
};

type CartState = {
  items: CartItem[];
  totalPrice: number;
};

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

const calculateTotalPrice = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity * item.price, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find((item) => item.menuItemId === action.payload.menuItemId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalPrice = calculateTotalPrice(state.items);
    },
    increaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((cartItem) => cartItem.menuItemId === action.payload);
      if (item) {
        item.quantity += 1;
      }
      state.totalPrice = calculateTotalPrice(state.items);
    },
    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((cartItem) => cartItem.menuItemId === action.payload);
      if (item) {
        item.quantity -= 1;
      }
      state.items = state.items.filter((cartItem) => cartItem.quantity > 0);
      state.totalPrice = calculateTotalPrice(state.items);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.menuItemId !== action.payload);
      state.totalPrice = calculateTotalPrice(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addItem, increaseQuantity, decreaseQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
