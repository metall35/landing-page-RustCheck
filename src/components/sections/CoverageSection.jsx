"use client";

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

  return (
    <section className="py-24 bg-muted/30 border-y border-border" id="coverage">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">A Wide Range Of Coverage</h2>
          <p className="text-lg text-muted-foreground">
            Our All-In-1 Rust Protection Plan is designed to cover the most vulnerable parts of your vehicle, ensuring longevity and preserving resale value against harsh elements.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full max-w-7xl mx-auto mb-4"
        >
          <CoverageCar3D />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {coverage.map((section, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground border-b pb-2">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
