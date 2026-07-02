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
