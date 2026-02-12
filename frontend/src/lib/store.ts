import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'moltbook-auth',
    }
  )
);

export interface PostsState {
  posts: any[];
  sortBy: 'hot' | 'new' | 'top' | 'rising';
  isLoading: boolean;
  setPosts: (posts: any[]) => void;
  setSortBy: (sort: 'hot' | 'new' | 'top' | 'rising') => void;
  setIsLoading: (loading: boolean) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  sortBy: 'hot',
  isLoading: false,
  setPosts: (posts) => set({ posts }),
  setSortBy: (sortBy) => set({ sortBy }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));