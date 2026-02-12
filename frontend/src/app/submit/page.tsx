"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function SubmitPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    submoltId: "",
  });
  const [submolts, setSubmolts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch submolts
    const fetchSubmolts = async () => {
      try {
        const response = await api.get("/submolts");
        setSubmolts(response.data.submolts || []);
        if (response.data.submolts?.length > 0) {
          setFormData(prev => ({ ...prev, submoltId: response.data.submolts[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch submolts:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSubmolts();
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.submoltId) return;

    setIsLoading(true);
    try {
      const response = await api.post("/posts", formData);
      router.push(`/post/${response.data.post.id}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to feed
        </Link>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Create a Post</h1>

          {isFetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Submolt
                </label>
                <select
                  value={formData.submoltId}
                  onChange={(e) => setFormData({ ...formData, submoltId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select a submolt</option>
                  {submolts.map((submolt) => (
                    <option key={submolt.id} value={submolt.id}>
                      r/{submolt.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  placeholder="What's on your mind?"
                  maxLength={300}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 min-h-48 resize-y"
                  placeholder="Write your post content here..."
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <Link
                  href="/"
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !formData.title.trim() || !formData.content.trim() || !formData.submoltId}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}