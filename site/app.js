/* ------------------------------------------------------------------ *
 * THNK — bouwt de pagina's op uit content.js en releases.js.
 * Wordt door zowel index.html als music.html gebruikt: elk onderdeel
 * draait alleen als het op de pagina aanwezig is.
 * Je hoeft hier niets aan te passen om de site bij te werken.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  // Voer fn uit met het element, maar alleen als het op deze pagina bestaat.
  const on = (sel, fn) => { const n = $(sel); if (n) fn(n); };

  const REL = (typeof RELEASES !== 'undefined') ? RELEASES : [];

  /* Merkicoontje bij een dienst. Ontbreekt er een, dan blijft alleen de
     naam staan — de knop werkt dan gewoon door. */
  function brandIcon(name) {
    const d = (typeof BRAND_ICONS !== 'undefined') && BRAND_ICONS[name];
    if (!d) return null;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', d);
    svg.append(path);
    return svg;
  }

  const LOGO = 'assets/thnk-logo-wit.svg';
  const logoImg = (label) => {
    const img = new Image();
    img.src = LOGO;
    img.alt = label;
    return img;
  };

  const external = (a, url) => { a.href = url; a.target = '_blank'; a.rel = 'noopener'; return a; };

  // Opnamestand: ?shot in de URL zet de hero op natuurlijke hoogte en de
  // invloeianimaties uit, zodat de hele pagina in één screenshot past.
  if (location.search.includes('shot')) document.body.classList.add('is-shot');

  /* --- Achtergrondpatroon ------------------------------------------ *
   * Het liggende streepje uit het logo, in vier standen (— \ | /) in een
   * tegel van 96x96 die naadloos doorloopt. Kleur via currentColor, dus
   * het patroon keert vanzelf om op een witte sectie.                 */
  let patCount = 0;
  const PILL = 'width="32" height="5" rx="2.5"';
  function addPattern(host, extra = '') {
    const id = `pat${++patCount}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `pat ${extra}`.trim());
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      `<defs><pattern id="${id}" width="96" height="96" patternUnits="userSpaceOnUse">`
      + `<g fill="currentColor">`
      + `<rect x="8"  y="21.5" ${PILL}/>`
      + `<rect x="56" y="21.5" ${PILL} transform="rotate(45 72 24)"/>`
      + `<rect x="8"  y="69.5" ${PILL} transform="rotate(90 24 72)"/>`
      + `<rect x="56" y="69.5" ${PILL} transform="rotate(135 72 72)"/>`
      + `</g></pattern></defs>`
      + `<rect width="100%" height="100%" fill="url(#${id})"/>`;
    host.prepend(svg);
  }
  document.querySelectorAll('[data-pattern]').forEach((s) => addPattern(s));
  // Witte secties: heel subtiel, bovenaan het duidelijkst en naar onderen
  // weggevaagd in het wit.
  document.querySelectorAll('.sec.is-light').forEach((s) => addPattern(s, 'pat--fade'));

  /* --- Kop, hero en voet ------------------------------------------- */
  on('#heroLogo', (n) => n.append(logoImg('THNK')));
  on('.bar__logo', (n) => n.append(logoImg('THNK')));
  on('#footLogo', (n) => n.append(logoImg('THNK')));
  on('#tagline', (n) => { n.textContent = CONTENT.tagline; });
  on('#year', (n) => { n.textContent = new Date().getFullYear(); });

  /* --- Spotify-speler ---------------------------------------------- */
  on('#player', (n) => {
    if (!CONTENT.spotifyArtistId) return;
    const frame = el('iframe');
    frame.src = `https://open.spotify.com/embed/artist/${CONTENT.spotifyArtistId}?theme=0`;
    frame.title = 'THNK on Spotify';
    frame.loading = 'lazy';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    n.append(frame);
  });

  /* --- Releases ---------------------------------------------------- *
   * Alles komt uit releases.js (gegenereerd door sync-releases.mjs),
   * nieuwste eerst. Beide pagina's gebruiken dezelfde kaart.           */
  const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  function art(r, eager) {
    const box = el('div', 'art');
    if (r.cover) {
      const img = new Image();
      img.src = r.cover;
      img.alt = '';                 // de link eromheen draagt de omschrijving
      img.width = 600; img.height = 600;
      img.decoding = 'async';
      // Lui laden scheelt data; in de opnamestand niet, anders staan er
      // lege vlakken op de screenshot.
      if (!eager && !document.body.classList.contains('is-shot')) img.loading = 'lazy';
      box.append(img);
    }
    return box;
  }

  // Spotify als die er is; anders Apple Music, zodat een hoes nooit dood is.
  const listenUrl = (r) => r.spotify || r.link || '';
  const listenOn = (r) => (r.spotify ? 'Spotify' : 'Apple Music');

  function linkFor(r) {
    const a = el('a');
    if (listenUrl(r)) external(a, listenUrl(r));
    a.setAttribute('aria-label', `${r.title} — ${r.artists}, ${r.year}. Listen on ${listenOn(r)}`);
    return a;
  }

  function card(r) {
    const li = el('li', 'cover');
    const a = linkFor(r);
    a.append(art(r), el('div', 'cover__title', r.title),
      el('div', 'cover__sub', `${r.year} · ${r.type}`));
    li.append(a);
    return li;
  }

  // Homepage: nieuwste release groot
  on('#feature', (n) => {
    const r = REL[0];
    if (!r) return;
    const a = linkFor(r);
    a.append(art(r, true));
    const meta = el('div');
    meta.append(
      el('div', 'feature__kicker', 'Latest release'),
      el('h3', 'feature__title', r.title),
      el('p', 'feature__sub', [r.artists, dateFmt.format(new Date(r.date)), r.label].filter(Boolean).join(' · ')));
    const actions = el('div', 'feature__actions');
    if (listenUrl(r)) actions.append(external(el('a', 'btn btn--solid', 'Listen'), listenUrl(r)));
    actions.append(Object.assign(el('a', 'btn', 'All releases'), { href: 'music.html' }));
    n.append(a, meta, actions);
  });

  // Homepage: de zes daarna
  on('#latest', (n) => REL.slice(1, 7).forEach((r) => n.append(card(r))));

  // Muziekpagina: alles, gegroepeerd per jaar, met filter
  on('#disco', (n) => {
    const years = [...new Set(REL.map((r) => r.year))];     // al gesorteerd, nieuwste eerst
    const count = (y) => REL.filter((r) => r.year === y).length;

    on('#discoCount', (c) => {
      c.textContent = `${REL.length} releases, ${years[years.length - 1]}–${years[0]}.`;
    });

    const groups = years.map((y) => {
      const sec = el('section', 'disco__year');
      sec.dataset.year = y;
      sec.append(el('h3', 'disco__label', String(y)));
      const ul = el('ul', 'covers');
      REL.filter((r) => r.year === y).forEach((r) => ul.append(card(r)));
      sec.append(ul);
      n.append(sec);
      return sec;
    });

    // Filterknoppen — de jaren komen uit de data, dus er is nooit een leeg filter.
    on('#filters', (f) => {
      const chips = [['all', 'All', REL.length], ...years.map((y) => [String(y), String(y), count(y)])]
        .map(([key, label, num]) => {
          const b = el('button', 'chip', label);
          b.type = 'button';
          b.dataset.key = key;
          b.append(el('span', null, String(num)));
          b.addEventListener('click', () => select(key, true));
          f.append(b);
          return b;
        });

      function select(key, push) {
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.key === key)));
        groups.forEach((g) => { g.hidden = key !== 'all' && g.dataset.year !== key; });
        if (push) history.replaceState(null, '', key === 'all' ? location.pathname : `#${key}`);
      }

      // Een link als music.html#2017 opent meteen op dat jaar.
      const fromHash = location.hash.slice(1);
      select(years.map(String).includes(fromHash) ? fromHash : 'all', false);
    });
  });

  /* Op een touchscreen bestaat hover niet. Daar kleurt een hoes zodra
     hij midden in beeld staat. */
  if (matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    const lit = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-lit', e.isIntersecting));
    }, { rootMargin: '-38% 0px -38% 0px' });
    document.querySelectorAll('.cover, .feature').forEach((c) => lit.observe(c));
  }

  // Knoppenrij met de diensten waar je muziek staat.
  on('#platforms', (n) => {
    (CONTENT.platforms || []).filter((p) => p.url).forEach((p) => {
      const a = external(el('a', null, p.name), p.url);
      const icon = brandIcon(p.name);
      if (icon) a.prepend(icon);
      n.append(a);
    });
  });

  /* --- Agenda ------------------------------------------------------ *
   * Geen data? Dan verdwijnt de lijst en komt er een uitnodiging voor
   * in de plaats. Een lege agenda tonen is slechter dan geen agenda.  */
  on('#dateList', (dateBox) => {
    const dates = (CONTENT.dates || []).filter((d) => d && d.date);
    if (dates.length) {
      const fmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const list = el('ul');
      dateBox.append(list);
      dates
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach((d) => {
          const li = el('li', 'date');
          li.append(el('span', 'date__when', fmt.format(new Date(d.date))));
          const what = el('div', 'date__what');
          what.append(el('div', 'date__city', d.city));
          if (d.venue) what.append(el('div', 'date__venue', d.venue));
          li.append(what);
          if (d.tickets) li.append(external(el('a', 'btn', 'Tickets'), d.tickets));
          list.append(li);
        });
    } else {
      const box = el('div', 'empty');
      box.append(el('p', null,
        'No shows are scheduled right now. New dates will appear here — '
        + 'or get in touch if you want to book THNK.'));
      const a = el('a', 'btn btn--solid', 'Booking');
      a.href = '#booking';
      box.append(a);
      dateBox.append(box);
    }

    // Eerdere optredens, nieuwste bovenaan
    const past = (CONTENT.pastShows || []).filter((d) => d && d.date);
    if (past.length) {
      const fmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const wrap = el('div', 'past');
      wrap.append(el('p', 'past__label', 'Past shows'));
      const list = el('ul');
      past
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((d) => {
          const li = el('li', 'date');
          li.append(el('span', 'date__when', fmt.format(new Date(d.date))));
          const what = el('div', 'date__what');
          what.append(el('div', 'date__city', d.event || d.city));
          const where = [d.stage, [d.venue, d.city].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
          if (where) what.append(el('div', 'date__venue', where));
          li.append(what);
          if (d.link) li.append(external(el('a', 'past__link', 'Tracklist →'), d.link));
          list.append(li);
        });
      wrap.append(list);
      dateBox.append(wrap);
    }
  });

  /* --- Supported by ------------------------------------------------ *
   * Onder de bio: de DJ's die zijn tracks draaiden. De namen komen één
   * voor één binnen zodra het blok in beeld komt.                     */
  on('#about-body', (about) => {
    const sb = CONTENT.supportedBy;
    if (!sb || !(sb.names || []).length) return;
    const box = el('div', 'support');
    box.append(el('p', 'support__label', 'Supported by'));
    const list = el('ul', 'support__names');
    sb.names.forEach((name, i) => {
      const li = el('li', null, name);
      li.style.setProperty('--i', i);
      list.append(li);
    });
    box.append(list);
    if (sb.more && sb.url) box.append(external(el('a', 'support__more', `${sb.more} →`), sb.url));
    about.after(box);

    // Geen streepje vooraan een nieuwe regel: markeer de eerste naam van
    // elke regel (opnieuw als de breedte verandert).
    const markLines = () => {
      let top = null;
      [...list.children].forEach((li) => {
        const t = li.offsetTop;
        li.classList.toggle('is-first', t !== top);
        top = t;
      });
    };
    markLines();
    new ResizeObserver(markLines).observe(list);
  });

  /* --- Over -------------------------------------------------------- */
  on('#about-body', (about) => {
    const text = el('div', 'about__text');
    (CONTENT.bio || []).forEach((p) => text.append(el('p', null, p)));
    about.append(text);

    const side = el('div', 'about__side');
    if (CONTENT.photo) {
      const wrap = el('div', 'about__photo');
      const img = new Image();
      img.src = CONTENT.photo;
      img.alt = 'THNK';
      img.loading = 'lazy';
      wrap.append(img);
      side.append(wrap);
    } else if ((CONTENT.stats || []).length) {
      const stats = el('div', 'stats');
      const values = [];
      CONTENT.stats.forEach((s) => {
        const box = el('div', 'stat');
        const v = el('div', 'stat__value', s.value);
        v.setAttribute('aria-label', s.value);   // voorlezers krijgen meteen het eindgetal
        values.push([v, s.value]);
        box.append(v, el('div', 'stat__label', s.label));
        stats.append(box);
      });
      side.append(stats);
      countUp(stats, values);
    }
    about.append(side);
  });

  /* --- Tellers ------------------------------------------------------ *
   * De cijfers tellen op vanaf 0 zodra ze in beeld komen, en eindigen
   * altijd precies op de tekst uit content.js. Voor- en achtervoegsels
   * ('M+', '+') blijven staan; '7,000' houdt z'n komma, '1.3' z'n decimaal.
   * Zonder beweging (of in de opnamestand) staat meteen het eindgetal.  */
  function countUp(host, values) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches
      || document.body.classList.contains('is-shot')) return;

    const parts = values.map(([node, text]) => {
      const m = text.match(/^(\D*)([\d.,]+)(.*)$/);
      if (!m) return null;
      const grouped = m[2].includes(',');
      const raw = m[2].replace(/,/g, '');
      const decimals = grouped ? 0 : (raw.split('.')[1] || '').length;
      return { node, text, pre: m[1], post: m[3], target: parseFloat(raw), grouped, decimals };
    }).filter(Boolean);

    const show = (p, n) => {
      const num = p.grouped
        ? Math.round(n).toLocaleString('en-US')
        : n.toFixed(p.decimals);
      p.node.textContent = p.pre + num + p.post;
    };
    parts.forEach((p) => show(p, 0));

    const DUR = 1600;
    const ease = (t) => 1 - Math.pow(1 - t, 3);          // snel beginnen, zacht landen
    function run() {
      const t0 = performance.now();
      parts.forEach((p, i) => {
        const delay = i * 160;
        const tick = (now) => {
          const t = Math.max(0, Math.min(1, (now - t0 - delay) / DUR));
          if (t < 1) { show(p, p.target * ease(t)); requestAnimationFrame(tick); }
          else p.node.textContent = p.text;             // exact de tekst uit content.js
        };
        requestAnimationFrame(tick);
      });
    }

    const io = new IntersectionObserver((e) => {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      run();
    }, { threshold: 0.4 });
    io.observe(host);
  }

  /* --- Boekingen --------------------------------------------------- */
  on('#booking-body', (bk) => {
    if (CONTENT.booking && CONTENT.booking.email) {
      const a = el('a', 'booking__mail', CONTENT.booking.email);
      a.href = `mailto:${CONTENT.booking.email}`;
      bk.append(a);
    }
    if (CONTENT.booking && CONTENT.booking.note) {
      bk.append(el('p', 'booking__note', CONTENT.booking.note));
    }
  });

  /* --- Socials ----------------------------------------------------- */
  on('#socials', (soc) => {
    (CONTENT.socials || []).filter((s) => s.url).forEach((s) => {
      const li = el('li');
      const a = external(el('a', null, s.name), s.url);
      const icon = brandIcon(s.name);
      if (icon) a.prepend(icon);
      li.append(a);
      soc.append(li);
    });
  });

  /* --- Balk vastzetten bij scrollen -------------------------------- */
  on('#bar', (bar) => {
    const onScroll = () => bar.classList.toggle('is-stuck', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  /* --- Binnenkomen bij het scrollen -------------------------------- *
   * Niet de sectie zelf vloeit in maar de onderdelen erin, één voor één.
   * De streep onder de kop groeit vanuit het midden open — dezelfde
   * beweging als in de logo-animatie.                                 */
  const STEP = 110;   // milliseconden tussen twee onderdelen
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!still && 'IntersectionObserver' in window) {
    const groups = [...document.querySelectorAll('.sec__in')];

    groups.forEach((g) => {
      [...g.children].forEach((kid, i) => {
        kid.style.setProperty('--d', `${i * STEP}ms`);
        kid.classList.add(kid.classList.contains('rule') ? 'rule-in' : 'reveal');
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        [...e.target.children].forEach((kid) => kid.classList.add('is-in'));
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -14% 0px' });

    groups.forEach((g) => io.observe(g));

    // De hero komt bij het laden binnen, niet bij het scrollen.
    const intro = ['#heroLogo', '.hero__tagline', '.hero__actions'];
    intro.forEach((sel, i) => {
      const n = $(sel);
      if (!n) return;
      n.style.setProperty('--d', `${120 + i * 150}ms`);
      n.classList.add('reveal');
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => intro.forEach((sel) => $(sel) && $(sel).classList.add('is-in')));
    });
  }
})();
