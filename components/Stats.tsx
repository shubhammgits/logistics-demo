"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#X%";


export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const crosshairXRef = useRef<HTMLDivElement>(null);
  const crosshairYRef = useRef<HTMLDivElement>(null);
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
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      if (copyRef.current) {
        gsap.fromTo(copyRef.current,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: copyRef.current,
              start: "top 90%",
            }
          }
        );

        if (containerRef.current) {
          gsap.to(copyRef.current, {
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
      }

      // Center-out crosshair draw-in
      if (crosshairXRef.current && crosshairYRef.current) {
        gsap.fromTo([crosshairXRef.current, crosshairYRef.current],
          { scaleX: 0, scaleY: 0 },
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            }
          }
        );
      }

      numRefs.current.forEach((num) => {
        if (!num) return;
        const finalTxt = num.dataset.val || "";
        
        gsap.fromTo(num, 
          { y: "100%" },
          {
            y: "0%",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: num,
              start: "top 90%",
              onEnter: () => {
                // Character scramble effect
                let iter = 0;
                const maxIter = 15;
                const interval = setInterval(() => {
                  num.innerText = finalTxt.split("").map((char, i) => {
                    if (i < iter / (maxIter / finalTxt.length)) return finalTxt[i];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                  }).join("");
                  iter++;
                  if (iter >= maxIter) {
                    clearInterval(interval);
                    num.innerText = finalTxt;
                  }
                }, 40);
              }
            }
          }
        );
      });

      linesRef.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.out",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="w-full bg-background flex flex-col py-24 sm:py-32 z-20 relative overflow-hidden">
      
      {/* Background WebGL Node is now handled by GlobalCanvas */}

      {/* Header and Copy Container */}
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 mb-16 sm:mb-24 relative z-10">
        <h2 className="font-mono text-accent text-sm tracking-widest uppercase mb-8">[ 03 // SYSTEM_CAPACITY ]</h2>
        <div className="overflow-hidden pb-2">
          <p ref={copyRef} className="font-sans text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight uppercase leading-[1.1] text-ink/90 max-w-4xl">
            Synchronizing sea, air, and rail assets across 192 jurisdictions to maintain 99.9% schedule integrity. Zero tolerance for thermal deviation or customs dwell.
          </p>
        </div>
      </div>

      {/* Tightly clustered max-w container */}
      <div className="w-full max-w-5xl mx-auto relative px-5 sm:px-8">
        
        {/* Central HUD Crosshairs */}
        <div className="absolute inset-0 items-center justify-center pointer-events-none hidden sm:flex z-0">
          <div ref={crosshairXRef} className="w-full h-px bg-ink/10 absolute top-1/2 -translate-y-1/2 origin-center"></div>
          <div ref={crosshairYRef} className="h-full w-px bg-ink/10 absolute left-1/2 -translate-x-1/2 origin-center"></div>
          
          {/* Sync Dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className={`w-2 h-2 bg-accent rounded-full ${reducedMotion ? '' : 'animate-ping'} absolute`}></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-accent tracking-widest uppercase whitespace-nowrap">
              SYNC: STABLE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-y-20 sm:gap-x-16 relative z-10">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-start w-full relative">
            <div className="flex flex-col overflow-hidden leading-[0.85] pb-2">
              <span className="font-mono font-medium text-6xl sm:text-7xl md:text-8xl text-ink tracking-tighter block flex">
                <span ref={el => { numRefs.current[0] = el; }} data-val="99.9">{reducedMotion ? "99.9" : "00.0"}</span>
                <span className="text-accent">%</span>
              </span>
            </div>
            <div className="mt-4 flex flex-col items-start gap-2 w-full">
              <div className="flex items-center gap-4 w-full">
                <span className="font-sans text-xs sm:text-sm uppercase tracking-widest text-ink/70 whitespace-nowrap">Global On-Time Delivery</span>
                <div ref={el => { linesRef.current[0] = el; }} className="h-px bg-ink/20 w-full origin-left"></div>
              </div>
              <span className="font-mono text-[10px] uppercase text-ink/40 tracking-widest">VARIANCE: &lt;0.01% / Q3 TARGET MET</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-start sm:items-end w-full relative sm:mt-12">
            <div className="flex flex-col overflow-hidden leading-[0.85] pb-2 text-left sm:text-right w-full">
              <span className="font-mono font-medium text-6xl sm:text-7xl md:text-8xl text-ink tracking-tighter block flex justify-start sm:justify-end">
                <span ref={el => { numRefs.current[1] = el; }} data-val="14">{reducedMotion ? "14" : "00"}</span>
                <span className="text-accent">K+</span>
              </span>
            </div>
            <div className="mt-4 flex flex-col items-start sm:items-end gap-2 w-full ml-auto">
              <div className="flex items-center gap-4 w-full">
                <div ref={el => { linesRef.current[1] = el; }} className="hidden sm:block h-px bg-ink/20 w-full origin-left"></div>
                <span className="font-sans text-xs sm:text-sm uppercase tracking-widest text-ink/70 whitespace-nowrap">Active Fleet Nodes</span>
                <div ref={el => { linesRef.current[2] = el; }} className="sm:hidden h-px bg-ink/20 w-full origin-left"></div>
              </div>
              <span className="font-mono text-[10px] uppercase text-ink/40 tracking-widest text-left sm:text-right">MULTIMODAL: SEA, AIR, RAIL, OTR</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-start w-full relative">
            <div className="flex flex-col overflow-hidden leading-[0.85] pb-2">
              <span className="font-mono font-medium text-6xl sm:text-7xl md:text-8xl text-ink tracking-tighter block flex">
                <span ref={el => { numRefs.current[2] = el; }} data-val="192">{reducedMotion ? "192" : "000"}</span>
              </span>
            </div>
            <div className="mt-4 flex flex-col items-start gap-2 w-full">
              <div className="flex items-center gap-4 w-full">
                <span className="font-sans text-xs sm:text-sm uppercase tracking-widest text-ink/70 whitespace-nowrap">Countries Connected</span>
                <div ref={el => { linesRef.current[3] = el; }} className="h-px bg-ink/20 w-full origin-left"></div>
              </div>
              <span className="font-mono text-[10px] uppercase text-ink/40 tracking-widest">CUSTOMS CLEARANCE IN 85% UNDER 4H</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-start sm:items-end w-full relative sm:mt-12">
            <div className="flex flex-col overflow-hidden leading-[0.85] pb-2 text-left sm:text-right w-full">
              <span className="font-mono font-medium text-6xl sm:text-7xl md:text-8xl text-ink tracking-tighter block flex justify-start sm:justify-end">
                <span ref={el => { numRefs.current[3] = el; }} data-val="24">{reducedMotion ? "24" : "00"}</span>
                <span className="text-accent">H</span>
              </span>
            </div>
            <div className="mt-4 flex flex-col items-start sm:items-end gap-2 w-full ml-auto">
              <div className="flex items-center gap-4 w-full">
                <div ref={el => { linesRef.current[4] = el; }} className="hidden sm:block h-px bg-ink/20 w-full origin-left"></div>
                <span className="font-sans text-xs sm:text-sm uppercase tracking-widest text-ink/70 whitespace-nowrap">Avg Transit Time</span>
                <div ref={el => { linesRef.current[5] = el; }} className="sm:hidden h-px bg-ink/20 w-full origin-left"></div>
              </div>
              <span className="font-mono text-[10px] uppercase text-ink/40 tracking-widest text-left sm:text-right">TIER 1 INTERCONTINENTAL HUBS ONLY</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
