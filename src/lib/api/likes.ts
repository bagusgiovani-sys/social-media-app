import api from "@/lib/axios";

export const likesApi = {
  likePost: (id: number) =>
    api.post(`/api/posts/${id}/like`),

  unlikePost: (id: number) =>
    api.delete(`/api/posts/${id}/like`),

  getPostLikes: (id: number, page = 1, limit = 20) =>
    api.get(`/api/posts/${id}/likes`, { params: { page, limit } }),

  getMyLikes: (page = 1, limit = 20) =>
    api.get(`/api/me/likes`, { params: { page, limit } }),
};