/* La Carte · Carlton-Europe — Satz der Karten (15.10.2026).
   Eine Datei für drei Stellen: die Vorschau im Werkzeug, die Druckseite (PDF) und die Prüfung im Rundlauf (node).
   Die Bausteine sind die des Hauses (pdf/fluss.py und die eigenen Helfer jeder Karte in pdf/dok/), Zeichen für Zeichen übertragen:
   aus denselben Daten entsteht dasselbe HTML wie im Satz des Projekts (geprüft mit pruefe.py rund). Die Bankettmenüs setzt
   pdf/bankett.py ohne Bausteine, ihr Blatt steht unten unter BANKETT. Das Mittagsmenü (neu) bildet aus dem Wochenformular fluss-Seiten.
   Ohne Bibliothek. */
(function (G) {
  'use strict';
  var A = '\ue000', Z = '\ue001', M0 = '\ue002', M1 = '\ue003', M2 = '\ue004';
  var ZEICHEN = { LOGO: '', CE: '', BLATT: '', PFEIL: '' };
  var FORMAT = { A4: [210, 297], A4q: [297, 210], A5: [148, 210] };

  /* ---------------------------------------------------------------- Python nachgebildet */
  function wahr(x) {   // Wahrheit wie in Python: '' 0 None [] {} sind falsch
    if (x === null || x === undefined || x === false || x === '' || x === 0) return false;
    if (Array.isArray(x)) return x.length > 0;
    if (typeof x === 'object' && !x.fn && !x.$f && !x.$m) return Object.keys(x).length > 0;
    return true;
  }
  function s(x) {      // f-String: Wert als Text wie Python
    if (x === null || x === undefined) return 'None';
    if (x === true) return 'True';
    if (x === false) return 'False';
    return String(x);
  }
  function esc(x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }               // html.escape(quote=False)
  function escQ(x) { return esc(x).replace(/"/g, '&quot;').replace(/'/g, '&#x27;'); }                                       // html.escape()

  /* fluss.t: **fett** · __leicht__ · ~ geschütztes Leerzeichen · | Zeilenumbruch */
  function t(x) {
    var v = esc(String(x)).split('\\*').join('\x00').split('&lt;small&gt;').join('<small>').split('&lt;/small&gt;').join('</small>');
    v = v.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split('\x00').join('*');
    v = v.replace(/__(.+?)__/g, '<em>$1</em>');
    v = v.split('→').join(ZEICHEN.PFEIL).split('☐').join('<i class="kb"></i>');
    v = v.split('²').join('<span class="hoch">²</span>');
    v = v.replace(/Carlton-Europe(-[\p{L}\p{N}_]+)?/gu, function (m) { return '<span class="nw">' + m + '</span>'; });
    return v.split('~').join('\u00a0').split(' | ').join('<br>');
  }
  /* Freie Anordnung und Gestalten (Fortgeschritten), wie La Carte des Grand Beau-Rivage (karte.js lageStil/gestalt, 15./16.10.2026):
     lage = { x, y (mm), s (Faktor) · f Schrift · t Schriftgrösse (Faktor) · a Textart · c Farbe · al Ausrichtung · z Zeilenabstand ·
     mt, mb Abstand davor/danach (mm) · aus · lin {x, y, b Länge, d Stärke, c, aus} } an einem Eintrag; an der Seite: logo, kopf, zeichen, fuss, band {h}.
     Verschoben wird per transform (Ursprung oben links), der Satz bleibt. Ohne lage ist das HTML Zeichen für Zeichen das alte (pruefe.py rund). */
  function zahl(x) { return String(Math.round((+x || 0) * 100) / 100); }
  var SCHRIFT = { baskerville: "'Baskerville CE',Georgia,serif", instrument: "'Instrument Sans',Arial,sans-serif", mono: "'DM Mono',Menlo,monospace", montserrat: "'Montserrat CE','Instrument Sans',Arial,sans-serif" };
  var FARBE = { navy: '#0b1f40', nacht: '#06142b', tinte: '#1b2231', grau: '#5f5a4e', messing: '#a98a45', messingtief: '#7d6228', gold: '#dcc68f', creme: '#e8dbbf', papier: '#f4ecdc', weiss: '#ffffff' };
  var ALIGN = { links: ['left', 'flex-start'], mitte: ['center', 'center'], rechts: ['right', 'flex-end'] };
  function lageStil(l) {   // nur die Verschiebung (für das Ziehen im Werkzeug)
    if (!l) return '';
    var x = +l.x || 0, y = +l.y || 0, sk = +l.s || 1;
    if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05 && Math.abs(sk - 1) < 0.005) return '';
    return 'transform:translate(' + x.toFixed(2) + 'mm,' + y.toFixed(2) + 'mm)' + (Math.abs(sk - 1) >= 0.005 ? ' scale(' + sk.toFixed(3) + ')' : '') + ';transform-origin:0 0';
  }
  function gestalt(l) {   // [Stil, Merkmale] eines Elements
    var st = [], at = '';
    if (!l || typeof l !== 'object') return ['', ''];
    var tr = lageStil(l); if (tr) st.push(tr);
    if (l.aus) st.push('visibility:hidden');
    if (SCHRIFT[l.f]) { st.push('--gf:' + SCHRIFT[l.f]); at += ' data-gf=""'; }
    if (FARBE[l.c]) { st.push('--gc:' + FARBE[l.c]); at += ' data-gc=""'; }
    if (/^(normal|kursiv|versal|medium)$/.test(l.a || '')) at += ' data-ga="' + l.a + '"';
    if (ALIGN[l.al]) { st.push('--gal:' + ALIGN[l.al][0] + ';--gai:' + ALIGN[l.al][1]); at += ' data-gal=""'; }
    if (+l.z) { st.push('--gz:' + zahl(+l.z)); at += ' data-gz=""'; }
    if (+l.t && Math.abs(+l.t - 1) > 0.004) at += ' data-gt="' + zahl(+l.t) + '"';   // Schriftgrösse: blatt.js rechnet sie vor dem Einpassen um (gleich in Vorschau und Druck)
    if (l.mt != null && l.mt !== '') st.push('margin-top:' + zahl(+l.mt) + 'mm');
    if (l.mb != null && l.mb !== '') st.push('margin-bottom:' + zahl(+l.mb) + 'mm');
    if (l.lin && typeof l.lin === 'object') at += ' data-lin-l="' + [zahl(l.lin.x), zahl(l.lin.y), zahl(l.lin.b), zahl(l.lin.d), FARBE[l.lin.c] || '', l.lin.aus ? 1 : 0].join(',') + '"';
    return [st.join(';').replace(/"/g, "'"), at];
  }
  function attr(tag, data, stil, mehr) {   // ein öffnendes Tag um data-n, Stil und Merkmale ergänzen
    var ende = /\/>$/.test(tag) ? '/>' : '>', innen = tag.slice(0, -ende.length);
    if (stil) { if (/ style="/.test(innen)) innen = innen.replace(/ style="([^"]*)"/, function (m, a) { return ' style="' + a + (a && !/;$/.test(a) ? ';' : '') + stil + '"'; }); else innen += ' style="' + stil + '"'; }
    if (data) innen += ' data-n="' + data + '"';
    if (mehr) innen += mehr;
    return innen + ende;
  }
  var LEER_TAG = { img: 1, br: 1, hr: 1, input: 1, meta: 1, link: 1, wbr: 1, col: 1 };
  function oberste(html, data, stil, mehr) {   // nur die Tags der obersten Ebene eines Bausteins
    if (!data && !stil && !mehr) return html;
    var tiefe = 0, aus = '', bis = 0, re = /<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g, m;
    while ((m = re.exec(html))) {
      var zu = m[1] === '/', tag = m[2].toLowerCase(), leer = /\/\s*$/.test(m[3]) || LEER_TAG[tag];
      if (zu) { tiefe--; continue; }
      if (tiefe === 0) { aus += html.slice(bis, m.index) + attr(m[0], data, stil, mehr); bis = m.index + m[0].length; }
      if (!leer) tiefe++;
    }
    return aus + html.slice(bis);
  }
  function mitLage(html, l, data) { var g = gestalt(l); return oberste(html, data, g[0], g[1]); }   // data-n beim Bearbeiten, sonst nur, wenn gestaltet
  function bild(name, datei) { return '../_bilder/' + s(name) + '/' + s(datei); }

  /* ---------------------------------------------------------------- Bausteine aus pdf/fluss.py */
  var F = {};
  F.blatt = function (teile, kw) {
    var band = kw.band === undefined ? 'schmal' : kw.band, fuss = kw.fuss === undefined ? 'ce' : kw.fuss, kl = kw.kl || '', titel = kw.titel, stil = kw.stil || '';
    var k = '', m = kw._m, mk = m !== undefined && m !== null, L = kw._lage || {};
    var id = function (x) { return mk ? x + ':' + m : (L[{ b: 'band', l: 'logo', k: 'kopf', z: 'zeichen', f: 'fuss' }[x]] ? x + ':' + (kw._i || 0) : ''); };
    var bd = function (h) { var bh = (L.band || {}).h; return oberste(h, id('b'), wahr(bh) ? 'height:' + zahl(bh) + 'mm' : ''); };
    var LG = mitLage('<svg class="logo hell fl-logo" viewBox="0 0 286 154">' + ZEICHEN.LOGO + '</svg>', L.logo, id('l'));
    if (band === 'schmal') k = bd('<div class="band band--schmal"></div>');
    else if (band === 'logo' || band === 'gross') k = bd('<div class="band fl-band"></div>') + LG;
    else if (band === 'titel') k = bd('<div class="band fl-band"></div>') + mitLage('<span class="fl-schrift">' + t(titel[0]) + '<b>' + t(titel[1]) + '</b></span>', L.kopf, id('k')) + LG;
    var f = fuss === 'ce' ? mitLage('<svg class="fz" viewBox="150 0 60 42">' + ZEICHEN.CE + '</svg>', L.zeichen, id('z')) : (wahr(fuss) ? mitLage('<div class="fl-fuss">' + fuss + '</div>', L.fuss, id('f')) : '');
    return { html: k + '<div class="fl-in">' + teile.join('') + '</div>' + f, kl: ('fl b-' + s(band) + ' ' + kl).trim(), stil: stil };
  };
  F.h1 = function (text, kl) { return '<h1 class="' + s(kl || '') + '">' + t(text) + '</h1>'; };
  F.h2 = function (text, kl) { return '<h2 class="' + s(kl || '') + '">' + t(text) + '</h2>'; };
  F.h3 = function (text, kl) { return '<h3 class="' + s(kl || '') + '">' + t(text) + '</h3>'; };
  F.p = function (texte, kl) { return texte.map(function (x) { return '<p class="' + s(kl || '') + '">' + t(x) + '</p>'; }).join(''); };
  F.liste = function (punkte, kl) { return '<ul class="' + s(kl || '') + '">' + punkte.map(function (x) { return '<li>' + t(x) + '</li>'; }).join('') + '</ul>'; };
  F.luft = function (mm) { return '<div class="luft" style="height:calc(' + s(mm === undefined ? 6 : mm) + 'mm*var(--s))"></div>'; };
  F.feder = function () { return '<div class="feder"></div>'; };
  F.foto = function (name, datei, breite, kl, hoehe) { var h = wahr(hoehe) ? ';height:' + s(hoehe) + 'mm' : ''; return '<img class="fl-foto ' + s(kl || '') + '" src="' + bild(name, datei) + '" style="width:' + s(breite) + 'mm' + h + '">'; };
  F.block = function (teile, kl) { return '<div class="' + s(kl || '') + '">' + teile.join('') + '</div>'; };
  F.zeichen = function (art) { return wahr(art) ? '<span class="bl ' + s(art) + '">' + ZEICHEN.BLATT + '</span>' : ''; };
  F.rubrik = function (de, andere, chf, klein) {
    var u = andere.map(function (a) { return '<span>' + t(a) + '</span>'; }).join('');
    return '<div class="rub' + (wahr(klein) ? ' rub--kl' : '') + '"><h1>' + t(de) + '</h1><div class="rub-u">' + u + '</div>' + (wahr(chf) ? '<i>CHF</i>' : '') + '</div>';
  };
  function sprache(kl, e) {
    if (!wahr(e)) return '';
    var name = typeof e === 'string' ? e : e[0], text = typeof e === 'string' ? null : e[1];
    return '<div class="g-l ' + kl + '">' + (wahr(name) ? '<b>' + t(name) + '</b>' : '') + (wahr(text) ? '<span>' + t(text) + '</span>' : '') + '</div>';
  }
  F.gericht = function (o) {
    var de = o.de, name = typeof de === 'string' ? de : de[0], text = typeof de === 'string' ? null : de[1];
    var h = '<div class="g ' + s(o.kl || '') + '">' + F.zeichen(o.art) + '<div class="g-k"><span class="g-n">' + t(name) + '</span>';
    h += (wahr(o.mass) ? '<span class="g-m">' + t(o.mass) + '</span>' : '') + (wahr(o.preis) ? '<span class="g-p">' + t(o.preis) + '</span>' : '') + '</div>';
    if (wahr(o.zweit)) h += '<div class="g-k g-k2"><span class="g-d">' + t(wahr(text) ? text : '') + '</span><span class="g-m">' + t(o.zweit[0]) + '</span><span class="g-p">' + t(o.zweit[1]) + '</span></div>';
    else if (wahr(text)) h += '<div class="g-d">' + t(text) + '</div>';
    h += sprache('fr', o.fr) + sprache('en', o.en);
    (o.dazu || []).forEach(function (z) { h += typeof z === 'string' ? z : F.zusatz(z[0], z[1], z[2], z[3]); });
    return h + (o.nach || '') + '</div>';
  };
  F.zusatz = function (text, mass, preis, kl) {
    var inn;
    if (Array.isArray(text)) inn = '<span class="z-t">' + t(text[0]) + [['fr', text[1]], ['en', text[2]]].filter(function (x) { return x[1] !== undefined && wahr(x[1]); }).map(function (x) { return '<span class="' + x[0] + '">' + t(x[1]) + '</span>'; }).join('') + '</span>';
    else inn = '<span class="z-t">' + t(text) + '</span>';
    return '<div class="g-z ' + s(kl || '') + '">' + inn + (wahr(mass) ? '<span class="g-m">' + t(mass) + '</span>' : '') + (wahr(preis) ? '<span class="g-p">' + t(preis) + '</span>' : '') + '</div>';
  };
  F.hinweis = function (de, fr, en, art, kl) { return '<div class="hin ' + s(kl || '') + '">' + F.zeichen(art) + '<p class="de">' + t(de) + '</p>' + (wahr(fr) ? '<p class="fr">' + t(fr) + '</p>' : '') + (wahr(en) ? '<p class="en">' + t(en) + '</p>' : '') + '</div>'; };
  F.dreisprachig = function (de, fr, en, kl) { return '<div class="spr ' + s(kl || '') + '"><p class="de">' + t(de) + '</p>' + (wahr(fr) ? '<p class="fr">' + t(fr) + '</p>' : '') + (wahr(en) ? '<p class="en">' + t(en) + '</p>' : '') + '</div>'; };
  F.tabelle = function (kopf, zeilen, kl, spalten) {
    function zelle(c, tag) { tag = tag || 'td'; return Array.isArray(c) ? '<' + tag + ' class="' + s(c[1]) + '">' + t(c[0]) + '</' + tag + '>' : '<' + tag + '>' + t(c) + '</' + tag + '>'; }
    var o = '<table class="tab ' + s(kl || '') + '">';
    if (wahr(spalten)) o += '<colgroup>' + spalten.map(function (x) { return '<col style="width:' + s(x) + '">'; }).join('') + '</colgroup>';
    if (wahr(kopf)) o += '<thead><tr>' + kopf.map(function (c) { return zelle(c, 'th'); }).join('') + '</tr></thead>';
    o += '<tbody>';
    zeilen.forEach(function (z) {
      if (z && !Array.isArray(z) && typeof z === 'object') o += '<tr class="' + s(z.kl || '') + '">' + z.z.map(function (c) { return zelle(c); }).join('') + '</tr>';
      else o += '<tr>' + z.map(function (c) { return zelle(c); }).join('') + '</tr>';
    });
    return o + '</tbody></table>';
  };

  /* ---------------------------------------------------------------- eigene Helfer der Karten (pdf/dok/*.py) */
  var H = {};
  /* speisekarte.py */
  H.wein = function (herkunft, farbe, name, traube, preise, de, fr, en) {
    return '<div class="g wn"><div class="wn-h"><b>' + t(herkunft) + '</b><span>' + t(farbe) + '</span></div><div class="wn-r">' +
      '<div class="g-k"><span class="g-n">' + t(name) + '</span><span class="g-m">' + t(preise[0][0]) + '</span><span class="g-p">' + t(preise[0][1]) + '</span></div>' +
      '<div class="g-k g-k2"><span class="g-d">' + t(traube) + '</span><span class="g-m">' + t(preise[1][0]) + '</span><span class="g-p">' + t(preise[1][1]) + '</span></div>' +
      '<div class="g-l de"><span>' + t(de) + '</span></div><div class="g-l fr"><span>' + t(fr) + '</span></div><div class="g-l en"><span>' + t(en) + '</span></div></div></div>';
  };
  /* wein_und_getraenkekarte.py (K = Konstanten der Karte: FUSS, N) */
  H.seite = function (K, nr, teile, kw) {
    var f = nr > 1 ? '<span>' + t(K.FUSS) + '</span><span class="nr">' + (nr - 1) + '</span>' : null;
    return F.blatt(teile, Object.assign({}, kw, { fuss: f, kl: 'wk' }));
  };
  H.iv = function (name, nr, unter) { return '<div class="iv' + (wahr(unter) ? ' iv-u' : '') + '"><span>' + t(name) + '</span><i></i><b>' + s(nr) + '</b></div>'; };
  H.offen = function (herkunft, farbe, name, traube, preis, text) {
    return '<div class="g wn"><div class="wn-h"><b>' + t(herkunft) + '</b><span>' + t(farbe) + '</span></div><div class="wn-r">' +
      '<div class="g-k"><span class="g-n">' + t(name) + '</span><span class="g-m">10 cl</span><span class="g-p">' + t(preis) + '</span></div>' +
      '<div class="g-d"><em>' + t(traube) + '</em></div><div class="g-d">' + t(text) + '</div></div></div>';
  };
  H.wkopf = function (jrg) { return '<div class="w w-kopf"><div></div><div>Traubensorte</div><div class="w-z"><span>' + s(jrg === undefined ? 'Jrg.' : jrg) + '</span><span>Einheit</span><span>CHF</span></div></div>'; };
  H.w = function (name, haus, trauben, zeilen, preis) {
    var z = zeilen.map(function (r) { return '<span>' + t(r[0]) + '</span><span>' + t(r[1]) + '</span><span>' + t(r[2]) + '</span>'; }).join('');
    return '<div class="w"><div class="w-n"><div><b>' + t(name) + '</b>' + haus.map(function (h) { return '<span>' + t(h) + '</span>'; }).join('') + '</div>' +
      (wahr(preis) ? '<div class="w-a">' + t(preis) + '</div>' : '') + '</div><div class="w-t">' + trauben.map(function (x) { return '<span>' + t(x) + '</span>'; }).join('') + '</div><div class="w-z">' + z + '</div></div>';
  };
  H.gkopf = function (vol, cl) { vol = vol === undefined ? true : vol; cl = cl === undefined ? true : cl; return '<div class="d d-kopf"><div></div><span>' + (wahr(vol) ? 'vol %' : '') + '</span><span>' + (wahr(cl) ? 'cl' : '') + '</span><span>CHF</span></div>'; };
  H.d = function (name, unter, vol, cl, chf, nr) {
    var n = wahr(nr) ? '<i class="d-nr">' + s(nr) + '</i>' : '';
    return '<div class="d"><div class="d-n">' + n + '<b>' + t(name) + '</b>' + (wahr(unter) ? '<span>' + t(unter) + '</span>' : '') + '</div><span>' + s(vol === undefined ? '' : vol) + '</span><span>' + s(cl === undefined ? '' : cl) + '</span><span>' + s(chf === undefined ? '' : chf) + '</span></div>';
  };
  H.gruppe = function (titel, zeilen) { return '<div class="gr">' + F.h3(titel) + zeilen.join('') + '</div>'; };
  H.prod = function (K, name, ort, text, code) { return '<div class="pr"><div><h2>' + t(name) + '</h2><p class="pr-o">' + t(ort) + '</p><p>' + t(text) + '</p></div><img src="' + bild(K.N, code) + '" alt=""></div>'; };

  /* ---------------------------------------------------------------- Signaturen: Angaben jedes Bausteins mit Namen (für Satz und Werkzeug) */
  // [Name der Angabe, Standard] · '*name' = beliebig viele · Angaben nach dem Stern nur mit Namen
  var SIG = {
    blatt: ['*teile', 'band', 'fuss', 'kl', 'titel', 'stil'], h1: ['text', 'kl'], h2: ['text', 'kl'], h3: ['text', 'kl'], p: ['*texte', 'kl'], liste: ['*punkte', 'kl'],
    luft: ['mm'], feder: [], foto: ['name', 'datei', 'breite', 'kl', 'hoehe'], block: ['*teile', 'kl'], zeichen: ['art'],
    rubrik: ['de', '*andere', 'chf', 'klein'], gericht: ['de', 'fr', 'en', 'preis', 'mass', 'art', 'dazu', 'zweit', 'nach', 'kl'], zusatz: ['text', 'mass', 'preis', 'kl'],
    hinweis: ['de', 'fr', 'en', 'art', 'kl'], dreisprachig: ['de', 'fr', 'en', 'kl'], tabelle: ['kopf', 'zeilen', 'kl', 'spalten'],
    wein: ['herkunft', 'farbe', 'name', 'traube', 'preise', 'de', 'fr', 'en'], seite: ['nr', '*teile'], iv: ['name', 'nr', 'unter'],
    offen: ['herkunft', 'farbe', 'name', 'traube', 'preis', 'text'], wkopf: ['jrg'], w: ['name', 'haus', 'trauben', 'zeilen', 'preis'], gkopf: ['vol', 'cl'],
    d: ['name', 'unter', 'vol', 'cl', 'chf', 'nr'], gruppe: ['titel', '*zeilen'], prod: ['name', 'ort', 'text', 'code'],
  };
  var STD = { rubrik: { chf: true, klein: false }, blatt: { band: 'schmal', fuss: 'ce' } };
  /* Knoten → Angaben mit Namen: { name: wert }, dazu wo jede Angabe steht ('a.3' oder 'k.preis') */
  function angaben(n) {
    var sig = SIG[n.fn], aus = {}, wo = {}, a = n.a || [], i = 0, j;
    if (!sig) throw new Error('Unbekannter Baustein: ' + n.fn);
    for (j = 0; j < sig.length; j++) {
      var nm = sig[j];
      if (nm[0] === '*') { aus[nm.slice(1)] = a.slice(i); wo[nm.slice(1)] = 'a.' + i + '*'; i = a.length; continue; }
      if (i < a.length) { aus[nm] = a[i]; wo[nm] = 'a.' + i; i++; }
    }
    Object.keys(n.k || {}).forEach(function (k) { aus[k] = n.k[k]; wo[k] = 'k.' + k; });
    return { w: aus, wo: wo };
  }

  /* ---------------------------------------------------------------- Knoten setzen (wie Python: Kinder werden zu Token, am Schluss aufgelöst) */
  function Satz(K, marken) { this.K = K || {}; this.html = []; this.marken = !!marken; }
  Satz.prototype.token = function (h) { this.html.push(h); return A + (this.html.length - 1) + Z; };
  Satz.prototype.wert = function (x, pfad, text) {
    if (x === null || x === undefined || typeof x !== 'object') return (this.marken && text && typeof x === 'string' && x !== '') ? M0 + pfad + M1 + x + M2 : x;
    if (x.$f !== undefined) return x.$f;
    if (x.$m) { var me = this; return x.$m.map(function (y, i) { return typeof y === 'string' ? y : me.knoten(y, pfad + '.$m.' + i); }).join(''); }
    if (x.fn) return this.knoten(x, pfad);
    if (Array.isArray(x)) { var me2 = this; return x.map(function (y, i) { return me2.wert(y, pfad + '.' + i, text); }); }
    var o = {}, me3 = this; Object.keys(x).forEach(function (k) { o[k] = me3.wert(x[k], pfad + '.' + k, text); }); return o;
  };
  /* Namen der Angaben je Stelle (für die Markierung von Text) */
  function namen(n) {
    var sig = SIG[n.fn] || [], a = n.a || [], aus = [], i = 0;
    sig.forEach(function (nm) { if (nm[0] === '*') { while (i < a.length) aus[i++] = nm.slice(1); } else if (i < a.length) aus[i++] = nm; });
    return aus;
  }
  Satz.prototype.knoten = function (n, pfad) {
    if (n.aus) return this.token('');                         // ausgeblendet: steht nicht auf der Karte
    var me = this, nm = namen(n), kein = n.fn === 'foto' || n.fn === 'zeichen', a = (n.a || []).map(function (x, i) { return me.wert(x, pfad + '.a.' + i, TEXT[nm[i]] && !kein); }), k = {};
    Object.keys(n.k || {}).forEach(function (x) { k[x] = me.wert(n.k[x], pfad + '.k.' + x, TEXT[x] && !kein); });
    var h = this.rufe(n.fn, a, k);
    if (typeof h !== 'string') return h;
    if (n.fn !== 'block' && n.fn !== 'luft' && n.fn !== 'feder') h = mitLage(h, n.lage, this.marken && pfad ? pfad : (n.lage ? pfad : ''));
    return this.token(h);
  };
  Satz.prototype.rufe = function (fn, a, k) {
    var sig = SIG[fn], o = {}, i = 0, rest = null;
    sig.forEach(function (nm) { if (nm[0] === '*') { rest = a.slice(i); i = a.length; } else if (i < a.length) o[nm] = a[i++]; });
    Object.keys(k).forEach(function (x) { o[x] = k[x]; });
    var K = this.K;
    switch (fn) {
      case 'blatt': return F.blatt(rest, k);
      case 'h1': return F.h1(o.text, o.kl); case 'h2': return F.h2(o.text, o.kl); case 'h3': return F.h3(o.text, o.kl);
      case 'p': return F.p(rest, o.kl); case 'liste': return F.liste(rest, o.kl);
      case 'luft': return F.luft(o.mm); case 'feder': return F.feder(); case 'foto': return F.foto(o.name, o.datei, o.breite, o.kl, o.hoehe);
      case 'block': return F.block(rest, o.kl); case 'zeichen': return F.zeichen(o.art);
      case 'rubrik': return F.rubrik(o.de, rest, o.chf === undefined ? true : o.chf, o.klein);
      case 'gericht': return F.gericht(o); case 'zusatz': return F.zusatz(o.text, o.mass, o.preis, o.kl);
      case 'hinweis': return F.hinweis(o.de, o.fr, o.en, o.art, o.kl); case 'dreisprachig': return F.dreisprachig(o.de, o.fr, o.en, o.kl);
      case 'tabelle': return F.tabelle(o.kopf, o.zeilen, o.kl, o.spalten);
      case 'wein': return H.wein(o.herkunft, o.farbe, o.name, o.traube, o.preise, o.de, o.fr, o.en);
      case 'seite': { var kw = {}; Object.keys(k).forEach(function (x) { if (x !== 'nr') kw[x] = k[x]; }); return H.seite(K, o.nr, rest, kw); }
      case 'iv': return H.iv(o.name, o.nr, o.unter); case 'offen': return H.offen(o.herkunft, o.farbe, o.name, o.traube, o.preis, o.text);
      case 'wkopf': return H.wkopf(o.jrg); case 'w': return H.w(o.name, o.haus, o.trauben, o.zeilen, o.preis);
      case 'gkopf': return H.gkopf(o.vol, o.cl); case 'd': return H.d(o.name, o.unter, o.vol, o.cl, o.chf, o.nr);
      case 'gruppe': return H.gruppe(o.titel, rest); case 'prod': return H.prod(K, o.name, o.ort, o.text, o.code);
    }
    throw new Error('Unbekannter Baustein: ' + fn);
  };
  Satz.prototype.aufloesen = function (h) {
    var me = this, re = new RegExp(A + '(\\d+)' + Z, 'g');
    for (var i = 0; i < 60; i++) { var y = h.replace(re, function (m, n) { return me.html[+n]; }); if (y === h) return h; h = y; }
    throw new Error('Token lösen sich nicht auf');
  };
  // Angaben, die Text auf der Karte sind (für das Schreiben direkt in der Karte); Klassen, Bilder, Masse, Stil nie
  var TEXT = {}; ['text', 'texte', 'punkte', 'de', 'fr', 'en', 'preis', 'mass', 'name', 'titel', 'unter', 'farbe', 'herkunft', 'traube', 'ort', 'chf', 'vol', 'cl', 'jrg',
    'andere', 'haus', 'trauben', 'zeilen', 'preise', 'zweit', 'nr'].forEach(function (x) { TEXT[x] = true; });

  /* Markierungen (nur Vorschau im Werkzeug): Text bekommt <span data-k>, ein Eintrag <div data-e> ist nicht nötig, der Kommentar trägt den Pfad */
  function marken(h) {
    return h.replace(new RegExp(M0 + '([^' + M1 + ']*)' + M1, 'g'), function (m, p) { return '<k-t data-k="' + p + '">'; }).split(M2).join('</k-t>');
  }

  /* ---------------------------------------------------------------- Karte → Seiten */
  function seitenFluss(d, opt) {
    var K = d.konst || {}, fmt = d.format || 'A4', b = FORMAT[fmt][0], aus = [];
    (d.seiten || []).forEach(function (n, i) {
      if (n.aus) return;
      var sz = new Satz(K, opt && opt.marken), pfad = 'seiten.' + i;
      var me = sz, nm = namen(n), a = (n.a || []).map(function (x, j) { return me.wert(x, pfad + '.a.' + j, TEXT[nm[j]] && n.fn !== 'blatt' && n.fn !== 'seite'); }), k = {};
      Object.keys(n.k || {}).forEach(function (x) { k[x] = me.wert(n.k[x], pfad + '.k.' + x, x === 'titel'); });
      if (opt && opt.marken) k._m = i;
      if (n.lage) { k._lage = n.lage; k._i = i; }   // Band, Logo, Kopfzeile, Zeichen und Fusszeile der Seite
      var r = sz.rufe(n.fn, a, k);
      var html = sz.aufloesen(r.html);
      if (opt && opt.marken) html = marken(html);
      aus.push('<section class="blatt ' + r.kl + '" data-nr="' + (aus.length + 1) + '" data-b="' + b + '" style="' + r.stil + '"' + (opt && opt.marken ? ' data-seite="' + i + '"' : '') + '>' + html + '</section>');
    });
    return aus;
  }

  /* Bankettmenüs (pdf/bankett.py): drei Spalten je Seite, oben die Gänge, unten der Preis */
  function bkZeile(u, pfad, mk) {
    var tx = function (x) { var v = escQ(x).split('☐').join('<i class="kb"></i>').split('◆').join('<i class="orn"></i>'); return mk ? M0 + pfad + '.text' + M1 + v + M2 : v; };
    if (u.aus) return '';
    var o = function (h) { return mitLage(h, u.lage, mk || u.lage ? pfad : ''); };
    if (u.t === 'orn') return o('<i class="bk-orn"></i>');
    if (u.t === 'titel') return o('<h2>' + tx(u.text) + '</h2>');
    if (u.t === 'zw') return o('<h3>' + tx(u.text) + '</h3>');
    var kl = u.t === 'zeile' ? [] : ['bk-' + u.t];
    if (u.kl) kl.push('kl');
    if (u.luft) kl.push('luft');
    return o('<p class="' + kl.join(' ') + '">' + tx(u.text) + '</p>');
  }
  function seitenBankett(d, opt) {
    var mk = opt && opt.marken, aus = [];
    (d.seiten || []).forEach(function (sd, i) {
      if (sd.aus) return;
      var html = sd.spalten.map(function (sp, j) {
        var p = 'seiten.' + i + '.spalten.' + j;
        return '<div class="sp"><div class="oben">' + sp.oben.map(function (u, k) { return bkZeile(u, p + '.oben.' + k, mk); }).join('') + '</div>' +
          (sp.unten ? '<div class="unten">' + sp.unten.map(function (u, k) { return bkZeile(u, p + '.unten.' + k, mk); }).join('') + '</div>' : '') + '</div>';
      }).join('');
      var L = sd.lage || {}, id = function (x) { return mk || L[{ b: 'band', l: 'logo', k: 'kopf', s: 'titel', f: 'fuss' }[x]] ? x + ':' + i : ''; };
      var kopf = sd.titel ? '<h1 class="bk-seite">' + (mk ? M0 + 'seiten.' + i + '.titel' + M1 : '') + escQ(sd.titel) + (mk ? M2 : '') + '</h1>' : '';
      var h = '<section class="blatt bk' + (sd.titel ? ' mit-titel' : '') + '" data-nr="' + (aus.length + 1) + '" data-b="297"' + (mk ? ' data-seite="' + i + '"' : '') + '>' + oberste('<div class="band" style="height:25mm"></div>', id('b'), wahr((L.band || {}).h) ? 'height:' + zahl(L.band.h) + 'mm' : '') + '\n' +
        mitLage('<svg class="logo hell" viewBox="0 0 286 154" style="left:134mm;top:4.5mm;width:29mm;height:15.6mm">' + ZEICHEN.LOGO + '</svg>', L.logo, id('l')) + '\n' +
        mitLage('<span class="bk-kopf">BANKETT<b>MENUS</b></span>', L.kopf, id('k')) + (kopf ? mitLage(kopf, L.titel, id('s')) : '') + '<div class="spalten">' + html + '</div>' + mitLage('<p class="bk-fuss">' + sd.fuss + '</p>', L.fuss, id('f')) + '</section>';
      aus.push(mk ? marken(h) : h);
    });
    return aus;
  }

  /* ---------------------------------------------------------------- Mittagsmenü (neu, nach dem Mittagsmenü in La Carte des Grand Beau-Rivage)
     Robert 14.10.2026: je Tag eine eigene Tageskarte, Gänge fest (Salat oder Suppe · Vegetarisch, Fleisch, Fisch · ein Dessert), alles mittig,
     zwischen den Gängen ein kurzer Goldstrich statt einer Linie über die Breite. Gesetzt mit den Bausteinen des Hauses (fluss). */
  var TAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var GAENGE = [['salat', 'Salat', 'Vorspeise'], ['suppe', 'Suppe', 'Vorspeise'], ['vegi', 'Vegetarisch', 'Hauptgang'], ['fleisch', 'Fleisch', 'Hauptgang'], ['fisch', 'Fisch', 'Hauptgang'], ['dessert', 'Dessert', 'Dessert']];
  function datum(ab, plus) { var x = String(ab || '').split('-').map(Number); return new Date(x[0], (x[1] || 1) - 1, (x[2] || 1) + (plus || 0), 12); }
  function iso(dt) { return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
  function montag(ab) { var dt = datum(ab); dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7)); return iso(dt); }
  function tagName(ab, i) { var dt = datum(ab, i); return TAGE[i] + ', ' + dt.getDate() + '. ' + MONATE[dt.getMonth()]; }
  function spanne(ab, n) {
    var a = datum(ab), b = datum(ab, n - 1);
    if (a.getFullYear() !== b.getFullYear()) return a.getDate() + '. ' + MONATE[a.getMonth()] + ' ' + a.getFullYear() + ' – ' + b.getDate() + '. ' + MONATE[b.getMonth()] + ' ' + b.getFullYear();
    if (a.getMonth() !== b.getMonth()) return a.getDate() + '. ' + MONATE[a.getMonth()] + ' – ' + b.getDate() + '. ' + MONATE[b.getMonth()] + ' ' + b.getFullYear();
    return a.getDate() + '. – ' + b.getDate() + '. ' + MONATE[b.getMonth()] + ' ' + b.getFullYear();
  }
  var leer = function (x) { return !String(x || '').trim(); };
  function tagLeer(tg) { return !tg.zu && GAENGE.every(function (g) { return leer(tg[g[0]]); }); }
  function leererTag() { var tg = { zu: false, hinweis: '' }; GAENGE.forEach(function (g) { tg[g[0]] = ''; }); return tg; }
  // Robert 18.10.2026 13:35: «mittagsmenü … so gestalten das es schön und mittig ist»: Tageskarte senkrecht und waagrecht mittig, ruhige Abstände,
  // Art des Hauptgangs als eigene kleine Zeile (kein Umbruch mitten im Gericht), unten nichts leer
  var MT_CSS = '.blatt.fl.mt .fl-in{text-align:center;justify-content:center}.blatt.fl.mt .feder{flex:0 0 7mm}.mt .mt-art{font-family:var(--sans);font-size:.74em;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--messing-tief);margin:.75em 0 .2em}.mt .mt-art:first-of-type{margin-top:0}.mt h1{margin-top:2mm}.mt .mt-tag{font-family:var(--sans);font-weight:600;font-size:.8em;letter-spacing:.08em;text-transform:uppercase;color:var(--messing-tief);margin:.7em 0 0}' +
    '.mt .mt-zeit{color:var(--grau);margin:.4em 0 0}.mt h3{margin:0 0 .45em}.mt .mt-g{font-family:var(--serif);font-size:1.22em;line-height:1.35;color:var(--navy);margin:0 auto .2em;max-width:30em;text-wrap:balance;hyphens:manual}' +
    '.mt .mt-oder{font-size:.82em;letter-spacing:.08em;text-transform:uppercase;color:var(--messing-tief);margin:.15em 0 .3em}' +
    '.mt .mt-strich{width:13mm;height:0;border-top:.3mm solid var(--messing);margin:1.35em auto 1.25em}' +
    '.mt .mt-preis{font-family:var(--serif);font-size:1.6em;color:var(--navy);margin:0}.mt .mt-dazu{color:var(--grau);margin:.25em 0 0}.mt .mt-spruch{font-family:var(--serif);color:var(--messing-tief);margin:0}';
  function mittagSeiten(w) {
    var n = Math.max(1, Math.min(7, (w.tage || []).length)), aus = [];
    var P = function (text, kl, feld, vor) { var n = { fn: 'p', a: [text], k: { kl: kl } }; if (feld) { n.w = feld; if (vor) n.vor = vor; } return n; };   // w: Feld der Woche, das dieser Text ist (Schreiben direkt in der Karte)
    var strich = { fn: 'block', a: [], k: { kl: 'mt-strich' } };
    (w.tage || []).slice(0, n).forEach(function (tg, i) {
      if (tagLeer(tg)) return;
      var teile = [{ fn: 'h1', a: [w.titel || 'Mittagsmenü', 'mitte'], w: 'titel' }, P(tagName(w.ab, i) + ' ' + datum(w.ab, i).getFullYear(), 'mt-tag')];
      if (!leer(w.zeiten)) teile.push(P(w.zeiten.trim(), 'mt-zeit', 'zeiten'));
      teile.push({ fn: 'luft', a: [10] });
      if (tg.zu) teile.push(P(leer(tg.hinweis) ? 'An diesem Tag gibt es kein Mittagsmenü.' : tg.hinweis.trim(), 'mt-g', leer(tg.hinweis) ? null : 'tage.' + i + '.hinweis'));
      else {
        var erst = true;
        ['Vorspeise', 'Hauptgang', 'Dessert'].forEach(function (gang) {
          var z = GAENGE.filter(function (g) { return g[2] === gang && !leer(tg[g[0]]); });
          if (!z.length) return;
          if (!erst) teile.push(strich);
          erst = false;
          teile.push({ fn: 'h3', a: [gang] });
          z.forEach(function (g, j) {
            if (j && gang === 'Vorspeise') teile.push(P('oder', 'mt-oder'));
            if (gang === 'Hauptgang') teile.push(P(g[1], 'mt-art'));
            teile.push(P(tg[g[0]].trim(), 'mt-g', 'tage.' + i + '.' + g[0]));
          });
        });
        if (!leer(w.preis)) { teile.push({ fn: 'luft', a: [12] }); teile.push(P(w.preis.trim(), 'mt-preis', 'preis')); }
        if (!leer(w.zusatz)) teile.push(P(w.zusatz.trim(), 'mt-dazu', 'zusatz'));
      }
      teile.push({ fn: 'feder', a: [] });
      if (!leer(w.spruch)) teile.push(P(w.spruch.trim(), 'mt-spruch', 'spruch'));
      // Anordnung und Gestalten: die Tageskarten entstehen bei jeder Eingabe neu, die lage steht in der Woche (wie GBR mittag.js):
      // w.lage['t<Tag>.<Rolle>'] je Element, w.lage['t<Tag>#'] für Band, Logo, Zeichen und Fusszeile der Seite
      var zaehl = {}, WL = w.lage || {};
      teile.forEach(function (n) {
        if (n.fn === 'luft' || n.fn === 'feder') return;
        var r = n.w ? n.w.replace(/^tage\.\d+\./, '') : n.fn === 'h1' ? 'titel' : n.fn === 'h3' ? String(n.a[0]).toLowerCase() : n.fn === 'block' ? 'strich' : (n.k && n.k.kl === 'mt-tag') ? 'tag' : (n.k && n.k.kl === 'mt-oder') ? 'oder' : 'text';
        zaehl[r] = (zaehl[r] || 0) + 1; n.lk = 't' + i + '.' + r + (zaehl[r] > 1 ? zaehl[r] : '');
        if (WL[n.lk]) n.lage = JSON.parse(JSON.stringify(WL[n.lk]));
      });
      var kk = { band: 'logo', kl: 'mt' }; if (!leer(w.fuss)) kk.fuss = esc(w.fuss.trim());
      var bl = { fn: 'blatt', a: teile, k: kk, lk: 't' + i + '#' }; if (WL['t' + i + '#']) bl.lage = JSON.parse(JSON.stringify(WL['t' + i + '#']));
      aus.push(bl);
    });
    if (!aus.length) aus.push({ fn: 'blatt', a: [{ fn: 'h1', a: [w.titel || 'Mittagsmenü', 'mitte'] }, P(spanne(w.ab, n), 'mt-tag'), { fn: 'luft', a: [14] }, P('Die Gerichte dieser Woche folgen.', 'mt-g')], k: { band: 'logo', kl: 'mt' } });
    return aus;
  }
  function mittagAnwenden(d) { d.seiten = mittagSeiten(d.woche); d.css = MT_CSS; return d; }

  /* ---------------------------------------------------------------- öffentlich */
  function seiten(d, opt) { return d.art === 'bankett' ? seitenBankett(d, opt) : seitenFluss(d.art === 'mittag' ? mittagAnwenden(JSON.parse(JSON.stringify(d))) : d, opt); }
  function kopfCss(d) { var f = FORMAT[d.format || 'A4']; return '@page{size:' + f[0] + 'mm ' + f[1] + 'mm;margin:0} .blatt{width:' + f[0] + 'mm;height:' + f[1] + 'mm}' + (d.art === 'mittag' ? MT_CSS : (d.css || '')); }

  G.SATZ = {
    zeichen: function (z) { ZEICHEN = z; }, seiten: seiten, lageStil: lageStil, gestalt: gestalt, SCHRIFT: SCHRIFT, FARBE: FARBE, kopfCss: kopfCss, angaben: angaben, SIG: SIG, STD: STD, FORMAT: FORMAT, t: t, wahr: wahr,
    MITTAG: { TAGE: TAGE, MONATE: MONATE, GAENGE: GAENGE, datum: datum, iso: iso, montag: montag, tagName: tagName, spanne: spanne, leererTag: leererTag, tagLeer: tagLeer, seiten: mittagSeiten, anwenden: mittagAnwenden, CSS: MT_CSS },
  };
  if (typeof module !== 'undefined') module.exports = G.SATZ;
})(typeof window !== 'undefined' ? window : globalThis);
