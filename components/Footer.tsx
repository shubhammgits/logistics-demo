"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const [time, setTime] = useState<string>("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").split(".")[0] + "Z");
    };
    updateTime();

    let interval: NodeJS.Timeout;
    if (!mediaQuery.matches) {
      interval = setInterval(updateTime, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      if (gridRef.current && containerRef.current) {
        gsap.fromTo(gridRef.current,
          { y: 30 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true
            }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer ref={containerRef} className="w-full bg-background border-t border-ink/20 pt-24 sm:pt-32 pb-8 sm:pb-12 px-5 sm:px-8 md:px-12 lg:px-24 flex flex-col relative z-20 overflow-hidden">
      
      {/* Primary Terminal CTA */}
      <div className="w-full flex flex-col items-start mb-24 sm:mb-32 max-w-5xl mx-auto">
        <h2 className="font-sans text-xl sm:text-2xl font-medium tracking-tight uppercase text-ink/70 mb-6">
          System Initialization
        </h2>
        
        <button className="group relative flex items-center justify-between w-full p-6 sm:p-8 md:p-10 border border-ink/30 transition-colors duration-0 hover:bg-accent hover:border-accent">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="font-mono text-xl sm:text-3xl md:text-4xl text-accent group-hover:text-background transition-colors duration-0">
              &gt;
            </span>
            <span className="font-mono text-xl sm:text-3xl md:text-4xl text-ink tracking-tighter uppercase group-hover:text-background transition-colors duration-0 text-left">
              INITIATE_PROTOCOL: DEPLOY_ASSETS
            </span>
            <span className={`hidden sm:block w-4 sm:w-6 h-6 sm:h-8 bg-accent group-hover:bg-background ${reducedMotion ? '' : 'animate-[pulse_1s_step-end_infinite]'}`}></span>
          </div>
        </button>
      </div>

      {/* Coordinate-Style Link Grid */}
      <div ref={gridRef} className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-0 mt-auto border-t border-ink/20 pt-8 relative max-w-[1600px] mx-auto">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
          <a href="#" className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-ink/50 hover:text-accent transition-colors duration-300">
            [ API_DOCUMENTATION ]
          </a>
          <a href="#" className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-ink/50 hover:text-accent transition-colors duration-300">
            [ CLIENT_PORTAL_LOGIN ]
          </a>
          <a href="#" className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-ink/50 hover:text-accent transition-colors duration-300">
            [ TERMS_OF_SERVICE ]
          </a>
        </div>

        {/* System Sign-Off Block */}
        <div className="flex flex-col items-start lg:items-end gap-2 text-left lg:text-right">
          <span className="font-mono text-[10px] sm:text-xs text-accent uppercase tracking-widest">
            [ END_OF_MANIFEST ]
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-ink/40 uppercase tracking-widest">
            SYS.STATUS: NOMINAL // GLOBAL_GRID: SYNCHRONIZED
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-ink/40 uppercase tracking-widest">
            LOCAL: {time || "AWAITING_TIME_SYNC..."} {reducedMotion && "(STATIC)"}
          </span>
        </div>

      </div>

    </footer>
  );
}
