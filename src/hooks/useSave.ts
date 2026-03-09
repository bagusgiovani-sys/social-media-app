"use client";

import { savesApi } from "@/lib/api/saves";
import { Post } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleSave(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isSaved: boolean) => {
      if (isSaved) {
        return savesApi.unsavePost(postId);
      } else {
        return savesApi.savePost(postId);
      }
    },

    // Optimistic update
    onMutate: async (isSaved: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });

      const previous = queryClient.getQueryData(["posts", postId]);

      queryClient.setQueryData(["posts", postId], (old: Post) => {
        if (!old) return old;
        return { ...old, savedByMe: !isSaved };
      });

      // Also update inside feed pages
      queryClient.setQueriesData({ queryKey: ["feed"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((post: Post) =>
              post.id === postId ? { ...post, savedByMe: !isSaved } : post
            ),
          })),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts", postId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({ queryKey: ["me", "saved"] });
    },
  });
}