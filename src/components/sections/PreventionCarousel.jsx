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
      prevention: "Rust Check penetrates deep into frame joints and subframes to stop structural steel decay and underbody rot.",
      image: "/Sequence 03.00_00_57_00.Still007.jpg",
      untreatedLabel: "Untreated: Severe Frame & Suspension Corrosion"
    },
    {
      title: "Rocker Panels & Door Seams",
      description: "Moisture traps inside doors, tailgates, and rocker panels. Water pools at bottom seams, causing paint bubbling and rust-through from the inside out before you even notice it.",
      prevention: "Rust Check displaces hidden moisture and seals seams to prevent panel rust-through and paint bubbling.",
      image: "/Sequence 03.00_03_08_27.Still014.jpg",
      untreatedLabel: "Untreated: Paint Bubbling & Body Rust-Through"
    },
    {
      title: "Fender & Wheel Arch Degradation",
      description: "Debris and road spray chip away protective factory paint around wheel wells, exposing raw sheet metal to rapid oxidation and metal flaking.",
      prevention: "Rust Check creates an active barrier around wheel arches and exposed body edges to stop corrosion spread.",
      image: "/Sequence 04.00_04_03_59.Still015.jpg",
      untreatedLabel: "Untreated: Wheel Arch & Sheet Metal Flaking"
    },
    {
      title: "Underbody & High-Impact Components",
      description: "High operating temperatures mixed with road salt accelerate rust formation on exhaust systems, suspension arms, and rear axle components.",
      prevention: "Rust Check protects high-stress underbody parts and mechanical assemblies from harsh winter corrosion.",
      image: "/action camera mazda .00_04_11_27.Still007.jpg",
      untreatedLabel: "Untreated: Exhaust & Undercarriage Oxidation"
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 7000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[activeIndex];

  return (
    <div className="w-full max-w-5xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2 tracking-tight">
          What Happens Without Rust Protection
        </h3>
        <p className="text-sm text-muted-foreground">
          Real-world examples of severe vehicle corrosion caused by road salt and Canadian weather.
        </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            {/* Image Container */}
            <div className="lg:col-span-7 relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-border/80 bg-zinc-950">
              <Image 
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Warning label overlay */}
              <div className="absolute top-3 left-3 bg-destructive/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-destructive/40 text-white shadow-xl z-10 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-white animate-pulse" />
                <span>{currentSlide.untreatedLabel}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-primary">
                  Issue #{activeIndex + 1} of {slides.length}
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 leading-tight">
                  {currentSlide.title}
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-foreground/90 space-y-1">
                <div className="font-bold text-destructive flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> The Risk
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-foreground/90 space-y-1">
                <div className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> How Rust Check Protects
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                  {currentSlide.prevention}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Note */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 shadow-sm text-center">
          <span>Note: Annual Rust Check applications stop existing rust from spreading and prevent new rust formation.</span>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Prev Buttons */}
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
