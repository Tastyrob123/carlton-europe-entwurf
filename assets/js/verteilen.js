/* Kacheln gleichmässig auf Reihen verteilen (Fehlerbuch 10a, Robert 20.10.2026 am Schlössli: «Ja, wenn das nur so paar sind, dann mach 3 oben und 2 unten.»).
   Höchstens vier je Reihe, dann gleich viele je Reihe, eine kürzere letzte Reihe steht mittig: keine Karte allein, keine Reihe mit grosser Lücke.
   Gilt für Raster aus gleich breiten Kacheln (display:grid). Am Handy (bis 600 px) bleibt das Raster des Werkzeugs. Ohne Bibliothek. */
(function () {
  var WAHL = '.wo-ber,.wo-aufg,.li-tafeln,.li-karten,.re-nliste,.kt-flaeche,.raster,.re-arten,.wo-kacheln';
  function sichtbar(e) { var r = e.getBoundingClientRect(); return r.width > 40 && r.height > 20 && getComputedStyle(e).position !== 'absolute'; }
  function zurueck(g) { if (!g.dataset.vt) return; g.style.gridTemplateColumns = ''; [].forEach.call(g.children, function (e) { e.style.gridColumn = ''; }); delete g.dataset.vt; }
  function verteile(g) {
    zurueck(g);
    if (innerWidth <= 600 || getComputedStyle(g).display !== 'grid') return;
    var k = [].filter.call(g.children, sichtbar), n = k.length; if (n < 2) return;
    var w = k.map(function (e) { return e.getBoundingClientRect().width; });
    if (Math.max.apply(0, w) - Math.min.apply(0, w) > 8) return;   // ungleiche Kacheln: das Raster ist gewollt
    var spuren = getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length;
    var c = Math.min(spuren, 4); if (c < 2) return;
    var reihen = Math.ceil(n / c), sp = Math.ceil(n / reihen), rest = n % sp;
    if (sp === spuren && !rest) return;
    g.dataset.vt = '1';
    g.style.gridTemplateColumns = 'repeat(' + (sp * 2) + ',minmax(0,1fr))';
    k.forEach(function (e) { e.style.gridColumn = 'span 2'; });
    if (rest) k[n - rest].style.gridColumn = (sp - rest + 1) + ' / span 2';
  }
  var uhr = 0, laeuft = false;
  function alle() { if (laeuft) return; laeuft = true; try { [].forEach.call(document.querySelectorAll(WAHL), verteile); } finally { laeuft = false; } }
  function bald() { clearTimeout(uhr); uhr = setTimeout(alle, 60); }
  new MutationObserver(function (m) { if (!laeuft && m.some(function (x) { return x.type === 'childList'; })) bald(); }).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('resize', bald); addEventListener('load', bald); bald();
})();
