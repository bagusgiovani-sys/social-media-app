"use client";

import { meApi, UpdateProfilePayload } from "@/lib/api/me";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ME_KEY = ["me"];

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      const res = await meApi.getMe();
      return res.data?.data ?? res.data;
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => meApi.updateMe(data),
    onSuccess: (res) => {
      dispatch(setUser(res.data));
      queryClient.invalidateQueries({ queryKey: ME_KEY });
    },
  });
}

export function useMyPosts(page = 1) {
  return useQuery({
    queryKey: ["me", "posts", page],
    queryFn: async () => {
      const res = await meApi.getMyPosts(page);
      const inner = res.data?.data;
      return Array.isArray(inner?.items) ? inner.items : Array.isArray(inner?.posts) ? inner.posts : [];
    },
  });
}

export function useMyLikes(page = 1) {
  return useQuery({
    queryKey: ["me", "likes", page],
    queryFn: async () => {
      const res = await meApi.getMyLikes(page);
      return res.data;
    },
  });
}

export function useMySaved(page = 1) {
  return useQuery({
    queryKey: ["me", "saved", page],
    queryFn: async () => {
      const res = await meApi.getMySaved(page);
      const inner = res.data?.data;
      return Array.isArray(inner?.posts) ? inner.posts : Array.isArray(inner?.items) ? inner.items : [];
    },
  });
}

export function useMyFollowers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["me", "followers"],
    queryFn: async () => {
      const res = await meApi.getMyFollowers();
      const inner = res.data?.data;
      return Array.isArray(inner?.users) ? inner.users : [];
    },
    enabled: options?.enabled ?? true,
  });
}

export function useMyFollowing(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["me", "following"],
    queryFn: async () => {
      const res = await meApi.getMyFollowing();
      const inner = res.data?.data;
      return Array.isArray(inner?.users) ? inner.users : [];
    },
    enabled: options?.enabled ?? true,
  });
}