"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scrollStore";


export default function ScrollManager({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [reducedMotion]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    if (reducedMotion) {
      // Just run Lenis, skip pinning and timeline
      return () => {
        lenis.destroy();
        gsap.ticker.remove((time) => lenis.raf(time * 1000));
      };
    }

    // Handle scroll locking based on introState
    const unsubscribe = useScrollStore.subscribe((state) => {
      if (state.introState === "unlocked") {
        lenis.start();
      } else {
        lenis.stop();
      }
    });

    // Initial check
    if (useScrollStore.getState().introState !== "unlocked") {
      lenis.stop();
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: pinRef.current,
        onUpdate: (self) => {
          const p = self.progress;
          useScrollStore.getState().setProgress(p);
          
          // Switch active scene based on phase 2 boundary
          const activeScene = useScrollStore.getState().activeScene;
          if (p > 0.85 && activeScene !== 'stats') {
            useScrollStore.getState().setActiveScene('stats');
          } else if (p <= 0.85 && activeScene !== 'hero') {
            useScrollStore.getState().setActiveScene('hero');
          }
        },
      },
    });

    return () => {
      tl.kill();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      unsubscribe();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={`relative w-full ${reducedMotion ? "h-screen" : "h-[250vh]"}`}>
      <div ref={pinRef} className="w-full h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
