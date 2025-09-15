import { axiosInstance } from "@/pages/auth/Login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const fetchMessageTemplates = createAsyncThunk('user/fetchMessageTemplates', async (_,thunkAPI:any) => {
  const token = thunkAPI.getState().auth.token;
  const isAdmin = thunkAPI.getState().auth.isAdmin;
  const selectedWorkspaceId = thunkAPI.getState().workspace.selectedWorkspaceId;
  if(!isAdmin && !selectedWorkspaceId){
    return thunkAPI.rejectWithValue('No workspace selected');
  }
  const response = await axiosInstance('/message-template',{headers:{"Authorization":`Bearer ${token}`}});
  if(response.status!==200) throw new Error("Failed to fetch message templates");
  console.log("Fetched message templates:", response.data);
  return response.data;
});
interface MessageTemplates {
  templates: any[];
  loading: boolean;
  error: string | null;
}
const initialState: MessageTemplates = {
  templates: [],
  loading: false,
  error: null,
};
const messageTemplateSlice = createSlice({
  name: "messageTemplate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchMessageTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch message templates";
      });
  },
})
export {fetchMessageTemplates};
export const getMessageTemplates = (state:RootState)=>state.messageTemplate.templates;
export const isTemplatesLoading = (state:RootState)=>state.messageTemplate.loading;
export default messageTemplateSlice.reducer;
