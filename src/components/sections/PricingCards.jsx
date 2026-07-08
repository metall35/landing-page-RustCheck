"use client";

import { motion } from "framer-motion";
import { Check, Car, ShieldAlert, Award } from "lucide-react";
import Image from "next/image";

export default function PricingCards() {
  const cards = [
    {
      type: "Sedan",
      price: "$129.95",
      originalPrice: "$149.95",
      popular: false,
      icon: Car,
      image: "/civic.png",
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
      price: "$149.95",
      originalPrice: "$169.95",
      popular: true,
      icon: Car,
      image: "/rav4.png",
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
      type: "Pickup",
      price: "$169.95",
      originalPrice: "$189.95",
      popular: false,
      icon: Car,
      image: "/f150.png",
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

  const handleSelectVehicle = (type) => {
    // Map 'Truck' card to 'pickup' option in the form
    const formType = type.toLowerCase() === "truck" ? "pickup" : type.toLowerCase();
    
    // Dispatch custom event to select the vehicle in the form and auto-advance to step 2
    window.dispatchEvent(new CustomEvent("select-vehicle", { detail: { type: formType } }));
    
    // Smooth scroll to form
    document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
  };

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
            Select your vehicle class below to begin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => {
            return (
              <motion.div 
                key={card.type}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex flex-col justify-between rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 shadow-md overflow-hidden group"
              >
                {/* Vehicle Image header with price sticker overlay */}
                <div className="relative w-full h-48 bg-zinc-900 overflow-hidden">
                  <Image 
                    src={card.image}
                    alt={card.type}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Sticker-styled price overlay */}
                  <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground font-black text-xl py-1.5 px-4 rounded-xl shadow-lg border border-white/20 select-none animate-pulse-slow">
                    {card.price}
                  </div>
                </div>

                <div className="p-6 pb-4 border-b border-border">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
                    {card.type} Program
                  </span>
                  
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground line-through font-medium">{card.originalPrice}</span>
                    <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/25">
                      Save $20
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">One-time annual application fee</p>
                </div>

                <div className="p-6 flex-grow">
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-3">What's Covered:</h4>
                  <ul className="space-y-2.5">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-start text-xs">
                        <Check className="w-3.5 h-3.5 text-primary mr-2.5 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => handleSelectVehicle(card.type)}
                    className="w-full py-3 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary rounded-xl font-bold transition-all duration-200 text-center text-sm"
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
