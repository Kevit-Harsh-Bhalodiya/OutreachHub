import { axiosInstance } from "@/pages/auth/Login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const initialState = {
  workspacesByUserId: [] as any[],
  loading: false,
  error: null as string | null,
}
const getWorkspacesByUserId = createAsyncThunk(
  "admin/getUsersByWorkspaceID",
  async (userId: string, thunkAPI:any)=>{
    try{
      const response = await axiosInstance.get(`/workspace/user/${userId}`,{
        headers: {authorization: `Bearer ${thunkAPI.getState().auth.token}`}
      })
      return response.data;
    }catch(error:any){
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

const adminSlice = createSlice({
  name:"admin",
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(getWorkspacesByUserId.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })
    .addCase(getWorkspacesByUserId.fulfilled,(state,action)=>{
      state.loading = false;
      state.workspacesByUserId = action.payload;
    })
    .addCase(getWorkspacesByUserId.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.error.message || "Failed to fetch workspaces";
    })
  }
})
export {getWorkspacesByUserId}
export default adminSlice.reducer;
export const selectWorkspacesByUserId = (state: RootState) => state.admin.workspacesByUserId;
export const selectAdminLoading = (state: RootState) => state.admin.loading;

