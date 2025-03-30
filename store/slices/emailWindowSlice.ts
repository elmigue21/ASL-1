import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscription } from "../../types/subscription"; // Ensure correct import path
import { Email } from "@/types/email";

// Define initial state correctly
interface EmailWindowState {
  isOpen: boolean
}

const initialState: EmailWindowState = {
  isOpen: false,
};

const emailWindowSlice = createSlice({
  name: "emailWindow",
  initialState,
  reducers: {
    setOpenState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },

  },
});

// Export actions
export const {
  setOpenState
} = emailWindowSlice.actions;

// Export reducer
export default emailWindowSlice.reducer;
