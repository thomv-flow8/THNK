/* ------------------------------------------------------------------ *
 * THNK — diepte in de hero.
 *
 * De hero bestaat uit lagen (lucht en bergen, logo, duinen, mos). Bij
 * scrollen zakt elke laag met een eigen snelheid mee, en met de muis
 * schuift elke laag een paar pixels opzij: hoe dichterbij, hoe meer.
 * Dat verschil in beweging is wat je als diepte ziet.
 *
 * Stilstaand bij bewegingsreductie en in de opnamestand (?shot); stopt
 * zodra de hero uit beeld is.
 *
 * Alleen met muis. Op een touchscreen scrolt de browser op een eigen spoor
 * en loopt JavaScript daar net achter: de lagen verspringen dan en het
 * beeld flikkert. Daar doet CSS de beweging (styles.css, scroll-animaties).
 * ------------------------------------------------------------------ */
const MOUSE = matchMedia('(hover: hover) and (pointer: fine)').matches;

(function () {
  'use strict';

  const host = document.getElementById('hero');
  if (!host) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.body.classList.contains('is-shot')
    || !MOUSE) return;

  // factor: hoeveel de laag meezakt bij scrollen (1 = blijft staan in beeld)
  // px:     hoeveel pixels de laag opzij schuift met de muis
  const LAYERS = [
    ['.hero__mountain', 0.70, 2],
    ['.hero__mark',     0.38, 6],
    ['.hero__dunes',    0.22, 10],
    ['.hero__moss',     0.04, 22],
    ['.hero__front',    0.03, 0],
  ].map(([sel, factor, px]) => ({ el: host.querySelector(sel), factor, px }))
   .filter((l) => l.el);

  let mx = 0, cur = 0, raf = 0;

  function apply() {
    const H = host.clientHeight || 1;
    const p = Math.max(0, Math.min(1, window.scrollY / H));
    cur += (mx - cur) * 0.08;                       // muis zacht naijlen
    for (const l of LAYERS) {
      l.el.style.transform =
        `translate3d(${(cur * l.px).toFixed(2)}px, ${(p * l.factor * H).toFixed(1)}px, 0)`;
    }
  }
  function loop() { apply(); raf = requestAnimationFrame(loop); }
  const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  if (matchMedia('(pointer: fine)').matches) {
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 … 1
    });
    host.addEventListener('pointerleave', () => { mx = 0; });
  }

  new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop())).observe(host);
})();

/* --- Waterval tussen hero en Music --------------------------------- *
 * Dezelfde beweging als in de hero: met de muis schuift het beeld een
 * paar pixels opzij, en bij het scrollen zakt het iets mee. Het beeld is
 * ruimer dan de band, dus er komt nooit een rand in beeld.
 * Alleen met muis; op een touchscreen doet CSS het (styles.css).      */
(function () {
  'use strict';

  const band = document.getElementById('flow');
  const img = band && band.querySelector('.flow__img');
  if (!img) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.body.classList.contains('is-shot')
    || !MOUSE) return;

  let mx = 0, cur = 0, raf = 0;

  function apply() {
    const r = band.getBoundingClientRect();
    // -1 (band komt net in beeld) … 1 (band gaat net uit beeld)
    const p = (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight + r.height) * 2;
    cur += (mx - cur) * 0.08;                    // muis zacht naijlen
    img.style.transform =
      `translate3d(${(cur * 14).toFixed(2)}px, ${(p * -22).toFixed(1)}px, 0)`;
    raf = requestAnimationFrame(apply);
  }
  const start = () => { if (!raf) raf = requestAnimationFrame(apply); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  band.addEventListener('pointermove', (e) => {
    const r = band.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;      // -1 … 1
  });
  band.addEventListener('pointerleave', () => { mx = 0; });

  new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop())).observe(band);
})();

/* --- IJsgrot achter Booking ---------------------------------------- *
 * Het grotbeeld schuift trager dan de pagina: het lijkt verder weg te
 * liggen dan de tekst ervoor. Maximaal 10% van de sectiehoogte, precies
 * de ruimte die het beeld aan boven- en onderkant over heeft.          */
(function () {
  'use strict';

  const sec = document.querySelector('.sec--cave');
  const cave = sec && sec.querySelector('.cave');
  if (!cave) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.body.classList.contains('is-shot')
    || !MOUSE) return;

  let pending = false, visible = false;
  function apply() {
    pending = false;
    const r = sec.getBoundingClientRect();
    const max = r.height * 0.1;
    const y = Math.max(-max, Math.min(max, r.top * 0.15));
    cave.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  }
  const request = () => { if (visible && !pending) { pending = true; requestAnimationFrame(apply); } };

  window.addEventListener('scroll', request, { passive: true });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; request(); }).observe(sec);
})();
