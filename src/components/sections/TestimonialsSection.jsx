"use client";

import { Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const googleReviews = [
    {
      name: "Michael Seguin",
      avatarBg: "bg-blue-500",
      initial: "M",
      role: "Local Guide",
      reviewsCount: 24,
      rating: 5,
      date: "3 weeks ago",
      text: "I’ve been taking my F-150 here for three years now. The salt in Newmarket winters is brutal, but thanks to this annual protection plan, my undercarriage still looks brand new. The oil spray penetrates everywhere and doesn't drip like others. Highly recommend Reagan   and his team!"
    },
    {
      name: "Sarah Jenkins",
      avatarBg: "bg-red-500",
      initial: "S",
      role: "Verified Customer",
      reviewsCount: 5,
      rating: 5,
      date: "1 month ago",
      text: "The peace of mind is worth every penny. I bought a brand new SUV and drove it straight to Rust Check. They were extremely fast, professional, and walked me through the coverage. It's a clean application, and the lifetime warranty is solid."
    },
    {
      name: "David L.",
      avatarBg: "bg-green-600",
      initial: "D",
      role: "Local Guide",
      reviewsCount: 42,
      rating: 5,
      date: "2 months ago",
      text: "Best investment you can make for a car in Ontario. My last sedan lasted 12 years with zero structural rust. The resale value was excellent when I traded it in. Great customer service at the Newmarket shop!"
    }
  ];

  return (
    <section className="py-24 bg-card border-t border-border" id="reviews">
      <div className="container mx-auto px-4">
        
        {/* Google Review Badge Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto mb-16 border-b border-border pb-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Real Drivers. Real Reviews.</h2>
            <p className="text-muted-foreground">Hear from our satisfied customers in <b>Newmarket</b>.</p>
          </div>
          
          <div className="flex items-center gap-5 p-5 bg-muted/40 rounded-2xl border border-border shadow-sm shrink-0">
            {/* Google G Logo SVG */}
            <div className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center text-2xl font-black shrink-0 border border-border">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-foreground">4.9</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">Based on 142 reviews on Google</p>
            </div>
          </div>
        </div>

        {/* Google Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {googleReviews.map((review, index) => (
            <motion.div 
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: User avatar and credentials */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${review.avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0`}>
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground leading-tight">{review.name}</h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      {review.role} • {review.reviewsCount} reviews
                    </p>
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">{review.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &quot;{review.text}&quot;
                </p>
              </div>

              {/* Verified badge */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="w-3.5 h-3.5 fill-current text-white bg-green-500 rounded-full" />
                  Verified Google Review
                </span>
                <span className="opacity-80">5/5 Star</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sync Info Footer */}
        <div className="text-center mt-12 text-xs text-muted-foreground/80 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Google reviews are synchronized and updated automatically every 2 months.
          </span>
        </div>

      </div>
    </section>
  );
}
