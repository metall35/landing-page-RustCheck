import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import PricingCards from "@/components/sections/PricingCards";
import MultiStepForm from "@/components/form/MultiStepForm";
import CoverageSection from "@/components/sections/CoverageSection";
import TrustSection from "@/components/sections/TrustSection";
import PreventionCarousel from "@/components/sections/PreventionCarousel";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactLocation from "@/components/sections/ContactLocation";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <Navbar />
      <main>
        {/* 1. Hero Area (Text left, Video right) */}
        <HeroSection />
        
        {/* 2. Pricing Plans (A-B Testing Cards) */}
        <PricingCards />
        
        {/* 3. Quote Form (Centered, with modified title) */}
        <section className="py-20 bg-background border-t border-border" id="quote-form">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Tell us more about your vehicle</h2>
              <p className="text-sm text-muted-foreground mt-2">Get an instant quote in under 2 minutes</p>
            </div>
            <MultiStepForm />
          </div>
        </section>
        
        {/* 4. Interactive Coverage Section (Side-by-side 3D model & lists) */}
        <CoverageSection />
        
        {/* 5. Trust / Reliability Section (Updated Newmarket copy) */}
        <TrustSection />
        
        
        {/* 7. Treated vs Untreated Comparison Carousel */}
        <section className="py-16 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4">
            <PreventionCarousel />
          </div>
        </section>
        
        {/* 8. Google Reviews Widget (Testimonials with photos/verified badges) */}
        <TestimonialsSection />
        
        {/* 9. Contact & Map Location (Interactive Maps embed + hours) */}
        <ContactLocation />
      </main>
      <Footer />
    </div>
  );
}
