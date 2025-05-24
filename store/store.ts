import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import SubscriptionSlice from './slices/subscriptionSlice';
import EmailWindowSlice from './slices/emailWindowSlice'
import userInfoReducer from './slices/userInfoSlice';

export const store = configureStore({
  reducer: {
    SubscriptionSlice,
    EmailWindowSlice,
    userInfo: userInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
