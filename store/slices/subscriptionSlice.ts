import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscription } from "../../types/subscription"; // Ensure correct import path
import { Email } from "@/types/email";

// Define initial state correctly
interface SubscriptionState {
  subscriptionIds: number[];
  selectedSubscriptionIds: Email[];
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
    addSelectedSubscription(state, action: PayloadAction<Email>) {
      // Prevent duplicates
      const exists = state.selectedSubscriptionIds.some(
        (subId) => subId === action.payload
      );
      if (!exists) {
        state.selectedSubscriptionIds.push(action.payload);
      }
    },
    removeSelectedSubscription(state, action: PayloadAction<Email>) {
      state.selectedSubscriptionIds = state.selectedSubscriptionIds.filter(
        (sub) => sub.id !== action.payload.id
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
