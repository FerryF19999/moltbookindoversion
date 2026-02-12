import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecentAgents from "@/components/RecentAgents";
import PostsFeed from "@/components/PostsFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RecentAgents />
      <PostsFeed />
      <Footer />
    </main>
  );
}