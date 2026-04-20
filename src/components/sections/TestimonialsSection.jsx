"use client";

import { useState, useEffect } from "react";
import contentData from "@/data/content.json";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const { testimonials } = contentData;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden" id="reviews">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">Real Drivers. Real Savings.</h2>
          <p className="text-lg text-primary-foreground/80">
            Don't just take our word for it. See what Canadians across the country have to say about our protection plan.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto relative"
        >
          <Quote className="absolute -top-10 -left-10 w-24 h-24 text-primary-foreground/10 rotate-180" />
          
          <div className="overflow-hidden relative min-h-[300px] flex items-center justify-center">
             {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`absolute w-full transition-all duration-500 ease-in-out text-center px-4 md:px-12 ${
                    index === currentIndex ? "opacity-100 translate-x-0" : 
                    index < currentIndex ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-white">"{testimonial.text}"</p>
                  <p className="text-md font-bold text-primary-foreground/90">— {testimonial.name}</p>
                </div>
             ))}
          </div>

          <div className="flex justify-center mt-12 gap-4">
            <button onClick={prevTestimonial} className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors backdrop-blur">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"}`}
                />
              ))}
            </div>
            <button onClick={nextTestimonial} className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors backdrop-blur">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
