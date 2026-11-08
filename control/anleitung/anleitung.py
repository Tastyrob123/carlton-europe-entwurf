#!/usr/bin/env python3
"""Baut die Anleitung zum Le Bureau des Carlton-Europe: control/anleitung/index.html (16.10.2026).
Vorlage: Anleitung «Le Bureau» des Grand Beau-Rivage (_werkbank/anleitung/anleitung.py dort, nur gelesen), gleiche Kapitel und Handgriffe,
Texte aufs Carlton umgeschrieben, Kleid des Carlton (Baskerville, Nachtblau mit Tapete, Papier, Gold), ohne werkbank.css: alles Nötige steht in anleitung.css.
Standbilder: node _qa/bureau_standbilder.js http://127.0.0.1:8915  (eigene Instanz mit eigenen Daten) → /tmp/ce-anl/standbilder/*.jpg, hier verkleinert nach bild/*.webp.
Aufruf: python3 control/anleitung/anleitung.py [Ordner der Standbilder]"""
import datetime, html, os, sys
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
QUELLE = sys.argv[1] if len(sys.argv) > 1 else '/tmp/ce-anl/standbilder'
BILD = os.path.join(HIER, 'bild')
e = html.escape
STAND = datetime.date.today().strftime('%d.%m.%Y')
PF = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M5 3h6v6"/></svg>'

# Je Kapitel: (Name, Standbild, Bereich, Titelzeilen, Einleitung, Schritte, Gut zu wissen)
KAPITEL = [
    ('aufbau', 'bureau-uebersicht', 'Übersicht', ['So ist das Bureau', 'aufgebaut.'],
     'Das Bureau pflegt die Website des Carlton-Europe: jeden Text, jedes Foto, Telefon und Adresse, Zeiten und Preise, einen Hinweis für Gäste. Oben der Kopf mit La Maison, Prüfung, Anleitung und dem Weg zur Website, links die Bereiche, in der Mitte die Arbeit, unten die schwebende Leiste.',
     ['Die Übersicht zeigt oben die Lage (Entwurf, Website, Karten), darunter die häufigsten Aufgaben als Kacheln und die Bereiche der Website mit einem Foto.',
      'Die Zahl neben einem Bereich sagt, wie viele Änderungen dort im Entwurf warten.', 'Die Leiste unten begleitet Sie überall: Speichern, Vorher und nachher, Veröffentlichen.'],
     'Die Karten von Restaurant und Bar pflegt La Carte. Das Bureau führt nur hin, damit nichts doppelt gepflegt wird.'),
    ('seite', 'bureau-seite', 'Bereiche', ['Text direkt', 'in der Seite.'],
     'Jede Seite steht rechts so, wie Gäste sie sehen. Ein Klick auf einen Text, und links öffnet sich das Feld dazu. Was Sie tippen, steht sofort in der Seite.',
     ['Links einen Bereich wählen, zum Beispiel «Wellness & Aktiv». Hat er mehrere Seiten, stehen sie oben zur Wahl.', 'In der Seite auf den Text klicken. Alles, was sich gold umrandet, lässt sich ändern.',
      'Links schreiben. Der Knopf «Speichern» unten wird gelb.', 'Oben in der Vorschau wechseln Sie zwischen Rechner und Handy und zwischen den Sprachen.'],
     'Steht derselbe Text auf mehreren Seiten, etwa ein Knopf im Menü, setzen Sie das Häkchen «Überall ändern». Sonst gilt die Änderung nur an dieser einen Stelle.'),
    ('speichern', 'bureau-quittung', 'Speichern', ['Speichern,', 'Quittung, Rückgängig.'],
     'Nichts speichert still. Gelb heisst: noch nicht gespeichert. Nach dem Speichern kommt eine Quittung und der Knopf wird kurz grün.',
     ['«Speichern» in der Leiste unten drücken oder Cmd + S.', 'Die Quittung nennt, was gespeichert wurde, und hat zwei Knöpfe: «Vorher/Nachher ansehen» und «Rückgängig».',
      '«Rückgängig» stellt den Entwurf so her, wie er vor diesem Speichern war.'],
     'Gespeichert ist im Entwurf. Auf der Website erscheint es erst, wenn Sie veröffentlichen.'),
    ('foto', 'bureau-foto', 'Bereiche', ['Ein Foto', 'tauschen.'],
     'Ein Klick auf ein Foto in der Seite, oder im Reiter «Fotos» links, öffnet das Fenster mit allen Fotos des Hauses.',
     ['Foto in der Seite anklicken.', 'Rechts ein anderes Foto wählen. Die Suche findet Fotos nach ihrer Beschreibung: Zimmer, Bar, Kamin, Wellness.',
      'Oder «Eigenes Foto hochladen»: mindestens 900 Pixel breit, besser 2000. Das Bureau macht daraus die Grössen, die die Website braucht.', 'Die Bildbeschreibung prüfen, dann «Übernehmen».'],
     'Mit «Überall tauschen» wechselt dasselbe Foto auf jeder Seite, auf der es steht. Sonst nur an dieser Stelle.'),
    ('ausblenden', 'bureau-ausblenden', 'Bereiche', ['Ausblenden', 'statt löschen.'],
     'Ein abgelaufenes Angebot, eine besetzte Stelle, ein vergangener Anlass: ganze Karten oder Abschnitte nehmen Sie von der Seite, ohne dass sie verloren gehen.',
     ['In der Seite auf einen Text in dem Abschnitt klicken, der weg soll.', 'Unter dem Feld steht «Abschnitt ausblenden». Wenn die Maus darauf steht, zeigt die Seite rot, was verschwindet.',
      'Anklicken und im Fenster bestätigen.'],
     'Oben auf der Seite stehen alle ausgeblendeten Teile mit «Wieder zeigen». Unter «Entwurf & Vergleich» lässt sich jedes Ausblenden zurücknehmen.'),
    ('listen', 'bureau-listen', 'Bereiche', ['Listen', 'des Bereichs.'],
     'Manches steht als Liste auf der Website: das Kissenmenü, «Gut zu wissen», die Lieferanten. Der Reiter «Listen» im Bereich zeigt sie, Eintrag für Eintrag.',
     ['Im Bereich oben auf «Listen» klicken.', 'Einen Eintrag ändern, neu anlegen, verschieben oder entfernen.', 'Speichern. Ein Klick in der Seite auf einen Listeneintrag führt ebenfalls hierher.'],
     'Menü & Seiten, Bilder, Karte & Wein der Website sowie Eingang, Fragen, Zahlen und Zugang stehen links in eigenen Bereichen.'),
    ('zahlen', 'bureau-zahlen', 'Für alle Seiten', ['Zeiten', 'und Preise.'],
     'Öffnungszeiten, Preise, Dauer und Grössen stehen auf vielen Seiten. «Zeiten & Preise» sammelt jede dieser Stellen an einem Ort, Seite für Seite, und oben die Angaben des Hauses, die überall gelten.',
     ['«Zeiten & Preise» öffnen. Oben filtern: Preise, Zeiten, Grössen und Dauer.', 'Direkt im Feld ändern, zum Beispiel «22 Uhr» in «21 Uhr».',
      '«Zeigen» fährt in der Seite zur Stelle und leuchtet sie aus. «In der Seite» öffnet den Bereich bei der Stelle.'],
     'Steht dieselbe Zeit an zwei Stellen, sind es zwei Zeilen. Beide ändern.'),
    ('angaben', 'bureau-angaben', 'Für alle Seiten', ['Telefon, E-Mail,', 'Adresse, Links.'],
     'Eine Angabe, jede Stelle: Die Telefonnummer steht auf allen Seiten, in jedem Knopf zum Anrufen und in allen Sprachen. Hier ändern Sie sie einmal.',
     ['«Angaben des Hauses» öffnen.', 'Die Nummer, die Adresse oder den Link ändern. Daneben steht, wie oft und auf wie vielen Seiten die Angabe vorkommt.', 'Speichern. Eine unvollständige E-Mail-Adresse weist das Bureau zurück.'],
     'Gebucht und reserviert wird weiter bei den Diensten des Hauses. Hier steht nur, wohin die Knöpfe führen.'),
    ('hinweis', 'bureau-hinweis', 'Für alle Seiten', ['Hinweis', 'für Gäste.'],
     'Ein Satz oben auf jeder Seite: das Wellnessdörfli in Revision, das Restaurant an einem Abend geschlossen, ein besonderer Anlass.',
     ['«Hinweis für Gäste» öffnen und «Hinweis zeigen» einschalten.', 'Text schreiben, auf Wunsch einen Zeitraum und einen Link.',
      'Die Gestaltung wählen: Farbe (Gold, Nachtblau, Papier, Kaminrot), Schrift und Grösse.', 'Rechts steht er so, wie er auf der Seite erscheint. Speichern.'],
     'Mit Zeitraum erscheint er am ersten Tag von selbst und verschwindet nach dem letzten. Übersetzt wird er unter «Sprachen».'),
    ('sprachen', 'bureau-sprachen', 'Für alle Seiten', ['Die', 'Sprachen.'],
     'Die Website steht auf Deutsch und in weiteren Sprachen. Ein Text, den Sie auf Deutsch ändern, steht in den anderen Sprachen deutsch da, bis er übersetzt ist. Nichts wird geraten.',
     ['«Sprachen» öffnen. Jeder geänderte Text steht da, mit einem Feld je Sprache.', 'Darunter steht klein die bisherige Übersetzung, als Hilfe.', 'Übersetzen, speichern, veröffentlichen.'],
     'Eine geänderte Telefonnummer mitten im Satz braucht keine neue Übersetzung: die Sätze in allen Sprachen bekommen die neue Nummer von selbst.'),
    ('google', 'bureau-google', 'Für alle Seiten', ['Google-', 'Texte.'],
     'Titel und Beschreibung jeder Seite, so wie Google sie in den Suchergebnissen zeigt.',
     ['«Google-Texte» öffnen.', 'Titel bis etwa 60 Zeichen, Beschreibung bis etwa 155. Der Zähler wird rot, wenn es zu lang wird.', 'Rechts steht die Vorschau, wie bei Google.'],
     'Ein leeres Feld heisst: es gilt der Text, der grau darin steht.'),
    ('karten', 'bureau-karten', 'Karten', ['Die Karten:', 'La Carte.'],
     'Gerichte, Preise und Weine pflegt La Carte, mit neuer PDF auf Knopfdruck. Dieselbe Quelle füllt die Karten auf den Seiten von Restaurant und Bar.',
     ['Im Bureau unter «La Carte» stehen die Karten mit ihrem Stand.', '«La Carte öffnen» führt direkt hin.', 'Darunter steht in vier Schritten, wie eine Preisänderung bis auf die Website kommt.'],
     'Texte rund um die Karten, also Stimmung, Öffnungszeiten und Fotos, ändern Sie im Bureau unter «Restaurant & Bar».'),
    ('vergleich', 'bureau-vergleich', 'Entwurf', ['Vorher,', 'nachher.'],
     '«Entwurf & Vergleich» zeigt jede gespeicherte Änderung mit vorher und nachher, und darunter jede Seite zweimal: links wie sie jetzt ist, rechts mit dem Entwurf.',
     ['Unten «Vorher, nachher» drücken.', 'Jede Änderung einzeln prüfen. «Zurücknehmen» holt nur diese eine Stelle zurück.', 'Darunter die Seite wählen. Gold umrandet ist, was das Haus geändert hat.'],
     '«Entwurf verwerfen» nimmt alles zurück. Der verworfene Entwurf bleibt aufbewahrt, «Rückgängig» in der Quittung holt ihn zurück.'),
    ('raus', 'bureau-online', 'Veröffentlichen', ['Auf die', 'Website.'],
     'Ein Knopf stellt den Entwurf auf die Website, auf allen Seiten und in allen Sprachen. Vorher wird alles gesetzt und geprüft.',
     ['Unten «Veröffentlichen» drücken. Die Liste zeigt jede Änderung, auf Wunsch mit einer Notiz für den Verlauf.', '«Jetzt veröffentlichen». Das Fenster zeigt jeden Schritt.',
      'Erst wenn alles stimmt, wird umgeschaltet. Danach «Website ansehen» oder «Fertig».'],
     'Geht unterwegs etwas schief, bleibt die Website, wie sie war, und Ihr Entwurf ist noch da.'),
    ('verlauf', 'bureau-verlauf', 'Verlauf', ['Jeder Stand', 'kommt zurück.'],
     'Jede Veröffentlichung wird aufgehoben. Ein früherer Stand kommt zuerst in den Entwurf: Sie sehen vorher und nachher und veröffentlichen dann.',
     ['«Frühere Fassungen» öffnen.', 'Bei der gewünschten Fassung «In den Entwurf holen».', 'Unter «Entwurf & Vergleich» prüfen, dann veröffentlichen.'],
     'Ganz unten steht immer der ursprüngliche Stand: die Website, wie Tasty Studios sie gebaut hat, ohne jede Änderung.'),
    ('pruefung', 'bureau-pruefung', 'Prüfung', ['Wenn etwas', 'hakt.'],
     'Das Bureau prüft sich selbst: aus dem Browser, im Server-Teil und auf jeder Seite der Website. Die Prüfung läuft auch, wenn das Bureau selbst nicht mehr will.',
     ['Oben rechts das Schild antippen oder links unten «Prüfung». Startet das Bureau nicht, erscheint der Weg dorthin von selbst.', 'Die Ampel oben sagt, ob etwas zu tun ist. Rote und gelbe Punkte haben «Was tun?».',
      '«Bericht kopieren» und an Robert schicken, wenn etwas rot bleibt.'],
     'Jede Meldung im Bureau beginnt mit einem Stichwort. «Was tun?» in der Meldung führt direkt zum Eintrag im Lexikon.'),
    ('handy', 'bureau-handy', 'Unterwegs', ['Auch auf', 'dem Handy.'],
     'Das Bureau geht auch auf dem Handy: ein Hinweis für Gäste, eine geänderte Zeit, ein Tippfehler.',
     ['Oben «Bereiche» antippen, dann den Bereich wählen. Die Liste klappt danach von selbst zu.', 'Ändern wie am Rechner, unten speichern.', 'Grössere Arbeiten, etwa viele Fotos, gehen am Rechner bequemer.'],
     'Was auf dem Handy gespeichert ist, steht am Rechner im selben Entwurf.'),
]

ORDNUNG = [('Grundlagen', 'So geht das Bureau', ['aufbau', 'seite', 'speichern', 'vergleich', 'raus', 'verlauf']),
           ('Die Seiten', 'Fotos, ausblenden, Listen, Zeiten und Preise', ['foto', 'ausblenden', 'listen', 'zahlen']),
           ('Für alle Seiten', 'Angaben, Hinweis, Sprachen, Google, Karten', ['angaben', 'hinweis', 'sprachen', 'google', 'karten']),
           ('Hilfe', 'Wenn etwas hakt, unterwegs', ['pruefung', 'handy'])]
ZAHLWORT = {1: 'ein Thema', 2: 'zwei Themen', 3: 'drei Themen', 4: 'vier Themen', 5: 'fünf Themen'}


def standbild(name):
    q = os.path.join(QUELLE, name + '.jpg')
    z = os.path.join(BILD, name + '.webp')
    if os.path.exists(q) and (not os.path.exists(z) or os.path.getmtime(z) < os.path.getmtime(q)):
        im = Image.open(q).convert('RGB')
        w = min(1920 if im.width > im.height else 780, im.width)
        im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(z, 'WEBP', quality=82, method=6)
    if not os.path.exists(z):
        return None
    with Image.open(z) as im:
        return name + '.webp', im.width, im.height, int(os.path.getmtime(z))


def kino(b, kopf, alt, prio=False):
    n, w, h, v = b
    hoch = ' kino--hoch' if h > w else ''
    return (f'<div class="kino kino--bild{hoch}"><div class="fen__k"><i></i><i></i><i></i><span>{e(kopf)}</span></div><div class="kino__s" style="aspect-ratio:{w}/{h}">'
            f'<img src="bild/{n}?v={v}" width="{w}" height="{h}" {"fetchpriority=\"high\"" if prio else "loading=\"lazy\""} decoding="async" alt="{e(alt)}">'
            f'<span class="kino__lupe">Grösser ansehen</span></div></div>')


def seite():
    by = {k[0]: k for k in KAPITEL}
    assert sorted(n for _, _, l in ORDNUNG for n in l) == sorted(by), 'Kapitel fehlt in ORDNUNG'
    folge = [by[n] for _, _, l in ORDNUNG for n in l]
    kap = ''
    for i, (name, bild, bereich, zeilen, text, schritte, tipp) in enumerate(folge):
        b = standbild(bild)
        film = kino(b, f'le bureau / {bereich.lower()}', f'Le Bureau, {bereich}') if b else ''
        titel = ''.join(f'<span class="z"><span>{f"<em>{z}</em>" if j == len(zeilen) - 1 else z}</span></span>' for j, z in enumerate(zeilen))
        kap += f'''<section class="kapitel{' kapitel--um' if i % 2 else ''}" id="{name}">
  <div class="in kapitel__in">
    <div class="kapitel__t">
      <p class="kap" data-a="auf"><b>{i + 1:02d}</b><i></i><span>{e(bereich)}</span></p>
      <h2 class="t2 zt">{titel}</h2>
      <div class="lauf"><p data-a="auf">{e(text)}</p></div>
      <ol class="schritte2" data-a="auf">{''.join(f'<li><i>{j + 1}</i><span>{e(s)}</span></li>' for j, s in enumerate(schritte))}</ol>
      <p class="tipp" data-a="auf"><b>Gut zu wissen</b>{e(tipp)}</p>
    </div>
    <div class="kapitel__f" data-a="auf">{film}</div>
  </div>
</section>
'''
    nrf = {k[0]: i + 1 for i, k in enumerate(folge)}
    inhalt = ''
    for gruppe, unter, namen in ORDNUNG:
        zeilen_ = ''.join(f'<a href="#{n}" data-a="auf" style="--i:{j}"><i>{nrf[n]:02d}</i><b>{e(by[n][3][0] + " " + by[n][3][1])}</b><span>{e(by[n][2])}</span><em>{PF}</em></a>' for j, n in enumerate(namen))
        inhalt += f'<div class="inhalt__g"><div class="inhalt__k" data-a="auf"><b>{e(gruppe)}</b><span>{e(unter)}</span><i>{len(namen)} Kapitel</i></div><div class="inhalt__l">{zeilen_}</div></div>'
    va = lambda f: int(os.path.getmtime(os.path.join(HIER, f)))
    b0 = standbild(folge[0][1])
    auftakt_bild = f'<div class="auftakt__bild" data-a="auf">{kino(b0, "le bureau", "Le Bureau, Übersicht", True)}</div>' if b0 else ''
    return f'''<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anleitung Le Bureau · Carlton-Europe</title>
<meta name="description" content="Schritt für Schritt durch Le Bureau, das Werkzeug für die Website des Carlton-Europe Interlaken.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0b1f40">
<link rel="icon" href="/assets/logo/favicon.ico">
<link rel="preload" href="/assets/fonts/libre-baskerville-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="anleitung.css?v={va('anleitung.css')}">
</head>
<body class="anleitung">
<header class="leiste"><div class="insel">
  <a class="insel__m" href="/control/"><img src="/assets/img/ce-gold-320.webp" width="320" height="200" alt=""><span>Anleitung</span></a>
  <nav aria-label="Abschnitte"><a href="#kapitel">Kapitel</a><a href="/control/pruefung.html">Prüfung</a></nav>
  <a class="glanz" href="/control/" target="_blank" rel="noopener">Le Bureau öffnen{PF}</a>
</div></header>

<main id="oben">
<section class="auftakt tapete">
  <div class="in">
    <div class="auftakt__t">
      <p class="gruss" data-a="auf">Die Website des Hauses, Schritt für Schritt</p>
      <h1 class="t1 zt"><span class="z"><span>Alles, was Sie</span></span><span class="z"><span><em>ändern können.</em></span></span></h1>
      <div class="lauf"><p data-a="auf">{len(folge)} kurze Kapitel mit den Schritten zum Mitmachen. Sie können oben anfangen oder direkt zu dem springen, was Sie gerade brauchen.</p></div>
      <div class="kn-reihe" data-a="auf"><a class="kn" href="/control/" target="_blank" rel="noopener">Le Bureau öffnen<i>{PF}</i></a><a class="kn kn--linie" href="#kapitel">Zu den Kapiteln<i>{PF}</i></a></div>
    </div>
    {auftakt_bild}
  </div>
</section>

<section class="blatt" id="kapitel">
  <div class="in">
    <div class="kopfzeile"><div><p class="kap" data-a="auf"><b>00</b><i></i><span>Inhalt</span></p><h2 class="t2 zt"><span class="z"><span>{len(folge)} Kapitel,</span></span><span class="z"><span><em>{ZAHLWORT[len(ORDNUNG)]}.</em></span></span></h2></div>
      <div class="lauf"><p data-a="auf">Jedes Kapitel zeigt den Bereich und nennt die Schritte. Ein Klick macht das Bild gross, ein zweiter oder Esc bringt es zurück.</p></div></div>
    <nav class="inhalt" aria-label="Kapitel">{inhalt}</nav>
  </div>
</section>
<div class="kapitel-alle">
{kap}</div>
<section class="tapete schluss2">
  <div class="in">
    <h2 class="t2 zt"><span class="z"><span>Und wenn</span></span><span class="z"><span><em>etwas hakt?</em></span></span></h2>
    <div class="lauf"><p data-a="auf">Schreiben Sie mir. Solange die Website noch bei mir liegt, sehe ich jede Änderung mit und kann helfen, bevor etwas schiefgeht.</p></div>
    <div class="kn-reihe" data-a="auf"><a class="kn" href="mailto:robert@tasty-studios.de?subject=Le%20Bureau%20Carlton-Europe">Robert schreiben<i>{PF}</i></a><a class="kn kn--linie" href="/control/pruefung.html">Prüfung öffnen<i>{PF}</i></a></div>
  </div>
</section>
</main>

<footer class="fuss"><div class="in fuss__u">
  <div><b>Anleitung Le Bureau</b><p>Carlton-Europe Interlaken · Werkzeug von Robert Reff, Tasty Studios.</p></div>
  <div class="r mono"><a href="mailto:robert@tasty-studios.de">robert@tasty-studios.de</a><span>Stand {STAND}</span></div>
</div></footer>
<script src="anleitung.js?v={va('anleitung.js')}"></script>
</body>
</html>
'''


if __name__ == '__main__':
    os.makedirs(BILD, exist_ok=True)
    with open(os.path.join(HIER, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(seite())
    print('Anleitung Le Bureau:', len(KAPITEL), 'Kapitel,', len(os.listdir(BILD)), 'Bilder')
