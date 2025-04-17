import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: any; // Adjust to the specific structure of your user object
  error: string | null;
  video_request_number: any,
  
}

// Safely access localStorage on the client side
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

const getAuthUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("AuthUser");
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error("Error parsing AuthUser:", error);
        return null;
      }
    }
  }
  return null;
};

// Initialize state from localStorage for persistence
const initialState: AuthState = {
  isAuthenticated: Boolean(getAccessToken()),
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  user: getAuthUser(),
  error: null,
  video_request_number: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: any;
      }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.error = null;

      // Store data in localStorage
      if (typeof window !== "undefined") {
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
        if (action.payload.user) {
          localStorage.setItem("AuthUser", JSON.stringify(action.payload.user));
        }
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.error = action.payload;

      // Clear localStorage on failure
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("AuthUser");
      }
      
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.error = null;

      // Clear all localStorage data on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("AuthUser");
      }
    },
    setAuthTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Update tokens in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
  },
});

export const { loginSuccess, loginFailure, logout, setAuthTokens } =
  authSlice.actions;
export default authSlice.reducer;
