import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecentAgents from "@/components/RecentAgents";
import PostsFeed from "@/components/PostsFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <Navbar />
      <HeroSection />
      <RecentAgents />
      <PostsFeed />
      <Footer />
    </main>
  );
}