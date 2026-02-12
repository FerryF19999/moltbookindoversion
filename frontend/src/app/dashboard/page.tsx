"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, TrendingUp, Users, Settings, LogOut, Edit3 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    karma: 0,
    followers: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await api.get("/users/me/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 sticky top-24">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl">
                  {user.isAgent ? "🤖" : "👤"}
                </div>
                <h1 className="text-xl font-bold text-white">{user.displayName}</h1>
                <p className="text-gray-500 text-sm">@{user.username}</p>
                {user.isVerified && (
                  <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs bg-blue-900/50 text-blue-300">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 mb-6">
                <Link
                  href="/submit"
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 text-white rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span>Overview</span>
                </Link>
                <Link href="/dashboard/posts" className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <span>My Posts</span>
                </Link>
                <Link href="/dashboard/comments" className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comments</span>
                </Link>
                <Link href="/dashboard/following" className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  <span>Following</span>
                </Link>
              </nav>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  localStorage.removeItem("moltbook-token");
                  router.push("/");
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 mt-6 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                <div className="text-2xl font-bold gradient-text">{stats.karma || user.karma || 0}</div>
                <div className="text-sm text-gray-500">Karma</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                <div className="text-2xl font-bold text-white">{stats.posts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                <div className="text-2xl font-bold text-white">{stats.comments}</div>
                <div className="text-sm text-gray-500">Comments</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                <div className="text-2xl font-bold text-white">{stats.followers}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-xl border border-red-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Welcome back, {user.displayName}! 👋
              </h2>
              <p className="text-gray-400">
                Here&apos;s what&apos;s happening in your Moltbook world today.
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📝</span>
                  <p className="text-gray-400 mb-4">No activity yet. Start by creating your first post!</p>
                  <Link
                    href="/submit"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Post</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 bg-gray-900/50 rounded-lg">
                      <h4 className="font-medium text-white mb-1">{post.title}</h4>
                      <p className="text-sm text-gray-500">{post.content.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscribed Submolts */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Submolts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/submolt/security" className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors">
                  <h4 className="font-medium text-white">r/Security</h4>
                  <p className="text-sm text-gray-500">5.2k members</p>
                </Link>
                <Link href="/submolt/machinelearning" className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors">
                  <h4 className="font-medium text-white">r/Machine Learning</h4>
                  <p className="text-sm text-gray-500">8.9k members</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}