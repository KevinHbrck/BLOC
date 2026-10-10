# BLOC – Entwicklungsverlauf

Kurze Notizen zu den **letzten Änderungen** (ab 2026-10-05), jeweils mit der Fassung. Ältere Einträge stehen im
[Archiv](docs/VERLAUF-Archiv.md). Den **aktuellen** Stand beschreibt die [README](README.md).

## 2026-10-10 · Workout: Politur (selbst speichern, Fitnessstudio · Freiluft, neue Programme, modernere Gestaltung)

- **Speichert selbst**: Der Baukasten („Workout mit Timer bauen“) sichert jede Änderung sofort, sobald eine Übung drin ist; kein Speichern-Knopf, keine Nachfrage beim Zurück (die Anzeige zeigt „Gespeichert“). Ein neues Workout ohne Übung bleibt unangelegt. Ein neuer Plan ist sofort da; bleibt er leer, wird er beim Verlassen wieder entfernt.
- **Katalog mit demselben Filter wie die Übungen** (Gruppe, Ausrüstung, Körperkarte, Detailansicht; die Auswahl gilt für beide Reiter). Gruppe und Körperkarte: mindestens ein Drittel der Übungen passt; Ausrüstung: jede Übung geht mit dem Gewählten (Körpergewicht braucht nichts). Die Workouts stehen unter denselben Bereichen wie die Übungen, dazu **Ganzkörper**.
- **Ganz vorn im Katalog der Schalter Fitnessstudio · Freiluft** (mit Anzahl; gemerkt in `settings.katOrt`, Standard Freiluft). Fitnessstudio = Workouts mit Geräten oder Langhantel, Freiluft = alles andere.
- **Vier neue Programme fürs Fitnessstudio**: Ganzkörper, Legday, Arme, Tiefenmuskulatur (3 × 40 s, 60 s Pause; Tiefenmuskulatur mit 4 Runden, damit Seitenübungen gleich oft laufen).
- **„Gerät“ heißt „Fitnessstudio“** in der Ausrüstung des Filters.
- **Moderner**: Kapsel-Reiter, größere Ort-Karten, farbige Bereiche (je Körperregion eine Farbe), ruhigere Karten, „Überrasch mich“ als gefüllter Knopf. Schnelltest 31 Prüfungen. Fassung 2026-10-10-35.

## 2026-10-10 · Workout: Air und Studio unter einem Dach (Katalog, Übungen, Meine)

- **Ein Bereich „Workout“** (intern `katalog`) ersetzt die Karten Air und Studio auf der Startseite (`js/11b-katalog.js`; gespeicherte Reihenfolge und Fokus werden gelesen, nichts wird umgeschrieben). Die Routen `#library` und `#timers` führen weiter hierher, die Statistik kennt Air und Studio weiter getrennt.
- **Drei Reiter**: **Katalog** (die fertigen Workouts nach Fokus: Cardio, Gewicht, Bodyweight, Calisthenics, Beine, Rücken, Bauch / Core, Arme, Gemischt) · **Übungen** (alle 204 Übungen nach Bereichen: Brust, Rücken, Schultern, Arme, Bauch & Rumpf, Beine & Po, Cardio & Ausdauer, Eigene) · **Meine** (eigene Workouts mit Timer und Pläne).
- **Zu Beginn nur die Überschriften**: Bereiche sind zugeklappt (mit Anzahl); mit Filter oder Suche stehen die Treffer offen, Antippen klappt auf und zu, beim nächsten Besuch ist wieder alles zu.
- **Zuordnung**: Studio-Übungen behalten ihre Gruppe, Air-Übungen kommen dorthin, wo ihr erster Hauptmuskel liegt, Ausdauerübungen in Cardio (`katGruppeVon`). Die Gruppen-Chips des Filters gelten damit für Air und Studio gemeinsam; der Filter ist der bekannte (Gruppe, Ausrüstung, Körperkarte, Detailansicht).
- **Zwei Einstiege** unter den Reitern: **Überrasch mich** (fragt wie bisher Zeit und Ausrüstung) und **Workout planen**.
- **Plan-Bau** auf den Bereichen: oben die Körperkarte des Plans (viel, am Rande, Lücken), zugeklappte Bereiche zeigen „n gewählt“. **Mit Timer starten** macht aus einem Plan ein Workout mit Timer (Air- und Studio-Übungen hintereinander; eine Kopie unter Meine, die beim erneuten Starten aktualisiert wird).
- Einführung auf vier Seiten (Air und Studio sind eine), „Was ist was?“, Suche und Einstellungen › Fokus kennen den Bereich. Schnelltest angepasst und um den Planer ergänzt (30/30). Fassung 2026-10-10-34 (auf Wunsch: Bereich „Workout“, erster Reiter „Katalog“).
- **Offen für den Feinschliff**: Plan nach Gewichtung zieht weiter nur Studio-Übungen; Übungen neu ausblenden geht noch nicht (schon ausgeblendete stehen unten bei „Ausgeblendet“ mit „Einblenden“); Texte mit „Air“/„Studio“ in Hinweisen und Statistik; Zuordnung einzelner Übungen zu Bereichen.

## 2026-10-10 · Rückmeldungen: Dehnen als Standbild, Detailansicht, verständlicher Installationshinweis

- **Dehnen**: Die 19 gehaltenen Dehnübungen zeigen nur noch die **Endstellung** als Standbild (kein Hin-und-her mehr). In Bewegung bleiben Katze-Kuh, Kobra, World's Greatest Stretch und Armkreisen. Die Halteübungen (Plank, Wandsitz, Dead Hang …) sind unverändert.
- **Körperkarte**: „Grob · Fein“ heißt jetzt **Detailansicht** und ist ein einzelner Schalter (aus = 10 Zonen, an = 21 Zonen; Einstellung `settings.kkFein` bleibt). Die Skala „selten – oft“ unter der Karte in Auswertung und Workout-Kopf entfällt.
- **Installationshinweis** (Startseite, Einstellungen, Anleitung): statt „Für dauerhaften Speicher installieren“ jetzt „Damit deine Daten nicht verloren gehen“ mit einem Satz, warum, und einem, wie.
- Schnelltest an den neuen Schalter angepasst (29/29). Fassung 2026-10-10-32.

## 2026-10-09 · Gesamtdurchgang (Inhalte, Texte, Bedienung, Figuren)

- **Inhalte geprüft (automatisch über alle 227 Übungen)**: Name, Hinweis, Anleitung (3 Schritte), Haltung, Muskeln in Deutsch und Englisch vollständig und gleich lang, keine Doppelleerzeichen, Wortdopplungen oder Zeichenfehler, keine deutschen Umlaute im Englischen; Workouts, Studio-Gruppen, Ketten, Aliase und Aufwärm-Listen verweisen nur auf vorhandene Übungen; Zeiten, Runden und Pausen plausibel.
- **Texte**: 897 Texte, Deutsch und Englisch haben dieselben Schlüssel und Platzhalter. „Air“ auf der Startseite heißt jetzt „Draußen und zu Hause“ (bisher „im Calisthenicspark“, passte seit Band und Kurzhanteln nicht mehr).
- **Bedienung**: Die Statistik hat jetzt wie Suche und Einstellungen einen Zurück-Pfeil.
- **Figuren (alle 227 durchgesehen)**: Kein Kopf mehr abgeschnitten (Wadenmaschine, Beinpresse 45°, einbeiniges Kreuzheben mit Band). L-Sit neu: Stütz auf zwei kleinen Parallettes, erst Beine unten, dann waagerecht (vorher sah es aus wie ein Sitz auf einem Hocker). Fassung 2026-10-09-31.
- Offen/optional: rund 100 ungenutzte Textschlüssel aus früheren Funktionen in `texte.js` (z. B. `fig…`) könnten gelöscht werden; sie schaden nicht.

## 2026-10-09 · Figuren: Dehnen und Halteübungen bewegen sich

- Alle **Dehnübungen** (19) und die **Halteübungen** Kniebeuge halten, Wandsitz, Dead Hang, Plank, Hollow Hold, Hängender L-Sit haben jetzt **zwei Posen: Ausgangsstellung → Dehnung bzw. Haltung**. Die Figur geht also in die Position hinein, statt nur zu stehen (vorher eine einzige Pose, bei manchen kaum zu erkennen).
- **Neu gezeichnet**: Nackendehnung (Kopf kippt zur Seite, Hand am Kopf), Schulter (Arm quer vor der Brust, andere Hand zieht), Trizeps (Ellbogen hoch, Hand im Nacken, andere Hand am Ellbogen), Seitbeuge (Oberkörper kippt über).
- **Nachgeschärft**: Plank Shoulder Taps (eine Hand hebt ab und tippt die Schulter), Scapular Push-ups (die Brust sinkt ab).
- Nur L-Sit und Stütz halten bleiben einzelne Posen (Reck und Barren lassen sich als Ausgangsstellung nicht klar zeichnen). Fassung 2026-10-09-29.
- **Suche**: Dehnübungen erscheinen jetzt ebenfalls als quadratische Kacheln (in der Farbe von Mobility & Stretch), nicht mehr als Zeilen. Fassung 2026-10-09-30.

## 2026-10-09 · Programmlogik in 20 Teile aufgeteilt

- `app.js` (fast 8.000 Zeilen) ist jetzt **`js/01-basis.js` … `js/20-walzen-start.js`**: ein Teil je Themenbereich (Basis/Speicher, Bibliothek, Router, Start, Suche, Studio, Körperkarte, Statistik, Editor, Lauf, Audio, Timer-Motor …), 100 bis 850 Zeilen. Kein Build nötig: gewöhnliche Skripte, die nacheinander im selben Gültigkeitsbereich laufen. Verhalten unverändert (Schnelltest 29/29).
- **Wichtig beim Aufteilen entdeckt:** `loadDB` ruft schon beim Laden `pruneHistory` auf. Stand das in einem späteren Teil, startete die App (wegen `try/catch` unbemerkt) mit leeren Daten. Die Verlauf-Hilfen (`pruneHistory`, `besuche`, `wocheKey` …) stehen deshalb am Ende von `01-basis.js`; die Regel steht in der README (Tabelle „Dateien“).
- `sw.js` listet alle Teile im Offline-Speicher; `?v=` in `index.html` gilt für jede Zeile. Fassung 2026-10-09-28.

## 2026-10-09 · Körperkarte grob/fein, im Workout-Kopf und in Mobility & Stretch; Studio-Ausrüstung

- **Grob · Fein**: überall, wo die Körperkarte steht (Übungsinfo, Workout-Kopf, Auswertung, Filter in Air, Studio, Baukasten, Suche, Mobility & Stretch), gibt es unter der Karte einen Schalter mit Unterstrich. **Grob** (Standard) = 10 Zonen, **Fein** = 21 Zonen und die Silhouetten größer, damit sich kleine Zonen am Handy antippen lassen. Die Wahl gilt für die ganze App (`settings.kkFein`); eine gewählte Zone wandert mit (z. B. „Hintere Schulter“ wird grob zu „Schultern“). Gerechnet wird immer fein, grob fasst zusammen (`KK_F2G`).
- **Workout-Kopf**: Deckblatt und Baukasten zeigen oben die Körperkarte mit **Viel**, **Nur am Rande** und **Lücken** (`kkKopfHTML`).
- **Mobility & Stretch**: dieselbe Körperkarte als Filter (Dehnen und Aufwärmen, `settings.wsZonen`) und im Kopf von Aufwärm- und Dehn-Workouts (dort zählen Dehnübungen mit).
- **Studio**: Langhantel, Kurzhantel & Kettlebell, Stange & Barren, Widerstandsband und Körpergewicht stehen jetzt bei **Ausrüstung**, nicht mehr bei den Gruppen. Die Gruppen sind nur noch die sechs Muskelgruppen; die Langhantel-Übungen stehen in ihrer Muskelgruppe (`STUDIO_GRUPPEN` in `daten.js`). Mit einem Ausrüstungs-Chip stehen die Air-Gruppen offen, sonst zugeklappt unter „Aus Air“ (jetzt vier, neu: Widerstandsband). Alte gespeicherte Gruppen-Chips ziehen automatisch in die Ausrüstung um (`studioFilterAlt`).
- Fassung 2026-10-09-24.
- **Filterkarte aufgeräumt** (alle Filter): Chips ohne Symbole und rund, klarer Abstand zwischen den Abschnitten, Fuß mit Trennlinie. Körper: Überschrift und Grob · Fein in einer Zeile, Silhouetten etwas kleiner, darunter die Auswahl bzw. „Zonen antippen“; die Zonen-Chips stehen unter „Als Liste wählen“ (zugeklappt, Zustand wird gemerkt, `settings.kkListeAuf`). Fassung 2026-10-09-25.
- **Einstellungen einheitlich**: jede Gruppe (Bereiche, Darstellung, Training, Daten) hat Symbol-Kachel + Titel wie die Zeilen unter „Mehr“; Quellen und Datenschutz sehen aus wie die anderen Zeilen (Symbol, gleicher Pfeil); die drei Sicherungs-Knöpfe haben alle ein Symbol; „Alle Daten löschen“ steht abgesetzt und rot am Ende.
- **Suche**: Wer eine Körperzone wählt, sieht auch die **Studio-Übungen als Kacheln** (antippen = Studio-Seite, lange drücken = in Plan legen). Fassung 2026-10-09-27.

## 2026-10-09 · Körperkarte auch im Studio, Unterer Rücken als eigene Zone

- **Studio**: die Filterkarte (Studio › Übungen und beim Zusammenstellen eines Plans) hat jetzt dieselbe Zeile „Körper“ wie Air: Zonen antippen, mehrere möglich; „Zurücksetzen“ löscht sie mit. Gespeichert in `settings.stZonen`.
- **Körperkarte jetzt 10 Zonen**: neu **Unterer Rücken** (hinten, eigene Zone neben Rücken).
- Schnelltest prüft den Studio-Zonenfilter. Fassung 2026-10-09-22.

## 2026-10-09 · Körperkarte zurück auf 17 Zonen, Band-Inhalte gegengeprüft, Figuren nachgeschärft

- **Körperkarte jetzt 9 Zonen** (17 und 21 waren am Handy zu fein). Neu bleibt: Tippen auf die Silhouetten in der Übungsinfo vergrößert sie und nennt die Zonen mit Namen.
- **Band-Inhalte gegen Quellen abgeglichen** (ACE-Übungsbibliothek und -Artikel, THERABAND, NHS Wales; Plausibilitätsprüfung, keine Fachprüfung): u. a. Hinweis zur Schulter beim Aufrechten Rudern, 45°-Grenze beim Beinheben, Hammer-Curl mit Brachialis zuerst, Hinweise beim Klimmzug mit Bandhilfe. Neuer Abschnitt **„Mit dem Band“** in jeder Band-Übungsinfo (Band prüfen, Befestigung, nie unter Spannung loslassen, Dehnungsgrenze). Quellen [12] und [13] in `quellen.html`, Liste der Änderungen in `docs/FACHPRUEFUNG.md`.
- **Figuren**: Band zwischen den Händen liegt bei Reverse Fly jetzt vor dem Körper (Klasse `gv`), Pull-Apart oben als V, Seitbeuge mit Hüftversatz, Muschel (Knie hebt sich deutlich), Beinstrecken im Liegen mit Fußspitze.
- Fassung 2026-10-09-19.

## 2026-10-09 · Körperkarte und Band-Animation

- **Körperkarte** (zwei Silhouetten vorn/hinten, 9 große Zonen (Schultern, Brust, Arme, Rücken, Bauch & Rumpf, Gesäß, Oberschenkel vorn/hinten, Waden), damit sie sich am Handy ohne Zoomen antippen lassen; die Balken der Auswertung bleiben bei den sechs Gruppen): in der **Übungsinfo** (Air und Studio) zeigt sie, was trainiert (kräftig) und unterstützt wird (hell); in der **Auswertung** eines Workouts, Plans und der Woche addieren sich die Gruppen – je öfter, desto kräftiger, darunter steht, was noch fehlt. Beim Workout-Bauen ist die Auswertung gleich aufgeklappt.
- **Filter nach Körperbereich**: in Air › Übungen und im Baukasten (Filterkarte, Zeile „Körper“) sowie in der **Suche** (aufklappbare Zeile): Gruppen antippen, mehrere möglich; es erscheinen Übungen, die diese Gruppen als Hauptmuskeln haben.
- **Band wird gedehnt**: in der Animation läuft das Band mit Händen, Füßen und Knien mit; je länger, desto dünner, kürzer als in Ruhe hängt es durch. Technik: Band-Linien tragen `data-bd` (Marken), `bandSplit` in `app.js` löst sie aus den festen Geräteteilen und zeichnet sie je Bild neu.
- **Suche**: Air-Übungen erscheinen als quadratische Kacheln wie unter Air › Übungen (antippen = Info, ▶, ☆, lange drücken); Studio-Übungen und alle anderen Treffer bleiben Zeilen.
- Schnelltest 29 Prüfungen (neu: Körperkarte in Info, Filter, Auswertung und Suche, Muskelnamen ohne Zone). Fassung 2026-10-09-17.

## 2026-10-09 · Air: Widerstandsband als Gerät

- Neues Gerät **Widerstandsband** (`band`) in der Ausrüstung (Filter in Air › Übungen, Gerät-Symbol auf der Kachel). Die Übung „Klimmzug mit Bandhilfe“ braucht zusätzlich die Stange.
- **38 neue Übungen** in Air (Rücken 5, Brust 5, Schultern 5, Bauch 5, Bizeps 4, Trizeps 5, Gesäß 5, Beine 4), jeweils mit Figur (Band als dünne Linie, Befestigung als Ring), „So geht's“, Haltung und Vermeiden, Hauptmuskeln und Hilfsmuskeln – Deutsch und Englisch. Liste der Übungen nach einem Übungsplakat für Widerstandsband-Training; Texte und Figuren sind eigene Zusammenstellungen.
- **4 Workouts**: Ganzkörper, Oberkörper, Beine & Po und Rumpf mit Band (je 3×40 s / 20 s).
- „Leichter / Schwerer“: Push-ups → Liegestütze mit Band, Klimmzug mit Bandhilfe → Pull-ups, Air Squats → Kniebeuge mit Band.
- **Zweite Ansichten** (Info-Karte): Rumpfdrehung im Sitzen und Kniende Rumpfdrehung von vorn, Kniebeuge von vorn, Hammer-Curl von vorn, Bizeps-Curl von der Seite. Band in der Akzentfarbe, Figuren nachgeschärft (Fassung 2026-10-09-6).
- Technik: Block „Widerstandsband“ am Ende von `daten.js` (Posen aus Winkeln gebaut, trägt sich in die bestehenden Tabellen ein); `EQUIP_ICON.band` in `app.js`, Linienstil `.gb` in `app.css`. Fachprüfung offen (siehe `docs/FACHPRUEFUNG.md`).

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

## 2026-10-06 · Suche mit Kategorien, „Figuren prüfen“ entfernt

- **Suche**: unter dem Suchfeld Kategorien als Chips (Alle · Übungen · Workouts · Challenges · Timer · Bereiche · Erstellen, nach links wischbar). Mit gewählter Kategorie und ohne Suchwort erscheinen alle Einträge dieser Kategorie, mit Suchwort wird darin gesucht; „Alle“ ohne Suchwort zeigt wie bisher den Hinweis (`suchKat`, `suchKategorie`)
- **„Figuren prüfen“ aus den Einstellungen entfernt** (Zeile, Seite `#figuren`, `renderFiguren`, Schnelltest dazu). Zum Prüfen der Figuren bleibt `index.html?dev` (`window.BLOC_DEV`). Schnelltest 25 Prüfungen. Fassung 2026-10-02-52

## 2026-10-06 · Skater komplett neu

- Skater Jumps neu gezeichnet nach Beschreibung und Zeichnung von WorkoutLabs (<https://workoutlabs.com/exercise-guide/skaters/>; nur als Vorlage für Haltung und Ablauf, Figur selbst gezeichnet): Landung auf einem Bein (Knie gebeugt), Oberkörper nach vorn, anderes Bein gebeugt hinter dem Körper, Gegenarm vor dem Körper; kurzer Flug mit beiden Füßen in der Luft. Der Blick bleibt nach rechts, Beine und Arme tauschen die Rollen (`qSwap`) – kein Umdrehen und kein Aufrichten dazwischen; Zyklus ca. 1,5 s. Fassung 2026-10-02-53

## 2026-10-07 · Eine Filterkarte für Air, Studio, Mobility & Stretch und Summit

- **Gemeinsame Filterkarte** (`filterKarteHTML`): zugeklappt eine Zeile „Filter“ mit Zusammenfassung (z. B. „Beine, Kurzhantel“) und Zahl der aktiven Filter; aufgeklappt Chips in Gruppen, unten „Zurücksetzen“ und „N … anzeigen“ (klappt die Karte zu, die Zahl entspricht der Liste). Aufgebaut wie die ältere Filteransicht, im aktuellen Layout.
- **Air**: die vier Kacheln (Kraft · Ausdauer · Rumpf · Stangenpark) entfallen; Filter über Training (Cardio … Calisthenics) und Ausrüstung (Ohne Geräte … Dip-Barren), dazu Sortierung. Auch im Workout-Baukasten dieselbe Karte.
- **Studio-Übungen nicht mehr in Air**: Übungen mit Ausrüstung „Fitnessstudio“ (Geräte, Langhantel, eigene Studio-Übungen) erscheinen in Air weder in der Übungsliste noch im Baukasten; der Chip „Fitnessstudio“ entfällt dort. Kein fertiger Air-Workout enthält solche Übungen. Die Suche über alles findet sie weiterhin.
- **Studio**: Gruppen, Ausrüstung und der Schalter „Air-Übungen“ liegen in derselben Karte. **Fehler behoben:** der Filter klappte nach jeder Auswahl zu, weil das Auf/Zu beim ersten Öffnen nicht gespeichert wurde - Mehrfachauswahl war dadurch mühsam. Jetzt bleibt die Karte offen, bis man sie schließt (beim Start der App wieder zu).
- **Mobility & Stretch** (Dehnen): Körperregionen als Chips in der Karte, auch im Baukasten. **Summit**: Stufe (Einheiten) bzw. Level (Programme) und Ausrüstung in der Karte; Zurücksetzen stellt „Mittel“/„Alle“/„Alle Geräte“ wieder her.
- Schnelltest: neuer Test zur Filterkarte (Air ohne Kacheln und ohne Studio-Übungen, Mehrfachwahl in Air, Studio, Dehnen, Summit), bestehende Tests öffnen die Karte vorher. 26 Prüfungen, alle grün. FASSUNG 2026-10-02-54.

## 2026-10-07 · Filterkarte: Summit-Stufe und Studio-Schalter wieder außerhalb

- **Summit**: Stufe (Einheiten) bzw. Level (Programme) stehen wieder sichtbar über der Filterkarte - das ist die Hauptwahl der Seite und gehört nicht hinter eine zugeklappte Karte. In der Karte bleibt nur die Ausrüstung („Alle Geräte“ / „Ohne Stange“); „Zurücksetzen“ betrifft nur diese.
- **Studio**: „Air-Übungen einbeziehen“ ist eine Einstellung, kein Filter - eigene Zeile über der Karte (auch im Plan-Bau). Die Karte enthält nur noch Gruppen und Ausrüstung.
- Schnelltest angepasst (Summit-Stufe ohne Aufklappen, Zurücksetzen nur für die Ausrüstung); 26 Prüfungen, alle grün. FASSUNG 2026-10-02-55.

## 2026-10-07 · Weniger Erklärtext: „?“ statt grauer Zeilen, leere Favoriten nur eine Zeile

- **Erklärtexte über den Listen** (Air › Übungen, Studio, Timer, Plan, Plan-Bau, Workout-Baukasten, Mobility & Stretch, Summit) stehen nur bei den ersten drei Besuchen einer Seite. Danach sitzt ein kleines „?“ neben der Lupe, das den Text in einem Fenster öffnet. Ein Besuch = die Seite von der Startseite aus betreten; Reiter, Filter und Zurück zählen nicht. Gezählt wird lokal in `settings.hinweise` (nichts verlässt das Gerät). Neu: `hinweise()`, `openHinweise()`.
- **Startseite**: leere Favoriten sind keine Box mehr, sondern eine Zeile neben der Überschrift („Favoriten – mit ☆ markieren, dann stehen sie hier“); mit dem ersten Favoriten verschwindet der Hinweis.
- Das „?“ ist kleiner als Zurück und Lupe, und der Titel wird mit „?“ etwas kleiner, damit „Mobility & Stretch“ nicht umbricht.
- Schnelltest: neuer Test zu den Erklärtexten (Zählung, „?“, Fenster, Startseite); 27 Prüfungen, alle grün. FASSUNG 2026-10-02-56.

## 2026-10-07 · Skater Jumps von vorn

- Skater Jumps jetzt in der **Vorderansicht**: man steht der Figur gegenüber, der Oberkörper bleibt zu uns gedreht, die Bewegung läuft seitlich über das Bild (Landung links → Flug → Landung rechts → Flug zurück). Die Profil-Fassung davor wirkte beim Wechsel der Seite wie eine Drehung um 180°.
- **Rücken tief**: in der Landung tief auf einem Bein, der Rücken stark nach unten gebeugt (von vorn: kurzer Rumpf, Kopf tief, bleibt auch im Flug tief), die Hand der Standseite reicht Richtung Boden, das andere Bein ist hinter dem Standbein gekreuzt, der andere Arm schwingt nach außen.
- Daten: `SK_L`/`SK_AIR` (frontal) vor `ILLU_POSES`, Landung rechts per `qMirror`. FASSUNG 2026-10-02-57; Schnelltest 27/27 grün.

## 2026-10-07 · Kleine graue Zusatztexte entfernt

- Startseite: „gedrückt halten zum Sortieren“ neben **Bereiche** entfällt; der Tipp steht jetzt am Ende von „Was ist was?“.
- „Mehrere möglich“ an den Filtergruppen (Air, Studio, Mobility & Stretch) und im Formular „Eigene Übung“ entfällt - die Chips lassen sich ohnehin einzeln an- und abschalten.
- Bleiben: die Zahlen hinter Gruppennamen (z. B. „Arme 8“, sie sind Information), die Erklärtexte der ersten drei Besuche mit „?“ und der Hinweis bei leeren Favoriten. FASSUNG 2026-10-02-58; Schnelltest 27/27 grün.

## 2026-10-07 · Übungen als quadratische Kacheln mit Muskeln

- **Air › Übungen** und **Mobility & Stretch › Übungen** zeigen die Übungen jetzt wie im Studio als quadratische Kacheln (drei pro Zeile auf dem Handy): Figur, Name und darunter in Kurzform die ersten zwei **Hauptmuskeln** (z. B. „Seitliches Gesäß, Oberschenkel vorn“). Tippen = Übungsinfo (eigene Übung: bearbeiten), ▶ unten links = starten, ☆ = merken, lange drücken = in Workout oder Plan legen. Ausgeblendete Übungen bleiben unten als Zeilen mit „Einblenden“.
- **Studio** (und Plan-Bau, Workout-Baukasten): dieselbe Muskelzeile unter dem Namen; der Strich „–“ ohne Gewicht entfällt, der letzte Satz steht erst, wenn er eingetragen ist.
- Die Übungsinfo hat neu den Knopf „Zu Programm hinzufügen“ (früher nur im ⋯-Menü der Zeile). Die Workout-Listen bleiben Zeilen.
- Schnelltest angepasst (Suche zählt Kacheln, Plan-Bau zählt Muskelzeilen); 27/27 grün. FASSUNG 2026-10-02-59.

## 2026-10-07 · Übungskacheln nachgebessert

- Die **Muskelzeile steht direkt unter dem Namen** (keine Lücke mehr für eine zweite Namenszeile), Schrift 12 px statt 11, bis zu drei Zeilen (auf dem 375-px-Raster passen 102 von 103 Texten vollständig).
- **▶ Start**: 30 px sichtbar, aber 44 px Tippbereich, damit man das ☆ daneben nicht trifft.
- **Gerät auf der Figur**: unten rechts ein kleines Symbol (Kettlebell, Kurzhantel, Stange, Dip-Barren), wenn die Übung ein Gerät braucht; ohne Geräte nichts. Das ersetzt die frühere Zeile „Ohne Geräte · Cardio …“ der Listenansicht.
- FASSUNG 2026-10-02-60; Schnelltest 27/27 grün.

## 2026-10-07 · Schlankere Kopfzone, „Überrasch mich“ in der Leiste, Timer als eigene Seite

- **Reiterzeile statt Karte**: Air, Studio, Mobility & Stretch und Summit haben schlanke Reiter mit Unterstrich in der Farbe des Bereichs (`reiterZeileHTML`, `.rz`) statt einer Karte mit Knöpfen. Das spart Höhe, der aktive Reiter ist eindeutig. Bei Mobility & Stretch bleibt der Umschalter Mobility | Stretch darüber.
- **„Überrasch mich“ in der ersten Leiste von Air**: ein Knopf mit Symbol und Text rechts neben dem Titel, in jedem Reiter erreichbar; die große Karte unter den Reitern entfällt. Steht rechts zusätzlich das „?“ (Erklärtext eingeklappt) oder ist das Handy sehr schmal, zeigt der Knopf nur das Symbol. Neues, klareres Symbol: Zauberstab mit Funken (statt der zwei Sterne).
- **Timer als eigene Seite** (`#intervall`, `renderIntervall`): der Reiter „Timer“ gab es in Air und Studio mit derselben Liste - jetzt je ein Reiter weniger (Air: Workouts · Übungen · Meine; Studio: Übungen · Mein Plan). Der Timer hat auf der Startseite eine schlanke **Schnellwahl** unter den Bereichen („Eigene Intervall-Timer · 3 Workouts · 5 Blöcke“); sie gehört nicht zu den sortierbaren Bereichen und nicht zum Fokus. Alte Adressen (`#blocks`, `#timers/workouts`) und gespeicherte Reiter führen dorthin; die Editoren für Blöcke und Timer-Workouts kehren zur Timer-Seite zurück.
- Filterkarte und Hinweiszeile bleiben unverändert. Schnelltest angepasst (Reiterzeile, Überrasch mich in jedem Reiter, Timer-Seite, Schnellwahl); 27/27 grün. FASSUNG 2026-10-02-61.

## 2026-10-07 · Timer wieder ein Bereich, schmale Überrasch-mich-Leiste, A–Z als Schalter

- **Timer ist wieder ein eigener Bereich** (Schlüssel `intervall`, Seite `#intervall`): auf der Startseite in der Reihenfolge Air · Studio · **Timer** · Summit · Run · Mobility & Stretch, wie die anderen Bereiche per langem Drücken sortierbar und in den Einstellungen unter „Fokus“ abschaltbar, mit eigener Zeile in „Was ist was?“, in der Suche und in der Statistik (eigene Karte „Timer“). Die Schnellwahl unter den Bereichen entfällt. Bestehende Reihenfolgen bekommen den Timer einmalig direkt nach Studio. Neu gestartete eigene Timer-Workouts und Blöcke zählen als Timer, frühere Einträge stehen weiter bei Air.
- **„Überrasch mich“ als schmale Leiste** (eine Zeile, 42 px, Zauberstab-Symbol) direkt unter den Reitern von Air in allen drei Reitern; der Knopf in der ersten Leiste entfällt.
- **Sortierung A–Z als kleiner Schalter** in der Kopfzeile der Filterkarte (rechts neben „Filter“); der Sortier-Block in der Karte entfällt, die Karte wird kürzer. Aus = Standardreihenfolge (Standard bzw. Dauer), an = alphabetisch; gilt auch im Workout-Baukasten.
- Schnelltest angepasst (sechs Bereiche, Reihenfolge, Leiste, A–Z, Fokus, Statistik); 27/27 grün. FASSUNG 2026-10-02-62.

## 2026-10-08 · Studio: Air-Übungen ohne Schalter

- **Der Schalter „Air-Übungen einbeziehen“ ist weg.** Die Air-Übungen (Kurzhantel & Kettlebell, Stange & Barren, Körpergewicht) sind im Studio immer da: Ohne Gruppenwahl stehen sie am Ende der Liste unter **„Aus Air“** als drei schmale, zugeklappte Zeilen mit Zahl (z. B. „Kurzhantel & Kettlebell · 16“). So bleibt die Studio-Liste kurz, und nichts ist versteckt. Antippen klappt eine Zeile auf (`studioAirBlockHTML`, `studioAirBinden`); der Zustand gilt nur für den Besuch und wird nicht gespeichert.
- **Suche** klappt alle Air-Gruppen mit Treffern auf und blendet die ohne Treffer aus; ohne Suchwort stehen sie wieder zugeklappt da. **Gruppen-Chips** (Kurzhantel & Kettlebell, Stange & Barren, Körpergewicht) zeigen die Gruppe offen als eigenen Abschnitt. Dasselbe gilt im Plan-Bau.
- „Plan nach Gewichtung“ zieht weiterhin nur echte Studio-Übungen (`gr.air` wird übersprungen). ★-markierte Air-Übungen folgen jetzt wie alle anderen der Gruppenwahl. Die alte Einstellung `settings.stAir` wird nicht mehr gelesen (bleibt in alten Ständen unbenutzt liegen). Gruppe „Air · Körpergewicht“ heißt jetzt „Körpergewicht“ (steht ja unter „Aus Air“).
- Schnelltest angepasst: kein Schalter, drei zugeklappte Zeilen, Auf-/Zuklappen, Suche, Chip „Stange & Barren“, Zurücksetzen. FASSUNG 2026-10-02-63.
