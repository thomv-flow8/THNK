/* ------------------------------------------------------------------ *
 * THNK — alle inhoud van de site staat in dit ene bestand.
 * De site is Engelstalig; deze uitleg blijft Nederlands.
 * Pas hier tekst, releases en data aan; de site past zich vanzelf aan.
 * ------------------------------------------------------------------ */

const CONTENT = {

  /* --- Wie je bent ------------------------------------------------ */
  artist: 'THNK',

  // Eén zin bovenaan. Kort houden — dit is je visitekaartje.
  tagline: 'Techno and progressive. From the Netherlands.',

  /* --- Spotify ----------------------------------------------------- */
  // Het ID uit je artiestenlink. De speler haalt zelf je nieuwste werk op,
  // dus die blijft actueel zonder dat je iets hoeft te doen.
  spotifyArtistId: '0HiTed3FPoX0yBdqw1i6GH',

  /* --- Cijfers voor promotors -------------------------------------- */
  // Houd het op "meer dan X", dan blijft het kloppen als het groeit.
  // icon: 'play', 'headphones' of 'disc' — de vormen staan in
  // assets/brand-icons.js. Laat icon weg en er staat alleen tekst.
  stats: [
    { value: '1.3M+', label: 'streams on Rush', icon: 'play' },
    { value: '7,000+', label: 'monthly listeners', icon: 'headphones' },
    // Armada (incl. Electronic Elements en Statement!), Orange Recordings,
    // Songspire, Coldharbour en Phenomena.
    { value: '5', label: 'labels released on', icon: 'disc' },
  ],

  /* --- Supported by ------------------------------------------------ */
  // DJ's die je tracks hebben gedraaid, allemaal na te gaan op
  // 1001Tracklists (185 supports, stand september 2026). De grootste namen
  // vooraan; alleen namen die zelf gewicht hebben, geen opvulling.
  // Waar het vandaan komt:
  //   Armin van Buuren  — A State Of Trance 799, Armin Only Embrace (Compound, Zocalo)
  //   Paul van Dyk      — VONYC Sessions 616, 821, 822, 906, 919, 925
  //   Ferry Corsten     — Corsten's Countdown 490, Club Elite Sessions 500
  //   Richie Hawtin     — Block Festival Israel 2017 (Macabre)
  //   Markus Schulz     — Global DJ Broadcast (o.a. Demogorgon, Control The Night)
  //   Aly & Fila        — Future Sound Of Egypt 522 (Demogorgon)
  //   Cosmic Gate       — Wake Your Mind Radio 138 (Compound)
  //   Gareth Emery      — Electric For Life 102 (Compound)
  //   Sander van Doorn  — Identity 453 (Greece 2000)
  //   Andrew Rayel      — Find Your Harmony 235 (Greece 2000)
  //   Kryder            — Kryteria Radio 144 en 162
  //   Max Graham        — Cycles Radio (o.a. 245, 266, 284, 322)
  //   SOFI TUKKER       — Daily Livestream 2020 (Greece 2000)
  //   Andy Moor         — Moor Music 217 (Greece 2000)
  //   Judge Jules       — Global Warmup 663 (Compound)
  //   Eddie Halliwell   — Fire It Up 388 en 390
  //   Ben Gold          — NYE Circus Montreal 2016, 1001Tracklists Exclusive Mix
  supportedBy: {
    names: [
      'Armin van Buuren', 'Paul van Dyk', 'Ferry Corsten', 'Richie Hawtin',
      'Markus Schulz', 'Aly & Fila', 'Cosmic Gate', 'Gareth Emery',
      'Sander van Doorn', 'Andrew Rayel', 'SOFI TUKKER', 'Andy Moor',
      'Judge Jules', 'Eddie Halliwell', 'Ben Gold', 'Kryder', 'Max Graham',
    ],
    more: '185 supports on 1001Tracklists',
    url: 'https://1001.tl/2dwcn3n',
  },

  /* --- Releases ---------------------------------------------------- */
  // Staan niet meer hier. Ze worden bij Apple Music opgehaald en in
  // releases.js gezet door:  node sync-releases.mjs
  // Uitsluiten of remixes toevoegen doe je in releases.config.mjs.

  /* --- Waar je te beluisteren bent --------------------------------- */
  // Knoppenrij onder je releases. Laat 'url' leeg om een dienst te verbergen.
  platforms: [
    { name: 'Spotify', url: 'https://open.spotify.com/artist/0HiTed3FPoX0yBdqw1i6GH' },
    { name: 'Apple Music', url: 'https://music.apple.com/nl/artist/thnk/1521870797' },
    { name: 'Beatport', url: 'https://www.beatport.com/nl/artist/thnk/518148' },
    { name: 'SoundCloud', url: 'https://soundcloud.com/thomasvinkofficial' },
    { name: 'YouTube', url: '' },
  ],

  /* --- Shows ------------------------------------------------------- */
  // Leeg = de agenda verdwijnt en er komt een boekingsuitnodiging voor in
  // de plaats. Zo staat er nooit een lege lijst.
  // Voorbeeld:
  // { date: '2026-11-14', city: 'Amsterdam', venue: 'Shelter', tickets: 'https://...' },
  dates: [],

  // Eerdere optredens: laten bookers zien waar je al gestaan hebt. Nieuwste
  // bovenaan (dat sorteert de site zelf). 'link' mag naar een tracklist,
  // aftermovie of set.
  // 'set' is de opname op SoundCloud. Er komt dan een blok onder de regel
  // met een play-knop; de speler van SoundCloud wordt pas geladen als
  // iemand erop drukt. Zo blijft de pagina licht en zet SoundCloud geen
  // cookies bij mensen die alleen langs scrollen.
  pastShows: [
    { date: '2018-02-17', event: 'A State Of Trance 850', stage: 'Progressive Stage',
      venue: 'Jaarbeurs', city: 'Utrecht',
      link: 'https://www.1001tracklists.com/tracklist/xyg7k99/thnk-progressive-stage-a-state-of-trance-festival-850-jaarbeurs-utrecht-netherlands-2018-02-17.html',
      set: 'https://soundcloud.com/thomasvinkofficial/thnk-asot850-progressive-stage-17-02-2018',
      setNote: 'Recorded live at the Jaarbeurs' },
  ],

  /* --- Over -------------------------------------------------------- */
  // Engels. Controleer of dit klopt — ik heb het geschreven op basis van
  // wat er publiek op Spotify en Beatport staat.
  bio: [
    'THNK makes techno and progressive built on long lines and a tight kick. '
    + 'His remix of Greece 2000 and the track Rush have drawn well over a '
    + 'million listeners between them.',
    'His work has come out on Armada, Coldharbour Recordings, Songspire, '
    + 'Phenomena and Orange Recordings, alongside artists including Melvin Spix '
    + 'and Solid Stone. In 2018 he played the Progressive Stage at '
    + 'A State Of Trance 850 in Utrecht.',
    'His tracks have been played by Armin van Buuren, Paul van Dyk, Ferry '
    + 'Corsten, Markus Schulz and Richie Hawtin, on shows including A State Of '
    + 'Trance, VONYC Sessions, Global DJ Broadcast and Future Sound Of Egypt.',
    'After a break, he is picking it back up: new music, new shows.',
  ],

  // Persfoto. Laat op null staan zolang je er geen hebt — de sectie werkt
  // dan typografisch, zonder dat het onaf oogt.
  photo: null,   // bijv. 'assets/thnk-press.jpg'

  /* --- Boekingen --------------------------------------------------- */
  booking: {
    email: 'booking@thnk.nl',       // pas dit aan
    note: 'For bookings, remixes and collaborations.',
  },

  /* --- Socials ----------------------------------------------------- */
  socials: [
    { name: 'Instagram', url: 'https://www.instagram.com/thnk_nl/' },
    { name: 'Facebook', url: '' },
    { name: 'TikTok', url: '' },
    { name: 'Spotify', url: 'https://open.spotify.com/artist/0HiTed3FPoX0yBdqw1i6GH' },
    { name: 'Apple Music', url: 'https://music.apple.com/nl/artist/thnk/1521870797' },
    { name: 'Beatport', url: 'https://www.beatport.com/nl/artist/thnk/518148' },
  ],
};
