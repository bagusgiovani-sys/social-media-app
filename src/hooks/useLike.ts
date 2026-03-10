"use client";

import { likesApi } from "@/lib/api/likes";
import { Post } from "@/types/post";
import { addLike, removeLike } from "@/store/slices/likesSlice";
import { useAppDispatch } from "@/store";
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

function updatePages(old: any, postId: number, updater: (post: Post) => Post) {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => {
      const list = page.items ?? page.posts ?? page.data ?? [];
      const updated = list.map((p: Post) => p.id === postId ? updater(p) : p);
      if (page.items) return { ...page, items: updated };
      if (page.posts) return { ...page, posts: updated };
      return { ...page, data: updated };
    }),
  };
}

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) return likesApi.unlikePost(postId);
      return likesApi.likePost(postId);
    },
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      await queryClient.cancelQueries({ queryKey: ["posts", "explore"] });

      const previous = queryClient.getQueryData(["posts", postId]);

      if (isLiked) dispatch(removeLike(postId));
      else dispatch(addLike(postId));

      const updater = (post: Post) => ({
        ...post,
        likedByMe: !isLiked,
        likeCount: isLiked ? (post.likeCount ?? 0) - 1 : (post.likeCount ?? 0) + 1,
      });

      queryClient.setQueryData(["posts", postId], (old: Post) => old ? updater(old) : old);
      queryClient.setQueriesData({ queryKey: ["feed"] }, (old: any) => updatePages(old, postId, updater));
      queryClient.setQueriesData({ queryKey: ["posts", "explore"] }, (old: any) => updatePages(old, postId, updater));

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["posts", postId], context.previous);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "explore"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "explore"] });
      queryClient.invalidateQueries({ queryKey: ["me", "likes"] });
    },
  });
}