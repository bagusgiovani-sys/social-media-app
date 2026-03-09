import api from "@/lib/axios";

export interface CreatePostPayload {
  image: File;
  caption?: string;
}

export const postsApi = {
  getAllPosts: (page = 1, limit = 20) =>
    api.get("/api/posts", { params: { page, limit } }),

  getPost: (id: number) =>
    api.get(`/api/posts/${id}`),

  createPost: (data: CreatePostPayload) => {
    const form = new FormData();
    form.append("image", data.image);
    if (data.caption) form.append("caption", data.caption);
    return api.post("/api/posts", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deletePost: (id: number) =>
    api.delete(`/api/posts/${id}`),
};