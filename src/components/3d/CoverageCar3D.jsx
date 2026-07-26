"use client";

import { Canvas } from "@react-three/fiber";
import { useFBX, PresentationControls, Stage, Html } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

function CarModelWithHotspots({ activeCategory, setActiveCategory }) {
  const fbx = useFBX("/Car.fbx");

  // Paint the car body red, wheels silver, tires black, glass transparent
  useEffect(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        const name = child.name.toLowerCase();
        
        // Body paint - glossy red
        if (
          name.includes("body") || 
          name.includes("paint") || 
          name.includes("door") || 
          name.includes("hood") || 
          name.includes("bumper") || 
          name.includes("fender") || 
          name.includes("spoiler") || 
          name.includes("trunk") || 
          name.includes("wing") ||
          name.includes("mirror") ||
          name.includes("shell")
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#cc1111"), // Rust Check Red
            metalness: 0.85,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
          });
        } 
        // Tires
        else if (name.includes("tire") || name.includes("rubber")) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#151515"),
            metalness: 0.05,
            roughness: 0.85
          });
        }
        // Wheels / Rims
        else if (name.includes("wheel") || name.includes("rim") || name.includes("hub") || name.includes("spoke")) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d0d0d0"),
            metalness: 0.9,
            roughness: 0.1
          });
        }
        // Windows / Glass
        else if (name.includes("glass") || name.includes("window") || name.includes("windshield")) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#0c0c0c"),
            transparent: true,
            opacity: 0.7,
            roughness: 0.05,
            metalness: 0.1
          });
        }
        // Fallback for main car parts
        else if (name.includes("car") || name.includes("porsche") || name.includes("mesh")) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#cc1111"),
            metalness: 0.85,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
          });
        }
      }
    });
  }, [fbx]);

  // Coordinates set precisely by user via 3D Modulator tool:
  const hotspots = [
    { index: 0, label: "1", pos: [-3.15, -1.02, 0.7], lineClass: "down" },
    { index: 1, label: "2", pos: [-0.08, -0.38, 0.05], lineClass: "down" },
    { index: 2, label: "3", pos: [0.65, -0.17, -1.2], lineClass: "down" },
    { index: 3, label: "4", pos: [0.15, -0.32, -3.7], lineClass: "up" }
  ];

  return (
    <group>
      <primitive object={fbx} rotation={[0, -Math.PI / 10, 0]} />
      {hotspots.map((spot) => {
        const isActive = activeCategory === spot.index;
        return (
          <Html 
            key={spot.index} 
            position={spot.pos} 
            center 
            className="pointer-events-none select-none"
          >
            <div className="relative pointer-events-auto flex items-center justify-center">
              <div 
                onClick={() => setActiveCategory(spot.index)}
                className={`absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer border-2 border-white shadow-md transition-all duration-300 z-30 ${
                  isActive ? "bg-primary scale-125 animate-pulse" : "bg-primary/95 hover:bg-primary"
                }`}
              />

              {spot.lineClass === "down" ? (
                <div className="absolute top-[7px] flex flex-col items-center z-20">
                  <div className={`w-0.5 h-6 bg-primary/70 transition-all duration-300 origin-top ${isActive ? "h-9 bg-primary" : ""}`} />
                  <button
                    onClick={() => setActiveCategory(spot.index)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border transition-all duration-300 ${
                      isActive 
                        ? "bg-primary text-white scale-110 border-primary ring-4 ring-primary/20" 
                        : "bg-background border-border text-foreground hover:bg-primary hover:text-white"
                    }`}
                  >
                    {spot.label}
                  </button>
                </div>
              ) : (
                <div className="absolute bottom-[7px] flex flex-col-reverse items-center z-20">
                  <div className={`w-0.5 h-6 bg-primary/70 transition-all duration-300 origin-bottom ${isActive ? "h-9 bg-primary" : ""}`} />
                  <button
                    onClick={() => setActiveCategory(spot.index)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border transition-all duration-300 ${
                      isActive 
                        ? "bg-primary text-white scale-110 border-primary ring-4 ring-primary/20" 
                        : "bg-background border-border text-foreground hover:bg-primary hover:text-white"
                    }`}
                  >
                    {spot.label}
                  </button>
                </div>
              )}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

export default function CoverageCar3D({ activeCategory, setActiveCategory }) {
  return (
    <div style={{ width: "100%", height: "500px" }} className="relative rounded-3xl overflow-hidden cursor-default bg-gradient-to-br from-card via-background to-muted border border-border shadow-lg group">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-primary/20 blur-[120px] rounded-full opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 pointer-events-none" />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4, 2, 4], fov: 45 }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <PresentationControls enabled={false} speed={0} cursor={false} global zoom={4.5} polar={[-0.1, Math.PI / 4]}>
            <Stage environment="city" intensity={1} shadows={false}>
              <CarModelWithHotspots activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>

    </div>
  );
}