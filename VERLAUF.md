# BLOC – Entwicklungsverlauf

Kurze Notizen zu den **letzten Änderungen** (ab 2026-10-05), jeweils mit der Fassung. Ältere Einträge stehen im
[Archiv](docs/VERLAUF-Archiv.md). Den **aktuellen** Stand beschreibt die [README](README.md).

## 2026-10-05 · Run moderner, GPS-Vergleich entfernt

- **GPS-Vergleich (Beta-Test) entfernt**: kein zweiter „ungefährer“ Modus mehr, kein Schalter, keine Vergleichskarte, Texte und Test angepasst (bereits gespeicherte Läufe behalten ihre Daten, der Vergleich wird nur nicht mehr angezeigt)
- **Run neu gestaltet**: Startseite mit großer Kilometer-Summe und rundem Start-Knopf, Verlauf und Ansagen darunter; Live-Ansicht mit sehr großer Zeit, Kennzahlen als Kacheln und GPS-Status als Punkt (grün gut, gelb schwach, rot kein Signal, pulsierend bei Suche); größerer Countdown
- **Routenkarte minimalistisch**: eine ruhige Linie in der Textfarbe, Start als Ring, Ziel als Punkt (live mit sanftem Puls), keine Farben, kein Raster; Bestzeit-Kilometer nur fett. Fassung 2026-10-02-26

## 2026-10-05 · Bodyweight = alles ohne Gerät

- Der Filter **Bodyweight** zeigt jetzt jede Übung ohne Ausrüstung (`bwDazu`): auch Burpees, Jumping Jacks, Mountain Climbers, Planks, Sit-ups usw. – vorher nur die wenigen mit der Kategorie „Bodyweight“. Dehnübungen und Übungen mit Stange/Dip/Geräten zählen nicht dazu; eigene Übungen behalten ihre gewählten Kategorien. Fassung 2026-10-02-27

## 2026-10-05 · Summit: Plus auch bei Einheiten

- Im Reiter **Einheiten** gibt es jetzt unten rechts ein Plus: öffnet direkt „Neue Einheit“ (Programme antippen und hintereinander legen); die eigene Einheit steht danach oben in der Liste. Fassung 2026-10-02-28

## 2026-10-05 · Run: Name/Notiz, Intervall, Auto-Pause, Pace je Kilometer

- **Lauf bearbeiten**: im Detail Name (z. B. „Intervalle“) und Notiz (z. B. „Regen“), werden beim Tippen gespeichert; der Name steht in der Verlaufsliste hinter den Kilometern
- **Intervall-Lauf** (Run-Startseite): Laufen und Gehen in Sekunden einstellbar; im Lauf eine Anzeige „Laufen · 0:42 · Runde 3“, beim Wechsel Signalton, Vibration und Ansage („Laufen!“/„Gehen!“), Tick in den letzten 3 s; gespeichert als `iv`, im Detail „Intervall 1:00 / 1:00“
- **Auto-Pause** (Regler Aus bis 20 s, mindestens 5 s): ohne Bewegung (kein neuer GPS-Schritt, Gerät meldet Tempo <0,5 m/s) pausiert der Lauf, die Stehzeit wird herausgerechnet (Pause beginnt beim letzten Schritt); weiter von selbst bei ≥ 10 m Weg vom Pausenort oder ≥ 1,5 m/s. Herausgerechnete Pausen stehen im Detail (`pause`)
- **Pace je Kilometer** im Detail als Balken (schnellster kräftig), angefangener Rest-Kilometer ab 100 m zuletzt
- Schnelltest 21 Prüfungen (neu: Auto-Pause/Intervall, Name/Notiz). Fassung 2026-10-02-30

## 2026-10-06 · Run: Abdunkeln früher, Knöpfe 3 s halten

- **Abdunkeln** steht als eigener, breiter Knopf ganz oben (Mond-Symbol) und ist schon im Countdown möglich (die Zahl läuft im dunklen Bild weiter und geht nahtlos in Zeit und Kilometer über). Nach dem Lauf, auf der Startseite und im Detail ist der dunkle Bildschirm sicher weg (`runDunkelWeg`)
- **Im normalen Lauf-Bildschirm lösen alle Knöpfe (Abdunkeln, Pause/Weiter, Ansagen, Beenden) erst nach 3 s Gedrückthalten aus** (`runHalten`, `RUN_HALTEN`): der Knopf füllt sich dabei, ein kurzer Tipp tut nichts, Tastatur-Klick löst sofort aus. Hinweis unter den Knöpfen. Aufwecken aus dem Dunkel weiter 2 s halten. Schnelltest 22 Prüfungen. Fassung 2026-10-02-32

## 2026-10-06 · Leiste unten, Statistik, Fokus

- **Leiste unten** (`tabLeiste`, `#tabbar`): Start · Suche · Statistik · Einstellungen, nur auf diesen vier Hauptseiten (in Listen, Editoren und im Training ausgeblendet). Lupe und Zahnrad oben auf der Startseite entfallen
- **Statistik** (`#stats`, `renderStats`): Training (Trainings und Zeit der letzten 7 Tage, Trainings der letzten 30 Tage), Muskelgruppen der letzten 7 Tage (von der Startseite hierher verlegt) und Run (Läufe, Kilometer, km der letzten 7 Tage, längster Lauf, schnellste und Ø-Pace); alles lokal aus den gespeicherten Daten. Die Wochenzeile „Diese Woche“ bleibt auf der Startseite
- **Fokus** ganz oben in den Einstellungen: Schalter je Bereich (Air, Studio, Summit, Mobility & Stretch, Run) – ausgeblendete Bereiche verschwinden von der Startseite (`settings.fokusAus`), Daten und Suche bleiben; sind alle aus, zeigt die Startseite einen Hinweis mit Knopf zu den Einstellungen
- Schnelltest 23 Prüfungen (neu: Leiste, Statistik, Fokus). Fassung 2026-10-02-33

## 2026-10-06 · Statistik nach Fokus und Nutzung, Fokus kompakt

- **Statistik richtet sich nach dem Fokus**: nur eingeschaltete Bereiche erscheinen, der in den letzten 4 Wochen am meisten genutzte steht oben (bei Gleichstand die Reihenfolge der Startseite). Oben ein Überblick (Trainings und Zeit 7 Tage, Trainings 4 Wochen); je Bereich Trainings, Zeit und „Zuletzt“, bei Air und Studio die Muskelgruppen der letzten 7 Tage; Run mit Läufen, Kilometern, längstem Lauf, Paces und **Kilometern pro Woche** (4 Wochen als Balken). Alles ohne Server
- **Verlauf merkt sich den Bereich** (`b` = lib/timer/reps/warm/run in `state.db.history`, `bereichVonQuelle`); ältere Einträge ohne `b` werden geschätzt (Studio, sonst mit Übungen = Air, ohne Übungen = Run). Der Kurz-Verlauf hält jetzt 31 statt 14 Tage (`histKeepDays`), damit die 4-Wochen-Zahlen stimmen
- **Fokus in den Einstellungen kompakt**: fünf Chips in einer Zeile mit Bereichsfarbe statt fünf Schalterzeilen. Schnelltest 23 Prüfungen. Fassung 2026-10-02-34

## 2026-10-06 · Fokus wie Darstellung, Filter starten zugeklappt

- **Fokus** in den Einstellungen im Stil von „Darstellung“: Karte mit Beschriftung „Bereiche auf der Startseite“ und denselben Auswahl-Knöpfen (`.theme-pick`, ausgewählt = an), statt Chips
- **Filter beginnen zugeklappt**: Air-Filter (`libFilterOpen`), Studio-Filter (`stFilterZu`) und Studio-Timer (`stTimerAuf`) wurden bisher dauerhaft offen gemerkt; sie werden jetzt beim Besuch der Startseite zurückgesetzt, innerhalb eines Besuchs bleibt der Zustand. Fassung 2026-10-02-36

## 2026-10-06 · Statistik mit Diagrammen, neue Bereichs-Reihenfolge

- **Statistik einladender**: Kopf mit großer Zahl (Trainings in 7 Tagen), Vergleich zum Zeitraum davor und Wochen-Serie; **Verlauf** über 8 Wochen als Balken (umschaltbar Zeit/Trainings); **Kalender** der letzten 4 Wochen (Tage dunkler je Trainingszeit); je Bereich eine Karte mit Wochenbalken in der Bereichsfarbe; Run mit Kilometern pro Woche, **Pace-Verlauf** der letzten Läufe als Linie mit Trend-Satz und Rekorden (längster Lauf, schnellster Kilometer, schnellste Pace); Summit mit „Bestzeiten verbessert“; Muskelgruppen bei Air und Studio. Ohne Daten ein freundlicher Start mit Platzhalter-Balken
- **Wochensummen** (`settings.statW[Montag] = { n, s, a:{ bereich:{ n, s } } }`): was nach 31 Tagen aus dem Kurz-Verlauf fällt, wird als Wochensumme behalten (höchstens 60 Wochen), damit der Fortschritt über Monate sichtbar bleibt; nur lokal, in Sicherung und Schnappschuss enthalten; Datenschutzseite ergänzt
- **Reihenfolge der Bereiche**: Air, Studio, Summit, Run, Mobility & Stretch (Standard und einmalige Übernahme `bereicheV`); die Statistik stellt weiterhin den zuletzt am meisten genutzten Bereich nach oben. Schnelltest 23 Prüfungen. Fassung 2026-10-02-37

## 2026-10-06 · Run ohne Beta, Run unten in der Statistik

- **„[BETA]“ bei Run entfernt** (Titel, Kachel, Hinweise, Datenschutzseite, Schnelltest)
- **Statistik**: Run steht als zweitletzter Bereich, Mobility & Stretch als letzter; davor die übrigen nach Nutzung. Die Startseite bleibt unverändert (Air, Studio, Summit, Run, Mobility & Stretch). Fassung 2026-10-02-38

## 2026-10-06 · Statistik: Diagramme verschiebbar

- **Verlauf, Wochenbalken je Bereich, Kilometer pro Woche und Pace-Linie lassen sich nach links wischen**, solange Daten da sind (mindestens 8, höchstens 104 Wochen; startet bei „jetzt“ rechts; Balkenbreite fest, `.bscroll`). Pace-Linie zeigt bis zu 60 Läufe, der Trend-Satz nutzt die letzten 12. Fassung 2026-10-02-39

## 2026-10-06 · Statistik: Kalender einklappbar

- „Letzte 4 Wochen“ ist einklappbar (startet zugeklappt, Zeile zeigt die aktiven Tage), die Tage sind je nach Trainingszeit dunkler (Legende „weniger → mehr Trainingszeit“). Fassung 2026-10-02-40

## 2026-10-06 · Besuch-Regel, Statistik über die ganze Zeit, README, Texte ausgelagert

- **Ein Training = ein Besuch**: Timer-Einträge mit höchstens 60 Minuten Abstand zählen zusammen (`besuche()`, `besuchLuecke()`); die Trainingszeit läuft vom ersten Start bis zum Ende des letzten Timers. Gilt für Statistik und Wochenzeile; Läufe zählen einzeln
- **Statistik über die ganze Zeit**: Wochensummen (`settings.statW`) ohne 60-Wochen-Grenze (bis ca. 20 Jahre), jetzt als Besuche archiviert (`bn`/`bs`); Verlauf und Bereichs-Diagramme umschaltbar **Woche · Monat · Jahr** (nach links wischen, so weit Daten da sind; Woche zeigt bis zu 104 Wochen)
- **README neu** (aktueller Stand inkl. Run, Statistik, Leiste, Fokus, Grundsatz „lokal, ohne Server“), **VERLAUF.md gekürzt** (ältere Einträge in `docs/VERLAUF-Archiv.md`), neuer **`docs/TESTPLAN.md`** für Ton und GPS auf dem echten Handy
- **Texte in `texte.js`** (`window.BLOC_TEXTE`, ein Schlüssel pro Zeile statt zwei Zeilen mit je 7.000+ Zeichen); `app.js` nutzt `var I18N = window.BLOC_TEXTE`. `texte.js` steht im Service-Worker-Grundgerüst und in `index.html`. Schnelltest 24 Prüfungen (neu: Besuche, Monat/Jahr, Archiv). Fassung 2026-10-02-43

## 2026-10-06 · Statistik lebendiger

- **Wochenziel-Ring** statt großer Zahl: Trainings dieser Woche (ab Montag) von einem einstellbaren Ziel (1–7, `settings.wochenZiel`, Standard 3), Ring füllt sich animiert, bei erreichtem Ziel „Wochenziel geschafft!“; Vergleich mit der Vorwoche und Serie als Chips
- **Balken in Akzentfarbe** (laufende Woche kräftig, frühere zart) mit Aufbau-Animation, Kalender in Akzentfarbe, **Bereichskarten** mit Farbverlauf und drei Kennzahlen (Trainings, Zeit, Zuletzt; Run: Läufe, km, Zuletzt); Werte unter einer halben Minute zeigen „<1“ statt „0“. Fassung 2026-10-02-44

## 2026-10-06 · Favoriten tragen wieder die Farbe ihres Bereichs

- Favoriten auf der Startseite waren durch eine Designregel (`.list-item .playbtn.bl` → Air-Blau) wieder alle blau. Jetzt: **Air blau** (`tp`), **Studio-Pläne violett** (`st`), **Timer-Workouts und Blöcke hellblau** (`ti`), Summit gold, Mobility grün. Fassung 2026-10-02-45
- Neu im Ordner `promo/`: 30-Sekunden-Werbevideo als HTML (`promo-bloc.html`, gebaut mit `build.sh` aus `promo-template.html` und den Bildschirmfotos in `bilder/`; Musik wird im Browser erzeugt, Aufnahme als MP4/WebM direkt im Browser). Nicht Teil der App-Auslieferung

## 2026-10-06 · Quellen & Substanz, Skater-Figur

- **`quellen.html`** (aus Einstellungen › „Quellen & Hintergrund“, aus den Info-Hinweisen und aus der Statistik verlinkt): ehrliche Vorbemerkung (eigene Zusammenstellungen, nicht fachlich geprüft), Tabelle „woran sich BLOC orientiert“ und 11 geprüfte Quellen (WHO 2020, Nationale Empfehlungen 2016, ACSM 2009 und 2011, Schoenfeld 2016, Buchheit & Laursen 2013, Tabata 1996, Behm 2016, NHS, ACE). Deutsch und Englisch; im Service-Worker-Grundgerüst
- **Statistik › Bewegungsempfehlung**: Bewegung dieser Woche (Ziel 150 min) und Krafttage (Ziel 2) als Balken, mit Link zu den Quellen; Mobility & Stretch zählt nicht mit
- **`docs/FACHPRUEFUNG.md`**: Checkliste für eine Prüfung der Inhalte durch eine Fachperson
- **Figur Skater Jumps** neu nach dem seitlichen Ausfallschritt (Standbein gebeugt, anderes Bein seitlich gestreckt, Hand Richtung Fuß; Vorderansicht); **Pistol Squat**: Spielbein in der Ausgangshaltung nach vorn gestreckt. Entwicklungshilfe `?dev` (`window.BLOC_DEV`) zum Prüfen der Figuren. Fassung 2026-10-02-46

## 2026-10-06 · Wochenziel zählt Trainingstage

- Das Wochenziel (1–7) und der Ring zählen jetzt **verschiedene Tage mit Training**, nicht mehr Einheiten: mehrere Trainings am selben Tag sind ein Tag; der Vergleich mit der Vorwoche zählt ebenfalls Tage („In der Vorwoche: 4“). Beschriftungen angepasst („Trainingstage diese Woche“, „von 3 Tagen“, „Wochenziel (Tage)“). Fassung 2026-10-02-47

## 2026-10-06 · Drei kleine Hilfen (schlank)

- **„Was ist was?“**: Link neben „Bereiche“ auf der Startseite (`.sec-link`), öffnet fünf Zeilen Klartext zu Air, Studio, Summit, Run, Mobility; die Startseite selbst bleibt unverändert
- **Bestleistung bemerken** (Studio): trägt man einen Satz mit mehr als dem bisherigen Bestgewicht ein, zeigt die Karte eine ruhige Zeile „Neue Bestleistung · 120 kg × 10 · vorher 117,5 kg“ (`studioPR`); verschwindet bei „Letzten Satz löschen“ oder beim Verlassen der Karte. Der Verlauf selbst (Kurve, Bestwert, letzte Einheiten) gab es schon
- **Leichter / Schwerer** in der Übungsinfo („Passt es nicht?“): zwei Knöpfe zur nächst leichteren und nächst schwereren Übung (`LZ_KETTEN` in `daten.js`, 9 Ketten, ca. 35 Übungen; nicht fachlich geprüft, siehe `quellen.html`)
- Schnelltest 25 Prüfungen. Fassung 2026-10-02-49

## 2026-10-06 · Skater: ruhigere Bewegung

- Skater Jumps: die Bewegung lief über ein aufrechtes Stehen in der Mitte und wirkte wie hektisches Hüpfen. Jetzt: Landung (seitlicher Ausfallschritt) → **tiefer, breiter Stand in der Mitte** → Gegenseite, weich überblendet, Zyklus ca. 1,6 s. Fassung 2026-10-02-50

## 2026-10-06 · Timer-Ring repariert

- Beim laufenden Timer erschien außen ein zweiter, dicker Ring: meine Statistik-CSS (Wochenziel-Ring) nutzte dieselben Klassennamen (`.ring-bg`, `.ring-bar`) wie der Timer und überschrieb dessen dünnen Ring. Der Statistik-Ring heißt jetzt `.stat-ring` / `.sr-bg` / `.sr-bar` / `.sr-mitte`; der Timer sieht wieder aus wie vorher. Lehre: neue Klassen für Statistik/Hilfen mit eigenem Präfix. Fassung 2026-10-02-51
