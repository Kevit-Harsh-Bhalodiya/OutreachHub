import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { axiosInstance } from "@/pages/auth/Login";

export const fetchWorkspaces = createAsyncThunk('admin/fetchWorkspacesCount',async (_,thunkAPI:any)=>{
  const token = thunkAPI.getState().auth.token
  const response = await axiosInstance.get('/workspace/admin',{headers:{'Authorization': `Bearer ${token}`}});
  if(response.status !== 200){
    return thunkAPI.rejectWithValue('Failed to fetch workspaces');
  }
  return response.data;
})
interface Workspace{
  workspaces: any[];
  loading: boolean;
  error: string | null;
  selectedWorkspaceId: string | null;
}
const initialState:Workspace = {
  workspaces: [],
  selectedWorkspaceId:null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
        setSelectedWorkspaceId: (state, action) => {
      state.selectedWorkspaceId = action.payload;
    },
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchWorkspaces.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchWorkspaces.fulfilled,(state,action)=>{
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.error.message || "Failed to fetch workspaces";
      })
  }
});
export const selectWorkspaces = (state: RootState) => state.workspace.workspaces;
export const selectWorkspacesLoading = (state: RootState) => state.workspace.loading;
export const { setSelectedWorkspaceId } = workspaceSlice.actions;
export const selectSelectedWorkspaceId = (state: RootState) => state.workspace.selectedWorkspaceId;

export default workspaceSlice.reducer;
