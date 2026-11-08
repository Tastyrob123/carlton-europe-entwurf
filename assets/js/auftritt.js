/* Jede Seite öffnet oben, auch nach Neuladen (Robert 18.10.2026 18:30) */
if (!location.hash && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
/* Auftritt für Seiten ohne eigene Bewegung: Anleitungen, La Carte, Zimmermappe, Mappe, Mails (Robert 18.10.2026, 18:17:
   Start, wenn rund ein Fünftel sichtbar ist, 0,85 s ausklingend, 40 px von unten, Bilder zusätzlich von 1,04 auf 1, Reihen 0,12 s nacheinander).
   Ohne Einblenden: alles ist von Anfang an deckend, es bewegt sich nur. Was schon im Bild steht, kommt gleich beim Laden.
   Eingesetzt von bau.py (auftritt_einsetzen) in die Seiten, die selbst keinen Auftritt haben. */
(function () {
  if (window.CEAuftritt || !('IntersectionObserver' in window)) return; window.CEAuftritt = 1;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var st = document.createElement('style');
  st.textContent = '.ca-auf{transform:translate3d(0,40px,0);transition:transform .85s cubic-bezier(.16,1,.3,1);transition-delay:var(--ca-v,0s)}' +
    '.ca-auf.ca-bild{transform:translate3d(0,40px,0) scale(1.04)}.ca-auf.ca-da{transform:none}';
  document.head.appendChild(st);
  var WAS = 'h1,h2,h3,h4,p,figure,picture,img,li,blockquote,table,dl,.kn,.kn-reihe,article,section>div';
  function frei(el) {   // nichts in festen Leisten, Fenstern, Formular-Feldern oder schon bewegten Teilen
    for (var a = el; a && a !== document.body; a = a.parentElement) {
      var p = getComputedStyle(a).position;
      if (p === 'fixed' || p === 'sticky' || a.hasAttribute('data-r') || a.tagName === 'DIALOG' || a.tagName === 'HEADER' || a.tagName === 'NAV' || a.tagName === 'FORM' || a.isContentEditable) return false;
    }
    return true;
  }
  function los() {
    var kand = [].slice.call(document.querySelectorAll(WAS)).filter(function (el) {
      var r = el.getBoundingClientRect(); return r.width > 20 && r.height > 8 && frei(el);
    });
    kand = kand.filter(function (el) { return !kand.some(function (o) { return o !== el && o.contains(el); }); });   // nur das Äusserste
    if (!kand.length) return;
    kand.forEach(function (el) { el.classList.add('ca-auf'); if (el.tagName === 'IMG' || el.tagName === 'FIGURE' || el.tagName === 'PICTURE') el.classList.add('ca-bild'); });
    var welle = [], uhr = 0;
    function zeige(el) { if (el.classList.contains('ca-da')) return; welle.push(el); if (!uhr) uhr = requestAnimationFrame(function () {
      uhr = 0; var reihen = []; welle.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      welle.forEach(function (el) { var t = Math.round(el.getBoundingClientRect().top), n = reihen.indexOf(reihen.filter(function (x) { return Math.abs(x - t) < 12; })[0]); if (n < 0) { reihen.push(t); n = reihen.length - 1; }
        el.style.setProperty('--ca-v', Math.min(n, 6) * 0.12 + 's'); el.classList.add('ca-da'); });
      welle = []; }); }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { zeige(e.target); io.unobserve(e.target); } }); }, { threshold: 0.2 });
    kand.forEach(function (el) { io.observe(el); });
    // Sicherheitsnetz: was im Bild steht, aber vom Beobachter nicht gemeldet wird (Fenster in Fenstern, schnelles Scrollen), kommt beim
    // nächsten Scrollen oder nach kurzer Zeit doch. Nie bleibt etwas verschoben im Bild stehen.
    var prueft = 0, pruefe = function () { prueft = 0; kand.forEach(function (el) { if (el.classList.contains('ca-da')) return; var r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) zeige(el); }); };
    window.addEventListener('scroll', function () { if (!prueft) prueft = requestAnimationFrame(pruefe); }, { passive: true, capture: true });
    var n = 0, nachsehen = setInterval(function () { n++; pruefe(); if (n > 20) clearInterval(nachsehen); }, 700);
  }
  if (document.readyState === 'complete') los(); else window.addEventListener('load', los);
})();
