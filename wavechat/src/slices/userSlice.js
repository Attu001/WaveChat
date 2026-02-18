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
        // ⚠️ only show loader if data not already present
        if (state.list === null || state.list.length === 0) state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load users";
        state.list = [];
      });
  },
});

export default usersSlice.reducer;
