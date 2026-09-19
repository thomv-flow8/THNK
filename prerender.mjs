// THNK — zet de teksten uit site/content.js en site/releases.js als gewone
// HTML in de pagina's. Zo lezen zoekmachines en AI-assistenten je bio,
// releases en shows ook zonder JavaScript.
//
// Jij blijft in content.js werken: dit script draait bij het publiceren
// (zie .github/workflows/pages.yml) en vult de lege blokken. In de browser
// maakt app.js diezelfde blokken leeg en bouwt de echte weergave op.
//
//   node prerender.mjs            (schrijft in site/)
//   node prerender.mjs --check    (alleen kijken, niets schrijven)

import { readFileSync, writeFileSync } from 'fs';

const DIR = 'site';
const CHECK = process.argv.includes('--check');

/* --- Inhoud inlezen ----------------------------------------------- *
 * content.js en releases.js zijn gewone scripts (geen modules), dus we
 * voeren ze uit in een lege omgeving en pakken de variabelen op.      */
const read = (file, name) => {
  const src = readFileSync(`${DIR}/${file}`, 'utf8');
  // eslint-disable-next-line no-new-func
  return new Function(`${src}; return ${name};`)();
};
const CONTENT = read('content.js', 'CONTENT');
const REL = read('releases.js', 'RELEASES');

/* --- Hulpjes ------------------------------------------------------- */
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const dateFmt = (iso) => new Intl.DateTimeFormat('en-GB',
  { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));

const listen = (r) => r.spotify || r.link || '';
const link = (r, inner) => (listen(r)
  ? `<a href="${esc(listen(r))}" target="_blank" rel="noopener">${inner}</a>`
  : inner);

// Vaste maat: de pagina springt niet als de hoezen binnenkomen. Leeg alt,
// want de titel staat er in tekst naast. De eerste paar laden meteen.
const cover = (r, eager) => `<div class="art"><img src="${esc(r.cover)}" width="600" height="600" alt=""`
  + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + '></div>';

/* --- De blokken ---------------------------------------------------- */
const feature = () => {
  const r = REL[0];
  if (!r) return '';
  const sub = [r.artists, dateFmt(r.date), r.label].filter(Boolean).join(' · ');
  return link(r, cover(r, true))
    + `<div><div class="feature__kicker">Latest release</div>`
    + `<h3 class="feature__title">${esc(r.title)}</h3>`
    + `<p class="feature__sub">${esc(sub)}</p></div>`;
};

const card = (r, eager) => `<li>${link(r, cover(r, eager)
  + `<div class="cover__title">${esc(r.title)}</div>`
  + `<div class="cover__meta">${esc(r.year)} · ${esc(r.kind || '')}</div>`)}</li>`;

const latest = () => REL.slice(1, 7).map((r, i) => card(r, i < 3)).join('');

const about = () => {
  const bio = (CONTENT.bio || []).map((p) => `<p>${esc(p)}</p>`).join('');
  const stats = (CONTENT.stats || [])
    .map((s) => `<div class="stat"><div class="stat__value">${esc(s.value)}</div>`
      + `<div class="stat__label">${esc(s.label)}</div></div>`).join('');
  return `<div class="about__text">${bio}</div>`
    + (stats ? `<div class="about__side"><div class="stats">${stats}</div></div>` : '');
};

const support = () => {
  const sb = CONTENT.supportedBy;
  if (!sb || !(sb.names || []).length) return '';
  const names = sb.names.map((n, i) => `<li style="--i:${i}">${esc(n)}</li>`).join('');
  const more = sb.more && sb.url
    ? `<a class="support__more" href="${esc(sb.url)}" target="_blank" rel="noopener">${esc(sb.more)} →</a>` : '';
  return `<div class="support"><p class="support__label">Supported by</p>`
    + `<div class="support__clip"><ul class="support__names">${names}</ul></div>${more}</div>`;
};

const shows = () => {
  const row = (when, what, where, extra = '') =>
    `<li class="date"><span class="date__when">${esc(when)}</span>`
    + `<div class="date__what"><div class="date__city">${esc(what)}</div>`
    + (where ? `<div class="date__venue">${esc(where)}</div>` : '') + `</div>${extra}</li>`;

  const next = (CONTENT.dates || []).filter((d) => d && d.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => row(dateFmt(d.date), d.city, d.venue || '')).join('');

  const past = (CONTENT.pastShows || []).filter((d) => d && d.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((d) => row(dateFmt(d.date), d.event || d.city,
      [d.stage, [d.venue, d.city].filter(Boolean).join(', ')].filter(Boolean).join(' · '))).join('');

  const head = next
    ? `<ul>${next}</ul>`
    : `<div class="empty"><p>No shows are scheduled right now. New dates will appear here — `
      + `or get in touch if you want to book THNK.</p><a class="btn btn--solid" href="#booking">Booking</a></div>`;
  return head + (past ? `<div class="past"><p class="past__label">Past shows</p><ul>${past}</ul></div>` : '');
};

const booking = () => {
  const b = CONTENT.booking || {};
  if (!b.email) return '';
  return `<a class="booking__mail" href="mailto:${esc(b.email)}">${esc(b.email)}</a>`
    + (b.note ? `<p class="booking__note">${esc(b.note)}</p>` : '');
};

const links = (items) => (items || []).filter((x) => x.url)
  .map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.name)}</a>`).join('');

const socials = () => (CONTENT.socials || []).filter((s) => s.url)
  .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`).join('');

const disco = () => {
  const years = [...new Set(REL.map((r) => r.year))];
  // H2, want de paginakop is een H1: koppen mogen geen niveau overslaan
  return years.map((y, yi) => `<section><h2 class="disco__label">${esc(y)}</h2><ul class="covers">`
    + REL.filter((r) => r.year === y).map((r, i) => card(r, yi === 0 && i < 3)).join('')
    + `</ul></section>`).join('');
};

/* --- In de pagina zetten ------------------------------------------- *
 * Vervangt de inhoud van een leeg blok op id. De blokken zijn in de bron
 * altijd leeg, dus dit blijft herhaalbaar.                            */
function put(html, id, inner) {
  const re = new RegExp(`(<([a-z]+)[^>]*\\bid="${id}"[^>]*>)([\\s\\S]*?)(</\\2>)`);
  if (!re.test(html)) throw new Error(`blok #${id} niet gevonden`);
  return html.replace(re, (m, open, tag, old, close) => open + inner + close);
}

let index = readFileSync(`${DIR}/index.html`, 'utf8');
index = put(index, 'tagline', esc(CONTENT.tagline || ''));
index = put(index, 'feature', feature());
index = put(index, 'latest', latest());
index = put(index, 'platforms', links(CONTENT.platforms));
index = put(index, 'dateList', shows());
index = put(index, 'about-body', about());
index = put(index, 'booking-body', booking());
index = put(index, 'socials', socials());
// Supported by staat náást het about-blok, net als in app.js
index = index.replace(/(<div class="about" id="about-body">[\s\S]*?<\/div>\s*)(<\/div>)/,
  (m, body, close) => `${body}${support()}\n    ${close}`);

let music = readFileSync(`${DIR}/music.html`, 'utf8');
const years = [...new Set(REL.map((r) => r.year))];
music = put(music, 'discoCount', `${REL.length} releases, ${years[years.length - 1]}–${years[0]}.`);
music = put(music, 'disco', disco());
music = put(music, 'socials', socials());

const words = (html) => (html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length);
console.log(`index.html  ~${words(index)} woorden`);
console.log(`music.html  ~${words(music)} woorden`);

if (CHECK) {
  console.log('\n--check: niets weggeschreven.');
} else {
  writeFileSync(`${DIR}/index.html`, index);
  writeFileSync(`${DIR}/music.html`, music);
  console.log('\nTeksten in site/index.html en site/music.html gezet.');
}
