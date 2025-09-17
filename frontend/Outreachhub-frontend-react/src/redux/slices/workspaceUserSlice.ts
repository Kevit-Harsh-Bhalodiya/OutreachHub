import { axiosInstance } from "@/pages/auth/Login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchWorkspaceUser = createAsyncThunk(
  "workspaceUser/fetch",
  async (_, thunkAPI: any) => {
    const token = thunkAPI.getState().auth.token;
    const response = await axiosInstance.get("/workspace/workspaceUser", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);
interface WorkspaceUserState {
  workspaceUser: [];
  loading: boolean;
  error: string | null;
}
const initialState: WorkspaceUserState = {
  workspaceUser: [],
  loading: false,
  error: null,
};
const workspaceUserSlice = createSlice({
  name: "workspaceUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceUser.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceUser = action.payload;
      })
      .addCase(fetchWorkspaceUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch workspace users";
      });
  },
});
export default workspaceUserSlice.reducer;
export const selectWorkspaceUser = (state: {
  workspaceUser: WorkspaceUserState;
}) => state.workspaceUser.workspaceUser;
export const selectWorkspaceUserLoading = (state: {
  workspaceUser: WorkspaceUserState;
}) => state.workspaceUser.loading;
