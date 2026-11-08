/* Bilder für die Anleitung (anleitung.html): ein Bildschirmfoto je Kapitel aus dem echten Le Livre, 1512×900 → 1200 px breit.
   node anleitung_bilder.js [basis]   (Server: python3 _werkzeuge/livre/server.py) */
const path = require('path'), fs = require('fs');
const PW = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const A = process.argv[2] || 'http://localhost:8965/_werkzeuge/livre/';
const AUS = path.join(__dirname, 'anleitung');
const w = (p, ms) => p.waitForTimeout(ms);
const K = [
  ['k01', 'start', null],
  ['k02', 'bilder', async p => { await p.fill('#li-q', 'terrasse'); await w(p, 900); }],
  ['k03', 'bilder', async p => { await p.locator('#li-raster .li-f').first().click(); await p.waitForSelector('#fenster .li-det'); await w(p, 900); await p.locator('#fenster .li-gr').nth(0).hover(); await w(p, 700); }],
  ['k04', 'bilder', async p => { await p.locator('[data-f="h"][data-w="ki"]').click(); await w(p, 700); await p.locator('#li-raster .li-f').first().click(); await p.waitForSelector('#fenster .li-det'); await w(p, 900); }],
  ['k05', 'dateien', null],
  ['k06', 'dateien', async p => { await p.locator('.li-farbe').first().scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, 160)); await w(p, 900); }],
  ['k07', 'pruefung', null],
  ['k08', 'pruefung', async p => { await p.locator('#li-bsp').click(); await w(p, 1600); await p.evaluate(() => document.querySelector('.li-erg').scrollIntoView()); await w(p, 1000); }],
  ['k09', null, null]];
(async () => {
  const b = await PW.webkit.launch(); fs.mkdirSync(AUS, { recursive: true });
  for (const [id, v, vor] of K) {
    const c = await b.newContext({ viewport: { width: 1512, height: 900 }, deviceScaleFactor: 1 }); const p = await c.newPage();
    await p.goto(v ? A + '#' + v : A.replace('_werkzeuge/livre/', 'marke/'), { waitUntil: 'load' }); await w(p, 3200);
    if (vor) await vor(p);
    await p.screenshot({ path: path.join(AUS, id + '.png') });
    await c.close();
  }
  await b.close();
  const { execSync } = require('child_process');
  for (const [id] of K) execSync(`sips -s format jpeg -s formatOptions 82 --resampleWidth 1200 "${path.join(AUS, id + '.png')}" --out "${path.join(AUS, id + '.jpg')}" >/dev/null && rm "${path.join(AUS, id + '.png')}"`);
  console.log('Bilder:', fs.readdirSync(AUS).join(' '));
})();
