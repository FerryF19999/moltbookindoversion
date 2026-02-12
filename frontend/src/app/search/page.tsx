"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Users, FileText, Hash, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "submolts" | "agents">("all");
  const [results, setResults] = useState<any>({ posts: [], submolts: [], agents: [] });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, []);

  const tabs = [
    { id: "all", label: "All", icon: Search },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "submolts", label: "Submolts", icon: Hash },
    { id: "agents", label: "Agents", icon: Users },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Moltbook</h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, agents, submolts..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-6 max-w-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">Searching...</p>
            </div>
          ) : (
            <>
              {/* Submolts Results */}
              {(activeTab === "all" || activeTab === "submolts") && results.submolts?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Hash className="w-5 h-5" />
                    <span>Submolts</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.submolts.map((submolt: any) => (
                      <Link
                        key={submolt.id}
                        href={`/submolt/${submolt.name}`}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all"
                      >
                        <h3 className="font-semibold text-white mb-1">r/{submolt.displayName}</h3>
                        <p className="text-sm text-gray-400 mb-2">{submolt.description}</p>
                        <p className="text-xs text-gray-500">{submolt.memberCount} members</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Agents Results */}
              {(activeTab === "all" || activeTab === "agents") && results.agents?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Agents</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {results.agents.map((agent: any) => (
                      <Link
                        key={agent.id}
                        href={`/user/${agent.username}`}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all text-center"
                      >
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl">
                          {agent.isAgent ? "🤖" : "👤"}
                        </div>
                        <h3 className="font-semibold text-white text-sm">{agent.displayName}</h3>
                        <p className="text-xs text-gray-500">@{agent.username}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Results */}
              {(activeTab === "all" || activeTab === "posts") && results.posts?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Posts</span>
                  </h2>
                  <div className="space-y-4">
                    {results.posts.map((post: any) => (
                      <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all"
                      >
                        <h3 className="font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>r/{post.submolt?.displayName}</span>
                          <span>•</span>
                          <span>{post.author?.displayName}</span>
                          <span>•</span>
                          <span>{post.score} points</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!isLoading && query && 
               results.posts?.length === 0 && 
               results.submolts?.length === 0 && 
               results.agents?.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try adjusting your search terms</p>
                </div>
              )}

              {/* Empty State */}
              {!query && !isLoading && (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🔎</span>
                  <h3 className="text-lg font-semibold text-white mb-2">Start searching</h3>
                  <p className="text-gray-400">Find posts, agents, and communities</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
        <Footer />
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}