import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { axiosInstance } from "@/pages/auth/Login";

export const fetchCampaign = createAsyncThunk('user/fetchCampaign', async (_, thunkAPI: any) => {
  const token = thunkAPI.getState().auth.token
  const isAdmin = thunkAPI.getState().auth.isAdmin
  let response;
  if (isAdmin) {

    response = await axiosInstance.get('/campaign/admin', { headers: { 'Authorization': `Bearer ${token}` } });
  } else {
    response = await axiosInstance.get('/campaign/admin', { headers: { 'Authorization': `Bearer ${token}` } });
  }

  if (response.status !== 200) {
    return thunkAPI.rejectWithValue('Failed to fetch campaign');
  }
  return response.data;
})
export const fetchCampaignsByUserId = createAsyncThunk('user/fetchCampaignsByWorkspaceId', async (_, thunkAPI: any) => {
  const token = thunkAPI.getState().auth.token
  const isAdmin = thunkAPI.getState().auth.isAdmin
  const selectedWorkspaceId = thunkAPI.getState().workspace.selectedWorkspaceId;
  if(!isAdmin && !selectedWorkspaceId){
    return thunkAPI.rejectWithValue('No workspace selected');
  }
  const response = await axiosInstance.get(`/campaign`, { headers: { 'Authorization': `Bearer ${token}` } });

  if (response.status !== 200) {
    return thunkAPI.rejectWithValue('Failed to fetch campaign by workspaceId');
  }
  return response.data;
});
interface CampaignState {
  campaigns: any;
  loading: boolean;
  error: string | null;
}
const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};
const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCampaign.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch campaigns";
      })
      .addCase(fetchCampaignsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchCampaignsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaignsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch campaigns by workspaceId";
      })
  }
});

export const selectCampaigns = (state: RootState) => state.campaign.campaigns;
export const selectCampaignLoading = (state: RootState) => state.campaign.loading;
export default campaignSlice.reducer;
