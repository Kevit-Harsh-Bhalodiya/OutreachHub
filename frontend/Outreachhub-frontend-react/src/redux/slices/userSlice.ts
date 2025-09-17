import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { axiosInstance } from "@/pages/auth/Login";

const fetchUser = createAsyncThunk('user/fetchUser', async (_, thunkAPI: any) => {
  const token = thunkAPI.getState().auth.token
  const response = await axiosInstance.get('/user/admin', { headers: { 'Authorization': `Bearer ${token}` } });

  if (response.status !== 200) {
    return thunkAPI.rejectWithValue('Failed to fetch user');
  }
  return response.data;
})
const setWorkspace = createAsyncThunk('user/setWorkspace', async (workspaceId: string, thunkAPI: any) => {
  const token = thunkAPI.getState().auth.token
  const response = await axiosInstance.post('/workspace/setWorkspace', { workspaceId }, { headers: { 'Authorization': `Bearer ${token}` } });
  if (response.status !== 200) {
    return thunkAPI.rejectWithValue('Failed to set workspace');
  }
  return response.data;
})

interface UserState {
  userId: null | string,
  user: any[];
  loading: boolean;
  error: string | null;
}
const initialState: UserState = {
  userId: '',
  user: [],
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      .addCase(setWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setWorkspace.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to set workspace";
      })
  }
});

export const { setUserId } = userSlice.actions;
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export default userSlice.reducer;
export { fetchUser, setWorkspace };
