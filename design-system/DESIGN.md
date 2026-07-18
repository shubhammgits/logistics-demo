# DESIGN.md — Logistics Tracking System

> Fill this in per-client before the agent generates any UI. This is the single
> source of truth both agents (Codex, Antigravity) read before styling anything.

## Brand personality (1-2 sentences)
Precision, confidence, and high-stakes control. An industrial, global-tracking aesthetic that feels premium, mission-critical, and native to logistics.

## Typography
- Display / headings: `Archivo Expanded` — Black (900) or Bold (700) weight, used massive, tight tracking for industrial presence.
- Body / technical UI: `JetBrains Mono` — Regular (400) or Medium (500) weight, used small-medium, highly readable for coordinates and manifests.
- Scale: `xs` (technical labels, 0.75rem), `base` (body copy, 1rem), `xl` (subheadings, 1.25rem), `6xl` (section headers, 4rem), `9xl` (hero display, 8rem+)

## Color
| Token | Hex | Use |
|---|---|---|
| `ink` | #FAFAF7 | bone-white, primary text |
| `paper` | #0F0F0D | deep warm industrial gray, primary background |
| `accent` | #FF5A00 | signal-orange/amber, used sparingly for highlights/shipping lanes |

## Layout logic
- Grid: 12-col, high spatial tension, broken grid structures. Massive typography anchored to one side, technical micro-copy in extreme corners.
- Spacing scale: Base 4px multiplier, heavily relying on extreme padding for breathing room.

## Motion personality
- Pace: Slow, confident, editorial control. Emphasizes precision over energetic bounces.
- Easing: `power3.out`
- What gets scroll-scrubbed vs simple fade/slide on enter: Central 3D globe/shipping lanes scrubbed with scroll. UI/data readouts use deliberate fade-ups on enter.

## Reference inspiration
Subject: Stylized 3D globe with glowing shipping lanes, cargo manifest UI. High-fidelity radar sweep, global logistics dashboard.

---
Optional: keep a `tokens.json` alongside this file with the same values in a
machine-readable form (colors, font stacks, spacing scale) if you want Tailwind
config or component code to import them directly rather than re-typing hex codes.
