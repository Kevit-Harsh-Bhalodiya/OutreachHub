import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { axiosInstance } from "@/pages/auth/Login";

interface ContactState{
  contacts: any[] ;
  loading: boolean;
  error: string | null;
}
export const fetchContact = createAsyncThunk('contact/fetchContact',async (_,thunkAPI:any)=>{
  const token = thunkAPI.getState().auth.token
  const response = await axiosInstance.get('/contact/admin',{headers:{'Authorization': `Bearer ${token}`}});

  if(response.status !== 200){
    return thunkAPI.rejectWithValue('Failed to fetch Contact');
  }
  return response.data;
})
export const fetchContactByUserId = createAsyncThunk('user/fetchContactByWorkspaceId',async (_,thunkAPI:any)=>{
  const token = thunkAPI.getState().auth.token
  const isAdmin = thunkAPI.getState().auth.isAdmin
  const selectedWorkspaceId = thunkAPI.getState().workspace.selectedWorkspaceId;
  if(!isAdmin && !selectedWorkspaceId){
    return thunkAPI.rejectWithValue('No workspace selected');
  }
  const response = await axiosInstance.get(`/contact`,{headers:{'Authorization': `Bearer ${token}`}});
  if(response.status !== 200){
    return thunkAPI.rejectWithValue('Failed to fetch Contact by workspaceId');
  }
  return response.data;
});

const initialState:ContactState = {
  contacts:[],
  loading: false,
  error: null,
};
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers:(builder)=>{
    builder.addCase(fetchContact.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchContact.fulfilled,(state,action)=>{
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContact.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Contact";
      })
      .addCase(fetchContactByUserId.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactByUserId.fulfilled,(state,action)=>{
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContactByUserId.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Contact by workspaceId";
      })
  }
});

export const selectContact = (state: RootState) => state.contact.contacts;
export const selectContactLoading = (state: RootState) => state.contact.loading;
export default contactSlice.reducer;
