import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const likeNotification = createAsyncThunk(
  "notification/like",
  async (idPost) => {
    try {
      return await axiosInstance.post(`/api/notification/like/${idPost}`);
    } catch (error) {
      throw error;
    }
  }
);
export const followNotification = createAsyncThunk(
  "notification/follow",
  async (idUser) => {
    try {
      return await axiosInstance.post(`/api/notification/follow/${idUser}`);
    } catch (error) {
      throw error;
    }
  }
);
export const commentNotification = createAsyncThunk(
  "notification/comment",
  async (idPost) => {
    try {
      return await axiosInstance.post(`/api/notification/comment/${idPost}`);
    } catch (error) {
      throw error;
    }
  }
);
const initialState = {
  loading: false,
  error: "",
  notification: { code: 0, data: {} },
};
const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {},
  extraReducers: {},
});
export const { reducer: notificationReducer } = notificationSlice;
export default notificationReducer;
