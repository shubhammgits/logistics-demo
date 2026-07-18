# Setup: same template, two agents

Both Codex and Antigravity read `AGENTS.md` natively and both support the same
open **Agent Skills** format (a folder with `SKILL.md`). This template already
puts skills at `.agents/skills/` which both tools recognize at the repo root —
so you do NOT need separate folders per tool. One template, both agents.

## Codex CLI
- Reads `AGENTS.md` at repo root automatically (also walks up to
  `~/.codex/AGENTS.md` for global rules across all your projects).
- Project skills: `.agents/skills/` (already used here) — Codex also checks
  `.codex/skills/` if you prefer that path, but `.agents/skills/` works out of
  the box per the current spec.
- Skills auto-activate when your prompt matches a skill's `description`, or
  invoke explicitly with `$skill-name` in the CLI, or `/skills` to list them.

## Antigravity
- Reads `AGENTS.md` at repo root the same way.
- Project skills default to `.agents/skills/` (older installs may still look
  in `.agent/skills/` — if a skill isn't triggering, check which one your
  install uses).
- Skills auto-load based on semantic match to your request; you can also
  mention a skill by name in chat to force it.
- You can also define custom slash-workflows in `.agents/workflows/` if you
  want a single command (e.g. `/newclient`) to kick off "read DESIGN.md →
  propose art direction → scaffold from template → build".

## Per-client workflow
1. Duplicate this template repo for the new client.
2. Fill in `design-system/DESIGN.md` (and drop screenshots in `/inspirations`)
   BEFORE asking the agent to build anything — this is what stops it from
   defaulting to the generic AI look.
3. Open in Codex or Antigravity, say what the site needs (e.g. "landing page,
   scroll-driven 3D hero, portfolio grid below") — AGENTS.md forces it to read
   the design system and propose direction first, then the two skills
   (`anti-ai-slop-design`, `three-storytelling-scroll`) kick in automatically
   for the visual and 3D work.
4. Reuse `/components` and `/templates` across clients so the library compounds
   — each project should leave the shared parts a little better than it found them.
