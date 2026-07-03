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

        {/* EV Coverage Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur flex flex-col sm:flex-row items-center gap-5 shadow-sm"
        >
          <div className="p-3.5 bg-primary/10 text-primary rounded-full shrink-0 flex items-center justify-center">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34 1.2-2.11 3.03-5.34 1.83-3.23 2.35-4 2.85-4h1l-1 7h3.5c.49 0 .56.33.38.66-.18.33-1.19 2.11-3.03 5.34-.33.58-.87 1-1.35 1z" />
            </svg>
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-bold text-lg text-foreground flex items-center justify-center sm:justify-start gap-2">
              ⚡ 100% Compatible con Vehículos Eléctricos (EV)
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ¿Tienes un Tesla u otro coche eléctrico? Rust Check es totalmente seguro para vehículos híbridos y eléctricos. Nuestra fórmula no conductora de electricidad protege el chasis y los paneles sin interferir con las baterías de alto voltaje, motores eléctricos, cableado o sensores del sistema.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
