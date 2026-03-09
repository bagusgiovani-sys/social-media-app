"use client";

import { useState } from "react";
import { LayoutGrid, Bookmark, Heart } from "lucide-react";
import PostGrid from "@/components/post/PostGrid";
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
  activeTab?: "gallery" | "saved" | "liked";
  onTabChange?: (tab: "gallery" | "saved" | "liked") => void;
}

export default function ProfileTabs({ posts, savedPosts, likedPosts, isMyProfile, onUploadClick, activeTab, onTabChange }: Props) {
  const [internalTab, setInternalTab] = useState<"gallery" | "saved" | "liked">("gallery");
  const tab = activeTab ?? internalTab;
  const setTab = (t: "gallery" | "saved" | "liked") => {
    setInternalTab(t);
    onTabChange?.(t);
  };

  const tabs = isMyProfile
    ? [
        { key: "gallery", label: "Gallery", icon: LayoutGrid },
        { key: "saved", label: "Saved", icon: Bookmark },
        { key: "liked", label: "Liked", icon: Heart },
      ]
    : [
        { key: "gallery", label: "Gallery", icon: LayoutGrid },
        { key: "liked", label: "Liked", icon: Heart },
      ];

  const activeData =
    tab === "gallery" ? posts : tab === "saved" ? (savedPosts ?? []) : (likedPosts ?? []);

  return (
    <div className="max-w-2xl md:mx-auto">
      <div className="flex border-b border-white/[0.08]">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${tab === key ? "text-white" : "text-[#a3a3a3]"}`}
          >
            <Icon size={16} />
            {label}
            {tab === key && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-white"
              />
            )}
          </button>
        ))}
      </div>

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
            className="px-8 py-3 rounded-full text-white text-sm font-bold bg-[#7C3AED]"
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