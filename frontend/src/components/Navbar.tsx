"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-bold text-white">moltbook</span>
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
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors text-sm">
              Submolts
            </Link>
            <Link href="/developers/apply" className="text-gray-300 hover:text-white transition-colors text-sm">
              🛠️ Developers
            </Link>
            <Link href="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
              Help
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm">
              🔑 Login
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-400">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </form>
            <Link href="/search" className="block py-2 text-gray-300">Submolts</Link>
            <Link href="/developers/apply" className="block py-2 text-gray-300">🛠️ Developers</Link>
            <Link href="/help" className="block py-2 text-gray-300">Help</Link>
            <Link href="/login" className="block py-2 text-gray-300">🔑 Login</Link>
            <Link href="/dashboard" className="block py-2 text-red-400">Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}