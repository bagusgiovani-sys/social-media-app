"use client";

import { Post } from "@/types/post";
import { useToggleLike } from "@/hooks/useLike";
import { useToggleSave } from "@/hooks/useSave";
import { useDeletePost, usePost } from "@/hooks/usePosts";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import dayjs from "@/lib/dayjs";
import { Heart, MessageCircle, Send, Bookmark, X, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import CommentSection from "@/components/comments/CommentSection";
import LikedByModal from "@/components/modals/LikedByModal";

interface Props {
  post: Post;
  onClose?: () => void;
}

export default function PostDetail({ post, onClose }: Props) {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { mutate: toggleLike, isPending: likePending } = useToggleLike(post.id);
  const { mutate: toggleSave, isPending: savePending } = useToggleSave(post.id);
  const { mutate: deletePost, isPending: deletePending } = useDeletePost();
  const { data: livePost } = usePost(post.id, post);
  const p = livePost ?? post; // use live data when available
  const [likesOpen, setLikesOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = user?.id === p.author?.id;

  const handleLike = () => {
    if (!isAuthenticated) return router.push("/login");
    if (!likePending) toggleLike(p.likedByMe ?? false);
  };

  const handleSave = () => {
    if (!isAuthenticated) return router.push("/login");
    if (!savePending) toggleSave(p.savedByMe ?? false);
  };

  const handleDelete = () => {
    if (!confirm("Delete this post?")) return;
    deletePost(post.id, {
      onSuccess: () => { onClose ? onClose() : router.replace("/feed"); },
    });
  };

  const handleClose = () => onClose ? onClose() : router.back();

  return (
    <>
      {/* ── PC: Side-by-side layout ── */}
      <div className="hidden md:flex h-[90vh] max-h-[700px] w-full max-w-5xl mx-auto rounded-2xl overflow-hidden"
        style={{ background: "#0a0a0a" }}
      >
        {/* Left: image */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <img src={p.imageUrl} alt={p.caption ?? "Post"} className="w-full h-full object-cover" />
        </div>

        {/* Right: details + comments */}
        <div className="w-[380px] shrink-0 flex flex-col" style={{ background: "#111111" }}>
          {/* Close */}
          <div className="flex justify-end p-3">
            <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Author + caption */}
          <div className="px-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => router.push(`/profile/${p.author?.username}`)}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800">
                  {p.author?.avatarUrl ? (
                    <img src={p.author?.avatarUrl} alt={p.author?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                      {p.author?.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{p.author?.name}</p>
                  <p className="text-zinc-500 text-xs">{dayjs(p.createdAt).fromNow()}</p>
                </div>
              </div>
              {isOwner && (
                <div className="relative">
                  <button onClick={() => setShowMenu((v) => !v)} className="text-zinc-400 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-1 rounded-xl overflow-hidden shadow-xl z-10"
                        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <button
                          onClick={handleDelete}
                          disabled={deletePending}
                          className="block w-full px-5 py-2.5 text-sm text-left hover:bg-zinc-800 transition-colors"
                          style={{ color: "#D9206E" }}
                        >
                          Delete Post
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {p.caption && (
              <p className="text-white text-sm leading-relaxed">{p.caption}</p>
            )}
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <CommentSection postId={post.id} />
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike} disabled={likePending} className="flex items-center gap-1.5">
                <Heart size={20} style={p.likedByMe ? { fill: "#D9206E", color: "#D9206E" } : { color: "white" }} />
                <span className="text-white text-sm">{p.likeCount ?? 0}</span>
              </motion.button>
              <button className="flex items-center gap-1.5">
                <MessageCircle size={20} className="text-white" />
                <span className="text-white text-sm">{p.commentCount ?? 0}</span>
              </button>
              <button className="flex items-center gap-1.5">
                <Send size={20} className="text-white" />
              </button>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleSave} disabled={savePending}>
              <Bookmark size={20} style={p.savedByMe ? { fill: "white", color: "white" } : { color: "white" }} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Mobile: Bottom sheet ── */}
      <div className="md:hidden flex flex-col" style={{ background: "#0a0a0a" }}>
        {/* Post header + image */}
        <div className="relative">
          <div className="flex items-center gap-3 px-4 py-3">
            <div
              className="cursor-pointer w-9 h-9 rounded-full overflow-hidden bg-zinc-800 shrink-0"
              onClick={() => router.push(`/profile/${p.author?.username}`)}
            >
              {p.author?.avatarUrl ? (
                <img src={p.author?.avatarUrl} alt={p.author?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                  {p.author?.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{p.author?.name}</p>
              <p className="text-zinc-500 text-xs">{dayjs(p.createdAt).fromNow()}</p>
            </div>
          </div>

          <img src={p.imageUrl} alt={p.caption ?? "Post"} className="w-full object-cover" style={{ maxHeight: "40vh" }} />

          {/* Actions over image bottom */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike} disabled={likePending} className="flex items-center gap-1.5">
                <Heart size={20} style={p.likedByMe ? { fill: "#D9206E", color: "#D9206E" } : { color: "white" }} />
                <span className="text-white text-sm">{p.likeCount ?? 0}</span>
              </motion.button>
              <button className="flex items-center gap-1.5" onClick={() => {}}>
                <MessageCircle size={20} className="text-white" />
                <span className="text-white text-sm">{p.commentCount ?? 0}</span>
              </button>
              <button className="flex items-center gap-1.5">
                <Send size={20} className="text-white" />
                
              </button>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleSave} disabled={savePending}>
              <Bookmark size={20} style={p.savedByMe ? { fill: "white", color: "white" } : { color: "white" }} />
            </motion.button>
          </div>
        </div>

        {/* Comments sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          className="rounded-t-2xl flex flex-col"
          style={{ background: "#111111", minHeight: "50vh" }}
        >
          {/* Close handle */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div />
            <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <CommentSection postId={post.id} />
        </motion.div>
      </div>

      {/* Likes modal */}
      <LikedByModal postId={post.id} open={likesOpen} onClose={() => setLikesOpen(false)} />
    </>
  );
}