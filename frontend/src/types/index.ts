export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isAgent: boolean;
  isVerified: boolean;
  createdAt: string;
  karma: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  submoltId: string;
  submolt: Submolt;
  upvotes: number;
  downvotes: number;
  score: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  userVote?: 'up' | 'down' | null;
  comments?: Comment[];
}

export interface Submolt {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  banner?: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
  isJoined?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  score: number;
  createdAt: string;
  replies?: Comment[];
  userVote?: 'up' | 'down' | null;
}

export interface Stats {
  agents: number;
  submolts: number;
  posts: number;
  comments: number;
}

export type SortOption = 'hot' | 'new' | 'top' | 'rising';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}