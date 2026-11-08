/* Jede Seite öffnet oben (Robert 18.10.2026 18:30: «… die Links oben die Seite zeigen»): der Browser stellt beim Neuladen keine alte Stelle her */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
/* Le Livre · Carlton-Europe. Die Marke des Hauses zum Arbeiten (Nachbau von Le Livre des Grand Beau-Rivage, dort nur gelesen): Bildarchiv mit fertigen Grössen,
   Dateien (Zeichen, Logo, Wortmarke, Tapete, Farben, Schriften), Markenprüfung für Entwürfe, das Markenbuch (../../marke/) als Kapitel. Daten: ../../marke/livre.json
   (gebaut von _werkbank/marke_livre.py), Downloads und Prüfung über den Server-Teil livre.py (server.py, api/…). Oberfläche in drei Sprachen (wie die Website).
   Gespeichert wird nichts, ausser «Ergebnis sichern» legt auf Wunsch eine Datei auf diesem Rechner ab. Nur im Carlton: Vorher/Nachher bei den nachgeschärften Fotos. */
'use strict';
/* Fehlermelder (R03, Prüfung 16.10.2026, Vorbild studio/index.html des Rivage), vor allem anderen: Skriptfehler nach localStorage «livre-fehler»
   (letzte 20) und an api/fehler. Netzfehler und fehlende Dateien werden nie gemeldet, höchstens 20 je Seite, ein eigener Fehlschlag schaltet ab. */
(function () {
  let n = 0, aus = false;
  const melde = (art, text, wo) => {
    if (aus || n >= 20) return; n++;
    const e = { zeit: new Date().toISOString(), art, text: String(text || '').slice(0, 300), wo: String(wo || '').slice(0, 200), seite: location.pathname + location.hash, browser: navigator.userAgent.slice(0, 160) };
    try { const l = JSON.parse(localStorage.getItem('livre-fehler') || '[]'); l.push(e); localStorage.setItem('livre-fehler', JSON.stringify(l.slice(-20))); } catch (x) { /* privat */ }
    try { fetch('api/fehler', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(e), keepalive: true }).then(r => { if (!r.ok) aus = true; }, () => { aus = true; }); } catch (x) { aus = true; }
  };
  addEventListener('error', ev => { if (ev.target && ev.target !== window) return; melde('fehler', ev.message, (ev.filename || '').split('/').pop() + ':' + (ev.lineno || 0)); }, true);
  addEventListener('unhandledrejection', ev => { const r = ev.reason; if (r && /Failed to fetch|NetworkError|Load failed|network|abort/i.test(String(r.message || r))) return; melde('versprechen', r && (r.message || r), r && r.stack && r.stack.split('\n')[1]); });
})();
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PF = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
const IMPRIMERIE = '../imprimerie/';   // immer relativ, nie nach Port (F18, Prüfung 16.10.2026): L’Imprimerie liegt lokal (_werkzeuge/imprimerie/) und online (werkzeuge/imprimerie/) neben Le Livre
const PU = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v9M3.8 7 8 11.2 12.2 7M3 14h10"/></svg>';
const PO = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12V3M3.8 7 8 2.8 12.2 7M3 14h10"/></svg>';
const ZU = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg>';
const LUPE = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/></svg>';
const KOPIE = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="1.6"/><path d="M3 10.5V3.8A1.3 1.3 0 0 1 4.3 2.5H10.5"/></svg>';
const BUCH = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.2c2-.8 3.8-.6 5.5.6 1.7-1.2 3.5-1.4 5.5-.6v9.6c-2-.8-3.8-.6-5.5.6-1.7-1.2-3.5-1.4-5.5-.6z"/><path d="M8 3.8v9.6"/></svg>';
const HAUS = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 7.2 8 2.8l5.5 4.4V13.5h-11z"/><path d="M6.4 13.5V9.6h3.2v3.9"/></svg>';
const PFEIL = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5"/></svg>';
const ZEICHEN = '<img src="../../assets/img/ce-gold-320.webp" alt="" width="320" height="206" decoding="async">';
const IMG = '../../assets/img/', MARKE = '../../marke/', DAT = '../../marke/dateien/', ORIG = '../../marke/original/';

/* ---------------------------------------------------------------- Sprachen der Oberfläche */
const SPRACHEN = [['de', 'DE', 'Deutsch'], ['en', 'EN', 'English'], ['fr', 'FR', 'Français']];
const T = {
de: {
  unter: 'Marke · Carlton-Europe', start: 'Übersicht', arbeiten: 'Arbeiten', nachschlagen: 'Nachschlagen', bilder: 'Bildarchiv', dateien: 'Logo & Dateien', pruefung: 'Markenprüfung', buch: 'Markenbuch',
  anleitung: 'Anleitung', maison: 'La Maison', website: 'Website ansehen', sprache: 'Sprache',
  morgen: 'Guten Morgen.', tag: 'Guten Tag.', abend: 'Guten Abend.', frage: 'Was brauchen Sie heute?',
  start_satz: 'Le Livre ist die Marke des Hauses zum Arbeiten: alle Fotos in fertigen Grössen für Instagram, Website und Druck, Zeichen, Logo, Tapete und Farben als Dateien, und eine Prüfung für Entwürfe von Agenturen und aus dem Haus.',
  k_bilder: 'Alle Fotos des Hauses, nach Bereich, Saison und Format. Jedes Foto als Beitrag, Story, für die Website oder den Druck.',
  k_dateien: 'Zeichen, Logo und Wortmarke für helle und dunkle Flächen, die Tapete und die Farbwerte zum Kopieren.',
  k_pruefung: 'Ein Entwurf als Bild oder PDF. Le Livre sagt, was zum Haus passt und was nicht, Punkt für Punkt.',
  k_buch: 'Zeichen, Farben und ihre Herkunft, Schriften, Tapete und die Regeln, nach denen alles gestaltet ist.',
  oeffnen: 'Öffnen', lesen: 'Lesen',
  ue_kurz: 'nachgeschärft', z_haus: 'Fotos des Hauses', z_frei: 'frei lizenziert', z_ki: 'mit KI erzeugt', z_partner: 'von Partnern', z_dateien: 'Dateien',
  stand: '{0} Fotos · {1} Dateien',
  recht_t: 'Bildrechte', recht: 'Die Fotos gehören dem Carlton-Europe Interlaken und seinen Fotografen. Frei lizenzierte Fotos nur mit dem genannten Namen und der Lizenz, Fotos von Partnern nur mit deren Einverständnis. Mit KI erzeugte Bilder sind gekennzeichnet und zeigen keine echten Gerichte des Hauses.',
  alles_zip: 'Alle Dateien (ZIP)',
  b_titel: 'Bildarchiv', b_satz: 'Ein Klick auf ein Foto öffnet es. Dort laden Sie es in der Grösse, die Sie brauchen, und wählen bei Beitrag und Story den Ausschnitt.',
  suchen: 'Suchen, zum Beispiel «Dachterrasse» oder «Kamin»', bereich: 'Bereich', saison: 'Saison', format: 'Format', herkunft: 'Herkunft', alle: 'Alle',
  b_zimmer: 'Zimmer', b_essen: 'Essen & Trinken', b_dach: 'Dachterrasse', b_halle: 'Halle & Bar', b_garten: 'Wellness & Garten', b_saele: 'Säle', b_feiern: 'Feiern', b_team: 'Team', b_region: 'Region', b_haus: 'Haus',
  s_sommer: 'Sommer', s_winter: 'Winter', s_jahr: 'Ganzjährig', f_hoch: 'Hochformat', f_quer: 'Querformat', f_quadrat: 'Quadrat',
  h_haus: 'Fotos des Hauses', h_frei: 'Frei lizenziert', h_ki: 'Mit KI erzeugt', h_partner: 'Von Partnern',
  im_titel: 'In L’Imprimerie gestalten', im_beitrag: 'Als Instagram-Beitrag', im_story: 'Als Story', im_satz: 'Öffnet L’Imprimerie mit diesem Foto und Ihrem Ausschnitt, fünf Entwürfe zur Wahl.',
  treffer: '{0} von {1} Fotos', keine: 'Kein Foto passt. Ein Filter weniger hilft.', mehr: 'Mehr zeigen', zuruecksetzen: 'Filter zurücksetzen',
  ki: 'KI', ki_lang: 'Mit KI erzeugt', ki_satz: 'Dieses Bild ist mit KI erzeugt und zeigt kein echtes Gericht, Getränk oder Kissen des Hauses. Für Werbung nur mit diesem Hinweis oder nach einem echten Foto.',
  partner_satz: 'Dieses Foto stammt vom Partnerbetrieb. Für Werbung des Hauses vorher dessen Einverständnis holen.',
  ue_satz: 'Licht und Schärfe sind mit KI überarbeitet, der Inhalt ist das echte Foto.', archiv: 'Aus dem Archiv. Nicht einfärben, nicht überarbeiten.',
  quelle: 'Quelle', original: 'Original', laden: 'Laden', grossen: 'Grössen', ausschnitt: 'Ausschnitt: das Feld im Bild ziehen.',
  g_instagram: 'Instagram-Beitrag', g_story: 'Story', g_web: 'Website', g_druck: 'Druck',
  i_instagram: '1080 × 1350, JPG', i_story: '1080 × 1920, JPG', i_web: 'längste Seite 2000 px, JPG', i_druck: 'volle Auflösung, {0} × {1}, JPG', i_druck_web: 'in Website-Grösse (Original nicht hinterlegt), JPG',
  ohne_server: 'Fertige Grössen brauchen den Server-Teil von Le Livre (server.py). Ohne ihn lädt der Knopf das Foto in Website-Grösse.',
  vn_vorher: 'Vorher', vn_nachher: 'Nachher', vn_schieber: 'Schieber', vn_t_vorher: 'Vorher · so geliefert', vn_t_nachher: 'Nachher · nachgeschärft', vn_t_schieber: 'Vorher links · nachher rechts',
  vn_hilfe: 'Mit «Vorher» sehen Sie das Foto, wie das Haus es geliefert hat.', vn_orig: 'Original laden',
  d_titel: 'Logo & Dateien', d_satz: 'Alles, was eine Agentur oder eine Druckerei braucht. SVG bleibt in jeder Grösse scharf, PNG hat einen durchsichtigen Grund.',
  d_logo: 'Logo', d_logo_s: 'Das CE über dem Namen. Die Hauptform, mit Schutzraum rundum.', d_quer: 'Querform', d_quer_s: 'Für Leisten, Briefköpfe und Fusszeilen.',
  d_zeichen: 'Zeichen', d_zeichen_s: 'Das CE allein: Siegel, Stempel, Profilbild. In Gold mit Relief, Gold, Taupe, Marine, Weiss oder dem Blau des Logos.',
  d_wort: 'Wortmarke', d_wort_s: 'Der Name mit «Hotels & Restaurants & More», ohne Zeichen.', d_tapete: 'Tapete', d_tapete_s: 'Das Muster der Website als Kachel, hell, creme und für die Nacht.',
  d_farben: 'Farben', d_farben_s: 'Ein Klick kopiert den Wert. Gold zeichnet und schreibt nie den Lesetext, das Rot der Kaminbar bleibt im Foto. An vier Stellen glänzt das Gold als Verlauf, wie im Logo.', verlauf: 'Verlauf, wie im Logo', d_schriften: 'Schriften',
  d_schriften_s: 'Vier Schriften, frei lizenziert. Für die Website als WOFF2, für Druck und Programme als ZIP mit Hinweisen.',
  hell: 'für helle Flächen', dunkel: 'für dunkle Flächen', creme: 'für Creme', original_g: 'Original aus dem Logo', kopiert: 'Kopiert', regeln: 'Regeln im Markenbuch',
  v_relief: 'Gold mit Relief', v_gold: 'Gold', v_taupe: 'Taupe', v_marine: 'Marine', v_weiss: 'Weiss', v_blau: 'Blau des Logos', v_tinte: 'Tinte', v_original: 'Original',
  r_schrift: { a: 'Grosse Zeilen, Titel', n: 'Der Name im Auftakt', o: 'Ortszeile', s: 'Lesetext und Knöpfe' },
  p_titel: 'Markenprüfung', p_satz: 'Laden Sie einen Entwurf hoch, etwa ein Plakat, einen Beitrag oder den Flyer einer Agentur. Die Farben werden gemessen, Bild, Schrift, Zeichen und Ton beurteilt Claude.',
  p_feld: 'Entwurf hierher ziehen', p_feld2: 'oder wählen · Bild oder PDF, bis 30 MB', p_waehlen: 'Datei wählen', p_pruefen: 'Prüfen', p_beispiel: 'Beispiel ansehen', p_beispiel_ki: 'Beispiel: Die Farben Ihres Entwurfs sind gemessen. Schrift, Zeichen, Bild und Ton stehen hier als Beispiel, so wie die Prüfung sie im Betrieb beurteilt.', p_beispiel_h: 'Beispiel: Dieser Entwurf ist eigens gebaut, so wie ihn eine Agentur schicken könnte. Die Rückmeldung stammt unverändert von der Prüfung.',
  p_beispiel_hand: 'Beispiel: Dieser Entwurf ist eigens gebaut, so wie ihn eine Agentur schicken könnte. Die Farben sind wirklich gemessen; die Rückmeldung dazu ist für dieses Beispiel von Hand geschrieben, weil die Prüfung mit Claude gerade nicht zur Verfügung steht. Die echte Prüfung antwortet im selben Aufbau.',
  p_privat: 'Nichts wird gespeichert. Der Entwurf geht nur für die Prüfung an den Server und an Claude und ist danach weg.',
  p_schritt1: 'Farben messen', p_schritt2: 'Entwurf ansehen', p_schritt3: 'Rückmeldung schreiben', p_dauer: 'Das dauert meist eine halbe Minute.',
  p_gesamt: 'Insgesamt', p_punkte: 'Punkt für Punkt', p_farben: 'Gemessene Farben', p_farben_s: 'Ohne KI gemessen, gegen die Palette des Hauses. Fotos im Entwurf zählen mit.',
  p_rahmen: '{0} % der Fläche in den Farben des Hauses', p_ton: 'Im Ton des Hauses', p_neu: 'Neuen Entwurf prüfen', p_sichern: 'Ergebnis sichern', p_kopie: 'Als Text kopieren',
  p_gleich: 'gleich', p_nah: 'nah', p_fremd: 'fremd', p_naechste: 'nächste Hausfarbe', p_schwarz: 'Reines Schwarz auf {0} % der Fläche. Geschrieben wird in Tinte #0C1526.',
  p_rot: 'Das Rot der Kaminbar auf {0} % der Fläche. Es bleibt im Foto und ist kein Ton der Marke.',
  u_passt: 'passt', u_achten: 'achten', u_passt_nicht: 'passt nicht',
  ber: { farben: 'Farben', schrift: 'Schrift', zeichen: 'Zeichen', abstand: 'Abstand', bild: 'Bild', ton: 'Ton' },
  p_ki_fehler: 'Die Beurteilung durch Claude war gerade nicht möglich ({0}). Die Messung der Farben steht unten.', p_fehler: 'Die Prüfung ging nicht durch',
  p_seiten: '{0} Seiten, geprüft die ersten {1}', p_text: 'Gelesener Text', fehler_verb: 'Der Server-Teil von Le Livre antwortet nicht. Läuft server.py?',
  schliessen: 'Schliessen', fehler_json: 'livre.json fehlt.',
  p_typ: 'Diese Datei ist kein Bild und keine PDF. Erlaubt sind JPG, PNG, WebP und PDF.', p_gross: 'Die Datei ist grösser als 30 MB.', p_pdf_online: 'Online geht eine PDF bis 3 MB. Bitte kleiner speichern oder die erste Seite als Bild prüfen.', p_offline: 'Keine Verbindung. Der Entwurf bleibt gewählt, bitte noch einmal prüfen, sobald das Netz wieder da ist.', fehler_code: 'Der Server antwortete mit Fehler {0}.',
  tuer_t: 'Le Livre startet nicht.', tuer_neu: 'Neu laden', tuer_hilfe: 'Hilft das nicht: die Anleitung öffnen oder Tasty Studios Bescheid geben.'
},
en: {
  unter: 'Brand · Carlton-Europe', start: 'Overview', arbeiten: 'Work', nachschlagen: 'Reference', bilder: 'Photo archive', dateien: 'Logo & files', pruefung: 'Brand check', buch: 'Brand book',
  anleitung: 'Guide', maison: 'La Maison', website: 'View website', sprache: 'Language',
  morgen: 'Good morning.', tag: 'Good afternoon.', abend: 'Good evening.', frage: 'What do you need today?',
  start_satz: 'Le Livre is the hotel’s brand to work with: every photo in ready-made sizes for Instagram, the website and print, monogram, logo, wallpaper and colours as files, and a check for drafts from agencies and from within the hotel.',
  k_bilder: 'All photos of the hotel, by area, season and format. Every photo as a post, a story, for the website or for print.',
  k_dateien: 'Monogram, logo and wordmark for light and dark surfaces, the wallpaper and the colour values to copy.',
  k_pruefung: 'A draft as an image or PDF. Le Livre says what suits the hotel and what does not, point by point.',
  k_buch: 'Monogram, colours and where they come from, typefaces, wallpaper and the rules behind every design.',
  oeffnen: 'Open', lesen: 'Read',
  ue_kurz: 'sharpened', z_haus: 'photos of the hotel', z_frei: 'freely licensed', z_ki: 'created with AI', z_partner: 'from partners', z_dateien: 'files',
  stand: '{0} photos · {1} files',
  recht_t: 'Image rights', recht: 'The photos belong to the Carlton-Europe Interlaken and its photographers. Freely licensed photos only with the stated name and licence, photos from partners only with their consent. Images created with AI are marked and do not show real dishes of the hotel.',
  alles_zip: 'All files (ZIP)',
  b_titel: 'Photo archive', b_satz: 'Click a photo to open it. There you download it in the size you need and, for posts and stories, choose the crop.',
  suchen: 'Search, for example «roof terrace» or «fireplace»', bereich: 'Area', saison: 'Season', format: 'Format', herkunft: 'Source', alle: 'All',
  b_zimmer: 'Rooms', b_essen: 'Food & drink', b_dach: 'Roof terrace', b_halle: 'Lobby & bar', b_garten: 'Wellness & garden', b_saele: 'Halls', b_feiern: 'Celebrations', b_team: 'Team', b_region: 'Region', b_haus: 'Hotel',
  s_sommer: 'Summer', s_winter: 'Winter', s_jahr: 'All year', f_hoch: 'Portrait', f_quer: 'Landscape', f_quadrat: 'Square',
  h_haus: 'Photos of the hotel', h_frei: 'Freely licensed', h_ki: 'Created with AI', h_partner: 'From partners',
  im_titel: 'Design in L’Imprimerie', im_beitrag: 'As Instagram post', im_story: 'As story', im_satz: 'Opens L’Imprimerie with this photo and your crop, five drafts to choose from.',
  treffer: '{0} of {1} photos', keine: 'No photo matches. Try one filter less.', mehr: 'Show more', zuruecksetzen: 'Reset filters',
  ki: 'AI', ki_lang: 'Created with AI', ki_satz: 'This image was created with AI and does not show a real dish, drink or pillow of the hotel. Use it in advertising only with this note, or replace it with a real photo.',
  partner_satz: 'This photo comes from the partner business. Get their consent before using it in the hotel’s advertising.',
  ue_satz: 'Light and sharpness were retouched with AI; the content is the real photo.', archiv: 'From the archive. Do not colour or retouch.',
  quelle: 'Source', original: 'Original', laden: 'Download', grossen: 'Sizes', ausschnitt: 'Crop: drag the frame in the picture.',
  g_instagram: 'Instagram post', g_story: 'Story', g_web: 'Website', g_druck: 'Print',
  i_instagram: '1080 × 1350, JPG', i_story: '1080 × 1920, JPG', i_web: 'longest side 2000 px, JPG', i_druck: 'full resolution, {0} × {1}, JPG', i_druck_web: 'website size (original not on file), JPG',
  ohne_server: 'Ready-made sizes need the server part of Le Livre (server.py). Without it the button downloads the photo in website size.',
  vn_vorher: 'Before', vn_nachher: 'After', vn_schieber: 'Slider', vn_t_vorher: 'Before · as delivered', vn_t_nachher: 'After · sharpened', vn_t_schieber: 'Before left · after right',
  vn_hilfe: 'With «Before» you see the photo as the hotel delivered it.', vn_orig: 'Download original',
  d_titel: 'Logo & files', d_satz: 'Everything an agency or a printer needs. SVG stays sharp at any size, PNG has a transparent background.',
  d_logo: 'Logo', d_logo_s: 'The CE above the name. The main form, with clear space all round.', d_quer: 'Horizontal form', d_quer_s: 'For bars, letterheads and footers.',
  d_zeichen: 'Monogram', d_zeichen_s: 'The CE on its own: seal, stamp, profile picture. In gold with relief, gold, taupe, navy, white or the blue of the logo.',
  d_wort: 'Wordmark', d_wort_s: 'The name with «Hotels & Restaurants & More», without the monogram.', d_tapete: 'Wallpaper', d_tapete_s: 'The website’s pattern as a tile, light, cream and for the night.',
  d_farben: 'Colours', d_farben_s: 'Click to copy the value. Gold draws and never writes body text; the red of the fireplace bar stays in the photo. In four places the gold shines as a gradient, as in the logo.', verlauf: 'Gradient, as in the logo', d_schriften: 'Typefaces',
  d_schriften_s: 'Four typefaces, freely licensed. For the website as WOFF2, for print and software as a ZIP with notes.',
  hell: 'for light surfaces', dunkel: 'for dark surfaces', creme: 'for cream', original_g: 'Original from the logo', kopiert: 'Copied', regeln: 'Rules in the brand book',
  v_relief: 'Gold with relief', v_gold: 'Gold', v_taupe: 'Taupe', v_marine: 'Navy', v_weiss: 'White', v_blau: 'Blue of the logo', v_tinte: 'Ink', v_original: 'Original',
  r_schrift: { a: 'Large lines, titles', n: 'The name in the opening', o: 'Place line', s: 'Body text and buttons' },
  p_titel: 'Brand check', p_satz: 'Upload a draft, such as a poster, a post or an agency flyer. The colours are measured; Claude assesses image, type, monogram and tone.',
  p_feld: 'Drag a draft here', p_feld2: 'or choose · image or PDF, up to 30 MB', p_waehlen: 'Choose file', p_pruefen: 'Check', p_beispiel: 'See an example', p_beispiel_ki: 'Example: the colours of your draft are measured. Type, mark, picture and tone are shown here as an example of how the check assesses them in daily use.', p_beispiel_h: 'Example: this draft was made on purpose, the way an agency might send it. The feedback is the unchanged result of the check, in German.',
  p_beispiel_hand: 'Example: this draft was made on purpose, the way an agency might send it. The colours are really measured; the feedback is written by hand for this example because the check with Claude is not available right now. The real check answers in the same layout, in German.',
  p_privat: 'Nothing is stored. The draft goes to the server and to Claude only for the check and is gone afterwards.',
  p_schritt1: 'Measuring colours', p_schritt2: 'Looking at the draft', p_schritt3: 'Writing feedback', p_dauer: 'This usually takes about half a minute.',
  p_gesamt: 'Overall', p_punkte: 'Point by point', p_farben: 'Measured colours', p_farben_s: 'Measured without AI, against the hotel’s palette. Photos in the draft count too.',
  p_rahmen: '{0} % of the surface in the hotel’s colours', p_ton: 'In the hotel’s tone', p_neu: 'Check a new draft', p_sichern: 'Save result', p_kopie: 'Copy as text',
  p_gleich: 'same', p_nah: 'close', p_fremd: 'foreign', p_naechste: 'nearest house colour', p_schwarz: 'Pure black on {0} % of the surface. Text is set in ink #0C1526.',
  p_rot: 'The red of the fireplace bar on {0} % of the surface. It stays in the photo and is not a brand colour.',
  u_passt: 'fits', u_achten: 'check', u_passt_nicht: 'does not fit',
  ber: { farben: 'Colours', schrift: 'Type', zeichen: 'Monogram', abstand: 'Spacing', bild: 'Image', ton: 'Tone' },
  p_ki_fehler: 'Claude’s assessment was not possible just now ({0}). The colour measurement is below.', p_fehler: 'The check did not go through',
  p_seiten: '{0} pages, the first {1} checked', p_text: 'Text read', fehler_verb: 'The server part of Le Livre is not answering. Is server.py running?',
  schliessen: 'Close', fehler_json: 'livre.json is missing.',
  p_typ: 'This file is neither an image nor a PDF. Allowed are JPG, PNG, WebP and PDF.', p_gross: 'The file is larger than 30 MB.', p_pdf_online: 'Online, a PDF can be up to 3 MB. Please save it smaller or check the first page as an image.', p_offline: 'No connection. The draft stays selected; please check again once the network is back.', fehler_code: 'The server answered with error {0}.',
  tuer_t: 'Le Livre does not start.', tuer_neu: 'Reload', tuer_hilfe: 'If that does not help: open the guide or let Tasty Studios know.'
},
fr: {
  unter: 'Marque · Carlton-Europe', start: 'Aperçu', arbeiten: 'Travailler', nachschlagen: 'Consulter', bilder: 'Photothèque', dateien: 'Logo & fichiers', pruefung: 'Contrôle de marque', buch: 'Charte',
  anleitung: 'Guide', maison: 'La Maison', website: 'Voir le site', sprache: 'Langue',
  morgen: 'Bonjour.', tag: 'Bonjour.', abend: 'Bonsoir.', frage: 'De quoi avez-vous besoin aujourd’hui ?',
  start_satz: 'Le Livre est la marque de l’hôtel pour travailler : toutes les photos en formats prêts pour Instagram, le site et l’impression, le monogramme, le logo, la tapisserie et les couleurs en fichiers, et un contrôle des projets d’agences et de l’hôtel.',
  k_bilder: 'Toutes les photos de l’hôtel, par espace, saison et format. Chaque photo en publication, en story, pour le site ou l’impression.',
  k_dateien: 'Monogramme, logo et logotype pour fonds clairs et foncés, la tapisserie et les valeurs de couleur à copier.',
  k_pruefung: 'Un projet en image ou en PDF. Le Livre indique ce qui convient à l’hôtel et ce qui ne convient pas, point par point.',
  k_buch: 'Monogramme, couleurs et leur origine, typographies, tapisserie et les règles de toute création.',
  oeffnen: 'Ouvrir', lesen: 'Lire',
  ue_kurz: 'retouchées', z_haus: 'photos de l’hôtel', z_frei: 'sous licence libre', z_ki: 'créées par IA', z_partner: 'de partenaires', z_dateien: 'fichiers',
  stand: '{0} photos · {1} fichiers',
  recht_t: 'Droits des images', recht: 'Les photos appartiennent au Carlton-Europe Interlaken et à ses photographes. Photos sous licence libre uniquement avec le nom et la licence indiqués, photos de partenaires seulement avec leur accord. Les images créées par IA sont signalées et ne montrent pas de vrais plats de l’hôtel.',
  alles_zip: 'Tous les fichiers (ZIP)',
  b_titel: 'Photothèque', b_satz: 'Un clic sur une photo l’ouvre. Vous la téléchargez dans le format voulu et choisissez le cadrage pour les publications et les stories.',
  suchen: 'Rechercher, par exemple «toit-terrasse» ou «cheminée»', bereich: 'Espace', saison: 'Saison', format: 'Format', herkunft: 'Origine', alle: 'Toutes',
  b_zimmer: 'Chambres', b_essen: 'Restauration', b_dach: 'Toit-terrasse', b_halle: 'Hall & bar', b_garten: 'Bien-être & jardin', b_saele: 'Salles', b_feiern: 'Fêtes', b_team: 'Équipe', b_region: 'Région', b_haus: 'Hôtel',
  s_sommer: 'Été', s_winter: 'Hiver', s_jahr: 'Toute l’année', f_hoch: 'Portrait', f_quer: 'Paysage', f_quadrat: 'Carré',
  h_haus: 'Photos de l’hôtel', h_frei: 'Licence libre', h_ki: 'Créées par IA', h_partner: 'De partenaires',
  im_titel: 'Mettre en forme dans L’Imprimerie', im_beitrag: 'En publication Instagram', im_story: 'En story', im_satz: 'Ouvre L’Imprimerie avec cette photo et votre cadrage, cinq projets au choix.',
  treffer: '{0} sur {1} photos', keine: 'Aucune photo ne correspond. Un filtre de moins aidera.', mehr: 'Afficher plus', zuruecksetzen: 'Réinitialiser les filtres',
  ki: 'IA', ki_lang: 'Créée par IA', ki_satz: 'Cette image a été créée par IA et ne montre pas un vrai plat, une vraie boisson ou un vrai oreiller de l’hôtel. En publicité, seulement avec cette mention ou remplacée par une vraie photo.',
  partner_satz: 'Cette photo vient de l’établissement partenaire. Pour la publicité de l’hôtel, demandez d’abord son accord.',
  ue_satz: 'Lumière et netteté retouchées par IA ; le contenu est la vraie photo.', archiv: 'Archives. Ne pas coloriser, ne pas retoucher.',
  quelle: 'Source', original: 'Original', laden: 'Télécharger', grossen: 'Formats', ausschnitt: 'Cadrage : faites glisser le cadre dans l’image.',
  g_instagram: 'Publication Instagram', g_story: 'Story', g_web: 'Site web', g_druck: 'Impression',
  i_instagram: '1080 × 1350, JPG', i_story: '1080 × 1920, JPG', i_web: 'plus grand côté 2000 px, JPG', i_druck: 'pleine résolution, {0} × {1}, JPG', i_druck_web: 'taille du site (original non disponible), JPG',
  ohne_server: 'Les formats prêts nécessitent la partie serveur du Livre (server.py). Sans elle, le bouton télécharge la photo au format du site.',
  vn_vorher: 'Avant', vn_nachher: 'Après', vn_schieber: 'Curseur', vn_t_vorher: 'Avant · tel que livré', vn_t_nachher: 'Après · netteté améliorée', vn_t_schieber: 'Avant à gauche · après à droite',
  vn_hilfe: 'Avec «Avant», vous voyez la photo telle que l’hôtel l’a livrée.', vn_orig: 'Télécharger l’original',
  d_titel: 'Logo & fichiers', d_satz: 'Tout ce dont une agence ou un imprimeur a besoin. Le SVG reste net à toute taille, le PNG a un fond transparent.',
  d_logo: 'Logo', d_logo_s: 'Le CE au-dessus du nom. La forme principale, avec sa zone de protection.', d_quer: 'Forme horizontale', d_quer_s: 'Pour bandeaux, en-têtes et pieds de page.',
  d_zeichen: 'Monogramme', d_zeichen_s: 'Le CE seul : sceau, tampon, photo de profil. En or avec relief, or, taupe, marine, blanc ou le bleu du logo.',
  d_wort: 'Logotype', d_wort_s: 'Le nom avec «Hotels & Restaurants & More», sans le monogramme.', d_tapete: 'Tapisserie', d_tapete_s: 'Le motif du site en carreau, clair, crème et pour la nuit.',
  d_farben: 'Couleurs', d_farben_s: 'Un clic copie la valeur. L’or dessine et n’écrit jamais le texte courant ; le rouge du bar à la cheminée reste dans la photo. À quatre endroits, l’or brille en dégradé, comme dans le logo.', verlauf: 'Dégradé, comme dans le logo', d_schriften: 'Typographies',
  d_schriften_s: 'Quatre typographies sous licence libre. Pour le site en WOFF2, pour l’impression et les logiciels en ZIP avec notes.',
  hell: 'pour fonds clairs', dunkel: 'pour fonds foncés', creme: 'pour crème', original_g: 'Original du logo', kopiert: 'Copié', regeln: 'Règles dans la charte',
  v_relief: 'Or avec relief', v_gold: 'Or', v_taupe: 'Taupe', v_marine: 'Marine', v_weiss: 'Blanc', v_blau: 'Bleu du logo', v_tinte: 'Encre', v_original: 'Original',
  r_schrift: { a: 'Grandes lignes, titres', n: 'Le nom à l’ouverture', o: 'Ligne du lieu', s: 'Texte courant et boutons' },
  p_titel: 'Contrôle de marque', p_satz: 'Téléchargez un projet, par exemple une affiche, une publication ou le flyer d’une agence. Les couleurs sont mesurées ; Claude évalue l’image, la typographie, le monogramme et le ton.',
  p_feld: 'Glissez un projet ici', p_feld2: 'ou choisissez · image ou PDF, jusqu’à 30 Mo', p_waehlen: 'Choisir un fichier', p_pruefen: 'Contrôler', p_beispiel: 'Voir un exemple', p_beispiel_ki: 'Exemple : les couleurs de votre projet sont mesurées. Police, signe, image et ton figurent ici à titre d’exemple, tels que le contrôle les évalue au quotidien.', p_beispiel_h: 'Exemple : ce projet a été conçu exprès, tel qu’une agence pourrait l’envoyer. Le retour est le résultat inchangé du contrôle, en allemand.',
  p_beispiel_hand: 'Exemple : ce projet a été conçu exprès, tel qu’une agence pourrait l’envoyer. Les couleurs sont réellement mesurées ; le retour est écrit à la main pour cet exemple, car le contrôle avec Claude n’est pas disponible pour le moment. Le vrai contrôle répond dans la même présentation, en allemand.',
  p_privat: 'Rien n’est enregistré. Le projet part au serveur et à Claude uniquement pour le contrôle, puis disparaît.',
  p_schritt1: 'Mesure des couleurs', p_schritt2: 'Examen du projet', p_schritt3: 'Rédaction du retour', p_dauer: 'Cela dure en général une demi-minute.',
  p_gesamt: 'Dans l’ensemble', p_punkte: 'Point par point', p_farben: 'Couleurs mesurées', p_farben_s: 'Mesurées sans IA, par rapport à la palette de l’hôtel. Les photos du projet comptent.',
  p_rahmen: '{0} % de la surface dans les couleurs de l’hôtel', p_ton: 'Dans le ton de l’hôtel', p_neu: 'Contrôler un nouveau projet', p_sichern: 'Enregistrer le résultat', p_kopie: 'Copier en texte',
  p_gleich: 'identique', p_nah: 'proche', p_fremd: 'étrangère', p_naechste: 'couleur de l’hôtel la plus proche', p_schwarz: 'Noir pur sur {0} % de la surface. On écrit en encre #0C1526.',
  p_rot: 'Le rouge du bar à la cheminée sur {0} % de la surface. Il reste dans la photo et n’est pas une couleur de la marque.',
  u_passt: 'convient', u_achten: 'attention', u_passt_nicht: 'ne convient pas',
  ber: { farben: 'Couleurs', schrift: 'Typographie', zeichen: 'Monogramme', abstand: 'Espacement', bild: 'Image', ton: 'Ton' },
  p_ki_fehler: 'L’évaluation par Claude n’a pas été possible ({0}). La mesure des couleurs figure ci-dessous.', p_fehler: 'Le contrôle n’a pas abouti',
  p_seiten: '{0} pages, les {1} premières contrôlées', p_text: 'Texte lu', fehler_verb: 'La partie serveur du Livre ne répond pas. server.py est-il lancé ?',
  schliessen: 'Fermer', fehler_json: 'livre.json est introuvable.',
  p_typ: 'Ce fichier n’est ni une image ni un PDF. Sont acceptés JPG, PNG, WebP et PDF.', p_gross: 'Le fichier dépasse 30 Mo.', p_pdf_online: 'En ligne, un PDF peut peser jusqu’à 3 Mo. Merci de l’enregistrer plus léger ou de contrôler la première page comme image.', p_offline: 'Pas de connexion. Le projet reste sélectionné ; contrôlez à nouveau dès que le réseau est revenu.', fehler_code: 'Le serveur a répondu avec l’erreur {0}.',
  tuer_t: 'Le Livre ne démarre pas.', tuer_neu: 'Recharger', tuer_hilfe: 'Si cela ne suffit pas : ouvrir le guide ou prévenir Tasty Studios.'
}
};
let SP = (() => { try { const q = new URLSearchParams(location.search).get('sprache'); if (q && T[q]) return q; const m = localStorage.getItem('livre-sprache'); return m && T[m] ? m : 'de'; } catch (e) { return 'de'; } })();
const t = (k, ...a) => { let s = (T[SP] && T[SP][k] != null ? T[SP][k] : T.de[k]); if (typeof s === 'string') a.forEach((x, i) => { s = s.split('{' + i + '}').join(x); }); return s; };
const zahl = n => Number(n).toLocaleString(SP === 'de' ? 'de-CH' : SP);

/* ---------------------------------------------------------------- Zustand */
const S = { d: null, server: null, ansicht: 'start', f: { q: '', b: 'alle', s: 'alle', f: 'alle', h: 'alle' }, n: 48, datei: null, lauf: null, ergebnis: null };
const BEREICHE = ['zimmer', 'essen', 'dach', 'halle', 'garten', 'saele', 'feiern', 'team', 'region', 'haus'];
const FORMATE = { instagram: [1080, 1350], story: [1080, 1920] };
const SCHRIFTEN = [['a', 'Libre Baskerville', 'Regular 400', 'libre-baskerville-400.woff2', 'Das Vintage Hotel'], ['n', 'Libre Baskerville', 'Bold 700', 'libre-baskerville-700.woff2', 'CARLTON-EUROPE'],
  ['o', 'Montserrat', 'SemiBold 600', 'montserrat-600-latin.woff2', 'INTERLAKEN · SEIT 1898'], ['s', 'Instrument Sans', '400–600', 'InstrumentSans-normal-400_600.woff2', 'Wunderbar gelegen, nahe dem Bahnhof Interlaken Ost']];

/* ---------------------------------------------------------------- Grundgerüst */
function kopf() {
  const titel = { start: t('start'), bilder: t('bilder'), dateien: t('dateien'), pruefung: t('pruefung') }[S.ansicht];
  const st = S.d ? t('stand', zahl(S.d.stand.fotos), zahl(S.d.stand.dateien)) : '';
  const akt = SPRACHEN.find(x => x[0] === SP);
  $('#kopf').innerHTML = `
    <button class="kopf__marke" type="button" data-gehe="start" aria-label="${esc(t('start'))}"><span class="li-z">${ZEICHEN}</span><span><b>Le Livre</b><small>${esc(t('unter'))}</small></span></button>
    <div class="kopf__mitte"><div class="kopf__titel">${esc(titel)}</div><div class="kopf__stand">${esc(st)}</div></div>
    <div class="kopf__werk">
      <div class="li-sp"><button class="li-sp__k" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="${esc(t('sprache'))}">${esc(akt[1])}<i>${PFEIL}</i></button>
        <ul role="listbox">${SPRACHEN.map(([k, kurz, name]) => `<li><button type="button" role="option" data-sp="${k}" ${k === SP ? 'aria-selected="true"' : ''}><span>${esc(name)}</span><small>${esc(kurz)}</small></button></li>`).join('')}</ul></div>
      <a class="rund" href="anleitung.html" target="_blank" rel="noopener" data-tip="${esc(t('anleitung'))}" aria-label="${esc(t('anleitung'))}">${BUCH}</a>
      <a class="rund" href="../../maison/" data-tip="${esc(t('maison'))}" aria-label="${esc(t('maison'))}">${HAUS}</a>
      <span class="kopf__trenn"></span>
      <a class="kn kn--klein" href="${MARKE}">${esc(t('buch'))}<i>${PF}</i></a>
    </div>`;
  $$('#kopf [data-gehe]').forEach(x => x.onclick = () => gehe(x.dataset.gehe));
  const sp = $('.li-sp'), k = $('.li-sp__k');
  k.onclick = e => { e.stopPropagation(); const o = sp.classList.toggle('offen'); k.setAttribute('aria-expanded', o); };
  $$('[data-sp]', sp).forEach(b => b.onclick = () => wechsle(b.dataset.sp));
}
document.addEventListener('click', () => { const sp = $('.li-sp'); if (sp) { sp.classList.remove('offen'); $('.li-sp__k').setAttribute('aria-expanded', false); } });

function rand() {
  const nw = (key, name, zahl = '') => `<button class="nw" type="button" data-gehe="${key}" ${S.ansicht === key ? 'aria-current="true"' : ''}><span>${esc(name)}</span>${zahl ? `<em>${esc(zahl)}</em>` : ''}</button>`;
  $('#rand').innerHTML = `
    <button class="rand__auf" type="button" aria-expanded="false">Le Livre<i></i></button>
    <nav class="nav" aria-label="Le Livre">
      ${nw('start', t('start'))}
      <p>${esc(t('arbeiten'))}</p>
      ${nw('bilder', t('bilder'), S.d ? zahl(S.d.stand.fotos) : '')}${nw('dateien', t('dateien'), S.d ? zahl(S.d.stand.dateien) : '')}${nw('pruefung', t('pruefung'))}
      <p>${esc(t('nachschlagen'))}</p>
      <a class="nw" href="${MARKE}"><span>${esc(t('buch'))}</span><em>${PF}</em></a>
    </nav>
    <div class="wege">
      <a href="../../maison/">${esc(t('maison'))}${PF}</a>
      <a href="../../index.html" target="_blank" rel="noopener">${esc(t('website'))}${PF}</a>
      <a href="anleitung.html" target="_blank" rel="noopener">${esc(t('anleitung'))}${PF}</a>
    </div>`;
  $$('#rand [data-gehe]').forEach(b => b.onclick = () => { gehe(b.dataset.gehe); $('#rand').classList.remove('auf'); });
  $('#rand .rand__auf').onclick = e => { const auf = $('#rand').classList.toggle('auf'); e.currentTarget.setAttribute('aria-expanded', auf); };
}

function leiste() {
  $('#leiste').innerHTML = `<span class="li-recht__z">${ZEICHEN}</span><div class="leiste__t"><b>${esc(t('recht_t'))}</b><span>${esc(t('recht'))}</span></div>
    <a class="kn kn--klein kn--gold" href="${DAT}carlton-europe-marke.zip" download>${esc(t('alles_zip'))}<i>${PU}</i></a>`;
}

function gehe(a) {
  S.ansicht = a;
  try { localStorage.setItem('livre-ansicht', a); } catch (e) { /* privat */ }
  history.replaceState(null, '', '#' + a);
  kopf(); rand(); zeichne();
  scrollTo({ top: 0 });
}
function wechsle(sp) {
  SP = sp;
  try { localStorage.setItem('livre-sprache', sp); } catch (e) { /* privat */ }
  document.documentElement.lang = sp === 'de' ? 'de-CH' : sp;
  kopf(); rand(); leiste(); zeichne(true);
}

/* Kopf einer Ansicht: Bühne mit Foto des Hauses, goldenes CE, Titel fährt aus der Maske (nur im Carlton, Regel 55) */
function titel(ansicht, mono, h1, satz, kn = '', stats = []) {
  const z = h1.map((x, i) => `<span class="li-zz"><span>${i === h1.length - 1 && h1.length > 1 ? '<em>' + esc(x) + '</em>' : esc(x)}</span></span>`).join('');
  return `<header class="titel li-hero" data-r style="--bild:url(hero-${ansicht}.webp)"><div class="li-hero__b" aria-hidden="true"></div>
    <div class="li-hero__t"><span class="li-hero__ce">${ZEICHEN}</span><h1>${z}</h1>${satz ? `<p class="satz">${esc(satz)}</p>` : ''}${kn ? `<div class="titel__kn">${kn}</div>` : ''}</div>
    ${stats.length ? `<ul class="li-hero__s">${stats.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul>` : ''}</header>`;
}
function teile(s) { const i = s.lastIndexOf(' '); return i > 0 ? [s.slice(0, i), s.slice(i + 1)] : [s]; }

function zeichne(still = false) {
  const el = $('#ansicht');
  const a = S.ansicht;
  el.innerHTML = a === 'bilder' ? bilder() : a === 'dateien' ? dateien() : a === 'pruefung' ? pruefung() : start();
  if (a === 'bilder') bilderLeben(); else if (a === 'dateien') dateienLeben(); else if (a === 'pruefung') pruefungLeben(); else startLeben();
  auftritte(el, still);
}

/* Auftritte: federnd hereinschweben, sobald im Bild (nur transform und opacity) */
let IO = null, IO2 = null;
function auftritte(r, still) {
  const alle = $$('[data-r]', r).filter(x => !x.classList.contains('da'));   // schon Eingeblendetes bleibt stehen
  if (still || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { alle.forEach(x => x.classList.add('da')); return; }
  if (!IO) IO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('da'); IO.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: .01 });
  /* Kacheln des Bildarchivs: schon ein Stück vor dem Bild einblenden, damit beim Scrollen keine leeren Flächen stehen */
  if (!IO2) IO2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('da'); IO2.unobserve(e.target); } }), { rootMargin: '0px 0px 320px 0px', threshold: 0 });
  alle.forEach(x => (x.classList.contains('li-f') ? IO2 : IO).observe(x));
}

/* ---------------------------------------------------------------- Übersicht */
function start() {
  const h = new Date().getHours();
  const gruss = h >= 5 && h < 11 ? t('morgen') : h >= 11 && h < 18 ? t('tag') : t('abend');
  const st = S.d.stand;
  const bild = k => `${IMG}${k}.webp`;
  const karte = (ziel, mono, name, satz, inhalt, i) => `<button class="li-k" type="button" data-gehe="${ziel}" data-r style="--i:${i}">
      <span class="li-k__b">${inhalt}</span>
      <span class="li-k__n"><small>${esc(mono)}</small><b>${esc(name)}</b><span>${esc(satz)}</span><i class="li-k__p">${PF}</i></span></button>`;
  return `${titel('start', 'Le Livre · Carlton-Europe', [gruss, t('frage')], t('start_satz'), '', [[zahl(st.fotos), t('bilder')], [zahl(st.dateien), t('z_dateien')], ['ΔE', t('pruefung')]])}
    <div class="li-karten">
      ${karte('bilder', zahl(st.fotos), t('bilder'), t('k_bilder'), `<span class="li-stapel"><img src="${bild('dach-sommer-s')}" alt="" decoding="async"><img src="${bild('kaminbar-s')}" alt="" decoding="async"><img src="${bild('z-superior-s')}" alt="" decoding="async"></span>`, 0)}
      ${karte('dateien', zahl(st.dateien), t('dateien'), t('k_dateien'), `<span class="li-logo tapete-d"><img src="${DAT}logo-dunkel.svg" alt="" decoding="async"></span>`, 1)}
      ${karte('pruefung', 'ΔE · Claude', t('pruefung'), t('k_pruefung'), `<span class="li-pr-bild"><span class="li-pr-f">${S.d.farben.slice(0, 9).map(x => `<i style="background:${x.h}"></i>`).join('')}</span><span class="li-pr-de"><b>ΔE</b><small>2000</small></span></span>`, 2)}
    </div>
    <div class="platte li-zahlen" data-r>
      <div><b>${zahl(st.haus)}</b><span>${esc(t('z_haus'))}</span></div>
      <div><b>${zahl(st.frei)}</b><span>${esc(t('z_frei'))}</span></div>
      <div><b>${zahl(st.ki)}</b><span>${esc(t('z_ki'))}</span></div>
      <div><b>${zahl(st.dateien)}</b><span>${esc(t('z_dateien'))}</span></div>
    </div>
    <a class="platte li-buch" href="${MARKE}" data-r>
      <span class="li-buch__b"><img src="${bild('halle-s')}" alt="" loading="lazy" decoding="async"></span>
      <span class="li-buch__t"><small class="mono">${esc(t('nachschlagen'))}</small><b>${esc(t('buch'))}</b><span>${esc(t('k_buch'))}</span></span>
      <span class="kn">${esc(t('lesen'))}<i>${PF}</i></span>
    </a>`;
}
function startLeben() { $$('#ansicht [data-gehe]').forEach(b => b.onclick = () => gehe(b.dataset.gehe)); }

/* ---------------------------------------------------------------- Bildarchiv */
function titelVon(f) { return (f.t && (f.t[SP] || f.t.de)) || f.k; }
function gefiltert() {
  const F = S.f, q = F.q.trim().toLowerCase();
  return S.d.fotos.filter(f => (F.b === 'alle' || f.b === F.b) && (F.s === 'alle' || f.s === F.s) && (F.f === 'alle' || f.f === F.f || (F.f === 'quer' && f.f === 'quadrat'))
    && (F.h === 'alle' || f.art === F.h) && (!q || Object.values(f.t).join(' ').toLowerCase().includes(q) || f.k.includes(q) || t('b_' + f.b).toLowerCase().includes(q)));
}
function wahl(key, werte) {
  return `<div class="li-wahl"><span class="mono">${esc(t(key === 'b' ? 'bereich' : key === 's' ? 'saison' : key === 'f' ? 'format' : 'herkunft'))}</span><div class="wahl2" role="group">
    ${[['alle', t('alle')], ...werte].map(([w, n]) => `<button type="button" data-f="${key}" data-w="${w}" aria-pressed="${S.f[key] === w}">${esc(n)}</button>`).join('')}</div></div>`;
}
function bilder() {
  return `${titel('bilder', t('bilder'), teile(t('b_titel')), t('b_satz'), '', [[zahl(S.d.stand.fotos), t('bilder')], [zahl(S.d.stand.ue), t('ue_kurz') || '↑'], [zahl(BEREICHE.length), t('bereich')]])}
    <div class="platte li-filter" data-r>
      <label class="suche li-suche">${LUPE}<input type="search" id="li-q" value="${esc(S.f.q)}" placeholder="${esc(t('suchen'))}" autocomplete="off"></label>
      ${wahl('b', BEREICHE.map(b => [b, t('b_' + b)]))}
      <div class="li-wahl-reihe">${wahl('s', [['sommer', t('s_sommer')], ['winter', t('s_winter')], ['jahr', t('s_jahr')]])}${wahl('f', [['hoch', t('f_hoch')], ['quer', t('f_quer')]])}</div>
      ${wahl('h', [['haus', t('h_haus')], ['frei', t('h_frei')], ['ki', t('h_ki')], ['partner', t('h_partner')]])}
      <p class="li-treffer"><span id="li-n"></span><button class="link" type="button" id="li-reset">${esc(t('zuruecksetzen'))}</button></p>
    </div>
    <div class="li-raster" id="li-raster"></div>
    <div class="li-mehr" id="li-mehr"></div>`;
}
function kachel(f, i) {
  return `<button class="li-f li-f--${f.f}${f.art === 'ki' ? ' li-f--frei' : ''}" type="button" data-k="${f.k}" data-r style="--i:${i % 6}" aria-label="${esc(titelVon(f))}">
    <img src="${IMG}${f.ft || f.fs}" alt="" loading="lazy" decoding="async">
    ${f.art === 'ki' ? `<span class="li-ki" title="${esc(t('ki_lang'))}">${esc(t('ki'))}</span>` : ''}
    <span class="li-f__n">${esc(titelVon(f))}</span></button>`;
}
function raster(neu = false, mehr = false) {
  const L = gefiltert();
  if (neu) S.n = 48;
  $('#li-n').textContent = t('treffer', zahl(L.length), zahl(S.d.fotos.length));
  const r = $('#li-raster');
  /* Nachladen hängt nur die nächsten Kacheln an; nur bei Filter oder Suche wird das Raster neu aufgebaut. */
  const vor = mehr && !r.querySelector('.li-leer') ? r.children.length : 0;
  if (vor) r.insertAdjacentHTML('beforeend', L.slice(vor, S.n).map((f, i) => kachel(f, vor + i)).join(''));
  else r.innerHTML = L.length ? L.slice(0, S.n).map(kachel).join('') : `<p class="li-leer">${esc(t('keine'))}</p>`;
  $('#li-mehr').innerHTML = L.length > S.n ? `<button class="kn kn--linie" type="button" id="li-mehr-k">${esc(t('mehr'))}<i>${PF}</i></button>` : '';
  if ($('#li-mehr-k')) $('#li-mehr-k').onclick = () => { S.n += 48; raster(false, true); };
  [].slice.call(r.children, vor).forEach(b => { if (b.dataset.k) b.onclick = () => detail(b.dataset.k); });
  auftritte(r);
  if (S.mehrIO) S.mehrIO.disconnect();
  if ($('#li-mehr-k') && 'IntersectionObserver' in window) { S.mehrIO = new IntersectionObserver(es => { if (es[0].isIntersecting) { S.n += 48; raster(false, true); } }, { rootMargin: '600px' }); S.mehrIO.observe($('#li-mehr-k')); }
}
function bilderLeben() {
  raster(true);
  let uhr;
  $('#li-q').oninput = e => { clearTimeout(uhr); uhr = setTimeout(() => { S.f.q = e.target.value; raster(true); }, 160); };
  $$('[data-f]').forEach(b => b.onclick = () => {
    S.f[b.dataset.f] = b.dataset.w;
    $$(`[data-f="${b.dataset.f}"]`).forEach(x => x.setAttribute('aria-pressed', x === b));
    raster(true);
  });
  $('#li-reset').onclick = () => { S.f = { q: '', b: 'alle', s: 'alle', f: 'alle', h: 'alle' }; zeichne(true); };
}

/* Detail: grosses Bild, Herkunft, Grössen, Ausschnitt für Beitrag und Story, bei nachgeschärften Fotos Vorher/Nachher */
function detail(k) {
  const f = S.d.fotos.find(x => x.k === k); if (!f) return;
  const fx = { instagram: { x: .5, y: .5 }, story: { x: .5, y: .5 } };
  let aktiv = 'instagram';
  const imp = g => `${IMPRIMERIE}?foto=${encodeURIComponent(k)}&art=${g === 'story' ? 'story' : 'insta'}&x=${fx[g].x.toFixed(3)}&y=${fx[g].y.toFixed(3)}`;
  const link = g => S.server ? `api/bild?k=${encodeURIComponent(k)}&f=${g}${fx[g] ? `&x=${fx[g].x.toFixed(3)}&y=${fx[g].y.toFixed(3)}` : ''}` : `${IMG}${f.fl}`;
  const zeile = g => `<li class="li-gr" data-g="${g}"><span><b>${esc(t('g_' + g))}</b><small>${esc(g === 'druck' ? (S.nurWeb === true || (S.nurWeb && S.nurWeb.has(k)) ? t('i_druck_web') : t('i_druck', zahl(f.w), zahl(f.h))) : t('i_' + g))}</small></span>
    <a class="kn kn--klein" href="${link(g)}" download data-laden="${g}">${esc(t('laden'))}<i>${PU}</i></a></li>`;
  const art = f.art === 'ki' ? `<p class="li-hinweis li-hinweis--ki"><b>${esc(t('ki_lang'))}</b>${esc(t('ki_satz'))}</p>` : f.art === 'partner' ? `<p class="li-hinweis"><b>${esc(t('h_partner'))}</b>${esc(t('partner_satz'))}</p>` : f.alt ? `<p class="li-hinweis">${esc(t('archiv'))}</p>` : f.ue ? `<p class="li-hinweis li-hinweis--leise">${esc(t('ue_satz'))}${f.vn ? ' ' + esc(t('vn_hilfe')) : ''}</p>` : '';
  const vn = f.vn ? `<img class="li-vn__v" src="${ORIG}${esc(k)}.webp" alt="" decoding="async" draggable="false"><span class="li-vn__gr"><i><svg viewBox="0 0 20 12" width="20" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 1 1 6l5 5M14 1l5 5-5 5"/></svg></i></span><span class="li-vn__t" id="li-vnt">${esc(t('vn_t_nachher'))}</span>
      <div class="li-vn__bar" role="group" aria-label="${esc(t('vn_vorher') + ' / ' + t('vn_nachher'))}"><button type="button" data-vn="vorher" aria-pressed="false">${esc(t('vn_vorher'))}</button><button type="button" data-vn="nachher" aria-pressed="true">${esc(t('vn_nachher'))}</button><button type="button" data-vn="schieber" aria-pressed="false">${esc(t('vn_schieber'))}</button></div>` : '';
  fenster(`<div class="li-det">
    <div class="li-det__b"><div class="li-det__bild" id="li-bild" data-m="nachher"><img src="${IMG}${f.fl}" alt="${esc(titelVon(f))}" decoding="async" draggable="false"><span class="li-rahmen" id="li-rahmen" hidden></span>${vn}</div>
      <p class="leise li-det__hilfe">${esc(t('ausschnitt'))}</p></div>
    <div class="li-det__t">
      <p class="mono">${esc(t('b_' + f.b))} · ${esc(t('s_' + f.s))} · ${esc(t('f_' + f.f))}</p>
      <h2>${esc(titelVon(f))}</h2>
      ${art}
      <dl class="li-meta"><dt>${esc(t('quelle'))}</dt><dd>${esc(f.q)}</dd><dt>${esc(t('original'))}</dt><dd>${zahl(f.w)} × ${zahl(f.h)} px</dd></dl>
      <p class="mono li-det__gr">${esc(t('grossen'))}</p>
      <ul class="li-grl">${['instagram', 'story', 'web', 'druck'].map(zeile).join('')}</ul>
      ${f.vn ? `<p class="li-orig"><a class="kn kn--klein kn--linie" href="${ORIG}${esc(k)}.webp" download>${esc(t('vn_orig'))}<i>${PU}</i></a></p>` : ''}
      ${S.server ? '' : `<p class="leise">${esc(t('ohne_server'))}</p>`}
      <div class="li-imp"><p class="mono li-det__gr">${esc(t('im_titel'))}</p>
        <div class="li-imp__k"><a class="kn kn--klein" data-imp="instagram" href="${imp('instagram')}" target="_blank" rel="noopener">${esc(t('im_beitrag'))}<i>${PF}</i></a><a class="kn kn--klein kn--linie" data-imp="story" href="${imp('story')}" target="_blank" rel="noopener">${esc(t('im_story'))}<i>${PF}</i></a></div>
        <p class="leise">${esc(t('im_satz'))}</p></div>
    </div></div>`);
  const bildEl = $('#li-bild'), rahmen = $('#li-rahmen'), img = $('img', bildEl);
  function setze() {
    const g = FORMATE[aktiv];
    if (!img.naturalWidth) { rahmen.hidden = true; return; }
    /* Website und Druck haben keinen Ausschnitt: der Rahmen zeigt das ganze Bild */
    const W = bildEl.clientWidth, H = bildEl.clientHeight, ziel = g ? g[0] / g[1] : W / H;
    let w = W, h = H;
    if (W / H > ziel) w = H * ziel; else h = W / ziel;
    const p = fx[aktiv] || { x: .5, y: .5 };
    rahmen.classList.toggle('li-rahmen--ganz', !g);
    rahmen.style.width = w + 'px'; rahmen.style.height = h + 'px';
    rahmen.style.transform = `translate(${(W - w) * p.x}px,${(H - h) * p.y}px)`;
    /* Jede Grösse sichtbar machen: Masse im Schild, Rahmen leicht nach innen, wenn er fast das ganze Bild deckt, und ein kurzes Aufleuchten bei jedem Wechsel */
    const lang = 2000, sk = Math.min(1, lang / Math.max(f.w, f.h)), masse = g ? `${g[0]} × ${g[1]}` : aktiv === 'web' ? `${Math.round(f.w * sk)} × ${Math.round(f.h * sk)}` : `${zahl(f.w)} × ${zahl(f.h)}`;
    if (w > W - 6 && h > H - 6) { w -= 12; h -= 12; rahmen.style.transform = `translate(6px,6px)`; }
    rahmen.style.width = w + 'px'; rahmen.style.height = h + 'px';
    rahmen.dataset.g = t('g_' + aktiv) + ' · ' + masse + ' px';
    rahmen.classList.remove('blitz'); void rahmen.offsetWidth; rahmen.classList.add('blitz');
    rahmen.hidden = false;
    $$('[data-laden]').forEach(a => a.href = link(a.dataset.laden));
    $$('[data-imp]').forEach(a => a.href = imp(a.dataset.imp));
  }
  img.complete ? setze() : img.addEventListener('load', setze);
  $$('.li-gr').forEach(li => {
    const an = () => { aktiv = li.dataset.g; $$('.li-gr').forEach(x => x.classList.toggle('an', x === li)); setze(); };
    li.addEventListener('mouseenter', an); li.addEventListener('focusin', an);
  });
  $('.li-gr').classList.add('an');
  // Rahmen ziehen
  let zug = null;
  rahmen.addEventListener('pointerdown', e => { zug = { x: e.clientX, y: e.clientY, p: { ...fx[aktiv] } }; rahmen.setPointerCapture(e.pointerId); rahmen.classList.add('zieht'); });
  rahmen.addEventListener('pointermove', e => {
    if (!zug) return;
    const W = bildEl.clientWidth, H = bildEl.clientHeight, w = rahmen.offsetWidth, h = rahmen.offsetHeight;
    fx[aktiv] = { x: W - w > 1 ? Math.min(1, Math.max(0, zug.p.x + (e.clientX - zug.x) / (W - w))) : .5, y: H - h > 1 ? Math.min(1, Math.max(0, zug.p.y + (e.clientY - zug.y) / (H - h))) : .5 };
    setze();
  });
  const los = () => { zug = null; rahmen.classList.remove('zieht'); };
  rahmen.addEventListener('pointerup', los); rahmen.addEventListener('pointercancel', los);
  addEventListener('resize', setze, { once: true });
  if (f.vn) vorherNachher(bildEl, setze);
}
/* Vorher / Nachher (nur im Carlton, nur bei den nachgeschärften Fotos): Knöpfe unten im Bild, Schieber zieht eine Kante über das Bild */
function vorherNachher(v, setze) {
  function modus(m) {
    v.setAttribute('data-m', m); $('#li-vnt').textContent = t('vn_t_' + m);
    $$('[data-vn]', v).forEach(b => b.setAttribute('aria-pressed', b.dataset.vn === m ? 'true' : 'false'));
    if (m === 'schieber') v.style.setProperty('--p', '50%');
    if (m === 'nachher') setze();
  }
  $$('[data-vn]', v).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); modus(b.dataset.vn); }));
  let zieht = false;
  const hin = e => { const r = v.getBoundingClientRect(); v.style.setProperty('--p', Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)).toFixed(1) + '%'); };
  v.addEventListener('pointerdown', e => { if (v.dataset.m !== 'schieber' || e.target.closest('.li-vn__bar')) return; e.preventDefault(); zieht = true; v.setPointerCapture(e.pointerId); hin(e); });
  v.addEventListener('dragstart', e => e.preventDefault());   // Firefox zog sonst das Foto statt des Schiebers (Prüfung 16.10.2026)
  v.addEventListener('pointermove', e => { if (zieht) hin(e); });
  v.addEventListener('pointerup', () => { zieht = false; });
  v.addEventListener('keydown', e => { if (e.key === 'v' || e.key === 'V') modus(v.dataset.m === 'vorher' ? 'nachher' : 'vorher'); });
}

/* ---------------------------------------------------------------- Dateien */
function dateien() {
  const D = Object.fromEntries(S.d.dateien.map(x => [x.k, x]));
  const gr = n => { const b = S.d.groessen[n]; return b ? (b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB') : ''; };
  const knoepfe = liste => liste.filter(n => !n.endsWith('.webp')).map(n => `<a class="kn kn--klein ${n.endsWith('.png') || n.endsWith('.json') || n.endsWith('.ase') ? 'kn--linie' : ''}" href="${DAT}${n}" download title="${esc(n)} · ${gr(n)}">${esc(n.split('.').pop().toUpperCase())}<i>${PU}</i></a>`).join('');
  const block = (k, titel, satz, inhalt, i) => `<section class="li-d" data-r style="--i:${i % 2}"><header><h2 class="li-d__t">${zwei(titel)}</h2><p class="leise">${esc(satz)}</p></header>${inhalt}</section>`;
  const name = v => ({ hell: t('hell'), dunkel: t('dunkel'), creme: t('creme') }[v.k] || t('v_' + v.k));
  const tafeln = (e, breit) => `<div class="li-tafeln ${breit ? 'li-tafeln--breit' : ''}">${e.var.map(v => `<figure class="li-tafel li-tafel--${v.grund}">
      <div class="li-tafel__f">${v.k === 'relief' ? `<img src="${DAT}${v.dateien[0]}" alt="" loading="lazy" decoding="async">` : `<img src="${DAT}${v.dateien.find(x => x.endsWith('.svg')) || v.dateien[0]}" alt="" loading="lazy" decoding="async">`}</div>
      <figcaption><span><b>${esc(['logo', 'quer'].includes(e.k) ? name(v) : t('v_' + v.k))}</b><small>${esc(v.dateien[0].replace(/\.(svg|png)$/, ''))}</small></span><span class="li-kn">${knoepfe(v.dateien)}</span></figcaption></figure>`).join('')}</div>`;
  const farben = S.d.farben.concat(S.d.glanz || []).map((f, i) => f.v ? `<button class="li-farbe li-farbe--glanz" type="button" data-kopie="${esc(f.v)}" style="--c:${esc(f.v)};--i:${i % 6}" data-r>
      <span class="li-farbe__f"><span class="li-farbe__ok">${esc(t('kopiert'))}</span></span>
      <span class="li-farbe__n"><b>${esc(farbN(f))}</b><small>${esc(farbR(f))}</small></span>
      <span class="li-farbe__w"><span data-kopie-w="${esc(f.v)}">${f.s[0]} → ${f.s[f.s.length - 1]}</span><span>${esc(t('verlauf'))}</span></span></button>` : `<button class="li-farbe" type="button" data-kopie="${f.h}" style="--c:${f.h};--i:${i % 6}" data-r>
      <span class="li-farbe__f"><span class="li-farbe__ok">${esc(t('kopiert'))}</span></span>
      <span class="li-farbe__n"><b>${esc(farbN(f))}</b><small>${esc(farbR(f))}</small></span>
      <span class="li-farbe__w"><span data-kopie-w="${f.h}">${f.h}</span><span data-kopie-w="rgb(${f.rgb.join(', ')})">RGB ${f.rgb.join(' · ')}</span></span></button>`).join('');
  const schriften = SCHRIFTEN.map(([c, n, s, d, p]) => `<li class="li-schrift"><span class="li-schrift__p f-${c}">${esc(p)}</span><span><b>${esc(n)}</b><small>${esc(s)} · ${esc(t('r_schrift')[c])}</small></span>
      <a class="kn kn--klein kn--linie" href="../../assets/fonts/${d}" download>WOFF2<i>${PU}</i></a></li>`).join('');
  return `${titel('dateien', t('dateien'), teile(t('d_titel')), t('d_satz'), `<a class="kn kn--gold" href="${DAT}carlton-europe-marke.zip" download>${esc(t('alles_zip'))}<i>${PU}</i></a><a class="kn kn--linie" href="${MARKE}#zeichen">${esc(t('regeln'))}<i>${PF}</i></a>`, [[S.d.dateien.filter(g => ['logo', 'quer', 'zeichen', 'wortmarke', 'tapete'].includes(g.k)).reduce((n, g) => n + g.var.length, 0), t('z_dateien')], ['SVG', 'PNG']])}
    ${block('logo', t('d_logo'), t('d_logo_s'), tafeln(D.logo), 0)}
    ${block('quer', t('d_quer'), t('d_quer_s'), tafeln(D.quer, true), 1)}
    ${block('zeichen', t('d_zeichen'), t('d_zeichen_s'), tafeln(D.zeichen), 0)}
    ${block('wort', t('d_wort'), t('d_wort_s'), tafeln(D.wortmarke, true), 1)}
    ${block('tapete', t('d_tapete'), t('d_tapete_s'), `<div class="li-tafeln">${D.tapete.var.map(v => `<figure class="li-tafel li-tafel--${v.grund}"><div class="li-tafel__f li-tapete" style="background-image:url(${DAT}${v.dateien.find(x => x.endsWith('.webp'))})"></div>
      <figcaption><span><b>${esc(name(v))}</b><small>${v.px[0]} × ${v.px[1]} px</small></span><span class="li-kn">${knoepfe(v.dateien)}</span></figcaption></figure>`).join('')}</div>`, 0)}
    ${block('farben', t('d_farben'), t('d_farben_s'), `<div class="li-farben">${farben}</div><div class="li-kn li-kn--mitte">${knoepfe(D.farben.var[0].dateien)}</div>`, 1)}
    ${block('schriften', t('d_schriften'), t('d_schriften_s'), `<ul class="li-schriften">${schriften}</ul><div class="li-kn li-kn--mitte">${knoepfe(D.schriften.var[0].dateien)}</div>`, 0)}`;
}
/* Namen und Rollen der Farben kommen deutsch aus livre.json (marke_daten.py); auf Englisch und Französisch hier übersetzt (Prüfung 16.10.2026).
   Marine: seit 16.10.2026 trägt sie die Leiste oben (das Dock unten gibt es nicht mehr); die deutsche Quelle nennt noch das Dock, siehe LIEFERUNGEN «Fragen». */
const FARB_T = {
  en: { n: { nacht: 'Night', navy: 'Navy', blau: 'Blue', weiss: 'White', papier: 'Paper', creme: 'Cream', gold: 'Gold', taupe: 'Taupe', tinte: 'Ink', relief: 'Gold with relief', ortszeile: 'Polished gold, lettering', knopf: 'Polished gold, button', dock: 'Gold in the dock' },
    r: { nacht: 'Background of the page, dark sections', navy: 'Second dark surface, the bar at the top', blau: 'The selected item in pickers and calendar', weiss: 'Cards, fields, pickers', papier: 'Light sections', creme: 'Second light surface, light wallpaper', gold: 'Monogram, lines and emphasis on dark', taupe: 'Second title line and lines on light', tinte: 'Text on light surfaces',
      relief: 'The CE in the opening and in the top bar, rendered as an image', ortszeile: 'Place line «Vintage Adults Hotel · Interlaken · since 1898»', knopf: 'Button «Check availability» in the booking bar', dock: 'Booking field in the former dock' } },
  fr: { n: { nacht: 'Nuit', navy: 'Marine', blau: 'Bleu', weiss: 'Blanc', papier: 'Papier', creme: 'Crème', gold: 'Or', taupe: 'Taupe', tinte: 'Encre', relief: 'Or en relief', ortszeile: 'Or poli, lettrage', knopf: 'Or poli, bouton', dock: 'Or du dock' },
    r: { nacht: 'Fond de la page, sections sombres', navy: 'Deuxième surface sombre, la barre du haut', blau: 'L’élément choisi dans les listes et le calendrier', weiss: 'Cartes, champs, listes', papier: 'Sections claires', creme: 'Deuxième surface claire, papier peint clair', gold: 'Monogramme, lignes et accents sur fond sombre', taupe: 'Deuxième ligne de titre et lignes sur fond clair', tinte: 'Texte sur fond clair',
      relief: 'Le CE de l’ouverture et de la barre du haut, calculé comme image', ortszeile: 'Ligne de lieu «Vintage Adults Hotel · Interlaken · depuis 1898»', knopf: 'Bouton «Vérifier la disponibilité» de la barre de réservation', dock: 'Champ de réservation de l’ancien dock' } }
};
const farbN = f => (FARB_T[SP] && FARB_T[SP].n[f.k]) || f.n, farbR = f => (FARB_T[SP] && FARB_T[SP].r[f.k]) || f.r;
function zwei(s) { const i = s.lastIndexOf(' '); return i > 0 ? `${esc(s.slice(0, i))} <em>${esc(s.slice(i + 1))}</em>` : esc(s); }
function kopiere(w, el) {
  const ok = () => { if (el) { el.classList.add('kopiert'); setTimeout(() => el.classList.remove('kopiert'), 1400); } melde(t('kopiert') + ' · ' + w); };
  if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(w).then(ok, () => alt());
  else alt();
  function alt() { const x = document.createElement('textarea'); x.value = w; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); ok(); } catch (e) { /* nichts */ } x.remove(); }
}
function dateienLeben() {
  $$('[data-kopie]').forEach(b => b.onclick = e => { const w = e.target.closest('[data-kopie-w]'); kopiere(w ? w.dataset.kopieW : b.dataset.kopie, b); });
}

/* ---------------------------------------------------------------- Markenprüfung */
function pruefung() {
  return `${titel('pruefung', t('pruefung'), teile(t('p_titel')), t('p_satz'), '', [['ΔE 2000', t('p_farben')], ['Claude', t('ber').bild + ' · ' + t('ber').ton]])}<div id="li-pr"></div><div id="li-bsp-erg"></div>`;
}
function pruefungLeben() { S.ergebnis ? ergebnis(S.ergebnis) : feld(); if (!S.ergebnis && /[?&]beispiel=1/.test(location.search)) beispielPruefung(); }
/* Beispiel: ein eigens gebauter Entwurf (marke/beispiel/entwurf.png) und die unveränderte Rückmeldung der echten Prüfung dazu (marke/beispiel/pruefung.json).
   Überall als Beispiel beschriftet; ?beispiel=1#pruefung öffnet es gleich. */
async function beispielPruefung() {
  try {
    const r = await fetch(MARKE + 'beispiel/pruefung.json', { cache: 'no-store' }); if (!r.ok) throw new Error(r.status);
    const j = await r.json(); j.beispiel = true;
    S.ergebnis = j; if (S.ansicht === 'pruefung') ergebnis(j);
  } catch (e) { melde(t('p_fehler'), true); }
}
function feld() {
  const d = S.datei;
  $('#li-pr').innerHTML = `<div class="platte li-feld" id="li-feld" data-r>
      <input type="file" id="li-datei" accept="image/jpeg,image/png,image/webp,application/pdf" hidden>
      <div class="li-feld__in">
        ${d ? `<div class="li-feld__vor">${d.bild ? `<img src="${d.bild}" alt="">` : `<span class="li-pdf">PDF</span>`}</div><p class="li-feld__name"><b>${esc(d.name)}</b><small>${(d.groesse / 1e6).toFixed(1)} MB</small></p>`
          : `<span class="li-feld__z">${ZEICHEN}</span><p class="li-feld__t">${esc(t('p_feld'))}</p><p class="leise">${esc(t('p_feld2'))}</p>`}
        <div class="li-feld__kn"><button class="kn ${d ? 'kn--linie' : ''}" type="button" id="li-waehle">${esc(t('p_waehlen'))}<i>${PO}</i></button>${d ? `<button class="kn kn--gold" type="button" id="li-los">${esc(t('p_pruefen'))}<i>${PF}</i></button>` : ''}</div>
      </div>
      <p class="li-privat">${esc(t('p_privat'))}</p>
    </div>`;
  const inp = $('#li-datei'), fl = $('#li-feld');
  $('#li-waehle').onclick = () => inp.click();
  inp.onchange = () => inp.files[0] && nimm(inp.files[0]);
  ['dragenter', 'dragover'].forEach(n => fl.addEventListener(n, e => { e.preventDefault(); fl.classList.add('ueber'); }));
  ['dragleave', 'drop'].forEach(n => fl.addEventListener(n, e => { e.preventDefault(); fl.classList.remove('ueber'); }));
  fl.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) nimm(f); });
  if ($('#li-los')) $('#li-los').onclick = pruefe;
  if ($('#li-bsp')) $('#li-bsp').onclick = () => { const u = $('#li-bsp-erg'); if (u && u.firstChild) u.scrollIntoView({ behavior: 'smooth', block: 'start' }); else beispielPruefung(); };
  auftritte($('#li-pr'), true);
  beispielUnten(!d);
}
/* Unter dem leeren Feld steht immer eine fertige Beispiel-Prüfung, deutlich als Beispiel beschriftet */
async function beispielUnten(an) {
  const u = $('#li-bsp-erg'); if (!u) return;
  if (!an) { u.innerHTML = ''; return; }
  try {
    if (!S.bspJ) { const r = await fetch(MARKE + 'beispiel/pruefung.json'); if (!r.ok) throw new Error(r.status); S.bspJ = await r.json(); S.bspJ.beispiel = true; }
    if (S.datei || S.ergebnis || S.ansicht !== 'pruefung' || !$('#li-bsp-erg')) return;
    $('#li-bsp-erg').innerHTML = '<div class="li-bsp-unten"></div>'; ergebnis(S.bspJ, $('#li-bsp-erg .li-bsp-unten'));
  } catch (e) { /* ohne Beispiel bleibt das Feld */ }
}
function nimm(f) {
  if (!/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(f.type)) { melde(t('p_typ'), true); return; }
  if (f.size > 30 * 1024 * 1024) { melde(t('p_gross'), true); return; }
  if (f.type === 'application/pdf' && f.size > PDF_ONLINE && !LOKAL) { melde(t('p_pdf_online'), true); return; }
  const r = new FileReader();
  r.onload = () => { S.datei = { name: f.name, typ: f.type, groesse: f.size, daten: r.result, bild: f.type === 'application/pdf' ? '' : r.result }; feld(); };
  r.readAsDataURL(f);
}
/* Grosse Bilder vor dem Senden auf 2400 px verkleinern (Prüfung 16.10.2026): die Messung arbeitet mit 600 px, Claude sieht höchstens 1568 px,
   und online nimmt eine Funktion höchstens 4,5 MB an. Farben bleiben (JPEG 92 %). PDFs gehen unverändert. */
const PDF_ONLINE = 3 * 1024 * 1024, LOKAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
function verkleinert(d) {
  return new Promise(ok => {
    if (!/^image\//.test(d.typ)) return ok(d.daten);
    const i = new Image();
    i.onload = () => {
      const m = Math.max(i.naturalWidth, i.naturalHeight), f = Math.min(1, 2400 / m);
      if (f === 1 && d.groesse < 2.5 * 1024 * 1024) return ok(d.daten);
      const c = document.createElement('canvas'); c.width = Math.round(i.naturalWidth * f); c.height = Math.round(i.naturalHeight * f);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(i, 0, 0, c.width, c.height);
      try { ok(c.toDataURL('image/jpeg', .92)); } catch (e) { ok(d.daten); }
    };
    i.onerror = () => ok(d.daten);   // nicht lesbar: so schicken, der Server sagt, was nicht stimmt
    i.src = d.daten;
  });
}
async function pruefe() {
  const d = S.datei; if (!d) return;
  const schritte = [t('p_schritt1'), t('p_schritt2'), t('p_schritt3')];
  $('#li-pr').innerHTML = `<div class="platte li-lauf" data-r><div class="li-lauf__b">${d.bild ? `<img src="${d.bild}" alt="">` : `<span class="li-pdf">PDF</span>`}<span class="li-scan"></span></div>
    <div><ol class="li-schritte">${schritte.map((s, i) => `<li data-i="${i}"><i></i><span>${esc(s)}</span></li>`).join('')}</ol><p class="leise">${esc(t('p_dauer'))}</p></div></div>`;
  auftritte($('#li-pr'), true);
  const li = $$('.li-schritte li');
  let n = 0; li[0].classList.add('an');
  const uhr = setInterval(() => { if (n < 2) { li[n].classList.replace('an', 'fertig'); n++; li[n].classList.add('an'); } }, n === 0 ? 1600 : 9000);
  try {
    const daten = await verkleinert(d);
    const r = await fetch('api/pruefen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, typ: daten === d.daten ? d.typ : 'image/jpeg', daten, sprache: SP }) });
    let j = {}; try { j = await r.json(); } catch (e) { /* leer */ }
    if (!r.ok) throw new Error(String(j.fehler || r.status).replace(/^[A-ZÄÖÜ]+ · /, ''));
    clearInterval(uhr); li.forEach(x => { x.classList.remove('an'); x.classList.add('fertig'); });
    S.ergebnis = j;
    setTimeout(() => ergebnis(j), 380);
  } catch (e) {
    clearInterval(uhr);
    melde(t('p_fehler') + ': ' + (/Failed to fetch|NetworkError|Load failed/.test(e.message) ? (navigator.onLine === false ? t('p_offline') : t('fehler_verb')) : /^\d+$/.test(e.message) ? t('fehler_code', e.message) : e.message), true);
    feld();
  }
}
function ergebnis(j, ziel) {
  const Z = ziel || $('#li-pr');
  const m = j.messung, k = j.ki || {};
  const pr = x => Math.round(x * 100);
  const toene = m.toene.map((x, i) => `<li class="li-ton li-ton--${x.urteil}" style="--i:${i}">
      <span class="li-ton__f" style="background:${x.hex}"></span>
      <span class="li-ton__n"><span class="li-ton__z"><b>${x.hex.toUpperCase()} · ${x.anteil < .01 ? '&lt;1' : pr(x.anteil)} %</b><em>${esc(t('p_' + x.urteil))}</em></span><small><i style="background:${esc(x.palette)}"></i>${esc(farbN({ k: x.naechste, n: x.name }))} · ΔE ${String(x.de).replace('.', SP === 'de' || SP === 'fr' ? ',' : '.')}</small></span></li>`).join('');
  const sonder = [m.schwarz > .01 ? t('p_schwarz', pr(m.schwarz)) : '', m.rot > .02 ? t('p_rot', pr(m.rot)) : ''].filter(Boolean);
  const reihe = { passt_nicht: 0, achten: 1, passt: 2 };
  const punkte = (k.punkte || []).slice().sort((a, b) => (reihe[a.urteil] ?? 1) - (reihe[b.urteil] ?? 1)).map((p, i) => `<li class="li-pk li-pk--${esc(p.urteil)}" data-r style="--i:${i}">
      <span class="li-pk__m"><em>${esc(t('u_' + p.urteil) || p.urteil)}</em><small>${esc((t('ber')[p.bereich]) || p.bereich)}</small></span>
      <span class="li-pk__t"><b>${esc(p.titel)}</b><span>${esc(p.text)}</span></span></li>`).join('');
  const ton = (k.ton || []).filter(x => x.stelle && x.vorschlag).map(x => `<li><s>${esc(x.stelle)}</s><span>${esc(x.vorschlag)}</span></li>`).join('');
  if (!ziel) { const u = $('#li-bsp-erg'); if (u) u.innerHTML = ''; }
  Z.innerHTML = `<div class="li-erg">
    <aside class="li-erg__l">
      <figure class="platte li-erg__bild" data-r><img src="${j.vorschau}" alt="${esc(j.name)}"><figcaption><b>${esc(j.name)}</b>${j.seiten > 1 ? `<small>${esc(t('p_seiten', j.seiten, Math.min(j.seiten, 3)))}</small>` : ''}</figcaption></figure>
      <section class="platte li-erg__farben" data-r><h3>${esc(t('p_farben'))}</h3><p class="leise">${esc(t('p_farben_s'))}</p>
        <p class="li-band" aria-hidden="true">${m.toene.map(x => `<i style="flex:${Math.max(.004, x.anteil)};background:${x.hex}"></i>`).join('')}</p>
        <p class="li-rahmen-z">${esc(t('p_rahmen', pr(m.im_rahmen)))}</p><p class="li-legende">${esc(t('p_naechste'))}</p>
        <ol class="li-toene">${toene}</ol>${sonder.length ? `<ul class="li-sonder">${sonder.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}</section>
    </aside>
    <div class="li-erg__r">
      ${j.beispiel ? `<p class="platte li-hinweis li-hinweis--bsp" data-r>${esc(t(j.von_hand ? 'p_beispiel_hand' : 'p_beispiel_h'))}</p>` : ''}
      ${j.beispiel_ki ? `<p class="platte li-hinweis li-hinweis--bsp" data-r>${esc(t('p_beispiel_ki'))}</p>` : ''}
      ${j.ki_fehler ? `<p class="platte li-hinweis li-hinweis--ki" data-r>${esc(t('p_ki_fehler', j.ki_fehler))}</p>` : `
      <section class="platte li-gesamt" data-r><p class="mono">${esc(t('p_gesamt'))}${k.art ? ' · ' + esc(k.art) : ''}</p><p class="li-gesamt__s">${esc(k.gesamt || '')}</p></section>
      <h3 class="li-erg__h">${esc(t('p_punkte'))}</h3><ol class="li-punkte">${punkte}</ol>
      ${ton ? `<section class="platte li-tonvor" data-r><h3>${esc(t('p_ton'))}</h3><ul>${ton}</ul></section>` : ''}
      ${k.text ? `<details class="li-gelesen"><summary class="mono">${esc(t('p_text'))}</summary><p>${esc(k.text)}</p></details>` : ''}`}
      <div class="li-erg__kn"><button class="kn" type="button" id="li-neu">${esc(t('p_neu'))}<i>${PU}</i></button><button class="kn kn--linie" type="button" id="li-kopie">${esc(t('p_kopie'))}<i>${KOPIE}</i></button><button class="kn kn--linie" type="button" id="li-sichern">${esc(t('p_sichern'))}<i>${PU}</i></button></div>
    </div></div>`;
  auftritte(Z);
  const kn = x => Z.querySelector(x);
  kn('#li-neu').onclick = () => { S.ergebnis = null; S.datei = null; feld(); scrollTo({ top: 0, behavior: 'smooth' }); };
  kn('#li-kopie').onclick = () => kopiere(alsText(j));
  kn('#li-sichern').onclick = () => sichere(j);
}
function alsText(j) {
  const m = j.messung, k = j.ki || {};
  const z = [`Le Livre · ${t('pruefung')} · ${j.name}`, ''];
  if (k.gesamt) z.push(k.gesamt, '');
  (k.punkte || []).forEach(p => z.push(`· ${(t('ber')[p.bereich]) || p.bereich} – ${t('u_' + p.urteil) || p.urteil}: ${p.titel}. ${p.text}`));
  z.push('', t('p_farben') + ':');
  m.toene.forEach(x => z.push(`  ${x.hex.toUpperCase()} ${Math.round(x.anteil * 100)} % → ${x.name} ${x.palette.toUpperCase()}, ΔE ${x.de} (${t('p_' + x.urteil)})`));
  (k.ton || []).forEach(x => z.push('', `«${x.stelle}» → «${x.vorschlag}»`));
  return z.join('\n');
}
function sichere(j) {
  // nur auf ausdrücklichen Wunsch: eine Datei auf diesem Rechner, nichts auf dem Server
  const html = `<!doctype html><meta charset="utf-8"><title>Le Livre · ${esc(j.name)}</title><body style="font:15px/1.6 system-ui;max-width:820px;margin:40px auto;color:#0c1526;background:#f4ecdc;padding:0 20px">
    <h1 style="font:400 34px Georgia,serif">${esc(t('pruefung'))}: ${esc(j.name)}</h1><img src="${j.vorschau}" style="max-width:360px;border-radius:12px"><pre style="white-space:pre-wrap;font:14px/1.6 system-ui">${esc(alsText(j))}</pre>
    <p style="color:#8a7545;font-size:12px">Le Livre · Carlton-Europe Interlaken · ${new Date().toLocaleString(SP === 'de' ? 'de-CH' : SP)}</p></body>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = 'le-livre-pruefung-' + j.name.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9äöü_-]+/gi, '-').toLowerCase() + '.html';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------------------------------------------------------------- Fenster, Meldung */
function fenster(html) {
  const f = $('#fenster');
  f.innerHTML = `<div class="fenster__k li-fk" role="dialog" aria-modal="true"><button class="rund fenster__zu" type="button" data-zu aria-label="${esc(t('schliessen'))}">${ZU}</button>${html}</div>`;
  f.hidden = false; document.body.classList.add('li-zu');
  $$('[data-zu]', f).forEach(b => b.onclick = fensterZu);
  f.onclick = e => { if (e.target === f) fensterZu(); };
}
function fensterZu() { $('#fenster').hidden = true; $('#fenster').innerHTML = ''; document.body.classList.remove('li-zu'); }
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#fenster').hidden) fensterZu(); });
function melde(text, fehl = false) {
  const q = document.createElement('div');
  q.className = 'quit' + (fehl ? ' fehl' : '');
  q.innerHTML = `<div><b>${esc(text)}</b></div>`;
  $('#meldung').appendChild(q);
  setTimeout(() => q.remove(), fehl ? 7000 : 2600);
}

/* ---------------------------------------------------------------- Start */
/* Startfehler-Tür (R04, Prüfung 16.10.2026): statt einer leeren Fläche sagt Le Livre, dass und warum es nicht startet. */
function startfehler(grund) {
  $('#ansicht').innerHTML = `<div class="platte li-tuer" role="alert"><span class="li-tuer__z">${ZEICHEN}</span><h1>${esc(t('tuer_t'))}</h1>
    <p class="li-tuer__g">${esc(grund)}</p><p>${esc(t('tuer_hilfe'))}</p>
    <div class="titel__kn"><button class="kn" type="button" data-neu>${esc(t('tuer_neu'))}<i>${PF}</i></button><a class="kn kn--linie" href="anleitung.html" target="_blank" rel="noopener">${esc(t('anleitung'))}<i>${PF}</i></a></div></div>`;
  const b = $('#ansicht [data-neu]'); if (b) b.onclick = () => location.reload();
}
/* Beigaben wie in den anderen Werkzeugen: «Zur Werkbank» (R19, nur aus der Werkbank geöffnet) und der kurze Rundgang (R18) */
function beigabe(src, daten) {
  const s = document.createElement('script'); s.src = src + '?v=' + (((document.querySelector('script[src*="livre.js"]') || {}).src || '').split('v=')[1] || 1);   // Fassung wie livre.js (F08) s.defer = true;
  Object.entries(daten || {}).forEach(([k, v]) => s.setAttribute('data-' + k, v));
  document.body.appendChild(s);
}
/* Auftakt (R02): ruhig warten, bis Schriften und das Foto der ersten Bühne da sind, höchstens 2,5 s, dann alles auf einmal */
function bereit(ansicht) {
  const bild = new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = 'hero-' + ansicht + '.webp'; if (i.decode) i.decode().then(r, r); });
  return Promise.race([Promise.all([document.fonts ? document.fonts.ready : 0, bild]), new Promise(r => setTimeout(r, 2500))]);
}
(async function () {
  document.documentElement.lang = SP === 'de' ? 'de-CH' : SP;
  try {
    const vorgeladen = document.querySelector('link[rel="preload"][as="fetch"]');   // dieselbe Adresse wie der Vorlader im Kopf, sonst lädt der Browser die Datei zweimal
    try {
      const r = await fetch(vorgeladen ? vorgeladen.getAttribute('href') : MARKE + 'livre.json', vorgeladen ? {} : { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status);
      S.d = await r.json();
      if (!S.d || !Array.isArray(S.d.fotos) || !S.d.stand) throw new Error('Form');
    } catch (e) { return startfehler(t('fehler_json') + ' (' + (e.message === 'Failed to fetch' ? 'offline' : e.message) + ')'); }
    const h = location.hash.slice(1);
    try { S.ansicht = ['start', 'bilder', 'dateien', 'pruefung'].includes(h) ? h : ((/\/maison\/?(index\.html)?([?#].*)?$/.test(document.referrer) && ((performance.getEntriesByType('navigation')[0] || {}).type !== 'reload')) ? (localStorage.removeItem('livre-ansicht'), 'start') : localStorage.getItem('livre-ansicht') || 'start'); }   /* Aus La Maison geöffnet: immer auf der Übersicht anfangen, beim Neuladen bleibt die letzte Ansicht */ catch (e) { S.ansicht = 'start'; }
    await bereit(S.ansicht);
    kopf(); rand(); leiste(); zeichne();
  } catch (e) { return startfehler(String(e && e.message || e).slice(0, 200)); }
  addEventListener('hashchange', () => { const a = location.hash.slice(1); if (['start', 'bilder', 'dateien', 'pruefung'].includes(a) && a !== S.ansicht) gehe(a); });
  fetch('api/stand', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject()).then(j => { S.server = true; S.nurWeb = j.nur_website ? true : new Set(j.ohne_original || []); }).catch(() => { S.server = false; });
  beigabe('zur-werkbank.js', { zw: '', neben: '#rand', luft: '40', ueber: '#leiste' });
  beigabe('rundgang.js', { werkzeug: 'livre' });
})();
