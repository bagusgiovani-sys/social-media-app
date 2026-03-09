import api from "@/lib/axios";

export const followApi = {
  follow: (username: string) =>
    api.post(`/api/follow/${username}`),

  unfollow: (username: string) =>
    api.delete(`/api/follow/${username}`),

  getUserFollowers: (username: string, page = 1, limit = 20) =>
    api.get(`/api/users/${username}/followers`, { params: { page, limit } }),

  getUserFollowing: (username: string, page = 1, limit = 20) =>
    api.get(`/api/users/${username}/following`, { params: { page, limit } }),
};