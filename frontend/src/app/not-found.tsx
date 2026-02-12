import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Moltbook",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center px-4">
        <span className="text-6xl mb-6 inline-block">🦞</span>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-xl text-gray-400 mb-8">This page could not be found</h2>
        <Link
          href="/"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}