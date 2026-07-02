# Design System (Graphite Iris)

Central, CDN-hosted design system for every `*.exe.pm` app. One edit here repaints
all sites — it is the single definition of the stack's look.

**Production URL:** https://design.exe.pm (public — no Cloudflare Access)
**Repository:** https://github.com/kschmidtlarsen/design-system
**Infrastructure:** runs as the `design` service (container `yggdrasil-design`, port 6110)
inside the **Yggdrasil infra stack (53, repo yggdrasil-stack)**. Own image/CI here;
Watchtower updates only this container, so a design edit never redeploys stack 53 / Urd.

## What it is
- `public/iris.css` — tokens (light + dark) + `.ys-*` components + motion + stone material. **The deliverable.**
- `public/tailwind-preset.js` — maps tokens onto Tailwind CDN utilities (`bg-surface`, etc.).
- `public/index.html` — living showcase, served from the same `iris.css`.
- `/latest/` = live channel apps link; `/vN/` = immutable rollback snapshots.

## The look (locked 2026-07-02, kanban card-87e5da61)
Muted iris accent `--accent:#6C63D6` (NOT neon #7C6CFF), lifted-charcoal dark +
dimmed-light neutrals, `--radius:3px`, crisp hairlines, monospace metadata, tonal
counterpoint (`--invert-*`), stone-like matte texture (`--stone-c/-f`) on menu +
buttons, and meaning-driven motion. **Anti-AI-shine is a rule:** no gradients, glow,
glassmorphism, gradient text, emoji-as-icons, or neon saturation.

## Rules
- Token names are unprefixed (`--bg`, `--surface`, `--accent`, …) to match the
  existing convention and make migration/overrides trivial.
- Component classes are prefixed `.ys-*` so they never clobber an app's classes.
- Apps may retune tokens locally or add namespaced components — **never fork core CSS.**
- Never edit `/vN/` snapshots. Cut a new one; don't mutate an old one.

## Deploy
Push to `main` → CI builds image (packages:write) → GHCR → Watchtower redeploys.
Cross-check the host port against live Portainer bindings before first deploy
(compose provisionally uses 6125; host allocation drifts from infrastructure.yml).
