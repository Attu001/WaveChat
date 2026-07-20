import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const exists = state.notifications.find(n => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift(action.payload);
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.is_read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => {
        n.is_read = true;
      });
    },
    removeNotification: (state) => {
      // Keep notifications but mark all as read
      state.notifications.forEach(n => {
        n.is_read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, setNotifications, markNotificationAsRead, markAllNotificationsAsRead, removeNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
