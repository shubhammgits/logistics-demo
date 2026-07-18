---
name: anti-ai-slop-design
description: Use whenever generating or reviewing any UI/landing page/component. Prevents the generic "AI-made website" look — enforces distinctive typography, real color logic, asymmetric layout, and intentional motion instead of default template patterns. Trigger for any visual/UI generation task.
---

# Anti-"AI Slop" Design Skill

Generic AI output tends to converge on the same tells. Actively avoid these unless
the client brief specifically calls for a minimal/safe corporate look:

## Banned defaults (unless justified)
- Purple-to-blue or pink-to-orange gradient hero backgrounds
- Inter/system-ui as the only typeface — pair a distinctive display face
  (serif or characterful sans) for headings with a plain workhorse for body
- Centered text + centered button hero, 3-equal-column "feature cards" with
  an icon-in-a-circle above a heading above a paragraph, repeated 3x
- Rounded-full soft-shadow cards floating on white with no grid tension
- Glassmorphism as the entire visual identity rather than one accent
- Emoji as icons; generic Heroicons/Lucide used identically to every other site
- Hero copy pattern "The [adjective] way to [verb] your [noun]"

## Do this instead
1. **Typography does the branding.** Pick one distinctive typeface pairing per
   client (check `design-system/DESIGN.md`). Use scale contrast aggressively —
   huge display type against small tracked-out labels, not everything at similar size.
2. **Color from the brand, not a palette generator.** 1 dominant color + 1 ink
   color + 1 accent used sparingly. Avoid rainbow gradients unless the brand is
   explicitly playful/Gen-Z.
3. **Break the grid on purpose.** Asymmetric hero layouts, overlapping elements,
   off-center focal points, diagonal or clipped-path section dividers — but keep
   an underlying alignment system so it reads as intentional, not messy.
4. **Motion has personality, not just fade-ins.** Distinguish "confident/editorial"
   (slow, large-scale, few elements) from "energetic/product" (fast, staggered,
   many small elements) motion based on the brand. See `three-storytelling-scroll`
   skill for scroll-driven work.
5. **Real photography or custom illustration over stock-feeling 3D blobs** —
   if the client has no assets, prefer bold typographic layouts or a single
   custom-modeled 3D hero (see 3D skill) over generic gradient orbs.
6. **Copy should be specific**, not marketing-mad-libs. Push back on generic
   placeholder copy patterns above.

## Process
- Before generating full pages, state the art direction in 3-5 bullet points
  (type pairing, color logic, layout tension, motion personality) and get a
  thumbs up.
- Reference anything in `/inspirations` for this client — match the *feeling*,
  never copy a specific site's layout 1:1.
