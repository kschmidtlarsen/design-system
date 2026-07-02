# Yggdrasil Design System — "Graphite Iris"

The single source of truth for the look of every `*.exe.pm` app. Change it once,
redeploy, and every site repaints on its next load. Served publicly from
**`design.exe.pm`** (no Cloudflare Access — it's just CSS/JS, no secrets).

## Use it (no build step)

```html
<!-- in <head>, before the Tailwind CDN -->
<link rel="stylesheet" href="https://design.exe.pm/latest/iris.css">
<script src="https://design.exe.pm/latest/tailwind-preset.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = { presets: [YGGDRASIL_DESIGN] }</script>
```

Set the theme on `<html>`: `data-theme="dark"` (default) or `data-theme="light"`.
Then use tokens via Tailwind utilities (`bg-surface text-muted border-line rounded`)
or the `.ys-*` component classes (`.ys-btn--primary`, `.ys-card`, `.ys-pill--ok`, …).
See the live showcase at https://design.exe.pm.

## If a site needs something specific — the override ladder

Use the cheapest rung that keeps you in the system:

1. **Retune a token locally.** Load a tiny site stylesheet *after* `iris.css`:
   ```css
   :root { --accent: #0E8FA3; }   /* this app wants cyan — one line */
   ```
   The site looks different but stays in the system and keeps receiving every
   future structural update (spacing, components, motion, fixes).
2. **Add a namespaced component** in the site's own CSS, built from shared tokens
   (`var(--surface)`, `var(--line)`, `var(--radius)`) so it matches automatically.
3. **Scope-opt-out** for a genuinely one-off section (rare) — wrap it and override.

**Hard rule:** never fork or copy the core `.ys-*` component CSS into an app.
Copying a component to tweak it is exactly how the current drift happened.
Central owns structure; sites own content, local extensions, and token retunes.

## Versioning / propagation

- **`/latest/`** is the live channel every app links. An edit here reaches every
  site on next load — this is the "one update, all sites" behaviour.
- **`/vN/`** are immutable snapshots (long cache). No app links them; they exist
  purely so a bad `/latest/` change can be rolled back in one step.

### Cutting a snapshot (rollback insurance)
```bash
# after a meaningful change, freeze the current latest:
mkdir -p public/v1 && cp public/iris.css public/tailwind-preset.js public/v1/
git commit -am "snapshot v1" && git push   # CI builds + Watchtower deploys
```

## Local dev
```bash
cd design-system && python3 -m http.server -d public 8080   # http://localhost:8080
```

## Deploy
Push to `main` → GitHub Actions builds the image → GHCR → Watchtower recreates the
`yggdrasil-design` container (declared in the Yggdrasil infra stack, stack 53). The
rest of stack 53 — Urd included — is never touched. Served at `design.exe.pm`
(public, no Cloudflare Access) via Cloudflare Tunnel → `http://192.168.0.20:6110`.
