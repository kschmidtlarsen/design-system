# Yggdrasil Design System — "Graphite Iris"

The single source of truth for the look of every `*.exe.pm` app. Change it once,
redeploy, and every site repaints on its next load. Served publicly from
**[design.exe.pm](https://design.exe.pm)** — it's just CSS/JS with no secrets, so
there's no Cloudflare Access in front of it.

## Overview

Every app in the Yggdrasil stack (Kanban, Mimir, Calify, Grablist, …) links the
same central stylesheet and Tailwind preset from this repo instead of shipping its
own palette, buttons, and spacing. A single edit here reaches every site on its
next load, which is exactly the drift-killing behaviour the system exists to
provide.

The deliverable is a set of static assets — there is **no build step** for
consumers and no application server. The repo builds a tiny nginx image that
serves the files, and that image runs as one container inside the Yggdrasil infra
stack.

## Tech stack

- **Static assets:** hand-authored CSS (`iris.css`) + a plain-JS Tailwind preset
  (`tailwind-preset.js`)
- **Consumer styling:** [Tailwind CSS](https://tailwindcss.com) via CDN, driven by
  the shared preset
- **Serving:** `nginx:1.27-alpine`
- **CI/CD:** GitHub Actions → GHCR → Watchtower
- **No Node runtime, no database, no framework.**

## Architecture

Two files are the entire design system; everything else exists to serve, preview,
or document them.

- **`public/iris.css`** — the deliverable. CSS custom-property tokens (light + dark)
  plus the `.ys-*` component classes, a stone-material texture, and a motion layer.
- **`public/tailwind-preset.js`** — exposes `window.YGGDRASIL_DESIGN`, mapping the
  tokens onto Tailwind CDN utilities (`bg-surface`, `text-muted`, `border-line`, …).
  Also exposes an opt-in `window.YGGDRASIL_GRAY_COMPAT` remap for bare-Tailwind apps
  that hardcode `gray`/`slate`/`zinc`/`neutral` utilities.
- **`public/index.html`** — living showcase, served from the same `iris.css` apps
  link, so it always reflects the live system. Includes a light/dark toggle and a
  palette rendered from the live token values.
- **`public/llms.txt`** — a compact instruction sheet for agents building `*.exe.pm`
  apps.

### Serving channels (`nginx.conf`)

| Path      | Cache policy                                   | Purpose                                             |
| --------- | ---------------------------------------------- | --------------------------------------------------- |
| `/latest/`| `public, max-age=300, must-revalidate`         | Live channel every app links; edits propagate here  |
| `/vN/`    | `public, max-age=31536000, immutable`          | Immutable rollback snapshots; apps should not link  |
| `/`       | default                                        | Showcase and root assets                            |

All paths send `Access-Control-Allow-Origin: *` so any origin can load the assets.
The `/latest/` directory is materialised from the canonical `public/` root at image
build time (see `Dockerfile`), so there is never a second hand-maintained copy to
drift.

### Design tokens

CSS custom properties, unprefixed to match the existing convention and make local
retunes trivial. Both themes are defined; dark is the default ground, `light` is
opted into with `data-theme="light"` on `<html>`.

```
--bg --surface --surface-2 --line --line-2 --ink --muted --faint
--accent (#6C63D6 muted iris) --accent-ink --accent-2 --accent-surface --on-accent
--ok --warn --bad
--invert-surface --invert-ink --invert-line --invert-muted   (tonal counterpoint)
--radius (3px) --shadow --font-sans --font-mono
--stone-c --stone-f   (matte SVG-noise material)
```

### Components (`.ys-*`)

Prefixed so they never clobber an app's own classes:

- **Buttons:** `.ys-btn` with `--primary` / `--secondary` / `--ghost` / `--danger` /
  `--invert`
- **Surfaces:** `.ys-card` (+ `.ys-card__head`), `.ys-field` / `.ys-input`
- **Navigation:** `.ys-rail`, `.ys-nav` (+ `--active`)
- **Status / tags:** `.ys-pill` (`--accent` / `--ok` / `--warn` / `--bad`),
  `.ys-tag`, `.ys-itag`, `.ys-kbd`, `.ys-seg` / `.ys-seg__tab`
- **Tables:** `.ys-table` (+ `.ys-num`)
- **Typography helpers:** `.ys-mono`, `.ys-microlabel`, `.ys-tnum`
- **Material:** `.ys-stone` (opt any surface into the stone texture)
- **Motion:** `.ys-spinner`, `.ys-reveal`, `.ys-typing`, `.ys-live-dot` — all
  suppressed under `prefers-reduced-motion`

### Anti-"AI shine" — a rule, not a preference

No gradients, no coloured glow, no glassmorphism, no gradient text, no emoji as
icons, no neon saturation. Emphasis and warmth come from flat fills, hairline
borders, the stone texture, and motion that maps to real system state (a request in
flight, a deploy running) — never decoration.

## Getting started

### Use it in an app (no build step)

Add to every app's `<head>`, **before** the Tailwind CDN script:

```html
<link rel="stylesheet" href="https://design.exe.pm/latest/iris.css">
<script src="https://design.exe.pm/latest/tailwind-preset.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = { presets: [YGGDRASIL_DESIGN] }</script>
```

Set the theme on `<html>`: `data-theme="dark"` (default) or `data-theme="light"`.
Then style with the token-mapped Tailwind utilities (`bg-surface text-muted
border-line rounded`) or the `.ys-*` component classes.

### Run the showcase locally

No Docker required:

```bash
python3 -m http.server -d public 8080   # http://localhost:8080
```

Or build and run the production image locally:

```bash
docker compose -f docker-compose.dev.yml up   # http://localhost:8080
```

## Configuration

There are no runtime environment variables — the service is static nginx. CI uses
the standard GitHub Actions token:

| Name           | Purpose                                             | Required |
| -------------- | --------------------------------------------------- | -------- |
| `GITHUB_TOKEN` | GHCR login for the build-and-push workflow (auto)   | Yes (CI) |

## The override ladder — when a site needs something specific

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
Copying a component to tweak it is exactly how drift happens. Central owns
structure; sites own content, local extensions, and token retunes.

## Versioning / propagation

- **`/latest/`** is the live channel every app links. An edit here reaches every
  site on next load — this is the "one update, all sites" behaviour.
- **`/vN/`** are immutable snapshots (long cache). No app links them; they exist
  purely so a bad `/latest/` change can be rolled back in one step. Never edit an
  existing snapshot — cut a new one instead.

### Cutting a snapshot (rollback insurance)

```bash
# after a meaningful change, freeze the current latest:
mkdir -p public/v1 && cp public/iris.css public/tailwind-preset.js public/v1/
git commit -am "snapshot v1" && git push   # CI builds + Watchtower deploys
```

## Project structure

```
design-system/
├── public/
│   ├── iris.css              # tokens + .ys-* components + motion + stone material — the deliverable
│   ├── tailwind-preset.js    # YGGDRASIL_DESIGN preset + YGGDRASIL_GRAY_COMPAT remap
│   ├── index.html            # living showcase (served from the same iris.css)
│   └── llms.txt              # instruction sheet for agents building *.exe.pm apps
├── nginx.conf                # /latest/ (short cache) vs /vN/ (immutable) + CORS
├── Dockerfile                # nginx:1.27-alpine; materialises /latest/ at build; healthcheck
├── docker-compose.dev.yml    # local preview on :8080
├── docker-compose.prod.yml   # documentation only — prod runs inside the infra stack
├── .github/workflows/deploy.yml  # build + push image to GHCR on push to main
└── CLAUDE.md                 # agent working notes for this repo
```

## Deployment

Standard Yggdrasil flow, with one twist: this repo owns its own image and CI, but
the container itself is declared in the **Yggdrasil infra stack** rather than a
stack of its own.

```
git push main
  → GitHub Actions (.github/workflows/deploy.yml) builds the nginx image
  → pushed to ghcr.io/kschmidtlarsen/design-system:latest (and :<sha>)
  → Watchtower recreates ONLY the yggdrasil-design container
```

Because Watchtower updates just this one container, editing the design never
redeploys the rest of the infra stack (Urd stays untouched).

- **Container:** `yggdrasil-design`
- **Service:** `design` in the Yggdrasil infra stack (**stack 53**, repo
  `yggdrasil-stack`, `docker-compose.yml`)
- **Port:** `6110:80` (host `6110` → container nginx `80`)
- **Public URL:** [design.exe.pm](https://design.exe.pm) via Cloudflare Tunnel →
  `http://192.168.0.20:6110` — **no** Cloudflare Access (public, no secrets)

The `docker-compose.prod.yml` in this repo is intentionally non-functional
documentation: it records the service block as declared in `yggdrasil-stack` and
notes that production does not run design-system as a standalone stack.

## Related

- **Live showcase:** https://design.exe.pm — every component, light + dark
- **Consumed by:** all `*.exe.pm` apps in the Yggdrasil stack
- **Runs alongside:** the rest of the Yggdrasil infra stack (Urd, dashboard, Eir,
  Ollama, Watchtower)
