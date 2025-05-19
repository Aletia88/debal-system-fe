import { configureStore } from '@reduxjs/toolkit';
import { ProfileApi } from './profile';
import { HouseApi } from './houseListing';
import { ChatApi } from './chat';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [HouseApi.reducerPath]: HouseApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      
      ChatApi.middleware,
      ProfileApi.middleware,
      HouseApi.middleware,
     
      // Add your custom authMiddleware here
     
    ]),
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
