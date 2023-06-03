import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const getPostMe = createAsyncThunk("post/get-post-for-me", async () => {
  try {
    return await axiosInstance.get(`/api/post/get-post-for-me`);
  } catch (error) {
    return error;
  }
});

const initialState = {
  loading: false,
  error: "",
  post: { code: 0, data: {} },
  postOfMe: { code: 0, data: {} },
  postOfFriend: { code: 0, data: {} },
  postDelete: { code: 0, data: {} },
};

const postSlice = createSlice({
  name: "post",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    // get post me
    [`${getPostMe.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getPostMe.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getPostMe.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.postOfMe = action.payload.data;
    },
  },
});
export const { reducer: postReducer } = postSlice;
export default postReducer;
