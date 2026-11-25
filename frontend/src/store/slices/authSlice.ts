import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import type { UserResponse } from "@/types/auth";
import { getMe } from "@/api/modules/authApi";
import type { RootState } from "@/store";

interface AuthError {
  status: number | null;
  message: string;
}

interface AuthState {
  user: UserResponse | null;
  loading: boolean;
  authChecked: boolean;
  error: string | null;
  errorStatus: number | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  authChecked: false,
  error: null,
  errorStatus: null,
};

export const fetchCurrentUser = createAsyncThunk<
  UserResponse,
  void,
  {
    state: RootState;
    rejectValue: AuthError;
  }
>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getMe();
    } catch (error: unknown) {
      const status = axios.isAxiosError(error)
        ? (error.response?.status ?? null)
        : null;

      const detail = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : null;

      return rejectWithValue({
        status,
        message:
          typeof detail === "string"
            ? detail
            : status === null
              ? "Unable to connect to the server. Please try again."
              : "Unable to verify your session. Please try again.",
      });
    }
  },
  {
    condition: (_, { getState }) => {
      return !getState().auth.loading;
    },
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.authChecked = true;
      state.error = null;
      state.errorStatus = null;
    },

    setUser(state, action: PayloadAction<UserResponse>) {
      state.user = action.payload;
    },

    markAuthChecked(state) {
      state.authChecked = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorStatus = null;
        state.authChecked = false;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
        state.error = null;
        state.errorStatus = null;
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.authChecked = true;

        const status = action.payload?.status ?? null;

        if (status === 401) {
          state.user = null;
          state.error = null;
          state.errorStatus = 401;
          return;
        }

        state.error = action.payload?.message ?? "Failed to fetch user";

        state.errorStatus = status;
      });
  },
});

export const { clearAuth, setUser, markAuthChecked } = authSlice.actions;

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    dispatch(clearAuth());
  },
);

export default authSlice.reducer;
