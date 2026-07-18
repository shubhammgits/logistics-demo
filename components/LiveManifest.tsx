"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ROUTES = [
  { id: "GLB-409-X", origin: "LOS ANGELES", dest: "SHANGHAI", eta: "14:00Z", status: "ACTIVE" },
  { id: "NYR-112-Q", origin: "NEW YORK", dest: "ROTTERDAM", eta: "08:30Z", status: "EN ROUTE" },
  { id: "SNG-998-L", origin: "ROTTERDAM", dest: "SINGAPORE", eta: "22:15Z", status: "DOCKING" },
  { id: "LAX-551-M", origin: "SINGAPORE", dest: "LOS ANGELES", eta: "11:45Z", status: "CLEARING" },
  { id: "LON-334-P", origin: "LONDON", dest: "TOKYO", eta: "09:00Z", status: "PENDING" },
  { id: "DXB-772-K", origin: "DUBAI", dest: "MUMBAI", eta: "16:20Z", status: "ACTIVE" },
];

export default function LiveManifest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      if (rowsRef.current.length > 0) {
        gsap.fromTo(rowsRef.current, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            }
          }
        );
      }

      if (headerRef.current && containerRef.current) {
        gsap.to(headerRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-32 px-5 sm:px-8 md:px-12 lg:px-24 flex flex-col justify-center bg-background z-20">
      <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Left Column: Negative space & massive vertical marker */}
        <div className="lg:col-span-3 flex flex-col justify-start">
          <div className="sticky top-32 font-mono text-accent text-sm tracking-widest uppercase origin-top-left lg:-rotate-90 lg:translate-y-32 lg:text-xl">
            [ 01 // NETWORK_STATUS ]
          </div>
        </div>

        {/* Right Column: Tabular manifest */}
        <div className="lg:col-span-9 flex flex-col gap-2 w-full">
          {/* Table Header */}
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 font-mono text-[10px] text-ink/40 uppercase tracking-widest border-b border-ink/10 pb-4 mb-4">
            <div>Vessel_ID</div>
            <div className="hidden lg:block">Trajectory</div>
            <div>ETA</div>
            <div className="text-right">Status</div>
          </div>

          {/* Rows */}
          {ROUTES.map((route, i) => (
            <div 
              key={i} 
              ref={(el) => { rowsRef.current[i] = el; }}
              className="group grid grid-cols-3 lg:grid-cols-4 gap-4 font-mono text-xs sm:text-sm text-ink items-center border-b border-ink/10 py-6 hover:bg-ink/5 transition-colors"
            >
              <div className="text-accent tracking-wider">{route.id}</div>
              <div className="hidden lg:block text-ink/70">{route.origin} <span className="text-ink/30 mx-2">&rarr;</span> {route.dest}</div>
              <div className="text-ink/70">{route.eta}</div>
              <div className="text-right flex justify-end items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${route.status === 'PENDING' ? 'bg-ink/30' : 'bg-accent animate-pulse'}`}></span>
                {route.status}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
