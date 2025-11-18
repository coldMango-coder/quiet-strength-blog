// Small, idle-hydrated enhancement: scrollspy + smooth scrolling
(window.requestIdleCallback || function (cb) { setTimeout(cb, 1); })(initTOC);

function initTOC() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    const nav = document.querySelector('nav.toc');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const map = new Map();
    links.forEach(a => {
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const el = document.getElementById(id);
      if (el) map.set(el, a);
    });

    // Scrollspy without layout shifts: only toggle data-active
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          const a = map.get(e.target);
          if (!a) return;
          if (e.isIntersecting) {
            a.setAttribute('data-active', 'true');
          } else {
            a.setAttribute('data-active', 'false');
          }
        });
      }, { rootMargin: '0px 0px -70% 0px', threshold: 0.01 });
      map.forEach((_a, el) => obs.observe(el));
    }
  } catch (e) {
    // no-op
  }
}

