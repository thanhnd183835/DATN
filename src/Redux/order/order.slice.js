import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const createOrder = createAsyncThunk(
  "order/create-order",
  async (body) => {
    try {
      return await axiosInstance.post(`api/order/create-order`, body);
    } catch (error) {
      throw error;
    }
  }
);
export const agreeItemOrder = createAsyncThunk(
  "order/agree-item-order",
  async (body) => {
    try {
      return await axiosInstance.post(`api/order/agree-item-order`, body);
    } catch (error) {
      throw error;
    }
  }
);
export const refuseItemOrder = createAsyncThunk(
  "order/refuse-item-order",
  async (body) => {
    try {
      return await axiosInstance.post(`api/order/refuse-item-order`, body);
    } catch (error) {
      throw error;
    }
  }
);
const initialState = {
  loading: false,
  error: "",
};
const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [`${refuseItemOrder.pending}`]: (state) => {
      state.loading = true;
    },
    [`${refuseItemOrder.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${refuseItemOrder.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.itemOrder = action.payload.data;
    },
  },
});
export const { reducer: orderReducer } = orderSlice;
export default orderReducer;
