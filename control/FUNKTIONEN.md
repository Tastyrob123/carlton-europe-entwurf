# Le Bureau: Funktionsliste (Vorlage Grand Beau-Rivage, Stand 16.10.2026)

Gelesen aus `~/Desktop/Website-Projekte/Grand Beau-Rivage/website/studio/` (studio.js v25, index.html, buehne.js, auftakt.js, schweben.js, hell.css),
`studio.py` (Wege), `assets/js/rundgang.js`, `assets/js/zur-werkbank.js`. Nur gelesen, dort nichts geändert.
Spalten: **GBR** = in der Vorlage bedient («✓ bedient», `_qa/bureau_gbr.js`, Chromium und WebKit) oder, wo es Speichern bräuchte, angesehen und im Code gelesen (dort darf nichts gespeichert werden) · **CE** = im Carlton nachgebaut und bedient, in Chromium **und** WebKit grün (`_qa/bureau_liste.js`). Haken erst, wenn bedient (nicht nur gebaut).

**Stand 17.10.2026: CE 107 von 107 Zeilen abgehakt (Prüfung `PRUEFUNG-2026-10-16.md`: Chromium, Safari-Kern und Firefox je 133/133, Härteprüfung `_qa/bureau_haerte.js` je 31/31), GBR 30 bedient, 73 angesehen/aus dem Code.**
Prüfskript: `_qa/bureau_liste.js` (Carlton), Nachweis Rivage: Bildschirmfotos `_qa/bureau-gbr/`.

## A Rahmen
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| A01 | Auftakt: Seite bleibt beim Öffnen ruhig, bis Daten, Schriften und Fotos im ersten Bild da sind (höchstens 2,5 s), dann alles auf einmal | ✓ bedient | ✓ |
| A02 | Fehlermelder im Kopf der Seite: Skriptfehler in localStorage und an den Server, Netzfehler nie, höchstens 20 je Seite | · angesehen/Code | ✓ |
| A03 | Startfehler: Tür «Das Bureau startet nicht» mit Grund und Knopf «Prüfung öffnen» | · angesehen/Code | ✓ |
| A04 | Kopfleiste: Marke (Zeichen, «Le Bureau», «Website · Haus») führt zur Übersicht; Mitte Titel der Ansicht und Stand («n im Entwurf» / «Veröffentlicht <Datum>» / «Wie gebaut») | ✓ bedient | ✓ |
| A05 | Kopfleiste rechts: runde Knöpfe La Maison (zurück), Prüfung (neues Fenster), Anleitung (neues Fenster) mit Hinweis beim Darüberfahren, Trennstrich, Knopf «Website ansehen» | ✓ bedient | ✓ |
| A06 | Rand: «Übersicht», Gruppen «Die Website» (Bereiche mit Zahl offener Änderungen), «Für alle Seiten» (Angaben, Zeiten & Preise, Hinweis, Google-Texte, Sprachen), «Karten» (La Carte mit Stand «4 Karten»/«Entwurf»), «Entwurf» (Entwurf & Vergleich mit Zahl, Frühere Fassungen) | ✓ bedient | ✓ |
| A07 | Rand unten: Website ansehen, Anleitung, Prüfung (je neues Fenster) | · angesehen/Code | ✓ |
| A08 | Handy: Rand als Knopf «Bereiche» zum Aufklappen, schliesst sich nach der Wahl | ✓ bedient | ✓ |
| A09 | Leiste unten immer da: Text links (n Eingaben nicht gespeichert / Entwurf: n Änderungen warten, zuletzt <Zeit> / Alles ist veröffentlicht, zuletzt veröffentlicht <Zeit> · Notiz) | ✓ bedient | ✓ |
| A10 | Speichern-Knopf immer sichtbar: grau (nichts offen), gelb (Eingaben offen), grün «Gespeichert» mit Haken (2,6 s nach dem Speichern) | ✓ bedient | ✓ |
| A11 | «Vorher, nachher» (aus, wenn nichts offen) führt zu Entwurf & Vergleich | · angesehen/Code | ✓ |
| A12 | «Veröffentlichen» nur aktiv, wenn Entwurf da und nichts ungespeichert; Glanz, wenn bereit; Hinweis «Erst speichern» | · angesehen/Code | ✓ |
| A13 | Tastenkürzel Cmd/Ctrl+S speichert; Escape schliesst das Fenster | · angesehen/Code | ✓ |
| A14 | Beim Verlassen mit ungespeicherten Eingaben fragt der Browser nach | · angesehen/Code | ✓ |
| A15 | Quittung unten: Titel, Text, Knöpfe, Schliessen ×; höchstens drei übereinander; verschwindet nach 9 s | · angesehen/Code | ✓ |
| A16 | Fehler als Quittung mit Stichwort und Knopf «Was tun?» (öffnet die Prüfung beim Stichwort) | · angesehen/Code | ✓ |
| A17 | Letzte Ansicht wird gemerkt (Neuladen bleibt dort); aus La Maison geöffnet immer Übersicht | · angesehen/Code | ✓ |
| A18 | Ladezeichen erst nach 280 ms («Wird geladen …») | · angesehen/Code | ✓ |
| A19 | Bühne in jedem Kopf: Foto des Hauses rechts (je Ansicht/Bereich), Zierzeile mit Zeichen und Mono-Text, Titel mit Akzent | · angesehen/Code | ✓ |
| A20 | Auftritt: Bühne, Blätter und Kacheln federn beim Ansichtswechsel herein (höchstens 22, nur was im ersten Bild steht), Schweben beim Scrollen, Staffel höchstens vier Schritte; nach Tippen/Neuzeichnen ruhig | · angesehen/Code | ✓ |
| A21 | Kurzer Rundgang beim ersten Öffnen (Lichtkegel auf echtem Element, vier Schritte), wieder über ?rundgang; nicht für Prüfprogramme und eingebettet | · angesehen/Code | ✓ |
| A22 | «Zur Werkbank»-Knopf, wenn aus der Werkbank geöffnet | · angesehen/Code | ✓ |
| A23 | Weniger Bewegung: alles steht sofort | · angesehen/Code | ✓ |

## B Übersicht
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| B01 | Gruss nach Tageszeit («Guten Morgen/Tag/Abend.» + «Was ändern wir heute?»), Satz, Knopf Anleitung | ✓ bedient | ✓ |
| B02 | Lage-Platte mit drei Feldern: Entwurf (Zahl, Knopf «Ansehen und veröffentlichen»), Website (veröffentlicht/wie gebaut, Seitenzahl, Notiz, «Website öffnen»), Karten (Stand, «Zu La Carte») | ✓ bedient | ✓ |
| B03 | «Häufig gebraucht»: acht Kacheln mit Foto und Symbol (Text ändern, Preis/Zeit, Angebot ausblenden, Foto tauschen, Karte, Hinweis, Stelle besetzt, Telefon/E-Mail), Klick führt hin | ✓ bedient | ✓ |
| B04 | «Die Website, Bereich für Bereich»: Fotokachel je Bereich mit Name, Seitenzahl, «n offen» | ✓ bedient | ✓ |

## C Bereich (Stellen links, Seite rechts)
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| C01 | Kopf knapp: «Bereich · Name», Titel, Satz des Bereichs + «Klicken Sie in der Seite …» | · angesehen/Code | ✓ |
| C02 | Seitenwahl: bis fünf Seiten als Knöpfe, mehr als Auswahlliste; Zahl der Seiten | ✓ bedient | ✓ |
| C03 | Reiter «Texte · n» und «Fotos · n» | ✓ bedient | ✓ |
| C04 | Suche «Text auf dieser Seite suchen»: filtert Stellen, öffnet passende Gruppen, leere Gruppen weg | ✓ bedient | ✓ |
| C05 | Gruppen je Abschnitt der Seite (Kopf und Menü, Abschnittstitel, Fuss), aufklappbar, Zahl Texte · Fotos; die ersten zwei und geänderte offen; Inhalt erst beim Aufklappen | ✓ bedient | ✓ |
| C06 | Stelle: Art (Titel, Überschrift, Absatz, Link, Knopf …), «n× auf der Seite», Text; geändert = Goldmarke, offen = gelb | · angesehen/Code | ✓ |
| C07 | Klick auf Stelle: Feld zum Schreiben darunter, Seite zeigt die Stelle (scrollt sanft hin) | ✓ bedient | ✓ |
| C08 | Tippen zeigt den neuen Text sofort in der Seite | ✓ bedient | ✓ |
| C09 | Kursives bleibt kursiv (Hinweis bei Stellen mit Auszeichnung); Einfügen nur als Text; Enter bei reinem Text gesperrt | · angesehen/Code | ✓ |
| C10 | «Überall ändern, wo genau dieser Text steht (alle Seiten)»; bei Menüpunkten vorausgewählt | ✓ bedient | ✓ |
| C11 | «Wie ursprünglich» setzt den Originaltext; «Ursprünglich: …» steht darunter | · angesehen/Code | ✓ |
| C12 | «Schliessen» schliesst das Feld | · angesehen/Code | ✓ |
| C13 | Klick in der Seite auf einen Text öffnet die Stelle links (Gruppe auf, Feld offen) | · angesehen/Code | ✓ |
| C14 | Klick in der Seite auf ein Foto öffnet «Foto tauschen» | · angesehen/Code | ✓ |
| C15 | Beim Klick in der Seite: Vorschlag «Abschnitt/Karte/Listenpunkt ausblenden» mit Zeigen beim Darüberfahren | · angesehen/Code | ✓ |
| C16 | «Ganzen Abschnitt ausblenden» am Fuss der Gruppe; Fenster «Ausblenden, nicht löschen.» mit «Ausblenden und speichern» | · angesehen/Code | ✓ |
| C17 | «Ausgeblendet auf dieser Seite» oben mit «Wieder zeigen» | · angesehen/Code | ✓ |
| C18 | Fotos-Reiter: Raster aller Fotos der Seite mit Gruppe und Beschreibung, Darüberfahren zeigt das Foto in der Seite, Klick öffnet Tauschen | ✓ bedient | ✓ |
| C19 | Fotos in der Gruppe als kleine Vorschauen, Klick öffnet Tauschen | · angesehen/Code | ✓ |
| C20 | Vorschau: Titel, Rechner/Handy (echte Masse 1440 bzw. 390, verkleinert), Sprache (alle Sprachen der Website), «Gross öffnen» | · angesehen/Code | ✓ |
| C21 | Schleier «Seite wird gesetzt …» beim Laden; sofort beim Speichern von Foto/Abschnitt | · angesehen/Code | ✓ |
| C22 | Nach dem Speichern bleibt die Seite stehen (kein Neuladen), nur die Liste wird erneuert; Scrollstand bleibt | · angesehen/Code | ✓ |
| C23 | Link in der Seite auf eine andere Seite wechselt in deren Bereich | · angesehen/Code | ✓ |
| C24 | Gesperrte Stellen (Karten aus La Carte): Hinweis und Knopf «La Carte öffnen» | · angesehen/Code | ✓ |
| C25 | Restaurants: Knopf «Karten in La Carte» im Kopf | · angesehen/Code | ✓ |

## D Foto tauschen
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| D01 | Fenster «Foto tauschen.»: links Foto jetzt, Beschreibung (für Blinde und Google), «Überall tauschen, wo dieses Foto steht» | ✓ bedient | ✓ |
| D02 | Rechts Suche in den Fotos des Hauses, Raster, gewähltes markiert, Beschreibung des gewählten Fotos wird übernommen | · angesehen/Code | ✓ |
| D03 | «Eigenes Foto hochladen»: prüft (mind. 900 px, höchstens 25 MB), Meldung mit Pixeln, steht danach in den Fotos, Marke «Eigenes» | · angesehen/Code | ✓ |
| D04 | «Ursprüngliches Foto» (wenn getauscht), Abbrechen, Übernehmen = vormerken und speichern | · angesehen/Code | ✓ |
| D05 | Vorschlag Block ausblenden im Fenster (wenn aus der Seite geklickt) | · angesehen/Code | ✓ |

## E Angaben des Hauses
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| E01 | Gruppen Kontakt, Adresse, Links mit Symbol und Satz | ✓ bedient | ✓ |
| E02 | Je Angabe: Symbol, Name, «steht n× auf m Seiten», Feld (Telefon/E-Mail/Link/Text) | · angesehen/Code | ✓ |
| E03 | Tippen merkt gelb vor; gleich wie vorher = vergessen | · angesehen/Code | ✓ |
| E04 | «Ursprünglich» setzt den Standard; «Ursprünglich: …» steht da | · angesehen/Code | ✓ |
| E05 | Prüfung beim Speichern: E-Mail, Telefon nur Ziffern, Link mit https:// | · angesehen/Code | ✓ |

## F Zeiten & Preise
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| F01 | Alle Stellen mit Preis, Uhrzeit, Dauer, Grösse, Seite für Seite (Karte je Seite mit Foto, Bereich, Zahl, «Seite öffnen») | ✓ bedient | ✓ |
| F02 | Filter Alle / Preise / Zeiten / Grössen und Dauer | · angesehen/Code | ✓ |
| F03 | Zeile: Symbol, Abschnitt · vorheriger Text, Feld zum direkten Ändern (Auszeichnung bleibt) | · angesehen/Code | ✓ |
| F04 | «Zeigen»: Fenster mittig, ganze Seite, zoomt ruhig zur Stelle und leuchtet sie aus; «Nochmal», ×, Escape, Klick daneben | ✓ bedient | ✓ |
| F05 | «In der Seite» öffnet den Bereich bei dieser Stelle | · angesehen/Code | ✓ |

## G La Carte
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| G01 | Kopf mit «La Carte öffnen» | · angesehen/Code | ✓ |
| G02 | Originalkarten frei auf Papier (Titelseite, Name, Gruppe, PDF-Datum, «Entwurf wartet»), Klick öffnet La Carte bei der Karte | ✓ bedient | ✓ |
| G03 | «So läuft eine Preisänderung»: vier Schritte | · angesehen/Code | ✓ |
| G04 | Hinweis: Texte rund um die Karten im Bureau unter Restaurants | · angesehen/Code | ✓ |
| G05 | «La Carte antwortet nicht» wenn nicht erreichbar | · angesehen/Code | ✓ |

## H Hinweis für Gäste
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| H01 | Gestaltung: Farbe (vier), Schrift (Klar, Elegant, Gesperrt), Grösse (Klein, Mittel, Gross) | ✓ bedient | ✓ |
| H02 | «So sieht er aus»: kleine Seite mit Band, Beispiel solange kein Text, Satz zu Zeitraum/Zustand | · angesehen/Code | ✓ |
| H03 | Schalter «Hinweis zeigen», Text, Ab/Bis, Link, Linktext | · angesehen/Code | ✓ |
| H04 | Jede Eingabe merkt vor (gelb), gleich wie vorher = vergessen | · angesehen/Code | ✓ |
| H05 | Prüfung: Datum, Link, Text nötig | · angesehen/Code | ✓ |

## I Google-Texte
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| I01 | Je Seite Titel und Beschreibung, leer = grauer Vorgabetext | ✓ bedient | ✓ |
| I02 | Zähler 60 / 155, rot bei zu lang | · angesehen/Code | ✓ |
| I03 | Vorschau wie bei Google (Adresse, Titel, Beschreibung, gekürzt) | · angesehen/Code | ✓ |

## J Sprachen
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| J01 | Je geändertes deutsches Stück: wo, deutsch, vorher, Feld je Sprache | ✓ bedient | ✓ |
| J02 | «Schon übersetzt (aus dem Wörterbuch)» / «Bisher: …» | · angesehen/Code | ✓ |
| J03 | Leer: Erklärung in drei Schritten und ein Beispiel | · angesehen/Code | ✓ |

## K Entwurf & Vergleich
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| K01 | Kopf «Vorher, nachher.» mit Zahl; Knöpfe «Entwurf verwerfen», «Veröffentlichen» | ✓ bedient | ✓ |
| K02 | Je Änderung: was/wo, Vorher (durchgestrichen), Nachher (neue Wörter markiert), Fotos als Bilder | · angesehen/Code | ✓ |
| K03 | «Zurücknehmen» je Änderung; «Vergleichen» springt zum Vergleich dieser Seite | · angesehen/Code | ✓ |
| K04 | Leer: Beispiel mit drei Änderungen | · angesehen/Code | ✓ |
| K05 | «Seite für Seite vergleichen»: Auswahl (geänderte markiert), links Website jetzt, rechts mit Entwurf, je Rechner/Handy/Sprache | · angesehen/Code | ✓ |
| K06 | Verwerfen: Fenster, Entwurf wird aufgehoben, «Rückgängig» holt ihn zurück | · angesehen/Code | ✓ |

## L Speichern, Rückgängig, Veröffentlichen, Frühere Fassungen
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| L01 | Speichern legt alle offenen Eingaben in einem Schritt in den Entwurf; Quittung «Gespeichert» mit bis zu drei Stellen und «und n weitere» | · angesehen/Code | ✓ |
| L02 | Quittung: «Vorher/Nachher ansehen», «Rückgängig» (Entwurf wie vor diesem Speichern, 80 Schritte) | · angesehen/Code | ✓ |
| L03 | «Nichts geändert, nichts gespeichert.» | · angesehen/Code | ✓ |
| L04 | Veröffentlichen: «Erst speichern», «Nichts geändert, nichts veröffentlicht.» | · angesehen/Code | ✓ |
| L05 | Fenster «Auf die Website.»: Liste der Änderungen, Notiz, «Noch nicht», «Jetzt veröffentlichen» | ✓ bedient | ✓ |
| L06 | Fortschritt mit Schritten (Prüfen, Setzen, Prüfen, Übernehmen, Nachprüfen) | · angesehen/Code | ✓ |
| L07 | «Ist online.» mit Zahl, Liste, «Website ansehen», «Fertig»; Fehler: «Nicht veröffentlicht.» mit «Was tun?» | · angesehen/Code | ✓ |
| L08 | Läuft beim Öffnen noch eine Veröffentlichung, erscheint der Fortschritt | · angesehen/Code | ✓ |
| L09 | Frühere Fassungen: Datum, Zahl, Notiz, «In den Entwurf holen» | ✓ bedient | ✓ |
| L10 | Leer: Beispiel mit drei Fassungen | · angesehen/Code | ✓ |
| L11 | «Ursprünglicher Stand» immer unten | · angesehen/Code | ✓ |
| L12 | Zurückholen legt die Fassung in den Entwurf, zeigt Entwurf & Vergleich, Quittung mit Zahl | · angesehen/Code | ✓ |
| L13 | Zwei Fenster: wer auf einem älteren Stand speichert, verwirft, veröffentlicht oder zurückholt, bekommt «In einem anderen Fenster wurde gespeichert» (409), Liste lädt neu, Eingaben bleiben gelb (neu 17.10.2026, Abnahme 8) | – (Rivage lokal ohne, online Konflikt per Etag) | ✓ |

## M Prüfung (eigene Seite)
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| M01 | Eigenständige Prüfseite (ohne Bureau-Skript), Punkte Browser/Server, Lexikon mit Stichworten, Reparaturen | · angesehen/Code | ✓ |
| M02 | Fehler des Bureau aus dem Browser stehen dort | · angesehen/Code | ✓ |

## S Sicherheit (neu 17.10.2026, Abnahme 8; Muster La Carte des Carlton)
| Nr | Funktion | GBR | CE |
|---|---|---|---|
| S01 | Schreibende Anfrage von fremder Herkunft (Origin eines anderen Hosts oder `null`): 403 «HERKUNFT …»; fremder Host 421 | – | ✓ |
| S02 | Grenze je Absender und Minute: 600 Abfragen, 60 schreibende Anfragen an `/control/api/`, darüber 429 mit `Retry-After: 60` und Eintrag im Protokoll | – | ✓ |
| S03 | Anfrage über 32 MB: 413 «GROESSE …»; Foto über 25 MB schon im Browser abgewiesen | – | ✓ |

## N Carlton dazu (nicht in der Vorlage, bleibt erhalten)
Listen des Hauses (Zimmer, Packages, Säle, Pauschalen, Lieferanten, Veranstaltungen …), Karte & Wein der Website, Menü & eigene Seiten, Bilder, Eingang, Das wurde gefragt, Zahlen, Anfragen, Zugang, Kontrolle.
