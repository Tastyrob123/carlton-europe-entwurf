// Freier Satz: jede Seite wird so gross gesetzt, wie ihr Inhalt es zulässt (höchstens 100 %), nichts läuft über den Rand.
// Ergebnis in window.FLUSS (je Seite das Schriftmass in % und was nicht passt), danach <html data-fertig>.
(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  const aus = [];
  // 1. Durchgang: je Seite das grösste Mass, das passt. 2. Durchgang: alle Seiten auf das kleinste davon (gleiche Ebene = gleiche Grösse im ganzen Dokument)
  const blaetter = [...document.querySelectorAll('.blatt.fl')], masse = [];
  blaetter.forEach(b => {
    const box = b.querySelector('.fl-in');
    const passt = v => { b.style.setProperty('--s', v.toFixed(4)); return box.scrollHeight <= box.clientHeight + 0.5; };
    let s = parseFloat(b.dataset.s || '1');
    if (!passt(s)) { let lo = 0.5, hi = s; for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; if (passt(m)) lo = m; else hi = m; } s = lo; }
    masse.push(s);
  });
  const einheit = Math.min(...masse);
  blaetter.forEach(b => { b.dataset.s = einheit.toFixed(4); });
  blaetter.forEach((b, n) => {
    const box = b.querySelector('.fl-in');
    // grösstes Schriftmass, bei dem der Inhalt passt (Halbierungssuche: der Umbruch ändert sich mit dem Mass, darum nicht hochrechnen)
    const passt = v => { b.style.setProperty('--s', v.toFixed(4)); return box.scrollHeight <= box.clientHeight + 0.5; };
    let s = parseFloat(b.dataset.s || '1');
    if (!passt(s)) {
      let lo = 0.5, hi = s;
      for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; if (passt(m)) lo = m; else hi = m; }
      s = lo; passt(s);
    }
    const fehler = [];
    if (box.scrollHeight > box.clientHeight + 0.5) fehler.push('zu hoch');
    const r = box.getBoundingClientRect();
    box.querySelectorAll('*').forEach(e => {
      const q = e.getBoundingClientRect();
      if (q.width && (q.right > r.right + 1 || q.left < r.left - 14 * (r.width / 166))) fehler.push('ragt seitlich: ' + (e.textContent || e.className).trim().slice(0, 30));
      if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible') fehler.push('beschnitten: ' + e.textContent.trim().slice(0, 30));
    });
    aus.push({ seite: n + 1, mass: Math.round(s * 100), frei: Math.round((1 - box.scrollHeight / box.clientHeight) * 100), fehler });
  });
  window.FLUSS = aus;
  document.documentElement.dataset.fertig = '1';
})();
