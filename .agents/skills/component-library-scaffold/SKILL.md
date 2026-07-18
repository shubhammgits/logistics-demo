---
name: component-library-scaffold
description: Use before creating any new UI primitive (button, card, nav, input, modal). Checks the shared /components library first and enforces consistent variant/prop patterns across client projects.
---

# Component Library Scaffold Skill

1. Before generating a new primitive, list what already exists in `/components`.
   Reuse or extend it (add a variant) rather than creating a near-duplicate.
2. New primitives follow this shape:
   - `ComponentName.tsx` — implementation
   - Variants via a `cva` (class-variance-authority) config, not scattered
     conditional className strings
   - Exported from `/components/index.ts`
3. Every primitive must support: `className` passthrough, `asChild` where it
   makes sense (Radix pattern), and keyboard/focus states — no client build
   ships inaccessible interactive elements.
4. When a component is genuinely new and reusable across future clients, add
   it here in the template repo (not just the one client project) so it
   compounds over time.
