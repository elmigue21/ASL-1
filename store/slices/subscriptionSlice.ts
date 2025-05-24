import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Email } from "@/types/email";

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

export const {
  setSubscriptions,
  addSelectedEmails,
  removeSelectedEmails,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
