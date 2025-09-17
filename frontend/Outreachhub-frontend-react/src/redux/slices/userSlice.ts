import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { axiosInstance } from '@/pages/auth/Login';
import type { User } from '@/types'; // Import your official User type

import type { RootState } from '../store';

// Define the shape of this slice's state
interface UserState {
  userId: string | null;
  user: User[]; // FIX: Correctly typed as User[], keeping the name 'user'
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userId: null,
  user: [],
  loading: false,
  error: null,
};

// Fully type the createAsyncThunk for fetching users
const fetchUser = createAsyncThunk<
  User[], // Return type
  void, // Argument type
  { state: RootState } // ThunkAPI config
>('user/fetchUser', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axiosInstance.get('/user/admin', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Failed to fetch users');
  }
});

const setWorkspace = createAsyncThunk<
  unknown, 
  string, 
  { state: RootState } 
>('user/setWorkspace', async (workspaceId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axiosInstance.post(
      '/workspace/setWorkspace',
      { workspaceId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('Failed to set workspace');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        // This now correctly updates the 'user' property
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch users';
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
        state.error = (action.payload as string) || 'Failed to set workspace';
      });
  },
});

export const { setUserId } = userSlice.actions;

// Selectors now correctly point to the 'user' property
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;

export default userSlice.reducer;
export { fetchUser, setWorkspace };
