"use client";

import { useState } from "react";
import { Check, ShieldCheck, Play, Tv } from "lucide-react";
import { motion } from "framer-motion";

// Configuration for easy video configuration
const YOUTUBE_VIDEO_ID = ""; // Leave blank for mock player, or insert YouTube Video ID (e.g. "F3xO2LpW9d0")

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-gradient-to-b from-background via-background to-muted/20" id="home">
      {/* Background with abstract red gradient blob */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column: Heading and details */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/80 border border-primary/20 text-xs md:text-sm font-semibold backdrop-blur shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Newmarket Store - Now Booking Appointments
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              The All-In-1 Rust Protection Plan Designed to Extend Your Vehicle's Life
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Defending against salt, snow, and harsh elements while preserving resale value.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center text-md md:text-lg font-medium text-foreground/90">
                <div className="mr-3 p-1.5 rounded-full bg-primary/15 text-primary shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                Engineered to fight rust, built for 🇨🇦 Canadian weather
              </li>
              <li className="flex items-center text-md md:text-lg font-medium text-foreground/90">
                <div className="mr-3 p-1.5 rounded-full bg-primary/15 text-primary shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                Time-tested, oil-based rust inhibitors
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
              >
                Calculate Protection Price
              </button>
              <button 
                onClick={() => document.getElementById("contact-location")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-card text-foreground border border-border font-semibold rounded-xl hover:bg-secondary/50 transition-colors text-center"
              >
                View Map & Hours
              </button>
            </div>
          </motion.div>

          {/* Right Column: Interactive Video Player */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-zinc-950 group">
              {!isPlaying ? (
                // Video Cover State
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6 select-none">
                  {/* Glassmorphic Play Button */}
                  <button 
                    onClick={handlePlayVideo}
                    className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary backdrop-blur-md flex items-center justify-center mb-4 cursor-pointer scale-100 hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl border border-white/20 group/btn"
                    aria-label="Play video"
                  >
                    <Play className="w-9 h-9 fill-current text-white translate-x-0.5 group-hover/btn:scale-105 transition-transform" />
                  </button>
                  <h3 className="font-bold text-xl md:text-2xl tracking-wide text-white drop-shadow-md">Watch How It Works</h3>
                  <p className="text-sm text-zinc-300 mt-1 opacity-90 drop-shadow-sm">See how Rust Check protects your vehicle from the inside out</p>
                  
                  {/* Decorative tag */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Demo Video
                  </div>
                </div>
              ) : (
                // Playing State
                YOUTUBE_VIDEO_ID ? (
                  <iframe 
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                    title="Rust Check - How It Works"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  // Mock playing state if YouTube ID is not configured yet
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-zinc-900 animate-fade-in">
                    <Tv className="w-16 h-16 text-primary mb-4 animate-bounce" />
                    <h4 className="text-white text-lg font-bold">Video Player Ready</h4>
                    <p className="text-zinc-400 text-sm max-w-sm mt-2">
                      This player is ready for your YouTube video. Simply open <code className="bg-zinc-800 text-primary px-1.5 py-0.5 rounded text-xs">HeroSection.jsx</code> and set the <code className="bg-zinc-800 text-primary px-1.5 py-0.5 rounded text-xs">YOUTUBE_VIDEO_ID</code> variable.
                    </p>
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-lg transition-colors border border-zinc-700"
                    >
                      Back to Cover
                    </button>
                  </div>
                )
              )}
              {/* Fallback pattern background layer */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-850 via-zinc-950 to-black z-0 pointer-events-none opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
