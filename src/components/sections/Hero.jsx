import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";
import InfoCard from "@/components/common/InfoCard";

export default function Hero() {
    return (
        <>
            <Section className="bg-gray-200 py-20">
                <Container>
                    <div className="grid items-start gap-8 md:grid-cols-2">
                        <div className="flex flex-col">
                            <Heading as="h1" size="xl" className="mb-4 ">
                                Finally... An Affordable All-In-1 Car Protection Plan
                            </Heading>
                            <p className="mb-6 text-lg">
                                That Covers Engine, Brakes, Transmission & More - From ~$99/Month*
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button variant="primary">
                                    Get a Quote
                                </Button>
                                <Button variant="outline" className="border-white hover:bg-white hover:text-gray-900">
                                    Learn More
                                </Button>
                            </div>
                            <div className="mt-8 mb-8">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">✓</span>
                                    <span>Free 24/7 towing & rental car included</span>
                                </div>
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                                <InfoCard
                                    icon="☎️"
                                    title="24/7"
                                    subtitle="Roadside assistance anywhere in the U.S."
                                />
                                <InfoCard
                                    icon="⭐"
                                    title="8,500+"
                                    subtitle="Verified 5-star reviews"
                                />
                                <InfoCard
                                    icon="🔧"
                                    title="250,000+"
                                    subtitle="ASE-licensed repair shops nationwide"
                                />
                            </div>
                        </div>
                        <div className="rounded-lg bg-gray-400 p-8">
                            <div className="aspect-square bg-gray-500 rounded-lg flex items-center justify-center">
                                <span className="text-6xl">🚗</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
}
