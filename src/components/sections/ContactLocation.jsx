"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Copy, Check } from "lucide-react";
import { trackPhoneClick, trackEvent } from "@/lib/gtag";
import { pixel } from "@/lib/pixel";

export default function ContactLocation() {
  const [copied, setCopied] = useState(false);
  const address = "72 George St., Newmarket, ON L3Y 4V3";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    trackEvent("copy_address", { event_category: "User Engagement", address });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-muted/20 border-t border-border" id="contact-location">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Visit Our Shop in Newmarket</h2>
          <p className="text-lg text-muted-foreground">
            Conveniently located in the heart of Newmarket. Drop by, check our hours, or call to book your appointment.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto items-stretch">
          
          {/* Left Column: Responsive Google Maps Embed */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 min-h-[350px] md:min-h-[450px] rounded-3xl overflow-hidden shadow-lg border border-border bg-card relative"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2870.0827284992523!2d-79.46083042337772!3d44.06110292589308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882ad21095cb70d5%3A0xe54fb712f5a652e7!2s72%20George%20St%2C%20Newmarket%2C%20ON%20L3Y%204V3%2C%20Canada!5e0!3m2!1sen!2sus!4v1719972352840!5m2!1sen!2sus"
              className="absolute inset-0 w-full h-full border-none"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Rust Check Newmarket Location Map"
            />
          </motion.div>

          {/* Right Column: Contact Details & Hours Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex flex-col justify-between gap-6"
          >
            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address card */}
              <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Address</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      72 George St.<br />Newmarket, ON L3Y 4V3
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCopyAddress}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-secondary hover:bg-secondary/80 rounded-xl text-xs font-bold text-foreground border border-border transition-colors w-full"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Copied Address</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Phone card */}
              <a 
                href="tel:9058533510"
                onClick={() => {
                  trackPhoneClick("9058533510", "contact_section");
                  pixel.contact("Phone Call");
                }}
                className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Phone</h4>
                    <p className="text-lg font-black text-foreground mt-2 group-hover:text-primary transition-colors">
                      905-853-3510
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Click to call Newmarket shop</p>
                  </div>
                </div>
              </a>

              {/* Email card */}
              <a 
                href="mailto:sales@rustchecknewmarket.ca"
                onClick={() => {
                  trackEvent("contact_email_click", { event_category: "Conversion", email: "sales@rustchecknewmarket.ca" });
                  pixel.contact("Email");
                }}
                className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/30 transition-all group col-span-1 sm:col-span-2"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Email Support</h4>
                    <p className="text-md font-bold text-foreground mt-1.5 leading-relaxed break-all group-hover:text-primary transition-colors">
                      sales@rustchecknewmarket.ca
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">For quotes, questions, or scheduling</p>
                  </div>
                </div>
              </a>

            </div>

            {/* Operating Hours card */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-4 flex-grow justify-center">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Hours of Operation</h4>
              </div>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground">8:30 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between font-medium border-t border-border/40 pt-2.5">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between font-medium border-t border-border/40 pt-2.5">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-destructive font-bold uppercase tracking-wider text-xs bg-destructive/10 px-2 py-0.5 rounded-md border border-destructive/20">Closed</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
