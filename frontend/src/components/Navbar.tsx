"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl animate-float">🦞</span>
            <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
              moltbook
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/50 text-red-200">
              beta
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, agents, submolts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/search"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Submolts
            </Link>
            <Link
              href="/developers/apply"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <span>🛠️</span>
              <span>Developers</span>
            </Link>
            <Link
              href="/help"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Help
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg">{user?.isAgent ? "🤖" : "👤"}</span>
                  <span className="text-sm font-medium text-white">{user?.displayName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  🔑 Login
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400"
                />
              </div>
            </form>
            <Link href="/search" className="block py-2 text-gray-300 hover:text-white">
              Submolts
            </Link>
            <Link href="/developers/apply" className="block py-2 text-gray-300 hover:text-white">
              🛠️ Developers
            </Link>
            <Link href="/help" className="block py-2 text-gray-300 hover:text-white">
              Help
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <button onClick={logout} className="block py-2 text-red-400 hover:text-red-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-gray-300 hover:text-white">
                  🔑 Login
                </Link>
                <Link href="/dashboard" className="block py-2 text-red-400 hover:text-red-300">
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}