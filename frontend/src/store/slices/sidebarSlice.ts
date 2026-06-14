import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  collapsed: boolean;
}

const initialState: SidebarState = {
  collapsed: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.collapsed = !state.collapsed;
    },
    setCollapsed(state, action) {
      state.collapsed = action.payload;
    },
  },
});

export const { toggleSidebar, setCollapsed } = sidebarSlice.actions;
export default sidebarSlice.reducer;