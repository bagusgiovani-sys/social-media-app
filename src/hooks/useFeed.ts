"use client";

import { feedApi } from "@/lib/api/feed";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store";

// API returns: { success, message, data: { posts: [...], pagination: { page, limit, total, totalPages } } }
export function useFeed() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await feedApi.getFeed(pageParam as number);
      const inner = res.data?.data;
      return {
        data: Array.isArray(inner?.items) ? inner.items : Array.isArray(inner?.posts) ? inner.posts : [],
        pagination: inner?.pagination ?? {},
      };
    },
    initialPageParam: 1,
    enabled: isAuthenticated,
    getNextPageParam: (lastPage: any) => {
      const p = lastPage.pagination;
      if (p?.page && p?.totalPages && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
  });
}