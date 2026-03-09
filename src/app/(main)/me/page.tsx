"use client";

import { useMe, useMyPosts, useMySaved, useMyLikes } from "@/hooks/useMe";
import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import EditProfileModal from "@/components/profile/EditProfileModal";
import FollowListModal from "@/components/modals/FollowListModal";
import CreatePostModal from "@/components/post/CreatePostModal";
import { motion } from "framer-motion";

type FollowModal = "followers" | "following" | null;

export default function MePage() {
  const { data: profile, isLoading } = useMe();
  const { data: postsData } = useMyPosts();
  const { data: savedData } = useMySaved();
  const { data: likedData } = useMyLikes();
  const [editOpen, setEditOpen] = useState(false);
  const [followModal, setFollowModal] = useState<FollowModal>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "saved" | "liked">("gallery");

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const posts = Array.isArray(postsData) ? postsData : [];
  const savedPosts = Array.isArray(savedData) ? savedData : [];
  const likedPosts = Array.isArray(likedData) ? likedData : [];

  const p = profile.profile ?? profile;
  const normalizedProfile = {
    id: p.id,
    name: p.name,
    username: p.username,
    avatarUrl: p.avatarUrl,
    bio: p.bio,
    postsCount: profile.stats?.posts ?? 0,
    followersCount: profile.stats?.followers ?? 0,
    followingCount: profile.stats?.following ?? 0,
    likesCount: profile.stats?.likes ?? 0,
  };

  return (
    <motion.div
      className="bg-[#0a0a0a] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        <ProfileHeader
          profile={normalizedProfile}
          isMyProfile
          onEditClick={() => setEditOpen(true)}
          onFollowersClick={() => setFollowModal("followers")}
          onFollowingClick={() => setFollowModal("following")}
          onLikesClick={() => setActiveTab("liked")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <ProfileTabs
          posts={posts}
          savedPosts={savedPosts}
          likedPosts={likedPosts}
          isMyProfile
          onUploadClick={() => setCreateOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <FollowListModal
        open={followModal !== null}
        type={followModal ?? "followers"}
        onClose={() => setFollowModal(null)}
      />
    </motion.div>
  );
}