# Lenis <-> GSAP ScrollTrigger sync

```ts
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ smoothWheel: true });

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

Then build scrubbed timelines as normal:

```ts
gsap.timeline({
  scrollTrigger: {
    trigger: "#story",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
  },
});
```

Read the same scroll progress inside the r3f `<Canvas>` via a shared ref/store
updated in the ScrollTrigger's `onUpdate`, not via React state, to avoid
re-render cost on every scroll tick.
