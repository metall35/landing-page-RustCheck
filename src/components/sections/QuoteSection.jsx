"use client";

import MultiStepForm from "@/components/form/MultiStepForm";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="quote-section-bg relative w-full py-16 border-y border-primary/10" id="quote">
      {/* Subtle decorative radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.04] blur-3xl" />
      </div>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8 flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl max-w-md mx-auto font-bold text-foreground">
              See How Much It Costs To Protect Your Car
            </h2>
            <p className="text-muted-foreground mt-3 text-lg ">
              Get an instant quote in under 2 minutes
            </p>
          </div>
          <MultiStepForm />
        </motion.div>
      </div>
    </section>
  );
}
