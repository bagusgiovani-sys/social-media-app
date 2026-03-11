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

export default function LikedByModal({ postId, open, onClose }: Props) {
  // Only fetch when modal is open, and refetch every time it opens
  const { data, isLoading } = usePostLikes(postId, open);
  const { user: me } = useAppSelector((s) => s.auth);
  const router = useRouter();
  // data is User[] directly, not { users: [] }
  const users = Array.isArray(data) ? data : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70"
          />

          {/* Mobile: slides up from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="md:hidden block fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-t-2xl overflow-hidden bg-[#111111]"
            style={{ maxHeight: "80vh" }}
          >
            <ModalContent users={users} isLoading={isLoading} me={me} onClose={onClose} router={router} />
          </motion.div>

          {/* Desktop: centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl overflow-hidden bg-[#111111]"
            style={{ maxHeight: "80vh" }}
          >
            <ModalContent users={users} isLoading={isLoading} me={me} onClose={onClose} router={router} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalContent({ users, isLoading, me, onClose, router }: any) {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h3 className="text-white font-bold text-lg">Likes</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

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
    </>
  );
}

function UserRow({ user, isMe, onNavigate }: { user: any; isMe: boolean; onNavigate: () => void }) {
  const { mutate: toggleFollow, isPending } = useToggleFollow(user.username);

  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div onClick={onNavigate} className="cursor-pointer w-11 h-11 rounded-full overflow-hidden bg-zinc-800 shrink-0">
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
            <CheckCircle size={14} className="text-zinc-400" /> Following
          </button>
        ) : (
          <button
            onClick={() => toggleFollow(false)}
            disabled={isPending}
            className="px-5 py-1.5 rounded-full text-sm font-bold text-white bg-[#7C3AED] transition-opacity disabled:opacity-50"
          >
            Follow
          </button>
        )
      )}
    </div>
  );
}