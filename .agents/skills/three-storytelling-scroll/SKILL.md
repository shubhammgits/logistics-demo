---
name: three-storytelling-scroll
description: Use when a client brief asks for a scroll-driven 3D story, cinematic landing page, parallax hero, "scroll to reveal" sections, or any react-three-fiber + scroll-synced animation. Covers the standard stack and pitfalls for this pattern.
---

# 3D Scroll Storytelling Skill

## Stack
- `three` + `@react-three/fiber` + `@react-three/drei` — the 3D scene
- `gsap` + `ScrollTrigger` — scrubbing 3D/DOM state to scroll position
  (register once: `gsap.registerPlugin(ScrollTrigger)`)
- `lenis` (or `@studio-freight/lenis`) — smooth scroll; sync its `scroll` event
  to `ScrollTrigger.update` every frame, and to GSAP's ticker instead of
  `requestAnimationFrame` directly
- `framer-motion` for DOM-only micro-interactions layered on top (not for the
  scroll-scrubbing itself — GSAP ScrollTrigger is more reliable for scrubbed timelines)

## Core pattern: scroll-scrubbed 3D timeline
1. One persistent `<Canvas>` (via r3f) positioned `fixed` behind/within the page,
   OR multiple canvases per section if performance requires unmounting off-screen ones.
2. Drive camera position / object rotation / material uniforms from a single
   scroll-progress value (0–1), not from independent per-section triggers, so the
   whole thing feels like one continuous story rather than disconnected animations.
3. Use `ScrollTrigger` with `scrub: true` (or a number like `scrub: 1` for slight
   lag/smoothing) bound to a `trigger` element covering the full story container,
   `start: "top top"`, `end: "bottom bottom"`.
4. Inside the r3f scene, read progress via a shared state (Zustand/useRef, not
   React state — avoid re-renders per scroll tick) and apply it in `useFrame`.
5. Text/DOM overlays fade/translate in and out keyed off the same progress value
   for section boundaries, so 3D and copy stay perfectly in sync.

## Performance constraints (must respect)
- Cap `dpr` (`<Canvas dpr={[1, 2]}>`), don't render at full retina on mobile.
- Lazy-load heavy GLTF/GLB models with `useGLTF.preload` and show a lightweight
  loading state — never block first paint on model load.
- Use `<Suspense>` around 3D content.
- Disable/simplify the 3D scene entirely on `prefers-reduced-motion` and on
  low-end/mobile (feature-detect or use a simpler CSS/Framer fallback under a
  breakpoint) — this is also an accessibility requirement, not optional polish.
- Dispose of geometries/materials on unmount to avoid memory leaks in long
  scroll pages with many mounted/unmounted sections.
- Avoid `CapsuleGeometry` on older three.js and heavy real-time shadows; bake
  lighting or use simple directional + ambient light setups for a "cinematic"
  look without the performance cost.

## Common failure modes to avoid
- Scroll jank from mixing native scroll with Lenis without disabling native
  smooth-scroll CSS and without syncing Lenis's `raf` to GSAP's ticker.
- 3D scenes that block interaction — always keep `pointer-events` sane so
  buttons/links over the canvas remain clickable.
- Reduced-motion users getting nothing: provide a static/simplified visual,
  don't just skip content.

See `references/gsap-lenis-sync.md` for the exact sync snippet.
