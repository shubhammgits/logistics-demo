"use client";

import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { useScrollStore } from "@/store/scrollStore";
import gsap from "gsap";

export default function IntroScreen() {
  const { progress, active, total, loaded } = useProgress();
  const introState = useScrollStore((state) => state.introState);
  const setIntroState = useScrollStore((state) => state.setIntroState);
  const containerRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle Loading completion
  useEffect(() => {
    const isLoaded = progress >= 100 || (!active && total === 0) || (total > 0 && loaded === total);
    if (isLoaded && introState === "loading") {
      if (reducedMotion) {
        setIntroState("unlocked");
      } else {
        setIntroState("gate");
      }
    }
  }, [progress, active, total, loaded, introState, reducedMotion, setIntroState]);

  // Handle GSAP transitions between states
  useEffect(() => {
    if (introState === "gate") {
      // Fade out loader, fade in gate
      gsap.to(loaderRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = 'none';
      }});
      gsap.fromTo(gateRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    } else if (introState === "unlocked") {
      // Fade out entire container
      gsap.to(containerRef.current, {
        opacity: 0, 
        duration: 0.8, 
        ease: "power2.inOut",
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.pointerEvents = 'none';
        }
      });
    }
  }, [introState]);

  // Handle Unlock event
  useEffect(() => {
    if (introState !== "gate") return;

    const unlock = (e: Event) => {
      // Prevent default to avoid jumping scroll while locked
      if (e.type === 'keydown') {
        const key = (e as KeyboardEvent).key;
        if (key !== 'ArrowDown' && key !== ' ' && key !== 'PageDown') return;
      }
      setIntroState("unlocked");
    };

    window.addEventListener("wheel", unlock, { once: true, passive: false });
    window.addEventListener("touchstart", unlock, { once: true, passive: false });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [introState, setIntroState]);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background text-ink pointer-events-auto ${introState === 'unlocked' ? 'pointer-events-none' : ''}`}
    >
      {/* Loading State */}
      <div ref={loaderRef} className="flex flex-col items-center gap-6 w-full max-w-sm px-6 absolute">
        <div className="flex justify-between w-full font-mono text-xs uppercase tracking-widest text-ink/70">
          <span>Boot Sequence</span>
          <span>{total === 0 ? 100 : Math.floor(progress)}%</span>
        </div>
        <div className="h-px w-full bg-ink/10 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${total === 0 ? 100 : progress}%` }}
          />
        </div>
        <div className="font-mono text-[10px] uppercase text-ink/40 tracking-widest text-center">
          Initializing WebGL Context...
        </div>
      </div>

      {/* Gate State */}
      <div ref={gateRef} className="absolute flex flex-col items-center gap-4 opacity-0 pointer-events-none">
        <span className="font-sans text-xl sm:text-2xl font-medium tracking-widest uppercase">
          Scroll Down
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}
