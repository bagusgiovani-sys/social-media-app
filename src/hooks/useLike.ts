"use client";

import { likesApi } from "@/lib/api/likes";
import { Post } from "@/types/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePostLikes(postId: number) {
  return useQuery({
    queryKey: ["posts", postId, "likes"],
    queryFn: async () => {
      const res = await likesApi.getPostLikes(postId);
      const inner = res.data?.data;
      return Array.isArray(inner?.users) ? inner.users : [];
    },
    enabled: !!postId,
  });
}

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) return likesApi.unlikePost(postId);
      return likesApi.likePost(postId);
    },
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      const previous = queryClient.getQueryData(["posts", postId]);

      // Update post detail
      queryClient.setQueryData(["posts", postId], (old: Post) => {
        if (!old) return old;
        return {
          ...old,
          likedByMe: !isLiked,
          likeCount: isLiked ? (old.likeCount ?? 0) - 1 : (old.likeCount ?? 0) + 1,
        };
      });

      // Update inside feed pages
      queryClient.setQueriesData({ queryKey: ["feed"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((post: Post) =>
              post.id === postId
                ? { ...post, likedByMe: !isLiked, likeCount: isLiked ? (post.likeCount ?? 0) - 1 : (post.likeCount ?? 0) + 1 }
                : post
            ),
          })),
        };
      });

      // Update inside explore pages
      queryClient.setQueriesData({ queryKey: ["posts", "explore"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((post: Post) =>
              post.id === postId
                ? { ...post, likedByMe: !isLiked, likeCount: isLiked ? (post.likeCount ?? 0) - 1 : (post.likeCount ?? 0) + 1 }
                : post
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["posts", postId], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "explore"] });
    },
  });
}