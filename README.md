# Sport Timer

Minimalistischer Intervall-Timer für Workouts. Läuft als PWA (Progressive Web App) direkt im
Browser auf iOS und Android, ganz ohne App Store. Zwei Design-Welten zur Wahl: ein schlichtes,
modernes Design (System/Hell/Dunkel) und drei Vintage-Designs – „Retro" mit rot-blauen
Zierstreifen im Sportlook der 70er/80er und „Kodak" mit rot-orange-gelben Streifen im Stil alter
Kodak-Kassetten (C60 Low Noise), beide auf cremefarbenem Papier, sowie „Tapedeck" als dunkles
Nachtdesign wie ein Hi-Fi-Kassettendeck der 80er. Die App spricht Deutsch und Englisch.

## Konzept

- **Block**: eine Übung mit Wiederholungen, z. B. „6 × 30 Sek. Arbeit / 10 Sek. Pause".
- **Workout**: mehrere Blöcke hintereinander, mit einstellbarer Pause zwischen den Blöcken.
- Blöcke werden einmal angelegt und können in beliebig vielen Workouts wiederverwendet werden.

## Funktionen

- Blöcke & Workouts anlegen, bearbeiten, neu anordnen, löschen – beides direkt über das Plus-Menü auf der Startseite („Neues Workout" / „Neuer Block"); jeder Block ist auch einzeln von der Startseite aus startbar
- Workouts und Blöcke sind in jedem Design farblich unterschieden (z. B. Hell/Dunkel: Orange/Blau, Retro: Rot/Blau, Kodak: Orange/Gelb, Tapedeck: Bernstein/Cyan)
- Phasen im Timer: „Los geht's" (Vorbereitung), „Los!" (Arbeit), „Pause" und „Blockpause"
- Vollbild-Timer: im modernen Design mit Fortschrittsring, in den Vintage-Designs mit großem mechanischem Walzenzähler als zentralem Element – wie ein echter Kilometerzähler: jede Stelle ist eine echte 3D-Walze mit rundum aufgedruckten Ziffern hinter einem Glasfenster, gewölbt schattiert, oben und unten sieht man ein Stück der Nachbarziffern; die aktuelle Ziffer dreht nach unten weg, die nächste kommt von oben und rastet mit leichtem Überschwingen ein; höhere Stellen bahnen ihren Wechsel schon einige Sekunden vorher an (bei 1:06 lugt die „0" der Minutenwalze bereits oben ins Fenster), beim Übertrag rastet die Walze links mit leichter mechanischer Verzögerung nach, und jede Walze sitzt minimal schief (Getriebespiel); beim Start, bei „Phase neu" und beim Phasenwechsel drehen die Walzen sichtbar auf den neuen Stand; darunter große Quadrate für die Wiederholungen (erledigte leuchten, die aktuelle pulsiert), damit man den Fortschritt auch aus der Entfernung sieht; jeweils mit Rundenzähler und „Nochmal"-Neustart nach dem Workout
- Play/Pause, Weiter (Skip), Phase neu starten, Beenden mit Bestätigung – alle Symbole sind handgezeichnete SVG-Icons statt Schriftzeichen, damit sie auf jedem Gerät exakt zentriert und klar erkennbar bleiben; die Transportsteuerung in den Vintage-Designs ist an die Tastenreihe eines alten Kassettenrekorders angelehnt (rechteckige Tasten, kräftige Symbole)
- Zurück-Button auf jeder Unterseite (ein eigener Home-Button ist nicht mehr nötig, da fast alles direkt von der Startseite aus erreichbar ist); „Zurück" führt immer zur tatsächlich zuvor besuchten Seite (nicht zu einem festen Ziel); der Browser-Verlauf bleibt dabei flach, damit die Android-Zurück-Geste die App zügig verlässt statt sich erst durch die komplette In-App-Historie zu arbeiten
- Lautstärke jederzeit einstellbar (bis 100 %, unverzerrt) – auch direkt während der Timer läuft (Lautsprecher-Symbol im Player)
- 20 auswählbare Klänge über ein Kachel-Menü in zwei Gruppen:
  - **Natürlich** (Boxring-Glocke, Trillerpfeife, Klangschale, Holzblock, Küchenwecker, Marimba, Triangel, Kuhglocke, Klatschen) – ohne Audiodateien nachgebaut wie echte Klangquellen: unharmonische Obertöne, die unterschiedlich schnell ausklingen, Hammer- bzw. Schlegel-Anschlag, Schwebung, flatternde Pfeifenkugel mit Atemrauschen, mehrstufige Klatsch-Geräusche; zum Workout-Ende je nach Klang Triangel-Wirbel, geschüttelte Kuhglocke oder Applaus
  - **Elektronisch** – 8-Bit-Konsole (Wellenformen alter Spielkonsolen-Soundchips: schmale Rechteckpulse und stufiger 4-Bit-Dreiecks-Bass, eigene kleine Melodien), Klassisch, Doppelton, Sanft, Digital, Glocke, Hupe, Trommel, Arcade, Weich, Ruhe
  - dazu Countdown-Piepsen in den letzten 3 Sekunden (je nach Klang z. B. als Uhrwerk-Ticken oder Fingerschnippen)
  - wer einen inzwischen entfernten Klang eingestellt hatte, bekommt automatisch den ähnlichsten verbliebenen
- Raumklang (abschaltbar): alle Klänge laufen durch einen künstlichen Raumhall mit frühen Reflexionen und Stereo-Breite; ein Begrenzer verhindert Übersteuern auch bei 100 % Lautstärke
- Vibration bei Phasenwechsel (auf unterstützten Geräten, primär Android)
- „Bildschirm an lassen" während des Workouts (Wake Lock)
- Sechs Design-Optionen: **System / Hell / Dunkel** (schlicht, minimalistisch) sowie **Retro** und **Kodak** (Papier-Optik mit senkrechten Zierstreifen, kursiven Condensed-Überschriften, klassischer Grotesk wie auf alten Kassetten-Etiketten und Monospace-Schrift, Kippschaltern mit „ON/OFF", Fader-Schieberegler und 3D-Walzenzähler; Kodak zusätzlich mit Kassetten-Etikett) und **Tapedeck** (dunkles Nachtdesign: glattes schwarzes Gehäuse mit gebürsteten Frontplatten, Rack-Leiste mit Schraublöchern, Beschriftung wie auf einer Hi-Fi-Frontplatte, hinterleuchtetes Zählwerk mit bernsteinfarbenen Ziffern, Anzeigen, die wie Kontrolllampen leuchten – Bernstein für „Los!", Grün für Pause, Cyan für Blockpause – und Bandsorten-Anzeige „Normal / CrO₂ / Metal")
- Sprache Deutsch oder Englisch (in den Einstellungen; ohne eigene Wahl gilt die Sprache des Geräts)
- Die Schriften der Vintage-Designs kommen von Google Fonts und werden vom Service Worker für die Offline-Nutzung zwischengespeichert
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
