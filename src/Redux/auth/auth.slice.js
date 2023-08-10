import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Sevices/config";

export const signUP = createAsyncThunk("auth/sign-up", async (body) => {
  try {
    return await axiosInstance.post(`api/auth/sign-up`, body);
  } catch (error) {
    throw error;
  }
});
export const signIn = createAsyncThunk("auth/sign-in", async (body) => {
  try {
    return await axiosInstance.post(`api/auth/sign-in`, body);
  } catch (error) {
    throw error;
  }
});

export const signInFacebook = createAsyncThunk(
  "auth/facebook",
  async (access_token) => {
    try {
      return await axiosInstance.post(`api/auth/facebook`, access_token);
    } catch (error) {
      throw error;
    }
  }
);
export const signInGoogle = createAsyncThunk(
  "auth/google",
  async (access_token) => {
    try {
      return await axiosInstance.post(`api/auth/google`, access_token);
    } catch (error) {
      throw error;
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    return await axiosInstance.post(`api/auth/logout`);
  } catch (error) {
    throw error;
  }
});
export const getMe = createAsyncThunk("/users/get-me", async () => {
  try {
    return await axiosInstance.get(`/api/users/get-me`);
  } catch (error) {
    console.log(error);
    return error;
  }
});
export const replacePassword = createAsyncThunk(
  "auth/replace-password",
  async (body) => {
    try {
      return await axiosInstance.post(`/api/auth/replace-password`, body);
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  error: "",
  auth: { code: 0, data: {} },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [`${signIn.pending}`]: (state) => {
      state.loading = true;
    },
    //huy
    [`${signIn.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    //hoàn thành
    [`${signIn.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },

    [`${signInFacebook.pending}`]: (state) => {
      state.loading = true;
    },
    //huy
    [`${signInFacebook.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    //hoàn thành
    [`${signInFacebook.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [`${signInGoogle.pending}`]: (state) => {
      state.loading = true;
    },
    //huy
    [`${signInGoogle.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    //hoàn thành
    [`${signInGoogle.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    //logout
    [`${logout.pending}`]: (state) => {
      state.loading = true;
    },
    [`${logout.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${logout.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [`${getMe.pending}`]: (state) => {
      state.loading = true;
    },
    [`${getMe.rejected}`]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [`${getMe.fulfilled}`]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
  },
});

export const { reducer: authReducer } = authSlice;
export default authReducer;
