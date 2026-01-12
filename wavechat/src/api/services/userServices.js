import { api } from "../axios";

const allUsers = () => api.get("auth/all_users/")
const getProfileByUserId = () => api.get("auth/profile/")
const getProfileOnChat = (userId) =>
  api.get(`auth/profile/${userId}/`);

export { allUsers, getProfileByUserId ,getProfileOnChat};


