import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscription } from "../../types/subscription"; // Ensure correct import path

// Define initial state correctly
interface SubscriptionState {
  subscriptionIds: number[];
  selectedSubscriptionIds: number[];
}

const initialState: SubscriptionState = {
  subscriptionIds: [],
  selectedSubscriptionIds: [],
};

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptions(state, action: PayloadAction<number[]>) {
      state.subscriptionIds = action.payload;
    },
    addSelectedSubscription(state, action: PayloadAction<number>) {
      // Prevent duplicates
      const exists = state.selectedSubscriptionIds.some(
        (subId) => subId === action.payload
      );
      if (!exists) {
        state.selectedSubscriptionIds.push(action.payload);
      }
    },
    removeSelectedSubscription(state, action: PayloadAction<number>) {
      state.selectedSubscriptionIds = state.selectedSubscriptionIds.filter(
        (subId) => subId !== action.payload
      );
    },
  },
});

// Export actions
export const {
  setSubscriptions,
  addSelectedSubscription,
  removeSelectedSubscription,
} = subscriptionSlice.actions;

// Export reducer
export default subscriptionSlice.reducer;
