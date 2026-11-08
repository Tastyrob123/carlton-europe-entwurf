/* Kurzer Rundgang durch Le Livre · Carlton-Europe (Kopie aus _werkzeuge/registre/rundgang.js, Prüfung 16.10.2026; Schild nur, solange der Rundgang in diesem Browser nicht gesehen oder weggeklickt wurde) (Vorlage: assets/js/rundgang.js des Grand Beau-Rivage, Robert 16.10.2026: «einmal ganz kurz zeigen, hier kannst du das machen,
   da das, damit man weiss, wo man gelandet ist»). Ein Lichtkegel liegt auf dem echten Bedienelement, daneben eine Karte mit zwei, drei Sätzen.
   Kein Start von selbst: unten rechts erscheint ein Schild «Kurzer Rundgang» (fünf Sekunden, die Maus darauf hält es), dann zieht es sich zurück.
   Wieder aufrufen: «Kurzer Rundgang» im Rand oder ?rundgang (startet direkt). Automatische Prüfungen (navigator.webdriver) und eingebettete Ansichten sehen nichts. */
(function () {
  var Q = new URLSearchParams(location.search), ERZWINGEN = Q.has('rundgang');
  if (window.self !== window.top && !ERZWINGEN) return;
  /* Drei Sprachen wie Le Livre (Prüfung 16.10.2026): gewählt wird nach <html lang>, das livre.js beim Sprachwechsel setzt */
  var G = { name: 'Le Livre', schritte: [
    { ziel: ['#ansicht .li-hero'], titel: { de: 'Das ist Le Livre', en: 'This is Le Livre', fr: 'Voici Le Livre' },
      text: { de: 'Die Marke des Hauses zum Arbeiten. Alles, was Team, Agenturen und Druckereien vom Carlton-Europe brauchen, an einem Ort.',
        en: 'The hotel’s brand, ready to work with. Everything the team, agencies and printers need from the Carlton-Europe, in one place.',
        fr: 'La marque de l’hôtel, prête à l’emploi. Tout ce dont l’équipe, les agences et les imprimeurs ont besoin du Carlton-Europe, au même endroit.' } },
    { ziel: ['#ansicht .li-karten'], titel: { de: 'Fotos, Logo, Prüfung', en: 'Photos, logo, check', fr: 'Photos, logo, contrôle' },
      text: { de: 'Jedes Foto in der richtigen Grösse für Instagram, Website oder Druck, das Logo für jede Fläche und eine Prüfung, ob ein Entwurf zum Haus passt.',
        en: 'Every photo in the right size for Instagram, website or print, the logo for every surface, and a check whether a draft fits the hotel.',
        fr: 'Chaque photo au bon format pour Instagram, le site ou l’impression, le logo pour chaque surface et un contrôle pour savoir si un projet correspond à l’hôtel.' } },
    { ziel: ['#ansicht .li-buch'], titel: { de: 'Wie das Haus aussieht', en: 'How the hotel looks', fr: 'L’allure de l’hôtel' },
      text: { de: 'Das Markenbuch: Farben, Schriften, Zeichen und warum sie so sind. Zum Nachschlagen und zum Weitergeben.',
        en: 'The brand book: colours, typefaces, monogram and why they are as they are. To look things up and to pass on.',
        fr: 'Le livre de marque : couleurs, typographies, monogramme et leurs raisons. Pour consulter et pour transmettre.' } },
    { ziel: ['#leiste'], titel: { de: 'Weitergeben mit einem Klick', en: 'Pass it on with one click', fr: 'Transmettre en un clic' },
      text: { de: 'Alle Dateien als ein Paket, die Bildrechte gleich dabei.', en: 'All files as one package, with the image rights included.', fr: 'Tous les fichiers en un seul paquet, droits des images compris.' } }
  ] };
  var WORT = { de: { rundgang: 'Kurzer Rundgang', von: 'von', weiter: 'Weiter', los: 'Los geht’s', ueber: 'Überspringen', zeigen: 'Zeigen', zu: 'Schliessen' },
    en: { rundgang: 'Short tour', von: 'of', weiter: 'Next', los: 'Let’s go', ueber: 'Skip', zeigen: 'Show', zu: 'Close' },
    fr: { rundgang: 'Petite visite', von: 'sur', weiter: 'Suivant', los: 'C’est parti', ueber: 'Passer', zeigen: 'Montrer', zu: 'Fermer' } };
  function sp() { var l = (document.documentElement.lang || 'de').slice(0, 2); return WORT[l] ? l : 'de'; }
  function w(k) { return WORT[sp()][k]; }
  function wahl(x) { return typeof x === 'string' ? x : (x[sp()] || x.de); }
  var SCHLUESSEL = 'rundgang-carlton-livre';
  function merk() { try { localStorage.setItem(SCHLUESSEL, '1'); } catch (e) { } }

  var CSS = '' +
    '.rdg-kegel{position:fixed;left:0;top:0;z-index:2147483000;border-radius:18px;pointer-events:none;' +
      'box-shadow:0 0 0 3px #dcc68f,0 0 0 9px rgba(220,198,143,.35),0 0 40px 10px rgba(220,198,143,.35),0 0 0 200vmax rgba(4,12,28,.76)}' +
    '.rdg-sperre{position:fixed;inset:0;z-index:2147482999}' +
    '.rdg-karte{position:fixed;left:0;top:0;z-index:2147483001;width:370px;max-width:calc(100vw - 32px);box-sizing:border-box;' +
      'padding:24px 26px 22px;border-radius:22px;color:#0c1526;background:linear-gradient(180deg,#fbf6ea,#f1e8d3);' +
      'box-shadow:0 1px 0 #fff inset,0 0 0 1px rgba(138,117,69,.3),0 30px 60px -24px rgba(4,12,28,.65),0 10px 22px -12px rgba(4,12,28,.45);' +
      'font:15px/1.55 "Instrument Sans",system-ui,sans-serif;animation:rdg-auf .42s cubic-bezier(.2,.8,.2,1) both}' +
    '@keyframes rdg-auf{from{transform:translate3d(var(--rx,0),calc(var(--ry,0px) + 14px),0)}to{transform:translate3d(var(--rx,0),var(--ry,0),0)}}' +
    '.rdg-karte{transform:translate3d(var(--rx,0),var(--ry,0),0)}' +
    '.rdg-zier{display:flex;align-items:center;gap:10px;font:500 10px/1 "DM Mono",ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;color:#8a7545}' +
    '.rdg-zier i{flex:1;height:1px;background:linear-gradient(90deg,#dcc68f,rgba(220,198,143,0))}' +
    '.rdg-karte h3{margin:12px 0 6px;font:400 25px/1.15 "Baskerville CE",Georgia,serif;color:#0b1f40;letter-spacing:0}' +
    '.rdg-karte p{margin:0;color:rgba(12,21,38,.78)}' +
    '.rdg-fuss{display:flex;align-items:center;gap:14px;margin-top:20px}' +
    '.rdg-karte .rdg-weg{display:flex;gap:5px;flex:1 1 auto;min-width:64px}.rdg-karte .rdg-weg b{display:block;height:3px;flex:1 1 0;min-width:6px;max-width:26px;border-radius:2px;background:rgba(12,21,38,.14)}.rdg-karte .rdg-weg b.da{background:#a88f55}' +
    '.rdg-karte .rdg-zu{flex:none;margin:0;border:0;background:none;padding:6px 2px;font:500 10px/1 "DM Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8a7545;cursor:pointer}' +
    '.rdg-karte .rdg-zu:hover{color:#0c1526}' +
    '.rdg-karte .rdg-los,.rdg-schild .rdg-los{flex:none;margin:0;display:inline-flex;align-items:center;gap:12px;height:42px;padding:0 6px 0 18px;border:0;border-radius:999px;cursor:pointer;' +
      'font:500 10px/1 "DM Mono",ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#fbf6ea;' +
      'background:linear-gradient(180deg,#1f3f77,#0b1f40 46%,#040d1e);box-shadow:0 1px 0 rgba(255,255,255,.26) inset,0 -3px 0 rgba(0,0,0,.5) inset,0 10px 18px -10px rgba(4,12,28,.8)}' +
    '.rdg-karte .rdg-los i,.rdg-schild .rdg-los i{display:grid;margin:0;place-items:center;width:30px;height:30px;border-radius:50%;background:linear-gradient(180deg,#fbf3e2,#cfbd98);' +
      'box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 -2px 0 rgba(0,0,0,.22) inset;transition:transform .2s}' +
    '.rdg-karte .rdg-los svg,.rdg-schild .rdg-los svg{width:14px;height:14px;fill:none;stroke:#0c1526;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
    '.rdg-los:hover i{transform:translateX(2px)}' +
    '.rdg-los:focus-visible,.rdg-zu:focus-visible{outline:2px solid #a88f55;outline-offset:3px}' +
    '@media (max-width:700px){.rdg-karte{left:16px!important;right:16px;top:auto!important;bottom:16px;width:auto;--rx:0!important;--ry:0!important}}' +
    '@media (prefers-reduced-motion:reduce){.rdg-karte{animation:none}}';
  var SCHILD_CSS = '' +
    '.rdg-schild{position:fixed;right:24px;bottom:24px;z-index:2147482990;display:flex;align-items:center;gap:14px;box-sizing:border-box;' +
      'padding:10px 10px 10px 20px;border-radius:999px;color:#0c1526;background:linear-gradient(180deg,#fbf6ea,#efe5cf);' +
      'box-shadow:0 1px 0 #fff inset,0 0 0 1px rgba(138,117,69,.32),0 18px 34px -16px rgba(4,12,28,.6),0 6px 14px -8px rgba(4,12,28,.4);' +
      'transform:translate3d(0,0,0);transition:transform .55s cubic-bezier(.2,.8,.2,1);animation:rdg-schild-auf .7s cubic-bezier(.2,.9,.25,1.15) both}' +
    '@keyframes rdg-schild-auf{from{transform:translate3d(0,calc(100% + 40px),0)}to{transform:translate3d(0,0,0)}}' +
    '.rdg-schild.weg{animation:none;transform:translate3d(0,calc(100% + 60px),0)}' +
    '.rdg-schild__t{display:flex;flex-direction:column;gap:4px;line-height:1}' +
    '.rdg-schild__t small{font:500 9px/1 "DM Mono",ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;color:#8a7545}' +
    '.rdg-schild__t b{font:400 18px/1 "Baskerville CE",Georgia,serif;color:#0b1f40}' +
    '.rdg-schild .rdg-los{height:38px;padding:0 5px 0 15px;font-size:9.5px}.rdg-schild .rdg-los i{width:28px;height:28px}' +
    '.rdg-schild__zu{flex:none;width:26px;height:26px;margin:0 2px 0 -4px;padding:0;border:0;border-radius:50%;background:none;cursor:pointer;color:#8a7545;font:16px/1 system-ui}' +
    '.rdg-schild__zu:hover{color:#0c1526}' +
    '@media (max-width:700px){.rdg-schild{right:16px;left:auto}}' +
    '@media (prefers-reduced-motion:reduce){.rdg-schild{animation:none;transition:none}}';
  var PFEIL = '<i><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></i>';
  var lauf = null;

  function sichtbar(sel) {
    var e; try { e = document.querySelector(sel); } catch (x) { return null; }
    if (!e) return null;
    var r = e.getBoundingClientRect();
    return r.width > 4 && r.height > 4 ? e : null;
  }
  function finde(liste) { for (var i = 0; i < liste.length; i++) { var e = sichtbar(liste[i]); if (e) return e; } return null; }
  function scroller() { var f = document.querySelector('#flaeche'); return f && getComputedStyle(f).overflowY === 'auto' ? f : null; }

  function starte() {
    var schritte = G.schritte; if (lauf) return;
    if (!finde(schritte[0].ziel)) return;
    if (!document.getElementById('rdg-css')) { var st = document.createElement('style'); st.id = 'rdg-css'; st.textContent = CSS; document.head.appendChild(st); }
    var sperre = document.createElement('div'); sperre.className = 'rdg-sperre';
    var kegel = document.createElement('div'); kegel.className = 'rdg-kegel';
    var karte = document.createElement('div'); karte.className = 'rdg-karte';
    karte.setAttribute('role', 'dialog'); karte.setAttribute('aria-modal', 'true'); karte.setAttribute('aria-label', w('rundgang') + ' ' + G.name);
    document.body.appendChild(sperre); document.body.appendChild(kegel); document.body.appendChild(karte);
    var nr = 0, ziel = null, gerueckt = false;
    lauf = { };

    function lege() {
      if (!ziel || !ziel.isConnected) ziel = finde(schritte[nr].ziel);
      if (!ziel) return;
      var r = ziel.getBoundingClientRect(), pad = 8, vw = innerWidth, vh = innerHeight;
      var x = Math.max(4, r.left - pad), y = Math.max(4, r.top - pad);
      var b = Math.min(vw - 8, r.right + pad) - x, h = Math.min(vh - 8, Math.min(Math.max(r.bottom, r.top + (schritte[nr].min || 0)), r.top + (schritte[nr].max || 1e5)) + pad) - y;
      kegel.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      kegel.style.width = Math.max(0, b) + 'px'; kegel.style.height = Math.max(0, h) + 'px';
      if (vw <= 700) return;
      var kw = karte.offsetWidth, kh = karte.offsetHeight, abst = 22, kx, ky;
      if (x + b + abst + kw <= vw - 16) { kx = x + b + abst; ky = y; }
      else if (x - abst - kw >= 16) { kx = x - abst - kw; ky = y; }
      else if (y + h + abst + kh <= vh - 16) { kx = x; ky = y + h + abst; }
      else if (y - abst - kh >= 16) { kx = x; ky = y - abst - kh; }
      else if (!gerueckt && h + abst + kh + 110 < vh) { gerueckt = true; (scroller() || window).scrollBy({ top: r.top - 96, behavior: 'instant' }); return lege(); }
      else { kx = vw - kw - 24; ky = vh - kh - 24; }
      kx = Math.min(Math.max(16, kx), vw - kw - 16); ky = Math.min(Math.max(16, ky), vh - kh - 16);
      karte.style.setProperty('--rx', kx + 'px'); karte.style.setProperty('--ry', ky + 'px');
    }

    function zeige(n, rueck) {
      while (n >= 0 && n < schritte.length && !finde(schritte[n].ziel)) n += rueck ? -1 : 1;   /* fehlt ein Ziel (Handy, leere Ansicht), weiter zum nächsten */
      if (n < 0 || n >= schritte.length) return ende();
      nr = n; gerueckt = false; var s = schritte[n], letzt = n === schritte.length - 1;
      ziel = finde(s.ziel);
      var r = ziel.getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight - 20) ziel.scrollIntoView({ block: r.height > innerHeight * .7 ? 'start' : 'center', behavior: 'instant' });
      var weg = ''; for (var i = 0; i < schritte.length; i++) weg += '<b' + (i <= n ? ' class="da"' : '') + '></b>';
      karte.innerHTML = '<div class="rdg-zier"><span>' + G.name + ' · ' + (n + 1) + ' ' + w('von') + ' ' + schritte.length + '</span><i></i></div>' +
        '<h3>' + wahl(s.titel) + '</h3><p>' + wahl(s.text) + '</p>' +
        '<div class="rdg-fuss"><div class="rdg-weg" aria-hidden="true">' + weg + '</div>' +
        (letzt ? '' : '<button type="button" class="rdg-zu">' + w('ueber') + '</button>') +
        '<button type="button" class="rdg-los">' + (letzt ? w('los') : w('weiter')) + PFEIL + '</button></div>';
      karte.style.animation = 'none'; void karte.offsetWidth; karte.style.animation = '';
      lege(); setTimeout(lege, 450);
      var zu = karte.querySelector('.rdg-zu'); if (zu) zu.onclick = ende;
      var los = karte.querySelector('.rdg-los'); los.onclick = function () { letzt ? ende() : zeige(n + 1); };
      try { los.focus({ preventScroll: true }); } catch (e) { }
    }

    function taste(e) {
      if (e.key === 'Escape') { e.preventDefault(); ende(); }
      else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); nr < schritte.length - 1 ? zeige(nr + 1) : ende(); }
      else if (e.key === 'ArrowLeft' && nr > 0) { e.preventDefault(); zeige(nr - 1, true); }
    }
    var takt = 0; function neu() { if (!takt) takt = requestAnimationFrame(function () { takt = 0; lege(); }); }
    var zuletzt = '', wacht = setInterval(function () {   /* der Kegel folgt seinem Ziel, solange es sich bewegt oder wächst */
      if (!ziel) return; var r = ziel.getBoundingClientRect(), k = [r.left, r.top, r.width, r.height].map(Math.round).join();
      if (k !== zuletzt) { zuletzt = k; neu(); }
    }, 120);
    function ende() {
      merk(); lauf = null;
      removeEventListener('resize', neu); removeEventListener('scroll', neu, true); document.removeEventListener('keydown', taste, true);
      clearInterval(wacht); sperre.remove(); kegel.remove(); karte.remove();
    }
    addEventListener('resize', neu); addEventListener('scroll', neu, true); document.addEventListener('keydown', taste, true);
    zeige(0);
  }

  /* Erst fliegt die Seite herein, dann erscheint das Schild: gewartet wird, bis keine endliche Animation mehr läuft (mindestens 2,5 s, höchstens 6 s), dann noch eine Pause. */
  function wenn_bereit(dann) {
    var t0 = Date.now();
    (function blick() {
      if (finde(G.schritte[0].ziel) && document.readyState === 'complete' && !document.documentElement.classList.contains('auftakt')) return nach_auftritt(dann);
      if (Date.now() - t0 < 12000) setTimeout(blick, 250);
    })();
  }
  function nach_auftritt(dann) {
    var t0 = performance.now(), ruhe = 0;
    (function blick() {
      var laeuft = (document.getAnimations ? document.getAnimations() : []).some(function (a) {
        try { return a.playState === 'running' && isFinite(a.effect.getComputedTiming().endTime); } catch (e) { return false; }
      });
      ruhe = laeuft ? 0 : ruhe + 1;
      var seit = performance.now() - t0;
      if ((ruhe >= 3 && seit > 2500) || seit > 6000) return setTimeout(dann, 700);
      setTimeout(blick, 200);
    })();
  }
  var angesetzt = false;
  function vielleicht() {
    if (lauf || angesetzt) return;
    if (navigator.webdriver && !ERZWINGEN) return;
    if (!ERZWINGEN) { try { if (localStorage.getItem(SCHLUESSEL)) return; } catch (e) { } }
    angesetzt = true;
    wenn_bereit(function () { ERZWINGEN ? starte() : schild(); });
  }

  function schild() {
    if (document.querySelector('.rdg-schild')) return;
    if (!document.getElementById('rdg-schild-css')) { var st = document.createElement('style'); st.id = 'rdg-schild-css'; st.textContent = SCHILD_CSS; document.head.appendChild(st); }
    var s = document.createElement('div'); s.className = 'rdg-schild'; s.setAttribute('role', 'status');
    s.innerHTML = '<span class="rdg-schild__t"><small>' + G.name + '</small><b>' + w('rundgang') + '</b></span>' +
      '<button type="button" class="rdg-los">' + w('zeigen') + PFEIL + '</button><button type="button" class="rdg-schild__zu" aria-label="' + w('zu') + '">×</button>';
    function platz() {   /* Fehlerbuch 10a (Schlössli 20.10.2026): fest über der Leiste unten rechts, einmal gesetzt, neu nur bei geänderter Fenstergrösse; wandert nie beim Scrollen */
      var l = document.querySelector('#leiste'), lr = l && l.getBoundingClientRect(), u = 24;
      if (l && lr && lr.height >= 5) u = Math.max(24, innerHeight - lr.top + 14);
      s.style.bottom = u + 'px';
    }
    document.body.appendChild(s); platz();
    addEventListener('resize', platz); var wache = 0;
    var uhr = 0, ueber = false;
    function weg() { clearTimeout(uhr); clearInterval(wache); s.classList.add('weg'); setTimeout(function () { s.remove(); }, 650); }
    function zaehle() { clearTimeout(uhr); uhr = setTimeout(function () { if (!ueber) weg(); }, 10000); }
    s.addEventListener('mouseenter', function () { ueber = true; clearTimeout(uhr); });
    s.addEventListener('mouseleave', function () { ueber = false; uhr = setTimeout(weg, 2000); });
    s.querySelector('.rdg-los').onclick = function () { weg(); starte(); };
    s.querySelector('.rdg-schild__zu').onclick = function () { merk(); weg(); };
    zaehle();
  }

  /* «Kurzer Rundgang» als Weg im Rand, damit er sich jederzeit wieder öffnen lässt. */
  function weg_im_rand() {
    var wege = document.querySelector('#rand .wege');
    if (!wege || wege.querySelector('.rdg-wieder')) return;
    var a = document.createElement('a'); a.href = '#'; a.className = 'rdg-wieder'; a.textContent = w('rundgang');
    a.onclick = function (e) { e.preventDefault(); starte(); };
    var haus = wege.querySelector('.rand__haus');
    wege.insertBefore(a, haus);
  }
  function los() {
    vielleicht();
    new MutationObserver(weg_im_rand).observe(document.body, { childList: true, subtree: true });
    weg_im_rand();
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', los) : los();
  window.rundgang = function () { starte(); };
})();
