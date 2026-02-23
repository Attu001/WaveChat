import { api } from "../axios";

const allUsers = () => api.get("auth/all_users/")
const getProfileByUserId = () => api.get("auth/profile/")
const UsersWithList = () => api.get("api/chat/users-with-status/")
const  sendFriendRequest =(id) => api.post(`api/chat/requests/send/${id}/`)
const fetchallRequests = () => api.get("api/chat/requests/pending/")
const acceptFriendRequest = (requestId) =>api.post(`api/chat/requests/accept/${requestId}/`);
const notifications = () => api.get("api/chat/notifications/");


 
const getProfileOnChat = (userId) => api.get(`auth/profile/${userId}/`);

export { UsersWithList, getProfileByUserId ,getProfileOnChat,sendFriendRequest,fetchallRequests,acceptFriendRequest,notifications};


