"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";
import { useEffect, useState } from "react";
import gsap from "gsap";
import Scene3D from "./Scene3D";

function WireframeNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <group position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      <Icosahedron ref={meshRef} args={[2.5, 0]}>
        <meshBasicMaterial wireframe color="#FF5A00" transparent opacity={0.15} />
      </Icosahedron>
    </group>
  );
}

export default function GlobalCanvas() {
  const activeScene = useScrollStore((state) => state.activeScene);
  const introState = useScrollStore((state) => state.introState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle Entrance on Unlock
  useEffect(() => {
    if (reducedMotion) return;
    if (introState === "unlocked" && containerRef.current) {
      const p = useScrollStore.getState().progress;
      if (p > 0) {
        gsap.set(containerRef.current, { opacity: 1, scale: 1 });
      } else {
        gsap.fromTo(containerRef.current, 
          { opacity: 0, scale: 0.95 }, 
          { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
        );
      }
    } else if ((introState === "loading" || introState === "gate") && containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
    }
  }, [introState, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center -z-10 bg-background overflow-hidden pointer-events-none">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[#131210] border border-accent/20 flex items-center justify-center translate-x-1/4">
          <span className="text-accent/50 font-mono text-xs tracking-widest uppercase">Global Network Active</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent opacity-0">
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: false }}>
        {/* Render both scenes but control visibility to prevent WebGL Context loss */}
        <group visible={activeScene === 'hero'}>
          <Scene3D />
        </group>
        <group visible={activeScene === 'stats'}>
          <WireframeNode />
        </group>
      </Canvas>
    </div>
  );
}
