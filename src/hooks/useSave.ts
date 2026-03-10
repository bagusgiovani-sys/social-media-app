"use client";

import { savesApi } from "@/lib/api/saves";
import { Post } from "@/types/post";
import { addSave, removeSave } from "@/store/slices/savesSlice";
import { useAppDispatch } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function updateFeedPages(old: any, postId: number, updater: (post: Post) => Post) {
  if (!old?.pages) return old;
  return {
    ...old,
    pages: old.pages.map((page: any) => {
      const list = page.items ?? page.posts ?? page.data ?? [];
      const updated = list.map((post: Post) => post.id === postId ? updater(post) : post);
      if (page.items) return { ...page, items: updated };
      if (page.posts) return { ...page, posts: updated };
      return { ...page, data: updated };
    }),
  };
}

export function useToggleSave(postId: number) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (isSaved: boolean) => {
      if (isSaved) return savesApi.unsavePost(postId);
      return savesApi.savePost(postId);
    },
    onMutate: async (isSaved: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previous = queryClient.getQueryData(["posts", postId]);

      // Update Redux (for PostCard in feed)
      if (isSaved) {
        dispatch(removeSave(postId));
      } else {
        dispatch(addSave(postId));
      }

      // Update single post cache (for PostDetail)
      queryClient.setQueryData(["posts", postId], (old: Post) => {
        if (!old) return old;
        return { ...old, savedByMe: !isSaved };
      });

      // Update feed cache
      queryClient.setQueriesData({ queryKey: ["feed"] }, (old: any) =>
        updateFeedPages(old, postId, (post) => ({ ...post, savedByMe: !isSaved }))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["posts", postId], context.previous);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onSettled: () => {
      // DO NOT invalidate ["posts", postId] — backend bug returns savedByMe: false always
      queryClient.invalidateQueries({ queryKey: ["me", "saved"] });
    },
  });
}