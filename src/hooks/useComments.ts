"use client";

import { commentsApi } from "@/lib/api/comments";
import { Comment } from "@/types/comment";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await commentsApi.getComments(postId, pageParam);
      const inner = res.data?.data;
      return {
        data: Array.isArray(inner?.comments) ? inner.comments : [],
        pagination: inner?.pagination ?? {},
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const p = lastPage.pagination;
      if (p?.page && p?.totalPages && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
    enabled: !!postId,
  });
}

export function useAddComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => commentsApi.addComment(postId, text),

    // Optimistic update
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId, "comments"] });

      const previous = queryClient.getQueryData(["posts", postId, "comments"]);

      const optimisticComment: Comment = {
        id: Date.now(), // temp id
        text,
        createdAt: new Date().toISOString(),
        postId,
        author: { id: 0, name: "You", username: "you" }, // replaced on settle
      };

      queryClient.setQueryData(["posts", postId, "comments"], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, i: number) =>
            i === 0
              ? { ...page, data: [optimisticComment, ...(page.data ?? [])] }
              : page
          ),
        };
      });

      // Bump comment count on post
      queryClient.setQueryData(["posts", postId], (old: any) => {
        if (!old) return old;
        return { ...old, commentCount: (old.commentCount ?? 0) + 1 };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts", postId, "comments"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.deleteComment(commentId),

    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId, "comments"] });

      const previous = queryClient.getQueryData(["posts", postId, "comments"]);

      queryClient.setQueryData(["posts", postId, "comments"], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data?.filter((c: Comment) => c.id !== commentId),
          })),
        };
      });

      queryClient.setQueryData(["posts", postId], (old: any) => {
        if (!old) return old;
        return { ...old, commentCount: Math.max((old.commentCount ?? 1) - 1, 0) };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts", postId, "comments"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
  });
}