import api from "@/lib/axios";

export const savesApi = {
  savePost: (id: number) =>
    api.post(`/api/posts/${id}/save`),

  unsavePost: (id: number) =>
    api.delete(`/api/posts/${id}/save`),
};