import api from "@/lib/axios";

export const savesApi = {
  savePost: (id: number) =>
    api.post(`/api/posts/${id}/save`),

  unsavePost: (id: number) =>
    api.delete(`/api/posts/${id}/save`),

  getMySaved: (page = 1, limit = 20) =>
    api.get(`/api/me/saved`, { params: { page, limit } }),
};