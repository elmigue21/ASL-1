import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export const {
  setOpenState
} = emailWindowSlice.actions;

export default emailWindowSlice.reducer;
