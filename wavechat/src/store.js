import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/ErrorSlice.js";
import successReducer from "./slices/successSlice.js";
export const store = configureStore({
  reducer: {
    error: errorReducer,
    Success: successReducer,
  },
});
