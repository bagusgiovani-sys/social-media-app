export interface User {
  id: number;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByMe?: boolean;
  isMe?: boolean;
  followsMe?: boolean;
}