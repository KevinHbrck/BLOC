# Sport Timer

Minimalistischer Intervall-Timer für Workouts. Läuft als PWA (Progressive Web App) direkt im
Browser auf iOS und Android, ganz ohne App Store. Zwei Design-Welten zur Wahl: ein schlichtes,
modernes Design und ein Retro-Design im Stil analoger Fahrzeug-Cockpit-Instrumente der späten
80er/frühen 90er (VW Golf 2, Audi 80, VDO).

## Konzept

- **Block**: eine Übung mit Wiederholungen, z. B. „6 × 30 Sek. Arbeit / 10 Sek. Pause".
- **Workout**: mehrere Blöcke hintereinander, mit einstellbarer Pause zwischen den Blöcken.
- Blöcke werden einmal angelegt und können in beliebig vielen Workouts wiederverwendet werden.

## Funktionen

- Blöcke & Workouts anlegen, bearbeiten, neu anordnen, löschen – jeder Block ist auch einzeln von der Startseite aus startbar
- Vollbild-Timer: im modernen Design mit Fortschrittsring, im Retro-Design mit großem mechanischem Walzenzähler als zentralem Element (wie ein echter Kilometerzähler: die neue Ziffer rollt von oben ein, die alte rutscht nach unten weg); jeweils mit Rundenzähler und „Nochmal"-Neustart nach dem Workout
- Play/Pause, Weiter (Skip), Phase neu starten, Beenden mit Bestätigung
- Home-Button auf jeder Unterseite, um mit einem Tap zur Startseite zurückzukehren; „Zurück" führt immer zur tatsächlich zuvor besuchten Seite (nicht zu einem festen Ziel)
- Lautstärke jederzeit einstellbar (bis 100 %, unverzerrt) – auch direkt während der Timer läuft (Lautsprecher-Symbol im Player)
- 15 auswählbare Klänge über ein Kachel-Menü (u. a. Klassisch, Xylophon, Hupe, Gong, Pong, Arcade, Laser, Sirene) + Countdown-Piepsen in den letzten 3 Sekunden
- Vibration bei Phasenwechsel (auf unterstützten Geräten, primär Android)
- „Bildschirm an lassen" während des Workouts (Wake Lock)
- Fünf Design-Optionen: **System / Hell / Dunkel** (schlicht, minimalistisch) sowie **Retro Hell / Retro Dunkel** (analoges Cockpit-Design: warmes Beige/Senfgelb bzw. Anthrazit/gedämpftes Rot-Orange, Monospace-Schrift, robuste Tasten mit Kunststoff-Bevel-Optik)
- Direkter „Jetzt installieren"-Button auf Android/Chrome, Schritt-für-Schritt-Anleitung für iOS
- „App verlassen"-Button auf der Startseite (versucht das Fenster zu schließen, sonst Hinweis zum manuellen Schließen)
- Backup als JSON exportieren/importieren
- Funktioniert offline (Service Worker)

## Warum PWA statt nur HTML-Datei?

Safari auf iOS löscht den lokalen Speicher (`localStorage`) von normalen Browser-Tabs nach ca. 7 Tagen Inaktivität. Eine über „Zum Home-Bildschirm hinzufügen" installierte PWA läuft als eigenständige App und ist davon nicht betroffen. Deshalb besteht das Projekt aus `index.html` + `manifest.json` + `sw.js` + Icons – identisch zur Struktur von [Vokabelkasten](https://kevinhbrck.github.io/Vokabelkasten/).

Zur Sicherheit gibt es zusätzlich Backup-Export/Import in den Einstellungen (JSON-Datei).

## Lokal testen

Einfach `index.html` per Doppelklick öffnen, oder mit einem kleinen lokalen Server:

```bash
python -m http.server 8080
```

und dann `http://localhost:8080` öffnen.

## Auf GitHub Pages veröffentlichen

Das Repository liegt bereits unter [github.com/KevinHbrck/Timer](https://github.com/KevinHbrck/Timer). Es fehlt nur noch, GitHub Pages dafür einzuschalten:

1. Auf [github.com/KevinHbrck/Timer/settings/pages](https://github.com/KevinHbrck/Timer/settings/pages) gehen.
2. Unter **Build and deployment → Source** die Option **„Deploy from a branch"** wählen.
3. Als Branch **`main`** und als Ordner **`/ (root)`** auswählen, dann **Save**.
4. Nach ein bis zwei Minuten ist die App unter `https://kevinhbrck.github.io/Timer/` erreichbar.
5. Auf dem iPhone die Seite in Safari öffnen → Teilen-Symbol → **„Zum Home-Bildschirm"**. Ab dann läuft sie wie eine echte App mit dauerhaftem Speicher.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette App (HTML, CSS, JS) |
| `manifest.json` | PWA-Metadaten (Name, Icons, Startseite) |
| `sw.js` | Service Worker für Offline-Nutzung |
| `icon.png`, `icon-180.png` | App-Icons |
