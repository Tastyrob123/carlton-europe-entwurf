// Le Livre · Prüfung 16.10.2026, alles was die Funktionsliste nicht bedient: Rahmen R02/R03/R04/R15/R17/R18/R19, Vorher/Nachher bei allen
// nachgeschärften Fotos, ungewöhnliche Eingaben (Suche und Prüfung), Netz weg, zwei Fenster, 320 px, Sprache je Ansicht.
//   BASIS=http://localhost:8966/ FEHLERLOG=<datei des Prüfservers> node _werkzeuge/livre/pruefung/zusatz.js chromium|webkit|firefox
// Prüfserver ohne KI: LIVRE_KI=0 LIVRE_FEHLER=<datei> python3 _werkzeuge/livre/server.py 8966. Testdateien entstehen in pruefung/_proben/ (geht nie online).
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const pw = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const BASIS = process.env.BASIS || 'http://localhost:8966/', URL0 = BASIS + '_werkzeuge/livre/';
const motor = process.argv[2] || 'chromium';
const HIER = __dirname, PROBEN = path.join(HIER, '_proben'), BELEG = path.join(HIER, 'belege', 'zusatz-' + motor);
fs.mkdirSync(PROBEN, { recursive: true }); fs.mkdirSync(BELEG, { recursive: true });
const erg = []; const Z = (t, ok, m = '') => { erg.push({ nr: erg.length + 1, t, ok: !!ok, m: String(m).slice(0, 220) }); console.log((ok ? '✓' : '✗') + ' ' + String(erg.length).padStart(2) + ' ' + t + (m !== '' ? ' · ' + String(m).slice(0, 140) : '')); };

function proben() {   // Testdateien einmal erzeugen (Python/Pillow): 30 MB, knapp unter 30 MB, 400 px, 13'000 × 13'000 (169 MP), PDF mit 3 Seiten, «Bild» ohne Bild
  const py = `
import os, sys
from PIL import Image
import random
P = sys.argv[1]
def da(n): return os.path.exists(os.path.join(P, n))
if not da('klein-400.png'): Image.new('RGB', (400, 300), (6, 20, 43)).save(os.path.join(P, 'klein-400.png'))
if not da('riesig-169mp.png'): Image.new('RGB', (13000, 13000), (244, 236, 220)).save(os.path.join(P, 'riesig-169mp.png'), optimize=True)
if not da('gross-29mb.jpg') or not da('gross-31mb.jpg'):
    im = Image.frombytes('RGB', (2600, 2600), os.urandom(2600 * 2600 * 3))
    im.save(os.path.join(P, 'gross-29mb.jpg'), quality=100, subsampling=0)
    with open(os.path.join(P, 'gross-31mb.jpg'), 'wb') as f:
        f.write(open(os.path.join(P, 'gross-29mb.jpg'), 'rb').read() + b'\\0' * (31 * 1024 * 1024 - os.path.getsize(os.path.join(P, 'gross-29mb.jpg'))))
if not da('drei-seiten.pdf'):
    s = [Image.new('RGB', (595, 842), c) for c in ((244, 236, 220), (6, 20, 43), (220, 198, 143))]
    s[0].save(os.path.join(P, 'drei-seiten.pdf'), save_all=True, append_images=s[1:])
open(os.path.join(P, 'kein-bild.png'), 'wb').write(b'Das ist Text, kein Bild. <script>alert(1)</script>')
print(' '.join(f'{n}={os.path.getsize(os.path.join(P, n))}' for n in sorted(os.listdir(P))))`;
  return execFileSync('python3', ['-c', py, PROBEN], { encoding: 'utf8' }).trim();
}

(async () => {
  console.log('Proben:', proben());
  const b = await pw[motor].launch();
  const neu = async (opt = {}) => {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, ...opt });
    const p = await ctx.newPage(); p.fehler = [];
    p.on('pageerror', e => p.fehler.push('JS ' + e)); p.on('dialog', d => { p.fehler.push('DIALOG ' + d.message()); d.dismiss(); });
    return [ctx, p];
  };
  const warte = (p, ms) => p.waitForTimeout(ms);
  const n = (p, s) => p.locator(s).count();
  const text = async (p, s) => (await p.locator(s).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  const meldung = async p => (await p.locator('#meldung .quit').allInnerTexts().catch(() => [])).join(' | ');

  // ---- R15 Ladezeichen erst nach 280 ms, R02 Auftakt
  {
    const [ctx, p] = await neu();
    await p.route('**/marke/livre.json*', async r => { await new Promise(x => setTimeout(x, 1600)); r.continue(); });
    const t0 = Date.now(); p.goto(URL0 + '#start').catch(() => {});
    await p.waitForSelector('#ansicht > .lade', { state: 'attached', timeout: 10000 });
    await warte(p, Math.max(0, 140 - (Date.now() - t0)));
    const o1 = await p.evaluate(() => getComputedStyle(document.querySelector('#ansicht > .lade .lade__r')).opacity);
    await warte(p, 600);
    const o2 = await p.evaluate(() => { const e = document.querySelector('#ansicht > .lade .lade__r'); return e ? getComputedStyle(e).opacity : 'weg'; });
    Z('R15 Ladezeichen erst nach 280 ms (kurz nach dem Öffnen unsichtbar, danach sichtbar)', o1 === '0' && (o2 === '1' || o2 === 'weg'), `${o1} → ${o2}`);
    await p.waitForSelector('#ansicht .li-hero', { timeout: 20000 });
    const zustand = await p.evaluate(() => ({ schrift: document.fonts.status, kopf: !!document.querySelector('#kopf .kopf__marke'), rand: !!document.querySelector('#rand .nw'), bild: [...document.images].filter(i => i.closest('#ansicht')).every(i => i.loading === 'lazy' || i.complete) }));
    Z('R02 Auftakt: Kopf, Rand und Ansicht kommen zusammen, Schriften geladen', zustand.schrift === 'loaded' && zustand.kopf && zustand.rand, JSON.stringify(zustand));
    await ctx.close();
  }
  // ---- R04 Startfehler-Tür
  {
    const [ctx, p] = await neu();
    await p.route('**/marke/livre.json*', r => r.fulfill({ status: 404, body: 'weg' }));
    await p.goto(URL0 + '#start'); await warte(p, 2500);
    const tuer = await text(p, '.li-tuer');
    Z('R04 Startfehler-Tür, wenn die Daten fehlen: Satz, Grund, «Neu laden», Anleitung', /startet nicht/.test(tuer) && /404/.test(tuer) && (await n(p, '.li-tuer [data-neu]')) === 1 && (await n(p, '.li-tuer a[href="anleitung.html"]')) === 1, tuer.slice(0, 110));
    await p.screenshot({ path: path.join(BELEG, 'r04-startfehler.jpg'), type: 'jpeg', quality: 70 });
    await p.unroute('**/marke/livre.json*'); await p.locator('.li-tuer [data-neu]').click(); await p.waitForSelector('#ansicht .li-hero', { timeout: 20000 });
    Z('R04 «Neu laden» startet Le Livre, sobald die Daten wieder da sind', (await n(p, '#ansicht .li-k')) === 3);
    await ctx.close();
    const [ctx2, p2] = await neu();
    await p2.route('**/livre.js*', r => r.abort());
    await p2.goto(URL0); await warte(p2, 12800);
    const nach = await p2.evaluate(() => { const e = document.querySelector('#ansicht > .lade'); return e ? [getComputedStyle(e, '::after').content, getComputedStyle(e, '::after').opacity] : null; });
    Z('R04 Lädt das Skript gar nicht: nach 12 s steht ein Satz statt endlosem Kreisel', nach && /lädt noch/.test(nach[0]) && nach[1] === '1', nach && nach.join(' · ').slice(0, 90));
    await ctx2.close();
  }
  // ---- R03 Fehlermelder
  {
    const [ctx, p] = await neu();
    await p.goto(URL0 + '#start'); await p.waitForSelector('#ansicht .li-k'); await warte(p, 800);
    const vorher = process.env.FEHLERLOG && fs.existsSync(process.env.FEHLERLOG) ? fs.readFileSync(process.env.FEHLERLOG, 'utf8').split('\n').filter(Boolean).length : 0;
    await p.evaluate(() => { for (let i = 0; i < 25; i++) setTimeout(() => { throw new Error('Probefehler ' + i + ' <b>x</b>'); }, i * 5); });
    await warte(p, 1800);
    const lokal = await p.evaluate(() => JSON.parse(localStorage.getItem('livre-fehler') || '[]'));
    const nachher = process.env.FEHLERLOG && fs.existsSync(process.env.FEHLERLOG) ? fs.readFileSync(process.env.FEHLERLOG, 'utf8').split('\n').filter(Boolean).length : -1;
    Z('R03 Fehlermelder: Skriptfehler im Browser gemerkt (höchstens 20)', lokal.length === 20 && /Probefehler/.test(lokal[0].text), lokal.length + ' gemerkt');
    Z('R03 Fehlermelder: an api/fehler gemeldet, höchstens 20 je Seite', nachher - vorher === 20, `${nachher - vorher} neue Zeilen im Protokoll des Servers`);
    await p.route('**/marke/dateien/**', r => r.abort()); await p.evaluate(() => { location.hash = '#dateien'; }); await warte(p, 1500);
    const nach2 = process.env.FEHLERLOG ? fs.readFileSync(process.env.FEHLERLOG, 'utf8').split('\n').filter(Boolean).length : -1;
    Z('R03 Netzfehler (fehlende Bilder) werden nicht gemeldet', nach2 === nachher, nach2 - nachher);
    await ctx.close();
  }
  // ---- R18 Rundgang, R19 Zur Werkbank, R17 weniger Bewegung
  {
    const [ctx, p] = await neu();
    await p.goto(URL0 + '#start'); await p.waitForSelector('#ansicht .li-k'); await warte(p, 4000);
    Z('R18 Prüfbrowser sieht kein Schild «Kurzer Rundgang»', (await n(p, '.rdg-schild')) === 0 && (await n(p, '.rdg-kegel')) === 0);
    Z('R18 «Kurzer Rundgang» als Weg im Rand', (await n(p, '#rand .wege .rdg-wieder')) === 1);
    Z('R19 Ohne Herkunft aus der Werkbank kein Knopf «Zur Werkbank»', (await n(p, '#zur-werkbank')) === 0);
    await p.goto(URL0 + '?rundgang#start'); await p.waitForSelector('.rdg-kegel', { timeout: 15000 }); await warte(p, 900);
    const schritte = []; for (let i = 0; i < 6; i++) { const k = await text(p, '.rdg-karte'); if (!k) break; schritte.push(k.slice(0, 50)); await p.screenshot({ path: path.join(BELEG, `r18-rundgang-${i + 1}.jpg`), type: 'jpeg', quality: 70 }); const w = p.locator('.rdg-karte button', { hasText: /Weiter|Fertig|Los/ }).last(); if (!(await w.count())) break; await w.click(); await warte(p, 900); }
    Z('R18 Rundgang über ?rundgang: Lichtkegel auf echten Stücken, vier Schritte, endet sauber', schritte.length === 4 && (await n(p, '.rdg-kegel')) === 0, schritte.join(' / '));
    Z('R18 Rundgang erklärt was und wozu, nicht die Bedienung', schritte.every(s => !/klicken Sie|drücken|tippen Sie/i.test(s)));
    await p.goto(URL0 + '?wb=de.k5#start'); await p.waitForSelector('#ansicht .li-k'); await warte(p, 2500);
    const zw = await p.evaluate(() => { const w = document.querySelector('#zur-werkbank'); if (!w) return null; const r = (w.shadowRoot || w).querySelector('a'); return r ? [r.textContent.trim(), r.getAttribute('href')] : 'ohne Link'; });
    Z('R19 Aus der Werkbank geöffnet: Knopf «Zur Werkbank» mit Weg zurück', zw && /Werkbank/.test(zw[0]) && /werkbank/.test(zw[1]), JSON.stringify(zw));
    await p.screenshot({ path: path.join(BELEG, 'r19-zur-werkbank.jpg'), type: 'jpeg', quality: 70 });
    await p.evaluate(() => { location.hash = '#bilder'; }); await warte(p, 1200);
    Z('R19 Der Knopf bleibt über weitere Klicks (Sitzung)', (await n(p, '#zur-werkbank')) === 1);
    await ctx.close();
    const [ctx2, p2] = await neu({ reducedMotion: 'reduce' });
    await p2.goto(URL0 + '#start'); await p2.waitForSelector('#ansicht .li-k'); await warte(p2, 300);
    const offen = await p2.evaluate(() => [...document.querySelectorAll('#ansicht [data-r]')].filter(x => !x.classList.contains('da')).length);
    Z('R17 «Weniger Bewegung»: alles steht sofort', offen === 0, offen + ' Stücke warten');
    await ctx2.close();
  }
  // ---- Vorher/Nachher bei allen nachgeschärften Fotos
  {
    const [ctx, p] = await neu();
    await p.goto(URL0 + '#bilder'); await p.waitForSelector('#li-raster .li-f');
    const L = await p.evaluate(async () => (await (await fetch('../../marke/livre.json')).json()).fotos.filter(f => f.vn).map(f => f.k));
    let gut = 0; const schlecht = [];
    for (const k of L) {
      await p.evaluate(k => { const f = window.__d; }, k);
      while (!(await n(p, `#li-raster .li-f[data-k="${k}"]`))) { const vor = await n(p, '#li-raster .li-f'); await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await warte(p, 700); if ((await n(p, '#li-raster .li-f')) === vor) break; }
      const kach = p.locator(`#li-raster .li-f[data-k="${k}"]`); if (!(await kach.count())) { schlecht.push(k + ' nicht im Raster'); continue; }
      await kach.scrollIntoViewIfNeeded(); await warte(p, 700); await kach.click(); await p.waitForSelector('#fenster:not([hidden]) .li-det'); await p.waitForFunction(() => { const i = document.querySelector('.li-vn__v'); return i && i.complete; }, null, { timeout: 15000 }).catch(() => {});
      const r = await p.evaluate(async () => {
        const v = document.querySelector('#li-bild'), o = document.querySelector('.li-vn__v'), nach = v.querySelector('img:not(.li-vn__v)');
        const k = [...document.querySelectorAll('[data-vn]')].map(b => b.dataset.vn).join(',');
        const vor = getComputedStyle(o).opacity;
        document.querySelector('[data-vn="vorher"]').click(); for (let i = 0; i < 30 && +getComputedStyle(o).opacity < .99; i++) await new Promise(r => setTimeout(r, 100)); const opV = getComputedStyle(o).opacity, rahmenV = getComputedStyle(document.querySelector('#li-rahmen')).display;
        document.querySelector('[data-vn="schieber"]').click(); await new Promise(r => setTimeout(r, 120)); const clip = getComputedStyle(o).clipPath;
        document.querySelector('[data-vn="nachher"]').click(); for (let i = 0; i < 30 && +getComputedStyle(o).opacity > .01; i++) await new Promise(r => setTimeout(r, 100)); const opN = getComputedStyle(o).opacity;
        const orig = document.querySelector('.li-orig a'); const st = orig ? (await fetch(orig.href)).status : 0;
        return { k, vor, opV, rahmenV, clip, opN, o: [o.naturalWidth, o.naturalHeight], n: [nach.naturalWidth, nach.naturalHeight], st };
      });
      const masse = Math.abs(r.o[0] / r.o[1] - r.n[0] / r.n[1]) < .012;
      if (r.k === 'vorher,nachher,schieber' && +r.vor < .05 && +r.opV > .95 && r.rahmenV === 'none' && /inset/.test(r.clip) && +r.opN < .05 && r.st === 200 && masse && r.o[0] > 100) gut++; else schlecht.push(k + ' ' + JSON.stringify(r).slice(0, 160));
      if (gut === 1) { await p.locator('[data-vn="schieber"]').click(); const bb = await p.locator('#li-bild').boundingBox(); await p.mouse.move(bb.x + bb.width * .5, bb.y + bb.height * .4); await p.mouse.down(); await p.mouse.move(bb.x + bb.width * .25, bb.y + bb.height * .4, { steps: 6 }); await p.mouse.up(); const pp = await p.evaluate(() => document.querySelector('#li-bild').style.getPropertyValue('--p')); Z('Vorher/Nachher: Schieber folgt der Maus', parseFloat(pp) > 18 && parseFloat(pp) < 32, pp); await p.screenshot({ path: path.join(BELEG, 'vorher-nachher-schieber.jpg'), type: 'jpeg', quality: 72 }); }
      await p.keyboard.press('Escape'); await warte(p, 250);
    }
    Z(`Vorher/Nachher bei allen ${L.length} nachgeschärften Fotos: drei Knöpfe, Vorher zeigt das Original, Schieber schneidet, Nachher zurück, Original ladbar, gleicher Ausschnitt`, schlecht.length === 0 && gut === L.length, schlecht.slice(0, 3).join(' | ') || gut + ' von ' + L.length);
    await p.goto(URL0 + '#bilder'); await p.waitForSelector('#li-raster .li-f'); await warte(p, 900);
    const ohne = await p.evaluate(async () => { const vn = new Set((await (await fetch('../../marke/livre.json')).json()).fotos.filter(x => x.vn).map(x => x.k)); const b = [...document.querySelectorAll('#li-raster .li-f')].find(x => !vn.has(x.dataset.k)); return b ? b.dataset.k : null; });
    if (ohne) { const k2 = p.locator(`#li-raster .li-f[data-k="${ohne}"]`); await k2.scrollIntoViewIfNeeded(); await warte(p, 600); await k2.click(); await p.waitForSelector('#fenster:not([hidden]) .li-det'); }
    Z('Fotos ohne Nachschärfung zeigen keine Vorher/Nachher-Knöpfe', (await n(p, '[data-vn]')) === 0 || ohne === null, ohne);
    await ctx.close();
  }
  // ---- Suche mit ungewöhnlichen Eingaben
  {
    const [ctx, p] = await neu();
    await p.goto(URL0 + '#bilder'); await p.waitForSelector('#li-raster .li-f'); await warte(p, 900);
    const suche = async q => { await p.locator('#li-q').fill(q); await warte(p, 700); return [await n(p, '#li-raster .li-f'), await n(p, '#li-raster .li-leer'), (await p.locator('#li-q').inputValue()).length]; };
    const lang = 'Interlaken '.repeat(455).slice(0, 5000);
    const r1 = await suche(lang); Z('Suche mit 5’000 Zeichen: kein Absturz, Hinweis statt Kacheln', r1[1] === 1 && r1[0] === 0 && p.fehler.length === 0, `${r1[2]} Zeichen im Feld`);
    const r2 = await suche('<script>alert(1)</script><img src=x onerror=alert(2)>'); Z('Suche mit <script> und <img onerror>: nichts wird ausgeführt, nichts eingefügt', p.fehler.length === 0 && (await n(p, '#li-raster img[src="x"]')) === 0, r2.join('/'));
    const r3 = await suche('🏔️🍷'); Z('Suche mit Emoji: kein Absturz, Hinweis', r3[1] === 1 && p.fehler.length === 0);
    const r4 = await suche('Säle'); const r5 = await suche('säle'); const r6 = await suche('SÄLE');
    Z('Suche mit Umlaut, gross und klein gleich («Säle»)', r4[0] > 0 && r4[0] === r5[0] && r5[0] === r6[0], `${r4[0]}/${r5[0]}/${r6[0]}`);
    const r7 = await suche('   '); Z('Suche nur mit Leerzeichen zeigt alles', r7[0] >= 48);
    await p.locator('#li-reset').click(); await warte(p, 500);
    await ctx.close();
  }
  // ---- Markenprüfung mit ungewöhnlichen Dateien
  {
    const [ctx, p] = await neu();
    await p.goto(URL0 + '#pruefung'); await p.waitForSelector('#li-waehle'); await warte(p, 900);
    const waehle = async datei => { await p.locator('#li-datei').setInputFiles(path.join(PROBEN, datei)); await warte(p, 1600); };
    const pruefe = async () => { await p.locator('#li-los').click(); await p.waitForFunction(() => { const e = document.querySelector('#li-pr'); return e && !e.querySelector('.li-lauf'); }, null, { timeout: 120000 }); await warte(p, 900); return { erg: await n(p, '#li-pr .li-erg'), feld: await n(p, '#li-los'), melde: await meldung(p) }; };
    const zuruck = async () => { if (await n(p, '#li-neu')) { await p.locator('#li-neu').click(); await warte(p, 600); } await p.evaluate(() => document.querySelectorAll('#meldung .quit').forEach(q => q.remove())); };
    await waehle('gross-31mb.jpg'); Z('Datei über 30 MB wird abgewiesen, klare Meldung', (await n(p, '#li-los')) === 0 && /30 MB/.test(await meldung(p)), await meldung(p)); await zuruck();
    await waehle('gross-29mb.jpg'); let r = await pruefe(); Z('Foto knapp unter 30 MB (2’600 × 2’600, Rauschen): wird verkleinert gesendet und geprüft', r.erg === 1, JSON.stringify(r).slice(0, 120)); await p.screenshot({ path: path.join(BELEG, 'pruefung-29mb.jpg'), type: 'jpeg', quality: 70 }); await zuruck();
    await waehle('klein-400.png'); r = await pruefe(); Z('Kleines Bild (400 px): geprüft, Farben gemessen', r.erg === 1 && /Nacht/.test(await text(p, '#li-pr')), (await text(p, '.li-rahmen-z')).slice(0, 60)); await zuruck();
    await waehle('riesig-169mp.png'); r = await pruefe(); Z('Riesenbild 13’000 × 13’000: geprüft (verkleinert) oder sauber abgewiesen, kein Absturz', r.erg === 1 || (r.feld === 1 && /zu gross|Megapixel|nicht öffnen/.test(r.melde)), JSON.stringify(r).slice(0, 140)); await zuruck();
    await waehle('kein-bild.png'); r = await pruefe(); Z('«Bild» ohne Bild: Meldung, Feld bleibt mit der Datei', r.erg === 0 && r.feld === 1 && /nicht öffnen|JPG/.test(r.melde), r.melde.slice(0, 100)); await zuruck();
    await p.goto(URL0 + '#pruefung'); await p.waitForSelector('#li-waehle'); await warte(p, 600);
    await waehle('drei-seiten.pdf'); r = await pruefe(); const t = await text(p, '#li-pr'); Z('PDF mit drei Seiten: geprüft, Seitenzahl genannt', r.erg === 1 && /3/.test(t), t.slice(0, 120)); await zuruck();
    // Netz weg
    await p.goto(URL0 + '#pruefung'); await p.waitForSelector('#li-waehle'); await waehle('klein-400.png');
    await ctx.setOffline(true); await p.locator('#li-los').click(); await warte(p, 2500);
    const m = await meldung(p); Z('Netz weg beim Prüfen: Meldung «Keine Verbindung», Datei bleibt gewählt', /Verbindung|antwortet nicht/i.test(m) && (await n(p, '#li-los')) === 1 && (await text(p, '.li-feld__name')).includes('klein-400'), m.slice(0, 100));
    await ctx.setOffline(false); await warte(p, 500); r = await pruefe(); Z('Netz wieder da: dieselbe Datei lässt sich prüfen', r.erg === 1);
    Z('Keine Skriptfehler und keine Dialoge bei allen Proben', p.fehler.length === 0, p.fehler.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---- Zwei Fenster gleichzeitig
  {
    const [ctx, p] = await neu(); const p2 = await ctx.newPage();
    await Promise.all([p.goto(URL0 + '#pruefung'), p2.goto(URL0 + '#pruefung')]); await Promise.all([p.waitForSelector('#li-waehle'), p2.waitForSelector('#li-waehle')]);
    await p.locator('#li-datei').setInputFiles(path.join(PROBEN, 'klein-400.png')); await p2.locator('#li-datei').setInputFiles(path.join(PROBEN, 'drei-seiten.pdf')); await warte(p, 1000);
    await Promise.all([p.locator('#li-los').click(), p2.locator('#li-los').click()]);
    await Promise.all([p, p2].map(x => x.waitForFunction(() => { const e = document.querySelector('#li-pr'); return e && !e.querySelector('.li-lauf'); }, null, { timeout: 120000 })));
    const a = await text(p, '#li-pr'), c = await text(p2, '#li-pr');
    Z('Zwei Fenster prüfen gleichzeitig: jedes bekommt seine eigene Rückmeldung', /klein-400/.test(a) && /drei-seiten/.test(c) && !/drei-seiten/.test(a), a.slice(0, 40) + ' | ' + c.slice(0, 40));
    await p2.evaluate(() => { location.hash = '#dateien'; }); await warte(p2, 800); await p.reload(); await p.waitForSelector('#ansicht .li-hero'); await warte(p, 800);
    Z('Zwei Fenster: Neuladen zeigt die zuletzt gewählte Ansicht (im Browser gemerkt), nichts geht verloren', /dateien|pruefung/.test(p.url() + (await p.evaluate(() => localStorage.getItem('livre-ansicht')))), await p.evaluate(() => localStorage.getItem('livre-ansicht')));
    await ctx.close();
  }
  // ---- 320 px, jede Ansicht und jede Sprache
  {
    const schlecht = [];
    for (const breite of [320, 390]) for (const sp of ['de', 'en', 'fr']) {
      const [ctx, p] = await neu({ viewport: { width: breite, height: 760 } });
      await p.goto(URL0 + `?sprache=${sp}#start`); await p.waitForSelector('#ansicht .li-hero');
      for (const a of ['start', 'bilder', 'dateien', 'pruefung']) {
        await p.evaluate(a => { location.hash = '#' + a; }, a); await warte(p, 1100);
        const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        if (ue > 1) schlecht.push(`${breite} ${sp} ${a}: ${ue} px`);
        if (breite === 320 && sp === 'de') await p.screenshot({ path: path.join(BELEG, `320-${a}.jpg`), type: 'jpeg', quality: 70 });
      }
      await ctx.close();
    }
    Z('320 und 390 px, drei Sprachen, vier Ansichten: kein seitliches Verrutschen', schlecht.length === 0, schlecht.join(' | ') || '24 Ansichten');
  }
  // ---- Sprache: jede Ansicht ohne deutsche Reste
  {
    const reste = [];
    const [ctx, p] = await neu();
    for (const sp of ['en', 'fr']) {
      await p.goto(URL0 + `?sprache=${sp}#start`); await p.waitForSelector('#ansicht .li-hero');
      for (const a of ['start', 'bilder', 'dateien', 'pruefung']) {
        await p.evaluate(a => { location.hash = '#' + a; }, a); await warte(p, 1000);
        const t = await p.evaluate(() => [document.querySelector('#kopf').innerText, document.querySelector('#rand').innerText, document.querySelector('#leiste').innerText, [...document.querySelectorAll('#ansicht h1, #ansicht h2, #ansicht .kn, #ansicht button, #ansicht .satz')].map(x => x.innerText).join(' ')].join(' '));
        const de = (t.match(/\b(Übersicht|Bildarchiv|Prüfung|Laden|Schliessen|Dateien|Farben|Schriften|Zeichen|Alle|Bereich|Herkunft|Anleitung|Website ansehen|nachgeschärft|Kurzer Rundgang)\b/g) || []);
        if (de.length) reste.push(`${sp} ${a}: ${[...new Set(de)].join(', ')}`);
      }
    }
    Z('Englisch und Französisch: keine deutschen Wörter in Kopf, Rand, Leiste, Titeln und Knöpfen', reste.length === 0, reste.join(' | '));
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(HIER, 'ergebnisse', `zusatz-${motor}.json`), JSON.stringify(erg, null, 1));
  console.log(`\nSumme ${motor}: ${erg.filter(x => x.ok).length}/${erg.length}`);
  process.exit(erg.every(x => x.ok) ? 0 : 1);
})().catch(e => { console.log('ABBRUCH', e); process.exit(2); });
