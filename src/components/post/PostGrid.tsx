"use client";

import { useRouter } from "next/navigation";

interface Post {
  id: number;
  imageUrl: string;
  caption?: string | null;
}

interface Props {
  posts: Post[];
}

export default function PostGrid({ posts }: Props) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => router.push(`/posts/${post.id}`)}
          className="cursor-pointer aspect-square overflow-hidden bg-zinc-900"
        >
          <img
            src={post.imageUrl}
            alt={post.caption ?? "Post"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          />
        </div>
      ))}
    </div>
  );
}