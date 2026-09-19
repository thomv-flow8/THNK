// THNK — haalt de discografie op bij Apple Music en maakt er site/releases.js
// plus de hoezen in site/assets/covers/ van.
//
//   node sync-releases.mjs
//
// Hoezen die al bestaan worden niet opnieuw gedownload. Instellingen staan in
// releases.config.mjs.
import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import CONFIG from './releases.config.mjs';

const COVER_DIR = 'site/assets/covers';
const COVER_SIZE = 600;
mkdirSync(COVER_DIR, { recursive: true });

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "Shift EP", "Shift - EP" en "Shift - Single" zijn dezelfde release.
const baseTitle = (name) => name.replace(/\s*-\s*(EP|Single)\s*$/i, '').replace(/\s+EP\s*$/i, '').trim();

// Labelnaam uit het copyrightveld: "℗ 2016 Armada Music B.V." → "Armada Music B.V."
// Juridische toevoegingen eraf: B.V., Limited, "under exclusive license to …".
const labelFrom = (c = '') => {
  const l = c.replace(/^[℗©]\s*/, '').replace(/^\d{4}\s*/, '')
    .replace(/\s+under exclusive licen[cs]e to .*$/i, '')
    .replace(/[,\s]+(B\.V\.|Limited|Ltd\.?|LLC|Inc\.?)$/i, '')
    .trim();
  return /^thnk$/i.test(l) ? '' : l;
};

const bigArt = (url) => url.replace(/\/\d+x\d+bb\./, `/${COVER_SIZE}x${COVER_SIZE}bb.`);

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} bij ${url}`);
  return r.json();
}

async function download(url, file) {
  if (existsSync(file)) return 'bestond al';
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} bij ${url}`);
  writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  return 'gedownload';
}

/* --- 1. Eigen releases van de artiestenpagina ---------------------- */
const data = await getJSON(
  `https://itunes.apple.com/lookup?id=${CONFIG.appleArtistId}&entity=album&limit=200&country=nl`);
const albums = data.results.filter((r) => r.wrapperType === 'collection');

const excluded = new Set(CONFIG.exclude.map((t) => t.toLowerCase()));
const groups = new Map();
for (const a of albums) {
  const title = baseTitle(a.collectionName);
  if (excluded.has(title.toLowerCase())) continue;
  const key = title.toLowerCase();
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(a);
}

const releases = [];
for (const [, versions] of groups) {
  // Van dubbele versies: de uitgebreidste, met de vroegste datum.
  const main = versions.slice().sort((x, y) => y.trackCount - x.trackCount)[0];
  const date = versions.map((v) => v.releaseDate.slice(0, 10)).sort()[0];
  const isEP = versions.some((v) => /\bEP\b/i.test(v.collectionName)) || main.trackCount >= 4;
  releases.push({
    title: baseTitle(main.collectionName),
    artists: main.artistName,
    type: isEP ? 'EP' : 'Single',
    date,
    label: labelFrom(main.copyright),
    art: bigArt(main.artworkUrl100),
    link: main.collectionViewUrl.split('?')[0],
  });
}

/* --- 2. Remixes en samenwerkingen van andere artiesten ------------- */
const missing = [];
for (const x of CONFIG.extra) {
  const q = encodeURIComponent(x.search);
  const res = await getJSON(`https://itunes.apple.com/search?term=${q}&entity=song&limit=10&country=nl`);
  const words = x.title.toLowerCase().replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => w.length > 2);
  // Alleen een treffer accepteren als THNK erin voorkomt én de titel klopt.
  const hit = res.results.find((r) => {
    const hay = `${r.artistName} ${r.trackName} ${r.collectionName}`.toLowerCase();
    return hay.includes('thnk') && words.every((w) => hay.includes(w));
  });
  if (!hit) missing.push(x.title);
  releases.push({
    title: x.title,
    artists: x.artists,
    type: x.type,
    // Een datum in de config wint altijd. Anders is het jaar uit de config
    // leidend: Apple geeft bij remixes soms de datum van het origineel
    // (Greece 2000 kwam terug als 1997, Anasthasia als 1992).
    date: x.date || (hit && Number(hit.releaseDate.slice(0, 4)) === x.year
      ? hit.releaseDate.slice(0, 10) : `${x.year}-01-01`),
    label: x.label,
    art: hit ? bigArt(hit.artworkUrl100) : null,
    link: hit ? hit.trackViewUrl.split('?')[0] : '',
  });
}

/* --- 3. Hoezen downloaden ----------------------------------------- */
releases.sort((a, b) => b.date.localeCompare(a.date));
const log = [];
for (const r of releases) {
  r.id = slug(r.title);
  if (!r.art) { r.cover = null; log.push([r.date, r.title, 'GEEN HOES']); continue; }
  const file = `${COVER_DIR}/${r.id}.jpg`;
  try {
    log.push([r.date, r.title, await download(r.art, file)]);
    r.cover = `assets/covers/${r.id}.jpg`;
  } catch (e) {
    r.cover = null;
    log.push([r.date, r.title, 'MISLUKT: ' + e.message]);
  }
  delete r.art;
}

/* --- Spotify-links ------------------------------------------------ *
 * Uit releases.config.mjs (spotify: { titel: link }). Apple kent de
 * Spotify-link niet, en automatisch koppelen via een externe dienst
 * vereist inmiddels een API-sleutel. Een lijst die je zelf bijhoudt is
 * simpeler en kan niet ineens stoppen met werken.                    */
const SPOTIFY = CONFIG.spotify || {};
for (const r of releases) r.spotify = SPOTIFY[r.title] || null;

// Titels in de config die bij geen enkele release horen: vrijwel altijd
// een tikfout, en dan zou die link stilletjes nergens verschijnen.
const titles = new Set(releases.map((r) => r.title));
const orphans = Object.keys(SPOTIFY).filter((t) => !titles.has(t));

/* --- Opruimen: hoezen die bij geen enkele release meer horen ------- */
// De map covers is volledig gegenereerd, dus alles wat niet in de lijst
// staat mag weg (bijvoorbeeld na een uitsluiting in de config).
const inUse = new Set(releases.map((r) => r.cover && r.cover.split('/').pop()).filter(Boolean));
for (const f of readdirSync(COVER_DIR)) {
  if (f.endsWith('.jpg') && !inUse.has(f)) {
    unlinkSync(`${COVER_DIR}/${f}`);
    log.push(['', f, 'opgeruimd (hoort bij geen release meer)']);
  }
}

/* --- 4. site/releases.js schrijven -------------------------------- */
const out = releases.map(({ id, title, artists, type, date, label, cover, link, spotify }) =>
  ({ id, title, artists, type, date, year: Number(date.slice(0, 4)), label, cover, spotify: spotify || null, link }));

writeFileSync('site/releases.js',
`/* ------------------------------------------------------------------ *
 * GEGENEREERD door sync-releases.mjs — niet met de hand aanpassen.
 * Wijzigingen horen in releases.config.mjs; draai daarna het script.
 * Bron: Apple Music, opgehaald ${new Date().toISOString().slice(0, 10)}.
 * ------------------------------------------------------------------ */
const RELEASES = ${JSON.stringify(out, null, 2)};
`);

console.log(`\n${out.length} releases geschreven naar site/releases.js\n`);
for (const [d, t, s] of log) console.log(`  ${d}  ${t.padEnd(42)} ${s}`);
if (missing.length) console.log(`\nNiet gevonden bij Apple (zonder hoes): ${missing.join(', ')}`);

const noSpotify = out.filter((r) => !r.spotify).map((r) => r.title);
console.log(`\nSpotify-link: ${out.length - noSpotify.length}/${out.length}`
  + (noSpotify.length ? ` — zonder (linken naar Apple Music): ${noSpotify.join(', ')}` : ''));
if (orphans.length) console.log(`LET OP: deze titels in de spotify-lijst horen bij geen release (tikfout?): ${orphans.join(', ')}`);
