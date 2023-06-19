import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const addCart = createAsyncThunk("cart/add-cart", async (body) => {
  try {
    return await axiosInstance.post(`api/cart/add-cart`, body);
  } catch (error) {
    throw error;
  }
});
export const getCartForMe = createAsyncThunk("cart/get-list-cart", async () => {
  try {
    return await axiosInstance.get(`/api/cart/get-list-cart`);
  } catch (error) {
    return error;
  }
});
export const updateQuantity = createAsyncThunk(
  "cart/update-quantity",
  async (body) => {
    try {
      return await axiosInstance.post(`api/cart/update-quantity`, body);
    } catch (error) {
      throw error;
    }
  }
);
export const deleteItemCart = createAsyncThunk(
  "cart/delete-cart",
  async (itemCartId) => {
    try {
      return await axiosInstance.post(`api/cart/delete-cart/${itemCartId}`);
    } catch (error) {
      return error;
    }
  }
);
const initialState = {
  loading: false,
  error: "",
};
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    // get cart me
    [`${getCartForMe.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getCartForMe.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getCartForMe.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.CartOfMe = action.payload.data;
    },
    // add cart
    [`${addCart.pending}`]: (state) => {
      state.loading = true;
    },
    [`${addCart.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${addCart.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.addCart = action.payload.data;
    },
  },
});
export const { reducer: cartReducer } = cartSlice;
export default cartReducer;
