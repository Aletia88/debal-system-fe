import { configureStore } from '@reduxjs/toolkit';
import { ProfileApi } from './profile';
import { ChatApi } from './chat';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      
      ChatApi.middleware,
      ProfileApi.middleware,
     
      // Add your custom authMiddleware here
     
    ]),
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
