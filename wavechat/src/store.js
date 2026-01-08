import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/errorSlice.js";
import successReducer from "./slices/successSlice.js";
import notificationReducer from "./slices/notificationSlice.js"
export const store = configureStore({
  reducer: {
    error: errorReducer,
    Success: successReducer,
     notification: notificationReducer,
  },
});

