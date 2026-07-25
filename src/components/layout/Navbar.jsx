"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Coverage", href: "#coverage" },
    { name: "Trust", href: "#trust" },
    { name: "Reviews", href: "#reviews" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        <Link href="/" className="flex items-center">
          <Image 
            src="/LogoRustCheck.svg" 
            alt="Rust Check Logo" 
            width={180} 
            height={40} 
            className="h-8 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <a 
            href="tel:9058533510" 
            className="flex items-center gap-2 text-md font-bold text-foreground/90 hover:text-primary transition-all duration-300 hover:scale-102"
          >
            <Phone className="w-4 h-4 text-primary animate-pulse" />
            <span>905-853-3510</span>
          </a>

          <div className="flex items-center space-x-3">
            <a 
              href="#contact-location" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact-location")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-2 text-foreground/80 hover:text-primary transition-colors hover:scale-110"
              title="Our Location"
            >
              <MapPin className="w-5 h-5 text-primary" />
            </a>
            <ThemeToggle />
            <Button 
              onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })} 
              className="font-bold rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Book Now!
            </Button>
          </div>
        </div>

        {/* Mobile Toggle & Theme */}
        <div className="flex items-center md:hidden space-x-1">
          <a 
            href="tel:9058533510" 
            className="p-2 text-foreground/80 hover:text-primary transition-colors"
            title="Call Us"
          >
            <Phone className="w-4 h-4 text-primary" />
          </a>
          <a 
            href="#contact-location" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact-location")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="p-2 text-foreground/80 hover:text-primary transition-colors"
            title="Location Map"
          >
            <MapPin className="w-4 h-4 text-primary" />
          </a>
          <ThemeToggle />
          <button 
            className="p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-lg font-medium p-2 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full font-bold bg-primary hover:bg-primary/95 text-white" onClick={() => { document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}>
              Book Now!
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
