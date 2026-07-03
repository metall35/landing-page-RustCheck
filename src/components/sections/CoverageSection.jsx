"use client";

import { useState } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const CoverageCar3D = dynamic(() => import("@/components/3d/CoverageCar3D"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] md:min-h-[500px] bg-black/90 flex flex-col items-center justify-center text-primary">
      <Loader2 className="w-10 h-10 animate-spin mb-4" />
      <span className="text-sm font-semibold tracking-wider">LOADING 3D MODEL...</span>
    </div>
  )
});

export default function CoverageSection() {
  const { coverage } = contentData;
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <section className="py-24 bg-muted/30 border-y border-border" id="coverage">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">A Wide Range Of Coverage</h2>
          <p className="text-lg text-muted-foreground">
            Our All-In-1 Rust Protection Plan is designed to cover the most vulnerable parts of your vehicle. Interact with the hotspots on the 3D model or hover over the cards below to see details.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column: 3D Interactive Model */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative"
          >
            <CoverageCar3D activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </motion.div>

          {/* Right Column: Grid of coverage items (2x2) */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coverage.map((section, index) => {
              const isActive = activeCategory === index;
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                  onClick={() => setActiveCategory(isActive ? null : index)}
                  className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col cursor-pointer ${
                    isActive 
                      ? "bg-primary/5 border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]" 
                      : "bg-card border-border hover:shadow-md hover:border-primary/30"
                  }`}
                >
                  <h3 className="text-lg font-bold mb-3 text-foreground border-b pb-2 flex items-center justify-between">
                    <span>{section.title}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                      isActive 
                        ? "bg-primary border-primary text-white scale-110" 
                        : "bg-secondary border-border text-muted-foreground"
                    }`}>
                      {index + 1}
                    </span>
                  </h3>
                  <ul className="space-y-2.5 flex-grow">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <CheckCircle2 className={`w-4.5 h-4.5 mr-2.5 shrink-0 mt-0.5 transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-primary/70"
                        }`} />
                        <span className="text-muted-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
