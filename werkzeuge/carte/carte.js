/* Jede Seite öffnet oben (Robert 18.10.2026 18:30: «… die Links oben die Seite zeigen»): der Browser stellt beim Neuladen keine alte Stelle her */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
/* La Carte · Carlton-Europe — Bedienung (15.10.2026). Aufbau wie La Carte des Grand Beau-Rivage (mc.js): zwei Wege «Einfach» (Liste und Fenster) und
   «Fortgeschritten» (direkt in der Karte schreiben), jede Änderung zuerst als Entwurf, Veröffentlichen druckt PDF und prüft sie gegen die Daten.
   Satz und Vorschau: satz/satz.js, Vorschau im Rahmen blatt.html. Server: carte.py über serve.py. Ohne Bibliothek.
   Kein Auswahlfeld des Betriebssystems: Auswahl als Knöpfe, Schalter als eigene Schalter, Woche mit Pfeilen statt Kalender des Browsers. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const kopie = x => JSON.parse(JSON.stringify(x));
const PF = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M4.5 3H11v6.5"/></svg>';
const SYM = {
  hoch: '<svg viewBox="0 0 14 14"><path d="m2.5 9 4.5-4.5L11.5 9"/></svg>', runter: '<svg viewBox="0 0 14 14"><path d="m2.5 5 4.5 4.5L11.5 5"/></svg>',
  zu: '<svg viewBox="0 0 14 14"><path d="m3 3 8 8M11 3l-8 8"/></svg>', auge: '<svg viewBox="0 0 16 14"><path d="M1 7s2.6-4.5 7-4.5S15 7 15 7s-2.6 4.5-7 4.5S1 7 1 7Z"/><circle cx="8" cy="7" r="1.9"/></svg>',
  augezu: '<svg viewBox="0 0 16 14"><path d="M1 7s2.6-4.5 7-4.5S15 7 15 7s-2.6 4.5-7 4.5S1 7 1 7Z"/><path d="m3 1 10 12"/></svg>',
  korb: '<svg viewBox="0 0 14 14"><path d="M2.5 4h9M5.5 4V2.5h3V4M3.5 4l.6 7.5h5.8L10.5 4"/></svg>', stift: '<svg viewBox="0 0 14 14"><path d="M9.5 2.5 11.5 4.5 5 11H3V9z"/></svg>',
  plus: '<svg viewBox="0 0 14 14"><path d="M7 2.5v9M2.5 7h9"/></svg>', haken: '<svg viewBox="0 0 14 14"><path d="m2.5 7.5 3 3 6-7"/></svg>',
  links: '<svg viewBox="0 0 14 14"><path d="m9 2.5-4.500 4.500L9 11.500"/></svg>', rechts: '<svg viewBox="0 0 14 14"><path d="m5 2.5 4.500 4.500L5 11.500"/></svg>',
  kopie: '<svg viewBox="0 0 14 14"><rect x="4.500" y="4.500" width="7" height="7" rx="1.200"/><path d="M9.500 4.500V3a.8.8 0 0 0-.8-.8H3A.8.8 0 0 0 2.200 3v5.700a.8.8 0 0 0 .8.8h1.500"/></svg>',
};
const CE = '<svg class="ce" viewBox="150 0 60 42" aria-hidden="true"></svg>';
const FOTO = { speisekarte: 'beizli', 'wein-und-getraenkekarte': 'keller-wein', snackkarte: 'dach-tisch', hundespeisekarte: 'hunde', bankettmenus: 'saal-hr', mittag: 'beizli-2' };
const ROLLEN = { kueche: 'Küche', service: 'Service', direktion: 'Direktion' };
/* Die Website und die anderen Werkzeuge des Hauses: lokal auf dem Server der Website (8912), online auf derselben Adresse wie La Carte */
const HAUS = location.port === '8932' ? location.protocol + '//' + location.hostname + ':8912/' : '/';
const API = '/_werkzeuge/carte/api/';   // lokal (serve.py) und online (vercel.json → api/carte.py) derselbe Weg
const SEITE_DER_KARTE = { speisekarte: 'essen-trinken.html', 'wein-und-getraenkekarte': 'essen-trinken.html', snackkarte: 'kaminbar.html', hundespeisekarte: 'hunde.html', bankettmenus: 'tagen-feiern.html', mittag: 'restaurant.html' };

let NEU_KARTE = false, ANSICHT = 'karte';
let LISTE = [], Z = '', STAND = null, D = null, BASIS = '', MODUS = 'einfach', OFFEN = false, UNDO = [], BLITZ = null, ERWARTET = null, SCHRIFT = null;
let WER = '', ROLLE = '', ZM = { einfach: 0.6, frei: 0.78 }, BEREIT = false, TEXTGEAENDERT = false, TIMER = null, BERICHT = null, GESCHRIEBEN = [], EINST = {}, RECHTE = {};
WER = 'Team Carlton-Europe'; ROLLE = 'direktion';   /* Fehlerbuch 10a (Schlössli 20.10.2026): keine «Wer arbeitet hier?»-Abfrage; fester Eintrag im Protokoll, volle Rechte, Anmeldung erst bei der Auslieferung */
try { MODUS = localStorage.getItem('lc-modus') || 'einfach'; ZM.einfach = +(localStorage.getItem('lc-zoom-einfach') || 0.62); ZM.frei = +(localStorage.getItem('lc-zoom-frei') || 0.8); } catch (e) { /* ohne Speicher geht es auch */ }

// ---------------------------------------------------------------- Verbindung
async function api(was, daten) {
  const kopf = { 'X-Carte-Wer': encodeURIComponent(WER), 'X-Carte-Rolle': ROLLE };
  const o = daten === undefined ? { cache: 'no-store', headers: kopf } : { method: 'POST', headers: { 'Content-Type': 'application/json', ...kopf }, body: JSON.stringify(daten) };
  let r;
  try { r = await fetch(API + was, o); } catch (e) { const f = new Error('Keine Verbindung. Ihre Eingaben sind noch da; bitte gleich noch einmal versuchen.'); f.stichwort = 'VERBINDUNG'; throw f; }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(j.fehler || 'Das hat nicht geklappt.'); e.stichwort = j.stichwort || ''; e.status = r.status; throw e; }
  return j;
}
function sag(titel, text = '', knoepfe = [], fehl = false) {
  const m = document.createElement('div');
  m.className = 'quit' + (fehl ? ' fehl' : '');
  m.innerHTML = `<div style="flex:1;min-width:0"><b>${h(titel)}</b>${text ? `<span>${h(text)}</span>` : ''}</div>` + knoepfe.map((k, i) => k.href ? `<a href="${h(k.href)}" target="_blank" rel="noopener">${h(k.t)}</a>` : `<button type="button" data-i="${i}">${h(k.t)}</button>`).join('');
  m.addEventListener('click', ev => { const b = ev.target.closest('button[data-i]'); if (b) { knoepfe[+b.dataset.i].f(); m.remove(); } });
  const ort = $('#meldung');
  [...ort.children].forEach(x => { if (x.textContent === m.textContent) x.remove(); });   // dieselbe Meldung nicht doppelt (Speichern und Verlassen des Feldes zugleich, 16.10.2026)
  ort.appendChild(m);
  while (ort.children.length > 2) ort.firstElementChild.remove();
  setTimeout(() => m.remove(), fehl ? 12000 : 6000);
}
const fehlerSagen = (titel, e) => sag(titel, e.message + (e.stichwort ? ` (${e.stichwort})` : ''), e.stichwort ? [{ t: 'Was tun?', href: '/_werkzeuge/carte/anleitung.html#' + e.stichwort }] : [], true);

// ---------------------------------------------------------------- Daten-Hilfen
const istKnoten = x => x && typeof x === 'object' && !Array.isArray(x) && x.fn;
const inhalt = d => JSON.stringify({ s: d.seiten, w: d.woche, c: d.css });
const geaendert = () => inhalt(D) !== inhalt(STAND);
const liesPfad = (o, p) => p.split('.').reduce((x, k) => x == null ? x : x[/^\d+$/.test(k) ? +k : k], o);
function setzePfad(o, pfad, wert) {
  const k = pfad.split('.'); let x = o;
  for (let i = 0; i < k.length - 1; i++) x = x[/^\d+$/.test(k[i]) ? +k[i] : k[i]];
  const l = k[k.length - 1]; x[/^\d+$/.test(l) ? +l : l] = wert;
}
function vater(pfad) { const k = pfad.split('.'), i = +k.pop(); return { arr: liesPfad(D, k.join('.')), idx: i, arrPfad: k.join('.') }; }
const nachbar = (arr, i, r) => { for (let j = i + r; j >= 0 && j < arr.length; j += r) if (istKnoten(arr[j]) ? !['luft', 'feder'].includes(arr[j].fn) : (arr[j] && arr[j].t)) return j; return -1; };
/* Preis in der Schreibweise der Karte: «18» → «18.00», «CHF 18» je nach den Nachbarn, «12,5» → «12.50» */
function nachbarPreise() {
  const aus = [];
  const geh = x => { if (istKnoten(x)) { const a = angaben(x).w; ['preis', 'chf'].forEach(k => { if (typeof a[k] === 'string' || typeof a[k] === 'number') aus.push(String(a[k])); }); x.a.forEach(geh); } else if (Array.isArray(x)) x.forEach(geh); };
  (D.seiten || []).forEach(s => { if (istKnoten(s)) geh(s.a); });
  return aus.filter(x => /\d/.test(x)).slice(0, 80);
}
function preisForm(v) {
  let t = String(v ?? '').trim().replace(/^chf\s*/i, 'CHF ');
  if (!/^\d{1,5}([.,]\d{1,2})?$/.test(t)) return t;
  const nb = nachbarPreise(), rappen = nb.filter(x => /\.\d\d$/.test(x)).length * 2 > nb.length, chf = nb.filter(x => /^CHF /.test(x)).length * 2 > nb.length;
  let z = t.replace(',', '.');
  if (rappen || /\.\d$/.test(z)) z = (+z).toFixed(2); else if (/\.00$/.test(z)) z = z.slice(0, -3);
  return (chf ? 'CHF ' : '') + z;
}

/* Namen der Angaben eines Bausteins */
const LABEL = { name: 'Name', de: 'Name', fr: 'Französisch', en: 'Englisch', text: 'Text', texte: 'Texte (eine Zeile je Absatz)', titel: 'Titel', unter: 'Zusatz', preis: 'Preis', preise: 'Preise (Menge | Preis, eine Zeile je Preis)',
  mass: 'Menge', herkunft: 'Herkunft', farbe: 'Farbe', traube: 'Traubensorte', trauben: 'Trauben (eine Zeile je Sorte)', haus: 'Haus (eine Zeile je Angabe)', zeilen: 'Jahrgang | Einheit | Preis (eine Zeile je Flasche)',
  andere: 'Weitere Sprachen (eine Zeile je Sprache)', punkte: 'Punkte (eine Zeile je Punkt)', vol: 'Alkohol vol %', cl: 'Menge cl', chf: 'Preis CHF', nr: 'Seite', jrg: 'Spaltenkopf Jahrgang', ort: 'Herkunft', zweit: 'Zweite Grösse (Menge | Preis)', dazu: 'Zusatzzeilen (fortgeschritten)', art: 'Art' };
const VERSTECKT = new Set(['kl', 'band', 'stil', 'fuss', 'mm', 'breite', 'datei', 'hoehe', 'code', 'teile', 'klein', 'chf_spalte']);
const ART = { fluss: 'Eintrag' };
const FN = { rubrik: 'Rubrik', gericht: 'Gericht', zusatz: 'Zusatzzeile', hinweis: 'Hinweis', h1: 'Titel', h2: 'Überschrift', h3: 'Zwischentitel', p: 'Text', wein: 'Wein', offen: 'Offener Wein', w: 'Wein', d: 'Getränk', iv: 'Inhaltszeile', prod: 'Produzent', gruppe: 'Gruppe', dreisprachig: 'Text in drei Sprachen', liste: 'Liste', tabelle: 'Tabelle', foto: 'Foto', wkopf: 'Spaltenkopf', gkopf: 'Spaltenkopf', seite: 'Seite', blatt: 'Seite', block: 'Block', zeichen: 'Zeichen' };
const FEST = new Set(['foto', 'wkopf', 'gkopf', 'zeichen', 'tabelle']);
function angaben(n) { return SATZ.angaben(n); }
function titelVon(n) {
  const { w } = angaben(n);
  for (const k of ['name', 'de', 'text', 'titel', 'texte', 'punkte', 'herkunft', 'ort']) {
    let v = w[k]; if (Array.isArray(v)) v = v[0];
    if (Array.isArray(v)) v = v[0];
    if (typeof v === 'string' && v.trim() && n.fn !== 'foto') return SATZ.t(v).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '’').replace(/\s+/g, ' ').trim();
  }
  return FN[n.fn] || n.fn;
}
function unterVon(n) {
  const { w } = angaben(n);
  const t = x => Array.isArray(x) ? x.map(t).join(' · ') : String(x ?? '');
  if (n.fn === 'gericht') { const de = Array.isArray(w.de) ? w.de[1] : ''; return de || ''; }
  if (n.fn === 'rubrik') return (w.andere || []).filter(Boolean).join(' · ');
  if (n.fn === 'wein' || n.fn === 'offen') return [w.herkunft, w.farbe, w.traube].filter(Boolean).join(' · ');
  if (n.fn === 'w') return (w.haus || []).concat(w.trauben || []).join(' · ');
  if (n.fn === 'd') return w.unter || '';
  if (n.fn === 'prod') return w.ort || '';
  return '';
}
function preisVon(n) {
  const { w } = angaben(n);
  if (n.fn === 'gericht') return [w.preis, w.mass].filter(Boolean).join(' · ') + (w.zweit ? ' · ' + w.zweit.join(' ') : '');
  if (n.fn === 'wein') return (w.preise || []).map(p => p.join(' ')).join(' · ');
  if (n.fn === 'offen') return w.preis || '';
  if (n.fn === 'w') return (w.zeilen || []).map(z => z[2]).join(' · ');
  if (n.fn === 'd') return w.chf ? String(w.chf) : '';
  if (n.fn === 'zusatz') return w.preis || '';
  if (n.fn === 'iv') return String(w.nr ?? '');
  return '';
}

/* Zeilen der Liste je Seite */
function zeilenSeite(i) {
  const s = D.seiten[i], aus = [];
  const geh = (arrPfad, arr, tiefe) => arr.forEach((x, idx) => {
    if (!istKnoten(x) || ['luft', 'feder'].includes(x.fn)) return;
    const pfad = arrPfad + '.' + idx;
    if (x.fn === 'block') return geh(pfad + '.a', x.a, tiefe);
    aus.push({ pfad, n: x, tiefe, arr: arrPfad });
    if (x.fn === 'gruppe') geh(pfad + '.a', x.a, tiefe + 1);
  });
  geh('seiten.' + i + '.a', s.a, 0);
  return aus;
}

// ---------------------------------------------------------------- Vergleich Stand ↔ Entwurf
function eintraege(d) {
  const aus = [];
  const T = x => String(x ?? '').replace(/\*\*|__|~/g, '');
  if (d.art === 'mittag') {
    const w = d.woche;
    aus.push({ key: 'woche', ort: 'Woche', text: `<b>Woche ab ${h(SATZ.MITTAG.tagName(w.ab, 0))}</b><span>${h(w.zeiten)}</span><span>${h(w.preis)} ${h(w.zusatz)}</span>` });
    w.tage.forEach((t, i) => aus.push({ key: 'tag' + i, ort: SATZ.MITTAG.tagName(w.ab, i), text: t.zu ? `<b>${h(SATZ.MITTAG.TAGE[i])}</b><span>kein Mittagsmenü ${h(t.hinweis)}</span>` : `<b>${h(SATZ.MITTAG.TAGE[i])}</b>` + SATZ.MITTAG.GAENGE.filter(g => t[g[0]]).map(g => `<span>${h(g[1])}: ${h(t[g[0]])}</span>`).join('') }));
    return aus;
  }
  d.seiten.forEach((s, i) => {
    if (d.art === 'bankett') {
      if (s.titel) aus.push({ key: 'titel|' + s.titel, ort: 'Seite ' + (i + 1), text: `<b>${h(s.titel)}</b>` });
      s.spalten.forEach((sp, j) => (sp.oben || []).concat(sp.unten || []).forEach(u => aus.push({ key: u.t + '|' + u.text, ort: `Seite ${i + 1}, Spalte ${j + 1}`, text: `<span>${h(u.text)}</span>${u.aus ? '<i class="chip grau">ausgeblendet</i>' : ''}` })));
      return;
    }
    const ort = 'Seite ' + (i + 1);
    const geh = (arr) => arr.forEach(x => {
      if (!istKnoten(x)) return;
      if (x.fn === 'block' || x.fn === 'gruppe') geh(x.a);
      if (['block', 'luft', 'feder'].includes(x.fn)) return;
      const t = titelVon(x);
      const ohne = JSON.parse(JSON.stringify(x)); delete ohne.lage;
      aus.push({ key: x.fn + '|' + t, ort, text: `<b>${h(T(t))}</b>${unterVon(x) ? `<span>${h(T(unterVon(x)))}</span>` : ''}${preisVon(x) ? `<span class="mono">${h(preisVon(x))}</span>` : ''}${x.aus ? '<i class="chip grau">ausgeblendet</i>' : ''}`, json: JSON.stringify(ohne) });
    });
    if (s.aus) aus.push({ key: 'seite|' + i, ort, text: '<i class="chip grau">Seite ausgeblendet</i>' });
    geh(s.a);
  });
  return aus;
}
function vergleich(a, b) {
  const A = eintraege(a), B = eintraege(b), n = A.length, m = B.length;
  const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i].key === B[j].key ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const aus = [], wegA = [], neuB = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i].key === B[j].key) { if ((A[i].json || A[i].text) !== (B[j].json || B[j].text)) aus.push({ art: 'anders', a: A[i], b: B[j] }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) wegA.push(A[i++]); else neuB.push(B[j++]);
  }
  while (i < n) wegA.push(A[i++]); while (j < m) neuB.push(B[j++]);
  wegA.slice().forEach(x => { const k = neuB.findIndex(y => y.key === x.key); if (k >= 0) { const y = neuB.splice(k, 1)[0]; wegA.splice(wegA.indexOf(x), 1); aus.push({ art: (x.json || x.text) === (y.json || y.text) ? 'verschoben' : 'anders', a: x, b: y }); } });
  wegA.forEach(x => aus.push({ art: 'weg', a: x })); neuB.forEach(y => aus.push({ art: 'neu', b: y }));
  const na = lageAnders(a, b); if (na) aus.push({ art: 'anordnung', n: na, b: { ort: 'Auf den Seiten' } });
  return aus;
}
function zustand() {   // je Eintrag im Entwurf: neu / anders (Schlüssel: Titel)
  const st = {};
  if (!STAND || D.art === 'mittag') return st;
  vergleich(STAND, D).forEach(v => { if (v.b) st[v.b.key] = v.art; });
  return st;
}

// ---------------------------------------------------------------- Kopfleiste, Rand, Kopf
function wann() { return WER && ROLLE ? `${WER}` : 'Wer sind Sie?'; }
function oben() {
  const el = $('#oben'); if (!el) return;
  const k = LISTE.find(x => x.ziel === Z) || {}, g = D && geaendert();
  const BUCH = '<svg viewBox="0 0 16 16"><path d="M2.5 3.2c2-.8 3.8-.6 5.5.6 1.7-1.2 3.5-1.4 5.5-.6v9.6c-2-.8-3.8-.6-5.5.6-1.7-1.2-3.5-1.4-5.5-.6z"/><path d="M8 3.8v9.6"/></svg>';
  const WELT = '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.800"/><path d="M2.400 8h11.200M8 2.200c1.600 1.600 2.400 3.600 2.400 5.800S9.600 12.200 8 13.800C6.400 12.200 5.600 10.200 5.600 8S6.400 3.800 8 2.200z"/></svg>';
  const LISTEI = '<svg viewBox="0 0 16 16"><path d="M3 4h10M3 8h10M3 12h6"/></svg>';
  const HAUSI = '<svg viewBox="0 0 16 16"><path d="M2.6 7.4 8 2.8l5.4 4.6"/><path d="M4 6.4v6.8h8V6.4M6.6 13.2V9.6h2.8v3.6"/></svg>';
  const PULT = '<svg viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="8.5" rx="1.4"/><path d="M5.5 14h5M8 11.5V14"/></svg>';
  el.innerHTML = `<a class="oben__marke" href="/_werkzeuge/carte/"><img class="ecke__ce" src="../../assets/img/ce-gold-320.webp" alt="" width="320" height="206" decoding="async"><span><b>La Carte</b><small>Karten · Carlton-Europe</small></span></a>
    <div class="oben__mitte"><div class="oben__titel">${h(k.name || 'La Carte')}</div><div class="oben__stand">${OFFEN ? 'Nicht gespeichert' : g ? 'Entwurf wartet' : k.pdf_zeit ? 'PDF vom ' + h(k.pdf_zeit) : 'Website zeigt die PDF des Hauses'}</div></div>
    <div class="oben__werk"><a class="rund" href="${HAUS}maison/" data-tip="La Maison" aria-label="Zurück zu La Maison" title="La Maison">${HAUSI}</a><a class="rund" href="/_werkzeuge/carte/anleitung.html" target="_blank" rel="noopener" data-tip="Anleitung" aria-label="Anleitung" title="Anleitung">${BUCH}</a><a class="rund" href="${HAUS}control/" target="_blank" rel="noopener" data-tip="Le Bureau" aria-label="Le Bureau" title="Le Bureau">${PULT}</a><button class="rund" type="button" data-akt="protokoll" data-tip="Protokoll" aria-label="Protokoll" title="Protokoll">${LISTEI}</button>
      <button class="zustand${STATUS_ROT ? ' rot' : ''}" type="button" data-akt="gesund"><span>${STATUS_ROT ? 'Prüfen' : 'Alles in Ordnung'}</span></button>
      <span class="oben__trenn"></span>
      <a class="kn kn--klein kn--gold oben__web" href="${HAUS}${SEITE_DER_KARTE[Z] || 'essen-trinken.html'}" target="_blank" rel="noopener">Website ansehen<i>${WELT}</i></a></div>`;
}
let STATUS_ROT = false, SATZ_ZEICHEN = { CE: '' };
function rand() {
  $('#rand').innerHTML = `
    <div class="karten"><p class="kap">Ihre Karten</p>${LISTE.map(k => `<button class="kw" type="button" data-z="${k.ziel}" aria-current="${k.ziel === Z}"><span class="kw__f" style="background-image:url('/_werkzeuge/carte/kachel/${FOTO[k.ziel] || 'beizli'}.webp')"></span><b>${h(k.name)}</b><small>${h(k.gruppe)} · ${k.seiten} ${k.seiten === 1 ? 'Seite' : 'Seiten'}</small>${k.entwurf || (k.ziel === Z && D && geaendert()) ? '<i>Entwurf</i>' : ''}</button>`).join('')}</div>
    <div class="modus" role="group" aria-label="Art der Bearbeitung"><button type="button" data-m="einfach" aria-pressed="${MODUS === 'einfach'}">Einfach</button><button type="button" data-m="frei" aria-pressed="${MODUS === 'frei'}">Fortgeschritten</button></div>
    <p class="modus__t">${MODUS === 'einfach' ? (Z === 'mittag' ? 'Jede Woche ein Formular: je Tag Salat oder Suppe, Vegetarisch, Fleisch, Fisch und ein Dessert. Rechts steht sofort die Tageskarte.' : 'Gerichte und Getränke in einer Liste: hinzufügen, ändern, ausblenden, entfernen, verschieben. Ein Klick zeigt den Eintrag links und rechts auf derselben Höhe.') : 'Sie gestalten direkt in der Karte: jedes Element verschieben, grösser oder kleiner ziehen, jeden Text ändern, auch Überschriften, Hinweise, Logo und Band. Dazu die Daten der Karte als Text.'}</p>
    <div class="wege"><p class="kap">Wege</p>
      <button type="button" data-akt="verlauf">Frühere Fassungen <span>↺</span></button>
      <a href="${API}pdf?z=${Z}&q=live" target="_blank" rel="noopener">Veröffentlichte PDF <span>↗</span></a>
      <a href="${HAUS}unterlagen/" target="_blank" rel="noopener">Unterlagen ansehen <span>↗</span></a>
      <a href="${HAUS}werkbank/" target="_blank" rel="noopener">Alles auf einen Blick <span>↗</span></a>
      <a href="${HAUS}${SEITE_DER_KARTE[Z] || 'essen-trinken.html'}" target="_blank" rel="noopener">${Z === 'hundespeisekarte' ? 'Hunde' : Z === 'bankettmenus' ? 'Feiern und Tagen' : 'Restaurant und Bar'} auf der Website <span>↗</span></a>
      <button type="button" data-akt="einst">Anschluss an die Website <span>⚙</span></button></div>`;
  oben();
}
/* Kopf jeder Ansicht als Bühne (Werkbank 15.10.2026: «mehr Bühne, Hausfoto, edle Typografie mit Auftritt»): Foto des Ortes über die volle Breite,
   darauf eine helle Tafel mit dem Zeichen, dem Titel aus der Maske, einem Satz und den Angaben gross (Master 2.9 Nr. 9). Auftritt nur beim Wechsel der Karte. */
const SATZ_KOPF = {
  einfach: 'Ein Klick auf einen Eintrag zeigt ihn links und rechts auf derselben Höhe und lässt ihn kurz aufblinken; Doppelklick oder der Stift öffnet ihn. Jede Änderung wird sofort als Entwurf gespeichert und steht rechts in der Karte. PDF und Website bleiben, wie sie sind, bis Sie unten auf «Veröffentlichen» drücken.',
  mittag: 'Für jeden Tag die Gerichte eintragen. Jede Eingabe steht sofort rechts auf der Tageskarte und wartet als Entwurf, bis Sie die Woche veröffentlichen.',
  frei: 'Ein Klick wählt ein Element der Karte. Ziehen verschiebt es, die Ecken machen es grösser oder kleiner, ein Doppelklick schreibt in den Text, rechts gestalten Sie Schrift, Farbe und Linie. ⌘Z nimmt zurück. Neue Gerichte und Rubriken legen Sie im Modus «Einfach» an.',
};
function kopf() {
  // Robert 18.10.2026 18:5x «die kategorie wechsel reagieren sehr schwach … und es dauert»: der Auftritt nur beim ersten Öffnen, beim Wechsel steht der neue Kopf sofort
  const k = LISTE.find(x => x.ziel === Z) || {}, erst = kopf.letzte === undefined, neu = erst && kopf.letzte !== Z; kopf.letzte = Z;
  const datum = k.pdf_zeit ? k.pdf_zeit.slice(0, 6) : (k.stand_zeit ? k.stand_zeit.slice(8, 10) + '.' + k.stand_zeit.slice(5, 7) + '.' : '');
  const format = D && D.format === 'A4q' ? 'A4 quer' : 'A4';
  const zahlen = [[k.seiten || 0, (k.seiten === 1 ? 'Seite' : 'Seiten') + ' in der PDF'], [format, 'Format'], [datum || '–', k.pdf_zeit ? 'PDF vom' : 'Stand vom']];
  $('#kopf').innerHTML = `<div class="buehne${neu ? ' auftritt' : erst ? '' : ' wechsel'}">
    <div class="buehne__foto"><img data-src="/assets/img/${FOTO[Z] || 'beizli'}-l.webp" alt="" decoding="async"></div>
    <div class="buehne__tafel">
      <span class="kopf__z">${CE.replace('></svg>', `>${SATZ_ZEICHEN.CE}</svg>`).replace('class="ce"', '')}</span>
      <h1><span class="maske"><span>${h(k.name || '')}<em>.</em></span></span></h1>
      <p class="buehne__ort">${h(k.gruppe || '')} · ${MODUS === 'einfach' ? (Z === 'mittag' ? 'Wochenformular' : 'Einfach') : 'Fortgeschritten'}</p>
      <p class="satz">${Z === 'mittag' && D && D.woche && D.woche.beispiel ? '<span class="kopf__bsp"><b>Beispielwoche:</b> die Gerichte stammen aus der Speisekarte des Hauses und stehen hier, bis Sie die erste eigene Woche eintragen. </span>' : ''}${SATZ_KOPF[MODUS === 'frei' ? 'frei' : Z === 'mittag' ? 'mittag' : 'einfach']}</p>
      <div class="buehne__unten"><div class="buehne__zahlen">${zahlen.map(([z, t], i) => `<div style="--i:${i}"><b>${h(String(z))}</b><span>${h(t)}</span></div>`).join('')}</div>
      <div class="kopf__kn">${Z === 'mittag' && MODUS === 'einfach' ? `<button class="kn kn--hell" type="button" data-akt="mw-vor">Woche davor</button><button class="kn" type="button" data-akt="mw-neu">Nächste Woche<i>${SYM.plus}</i></button>` : MODUS === 'einfach' ? `<button class="kn" type="button" data-akt="neu">Neuer Eintrag<i>${SYM.plus}</i></button>` : `<button class="kn kn--hell" type="button" data-akt="daten">Daten der Karte<i>${PF}</i></button>`}</div></div>
    </div></div>`;
  if (!erst) buehneFoto(); else setTimeout(buehneFoto, 2500);   // beim Wechsel sofort; beim ersten Öffnen spätestens dann; sonst sobald die Karte rechts steht (Slow 4G: erst die Karte, dann das Foto)
}
function buehneFoto() {
  const i = $('.buehne__foto img[data-src]'); if (!i) return;
  i.onload = i.onerror = () => { i.classList.add('da'); i.parentElement.classList.add('da'); }; i.src = i.dataset.src; i.removeAttribute('data-src');
}

// ---------------------------------------------------------------- Liste (Einfach)
/* Bilder in jeder Liste (Robert 19.10.2026): jede Rubrik mit ihrem Foto; ein Gericht nur mit einem Foto, das wirklich dieses Gericht zeigt (aus /assets/js/listenbilder.js) */
function rbild(rubrik, t) {
  const b = window.kartenBild ? window.kartenBild('*', rubrik ? 'g' : 'z', String(t || '').replace(/\*\*|__|~/g, '')) : '';
  return b ? `<span class="r__b${rubrik ? ' r__b--rubrik' : ''}" aria-hidden="true"><img src="${b}" alt="" loading="lazy" decoding="async"></span>` : '';
}
function reiheHTML(r, st, ersteLetzte) {
  const n = r.n, t = titelVon(n), u = unterVon(n), p = preisVon(n);
  const chip = st[n.fn + '|' + t] === 'neu' ? '<i class="chip">Neu</i>' : st[n.fn + '|' + t] === 'anders' ? '<i class="chip">Geändert</i>' : st[n.fn + '|' + t] === 'verschoben' ? '<i class="chip grau">Verschoben</i>' : '';
  const aus = n.aus ? '<i class="chip grau">Ausgeblendet</i>' : '';
  const fest = FEST.has(n.fn);
  const k = `<div class="r__k">${n.fn === 'rubrik' ? '<button class="kn kn--klein" type="button" data-akt="neu-hier">Eintrag hinzufügen<i>${SYM.plus}</i></button>' : ''}${fest ? '' : `<button class="rund" type="button" data-akt="edit" title="Bearbeiten" aria-label="Bearbeiten">${SYM.stift}</button><button class="rund" type="button" data-akt="kopie" title="Kopieren" aria-label="Kopieren">${SYM.kopie}</button>`}<button class="rund" type="button" data-akt="hoch" title="Nach oben" aria-label="Nach oben">${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" title="Nach unten" aria-label="Nach unten">${SYM.runter}</button><button class="rund" type="button" data-akt="aus" title="${n.aus ? 'Wieder zeigen' : 'Ausblenden'}" aria-label="Ausblenden">${n.aus ? SYM.augezu : SYM.auge}</button><button class="rund gefahr" type="button" data-akt="weg" title="Entfernen" aria-label="Entfernen">${SYM.korb}</button></div>`;
  const kl = ['r', n.aus ? 'aus' : '', n.fn === 'rubrik' ? 'r--rubrik' : '', ['h1', 'h2', 'h3', 'iv', 'wkopf', 'gkopf'].includes(n.fn) ? 'r--klein' : '', ['p', 'hinweis', 'dreisprachig', 'liste'].includes(n.fn) ? 'r--text' : '', fest ? 'r--fest' : '', r.tiefe ? 'r--tief' + Math.min(2, r.tiefe) : ''].filter(Boolean).join(' ');
  return `<div class="${kl}" data-pfad="${h(r.pfad)}">${rbild(n.fn === 'rubrik', t)}<div class="r__t" data-akt="waehle"><b>${h(t.replace(/\*\*|__|~/g, ''))}</b>${n.fn === 'rubrik' && u ? `<small>${h(u)}</small>` : ''}${chip}${aus}${n.fn !== 'rubrik' && u ? `<span>${h(u)}</span>` : ''}</div><span class="r__p">${h(p)}</span>${fest ? '' : k}</div>`;
}
function reiheBankett(u, pfad, arr) {
  const kl = { titel: 'Titel', zw: 'Zwischentitel', preis: 'Preis', marke: 'Marke', klein: 'Klein', buch: 'Buchung', paket: 'Paketpreis', zeile: 'Zeile', orn: 'Zierzeichen' };
  const k = `<div class="r__k">${u.t === 'titel' ? '<button class="kn kn--klein kn--hell" type="button" data-akt="neu-hier">Zeile hinzufügen</button>' : ''}<button class="rund" type="button" data-akt="edit" title="Bearbeiten" aria-label="Bearbeiten">${SYM.stift}</button><button class="rund" type="button" data-akt="kopie" aria-label="Kopieren">${SYM.kopie}</button><button class="rund" type="button" data-akt="hoch" aria-label="Nach oben">${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" aria-label="Nach unten">${SYM.runter}</button><button class="rund" type="button" data-akt="aus" aria-label="Ausblenden">${u.aus ? SYM.augezu : SYM.auge}</button><button class="rund gefahr" type="button" data-akt="weg" aria-label="Entfernen">${SYM.korb}</button></div>`;
  const titel = u.t === 'orn' ? '◆' : u.text;
  return `<div class="r${u.aus ? ' aus' : ''}${u.t === 'titel' ? ' r--rubrik' : ''}${u.t === 'zw' ? ' r--klein' : ''}" data-pfad="${h(pfad)}">${rbild(u.t === 'titel', titel)}<div class="r__t" data-akt="waehle"><b>${h(titel)}</b>${u.t !== 'zeile' ? `<small>${h(kl[u.t] || u.t)}</small>` : ''}${u.aus ? '<i class="chip grau">Ausgeblendet</i>' : ''}</div><span class="r__p"></span>${k}</div>`;
}
function wocheHTML() {
  const w = D.woche, M = SATZ.MITTAG, n = w.tage.length;
  const f = (pfad, titel, wert, ph = '') => `<label class="feld"><span>${titel}</span><textarea class="mw-t" rows="1" data-mw="${pfad}"${ph ? ` placeholder="${h(ph)}"` : ''}>${h(wert)}</textarea></label>`;
  const tage = w.tage.map((t, i) => `<div class="teil mw-tag${t.zu ? ' mw-tag--zu' : ''}" style="--i:${i}"><div class="mw-in">
      <p class="mw-name">${h(M.tagName(w.ab, i))}</p>
      ${t.zu ? f(`tage.${i}.hinweis`, 'Hinweis auf der Karte', t.hinweis, 'An diesem Tag gibt es kein Mittagsmenü.') : `
      <p class="mw-gang">Vorspeise</p><div class="feld zw2">${f(`tage.${i}.salat`, 'Salat', t.salat)}${f(`tage.${i}.suppe`, 'oder Suppe', t.suppe)}</div>
      <p class="mw-gang">Hauptgang</p><div class="feld zw3">${f(`tage.${i}.vegi`, 'Vegetarisch', t.vegi)}${f(`tage.${i}.fleisch`, 'Fleisch', t.fleisch)}${f(`tage.${i}.fisch`, 'Fisch', t.fisch)}</div>
      <p class="mw-gang">Dessert</p>${f(`tage.${i}.dessert`, 'Gericht', t.dessert)}`}
      <div class="feld"><span class="schalter" role="switch" tabindex="0" aria-checked="${!!t.zu}" data-akt="tagzu" data-i="${i}"><b></b>An diesem Tag kein Mittagsmenü</span></div>
    </div></div>`).join('');
  return `<div class="teil"><div class="mw-in"><p class="mw-name">Woche ab Montag</p>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><button class="rund" type="button" data-akt="woche" data-r="-1" aria-label="Eine Woche zurück">${SYM.links}</button><b style="font-family:var(--serif);font-weight:400;font-size:18px">${h(M.spanne(w.ab, n))}</b><button class="rund" type="button" data-akt="woche" data-r="1" aria-label="Eine Woche weiter">${SYM.rechts}</button>
      <button class="kn kn--klein" type="button" data-akt="woche-neu">Nächste Woche anlegen<i>${SYM.plus}</i></button></div></div></div>${tage}
    <div class="teil"><div class="mw-in"><p class="mw-name">Für jede Woche gleich</p>
      ${f('zeiten', 'Zeiten', w.zeiten)}<div class="feld zw2">${f('preis', 'Preis', w.preis)}${f('zusatz', 'Dazu', w.zusatz)}</div>${f('spruch', 'Zeile am Schluss', w.spruch)}${f('fuss', 'Fusszeile', w.fuss || '', 'Leer: das Zeichen des Hauses')}
    </div></div>`;
}
function liste() {
  const el = $('#liste');
  if (Z === 'mittag') { el.innerHTML = wocheHTML(); mwWachsen(); return; }
  const st = zustand();
  el.innerHTML = D.seiten.map((s, i) => {
    let inn = '';
    if (D.art === 'bankett') {
      inn = (s.titel !== undefined ? `<div class="r r--rubrik" data-pfad="seiten.${i}.titel"><div class="r__t" data-akt="edit-seitentitel"><b>${h(s.titel || 'Ohne Seitentitel')}</b><small>Titel der Seite</small></div></div>` : '') +
        s.spalten.map((sp, j) => `<div class="r r--klein r--fest"><div class="r__t"><b>Spalte ${j + 1}</b></div></div>` + (sp.oben || []).map((u, k) => reiheBankett(u, `seiten.${i}.spalten.${j}.oben.${k}`)).join('') + (sp.unten || []).map((u, k) => reiheBankett(u, `seiten.${i}.spalten.${j}.unten.${k}`)).join('')).join('');
    } else inn = zeilenSeite(i).map(r => reiheHTML(r, st)).join('') + `<div class="neu-zeile"><button class="kn kn--klein" type="button" data-akt="neu-ende" data-i="${i}">Eintrag am Ende<i>${SYM.plus}</i></button><button class="kn kn--klein" type="button" data-akt="rubrik-neu" data-i="${i}">Neue Rubrik<i>${SYM.plus}</i></button></div>`;
    return `<div class="teil${s.aus ? ' aus' : ''}" data-teil="${i}" style="--i:${Math.min(i, 6)}"><div class="teil__k"><b>Seite ${i + 1}</b><span>${D.art === 'bankett' ? 'drei Spalten' : zeilenSeite(i).length + ' Einträge'}</span><div style="display:flex;gap:6px"><button class="rund" type="button" data-akt="s-hoch" data-i="${i}" aria-label="Seite nach vorn">${SYM.hoch}</button><button class="rund" type="button" data-akt="s-runter" data-i="${i}" aria-label="Seite nach hinten">${SYM.runter}</button><button class="rund" type="button" data-akt="s-aus" data-i="${i}" aria-label="Seite ausblenden">${s.aus ? SYM.augezu : SYM.auge}</button></div></div>${inn}</div>`;
  }).join('');
  if (BLITZ) { const r = $(`.r[data-pfad="${BLITZ}"]`); if (r) { r.classList.add('blitz'); r.scrollIntoView({ block: 'nearest' }); } BLITZ = null; }
}

// ---------------------------------------------------------------- Vorschau (Rahmen blatt.html)
/* Ansicht «Website» (wie GBR): die Seite der Website, auf der diese Karte hängt; die Stelle mit der PDF blinkt. Die Website ist abgenommen,
   La Carte ändert sie nur mit dem Anschluss (PDF), deshalb zeigt die Ansicht die Seite, wie sie heute ist. */
function website() {
  const an = ANSICHT === 'website';
  $('#vf').hidden = an; $('#web').hidden = !an;
  $$('.ansicht button').forEach(b => b.setAttribute('aria-pressed', b.dataset.ansicht === ANSICHT));
  if (!an) return vorschau();
  const seite = SEITE_DER_KARTE[Z] || 'essen-trinken.html', f = $('#web-f');
  $('#v-zahl').textContent = 'Website heute'; $('#v-warn').hidden = true;
  f.onload = () => {
    try {
      const d = f.contentDocument; d.querySelectorAll('[data-r]').forEach(x => x.classList.add('da'));
      const a = d.querySelector(`a[href*="pdf/${Z}.pdf"]`);
      if (a) { a.scrollIntoView({ block: 'center' }); a.style.transition = 'box-shadow .4s'; a.style.boxShadow = '0 0 0 4px rgba(220,198,143,.95)'; setTimeout(() => { a.style.boxShadow = ''; }, 2400); $('#v-zahl').textContent = 'Website heute · hier hängt die Karte'; }
      else $('#v-zahl').textContent = Z === 'mittag' ? 'Website heute · das Mittagsmenü hat dort noch keinen Platz' : 'Website heute';
    } catch (e) { /* gleiche Herkunft, sollte gehen */ }
  };
  if (f.dataset.z !== Z) { f.dataset.z = Z; f.src = '/' + seite; } else f.onload();
}
function vorschau() {
  if (ANSICHT === 'website') return;
  const f = $('#vf');
  if (!BEREIT || !f.contentWindow || !D) return;
  f.contentWindow.postMessage({ carte: 'setze', daten: D, modus: MODUS, zoom: ZM[MODUS], geschrieben: GESCHRIEBEN, wahl: MODUS === 'frei' ? WAHLID : null, neu: NEU_KARTE }, location.origin);
  NEU_KARTE = false;
}
window.addEventListener('message', ev => {
  if (ev.origin !== location.origin || !ev.data || !ev.data.carte) return;
  const m = ev.data;
  if (m.carte === 'bereit') { BEREIT = true; vorschau(); }
  if (m.carte === 'gesetzt') {
    buehneFoto();
    BERICHT = m.bericht;
    const n = m.bericht.seiten;
    $('#v-zahl').textContent = `${n} ${n === 1 ? 'Seite' : 'Seiten'}, wie in der PDF`;
    const w = $('#v-warn'), t = m.bericht.fehler.concat(m.bericht.warn);
    w.hidden = !t.length; w.textContent = t.length ? '⚠ ' + t[0] : ''; w.title = t.join('\n');
  }
  if (m.carte === 'fehler') sag('Vorschau', m.text, [], true);
  if (m.carte === 'klick' && MODUS === 'einfach' && Z !== 'mittag') waehleAusVorschau(m.pfad);
  if (m.carte === 'klick' && MODUS === 'einfach' && Z === 'mittag') mwAusVorschau(m.pfad);
  if (m.carte === 'doppel' && MODUS === 'einfach' && Z !== 'mittag') oeffneAusVorschau(m.pfad);
  if (m.carte === 'text' && MODUS === 'frei') { if (Z === 'mittag') { if (!mittagSchreiben(m.pfad, m.wert)) return; } else setzePfad(D, m.pfad, m.wert); GESCHRIEBEN.push(m.pfad); TEXTGEAENDERT = true; OFFEN = inhalt(D) !== BASIS; clearTimeout(TIMER); leiste(); oben(); }
  if (m.carte === 'speichern' && OFFEN) speichern('Im Entwurf gespeichert');
  if (m.carte === 'wahl' && MODUS === 'frei') { WAHLINFO = m.info; WAHLID = m.info ? m.info.id : null; if (!m.still) GST_OFFEN = !!m.info; seitenleiste(); }
  if (m.carte === 'lage' && MODUS === 'frei') { merken(stand()); setz(m.id, m.v); geaendertAnzeigen(); if (m.id === WAHLID) seitenleiste(); }
  if (m.carte === 'entf' && MODUS === 'frei') entf(m.id);
  if (m.carte === 'taste' && MODUS === 'frei') { if (m.was === 'zurueck') zurueckNehmen(); else if (m.was === 'vor') wiederholen(); else if (m.was === 'esc') abwaehlen(); }
  if (m.carte === 'taste' && m.was === 'speichern') { if (OFFEN) speichern('Im Entwurf gespeichert'); }
  if (m.carte === 'seite-zurueck' && MODUS === 'frei') { const vor = stand(); m.ids.forEach(id => setz(id, { x: 0, y: 0, s: 1 })); if (stand() !== vor) { merken(vor); WAHLID = null; neuSetzen(); sag('Anordnung zurückgesetzt', `Seite ${m.seite} steht wieder wie gesetzt. ⌘Z holt sie zurück.`); } }
  if (m.carte === 'schreibt') SCHREIB_VOR = stand();
  if (m.carte === 'fertig-geschrieben' && SCHREIB_VOR != null) { if (stand() !== SCHREIB_VOR) merken(SCHREIB_VOR); SCHREIB_VOR = null; }
  if (m.carte === 'fertig-geschrieben' && TEXTGEAENDERT) { clearTimeout(TIMER); TIMER = setTimeout(() => { TEXTGEAENDERT = false; vorschau(); }, 200); }
});
/* Klick links oder rechts: die andere Seite springt auf dieselbe Stelle und blinkt kurz (Robert 15.10.2026) */
function eintragPfad(pfad) {   // Pfad eines Textes in der Karte → Pfad des Eintrags, den die Liste zeigt
  if (D.art === 'bankett') { const m = pfad.match(/^(seiten\.\d+\.spalten\.\d+\.(?:oben|unten)\.\d+)/); return m ? m[1] : (/^seiten\.\d+\.titel/.test(pfad) ? pfad.replace(/\.titel.*/, '.titel') : null); }
  const k = pfad.split('.'); let x = k.length;
  while (x > 2) { const kand = liesPfad(D, k.slice(0, x).join('.')); if (istKnoten(kand) && !['block', 'blatt', 'seite'].includes(kand.fn)) return k.slice(0, x).join('.'); x--; }
  return null;
}
function markiere(pfad) {
  const r = $(`#liste .r[data-pfad="${pfad}"]`), vor = r ? r.getBoundingClientRect().top : 0;
  $$('#liste .r.gewaehlt').forEach(x => { if (x !== r) x.classList.remove('gewaehlt'); });
  if (!r) return null;
  /* Fehlerbuch 10a (Schlössli 20.10.2026): die Knöpfe stehen unter dem gewählten Eintrag; die angeklickte Zeile bleibt an ihrem Platz */
  const nach = r.getBoundingClientRect().top; if (Math.abs(nach - vor) > 1) window.scrollBy(0, nach - vor);
  r.classList.add('gewaehlt'); r.classList.remove('blitz'); void r.offsetWidth; r.classList.add('blitz');
  return r;
}
function blitzRechts(pfad, y) {   // y: Höhe im Fenster, auf der die Zeile links steht (oder stehen wird); die Karte zieht auf dieselbe Höhe
  if (ANSICHT === 'website') return;
  const f = $('#vf'); f.contentWindow.postMessage({ carte: 'blitz', pfad, y: y == null ? null : y - f.getBoundingClientRect().top }, location.origin);
}
function linksMitte(r) {           // Zeile links mittig ins Fenster; liefert die Höhe, auf der sie danach steht
  const rr = r.getBoundingClientRect(), max = document.documentElement.scrollHeight - innerHeight;
  const ziel = Math.min(max, Math.max(0, scrollY + rr.top + rr.height / 2 - innerHeight / 2));
  window.scrollTo({ top: ziel, behavior: 'smooth' });
  return rr.top + rr.height / 2 - (ziel - scrollY);
}
function waehle(pfad) {       // aus der Liste: Karte rechts springt auf dieselbe Höhe
  const r = markiere(pfad); if (!r) return;
  const rr = r.getBoundingClientRect(); blitzRechts(pfad, rr.top + rr.height / 2);
}
function waehleAusVorschau(pfad) {   // aus der Karte: Liste links springt hin, Karte zieht auf dieselbe Höhe nach
  const np = eintragPfad(pfad); if (!np) return;
  const r = markiere(np); if (!r) return;
  blitzRechts(np, linksMitte(r));
}
/* ---------------------------------------------------------------- Freie Anordnung und Gestalten (Fortgeschritten), 1:1 nach La Carte des Grand Beau-Rivage
   (anordnen.js, 15./16.10.2026). Gewählt, gezogen und gezeigt wird in der Vorschau (blatt.js, ANR); hier liegen die Daten, der Verlauf für ⌘Z / ⌘⇧Z
   und die Seitenleiste «Gestalten» rechts (öffnet beim Wählen, × oder Esc schliesst, nie über der Karte).
   Wo die lage steht: Eintrag (Pfad «seiten.…») → n.lage, seine Linie («…:lin») → n.lage.lin; Bankett-Zeile → u.lage; Teile der Seite
   «b:» Band, «l:» Logo, «k:» Kopfzeile, «z:» Zeichen, «f:» Fusszeile, «s:» Titel der Seite → seite.lage[…]; Mittagsmenü → woche.lage['t<Tag>.<Rolle>'] bzw. ['t<Tag>#']. */
const HIST = [], ZUK = [];
let WAHLID = null, WAHLINFO = null, GST_OFFEN = false, SCHREIB_VOR = null;
const RUND = (x, n) => Math.round(x * n) / n;
const SEITENTEIL = { b: 'band', l: 'logo', k: 'kopf', z: 'zeichen', f: 'fuss', s: 'titel' };
function stand() { return JSON.stringify({ s: D.seiten, w: D.woche, c: D.css }); }
function merken(vor) { HIST.push(vor); if (HIST.length > 200) HIST.shift(); ZUK.length = 0; }
function zurueckHolen(x) { const j = JSON.parse(x); D.seiten = j.s; D.woche = j.w; D.css = j.c; OFFEN = inhalt(D) !== BASIS; leiste(); oben(); vorschau(); if (MODUS === 'einfach') liste(); }
function zurueckNehmen() { if (!HIST.length) return sag('Nichts zum Zurücknehmen'); ZUK.push(stand()); zurueckHolen(HIST.pop()); }
function wiederholen() { if (!ZUK.length) return sag('Nichts zum Wiederholen'); HIST.push(stand()); zurueckHolen(ZUK.pop()); }
function ort(id) {
  if (!id || !D) return null;
  const m = id.match(/^([blkzfs]):(\d+)$/);
  if (m) {
    const name = SEITENTEIL[m[1]];
    let wirt;
    if (Z === 'mittag') { const gen = SATZ.MITTAG.seiten(D.woche)[+m[2]]; if (!gen) return null; const W = () => (D.woche.lage = D.woche.lage || {}); wirt = { get: () => ((D.woche.lage || {})[gen.lk] || {})[name], set: v => { const w = W(); if (v) { w[gen.lk] = w[gen.lk] || {}; w[gen.lk][name] = v; } else if (w[gen.lk]) { delete w[gen.lk][name]; if (!Object.keys(w[gen.lk]).length) delete w[gen.lk]; } if (!Object.keys(w).length) delete D.woche.lage; } }; return wirt; }
    const s = D.seiten[+m[2]]; if (!s) return null;
    return { get: () => (s.lage || {})[name], set: v => { if (v) { s.lage = s.lage || {}; s.lage[name] = v; } else if (s.lage) { delete s.lage[name]; if (!Object.keys(s.lage).length) delete s.lage; } } };
  }
  const lin = /:lin$/.test(id), pf = id.replace(/:lin$/, '');
  if (Z === 'mittag') {
    const n = liesPfad({ seiten: SATZ.MITTAG.seiten(D.woche) }, pf); if (!n || !n.lk) return null;
    const W = () => (D.woche.lage = D.woche.lage || {}), weg = () => { if (D.woche.lage && !Object.keys(D.woche.lage).length) delete D.woche.lage; };
    if (lin) return { node: n, get: () => ((D.woche.lage || {})[n.lk] || {}).lin, set: v => { const w = W(); if (v) { w[n.lk] = w[n.lk] || {}; w[n.lk].lin = v; } else if (w[n.lk]) { delete w[n.lk].lin; if (!Object.keys(w[n.lk]).length) delete w[n.lk]; } weg(); } };
    return { node: n, get: () => { const x = Object.assign({}, (D.woche.lage || {})[n.lk] || {}); delete x.lin; return x; }, set: v => { const w = W(), l0 = (w[n.lk] || {}).lin, x = Object.assign({}, v || {}); if (l0) x.lin = l0; if (Object.keys(x).length) w[n.lk] = x; else delete w[n.lk]; weg(); } };
  }
  const u = liesPfad(D, pf); if (!u || typeof u !== 'object') return null;
  if (lin) return { u, get: () => (u.lage || {}).lin, set: v => { if (v) { u.lage = u.lage || {}; u.lage.lin = v; } else if (u.lage) { delete u.lage.lin; if (!Object.keys(u.lage).length) delete u.lage; } } };
  return { u, get: () => { const x = Object.assign({}, u.lage || {}); delete x.lin; return x; }, set: v => { const l0 = (u.lage || {}).lin, x = Object.assign({}, v || {}); if (l0) x.lin = l0; if (Object.keys(x).length) u.lage = x; else delete u.lage; } };
}
function roh(id) { const o = ort(id); return Object.assign({}, (o && o.get()) || {}); }
function liesLage(id) { const v = roh(id); return Object.assign(v, { x: +v.x || 0, y: +v.y || 0, s: +v.s || 1 }); }
function setz(id, patch) {   // Felder ändern, alles Neutrale fällt weg (null/leer = wie in der Vorlage), wie GBR anordnen.js setz()
  const o = ort(id); if (!o) return;
  if (/^b:/.test(id)) { const n = Object.assign(roh(id), patch); if (n.h != null) n.h = RUND(+n.h, 10); Object.keys(n).forEach(k => { if (n[k] == null || n[k] === '') delete n[k]; }); return o.set(Object.keys(n).length ? n : null); }
  const n = Object.assign(roh(id), patch);
  if (n.x != null) n.x = RUND(+n.x, 10); if (n.y != null) n.y = RUND(+n.y, 10);
  if (n.s != null) n.s = RUND(+n.s, 100); if (n.t != null) n.t = RUND(+n.t, 1000);
  [['b', 10], ['d', 100], ['z', 100], ['mt', 10], ['mb', 10]].forEach(([f, r]) => { if (n[f] != null && n[f] !== '') n[f] = RUND(+n[f], r); });
  if (Math.abs(n.x || 0) < 0.05) delete n.x; if (Math.abs(n.y || 0) < 0.05) delete n.y;
  if (n.s != null && Math.abs(n.s - 1) < 0.005) delete n.s; if (n.t != null && Math.abs(n.t - 1) < 0.002) delete n.t;
  Object.keys(n).forEach(k => { if (n[k] == null || n[k] === '' || n[k] === false) delete n[k]; });
  o.set(Object.keys(n).length ? n : null);
}
function geaendertAnzeigen() { OFFEN = inhalt(D) !== BASIS; leiste(); oben(); }
function neuSetzen() { geaendertAnzeigen(); vorschau(); }
function entf(id) {   // Entf: Einträge gehen von der Karte (wie «Ausblenden» im Modus Einfach), Linien, Zeichen und Teile der Seite werden unsichtbar
  const o = ort(id); if (!o) return;
  merken(stand());
  const eintrag = !/:lin$/.test(id) && !/^[blkzfs]:/.test(id) && Z !== 'mittag';
  if (eintrag && o.u) o.u.aus = true; else setz(id, { aus: true });
  WAHLID = null; GST_OFFEN = false; seitenleiste(); neuSetzen(); sag('Ausgeblendet', '⌘Z holt es zurück.');
}
function abwaehlen() { WAHLID = null; WAHLINFO = null; GST_OFFEN = false; seitenleiste(); const f = $('#vf'); if (f && f.contentWindow) f.contentWindow.postMessage({ carte: 'abwaehlen' }, location.origin); }

/* Seitenleiste «Gestalten» (GBR: «Schriftarten, Schriftgrösse und Textart ändern … so ein kleines Side-Menü»), Begriffe wie in L’Imprimerie */
const SCHRIFTEN = [['baskerville', 'Baskerville'], ['instrument', 'Instrument Sans'], ['mono', 'DM Mono'], ['montserrat', 'Montserrat']];
const TEXTART = [['normal', 'Normal'], ['kursiv', 'Kursiv'], ['versal', 'Versalien'], ['medium', 'Medium']];
const AUSR = [['links', 'Links'], ['mitte', 'Mitte'], ['rechts', 'Rechts']];
const FARBNAME = { navy: 'Marine', nacht: 'Nacht', tinte: 'Tinte', grau: 'Grau', messing: 'Messing', messingtief: 'Messing tief', gold: 'Gold', creme: 'Creme', papier: 'Papier', weiss: 'Weiss' };
const segment = (feld, liste, an, kl = '') => `<div class="gst-seg ${kl}">${liste.map(([k, t]) => `<button type="button" data-feld="${feld}" data-wert="${k}" class="${an === k ? 'an' : ''}"${feld === 'f' ? ` style="font-family:${SATZ.SCHRIFT[k].replace(/"/g, "'")}"` : ''}>${t}</button>`).join('')}</div>`;
const groesse = (feld, wert, einheit) => `<div class="gst-gr"><button type="button" data-schritt="${feld}" data-r="-1" aria-label="Kleiner">−</button><input type="text" inputmode="decimal" data-zahl="${feld}" value="${wert}"><span>${einheit}</span><button type="button" data-schritt="${feld}" data-r="1" aria-label="Grösser">+</button></div>`;
const farben = an => `<div class="gst-farben">${Object.entries(SATZ.FARBE).map(([k, v]) => `<button type="button" data-feld="c" data-wert="${k}" title="${FARBNAME[k] || k}" aria-label="${FARBNAME[k] || k}" style="background:${v}" class="${an === k ? 'an' : ''}"></button>`).join('')}</div>`;
const gruppe = (titel, html) => `<div class="gst-gruppe"><label>${titel}</label>${html}</div>`;
function seitenleiste() {
  let g = $('#gst');
  if (!g) {
    g = document.createElement('aside'); g.id = 'gst'; g.className = 'gst'; g.setAttribute('aria-label', 'Gestalten'); document.body.appendChild(g);
    g.addEventListener('click', klickLeiste); g.addEventListener('change', zahlLeiste);
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.matches('[data-zahl]')) { ev.preventDefault(); ev.target.blur(); } });
  }
  const an = MODUS === 'frei' && GST_OFFEN;
  document.body.classList.toggle('gst-offen', an);
  g.hidden = !an;
  if (!an) return;
  const kopf = `<div class="gst-kopf"><b>Gestalten</b><button type="button" class="gst-zu" data-tu="zu" aria-label="Leiste schliessen"><svg viewBox="0 0 14 14"><path d="m3 3 8 8M11 3l-8 8"/></svg></button></div>`;
  const i = WAHLINFO;
  if (!i) { g.innerHTML = kopf + '<p class="gst-leer">Ein Element der Karte anklicken: Rubrik, Gericht, Zeile, Hinweis, Linie, Logo, Band oder Fusszeile.</p>'; return; }
  const v = liesLage(WAHLID);
  let html = kopf + `<p class="gst-name">${h(i.name)}</p>`;
  if (i.art === 'linie') html += gruppe('Stärke', groesse('d', i.dicke.toFixed(2), 'mm')) + gruppe('Länge', groesse('b', i.laenge.toFixed(1), 'mm')) + gruppe('Farbe', farben(v.c));
  else if (i.art === 'zeichen') html += gruppe('Grösse', groesse('s', Math.round(v.s * 100), '%')) + gruppe('Farbe', farben(v.c));
  else if (i.art === 'band') html += gruppe('Höhe', groesse('h', (+roh(WAHLID).h || i.hoehe).toFixed(1), 'mm'));
  else {
    html += gruppe('Schriftart', segment('f', SCHRIFTEN, v.f, 'gst-seg--schrift')) + gruppe('Schriftgrösse', groesse('pt', i.pt.toFixed(1), 'pt'))
      + gruppe('Textart', segment('a', TEXTART, v.a)) + gruppe('Farbe', farben(v.c)) + gruppe('Ausrichtung', segment('al', AUSR, v.al))
      + gruppe('Zeilenabstand', groesse('z', (v.z || i.lh).toFixed(2), '×'));
    if (i.art === 'eintrag') html += gruppe('Abstand davor', groesse('mt', i.mt.toFixed(1), 'mm')) + gruppe('Abstand danach', groesse('mb', i.mb.toFixed(1), 'mm'));
  }
  html += `<div class="gst-fuss">${i.art === 'band' ? '' : '<button type="button" class="gst-kn" data-tu="aus">Entfernen</button>'}<button type="button" class="gst-kn" data-tu="vorlage">Teil zurücksetzen</button></div><p class="gst-tipp">${i.art === 'band' ? 'Höhe mit − und +, oder eine Zahl eingeben.' : `Ziehen verschiebt, die Ecken ändern die Grösse${i.art === 'linie' ? ', die Enden die Länge' : ''}. Entf entfernt, Esc schliesst, ⌘Z nimmt zurück.`}</p>`;
  g.innerHTML = html;
}
function aendern(patch, schrift) {   // eine Änderung aus der Leiste: merken, setzen, neu setzen (Schriftgrösse und Abstände verteilen die Seiten neu)
  if (!WAHLID) return;
  merken(stand()); setz(WAHLID, patch);
  if (schrift) document.fonts.load('16px ' + SATZ.SCHRIFT[schrift]).then(neuSetzen, neuSetzen); else neuSetzen();
}
function wertNeu(feld, zahl) {
  const i = WAHLINFO; if (!i || !isFinite(zahl)) return;
  const v = liesLage(WAHLID);
  if (feld === 'pt') { const alt = i.pt, nz = Math.max(4, Math.min(80, zahl)); if (Math.abs(nz - alt) < 0.05) return; return aendern(i.art === 'eintrag' ? { t: (+v.t || 1) * nz / alt } : { s: Math.max(0.4, Math.min(3, v.s * nz / alt)) }); }
  if (feld === 's') return aendern({ s: Math.max(0.4, Math.min(3, zahl / 100)) });
  if (feld === 'z') return aendern({ z: Math.max(0.8, Math.min(3, zahl)) });
  if (feld === 'mt' || feld === 'mb') return aendern({ [feld]: Math.max(-20, Math.min(60, zahl)) });
  if (feld === 'b') return aendern({ b: Math.max(2, Math.min(i.blattB, zahl)) });
  if (feld === 'd') return aendern({ d: Math.max(0.1, Math.min(3, zahl)) });
  if (feld === 'h') return aendern({ h: Math.max(4, Math.min(120, zahl)) });
}
const SCHRITT = { pt: 0.5, s: 10, z: 0.05, mt: 0.5, mb: 0.5, b: 1, d: 0.1, h: 1 };
function klickLeiste(ev) {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.tu === 'zu') return abwaehlen();
  if (b.dataset.tu === 'aus') return entf(WAHLID);
  if (b.dataset.tu === 'vorlage') { const o = WAHLID && ort(WAHLID); if (!o) return; merken(stand()); o.set(null); neuSetzen(); return sag('Wie in der Vorlage', '⌘Z holt die Gestaltung zurück.'); }
  if (b.dataset.feld) { const f = b.dataset.feld, w = b.dataset.wert, an = liesLage(WAHLID)[f] === w; return aendern({ [f]: an ? null : w }, f === 'f' && !an ? w : ''); }
  if (b.dataset.schritt) { const f = b.dataset.schritt, i = $(`#gst [data-zahl="${f}"]`); return wertNeu(f, parseFloat(String(i.value).replace(',', '.')) + (+b.dataset.r) * SCHRITT[f]); }
}
function zahlLeiste(ev) { const i = ev.target.closest('[data-zahl]'); if (i) wertNeu(i.dataset.zahl, parseFloat(String(i.value).replace(',', '.'))); }
/* Tasten im Werkzeug (der Zeiger ist nicht in der Vorschau): Pfeile, Entf, Esc, ⌘Z wie in der Karte */
document.addEventListener('keydown', ev => {
  if (MODUS !== 'frei' || !D || !$('#fenster').hidden) return;
  if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return;
  const cmd = ev.metaKey || ev.ctrlKey, k = ev.key.toLowerCase();
  if (cmd && k === 'z') { ev.preventDefault(); return ev.shiftKey ? wiederholen() : zurueckNehmen(); }
  if (cmd && k === 'y') { ev.preventDefault(); return wiederholen(); }
  if (!WAHLID) return;
  if (ev.key === 'Escape') return abwaehlen();
  if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); return entf(WAHLID); }
  if (/^Arrow/.test(ev.key)) { ev.preventDefault(); $('#vf').contentWindow.postMessage({ carte: 'pfeil', key: ev.key, shift: ev.shiftKey }, location.origin); }
});
/* Anordnung je Element, für «Vorher / nachher» (GBR lagen()): Schlüssel wie im Vergleich, gleiche Namen durchgezählt */
function lagen(d) {
  const m = {}, n = {};
  const nimm = (k, l) => { n[k] = (n[k] || 0) + 1; if (l && Object.keys(l).length) m[k + '#' + n[k]] = JSON.stringify(l); };
  if (d.art === 'mittag') { Object.entries((d.woche || {}).lage || {}).forEach(([k, l]) => nimm(k, l)); return m; }
  (d.seiten || []).forEach((s, i) => {
    Object.entries(s.lage || {}).forEach(([k, l]) => nimm('seite' + i + '|' + k, l));
    if (d.art === 'bankett') { s.spalten.forEach(sp => (sp.oben || []).concat(sp.unten || []).forEach(u => nimm(u.t + '|' + u.text, u.lage))); return; }
    const geh = arr => (arr || []).forEach(x => { if (!istKnoten(x)) return; if (x.lage) nimm(x.fn + '|' + titelVon(x), x.lage); geh(x.a); });
    geh(s.a);
  });
  return m;
}
function lageAnders(a, b) { const A = lagen(a), B = lagen(b); return new Set([...Object.keys(A), ...Object.keys(B)].filter(k => A[k] !== B[k])).size; }

/* Mittagsmenü: ein Text in der Karte gehört zu einem Feld der Woche (satz.js: w und vor); Gang-Namen und Tage sind fest */
function mittagSchreiben(pfad, wert) {
  const gen = { seiten: SATZ.MITTAG.seiten(D.woche) }, k = pfad.split('.');
  const knoten = liesPfad(gen, k.slice(0, -2).join('.'));
  if (!knoten || !knoten.w) return false;
  const vor = knoten.vor || '';
  setzePfad(D.woche, knoten.w, vor && wert.startsWith(vor) ? wert.slice(vor.length) : wert);
  return true;
}
function oeffneAusVorschau(pfad) {
  if (D.art === 'bankett') { const m = pfad.match(/^(seiten\.\d+\.spalten\.\d+\.(?:oben|unten)\.\d+)/); if (m) return eintragFenster(m[1]); const t = pfad.match(/^seiten\.\d+\.titel/); return t ? seitentitelFenster(pfad.replace(/\.titel.*/, '')) : null; }
  const k = pfad.split('.'); let x = k.length;
  while (x > 2) { const kand = liesPfad(D, k.slice(0, x).join('.')); if (istKnoten(kand) && !['block', 'blatt', 'seite'].includes(kand.fn)) return eintragFenster(k.slice(0, x).join('.')); x--; }
}

// ---------------------------------------------------------------- Leiste
function leiste() {
  oben();
  const g = geaendert(), n = g ? vergleich(STAND, D).length : 0;
  const sp = OFFEN ? 'gelb' : (leiste.gruen ? 'gruen' : 'grau');
  const darf = RECHTE.veroeffentlichen && RECHTE.veroeffentlichen.includes(ROLLE) && (ROLLE !== 'kueche' || Z === 'mittag');
  $('#leiste').innerHTML = `<div class="leiste__t"><b>${OFFEN ? 'Noch nicht gespeichert' : g ? `Entwurf: ${n} ${n === 1 ? 'Änderung' : 'Änderungen'}` : 'Alles veröffentlicht'}</b>
      <span>${OFFEN ? 'Speichern legt die Eingaben im Entwurf ab.' : g ? 'Noch nicht in der PDF.' : 'Die PDF ist auf dem neuesten Stand.'}</span></div>
    ${g ? '<button class="textknopf" type="button" data-akt="verwerfen">Entwurf verwerfen</button>' : ''}
    ${g ? '<button class="kn kn--klein kn--linie" type="button" data-akt="vgl">Vorher / nachher</button>' : ''}
    <button class="kn kn--klein kn--linie" type="button" data-akt="probe">Probe-PDF</button>
    <button class="kn kn--klein sp ${sp}" type="button" data-akt="speichern">${OFFEN ? 'Speichern' : sp === 'gruen' ? 'Gespeichert' : 'Alles gespeichert'}<i>${sp === 'gruen' || !OFFEN ? SYM.haken : PF}</i></button>
    ${g && !OFFEN && darf ? `<button class="kn kn--gold" type="button" data-akt="veroeffentlichen">Veröffentlichen<i>${PF}</i></button>` : ''}`;   /* Fehlerbuch 10a (Schlössli 20.10.2026): nur Knöpfe, die gerade etwas tun */
}
function alles(geteilt) {   // geteilt: beim Kartenwechsel erst Kopf und Leiste, die lange Liste und die Vorschau einen Takt später
  if (MODUS !== 'frei') { WAHLID = null; WAHLINFO = null; GST_OFFEN = false; }
  if (MODUS === 'frei' && ANSICHT === 'website') { ANSICHT = 'karte'; }   // gestaltet wird in der Karte (GBR: an() nur in der Ansicht Karte)
  $('#vf').hidden = ANSICHT === 'website'; $('#web').hidden = ANSICHT !== 'website'; $$('.ansicht button').forEach(b => b.setAttribute('aria-pressed', b.dataset.ansicht === ANSICHT));
  seitenleiste();
  document.body.classList.toggle('frei', MODUS === 'frei');
  rand(); kopf();
  const rest = () => { if (MODUS === 'einfach') liste(); if (ANSICHT === 'website') website(); else vorschau(); leiste(); };
  if (geteilt) { leiste(); requestAnimationFrame(() => setTimeout(rest)); } else rest();
}

// ---------------------------------------------------------------- Speichern
let KETTE = Promise.resolve();   // Speichern nacheinander: zwei schnelle Eingaben dürfen sich nicht selbst in die Quere kommen (WebKit, 15.10.2026: Konflikt mit der eigenen Eingabe)
function speichern(was, text, ohneUndo) { const r = KETTE.then(() => speichernEcht(was, text, ohneUndo)); KETTE = r.catch(() => {}); return r; }
async function speichernEcht(was, text, ohneUndo) {
  const vorher = BASIS;
  let r;
  try { r = await api('entwurf', { z: Z, daten: D, was, erwartet: ERWARTET || '' }); } catch (e) { fehlerSagen('Nicht gespeichert', e); return false; }
  OFFEN = false; GESCHRIEBEN = [];
  if (!r.geaendert) { sag('Nichts geändert, nichts gespeichert.'); leiste(); return true; }
  ERWARTET = r.zeit;
  if (!ohneUndo) UNDO.push(vorher);
  BASIS = inhalt(D);
  leiste.gruen = true; setTimeout(() => { leiste.gruen = false; if (!OFFEN) leiste(); }, 2600);
  const k = LISTE.find(x => x.ziel === Z); if (k) k.entwurf = geaendert();
  rand(); leiste();
  const tippt = Z === 'mittag' && document.activeElement && document.activeElement.matches && document.activeElement.matches('#liste input');   // im Formular wird gerade geschrieben: nicht neu zeichnen, sonst springt die Eingabe weg
  if (MODUS === 'einfach' && !tippt) liste();
  sag(was || 'Im Entwurf gespeichert', text || 'Die PDF ändert sich erst beim Veröffentlichen.', [{ t: 'Rückgängig', f: rueckgaengig }, { t: 'Vorher / nachher', f: vglFenster }]);
  return true;
}
async function rueckgaengig() {
  if (!UNDO.length) return sag('Nichts zum Zurücknehmen.');
  const x = UNDO.pop(); const j = JSON.parse(x);
  D.seiten = j.s; D.woche = j.w; D.css = j.c;
  if (await speichern('Zurückgenommen', 'Der Entwurf steht wieder wie vor der letzten Änderung.', true)) alles();
}
async function tun(fn, was, text, blitz) {
  const alt = inhalt(D);
  fn();
  if (inhalt(D) === alt) return sag('Nichts geändert, nichts gespeichert.');
  BLITZ = blitz || null;
  if (MODUS === 'einfach' || Z === 'mittag') liste();
  vorschau();
  await speichern(was, text);
}

// ---------------------------------------------------------------- Fenster
function fenster(html, breit) {
  const f = $('#fenster');
  f.innerHTML = `<div class="fenster__k${breit ? ' breit' : ''}" role="dialog" aria-modal="true"><button class="rund fenster__zu" type="button" data-zu aria-label="Schliessen">${SYM.zu}</button>${html}</div>`;
  f.hidden = false;
  f.onclick = ev => { if (ev.target === f || ev.target.closest('[data-zu]')) zu(); };
  const erst = $('input:not([type=hidden]),textarea', f); if (erst) setTimeout(() => erst.focus(), 30);
}
let BEIM_ZU = null;
function zu() { const f = $('#fenster'); f.hidden = true; f.innerHTML = ''; f.oninput = null; f.onclick = null; if (BEIM_ZU) { const b = BEIM_ZU; BEIM_ZU = null; b(); } }
function frage(titel, text, ja, f) {
  fenster(`<h2>${titel}</h2><p class="satz">${h(text)}</p><div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="ja">${h(ja)}<i>${PF}</i></button></div>`);
  $('#ja').addEventListener('click', () => { BEIM_ZU = null; zu(); f(); });
}
function chips(id, wahl, art) { return `<div class="chips" id="${id}">${wahl.map(([v, t]) => `<button type="button" data-v="${h(v)}" aria-pressed="${v === art}">${h(t)}</button>`).join('')}</div>`; }

/* Wer arbeitet hier? (kein Passwort, Master 7a und Robert 15.10.2026: vorerst keines; bei der Auslieferung kommt die Anmeldung davor) */
function werFenster() {
  let rolle = ROLLE || 'service';
  fenster(`<h2>Wer <em>arbeitet hier?</em></h2><p class="satz">Ihr Name und Ihre Rolle stehen im Protokoll bei jeder Änderung. Die Rolle bestimmt, was Sie ändern und veröffentlichen dürfen.</p>
    <div class="felder" style="margin-top:18px"><label class="feld"><span>Ihr Name</span><input id="w-n" value="${h(WER)}" maxlength="60" placeholder="z. B. Anna Meier"></label>
    <div class="feld"><span>Rolle</span>${chips('w-r', Object.entries(ROLLEN), rolle)}<small>Küche: pflegt das Mittagsmenü und veröffentlicht es. Service: ändert alle Karten, die Direktion veröffentlicht sie. Direktion: darf alles, auch frühere Fassungen zurückholen.</small></div></div>
    <p class="fehler" id="w-f"></p><div class="fenster__kn"><button class="kn" type="button" id="w-ok">Weiter<i>${PF}</i></button></div>`);
  $('#w-r').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; rolle = b.dataset.v; $$('#w-r button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#w-ok').addEventListener('click', () => {
    const n = $('#w-n').value.trim(); if (!n) { $('#w-f').textContent = 'Bitte einen Namen eintragen.'; return; }
    WER = n; ROLLE = rolle; try { localStorage.setItem('lc-wer', WER); localStorage.setItem('lc-rolle', ROLLE); } catch (e) { /* egal */ }
    zu(); alles(); sag(`Willkommen, ${WER}`, `Rolle: ${ROLLEN[ROLLE]}.`);
  });
}

/* ---------- Eintrag bearbeiten (jede Art von Baustein aus seinen Angaben) ---------- */
const Z_ZEILEN = x => Array.isArray(x) && x.every(y => typeof y === 'string');
const Z_TABELLE = x => Array.isArray(x) && x.length && x.every(y => Array.isArray(y) && y.every(z => z === null || ['string', 'number'].includes(typeof z)));
function feldHTML(nm, v, loc) {
  const lab = LABEL[nm] || nm, id = 'f-' + nm;
  if (['de', 'fr', 'en'].includes(nm) && (typeof v === 'string' || (Array.isArray(v) && v.length === 2 && v.every(y => typeof y === 'string')))) {
    const [a, b] = typeof v === 'string' ? [v, ''] : v;
    return `<div class="feld"><span>${h(nm === 'de' ? 'Name' : lab)}</span><input id="${id}-0" value="${h(a)}"></div><div class="feld"><span>${h(nm === 'de' ? 'Beschreibung' : lab + ', Beschreibung')}</span><textarea id="${id}-1" rows="2">${h(b)}</textarea></div>`;
  }
  if (typeof v === 'string' || typeof v === 'number') return `<label class="feld"><span>${h(lab)}</span><input id="${id}" value="${h(v)}"></label>`;
  if (Z_ZEILEN(v)) return `<label class="feld"><span>${h(lab)}</span><textarea id="${id}" rows="${Math.max(2, Math.min(7, v.length + 1))}">${h(v.join('\n'))}</textarea></label>`;
  if (Z_TABELLE(v)) return `<label class="feld"><span>${h(lab)}</span><textarea id="${id}" rows="${Math.max(2, Math.min(7, v.length + 1))}">${h(v.map(z => z.map(y => y ?? '').join(' | ')).join('\n'))}</textarea></label>`;
  return `<label class="feld"><span>${h(lab)} (fortgeschritten)</span><textarea id="${id}" rows="4" style="font-family:var(--mono);font-size:12px">${h(JSON.stringify(v, null, 1))}</textarea></label>`;
}
function feldLesen(nm, v) {
  const id = 'f-' + nm, el = x => $('#' + x);
  if (['de', 'fr', 'en'].includes(nm) && el(id + '-0')) { const a = el(id + '-0').value.trim(), b = el(id + '-1').value.trim(); return b ? [a, b] : a; }
  if (typeof v === 'number') { const x = el(id).value.trim(); return /^-?\d+(\.\d+)?$/.test(x) ? +x : x; }
  if (typeof v === 'string') { const x = el(id).value; return ['preis', 'chf'].includes(nm) ? preisForm(x) : x.trim(); }
  if (Z_ZEILEN(v)) return el(id).value.split('\n').map(x => x.trim()).filter(Boolean);
  if (Z_TABELLE(v)) return el(id).value.split('\n').filter(x => x.trim()).map(z => z.split('|').map(y => y.trim()));
  return JSON.parse(el(id).value);
}
function eintragFenster(pfad, neu) {
  if (D.art === 'bankett') return bankettFenster(pfad, neu);
  let n = liesPfad(D, pfad); if (!istKnoten(n)) return;
  const ang = angaben(n), fn = n.fn;
  const felder = Object.keys(ang.w).filter(k => !VERSTECKT.has(k) && k !== 'art' && !(fn === 'foto'));
  // Angaben, die der Baustein kennt, aber diese Stelle (noch) nicht hat: Französisch und Englisch bei Gerichten
  if (fn === 'gericht') ['fr', 'en'].forEach(k => { if (!felder.includes(k)) felder.push(k); });
  const reihenfolge = ['name', 'de', 'herkunft', 'farbe', 'text', 'titel', 'texte', 'unter', 'traube', 'trauben', 'haus', 'fr', 'en', 'andere', 'preis', 'mass', 'preise', 'zweit', 'zeilen', 'vol', 'cl', 'chf', 'nr', 'jrg', 'ort', 'dazu'];
  felder.sort((a, b) => (reihenfolge.indexOf(a) < 0 ? 99 : reihenfolge.indexOf(a)) - (reihenfolge.indexOf(b) < 0 ? 99 : reihenfolge.indexOf(b)));
  const art = ang.w.art;
  const rub = (() => { const t = pfad.split('.'); for (let j = +t[t.length - 1]; j >= 0; j--) { const arr = liesPfad(D, t.slice(0, -1).join('.')); if (istKnoten(arr[j]) && arr[j].fn === 'rubrik') return titelVon(arr[j]); } return ''; })();
  const vorlage = (x, v) => v === undefined ? (['de', 'fr', 'en', 'preis', 'mass', 'name'].includes(x) ? '' : []) : v;
  const body = () => felder.map(k => feldHTML(k, vorlage(k, ang.w[k]), ang.wo[k])).join('');
  fenster(`<h2>${neu ? 'Neuer <em>Eintrag.</em>' : `${h(FN[fn] || fn)} <em>bearbeiten.</em>`}</h2>
    <p class="satz">${rub ? `Rubrik «${h(rub.replace(/\*\*|__|~/g, ''))}». ` : ''}${neu ? 'Dieser Eintrag ist eine Kopie, damit er genau dasselbe Format hat wie die anderen. Ändern Sie, was anders sein soll.' : 'Rechts in der Karte sehen Sie den Eintrag, sobald Sie speichern.'} Auszeichnung: **fett**, __Messing__, ~ geschütztes Leerzeichen, | Zeilenumbruch.</p>
    <div class="zwei"><div class="felder">${body()}
    ${fn === 'gericht' || art !== undefined ? `<div class="feld"><span>Zeichen</span>${chips('f-art', [['', 'keines'], ['veg', 'vegetarisch'], ['vegan', 'vegan']], art || '')}</div>` : ''}
    ${neu ? '' : `<div class="feld"><span class="schalter" role="switch" tabindex="0" aria-checked="${!n.aus}" id="f-zeigen"><b></b>Auf der Karte zeigen</span></div>`}</div>
    ${miniHTML()}</div>
    <p class="fehler" id="f-fehler" role="alert"></p>
    <div class="fenster__kn">${neu ? '' : '<button class="textknopf" type="button" id="f-weg" style="margin-right:auto">Von der Karte nehmen</button>'}<button class="kn kn--hell" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="f-ok">${neu ? 'Auf die Karte setzen' : 'Speichern'}<i>${PF}</i></button></div>`, true);
  if (neu) BEIM_ZU = () => { const v = vater(pfad); v.arr.splice(v.idx, 1); liste(); vorschau(); };
  let artWahl = art || '';
  const ca = $('#f-art'); if (ca) ca.addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; artWahl = b.dataset.v; $$('#f-art button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  const zs = $('#f-zeigen'); if (zs) { const umsch = () => zs.setAttribute('aria-checked', zs.getAttribute('aria-checked') !== 'true'); zs.addEventListener('click', umsch); zs.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); umsch(); } }); }
  const weg = $('#f-weg'); if (weg) weg.addEventListener('click', () => { BEIM_ZU = null; entfernen(pfad); });
  const bauen = () => {
    const x = kopie(n);
    felder.forEach(k => {
      const alt = ang.w[k], wert = feldLesen(k, vorlage(k, alt)), loc = ang.wo[k];
      if (loc && loc.startsWith('a.') && loc.endsWith('*')) x.a = x.a.slice(0, +loc.slice(2, -1)).concat(wert);
      else if (loc && loc.startsWith('a.')) x.a[+loc.slice(2)] = wert;
      else if (loc && loc.startsWith('k.')) { x.k = x.k || {}; if (wert === '' || (Array.isArray(wert) && !wert.length)) delete x.k[k]; else x.k[k] = wert; }
      else if (!(wert === '' || (Array.isArray(wert) && !wert.length))) { x.k = x.k || {}; x.k[k] = wert; }
    });
    if ($('#f-art') || art !== undefined) { x.k = x.k || {}; if (artWahl) x.k.art = artWahl; else delete x.k.art; }
    if (x.k && !Object.keys(x.k).length) delete x.k;
    delete x.aus;
    return x;
  };
  miniLos(() => ({ knoten: bauen(), kl: seitenKl(pfad) }));
  $('#fenster').oninput = () => { try { miniSenden({ knoten: bauen(), kl: seitenKl(pfad) }); $('#f-fehler').textContent = ''; } catch (e) { /* unfertige Eingabe */ } };
  if (ca) ca.addEventListener('click', () => { try { miniSenden({ knoten: bauen(), kl: seitenKl(pfad) }); } catch (e) { /* egal */ } });
  $('#f-ok').addEventListener('click', async () => {
    let x = kopie(n);
    try {
      felder.forEach(k => {
        const alt = ang.w[k], wert = feldLesen(k, vorlage(k, alt));
        const loc = ang.wo[k];
        if (loc && loc.startsWith('a.') && loc.endsWith('*')) x.a = x.a.slice(0, +loc.slice(2, -1)).concat(wert);
        else if (loc && loc.startsWith('a.')) x.a[+loc.slice(2)] = wert;
        else if (loc && loc.startsWith('k.')) { x.k = x.k || {}; if (wert === '' || (Array.isArray(wert) && !wert.length)) delete x.k[k]; else x.k[k] = wert; }
        else if (!(wert === '' || (Array.isArray(wert) && !wert.length))) { x.k = x.k || {}; x.k[k] = wert; }
      });
      if ($('#f-art') || art !== undefined) { x.k = x.k || {}; if (artWahl) x.k.art = artWahl; else delete x.k.art; }
    } catch (e) { $('#f-fehler').textContent = 'Eine fortgeschrittene Angabe ist kein gültiges Format: ' + e.message; return; }
    if (zs) { if (zs.getAttribute('aria-checked') !== 'true') x.aus = true; else delete x.aus; }
    if (x.k && !Object.keys(x.k).length) delete x.k;
    const nm = ang.w.name !== undefined ? feldLesen('name', ang.w.name) : null;
    if (nm !== null && !String(nm).trim()) { $('#f-fehler').textContent = 'Bitte einen Namen eintragen.'; return; }
    const de = ang.w.de !== undefined && ['gericht', 'rubrik', 'hinweis', 'dreisprachig'].includes(fn) ? feldLesen('de', vorlage('de', ang.w.de)) : null;   // 16.10.2026: Gericht ohne Namen ging durch
    if (de !== null && !String(Array.isArray(de) ? de[0] : de).trim()) { $('#f-fehler').textContent = 'Bitte einen Namen eintragen.'; return; }
    const t = titelVon(x);
    if (!neu && JSON.stringify(x) === JSON.stringify(n)) { BEIM_ZU = null; zu(); return sag('Nichts geändert, nichts gespeichert.'); }
    BEIM_ZU = null; zu();
    const v = vater(pfad);
    if (neu) { v.arr[v.idx] = x; await speichern(`${FN[fn] || 'Eintrag'} auf der Karte`, `«${t}» steht jetzt im Entwurf.`); BLITZ = pfad; liste(); vorschau(); }
    else await tun(() => { v.arr[v.idx] = x; }, `${FN[fn] || 'Eintrag'} gespeichert`, `«${t}»`, pfad);
  });
}
/* «So steht es auf der Karte» (GBR mini()): der Eintrag allein, gesetzt wie in der PDF, im kleinen Rahmen rechts im Fenster */
function miniHTML() { return `<div><p class="mono" style="margin:0 0 8px">So steht es auf der Karte</p><div class="mini"><iframe id="f-mini" title="Der Eintrag, wie er in der PDF steht" src="/_werkzeuge/carte/blatt.html?mini=1"></iframe></div></div>`; }
function seitenKl(pfad) { const s = D.seiten[+pfad.split('.')[1]]; return s ? (s.fn === 'seite' ? 'wk' : ((s.k || {}).kl || '')) : ''; }
let MINI_LETZT = null;
function miniSenden(x) {
  MINI_LETZT = x;
  const f = $('#f-mini'); if (!f || !f.contentWindow) return;
  f.contentWindow.postMessage(Object.assign({ carte: 'mini', karte: { art: D.art, format: D.format, css: D.css, konst: D.konst } }, x), location.origin);
}
function miniLos(f) { const fr = $('#f-mini'); if (!fr) return; fr.addEventListener('load', () => { try { miniSenden(f()); } catch (e) { /* egal */ } }); }
window.addEventListener('message', ev => { if (ev.origin === location.origin && ev.data && ev.data.carte === 'mini-hoehe') { const f = $('#f-mini'); if (f) f.style.height = Math.min(420, Math.max(60, ev.data.h)) + 'px'; } });
function bankettFenster(pfad, neu) {
  const u = liesPfad(D, pfad); if (!u) return;
  const ARTEN = [['zeile', 'Zeile'], ['titel', 'Titel'], ['zw', 'Zwischentitel'], ['preis', 'Preis'], ['marke', 'Marke'], ['klein', 'Klein'], ['buch', 'Buchung'], ['paket', 'Paketpreis'], ['orn', 'Zierzeichen']];
  let art = u.t, luft = !!u.luft;
  fenster(`<h2>${neu ? 'Neue <em>Zeile.</em>' : 'Zeile <em>bearbeiten.</em>'}</h2><p class="satz">Die Bankettmenüs stehen in drei Spalten je Seite, jede Zeile hat ihre Art.</p>
    <div class="zwei"><div class="felder"><label class="feld"><span>Text</span><input id="b-t" value="${h(u.text || '')}"></label>
    <div class="feld"><span>Art</span>${chips('b-a', ARTEN, art)}</div>
    <div class="feld"><span class="schalter" role="switch" tabindex="0" aria-checked="${luft}" id="b-l"><b></b>Mehr Luft über der Zeile</span></div>
    ${neu ? '' : `<div class="feld"><span class="schalter" role="switch" tabindex="0" aria-checked="${!u.aus}" id="b-z"><b></b>Auf der Karte zeigen</span></div>`}</div>${miniHTML()}</div>
    <p class="fehler" id="f-fehler" role="alert"></p>
    <div class="fenster__kn">${neu ? '' : '<button class="textknopf" type="button" id="f-weg" style="margin-right:auto">Von der Karte nehmen</button>'}<button class="kn kn--hell" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="f-ok">Speichern<i>${PF}</i></button></div>`, true);
  const zeileJetzt = () => { const x = { ...u, t: art, text: art === 'orn' ? '' : $('#b-t').value.trim() }; delete x.leer_kl; delete x.aus; if ($('#b-l').getAttribute('aria-checked') === 'true') x.luft = true; else delete x.luft; return x; };
  miniLos(() => ({ zeile: zeileJetzt() }));
  const miniNeu = () => setTimeout(() => miniSenden({ zeile: zeileJetzt() }), 0);
  $('#fenster').oninput = miniNeu; $('#fenster').addEventListener('click', ev => { if (ev.target.closest('.chips,.schalter')) miniNeu(); });
  if (neu) BEIM_ZU = () => { const v = vater(pfad); v.arr.splice(v.idx, 1); liste(); vorschau(); };
  $$('.schalter', $('#fenster')).forEach(s => { const um = () => s.setAttribute('aria-checked', s.getAttribute('aria-checked') !== 'true'); s.addEventListener('click', um); s.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); um(); } }); });
  $('#b-a').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (!b) return; art = b.dataset.v; $$('#b-a button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  const weg = $('#f-weg'); if (weg) weg.addEventListener('click', () => { BEIM_ZU = null; entfernen(pfad); });
  $('#f-ok').addEventListener('click', async () => {
    const x = { ...u, t: art, text: $('#b-t').value.trim() };
    if (art !== 'orn' && !x.text) { $('#f-fehler').textContent = 'Bitte einen Text eintragen.'; return; }
    if (art === 'orn') x.text = '';
    delete x.leer_kl; if ($('#b-l').getAttribute('aria-checked') === 'true') x.luft = true; else delete x.luft;
    const z = $('#b-z'); if (z) { if (z.getAttribute('aria-checked') !== 'true') x.aus = true; else delete x.aus; }
    if (!neu && JSON.stringify(x) === JSON.stringify(u)) { BEIM_ZU = null; zu(); return sag('Nichts geändert, nichts gespeichert.'); }
    BEIM_ZU = null; zu(); const v = vater(pfad);
    if (neu) { v.arr[v.idx] = x; await speichern('Zeile auf der Karte', `«${x.text}» steht jetzt im Entwurf.`); liste(); vorschau(); }
    else await tun(() => { v.arr[v.idx] = x; }, 'Zeile gespeichert', `«${x.text}»`, pfad);
  });
}
function seitentitelFenster(sp) {
  const s = liesPfad(D, sp);
  fenster(`<h2>Titel der Seite <em>ändern.</em></h2><label class="feld" style="margin-top:18px"><span>Titel</span><input id="st-t" value="${h(s.titel || '')}"></label><p class="fehler" id="f-fehler"></p>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="st-ok">Speichern<i>${PF}</i></button></div>`);
  $('#st-ok').addEventListener('click', () => { const t = $('#st-t').value.trim(); zu(); tun(() => { s.titel = t; }, 'Titel gespeichert', t); });
}
function entfernen(pfad) {
  const v = vater(pfad), n = v.arr[v.idx], t = istKnoten(n) ? titelVon(n) : (n.text || 'Eintrag');
  const rubrik = istKnoten(n) && n.fn === 'rubrik';
  let bis = v.idx + 1;
  if (rubrik) while (bis < v.arr.length && !(istKnoten(v.arr[bis]) && v.arr[bis].fn === 'rubrik')) bis++;
  const anz = bis - v.idx - 1;
  frage(rubrik ? 'Rubrik <em>entfernen?</em>' : 'Von der Karte <em>nehmen?</em>', rubrik && anz ? `«${t}» und die ${anz} Einträge darunter verschwinden aus der Karte. Bis zum Veröffentlichen holen Sie alles mit «Rückgängig» oder «Entwurf verwerfen» zurück.` : `«${t}» verschwindet aus der Karte. Wenn es nur vorübergehend ist, blenden Sie es lieber aus (Auge). Bis zum Veröffentlichen lässt es sich zurückholen.`, 'Von der Karte nehmen',
    () => tun(() => { v.arr.splice(v.idx, rubrik ? bis - v.idx : 1); }, rubrik ? 'Rubrik entfernt' : 'Von der Karte genommen', t));
}
function schiebe(pfad, r) {
  const v = vater(pfad), n = v.arr[v.idx];
  if (istKnoten(n) && n.fn === 'rubrik') {   // ganze Rubrik mit ihren Einträgen gegen die Nachbar-Rubrik tauschen
    const st = [], ist = (x) => istKnoten(x) && x.fn === 'rubrik'; v.arr.forEach((x, i) => { if (ist(x)) st.push(i); });
    const k = st.indexOf(v.idx), nach = st[k + r]; if (nach === undefined) return;
    const ende = i => (st[st.indexOf(i) + 1] ?? v.arr.length);
    const [a, c] = r < 0 ? [nach, v.idx] : [v.idx, nach];
    return tun(() => { const vorn = v.arr.slice(a, ende(a)), hinten = v.arr.slice(c, ende(c)); v.arr.splice(a, ende(c) - a, ...hinten, ...vorn); }, 'Reihenfolge gespeichert', `«${titelVon(n)}» steht jetzt weiter ${r < 0 ? 'oben' : 'unten'}`, v.arrPfad + '.' + (r < 0 ? a : a + (ende(c) - c)));
  }
  const j = nachbar(v.arr, v.idx, r); if (j < 0) return;
  tun(() => { [v.arr[v.idx], v.arr[j]] = [v.arr[j], v.arr[v.idx]]; }, 'Reihenfolge gespeichert', `«${istKnoten(n) ? titelVon(n) : n.text}» steht jetzt weiter ${r < 0 ? 'oben' : 'unten'}`, v.arrPfad + '.' + j);
}
function kopieren(pfad) {
  const v = vater(pfad), n = kopie(v.arr[v.idx]); delete n.aus;
  v.arr.splice(v.idx + 1, 0, n);
  liste(); vorschau();
  eintragFenster(v.arrPfad + '.' + (v.idx + 1), true);
}
function neuAmEnde(i) {
  if (D.art === 'bankett') return;
  const zl = zeilenSeite(i).filter(r => !FEST.has(r.n.fn) && !['rubrik', 'h1', 'h2', 'h3'].includes(r.n.fn));
  const letzte = zl[zl.length - 1];
  if (!letzte) return sag('Auf dieser Seite gibt es noch keinen Eintrag als Vorlage.', 'Kopieren Sie zuerst einen Eintrag einer anderen Seite.', [], true);
  kopieren(letzte.pfad);
}
function rubrikBlock(pfad) {   // Rubrik → letzter Eintrag ihres Blocks (bis zur nächsten Rubrik, im selben Behälter)
  const v = vater(pfad); let letzt = null;
  for (let j = v.idx + 1; j < v.arr.length; j++) { const x = v.arr[j]; if (istKnoten(x) && x.fn === 'rubrik') break; if (istKnoten(x) && !['luft', 'feder', 'foto', 'zeichen', 'block'].includes(x.fn)) letzt = j; if (istKnoten(x) && x.fn === 'block') { const tiefer = x.a.map((y, k) => k).filter(k => istKnoten(x.a[k]) && !['luft', 'feder'].includes(x.a[k].fn)); if (tiefer.length) return v.arrPfad + '.' + j + '.a.' + tiefer[tiefer.length - 1]; } }
  return letzt === null ? null : v.arrPfad + '.' + letzt;
}
function neuHier(pfad) {
  if (D.art === 'bankett') { const v = vater(pfad); let e = v.idx + 1; while (e < v.arr.length && v.arr[e].t !== 'titel') e++; return kopieren(v.arrPfad + '.' + (e - 1)); }
  const l = rubrikBlock(pfad);
  if (!l) return sag('Unter dieser Rubrik gibt es noch keinen Eintrag als Vorlage.', 'Kopieren Sie einen Eintrag einer anderen Rubrik und schieben Sie ihn hierher.', [], true);
  kopieren(l);
}
function neuGlobal() {
  if (D.art === 'bankett') {
    const opts = [];
    D.seiten.forEach((s, i) => s.spalten.forEach((sp, j) => (sp.oben || []).forEach((u, k) => { if (u.t === 'titel') opts.push([`seiten.${i}.spalten.${j}.oben`, k, u.text]); })));
    fenster(`<h2>Neue <em>Zeile.</em></h2><p class="satz">In welches Menü? Die Zeile kommt an sein Ende, verschieben lässt sie sich danach mit den Pfeilen.</p><div class="chips" id="g-r">${opts.map(([a, k, t], n) => `<button type="button" data-k="${n}" aria-pressed="false">${h(t)}</button>`).join('')}</div>`);
    return $('#g-r').addEventListener('click', ev => { const b = ev.target.closest('[data-k]'); if (!b) return; const [a, k] = opts[+b.dataset.k], arr = liesPfad(D, a); let e = k + 1; while (e < arr.length && arr[e].t !== 'titel') e++; zu(); kopieren(a + '.' + (e - 1)); });
  }
  const opts = [];
  D.seiten.forEach((s, i) => zeilenSeite(i).forEach(r => { if (r.n.fn === 'rubrik') opts.push([r.pfad, titelVon(r.n)]); }));
  fenster(`<h2>Neuer <em>Eintrag.</em></h2><p class="satz">In welche Rubrik? Der Eintrag kommt an ihr Ende, als Kopie des letzten Eintrags darin, damit er dasselbe Format hat. Verschieben lässt er sich danach mit den Pfeilen.</p>
    <div class="chips" id="g-r" style="margin-bottom:6px">${opts.map(([p, t], k) => `<button type="button" data-k="${k}" aria-pressed="false">${h(t)}</button>`).join('')}</div>`);
  $('#g-r').addEventListener('click', ev => { const b = ev.target.closest('[data-k]'); if (!b) return; zu(); neuHier(opts[+b.dataset.k][0]); });
}
function rubrikNeu(i) {
  const s = D.seiten[i], arr = s.a, vorl = zeilenSeite(i).find(r => r.n.fn === 'rubrik');
  const x = vorl ? kopie(vorl.n) : { fn: 'rubrik', a: ['Neue Rubrik'] };
  x.a[0] = 'Neue Rubrik'; for (let j = 1; j < x.a.length; j++) x.a[j] = ''; delete x.aus;
  // am Ende der obersten Ebene der Seite, vor einem Fuss-Platzhalter (feder) falls vorhanden
  let ein = arr.length; while (ein > 0 && istKnoten(arr[ein - 1]) && ['feder'].includes(arr[ein - 1].fn)) ein--;
  arr.splice(ein, 0, x); liste(); vorschau();
  eintragFenster('seiten.' + i + '.a.' + ein, true);
}

// ---------------------------------------------------------------- Mittagsmenü
function mwKnoten(pfad) { const k = pfad.split('.'), gen = { seiten: SATZ.MITTAG.seiten(D.woche) }; for (let x = k.length; x > 2; x--) { const n = liesPfad(gen, k.slice(0, x).join('.')); if (istKnoten(n)) return n; } return null; }
function mwAusVorschau(pfad) {
  const n = mwKnoten(pfad), feld = n && n.w; if (!feld) return;
  const t = $(`#liste [data-mw="${feld}"]`); if (!t) return;
  const f = t.closest('label.feld') || t;
  $$('#liste .mw-an').forEach(x => x.classList.remove('mw-an', 'mw-blitz'));
  f.classList.add('mw-an'); void f.offsetWidth; f.classList.add('mw-blitz');
  linksMitte(f);
  setTimeout(() => { t.focus({ preventScroll: true }); const l = t.value.length; try { t.setSelectionRange(l, l); } catch (e) { /* egal */ } }, 450);
}
function mwRechts(feld) {   // ein Feld zeigt beim Hineinklicken seine Zeile rechts, auf derselben Höhe, und lässt sie blinken
  if (Z !== 'mittag' || MODUS !== 'einfach' || ANSICHT !== 'karte') return;
  const gen = SATZ.MITTAG.seiten(D.woche); let pf = null;
  gen.forEach((s, i) => s.a.forEach((n, j) => { if (!pf && istKnoten(n) && n.w === feld) pf = `seiten.${i}.a.${j}`; }));
  const t = $(`#liste [data-mw="${feld}"]`); if (!pf || !t) return;
  const r = t.getBoundingClientRect(); blitzRechts(pf, r.top + r.height / 2);
}
function beispielWeg() { if (!D.woche.beispiel) return; delete D.woche.beispiel; const b = $('#kopf .kopf__bsp'); if (b) b.remove(); }
function wocheSetzen(pfad, wert) { setzePfad(D.woche, pfad, wert); beispielWeg(); }   // die erste eigene Eingabe macht aus der Beispielwoche die Woche des Hauses
function wocheSchieben(r, leeren) {
  const M = SATZ.MITTAG, neu = M.iso(M.datum(D.woche.ab, 7 * r));
  if (leeren) return frage('Nächste Woche <em>anlegen?</em>', `Die Karte gilt dann ab ${M.tagName(neu, 0)}. Die Gerichte werden geleert, Zeiten und Preis bleiben. Die bisherige Woche bleibt unter «Frühere Fassungen».`, 'Nächste Woche', () => tun(() => { D.woche.tage = D.woche.tage.map(() => M.leererTag()); D.woche.ab = neu; beispielWeg(); }, 'Nächste Woche angelegt', 'Jetzt die Gerichte eintragen.'));
  tun(() => { D.woche.ab = neu; }, 'Woche geändert', `Die Karte gilt ab ${M.tagName(neu, 0)}. Die Gerichte bleiben.`);
}

// ---------------------------------------------------------------- Vorher / nachher, Verlauf, Daten, Protokoll, Zustand, Anschluss
function vglFenster() {
  const v = vergleich(STAND, D), W = { neu: 'Neu', weg: 'Entfernt', anders: 'Geändert', verschoben: 'Verschoben', anordnung: 'Anordnung' };
  const darf = RECHTE.veroeffentlichen && RECHTE.veroeffentlichen.includes(ROLLE) && (ROLLE !== 'kueche' || Z === 'mittag');
  const markiere = (a, b) => { const wa = new Set(a.replace(/<[^>]+>/g, ' ').split(/\s+/)); return b.replace(/>([^<]+)</g, (m, t) => '>' + t.split(/(\s+)/).map(w => w.trim() && !wa.has(w) ? `<mark>${w}</mark>` : w).join('') + '<'); };
  fenster(`<h2>Vorher <em>und nachher.</em></h2><p class="satz">${v.length ? `${v.length} ${v.length === 1 ? 'Stelle' : 'Stellen'} im Entwurf. Links steht, was heute in der PDF steht, rechts der Entwurf. Was neu ist, ist markiert.` : 'Der Entwurf ist gleich wie die PDF.'}</p>
    <div class="vgl__k"><span></span><span class="mono">Heute in der PDF</span><span class="mono">Im Entwurf</span></div>
    <div class="vgl">${v.map(x => { if (x.art === 'anordnung') return `<div class="vgl__z"><span class="mono">${W[x.art]}<br><small style="text-transform:none;letter-spacing:0;color:var(--leise)">${h(x.b.ort)}</small></span><div>Wie gesetzt</div><div>${x.n} ${x.n === 1 ? 'Element verschoben, in der Grösse oder Gestaltung geändert' : 'Elemente verschoben, in der Grösse oder Gestaltung geändert'}</div></div>`; const a = x.a ? x.a.text : '', b = x.b ? x.b.text : ''; return `<div class="vgl__z"><span class="mono">${W[x.art]}<br><small style="text-transform:none;letter-spacing:0;color:var(--leise)">${h((x.b || x.a).ort || '')}</small></span><div class="${a ? '' : 'leer'}">${a ? (x.art === 'weg' ? `<del>${a}</del>` : a) : 'stand noch nicht da'}</div><div class="${b ? '' : 'leer'}">${b ? (x.art === 'anders' ? markiere(a, b) : b) : 'nicht mehr auf der Karte'}</div></div>`; }).join('')}</div>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button>${v.length && darf ? `<button class="kn kn--gold" type="button" id="v-ok">Veröffentlichen<i>${PF}</i></button>` : ''}</div>`, true);
  const ok = $('#v-ok'); if (ok) ok.addEventListener('click', veroeffentlichen);
}
async function verlaufFenster() {
  let l = [];
  try { l = (await api('verlauf?z=' + Z)).liste; } catch (e) { return fehlerSagen('Verlauf nicht lesbar', e); }
  fenster(`<h2>Frühere <em>Fassungen.</em></h2><p class="satz">Jede veröffentlichte Fassung bleibt aufbewahrt, dazu jeder verworfene Entwurf und der Stand, mit dem La Carte begonnen hat. Eine Fassung zurückholen legt sie in den Entwurf; die PDF ändert sich erst beim Veröffentlichen. Zurückholen darf die Direktion.</p>
    <div class="verlauf"><div class="verlauf__z"><div><b>Ursprünglicher Stand</b><br><span class="mono">so, wie die Karte eingelesen wurde</span></div><div><button class="kn kn--klein kn--hell" type="button" data-d="grundstand">In den Entwurf holen</button></div></div>
    ${l.map(x => `<div class="verlauf__z"><div><b>${x.art === 'verworfen' ? 'Verworfener Entwurf' : 'Veröffentlicht'}</b><br><span class="mono">${h(x.zeit)}${x.wer ? ' · ' + h(x.wer) : ''}</span></div><div>${x.pdf ? `<a class="kn kn--klein kn--hell" href="${API}pdf?z=${Z}&q=live" style="display:none"></a>` : ''}<button class="kn kn--klein kn--hell" type="button" data-d="${h(x.datei)}">In den Entwurf holen</button></div></div>`).join('') || '<p style="margin-top:10px">Noch keine früheren Fassungen. Die erste entsteht beim ersten Veröffentlichen.</p>'}</div>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button></div>`);
  $('#fenster').addEventListener('click', async ev => {
    const b = ev.target.closest('[data-d]'); if (!b) return;
    try { await api('zurueckholen', { z: Z, datei: b.dataset.d }); } catch (e) { return fehlerSagen('Nicht geholt', e); }
    zu(); await lade(Z); sag('Fassung im Entwurf', 'Prüfen Sie vorher und nachher, dann veröffentlichen.', [{ t: 'Vorher / nachher', f: vglFenster }]);
  });
}
function datenFenster() {
  if (Z === 'mittag') return datenFensterWoche();
  fenster(`<h2>Daten <em>der Karte.</em></h2><p class="satz">Für Fortgeschrittene: die Seiten der Karte als Text. Jeder Eintrag ist ein Baustein (fn) mit seinen Angaben (a, k). «aus»: true blendet einen Eintrag aus. Nach «Übernehmen» steht die Karte rechts, gespeichert wird mit dem Knopf unten; der Server prüft jede Eingabe.</p>
    <textarea class="daten" id="j-t" spellcheck="false">${h(JSON.stringify(D.seiten, null, 1))}</textarea><p class="fehler" id="j-f"></p>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="j-ok">Übernehmen<i>${PF}</i></button></div>`, true);
  $('#j-ok').addEventListener('click', () => {
    let x; try { x = JSON.parse($('#j-t').value); } catch (e) { $('#j-f').textContent = 'Der Text ist kein gültiges Format: ' + e.message; return; }
    if (!Array.isArray(x) || !x.length) { $('#j-f').textContent = 'Es fehlen die Seiten der Karte.'; return; }
    D.seiten = x; OFFEN = inhalt(D) !== BASIS; zu(); vorschau(); leiste();
    sag('Übernommen', 'Noch nicht gespeichert. Mit «Speichern» unten landet es im Entwurf.');
  });
}
function datenFensterWoche() {
  fenster(`<h2>Daten <em>der Woche.</em></h2><p class="satz">Für Fortgeschrittene: die Woche als Text. Je Tag Salat, Suppe, Vegetarisch, Fleisch, Fisch und Dessert; «zu»: true für einen Tag ohne Mittagsmenü. Nach «Übernehmen» steht die Karte rechts, gespeichert wird mit dem Knopf unten.</p>
    <textarea class="daten" id="j-t" spellcheck="false">${h(JSON.stringify(D.woche, null, 1))}</textarea><p class="fehler" id="j-f"></p>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="j-ok">Übernehmen<i>${PF}</i></button></div>`, true);
  $('#j-ok').addEventListener('click', () => {
    let x; try { x = JSON.parse($('#j-t').value); } catch (e) { $('#j-f').textContent = 'Der Text ist kein gültiges Format: ' + e.message; return; }
    if (!x || !/^\d{4}-\d\d-\d\d$/.test(x.ab || '') || !Array.isArray(x.tage) || !x.tage.length || x.tage.length > 7) { $('#j-f').textContent = 'Es fehlen das Datum (ab) oder die Tage der Woche (1 bis 7).'; return; }
    D.woche = x; OFFEN = inhalt(D) !== BASIS; zu(); vorschau(); leiste();
    sag('Übernommen', 'Noch nicht gespeichert. Mit «Speichern» unten landet es im Entwurf.');
  });
}
async function protokollFenster() {
  let l = [];
  try { l = (await api('protokoll?z=' + Z)).liste; } catch (e) { return fehlerSagen('Protokoll nicht lesbar', e); }
  /* Endprüfung 19.10.2026 (J, Master M27): in der Demo nie leer, beschriftete Beispiele zur gewählten Karte */
  l = l.filter(x => !/^Pr\S{1,6}fung\b/.test(String(x.wer || '')));   // Einträge unserer Prüfläufe gehören nicht in die Vorführung
  const bsp = !l.length;
  if (bsp) {
    const d = n => { const t = new Date(Date.now() - n * 86400000); return t.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + ['09:12', '16:40', '11:05', '18:22'][n % 4]; };
    l = [{ zeit: d(1), wer: 'Direktion', rolle: '', was: 'veroeffentlicht' }, { zeit: d(1), wer: 'Service', rolle: '', was: 'entwurf', text: 'Preis angepasst' },
      { zeit: d(3), wer: 'Küche', rolle: '', was: 'probe' }, { zeit: d(6), wer: 'Service', rolle: '', was: 'entwurf', text: 'Neuer Eintrag in einer Rubrik' }];
  }
  const T = { entwurf: 'hat gespeichert', verworfen: 'hat den Entwurf verworfen', probe: 'hat eine Probe gedruckt', veroeffentlicht: 'hat veröffentlicht', 'veroeffentlichen-abgebrochen': 'Veröffentlichen abgebrochen', einstellungen: 'hat Einstellungen geändert', 'aus-sicherung': 'Datei aus der Sicherung geholt' };
  fenster(`<h2>Wer hat was <em>getan?</em></h2><p class="satz">Die letzten Einträge zu dieser Karte, neueste zuerst.${bsp ? ' Noch ist nichts eingetragen, darum stehen hier Beispiele.' : ''}</p><div class="prot">${l.map(x => `<div><span class="mono">${h(x.zeit)}</span><span>${bsp ? '<em class="mono" style="font-style:normal;opacity:.7">Beispiel · </em>' : ''}<b style="font-weight:600">${h(x.wer)}</b> ${h(ROLLEN[x.rolle] ? '(' + ROLLEN[x.rolle] + ')' : '')} ${h(T[x.was] || x.was)}${x.text ? ' · ' + h(x.text) : ''}${x.grund ? ' · ' + h(x.grund) : ''}</span></div>`).join('') || '<div><span></span><span>Noch nichts eingetragen.</span></div>'}</div>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button></div>`, true);
}
async function gesundFenster() {
  let g; try { g = await api('gesund'); } catch (e) { return fehlerSagen('Zustand nicht lesbar', e); }
  STATUS_ROT = !g.ok; oben();
  const z = (t, ok) => `<div><span>${h(t)}</span><b class="${ok ? 'ja' : 'nein'}">${ok ? 'in Ordnung' : 'fehlt'}</b></div>`;
  const W = { node: 'Druck der PDF', playwright: 'Druckprogramm', pdftotext: 'Prüfung der PDF', speicher: 'Speicher', druck: 'Druck der PDF', pdfpruefung: 'Prüfung der PDF' };
  const bf = (g.browserfehler || [])[0];
  fenster(`<h2>Ist alles <em>in Ordnung?</em></h2><p class="satz">Der Zustand von La Carte, direkt vom Server gelesen.${g.vorfuehrung ? ' Vorführ-Betrieb: Gespeichertes hält nicht.' : ''}</p><div class="gesund">${Object.entries(g.karten).map(([k, ok]) => z('Daten ' + ((LISTE.find(x => x.ziel === k) || {}).name || k), ok)).join('')}${Object.entries(g.werkzeug).map(([k, ok]) => z(W[k] || k, ok)).join('')}
    <div><span>Speicher von La Carte</span><b>${g.speicher_mb} MB</b></div><div><span>Läuft seit</span><b>${Math.round(g.seit / 60)} Min.</b></div>${g.fehler.length ? `<div><span>Letzter Fehler im Server</span><b class="nein">${h(g.fehler[g.fehler.length - 1].slice(0, 160))}</b></div>` : ''}${bf ? `<div><span>Letzter Fehler im Browser</span><b class="nein">${h(bf.zeit + ' · ' + bf.text.slice(0, 120))}</b></div>` : ''}</div>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button><a class="kn" href="/_werkzeuge/carte/pruefung.html" target="_blank" rel="noopener">Prüfung öffnen<i>${PF}</i></a></div>`);
}
async function einstFenster() {
  const s = (await api('status')).einstellungen; EINST = s;
  if (s.demo) return fenster(`<h2>Anschluss an die <em>Website.</em></h2><p class="satz"><b>Demo.</b> In der Demo arbeitet die Karte für sich: «Veröffentlichen» setzt die Karte und ihre PDF hier im Werkzeug, die Website bleibt, wie sie ist. Mit dem Auftrag wird der Anschluss eingeschaltet; dann erscheinen veröffentlichte Karten auch auf der Website.</p>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button></div>`);   // Querprüfung 21.10.2026: Demo-Sperre
  fenster(`<h2>Anschluss an die <em>Website.</em></h2><p class="satz">Die Website des Hauses verweist auf ihre eigene PDF der Karte. Solange der Anschluss aus ist, bleibt sie dabei und La Carte arbeitet für sich. Mit Anschluss kopiert «Veröffentlichen» die neue PDF auf die Website; die vorige PDF wird vorher gesichert. Das Mittagsmenü hat keinen Anschluss. Nur die Direktion darf das ändern.</p>
    <div class="felder" style="margin-top:20px"><div class="feld"><span class="schalter" role="switch" tabindex="0" aria-checked="${!!s.anschluss_pdf}" id="e-a"><b></b>Veröffentlichte PDF auf die Website übernehmen</span></div></div>
    <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button><button class="kn" type="button" id="e-ok">Speichern<i>${PF}</i></button></div>`);
  const sw = $('#e-a'); const um = () => sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true'); sw.addEventListener('click', um); sw.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); um(); } });
  $('#e-ok').addEventListener('click', async () => { try { await api('einstellungen', { anschluss_pdf: sw.getAttribute('aria-checked') === 'true' }); zu(); sag('Gespeichert', sw.getAttribute('aria-checked') === 'true' ? 'Veröffentlichte PDFs gehen jetzt auch auf die Website.' : 'Die Website bleibt bei ihrer PDF.'); } catch (e) { fehlerSagen('Nicht gespeichert', e); } });
}

// ---------------------------------------------------------------- Probe, Veröffentlichen, Verwerfen
async function probe() {
  if (OFFEN && !(await speichern('Im Entwurf gespeichert', 'Vor der Probe gespeichert.'))) return;
  sag('Probe-PDF wird gedruckt', 'Einen Moment.');
  try {
    const r = await api('probe', { z: Z });
    sag('Probe-PDF fertig', `${r.seiten} Seiten, ${r.art === 'entwurf' ? 'aus dem Entwurf' : 'wie veröffentlicht'}.${r.warn && r.warn.length ? ' ' + r.warn[0] : ''} Die echte PDF bleibt unverändert.`, [{ t: 'Probe öffnen', href: r.url }]);
  } catch (e) { fehlerSagen('Keine Probe-PDF', e); }
}
async function veroeffentlichen() {
  if (OFFEN && !(await speichern('Im Entwurf gespeichert', 'Vor dem Veröffentlichen gespeichert.'))) return;
  if (!geaendert()) { zu(); return sag('Nichts geändert, nichts veröffentlicht.'); }
  const SCHRITTE = ['Der Entwurf wird geprüft', 'Die Karte wird gesetzt und gedruckt', 'PDF und Daten werden verglichen', 'Die neue Fassung wird übernommen'];
  fenster(`<div class="lade"><div class="lade__r"></div><h2>Die Karte <em>entsteht.</em></h2><p class="satz" style="margin:0">Die PDF wird gedruckt und Wort für Wort gegen die Daten geprüft. Erst wenn alles stimmt, ersetzt sie die bisherige; sonst bleibt alles, wie es ist. Das dauert etwa eine halbe Minute.</p><ol id="l-s">${SCHRITTE.map(s => `<li>${h(s)}</li>`).join('')}</ol></div>`);
  $('#fenster').onclick = null;
  try { const r0 = await api('veroeffentlichen', { z: Z }); if (r0.geaendert === false) { zu(); await lade(Z, true); return sag('Nichts geändert, nichts veröffentlicht.'); } } catch (e) { zu(); return fehlerSagen('Nicht veröffentlicht', e); }
  const t0 = Date.now();
  for (;;) {
    await new Promise(r => setTimeout(r, 700));
    let s; try { s = (await api('status')).bau; } catch (e) { continue; }
    const k = s.schritte.indexOf(s.schritt);
    $$('#l-s li').forEach((li, i) => { li.className = s.laeuft ? (i < k ? 'fertig' : i === k ? 'jetzt' : '') : (s.fehler ? '' : 'fertig'); });
    if (!s.laeuft) {
      if (s.fehler) { zu(); await lade(Z); return sag('Nicht veröffentlicht', 'Die PDF ist unverändert, Ihr Entwurf ist noch da. ' + s.fehler.slice(0, 220), [], true); }
      await lade(Z, true);
      const b = s.bericht || {};
      return fenster(`<h2>Veröffentlicht. <em>Die neue Fassung steht.</em></h2><p class="satz">${h(s.fertig)}. ${b.mass ? `Schriftmass ${Math.min(...b.mass)} bis ${Math.max(...b.mass)} %. ` : ''}${b.anschluss === 'demo' ? 'Demo: Die Website bleibt, wie sie ist; mit dem Auftrag erscheint die neue Karte dort von selbst.' : b.anschluss && b.anschluss !== 'aus' ? `Die PDF liegt auch auf der Website (${h(b.anschluss)}).` : Z === 'mittag' ? '' : 'Die Website bleibt bei ihrer PDF, solange der Anschluss aus ist.'} Die vorige Fassung liegt unter «Frühere Fassungen».</p>
        <div class="fenster__kn"><button class="kn kn--hell" type="button" data-zu>Schliessen</button><a class="kn kn--gold" href="${API}pdf?z=${Z}&q=live" target="_blank" rel="noopener">PDF öffnen<i>${PF}</i></a></div>`);
    }
    if (Date.now() - t0 > 300000) { zu(); return sag('Das dauert ungewöhnlich lange', 'Bitte die Seite später neu laden.', [], true); }
  }
}
function verwerfen() {
  frage('Entwurf <em>verwerfen?</em>', 'Alle Änderungen seit der letzten PDF fallen weg. Der verworfene Entwurf bleibt unter «Frühere Fassungen» aufbewahrt.', 'Verwerfen', async () => {
    try { await api('verwerfen', { z: Z }); } catch (e) { return fehlerSagen('Nicht verworfen', e); }
    await lade(Z); sag('Entwurf verworfen', 'Die Karte steht wieder wie in der PDF.');
  });
}

// ---------------------------------------------------------------- Laden
/* Robert 18.10.2026 22:09 «der klick … bis die kategorie wechselt zu lang»: online kamen Karte und Stand nacheinander vom Server (gemessen 1–3,5 s).
   Jetzt liegen die übrigen Karten schon bereit (VORAB), der Klick markiert sofort, der Stand kommt im Hintergrund nach.
   Wer eine Karte verlässt, holt sie danach frisch nach, damit nach dem Speichern nie ein alter Stand wiederkommt. */
const VORAB = {};
function vorab(z) { VORAB[z] = api('karte?z=' + encodeURIComponent(z)).catch(() => null); }
async function lade(z, still, schnell) {
  let r = schnell && VORAB[z] ? await VORAB[z] : null; delete VORAB[z];
  if (!r) r = await api('karte?z=' + encodeURIComponent(z));
  if (z !== Z) { WAHLID = null; WAHLINFO = null; GST_OFFEN = false; NEU_KARTE = true; }
  HIST.length = 0; ZUK.length = 0;
  Z = z; STAND = r.stand; D = kopie(r.entwurf || r.stand); BASIS = inhalt(D); OFFEN = false; UNDO = []; GESCHRIEBEN = [];
  ERWARTET = r.entwurf_zeit || STAND.veroeffentlicht;   // auch ein Entwurf, der dem Stand gleicht (nach «Rückgängig»), hat seine eigene Zeit
  if (schnell) api('status').then(st => { LISTE = st.karten; RECHTE = st.rechte; EINST = st.einstellungen; }).catch(() => { /* Liste bleibt */ });
  else try { const st = await api('status'); LISTE = st.karten; RECHTE = st.rechte; EINST = st.einstellungen; } catch (e) { /* Liste bleibt */ }
  try { localStorage.setItem('lc-karte', z); } catch (e) { /* egal */ }
  history.replaceState(null, '', '#' + z);
  alles(!!schnell);
  if (!still && r.entwurf) sag('Entwurf geöffnet', `Gespeichert am ${r.entwurf_zeit}${r.entwurf_wer ? ' von ' + r.entwurf_wer : ''}, noch nicht in der PDF.`);
}
async function wechsel(z) {
  if (z === Z) return;
  await KETTE;   // läuft gerade ein Speichern (Mittagsmenü speichert beim Verlassen des Feldes, 16.10.2026), erst abwarten: dann ist nichts mehr offen
  if (OFFEN) return frage('Nicht <em>gespeichert.</em>', 'Sie haben in dieser Karte Änderungen, die noch nicht gespeichert sind.', 'Verwerfen und wechseln', () => lade(z));
  document.querySelectorAll('.kw[data-z]').forEach(b => b.setAttribute('aria-current', String(b.dataset.z === z)));   // sofort sichtbar gewählt
  await new Promise(r => requestAnimationFrame(() => setTimeout(r)));   // erst die Markierung zeigen, dann den Inhalt aufbauen
  const alt = Z;
  await lade(z, false, true);
  if (alt) vorab(alt);
}

// ---------------------------------------------------------------- Ereignisse
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-akt],[data-z],[data-m],[data-zoom],[data-ansicht]');
  if (!b || (b.closest('#fenster') && !['tagzu'].includes(b.dataset.akt)) || !D) return;
  if (b.dataset.ansicht) { ANSICHT = b.dataset.ansicht; return website(); }
  if (b.dataset.z) return wechsel(b.dataset.z);
  if (b.dataset.m) { if (OFFEN && b.dataset.m === 'einfach') return frage('Nicht <em>gespeichert.</em>', 'Erst speichern, dann wechseln?', 'Speichern', async () => { if (await speichern('Im Entwurf gespeichert')) { MODUS = 'einfach'; alles(); } }); MODUS = b.dataset.m; try { localStorage.setItem('lc-modus', MODUS); } catch (e) { /* egal */ } return alles(); }
  if (b.dataset.zoom) { ZM[MODUS] = Math.min(1.3, Math.max(.35, +(ZM[MODUS] + (+b.dataset.zoom) * .1).toFixed(2))); try { localStorage.setItem('lc-zoom-' + MODUS, ZM[MODUS]); } catch (e) { /* egal */ } return $('#vf').contentWindow.postMessage({ carte: 'zoom', zoom: ZM[MODUS], wahl: MODUS === 'frei' ? WAHLID : null }, location.origin); }
  const a = b.dataset.akt, r = b.closest('.r'), pfad = r ? r.dataset.pfad : '';
  if (a === 'speichern') return OFFEN ? speichern('Im Entwurf gespeichert') : sag(leiste.gruen ? 'Gespeichert.' : 'Alles ist gespeichert.', 'Offene Eingaben gibt es gerade nicht.');
  if (a === 'veroeffentlichen') return OFFEN || geaendert() ? (OFFEN ? speichern('Im Entwurf gespeichert').then(ok => ok && vglFenster()) : vglFenster()) : null;
  if (a === 'vgl') return vglFenster();
  if (a === 'probe') return probe();
  if (a === 'verwerfen') return verwerfen();
  if (a === 'verlauf') return verlaufFenster();
  if (a === 'daten') return datenFenster();
  if (a === 'protokoll') return protokollFenster();
  if (a === 'gesund') return gesundFenster();
  if (a === 'einst') return einstFenster();
  if (a === 'woche') return wocheSchieben(+b.dataset.r);
  if (a === 'mw-vor') return wocheSchieben(-1);
  if (a === 'mw-neu') return wocheSchieben(1, true);
  if (a === 'neu') return neuGlobal();
  if (a === 'neu-hier') return neuHier(pfad);
  if (a === 'woche-neu') return wocheSchieben(1, true);
  if (a === 'tagzu') { const i = +b.dataset.i; return tun(() => { D.woche.tage[i].zu = !D.woche.tage[i].zu; }, D.woche.tage[i].zu ? 'Tag wieder mit Mittagsmenü' : 'Tag ohne Mittagsmenü'); }
  if (a === 'edit') return eintragFenster(pfad);
  if (a === 'waehle') return waehle(pfad);
  if (a === 'edit-seitentitel') return seitentitelFenster(pfad.replace(/\.titel$/, ''));
  if (a === 'kopie') return kopieren(pfad);
  if (a === 'neu-ende') return neuAmEnde(+b.dataset.i);
  if (a === 'rubrik-neu') return rubrikNeu(+b.dataset.i);
  if (a === 'hoch') return schiebe(pfad, -1);
  if (a === 'runter') return schiebe(pfad, 1);
  if (a === 'weg') return entfernen(pfad);
  if (a === 'aus') { const v = vater(pfad), u = v.arr[v.idx], wird = !u.aus; return tun(() => { if (wird) u.aus = true; else delete u.aus; }, wird ? 'Ausgeblendet' : 'Wieder auf der Karte', `«${istKnoten(u) ? titelVon(u) : u.text}»`, pfad); }
  const si = +b.dataset.i;
  if (a === 's-aus') return tun(() => { const s = D.seiten[si]; if (s.aus) delete s.aus; else s.aus = true; }, D.seiten[si].aus ? 'Seite ausgeblendet' : 'Seite wieder auf der Karte', 'Seite ' + (si + 1));
  if (a === 's-hoch' || a === 's-runter') { const j = si + (a === 's-hoch' ? -1 : 1); if (j < 0 || j >= D.seiten.length) return; return tun(() => { [D.seiten[si], D.seiten[j]] = [D.seiten[j], D.seiten[si]]; }, 'Seite verschoben', `Seite ${si + 1} steht jetzt als Seite ${j + 1}`); }
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && !$('#fenster').hidden && $('#fenster [data-zu]')) zu();
  if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); if (OFFEN) speichern('Im Entwurf gespeichert'); }
  const sw = ev.target.closest && ev.target.closest('.schalter[data-akt]'); if (sw && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); sw.click(); }
});
/* Mittagsmenü: Eingaben gehen sofort in die Karte rechts, gespeichert wird beim Verlassen des Feldes */
$('#liste').addEventListener('dblclick', ev => { const t = ev.target.closest('.r__t'); const r = t && t.closest('.r'); if (r && r.dataset.pfad && !/\.titel$/.test(r.dataset.pfad)) eintragFenster(r.dataset.pfad); });
$('#liste').addEventListener('input', ev => {
  const el = ev.target.closest('[data-mw]'); if (!el || Z !== 'mittag') return;
  wocheSetzen(el.dataset.mw, el.value); OFFEN = inhalt(D) !== BASIS; clearTimeout(TIMER); TIMER = setTimeout(vorschau, 250); leiste();
});
$('#liste').addEventListener('focusin', ev => {
  const t = ev.target.closest && ev.target.closest('[data-mw]'); if (!t || Z !== 'mittag') return;
  $$('#liste .mw-an').forEach(x => { if (!x.contains(t)) x.classList.remove('mw-an', 'mw-blitz'); });
  (t.closest('label.feld') || t).classList.add('mw-an');
  mwRechts(t.dataset.mw);
});
/* Felder der Woche wachsen mit dem Text (kein Abschneiden nach rechts), Enter schreibt keine neue Zeile (GBR mwWachsen) */
function mwWachsen(el) { (el ? [el] : $$('#liste textarea.mw-t')).forEach(t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; }); }
document.addEventListener('input', ev => { if (ev.target.matches && ev.target.matches('textarea.mw-t')) mwWachsen(ev.target); });
document.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('textarea.mw-t')) ev.preventDefault(); });
window.addEventListener('resize', () => mwWachsen());
$('#liste').addEventListener('change', ev => {
  const el = ev.target.closest('[data-mw]'); if (!el || Z !== 'mittag') return;
  wocheSetzen(el.dataset.mw, el.value);
  if (inhalt(D) !== BASIS) speichern('Im Entwurf gespeichert');
});
window.addEventListener('beforeunload', ev => { if (OFFEN) { ev.preventDefault(); ev.returnValue = ''; } });

// ---------------------------------------------------------------- Start
(async () => {
  try {
    const z0 = await (await fetch('/_werkzeuge/carte/satz/zeichen.json', { cache: 'no-store' })).json();
    SATZ.zeichen(z0); SATZ_ZEICHEN = z0;
    const st0 = await api('status'); LISTE = st0.karten; RECHTE = st0.rechte; EINST = st0.einstellungen;
    let z = location.hash.slice(1); if (!LISTE.some(k => k.ziel === z)) { try { z = (/\/maison\/?(index\.html)?([?#].*)?$/.test(document.referrer) && ((performance.getEntriesByType('navigation')[0] || {}).type !== 'reload')) ? '' : localStorage.getItem('lc-karte'); } catch (e) { z = ''; } }
    if (!LISTE.some(k => k.ziel === z)) z = LISTE[0].ziel;
    await lade(z);
    LISTE.forEach(k => { if (k.ziel !== z) vorab(k.ziel); });
    api('gesund').then(g => { STATUS_ROT = !g.ok; oben(); }).catch(() => { STATUS_ROT = true; oben(); });
  } catch (e) {
    document.body.innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#06142b;color:#f4ecdc;font-family:system-ui,sans-serif;text-align:center"><div><p style="font-size:1.4rem;margin:0 0 10px">La Carte startet nicht.</p><p style="margin:0 0 22px;color:rgba(244,236,220,.7)">${h(e.message)}</p><a href="/_werkzeuge/carte/pruefung.html" style="display:inline-block;padding:12px 22px;border-radius:99px;background:#f4ecdc;color:#06142b;text-decoration:none;font-weight:600">Prüfung öffnen</a></div></div>`;
    if (window.carteMerk) window.carteMerk('Start: ' + e.message);
  }
})();
})();
