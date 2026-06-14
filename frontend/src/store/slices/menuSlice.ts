import { createSlice } from "@reduxjs/toolkit";
import type { MenuResponse } from "@/types/menu";

interface MenuState {
  menus: MenuResponse[];
}

const initialState: MenuState = {
  menus: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus(state, action) {
      state.menus = action.payload;
    },
  },
});

export const { setMenus } = menuSlice.actions;
export default menuSlice.reducer;