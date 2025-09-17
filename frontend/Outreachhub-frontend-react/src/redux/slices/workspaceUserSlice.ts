import { axiosInstance } from "@/pages/auth/Login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchWorkspaceUsers = createAsyncThunk(
  "workspace/fetchWorkspaceUsers",
  async (workspaceId: string, thunkAPI: any) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await axiosInstance.get(`/workspace/workspaceUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue("Failed to fetch workspace users");
      }
      console.log("res",response.data)
      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch workspace users");
    }
  },
);
interface WorkspaceUser {
  userId: string;
  workspaces: [
    {
      _id: string;
      name: string;
    },
  ];
}
interface WorkspaceUserState {
  workspaceUsers: WorkspaceUser[];
  loading: boolean;
  error: string | null;
}
const initialState: WorkspaceUserState = {
  workspaceUsers: [],
  loading: false,
  error: null,
};

export const workspaceUserSlice = createSlice({
  name: "workspaceUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => { 
    builder
      .addCase(fetchWorkspaceUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceUsers = action.payload;
      })
      .addCase(fetchWorkspaceUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default workspaceUserSlice.reducer;

