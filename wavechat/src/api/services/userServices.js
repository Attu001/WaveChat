import { api } from "../axios";

const allUsers = () => api.get("auth/all_users/")
const getProfileByUserId = () => api.get("auth/profile/")
const UsersWithList = () => api.get("api/chat/users-with-status/")
const sendFriendRequest = (id) => api.post(`api/chat/requests/send/${id}/`)
const fetchallRequests = () => api.get("api/chat/requests/pending/")
const acceptFriendRequest = (requestId) => api.post(`api/chat/requests/accept/${requestId}/`);
const notifications = () => api.get("api/chat/notifications/");
const updateProfile = (data) => api.patch("auth/profile/update/", data);
const getProfileOnChat = (userId) => api.get(`auth/profile/${userId}/`);

// Posts
const fetchPosts = () => api.get("api/chat/posts/");
const createPost = (data) => api.post("api/chat/posts/create/", data);
const toggleLike = (postId) => api.post(`api/chat/posts/${postId}/like/`);
const deletePost = (postId) => api.delete(`api/chat/posts/${postId}/delete/`);
const fetchExploreFeed = (page = 1, perPage = 10) =>
    api.get(`api/chat/explore/?page=${page}&per_page=${perPage}`);

export {
    UsersWithList, getProfileByUserId, getProfileOnChat,
    sendFriendRequest, fetchallRequests, acceptFriendRequest,
    notifications, updateProfile,
    fetchPosts, createPost, toggleLike, deletePost,
    fetchExploreFeed,
};
