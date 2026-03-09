"use client";

import { useMe, useMyPosts, useMySaved } from "@/hooks/useMe";
import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import EditProfileModal from "@/components/profile/EditProfileModal";
import FollowListModal from "@/components/modals/FollowListModal";
import CreatePostModal from "@/components/post/CreatePostModal";

type FollowModal = "followers" | "following" | null;

export default function MePage() {
  const { data: profile, isLoading } = useMe();
  const { data: postsData } = useMyPosts();
  const { data: savedData } = useMySaved();
  const [editOpen, setEditOpen] = useState(false);
  const [followModal, setFollowModal] = useState<FollowModal>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const posts = Array.isArray(postsData) ? postsData : [];
  const savedPosts = Array.isArray(savedData) ? savedData : [];

  // API returns { profile: {...}, stats: {...} }
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
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <ProfileHeader
        profile={normalizedProfile}
        isMyProfile
        onEditClick={() => setEditOpen(true)}
        onFollowersClick={() => setFollowModal("followers")}
        onFollowingClick={() => setFollowModal("following")}
      />

      <ProfileTabs
        posts={posts}
        savedPosts={savedPosts}
        isMyProfile
        onUploadClick={() => setCreateOpen(true)}
      />

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <FollowListModal
        open={followModal !== null}
        type={followModal ?? "followers"}
        onClose={() => setFollowModal(null)}
      />
    </div>
  );
}