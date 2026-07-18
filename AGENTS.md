<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Studio Build Standards

## What this project is
Client web builds for a freelance dev agency. Stack: Next.js 15 (App Router) +
TypeScript, Tailwind, react-three-fiber + drei for 3D, GSAP ScrollTrigger + Lenis
for scroll storytelling, Framer Motion for micro-interactions, Supabase where a
backend is needed. Deployed on Vercel.

## Non-negotiable design rule
**Never ship the default "AI-generated" look.** Before writing any UI code, load
the `anti-ai-slop-design` skill and follow it. Every project must first read
`design-system/DESIGN.md` and `design-system/tokens.json` (if present) and use
those tokens — do not invent a new palette/font stack per page.

## Commands
- `npm install`
- `npm run dev` — local dev server (port 3000)
- `npm run lint` — ESLint + TypeScript check, must pass before considering a task done
- `npm run build` — production build, run before marking any deploy-ready task complete

## Code style
- TypeScript strict mode, no `any` unless justified in a comment
- Server Components by default; `"use client"` only where interactivity/3D/animation requires it
- Co-locate component + its Framer/GSAP animation logic in the same folder
- Tailwind only — no ad-hoc inline styles unless dynamically computed (e.g. scroll progress)

## Architecture
- `/app` — routes
- `/components` — shared UI primitives (buttons, cards, nav) — check here before creating a new one
- `/components/3d` — react-three-fiber scenes/canvases
- `/design-system` — DESIGN.md + tokens, the single source of truth for colors/type/spacing
- `/inspirations` — reference screenshots/links dropped in per client, read before starting a build
- `/templates` — reusable page skeletons (landing, portfolio, SaaS marketing, agency)

## Workflow expected of the agent
1. Read `design-system/DESIGN.md` and any files in `/inspirations` for this client.
2. Load `anti-ai-slop-design` skill. Propose a one-paragraph art direction (type pairing,
   color logic, motion personality) before generating full pages. Wait for approval on
   the direction before building every page from it.
3. If the brief mentions scroll storytelling, parallax, or 3D hero — load
   `three-storytelling-scroll` skill.
4. Reuse `/components` and `/templates` instead of regenerating primitives from scratch.
5. Run lint + build before saying a task is finished.
6. If the review-policy/auto-approval setting is active and you cannot actually pause for explicit approval before building, state that plainly at the start of your response instead of promising to wait and then proceeding anyway.

## Boundaries
- Do not touch `/design-system/tokens.json` without explicit instruction — it's shared
  across client projects cloned from this template.
- Do not add new npm dependencies for things Tailwind/Framer Motion/GSAP already solve.

## 3D/WebGL constraints
- Use a single persistent `<Canvas>` for the entire page where possible; toggle visibility of scenes/groups via state, don't mount/unmount separate Canvas instances based on scroll position (causes WebGL Context Lost crashes under repeated HMR/remounts).
- Never guess or estimate tool output (Lighthouse scores, test results, command output) when a tool fails to run — report the failure plainly instead.
- Load the `loading-reveal-sequence` skill for any client site involving a loading gate, scroll-gated reveal, or staggered heading entrance.
