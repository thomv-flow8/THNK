/* ------------------------------------------------------------------ *
 * THNK — instellingen voor de releaselijst.
 *
 * De releases zelf worden opgehaald bij Apple Music door
 * sync-releases.mjs. Hier stel je alleen in wat daarvan af moet wijken.
 * Na een wijziging:  node sync-releases.mjs
 * ------------------------------------------------------------------ */

export default {

  // Jouw artiesten-ID op Apple Music (uit de link naar je artiestenpagina).
  appleArtistId: '1521870797',

  // Releases die Apple onder jouw naam toont maar niet van jou zijn.
  // Vergelijking op titel, hoofdletters maken niet uit.
  exclude: [
    'Everglow',     // naamgenoot — niet van THNK
    'White Flag',   // naamgenoot — niet van THNK
  ],

  // Remixes en samenwerkingen die op de pagina van een andere artiest staan,
  // en dus niet op je eigen Apple-pagina. 'search' is de zoekterm waarmee
  // de hoes wordt opgezocht; 'year' wordt gebruikt als de zoektocht niets
  // oplevert.
  // (Simulation staat hier bewust niet: dat is track 2 van The System.)
  extra: [
    { title: 'Things We Lost In The Fire (THNK Remix)', artists: 'All Living Things',
      label: 'Songspire Records', type: 'Remix', year: 2019, search: 'Things We Lost In The Fire THNK' },
    { title: 'Greece 2000 (THNK Remix)', artists: 'Three Drives On A Vinyl',
      label: 'Armada Electronic Elements', type: 'Remix', year: 2018, search: 'Greece 2000 THNK Remix' },
    { title: 'Demogorgon', artists: 'Solid Stone & THNK', label: 'Coldharbour Recordings',
      type: 'Single', year: 2017, search: 'Demogorgon Solid Stone THNK' },
    { title: 'Zocalo (THNK Remix)', artists: 'Armin van Buuren, Gabriel & Dresden',
      label: 'Armada Music', type: 'Remix', year: 2016, search: 'Zocalo THNK Remix' },
    { title: 'Anasthasia (THNK Remix)', artists: 'T99', label: 'Armada Music',
      type: 'Remix', year: 2016, date: '2016-11-17', search: 'Anasthasia THNK Remix' },
  ],

  // Spotify-links per release. Een hoes gaat naar Spotify als hij hier
  // staat, anders naar Apple Music. Nieuwe release? Plak de link erbij,
  // met de titel precies zoals hij op de site staat.
  spotify: {
    'The System':                'https://open.spotify.com/album/3w0NUXEse7Od9kH8TyzkwW',
    'Control the Night':         'https://open.spotify.com/album/6z8gv8sQOhneTg8MDkGMdn',
    'Greece 2000 (THNK Remix)':  'https://open.spotify.com/album/6qyENmU73QqkuF3szxjpCu',
    'Shift':                     'https://open.spotify.com/album/1mZjHIQbc5hkL9VK8TzNhI',
    'Macabre':                   'https://open.spotify.com/album/6rn8lOhByldiW3XQt4Mpal',
    'Balance':                   'https://open.spotify.com/album/1RaLX58jgCxUo8QHoezgSP',
    'Release':                   'https://open.spotify.com/album/2wpKo3V1aP8MwOxOm1dSgV',
    'Flip Flops':                'https://open.spotify.com/album/6w8ZQVr94soTwU35C7Zd52',
    'Force':                     'https://open.spotify.com/album/2LSGbPDOncZCNxMrI5Hbeq',
    'Warp':                      'https://open.spotify.com/album/3vCELmoE0z9ximf3IvpfuM',
    'Twenty':                    'https://open.spotify.com/album/1vD8di5djIMdqrJDPVKVbC',
    'Expand':                    'https://open.spotify.com/album/5k4yrmIKnu3sI9HfkCBcjD',
    'Divergent':                 'https://open.spotify.com/album/3ZWrYxIlRFdcE8T0VV3Fma',
    'Anasthasia (THNK Remix)':   'https://open.spotify.com/album/3CcJpHfLUQ2qZNbclEWCNl',
    'Compound':                  'https://open.spotify.com/album/7cvx98JdXZLJdHy2GW5Lom',
    'Rush':                      'https://open.spotify.com/album/5tOB9lB0mOavnjbIu1Ol0M',
    'Twin Soul':                 'https://open.spotify.com/album/42EogqgLgg6w9l1hEHx29P',
    'Into You':                  'https://open.spotify.com/album/5QvGYzkdqzMJnTljPLxeHU',
    'Detroit':                   'https://open.spotify.com/album/1MlLXHr30ixAps94rNMe66',
    'Score':                     'https://open.spotify.com/album/3yZj6eWl3Z0WAcovIM7rgL',
    'Neverland':                 'https://open.spotify.com/album/2sAQzcEON2ptD33AsDucR1',
    'Ten':                       'https://open.spotify.com/album/05mHiU3e9lLx2k1ERVOWtw',
    // Nog zonder Spotify-link (staan op de pagina van een andere artiest):
    // 'Things We Lost In The Fire (THNK Remix)', 'Demogorgon', 'Zocalo (THNK Remix)'
  },
};
