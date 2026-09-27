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
  ["plank-burpees","Plank Burpees","Plank Burpees","cardio",6,30,0,"Ohne Liegestütz und Sprung möglich","Can be done without push-up and jump"],
  ["burpee-squat-jumps","Burpee Squat Jumps","Burpee Squat Jumps","cardio",5,30,0,"Fortgeschritten","Advanced"],
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
  ["cobra-lift","Cobra Lift","Cobra Lift","back",6,20,0,"Nicht ins Hohlkreuz drücken","Don't overarch your lower back"],
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
  ["burpee-challenge","Burpee-Challenge","Burpee Challenge","cardio","burpees plank-burpees burpee-squat-jumps stand-up-jumps burpees",30,"3/40/20"],
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
  ["advanced-60","Advanced 60","Advanced 60","mix","burpee-squat-jumps pistol-squats archer-push-ups tuck-jumps dragon-flags clap-push-ups bulgarian-split-squats pike-push-ups frogs hollow-hold cossack-squats jackknives",120]
];

/* Schwierigkeit (1 Einsteiger, 2 Mittel, 3 Fortgeschritten) und Ausrüstung je Übung.
   Ausrüstung: "none" = ohne Geräte (Stuhl, Stufe oder Wand reichen), sonst db/kb/bar - mehrere = eins davon genügt. */
var EX_LEVEL = {
  "burpees":2,"jump-squats":2,"mountain-climbers":2,"high-knees":1,"jumping-jacks":1,"skater-jumps":2,"plank-burpees":1,
  "burpee-squat-jumps":3,"frogs":3,"stand-up-jumps":3,"lateral-hops":2,"fast-feet":1,"box-step-ups":1,"sprint-in-place":2,
  "goblet-squat":1,"kb-swing":2,"db-thruster":2,"romanian-deadlift":2,"db-deadlift":1,"bent-over-row":1,"one-arm-row":1,"floor-press":1,
  "shoulder-press":1,"push-press":2,"weighted-reverse-lunge":2,"front-rack-carry":2,"farmer-carry":1,"kb-clean":3,"renegade-row":3,
  "push-ups":2,"pike-push-ups":3,"triceps-dips":2,"squat-hold":1,"walking-lunges":2,"reverse-lunges":1,"side-lunges":2,"cossack-squats":3,
  "deep-squats":1,"pistol-assist":3,"plank-steps":2,"bear-crawl":2,"wall-sit":1,"calf-raises":1,"glute-bridge":1,
  "pull-ups":3,"negative-pull-ups":2,"inverted-rows":2,"superman-hold":1,"reverse-snow-angels":1,"bird-dog":1,"prone-y-raise":1,
  "prone-t-raise":1,"good-mornings":1,"swimmers":1,"cobra-lift":1,"scapular-push-ups":1,"scapular-pull-ups":2,"dead-hang":1,
  "air-squats":1,"split-squats":2,"bulgarian-split-squats":3,"forward-lunges":2,"single-leg-glute-bridge":2,"lateral-lunge-pulses":2,
  "plank":1,"side-plank":2,"dead-bug":1,"bicycle-crunches":1,"leg-raises":2,"jackknives":3,"side-jackknives":3,
  "hollow-hold":3,"reverse-crunch":2,"russian-twists":2,"sit-ups":1,"toe-touches":1,"plank-shoulder-taps":2,"toes-to-bar":3,
  "neck-stretch":1,"shoulder-stretch":1,"triceps-stretch":1,"biceps-stretch":1,"chest-stretch":1,"wrist-stretch":1,"side-bend":1,
  "cat-cow":1,"childs-pose":1,"sphinx-stretch":1,"downward-dog":1,"spinal-twist":1,"forward-fold":1,"hip-flexor-stretch":1,
  "quad-stretch":1,"hamstring-stretch":1,"calf-stretch":1,"figure-four":1,"pigeon-stretch":2,"butterfly-stretch":1,"worlds-greatest":2,
  "burpee-pull-ups":3
};
var EX_EQUIP = {
  "goblet-squat":"kb db","kb-swing":"kb","db-thruster":"db","romanian-deadlift":"db kb","db-deadlift":"db kb","bent-over-row":"db",
  "one-arm-row":"db","triceps-curls":"db","floor-press":"db","shoulder-press":"db","push-press":"db","weighted-reverse-lunge":"db kb","front-rack-carry":"kb db",
  "farmer-carry":"db kb","kb-clean":"kb","renegade-row":"db",
  "pull-ups":"bar","negative-pull-ups":"bar","inverted-rows":"bar","scapular-pull-ups":"bar","dead-hang":"bar","toes-to-bar":"bar",
  "chin-ups":"bar","commando-pull-ups":"bar","parallel-bar-dips":"dip","support-hold":"dip",
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
  ausdauer:"box-step-ups burpee-squat-jumps burpees fast-feet frogs high-knees jump-squats jumping-jacks lateral-hops mountain-climbers plank-burpees skater-jumps sprint-in-place stand-up-jumps tuck-jumps",
  rumpf:"bicycle-crunches dead-bug dragon-flags hollow-hold leg-raises plank plank-shoulder-taps reverse-crunch russian-twists side-jackknives side-plank sit-ups toe-touches jackknives",
  stange:"chin-ups commando-pull-ups dead-hang hanging-knee-raise hanging-l-sit hanging-leg-raise inverted-rows l-sit monkey-bar-traverse muscle-ups burpee-pull-ups negative-pull-ups parallel-bar-dips pull-ups scapular-pull-ups skin-the-cat support-hold toes-to-bar windshield-wipers",
  stretch:"hamstring-stretch biceps-stretch chest-stretch spinal-twist figure-four wrist-stretch downward-dog hip-flexor-stretch cat-cow childs-pose neck-stretch quad-stretch butterfly-stretch shoulder-stretch side-bend sphinx-stretch pigeon-stretch triceps-stretch forward-fold calf-stretch worlds-greatest arm-circles"
};

var EQUIPS = [
  { id:"none", de:"Ohne Geräte", en:"No equipment" },
  { id:"db",   de:"Kurzhantel",  en:"Dumbbell" },
  { id:"kb",   de:"Kettlebell",  en:"Kettlebell" },
  { id:"bar",  de:"Stange",      en:"Bar" },
  { id:"dip",  de:"Dip-Barren / Parallettes", en:"Dip bars / parallettes" }
];

/* weitere Suchbegriffe, z. B. der frühere Name */
var EX_SUCH_ALIAS = { "russian-twists":"russian twist twists russische drehung russischer" };

/* ---------- Piktogramme ----------
   Jede Übung hat zwei Posen, die sich abwechseln (bei Halteübungen eine). Eine Pose beschreibt
   Gelenkpunkte im Feld 0..100 (Boden bei y=89, Blick nach rechts):
   Q(Kopf|null, Nacken, Hüfte, Beine [[Knie x,y, Knöchel x,y, (Zehe x,y)]], Arme [[Ellbogen x,y, Hand x,y]], Geräte, frontal)
   Kopf null = in Verlängerung der Wirbelsäule. Das zweite Bein/der zweite Arm liegt „hinten“ und wird
   blasser gezeichnet - außer bei frontalen Ansichten. */
function Q(h, n, p, l, a, x, f){ return { h:h, n:n, p:p, l:l||[], a:a||[], x:x||"", f:!!f }; }
function qSwap(q){ return Q(q.h, q.n, q.p, q.l.slice().reverse(), q.a.slice().reverse(), q.x, q.f); }
function qMirror(q){
  function mx(arr){ return arr.map(function(v, i){ return i%2===0 ? 100-v : v; }); }
  return Q(q.h ? mx(q.h) : null, mx(q.n), mx(q.p), q.l.map(mx), q.a.map(mx), q.x, q.f);
}
function qShift(q, dx, dy){
  function sh(arr){ return arr.map(function(v, i){ return i%2===0 ? v+dx : v+dy; }); }
  return Q(q.h ? sh(q.h) : null, sh(q.n), sh(q.p), q.l.map(sh), q.a.map(sh), q.x, q.f);
}
function qWith(q, o){ return Q("h" in o ? o.h : q.h, o.n||q.n, o.p||q.p, o.l||q.l, o.a||q.a, "x" in o ? o.x : q.x, "f" in o ? o.f : q.f); }
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
var P_LF    = Q(null,[24,83],[52,84],[[70,86,88,87,92,89]],[[14,88,4,88]]);   // Bauchlage
var P_HG    = Q(null,[64,40],[40,50],[[44,70,44,89,52,89]],[[62,54,61,66]]);  // Hüftbeuge
var P_Q4    = Q(null,[66,66],[40,66],[[40,88,22,88,18,89]],[[67,78,68,89]]);  // Vierfüßler
var P_F     = Q(null,[50,20],[50,52],[[46,70,45,89,39,89],[54,70,55,89,61,89]],[[44,34,42,48],[56,34,58,48]],"",true);
var P_HANG  = Q(null,[50,30],[50,58],[[48,72,48,84],[52,72,52,84]],[[40,21,34,6],[60,21,66,6]], gBar(6,24,76), true);
var P_PULL  = Q([50,5],[50,14],[50,42],[[48,58,48,72],[52,58,52,72]],[[34,20,42,6],[66,20,58,6]], gBar(6,24,76), true);
var P_L0    = P_STH;
var P_L1    = Q(null,[48,32],[48,62],[[66,63,66,89,74,89],[36,85,20,87,18,89]],[[55,48,49,57]]);
var P_WALK1 = Q(null,[50,20],[50,50],[[57,69,62,89,70,89],[43,69,38,89,46,89]],[[52,34,53,47]]);

var ILLU_POSES = {
  /* Cardio */
  "burpees":            [P_STUP, P_PH],
  "jump-squats":        [P_SQ, P_JUMP],
  "mountain-climbers":  [qWith(P_PH,{ l:[[28,78,12,86,9,89],[58,76,48,86,46,89]] }), qWith(P_PH,{ l:[[58,76,48,86,46,89],[28,78,12,86,9,89]] })],
  "high-knees":         [Q(null,[50,20],[50,50],[[68,52,68,70,75,70],[50,70,50,89,58,89]],[[44,32,40,42],[57,30,63,23]]),
                         Q(null,[50,20],[50,50],[[50,70,50,89,58,89],[68,52,68,70,75,70]],[[57,30,63,23],[44,32,40,42]])],
  "jumping-jacks":      [P_F, qWith(P_F,{ l:[[42,70,33,89,27,89],[58,70,67,89,73,89]], a:[[40,16,33,5],[60,16,67,5]] })],
  "skater-jumps":       [Q(null,[58,30],[54,56],[[58,72,60,89,66,89],[46,72,38,84,34,84]],[[48,42,40,48],[66,36,74,30]],"",true),
                         qMirror(Q(null,[58,30],[54,56],[[58,72,60,89,66,89],[46,72,38,84,34,84]],[[48,42,40,48],[66,36,74,30]],"",true))],
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
  "reverse-lunges":     [P_L0, P_L1],
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
  "scapular-pull-ups":  [P_HANG, qWith(P_HANG,{ n:[50,26], p:[50,54], l:[[48,68,48,80],[52,68,52,80]] })],
  "dead-hang":          [P_HANG, null],

  /* Beine */
  "air-squats":         [P_STF, P_SQ],
  "split-squats":       [Q(null,[48,18],[48,48],[[58,68,64,89,72,89],[40,68,32,86,28,89]],[[55,33,49,43]]),
                         Q(null,[48,32],[48,62],[[64,64,64,89,72,89],[38,82,26,86,22,89]],[[55,47,49,57]])],
  "bulgarian-split-squats": [Q(null,[50,18],[50,48],[[58,68,62,89,70,89],[38,62,26,70,20,70]],[[57,33,51,43]], gBench(6,30,70)),
                         Q(null,[50,32],[50,62],[[66,64,66,89,74,89],[40,80,26,70,20,70]],[[57,47,51,57]], gBench(6,30,70))],
  "forward-lunges":     [P_L0, qMirror(qMirror(P_L1))],
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
                         Q([57,24],[50,30],[50,58],[[66,56,66,72,72,72]],[[47,19,46,6]], gBar(6,30,70))]
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
  "chin-ups":           [P_HANG, P_PULL],
  "commando-pull-ups":  [P_HANGS, Q([60,8],[50,16],[50,44],[[50,60,50,74]],[[44,14,46,6]], gBar(6,30,70))],
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
  "pistol-squats":      [qWith(P_ST,{ l:[[50,70,50,89,58,89],[62,62,68,78,74,76]], a:[[63,25,76,25]] }), Q(null,[48,46],[40,72],[[56,66,50,89,58,89],[58,74,76,74,80,70]],[[62,48,76,48]])],
  "dragon-flags":       [Q([16,82],[24,84],[40,60],[[52,42,62,26,64,22]],[[14,86,8,82]]), Q([16,82],[24,84],[46,76],[[64,70,84,64,86,60]],[[14,86,8,82]])],
  "clap-push-ups":      [P_PL, qWith(qShift(P_PH,0,-8),{ a:[[72,62,76,70]] })],
  "tuck-jumps":         [P_SQ, Q(null,[50,14],[50,42],[[64,40,58,54,62,56]],[[58,28,64,34]])]
});
Object.assign(ILLU_POSES, {
  "reverse-crunch": [qWith(P_LB,{ l:[[52,66,68,66]] }), Q(null,[22,84],[44,80],[[42,62,56,56]],[[32,87,44,87]])]
});
/* ---------- Sprünge und Burpees ----------
   Einheitliche Proportionen (Rumpf 30, Oberschenkel 21, Unterschenkel 19, Fuß 7, Ober-/Unterarm je 12),
   damit beim Übergang nichts „wächst“. Für Sprünge wird die Figur verkleinert (qScale, Fixpunkt Boden-Mitte),
   damit Kopf und Arme in der Luft im Bild bleiben. Abläufe mit mehreren Phasen stehen in ILLU_SEQ:
   k = Posen der Reihe nach (danach wieder von vorn), t = je Phase [halten s, Übergang s, Easing]. */
function qScale(q, k){
  function sc(arr){ return arr.map(function(v, i){ return i%2===0 ? +(50+(v-50)*k).toFixed(1) : +(89-(89-v)*k).toFixed(1); }); }
  return Q(q.h ? sc(q.h) : null, sc(q.n), sc(q.p), q.l.map(sc), q.a.map(sc), q.x, q.f);
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
var ILLU_SEQ = {
  "jump-squats":  { k:jSeq([J_SQB, J_AIR, J_SQF]), t:[[.22,.32,"o"],[.06,.36,"i"],[.18,.3]] },
  "tuck-jumps":   { k:jSeq([J_SQB, J_TUCK, J_SQF]), t:[[.2,.3,"o"],[.08,.34,"i"],[.16,.3]] },
  "burpees":      { k:jSeq([J_ST, B_SQH, B_PL, B_PUL, B_PL, B_SQH, J_AIR]), t:[[.2,.38],[.04,.28],[.06,.3],[.08,.3],[.04,.28],[.04,.3,"o"],[.06,.36,"i"]] },
  "plank-burpees":{ k:[J_ST, B_SQH, B_PL, B_SQH], t:[[.25,.45],[.06,.4],[.3,.4],[.06,.45]] },
  "burpee-squat-jumps": { k:jSeq([J_ST, B_SQH, B_PL, B_PUL, B_PL, B_SQH, J_SQB, J_AIR]), t:[[.2,.38],[.04,.28],[.06,.3],[.08,.3],[.04,.28],[.04,.26],[.06,.3,"o"],[.06,.38,"i"]] },
  "frogs":        { k:jSeq([B_SQH, J_AIR]), t:[[.26,.34,"o"],[.06,.42,"i"]] },
  "stand-up-jumps": { k:jSeq([P_LBK, J_SQF, J_AIR, J_SQF]), t:[[.25,.5],[.04,.3,"o"],[.06,.36,"i"],[.1,.5]] },
  "burpee-pull-ups": { k:jSeq([J_ST, B_SQH, B_PL, B_PUL, B_PL, B_SQH, BP_HANG, BP_PULL, BP_HANG], .78).map(function(q){ return qWith(q, { x:gBar(8,26,74) }); }),
                       t:[[.18,.34],[.03,.26],[.06,.3],[.08,.3],[.03,.26],[.03,.32,"o"],[.1,.45],[.16,.45],[.06,.4,"i"]] }
};
/* Standbilder (Listen) zeigen eine typische Phase */
Object.assign(ILLU_POSES, {
  "jump-squats": [ILLU_SEQ["jump-squats"].k[0], ILLU_SEQ["jump-squats"].k[1]],
  "tuck-jumps":  [ILLU_SEQ["tuck-jumps"].k[1], ILLU_SEQ["tuck-jumps"].k[0]],
  "burpees":     [ILLU_SEQ["burpees"].k[2], ILLU_SEQ["burpees"].k[6]],
  "plank-burpees": [B_SQH, B_PL],
  "burpee-squat-jumps": [ILLU_SEQ["burpee-squat-jumps"].k[7], ILLU_SEQ["burpee-squat-jumps"].k[2]],
  "frogs":       [ILLU_SEQ["frogs"].k[0], ILLU_SEQ["frogs"].k[1]],
  "stand-up-jumps": [ILLU_SEQ["stand-up-jumps"].k[0], ILLU_SEQ["stand-up-jumps"].k[2]],
  "burpee-pull-ups": [ILLU_SEQ["burpee-pull-ups"].k[7], ILLU_SEQ["burpee-pull-ups"].k[2]]
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
var ILLU_VIEW2 = {
  "russian-twists":   { typ:"front", p:[RT_FL, RT_FR], seq:{ k:[RT_FL, RT_FLC, RT_FC, RT_FRC, RT_FR, RT_FRC, RT_FC, RT_FLC],
                         t:[[.14,.2,"i"],[0,.18,"l"],[0,.18,"l"],[0,.2,"o"],[.14,.2,"i"],[0,.18,"l"],[0,.18,"l"],[0,.2,"o"]] } },
  "archer-push-ups":  { typ:"top",   p:[V_ARCH, Q(null,[60,33],[55,64],[[52,79,50,94],[57,79,56,94]],[[70,46,78,38],[41,37,22,38]],"",true)] },
  "shoulder-press":   { typ:"front", p:[Q(null,[50,28],[50,58],[[46,74,45,89,39,89],[54,74,55,89,61,89]],[[37,36,37,24],[63,36,63,24]], gDB(37,23)+gDB(63,23), true),
                                        Q(null,[50,28],[50,58],[[46,74,45,89,39,89],[54,74,55,89,61,89]],[[40,17,42,5],[60,17,58,5]], gDB(42,5)+gDB(58,5), true)] },
  "reverse-snow-angels": { typ:"top", p:[V_SNOW, qWith(V_SNOW,{ a:[[38,14,44,4],[62,14,56,4]] })] },
  "spinal-twist":     { typ:"top",   p:[Q([44,15],[50,24],[50,56],[[66,58,62,74],[68,66,64,82]],[[36,27,20,27],[64,27,80,27]],"",true), null] }
};

/* Ausführliche Anleitung je Übung: [Deutsch, Englisch], Schritte mit | getrennt */
var EX_INFO = {
  "burpees":["Aus dem Stand in die Hocke gehen und die Hände vor den Füßen aufsetzen.|Beine nach hinten in den Liegestütz springen, Körper gerade halten, und einen Liegestütz machen.|Füße zurück zu den Händen springen und aus der Hocke hochspringen, Arme nach oben.","From standing, squat down and place your hands in front of your feet.|Jump your feet back into a plank, keep your body straight and do a push-up.|Jump your feet back to your hands and jump up, arms overhead."],
  "jump-squats":["Hüftbreit stehen, in die Kniebeuge gehen, Arme hinten.|Explosiv nach oben springen und die Arme mitschwingen.|Weich über die Fußballen landen und direkt in die nächste Kniebeuge abfedern.","Stand hip-width apart and squat down with your arms back.|Jump up explosively, swinging your arms.|Land softly on the balls of your feet and sink straight into the next squat."],
  "mountain-climbers":["Hoher Liegestütz, Hände unter den Schultern.|Abwechselnd ein Knie zügig Richtung Brust ziehen.|Hüfte tief und ruhig halten, nicht mit dem Po nach oben gehen.","High plank, hands under your shoulders.|Drive one knee towards your chest, alternating quickly.|Keep your hips low and steady, don't pike up."],
  "high-knees":["Aufrecht stehen, Rumpf fest.|Auf der Stelle laufen und die Knie bis auf Hüfthöhe ziehen.|Arme wie beim Sprinten gegengleich mitnehmen, auf den Fußballen bleiben.","Stand tall and brace your core.|Run in place, lifting your knees to hip height.|Pump your arms like a sprinter and stay on the balls of your feet."],
  "jumping-jacks":["Aufrecht stehen, Füße zusammen, Arme am Körper.|Mit einem Sprung die Beine grätschen und die Arme über den Kopf führen.|Zurück in die Ausgangsposition springen, locker und rhythmisch bleiben.","Stand tall, feet together, arms at your sides.|Jump your feet out wide and raise your arms overhead.|Jump back to the start, staying light and rhythmic."],
  "skater-jumps":["Auf einem Bein stehen, Knie leicht gebeugt, das andere Bein hinten gekreuzt.|Seitlich auf das andere Bein springen, wie ein Eisschnellläufer.|Weich landen, kurz stabilisieren und zurückspringen.","Stand on one leg, knee slightly bent, other leg crossed behind.|Leap sideways onto the other leg like a speed skater.|Land softly, stabilise briefly and leap back."],
  "plank-burpees":["In die Hocke gehen und die Hände vor den Füßen aufsetzen.|Beine nach hinten in den Liegestütz springen oder steigen.|Zurück in die Hocke und aufrichten, ohne Liegestütz und ohne Sprung.","Squat down and place your hands in front of your feet.|Jump or step your feet back into a plank.|Return to the squat and stand up, no push-up and no jump."],
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
  "cobra-lift":["Auf dem Bauch liegen, Hände neben der Brust.|Brust langsam anheben, die Hüfte bleibt am Boden.|Nur so weit, wie der untere Rücken entspannt bleibt, dann langsam senken.","Lie on your stomach, hands beside your chest.|Slowly lift your chest while your hips stay down.|Only go as high as your lower back stays relaxed, then lower slowly."],
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
  "burpees":["Im Stütz eine Linie von Kopf bis Ferse, Hände unter den Schultern.|Bei der Landung Knie leicht gebeugt, Knie zeigen in Fußrichtung.","Mit durchhängendem Rücken in den Stütz springen.","In the plank, one line from head to heels, hands under your shoulders.|Land with soft knees tracking over your toes.","Jumping back into the plank with a sagging lower back."],
  "jump-squats":["Brust aufrecht, Blick nach vorn, Gewicht auf dem ganzen Fuß.|Knie folgen beim Absprung und bei der Landung der Fußrichtung.","Steifbeinig landen oder die Knie nach innen fallen lassen.","Chest up, eyes forward, weight across the whole foot.|Knees track over your toes on take-off and landing.","Landing stiff-legged or letting your knees cave in."],
  "mountain-climbers":["Schultern über den Händen, Rücken gerade wie im Stütz.|Bauch und Gesäß fest, damit die Hüfte nicht wippt.","Die Hüfte hochschieben oder durchhängen lassen.","Shoulders over your hands, back flat like a plank.|Brace your abs and glutes so your hips don't bounce.","Piking your hips up or letting them sag."],
  "high-knees":["Aufrecht bleiben, nicht nach hinten lehnen.|Leise auf den Fußballen landen, Rumpf fest.","Mit rundem Rücken nach vorn fallen.","Stay tall, don't lean back.|Land quietly on the balls of your feet, core braced.","Hunching forward with a rounded back."],
  "jumping-jacks":["Rumpf aufrecht, Bauch leicht angespannt.|Weich landen, Knie leicht gebeugt und in Fußrichtung.","Mit gestreckten Knien hart landen.","Torso upright, abs lightly braced.|Land softly, knees slightly bent and over your toes.","Landing hard with locked knees."],
  "skater-jumps":["Oberkörper leicht nach vorn, Rücken gerade.|Standknie über dem Fuß, Hüfte stabil.","Das Standknie bei der Landung nach innen knicken lassen.","Lean slightly forward with a flat back.|Standing knee over your foot, hips stable.","Letting the landing knee collapse inward."],
  "plank-burpees":["Im Stütz Kopf, Rücken und Beine in einer Linie.|In der Hocke Brust nach vorn, Rücken lang.","Im Stütz ins Hohlkreuz fallen.","In the plank, head, back and legs in one line.|In the squat, chest forward, back long.","Dropping into an arched lower back in the plank."],
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
  "cobra-lift":["Rückenstrecker","Gesäß, oberer Rücken","Lower back","Glutes, upper back"],
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
var REP_PSEUDO = {
  lauf:   { de:"Laufen", en:"Run",    illu:"sprint-in-place" },
  sprint: { de:"Sprint", en:"Sprint", illu:"sprint-in-place" },
  pause:  { de:"Pause",  en:"Rest",   illu:"" }
};
function mal(n, x){ var a = []; for(var i=0;i<n;i++) a.push(x); return a; }
var REP_WORKOUT_ROWS = [
  ["feldberg","Feldberg","Feldberg",1,[["jumping-jacks",mal(5,30)],["push-ups",mal(5,5)],["side-lunges",mal(5,10)],["sit-ups",mal(5,15)],["air-squats",mal(5,20)]]],
  ["brocken-basis","Brocken Basis","Brocken Basic",1,[["plank-burpees",[40,30,20,10,5]],["air-squats",[40,30,20,10,5]],["sit-ups",[20,15,15,10,5]]]],
  ["brocken","Brocken","Brocken",3,[["burpees",[50,40,30,20,10]],["air-squats",[50,40,30,20,10]],["sit-ups",[50,40,30,20,10]]]],
  ["brocken-kraft","Brocken Kraft","Brocken Strength",3,[["burpee-squat-jumps",[50,40,30,20,10]],["pistol-squats",[50,40,30,20,10]],["jackknives",[50,40,30,20,10]]]],
  ["saentis","Säntis","Säntis",1,[["burpees",mal(3,25)],["lauf",mal(3,"400m")],["air-squats",mal(3,50)],["lauf",mal(3,"400m")]]],
  ["saentis-basis","Säntis Basis","Säntis Basic",1,[["plank-burpees",[25,10,25]],["high-knees",mal(3,50)],["air-squats",[20,30,40]],["high-knees",mal(3,50)]]],
  ["eiger","Eiger","Eiger",2,[["pull-ups",mal(5,7)],["sit-ups",mal(5,7)],["sprint",mal(5,"2×40m")],["pause",mal(5,"60s")]]],
  ["eiger-kraft","Eiger Kraft","Eiger Strength",3,[["muscle-ups",mal(5,7)],["jackknives",mal(5,7)],["sprint",mal(5,"2×40m")],["pause",mal(5,"60s")]]],
  ["grossglockner","Großglockner","Grossglockner",3,[["burpees",[50]],["pull-ups",[50]],["push-ups",[100]],["air-squats",[150]],["burpees",[50]]]],
  ["grossglockner-basis","Großglockner Basis","Grossglockner Basic",2,[["burpees",[25,25]],["pull-ups",[20,10]],["push-ups",[30,10]],["air-squats",[80,40]],["triceps-dips",[20,10]]]],
  ["ortler","Ortler","Ortler",2,[["burpees",[50]],["forward-lunges",[50]],["push-ups",[5]],["air-squats",[100]],["burpees",[50]],["leg-raises",[35]],["sit-ups",[35]],
    ["jumping-jacks",[150]],["jackknives",[15]],["leg-raises",[20]],["jumping-jacks",[50]]]],
  ["matterhorn","Matterhorn","Matterhorn",2,[["lauf",["2km"]],["air-squats",[50]],["burpees",[50]],["mountain-climbers",[50]],["leg-raises",[50]],["tuck-jumps",[100]]]],
  ["matterhorn-ausdauer","Matterhorn Ausdauer","Matterhorn Endurance",1,[["lauf",mal(3,"1km")],["air-squats",mal(3,30)],["plank-burpees",mal(3,20)],["mountain-climbers",mal(3,25)],
    ["leg-raises",mal(3,20)],["tuck-jumps",[15,10,5]]]],
  ["zugspitze","Zugspitze","Zugspitze",1,[["mountain-climbers",[25,20,15,10,5]],["sit-ups",[25,20,15,10,5]],["air-squats",[25,20,15,10,5]],["pause",["25s","20s","15s","10s","5s"]]]],
  ["zugspitze-kraft","Zugspitze Kraft","Zugspitze Strength",3,[["frogs",[25,20,15,10,5]],["jackknives",[25,20,15,10,5]],["pistol-squats",[25,20,15,10,5]],["pause",["25s","20s","15s","10s","5s"]]]],
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


window.BLOC_DATEN = {
  EX_ALIAS:EX_ALIAS,
  LIB_CATS:LIB_CATS,
  EXERCISE_ROWS:EXERCISE_ROWS,
  LIB_WORKOUT_ROWS:LIB_WORKOUT_ROWS,
  EX_LEVEL:EX_LEVEL,
  EX_EQUIP:EX_EQUIP,
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
  REP_WORKOUT_ROWS:REP_WORKOUT_ROWS
};
})();
