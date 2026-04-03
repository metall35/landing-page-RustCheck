import Navbar from "@/components/common/Navbar";
import Hero from "@/components/sections/Hero";
import Coverage from "@/components/sections/Coverage";
import Reliability from "@/components/sections/Reliability";
import WhyChoose from "@/components/sections/WhyChoose";
import QuoteForm from "@/components/sections/QuoteForm";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <Hero />
      <QuoteForm />
      <Coverage />
      <Reliability />
      <WhyChoose />
      <Testimonials />
    </main>
  );
}
