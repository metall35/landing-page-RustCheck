import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rustcheck.ca"),
  title: "Rust Check Newmarket — All-In-1 Vehicle Rust Protection",
  description: "Engineered for Canada's harsh weather. Extend your vehicle's life with professional rust protection in Newmarket. Set your appointment now!",
  keywords: ["Rust Check", "Rust Protection", "Newmarket", "Car Rust Control", "Undercoating", "Vehicle Life Extension"],
  openGraph: {
    title: "Rust Check Newmarket — All-In-1 Vehicle Rust Protection",
    description: "Engineered for Canada's harsh weather. Extend your vehicle's life with professional rust protection in Newmarket. Set your appointment now!",
    url: "/",
    siteName: "Rust Check Newmarket",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rust Check Vehicle Rust Protection",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rust Check Newmarket — All-In-1 Vehicle Rust Protection",
    description: "Engineered for Canada's harsh weather. Extend your vehicle's life with professional rust protection in Newmarket.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-inter">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
