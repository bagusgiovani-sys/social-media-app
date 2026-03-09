"use client";

import { Post } from "@/types/post";
import { useToggleLike } from "@/hooks/useLike";
import { useToggleSave } from "@/hooks/useSave";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import dayjs from "@/lib/dayjs";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  post: Post;
}

const CAPTION_LIMIT = 100;

export default function PostCard({ post }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { mutate: toggleLike, isPending: likePending } = useToggleLike(post.id);
  const { mutate: toggleSave, isPending: savePending } = useToggleSave(post.id);
  const [expanded, setExpanded] = useState(false);

  const handleLike = () => {
    if (!isAuthenticated) return router.push("/login");
    if (!likePending) toggleLike(post.likedByMe ?? false);
  };

  const handleSave = () => {
    if (!isAuthenticated) return router.push("/login");
    if (!savePending) toggleSave(post.savedByMe ?? false);
  };

  const isLong = (post.caption?.length ?? 0) > CAPTION_LIMIT;
  const displayCaption =
    isLong && !expanded
      ? post.caption!.slice(0, CAPTION_LIMIT) + "..."
      : post.caption;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-900 bg-[#0a0a0a]">
      {/* Author row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => router.push(`/profile/${post.author?.username ?? ""}`)}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 shrink-0">
          {post.author?.avatarUrl ? (
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{post.author?.name}</p>
          <p className="text-zinc-500 text-xs">{dayjs(post.createdAt).fromNow()}</p>
        </div>
      </div>

      {/* Image */}
      <div
        className="w-full cursor-pointer aspect-square"
        onClick={() => router.push(`/posts/${post.id}`)}
      >
        <img
          src={post.imageUrl}
          alt={post.caption ?? "Post"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            disabled={likePending}
            className="flex items-center gap-1.5"
          >
            <Heart
              size={20}
              className={post.likedByMe ? "fill-[#D9206E] text-[#D9206E]" : "text-white"}
            />
            <span className="text-white text-sm">{post.likeCount ?? 0}</span>
          </motion.button>

          {/* Comment */}
          <button
            className="flex items-center gap-1.5"
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            <MessageCircle size={20} className="text-white" />
            <span className="text-white text-sm">{post.commentCount ?? 0}</span>
          </button>

          {/* Share */}
          <button className="flex items-center gap-1.5">
            <Send size={20} className="text-white" />
          </button>
        </div>

        {/* Bookmark */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleSave}
          disabled={savePending}
        >
          <Bookmark
            size={20}
            className={post.savedByMe ? "fill-white text-white" : "text-white"}
          />
        </motion.button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-4">
          <span className="text-white text-sm font-bold mr-1.5">{post.author?.name}</span>
          <span className="text-white text-sm">{displayCaption}</span>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-sm font-semibold ml-1 text-[#7C3AED]"
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}