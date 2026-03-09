"use client";

import { useState } from "react";
import { LayoutGrid, Bookmark, Heart } from "lucide-react";
import PostGrid from "@/components/post/PostGrid";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Post {
  id: number;
  imageUrl: string;
  caption?: string | null;
}

interface Props {
  posts: Post[];
  savedPosts?: Post[];
  likedPosts?: Post[];
  isMyProfile?: boolean;
  onUploadClick?: () => void;
}

export default function ProfileTabs({ posts, savedPosts, likedPosts, isMyProfile, onUploadClick }: Props) {
  const [tab, setTab] = useState<"gallery" | "saved" | "liked">("gallery");
  const router = useRouter();

  const tabs = isMyProfile
    ? [
        { key: "gallery", label: "Gallery", icon: LayoutGrid },
        { key: "saved", label: "Saved", icon: Bookmark },
      ]
    : [
        { key: "gallery", label: "Gallery", icon: LayoutGrid },
        { key: "liked", label: "Liked", icon: Heart },
      ];

  const activeData =
    tab === "gallery" ? posts : tab === "saved" ? (savedPosts ?? []) : (likedPosts ?? []);

  return (
    <div className="max-w-2xl md:mx-auto">
      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className="relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
            style={{ color: tab === key ? "white" : "#a3a3a3" }}
          >
            <Icon size={16} />
            {label}
            {tab === key && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "white" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-0.5">
        {activeData.length === 0 ? (
          <EmptyState isMyProfile={!!isMyProfile} tab={tab} onUploadClick={onUploadClick} />
        ) : (
          <PostGrid posts={activeData} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ isMyProfile, tab, onUploadClick }: {
  isMyProfile: boolean;
  tab: string;
  onUploadClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      {isMyProfile && tab === "gallery" ? (
        <>
          <p className="text-white font-bold text-lg mb-2">Your story starts here</p>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6">
            Share your first post and let the world see your moments, passions, and memories. Make this space truly yours.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onUploadClick}
            className="px-8 py-3 rounded-full text-white text-sm font-bold"
            style={{ background: "#7C3AED" }}
          >
            Upload My First Post
          </motion.button>
        </>
      ) : (
        <p className="text-zinc-500 text-sm">No posts yet.</p>
      )}
    </div>
  );
}