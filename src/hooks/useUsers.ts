"use client";

import { usersApi } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";

export function useSearchUsers(q: string, page = 1) {
  return useQuery({
    queryKey: ["users", "search", q, page],
    queryFn: async () => {
      const res = await usersApi.searchUsers(q, page);
      return res.data?.data ?? res.data;
    },
    enabled: q.trim().length > 0,
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ["users", username],
    queryFn: async () => {
      const res = await usersApi.getUserProfile(username);
      return res.data?.data ?? res.data;
    },
    enabled: !!username,
  });
}

// Both return { data: { posts: [...], pagination: {} } }
export function useUserPosts(username: string) {
  return useQuery({
    queryKey: ["users", username, "posts"],
    queryFn: async () => {
      const res = await usersApi.getUserPosts(username);
      const inner = res.data?.data;
      return Array.isArray(inner?.posts) ? inner.posts : [];
    },
    enabled: !!username,
  });
}

export function useUserLikes(username: string) {
  return useQuery({
    queryKey: ["users", username, "likes"],
    queryFn: async () => {
      const res = await usersApi.getUserLikes(username);
      const inner = res.data?.data;
      return Array.isArray(inner?.posts) ? inner.posts : [];
    },
    enabled: !!username,
  });
}