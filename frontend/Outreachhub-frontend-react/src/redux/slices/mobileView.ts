import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UiState {
  isMenuOpen: boolean;
}
const initialState: UiState = {
  isMenuOpen: false,
};
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});
export const { toggleMenu } = uiSlice.actions;
export const selectIsMenuOpen = (state: RootState) => state.ui.isMenuOpen;
export default uiSlice.reducer;
