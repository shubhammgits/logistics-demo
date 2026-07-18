"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function ShippingLane({ start, end, progressOffset, duration = 0.25 }: { start: THREE.Vector3, end: THREE.Vector3, progressOffset: number, duration?: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const curve = useMemo(() => {
    const distance = start.distanceTo(end);
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(2 + distance * 0.2); 
    return new THREE.CatmullRomCurve3([start, midPoint, end]);
  }, [start, end]);

  useFrame(() => {
    const rawP = useScrollStore.getState().progress;
    
    // Phase 1: Draw in (0 to 0.55)
    let p1 = rawP / 0.55;
    p1 = THREE.MathUtils.clamp(p1, 0, 1);
    let localP = (p1 - progressOffset) / duration;
    localP = THREE.MathUtils.clamp(localP, 0, 1);
    
    // Phase 2: Fade opacity (0.72 to 0.8)
    let pFade = (rawP - 0.85) / 0.15;
    pFade = THREE.MathUtils.clamp(pFade, 0, 1);
    const opacity = 1 - pFade;

    // Phase 2: Overexposure pulse (0.55 to 0.8)
    let pPulse = (rawP - 0.55) / 0.45;
    pPulse = THREE.MathUtils.clamp(pPulse, 0, 1);
    const pulse = Math.sin(pPulse * Math.PI) * 2.0;

    if (materialRef.current) {
      materialRef.current.uniforms.drawProgress.value = localP;
      materialRef.current.uniforms.globalOpacity.value = opacity;
      materialRef.current.uniforms.pulseIntensity.value = pulse;
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color("#FF5A00") },
    drawProgress: { value: 0 },
    globalOpacity: { value: 1 },
    pulseIntensity: { value: 0 },
  }), []);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.015, 8, false]} />
      <shaderMaterial 
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float drawProgress;
          uniform float globalOpacity;
          uniform float pulseIntensity;
          varying vec2 vUv;
          void main() {
            if (vUv.x > drawProgress) discard;
            float tipIntensity = smoothstep(drawProgress - 0.1, drawProgress, vUv.x);
            vec3 finalColor = color + (tipIntensity * 0.8);
            finalColor *= (1.0 + pulseIntensity);
            gl_FragColor = vec4(finalColor, globalOpacity);
          }
        `}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function PortMarker({ position }: { position: THREE.Vector3 }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const rawP = useScrollStore.getState().progress;
    let pFade = (rawP - 0.85) / 0.15;
    pFade = THREE.MathUtils.clamp(pFade, 0, 1);
    if (matRef.current) matRef.current.opacity = 1 - pFade;
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial ref={matRef} color="#FAFAF7" transparent />
    </mesh>
  );
}

function Globe() {
  const group = useRef<THREE.Group>(null);
  const globeMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const R = 2;

  const LA = latLonToVector3(34.05, -118.24, R);
  const Shanghai = latLonToVector3(31.23, 121.47, R);
  const Rotterdam = latLonToVector3(51.92, 4.47, R);
  const Singapore = latLonToVector3(1.35, 103.81, R);
  const NY = latLonToVector3(40.71, -74.00, R);

  useFrame(() => {
    const rawP = useScrollStore.getState().progress;
    
    // Phase 1 (0 to 0.55) mapped to 0-1 for rotation
    let p1 = rawP / 0.55;
    p1 = THREE.MathUtils.clamp(p1, 0, 1);

    if (group.current) {
      group.current.rotation.y = p1 * Math.PI * 1.5;
      group.current.rotation.x = p1 * 0.3;

      // Phase 2 (0.55 to 0.8) scale up to fly through
      let p2 = (rawP - 0.55) / 0.45;
      p2 = THREE.MathUtils.clamp(p2, 0, 1);
      const scale = 1 + Math.pow(p2, 3) * 11; // 1 -> 12
      group.current.scale.set(scale, scale, scale);
    }

    if (globeMatRef.current) {
      let pFade = (rawP - 0.85) / 0.15;
      pFade = THREE.MathUtils.clamp(pFade, 0, 1);
      globeMatRef.current.opacity = 1 - pFade;
    }
  });

  return (
    <group ref={group}>
      <Sphere args={[R, 64, 64]}>
        <meshStandardMaterial ref={globeMatRef} color="#0F0F0D" roughness={0.9} metalness={0.1} transparent />
      </Sphere>
      
      <PortMarker position={LA} />
      <PortMarker position={Shanghai} />
      <PortMarker position={Rotterdam} />
      <PortMarker position={Singapore} />
      <PortMarker position={NY} />

      <ShippingLane start={LA} end={Shanghai} progressOffset={0.05} />
      <ShippingLane start={NY} end={Rotterdam} progressOffset={0.15} />
      <ShippingLane start={Rotterdam} end={Singapore} progressOffset={0.30} />
      <ShippingLane start={Singapore} end={LA} progressOffset={0.45} />
    </group>
  );
}

function CameraController() {
  useFrame((state) => {
    const rawP = useScrollStore.getState().progress;
    let p1 = rawP / 0.55;
    p1 = THREE.MathUtils.clamp(p1, 0, 1);
    
    const targetZ = THREE.MathUtils.lerp(8, 3.5, p1);
    const orbitAngle = THREE.MathUtils.lerp(0.5, -0.5, p1);
    const targetX = Math.sin(orbitAngle) * targetZ;
    const finalZ = Math.cos(orbitAngle) * targetZ;
    const targetY = THREE.MathUtils.lerp(1.5, 0, p1);

    state.camera.position.lerp(new THREE.Vector3(targetX, targetY, finalZ), 0.1);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3DWrapper() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <group>
      <CameraController />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#FAFAF7" />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#FF5A00" />
      <group position={[1.5, 0, 0]}>
        <Globe />
      </group>
    </group>
  );
}
