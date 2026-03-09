import api from "@/lib/axios";

export const usersApi = {
  searchUsers: (q: string, page = 1, limit = 20) =>
    api.get("/api/users/search", { params: { q, page, limit } }),

  getUserProfile: (username: string) =>
    api.get(`/api/users/${username}`),

  getUserPosts: (username: string, page = 1, limit = 20) =>
    api.get(`/api/users/${username}/posts`, { params: { page, limit } }),

  getUserLikes: (username: string, page = 1, limit = 20) =>
    api.get(`/api/users/${username}/likes`, { params: { page, limit } }),
};