/* Yggdrasil Design System — shared Tailwind CDN preset.
 * Maps the iris.css tokens onto Tailwind utilities so apps can write
 * `bg-surface text-muted border-line rounded` and stay on-system.
 *
 * Usage (no build step):
 *   <link rel="stylesheet" href="https://design.exe.pm/latest/iris.css">
 *   <script src="https://design.exe.pm/latest/tailwind-preset.js"></script>
 *   <script src="https://cdn.tailwindcss.com"></script>
 *   <script>tailwind.config = { presets: [YGGDRASIL_DESIGN] }</script>
 */
window.YGGDRASIL_DESIGN = {
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        "accent-2": "var(--accent-2)",
        "on-accent": "var(--on-accent)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        bad: "var(--bad)",
        "invert-surface": "var(--invert-surface)",
        "invert-ink": "var(--invert-ink)"
      },
      borderRadius: { DEFAULT: "var(--radius)", ys: "var(--radius)" },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "IBM Plex Mono", "Cascadia Code", "Menlo", "monospace"]
      },
      boxShadow: { ys: "0 16px 38px -26px rgba(0,0,0,.44), 0 2px 7px -3px rgba(0,0,0,.3)" }
    }
  }
};

/* Opt-in gray→iris neutral remap for bare-Tailwind apps that style with hardcoded
 * gray/slate/zinc/neutral utilities (bg-gray-800, text-slate-300, …). Spread it INTO
 * the app's own tailwind.config so those utilities resolve to iris tokens without a
 * class rewrite:
 *
 *   tailwind.config = { presets:[YGGDRASIL_DESIGN], theme:{ extend:{ colors:{
 *     slate: YGGDRASIL_GRAY_COMPAT, gray: YGGDRASIL_GRAY_COMPAT,
 *     zinc:  YGGDRASIL_GRAY_COMPAT, neutral: YGGDRASIL_GRAY_COMPAT,
 *   }}}};
 *
 * NOT folded into the default preset on purpose: it would hijack the neutral palettes
 * for every app, and a var()-valued color under an /opacity suffix (bg-slate-800/50)
 * renders FULLY TRANSPARENT — keep scrims/tints on native palettes (black, or that
 * shade left unremapped) or hand-fix. 700→--line suits border-dominant apps; if an app
 * uses 700 as a button FILL, override it locally to --surface-2. */
window.YGGDRASIL_GRAY_COMPAT = {
  950: "var(--bg)", 900: "var(--bg)", 850: "var(--surface)", 800: "var(--surface)",
  750: "var(--surface-2)", 700: "var(--line)", 600: "var(--line-2)", 500: "var(--faint)",
  400: "var(--muted)", 300: "var(--ink)", 200: "var(--ink)", 100: "var(--ink)", 50: "var(--ink)"
};
