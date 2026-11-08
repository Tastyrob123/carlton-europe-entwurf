/* La Carte · Blatt: setzt eine Karte mit satz.js. Zwei Arten:
   Druck   blatt.html?z=<karte>&q=stand|entwurf|grundstand|verlauf:<datei>&druck=1 → window.CARTE_FERTIG für drucke.js
   Vorschau (im Werkzeug, als Rahmen): Daten kommen per postMessage, Text ist markiert (data-k), Klicks und Geschriebenes gehen zurück.
   Danach wird jede Seite so gross gesetzt, wie ihr Inhalt es zulässt (wie pdf/fluss.js), die Bankettmenüs wie pdf/druck.js. */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search), ZEICHEN = null, D = null, MODUS = 'einfach', ZOOM = 0.62, N = 0, DATEN = null;
  var PXMM = 96 / 25.4;

  function zeichen() {
    if (ZEICHEN) return Promise.resolve(ZEICHEN);
    return fetch('/_werkzeuge/carte/satz/zeichen.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (z) { ZEICHEN = z; SATZ.zeichen(z); return z; });
  }

  /* fluss: grösstes Schriftmass je Seite (höchstens das der Karte), dann alle auf das kleinste (pdf/fluss.js, unverändert im Ablauf) */
  function passeFluss() {
    var aus = [], blaetter = [].slice.call(document.querySelectorAll('.blatt.fl')), masse = [];
    function passt(b, box, v) { b.style.setProperty('--s', v.toFixed(4)); return box.scrollHeight <= box.clientHeight + 0.5; }
    blaetter.forEach(function (b) {
      var box = b.querySelector('.fl-in'), s = parseFloat(b.dataset.s || '1');
      if (!passt(b, box, s)) { var lo = 0.5, hi = s; for (var i = 0; i < 9; i++) { var m = (lo + hi) / 2; if (passt(b, box, m)) lo = m; else hi = m; } s = lo; }
      masse.push(s);
    });
    var einheit = Math.min.apply(null, masse.length ? masse : [1]);
    blaetter.forEach(function (b) { b.dataset.s = einheit.toFixed(4); });
    blaetter.forEach(function (b, n) {
      var box = b.querySelector('.fl-in'), s = parseFloat(b.dataset.s || '1');
      if (!passt(b, box, s)) { var lo = 0.5, hi = s; for (var i = 0; i < 9; i++) { var m = (lo + hi) / 2; if (passt(b, box, m)) lo = m; else hi = m; } s = lo; passt(b, box, s); }
      var fehler = [];
      if (box.scrollHeight > box.clientHeight + 0.5) fehler.push('zu hoch');
      var r = box.getBoundingClientRect();
      [].forEach.call(box.querySelectorAll('*'), function (e) {
        var qq = e.getBoundingClientRect();
        if (qq.width && (qq.right > r.right + 1 || qq.left < r.left - 14 * (r.width / 166))) fehler.push('ragt seitlich: ' + (e.textContent || e.className).trim().slice(0, 30));
        if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible') fehler.push('beschnitten: ' + e.textContent.trim().slice(0, 30));
      });
      aus.push({ seite: n + 1, mass: Math.round(s * 100), frei: Math.round((1 - box.scrollHeight / box.clientHeight) * 100), fehler: fehler });
    });
    return aus;
  }

  /* Bankettmenüs: Spalten-Satz wie pdf/druck.js (höchstens 100 %, alle Seiten auf das kleinste Mass, Preisblöcke einer Seite gleich hoch) */
  function passeBankett() {
    var aus = [], erg = [];
    [].forEach.call(document.querySelectorAll('.blatt'), function (b) {
      var sp = [].slice.call(b.querySelectorAll('.spalten .sp'));
      if (!sp.length) return;
      var s = 1.0;
      b.style.setProperty('--s', s);
      for (var i = 0; i < 7; i++) {
        var r = 0;
        sp.forEach(function (e) {
          var k = [].reduce.call(e.children, function (a, c) { return a + c.getBoundingClientRect().height; }, 0);
          r = Math.max.apply(null, [r, k / e.parentElement.getBoundingClientRect().height].concat([].map.call(e.querySelectorAll('p,h3'), function (qq) { return qq.scrollWidth / e.clientWidth; })));
        });
        if (r <= 1) break;
        s = s / r * 0.985;
        b.style.setProperty('--s', s);
      }
      aus.push(s);
    });
    if (aus.length) { var m = Math.min.apply(null, aus); [].forEach.call(document.querySelectorAll('.blatt'), function (b) { if (b.querySelector('.spalten .sp')) b.style.setProperty('--s', m); }); }
    [].forEach.call(document.querySelectorAll('.blatt'), function (b, n) {
      var u = [].slice.call(b.querySelectorAll('.spalten .sp > .unten'));
      if (u.length >= 2) {
        var h = Math.max.apply(null, u.map(function (e) { return e.getBoundingClientRect().height; }));
        u.forEach(function (e) { e.style.minHeight = h + 'px'; });
        if ([].some.call(b.querySelectorAll('.spalten .sp'), function (x) { return [].reduce.call(x.children, function (a, c) { return a + c.getBoundingClientRect().height; }, 0) > x.getBoundingClientRect().height + 1; })) u.forEach(function (e) { e.style.minHeight = ''; });
      }
      var fehler = [];
      [].forEach.call(b.querySelectorAll('.spalten .sp'), function (x) { if ([].reduce.call(x.children, function (a, c) { return a + c.getBoundingClientRect().height; }, 0) > x.getBoundingClientRect().height + 2) fehler.push('zu hoch'); });
      erg.push({ seite: n + 1, mass: Math.round(Math.min.apply(null, aus.length ? aus : [1]) * 100), frei: 0, fehler: fehler });
    });
    return erg;
  }

  /* Gestalten, das erst im Browser geht (wie GBR karte.js/satz.css, 16.10.2026):
     data-gt Schriftgrösse als Faktor: das Element bekommt seine Grösse relativ zum Umfeld in em, so folgt es auch dem Schriftmass der Seite.
     Linien: der Strich unter einer Rubrik oder zwischen Einträgen (unterer Rand) wird beim Bearbeiten, oder wenn er gestaltet ist, ein eigenes
     Element .lin an derselben Stelle (Länge, Stärke, Farbe, Lage, ausgeblendet); ungestaltet bleibt im Druck der Rand. */
  function gestaltAnwenden(bearbeiten) {
    [].forEach.call(document.querySelectorAll('#seiten [data-gt]'), function (el) {
      var p = el.parentElement, fs = parseFloat(getComputedStyle(el).fontSize), pf = p ? parseFloat(getComputedStyle(p).fontSize) : fs;
      el.style.fontSize = (fs / pf * parseFloat(el.dataset.gt)).toFixed(4) + 'em';
    });
    var kandidaten = bearbeiten ? document.querySelectorAll('#seiten [data-n^="seiten."]') : document.querySelectorAll('#seiten [data-lin-l]');
    [].forEach.call(kandidaten, function (el) {
      if (el.querySelector(':scope > .lin') || /:lin$/.test(el.dataset.n || '')) return;
      var c = getComputedStyle(el), bw = parseFloat(c.borderBottomWidth);
      if (!bw || c.borderBottomStyle === 'none' || c.borderBottomColor === 'rgba(0, 0, 0, 0)') return;
      var i = document.createElement('i'); i.className = 'lin'; i.setAttribute('data-lin', '');
      if (el.dataset.n) i.dataset.n = el.dataset.n + ':lin';
      i.style.cssText = 'position:absolute;left:0;bottom:' + (-bw) + 'px;width:100%;height:' + bw + 'px;background:' + c.borderBottomColor + ';transform-origin:0 0';
      var v = (el.dataset.linL || '').split(',');
      if (v.length > 4) {
        if (+v[0] || +v[1]) i.style.transform = 'translate(' + (+v[0]) + 'mm,' + (+v[1]) + 'mm)';
        if (+v[2]) i.style.width = (+v[2]) + 'mm';
        if (+v[3]) { i.style.height = (+v[3]) + 'mm'; i.style.bottom = '-' + (+v[3]) + 'mm'; }
        if (v[4]) i.style.background = v[4];
        if (v[5] === '1') i.style.visibility = 'hidden';
      }
      if (c.position === 'static') el.style.position = 'relative';
      el.style.borderBottomColor = 'transparent';
      el.appendChild(i);
    });
  }
  function setze(d, opt) {
    var css = SATZ.kopfCss(d);
    document.getElementById('karte-css').textContent = css;
    document.body.className = 'f-' + (d.format || 'A4') + (opt.vorschau ? ' vorschau ' + MODUS : '');
    var s = SATZ.seiten(d, { marken: opt.vorschau });
    document.getElementById('seiten').innerHTML = s.join('');
    return document.fonts.ready.then(function () {
      if (opt.vorschau) return null;   // Vorschau: Bilder haben feste Masse, der Satz steht schon, sie laden nach (Slow 4G: Text zuerst)
      return Promise.all([].map.call(document.images, function (i) { return i.complete ? 0 : new Promise(function (r) { i.onload = i.onerror = r; }); }));
    }).then(function () {
      gestaltAnwenden(opt.vorschau);
      // Verschobene Einträge (Gestalten) zählen beim Einpassen nicht mit: sie liegen über dem Fluss, ohne ihn zu ändern
      var bewegt = [].filter.call(document.querySelectorAll('#seiten [style*="transform"]'), function (e) { return !e.classList.contains('blatt') && e.style.transform && e.style.transform !== 'none'; });
      var alt = bewegt.map(function (e) { var v = e.style.transform; e.style.transform = 'none'; return v; });
      var bericht = d.art === 'bankett' ? passeBankett() : passeFluss();
      bewegt.forEach(function (e, i) {
        e.style.transform = alt[i];
        var bl = e.closest('.blatt'), rb = bl.getBoundingClientRect(), r = e.getBoundingClientRect(), n = [].indexOf.call(document.querySelectorAll('.blatt'), bl);
        if (e.style.display !== 'none' && (r.left < rb.left - 1 || r.right > rb.right + 1 || r.top < rb.top - 1 || r.bottom > rb.bottom + 1) && bericht[n]) bericht[n].fehler.push('ragt über den Rand des Blatts: ' + ((e.textContent || '').trim().slice(0, 30) || (e.classList.contains('lin') ? 'Linie' : 'Zeichen')));
      });
      var fehler = [], warn = [];
      bericht.forEach(function (b) { if (b.fehler.length) fehler.push('Seite ' + b.seite + ': ' + b.fehler.filter(function (x, i, a) { return a.indexOf(x) === i; }).join(', ')); });
      var m = bericht.length ? Math.min.apply(null, bericht.map(function (b) { return b.mass; })) : 100;
      if (m < 80) warn.push('Die Schrift ist auf ' + m + ' % verkleinert, damit alles auf die Seiten passt. Lieber Einträge auf eine andere Seite schieben.');
      return { seiten: s.length, mass: bericht.map(function (b) { return b.mass; }), frei: bericht.map(function (b) { return b.frei; }), fehler: fehler, warn: warn };
    });
  }

  /* ---------------------------------------------------------------- Druck */
  if (q.get('druck')) {
    zeichen().then(function () {
      return fetch('/_werkzeuge/carte/api/druckdaten?z=' + encodeURIComponent(q.get('z') || '') + '&q=' + encodeURIComponent(q.get('q') || 'stand'), { cache: 'no-store' });
    }).then(function (r) { if (!r.ok) throw new Error('Daten ' + r.status); return r.json(); }).then(function (d) {
      document.title = d.name + ' · Carlton-Europe Vintage Adults Hotel';
      return setze(d, {});
    }).then(function (b) { window.CARTE_FERTIG = b; document.documentElement.dataset.fertig = '1'; })
      .catch(function (e) { window.CARTE_FEHLER = String(e && e.stack || e); });
    return;
  }

  /* ---------------------------------------------------------------- Mini (Fenster «So steht es auf der Karte»): ein Eintrag allein, gesetzt wie in der PDF */
  if (q.get('mini')) {
    document.body.className = 'mini';
    window.addEventListener('message', function (ev) {
      if (ev.origin !== location.origin || !ev.data || ev.data.carte !== 'mini') return;
      var m = ev.data, d = m.karte;
      zeichen().then(function () {
        var html;
        if (d.art === 'bankett') {
          html = '<section class="blatt bk mini-bk" data-b="297">' + '<div class="spalten"><div class="sp"><div class="oben">' + '%Z%' + '</div></div></div></section>';
          var row = SATZ.seiten({ art: 'bankett', seiten: [{ titel: '', fuss: '', spalten: [{ oben: [m.zeile], unten: null }, { oben: [], unten: null }, { oben: [], unten: null }] }] })[0];
          html = html.replace('%Z%', (row.match(/<div class="oben">([\s\S]*?)<\/div>/) || ['', ''])[1]);
          document.getElementById('karte-css').textContent = SATZ.kopfCss(d) + '.mini-bk{height:auto!important;width:110mm!important}.mini-bk .spalten{position:static;display:block;padding:4mm 6mm}.mini-bk .sp{display:block}';
        } else {
          html = SATZ.seiten({ art: 'fluss', format: d.format, css: d.css, konst: d.konst, seiten: [{ fn: 'blatt', a: [m.knoten], k: { band: 'ohne', fuss: null, kl: m.kl || '' } }] })[0];
          document.getElementById('karte-css').textContent = SATZ.kopfCss(d) + '.blatt.fl{height:auto!important}.blatt.fl .fl-in{position:static;padding:5mm var(--rand) 5mm}';
        }
        document.getElementById('seiten').innerHTML = html;
        return document.fonts.ready;
      }).then(function () {
        var b = document.querySelector('.blatt'); if (!b) return;
        var w = parseFloat(getComputedStyle(b).width), z = Math.min(1, (document.documentElement.clientWidth - 4) / w);
        b.style.transformOrigin = '0 0'; b.style.transform = 'scale(' + z + ')'; b.style.margin = '0';
        an('mini-hoehe', { h: Math.ceil(b.offsetHeight * z) + 4 });
      });
    });
    return;
  }
  /* ---------------------------------------------------------------- Vorschau im Werkzeug */
  /* Verkleinern mit transform, nie mit CSS-zoom: zoom rechnet die Schrift neu und bricht anders um, dann läuft der Satz über (15.10.2026, Roberts Fund).
     Gesetzt und gemessen wird immer in Originalgrösse, nur das Bild wird kleiner. */
  function zoomen() {
    var vw = document.documentElement.clientWidth;
    [].forEach.call(document.querySelectorAll('.blatt'), function (b) {
      var w = parseFloat(b.dataset.b) * 96 / 25.4, h = b.offsetHeight;
      var z = Math.min(ZOOM, Math.max(0.25, (vw - 16) / w)), off = Math.max(0, (vw - w * z) / 2);
      b.style.transformOrigin = '0 0';
      b.style.transform = 'translateX(' + off.toFixed(1) + 'px) scale(' + z.toFixed(4) + ')';
      b.style.margin = '0 0 ' + (-(h * (1 - z)) + 26).toFixed(1) + 'px 0';
    });
  }
  function zeilen(b) {
    var seiten = [].slice.call(document.querySelectorAll('.blatt'));
    seiten.forEach(function (bl, i) {
      var z = document.createElement('p'), r = b.mass[i], f = b.fehler.filter(function (x) { return x.indexOf('Seite ' + (i + 1) + ':') === 0; });
      z.className = 'nr-zeile' + (f.length || r < 80 ? ' warn' : '');
      z.innerHTML = '<span>Seite <b>' + (i + 1) + '</b> von ' + seiten.length + '</span>' + (r < 100 ? '<span>Schrift <b>' + r + ' %</b></span>' : '') + (f.length ? '<span><b>passt nicht</b></span>' : '');
      bl.parentNode.insertBefore(z, bl.nextSibling);
    });
  }
  function lies(o, pfad) { return pfad.split('.').reduce(function (x, k) { return x == null ? x : x[/^\d+$/.test(k) ? +k : k]; }, o); }
  function an(art, x) { parent.postMessage(Object.assign({ carte: art }, x), location.origin); }
  window.addEventListener('message', function (ev) {
    if (ev.origin !== location.origin || !ev.data || !ev.data.carte) return;
    var m = ev.data;
    if (m.carte === 'zoom') { ZOOM = m.zoom; zoomen(); return ANR.gesetzt(m.wahl || null); }
    if (m.carte === 'pfeil') return ANR.pfeil(m.key, m.shift);
    if (m.carte === 'abwaehlen') return ANR.waehle(null, true);
    if (m.carte === 'blitz') {
      var treffer = [].slice.call(document.querySelectorAll('[data-k="' + m.pfad + '"],[data-k^="' + m.pfad + '."]'));
      if (!treffer.length) return;
      var r0 = treffer[0].getBoundingClientRect();   // nur in diesem Rahmen scrollen, nie die Seite darum herum
      var ziel = m.y == null ? window.innerHeight / 2 : Math.max(40, Math.min(window.innerHeight - 40, m.y));   // dieselbe Höhe wie links (GBR blitzRechts)
      window.scrollTo({ top: Math.max(0, window.scrollY + r0.top + r0.height / 2 - ziel), behavior: 'smooth' });
      treffer.forEach(function (el) { el.classList.remove('blitz'); void el.offsetWidth; el.classList.add('blitz'); });
      return;
    }
    if (m.carte === 'setze') {
      var nr = ++N, oben = window.scrollY;
      MODUS = m.modus || 'einfach'; ZOOM = m.zoom || ZOOM;
      zeichen().then(function () { return setze(m.daten, { vorschau: true }); }).then(function (b) {
        if (nr !== N) return;
        zoomen(); zeilen(b);
        DATEN = m.daten;
        if (MODUS === 'frei') [].forEach.call(document.querySelectorAll('[data-k]'), function (el) { if ((m.geschrieben || []).indexOf(el.dataset.k) >= 0) el.classList.add('geaendert'); });
        window.scrollTo(0, oben);
        ANR.gesetzt(MODUS === 'frei' ? (m.wahl || null) : null, m.neu);
        an('gesetzt', { bericht: b, hoehe: document.documentElement.scrollHeight });
      }).catch(function (e) { an('fehler', { text: String(e && e.message || e) }); });
    }
  });
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-k]');
    if (!el || MODUS === 'frei') return;
    an('klick', { pfad: el.dataset.k });
  });
  document.addEventListener('dblclick', function (ev) {
    var el = ev.target.closest('[data-k]');
    if (el && MODUS !== 'frei') an('doppel', { pfad: el.dataset.k });
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target.closest('[data-k]'); if (!el) return;
    el.classList.add('geaendert');
    an('text', { pfad: el.dataset.k, wert: el.textContent.replace(/\s+/g, ' ').trim() });
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.target.closest && ev.target.closest('[data-k]') && ev.key === 'Enter') { ev.preventDefault(); ev.target.blur(); }
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); an('speichern', {}); }
  });
  document.addEventListener('paste', function (ev) {
    var el = ev.target.closest && ev.target.closest('[data-k]'); if (!el) return;
    ev.preventDefault();
    document.execCommand('insertText', false, (ev.clipboardData.getData('text/plain') || '').replace(/\s+/g, ' '));
  });
  document.addEventListener('focusout', function (ev) { if (ev.target.closest && ev.target.closest('[data-k]')) an('fertig-geschrieben', {}); });
  /* ---------------------------------------------------------------- Freie Anordnung im Modus «Fortgeschritten» (1:1 nach La Carte des Grand Beau-Rivage,
     anordnen.js 15./16.10.2026). Ein Klick wählt ein Element der Seite (Rubrik, Gericht, Zeile, Hinweis, Text, Linie, Logo, Band, Kopfzeile, Zeichen,
     Fusszeile). Ziehen verschiebt es, mit Einrasten an Seitenmitte, Satzspiegel, Seitenrand und den anderen Elementen (rote Hilfslinien, Alt hält es an).
     Die vier Ecken machen es grösser oder kleiner im Verhältnis (40–300 %), die gegenüberliegende Ecke bleibt stehen; Linien haben Griffe an den Enden
     für die Länge. Pfeile 0,5 mm, mit Umschalt 5 mm. Doppelklick schreibt in den Text. Entf entfernt, Esc schliesst, ⌘Z / ⌘⇧Z nimmt zurück und
     wiederholt (der Verlauf liegt im Werkzeug). «Anordnung zurücksetzen» unter jeder Seite. Nichts Sichtbares verlässt das Blatt.
     Die Daten hält das Werkzeug (carte.js): hier wird nur gezeigt, gezogen und die neue Lage gemeldet. */
  var ANR = (function () {
    var FANG = 6, S_MIN = 0.4, S_MAX = 3, PX = 96 / 25.4;
    var SEL = null, zug = null, schreibt = null;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
    var an_ = function () { return MODUS === 'frei'; };
    var elVon = function (l) { return l ? document.querySelector('#seiten [data-n="' + (window.CSS && CSS.escape ? CSS.escape(l) : l) + '"]') : null; };
    var alleVon = function (l) { return l ? $$('#seiten [data-n="' + (window.CSS && CSS.escape ? CSS.escape(l) : l) + '"]') : []; };

    /* Lage aus dem Element lesen (transform und Breite, so wie der Satz sie geschrieben hat) */
    function lage(el) {
      var t = el.style.transform || '', m = t.match(/translate\(\s*(-?[\d.]+)mm\s*(?:,\s*(-?[\d.]+)mm)?\s*\)/), k = t.match(/scale\(\s*([\d.]+)/);
      var v = { x: m ? +m[1] : 0, y: m && m[2] ? +m[2] : 0, s: k ? +k[1] : 1 };
      if (el.hasAttribute('data-lin')) v.b = el.getBoundingClientRect().width / massstab(el) / PX;
      return v;
    }
    function zeige(els, v) { els.forEach(function (el) { var st = SATZ.lageStil(v).replace(/^transform:|;transform-origin:0 0$/g, ''); el.style.transform = st || ''; el.style.transformOrigin = '0 0'; }); }
    function massstab(el) { var bl = el.closest('.blatt'); if (!bl) return 1; return bl.getBoundingClientRect().width / (parseFloat(bl.dataset.b) * PX) || 1; }

    /* Sichtbarer Inhalt eines Elements (GBR inhalt()): Texte, Zeichen, Linien, Kästen mit Rand oder Fläche */
    function inhalt(el) {
      var L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
      var nimm = function (r) { if (r.width < 0.5 && r.height < 0.5) return; L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, r.right); B = Math.max(B, r.bottom); };
      var els = el.length !== undefined ? el : [el];
      els.forEach(function (e0) {
        var rg = document.createRange(), w = document.createTreeWalker(e0, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        for (var n = w.currentNode; n; n = w.nextNode()) {
          if (n.nodeType === 3) { if (n.textContent.trim()) { rg.selectNodeContents(n); [].forEach.call(rg.getClientRects(), nimm); } continue; }
          if (n.namespaceURI === 'http://www.w3.org/2000/svg') { if (n.tagName.toLowerCase() === 'svg') nimm(n.getBoundingClientRect()); continue; }
          if (n.classList && n.classList.contains('lin') && n !== e0) continue;   // die Linie eines Eintrags ist ein eigenes Element
          var c = getComputedStyle(n);
          if (n.tagName === 'IMG' || (n.tagName === 'I' && !n.firstChild) || parseFloat(c.borderTopWidth) || parseFloat(c.borderLeftWidth) || parseFloat(c.borderRightWidth)
            || (parseFloat(c.borderBottomWidth) && c.borderBottomColor !== 'rgba(0, 0, 0, 0)')
            || (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') || c.backgroundImage !== 'none') nimm(n.getBoundingClientRect());
        }
      });
      if (L === Infinity) return els[0].getBoundingClientRect();
      return { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T };
    }

    /* Auswahl, Griffe, Hilfslinien */
    function ebene() {
      var a = $('#anr');
      if (!a) {
        a = document.createElement('div'); a.id = 'anr'; a.className = 'anr'; a.hidden = true;
        a.innerHTML = ['nw', 'ne', 'se', 'sw', 'w', 'e'].map(function (g) { return '<i class="anr__g anr__g--' + g + '" data-g="' + g + '"></i>'; }).join('') + '<b class="anr__m"></b>';
        document.body.appendChild(a);
        a.addEventListener('pointerdown', griffAn);
      }
      return a;
    }
    function box(a, r) { a.style.left = r.left + scrollX + 'px'; a.style.top = r.top + scrollY + 'px'; a.style.width = r.width + 'px'; a.style.height = r.height + 'px'; }
    function zeichne(mass) {
      var a = ebene(), els = an_() ? alleVon(SEL) : [], el = els[0];
      if (!el || !el.getBoundingClientRect().width || el.isContentEditable || (el.contains(document.activeElement) && document.activeElement.isContentEditable)) { a.hidden = true; return; }
      var r = inhalt(els);
      a.classList.toggle('anr--lin', el.hasAttribute('data-lin'));
      a.classList.toggle('anr--band', /^b:/.test(SEL));
      a.hidden = false; box(a, { left: r.left - 3, top: r.top - 3, width: r.width + 6, height: r.height + 6 });
      var m = $('.anr__m', a); m.textContent = mass || ''; m.hidden = !mass;
    }
    function linien(xs, ys, B) {
      $$('.anr-hl').forEach(function (n) { n.remove(); });
      xs.forEach(function (x) { var d = document.createElement('i'); d.className = 'anr-hl'; box(d, { left: x, top: B.top, width: 1, height: B.height }); document.body.appendChild(d); });
      ys.forEach(function (y) { var d = document.createElement('i'); d.className = 'anr-hl'; box(d, { left: B.left, top: y, width: B.width, height: 1 }); document.body.appendChild(d); });
    }
    function info(l) {   // was die Seitenleiste «Gestalten» über das gewählte Element wissen muss
      var els = alleVon(l), el = els[0]; if (!el) return null;
      var bl = el.closest('.blatt'), k = massstab(el), mm = function (px) { return px / PX; };
      var art = el.hasAttribute('data-lin') || /:lin$/.test(l) ? 'linie' : /^[lz]:/.test(l) ? 'zeichen' : /^b:/.test(l) ? 'band' : /^[kfs]:/.test(l) ? 'text' : 'eintrag';
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), ht = el;
      for (var n = w.nextNode(); n; n = w.nextNode()) if (n.textContent.trim() && !(n.parentElement.closest('.lin'))) { ht = n.parentElement; break; }
      var hs = getComputedStyle(ht), cs = getComputedStyle(el), v = lage(el);
      var lh = hs.lineHeight === 'normal' ? 1.2 : parseFloat(hs.lineHeight) / parseFloat(hs.fontSize);
      var r = el.getBoundingClientRect();
      var name = art === 'linie' ? 'Linie' : art === 'zeichen' ? (/^l:/.test(l) ? 'Logo' : 'Zeichen des Hauses') : art === 'band' ? 'Band oben' : /^f:/.test(l) ? 'Fusszeile' : /^k:/.test(l) ? 'Kopfzeile' : '«' + (ht.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 34) + ((ht.textContent || '').trim().length > 34 ? '…' : '') + '»';
      return { id: l, art: art, name: name, pt: (parseFloat(hs.fontSize) || 12) * 0.75 * (art === 'eintrag' ? 1 : v.s), lh: lh, mt: mm(parseFloat(cs.marginTop) || 0), mb: mm(parseFloat(cs.marginBottom) || 0),
        dicke: mm(parseFloat(cs.height) || 0), laenge: r.width / k / PX, hoehe: r.height / k / PX, s: v.s, blattB: bl ? parseFloat(bl.dataset.b) : 210 };
    }
    function waehle(l, still) {
      var neu = l !== SEL; SEL = l; zeichne(); schwebe(null);
      if (neu && !still) an('wahl', { info: l ? info(l) : null });
    }
    function schwebe(el) {
      var h = $('#anr-h');
      if (!h) { h = document.createElement('div'); h.id = 'anr-h'; h.className = 'anr-h'; document.body.appendChild(h); }
      if (!el || el.dataset.n === SEL || zug || el.isContentEditable) { h.hidden = true; return; }
      var r = inhalt(alleVon(el.dataset.n)); h.hidden = false; box(h, { left: r.left - 3, top: r.top - 3, width: r.width + 6, height: r.height + 6 });
    }

    /* «Anordnung zurücksetzen» unter jeder Seite, sobald dort etwas verschoben ist */
    function knoepfe() {
      $$('#seiten .blatt').forEach(function (bl, i) {
        var nz = bl.nextElementSibling && bl.nextElementSibling.classList.contains('nr-zeile') ? bl.nextElementSibling : null; if (!nz) return;
        var k = $('.anr-zu', nz), ids = [];
        if (an_()) $$('[data-n]', bl).forEach(function (el) { var v = lage(el); if (Math.abs(v.x) > 0.04 || Math.abs(v.y) > 0.04 || Math.abs(v.s - 1) > 0.004 || (el.hasAttribute('data-lin') && el.style.width && /mm$/.test(el.style.width))) ids.push(el.dataset.n); });
        if (!ids.length) { if (k) k.remove(); return; }
        if (!k) { k = document.createElement('button'); k.type = 'button'; k.className = 'anr-zu'; k.textContent = 'Anordnung zurücksetzen'; nz.appendChild(k); }
        k.dataset.ids = JSON.stringify(ids.filter(function (x, j, a) { return a.indexOf(x) === j; })); k.dataset.seite = i + 1;
      });
    }

    /* Ziehen */
    function ziele(els, blatt) {   // Kanten und Mitten: Seite, Satzspiegel (haben Vorrang), dann alle anderen Elemente der Seite
      var B = blatt.getBoundingClientRect(), xs = [B.left, B.left + B.width / 2, B.right], ys = [B.top, B.top + B.height / 2, B.bottom], exs = [], eys = [];
      var inh = blatt.querySelector('.fl-in') || blatt.querySelector('.spalten');
      if (inh) { var r = inh.getBoundingClientRect(); xs.push(r.left, r.right); ys.push(r.top, r.bottom); }
      $$('[data-n]', blatt).forEach(function (o) {
        if (els.some(function (el) { return o === el || o.contains(el) || el.contains(o); })) return;
        if (!o.getBoundingClientRect().width) return;
        var q = inhalt(o); exs.push(q.left, q.left + q.width / 2, q.right); eys.push(q.top, q.top + q.height / 2, q.bottom);
      });
      return { xs: xs, ys: ys, exs: exs, eys: eys, B: B };
    }
    function fang(werte, ziel) { var best = null; werte.forEach(function (w) { ziel.forEach(function (z) { var d = z - w; if (Math.abs(d) <= FANG && (!best || Math.abs(d) < Math.abs(best.d))) best = { d: d, z: z }; }); }); return best; }
    function start(ev, art, els) {
      var el = els[0], blatt = el.closest('.blatt'), R = el.getBoundingClientRect(), C = inhalt(els), k = massstab(el) * PX;
      var v = lage(el);
      var M = { NL: R.left - v.x * k, NT: R.top - v.y * k, cl: (C.left - R.left) / v.s, ct: (C.top - R.top) / v.s, cw: C.width / v.s, ch: C.height / v.s };
      zug = { art: art, els: els, el: el, l: SEL, px: ev.clientX, py: ev.clientY, R: C, RR: R, M: M, k: k, v: v, cx: v.x, blatt: blatt, Z: ziele(els, blatt), bewegt: false };
      schwebe(null);
      /* 16.10.2026 (Absicherung aus der Prüfung): geht ein Loslassen verloren (im Prüfbrowser Firefox, wenn ausserhalb des Fensters losgelassen wird),
         hinge das Element am Zeiger. Darum Zeiger festhalten, und eine Bewegung ohne gedrückte Taste beendet das Ziehen an der letzten Stelle. */
      try { if (ev.pointerId !== undefined && ev.target.setPointerCapture) ev.target.setPointerCapture(ev.pointerId); } catch (e) { /* ohne Festhalten */ }
      addEventListener('pointermove', zieh); addEventListener('pointerup', ende); addEventListener('pointercancel', ende); addEventListener('blur', ende);
    }
    function zieh(ev) {
      if (!zug) return;
      if (ev.buttons === 0 && ev.pointerType === 'mouse') return ende();
      var dx = ev.clientX - zug.px, dy = ev.clientY - zug.py;
      if (!zug.bewegt && Math.hypot(dx, dy) < 3) return;
      zug.bewegt = true; ev.preventDefault();
      var R = zug.R, k = zug.k, v = zug.v, Z = zug.Z, B = Z.B, n;
      if (zug.art === 'zieh') {
        var lx = [], ly = [];
        if (!ev.altKey) {
          var wx = [R.left + dx, R.left + R.width / 2 + dx, R.right + dx], wy = [R.top + dy, R.top + R.height / 2 + dy, R.bottom + dy];
          var fx = fang(wx, Z.xs) || fang(wx, Z.exs), fy = fang(wy, Z.ys) || fang(wy, Z.eys);
          if (fx) { dx += fx.d; lx.push(fx.z); }
          if (fy) { dy += fy.d; ly.push(fy.z); }
        }
        dx = Math.min(B.right - R.right, Math.max(B.left - R.left, dx)); dy = Math.min(B.bottom - R.bottom, Math.max(B.top - R.top, dy));   // bleibt auf dem Blatt
        linien(lx.filter(function (x) { return Math.abs(x - (R.left + dx)) < 1 || Math.abs(x - (R.left + R.width / 2 + dx)) < 1 || Math.abs(x - (R.right + dx)) < 1; }),
          ly.filter(function (y) { return Math.abs(y - (R.top + dy)) < 1 || Math.abs(y - (R.top + R.height / 2 + dy)) < 1 || Math.abs(y - (R.bottom + dy)) < 1; }), B);
        n = { x: v.x + dx / k, y: v.y + dy / k, s: v.s };
        zeige(zug.els, n); zug.n = n;
        zeichne((n.x >= 0 ? '+' : '') + n.x.toFixed(1) + ' · ' + (n.y >= 0 ? '+' : '') + n.y.toFixed(1) + ' mm');
      } else if (zug.art === 'w' || zug.art === 'e') {   // Linie: Länge, die andere Kante bleibt stehen
        var g = zug.art, el = zug.el;
        var w = Math.max(2 * k, Math.min(B.width, R.width + (g === 'e' ? dx : -dx))), b = w / k;
        el.style.width = b.toFixed(2) + 'mm';
        var r2 = el.getBoundingClientRect(), fest = g === 'e' ? R.left : R.right, jetzt = g === 'e' ? r2.left : r2.right;
        zug.cx += (fest - jetzt) / k;
        n = { x: zug.cx, y: v.y, s: 1, b: Math.round(b * 10) / 10 };
        zeige(zug.els, n); zug.n = n;
        zeichne(b.toFixed(1) + ' mm');
      } else {
        var gg = zug.art, sx = gg.indexOf('e') >= 0 ? 1 : -1, sy = gg.indexOf('s') >= 0 ? 1 : -1, M = zug.M;   // die gegenüberliegende Ecke bleibt stehen
        var s1 = (R.width + sx * dx) / M.cw, s2 = (R.height + sy * dy) / M.ch;
        var sk = Math.abs(s1 - v.s) > Math.abs(s2 - v.s) ? s1 : s2;
        var maxW = sx > 0 ? B.right - R.left : R.right - B.left, maxH = sy > 0 ? B.bottom - R.top : R.bottom - B.top;
        sk = Math.max(S_MIN, Math.min(S_MAX, sk, maxW / M.cw, maxH / M.ch));
        var links = sx > 0 ? R.left : R.right - M.cw * sk, oben = sy > 0 ? R.top : R.bottom - M.ch * sk;
        n = { x: (links - M.NL - M.cl * sk) / k, y: (oben - M.NT - M.ct * sk) / k, s: sk };
        zeige(zug.els, n); zug.n = n;
        zeichne(Math.round(sk * 100) + ' %');
      }
    }
    function ende() {
      removeEventListener('pointermove', zieh); removeEventListener('pointerup', ende); removeEventListener('pointercancel', ende); removeEventListener('blur', ende);
      var z = zug; zug = null; linien([], [], {});
      if (!z) return;
      if (z.bewegt && z.n) { an('lage', { id: z.l, v: z.n }); knoepfe(); }
      zeichne();
    }
    function griffAn(ev) {
      var g = ev.target.closest('[data-g]'); if (!g || !SEL) return;
      var els = alleVon(SEL); if (!els.length) return;
      ev.preventDefault(); ev.stopPropagation();
      start(ev, g.dataset.g, els);
    }
    function schreibtGerade() { var a = document.activeElement; return a && a.isContentEditable && a.closest('#seiten') ? a : null; }
    function pfeil(key, shift) {
      var els = alleVon(SEL), el = els[0]; if (!el) return;
      var st = shift ? 5 : 0.5, p = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[key]; if (!p) return;
      var blatt = el.closest('.blatt'), B = blatt.getBoundingClientRect(), R = inhalt(els), kk = massstab(el) * PX;
      var dx = Math.min((B.right - R.right) / kk, Math.max((B.left - R.left) / kk, p[0])), dy = Math.min((B.bottom - R.bottom) / kk, Math.max((B.top - R.top) / kk, p[1]));
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
      var v = lage(el), n = { x: v.x + dx, y: v.y + dy, s: v.s };
      zeige(els, n); zeichne(); knoepfe();
      an('lage', { id: SEL, v: n });
    }
    function schreibbar(t) {   // Text, der direkt in der Karte geändert werden darf
      if (!t || t.querySelector('[data-k]')) return false;
      if (DATEN && DATEN.art === 'mittag') {   // Mittagsmenü: nur Texte aus einem Feld der Woche (Tag und Gänge setzt die Woche)
        var gen = { seiten: SATZ.MITTAG.seiten(DATEN.woche) }, kk = t.dataset.k.split('.'), node = lies(gen, kk.slice(0, -2).join('.'));
        return !!(node && node.w);
      }
      return !/\*\*|__|~|\||→|☐|\\\*|<small>/.test(String(lies(DATEN || {}, t.dataset.k) || ''));   // Text mit Auszeichnung nur im Fenster
    }

    function verbinden() {
      var S = document.getElementById('seiten');
      S.addEventListener('pointerdown', function (ev) {
        if (!an_() || ev.button !== 0 || ev.target.closest('.anr-zu')) return;
        var e = schreibtGerade(); if (e && e.contains(ev.target)) return;   // beim Schreiben setzt ein Klick den Zeiger in den Text
        var el = ev.target.closest('[data-n]');
        if (!el) { if (SEL) waehle(null); return; }
        ev.preventDefault();
        if (e) e.blur();
        waehle(el.dataset.n);
        start(ev, 'zieh', alleVon(el.dataset.n));
      });
      S.addEventListener('dblclick', function (ev) {   // direkt in den Text schreiben
        if (!an_()) return;
        var t = ev.target.closest('[data-k]'); if (!schreibbar(t)) return;
        t.contentEditable = 'true'; t.spellcheck = true; t.focus();
        var r = null;
        if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(ev.clientX, ev.clientY);
        else if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(ev.clientX, ev.clientY); if (p) { r = document.createRange(); r.setStart(p.offsetNode, p.offset); } }
        if (r && t.contains(r.startContainer)) { var sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); }
        schreibt = t; an('schreibt', {});
        var a = $('#anr'); if (a) a.hidden = true;
      });
      S.addEventListener('focusout', function (ev) { if (ev.target === schreibt) { schreibt.contentEditable = 'false'; schreibt = null; } });
      S.addEventListener('pointermove', function (ev) { if (an_() && !zug) schwebe(ev.target.closest('[data-n]')); });
      S.addEventListener('pointerleave', function () { schwebe(null); });
      addEventListener('scroll', function () { zeichne(); }, { passive: true });
      // Grössenwechsel: zeichnet der Rahmen-Teil oben nach dem Einpassen (zoomen)
      document.addEventListener('click', function (ev) {
        var b = ev.target.closest('.anr-zu'); if (!b || !an_()) return;
        an('seite-zurueck', { ids: JSON.parse(b.dataset.ids || '[]'), seite: +b.dataset.seite });
      });
      document.addEventListener('keydown', function (ev) {
        // ⌘S speichert auch, wenn der Fokus in der Vorschau liegt (GBR: ein Dokument; hier ein Rahmen, sonst speichert der Browser die Seite)
        if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); var sg = schreibtGerade(); if (sg) sg.blur(); return setTimeout(function () { an('taste', { was: 'speichern' }); }, 60); }
        if (!an_() || schreibtGerade() || zug) return;
        var cmd = ev.metaKey || ev.ctrlKey, k = ev.key.toLowerCase();
        if (cmd && k === 'z') { ev.preventDefault(); return an('taste', { was: ev.shiftKey ? 'vor' : 'zurueck' }); }
        if (cmd && k === 'y') { ev.preventDefault(); return an('taste', { was: 'vor' }); }
        if (!SEL) return;
        if (ev.key === 'Escape') { waehle(null); return an('taste', { was: 'esc' }); }
        if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); return an('entf', { id: SEL }); }
        if (/^Arrow/.test(ev.key)) { ev.preventDefault(); pfeil(ev.key, ev.shiftKey); }
      });
    }
    /* Beim Öffnen einer Karte federn die Seiten einmal herein (GBR auftritt(), Klasse kt-auf 2,4 s); beim Bearbeiten bewegt sich nichts nach */
    var aufUhr = 0;
    function auftritt() {
      var S = document.getElementById('seiten'), f = $$('.blatt', S); if (!f.length) return;
      f.forEach(function (x, i) { x.style.setProperty('--i', Math.min(i, 6)); });
      S.classList.remove('kt-auf'); void S.offsetWidth; S.classList.add('kt-auf');
      clearTimeout(aufUhr); aufUhr = setTimeout(function () { S.classList.remove('kt-auf'); zeichne(); }, 2400);
    }
    verbinden();
    return {
      gesetzt: function (wahl, neu) {
        if (neu) auftritt();
        document.body.classList.toggle('anr-an', an_());
        SEL = an_() && wahl && elVon(wahl) ? wahl : null;
        knoepfe(); zeichne();
        if (wahl && !SEL) an('wahl', { info: null }); else if (SEL) an('wahl', { info: info(SEL), still: true });
      },
      pfeil: pfeil, waehle: waehle, inhalt: inhalt, zeichne: zeichne,
    };
  })();
  // Erst die Blätter neu einpassen, dann Rahmen und Griffe nachziehen (die Seitenleiste «Gestalten» macht die Vorschau schmaler; 16.10.2026)
  window.addEventListener('resize', function () { zoomen(); if (ANR) ANR.zeichne(); });
  document.body.classList.add('vorschau');
  an('bereit', {});
})();
