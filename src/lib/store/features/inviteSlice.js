import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const validateInviteToken = createAsyncThunk(
    'invite/validateInviteToken',
    async (token, { rejectWithValue }) => {
      try {
        const response = await fetch(`/api/contractor/invite/validate?token=${token}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        return data.invite;
      } catch (error) {
        return rejectWithValue(error.message || 'Something went wrong');
      }
    }
);

export const completeInviteRequest = createAsyncThunk(
  'invite/completeInviteRequest',
  async (formData, { rejectWithValue }) => {
      try {
          const response = await fetch('/api/contractor/invite/complete', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if (!response.ok) {
              const errorData = await response.json();
              return rejectWithValue(errorData.message);
          }
          const data = await response.json();
          return data;
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);

const inviteSlice = createSlice({
  name: 'invite',
  initialState: {
    invite: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetInvite: (state) => {
      state.invite = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateInviteToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateInviteToken.fulfilled, (state, action) => {
        state.loading = false;
        state.invite = action.payload;
        state.requestStatus = 'success';
      })
      .addCase(validateInviteToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeInviteRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeInviteRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestStatus = 'success';
      })
      .addCase(completeInviteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetInvite } = inviteSlice.actions;

export default inviteSlice.reducer;
