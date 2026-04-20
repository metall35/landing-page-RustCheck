import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/LogoRustCheck.svg" 
                alt="Rust Check Logo" 
                width={200} 
                height={45} 
                className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm">
              The nation's most reliable auto protection. Engineered to fight rust, built for Canadian weather.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#coverage" className="text-muted-foreground hover:text-primary transition-colors">Coverage Details</a></li>
              <li><a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} Rust Check Protection Plan. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <span className="text-sm text-muted-foreground">Safe, Secure, and Confidential</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
