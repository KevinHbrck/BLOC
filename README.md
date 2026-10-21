# BLOC – Modular Training Builder

Trainings-App für Intervall-Workouts, Krafttraining im Fitnessstudio und Freiluft, Challenges, Aufwärmen & Dehnen und GPS-Läufe. Läuft als PWA direkt
im Browser (Android und iOS), ohne App Store, ohne Konto – **alle Daten bleiben auf dem Gerät, es gibt keinen eigenen
Server** (das ist das Alleinstellungsmerkmal; siehe „Grundsätze“). Deutsch und Englisch.

Dieses Dokument beschreibt den **aktuellen Stand**. Die Geschichte der Änderungen steht in [VERLAUF.md](VERLAUF.md)
(nur die letzten Wochen) und in [docs/VERLAUF-Archiv.md](docs/VERLAUF-Archiv.md) (alles davor).

## Grundsätze

- **Lokal, ohne Server:** keine Konten, keine Werbung, kein Tracking, keine Fremd-Skripte, keine Anfragen an Dienste.
  Neue Funktionen dürfen nichts davon aufweichen (zum Beispiel keine Karten- oder Höhen-Dienste, kein Cloud-Sync).
  Bei einer späteren Store-App gilt dasselbe: Code im Paket mitliefern, keine Remote-Adresse, keine Live-Update-Dienste.
- **Keine Build-Schritte:** Vanilla-JavaScript, die Dateien werden so ausgeliefert, wie sie im Repository liegen.
- **Deutsche Bezeichner und Kommentare**, Speicher in `localStorage`.

## Aufbau der App

**Unten eine Leiste** (nur auf den Hauptseiten): **Start · Suche · Kalender · Statistik · Einstellungen** (im Aussehen New: **Heute · Training · Kalender · Fortschritt** mit rundem Hauptknopf, siehe Designs).

**Startseite:** Wochenzeile (Trainings dieser Woche), Favoriten (☆, höchstens vier sichtbar) und die Bereiche in der
Reihenfolge **Workout, Timer, Run, Mobility & Stretch** (langes Drücken zum Sortieren). Welche Bereiche sichtbar sind,
stellt man unter **Einstellungen › Fokus** ein (ausgeblendete Bereiche bleiben über die Suche erreichbar).

| Bereich | Inhalt |
|---|---|
| **Workout** (seit 2026-10-10, früher Air und Studio; intern `katalog`, Routen `#library` und `#timers` führen hierher, `js/11b-katalog.js`) | Drei Reiter: **Katalog** (fertige Workouts, ganz vorn der Schalter **Fitnessstudio · Freiluft**; Programme fürs Fitnessstudio: Ganzkörper, Legday, Arme, Tiefenmuskulatur) · **Übungen** (alle Übungen von Air und Studio nach Bereichen: Brust, Rücken, Schultern, Arme, Bauch & Rumpf, Beine & Po, Cardio & Ausdauer, Eigene) · **Meine** (eigene Workouts mit Timer und Pläne). Die Bereiche sind zugeklappt, zu Beginn stehen nur die Überschriften; mit Filter oder Suche stehen die Treffer offen. Zwei Einstiege unter den Reitern: **Überrasch mich** (fragt Zeit und Ausrüstung) und **Workout planen** (Plan-Bau auf den Bereichen, oben die Körperkarte des Plans; „Mit Timer starten“ macht aus dem Plan ein Workout, in dem Air- und Studio-Übungen hintereinander laufen). Pro Übung eine Karte: Gewicht × Wiederholungen mit Pause, „Letztes Mal“ zum Übernehmen, Satztypen (Aufwärmen, Drop, bis Versagen), Verlauf, Steigerungsvorschlag (doppelte Progression), Scheibenrechner bei Langhantel-Übungen und einem Umschalter Satz für Satz ↔ Timer (für Übungen ohne Gewicht: ein Timer-Block); die Statistik zeigt Bestgewicht, geschätztes 1RM und Volumen mit Rekord-Stern. Ein Plan ist ein Programm: je Übung Sätze, Wiederholungen, Gewicht und Pause gleich auf der Plan-Seite einstellen; „Selber bauen“ im Baukasten führt ohne Zwischenfenster in die Übungsauswahl. Derselbe Filter im Katalog und bei den Übungen (gemeinsam gespeichert): Gruppe, Ausrüstung („Fitnessstudio“, Kabel, Langhantel, Kurzhantel & Kettlebell, Stange & Barren, Widerstandsband, Körpergewicht), Körperkarte mit Detailansicht. Neue Pläne und neue Workouts mit Timer stehen erst mit **„Speichern“** in Meine (davor sind sie Entwürfe; Verlassen fragt nach: Speichern · Verwerfen); bereits gespeicherte sichern jede Änderung selbst. **Fitnessstudio-Übungen gehen überall hinein** (Baukasten, Langdruck, Tauschen, Überrasch mich mit Chip „Fitnessstudio“, Plan nach Gewichtung mit Ort); bei ihnen steht Gewicht × Wiederholungen vorn (Kachel „40 kg · 3 × 12“, Deckblatt „Mit Gewichten trainieren“ legt einen Plan an), der Timer ist ein zweiter Knopf. Farben: Symbole schwarz/weiß, Freiluft blau, Fitnessstudio Rot, Workout selbst BLOC-Orange, Mobility & Stretch grün, die übrigen Bereiche schwarz/weiß; im Plan-Bau klebt der Plan mit den gewählten Übungen unter der Kopfzeile |
| **Run** (intern `run`) | GPS-Lauf: Countdown, Zeit, Strecke, Pace, Kilometer-Zwischenzeiten, Route (ohne Karte, nur als Linie), Ansagen, **Intervall-Lauf** (Laufen/Gehen), **Auto-Pause** (Stehzeit wird herausgerechnet), Abdunkeln, Name und Notiz, GPX-Export. Im Lauf lösen alle Knöpfe erst nach 3 s Halten aus |
| **Mobility & Stretch** (intern `warm`, `js/17-aufwaermen-einstellungen.js`) | Aufbau wie das Workout: Reiter **Katalog** (Abteilungen **Meine** · **Workoutkatalog** · **Übungskatalog**, dort „Eigene Übung anlegen“) und **Baukasten** (**Überrasch mich** nach Dauer und Körperregion, **Selber bauen**); darunter die Art Aufwärmen | Dehnen, Körperregionen als Filter |

**Baukasten** (Seite Training, `js/23-baukasten.js`): Übung → **BLOC** → **Workout** → **PLAN**. Oben ein Umschalter **BLOC | Workout | PLAN**, darunter der Bau-Knopf (`+ BLOC`, `+ Workout`, `+ PLAN`) und ein flaches Karussell mit den eigenen Elementen des Segments (zuletzt benutzt zuerst; ab drei Elementen endlos, `Alle anzeigen` mit Suche; Tippen öffnet Detail mit Start, Bearbeiten und Menü).
- **BLOC** = ein Baustein aus Übungen: die Pläne unter Workout › Meine (`settings.stPlaene`, gebaut mit dem bestehenden BLOC-Builder „Selber bauen“) und die eigenen Workouts mit Timer (`myWorkouts`).
- **Workout** (`db.bkWorkouts`) = Abfolge von BLOCs, Katalog-Workouts, Mobility & Stretch und Läufen, je Eintrag Runden und Pause danach. Eigene BLOCs stehen als **Verweis** darin (Änderung wirkt überall; wird ein BLOC in mehreren Workouts benutzt, fragt BLOC vor dem Bearbeiten nach „Als Kopie bearbeiten“, und Löschen nennt die betroffenen Workouts). Aus einem Katalog übernommene Inhalte werden eine **Kopie** unter Meine. Ein Lauf im Workout ist ein Zeitblock im Timer, ohne GPS.
- **PLAN** (`db.plaene`) = Wochen, Trainingstage und je Tag Workouts, BLOCs, Katalog, Run; „Start“ trägt ihn in den Kalender ein (Kalenderart `wk`), dort erscheint er auf Heute. Gebaut und bearbeitet wird er nur im Baukasten.

**Speicherformat:** `db.v` zählt die Fassung (1 = bis zum Baukasten, 2 = mit `bkWorkouts` und `plaene`, 3 = ohne Summit). Laden, Import und Schnappschuss laufen über `dbAusRoh` und `dbMigrieren` (`js/01-basis.js`); jede Formatänderung bekommt dort eine Stufe. Summit (Challenges) wurde in Stufe 3 entfernt: die eigenen Challenges, Einheiten und Bestzeiten liegen bis zum Sichern oder Verwerfen unter dem Schlüssel `sporttimer-summit-archiv` (Hinweis auf der Seite Training).

**Statistik** (alles lokal berechnet): Kopf mit Trainings der letzten 7 Tage und Serie, Verlauf als Balken (Zeit oder
Anzahl, **Woche · Monat · Jahr**, nach links wischen für früher, so weit Daten da sind), Kalender der letzten 4 Wochen
(einklappbar), je Bereich eine Karte (Run: Kilometer pro Zeitraum, Pace-Verlauf, Rekorde;
Workout: Muskelgruppen der letzten 7 Tage; Air und Studio laufen hier seit 2026-10-10 als eine Karte). Nur Bereiche, die im Fokus an sind; der am meisten genutzte steht oben, Run
und Mobility & Stretch immer unten.

**Was ein „Training“ ist:** Alle Timer-Einträge mit höchstens 60 Minuten Abstand gelten als ein Besuch; die Trainingszeit
läuft vom ersten Start bis zum Ende des letzten Timers (`besuche()` in `js/01-basis.js`). Läufe zählen einzeln.

**Timer:** Vollbild mit Fortschrittsring, Figur der Übung, Sprachansagen, Töne im Voraus geplant.
Musik anderer Apps läuft weiter.

**Figuren:** Strichfiguren als Skelett mit Gelenken (`ILLU_POSES`/`ILLU_SEQ` in `daten.js`).

## Designs

**Helligkeit: System · Hell · Dunkel · Nacht.** Farben nach 60-30-10: ruhige Flächen, Bereichsfarben je Bereich, Akzentfarbe nur für
die Hauptaktion, das Logo und die Arbeitsphase im Timer. „Ausgewählt“ ist ruhig (`--sel-bg`/`--sel-text`).

**Aussehen: Classic · Modern** (heißt seit 2026-10-16 so, früher Klassik · New; Einstellungen › Darstellung, `settings.layout` mit den Werten `classic` und `new` unverändert; Standard bei einem frischen Start: Modern in Dunkel, bestehende Stände bleiben Classic). Der Look von „New“ steht in
`layout-new.css` (alles unter `:root[data-layout="new"]`, gesetzt in `applyTheme`): größere Rundungen mit kleiner Ecke oben links, ruhige
Konturen, Wochenpunkte weiß / orange / Ring, die untere Leiste als schwebende Pille mit orangenem aktivem Reiter. Dazu ändert „New“ die
Navigation (nur das, Funktionen bleiben): unten **Heute · Training · Kalender · Fortschritt**; Suche und Einstellungen sind Symbole oben auf
Heute und Training (`kopfSymboleNeu`, `layoutNeu` in `js/03-router.js`); die Bereiche (Workout, Mobility & Stretch, Timer, Run) und der Baukasten stehen
als Fotokarten auf der neuen Seite **Training** (`#training`, `renderTraining` in `js/05-suche.js`); auf Heute ersetzt der **Workout-Builder**
(Überrasch mich · Selber bauen, `builderKarteHTML`) die Bereichsliste. Fotos für New: `img/neu-*.jpg` und `img/neu-builder.webp`. Das frühere
Design C60 (Kassetten-Look mit Walzenzähler) gibt es nicht mehr; gespeicherte C60-Stände werden beim Laden zu Hell (`migrateTheme`), mit einem
einmaligen Hinweis auf der Startseite.

## Daten und Sicherheit

- Alles liegt im `localStorage` (`sporttimer-data-v1`); die App bittet den Browser um dauerhaften Speicher.
- **Trainingsverlauf:** `history` hält 31 Tage einzeln, ältere Einträge werden als **Wochensummen** (`settings.statW`, über
  Jahre) behalten. Läufe (`settings.runs`) bleiben vollständig.
- **Sicherung speichern/einlesen** in den Einstellungen (JSON); **Schnappschuss** alle 7 Tage automatisch in IndexedDB.
- Datenschutzerklärung: [privacy.html](privacy.html).

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Gerüst (lädt `app.css`, `texte.js`, `daten.js` und die Teile in `js/`) |
| `app.css` | Gestaltung aller Designs |
| `layout-new.css` | Aussehen „New“ (nur Regeln unter `:root[data-layout="new"]`) |
| `js/01-basis.js` … `js/20-walzen-start.js` (dazu `js/11b-katalog.js`) | Programmlogik in 22 Teilen (je ein Themenbereich: Basis und Speicher, Bibliothek, Router, Start, Suche, Studio, Körperkarte, Statistik, Editor, Lauf, Audio, Timer-Motor, Katalog …). Es sind gewöhnliche Skripte, die **nacheinander im selben Gültigkeitsbereich** laufen (Reihenfolge = Reihenfolge der `<script>`-Zeilen in `index.html`). **Regel:** Code, der schon beim Laden ausgeführt wird (z. B. `var state = { db: loadDB() }`), darf nur Funktionen aus demselben oder einem früheren Teil aufrufen – beim Laden sind spätere Teile noch nicht da. Deshalb stehen die Verlauf-Hilfen für `loadDB` am Ende von `01-basis.js`. Funktionsaufrufe innerhalb von Funktionen sind unkritisch. |
| `texte.js` | Alle Oberflächentexte Deutsch/Englisch, **ein Schlüssel pro Zeile** (gut zu vergleichen) |
| `quellen.html` | Quellen und Hintergrund: woran sich BLOC orientiert, was eigene Zusammenstellung ist (aus der App verlinkt) |
| `daten.js` | Inhalte: Übungen, Workouts, Challenges, Anleitungen, Muskeln, Figuren (`window.BLOC_DATEN`) |
| `sw.js` | Service Worker für Offline-Betrieb; **einzige Stelle der Versionsnummer** (`FASSUNG`) |
| `schnelltest.html` | Automatischer Klicktest (nur lokal) |
| `docs/TESTPLAN.md` | Checkliste für das, was der Browser-Test nicht kann (Ton, GPS) |
| `docs/FACHPRUEFUNG.md` | Checkliste für eine fachliche Prüfung der Inhalte durch Trainer/Sportwissenschaft/Physiotherapie |

## Neue Fassung veröffentlichen

1. `FASSUNG` in `sw.js` erhöhen und dieselbe Nummer als `?v=…` an `app.css`, `texte.js`, `daten.js` und alle `js/…`-Dateien in `index.html` (ein `sed` über die alte Nummer genügt); neue Teile in `js/` außerdem in `sw.js` (`GRUNDGERUEST`) eintragen.
2. Schnelltest laufen lassen (siehe unten).
3. Alle geänderten Dateien gemeinsam hochladen bzw. committen und nach `main` pushen. GitHub Pages: <https://kevinhbrck.github.io/BLOC/>
   (nach dem Push dauert die Auslieferung eine Minute).
4. In `VERLAUF.md` kurz festhalten, was sich geändert hat.

## Testen

```bash
python -m http.server 8788
```

Dann `http://localhost:8788/schnelltest.html?auto` öffnen. Der Test klickt sich durch alle Bereiche (inkl. Run mit
simuliertem GPS, Auto-Pause, Intervall, Statistik, Fokus), legt den gespeicherten Stand vorher beiseite und stellt ihn danach
wieder her. Was er **nicht** prüfen kann (echte Töne, echtes GPS, Wake Lock), steht in [docs/TESTPLAN.md](docs/TESTPLAN.md).
