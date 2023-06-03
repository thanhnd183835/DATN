import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const getFollowers = createAsyncThunk("user/get-followers", async () => {
  try {
    return await axiosInstance.get(`/api/users/get-all-follower`);
  } catch (error) {
    throw error;
  }
});
export const getFollowing = createAsyncThunk("user/get-following", async () => {
  try {
    return await axiosInstance.get(`/api/users/get-all-following`);
  } catch (error) {
    throw error;
  }
});
const initialState = {
  loading: false,
  error: "",
  user: { code: 0, data: {} },
  userSuggest: { code: 0, data: {} },
  followers: { code: 0, data: {} },
  following: { code: 0, data: {} },
  searchUser: { code: 0, data: {} },
  profileFriend: { code: 0, data: {} },
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  extraReducers: {
    // list follower
    [`${getFollowers.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getFollowers.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getFollowers.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.followers = action.payload;
    },
    // list following
    [`${getFollowing.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getFollowing.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getFollowing.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.following = action.payload;
    },
  },
});
export const { reducer: userReducer } = userSlice;
export default userReducer;
