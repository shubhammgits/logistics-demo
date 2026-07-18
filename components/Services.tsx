"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SERVICES = [
  {
    title: "FREIGHT FORWARDING",
    id: "FWD-092",
    lat: "34.0522° N",
    lon: "118.2437° W", // LA
    capacity: "99.8%",
    status: "OPTIMIZED",
    desc: "End-to-end multi-modal transport orchestration. Sea, air, and ground synchronized for absolute efficiency across all global nodes."
  },
  {
    title: "CONTRACT LOGISTICS",
    id: "CTR-714",
    lat: "51.9225° N",
    lon: "4.4791° E", // Rotterdam
    capacity: "82.4%",
    status: "PROCESSING",
    desc: "Automated warehousing, exact inventory control, and high-velocity fulfillment centers globally distributed."
  },
  {
    title: "COLD CHAIN TRANSIT",
    id: "CCT-338",
    lat: "1.3521° N",
    lon: "103.8198° E", // Singapore
    capacity: "94.7%",
    status: "STABILIZED",
    desc: "Temperature-controlled secure transit for sensitive cargo, pharmaceuticals, and perishables. Zero-tolerance thermal deviation."
  }
];

export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const scanLineRefs = useRef<(HTMLDivElement | null)[]>([]);
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

      if (labelRef.current && containerRef.current) {
        gsap.to(labelRef.current, {
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      if (tickRef.current && containerRef.current) {
        gsap.to(tickRef.current, {
          rotation: 180,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom center",
            scrub: true
          }
        });
      }

      titleRefs.current.forEach((title, i) => {
        if (!title) return;
        const line = scanLineRefs.current[i];
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
          }
        });

        gsap.set(title, { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" });
        if (line) gsap.set(line, { left: 0, opacity: 1 });

        tl.to(title, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          duration: 1.2,
          ease: "power3.out"
        }, 0);

        if (line) {
          tl.to(line, {
            left: "100%",
            duration: 1.2,
            ease: "power3.out"
          }, 0)
          .to(line, {
            opacity: 0,
            duration: 0.3
          }, "-=0.3");
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="w-full min-h-screen bg-background flex flex-col pt-32 pb-48 z-20 relative">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-24 mb-16 flex items-center gap-4">
        <h2 ref={labelRef} className="font-mono text-accent text-sm tracking-widest uppercase">[ 02 // CORE_SERVICES ]</h2>
        <span ref={tickRef} className="font-mono text-accent text-sm inline-block">↓</span>
      </div>

      <div className="flex flex-col w-full border-t border-ink/20">
        {SERVICES.map((srv, i) => {
          const isActive = active === i;
          return (
            <div 
              key={i}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-controls={`service-panel-${i}`}
              className="group border-b border-ink/20 flex flex-col cursor-pointer transition-colors duration-500 hover:bg-ink/5 focus-visible:outline-none focus-visible:bg-ink/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(isActive ? null : i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(isActive ? null : i);
                }
              }}
            >
              {/* Massive Title Row */}
              <div className="w-full px-5 sm:px-8 md:px-12 lg:px-24 py-6 sm:py-8 flex items-center justify-between">
                <div className="relative inline-block pr-2">
                  <h3 
                    ref={el => { titleRefs.current[i] = el; }}
                    className={`font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight transition-colors duration-300 ${isActive ? 'text-accent' : 'text-ink'}`}
                  >
                    {srv.title}
                  </h3>
                  <div 
                    ref={el => { scanLineRefs.current[i] = el; }}
                    className={`absolute top-0 bottom-0 left-0 w-1 bg-accent ${reducedMotion ? 'hidden' : 'block'}`}
                  />
                </div>
                <span className="hidden md:block font-mono text-ink/30 text-sm tracking-widest">
                  {srv.id}
                </span>
              </div>

              {/* Expandable Content Panel */}
              <div 
                id={`service-panel-${i}`}
                className={`w-full overflow-hidden transition-[max-height,opacity] duration-1000 ease-out ${isActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="w-full px-5 sm:px-8 md:px-12 lg:px-24 pb-12 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Empty space on left to create tension */}
                    <div className="hidden md:block md:col-span-4 lg:col-span-6"></div>

                    {/* Dense Data Panel on Right */}
                    <div className="md:col-span-8 lg:col-span-6 grid grid-cols-2 gap-8 font-mono text-xs sm:text-sm border-l border-accent/30 pl-8">
                      <div className="col-span-2 text-ink/70 leading-relaxed max-w-md">
                        {srv.desc}
                      </div>
                      
                      <div className="flex flex-col gap-2 text-ink/70">
                        <span className="text-[10px] uppercase tracking-widest text-ink/40">Coordinates</span>
                        <span className="text-accent">{srv.lat}</span>
                        <span className="text-accent">{srv.lon}</span>
                      </div>

                      <div className="flex flex-col gap-2 text-ink/70">
                        <span className="text-[10px] uppercase tracking-widest text-ink/40">Network Status</span>
                        <span>CAP: {srv.capacity}</span>
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                          {srv.status}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
