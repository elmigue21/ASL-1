import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import SubscriptionSlice from './slices/subscriptionSlice';
import EmailWindowSlice from './slices/emailWindowSlice'

export const store = configureStore({
  reducer: {
    SubscriptionSlice,
    EmailWindowSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
