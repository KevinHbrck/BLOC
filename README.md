# BLOC – Modular Training Builder (Sport Timer)

Minimalistischer Intervall-Timer für Workouts. Läuft als PWA (Progressive Web App) direkt im
Browser auf iOS und Android, ganz ohne App Store. Zwei Design-Welten zur Wahl: ein schlichtes,
modernes Design (System/Hell/Dunkel) und drei Vintage-Designs – „Retro" mit rot-blauen
Zierstreifen im Sportlook der 70er/80er und „C60" mit rot-orange-gelben Streifen im Stil alter
Kompaktkassetten (Low Noise), beide auf cremefarbenem Papier, sowie „Tapedeck" als dunkles
Nachtdesign wie ein Hi-Fi-Kassettendeck der 80er. Die App spricht Deutsch und Englisch.

## Konzept

- **Block**: eine Übung mit Wiederholungen, z. B. „6 × 30 Sek. Arbeit / 10 Sek. Pause".
- **Workout**: mehrere Blöcke hintereinander, mit einstellbarer Pause zwischen den Blöcken.
- Blöcke werden einmal angelegt und können in beliebig vielen Workouts wiederverwendet werden.

## Funktionen

- Blöcke & Workouts anlegen, bearbeiten, neu anordnen, löschen – beides direkt über das Plus-Menü auf der Startseite („Neues Workout" / „Neuer Block"); jeder Block ist auch einzeln von der Startseite aus startbar
- Bibliothek (eigene Seite, erreichbar über die Startseite): 81 Übungen und 13 fertige Workouts, filterbar nach Cardio, Gewicht, Bodyweight, Rücken, Beine und Bauch/Core; jede Übung und jedes Workout ist direkt startbar, Übungen lassen sich als eigener Block speichern, Workouts per „Übernehmen" als eigenes, bearbeitbares Workout kopieren; nicht benötigte Einträge lassen sich ausblenden und wieder einblenden (definiert in `EXERCISE_ROWS` und `LIB_WORKOUT_ROWS` in index.html)
- Die Bibliothek hat drei Reiter: **Fertige** Workouts, **Eigene** Workouts und **Übungen**; jede Kategorie hat ihre eigene Farbe (Filter-Chips, Start-Knopf, Kategorie-Schildchen, Piktogramm); Übungen lassen sich nach Standard-Reihenfolge oder alphabetisch (A–Z) sortieren
- Eigene Workouts (getrennt von den Timer-Workouts der Startseite, gespeichert als `myWorkouts`): im Baukasten Übungen am Griff per Drag & Drop hineinziehen, umsortieren und auf den Papierkorb am unteren Rand ziehen zum Entfernen – alternativ per + und ×; eigene Pause zwischen den Übungen; fertige Workouts lassen sich per „In Eigene übernehmen" als Ausgangspunkt kopieren
- Übungen haben keine festen Zeiten mehr, sondern Schwierigkeit (Einsteiger/Mittel/Fortgeschritten, `EX_LEVEL`) und Ausrüstung (Ohne Geräte/Kurzhantel/Kettlebell/Stange, `EX_EQUIP`); Filter nach beidem in der Bibliothek und im Baukasten. Die Zeiten legt man erst im Workout fest: „Für alle gleich" (Runden, Arbeit, Pause) oder „Je Übung" (Start mit der Empfehlung, einzeln anpassbar)
- Deckblatt vor jedem fertigen, eigenen oder Überraschungs-Workout: Übersicht (Dauer, Kategorien, Level, Ausrüstung), alles anpassbar ohne zu speichern (Zeiten, Reihenfolge per Drag & Drop, Übungen hinzufügen/entfernen) und optional „Als Eigenes speichern"
- „Überrasch mich": Dauer, Fokus, Intensität und Ausrüstung wählen – die App stellt ein passendes Workout zusammen („Neu mischen" auf dem Deckblatt)
- Sprachansagen auf Englisch in Vorbereitung und Pausen (nächste Übung, Seitenwechsel, letzte Runde) bei fertigen und eigenen Workouts, abschaltbar auf dem Deckblatt und in den Einstellungen
- Reiter **Dehnen** in der Bibliothek: 21 Dehnübungen mit Haltezeiten (meist 30 s je Seite, 5 s zum Umsetzen) und 6 Dehnprogramme (Ganzkörper, nach dem Training Beine bzw. Oberkörper, Rücken & Hüfte, Schultern & Nacken fürs Büro, Morgen-Mobility); im Timer heißt die Phase dann „Halten" bzw. „Seite wechseln"
- Kategorie **Arme** ohne Gewicht (u. a. Liegestütz an der Wand, Diamant-Liegestütz, Handtuch-Curls, Curls gegen die eigene Hand, Rucksack-Curls, Armkreisen) plus fertiges Workout „Arme ohne Geräte"
- **Favoriten**: fertige Workouts, Dehnprogramme und eigene Workouts per ☆ markieren – sie stehen dann ganz oben auf der Startseite und starten mit dem Deckblatt
- Muskeln je Übung (`EX_MUSCLES`): Haupt- und unterstützende Muskeln, bei Dehnübungen die gedehnten Muskeln – in der Info, auf den Bibliothekskarten und in den Übungszeilen von Deckblatt und Baukasten (dort zusammen mit einer kleinen Figur)
- Deckblatt: „Zeiten & Sprachansagen" als zugeklappter Bereich mit Kurzfassung (z. B. „Je Übung · 45 s Pause · Ansagen an")
- Übungen: Suche (Name, Muskeln, Hinweis), Mehrfachauswahl bei Körperbereichen und Ausrüstung („Ausrüstung: Ohne Geräte + Stange“ zeigt alles, was damit geht), Stern für einzelne Übungen – markierte stehen in Bibliothek und Baukasten immer oben; kein Schwierigkeitsgrad mehr (bei „Überrasch mich“ nur noch Intensität Locker/Mittel/Intensiv für die Zeiten)
- Ruhigeres Design: statt vieler Kategorie-Farben eine Akzentfarbe je Design plus Icons für Körperbereiche und Ausrüstung
- **Calisthenics** (früher eigener Reiter, jetzt ein Fokus wie Rücken oder Beine): 22 Übungen an Stange und Barren (Zug, Druck, Core, dynamische Skills) mit Programmen Zug, Druck, Core, Skills und „Calisthenics 60“; neue Ausrüstung „Dip-Barren / Parallettes“
- Bauchübungen ergänzt (Reverse Crunch, V-Ups; Mountain Climbers zählen auch zu Bauch/Core) und Programm „Bauch komplett“ mit 10 Übungen
- Weitere schwere Übungen: Archer-Liegestütz, Pistol Squat, Dragon Flag, Klatsch-Liegestütz, Tuck Jumps
- 60-Minuten-Workouts (Full Body 60, Bodyweight 60, Advanced 60, Calisthenics 60) und 60 Min bei „Überrasch mich“
- Filter als zwei Auswahlknöpfe „Fokus“ (früher „Körperbereich“) und „Ausrüstung“ mit Liste zum Abhaken (Mehrfachauswahl); schlankere Karten – Hinweise, „Als Block“ und „Ausblenden“ stehen in der Info bzw. auf dem Deckblatt
- Startseite mit Titel „BLOC – Modular Training Builder“; in den Einstellungen „App teilen“ (Link kopieren)
- Design „Kodak“ heißt jetzt „C60“ (Schriftzug C60 mit „Modular Training Builder“, Logo mit C)
- Startseite mit aufklappbaren Kacheln (Icon, Titel, Kurzbeschreibung, Anzahl); die Bibliothek-Kachel öffnet direkt die Bibliothek. Frühere Fassung: Startseite mit aufklappbaren Bereichen (Favoriten, Timer-Workouts, Blöcke einzeln starten, Bibliothek), jeweils mit Anzahl; beim ersten Start sind nur die Favoriten offen, danach merkt sich die App den Zustand
- Im Baukasten bleibt die Workout-Liste beim Scrollen oben stehen, damit man Übungen auch von weit unten kurz hineinziehen kann
- Beim Bearbeiten eines Timer-Workouts lassen sich Übungen direkt aus der Bibliothek hinzufügen (mit Kategorie-Filter)
- Info zu jeder Übung („So geht's"): großes animiertes Piktogramm, Anleitung in drei Schritten, Haltung (zwei konkrete Punkte) mit dem häufigsten Fehler unter „Vermeiden" (`EX_POSTURE`, angelehnt an gängige Technikhinweise u. a. von ACE, NSCA und NASM) und Tipp (Deutsch/Englisch, `EX_INFO` in index.html); zu öffnen in der Bibliothek (Info-Knopf oder Tipp aufs Bild) und im Timer über das ⓘ neben dem Übungsnamen – auch in Vorbereitung und Pausen für die anstehende Übung; der Timer läuft dabei sichtbar weiter und lässt sich direkt im Info-Fenster pausieren
- Übungen „je Seite" wechseln im Timer automatisch zwischen „Links" und „Rechts"; der Timer zeigt den Ausführungshinweis der Übung und, wo vorhanden, ein animiertes Piktogramm: für jede der 81 Übungen eine Strichfigur mit zwei Posen im Wechsel (Halteübungen stehen still), mit Geräten wie Hantel, Kettlebell, Stange, Bank und Wand; die Figuren werden aus Gelenkpunkten erzeugt (`ILLU_POSES` in index.html)
- Workouts und Blöcke sind in jedem Design farblich unterschieden (z. B. Hell/Dunkel: Orange/Blau, Retro: Rot/Blau, C60: Orange/Gelb, Tapedeck: Bernstein/Cyan)
- Phasen im Timer: „Los geht's" (Vorbereitung), „Los!" (Arbeit), „Pause" und „Blockpause"
- Vollbild-Timer: im modernen Design mit Fortschrittsring, in den Vintage-Designs mit großem mechanischem Walzenzähler als zentralem Element – wie ein echter Kilometerzähler: jede Stelle ist eine echte 3D-Walze mit rundum aufgedruckten Ziffern hinter einem Glasfenster, gewölbt schattiert, oben und unten sieht man ein Stück der Nachbarziffern; die aktuelle Ziffer dreht nach unten weg, die nächste kommt von oben und rastet mit leichtem Überschwingen ein; höhere Stellen bahnen ihren Wechsel schon einige Sekunden vorher an (bei 1:06 lugt die „0" der Minutenwalze bereits oben ins Fenster), beim Übertrag rastet die Walze links mit leichter mechanischer Verzögerung nach, und jede Walze sitzt minimal schief (Getriebespiel); beim Start, bei „Phase neu" und beim Phasenwechsel drehen die Walzen sichtbar auf den neuen Stand; darunter große Quadrate für die Wiederholungen (erledigte leuchten, die aktuelle pulsiert), damit man den Fortschritt auch aus der Entfernung sieht; jeweils mit Rundenzähler und „Nochmal"-Neustart nach dem Workout
- Play/Pause, Weiter (Skip), Phase neu starten, Beenden mit Bestätigung – alle Symbole sind handgezeichnete SVG-Icons statt Schriftzeichen, damit sie auf jedem Gerät exakt zentriert und klar erkennbar bleiben; die Transportsteuerung in den Vintage-Designs ist an die Tastenreihe eines alten Kassettenrekorders angelehnt (rechteckige Tasten, kräftige Symbole)
- Zurück-Button auf jeder Unterseite (ein eigener Home-Button ist nicht mehr nötig, da fast alles direkt von der Startseite aus erreichbar ist); „Zurück" führt immer zur tatsächlich zuvor besuchten Seite (nicht zu einem festen Ziel)
- Android-Zurück-Taste/-Geste: geht wie der Zurück-Button eine Seite zurück, schließt zuerst ein offenes Fenster und fragt im laufenden Timer nach, ob das Workout beendet werden soll; erst auf der Startseite verlässt sie die App (technisch liegt dafür höchstens ein zusätzlicher Eintrag im Browser-Verlauf)
- Timer im Hintergrund: alle Signaltöne (Phasenwechsel und Countdown) der nächsten ~10 Minuten werden direkt im Audio-Takt vorausgeplant, damit sie auch pünktlich kommen, wenn der Browser die Seite drosselt; kommt man zurück, springt der Timer direkt auf den richtigen Schritt statt nur einen weiter. Grenze: Ist das Handy gesperrt und hält das Betriebssystem die Seite ganz an (v. a. iOS), hilft nur eine native Hülle (z. B. Capacitor mit Foreground-Service)
- **Nochmal wie letztes Mal**: Karte ganz oben auf der Startseite startet das zuletzt gemachte Training direkt – bei Deckblatt-Workouts mit allen Anpassungen von damals (`settings.lastRun`)
- **Anzeige auf dem Sperrbildschirm** (Einstellungen, standardmäßig aus): Übung, Phase, Restzeit und Pause/Weiter/Phase neu in der Benachrichtigung bzw. auf dem Sperrbildschirm (Media Session). Dafür läuft während des Trainings ein stummer Audio-Loop, der die Seite zugleich im Hintergrund wach hält – er kann allerdings Musik aus anderen Apps anhalten
- Bildschirm drehbar: im Querformat steht die Uhr links, Übung, Wiederholungen und Tasten rechts daneben
- **Verlauf** (Kachel auf der Startseite): Kalender mit Trainingstagen, Streak (Tage in Folge), Trainingszeit dieser Woche und insgesamt, Balken für die letzten 8 Wochen, Liste der letzten Trainings (einzeln löschbar); vorzeitig beendete Trainings zählen ab einer Minute mit
- **Workouts teilen**: auf dem Deckblatt und im Baukasten – das Workout steckt komprimiert im Link (`#import/…`), kein Server, kein Konto; wer den Link öffnet, sieht es auf dem Deckblatt und kann es als Eigenes speichern (eigene Übungen reisen mit)
- **Eigene Übungen**: im Reiter „Übungen“ über „Eigene Übung anlegen“ – Name, Fokus, Ausrüstung, je Seite, empfohlene Zeiten, Hinweis; sie erscheinen überall wie Bibliotheksübungen (Baukasten, Filter, Überrasch mich), gespeichert als `customEx`
- Ausblenden direkt auf jeder Karte (Workouts und Übungen): ausgeblendete Einträge stehen unten unter „Ausgeblendet“ und lassen sich dort einzeln wieder einblenden; „Überrasch mich“ nutzt sie nicht
- Übungen, die nur an Stange oder Barren gehen, erscheinen bei einem anderen Fokus (z. B. Rücken) nur, wenn Stange/Barren bei der Ausrüstung gewählt ist oder Calisthenics im Fokus steht
- „Überrasch mich“ mit Regeln: alle gewählten Fokus-Bereiche kommen reihum vor, aufeinanderfolgende Übungen trainieren verschiedene Bereiche, Drücken und Ziehen halten sich die Waage, Übungen der letzten 7 Tage werden gemieden (abschaltbar), zum Einstieg lieber etwas Leichteres
- Datenschutzerklärung (`privacy.html`, Deutsch/Englisch), verlinkt in den Einstellungen; Zoomen ist wieder erlaubt
- Lautstärke jederzeit einstellbar (bis 100 %, unverzerrt) – auch direkt während der Timer läuft (Lautsprecher-Symbol im Player)
- 20 auswählbare Klänge über ein Kachel-Menü in zwei Gruppen:
  - **Natürlich** (Boxring-Glocke, Trillerpfeife, Klangschale, Holzblock, Küchenwecker, Marimba, Triangel, Kuhglocke, Klatschen) – ohne Audiodateien nachgebaut wie echte Klangquellen: unharmonische Obertöne, die unterschiedlich schnell ausklingen, Hammer- bzw. Schlegel-Anschlag, Schwebung, flatternde Pfeifenkugel mit Atemrauschen, mehrstufige Klatsch-Geräusche; zum Workout-Ende je nach Klang Triangel-Wirbel, geschüttelte Kuhglocke oder Applaus
  - **Elektronisch** – 8-Bit-Konsole (Wellenformen alter Spielkonsolen-Soundchips: schmale Rechteckpulse und stufiger 4-Bit-Dreiecks-Bass, eigene kleine Melodien), Klassisch, Doppelton, Sanft, Digital, Glocke, Hupe, Trommel, Arcade, Weich, Ruhe
  - dazu Countdown-Piepsen in den letzten 3 Sekunden (je nach Klang z. B. als Uhrwerk-Ticken oder Fingerschnippen)
  - wer einen inzwischen entfernten Klang eingestellt hatte, bekommt automatisch den ähnlichsten verbliebenen
- Raumklang (abschaltbar): alle Klänge laufen durch einen künstlichen Raumhall mit frühen Reflexionen und Stereo-Breite; ein Begrenzer verhindert Übersteuern auch bei 100 % Lautstärke
- Vibration bei Phasenwechsel (auf unterstützten Geräten, primär Android)
- „Bildschirm an lassen" während des Workouts (Wake Lock)
- Sechs Design-Optionen: **System / Hell / Dunkel** (schlicht, minimalistisch) sowie **Retro** und **C60** (Papier-Optik mit senkrechten Zierstreifen, kursiven Condensed-Überschriften, klassischer Grotesk wie auf alten Kassetten-Etiketten und Monospace-Schrift, Kippschaltern mit „ON/OFF", Fader-Schieberegler und 3D-Walzenzähler; C60 zusätzlich mit Kassetten-Etikett) und **Tapedeck** (dunkles Nachtdesign: glattes schwarzes Gehäuse mit gebürsteten Frontplatten, Rack-Leiste mit Schraublöchern, Beschriftung wie auf einer Hi-Fi-Frontplatte, hinterleuchtetes Zählwerk mit bernsteinfarbenen Ziffern, Anzeigen, die wie Kontrolllampen leuchten – Bernstein für „Los!", Grün für Pause, Cyan für Blockpause – und Bandsorten-Anzeige „Normal / CrO₂ / Metal")
- Sprache Deutsch oder Englisch (in den Einstellungen; ohne eigene Wahl gilt die Sprache des Geräts)
- Nur Systemschriften (wie im Vokabelkasten), ohne Schreibmaschinenschrift: die App lädt keine Schriften und nichts anderes von fremden Servern
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

Das Repository liegt bereits unter [github.com/KevinHbrck/BLOC](https://github.com/KevinHbrck/BLOC). Es fehlt nur noch, GitHub Pages dafür einzuschalten:

1. Auf [github.com/KevinHbrck/BLOC/settings/pages](https://github.com/KevinHbrck/BLOC/settings/pages) gehen.
2. Unter **Build and deployment → Source** die Option **„Deploy from a branch"** wählen.
3. Als Branch **`main`** und als Ordner **`/ (root)`** auswählen, dann **Save**.
4. Nach ein bis zwei Minuten ist die App unter `https://kevinhbrck.github.io/BLOC/` erreichbar.
5. Auf dem iPhone die Seite in Safari öffnen → Teilen-Symbol → **„Zum Home-Bildschirm"**. Ab dann läuft sie wie eine echte App mit dauerhaftem Speicher.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette App (HTML, CSS, JS) |
| `manifest.json` | PWA-Metadaten (Name, Icons, Startseite) |
| `sw.js` | Service Worker für Offline-Nutzung |
| `privacy.html` | Datenschutzerklärung (für App-Stores: `https://kevinhbrck.github.io/BLOC/privacy.html`) |
| `icon.png`, `icon-180.png` | App-Icons (Stoppuhr mit drei Blöcken) |
| `icon.svg` | Vorlage der Icons – bei Änderungen daraus neu erzeugen |
