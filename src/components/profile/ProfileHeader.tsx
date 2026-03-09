"use client";

import { useToggleFollow } from "@/hooks/useFollow";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Profile {
  id: number;
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  isFollowedByMe?: boolean;
}

interface Props {
  profile: Profile;
  isMyProfile: boolean;
  onEditClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onLikesClick?: () => void;
}

export default function ProfileHeader({
  profile,
  isMyProfile,
  onEditClick,
  onFollowersClick,
  onFollowingClick,
  onLikesClick,
}: Props) {
  const router = useRouter();
  const { mutate: toggleFollow, isPending } = useToggleFollow(profile.username);

  const stats = [
    { label: "Post", value: profile.postsCount ?? 0, onClick: undefined },
    { label: "Followers", value: profile.followersCount ?? 0, onClick: onFollowersClick },
    { label: "Following", value: profile.followingCount ?? 0, onClick: onFollowingClick },
    { label: "Likes", value: profile.likesCount ?? 0, onClick: isMyProfile ? onLikesClick : undefined },
  ];

  return (
    <div className="bg-[#0a0a0a]">
      {/* Mobile header bar */}
      <div className="flex items-center justify-between px-4 h-14 md:hidden">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={22} />
        </button>
        <span className="text-white font-semibold text-base">{profile.name}</span>
        <div className="w-8" />
      </div>

      {/* Profile info */}
      <div className="px-4 md:px-0 pt-2 md:pt-6 pb-2 max-w-2xl md:mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-zinc-800 shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-base leading-tight">{profile.name}</p>
            <p className="text-zinc-500 text-sm">{profile.username}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isMyProfile ? (
              <button
                onClick={onEditClick}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                Edit Profile
              </button>
            ) : profile.isFollowedByMe ? (
              <button
                onClick={() => toggleFollow(true)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold text-white border border-zinc-700 hover:border-zinc-500 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={15} className="text-zinc-400" />
                Following
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleFollow(false)}
                disabled={isPending}
                className="px-6 py-2 rounded-full text-sm font-bold text-white bg-[#7C3AED] transition-opacity disabled:opacity-50"
              >
                Follow
              </motion.button>
            )}

            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-700 text-white hover:border-zinc-500 transition-colors">
              <Send size={15} />
            </button>
          </div>
        </div>

        {profile.bio && (
          <p className="text-white text-sm leading-relaxed mb-4">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 border-t border-b border-white/[0.08]">
          {stats.map((stat, i) => (
            <button
              key={stat.label}
              onClick={stat.onClick}
              disabled={!stat.onClick}
              className={`flex flex-col items-center py-3 transition-colors ${stat.onClick ? "hover:bg-zinc-900 cursor-pointer" : "cursor-default"} ${i < 3 ? "border-r border-white/[0.08]" : ""}`}
            >
              <span className="text-white font-bold text-base">{stat.value}</span>
              <span className="text-zinc-500 text-xs mt-0.5">{stat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}