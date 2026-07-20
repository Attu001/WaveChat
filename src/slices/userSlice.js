import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersWithList } from "../api/services/userServices";

// async thunk
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await UsersWithList();
  return res.data || [];
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        // Only set error if we don't already have data
        if (state.list.length === 0) {
          state.error = "Failed to load users";
        }
      });
  },
});

export default usersSlice.reducer;
