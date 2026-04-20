"use client";

import Image from "next/image";
import contentData from "@/data/content.json";
import { Star, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustSection() {
  const { trust } = contentData;

  return (
    <section className="py-24 overflow-hidden relative" id="trust">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {trust.title}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {trust.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              {trust.stats.map((stat, index) => (
                <div key={index} className="flex items-center p-4 bg-secondary/50 rounded-2xl border border-border flex-1">
                  <div className="mr-4 p-3 bg-primary rounded-xl text-primary-foreground shadow-inner">
                    {index === 0 ? <Star className="w-8 h-8 fill-current" /> : <Award className="w-8 h-8" />}
                  </div>
                  <div>
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="text-sm font-semibold">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border mt-4">
              <span className="text-yellow-500 flex"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></span>
              <span className="text-sm font-medium">Verified by Canadian Drivers</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full z-0" />
            <div className="relative z-10 w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border bg-black">
              <Image 
                src="/canada_map.png"
                alt="Canada Map Coverage"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
