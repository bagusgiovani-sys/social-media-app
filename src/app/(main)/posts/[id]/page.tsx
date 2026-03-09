"use client";

import { use } from "react";
import { usePost } from "@/hooks/usePosts";
import PostDetail from "@/components/post/PostDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: Props) {
  const { id } = use(params);
  const { data: post, isLoading } = usePost(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <p className="text-zinc-500">Post not found.</p>
      </div>
    );
  }

  return <PostDetail post={post} />;
}