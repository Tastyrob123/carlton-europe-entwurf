/* Le Bureau (bis 15.10.2026 «Carlton Control»). Das Werkzeug, mit dem das Haus die Website pflegt. Ohne Bibliothek. Vorbild: Studio von Salt & Silver, in Farben und Schrift des Hauses. */
(() => {
'use strict';
window.CE_LAEUFT = true;  // sagt dem Notausgang in index.html, dass das Skript geladen ist
// Eingebettet in Le Bureau (control/index.html, bureau.js, 16.10.2026): ohne Kopf, Rand und Leiste; nur=listen zeigt im Bereich nur die Listen
const EIN = new URLSearchParams(location.search).has('eingebettet'), NUR = new URLSearchParams(location.search).get('nur') || '';
if (EIN) document.documentElement.classList.add('eingebettet');
const melden = () => { if (EIN && window.parent !== window) window.parent.postMessage({ bureau: 'geaendert' }, '*'); };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CE = '<svg class="ce" viewBox="87 0 112 68" aria-hidden="true"><use href="#ce"/></svg>';
const PF = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M4.5 3H11v6.5"/></svg>';
// Zeichen im Strich des Hauses: feine Linien, keine Flächen
const Z = {
  haus: '<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6"/>', seite: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>', stern: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.6l-5.4 3 1.2-6.1L3.3 9.3l6.1-.7z"/>',
  bett: '<path d="M3 18V8M21 18v-7a3 3 0 0 0-3-3H9v6M3 14h18M3 11h6"/>', schluessel: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9m-3 0v3m-3-3v2"/>', geschenk: '<path d="M4 10h16v10H4zM4 10V7h16v3M12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0"/>',
  saal: '<path d="M3 20h18M5 20v-9l7-5 7 5v9M9 20v-5h6v5"/>', glas: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8 20h8"/>', blatt: '<path d="M5 19c0-8 5-13 14-13-1 9-6 13-14 13zM5 19c3-4 6-7 10-9"/>',
  turm: '<path d="M8 21V7l4-4 4 4v14M8 21h8M4 21h16M10 21v-4h4v4M10 11h4"/>', uhr: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>', bild: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m5 17 4.5-4.5 3 3 3-2.5L19 17M15.5 9.5h.01"/>',
  frage: '<circle cx="12" cy="12" r="8.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>', person: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>', glocke: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>',
  menue: '<path d="M4 7h16M4 12h16M4 17h10"/>', sprache: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>', lupe: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
  post: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="m3 8 9 6 9-6"/>', liste: '<path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"/>', zeit: '<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5M12 8v4l3 2"/>', schloss: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  text: '<path d="M5 6h14M12 6v13M8 19h8"/>', karte: '<path d="M4 5h16v14H4zM4 10h16M9 10v9"/>', pfeil: '<path d="M3 11 11 3M4.5 3H11v6.5"/>', preis: '<path d="M12 3v18M7 7.5c0-2 2.5-3 5-3s5 1 5 3-2 3-5 3-5 1-5 3 2.5 3 5 3 5-1 5-3"/>',
  schild: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
};
const ZE = (n, kl = '') => `<svg class="zeichen ${kl}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${Z[n] || Z.haus}</svg>`;
const SYM = {
  links: '<svg viewBox="0 0 14 14"><path d="m9 2-5 5 5 5"/></svg>', rechts: '<svg viewBox="0 0 14 14"><path d="m5 2 5 5-5 5"/></svg>',
  hoch: '<svg viewBox="0 0 14 14"><path d="m2.5 9 4.5-4.5L11.5 9"/></svg>', runter: '<svg viewBox="0 0 14 14"><path d="m2.5 5 4.5 4.5L11.5 5"/></svg>',
  zu: '<svg viewBox="0 0 14 14"><path d="m3 3 8 8M11 3l-8 8"/></svg>', auge: '<svg viewBox="0 0 16 14"><path d="M1 7s2.6-4.5 7-4.5S15 7 15 7s-2.6 4.5-7 4.5S1 7 1 7Z"/><circle cx="8" cy="7" r="1.9"/></svg>',
  augezu: '<svg viewBox="0 0 16 14"><path d="M1 7s2.6-4.5 7-4.5S15 7 15 7s-2.6 4.5-7 4.5S1 7 1 7Z"/><path d="m3 1 10 12"/></svg>',
  bild: '<svg viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="10" rx="2"/><path d="m3 11 3.2-3 2.3 2 2-1.6L13 11"/></svg>',
  korb: '<svg viewBox="0 0 14 14"><path d="M2.5 4h9M5.5 4V2.5h3V4M3.5 4l.6 7.5h5.8L10.5 4"/></svg>',
  rechner: '<svg viewBox="0 0 16 14"><rect x="1.5" y="1.5" width="13" height="8.5" rx="1.4"/><path d="M5.5 12.5h5"/></svg>', handy: '<svg viewBox="0 0 14 16"><rect x="3.5" y="1.5" width="7" height="13" rx="1.6"/></svg>',
};
// Menü in Gruppen wie am Grand Beau-Rivage (Le Bureau, 15.10.2026): ['g', Titel] beginnt eine Gruppe
const NAV = [['uebersicht', 'Übersicht', 'haus'],
  ['g', 'Die Website'], ['start', 'Startseite', 'stern'], ['zimmer', 'Zimmer & Suiten', 'bett'], ['apartments', 'Apartments', 'schluessel'], ['genuss', 'Restaurant & Bar', 'glas'], ['karte', 'Karte & Wein', 'karte'],
  ['saele', 'Tagen & Feiern', 'saal'], ['pakete', 'Packages', 'geschenk'], ['events', 'Veranstaltungen', 'stern'], ['wellness', 'Wellness & Aktiv', 'blatt'], ['aufenthalt', 'Ihr Aufenthalt', 'schluessel'], ['haus', 'Haus & Region', 'turm'], ['jobs', 'Jobs', 'person'],
  ['g', 'Für alle Seiten'], ['seiten', 'Seiten & Texte', 'seite'], ['angaben', 'Angaben & Zeiten', 'uhr'], ['bilder', 'Bilder', 'bild'], ['hinweis', 'Hinweis für Gäste', 'glocke'], ['menue', 'Menü & Seiten', 'menue'], ['sprachen', 'Sprachen', 'sprache'], ['google', 'Google & Co.', 'lupe'],
  ['g', 'Im Betrieb'], ['eingang', 'Eingang', 'post'], ['gefragt', 'Das wurde gefragt', 'frage'], ['zahlen', 'Zahlen', 'liste'], ['anfragen', 'Anfragen beantworten', 'text'],
  ['g', 'Sicher'], ['aenderungen', 'Änderungen', 'liste'], ['verlauf', 'Verlauf', 'zeit'], ['zugang', 'Zugang', 'schloss'], ['kontrolle', 'Kontrolle', 'schild']];
const NAVP = NAV.filter(p => p[0] !== 'g');
const ARTZ = { fakt: 'uhr', text: 'text', karte: 'glas', bild: 'bild', liste: 'liste', hinweis: 'glocke', seite: 'seite', google: 'lupe', sprache: 'sprache' };
// Welche Listen in welchem Bereich stehen
// Welche Listen, Seiten und Angaben in welchem Bereich stehen. Jede Seite der Website gehört zu genau einem Bereich (Prüfung: _qa/studio.js).
const LISTEN = {
  start: { titel: 'Die <em>Startseite.</em>', text: 'Die Auszeichnungen und die Wege unter «Wofür kommen Sie?». Zimmer, Packages und das Kissen-Menü der Startseite pflegen Sie in ihren eigenen Bereichen, jeden anderen Text und jedes Foto per Klick in der Seite.', keys: ['auszeichnung.start', 'anlass'], seite: 'index.html', seiten: ['index.html'] },
  zimmer: { titel: 'Zimmer <em>& Suiten.</em>', text: 'Jede Kategorie mit Text, Ausstattung, Hauptbild und allen Fotos; daraus entstehen die Übersicht und die Seite jeder Kategorie. Die Wünsche steuern die Auswahl «Welches Zimmer passt zu Ihnen?».', keys: ['zimmer'], seite: 'zimmer.html',
    seiten: ['zimmer.html', 'zimmer-classic.html', 'zimmer-superior.html', 'zimmer-signature.html', 'zimmer-aarmuehle.html'], felder: ['zeit.checkin', 'zeit.checkout', 'zeit.roomservice', 'preis.roomservice_getraenke', 'preis.roomservice_speisen', 'preis.bademantel'] },
  apartments: { titel: 'Serviced <em>Apartments.</em>', text: 'Die vier Preisstufen, die Zuordnung der Monate und die Karten zum Hotelservice. Der Preis «ab CHF» auf Startseite und Zimmer-Seite folgt der günstigsten Stufe.', keys: ['apt.preise', 'apt.monate', 'apt.dienste'], seite: 'apartments.html', seiten: ['apartments.html'] },
  genuss: { titel: 'Restaurant <em>& Bar.</em>', text: 'Hotelrestaurant, Kaminbar und «Essen & Trinken»: die Lokale im Haus, das Verzeichnis der Lieferanten, die grossen Zahlen und die Zeiten. Gerichte, Getränke und Weine stehen unter «Karte & Wein».', keys: ['lokale', 'lieferanten.verzeichnis', 'zahlen.essen'], seite: 'restaurant.html',
    seiten: ['essen-trinken.html', 'restaurant.html', 'kaminbar.html'], felder: ['zeit.restaurant_mittag', 'zeit.restaurant_abend', 'zeit.restaurant_wochenende', 'zeit.fruehstueck', 'zeit.fruehstueck_so', 'zeit.roomservice', 'pdf.speisekarte', 'pdf.weinkarte', 'pdf.snackkarte'], mehr: ['karte', 'Karte & Wein', 'Gerichte, Getränke und die Weinkarte mit eigenen Regionen.'] },
  saele: { titel: 'Tagen <em>& Feiern.</em>', text: 'Die Säle mit Fläche, Personenzahl, Bestuhlung und Miete, die Seminarpauschalen, die Hochzeitspackages und die Bankettmenüs (daraus rechnet auch der Anfrage-Rechner). Dazu die Panorama-Dachterrasse.', keys: ['saele', 'seminar', 'hochzeit', 'bankett'], seite: 'tagen-feiern.html',
    seiten: ['tagen-feiern.html', 'dachterrasse.html'], felder: ['pdf.seminarpreise', 'pdf.hochzeit', 'pdf.bankett'] },
  pakete: { titel: 'Packages <em>& Gutscheine.</em>', text: 'Jedes Package steht ausführlich auf «Angebote» und kurz auf der Startseite. Ein neues Package bekommt automatisch einen Platz auf beiden Seiten. Dazu die Beträge des Gutscheins.', keys: ['pakete', 'gutschein'], seite: 'angebote.html', seiten: ['angebote.html'], felder: ['preis.anreise'] },
  events: { titel: 'Feste <em>und Termine.</em>', text: 'Die Feste im Haus mit Bild, Datum und Text, dazu die Termine in der Region. Erster und letzter Tag steuern, was Gäste bei der Auswahl nach Reisedaten sehen.', keys: ['events', 'termine'], seite: 'veranstaltungen.html', seiten: ['veranstaltungen.html'] },
  wellness: { titel: 'Wellness <em>& Aktiv.</em>', text: 'Die Fussbäder auf «Wellness», die Lunchboxen und die Hundespeisekarte auf «Wandern & Bike», dazu die grossen Zahlen und die Zeiten des Wellnessdörfli.', keys: ['wellness.fuss', 'zahlen.wellness', 'aktiv.lunch', 'aktiv.hund'], seite: 'wellness.html',
    seiten: ['wellness.html', 'aktiv.html'], felder: ['zeit.wellness', 'zeit.wellness_dauer', 'preis.wellness', 'preis.wellness_abo', 'preis.lunch'] },
  aufenthalt: { titel: 'Ihr <em>Aufenthalt.</em>', text: 'Alles rund um Anreise, Abreise und den Hund: das Kissen-Menü, die Fragen unter «Gut zu wissen», Zeiten und Preise von Check-in bis Portier.', keys: ['kissen', 'fragen'], seite: 'anreise.html',
    seiten: ['anreise.html', 'abreise.html', 'hunde.html', 'kontakt.html'], felder: ['zeit.rezeption', 'zeit.checkin', 'zeit.checkout', 'preis.late_checkout', 'preis.gepaeck_lager', 'preis.portier', 'preis.hund_erste', 'preis.hund_folge', 'preis.parken_aussen', 'preis.parken_garage', 'lage.bahnhof', 'lage.schiff', 'pdf.hunde', 'pdf.hotelinfo'] },
  haus: { titel: 'Haus <em>& Region.</em>', text: 'Geschichte, Team, Partner, Nachhaltigkeit und die grossen Zahlen auf «Das Haus», dazu «Interlaken & Region» mit Umgebungskarte und Pass-Berater.', keys: ['jahre', 'team', 'partner', 'nachhaltigkeit', 'zahlen.haus'], seite: 'haus.html', seiten: ['haus.html', 'region.html'] },
  jobs: { titel: 'Offene <em>Stellen.</em>', text: 'Offene Stellen und die Karten «Warum bei uns arbeiten?». Bewerbungen kommen per Mail oder, wenn eingeschaltet, in den Eingang.', keys: ['jobs.stellen', 'jobs.warum'], seite: 'jobs.html', seiten: ['jobs.html'] },
  fragen: { titel: 'Gut <em>zu wissen.</em>', text: 'Die Fragen auf «Kontakt & Anreise». Eine Leerzeile in der Antwort beginnt einen neuen Absatz, Mail-Adressen werden von selbst anklickbar.', keys: ['fragen'], seite: 'kontakt.html', seiten: ['kontakt.html'] },
};
const NAVBEREICH = { fragen: 'aufenthalt' };  // ältere Adressen zeigen im Menü auf ihren heutigen Bereich
const WORTE = { zeit: 'Karte', anlass: 'Weg', zimmer: 'Kategorie', 'apt.preise': 'Preisstufe', 'apt.monate': 'Monat', 'apt.dienste': 'Karte', pakete: 'Package', saele: 'Saal', seminar: 'Pauschale', hochzeit: 'Package',
  'wellness.fuss': 'Fussbad', 'aktiv.lunch': 'Lunchbox', 'aktiv.hund': 'Gericht', jahre: 'Station', team: 'Person', partner: 'Haus', nachhaltigkeit: 'Karte', lokale: 'Lokal', lieferanten: 'Betrieb', 'lieferanten.verzeichnis': 'Lieferant', events: 'Fest', termine: 'Termin', 'auszeichnung.start': 'Auszeichnung', fragen: 'Frage', 'jobs.stellen': 'Stelle', 'jobs.warum': 'Karte', kissen: 'Kissen', bankett: 'Menü', gutschein: 'Betrag' };
const FEST = { 'apt.monate': true };  // Listen, in denen nichts dazukommt oder wegfällt
const sicht = $('#sicht');
let ZS = null, W = null, V = null, OFFEN = false, PROBE = false;

// ---------------------------------------------------------------- Verbindung
async function api(was, daten, roh) {
  const o = daten === undefined ? {} : { method: 'POST', headers: roh ? { 'X-Studio': '1' } : { 'X-Studio': '1', 'Content-Type': 'application/json' }, body: roh ? daten : JSON.stringify(daten) };
  let r;
  try { r = await fetch('/control/api/' + was, o); } catch (e) { throw new Error('Keine Verbindung zu Le Bureau. Läuft der Server? Die Prüfung unter «Kontrolle» sagt es.'); }
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && was !== 'status') { tor('an'); throw new Error(j.fehler || 'Bitte anmelden.'); }
  if (!r.ok) throw new Error(j.fehler || (r.status >= 500 ? 'Der Server hat einen Fehler gemeldet (' + r.status + '). Unter «Kontrolle» steht das Protokoll.' : 'Das hat nicht geklappt.'));
  return j;
}
let LAEUFT = false;  // eine Änderung nach der anderen: ein zweiter Klick, während der Server noch baut, wartet statt einen zweiten Bau anzustossen
async function aendern(a) {
  if (LAEUFT) throw new Error('Einen Moment, die letzte Änderung wird noch gespeichert.');
  LAEUFT = true;
  try { ZS = await api('aendern', a); } finally { LAEUFT = false; }
  rand();
  leiste();
  melden();
  return ZS;
}
// Fehler des Skripts selbst: kurz melden, im Browser merken (die Prüfseite zeigt sie) und dem Server ins Protokoll geben
function fehlerMerken(wo, text) {
  if (/Load failed|access control|NetworkError|Failed to fetch|abort/i.test(String(text))) return;  // Netzfehler nie melden: die Meldung selbst scheiterte sonst und meldete sich neu (am Grand Beau-Rivage 5000 Mal in Sekunden, Safari)
  const z = { zeit: new Date().toLocaleString('de-CH'), wo, text: String(text || '').slice(0, 300) };
  try { const l = JSON.parse(localStorage.getItem('ce_fehler') || '[]'); l.push(z); localStorage.setItem('ce_fehler', JSON.stringify(l.slice(-12))); } catch (e) {}
  try { fetch('/control/api/meldung', { method: 'POST', headers: { 'X-Studio': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ wo, text: z.text }) }).catch(() => {}); } catch (e) {}
}
let FEHLER_ZAHL = 0;
addEventListener('error', ev => { if (++FEHLER_ZAHL > 6) return; fehlerMerken('Skript ' + (ev.filename || '').split('/').pop() + ':' + (ev.lineno || ''), ev.message); });
addEventListener('unhandledrejection', ev => { if (++FEHLER_ZAHL > 6) return; const r = ev.reason; fehlerMerken('Versprechen', r && r.message ? r.message : String(r)); if (r && r.message) sag(r.message, true); });
function sag(text, fehler) {
  $$('#meldung div').forEach(x => { if (x.textContent === text) x.remove(); });
  const d = document.createElement('div');
  d.textContent = text;
  if (fehler) d.className = 'f';
  $('#meldung').appendChild(d);
  setTimeout(() => d.remove(), fehler ? 5200 : 2600);
}
const mal = (n, eins, viele) => `${n} ${n === 1 ? eins : viele}`;
function datum(z) {
  const d = new Date(z);
  return isNaN(d) ? '' : d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
}
const bildadr = (k, g = 's') => { const b = ZS && ZS.bilder.find(x => x.key === k); return b && b.adresse && g === 's' ? b.adresse : `/assets/img/${k}-${g}.webp`; };
const bildgross = k => { const b = ZS && ZS.bilder.find(x => x.key === k); return b && b.adresse && !b.adresse.endsWith('-s.webp') ? b.adresse : `/assets/img/${k}-l.webp`; };

// ---------------------------------------------------------------- Tor
function tor(art) {
  const ld = $('#laedt'); if (ld) ld.hidden = true;
  $('#app').hidden = true;
  const t = $('#tor');
  t.hidden = false;
  const neu = art === 'neu';
  t.innerHTML = `<img class="tor__bild" src="/assets/img/hero-f-l.webp" alt="">
  <div class="tor__k">
    <div class="tor__ce">${CE}</div>
    <h1>Carlton <em>Control.</em></h1>
    <p>${neu ? 'Legen Sie ein Passwort fest. Damit kommen nur Sie an die Inhalte der Website.' : 'Hier pflegen Sie die Website: Zimmer, Packages, Karte, Zeiten, Texte und Bilder.'}</p>
    <form autocomplete="off">
      <label class="feld"><span>${neu ? 'Neues Passwort' : 'Passwort'}</span><input type="password" name="p" autocomplete="${neu ? 'new-password' : 'current-password'}" required minlength="${neu ? 10 : 1}" autofocus></label>
      ${neu ? '<label class="feld"><span>Noch einmal</span><input type="password" name="p2" autocomplete="new-password" required></label>' : ''}
      <div class="fehler" role="alert"></div>
      <button class="kn kn--breit" type="submit">${neu ? 'Passwort festlegen' : 'Öffnen'}<i>${PF}</i></button>
    </form>
    ${neu ? '<p class="tor__f">Mindestens 10 Zeichen. Sie können es später unter «Zugang» ändern.</p>' : ''}
    <p class="tor__f"><a class="link" href="/control/pruefung.html">Funktioniert etwas nicht? Zur Prüfung</a></p>
  </div>`;
  const f = $('form', t), fe = $('.fehler', t);
  setTimeout(() => { const i = $('input', f); if (i) i.focus(); }, 60);
  f.addEventListener('submit', async ev => {
    ev.preventDefault();
    fe.textContent = '';
    if (neu && f.p.value !== f.p2.value) { fe.textContent = 'Die beiden Eingaben sind nicht gleich.'; return; }
    try {
      await api(neu ? 'einrichten' : 'anmelden', { passwort: f.p.value });
      t.hidden = true;
      t.innerHTML = '';
      await laden();
    } catch (e) { fe.textContent = e.message; }
  });
}

// ---------------------------------------------------------------- Rahmen
async function laden() {
  ZS = await api('stand');
  const ld = $('#laedt'); if (ld) ld.hidden = true;
  $('#app').hidden = false;
  rand();
  leiste();
  zeige();
}
function rand() {
  const n = ZS.aenderungen.length, [, teil = 'uebersicht', arg] = location.hash.split('/'), datei = teil === 'seite' && arg ? decodeURIComponent(arg) : '';
  const heim = datei && Object.keys(LISTEN).find(k => k !== 'fragen' && (LISTEN[k].seiten || []).includes(datei));  // eine Seite gehört zu ihrem Bereich, sonst zu «Seiten & Texte»
  const an0 = teil === 'seite' ? (heim || 'seiten') : teil, an = NAVBEREICH[an0] || an0;
  const zahl = k => k === 'aenderungen' && n ? `<b>${n}</b>` : k === 'eingang' && ZS.eingang_neu ? `<b>${ZS.eingang_neu}</b>` : k === 'sprachen' && ZS.sprachen_offen_zahl ? `<b class="leise">${ZS.sprachen_offen_zahl}</b>` : '';
  $('#rand').innerHTML = `<nav aria-label="Bereiche">${NAV.map(p => p[0] === 'g' ? `<p class="rand__g">${h(p[1])}</p>` : `<a href="#/${p[0]}" class="${an === p[0] ? 'an' : ''}">${ZE(p[2])}<span>${p[1]}</span>${zahl(p[0])}</a>`).join('')}</nav>
  <div class="rand__fuss"><a href="/control/pruefung.html" target="_blank" rel="noopener">Prüfseite ${PF}</a>${OFFEN || PROBE ? '' : '<button type="button" data-akt="abmelden">Abmelden</button>'}</div>`;
  const nav = NAVP.find(p => p[0] === an), stand = n ? mal(n, 'Änderung', 'Änderungen') + ' im Entwurf' : 'Alles veröffentlicht';
  $('#kopfl').innerHTML = `<a class="kopfl__marke" href="#/uebersicht">${CE}<span><b>Le Bureau</b><small>Website · Carlton-Europe</small></span></a>
    <div class="kopfl__mitte"><b>${h(datei ? ((seiteVon(datei) || {}).name || datei) : nav ? nav[1] : 'Seite')}</b><small>${h(datei && nav ? nav[1] + ' · ' + stand : stand)}</small></div>
    <div class="kopfl__r"><a class="rund rund--hell" href="#/kontrolle" title="Kontrolle" aria-label="Kontrolle">${ZE('schild')}</a><a class="rund rund--hell" href="#/verlauf" title="Frühere Fassungen" aria-label="Frühere Fassungen">${ZE('zeit')}</a>
    <a class="kn kn--klein kn--gold" href="/live/index.html" target="_blank" rel="noopener">Website ansehen<i>${PF}</i></a></div>`;
  const aktiv = $('#rand nav a.an');
  if (aktiv && innerWidth <= 860) aktiv.scrollIntoView({ block: 'nearest', inline: 'center' });
}
// Kopf jeder Ansicht als Bühne (Werkbank-Chat für Robert, 15.10.2026: «mehr Bühne, Hausfoto, Zeichen, edle Typografie mit Auftritt»):
// links Zeile mit dem Zeichen, Titel aus der Maske, Satz, Knöpfe; rechts ein Foto des Hauses, das weich in das Nachtblau übergeht.
const KOPFBILD = { uebersicht: 'haus-tag2', karte: 'keller-flaschen', seiten: 'haus-weit', angaben: 'reception', bilder: 'aare', hinweis: 'haus-nacht', menue: 'halle',
  sprachen: 'land-harder', google: 'pano-winter', eingang: 'empfang', gefragt: 'reception', zahlen: 'herbst-park', anfragen: 'tisch-gedeckt', aenderungen: 'kamin',
  verlauf: 'hist-carlton-sw', zugang: 'fassade-carlton', kontrolle: 'fassade-europe', start: 'haus-tag2', genuss: 'saal-hr', events: 'silvester-saal', aufenthalt: 'dach-apero', haus: 'haus-weit', fragen: 'reception' };
function kopfBild(name) {
  const da = k => k && ZS && ZS.bilder.some(b => b.key === k);
  if (da(KOPFBILD[name])) return KOPFBILD[name];
  const a = LISTEN[name], s0 = a && a.seiten && seiteVon(a.seiten[0]);
  return s0 && da(seitenBild(s0)) ? seitenBild(s0) : (da('haus-tag2') ? 'haus-tag2' : '');
}
function kopf(titel, text, rechts = '') {
  const name = (location.hash.split('/')[1] || 'uebersicht'), nav = NAVP.find(p => p[0] === (NAVBEREICH[name] || name)), bild = kopfBild(name);
  const zeile = LISTEN[name] ? `Bereich · ${nav ? nav[1] : ''}` : name === 'uebersicht' ? 'Le Bureau · Carlton-Europe' : `Le Bureau · ${nav ? nav[1] : ''}`;
  return `<header class="kopfz buehne">${bild ? `<div class="buehne__foto" aria-hidden="true"><img src="${bildadr(bild, 'l')}" onerror="this.onerror=null;this.src='${bildadr(bild)}'" alt=""></div>` : ''}
    <div class="buehne__t"><p class="bzeile">${CE}<span>${h(zeile)}</span></p><h1><span class="bu-z">${titel}</span></h1>${text ? `<p class="buehne__satz">${text}</p>` : ''}${rechts ? `<div class="kopfz__r">${rechts}</div>` : ''}</div></header>`;
}
const SICHTEN = { uebersicht, seiten, seite, karte, angaben, bilder, aenderungen: aenderungenS, verlauf, zugang, hinweis: hinweisS, menue: menueS, google: googleS, eingang: eingangS, gefragt: gefragtS, zahlen: zahlenS, anfragen: anfragenS, sprachen: sprachenS, kontrolle: kontrolleS };
Object.keys(LISTEN).forEach(k => { SICHTEN[k] = () => listenAnsicht(k); });
let hier = location.hash;
function zeige(halte) {
  if (!ZS) return;
  const [, name = 'uebersicht', arg] = location.hash.split('/');
  W = null;
  offen = null;
  hier = location.hash;
  if (halte !== true) sicht.scrollTop = 0;
  const nav = NAVP.find(p => p[0] === (name === 'seite' ? 'seiten' : (NAVBEREICH[name] || name)));
  try {
    (SICHTEN[name] || uebersicht)(arg ? decodeURIComponent(arg) : undefined);
  } catch (e) {
    // Eine Ansicht, die nicht aufgeht, reisst nicht das ganze Werkzeug mit: Grund zeigen, Weg zur Kontrolle, die anderen Bereiche bleiben erreichbar
    fehlerMerken('Ansicht ' + name, e.message);
    sicht.innerHTML = `<div class="in">${kopf('Diese Ansicht lässt sich <em>nicht aufbauen.</em>', 'Le Bureau hat hier einen Fehler gefunden. Die anderen Bereiche bleiben erreichbar; die Kontrolle sagt, woran es liegt.')}
      <section class="blatt" style="max-width:760px"><p class="hinweis"><b>${h(nav ? nav[1] : name)}:</b> ${h(e.message)}</p>
      ${ZS.fehler ? `<p class="hinweis" style="margin-top:12px"><b>Der Entwurf lässt sich gerade nicht bauen:</b> ${h(ZS.fehler)}</p>` : ''}
      <div class="fenster__kn" style="justify-content:flex-start"><a class="kn" href="#/kontrolle">Zur Kontrolle<i>${PF}</i></a><a class="kn kn--linie" href="/control/pruefung.html">Prüfseite öffnen</a><button class="kn kn--linie" type="button" data-akt="neu-laden">Neu laden</button></div></section></div>`;
  }
  document.title = (nav ? nav[1] + ' · ' : '') + 'Le Bureau · Carlton-Europe';
  rand();
  auftritt(halte === true);
}
// Auftritte wie im Markenbuch (Le Livre): beim Öffnen einer Ansicht und beim Scrollen federn Kacheln mit Überschwung herein, Überschriften fahren aus ihrer Maske,
// Blätter und Zeilen steigen auf. Nur opacity, translate und scale (die Neigung der Kacheln über transform bleibt frei). Nach dem Speichern (halte) steht alles sofort.
let AUF = null;
const AUF_SEL = { feder: '.tuer, .bu-bk, .sk, .hk, .lage', flug: '.blatt, .gruppe, .raster > .feld, .wort, .post, .aend', zeile: '.zw, .kopfz .bzeile, .kopfz .buehne__satz, .kopfz__r, .gz' };
function auftritt(sofort) {
  if (AUF) { AUF.disconnect(); AUF = null; }
  const wurzel = $('.in', sicht);
  if (!wurzel || wurzel.closest('.werk') || matchMedia('(prefers-reduced-motion:reduce)').matches || !('IntersectionObserver' in window)) return;
  document.body.classList.add('bu-js');
  const kopf_ = $('.kopfz', wurzel);
  if (kopf_ && !sofort) { kopf_.classList.remove('da'); kopf_.classList.add('bu-kopf'); requestAnimationFrame(() => requestAnimationFrame(() => kopf_.classList.add('da'))); }
  const els = [];
  Object.entries(AUF_SEL).forEach(([art, sel]) => $$(sel, wurzel).forEach(el => { if (el.closest('.kopfz') && art !== 'zeile') return; if (!el.dataset.auf) { el.dataset.auf = art; els.push(el); } }));
  if (sofort) { els.forEach(el => el.classList.add('da')); return; }
  // Fotos sofort holen und entpacken, damit keine Kachel leer hereinkommt (Robert 15.10.2026: «Reihe leer, dann ploppen die Bilder einzeln auf»)
  $$('img', wurzel).forEach(im => { im.loading = 'eager'; if (im.decode) im.decode().catch(() => {}); });
  // Eine Reihe kommt gemeinsam: Kacheln in derselben Zeile ihres Rasters starten zusammen, die nächste Reihe kurz danach; ausgelöst wird je Reihe
  const reihe = new Map();
  els.forEach(el => {
    const top = Math.round(el.offsetTop / 8), key = el.parentNode;
    if (!reihe.has(key)) reihe.set(key, []);
    const zeilen = reihe.get(key); let z = zeilen.find(x => Math.abs(x.top - top) <= 2);
    if (!z) { z = { top, els: [] }; zeilen.push(z); }
    z.els.push(el);
  });
  const ziele = new Map();
  reihe.forEach(zeilen => zeilen.forEach((z, n) => { z.els.forEach(el => el.style.setProperty('--i', z.els.length > 1 ? 0 : Math.min(n, 8))); ziele.set(z.els[0], z.els); }));
  AUF = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; AUF.unobserve(e.target); (ziele.get(e.target) || [e.target]).forEach(el => el.classList.add('da')); }), { root: sicht, rootMargin: '0px 0px -4% 0px', threshold: .02 });
  ziele.forEach((_, el) => AUF.observe(el));
}
addEventListener('hashchange', () => {
  if (offen && offen() && location.hash !== hier) {
    const ziel = location.hash;
    history.replaceState(null, '', hier || '#/uebersicht');
    frage('Noch nicht <em>gespeichert.</em>', 'Sie haben Angaben geändert und noch nicht auf «Speichern» gedrückt. Wenn Sie weitergehen, gehen sie verloren.', 'Ohne Speichern weiter', async () => { offen = null; location.hash = ziel; });
    return;
  }
  if (!ZS) return;
  zeige();
  leiste();
});

// ---------------------------------------------------------------- Entwurfsleiste, Liste, Quittung
const HAKEN = '<svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7"/></svg>';
let letzteZahl = null, BLITZ = null, offen = null;
function vor(z) {
  const m = Math.round((Date.now() - new Date(z)) / 60000);
  return isNaN(m) ? '' : m < 1 ? 'gerade eben' : m < 60 ? `vor ${m} Min.` : m < 1440 ? `vor ${Math.round(m / 60)} Std.` : datum(z);
}
const nachZeit = () => [...ZS.aenderungen].sort((a, b) => (b.zeit || '').localeCompare(a.zeit || ''));
const nachZeitE = l => [...l].sort((a, b) => (b.zeit || '').localeCompare(a.zeit || ''));
function leiste() {
  const el = $('#leiste'), n = ZS.aenderungen.length, neueste = nachZeit()[0], zuletzt = ZS.verlauf.find(v => !v.anfang);
  el.classList.toggle('offen', n > 0);
  el.innerHTML = n ? `<button class="leiste__l" type="button" data-akt="lade" aria-label="Liste der Änderungen zeigen"><i class="leiste__z">${n}</i><span><b>${n === 1 ? 'Änderung' : 'Änderungen'} im Entwurf</b><small>Zuletzt: ${h(neueste.satz)}${neueste.zeit ? ' · ' + vor(neueste.zeit) : ''}</small></span></button>
    <div class="leiste__r"><button class="kn kn--klein kn--linie" type="button" data-akt="lade">Vorher, nachher</button><a class="kn kn--klein kn--linie" href="/entwurf/${W ? encodeURIComponent(W.datei) : 'index.html'}" target="_blank" rel="noopener">Entwurf ansehen</a><button class="kn kn--gold" type="button" data-akt="raus">Veröffentlichen<i>${PF}</i></button></div>`
    : `<div class="leiste__l"><i class="leiste__z ok">${HAKEN}</i><span><b>Alles veröffentlicht</b><small>${zuletzt ? 'Stand vom ' + datum(zuletzt.zeit) : 'Die Website zeigt den neuesten Stand.'}</small></span></div>
    <div class="leiste__r"><a class="kn kn--klein kn--linie" href="/live/index.html" target="_blank" rel="noopener">Website ansehen</a></div>`;
  if (letzteZahl !== null && letzteZahl !== n && n) $('.leiste__z', el).classList.add('hupf');
  letzteZahl = n;
  if (!$('#lade').hidden) lade();
}
function kurzdiff(c) {
  if (c.art === 'bild') return `<span class="mini"><img src="${h(c.vorher)}" alt=""><i>→</i><img src="${h(c.nachher)}" alt=""></span>`;
  if (c.punkte) return c.punkte.slice(0, 4).map(p => `<span class="zl"><b>${h(p.name)}</b> ${h(p.text)}</span>`).join('') + (c.punkte.length > 4 ? `<span class="zl">und ${c.punkte.length - 4} weitere</span>` : '');
  if (c.teile) return c.teile.slice(0, 4).map(t => `<span class="zl">${h(t.feld)}: ${t.vorher ? `<s>${h(t.vorher)}</s> → ` : ''}<b>${h(t.nachher)}</b></span>`).join('');
  return `<span class="zl"><s>${h(c.vorher) || 'leer'}</s> → <b>${h(c.nachher) || 'leer'}</b></span>`;
}
function lade() {
  const l = $('#lade'), cs = nachZeit();
  l.hidden = false;
  l.innerHTML = `<div class="lade__k" role="dialog" aria-label="Ihr Entwurf"><header><div><h2>Ihr <em>Entwurf.</em></h2><p>${cs.length ? 'Gespeichert, aber noch nicht auf der Website. Erst «Veröffentlichen» macht es für Gäste sichtbar.' : 'Nichts offen. Alles steht auf der Website.'}</p></div>
      <button class="rund" type="button" data-akt="ladezu" aria-label="Schliessen">${SYM.zu}</button></header>
    <ol class="lade__l">${cs.map(c => `<li data-id="${h(c.id)}"><span class="lade__z">${ZE(ARTZ[c.art] || 'liste')}</span><div><b>${h(c.titel)}</b><small>${h(c.ort || '')}${c.zeit ? ' · ' + vor(c.zeit) : ''}</small><p>${kurzdiff(c)}</p>
      <div class="lade__a">${c.stellen.length ? '<button class="link" type="button" data-akt="sehen">Auf der Seite ansehen</button>' : ''}<button class="link" type="button" data-akt="weg">Zurücknehmen</button></div></div></li>`).join('')}</ol>
    ${cs.length ? `<footer><button class="link" type="button" data-akt="alles">Alles zurücknehmen</button><button class="kn kn--hell" type="button" data-akt="raus">Veröffentlichen<i>${PF}</i></button></footer>` : ''}</div>`;
}
function ladeZu() { const l = $('#lade'); l.hidden = true; l.innerHTML = ''; }
async function aktAenderung(akt, id, seite) {
  const c = ZS.aenderungen.find(x => x.id === id), n = ZS.aenderungen.length;
  try {
    if (akt === 'sehen' && c) { ladeZu(); vergleich(c, seite); }
    else if (akt === 'weg' && c) { await aendern({ art: 'verwerfen', id: c.id }); sag('Zurückgenommen: ' + c.titel); neuZeichnen(); }
    else if (akt === 'alles') frage('Alles <em>zurücknehmen?</em>', `${mal(n, 'Änderung geht', 'Änderungen gehen')} verloren. Die Website bleibt, wie sie ist.`, 'Alles zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'alles' }); sag('Der Entwurf ist leer.'); neuZeichnen(); });
    else if (akt === 'raus') { ladeZu(); veroeffentlichen(); }
  } catch (e) { sag(e.message, true); }
}
function quittung(titel, text, o = {}) {
  const m = $('#meldung');
  $$('.quitt', m).forEach(x => x.remove());
  const d = document.createElement('div'), c = o.id && ZS.aenderungen.find(x => x.id === o.id);
  d.className = 'quitt';
  d.setAttribute('role', 'status');
  d.innerHTML = `<i>${HAKEN}</i><div><b>${h(titel)}</b>${text ? `<span>${h(text)}</span>` : ''}<small>Im Entwurf gespeichert. Auf der Website erst nach dem Veröffentlichen.</small>
    <div class="quitt__a">${c && c.stellen.length ? '<button type="button" data-q="sehen">Vorher/Nachher ansehen</button>' : ''}${o.zurueck ? '<button type="button" data-q="zurueck">Rückgängig</button>' : ''}</div></div>
    <button class="quitt__zu" type="button" data-q="zu" aria-label="Schliessen">${SYM.zu}</button>`;
  d.addEventListener('click', async ev => {
    const b = ev.target.closest('[data-q]');
    if (!b) return;
    d.remove();
    if (b.dataset.q === 'sehen') { const x = ZS.aenderungen.find(y => y.id === o.id); if (x) vergleich(x, o.seite); }
    if (b.dataset.q === 'zurueck') { try { await aendern(o.zurueck); sag('Rückgängig gemacht.'); neuZeichnen(); } catch (e) { sag(e.message, true); } }
  });
  m.appendChild(d);
  setTimeout(() => d.remove(), 10000);
}
async function tun(a, q) {
  try { await aendern(a); if (q) quittung(q.titel, q.text, q); return true; } catch (e) { sag(e.message, true); return false; }
}
function neuZeichnen() {
  if (W) return neuLaden({});
  const y = sicht.scrollTop;
  zeige(true);
  sicht.scrollTop = y;
}
const chipsH = (name, opt, wert, mehrfach) => `<div class="chips" data-chips="${name}"${mehrfach ? ' data-mehrfach' : ''}>${opt.map(([v, t]) => `<button type="button" data-v="${h(v)}" class="${(mehrfach ? (wert || []).map(String).includes(String(v)) : String(v) === String(wert)) ? 'an' : ''}">${h(t)}</button>`).join('')}</div>`;
const schalter = (id, an, text) => `<label class="schalter"><input type="checkbox" id="${id}"${an ? ' checked' : ''}><i></i><span>${text}</span></label>`;
document.addEventListener('click', ev => {
  const c = ev.target.closest('.chips button');
  if (!c) return;
  const p = c.parentNode;
  if (p.hasAttribute('data-mehrfach')) c.classList.toggle('an'); else $$('button', p).forEach(x => x.classList.toggle('an', x === c));
  p.dispatchEvent(new CustomEvent('wahl', { bubbles: true, detail: { name: p.dataset.chips, wert: p.hasAttribute('data-mehrfach') ? $$('button.an', p).map(x => x.dataset.v) : c.dataset.v } }));
});

// ---------------------------------------------------------------- Übersicht
function uebersicht() {
  const n = ZS.aenderungen.length, st = new Date().getHours(), cs = nachZeit();
  const MINI = { pakete: 'herbst-park', zimmer: 'z-classic', angaben: 'reception', gericht: 'g-roesti', seiten: 'haus-tag2', bilder: 'aare', saele: 's-festsaal', hinweis: 'haus-nacht', sprachen: 'ort-1' };
  const mini = akt => { const k = MINI[akt]; return k && ZS.bilder.some(b => b.key === k) ? `<img class="tuer__m" src="${bildadr(k)}" alt="" loading="lazy">` : ''; };
  const tuer = (akt, z, titel, text) => `<button class="tuer" type="button" data-los="${akt}">${mini(akt) || ZE(z)}<b>${titel}</b><span>${text}</span><i>${PF}</i></button>`;
  // Ohne gebauten Entwurf (Baufehler) fehlen Angaben, Listen und Karte: die Übersicht steht trotzdem, mit dem Weg zur Kontrolle
  const f = ZS.felder || {}, wert = p => h((f[p] || {}).wert || '–');
  const pakete = (ZS.listen && ZS.listen.pakete && ZS.listen.pakete.liste) || [], karteG = (ZS.karte && ZS.karte.gerichte && ZS.karte.gerichte.liste) || [], karteT = (ZS.karte && ZS.karte.getraenke && ZS.karte.getraenke.liste) || [];
  const bildOder = (k, sonst) => (ZS.bilder.some(b => b.key === k) ? bildadr(k) : (ZS.bilder[0] ? ZS.bilder[0].adresse : sonst));
  const ganz = ZS.seiten.length && Object.keys(f).length && ZS.listen && ZS.listen.pakete;
  sicht.innerHTML = `<div class="in">${kopf(st < 11 ? 'Guten <em>Morgen.</em>' : st < 18 ? 'Guten <em>Tag.</em>' : 'Guten <em>Abend.</em>', 'Suchen Sie sich aus, was Sie tun möchten. Alles wird zuerst im Entwurf gespeichert. Unten sehen Sie jederzeit, was offen ist, und stellen es mit einem Knopf auf die Website.')}
  ${ZS.fehler || !ganz ? `<section class="blatt" style="margin-bottom:22px"><p class="hinweis"><b>${ZS.fehler ? 'Der Entwurf lässt sich gerade nicht bauen.' : 'Der Entwurf ist noch nicht gebaut.'}</b> ${h(ZS.fehler || 'Angaben, Listen und Karte fehlen deshalb vorerst.')} Die Website selbst ist davon nicht betroffen.</p>
    <div class="fenster__kn" style="justify-content:flex-start;margin-top:14px"><a class="kn" href="#/kontrolle">Zur Kontrolle<i>${PF}</i></a><a class="kn kn--linie" href="/control/pruefung.html" target="_blank" rel="noopener">Prüfseite in neuem Fenster</a></div></section>` : ''}
  <h2 class="zw" style="margin-top:0">Was möchten Sie tun?</h2>
  <div class="raster r-3">
    ${tuer('pakete', 'geschenk', 'Package ändern oder anlegen', 'Preis, Zeitraum, Text und Bild. Steht auf «Angebote» und im Band der Startseite.')}
    ${tuer('zimmer', 'bett', 'Zimmer beschreiben', 'Text, Ausstattung und Fotos je Kategorie, dazu die Wünsche für die Auswahl.')}
    ${tuer('angaben', 'uhr', 'Zeiten und Preise ändern', 'Rezeption, Check-in, Frühstück, Wellness, Parken, Hund. Einmal ändern, überall richtig.')}
    ${tuer('gericht', 'glas', 'Gericht oder Wein auf die Karte', 'Neues Gericht, Getränk oder Wein anlegen, Preise ändern.')}
    ${tuer('seiten', 'text', 'Text oder Überschrift ändern', 'Seite öffnen, auf den Text klicken, schreiben.')}
    ${tuer('bilder', 'bild', 'Bild tauschen', 'Ein Foto ersetzen, überall wo es zu sehen ist.')}
    ${tuer('saele', 'saal', 'Saal oder Pauschale anpassen', 'Personenzahl, Bestuhlung, Miete, Seminarpauschalen, Hochzeitspackages.')}
    ${tuer('hinweis', 'glocke', 'Hinweis für Gäste', 'Betriebsferien, Umbau oder Feiertage oben auf jeder Seite.')}
    ${tuer('sprachen', 'sprache', 'Übersetzen', `Englisch und Französisch für geänderte Texte.${ZS.sprachen_offen_zahl ? `<br><b>${mal(ZS.sprachen_offen_zahl, 'Stück wartet', 'Stücke warten')}</b>` : ''}`)}
  </div>
  ${ganz ? `<h2 class="zw">Die Website, <em>Bereich für Bereich</em></h2><div class="bu-bereiche">${NAVP.filter(p => LISTEN[p[0]] || p[0] === 'karte').map((p, i) => {
    const a = LISTEN[p[0]] || { seiten: ['essen-trinken.html'], keys: [] }, s0 = seiteVon((a.seiten || [])[0]) || {}, foto = { start: 'haus-tag2', karte: 'keller-flaschen', genuss: 'saal-hr', haus: 'haus-weit', aufenthalt: 'reception', events: 'silvester-saal' }[p[0]] || s0.bild;
    const listen = a.keys.filter(k => ZS.listen[k]).length, offen_ = ZS.aenderungen.filter(c => (a.seiten || []).some(d => (c.ort || '').includes((seiteVon(d) || {}).name || '§'))).length;
    return `<a class="bu-bk" href="#/${p[0]}" style="--i:${i}"><span class="bu-bk__b">${foto && ZS.bilder.some(b => b.key === foto) ? `<img src="${bildadr(foto)}" alt="" loading="lazy" decoding="async">` : ''}</span>${offen_ ? `<span class="bu-bk__o">${offen_} offen</span>` : ''}<span class="bu-bk__n"><b>${h(p[1])}</b><small>${p[0] === 'karte' ? 'Gerichte, Getränke, Weine' : mal((a.seiten || []).length, 'Seite', 'Seiten') + (listen ? ' · ' + mal(listen, 'Liste', 'Listen') : '')}</small><i>${PF}</i></span></a>`; }).join('')}</div>` : ''}
  ${ZS.eingang_neu ? `<a class="lage" href="#/eingang" style="margin-top:28px;display:flex"><div><h2>${ZS.eingang_neu === 1 ? 'Ein neuer Eintrag <em>im Eingang.</em>' : `${ZS.eingang_neu} neue Einträge <em>im Eingang.</em>`}</h2><p>${h(nachZeitE(ZS.eingang).filter(x => !x.gelesen).slice(0, 3).map(x => (ZS.formulare[x.formular] || x.formular) + (x.felder.Name ? ' von ' + x.felder.Name : '')).join(' · '))}</p></div><span class="kn kn--hell">Zum Eingang<i>${PF}</i></span></a>` : ''}
  ${n ? `<h2 class="zw">Im Entwurf<span>${String(n).padStart(2, '0')}</span></h2><section class="blatt offenes">${cs.slice(0, 4).map(c => `<div class="offenes__z" data-id="${h(c.id)}"><span class="lade__z">${ZE(ARTZ[c.art] || 'liste')}</span><div><b>${h(c.satz)}</b><small>${h(c.ort || '')}${c.zeit ? ' · ' + vor(c.zeit) : ''}</small></div>
      ${c.stellen.length ? '<button class="kn kn--klein kn--linie" type="button" data-akt="sehen">Ansehen</button>' : ''}</div>`).join('')}
      <div class="offenes__f"><button class="link" type="button" data-akt="lade">${n > 4 ? `Alle ${n} zeigen` : 'Liste öffnen'}</button><button class="kn kn--klein" type="button" data-akt="raus">Veröffentlichen<i>${PF}</i></button></div></section>` : ''}
  ${ganz ? `<h2 class="zw">So steht es auf der Seite</h2>
  <div class="raster r-3">
    <a class="hk" href="#/angaben"><span class="hk__b"><img src="${bildOder('reception', '')}" alt="" loading="lazy"></span><span class="hk__t"><b>Rezeption ${wert('zeit.rezeption')}</b><span>Check-in ${wert('zeit.checkin')} · Check-out ${wert('zeit.checkout')} · Frühstück ${wert('zeit.fruehstueck')}</span><i>Zeiten ändern</i></span></a>
    <a class="hk" href="#/pakete"><span class="hk__b"><img src="${(pakete[0] || {}).bild ? bildadr(pakete[0].bild) : bildOder('herbst-park', '')}" alt="" loading="lazy"></span><span class="hk__t"><b>${mal(pakete.length, 'Package', 'Packages')}</b><span>${h(pakete.map(p => p.name).join(' · '))}</span><i>Packages pflegen</i></span></a>
    <a class="hk" href="#/karte"><span class="hk__b"><img src="${bildOder('saal-hr-kamin', '')}" alt="" loading="lazy"></span><span class="hk__t"><b>Karte & Wein</b><span>${mal(karteG.filter(x => !x.aus).length, 'Gericht', 'Gerichte')} · ${mal(karteT.filter(x => !x.aus).length, 'Getränk', 'Getränke')} · ${mal(Object.entries(ZS.karte || {}).filter(([k]) => k.startsWith('w')).reduce((a, [, g]) => a + (g.liste || []).filter(x => !x.aus).length, 0), 'Wein', 'Weine')}</span><i>Karte öffnen</i></span></a>
  </div>` : ''}</div>`;
  kippen(sicht);
  sicht.querySelector('.in').addEventListener('click', ev => {
    const t = ev.target.closest('[data-los]'), s = ev.target.closest('[data-akt="sehen"]');
    if (s) return aktAenderung('sehen', s.closest('[data-id]').dataset.id);
    if (!t) return;
    const los = t.dataset.los;
    if (los === 'gericht') gerichtFenster({});
    else location.hash = '#/' + los;
  });
}

// 3D: Kacheln neigen sich zur Maus (nur bei echter Maus und ohne «weniger Bewegung»), Licht wandert mit
function kippen(wurzel) {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  $$('.tuer, .bu-bk', wurzel).forEach(k => {
    k.addEventListener('pointermove', ev => { const r = k.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      k.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg'); k.style.setProperty('--ry', (x * 11).toFixed(2) + 'deg'); });
    k.addEventListener('pointerleave', () => { ['--rx', '--ry'].forEach(v => k.style.removeProperty(v)); });
  });
}
// ---------------------------------------------------------------- Seiten
function seiten() {
  const gruppen = [...new Set(ZS.seiten.map(s => s.gruppe))];
  sicht.innerHTML = `<div class="in">${kopf('Seiten <em>& Texte.</em>', 'Suchen Sie sich eine Seite aus. Sie öffnet sich so, wie Gäste sie sehen. Ein Klick auf einen Text, ein Bild oder eine Angabe, und Sie können es ändern.')}
  ${gruppen.map(g => `<h2 class="zw">${g}<span>${String(ZS.seiten.filter(s => s.gruppe === g).length).padStart(2, '0')}</span></h2><div class="raster r-4">${ZS.seiten.filter(s => s.gruppe === g).map(s =>
    `<a class="sk" href="#/seite/${encodeURIComponent(s.datei)}"><span class="sk__b">${s.bild ? `<img src="${bildadr(seitenBild(s))}" alt="" loading="lazy">` : ''}</span><span class="sk__t"><b>${h(s.name)}</b><span>${mal(s.texte, 'Text', 'Texte')} · ${mal(s.bilder, 'Bild', 'Bilder')}</span></span></a>`).join('')}</div>`).join('')}</div>`;
}

// ---------------------------------------------------------------- Seite bearbeiten
const RSTIL = `.vorhang{display:none!important}
.studio-hov,.studio-an{position:absolute;z-index:2147483000;pointer-events:none;border-radius:5px;display:none;box-sizing:border-box}
.studio-hov{outline:calc(1.5px*var(--studio-k,1)) dashed #dcc68f;outline-offset:calc(4px*var(--studio-k,1))}
.studio-hov::before{content:attr(data-w);position:absolute;left:-4px;bottom:calc(100% + 9px*var(--studio-k,1));background:#dcc68f;color:#0c1526;font:500 10px/1 'DM Mono',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;padding:6px 8px;border-radius:5px;white-space:nowrap;transform:scale(var(--studio-k,1));transform-origin:0 100%}
.studio-hov[data-w=""]::before{display:none}
.studio-an{outline:calc(2px*var(--studio-k,1)) solid #dcc68f;outline-offset:calc(4px*var(--studio-k,1));background:rgba(220,198,143,.12)}
.studio-werk [data-e]{cursor:text}.studio-werk img[data-b]{cursor:pointer;pointer-events:auto!important}`;
function richte(d, werk) {
  if (!d.getElementById('studio-stil')) {
    const s = d.createElement('style');
    s.id = 'studio-stil';
    s.textContent = RSTIL;
    d.head.appendChild(s);
  }
  if (werk) d.documentElement.classList.add('studio-werk');
  const k = c => { const b = d.createElement('div'); b.className = c; d.body.appendChild(b); return b; };
  return { hov: k('studio-hov'), an: k('studio-an') };
}
function rahme(box, el, wort) {
  if (!box) return;
  const r = el && el.isConnected ? el.getBoundingClientRect() : null;
  if (!r || (!r.width && !r.height)) { box.style.display = 'none'; return false; }
  const d = el.ownerDocument, w = d.defaultView, wirt = el.closest('dialog') || d.body;
  if (box.parentNode !== wirt) wirt.appendChild(box);
  let x = r.left + w.scrollX, y = r.top + w.scrollY;
  if (wirt !== d.body) { const wr = wirt.getBoundingClientRect(); x = r.left - wr.left + wirt.scrollLeft - wirt.clientLeft; y = r.top - wr.top + wirt.scrollTop - wirt.clientTop; }
  Object.assign(box.style, { display: 'block', left: x + 'px', top: y + 'px', width: r.width + 'px', height: r.height + 'px' });
  box.dataset.w = wort || '';
  return true;
}
function passe(fr, wirt, soll) {
  const tu = () => {
    if (wirt.classList.contains('handy')) { fr.style.cssText = ''; try { fr.contentDocument.documentElement.style.setProperty('--studio-k', '1'); } catch (e) {} return; }
    const w = wirt.clientWidth, hoch = wirt.clientHeight;
    if (!w) return;
    const k = Math.min(1, w / soll);
    fr.style.cssText = `position:absolute;left:0;top:0;width:${k < 1 ? soll : w}px;height:${hoch / k}px;transform-origin:0 0;transform:${k < 1 ? `scale(${k})` : 'none'}`;
    try { fr.contentDocument.documentElement.style.setProperty('--studio-k', (1 / k).toFixed(3)); } catch (e) {}
  };
  fr.addEventListener('load', tu);
  new ResizeObserver(tu).observe(wirt);
  tu();
  return tu;
}
function zeig(el) {
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p.hasAttribute('data-feld') && p.hidden) {  // Zeit-Karten, Reiter, Säle: das Feld zeigen, die Geschwister ausblenden
      [...p.parentElement.children].forEach(c => { if (c.hasAttribute('data-feld')) c.hidden = c !== p; });
    } else if (p.hasAttribute('data-saal') && p.hidden) {
      [...p.parentElement.children].forEach(c => { if (c.hasAttribute('data-saal')) c.hidden = c !== p; });
    } else if (p.hidden) p.hidden = false;
    if (p.tagName === 'DIALOG' && !p.open) { try { p.showModal(); } catch (e) { p.setAttribute('open', ''); } }
    if (p.tagName === 'DETAILS') p.open = true;
  }
}
function ziel(d, x, y) {
  const els = d.elementsFromPoint(x, y).filter(e => !/^studio-/.test(e.className));
  if (!els.length) return null;
  let t = els[0].closest('[data-e]') || els.slice(0, 5).find(e => e.matches('[data-e]'));
  const b = els.find(e => e.matches('img[data-b]'));
  if (!t && b) {
    const karte = b.closest('.gk');
    const name = karte && karte.querySelector('[data-q^="k:"]');
    if (name) t = name; else return { art: 'bild', el: b, wort: 'Bild tauschen' };
  }
  if (!t) return null;
  return zielVon(t);
}
function zielVon(el) {
  const q = (el.dataset.q || '').split(' ').filter(Boolean), rein = el.hasAttribute('data-rein');
  if (rein && q[0].startsWith('k:')) return { art: 'gericht', el, q, wort: 'Auf der Karte ändern' };
  if (rein && q[0].startsWith('l:')) return { art: 'liste', el, q, wort: 'Eintrag bearbeiten' };
  if (rein && q[0].startsWith('seite:')) return { art: 'eigene', el, q, wort: 'Seite bearbeiten' };
  if (rein && q[0].startsWith('hinweis.')) return { art: 'hinweis', el, q, wort: 'Hinweis bearbeiten' };
  if (rein) return { art: 'angabe', el, q, wort: 'Angabe ändern' };
  return { art: 'text', el, q, wort: 'Text ändern' };
}
function seite(datei) {
  const s = ZS.seiten.find(x => x.datei === datei) || ZS.seiten[0];
  const gruppen = [...new Set(ZS.seiten.map(x => x.gruppe))];
  sicht.innerHTML = `<div class="werk">
    <div class="werk__leiste">
      <a class="rund" href="#/seiten" title="Zurück zu den Seiten" aria-label="Zurück zu den Seiten">${SYM.links}</a>
      <select id="w-seite" aria-label="Seite">${gruppen.map(g => `<optgroup label="${g}">${ZS.seiten.filter(x => x.gruppe === g).map(x => `<option value="${h(x.datei)}"${x.datei === s.datei ? ' selected' : ''}>${h(x.name)}</option>`).join('')}</optgroup>`).join('')}</select>
      <button class="rund an" type="button" data-akt="geraet" data-g="rechner" title="Wie am Rechner" aria-label="Wie am Rechner">${SYM.rechner}</button>
      <button class="rund" type="button" data-akt="geraet" data-g="handy" title="Wie am Handy" aria-label="Wie am Handy">${SYM.handy}</button>
      <span class="werk__hin"><b>So ändern Sie etwas:</b> Klicken Sie direkt in der Seite auf einen Text, ein Foto oder eine Angabe. Rechts erscheint das Feld, mit «Übernehmen» bestätigen Sie.</span>
    </div>
    <div class="werk__buehne" id="w-buehne"><iframe id="w-rahmen" title="${h(s.name)}" src="/entwurf/${encodeURIComponent(s.datei)}?nomotion"></iframe></div>
    <aside class="pruef" id="w-pruef" aria-live="polite"></aside>
  </div>`;
  W = { datei: s.datei, fr: $('#w-rahmen'), sel: null, y: 0, wieder: null };
  W.passe = passe(W.fr, $('#w-buehne'), 1200);
  W.fr.addEventListener('load', werkBereit);
  $('#w-seite').addEventListener('change', ev => { location.hash = '#/seite/' + encodeURIComponent(ev.target.value); });
  pruefLeer();
}
function werkBereit() {
  if (!W) return;
  const d = W.fr.contentDocument;
  if (!d || !d.body) return;
  const w = d.defaultView;
  Object.assign(W, richte(d, true), { sel: null });
  d.addEventListener('mousemove', ev => { const t = ziel(d, ev.clientX, ev.clientY); rahme(W.hov, t && (!W.sel || t.el !== W.sel.el) ? t.el : null, t && t.wort); }, true);
  d.documentElement.addEventListener('mouseleave', () => W && rahme(W.hov, null));
  d.addEventListener('click', ev => {
    if (ev.target.closest && ev.target.closest('a[href]')) ev.preventDefault();
    const t = ziel(d, ev.clientX, ev.clientY);
    if (t) waehle(t);
  }, true);
  d.addEventListener('submit', ev => ev.preventDefault(), true);
  const nach = () => { if (W && W.sel) rahme(W.an, W.sel.el); };
  w.addEventListener('scroll', nach, { passive: true, capture: true });
  w.addEventListener('resize', nach);
  if (W.wieder) {
    const m = W.wieder, el = m.q ? d.querySelector(`[data-q="${m.q}"]`) : m.b ? d.querySelector(`img[data-b="${m.b}"][data-bn="${m.n}"]`) : d.querySelector(`[data-e="${m.e}"][data-en="${m.n}"]`);
    W.wieder = null;
    if (el) {
      zeig(el);
      el.scrollIntoView({ block: 'center', inline: 'center' });
      setTimeout(() => { if (W && el.isConnected) waehle(el.matches('img') ? { art: 'bild', el } : zielVon(el)); }, 150);
      return;
    }
    w.scrollTo(0, W.y);
  }
  pruefLeer();
}
function neuLaden(merk) {
  if (!W) return;
  const w = W.fr.contentWindow;
  W.y = w.scrollY;
  W.wieder = merk || {};
  w.location.reload();
}
function pruefLeer() {
  if (!W) return;
  W.sel = null;
  rahme(W.an, null);
  const hier = ZS.aenderungen.filter(c => c.stellen.some(x => x.seite === W.datei));
  $('#w-pruef').innerHTML = `<div class="pruef__leer">${CE}<b>Klicken Sie in die Seite.</b><p>Fahren Sie mit der Maus über die Seite links: alles, was sich golden umrandet, können Sie anklicken und ändern.</p>
    <ul><li><b>Text</b>Überschriften, Absätze, Knöpfe</li><li><b>Bild</b>Foto tauschen</li><li><b>Angabe</b>Zeiten, Preise, Zimmer, Packages, Karte</li></ul></div>
    ${hier.length ? `<div class="pruef__offen"><h3>Auf dieser Seite im Entwurf</h3>${hier.slice(0, 6).map(c => `<button type="button" data-id="${h(c.id)}"><b>${h(c.satz)}</b><small>Vorher/Nachher ansehen</small></button>`).join('')}</div>` : ''}`;
  $$('.pruef__offen button').forEach(b => b.addEventListener('click', () => aktAenderung('sehen', b.dataset.id, W.datei)));
}
function waehle(t) {
  if (W.sel && W.sel.orig !== undefined && W.sel.el.isConnected && !W.sel.fertig) spiegel(W.sel, W.sel.orig);
  W.sel = t;
  rahme(W.hov, null);
  rahme(W.an, t.el);
  ({ text: pruefText, angabe: pruefAngabe, gericht: pruefGericht, bild: pruefBild,
     liste: t => { const [, key, i] = t.q[0].split(':'); pruefLeer(); listeFenster(key, +i); },
     eigene: t => { pruefLeer(); seiteFenster(t.q[0].split(':')[1]); }, hinweis: () => { location.hash = '#/hinweis'; } })[t.art](t);
}
const woSteht = (n, s) => n > 1 ? `Steht an <b>${n} Stellen</b>${s > 1 ? ` auf <b>${s} Seiten</b>` : ''}.` : '';
function spiegel(t, html) {
  const d = t.el.ownerDocument, alle = t.ueberall ? $$(`[data-e="${t.el.dataset.e}"]:not([data-rein])`, d) : [t.el];
  alle.forEach(e => { e.innerHTML = html; });
  $$(`[data-spiegel] [data-e="${t.el.dataset.e}"][data-en="${t.el.dataset.en}"]`, d).forEach(e => { e.innerHTML = html; });  // unsichtbare Kopien (Schatten, Laufband) folgen sofort mit
  rahme(W.an, t.el);
}
function rein(html) {
  return html.replace(/<div[^>]*>|<p[^>]*>/gi, '<br>').replace(/<\/(div|p)>/gi, '').replace(/\r?\n/g, '<br>').replace(/^(<br>)+/, '').replace(/&nbsp;/g, ' ');
}
function pruefText(t) {
  const el = t.el, hs = el.dataset.e, n = +el.dataset.en, lauf = el.hasAttribute('data-lauf'), m = ZS.mehrfach[hs];
  const tag = el.closest('h1,h2,h3,h4,.d1,.d2,.d3') ? 'Überschrift' : el.closest('a,button') ? 'Knopf oder Link' : 'Text';
  const link = el.closest('a[href]'), intern = link && /^[\w\-]+\.html/.test(link.getAttribute('href') || '') ? link.getAttribute('href').split('#')[0] : null;
  t.orig = el.innerHTML;
  t.ueberall = !!m;
  const angaben = t.q.filter(q => !q.startsWith('k:') && !q.startsWith('l:')).map(q => ZS.felder[q]).filter(Boolean);
  $('#w-pruef').innerHTML = `<h2>${tag}</h2>
    <div class="schreib" id="w-schreib" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true" aria-label="${tag}"></div>
    ${m ? `<div><div class="wahl2" role="group" aria-label="Wo ändern"><button type="button" class="an" data-wo="1">Überall</button><button type="button" data-wo="0">Nur an dieser Stelle</button></div>
      <p class="hinweis" style="margin-top:10px" id="w-wo">${woSteht(m[0], m[1])} Sie ändern alle auf einmal.</p></div>` : ''}
    ${angaben.length ? `<p class="hinweis">In diesem Satz steht eine Angabe, die an vielen Stellen gleich ist: <b>${angaben.map(a => h(a.label)).join(', ')}</b>. Ändern Sie sie besser unter «Angaben & Zeiten». Schreiben Sie den Satz hier um, folgt er ihr nicht mehr von selbst.</p>` : ''}
    <p class="hinweis leise2">Englisch und Französisch: Ein geänderter Text steht dort zuerst auf Deutsch. Unter «Sprachen» tragen Sie die Übersetzung ein.</p>
    <div class="pruef__kn"><button class="kn kn--breit" type="button" id="w-ok">Übernehmen<i>${PF}</i></button>
      <button class="link" type="button" id="w-ab" style="justify-self:center">Abbrechen</button>
      ${el.hasAttribute('data-neu') ? '<button class="link" type="button" id="w-ur" style="justify-self:center">Ursprünglichen Text zurückholen</button>' : ''}
      ${intern && ZS.seiten.some(s => s.datei === intern) ? `<a class="link" href="#/seite/${encodeURIComponent(intern)}" style="justify-self:center">Zur verlinkten Seite wechseln</a>` : ''}</div>`;
  const box = $('#w-schreib');
  box.innerHTML = t.orig.replace(/\s*\n\s*/g, ' ');
  const anfang = rein(box.innerHTML);
  box.addEventListener('input', () => spiegel(t, rein(box.innerHTML)));
  box.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') { ev.preventDefault(); if (!lauf && !ev.metaKey && !ev.ctrlKey) document.execCommand('insertLineBreak'); else if (ev.metaKey || ev.ctrlKey) $('#w-ok').click(); }
  });
  box.addEventListener('paste', ev => { ev.preventDefault(); document.execCommand('insertText', false, (ev.clipboardData || window.clipboardData).getData('text/plain')); });
  $$('.wahl2 button').forEach(b => b.addEventListener('click', () => {
    spiegel(t, t.orig);
    t.ueberall = b.dataset.wo === '1';
    $$('.wahl2 button').forEach(x => x.classList.toggle('an', x === b));
    $('#w-wo').innerHTML = t.ueberall ? `${woSteht(m[0], m[1])} Sie ändern alle auf einmal.` : 'Nur diese eine Stelle ändert sich. Alle anderen bleiben, wie sie sind.';
    spiegel(t, rein(box.innerHTML));
  }));
  $('#w-ab').addEventListener('click', () => { spiegel(t, t.orig); pruefLeer(); });
  const ur = $('#w-ur');
  if (ur) ur.addEventListener('click', async () => {
    try { await aendern({ art: 'text-weg', h: hs, seite: W.datei, n }); t.fertig = true; sag('Der ursprüngliche Text steht wieder da.'); neuLaden({ e: hs, n }); } catch (e) { sag(e.message, true); }
  });
  $('#w-ok').addEventListener('click', async () => {
    const neu = rein(box.innerHTML);
    if (neu === t.orig || neu === anfang) { spiegel(t, t.orig); pruefLeer(); return; }
    try {
      await aendern({ art: 'text', h: hs, seite: W.datei, n, neu, ueberall: t.ueberall, lauf });
      t.fertig = true;
      el.setAttribute('data-neu', '');
      pruefLeer();
      quittung('Text gespeichert', box.textContent.trim().slice(0, 90), { id: t.ueberall ? `t:${hs}||` : `t:${hs}|${W.datei}|${n}`, seite: W.datei });
    } catch (e) { sag(e.message, true); }
  });
  box.focus();
  const sel = getSelection(), r = document.createRange();
  r.selectNodeContents(box);
  r.collapse(false);
  sel.removeAllRanges();
  sel.addRange(r);
}
function pruefAngabe(t) {
  const felder = t.q.map(q => [q, ZS.felder[q]]).filter(x => x[1]);
  if (!felder.length) return pruefLeer();
  const f0 = felder[0][1];
  $('#w-pruef').innerHTML = `<h2>${h(ZS.gruppen[f0.gruppe] || 'Angabe')}</h2>
    ${felder.map(([q, f]) => `<label class="feld"><span>${h(f.label)}</span><input data-p="${q}" value="${h(f.wert)}"></label>`).join('')}
    <p class="hinweis">${woSteht(f0.stellen, f0.seiten) || 'Diese Angabe gilt für die ganze Website.'} Sie ändern sie hier für alle auf einmal.</p>
    <div class="pruef__kn"><button class="kn kn--breit" type="button" id="w-ok">Übernehmen<i>${PF}</i></button><button class="link" type="button" id="w-ab" style="justify-self:center">Abbrechen</button>
    <a class="link" href="#/angaben" style="justify-self:center">Alle Angaben</a></div>`;
  const ins = $$('#w-pruef input');
  ins.forEach(i => i.addEventListener('keydown', ev => { if (ev.key === 'Enter') $('#w-ok').click(); }));
  $('#w-ab').addEventListener('click', pruefLeer);
  $('#w-ok').addEventListener('click', async () => {
    try {
      const werte = {}, alte = {};
      ins.forEach(i => { if (i.value.trim() !== ZS.felder[i.dataset.p].wert) { werte[i.dataset.p] = i.value; alte[i.dataset.p] = ZS.felder[i.dataset.p].wert; } });
      const ps = Object.keys(werte);
      if (!ps.length) return pruefLeer();
      await aendern({ art: 'fakten', werte });
      quittung(mal(ps.length, 'Angabe', 'Angaben') + ' gespeichert', ps.map(p => ZS.felder[p].label).join(', '), { id: 'f:' + ps[0], seite: W.datei, zurueck: { art: 'fakten', werte: alte } });
      neuLaden({ e: t.el.dataset.e, n: t.el.dataset.en });
    } catch (e) { sag(e.message, true); }
  });
  ins[0].focus();
  ins[0].select();
}
function pruefGericht(t) {
  const [, gruppe, idx] = t.q[0].split(':'), g = ZS.karte[gruppe], i = +idx, x = g && g.liste[i];
  if (!x) return pruefLeer();
  pruefLeer();
  gerichtFenster({ gruppe, i });
}
function pruefBild(t, neu) {
  const key = t.el.dataset.b, b = ZS.bilder.find(x => x.key === key) || { seiten: [] };
  const sende = async (wert, titel) => { if (await tun({ art: 'bild', key, neu: wert }, { titel, text: mal(b.seiten.length, 'Seite', 'Seiten') + ' betroffen', id: 'b:' + key, seite: W.datei, zurueck: { art: 'bild', key, neu: b.neu || null } })) neuLaden({ b: key, n: t.el.dataset.bn }); };
  if (neu) {
    $('#w-pruef').innerHTML = `<h2>Neues Bild</h2><div class="bildvor"><img src="${h(neu.adresse)}" alt=""></div>
      <p class="hinweis">Es ersetzt das bisherige Bild${b.seiten.length > 1 ? ` auf <b>${b.seiten.length} Seiten</b>` : ''}.${neu.hinweis ? ' ' + h(neu.hinweis) : ''}</p>
      <div class="pruef__kn"><button class="kn kn--breit" type="button" id="w-ok">Bild übernehmen<i>${PF}</i></button><button class="link" type="button" id="w-ab" style="justify-self:center">Abbrechen</button></div>`;
    $('#w-ok').addEventListener('click', () => sende(neu.key, 'Bild getauscht'));
    $('#w-ab').addEventListener('click', () => pruefBild(t));
    return;
  }
  $('#w-pruef').innerHTML = `<h2>Bild</h2><div class="bildvor"><img src="${h(t.el.currentSrc || t.el.src)}" alt=""></div>
    <p class="hinweis">${b.seiten.length > 1 ? `Dieses Bild ist auf <b>${b.seiten.length} Seiten</b> zu sehen: ${b.seiten.slice(0, 6).map(s => h(s.name)).join(', ')}${b.seiten.length > 6 ? ' …' : ''}. Ein neues Bild ersetzt es überall.` : 'Dieses Bild ist nur auf dieser Seite zu sehen.'}
    ${b.sonder ? ` Als ${b.sonder} wird das neue Foto automatisch abgedunkelt, damit die Schrift darauf lesbar bleibt.` : ''}</p>
    <div class="ablage" id="w-ablage" tabindex="0" role="button"><b>Neues Bild wählen</b><span>oder hierher ziehen · JPG, PNG, WebP</span></div>
    ${b.neu ? '<button class="link" type="button" id="w-alt" style="justify-self:center;align-self:center">Ursprüngliches Bild zurückholen</button>' : ''}`;
  ablage($('#w-ablage'), key, r => pruefBild(t, r));
  const alt = $('#w-alt');
  if (alt) alt.addEventListener('click', () => sende(null, 'Ursprüngliches Bild zurückgeholt'));
}

// ---------------------------------------------------------------- Hochladen
function waehleDatei() {
  return new Promise(ok => {
    const i = $('#datei');
    i.value = '';
    i.onchange = () => ok(i.files[0] || null);
    i.click();
  });
}
async function ladeHoch(datei, fuer) {
  if (!datei) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(datei.type)) { sag('Bitte ein JPG, PNG oder WebP wählen.', true); return null; }
  sag('Das Bild wird vorbereitet …');
  try {
    const r = await api('hochladen?fuer=' + encodeURIComponent(fuer || ''), datei, true);
    if (r.hinweis) sag(r.hinweis, true);
    if (!ZS.bilder.some(b => b.key === r.key)) ZS.bilder.push({ key: r.key, w: r.w, h: r.h, adresse: r.adresse, seiten: [], neu: null, sonder: '' });
    return r;
  } catch (e) { sag(e.message, true); return null; }
}
async function hochladen(fuer) { return ladeHoch(await waehleDatei(), fuer); }
function ablage(el, fuer, dann) {
  const los = async d => { const r = await ladeHoch(d, fuer); if (r) dann(r); };
  el.addEventListener('click', async () => los(await waehleDatei()));
  el.addEventListener('keydown', async ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); los(await waehleDatei()); } });
  el.addEventListener('dragover', ev => { ev.preventDefault(); el.classList.add('drauf'); });
  el.addEventListener('dragleave', () => el.classList.remove('drauf'));
  el.addEventListener('drop', ev => { ev.preventDefault(); el.classList.remove('drauf'); los(ev.dataTransfer.files[0]); });
}
function bildWahl(dann, fuer) {
  // Foto aus dem Bestand der Website wählen oder ein neues hochladen; legt sich über das offene Fenster
  const k = $('#fenster .fenster__k'), rest = [...k.children].filter(c => !c.matches('.zu'));
  const w = document.createElement('div');
  const liste = ZS.bilder.filter(b => !b.sonder);
  w.innerHTML = `<h2>Foto <em>wählen.</em></h2><p>Ein Foto, das schon auf der Website liegt, oder ein neues von Ihrem Rechner.</p>
    <div class="ablage" id="bw-ablage" tabindex="0" role="button" style="margin-top:14px;min-height:92px"><b>Neues Foto hochladen</b><span>oder hierher ziehen · JPG, PNG, WebP</span></div>
    <div class="mauer mauer--klein">${liste.map(b => `<button class="bk" type="button" data-k="${h(b.key)}"><img src="${h(b.adresse)}" alt="" loading="lazy"><span>${mal(b.seiten.length, 'Seite', 'Seiten')}</span></button>`).join('')}</div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" id="bw-zu">Zurück</button></div>`;
  const war = rest.map(c => c.hidden);
  rest.forEach(c => { c.hidden = true; });
  k.appendChild(w);
  k.scrollTop = 0;
  const zurueck = () => { w.remove(); rest.forEach((c, i) => { c.hidden = war[i]; }); };
  $('#bw-zu', w).addEventListener('click', zurueck);
  $$('.bk', w).forEach(b => b.addEventListener('click', () => { zurueck(); dann(b.dataset.k); }));
  ablage($('#bw-ablage', w), fuer || '', r => { zurueck(); dann(r.key); });
}

// ---------------------------------------------------------------- Karte & Wein
function preisT(p) {
  p = String(p || '').trim();
  if (!p) return '';
  return /^[\d.]+$/.test(p) ? 'CHF ' + p : p;
}
function platzNach(stand, y, liste, nameJetzt, nameStand) {
  for (let k = stand.indexOf(y) - 1; k >= 0; k--) {
    const j = liste.findIndex(x => nameJetzt(x) === nameStand(stand[k]) || nameStand(x) === nameStand(stand[k]));
    if (j >= 0) return j + 1;
  }
  return 0;
}
function abgleich(g) {
  const a = g.stand, b = g.liste, na = a.map(x => x.n), nb = b.map(x => (x.u && na.includes(x.u) ? x.u : x.n));
  const status = b.map((x, i) => {
    const y = a[na.indexOf(nb[i])];
    if (!y) return 'neu';
    return (y.n !== x.n || y.z !== x.z || y.p !== x.p || (y.b || null) !== (x.b || null) || y.aus !== x.aus) ? 'anders' : '';
  });
  return { status, weg: a.filter(y => !nb.includes(y.n)) };
}
function karte() {
  /* Bilder in jeder Liste (Robert 19.10.2026): ein Wein ohne eigenes Foto bekommt keins erfunden, die Gruppe trägt ihr Bild */
  const kb = (art, n) => window.kartenBild ? window.kartenBild('alle', art, n) : '';
  const zeile = (x, i, g, st, letzte) => `<div class="gz${x.aus ? ' aus' : ''}${BLITZ === x.n ? ' blitz' : ''}" data-i="${i}">
      ${g.bild ? `<button class="gz__b" type="button" data-akt="edit" tabindex="-1" aria-hidden="true">${x.b ? `<img src="${bildadr(x.b)}" alt="" loading="lazy">` : SYM.bild}</button>` : ''}
      <button class="gz__t" type="button" data-akt="edit" title="Bearbeiten"><b>${h(x.n)}</b>${x.z ? `<span>${h(x.z)}</span>` : ''}</button>
      <span class="gz__s">${x.aus ? '<i class="marke grau">Ausgeblendet</i>' : ''}${st === 'neu' ? '<i class="marke gold">Neu im Entwurf</i>' : st === 'anders' ? '<i class="marke gold">Geändert</i>' : ''}</span>
      <span class="gz__p">${h(preisT(x.p))}</span>
      <div class="gz__r"><button class="rund" type="button" data-akt="hoch" title="Nach oben" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" title="Nach unten" aria-label="Nach unten"${letzte ? ' disabled' : ''}>${SYM.runter}</button>
        <button class="rund" type="button" data-akt="aus" title="${x.aus ? 'Wieder zeigen' : 'Vorübergehend ausblenden'}" aria-label="${x.aus ? 'Wieder zeigen' : 'Ausblenden'}">${x.aus ? SYM.augezu : SYM.auge}</button>
        <button class="rund" type="button" data-akt="weg" title="Von der Karte nehmen" aria-label="Von der Karte nehmen">${SYM.korb}</button>
        <button class="kn kn--klein kn--linie" type="button" data-akt="edit">Bearbeiten</button></div></div>`;
  const gruppe = ([key, g]) => {
    const ab = abgleich(g), wort = g.bild ? (key === 'getraenke' ? 'Getränk' : 'Gericht') : 'Wein';
    return `<section class="blatt gruppe" data-g="${key}"><div class="gruppe__k">${!g.bild && kb('g', key) ? `<span class="ug__b" aria-hidden="true"><img src="${kb('g', key)}" alt="" loading="lazy" decoding="async"></span>` : ''}<h3>${h(g.bild ? g.titel : (g.unter || g.titel))}<span>${String(g.liste.filter(x => !x.aus).length).padStart(2, '0')}</span></h3>${g.geaendert ? '<i class="marke gold">Im Entwurf geändert</i>' : ''}
        <button class="kn kn--klein" type="button" data-akt="neu">${wort} hinzufügen</button></div>
      <div class="zeilen">${g.liste.map((x, i) => zeile(x, i, g, ab.status[i], i === g.liste.length - 1)).join('')}${ab.weg.map(y => `<div class="gz weg"><span class="gz__t"><b>${h(y.n)}</b></span><span class="gz__s"><i class="marke grau">Entfernt, noch nicht veröffentlicht</i></span><span class="gz__p"></span>
        <div class="gz__r"><button class="kn kn--klein kn--linie" type="button" data-akt="hol" data-n="${h(y.n)}">Zurückholen</button></div></div>`).join('')}
        ${g.liste.length || ab.weg.length ? '' : `<p class="gz leer">Noch nichts in dieser Gruppe.</p>`}</div>
      ${g.geaendert ? '<div class="gruppe__f"><button class="link" type="button" data-akt="std">Alle Änderungen in dieser Gruppe zurücknehmen</button></div>' : ''}</section>`;
  };
  const wein = ZS.wein.map(w => { const gs = Object.entries(ZS.karte).filter(([k, g]) => k.startsWith(`w${w.gi}.`)); return `<h2 class="reiheT">${h(w.titel)}</h2>${gs.map(gruppe).join('')}
    <div class="gruppe__neu"><button class="link" type="button" data-akt="gruppe-neu" data-haupt="${w.gi}">Region oder Rubrik unter «${h(w.titel)}» anlegen</button></div>`; }).join('');
  sicht.innerHTML = `<div class="in">${kopf('Karte <em>& Wein.</em>', 'Getränke und Gerichte stehen als Bögen auf «Essen & Trinken», darunter die Weinkarte. Mit «Bearbeiten» öffnen Sie eine Zeile, mit «hinzufügen» legen Sie eine neue an. Die Karten als PDF pflegen Sie unter «Angaben & Zeiten».',
      `<a class="kn kn--linie" href="/entwurf/essen-trinken.html#karte" target="_blank" rel="noopener">Karte im Entwurf ansehen</a><button class="kn" type="button" data-akt="neu-oben">Gericht hinzufügen<i>${PF}</i></button>`)}
    <h2 class="reiheT" style="margin-top:0">Apéro & Getränke</h2>${gruppe(['getraenke', ZS.karte.getraenke])}
    <h2 class="reiheT">Gerichte</h2>${gruppe(['gerichte', ZS.karte.gerichte])}
    ${wein}
    ${zahlenBlatt('zahlen.essen')}</div>`;
  const blitz = $('.gz.blitz', sicht);
  BLITZ = null;
  if (blitz) blitz.scrollIntoView({ block: 'center' });
  sicht.querySelector('.in').addEventListener('click', ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const akt = b.dataset.akt;
    if (akt === 'neu-oben') return gerichtFenster({ gruppe: 'gerichte' });
    if (akt === 'gruppe-neu') return gruppeFenster(+b.dataset.haupt);
    if (listenKlick(ev)) return;
    const sec = b.closest('.gruppe');
    if (!sec || !sec.dataset.g) return;
    const key = sec.dataset.g, g = ZS.karte[key], z = b.closest('.gz'), i = z && z.dataset.i !== undefined ? +z.dataset.i : -1, alt = g.liste.map(x => ({ ...x })), l = alt.map(x => ({ ...x }));
    const sende = async (liste, titel, text) => { if (await tun({ art: 'karte', gruppe: key, liste }, { titel, text, id: 'k:' + key, zurueck: { art: 'karte', gruppe: key, liste: alt } })) neuZeichnen(); };
    if (akt === 'neu') return gerichtFenster({ gruppe: key });
    if (akt === 'edit') return gerichtFenster({ gruppe: key, i });
    if (akt === 'std') return frage('Änderungen <em>zurücknehmen?</em>', `«${g.titel}» steht danach wieder so da wie auf der Website.`, 'Zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'k:' + key }); sag('Zurückgenommen: ' + g.titel); neuZeichnen(); });
    if (akt === 'hol') { const y = g.stand.find(x => x.n === b.dataset.n); l.splice(platzNach(g.stand, y, l, x => x.u || x.n, x => x.n), 0, { ...y }); BLITZ = y.n; return sende(l, 'Wieder auf der Karte', y.n); }
    if (akt === 'hoch' && i > 0) { [l[i - 1], l[i]] = [l[i], l[i - 1]]; BLITZ = l[i - 1].n; return sende(l, 'Reihenfolge gespeichert', `${l[i - 1].n} steht jetzt weiter oben`); }
    if (akt === 'runter' && i < l.length - 1) { [l[i + 1], l[i]] = [l[i], l[i + 1]]; BLITZ = l[i + 1].n; return sende(l, 'Reihenfolge gespeichert', `${l[i + 1].n} steht jetzt weiter unten`); }
    if (akt === 'aus') { l[i].aus = !l[i].aus; BLITZ = l[i].n; return sende(l, l[i].aus ? 'Ausgeblendet' : 'Wieder sichtbar', l[i].aus ? `${l[i].n} steht vorerst nicht auf der Karte` : l[i].n); }
    if (akt === 'weg') return frage('Von der Karte <em>nehmen?</em>', `«${alt[i].n}» verschwindet aus ${g.titel}. Bis zum Veröffentlichen können Sie es mit einem Klick zurückholen.`, 'Von der Karte nehmen', async () => { l.splice(i, 1); await sende(l, 'Von der Karte genommen', alt[i].n); });
  });
}
function gerichtFenster({ gruppe, i }) {
  const neu = i === undefined;
  let grW = gruppe || 'gerichte';
  const st = neu ? { n: '', z: '', p: '', b: null, aus: false } : { ...ZS.karte[grW].liste[i] };
  const gruppen = [['gerichte', 'Gerichte'], ['getraenke', 'Apéro & Getränke']].concat(Object.entries(ZS.karte).filter(([k]) => k.startsWith('w')).map(([k, g]) => [k, g.titel]));
  let pos = 'ende';
  const wort = () => ZS.karte[grW].bild ? (grW === 'getraenke' ? 'Getränk' : 'Gericht') : 'Wein';
  fenster(`<h2>${neu ? 'Neu auf <em>die Karte.</em>' : `${wort()} <em>bearbeiten.</em>`}</h2>
    <div class="form2"><div class="form2__l">
      ${neu ? `<div class="feld"><span>Wohin</span><select id="g-gruppe">${gruppen.map(([k, t]) => `<option value="${h(k)}"${k === grW ? ' selected' : ''}>${h(t)}</option>`).join('')}</select></div>`
    : `<p class="form2__ort">${h(ZS.karte[grW].titel)}</p>`}
      <label class="feld"><span>Name</span><input id="g-n" maxlength="140" value="${h(st.n)}" placeholder="z. B. Oberländer Gerstensuppe"></label>
      <label class="feld"><span id="g-zl">Beschreibung</span><textarea id="g-z" rows="2" maxlength="300" placeholder="Zutaten oder Herkunft, wie auf der Karte">${h(st.z)}</textarea></label>
      <label class="feld"><span>Preis in Franken</span><input id="g-p" value="${h(st.p)}" placeholder="z. B. 18.50 oder 80 g 22.00 · 160 g 34.00"><small>So, wie es dastehen soll. Mengen und Zusätze gehören mit in dieses Feld.</small></label>
      <div class="feld" id="g-foto"></div>
      ${neu ? `<div class="feld"><span>Platz in der Gruppe</span>${chipsH('pos', [['ende', 'Am Ende'], ['anfang', 'Ganz oben']], pos)}</div>` : ''}
      ${schalter('g-an', !st.aus, 'Auf der Karte zeigen')}
    </div><div class="form2__r"><span class="mono leise">So steht es auf der Karte</span><div id="g-vor"></div></div></div>
    <div class="fehler" id="g-f" role="alert"></div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="g-ok">${neu ? 'Auf die Karte setzen' : 'Speichern'}<i>${PF}</i></button></div>`, true);
  const f = $('#fenster');
  const mal2 = () => {
    const g = ZS.karte[grW], n = $('#g-n').value.trim() || ('Name ' + (g.bild ? 'des Gerichts' : 'des Weins')), z = $('#g-z').value.trim(), p = $('#g-p').value.trim(), aus = !$('#g-an').checked;
    $('#g-zl').textContent = g.bild ? 'Beschreibung' : 'Herkunft, Traube, Grösse';
    $('#g-foto').innerHTML = g.bild ? `<span>Foto</span><div class="fotowahl">${st.b ? `<img src="${bildadr(st.b)}" alt="">` : `<div class="fotowahl__leer">${CE}</div>`}
      <div><button class="kn kn--klein kn--linie" type="button" data-akt="foto">${st.b ? 'Anderes Foto' : 'Foto wählen'}</button>${st.b ? '<button class="link" type="button" data-akt="ohnefoto">Ohne Foto</button>' : '<small>Ohne Foto steht das Zeichen des Hauses auf dem Bogen.</small>'}</div></div>` : '';
    $('#g-vor').innerHTML = g.bild ? `<div class="vk${aus ? ' aus' : ''}"><div class="vk__b">${st.b ? `<img src="${bildadr(st.b)}" alt="">` : CE}</div><div class="vk__n">${h(n)}</div><p>${h(z)}</p><b>${h(preisT(p))}</b></div>`
      : `<div class="vw${aus ? ' aus' : ''}"><div><b>${h(n)}</b><small>${h(z)}</small></div><i>${h(p)}</i></div>`;
    $('#g-vor').insertAdjacentHTML('beforeend', `<p class="vor__h">${aus ? 'Ausgeblendet: steht vorerst nicht auf der Karte.' : h(g.titel)}</p>`);
  };
  mal2();
  f.oninput = () => { mal2(); $('#g-f').textContent = ''; };
  f.bei = ev => { if (ev.detail.name === 'pos') pos = ev.detail.wert; mal2(); };
  const sel = $('#g-gruppe');
  if (sel) sel.addEventListener('change', () => { grW = sel.value; st.b = ZS.karte[grW].bild ? st.b : null; mal2(); });
  f.onclick = async ev => {
    const b = ev.target.closest('[data-akt]');
    if (b && b.dataset.akt === 'foto') bildWahl(k => { st.b = k; mal2(); });
    if (b && b.dataset.akt === 'ohnefoto') { st.b = null; mal2(); }
  };
  $('#g-ok').addEventListener('click', async ev => {
    const g = ZS.karte[grW], n = $('#g-n').value.trim(), alt = g.liste.map(x => ({ ...x })), liste = alt.map(x => ({ ...x }));
    if (!n) { $('#g-f').textContent = 'Bitte einen Namen eintragen.'; $('#g-n').focus(); return; }
    if (alt.some((x, j) => x.n.toLowerCase() === n.toLowerCase() && (neu || j !== i))) { $('#g-f').textContent = `«${n}» steht schon in ${g.titel}. Bitte einen anderen Namen wählen.`; return; }
    const eintrag = { n, z: $('#g-z').value.trim(), p: $('#g-p').value.trim(), b: g.bild ? st.b : null, aus: !$('#g-an').checked };
    const ur = st.u || (!neu && g.stand.some(x => x.n === st.n) ? st.n : null);
    if (ur && ur !== n) eintrag.u = ur;
    if (neu) { if (pos === 'anfang') liste.unshift(eintrag); else liste.push(eintrag); } else liste[i] = eintrag;
    if (!neu && ['n', 'z', 'p', 'b', 'aus'].every(k => (eintrag[k] || '') === (alt[i][k] || ''))) { fensterZu(); sag('Nichts geändert, nichts gespeichert.'); return; }
    ev.target.disabled = true;
    const ok = await tun({ art: 'karte', gruppe: grW, liste }, { titel: neu ? `${wort()} hinzugefügt` : `${wort()} gespeichert`, text: `${n} · ${g.titel}`, id: 'k:' + grW, zurueck: { art: 'karte', gruppe: grW, liste: alt } });
    ev.target.disabled = false;
    if (!ok) return;
    fensterZu();
    BLITZ = n;
    if (W) neuLaden({}); else if (location.hash !== '#/karte') location.hash = '#/karte'; else neuZeichnen();
  });
  $('#g-n').focus();
}
function gruppeFenster(haupt, g) {
  const w = ZS.wein.find(x => x.gi === haupt);
  fenster(`<h2>${g ? 'Gruppe <em>umbenennen.</em>' : 'Neue <em>Weingruppe.</em>'}</h2><p>Eine Region oder Rubrik unter «${h(w ? w.titel : 'Wein')}», zum Beispiel «Aargau» oder «Raritäten». Weine legen Sie danach wie gewohnt an.</p><div class="form1" style="margin-top:18px">
    <label class="feld"><span>Name</span><input id="gr-t" maxlength="60" value="${h(g ? g.titel : '')}" placeholder="z. B. Aargau"></label></div>
    <div class="fehler" id="gr-f"></div><div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="gr-ok">${g ? 'Speichern' : 'Anlegen'}<i>${PF}</i></button></div>`);
  $('#gr-ok').addEventListener('click', async () => {
    const t = $('#gr-t').value.trim();
    if (!t) { $('#gr-f').textContent = 'Bitte einen Namen eintragen.'; return; }
    if (await tun({ art: 'kartengruppe', haupt, titel: t, i: g ? g.i : undefined }, { titel: g ? 'Gruppe gespeichert' : 'Gruppe angelegt', text: `${t} · ${w ? w.titel : ''}` })) { fensterZu(); neuZeichnen(); }
  });
  $('#gr-t').focus();
}

// ---------------------------------------------------------------- Angaben & Zeiten
const ANGTEXT = { haus: 'Telefon, E-Mail und Adresse stehen im Fuss jeder Seite, im Buchungsfenster, auf «Kontakt & Anreise» und hinter jedem Knopf, der anruft oder schreibt.',
  zeit: 'Rezeption, Check-in, Check-out, Frühstück, Restaurant, Roomservice und Wellnessdörfli. Sätze in Fliesstexten (zum Beispiel unter «Gut zu wissen») sind eigene Texte und folgen nicht von selbst.',
  preis: 'Preise, die an mehreren Stellen stehen. Preise der Zimmer, Packages, Säle und Karte pflegen Sie in deren Bereichen.',
  lage: 'Entfernungen, wie sie auf «Kontakt & Anreise», «Ihre Abreise» und der Startseite stehen.', link: 'Buchungssystem, Instagram, Facebook und die Route. Jeder Knopf der Website zeigt dorthin.',
  pdf: 'Die Unterlagen hinter den Knöpfen der Website. Laden Sie eine neue PDF hoch, der Knopf zeigt danach auf die neue Datei.' };
function angabeFeld(p, f) {
  return `<label class="feld" data-p="${p}"><span>${h(f.label)}${f.wert !== f.stand ? '<i class="marke gold">Im Entwurf geändert</i>' : ''}</span><input value="${h(f.wert)}"${f.art === 'link' ? ' inputmode="url"' : ''}>
      <small>${f.stellen ? `steht an ${mal(f.stellen, 'Stelle', 'Stellen')} auf ${mal(f.seiten, 'Seite', 'Seiten')}` : (f.art === 'link' ? 'hinter den Knöpfen der Seite' : '')}${f.wert !== f.stand ? ` · <button class="link" type="button" data-sehen="f:${p}">vorher/nachher ansehen</button>` : ''}${p.startsWith('pdf.') ? ` · <button class="link" type="button" data-pdf="${p}">neue PDF hochladen</button>` : ''}</small></label>`;
}
// Ein Blatt mit Angaben und eigenem Speichern-Knopf (immer zu sehen: grau, gelb bei offenen Eingaben, grün nach dem Speichern)
function angabenBlatt(g, text, pfade) {
  const fuss = '<div class="sichern"><i></i><span></span><button class="link" type="button" data-akt="verwerfen">Verwerfen</button><button class="kn kn--klein" type="button" data-akt="sichern">Speichern</button></div>';
  return `<section class="blatt haus" data-karte="${g}">${text ? `<p class="gruppe__hin" style="padding:22px 22px 0">${text}</p>` : ''}<div class="haus__t"><div class="raster r-3">${pfade.filter(p => ZS.felder[p]).map(p => angabeFeld(p, ZS.felder[p])).join('')}</div></div>${fuss}</section>`;
}
function angabenBinden(wurzel) {
  const pruefe = karte => {
    const anders = $$('.feld', karte).filter(l => { const d = $('input', l).value.trim() !== ZS.felder[l.dataset.p].wert; l.classList.toggle('offen', d); return d; });
    const s = $('.sichern', karte), imEntwurf = $$('.feld', karte).filter(l => ZS.felder[l.dataset.p].wert !== ZS.felder[l.dataset.p].stand).length;
    s.classList.toggle('offen', !!anders.length);
    s.classList.toggle('entwurf', !anders.length && !!imEntwurf);
    $$('button', s).forEach(b => { b.disabled = !anders.length; });
    $('span', s).textContent = anders.length ? mal(anders.length, 'Angabe', 'Angaben') + ' noch nicht gespeichert' : imEntwurf ? `Gespeichert, ${imEntwurf} im Entwurf` : 'Nichts geändert';
    return anders;
  };
  $$('.haus', wurzel).forEach(pruefe);
  offen = () => !!$('.feld.offen', sicht);
  wurzel.addEventListener('input', ev => { const k = ev.target.closest('.haus'); if (k) pruefe(k); });
  wurzel.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.matches('.haus .feld input')) { ev.preventDefault(); const k = ev.target.closest('.haus'); if (pruefe(k).length) $('[data-akt="sichern"]', k).click(); } });
  wurzel.addEventListener('click', async ev => {
    const s = ev.target.closest('[data-sehen]'), pd = ev.target.closest('[data-pdf]'), b = ev.target.closest('[data-akt]'), karte = b && b.closest('.haus');
    if (s && s.closest('.haus')) { ev.preventDefault(); const c = ZS.aenderungen.find(x => x.id === s.dataset.sehen); if (c) vergleich(c); return; }
    if (pd) { ev.preventDefault(); pdfHoch(pd.dataset.pdf); return; }
    if (!karte) return;
    if (b.dataset.akt === 'verwerfen') { $$('.feld', karte).forEach(l => { $('input', l).value = ZS.felder[l.dataset.p].wert; }); pruefe(karte); return; }
    if (b.dataset.akt === 'sichern') {
      const anders = pruefe(karte), werte = {}, alte = {};
      if (!anders.length) { sag('Nichts geändert, nichts gespeichert.'); return; }
      anders.forEach(l => { werte[l.dataset.p] = $('input', l).value; alte[l.dataset.p] = ZS.felder[l.dataset.p].wert; });
      const namen = anders.map(l => ZS.felder[l.dataset.p].label), erste = Object.keys(werte)[0];
      b.disabled = true;
      const ok = await tun({ art: 'fakten', werte }, { titel: mal(anders.length, 'Angabe', 'Angaben') + ' gespeichert', text: `${namen.slice(0, 3).join(', ')}${namen.length > 3 ? ' …' : ''}`, id: 'f:' + erste, zurueck: { art: 'fakten', werte: alte } });
      b.disabled = false;
      if (ok) { offen = null; neuZeichnen(); }
    }
  });
}
function angaben() {
  const gruppen = ['haus', 'zeit', 'preis', 'lage', 'link', 'pdf'];
  sicht.innerHTML = `<div class="in">${kopf('Angaben <em>& Zeiten.</em>', 'Jede Angabe gibt es nur einmal. Tragen Sie sie ein und drücken Sie unten auf «Speichern». Danach stimmt sie auf jeder Seite.')}
    ${gruppen.map(g => `<h2 class="zw">${h(ZS.gruppen[g] || g)}</h2>${angabenBlatt(g, ANGTEXT[g], Object.entries(ZS.felder).filter(([, f]) => f.gruppe === g).map(([p]) => p))}`).join('')}</div>`;
  angabenBinden(sicht.querySelector('.in'));
}
async function pdfHoch(pfad) {
  const d = await waehleDateiArt('application/pdf,.pdf');
  if (!d) return null;
  if (d.type !== 'application/pdf' && !/\.pdf$/i.test(d.name)) { sag('Bitte eine PDF wählen.', true); return null; }
  sag('Die PDF wird abgelegt …');
  try {
    const r = await api('hochladen?art=pdf&name=' + encodeURIComponent(d.name), d, true);
    if (await tun({ art: 'fakt', pfad, wert: r.pfad }, { titel: 'PDF ersetzt', text: `${d.name} (${r.kb} kB)`, id: 'f:' + pfad, zurueck: { art: 'fakt', pfad, wert: ZS.felder[pfad].wert } })) neuZeichnen();
  } catch (e) { sag(e.message, true); }
}
function waehleDateiArt(accept) {
  return new Promise(ok => { const i = $('#datei'); i.value = ''; i.accept = accept; i.onchange = () => { ok(i.files[0] || null); i.accept = 'image/jpeg,image/png,image/webp'; }; i.click(); });
}

// ---------------------------------------------------------------- Listen (Zimmer, Apartments, Packages, Säle, Haus, Fragen, Jobs …)
const feldWert = (x, f) => f[2] === 'liste' ? (x[f[0]] || []).join(', ') : f[2] === 'bilder' ? mal((x[f[0]] || []).length, 'Foto', 'Fotos') : f[2] === 'mehrfach' ? (x[f[0]] || []).map(v => ((f[3] || []).find(o => o[0] === v) || [v, v])[1]).join(', ') : f[2] === 'wahl' ? (((f[3] || []).find(o => o[0] === String(x[f[0]])) || ['', ''])[1]) : String(x[f[0]] ?? '');
const listeName = (x, g) => { const f = g.felder.find(f => ['name', 'titel', 'frage', 'jahr', 'monat', 'zeitraum'].includes(f[0]) && x[f[0]]) || g.felder.find(f => f[2] === 'text' && f[0] !== 'alt' && x[f[0]]) || g.felder.find(f => f[2] === 'fest' && x[f[0]]); return f ? feldWert(x, f) : feldWert(x, g.felder[0]); };
function listeStatus(g) {
  const norm = l => JSON.stringify(l.map(x => Object.fromEntries(g.felder.map(f => [f[0], ['liste', 'bilder', 'mehrfach'].includes(f[2]) ? (x[f[0]] || []) : (x[f[0]] ?? '')]))));
  const a = g.stand, b = g.liste, na = a.map(x => listeName(x, g)), nb = b.map(x => listeName(x, g)), gleich = a.length === b.length;
  return { status: b.map((x, i) => { const j = na.includes(nb[i]) ? na.indexOf(nb[i]) : (gleich && !nb.includes(na[i]) ? i : -1); return j < 0 ? 'neu' : (norm([a[j]]) !== norm([x]) ? 'anders' : ''); }), weg: a.filter((y, i) => !nb.includes(na[i]) && !(gleich && !na.includes(nb[i]))) };
}
function listeBlatt(key) {
  const g = ZS.listen[key];
  if (!g) return '';
  if (key.startsWith('zahlen.')) return zahlenBlatt(key);
  const st = listeStatus(g), bildF = g.felder.find(f => f[2] === 'bild'), fest = !!FEST[key];
  const zweit = g.felder.filter(f => !['bild', 'bilder', 'liste', 'lang', 'fest', 'link'].includes(f[2]) && f[0] !== 'alt').slice(1, 4);
  const zeile = (x, i) => `<div class="gz${BLITZ === key + ':' + i ? ' blitz' : ''}" data-i="${i}">
      ${(() => { const eig = bildF && x[bildF[0]] ? bildadr(x[bildF[0]]) : '', lb = eig || (window.listenBild ? window.listenBild(key, i, listeName(x, g)) : ''); return bildF || lb ? `<button class="gz__b" type="button" data-akt="edit" tabindex="-1" aria-hidden="true">${lb ? `<img src="${lb}" alt="" loading="lazy" decoding="async">` : SYM.bild}</button>` : ''; })()}
      <button class="gz__t" type="button" data-akt="edit" title="Bearbeiten"><b>${h(listeName(x, g)) || '<i>ohne Namen</i>'}</b>${zweit.map(f => feldWert(x, f)).filter(Boolean).length ? `<span>${h(zweit.map(f => feldWert(x, f)).filter(Boolean).join(' · '))}</span>` : ''}</button>
      <span class="gz__s">${st.status[i] === 'neu' ? '<i class="marke gold">Neu im Entwurf</i>' : st.status[i] === 'anders' ? '<i class="marke gold">Geändert</i>' : ''}</span><span class="gz__p"></span>
      <div class="gz__r">${fest ? '' : `<button class="rund" type="button" data-akt="hoch" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" aria-label="Nach unten"${i === g.liste.length - 1 ? ' disabled' : ''}>${SYM.runter}</button>
        <button class="rund" type="button" data-akt="weg" title="Entfernen" aria-label="Entfernen">${SYM.korb}</button>`}<button class="kn kn--klein kn--linie" type="button" data-akt="edit">Bearbeiten</button></div></div>`;
  return `<section class="blatt gruppe" data-l="${h(key)}"><div class="gruppe__k"><h3>${h(g.label)}<span>${String(g.liste.length).padStart(2, '0')}</span></h3>${g.eigen ? '<i class="marke gold">Im Entwurf geändert</i>' : ''}${fest ? '' : `<button class="kn kn--klein" type="button" data-akt="neu">${WORTE[key] || 'Eintrag'} hinzufügen</button>`}</div>
    ${g.hinweis ? `<p class="gruppe__hin">${h(g.hinweis)}</p>` : ''}
    <div class="zeilen">${g.liste.map(zeile).join('')}${st.weg.map(y => `<div class="gz weg"><span class="gz__t"><b>${h(listeName(y, g))}</b></span><span class="gz__s"><i class="marke grau">Entfernt, noch nicht veröffentlicht</i></span><span class="gz__p"></span><div class="gz__r"><button class="kn kn--klein kn--linie" type="button" data-akt="hol" data-n="${h(listeName(y, g))}">Zurückholen</button></div></div>`).join('')}
      ${g.liste.length || st.weg.length ? '' : '<p class="gz leer">Noch nichts in dieser Liste.</p>'}</div>
    ${g.eigen ? '<div class="gruppe__f"><button class="link" type="button" data-akt="std">Alle Änderungen in dieser Liste zurücknehmen</button></div>' : ''}</section>`;
}
function zahlenBlatt(key) {
  // Die grossen Zahlen eines Abschnitts: alle in einer Reihe, ein Speichern-Knopf
  const g = ZS.listen[key];
  if (!g) return '';
  return `<section class="blatt gruppe" data-zahlen="${h(key)}"><div class="gruppe__k"><h3>${h(g.label)}</h3>${g.eigen ? '<i class="marke gold">Im Entwurf geändert</i>' : ''}</div>
    <div class="zahlenreihe">${g.liste.map((x, i) => `<div class="zahlfeld" data-i="${i}"><input class="zahl" inputmode="numeric" value="${h(x.zahl)}" aria-label="Zahl"><input class="nach" maxlength="4" value="${h(x.nach || '')}" placeholder="+" aria-label="Zusatz"><input class="text" maxlength="80" value="${h(x.text)}" aria-label="Beschriftung"></div>`).join('')}</div>
    <div class="gruppe__f"><span class="leise" style="font-size:13.5px">Ganze Zahlen ohne Punkt und Komma; der Zusatz (zum Beispiel +) steht hinter der Zahl.</span><div class="sichern offen" style="position:static;margin:0 0 0 auto"><i></i><span>Zahlen</span><button class="kn kn--klein" type="button" data-akt="zahlen-ok">Speichern</button></div></div></section>`;
}
function listenKlick(ev) {
  const b = ev.target.closest('[data-akt]');
  if (!b) return false;
  const zsec = b.closest('[data-zahlen]');
  if (zsec && b.dataset.akt === 'zahlen-ok') {
    const key = zsec.dataset.zahlen, g = ZS.listen[key], alt = g.liste.map(x => ({ ...x }));
    const liste = $$('.zahlfeld', zsec).map(z => ({ zahl: $('.zahl', z).value.trim(), nach: $('.nach', z).value.trim(), text: $('.text', z).value.trim() }));
    tun({ art: 'liste', key, liste }, { titel: 'Zahlen gespeichert', text: g.label, id: 'l:' + key, zurueck: { art: 'liste', key, liste: alt } }).then(ok => { if (ok) neuZeichnen(); });
    return true;
  }
  const sec = b.closest('[data-l]');
  if (!sec) return false;
  const key = sec.dataset.l, g = ZS.listen[key], z = b.closest('.gz'), i = z && z.dataset.i !== undefined ? +z.dataset.i : -1, akt = b.dataset.akt;
  const alt = g.liste.map(x => ({ ...x })), l = alt.map(x => ({ ...x }));
  const sende = async (liste, titel, text) => { if (await tun({ art: 'liste', key, liste }, { titel, text, id: 'l:' + key, zurueck: { art: 'liste', key, liste: alt } })) neuZeichnen(); };
  if (akt === 'neu') listeFenster(key);
  else if (akt === 'edit') listeFenster(key, i);
  else if (akt === 'std') frage('Änderungen <em>zurücknehmen?</em>', `«${g.label}» steht danach wieder so da wie auf der Website.`, 'Zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'l:' + key }); sag('Zurückgenommen: ' + g.label); neuZeichnen(); });
  else if (akt === 'hol') { const y = g.stand.find(x => listeName(x, g) === b.dataset.n), pos = platzNach(g.stand, y, l, x => listeName(x, g), x => listeName(x, g)); l.splice(pos, 0, { ...y }); BLITZ = key + ':' + pos; sende(l, 'Wieder da', listeName(y, g)); }
  else if (akt === 'hoch' && i > 0) { [l[i - 1], l[i]] = [l[i], l[i - 1]]; BLITZ = key + ':' + (i - 1); sende(l, 'Reihenfolge gespeichert', listeName(l[i - 1], g)); }
  else if (akt === 'runter' && i < l.length - 1) { [l[i + 1], l[i]] = [l[i], l[i + 1]]; BLITZ = key + ':' + (i + 1); sende(l, 'Reihenfolge gespeichert', listeName(l[i + 1], g)); }
  else if (akt === 'weg') frage('Eintrag <em>entfernen?</em>', `«${listeName(alt[i], g)}» verschwindet aus «${g.label}». Bis zum Veröffentlichen können Sie es zurückholen.`, 'Entfernen', async () => { l.splice(i, 1); await sende(l, 'Entfernt', listeName(alt[i], g)); });
  else return false;
  return true;
}
const seiteVon = d => ZS.seiten.find(s => s.datei === d);
const SEITENBILD = { 'index.html': 'haus-tag2' };  // die Startseite trägt im Bau das Zeichen des Hauses als Bild, im Bureau ein Foto
const seitenBild = s => (SEITENBILD[s.datei] && ZS.bilder.some(b => b.key === SEITENBILD[s.datei])) ? SEITENBILD[s.datei] : s.bild;
function seitenReihe(dateien) {
  const da = dateien.map(seiteVon).filter(Boolean);
  return da.length ? `<div class="raster r-4 bseiten">${da.map(s => `<a class="sk" href="#/seite/${encodeURIComponent(s.datei)}"><span class="sk__b">${s.bild ? `<img src="${bildadr(seitenBild(s))}" alt="" loading="lazy">` : ''}<i class="sk__k">In der Seite ändern</i></span><span class="sk__t"><b>${h(s.name)}</b><span>${mal(s.texte, 'Text', 'Texte')} · ${mal(s.bilder, 'Bild', 'Bilder')}</span></span></a>`).join('')}</div>` : '';
}
function listenAnsicht(name) {
  const a = LISTEN[name], nav = NAVP.find(p => p[0] === (NAVBEREICH[name] || name));
  const felder = (a.felder || []).filter(p => ZS.felder[p]);
  if (NUR === 'listen') {   // in Le Bureau: nur die Listen des Bereichs
    sicht.innerHTML = `<div class="in in--nur">${a.keys.map(listeBlatt).join('') || '<p class="hinweis">In diesem Bereich gibt es keine Liste.</p>'}</div>`;
    sicht.querySelector('.in').addEventListener('click', listenKlick);
    return;
  }
  sicht.innerHTML = `<div class="in">${kopf(a.titel, a.text, `<a class="kn kn--linie" href="/entwurf/${a.seite}" target="_blank" rel="noopener">Seite im Entwurf ansehen</a>`)}
    ${a.seiten ? `<h2 class="zw">${a.seiten.length === 1 ? 'Die Seite' : 'Die Seiten'}<span>${String(a.seiten.length).padStart(2, '0')}</span></h2>${seitenReihe(a.seiten)}` : ''}
    ${felder.length ? `<h2 class="zw">Zeiten, Preise <em>und Unterlagen</em><span>${String(felder.length).padStart(2, '0')}</span></h2>${angabenBlatt('b-' + name, 'Dieselben Angaben stehen unter «Angaben & Zeiten». Einmal ändern, auf jeder Seite richtig.', felder)}` : ''}
    ${a.keys.some(k => ZS.listen[k]) ? `<h2 class="zw">Listen</h2>` : ''}${a.keys.map(listeBlatt).join('')}
    ${a.mehr ? `<a class="lage" href="#/${a.mehr[0]}" style="margin-top:28px;display:flex"><div><h2>${h(a.mehr[1])}</h2><p>${h(a.mehr[2])}</p></div><span class="kn kn--hell">Öffnen<i>${PF}</i></span></a>` : ''}</div>`;
  const blitz = $('.gz.blitz', sicht);
  BLITZ = null;
  if (blitz) blitz.scrollIntoView({ block: 'center' });
  const w = sicht.querySelector('.in');
  w.addEventListener('click', listenKlick);
  if (felder.length) angabenBinden(w);
}
function feldH(f, wert, id, neu) {
  const [k, label, art, opt] = f;
  if (art === 'fest') return neu ? `<label class="feld"><span>${h(label)}</span><input id="${id}" maxlength="30" value="${h(wert ?? '')}" placeholder="leer = aus dem Namen"><small>Kleinbuchstaben und Bindestriche. Lässt sich später nicht mehr ändern.</small></label>` : `<div class="feld"><span>${h(label)}</span><p class="festwert">${h(wert ?? '')}<input type="hidden" id="${id}" value="${h(wert ?? '')}"></p></div>`;
  if (art === 'lang') return `<label class="feld"><span>${h(label)}</span><textarea id="${id}" rows="5">${h(wert ?? '')}</textarea></label>`;
  if (art === 'liste') return `<label class="feld"><span>${h(label)}</span><textarea id="${id}" rows="4" placeholder="Ein Punkt je Zeile">${h((wert || []).join('\n'))}</textarea></label>`;
  if (art === 'zahl') return `<label class="feld"><span>${h(label)}</span><input id="${id}" inputmode="numeric" value="${h(String(wert ?? ''))}"></label>`;
  if (art === 'link') return `<label class="feld"><span>${h(label)}</span><input id="${id}" inputmode="url" value="${h(wert ?? '')}" placeholder="https://… oder seite.html#abschnitt"></label>`;
  if (art === 'wahl') return `<div class="feld" data-wahl="${k}"><span>${h(label)}</span>${chipsH(k, opt || [], wert)}</div>`;
  if (art === 'mehrfach') return `<div class="feld" data-wahl="${k}"><span>${h(label)}</span>${chipsH(k, opt || [], wert || [], true)}</div>`;
  if (art === 'bild') return `<div class="feld" data-bildfeld="${k}"><span>${h(label)}</span><div class="fotowahl">${wert ? `<img src="${bildadr(wert)}" alt="">` : `<div class="fotowahl__leer">${CE}</div>`}<div><button class="kn kn--klein kn--linie" type="button" data-akt="foto" data-k="${k}">${wert ? 'Anderes Foto' : 'Foto wählen'}</button>${wert ? `<button class="link" type="button" data-akt="ohnefoto" data-k="${k}">Ohne Foto</button>` : ''}</div></div></div>`;
  if (art === 'bilder') return `<div class="feld" data-bilderfeld="${k}"><span>${h(label)}</span><div class="fotos">${(wert || []).map((b, i) => `<div class="foto"><img src="${bildadr(b)}" alt="">${i === 0 ? '<i>Erstes</i>' : `<button class="foto__v" type="button" data-akt="fvor" data-k="${k}" data-i="${i}">Nach vorn</button>`}<button class="foto__x" type="button" data-akt="fweg" data-k="${k}" data-i="${i}" aria-label="Foto entfernen">${SYM.zu}</button></div>`).join('')}
      ${(wert || []).length < 24 ? `<button class="foto foto--neu" type="button" data-akt="fneu" data-k="${k}"><b>+</b><span>Foto hinzufügen</span></button>` : ''}</div><small>Das erste Foto steht auf der Karte, alle zusammen öffnen sich zum Blättern.</small></div>`;
  return `<label class="feld"><span>${h(label)}</span><input id="${id}" maxlength="400" value="${h(wert ?? '')}"></label>`;
}
function listeFenster(key, i, vorlage) {
  const g = ZS.listen[key], neu = i === undefined, st = neu ? { ...(vorlage || {}) } : JSON.parse(JSON.stringify(g.liste[i]));
  const wort = WORTE[key] || 'Eintrag';
  g.felder.forEach(f => { if (['bilder', 'mehrfach', 'liste'].includes(f[2]) && !Array.isArray(st[f[0]])) st[f[0]] = []; });
  fenster(`<h2>${neu ? `${h(wort)} <em>hinzufügen.</em>` : `${h(wort)} <em>bearbeiten.</em>`}</h2><p class="form2__ort" style="margin-top:6px">${h(g.label)}</p>
    <div class="form1">${g.felder.map((f, n) => feldH(f, st[f[0]], 'lf-' + n, neu)).join('')}</div>
    <div class="fehler" id="lf-f" role="alert"></div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="lf-ok">${neu ? 'Hinzufügen' : 'Speichern'}<i>${PF}</i></button></div>`, true);
  const f = $('#fenster');
  const lies = () => { g.felder.forEach((fd, n) => { const el = $('#lf-' + n); if (!el) return; st[fd[0]] = fd[2] === 'liste' ? el.value.split('\n').map(x => x.trim()).filter(Boolean) : el.value; }); };
  const neuMal = fd => { lies(); const el = $(`[data-bildfeld="${fd[0]}"],[data-bilderfeld="${fd[0]}"]`, f); if (el) el.outerHTML = feldH(fd, st[fd[0]], '', neu); };
  f.bei = ev => { st[ev.detail.name] = ev.detail.wert; };
  f.onclick = async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const fd = g.felder.find(x => x[0] === b.dataset.k), akt = b.dataset.akt, n = +b.dataset.i;
    if (!fd) return;
    lies();
    if (akt === 'foto') return bildWahl(k => { st[fd[0]] = k; neuMal(fd); });
    if (akt === 'ohnefoto') { st[fd[0]] = ''; neuMal(fd); }
    if (akt === 'fneu') return bildWahl(k => { st[fd[0]] = (st[fd[0]] || []).concat([k]); neuMal(fd); });
    if (akt === 'fweg') { st[fd[0]].splice(n, 1); neuMal(fd); }
    if (akt === 'fvor') { st[fd[0]].unshift(st[fd[0]].splice(n, 1)[0]); neuMal(fd); }
  };
  $('#lf-ok').addEventListener('click', async ev => {
    lies();
    const fe = $('#lf-f');
    fe.textContent = '';
    if (!listeName(st, g)) { fe.textContent = 'Bitte mindestens den Namen ausfüllen.'; return; }
    const alt = g.liste.map(x => ({ ...x })), liste = alt.map(x => ({ ...x }));
    if (neu) liste.push(st); else liste[i] = st;
    ev.target.disabled = true;
    const ok = await tun({ art: 'liste', key, liste }, { titel: neu ? `${wort} hinzugefügt` : `${wort} gespeichert`, text: `${listeName(st, g)} · ${g.label}`, id: 'l:' + key, zurueck: { art: 'liste', key, liste: alt } });
    ev.target.disabled = false;
    if (!ok) return;
    fensterZu();
    BLITZ = key + ':' + (neu ? liste.length - 1 : i);
    const ziel = Object.entries(LISTEN).find(([, a]) => a.keys.includes(key));
    if (W) neuLaden({}); else if (ziel && location.hash !== '#/' + ziel[0]) location.hash = '#/' + ziel[0]; else neuZeichnen();
  });
  const erstes = $('#lf-0:not([type=hidden])') || $('#lf-1');
  if (erstes) erstes.focus();
}

// ---------------------------------------------------------------- Bilder
function bilder(filter) {
  const wahl = [['', 'Alle']].concat(ZS.seiten.filter(s => s.gruppe !== 'Rechtliches').map(s => [s.datei, s.name]));
  const liste = ZS.bilder.filter(b => !filter || b.seiten.some(s => s.datei === filter));
  sicht.innerHTML = `<div class="in">${kopf('Die <em>Bilder.</em>', 'Jedes Foto der Website. Klicken Sie auf ein Bild, wählen Sie ein neues und bestätigen Sie. Es ändert sich dann überall, wo es zu sehen ist.')}
    <div class="filter">${wahl.map(([d, n]) => `<button type="button" data-f="${h(d)}" class="${(filter || '') === d ? 'an' : ''}">${h(n)}</button>`).join('')}</div>
    <div class="mauer">${liste.map(b => `<button class="bk" type="button" data-key="${h(b.key)}"><img src="${b.neu ? bildadr(b.neu) : h(/-s\.webp$/.test(b.adresse) ? b.adresse.replace(/[^/]*-s\.webp$/, m => 't/' + m.replace('-s.webp', '.webp')) : b.adresse)}" alt="" loading="lazy">${b.neu ? '<i>Getauscht</i>' : ''}<span>${mal(b.seiten.length, 'Seite', 'Seiten')}</span><em>Tauschen</em></button>`).join('')}</div></div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const f = ev.target.closest('[data-f]'), k = ev.target.closest('[data-key]');
    if (f) location.hash = '#/bilder' + (f.dataset.f ? '/' + encodeURIComponent(f.dataset.f) : '');
    if (k) bildFenster(k.dataset.key);
  });
}
function bildFenster(key, neu) {
  const b = ZS.bilder.find(x => x.key === key);
  if (!b) return;
  const jetzt = b.neu ? bildgross(b.neu) : (b.adresse.endsWith('-s.webp') ? bildgross(key) : b.adresse);
  fenster(`<h2>Bild <em>tauschen.</em></h2>
    ${neu ? `<div class="vn vn--bild"><div class="alt"><span>Bisher</span><img src="${jetzt}" alt=""></div><svg viewBox="0 0 22 22"><path d="M3 11h15M13 6l5 5-5 5"/></svg><div class="neu"><span>Neu</span><img src="${h(neu.adresse)}" alt=""></div></div>
      <p>Das neue Bild ersetzt das bisherige auf ${b.seiten.length > 1 ? `<b>${b.seiten.length} Seiten</b>: ${b.seiten.slice(0, 6).map(s => h(s.name)).join(', ')}${b.seiten.length > 6 ? ' …' : ''}` : `der Seite <b>${h((b.seiten[0] || {}).name || '')}</b>`}.${neu.hinweis ? ' ' + h(neu.hinweis) : ''}</p>
      <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn kn--linie" type="button" id="f-anders">Anderes Bild</button><button class="kn" type="button" id="f-ok">Bild übernehmen<i>${PF}</i></button></div>`
    : `<div class="bz"><div class="bz__b"><img src="${jetzt}" alt=""></div>
      <div><p style="margin:0"><b>Zu sehen auf</b></p><ul>${b.seiten.slice(0, 8).map(s => `<li>${h(s.name)}${s.zahl > 1 ? ` (${s.zahl} ×)` : ''}</li>`).join('')}${b.seiten.length > 8 ? `<li>und ${b.seiten.length - 8} weiteren Seiten</li>` : ''}</ul>
        ${b.sonder ? `<p class="hinweis" style="margin-top:14px">Dieses Foto ist das ${b.sonder}. Ein neues Bild wird automatisch abgedunkelt, damit die Schrift darauf lesbar bleibt. Am besten ein Querformat mit mindestens 2400 Pixeln Breite.</p>` : ''}
        <div class="ablage" id="f-ablage" tabindex="0" role="button" style="margin-top:16px"><b>Neues Bild wählen</b><span>oder hierher ziehen · JPG, PNG, WebP</span></div>
        ${b.neu ? '<p style="margin-top:14px;text-align:center"><button class="link" type="button" id="f-alt">Ursprüngliches Bild zurückholen</button></p>' : ''}</div></div>`}`, true);
  const sende = async (wert, titel) => {
    if (await tun({ art: 'bild', key, neu: wert }, { titel, text: mal(b.seiten.length, 'Seite', 'Seiten') + ' betroffen', id: 'b:' + key, zurueck: { art: 'bild', key, neu: b.neu || null } })) { fensterZu(); neuZeichnen(); }
  };
  if (neu) {
    $('#f-ok').addEventListener('click', () => sende(neu.key, 'Bild getauscht'));
    $('#f-anders').addEventListener('click', async () => { const r = await hochladen(key); if (r) bildFenster(key, r); });
  } else {
    ablage($('#f-ablage'), key, r => bildFenster(key, r));
    const alt = $('#f-alt');
    if (alt) alt.addEventListener('click', () => sende(null, 'Ursprüngliches Bild zurückgeholt'));
  }
}

// ---------------------------------------------------------------- Änderungen, Veröffentlichen
function aenderungenS() {
  const cs = nachZeit(), n = cs.length;
  const pfeil = '<svg viewBox="0 0 22 22"><path d="M3 11h15M13 6l5 5-5 5"/></svg>';
  const kern = c => {
    if (c.art === 'bild') return `<div class="vn"><div class="alt"><span>Vorher</span><img src="${h(c.vorher)}" alt=""></div>${pfeil}<div class="neu"><span>Nachher</span><img src="${h(c.nachher)}" alt=""></div></div>`;
    if (c.punkte) return `<ul class="punkte">${c.punkte.map(p => `<li class="${p.was}"><i>${{ neu: 'Neu', weg: 'Entfernt', anders: 'Geändert', reihe: 'Sortiert' }[p.was]}</i><div><b>${h(p.name)}</b> <span>${h(p.text)}</span></div></li>`).join('')}</ul>`;
    if (c.teile) return c.teile.map(t => `<div class="vn"><div class="alt"><span>${h(t.feld)} vorher</span>${h(t.vorher) || '–'}</div>${pfeil}<div class="neu"><span>${h(t.feld)} nachher</span>${h(t.nachher)}</div></div>`).join('');
    return `<div class="vn"><div class="alt"><span>Vorher</span>${h(c.vorher) || '–'}</div>${pfeil}<div class="neu"><span>Nachher</span>${h(c.nachher) || '–'}</div></div>`;
  };
  const karteC = c => `<article class="aend" data-id="${h(c.id)}"><div class="aend__z">${ZE(ARTZ[c.art] || 'liste')}</div>
    <div><h3>${h(c.titel)}<small>${h(c.ort || '')}${c.zeit ? ' · gespeichert ' + vor(c.zeit) : ''}</small></h3>${kern(c)}
      ${c.verwaist ? '<p class="hinweis" style="margin-top:14px">Diese Stelle gibt es auf der Seite nicht mehr. Die Änderung hat deshalb keine Wirkung.</p>' : ''}
      ${c.seiten.length ? `<div class="wo"><span>${c.anzahl > 1 ? mal(c.anzahl, 'Stelle', 'Stellen') + ' auf' : 'Steht auf'}</span>${c.seiten.slice(0, 9).map(s => `<button type="button" data-akt="sehen" data-seite="${h(s.datei)}">${h(s.name)}${s.zahl > 1 ? `<b>${s.zahl}</b>` : ''}</button>`).join('')}${c.seiten.length > 9 ? `<span>und ${c.seiten.length - 9} weiteren</span>` : ''}</div>` : ''}</div>
    <div class="aend__r">${c.stellen.length ? '<button class="kn kn--klein" type="button" data-akt="sehen">Vorher/Nachher ansehen</button>' : ''}<button class="link" type="button" data-akt="weg">Zurücknehmen</button></div></article>`;
  sicht.innerHTML = `<div class="in">${kopf('Ihre <em>Änderungen.</em>', n ? 'Das ist im Entwurf gespeichert. Schauen Sie sich jede Stelle vorher und nachher an. Erst mit «Veröffentlichen» sehen es Ihre Gäste.' : '',
      n ? `<button class="kn kn--linie" type="button" data-akt="alles">Alles zurücknehmen</button><button class="kn" type="button" data-akt="raus">${mal(n, 'Änderung', 'Änderungen')} veröffentlichen<i>${PF}</i></button>` : '')}
    ${n ? cs.map(karteC).join('') : `<div class="leerbild">${CE}<b>Nichts offen.</b><p>Alles, was Sie geändert haben, steht auf der Website.</p><a class="kn" href="#/uebersicht">Zur Übersicht<i>${PF}</i></a></div>`}</div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b || !['sehen', 'weg'].includes(b.dataset.akt)) return;
    ev.stopPropagation();
    aktAenderung(b.dataset.akt, b.closest('.aend').dataset.id, b.dataset.seite);
  });
}
function veroeffentlichen() {
  const cs = nachZeit(), n = cs.length;
  if (!n) return;
  const offenSp = ZS.sprachen_offen_zahl;
  fenster(`<h2>Auf die Website <em>stellen?</em></h2><p>${mal(n, 'Änderung wird', 'Änderungen werden')} sofort für alle sichtbar, auf Deutsch, Englisch und Französisch. Jeden früheren Stand können Sie im Verlauf zurückholen.</p>
    ${offenSp ? `<p class="hinweis" style="margin-top:12px">${mal(offenSp, 'Textstück steht', 'Textstücke stehen')} in Englisch oder Französisch noch auf Deutsch. Sie können jetzt veröffentlichen und die Übersetzungen später unter «Sprachen» nachtragen.</p>` : ''}
    <ul class="quittliste">${cs.map(c => `<li>${ZE(ARTZ[c.art] || 'liste')}<span>${h(c.satz)}</span></li>`).join('')}</ul>
    <label class="feld" style="margin-top:18px"><span>Notiz für den Verlauf (freiwillig)</span><input id="f-notiz" maxlength="200" placeholder="z. B. Winterpreise"></label>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="f-ok">Jetzt veröffentlichen<i>${PF}</i></button></div>`);
  $('#f-ok').addEventListener('click', async ev => {
    ev.target.disabled = true;
    ev.target.textContent = 'Wird veröffentlicht …';
    try {
      ZS = await api('veroeffentlichen', { notiz: $('#f-notiz').value });
      rand();
      leiste();
      fenster(`<div class="erfolg"><i>${HAKEN}</i><h2>Veröffent<em>licht.</em></h2><p>Die Website zeigt jetzt den neuen Stand. Das ist live:</p></div>
        <ul class="quittliste ok">${cs.map(c => `<li><i>${HAKEN}</i><span>${h(c.satz)}</span></li>`).join('')}</ul>
        <div class="fenster__kn"><a class="kn kn--linie" href="/live/index.html" target="_blank" rel="noopener">Website ansehen</a><button class="kn" type="button" data-zu>Fertig<i>${PF}</i></button></div>`);
      if (W) neuLaden({}); else zeige(true);
    } catch (e) { sag(e.message, true); ev.target.disabled = false; ev.target.textContent = 'Jetzt veröffentlichen'; }
  });
}

// ---------------------------------------------------------------- Hinweis für Gäste
function hinweisS() {
  const hw = ZS.hinweis, aktiv = hw.an && hw.text;
  sicht.innerHTML = `<div class="in">${kopf('Hinweis für <em>Gäste.</em>', 'Ein Streifen ganz oben auf jeder Seite: Betriebsferien, Umbau, geschlossene Gesellschaft. Sie können ihn zeitlich begrenzen, dann verschwindet er von selbst.')}
    <section class="blatt" style="max-width:760px"><div class="form1">
      ${schalter('hw-an', hw.an, 'Hinweis zeigen')}
      <label class="feld"><span>Text</span><textarea id="hw-text" rows="2" maxlength="300" placeholder="z. B. Vom 3. bis 10. November bleibt das Wellnessdörfli wegen Revision geschlossen.">${h(hw.text)}</textarea></label>
      <div class="raster r-2"><label class="feld"><span>Zeigen ab (freiwillig)</span><input id="hw-von" type="date" value="${h(hw.von)}"></label><label class="feld"><span>Zeigen bis (freiwillig)</span><input id="hw-bis" type="date" value="${h(hw.bis)}"></label></div>
      <div class="raster r-2"><label class="feld"><span>Link (freiwillig)</span><select id="hw-link"><option value="">Kein Link</option>${ZS.seiten.map(s => `<option value="${h(s.datei)}"${hw.link === s.datei ? ' selected' : ''}>${h(s.name)}</option>`).join('')}</select></label><label class="feld"><span>Beschriftung des Links</span><input id="hw-lt" maxlength="60" value="${h(hw.linktext)}" placeholder="Mehr"></label></div>
      <div class="feld"><span>So sieht es aus</span><div class="hwvor${aktiv ? '' : ' aus'}" id="hw-vor"></div></div>
      <div class="sichern offen" style="position:static;margin:0"><i></i><span id="hw-stand"></span><button class="kn kn--klein" type="button" id="hw-ok">Speichern</button></div>
    </div></section></div>`;
  const vor = () => { const t = $('#hw-text').value.trim(), lt = $('#hw-lt').value.trim() || 'Mehr', an = $('#hw-an').checked; $('#hw-vor').className = 'hwvor' + (an && t ? '' : ' aus'); $('#hw-vor').innerHTML = `${CE}<p>${h(t || 'Ihr Hinweis …')}${$('#hw-link').value ? ` <a>${h(lt)}</a>` : ''}</p>`; $('#hw-stand').textContent = an && t ? 'Wird oben auf jeder Seite gezeigt' : 'Ausgeschaltet, nichts zu sehen'; };
  vor();
  sicht.querySelector('.in').addEventListener('input', vor);
  $('#hw-ok').addEventListener('click', async () => {
    const neu = { an: $('#hw-an').checked, text: $('#hw-text').value, von: $('#hw-von').value, bis: $('#hw-bis').value, link: $('#hw-link').value, linktext: $('#hw-lt').value };
    if (await tun({ art: 'hinweis', hinweis: neu }, { titel: neu.an && neu.text.trim() ? 'Hinweis gespeichert' : 'Hinweis ausgeschaltet', text: neu.text.trim().slice(0, 80), id: 'h:hinweis', zurueck: { art: 'hinweis', hinweis: hw } })) neuZeichnen();
  });
}

// ---------------------------------------------------------------- Menü & eigene Seiten
function menueS() {
  const nav = ZS.nav, bekannt = ZS.seiten.map(s => [s.datei, s.name]).concat(Object.entries(ZS.eigene_seiten).map(([k, p]) => [k + '.html', p.titel]));
  const name = hf => (bekannt.find(([d]) => d === hf) || [hf, hf])[1];
  sicht.innerHTML = `<div class="in">${kopf('Menü <em>& Seiten.</em>', 'Das Hauptmenü oben auf jeder Seite und Ihre eigenen Seiten. Eine neue Seite bekommt Foto, Einleitung und Abschnitte und kann ins Menü.', `<button class="kn" type="button" data-akt="seite-neu">Neue Seite<i>${PF}</i></button>`)}
    <h2 class="zw" style="margin-top:0">Hauptmenü</h2>
    <section class="blatt gruppe" data-nav><div class="gruppe__k"><h3>Menüpunkte<span>${String(nav.filter(x => !x.aus).length).padStart(2, '0')}</span></h3><button class="kn kn--klein" type="button" data-akt="nav-neu">Menüpunkt hinzufügen</button></div>
      <p class="gruppe__hin">In der Leiste stehen die sichtbaren Punkte; im aufgeklappten Menü stehen alle Seiten, auch die ausgeblendeten.</p>
      <div class="zeilen">${nav.map((x, i) => `<div class="gz gz--nav${x.aus ? ' aus' : ''}" data-i="${i}">${window.seitenBild && window.seitenBild(x.h) ? `<span class="gz__b" aria-hidden="true"><img src="${window.seitenBild(x.h)}" alt="" loading="lazy" decoding="async"></span>` : ''}<span class="gz__t"><input class="n" value="${h(x.t)}" maxlength="40" aria-label="Beschriftung"><span>${h(name(x.h))}</span></span><span class="gz__s"></span><span class="gz__p"></span>
        <div class="gz__r"><button class="rund" type="button" data-akt="hoch" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" aria-label="Nach unten"${i === nav.length - 1 ? ' disabled' : ''}>${SYM.runter}</button><button class="rund" type="button" data-akt="aus" aria-label="${x.aus ? 'Zeigen' : 'Ausblenden'}" title="${x.aus ? 'In der Leiste zeigen' : 'Aus der Leiste nehmen'}">${x.aus ? SYM.augezu : SYM.auge}</button></div></div>`).join('')}</div>
      <div class="gruppe__f"><span class="leise" style="font-size:13.5px">Die Beschriftung ändern Sie direkt in der Zeile.</span><div class="sichern offen" style="position:static;margin:0 0 0 auto"><i></i><span>Menü</span><button class="kn kn--klein" type="button" data-akt="nav-ok">Speichern</button></div></div></section>
    <h2 class="zw">Eigene Seiten<span>${String(Object.keys(ZS.eigene_seiten).length).padStart(2, '0')}</span></h2>
    <div class="raster r-4">${Object.entries(ZS.eigene_seiten).map(([slug, p]) => `<button class="sk" type="button" data-akt="seite" data-slug="${h(slug)}"><span class="sk__b">${p.bild ? `<img src="${bildadr(p.bild)}" alt="">` : ''}</span><span class="sk__t"><b>${h(p.titel)}</b><span>${slug}.html${ZS.nav.some(x => x.h === slug + '.html' && !x.aus) ? ' · im Menü' : ''}</span></span></button>`).join('')}
      <button class="pk pk--neu" type="button" data-akt="seite-neu" style="min-height:200px"><i>+</i><b>Neue Seite</b><span>mit Foto, Text und Abschnitten</span></button></div></div>`;
  const wurzel = sicht.querySelector('.in');
  const liesNav = () => $$('[data-nav] .gz').map(z => ({ t: $('.n', z).value.trim(), h: nav[+z.dataset.i].h, aus: z.classList.contains('aus') }));
  wurzel.addEventListener('click', async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const akt = b.dataset.akt, z = b.closest('.gz');
    if (akt === 'seite-neu') return seiteFenster();
    if (akt === 'seite') return seiteFenster(b.dataset.slug);
    if (akt === 'nav-neu') {
      const frei = bekannt.filter(([d]) => !nav.some(x => x.h === d));
      fenster(`<h2>Menüpunkt <em>hinzufügen.</em></h2><label class="feld" style="margin-top:18px"><span>Seite</span><select id="nv-h">${frei.map(([d, n]) => `<option value="${h(d)}">${h(n)}</option>`).join('')}</select></label><label class="feld" style="margin-top:14px"><span>Beschriftung im Menü</span><input id="nv-t" maxlength="40"></label>
        <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="nv-ok">Hinzufügen<i>${PF}</i></button></div>`);
      $('#nv-h').addEventListener('change', () => { $('#nv-t').value = name($('#nv-h').value); });
      $('#nv-t').value = frei.length ? name(frei[0][0]) : '';
      $('#nv-ok').addEventListener('click', async () => { const l = liesNav().concat([{ t: $('#nv-t').value.trim() || name($('#nv-h').value), h: $('#nv-h').value, aus: false }]); if (await tun({ art: 'nav', liste: l }, { titel: 'Menüpunkt hinzugefügt', text: l[l.length - 1].t, zurueck: { art: 'nav', liste: nav } })) { fensterZu(); neuZeichnen(); } });
      return;
    }
    const l = liesNav(), i = z ? +z.dataset.i : -1;
    if (akt === 'hoch' && i > 0) [l[i - 1], l[i]] = [l[i], l[i - 1]];
    else if (akt === 'runter' && i >= 0 && i < l.length - 1) [l[i + 1], l[i]] = [l[i], l[i + 1]];
    else if (akt === 'aus' && i >= 0) l[i].aus = !l[i].aus;
    else if (akt !== 'nav-ok') return;
    if (await tun({ art: 'nav', liste: l }, { titel: 'Menü gespeichert', text: l.filter(x => !x.aus).map(x => x.t).join(' · '), zurueck: { art: 'nav', liste: nav } })) neuZeichnen();
  });
}
function seiteFenster(slug) {
  const neu = !slug, p0 = neu ? null : ZS.eigene_seiten[slug];
  const st = neu ? { titel: '', kopfz: '', h1: '', intro: '', beschr: '', bild: null, im_menue: true, abschnitte: [{ u: '', t: '', b: null }] } : JSON.parse(JSON.stringify(p0));
  if (!neu) st.im_menue = ZS.nav.some(x => x.h === slug + '.html' && !x.aus);
  fenster(`<h2>${neu ? 'Neue <em>Seite.</em>' : 'Seite <em>bearbeiten.</em>'}</h2>${neu ? '' : `<p class="form2__ort" style="margin-top:6px">${h(slug)}.html</p>`}
    <div class="form1">
      <div class="raster r-2"><label class="feld"><span>Titel der Seite</span><input id="ps-titel" maxlength="80" value="${h(st.titel)}" placeholder="z. B. Konzerte"></label><label class="feld"><span>Kleine Zeile (für Google)</span><input id="ps-kopfz" maxlength="60" value="${h(st.kopfz)}" placeholder="z. B. Musik im Haus"></label></div>
      <label class="feld"><span>Grosse Überschrift</span><input id="ps-h1" maxlength="120" value="${h(st.h1)}" placeholder="Leer = Titel der Seite"><small>Ein senkrechter Strich | teilt die Zeilen; die letzte Zeile steht in Gold.</small></label>
      <label class="feld"><span>Einleitung</span><textarea id="ps-intro" rows="3" maxlength="600">${h(st.intro)}</textarea></label>
      <div class="feld" id="ps-bild"></div>
      <div class="feld"><span>Abschnitte</span><div id="ps-abs"></div><button class="link" type="button" data-akt="abs-neu" style="justify-self:start;margin-top:8px">Abschnitt hinzufügen</button></div>
      ${schalter('ps-menue', st.im_menue, 'Im Hauptmenü zeigen')}
      <label class="feld"><span>Beschreibung bei Google (freiwillig)</span><input id="ps-beschr" maxlength="320" value="${h(st.beschr)}"></label>
    </div>
    <div class="fehler" id="ps-f" role="alert"></div>
    <div class="fenster__kn">${neu ? '' : '<button class="link" type="button" id="ps-weg" style="margin-right:auto">Seite löschen</button>'}<button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="ps-ok">${neu ? 'Seite anlegen' : 'Speichern'}<i>${PF}</i></button></div>`, true);
  const f = $('#fenster');
  const lies = () => { st.titel = $('#ps-titel').value.trim(); st.kopfz = $('#ps-kopfz').value.trim(); st.h1 = $('#ps-h1').value.trim(); st.intro = $('#ps-intro').value; st.beschr = $('#ps-beschr').value.trim(); st.im_menue = $('#ps-menue').checked; $$('.abs', f).forEach((a, i) => { st.abschnitte[i].u = $('.abs-u', a).value.trim(); st.abschnitte[i].t = $('.abs-t', a).value; }); };
  const mal2 = () => {
    $('#ps-bild').innerHTML = `<span>Foto im Seitenkopf</span><div class="fotowahl">${st.bild ? `<img src="${bildadr(st.bild)}" alt="">` : `<div class="fotowahl__leer">${CE}</div>`}<div><button class="kn kn--klein kn--linie" type="button" data-akt="foto">${st.bild ? 'Anderes Foto' : 'Foto wählen'}</button>${st.bild ? '<button class="link" type="button" data-akt="ohnefoto">Ohne Foto</button>' : ''}</div></div>`;
    $('#ps-abs').innerHTML = st.abschnitte.map((a, i) => `<div class="abs" data-i="${i}"><div class="abs__k"><b>Abschnitt ${i + 1}</b><button class="link" type="button" data-akt="abs-weg" data-i="${i}">Entfernen</button></div><input class="abs-u" maxlength="120" value="${h(a.u)}" placeholder="Überschrift"><textarea class="abs-t" rows="4" placeholder="Text. Eine Leerzeile beginnt einen neuen Absatz.">${h(a.t)}</textarea>
      <div class="abs__b">${a.b ? `<img src="${bildadr(a.b)}" alt="">` : ''}<button class="link" type="button" data-akt="abs-foto" data-i="${i}">${a.b ? 'Anderes Foto' : 'Foto zum Abschnitt'}</button>${a.b ? `<button class="link" type="button" data-akt="abs-ohne" data-i="${i}">Ohne Foto</button>` : ''}</div></div>`).join('');
  };
  mal2();
  f.onclick = async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const akt = b.dataset.akt, i = +b.dataset.i;
    lies();
    if (akt === 'foto') return bildWahl(k => { st.bild = k; mal2(); });
    if (akt === 'ohnefoto') st.bild = null;
    else if (akt === 'abs-neu') st.abschnitte.push({ u: '', t: '', b: null });
    else if (akt === 'abs-weg') st.abschnitte.splice(i, 1);
    else if (akt === 'abs-foto') return bildWahl(k => { st.abschnitte[i].b = k; mal2(); });
    else if (akt === 'abs-ohne') st.abschnitte[i].b = null;
    else return;
    mal2();
  };
  const weg = $('#ps-weg');
  if (weg) weg.addEventListener('click', () => frage('Seite <em>löschen?</em>', `«${p0.titel}» verschwindet von der Website und aus dem Menü.`, 'Löschen', async () => { if (await tun({ art: 'seite-weg', slug }, { titel: 'Seite gelöscht', text: p0.titel })) { fensterZu(); neuZeichnen(); } }));
  $('#ps-ok').addEventListener('click', async ev => {
    lies();
    if (!st.titel) { $('#ps-f').textContent = 'Bitte einen Titel eintragen.'; return; }
    ev.target.disabled = true;
    try {
      const davor = new Set(Object.keys(ZS.eigene_seiten));
      await aendern({ art: 'seite', slug: slug || '', seite: st });  // der Server nimmt die Seite in demselben Schritt ins Menü oder heraus (im_menue)
      const ns = slug || Object.keys(ZS.eigene_seiten).find(k => !davor.has(k));
      quittung(neu ? 'Seite angelegt' : 'Seite gespeichert', `${st.titel} · ${ns}.html`, { id: 'p:' + ns, zurueck: neu ? { art: 'seite-weg', slug: ns } : { art: 'seite', slug, seite: p0 } });
      fensterZu();
      if (location.hash.startsWith('#/menue')) neuZeichnen(); else location.hash = '#/menue';
    } catch (e) { $('#ps-f').textContent = e.message; }
    ev.target.disabled = false;
  });
  $('#ps-titel').focus();
}

// ---------------------------------------------------------------- Sprachen
function sprachenS(filter) {
  const alle = ZS.sprachen_offen, seiten = [...new Set(alle.flatMap(o => o.seiten.map(s => s.datei)))];
  const liste = alle.filter(o => !filter || o.seiten.some(s => s.datei === filter));
  const namen = Object.fromEntries(ZS.seiten.map(s => [s.datei, s.name]));
  sicht.innerHTML = `<div class="in">${kopf('Die <em>Sprachen.</em>', `Die Website gibt es auf Deutsch, Englisch und Französisch. Was Sie auf Deutsch ändern oder neu anlegen, steht in den anderen Sprachen zuerst auf Deutsch. Hier tragen Sie die Übersetzung ein. ${ZS.sprachen_offen_zahl ? `<b>${mal(ZS.sprachen_offen_zahl, 'Stück wartet', 'Stücke warten')}.</b>` : '<b>Alles ist übersetzt.</b>'}`,
      `<a class="kn kn--linie" href="/entwurf/en/index.html" target="_blank" rel="noopener">Englisch ansehen</a><a class="kn kn--linie" href="/entwurf/fr/index.html" target="_blank" rel="noopener">Französisch ansehen</a>`)}
    ${seiten.length > 1 ? `<div class="filter"><button type="button" data-f="" class="${filter ? '' : 'an'}">Alle</button>${seiten.map(d => `<button type="button" data-f="${h(d)}" class="${filter === d ? 'an' : ''}">${h(namen[d] || d)}</button>`).join('')}</div>` : ''}
    ${liste.length ? `<section class="blatt" style="padding:4px 0">${liste.map((o, i) => `<div class="wort" data-i="${i}"><div class="wort__de"><span>Deutsch</span><p>${h(o.de)}</p><small>${o.seiten.map(s => h(s.name)).join(', ')}</small></div>
        <label class="feld"><span>Englisch${o.fehlt.includes('en') ? ' <i class="marke gold">fehlt</i>' : ''}</span><textarea data-sp="en" rows="2">${h(o.en)}</textarea></label>
        <label class="feld"><span>Französisch${o.fehlt.includes('fr') ? ' <i class="marke gold">fehlt</i>' : ''}</span><textarea data-sp="fr" rows="2">${h(o.fr)}</textarea></label></div>`).join('')}
      <div class="gruppe__f"><span class="leise" style="font-size:13.5px">${liste.length} von ${ZS.sprachen_offen_zahl}${ZS.sprachen_offen_zahl > 600 ? ' (die ersten 600)' : ''}</span><div class="sichern offen" style="position:static;margin:0 0 0 auto"><i></i><span>Übersetzungen</span><button class="kn kn--klein" type="button" data-akt="woerter-ok">Alle speichern</button></div></div></section>`
    : `<div class="leerbild">${CE}<b>Alles übersetzt.</b><p>Sobald Sie auf Deutsch etwas ändern, steht es hier zum Übersetzen bereit.</p></div>`}</div>`;
  const wurzel = sicht.querySelector('.in');
  offen = () => $$('.wort textarea', wurzel).some(t => t.value.trim() !== (liste[+t.closest('.wort').dataset.i][t.dataset.sp] || ''));
  wurzel.addEventListener('click', async ev => {
    const f = ev.target.closest('[data-f]'), b = ev.target.closest('[data-akt="woerter-ok"]');
    if (f) { location.hash = '#/sprachen' + (f.dataset.f ? '/' + encodeURIComponent(f.dataset.f) : ''); return; }
    if (!b) return;
    const paare = { en: {}, fr: {} };
    let n = 0;
    $$('.wort', wurzel).forEach(w => { const o = liste[+w.dataset.i]; $$('textarea', w).forEach(t => { if (t.value.trim() !== (o[t.dataset.sp] || '')) { paare[t.dataset.sp][o.de] = t.value.trim(); n++; } }); });
    if (!n) { sag('Nichts geändert, nichts gespeichert.'); return; }
    b.disabled = true;
    let ok = true;
    for (const sp of ['en', 'fr']) if (Object.keys(paare[sp]).length) ok = await tun({ art: 'woerter', sprache: sp, paare: paare[sp] }) && ok;
    b.disabled = false;
    if (ok) { quittung(mal(n, 'Übersetzung', 'Übersetzungen') + ' gespeichert', '', { id: 'w:' + (Object.keys(paare.en).length ? 'en' : 'fr') }); offen = null; neuZeichnen(); }
  });
}

// ---------------------------------------------------------------- Google-Texte und Bildbeschreibungen
function googleS(filter) {
  const seiten = ZS.seiten;
  const datei = filter && ZS.seo[filter] ? filter : 'index.html', so = ZS.seo[datei], sd = ZS.seiten.find(s => s.datei === datei);
  const alts = Object.entries(ZS.alt).filter(([k]) => ZS.bilder.some(b => b.key === k && b.seiten.some(x => x.datei === datei)));
  sicht.innerHTML = `<div class="in">${kopf('Google <em>& Co.</em>', 'Was Google und andere Suchmaschinen über jede Seite zeigen, und die Beschreibung jedes Bildes für Menschen, die nicht sehen können.')}
    <div class="filter">${seiten.map(s => `<button type="button" data-f="${h(s.datei)}" class="${s.datei === datei ? 'an' : ''}">${h(s.name)}</button>`).join('')}</div>
    <section class="blatt" style="max-width:820px"><h3>Bei Google: ${h(sd ? sd.name : datei)}</h3><div class="form1" style="margin-top:16px">
      <label class="feld"><span>Titel (so steht es im Browser-Reiter und bei Google)</span><input id="se-titel" maxlength="120" value="${h(so.eigen.titel || '')}" placeholder="${h(so.titel)}"><small><span id="se-tz">${(so.eigen.titel || so.titel).length}</span> Zeichen, bis 60 sind ideal</small></label>
      <label class="feld"><span>Beschreibung (die zwei Zeilen unter dem Titel)</span><textarea id="se-beschr" rows="3" maxlength="320" placeholder="${h(so.beschr)}">${h(so.eigen.beschr || '')}</textarea><small><span id="se-bz">${(so.eigen.beschr || so.beschr).length}</span> Zeichen, bis 155 sind ideal · leer lassen heisst: Vorgabe behalten</small></label>
      <div class="gvor"><b id="gv-t">${h(so.eigen.titel || so.titel)}</b><i>carltoneurope.ch › ${h(datei.replace('.html', ''))}</i><p id="gv-b">${h(so.eigen.beschr || so.beschr)}</p></div>
      <div class="sichern offen" style="position:static;margin:0"><i></i><span>Google-Text</span><button class="kn kn--klein" type="button" id="se-ok">Speichern</button></div></div></section>
    <h2 class="zw">Bildbeschreibungen<span>${String(alts.length).padStart(2, '0')}</span></h2>
    <section class="blatt" style="padding:4px 0">${alts.map(([k, a]) => `<div class="ware" data-alt="${h(k)}"><img src="${bildadr(k)}" alt=""><label class="feld"><span>Beschreibung${a.eigen ? ' <i class="marke gold">Im Entwurf geändert</i>' : ''}</span><input maxlength="200" value="${h(a.eigen || '')}" placeholder="${h(a.standard || 'Was ist auf dem Bild zu sehen?')}"></label><button class="kn kn--klein kn--linie" type="button" data-akt="alt-ok">Speichern</button></div>`).join('') || '<p class="gz leer">Auf dieser Seite gibt es keine Bilder.</p>'}</section></div>`;
  const wurzel = sicht.querySelector('.in');
  wurzel.addEventListener('input', () => { const t = $('#se-titel').value.trim() || so.titel, b = $('#se-beschr').value.trim() || so.beschr; $('#gv-t').textContent = t; $('#gv-b').textContent = b; $('#se-tz').textContent = t.length; $('#se-bz').textContent = b.length; });
  wurzel.addEventListener('click', async ev => {
    const f = ev.target.closest('[data-f]'), b = ev.target.closest('[data-akt]');
    if (f) { location.hash = '#/google/' + encodeURIComponent(f.dataset.f); return; }
    if (!b) return;
    if (b.dataset.akt === 'alt-ok') { const z = b.closest('[data-alt]'), k = z.dataset.alt, alt = ZS.alt[k].eigen; if (await tun({ art: 'alt', key: k, text: $('input', z).value }, { titel: 'Bildbeschreibung gespeichert', text: $('input', z).value.trim().slice(0, 80) || 'Vorgabe', id: 'a:' + k, zurueck: { art: 'alt', key: k, text: alt } })) neuZeichnen(); }
  });
  $('#se-ok').addEventListener('click', async () => { if (await tun({ art: 'seo', datei, titel: $('#se-titel').value, beschr: $('#se-beschr').value }, { titel: 'Google-Text gespeichert', text: sd ? sd.name : datei, id: 'g:' + datei, zurueck: { art: 'seo', datei, titel: so.eigen.titel || '', beschr: so.eigen.beschr || '' } })) neuZeichnen(); });
}

// ---------------------------------------------------------------- Eingang (Formulare der Website)
function eingangS(filter) {
  const alle = ZS.eingang, liste = alle.filter(x => !filter || x.formular === filter), neu = alle.filter(x => !x.gelesen).length, anEingang = ZS.formular_ziel === 'eingang';
  const wert = v => h(String(v));
  const karte = x => `<article class="post${x.gelesen ? '' : ' neu'}" data-id="${h(x.id)}"><div class="post__k"><span class="lade__z">${ZE({ bewerbung: 'person', newsletter: 'post', gutschein: 'geschenk', anlass: 'saal' }[x.formular] || 'post')}</span>
      <div><b>${h(ZS.formulare[x.formular] || x.formular)}${x.gelesen ? '' : ' <i class="marke gold">Neu</i>'}</b><small>${datum(x.zeit)}${x.seite ? ' · von ' + h(x.seite) : ''}</small></div>
      <div class="post__a"><button class="rund" type="button" data-akt="${x.gelesen ? 'ungelesen' : 'gelesen'}" title="${x.gelesen ? 'Als neu markieren' : 'Als gelesen markieren'}" aria-label="Gelesen">${x.gelesen ? SYM.augezu : SYM.auge}</button><button class="rund" type="button" data-akt="weg" title="Löschen" aria-label="Löschen">${SYM.korb}</button></div></div>
      <dl class="post__f">${Object.entries(x.felder).filter(([k, v]) => v !== '' && !/^(website|fax)$/.test(k)).map(([k, v]) => `<div><dt>${h(k)}</dt><dd>${wert(v)}</dd></div>`).join('')}
      ${x.anhaenge.length ? `<div><dt>Anhang</dt><dd>${x.anhaenge.map(a => `<a class="link" href="/control/api/anhang?datei=${encodeURIComponent(a.datei)}">${h(a.name)} (${a.kb} kB)</a>`).join(' · ')}</dd></div>` : ''}
      ${x.weitergeleitet ? `<div><dt>Weitergeleitet</dt><dd>${h(String(x.weitergeleitet.status))} · ${datum(x.weitergeleitet.zeit)}</dd></div>` : ''}</dl></article>`;
  sicht.innerHTML = `<div class="in">${kopf('Der <em>Eingang.</em>', `Alles, was Gäste über die Formulare der Website schicken: Nachrichten, Anfragen für Tagen & Feiern, Gutschein-Bestellungen, Bewerbungen und Newsletter-Anmeldungen. ${neu ? `<b>${mal(neu, 'neuer Eintrag', 'neue Einträge')}.</b>` : 'Nichts Neues.'}`, `<button class="kn kn--linie" type="button" data-akt="einstellungen">Weiterleitung einrichten</button>`)}
    <section class="blatt" style="margin-bottom:22px"><div class="form1" style="margin-top:0">${schalter('ei-an', anEingang, 'Formulare in den Eingang leiten')}
      <p class="gruppe__hin" style="padding:0">${anEingang ? 'Eingeschaltet: Was Gäste abschicken, liegt hier im Eingang. Scheitert die Übertragung, öffnet sich wie bisher das Mailprogramm.' : 'Ausgeschaltet: Jedes Formular öffnet das Mailprogramm des Gastes mit einer fertigen Mail an ' + h(ZS.felder['haus.mail'].wert) + '. Schalten Sie ein, landen die Einsendungen hier.'} Die Änderung wird mit dem nächsten Veröffentlichen wirksam.</p></div></section>
    <div class="filter"><button type="button" data-f="" class="${filter ? '' : 'an'}">Alle</button>${Object.entries(ZS.formulare).map(([k, n]) => `<button type="button" data-f="${k}" class="${filter === k ? 'an' : ''}">${h(n)}${alle.filter(x => x.formular === k && !x.gelesen).length ? `<b>${alle.filter(x => x.formular === k && !x.gelesen).length}</b>` : ''}</button>`).join('')}</div>
    ${liste.length ? liste.map(karte).join('') : `<div class="leerbild">${CE}<b>Noch nichts da.</b><p>Sobald jemand ein Formular auf der Website abschickt${anEingang ? '' : ' und der Eingang eingeschaltet ist'}, steht es hier.</p></div>`}</div>`;
  $('#ei-an').addEventListener('change', async ev => {
    const an = ev.target.checked;
    if (await tun({ art: 'formulare', ziel: an ? 'eingang' : 'mail' }, { titel: an ? 'Formulare gehen in den Eingang' : 'Formulare öffnen die Mail', text: 'Gilt nach dem Veröffentlichen', id: 'fo:formulare', zurueck: { art: 'formulare', ziel: an ? 'mail' : 'eingang' } })) neuZeichnen();
  });
  sicht.querySelector('.in').addEventListener('click', async ev => {
    const f = ev.target.closest('[data-f]'), b = ev.target.closest('[data-akt]');
    if (f) { location.hash = '#/eingang' + (f.dataset.f ? '/' + f.dataset.f : ''); return; }
    if (!b) return;
    if (b.dataset.akt === 'einstellungen') return einstellungenFenster();
    const k = b.closest('.post');
    if (!k) return;
    const tu = async () => { ZS = await api('eingang', { id: k.dataset.id, tun: b.dataset.akt }); rand(); zeige(true); };
    try {
      if (b.dataset.akt === 'weg') frage('Eintrag <em>löschen?</em>', 'Der Eintrag und sein Anhang werden endgültig gelöscht.', 'Löschen', tu);
      else await tu();
    } catch (e) { sag(e.message, true); }
  });
}
// ---------------------------------------------------------------- Das wurde gefragt: Gästefragen aus dem Chat und der Zimmermappe
// Die Fragen liegen online im Speicher hinter /api/fragen (siehe _gast/fragen.js). Was nicht auf der Seite stand, lässt sich mit einem Klick
// als Eintrag in «Gut zu wissen» übernehmen; die Antwort schreibt das Haus selbst, dann geht sie wie jede Änderung über «Veröffentlichen».
let FRAGEN = null;
function woche(z) {
  const d = new Date(z); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const tag = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - tag); const j = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const kw = Math.ceil(((t - j) / 864e5 + 1) / 7), mo = new Date(d); mo.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return { k: t.getUTCFullYear() + '-' + String(kw).padStart(2, '0'), titel: 'Woche ' + kw + ' · ab ' + mo.toLocaleDateString('de-CH', { day: 'numeric', month: 'long' }) };
}
async function gefragtS(filter) {
  filter = filter || 'luecke';
  sicht.innerHTML = `<div class="in">${kopf('Das wurde <em>gefragt.</em>', 'Was Gäste die Rezeption im Chat und in der Zimmermappe fragen, Woche für Woche. Fragen, zu denen nichts auf der Website steht, sind markiert: Ein Klick macht daraus einen Eintrag in «Gut zu wissen».')}<div class="leerbild">${CE}<b>Einen Moment.</b><p>Die Fragen werden geladen.</p></div></div>`;
  try {
    const r = await fetch('/api/fragen', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    FRAGEN = (await r.json()).fragen || [];
  } catch (e) {
    // Oberchef 17.10.2026: /api/fragen ist ohne Schlüssel gesperrt (401); in der Vorschau bleiben die Fragen geschützt
    if (String(e && e.message) === '401') { $('.in', sicht).innerHTML = kopf('Das wurde <em>gefragt.</em>', '') + `<div class="leerbild">${CE}<b>Geschützt.</b><p>In dieser Vorschau bleiben die Fragen der Gäste geschützt und werden hier nicht angezeigt.</p></div>`; return; }
    $('.in', sicht).innerHTML = kopf('Das wurde <em>gefragt.</em>', '') + `<div class="leerbild">${CE}<b>Nur online.</b><p>Die Gästefragen liegen im Speicher der Online-Fassung. Öffnen Sie Le Bureau unter carlton.tastystudios.ch/control/.</p></div>`;
    return;
  }
  const alle = FRAGEN, luecken = alle.filter(x => !x.belegt && !x.erledigt);
  const liste = filter === 'luecke' ? luecken : filter === 'erledigt' ? alle.filter(x => x.erledigt) : alle;
  const gruppen = [];
  liste.forEach(x => { const w = woche(x.zeit); let g = gruppen.find(y => y.k === w.k); if (!g) { g = { ...w, l: [] }; gruppen.push(g); } g.l.push(x); });
  const karte = x => `<article class="post frage${x.erledigt ? '' : (x.belegt ? '' : ' neu')}" data-id="${h(x.id)}"><div class="post__k"><span class="lade__z">${ZE(x.mappe ? 'bett' : 'frage')}</span>
      <div><b>${h(x.frage)}${!x.belegt && !x.erledigt ? ' <i class="marke gold">Steht nicht auf der Seite</i>' : ''}${x.erledigt ? ' <i class="marke grau">Erledigt</i>' : ''}</b>
      <small>${datum(x.zeit)} · ${x.mappe ? 'Zimmermappe' : 'Website'}${x.sprache && x.sprache !== 'de' ? ' · ' + { en: 'Englisch', fr: 'Französisch' }[x.sprache] : ''}${x.buchung ? ' · Buchungsmaske gezeigt' : ''}${x.thema ? ' · ' + h(x.thema) : ''}</small></div>
      <div class="post__a">${x.erledigt ? `<button class="kn kn--klein kn--linie" type="button" data-akt="offen">Zurückholen</button>` : `${x.belegt ? '' : `<button class="kn kn--klein" type="button" data-akt="uebernehmen">In «Gut zu wissen»<i>${PF}</i></button>`}<button class="kn kn--klein kn--linie" type="button" data-akt="erledigt">Erledigt</button>`}</div></div>
      <details class="frage__a"><summary>Antwort der Rezeption</summary><p>${h(x.antwort).replace(/\n/g, '<br>')}</p></details></article>`;
  const mal = (n, w) => n + ' ' + w + (n === 1 ? '' : (w.endsWith('e') ? 'n' : 'en'));
  $('.in', sicht).innerHTML = kopf('Das wurde <em>gefragt.</em>', `Was Gäste die Rezeption im Chat und in der Zimmermappe fragen, Woche für Woche. ${luecken.length ? `<b>${luecken.length === 1 ? 'Eine Frage steht' : luecken.length + ' Fragen stehen'} nicht auf der Website.</b> Mit «In Gut zu wissen» wird daraus ein Eintrag auf «Kontakt & Anreise»; die Antwort schreiben Sie selbst.` : 'Alles, was gefragt wurde, steht auf der Website.'}`,
      `<button class="kn kn--linie" type="button" data-akt="neu-laden">Neu laden</button>`) +
    `<section class="blatt zahlen-gefragt"><div><b>${alle.length}</b><span>Fragen gesamt</span></div><div><b>${alle.filter(x => !x.belegt).length}</b><span>nicht auf der Seite</span></div><div><b>${alle.filter(x => x.mappe).length}</b><span>aus der Zimmermappe</span></div><div><b>${alle.filter(x => x.buchung).length}</b><span>mit Buchungsmaske</span></div></section>
    <div class="filter"><button type="button" data-f="luecke" class="${filter === 'luecke' ? 'an' : ''}">Nicht auf der Seite${luecken.length ? ` <b>${luecken.length}</b>` : ''}</button><button type="button" data-f="alle" class="${filter === 'alle' ? 'an' : ''}">Alle Fragen</button><button type="button" data-f="erledigt" class="${filter === 'erledigt' ? 'an' : ''}">Erledigt</button></div>
    ${gruppen.length ? gruppen.map(g => `<h2 class="woche">${h(g.titel)}<span>${g.l.length}</span></h2>${g.l.map(karte).join('')}`).join('') : `<div class="leerbild">${CE}<b>${filter === 'luecke' ? 'Keine Lücken.' : 'Noch nichts da.'}</b><p>${filter === 'luecke' ? 'Jede Frage der Gäste liess sich aus der Website beantworten.' : 'Sobald Gäste die Rezeption im Chat fragen, steht es hier.'}</p></div>`}`;
  $('.in', sicht).onclick = async ev => {
    const f = ev.target.closest('[data-f]'), b = ev.target.closest('[data-akt]');
    if (f) { location.hash = '#/gefragt/' + f.dataset.f; return; }
    if (!b) return;
    if (b.dataset.akt === 'neu-laden') return gefragtS(filter);
    const k = b.closest('.frage'), x = k && FRAGEN.find(y => y.id === k.dataset.id);
    if (!x) return;
    if (b.dataset.akt === 'uebernehmen') {
      if (!ZS.listen.fragen) return sag('Die Liste «Gut zu wissen» ist gerade nicht erreichbar.', true);
      listeFenster('fragen', undefined, { frage: x.thema ? x.thema.charAt(0).toUpperCase() + x.thema.slice(1) : x.frage, antwort: '' });
      sag('Schreiben Sie die Antwort, wie sie auf der Website stehen soll. Danach «Erledigt» drücken.');
      return;
    }
    try {
      const r = await fetch('/api/fragen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tun: b.dataset.akt, id: x.id }) });
      if (!r.ok) throw new Error('Das hat nicht geklappt.');
      x.erledigt = b.dataset.akt === 'erledigt';
      quittung(x.erledigt ? 'Erledigt' : 'Zurückgeholt', x.frage);
      gefragtS(filter);
    } catch (e) { sag(e.message, true); }
  };
}

// ---------------------------------------------------------------- Zahlen: was Gäste auf der Website tun (Tasty Studios, 10.10.2026)
// Die Website meldet jedes Ereignis an /api/zahlen (online: _dienste/zahlen.js mit dem Blob-Speicher, am Rechner: _studio/zahlen.jsonl).
// Keine Kekse, keine Adressen, keine Namen: nur Seite, Klick, Zimmer, Package, Formular, Sprache und Land.
async function zahlenS() {
  sicht.innerHTML = `<div class="in">${kopf('Die <em>Zahlen.</em>', 'Was Gäste auf der Website tun: Besuche, Klicks auf «Buchen», gefragte Zimmer, Packages und Anfragen der letzten 30 Tage.')}<div class="leerbild">${CE}<b>Einen Moment.</b><p>Die Zahlen werden geladen.</p></div></div>`;
  let ev;
  try {
    const r = await fetch('/api/zahlen', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    ev = (await r.json()).ereignisse || [];
  } catch (e) {
    $('.in', sicht).innerHTML = kopf('Die <em>Zahlen.</em>', '') + `<div class="leerbild">${CE}<b>Gerade nicht erreichbar.</b><p>Die Zahlen liegen im Speicher der Website. Bitte später noch einmal öffnen.</p></div>`;
    return;
  }
  const n = t => ev.filter(e => e.t === t).length;
  const zaehle = (L, f) => { const m = {}; L.forEach(e => { const k = f(e); if (k) m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  const ZIMMER = { einzel: 'Einzelzimmer', classic: 'Classic-Zimmer', superior: 'Superior-Zimmer', signature: 'Signature-Suite', dreier: 'Superior-Dreibettzimmer', apt2: 'Apartment, 2 Zimmer', apt3: 'Apartment, 3 Zimmer', aar: 'Aarmühle-Penthouse-Suite' };
  const FORM = { nachricht: 'Nachricht', anlass: 'Anfrage Tagen & Feiern', gutschein: 'Gutschein', bewerbung: 'Bewerbung', newsletter: 'Newsletter', anreise: 'Vor der Anreise' };
  const SPR = { de: 'Deutsch', en: 'Englisch', fr: 'Französisch' };
  let land = k => k; try { const dn = new Intl.DisplayNames(['de-CH'], { type: 'region' }); land = k => { try { return dn.of(k); } catch (e) { return k; } }; } catch (e) {}
  const liste = (titel, L, name, leer) => {
    const max = L.length ? L[0][1] : 1;
    return `<section class="blatt zrang"><h3>${titel}</h3>${L.length ? L.slice(0, 8).map(([k, v]) => `<div class="zrang__z"><span>${h(name ? name(k) : k)}</span><i style="--w:${Math.max(4, Math.round(v / max * 100))}%"></i><b>${v}</b></div>`).join('') : `<p class="zrang__leer">${leer}</p>`}</section>`;
  };
  const tage = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5); tage.push(d.toISOString().slice(0, 10)); }
  const proTag = tage.map(t => ev.filter(e => e.t === 'seite' && String(e.zeit).slice(0, 10) === t).length), maxT = Math.max(1, ...proTag);
  const zimmer = zaehle(ev.filter(e => (e.t === 'zimmer' || e.t === 'finder') && e.z), e => e.z);
  $('.in', sicht).innerHTML = kopf('Die <em>Zahlen.</em>', `Die letzten 30 Tage. ${ev.length ? '' : 'Noch keine Besuche gezählt: Sobald Gäste die Website öffnen, steht es hier.'} Gezählt wird ohne Kekse und ohne Adressen, Prüfläufe zählen nicht mit.`, `<button class="kn kn--linie" type="button" data-akt="neu-laden">Neu laden</button>`) +
    `<section class="blatt zahlen-gefragt"><div><b>${n('seite')}</b><span>Seitenaufrufe</span></div><div><b>${n('buchen')}</b><span>Klicks auf «Buchen»</span></div><div><b>${n('finder')}</b><span>Zimmer-Finder mit Preis</span></div><div><b>${n('formular')}</b><span>Anfragen und Bestellungen</span></div></section>
    <section class="blatt zrang"><h3>Seitenaufrufe, die letzten 14 Tage</h3><div class="ztage">${proTag.map((v, i) => `<div title="${new Date(tage[i]).toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'short' })}: ${v}"><i style="--h:${Math.max(2, Math.round(v / maxT * 100))}%"></i><span>${new Date(tage[i]).getDate()}.</span></div>`).join('')}</div></section>
    <div class="zrang-raster">
    ${liste('Gefragte Zimmer', zimmer, k => ZIMMER[k] || k, 'Noch kein Zimmer über den Finder gewählt.')}
    ${liste('Packages', zaehle(ev.filter(e => e.t === 'package'), e => e.p), null, 'Noch kein Package angeklickt.')}
    ${liste('Anfragen und Bestellungen', zaehle(ev.filter(e => e.t === 'formular'), e => e.f), k => FORM[k] || k, 'Noch keine Anfrage über die Website.')}
    ${liste('Länder', zaehle(ev.filter(e => e.t === 'seite'), e => e.l), land, 'Noch kein Land erkannt.')}
    ${liste('Sprachen', zaehle(ev.filter(e => e.t === 'seite'), e => e.sp), k => SPR[k] || k, 'Noch keine Besuche.')}
    ${liste('Meistbesuchte Seiten', zaehle(ev.filter(e => e.t === 'seite'), e => e.s), null, 'Noch keine Besuche.')}
    </div>`;
  $('.in', sicht).onclick = ev2 => { if (ev2.target.closest('[data-akt="neu-laden"]')) zahlenS(); };
}

// ---------------------------------------------------------------- Anfragen beantworten: Entwurf einer Antwort-Mail aus den Unterlagen des Hauses
// Die Mail des Gastes einfügen, der Assistent schreibt den Entwurf (Preise und Leistungen nur aus Website und Unterlagen), das Team liest, ändert
// und schickt selbst. Le Bureau verschickt nichts.
let ENTWURF_A = null;
function anfragenS() {
  sicht.innerHTML = `<div class="in">${kopf('Anfragen <em>beantworten.</em>', 'Gruppen, Hochzeiten, Seminare, Bankette: Fügen Sie die Anfrage ein, der Assistent schreibt einen Entwurf im Ton des Hauses, mit Preisen und Leistungen aus Website und Unterlagen. Sie lesen, ändern und schicken selbst. Hier wird nichts verschickt.')}
    <section class="blatt anfrage"><div class="form1" style="margin-top:0">
      <label class="feld"><span>Anfrage des Gastes</span><textarea id="an-mail" rows="9" placeholder="Die Mail des Gastes hier einfügen, mit Anrede und Unterschrift.">${h(ENTWURF_A ? ENTWURF_A.mail : '')}</textarea></label>
      <label class="feld"><span>Hinweis an den Assistenten (freiwillig)</span><input id="an-hinweis" maxlength="400" placeholder="z. B. Hansen-Ritschard-Saal am 14. März ist frei, Menü 2 empfehlen" value="${h(ENTWURF_A ? ENTWURF_A.hinweis : '')}"></label>
      <div class="fehler" id="an-f" role="alert"></div>
      <div class="fenster__kn" style="justify-content:flex-start;margin-top:4px"><button class="kn" type="button" id="an-los">Entwurf schreiben<i>${PF}</i></button>${ENTWURF_A && ENTWURF_A.text ? '<button class="kn kn--linie" type="button" id="an-leer">Neue Anfrage</button>' : ''}</div>
    </div></section>
    <div id="an-ergebnis">${ENTWURF_A && ENTWURF_A.text ? anfrageErgebnis(ENTWURF_A) : ''}</div></div>`;
  const los = $('#an-los');
  los.onclick = async () => {
    const mail = $('#an-mail').value.trim(), hinweis = $('#an-hinweis').value.trim(), fe = $('#an-f');
    fe.textContent = '';
    if (mail.length < 20) { fe.textContent = 'Bitte die Anfrage des Gastes einfügen.'; return; }
    los.disabled = true; los.firstChild.textContent = 'Wird geschrieben …';
    $('#an-ergebnis').innerHTML = `<div class="leerbild">${CE}<b>Einen Moment.</b><p>Der Assistent liest die Anfrage und die Unterlagen des Hauses.</p></div>`;
    try {
      const r = await fetch('/api/gast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ modus: 'anfrage', mail, hinweis }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.text) throw new Error(j.fehler || (r.status === 404 ? 'Der Assistent läuft nur in der Online-Fassung (carlton.tastystudios.ch/control/).' : 'Das hat nicht geklappt.'));
      ENTWURF_A = { mail, hinweis, ...j };
      anfragenS();
      $('#an-ergebnis').scrollIntoView({ block: 'start', behavior: 'smooth' });
    } catch (e) { fe.textContent = e.message; $('#an-ergebnis').innerHTML = ''; los.disabled = false; los.firstChild.textContent = 'Entwurf schreiben'; }
  };
  const leer = $('#an-leer');
  if (leer) leer.onclick = () => { ENTWURF_A = null; anfragenS(); };
  const erg = $('#an-ergebnis');
  erg.onclick = async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b || !ENTWURF_A) return;
    const betreff = $('#an-betreff').value, text = $('#an-text').value;
    if (b.dataset.akt === 'kopieren') { try { await navigator.clipboard.writeText(text); quittung('Kopiert', 'Den Text in Ihre Antwort-Mail einfügen.'); } catch (e) { sag('Kopieren ging nicht. Bitte den Text markieren und kopieren.', true); } }
    if (b.dataset.akt === 'mail') {
      const an = (ENTWURF_A.mail.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [''])[0];
      location.href = 'mailto:' + an + '?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(text);
    }
  };
}
function anfrageErgebnis(a) {
  const offen = (a.text.match(/\[[^\]]+\]/g) || []).length;
  return `<section class="blatt anfrage__e"><div class="gruppe__k"><h3>Entwurf<span>${offen ? offen + (offen === 1 ? ' Stelle' : ' Stellen') + ' in [Klammern] klären' : 'bereit zum Lesen'}</span></h3></div>
    <div class="form1"><label class="feld"><span>Betreff</span><input id="an-betreff" value="${h(a.betreff || '')}"></label>
    <label class="feld"><span>Mail</span><textarea id="an-text" rows="18">${h(a.text)}</textarea></label></div>
    ${a.team ? `<div class="anfrage__team"><b>Nur für das Team</b><p>${h(a.team).replace(/\n/g, '<br>')}</p></div>` : ''}
    <div class="fenster__kn" style="justify-content:flex-start"><button class="kn" type="button" data-akt="mail">Im Mailprogramm öffnen<i>${PF}</i></button><button class="kn kn--linie" type="button" data-akt="kopieren">Text kopieren</button></div>
    <p class="gruppe__hin" style="padding:0;margin-top:12px">Erst lesen, dann senden. Alles in eckigen Klammern entscheidet das Haus.</p></section>`;
}
function einstellungenFenster() {
  const E = ZS.einstellungen;
  fenster(`<h2>Weiter<em>leitung.</em></h2><p>Jede Einsendung bleibt hier im Eingang. Zusätzlich kann sie an einen Dienst gehen, der daraus eine Mail macht oder sie in ein Programm schreibt (zum Beispiel Zapier, Make oder Ihr Newsletter-Dienst). Tragen Sie dazu die Empfangsadresse ein, die Ihnen der Dienst gibt.</p>
    <div class="form1" style="margin-top:18px">${Object.entries(ZS.formulare).map(([k, n]) => `<label class="feld"><span>${h(n)}</span><input data-ef="${k}" inputmode="url" value="${h((E[k] || {}).weiterleitung || '')}" placeholder="https://… (leer = keine Weiterleitung)"></label>`).join('')}</div>
    <div class="fehler" id="ef-f" role="alert"></div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="ef-ok">Speichern<i>${PF}</i></button></div>`);
  $('#ef-ok').addEventListener('click', async () => {
    try {
      for (const i of $$('[data-ef]')) if (i.value.trim() !== ((E[i.dataset.ef] || {}).weiterleitung || '')) ZS = await api('einstellung', { formular: i.dataset.ef, weiterleitung: i.value.trim() });
      rand(); fensterZu(); sag('Weiterleitung gespeichert.'); zeige(true);
    } catch (e) { $('#ef-f').textContent = e.message; }
  });
}

// ---------------------------------------------------------------- Vergleich vorher / nachher
function vergleich(c, seiteDatei) {
  const stellen = c.stellen.length ? c.stellen : [];
  if (!stellen.length) return;
  V = { c, stellen, i: Math.max(0, seiteDatei ? stellen.findIndex(s => s.seite === seiteDatei) : 0), geraet: 'rechner', box: {}, seite: {} };
  const v = $('#vergleich');
  v.hidden = false;
  v.innerHTML = `<div class="vgl__k"><button class="rund" type="button" data-akt="zu" title="Schliessen" aria-label="Schliessen">${SYM.zu}</button>
      <h2>${h(c.titel)}<small>${h(c.ort || '')}</small></h2>
      <select id="v-seite" aria-label="Seite"${c.seiten.length < 2 ? ' hidden' : ''}>${c.seiten.map(s => `<option value="${h(s.datei)}">${h(s.name)}${s.zahl > 1 ? ` (${s.zahl} Stellen)` : ''}</option>`).join('')}</select>
      <div class="vgl__nav"><button class="rund" type="button" data-akt="vor" aria-label="Vorherige Stelle">${SYM.links}</button><span id="v-zahl"></span><button class="rund" type="button" data-akt="nach" aria-label="Nächste Stelle">${SYM.rechts}</button>
        <button class="rund an" type="button" data-g="rechner" aria-label="Wie am Rechner">${SYM.rechner}</button><button class="rund" type="button" data-g="handy" aria-label="Wie am Handy">${SYM.handy}</button></div></div>
    <div class="vgl__b" id="v-b">${['vorher', 'entwurf'].map(p => `<div class="vgl__s"><span>${p === 'vorher' ? 'Vorher <b>so steht es jetzt auf der Website</b>' : 'Nachher <b>so sieht es nach dem Veröffentlichen aus</b>'}</span>
      <div class="vgl__r"><iframe id="v-${p}" title="${p === 'vorher' ? 'Vorher' : 'Nachher'}"></iframe><div class="vgl__m" id="vm-${p}"></div><div class="vgl__leer" id="vl-${p}" hidden></div></div></div>`).join('')}</div>`;
  v.onclick = ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.akt === 'zu') return vglZu();
    if (b.dataset.akt === 'vor') V.i = (V.i - 1 + V.stellen.length) % V.stellen.length;
    else if (b.dataset.akt === 'nach') V.i = (V.i + 1) % V.stellen.length;
    else if (b.dataset.g) {
      V.geraet = b.dataset.g;
      $('#v-b').classList.toggle('handy', V.geraet === 'handy');
      $$('.vgl__r', v).forEach(r => r.classList.toggle('handy', V.geraet === 'handy'));
      $$('[data-g]', v).forEach(x => x.classList.toggle('an', x === b));
      V.passe.forEach(f => f());
      setTimeout(() => ['vorher', 'entwurf'].forEach(vglMarke), 350);
      return;
    }
    else return;
    vglLade();
  };
  $('#v-seite').addEventListener('change', ev => { V.i = Math.max(0, V.stellen.findIndex(s => s.seite === ev.target.value)); vglLade(); });
  V.passe = [];
  ['vorher', 'entwurf'].forEach(p => {
    const fr = $('#v-' + p);
    V.passe.push(passe(fr, fr.parentNode, 1280));
    fr.addEventListener('load', () => {
      const d = fr.contentDocument;
      if (!d || !d.body || !V) return;
      V.box[p] = richte(d, false).an;
      d.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('a[href]')) ev.preventDefault(); }, true);
      d.defaultView.addEventListener('wheel', () => requestAnimationFrame(() => { const a = $('#v-' + (p === 'vorher' ? 'entwurf' : 'vorher')); try { a.contentWindow.scrollTo(0, d.defaultView.scrollY); vglRahmen(); } catch (e) {} }), { passive: true });
      d.defaultView.addEventListener('scroll', vglRahmen, { passive: true });
      vglMarke(p);
    });
  });
  vglLade();
}
function vglZu() { V = null; const v = $('#vergleich'); v.hidden = true; v.innerHTML = ''; }
function vglFinde(d, st, p) {
  if (st.oben) return null;
  if (st.b) return d.querySelector(`img[data-b="${st.b}"][data-bn="${st.n}"]`);
  const genau = () => d.querySelector(`[data-e="${st.h}"][data-en="${st.n}"]`);
  if (!['karte', 'liste'].includes(V.c.art) || p === (st.vorher ? 'vorher' : 'entwurf')) return genau();
  return $$(`[data-e="${st.h}"]`, d).find(e => e.textContent.trim() === st.t) || null;
}
function vglRahmen() {
  if (!V) return;
  ['vorher', 'entwurf'].forEach(p => { const el = V.el && V.el[p]; if (el) rahme(V.box[p], el); });
}
function vglMarke(p) {
  if (!V) return;
  const fr = $('#v-' + p), d = fr.contentDocument, st = V.stellen[V.i], leer = $('#vl-' + p), m = $('#vm-' + p);
  if (!d || !d.body || V.seite[p] !== st.seite || d.readyState === 'loading') return;
  V.el = V.el || {};
  let el = vglFinde(d, st, p);
  leer.hidden = true;
  if (st.oben) { d.defaultView.scrollTo(0, 0); rahme(V.box[p], null); m.innerHTML = ''; V.el[p] = null; return; }
  if (el) {
    zeig(el);
    el = el.closest('.gk,.lk,.zk,.st,.dienst') || el;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    if (!rahme(V.box[p], el)) { leer.hidden = false; leer.textContent = 'Diese Stelle ist auf der Seite gerade eingeklappt und erst nach einem Klick zu sehen.'; }
  } else {
    rahme(V.box[p], null);
    leer.hidden = false;
    leer.textContent = p === 'vorher' ? 'Hier stand das vorher noch nicht.' : 'Hier steht es nach dem Veröffentlichen nicht mehr.';
  }
  V.el[p] = el;
  const hoehe = d.documentElement.scrollHeight || 1;
  m.innerHTML = V.stellen.map((s, i) => {
    if (s.seite !== st.seite) return '';
    const e = i === V.i ? el : vglFinde(d, s, p);
    const r = e && e.getBoundingClientRect();
    return r && (r.width || r.height) ? `<i class="${i === V.i ? 'an' : ''}" style="top:${((r.top + d.defaultView.scrollY) / hoehe * 100).toFixed(2)}%"></i>` : '';
  }).join('');
}
function vglLade() {
  const st = V.stellen[V.i], name = (V.c.seiten.find(s => s.datei === st.seite) || {}).name || st.seite;
  $('#v-zahl').textContent = `Stelle ${V.i + 1} von ${V.stellen.length} · ${name}`;
  $('#v-seite').value = st.seite;
  ['vorher', 'entwurf'].forEach(p => {
    const fr = $('#v-' + p);
    if (V.seite[p] !== st.seite) { V.seite[p] = st.seite; V.el = {}; fr.src = `/${p}/${encodeURIComponent(st.seite)}?nomotion`; } else vglMarke(p);
  });
}

// ---------------------------------------------------------------- Verlauf und Zugang
function verlauf() {
  const vs = ZS.verlauf;
  sicht.innerHTML = `<div class="in">${kopf('Der <em>Verlauf.</em>', vs.length ? 'Jede Veröffentlichung wird aufgehoben. Holen Sie einen früheren Stand zurück, liegt er zuerst als Entwurf bereit. Sie prüfen ihn und veröffentlichen dann.' : '')}
    ${vs.length ? `<ol class="lauf">${vs.map((v, i) => `<li><div class="blatt"><div><time>${v.anfang ? 'Ursprünglicher Stand' : datum(v.zeit)}</time>
      <p>${v.anfang ? 'So war die Website, bevor in Le Bureau zum ersten Mal etwas geändert wurde.' : (v.notiz ? `<b>${h(v.notiz)}</b> · ` : '') + h(v.punkte.slice(0, 6).join(' · ')) + (v.punkte.length > 6 ? ` und ${v.punkte.length - 6} weitere` : '')}</p></div>
      ${i === 0 ? '<span class="mono leise">Das ist der Stand der Website</span>' : `<button class="kn kn--klein kn--linie" type="button" data-id="${h(v.id)}">Diesen Stand zurückholen</button>`}</div></li>`).join('')}</ol>`
    : `<div class="leerbild">${CE}<b>Noch nichts veröffentlicht.</b><p>Sobald Sie zum ersten Mal etwas veröffentlichen, finden Sie hier jeden Stand der Website und können ihn zurückholen.</p></div>`}</div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const b = ev.target.closest('[data-id]');
    if (!b) return;
    frage('Stand <em>zurückholen?</em>', 'Der frühere Stand wird als Entwurf geladen. Was Sie gerade an unveröffentlichten Änderungen haben, wird dabei ersetzt. Auf der Website ändert sich erst etwas, wenn Sie veröffentlichen.', 'Zurückholen', async () => {
      ZS = await api('zurueck', { id: b.dataset.id });
      sag('Der frühere Stand liegt als Entwurf bereit.');
      location.hash = '#/aenderungen';
    });
  });
}
function zugang() {
  if (PROBE) {
    sicht.innerHTML = `<div class="in">${kopf('Ihr <em>Zugang.</em>', 'Die Probe-Fassung braucht kein Passwort. Jeder Besucher arbeitet in seiner eigenen Kopie, die echte Website bleibt, wie sie ist.')}
      <section class="blatt" style="max-width:640px"><h3>Im echten Le Bureau</h3><p style="margin-top:12px;color:rgba(12,21,38,.7)">Dort legen Sie beim ersten Öffnen Ihr eigenes Passwort fest und können es hier jederzeit ändern. Nach zwölf Stunden meldet es Sie von selbst ab.</p></section></div>`;
    return;
  }
  if (OFFEN) {
    sicht.innerHTML = `<div class="in">${kopf('Ihr <em>Zugang.</em>', 'Le Bureau ist gerade ohne Passwort offen. Sobald Sie wirklich damit arbeiten, wird der Schutz eingeschaltet; Ihr Passwort bleibt dafür gespeichert.')}
      <section class="blatt" style="max-width:640px"><h3>Offen</h3><p style="margin-top:12px;color:rgba(12,21,38,.7)">Jeder, der die Adresse kennt, kann gerade ändern und veröffentlichen. Zum Einschalten des Schutzes sagen Sie Robert Bescheid.</p></section></div>`;
    return;
  }
  sicht.innerHTML = `<div class="in">${kopf('Ihr <em>Zugang.</em>', 'Le Bureau ist mit einem Passwort geschützt. Nach zwölf Stunden meldet es Sie von selbst ab.')}
    <div class="raster r-2"><section class="blatt"><h3>Passwort ändern</h3><form id="z-form" style="display:grid;gap:14px;margin-top:18px" autocomplete="off">
      <label class="feld"><span>Bisheriges Passwort</span><input type="password" name="alt" autocomplete="current-password" required></label>
      <label class="feld"><span>Neues Passwort</span><input type="password" name="neu" autocomplete="new-password" required minlength="10"><small>Mindestens 10 Zeichen</small></label>
      <label class="feld"><span>Noch einmal</span><input type="password" name="neu2" autocomplete="new-password" required></label>
      <div class="fehler" role="alert" style="text-align:left"></div><div><button class="kn" type="submit">Passwort ändern<i>${PF}</i></button></div></form></section>
    <section class="blatt"><h3>Abmelden</h3><p style="margin:14px 0 20px;color:rgba(12,21,38,.7)">An einem fremden Rechner melden Sie sich am besten ab, wenn Sie fertig sind. Entwürfe bleiben erhalten.</p><button class="kn kn--linie" type="button" data-akt="abmelden">Abmelden</button></section></div></div>`;
  const f = $('#z-form');
  f.addEventListener('submit', async ev => {
    ev.preventDefault();
    const fe = $('.fehler', f);
    fe.textContent = '';
    if (f.neu.value !== f.neu2.value) { fe.textContent = 'Die beiden neuen Eingaben sind nicht gleich.'; return; }
    try { await api('passwort', { alt: f.alt.value, neu: f.neu.value }); f.reset(); sag('Das Passwort ist geändert.'); } catch (e) { fe.textContent = e.message; }
  });
}

// ---------------------------------------------------------------- Kontrolle: die Prüfseite, eingebettet. Sie ist eine eigene Datei ohne Teile dieses Skripts,
// damit sie auch dann läuft, wenn Le Bureau selbst nicht mehr lädt (dann direkt /control/pruefung.html öffnen).
function kontrolleS() {
  sicht.innerHTML = `<div class="in in--kontrolle">${kopf('Die <em>Kontrolle.</em>', 'Le Bureau prüft sich selbst: Browser, Server, Daten, Bau der Seite, Fotos, Unterlagen, Sprachen. Jeder Punkt nennt in Alltagssprache, was zu tun ist. Darunter steht das Lexikon mit jeder bekannten Fehlerquelle.',
      `<a class="kn kn--linie" href="/control/pruefung.html" target="_blank" rel="noopener">Prüfseite in neuem Fenster</a>`)}
    <p class="hinweis" style="margin:-20px 0 18px">Die Prüfseite läuft auch, wenn der Rest von Le Bureau nicht mehr aufgeht: dann direkt <b>/control/pruefung.html</b> aufrufen oder den Weg über die Anmeldung nehmen.</p>
    <iframe class="kontrolle" id="k-rahmen" src="/control/pruefung.html?eingebettet=1" title="Prüfung"></iframe></div>`;
  const fr = $('#k-rahmen');
  const hoch = () => { if (!fr.isConnected) return; try { const d = fr.contentDocument; if (d && d.body) fr.style.height = Math.max(600, d.documentElement.scrollHeight + 24) + 'px'; } catch (e) {} };
  fr.addEventListener('load', () => { hoch(); setTimeout(hoch, 800); setTimeout(hoch, 2500); });
  if (KONTROLLE.auf) { removeEventListener('message', KONTROLLE.auf); KONTROLLE.ro.disconnect(); }
  KONTROLLE.auf = ev => { if (ev.data && ev.data.ce === 'pruefung') setTimeout(hoch, 100); };
  KONTROLLE.ro = new ResizeObserver(hoch);
  addEventListener('message', KONTROLLE.auf);
  KONTROLLE.ro.observe(sicht);
}
const KONTROLLE = { auf: null, ro: null };

// ---------------------------------------------------------------- Fenster
function fenster(html, breit) {
  const f = $('#fenster');
  f.hidden = false;
  f.oninput = f.onclick = f.bei = null;
  $$('.quitt').forEach(x => { if (!html.includes('class="erfolg"')) x.remove(); });
  f.innerHTML = `<div class="fenster__k${breit ? ' breit' : ''}" role="dialog" aria-modal="true"><button class="rund zu" type="button" data-zu aria-label="Schliessen">${SYM.zu}</button>${html}</div>`;
  const erstes = $('input:not([type=hidden]),button.kn', f);
  if (erstes) erstes.focus();
}
function fensterZu() { const f = $('#fenster'); f.hidden = true; f.innerHTML = ''; }
function frage(titel, text, knopf, tun_) {
  fenster(`<h2>${titel}</h2><p>${text}</p><div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="f-ja">${knopf}<i>${PF}</i></button></div>`);
  $('#f-ja').addEventListener('click', async () => { try { await tun_(); fensterZu(); } catch (e) { sag(e.message, true); } });
}
$('#fenster').addEventListener('click', ev => { if (ev.target.closest('[data-zu]')) fensterZu(); });
$('#fenster').addEventListener('wahl', ev => { const f = $('#fenster'); if (f.bei) f.bei(ev); });
$('#lade').addEventListener('click', ev => { if (ev.target.id === 'lade') ladeZu(); });
addEventListener('keydown', ev => {
  if (ev.key !== 'Escape') return;
  if (!$('#fenster').hidden) fensterZu(); else if (V) vglZu(); else if (!$('#lade').hidden) ladeZu();
});
document.addEventListener('click', async ev => {
  const b = ev.target.closest('[data-akt]');
  if (!b) return;
  const akt = b.dataset.akt, imLade = b.closest('#lade');
  if (akt === 'abmelden') { try { await api('abmelden', {}); } catch (e) {} ZS = null; ladeZu(); tor('an'); }
  if (akt === 'neu-laden') location.reload();
  if (akt === 'lade') { if ($('#lade').hidden) lade(); else ladeZu(); }
  if (akt === 'ladezu') ladeZu();
  if (akt === 'raus' || akt === 'alles') aktAenderung(akt);
  if (imLade && (akt === 'sehen' || akt === 'weg')) aktAenderung(akt, b.closest('[data-id]').dataset.id);
  if (b.dataset.akt === 'geraet' && W) {
    $('#w-buehne').classList.toggle('handy', b.dataset.g === 'handy');
    W.passe();
    $$('[data-akt="geraet"]').forEach(x => x.classList.toggle('an', x === b));
    setTimeout(() => { if (W && W.sel) rahme(W.an, W.sel.el); }, 300);
  }
});

(async () => {
  // das CE-Zeichen des Hauses, unverändert aus dem Logo (als Sprite, damit jedes <use> es findet)
  try {
    const svg = await fetch('/assets/logo/carlton-europe.svg').then(r => r.text());
    const mono = (svg.match(/<path class="st0"[^>]*\/>/g) || []).join('').replace(/class="st0"/g, '');
    document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><g id="ce">${mono}</g></defs></svg>`);
  } catch (e) {}
  try {
    const s = await api('status');
    OFFEN = !!s.offen;
    PROBE = !!s.probe;
    if (s.offen) await laden(); else if (!s.eingerichtet) tor('neu'); else if (!s.angemeldet) tor('an'); else await laden();
  } catch (e) {
    // Der Start scheitert (Server weg, Stand nicht lieferbar): kein weisser Bildschirm, sondern der Grund und der Weg zur Prüfung
    fehlerMerken('Start', e.message);
    $('#app').hidden = true;
    const t = $('#tor');
    t.hidden = false;
    t.innerHTML = `<div class="tor__k"><div class="tor__ce">${CE}</div><h1>Carlton <em>Control.</em></h1><p>${h(e.message)}</p>
      <form><a class="kn kn--breit" href="/control/pruefung.html">Zur Prüfung<i>${PF}</i></a><button class="kn kn--breit kn--linie" type="button" data-akt="neu-laden">Noch einmal versuchen</button></form>
      <p class="tor__f">Die Prüfung läuft ohne den Rest von Le Bureau und sagt, woran es liegt.</p></div>`;
  }
})();
})();
