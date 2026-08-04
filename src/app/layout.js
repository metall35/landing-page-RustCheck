import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PIXEL_ID } from "@/lib/pixel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://landing-page-rust-check.vercel.app");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rust Check Newmarket — All-In-1 Vehicle Rust Protection",
  description: "Engineered for Canada's harsh weather. Extend your vehicle's life with professional rust protection in Newmarket. Set your appointment now!",
  keywords: ["Rust Check", "Rust Protection", "Newmarket", "Car Rust Control", "Undercoating", "Vehicle Life Extension"],
  icons: {
    icon: "/LogoRustCheck.svg",
    shortcut: "/LogoRustCheck.svg",
    apple: "/LogoRustCheck.svg",
  },
  openGraph: {
    title: "Rust Check Newmarket — All-In-1 Vehicle Rust Protection",
    description: "Engineered for Canada's harsh weather. Extend your vehicle's life with professional rust protection in Newmarket. Set your appointment now!",
    url: siteUrl,
    siteName: "Rust Check Newmarket",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
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
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-34J4G4DS01";

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-inter">
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
