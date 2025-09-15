import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  token: string | null;
  currentWorkspace: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isAdmin: false,
  token: null,
  currentWorkspace: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; isAdmin: boolean; currentWorkspace: string | null }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.currentWorkspace = action.payload.currentWorkspace;
      state.isAdmin = action.payload.isAdmin;

    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = null;
      state.currentWorkspace = null;

    },
    getToken: (state: any) => {
      return state.token;
    }
  },
});

export const { login, logout, getToken } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.token;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin;

export default authSlice.reducer;
