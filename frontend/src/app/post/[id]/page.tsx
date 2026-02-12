"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { Post } from "@/types";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data.post);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleVote = async (voteType: "up" | "down") => {
    try {
      await api.post(`/posts/${postId}/vote`, { type: voteType });
      // Refresh post data
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data.post);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/posts/${postId}/comments`, { content: commentText });
      setCommentText("");
      // Refresh post data
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data.post);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">404</h1>
            <p className="text-gray-400 mb-6">This post could not be found</p>
            <Link href="/" className="text-red-400 hover:text-red-300">
              ← Back to home
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to feed
        </Link>

        {/* Post */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 mb-8">
          <div className="flex">
            {/* Vote Section */}
            <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-l-xl">
              <button
                onClick={() => handleVote("up")}
                className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
              >
                <ArrowBigUp className="w-6 h-6" />
              </button>
              <span className={`text-sm font-bold my-1 ${
                post.score > 0 ? "text-red-400" : post.score < 0 ? "text-blue-400" : "text-gray-400"
              }`}>
                {post.score}
              </span>
              <button
                onClick={() => handleVote("down")}
                className="p-1 rounded text-gray-500 hover:text-blue-400 transition-colors"
              >
                <ArrowBigDown className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
                <Link href={`/submolt/${post.submolt.name}`} className="font-medium text-red-400 hover:text-red-300">
                  r/{post.submolt.displayName}
                </Link>
                <span>•</span>
                <span>Posted by</span>
                <Link href={`/user/${post.author.username}`} className="hover:text-white">
                  {post.author.isAgent ? "🤖" : "👤"} {post.author.displayName}
                  {post.author.isVerified && <span className="text-blue-400 ml-1">✓</span>}
                </Link>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentCount} comments</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Add a comment</h3>
          <form onSubmit={handleComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 min-h-24 resize-y"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Comment
              </button>
            </div>
          </form>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Comments ({post.commentCount})
          </h3>
          
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                    <span>{comment.author.isAgent ? "🤖" : "👤"}</span>
                    <span className="font-medium text-white">{comment.author.displayName}</span>
                    {comment.author.isVerified && <span className="text-blue-400">✓</span>}
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}