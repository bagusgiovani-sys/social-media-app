"use client";

import { Post } from "@/types/post";
import { useToggleLike } from "@/hooks/useLike";
import { useToggleSave } from "@/hooks/useSave";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import dayjs from "@/lib/dayjs";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LikedByModal from "@/components/modals/LikedByModal";

interface Props { post: Post; }
const CAPTION_LIMIT = 100;

export default function PostCard({ post }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const savedPostIds = useAppSelector((s) => s.saves.savedPostIds);
  const likedPostIds = useAppSelector((s) => s.likes.likedPostIds);
  const { mutate: toggleLike, isPending: likePending } = useToggleLike(post.id);
  const { mutate: toggleSave, isPending: savePending } = useToggleSave(post.id);
  const [expanded, setExpanded] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const isSaved = savedPostIds.includes(post.id) || (post.savedByMe ?? false);
  const isLiked = likedPostIds.includes(post.id) || (post.likedByMe ?? false);

  const handleLike = () => {
    if (!isAuthenticated) return router.push("/login");
    if (!likePending) toggleLike(isLiked);
  };

  const handleSave = () => {
    if (!isAuthenticated) return router.push("/login");
    if (!savePending) toggleSave(isSaved);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.author?.name ?? "Sociality", text: post.caption ?? "Check out this post!", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const onLongPressStart = () => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setLikesOpen(true);
    }, 500);
  };

  const onLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const onLikeTap = () => {
    if (!didLongPress.current) handleLike();
    didLongPress.current = false;
  };

  const isLong = (post.caption?.length ?? 0) > CAPTION_LIMIT;
  const displayCaption = isLong && !expanded ? post.caption!.slice(0, CAPTION_LIMIT) + "..." : post.caption;

  return (
    <>
      <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#000000]">
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => router.push(`/profile/${post.author?.username ?? ""}`)}>
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

        <div className="w-full cursor-pointer aspect-square" onClick={() => router.push(`/posts/${post.id}`)}>
          <img src={post.imageUrl} alt={post.caption ?? "Post"} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1.5 select-none"
              onPointerDown={onLongPressStart}
              onPointerUp={() => { onLongPressEnd(); onLikeTap(); }}
              onPointerLeave={onLongPressEnd}
              onPointerCancel={onLongPressEnd}
            >
              <Heart size={20} className={isLiked ? "fill-[#D9206E] text-[#D9206E]" : "text-white"} />
              <span className="text-white text-sm">{post.likeCount ?? 0}</span>
            </div>
            <button className="flex items-center gap-1.5" onClick={() => router.push(`/posts/${post.id}`)}>
              <MessageCircle size={20} className="text-white" />
              <span className="text-white text-sm">{post.commentCount ?? 0}</span>
            </button>
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleShare}>
              <Send size={20} className="text-white" />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.85 }} onClick={handleSave} disabled={savePending}>
            <Bookmark size={20} className={isSaved ? "fill-white text-white" : "text-white"} />
          </motion.button>
        </div>

        {post.caption && (
          <div className="px-4 pb-4">
            <span className="text-white text-sm font-bold mr-1.5">{post.author?.name}</span>
            <span className="text-white text-sm">{displayCaption}</span>
            {isLong && (
              <button onClick={() => setExpanded((v) => !v)} className="text-sm font-semibold ml-1 text-[#7C3AED]">
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}
      </div>

      <LikedByModal postId={post.id} open={likesOpen} onClose={() => setLikesOpen(false)} />
    </>
  );
}