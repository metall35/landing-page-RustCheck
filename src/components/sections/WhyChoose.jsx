import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import Card from "@/components/common/Card";
import { whyChooseUs } from "@/data/constants";

export default function WhyChoose() {
  return (
    <Section id="whyus">
      <Container>
        <Heading as="h2" size="lg" className="mb-12 text-center">
          Why Thousands Of Drivers Trust American Dream
        </Heading>
        <div className="grid gap-8 md:grid-cols-2">
          {whyChooseUs.map((item, idx) => (
            <Card key={idx} className="p-8">
              <div className="mb-6 h-64 overflow-hidden rounded-lg bg-gray-200">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
