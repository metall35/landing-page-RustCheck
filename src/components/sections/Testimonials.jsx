import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import Testimonial from "@/components/common/Testimonial";
import { testimonials } from "@/data/constants";

export default function Testimonials() {
  return (
    <Section id="testimonials">
      <Container>
        <Heading as="h2" size="lg" className="mb-12 text-center">
          Real Drivers. Real Repairs. Real Savings
        </Heading>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <Testimonial 
              key={idx}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
