"use client";

import { usePostLikes } from "@/hooks/useLike";
import { useToggleFollow } from "@/hooks/useFollow";
import { useAppSelector } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  postId: number;
  open: boolean;
  onClose: () => void;
}

function FollowBtn({ username }: { username: string }) {
  const { user } = useAppSelector((s) => s.auth);
  const { mutate: toggleFollow, isPending } = useToggleFollow(username);
  // We need isFollowing from the user data passed in
  return null; // handled inline below
}

export default function LikedByModal({ postId, open, onClose }: Props) {
  const { data, isLoading } = usePostLikes(postId);
  const { user: me } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const users = data?.data ?? [];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70"
          />

          {/* Modal — slides up on mobile, centered on PC */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed z-50 w-full max-w-md"
            style={{
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="rounded-t-2xl md:rounded-2xl md:mb-0 overflow-hidden"
              style={{ background: "#111111", maxHeight: "80vh" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <h3 className="text-white font-bold text-lg">Likes</h3>
                <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* List */}
              <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-10">No likes yet</p>
                ) : (
                  users.map((u: any) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      isMe={me?.username === u.username}
                      onNavigate={() => { onClose(); router.push(`/profile/${u.username}`); }}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function UserRow({ user, isMe, onNavigate }: { user: any; isMe: boolean; onNavigate: () => void }) {
  const { mutate: toggleFollow, isPending } = useToggleFollow(user.username);

  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div
        onClick={onNavigate}
        className="cursor-pointer w-11 h-11 rounded-full overflow-hidden bg-zinc-800 shrink-0"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onNavigate}>
        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
        <p className="text-zinc-500 text-xs truncate">@{user.username}</p>
      </div>

      {!isMe && (
        user.isFollowedByMe ? (
          <button
            onClick={() => toggleFollow(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-white border border-zinc-600 transition-opacity disabled:opacity-50"
          >
            <CheckCircle size={14} className="text-zinc-400" />
            Following
          </button>
        ) : (
          <button
            onClick={() => toggleFollow(false)}
            disabled={isPending}
            className="px-5 py-1.5 rounded-full text-sm font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: "#7C3AED" }}
          >
            Follow
          </button>
        )
      )}
    </div>
  );
}