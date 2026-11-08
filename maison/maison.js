/* Jede Seite öffnet oben (Robert 18.10.2026 18:30: «… die Links oben die Seite zeigen»): der Browser stellt beim Neuladen keine alte Stelle her */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tag = function (d) { return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  var setze = function (key, html) { $$('[data-stand="' + key + '"]').forEach(function (el) { el.innerHTML = html; }); };
  var zahl = function (key, wert) { $$('[data-zahl="' + key + '"]').forEach(function (el) { el.textContent = wert; }); };

  /* Gruss und Datum */
  var h = new Date().getHours();
  /* Im Laptop der Werkbank lädt La Maison mit ?gruss=tag: derselbe Gruss wie im Standbild dort, damit beim Öffnen kein Wort wechselt (12.10.2026) */
  var fest = { morgen: 8, tag: 13, abend: 20 }[(/[?&]gruss=(morgen|tag|abend)/.exec(location.search) || [])[1]]; if (fest) h = fest;
  $('#gruss').textContent = h >= 5 && h < 11 ? 'Guten Morgen.' : h >= 11 && h < 18 ? 'Guten Tag.' : 'Guten Abend.';
  $('#datum').textContent = new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  /* Name im Auftakt: Buchstabe für Buchstabe aus dem Schlitz (wie der Auftakt der Website) */
  $$('[data-buchstaben]').forEach(function (el) {
    var n = 0;
    el.innerHTML = el.textContent.split(' ').map(function (wort) {
      return '<span class="w" aria-hidden="true">' + wort.split('').map(function (z) { return '<b style="--n:' + (n++) + '">' + esc(z) + '</b>'; }).join('') + '</span>';
    }).join(' ');
    el.setAttribute('data-r', '');
  });
  /* Buchstaben-Rollen nur in den Menüpunkten der Leiste */
  $$('.rl').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (z, i) { return '<b style="--n:' + i + '">' + esc(z) + '</b>'; }).join('');
  });

    (function () {
    var wand = $('.wand'); if (!wand) return;
    var los = function () { wand.classList.add('bereit'); };
    var uhr = setTimeout(los, 1400);
    Promise.all($$('.wk img', wand).map(function (im) { return (im.decode ? im.decode() : Promise.resolve()).catch(function () {}); })).then(function () { clearTimeout(uhr); requestAnimationFrame(los); });
  })();

  /* Die Wand: Taste 1 bis 6 öffnet das Werkzeug, die Kachel neigt sich zum Zeiger (nur mit Maus und ohne «weniger Bewegung») */
  var K = $$('.wk');
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || document.querySelector('.rdg-karte')) return;
    var k = K[+e.key - 1]; if (k) { k.classList.add('gedrueckt'); setTimeout(function () { location.href = k.href; }, 180); }
  });
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) K.forEach(function (k) {
    var t = 0;
    k.addEventListener('pointermove', function (e) { if (t) return; t = requestAnimationFrame(function () { t = 0;
      var r = k.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      /* Kein Kippen mehr mit der Maus (Robert 18.10.2026: «nicht so krass reaktiv … alles ein bisschen sanfter»); nur der Lichtschein folgt */
      k.style.setProperty('--gx', ((x + .5) * 100).toFixed(1) + '%'); k.style.setProperty('--gy', ((y + .5) * 100).toFixed(1) + '%'); }); });
    k.addEventListener('pointerleave', function () { k.style.setProperty('--rx', '0deg'); k.style.setProperty('--ry', '0deg'); });
  });
  /* Auftritte: im Blickfeld, nicht darunter */
  var alle = $$('[data-r]');
  /* Kommt ein Stück an, lädt es seine Bilder sofort (16.10.2026, Prüfung: der Safari-Kern am Handy holte den Bildschirm «Bildarchiv» von Le Livre
     nie, obwohl er im Bild stand; loading=lazy wird dann auf eager gestellt) */
  var wecke = function (el) { (el.tagName === 'IMG' ? [el] : $$('img[loading="lazy"]', el)).forEach(function (i) { if (!i.complete || !i.naturalWidth) i.loading = 'eager'; }); };
  var an = function (el) { el.classList.add('da'); wecke(el); };
  /* Robert 18.10.2026 22:09 «die bilder in maison laden nicht»: beim Sprung über die Leiste holte der Safari-Kern den grossen Bildschirm (Le Registre)
     auch nach Sekunden nicht. Jedes Bild lädt jetzt schon anderthalb Bildschirme vor dem Rand, nicht erst, wenn sein Stück auftritt. */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { wecke(e.target); vio.unobserve(e.target); } }); }, { rootMargin: '150% 0px 150% 0px' });
    $$('img[loading="lazy"]').forEach(function (i) { vio.observe(i); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { an(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px 12% 0px', threshold: 0 });   /* 16.10.2026 (Robert: «sollen direkt in ihre Position fahren, wenn ich reinkomme»): Start schon am unteren Rand, nicht erst mitten im Bild */
    /* Ein Abschnitt fährt als Ganzes los, sobald er am unteren Rand auftaucht; jedes Stück mit seiner Staffel (--i) */
    var gruppe = function (el) { return el.closest('section, .m-saal, .m-empfang, footer') || el; };
    var gesehen = new Set();
    var gio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting || gesehen.has(e.target)) return; gesehen.add(e.target); gio.unobserve(e.target);
        alle.forEach(function (el) { if (gruppe(el) === e.target && !el.closest('.m-fenster')) { an(el); io.unobserve(el); } }); });
    }, { rootMargin: '0px 0px 8% 0px', threshold: 0 });
    alle.forEach(function (el) { if (!el.closest('.m-fenster')) { io.observe(el); var g = gruppe(el); if (!gesehen.has(g) && g !== el) gio.observe(g); } });
    /* Fenster wie auf der Website (main.js .bruch): der Satz steht fest in der Bildschirmmitte und gilt für den Browser deshalb schon
       als sichtbar, bevor das Fenster da ist. Er startet erst, wenn die Oberkante des Fensters ihn zu einem Drittel freigegeben hat. */
    $$('.m-fenster').forEach(function (b) {
      var t = $('.m-f-d2', b), fio = null; if (!t) return;
      var lausche = function () {
        if (fio) fio.disconnect();
        var hh = t.offsetHeight, linie = window.innerHeight / 2 - hh / 2 + hh * 0.68;
        fio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            fio.disconnect(); fio = null; window.removeEventListener('resize', lausche);
            $$('[data-r]', b).forEach(an);
          });
        }, { rootMargin: '0px 0px -' + Math.max(0, Math.round(window.innerHeight - linie)) + 'px 0px', threshold: 0 });
        fio.observe(b);
      };
      lausche();
      window.addEventListener('resize', lausche, { passive: true });
    });
    /* Goldband läuft nur, solange es im Bild ist */
    var band = $('[data-laufband]');
    if (band) new IntersectionObserver(function (es) { band.classList.toggle('laeuft', es[0].isIntersecting); }).observe(band);
    /* Leiste: der Saal im Blick ist markiert */
    var punkte = {};
    $$('.m-insel__p').forEach(function (a) { punkte[a.getAttribute('href').slice(1)] = a; });
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var a = punkte[e.target.id]; if (a) a.classList.toggle('an', e.isIntersecting); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    Object.keys(punkte).forEach(function (id) { var s = document.getElementById(id); if (s) sio.observe(s); });
  } else {
    alle.forEach(function (el) { el.classList.add('da'); });
  }

  /* Stand-Wege als Daten in der Seite (<script type="application/json" id="maison-wege">, gesetzt von bau.py), kein eingebettetes Skript (CSP online) */
  var WEGE = {}; try { WEGE = JSON.parse($('#maison-wege').textContent) || {}; } catch (e) { /* ohne Wege: jede Zeile ohne Zahl */ }
  /* Ein Weg oder eine Liste: antwortet der erste nicht, gilt der nächste (online: Le Registre über /api/registre, Ersatz die Beispielwerte) */
  var hole = function (k) {
    var w = [].concat(WEGE[k] || []);
    var weiter = function (i) { return i >= w.length ? Promise.reject() : fetch(w[i], { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : Promise.reject(); }).catch(function () { return weiter(i + 1); }); };
    return weiter(0);
  };
  /* Stand: Le Bureau */
  hole('bureau').then(function (u) {
    var a = Math.max(0, parseInt(u.aenderungen, 10) || 0), z = u.zuletzt;   /* nur als Zahl in die Seite (16.10.2026) */
    if (u.bereiche && u.bereiche.length) zahl('bereiche', u.bereiche.length);
    if (parseInt(u.seiten, 10) > 0) zahl('seiten', parseInt(u.seiten, 10));
    var zd = z && z.zeit ? new Date(String(z.zeit).replace(' ', 'T')) : null, zul = zd && !isNaN(zd) ? tag(zd) : '';
    setze('bureau-kurz', a ? '<b>' + a + ' im Entwurf</b>' : (zul ? 'Veröffentlicht ' + esc(zul) : 'Nichts offen'));
    setze('bureau', (a ? '<b>' + a + ' Änderung' + (a > 1 ? 'en' : '') + ' im Entwurf.</b> ' : 'Alles ist veröffentlicht. ') + (zul ? 'Zuletzt veröffentlicht am ' + esc(zul) + '.' : ''));   // wie Le Bureau, ohne «Noch nichts» (Endprüfung 19.10.2026, M)
  }).catch(function () { setze('bureau-kurz', 'Website des Hauses'); setze('bureau', 'Der Stand ist gerade nicht abrufbar.'); });

  /* Stand: La Carte */
  hole('carte').then(function (d) {
    var k = d.karten || [], e = k.filter(function (x) { return x.entwurf; }).length;
    var sortier = function (s) { var m = String(s).match(/(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+)/); return m ? m[3] + m[2] + m[1] + m[4] + m[5] : ''; };
    var pdf = k.map(function (x) { return x.pdf_zeit || ''; }).filter(Boolean).sort(function (a, b) { return sortier(a) < sortier(b) ? 1 : -1; })[0];
    zahl('karten', k.length);
    zahl('entwurf', e);
    if (pdf) zahl('pdf', pdf.split(' ')[0].split('.').slice(0, 2).join('.') + '.');
    setze('carte-kurz', e ? '<b>' + e + ' im Entwurf</b>' : k.length + ' Karten, alle veröffentlicht');
  }).catch(function () { setze('carte-kurz', 'Speise-, Wein- und Snackkarte'); });

  /* Stand: La Réception (Eingang und Fragen aus dem Chat) */
  hole('reception').then(function (r) {
    var u = {}; ['anfragen_neu', 'anfragen_offen', 'ohne_antwort', 'fragen_gesamt'].forEach(function (k) { u[k] = Math.max(0, parseInt(r[k], 10) || 0); });   /* nur Zahlen (16.10.2026) */
    var teile = [];
    if (u.anfragen_neu) teile.push('<b>' + u.anfragen_neu + (u.anfragen_neu === 1 ? ' neue Anfrage' : ' neue Anfragen') + '</b>');
    else if (u.anfragen_offen) teile.push(u.anfragen_offen + (u.anfragen_offen === 1 ? ' Anfrage offen' : ' Anfragen offen'));
    if (u.ohne_antwort) teile.push('<b>' + u.ohne_antwort + (u.ohne_antwort === 1 ? ' Frage ohne Antwort' : ' Fragen ohne Antwort') + '</b>');
    var kurz = teile.length ? teile.join(' · ') : 'Nichts offen';
    setze('reception-kurz', kurz);
    setze('reception', teile.length ? kurz : 'Nichts offen · ' + u.fragen_gesamt + (u.fragen_gesamt === 1 ? ' Frage' : ' Fragen') + ' bisher');
  }).catch(function () { setze('reception-kurz', 'Rezeption im Chat'); setze('reception', '&nbsp;'); });

  /* Stand: Le Livre (aus marke/livre.json, gebaut von _werkbank/livre_bau.py: gezählte Fotos und Dateien) */
  hole('livre').then(function (d) {
    var s = d.stand || {};
    setze('livre-kurz', esc(s.fotos) + ' Fotos · ' + esc(s.dateien) + ' Dateien');
    /* ki = mit KI erzeugt, ue = nachgeschärft (marke_livre.py, 16.10.2026; vorher stand hier ki als «nachgeschärft») */
    setze('livre', esc(s.fotos) + ' Fotos in fertigen Grössen, davon ' + esc(s.ki) + ' mit KI erzeugt und ' + esc(s.ue) + ' nachgeschärft, alle gekennzeichnet. ' + esc(s.dateien) + ' Dateien für Agenturen und Druckereien, dazu die Markenprüfung.');
  }).catch(function () { setze('livre-kurz', 'Fotos, Dateien, Markenprüfung'); });

  /* Le Registre: sechs Werte der Zählung ohne Cookies (registre.py über /api/registre). Vorführ-Betrieb (Robert 14.10.2026): hier stehen die Beispielwerte,
     als Beispiel beschriftet; die echten Besuche zeigt La Maison erst, wenn das Haus in Betrieb geht (dann &beispiel=1 streichen). */
  if ($('#registre')) hole('registre').then(function (m) {
    var n = function (x) { return Number(x || 0).toLocaleString('de-CH'); };
    var datum = function (iso) { var t = String(iso || '').split('-'); return t.length === 3 ? t[2] + '.' + t[1] + '.' + t[0] : ''; };
    var w = m.werte || {};
    var zeige = function (key, klein, leer) {
      var x = w[key] || {}, da = x.von > 0;
      $$('[data-mw="' + key + '"]').forEach(function (el) { el.textContent = da ? Number(x.anteil).toLocaleString('de-CH', { maximumFractionDigits: 1 }) + '\u00a0%' : '\u2013'; });
      $$('[data-mk="' + key + '"]').forEach(function (el) { el.textContent = da ? klein(x) : leer; });
    };
    var besuche = function (z) { return z === 1 ? 'Aufruf' : 'Aufrufen'; };
    zeige('start', function (x) { return n(x.zahl) + ' von ' + n(x.von) + ' ' + besuche(x.von) + ' der Startseite'; }, 'Noch kein Aufruf der Startseite');
    zeige('zimmer', function (x) { return n(x.zahl) + ' von ' + n(x.von) + ' ' + besuche(x.von) + ' der Zimmerseiten'; }, 'Noch kein Aufruf der Zimmerseiten');
    zeige('angebot', function (x) { return n(x.zahl) + ' von ' + n(x.von) + ' ' + besuche(x.von) + ' der Angebote'; }, 'Noch kein Aufruf der Angebote');
    zeige('dock', function (x) { return n(x.zahl) + ' von ' + n(x.von) + ' ' + besuche(x.von) + ' am Rechner'; }, 'Noch kein Aufruf am Rechner');
    zeige('abbruch', function (x) { return n(x.zahl) + ' von ' + n(x.von) + (x.von === 1 ? ' geöffneten Zimmersuche' : ' geöffneten Zimmersuchen'); }, 'Noch keine Zimmersuche geöffnet');
    zeige('kontakt', function (x) { return n(x.anruf) + ' Anrufe und ' + n(x.mail) + ' Mails bei ' + n(x.von) + ' ' + besuche(x.von); }, 'Noch kein Aufruf');
    var u = m.summe || {};
    /* Weg des Gastes (Robert 18.10.2026 20:03, Fassung C): Besuche → Buchungsfenster → SimpleBooking; dieselbe Satzregel wie bau.py anteil_satz */
    var ORD = { 2: 'zweite', 3: 'dritte', 4: 'vierte', 5: 'fünfte', 6: 'sechste', 7: 'siebte', 8: 'achte', 9: 'neunte', 10: 'zehnte' };
    var teilWort = function (p) { var BR = [[1 / 4, 'ein Viertel'], [1 / 3, 'ein Drittel'], [1 / 2, 'die Hälfte'], [2 / 3, 'zwei Drittel'], [3 / 4, 'drei Viertel']];
      var b = BR.slice().sort(function (x, y) { return Math.abs(x[0] - p) - Math.abs(y[0] - p); })[0];
      return Math.abs(b[0] - p) > 0.06 ? Math.round(100 * p) + '\u00a0%' : (Math.abs(b[0] - p) < 0.01 ? 'genau ' : p < b[0] ? 'knapp ' : 'gut ') + b[1]; };
    var satz = function (z, von, wort) { if (!von) return ''; var k = z ? Math.round(von / z) : 0; return wort ? (k >= 2 ? 'etwa jeder ' + (ORD[k] || k + '.') + ' ' + wort : Math.round(100 * z / von) + '\u00a0%') : teilWort(z / von) + ' davon'; };
    var wB = u.besuche || 0, wF = (w.abbruch || {}).von || 0, wK = u.buchung || 0;
    var wegZ = { besuche: wB, fenster: wF, weiter: wK }, wegS = { fenster: satz(wF, wB, 'Besuch'), weiter: satz(wK, wF, '') };
    Object.keys(wegZ).forEach(function (k) { $$('[data-weg="' + k + '"]').forEach(function (el) { el.textContent = n(wegZ[k]); el.setAttribute('data-weg-z', wegZ[k]); }); });
    /* Zahlen zählen einmal hoch, sobald ein Fünftel des Wegs zu sehen ist (nur Text, keine Masse) */
    var weg = $('.m-weg');
    if (weg && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $$('[data-weg-z]', weg).forEach(function (el) { el.textContent = '0'; });
      var io = new IntersectionObserver(function (es) { if (!es.some(function (e) { return e.isIntersecting; })) return; io.disconnect();
        $$('[data-weg-z]', weg).forEach(function (el, i) { var z = +el.getAttribute('data-weg-z'), t0 = performance.now() + i * 120;
          (function s(t) { var p = Math.max(0, Math.min(1, (t - t0) / 1200)), q = 1 - Math.pow(1 - p, 3); el.textContent = n(Math.round(z * q)); if (p < 1) requestAnimationFrame(s); })(t0); }); }, { threshold: .2 });
      io.observe(weg);
    }
    Object.keys(wegS).forEach(function (k) { $$('[data-weg-satz="' + k + '"]').forEach(function (el) { el.textContent = wegS[k]; }); });
    /* Zahlenzeile «Heute»: Besuche und Klicks zur Buchung des heutigen Tages (16.10.2026: vorher stand dort die Summe der 30 Tage unter «Heute»).
       Der letzte Tag der Reihe ist heute; ohne Tageswert bleibt «–». Beispielwerte sind als solche beschriftet (R20). */
    var jt = Array.isArray(m.je_tag) && m.je_tag.length ? m.je_tag[m.je_tag.length - 1] : null;
    /* Letzte 24 Stunden statt «Heute» (Robert 18.10.2026 «heute beispiel 0 besuche ? tolles beispiel»): am Morgen in Interlaken stand der Tag
       noch auf 0. Gezählt wird aus der Besuchsliste mit Uhrzeit von Interlaken; fehlt sie, bleibt der Tageswert wie bisher. */
    var b24 = null;
    if (Array.isArray(m.besuche) && m.besuche.length && m.bis) {
      try {
        var uhr = new Date().toLocaleTimeString('de-CH', { timeZone: 'Europe/Zurich', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        var g = new Date(m.bis + 'T12:00:00Z'); g.setUTCDate(g.getUTCDate() - 1); var gestern = g.toISOString().slice(0, 10);
        b24 = { besuche: 0, buchung: 0 };
        m.besuche.forEach(function (x) {
          var z = x.zs || (x.z + ':00');
          if ((x.tag === m.bis && z <= uhr) || (x.tag === gestern && z > uhr)) { b24.besuche++; if (x.buchung) b24.buchung++; }
        });
      } catch (e) { b24 = null; }
    }
    if (b24) {
      $$('[data-zeit]').forEach(function (el) { el.textContent = 'Letzte 24 Std.'; });
      setze('registre-heute', n(b24.besuche)); setze('registre-buchung', n(b24.buchung));
    } else {
      if (u.heute !== undefined) setze('registre-heute', n(u.heute));
      if (jt && jt.buchung !== undefined) setze('registre-buchung', n(jt.buchung));
    }
    if (m.beispiel) $$('.emp__zeile').forEach(function (z) { z.classList.add('beispiel'); z.setAttribute('title', 'Beispielwerte, bis die Website echte Besuche zählt'); });
    setze('besuche', m.leer ? 'Noch keine Besuche gezählt.' : (m.beispiel ? 'Beispielwerte, bis die Website echte Besuche zählt · ' : '') + 'letzte ' + n(m.tage) + ' Tage');
  }).catch(function () { setze('besuche', 'Die Zählung ist gerade nicht abrufbar.'); });
  window.MAISON_BEREIT = true;   /* Startfehler-Tür (R04): ohne dieses Zeichen öffnet der Kopf der Seite die Tür */
})();
