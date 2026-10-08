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

**Unten eine Leiste: Start · Suche · Statistik · Einstellungen.** Auf den vier Hauptseiten ist der passende Eintrag markiert (kein Zurück-Pfeil in der Kopfzeile, die Zurück-Taste des Handys führt zur Startseite). Auf den Einstiegsseiten der sechs Bereiche steht sie in allen Reitern ohne markierten Eintrag. Weg ist sie im laufenden Training, Timer und Lauf, in Editoren und Baukästen, auf Detailseiten (Workout-Übersicht, Studio-Übung, Studio-Plan, Challenge, Lauf-Detail) und unter Fenstern von unten.

**Plus (rund, unten rechts):** Es steht in jedem Reiter eines Bereichs, in dem man etwas Eigenes anlegen kann, und legt das an, was zum Reiter passt: Air › Workouts und Meine ein eigenes Workout, Air › Übungen eine eigene Übung; Studio › Übungen eine eigene Übung, Studio › Mein Plan ein Menü (Plan · Plan nach Gewichtung); Timer ein Menü (Timer-Workout · Block); Summit › Einheiten eine Einheit, › Programme ein Programm, › Meine ein Menü; Mobility & Stretch in allen Reitern ein eigenes Workout (für Aufwärmen bzw. Dehnen). Run hat nichts Eigenes anzulegen, dort steht kein Plus.

**Startseite:** Wochenzeile (Trainings dieser Woche), Favoriten (☆, höchstens vier sichtbar) und die Bereiche in der
Reihenfolge **Air, Studio, Timer, Summit, Run, Mobility & Stretch** (langes Drücken zum Sortieren). Welche Bereiche sichtbar sind,
stellt man unter **Einstellungen › Fokus** ein (ausgeblendete Bereiche bleiben über die Suche erreichbar).

| Bereich | Inhalt |
|---|---|
| **Air** (intern `lib`) | Drei Reiter: Workouts · Übungen · Meine. Suche, aufklappbare Filterkarte (Training, Ausrüstung, A–Z). „Überrasch mich“. **Meine** = Selbstgebautes (Baukasten, „Sinnvoll ordnen“) |
| **Studio** (intern `timer`) | Geräte- und Hantelübungen, Gewicht × Wiederholungen eintragen, Pause mit Countdown, Verlauf, Steigerungsvorschlag (doppelte Progression), Mein Plan (mehrere Pläne, auch nach Muskelgruppen-Gewichtung). Filter ohne Doppelungen: **Gruppe** (Körperregion) und **Ausrüstung** (Gerät, Kabel, Kurzhantel & Kettlebell, Langhantel, Stange & Barren, Körpergewicht); die Air-Übungen stehen zugeklappt unter „Aus Air“ |
| **Timer** (intern `intervall`) | Eigene Intervall-Timer ohne Übungsvorschläge: Blöcke (eine Übung mit Runden, Arbeit, Pause) und Timer-Workouts aus mehreren Blöcken; Plus-Menü zum Anlegen |
| **Summit** (Challenges, intern `reps`) | Reiter Einheiten · Programme · Meine. Programme auf Zeit, Einheiten in drei Stufen; eigene Programme und eigene Einheiten (+ in Einheiten und Meine) |
| **Run** (intern `run`) | GPS-Lauf: Countdown, Zeit, Strecke, Pace, Kilometer-Zwischenzeiten, Route (ohne Karte, nur als Linie), Ansagen, **Intervall-Lauf** (Laufen/Gehen), **Auto-Pause** (Stehzeit wird herausgerechnet), Abdunkeln, Name und Notiz, GPX-Export. Im Lauf lösen alle Knöpfe erst nach 3 s Halten aus |
| **Mobility & Stretch** (intern `warm`) | Aufwärm- und Dehnprogramme und -übungen, Körperregionen als Filter |

**Statistik** (alles lokal berechnet): Kopf mit Trainings der letzten 7 Tage und Serie, Verlauf als Balken (Zeit oder
Anzahl, **Woche · Monat · Jahr**, nach links wischen für früher, so weit Daten da sind), Kalender der letzten 4 Wochen
(einklappbar), je Bereich eine Karte (Run: Kilometer pro Zeitraum, Pace-Verlauf, Rekorde; Summit: verbesserte Bestzeiten;
Air/Studio: Muskelgruppen der letzten 7 Tage). Nur Bereiche, die im Fokus an sind; der am meisten genutzte steht oben, Run
und Mobility & Stretch immer unten.

**Was ein „Training“ ist:** Alle Timer-Einträge mit höchstens 60 Minuten Abstand gelten als ein Besuch; die Trainingszeit
läuft vom ersten Start bis zum Ende des letzten Timers (`besuche()` in `app.js`). Läufe zählen einzeln.

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
| `index.html` | Gerüst (lädt `app.css`, `texte.js`, `daten.js`, `app.js`) |
| `app.css` | Gestaltung aller Designs |
| `app.js` | Programmlogik (Oberfläche, Timer, Statistik, Run, Speicher) |
| `texte.js` | Alle Oberflächentexte Deutsch/Englisch, **ein Schlüssel pro Zeile** (gut zu vergleichen) |
| `quellen.html` | Quellen und Hintergrund: woran sich BLOC orientiert, was eigene Zusammenstellung ist (aus der App verlinkt) |
| `daten.js` | Inhalte: Übungen, Workouts, Challenges, Anleitungen, Muskeln, Figuren (`window.BLOC_DATEN`) |
| `sw.js` | Service Worker für Offline-Betrieb; **einzige Stelle der Versionsnummer** (`FASSUNG`) |
| `schnelltest.html` | Automatischer Klicktest (nur lokal) |
| `docs/TESTPLAN.md` | Checkliste für das, was der Browser-Test nicht kann (Ton, GPS) |
| `docs/FACHPRUEFUNG.md` | Checkliste für eine fachliche Prüfung der Inhalte durch Trainer/Sportwissenschaft/Physiotherapie |

## Neue Fassung veröffentlichen

1. `FASSUNG` in `sw.js` erhöhen und dieselbe Nummer als `?v=…` an `app.css`, `texte.js`, `daten.js`, `app.js` in `index.html`.
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
