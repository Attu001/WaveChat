    import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    message: null,  // stores the error message
  },
  reducers: {
    setError: (state, action) => {
      state.message = action.payload; // error text
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
