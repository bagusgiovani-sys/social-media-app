import api from "@/lib/axios";

export const feedApi = {
  getFeed: (page = 1, limit = 20) =>
    api.get("/api/feed", { params: { page, limit } }),
};