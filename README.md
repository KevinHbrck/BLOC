# Sport Timer

Minimalistischer Intervall-Timer für Workouts. Läuft als PWA (Progressive Web App) direkt im Browser auf iOS und Android, ganz ohne App Store.

## Konzept

- **Block**: eine Übung mit Wiederholungen, z. B. „6 × 30 Sek. Arbeit / 10 Sek. Pause".
- **Workout**: mehrere Blöcke hintereinander, mit einstellbarer Pause zwischen den Blöcken.
- Blöcke werden einmal angelegt und können in beliebig vielen Workouts wiederverwendet werden.

## Funktionen

- Blöcke & Workouts anlegen, bearbeiten, neu anordnen, löschen – jeder Block ist auch einzeln von der Startseite aus startbar
- Vollbild-Timer mit Fortschrittsring, Phasenanzeige (Arbeit/Pause/Blockpause), Rundenzähler, „Nochmal"-Neustart nach dem Workout
- Play/Pause, Weiter (Skip), Phase neu starten, Beenden mit Bestätigung
- Lautstärke jederzeit einstellbar – auch direkt während der Timer läuft (Lautsprecher-Symbol im Player)
- Vier auswählbare Klänge (Klassisch, Doppelton, Sanft, Xylophon) + Countdown-Piepsen in den letzten 3 Sekunden
- Sprachansage (optional): sagt Phase, Übungsname und „3, 2, 1" laut an
- Vibration bei Phasenwechsel (auf unterstützten Geräten, primär Android)
- „Bildschirm an lassen" während des Workouts (Wake Lock)
- Hell-/Dunkel-/Systemdesign
- Direkter „Jetzt installieren"-Button auf Android/Chrome, Schritt-für-Schritt-Anleitung für iOS
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

1. Neues Repository auf GitHub anlegen, z. B. `SportTimer`.
2. Dieses Verzeichnis pushen:
   ```bash
   git remote add origin https://github.com/<dein-user>/SportTimer.git
   git push -u origin main
   ```
3. In den Repository-Einstellungen unter **Pages** als Quelle den `main`-Branch (Root) auswählen.
4. Die App ist danach unter `https://<dein-user>.github.io/SportTimer/` erreichbar.
5. Auf dem iPhone die Seite in Safari öffnen → Teilen-Symbol → **„Zum Home-Bildschirm"**. Ab dann läuft sie wie eine echte App mit dauerhaftem Speicher.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette App (HTML, CSS, JS) |
| `manifest.json` | PWA-Metadaten (Name, Icons, Startseite) |
| `sw.js` | Service Worker für Offline-Nutzung |
| `icon.png`, `icon-180.png` | App-Icons |
