"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
    { name: "Why Us", href: "#why-us" },
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })} className="font-bold rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">
              Get A Quote
            </Button>
          </div>
        </div>

        {/* Mobile Toggle & Theme */}
        <div className="flex items-center md:hidden space-x-2">
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
            <Button className="w-full font-bold" onClick={() => { document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}>
              Get A Quote
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
