import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import SubscriptionSlice from './slices/subscriptionSlice';
import PaginationSlice from './slices/tablePaginationSlice';

export const store = configureStore({
  reducer: {
    SubscriptionSlice,
    PaginationSlice,
  },
});

// Types for use in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
