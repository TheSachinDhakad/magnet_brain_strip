import { createSlice } from "@reduxjs/toolkit";

const cartReducer = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    clearCart: (state) => {
      state.length = 0;
    },

    addProduct: (state, action) => {
      const existingItem = state.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeProduct: (state, action) => {
      const itemIndex = state.findIndex(
        (item) => item._id === action.payload._id
      );

      if (itemIndex !== -1) {
        if (state[itemIndex].quantity > 1) {
          state[itemIndex].quantity -= 1;
        } else {
          state.splice(itemIndex, 1);
        }
      }
    },
  },
});

export const { addProduct, removeProduct, clearCart } = cartReducer.actions;

export default cartReducer.reducer;
