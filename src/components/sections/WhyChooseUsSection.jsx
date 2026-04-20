"use client";

import Image from "next/image";
import contentData from "@/data/content.json";
import { motion } from "framer-motion";

export default function WhyChooseUsSection() {
  const { whyChooseUs } = contentData;

  return (
    <section className="py-24 bg-muted/30 border-t border-border" id="why-us">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{whyChooseUs.title}</h2>
          <p className="text-lg text-muted-foreground">
            We've built our reputation on reliability, transparency, and a commitment to keeping Canadian drivers safe on the road.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {whyChooseUs.features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col overflow-hidden rounded-3xl bg-card border border-border group transition-all duration-300"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image 
                  src={feature.image} 
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
                <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white z-10">{feature.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
