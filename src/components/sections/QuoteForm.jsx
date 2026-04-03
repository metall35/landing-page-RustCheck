import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import VehicleSelector from "@/components/forms/VehicleSelector";
import Card from "@/components/common/Card";

export default function QuoteForm() {
  return (
    <Section className="bg-gray-50">
      <Container>
        <Heading as="h2" size="lg" className="mb-12 text-center">
          See How Much It Costs To Protect Your Car
        </Heading>
        <Card className="mx-auto max-w-2xl p-8">
          <VehicleSelector />
        </Card>
      </Container>
    </Section>
  );
}
