import api from "@/lib/axios";

export const commentsApi = {
  getComments: (postId: number, page = 1, limit = 10) =>
    api.get(`/api/posts/${postId}/comments`, { params: { page, limit } }),

  addComment: (postId: number, text: string) =>
    api.post(`/api/posts/${postId}/comments`, { text }),

  deleteComment: (commentId: number) =>
    api.delete(`/api/comments/${commentId}`),
};