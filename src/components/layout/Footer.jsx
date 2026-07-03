import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border pt-12 pb-8">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image 
              src="/LogoRustCheck.svg" 
              alt="Rust Check Logo" 
              width={180} 
              height={40} 
              className="h-9 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            The nation's most reliable auto protection. Engineered to fight rust, built for Canadian weather.
          </p>
        </div>

        <div className="pt-6 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Rust Check Protection Plan. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <span className="text-xs text-muted-foreground font-semibold">Safe, Secure, and Confidential</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
