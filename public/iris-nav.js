/* ============================================================================
 * Yggdrasil Design System — top-bar behaviour
 *
 * Optional companion to the .ys-topbar component in iris.css. Drop it in and
 * every [data-ys-topbar] on the page gets its mobile menu wired: toggle, close
 * on outside click / Escape / link activation, and a reset when the viewport
 * grows past the breakpoint (so rotating a phone can't leave the sheet stuck
 * open). No dependencies, no build step, safe to load twice.
 *
 *   <script src="https://design.exe.pm/latest/iris-nav.js" defer></script>
 *
 * Apps that need to drive it themselves can call window.YggdrasilNav.init(root)
 * after rendering a bar into the DOM — init is idempotent per element.
 * ==========================================================================*/
(function () {
  'use strict';

  var BREAKPOINT = 760; // keep in step with the media query in iris.css
  var WIRED = '__ysNavWired';

  function init(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var bars = scope.querySelectorAll('[data-ys-topbar]');
    for (var i = 0; i < bars.length; i++) wire(bars[i]);
    // allow init(bar) with the bar itself
    if (scope !== document && scope.matches && scope.matches('[data-ys-topbar]')) wire(scope);
  }

  function wire(bar) {
    if (bar[WIRED]) return;
    var burger = bar.querySelector('.ys-topbar__burger');
    var links = bar.querySelector('.ys-topbar__links');
    if (!burger || !links) return;
    bar[WIRED] = true;

    // Make the ARIA wiring self-healing: a missing id would silently break
    // aria-controls, and every app would have to remember to set it.
    if (!links.id) links.id = 'ys-topbar-links-' + Math.random().toString(36).slice(2, 8);
    burger.setAttribute('aria-controls', links.id);
    if (!burger.hasAttribute('aria-label')) burger.setAttribute('aria-label', 'Menu');
    if (!burger.hasAttribute('aria-expanded')) burger.setAttribute('aria-expanded', 'false');
    if (burger.tagName === 'BUTTON' && !burger.hasAttribute('type')) burger.type = 'button';

    function set(open) {
      links.classList.toggle('ys-open', open);
      burger.setAttribute('aria-expanded', String(open));
    }
    function isOpen() { return links.classList.contains('ys-open'); }

    burger.addEventListener('click', function (e) {
      e.stopPropagation();       // else the document handler closes it immediately
      e.preventDefault();
      set(!isOpen());
    });

    // Activating a nav item closes the sheet. Covers same-page SPA routing,
    // where no navigation happens to unmount it for us.
    links.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) set(false);
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !links.contains(e.target) && !burger.contains(e.target)) set(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { set(false); burger.focus(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > BREAKPOINT && isOpen()) set(false);
    });
  }

  window.YggdrasilNav = { init: init, BREAKPOINT: BREAKPOINT };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})();
