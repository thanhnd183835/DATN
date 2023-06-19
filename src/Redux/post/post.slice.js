import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const getPostMe = createAsyncThunk("post/get-post-for-me", async () => {
  try {
    return await axiosInstance.get(`/api/post/get-post-for-me`);
  } catch (error) {
    return error;
  }
});
export const reactApi = createAsyncThunk("post/like", async (params) => {
  try {
    return await axiosInstance.post(`/api/post/like/${params}`);
  } catch (error) {
    return error;
  }
});
export const getPostFriend = createAsyncThunk(
  "post/get-post-for-friend",
  async (id) => {
    try {
      return await axiosInstance.get(`/api/post/get-post-for-friend/${id}`);
    } catch (error) {
      return error;
    }
  }
);
export const getListUserLiked = createAsyncThunk(
  "post/get-users-liked",
  async (postId) => {
    try {
      return await axiosInstance.get(`/api/post/get-users-liked/${postId}`);
    } catch (error) {
      return error;
    }
  }
);
export const commentApi = createAsyncThunk("post/comment", async (data) => {
  try {
    const { postId, userId, content } = await data;
    return await axiosInstance.post(`/api/post/comment/${postId}`, {
      userId,
      content,
    });
  } catch (error) {
    return error;
  }
});
export const deletePost = createAsyncThunk(
  "post/delete-post",
  async (idPost) => {
    try {
      return await axiosInstance.post(`/api/post/delete-post/${idPost}`);
    } catch (error) {
      return error;
    }
  }
);
const initialState = {
  loading: false,
  error: "",
  post: { code: 0, data: {} },
  postOfMe: { code: 0, data: [] },
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
    [`${getPostFriend.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getPostFriend.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getPostFriend.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.postOfFriend = action.payload.data;
    },
  },
});
export const { reducer: postReducer } = postSlice;
export default postReducer;
