"use client";

import MultiStepForm from "@/components/form/MultiStepForm";
import { Check, ShieldCheck, ArrowDown } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-12" id="home">
      <div className="absolute inset-0 z-0 bg-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary border border-border text-sm font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
              24/7 Availability
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              The All-In-1 Rust Protection Plan Designed to Extend Your Vehicle's Life
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Defending against salt, snow, and harsh elements while preserving resale value.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center text-lg font-medium">
                <div className="mr-4 p-1.5 rounded-full bg-primary/20 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                Engineered to fight rust, built for 🇨🇦 Canadian weather
              </li>
            </ul>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-border group mt-8 bg-muted">
              {/* Placeholder for Video */}
              <div className="absolute inset-0 flex items-center justify-center flex-col text-foreground z-10">
                 <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 cursor-pointer text-primary-foreground transition-all">
                   <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
                 <p className="font-semibold text-lg tracking-wide">Watch How It Works</p>
              </div>
              <div className="w-full h-full bg-muted" />
            </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="lg:ml-auto lg:max-w-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">See How Much It Costs To Protect Your Car</h2>
                <ArrowDown className="w-12 h-12 mx-auto text-primary mt-4 hidden lg:block animate-bounce" />
              </div>
              <MultiStepForm />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
