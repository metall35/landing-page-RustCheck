"use client";

import contentData from "@/data/content.json";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const { testimonials } = contentData;

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden border-t border-border" id="reviews">
      <div className="container mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">Real Drivers. Real Savings.</h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. See what Canadians across the country have to say about our protection plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 md:p-10 rounded-3xl border border-border flex flex-col gap-6 items-start h-full"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {testimonial.name.charAt(0)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">"{testimonial.text.substring(0, Math.min(testimonial.text.length, 60))}..."</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">{testimonial.text}</p>
                <p className="text-sm font-bold text-foreground">{testimonial.name}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
