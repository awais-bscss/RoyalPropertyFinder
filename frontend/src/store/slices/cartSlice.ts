import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedPromo: string | null;
  discountRate: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  appliedPromo: null,
  discountRate: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // If bundle promo is applied and a bundle item is removed, cancel the discount
      if (state.appliedPromo === "ROYAL30") {
        const bundleIds = [1, 2, 5];
        if (bundleIds.includes(action.payload)) {
          state.appliedPromo = null;
          state.discountRate = 0;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedPromo = null;
      state.discountRate = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    applyPromo: (state, action: PayloadAction<{ code: string; rate: number }>) => {
      state.appliedPromo = action.payload.code;
      state.discountRate = action.payload.rate;
    },
    clearPromo: (state) => {
      state.appliedPromo = null;
      state.discountRate = 0;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  clearCart, 
  toggleCart, 
  setCartOpen, 
  applyPromo, 
  clearPromo 
} = cartSlice.actions;
export default cartSlice.reducer;
