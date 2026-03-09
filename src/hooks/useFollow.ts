"use client";

import { followApi } from "@/lib/api/follow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserFollowers(username: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users", username, "followers"],
    queryFn: async () => {
      const res = await followApi.getUserFollowers(username);
      const inner = res.data?.data;
      return Array.isArray(inner?.users) ? inner.users : [];
    },
    enabled: options?.enabled ?? !!username,
  });
}

export function useUserFollowing(username: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users", username, "following"],
    queryFn: async () => {
      const res = await followApi.getUserFollowing(username);
      const inner = res.data?.data;
      return Array.isArray(inner?.users) ? inner.users : [];
    },
    enabled: options?.enabled ?? !!username,
  });
}

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFollowing: boolean) => {
      if (isFollowing) return followApi.unfollow(username);
      return followApi.follow(username);
    },
    onMutate: async (isFollowing: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["users", username] });
      const previous = queryClient.getQueryData(["users", username]);
      queryClient.setQueryData(["users", username], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !isFollowing,
          isFollowedByMe: !isFollowing,
          counts: old.counts ? {
            ...old.counts,
            followers: isFollowing ? old.counts.followers - 1 : old.counts.followers + 1,
          } : old.counts,
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["users", username], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", username] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}