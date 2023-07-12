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
export const editProfile = createAsyncThunk(
  "user/edit-profile",
  async (body) => {
    try {
      return await axiosInstance.post(`/api/users/edit-profile`, body);
    } catch (error) {
      throw error;
    }
  }
);
export const followApi = createAsyncThunk("user/follow", async (params) => {
  try {
    return await axiosInstance.post(`/api/users/follow/${params}`);
  } catch (error) {
    throw error;
  }
});
export const unFollowApi = createAsyncThunk(
  "user/un-follow",
  async (params) => {
    try {
      return await axiosInstance.post(`/api/users/un-follow/${params}`);
    } catch (error) {
      throw error;
    }
  }
);
export const getProfileFriend = createAsyncThunk(
  "users/get-profile-friend",
  async (id) => {
    try {
      return await axiosInstance.get(`/api/users/profile-friend/${id}`);
    } catch (error) {
      throw error;
    }
  }
);
export const confirmSalePoint = createAsyncThunk(
  "users/confirm-sale-point",
  async (params) => {
    try {
      return await axiosInstance.post(
        `/api/users/confirm-sale-point/${params}`
      );
    } catch (error) {
      throw error;
    }
  }
);
export const cancelSell = createAsyncThunk(
  "users/cancel-sell",
  async (params) => {
    try {
      return await axiosInstance.post(`/api/users/cancel-sell/${params}`);
    } catch (error) {
      throw error;
    }
  }
);
export const sendEmail = createAsyncThunk("users/send-email", async (body) => {
  try {
    return await axiosInstance.post(`/api/users/send-email`, body);
  } catch (error) {
    throw error;
  }
});
const initialState = {
  loading: false,
  error: "",
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
    [`${editProfile.pending}`]: (state) => {
      state.loading = true;
    },
    [`${editProfile.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${editProfile.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    //follow user
    [`${followApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${followApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${followApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.following = action.payload;
    },
    //unfollow user
    [`${unFollowApi.pending}`]: (state) => {
      state.loading = true;
    },
    [`${unFollowApi.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${unFollowApi.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.following = action.payload;
    },
    // get profile friends
    [`${getProfileFriend.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getProfileFriend.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getProfileFriend.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.profileFriend = action.payload;
    },
  },
});
export const { reducer: userReducer } = userSlice;
export default userReducer;
