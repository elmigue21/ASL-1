import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscription } from "../../types/subscription"; // Ensure correct import path
import { Email } from "@/types/email";

// Define initial state correctly
interface SubscriptionState {
  subscriptionIds: number[];
  selectedEmails: Email[];
}

const initialState: SubscriptionState = {
  subscriptionIds: [],
  selectedEmails: [],
};

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptions(state, action: PayloadAction<number[]>) {
      state.subscriptionIds = action.payload;
    },
    addSelectedEmails(state, action: PayloadAction<Email>) {
      // Prevent duplicates
      const exists = state.selectedEmails.some(
        (subId) => subId === action.payload
      );
      if (!exists) {
        state.selectedEmails.push(action.payload);
      }
    },
    removeSelectedEmails(state, action: PayloadAction<Email>) {
      state.selectedEmails = state.selectedEmails.filter(
        (sub) => sub.id !== action.payload.id
      );
    },
  },
});

// Export actions
export const {
  setSubscriptions,
  addSelectedEmails,
  removeSelectedEmails,
} = subscriptionSlice.actions;

// Export reducer
export default subscriptionSlice.reducer;
