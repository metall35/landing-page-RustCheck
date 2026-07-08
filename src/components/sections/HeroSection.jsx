"use client";

import { Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {

  const renderVideoPlayer = (isMobile = false) => (
    <div className={`relative w-full aspect-square md:aspect-video lg:aspect-[1/1] rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-zinc-950 ${isMobile ? "max-w-md mx-auto" : ""}`}>
      <video
        className="w-full h-full object-cover"
        src="/hero_video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-850 via-zinc-950 to-black z-[-1]" />
    </div>
  );

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-gradient-to-b from-background via-background to-muted/20" id="home">
      {/* Background with abstract red gradient blob */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column: Heading, Subtitle, Inline Video on Mobile, and Details */}
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
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              The <span className="text-primary">All-In-1 Rust Protection</span> Plan Designed to Extend Your Vehicle&apos;s Life
            </h1>

            {/* Mobile Video: Inserted between Subtitle and Bullets */}
            <div className="block lg:hidden w-full">
              {renderVideoPlayer(true)}
            </div>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center text-md md:text-lg font-medium text-foreground/90">
                <div className="mr-3 p-1.5 rounded-full bg-primary/15 text-primary shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                1 year rust protection that works
              </li>
              <li className="flex items-center text-md md:text-lg font-medium text-foreground/90">
                <div className="mr-3 p-1.5 rounded-full bg-primary/15 text-primary shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                Engineered to fight rust
              </li>
              <li className="flex items-center text-md md:text-lg font-medium text-foreground/90">
                <div className="mr-3 p-1.5 rounded-full bg-primary/15 text-primary shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                Built for Canada's harsh weather
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
              >
                Set Your Appointment Now
              </button>
              <button 
                onClick={() => document.getElementById("contact-location")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-card text-foreground border border-border font-semibold rounded-xl hover:bg-secondary/50 transition-colors text-center"
              >
                View Map & Hours
              </button>
            </div>
          </motion.div>

          {/* Right Column: Desktop Interactive Video Player */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 hidden lg:block"
          >
            {renderVideoPlayer(false)}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
