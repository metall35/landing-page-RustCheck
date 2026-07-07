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
      image: "/split_undercarriage.png",
      untreatedLabel: "Untreated: Severe Frame Corrosion",
      treatedLabel: "Treated: Clean, Self-Healing Oil Coating"
    },
    {
      title: "Inner Door Seams & Body Panels",
      description: "Moisture traps inside doors, tailgates, and rocker panels. Water pools at the bottom seams, causing paint bubbling and rust-through from the inside out before you even notice it.",
      prevention: "Prevents door panel rust-through, paint bubbling, and rocker panel degradation.",
      image: "/split_door_seams_v2.png",
      untreatedLabel: "Untreated: Paint Bubbling & Rust-Through",
      treatedLabel: "Treated: Fluid Shield Sealing Seams"
    },
    {
      title: "Brake Lines & Mechanical Cables",
      description: "Exposed metallic lines carry high-pressure brake fluid and fuel. Corroded lines become brittle and are prone to sudden leaks, causing potential braking system failure.",
      prevention: "Prevents brake line failure, fuel line leakage, and emergency cable binding.",
      image: "/split_brake_lines.png",
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
    <div className="w-full max-w-6xl mx-auto mt-16 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
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

      <div className="relative min-h-[450px] sm:min-h-[540px] md:min-h-[400px] lg:min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center"
          >
            {/* Desktop View: Full-width comparison images */}
            <div className="hidden md:block w-full max-w-4xl mx-auto space-y-4">
              <div className="relative w-full aspect-[16/9] lg:aspect-[2/1] rounded-2xl overflow-hidden shadow-lg border border-border/80 bg-zinc-950">
                <Image 
                  src={slides[activeIndex].image}
                  alt={slides[activeIndex].title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Labels overlay */}
                <div className="absolute top-3 right-3 bg-destructive/95 backdrop-blur-md px-3 py-2 rounded-lg text-sm font-bold border border-destructive/35 text-white shadow-xl z-10 flex items-center gap-1.5 min-w-[120px] justify-center">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{slides[activeIndex].untreatedLabel}</span>
                </div>

                <div className="absolute top-3 left-3 bg-green-600/95 backdrop-blur-md px-3 py-2 rounded-lg text-sm font-bold border border-green-500/35 text-white shadow-xl z-10 flex items-center gap-1.5 min-w-[120px] justify-center">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{slides[activeIndex].treatedLabel}</span>
                </div>
              </div>
            </div>

            {/* Mobile View: Stacked comparison images */}
            <div className="block md:hidden w-full max-w-sm mx-auto flex flex-col rounded-2xl overflow-hidden shadow-lg border border-border/80 bg-zinc-950">
              
              {/* TOP: Treated (Left half of image) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden border-b-[6px] border-zinc-950 bg-zinc-900">
                <div className="absolute top-0 left-0 w-[200%] h-full">
                  <Image 
                    src={slides[activeIndex].image}
                    alt={`${slides[activeIndex].title} Treated`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Treated Label */}
                <div className="absolute top-3 left-3 bg-green-600/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-bold border border-green-500/35 text-white shadow-xl z-10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Treated</span>
                </div>
              </div>

              {/* BOTTOM: Untreated (Right half of image) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900">
                <div className="absolute top-0 right-0 w-[200%] h-full">
                  <Image 
                    src={slides[activeIndex].image}
                    alt={`${slides[activeIndex].title} Untreated`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Untreated Label */}
                <div className="absolute top-3 left-3 bg-destructive/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-bold border border-destructive/35 text-white shadow-xl z-10 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Untreated</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 1-Year comparison results clarification */}
      <div className="mt-3 mb-2 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 shadow-sm text-center">
          <span>Note: These results show the real-world condition of a vehicle after 1 full year without treatment vs. 1 year protected with Rust Check.</span>
        </div>
      </div>

      {/* Carousel navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
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
