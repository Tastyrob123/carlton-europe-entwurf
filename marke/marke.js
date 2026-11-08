/* Le Livre · Markenbuch Carlton-Europe (von Hand): Auftritte, Zahlen, Kopieren, Lupe, Band, Dock. Nur transform und opacity werden bewegt. */
(function () {
  var d = document, de = d.documentElement;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  /* Auftritte wie beim Rivage: Gruppen starten gemeinsam, die Staffel kommt aus --i; Fotos werden vorher geholt und entpackt */
  function zeige(el) { el.classList.add('da'); zaehle(el); }
  var alle = $$('[data-ll]'), gruppen = $$('[data-g]');
  if (!still && 'IntersectionObserver' in window) {
    de.classList.add('ll-js'); d.body.classList.add('ll-js');
    gruppen.forEach(function (g) { $$('[data-ll]', g).forEach(function (el, i) { if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i); }); });
    var vor = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; vor.unobserve(e.target); var im = e.target; im.loading = 'eager'; if (im.decode) im.decode().catch(function () { }); });
    }, { rootMargin: '0px 0px 150% 0px' });
    $$('main img').forEach(function (im) { vor.observe(im); });
    var gio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; gio.unobserve(e.target); zeige(e.target); $$('[data-ll],[data-g]', e.target).forEach(zeige); });
    }, { rootMargin: '0px 0px -6% 0px' });
    gruppen.forEach(function (g) { gio.observe(g); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); zeige(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    alle.forEach(function (el) { if (!el.closest('[data-g]')) io.observe(el); });
    /* Während gescrollt wird, reagieren die Kacheln nicht auf die Maus */
    var rollUhr = 0, rollt = false;
    addEventListener('scroll', function () {
      if (!rollt) { rollt = true; de.classList.add('rollt'); }
      clearTimeout(rollUhr); rollUhr = setTimeout(function () { rollt = false; de.classList.remove('rollt'); }, 180);
    }, { passive: true });
  } else { $$('[data-zahl]').forEach(function (n) { n.textContent = n.getAttribute('data-zahl'); }); }

  /* Zahlen laufen hoch (nur der Text) */
  function zaehle(wurzel) {
    var l = wurzel.matches && wurzel.matches('[data-zahl]') ? [wurzel] : $$('[data-zahl]', wurzel);
    l.forEach(function (n) {
      if (n.__lief) return; n.__lief = true;
      var ziel = parseFloat(n.getAttribute('data-zahl')), dez = (n.getAttribute('data-zahl').split('.')[1] || '').length, t0 = 0;
      (function f(t) {
        if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1600);
        n.textContent = (ziel * (1 - Math.pow(1 - p, 3))).toFixed(dez);
        if (p < 1) requestAnimationFrame(f);
      })(performance.now());
    });
  }

  /* Farben und Glanzgold kopieren */
  var meld = $('.ll-meldung'), mt;
  function sage(t) { meld.textContent = t; meld.classList.add('an'); clearTimeout(mt); mt = setTimeout(function () { meld.classList.remove('an'); }, 1700); }
  function kopiere(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(alt);
    return alt();
    function alt() { var a = d.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; d.body.appendChild(a); a.select(); try { d.execCommand('copy'); } catch (e) { } a.remove(); }
  }
  $$('[data-hex]').forEach(function (b) {
    b.addEventListener('click', function () {
      kopiere(b.getAttribute('data-hex'));
      b.classList.add('ist'); setTimeout(function () { b.classList.remove('ist'); }, 1300);
      sage('Kopiert · ' + (b.getAttribute('data-hex').length > 9 ? 'Verlauf' : b.getAttribute('data-hex').toUpperCase()));
    });
  });

  /* Lupe auf der Tapete */
  $$('.ll-lupe-feld').forEach(function (f) {
    var l = $('.ll-lupe', f);
    f.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = f.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      f.classList.add('an');
      l.style.left = x + 'px'; l.style.top = y + 'px';
      l.style.backgroundPosition = (-(x * 2) + 75) + 'px ' + (-(y * 2) + 75) + 'px';
    });
    f.addEventListener('pointerleave', function () { f.classList.remove('an'); });
  });

  /* Band der Bausteine: weiches Schieben mit Trägheit (zwei Finger, Shift + Rad, Ziehen mit der Maus, Pfeile). Senkrechtes Rad scrollt die Seite. */
  var g = $('.ll-band__g'), bar = $('.ll-band__b i');
  if (g) {
    var maus = matchMedia('(hover:hover) and (pointer:fine)').matches;
    var ziel = 0, lauf = 0, max = function () { return g.scrollWidth - g.clientWidth; };
    var schritt = function () { var k = $('.ll-bk', g); return k ? k.getBoundingClientRect().width + 24 : 600; };
    var klemme = function (x) { return Math.max(0, Math.min(max(), x)); };
    var gleite = function () {
      var d = ziel - g.scrollLeft;
      if (Math.abs(d) < .5) { g.scrollLeft = ziel; lauf = 0; return; }
      g.scrollLeft += d * .11;
      lauf = requestAnimationFrame(gleite);
    };
    var gehe = function (x) { ziel = klemme(x); if (maus && !still) { if (!lauf) lauf = requestAnimationFrame(gleite); } else g.scrollTo({ left: ziel, behavior: still ? 'auto' : 'smooth' }); };
    $$('[data-band]').forEach(function (b) { b.addEventListener('click', function () { ziel = g.scrollLeft; gehe(ziel + schritt() * +b.getAttribute('data-band')); }); });
    if (maus) {
      g.addEventListener('wheel', function (e) {
        if (!(e.shiftKey && !e.deltaX)) return;   /* Trackpad und waagrechtes Rad: das Band scrollt selbst, fein und ohne Stufen (Robert 15.10.2026: «viel zu grob»); nur Shift + Rad schiebt hier */
        var dx = e.deltaY;
        e.preventDefault();
        if (!lauf) ziel = g.scrollLeft;
        gehe(ziel + dx * 1.15);
      }, { passive: false });
      var z = null;
      g.addEventListener('pointerdown', function (e) { if (e.button) return; z = { x: e.clientX, s: g.scrollLeft, bewegt: false }; });
      addEventListener('pointermove', function (e) {
        if (!z) return; var dx = e.clientX - z.x;
        if (!z.bewegt && Math.abs(dx) > 5) { z.bewegt = true; g.classList.add('zieht'); if (lauf) { cancelAnimationFrame(lauf); lauf = 0; } }
        if (z.bewegt) { g.scrollLeft = klemme(z.s - dx); ziel = g.scrollLeft; }
      });
      addEventListener('pointerup', function () { if (z && z.bewegt) { ziel = g.scrollLeft; } z = null; g.classList.remove('zieht'); });
    }
    var anzeige = function () { var m = max(); bar.style.transform = 'scaleX(' + (.1 + .9 * (m > 0 ? g.scrollLeft / m : 1)) + ')'; };
    g.addEventListener('scroll', anzeige, { passive: true }); anzeige();
    g.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { ziel = g.scrollLeft; gehe(ziel + schritt()); } if (e.key === 'ArrowLeft') { ziel = g.scrollLeft; gehe(ziel - schritt()); } });
  }

  /* Dock: am Auftakt verborgen, danach zeigt er das aktuelle Kapitel */
  var dock = $('.ll-dock'), auf = $('.ll-auf'), links = $$('.ll-dock__l a');
  var sek = links.map(function (a) { return $(a.getAttribute('href')); });
  function dockLauf() {
    var y = scrollY, h = innerHeight;
    dock.classList.toggle('weg', auf.getBoundingClientRect().bottom > h * .62 && y < h * .5);
    var akt = -1;
    sek.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < h * .45) akt = i; });
    links.forEach(function (a, i) { a.classList.toggle('an', i === akt); });
  }
  var warte = false;
  addEventListener('scroll', function () { if (!warte) { warte = true; requestAnimationFrame(function () { warte = false; dockLauf(); }); } }, { passive: true });
  addEventListener('resize', dockLauf); dockLauf();

  /* Knöpfe der Vorführung bleiben auf der Seite */
  $$('a[href="#knoepfe"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
})();
