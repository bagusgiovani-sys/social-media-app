"use client";

import { postsApi, CreatePostPayload } from "@/lib/api/posts";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

// API returns: { success, message, data: { posts: [...], pagination: { page, limit, total, totalPages } } }
function unwrapList(res: any) {
  const inner = res.data?.data;
  return {
    data: Array.isArray(inner?.posts) ? inner.posts : [],
    pagination: inner?.pagination ?? {},
  };
}

export function useExplorePosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "explore"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postsApi.getAllPosts(pageParam as number);
      return unwrapList(res);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const p = lastPage.pagination;
      if (p?.page && p?.totalPages && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
  });
}

export function usePost(id: number, initialData?: any) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const res = await postsApi.getPost(id);
      return res.data?.data ?? res.data;
    },
    enabled: !!id,
    initialData,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostPayload) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["me", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "explore"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["me", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "explore"] });
    },
  });
}