# BLOC – Modular Training Builder

Trainings-App für Intervall-Workouts, Studio-Training, Challenges, Aufwärmen & Dehnen und GPS-Läufe. Läuft als PWA direkt
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

**Unten eine Leiste** (nur auf den Hauptseiten): **Start · Suche · Statistik · Einstellungen**.

**Startseite:** Wochenzeile (Trainings dieser Woche), Favoriten (☆, höchstens vier sichtbar) und die Bereiche in der
Reihenfolge **Air, Studio, Summit, Run, Mobility & Stretch** (langes Drücken zum Sortieren). Welche Bereiche sichtbar sind,
stellt man unter **Einstellungen › Fokus** ein (ausgeblendete Bereiche bleiben über die Suche erreichbar).

| Bereich | Inhalt |
|---|---|
| **Air** (intern `lib`) | Vier Reiter: Workouts · Übungen · Meine · **Timer** (Timer-Workouts und Blöcke). Suche, Kategorie-Kacheln, aufklappbare Filterzeile (Training und Ausrüstung: Ohne Geräte, Kurzhantel, Kettlebell, **Widerstandsband**, Stange, Dip-Barren). „Überrasch mich“. **Meine** = Selbstgebautes (Baukasten, „Sinnvoll ordnen“) |
| **Studio** (intern `timer`) | Geräte- und Hantelübungen, Gewicht × Wiederholungen eintragen, Pause mit Countdown, Verlauf, Steigerungsvorschlag (doppelte Progression), Mein Plan (mehrere Pläne, auch nach Muskelgruppen-Gewichtung), Timer |
| **Summit** (Challenges, intern `reps`) | Reiter Einheiten · Programme · Meine. Programme auf Zeit, Einheiten in drei Stufen; eigene Programme und eigene Einheiten (+ in Einheiten und Meine) |
| **Run** (intern `run`) | GPS-Lauf: Countdown, Zeit, Strecke, Pace, Kilometer-Zwischenzeiten, Route (ohne Karte, nur als Linie), Ansagen, **Intervall-Lauf** (Laufen/Gehen), **Auto-Pause** (Stehzeit wird herausgerechnet), Abdunkeln, Name und Notiz, GPX-Export. Im Lauf lösen alle Knöpfe erst nach 3 s Halten aus |
| **Mobility & Stretch** (intern `warm`) | Aufwärm- und Dehnprogramme und -übungen, Körperregionen als Filter |

**Statistik** (alles lokal berechnet): Kopf mit Trainings der letzten 7 Tage und Serie, Verlauf als Balken (Zeit oder
Anzahl, **Woche · Monat · Jahr**, nach links wischen für früher, so weit Daten da sind), Kalender der letzten 4 Wochen
(einklappbar), je Bereich eine Karte (Run: Kilometer pro Zeitraum, Pace-Verlauf, Rekorde; Summit: verbesserte Bestzeiten;
Air/Studio: Muskelgruppen der letzten 7 Tage). Nur Bereiche, die im Fokus an sind; der am meisten genutzte steht oben, Run
und Mobility & Stretch immer unten.

**Was ein „Training“ ist:** Alle Timer-Einträge mit höchstens 60 Minuten Abstand gelten als ein Besuch; die Trainingszeit
läuft vom ersten Start bis zum Ende des letzten Timers (`besuche()` in `js/01-basis.js`). Läufe zählen einzeln.

**Timer:** Vollbild mit Fortschrittsring (C60: Walzenzähler), Figur der Übung, Sprachansagen, Töne im Voraus geplant.
Musik anderer Apps läuft weiter.

**Figuren:** Strichfiguren als Skelett mit Gelenken (`ILLU_POSES`/`ILLU_SEQ` in `daten.js`).

## Designs

**System · Hell · Dunkel · Nacht · C60.** Farben nach 60-30-10: ruhige Flächen, Bereichsfarben je Bereich, Akzentfarbe nur für
die Hauptaktion, das Logo und die Arbeitsphase im Timer. „Ausgewählt“ ist ruhig (`--sel-bg`/`--sel-text`).

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
| `js/01-basis.js` … `js/20-walzen-start.js` | Programmlogik in 20 Teilen (je ein Themenbereich: Basis und Speicher, Bibliothek, Router, Start, Suche, Studio, Körperkarte, Statistik, Editor, Lauf, Audio, Timer-Motor …). Es sind gewöhnliche Skripte, die **nacheinander im selben Gültigkeitsbereich** laufen (Reihenfolge = Reihenfolge der `<script>`-Zeilen in `index.html`). **Regel:** Code, der schon beim Laden ausgeführt wird (z. B. `var state = { db: loadDB() }`), darf nur Funktionen aus demselben oder einem früheren Teil aufrufen – beim Laden sind spätere Teile noch nicht da. Deshalb stehen die Verlauf-Hilfen für `loadDB` am Ende von `01-basis.js`. Funktionsaufrufe innerhalb von Funktionen sind unkritisch. |
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
