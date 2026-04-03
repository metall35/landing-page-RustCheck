import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Fuel, Droplet, Zap, Cloud, Gauge } from "lucide-react";

const iconMap = {
  Wrench: Wrench,
  Fuel: Fuel,
  Droplet: Droplet,
  Zap: Zap,
  Cloud: Cloud,
  Gauge: Gauge,
};

export default function Coverage() {
  return (
    <Section id="coverage" className="bg-white py-20">
      <Container>
        <div className="mb-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Heading as="h2" size="lg" className="mb-4">
              A Wide Range Of Coverage
            </Heading>
            <p className="text-gray-600 mb-4">
              American Dream gives you full protection for your vehicle's most expensive systems, plus 24/7 roadside assistance, free towing, and rental car coverage.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-8xl opacity-40">🚗</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { 
              title: "Engine & Powertrain", 
              items: [
                { name: "Engine", icon: "Wrench" },
                { name: "Transmission", icon: "Zap" },
                { name: "Differential Assembly", icon: "Gauge" },
                { name: "Transfer Case", icon: "Cloud" },
                { name: "Drive Axle", icon: "Wrench" }
              ]
            },
            { 
              title: "Fuel & Cooling", 
              items: [
                { name: "Radiator", icon: "Cloud" },
                { name: "Water Pump", icon: "Droplet" },
                { name: "Fuel Pump", icon: "Fuel" }
              ]
            },
            { 
              title: "Comfort & Ride", 
              items: [
                { name: "AC System", icon: "Cloud" },
                { name: "Suspension", icon: "Wrench" },
                { name: "Brakes", icon: "Zap" }
              ]
            }
          ].map((category, idx) => (
            <Card key={idx} className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{category.title}</h3>
                <ul className="space-y-4">
                  {category.items.map((item, i) => {
                    const Icon = iconMap[item.icon] || Wrench;
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600 shrink-0" />
                        <span className="text-gray-700 text-sm">{item.name}</span>
                      </li>
                    );
                  })}
                  <li className="text-gray-500 text-sm">and more...</li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
