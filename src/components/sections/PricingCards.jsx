"use client";

import { motion } from "framer-motion";
import { Check, Car, ShieldAlert, Award } from "lucide-react";
import Image from "next/image";

export default function PricingCards() {
  const cards = [
    {
      type: "Sedan",
      price: "$149.95",
      originalPrice: "$169.95",
      popular: false,
      icon: Car,
      image: "/coverage_car.png", // fallback or we can use generic icons
      features: [
        "Full Underbody Spray",
        "Inner Panel Protection",
        "Door Seams & Crevices",
        "Engine Compartment Protection",
        "Electrical Terminals Shield",
        "Lifetime Warranty Policy"
      ]
    },
    {
      type: "SUV",
      price: "$169.95",
      originalPrice: "$189.95",
      popular: true,
      icon: Car,
      image: "/why_us_nationwide.png",
      features: [
        "Full Underbody Spray",
        "Inner Panel Protection",
        "Door Seams & Crevices",
        "Engine Compartment Protection",
        "Electrical Terminals Shield",
        "Lifetime Warranty Policy",
        "Wheel Wells Protection"
      ]
    },
    {
      type: "Truck",
      price: "$189.95",
      originalPrice: "$209.95",
      popular: false,
      icon: Car,
      image: "/why_us_roadside.png",
      features: [
        "Full Underbody Spray",
        "Inner Panel Protection",
        "Door Seams & Crevices",
        "Engine Compartment & Frame Rails",
        "Electrical Terminals Shield",
        "Lifetime Warranty Policy",
        "Tailgate & Bed Junctions"
      ]
    }
  ];

  return (
    <section className="py-20 bg-muted/10 relative overflow-hidden" id="pricing">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20">
            <Award className="w-3.5 h-3.5" /> Special Promotion
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Total Rust Protection Prices</h2>
          <p className="text-lg text-muted-foreground">
            Affordable, time-tested rust protection options built for Newmarket winters. Select your vehicle class below to begin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={card.type}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col justify-between rounded-3xl bg-card border transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1.5 overflow-hidden ${
                  card.popular ? "border-primary ring-2 ring-primary/20 scale-102 z-10 md:-translate-y-2 hover:-translate-y-3" : "border-border"
                }`}
              >
                {card.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-black tracking-wider uppercase py-1.5 px-4 rounded-bl-2xl">
                    Most Popular
                  </div>
                )}

                <div className="p-8 pb-6 border-b border-border">
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full">
                    {card.type} Program
                  </span>
                  
                  {/* Price Tag with sticker effect */}
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-foreground">{card.price}</span>
                    <span className="text-sm text-muted-foreground line-through font-medium">{card.originalPrice}</span>
                    <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/25">
                      Save $20
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">One-time annual application fee</p>
                </div>

                <div className="p-8 flex-grow">
                  <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">What's Covered:</h4>
                  <ul className="space-y-3.5">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-primary mr-3 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 pt-0">
                  <button 
                    onClick={() => {
                      document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
                      // A custom event can be fired to notify step 1 selector if we want,
                      // but for now, scroll down.
                    }}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-200 text-center ${
                      card.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/20" 
                        : "bg-secondary text-foreground hover:bg-secondary/70 border border-border"
                    }`}
                  >
                    Select {card.type} & Check In
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
