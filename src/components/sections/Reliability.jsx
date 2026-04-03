import Container from "@/components/common/Container";
import Section from "@/components/common/Section";
import Heading from "@/components/common/Heading";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Reliability() {
    return (
        <Section id="reliability" className="bg-white py-20">
            <Container>
                <div className="grid gap-12 md:grid-cols-2 items-center">
                    <div>
                        <Heading as="h2" size="lg" className="mb-4">
                            The Nation's Most Reliable Auto Protection
                        </Heading>
                        <div className="mb-6 h-1 w-16 bg-red-500"></div>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            American Dream provides drivers with award-winning & affordable coverage. We aim to make people feel supported and secure, seeing ourselves as not just a provider but a friend committed to protecting your car and keeping you on the road.
                        </p>

                        <div className="space-y-4">
                            <Card className="border-gray-200">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="text-4xl">G</div>
                                    <div>
                                        <div className="flex gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">4.6 rating from 3000+ reviews</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 bg-blue-50">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="text-5xl font-bold text-blue-900">⭐</div>
                                        <div>
                                            <p className="text-sm text-gray-700 mb-1">Winner of three Buyer's Choice Awards -</p>
                                            <p className="font-bold text-blue-900">Best Service, Best Value & Best Coverage in 2025</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <svg viewBox="0 0 960 600" className="w-full max-w-md h-auto" xmlns="http://www.w3.org/2000/svg">
                            {/* Mapa simplificado de USA */}
                            <g fill="#a3e635" stroke="white" strokeWidth="2">
                                {/* Outline USA */}
                                <path d="M 200 200 L 800 200 L 800 500 L 200 500 Z" opacity="0.2" />
                            </g>

                            {/* Estados principales */}
                            <g fill="#7cb342" opacity="0.6" stroke="white" strokeWidth="1">
                                <circle cx="300" cy="250" r="15" />
                                <circle cx="400" cy="280" r="15" />
                                <circle cx="500" cy="260" r="15" />
                                <circle cx="600" cy="290" r="15" />
                                <circle cx="700" cy="270" r="15" />
                                <circle cx="350" cy="350" r="15" />
                                <circle cx="450" cy="380" r="15" />
                                <circle cx="550" cy="360" r="15" />
                                <circle cx="650" cy="370" r="15" />
                                <circle cx="750" cy="340" r="15" />
                                <circle cx="250" cy="300" r="15" />
                                <circle cx="800" cy="250" r="15" />
                            </g>

                            {/* Iconos de carro en cada punto */}
                            <g fill="none" stroke="white" strokeWidth="2">
                                {[300, 400, 500, 600, 700, 350, 450, 550, 650, 750, 250, 800].map((x, i) => {
                                    const y = [250, 280, 260, 290, 270, 350, 380, 360, 370, 340, 300, 250][i];
                                    return (
                                        <g key={i}>
                                            <circle cx={x} cy={y} r="14" fill="#7cb342" />
                                            <rect x={x - 4} y={y - 3} width="8" height="6" fill="white" rx="1" />
                                        </g>
                                    );
                                })}
                            </g>
                        </svg>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
