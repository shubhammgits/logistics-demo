---
name: loading-reveal-sequence
description: Use when a client brief calls for a real asset-loading screen (e.g. tracking WebGL/3D assets), a scroll-gated hero reveal (forcing user scroll interaction to unlock), or word-by-word/staggered heading entrance animations synchronized with page scroll.
---

# Interactive Loading & Scroll Reveal Sequence

This skill outlines the architectural pattern for creating high-end, scroll-gated interactive loading sequences commonly requested for premium, motion-heavy or WebGL-based marketing sites.

## 1. Real Asset Loading Tracking (Three.js)

Avoid using fake timed progress bars. If the site uses WebGL (React Three Fiber), track actual GPU asset uploads via `THREE.LoadingManager`.

- **Implementation**: Use the `useProgress` hook from `@react-three/drei`.
- **How it works**: Even if your 3D scene (e.g., `<Scene3D />`) is dynamically imported with SSR disabled, the `useProgress` hook (when rendered in an overlay component outside the canvas) will intercept the active asset counts from Three.js's global `DefaultLoadingManager`.
- **Edge Case**: If the scene has 0 assets to load (e.g. cached on hot-reload), mathematically handle the bypass: `const isLoaded = progress >= 100 || (!active && total === 0) || (total > 0 && loaded === total);`.

*Working Example*: See `components/IntroScreen.tsx`.

## 2. Global Scroll Gating (Lenis Integration)

To force a user interaction (like a "SCROLL DOWN" prompt) before allowing page scroll, you must lock scrolling cleanly without causing layout shifts. 

- **Do Not Use**: `overflow: hidden` on the `<body>`, as it causes jarring layout shifts when scrollbars appear/disappear.
- **Implementation**: Integrate directly with the native smooth scroller (e.g., Lenis). Use a global state store (like Zustand) to track an `introState` (`"loading" | "gate" | "unlocked"`).
- **How it works**: 
  1. While `introState` is `"loading"` or `"gate"`, call `lenis.stop()` immediately upon Lenis initialization.
  2. Attach a one-time passive event listener for `wheel`, `touchstart`, or `keydown` (ArrowDown/Space).
  3. On interaction, set `introState = "unlocked"` and call `lenis.start()`.

*Working Example*: See `components/ScrollManager.tsx` and `components/IntroScreen.tsx`.

## 3. Staggered Word-by-Word Reveal & Entrance Animations

When unlocking the scroll gate, trigger the hero elements to animate in together using a GSAP timeline.

- **Implementation**: Split the headline into individual `<span>` or `<div>` elements and assign React refs. Use `gsap.timeline()` to stagger their entrance.
- **How it works**: 
  - Elements start hidden (`opacity: 0`, `x: -500`).
  - When `introState` becomes `"unlocked"`, trigger a time-based GSAP `.fromTo()` staggered animation for the entrance.
  - To tie subsequent motion to scroll, subscribe the GSAP timeline's progress to the global scroll progress store (e.g., `useScrollStore.subscribe(state => tl.progress(state.progress))`).

*Working Example*: See `components/Hero.tsx`.

## 4. Accessibility: prefers-reduced-motion

Scroll-gated motion is inherently inaccessible for users with vestibular disorders.

- **Handling**: Always read `window.matchMedia("(prefers-reduced-motion: reduce)")` on mount.
- **Implementation**: If reduced motion is requested, instantly bypass the `"gate"` state. When the loading sequence completes, transition the state directly to `"unlocked"`. The scroll gate prompt should never appear, and scrolling should never be locked.

*Working Example*: See `components/IntroScreen.tsx` (state bypass) and `components/Hero.tsx` (animation skips).

## 5. Critical Performance Constraint: WebGL Context Lost

- **Rule**: Never allow more than one active `<Canvas>` (WebGL renderer) to be mounted simultaneously on lower-end hardware or across heavy scroll distances.
- **Why**: Browsers strictly cap the number of active WebGL contexts per tab. Keeping a hero `<Canvas>` mounted while a user scrolls down to a secondary `<Canvas>` (e.g., a background wireframe) can cause Chrome's garbage collector to crash, resulting in a `THREE.WebGLRenderer: Context Lost` error.
- **Fix**: Use Intersection Observers or a scroll progress threshold to explicitly unmount (`return null`) the hero Canvas before mounting any secondary Canvases below the fold.

*Working Example*: See `store/scrollStore.ts` (`isCanvasMounted` state) and `components/Stats.tsx`.
