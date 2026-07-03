"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function PreventionCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      title: "Undercarriage & Structural Frame",
      description: "Road salt, moisture, and chemical brines accumulate on your vehicle's frame. Without protection, structural steel weakens, posing major safety hazards and destroying resale value.",
      prevention: "Prevents structural frame decay, body floorboard rot, and underbody component deterioration.",
      image: "/rust_check_undercarriage.png",
      untreatedLabel: "Untreated: Severe Frame Corrosion",
      treatedLabel: "Treated: Clean, Self-Healing Oil Coating"
    },
    {
      title: "Inner Door Seams & Body Panels",
      description: "Moisture traps inside doors, tailgates, and rocker panels. Water pools at the bottom seams, causing paint bubbling and rust-through from the inside out before you even notice it.",
      prevention: "Prevents door panel rust-through, paint bubbling, and rocker panel degradation.",
      image: "/rust_check_door_seams.png",
      untreatedLabel: "Untreated: Paint Bubbling & Rust-Through",
      treatedLabel: "Treated: Fluid Shield Sealing Seams"
    },
    {
      title: "Brake Lines & Mechanical Cables",
      description: "Exposed metallic lines carry high-pressure brake fluid and fuel. Corroded lines become brittle and are prone to sudden leaks, causing potential braking system failure.",
      prevention: "Prevents brake line failure, fuel line leakage, and emergency cable binding.",
      image: "/rust_check_brakelines.png",
      untreatedLabel: "Untreated: Pitted & Brittle Brake Lines",
      treatedLabel: "Treated: Shiny, Protected Metallic Lines"
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
      {/* Background graphic */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">
          What Rust Check Prevents
        </h3>
        <p className="text-sm text-muted-foreground">
          See the dramatic difference between an untreated vehicle and one protected by our annual oil-based application.
        </p>
      </div>

      <div className="relative min-h-[460px] md:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left: Copy and details */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-black tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Prevention Focus: 0{activeIndex + 1}
              </span>
              
              <h4 className="text-2xl font-bold text-foreground">
                {slides[activeIndex].title}
              </h4>
              
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {slides[activeIndex].description}
              </p>

              <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
                <h5 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
                  Annual Plan Benefit
                </h5>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {slides[activeIndex].prevention}
                </p>
              </div>
            </div>

            {/* Right: Side-by-side comparison images */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-border/80 bg-zinc-950">
                <Image 
                  src={slides[activeIndex].image}
                  alt={slides[activeIndex].title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Labels overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col sm:flex-row justify-between gap-2 text-white">
                  <div className="flex items-center gap-1.5 bg-destructive/80 backdrop-blur px-2.5 py-1 rounded text-xs font-bold border border-destructive/20 shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{slides[activeIndex].untreatedLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-600/80 backdrop-blur px-2.5 py-1 rounded text-xs font-bold border border-green-500/20 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{slides[activeIndex].treatedLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel navigation */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
        {/* Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "bg-primary scale-125" : "bg-border hover:bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
