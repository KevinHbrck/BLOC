# BLOC – Modular Training Builder

Trainings-App für Intervall-Workouts, Studio-Training und Challenges. Läuft als PWA direkt im Browser
(Android und iOS), ohne App Store, ohne Konto – alle Daten bleiben auf dem Gerät. Deutsch und Englisch.

Dieses Dokument beschreibt den **aktuellen Stand**. Wie die App dahin gekommen ist, steht in [VERLAUF.md](VERLAUF.md).

## Aufbau

**Startseite:** Wochenzeile (Trainings dieser Woche), Favoriten (☆, höchstens vier sichtbar, Rest über
„Alle anzeigen“) und die Bereiche – **Workouts** als große Karte vorn, darunter als Liste **Freies Training**,
**Challenges** und **Aufwärmen & Dehnen**.
Beim allerersten Start erklärt eine kurze Einführung die Bereiche (später unter Einstellungen).

| Bereich | Inhalt |
|---|---|
| **Workouts** | Reiter Workouts · Übungen · Meine. Suche, Kategorie-Kacheln (Kraft, Ausdauer, Rumpf, Stangenpark), darunter die aufklappbare Filterzeile „Fokus, Ausrüstung & Sortierung“. „Überrasch mich“ oben rechts. **Meine** = alles Selbstgebaute: eigene Workouts (Baukasten: Übungs-Kacheln antippen, Ablauf-Streifen, „Sinnvoll ordnen“, Speichern-Knopf), Timer-Workouts aus Blöcken und Blöcke (Block = eine Übung mit Runden, Arbeit, Pause); das + legt alle drei an |
| **Freies Training** | Das Studio: Geräte- und Hantelübungen, Gewicht × Wiederholungen eintragen, Pause mit Countdown, Verlauf, Steigerungsvorschlag nach doppelter Progression |
| **Challenges** | Reiter Einheiten · Programme · Meine. 52 Programme (nach Bergen benannt) auf Zeit, 12 Einheiten mit Namen (z. B. „3 · Stufenweg“) in drei Stufen, Varianten als Routen; eigene Challenges |
| **Aufwärmen & Dehnen** | Aufwärm- und Dehnprogramme und -übungen |

**Überrasch mich:** Dauer, Kategorien, Ausrüstung, unter „Feinauswahl“ Fokus und Intensität. Regeln: Bereiche
reihum, Drücken/Ziehen im Gleichgewicht, Übungen der letzten 7 Tage meiden, Sternchen-Übungen machen etwa ein
Drittel aus, jedes zweite Workout enthält eine Burpee-Variante. Auf der Übersicht: „Nochmal mischen“ und je
Übung „Andere Übung“.

**Timer:** Vollbild mit Fortschrittsring (C60: Walzenzähler), Figur der Übung, Übungs-Kreise oben, Kästchen je
Runde, Sprachansagen, Töne im Voraus geplant (laufen auch bei gedrosselter Seite pünktlich). Musik anderer Apps
läuft weiter.

**Figuren:** Strichfiguren als Skelett mit Gelenken (`ILLU_POSES`/`ILLU_SEQ` in daten.js); bewegt in Timer, Info
und in allen Übungs-Kacheln (nur sichtbare laufen).

## Designs

**System · Hell · Dunkel · Nacht · C60.** System folgt Hell/Dunkel des Handys, Nacht ist warm mit wenig Blau
(fürs Abendtraining), C60 ist der Kassetten-Look mit Walzenzähler.
Farben nach 60-30-10: ruhige Flächen, vier Bereichsfarben (`--bl-color` Freies Training/Timer, `--tp-color`
Workouts, `--rep-color` Challenges, `--ws-color` Aufwärmen & Dehnen), Akzentfarbe nur für die Hauptaktion,
das Logo und die Arbeitsphase im Timer. „Ausgewählt“ ist ruhig (`--sel-bg`/`--sel-text`).

## Daten und Sicherheit

- Alles liegt im `localStorage` (`sporttimer-data-v1`); die App bittet den Browser um dauerhaften Speicher
  (`navigator.storage.persist`).
- **Sicherung speichern/einlesen** in den Einstellungen (JSON; teilen z. B. nach Drive). Eingelesen werden nur
  echte BLOC-Sicherungen – sie ersetzen alle Daten (mit Rückfrage).
- **Schnappschuss** alle 7 Tage automatisch in IndexedDB, wiederherstellbar in den Einstellungen.
- **Erinnerung** auf der Startseite, wenn es eigene Inhalte gibt und die letzte Sicherung über 14 Tage her ist.

## Technik

| Datei | Zweck |
|---|---|
| `index.html` | Gerüst (lädt `app.css`, `daten.js`, `app.js`) |
| `app.css` | Gestaltung aller Designs (`:root[data-theme]`, C60 zusätzlich `[data-vintage]`) |
| `app.js` | Programmlogik (Oberfläche, Timer, Überrasch mich, Speicher) |
| `daten.js` | Inhalte: Übungen, Workouts, Challenges, Anleitungen, Muskeln, Figuren (`window.BLOC_DATEN`) |
| `sw.js` | Service Worker für Offline-Betrieb; **einzige Stelle der Versionsnummer** (`FASSUNG`) |
| `manifest.json`, `icon*.png`, `icon.svg` | PWA-Angaben und Icons |
| `privacy.html` | Datenschutz und Haftungsausschluss |
| `schnelltest.html` | Automatischer Klicktest (nur lokal) |

- **Offline:** Der Service Worker fragt zuerst das Netz, wartet aber höchstens 2,5 s, wenn eine gespeicherte
  Fassung da ist (`NETZ_WARTEN`) – dann startet die App aus dem Speicher und die neue Fassung lädt im Hintergrund.
- **Neue Fassung veröffentlichen:** `FASSUNG` in `sw.js` erhöhen, damit Handys neu laden – und dieselbe Nummer
  hinten an `app.css?v=…`, `daten.js?v=…` und `app.js?v=…` in `index.html` schreiben (so lädt der Browser sicher
  alle Dateien derselben Fassung).
  Beim Hochladen über die GitHub-Webseite immer **alle geänderten Dateien** gemeinsam hochladen
  (`index.html`, `app.js`, `app.css`, `daten.js`, `sw.js` gehören zusammen) und im Feld „Commit changes“ kurz
  beschreiben, was sich geändert hat.
- **Sprache:** Einstellung, sonst `?lang=de|en` in der Adresse, sonst die Sprache des Geräts.

## Testen

Lokal mit einem kleinen Server starten, z. B.:

```bash
python -m http.server 8788
```

Dann `http://localhost:8788/schnelltest.html?auto` öffnen: Der Test klickt sich in einem eingebetteten Fenster
durch alle Bereiche und meldet Fehler. Er legt den gespeicherten Stand vorher beiseite und stellt ihn danach
wieder her, und er lädt die App immer auf Deutsch (`?lang=de`), damit er auf jedem Browser gleich läuft.

## Veröffentlichen

GitHub Pages aus dem Zweig `main` (Ordner `/`): <https://kevinhbrck.github.io/BLOC/>. Auf dem Handy die Seite
öffnen und „App installieren“ bzw. „Zum Home-Bildschirm“ wählen – installiert bleibt der Speicher dauerhaft.
