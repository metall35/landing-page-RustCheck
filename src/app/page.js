import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CoverageSection from "@/components/sections/CoverageSection";
import TrustSection from "@/components/sections/TrustSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <Navbar />
      <main>
        <HeroSection />
        <CoverageSection />
        <TrustSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
