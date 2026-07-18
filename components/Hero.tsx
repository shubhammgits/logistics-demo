"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scrollStore";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const word3Ref = useRef<HTMLDivElement>(null);
  const entrance1Ref = useRef<HTMLDivElement>(null);
  const entrance2Ref = useRef<HTMLDivElement>(null);
  const entrance3Ref = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const chevronPath1 = useRef<SVGPathElement>(null);
  const chevronPath2 = useRef<SVGPathElement>(null);
  const chevronPath3 = useRef<SVGPathElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const introState = useScrollStore((state) => state.introState);

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
    const entranceWords = [entrance1Ref.current, entrance2Ref.current, entrance3Ref.current];
    
    if (introState === "unlocked" && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
      
      if (entranceWords.every(w => w)) {
        entranceWords.forEach((word, i) => {
          gsap.fromTo(word,
            { x: -500, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out", delay: i * 0.2 }
          );
        });
      }
    } else if ((introState === "loading" || introState === "gate") && containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
      if (entranceWords.every(w => w)) {
        gsap.set(entranceWords, { opacity: 0 });
      }
    }
  }, [introState, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    let unsubscribe = () => {};
    const ctx = gsap.context(() => {
      // 1. Hero headline sequential slide-in driven by global scroll progress
      const words = [word1Ref.current, word2Ref.current, word3Ref.current];
      
      if (words.every(w => w) && containerRef.current) {
        const tl = gsap.timeline({ paused: true });
        
        tl.to(words, {
          y: -100,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power2.inOut"
        });

        unsubscribe = useScrollStore.subscribe((state) => {
          let p = state.progress / 0.85;
          p = Math.max(0, Math.min(p, 1));
          tl.progress(p);
        });
      }

      // 2. Chevron stroke draw-in on mount
      const paths = [chevronPath1.current, chevronPath2.current, chevronPath3.current];
      paths.forEach((path, i) => {
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            delay: 0.5 + (i * 0.2), // staggered draw
            ease: "power3.out"
          });
        }
      });

      // 3. Chevron drift down and fade on scroll
      if (chevronRef.current && containerRef.current) {
        gsap.to(chevronRef.current, {
          y: 60,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom 60%",
            scrub: true
          }
        });
      }
    }, containerRef);

    return () => { ctx.revert(); unsubscribe(); };
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col justify-between p-5 sm:p-8 md:p-12 lg:p-24 overflow-hidden pointer-events-none z-10 opacity-0">
      {/* Top edge micro-copy */}
      <div className="flex flex-col sm:flex-row justify-between items-start w-full font-mono text-[10px] sm:text-xs text-ink/70 gap-2 sm:gap-0">
        <div className="flex flex-col gap-1">
          <span>SYS.STATUS: [ONLINE]</span>
          <span>UPLINK: SECURE</span>
        </div>
        <div className="flex flex-col gap-1 text-left sm:text-right text-accent">
          <span>LAT 34.0522° N</span>
          <span>LON 118.2437° W</span>
        </div>
      </div>

      {/* Massive Headline Anchored Left */}
      <div className="max-w-4xl z-10 pointer-events-auto">
        <h1 className="text-[12vw] sm:text-6xl md:text-8xl lg:text-9xl font-sans font-black leading-[0.85] tracking-tighter uppercase text-ink overflow-hidden">
          <div ref={entrance1Ref} className="inline-block"><div ref={word1Ref}>Global</div></div><br />
          <div ref={entrance2Ref} className="inline-block text-accent"><div ref={word2Ref}>Precision</div></div><br />
          <div ref={entrance3Ref} className="inline-block"><div ref={word3Ref}>Logistics</div></div>
        </h1>
      </div>

      {/* Bottom edge micro-copy & Chevron */}
      <div className="flex justify-between items-end w-full font-mono text-[10px] sm:text-xs text-ink/70">
        <div>
          MANIFEST: 499-XYZ-90
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="uppercase tracking-widest text-[10px] text-accent">Initiate Sequence</span>
          <svg 
            ref={chevronRef}
            width="24" 
            height="32" 
            viewBox="0 0 24 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-accent"
          >
            <path ref={chevronPath1} d="M2 2L12 10L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            <path ref={chevronPath2} d="M2 12L12 20L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            <path ref={chevronPath3} d="M2 22L12 30L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
