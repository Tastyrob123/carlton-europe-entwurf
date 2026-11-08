// Kopie von _werkbank/zeichen/funktionen_livre.js für die Prüfung 16.10.2026 (Prüfserver mit LIVRE_KI=0, Höhe wählbar, Firefox, Belegbilder, La Maison ohne Ausnahme).
//   BASIS=http://localhost:8966/ node _werkzeuge/livre/pruefung/funktionen.js carlton chromium|webkit|firefox 1440x900|1366x650|390x844
// Le Livre · Funktionsliste, Zeile für Zeile in beiden Häusern bedient (Robert 16.10.2026: «jede Zeile in GBR und Carlton nebeneinander bedienen und abhaken»).
//   node _werkbank/zeichen/funktionen_livre.js [gbr|carlton|beide] [chromium|webkit] [1440|390]
// Beide Häuser laufen lokal: Grand Beau-Rivage http://localhost:8940/marke/ (nur gelesen und bedient, nichts verändert), Carlton http://localhost:8965/_werkzeuge/livre/ (server.py).
// Jede Zeile meldet ✓ oder ✗ mit der gemessenen Zahl. Die Liste steht auch in _werkbank/zeichen/FUNKTIONEN_LIVRE.md.
const path = require('path'), fs = require('fs');
const pw = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const HAEUSER = { gbr: { name: 'GBR', url: 'http://localhost:8940/marke/', basis: 'http://localhost:8940/', buch: 'buch/', sprachen: 6 }, carlton: { name: 'Carlton', url: (process.env.BASIS || 'http://localhost:8966/') + '_werkzeuge/livre/', basis: process.env.BASIS || 'http://localhost:8966/', buch: '../../marke/', sprachen: 3 } };
const wer = process.argv[2] || 'carlton', motor = process.argv[3] || 'chromium', [breite, hoehe0] = (process.argv[4] || '1440x900').split('x').map(Number), hoehe = hoehe0 || (breite > 600 ? 900 : 844);
const BELEG = path.join(__dirname, 'belege', `${motor}-${breite}x${hoehe}`); fs.mkdirSync(BELEG, { recursive: true });
const PNG = /* gültiges PNG 10 × 10 Marine (das alte hatte eine falsche Prüfsumme, Firefox meldete es) */ 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFUlEQVR4nGPklndgwA2Y8MgxjFxpAIylAH608qaWAAAAAElFTkSuQmCC';

async function lauf(h) {
  const erg = []; const fehler = [];
  const z = (nr, text, ok, mass) => { erg.push({ nr, text, ok: !!ok, mass: mass == null ? '' : String(mass) }); };
  const b = await pw[motor].launch();
  const ctx = await b.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: breite < 600 && motor !== 'firefox', acceptDownloads: true, permissions: motor === 'chromium' ? ['clipboard-read', 'clipboard-write'] : [] });
  const p = await ctx.newPage();
  p.on('pageerror', e => fehler.push('JS ' + e)); p.on('console', m => { if (m.type() === 'error' && !/favicon|NS_BINDING|cancelled/i.test(m.text())) fehler.push('Konsole ' + m.text()); });
  p.on('response', r => { if (r.status() >= 400 && !/favicon|api\/stand|api\/pruefen/.test(r.url())) fehler.push(r.status() + ' ' + r.url().replace(h.basis, '/')); });
  const warte = ms => p.waitForTimeout(ms);
  const n = async s => p.locator(s).count();
  const text = async s => (await p.locator(s).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  const status = async u => p.evaluate(async u => { try { const r = await fetch(u, { method: 'GET', cache: 'no-store' }); const bl = await r.blob(); return [r.status, bl.size, r.headers.get('content-type') || '', r.headers.get('content-disposition') || '']; } catch (e) { return [0, 0, '', '']; } }, u);
  const foto = async n => { if (h.name === 'Carlton') await p.screenshot({ path: path.join(BELEG, n + '.jpg'), type: 'jpeg', quality: 72 }).catch(() => {}); };
  const ansicht = async a => { await p.evaluate(a => { location.hash = '#' + a; }, a); await warte(900); };
  let nr = 0;
  const Z = (t, ok, m) => z(++nr, t, ok, m);

  // ---- 1 Öffnen und Übersicht
  await p.goto(h.url + '#start', { waitUntil: 'load' }); await p.waitForSelector('#ansicht .li-k', { timeout: 30000 }); await warte(2800);
  await foto('01-uebersicht');
  Z('Übersicht lädt, Begrüssung im Titel', /Guten|Good|Bonjour|Bonsoir/.test(await text('#ansicht h1')), await text('#ansicht h1'));
  Z('Drei Karten Bildarchiv, Dateien, Prüfung', (await n('#ansicht .li-k')) === 3, await n('#ansicht .li-k'));
  Z('Vier Zahlen unter den Karten', (await n('#ansicht .li-zahlen > div')) === 4, await n('#ansicht .li-zahlen > div'));
  Z('Karte Markenbuch mit Knopf «Lesen»', (await n('#ansicht a.li-buch')) === 1);
  Z('Rand: «Arbeiten» mit drei Ansichten und Markenbuch', (await n('#rand .nw')) === 5, await n('#rand .nw'));
  Z('Kopf: Marke, Titel und Stand, Sprache, Anleitung, Maison, Markenbuch', (await n('#kopf .kopf__marke')) && (await n('#kopf .kopf__stand')) && (await n('#kopf .li-sp')) && (await n('#kopf a.rund')) === 2 && (await n('#kopf a.kn')) === 1);
  Z('Leiste unten: Bildrechte und ZIP', (await n('#leiste .leiste__t')) && (await n('#leiste a[download]')) === 1);

  // ---- 2 Sprache
  const sprDe = await text('#ansicht h1');
  await p.locator('.li-sp__k').click(); await warte(400);
  Z('Sprachwahl öffnet mit allen Sprachen', (await n('.li-sp.offen [data-sp]')) === h.sprachen, await n('.li-sp.offen [data-sp]'));
  await p.locator('[data-sp="en"]').click(); await warte(900);
  const sprEn = await text('#ansicht h1');
  Z('Sprache English ändert Titel, Rand, Leiste', sprEn !== sprDe && (breite < 600 || /Overview|Brand|Work/i.test(await text('#rand'))) && /Image rights/.test(await text('#leiste')), sprEn.slice(0, 30));
  await p.reload({ waitUntil: 'load' }); await p.waitForSelector('#ansicht .li-k'); await warte(1200);
  Z('Sprache bleibt nach Neuladen (Browser merkt sie)', (breite < 600 || /Overview|Brand|Work/i.test(await text('#rand'))));
  await p.locator('.li-sp__k').click(); await p.locator('[data-sp="fr"]').click(); await warte(700);
  Z('Sprache Français', (breite < 600 || /Aperçu|Travailler/.test(await text('#rand'))));
  await p.locator('.li-sp__k').click(); await p.locator('[data-sp="de"]').click(); await warte(700);
  Z('Zurück auf Deutsch', (breite < 600 || /Übersicht/.test(await text('#rand'))));
  await p.locator('.li-sp__k').click(); await warte(300); await p.mouse.click(5, 400); await warte(300);
  Z('Sprachwahl schliesst beim Klicken daneben', (await n('.li-sp.offen')) === 0);

  // ---- 3 Links im Kopf und Rand
  const links = await p.evaluate(() => [...document.querySelectorAll('#kopf a[href], #rand a[href], #leiste a[href]')].map(a => a.getAttribute('href')));
  let tot = [];
  for (const l of new Set(links)) { const u = new URL(l, p.url()).href; const s = await status(u); if (s[0] !== 200) tot.push(l + ' ' + s[0]); }
  Z('Alle Links in Kopf, Rand und Leiste antworten', tot.length === 0, tot.join(' | ') || new Set(links).size + ' Links');
  const zip = await status(new URL(await p.locator('#leiste a[download]').getAttribute('href'), p.url()).href);
  Z('ZIP mit allen Dateien lädt', zip[0] === 200 && zip[1] > 500000, Math.round(zip[1] / 1024) + ' KB');

  // ---- 4 Ansichtswechsel
  for (const [a, sel, nm] of [['bilder', '#li-raster', 'Bildarchiv'], ['dateien', '.li-d', 'Logo & Dateien'], ['pruefung', '#li-pr', 'Markenprüfung']]) {
    await p.locator(`#rand [data-gehe="${a}"]`).click().catch(async () => { await p.locator('.rand__auf').click(); await p.locator(`#rand [data-gehe="${a}"]`).click(); }); await warte(1200);
    Z('Rand → ' + nm, (await n(sel)) >= 1 && (await p.locator(`#rand [data-gehe="${a}"]`).getAttribute('aria-current')) === 'true' && p.url().endsWith('#' + a));
  }
  await p.locator('#kopf [data-gehe="start"]').click(); await warte(900);
  Z('Marke im Kopf führt zur Übersicht', (await n('#ansicht .li-k')) === 3);
  await p.locator('#ansicht .li-k[data-gehe="dateien"]').click(); await warte(900);
  Z('Karte «Logo & Dateien» öffnet die Ansicht', (await n('.li-d')) >= 5);
  await p.goto(h.url + '#bilder', { waitUntil: 'load' }); await p.waitForSelector('#li-raster .li-f', { timeout: 30000 }); await warte(1200);
  Z('Adresse mit #bilder öffnet gleich das Bildarchiv', (await n('#li-raster .li-f')) > 0);

  // ---- 5 Bildarchiv
  const gesamt = await p.evaluate(async u => (await (await fetch(u)).json()).fotos.length, h.basis + 'marke/livre.json');
  const erste = await n('#li-raster .li-f');
  await foto('02-bildarchiv');
  Z('Raster zeigt zuerst 48 Kacheln', erste === 48, erste + ' von ' + gesamt);
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await warte(1800); await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await warte(1500);
  Z('Nachladen beim Scrollen hängt Kacheln an', (await n('#li-raster .li-f')) > 48, await n('#li-raster .li-f'));
  await p.evaluate(() => scrollTo(0, 0));
  await p.locator('#li-q').fill('terr'); await warte(700);
  const nSuche = await n('#li-raster .li-f');
  Z('Suche «terr» filtert', nSuche > 0 && nSuche < gesamt, nSuche);
  Z('Zähler «x von y» stimmt zur Suche', new RegExp('^' + nSuche + '\\D').test((await text('#li-n')).replace(/[’']/g, '')) || (await text('#li-n')).replace(/[’']/g, '').startsWith(String(nSuche)), await text('#li-n'));
  await p.locator('#li-q').fill('qqqqqq'); await warte(700);
  Z('Leere Suche zeigt Hinweis statt Kacheln', (await n('#li-raster .li-leer')) === 1 && (await n('#li-raster .li-f')) === 0);
  await p.locator('#li-reset').click(); await warte(900);
  Z('«Filter zurücksetzen» zeigt wieder alle', (await text('#li-n')).replace(/[’']/g, '').includes(String(gesamt)) && (await p.locator('#li-q').inputValue()) === '');
  for (const g of ['b', 's', 'f', 'h']) {
    const knoepfe = p.locator(`[data-f="${g}"]:not([data-w="alle"])`); const k = await knoepfe.count();
    let ok = k > 0, m = [];
    for (let i = 0; i < k && i < 3; i++) { await knoepfe.nth(i).click(); await warte(400); const c = await n('#li-raster .li-f'); m.push(c); if (!((await knoepfe.nth(i).getAttribute('aria-pressed')) === 'true')) ok = false; }
    await p.locator(`[data-f="${g}"][data-w="alle"]`).click(); await warte(400);
    Z('Filter ' + { b: 'Bereich', s: 'Saison', f: 'Format', h: 'Herkunft' }[g] + ': ' + k + ' Knöpfe, Wahl wirkt, «Alle» löst', ok && (await n('#li-raster .li-f')) === erste, m.join('/'));
  }

  // ---- 6 Detail
  const ersteKachel = p.locator('#li-raster .li-f').first(); const ersterKey = await ersteKachel.getAttribute('data-k');
  await ersteKachel.click(); await p.waitForSelector('#fenster:not([hidden]) .li-det', { timeout: 8000 }); await warte(900);
  await foto('03-foto-gross');
  Z('Foto öffnet gross im Fenster mit Titel, Quelle, Original', (await n('#fenster h2')) && (await n('#fenster .li-meta dt')) === 2);
  Z('Vier Grössen Instagram, Story, Website, Druck', (await n('#fenster .li-gr')) === 4);
  Z('Hinweis zum Beschneiden: «Ausschnitt: Feld ziehen»', (await n('#fenster .li-det__hilfe')) === 1);
  const gr = p.locator('#fenster .li-gr');
  await gr.nth(1).hover(); await warte(500);
  const sch1 = await p.locator('#li-rahmen').getAttribute('data-g');
  await gr.nth(2).hover(); await warte(500); const sch2 = await p.locator('#li-rahmen').getAttribute('data-g');
  await gr.nth(3).hover(); await warte(500); const sch3 = await p.locator('#li-rahmen').getAttribute('data-g');
  Z('Über jede Grösse fahren zeigt den Rahmen mit Mass', /1920/.test(sch1) && sch1 !== sch2 && sch2 !== sch3, [sch1, sch2, sch3].join(' | '));
  await gr.nth(0).hover(); await warte(400);
  await p.locator('#li-rahmen').scrollIntoViewIfNeeded(); await warte(200);
  const rb = await p.locator('#li-rahmen').boundingBox(); const bb = await p.locator('#li-bild').boundingBox();
  const href0 = await p.locator('[data-laden="instagram"]').getAttribute('href');
  await p.mouse.move(rb.x + rb.width / 2, rb.y + rb.height / 2); await p.mouse.down(); await p.mouse.move(rb.x + rb.width / 2 + 60, rb.y + rb.height / 2 + 60, { steps: 6 }); await p.mouse.up(); await warte(400);
  const href1 = await p.locator('[data-laden="instagram"]').getAttribute('href');
  const imp1 = await p.locator('[data-imp="instagram"]').getAttribute('href');
  Z('Rahmen ziehen ändert den Ausschnitt im Download- und Imprimerie-Link', href0 !== href1 && /x=/.test(imp1), (href1 || '').replace(/^.*[?]/, ''));
  const dl = {};
  for (const g of ['instagram', 'story', 'web', 'druck']) { const a = p.locator(`[data-laden="${g}"]`); const href = await a.getAttribute('href'); dl[g] = await status(new URL(href, p.url()).href); }
  Z('Download Instagram 1080 × 1350 (Server)', dl.instagram[0] === 200 && /jpeg/.test(dl.instagram[2]) && dl.instagram[1] > 20000 && /1080x1350/.test(dl.instagram[3]), dl.instagram[3].slice(-40));
  Z('Download Story 1080 × 1920 (Server)', dl.story[0] === 200 && /1080x1920/.test(dl.story[3]), dl.story[3].slice(-40));
  Z('Download Website 2000 px (Server)', dl.web[0] === 200 && /-web-/.test(dl.web[3]), dl.web[3].slice(-40));
  Z('Download Druck volle Auflösung (Server)', dl.druck[0] === 200 && /-druck-/.test(dl.druck[3]) && dl.druck[1] > 100000, Math.round(dl.druck[1] / 1024) + ' KB');
  const [dlg] = await Promise.all([p.waitForEvent('download', { timeout: 20000 }), p.locator('[data-laden="web"]').click()]);
  Z('Klick auf «Laden» speichert eine JPG-Datei', /\.jpg$/.test(dlg.suggestedFilename()), dlg.suggestedFilename().slice(-40));
  const imps = await p.locator('#fenster [data-imp]').evaluateAll(a => a.map(x => x.href));
  Z('Zwei Wege in L’Imprimerie (Beitrag, Story) mit Foto und Ausschnitt', imps.length === 2 && imps.every(u => /foto=/.test(u) && /art=(insta|story)/.test(u) && /x=/.test(u)), imps.map(u => u.replace(/^.*[?]/, '')).join(' | ').slice(0, 90));
  await p.keyboard.press('Escape'); await warte(300);
  Z('Esc schliesst das Fenster', (await n('#fenster[hidden]')) === 1);
  await ersteKachel.click(); await warte(600); await p.locator('#fenster [data-zu]').click(); await warte(300);
  Z('Kreuz schliesst das Fenster', (await n('#fenster[hidden]')) === 1);
  await ersteKachel.click(); await warte(600); await p.mouse.click(8, 8); await warte(300);
  Z('Klick neben das Fenster schliesst es', (await n('#fenster[hidden]')) === 1);
  // Hinweise nach Art
  const art = async (sel, filter) => { if (filter) { await p.locator(`[data-f="h"][data-w="${filter}"]`).click(); await warte(500); } await p.locator(sel || '#li-raster .li-f').first().click(); await warte(900); const t = await text('#fenster .li-det__t'); await p.keyboard.press('Escape'); await warte(200); return t; };
  const tKi = await art(null, 'ki');
  Z('KI-Bild trägt den dunklen Hinweis und «-mit-ki-erzeugt» im Dateinamen', /KI|AI|IA/.test(tKi) && /erzeugt|created|créée/i.test(tKi));
  await p.locator('[data-f="h"][data-w="alle"]').click(); await warte(300);

  // ---- 7 Dateien
  await ansicht('dateien'); await p.waitForSelector('.li-d'); await warte(1500);
  await foto('04-dateien');
  const bloecke = await n('.li-d'); Z('Dateien: Logo, Querform, Zeichen, Wortmarke, Tapete, Farben, Schriften', bloecke === 7, bloecke);
  const dls = await p.locator('#ansicht a[download], #leiste a[download]').evaluateAll(a => [...new Set(a.map(x => x.href))]);
  let schlecht = []; for (const u of dls) { const s = await status(u); if (s[0] !== 200 || s[1] < 200) schlecht.push(s[0] + ' ' + u.replace(/^https?:\/\/[^/]+/, '')); }
  Z('Jede Datei der Ansicht ist abrufbar', schlecht.length === 0, schlecht.join(' | ') || dls.length + ' Dateien');
  const farbe = p.locator('.li-farbe:not(.li-farbe--glanz)').first(); const wert = await farbe.getAttribute('data-kopie');
  await farbe.locator('.li-farbe__w span').first().click(); await warte(500);
  const zw = motor === 'chromium' ? await p.evaluate(() => navigator.clipboard.readText().catch(() => '')) : wert;
  Z('Farbe antippen kopiert den Hexwert, Meldung erscheint', (zw === wert) && (await n('#meldung .quit')) >= 1, wert + ' ' + zw);
  await p.locator('.li-farbe--glanz').first().click(); await warte(500);
  const zv = motor === 'chromium' ? await p.evaluate(() => navigator.clipboard.readText().catch(() => '')) : 'linear-gradient';
  Z('Glanzgold-Farbe kopiert den Verlauf', /linear-gradient/.test(zv), zv.slice(0, 40));
  await p.locator('.li-farbe:not(.li-farbe--glanz)').first().locator('.li-farbe__w span').nth(1).click(); await warte(400);
  const zr = motor === 'chromium' ? await p.evaluate(() => navigator.clipboard.readText().catch(() => '')) : 'rgb(';
  Z('Zweite Zeile einer Farbe kopiert den RGB-Wert', /^rgb\(/.test(zr), zr);
  Z('Schriften mit WOFF2-Knopf', (await n('.li-schrift a[download]')) === 4 || (await n('.li-schrift a[download]')) >= 1, await n('.li-schrift a[download]'));
  Z('Knopf «Regeln im Markenbuch» führt ins Markenbuch', /buch|marke/.test(await p.locator('#ansicht .titel__kn a.kn--linie').getAttribute('href')));

  // ---- 8 Markenprüfung
  await ansicht('pruefung'); await p.waitForSelector('#li-pr'); await warte(1800);
  Z('Prüfung: Feld mit «Datei wählen», Beispiel-Link, Hinweis «nichts gespeichert»', (await n('#li-waehle')) && (await n('#li-bsp')) && (await n('.li-privat')));
  Z('Unter dem leeren Feld steht schon ein Beispiel', (await n('#li-bsp-erg .li-erg')) === 1);
  await p.locator('#li-datei').setInputFiles({ name: 'falsch.txt', mimeType: 'text/plain', buffer: Buffer.from('x') }); await warte(500);
  Z('Falscher Dateityp wird abgewiesen, Meldung erscheint', (await n('#li-los')) === 0 && (await n('#meldung .quit')) >= 1);
  await p.locator('#li-datei').setInputFiles({ name: 'entwurf.png', mimeType: 'image/png', buffer: Buffer.from(PNG, 'base64') }); await warte(700);
  Z('Gewählte Datei: Vorschau, Name, Grösse, «Prüfen»', (await n('.li-feld__vor img')) === 1 && (await n('#li-los')) === 1 && (await text('.li-feld__name')).includes('entwurf.png'));
  Z('Nach der Wahl verschwindet das Beispiel darunter', (await n('#li-bsp-erg .li-erg')) === 0);
  await p.locator('#li-los').click(); await warte(120);
  Z('Prüfen zeigt drei Schritte mit Abtastung', (await n('.li-schritte li')) === 3 && (await n('.li-scan')) === 1);
  await p.waitForFunction(() => { const e = document.querySelector('#li-pr'); return e && !e.querySelector('.li-lauf'); }, null, { timeout: 120000 }); await warte(1500);
  await foto('05-pruefung-ergebnis');
  const hatErg = await n('#li-pr .li-erg'); const hatFeld = await n('#li-pr #li-feld');
  Z('Prüfung endet mit Ergebnis (Messung) oder mit Meldung und Feld', hatErg === 1 || hatFeld === 1, hatErg ? 'Ergebnis' : 'Meldung: ' + (await text('#meldung')).slice(0, 80));
  if (hatErg) {
    Z('Ergebnis: Vorschau, gemessene Farben, Prozent im Rahmen', (await n('.li-erg__bild img')) === 1 && (await n('.li-ton')) >= 1 && (await n('.li-rahmen-z')) === 1, await n('.li-ton') + ' Töne');
    Z('Ergebnis: Hinweis, wenn Claude nicht antwortet, sonst Punkte', (await n('.li-hinweis--ki')) + (await n('.li-pk')) >= 1);
    await p.locator('#li-kopie').click(); await warte(400);
    Z('«Als Text kopieren» legt die Rückmeldung in die Zwischenablage', motor !== 'chromium' || /Le Livre ·/.test(await p.evaluate(() => navigator.clipboard.readText().catch(() => ''))));
    const [d2] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.locator('#li-sichern').click()]);
    Z('«Ergebnis sichern» speichert eine HTML-Datei auf dem Rechner', /^le-livre-pruefung-.*\.html$/.test(d2.suggestedFilename()), d2.suggestedFilename());
    await p.locator('#li-neu').click(); await warte(800);
    Z('«Neuen Entwurf prüfen» setzt das Feld zurück', (await n('#li-waehle')) === 1 && (await n('.li-feld__vor')) === 0);
  } else {
    Z('Ergebnis-Knöpfe nicht erreichbar (Prüfung ohne Antwort)', false, 'Meldung statt Ergebnis');
  }
  await p.locator('#li-bsp').click(); await warte(1500);
  Z('«Beispiel ansehen» zeigt die Rückmeldung zum Beispiel-Entwurf', (await n('.li-erg')) >= 1 && (await n('.li-hinweis--bsp')) >= 1, await n('.li-pk') + ' Punkte');
  Z('Beispiel: Punkte sortiert, «passt nicht» zuerst', await p.evaluate(() => { const l = [...document.querySelectorAll('.li-pk')].map(x => x.className); const i = l.findIndex(c => /passt_nicht/.test(c)); const j = l.findLastIndex(c => /--passt( |$)/.test(c)); return l.length > 0 && i === 0 && (j < 0 || j > i); }));
  await p.goto(h.url + '?beispiel=1#pruefung', { waitUntil: 'load' }); await warte(2500);
  Z('Adresse mit ?beispiel=1#pruefung öffnet das Beispiel gleich', (await n('#li-pr .li-erg')) >= 1);

  // ---- 9 Handy, Fehler
  const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  Z('Kein seitliches Verrutschen (' + breite + ' px)', ue <= 1, ue + ' px');
  if (breite < 600) {
    await p.goto(h.url + '#bilder', { waitUntil: 'load' }); await warte(1500);
    await p.locator('.rand__auf').click(); await warte(500);
    await foto('06-handy-menue');
    Z('Handy: Menü öffnet und zeigt die Ansichten', (await n('#rand.auf .nw')) >= 4);
    await p.locator('#rand [data-gehe="dateien"]').click(); await warte(900);
    Z('Handy: Wahl im Menü wechselt die Ansicht und schliesst das Menü', (await n('.li-d')) >= 5 && (await n('#rand.auf')) === 0);
    await p.goto(h.url + '#bilder', { waitUntil: 'load' }); await p.waitForSelector('#li-raster .li-f'); await warte(900);
    await p.locator('#li-raster .li-f').first().click(); await warte(1000);
    const fb = await p.locator('#fenster .fenster__k').boundingBox();
    Z('Handy: Foto-Fenster passt in den Bildschirm', fb && fb.x >= -1 && fb.x + fb.width <= breite + 1, fb && Math.round(fb.width));
  }
  Z('Keine Fehler in der Konsole, keine toten Anfragen', fehler.length === 0, fehler.slice(0, 3).join(' | ').slice(0, 160));
  await b.close();
  return erg;
}

(async () => {
  const wahl = wer === 'beide' ? ['gbr', 'carlton'] : [wer];
  const alle = {};
  for (const k of wahl) { try { alle[k] = await lauf(HAEUSER[k]); } catch (e) { console.log(HAEUSER[k].name, 'ABBRUCH', String(e).slice(0, 300)); alle[k] = []; } }
  const zeilen = Math.max(...wahl.map(k => alle[k].length));
  let gut = {}, schlecht = {};
  console.log(`Nr | ${wahl.map(k => HAEUSER[k].name.padEnd(9)).join(' | ')} | Zeile (${motor}, ${breite} × ${hoehe})`);
  for (let i = 0; i < zeilen; i++) {
    const t = alle[wahl[0]][i] || alle[wahl[1]][i];
    console.log(`${String(i + 1).padStart(2)} | ${wahl.map(k => { const r = alle[k][i]; return (r ? (r.ok ? '✓' : '✗') + ' ' + (r.mass || '').slice(0, 6) : '–').padEnd(9); }).join(' | ')} | ${t.text}`);
  }
  for (const k of wahl) { gut[k] = alle[k].filter(r => r.ok).length; schlecht[k] = alle[k].filter(r => !r.ok); }
  console.log('\nSumme:', wahl.map(k => `${HAEUSER[k].name} ${gut[k]}/${alle[k].length}`).join(' · '));
  for (const k of wahl) schlecht[k].forEach(r => console.log(`  ✗ ${HAEUSER[k].name} ${r.nr}: ${r.text} → ${r.mass}`));
  fs.writeFileSync(path.join(__dirname, 'ergebnisse', `funktionen-${motor}-${breite}x${hoehe}.json`), JSON.stringify(alle, null, 1));
  process.exit(wahl.some(k => schlecht[k].length) ? 1 : 0);
})();
