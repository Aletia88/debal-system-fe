import { configureStore } from '@reduxjs/toolkit';
// import { ItemsApi } from './items';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // [ItemsApi.reducerPath]: ItemsApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      
      // ItemsApi.middleware,
     
      // Add your custom authMiddleware here
     
    ]),
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
