"use client";

import { useUserProfile, useUserPosts, useUserLikes } from "@/hooks/useUsers";
import { use } from "react";
import { useAppSelector } from "@/store";
import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FollowListModal from "@/components/modals/FollowListModal";

type FollowModal = "followers" | "following" | null;

interface Props {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: Props) {
  const { username } = use(params);
  const { user: me } = useAppSelector((s) => s.auth);
  const { data: profileData, isLoading } = useUserProfile(username);
  const { data: postsData } = useUserPosts(username);
  const { data: likesData } = useUserLikes(username);
  const [followModal, setFollowModal] = useState<FollowModal>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileData) return <div className="text-center py-20 text-zinc-500">User not found.</div>;

  // Normalize API shape → ProfileHeader shape
  const profile = {
    id: profileData.id,
    name: profileData.name,
    username: profileData.username,
    avatarUrl: profileData.avatarUrl,
    bio: profileData.bio,
    postsCount: profileData.counts?.post ?? 0,
    followersCount: profileData.counts?.followers ?? 0,
    followingCount: profileData.counts?.following ?? 0,
    likesCount: profileData.counts?.likes ?? 0,
    isFollowedByMe: profileData.isFollowing ?? false,
  };

  const posts = Array.isArray(postsData) ? postsData : [];
  const likedPosts = Array.isArray(likesData) ? likesData : [];
  const isMyProfile = me?.username === username;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <ProfileHeader
        profile={profile}
        isMyProfile={isMyProfile}
        onFollowersClick={() => setFollowModal("followers")}
        onFollowingClick={() => setFollowModal("following")}
      />

      <ProfileTabs
        posts={posts}
        likedPosts={likedPosts}
        isMyProfile={isMyProfile}
      />

      <FollowListModal
        open={followModal !== null}
        type={followModal ?? "followers"}
        username={username}
        onClose={() => setFollowModal(null)}
      />
    </div>
  );
}