/* BLOC – Inhaltsdaten: Übungen, fertige Workouts, Kategorien, Anleitungen und Posen der Figuren.
   Unverändert aus index.html herausgelöst. index.html entpackt window.BLOC_DATEN am Anfang
   des Haupt-Skripts wieder in dieselben Variablennamen - der übrige Code bleibt gleich. */
(function(){
"use strict";

/* Zusammengelegte Dubletten: alte Übungs-ID -> Übung, die bleibt. Gespeicherte Workouts,
   Favoriten und geteilte Links mit alten IDs funktionieren so weiter. */
var EX_ALIAS = {
  "archer-row":"inverted-rows", "straight-bar-dips":"parallel-bar-dips", "korean-dips":"parallel-bar-dips",
  "bar-traverse":"monkey-bar-traverse", "slow-mountain-climbers":"mountain-climbers",
  "hip-hinge":"good-mornings", "leg-levers":"leg-raises",
  /* aussortiert (2026-09): die nächstliegende verbliebene Übung übernimmt */
  "wall-push-ups":"push-ups", "backpack-triceps":"triceps-curls", "human-flag":"hanging-l-sit"
};

/* Übungen und fertige Workouts aus der Übungsbibliothek. Sie liegen im Code, nicht im Speicher:
   Sie bleiben immer unverändert. „Übernehmen“ legt eigene, bearbeitbare Blöcke/Workouts an,
   „Ausblenden“ versteckt einen Eintrag (settings.hiddenLib), er lässt sich wieder einblenden.
   Pause innerhalb eines Blocks immer 10 s. „je Seite“: sides=true, reps zählt dann beide Seiten. */
var LIB_CATS = [
  { id:"cardio", de:"Cardio",     en:"Cardio" },
  { id:"weight", de:"Gewicht",    en:"Weights" },
  { id:"bw",     de:"Bodyweight", en:"Bodyweight" },
  { id:"back",   de:"Rücken",     en:"Back" },
  { id:"legs",   de:"Beine",      en:"Legs" },
  { id:"core",   de:"Bauch / Core", en:"Abs / Core" },
  { id:"arms",   de:"Arme",       en:"Arms" },
  { id:"calis",  de:"Calisthenics", en:"Calisthenics" },
  { id:"stretch", de:"Dehnen",    en:"Stretching" }
];
/* [id, Name DE, Name EN, Kategorien, Runden (je Seite: pro Seite), Arbeit s, je Seite?, Hinweis DE, Hinweis EN] */
var EXERCISE_ROWS = [
  ["burpees","Burpees","Burpees","cardio",6,30,0,"Ganzkörper, kontrolliertes Tempo","Full body, controlled pace"],
  ["jump-squats","Jump Squats","Jump Squats","cardio legs",6,30,0,"Explosiv, weich landen","Explosive, land softly"],
  ["mountain-climbers","Mountain Climbers","Mountain Climbers","cardio core",6,30,0,"Rumpf stabil","Keep your core stable"],
  ["high-knees","High Knees","High Knees","cardio",6,30,0,"Aktiver Armeinsatz","Drive your arms"],
  ["jumping-jacks","Jumping Jacks","Jumping Jacks","cardio",6,30,0,"Gleichmäßiger Rhythmus","Steady rhythm"],
  ["skater-jumps","Skater Jumps","Skater Jumps","cardio",6,30,0,"Seitliche Belastung","Lateral loading"],
  ["jump-lunges","Jump Lunges","Jump Lunges","cardio legs",6,30,0,"Beinwechsel im Sprung, weich landen","Switch legs in the air, land softly"],
  ["plank-burpees","Plank Burpees","Plank Burpees","cardio",6,30,0,"Ohne Liegestütz und Sprung möglich","Can be done without push-up and jump"],
  ["burpee-squat-jumps","Burpee Squat Jumps","Burpee Squat Jumps","cardio",5,30,0,"Fortgeschritten","Advanced"],
  ["jump-forward-squats","Jump Forward Squats","Jump Forward Squats","cardio legs",6,30,0,"Weit nach vorn springen, weich landen","Jump far forward, land softly"],
  ["jump-forward-burpees","Jump Forward Burpees","Jump Forward Burpees","cardio",5,30,0,"Burpee, dann weit nach vorn springen","Burpee, then jump far forward"],
  ["frogs","Frogs","Frogs","cardio",6,30,0,"Aus tiefer Position explosiv","Explode from a deep position"],
  ["stand-up-jumps","Stand-up Jumps","Stand-up Jumps","cardio",5,20,0,"Fortgeschritten, sauber aufstehen","Advanced, stand up cleanly"],
  ["lateral-hops","Lateral Hops","Lateral Hops","cardio",6,30,0,"Kleine schnelle Seitensprünge","Small, quick side hops"],
  ["fast-feet","Fast Feet","Fast Feet","cardio",8,20,0,"Kurze, schnelle Bodenkontakte","Short, quick ground contacts"],
  ["box-step-ups","Box Step-ups schnell","Fast Box Step-ups","cardio",6,30,0,"Stabile Stufe verwenden","Use a stable step"],
  ["sprint-in-place","Sprint auf der Stelle","Sprint in Place","cardio",8,20,0,"Maximal kontrollierbares Tempo","Fastest pace you can control"],

  ["goblet-squat","Goblet Squat","Goblet Squat","weight",6,30,0,"Gewicht vor der Brust","Weight held at your chest"],
  ["kb-swing","Kettlebell Swing","Kettlebell Swing","weight",6,30,0,"Kraft aus der Hüfte","Power from the hips"],
  ["db-thruster","Dumbbell Thruster","Dumbbell Thruster","weight",5,30,0,"Kniebeuge plus Schulterdrücken","Squat plus overhead press"],
  ["romanian-deadlift","Romanian Deadlift","Romanian Deadlift","weight",6,30,0,"Rücken neutral","Neutral back"],
  ["db-deadlift","Dumbbell Deadlift","Dumbbell Deadlift","weight",6,30,0,"Gewichte körpernah","Keep the weights close"],
  ["bent-over-row","Bent-over Row","Bent-over Row","weight",6,30,0,"Schulterblätter zurück","Squeeze shoulder blades back"],
  ["one-arm-row","Einarmiges Rudern","One-arm Row","weight",3,30,1,"Seite nach jedem Intervall wechseln","Switch sides after each interval"],
  ["floor-press","Floor Press","Floor Press","weight",6,30,0,"Am Boden, kontrolliert","On the floor, controlled"],
  ["shoulder-press","Shoulder Press","Shoulder Press","weight",5,30,0,"Rumpf fest","Brace your core"],
  ["push-press","Push Press","Push Press","weight",6,30,0,"Leichter Impuls aus den Beinen","Slight drive from the legs"],
  ["weighted-reverse-lunge","Reverse Lunge mit Gewicht","Weighted Reverse Lunge","weight",6,30,0,"Alternierend","Alternate legs"],
  ["front-rack-carry","Front Rack Carry","Front Rack Carry","weight",6,40,0,"Aufrechte Haltung","Stand tall"],
  ["farmer-carry","Farmer Carry","Farmer Carry","weight",6,40,0,"Schwere, sichere Last","Heavy but safe load"],
  ["kb-clean","Kettlebell Clean","Kettlebell Clean","weight",4,20,1,"Technik vor Tempo","Technique before speed"],
  ["renegade-row","Renegade Row","Renegade Row","weight",5,20,0,"Breiter stabiler Stand","Wide, stable stance"],

  ["push-ups","Push-ups","Push-ups","bw",6,20,0,"Bei Bedarf auf Knien","On your knees if needed"],
  ["pike-push-ups","Pike Push-ups","Pike Push-ups","bw",5,20,0,"Schulterfokus","Shoulder focus"],
  ["triceps-dips","Triceps Dips","Triceps Dips","bw arms",5,20,0,"Stabile Bank oder Stuhl","Stable bench or chair"],
  ["squat-hold","Squat Hold","Squat Hold","bw",6,30,0,"Spannung halten","Hold the tension"],
  ["walking-lunges","Walking Lunges","Walking Lunges","bw",6,30,0,"Kontrollierte Schritte","Controlled steps"],
  ["reverse-lunges","Reverse Lunges","Reverse Lunges","bw legs",6,30,0,"Alternierend","Alternate legs"],
  ["side-lunges","Side Lunges","Side Lunges","bw legs",6,30,0,"Becken nach hinten","Push your hips back"],
  ["cossack-squats","Cossack Squats","Cossack Squats","bw legs",5,30,0,"Mobilität und Kraft","Mobility and strength"],
  ["deep-squats","Deep Squats","Deep Squats","bw legs",6,30,0,"Nur schmerzfreie Tiefe","Only as deep as pain-free"],
  ["pistol-assist","Pistol Squat Assist","Pistol Squat Assist","bw legs",4,20,1,"Mit Festhalten","Hold on to something"],
  ["plank-steps","Plank Steps","Plank Steps","bw",6,30,0,"Hüfte ruhig halten","Keep your hips still"],
  ["bear-crawl","Bear Crawl","Bear Crawl","bw",6,30,0,"Knie knapp über dem Boden","Knees just above the floor"],
  ["wall-sit","Wall Sit","Wall Sit","bw legs",6,30,0,"Rücken an der Wand","Back against the wall"],
  ["calf-raises","Calf Raises","Calf Raises","bw legs",6,30,0,"Oben kurz halten","Pause briefly at the top"],
  ["glute-bridge","Glute Bridge","Glute Bridge","bw legs",6,30,0,"Gesäß aktiv anspannen","Actively squeeze your glutes"],

  ["pull-ups","Pull-ups","Pull-ups","back calis",6,15,0,"Nur saubere Wiederholungen","Clean reps only"],
  ["negative-pull-ups","Negative Pull-ups","Negative Pull-ups","back",5,20,0,"Langsam absenken","Lower slowly"],
  ["inverted-rows","Inverted Rows","Inverted Rows","back calis",6,20,0,"Nur an sicherer Stange","Only on a secure bar"],
  ["superman-hold","Superman Hold","Superman Hold","back",6,20,0,"Kleine kontrollierte Hebung","Small, controlled lift"],
  ["reverse-snow-angels","Reverse Snow Angels","Reverse Snow Angels","back",6,30,0,"Bauchlage, Arme führen","Lying face down, guide the arms"],
  ["bird-dog","Bird Dog","Bird Dog","back",6,30,0,"Diagonal, langsam","Diagonal, slow"],
  ["prone-y-raise","Prone Y-Raise","Prone Y-Raise","back",6,20,0,"Daumen nach oben","Thumbs up"],
  ["prone-t-raise","Prone T-Raise","Prone T-Raise","back",6,20,0,"Schulterblätter aktiv","Engage your shoulder blades"],
  ["good-mornings","Good Mornings","Good Mornings","back",6,30,0,"Rücken neutral","Neutral back"],
  ["swimmers","Swimmers","Swimmers","back",6,30,0,"Kleine Wechselbewegung","Small alternating movement"],
  ["scapular-push-ups","Scapular Push-ups","Scapular Push-ups","back",6,20,0,"Arme bleiben gestreckt","Arms stay straight"],
  ["scapular-pull-ups","Scapular Pull-ups","Scapular Pull-ups","back calis",5,15,0,"Nur Schulterblätter bewegen","Move only your shoulder blades"],
  ["dead-hang","Dead Hang","Dead Hang","back calis",5,20,0,"Nur bei geeigneter Stange","Only with a suitable bar"],

  ["air-squats","Air Squats","Air Squats","legs",6,30,0,"Knie folgen der Fußrichtung","Knees track over your toes"],
  ["split-squats","Split Squats","Split Squats","legs",3,30,1,"Stabiler Stand","Stable stance"],
  ["bulgarian-split-squats","Bulgarian Split Squats","Bulgarian Split Squats","legs",3,30,1,"Hinterer Fuß erhöht","Rear foot elevated"],
  ["forward-lunges","Forward Lunges","Forward Lunges","legs",6,30,0,"Kontrolliert abbremsen","Brake with control"],
  ["single-leg-glute-bridge","Single-leg Glute Bridge","Single-leg Glute Bridge","legs",3,30,1,"Becken waagerecht","Keep your pelvis level"],
  ["lateral-lunge-pulses","Lateral Lunge Pulses","Lateral Lunge Pulses","legs",3,30,1,"Kleine kontrollierte Pulse","Small, controlled pulses"],

  ["plank","Plank","Plank","core",6,30,0,"Gerade Körperlinie","Straight body line"],
  ["side-plank","Side Plank","Side Plank","core",3,30,1,"Hüfte oben halten","Keep your hips up"],
  ["dead-bug","Dead Bug","Dead Bug","core",6,30,0,"Lendenwirbelsäule stabil","Keep your lower back stable"],
  ["bicycle-crunches","Bicycle Crunches","Bicycle Crunches","core",6,30,0,"Nicht am Nacken ziehen","Don't pull on your neck"],
  ["leg-raises","Leg Raises","Leg Raises","core",6,30,0,"Bei Bedarf Knie beugen","Bend your knees if needed"],
  ["jackknives","V-Ups (Jackknives)","V-Ups (Jackknives)","core",5,30,0,"Arme und Beine gleichzeitig zusammenführen","Bring arms and legs together at the same time"],
  ["reverse-crunch","Reverse Crunch","Reverse Crunch","core",6,30,0,"Knie zur Brust ziehen und Becken anheben","Pull your knees in and lift your pelvis"],
  ["side-jackknives","Side Jackknives","Side Jackknives","core",3,30,1,"Seitliche Bauchmuskeln","Side abs"],
  ["hollow-hold","Hollow Hold","Hollow Hold","core",6,20,0,"Leichter mit gebeugten Knien","Easier with bent knees"],
  ["russian-twists","Ukraine Twist","Ukraine Twist","core",6,30,0,"Brustbein aufrecht","Keep your chest up"],
  ["sit-ups","Sit-ups","Sit-ups","core",6,30,0,"Kontrolliertes Tempo","Controlled pace"],
  ["toe-touches","Toe Touches","Toe Touches","core",6,30,0,"Schultern aktiv anheben","Actively lift your shoulders"],
  ["plank-shoulder-taps","Plank Shoulder Taps","Plank Shoulder Taps","core",6,30,0,"Becken ruhig","Keep your pelvis still"],
  ["toes-to-bar","Toes-to-Bar","Toes-to-Bar","core calis",4,20,0,"Nur an sicherer Stange","Only on a secure bar"],

  /* Arme ohne Gewicht (Armkreisen zählt zur Hauptkategorie Stretch / Mobility) */
  ["triceps-curls","Trizeps-Curls","Triceps Curls","weight arms",6,30,0,"Kurzhantel über dem Kopf, Ellbogen bleiben eng","Dumbbell overhead, keep your elbows in"],
  ["close-grip-push-ups","Enge Liegestütz","Close-grip Push-ups","arms",6,20,0,"Ellbogen streifen am Körper entlang","Elbows brush past your ribs"],
  ["diamond-push-ups","Diamant-Liegestütz","Diamond Push-ups","arms",5,20,0,"Hände bilden ein Dreieck unter der Brust","Hands form a triangle under your chest"],
  ["sphinx-push-ups","Sphinx-Liegestütz","Sphinx Push-ups","arms",5,20,0,"Vom Unterarm auf die Hände drücken","Press from forearms up to your hands"],
  ["arm-circles","Armkreisen","Arm Circles","arms",6,30,0,"Arme gestreckt auf Schulterhöhe","Arms straight at shoulder height"],

  /* Fitnessstudio: Geräte und Langhantel (Ausrüstung "gym"). Im Timer 3 Sätze × 40 s, 60 s Pause -
     im Studio-Reiter trägt man stattdessen Gewicht und Wiederholungen ein */
  ["leg-press","Beinpresse (sitzend)","Seated Leg Press","weight legs",3,40,0,"Knie folgen den Füßen, unten nicht rund werden","Knees follow your feet, don't round your back at the bottom",60],
  ["leg-press-45","Beinpresse 45° (Schlitten)","45° Leg Press","weight legs",3,40,0,"Nur so tief, wie der Po am Polster bleibt","Only as deep as your hips stay on the pad",60],
  ["leg-extension","Beinstrecker","Leg Extension","weight legs",3,40,0,"Oben kurz halten, langsam zurück","Pause at the top, lower slowly",60],
  ["leg-curl","Beinbeuger (sitzend)","Seated Leg Curl","weight legs",3,40,0,"Oberschenkel unter dem Polster fixiert","Thighs locked under the pad",60],
  ["adductor-machine","Adduktoren","Adductor Machine","weight legs",3,40,0,"Kontrolliert schließen, nicht zuschlagen","Close with control, don't slam",60],
  ["abductor-machine","Abduktoren","Abductor Machine","weight legs",3,40,0,"Oberkörper ruhig, aus der Hüfte öffnen","Keep your torso still, open from the hips",60],
  ["calf-machine","Wadenmaschine","Calf Raise Machine","weight legs",3,40,0,"Unten dehnen, oben kurz halten","Stretch at the bottom, pause at the top",60],
  ["chest-press-machine","Brustpresse","Chest Press Machine","weight",3,40,0,"Griffe auf Brusthöhe, Schultern unten","Handles at chest height, shoulders down",60],
  ["butterfly","Butterfly","Pec Deck (Butterfly)","weight",3,40,0,"Ellbogen leicht gebeugt, Brust führt","Elbows slightly bent, lead with your chest",60],
  ["pullover","Überzug (Pullover)","Dumbbell Pullover","weight",3,40,0,"Arme fast gestreckt, Rippen unten","Arms almost straight, ribs down",60],
  ["lat-pulldown","Latzug","Lat Pulldown","weight back",3,40,0,"Stange zur oberen Brust, nicht in den Nacken","Bar to your upper chest, not behind your neck",60],
  ["row-machine","Rudermaschine","Machine Row","weight back",3,40,0,"Brust am Polster, Schulterblätter zusammen","Chest on the pad, squeeze your shoulder blades",60],
  ["cable-row","Rudern am Kabel (sitzend)","Seated Cable Row","weight back",3,40,0,"Aufrecht sitzen, zum Bauchnabel ziehen","Sit tall, pull to your belly button",60],
  ["reverse-butterfly","Butterfly reverse","Reverse Fly Machine","weight back",3,40,0,"Arme auf Schulterhöhe, nach hinten öffnen","Arms at shoulder height, open backwards",60],
  ["back-extension","Rückenstrecker (Hyperextension)","Back Extension","weight back",3,40,0,"Nur bis zur Linie mit den Beinen","Only up to a straight line with your legs",60],
  ["shoulder-press-machine","Schulterpresse","Shoulder Press Machine","weight",3,40,0,"Rücken am Polster, kein Hohlkreuz","Back on the pad, no arching",60],
  ["biceps-machine","Bizepstrainer","Biceps Curl Machine","weight arms",3,40,0,"Oberarme bleiben auf dem Polster","Upper arms stay on the pad",60],
  ["cable-curl","Bizepscurl am Kabel","Cable Biceps Curl","weight arms",3,40,0,"Ellbogen bleiben am Körper","Elbows stay at your sides",60],
  ["triceps-pushdown","Trizepsdrücken am Kabel","Triceps Pushdown","weight arms",3,40,0,"Oberarme bleiben am Körper, nur Unterarme bewegen","Upper arms stay put, move only your forearms",60],
  ["skull-crusher","French Press (liegend)","Skull Crusher","weight arms",3,40,0,"Ellbogen zeigen zur Decke, Gewicht hinter den Kopf","Elbows point up, lower the weight behind your head",60],
  ["ab-crunch-machine","Bauchmaschine","Ab Crunch Machine","weight core",3,40,0,"Aus dem Bauch einrollen, nicht mit den Armen ziehen","Curl with your abs, don't pull with your arms",60],
  ["bench-press","Bankdrücken (Langhantel)","Barbell Bench Press","weight",3,40,0,"Füße fest, Stange zur unteren Brust","Feet planted, bar to your lower chest",90],
  ["barbell-squat","Kniebeuge (Langhantel)","Barbell Back Squat","weight legs",3,40,0,"Stange auf dem oberen Rücken, Brust aufrecht","Bar on your upper back, chest up",90],
  ["barbell-deadlift","Kreuzheben (Langhantel)","Barbell Deadlift","weight back legs",3,40,0,"Stange nah am Bein, Rücken gerade","Bar close to your legs, flat back",90],
  ["hack-squat", "Hackenschmidt-Kniebeuge", "Hack Squat", "weight legs", 3, 40, 0, "Rücken am Polster, tief und kontrolliert", "Back on the pad, deep and controlled", 90],
  ["smith-squat", "Kniebeuge an der Multipresse", "Smith Machine Squat", "weight legs", 3, 40, 0, "Füße etwas vor der Stange", "Feet slightly in front of the bar", 90],
  ["leg-press-single", "Beinpresse einbeinig", "Single-Leg Press", "weight legs", 3, 40, 0, "Weniger Gewicht, Knie über dem Fuß", "Less weight, knee over your foot", 60],
  ["hip-thrust", "Hip Thrust", "Hip Thrust", "weight legs", 3, 40, 0, "Oben das Gesäß fest anspannen", "Squeeze your glutes hard at the top", 90],
  ["glute-kickback-cable", "Kickback am Kabel", "Cable Glute Kickback", "weight legs", 3, 40, 0, "Nur aus der Hüfte, Rücken ruhig", "From your hip only, back still", 45],
  ["seated-calf", "Wadenheben sitzend", "Seated Calf Raise", "weight legs", 3, 40, 0, "Unten dehnen, oben halten", "Stretch at the bottom, hold at the top", 45],
  ["incline-chest-press", "Schrägbankpresse (Maschine)", "Incline Chest Press Machine", "weight", 3, 40, 0, "Griffe auf oberer Brusthöhe", "Handles at upper-chest height", 60],
  ["cable-crossover", "Kabelzug über Kreuz", "Cable Crossover", "weight", 3, 40, 0, "Arme leicht gebeugt, vor dem Körper zusammen", "Arms slightly bent, together in front", 60],
  ["incline-db-press", "Schrägbankdrücken (Kurzhantel)", "Incline Dumbbell Press", "weight", 3, 40, 0, "Bank etwa 30°", "Bench at about 30°", 90],
  ["db-fly", "Fliegende (Kurzhantel)", "Dumbbell Fly", "weight", 3, 40, 0, "Ellbogen leicht gebeugt, weiter Bogen", "Elbows slightly bent, wide arc", 60],
  ["assisted-pullup", "Klimmzug-Maschine (assistiert)", "Assisted Pull-up Machine", "weight back calis", 3, 40, 0, "Mehr Gegengewicht = leichter", "More counterweight = easier", 90],
  ["close-grip-pulldown", "Latzug eng", "Close-Grip Pulldown", "weight back", 3, 40, 0, "Enger Griff, Ellbogen nah am Körper", "Narrow grip, elbows close", 60],
  ["t-bar-row", "T-Bar-Rudern", "T-Bar Row", "weight back", 3, 40, 0, "Rücken gerade, Griff zur Brust", "Flat back, handle to your chest", 90],
  ["barbell-row", "Langhantelrudern", "Barbell Row", "weight back", 3, 40, 0, "Aus der Hüfte vorbeugen, Stange zum Bauch", "Hinge forward, bar to your belly", 90],
  ["face-pull", "Face Pull", "Face Pull", "weight back", 3, 40, 0, "Seil zur Stirn, Ellbogen hoch", "Rope to your forehead, elbows high", 45],
  ["straight-arm-pulldown", "Überzug am Kabel", "Straight-Arm Pulldown", "weight back", 3, 40, 0, "Arme gestreckt, Bewegung aus der Schulter", "Straight arms, move from the shoulder", 60],
  ["lateral-raise", "Seitheben", "Lateral Raise", "weight", 3, 40, 0, "Arme bis Schulterhöhe, leicht gebeugt", "Arms up to shoulder height, slightly bent", 45],
  ["shrugs", "Schulterheben (Shrugs)", "Shrugs", "weight", 3, 40, 0, "Schultern gerade nach oben", "Shoulders straight up", 45],
  ["hammer-curl", "Hammercurl", "Hammer Curl", "weight arms", 3, 40, 0, "Daumen oben, Ellbogen am Körper", "Thumbs up, elbows at your sides", 45],
  ["barbell-curl", "Langhantel-/SZ-Curl", "Barbell Curl", "weight arms", 3, 40, 0, "Ellbogen fest, ohne Schwung", "Elbows fixed, no swinging", 45],
  ["overhead-cable-triceps", "Trizeps über Kopf am Kabel", "Overhead Cable Extension", "weight arms", 3, 40, 0, "Ellbogen zeigen nach vorn", "Elbows point forward", 45],
  ["triceps-machine", "Trizepsmaschine (Dip sitzend)", "Seated Dip Machine", "weight arms", 3, 40, 0, "Arme nach unten strecken, Schultern tief", "Press down, shoulders low", 60],
  /* 2026-09-30: Geräte aus Kevins Studio */
  ["glute-machine", "Gluteus-Maschine", "Glute Machine", "weight legs", 3, 40, 1, "Nur aus der Hüfte, Rücken ruhig", "From your hip only, back still", 45],
  ["calf-press", "Wadenpresse", "Calf Press", "weight legs", 3, 40, 0, "Knie fast gestreckt, nur aus dem Sprunggelenk", "Knees nearly straight, move only at the ankle", 45],
  ["lying-leg-curl", "Beinbeuger liegend", "Lying Leg Curl", "weight legs", 3, 40, 0, "Hüfte bleibt auf dem Polster", "Hips stay on the pad", 60],
  ["rotary-torso", "Rotary Torso (Rumpfdrehen)", "Rotary Torso", "weight core", 3, 40, 1, "Langsam drehen, Becken bleibt fest", "Rotate slowly, hips stay fixed", 45],
  ["back-extension-machine", "Rückenstrecker-Maschine", "Back Extension Machine", "weight back", 3, 40, 0, "Aus der Hüfte aufrichten, nicht überstrecken", "Extend from the hips, don't overarch", 60],
  ["triceps-extension-machine", "Trizeps-Extension (Maschine)", "Triceps Extension Machine", "weight arms", 3, 40, 0, "Oberarme bleiben auf dem Polster", "Upper arms stay on the pad", 60],
  ["lateral-raise-machine", "Seitheber-Maschine", "Lateral Raise Machine", "weight", 3, 40, 0, "Bis Schulterhöhe, Schultern tief", "Up to shoulder height, shoulders down", 45],
  ["cable-lateral-raise", "Seitheben am Kabel", "Cable Lateral Raise", "weight", 3, 40, 1, "Arm leicht gebeugt, bis Schulterhöhe", "Arm slightly bent, up to shoulder height", 45],
  /* 2026-09-30: weitere gängige Studio-Geräte */
  ["smith-bench-press", "Bankdrücken an der Multipresse", "Smith Machine Bench Press", "weight", 3, 40, 0, "Bank so stellen, dass die Stange zur unteren Brust geht", "Set the bench so the bar lands on your lower chest", 90],
  ["assisted-dip", "Dip-Maschine (assistiert)", "Assisted Dip Machine", "weight arms", 3, 40, 0, "Mehr Gegengewicht = leichter", "More counterweight = easier", 90],
  ["high-row-machine", "Rudern von oben (Maschine)", "High Row Machine", "weight back", 3, 40, 0, "Brust am Polster, Ellbogen nach unten hinten", "Chest on the pad, elbows down and back", 60],
  ["cable-crunch", "Kabel-Crunch kniend", "Kneeling Cable Crunch", "weight core", 3, 40, 0, "Hüfte bleibt stehen, nur der Bauch rollt ein", "Hips stay put, only your abs curl in", 45],
  ["cable-pull-through", "Pull-Through am Kabel", "Cable Pull-Through", "weight legs", 3, 40, 0, "Aus der Hüfte beugen, oben das Gesäß anspannen", "Hinge at the hips, squeeze your glutes at the top", 60],
  ["cable-woodchop", "Holzhacker am Kabel", "Cable Woodchop", "weight core", 3, 40, 0, "Drehung aus dem Rumpf, Arme lang", "Rotate from your core, long arms", 45],
  ["captains-chair", "Knieheben am Gerät", "Captain's Chair Knee Raise", "weight core calis", 3, 40, 0, "Rücken am Polster, Knie zur Brust", "Back on the pad, knees to your chest", 45],
  ["barbell-overhead-press", "Schulterdrücken (Langhantel)", "Barbell Overhead Press", "weight", 3, 40, 0, "Stange senkrecht über den Kopf", "Bar straight overhead", 90],
  ["barbell-rdl", "Rumänisches Kreuzheben (Langhantel)", "Barbell Romanian Deadlift", "weight legs back", 3, 40, 0, "Hüfte nach hinten, Stange am Bein", "Hips back, bar along your legs", 90],
  /* Dehnen: Haltezeit statt Arbeit, 5 s zum Umsetzen */
  ["neck-stretch","Nacken seitlich","Neck Side Stretch","stretch",1,30,1,"Schultern locker nach unten","Shoulders relaxed and down",5],
  ["shoulder-stretch","Schulter (Arm vor der Brust)","Cross-body Shoulder Stretch","stretch",1,30,1,"Arm auf Schulterhöhe heranziehen","Pull the arm in at shoulder height",5],
  ["triceps-stretch","Trizeps über Kopf","Overhead Triceps Stretch","stretch",1,30,1,"Ellbogen sanft Richtung Kopf","Ease the elbow towards your head",5],
  ["biceps-stretch","Bizeps an der Wand","Wall Biceps Stretch","stretch",1,30,1,"Handfläche an die Wand, Körper wegdrehen","Palm on the wall, turn your body away",5],
  ["chest-stretch","Brust an der Wand","Wall Chest Stretch","stretch",1,30,1,"Unterarm an Wand oder Türrahmen","Forearm on a wall or door frame",5],
  ["wrist-stretch","Handgelenke","Wrist Stretch","stretch",2,20,0,"Finger sanft zurückziehen","Gently pull your fingers back",5],
  ["side-bend","Seitbeuge im Stand","Standing Side Bend","stretch",1,20,1,"Lang machen, nicht nach vorn kippen","Stay long, don't tip forward",5],
  ["cat-cow","Katze-Kuh","Cat-Cow","stretch",1,60,0,"Langsam im Atemrhythmus","Slowly with your breath",5],
  ["childs-pose","Kindhaltung","Child's Pose","stretch",1,60,0,"Po Richtung Fersen, Arme lang","Hips towards heels, arms long",5],
  ["sphinx-stretch","Sphinx","Sphinx Stretch","stretch",1,45,0,"Unterarme stützen, Bauch entspannt","Forearms support, belly relaxed",5],
  ["cobra-lift","Kobra","Cobra Stretch","stretch",2,20,0,"Hüfte bleibt am Boden, Schultern tief","Hips stay down, shoulders low",5],
  ["downward-dog","Herabschauender Hund","Downward Dog","stretch",2,30,0,"Hüfte hoch, Fersen Richtung Boden","Hips high, heels towards the floor",5],
  ["spinal-twist","Drehdehnung liegend","Supine Spinal Twist","stretch",1,30,1,"Schultern bleiben am Boden","Shoulders stay on the floor",5],
  ["forward-fold","Vorbeuge im Stand","Standing Forward Fold","stretch",2,30,0,"Knie leicht gebeugt, Oberkörper hängen lassen","Knees soft, let your upper body hang",5],
  ["hip-flexor-stretch","Hüftbeuger kniend","Kneeling Hip Flexor Stretch","stretch",1,30,1,"Becken nach vorn schieben, Gesäß anspannen","Push your hips forward, squeeze your glutes",5],
  ["quad-stretch","Oberschenkel vorn im Stand","Standing Quad Stretch","stretch",1,30,1,"Knie zeigen nach unten, nah beieinander","Knees point down, close together",5],
  ["hamstring-stretch","Beinrückseite im Sitzen","Seated Hamstring Stretch","stretch",2,30,0,"Aus der Hüfte beugen, Rücken lang","Hinge from the hips, long back",5],
  ["calf-stretch","Waden an der Wand","Wall Calf Stretch","stretch",1,30,1,"Hintere Ferse bleibt am Boden","Back heel stays down",5],
  ["figure-four","Gesäß liegend (Figur 4)","Figure-Four Glute Stretch","stretch",1,30,1,"Knöchel aufs Knie, Bein heranziehen","Ankle on knee, draw the leg in",5],
  ["pigeon-stretch","Taube","Pigeon Stretch","stretch",1,45,1,"Hüfte gerade Richtung Boden","Hips square towards the floor",5],
  ["butterfly-stretch","Schmetterling","Butterfly Stretch","stretch",2,30,0,"Fußsohlen zusammen, Knie sinken lassen","Soles together, let the knees drop",5],
  ["worlds-greatest","World's Greatest Stretch","World's Greatest Stretch","stretch",2,20,1,"Aus der Brust aufdrehen","Rotate open through your chest",5],

  /* Calisthenics (Stange, Barren) - längere Pausen, weil die Übungen schwer sind */
  ["chin-ups","Chin-Up","Chin-Up","calis back arms",5,20,0,"Klimmzug im Untergriff","Pull-up with an underhand grip",20],
  ["commando-pull-ups","Commando Pull-Up","Commando Pull-Up","calis back",3,20,1,"Seitlich an der Stange hochziehen","Pull up beside the bar",20],
  ["rung-pull-ups","Sprossen-Klimmzug (Hangelleiter)","Rung Pull-up (Monkey Bars)","calis back arms",5,20,0,"Je eine Hand an zwei Sprossen, Kopf dazwischen hoch","One hand on each of two rungs, head up between them",20],
  ["parallel-bar-dips","Parallel Bar Dips","Parallel Bar Dips","calis arms",5,20,0,"Zwischen den Holmen absenken und hochdrücken","Lower between the bars and press up",20],
  ["support-hold","Support Hold","Support Hold","calis arms",5,20,0,"Mit gestreckten Armen im Stütz halten","Hold the support with straight arms",15],
  ["hanging-knee-raise","Hanging Knee Raise","Hanging Knee Raise","calis core",5,20,0,"Knie kontrolliert zur Brust ziehen","Draw your knees to your chest with control",15],
  ["hanging-leg-raise","Hanging Leg Raise","Hanging Leg Raise","calis core",5,20,0,"Gestreckte Beine anheben","Raise your straight legs",20],
  ["hanging-l-sit","Hanging L-Sit","Hanging L-Sit","calis core",5,10,0,"Beine waagerecht halten","Hold your legs horizontal",20],
  ["l-sit","L-Sit","L-Sit","calis core",5,10,0,"Beine gestreckt vor dem Körper halten","Hold your legs straight in front of you",20],
  ["windshield-wipers","Windshield Wipers","Windshield Wipers","calis core",4,20,0,"Beine im Hang von Seite zu Seite","Legs side to side while hanging",20],
  ["muscle-ups","Muscle-Up","Muscle-Up","calis back arms",5,15,0,"Kombination aus Klimmzug und Dip","A pull-up flowing into a dip",30],
  ["monkey-bar-traverse","Monkey Bar Traverse","Monkey Bar Traverse","calis back",4,30,0,"Von Sprosse zu Sprosse hangeln","Swing from rung to rung",30],
  ["skin-the-cat","Skin The Cat","Skin The Cat","calis back",4,20,0,"Aus dem Hang durch die Schultern rotieren","Rotate through your shoulders from the hang",30],

  /* Weitere schwere Übungen */
  ["archer-push-ups","Archer-Liegestütz","Archer Push-ups","bw arms",3,20,1,"Gewicht zu einem Arm verlagern","Shift your weight onto one arm",15],
  ["pistol-squats","Pistol Squat","Pistol Squat","bw legs",3,20,1,"Einbeinige Kniebeuge ohne Hilfe","Single-leg squat without support",15],
  ["dragon-flags","Dragon Flag","Dragon Flag","core",4,15,0,"Körper wie ein Brett absenken","Lower your body like a plank",25],
  ["clap-push-ups","Klatsch-Liegestütz","Clap Push-ups","bw arms",5,20,0,"Explosiv hochdrücken und klatschen","Push up explosively and clap",20],
  ["tuck-jumps","Tuck Jumps","Tuck Jumps","cardio legs",5,20,0,"Knie im Sprung zur Brust","Knees to chest in the air",20],
  ["burpee-pull-ups","Burpee-Klimmzug","Burpee Pull-up","calis core back",5,30,0,"Liegestütz, hochspringen, Klimmzug","Push-up, jump up, pull-up",30]
];

/* [id, Name DE, Name EN, Fokus, Übungen, Blockpause s] - Fokus "mix" erscheint nur unter „Alle“ */
var LIB_WORKOUT_ROWS = [
  ["cardio-express","Cardio Express","Cardio Express","cardio","jumping-jacks high-knees mountain-climbers skater-jumps",45],
  ["cardio-power","Cardio Power","Cardio Power","cardio","burpees jump-squats fast-feet plank-burpees",60],
  ["full-body-weights","Full Body mit Gewicht","Full Body with Weights","weight","goblet-squat bent-over-row floor-press romanian-deadlift farmer-carry",60],
  ["kb-conditioning","Kettlebell Conditioning","Kettlebell Conditioning","weight","kb-swing goblet-squat kb-clean weighted-reverse-lunge",60],
  ["bw-basic","Bodyweight Basic","Bodyweight Basic","bw","air-squats push-ups reverse-lunges glute-bridge plank-steps",45],
  ["bw-advanced","Bodyweight Advanced","Bodyweight Advanced","bw","pike-push-ups cossack-squats bear-crawl pistol-assist burpee-squat-jumps",60],
  ["back-basic","Rücken Basis","Back Basics","back","bird-dog reverse-snow-angels prone-y-raise good-mornings superman-hold",45],
  ["back-pull","Rücken Zugkraft","Back Pulling Strength","back","pull-ups negative-pull-ups inverted-rows scapular-pull-ups dead-hang",90],
  ["leg-day","Beine Basis","Leg Day","legs","air-squats reverse-lunges split-squats glute-bridge calf-raises",60],
  ["leg-power","Beine Power","Leg Power","legs","jump-squats bulgarian-split-squats side-lunges wall-sit lateral-lunge-pulses",60],
  ["core-basic","Bauch & Core Basis","Core Basic","core","dead-bug plank side-plank bicycle-crunches leg-raises",45],
  ["core-advanced","Bauch & Core Advanced","Core Advanced","core","hollow-hold jackknives side-jackknives plank-shoulder-taps dragon-flags",60],
  ["core-complete","Bauch komplett","Complete Core","core","russian-twists leg-raises dead-bug bicycle-crunches reverse-crunch jackknives hollow-hold plank side-plank mountain-climbers",45],
  ["full-body-mix","Full Body Mix","Full Body Mix","mix","kb-swing push-ups walking-lunges bent-over-row mountain-climbers plank",60],
  ["arms-bw","Arme ohne Geräte","Arms Without Equipment","arms","close-grip-push-ups diamond-push-ups triceps-dips sphinx-push-ups pike-push-ups plank-shoulder-taps",45],
  ["stretch-full","Ganzkörper-Dehnen","Full Body Stretch","stretch","neck-stretch shoulder-stretch chest-stretch cat-cow downward-dog hip-flexor-stretch hamstring-stretch figure-four spinal-twist childs-pose",10],
  ["stretch-post-legs","Nach dem Training: Beine","After Training: Legs","stretch","quad-stretch hamstring-stretch calf-stretch hip-flexor-stretch figure-four butterfly-stretch",10],
  ["stretch-post-upper","Nach dem Training: Oberkörper","After Training: Upper Body","stretch","chest-stretch shoulder-stretch triceps-stretch biceps-stretch wrist-stretch childs-pose",10],
  ["stretch-back-hips","Rücken & Hüfte","Back & Hips","stretch","cat-cow childs-pose sphinx-stretch hip-flexor-stretch pigeon-stretch spinal-twist",10],
  ["stretch-office","Schultern & Nacken (Büro)","Shoulders & Neck (Office)","stretch","neck-stretch shoulder-stretch triceps-stretch chest-stretch side-bend wrist-stretch",10],
  ["stretch-morning","Morgen-Mobility","Morning Mobility","stretch","cat-cow worlds-greatest downward-dog side-bend forward-fold",5],
  ["calis-pull","Calisthenics Zug","Calisthenics Pull","calis","scapular-pull-ups inverted-rows commando-pull-ups chin-ups pull-ups burpee-pull-ups dead-hang",90],
  ["calis-push","Calisthenics Druck","Calisthenics Push","calis","support-hold parallel-bar-dips archer-push-ups pike-push-ups diamond-push-ups",90],
  ["calis-core","Calisthenics Core","Calisthenics Core","calis","hanging-knee-raise hanging-leg-raise windshield-wipers hanging-l-sit l-sit toes-to-bar",60],
  ["calis-skills","Calisthenics Skills","Calisthenics Skills","calis","skin-the-cat l-sit monkey-bar-traverse hanging-l-sit burpee-pull-ups muscle-ups",120],
  /* Calisthenics für Einsteiger: Progression statt gleich Klimmzug/Dip, längere Pausen */
  ["calis-hiit","Calisthenics HIIT","Calisthenics HIIT","calis","burpee-pull-ups parallel-bar-dips hanging-knee-raise chin-ups toes-to-bar",60,"4/30/20"],
  ["calis-start","Calisthenics Einsteiger","Calisthenics for Beginners","calis","dead-hang scapular-pull-ups inverted-rows support-hold hanging-knee-raise negative-pull-ups",60,"3/20/40"],
  ["pullup-progress","Klimmzug-Aufbau","Pull-up Progression","calis","dead-hang scapular-pull-ups inverted-rows negative-pull-ups chin-ups",75,"3/20/40"],
  ["dip-progress","Dip-Aufbau","Dip Progression","calis","support-hold triceps-dips close-grip-push-ups parallel-bar-dips",60,"3/20/40"],
  ["calis-60","Calisthenics 60","Calisthenics 60","calis","scapular-pull-ups pull-ups support-hold parallel-bar-dips inverted-rows chin-ups toes-to-bar hanging-knee-raise negative-pull-ups l-sit windshield-wipers commando-pull-ups hanging-leg-raise dead-hang",100],
  ["full-body-60","Full Body 60","Full Body 60","mix","burpees goblet-squat push-ups kb-swing bent-over-row walking-lunges mountain-climbers romanian-deadlift shoulder-press jump-squats plank russian-twists",85],
  ["bodyweight-60","Bodyweight 60 (ohne Geräte)","Bodyweight 60 (no equipment)","bw","jumping-jacks air-squats push-ups reverse-lunges plank high-knees glute-bridge pike-push-ups side-lunges bicycle-crunches burpees wall-sit superman-hold mountain-climbers",45],
  /* 2026-09: neue Programme, aufgebaut nach gängigen Trainingsempfehlungen:
     Brust = Liegestütz-Varianten im Zirkel, vorher Schulterblätter aktivieren;
     Beine & Po = alle Bewegungsmuster (Kniebeuge, einbeinig, Hüftstreckung, seitlich);
     High Pulse = 40 s Arbeit / 20 s Pause; Dehnen kurz = große Muskelgruppen, je 30 s */
  ["stretch-quick","Dehnen kurz · Ganzkörper","Quick Full Body Stretch","stretch","quad-stretch chest-stretch shoulder-stretch hip-flexor-stretch hamstring-stretch childs-pose",5],
  ["chest-bw","Brust (ohne Geräte)","Chest (no equipment)","bw","scapular-push-ups push-ups archer-push-ups clap-push-ups close-grip-push-ups diamond-push-ups chest-stretch",45],
  ["chest-db","Brust & Schultern mit Kurzhantel","Chest & Shoulders with Dumbbells","weight","floor-press push-ups shoulder-press push-press triceps-curls chest-stretch",60],
  ["legs-glutes","Beine & Po","Legs & Glutes","legs","air-squats bulgarian-split-squats glute-bridge side-lunges single-leg-glute-bridge wall-sit calf-raises quad-stretch figure-four",45],
  ["hiit-full","Ganzkörper High Pulse","Full Body High Pulse","cardio","jumping-jacks high-knees burpees jump-squats mountain-climbers skater-jumps plank-burpees tuck-jumps frogs",30,"3/40/20"],
  ["back-office","Rücken & Haltung (Büro)","Back & Posture (Office)","back","bird-dog prone-y-raise prone-t-raise reverse-snow-angels swimmers superman-hold childs-pose",20,"3/30/10"],
  ["arms-db","Schultern & Arme mit Kurzhantel","Shoulders & Arms with Dumbbells","weight","shoulder-press bent-over-row triceps-curls one-arm-row push-press shoulder-stretch triceps-stretch",45],
  /* weitere Programme mit klarem Zweck */
  ["warmup-5","Aufwärmen 5 Min","5-Minute Warm-up","cardio","jumping-jacks air-squats high-knees plank-steps fast-feet",10,"2/25/5"],
  ["tabata-full","Tabata Ganzkörper","Full Body Tabata","cardio","burpees mountain-climbers jump-squats high-knees",60,"8/20/10"],
  /* hochintensiv: kurze Pausen, explosive und zusammengesetzte Übungen */
  ["hiit-legs","Beine explosiv (HIIT)","Explosive Legs (HIIT)","legs","jump-squats skater-jumps tuck-jumps lateral-hops frogs cossack-squats quad-stretch",30,"4/40/20"],
  ["tabata-legs","Tabata Beine","Legs Tabata","legs","jump-squats skater-jumps lateral-hops tuck-jumps",60,"8/20/10"],
  ["burpee-challenge","Burpee-Intervalle","Burpee Intervals","cardio","burpees plank-burpees burpee-squat-jumps stand-up-jumps jump-forward-burpees",30,"3/40/20"],
  ["upper-power","Oberkörper Power (ohne Geräte)","Upper Body Power (no equipment)","bw","clap-push-ups archer-push-ups pike-push-ups diamond-push-ups bear-crawl plank-shoulder-taps chest-stretch",40,"4/30/15"],
  ["core-burner","Core Burner","Core Burner","core","jackknives dragon-flags mountain-climbers hollow-hold side-jackknives bicycle-crunches",20,"4/40/20"],
  ["kb-hiit","Kettlebell HIIT","Kettlebell HIIT","weight","kb-swing goblet-squat kb-clean front-rack-carry kb-swing weighted-reverse-lunge",30,"4/40/20"],
  ["db-complex","Kurzhantel-Komplex (schwer)","Heavy Dumbbell Complex","weight","db-thruster renegade-row romanian-deadlift push-press weighted-reverse-lunge",45,"4/45/15"],
  ["metcon-db","Metcon mit Kurzhantel","Dumbbell Metcon","mix","db-thruster burpees renegade-row jump-squats mountain-climbers push-press",30,"4/40/20"],
  ["glutes-bw","Po-Fokus (ohne Geräte)","Glute Focus (no equipment)","legs","glute-bridge reverse-lunges single-leg-glute-bridge side-lunges squat-hold lateral-lunge-pulses figure-four pigeon-stretch",40],
  ["db-full-30","Kurzhantel Ganzkörper","Dumbbell Full Body","weight","goblet-squat bent-over-row floor-press romanian-deadlift db-thruster renegade-row shoulder-press",60],
  ["core-stable","Rumpfstabilität (rückenschonend)","Core Stability (back-friendly)","core","dead-bug bird-dog plank side-plank glute-bridge hollow-hold childs-pose",30],
  ["runner-strength","Kraft für Läufer","Strength for Runners","legs","split-squats calf-raises single-leg-glute-bridge lateral-lunge-pulses side-plank plank hip-flexor-stretch calf-stretch",40],
  ["stretch-hips","Hüfte mobil","Hip Mobility","stretch","worlds-greatest hip-flexor-stretch pigeon-stretch butterfly-stretch figure-four",5],
  ["stretch-evening","Entspannt dehnen am Abend","Relaxing Evening Stretch","stretch","forward-fold childs-pose sphinx-stretch spinal-twist butterfly-stretch figure-four",5],
  ["advanced-60","Advanced 60","Advanced 60","mix","burpee-squat-jumps pistol-squats archer-push-ups tuck-jumps dragon-flags clap-push-ups bulgarian-split-squats pike-push-ups frogs hollow-hold cossack-squats jackknives",120],
  ["warmup-ganz","Aufwärmen Ganzkörper","Full-Body Warm-up","mix","jumping-jacks air-squats good-mornings bird-dog reverse-lunges high-knees",20,"1/40/10"],
  ["warmup-kraft","Aufwärmen vor Kraft","Warm-up before Strength","mix","scapular-push-ups glute-bridge air-squats good-mornings reverse-lunges plank",20,"1/40/10"],
  ["warmup-hiit","Aufwärmen vor HIIT","Warm-up before HIIT","cardio","jumping-jacks high-knees fast-feet air-squats lateral-hops skater-jumps",20,"2/20/10"]
];

/* Schwierigkeit (1 Einsteiger, 2 Mittel, 3 Fortgeschritten) und Ausrüstung je Übung.
   Ausrüstung: "none" = ohne Geräte (Stuhl, Stufe oder Wand reichen), sonst db/kb/bar - mehrere = eins davon genügt. */
var EX_LEVEL = {
  "burpees":2,"jump-squats":2,"mountain-climbers":2,"high-knees":1,"jumping-jacks":1,"skater-jumps":2,"jump-lunges":3,"plank-burpees":1,
  "burpee-squat-jumps":3,"jump-forward-squats":2,"jump-forward-burpees":3,"frogs":3,"stand-up-jumps":3,"lateral-hops":2,"fast-feet":1,"box-step-ups":1,"sprint-in-place":2,
  "goblet-squat":1,"kb-swing":2,"db-thruster":2,"romanian-deadlift":2,"db-deadlift":1,"bent-over-row":1,"one-arm-row":1,"floor-press":1,
  "shoulder-press":1,"push-press":2,"weighted-reverse-lunge":2,"front-rack-carry":2,"farmer-carry":1,"kb-clean":3,"renegade-row":3,
  "push-ups":2,"pike-push-ups":3,"triceps-dips":2,"squat-hold":1,"walking-lunges":2,"reverse-lunges":1,"side-lunges":2,"cossack-squats":3,
  "deep-squats":1,"pistol-assist":3,"plank-steps":2,"bear-crawl":2,"wall-sit":1,"calf-raises":1,"glute-bridge":1,
  "pull-ups":3,"negative-pull-ups":2,"inverted-rows":2,"superman-hold":1,"reverse-snow-angels":1,"bird-dog":1,"prone-y-raise":1,
  "prone-t-raise":1,"good-mornings":1,"swimmers":1,"cobra-lift":1,"scapular-push-ups":1,"scapular-pull-ups":2,"dead-hang":1,"rung-pull-ups":2,
  "air-squats":1,"split-squats":2,"bulgarian-split-squats":3,"forward-lunges":2,"single-leg-glute-bridge":2,"lateral-lunge-pulses":2,
  "plank":1,"side-plank":2,"dead-bug":1,"bicycle-crunches":1,"leg-raises":2,"jackknives":3,"side-jackknives":3,
  "hollow-hold":3,"reverse-crunch":2,"russian-twists":2,"sit-ups":1,"toe-touches":1,"plank-shoulder-taps":2,"toes-to-bar":3,
  "neck-stretch":1,"shoulder-stretch":1,"triceps-stretch":1,"biceps-stretch":1,"chest-stretch":1,"wrist-stretch":1,"side-bend":1,
  "cat-cow":1,"childs-pose":1,"sphinx-stretch":1,"downward-dog":1,"spinal-twist":1,"forward-fold":1,"hip-flexor-stretch":1,
  "quad-stretch":1,"hamstring-stretch":1,"calf-stretch":1,"figure-four":1,"pigeon-stretch":2,"butterfly-stretch":1,"worlds-greatest":2,
  "burpee-pull-ups":3,
  "leg-press":1,"leg-press-45":1,"leg-extension":1,"leg-curl":1,"adductor-machine":1,"abductor-machine":1,"calf-machine":1,
  "chest-press-machine":1,"butterfly":1,"pullover":2,"lat-pulldown":1,"row-machine":1,"cable-row":1,"reverse-butterfly":1,
  "back-extension":1,"shoulder-press-machine":1,"biceps-machine":1,"cable-curl":1,"triceps-pushdown":1,"skull-crusher":2,
  "ab-crunch-machine":1,"bench-press":2,"barbell-squat":2,"barbell-deadlift":2,
  "hack-squat":1,"smith-squat":1,"leg-press-single":2,"hip-thrust":1,"glute-kickback-cable":1,"seated-calf":1,"incline-chest-press":1,"cable-crossover":2,"incline-db-press":2,"db-fly":2,"assisted-pullup":1,"close-grip-pulldown":1,"t-bar-row":2,"barbell-row":2,"face-pull":1,"straight-arm-pulldown":1,"lateral-raise":1,"shrugs":1,"hammer-curl":1,"barbell-curl":1,"overhead-cable-triceps":1,"triceps-machine":1,"glute-machine":1,"calf-press":1,"lying-leg-curl":1,"rotary-torso":1,"back-extension-machine":1,"triceps-extension-machine":1,"lateral-raise-machine":1,"cable-lateral-raise":1,"smith-bench-press":1,"assisted-dip":1,"high-row-machine":1,"cable-crunch":1,"cable-pull-through":2,"cable-woodchop":2,"captains-chair":1,"barbell-overhead-press":2,"barbell-rdl":2
};
/* Belastung je Übung: 1 locker, 2 mittel, 3 intensiv - angelehnt an das Compendium of Physical Activities
   (MET: leichte Rücken-/Rumpfübungen und Halteübungen etwa 2,5–3,5, moderate Kraft- und Körpergewichtsübungen
   etwa 3,5–5, Sprünge, Burpees, Sprints und schwungvolle Ganzkörperübungen um 8) und an der Herzfrequenz, die eine
   Übung im Intervall typischerweise erreicht. Das ist etwas anderes als die Schwierigkeit (EX_LEVEL): Klimmzüge
   sind schwer, aber nicht unbedingt intensiv für den Kreislauf. Nicht aufgeführt = 2. Dehnübungen spielen hier keine Rolle. */
var EX_INT = {
  /* intensiv: explosiv, springend, Ganzkörper mit hohem Puls */
  "burpees":3,"jump-squats":3,"jump-lunges":3,"mountain-climbers":3,"high-knees":3,"skater-jumps":3,"burpee-squat-jumps":3,"jump-forward-squats":3,"jump-forward-burpees":3,
  "frogs":3,"stand-up-jumps":3,"sprint-in-place":3,"tuck-jumps":3,"kb-swing":3,"db-thruster":3,"kb-clean":3,"push-press":3,
  "renegade-row":3,"burpee-pull-ups":3,"clap-push-ups":3,"muscle-ups":3,"pull-ups":3,"chin-ups":3,"commando-pull-ups":3,
  "toes-to-bar":3,"rung-pull-ups":3,"pistol-squats":3,"bulgarian-split-squats":3,"jackknives":3,"side-jackknives":3,"bear-crawl":3,
  /* locker: Aktivierung, Haltung, ruhige Halte- und Rumpfübungen */
  "superman-hold":1,"reverse-snow-angels":1,"bird-dog":1,"prone-y-raise":1,"prone-t-raise":1,"good-mornings":1,"swimmers":1,
  "scapular-push-ups":1,"scapular-pull-ups":1,"dead-hang":1,"calf-raises":1,"glute-bridge":1,"deep-squats":1,"squat-hold":1,
  "plank":1,"side-plank":1,"dead-bug":1,"reverse-crunch":1,"sit-ups":1,"toe-touches":1,"triceps-curls":1,"farmer-carry":1
};
/* Leichter / Schwerer: Ketten von leicht nach schwer (nur Übungen, die es in BLOC gibt). Jede Übung bekommt Nachbarn aus der ersten Kette, in der sie vorkommt.
   Bewusst nur ein Hinweis zum Ausprobieren, keine Trainingsplanung - Fachprüfung offen (siehe quellen.html). */
var LZ_KETTEN = [
  ["push-ups", "close-grip-push-ups", "diamond-push-ups", "archer-push-ups", "clap-push-ups"],
  ["inverted-rows", "negative-pull-ups", "chin-ups", "pull-ups", "commando-pull-ups"],
  ["air-squats", "split-squats", "bulgarian-split-squats", "pistol-assist", "pistol-squats"],
  ["reverse-lunges", "forward-lunges", "walking-lunges", "jump-lunges"],
  ["plank-burpees", "burpees", "burpee-squat-jumps", "jump-forward-burpees", "burpee-pull-ups"],
  ["dead-bug", "plank", "plank-shoulder-taps", "hollow-hold"],
  ["leg-raises", "hanging-knee-raise", "hanging-leg-raise", "toes-to-bar"],
  ["glute-bridge", "single-leg-glute-bridge"],
  ["jump-squats", "jump-forward-squats", "tuck-jumps"]
];
var EX_EQUIP = {
  "leg-press":"gym","leg-press-45":"gym","leg-extension":"gym","leg-curl":"gym","adductor-machine":"gym","abductor-machine":"gym",
  "calf-machine":"gym","chest-press-machine":"gym","butterfly":"gym","pullover":"gym db","lat-pulldown":"gym","row-machine":"gym",
  "cable-row":"gym","reverse-butterfly":"gym","back-extension":"gym","shoulder-press-machine":"gym","biceps-machine":"gym",
  "cable-curl":"gym","triceps-pushdown":"gym","skull-crusher":"gym db","ab-crunch-machine":"gym","bench-press":"gym",
  "barbell-squat":"gym","barbell-deadlift":"gym",
  "hack-squat":"gym","smith-squat":"gym","leg-press-single":"gym","hip-thrust":"gym","glute-kickback-cable":"gym","seated-calf":"gym","incline-chest-press":"gym","cable-crossover":"gym","incline-db-press":"gym db","db-fly":"gym db","assisted-pullup":"gym","close-grip-pulldown":"gym","t-bar-row":"gym","barbell-row":"gym","face-pull":"gym","straight-arm-pulldown":"gym","lateral-raise":"gym db","shrugs":"gym db","hammer-curl":"gym db","barbell-curl":"gym","overhead-cable-triceps":"gym","triceps-machine":"gym","glute-machine":"gym","calf-press":"gym","lying-leg-curl":"gym","rotary-torso":"gym","back-extension-machine":"gym","triceps-extension-machine":"gym","lateral-raise-machine":"gym","cable-lateral-raise":"gym","smith-bench-press":"gym","assisted-dip":"gym","high-row-machine":"gym","cable-crunch":"gym","cable-pull-through":"gym","cable-woodchop":"gym","captains-chair":"gym","barbell-overhead-press":"gym","barbell-rdl":"gym",
  "goblet-squat":"kb db","kb-swing":"kb","db-thruster":"db","romanian-deadlift":"db kb","db-deadlift":"db kb","bent-over-row":"db",
  "one-arm-row":"db","triceps-curls":"db","floor-press":"db","shoulder-press":"db","push-press":"db","weighted-reverse-lunge":"db kb","front-rack-carry":"kb db",
  "farmer-carry":"db kb","kb-clean":"kb","renegade-row":"db",
  "pull-ups":"bar","negative-pull-ups":"bar","inverted-rows":"bar","scapular-pull-ups":"bar","dead-hang":"bar","toes-to-bar":"bar",
  "chin-ups":"bar","commando-pull-ups":"bar","rung-pull-ups":"bar","parallel-bar-dips":"dip","support-hold":"dip",
  "hanging-knee-raise":"bar","hanging-leg-raise":"bar","hanging-l-sit":"bar","l-sit":"dip","windshield-wipers":"bar",
  "muscle-ups":"bar","monkey-bar-traverse":"bar","skin-the-cat":"bar","burpee-pull-ups":"bar"
};

/* Hauptkategorien: jede Übung gehört zu genau einer (Gliederung der Bibliothek, Kacheln oben).
   Fokus (LIB_CATS) und Ausrüstung bleiben daneben als kombinierbare Mehrfach-Filter.
   Zuordnung nach der Übungsliste „BLOC – Kategorien und Attribute“. */
var MAIN_CATS = [
  { id:"kraft",    de:"Kraft",       en:"Strength",     color:"#ff5a5f",
    ico:'<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>' },
  { id:"ausdauer", de:"Ausdauer",    en:"Cardio",       color:"#f5b82e",
    ico:'<circle cx="14.5" cy="4.5" r="2"/><path d="M8 21l3-6 3 2.5V22M6 12.5l3-3.5 4 1 3 3.5 3 .5M13 10l-2 5"/>' },
  { id:"rumpf",    de:"Rumpf",       en:"Core",         color:"#a879ff",
    ico:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r=".6"/>' },
  { id:"stange",   de:"Stangenpark", en:"Bar park",     color:"#4f9dff",
    ico:'<path d="M3 4.5h18M7 4.5V21M17 4.5V21"/>' },
  { id:"stretch",  de:"Stretch",     en:"Stretch",      color:"#3fcf8e",
    ico:'<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/>' }
];
var EX_MAIN_ROWS = {
  ausdauer:"box-step-ups burpee-squat-jumps jump-forward-squats jump-forward-burpees burpees fast-feet frogs high-knees jump-lunges jump-squats jumping-jacks lateral-hops mountain-climbers plank-burpees skater-jumps sprint-in-place stand-up-jumps tuck-jumps",
  rumpf:"bicycle-crunches dead-bug dragon-flags hollow-hold leg-raises plank plank-shoulder-taps reverse-crunch russian-twists side-jackknives side-plank sit-ups toe-touches jackknives",
  stange:"chin-ups commando-pull-ups rung-pull-ups dead-hang hanging-knee-raise hanging-l-sit hanging-leg-raise inverted-rows l-sit monkey-bar-traverse muscle-ups burpee-pull-ups negative-pull-ups parallel-bar-dips pull-ups scapular-pull-ups skin-the-cat support-hold toes-to-bar windshield-wipers",
  stretch:"hamstring-stretch biceps-stretch chest-stretch spinal-twist figure-four wrist-stretch downward-dog hip-flexor-stretch cat-cow childs-pose neck-stretch quad-stretch butterfly-stretch shoulder-stretch side-bend sphinx-stretch cobra-lift pigeon-stretch triceps-stretch forward-fold calf-stretch worlds-greatest arm-circles"
};

var EQUIPS = [
  { id:"none", de:"Ohne Geräte", en:"No equipment" },
  { id:"db",   de:"Kurzhantel",  en:"Dumbbell" },
  { id:"kb",   de:"Kettlebell",  en:"Kettlebell" },
  { id:"bar",  de:"Stange",      en:"Bar" },
  { id:"dip",  de:"Dip-Barren / Parallettes", en:"Dip bars / parallettes" },
  { id:"gym",  de:"Fitnessstudio", en:"Gym" }
];

/* weitere Suchbegriffe, z. B. der frühere Name */
var EX_SUCH_ALIAS = { "russian-twists":"russian twist twists russische drehung russischer",
  "pull-ups":"klimmzug klimmzuge", "chin-ups":"klimmzug untergriff", "negative-pull-ups":"klimmzug negativ",
  "scapular-pull-ups":"schulterblatt klimmzug", "commando-pull-ups":"klimmzug", "push-ups":"liegestutz liegestutze",
  "jump-forward-squats":"weitsprung broad jump sprung nach vorn kniebeuge", "jump-forward-burpees":"weitsprung broad jump burpee sprung nach vorn",
  "rung-pull-ups":"hangelleiter sprossen klimmzug monkey bar zwischen den sprossen", "lat-pulldown":"lat zug latziehen", "leg-press":"beinpresse", "leg-press-45":"beinpresse schlitten",
  "skull-crusher":"french press trizeps liegend stirndrücken", "pullover":"überzüge ueberzug", "butterfly":"pec deck fliegende",
  "reverse-butterfly":"reverse fly hintere schulter", "biceps-machine":"scott curl bizeps defended curl preacher curl",
  "cable-row":"low row rudern kabel tief", "triceps-pushdown":"triceps pressdown trizeps kabel", "lat-pulldown":"lat pulldown turm latzug",
  "glute-machine":"gluteusmaschine gluteus po maschine kickback", "calf-press":"wadenpresse waden calf", "lying-leg-curl":"beinbeuger liegend leg curl hamstring",
  "rotary-torso":"rotary torso rumpfdrehen rotation drehen", "back-extension-machine":"rückenstrecker maschine unterer rücken",
  "triceps-extension-machine":"trizeps extension maschine", "lateral-raise-machine":"seitenhebermaschine seitheber seitheben maschine",
  "cable-lateral-raise":"seitheben kabel verstellbarer kabelzug adjustable pulley", "smith-bench-press":"multipresse smith bankdrücken bankdruecken",
  "assisted-dip":"dips dip maschine gegengewicht kniepolster trizeps", "high-row-machine":"high row rudern oben hammer",
  "cable-crunch":"kabel crunch kniend bauch seil", "cable-pull-through":"pull through kabel gesäß po hüfte seil", "back-extension":"hyperextension",
  "jump-lunges":"sprungausfallschritt ausfallschritt sprung split jumps lunge jumps", "cobra-lift":"cobra lift kobra" };

/* ---------- Piktogramme ----------
   Jede Übung hat zwei Posen, die sich abwechseln (bei Halteübungen eine). Eine Pose beschreibt
   Gelenkpunkte im Feld 0..100 (Boden bei y=89, Blick nach rechts):
   Q(Kopf|null, Nacken, Hüfte, Beine [[Knie x,y, Knöchel x,y, (Zehe x,y)]], Arme [[Ellbogen x,y, Hand x,y]], Geräte, frontal)
   Kopf null = in Verlängerung der Wirbelsäule. Das zweite Bein/der zweite Arm liegt „hinten“ und wird
   blasser gezeichnet - außer bei frontalen Ansichten. */
/* b = Blickrichtung für die Nase: 1 = Gesicht auf der „Vorderseite“ (bei Blick nach rechts vorn, in Rückenlage oben),
   -1 = umgekehrt (Bauchlage mit Kopf links). Spiegeln kehrt sie um. */
function Q(h, n, p, l, a, x, f, b){ return { h:h, n:n, p:p, l:l||[], a:a||[], x:x||"", f:!!f, b:b||1 }; }
function qSwap(q){ return Q(q.h, q.n, q.p, q.l.slice().reverse(), q.a.slice().reverse(), q.x, q.f, q.b); }
function qMirror(q){
  function mx(arr){ return arr.map(function(v, i){ return i%2===0 ? 100-v : v; }); }
  return Q(q.h ? mx(q.h) : null, mx(q.n), mx(q.p), q.l.map(mx), q.a.map(mx), q.x, q.f, -q.b);
}
function qShift(q, dx, dy){
  function sh(arr){ return arr.map(function(v, i){ return i%2===0 ? v+dx : v+dy; }); }
  return Q(q.h ? sh(q.h) : null, sh(q.n), sh(q.p), q.l.map(sh), q.a.map(sh), q.x, q.f, q.b);
}
function qWith(q, o){ return Q("h" in o ? o.h : q.h, o.n||q.n, o.p||q.p, o.l||q.l, o.a||q.a, "x" in o ? o.x : q.x, "f" in o ? o.f : q.f, "b" in o ? o.b : q.b); }
/* Geräte */
/* Hantel und Kettlebell hält die Hand - markiert, damit sie in der Animation mit der Hand mitwandern */
function gHand(x, y, inner){ return '<g class="gh" data-at="'+x+','+y+'">'+inner+'</g>'; }
function gDB(x, y){ return gHand(x, y, '<path class="ip" d="M'+(x-6)+' '+y+'h12M'+(x-6)+' '+(y-4)+'v8M'+(x+6)+' '+(y-4)+'v8"/>'); }
function gKB(x, y){ return gHand(x, y, '<circle class="ipf" cx="'+x+'" cy="'+(y+4)+'" r="5"/><path class="ip" d="M'+(x-3)+' '+(y+1)+'q3-5 6 0"/>'); }
function gBar(y, x1, x2){ return '<path class="ip" d="M'+(x1||20)+' '+y+'H'+(x2||80)+'"/>'; }
function gBox(x1, y, x2){ return '<path class="ip" d="M'+x1+' 89V'+y+'H'+x2+'V89"/>'; }
function gWall(x){ return '<path class="ip" d="M'+x+' 6V89"/>'; }
function gPole(x){ return '<path class="ip" d="M'+x+' 24V89"/>'; }
function gBench(x1, x2, y){ return '<path class="ip" d="M'+x1+' '+y+'H'+x2+'M'+(x1+3)+' '+y+'V89M'+(x2-3)+' '+y+'V89"/>'; }

/* Grundposen */
var P_ST    = Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[52,34,53,47]]);
var P_STF   = qWith(P_ST, { a:[[63,25,76,25]] });                       // Arme nach vorn
var P_STH   = qWith(P_ST, { a:[[57,35,51,45]] });                       // Hände an der Hüfte
var P_STUP  = Q(null,[50,28],[50,56],[[50,72,50,89,58,89]],[[58,17,64,7]]);   // Arme über Kopf (etwas tiefer, damit alles ins Feld passt)
var P_SQ    = Q(null,[46,36],[36,62],[[57,62,52,89,60,89]],[[60,38,74,37]]);
var P_SQH   = Q(null,[48,40],[36,62],[[56,62,52,89,60,89]],[[56,56,60,88]]);  // Hocke, Hände am Boden
var P_DSQ   = Q(null,[48,46],[40,74],[[58,68,52,89,60,89]],[[56,56,62,62]]);
var P_JUMP  = Q(null,[50,16],[50,46],[[52,63,50,80,57,80]],[[45,30,41,42]]);
var P_JUP   = Q(null,[50,22],[50,50],[[51,66,50,82,57,82]],[[58,11,64,2]]);
var P_PH    = Q(null,[72,60],[44,72],[[28,78,12,86,9,89]],[[69,75,70,89]]);  // Stütz oben
var P_PL    = Q(null,[72,78],[44,82],[[28,85,12,87,9,89]],[[60,71,70,89]]);  // Stütz unten
var P_FP    = Q(null,[70,72],[44,76],[[28,81,12,86,9,89]],[[67,89,84,89]]);  // Unterarmstütz
var P_LB    = Q(null,[22,84],[50,84],[[68,85,86,85,88,78]],[[32,87,44,87]]);  // Rückenlage
var P_LBK   = Q([14,83],[24,84],[46,86],[[60,70,70,89,78,89]],[[33,88,43,88]]);  // Rückenlage, Knie gebeugt
var P_LF    = Q(null,[24,83],[52,84],[[70,86,88,87,92,89]],[[14,88,4,88]],"",false,-1);   // Bauchlage (Gesicht zum Boden)
var P_HG    = Q(null,[64,40],[40,50],[[44,70,44,89,52,89]],[[62,54,61,66]]);  // Hüftbeuge
var P_Q4    = Q(null,[66,66],[40,66],[[40,88,22,88,18,89]],[[67,78,68,89]]);  // Vierfüßler
var P_F     = Q(null,[50,20],[50,52],[[46,70,45,89,39,89],[54,70,55,89,61,89]],[[44,34,42,48],[56,34,58,48]],"",true);
var P_HANG  = Q(null,[50,30],[50,58],[[48,72,48,84],[52,72,52,84]],[[40,21,34,6],[60,21,66,6]], gBar(6,24,76), true);
var P_PULL  = Q([50,5],[50,14],[50,42],[[48,58,48,72],[52,58,52,72]],[[34,20,42,6],[66,20,58,6]], gBar(6,24,76), true);
var P_L0    = P_STH;
var P_L1    = Q(null,[48,32],[48,62],[[66,63,66,89,74,89],[36,85,20,87,18,89]],[[55,48,49,57]]);
var P_WALK1 = Q(null,[50,20],[50,50],[[57,69,62,89,70,89],[43,69,38,89,46,89]],[[52,34,53,47]]);

/* Skater Jumps in der Vorderansicht (man steht der Figur gegenüber, der Oberkörper bleibt zu uns gedreht - die Bewegung läuft seitlich über das Bild):
   Landung tief auf einem Bein, der Rücken stark nach unten gebeugt (von vorn: kurzer Rumpf, Kopf tief), die Hand der Standseite reicht Richtung Boden,
   das andere Bein gekreuzt hinter dem Standbein, der andere Arm schwingt nach außen - dann Flug (bleibt tief), dann Landung auf dem anderen Bein.
   Die Landung rechts ist das Spiegelbild der Landung links; der Flug zeigt in Sprungrichtung. Es wirkt nicht wie eine Drehung, weil der Rumpf in beiden
   Hälften zu uns steht. */
var SK_L   = Q(null,[35,52],[38,68],[[34,78,37,89,31,89],[47,78,29,83,24,84]],[[43,62,37,76],[26,57,19,65]],"",true);
var SK_AIR = Q(null,[49,46],[51,60],[[44,70,37,78,32,79],[56,70,59,79,64,80]],[[40,54,31,61],[60,54,69,60]],"",true);   // Flug nach links; nach rechts gespiegelt
var ILLU_POSES = {
  /* Cardio */
  "burpees":            [P_STUP, P_PH],
  "jump-squats":        [P_SQ, P_JUMP],
  "mountain-climbers":  [qWith(P_PH,{ l:[[28,78,12,86,9,89],[58,76,48,86,46,89]] }), qWith(P_PH,{ l:[[58,76,48,86,46,89],[28,78,12,86,9,89]] })],
  "high-knees":         [Q(null,[50,20],[50,50],[[68,52,68,70,75,70],[50,70,50,89,58,89]],[[44,32,40,42],[57,30,63,23]]),
                         Q(null,[50,20],[50,50],[[50,70,50,89,58,89],[68,52,68,70,75,70]],[[57,30,63,23],[44,32,40,42]])],
  "jumping-jacks":      [P_F, qWith(P_F,{ l:[[42,70,33,89,27,89],[58,70,67,89,73,89]], a:[[40,16,33,5],[60,16,67,5]] })],
  "skater-jumps":       [SK_L, qMirror(SK_L)],
  "plank-burpees":      [P_SQH, P_PH],
  "burpee-squat-jumps": [P_PH, P_JUP],
  "frogs":              [qWith(P_DSQ,{ a:[[54,62,58,88]] }), P_JUP],
  "stand-up-jumps":     [P_LBK, P_JUP],
  "lateral-hops":       [qShift(qWith(P_F,{ l:[[47,68,46,84,40,84],[53,68,54,84,60,84]] }),-12,-3), qShift(qWith(P_F,{ l:[[47,68,46,84,40,84],[53,68,54,84,60,84]] }),12,-3)],
  "fast-feet":          [Q(null,[54,30],[48,56],[[56,72,52,89,60,89],[46,73,42,85,48,84]],[[58,42,62,50],[48,42,50,52]]),
                         Q(null,[54,30],[48,56],[[46,73,42,85,48,84],[56,72,52,89,60,89]],[[48,42,50,52],[58,42,62,50]])],
  "box-step-ups":       [Q(null,[40,22],[40,52],[[56,58,60,74,68,74],[40,71,40,89,48,89]],[[42,36,43,49]], gBox(54,76,86)),
                         Q(null,[62,16],[62,44],[[62,60,62,76,70,76],[52,58,48,70,52,72]],[[64,29,65,41]], gBox(54,76,86))],
  "sprint-in-place":    [Q(null,[53,20],[50,50],[[62,62,58,80,64,82],[46,70,42,88,50,89]],[[58,32,64,25],[44,33,40,42]]),
                         Q(null,[53,20],[50,50],[[46,70,42,88,50,89],[62,62,58,80,64,82]],[[44,33,40,42],[58,32,64,25]])],

  /* Kraft mit Gewicht */
  "goblet-squat":       [qWith(P_ST,{ a:[[57,36,58,29]], x:gKB(60,26) }), qWith(P_SQ,{ a:[[54,50,56,42]], x:gKB(58,39) })],
  "kb-swing":           [qWith(P_HG,{ l:[[46,70,44,89,52,89]], a:[[60,56,52,70]], x:gKB(52,70) }), qWith(P_ST,{ a:[[63,25,76,25]], x:gKB(79,21) })],
  "db-thruster":        [qWith(P_SQ,{ a:[[56,46,53,36]], x:gDB(53,34) }), qWith(P_STUP,{ x:gDB(65,6) })],
  "romanian-deadlift":  [qWith(P_ST,{ x:gDB(53,49) }), qWith(P_HG,{ x:gDB(61,68) })],
  "db-deadlift":        [Q(null,[60,46],[38,62],[[54,66,50,89,58,89]],[[60,62,58,76]], gDB(58,78)), qWith(P_ST,{ x:gDB(53,49) })],
  "bent-over-row":      [qWith(P_HG,{ x:gDB(61,68) }), qWith(P_HG,{ a:[[50,36,56,48]], x:gDB(56,50) })],
  "one-arm-row":        [qWith(P_HG,{ a:[[62,54,61,66],[66,52,68,62]], x:gDB(61,68)+gBench(62,90,62) }), qWith(P_HG,{ a:[[50,36,56,48],[66,52,68,62]], x:gDB(56,50)+gBench(62,90,62) })],
  "floor-press":        [qWith(P_LBK,{ a:[[30,88,32,76]], x:gDB(32,74) }), qWith(P_LBK,{ a:[[28,72,29,60]], x:gDB(29,58) })],
  "shoulder-press":     [qWith(P_STUP,{ a:[[58,40,57,30]], x:gDB(57,28) }), qWith(P_STUP,{ x:gDB(65,6) })],
  "push-press":         [Q(null,[50,32],[48,60],[[57,72,52,89,60,89]],[[58,44,57,34]], gDB(57,32)), qWith(P_STUP,{ x:gDB(65,6) })],
  "weighted-reverse-lunge": [qWith(P_ST,{ x:gDB(53,49) }), qWith(P_L1,{ a:[[49,48,50,60]], x:gDB(50,62) })],
  "front-rack-carry":   [qWith(P_WALK1,{ a:[[58,34,57,27]], x:gKB(59,23) }), qWith(qSwap(P_WALK1),{ a:[[58,34,57,27]], x:gKB(59,23) })],
  "farmer-carry":       [qWith(P_WALK1,{ x:gKB(53,47) }), qWith(qSwap(P_WALK1),{ x:gKB(53,47) })],
  "kb-clean":           [qWith(P_HG,{ l:[[46,70,44,89,52,89]], a:[[60,56,54,70]], x:gKB(54,70) }), qWith(P_ST,{ a:[[58,36,57,28]], x:gKB(60,24) })],
  "renegade-row":       [qWith(P_PH,{ x:gDB(70,87) }), qWith(P_PH,{ a:[[60,58,68,66],[69,75,70,89]], x:gDB(68,68) })],

  /* Bodyweight */
  "push-ups":           [P_PH, P_PL],
  "pike-push-ups":      [Q(null,[64,66],[46,48],[[36,68,26,87,22,89]],[[68,78,72,89]]), Q(null,[66,74],[46,52],[[36,70,26,87,22,89]],[[58,76,72,89]])],
  "triceps-dips":       [Q(null,[56,42],[52,68],[[34,64,30,89,24,89]],[[62,56,64,70]], gBench(60,92,70)), Q(null,[56,56],[52,80],[[34,72,30,89,24,89]],[[68,58,64,70]], gBench(60,92,70))],
  "squat-hold":         [P_SQ, null],
  "walking-lunges":     [qWith(P_L1,{ a:[[55,48,49,57]] }), qWith(P_WALK1,{ a:[[57,35,51,45]] })],
  "reverse-lunges":     [qShift(P_L0, 14, 0), P_L1],   // vorderer Fuß bleibt stehen, der Körper geht nach hinten
  "side-lunges":        [qWith(P_F,{ a:[[45,38,50,44],[55,38,50,44]] }),
                         Q(null,[44,36],[40,64],[[28,70,26,89,20,89],[58,74,72,89,78,89]],[[46,50,52,54],[52,48,52,54]],"",true)],
  "cossack-squats":     [qWith(P_F,{ l:[[42,70,36,89,30,89],[58,70,64,89,70,89]], a:[[45,38,50,44],[55,38,50,44]] }),
                         Q(null,[42,46],[36,74],[[22,70,26,89,20,89],[60,80,82,84,84,78]],[[50,56,58,56],[46,58,58,56]],"",true)],
  "deep-squats":        [P_STF, P_DSQ],
  "pistol-assist":      [qWith(P_ST,{ l:[[50,70,50,89,58,89],[62,62,68,78,74,76]], a:[[64,32,80,34]], x:gPole(82) }),
                         Q(null,[48,46],[40,72],[[56,66,50,89,58,89],[58,74,76,74,80,70]],[[64,48,80,50]], gPole(82))],
  "plank-steps":        [P_PH, P_FP],
  "bear-crawl":         [Q(null,[64,62],[40,62],[[46,80,26,86,22,89],[40,80,20,86,16,89]],[[66,76,70,89],[62,76,64,89]]),
                         Q(null,[64,62],[40,62],[[40,80,20,86,16,89],[46,80,26,86,22,89]],[[70,76,76,89],[62,76,64,89]])],
  "wall-sit":           [Q(null,[31,34],[31,62],[[52,62,52,89,60,89]],[[35,48,41,58]], gWall(24)), null],
  "calf-raises":        [P_ST, qWith(qShift(P_ST,0,-5),{ l:[[50,65,50,84,58,89]] })],
  "glute-bridge":       [P_LBK, Q([14,83],[24,84],[46,68],[[62,64,70,89,78,89]],[[33,88,43,88]])],

  /* Rücken */
  "pull-ups":           [P_HANG, P_PULL],
  "negative-pull-ups":  [P_PULL, P_HANG],
  "inverted-rows":      [Q(null,[38,76],[62,82],[[76,85,88,87,90,81]],[[40,66,44,57]], gBar(57,30,58)+'<path class="ip" d="M32 57V89"/>'),
                         Q(null,[40,63],[62,74],[[76,80,88,87,90,81]],[[34,58,44,57]], gBar(57,30,58)+'<path class="ip" d="M32 57V89"/>')],
  "superman-hold":      [P_LF, Q(null,[26,78],[52,84],[[70,82,88,76,92,78]],[[16,72,8,66]])],
  "reverse-snow-angels":[qWith(P_LF,{ a:[[36,80,46,80]] }), qWith(P_LF,{ a:[[16,76,6,72]] })],
  "bird-dog":           [P_Q4, Q(null,[66,66],[40,66],[[24,64,8,62],[40,88,22,88,18,89]],[[80,60,92,56],[67,78,68,89]])],
  "prone-y-raise":      [P_LF, qWith(P_LF,{ a:[[15,76,5,70]] })],
  "prone-t-raise":      [qWith(P_LF,{ a:[[29,87,33,89]] }), qWith(P_LF,{ a:[[29,72,31,62]] })],
  "good-mornings":      [qWith(P_ST,{ a:[[58,18,49,12]] }), qWith(P_HG,{ a:[[62,30,71,31]] })],
  "swimmers":           [Q(null,[26,80],[52,84],[[70,82,88,77,92,78],[70,86,88,87,92,89]],[[16,74,6,70],[14,88,4,88]]),
                         Q(null,[26,80],[52,84],[[70,86,88,87,92,89],[70,82,88,77,92,78]],[[14,88,4,88],[16,74,6,70]])],
  "cobra-lift":         [qWith(P_LF,{ a:[[32,88,36,89]] }), Q(null,[24,66],[50,84],[[70,86,88,87,92,89]],[[26,77,28,89]])],
  "scapular-push-ups":  [P_PH, qShift(P_PH,0,3)],
  /* Scapular Pull-ups von vorn: Arme bleiben gestreckt, der ganze Körper hebt sich nur ein Stück (die Hände rutschen minimal nach außen) */
  "scapular-pull-ups":  [Q(null,[50,31],[50,59],[[48,73,48,85],[52,73,52,85]],[[43,19,36,7],[57,19,64,7]], gBar(7,24,76), true),
                         Q(null,[50,27],[50,55],[[48,69,48,81],[52,69,52,81]],[[41,17,32,7],[59,17,68,7]], gBar(7,24,76), true)],
  "dead-hang":          [P_HANG, null],

  /* Beine */
  "air-squats":         [P_STF, P_SQ],
  "split-squats":       [Q(null,[48,18],[48,48],[[58,68,64,89,72,89],[40,68,32,86,28,89]],[[55,33,49,43]]),
                         Q(null,[48,32],[48,62],[[64,64,64,89,72,89],[38,82,26,86,22,89]],[[55,47,49,57]])],
  "bulgarian-split-squats": [Q(null,[50,18],[50,48],[[58,68,62,89,70,89],[38,62,26,70,20,70]],[[57,33,51,43]], gBench(6,30,70)),
                         Q(null,[50,32],[50,62],[[66,64,66,89,74,89],[40,80,26,70,20,70]],[[57,47,51,57]], gBench(6,30,70))],
  "forward-lunges":     [qShift(P_L0, -14, 0), P_L1],  // Schritt nach vorn, der Körper wandert mit
  "single-leg-glute-bridge": [qWith(P_LBK,{ l:[[60,70,70,89,78,89],[62,70,76,62,80,58]] }), Q([14,83],[24,84],[46,68],[[62,64,70,89,78,89],[64,60,82,52,86,48]],[[33,88,43,88]])],
  "lateral-lunge-pulses": [Q(null,[44,36],[40,64],[[28,70,26,89,20,89],[58,74,72,89,78,89]],[[46,50,52,54],[52,48,52,54]],"",true),
                         Q(null,[44,40],[40,68],[[26,74,26,89,20,89],[58,77,72,89,78,89]],[[46,54,52,58],[52,52,52,58]],"",true)],

  /* Bauch / Core */
  "plank":              [P_FP, null],
  "side-plank":         [Q([20,58],[28,64],[56,76],[[72,82,88,88,92,89]],[[27,89,40,89],[28,50,28,38]],"",true),
                         Q([20,60],[28,66],[56,82],[[72,86,88,88,92,89]],[[27,89,40,89],[28,52,28,40]],"",true)],
  "dead-bug":           [qWith(P_LB,{ l:[[52,66,68,66],[50,68,66,68]], a:[[22,70,22,58],[26,70,26,58]] }),
                         qWith(P_LB,{ l:[[68,82,88,80],[52,66,68,66]], a:[[12,76,4,72],[26,70,26,58]] })],
  "bicycle-crunches":   [Q(null,[26,78],[50,84],[[56,66,66,70],[68,80,88,78]],[[24,68,16,70]]),
                         Q(null,[26,78],[50,84],[[68,80,88,78],[56,66,66,70]],[[24,68,16,70]])],
  "leg-raises":         [P_LB, qWith(P_LB,{ l:[[54,66,58,48,64,46]] })],
  "jackknives":         [qWith(P_LB,{ a:[[12,84,2,84]] }), Q(null,[34,64],[44,86],[[56,66,66,48,70,46]],[[48,56,62,46]])],
  "side-jackknives":    [qWith(P_LB,{ a:[[22,74,14,76]] }), Q(null,[28,72],[50,84],[[66,74,84,68,88,66]],[[24,64,16,66]])],
  "hollow-hold":        [Q(null,[26,74],[50,84],[[68,80,86,74,90,72]],[[14,68,4,64]]), null],
  "russian-twists":     [Q(null,[34,60],[46,84],[[60,70,74,74,80,72]],[[42,72,34,80]]), Q(null,[34,60],[46,84],[[60,70,74,74,80,72]],[[48,70,58,76]])],
  "sit-ups":            [qWith(P_LBK,{ a:[[30,80,36,78]] }), Q(null,[42,58],[46,86],[[60,70,70,89,78,89]],[[48,68,56,70]])],
  "toe-touches":        [qWith(P_LB,{ l:[[52,66,54,48,58,46]], a:[[22,72,22,62]] }), Q(null,[30,74],[50,84],[[52,66,54,48,58,46]],[[42,64,52,52]])],
  "plank-shoulder-taps":[P_PH, qWith(P_PH,{ a:[[69,75,70,89],[62,70,70,64]] })],
  "toes-to-bar":        [Q([57,24],[50,30],[50,58],[[50,72,50,86]],[[47,19,46,6]], gBar(6,30,70)),
                         Q(null,[48,30],[56,55],[[58,41,55,27,52,23]],[[47,19,46,6]], gBar(6,30,70))]
};
var P_FLEGS = [[46,70,45,89,39,89],[54,70,55,89,61,89]];
Object.assign(ILLU_POSES, {
  /* Arme */
  "close-grip-push-ups":[P_PH, P_PL],
  "diamond-push-ups":   [P_PH, P_PL],
  "sphinx-push-ups":    [P_FP, P_PH],
  "triceps-curls":   [qWith(P_STUP,{ x:gDB(64,4) }), qWith(P_STUP,{ a:[[55,15,46,22]], x:gDB(45,23) })],
  "arm-circles":        [qWith(P_F,{ a:[[37,26,24,26],[63,26,76,26]] }), qWith(P_F,{ a:[[37,20,26,12],[63,20,74,12]] })],
  /* Dehnen */
  "neck-stretch":       [Q([43,14],[50,21],[50,52],P_FLEGS,[[40,14,42,6],[56,34,58,48]],"",true), null],
  "shoulder-stretch":   [Q(null,[50,20],[50,52],P_FLEGS,[[40,27,30,27],[44,36,40,28]],"",true), null],
  "triceps-stretch":    [Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[53,6,45,16],[59,14,54,7]]), null],
  "biceps-stretch":     [Q(null,[52,20],[52,50],[[52,70,52,89,60,89]],[[40,25,26,26]], gWall(22)), null],
  "chest-stretch":      [Q(null,[52,20],[52,50],[[52,70,52,89,60,89]],[[38,25,36,12]], gWall(33)), null],
  "wrist-stretch":      [Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[63,25,76,25],[60,32,76,20]]), null],
  "side-bend":          [Q(null,[45,22],[50,52],P_FLEGS,[[48,10,40,3],[42,38,42,48]],"",true), null],
  "cat-cow":            [Q([73,76],[66,64],[40,64],[[40,88,22,88,18,89]],[[67,78,68,89]]), Q([76,54],[66,68],[40,66],[[40,88,22,88,18,89]],[[67,79,68,89]])],
  "childs-pose":        [Q([67,85],[58,80],[36,77],[[54,89,34,89,30,89]],[[72,88,86,88]]), null],
  "sphinx-stretch":     [Q(null,[26,72],[52,84],[[70,86,88,87,92,89]],[[26,88,12,88]]), null],
  "downward-dog":       [Q(null,[64,66],[46,46],[[36,68,26,88,20,89]],[[68,78,72,89]]), null],
  "spinal-twist":       [Q(null,[24,84],[50,84],[[60,76,70,88,76,89]],[[24,72,24,62]]), null],
  "forward-fold":       [Q(null,[62,70],[47,48],[[47,69,46,89,54,89]],[[64,80,64,88]]), null],
  "hip-flexor-stretch": [Q(null,[47,34],[48,64],[[64,64,64,89,72,89],[36,88,20,89,18,89]],[[55,48,49,57]]), null],
  "quad-stretch":       [Q(null,[50,20],[50,50],[[50,70,50,89,58,89],[48,72,38,56,40,54]],[[45,38,39,55],[56,32,62,40]]), null],
  "hamstring-stretch":  [Q(null,[48,68],[30,86],[[56,88,80,88,82,82]],[[62,78,76,84]]), null],
  "calf-stretch":       [Q(null,[62,28],[46,54],[[60,72,62,89,70,89],[36,72,26,89,34,89]],[[72,28,80,26]], gWall(81)), null],
  "figure-four":        [Q(null,[22,84],[48,84],[[56,66,70,68],[64,78,58,66]],[[34,74,52,68]]), null],
  "pigeon-stretch":     [Q(null,[50,54],[46,80],[[62,84,52,89],[28,86,8,88,4,89]],[[52,68,58,88]]), null],
  "butterfly-stretch":  [Q(null,[50,56],[50,82],[[34,80,48,88],[66,80,52,88]],[[44,70,48,86],[56,70,52,86]],"",true), null],
  "worlds-greatest":    [Q(null,[60,48],[44,64],[[62,66,64,89,72,89],[30,84,16,88,14,89]],[[60,68,62,88]]),
                         Q(null,[60,48],[44,64],[[62,66,64,89,72,89],[30,84,16,88,14,89]],[[58,34,56,20],[60,68,62,88]])]
});
var P_HANGS = Q([57,24],[50,30],[50,58],[[50,72,50,86]],[[47,19,46,6]], gBar(6,30,70));
var G_ROW = gBar(57,26,62)+'<path class="ip" d="M32 57V89"/>';
var G_PB = gBar(50,40,70)+'<path class="ip" d="M44 50V89M66 50V89"/>';
var G_SB = gBar(50,44,70)+'<path class="ip" d="M46 50V89"/>';
var G_KB = gBar(50,30,50)+'<path class="ip" d="M34 50V89"/>';
var G_PT = gBar(80,40,62)+'<path class="ip" d="M44 80V89M58 80V89"/>';
var G_MONKEY = gBar(6,8,92)+'<path class="ip" d="M20 3v6M40 3v6M60 3v6M80 3v6"/>';
Object.assign(ILLU_POSES, {
  "chin-ups":           [qWith(P_HANG,{ a:[[44,21,42,6],[56,21,58,6]] }), qWith(P_PULL,{ a:[[39,20,42,6],[61,20,58,6]] })],   // enger gegriffen
  "parallel-bar-dips":  [Q(null,[52,24],[52,52],[[50,68,42,80,44,84]],[[54,37,56,50]], G_PB), Q(null,[54,38],[52,64],[[50,76,40,84,42,86]],[[44,40,56,50]], G_PB)],
  "support-hold":       [Q(null,[52,24],[52,52],[[50,68,42,80,44,84]],[[54,37,56,50]], G_PB), null],
  "hanging-knee-raise": [P_HANGS, qWith(P_HANGS,{ l:[[66,56,66,72,72,72]] })],
  "hanging-leg-raise":  [P_HANGS, qWith(P_HANGS,{ l:[[68,60,86,60,88,56]] })],
  "hanging-l-sit":      [qWith(P_HANGS,{ l:[[68,60,86,60,88,56]] }), null],
  "l-sit":              [Q(null,[48,44],[50,70],[[68,70,86,70,88,66]],[[52,58,54,80]], G_PT), null],
  "windshield-wipers":  [qWith(P_HANG,{ l:[[38,50,26,40],[40,54,28,44]] }), qWith(P_HANG,{ l:[[62,50,74,40],[60,54,72,44]] })],
  "muscle-ups":         [Q([56,36],[50,44],[50,70],[[50,82,50,88]],[[40,48,46,40]], gBar(40,28,72)), Q(null,[50,18],[50,46],[[50,62,50,76]],[[53,31,54,40]], gBar(40,28,72))],
  "monkey-bar-traverse":[Q([56,24],[50,30],[50,58],[[50,72,48,86]],[[42,18,38,6],[56,18,62,6]], G_MONKEY), Q([62,24],[56,30],[56,58],[[56,72,54,86]],[[62,18,68,6],[48,18,44,6]], G_MONKEY)],
  "skin-the-cat":       [P_HANGS, Q([46,34],[50,24],[58,42],[[64,24,72,12]],[[48,15,46,6]], gBar(6,30,70))],
  "archer-push-ups":    [P_PH, qWith(P_PL,{ a:[[60,71,70,89],[74,82,86,88]] })],
  "pistol-squats":      [qWith(P_ST,{ l:[[50,70,50,89,58,89],[68,58,85,62,90,61]], a:[[63,25,76,25]] }), Q(null,[48,46],[40,72],[[56,66,50,89,58,89],[58,74,76,74,80,70]],[[62,48,76,48]])],
  "dragon-flags":       [Q([16,82],[24,84],[40,60],[[52,42,62,26,64,22]],[[14,86,8,82]]), Q([16,82],[24,84],[46,76],[[64,70,84,64,86,60]],[[14,86,8,82]])],
  "clap-push-ups":      [P_PL, qWith(qShift(P_PH,0,-8),{ a:[[72,62,76,70]] })],
  "tuck-jumps":         [P_SQ, Q(null,[50,14],[50,42],[[64,40,58,54,62,56]],[[58,28,64,34]])]
});
Object.assign(ILLU_POSES, {
  "reverse-crunch": [qWith(P_LB,{ l:[[52,66,68,66]] }), Q(null,[22,84],[44,80],[[42,62,56,56]],[[32,87,44,87]])]
});
/* Blickrichtung umgekehrt (Nase): Bauchlage mit Kopf links, Dips mit Blick nach links */
[["superman-hold",1],["swimmers",0],["swimmers",1],["cobra-lift",1],["childs-pose",0],["sphinx-stretch",0],["triceps-dips",0],["triceps-dips",1]].forEach(function(x){
  var q = ILLU_POSES[x[0]][x[1]];
  if(q) ILLU_POSES[x[0]][x[1]] = qWith(q, { b:-1 });
});
/* ---------- Sprünge und Burpees ----------
   Einheitliche Proportionen (Rumpf 30, Oberschenkel 21, Unterschenkel 19, Fuß 7, Ober-/Unterarm je 12),
   damit beim Übergang nichts „wächst“. Für Sprünge wird die Figur verkleinert (qScale, Fixpunkt Boden-Mitte),
   damit Kopf und Arme in der Luft im Bild bleiben. Abläufe mit mehreren Phasen stehen in ILLU_SEQ:
   k = Posen der Reihe nach (danach wieder von vorn), t = je Phase [halten s, Übergang s, Easing]. */
function qScale(q, k){
  function sc(arr){ return arr.map(function(v, i){ return i%2===0 ? +(50+(v-50)*k).toFixed(1) : +(89-(89-v)*k).toFixed(1); }); }
  return Q(q.h ? sc(q.h) : null, sc(q.n), sc(q.p), q.l.map(sc), q.a.map(sc), q.x, q.f, q.b);
}
var J_ST   = Q(null,[50,19],[50,49],[[50,70,50,89,57,89]],[[52,35,54,47]]);          // Stand, Arme locker
var J_SQB  = Q(null,[57,45],[36,66],[[57,71,52,89,59,89]],[[44,54,35,61]]);          // Hocke, Arme hinten (Ausholen)
var J_SQF  = Q(null,[57,45],[36,66],[[57,71,52,89,59,89]],[[66,47,78,45]]);          // Hocke, Arme vorn (Landung)
var J_AIR  = Q(null,[49,4],[50,34],[[53,55,50,74,54,80]],[[58,1,66,-8]]);           // in der Luft, gestreckt, Arme schräg hoch
var J_TUCK = Q(null,[50,6],[50,36],[[70,31,66,50,72,53]],[[61,15,70,22]]);           // Knie zur Brust
var B_SQH  = Q(null,[68,64],[40,74],[[60,72,52,89,59,89]],[[68,77,70,89]]);          // tiefe Hocke, Hände am Boden
var B_PL   = Q(null,[74,63.5],[46,74],[[26,81,9,87,13,89.5]],[[70.5,77,70,89]]);     // hoher Stütz
var B_PUL  = Q(null,[77,79],[47,82.5],[[27,85.5,9,88,13,89.5]],[[61,81,70,89]]);     // Liegestütz unten
var BP_HANG = Q(null,[50,4],[50,34],[[50,55,50,74,53,80]],[[50,-3.5,50,-15]]);       // an der Stange (Stange bei y = -15)
var BP_PULL = Q(null,[50,-8.5],[50,21.5],[[50,42.5,50,61.5,53,68]],[[61,-10,50,-15]]); // Kinn über der Stange
function jSeq(k, faktor){ return k.map(function(q){ return qScale(q, faktor || .76); }); }
var JJ_ZU   = qScale(P_F, .86);
var JJ_AUF  = qScale(qWith(P_F, { l:[[42,70,33,89,27,89],[58,70,67,89,73,89]], a:[[40,16,33,5],[60,16,67,5]] }), .86);
var JJ_LUFT = qShift(qScale(qWith(P_F, { l:[[44,70,40,87,37,92],[56,70,60,87,63,92]], a:[[37,28,29,20],[63,28,71,20]] }), .86), 0, -8);
/* Lateral Hops: seitlich hin und her, jedes Mal kurz abheben und landen */
var LH_BODEN = qScale(qWith(P_F, { l:[[47,71,46,89,40,89],[53,71,54,89,60,89]], a:[[42,36,38,48],[58,36,62,48]] }), .86);
var LH_LUFT  = qShift(qScale(qWith(P_F, { l:[[47,68,46,84,40,86],[53,68,54,84,60,86]], a:[[42,36,38,48],[58,36,62,48]] }), .86), 0, -8);
var BS_BODEN  = Q(null,[40,22],[40,52],[[41,71,40,89,48,89],[39,71,40,89,47,89]],[[42,36,43,49]], gBox(54,76,86));
var BS_AUF    = Q(null,[42,22],[40,52],[[56,58,60,74,68,74],[40,71,40,89,48,89]],[[48,34,52,44]], gBox(54,76,86));
var BS_HOCH   = Q(null,[62,19],[62,47],[[62,62,62,76,70,76],[52,61,48,73,52,75]],[[64,32,65,44]], gBox(54,76,86));
var BS_OBEN   = Q(null,[62,19],[62,47],[[62,62,62,76,70,76],[60,62,60,76,68,76]],[[63,33,64,45]], gBox(54,76,86));
var BS_RUNTER = Q(null,[51,21],[50,50],[[62,60,62,76,70,76],[45,69,42,89,49,89]],[[50,36,50,48]], gBox(54,76,86));
/* Jump Lunges: Ausfallschritt (vorderes Bein vorn, Gegenarm vorn) -> Flug mit Beinen in der Mitte -> Ausfallschritt andersherum */
var JL_A   = Q(null,[50,33],[48,63],[[68,70,68,89,75,89],[41,83,23,85,17,89]],[[43,43,36,52],[58,43,68,51]]);
var JL_AIR = qShift(Q(null,[50,16],[50,46],[[56,65,53,83,60,85],[44,66,41,84,47,87]],[[56,24,62,31],[44,24,38,31]]), 0, -11);
var JF_AIR = Q(null,[58,8],[48,34],[[44,52,34,64,36,72]],[[68,8,78,2]]);
var ILLU_SEQ = {
  "jumping-jacks": { k:[JJ_ZU, JJ_LUFT, JJ_AUF, JJ_LUFT], t:[[.1,.2,"o"],[.03,.2,"i"],[.1,.2,"o"],[.03,.2,"i"]] },
  "skater-jumps":  { k:[SK_L, qMirror(SK_AIR), qMirror(SK_L), SK_AIR], t:[[.16,.3],[0,.3],[.16,.3],[0,.3]] },   // Landung links → Flug nach rechts → Landung rechts → Flug nach links (Zyklus ca. 1,5 s)
  "lateral-hops":  { k:[qShift(LH_BODEN,-12,0), LH_LUFT, qShift(LH_BODEN,12,0), LH_LUFT], t:[[.03,.12,"o"],[.01,.12,"i"],[.03,.12,"o"],[.01,.12,"i"]] },
  /* Fast Feet: flottes Trippeln */
  "fast-feet":     { k:[ILLU_POSES["fast-feet"][0], ILLU_POSES["fast-feet"][1]], t:[[.02,.11],[.02,.11]] },
  /* Box Step-ups: ganzer Zyklus - Führungsbein auf die Box, hochdrücken, zweites Bein nach, zweites Bein zuerst wieder runter */
  "box-step-ups":  { k:[BS_BODEN, BS_AUF, BS_HOCH, BS_OBEN, BS_RUNTER], t:[[.05,.22],[.02,.18],[.02,.16],[.05,.2],[.02,.2]] },
  "jump-squats":  { k:jSeq([J_SQB, J_AIR, J_SQF]), t:[[.22,.32,"o"],[.06,.36,"i"],[.18,.3]] },
  "tuck-jumps":   { k:jSeq([J_SQB, J_TUCK, J_SQF]), t:[[.2,.3,"o"],[.08,.34,"i"],[.16,.3]] },
  "jump-lunges":  { k:jSeq([JL_A, JL_AIR, qSwap(JL_A), JL_AIR], .84), t:[[.16,.26,"o"],[.04,.26,"i"],[.16,.26,"o"],[.04,.26,"i"]] },
  "burpees":      { k:jSeq([J_ST, B_SQH, B_PL, B_PUL, B_PL, B_SQH, J_AIR]), t:[[.2,.38],[.04,.28],[.06,.3],[.08,.3],[.04,.28],[.04,.3,"o"],[.06,.36,"i"]] },
  "plank-burpees":{ k:[J_ST, B_SQH, B_PL, B_SQH], t:[[.25,.45],[.06,.4],[.3,.4],[.06,.45]] },
  "burpee-squat-jumps": { k:jSeq([J_ST, B_SQH, B_PL, B_PUL, B_PL, B_SQH, J_SQB, J_AIR]), t:[[.2,.38],[.04,.28],[.06,.3],[.08,.3],[.04,.28],[.04,.26],[.06,.3,"o"],[.06,.38,"i"]] },
  "frogs":        { k:jSeq([B_SQH, J_AIR]), t:[[.26,.34,"o"],[.06,.42,"i"]] },
  "stand-up-jumps": { k:jSeq([P_LBK, J_SQF, J_AIR, J_SQF]), t:[[.25,.5],[.04,.3,"o"],[.06,.36,"i"],[.1,.5]] },
  /* Flug beim Weitsprung: Oberkörper nach vorn geneigt, Arme vorn oben, Beine ziehen gebeugt hinterher */
  /* Jump Forward Squats: Hocke hinten -> weiter Sprung nach vorn -> Landung in der Hocke -> aufrichten, zurückgehen */
  "jump-forward-squats": { k:jSeq([qShift(J_SQB,-15,0), JF_AIR, qShift(J_SQF,15,0), qShift(J_ST,15,0), qShift(J_ST,-15,0)]),
                           t:[[.2,.32,"o"],[.04,.36,"i"],[.16,.3],[.1,.6,"l"],[.08,.3]] },
  /* Jump Forward Burpees: Burpee mit Liegestütz, Füße zu den Händen, dann weit nach vorn springen */
  "jump-forward-burpees": { k:jSeq([qShift(J_ST,-15,0), qShift(B_SQH,-15,0), qShift(B_PL,-15,0), qShift(B_PUL,-15,0), qShift(B_PL,-15,0), qShift(B_SQH,-15,0),
                                    qShift(J_SQB,-15,0), JF_AIR, qShift(J_SQF,15,0), qShift(J_ST,15,0)]),
                            t:[[.18,.36],[.04,.28],[.06,.3],[.08,.3],[.04,.28],[.04,.24],[.04,.3,"o"],[.04,.36,"i"],[.14,.3],[.1,.6,"l"]] },
  "burpee-pull-ups": { k:jSeq([J_ST, B_SQH, B_PL, B_PUL, B_PL, B_SQH, BP_HANG, BP_PULL, BP_HANG], .78).map(function(q){ return qWith(q, { x:gBar(8,26,74) }); }),
                       t:[[.18,.34],[.03,.26],[.06,.3],[.08,.3],[.03,.26],[.03,.32,"o"],[.1,.45],[.16,.45],[.06,.4,"i"]] }
};
/* Standbilder (Listen) zeigen eine typische Phase */
Object.assign(ILLU_POSES, {
  "jumping-jacks": [JJ_AUF, JJ_ZU],
  "jump-squats": [ILLU_SEQ["jump-squats"].k[0], ILLU_SEQ["jump-squats"].k[1]],
  "tuck-jumps":  [ILLU_SEQ["tuck-jumps"].k[1], ILLU_SEQ["tuck-jumps"].k[0]],
  "jump-lunges": [ILLU_SEQ["jump-lunges"].k[0], ILLU_SEQ["jump-lunges"].k[1]],
  "burpees":     [ILLU_SEQ["burpees"].k[2], ILLU_SEQ["burpees"].k[6]],
  "plank-burpees": [B_SQH, B_PL],
  "burpee-squat-jumps": [ILLU_SEQ["burpee-squat-jumps"].k[7], ILLU_SEQ["burpee-squat-jumps"].k[2]],
  "frogs":       [ILLU_SEQ["frogs"].k[0], ILLU_SEQ["frogs"].k[1]],
  "stand-up-jumps": [ILLU_SEQ["stand-up-jumps"].k[0], ILLU_SEQ["stand-up-jumps"].k[2]],
  "burpee-pull-ups": [ILLU_SEQ["burpee-pull-ups"].k[7], ILLU_SEQ["burpee-pull-ups"].k[2]],
  "jump-forward-squats": [ILLU_SEQ["jump-forward-squats"].k[1], ILLU_SEQ["jump-forward-squats"].k[0]],
  "jump-forward-burpees": [ILLU_SEQ["jump-forward-burpees"].k[7], ILLU_SEQ["jump-forward-burpees"].k[2]]
});

/* Zweite Ansicht fürs Info-Fenster - dort, wo die Seitenansicht die Bewegung nicht zeigt.
   typ "front" = von vorn, "top" = von oben (ohne Bodenlinie, Kopf oben). Pose B ist meist das Spiegelbild. */
function qSide(q){ return qSwap(qMirror(q)); }   // gespiegelt, linke/rechte Glieder behalten ihre Seite
/* Drehbewegung: Beine wie qSide (jedes Bein bleibt auf seiner Seite), Arme nur gespiegelt -
   so bleibt der vordere Arm vorn und schwingt über den Körper zur anderen Seite */
function qTwist(q){ return qWith(qMirror(q), { l:qSide(q).l }); }
function gBall(x, y){ return gHand(x, y, '<circle class="ipf" cx="'+x+'" cy="'+y+'" r="5.5"/>'); }   // kleiner Ball zwischen den Händen
/* Ukraine Twist. Seitlich (Hauptbild): zurückgelehnt, Füße in der Luft, Ball vor der Brust ↔ neben der Hüfte am Boden.
   Von vorn (zweite Ansicht): die Drehung als Bogen - Ball links neben der Hüfte → vor der Brust über den Knien → rechts. */
var RT_SC = Q(null,[26,62],[44,84],[[60,70,76,76,82,74]],[[38,70,47,68]], gBall(51,68));
var RT_ST = Q(null,[27,62],[44,84],[[60,70,76,76,82,74]],[[34,75,39,85]], gBall(41,86));
var RT_BEINE = [[34,63,40,79],[66,63,60,79]];
var RT_FL = Q(null,[46,50],[50,84],RT_BEINE,[[36,66,27,78],[38,61,25,74]], gBall(26,80), true);
var RT_FC = Q(null,[50,49],[50,84],RT_BEINE,[[39,64,46,62],[61,64,54,62]], gBall(50,62), true);
var RT_FR = qWith(qMirror(RT_FL), { l:RT_BEINE, x:gBall(74,80) });
var RT_FLC = Q(null,[48,49.5],[50,84],RT_BEINE,[[40,63,33,64],[41,58,31,62]], gBall(34,66), true);   // Zwischenpunkte auf dem Bogen
var RT_FRC = qWith(qMirror(RT_FLC), { l:RT_BEINE, x:gBall(66,66) });
ILLU_SEQ["russian-twists"] = { k:[RT_SC, RT_ST], t:[[.12,.45],[.12,.45]] };
ILLU_POSES["russian-twists"] = [RT_SC, RT_ST];
var V_ARCH = Q(null,[50,32],[50,64],[[48,79,47,94],[52,79,53,94]],[[64,36,78,38],[36,36,22,38]],"",true);
var V_SNOW = Q([50,11],[50,21],[50,56],[[47,72,47,90],[53,72,53,90]],[[38,40,40,54],[62,40,60,54]],"",true);
/* Commando Pull-Up. Hauptbild von vorn: die Stange zeigt auf den Betrachter (nur ihr Ende ist zu sehen), beide Hände
   greifen dicht hintereinander - der Kopf kommt abwechselnd links und rechts an der Stange vorbei.
   Zweite Ansicht von der Seite: die lange Stange, eine Hand vor der anderen. */
var CP_BAR = '<circle class="ip" cx="50" cy="5.5" r="4.6"/>';   // Stangenende als Ring, die Hände greifen direkt darunter
var CP_H = Q(null,[50,31],[50,59],[[48,73,48,86],[52,73,52,86]],[[46,20,48,9],[54,20,52,9]], CP_BAR, true);
var CP_L = Q([37,8],[42,17],[46,46],[[45,62,45,76],[49,62,49,76]],[[36,10,48,9],[54,19,52,9]], CP_BAR, true);
var CP_R = qMirror(CP_L);
var CS_H = Q(null,[50,30],[50,58],[[50,72,50,86]],[[46,19,45,6],[54,19,56,6]], gBar(6,18,82));
var CS_P = Q([51,5],[50,15],[50,44],[[50,60,50,74]],[[39,15,45,6],[62,16,56,6]], gBar(6,18,82));
ILLU_POSES["commando-pull-ups"] = [CP_L, CP_H];
ILLU_SEQ["commando-pull-ups"] = { k:[CP_H, CP_L, CP_H, CP_R], t:[[.35,.7],[.3,.7],[.35,.7],[.3,.7]] };
/* Seitenansicht für Klimmzug-Varianten: die Stange von der Seite als Punkt (Ring), eine Hand daran.
   Pull-up: Ellbogen beugen und nach unten ziehen, Kinn über die Stange.
   Scapular Pull-up: Arme gestreckt, nur Brust auf und Schultern weg von den Ohren - der Kopf kommt aus dem „Einsinken“ heraus. */
var PS_BAR = '<circle class="ip" cx="50" cy="8" r="4.4"/>';
var PS_HANG = Q([53,29],[50,37],[50,65],[[52,79,44,86]],[[50,25.5,50,14]], PS_BAR);
var PS_TOP  = Q([56,8],[52,18],[47,46],[[50,60,42,67]],[[44,26,50,14]], PS_BAR);
var SS_AKT  = Q([47,26],[46,35],[50,63],[[54,76,47,84]],[[48,24.5,50,14]], PS_BAR);
/* ---------- Fitnessstudio: Geräte ----------
   Schlichte Gerätelinien (Sitz, Lehne, Rahmen). Griffe, Stangen und Hantelscheiben hält die Hand (gHand),
   damit sie in der Animation mitwandern. Seitlich mit Blick nach rechts, außer Latzug und Adduktoren (von vorn). */
function gLinie(d){ return '<path class="ip" d="'+d+'"/>'; }
function gSitz(x1, x2, y){ return gLinie("M"+x1+" "+y+"H"+x2+"M"+((x1+x2)/2)+" "+y+"V89"); }
function gGriff(x, y){ return gHand(x, y, '<path class="ip" d="M'+x+' '+(y-4)+'v8"/>'); }
function gQuer(x, y, b){ return gHand(x, y, '<path class="ip" d="M'+(x-b)+' '+y+'h'+(2*b)+'"/>'); }
function gScheibe(x, y, r){ return gHand(x, y, '<circle class="ipf" cx="'+x+'" cy="'+y+'" r="'+(r||7)+'"/>'); }
function gRolle(x, y){ return '<circle class="ip" cx="'+x+'" cy="'+y+'" r="3"/>'; }
/* Polster/Platte am Fuß: wandert mit dem nächstgelegenen Beinpunkt mit (wie gHand bei der Hand) */
function gFuss(x, y, inner){ return '<g class="gf" data-at="'+x+','+y+'">'+inner+'</g>'; }
function gPolster(x, y){ return gFuss(x, y, '<circle class="ipf" cx="'+x+'" cy="'+y+'" r="4"/>'); }
function gPlatte(x, y, dx, dy){ return gFuss(x, y, '<path class="ip gp" d="M'+(x-dx)+' '+(y-dy)+'L'+(x+dx)+' '+(y+dy)+'"/>'); }
var ST_SITZ  = gSitz(32, 56, 65) + gLinie("M34 28V65");            // Sitz mit Lehne
var ST_BEINE = [[62,65,61,84,68,88]];                               // sitzend, Füße am Boden
var ST_BANK  = gBench(12, 60, 73);
function stLiegen(arm, x){ return Q([16,66],[26,67],[48,69],[[64,64,66,85,73,89]],[arm], ST_BANK+x); }
Object.assign(ILLU_POSES, {
  "chest-press-machine": [Q(null,[42,34],[42,63],ST_BEINE,[[40,45,52,41]], ST_SITZ+gGriff(52,41)),
                          Q(null,[42,34],[42,63],ST_BEINE,[[54,37,66,38]], ST_SITZ+gGriff(66,38))],
  "shoulder-press-machine": [Q(null,[42,34],[42,63],ST_BEINE,[[50,43,51,31]], ST_SITZ+gGriff(51,31)),
                             Q(null,[42,34],[42,63],ST_BEINE,[[46,22,48,10]], ST_SITZ+gGriff(48,10))],
  "butterfly":         [Q(null,[42,34],[42,63],ST_BEINE,[[31,37,31,25]], ST_SITZ+gHand(31,25,'<path class="ip" d="M31 23V37"/>')),
                        Q(null,[42,34],[42,63],ST_BEINE,[[53,37,53,25]], ST_SITZ+gHand(53,25,'<path class="ip" d="M53 23V37"/>'))],
  "reverse-butterfly": [Q(null,[42,34],[42,63],ST_BEINE,[[54,38,66,39]], gSitz(30,54,65)+gLinie("M52 30V56")+gGriff(66,39)),
                        Q(null,[42,34],[42,63],ST_BEINE,[[30,37,18,38]], gSitz(30,54,65)+gLinie("M52 30V56")+gGriff(18,38))],
  "row-machine":       [Q(null,[42,34],[42,63],ST_BEINE,[[54,38,66,41]], gSitz(30,54,65)+gLinie("M50 36V54")+gGriff(66,41)),
                        Q(null,[42,34],[42,63],ST_BEINE,[[31,40,43,44]], gSitz(30,54,65)+gLinie("M50 36V54")+gGriff(43,44))],
  "cable-row":         [Q(null,[42,45],[36,72],[[55,64,72,70,73,62]],[[53,50,64,53]], gSitz(22,48,74)+gLinie("M77 58V78")+gRolle(82,52)+gGriff(64,53)),
                        Q(null,[40,44],[36,72],[[55,64,72,70,73,62]],[[28,50,40,55]], gSitz(22,48,74)+gLinie("M77 58V78")+gRolle(82,52)+gGriff(40,55))],
  "lat-pulldown":      [Q(null,[50,34],[50,62],[[44,68,44,86],[56,68,56,86]],[[40,24,34,12],[60,24,66,12]], gLinie("M36 66H64M50 66V89")+gHand(34,12,'<path class="ip" d="M16 12H84"/>'), true),
                        Q(null,[50,34],[50,62],[[44,68,44,86],[56,68,56,86]],[[36,40,34,27],[64,40,66,27]], gLinie("M36 66H64M50 66V89")+gHand(34,27,'<path class="ip" d="M16 27H84"/>'), true)],
  "back-extension":    [Q(null,[60,80],[50,54],[[38,66,26,78,22,72]],[[62,70,56,66]], gLinie("M20 86L52 58M16 80L26 86")+gRolle(55,57)),
                        Q(null,[70,34],[50,54],[[38,66,26,78,22,72]],[[66,44,60,40]], gLinie("M20 86L52 58M16 80L26 86")+gRolle(55,57))],
  "leg-press":         [Q(null,[30,36],[44,62],[[56,44,70,58,72,50]],[[36,46,44,54]], gLinie("M6 72H66")+'<path class="ip gp" d="M75 40V72"/>'),
                        Q(null,[18,36],[32,62],[[51,59,70,58,72,50]],[[24,46,32,54]], gLinie("M6 72H66")+'<path class="ip gp" d="M75 40V72"/>')],
  "leg-press-45":      [Q(null,[14,57],[36,74],[[34,54,54,56,58,50]],[[22,67,32,72]], gLinie("M50 86L90 46M8 60L30 80")+gPlatte(59,54,6,-6)),
                        Q(null,[14,57],[36,74],[[50,60,64,46,69,41]],[[22,67,32,72]], gLinie("M50 86L90 46M8 60L30 80")+gPlatte(69,45,6,-6))],
  "leg-extension":     [Q(null,[42,34],[44,63],[[62,65,60,84,66,88]],[[42,46,50,58]], gSitz(34,60,65)+gLinie("M36 28V65")+gPolster(65,80)),
                        Q(null,[42,34],[44,63],[[62,65,80,60,82,53]],[[42,46,50,58]], gSitz(34,60,65)+gLinie("M36 28V65")+gPolster(79,55))],
  "leg-curl":          [Q(null,[42,34],[44,63],[[62,65,80,63,82,56]],[[42,46,50,58]], gSitz(34,60,65)+gLinie("M36 28V65M52 58H68")+gPolster(80,68)),
                        Q(null,[42,34],[44,63],[[62,65,56,82,62,86]],[[42,46,50,58]], gSitz(34,60,65)+gLinie("M36 28V65M52 58H68")+gPolster(51,80))],
  "adductor-machine":  [Q(null,[50,32],[50,60],[[38,65,36,83],[62,65,64,83]],[[40,42,38,54],[60,42,62,54]], gLinie("M34 64H66M50 64V89")+gFuss(42,68,'<path class="ip gp" d="M42 62V74"/>')+gFuss(58,68,'<path class="ip gp" d="M58 62V74"/>'), true),
                        Q(null,[50,32],[50,60],[[46,71,46,89],[54,71,54,89]],[[40,42,38,54],[60,42,62,54]], gLinie("M34 64H66M50 64V89")+gFuss(49,74,'<path class="ip gp" d="M49 68V80"/>')+gFuss(51,74,'<path class="ip gp" d="M51 68V80"/>'), true)],
  "calf-machine":      [Q(null,[50,15],[50,45],[[50,65,50,84,58,84]],[[58,24,58,16]], gLinie("M40 89V84H64V89")+gHand(58,16,'<path class="ip gp" d="M44 15H62"/>')),
                        Q(null,[50,10],[50,40],[[50,60,50,77,57,84]],[[58,19,58,11]], gLinie("M40 89V84H64V89")+gHand(58,11,'<path class="ip gp" d="M44 10H62"/>'))],
  "biceps-machine":    [Q(null,[46,37],[40,64],[[58,67,58,86,65,88]],[[56,46,66,55]], gSitz(30,52,66)+gLinie("M47 45L61 54")+gGriff(66,55)),
                        Q(null,[46,37],[40,64],[[58,67,58,86,65,88]],[[56,46,53,34]], gSitz(30,52,66)+gLinie("M47 45L61 54")+gGriff(53,34))],
  "triceps-pushdown":  [Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[52,32,62,26]], gLinie("M72 0V89")+gRolle(68,4)+gQuer(62,26,3)),
                        Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[52,32,54,44]], gLinie("M72 0V89")+gRolle(68,4)+gQuer(54,44,3))],
  "cable-curl":        [Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[52,32,54,44]], gLinie("M74 40V89")+gRolle(70,84)+gQuer(54,44,3)),
                        Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[52,32,60,23]], gLinie("M74 40V89")+gRolle(70,84)+gQuer(60,23,3))],
  "skull-crusher":     [stLiegen([27,55,28,43], gScheibe(28,41,3)), stLiegen([27,55,17,60], gScheibe(15,60,3))],
  "pullover":          [stLiegen([27,55,28,43], gDB(28,41)), stLiegen([16,62,5,60], gDB(5,58))],
  "bench-press":       [stLiegen([29,56,30,44], gScheibe(30,42,7)), stLiegen([22,77,30,65], gScheibe(30,62,7))],
  "ab-crunch-machine": [Q(null,[42,35],[40,64],[[60,66,60,85,67,88]],[[48,28,44,20]], gSitz(30,54,66)+gLinie("M32 30V66")+gGriff(44,20)),
                        Q(null,[54,40],[40,64],[[60,66,60,85,67,88]],[[60,33,56,25]], gSitz(30,54,66)+gLinie("M32 30V66")+gGriff(56,25))],
  "barbell-squat":     [Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[44,30,48,21]], gScheibe(47,20,7)),
                        Q(null,[46,36],[36,62],[[57,62,52,89,60,89]],[[40,46,44,37]], gScheibe(43,35,7))],
  "barbell-deadlift":  [Q(null,[67,52],[40,58],[[54,68,52,86,60,89]],[[66,65,64,77]], gScheibe(64,80,8)),
                        Q(null,[50,20],[50,50],[[50,70,50,89,58,89]],[[52,34,53,46]], gScheibe(54,48,8))]
});
ILLU_POSES["abductor-machine"] = [
  Q(null,[50,32],[50,60],[[46,71,46,89],[54,71,54,89]],[[40,42,38,54],[60,42,62,54]], gLinie("M34 64H66M50 64V89")+gFuss(42,74,'<path class="ip gp" d="M42 68V80"/>')+gFuss(58,74,'<path class="ip gp" d="M58 68V80"/>'), true),
  Q(null,[50,32],[50,60],[[38,65,36,83],[62,65,64,83]],[[40,42,38,54],[60,42,62,54]], gLinie("M34 64H66M50 64V89")+gFuss(34,68,'<path class="ip gp" d="M34 62V74"/>')+gFuss(66,68,'<path class="ip gp" d="M66 62V74"/>'), true)];
var ST_STAND = [[50,70,50,89,58,89]];
var ST_FRONT = [[46,70,45,89,39,89],[54,70,55,89,61,89]];
var ST_SCHRAEG = gLinie("M16 50L42 74M44 74V89");
Object.assign(ILLU_POSES, {
  "hack-squat":        [Q(null,[46,21],[52,50],[[54,70,52,89,60,89]],[[44,30,46,22]], gLinie("M36 12L42 74M36 89H66")),
                        Q(null,[40,38],[42,64],[[60,62,54,89,62,89]],[[38,47,40,39]], gLinie("M36 12L42 74M36 89H66"))],
  "smith-squat":       [qWith(ILLU_POSES["barbell-squat"][0], { x:gLinie("M24 0V89M72 0V89")+gScheibe(47,20,7) }),
                        qWith(ILLU_POSES["barbell-squat"][1], { x:gLinie("M24 0V89M72 0V89")+gScheibe(43,35,7) })],
  "leg-press-single":  [qWith(ILLU_POSES["leg-press"][0],{ l:[[56,44,70,58,72,50],[62,66,60,84,66,86]] }),   // zweites Bein ruht unten
                        qWith(ILLU_POSES["leg-press"][1],{ l:[[51,59,70,58,72,50],[50,66,48,84,54,86]] })],
  "hip-thrust":        [Q(null,[28,62],[46,80],[[60,66,66,86,73,88]],[[36,70,46,75]], gBench(6,32,66)+gScheibe(46,74,6)),
                        Q(null,[28,62],[50,60],[[64,62,66,86,73,88]],[[38,64,50,55]], gBench(6,32,66)+gScheibe(50,54,6))],
  "glute-kickback-cable": [Q(null,[58,24],[50,50],[[50,70,50,89,58,89],[48,69,46,87,52,89]],[[66,32,72,40]], gLinie("M76 18V89")+gRolle(74,84)+gPolster(46,86)),
                           Q(null,[58,24],[50,50],[[50,70,50,89,58,89],[34,62,22,74,20,68]],[[66,32,72,40]], gLinie("M76 18V89")+gRolle(74,84)+gPolster(22,73))],
  "seated-calf":       [Q(null,[40,33],[40,62],[[60,62,62,81,70,84]],[[46,44,54,56]], gSitz(28,50,64)+gLinie("M52 57H68M56 89V84H78V89")),
                        Q(null,[40,33],[40,62],[[60,62,62,77,70,84]],[[46,44,54,56]], gSitz(28,50,64)+gLinie("M52 57H68M56 89V84H78V89"))],
  "incline-chest-press": [Q(null,[36,34],[42,63],ST_BEINE,[[38,46,50,40]], gSitz(32,56,65)+gLinie("M28 26L36 65")+gGriff(50,40)),
                          Q(null,[36,34],[42,63],ST_BEINE,[[47,29,58,24]], gSitz(32,56,65)+gLinie("M28 26L36 65")+gGriff(58,24))],
  "cable-crossover":   [Q(null,[50,20],[50,52],ST_FRONT,[[38,16,28,8],[62,16,72,8]], gLinie("M12 0V89M88 0V89"), true),
                        Q(null,[50,20],[50,52],ST_FRONT,[[42,32,48,43],[58,32,52,43]], gLinie("M12 0V89M88 0V89"), true)],
  "incline-db-press":  [Q(null,[24,48],[46,70],[[60,66,64,86,71,88]],[[28,60,34,50]], ST_SCHRAEG+gDB(34,48)),
                        Q(null,[24,48],[46,70],[[60,66,64,86,71,88]],[[34,38,40,27]], ST_SCHRAEG+gDB(40,25))],
  "db-fly":            [stLiegen([27,55,28,43], gDB(28,41)), stLiegen([18,62,14,74], gDB(14,72))],
  "assisted-pullup":   [Q(null,[50,30],[50,58],[[46,70,40,78],[54,70,60,78]],[[40,21,34,6],[60,21,66,6]], gBar(6,24,76), true),
                        Q(null,[50,14],[50,42],[[46,54,40,62],[54,54,60,62]],[[34,20,42,6],[66,20,58,6]], gBar(6,24,76), true)],
  "close-grip-pulldown": [Q(null,[50,34],[50,62],[[44,68,44,86],[56,68,56,86]],[[46,22,46,10],[54,22,54,10]], gLinie("M36 66H64M50 66V89")+gHand(46,10,'<path class="ip" d="M42 10H58"/>'), true),
                          Q(null,[50,34],[50,62],[[44,68,44,86],[56,68,56,86]],[[42,44,46,33],[58,44,54,33]], gLinie("M36 66H64M50 66V89")+gHand(46,33,'<path class="ip" d="M42 33H58"/>'), true)],
  "t-bar-row":         [qWith(P_HG,{ x:gQuer(61,68,4)+gLinie("M18 88L40 76") }), qWith(P_HG,{ a:[[50,36,56,48]], x:gQuer(56,50,4)+gLinie("M18 88L40 76") })],
  "barbell-row":       [qWith(P_HG,{ x:gScheibe(61,70,7) }), qWith(P_HG,{ a:[[50,36,56,48]], x:gScheibe(56,52,7) })],
  "face-pull":         [Q(null,[50,20],[50,50],ST_STAND,[[62,20,74,17]], gLinie("M90 0V89")+gRolle(86,16)+gQuer(74,17,3)),
                        Q(null,[50,20],[50,50],ST_STAND,[[42,14,54,12]], gLinie("M90 0V89")+gRolle(86,16)+gQuer(54,12,3))],
  "straight-arm-pulldown": [Q(null,[54,22],[48,50],ST_STAND,[[62,14,70,6]], gLinie("M84 0V89")+gRolle(80,4)+gQuer(70,6,3)),
                            Q(null,[54,22],[48,50],ST_STAND,[[56,34,58,46]], gLinie("M84 0V89")+gRolle(80,4)+gQuer(58,46,3))],
  "lateral-raise":     [Q(null,[50,20],[50,52],ST_FRONT,[[44,32,42,44],[56,32,58,44]], gDB(42,46)+gDB(58,46), true),
                        Q(null,[50,20],[50,52],ST_FRONT,[[39,22,27,22],[61,22,73,22]], gDB(27,22)+gDB(73,22), true)],
  "shrugs":            [Q(null,[50,20],[50,50],ST_STAND,[[52,33,53,46]], gDB(53,48)), Q(null,[50,16],[50,50],ST_STAND,[[52,29,53,42]], gDB(53,44))],
  "hammer-curl":       [Q(null,[50,20],[50,50],ST_STAND,[[52,32,53,44]], gHand(53,44,'<path class="ip" d="M53 39v10"/>')),
                        Q(null,[50,20],[50,50],ST_STAND,[[52,32,60,23]], gHand(60,23,'<path class="ip" d="M60 18v10"/>'))],
  "barbell-curl":      [Q(null,[50,20],[50,50],ST_STAND,[[52,32,53,44]], gScheibe(54,45,5)), Q(null,[50,20],[50,50],ST_STAND,[[52,32,60,23]], gScheibe(61,22,5))],
  "overhead-cable-triceps": [qWith(ILLU_POSES["triceps-curls"][1], { x:gLinie("M22 0V89")+gRolle(26,14)+gQuer(46,23,3) }),
                             qWith(ILLU_POSES["triceps-curls"][0], { x:gLinie("M22 0V89")+gRolle(26,14)+gQuer(64,4,3) })],
  "triceps-machine":   [Q(null,[42,34],[42,63],ST_BEINE,[[34,44,42,52]], ST_SITZ+gGriff(42,52)), Q(null,[42,34],[42,63],ST_BEINE,[[43,46,44,58]], ST_SITZ+gGriff(44,58))],
  /* Gluteus-Maschine: vorgebeugt am Brustpolster, ein Fuß drückt die Platte nach hinten oben */
  "glute-machine":     [Q(null,[66,30],[48,50],[[50,70,50,89,58,89],[48,69,46,87,52,89]],[[68,40,74,44]], gLinie("M80 10V89M66 42L74 32")+gGriff(74,44)+gPlatte(47,84,4,-3)),
                        Q(null,[66,30],[48,50],[[50,70,50,89,58,89],[34,62,22,72,20,66]],[[68,40,74,44]], gLinie("M80 10V89M66 42L74 32")+gGriff(74,44)+gPlatte(21,69,4,-3))],
  /* Wadenpresse: in der Beinpresse, Beine fast gestreckt, nur die Fußspitzen drücken die Platte */
  "calf-press":        [Q(null,[18,36],[32,62],[[51,58,69,56,71,47]],[[24,46,32,54]], gLinie("M6 72H66")+gPlatte(71,47,1,-8)),
                        Q(null,[18,36],[32,62],[[51,58,69,56,76,52]],[[24,46,32,54]], gLinie("M6 72H66")+gPlatte(76,52,1,-8))],
  /* Beinbeuger liegend: bäuchlings auf der Bank, Fersen ziehen das Polster zum Po */
  "lying-leg-curl":    [Q(null,[30,63],[54,64],[[70,65,86,66,89,72]],[[22,70,18,76]], gBench(16,72,70)+gPolster(86,61)+gGriff(18,76)),
                        Q(null,[30,63],[54,64],[[70,65,62,48,56,46]],[[22,70,18,76]], gBench(16,72,70)+gPolster(64,44)+gGriff(18,76))],
  /* Rotary Torso (von vorn): sitzend, Arme am Polster, der Oberkörper dreht von einer Seite zur anderen */
  "rotary-torso":      [Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[42,40,34,45],[58,40,38,47]], gLinie("M36 62H64M50 62V89")+gQuer(36,46,5), true),
                        Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[42,40,62,47],[58,40,66,45]], gLinie("M36 62H64M50 62V89")+gQuer(64,46,5), true)],
  /* Rückenstrecker-Maschine: sitzend, Polster am oberen Rücken, aus der Beugung aufrichten */
  "back-extension-machine": [Q(null,[56,40],[42,63],ST_BEINE,[[56,50,58,46]], gSitz(30,56,65)+gHand(58,46,'<circle class="ipf" cx="48" cy="35" r="4"/>')),
                             Q(null,[37,35],[42,63],ST_BEINE,[[40,46,43,43]], gSitz(30,56,65)+gHand(43,43,'<circle class="ipf" cx="33" cy="32" r="4"/>'))],
  /* Trizeps-Extension (Maschine): Oberarme liegen auf dem Polster, die Unterarme strecken nach vorn unten */
  "triceps-extension-machine": [Q(null,[42,34],[42,63],ST_BEINE,[[56,46,56,33]], ST_SITZ+gLinie("M50 50L63 50")+gGriff(56,33)),
                                Q(null,[42,34],[42,63],ST_BEINE,[[56,46,69,53]], ST_SITZ+gLinie("M50 50L63 50")+gGriff(69,53))],
  /* Seitheber-Maschine (von vorn): sitzend, Polster an den Oberarmen, Arme seitlich bis Schulterhöhe */
  "lateral-raise-machine": [Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[42,41,40,52],[58,41,60,52]], gLinie("M36 62H64M50 62V89")+gScheibe(41,46,3)+gScheibe(59,46,3), true),
                            Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[38,35,28,33],[62,35,72,33]], gLinie("M36 62H64M50 62V89")+gScheibe(33,34,3)+gScheibe(67,34,3), true)],
  /* Seitheben am Kabel (von vorn): Zug unten auf der anderen Seite, ein Arm hebt seitlich */
  "cable-lateral-raise": [Q(null,[50,20],[50,52],ST_FRONT,[[58,32,56,46],[44,32,42,44]], gLinie("M16 8V89")+gRolle(20,84)+gGriff(56,46), true),
                          Q(null,[50,20],[50,52],ST_FRONT,[[63,24,75,22],[44,32,42,44]], gLinie("M16 8V89")+gRolle(20,84)+gGriff(75,22), true)],
  "cable-woodchop":    [Q(null,[50,20],[50,52],ST_FRONT,[[40,14,32,6],[44,16,34,7]], gLinie("M12 0V89")+gQuer(33,6,3), true),
                        Q(null,[50,20],[50,52],ST_FRONT,[[58,32,66,42],[56,34,65,44]], gLinie("M12 0V89")+gQuer(66,43,3), true)],
  "captains-chair":    [Q(null,[48,30],[48,58],[[49,74,49,87,55,88]],[[56,40,64,34]], gLinie("M42 18V62M44 40H66M40 62V89")),
                        Q(null,[48,30],[48,58],[[64,50,64,64,70,64]],[[56,40,64,34]], gLinie("M42 18V62M44 40H66M40 62V89"))],
  "barbell-overhead-press": [qWith(P_STUP,{ a:[[58,40,57,30]], x:gScheibe(57,28,6) }), qWith(P_STUP,{ a:[[54,16,53,5]], x:gScheibe(53,4,6) })],
  "barbell-rdl":       [qWith(P_ST,{ x:gScheibe(53,50,7) }), qWith(P_HG,{ x:gScheibe(61,70,7) })],
  /* Multipresse: wie Bankdrücken, die Stange läuft in einer Schiene */
  "smith-bench-press": [stLiegen([29,56,30,44], gLinie("M30 12V60")+gScheibe(30,42,7)), stLiegen([22,77,30,65], gLinie("M30 12V60")+gScheibe(30,62,7))],
  /* Dip-Maschine: kniend auf dem Polster, das Gegengewicht schiebt mit */
  "assisted-dip":      [Q(null,[52,24],[52,52],[[50,68,42,80,44,84]],[[54,37,56,50]], G_PB+gPolster(49,72)),
                        Q(null,[54,38],[52,64],[[50,76,40,84,42,86]],[[44,40,56,50]], G_PB+gPolster(49,80))],
  /* Rudern von oben: Brust am Polster, Griffe vorn oben, Ellbogen ziehen nach unten hinten */
  "high-row-machine":  [Q(null,[42,34],[42,63],ST_BEINE,[[53,29,63,21]], gSitz(30,54,65)+gLinie("M50 36V54M76 4V89")+gGriff(63,21)),
                        Q(null,[42,34],[42,63],ST_BEINE,[[35,51,46,43]], gSitz(30,54,65)+gLinie("M50 36V54M76 4V89")+gGriff(46,43))],
  /* Kabel-Crunch: kniend vor dem Turm, Seil an der Stirn, der Oberkörper rollt nach vorn unten ein */
  "cable-crunch":      [Q(null,[52,34],[49,62],[[50,87,30,88,24,89]],[[62,40,56,30]], gLinie("M90 0V89")+gRolle(86,6)+gGriff(56,30)),
                        Q(null,[75,72],[49,62],[[50,87,30,88,24,89]],[[70,81,80,73]], gLinie("M90 0V89")+gRolle(86,6)+gGriff(80,73))],
  /* Pull-Through: mit dem Rücken zum Kabel, Seil zwischen den Beinen, aus der Hüfte aufrichten */
  "cable-pull-through": [qWith(P_HG,{ a:[[58,54,49,63]], x:gLinie("M8 30V89")+gRolle(12,84)+gGriff(49,63) }),
                         qWith(P_ST,{ a:[[51.5,37.4,52,50]], x:gLinie("M8 30V89")+gRolle(12,84)+gGriff(52,50) })]
});
/* Butterfly und Butterfly reverse von vorn: seitlich musste der Arm in der Mitte durch die Tiefe - die Figur schwang ihn dabei über den Kopf */
ILLU_POSES["butterfly"] = [
  Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[38,36,37,24],[62,36,63,24]], gLinie("M36 62H64M50 62V89")+gHand(37,24,'<path class="ip" d="M37 22V36"/>')+gHand(63,24,'<path class="ip" d="M63 22V36"/>'), true),
  Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[45,40,47,28],[55,40,53,28]], gLinie("M36 62H64M50 62V89")+gHand(47,28,'<path class="ip" d="M47 26V40"/>')+gHand(53,28,'<path class="ip" d="M53 26V40"/>'), true)];
ILLU_POSES["reverse-butterfly"] = [
  Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[44,39,47,45],[56,39,53,45]], gLinie("M36 62H64M50 62V89")+gGriff(47,45)+gGriff(53,45), true),
  Q(null,[50,30],[50,60],[[43,64,40,82,36,86],[57,64,60,82,64,86]],[[38,35,26,35],[62,35,74,35]], gLinie("M36 62H64M50 62V89")+gGriff(26,35)+gGriff(74,35), true)];
/* Gruppen im Reiter „Studio“ */
var STUDIO_GRUPPEN = [
  { id:"beine",   de:"Beine & Po", en:"Legs & glutes", ids:"leg-press leg-press-45 leg-press-single hack-squat smith-squat leg-extension leg-curl adductor-machine abductor-machine hip-thrust glute-kickback-cable calf-machine seated-calf glute-machine calf-press lying-leg-curl cable-pull-through barbell-squat barbell-deadlift barbell-rdl" },
  { id:"brust",   de:"Brust",   en:"Chest",  ids:"chest-press-machine incline-chest-press smith-bench-press butterfly cable-crossover assisted-dip incline-db-press db-fly pullover bench-press" },
  { id:"ruecken", de:"Rücken",  en:"Back",   ids:"lat-pulldown close-grip-pulldown assisted-pullup row-machine high-row-machine cable-row t-bar-row face-pull straight-arm-pulldown reverse-butterfly back-extension back-extension-machine barbell-row" },
  { id:"schulter",de:"Schultern", en:"Shoulders", ids:"shoulder-press-machine lateral-raise-machine lateral-raise cable-lateral-raise shrugs barbell-overhead-press" },
  { id:"arme",    de:"Arme",    en:"Arms",   ids:"biceps-machine cable-curl hammer-curl barbell-curl triceps-pushdown overhead-cable-triceps triceps-machine triceps-extension-machine skull-crusher" },
  { id:"bauch",   de:"Bauch",   en:"Abs",    ids:"ab-crunch-machine cable-crunch rotary-torso captains-chair cable-woodchop" }
];
STUDIO_GRUPPEN.forEach(function(g){ g.ids.split(" ").forEach(function(id){
  (ILLU_POSES[id] || []).forEach(function(q){ if(q && q.x) q.x = q.x.replace(/class="(ip|ipf)( gp)?"/g, 'class="$1$2 gm"'); });
}); });
/* Ziel und Steigerung je Übung (sonst 3 × 12, +2,5 kg) */
var STUDIO_ZIEL = { "bench-press":[3,8,2.5], "barbell-squat":[3,8,5], "barbell-deadlift":[3,6,5],
  "leg-press":[3,12,5], "leg-press-45":[3,12,5], "calf-machine":[3,15,5], "back-extension":[3,15,2.5], "ab-crunch-machine":[3,15,2.5], "cable-crunch":[3,15,2.5], "smith-bench-press":[3,8,2.5] };
/* Sprossen-Klimmzug: je eine Hand an zwei Sprossen der Hangelleiter, der Kopf kommt zwischen den Sprossen hoch */
var SP_LEITER = '<path class="ip" d="M18 2H82"/><circle class="ip" cx="40" cy="5" r="3.4"/><circle class="ip" cx="60" cy="5" r="3.4"/>';
ILLU_POSES["rung-pull-ups"] = [
  Q(null,[50,31],[50,59],[[48,73,48,85],[52,73,52,85]],[[43,20,40,9],[57,20,60,9]], SP_LEITER, true),
  Q(null,[50,16],[50,44],[[48,58,48,70],[52,58,52,70]],[[37,19,40,9],[63,19,60,9]], SP_LEITER, true)
];
var V_BANK = '<path class="ip" d="M42 22V72M58 22V72"/>';   // Bank von oben
var ILLU_VIEW2 = {
  "pull-ups":          { typ:"side", haupt:"front", p:[PS_HANG, PS_TOP] },
  "scapular-pull-ups": { typ:"side", haupt:"front", p:[PS_HANG, SS_AKT] },
  "commando-pull-ups": { typ:"side", haupt:"front", p:[CS_H, CS_P] },
  "russian-twists":   { typ:"front", p:[RT_FL, RT_FR], seq:{ k:[RT_FL, RT_FLC, RT_FC, RT_FRC, RT_FR, RT_FRC, RT_FC, RT_FLC],
                         t:[[.14,.2,"i"],[0,.18,"l"],[0,.18,"l"],[0,.2,"o"],[.14,.2,"i"],[0,.18,"l"],[0,.18,"l"],[0,.2,"o"]] } },
  "archer-push-ups":  { typ:"top",   p:[V_ARCH, Q(null,[60,33],[55,64],[[52,79,50,94],[57,79,56,94]],[[70,46,78,38],[41,37,22,38]],"",true)] },
  "shoulder-press":   { typ:"front", p:[Q(null,[50,28],[50,58],[[46,74,45,89,39,89],[54,74,55,89,61,89]],[[37,36,37,24],[63,36,63,24]], gDB(37,23)+gDB(63,23), true),
                                        Q(null,[50,28],[50,58],[[46,74,45,89,39,89],[54,74,55,89,61,89]],[[40,17,42,5],[60,17,58,5]], gDB(42,5)+gDB(58,5), true)] },
  "reverse-snow-angels": { typ:"top", p:[V_SNOW, qWith(V_SNOW,{ a:[[38,14,44,4],[62,14,56,4]] })] },
  /* Liegestütz-Varianten von oben: der Unterschied liegt in Handstellung und Ellbogen */
  "push-ups":         { typ:"top", p:[qWith(V_ARCH,{ a:[[57,38.5,64,40],[43,38.5,36,40]] }), qWith(V_ARCH,{ a:[[62,46,64,40],[38,46,36,40]] })] },
  "close-grip-push-ups": { typ:"top", p:[qWith(V_ARCH,{ a:[[53,38.5,56,40],[47,38.5,44,40]] }), qWith(V_ARCH,{ a:[[57,50,56,40],[43,50,44,40]] })] },
  "diamond-push-ups": { typ:"top", p:[qWith(V_ARCH,{ a:[[51,39.5,52,42],[49,39.5,48,42]] }), qWith(V_ARCH,{ a:[[62,44,52,42],[38,44,48,42]] })] },
  /* Fliegende und Überzug von oben: seitlich weit auf gegen gerade über den Kopf */
  "db-fly":           { typ:"top", p:[qWith(V_ARCH,{ a:[[54,38,52,42],[46,38,48,42]], x:V_BANK+gDB(52,42)+gDB(48,42) }),
                                      qWith(V_ARCH,{ a:[[62,38,74,40],[38,38,26,40]], x:V_BANK+gDB(74,40)+gDB(26,40) })] },
  "pullover":         { typ:"top", p:[qWith(V_ARCH,{ a:[[54,38,51,42],[46,38,49,42]], x:V_BANK+gDB(50,43) }),
                                      qWith(V_ARCH,{ a:[[54,24,52,12],[46,24,48,12]], x:V_BANK+gDB(50,10) })] },
  "spinal-twist":     { typ:"top",   p:[Q([44,15],[50,24],[50,56],[[66,58,62,74],[68,66,64,82]],[[36,27,20,27],[64,27,80,27]],"",true), null] }
};

/* Ausführliche Anleitung je Übung: [Deutsch, Englisch], Schritte mit | getrennt */
var EX_INFO = {
  "glute-machine":["Mit der Brust ans Polster lehnen, Griffe fassen, einen Fuß an die Platte setzen.|Das Bein aus der Hüfte nach hinten oben drücken, bis es gestreckt ist.|Kontrolliert zurück, dann die Seite wechseln.","Lean your chest on the pad, hold the handles, place one foot on the plate.|Press the leg back and up from your hip until it is straight.|Return under control, then switch sides."],
  "calf-press":["In die Beinpresse setzen, nur die Fußballen unten an die Platte.|Beine fast strecken und die Platte mit den Zehen wegdrücken.|Langsam zurück, bis die Waden gedehnt sind.","Sit in the leg press with only the balls of your feet on the lower edge of the plate.|Legs nearly straight, push the plate away with your toes.|Return slowly until your calves are stretched."],
  "lying-leg-curl":["Bäuchlings auf die Bank legen, das Polster liegt knapp über den Fersen, Griffe fassen.|Die Fersen zum Po ziehen.|Langsam wieder strecken, ohne abzulegen.","Lie face down, the pad just above your heels, hold the handles.|Pull your heels towards your glutes.|Lower slowly without resting at the bottom."],
  "rotary-torso":["Aufrecht setzen, Beine fixieren, Arme ans Polster legen.|Den Oberkörper langsam zur Seite drehen, das Becken bleibt ruhig.|Kontrolliert zurück, nach dem Satz die Seite wechseln.","Sit tall, lock your legs, place your arms on the pad.|Rotate your upper body slowly to the side, hips stay still.|Return under control, switch sides after the set."],
  "back-extension-machine":["Hinsetzen, das Polster liegt am oberen Rücken, Füße fest.|Aus der Hüfte aufrichten, bis der Oberkörper aufrecht ist.|Langsam wieder nach vorn beugen.","Sit down with the pad on your upper back, feet planted.|Extend from your hips until your upper body is upright.|Lean forward again slowly."],
  "triceps-extension-machine":["Hinsetzen, die Oberarme auf das Polster legen, Griffe fassen.|Die Arme nach vorn unten strecken.|Langsam beugen, die Oberarme bleiben liegen.","Sit down, rest your upper arms on the pad, hold the handles.|Extend your arms forward and down.|Bend slowly, upper arms stay on the pad."],
  "lateral-raise-machine":["Hinsetzen, die Polster liegen außen an den Oberarmen.|Die Arme seitlich bis Schulterhöhe heben.|Langsam senken.","Sit down with the pads on the outside of your upper arms.|Raise your arms to the side up to shoulder height.|Lower slowly."],
  "smith-bench-press":["Auf die Bank unter die Multipresse legen, die Stange über der unteren Brust.|Stange aus der Sicherung drehen, zur Brust senken.|Kraftvoll hochdrücken, am Ende wieder einhaken.","Lie on the bench under the Smith machine, bar above your lower chest.|Unhook the bar and lower it to your chest.|Press up powerfully, hook it back in at the end."],
  "assisted-dip":["Gegengewicht einstellen, auf das Kniepolster knien, Griffe fassen.|Absenken, bis die Oberarme etwa waagerecht sind.|Hochdrücken, bis die Arme gestreckt sind.","Set the counterweight, kneel on the pad, hold the handles.|Lower until your upper arms are about horizontal.|Press up until your arms are straight."],
  "high-row-machine":["Sitz so einstellen, dass die Griffe vorn über Kopfhöhe sind, Brust ans Polster.|Griffe nach unten hinten ziehen, bis die Hände neben der Brust sind.|Langsam zurück, die Arme strecken.","Set the seat so the handles are in front above head height, chest on the pad.|Pull the handles down and back until your hands are beside your chest.|Return slowly, straighten your arms."],
  "cable-crunch":["Vor dem Kabelturm knien, das Seil oben einhängen und an die Stirn halten.|Den Oberkörper aus dem Bauch nach vorn unten einrollen, Hüfte bleibt stehen.|Langsam wieder aufrichten.","Kneel in front of the cable tower, hook the rope up high and hold it at your forehead.|Curl your upper body forward and down from your abs, hips stay put.|Rise back up slowly."],
  "cable-pull-through":["Seil unten einhängen, mit dem Rücken zum Turm stellen, das Seil zwischen den Beinen fassen.|Aus der Hüfte nach vorn beugen, Knie leicht gebeugt, Rücken gerade.|Hüfte nach vorn schieben und oben das Gesäß anspannen.","Hook the rope low, stand with your back to the tower, hold the rope between your legs.|Hinge forward at the hips, knees slightly bent, back straight.|Drive your hips forward and squeeze your glutes at the top."],
  "cable-lateral-raise":["Seitlich zum Kabelzug stellen, den unteren Griff mit der entfernten Hand fassen.|Den Arm leicht gebeugt seitlich bis Schulterhöhe heben.|Langsam senken, nach dem Satz die Seite wechseln.","Stand side-on to the cable, hold the low handle with the far hand.|Raise the slightly bent arm to the side up to shoulder height.|Lower slowly, switch sides after the set."],
  "rung-pull-ups":["Unter die Hangelleiter stellen und mit je einer Hand zwei hintereinanderliegende Sprossen greifen, Handflächen zueinander.|Schulterblätter nach unten ziehen und den Kopf zwischen den Sprossen hochziehen, bis das Kinn über den Sprossen ist.|Kontrolliert in den gestreckten Hang absenken.","Stand under the monkey bars and grip two rungs one behind the other, one hand each, palms facing.|Pull your shoulder blades down and pull your head up between the rungs until your chin clears them.|Lower with control to a full hang."],
  "hack-squat":["Rücken ans Polster, Schultern unter die Polster, Füße schulterbreit auf der Platte.|Sicherung lösen und kontrolliert in die Hocke gehen, bis die Oberschenkel etwa waagerecht sind.|Über die ganze Fußsohle hochdrücken.", "Back on the pad, shoulders under the pads, feet shoulder-width on the plate.|Release the safety and squat down with control until your thighs are about horizontal.|Drive up through your whole foot."],
  "smith-squat":["Unter die Stange stellen, Stange auf den oberen Rücken, Füße etwas nach vorn.|Stange aus den Haken drehen und in die Hocke gehen.|Hochdrücken und am Ende wieder einhaken.", "Step under the bar, rest it on your upper back, feet slightly forward.|Unhook the bar and squat down.|Drive up and hook it back at the end."],
  "leg-press-single":["Wie an der Beinpresse hinsetzen, einen Fuß mittig auf die Platte, der andere ruht.|Mit einem Bein kontrolliert beugen.|Wegdrücken, Seite nach dem Satz wechseln.", "Sit as at the leg press, one foot in the middle of the plate, the other resting.|Bend with one leg under control.|Press away, switch sides after the set."],
  "hip-thrust":["Obere Rücken an die Bank, Stange oder Polster über der Hüfte, Füße hüftbreit.|Hüfte nach oben drücken, bis Knie, Hüfte und Schultern eine Linie bilden.|Oben kurz halten und langsam senken.", "Upper back on the bench, bar or pad over your hips, feet hip-width.|Drive your hips up until knees, hips and shoulders form a line.|Pause at the top and lower slowly."],
  "glute-kickback-cable":["Manschette am Fuß, vor den unteren Kabelzug stellen und am Rahmen festhalten.|Das Bein gestreckt nach hinten oben führen.|Langsam zurück, Seite wechseln.", "Strap on the ankle cuff, face the low pulley and hold the frame.|Move your straight leg back and up.|Return slowly, switch sides."],
  "seated-calf":["Hinsetzen, Polster auf die Oberschenkel knapp über den Knien, Fußballen auf die Stufe.|Fersen langsam absenken.|Auf die Zehenspitzen hochdrücken und kurz halten.", "Sit with the pad on your thighs just above the knees, balls of your feet on the step.|Lower your heels slowly.|Rise onto your toes and hold briefly."],
  "incline-chest-press":["Sitz so einstellen, dass die Griffe auf Höhe der oberen Brust sind.|Schräg nach oben drücken, bis die Arme fast gestreckt sind.|Langsam zurück.", "Set the seat so the handles are at upper-chest height.|Press up and forward until your arms are almost straight.|Return slowly."],
  "cable-crossover":["Zwischen die oberen Kabelzüge stellen, je einen Griff greifen, ein Schritt nach vorn.|Arme leicht gebeugt im Bogen vor dem Körper nach unten zusammenführen.|Langsam zurück, bis die Brust gedehnt ist.", "Stand between the high pulleys, one handle in each hand, step forward.|Bring your slightly bent arms together in an arc in front of your body.|Return slowly until your chest is stretched."],
  "incline-db-press":["Bank auf etwa 30° stellen, Kurzhanteln auf Brusthöhe.|Nach oben drücken, bis die Arme fast gestreckt sind.|Langsam zur oberen Brust senken.", "Set the bench to about 30°, dumbbells at chest height.|Press up until your arms are almost straight.|Lower slowly to your upper chest."],
  "db-fly":["Auf die Bank legen, Kurzhanteln über der Brust, Handflächen zueinander.|Arme leicht gebeugt im Bogen seitlich senken.|Im gleichen Bogen wieder zusammenführen.", "Lie on the bench, dumbbells over your chest, palms facing.|Lower your slightly bent arms out to the sides in an arc.|Bring them back together along the same arc."],
  "assisted-pullup":["Gegengewicht wählen, auf das Polster knien, Griffe etwas breiter als schulterbreit.|Brust zur Stange ziehen, Ellbogen nach unten.|Kontrolliert strecken.", "Pick the counterweight, kneel on the pad, grip a bit wider than shoulder-width.|Pull your chest towards the bar, elbows down.|Lower with control."],
  "close-grip-pulldown":["Mit engem Griff (V-Griff oder eng an der Stange) hinsetzen.|Griff zur Brust ziehen, Ellbogen am Körper vorbei nach unten.|Langsam hoch, bis die Arme gestreckt sind.", "Sit with a narrow grip (V-handle or close on the bar).|Pull to your chest, elbows down past your sides.|Let it up slowly until your arms are straight."],
  "t-bar-row":["Über die Stange stellen, aus der Hüfte vorbeugen, Rücken gerade.|Griff zur unteren Brust ziehen, Schulterblätter zusammen.|Langsam senken.", "Straddle the bar, hinge at the hips, flat back.|Pull the handle to your lower chest, squeeze your shoulder blades.|Lower slowly."],
  "barbell-row":["Langhantel schulterbreit greifen, aus der Hüfte etwa 45° vorbeugen.|Stange zum Bauchnabel ziehen, Ellbogen nah am Körper.|Kontrolliert senken.", "Grip the barbell shoulder-width, hinge to about 45°.|Pull the bar to your belly button, elbows close.|Lower with control."],
  "face-pull":["Seil am oberen Kabelzug auf Kopfhöhe, mit beiden Händen greifen.|Seil zur Stirn ziehen, Ellbogen hoch und nach außen, Hände auseinander.|Langsam strecken.", "Rope on the pulley at head height, grip with both hands.|Pull towards your forehead, elbows high and wide, hands apart.|Extend slowly."],
  "straight-arm-pulldown":["Vor den oberen Kabelzug stellen, Stange oder Seil mit fast gestreckten Armen.|Die Arme im Bogen nach unten zu den Oberschenkeln ziehen.|Langsam wieder nach oben.", "Face the high pulley, bar or rope with almost straight arms.|Pull your arms down in an arc to your thighs.|Let them rise slowly."],
  "lateral-raise":["Aufrecht stehen, Kurzhanteln seitlich (oder an der Maschine sitzen).|Arme leicht gebeugt seitlich bis auf Schulterhöhe heben.|Langsam senken.", "Stand tall, dumbbells at your sides (or sit at the machine).|Raise your slightly bent arms out to shoulder height.|Lower slowly."],
  "shrugs":["Aufrecht stehen, Kurzhanteln oder Langhantel mit gestreckten Armen.|Schultern gerade Richtung Ohren ziehen.|Oben kurz halten, langsam senken.", "Stand tall, dumbbells or barbell with straight arms.|Pull your shoulders straight up towards your ears.|Hold briefly, lower slowly."],
  "hammer-curl":["Aufrecht stehen, Kurzhanteln im Hammergriff (Daumen nach vorn).|Unterarme zu den Schultern beugen.|Langsam senken.", "Stand tall, dumbbells in a hammer grip (thumbs forward).|Curl your forearms towards your shoulders.|Lower slowly."],
  "barbell-curl":["Stange schulterbreit im Untergriff, Arme gestreckt.|Stange zu den Schultern beugen.|Langsam wieder strecken.", "Hold the bar shoulder-width with an underhand grip, arms straight.|Curl it towards your shoulders.|Lower slowly."],
  "overhead-cable-triceps":["Mit dem Rücken zum Kabelzug, Seil über dem Kopf, Schrittstellung.|Unterarme nach vorn oben strecken.|Langsam zurück hinter den Kopf.", "Back to the pulley, rope over your head, split stance.|Extend your forearms forward and up.|Return slowly behind your head."],
  "triceps-machine":["Hinsetzen, Griffe seitlich neben dem Körper greifen.|Griffe nach unten drücken, bis die Arme gestreckt sind.|Langsam zurück.", "Sit down and grip the handles at your sides.|Press down until your arms are straight.|Return slowly."],
  "cable-woodchop":["Seitlich zum oberen Kabelzug stellen, Griff mit beiden Händen.|Diagonal nach unten zur anderen Seite ziehen, der Oberkörper dreht mit.|Langsam zurück, Seite wechseln.", "Stand side-on to the high pulley, handle in both hands.|Pull diagonally down across your body, rotating your torso.|Return slowly, switch sides."],
  "captains-chair":["Unterarme auf die Polster, Rücken an die Lehne, Beine hängen.|Knie zur Brust ziehen, das Becken rollt leicht ein.|Langsam senken, ohne zu schwingen.", "Forearms on the pads, back against the pad, legs hanging.|Pull your knees to your chest, pelvis curls slightly.|Lower slowly without swinging."],
  "barbell-overhead-press":["Stange auf Schulterhöhe, Griff etwas breiter als schulterbreit, Rumpf fest.|Senkrecht über den Kopf drücken, der Kopf geht am Ende leicht nach vorn.|Kontrolliert zurück auf die Schultern.", "Bar at shoulder height, grip slightly wider than shoulder-width, core braced.|Press straight overhead, head moves slightly through at the top.|Lower with control to your shoulders."],
  "barbell-rdl":["Aufrecht mit der Langhantel vor den Oberschenkeln, Knie leicht gebeugt.|Hüfte nach hinten schieben, Stange am Bein entlang bis unter die Knie.|Über die Hüfte aufrichten, Gesäß anspannen.", "Stand tall with the barbell in front of your thighs, knees soft.|Push your hips back, slide the bar down your legs to below your knees.|Rise by driving your hips forward, squeeze your glutes."],
  "leg-press":["Hinsetzen, Rücken ans Polster, Füße hüftbreit mittig auf die Platte.|Sicherung lösen und die Knie kontrolliert Richtung Brust beugen, bis etwa 90°.|Über die ganze Fußsohle wegdrücken, oben die Knie nicht ganz durchstrecken.", "Sit with your back on the pad, feet hip-width in the middle of the plate.|Release the safety and bend your knees towards your chest to about 90°.|Press through your whole foot; don't fully lock your knees at the top."],
  "leg-press-45":["In den Schlitten legen, Rücken und Po fest am Polster, Füße schulterbreit auf der Platte.|Sicherung lösen und den Schlitten langsam absenken, bis die Knie etwa 90° gebeugt sind.|Kraftvoll hochdrücken, oben die Knie leicht gebeugt lassen und wieder sichern.", "Lie in the sled, back and hips on the pad, feet shoulder-width on the plate.|Release the safety and lower the sled slowly until your knees are about 90°.|Press up powerfully, keep your knees soft at the top and lock the safety again."],
  "leg-extension":["Sitz so einstellen, dass die Knie auf der Drehachse liegen, Polster vorn über den Knöcheln.|Beine gleichmäßig strecken, oben kurz halten.|Langsam zurück, das Gewicht nicht absetzen.", "Adjust the seat so your knees line up with the pivot, pad in front of your ankles.|Straighten your legs evenly and pause at the top.|Lower slowly without letting the weight rest."],
  "leg-curl":["Hinsetzen, Knie auf der Drehachse, Beinpolster hinten über den Fersen, Oberschenkelpolster fest.|Fersen unter den Sitz ziehen, so weit es geht.|Langsam zurück in die Streckung.", "Sit with your knees on the pivot, lower pad behind your heels, thigh pad tight.|Pull your heels under the seat as far as you can.|Return slowly to the start."],
  "adductor-machine":["Hinsetzen, Beine gespreizt gegen die Innenpolster, Rücken ans Polster.|Beine kontrolliert zusammendrücken.|Langsam wieder öffnen, nur so weit, wie es angenehm dehnt.", "Sit with your legs spread against the inner pads, back on the pad.|Squeeze your legs together with control.|Open slowly, only as far as feels like a comfortable stretch."],
  "abductor-machine":["Hinsetzen, Beine geschlossen, Außenpolster an den Knien.|Beine gegen den Widerstand nach außen drücken.|Langsam wieder schließen, ohne abzusetzen.", "Sit with your legs together, outer pads at your knees.|Push your legs outwards against the resistance.|Close slowly without letting the weight rest."],
  "calf-machine":["Schulterpolster auflegen, Fußballen auf die Kante, Fersen frei.|Fersen langsam unter die Kante senken.|Auf die Zehenspitzen hochdrücken und oben kurz halten.", "Get under the shoulder pads, balls of your feet on the edge, heels free.|Lower your heels slowly below the edge.|Rise onto your toes and pause at the top."],
  "chest-press-machine":["Sitz so einstellen, dass die Griffe auf Brusthöhe sind, Rücken ans Polster.|Griffe nach vorn drücken, bis die Arme fast gestreckt sind.|Langsam zurück, bis die Hände neben der Brust sind.", "Set the seat so the handles are at chest height, back on the pad.|Press the handles forward until your arms are almost straight.|Return slowly until your hands are next to your chest."],
  "butterfly":["Hinsetzen, Rücken ans Polster, Unterarme oder Hände an die Polster, Ellbogen etwa auf Schulterhöhe.|Arme vor der Brust zusammenführen.|Langsam öffnen, bis die Brust angenehm gedehnt ist.", "Sit with your back on the pad, forearms or hands on the pads, elbows about shoulder height.|Bring your arms together in front of your chest.|Open slowly until you feel a comfortable stretch in your chest."],
  "pullover":["Mit dem Rücken auf die Bank, eine Kurzhantel mit beiden Händen über der Brust.|Die fast gestreckten Arme langsam hinter den Kopf senken.|Über den Kopf zurück bis über die Brust ziehen.", "Lie on the bench, one dumbbell held with both hands over your chest.|Lower your almost straight arms slowly behind your head.|Pull back over your head until above your chest."],
  "lat-pulldown":["Hinsetzen, Knie unter das Polster, Stange etwas breiter als schulterbreit greifen.|Brust raus und die Stange zur oberen Brust ziehen, Ellbogen nach unten.|Kontrolliert nach oben lassen, bis die Arme gestreckt sind.", "Sit with your knees under the pad, grip the bar a bit wider than shoulder-width.|Chest up, pull the bar to your upper chest, elbows down.|Let it rise with control until your arms are straight."],
  "row-machine":["Hinsetzen, Brust ans Polster, Griffe mit gestreckten Armen fassen.|Griffe zum Körper ziehen, Schulterblätter zusammen, Ellbogen nach hinten.|Langsam nach vorn zurück.", "Sit with your chest on the pad and hold the handles with straight arms.|Pull the handles to your body, squeeze your shoulder blades, elbows back.|Return forward slowly."],
  "cable-row":["Hinsetzen, Füße an die Platte, Knie leicht gebeugt, Griff mit gestreckten Armen.|Oberkörper aufrecht, Griff zum Bauchnabel ziehen, Schulterblätter zusammen.|Arme langsam wieder strecken, ohne nach vorn zu kippen.", "Sit with your feet on the plate, knees soft, handle held with straight arms.|Sit tall and pull the handle to your belly button, squeeze your shoulder blades.|Straighten your arms slowly without tipping forward."],
  "reverse-butterfly":["Mit der Brust zum Polster setzen, Griffe auf Schulterhöhe vor dir greifen.|Arme leicht gebeugt nach hinten öffnen, Schulterblätter zusammen.|Langsam wieder nach vorn führen.", "Sit facing the pad, grip the handles in front of you at shoulder height.|Open your slightly bent arms backwards, squeeze your shoulder blades.|Bring them forward again slowly."],
  "back-extension":["Hüfte ans Polster, Fersen unter die Rolle, Arme vor der Brust verschränkt.|Oberkörper mit geradem Rücken nach unten sinken lassen.|Wieder aufrichten, bis Körper und Beine eine Linie bilden.", "Hips on the pad, heels under the roller, arms crossed over your chest.|Lower your torso with a straight back.|Rise until your body and legs form a straight line."],
  "shoulder-press-machine":["Sitz so einstellen, dass die Griffe auf Schulterhöhe sind, Rücken ans Polster.|Griffe nach oben drücken, bis die Arme fast gestreckt sind.|Langsam zurück auf Schulterhöhe.", "Set the seat so the handles are at shoulder height, back on the pad.|Press up until your arms are almost straight.|Lower slowly back to shoulder height."],
  "biceps-machine":["Sitz so einstellen, dass die Oberarme ganz auf dem Polster liegen, Achseln an der Kante.|Griffe zu den Schultern beugen.|Langsam wieder strecken, ohne die Arme ganz durchzudrücken.", "Adjust the seat so your upper arms lie fully on the pad, armpits at the edge.|Curl the handles towards your shoulders.|Lower slowly without fully locking your arms."],
  "cable-curl":["Vor den unteren Kabelzug stellen, Griff im Untergriff, Arme gestreckt.|Unterarme beugen und den Griff zu den Schultern ziehen, Ellbogen bleiben am Körper.|Langsam wieder strecken.", "Stand facing the low pulley, underhand grip, arms straight.|Curl the handle to your shoulders, elbows stay at your sides.|Lower slowly."],
  "triceps-pushdown":["Vor den oberen Kabelzug stellen, Griff oder Seil fassen, Oberarme am Körper.|Unterarme nach unten strecken, bis die Arme gestreckt sind.|Langsam zurück, bis die Unterarme etwa waagerecht sind.", "Stand at the high pulley, hold the bar or rope, upper arms at your sides.|Push your forearms down until your arms are straight.|Return slowly until your forearms are about horizontal."],
  "skull-crusher":["Mit dem Rücken auf die Bank, SZ-Stange oder Kurzhanteln mit gestreckten Armen über der Brust.|Nur die Ellbogen beugen und das Gewicht langsam hinter die Stirn bzw. den Kopf senken.|Über den Trizeps wieder nach oben strecken.", "Lie on the bench, EZ bar or dumbbells held with straight arms over your chest.|Bend only your elbows and lower the weight slowly behind your forehead or head.|Extend back up with your triceps."],
  "ab-crunch-machine":["Hinsetzen, Füße fixieren, Griffe oder Polster an Schultern bzw. Brust.|Oberkörper aus dem Bauch nach vorn unten einrollen.|Langsam aufrichten, ohne das Gewicht abzusetzen.", "Sit down, fix your feet, hold the handles or pads at your shoulders or chest.|Curl your torso forward and down with your abs.|Rise slowly without letting the weight rest."],
  "bench-press":["Auf die Bank legen, Augen unter der Stange, Füße fest am Boden, Griff etwas breiter als schulterbreit.|Stange aus der Ablage heben und kontrolliert zur unteren Brust senken.|Nach oben drücken, bis die Arme gestreckt sind – am besten mit Sicherung oder Partner.", "Lie on the bench, eyes under the bar, feet planted, grip a bit wider than shoulder-width.|Unrack the bar and lower it with control to your lower chest.|Press up until your arms are straight – ideally with safeties or a spotter."],
  "barbell-squat":["Stange auf den oberen Rücken legen, aus der Ablage heben, schulterbreit stehen.|Hüfte nach hinten unten, Knie in Fußrichtung, Brust aufrecht, bis mindestens parallel.|Über die ganze Fußsohle hochdrücken.", "Rest the bar on your upper back, unrack it and stand shoulder-width.|Sit your hips back and down, knees over your toes, chest up, to at least parallel.|Drive up through your whole foot."],
  "barbell-deadlift":["Füße hüftbreit unter der Stange, Stange über der Fußmitte, schulterbreit greifen.|Rücken gerade, Brust raus, Stange nah am Bein hochziehen, bis du aufrecht stehst.|Kontrolliert über die Hüfte wieder absetzen.", "Feet hip-width under the bar, bar over mid-foot, grip shoulder-width.|Flat back, chest up, pull the bar up close to your legs until you stand tall.|Lower with control by hinging at your hips."],
  "jump-lunges":["In den Ausfallschritt gehen, beide Knie etwa 90°, Oberkörper aufrecht.|Explosiv nach oben springen und in der Luft die Beine wechseln.|Weich im Ausfallschritt mit dem anderen Bein vorn landen und direkt weiterspringen.","Drop into a lunge, both knees about 90°, torso upright.|Jump explosively and switch legs in the air.|Land softly in a lunge with the other leg in front and go straight into the next jump."],
  "burpees":["Aus dem Stand in die Hocke gehen und die Hände vor den Füßen aufsetzen.|Beine nach hinten in den Liegestütz springen, Körper gerade halten, und einen Liegestütz machen.|Füße zurück zu den Händen springen und aus der Hocke hochspringen, Arme nach oben.","From standing, squat down and place your hands in front of your feet.|Jump your feet back into a plank, keep your body straight and do a push-up.|Jump your feet back to your hands and jump up, arms overhead."],
  "jump-squats":["Hüftbreit stehen, in die Kniebeuge gehen, Arme hinten.|Explosiv nach oben springen und die Arme mitschwingen.|Weich über die Fußballen landen und direkt in die nächste Kniebeuge abfedern.","Stand hip-width apart and squat down with your arms back.|Jump up explosively, swinging your arms.|Land softly on the balls of your feet and sink straight into the next squat."],
  "mountain-climbers":["Hoher Liegestütz, Hände unter den Schultern.|Abwechselnd ein Knie zügig Richtung Brust ziehen.|Hüfte tief und ruhig halten, nicht mit dem Po nach oben gehen.","High plank, hands under your shoulders.|Drive one knee towards your chest, alternating quickly.|Keep your hips low and steady, don't pike up."],
  "high-knees":["Aufrecht stehen, Rumpf fest.|Auf der Stelle laufen und die Knie bis auf Hüfthöhe ziehen.|Arme wie beim Sprinten gegengleich mitnehmen, auf den Fußballen bleiben.","Stand tall and brace your core.|Run in place, lifting your knees to hip height.|Pump your arms like a sprinter and stay on the balls of your feet."],
  "jumping-jacks":["Aufrecht stehen, Füße zusammen, Arme am Körper.|Mit einem Sprung die Beine grätschen und die Arme über den Kopf führen.|Zurück in die Ausgangsposition springen, locker und rhythmisch bleiben.","Stand tall, feet together, arms at your sides.|Jump your feet out wide and raise your arms overhead.|Jump back to the start, staying light and rhythmic."],
  "skater-jumps":["Auf einem Bein stehen, Knie leicht gebeugt, das andere Bein hinten gekreuzt.|Seitlich auf das andere Bein springen, wie ein Eisschnellläufer.|Weich landen, kurz stabilisieren und zurückspringen.","Stand on one leg, knee slightly bent, other leg crossed behind.|Leap sideways onto the other leg like a speed skater.|Land softly, stabilise briefly and leap back."],
  "plank-burpees":["In die Hocke gehen und die Hände vor den Füßen aufsetzen.|Beine nach hinten in den Liegestütz springen oder steigen.|Zurück in die Hocke und aufrichten, ohne Liegestütz und ohne Sprung.","Squat down and place your hands in front of your feet.|Jump or step your feet back into a plank.|Return to the squat and stand up, no push-up and no jump."],
  "jump-forward-squats":["Hüftbreit stehen, in die Kniebeuge gehen und die Arme nach hinten nehmen.|Mit kräftigem Armschwung schräg nach vorn oben abspringen, so weit es geht.|Weich in der Hocke landen, kurz stabilisieren, aufrichten und zurück an den Start gehen.","Stand hip-width apart, squat down and swing your arms back.|Drive your arms forward and jump up and out as far as you can.|Land softly in a squat, stabilise, stand up and walk back to the start."],
  "jump-forward-burpees":["Wie ein Burpee: Hocke, Hände aufsetzen, Beine in den Liegestütz, ein Liegestütz.|Füße zurück zu den Händen springen und die Arme nach hinten nehmen.|Weit nach vorn springen, weich in der Hocke landen - von dort geht es direkt mit dem nächsten Burpee weiter.","Like a burpee: squat, hands down, feet back into a plank, one push-up.|Jump your feet back to your hands and swing your arms back.|Jump far forward and land softly in a squat - go straight into the next burpee from there."],
  "burpee-squat-jumps":["Wie ein Burpee: Hocke, Hände aufsetzen, Beine in den Liegestütz, ein Liegestütz.|Füße zurück zu den Händen springen.|Aus der tiefen Hocke explosiv in einen Strecksprung, weich landen.","Like a burpee: squat, hands down, feet back into a plank, one push-up.|Jump your feet back to your hands.|Explode from the deep squat into a jump and land softly."],
  "frogs":["Tiefe Hocke, Füße etwas breiter als hüftbreit, Hände am Boden.|Explosiv nach oben springen und den Körper ganz strecken.|Kontrolliert zurück in die tiefe Hocke landen, Hände wieder zum Boden.","Deep squat, feet a bit wider than hips, hands on the floor.|Jump up explosively and fully extend your body.|Land with control back into the deep squat, hands to the floor."],
  "stand-up-jumps":["Auf dem Rücken liegen, Knie angewinkelt.|Möglichst zügig aufstehen, am besten ohne die Hände.|Oben in einen Strecksprung übergehen und sich kontrolliert wieder hinlegen.","Lie on your back with your knees bent.|Get up as quickly as you can, ideally without using your hands.|Finish with a jump, then lie back down with control."],
  "lateral-hops":["Füße zusammen, Knie leicht gebeugt.|Mit kleinen, schnellen Sprüngen seitlich hin und her hüpfen.|Oberkörper ruhig halten, leise über die Fußballen landen.","Feet together, knees slightly bent.|Hop side to side with small, quick jumps.|Keep your upper body still and land quietly on the balls of your feet."],
  "fast-feet":["Leicht in die Knie gehen, Oberkörper etwas nach vorn.|Auf den Fußballen so schnell wie möglich trippeln.|Füße nur knapp vom Boden lösen, Arme locker mitnehmen.","Bend your knees slightly and lean forward a little.|Patter your feet as fast as you can on the balls of your feet.|Barely lift your feet and keep your arms relaxed."],
  "box-step-ups":["Vor eine stabile Stufe oder Box stellen.|Mit einem Fuß aufsetzen und über dieses Bein ganz hochsteigen.|Kontrolliert zurücksteigen und das Führungsbein zügig abwechseln.","Stand in front of a stable step or box.|Place one foot on it and drive up until you stand tall.|Step back down with control and alternate the lead leg quickly."],
  "sprint-in-place":["Leicht nach vorn lehnen, auf die Fußballen.|So schnell wie möglich auf der Stelle sprinten.|Arme kräftig mitnehmen, nur so schnell, wie du es sauber halten kannst.","Lean forward slightly, up on the balls of your feet.|Sprint in place as fast as you can.|Drive your arms hard, only as fast as you can keep it clean."],

  "goblet-squat":["Kettlebell oder Hantel senkrecht vor der Brust halten.|Hüfte nach hinten unten, Knie zeigen in Fußrichtung, Oberkörper aufrecht.|Mindestens bis zur Parallelen gehen und über die Fersen hochdrücken.","Hold a kettlebell or dumbbell upright at your chest.|Sit your hips back and down, knees over your toes, chest up.|Go at least to parallel and drive up through your heels."],
  "kb-swing":["Füße etwas breiter als hüftbreit, Kettlebell vor dir am Boden.|Glocke zwischen den Beinen nach hinten schwingen, Rücken gerade, Hüfte nach hinten.|Hüfte explosiv nach vorn strecken, die Glocke fliegt bis Brusthöhe, Arme bleiben locker.","Feet a bit wider than your hips, kettlebell on the floor in front.|Hike the bell back between your legs, flat back, hips back.|Snap your hips forward so the bell floats to chest height, arms relaxed."],
  "db-thruster":["Hanteln auf Schulterhöhe halten, Füße hüftbreit.|Tiefe Kniebeuge, Oberkörper aufrecht.|Kraftvoll hochdrücken und die Hanteln in einer Bewegung über den Kopf strecken.","Hold the dumbbells at shoulder height, feet hip-width.|Squat down deep, chest up.|Drive up and press the dumbbells overhead in one movement."],
  "romanian-deadlift":["Aufrecht stehen, Hanteln vor den Oberschenkeln, Knie leicht gebeugt.|Hüfte nach hinten schieben, Hanteln am Bein entlang bis unter die Knie senken.|Rücken bleibt gerade, über die Hüfte wieder aufrichten und das Gesäß anspannen.","Stand tall, dumbbells in front of your thighs, knees soft.|Push your hips back and slide the weights down to below your knees.|Keep your back flat, drive your hips forward to stand up and squeeze your glutes."],
  "db-deadlift":["Hanteln neben oder vor den Füßen, hüftbreit stehen.|In die Knie gehen, Rücken gerade, Hanteln greifen.|Aus Beinen und Hüfte aufrichten, Hanteln dicht am Körper, kontrolliert wieder absetzen.","Dumbbells beside or in front of your feet, hip-width stance.|Bend your knees with a flat back and grip the weights.|Stand up with legs and hips, weights close to your body, then lower with control."],
  "bent-over-row":["Aus der Hüfte nach vorn beugen, Oberkörper etwa 45°, Rücken gerade.|Hanteln hängen unter den Schultern.|Ellbogen nah am Körper nach hinten ziehen, Schulterblätter zusammen, langsam senken.","Hinge at the hips, torso about 45°, back flat.|Let the dumbbells hang under your shoulders.|Pull your elbows back close to your body, squeeze your shoulder blades, lower slowly."],
  "one-arm-row":["Eine Hand und bei Bedarf ein Knie auf einer Bank abstützen, Rücken gerade.|Die Hantel hängt unter der Schulter.|Ellbogen nach hinten zur Hüfte ziehen, langsam senken, nach jedem Intervall die Seite wechseln.","Support one hand (and knee) on a bench, back flat.|Let the dumbbell hang under your shoulder.|Row your elbow back towards your hip, lower slowly, switch sides after each interval."],
  "floor-press":["Auf dem Rücken liegen, Knie angewinkelt, Hanteln über der Brust.|Hanteln senken, bis die Oberarme den Boden berühren.|Kurz ablegen, nicht abprallen lassen, und wieder nach oben drücken.","Lie on your back, knees bent, dumbbells over your chest.|Lower until your upper arms touch the floor.|Pause briefly, don't bounce, and press back up."],
  "shoulder-press":["Aufrecht stehen, Hanteln auf Schulterhöhe, Rumpf fest.|Hanteln senkrecht über den Kopf drücken, ohne ins Hohlkreuz zu gehen.|Kontrolliert zurück auf Schulterhöhe senken.","Stand tall, dumbbells at shoulder height, core braced.|Press straight overhead without arching your back.|Lower back to your shoulders with control."],
  "push-press":["Hanteln auf Schulterhöhe, Füße hüftbreit.|Kurz leicht in die Knie gehen.|Aus den Beinen Schwung holen, die Hanteln über den Kopf drücken und kontrolliert senken.","Dumbbells at shoulder height, feet hip-width.|Dip briefly by bending your knees slightly.|Drive with your legs, press the weights overhead and lower with control."],
  "weighted-reverse-lunge":["Hanteln seitlich halten, aufrecht stehen.|Mit einem Bein einen großen Schritt nach hinten, hinteres Knie fast bis zum Boden.|Über das vordere Bein zurück in den Stand, Beine abwechseln.","Hold the dumbbells at your sides and stand tall.|Step one leg far back and lower your back knee towards the floor.|Push through the front leg back to standing, alternate legs."],
  "front-rack-carry":["Kettlebells oder Hanteln vor den Schultern halten, Ellbogen vorn.|Aufrecht und mit festem Rumpf gehen.|Kleine, ruhige Schritte, nicht nach hinten lehnen.","Hold kettlebells or dumbbells at your shoulders, elbows forward.|Walk tall with a braced core.|Take small, steady steps and don't lean back."],
  "farmer-carry":["Schwere Hanteln oder Kettlebells seitlich greifen.|Schultern nach hinten unten, aufrecht stehen.|Ruhig und gleichmäßig gehen, ohne zur Seite zu kippen.","Pick up heavy dumbbells or kettlebells at your sides.|Shoulders back and down, stand tall.|Walk steadily without leaning to either side."],
  "kb-clean":["Kettlebell zwischen den Füßen, Hüftbeuge wie beim Swing.|Die Glocke mit Hüftschwung nach oben ziehen, Ellbogen nah am Körper.|Weich vor der Schulter auffangen, zurückführen, Seite nach jedem Intervall wechseln.","Kettlebell between your feet, hinge like a swing.|Drive with your hips and pull the bell up, elbow close.|Catch it softly at your shoulder, lower it, switch sides after each interval."],
  "renegade-row":["Liegestützposition auf zwei Hanteln, Füße breit.|Eine Hantel zur Hüfte ziehen, ohne die Hüfte zu drehen.|Absetzen und Seite wechseln, Rumpf die ganze Zeit fest.","Plank on two dumbbells, feet wide.|Row one dumbbell to your hip without twisting your hips.|Put it down and switch sides, core tight throughout."],

  "push-ups":["Hände etwas breiter als schulterbreit, Körper eine gerade Linie.|Brust kontrolliert bis knapp über den Boden senken, Ellbogen schräg nach hinten.|Kraftvoll hochdrücken, Hüfte nicht durchhängen lassen.","Hands slightly wider than your shoulders, body in a straight line.|Lower your chest to just above the floor, elbows angled back.|Push back up and don't let your hips sag."],
  "pike-push-ups":["Aus dem Liegestütz die Hüfte hochschieben, der Körper bildet ein umgedrehtes V.|Den Kopf zwischen den Händen Richtung Boden senken.|Über die Schultern wieder hochdrücken.","From a plank, push your hips up into an upside-down V.|Lower your head towards the floor between your hands.|Press back up through your shoulders."],
  "triceps-dips":["Hände hinter dir auf eine stabile Bank oder einen Stuhl, Finger nach vorn.|Beine angewinkelt oder gestreckt, Po nah an der Kante.|Ellbogen nach hinten beugen bis etwa 90°, dann wieder hochdrücken.","Hands behind you on a stable bench or chair, fingers forward.|Legs bent or straight, hips close to the edge.|Bend your elbows back to about 90°, then press back up."],
  "squat-hold":["Füße hüftbreit, in die Kniebeuge gehen.|Oberschenkel etwa parallel zum Boden, Oberkörper aufrecht.|Position halten und ruhig weiteratmen.","Feet hip-width, sit down into a squat.|Thighs about parallel to the floor, chest up.|Hold the position and keep breathing calmly."],
  "walking-lunges":["Aufrecht stehen, Hände an der Hüfte.|Großer Schritt nach vorn, beide Knie etwa 90°.|Über das vordere Bein hochdrücken und direkt mit dem anderen Bein weitergehen.","Stand tall, hands on your hips.|Take a big step forward, both knees at about 90°.|Push up through the front leg and step straight into the next lunge."],
  "reverse-lunges":["Aufrecht stehen, Hände an der Hüfte.|Mit einem Bein nach hinten treten, hinteres Knie Richtung Boden.|Über das vordere Bein zurück in den Stand, Beine abwechseln.","Stand tall, hands on your hips.|Step one leg back and lower your back knee towards the floor.|Push through the front leg back to standing, alternate legs."],
  "side-lunges":["Breiter Stand, Füße zeigen nach vorn.|Gewicht auf ein Bein verlagern, Hüfte nach hinten, das andere Bein bleibt gestreckt.|Zurück zur Mitte drücken und die Seite wechseln.","Wide stance, toes pointing forward.|Shift onto one leg, hips back, the other leg stays straight.|Push back to the middle and switch sides."],
  "cossack-squats":["Sehr breiter Stand.|Tief auf ein Bein absenken, das andere Bein gestreckt, Zehen zeigen nach oben.|Über die Mitte zur anderen Seite wechseln, die Ferse des Standbeins bleibt am Boden.","Very wide stance.|Sink deep onto one leg, the other leg straight with toes up.|Move through the middle to the other side, keep your working heel down."],
  "deep-squats":["Füße schulterbreit, Zehen leicht nach außen.|So tief wie schmerzfrei möglich in die Hocke, Fersen am Boden.|Unten kurz halten und kontrolliert wieder hochkommen.","Feet shoulder-width, toes slightly out.|Squat as deep as you can without pain, heels down.|Pause at the bottom and rise with control."],
  "pistol-assist":["Neben eine Stange, einen Türrahmen oder eine Wand stellen und festhalten.|Auf einem Bein stehen, das andere Bein nach vorn strecken.|Langsam auf dem Standbein tief absenken, wieder hochdrücken, Seite nach jedem Intervall wechseln.","Stand next to a pole, door frame or wall and hold on.|Stand on one leg and extend the other leg forward.|Lower slowly on the standing leg, push back up, switch sides after each interval."],
  "plank-steps":["Im Unterarmstütz beginnen.|Nacheinander auf die Hände hochdrücken in den hohen Stütz.|Wieder auf die Unterarme absetzen, die führende Hand abwechseln, Hüfte ruhig.","Start in a forearm plank.|Press up onto your hands one at a time into a high plank.|Lower back onto your forearms, alternate the leading arm, keep your hips still."],
  "bear-crawl":["Vierfüßlerstand, Knie knapp über dem Boden.|Gegengleich Hand und Fuß ein kleines Stück vorsetzen.|Rücken flach, Knie tief, vorwärts und rückwärts krabbeln.","On all fours with your knees hovering just above the floor.|Move the opposite hand and foot forward a little.|Keep your back flat and knees low, crawl forwards and backwards."],
  "wall-sit":["Mit dem Rücken an die Wand lehnen.|Nach unten rutschen, bis die Knie etwa 90° gebeugt sind.|Knie über den Füßen, Position halten.","Lean your back against a wall.|Slide down until your knees are bent to about 90°.|Knees over your ankles, hold the position."],
  "calf-raises":["Hüftbreit stehen, bei Bedarf an einer Wand festhalten.|Langsam auf die Zehenspitzen hochdrücken.|Oben kurz halten und kontrolliert absenken.","Stand hip-width, hold on to a wall if needed.|Rise slowly onto your toes.|Pause at the top and lower with control."],
  "glute-bridge":["Auf dem Rücken liegen, Knie angewinkelt, Füße hüftbreit.|Hüfte anheben, bis Knie, Hüfte und Schultern eine Linie bilden.|Gesäß oben anspannen und langsam wieder ablegen.","Lie on your back, knees bent, feet hip-width.|Lift your hips until knees, hips and shoulders form a line.|Squeeze your glutes at the top and lower slowly."],

  "pull-ups":["An der Stange hängen, Hände etwas breiter als schulterbreit.|Schulterblätter nach unten ziehen und das Kinn über die Stange ziehen.|Kontrolliert bis in den gestreckten Hang absenken.","Hang from the bar, hands slightly wider than your shoulders.|Pull your shoulder blades down and pull your chin over the bar.|Lower with control to a full hang."],
  "negative-pull-ups":["Mit Sprung oder Tritt in die obere Position, Kinn über der Stange.|Dort kurz halten.|So langsam wie möglich in den gestreckten Hang absenken.","Jump or step up to the top position, chin over the bar.|Hold there briefly.|Lower as slowly as you can to a full hang."],
  "inverted-rows":["Unter eine hüfthohe, sichere Stange legen und greifen.|Körper gerade, Fersen am Boden.|Brust zur Stange ziehen, Schulterblätter zusammen, langsam absenken.","Lie under a secure hip-height bar and grip it.|Body straight, heels on the floor.|Pull your chest to the bar, squeeze your shoulder blades, lower slowly."],
  "superman-hold":["Auf dem Bauch liegen, Arme nach vorn gestreckt.|Arme, Brust und Beine leicht vom Boden abheben.|Blick zum Boden, Position halten.","Lie on your stomach, arms extended forward.|Lift your arms, chest and legs slightly off the floor.|Look down and hold the position."],
  "reverse-snow-angels":["Auf dem Bauch liegen, Stirn knapp über dem Boden, Arme neben dem Körper.|Arme leicht abheben.|In einem großen Bogen über die Seite bis über den Kopf führen und zurück.","Lie face down, forehead just off the floor, arms by your sides.|Lift your arms slightly.|Sweep them in a wide arc out to the side and overhead, then back."],
  "bird-dog":["Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte.|Einen Arm und das gegenüberliegende Bein langsam strecken.|Kurz halten, zurückführen und die Seite wechseln, Hüfte bleibt gerade.","On all fours, hands under your shoulders, knees under your hips.|Slowly extend one arm and the opposite leg.|Hold briefly, return and switch sides, keep your hips level."],
  "prone-y-raise":["Auf dem Bauch liegen, Arme schräg nach vorn in Y-Form.|Daumen zeigen nach oben.|Arme über die Schulterblätter anheben, kurz halten und senken.","Lie face down, arms forward in a Y shape.|Thumbs point up.|Lift your arms by squeezing your shoulder blades, hold briefly, lower."],
  "prone-t-raise":["Auf dem Bauch liegen, Arme seitlich in T-Form.|Daumen zeigen nach oben.|Arme über die Schulterblätter anheben, kurz halten und senken.","Lie face down, arms out to the sides in a T shape.|Thumbs point up.|Lift your arms by squeezing your shoulder blades, hold briefly, lower."],
  "good-mornings":["Hüftbreit stehen, Hände hinter dem Kopf.|Mit geradem Rücken aus der Hüfte nach vorn beugen, Knie leicht gebeugt.|Bis etwa waagerecht beugen und über die Hüfte aufrichten.","Stand hip-width, hands behind your head.|Hinge forward from your hips with a flat back, knees soft.|Bend to about horizontal and stand back up through your hips."],
  "swimmers":["Auf dem Bauch liegen, Arme nach vorn gestreckt.|Arme und Beine leicht abheben.|Gegengleich Arm und Bein im Wechsel auf und ab bewegen, wie beim Kraulen.","Lie on your stomach, arms extended forward.|Lift your arms and legs slightly.|Flutter the opposite arm and leg up and down, like swimming crawl."],
  "cobra-lift":["Auf dem Bauch liegen, Hände neben der Brust.|Brust langsam anheben, die Hüfte bleibt am Boden.|Nur so weit, wie der untere Rücken entspannt bleibt, kurz halten und ruhig atmen, dann langsam senken.","Lie on your stomach, hands beside your chest.|Slowly lift your chest while your hips stay down.|Only go as high as your lower back stays relaxed, then lower slowly."],
  "scapular-push-ups":["Hoher Liegestütz, Arme gestreckt.|Schulterblätter zusammenziehen, die Brust sinkt leicht ab.|Schulterblätter auseinanderdrücken, die Arme bleiben die ganze Zeit gestreckt.","High plank, arms straight.|Squeeze your shoulder blades together so your chest sinks slightly.|Push them apart again, arms stay straight throughout."],
  "scapular-pull-ups":["An der Stange hängen, Arme gestreckt.|Nur die Schulterblätter nach unten ziehen, der Körper hebt sich ein Stück.|Langsam zurück in den Hang, die Arme bleiben gestreckt.","Hang from the bar, arms straight.|Pull only your shoulder blades down so your body rises a little.|Lower slowly back to the hang, arms stay straight."],
  "dead-hang":["Stange schulterbreit greifen.|Mit gestreckten Armen hängen, Füße vom Boden.|Schultern aktiv, ruhig atmen und die Position halten.","Grip the bar shoulder-width apart.|Hang with straight arms, feet off the floor.|Keep your shoulders active, breathe calmly and hold."],

  "air-squats":["Füße schulterbreit, Arme nach vorn.|Hüfte nach hinten unten, Knie in Fußrichtung, Oberkörper aufrecht.|Bis mindestens parallel gehen und über die Fersen hochdrücken.","Feet shoulder-width, arms forward.|Sit your hips back and down, knees over your toes, chest up.|Go to at least parallel and drive up through your heels."],
  "split-squats":["Schrittstellung, ein Fuß vorn, einer hinten.|Senkrecht nach unten gehen, bis das hintere Knie fast den Boden berührt.|Hochdrücken, die Füße bleiben stehen, Seite nach jedem Intervall wechseln.","Split stance, one foot forward, one back.|Lower straight down until your back knee nearly touches the floor.|Push up with your feet staying put, switch sides after each interval."],
  "bulgarian-split-squats":["Hinteren Fuß auf eine Bank legen, der vordere Fuß steht ein großes Stück davor.|Senkrecht nach unten gehen, vorderes Knie über dem Fuß.|Über das vordere Bein hochdrücken, Seite nach jedem Intervall wechseln.","Rest your back foot on a bench, front foot a big step ahead.|Lower straight down, front knee over your foot.|Drive up through the front leg, switch sides after each interval."],
  "forward-lunges":["Aufrecht stehen, Hände an der Hüfte.|Großer Schritt nach vorn, kontrolliert abbremsen, beide Knie etwa 90°.|Kräftig über das vordere Bein zurück in den Stand, Beine abwechseln.","Stand tall, hands on your hips.|Step far forward and brake with control, both knees at about 90°.|Push back through the front leg to standing, alternate legs."],
  "single-leg-glute-bridge":["Auf dem Rücken liegen, ein Knie angewinkelt, das andere Bein gestreckt.|Über die Ferse die Hüfte anheben, das Becken bleibt waagerecht.|Oben anspannen, langsam senken, Seite nach jedem Intervall wechseln.","Lie on your back, one knee bent, the other leg straight.|Drive through your heel to lift your hips, pelvis level.|Squeeze at the top, lower slowly, switch sides after each interval."],
  "lateral-lunge-pulses":["In den Seitausfallschritt gehen, ein Bein gebeugt, das andere gestreckt.|In der tiefen Position kleine, kontrollierte Auf-und-ab-Bewegungen machen.|Gewicht auf der Ferse, Seite nach jedem Intervall wechseln.","Step into a side lunge, one leg bent, the other straight.|Pulse up and down in small, controlled movements at the bottom.|Keep your weight on your heel, switch sides after each interval."],

  "plank":["Unterarme unter den Schultern, Beine gestreckt.|Der Körper bildet eine gerade Linie von Kopf bis Ferse.|Bauch und Gesäß anspannen, ruhig atmen, halten.","Forearms under your shoulders, legs straight.|Your body forms a straight line from head to heels.|Brace your abs and glutes, breathe calmly and hold."],
  "side-plank":["Seitlich auf einen Unterarm stützen, Ellbogen unter der Schulter.|Hüfte anheben, bis der Körper eine gerade Linie bildet.|Halten, Seite nach jedem Intervall wechseln.","Lie on your side and prop up on one forearm, elbow under your shoulder.|Lift your hips until your body forms a straight line.|Hold, switch sides after each interval."],
  "dead-bug":["Auf dem Rücken, Arme zur Decke, Knie über der Hüfte angewinkelt.|Gegengleich einen Arm nach hinten und ein Bein nach vorn strecken.|Unterer Rücken bleibt am Boden, zurückführen und Seite wechseln.","Lie on your back, arms to the ceiling, knees bent over your hips.|Extend one arm back and the opposite leg forward.|Keep your lower back down, return and switch sides."],
  "bicycle-crunches":["Rückenlage, Hände locker am Kopf, Schultern leicht angehoben.|Ein Knie zur Brust ziehen, das andere Bein strecken.|Den gegenüberliegenden Ellbogen zum Knie drehen und im Wechsel radeln.","Lie on your back, hands lightly at your head, shoulders lifted.|Pull one knee in while extending the other leg.|Rotate the opposite elbow towards the knee and pedal alternately."],
  "leg-raises":["Rückenlage, Beine gestreckt, Hände neben dem Körper.|Die gestreckten Beine bis senkrecht anheben.|Kontrolliert absenken, bei Bedarf mit gebeugten Knien.","Lie on your back, legs straight, hands by your sides.|Lift your straight legs to vertical.|Lower with control, bend your knees if needed."],
  "jackknives":["Rückenlage, Arme über dem Kopf, Beine gestreckt.|Gleichzeitig Oberkörper und Beine anheben und mit den Händen Richtung Füße greifen.|Kontrolliert zurück in die gestreckte Lage.","Lie on your back, arms overhead, legs straight.|Lift your torso and legs at the same time and reach for your feet.|Return with control to the stretched position."],
  "side-jackknives":["Auf der Seite liegen, die obere Hand am Kopf.|Oberkörper und gestreckte Beine gleichzeitig seitlich anheben.|Langsam absenken, Seite nach jedem Intervall wechseln.","Lie on your side, top hand at your head.|Lift your torso and straight legs sideways at the same time.|Lower slowly, switch sides after each interval."],
  "hollow-hold":["Rückenlage, den unteren Rücken fest in den Boden drücken.|Schultern und gestreckte Beine leicht anheben, Arme über den Kopf.|Den Körper wie eine Banane halten, leichter mit gebeugten Knien.","Lie on your back and press your lower back into the floor.|Lift your shoulders and straight legs slightly, arms overhead.|Hold a banana shape, easier with bent knees."],
  "russian-twists":["Sitzen, Oberkörper leicht zurückgelehnt, Füße am Boden oder angehoben.|Brustbein aufrecht, Hände vor dem Körper.|Den Oberkörper abwechselnd nach links und rechts drehen.","Sit and lean back slightly, feet on the floor or lifted.|Chest up, hands in front of you.|Rotate your torso from side to side."],
  "sit-ups":["Rückenlage, Knie angewinkelt, Füße am Boden.|Oberkörper kontrolliert bis zum Sitzen aufrollen.|Langsam Wirbel für Wirbel zurückrollen, ohne Schwung.","Lie on your back, knees bent, feet flat.|Roll your torso up to sitting with control.|Roll back down slowly, one vertebra at a time, no momentum."],
  "toe-touches":["Rückenlage, Beine senkrecht nach oben gestreckt.|Schultern anheben und mit den Händen Richtung Zehen greifen.|Langsam zurück, die Beine bleiben oben.","Lie on your back, legs straight up.|Lift your shoulders and reach for your toes.|Lower slowly, legs stay up."],
  "plank-shoulder-taps":["Hoher Liegestütz, Füße etwas breiter.|Mit einer Hand die gegenüberliegende Schulter antippen.|Hand zurück, Seite wechseln, das Becken nicht kippen lassen.","High plank, feet a little wider.|Tap the opposite shoulder with one hand.|Return the hand and switch, don't let your hips rock."],
  "toes-to-bar":["An einer sicheren Stange hängen, Arme gestreckt.|Die Füße bis zur Stange bringen (leichter: Knie zur Brust).|Kontrolliert senken, ohne zu schwingen.","Hang from a secure bar, arms straight.|Pull your knees to your chest or bring your feet to the bar.|Lower with control, without swinging."]
};

/* Haltung je Übung: [Haltung DE (a|b), Vermeiden DE, Haltung EN (a|b), Vermeiden EN]
   Grundlage: gängige Technikhinweise (u. a. ACE, NSCA, NASM): neutrale Wirbelsäule, Knie in Fußrichtung,
   Schultern weg von den Ohren, bei Bauchübungen den unteren Rücken am Boden halten. */
var EX_POSTURE = {
  "glute-machine":["Rücken gerade, Bauch fest.|Bewegung kommt aus der Hüfte.","Ins Hohlkreuz drücken, um weiter zu kommen.","Back straight, core tight.|Move from your hip.","Arching your lower back to go further."],
  "calf-press":["Knie leicht gebeugt, nicht durchdrücken.|Ganze Bewegung im Sprunggelenk.","Die Knie arbeiten mit oder die Füße rutschen.","Knees slightly bent, never locked.|All the movement at the ankle.","Bending the knees or letting the feet slip."],
  "lying-leg-curl":["Hüfte flach auf dem Polster.|Oben kurz halten.","Das Becken hebt sich, um Schwung zu holen.","Hips flat on the pad.|Pause briefly at the top.","Lifting your hips for momentum."],
  "rotary-torso":["Aufrecht, Becken fest.|Langsam und gleichmäßig drehen.","Mit Schwung herumreißen.","Sit tall, hips fixed.|Rotate slowly and evenly.","Swinging round with momentum."],
  "back-extension-machine":["Aus der Hüfte strecken, Blick nach vorn.|Oben aufrecht, nicht nach hinten überstrecken.","Ruckartig nach hinten schnellen.","Extend from the hips, look ahead.|Upright at the top, don't lean back.","Jerking backwards."],
  "triceps-extension-machine":["Oberarme bleiben auf dem Polster.|Unten kurz strecken.","Die Schultern ziehen mit.","Upper arms stay on the pad.|Fully extend briefly.","Shrugging your shoulders into it."],
  "lateral-raise-machine":["Schultern tief, Brust aufrecht.|Nur bis Schulterhöhe.","Mit den Schultern zum Ohr ziehen.","Shoulders down, chest up.|Only up to shoulder height.","Shrugging towards your ears."],
  "smith-bench-press":["Schulterblätter zusammen, Füße fest.|Stange kontrolliert zur Brust.","Die Stange auf der Brust abprallen lassen.","Shoulder blades together, feet planted.|Bar to your chest under control.","Bouncing the bar off your chest."],
  "assisted-dip":["Schultern tief, Oberkörper leicht nach vorn.|Ellbogen nach hinten.","Tiefer gehen als schmerzfrei möglich.","Shoulders down, torso slightly forward.|Elbows back.","Going deeper than is pain-free."],
  "high-row-machine":["Brust bleibt am Polster.|Unten die Schulterblätter zusammen.","Mit Schwung aus dem Oberkörper ziehen.","Chest stays on the pad.|Squeeze your shoulder blades at the bottom.","Pulling with momentum from your upper body."],
  "cable-crunch":["Hüfte bleibt über den Knien.|Ausatmen beim Einrollen.","Mit den Armen ziehen statt mit dem Bauch.","Hips stay over your knees.|Breathe out as you curl.","Pulling with your arms instead of your abs."],
  "cable-pull-through":["Rücken gerade, Bewegung aus der Hüfte.|Oben das Gesäß fest anspannen.","Aus den Armen ziehen oder ins Hohlkreuz gehen.","Flat back, move from your hips.|Squeeze your glutes hard at the top.","Pulling with your arms or arching your back."],
  "cable-lateral-raise":["Oberkörper ruhig, Arm leicht gebeugt.|Oben kurz halten.","Aus dem Oberkörper Schwung holen.","Upper body still, arm slightly bent.|Pause at the top.","Swinging with your upper body."],
  "rung-pull-ups":["Rumpf fest, Beine ruhig.|Ellbogen ziehen nach unten.","Mit Schwung aus den Beinen ziehen oder den Kopf gegen die Sprosse stoßen.","Core braced, legs still.|Drive your elbows down.","Kicking for momentum or bumping your head on a rung."],
  "hack-squat":["Rücken und Po am Polster.|Knie zeigen in Fußrichtung.", "Die Fersen abheben.", "Back and hips on the pad.|Knees track your toes.", "Lifting your heels."],
  "smith-squat":["Brust aufrecht, Rumpf fest.|Knie folgen den Zehen.", "Die Knie nach innen fallen lassen.", "Chest up, core braced.|Knees follow your toes.", "Letting your knees cave in."],
  "leg-press-single":["Becken bleibt gerade am Polster.|Knie zeigt in Fußrichtung.", "Mit dem Becken zur Seite kippen.", "Pelvis stays level on the pad.|Knee tracks your toes.", "Tilting your pelvis to one side."],
  "hip-thrust":["Kinn leicht zur Brust, Rippen unten.|Schienbeine oben etwa senkrecht.", "Oben ins Hohlkreuz überstrecken.", "Chin slightly tucked, ribs down.|Shins about vertical at the top.", "Overarching your lower back at the top."],
  "glute-kickback-cable":["Rumpf fest, Becken gerade.|Standbein leicht gebeugt.", "Mit dem Rücken ins Hohlkreuz schwingen.", "Core braced, pelvis level.|Standing knee soft.", "Swinging into an arched back."],
  "seated-calf":["Volle Bewegung.|Langsam, ohne Wippen.", "Nur kurz auf und ab wippen.", "Full range.|Slow, no bouncing.", "Just bouncing."],
  "incline-chest-press":["Schultern unten, Rücken am Polster.|Handgelenke gerade.", "Die Schultern hochziehen.", "Shoulders down, back on the pad.|Straight wrists.", "Shrugging your shoulders."],
  "cable-crossover":["Ellbogen fest leicht gebeugt.|Oberkörper leicht vorgeneigt, Rumpf fest.", "Mit den Armen drücken statt zu umarmen.", "Elbows fixed, slightly bent.|Lean slightly forward, core braced.", "Pressing instead of hugging."],
  "incline-db-press":["Schulterblätter zusammen, Füße fest.|Unterarme senkrecht.", "Die Hanteln zu tief und zu weit außen senken.", "Shoulder blades together, feet planted.|Vertical forearms.", "Lowering the dumbbells too deep and wide."],
  "db-fly":["Ellbogen bleiben gleich gebeugt.|Nur bis Schulterhöhe senken.", "Zu tief gehen und die Schulter überdehnen.", "Keep the elbow bend constant.|Lower only to shoulder height.", "Going too deep and overstretching your shoulders."],
  "assisted-pullup":["Schultern zuerst nach unten ziehen.|Rumpf fest.", "Mit halber Bewegung arbeiten.", "Pull your shoulders down first.|Core braced.", "Using only half the range."],
  "close-grip-pulldown":["Brust raus, leicht zurückgelehnt.|Schultern tief.", "Mit dem Oberkörper nach hinten reißen.", "Chest up, slight lean back.|Shoulders down.", "Yanking back with your torso."],
  "t-bar-row":["Rücken neutral, Knie leicht gebeugt.|Nacken lang.", "Mit Schwung aus dem Oberkörper ziehen.", "Neutral spine, knees soft.|Long neck.", "Heaving with your torso."],
  "barbell-row":["Rücken gerade und fest.|Oberkörper bleibt ruhig.", "Mit rundem Rücken ziehen.", "Flat, braced back.|Torso stays still.", "Pulling with a rounded back."],
  "face-pull":["Schultern tief, Brust raus.|Oben kurz halten.", "Mit dem Rücken nach hinten lehnen.", "Shoulders down, chest up.|Pause at the end.", "Leaning back with your whole body."],
  "straight-arm-pulldown":["Leicht vorgeneigt, Rumpf fest.|Ellbogen bleiben gestreckt.", "Die Arme beugen und drücken.", "Slight forward lean, core braced.|Elbows stay straight.", "Bending your arms and pushing."],
  "lateral-raise":["Schultern tief, Nacken locker.|Ellbogen führen.", "Mit Schwung hochreißen.", "Shoulders down, relaxed neck.|Lead with your elbows.", "Swinging the weights up."],
  "shrugs":["Arme bleiben gestreckt.|Kopf gerade.", "Mit den Schultern kreisen.", "Arms stay straight.|Head straight.", "Rolling your shoulders."],
  "hammer-curl":["Ellbogen bleiben am Körper.|Rumpf fest.", "Mit dem Rücken Schwung holen.", "Elbows stay at your sides.|Core braced.", "Using your back for momentum."],
  "barbell-curl":["Ellbogen am Körper.|Aufrecht, Rumpf fest.", "Ins Hohlkreuz lehnen.", "Elbows at your sides.|Stand tall, core braced.", "Leaning back into an arch."],
  "overhead-cable-triceps":["Oberarme bleiben neben dem Kopf.|Rumpf fest.", "Die Ellbogen weit öffnen.", "Upper arms stay by your head.|Core braced.", "Flaring your elbows wide."],
  "triceps-machine":["Schultern unten, Brust raus.|Ellbogen nah am Körper.", "Die Schultern nach vorn rollen.", "Shoulders down, chest up.|Elbows close.", "Rolling your shoulders forward."],
  "cable-woodchop":["Hüfte dreht leicht mit.|Arme bleiben lang.", "Nur mit den Armen ziehen.", "Hips rotate a little too.|Arms stay long.", "Pulling with your arms only."],
  "captains-chair":["Rücken bleibt an der Lehne.|Langsam senken.", "Mit Schwung arbeiten.", "Back stays on the pad.|Lower slowly.", "Swinging your legs."],
  "barbell-overhead-press":["Gesäß und Bauch fest.|Stange nah am Gesicht vorbei.", "Ins Hohlkreuz lehnen.", "Glutes and abs tight.|Bar travels close to your face.", "Leaning back into an arch."],
  "barbell-rdl":["Rücken gerade, Stange nah am Bein.|Bewegung aus der Hüfte.", "Mit rundem Rücken tiefer gehen.", "Flat back, bar close to your legs.|Move from your hips.", "Going lower with a rounded back."],
  "leg-press":["Rücken und Po bleiben am Polster.|Knie zeigen in Fußrichtung.", "Die Knie oben durchdrücken oder unten den Po abheben.", "Back and hips stay on the pad.|Knees track your toes.", "Locking your knees at the top or lifting your hips at the bottom."],
  "leg-press-45":["Po bleibt am Polster, Rücken flach.|Knie zeigen in Fußrichtung.", "Zu tief gehen, sodass der Po abrollt.", "Hips stay on the pad, back flat.|Knees track your toes.", "Going so deep that your hips roll up."],
  "leg-extension":["Rücken am Polster, Hände an den Griffen.|Langsam senken.", "Mit Schwung hochtreten.", "Back on the pad, hands on the handles.|Lower slowly.", "Kicking up with momentum."],
  "leg-curl":["Oberschenkel fixiert, Hüfte ruhig.|Volle Bewegung, langsam zurück.", "Mit der Hüfte hochkommen, um mehr Gewicht zu bewegen.", "Thighs locked, hips still.|Full range, slow return.", "Lifting your hips to move more weight."],
  "adductor-machine":["Rücken am Polster, Rumpf fest.|Gleichmäßig schließen.", "Die Beine zusammenschlagen lassen.", "Back on the pad, core braced.|Close evenly.", "Letting your legs slam together."],
  "abductor-machine":["Oberkörper ruhig, leicht nach vorn geneigt ist erlaubt.|Kontrolliert öffnen und schließen.", "Mit dem Oberkörper schaukeln.", "Torso still, a slight forward lean is fine.|Open and close with control.", "Rocking your torso."],
  "calf-machine":["Knie gestreckt, aber nicht durchgedrückt.|Volle Bewegung: unten dehnen, oben halten.", "Nur kurz auf und ab wippen.", "Knees straight but not locked.|Full range: stretch at the bottom, hold at the top.", "Just bouncing up and down."],
  "chest-press-machine":["Schultern unten und hinten, Brust raus.|Handgelenke gerade.", "Die Schultern beim Drücken nach vorn schieben.", "Shoulders down and back, chest up.|Straight wrists.", "Pushing your shoulders forward as you press."],
  "butterfly":["Ellbogen leicht gebeugt und fest.|Schultern unten, Brust raus.", "Zu weit nach hinten öffnen und die Schulter überdehnen.", "Elbows slightly bent and fixed.|Shoulders down, chest up.", "Opening too far back and overstretching your shoulders."],
  "pullover":["Rippen unten, unterer Rücken ruhig.|Arme fast gestreckt.", "Ins Hohlkreuz fallen, wenn das Gewicht hinter den Kopf geht.", "Ribs down, lower back quiet.|Arms almost straight.", "Arching your back as the weight goes behind your head."],
  "lat-pulldown":["Brust raus, leicht zurückgelehnt.|Ellbogen zeigen nach unten.", "Die Stange in den Nacken ziehen oder mit dem Oberkörper schwingen.", "Chest up, slight lean back.|Elbows point down.", "Pulling the bar behind your neck or swinging your torso."],
  "row-machine":["Brust bleibt am Polster.|Schultern weg von den Ohren.", "Mit den Armen reißen statt mit dem Rücken zu ziehen.", "Chest stays on the pad.|Shoulders away from your ears.", "Yanking with your arms instead of pulling with your back."],
  "cable-row":["Aufrecht sitzen, Rücken neutral.|Schulterblätter zuerst zusammen.", "Mit dem Oberkörper weit vor und zurück schaukeln.", "Sit tall, neutral spine.|Squeeze your shoulder blades first.", "Rocking your torso far forward and back."],
  "reverse-butterfly":["Arme auf Schulterhöhe, leicht gebeugt.|Brust am Polster.", "Die Schultern hochziehen.", "Arms at shoulder height, slightly bent.|Chest on the pad.", "Shrugging your shoulders."],
  "back-extension":["Rücken gerade, Kinn leicht zur Brust.|Bewegung aus der Hüfte.", "Oben ins Hohlkreuz überstrecken.", "Straight back, chin slightly tucked.|Move from your hips.", "Overarching at the top."],
  "shoulder-press-machine":["Rücken und Kopf am Polster.|Rippen unten.", "Ins Hohlkreuz drücken.", "Back and head on the pad.|Ribs down.", "Arching your back to press."],
  "biceps-machine":["Oberarme bleiben flach auf dem Polster.|Handgelenke gerade.", "Den Oberkörper nach hinten lehnen.", "Upper arms stay flat on the pad.|Straight wrists.", "Leaning back with your torso."],
  "cable-curl":["Ellbogen fest am Körper.|Aufrecht stehen, Rumpf fest.", "Mit dem Rücken Schwung holen.", "Elbows fixed at your sides.|Stand tall, core braced.", "Using your back for momentum."],
  "triceps-pushdown":["Oberarme bleiben am Körper.|Leicht nach vorn geneigt, Rumpf fest.", "Mit dem Oberkörper nach unten drücken.", "Upper arms stay at your sides.|Slight forward lean, core braced.", "Pushing down with your body weight."],
  "skull-crusher":["Oberarme bleiben senkrecht bzw. leicht nach hinten geneigt.|Langsam senken – das Gewicht ist nah am Kopf.", "Die Ellbogen weit nach außen öffnen.", "Upper arms stay vertical or tilted slightly back.|Lower slowly – the weight is close to your head.", "Letting your elbows flare wide."],
  "ab-crunch-machine":["Bauch führt, Nacken locker.|Langsam zurück.", "Mit den Armen oder Beinen ziehen.", "Your abs lead, neck relaxed.|Return slowly.", "Pulling with your arms or legs."],
  "bench-press":["Schulterblätter zusammen und unten, Füße fest.|Unterarme senkrecht unter der Stange.", "Die Stange auf der Brust abprallen lassen.", "Shoulder blades together and down, feet planted.|Forearms vertical under the bar.", "Bouncing the bar off your chest."],
  "barbell-squat":["Rumpf fest, Brust aufrecht.|Knie folgen den Zehen, Fersen am Boden.", "Die Knie nach innen fallen lassen.", "Core braced, chest up.|Knees follow your toes, heels down.", "Letting your knees cave in."],
  "barbell-deadlift":["Rücken gerade, Stange am Bein.|Hüfte und Schultern steigen gleichzeitig.", "Mit rundem Rücken ziehen.", "Flat back, bar against your legs.|Hips and shoulders rise together.", "Pulling with a rounded back."],
  "jump-lunges":["Oberkörper aufrecht, Rumpf fest.|Vorderes Knie über dem Fuß, hinteres Knie zeigt nach unten.","Hart auf der Ferse landen oder das vordere Knie nach innen knicken lassen.","Torso upright, core braced.|Front knee over your foot, back knee points down.","Landing hard on your heel or letting the front knee collapse inward."],
  "burpees":["Im Stütz eine Linie von Kopf bis Ferse, Hände unter den Schultern.|Bei der Landung Knie leicht gebeugt, Knie zeigen in Fußrichtung.","Mit durchhängendem Rücken in den Stütz springen.","In the plank, one line from head to heels, hands under your shoulders.|Land with soft knees tracking over your toes.","Jumping back into the plank with a sagging lower back."],
  "jump-squats":["Brust aufrecht, Blick nach vorn, Gewicht auf dem ganzen Fuß.|Knie folgen beim Absprung und bei der Landung der Fußrichtung.","Steifbeinig landen oder die Knie nach innen fallen lassen.","Chest up, eyes forward, weight across the whole foot.|Knees track over your toes on take-off and landing.","Landing stiff-legged or letting your knees cave in."],
  "mountain-climbers":["Schultern über den Händen, Rücken gerade wie im Stütz.|Bauch und Gesäß fest, damit die Hüfte nicht wippt.","Die Hüfte hochschieben oder durchhängen lassen.","Shoulders over your hands, back flat like a plank.|Brace your abs and glutes so your hips don't bounce.","Piking your hips up or letting them sag."],
  "high-knees":["Aufrecht bleiben, nicht nach hinten lehnen.|Leise auf den Fußballen landen, Rumpf fest.","Mit rundem Rücken nach vorn fallen.","Stay tall, don't lean back.|Land quietly on the balls of your feet, core braced.","Hunching forward with a rounded back."],
  "jumping-jacks":["Rumpf aufrecht, Bauch leicht angespannt.|Weich landen, Knie leicht gebeugt und in Fußrichtung.","Mit gestreckten Knien hart landen.","Torso upright, abs lightly braced.|Land softly, knees slightly bent and over your toes.","Landing hard with locked knees."],
  "skater-jumps":["Oberkörper leicht nach vorn, Rücken gerade.|Standknie über dem Fuß, Hüfte stabil.","Das Standknie bei der Landung nach innen knicken lassen.","Lean slightly forward with a flat back.|Standing knee over your foot, hips stable.","Letting the landing knee collapse inward."],
  "plank-burpees":["Im Stütz Kopf, Rücken und Beine in einer Linie.|In der Hocke Brust nach vorn, Rücken lang.","Im Stütz ins Hohlkreuz fallen.","In the plank, head, back and legs in one line.|In the squat, chest forward, back long.","Dropping into an arched lower back in the plank."],
  "jump-forward-squats":["Knie zeigen beim Absprung und bei der Landung in Fußrichtung.|Landung leise über den ganzen Fuß, Hüfte geht nach hinten.","Mit gestreckten Beinen landen oder nach vorn überkippen.","Knees track over your toes on take-off and landing.|Land quietly on the whole foot, hips back.","Landing stiff-legged or tipping forward."],
  "jump-forward-burpees":["Stütz mit festem Rumpf, Hüfte auf Schulterhöhe.|Landung weich in der Hocke, Knie in Fußrichtung.","Nach der Landung mit rundem Rücken direkt in die Hände fallen.","Plank with a braced core, hips level with shoulders.|Land softly in a squat, knees over your toes.","Collapsing onto your hands with a rounded back after landing."],
  "burpee-squat-jumps":["Stütz mit festem Rumpf, Hüfte auf Schulterhöhe.|Absprung und Landung mit Knien in Fußrichtung.","Unkontrolliert mit rundem Rücken aufrichten.","Plank with a braced core, hips level with shoulders.|Take off and land with knees over your toes.","Standing up uncontrolled with a rounded back."],
  "frogs":["In der Hocke Brust hoch, Rücken lang, Fersen möglichst am Boden.|Knie zeigen nach außen in Fußrichtung.","Den Rücken in der tiefen Hocke rund machen.","In the squat, chest up, back long, heels down if you can.|Knees point out over your toes.","Rounding your back at the bottom."],
  "stand-up-jumps":["Beim Aufstehen Füße flach, Oberkörper nach vorn über die Füße bringen.|Weich landen, Knie in Fußrichtung.","Sich ruckartig mit rundem Rücken hochreißen.","As you stand, feet flat and bring your chest over your feet.|Land softly, knees over your toes.","Jerking up with a rounded back."],
  "lateral-hops":["Oberkörper aufrecht und ruhig.|Knie leicht gebeugt, Fußgelenke federnd.","Mit gestreckten Beinen und lautem Aufprall landen.","Upper body upright and still.|Knees slightly bent, springy ankles.","Landing loudly with straight legs."],
  "fast-feet":["Leichte Hockposition, Rücken gerade, Brust vorn.|Gewicht auf den Fußballen.","Aufrichten und auf die Fersen fallen.","Slight athletic crouch, back flat, chest forward.|Weight on the balls of your feet.","Standing up and dropping onto your heels."],
  "box-step-ups":["Ganzen Fuß auf die Box setzen, Knie über dem Fuß.|Oberkörper aufrecht, mit dem oberen Bein hochdrücken.","Sich mit dem unteren Bein abstoßen oder das Knie nach innen knicken.","Put your whole foot on the box, knee over your foot.|Stay upright and drive up with the top leg.","Pushing off the bottom leg or letting the knee cave in."],
  "sprint-in-place":["Leichte Vorlage aus den Sprunggelenken, Rumpf gerade.|Arme im 90°-Winkel aus der Schulter.","Zurücklehnen und auf den Fersen laufen.","Slight forward lean from the ankles, torso straight.|Arms bent at 90°, swinging from the shoulders.","Leaning back and running on your heels."],

  "goblet-squat":["Gewicht nah an der Brust, Ellbogen zeigen nach unten.|Rücken neutral, Knie folgen den Zehen, Fersen bleiben am Boden.","Den unteren Rücken in der Tiefe rund werden lassen.","Keep the weight close to your chest, elbows down.|Neutral spine, knees follow your toes, heels stay down.","Letting your lower back round at the bottom."],
  "kb-swing":["Hüftbeuge: Po nach hinten, Rücken lang und gerade, Schienbeine fast senkrecht.|Oben aufrecht mit angespanntem Gesäß, nicht nach hinten lehnen.","Die Glocke mit den Armen heben oder wie eine Kniebeuge schwingen.","Hip hinge: hips back, spine long and flat, shins nearly vertical.|Stand tall at the top with glutes squeezed, don't lean back.","Lifting the bell with your arms or squatting the swing."],
  "db-thruster":["In der Kniebeuge Brust aufrecht, Ellbogen vorn.|Oben Rippen unten, Arme neben den Ohren.","Beim Drücken ins Hohlkreuz gehen.","In the squat, chest up, elbows forward.|At the top, ribs down, arms by your ears.","Arching your lower back as you press."],
  "romanian-deadlift":["Rücken neutral, Schulterblätter leicht zurück, Hanteln nah am Bein.|Knie leicht gebeugt, Bewegung kommt aus der Hüfte.","Mit rundem Rücken tiefer gehen, als es gerade bleibt.","Neutral spine, shoulder blades slightly back, weights close to your legs.|Knees soft, the movement comes from your hips.","Going lower than you can with a flat back and rounding."],
  "db-deadlift":["Brust raus, Rücken gerade, Blick leicht nach vorn unten.|Aus den Beinen drücken, Hüfte und Schultern steigen gleichzeitig.","Zuerst die Hüfte hochschießen lassen und mit dem Rücken ziehen.","Chest proud, flat back, eyes slightly down and forward.|Push with your legs, hips and shoulders rise together.","Shooting your hips up first and pulling with your back."],
  "bent-over-row":["Rücken gerade und fest, Nacken in Verlängerung der Wirbelsäule.|Schultern weg von den Ohren, Ellbogen nah am Körper.","Mit Schwung aus dem Oberkörper ziehen.","Flat, braced back, neck in line with your spine.|Shoulders away from your ears, elbows close.","Using body swing to heave the weight."],
  "one-arm-row":["Rücken waagerecht und gerade, Hüfte nicht aufdrehen.|Schulter der Zugseite nach hinten unten.","Den Oberkörper beim Ziehen nach oben drehen.","Back flat and level, don't open your hips.|Draw the working shoulder back and down.","Twisting your torso up as you row."],
  "floor-press":["Schulterblätter leicht zusammen, Füße fest am Boden.|Unterarme senkrecht, Ellbogen etwa 45° vom Körper.","Die Ellbogen weit seitlich ausstellen.","Shoulder blades gently squeezed, feet planted.|Forearms vertical, elbows about 45° from your body.","Flaring your elbows straight out to the sides."],
  "shoulder-press":["Rippen unten, Gesäß angespannt, Rücken neutral.|Hanteln über den Schultern, Kopf am Ende leicht nach vorn.","Ins Hohlkreuz lehnen, um das Gewicht hochzubringen.","Ribs down, glutes squeezed, neutral spine.|Weights over your shoulders, head slightly through at the top.","Leaning back into an arched spine to get the weight up."],
  "push-press":["Beim Eintauchen Oberkörper senkrecht, Knie in Fußrichtung.|Oben Rumpf fest, Arme gestreckt über den Ohren.","Beim Eintauchen nach vorn kippen.","Dip with an upright torso, knees over your toes.|At the top, core tight, arms locked by your ears.","Tipping forward during the dip."],
  "weighted-reverse-lunge":["Oberkörper aufrecht, Schultern tief.|Vorderes Knie über dem Fuß, Gewicht auf der vorderen Ferse.","Das vordere Knie nach innen fallen lassen.","Torso upright, shoulders down.|Front knee over your foot, weight on the front heel.","Letting the front knee drift inward."],
  "front-rack-carry":["Aufrecht, Rippen unten, Ellbogen vorn.|Blick nach vorn, ruhiger Rumpf.","Nach hinten ins Hohlkreuz lehnen.","Tall, ribs down, elbows forward.|Eyes forward, steady torso.","Leaning back into an arched spine."],
  "farmer-carry":["Schultern tief und leicht zurück, Kopf lang.|Rumpf fest, Hüfte gerade.","Die Schultern hochziehen oder zur Seite kippen.","Shoulders down and slightly back, tall neck.|Braced core, level hips.","Shrugging your shoulders or leaning to one side."],
  "kb-clean":["Wie beim Swing: Hüftbeuge mit geradem Rücken.|Oben Handgelenk gerade, Ellbogen am Körper.","Die Glocke auf den Unterarm knallen lassen.","Like a swing: hip hinge with a flat back.|At the top, straight wrist, elbow tucked.","Letting the bell crash onto your forearm."],
  "renegade-row":["Stütz mit breitem Stand, Hüfte parallel zum Boden.|Schulter über der Stützhand.","Die Hüfte beim Ziehen aufdrehen.","Plank with a wide stance, hips parallel to the floor.|Shoulder over the supporting hand.","Rotating your hips open as you row."],

  "push-ups":["Linie von Kopf bis Ferse, Gesäß und Oberschenkel angespannt.|Ellbogen etwa 45° vom Körper, Blick knapp vor die Hände.","Die Hüfte durchhängen lassen oder den Po hochstrecken.","One line from head to heels, glutes and thighs squeezed.|Elbows about 45° from your body, eyes just ahead of your hands.","Sagging hips or piking your hips up."],
  "pike-push-ups":["Hüfte hoch, Rücken möglichst gerade.|Ellbogen nach hinten, nicht seitlich ausstellen.","Mit rundem Rücken und hochgezogenen Schultern arbeiten.","Hips high, back as straight as possible.|Elbows travel back, not out to the sides.","Working with a rounded back and shrugged shoulders."],
  "triceps-dips":["Schultern tief und zurück, Rücken nah an der Bank.|Nur bis etwa 90° im Ellbogen absenken.","Zu tief gehen und die Schultern nach vorn rollen.","Shoulders down and back, back close to the bench.|Lower only until your elbows reach about 90°.","Going too deep and rolling your shoulders forward."],
  "squat-hold":["Brust aufrecht, Rücken neutral.|Knie über den Füßen, Gewicht auf den Fersen.","Die Knie nach innen fallen lassen.","Chest up, neutral spine.|Knees over your feet, weight in your heels.","Letting your knees cave in."],
  "walking-lunges":["Oberkörper aufrecht, Becken gerade.|Vorderes Knie über dem Fuß, hinteres Knie zeigt nach unten.","Mit dem Oberkörper weit nach vorn kippen.","Torso upright, pelvis level.|Front knee over your foot, back knee points down.","Tipping far forward with your torso."],
  "reverse-lunges":["Oberkörper aufrecht, Rumpf fest.|Vorderes Knie über dem Sprunggelenk.","Das vordere Knie nach innen knicken lassen.","Torso upright, core braced.|Front knee over your ankle.","Letting the front knee collapse inward."],
  "side-lunges":["Brust vorn, Rücken gerade, Hüfte nach hinten.|Gebeugtes Knie in Fußrichtung, beide Fersen am Boden.","Das Knie nach vorn über die Zehen schieben.","Chest forward, back flat, hips back.|Bent knee over your toes, both heels down.","Pushing the knee far forward past your toes."],
  "cossack-squats":["Brust aufrecht, Rücken lang.|Gebeugtes Knie in Fußrichtung, Ferse am Boden.","Tiefer gehen, als die Ferse unten bleibt.","Chest up, long spine.|Bent knee tracks your toes, heel down.","Going deeper than your heel can stay down."],
  "deep-squats":["Rücken neutral, Brust aufrecht.|Knie nach außen in Fußrichtung.","Unten den Rücken rund werden lassen.","Neutral spine, chest up.|Knees push out over your toes.","Letting your back round at the bottom."],
  "pistol-assist":["Standknie in Fußrichtung, Ferse bleibt unten.|Oberkörper leicht nach vorn, Rücken gerade.","Mit dem Knie nach innen kippen.","Standing knee tracks your toes, heel stays down.|Lean slightly forward with a flat back.","Letting the knee drop inward."],
  "plank-steps":["Hüfte ruhig und parallel zum Boden.|Füße etwas breiter für mehr Stabilität.","Die Hüfte beim Hochdrücken hin und her schaukeln.","Hips still and level.|Feet a little wider for stability.","Rocking your hips from side to side."],
  "bear-crawl":["Rücken flach wie ein Tisch.|Hände unter den Schultern, Knie unter der Hüfte.","Den Po hochstrecken.","Back flat like a table.|Hands under shoulders, knees under hips.","Sticking your hips up high."],
  "wall-sit":["Rücken und Hinterkopf an der Wand.|Knie über den Sprunggelenken, nicht über die Zehen.","Die Füße zu nah an der Wand, sodass die Knie nach vorn schieben.","Back and head against the wall.|Knees over your ankles, not past your toes.","Feet too close to the wall so your knees drift forward."],
  "calf-raises":["Aufrecht, Gewicht über dem Großzehenballen.|Knie gestreckt, aber nicht durchgedrückt.","Mit den Füßen nach außen abrollen.","Stand tall, weight over the big-toe ball.|Knees straight but not locked.","Rolling out onto the outer edges of your feet."],
  "glute-bridge":["Rippen unten, Bewegung aus dem Gesäß.|Knie hüftbreit, zeigen nach vorn.","Oben ins Hohlkreuz überstrecken.","Ribs down, drive with your glutes.|Knees hip-width, pointing forward.","Overarching your lower back at the top."],

  "pull-ups":["Schultern zuerst nach unten ziehen, Brust zur Stange.|Rumpf fest, Beine ruhig.","Mit Schwung ziehen oder die Schultern zu den Ohren ziehen.","Pull your shoulders down first, chest to the bar.|Core braced, legs still.","Kipping or shrugging your shoulders to your ears."],
  "negative-pull-ups":["Schultern tief halten, auch beim Absenken.|Körper gerade, nicht schwingen.","Unten fallen lassen statt kontrolliert zu senken.","Keep your shoulders down on the way down.|Body straight, no swinging.","Dropping at the bottom instead of lowering with control."],
  "inverted-rows":["Körper steif wie ein Brett, Gesäß angespannt.|Schulterblätter zusammen, Hals lang.","Die Hüfte durchhängen lassen.","Body rigid like a plank, glutes squeezed.|Shoulder blades together, long neck.","Letting your hips sag."],
  "superman-hold":["Blick zum Boden, Nacken lang.|Gesäß angespannt, nur klein abheben.","Den Kopf in den Nacken legen.","Look down, long neck.|Squeeze your glutes and lift only a little.","Cranking your head back."],
  "reverse-snow-angels":["Stirn knapp über dem Boden, Nacken lang.|Schulterblätter aktiv nach hinten unten.","Die Schultern Richtung Ohren ziehen.","Forehead just off the floor, long neck.|Shoulder blades active, back and down.","Shrugging your shoulders towards your ears."],
  "bird-dog":["Rücken flach, Becken bleibt waagerecht.|Arm und Bein nur bis zur Körperlinie heben.","Das Bein zu hoch heben und ins Hohlkreuz gehen.","Flat back, pelvis stays level.|Lift arm and leg only to body height.","Lifting the leg too high and arching your back."],
  "prone-y-raise":["Stirn knapp über dem Boden, Nacken lang.|Schulterblätter nach hinten unten ziehen.","Mit dem unteren Rücken statt den Schultern heben.","Forehead just off the floor, long neck.|Draw your shoulder blades back and down.","Lifting with your lower back instead of your shoulders."],
  "prone-t-raise":["Nacken lang, Blick zum Boden.|Arme auf Schulterhöhe, Schulterblätter zusammen.","Die Schultern hochziehen.","Long neck, eyes down.|Arms at shoulder height, blades squeezed together.","Shrugging your shoulders up."],
  "good-mornings":["Rücken neutral, Ellbogen offen.|Knie leicht gebeugt, Gewicht auf den Fersen.","Tiefer beugen, als der Rücken gerade bleibt.","Neutral spine, elbows open.|Knees soft, weight in your heels.","Bending lower than your back can stay flat."],
  "swimmers":["Blick zum Boden, Nacken lang.|Bauch leicht angespannt, Becken bleibt am Boden.","Den Kopf hochreißen.","Look down, long neck.|Abs lightly braced, pelvis on the floor.","Jerking your head up."],
  "cobra-lift":["Schultern weg von den Ohren, Blick schräg nach vorn unten.|Becken bleibt am Boden, Gesäß locker.","Sich mit den Armen weit hochdrücken und den unteren Rücken stauchen.","Shoulders away from your ears, eyes down and forward.|Pelvis stays down, glutes relaxed.","Pushing up high with your arms and crunching your lower back."],
  "scapular-push-ups":["Arme gestreckt, Rumpf wie im Stütz.|Bewegung nur aus den Schulterblättern.","Die Ellbogen beugen oder ins Hohlkreuz fallen.","Arms straight, body like a plank.|Move only your shoulder blades.","Bending your elbows or sagging into your lower back."],
  "scapular-pull-ups":["Arme bleiben gestreckt.|Rumpf fest, Beine ruhig.","Mit den Armen ziehen.","Arms stay straight.|Core braced, legs still.","Pulling with your arms."],
  "dead-hang":["Schultern leicht aktiv, nicht ganz „aushängen“.|Rumpf locker fest, Beine ruhig.","Mit Schwung ab- oder aufspringen.","Shoulders lightly active, not fully relaxed.|Core gently braced, legs still.","Jumping on or off with momentum."],

  "air-squats":["Brust aufrecht, Rücken neutral.|Knie folgen den Zehen, Fersen bleiben am Boden.","Die Knie nach innen fallen lassen.","Chest up, neutral spine.|Knees follow your toes, heels stay down.","Letting your knees cave in."],
  "split-squats":["Oberkörper aufrecht, Becken gerade.|Vorderes Knie über dem Fuß.","Das Gewicht auf den hinteren Fuß verlagern.","Torso upright, pelvis level.|Front knee over your foot.","Shifting your weight onto the back foot."],
  "bulgarian-split-squats":["Oberkörper leicht nach vorn, Rücken gerade.|Vorderes Knie in Fußrichtung, Ferse bleibt unten.","Das vordere Knie nach innen kippen.","Slight forward lean, flat back.|Front knee tracks your toes, heel down.","Letting the front knee collapse inward."],
  "forward-lunges":["Oberkörper aufrecht, Rumpf fest.|Vorderes Knie über dem Sprunggelenk.","Unkontrolliert in den Schritt fallen.","Torso upright, core braced.|Front knee over your ankle.","Crashing into the step without control."],
  "single-leg-glute-bridge":["Becken waagerecht, Rippen unten.|Standknie zeigt nach vorn.","Das Becken zur freien Seite absacken lassen.","Level pelvis, ribs down.|Supporting knee points forward.","Letting your hip drop on the free-leg side."],
  "lateral-lunge-pulses":["Brust vorn, Rücken gerade.|Gebeugtes Knie in Fußrichtung.","Mit rundem Rücken pulsieren.","Chest forward, flat back.|Bent knee over your toes.","Pulsing with a rounded back."],

  "plank":["Linie von Kopf bis Ferse, Blick zum Boden.|Gesäß und Oberschenkel anspannen, Ellbogen unter den Schultern.","Durchhängen oder den Po hochstrecken.","One line from head to heels, eyes down.|Squeeze glutes and thighs, elbows under shoulders.","Sagging or piking your hips."],
  "side-plank":["Ellbogen unter der Schulter, Körper in einer Linie.|Hüfte nach vorn schieben, nicht nach hinten knicken.","Die Hüfte absinken lassen.","Elbow under your shoulder, body in one line.|Push your hips forward, don't bend back.","Letting your hips drop."],
  "dead-bug":["Unterer Rücken bleibt flach am Boden (Becken leicht einrollen).|Langsam und kontrolliert ausatmen beim Strecken.","Ins Hohlkreuz gehen, sobald Arm und Bein sich strecken.","Lower back stays flat on the floor (tuck your pelvis slightly).|Exhale slowly as you extend.","Arching your back as your arm and leg extend."],
  "bicycle-crunches":["Unterer Rücken am Boden, Schultern angehoben.|Drehen aus dem Oberkörper, Ellbogen offen.","Mit den Händen am Nacken ziehen.","Lower back down, shoulders lifted.|Rotate through your upper back, elbows open.","Pulling on your neck with your hands."],
  "leg-raises":["Unterer Rücken am Boden, Becken leicht eingerollt.|Beine langsam senken, ohne Schwung.","Die Beine fallen lassen und ins Hohlkreuz gehen.","Lower back down, pelvis slightly tucked.|Lower your legs slowly, no swinging.","Dropping your legs and arching your back."],
  "jackknives":["Bauch fest, Rücken rollt kontrolliert ab.|Arme und Beine gleichzeitig bewegen.","Mit Schwung hochreißen.","Abs tight, roll your spine with control.|Move arms and legs together.","Yanking up with momentum."],
  "side-jackknives":["Körper in einer Linie auf der Seite, nicht nach hinten kippen.|Aus der seitlichen Bauchmuskulatur heben.","Mit Kopf und Nacken ziehen.","Body in one line on your side, don't roll back.|Lift with your side abs.","Pulling with your head and neck."],
  "hollow-hold":["Unterer Rücken fest am Boden, Becken eingerollt.|Kinn leicht zur Brust, Schultern abgehoben.","Die Beine so tief halten, dass der Rücken hohl wird.","Lower back pressed down, pelvis tucked.|Chin slightly tucked, shoulders off the floor.","Holding your legs so low that your back arches."],
  "russian-twists":["Brustbein aufrecht, Rücken lang, nicht rund.|Drehen aus dem Oberkörper, Becken ruhig.","Mit rundem Rücken nach hinten kippen.","Chest up, long spine, not rounded.|Rotate through your upper body, pelvis still.","Slumping back with a rounded spine."],
  "sit-ups":["Kinn leicht zur Brust, Nacken locker.|Füße bleiben am Boden, Bauch führt die Bewegung.","Sich mit den Händen am Kopf hochziehen.","Chin slightly tucked, relaxed neck.|Feet stay down, your abs lead.","Yanking yourself up by your head."],
  "toe-touches":["Unterer Rücken am Boden.|Schulterblätter abheben, Nacken lang.","Mit dem Kopf nach vorn nicken.","Lower back down.|Lift your shoulder blades, long neck.","Jerking your head forward."],
  "plank-shoulder-taps":["Hüfte parallel zum Boden, Füße etwas breiter.|Gesäß und Bauch fest.","Mit der Hüfte hin und her schaukeln.","Hips parallel to the floor, feet a bit wider.|Glutes and abs tight.","Rocking your hips side to side."],
  "toes-to-bar":["Schultern aktiv, Rumpf fest.|Becken zum Heben einrollen.","Mit großem Schwung arbeiten.","Active shoulders, braced core.|Tuck your pelvis to lift.","Using big swings."]
};

Object.assign(EX_INFO, {
  "reverse-crunch":["Rückenlage, Arme neben dem Körper, Knie über der Hüfte angewinkelt.|Knie Richtung Brust ziehen und das Becken ein Stück vom Boden abrollen.|Langsam Wirbel für Wirbel zurück, ohne Schwung.","Lie on your back, arms by your sides, knees bent over your hips.|Pull your knees towards your chest and curl your pelvis off the floor.|Lower slowly one vertebra at a time, no momentum."],
  "chin-ups":["Im Untergriff an der Stange hängen, Hände schulterbreit.|Schultern nach unten ziehen und das Kinn über die Stange ziehen.|Kontrolliert in den gestreckten Hang absenken.","Hang with an underhand grip, hands shoulder-width.|Pull your shoulders down and your chin over the bar.|Lower with control to a full hang."],
  "commando-pull-ups":["Die Stange längs vor dir greifen, Hände dicht hintereinander.|Den Kopf auf eine Seite der Stange hochziehen.|Absenken, im nächsten Intervall zur anderen Seite.","Grip the bar lengthwise, hands close one behind the other.|Pull your head up to one side of the bar.|Lower, pull to the other side next interval."],
  "parallel-bar-dips":["Im Stütz zwischen zwei Holmen beginnen, Arme gestreckt.|Absenken, bis die Oberarme etwa waagerecht sind.|Kraftvoll hochdrücken.","Start in a support between two bars, arms straight.|Lower until your upper arms are about horizontal.|Press back up."],
  "support-hold":["Auf Barren oder Parallettes in den Stütz drücken.|Arme gestreckt, Schultern nach unten gedrückt.|Ruhig halten und atmen.","Press up into a support on dip bars or parallettes.|Arms straight, shoulders pushed down.|Hold steadily and breathe."],
  "hanging-knee-raise":["An der Stange hängen, Arme gestreckt.|Knie kontrolliert zur Brust ziehen.|Langsam senken, ohne zu schwingen.","Hang from the bar, arms straight.|Draw your knees to your chest with control.|Lower slowly without swinging."],
  "hanging-leg-raise":["An der Stange hängen, Beine gestreckt.|Gestreckte Beine bis auf Hüfthöhe oder höher heben.|Kontrolliert senken.","Hang from the bar, legs straight.|Raise your straight legs to hip height or higher.|Lower with control."],
  "hanging-l-sit":["An der Stange hängen.|Gestreckte Beine waagerecht nach vorn heben.|Halten, ruhig atmen.","Hang from the bar.|Raise your straight legs forward to horizontal.|Hold and breathe calmly."],
  "l-sit":["Auf Barren oder Parallettes stützen.|Gestreckte Beine waagerecht nach vorn heben.|Halten, Schultern nach unten drücken.","Support yourself on dip bars or parallettes.|Raise your straight legs to horizontal.|Hold, pushing your shoulders down."],
  "windshield-wipers":["Im Hang die gestreckten Beine hoch zur Stange bringen.|Beine kontrolliert zur einen Seite kippen.|Über die Mitte zur anderen Seite führen.","In the hang, bring your straight legs up to the bar.|Tilt your legs to one side with control.|Move through the middle to the other side."],
  "muscle-ups":["Im Hang beginnen, leicht falscher Griff.|Explosiv zur Brust ziehen und die Handgelenke über die Stange bringen.|In den Stütz drücken, kontrolliert zurück.","Start in a hang with a slight false grip.|Pull explosively and bring your wrists over the bar.|Press into the support, return with control."],
  "burpee-pull-ups":["Unter die Klimmzugstange stellen.|In die Hocke gehen, Hände aufsetzen, die Beine in den Liegestütz springen und einen Liegestütz machen.|Füße zurück zu den Händen springen und aus der Hocke zur Stange hochspringen.|Einen Klimmzug machen, kontrolliert in den Hang absenken und zurück auf den Boden.","Stand under the pull-up bar.|Squat down, place your hands, jump your feet back into a plank and do a push-up.|Jump your feet back to your hands and jump up to the bar from the squat.|Do a pull-up, lower with control into the hang and drop back to the floor."],
  "monkey-bar-traverse":["An der Hangelleiter hängen.|Mit einer Hand zur nächsten Sprosse greifen.|Im Wechsel weiterhangeln.","Hang from the monkey bars.|Reach to the next rung with one hand.|Keep traversing, alternating hands."],
  "skin-the-cat":["Im Hang die Knie zur Brust ziehen.|Beine zwischen den Armen durchführen und kontrolliert durch die Schultern drehen.|Nur so weit wie angenehm, dann zurück.","From the hang, pull your knees to your chest.|Pass your legs through your arms and rotate through your shoulders with control.|Only as far as comfortable, then return."],
  "archer-push-ups":["Sehr breiter Liegestütz.|Zu einer Hand absenken, der andere Arm streckt sich seitlich.|Hochdrücken, Seite nach jedem Intervall wechseln.","Very wide push-up position.|Lower towards one hand while the other arm straightens.|Press up, switch sides after each interval."],
  "pistol-squats":["Auf einem Bein stehen, das andere Bein nach vorn gestreckt.|Langsam tief auf dem Standbein absenken, Arme nach vorn.|Hochdrücken, Seite nach jedem Intervall wechseln.","Stand on one leg, the other leg straight in front.|Lower slowly and deep on the standing leg, arms forward.|Push up, switch sides after each interval."],
  "dragon-flags":["Auf den Rücken legen, hinter dem Kopf festhalten (Bank oder schweres Möbel).|Den gestreckten Körper bis auf die Schultern hochheben.|Wie ein Brett langsam absenken.","Lie on your back and hold on behind your head (bench or heavy furniture).|Lift your straight body onto your shoulders.|Lower slowly like a plank."],
  "clap-push-ups":["Normaler Liegestütz.|Explosiv hochdrücken, sodass die Hände abheben, und klatschen.|Weich mit leicht gebeugten Armen landen.","Normal push-up position.|Press up explosively so your hands leave the floor, and clap.|Land softly with slightly bent arms."],
  "tuck-jumps":["Hüftbreit stehen, leicht in die Knie.|Explosiv hochspringen und die Knie zur Brust ziehen.|Weich landen und direkt weiterspringen.","Stand hip-width, knees slightly bent.|Jump explosively and pull your knees to your chest.|Land softly and go straight into the next jump."],
  "close-grip-push-ups":["Hände schulterbreit, etwas enger als beim normalen Liegestütz.|Absenken, die Ellbogen streifen am Körper entlang.|Hochdrücken, bis die Arme gestreckt sind.","Hands shoulder-width, a bit narrower than a normal push-up.|Lower with your elbows brushing past your ribs.|Press up until your arms are straight."],
  "diamond-push-ups":["Hände unter der Brust, Daumen und Zeigefinger bilden ein Dreieck.|Körper gerade, Brust Richtung Hände senken.|Kraftvoll hochdrücken, Ellbogen bleiben nah am Körper.","Hands under your chest, thumbs and index fingers form a triangle.|Keep your body straight and lower your chest to your hands.|Press up, elbows stay close to your body."],
  "sphinx-push-ups":["Im Unterarmstütz beginnen, Unterarme parallel.|Nur aus dem Trizeps die Unterarme vom Boden drücken, bis die Arme gestreckt sind.|Langsam zurück auf die Unterarme.","Start in a forearm plank, forearms parallel.|Press your forearms off the floor with your triceps until your arms are straight.|Lower slowly back onto your forearms."],
  "triceps-curls":["Eine Kurzhantel mit beiden Händen senkrecht über den Kopf halten.|Ellbogen beugen und die Hantel langsam hinter den Kopf senken.|Wieder nach oben strecken.","Hold one dumbbell upright overhead with both hands.|Bend your elbows and slowly lower it behind your head.|Extend back up."],
  "arm-circles":["Aufrecht stehen, Arme seitlich auf Schulterhöhe strecken.|Kleine Kreise nach vorn machen.|Nach der Hälfte der Zeit die Richtung wechseln.","Stand tall, arms straight out at shoulder height.|Make small circles forwards.|Halfway through, switch direction."],
  "neck-stretch":["Aufrecht sitzen oder stehen.|Den Kopf zur Seite neigen, Ohr Richtung Schulter; die Hand darf leicht mitziehen.|Halten, ruhig atmen, dann die Seite wechseln.","Sit or stand tall.|Tilt your head to the side, ear towards shoulder; your hand may pull gently.|Hold, breathe calmly, then switch sides."],
  "shoulder-stretch":["Einen gestreckten Arm vor der Brust zur anderen Seite führen.|Mit der anderen Hand am Oberarm sanft heranziehen.|Halten, dann die Seite wechseln.","Bring one straight arm across your chest.|Gently pull it in at the upper arm with the other hand.|Hold, then switch sides."],
  "triceps-stretch":["Einen Arm nach oben strecken und beugen, die Hand liegt zwischen den Schulterblättern.|Mit der anderen Hand den Ellbogen sanft Richtung Kopf ziehen.|Halten, dann die Seite wechseln.","Raise one arm and bend it so your hand rests between your shoulder blades.|Gently pull the elbow towards your head with the other hand.|Hold, then switch sides."],
  "biceps-stretch":["Seitlich neben eine Wand stellen, den gestreckten Arm auf Schulterhöhe nach hinten an die Wand legen.|Den Körper langsam von der Wand wegdrehen.|Halten, dann die Seite wechseln.","Stand side-on to a wall, straight arm back on the wall at shoulder height.|Slowly turn your body away from the wall.|Hold, then switch sides."],
  "chest-stretch":["Den Unterarm senkrecht an eine Wand oder einen Türrahmen legen, Ellbogen auf Schulterhöhe.|Mit dem Körper langsam nach vorn und von der Wand wegdrehen.|Halten, dann die Seite wechseln.","Place your forearm upright on a wall or door frame, elbow at shoulder height.|Slowly step forward and turn away from the wall.|Hold, then switch sides."],
  "wrist-stretch":["Einen Arm nach vorn strecken, Handfläche zeigt nach vorn.|Mit der anderen Hand die Finger sanft zurückziehen.|Dann den Handrücken nach vorn drehen und die Hand nach unten ziehen; beide Seiten.","Extend one arm, palm facing forward.|Gently pull the fingers back with your other hand.|Then turn the back of the hand forward and pull it down; both sides."],
  "side-bend":["Hüftbreit stehen, einen Arm über den Kopf strecken.|Zur Seite neigen, als würdest du über eine Mauer greifen.|Halten, dann die Seite wechseln.","Stand hip-width and reach one arm overhead.|Lean to the side as if reaching over a wall.|Hold, then switch sides."],
  "cat-cow":["Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte.|Ausatmen: Rücken rund machen, Kinn zur Brust.|Einatmen: Brust nach vorn, Blick leicht nach oben; im Wechsel.","On all fours, hands under shoulders, knees under hips.|Exhale: round your back, chin to chest.|Inhale: chest forward, look slightly up; alternate."],
  "childs-pose":["Aus dem Vierfüßlerstand den Po Richtung Fersen setzen.|Arme lang nach vorn, Stirn ablegen.|Entspannt halten und in den Rücken atmen.","From all fours, sit your hips back towards your heels.|Arms long in front, forehead down.|Hold relaxed and breathe into your back."],
  "sphinx-stretch":["Auf den Bauch legen, Ellbogen unter die Schultern.|Die Brust sanft anheben, die Unterarme bleiben am Boden.|Entspannt halten und ruhig atmen.","Lie on your stomach, elbows under your shoulders.|Gently lift your chest, forearms stay down.|Hold relaxed and breathe calmly."],
  "downward-dog":["Aus dem Vierfüßlerstand die Hüfte nach oben schieben.|Arme und Rücken bilden eine Linie, die Fersen sinken Richtung Boden.|Halten, dabei abwechselnd ein Knie leicht beugen.","From all fours, push your hips up.|Arms and back form one line, heels sink towards the floor.|Hold, gently bending one knee then the other."],
  "spinal-twist":["Auf den Rücken legen, Arme seitlich ausstrecken.|Beide Knie angewinkelt zu einer Seite sinken lassen.|Den Kopf zur anderen Seite drehen, halten, dann wechseln.","Lie on your back, arms out to the sides.|Let both bent knees drop to one side.|Turn your head the other way, hold, then switch."],
  "forward-fold":["Hüftbreit stehen, Knie leicht gebeugt.|Aus der Hüfte nach vorn beugen und den Oberkörper hängen lassen.|Halten; zum Aufrichten langsam Wirbel für Wirbel hochrollen.","Stand hip-width, knees soft.|Hinge forward from your hips and let your upper body hang.|Hold; roll up slowly one vertebra at a time."],
  "hip-flexor-stretch":["In den Kniestand gehen, ein Fuß vorn, das hintere Knie am Boden (gern gepolstert).|Becken leicht einrollen und die Hüfte nach vorn schieben.|Halten, dann die Seite wechseln.","Kneel with one foot in front and the back knee on the floor (padded if you like).|Tuck your pelvis slightly and push your hips forward.|Hold, then switch sides."],
  "quad-stretch":["Auf einem Bein stehen, bei Bedarf festhalten.|Den anderen Fuß greifen und die Ferse Richtung Gesäß ziehen.|Halten, dann die Seite wechseln.","Stand on one leg, hold on if needed.|Grab the other foot and draw the heel towards your glutes.|Hold, then switch sides."],
  "hamstring-stretch":["Aufrecht sitzen, die Beine nach vorn gestreckt.|Mit langem Rücken aus der Hüfte nach vorn beugen.|Halten; die Hände liegen dort, wo sie bequem hinkommen.","Sit tall with your legs straight out in front.|Hinge forward from your hips with a long back.|Hold, with your hands wherever they comfortably reach."],
  "calf-stretch":["Vor eine Wand stellen, Hände auf Schulterhöhe an die Wand.|Ein Bein weit nach hinten setzen, die Ferse bleibt am Boden.|Hüfte nach vorn, halten, dann die Seite wechseln.","Stand facing a wall, hands on it at shoulder height.|Step one leg far back, heel stays down.|Shift your hips forward, hold, then switch sides."],
  "figure-four":["Auf den Rücken legen, Knie angewinkelt.|Einen Knöchel auf das andere Knie legen.|Das untere Bein zur Brust ziehen, halten, dann die Seite wechseln.","Lie on your back with your knees bent.|Cross one ankle over the opposite knee.|Draw the lower leg towards your chest, hold, then switch sides."],
  "pigeon-stretch":["Aus dem Vierfüßlerstand ein Knie nach vorn zwischen die Hände bringen, Schienbein schräg.|Das andere Bein lang nach hinten strecken.|Aufrecht bleiben oder nach vorn ablegen, halten, dann wechseln.","From all fours, bring one knee forward between your hands, shin angled.|Extend the other leg long behind you.|Stay upright or fold forward, hold, then switch."],
  "butterfly-stretch":["Aufrecht sitzen, Fußsohlen zusammen, die Knie fallen nach außen.|Die Füße mit den Händen halten.|Mit langem Rücken leicht nach vorn neigen und halten.","Sit tall, soles together, knees falling out.|Hold your feet with your hands.|Lean slightly forward with a long back and hold."],
  "worlds-greatest":["Großer Ausfallschritt nach vorn, beide Hände innen neben den vorderen Fuß.|Die innere Hand zur Decke drehen, der Blick folgt der Hand.|Zurückführen, ein paar Mal wiederholen, Seite nach jedem Intervall wechseln.","Big lunge forward, both hands inside your front foot.|Rotate the inside hand up to the ceiling, eyes follow the hand.|Bring it back, repeat a few times, switch sides after each interval."]
});
Object.assign(EX_POSTURE, {
  "reverse-crunch":["Kopf und Schultern bleiben entspannt am Boden.|Die Bewegung kommt aus dem Bauch, nicht aus dem Schwung der Beine.","Die Beine nach hinten schleudern.","Head and shoulders stay relaxed on the floor.|The movement comes from your abs, not from swinging your legs.","Flinging your legs back."],
  "chin-ups":["Rumpf fest, Beine ruhig.|Ellbogen zeigen nach unten.","Mit Schwung aus den Beinen ziehen.","Core braced, legs still.|Elbows point down.","Kicking with your legs for momentum."],
  "commando-pull-ups":["Rumpf fest, nicht ins Drehen geraten.|Schultern tief.","Mit dem Oberkörper schwingen.","Core tight, don't spin.|Shoulders down.","Swinging your torso."],
  "parallel-bar-dips":["Schultern tief, Oberkörper leicht nach vorn.|Ellbogen nach hinten, nicht nach außen.","Tiefer gehen als schmerzfrei möglich.","Shoulders down, torso slightly forward.|Elbows back, not out.","Going deeper than is pain-free."],
  "support-hold":["Ellbogen gestreckt, Brust offen.|Rumpf fest, Beine ruhig.","Die Schultern zu den Ohren sinken lassen.","Elbows locked, chest open.|Core braced, legs still.","Letting your shoulders sink to your ears."],
  "hanging-knee-raise":["Schultern aktiv, Becken oben leicht einrollen.|Oberkörper ruhig.","Mit Schwung aus dem Rücken arbeiten.","Active shoulders, tuck your pelvis at the top.|Upper body still.","Swinging from your back."],
  "hanging-leg-raise":["Beine zusammen, Knie gestreckt.|Kein Schwung.","Die Beine fallen lassen.","Legs together, knees straight.|No swinging.","Dropping your legs."],
  "hanging-l-sit":["Schultern aktiv, Beine zusammen.|Zehen gestreckt.","Knie beugen, wenn es schwer wird – lieber kürzer halten.","Active shoulders, legs together.|Toes pointed.","Bending your knees when it gets hard – hold shorter instead."],
  "l-sit":["Arme gestreckt, Schultern tief.|Beine zusammen (leichter: Knie angewinkelt).","Mit rundem Rücken zusammensacken.","Arms straight, shoulders down.|Legs together (easier: knees bent).","Slumping with a rounded back."],
  "windshield-wipers":["Schultern aktiv, Oberkörper ruhig.|Bewegung aus der Körpermitte.","Die Beine von Seite zu Seite schleudern.","Active shoulders, steady upper body.|Move from your core.","Flinging your legs side to side."],
  "muscle-ups":["Stange nah am Körper halten.|Erst sichere Klimmzüge und Dips beherrschen.","Mit einem Arm zuerst hochkommen.","Keep the bar close to your body.|Master solid pull-ups and dips first.","Getting one arm over first."],
  "burpee-pull-ups":["Im Stütz eine Linie von Kopf bis Ferse.|An der Stange Schultern aktiv, Kinn über die Stange.|Weich landen, Knie leicht gebeugt.","Aus dem Sprung unkontrolliert in die Stange schwingen.","In the plank, one line from head to heels.|On the bar, active shoulders, chin over the bar.|Land softly with slightly bent knees.","Swinging into the bar out of the jump."],
  "monkey-bar-traverse":["Schultern aktiv, Rumpf fest.|Ruhig und kontrolliert greifen.","Unkontrolliert schwingen.","Active shoulders, core braced.|Reach calmly and with control.","Swinging uncontrolled."],
  "skin-the-cat":["Langsam, ohne Schwung.|Schultern aktiv halten.","In die Endposition fallen lassen.","Slowly, no momentum.|Keep your shoulders active.","Dropping into the end position."],
  "archer-push-ups":["Körper eine Linie.|Ellbogen des Arbeitsarms nah am Körper.","Die Hüfte verdrehen.","Body in one line.|Working elbow close to your body.","Twisting your hips."],
  "pistol-squats":["Standknie in Fußrichtung, Ferse unten.|Rücken lang.","Das Knie nach innen fallen lassen.","Standing knee over your toes, heel down.|Long back.","Letting the knee cave in."],
  "dragon-flags":["Körper von Schulter bis Fuß gerade.|Unterer Rücken fest, kein Hohlkreuz.","In der Hüfte abknicken.","Body straight from shoulders to feet.|Lower back braced, no arching.","Bending at the hips."],
  "clap-push-ups":["Rumpf fest, Körper gerade.|Weich abfangen.","Mit gestreckten Armen hart landen.","Core tight, body straight.|Catch yourself softly.","Landing hard on locked arms."],
  "tuck-jumps":["Oberkörper aufrecht.|Knie folgen bei der Landung der Fußrichtung.","Steifbeinig landen.","Upper body upright.|Knees track your toes on landing.","Landing stiff-legged."],
  "close-grip-push-ups":["Körper gerade, Blick knapp vor die Hände.|Schultern weg von den Ohren.","Die Hüfte durchhängen lassen.","Body straight, eyes just ahead of your hands.|Shoulders away from your ears.","Letting your hips sag."],
  "diamond-push-ups":["Linie von Kopf bis Ferse, Gesäß fest.|Ellbogen zeigen nach hinten.","Die Ellbogen seitlich ausstellen.","One line from head to heels, glutes tight.|Elbows point back.","Flaring your elbows out."],
  "sphinx-push-ups":["Körper eine Linie, Hüfte ruhig.|Ellbogen zeigen nach hinten.","Mit der Hüfte hochschieben, um nachzuhelfen.","Body in one line, hips still.|Elbows point back.","Piking your hips up to help."],
  "triceps-curls":["Ellbogen zeigen nach vorn oben, eng am Kopf.|Rippen unten, kein Hohlkreuz.","Die Ellbogen weit nach außen öffnen.","Elbows point forward and up, close to your head.|Ribs down, no arched back.","Letting your elbows flare wide."],
  "arm-circles":["Schultern tief, Arme gestreckt.|Rumpf fest, kein Hohlkreuz.","Die Schultern zu den Ohren ziehen.","Shoulders down, arms straight.|Core braced, no arched back.","Shrugging your shoulders up."],
  "neck-stretch":["Die gegenüberliegende Schulter nach unten sinken lassen.|Blick nach vorn, nicht drehen.","Ruckartig am Kopf ziehen.","Let the opposite shoulder sink down.|Look forward, don't rotate.","Yanking on your head."],
  "shoulder-stretch":["Schulter tief, nicht hochziehen.|Der Oberkörper bleibt gerade.","Den Oberkörper mitdrehen.","Keep the shoulder down, don't shrug.|Torso stays square.","Rotating your torso with it."],
  "triceps-stretch":["Kopf aufrecht, nicht nach vorn drücken lassen.|Rippen unten.","Ins Hohlkreuz ausweichen.","Head upright, don't let it get pushed forward.|Ribs down.","Arching your lower back."],
  "biceps-stretch":["Schulter tief und zurück.|Ellbogen gestreckt, aber nicht durchgedrückt.","Die Schulter nach vorn rollen lassen.","Shoulder down and back.|Elbow straight but not locked.","Letting your shoulder roll forward."],
  "chest-stretch":["Ellbogen nicht höher als die Schulter.|Rumpf aufrecht, Schulter tief.","Ins Hohlkreuz fallen.","Elbow no higher than your shoulder.|Upright torso, shoulder down.","Sagging into an arched back."],
  "wrist-stretch":["Ellbogen gestreckt, Schulter locker.|Nur sanft ziehen.","Mit Kraft in den Schmerz ziehen.","Elbow straight, shoulder relaxed.|Pull gently only.","Forcing it into pain."],
  "side-bend":["Beide Füße fest am Boden.|Seitlich neigen, nicht nach vorn kippen.","Die Hüfte weit zur Seite schieben.","Both feet firmly down.|Lean sideways, don't tip forward.","Pushing your hips far out to the side."],
  "cat-cow":["Bewegung Wirbel für Wirbel.|Die Arme bleiben gestreckt.","Den Kopf in den Nacken werfen.","Move one vertebra at a time.|Arms stay straight.","Throwing your head back."],
  "childs-pose":["Schultern locker, Nacken lang.|Die Knie gern etwas breiter.","Mit Gewalt tiefer drücken.","Relaxed shoulders, long neck.|Knees can be a bit wider.","Forcing yourself lower."],
  "sphinx-stretch":["Schultern weg von den Ohren.|Becken und Beine bleiben locker am Boden.","Den Nacken überstrecken.","Shoulders away from your ears.|Pelvis and legs stay relaxed on the floor.","Overextending your neck."],
  "downward-dog":["Rücken lang geht vor Beine gestreckt.|Kopf zwischen den Armen, Nacken locker.","Den Rücken rund machen, nur um die Fersen abzusetzen.","Long back before straight legs.|Head between your arms, neck relaxed.","Rounding your back just to get your heels down."],
  "spinal-twist":["Beide Schultern bleiben am Boden.|Nur so weit drehen, wie es angenehm ist.","Die Knie mit Gewalt zum Boden drücken.","Both shoulders stay down.|Only twist as far as feels good.","Forcing your knees to the floor."],
  "forward-fold":["Nacken und Arme locker hängen lassen.|Gewicht über der Fußmitte.","Mit gestreckten Knien nach unten federn.","Let your neck and arms hang loose.|Weight over the middle of your feet.","Bouncing down with locked knees."],
  "hip-flexor-stretch":["Oberkörper aufrecht, Gesäß der hinteren Seite anspannen.|Vorderes Knie über dem Fuß.","Ins Hohlkreuz ausweichen.","Upright torso, squeeze the glute of the back leg.|Front knee over your foot.","Arching your lower back instead."],
  "quad-stretch":["Knie zeigen nach unten und bleiben nah beieinander.|Becken leicht einrollen, aufrecht bleiben.","Das Knie nach vorn oder außen wandern lassen.","Knees point down and stay close together.|Tuck your pelvis slightly and stay tall.","Letting the knee drift forward or out."],
  "hamstring-stretch":["Brust nach vorn, nicht Kopf zu den Knien.|Die Knie dürfen leicht gebeugt sein.","Mit rundem Rücken nach vorn ziehen.","Chest forward, not head to knees.|Knees may be slightly bent.","Pulling forward with a rounded back."],
  "calf-stretch":["Hinteres Bein gestreckt, Fuß zeigt nach vorn.|Körper in einer Linie von Ferse bis Kopf.","Die hintere Ferse abheben.","Back leg straight, foot pointing forward.|Body in one line from heel to head.","Lifting the back heel."],
  "figure-four":["Kopf und Schultern bleiben am Boden.|Knie der gekreuzten Seite sanft nach außen.","Den Kopf anheben und den Nacken anspannen.","Head and shoulders stay down.|Ease the crossed knee outward.","Lifting your head and straining your neck."],
  "pigeon-stretch":["Hüfte gerade nach vorn ausrichten.|Bei Knieschmerz das Schienbein näher zum Körper nehmen oder Figur 4 wählen.","Auf die Seite der vorderen Hüfte kippen.","Keep your hips square to the front.|If your knee hurts, bring the shin closer or use Figure-Four.","Tipping onto the front hip."],
  "butterfly-stretch":["Rücken lang, Brust offen.|Die Knie nur sinken lassen, nicht drücken.","Mit den Ellbogen auf die Knie drücken.","Long back, open chest.|Let the knees sink, don't push them.","Pressing your knees down with your elbows."],
  "worlds-greatest":["Hinteres Bein lang, Hüfte tief.|Drehung aus dem Brustkorb, nicht aus dem unteren Rücken.","Das vordere Knie nach innen fallen lassen.","Back leg long, hips low.|Rotate through your chest, not your lower back.","Letting the front knee cave in."]
});

/* Muskeln je Übung: [Hauptmuskeln DE, unterstützend DE, Hauptmuskeln EN, unterstützend EN].
   Bei Dehnübungen: was gedehnt wird. Grundlage: gängige Übungsbeschreibungen (u. a. ACE-Übungsbibliothek);
   Beinheben z. B. vor allem Hüftbeuger, der Bauch stabilisiert. */
var EX_MUSCLES = {
  "glute-machine":["Großer Gesäßmuskel","Oberschenkel hinten, Rumpf","Glutes","Hamstrings, core"],
  "calf-press":["Waden","Fußmuskulatur","Calves","Foot muscles"],
  "lying-leg-curl":["Oberschenkel hinten","Waden","Hamstrings","Calves"],
  "rotary-torso":["Schräge Bauchmuskeln","Gerader Bauchmuskel, unterer Rücken","Obliques","Rectus abdominis, lower back"],
  "back-extension-machine":["Rückenstrecker","Gesäß, Oberschenkel hinten","Spinal erectors","Glutes, hamstrings"],
  "triceps-extension-machine":["Trizeps","Unterarme","Triceps","Forearms"],
  "lateral-raise-machine":["Seitliche Schulter","Trapez","Side delts","Traps"],
  "cable-lateral-raise":["Seitliche Schulter","Trapez, Rumpf","Side delts","Traps, core"],
  "smith-bench-press":["Brust","Trizeps, vordere Schulter","Chest","Triceps, front delts"],
  "assisted-dip":["Trizeps, Brust","Vordere Schulter","Triceps, chest","Front delts"],
  "high-row-machine":["Latissimus, oberer Rücken","Bizeps, hintere Schulter","Lats, upper back","Biceps, rear delts"],
  "cable-crunch":["Gerader Bauch","Schräge Bauchmuskeln","Abs","Obliques"],
  "cable-pull-through":["Großer Gesäßmuskel","Oberschenkel hinten, unterer Rücken","Glutes","Hamstrings, lower back"],
  "rung-pull-ups":["Breiter Rückenmuskel, Bizeps","Oberarmmuskel, Unterarme (Griff), Rumpf","Lats, biceps","Brachialis, forearms (grip), core"],
  "hack-squat":["Oberschenkel vorn, Gesäß", "Adduktoren, Waden", "Quads, glutes", "Adductors, calves"],
  "smith-squat":["Oberschenkel vorn, Gesäß", "Oberschenkel hinten, Rumpf", "Quads, glutes", "Hamstrings, core"],
  "leg-press-single":["Oberschenkel vorn, Gesäß", "Hüftstabilisatoren", "Quads, glutes", "Hip stabilisers"],
  "hip-thrust":["Gesäß", "Oberschenkel hinten, Adduktoren", "Glutes", "Hamstrings, adductors"],
  "glute-kickback-cable":["Gesäß", "Oberschenkel hinten", "Glutes", "Hamstrings"],
  "seated-calf":["Waden (Schollenmuskel)", "Fußmuskulatur", "Calves (soleus)", "Foot muscles"],
  "incline-chest-press":["Obere Brust, Trizeps", "Vordere Schulter", "Upper chest, triceps", "Front delts"],
  "cable-crossover":["Brust", "Vordere Schulter", "Chest", "Front delts"],
  "incline-db-press":["Obere Brust, Trizeps", "Vordere Schulter", "Upper chest, triceps", "Front delts"],
  "db-fly":["Brust", "Vordere Schulter", "Chest", "Front delts"],
  "assisted-pullup":["Breiter Rückenmuskel, Bizeps", "Oberer Rücken, Unterarme", "Lats, biceps", "Upper back, forearms"],
  "close-grip-pulldown":["Breiter Rückenmuskel, Bizeps", "Mittlerer Rücken", "Lats, biceps", "Mid back"],
  "t-bar-row":["Oberer Rücken, breiter Rückenmuskel", "Bizeps, Rückenstrecker", "Upper back, lats", "Biceps, lower back"],
  "barbell-row":["Oberer Rücken, breiter Rückenmuskel", "Bizeps, Rückenstrecker", "Upper back, lats", "Biceps, lower back"],
  "face-pull":["Hintere Schulter, oberer Rücken", "Rotatorenmanschette, Trapez", "Rear delts, upper back", "Rotator cuff, traps"],
  "straight-arm-pulldown":["Breiter Rückenmuskel", "Trizeps (langer Kopf), Rumpf", "Lats", "Triceps (long head), core"],
  "lateral-raise":["Seitliche Schulter", "Trapez", "Side delts", "Traps"],
  "shrugs":["Oberer Trapez", "Unterarme", "Upper traps", "Forearms"],
  "hammer-curl":["Bizeps, Oberarmmuskel", "Unterarme", "Biceps, brachialis", "Forearms"],
  "barbell-curl":["Bizeps", "Unterarme", "Biceps", "Forearms"],
  "overhead-cable-triceps":["Trizeps (langer Kopf)", "Rumpf", "Triceps (long head)", "Core"],
  "triceps-machine":["Trizeps", "Brust, vordere Schulter", "Triceps", "Chest, front delts"],
  "cable-woodchop":["Schräge Bauchmuskeln", "Gerader Bauch, Schultern", "Obliques", "Abs, shoulders"],
  "captains-chair":["Gerader Bauch, Hüftbeuger", "Schräge Bauchmuskeln", "Abs, hip flexors", "Obliques"],
  "barbell-overhead-press":["Schultern, Trizeps", "Oberer Trapez, Rumpf", "Shoulders, triceps", "Upper traps, core"],
  "barbell-rdl":["Oberschenkel hinten, Gesäß", "Rückenstrecker, Unterarme", "Hamstrings, glutes", "Lower back, forearms"],
  "leg-press":["Oberschenkel vorn, Gesäß", "Oberschenkel hinten, Waden", "Quads, glutes", "Hamstrings, calves"],
  "leg-press-45":["Oberschenkel vorn, Gesäß", "Oberschenkel hinten, Adduktoren", "Quads, glutes", "Hamstrings, adductors"],
  "leg-extension":["Oberschenkel vorn", "–", "Quads", "–"],
  "leg-curl":["Oberschenkel hinten", "Waden", "Hamstrings", "Calves"],
  "adductor-machine":["Adduktoren (Innenschenkel)", "Gesäß", "Adductors (inner thighs)", "Glutes"],
  "abductor-machine":["Seitliches Gesäß (Abduktoren)", "Hüftstabilisatoren", "Side glutes (abductors)", "Hip stabilisers"],
  "calf-machine":["Waden", "Fußmuskulatur", "Calves", "Foot muscles"],
  "chest-press-machine":["Brust, Trizeps", "Vordere Schulter", "Chest, triceps", "Front delts"],
  "butterfly":["Brust", "Vordere Schulter", "Chest", "Front delts"],
  "pullover":["Breiter Rückenmuskel, Brust", "Trizeps, Rumpf", "Lats, chest", "Triceps, core"],
  "lat-pulldown":["Breiter Rückenmuskel, Bizeps", "Oberer Rücken, hintere Schulter", "Lats, biceps", "Upper back, rear delts"],
  "row-machine":["Oberer Rücken, breiter Rückenmuskel", "Bizeps, hintere Schulter", "Upper back, lats", "Biceps, rear delts"],
  "cable-row":["Oberer Rücken, breiter Rückenmuskel", "Bizeps, Rückenstrecker", "Upper back, lats", "Biceps, lower back"],
  "reverse-butterfly":["Hintere Schulter, oberer Rücken", "Rautenmuskeln, Trapez", "Rear delts, upper back", "Rhomboids, traps"],
  "back-extension":["Rückenstrecker", "Gesäß, Oberschenkel hinten", "Lower back", "Glutes, hamstrings"],
  "shoulder-press-machine":["Schultern, Trizeps", "Oberer Trapez", "Shoulders, triceps", "Upper traps"],
  "biceps-machine":["Bizeps", "Unterarme", "Biceps", "Forearms"],
  "cable-curl":["Bizeps", "Unterarme", "Biceps", "Forearms"],
  "triceps-pushdown":["Trizeps", "Unterarme", "Triceps", "Forearms"],
  "skull-crusher":["Trizeps", "Unterarme", "Triceps", "Forearms"],
  "ab-crunch-machine":["Gerader Bauch", "Schräge Bauchmuskeln", "Abs", "Obliques"],
  "bench-press":["Brust, Trizeps", "Vordere Schulter", "Chest, triceps", "Front delts"],
  "barbell-squat":["Oberschenkel vorn, Gesäß", "Oberschenkel hinten, Rumpf, Rückenstrecker", "Quads, glutes", "Hamstrings, core, lower back"],
  "barbell-deadlift":["Gesäß, Oberschenkel hinten, Rückenstrecker", "Oberer Rücken, Unterarme, Rumpf", "Glutes, hamstrings, lower back", "Upper back, forearms, core"],
  "jump-lunges":["Oberschenkel vorn, Gesäß","Oberschenkel hinten, Waden, Rumpf, Ausdauer","Quads, glutes","Hamstrings, calves, core, endurance"],
  "reverse-crunch":["Gerader Bauch (unterer Anteil)","Hüftbeuger, schräge Bauchmuskeln","Abs (lower part)","Hip flexors, obliques"],
  "chin-ups":["Bizeps, breiter Rückenmuskel","Oberer Rücken, Unterarme","Biceps, lats","Upper back, forearms"],
  "commando-pull-ups":["Breiter Rückenmuskel, Bizeps","Rumpf, Unterarme (Griff)","Lats, biceps","Core, forearms (grip)"],
  "parallel-bar-dips":["Trizeps, Brust","Vordere Schulter","Triceps, chest","Front delts"],
  "support-hold":["Schulterstabilität, Trizeps","Rumpf","Shoulder stability, triceps","Core"],
  "hanging-knee-raise":["Hüftbeuger, gerader Bauch","Unterarme (Griff), Schultern","Hip flexors, abs","Forearms (grip), shoulders"],
  "hanging-leg-raise":["Hüftbeuger, gerader Bauch","Unterarme (Griff), Schultern","Hip flexors, abs","Forearms (grip), shoulders"],
  "hanging-l-sit":["Gerader Bauch, Hüftbeuger","Unterarme (Griff), Oberschenkel vorn","Abs, hip flexors","Forearms (grip), quads"],
  "l-sit":["Gerader Bauch, Hüftbeuger, Trizeps","Schultern, Oberschenkel vorn","Abs, hip flexors, triceps","Shoulders, quads"],
  "windshield-wipers":["Schräge Bauchmuskeln, Rumpf","Hüftbeuger, Unterarme (Griff)","Obliques, core","Hip flexors, forearms (grip)"],
  "muscle-ups":["Breiter Rückenmuskel, Brust, Trizeps","Schultern, Bizeps, Rumpf","Lats, chest, triceps","Shoulders, biceps, core"],
  "burpee-pull-ups":["Breiter Rückenmuskel, Brust, Oberschenkel vorn","Bizeps, Trizeps, Rumpf, Ausdauer","Lats, chest, quads","Biceps, triceps, core, endurance"],
  "monkey-bar-traverse":["Unterarme (Griff), breiter Rückenmuskel","Schultern, Rumpf","Forearms (grip), lats","Shoulders, core"],
  "skin-the-cat":["Schultern, Rücken, Rumpf","Schulterbeweglichkeit, Unterarme","Shoulders, back, core","Shoulder mobility, forearms"],
  "archer-push-ups":["Brust, Trizeps (Arbeitsarm)","Schultern, Rumpf","Chest, triceps (working arm)","Shoulders, core"],
  "pistol-squats":["Oberschenkel vorn, Gesäß","Seitliches Gesäß, Rumpf, Gleichgewicht","Quads, glutes","Side glutes, core, balance"],
  "dragon-flags":["Gerader Bauch, tiefe Bauchmuskeln","Hüftbeuger, breiter Rückenmuskel","Abs, deep core","Hip flexors, lats"],
  "clap-push-ups":["Brust, Trizeps, Schultern (Schnellkraft)","Rumpf","Chest, triceps, shoulders (power)","Core"],
  "tuck-jumps":["Oberschenkel vorn, Gesäß, Waden","Hüftbeuger, Rumpf, Ausdauer","Quads, glutes, calves","Hip flexors, core, endurance"],
  "burpees":["Oberschenkel vorn, Gesäß, Brust","Schultern, Trizeps, Rumpf, Ausdauer","Quads, glutes, chest","Shoulders, triceps, core, endurance"],
  "jump-squats":["Oberschenkel vorn, Gesäß, Waden","Oberschenkel hinten, Rumpf","Quads, glutes, calves","Hamstrings, core"],
  "mountain-climbers":["Rumpf, Hüftbeuger, Schultern","Oberschenkel vorn, Ausdauer","Core, hip flexors, shoulders","Quads, endurance"],
  "high-knees":["Hüftbeuger, Oberschenkel vorn, Waden","Gesäß, Rumpf, Ausdauer","Hip flexors, quads, calves","Glutes, core, endurance"],
  "jumping-jacks":["Waden, seitliches Gesäß, Schultern","Adduktoren, Ausdauer","Calves, side glutes, shoulders","Adductors, endurance"],
  "skater-jumps":["Seitliches Gesäß, Oberschenkel vorn","Adduktoren, Waden, Rumpf","Side glutes, quads","Adductors, calves, core"],
  "plank-burpees":["Oberschenkel vorn, Rumpf","Schultern, Gesäß, Ausdauer","Quads, core","Shoulders, glutes, endurance"],
  "jump-forward-squats":["Oberschenkel vorn, Gesäß, Waden","Oberschenkel hinten, Rumpf, Schultern (Armschwung)","Quads, glutes, calves","Hamstrings, core, shoulders (arm swing)"],
  "jump-forward-burpees":["Oberschenkel vorn, Gesäß, Brust","Waden, Schultern, Trizeps, Rumpf, Ausdauer","Quads, glutes, chest","Calves, shoulders, triceps, core, endurance"],
  "burpee-squat-jumps":["Oberschenkel vorn, Gesäß, Waden","Brust, Schultern, Rumpf, Ausdauer","Quads, glutes, calves","Chest, shoulders, core, endurance"],
  "frogs":["Oberschenkel vorn, Gesäß, Adduktoren","Waden, Rumpf, Ausdauer","Quads, glutes, adductors","Calves, core, endurance"],
  "stand-up-jumps":["Oberschenkel vorn, Gesäß, Rumpf","Hüftbeuger, Waden, Ausdauer","Quads, glutes, core","Hip flexors, calves, endurance"],
  "lateral-hops":["Waden, seitliches Gesäß","Oberschenkel vorn, Fußgelenke, Rumpf","Calves, side glutes","Quads, ankles, core"],
  "fast-feet":["Waden, Oberschenkel vorn","Hüftbeuger, Ausdauer","Calves, quads","Hip flexors, endurance"],
  "box-step-ups":["Oberschenkel vorn, Gesäß","Oberschenkel hinten, Waden, Ausdauer","Quads, glutes","Hamstrings, calves, endurance"],
  "sprint-in-place":["Hüftbeuger, Oberschenkel vorn, Waden","Gesäß, Ausdauer","Hip flexors, quads, calves","Glutes, endurance"],

  "goblet-squat":["Oberschenkel vorn, Gesäß","Adduktoren, Rumpf, oberer Rücken","Quads, glutes","Adductors, core, upper back"],
  "kb-swing":["Gesäß, Oberschenkel hinten","Rückenstrecker, Rumpf, Schultern, Ausdauer","Glutes, hamstrings","Lower back, core, shoulders, endurance"],
  "db-thruster":["Oberschenkel vorn, Gesäß, Schultern","Trizeps, Rumpf","Quads, glutes, shoulders","Triceps, core"],
  "romanian-deadlift":["Oberschenkel hinten, Gesäß","Rückenstrecker, Unterarme","Hamstrings, glutes","Lower back, forearms"],
  "db-deadlift":["Gesäß, Oberschenkel vorn und hinten","Rückenstrecker, oberer Rücken, Unterarme","Glutes, quads, hamstrings","Lower back, upper back, forearms"],
  "bent-over-row":["Breiter Rückenmuskel, oberer Rücken","Bizeps, hintere Schulter, Rückenstrecker","Lats, upper back","Biceps, rear delts, lower back"],
  "one-arm-row":["Breiter Rückenmuskel, oberer Rücken","Bizeps, hintere Schulter, Rumpf","Lats, upper back","Biceps, rear delts, core"],
  "floor-press":["Brust, Trizeps","Vordere Schulter","Chest, triceps","Front delts"],
  "shoulder-press":["Schultern, Trizeps","Oberer Trapez, Rumpf","Shoulders, triceps","Upper traps, core"],
  "push-press":["Schultern, Trizeps","Oberschenkel vorn, Gesäß, Rumpf","Shoulders, triceps","Quads, glutes, core"],
  "weighted-reverse-lunge":["Oberschenkel vorn, Gesäß","Oberschenkel hinten, Adduktoren, Rumpf","Quads, glutes","Hamstrings, adductors, core"],
  "front-rack-carry":["Rumpf, oberer Rücken","Schultern, Bizeps, Beine","Core, upper back","Shoulders, biceps, legs"],
  "farmer-carry":["Unterarme (Griff), Trapez, Rumpf","Schultern, seitliches Gesäß, Beine","Forearms (grip), traps, core","Shoulders, side glutes, legs"],
  "kb-clean":["Gesäß, Oberschenkel hinten, Schultern","Oberer Rücken, Rumpf, Unterarme","Glutes, hamstrings, shoulders","Upper back, core, forearms"],
  "renegade-row":["Breiter Rückenmuskel, Rumpf","Schultern, Brust, Trizeps, schräge Bauchmuskeln","Lats, core","Shoulders, chest, triceps, obliques"],

  "push-ups":["Brust, Trizeps, vordere Schulter","Rumpf, Sägemuskel","Chest, triceps, front delts","Core, serratus"],
  "pike-push-ups":["Schultern, Trizeps","Obere Brust, Rumpf","Shoulders, triceps","Upper chest, core"],
  "triceps-dips":["Trizeps","Vordere Schulter, Brust","Triceps","Front delts, chest"],
  "squat-hold":["Oberschenkel vorn, Gesäß","Rumpf, Waden","Quads, glutes","Core, calves"],
  "walking-lunges":["Oberschenkel vorn, Gesäß","Oberschenkel hinten, Waden, Rumpf","Quads, glutes","Hamstrings, calves, core"],
  "reverse-lunges":["Oberschenkel vorn, Gesäß","Oberschenkel hinten, Rumpf","Quads, glutes","Hamstrings, core"],
  "side-lunges":["Gesäß, Oberschenkel vorn, Adduktoren","Oberschenkel hinten","Glutes, quads, adductors","Hamstrings"],
  "cossack-squats":["Adduktoren, Gesäß, Oberschenkel vorn","Seitliches Gesäß, Oberschenkel hinten, Beweglichkeit","Adductors, glutes, quads","Side glutes, hamstrings, mobility"],
  "deep-squats":["Oberschenkel vorn, Gesäß","Adduktoren, Waden, Beweglichkeit","Quads, glutes","Adductors, calves, mobility"],
  "pistol-assist":["Oberschenkel vorn, Gesäß","Seitliches Gesäß, Rumpf, Gleichgewicht","Quads, glutes","Side glutes, core, balance"],
  "plank-steps":["Trizeps, Schultern, Rumpf","Brust","Triceps, shoulders, core","Chest"],
  "bear-crawl":["Schultern, Rumpf, Oberschenkel vorn","Hüftbeuger, Trizeps, Sägemuskel","Shoulders, core, quads","Hip flexors, triceps, serratus"],
  "wall-sit":["Oberschenkel vorn","Gesäß, Waden","Quads","Glutes, calves"],
  "calf-raises":["Waden","Fußmuskulatur, Fußgelenke","Calves","Foot muscles, ankles"],
  "glute-bridge":["Gesäß","Oberschenkel hinten, Rückenstrecker, Rumpf","Glutes","Hamstrings, lower back, core"],

  "pull-ups":["Breiter Rückenmuskel, Bizeps","Oberer Rücken, Unterarme, Rumpf","Lats, biceps","Upper back, forearms, core"],
  "negative-pull-ups":["Breiter Rückenmuskel, Bizeps","Oberer Rücken, Unterarme","Lats, biceps","Upper back, forearms"],
  "inverted-rows":["Oberer Rücken, breiter Rückenmuskel","Bizeps, hintere Schulter, Rumpf","Upper back, lats","Biceps, rear delts, core"],
  "superman-hold":["Rückenstrecker, Gesäß","Oberer Rücken, hintere Schulter, Oberschenkel hinten","Lower back, glutes","Upper back, rear delts, hamstrings"],
  "reverse-snow-angels":["Oberer Rücken, hintere Schulter","Unterer Trapez, Rückenstrecker","Upper back, rear delts","Lower traps, lower back"],
  "bird-dog":["Rückenstrecker, Gesäß, tiefe Bauchmuskeln","Schultern, Oberschenkel hinten","Lower back, glutes, deep core","Shoulders, hamstrings"],
  "prone-y-raise":["Unterer Trapez, hintere Schulter","Oberer Rücken, Rückenstrecker","Lower traps, rear delts","Upper back, lower back"],
  "prone-t-raise":["Mittlerer Trapez, Rautenmuskeln, hintere Schulter","Rückenstrecker","Mid traps, rhomboids, rear delts","Lower back"],
  "good-mornings":["Oberschenkel hinten, Gesäß, Rückenstrecker","Rumpf","Hamstrings, glutes, lower back","Core"],
  "swimmers":["Rückenstrecker, Gesäß, Schultern","Oberer Rücken, Oberschenkel hinten","Lower back, glutes, shoulders","Upper back, hamstrings"],
  "cobra-lift":["Bauch, Hüftbeuger, Brust","Rückenstrecker, Streckung der Wirbelsäule","Abs, hip flexors, chest","Lower back, spinal extension"],
  "scapular-push-ups":["Sägemuskel, Schulterblattmuskeln","Rumpf","Serratus, shoulder blade muscles","Core"],
  "scapular-pull-ups":["Breiter Rückenmuskel, unterer Trapez","Rautenmuskeln, Unterarme (Griff)","Lats, lower traps","Rhomboids, forearms (grip)"],
  "dead-hang":["Unterarme (Griff), breiter Rückenmuskel","Schultern, Rumpf","Forearms (grip), lats","Shoulders, core"],

  "air-squats":["Oberschenkel vorn, Gesäß","Adduktoren, Oberschenkel hinten, Rumpf","Quads, glutes","Adductors, hamstrings, core"],
  "split-squats":["Oberschenkel vorn, Gesäß","Adduktoren, Rumpf","Quads, glutes","Adductors, core"],
  "bulgarian-split-squats":["Oberschenkel vorn, Gesäß","Adduktoren, Rumpf, Hüftbeuger des hinteren Beins (Dehnung)","Quads, glutes","Adductors, core, back-leg hip flexor (stretch)"],
  "forward-lunges":["Oberschenkel vorn, Gesäß","Oberschenkel hinten, Waden","Quads, glutes","Hamstrings, calves"],
  "single-leg-glute-bridge":["Gesäß, Oberschenkel hinten","Seitliches Gesäß, Rumpf","Glutes, hamstrings","Side glutes, core"],
  "lateral-lunge-pulses":["Gesäß, Oberschenkel vorn, Adduktoren","Rumpf","Glutes, quads, adductors","Core"],

  "plank":["Tiefe Bauchmuskeln, gerader Bauch","Schultern, Gesäß, Rückenstrecker","Deep core, abs","Shoulders, glutes, lower back"],
  "side-plank":["Schräge Bauchmuskeln, seitliches Gesäß","Schultern, tiefe Bauchmuskeln","Obliques, side glutes","Shoulders, deep core"],
  "dead-bug":["Tiefe Bauchmuskeln, gerader Bauch","Hüftbeuger, Schultern","Deep core, abs","Hip flexors, shoulders"],
  "bicycle-crunches":["Schräge Bauchmuskeln, gerader Bauch","Hüftbeuger","Obliques, abs","Hip flexors"],
  "leg-raises":["Hüftbeuger, gerader Bauch (stabilisiert)","Tiefe Bauchmuskeln, schräge Bauchmuskeln","Hip flexors, abs (stabilising)","Deep core, obliques"],
  "jackknives":["Gerader Bauch, Hüftbeuger","Schultern, Oberschenkel vorn","Abs, hip flexors","Shoulders, quads"],
  "side-jackknives":["Schräge Bauchmuskeln","Seitliches Gesäß, Hüftbeuger","Obliques","Side glutes, hip flexors"],
  "hollow-hold":["Gerader Bauch, tiefe Bauchmuskeln","Hüftbeuger, Oberschenkel vorn","Abs, deep core","Hip flexors, quads"],
  "russian-twists":["Schräge Bauchmuskeln","Gerader Bauch, Hüftbeuger","Obliques","Abs, hip flexors"],
  "sit-ups":["Gerader Bauch, Hüftbeuger","Schräge Bauchmuskeln","Abs, hip flexors","Obliques"],
  "toe-touches":["Gerader Bauch","Schultern, Hüftbeuger (Haltearbeit)","Abs","Shoulders, hip flexors (holding)"],
  "plank-shoulder-taps":["Tiefe und schräge Bauchmuskeln, Schultern","Gesäß, Brust","Deep core, obliques, shoulders","Glutes, chest"],
  "toes-to-bar":["Hüftbeuger, gerader Bauch","Breiter Rückenmuskel, Unterarme (Griff)","Hip flexors, abs","Lats, forearms (grip)"],

  "close-grip-push-ups":["Trizeps, Brust","Vordere Schulter, Rumpf","Triceps, chest","Front delts, core"],
  "diamond-push-ups":["Trizeps, Brust","Vordere Schulter, Rumpf","Triceps, chest","Front delts, core"],
  "sphinx-push-ups":["Trizeps","Schultern, Rumpf","Triceps","Shoulders, core"],
  "triceps-curls":["Trizeps","Schultern, Rumpf","Triceps","Shoulders, core"],
  "arm-circles":["Seitliche und hintere Schulter","Oberer Rücken, Trapez","Side and rear delts","Upper back, traps"],

  "neck-stretch":["Seitliche Nackenmuskeln, oberer Trapez","","Side neck muscles, upper traps",""],
  "shoulder-stretch":["Hintere Schulter, oberer Rücken","","Rear delts, upper back",""],
  "triceps-stretch":["Trizeps","Breiter Rückenmuskel","Triceps","Lats"],
  "biceps-stretch":["Bizeps, vordere Schulter","Brust","Biceps, front delts","Chest"],
  "chest-stretch":["Brust, vordere Schulter","Bizeps","Chest, front delts","Biceps"],
  "wrist-stretch":["Unterarmbeuger und -strecker","","Wrist flexors and extensors",""],
  "side-bend":["Schräge Bauchmuskeln, breiter Rückenmuskel","Seitlicher unterer Rücken","Obliques, lats","Side of lower back"],
  "cat-cow":["Beweglichkeit der Wirbelsäule, Rückenstrecker","Bauch, Nacken","Spinal mobility, lower back","Abs, neck"],
  "childs-pose":["Unterer Rücken, breiter Rückenmuskel","Gesäß, Schultern","Lower back, lats","Glutes, shoulders"],
  "sphinx-stretch":["Bauch, Hüftbeuger","Streckung der Wirbelsäule","Abs, hip flexors","Spinal extension"],
  "downward-dog":["Waden, Oberschenkel hinten","Schultern, breiter Rückenmuskel","Calves, hamstrings","Shoulders, lats"],
  "spinal-twist":["Schräge Bauchmuskeln, unterer Rücken","Gesäß, Brust","Obliques, lower back","Glutes, chest"],
  "forward-fold":["Oberschenkel hinten, unterer Rücken","Waden","Hamstrings, lower back","Calves"],
  "hip-flexor-stretch":["Hüftbeuger, Oberschenkel vorn","","Hip flexors, quads",""],
  "quad-stretch":["Oberschenkel vorn, Hüftbeuger","","Quads, hip flexors",""],
  "hamstring-stretch":["Oberschenkel hinten","Waden, unterer Rücken","Hamstrings","Calves, lower back"],
  "calf-stretch":["Waden","Achillessehne","Calves","Achilles tendon"],
  "figure-four":["Gesäß, tiefe Hüftrotatoren (Piriformis)","","Glutes, deep hip rotators (piriformis)",""],
  "pigeon-stretch":["Gesäß, tiefe Hüftrotatoren (vorderes Bein)","Hüftbeuger (hinteres Bein)","Glutes, deep hip rotators (front leg)","Hip flexors (back leg)"],
  "butterfly-stretch":["Adduktoren (Oberschenkel-Innenseite)","Hüfte","Adductors (inner thighs)","Hips"],
  "worlds-greatest":["Hüftbeuger, Oberschenkel hinten, Brustwirbelsäule","Adduktoren, Brust","Hip flexors, hamstrings, upper back","Adductors, chest"]
};
/* ============ Rep-Workouts (ohne Intervalle, auf Zeit) ============
   Alle Wiederholungen so schnell wie möglich, die Zeit läuft mit. Aufbau nach klassischen
   Bodyweight-Programmen (Runden × Übungen), mit eigenen Namen (Berge).
   [id, Name DE, Name EN, Stufe 1-3, [[Übung, [Menge je Runde ...]], ...]]
   Menge: Zahl = Wiederholungen, "400m"/"1km" = Strecke, "30s" = Sekunden (Halten und Pause laufen
   als Countdown), 0 = in dieser Runde nicht. Übung "lauf"/"sprint"/"pause" siehe REP_PSEUDO. */
/* Kachel „Aufwärmen & Dehnen“: diese Programme stehen unter Aufwärmen, alle übrigen Dehnprogramme unter Dehnen */
/* Fokus-Filter der Bibliothek: diese Workouts stehen unter „Bauch / Core“ statt unter „Arme“
   (sonst zählen die Liegestütz-Varianten sie automatisch zu den Armen) */
var LIB_FOKUS_TAUSCH = {
  "chest-bw":    { weg:"arms", dazu:"core" },
  "upper-power": { weg:"arms", dazu:"core" }
};
var AUFWAERM_IDS = ["warmup-5","warmup-ganz","warmup-kraft","warmup-hiit","stretch-morning"];
/* Übungen im Reiter „Aufwärmen · Übungen“ (Dehnen · Übungen = alle Übungen der Hauptkategorie Stretch) */
var AUFWAERM_UEBUNGEN = ["jumping-jacks","high-knees","fast-feet","air-squats","lateral-hops","skater-jumps","good-mornings","bird-dog",
  "reverse-lunges","glute-bridge","scapular-push-ups","plank-steps","arm-circles","cat-cow","worlds-greatest","downward-dog"];
/* Challenges · Einheiten: 12 Trainingseinheiten nach einem klassischen 12-Einheiten-Plan, je Stufe
   [Leicht, Standard, Fortgeschritten]. Pro Stufe eine oder mehrere Varianten („A oder B“ im Plan), jede Variante
   = Programme, die nacheinander gemacht werden. Eintrag: Programm-ID, optional ":2-4" = nur diese Runden,
   "*0.5" = halbe Wiederholungen/Strecken. */
var REP_EINHEITEN = [
  ["e1",  [["wasserkuppe-basis"],["wasserkuppe"]], [["wasserkuppe","kampenwand-basis"],["wasserkuppe","rigi"]], [["wasserkuppe","moench","jungfrau"]]],
  ["e2",  [["tegelberg"]], [["tegelberg","kampenwand","herzogstand"],["tegelberg","kampenwand-basis","herzogstand"]], [["grossglockner-basis","herzogstand","tegelberg"]]],
  ["e3",  [["zugspitze"],["belchen"],["eiger"],["nebelhorn"]], [["zugspitze","belchen"],["zugspitze","eiger"],["zugspitze","nebelhorn"]], [["belchen","eiger","zugspitze","nebelhorn"]]],
  ["e4",  [["moench"]], [["moench","tegelberg"],["moench","jungfrau-sturm"]], [["piz-palue-kraft","rigi-sprung","jungfrau-sturm"]]],
  ["e5",  [["saentis-basis"]], [["saentis","rigi:1-3"]], [["saentis","rigi"],["saentis","nebelhorn"],["matterhorn","rigi"],["matterhorn","nebelhorn"]]],
  ["e6",  [["bernina:2-4"]], [["bernina"]], [["ortler","nebelhorn","rigi-sprung"]]],
  ["e7",  [["pilatus-basis"]], [["pilatus"]], [["pilatus","herzogstand"],["pilatus","belchen"]]],
  ["e8",  [["mont-blanc-basis:1-2","jungfrau-sturm:1-1"]], [["mont-blanc-basis"]], [["mont-blanc-basis","bernina:2-3"],["mont-blanc-basis","jungfrau-sturm"]]],
  ["e9",  [["brocken-basis"]], [["brocken"]], [["brocken","kampenwand"],["brocken","rigi"]]],
  ["e10", [["matterhorn*0.5"]], [["matterhorn"]], [["watzmann"]]],
  ["e11", [["fichtelberg*0.5"]], [["fichtelberg"]], [["hochkoenig","fichtelberg:2-2"]]],
  ["e12", [["watzmann-basis"]], [["watzmann"]], [["dachstein"]]]
];
/* Namen der Einheiten (Bergwander-Thema wie die Programme), beschreiben den Charakter:
   Auf und ab = 10-25-10, Stufenweg = Leitern, Durchs Tal = 30-20-10-20-30, Hochplateau = gleichbleibend, Abstieg = 50…10 */
var REP_EINHEIT_NAMEN = {
  e1:["Aufbruch","Setting Out"], e2:["Auf und ab","Up and Down"], e3:["Stufenweg","Stepped Trail"], e4:["Durchs Tal","Through the Valley"],
  e5:["Hüttenlauf","Hut Run"], e6:["Steilwand","Steep Face"], e7:["Gratwanderung","Ridge Walk"], e8:["Hochplateau","High Plateau"],
  e9:["Abstieg","Descent"], e10:["Langer Anstieg","Long Climb"], e11:["Höhenweg","High Trail"], e12:["Gipfeltag","Summit Day"]
};
/* Varianten einer Einheit = verschiedene Routen zum selben Ziel */
var REP_ROUTEN = [["Nordroute","North Route"], ["Südroute","South Route"], ["Westroute","West Route"], ["Ostroute","East Route"]];
var REP_PSEUDO = {
  lauf:   { de:"Laufen", en:"Run",    illu:"sprint-in-place" },
  sprint: { de:"Sprint", en:"Sprint", illu:"sprint-in-place" },
  pause:  { de:"Pause",  en:"Rest",   illu:"" }
};
function mal(n, x){ var a = []; for(var i=0;i<n;i++) a.push(x); return a; }
var REP_WORKOUT_ROWS = [
  ["feldberg","Feldberg","Feldberg",1,[["air-squats",[15,20,25,30,35]],["sit-ups",[10,15,15,20,20]],["jumping-jacks",[25,30,35,40,45]],["side-lunges",[8,10,12,14,16]],["push-ups",[4,5,6,7,8]]]],
  ["brocken-basis","Brocken Basis","Brocken Basic",1,[["plank-burpees",[30,40,50]],["forward-lunges",[30,40,50]],["sit-ups",[20,25,30]]]],
  ["brocken","Brocken","Brocken",3,[["burpees",[20,35,50,65]],["forward-lunges",[20,35,50,65]],["sit-ups",[20,35,50,65]]]],
  ["brocken-kraft","Brocken Kraft","Brocken Strength",3,[["burpee-squat-jumps",[20,35,50,65]],["pistol-squats",[20,35,50,65]],["jackknives",[20,35,50,65]]]],
  ["saentis","Säntis","Säntis",1,[["lauf",["500m","500m","500m","500m","500m"]],["burpees",[20,20,20,20,20]],["air-squats",[35,35,35,35,35]]]],
  ["saentis-basis","Säntis Basis","Säntis Basic",1,[["plank-burpees",[20,20,20,20]],["high-knees",[80,80,80,80]],["air-squats",[25,25,25,25]]]],
  ["eiger","Eiger","Eiger",2,[["pull-ups",[6,6,6,6,6,6,6]],["sit-ups",[6,6,6,6,6,6,6]],["sprint",["60m","60m","60m","60m","60m","60m","60m"]],["pause",["40s","40s","40s","40s","40s","40s","40s"]]]],
  ["eiger-kraft","Eiger Kraft","Eiger Strength",3,[["muscle-ups",[6,6,6,6,6,6,6]],["jackknives",[6,6,6,6,6,6,6]],["sprint",["60m","60m","60m","60m","60m","60m","60m"]],["pause",["40s","40s","40s","40s","40s","40s","40s"]]]],
  ["grossglockner","Großglockner","Grossglockner",3,[["burpees",[25,25,25,25,25]],["pull-ups",[12,12,12,12,12]],["push-ups",[22,22,22,22,22]],["air-squats",[32,32,32,32,32]]]],
  ["grossglockner-basis","Großglockner Basis","Grossglockner Basic",2,[["burpees",[12,12,12,12,12]],["pull-ups",[7,7,7,7,7]],["push-ups",[10,10,10,10,10]],["air-squats",[25,25,25,25,25]],["triceps-dips",[7,7,7,7,7]]]],
  ["ortler","Ortler","Ortler",2,[["jumping-jacks",[110]],["burpees",[55]],["air-squats",[110]],["sit-ups",[40]],["forward-lunges",[55]],["leg-raises",[60]],["push-ups",[15]],["jackknives",[20]],["burpees",[55]],["jumping-jacks",[110]]]],
  ["matterhorn","Matterhorn","Matterhorn",2,[["lauf",["1250m","1250m"]],["burpees",[30,30]],["air-squats",[30,30]],["mountain-climbers",[30,30]],["leg-raises",[30,30]],["tuck-jumps",[55,55]]]],
  ["matterhorn-ausdauer","Matterhorn Ausdauer","Matterhorn Endurance",1,[["lauf",["800m","800m","800m","800m"]],["air-squats",[25,25,25,25]],["plank-burpees",[18,18,18,18]],["mountain-climbers",[20,20,20,20]],["leg-raises",[18,18,18,18]],["tuck-jumps",[10,10,10,5]]]],
  ["zugspitze","Zugspitze","Zugspitze",1,[["air-squats",[20,30,40]],["mountain-climbers",[20,30,40]],["sit-ups",[20,30,40]],["pause",["20s","20s",0]]]],
  ["zugspitze-kraft","Zugspitze Kraft","Zugspitze Strength",3,[["pistol-squats",[20,30,40]],["frogs",[20,30,40]],["jackknives",[20,30,40]],["pause",["20s","20s",0]]]],
  ["wendelstein","Wendelstein","Wendelstein",1,[["air-squats",mal(3,20)],["mountain-climbers",mal(3,20)],["forward-lunges",mal(3,20)],["high-knees",mal(3,20)],
    ["cossack-squats",mal(3,10)],["jumping-jacks",mal(3,30)]]],
  ["watzmann","Watzmann","Watzmann",3,[["jumping-jacks",mal(3,75)],["burpees",mal(3,25)],["leg-raises",mal(3,50)],["jumping-jacks",mal(3,75)],["sit-ups",mal(3,50)],["burpees",mal(3,25)]]],
  ["watzmann-basis","Watzmann Basis","Watzmann Basic",1,[["plank-burpees",mal(3,5)],["jumping-jacks",mal(3,75)],["plank-burpees",mal(3,15)],["leg-raises",mal(3,20)],
    ["jumping-jacks",mal(3,75)],["sit-ups",mal(3,25)],["plank-burpees",mal(3,15)]]],
  ["watzmann-aufbau","Watzmann Aufbau","Watzmann Build",2,[["jumping-jacks",mal(3,60)],["burpees",mal(3,20)],["leg-raises",mal(3,30)],["jumping-jacks",mal(3,60)],["sit-ups",mal(3,30)],["burpees",mal(3,15)]]],
  ["watzmann-ausdauer","Watzmann Ausdauer","Watzmann Endurance",3,[["jumping-jacks",[60,70,80]],["burpees",mal(3,20)],["leg-raises",[45,40,40]],["jumping-jacks",[60,80,90]],
    ["lauf",mal(3,"400m")],["sit-ups",[50,50,30]],["burpees",[20,20,25]],["stand-up-jumps",mal(3,5)]]],
  ["watzmann-extrem","Watzmann Extrem","Watzmann Extreme",3,[["jumping-jacks",mal(3,75)],["burpee-squat-jumps",mal(3,25)],["toes-to-bar",mal(3,50)],["jumping-jacks",mal(3,75)],
    ["jackknives",mal(3,50)],["burpee-squat-jumps",mal(3,25)]]],
  ["hochkoenig","Hochkönig","Hochkönig",2,[["jumping-jacks",mal(10,40)],["tuck-jumps",mal(10,30)],["mountain-climbers",mal(10,20)],["stand-up-jumps",mal(10,10)]]],
  ["dachstein","Dachstein","Dachstein",3,[["sit-ups",[125]],["mountain-climbers",[150]],["forward-lunges",[125]],["burpees",[100]],["forward-lunges",[125]],["mountain-climbers",[150]],["sit-ups",[125]]]],
  ["pilatus","Pilatus","Pilatus",3,[["burpees",mal(3,25)],["hanging-leg-raise",mal(3,15)],["jackknives",mal(3,15)],["burpees",mal(3,25)],["sprint",mal(3,"80m")]]],
  ["pilatus-basis","Pilatus Basis","Pilatus Basic",2,[["burpees",[25,20,15]],["hanging-leg-raise",mal(3,10)],["jackknives",mal(3,10)],["mountain-climbers",[25,15,10]],["sprint",mal(3,"40m")]]],
  ["herzogstand","Herzogstand","Herzogstand",1,[["tuck-jumps",mal(3,30)],["pause",mal(3,"30s")],["sprint",mal(3,"200m")],["forward-lunges",mal(3,20)],["pause",mal(3,"20s")]]],
  ["arber-basis","Arber Basis","Arber Basic",1,[["burpees",mal(3,10)],["jumping-jacks",mal(3,30)],["hanging-leg-raise",mal(3,5)],["air-squats",mal(3,20)],["triceps-dips",mal(3,10)],
    ["jumping-jacks",mal(3,30)],["pull-ups",mal(3,5)]]],
  ["arber","Arber","Arber",2,[["burpees",mal(3,20)],["jumping-jacks",mal(3,40)],["hanging-leg-raise",mal(3,10)],["deep-squats",mal(3,25)],["triceps-dips",mal(3,15)],
    ["jumping-jacks",mal(3,40)],["pull-ups",mal(3,10)]]],
  ["fichtelberg","Fichtelberg","Fichtelberg",2,[["lauf",["1km",0,0,0,0,0,"1km"]],["jumping-jacks",[0,100,100,100,100,100,0]],["mountain-climbers",[0,100,100,100,100,100,0]]]],
  ["hochgern","Hochgern","Hochgern",2,[["push-ups",mal(4,10)],["pull-ups",mal(4,5)],["cossack-squats",mal(4,10)],["triceps-dips",mal(4,10)],["side-plank",mal(4,"30s")]]],
  ["kampenwand","Kampenwand","Kampenwand",2,[["pull-ups",[10,25,10]],["air-squats",[10,25,10]],["sit-ups",[10,25,10]]]],
  ["kampenwand-basis","Kampenwand Basis","Kampenwand Basic",1,[["push-ups",[10,15,5]],["deep-squats",[10,15,5]],["stand-up-jumps",[10,15,5]]]],
  ["tegelberg","Tegelberg","Tegelberg",2,[["burpees",[10,25,10]],["mountain-climbers",[10,25,10]],["tuck-jumps",[10,25,10]]]],
  ["belchen","Belchen","Belchen",1,[["push-ups",[5,7,10,7,5]],["forward-lunges",[10,15,20,15,10]],["jumping-jacks",[20,30,40,30,20]]]],
  ["rigi","Rigi","Rigi",2,[["mountain-climbers",[10,20,30,40,50]],["sit-ups",[50,40,30,20,10]]]],
  ["rigi-sprung","Rigi Sprung","Rigi Jump",2,[["tuck-jumps",[10,20,30,40,50]],["mountain-climbers",[50,40,30,20,10]]]],
  ["nebelhorn","Nebelhorn","Nebelhorn",1,[["sit-ups",[10,25,10]],["leg-raises",[10,25,10]],["stand-up-jumps",[10,25,10]]]],
  ["nebelhorn-basis","Nebelhorn Basis","Nebelhorn Basic",1,[["forward-lunges",[10,25,10]],["deep-squats",[10,25,10]],["stand-up-jumps",[10,25,10]]]],
  ["wasserkuppe","Wasserkuppe","Wasserkuppe",2,[["forward-lunges",[30,20,10]],["burpees",[30,20,10]],["leg-raises",[30,20,10]],["pause",["30s","20s","10s"]]]],
  ["wasserkuppe-basis","Wasserkuppe Basis","Wasserkuppe Basic",1,[["forward-lunges",[20,20,10]],["plank-burpees",[20,20,10]],["leg-raises",[20,20,10]],["pause",["40s","30s","10s"]]]],
  ["jungfrau","Jungfrau","Jungfrau",2,[["pull-ups",[20,15,10,5]],["push-ups",[20,15,10,5]]]],
  ["jungfrau-sturm","Jungfrau Sturm","Jungfrau Storm",2,[["pull-ups",[7,5,3,2]],["frogs",[15,10,5,5]],["push-ups",[7,5,3,2]],["jackknives",[15,10,5,5]],["mountain-climbers",[15,25,40,80]]]],
  ["moench","Mönch","Mönch",1,[["mountain-climbers",[30,20,10,20,30]],["push-ups",[10,7,5,7,10]],["sit-ups",[30,20,10,20,30]],["air-squats",[30,20,10,20,30]],["jumping-jacks",mal(5,50)]]],
  ["titlis","Titlis","Titlis",2,[["air-squats",mal(5,30)],["jumping-jacks",mal(5,30)],["leg-raises",mal(5,20)],["forward-lunges",mal(5,20)],["jumping-jacks",mal(5,30)],["plank-steps",mal(5,15)]]],
  ["titlis-ausdauer","Titlis Ausdauer","Titlis Endurance",1,[["air-squats",mal(6,20)],["jumping-jacks",mal(6,20)],["leg-raises",[10,15,20,15,10,5]],["forward-lunges",[10,15,20,15,10,5]],
    ["jumping-jacks",mal(6,20)],["plank-steps",[10,15,15,15,10,5]]]],
  ["piz-palue","Piz Palü","Piz Palü",3,[["push-ups",mal(4,50)],["jackknives",mal(4,20)],["deep-squats",mal(4,20)]]],
  ["piz-palue-kraft","Piz Palü Kraft","Piz Palü Strength",2,[["pike-push-ups",mal(4,5)],["jackknives",mal(4,15)],["deep-squats",mal(4,50)],["triceps-dips",mal(4,5)],["plank",mal(4,"30s")]]],
  ["bernina","Bernina","Bernina",3,[["pike-push-ups",[20,20,10,5]],["jackknives",[20,10,10,5]],["deep-squats",[30,20,10,5]],["burpees",mal(4,30)],["mountain-climbers",[30,30,30,80]]]],
  ["hochvogel","Hochvogel","Hochvogel",2,[["burpees",mal(4,25)],["sit-ups",[30,20,20,10]],["leg-raises",[10,20,20,30]],["deep-squats",mal(4,30)]]],
  ["hochvogel-power","Hochvogel Power","Hochvogel Power",2,[["burpees",mal(5,10)],["sit-ups",[20,20,20,15,10]],["leg-raises",[20,20,20,15,10]],["burpees",mal(5,10)],["deep-squats",[25,25,25,25,20]]]],
  ["mont-blanc","Mont Blanc","Mont Blanc",3,[["pike-push-ups",mal(4,5)],["pull-ups",mal(4,15)],["push-ups",mal(4,25)],["sit-ups",mal(4,35)],["air-squats",mal(4,45)],["pause",mal(4,"120s")]]],
  ["mont-blanc-basis","Mont Blanc Basis","Mont Blanc Basic",2,[["push-ups",mal(4,5)],["sit-ups",mal(4,35)],["air-squats",mal(4,40)],["tuck-jumps",[5,10,5,10]],["leg-raises",mal(4,25)],["burpees",mal(4,30)]]]
];


/* ---------- Widerstandsband (Air) ----------
   Gerät „band“ (Loop- oder Griffband). Die Figuren zeichnen das Band als dünne Linie (Klasse „gb“); Befestigung
   (Tür, Stange, Wandhaken) als kleiner Ring. Die Posen werden aus Winkeln gebaut (0° = nach rechts, 90° = nach unten),
   damit Arme und Beine überall gleich lang bleiben. Texte: eigene Formulierungen, Technikhinweise allgemein üblich
   (siehe FACHPRUEFUNG.md - Fachprüfung offen). */
EQUIPS.splice(3, 0, { id:"band", de:"Widerstandsband", en:"Resistance band" });
(function(){
  function r1(v){ return Math.round(v*10)/10; }
  function J(p, deg, len){ var r = deg*Math.PI/180; return [p[0]+Math.cos(r)*len, p[1]+Math.sin(r)*len]; }
  function pt(a){ return r1(a[0])+" "+r1(a[1]); }
  function schulter(p, n){ return [p[0]+(n[0]-p[0])*.85, p[1]+(n[1]-p[1])*.85]; }
  function arm(p, n, a1, a2){ var e = J(schulter(p, n), a1, 11), h = J(e, a2, 12.5); return [r1(e[0]), r1(e[1]), r1(h[0]), r1(h[1])]; }
  function leg(p, a1, a2, zeh){ var k = J(p, a1, 20), a = J(k, a2, 19), z = zeh || [8, 0]; return [r1(k[0]), r1(k[1]), r1(a[0]), r1(a[1]), r1(a[0]+z[0]), r1(a[1]+z[1])]; }
  /* Punkte tragen eine Marke (.t): Hand h, Fuß f, Knie k + Nummer - damit das Band in der Animation mitläuft und sich dehnt */
  function hand(q, i){ var a = q.a[i || 0], r = [a[a.length-2], a[a.length-1]]; r.t = "h"+(i || 0); return r; }
  function fuss(q, i){ var l = q.l[i || 0], r = [l[2], l[3]]; r.t = "f"+(i || 0); return r; }
  function knie(q, i){ var l = q.l[i || 0], r = [l[0], l[1]]; r.t = "k"+(i || 0); return r; }
  /* Band als Linienzug durch die Punkte; mehrere Linien: mehrere bl()-Aufrufe aneinanderhängen */
  /* data-bd: dieselbe Linie als Marken (Hand/Fuß/Knie oder fester Punkt) - die Animation zeichnet sie neu, wenn sich die Glieder bewegen */
  function bl(){
    var d = "", bd = [];
    for(var i=0;i<arguments.length;i++){ var p = arguments[i]; d += (i ? "L" : "M")+pt(p); bd.push(p.t || (r1(p[0])+","+r1(p[1]))); }
    return '<path class="ip gb" d="'+d+'" data-bd="'+bd.join("|")+'"/>';
  }
  /* wie bl(), aber vor dem Körper gezeichnet (z. B. Band zwischen den Händen vor der Brust) */
  function blv(){ return bl.apply(null, arguments).replace('class="ip gb"', 'class="ip gb gv"'); }
  function anker(x, y){ return '<circle class="ip" cx="'+x+'" cy="'+y+'" r="2.4"/>'; }
  /* Seitenansicht: Hüfte p, Rumpfwinkel deg, Beine/Arme als Winkelpaare, gear(q) liefert das Band */
  function S(p, deg, legs, arms, gear, o){
    o = o || {};
    var n = J(p, deg, o.len || 30);
    var q = Q(o.h || null, [r1(n[0]), r1(n[1])], [r1(p[0]), r1(p[1])],
              legs.map(function(l){ return leg(p, l[0], l[1], l[2]); }),
              arms.map(function(a){ return arm(p, n, a[0], a[1]); }), "", false, o.b || 1);
    if(gear) q.x = gear(q);
    return q;
  }
  /* Vorderansicht: beide Arme gespiegelt aus dem linken Winkelpaar (a1, a2); L = nur linker Arm eigens */
  var FL = [[46,70,45,89,39,89],[54,70,55,89,61,89]];
  var FP = [50,52], FN = [50,20];
  function M(a1, a2){ return [[a1, a2], [180-a1, 180-a2]]; }
  function F(arms, gear, beine){
    var q = Q(null, FN.slice(), FP.slice(), (beine || FL).map(function(l){ return l.slice(); }),
              arms.map(function(a){ return arm(FP, FN, a[0], a[1]); }), "", true);
    if(gear) q.x = gear(q);
    return q;
  }
  var STAND = [[90, 90]];
  /* Arme über dem Kopf: kleinere Figur (wie „Trizeps-Curls“), damit die Hände noch im Bild bleiben */
  function SU(arms, gear){
    var q = qWith(P_STUP, { a:arms.map(function(a){ return arm(P_STUP.p, P_STUP.n, a[0], a[1]); }) });
    if(gear) q.x = gear(q);
    return q;
  }

  /* kleiner Ring um das Knie (Band über den Knien) */
  function ring(x, y){ return '<path class="ip gb" d="M'+(x-5)+' '+y+'Q'+(x-5)+' '+(y-6)+' '+x+' '+(y-6)+'Q'+(x+5)+' '+(y-6)+' '+(x+5)+' '+y+'Q'+(x+5)+' '+(y+6)+' '+x+' '+(y+6)+'Q'+(x-5)+' '+(y+6)+' '+(x-5)+' '+y+'Z"/>'; }
  var BAND = [];
  /* id, Name DE, Name EN, Fokus, Runden, Sekunden, je Seite, Hinweis DE, Hinweis EN, Stufe, Belastung, Hauptkategorie,
     [Pose A, Pose B], [Anleitung DE, EN], [Haltung DE, Vermeiden DE, Haltung EN, Vermeiden EN], [Muskeln DE, Hilfsmuskeln DE, EN, EN], Suchwörter */
  function E(id, de, en, cats, rounds, work, side, hDe, hEn, lvl, intens, main, poses, info, post, mus, such){
    BAND.push({ id:id, de:de, en:en, cats:cats, rounds:rounds, work:work, side:side, hDe:hDe, hEn:hEn, lvl:lvl, int:intens, main:main,
                poses:poses, info:info, post:post, mus:mus, such:such || "" });
  }

  /* ===== Rücken ===== */
  E("band-standing-row", "Rudern im Stand mit Band", "Standing Band Row", "back", 6, 30, 0,
    "Band auf Brusthöhe befestigen, Ellbogen eng zurück", "Anchor the band at chest height, elbows back close",
    1, 2, "kraft",
    [S([50,50], -90, STAND, [[2,0]], function(q){ return anker(92,30)+bl([92,30], hand(q)); }),
     S([50,50], -90, STAND, [[120,-5]], function(q){ return anker(92,30)+bl([92,30], hand(q)); })],
    ["Das Band auf Brusthöhe an einer stabilen Tür oder Stange befestigen, die Enden greifen und so weit zurücktreten, dass es leicht gespannt ist.|Die Arme nach vorn strecken, Schultern tief.|Die Ellbogen eng am Körper nach hinten ziehen, die Schulterblätter zusammenführen und langsam zurückgehen.",
     "Anchor the band at chest height on a sturdy door or bar, hold the ends and step back until it is lightly stretched.|Reach your arms forward, shoulders low.|Pull your elbows back close to your body, squeeze your shoulder blades together and return slowly."],
    ["Aufrecht, Brust offen, Blick geradeaus.|Schultern weg von den Ohren, Ellbogen nah am Körper.", "Mit dem Oberkörper nach hinten lehnen, um Schwung zu holen.",
     "Stand tall, chest open, eyes forward.|Shoulders away from your ears, elbows close to your body.", "Leaning back to gain momentum."],
    ["Breiter Rückenmuskel, oberer Rücken", "Bizeps, hintere Schulter, Rumpf", "Lats, upper back", "Biceps, rear delts, core"],
    "rudern ziehen");

  E("band-bent-over-row", "Vorgebeugtes Rudern mit Band", "Bent-over Band Row", "back", 6, 30, 0,
    "Auf dem Band stehen, Rücken gerade", "Stand on the band, back flat",
    1, 2, "kraft",
    [(function(){ var q = S([40,50], -25, [[80,95]], [[95,92]]); q.x = bl([48,89], hand(q)); return q; })(),
     (function(){ var q = S([40,50], -25, [[80,95]], [[160,100]]); q.x = bl([48,89], hand(q)); return q; })()],
    ["Mit beiden Füßen auf die Mitte des Bandes treten, die Enden greifen.|Aus der Hüfte nach vorn beugen, Rücken gerade, Arme hängen unter den Schultern.|Die Ellbogen nach hinten oben zur Hüfte ziehen, kurz halten, langsam wieder senken.",
     "Stand with both feet on the middle of the band and hold the ends.|Hinge forward at the hips, back flat, arms hanging under your shoulders.|Pull your elbows back and up towards your hips, pause briefly and lower slowly."],
    ["Rücken gerade, Nacken in Verlängerung der Wirbelsäule.|Knie leicht gebeugt, Gewicht auf der ganzen Fußsohle.", "Den Rücken rund machen oder mit Schwung ziehen.",
     "Back flat, neck in line with your spine.|Knees slightly bent, weight over the whole foot.", "Rounding your back or yanking with momentum."],
    ["Breiter Rückenmuskel, oberer Rücken", "Bizeps, hintere Schulter, Rückenstrecker", "Lats, upper back", "Biceps, rear delts, lower back"],
    "rudern vorgebeugt");

  E("band-lat-pull-apart", "Band auseinanderziehen über Kopf", "Overhead Band Pull-apart", "back", 6, 30, 0,
    "Arme über Kopf, Band bis zu den Schultern öffnen", "Arms overhead, open the band down to your shoulders",
    1, 1, "kraft",
    [F(M(-150,-105), function(q){ return bl(hand(q,0), [50,9], hand(q,1)); }),
     F(M(160,195), function(q){ return bl(hand(q,0), hand(q,1)); })],
    ["Das Band mit beiden Händen etwas mehr als schulterbreit greifen und die Arme über den Kopf strecken.|Das Band auseinanderziehen und dabei die Arme seitlich bis auf Schulterhöhe absenken.|Kontrolliert wieder nach oben führen.",
     "Hold the band a little wider than shoulder width and reach your arms overhead.|Pull the band apart and lower your arms out to the sides down to shoulder height.|Return to the top under control."],
    ["Rippen unten, Bauch fest, Blick geradeaus.|Schulterblätter nach unten und hinten ziehen.", "Ins Hohlkreuz fallen oder die Schultern hochziehen.",
     "Ribs down, core braced, eyes forward.|Draw your shoulder blades down and back.", "Arching your lower back or shrugging your shoulders."],
    ["Breiter Rückenmuskel, oberer Rücken", "Hintere Schulter, Trapez, Rumpf", "Lats, upper back", "Rear delts, traps, core"],
    "pull apart lat");

  E("band-pull-down", "Zug nach unten mit Band", "Band Pull-down", "back", 6, 30, 0,
    "Band oben befestigen, Ellbogen zu den Rippen", "Anchor the band overhead, elbows to your ribs",
    1, 2, "kraft",
    [S([50,50], -90, STAND, [[-55,-65]], function(q){ return anker(78,2)+bl([78,2], hand(q)); }),
     S([50,50], -90, STAND, [[100,-95]], function(q){ return anker(78,2)+bl([78,2], hand(q)); })],
    ["Das Band oben an einer Tür oder Stange befestigen, die Enden greifen und mit gestreckten Armen darunter stehen.|Die Ellbogen nach unten zu den Rippen ziehen, Brust offen.|Langsam wieder nach oben lassen, ohne dass das Band erschlafft.",
     "Anchor the band overhead on a door or bar, hold the ends and stand under it with your arms extended.|Pull your elbows down towards your ribs, chest open.|Let your arms rise slowly without letting the band go slack."],
    ["Brust offen, Schultern tief, Rumpf fest.|Zug aus dem Rücken, nicht aus den Händen.", "Den Oberkörper weit nach hinten lehnen.",
     "Chest open, shoulders low, core braced.|Pull with your back, not just your hands.", "Leaning far back to heave the band down."],
    ["Breiter Rückenmuskel", "Bizeps, hintere Schulter, Rumpf", "Lats", "Biceps, rear delts, core"],
    "latzug lat pulldown");

  E("band-assisted-pull-up", "Klimmzug mit Bandhilfe", "Band-assisted Pull-up", "back calis", 5, 20, 0,
    "Band um die Stange, Fuß oder Knie hinein", "Loop the band over the bar, foot or knee in",
    2, 3, "stange",
    [qWith(P_HANG, { x:gBar(6,24,76)+bl([42,6], [42,80], [48,86]) }),
     qWith(P_PULL, { x:gBar(6,24,76)+bl([42,6], [42,66], [48,72]) })],
    ["Ein Loop-Band fest um eine stabile Stange legen, ein Ende durchziehen, festziehen und kräftig daran ziehen, ob es hält. Dann den Fuß oder das Knie hineinsetzen (Knie = weniger Hilfe).|Die Stange etwas mehr als schulterbreit greifen und ruhig hängen. Das Band hilft unten am meisten und lässt nach oben nach.|Das Kinn über die Stange ziehen und langsam wieder ablassen – nicht vom Band hochschleudern lassen.",
     "Loop a band firmly around a sturdy bar, pull one end through, cinch it and give it a hard tug to check it holds. Then put your foot or knee in it (knee = less help).|Grip the bar a little wider than shoulder width and hang still. The band helps most at the bottom and less as you rise.|Pull your chin over the bar and lower slowly – don't let the band catapult you up."],
    ["Schultern vom Ohr weg, Ellbogen nach unten.|Körper ruhig, Blick nach vorn.", "Mit Schwung aus den Beinen hochkommen oder im Band federn.",
     "Shoulders away from your ears, elbows down.|Keep your body still, eyes forward.", "Kicking or bouncing in the band to get up."],
    ["Breiter Rückenmuskel, oberer Rücken", "Bizeps, Unterarme, Rauten, Rumpf", "Lats, upper back", "Biceps, forearms, rhomboids, core"],
    "klimmzug pull up unterstützung");

  /* ===== Brust ===== */
  E("band-push-ups", "Liegestütze mit Band", "Band Push-ups", "arms", 6, 20, 0,
    "Band über den Rücken, Hände fassen die Enden", "Band across your back, hands hold the ends",
    3, 3, "kraft",
    [qWith(P_PH, { x:bl([70,88], [44,60]) }), qWith(P_PL, { x:bl([70,88], [44,76]) })],
    ["Das Band hinter dem Rücken über die Schulterblätter legen und die Enden mit den Händen am Boden fassen.|Körper gerade, dann die Brust kontrolliert zum Boden senken.|Gegen den Widerstand des Bandes wieder hochdrücken.",
     "Place the band across your upper back and hold the ends under your hands on the floor.|Body in one line, lower your chest under control.|Press back up against the band's resistance."],
    ["Linie von Kopf bis Ferse, Bauch und Gesäß fest.|Ellbogen schräg nach hinten.", "Die Hüfte durchhängen lassen.",
     "One line from head to heels, core and glutes tight.|Elbows at an angle behind you.", "Letting your hips sag."],
    ["Brust, Trizeps, vordere Schulter", "Rumpf, Sägemuskel", "Chest, triceps, front delts", "Core, serratus"],
    "liegestütz push up");

  E("band-chest-fly", "Brust-Fly mit Band", "Band Chest Fly", "arms", 6, 30, 0,
    "Band hinter dem Rücken, Arme vor der Brust zusammenführen", "Band behind your back, bring your arms together in front",
    1, 2, "kraft",
    [F(M(172,178), function(q){ return bl(hand(q,0), [41,37], [59,37], hand(q,1)); }),
     F(M(140,25), function(q){ var a = hand(q,0), b = hand(q,1); return bl(a, [60,27], [40,27], b); })],
    ["Das Band hinter dem Rücken auf Höhe der Schulterblätter legen und die Enden greifen.|Die Arme seitlich öffnen, Ellbogen leicht gebeugt.|Die Arme in einem weiten Bogen vor der Brust zusammenführen und langsam wieder öffnen.",
     "Place the band behind your back at shoulder-blade height and hold the ends.|Open your arms to the sides, elbows slightly bent.|Bring your arms together in a wide arc in front of your chest and open them slowly."],
    ["Schultern tief, Brust offen, Ellbogen leicht gebeugt.|Rumpf fest, kein Hohlkreuz.", "Die Arme durchstrecken oder mit Schwung zusammenschlagen.",
     "Shoulders low, chest open, elbows slightly bent.|Core braced, no arched back.", "Locking out your arms or swinging them together."],
    ["Brust", "Vordere Schulter, Trizeps", "Chest", "Front delts, triceps"],
    "butterfly fliegende");

  E("band-reverse-fly", "Reverse Fly mit Band", "Band Reverse Fly", "back arms", 6, 30, 0,
    "Arme gestreckt, Band vor dem Körper auseinanderziehen", "Arms straight, pull the band apart in front of you",
    1, 1, "kraft",
    [F(M(130,50), function(q){ return blv(hand(q,0), [50,43], hand(q,1)); }),
     F(M(178,180), function(q){ return blv(hand(q,0), hand(q,1)); })],
    ["Das Band mit beiden Händen schulterbreit greifen und die Arme vor der Brust ausstrecken.|Das Band auseinanderziehen, bis die Arme seitlich auf Schulterhöhe sind.|Kontrolliert zurückführen.",
     "Hold the band shoulder-width apart and reach your arms out in front of your chest.|Pull the band apart until your arms are out to the sides at shoulder height.|Return under control."],
    ["Ellbogen leicht gebeugt, Schulterblätter zusammenziehen.|Hals lang, Blick geradeaus.", "Die Schultern zu den Ohren ziehen oder den Rücken hohl machen.",
     "Elbows slightly bent, squeeze your shoulder blades together.|Neck long, eyes forward.", "Shrugging your shoulders or arching your back."],
    ["Hintere Schulter, oberer Rücken", "Rauten, Trapez, Rumpf", "Rear delts, upper back", "Rhomboids, traps, core"],
    "reverse fly hintere schulter");

  E("band-chest-fly-up", "Fly von unten nach oben mit Band", "Low-to-high Band Fly", "arms", 6, 30, 0,
    "Band unten befestigen, Arme diagonal nach oben zusammenführen", "Anchor the band low, bring your arms together diagonally upwards",
    2, 2, "kraft",
    [F(M(125,110), function(q){ return bl([20,89], hand(q,0))+bl([80,89], hand(q,1)); }),
     F(M(150,-30), function(q){ return bl([20,89], hand(q,0))+bl([80,89], hand(q,1)); })],
    ["Das Band tief hinter dir an einer Tür befestigen, die Enden greifen und leicht nach vorn lehnen.|Die Arme seitlich unten halten, Ellbogen leicht gebeugt.|In einem Bogen nach vorn oben bis vor die Brust ziehen, kurz halten und langsam senken.",
     "Anchor the band low behind you on a door, hold the ends and lean slightly forward.|Hold your arms low at your sides, elbows slightly bent.|Sweep them up and forward to chest height, pause and lower slowly."],
    ["Rumpf fest, ein Bein leicht vorn für sicheren Stand.|Brust offen, Schultern tief.", "Die Schultern nach oben ziehen oder mit dem Körper pendeln.",
     "Braced core, one foot slightly forward for a stable stance.|Chest open, shoulders low.", "Shrugging your shoulders or swaying your body."],
    ["Obere Brust, vordere Schulter", "Trizeps, Rumpf", "Upper chest, front delts", "Triceps, core"],
    "fly kabel brust aufwärts");

  E("band-chest-cross", "Brust-Überkreuzen mit Band", "Band Chest Cross", "arms", 6, 30, 0,
    "Band hinter dem Rücken, Arme vorn überkreuzen", "Band behind your back, cross your arms in front",
    1, 2, "kraft",
    [F(M(175,175), function(q){ return bl(hand(q,0), [41,37], [59,37], hand(q,1)); }),
     F(M(70,60), function(q){ var a = hand(q,0), b = hand(q,1); return bl(a, [43,27], [57,27], b); })],
    ["Das Band hinter dem Rücken auf Höhe der Schulterblätter legen und die Enden greifen.|Die Arme seitlich auf Brusthöhe ausstrecken.|Die Arme vor der Brust überkreuzen, kurz halten und kontrolliert wieder öffnen. Beim nächsten Mal oben überkreuzen.",
     "Place the band behind your back at shoulder-blade height and hold the ends.|Reach your arms out to the sides at chest height.|Cross your arms in front of your chest, pause and open them under control. Alternate which arm is on top."],
    ["Aufrecht, Rumpf fest, Schultern tief.|Ellbogen leicht gebeugt.", "Mit dem Oberkörper nach vorn kippen.",
     "Stand tall, core braced, shoulders low.|Elbows slightly bent.", "Tipping your torso forward."],
    ["Brust", "Vordere Schulter, Rumpf", "Chest", "Front delts, core"],
    "brust kreuzen cross over");

  /* ===== Schultern ===== */
  E("band-lateral-raise", "Seitheben mit Band", "Band Lateral Raise", "arms", 6, 30, 0,
    "Auf dem Band stehen, Arme seitlich bis Schulterhöhe", "Stand on the band, raise your arms to shoulder height",
    1, 2, "kraft",
    [F(M(115,100), function(q){ return bl([43,89], hand(q,0))+bl([57,89], hand(q,1)); }),
     F(M(190,190), function(q){ return bl([43,89], hand(q,0))+bl([57,89], hand(q,1)); })],
    ["Mit beiden Füßen auf die Mitte des Bandes treten und die Enden greifen.|Die Arme mit leicht gebeugten Ellbogen seitlich bis auf Schulterhöhe heben.|Langsam wieder senken.",
     "Stand with both feet on the middle of the band and hold the ends.|Raise your arms out to the sides to shoulder height, elbows slightly bent.|Lower slowly."],
    ["Rumpf fest, Schulterblätter tief.|Ellbogen führen, die Hände bleiben etwas tiefer; nicht höher als Schulterhöhe.", "Mit Schwung aus dem Rücken heben oder die Schultern hochziehen.",
     "Core braced, shoulder blades down.|Lead with your elbows, hands stay a little lower; no higher than shoulder height.", "Swinging from your back or shrugging."],
    ["Seitliche Schulter", "Trapez, Rumpf", "Side delts", "Traps, core"],
    "seitheben schulter");

  E("band-upright-row", "Aufrechtes Rudern mit Band", "Band Upright Row", "arms", 6, 30, 0,
    "Auf dem Band stehen, Ellbogen führen bis Brusthöhe", "Stand on the band, lead with your elbows up to chest height",
    2, 2, "kraft",
    [F([[100,85],[80,95]], function(q){ return bl([45,89], hand(q,0))+bl([55,89], hand(q,1)); }),
     F([[200,60],[-20,120]], function(q){ return bl([45,89], hand(q,0))+bl([55,89], hand(q,1)); })],
    ["Mit beiden Füßen auf das Band treten und die Enden vor dem Körper greifen.|Die Hände eng am Körper entlang bis zur Brust ziehen, die Ellbogen führen nach oben.|Langsam wieder senken.",
     "Stand on the band with both feet and hold the ends in front of your body.|Pull your hands up close to your body to chest height, elbows leading upwards.|Lower slowly."],
    ["Ellbogen höher als die Hände, Schultern tief.|Rumpf fest, Blick geradeaus.", "Höher als Brusthöhe ziehen oder die Schultern hochziehen. Bei Schulterschmerzen weglassen – Seitheben ist die schonendere Alternative.",
     "Elbows higher than your hands, shoulders low.|Core braced, eyes forward.", "Pulling above chest height or shrugging. Skip it if your shoulders hurt – lateral raises are the gentler alternative."],
    ["Seitliche Schulter, Trapez", "Bizeps, Unterarme", "Side delts, traps", "Biceps, forearms"],
    "aufrechtes rudern upright row");

  E("band-front-raise", "Frontheben mit Band", "Band Front Raise", "arms", 6, 30, 0,
    "Auf dem Band stehen, Arme gestreckt bis Schulterhöhe", "Stand on the band, raise straight arms to shoulder height",
    1, 2, "kraft",
    [S([50,50], -90, STAND, [[80,85]], function(q){ return bl([54,89], hand(q)); }),
     S([50,50], -90, STAND, [[0,0]], function(q){ return bl([54,89], hand(q)); })],
    ["Mit beiden Füßen auf das Band treten und die Enden vor den Oberschenkeln greifen.|Die Arme mit leicht gebeugten Ellbogen nach vorn bis auf Schulterhöhe heben.|Langsam wieder senken.",
     "Stand on the band with both feet and hold the ends in front of your thighs.|Raise your arms forward to shoulder height, elbows slightly bent.|Lower slowly."],
    ["Aufrecht, Bauch fest, Blick geradeaus.|Nicht höher als Schulterhöhe heben.", "Mit dem Oberkörper nach hinten lehnen.",
     "Stand tall, core braced, eyes forward.|Lift no higher than shoulder height.", "Leaning back to swing the arms up."],
    ["Vordere Schulter", "Obere Brust, Rumpf", "Front delts", "Upper chest, core"],
    "frontheben vordere schulter");

  E("band-shoulder-press", "Schulterdrücken mit Band", "Band Shoulder Press", "arms", 6, 30, 0,
    "Auf dem Band stehen, Hände von den Schultern nach oben drücken", "Stand on the band, press from your shoulders overhead",
    1, 2, "kraft",
    [F(M(150,-100), function(q){ return bl([44,89], hand(q,0))+bl([56,89], hand(q,1)); }),
     F(M(-125,-100), function(q){ return bl([44,89], hand(q,0))+bl([56,89], hand(q,1)); })],
    ["Mit beiden Füßen auf das Band treten, die Enden greifen und die Hände auf Schulterhöhe bringen.|Die Arme gerade nach oben über den Kopf drücken.|Kontrolliert wieder bis zu den Schultern senken.",
     "Stand on the band with both feet, hold the ends and bring your hands to shoulder height.|Press your arms straight up overhead.|Lower back to your shoulders under control."],
    ["Bauch und Gesäß fest, Rippen unten.|Handgelenke über den Ellbogen.", "Ins Hohlkreuz fallen oder den Kopf nach vorn schieben.",
     "Core and glutes tight, ribs down.|Wrists stacked over your elbows.", "Arching your back or pushing your head forward."],
    ["Schultern", "Trizeps, Trapez, Rumpf", "Shoulders", "Triceps, traps, core"],
    "schulterdrücken overhead press");

  E("band-one-arm-press", "Einarm-Schulterdrücken mit Band", "One-arm Band Press", "arms", 3, 30, 1,
    "Ein Arm drückt, der andere stabilisiert", "One arm presses, the other stays still",
    2, 2, "kraft",
    [F([[30,-80],[120,100]], function(q){ return bl([56,89], hand(q,0)); }),
     F([[-55,-80],[120,100]], function(q){ return bl([56,89], hand(q,0)); })],
    ["Mit einem Fuß auf das Band treten, das Ende in die Hand nehmen und auf Schulterhöhe bringen.|Den Arm gerade über den Kopf drücken, der Rumpf bleibt ruhig.|Kontrolliert senken, nach der Hälfte der Zeit die Seite wechseln.",
     "Stand with one foot on the band, take the end in your hand and bring it to shoulder height.|Press your arm straight overhead while your torso stays still.|Lower under control and switch sides halfway."],
    ["Rumpf fest, Becken gerade.|Handgelenk über dem Ellbogen.", "Zur Seite kippen, um das Band hochzubekommen.",
     "Core braced, hips level.|Wrist stacked over your elbow.", "Leaning sideways to get the band up."],
    ["Schultern", "Trizeps, Rumpf, schräge Bauchmuskeln", "Shoulders", "Triceps, core, obliques"],
    "einarm schulterdrücken");

  /* ===== Bauch ===== */
  E("band-russian-twist", "Rumpfdrehung im Sitzen mit Band", "Seated Band Twist", "core", 6, 30, 0,
    "Band um die Füße, Oberkörper aufrecht drehen", "Band around your feet, rotate with an upright chest",
    2, 2, "rumpf",
    [qWith(RT_SC, { x:bl([79,75], [47,68]) }), qWith(RT_ST, { x:bl([79,75], [39,85]) })],
    ["Auf den Boden setzen, das Band um beide Füße legen und die Enden mit den Händen vor der Brust greifen.|Mit geradem Rücken leicht zurücklehnen, die Füße am Boden oder angehoben.|Den Oberkörper abwechselnd nach links und rechts drehen, die Hände wandern mit.",
     "Sit on the floor, loop the band around both feet and hold the ends in front of your chest.|Lean back slightly with a straight back, feet on the floor or lifted.|Rotate your torso alternately to the left and right, your hands moving with it."],
    ["Brustbein aufrecht, Rücken lang.|Gedreht wird der Oberkörper, das Becken bleibt ruhig.", "Mit rundem Rücken zurückkippen oder nur die Arme bewegen. Bei Rückenbeschwerden kleiner drehen und die Füße am Boden lassen.",
     "Chest up, long spine.|Rotate your torso, keep your hips still.", "Slumping back with a rounded spine or moving only your arms. With back pain, rotate less and keep your feet on the floor."],
    ["Schräge Bauchmuskeln", "Gerader Bauch, Hüftbeuger, Schultern", "Obliques", "Abs, hip flexors, shoulders"],
    "russian twist drehung");

  E("band-kneeling-twist", "Kniende Rumpfdrehung mit Band", "Kneeling Band Rotation", "core", 3, 30, 1,
    "Band seitlich befestigen, aus dem Rumpf drehen", "Anchor the band at your side, rotate from your core",
    2, 2, "rumpf",
    [(function(){ var q = S([48,66], -90, [[90,170,[-6,0]]], [[40,-10]]); q.x = anker(90,44)+bl([90,44], hand(q)); return q; })(),
     (function(){ var q = S([48,66], -90, [[90,170,[-6,0]]], [[100,150]]); q.x = anker(90,44)+bl([90,44], hand(q)); return q; })()],
    ["Das Band auf Brusthöhe seitlich an einer Tür oder Stange befestigen und mit beiden Händen greifen. Mit der Seite zur Befestigung hinknien.|Die Arme vor der Brust ausstrecken, Rumpf aufrecht.|Den Oberkörper vom Band weg drehen, kurz halten und kontrolliert zurückkehren. Nach der Hälfte die Seite wechseln.",
     "Anchor the band at chest height beside you on a door or bar and hold it with both hands. Kneel sideways to the anchor.|Reach your arms out in front of your chest, torso upright.|Rotate your torso away from the band, pause and return under control. Switch sides halfway."],
    ["Aufrecht knien, Gesäß und Bauch fest.|Die Drehung kommt aus dem Rumpf, Hüfte bleibt ruhig.", "Mit den Armen ziehen oder das Becken mitdrehen.",
     "Kneel tall, glutes and core tight.|Rotate from your torso, keep your hips still.", "Pulling with your arms or turning your hips."],
    ["Schräge Bauchmuskeln", "Gerader Bauch, Rückenstrecker, Schultern", "Obliques", "Abs, lower back, shoulders"],
    "rotation anti rotation woodchop");

  E("band-side-bend", "Seitbeuge mit Band", "Band Side Bend", "core", 3, 30, 1,
    "Auf dem Band stehen, seitlich zur Seite beugen", "Stand on the band, bend sideways",
    1, 1, "rumpf",
    [(function(){ var q = Q(null, [50,20], [50,52], FL.map(function(l){ return l.slice(); }),
                     [arm([50,52],[50,20],-45,200), arm([50,52],[50,20],115,100)], "", true); q.x = bl([43,89], hand(q,1)); return q; })(),
     (function(){ var n = [37,23], p = [53,52], q = Q(null, n, p, FL.map(function(l){ return l.slice(); }),
                     [arm(p,n,-62,205), arm(p,n,92,92)], "", true); q.x = bl([43,89], hand(q,1)); return q; })()],
    ["Mit einem Fuß auf das Band treten, das Ende in die Hand auf dieser Seite nehmen. Die andere Hand an den Kopf legen.|Aufrecht stehen, Bauch fest.|Den Oberkörper seitlich zur Bandseite beugen, kurz halten und wieder aufrichten. Nach der Hälfte die Seite wechseln.",
     "Stand with one foot on the band and hold the end in the hand on that side. Place your other hand by your head.|Stand tall, core braced.|Bend your torso sideways towards the band side, pause and straighten up. Switch sides halfway."],
    ["Seitlich bleiben, nicht nach vorn oder hinten kippen.|Becken ruhig, Blick geradeaus.", "Mit Schwung zur Seite fallen lassen.",
     "Stay in a side plane, don't tip forward or back.|Keep your hips still, eyes forward.", "Dropping sideways with momentum."],
    ["Schräge Bauchmuskeln", "Rückenstrecker, Rumpf", "Obliques", "Lower back, core"],
    "seitbeuge side bend");

  E("band-kneeling-crunch", "Crunch kniend mit Band", "Kneeling Band Crunch", "core", 6, 30, 0,
    "Band oben befestigen, Rumpf einrollen", "Anchor the band overhead, curl your torso down",
    2, 2, "rumpf",
    [(function(){ var q = S([48,66], -90, [[90,170,[-6,0]]], [[-20,-150]]); q.x = anker(70,1)+bl([70,1], hand(q)); return q; })(),
     (function(){ var q = S([48,66], -40, [[90,170,[-6,0]]], [[30,-160]]); q.x = anker(70,1)+bl([70,1], hand(q)); return q; })()],
    ["Das Band oben an einer Tür oder Stange befestigen, kniend davor setzen und die Enden neben den Kopf halten.|Aufrecht knien, Bauch anspannen.|Den Oberkörper aus dem Bauch heraus nach unten einrollen, kurz halten und langsam wieder aufrichten.",
     "Anchor the band overhead on a door or bar, kneel in front of it and hold the ends beside your head.|Kneel tall, core braced.|Curl your torso downwards using your abs, pause and rise slowly."],
    ["Der Rücken rollt rund ein, die Hüfte bleibt oben.|Die Rippen rollen zum Becken, Ellbogen zeigen Richtung Boden.", "Aus der Hüfte nach vorn abknicken, auf die Fersen setzen oder an den Armen ziehen.",
     "Your spine curls round, hips stay up.|Roll your ribs towards your pelvis, elbows point towards the floor.", "Folding at the hips, sitting back on your heels or pulling with your arms."],
    ["Gerader Bauchmuskel", "Schräge Bauchmuskeln, Hüftbeuger", "Abs", "Obliques, hip flexors"],
    "crunch kabel bauch");

  E("band-crunch", "Crunch liegend mit Band", "Lying Band Crunch", "core", 6, 30, 0,
    "Band hinter dem Kopf befestigen, Oberkörper anheben", "Anchor the band behind your head, lift your upper body",
    1, 2, "rumpf",
    [(function(){ var q = qWith(P_LBK, { a:[arm(P_LBK.p, P_LBK.n, -80, -90)] }); q.x = anker(6,56)+bl([6,56], hand(q)); return q; })(),
     (function(){ var q = Q([22,60], [30,68], [46,86], [[60,70,70,89,78,89]], [], "", false, 1); q.a = [arm(q.p, q.n, -20, -10)]; q.x = anker(6,56)+bl([6,56], hand(q)); return q; })()],
    ["Auf den Rücken legen, Knie angewinkelt, das Band hinter dem Kopf befestigen und die Enden mit beiden Händen vor der Brust halten.|Den unteren Rücken am Boden lassen.|Kopf und Schultern vom Boden einrollen, kurz halten und langsam wieder ablegen.",
     "Lie on your back with your knees bent, anchor the band behind your head and hold the ends in both hands at your chest.|Keep your lower back on the floor.|Curl your head and shoulders off the floor, pause and lower slowly."],
    ["Unterer Rücken bleibt am Boden, Nacken lang.|Der Bauch zieht die Rippen zum Becken.", "Am Nacken ziehen oder mit Schwung hochkommen.",
     "Lower back stays on the floor, neck long.|Your abs draw your ribs towards your pelvis.", "Pulling on your neck or using momentum."],
    ["Gerader Bauchmuskel", "Schräge Bauchmuskeln, Hüftbeuger", "Abs", "Obliques, hip flexors"],
    "crunch bauchpresse");

  /* ===== Bizeps ===== */
  E("band-hammer-curl", "Hammer-Curls mit Band", "Band Hammer Curl", "arms", 6, 30, 0,
    "Auf dem Band stehen, Daumen zeigen nach oben", "Stand on the band, thumbs point up",
    1, 1, "kraft",
    [S([50,50], -90, STAND, [[70,80]], function(q){ return bl([54,89], hand(q)); }),
     S([50,50], -90, STAND, [[55,-110]], function(q){ return bl([54,89], hand(q)); })],
    ["Mit beiden Füßen auf das Band treten und die Enden mit nach innen zeigenden Handflächen greifen.|Die Ellbogen am Körper lassen und die Hände zu den Schultern beugen.|Langsam wieder strecken.",
     "Stand on the band with both feet and hold the ends with your palms facing in.|Keep your elbows by your sides and curl your hands up to your shoulders.|Lower slowly."],
    ["Ellbogen fest an den Rippen, Handgelenke gerade.|Oberkörper ruhig.", "Mit dem Rücken Schwung holen oder die Ellbogen nach vorn schieben.",
     "Elbows pinned to your ribs, wrists straight.|Torso still.", "Swinging with your back or pushing your elbows forward."],
    ["Oberarmmuskel, Bizeps", "Unterarme, vordere Schulter", "Brachialis, biceps", "Forearms, front delts"],
    "hammer curl bizeps");

  E("band-one-arm-curl", "Einarm-Curl mit Band", "One-arm Band Curl", "arms", 3, 30, 1,
    "Ein Fuß auf dem Band, andere Hand an der Hüfte", "One foot on the band, other hand on your hip",
    1, 1, "kraft",
    [S([50,50], -90, STAND, [[70,80],[120,60]], function(q){ return bl([54,89], hand(q,0)); }),
     S([50,50], -90, STAND, [[55,-110],[120,60]], function(q){ return bl([54,89], hand(q,0)); })],
    ["Mit einem Fuß auf das Band treten, das Ende in die Hand nehmen, die andere Hand an die Hüfte.|Den Ellbogen am Körper lassen und die Hand zur Schulter beugen.|Langsam strecken, nach der Hälfte der Zeit die Seite wechseln.",
     "Stand with one foot on the band, take the end in your hand and place your other hand on your hip.|Keep your elbow at your side and curl your hand to your shoulder.|Lower slowly and switch sides halfway."],
    ["Ellbogen am Körper, Schulter tief.|Aufrecht stehen, Bauch fest.", "Den Oberkörper nach hinten lehnen.",
     "Elbow at your side, shoulder low.|Stand tall, core braced.", "Leaning back to lift."],
    ["Bizeps", "Unterarme, vordere Schulter", "Biceps", "Forearms, front delts"],
    "einarm curl bizeps");

  E("band-biceps-curl", "Bizeps-Curls mit Band", "Band Biceps Curl", "arms", 6, 30, 0,
    "Auf dem Band stehen, Handflächen nach vorn", "Stand on the band, palms facing forward",
    1, 1, "kraft",
    [F(M(115,100), function(q){ return bl([43,89], hand(q,0))+bl([57,89], hand(q,1)); }),
     F(M(115,-95), function(q){ return bl([43,89], hand(q,0))+bl([57,89], hand(q,1)); })],
    ["Mit beiden Füßen auf das Band treten und die Enden mit den Handflächen nach vorn greifen.|Die Ellbogen am Körper lassen und die Hände zu den Schultern beugen.|Langsam wieder strecken.",
     "Stand on the band with both feet and hold the ends with your palms facing forward.|Keep your elbows at your sides and curl your hands up to your shoulders.|Lower slowly."],
    ["Ellbogen fest am Körper, Schultern tief.|Rücken gerade, Knie leicht weich.", "Mit Schwung aus dem Rücken curlen.",
     "Elbows fixed at your sides, shoulders low.|Back straight, knees soft.", "Swinging the weight up with your back."],
    ["Bizeps", "Unterarme, vordere Schulter", "Biceps", "Forearms, front delts"],
    "bizeps curl");

  E("band-concentration-curl", "Konzentrations-Curl mit Band", "Seated Band Concentration Curl", "arms", 3, 30, 1,
    "Ellbogen auf dem Oberschenkel, Band unter dem Fuß", "Elbow on your thigh, band under your foot",
    1, 1, "kraft",
    [S([42,66], -40, [[0,92]], [[88,85]], function(q){ return gBench(24,54,67)+bl([64,88], hand(q)); }),
     S([42,66], -40, [[0,92]], [[88,-75]], function(q){ return gBench(24,54,67)+bl([64,88], hand(q)); })],
    ["Aufrecht auf einen Stuhl oder eine Bank setzen, einen Fuß auf das Band stellen und das Ende in die Hand nehmen. Den Ellbogen innen auf den Oberschenkel legen.|Den Arm hängen lassen.|Die Hand zur Schulter beugen, kurz halten und langsam senken. Nach der Hälfte die Seite wechseln.",
     "Sit on a chair or bench, put one foot on the band and take the end in your hand. Rest the back of your upper arm on the inside of your thigh.|Let your arm hang.|Curl your hand towards your shoulder, pause and lower slowly. Switch sides halfway."],
    ["Oberarm bleibt auf dem Oberschenkel, Rücken gerade.|Langsam und voll bewegen.", "Mit dem Oberkörper mitschwingen.",
     "Upper arm stays on your thigh, back straight.|Move slowly through the full range.", "Rocking your torso to help."],
    ["Bizeps", "Oberarmmuskel, Unterarme", "Biceps", "Brachialis, forearms"],
    "konzentrationscurl");

  /* ===== Trizeps ===== */
  E("band-overhead-triceps", "Trizeps-Strecken über Kopf mit Band", "Overhead Band Triceps Press", "arms", 3, 30, 1,
    "Eine Hand hinter dem Rücken, die andere drückt nach oben", "One hand behind your back, the other presses overhead",
    2, 1, "kraft",
    [SU([[-55,160],[100,95]], function(q){ return bl(hand(q,1), [42,46], hand(q,0)); }),
     SU([[-72,-78],[100,95]], function(q){ return bl(hand(q,1), [42,46], hand(q,0)); })],
    ["Ein Ende des Bandes mit einer Hand hinter dem Rücken auf Höhe des unteren Rückens halten, das andere Ende mit der oberen Hand greifen und den Ellbogen hinter den Kopf beugen.|Den oberen Ellbogen nah am Kopf lassen.|Den Arm nach oben strecken, langsam beugen. Nach der Hälfte die Seite wechseln.",
     "Hold one end of the band behind your back at lower-back height with one hand, take the other end with your top hand and bend your elbow behind your head.|Keep the top elbow close to your head.|Extend your arm upwards and bend it slowly. Switch sides halfway."],
    ["Oberarm bleibt senkrecht, Rippen unten.|Bauch fest, kein Hohlkreuz.", "Den Ellbogen nach vorn oder zur Seite ausweichen lassen.",
     "Upper arm stays vertical, ribs down.|Core braced, no arched back.", "Letting your elbow drift forward or out."],
    ["Trizeps", "Schulter, Rumpf", "Triceps", "Shoulder, core"],
    "trizeps überkopf");

  E("band-triceps-pressdown", "Trizeps-Drücken nach unten mit Band", "Band Triceps Pushdown", "arms", 6, 30, 0,
    "Band oben befestigen, Ellbogen am Körper", "Anchor the band overhead, elbows at your sides",
    1, 1, "kraft",
    [S([50,50], -90, STAND, [[90,-20]], function(q){ return anker(88,2)+bl([88,2], hand(q)); }),
     S([50,50], -90, STAND, [[90,90]], function(q){ return anker(88,2)+bl([88,2], hand(q)); })],
    ["Das Band oben an einer Tür oder Stange befestigen, die Enden greifen und davor stehen.|Die Ellbogen an die Rippen legen, die Unterarme zeigen nach vorn.|Die Hände nach unten drücken, bis die Arme gestreckt sind, und langsam zurückkehren.",
     "Anchor the band overhead on a door or bar, hold the ends and stand in front of it.|Place your elbows by your ribs, forearms pointing forward.|Press your hands down until your arms are straight and return slowly."],
    ["Ellbogen bleiben fest am Körper, oben nicht höher als die Brust.|Handgelenke gerade, Schultern tief.", "Die Ellbogen nach vorn schwingen lassen (dann zieht der Rücken mit) oder mit dem Oberkörper nachhelfen.",
     "Elbows stay fixed at your sides, no higher than chest level at the top.|Wrists straight, shoulders low.", "Letting your elbows swing forward (your back starts to pull) or helping with your torso."],
    ["Trizeps", "Schultern, Unterarme", "Triceps", "Shoulders, forearms"],
    "trizeps pushdown pressdown");

  E("band-side-triceps", "Einarm-Trizeps seitlich mit Band", "One-arm Side Triceps Extension", "arms", 3, 30, 1,
    "Band seitlich oben befestigen, Arm nach unten strecken", "Anchor the band high at your side, extend your arm down",
    1, 1, "kraft",
    [F([[30,-85],[120,100]], function(q){ return anker(86,2)+bl([86,2], hand(q,0)); }),
     F([[30,95],[120,100]], function(q){ return anker(86,2)+bl([86,2], hand(q,0)); })],
    ["Das Band seitlich oben an einer Tür befestigen, das Ende in die Hand nehmen und daneben stehen.|Den Ellbogen am Körper, die Hand auf Schulterhöhe.|Den Arm nach unten strecken, langsam beugen. Nach der Hälfte die Seite wechseln.",
     "Anchor the band high on a door beside you, take the end in your hand and stand next to it.|Keep your elbow at your side, hand at shoulder height.|Extend your arm downwards and bend it slowly. Switch sides halfway."],
    ["Ellbogen bleibt am Körper, Oberkörper ruhig.|Schultern tief.", "Den Oberkörper zur Seite kippen.",
     "Elbow stays at your side, torso still.|Shoulders low.", "Tilting your torso sideways."],
    ["Trizeps", "Schulter, Rumpf", "Triceps", "Shoulder, core"],
    "trizeps einarm seitlich");

  E("band-triceps-kickback", "Trizeps-Kickback mit Band", "Band Triceps Kickback", "arms", 6, 30, 0,
    "Auf dem Band stehen, vorgebeugt, Arm nach hinten strecken", "Stand on the band, hinged forward, extend your arm back",
    1, 1, "kraft",
    [(function(){ var q = S([40,50], -25, [[80,95]], [[170,95]]); q.x = bl([48,89], hand(q)); return q; })(),
     (function(){ var q = S([40,50], -25, [[80,95]], [[170,175]]); q.x = bl([48,89], hand(q)); return q; })()],
    ["Mit beiden Füßen auf das Band treten und die Enden greifen. Aus der Hüfte nach vorn beugen, Rücken gerade.|Den Oberarm eng am Körper nach hinten führen, der Unterarm hängt.|Den Unterarm nach hinten strecken, kurz halten und langsam beugen.",
     "Stand with both feet on the band and hold the ends. Hinge forward at the hips with a flat back.|Bring your upper arm back close to your body, forearm hanging.|Extend your forearm backwards, pause and bend slowly."],
    ["Oberarm bleibt parallel zum Rücken und still.|Rücken gerade, Nacken lang.", "Mit dem ganzen Arm schwingen.",
     "Upper arm stays parallel to your back and still.|Back flat, neck long.", "Swinging the whole arm."],
    ["Trizeps", "Hintere Schulter, Rückenstrecker", "Triceps", "Rear delts, lower back"],
    "trizeps kickback");

  E("band-overhead-extension", "Trizeps-Strecken über Kopf mit Band (beidhändig)", "Two-hand Overhead Band Extension", "arms", 6, 30, 0,
    "Auf dem Band stehen, beide Hände über dem Kopf strecken", "Stand on the band, extend both hands overhead",
    2, 1, "kraft",
    [SU([[-55,160]], function(q){ return bl([46,89], [38,52], hand(q)); }),
     SU([[-72,-78]], function(q){ return bl([46,89], [38,52], hand(q)); })],
    ["Mit einem Fuß auf das Bandende treten, das andere Ende mit beiden Händen hinter dem Kopf halten.|Die Ellbogen zeigen nach oben, dicht am Kopf.|Die Arme nach oben strecken und langsam wieder beugen.",
     "Step on one end of the band and hold the other end with both hands behind your head.|Elbows point up, close to your head.|Extend your arms upwards and bend them slowly."],
    ["Ellbogen eng am Kopf, Rippen unten.|Bauch und Gesäß fest.", "Die Ellbogen nach außen öffnen oder ins Hohlkreuz fallen.",
     "Elbows close to your head, ribs down.|Core and glutes tight.", "Flaring your elbows or arching your back."],
    ["Trizeps", "Schultern, Rumpf", "Triceps", "Shoulders, core"],
    "trizepsstrecken überkopf");

  /* ===== Gesäß ===== */
  E("band-clamshell", "Muschel mit Band", "Band Clamshell", "legs", 3, 30, 1,
    "Seitlich liegen, Knie öffnen, Füße bleiben zusammen", "Lie on your side, open your knees, keep your feet together",
    1, 1, "kraft",
    [(function(){ var q = S([48,80], 187, [[2,178],[18,180]], [[40,5]], null, { len:24 }); q.x = bl(knie(q,0), knie(q,1)); return q; })(),
     (function(){ var q = S([48,80], 187, [[-35,142],[18,180]], [[40,5]], null, { len:24 }); q.x = bl(knie(q,0), knie(q,1)); return q; })()],
    ["Auf die Seite legen, die Knie angewinkelt, das Band um beide Oberschenkel knapp über den Knien.|Die Füße bleiben aufeinander, das Becken stabil.|Das obere Knie gegen das Band öffnen, kurz halten und langsam schließen. Nach der Hälfte die Seite wechseln.",
     "Lie on your side with your knees bent and the band around both thighs just above the knees.|Keep your feet together and your pelvis steady.|Open your top knee against the band, pause and close slowly. Switch sides halfway."],
    ["Becken bleibt stabil, nicht nach hinten rollen.|Bauch leicht angespannt.", "Mit dem Becken mitkippen, statt aus der Hüfte zu öffnen.",
     "Keep your pelvis stable, don't roll back.|Core lightly braced.", "Rolling your pelvis instead of opening from the hip."],
    ["Seitlicher Gesäßmuskel", "Tiefe Hüftrotatoren, Großer Gesäßmuskel, Rumpf", "Glute medius", "Deep hip rotators, glute max, core"],
    "muschel clamshell");

  E("band-leg-abduction", "Beinheben zur Seite mit Band", "Standing Band Leg Abduction", "legs", 3, 30, 1,
    "Band um die Knöchel, Bein seitlich öffnen", "Band around your ankles, lift your leg out to the side",
    1, 1, "kraft",
    [(function(){ var q = Q(null, FN.slice(), FP.slice(), FL.map(function(l){ return l.slice(); }), [arm(FP,FN,150,60), arm(FP,FN,30,120)], "", true); q.x = bl([45,86], [55,86]); return q; })(),
     (function(){ var q = Q(null, FN.slice(), FP.slice(), [[46,70,45,89,39,89],[60,69,72,81,78,83]], [arm(FP,FN,150,60), arm(FP,FN,30,120)], "", true); q.x = bl([45,86], [72,81]); return q; })()],
    ["Das Band um beide Knöchel legen und aufrecht hinstellen, eine Hand an einer Wand oder Stuhllehne.|Das Standbein leicht gebeugt, den Oberkörper aufrecht.|Das andere Bein gestreckt seitlich anheben, kurz halten und kontrolliert zurückführen. Nach der Hälfte die Seite wechseln.",
     "Put the band around both ankles and stand tall, one hand on a wall or chair back.|Keep the standing knee soft and your torso upright.|Lift the other leg out to the side with a straight knee, pause and return under control. Switch sides halfway."],
    ["Oberkörper aufrecht, Becken gerade.|Fußspitze zeigt nach vorn, das Bein nur so hoch, wie das Becken ruhig bleibt (etwa 45°).", "Zur Seite lehnen oder das Bein höher heben – dann arbeitet nicht mehr der seitliche Gesäßmuskel.",
     "Torso upright, hips level.|Toes point forward; lift only as high as your pelvis stays still (about 45°).", "Leaning sideways or lifting higher – the side glute no longer does the work."],
    ["Seitlicher Gesäßmuskel", "Großer Gesäßmuskel, Oberschenkel außen", "Glute medius", "Glute max, outer thigh"],
    "abduktion beinheben seitlich");

  E("band-single-leg-deadlift", "Einbeiniges Kreuzheben mit Band", "Single-leg Band Deadlift", "legs", 3, 30, 1,
    "Auf dem Band stehen, Hüfte nach hinten, Bein nach hinten", "Stand on the band, hips back, free leg back",
    2, 2, "kraft",
    [(function(){ var q = S([50,50], -90, STAND, [[90,90]]); q.x = bl([54,89], hand(q)); return q; })(),
     (function(){ var q = S([44,52], -12, [[88,92],[183,178,[-7,0]]], [[95,92]]); q.x = bl([52,89], hand(q)); return q; })()],
    ["Mit einem Fuß auf das Band treten, die Enden greifen, Standbein leicht gebeugt.|Aus der Hüfte nach vorn beugen und das freie Bein gestreckt nach hinten heben, Rücken gerade.|Mit dem Gesäß wieder aufrichten. Nach der Hälfte die Seite wechseln.",
     "Stand on the band with one foot, hold the ends, standing knee slightly bent.|Hinge forward at the hips and lift the free leg straight behind you, back flat.|Rise back up using your glutes. Switch sides halfway."],
    ["Rücken gerade, Hüfte zeigt zum Boden.|Standbein leicht gebeugt, Blick leicht vor den Fuß.", "Den Rücken rund machen oder die Hüfte seitlich aufdrehen.",
     "Back flat, hips square to the floor.|Standing knee soft, eyes slightly ahead of your foot.", "Rounding your back or opening your hips sideways."],
    ["Oberschenkel hinten, Großer Gesäßmuskel", "Rückenstrecker, Breiter Rückenmuskel, Rumpf", "Hamstrings, glutes", "Lower back, lats, core"],
    "kreuzheben einbeinig rdl");

  E("band-glute-bridge", "Glute Bridge mit Band", "Band Glute Bridge", "legs", 6, 30, 0,
    "Band über den Knien, Becken heben, Knie nach außen drücken", "Band above your knees, lift your hips, push your knees out",
    1, 1, "kraft",
    [qWith(P_LBK, { x:ring(60,70) }), Q([14,83],[24,84],[46,68],[[62,64,70,89,78,89]],[[33,88,43,88]], ring(62,64))],
    ["Auf den Rücken legen, Füße hüftbreit aufstellen, das Band um die Oberschenkel knapp über den Knien.|Die Knie leicht gegen das Band nach außen drücken.|Das Becken anheben, oben das Gesäß anspannen, kurz halten und langsam absenken.",
     "Lie on your back with your feet hip-width apart and the band around your thighs just above the knees.|Press your knees gently out against the band.|Lift your hips, squeeze your glutes at the top, pause and lower slowly."],
    ["Knie bleiben über den Füßen, Rippen unten.|Oben eine gerade Linie von Schulter bis Knie.", "Ins Hohlkreuz überstrecken oder die Knie nach innen fallen lassen.",
     "Knees stay over your feet, ribs down.|A straight line from shoulders to knees at the top.", "Over-arching your back or letting your knees fall in."],
    ["Großer Gesäßmuskel", "Oberschenkel hinten, seitlicher Gesäßmuskel, Rumpf", "Glutes", "Hamstrings, glute medius, core"],
    "glute bridge beckenheben");

  E("band-donkey-kick", "Fersenstoß im Vierfüßler mit Band", "Band Donkey Kick", "legs", 3, 30, 1,
    "Band unter dem Fuß, Bein nach hinten strecken", "Band under your foot, extend your leg back",
    2, 1, "kraft",
    [(function(){ var q = Q(null, [66,66], [40,66], [[44,84,26,87,20,88],[40,88,22,89,16,89]], [[67,78,68,89]]); q.x = bl([68,88], fuss(q,0)); return q; })(),
     (function(){ var q = Q(null, [66,66], [40,66], [[26,74,7,76,3,77],[40,88,22,89,16,89]], [[67,78,68,89]]); q.x = bl([68,88], fuss(q,0)); return q; })()],
    ["In den Vierfüßlerstand gehen, das Band mit den Händen am Boden halten und um einen Fuß legen.|Rücken gerade, Bauch angespannt.|Das Bein nach hinten oben strecken, oben das Gesäß anspannen und langsam zurückführen. Nach der Hälfte die Seite wechseln.",
     "Get on all fours, hold the band under your hands on the floor and loop it around one foot.|Back flat, core braced.|Extend the leg back and up, squeeze your glute at the top and return slowly. Switch sides halfway."],
    ["Rücken bleibt gerade, Becken zeigt zum Boden.|Bewegung aus der Hüfte.", "Ins Hohlkreuz kippen, um das Bein höher zu bekommen.",
     "Back stays flat, hips square to the floor.|Move from the hip.", "Arching your lower back to lift the leg higher."],
    ["Großer Gesäßmuskel", "Oberschenkel hinten, Rumpf", "Glutes", "Hamstrings, core"],
    "donkey kick fersenstoß");

  /* ===== Beine ===== */
  E("band-squat", "Kniebeuge mit Band", "Band Squat", "legs", 6, 30, 0,
    "Auf dem Band stehen, Enden an den Schultern", "Stand on the band, ends at your shoulders",
    1, 2, "kraft",
    [(function(){ var q = qWith(P_ST, { a:[arm(P_ST.p, P_ST.n, 70, -100)] }); q.x = bl([54,89], hand(q)); return q; })(),
     (function(){ var q = qWith(P_SQ, { a:[arm(P_SQ.p, P_SQ.n, 70, -100)] }); q.x = bl([54,89], hand(q)); return q; })()],
    ["Mit beiden Füßen auf das Band treten und die Enden an den Schultern halten.|Hüfte nach hinten unten, Knie zeigen in Fußrichtung, Oberkörper aufrecht.|Mit Druck durch die Füße wieder aufstehen.",
     "Stand on the band with both feet and hold the ends at your shoulders.|Sit your hips back and down, knees tracking over your toes, torso upright.|Drive through your feet to stand up."],
    ["Fersen bleiben am Boden, Brust offen.|Knie in Richtung der Zehen.", "Die Knie nach innen fallen lassen oder die Fersen heben.",
     "Heels stay down, chest open.|Knees track over your toes.", "Letting your knees cave in or lifting your heels."],
    ["Oberschenkel vorn, Gesäß", "Oberschenkel hinten, Rumpf, Schultern", "Quads, glutes", "Hamstrings, core, shoulders"],
    "kniebeuge squat");

  E("band-prone-leg-curl", "Beinbeugen im Liegen mit Band", "Prone Band Leg Curl", "legs", 3, 30, 1,
    "Bauchlage, Band am Fuß, Ferse zum Gesäß", "Lie face down, band on your foot, heel to glute",
    1, 1, "kraft",
    [(function(){ var q = qWith(P_LF, {}); q.x = bl([6,86], fuss(q,0)); return q; })(),
     (function(){ var q = qWith(P_LF, { l:[[70,86,62,67,56,63]] }); q.x = bl([6,86], fuss(q,0)); return q; })()],
    ["Auf den Bauch legen, das Band vorn befestigen oder mit den Händen halten und um einen Fuß legen.|Hüfte bleibt am Boden.|Die Ferse zum Gesäß ziehen, kurz halten und langsam strecken. Nach der Hälfte die Seite wechseln.",
     "Lie face down, anchor the band in front of you or hold it in your hands and loop it around one foot.|Keep your hips on the floor.|Pull your heel towards your glute, pause and extend slowly. Switch sides halfway."],
    ["Hüfte flach am Boden, Bauch leicht angespannt.|Langsam beugen und strecken.", "Das Becken hebt sich, um Schwung zu holen.",
     "Hips flat on the floor, core lightly braced.|Bend and extend slowly.", "Lifting your pelvis to get momentum."],
    ["Oberschenkel hinten", "Waden, Gesäß", "Hamstrings", "Calves, glutes"],
    "beinbeuger leg curl");

  E("band-lunge-squat", "Ausfallschritt mit Band", "Band Split Squat", "legs", 3, 30, 1,
    "Vorderen Fuß auf das Band, Enden an den Schultern", "Front foot on the band, ends at your shoulders",
    2, 2, "kraft",
    [(function(){ var q = S([48,50], -90, [[65,95],[115,105]], [[70,-100]]); q.x = bl([58,89], hand(q)); return q; })(),
     (function(){ var q = S([48,62], -90, [[15,100],[125,170]], [[70,-100]]); q.x = bl([64,89], hand(q)); return q; })()],
    ["Mit dem vorderen Fuß auf die Mitte des Bandes treten, ein großer Schritt zurück mit dem anderen Bein. Die Enden an den Schultern halten.|Aufrecht senken, bis beide Knie etwa 90° gebeugt sind.|Mit Druck durch den vorderen Fuß wieder hochkommen. Nach der Hälfte die Seite wechseln.",
     "Stand with your front foot on the middle of the band and take a big step back with the other leg. Hold the ends at your shoulders.|Lower straight down until both knees are bent to about 90°.|Drive through your front foot to rise. Switch sides halfway."],
    ["Oberkörper aufrecht, vorderes Knie über dem Fuß.|Gewicht auf der ganzen Fußsohle vorn.", "Das vordere Knie nach innen fallen lassen oder nach vorn kippen.",
     "Torso upright, front knee over your foot.|Weight over your whole front foot.", "Letting your front knee cave in or tipping forward."],
    ["Oberschenkel vorn, Gesäß", "Oberschenkel hinten, Waden, Rumpf", "Quads, glutes", "Hamstrings, calves, core"],
    "ausfallschritt lunge split squat");

  E("band-lying-leg-press", "Beinstrecken im Liegen mit Band", "Lying Band Leg Press", "legs", 3, 30, 1,
    "Band um den Fuß, Bein gegen den Widerstand strecken", "Band around your foot, press your leg out against the resistance",
    1, 1, "kraft",
    [(function(){ var q = S([46,86], 180, [[-60,-120,[-6,-4]],[-49,62]], [[-70,-20]], null, { h:[14,83], len:22 }); q.x = bl(fuss(q,0), hand(q)); return q; })(),
     (function(){ var q = S([46,86], 180, [[-70,-70,[-6,-4]],[-49,62]], [[-70,-20]], null, { h:[14,83], len:22 }); q.x = bl(fuss(q,0), hand(q)); return q; })()],
    ["Auf den Rücken legen, ein Bein anwinkeln und das Band um den Fuß legen. Die Enden mit beiden Händen nah an der Brust halten.|Das andere Bein bleibt angewinkelt am Boden.|Das Bein nach oben strecken, kurz halten und langsam wieder beugen. Nach der Hälfte die Seite wechseln.",
     "Lie on your back, bend one leg and loop the band around the foot. Hold the ends in both hands close to your chest.|The other leg stays bent on the floor.|Extend your leg upwards, pause and bend slowly. Switch sides halfway."],
    ["Rücken und Kopf bleiben am Boden.|Bein langsam strecken, Knie nicht durchdrücken.", "Das Becken vom Boden heben oder das Knie überstrecken.",
     "Back and head stay on the floor.|Extend slowly, don't lock the knee.", "Lifting your hips or locking your knee."],
    ["Oberschenkel vorn", "Gesäß, Hüftbeuger", "Quads", "Glutes, hip flexors"],
    "beinpresse beinstrecker liegend");

  /* ===== zweite Ansicht (Info-Karte zeigt zwei Figuren) ===== */
  function posen(id){ return BAND.filter(function(e){ return e.id === id; })[0].poses; }
  /* Drehung im Sitzen von vorn: Hände links ↔ rechts, das Band läuft von den Füßen zu den Händen (zwei Posen mit je eigenem Band) */
  function rtBand(q){ return qWith(q, { x:bl(fuss(q,0), hand(q))+bl(fuss(q,1), hand(q)) }); }
  /* kniend von vorn: die Hände wandern von der Befestigung weg und zurück */
  var KP = [50,66], KN = [50,38], KB = [[46,86,44,88],[54,86,56,88]];
  function knieVorn(armen){ var q = Q(null, KN.slice(), KP.slice(), KB.map(function(l){ return l.slice(); }),
    armen.map(function(a){ return arm(KP, KN, a[0], a[1]); }), "", true); q.x = anker(92,44)+bl([92,44], hand(q,0)); return q; }
  /* Kniebeuge von vorn: Knie nach außen, Band unter den Füßen zu den Händen an den Schultern */
  function squatVorn(tief){
    var arme = [[150,-100],[30,-80]];
    var q = tief ? Q(null, [50,36], [50,64], [[36,76,41,89,35,89],[64,76,59,89,65,89]], [], "", true)
                 : Q(null, FN.slice(), FP.slice(), FL.map(function(l){ return l.slice(); }), [], "", true);
    q.a = arme.map(function(a){ return arm(q.p, q.n, a[0], a[1]); });
    q.x = bl([42,89], hand(q,0))+bl([58,89], hand(q,1));
    return q;
  }
  ILLU_VIEW2["band-russian-twist"] = { typ:"front", p:[rtBand(RT_FL), rtBand(RT_FR)] };
  ILLU_VIEW2["band-kneeling-twist"] = { typ:"front", p:[knieVorn([[5,-5],[-5,5]]), knieVorn([[185,175],[175,185]])] };
  ILLU_VIEW2["band-squat"] = { typ:"front", p:[squatVorn(false), squatVorn(true)] };
  ILLU_VIEW2["band-hammer-curl"] = { typ:"front", p:posen("band-biceps-curl") };
  ILLU_VIEW2["band-biceps-curl"] = { typ:"side", haupt:"front", p:posen("band-hammer-curl") };

  /* ===== eintragen ===== */
  BAND.forEach(function(e){
    EXERCISE_ROWS.push([e.id, e.de, e.en, e.cats, e.rounds, e.work, e.side ? 1 : 0, e.hDe, e.hEn]);
    EX_LEVEL[e.id] = e.lvl;
    if(e.int !== 2) EX_INT[e.id] = e.int;
    EX_EQUIP[e.id] = e.id === "band-assisted-pull-up" ? "band bar" : "band";
    if(e.main !== "kraft") EX_MAIN_ROWS[e.main] += " "+e.id;
    ILLU_POSES[e.id] = e.poses;
    EX_INFO[e.id] = e.info;
    EX_POSTURE[e.id] = e.post;
    EX_MUSCLES[e.id] = e.mus;
    EX_SUCH_ALIAS[e.id] = (e.such+" theraband gummiband fitnessband widerstandsband band").trim();
  });
  /* Ketten „leichter / schwerer“ */
  LZ_KETTEN.push(["push-ups", "band-push-ups"]);
  LZ_KETTEN.push(["band-assisted-pull-up", "pull-ups"]);
  LZ_KETTEN.push(["air-squats", "band-squat"]);
  /* fertige Workouts mit dem Band: Reihenfolge so, dass sich die Muskelgruppen abwechseln */
  LIB_WORKOUT_ROWS.push(
    ["band-full-body","Ganzkörper mit Band","Full Body with Band","mix","band-squat band-standing-row band-push-ups band-shoulder-press band-biceps-curl band-triceps-pressdown band-crunch",20,"3/40/20"],
    ["band-upper","Oberkörper mit Band","Upper Body with Band","arms","band-standing-row band-chest-fly band-reverse-fly band-lateral-raise band-hammer-curl band-triceps-kickback",20,"3/40/20"],
    ["band-legs-glutes","Beine & Po mit Band","Legs & Glutes with Band","legs","band-squat band-lunge-squat band-glute-bridge band-donkey-kick band-leg-abduction band-clamshell",20,"3/40/20"],
    ["band-core","Rumpf mit Band","Core with Band","core","band-russian-twist band-kneeling-twist band-side-bend band-crunch band-kneeling-crunch",20,"3/40/20"]
  );
})();
window.BLOC_DATEN = {
  EX_ALIAS:EX_ALIAS,
  LIB_CATS:LIB_CATS,
  EXERCISE_ROWS:EXERCISE_ROWS,
  LIB_WORKOUT_ROWS:LIB_WORKOUT_ROWS,
  EX_LEVEL:EX_LEVEL,
  EX_EQUIP:EX_EQUIP,
  LZ_KETTEN:LZ_KETTEN,
  MAIN_CATS:MAIN_CATS,
  EX_MAIN_ROWS:EX_MAIN_ROWS,
  EQUIPS:EQUIPS,
  EX_SUCH_ALIAS:EX_SUCH_ALIAS,
  Q:Q,
  qSwap:qSwap,
  qMirror:qMirror,
  qShift:qShift,
  qWith:qWith,
  gHand:gHand,
  gDB:gDB,
  gKB:gKB,
  gBar:gBar,
  gBox:gBox,
  gWall:gWall,
  gPole:gPole,
  gBench:gBench,
  P_ST:P_ST,
  P_STF:P_STF,
  P_STH:P_STH,
  P_STUP:P_STUP,
  P_SQ:P_SQ,
  P_SQH:P_SQH,
  P_DSQ:P_DSQ,
  P_JUMP:P_JUMP,
  P_JUP:P_JUP,
  P_PH:P_PH,
  P_PL:P_PL,
  P_FP:P_FP,
  P_LB:P_LB,
  P_LBK:P_LBK,
  P_LF:P_LF,
  P_HG:P_HG,
  P_Q4:P_Q4,
  P_F:P_F,
  P_HANG:P_HANG,
  P_PULL:P_PULL,
  P_L0:P_L0,
  P_L1:P_L1,
  P_WALK1:P_WALK1,
  ILLU_POSES:ILLU_POSES,
  P_FLEGS:P_FLEGS,
  P_HANGS:P_HANGS,
  G_ROW:G_ROW,
  G_PB:G_PB,
  G_SB:G_SB,
  G_KB:G_KB,
  G_PT:G_PT,
  G_MONKEY:G_MONKEY,
  qScale:qScale,
  J_ST:J_ST,
  J_SQB:J_SQB,
  J_SQF:J_SQF,
  J_AIR:J_AIR,
  J_TUCK:J_TUCK,
  B_SQH:B_SQH,
  B_PL:B_PL,
  B_PUL:B_PUL,
  BP_HANG:BP_HANG,
  BP_PULL:BP_PULL,
  jSeq:jSeq,
  ILLU_SEQ:ILLU_SEQ,
  qSide:qSide,
  qTwist:qTwist,
  gBall:gBall,
  RT_SC:RT_SC,
  RT_ST:RT_ST,
  RT_BEINE:RT_BEINE,
  RT_FL:RT_FL,
  RT_FC:RT_FC,
  RT_FR:RT_FR,
  RT_FLC:RT_FLC,
  RT_FRC:RT_FRC,
  V_ARCH:V_ARCH,
  V_SNOW:V_SNOW,
  ILLU_VIEW2:ILLU_VIEW2,
  EX_INFO:EX_INFO,
  EX_POSTURE:EX_POSTURE,
  EX_MUSCLES:EX_MUSCLES,
  REP_PSEUDO:REP_PSEUDO,
  AUFWAERM_IDS:AUFWAERM_IDS,
  AUFWAERM_UEBUNGEN:AUFWAERM_UEBUNGEN,
  REP_EINHEITEN:REP_EINHEITEN, REP_EINHEIT_NAMEN:REP_EINHEIT_NAMEN, REP_ROUTEN:REP_ROUTEN,
  REP_WORKOUT_ROWS:REP_WORKOUT_ROWS,
  EX_INT:EX_INT,
  STUDIO_GRUPPEN:STUDIO_GRUPPEN,
  STUDIO_ZIEL:STUDIO_ZIEL,
  LIB_FOKUS_TAUSCH:LIB_FOKUS_TAUSCH
};
})();
