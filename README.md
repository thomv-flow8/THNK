# THNK — website

De website van THNK: techno and progressive, from the Netherlands.
Gewone HTML, CSS en JavaScript, zonder build-stap: de map `site/` is de hele site.

## Bekijken

```bash
node serve.mjs
```

Open daarna http://localhost:5173.

## Inhoud aanpassen

Alle tekst staat in **`site/content.js`**: tagline, cijfers, *Supported by*,
shows (komend en eerder), bio, boekingsadres en socials. Pas het daar aan;
de site past zich vanzelf aan.

## Releases bijwerken

```bash
node sync-releases.mjs
```

Haalt de discografie op bij Apple Music, downloadt de hoezen naar
`site/assets/covers/` en schrijft `site/releases.js`. Uitzonderingen,
extra remixes en Spotify-links staan in `releases.config.mjs`.

## Opbouw

| Bestand | Wat |
| --- | --- |
| `site/index.html` | De homepage |
| `site/music.html` | Alle releases, per jaar |
| `site/content.js` | Alle inhoud |
| `site/app.js` | Bouwt de secties op uit `content.js` en `releases.js` |
| `site/hero.js` | Diepte-effect in de hero en achter Booking |
| `site/styles.css` | Huisstijl; kleuren en maten staan bovenaan als variabelen |

## Nog te doen vóór lancering

- Boekingsadres invullen (`booking@thnk.nl` is een plaatshouder)
- Persfoto's
