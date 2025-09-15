import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface NavLink {
  title: string;
  url: string;
  icon?: string; 
  active: boolean;
}
interface AdminDashboardSidebarDataState{
  user:{
    name: string;
    email: string;
    avatar: string;
  }|null,
  navMain:NavLink[]|null,
  navSecondary:NavLink[]|null,


}
const initialState: AdminDashboardSidebarDataState = {
  user: null,
  navMain: null,
  navSecondary: null,

};
type SidebarInitializationPayload = AdminDashboardSidebarDataState;

export const sidebarSlice = createSlice({
  name: "adminSidebar",
  initialState,
  reducers: {
    initializeSidebar: (state, action: PayloadAction<SidebarInitializationPayload>) => {
      state.user = action.payload.user;
      state.navMain = action.payload.navMain;
      state.navSecondary = action.payload.navSecondary;
      localStorage.setItem("username",action.payload.user!.name||"")
    },
    setActiveLink: (state, action: PayloadAction<{ url: string }>) => {
      if (state.navMain) {
          state.navMain.forEach(link => link.active = link.url === action.payload.url);
      }
      if (state.navSecondary) {
          state.navSecondary.forEach(link => link.active = link.url === action.payload.url);
      }
    },
  },
});

export const { initializeSidebar, setActiveLink } = sidebarSlice.actions;

export default sidebarSlice.reducer;
