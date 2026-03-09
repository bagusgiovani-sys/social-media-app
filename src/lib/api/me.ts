import api from "@/lib/axios";

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  avatar?: File;
}

export const meApi = {
  getMe: () =>
    api.get("/api/me"),

  updateMe: (data: UpdateProfilePayload) => {
    // If avatar file is present, use multipart/form-data
    if (data.avatar) {
      const form = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined) form.append(key, val as string | Blob);
      });
      return api.patch("/api/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.patch("/api/me", data);
  },

  getMyPosts: (page = 1, limit = 20) =>
    api.get("/api/me/posts", { params: { page, limit } }),

  getMyLikes: (page = 1, limit = 20) =>
    api.get("/api/me/likes", { params: { page, limit } }),

  getMySaved: (page = 1, limit = 20) =>
    api.get("/api/me/saved", { params: { page, limit } }),

  getMyFollowers: (page = 1, limit = 20) =>
    api.get("/api/me/followers", { params: { page, limit } }),

  getMyFollowing: (page = 1, limit = 20) =>
    api.get("/api/me/following", { params: { page, limit } }),
};