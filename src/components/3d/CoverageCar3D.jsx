"use client";

import { Canvas } from "@react-three/fiber";
import { useFBX, PresentationControls, Stage } from "@react-three/drei";
import { Suspense } from "react";

function CarModel() {
  const fbx = useFBX("/Car.fbx");
  return <primitive object={fbx} />;
}

export default function CoverageCar3D() {
  return (
    <div style={{ width: "100%", height: "500px" }} className="relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-card via-background to-muted border border-border shadow-lg group">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-primary/20 blur-[120px] rounded-full opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 pointer-events-none" />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4, 2, 4], fov: 45 }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <PresentationControls speed={1.5} global zoom={4.5} polar={[-0.1, Math.PI / 4]}>
            <Stage environment="city" intensity={1} shadows={false}>
              <CarModel />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-background/90 backdrop-blur-md border border-border rounded-full shadow-lg pointer-events-none flex items-center gap-3 transition-transform duration-500 group-hover:-translate-y-1">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </div>
        <span className="text-sm font-semibold tracking-wider text-foreground uppercase">Interactive 3D Model</span>
      </div>
    </div>
  );
}