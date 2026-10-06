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
