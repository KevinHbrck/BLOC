/* BLOC - Programmlogik (ausgelagert aus index.html, 2026-09-29). Braucht daten.js davor. */
(function(){
"use strict";

/* Inhaltsdaten (Übungen, Workouts, Posen) stehen in daten.js - hier unter den gewohnten Namen */
var BLOC_DATEN = window.BLOC_DATEN;
var REP_WORKOUT_ROWS = BLOC_DATEN.REP_WORKOUT_ROWS, REP_PSEUDO = BLOC_DATEN.REP_PSEUDO, AUFWAERM_IDS = BLOC_DATEN.AUFWAERM_IDS,
    AUFWAERM_UEBUNGEN = BLOC_DATEN.AUFWAERM_UEBUNGEN, REP_EINHEITEN = BLOC_DATEN.REP_EINHEITEN,
    REP_EINHEIT_NAMEN = BLOC_DATEN.REP_EINHEIT_NAMEN || {}, REP_ROUTEN = BLOC_DATEN.REP_ROUTEN || [], EX_INT = BLOC_DATEN.EX_INT || {},
    LIB_FOKUS_TAUSCH = BLOC_DATEN.LIB_FOKUS_TAUSCH || {},
    STUDIO_GRUPPEN = BLOC_DATEN.STUDIO_GRUPPEN || [], STUDIO_ZIEL = BLOC_DATEN.STUDIO_ZIEL || {};
var EX_ALIAS = BLOC_DATEN.EX_ALIAS, LIB_CATS = BLOC_DATEN.LIB_CATS, EXERCISE_ROWS = BLOC_DATEN.EXERCISE_ROWS,
    LIB_WORKOUT_ROWS = BLOC_DATEN.LIB_WORKOUT_ROWS, EX_LEVEL = BLOC_DATEN.EX_LEVEL, EX_EQUIP = BLOC_DATEN.EX_EQUIP, MAIN_CATS = BLOC_DATEN.MAIN_CATS,
    EX_MAIN_ROWS = BLOC_DATEN.EX_MAIN_ROWS, EQUIPS = BLOC_DATEN.EQUIPS, EX_SUCH_ALIAS = BLOC_DATEN.EX_SUCH_ALIAS, Q = BLOC_DATEN.Q,
    qSwap = BLOC_DATEN.qSwap, qMirror = BLOC_DATEN.qMirror, qShift = BLOC_DATEN.qShift, qWith = BLOC_DATEN.qWith, gHand = BLOC_DATEN.gHand,
    gDB = BLOC_DATEN.gDB, gKB = BLOC_DATEN.gKB, gBar = BLOC_DATEN.gBar, gBox = BLOC_DATEN.gBox, gWall = BLOC_DATEN.gWall, gPole = BLOC_DATEN.gPole,
    gBench = BLOC_DATEN.gBench, P_ST = BLOC_DATEN.P_ST, P_STF = BLOC_DATEN.P_STF, P_STH = BLOC_DATEN.P_STH, P_STUP = BLOC_DATEN.P_STUP,
    P_SQ = BLOC_DATEN.P_SQ, P_SQH = BLOC_DATEN.P_SQH, P_DSQ = BLOC_DATEN.P_DSQ, P_JUMP = BLOC_DATEN.P_JUMP, P_JUP = BLOC_DATEN.P_JUP,
    P_PH = BLOC_DATEN.P_PH, P_PL = BLOC_DATEN.P_PL, P_FP = BLOC_DATEN.P_FP, P_LB = BLOC_DATEN.P_LB, P_LBK = BLOC_DATEN.P_LBK, P_LF = BLOC_DATEN.P_LF,
    P_HG = BLOC_DATEN.P_HG, P_Q4 = BLOC_DATEN.P_Q4, P_F = BLOC_DATEN.P_F, P_HANG = BLOC_DATEN.P_HANG, P_PULL = BLOC_DATEN.P_PULL,
    P_L0 = BLOC_DATEN.P_L0, P_L1 = BLOC_DATEN.P_L1, P_WALK1 = BLOC_DATEN.P_WALK1, ILLU_POSES = BLOC_DATEN.ILLU_POSES, P_FLEGS = BLOC_DATEN.P_FLEGS,
    P_HANGS = BLOC_DATEN.P_HANGS, G_ROW = BLOC_DATEN.G_ROW, G_PB = BLOC_DATEN.G_PB, G_SB = BLOC_DATEN.G_SB, G_KB = BLOC_DATEN.G_KB,
    G_PT = BLOC_DATEN.G_PT, G_MONKEY = BLOC_DATEN.G_MONKEY, qScale = BLOC_DATEN.qScale, J_ST = BLOC_DATEN.J_ST, J_SQB = BLOC_DATEN.J_SQB,
    J_SQF = BLOC_DATEN.J_SQF, J_AIR = BLOC_DATEN.J_AIR, J_TUCK = BLOC_DATEN.J_TUCK, B_SQH = BLOC_DATEN.B_SQH, B_PL = BLOC_DATEN.B_PL,
    B_PUL = BLOC_DATEN.B_PUL, BP_HANG = BLOC_DATEN.BP_HANG, BP_PULL = BLOC_DATEN.BP_PULL, jSeq = BLOC_DATEN.jSeq, ILLU_SEQ = BLOC_DATEN.ILLU_SEQ,
    qSide = BLOC_DATEN.qSide, qTwist = BLOC_DATEN.qTwist, gBall = BLOC_DATEN.gBall, RT_SC = BLOC_DATEN.RT_SC, RT_ST = BLOC_DATEN.RT_ST,
    RT_BEINE = BLOC_DATEN.RT_BEINE, RT_FL = BLOC_DATEN.RT_FL, RT_FC = BLOC_DATEN.RT_FC, RT_FR = BLOC_DATEN.RT_FR, RT_FLC = BLOC_DATEN.RT_FLC,
    RT_FRC = BLOC_DATEN.RT_FRC, V_ARCH = BLOC_DATEN.V_ARCH, V_SNOW = BLOC_DATEN.V_SNOW, ILLU_VIEW2 = BLOC_DATEN.ILLU_VIEW2,
    EX_INFO = BLOC_DATEN.EX_INFO, EX_POSTURE = BLOC_DATEN.EX_POSTURE, EX_MUSCLES = BLOC_DATEN.EX_MUSCLES;

/* ============ Storage ============ */
var DB_KEY = "sporttimer-data-v1";

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function defaultDB(){
  return {
    blocks: [],
    workouts: [],
    myWorkouts: [],   // eigene Workouts aus Bibliotheksübungen - getrennt von den Timer-Workouts
    customEx: [],     // selbst angelegte Übungen
    history: [],      // nur Übungen der letzten 14 Tage { at, ex:[ids] } - für „Überrasch mich“
    settings: { theme:"system", sound:true, soundStyle:"sanft", space:true, vibration:true, keepAwake:true, countIn:true, volume:0.6, voice:true, voiceMix:true }
  };
}
/* Frühere Versionen hatten „Retro Hell" und „Retro Dunkel" - beide gehen im neuen Retro-Design auf. */
/* 2026-09-29 ausgedünnt: System, Hell, Dunkel, Nacht, C60 - frühere Designs landen beim nächsten Verwandten */
function migrateTheme(t){
  if(t==="retro" || t==="retro-light" || t==="retro-dark") return "kodak";
  if(t==="tapedeck") return "nacht";
  if(t==="klar") return "system";
  return t;
}
/* C60 (intern "kodak"): Vintage-Look mit Walzenzähler statt Fortschrittsring */
function isVintageTheme(){
  return state.db.settings.theme === "kodak";
}

var ICON_SAVE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
var ICON_TRASH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
var ICON_VOLUME = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M16.2 8.8a5 5 0 0 1 0 6.4"/><path d="M19 6a9 9 0 0 1 0 12"/></svg>';
var ICON_DOWNLOAD = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>';
/* Handgezeichnete SVG-Icons statt Unicode-Glyphen: die sitzen unabhängig von
   Schriftart/Plattform immer exakt zentriert und bleiben bei jeder Größe klar erkennbar. */
var ICON_PLAY = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 4.3v15.4c0 .8.9 1.3 1.6.9l12-7.7c.6-.4.6-1.4 0-1.8l-12-7.7c-.7-.4-1.6.1-1.6.9z"/></svg>';
var ICON_PAUSE = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4.5" width="5" height="15" rx="1.2"/><rect x="13.5" y="4.5" width="5" height="15" rx="1.2"/></svg>';
var ICON_SKIP = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M5.5 5.2v13.6c0 .8.9 1.3 1.6.9l9.4-6.8c.6-.4.6-1.3 0-1.8L7.1 4.3c-.7-.4-1.6.1-1.6.9z"/><rect x="17" y="5" width="2.6" height="14" rx="1"/></svg>';
var ICON_RESTART = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';
var ICON_SETTINGS = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2.1 2.1 0 1 1-3 3l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2.1 2.1 0 0 1-4.2 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2.1 2.1 0 1 1-3-3l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2.1 2.1 0 0 1 0-4.2h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2.1 2.1 0 1 1 3-3l.1.1a1.7 1.7 0 0 0 1.9.3H9.5a1.7 1.7 0 0 0 1-1.6V3a2.1 2.1 0 0 1 4.2 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2.1 2.1 0 1 1 3 3l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.7.8 1.2 1.6 1.2H21a2.1 2.1 0 0 1 0 4.2h-.1a1.7 1.7 0 0 0-1.5 1.6z"/></svg>';
var ICON_BACK = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var ICON_CHEV = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
var ICON_BOOK = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>';
var ICON_PLUS = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
/* Workout = mehrere gestapelte Blöcke, Block = einzelne Stoppuhr */
var ICON_SHARE = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/></svg>';
var ICON_WORKOUT = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5l9 4.5 9-4.5"/></svg>';
var ICON_BLOCK = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7.5"/><path d="M12 14v-4"/><path d="M9.5 2.5h5"/><path d="M12 2.5v4"/></svg>';
/* Kassetten-Etikett für das C60-Design (intern "kodak"): rotes C-Signet und Bandtyp - bewusst ohne fremde Marken */
var KODAK_BADGE = '<div class="kodak-badge" aria-hidden="true">'+
  '<svg viewBox="0 0 44 40"><rect width="44" height="40" rx="2.5" fill="#e1251b"/>'+
  '<path d="M24.5 9.5A11 11 0 1 0 24.5 30.5" fill="none" stroke="#fff" stroke-width="6.5"/>'+
  '<g fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="6.2" text-anchor="middle">'+
  '</g></svg>'+
  '<div><span>LOW NOISE</span></div></div>';

/* Auswählbare Klänge: jeweils Liste von Tönen {f:Frequenz, d:Verzögerung(ms), dur:Dauer(ms), v:Lautstärke-Faktor, type:Wellenform} */
/* Bausteine für die natürlich klingenden Stile. Teiltöne als [Frequenzverhältnis, Lautstärke,
   Ausklingdauer relativ zur Notenlänge] - echte Glocken und Klangschalen haben unharmonische
   Obertöne, und die hohen klingen schneller aus als der Grundton. */
var SMALL_BELL_PARTIALS = [[1,1,1],[2.76,.45,.5],[5.4,.2,.28]];
var BOWL_PARTIALS = [[1,1,1],[2.71,.5,.6],[5.15,.22,.34],[8.4,.08,.2]];
/* Klangschale: weicher Anschlag, langes Ausklingen mit Schwebung */
function bowlHit(f, d, v, dur, pan){ return { f:f, d:d, v:v, dur:dur, att:18, partials:BOWL_PARTIALS, beat:1.6, pan:pan||0 }; }
/* Einfacher Zufallsgenerator mit festem Startwert: der Applaus klingt lebendig unregelmäßig, aber jedes Mal gleich */
function seededRandom(seed){
  return function(){ seed = (seed*16807) % 2147483647; return seed/2147483647; };
}
var TRIANGLE_PARTIALS = [[1,.45,1],[2.756,.75,.9],[5.404,1,.75],[8.933,.75,.55],[13.34,.5,.42],[18.64,.28,.3]];
/* Triangel: gebogener Stahlstab, sehr hell und lange klingend */
function triangleHit(f, d, v, dur, pan, beat){ return { f:f, d:d, v:v, dur:dur, att:1, partials:TRIANGLE_PARTIALS, strike:.28, beat:(beat==null ? 2.3 : beat), pan:pan||0 }; }
/* Triangel-Wirbel: der Schlegel schlägt schnell zwischen zwei Seiten hin und her, immer kräftiger */
function triangleRoll(){
  var notes = [];
  for(var i=0;i<18;i++) notes.push(triangleHit(640, i*40, .25 + .35*i/17, 420, (i%2 ? -.2 : .2), 0));
  notes.push(triangleHit(640, 760, .8, 3600));
  return notes;
}
/* Händeklatschen: mehrere schnelle Rauschstöße - die Handflächen treffen nie ganz gleichzeitig.
   Die kurzen Stöße sind von Natur aus leise, deshalb kräftig verstärkt (der Begrenzer fängt Spitzen ab). */
function clap(d, v, pan, f){ return { f:f||1250, d:d, v:v*3, dur:110, noise:true, filterType:"bandpass", q:.8, bursts:[0,9,17,27], pan:pan||0 }; }
/* Applaus: viele Klatscher durcheinander, im ganzen Raum verteilt */
function applause(){
  var notes = [], rnd = seededRandom(11);
  for(var i=0;i<45;i++) notes.push(clap(Math.round(rnd()*2400), .25 + rnd()*.35, (rnd()-.5)*1.4, 950 + rnd()*700));
  return notes;
}

var SOUND_STYLES = {
  /* ---- Natürlich: nachgebaute echte Klangquellen ---- */
  klangschale: { label:"Klangschale", natural:true,
    tick:[{ f:1175, d:0, v:.16, dur:600, att:4, partials:SMALL_BELL_PARTIALS }],
    work:[bowlHit(392, 0, .9, 5000)],
    rest:[bowlHit(294, 0, .75, 4500)],
    blockrest:[bowlHit(330, 0, .8, 4500)],
    prep:[bowlHit(330, 0, .8, 4500)],
    done:[bowlHit(392, 0, .8, 5000, -.2), bowlHit(523, 700, .75, 6000, .2)]
  },
  triangel: { label:"Triangel", natural:true,
    tick:[triangleHit(700, 0, .22, 500, 0, 0)],
    work:[triangleHit(640, 0, .9, 3200)],
    rest:[triangleHit(600, 0, .65, 2400)],
    blockrest:[triangleHit(640, 0, .6, 1200, -.15), triangleHit(640, 180, .6, 2600, .15)],
    prep:[triangleHit(640, 0, .6, 1200, -.15), triangleHit(640, 180, .6, 2600, .15)],
    done: triangleRoll()
  },
  klatschen: { label:"Klatschen", natural:true,
    /* Countdown als Fingerschnippen, am Ende Applaus */
    tick:[{ f:2300, d:0, v:2.2, dur:35, att:1, noise:true, filterType:"bandpass", q:1.5 }, { f:1850, d:0, v:.3, dur:20, att:1 }],
    work:[clap(0, .9), clap(170, .9)],
    rest:[clap(0, .7)],
    blockrest:[clap(0, .75, -.1), clap(150, .75, .1), clap(300, .8, 0)],
    prep:[clap(0, .75, -.1), clap(150, .75, .1), clap(300, .8, 0)],
    done: applause()
  },
  /* ---- Elektronisch ---- */
  sanft: { label:"Sanft",
    tick:[{f:700,d:0,dur:140,v:0.3,type:"sine"}],
    work:[{f:520,d:0,dur:320,v:0.7,type:"sine"}],
    rest:[{f:380,d:0,dur:320,v:0.6,type:"sine"}],
    blockrest:[{f:440,d:0,dur:320,v:0.6,type:"sine"}],
    prep:[{f:440,d:0,dur:320,v:0.6,type:"sine"}],
    done:[{f:520,d:0,dur:260,v:0.7,type:"sine"},{f:660,d:260,dur:360,v:0.75,type:"sine"}]
  },
  arcade: { label:"Arcade",
    tick:[{f:1200,d:0,dur:35,v:0.35,type:"square"}],
    work:[{f:523,d:0,dur:70,v:0.9,type:"square"},{f:659,d:70,dur:70,v:0.9,type:"square"},{f:784,d:140,dur:120,v:1,type:"square"}],
    rest:[{f:392,d:0,dur:100,v:0.6,type:"square"}],
    blockrest:[{f:494,d:0,dur:80,v:0.7,type:"square"},{f:587,d:90,dur:100,v:0.7,type:"square"}],
    prep:[{f:494,d:0,dur:80,v:0.7,type:"square"},{f:587,d:90,dur:100,v:0.7,type:"square"}],
    done:[{f:523,d:0,dur:80,v:0.9,type:"square"},{f:659,d:90,dur:80,v:0.9,type:"square"},{f:784,d:180,dur:80,v:0.9,type:"square"},{f:1046,d:270,dur:260,v:1,type:"square"}]
  },
  weich: { label:"Weich",
    tick:[{f:600,d:0,dur:160,v:0.22,type:"sine"}],
    work:[{f:480,d:0,dur:380,v:0.55,type:"sine"},{f:604,d:0,dur:380,v:0.22,type:"sine"}],
    rest:[{f:360,d:0,dur:380,v:0.45,type:"sine"},{f:453,d:0,dur:380,v:0.18,type:"sine"}],
    blockrest:[{f:400,d:0,dur:380,v:0.45,type:"sine"},{f:504,d:0,dur:380,v:0.18,type:"sine"}],
    prep:[{f:400,d:0,dur:380,v:0.45,type:"sine"},{f:504,d:0,dur:380,v:0.18,type:"sine"}],
    done:[{f:480,d:0,dur:320,v:0.55,type:"sine"},{f:604,d:0,dur:320,v:0.22,type:"sine"},{f:604,d:340,dur:460,v:0.5,type:"sine"},{f:760,d:340,dur:460,v:0.2,type:"sine"}]
  },

};
/* Entfernte Klänge: wer einen davon eingestellt hatte, bekommt den ähnlichsten verbliebenen */
var REMOVED_SOUNDS = { xylophon:"triangel", perkussiv:"klatschen", pfeife:"arcade", gong:"klangschale",
  pong:"arcade", laser:"arcade", sirene:"arcade", klar:"sanft",
  /* 2026-09 auf sechs Klänge reduziert */
  boxglocke:"klangschale", trillerpfeife:"arcade", holzblock:"klatschen", kuechenwecker:"triangel", marimba:"triangel",
  kuhglocke:"triangel", achtbit:"arcade", classic:"sanft", doppel:"arcade", digital:"arcade", glocke:"triangel",
  hupe:"arcade", trommel:"klatschen", ruhe:"weich" };
function migrateSound(key){
  if(SOUND_STYLES[key]) return key;
  return REMOVED_SOUNDS[key] || "sanft";
}

function loadDB(){
  try{
    var raw = localStorage.getItem(DB_KEY);
    if(!raw) return defaultDB();
    var parsed = JSON.parse(raw);
    var db = defaultDB();
    db.blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
    db.workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];
    db.myWorkouts = Array.isArray(parsed.myWorkouts) ? parsed.myWorkouts : [];
    db.customEx = Array.isArray(parsed.customEx) ? parsed.customEx : [];
    db.history = Array.isArray(parsed.history) ? parsed.history : [];
    pruneHistory(db);
    if(parsed.settings) Object.assign(db.settings, parsed.settings);
    db.settings.theme = migrateTheme(db.settings.theme);
    db.settings.soundStyle = migrateSound(db.settings.soundStyle);
    /* Sprachansagen halten auf den meisten Handys Musik anderer Apps (Spotify) an -
       deshalb einmalig aus; wer sie will, schaltet sie bewusst wieder ein */
    if(!db.settings.voiceMix){ db.settings.voice = false; db.settings.voiceMix = true; }
    delete db.settings.lockScreen;   // „Anzeige auf dem Sperrbildschirm“ gibt es nicht mehr
    migrateExIds(db);
    return db;
  }catch(e){ return defaultDB(); }
}

/* Erster Start auf diesem Gerät = noch nichts gespeichert. Nur dann zeigt BLOC die Einführung von selbst;
   wer die App schon eingerichtet hat, findet sie in den Einstellungen. */
var ERSTER_START = (function(){ try{ return !localStorage.getItem(DB_KEY); }catch(e){ return false; } })();
var state = { db: loadDB() };

function save(){ localStorage.setItem(DB_KEY, JSON.stringify(state.db)); }
var speichereDB = save;   // für Stellen, die ein eigenes lokales save() haben (renderWorkoutEdit)
/* IDs zusammengelegter Übungen (EX_ALIAS) in Favoriten, Ausblendungen, eigenen Workouts und Blöcken umschreiben */
function migrateExIds(db){
  function neu(id){ return EX_ALIAS[id] || id; }
  function uniq(a){ return a.filter(function(x, i){ return a.indexOf(x) === i; }); }
  var st = db.settings;
  if(Array.isArray(st.exFavs)) st.exFavs = uniq(st.exFavs.map(neu));
  if(Array.isArray(st.hiddenLib)) st.hiddenLib = uniq(st.hiddenLib.map(function(k){ return k.indexOf("ex:")===0 ? "ex:"+neu(k.slice(3)) : k; }));
  (db.myWorkouts || []).forEach(function(mw){
    (mw.items || []).forEach(function(it, i){
      if(typeof it === "string") mw.items[i] = neu(it);
      else if(it && it.ex) it.ex = neu(it.ex);
    });
  });
  (db.blocks || []).forEach(function(b){ if(b.ex) b.ex = neu(b.ex); });
}

/* ============ Sprache (Deutsch / Englisch) ============ */
var I18N = {
  de: {
    back:"Zurück", settings:"Einstellungen", workouts:"Workouts", untitled:"Ohne Namen",
    blockOne:"Block", blockMany:"Blöcke",
    noWorkouts:"Noch kein Workout angelegt.<br>Tippe unten rechts auf +, um loszulegen.",
    singleBlocks:"Blöcke einzeln starten",
    library:"Air", libEntry:"Übungen & Workouts", libEntrySub:"{e} Übungen · {w} fertige · {m} eigene Workouts",
    libWorkouts:"Workouts", libExercises:"Übungen", catAll:"Alle", catMix:"Gemischt",
    adopt:"Übernehmen", adoptTitle:"Als eigenes Workout kopieren und anpassen",
    adoptBlock:"Als Block", adoptBlockTitle:"Als eigenen Block speichern",
    adoptedBlock:"„{n}“ ist jetzt bei deinen Blöcken.", addedToWorkout:"„{n}“ hinzugefügt.",
    addFromLibrary:"Aus der Bibliothek", startTemplate:"Workout starten",
    hide:"Ausblenden", hiddenN:"{n} ausgeblendet.", showAgain:"Wieder einblenden",
    libEmpty:"Hier ist gerade nichts zu sehen.", blockRestN:"{n} s Blockpause",
    perSide:"je Seite", left:"Links", right:"Rechts",
    libReady:"Fertige", libMine:"Eigene", exCount:"{n} Übungen", adoptMine:"Unter „Meine“ speichern",
    myNew:"Eigenes Workout erstellen", myDefaultName:"Mein Workout", myWorkout:"Eigenes Workout",
    myEmpty:"Noch kein eigenes Workout. Stell dir eins aus den Übungen zusammen.",
    myInWorkout:"Übungen im Workout ({n}) · {d}", myAdd:"Übungen hinzufügen", myRest:"Pause zwischen den Übungen",
    dropHere:"Übungen am Griff ⠿ hierher ziehen oder unten auf + tippen.", dropToRemove:"Hier ablegen zum Entfernen",
    myDelete:"Eigenes Workout löschen", myDeleteQ:"Eigenes Workout löschen?", deletedToast:"„{n}“ gelöscht.",
    spFill:"Überrasch mich: Übungen hinzufügen", spFillHint:"Die Übungen kommen als Blöcke hinten in „{n}“.", spCount:"Anzahl Übungen", spCountUnit:"Übungen",
    spFilled:"{n} Übungen zu „{w}“ hinzugefügt.",
    sortLabel:"Sortieren", sortStd:"Standard", posture:"Haltung", avoid:"Vermeiden",
    shareTitle:"App teilen", shareCopy:"Link kopieren", shareWa:"Per WhatsApp", shareMore:"Weitere Möglichkeiten …",
    shareCopied:"Link kopiert.", shareText:"Schau dir BLOC an – mein Intervall-Timer mit Übungsbibliothek:",
    fCat:"Fokus", equipAny:"Alles", fEquipHintShort:"Was hast du da?",
    favEmpty:"Markiere Workouts, Timer oder Blöcke mit ☆ – sie erscheinen dann hier.", areas:"Bereiche", areasHint:"gedrückt halten zum Sortieren", areasSort:"Reihenfolge der Bereiche", areasSortHint:"Der oberste Bereich steht groß vorn.", moveUp:"Nach oben", moveDown:"Nach unten",
    timers:"Studio", oneTimerWo:"1 Workout", nTimerWo:"{n} Workouts", oneBlock:"1 Block", nBlocks:"{n} Blöcke", htTimers:"Drinnen an Geräten · {n} Übungen · Fortschritt im Blick", mineMy:"Eigene Workouts", mineTimer:"Timer-Workouts", mineBlocks:"Blöcke",
    tabStudio:"Studio", studioHint:"Übung antippen, Gewicht eintragen – den Rest merkt sich die App.",
    stFilter:"Filter · Gruppen & Ausrüstung", stAir:"Air-Übungen einbeziehen", stAirDesc:"Kurzhantel, Kettlebell, Stange und Körpergewicht aus Air. Mit ★ markierte stehen immer oben.", stAirGr:"Air · Körpergewicht", stRecent:"Zuletzt", stFavs:"★ Meine Übungen", stFavHint:"Tipp auf ☆, dann steht die Übung hier oben.", stFree:"Kurzhantel & Kettlebell", stBar:"Stange & Barren", stOwn:"Eigene Übungen",
    stArt_geraet:"Gerät", stArt_kabel:"Kabel", stArt_frei:"Kurzhantel & Kettlebell", stArt_lh:"Langhantel", stArt_stange:"Stange", stOwnNew:"Eigene Übung",
    stSearch:"Übung oder Gerät suchen …", stNoData:"–", stToday:"Heute", stSet:"Satz", stSetDone:"Satz eintragen",
    stKg:"kg", stReps:"Wdh.", stGoal:"Ziel", stPause:"Pause", stSkip:"Weiter", stPauseEnd:"Pause vorbei – nächster Satz!",
    stSuggest:"Zweimal {z} geschafft – nächstes Mal {kg} kg?", stSuggestYes:"Ja, erhöhen", stRaised:"Nächstes Mal {kg} kg",
    stHistory:"Verlauf", stStats:"Statistik", stStatsNone:"noch keine Einträge", stStatsKurz:"Bestwert {kg} kg · {n} Einheiten", stStatsEmpty:"Noch keine Einträge. Trag deinen ersten Satz ein – ab der zweiten Woche wächst hier deine Kurve.", stBestKg:"Bestes Gewicht", stSessions:"Einheiten", stSetsAll:"Sätze", stSince:"seit {d}", stLastN:"Letzte Einheiten", stOneWeek:"Erst eine Woche mit Einträgen – die Kurve beginnt in der nächsten.", stWeekly:"Gewicht je Woche", repWeekly:"Zeit je Woche", weeksN:"{n} Wochen", stNote:"Notiz", stNotePh:"z. B. Sitz 4, Lehne Stufe 2, Griff breit", stTimer:"Mit Intervall-Timer", stTimerStart:"Timer starten", stBlock:"Block", stBlockHint:"Ohne Gewicht: Runden, Arbeit und Pause einstellen und loslegen.", stTimerHint:"Runden × Arbeit, dazwischen Pause – gilt nur für diese Übung.", stSets:"Runden", stWork:"Arbeit (Sekunden)", stRest:"Pause (Sekunden)", stRestKurz:"Pause",
    stUndo:"Letzten Satz löschen", stInfo:"Zur Übung", stWeight:"Arbeitsgewicht", stNone:"Keine Übung gefunden.",
    fabMy:"Workout aus Übungen", fabTimerWo:"Timer-Workout aus Blöcken", fabBlock:"Einzelner Block",
    tabTimerWo:"Workouts", tabBlocks:"Blöcke",
    timerWoHint:"Mehrere Blöcke hintereinander, mit Pause dazwischen.",
    blocksHint:"Ein Block = eine Übung mit festen Zeiten, z. B. 6 × 30 s / 10 s.",
    noTimerWorkouts:"Noch kein Timer-Workout.<br>Tippe unten rechts auf +.",
    filter:"Filter", filterReset:"Zurücksetzen", more:"Mehr", infoLong:"Info und Anleitung",
    actSave:"Speichern", actCopy:"Kopie", fCatHint:"Mehrere möglich. Nichts gewählt = alle.",
    fEquipHint:"Was hast du da? Mehrere möglich. Nichts gewählt = alles.", hideEx:"In der Bibliothek ausblenden",
    hideWo:"Dieses Workout in der Bibliothek ausblenden", hiddenToast:"Ausgeblendet – unten in der Liste wieder einblendbar.",
    libCalis:"Calisthenics", calisRoutines:"Calisthenics-Programme", calisExercises:"Calisthenics-Übungen",
    equipHave:"Ausrüstung", searchPh:"Übungen suchen …", noResult:"Keine passende Übung gefunden.",
    int1:"Locker", int2:"Mittel", int3:"Intensiv",
    htFav:"Deine markierten Workouts", htTimer:"Eigene Intervall-Timer", htBlocks:"Einzelne Blöcke direkt starten",
    musWorked:"Trainiert", musStretched:"Dehnt", musAssist:"Unterstützend",
    optTitle:"Zeiten & Sprachansagen", optRestShort:"{n} s Pause", optVoiceOn:"Ansagen an", optVoiceOff:"Ansagen aus",
    libStretch:"Dehnen", stretchRoutines:"Dehnprogramme", stretchExercises:"Dehnübungen",
    hold1:"{s} s halten", holdN:"{n} × {s} s halten", holdSide:"{s} s je Seite", holdSideN:"{n} × {s} s je Seite",
    phHold:"Halten", phSwitch:"Seite wechseln", phRelax:"Lösen",
    favorites:"Favoriten", timerWorkouts:"Timer-Workouts", favorite:"Favorit",
    favAdded:"Zu den Favoriten hinzugefügt.", favRemoved:"Aus den Favoriten entfernt.",
    lvl1:"Einsteiger", lvl2:"Mittel", lvl3:"Fortgeschritten", lvlAll:"Alle Stufen", equipAll:"Jede Ausrüstung", equipLabel:"Ausrüstung",
    coverTitle:"Übersicht", kindLib:"Fertiges Workout", kindMy:"Eigenes Workout", kindSurprise:"Überraschung",
    letsGo:"Los geht's", saveAsMy:"Als Eigenes speichern", saveAsNewMy:"Als neues Eigenes speichern", savedMy:"Unter „Meine“ gespeichert.",
    coverHint:"Änderungen gelten nur für dieses Training, bis du speicherst.",
    coverDirty:"Angepasst – gilt nur für dieses Training.", reroll:"Neu mischen",
    timesLabel:"Zeiten", tmReps:"Runden", tmWork:"Arbeit (s)", tmRest:"Pause (s)", modeUniform:"Für alle gleich", modeIndividual:"Je Übung",
    modeIndividualHint:"Tippe bei einer Übung auf die Zeit, um sie anzupassen.",
    sidesNote:"„Je Seite“: Seite wechselt nach jedem Intervall.",
    repsBothSides:"Die Runden zählen beide Seiten zusammen, z. B. 6 = 3 je Seite.",
    recommended:"Empfohlen", timeDone:"Fertig",
    voice:"Sprachansagen (Englisch)", voiceDesc:"Sagt in den Pausen die nächste Übung an",
    surprise:"Überrasch mich", spDur:"Dauer", spAreas:"Fokus", spLevel:"Intensität", spGo:"Zusammenstellen",
    spMore:"Feinauswahl", spNoFocus:"ohne Fokus",
    introTitle:"Einführung", introSkip:"Überspringen", introNext:"Weiter", introRow:"Einführung ansehen", introRowSub:"BLOC in fünf kurzen Schritten",
    in1T:"Willkommen bei BLOC",
    in1:"Bau dir dein Training aus Bausteinen – und schau dabei über den Tellerrand.",
    in1N:"Kein Konto, keine Community – alles bleibt auf deinem Handy.",
    in2:"{s} Übungen fürs Studio. Trag deine Gewichte ein – BLOC sagt dir, wann mehr geht.",
    in3:"{w} Workouts und {e} Übungen: fertig starten oder selbst bauen. „Überrasch mich“ mischt Neues für dich.",
    in4:"{c} Programme und {u} Einheiten: feste Wiederholungen, so schnell du kannst. Schlag deine Bestzeit.",
    in5:"{p} Programme und {d} Übungen: vorher mobilisieren, danach dehnen.",
    spNone:"Keine passenden Übungen – wähle andere Bereiche oder Ausrüstung.", spName:"Überraschung · {n} Min",
    info:"Info", howTo:"So geht's", viewSide:"Seitlich", viewFront:"Von vorn", viewTop:"Von oben", tip:"Tipp", infoRunning:"Timer läuft weiter", infoPaused:"Timer pausiert",
    infoPause:"Pause", infoResume:"Weiter",
    noBlocksHome:"Noch kein Block angelegt.<br>Tippe unten rechts auf + und wähle <b>Neuer Block</b>.",
    startBlock:"Block einzeln starten", newWorkout:"Neues Workout", newBlock:"Neuer Block", create:"Neu anlegen",
    installTitle:"Für dauerhaften Speicher installieren", installText:"Einmal antippen, und die App liegt auf deinem Startbildschirm.",
    installNow:"Jetzt installieren",
    tipIOS:"Für dauerhaften Speicher: Teile-Symbol &#8593; antippen und <b>„Zum Home-Bildschirm“</b> wählen.",
    tipAndroid:"Für dauerhaften Speicher: Menü &#8942; öffnen und <b>„App installieren“</b> wählen.",
    viewGuide:"Anleitung ansehen",
    blocks:"Blöcke", blockSub:"{reps} &times; {work}s Arbeit / {rest}s Pause",
    noBlocksList:"Noch kein Block angelegt.<br>Ein Block ist z. B. „6 × 30 s Arbeit / 10 s Pause“.",
    editBlock:"Block bearbeiten", name:"Name", reps:"Runden", workSec:"Arbeit (Sekunden)",
    restSec:"Pause zwischen den Runden (Sekunden)", total:"Gesamtdauer:",
    save:"Speichern", deleteBlock:"Block löschen", deleteBlockQ:"Block löschen?",
    deleteBlockText:"„{name}“ wird auch aus allen Workouts entfernt.", del:"Löschen",
    workout:"Workout", deletedBlock:"(gelöschter Block)", restAfter:"Pause danach:", sec:"Sek", start:"Start",
    workoutBlocks:"Blöcke ({n}) &middot; Gesamt {d}", noBlocksInWorkout:"Noch keine Blöcke im Workout.",
    addBlock:"Block hinzufügen", noBlocksAvail:"Keine Blöcke vorhanden.", createBlockFirst:"Erst einen Block anlegen",
    deleteWorkout:"Workout löschen", deleteWorkoutQ:"Workout löschen?", cantUndo:"Diese Aktion kann nicht rückgängig gemacht werden.",
    appearance:"Darstellung", optWichtig:"Wichtig", optMehr:"Mehr", optTraining:"Training",
    mehrTimer:"Timer und Töne", mehrTimerSub:"Ton, Klang, Einzählen, Vibration, Bildschirm", mehrApp:"App", mehrAppSub:"Einführung, installieren, teilen",
    mehrLoeschenSub:"Lässt sich nur mit einer Sicherung rückgängig machen.", thSystem:"System", thLight:"Hell", thDark:"Dunkel", thNacht:"Nacht", thKodak:"C60",
    themeInfo:"Nacht: warme Farben mit wenig Blau, schont abends die Augen. C60: Kassetten-Look mit Walzenzähler statt Ring.",
    language:"Sprache",
    installation:"Installation", installRow:"App auf den Home-Bildschirm legen", installRowSub:"Anleitung für iPhone &amp; Android",
    timer:"Timer", volume:"Lautstärke", sound:"Ton", soundDesc:"Töne bei Phasenwechsel", soundStyle:"Klang",
    space:"Raumklang", spaceDesc:"Hall und Stereo-Tiefe für alle Klänge",
    countIn:"Countdown-Piepsen", countInDesc:"Kurze Töne in den letzten 3 Sekunden",
    vibration:"Vibration", vibrationDesc:"Haptisches Feedback (falls unterstützt)",
    keepAwake:"Bildschirm an lassen", keepAwakeDesc:"Bildschirm bleibt im Training an",
    volMusicHint:"Musik läuft weiter. iPhone auf lautlos = keine Töne.",
    lastRun:"Nochmal wie letztes Mal", lastToday:"heute", lastYesterday:"gestern",
    favAll:"Alle Favoriten anzeigen ({n})", favLess:"Weniger", favAllShort:"Alle anzeigen",
    htLib:"Intervall-Programme und Übungen", htLibN:"Draußen im Calisthenicspark · {w} Workouts · {e} Übungen", spSub:"Zufälliges Training nach deinen Auswahlkriterien",
    repTitle:"Summit", htReps:"Challenges auf Bestzeit",
    warmTitle:"Mobility & Stretch", htWarm:"Vor und nach dem Training · {p} Programme", warmSec:"Mobility · vor dem Training", stretchSec:"Stretch · nach dem Training",
    warmIntro:"Passt zu allem: vorher kurz aufwärmen, danach dehnen.",
    wsWarm:"Mobility", wsDehn:"Stretch", wsIntroWarm:"Vor dem Training: Puls hoch, Gelenke mobil.",
    wsIntroDehn:"Nach dem Training: ruhig dehnen.",
    repTabUnits:"Einheiten", repTabProgs:"Programme",
    repMineIntro:"Eigene Übungen und Mengen – mit Bestzeit.",
    repNew:"Neue Challenge", repMineEmpty:"Noch keine eigene Challenge.", repMore:"+ {n} weitere", reNoEx:"Noch keine Übungen",
    reTitle:"Eigene Challenge", reRunden:"Runden", reUebungen:"Übungen", reLeer:"Noch keine Übung – füge unten die erste hinzu.",
    reHint:"Runde 1 gilt für alle Runden, bis du eine einzeln änderst. 0 = auslassen.",
    reWdh:"Wiederholungen", reSek:"Sekunden", reDelete:"Challenge löschen", reDelQ:"Challenge löschen?", reDefaultName:"Meine Challenge", reFertig:"Fertig",
    repUnitsIntro:"12 Einheiten in drei Stufen, mehrere Programme am Stück.",
    stufe_leicht:"Einsteiger", stufe_standard:"Mittel", stufe_fortgeschritten:"Fortgeschritten", unitN:"Einheit {n}", variant:"Variante {n}", filterMehr:"Fokus, Ausrüstung & Sortierung",
    rundenTeil:"Runden {a}–{b}", runde1Teil:"Runde {a}", halb:"halbe Menge",
    repIntro:"So schnell wie möglich, aber sauber – mit Bestzeit.",
    repAll:"Alle", repAllEquip:"Alle Geräte", repNoBar:"Ohne Stange", repNone:"Keine Programme für diese Auswahl.",
    repRound1:"1 Runde", repRoundsN:"{n} Runden", repReps:"{n} Wdh.", repBar:"Stange", repRound:"Runde",
    repBestIs:"Bestzeit {z}", repLastIs:"zuletzt {z}", repTable:"Ablauf", repStart:"Start",
    repStatsKurz:"Bestzeit {z} · {n} Läufe", repStatsNone:"noch keine Läufe", repBestZeit:"Bestzeit", repLaeufe:"Läufe", repLetzte:"Letzte Zeit", repLastRuns:"Letzte Läufe",
    repStatsEmpty:"Noch keine Zeit. Spiel das Programm einmal durch – dann steht hier deine Bestzeit und ab der zweiten Woche deine Kurve.",
    repHint:"Nach jeder Übung „Geschafft“ tippen.",
    repDone:"Geschafft", repSkip:"Überspringen", repUndo:"Zurück", repPause:"Pause", repResume:"Weiter", repEnd:"Beenden",
    repNext:"Danach: {x}", repLastStep:"Letzte Übung", repReady:"Gleich geht's los", repFinish:"Geschafft!", repNewBest:"Neue Bestzeit!",
    repAgain:"Nochmal", repToList:"Fertig", repEndQ:"Challenge beenden?", repEndText:"Die Zeit wird nicht gespeichert.", repEndBtn:"Beenden",
    snapNone:"Letzter Schnappschuss: noch keiner", snapAgo:"Letzter Schnappschuss: {x}", snapToday:"heute", snapYesterday:"gestern",
    snapDays:"vor {n} Tagen", snapRestore:"Stand vom {d} wiederherstellen", snapQ:"Schnappschuss wiederherstellen?",
    snapText:"Deine aktuellen Daten werden durch den Stand vom {d} ersetzt.", snapBtn:"Wiederherstellen",
    snapInfo:"Alle 7 Tage automatisch eine Kopie auf diesem Gerät.",
    backupTipTitle:"Lange nicht gesichert", backupTipText:"Sichere deine eigenen Workouts, Übungen und Gewichte als Datei.",
    backupNow:"Jetzt sichern", shareBackup:"Sicherung teilen (z. B. Drive, Mail)", backupShared:"Sicherung übergeben.",
    wbAblauf:"Dein Ablauf", wbWaehlen:"Übungen wählen", wbTippen:"Antippen = dazu, nochmal antippen = raus.",
    wbLeer:"Noch leer – tippe unten Übungen an.", wbOrdnen:"Sinnvoll ordnen", wbGeordnet:"Geordnet: große Übungen zuerst, Wechsel der Muskelgruppen, Dehnen am Ende",
    wbAblaufHint:"Tipp auf eine Übung: Zeiten, verschieben, tauschen, entfernen.", wbZeiten:"Zeiten anpassen", wbNachVorn:"Nach vorn",
    wbNachHinten:"Nach hinten", wbTauschen:"Andere Übung", wbKeinTausch:"Keine passende andere Übung gefunden", wbMischen:"Nochmal mischen", wbGespeichert:"Gespeichert", wbVerwerfenQ:"Änderungen verwerfen?",
    wbVerwerfenText:"Das Workout ist noch nicht gespeichert.", wbVerwerfen:"Verwerfen",
    figTitle:"Figuren prüfen", figSub:"Alle Figuren auf einen Blick – Unklares markieren und teilen",
    figIntro:"Antippen zeigt die Figur bewegt. Unklares markieren, kurz notieren, am Ende teilen.",
    figAll:"Alle", figMarked:"Markierte ({n})", figFlag:"Unklar", figNotePh:"Was ist unklar? (optional)",
    figShare:"Markierte teilen ({n})", figNone:"Noch nichts markiert.", figCopied:"Liste kopiert.", figShareHead:"BLOC – unklare Figuren",
    weekTitle:"Diese Woche", weekNone:"noch kein Training", weekDays:"M D M D F S S",
    weekOne:"1 Training", weekN:"{n} Trainings",
    tabWorkouts:"Workouts", tabMine:"Meine", mainCat:"Kategorie", multiOk:"Mehrere möglich",
    spMainHint:"Nichts gewählt = Kraft, Ausdauer und Rumpf.",
    spFocusHint:"Optional – grenzt innerhalb der Kategorie weiter ein.",
    sortDur:"Dauer", searchWoPh:"Workouts suchen …", unitsOf:"Einheit {i} von {n}", exOf:"Übung {i} von {n}",
    data:"Daten", exportBackup:"Sicherung als Datei speichern", importBackup:"Sicherung einlesen", deleteAll:"Alle Daten löschen",
    localNote:"Alle Daten bleiben lokal auf diesem Gerät. Für dauerhaften Speicher auf iOS: zum Home-Bildschirm hinzufügen.",
    importQ:"Sicherung einlesen?", importText:"Alle deine aktuellen Daten werden durch die Sicherung ersetzt.", importBtn:"Einlesen",
    fileError:"Datei konnte nicht gelesen werden.",
    deleteAllQ:"Alle Daten löschen?", deleteAllText:"Eigene Workouts, Blöcke, Übungen, Challenges, Gewichte und Einstellungen werden unwiderruflich gelöscht.", deleteAllBtn:"Alles löschen",
    installApp:"App installieren",
    iosSteps:[
      "Diese Seite in <b>Safari</b> öffnen (nicht Chrome – dort fehlt der nötige Button).",
      "Unten in der Mitte auf das Teilen-Symbol <b>&#8593;</b> tippen.",
      "Nach unten scrollen und <b>„Zum Home-Bildschirm“</b> auswählen.",
      "Oben rechts auf <b>„Hinzufügen“</b> tippen.",
      "Fertig! Das Icon liegt jetzt auf deinem Home-Bildschirm und startet als eigene App mit dauerhaftem Speicher."
    ],
    androidSteps:[
      "Diese Seite in <b>Chrome</b> öffnen.",
      "Oben rechts auf die drei Punkte <b>&#8942;</b> tippen.",
      "<b>„App installieren“</b> bzw. <b>„Zum Startbildschirm hinzufügen“</b> auswählen.",
      "Installation im Dialog bestätigen.",
      "Fertig! Die App erscheint auf dem Startbildschirm und in der App-Liste."
    ],
    androidQuickNote:"Einmal antippen genügt. Sonst von Hand:",
    installOutro:"Danach läuft sie im Vollbild – ohne 7-Tage-Speicherlimit.",
    cancel:"Abbrechen", chooseSound:"Klang wählen", natural:"Natürlich", electronic:"Elektronisch", close:"Schließen",
    phWork:"Los!", phRest:"Pause", phBlockrest:"Blockpause", phPrep:"Los geht's",
    upNext:"Als nächstes:", thenDone:"Danach: Fertig",
    doneTitle:"Workout geschafft!", again:"Nochmal", finish:"Fertig",
    endQ:"Workout beenden?", endText:"Der Fortschritt geht verloren.", endBtn:"Beenden",
    skip:"Überspringen", pause:"Pause", restartPhase:"Phase neu",
    unitH:"Std", unitMin:"Min", unitSec:"Sek",
    hideShort:"Ausblenden", unhide:"Einblenden", hiddenSection:"Ausgeblendet ({n})",
    hiddenSectionHint:"Ausgeblendete Einträge nutzt „Überrasch mich“ nicht.",
    exNew:"Eigene Übung anlegen", exEditTitle:"Eigene Übung", exNewTitle:"Neue Übung", exName:"Name der Übung",
    exFocus:"Fokus", exFocusHint:"Mehrere möglich.", exEquip:"Ausrüstung", exPerSide:"Je Seite",
    exPerSideDesc:"Links und rechts im Wechsel – Runden gelten pro Seite", exReco:"Empfohlene Zeiten",
    exHint:"Hinweis (optional)", exHintPh:"z. B. Rücken gerade halten", exSave:"Übung speichern", exDelete:"Übung löschen",
    exDeleteQ:"Übung löschen?", exDeleteText:"Sie verschwindet auch aus eigenen Workouts, in denen sie vorkommt.",
    exSaved:"Übung gespeichert.", exNameMissing:"Bitte gib der Übung einen Namen.", customTag:"Eigene Übung", edit:"Bearbeiten",
    share:"Teilen", shareWo:"Workout teilen", shareLinkCopied:"Link kopiert – einfach verschicken.", kindShared:"Geteiltes Workout",
    shareBad:"Dieser Link ist leider ungültig oder unvollständig.", shareMsg:"Probier mein Workout „{n}“ in BLOC aus:",
    sharedMissing:"{n} Übung(en) aus dem Link kennt diese Fassung der App nicht – sie wurden weggelassen.",
    spAvoid:"Übungen der letzten 7 Tage meiden", spAvoidDesc:"Nur wenn genug andere passen.",
    spRules:"Wechselt Muskelgruppen ab und gleicht Drücken und Ziehen aus. Intensiv = mehr Sprünge, Locker = ruhiger.",
    privacy:"Datenschutz & Haftung", privacyRow:"Datenschutz & Haftungsausschluss", privacyRowSub:"Keine Datensammlung · Training auf eigene Verantwortung",
    ownRisk:"Training auf eigene Verantwortung.", ownRiskMore:"Haftungsausschluss"
  },
  en: {
    back:"Back", settings:"Settings", workouts:"Workouts", untitled:"Untitled",
    blockOne:"block", blockMany:"blocks",
    noWorkouts:"No workouts yet.<br>Tap + at the bottom right to get started.",
    singleBlocks:"Start single blocks",
    library:"Air", libEntry:"Exercises & workouts", libEntrySub:"{e} exercises · {w} ready-made · {m} own workouts",
    libWorkouts:"Workouts", libExercises:"Exercises", catAll:"All", catMix:"Mixed",
    adopt:"Copy", adoptTitle:"Copy as your own workout to adjust it",
    adoptBlock:"As block", adoptBlockTitle:"Save as your own block",
    adoptedBlock:"“{n}” is now in your blocks.", addedToWorkout:"“{n}” added.",
    addFromLibrary:"From the library", startTemplate:"Start workout",
    hide:"Hide", hiddenN:"{n} hidden.", showAgain:"Show again",
    libEmpty:"Nothing to show here.", blockRestN:"{n} s block rest",
    perSide:"per side", left:"Left", right:"Right",
    libReady:"Ready-made", libMine:"My own", exCount:"{n} exercises", adoptMine:"Save to “Mine”",
    myNew:"Create your own workout", myDefaultName:"My workout", myWorkout:"Own workout",
    myEmpty:"No own workout yet. Put one together from the exercises.",
    myInWorkout:"Exercises in workout ({n}) · {d}", myAdd:"Add exercises", myRest:"Rest between exercises",
    dropHere:"Drag exercises here by the ⠿ handle or tap + below.", dropToRemove:"Drop here to remove",
    myDelete:"Delete own workout", myDeleteQ:"Delete own workout?", deletedToast:"“{n}” deleted.",
    spFill:"Surprise me: add exercises", spFillHint:"The exercises are added as blocks at the end of “{n}”.", spCount:"Number of exercises", spCountUnit:"exercises",
    spFilled:"{n} exercises added to “{w}”.",
    sortLabel:"Sort", sortStd:"Default", posture:"Posture", avoid:"Avoid",
    shareTitle:"Share the app", shareCopy:"Copy link", shareWa:"Via WhatsApp", shareMore:"More options …",
    shareCopied:"Link copied.", shareText:"Check out BLOC – my interval timer with an exercise library:",
    fCat:"Focus", equipAny:"Anything", fEquipHintShort:"What do you have?",
    favEmpty:"Star workouts, timers or blocks with ☆ – they'll show up here.", areas:"Sections", areasHint:"press and hold to reorder", areasSort:"Order of sections", areasSortHint:"The top section is shown large.", moveUp:"Move up", moveDown:"Move down",
    timers:"Studio", oneTimerWo:"1 workout", nTimerWo:"{n} workouts", oneBlock:"1 block", nBlocks:"{n} blocks", htTimers:"Indoors on machines · {n} exercises · track your progress", mineMy:"Own workouts", mineTimer:"Timer workouts", mineBlocks:"Blocks",
    tabStudio:"Gym", studioHint:"Tap an exercise, log the weight – the app remembers the rest.",
    stFilter:"Filter · groups & equipment", stAir:"Include Air exercises", stAirDesc:"Dumbbell, kettlebell, bar and bodyweight from Air. Starred ones always show at the top.", stAirGr:"Air · bodyweight", stRecent:"Recent", stFavs:"★ My exercises", stFavHint:"Tap ☆ to pin an exercise up here.", stFree:"Dumbbell & kettlebell", stBar:"Bar & dip bars", stOwn:"Own exercises",
    stArt_geraet:"Machine", stArt_kabel:"Cable", stArt_frei:"Dumbbell & kettlebell", stArt_lh:"Barbell", stArt_stange:"Bar", stOwnNew:"Own exercise",
    stSearch:"Search exercise or machine …", stNoData:"–", stToday:"Today", stSet:"Set", stSetDone:"Log set",
    stKg:"kg", stReps:"reps", stGoal:"Goal", stPause:"Rest", stSkip:"Next", stPauseEnd:"Rest over – next set!",
    stSuggest:"{z} done twice – {kg} kg next time?", stSuggestYes:"Yes, increase", stRaised:"Next time {kg} kg",
    stHistory:"History", stStats:"Stats", stStatsNone:"no entries yet", stStatsKurz:"best {kg} kg · {n} sessions", stStatsEmpty:"No entries yet. Log your first set – your curve grows from the second week.", stBestKg:"Best weight", stSessions:"Sessions", stSetsAll:"Sets", stSince:"since {d}", stLastN:"Latest sessions", stOneWeek:"Only one week logged so far – the curve starts next week.", stWeekly:"Weight per week", repWeekly:"Time per week", weeksN:"{n} weeks", stNote:"Note", stNotePh:"e.g. seat 4, backrest 2, wide grip", stTimer:"With interval timer", stTimerStart:"Start timer", stBlock:"Block", stBlockHint:"No weight: set rounds, work and rest, then go.", stTimerHint:"Rounds × work with rest in between – for this exercise only.", stSets:"Rounds", stWork:"Work (seconds)", stRest:"Rest (seconds)", stRestKurz:"rest",
    stUndo:"Delete last set", stInfo:"About the exercise", stWeight:"Working weight", stNone:"No exercise found.",
    fabMy:"Workout from exercises", fabTimerWo:"Timer workout from blocks", fabBlock:"Single block",
    tabTimerWo:"Workouts", tabBlocks:"Blocks",
    timerWoHint:"Several blocks in a row, with a rest in between.",
    blocksHint:"A block = one exercise with fixed times, e.g. 6 × 30 s / 10 s.",
    noTimerWorkouts:"No timer workouts yet.<br>Tap + at the bottom right.",
    filter:"Filter", filterReset:"Reset", more:"More", infoLong:"Info and how-to",
    actSave:"Save", actCopy:"Copy", fCatHint:"Pick several. None selected = all.",
    fEquipHint:"What do you have? Pick several. None selected = anything.", hideEx:"Hide in library",
    hideWo:"Hide this workout in the library", hiddenToast:"Hidden – you can show it again at the bottom of the list.",
    libCalis:"Calisthenics", calisRoutines:"Calisthenics routines", calisExercises:"Calisthenics exercises",
    equipHave:"Equipment", searchPh:"Search exercises …", noResult:"No matching exercise found.",
    int1:"Easy", int2:"Moderate", int3:"Intense",
    htFav:"Your starred workouts", htTimer:"Your own interval timers", htBlocks:"Start single blocks directly",
    musWorked:"Works", musStretched:"Stretches", musAssist:"Assisting",
    optTitle:"Timing & voice cues", optRestShort:"{n} s rest", optVoiceOn:"voice on", optVoiceOff:"voice off",
    libStretch:"Stretch", stretchRoutines:"Stretch routines", stretchExercises:"Stretches",
    hold1:"hold {s} s", holdN:"hold {n} × {s} s", holdSide:"{s} s per side", holdSideN:"{n} × {s} s per side",
    phHold:"Hold", phSwitch:"Switch sides", phRelax:"Release",
    favorites:"Favourites", timerWorkouts:"Timer workouts", favorite:"Favourite",
    favAdded:"Added to favourites.", favRemoved:"Removed from favourites.",
    lvl1:"Beginner", lvl2:"Intermediate", lvl3:"Advanced", lvlAll:"All levels", equipAll:"Any equipment", equipLabel:"Equipment",
    coverTitle:"Overview", kindLib:"Ready-made workout", kindMy:"Own workout", kindSurprise:"Surprise",
    letsGo:"Let's go", saveAsMy:"Save as my own", saveAsNewMy:"Save as new own workout", savedMy:"Saved to “Mine”.",
    coverHint:"Changes apply to this session only until you save.",
    coverDirty:"Adjusted – applies to this session only.", reroll:"Shuffle again",
    timesLabel:"Timing", tmReps:"Rounds", tmWork:"Work (s)", tmRest:"Rest (s)", modeUniform:"Same for all", modeIndividual:"Per exercise",
    modeIndividualHint:"Tap an exercise's timing to adjust it.",
    sidesNote:"“Per side”: switches sides after each interval.",
    repsBothSides:"Rounds count both sides together, e.g. 6 = 3 per side.",
    recommended:"Recommended", timeDone:"Done",
    voice:"Voice cues (English)", voiceDesc:"Announces the next exercise during rests",
    surprise:"Surprise me", spDur:"Duration", spAreas:"Focus", spLevel:"Intensity", spGo:"Build it",
    spMore:"Fine-tuning", spNoFocus:"no focus",
    introTitle:"Introduction", introSkip:"Skip", introNext:"Next", introRow:"View introduction", introRowSub:"BLOC in five short steps",
    in1T:"Welcome to BLOC",
    in1:"Build your training from blocks – and look beyond your usual routine.",
    in1N:"No account, no community – everything stays on your phone.",
    in2:"{s} gym exercises. Log your weights – BLOC tells you when to add more.",
    in3:"{w} workouts and {e} exercises: start one or build your own. “Surprise me” mixes something new.",
    in4:"{c} programs and {u} units: fixed reps, as fast as you can. Beat your best time.",
    in5:"{p} routines and {d} exercises: warm up before, stretch after.",
    spNone:"No matching exercises – pick other areas or equipment.", spName:"Surprise · {n} min",
    info:"Info", howTo:"How to", viewSide:"Side", viewFront:"Front", viewTop:"From above", tip:"Tip", infoRunning:"Timer keeps running", infoPaused:"Timer paused",
    infoPause:"Pause", infoResume:"Resume",
    noBlocksHome:"No blocks yet.<br>Tap + at the bottom right and choose <b>New block</b>.",
    startBlock:"Start this block", newWorkout:"New workout", newBlock:"New block", create:"Create",
    installTitle:"Install for permanent storage", installText:"One tap and the app is on your home screen.",
    installNow:"Install now",
    tipIOS:"For permanent storage: tap the share icon &#8593; and choose <b>“Add to Home Screen”</b>.",
    tipAndroid:"For permanent storage: open the menu &#8942; and choose <b>“Install app”</b>.",
    viewGuide:"View guide",
    blocks:"Blocks", blockSub:"{reps} &times; {work}s work / {rest}s rest",
    noBlocksList:"No blocks yet.<br>A block is e.g. “6 × 30 s work / 10 s rest”.",
    editBlock:"Edit block", name:"Name", reps:"Rounds", workSec:"Work (seconds)",
    restSec:"Rest between rounds (seconds)", total:"Total:",
    save:"Save", deleteBlock:"Delete block", deleteBlockQ:"Delete block?",
    deleteBlockText:"“{name}” will also be removed from all workouts.", del:"Delete",
    workout:"Workout", deletedBlock:"(deleted block)", restAfter:"Rest after:", sec:"s", start:"Start",
    workoutBlocks:"Blocks ({n}) &middot; Total {d}", noBlocksInWorkout:"No blocks in this workout yet.",
    addBlock:"Add block", noBlocksAvail:"No blocks available.", createBlockFirst:"Create a block first",
    deleteWorkout:"Delete workout", deleteWorkoutQ:"Delete workout?", cantUndo:"This can't be undone.",
    appearance:"Appearance", optWichtig:"Essentials", optMehr:"More", optTraining:"Training",
    mehrTimer:"Timer and sounds", mehrTimerSub:"Sound, style, count-in, vibration, screen", mehrApp:"App", mehrAppSub:"Intro, install, share",
    mehrLoeschenSub:"Only a backup can undo this.", thSystem:"System", thLight:"Light", thDark:"Dark", thNacht:"Night", thKodak:"C60",
    themeInfo:"Night: warm colours with little blue, easy on the eyes in the evening. C60: cassette look with a rolling counter instead of the ring.",
    language:"Language",
    installation:"Installation", installRow:"Add the app to your home screen", installRowSub:"Guide for iPhone &amp; Android",
    timer:"Timer", volume:"Volume", sound:"Sound", soundDesc:"Beeps between phases", soundStyle:"Sound style",
    space:"Room sound", spaceDesc:"Reverb and stereo depth for all sounds",
    countIn:"Countdown beeps", countInDesc:"Short beeps in the last 3 seconds",
    vibration:"Vibration", vibrationDesc:"Haptic feedback (if supported)",
    keepAwake:"Keep screen on", keepAwakeDesc:"Screen stays on while training",
    volMusicHint:"Your music keeps playing. iPhone on silent = no sounds.",
    lastRun:"Again, like last time", lastToday:"today", lastYesterday:"yesterday",
    favAll:"Show all favourites ({n})", favLess:"Fewer", favAllShort:"Show all",
    htLib:"Interval programs and exercises", htLibN:"Outdoors in the calisthenics park · {w} workouts · {e} exercises", spSub:"A random session based on your picks",
    repTitle:"Summit", htReps:"Challenges against the clock",
    warmTitle:"Mobility & Stretch", htWarm:"Before and after training · {p} routines", warmSec:"Mobility · before training", stretchSec:"Stretch · after training",
    warmIntro:"Goes with workouts and challenges: warm up briefly before, stretch afterwards.",
    wsWarm:"Mobility", wsDehn:"Stretch", wsIntroWarm:"Before training: raise your pulse, loosen your joints.",
    wsIntroDehn:"After training: stretch calmly.",
    repTabUnits:"Sessions", repTabProgs:"Programs",
    repMineIntro:"Your own exercises and amounts – with best time.",
    repNew:"New challenge", repMineEmpty:"No challenges of your own yet.", repMore:"+ {n} more", reNoEx:"No exercises yet",
    reTitle:"Own challenge", reRunden:"Rounds", reUebungen:"Exercises", reLeer:"No exercise yet – add the first one below.",
    reHint:"Round 1 applies to all rounds until you change one. 0 = skip.",
    reWdh:"Reps", reSek:"Seconds", reDelete:"Delete challenge", reDelQ:"Delete challenge?", reDefaultName:"My challenge", reFertig:"Done",
    repUnitsIntro:"12 sessions in three levels, several programs in a row.",
    stufe_leicht:"Beginner", stufe_standard:"Intermediate", stufe_fortgeschritten:"Advanced", unitN:"Session {n}", variant:"Option {n}", filterMehr:"Focus, equipment & sort",
    rundenTeil:"rounds {a}–{b}", runde1Teil:"round {a}", halb:"half volume",
    repIntro:"As fast as possible, but clean – with best time.",
    repAll:"All", repAllEquip:"Any equipment", repNoBar:"No bar", repNone:"No programs match this selection.",
    repRound1:"1 round", repRoundsN:"{n} rounds", repReps:"{n} reps", repBar:"Bar", repRound:"Round",
    repBestIs:"Best {z}", repLastIs:"last {z}", repTable:"Sequence", repStart:"Start",
    repStatsKurz:"Best {z} · {n} runs", repStatsNone:"no runs yet", repBestZeit:"Best time", repLaeufe:"Runs", repLetzte:"Last time", repLastRuns:"Latest runs",
    repStatsEmpty:"No time yet. Play the program once – then your best time shows up here, and your curve from the second week.",
    repHint:"Tap “Done” after each exercise.",
    repDone:"Done", repSkip:"Skip", repUndo:"Back", repPause:"Pause", repResume:"Resume", repEnd:"End",
    repNext:"Next: {x}", repLastStep:"Last exercise", repReady:"Get ready", repFinish:"Done!", repNewBest:"New best time!",
    repAgain:"Again", repToList:"Finish", repEndQ:"End challenge?", repEndText:"Your time won't be saved.", repEndBtn:"End",
    snapNone:"Last snapshot: none yet", snapAgo:"Last snapshot: {x}", snapToday:"today", snapYesterday:"yesterday",
    snapDays:"{n} days ago", snapRestore:"Restore state from {d}", snapQ:"Restore snapshot?",
    snapText:"Your current data will be replaced with the state from {d}.", snapBtn:"Restore",
    snapInfo:"An automatic copy on this device every 7 days.",
    backupTipTitle:"No recent backup", backupTipText:"Back up your own workouts, exercises and weights as a file.",
    backupNow:"Back up now", shareBackup:"Share backup (e.g. Drive, mail)", backupShared:"Backup shared.",
    wbAblauf:"Your sequence", wbWaehlen:"Pick exercises", wbTippen:"Tap = add, tap again = remove.",
    wbLeer:"Still empty – tap exercises below.", wbOrdnen:"Smart order", wbGeordnet:"Ordered: big lifts first, alternating muscle groups, stretches last",
    wbAblaufHint:"Tap an exercise: times, move, swap, remove.", wbZeiten:"Adjust times", wbNachVorn:"Move up",
    wbNachHinten:"Move down", wbTauschen:"Swap exercise", wbKeinTausch:"No suitable alternative found", wbMischen:"Shuffle again", wbGespeichert:"Saved", wbVerwerfenQ:"Discard changes?",
    wbVerwerfenText:"This workout isn't saved yet.", wbVerwerfen:"Discard",
    figTitle:"Review figures", figSub:"All figures at a glance – mark and share unclear ones",
    figIntro:"Tap to see a figure move. Mark what's unclear, add a note, then share.",
    figAll:"All", figMarked:"Marked ({n})", figFlag:"Unclear", figNotePh:"What is unclear? (optional)",
    figShare:"Share marked ({n})", figNone:"Nothing marked yet.", figCopied:"List copied.", figShareHead:"BLOC – unclear figures",
    weekTitle:"This week", weekNone:"no workout yet", weekDays:"M T W T F S S",
    weekOne:"1 workout", weekN:"{n} workouts",
    tabWorkouts:"Workouts", tabMine:"Mine", mainCat:"Category", multiOk:"Pick several",
    spMainHint:"None picked = strength, cardio and core.",
    spFocusHint:"Optional – narrows things down within the category.",
    sortDur:"Duration", searchWoPh:"Search workouts …", unitsOf:"Unit {i} of {n}", exOf:"Exercise {i} of {n}",
    data:"Data", exportBackup:"Save backup as file", importBackup:"Load backup", deleteAll:"Delete all data",
    localNote:"All data stays on this device. For permanent storage on iOS, add the app to your home screen.",
    importQ:"Load backup?", importText:"All your current data will be replaced by the backup.", importBtn:"Load",
    fileError:"Couldn't read the file.",
    deleteAllQ:"Delete all data?", deleteAllText:"Your own workouts, blocks, exercises, challenges, weights and settings will be permanently deleted.", deleteAllBtn:"Delete everything",
    installApp:"Install app",
    iosSteps:[
      "Open this page in <b>Safari</b> (not Chrome – the button you need is missing there).",
      "Tap the share icon <b>&#8593;</b> at the bottom center.",
      "Scroll down and choose <b>“Add to Home Screen”</b>.",
      "Tap <b>“Add”</b> at the top right.",
      "Done! The icon is now on your home screen and opens as its own app with permanent storage."
    ],
    androidSteps:[
      "Open this page in <b>Chrome</b>.",
      "Tap the three dots <b>&#8942;</b> at the top right.",
      "Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>.",
      "Confirm the installation in the dialog.",
      "Done! The app appears on your home screen and in your app list."
    ],
    androidQuickNote:"One tap is enough. Otherwise manually:",
    installOutro:"Then it runs full screen – without the 7-day storage limit.",
    cancel:"Cancel", chooseSound:"Choose sound", natural:"Natural", electronic:"Electronic", close:"Close",
    phWork:"Go!", phRest:"Rest", phBlockrest:"Block break", phPrep:"Get ready",
    upNext:"Up next:", thenDone:"Then: done",
    doneTitle:"Workout complete!", again:"Again", finish:"Done",
    endQ:"End workout?", endText:"Your progress will be lost.", endBtn:"End",
    skip:"Skip", pause:"Pause", restartPhase:"Restart phase",
    unitH:"h", unitMin:"min", unitSec:"s",
    hideShort:"Hide", unhide:"Show", hiddenSection:"Hidden ({n})",
    hiddenSectionHint:"“Surprise me” doesn't use hidden entries.",
    exNew:"Create your own exercise", exEditTitle:"Own exercise", exNewTitle:"New exercise", exName:"Exercise name",
    exFocus:"Focus", exFocusHint:"Pick several.", exEquip:"Equipment", exPerSide:"Per side",
    exPerSideDesc:"Alternates left and right – rounds count per side", exReco:"Recommended times",
    exHint:"Cue (optional)", exHintPh:"e.g. keep your back straight", exSave:"Save exercise", exDelete:"Delete exercise",
    exDeleteQ:"Delete exercise?", exDeleteText:"It will also be removed from your own workouts that use it.",
    exSaved:"Exercise saved.", exNameMissing:"Please give the exercise a name.", customTag:"Own exercise", edit:"Edit",
    share:"Share", shareWo:"Share workout", shareLinkCopied:"Link copied – just send it.", kindShared:"Shared workout",
    shareBad:"Sorry, this link is invalid or incomplete.", shareMsg:"Try my workout “{n}” in BLOC:",
    sharedMissing:"This version of the app doesn't know {n} exercise(s) from the link – they were left out.",
    spAvoid:"Avoid exercises from the last 7 days", spAvoidDesc:"Only if enough others fit.",
    spRules:"Alternates muscle groups and balances push and pull. Intense = more jumps, Easy = calmer.",
    privacy:"Privacy & disclaimer", privacyRow:"Privacy & disclaimer", privacyRowSub:"No data collection · train at your own risk",
    ownRisk:"Train at your own risk.", ownRiskMore:"Disclaimer"
  }
};
var SOUND_LABELS_EN = {
  klangschale:"Singing bowl", triangel:"Triangle", klatschen:"Clapping", sanft:"Gentle", arcade:"Arcade", weich:"Soft"
};
/* Ohne eigene Einstellung gilt die Sprache des Geräts */
function currentLang(){
  var l = state.db.settings.lang;
  if(l === "de" || l === "en") return l;
  var q = /[?&]lang=(de|en)(?:&|#|$)/.exec(location.search);   // ?lang=de: feste Sprache ohne Einstellung (z. B. für den Schnelltest)
  if(q) return q[1];
  return /^de/i.test(navigator.language || "") ? "de" : "en";
}
function t(key, vars){
  var s = I18N[currentLang()][key];
  if(s == null) s = I18N.de[key];
  if(vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, function(m, k){ return vars[k] != null ? vars[k] : m; });
  return s;
}
function soundLabel(key){
  var st = SOUND_STYLES[key] || SOUND_STYLES.sanft;
  return (currentLang() === "en" && SOUND_LABELS_EN[key]) || st.label;
}
function applyLang(){ document.documentElement.lang = currentLang(); }

/* ============ Helpers ============ */
function fmtTime(totalSec){
  totalSec = Math.max(0, Math.round(totalSec));
  var m = Math.floor(totalSec/60), s = totalSec%60;
  return m + ":" + (s<10?"0":"") + s;
}
function fmtDuration(totalSec){
  totalSec = Math.max(0, Math.round(totalSec));
  var h = Math.floor(totalSec/3600), m = Math.floor((totalSec%3600)/60), s = totalSec%60;
  if(h>0) return h+" "+t("unitH")+" " + m + " "+t("unitMin");
  if(m>0) return m + " "+t("unitMin") + (s>0? " "+s+" "+t("unitSec") : "");
  return s + " "+t("unitSec");
}
function blockDuration(b){
  return b.reps * b.workSec + Math.max(0, b.reps-1) * b.restSec;
}
function findBlock(id){
  for(var i=0;i<state.db.blocks.length;i++) if(state.db.blocks[i].id===id) return state.db.blocks[i];
  var zw = (typeof neuEntwurf!=="undefined" && neuEntwurf && neuEntwurf.bloecke) || [];
  for(var j=0;j<zw.length;j++) if(zw[j].id===id) return zw[j];
  return (typeof libBlockCache!=="undefined" && libBlockCache[id]) || null;
}
function findWorkout(id){
  for(var i=0;i<state.db.workouts.length;i++) if(state.db.workouts[i].id===id) return state.db.workouts[i];
  return null;
}
function workoutDuration(w){
  var total = 0;
  for(var i=0;i<w.items.length;i++){
    var b = findBlock(w.items[i].blockId);
    if(!b) continue;
    total += blockDuration(b);
    if(i < w.items.length-1) total += (w.items[i].restAfterSec||0);
  }
  return total;
}
function esc(str){
  return String(str==null?"":str).replace(/[&<>"']/g, function(c){
    return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
  });
}

/* ============ Bibliothek ============ */
var EXERCISES = EXERCISE_ROWS.map(function(x){
  return { id:x[0], name:{ de:x[1], en:x[2] }, cats:x[3].split(" "), perSide:!!x[6],
           reps: x[6] ? x[4]*2 : x[4], setReps:x[4], workSec:x[5], restSec: x[9]!=null ? x[9] : 10, hint:{ de:x[7], en:x[8] } };
});
var LIB_WORKOUTS = LIB_WORKOUT_ROWS.map(function(x){
  var tm = x[6] ? x[6].split("/").map(Number) : null;   // einheitliche Zeiten, z. B. 3×40 s / 20 s
  return { id:x[0], name:{ de:x[1], en:x[2] }, focus:x[3], exercises:x[4].split(" "), restAfterSec:x[5],
           tm: tm ? { reps:tm[0], work:tm[1], rest:tm[2] } : null };
});

function tplText(obj){ return obj ? (obj[currentLang()] || obj.de || "") : ""; }
function findExercise(id){
  if(EX_ALIAS[id]) id = EX_ALIAS[id];
  for(var i=0;i<EXERCISES.length;i++) if(EXERCISES[i].id===id) return EXERCISES[i];
  return null;
}
function findLibWorkout(id){
  for(var i=0;i<LIB_WORKOUTS.length;i++) if(LIB_WORKOUTS[i].id===id) return LIB_WORKOUTS[i];
  return null;
}
function catName(id){
  for(var i=0;i<LIB_CATS.length;i++) if(LIB_CATS[i].id===id) return tplText(LIB_CATS[i]);
  return t("catMix");
}
/* Übung als Block in der Form, die Player und Dauerberechnung kennen */
function exBlock(ex){
  return { id:"ex-"+ex.id, ex:ex.id, name:tplText(ex.name), reps:ex.reps, workSec:ex.workSec,
           restSec:ex.restSec, sides:ex.perSide, hint:tplText(ex.hint) };
}
var libBlockCache = {};
function libQuickWorkout(blocks, rest, name, id){
  blocks.forEach(function(b){ libBlockCache[b.id] = b; });
  return { id:id, name:name, items: blocks.map(function(b, i){
    // b.after: eigene Pause nach dieser Übung (z. B. 10 s zwischen Dehnübungen), sonst die gemeinsame
    return { blockId:b.id, restAfterSec: i < blocks.length-1 ? (b.after != null ? b.after : rest) : 0 };
  }) };
}
function libWorkoutRun(lw){
  var bl = lw.exercises.map(findExercise).filter(Boolean).map(function(ex){
    var b = exBlock(ex);
    // eigene Zeiten des Programms (z. B. High Pulse 40/20) - Dehnübungen behalten ihre Haltezeiten
    if(lw.tm && ex.cats.indexOf("stretch") < 0){ b.reps = lw.tm.reps; b.workSec = lw.tm.work; b.restSec = lw.tm.rest; }
    return b;
  });
  return libQuickWorkout(bl, lw.restAfterSec, tplText(lw.name), "lib-"+lw.id);
}
function exerciseRun(ex){ return libQuickWorkout([exBlock(ex)], 0, tplText(ex.name), "libex-"+ex.id); }

/* Blockangabe, z. B. „6×30s/10s“ oder „3×30s je Seite/10s“ */
function blockSpec(b){
  if(b.sides) return Math.ceil(b.reps/2)+'&times;'+b.workSec+'s '+t("perSide")+'/'+b.restSec+'s';
  return b.reps+'&times;'+b.workSec+'s/'+b.restSec+'s';
}

/* Ausblenden: Schlüssel "ex:<id>" bzw. "wo:<id>" */
function libHidden(key){ return (state.db.settings.hiddenLib||[]).indexOf(key) > -1; }
function libHide(key){
  var h = (state.db.settings.hiddenLib||[]).slice();
  if(h.indexOf(key) < 0) h.push(key);
  state.db.settings.hiddenLib = h; save();
}

/* Übung als eigenen Block übernehmen - gibt es schon einen Block aus derselben Übung, wird der genommen */
/* zwischen: Blöcke eines noch nicht gespeicherten Timer-Workouts - landen erst mit „Speichern“ unter Meine */
function adoptExercise(ex, zwischen){
  var alle = state.db.blocks.concat(zwischen || []);
  for(var i=0;i<alle.length;i++){
    var b = alle[i];
    if(b.ex===ex.id && b.reps===ex.reps && b.workSec===ex.workSec && b.restSec===ex.restSec) return b;
  }
  var nb = { id:uid(), ex:ex.id, name:tplText(ex.name), reps:ex.reps, workSec:ex.workSec, restSec:ex.restSec,
             sides:ex.perSide, hint:tplText(ex.hint), updatedAt:Date.now() };
  if(zwischen){ zwischen.push(nb); return nb; }
  state.db.blocks.push(nb);
  save();
  return nb;
}
EXERCISES.forEach(function(ex){ ex.level = EX_LEVEL[ex.id] || 2; ex.equip = (EX_EQUIP[ex.id] || "none").split(" "); });

var EX_MAIN = {};
Object.keys(EX_MAIN_ROWS).forEach(function(k){ EX_MAIN_ROWS[k].split(" ").forEach(function(id){ EX_MAIN[id] = k; }); });
/* Eigene Übungen bekommen ihre Hauptkategorie aus Fokus und Ausrüstung */
function deriveMain(ex){
  if(ex.cats.indexOf("stretch") > -1) return "stretch";
  if(ex.equip.every(function(e){ return e==="bar" || e==="dip"; }) || ex.cats.indexOf("calis") > -1) return "stange";
  if(ex.cats.indexOf("cardio") > -1) return "ausdauer";
  if(ex.cats.length === 1 && ex.cats[0] === "core") return "rumpf";
  return "kraft";
}
EXERCISES.forEach(function(ex){ ex.main = EX_MAIN[ex.id] || "kraft"; });
function mainCat(id){ for(var i=0;i<MAIN_CATS.length;i++) if(MAIN_CATS[i].id===id) return MAIN_CATS[i]; return MAIN_CATS[0]; }
function mainMatch(sel, main){ sel = selArr(sel); return !sel.length || sel.indexOf(main) > -1; }
/* Dehn- und Mobility-Übungen stehen in gemischten Workouts immer am Ende (Reihenfolge sonst unverändert) */
/* Workouts bauen: ohne Übungen aus dem Freien Training (Studio - dort trägt man Gewicht ein) und ohne Dehnen */
var STUDIO_NUR = {};
STUDIO_GRUPPEN.forEach(function(g){ g.ids.split(" ").forEach(function(id){ STUDIO_NUR[id] = true; }); });
function fuerWorkout(ex){ return !STUDIO_NUR[ex.id] && ex.main !== "stretch"; }
function exIsMobility(id){ var ex = id && findExercise(id); return !!(ex && ex.main === "stretch"); }
function stretchLast(items, idOf){
  var a = [], b = [];
  items.forEach(function(it){ (exIsMobility(idOf(it)) ? b : a).push(it); });
  return a.concat(b);
}
/* Hauptkategorien eines Workouts (für die Kacheln - ein Workout kann in mehreren stehen):
   jede Kategorie, die mindestens ein Viertel der Übungen stellt, sonst die häufigste */
function woMains(exs){
  var n = {}, out = [];
  exs.forEach(function(ex){ n[ex.main] = (n[ex.main]||0) + 1; });
  MAIN_CATS.forEach(function(c){ if(n[c.id] && n[c.id] >= exs.length/4) out.push(c.id); });
  if(!out.length && exs.length){
    var best = null;
    MAIN_CATS.forEach(function(c){ if(n[c.id] && (!best || n[c.id] > n[best])) best = c.id; });
    out.push(best);
  }
  return out;
}

/* Eigene Übungen (state.db.customEx) laufen überall mit, wo Bibliotheksübungen vorkommen:
   Sie werden als ganz normale Einträge an EXERCISES angehängt (custom:true).
   Gespeichert: { id, name, cats[], equip[], perSide, reps (pro Seite), work, rest, hint } */
function customToEx(c){
  var cats = c.cats && c.cats.length ? c.cats.slice() : ["bw"];
  var equip = c.equip && c.equip.length ? c.equip.slice() : ["none"];
  var ex = { id:c.id, custom:true, name:{ de:c.name, en:c.name }, cats:cats, perSide:!!c.perSide,
           setReps:c.reps, reps: c.perSide ? c.reps*2 : c.reps, workSec:c.work, restSec:c.rest,
           hint:{ de:c.hint||"", en:c.hint||"" }, level:2, equip:equip };
  ex.main = deriveMain(ex);
  return ex;
}
function syncCustomEx(){
  for(var i=EXERCISES.length-1;i>=0;i--) if(EXERCISES[i].custom) EXERCISES.splice(i, 1);
  (state.db.customEx || []).forEach(function(c){ if(c && c.id && c.name) EXERCISES.push(customToEx(c)); });
}
function findCustom(id){
  var l = state.db.customEx || [];
  for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i];
  return null;
}
syncCustomEx();
function equipName(id){ for(var i=0;i<EQUIPS.length;i++) if(EQUIPS[i].id===id) return tplText(EQUIPS[i]); return id; }
function exEquipText(ex){ return ex.equip.map(equipName).join(" / "); }
function levelHTML(l){ return ""; }   // Schwierigkeitsgrad bewusst entfernt (zu subjektiv)
function levelHTMLAlt(l){
  return '<span class="lvl" title="'+esc(t("lvl"+l))+'">'+[1,2,3].map(function(i){ return '<i class="'+(i<=l?'on':'')+'"></i>'; }).join("")+
    ' '+esc(t("lvl"+l))+'</span>';
}
/* passt eine Übung zu Ausrüstung und Level? "all" = egal */
function exFits(ex, equip){ return equipMatch(equip, ex); }
function exFitsAlt(ex, equip, level){
  if(equip && equip!=="all" && ex.equip.indexOf(equip) < 0) return false;
  if(level && level!=="all" && ex.level !== +level) return false;
  return true;
}
function woLevel(exs){
  if(!exs.length) return 0;
  var sum = 0; exs.forEach(function(ex){ sum += ex.level; });
  return Math.round(sum/exs.length);
}
/* Mehrfachauswahl: leere Liste = alles */
function selArr(v){ return Array.isArray(v) ? v.slice() : (v && v!=="all" ? [v] : []); }
function selToggle(arr, id){ var a = selArr(arr), i = a.indexOf(id); if(i > -1) a.splice(i, 1); else a.push(id); return a; }
function catMatch(sel, cats){ sel = selArr(sel); return !sel.length || cats.some(function(c){ return sel.indexOf(c) > -1; }); }
/* Übungen, die nur an Stange oder Barren gehen, tauchen bei einem anderen Fokus (z. B. Rücken,
   Bauch) nur auf, wenn man Stange/Barren bei der Ausrüstung ausgewählt hat - oder Calisthenics
   im Fokus ist. Sonst rutschen bei „Rücken“ lauter Klimmzug-Varianten in die Liste. */
function needsBar(ex){ return ex.equip.every(function(e){ return e==="bar" || e==="dip"; }); }
function gearOk(ex, cat, equip, mains){
  cat = selArr(cat); equip = selArr(equip);
  if(!needsBar(ex) || !cat.length || cat.indexOf("calis") > -1 || selArr(mains).indexOf("stange") > -1) return true;
  return ex.equip.some(function(e){ return equip.indexOf(e) > -1; });
}
function equipMatch(sel, ex){ sel = selArr(sel); return !sel.length || ex.equip.some(function(e){ return sel.indexOf(e) > -1; }); }
/* Workout geht mit der gewählten Ausrüstung, wenn jede Übung mit einem der gewählten Dinge machbar ist */
function woFits(exs, equip){
  var sel = selArr(equip);
  return !sel.length || exs.every(function(ex){ return ex.equip.some(function(e){ return sel.indexOf(e) > -1; }); });
}
function woEquipText(exs){
  var need = [];
  exs.forEach(function(ex){
    if(ex.equip.indexOf("none") > -1) return;
    var txt = exEquipText(ex);
    if(need.indexOf(txt) < 0) need.push(txt);
  });
  return need.length ? need.join(" \u00b7 ") : equipName("none");
}

/* Entwurf (Draft): ein Workout aus Übungen, das man anpassen kann.
   mode "uniform" = alle Übungen mit denselben Zeiten (reps/work/rest),
   mode "individual" = jede Übung mit eigenen Zeiten (Start: Empfehlung aus der Bibliothek). */
function itemFromEx(id){
  var ex = findExercise(id);
  return { ex:id, reps:ex.reps, work:ex.workSec, rest:ex.restSec };
}
/* „Für alle gleich“ gilt nicht für Dehnübungen - die behalten ihre Haltezeiten */
function itemTiming(d, it){
  return d.mode==="uniform" && !exIsStretch(it.ex) ? { reps:d.reps, work:d.work, rest:d.rest } : { reps:it.reps, work:it.work, rest:it.rest };
}
function timingText(tm, sides){
  if(sides) return Math.ceil(tm.reps/2)+'&times;'+tm.work+'s '+t("perSide")+'/'+tm.rest+'s';
  return tm.reps+'&times;'+tm.work+'s/'+tm.rest+'s';
}
function draftBlocks(d){
  var items = stretchLast(d.items.filter(function(it){ return findExercise(it.ex); }), function(it){ return it.ex; });
  return items.map(function(it, i){
    var ex = findExercise(it.ex), tm = itemTiming(d, it), next = items[i+1];
    // zwischen zwei Dehnübungen reichen 10 s zum Umsetzen
    var after = it.after != null ? it.after : (next && exIsStretch(it.ex) && exIsStretch(next.ex) ? Math.min(10, d.blockRest||0) : null);
    return { id:"dr-"+i+"-"+ex.id, ex:ex.id, name:tplText(ex.name), reps:tm.reps, workSec:tm.work, restSec:tm.rest,
             sides:ex.perSide, hint:tplText(ex.hint), after:after };
  });
}
function draftRun(d){ return libQuickWorkout(draftBlocks(d), d.blockRest||0, d.name, "draft"); }
function draftCopy(d){ return JSON.parse(JSON.stringify(d)); }
function draftFromLib(lw){
  if(lw.tm) return { key:"lib:"+lw.id, src:"lib", name:tplText(lw.name), mode:"uniform", reps:lw.tm.reps, work:lw.tm.work, rest:lw.tm.rest,
           blockRest:lw.restAfterSec, items:lw.exercises.filter(findExercise).map(itemFromEx) };
  return { key:"lib:"+lw.id, src:"lib", name:tplText(lw.name), mode:"individual", reps:6, work:30, rest:10,
           blockRest:lw.restAfterSec, items:lw.exercises.filter(findExercise).map(itemFromEx) };
}
/* eigene Workouts aus früheren Fassungen (nur Übungs-IDs + "rest") auf das neue Format bringen */
function normMy(mw){
  if(mw.mode) return mw;
  mw.blockRest = mw.rest != null ? mw.rest : 45;
  mw.mode = "individual"; mw.reps = 6; mw.work = 30; mw.rest = 10;
  mw.items = (mw.items||[]).filter(function(x){ return typeof x==="string" ? findExercise(x) : x && findExercise(x.ex); })
    .map(function(x){ return typeof x==="string" ? itemFromEx(x) : x; });
  return mw;
}
function draftFromMy(mw){
  var d = draftCopy(normMy(mw));
  d.key = "my:"+mw.id; d.src = "my";
  return d;
}
function findMy(id){
  var l = state.db.myWorkouts || [];
  for(var i=0;i<l.length;i++) if(l[i].id===id) return normMy(l[i]);
  return null;
}
function myRun(mw){ return draftRun(normMy(mw)); }
function createMyFromDraft(d){
  var mw = { id:uid(), name:d.name, mode:d.mode, reps:d.reps, work:d.work, rest:d.rest, blockRest:d.blockRest,
             items:draftCopy(d.items), updatedAt:Date.now() };
  if(!state.db.myWorkouts) state.db.myWorkouts = [];
  state.db.myWorkouts.push(mw); save();
  return mw;
}
/* Fertiges Workout übernehmen: Kopie unter „Eigene“, danach im Baukasten öffnen */
function adoptLibWorkout(lw){
  var mw = createMyFromDraft(draftFromLib(lw));
  go("#mybuild/"+mw.id);
}
var coverDraft = null;   // das Workout auf dem Deckblatt - Änderungen gelten nur für dieses Training

/* Farbe einer Kategorie */
function exIsStretch(id){ var ex = id && findExercise(id); return !!(ex && ex.cats.indexOf("stretch") > -1); }
function catVar(id){ return id==="mix" || id==="all" ? "var(--tp-color)" : "var(--c-"+id+")"; }
/* Farbe einer Übung im Studio: Geräte und eigene Studio-Übungen violett, Air-Übungen (z. B. mit ★) in Air-Blau */
function studioFarbe(ex){ return STUDIO_NUR[ex.id] || (ex.custom && ex.equip.indexOf("gym") > -1) ? "var(--bl-color)" : catVar(ex.cats[0]); }
var CAT_ICON = {
  cardio:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  weight:'<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>',
  bw:'<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M7.5 10h9M12 14l-3.5 6M12 14l3.5 6"/>',
  back:'<path d="M12 3v18M8.5 6.5h7M8 10.5h8M8.5 14.5h7M9.5 18.5h5"/>',
  legs:'<path d="M9.5 3v9l-1.5 8h3.5M14.5 3v9l1 8h3.5"/>',
  core:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r=".6"/>',
  arms:'<path d="M4 18c1.5-4 3.5-7 6.5-8.5M10.5 9.5c1-2.5 3.5-4.5 6-4.5 1.5 0 2.5 1.5 1.5 3l-2.5 3.5M15.5 11c2 .5 4 2.5 4 5-3 2.5-9 3-15.5 2"/>',
  stretch:'<circle cx="12" cy="4.5" r="2"/><path d="M5 5.5l7 3 7-3M12 8.5v5M12 13.5l-5 6.5M12 13.5l5 6.5"/>',
  mix:'<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  calis:'<path d="M3 5h18M7 5v3M17 5v3"/><circle cx="12" cy="9.5" r="2"/><path d="M8 8l4 4 4-4M12 12v5M12 17l-2.5 4M12 17l2.5 4"/>'
};
var EQUIP_ICON = {
  none:'<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M7.5 10h9M12 14l-3.5 6M12 14l3.5 6"/>',
  db:'<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>',
  kb:'<circle cx="12" cy="15" r="5.5"/><path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"/>',
  bar:'<path d="M3 6h18M7 6v4M17 6v4M7 10v9M17 10v9"/>',
  dip:'<path d="M3 9h7M14 9h7M5 9v10M8 9v10M16 9v10M19 9v10"/>',
  gym:'<path d="M5 21V3M5 7h9M14 3v10M10 13h8v3h-8zM5 17h6"/>'
};
function svgIcon(inner, cls){
  return '<svg class="'+(cls||"ico")+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+inner+'</svg>';
}
function catIcon(c){ return CAT_ICON[c] ? svgIcon(CAT_ICON[c]) : ""; }
function catTags(cats){
  return cats.map(function(c){ return '<span class="cat-tag">'+catIcon(c)+esc(catName(c))+'</span>'; }).join("");
}
/* Stern für einzelne Übungen - markierte stehen in Listen immer oben */
function isExFav(id){ return (state.db.settings.exFavs || []).indexOf(id) > -1; }
function toggleExFav(id){ state.db.settings.exFavs = selToggle(state.db.settings.exFavs || [], id); save(); }
function exFavBtn(id){
  var on = isExFav(id);
  return '<button type="button" class="fav-btn ex-fav'+(on?' on':'')+'" data-exfav="'+id+'" aria-pressed="'+on+'" title="'+t("favorite")+'" aria-label="'+t("favorite")+'">'+(on?'\u2605':'\u2606')+'</button>';
}
/* Suche: Name (de/en), Muskeln, Hinweis - gefiltert wird im DOM, damit die Tastatur offen bleibt */
function exSearchText(ex){
  var m = EX_MUSCLES[ex.id] || [];
  return [ex.name.de, ex.name.en, m[0], m[1], m[2], m[3], ex.hint.de, ex.hint.en, EX_SUCH_ALIAS[ex.id] || ""].join(" ").toLowerCase();
}
function searchHTML(q, pre, ph){
  ph = ph || t("searchPh");
  return '<div class="lib-search">'+svgIcon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>', "ico s-ico")+
    '<input type="search" id="'+pre+'-q" value="'+esc(q||"")+'" placeholder="'+esc(ph)+'" autocomplete="off" aria-label="'+esc(ph)+'"></div>';
}
/* Suche tolerant: Groß/klein, Bindestriche, Leerzeichen und Umlaute egal („pull ups“ = „Pull-ups“ = „pullups“,
   „liegestutz“ = „Liegestütz“), jedes Wort für sich (Reihenfolge egal), Mehrzahl-s egal („pullups“ findet „Pull-Up“) */
function suchNorm(x){
  return String(x || "").toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ").trim();
}
function suchPasst(text, q){
  var n = suchNorm(text), nz = n.replace(/ /g, ""), w = suchNorm(q);
  if(!w) return true;
  function ohneS(x){ return x.length > 3 ? x.replace(/s$/, "") : x; }
  if(nz.indexOf(ohneS(w.replace(/ /g, ""))) > -1) return true;
  return w.split(" ").every(function(x){ return n.indexOf(x) > -1 || nz.indexOf(ohneS(x)) > -1; });
}
/* Übungs-Kachel für alle Auswahlen: Figur groß, Name darunter; nr = Position(en) im Ablauf -> blau markiert.
   o: { bild (Figur-ID), name, attr, q, cat, nr, innen (im Bild), unter (unter dem Namen), klasse } */
function uebKachel(o){
  var gewaehlt = o.nr && o.nr.length;
  return '<div class="fig-karte wb-kachel'+(gewaehlt ? ' gewaehlt' : '')+(o.klasse ? ' '+o.klasse : '')+'" role="button" tabindex="0" '+o.attr+
      (o.q ? ' data-q="'+esc(o.q)+'"' : '')+' style="--cat:'+(o.cat || 'var(--accent)')+'"'+(o.nr ? ' aria-pressed="'+!!gewaehlt+'"' : '')+'>'+
    '<span class="fig-bild">'+(ILLU[o.bild] ? illuHTML(o.bild, "fig-illu") : '<span class="st-ohne">'+svgIcon(EQUIP_ICON.none)+'</span>')+
      (gewaehlt ? '<span class="wb-nr">'+o.nr.join("·")+'</span>' : '')+(o.innen || '')+'</span>'+
    '<span class="fig-name">'+esc(o.name)+'</span>'+(o.unter || '')+'</div>';
}
/* Antippen und Enter/Leertaste für Kacheln (Knöpfe in der Kachel, z. B. Info und Stern, zählen nicht) */
function kachelKlick(root, sel, fn){
  root.querySelectorAll(sel).forEach(function(el){
    el.addEventListener("click", function(e){ if(e.target.closest("[data-exinfo], [data-exfav]")) return; fn(el); });
    el.addEventListener("keydown", function(e){ if(e.target === el && (e.key==="Enter" || e.key===" ")){ e.preventDefault(); fn(el); } });
  });
}
function applySearch(root, q){
  q = (q || "").trim().toLowerCase();
  var shown = 0;
  root.querySelectorAll("[data-q]").forEach(function(el){
    var ok = !q || suchPasst(el.getAttribute("data-q"), q);
    el.style.display = ok ? "" : "none";
    if(ok) shown++;
  });
  var leer = root.querySelector("[data-noresult]");
  if(leer) leer.style.display = shown ? "none" : "";
}
var libQuery = "", buildQuery = "";
/* Übungen gefiltert und sortiert (Standard = Reihenfolge der Liste, A–Z = alphabetisch) */
/* Filterreihenfolge: erst die Hauptkategorie (Kacheln), dann Fokus und Ausrüstung */
function exPasses(ex, cat, equip, mains){
  return mainMatch(mains, ex.main) && catMatch(cat, ex.cats) && equipMatch(equip, ex) && gearOk(ex, cat, equip, mains);
}
function sortedExercises(cat, sort, equip, mains){
  var list = EXERCISES.filter(function(ex){ return !libHidden("ex:"+ex.id) && exPasses(ex, cat, equip, mains); });
  if(sort==="az") list = list.slice().sort(function(a, b){
    return tplText(a.name).localeCompare(tplText(b.name), currentLang());
  });
  // markierte Übungen immer oben, danach die eigenen, Reihenfolge sonst unverändert
  var fav = list.filter(function(ex){ return isExFav(ex.id); });
  var own = list.filter(function(ex){ return !isExFav(ex.id) && ex.custom; });
  return fav.concat(own, list.filter(function(ex){ return !isExFav(ex.id) && !ex.custom; }));
}

/* Figur zeichnen: Rumpf kräftiger als die Glieder, schmaler Hals, Hände als Punkte.
   Der vordere Arm bekommt eine Maske (schmale Lücke im Körper dahinter) - so bleibt er
   auch vor dem Rumpf erkennbar, egal auf welchem Hintergrund. "@M@" wird pro Bild durch eine eindeutige Id ersetzt. */
/* Brustkorb: breiteres Rumpfstück von der Schulter bis knapp unter die Mitte - Oberkörper wirkt dadurch zur Taille hin schmaler */
function brustEnde(s, p){ return [ +(s[0] + (p[0]-s[0])*.45).toFixed(1), +(s[1] + (p[1]-s[1])*.45).toFixed(1) ]; }
/* Ferse: kurzes Stück hinter dem Knöchel, entgegen der Fußspitze */
function fersePunkt(ankle, toe){ return [ +(ankle[0] + (ankle[0]-toe[0])*.55).toFixed(1), +(ankle[1] + (ankle[1]-toe[1])*.55).toFixed(1) ]; }
function haloStart(s, e){ return [ +(s[0] + (e[0]-s[0])*.45).toFixed(1), +(s[1] + (e[1]-s[1])*.45).toFixed(1) ]; }
function qSVG(q){
  var n = q.n, p = q.p;
  var dx = n[0]-p[0], dy = n[1]-p[1], len = Math.sqrt(dx*dx+dy*dy) || 1;
  var h = q.h || [ +(n[0] + dx/len*9).toFixed(1), +(n[1] + dy/len*9).toFixed(1) ];
  var s = [ +(n[0] - dx*.15).toFixed(1), +(n[1] - dy*.15).toFixed(1) ];   // Schulter knapp unter dem Nacken
  function limb(start, pts, hinten){
    var d = "M"+start[0]+" "+start[1];
    for(var i=0;i<pts.length;i+=2) d += "L"+pts[i]+" "+pts[i+1];
    var out = '<path'+(hinten ? ' class="lb"' : '')+' d="'+d+'"/>';
    if(start === p && pts.length >= 6){   // Bein mit Fußspitze: Ferse ergänzen
      var f = fersePunkt([pts[2], pts[3]], [pts[4], pts[5]]);
      out += '<path class="fs'+(hinten ? ' lb' : '')+'" d="M'+pts[2]+' '+pts[3]+'L'+f[0]+' '+f[1]+'"/>';
    }
    return out;
  }
  function hand(a, hinten){ return '<circle class="hd'+(hinten ? ' lb' : '')+'" cx="'+a[a.length-2]+'" cy="'+a[a.length-1]+'" r="3.3"/>'; }
  var b = brustEnde(s, p);
  var rumpf = '<path class="tr" d="M'+p[0]+' '+p[1]+'L'+s[0]+' '+s[1]+'"/><path class="br" d="M'+s[0]+' '+s[1]+'L'+b[0]+' '+b[1]+'"/>'+
    '<path class="nk" d="M'+s[0]+' '+s[1]+'L'+n[0]+' '+n[1]+'"/>';
  var koerper = q.f ? rumpf : "";
  q.l.forEach(function(l, i){ if(i>0) koerper += limb(p, l, !q.f); });
  q.a.forEach(function(a, i){ if(i>0) koerper += limb(s, a, !q.f) + hand(a, !q.f); });
  if(!q.f) koerper += rumpf;
  if(q.l[0]) koerper += limb(p, q.l[0], false);
  var kopf = '<circle cx="'+h[0]+'" cy="'+h[1]+'" r="7"/>';
  var a0 = q.a[0];
  if(!a0) return q.x + koerper + kopf;
  var hs = haloStart(s, a0), halo = "M"+hs[0]+" "+hs[1];
  for(var i=0;i<a0.length;i+=2) halo += "L"+a0[i]+" "+a0[i+1];
  return q.x + '<mask id="@M@" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140"><rect x="-20" y="-20" width="140" height="140" fill="#fff"/>'+
    '<path d="'+halo+'" stroke="#000" stroke-width="9" fill="none"/></mask><g mask="url(#@M@)">'+koerper+'</g>'+kopf+limb(s, a0, false)+hand(a0, false);
}
var illuMaskSeq = 0;
function illuIds(svg){ var id = "im"+(illuMaskSeq++); return svg.replace(/@M@/g, id); }

var ILLU_MATTE = '<rect class="illu-matte" x="14" y="3" width="72" height="94" rx="8"/>';
var ILLU = {}, ILLU2 = {};
Object.keys(ILLU_POSES).forEach(function(id){
  var pp = ILLU_POSES[id];
  ILLU[id] = [ qSVG(pp[0]), pp[1] ? qSVG(pp[1]) : null ];
});
Object.keys(ILLU_VIEW2).forEach(function(id){
  var v = ILLU_VIEW2[id];
  ILLU2[id] = [ qSVG(v.p[0]), v.p[1] ? qSVG(v.p[1]) : null ];
});
function illuStillHTML(exId, cls){
  var p = ILLU[exId];
  if(!p) return "";
  return '<svg class="illu still '+(cls||"")+'" viewBox="0 0 100 100" aria-hidden="true">'+
    '<path class="illu-floor" d="M6 91h88"/><g class="pose-a">'+illuIds(p[0])+'</g></svg>';
}
/* Bewegte Figur: zunächst Pose A als Standbild; sobald das SVG im Dokument hängt, baut
   illuSetup() daraus ein Skelett, das zwischen den Posen nur die Gelenkwinkel dreht. */
var illuReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
function illuHTML(exId, cls, view2){
  var p = view2 ? ILLU2[exId] : ILLU[exId];
  if(!p) return "";
  var anim = p[1] && !illuReduced, oben = view2 && ILLU_VIEW2[exId].typ === "top";
  return '<svg class="illu '+(cls||"")+(anim ? " illu-anim" : " still")+'"'+(anim ? ' data-ex="'+exId+'"'+(view2 ? ' data-view="2"' : '') : '')+' viewBox="0 0 100 100" aria-hidden="true">'+
    (oben ? ILLU_MATTE : '<path class="illu-floor" d="M6 91h88"/>')+'<g class="pose-a">'+illuIds(p[0])+'</g></svg>';
}

/* ---------- Skelett-Animation ----------
   Jede Pose wird in ein Skelett zerlegt: Wurzel in der Hüfte, Wirbelsäule mit absolutem Winkel,
   daran Kopf, Beine (Oberschenkel → Unterschenkel → Fuß) und Arme ab der Schulter (Oberarm →
   Unterarm), jeweils mit Winkel relativ zum Elternknochen. Animiert werden nur diese Winkel
   (auf dem kürzesten Weg) - so bleiben Gliedmaßen gleich lang und drehen natürlich um ihre
   Gelenke, statt zwischen zwei Posen überzublenden. Geräte in der Hand wandern mit der Hand. */
function rigFromPose(q){
  var n = q.n, p = q.p;
  var dx = n[0]-p[0], dy = n[1]-p[1], len = Math.sqrt(dx*dx+dy*dy) || 1;
  var h = q.h || [ n[0] + dx/len*9, n[1] + dy/len*9 ];
  var sa = Math.atan2(dy, dx);
  var s = [ p[0] + dx*.85, p[1] + dy*.85 ];   // Schulter knapp unter dem Nacken (wie qSVG)
  function kette(start, pts){
    var out = [], prev = start, pa = sa;
    for(var i=0;i+1<pts.length;i+=2){
      var a = Math.atan2(pts[i+1]-prev[1], pts[i]-prev[0]);
      out.push({ rel:a-pa, len:Math.sqrt(Math.pow(pts[i]-prev[0],2)+Math.pow(pts[i+1]-prev[1],2)) });
      pa = a; prev = [pts[i], pts[i+1]];
    }
    return out;
  }
  return { p:p.slice(), sa:sa, sl:len,
           head:{ rel:Math.atan2(h[1]-n[1], h[0]-n[0])-sa, len:Math.sqrt(Math.pow(h[0]-n[0],2)+Math.pow(h[1]-n[1],2)) },
           legs:q.l.map(function(l){ return kette(p, l); }), arms:q.a.map(function(a){ return kette(s, a); }) };
}
/* Fehlt in einer Pose ein Glied (oder ein Fuß), übernimmt sie es aus der anderen - es bleibt dann einfach stehen */
function rigAlign(A, B){
  function glieder(la, lb){
    var n = Math.max(la.length, lb.length), a = [], b = [];
    for(var i=0;i<n;i++){
      var ka = la[i] || lb[i], kb = lb[i] || la[i], m = Math.max(ka.length, kb.length), xa = [], xb = [];
      for(var j=0;j<m;j++){ xa.push(ka[j] || kb[j]); xb.push(kb[j] || ka[j]); }
      a.push(xa); b.push(xb);
    }
    return [a, b];
  }
  var l = glieder(A.legs, B.legs), r = glieder(A.arms, B.arms);
  A.legs = l[0]; B.legs = l[1]; A.arms = r[0]; B.arms = r[1];
}
function angLerp(a, b, t){
  var d = b - a;
  d = ((d + Math.PI) % (2*Math.PI) + 2*Math.PI) % (2*Math.PI) - Math.PI;
  return a + d*t;
}
function rigPoints(A, B, t){
  function L(a, b){ return a + (b-a)*t; }
  var p = [ L(A.p[0], B.p[0]), L(A.p[1], B.p[1]) ];
  var sa = angLerp(A.sa, B.sa, t), sl = L(A.sl, B.sl);
  var c = Math.cos(sa), si = Math.sin(sa);
  var n = [ p[0] + c*sl, p[1] + si*sl ], s = [ p[0] + c*sl*.85, p[1] + si*sl*.85 ];
  var ha = sa + angLerp(A.head.rel, B.head.rel, t), hl = L(A.head.len, B.head.len);
  function kette(start, ka, kb){
    var pts = [], prev = start, pa = sa;
    for(var i=0;i<ka.length;i++){
      var a = pa + angLerp(ka[i].rel, kb[i].rel, t), l = L(ka[i].len, kb[i].len);
      prev = [ prev[0] + Math.cos(a)*l, prev[1] + Math.sin(a)*l ];
      pts.push(prev); pa = a;
    }
    return pts;
  }
  return { p:p, n:n, s:s, h:[ n[0] + Math.cos(ha)*hl, n[1] + Math.sin(ha)*hl ],
           legs:A.legs.map(function(k, i){ return kette(p, k, B.legs[i]); }),
           arms:A.arms.map(function(k, i){ return kette(s, k, B.arms[i]); }) };
}
/* Geräte, die die Hand hält (Hantel, Kettlebell), stecken in <g class="gh" data-at="x,y">,
   Polster und Platten am Fuß (Beinstrecker, Schlitten) in <g class="gf" data-at="x,y"> */
function gearSplit(x){
  var hand = [], fest = (x || "").replace(/<g class="(gh|gf)" data-at="([\d.\-]+),([\d.\-]+)">([\s\S]*?)<\/g>/g, function(m, art, gx, gy, inner){
    hand.push({ at:[+gx, +gy], svg:m, fuss:art === "gf" });
    return "";
  });
  return { fest:fest, hand:hand };
}
function ptsD(start, pts){
  var d = "M"+start[0].toFixed(1)+" "+start[1].toFixed(1);
  pts.forEach(function(q){ d += "L"+q[0].toFixed(1)+" "+q[1].toFixed(1); });
  return d;
}
var illuFigs = [], illuRaf = 0, illuIO = null, illuSeq = 0;
function illuSetup(svg){
  svg.setAttribute("data-rig", "1");
  var id = svg.getAttribute("data-ex"), view2 = svg.getAttribute("data-view") === "2";
  var seq = view2 ? (ILLU_VIEW2[id] || {}).seq : ILLU_SEQ[id];
  var pp = view2 ? (ILLU_VIEW2[id] || {}).p : ILLU_POSES[id];
  if(!seq && (!pp || !pp[1])) return;
  /* Phasen: zwei Posen pendeln hin und her; Abläufe (ILLU_SEQ) laufen reihum durch */
  var qs = seq ? seq.k : [pp[0], pp[1]];
  var times = seq ? seq.t : [[ILLU_HOLD_A, ILLU_MOVE], [ILLU_HOLD_B, ILLU_MOVE]];
  var R = qs.map(rigFromPose);
  for(var pass=0; pass<2; pass++) for(var k=1; k<R.length; k++) rigAlign(R[0], R[k]);
  var gs = qs.map(function(q){ return gearSplit(q.x); });
  var P = R.map(function(r){ return rigPoints(r, r, 0); });
  function naechsteHand(pts, at){
    var best = 0, bd = Infinity;
    pts.arms.forEach(function(k, i){
      var e = k[k.length-1], d = Math.pow(e[0]-at[0],2) + Math.pow(e[1]-at[1],2);
      if(d < bd){ bd = d; best = i; }
    });
    return best;
  }
  function naechsterFuss(pts, at){
    var best = [0, 0], bd = Infinity;
    pts.legs.forEach(function(k, i){ k.forEach(function(e, j){
      var d = Math.pow(e[0]-at[0],2) + Math.pow(e[1]-at[1],2);
      if(d < bd){ bd = d; best = [i, j]; }
    }); });
    return best;
  }
  function anker(pt, g){ if(g.leg != null){ return pt.legs[g.leg][g.pt]; } var hk = pt.arms[g.arm]; return hk[hk.length-1]; }
  var gears = gs[0].hand.map(function(g, i){
    var gg = { at:g.at, svg:g.svg };
    if(g.fuss){ var f = naechsterFuss(P[0], g.at); gg.leg = f[0]; gg.pt = f[1]; gg.arm = -1; }
    else gg.arm = naechsteHand(P[0], g.at);
    var o = P.map(function(pt, k){
      var e = anker(pt, gg), at = gs[k].hand[i] ? gs[k].hand[i].at : null;
      return at ? [ at[0]-e[0], at[1]-e[1] ] : null;
    });
    gg.o = o.map(function(v){ return v || o[0]; });
    return gg;
  });
  var frontal = !!qs[0].f;
  var html = view2 && ILLU_VIEW2[id].typ === "top" ? ILLU_MATTE : '<path class="illu-floor" d="M6 91h88"/>';
  var gleich = gs.every(function(g){ return g.fest === gs[0].fest; });
  if(gleich || gs.length > 2) html += gs[0].fest;
  else html += '<g class="gx-a">'+gs[0].fest+'</g><g class="gx-b" style="opacity:0">'+gs[1].fest+'</g>';
  var vorn = "";
  gears.forEach(function(g, i){
    var el = '<g class="gear" data-g="'+i+'">'+g.svg+'</g>';
    if(g.arm === 0 || g.leg === 0) vorn += el; else html += el;
  });
  var A = R[0];
  var hinten = frontal ? '' : ' class="lb"', hintenHand = frontal ? ' class="hd"' : ' class="hd lb"';
  var mid = "im"+(illuMaskSeq++), rumpf = '<path class="tr" data-spine="1"/><path class="br" data-brust="1"/><path class="nk" data-neck="1"/>';
  var koerper = frontal ? rumpf : "";
  var hintenFerse = frontal ? ' class="fs"' : ' class="fs lb"';
  A.legs.forEach(function(k, i){ if(i>0) koerper += '<path'+hinten+' data-leg="'+i+'"/>'+(k.length >= 3 ? '<path'+hintenFerse+' data-ferse="'+i+'"/>' : ''); });
  A.arms.forEach(function(k, i){ if(i>0) koerper += '<path'+hinten+' data-arm="'+i+'"/><circle'+hintenHand+' r="3.3" data-hand="'+i+'"/>'; });
  if(!frontal) koerper += rumpf;
  if(A.legs.length) koerper += '<path data-leg="0"/>'+(A.legs[0].length >= 3 ? '<path class="fs" data-ferse="0"/>' : '');
  var kopf = '<circle data-head="1" r="7"/>';
  if(A.arms.length){
    html += '<mask id="'+mid+'" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140"><rect x="-20" y="-20" width="140" height="140" fill="#fff"/>'+
      '<path data-halo="1" stroke="#000" stroke-width="9" fill="none"/></mask><g mask="url(#'+mid+')">'+koerper+'</g>'+kopf+
      '<path data-arm="0"/><circle class="hd" r="3.3" data-hand="0"/>' + vorn;
  } else html += koerper + kopf + vorn;
  svg.innerHTML = html;
  var fig = { svg:svg, R:R, times:times, gears:gears, vis:true, seq:illuSeq++,
              speed: seq ? 1 : (findExercise(id) || {}).main === "ausdauer" ? .7 : 1,
              legs:[], arms:[], gearEls:[],
              spine:svg.querySelector("[data-spine]"), head:svg.querySelector("[data-head]"),
              neck:svg.querySelector("[data-neck]"), brust:svg.querySelector("[data-brust]"), fersen:[], halo:svg.querySelector("[data-halo]"), hands:[],
              gxa:svg.querySelector(".gx-a"), gxb:svg.querySelector(".gx-b") };
  A.legs.forEach(function(k, i){ fig.legs[i] = svg.querySelector('[data-leg="'+i+'"]'); fig.fersen[i] = svg.querySelector('[data-ferse="'+i+'"]'); });
  A.arms.forEach(function(k, i){ fig.arms[i] = svg.querySelector('[data-arm="'+i+'"]'); fig.hands[i] = svg.querySelector('[data-hand="'+i+'"]'); });
  gears.forEach(function(g, i){ fig.gearEls[i] = svg.querySelector('[data-g="'+i+'"]'); });
  illuDraw(fig, { i:0, j:1 % R.length, t:0 });
  illuFigs.push(fig);
  if(illuIO) illuIO.observe(svg);
  if(!illuRaf) illuRaf = requestAnimationFrame(illuFrame);
}
/* b = { i: Phase, j: nächste Phase, t: 0..1 dazwischen } */
function illuDraw(f, b){
  var t = b.t, P = rigPoints(f.R[b.i], f.R[b.j], t);
  f.spine.setAttribute("d", ptsD(P.p, [P.s]));
  f.brust.setAttribute("d", ptsD(P.s, [brustEnde(P.s, P.p)]));
  f.neck.setAttribute("d", ptsD(P.s, [P.n]));
  f.head.setAttribute("cx", P.h[0].toFixed(1)); f.head.setAttribute("cy", P.h[1].toFixed(1));
  P.legs.forEach(function(k, i){
    f.legs[i].setAttribute("d", ptsD(P.p, k));
    if(f.fersen[i] && k.length >= 3) f.fersen[i].setAttribute("d", ptsD(k[1], [fersePunkt(k[1], k[2])]));
  });
  P.arms.forEach(function(k, i){
    f.arms[i].setAttribute("d", ptsD(P.s, k));
    var e = k[k.length-1];
    if(f.hands[i]){ f.hands[i].setAttribute("cx", e[0].toFixed(1)); f.hands[i].setAttribute("cy", e[1].toFixed(1)); }
  });
  if(f.halo && P.arms[0]) f.halo.setAttribute("d", ptsD(haloStart(P.s, P.arms[0][0]), P.arms[0]));
  f.gears.forEach(function(g, i){
    var hand = g.leg != null ? P.legs[g.leg][g.pt] : P.arms[g.arm][P.arms[g.arm].length-1], oa = g.o[b.i], ob = g.o[b.j];
    var ox = oa[0] + (ob[0]-oa[0])*t, oy = oa[1] + (ob[1]-oa[1])*t;
    f.gearEls[i].setAttribute("transform", "translate("+(hand[0]+ox-g.at[0]).toFixed(1)+" "+(hand[1]+oy-g.at[1]).toFixed(1)+")");
  });
  if(f.gxa){ var x = b.i === 0 ? t : 1-t; f.gxa.style.opacity = (1-x).toFixed(2); f.gxb.style.opacity = x.toFixed(2); }
}
/* Ablauf: jede Phase kurz halten, dann weiter zur nächsten. Zwei Posen: A halten, nach B, B halten, zurück.
   Ausdauerübungen etwas flotter. Easing je Übergang: "o" = abbremsen (Absprung nach oben),
   "i" = beschleunigen (Fallen/Landen), "l" = gleichmäßig (Zwischenpunkte), sonst weich an beiden Enden. */
var ILLU_HOLD_A = .38, ILLU_MOVE = .78, ILLU_HOLD_B = .26;
function illuBlend(now, f){
  var total = 0, K = f.times.length;
  f.times.forEach(function(x){ total += x[0] + x[1]; });
  var x = ((now/1000 + f.seq*.37) % (total*f.speed))/f.speed;
  for(var k=0; k<K; k++){
    var h = f.times[k][0], m = f.times[k][1], e = f.times[k][2], j = (k+1) % K;
    if(x < h) return { i:k, j:j, t:0 };
    x -= h;
    if(x < m){ var u = x/m; return { i:k, j:j, t: e === "o" ? 1-(1-u)*(1-u) : e === "i" ? u*u : e === "l" ? u : easeInOutCubic(u) }; }
    x -= m;
  }
  return { i:0, j:1 % K, t:0 };
}
function illuFrame(now){
  illuRaf = 0;
  illuFigs = illuFigs.filter(function(f){
    if(f.svg.isConnected) return true;
    if(illuIO) illuIO.unobserve(f.svg);
    return false;
  });
  if(!illuFigs.length) return;
  illuFigs.forEach(function(f){ if(f.vis) illuDraw(f, illuBlend(now, f)); });
  illuRaf = requestAnimationFrame(illuFrame);
}
if(window.IntersectionObserver){
  illuIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      for(var i=0;i<illuFigs.length;i++) if(illuFigs[i].svg === e.target){ illuFigs[i].vis = e.isIntersecting; break; }
    });
  });
}
/* neue Figuren im Dokument automatisch in Bewegung setzen */
new MutationObserver(function(){
  var neu = document.querySelectorAll("svg.illu-anim:not([data-rig])");
  for(var i=0;i<neu.length;i++) illuSetup(neu[i]);
}).observe(document.body, { childList:true, subtree:true });

function musclesMain(ex){ var m = EX_MUSCLES[ex.id]; return m ? m[currentLang()==="en" ? 2 : 0] : ""; }
function musclesAssist(ex){ var m = EX_MUSCLES[ex.id]; return m ? m[currentLang()==="en" ? 3 : 1] : ""; }
function musclesLabel(ex){ return t(ex.cats.indexOf("stretch") > -1 ? "musStretched" : "musWorked"); }

/* Info-Fenster: großes Piktogramm, Anleitung, Tipp. Im Timer läuft die Zeit sichtbar weiter. */
var infoTimer = null;
/* Farbe des Bereichs, in dem man gerade ist - Figuren in Einblendfenstern passen sich an */
function bereichsFarbe(){
  var h = navTop(), m = h.match(/^#cover\/lib\/(.+)$/);
  if(/^#warmstretch/.test(h) || (m && libIstWarmDehn(findLibWorkout(m[1])))) return "var(--ws-color)";
  if(/^#(reps|rep|repplay|repedit)(\/|$)/.test(h)) return "var(--rep-color)";
  return "";
}
function openExInfo(exId, live, lib){
  var ex = findExercise(exId), info = EX_INFO[exId], farbe = bereichsFarbe() || (ex && studioFarbe(ex) === "var(--bl-color)" ? "var(--bl-color)" : "");
  if(!ex || !info) return;
  var lang = currentLang()==="en" ? 1 : 0;
  var steps = info[lang].split("|").map(function(s){ return '<li>'+esc(s)+'</li>'; }).join("");
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay info-overlay"><div class="confirm-sheet info-sheet" role="dialog" aria-label="'+esc(tplText(ex.name))+'"'+(farbe ? ' style="--bereich:'+farbe+'"' : '')+'>'+
    '<div class="info-head"><div><h3>'+esc(tplText(ex.name))+'</h3>'+
      '<div class="info-sub">'+blockSpec(exBlock(ex))+SEP+esc(ex.cats.map(catName).join(" · "))+'</div></div>'+
      '<button type="button" class="info-x" data-close aria-label="'+t("close")+'">&times;</button></div>'+
    (live ? '<div class="info-live"><span id="info-live-text"></span><button type="button" class="tpl-adopt" data-infopause></button></div>' : '')+
    (ILLU2[exId]
      ? '<div class="info-views"><figure>'+illuHTML(exId, "info-illu")+'<figcaption>'+t(ILLU_VIEW2[exId].haupt === "front" ? "viewFront" : "viewSide")+'</figcaption></figure>'+
        '<figure>'+illuHTML(exId, "info-illu", true)+'<figcaption>'+t({ top:"viewTop", side:"viewSide" }[ILLU_VIEW2[exId].typ] || "viewFront")+'</figcaption></figure></div>'
      : illuHTML(exId, "info-illu"))+
    (EX_MUSCLES[exId] ? '<div class="info-mus"><div><b>'+esc(musclesLabel(ex))+':</b> '+esc(musclesMain(ex))+'</div>'+
      (musclesAssist(ex) ? '<div class="info-mus-2">'+esc(t("musAssist"))+': '+esc(musclesAssist(ex))+'</div>' : '')+'</div>' : '')+
    '<div class="info-title">'+t("howTo")+'</div><ol class="info-steps">'+steps+'</ol>'+
    (function(){
      var p = EX_POSTURE[exId];
      if(!p) return "";
      var cues = p[lang*2].split("|").map(function(c){ return '<li>'+esc(c)+'</li>'; }).join("");
      return '<div class="info-title">'+t("posture")+'</div><ul class="info-posture">'+cues+'</ul>'+
        '<div class="info-avoid"><b>'+t("avoid")+':</b> '+esc(p[lang*2+1])+'</div>';
    })()+
    '<div class="info-tip"><b>'+t("tip")+':</b> '+esc(tplText(ex.hint))+'</div>'+
    (lib ? '<div class="info-lib">'+
      '<button type="button" class="tpl-adopt" data-infoblock>'+ICON_PLUS+' '+t("adoptBlock")+'</button>'+
      '<button type="button" class="tpl-hide" data-infohide>'+t("hideEx")+'</button></div>' : '')+
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a></p>'+
    '<button class="btn btn-secondary" data-close>'+t("close")+'</button>'+
  '</div></div>';
  if(lib){
    root.querySelector("[data-infoblock]").addEventListener("click", function(){
      adoptExercise(ex); showToast(t("adoptedBlock", { n:tplText(ex.name) }));
    });
    root.querySelector("[data-infohide]").addEventListener("click", function(){
      libHide("ex:"+exId); close(); if(lib.onChange) lib.onChange();
    });
  }
  function close(){
    if(infoTimer){ clearInterval(infoTimer); infoTimer = null; }
    root.innerHTML = "";
  }
  root.querySelectorAll("[data-close]").forEach(function(b){ b.addEventListener("click", close); });
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
  if(live){
    var pauseBtn = root.querySelector("[data-infopause]");
    function aktualisieren(){
      if(!playerState){ close(); return; }
      var st = playerState.steps[playerState.idx];
      if(st.phase==="done"){ close(); return; }
      var rem = playerState.paused ? playerState.remainingMs : playerState.endAt - Date.now();
      document.getElementById("info-live-text").innerHTML =
        (playerState.paused ? t("infoPaused") : t("infoRunning"))+SEP+'<b>'+phaseVars(st.phase).label+' '+fmtTime(Math.ceil(Math.max(0,rem)/1000))+'</b>';
      pauseBtn.textContent = playerState.paused ? t("infoResume") : t("infoPause");
    }
    pauseBtn.addEventListener("click", function(){
      var pp = document.getElementById("pl-playpause");
      if(pp) pp.click();
      aktualisieren();
    });
    aktualisieren();
    infoTimer = setInterval(aktualisieren, 250);
  }
}

/* ============ Router ============ */
/* Eigener Navigations-Stack (rein im Speicher): "Zurück" geht immer zur tatsächlich
   zuvor besuchten Seite zurück, egal von wo man eine Ansicht geöffnet hat.
   Im echten Browser-Verlauf liegt dabei höchstens EIN zusätzlicher Eintrag ("Wächter"),
   solange man nicht auf der Startseite ist. Die Android-Zurück-Taste/-Geste landet so
   in unserem popstate-Handler und geht eine Seite zurück (bzw. schließt erst ein offenes
   Fenster); erst auf der Startseite verlässt sie die App. */
var navStack = ["#home"];
var navGuard = false;     // liegt gerade ein Wächter-Eintrag im Verlauf?
var navSkipPop = 0;       // selbst ausgelöste history.back()-Aufrufe, die popstate ignorieren soll

function navTop(){ return navStack[navStack.length-1]; }
function setUrl(hash){ try{ history.replaceState(history.state, "", hash); }catch(e){} }
function syncGuard(){
  if(navStack.length > 1 && !navGuard){
    try{ history.pushState({ bloc:1 }, "", navTop()); navGuard = true; }catch(e){ setUrl(navTop()); }
  } else if(navStack.length <= 1 && navGuard){
    navGuard = false; navSkipPop++;
    history.back();   // Wächter entfernen - popstate setzt danach die Adresse
  } else {
    setUrl(navTop());
  }
}
function go(hash){
  var neueSeite = navTop() !== hash;
  if(hash === "#home") navStack = ["#home"];
  else if(neueSeite) navStack.push(hash);
  syncGuard();
  render();
  if(neueSeite) window.scrollTo(0, 0);   // neue Seite beginnt immer oben
}
function goBack(fallback){
  if(navStack.length > 1){
    navStack.pop();
    syncGuard();
    render();
  } else {
    go(fallback);
  }
}
/* Die aktuelle Seite kommt aus dem Stack, nicht aus location.hash: nach history.back()
   hinkt die Adresse kurz hinterher. */
function parseHash(){
  var h = navTop().replace(/^#\/?/, "");
  var parts = h.split("/").filter(Boolean);
  return parts;
}

/* System-Zurück (Android-Taste/-Geste, Browser-Zurück) */
window.addEventListener("popstate", function(){
  if(navSkipPop > 0){ navSkipPop--; setUrl(navTop()); return; }
  navGuard = false;
  // 1. offenes Einblendfenster schließen (so, als hätte man daneben getippt)
  var ov = document.getElementById("overlayRoot");
  if(ov && ov.innerHTML){
    var bg = ov.querySelector(".confirm-overlay");
    if(bg) bg.click();
    if(ov.innerHTML) ov.innerHTML = "";
    if(infoTimer){ clearInterval(infoTimer); infoTimer = null; }
    syncGuard();
    return;
  }
  // 2. laufender Timer: nicht einfach weg - erst nachfragen
  if(document.getElementById("playerRoot").innerHTML && playerState){
    var st = playerState.steps[playerState.idx];
    if(st && st.phase === "done") exitPlayer();
    else { confirmSheet(t("endQ"), t("endText"), t("endBtn"), exitPlayer); syncGuard(); }
    return;
  }
  // 3. eine Seite zurück; auf der Startseite bleibt kein Wächter übrig -> nächstes Zurück verlässt die App
  if(navStack.length > 1) navStack.pop();
  syncGuard();
  render();
});
/* Fallback: falls sich der Hash doch einmal außerhalb von go()/goBack() ändert
   (z.B. ein von Hand geänderter Link). */
window.addEventListener("hashchange", function(){
  var h = location.hash || "#home";
  if(navTop() === h) return;
  if(h === "#home") navStack = ["#home"]; else navStack.push(h);
  syncGuard();
  render();
});
/* Daten dauerhaft behalten: der Browser soll sie auch bei knappem Speicher nicht von sich aus löschen */
function datenDauerhaft(){
  try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(function(ja){ if(!ja) navigator.storage.persist(); }).catch(function(){}); }catch(e){}
}
window.addEventListener("load", datenDauerhaft);
window.addEventListener("load", function(){
  var initial = location.hash || "#home";
  navStack = initial === "#home" ? ["#home"] : ["#home", initial];
  setUrl("#home");
  syncGuard();
  applyTheme();
  render();
  if(ERSTER_START && initial === "#home" && !state.db.settings.introGesehen) setTimeout(openIntro, 250);
  registerSW();
  maybeShowInstallTip();
});

/* ============ Direkter Installations-Button (Android/Chrome) ============ */
var deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", function(e){
  e.preventDefault();
  deferredInstallPrompt = e;
  render();
});
window.addEventListener("appinstalled", function(){
  deferredInstallPrompt = null;
  render();
});
function triggerInstall(){
  if(!deferredInstallPrompt) return;
  var promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;
  promptEvent.prompt();
  render();
}

/* ============ Theme ============ */
/* Farbe der Browser-/Statusleiste passend zum Seitenhintergrund */
var THEME_BAR_COLORS = { light:"#f5f5f2", dark:"#121214", nacht:"#16110d", kodak:"#f5f2ea" };
function applyTheme(){
  var t = state.db.settings.theme;
  var root = document.documentElement;
  if(THEME_BAR_COLORS[t]) root.setAttribute("data-theme", t);
  else root.removeAttribute("data-theme");
  if(isVintageTheme()) root.setAttribute("data-vintage", "");
  else root.removeAttribute("data-vintage");
  var dunkel = !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  var bar = THEME_BAR_COLORS[t] || (dunkel ? THEME_BAR_COLORS.dark : THEME_BAR_COLORS.light);
  var meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", bar);
}
applyTheme();
applyLang();
tonMischen(true);   // von Anfang an: Musik anderer Apps läuft weiter

/* ============ Render dispatch ============ */
var app = document.getElementById("app");

function render(){
  if(document.getElementById("playerRoot").innerHTML) return; // don't re-render behind active player
  var parts = parseHash();
  var route = parts[0] || "home";
  if(repRun && route !== "repplay") repStop();   // Rep-Workout verlassen: Stoppuhr aus
  if(studioPause && route !== "studio") studioPauseStop();
  if(route==="home") return renderHome();
  if(route==="reps") return renderReps();
  if(route==="warmstretch") return renderWarmStretch();
  if(route==="rep") return renderRepDetail(parts[1]);
  if(route==="repplay") return renderRepPlayer(parts[1]);
  if(route==="repedit") return renderRepEdit(parts[1]);
  if(route==="timers"){
    if(parts[1] === "workouts" || parts[1] === "blocks"){   // frühere Timer-Reiter: jetzt Workouts › Meine
      state.db.settings.libTab = "mine"; navStack[navStack.length-1] = "#library"; setUrl("#library");
      return renderLibrary();
    }
    return renderTimers();
  }
  if(route==="blocks"){ state.db.settings.libTab = "mine"; navStack[navStack.length-1] = "#library"; setUrl("#library"); return renderLibrary(); }
  if(route==="block") return renderBlockEdit(parts[1]);
  if(route==="workout") return renderWorkoutEdit(parts[1]);
  if(route==="settings") return renderSettings();
  if(route==="figuren") return renderFiguren();
  if(route==="studio") return renderStudioKarte(parts[1]);
  if(route==="install") return renderInstallGuide();
  if(route==="play") return startPlayer(parts[1]);
  if(route==="playblock") return startBlockPlayer(parts[1]);
  if(route==="library") return renderLibrary();
  if(route==="exedit") return renderExEdit(parts[1]);
  if(route==="import") return renderImport(parts[1]);
  if(route==="mybuild") return renderMyBuild(parts[1]);
  bauEntwurf = null;   // Baukasten verlassen: nicht gespeicherte Änderungen verwerfen
  if(route==="playmy") return launchFromSource({ type:"mine", id:parts[1] });
  if(route==="cover") return parts[1]==="surprise" || parts[1]==="shared"
    ? (coverDraft && coverDraft.src===parts[1] ? renderDraftPage(coverDraft, { cover:true, back:"#library" }) : go("#library"))
    : renderCover(parts[1], parts[2]);
  if(route==="playdraft") return launchFromSource({ type:"draft" });
  if(route==="playlib") return launchFromSource({ type:"libworkout", id:parts[1] });
  if(route==="playex") return launchFromSource({ type:"exercise", id:parts[1] });
  if(route==="playst") return launchFromSource({ type:"studio", id:parts[1] });
  return renderHome();
}

function topbar(title, opts){
  opts = opts || {};
  var back = opts.back ? '<button class="iconbtn back" data-back="'+opts.back+'" title="'+t("back")+'">'+ICON_BACK+'</button>' : "";
  var right = opts.right || "";
  var brand = opts.home ? '<span class="kodak-word">C60<small>Modular Training Builder</small></span>' : "";
  return '<div class="topbar'+(opts.home?' home':'')+'">'+back+'<h1>'+brand+'<span class="ttl">'+esc(title)+'</span>'+
    (opts.sub ? '<span class="ttl-sub">'+esc(opts.sub)+'</span>' : '')+'</h1>'+right+'</div>';
}
var SEP = ' <span class="sep-dot">&middot;</span> ';

/* ============ Startseite ============ */
var HOME_ICON = {
  timer:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',   /* Freies Training: Hantel */
  intervall:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5M18 7l1.5-1.5"/>',   /* Timer: Stoppuhr */
  lib:'<path d="M3 8.5h10a3 3 0 1 0-3-3"/><path d="M3 12.5h15a3 3 0 1 1-3 3"/><path d="M3 16.5h6"/>',   /* Air: Wind */
  reps:'<path d="M2.5 20l6.5-11.5 3.8 6.3 2.7-4.3 6 9.5z"/><path d="M9 8.5V3.5l3.5 1.5L9 6.5"/>',   /* Summit: Gipfel mit Fahne */
  warm:'<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 2 7-2M12 10.5v4.5l-4.5 5.5M12 15l4.5 5.5"/>'   /* Mobility & Stretch: Figur streckt sich */
};
var ICON_SPARK = '<path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/>';
var ICON_STAR = '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>';
/* Bereichs-Kachel (zwei nebeneinander): Symbol oben, Titel, Kurzbeschreibung, Pfeil */
/* art: "gross" (Workouts, der wichtigste Bereich) oder "zeile" (die übrigen, als ruhige Liste) */
function areaTile(key, href, titel, unter, farbe, art){
  return '<div class="area-tile'+(art ? ' '+art : '')+'" data-nav="'+href+'" data-bereich="'+key+'" role="button" tabindex="0" style="--c:'+farbe+'">'+
      '<span class="at-ico">'+svgIcon(HOME_ICON[key])+'</span>'+
      '<span class="at-text"><b class="at-name">'+esc(titel)+'</b><small class="at-sub">'+esc(unter)+'</small></span>'+
      '<span class="at-chev">'+ICON_CHEV+'</span>'+
    '</div>';
}
/* Bereiche der Startseite: Reihenfolge per langem Drücken änderbar (settings.bereiche), der oberste steht groß vorn */
var BEREICH_KEYS = ["lib", "timer", "reps", "warm"];
function bereichDaten(k){
  if(k === "lib") return ["#library", t("library"), t("htLibN", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length,
    e:EXERCISES.filter(function(ex){ return !ex.custom && fuerWorkout(ex); }).length }), "var(--tp-color)"];
  if(k === "timer") return ["#timers", t("timers"), t("htTimers", { n:Object.keys(STUDIO_NUR).length }), "var(--bl-color)"];
  if(k === "reps") return ["#reps", t("repTitle"), t("htReps"), "var(--rep-color)"];
  return ["#warmstretch", t("warmTitle"), t("htWarm", { p:LIB_WORKOUTS.filter(libIstWarmDehn).length }), "var(--ws-color)"];
}
function bereichReihe(){
  var r = selArr(state.db.settings.bereiche).filter(function(k){ return BEREICH_KEYS.indexOf(k) > -1; });
  BEREICH_KEYS.forEach(function(k){ if(r.indexOf(k) < 0) r.push(k); });
  return r;
}
function bereicheHTML(){
  var r = bereichReihe();
  function kachel(k, art){ var d = bereichDaten(k); return areaTile(k, d[0], d[1], d[2], d[3], art); }
  return '<div class="area-bereiche">'+kachel(r[0], "gross")+
    '<div class="area-gruppe">'+r.slice(1).map(function(k){ return kachel(k, "zeile"); }).join("")+'</div></div>';
}
/* Langes Drücken (0,5 s, ohne zu wischen); der Klick danach wird geschluckt, damit die Seite nicht wechselt */
var langDruckSperre = 0;
document.addEventListener("click", function(e){ if(Date.now() < langDruckSperre){ e.stopPropagation(); e.preventDefault(); } }, true);
function langDruck(el, fn){
  var tm = 0, x0 = 0, y0 = 0;
  function stop(){ if(tm){ clearTimeout(tm); tm = 0; } }
  el.addEventListener("pointerdown", function(e){
    x0 = e.clientX; y0 = e.clientY; stop();
    tm = setTimeout(function(){
      tm = 0; langDruckSperre = Date.now() + 700;
      try { if(navigator.vibrate) navigator.vibrate(15); } catch(err){}
      fn();
    }, 500);
  });
  el.addEventListener("pointermove", function(e){ if(tm && Math.abs(e.clientX-x0) + Math.abs(e.clientY-y0) > 10) stop(); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ el.addEventListener(ev, stop); });
  el.addEventListener("contextmenu", function(e){ e.preventDefault(); });
}
function openBereicheSheet(){
  var root = document.getElementById("overlayRoot"), r = bereichReihe();
  function zeichnen(){
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet bereiche-sheet">'+
      '<h3>'+esc(t("areasSort"))+'</h3><p>'+esc(t("areasSortHint"))+'</p>'+
      '<div class="bs-liste">'+r.map(function(k, i){
        var d = bereichDaten(k);
        return '<div class="bs-zeile" style="--c:'+d[3]+'"><span class="at-ico">'+svgIcon(HOME_ICON[k])+'</span><b>'+esc(d[1])+'</b>'+
          '<button type="button" class="bs-pfeil" data-hoch="'+i+'"'+(i === 0 ? ' disabled' : '')+' aria-label="'+esc(t("moveUp"))+'">&#8593;</button>'+
          '<button type="button" class="bs-pfeil" data-runter="'+i+'"'+(i === r.length-1 ? ' disabled' : '')+' aria-label="'+esc(t("moveDown"))+'">&#8595;</button></div>';
      }).join("")+'</div>'+
      '<div class="btn-row"><button class="btn btn-secondary" data-cancel>'+t("cancel")+'</button>'+
      '<button class="btn btn-primary" data-ok>'+ICON_SAVE+' '+t("save")+'</button></div>'+
      '</div></div>';
    function tausch(i, j){ var x = r[i]; r[i] = r[j]; r[j] = x; zeichnen(); }
    root.querySelectorAll("[data-hoch]").forEach(function(b){ b.addEventListener("click", function(){ var i = +b.getAttribute("data-hoch"); if(i > 0) tausch(i, i-1); }); });
    root.querySelectorAll("[data-runter]").forEach(function(b){ b.addEventListener("click", function(){ var i = +b.getAttribute("data-runter"); if(i < r.length-1) tausch(i, i+1); }); });
    root.querySelector("[data-cancel]").addEventListener("click", schliessen);
    root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) schliessen(); });
    root.querySelector("[data-ok]").addEventListener("click", function(){
      state.db.settings.bereiche = r.slice(); save(); schliessen();
      if((parseHash()[0] || "home") === "home") renderHome();
    });
  }
  function schliessen(){ root.innerHTML = ""; }
  zeichnen();
}
/* „Überrasch mich“ als große Karte - steht auf der Startseite und in allen Bibliotheks-Reitern */
function surpriseCardHTML(){
  return '<button type="button" class="surprise-card" data-surprise>'+
      '<span class="sc-ico">'+svgIcon(ICON_SPARK)+'</span>'+
      '<span class="sc-txt"><b>'+t("surprise")+'</b><small>'+esc(t("spSub"))+'</small></span>'+
      '<span class="sc-chev">'+ICON_CHEV+'</span>'+
    '</button>';
}
/* Startseite: Favoriten als Kacheln, „Überrasch mich“, darunter die zwei Bereiche Timer und Bibliothek */
function renderHome(){
  var favHTML = favItemsHTML();
  var nFav = favEntries().length;
  app.innerHTML =
    topbar("BLOC", { home:true, sub:"Modular Training Builder", right:
      '<button class="iconbtn" data-nav="#settings" title="'+t("settings")+'">'+ICON_SETTINGS+'</button>'
    }) +
    installTipHTML() + backupTipHTML() + wocheHTML() +
    '<div class="sec-head"><div class="section-title">'+t("favorites")+'</div>'+
      (nFav > FAV_LIMIT ? '<button type="button" class="sec-link" data-favall>'+(favShowAll ? t("favLess") : t("favAllShort"))+
        '<span class="sec-link-chev'+(favShowAll?' up':'')+'">'+ICON_CHEV+'</span></button>' : '')+
    '</div>'+
    (favHTML || '<div class="fav-empty">'+t("favEmpty")+'</div>') +
    /* Bereiche: Workouts zuerst und hervorgehoben, die übrigen drei als ruhige Liste („Überrasch mich“ gehört zu den Workouts) */
    '<div class="section-title">'+t("areas")+' <span class="lbl-hint bs-hinweis">'+esc(t("areasHint"))+'</span></div>'+
    bereicheHTML() +
    KODAK_BADGE;
  bindCommon();
  app.querySelectorAll("[data-bereich]").forEach(function(el){ langDruck(el, openBereicheSheet); });
  var sp = app.querySelector("[data-surprise]");
  if(sp) sp.addEventListener("click", openSurprise);
  bindFavItems(renderHome);
  bindBackupTip();
}

function timersSubText(){
  var w = state.db.workouts.length, b = state.db.blocks.length;
  return (w===1 ? t("oneTimerWo") : t("nTimerWo", { n:w }))+" · "+(b===1 ? t("oneBlock") : t("nBlocks", { n:b }));
}
/* Plus-Knopf mit Auswahlmenü (Startseite) bzw. als einfacher Knopf (eine Option) */
function fabMenuHTML(opts){
  if(opts.length === 1){
    return '<button class="fab" data-fabopt="'+opts[0].key+'" title="'+esc(opts[0].label)+'" aria-label="'+esc(opts[0].label)+'">'+ICON_PLUS+'</button>';
  }
  return '<div class="fab-backdrop hidden" data-fabclose></div>' +
    '<div class="fab-menu hidden" id="fab-menu">'+opts.map(function(o){
      return '<button type="button" class="fab-opt" data-fabopt="'+o.key+'">'+esc(o.label)+'<span class="ico '+o.cls+'">'+o.ico+'</span></button>';
    }).join("")+'</div>'+
    '<button class="fab" data-fab title="'+t("create")+'" aria-label="'+t("create")+'" aria-expanded="false">'+ICON_PLUS+'</button>';
}
function bindFabMenu(actions){
  var fab = app.querySelector("[data-fab]"), menu = app.querySelector("#fab-menu"), bd = app.querySelector("[data-fabclose]");
  function set(open){
    if(!fab) return;
    fab.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    menu.classList.toggle("hidden", !open);
    bd.classList.toggle("hidden", !open);
  }
  if(fab) fab.addEventListener("click", function(){ set(menu.classList.contains("hidden")); });
  if(bd) bd.addEventListener("click", function(){ set(false); });
  app.querySelectorAll("[data-fabopt]").forEach(function(b){
    b.addEventListener("click", function(){ set(false); var fn = actions[b.getAttribute("data-fabopt")]; if(fn) fn(); });
  });
}

/* ============ Timer: Timer-Workouts und Blöcke ============
   Beides sind Intervall-Timer mit fest gespeicherten Zeiten - deshalb eine gemeinsame Seite
   mit zwei Reitern. Mit ☆ landet ein Eintrag auf der Startseite. */
/* Neue Timer-Workouts und Blöcke sind erst ein Entwurf - gespeichert wird nur mit „Speichern“ */
var neuEntwurf = null;   // { liste:"workouts"|"blocks", obj }
function entwurf(liste, id){ return neuEntwurf && neuEntwurf.liste === liste && neuEntwurf.obj.id === id ? neuEntwurf.obj : null; }
function entwurfSichern(liste, obj){
  if(entwurf(liste, obj.id)){
    (neuEntwurf.bloecke || []).forEach(function(b){   // nur Blöcke, die im Workout noch vorkommen
      if(obj.items && obj.items.some(function(it){ return it.blockId === b.id; })) state.db.blocks.push(b);
    });
    state.db[liste].push(obj); neuEntwurf = null;
  }
  save();
}
function createTimerWorkout(){
  var w = { id:uid(), name:t("newWorkout"), items:[], updatedAt:Date.now() };
  neuEntwurf = { liste:"workouts", obj:w, bloecke:[] };
  return w;
}
/* Timer-Workout per „Überrasch mich“ füllen: jede Übung wird ein Block (vorhandene gleiche Blöcke
   werden wiederverwendet) und hinten angehängt, mit der Blockpause der gewählten Intensität */
function blockAusItem(it){
  var ex = findExercise(it.ex);
  if(!ex) return null;
  for(var i=0;i<state.db.blocks.length;i++){
    var b = state.db.blocks[i];
    if(b.ex===ex.id && b.reps===it.reps && b.workSec===it.work && b.restSec===it.rest) return b;
  }
  var nb = { id:uid(), ex:ex.id, name:tplText(ex.name), reps:it.reps, workSec:it.work, restSec:it.rest,
             sides:ex.perSide, hint:tplText(ex.hint), updatedAt:Date.now() };
  state.db.blocks.push(nb);
  return nb;
}
function timerWorkoutFuellen(w, d){
  var items = stretchLast(d.items, function(it){ return it.ex; }), n = 0;
  if(w.items.length && !w.items[w.items.length-1].restAfterSec) w.items[w.items.length-1].restAfterSec = d.blockRest;
  items.forEach(function(it){
    var b = blockAusItem(it);
    if(!b) return;
    w.items.push({ blockId:b.id, restAfterSec: it.after != null ? it.after : d.blockRest });
    n++;
  });
  w.updatedAt = Date.now();
  save();
  showToast(t("spFilled", { n:n, w:w.name || t("untitled") }));
  var y = window.scrollY; render(); window.scrollTo(0, y);
}
/* ---------- Löschen: eigene Blöcke, Timer-Workouts und eigene Workouts ----------
   Direkt in der Liste über den Mülleimer (mit Rückfrage) oder wie bisher auf der Bearbeiten-Seite. */
function unfav(k){ state.db.settings.favs = (state.db.settings.favs || []).filter(function(x){ return x !== k; }); }
function deleteBlockNow(id){
  state.db.blocks = state.db.blocks.filter(function(x){ return x.id!==id; });
  unfav("bl:"+id);
  state.db.workouts.forEach(function(w){ w.items = w.items.filter(function(it){ return it.blockId!==id; }); });
  save();
}
function deleteTimerWorkoutNow(id){
  state.db.workouts = state.db.workouts.filter(function(x){ return x.id!==id; });
  unfav("tw:"+id);
  save();
}
function deleteMyNow(id){
  state.db.myWorkouts = (state.db.myWorkouts || []).filter(function(x){ return x.id!==id; });
  unfav("my:"+id);
  save();
}
function deleteCustomExNow(id){
  state.db.customEx = (state.db.customEx || []).filter(function(x){ return x.id !== id; });
  (state.db.myWorkouts || []).forEach(function(mw){
    if(Array.isArray(mw.items)) mw.items = mw.items.filter(function(it){ return (it && it.ex || it) !== id; });
  });
  state.db.settings.exFavs = (state.db.settings.exFavs || []).filter(function(x){ return x !== id; });
  save(); syncCustomEx();
}
function trashBtn(kind, id, name){
  var label = t("del")+": "+(name || t("untitled"));
  return '<button type="button" class="trash-btn" data-del="'+kind+':'+id+'" title="'+esc(t("del"))+'" aria-label="'+esc(label)+'">'+ICON_TRASH+'</button>';
}
/* Mülleimer in einer Liste: fragt nach, löscht und zeichnet die Liste neu */
function bindTrash(refresh){
  app.querySelectorAll("[data-del]").forEach(function(el){
    el.addEventListener("click", function(e){
      e.stopPropagation();
      var v = el.getAttribute("data-del"), kind = v.split(":")[0], id = v.slice(kind.length+1);
      if(kind === "bl"){
        var b = findBlock(id); if(!b) return;
        confirmSheet(t("deleteBlockQ"), t("deleteBlockText", { name:b.name }), t("del"), function(){ deleteBlockNow(id); refresh(); showToast(t("deletedToast", { n:b.name })); });
      } else if(kind === "tw"){
        var w = findWorkout(id); if(!w) return;
        confirmSheet(t("deleteWorkoutQ"), "„"+(w.name || t("untitled"))+"“ – "+t("cantUndo"), t("del"), function(){ deleteTimerWorkoutNow(id); refresh(); showToast(t("deletedToast", { n:w.name || t("untitled") })); });
      } else if(kind === "ex"){
        var c = findCustom(id); if(!c) return;
        confirmSheet(t("exDeleteQ"), "„"+c.name+"“ – "+t("exDeleteText"), t("del"), function(){ deleteCustomExNow(id); refresh(); showToast(t("deletedToast", { n:c.name })); });
      } else if(kind === "my"){
        var mw = findMy(id); if(!mw) return;
        confirmSheet(t("myDeleteQ"), "„"+mw.name+"“ – "+t("cantUndo"), t("del"), function(){ deleteMyNow(id); refresh(); showToast(t("deletedToast", { n:mw.name })); });
      }
    });
  });
}
function timerWorkoutRow(w){
  var count = w.items.length;
  return '<div class="list-item entry" data-nav="#workout/'+w.id+'">'+
    '<button class="playbtn bl" data-play="'+w.id+'" '+(count?'':'disabled style="opacity:.3"')+' title="'+t("start")+'" aria-label="'+t("start")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(w.name||t("untitled"))+'</div>'+
    '<div class="sub">'+count+' '+(count===1?t("blockOne"):t("blockMany"))+SEP+fmtDuration(workoutDuration(w))+'</div></div>'+
    '<button type="button" class="plus-btn" data-twplus="'+w.id+'" title="'+esc(t("spFill"))+'" aria-label="'+esc(t("spFill")+": "+(w.name || t("untitled")))+'">'+ICON_PLUS+'</button>'+
    favBtn("tw:"+w.id)+trashBtn("tw", w.id, w.name)+'</div>';
}
function blockRow(b){
  return '<div class="list-item entry" data-nav="#block/'+b.id+'">'+
    '<button class="playbtn bl" data-playblock="'+b.id+'" title="'+t("startBlock")+'" aria-label="'+t("startBlock")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(b.name)+'</div>'+
    '<div class="sub">'+blockSpec(b)+SEP+fmtDuration(blockDuration(b))+'</div></div>'+
    favBtn("bl:"+b.id)+trashBtn("bl", b.id, b.name)+'</div>';
}
/* Freies Training ist nur noch das Studio (2026-09-29). Timer-Workouts und Blöcke stehen unter Workouts › Meine. */
function renderTimers(){ return renderStudio(); }

/* ============ Studio ============
   Übungen an Geräten und mit freien Gewichten als Kacheln. Jede Übung hat „ihre Karte“ (#studio/<id>):
   Gewicht × Wiederholungen eintragen (vorausgefüllt), danach läuft die Pause, Verlauf, Notiz und
   Steigerung nach der doppelten Progression (Ziel zweimal hintereinander geschafft -> Gewicht hoch).
   Daten: settings.studio[id] = { kg, pause, notiz, zuletzt, log:[{ at, s:[[kg, wdh], …] }] } - nur auf dem Gerät. */
var studioQuery = "", studioPause = null;
function studioAlle(){ return state.db.settings.studio || (state.db.settings.studio = {}); }
function studioEintrag(id){ return (state.db.settings.studio || {})[id] || null; }
function studioZiel(id){ var z = STUDIO_ZIEL[id] || [3, 12, 2.5]; return { saetze:z[0], wdh:z[1], schritt:z[2] }; }
/* Fortschritt je Woche: aus [[Zeitpunkt, Wert], …] wird je Kalenderwoche (Montag) der beste Wert -
   beim Gewicht der höchste, bei Zeiten der niedrigste. Die Kurve zeigt echte Wochenabstände. */
function wochenWerte(liste, niedrigGut){
  var je = {};
  liste.forEach(function(x){
    var d = new Date(x[0]); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    var w = Math.round(d.getTime() / 6048e5);
    je[w] = w in je ? (niedrigGut ? Math.min(je[w], x[1]) : Math.max(je[w], x[1])) : x[1];
  });
  return Object.keys(je).map(Number).sort(function(a, b){ return a - b; }).map(function(w){ return { w:w, v:je[w] }; });
}
function wochenKurve(pts, cls){
  if(pts.length < 2) return "";
  var vs = pts.map(function(q){ return q.v; }), mx = Math.max.apply(null, vs), mn = Math.min.apply(null, vs), sp = mx - mn || 1;
  var w0 = pts[0].w, wb = pts[pts.length-1].w - w0 || 1;
  return '<svg class="wo-kurve '+(cls || "")+'" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="'+
    pts.map(function(q){ return ((q.w - w0)/wb*100).toFixed(1)+","+(mx === mn ? 15 : 26 - (q.v - mn)/sp*22).toFixed(1); }).join(" ")+'"/></svg>';
}
function studioWochen(id){
  var e = studioEintrag(id);
  return wochenWerte((e && e.log || []).filter(function(l){ return l.s.length; }).map(function(l){
    return [l.at, Math.max.apply(null, l.s.map(function(x){ return x[0]; }))]; }), false).slice(-16);
}
function studioTag(ts){ var d = new Date(ts); return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate(); }
function studioNurBlock(ex){
  return !!ex && !STUDIO_NUR[ex.id] && !ex.custom && ex.equip.every(function(q){ return ["db", "kb", "gym"].indexOf(q) < 0; });
}
function studioTimer(id){
  var e = studioEintrag(id) || {}, tm = e.timer || {}, ex = findExercise(id);
  if(studioNurBlock(ex))   // Vorgabe wie in Air
    return { reps:tm.reps || ex.setReps || ex.reps, work:tm.work || ex.workSec, rest:tm.rest != null ? tm.rest : ex.restSec };
  return { reps:tm.reps || 3, work:tm.work || 40, rest:tm.rest != null ? tm.rest : (e.pause || 90) };
}
function studioRun(ex){
  var tm = studioTimer(ex.id), b = exBlock(ex);
  b.id = "st-"+ex.id; b.reps = ex.perSide ? tm.reps*2 : tm.reps; b.workSec = tm.work; b.restSec = tm.rest;
  return libQuickWorkout([b], 0, tplText(ex.name), "studio-"+ex.id);
}
function studioKg(v){ return (Math.round(v*100)/100).toLocaleString(currentLang()==="en" ? "en" : "de"); }
function studioIds(){
  var gruppen = STUDIO_GRUPPEN.map(function(g){ return { id:g.id, name:tplText(g), ids:g.ids.split(" ").filter(findExercise) }; });
  var inGruppen = {};
  gruppen.forEach(function(g){ g.ids.forEach(function(id){ inGruppen[id] = true; }); });
  function mit(eq){ return EXERCISES.filter(function(ex){ return !ex.custom && !inGruppen[ex.id] && ex.main !== "stretch" && ex.equip.some(function(e){ return eq.indexOf(e) > -1; }); }).map(function(ex){ return ex.id; }); }
  if(state.db.settings.stAir){   // Air-Übungen nur, wenn eingeschaltet (Standard: aus)
    gruppen.push({ id:"frei", name:t("stFree"), ids:mit(["db", "kb"]) });
    gruppen.push({ id:"stange", name:t("stBar"), ids:mit(["bar", "dip"]).filter(function(id){ return gruppen[gruppen.length-1].ids.indexOf(id) < 0; }) });
    var schon = {};
    gruppen.forEach(function(g){ g.ids.forEach(function(id){ schon[id] = true; }); });
    gruppen.push({ id:"air", name:t("stAirGr"), ids:EXERCISES.filter(function(ex){ return !ex.custom && !schon[ex.id] && fuerWorkout(ex); }).map(function(ex){ return ex.id; }) });
  }
  gruppen.push({ id:"eigene", name:t("stOwn"), ids:EXERCISES.filter(function(ex){ return ex.custom; }).map(function(ex){ return ex.id; }), eigene:true });
  return gruppen;
}
/* Ausrüstung einer Studio-Übung - für die Chips über den Gruppen */
function studioArt(id){
  if(/cable|pulldown|pushdown|face-pull|woodchop|crossover/.test(id)) return "kabel";
  if(/^barbell|bench-press|t-bar|hip-thrust/.test(id)) return "lh";
  var eq = (findExercise(id) || {}).equip || [];
  if(eq.indexOf("gym") < 0) return (eq.indexOf("bar") > -1 || eq.indexOf("dip") > -1) ? "stange" : "frei";
  return eq.indexOf("db") > -1 ? "frei" : "geraet";
}
var STUDIO_ARTEN = ["geraet", "kabel", "frei", "lh", "stange"];
var STUDIO_GRUPPEN_ICON = { beine:CAT_ICON.legs, brust:'<path d="M4 8c2.5-2 5.5-2 8 0 2.5-2 5.5-2 8 0v5c-2 3-5.5 4-8 1.5C9.5 17 6 16 4 13z"/>',
  ruecken:CAT_ICON.back, schulter:'<circle cx="12" cy="6" r="2.5"/><path d="M4 18c0-5 3.5-8.5 8-8.5s8 3.5 8 8.5"/>', arme:CAT_ICON.arms,
  bauch:CAT_ICON.core, lh:CAT_ICON.weight, frei:EQUIP_ICON.kb, stange:EQUIP_ICON.bar, air:HOME_ICON.lib, eigene:'<path d="M12 5v14M5 12h14"/>' };
function studioKachel(id){
  var ex = findExercise(id);
  if(!ex) return "";
  var e = studioEintrag(id), last = e && e.log && e.log.length ? e.log[e.log.length-1] : null;
  var sub = last && last.s.length ? studioKg(last.s[0][0])+" kg · "+last.s.length+" × "+last.s[0][1] : t("stNoData");
  if(studioNurBlock(ex)){ var tb = studioTimer(id); sub = tb.reps+" × "+tb.work+" s"; last = null; }
  return '<div class="fig-karte st-kachel" role="button" tabindex="0" data-studio="'+id+'" data-q="'+esc(exSearchText(ex))+'" style="--cat:'+studioFarbe(ex)+'">'+
    '<span class="fig-bild">'+(ILLU[id] ? illuHTML(id, "fig-illu") : '<span class="st-ohne">'+svgIcon(EQUIP_ICON.gym || EQUIP_ICON.db)+'</span>')+exFavBtn(id)+'</span>'+
    '<span class="fig-name">'+esc(tplText(ex.name))+'</span><span class="st-sub'+(last ? ' an' : '')+'">'+esc(sub)+'</span>'+
    (last ? wochenKurve(studioWochen(id), "st-spark") : '')+'</div>';
}
function renderStudio(){
  var s = state.db.settings, alle = studioAlle();
  // Filter: Gruppen-Kacheln (mehrere möglich) und Ausrüstung (mehrere möglich)
  var fGr = selArr(s.stGruppen), fArt = selArr(s.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1; });
  function artOk(id){ return !fArt.length || fArt.indexOf(studioArt(id)) > -1; }
  var zuletzt = Object.keys(alle).filter(function(id){ return alle[id].zuletzt && findExercise(id); })
    .sort(function(a, b){ return alle[b].zuletzt - alle[a].zuletzt; }).slice(0, 6);
  var gruppen = studioIds(), imStudio = {};
  gruppen.forEach(function(g){ g.ids.forEach(function(id){ imStudio[id] = true; }); });
  var inGewaehlt = {};
  gruppen.forEach(function(g){ if(!fGr.length || fGr.indexOf(g.id) > -1) g.ids.forEach(function(id){ inGewaehlt[id] = true; }); });
  function passt(id){ return inGewaehlt[id] && artOk(id); }
  var favs = (s.exFavs || []).filter(function(id){
    if(imStudio[id]) return passt(id);
    var ex = findExercise(id); return !!ex && fuerWorkout(ex) && artOk(id);   // Air-Übung mit ★
  });
  zuletzt = zuletzt.filter(function(id){ return favs.indexOf(id) < 0 && passt(id); });
  var filterAn = fGr.length || fArt.length;
  var kacheln = '<details class="opt-mehr st-filter" data-stfilter'+(s.stFilterZu ? '' : ' open')+'><summary>'+
    '<span class="om-ico">'+svgIcon(CAT_ICON.weight)+'</span><span class="meta"><span class="name">'+esc(t("stFilter"))+'</span>'+
    (filterAn ? '<span class="sub">'+(fGr.length + fArt.length)+' aktiv</span>' : '')+'</span><span class="om-pfeil" aria-hidden="true">▾</span></summary><div class="st-filter-inhalt">'+
    '<div class="toggle-row"><div><div class="label">'+esc(t("stAir"))+'</div><div class="desc">'+esc(t("stAirDesc"))+'</div></div>'+
    '<label class="switch"><input type="checkbox" id="st-air" '+(s.stAir ? "checked" : "")+'><span class="track"></span><span class="thumb"></span></label></div>'+
    '<div class="main-tiles st-bereiche">'+gruppen.filter(function(g){ return g.ids.length; }).map(function(g){
    var on = fGr.indexOf(g.id) > -1, n = g.ids.filter(artOk).length;
    return '<button type="button" class="main-tile'+(on ? ' on' : '')+(fGr.length && !on ? ' off' : '')+'" data-stgr="'+g.id+'" aria-pressed="'+on+'" style="--mc:var(--bl-color)">'+
      '<span class="mt-ico">'+svgIcon(STUDIO_GRUPPEN_ICON[g.id] || CAT_ICON.weight)+'</span><span class="mt-name">'+esc(g.name)+'</span><span class="mt-n">'+n+'</span></button>';
  }).join("")+'</div>'+
  '<div class="fc-chips st-arten">'+STUDIO_ARTEN.map(function(a){
    var on = fArt.indexOf(a) > -1;
    return '<button type="button" class="fc-chip'+(on ? ' on' : '')+'" data-start="'+a+'" aria-pressed="'+on+'">'+esc(t("stArt_"+a))+'</button>';
  }).join("")+(filterAn ? '<button type="button" class="tpl-hide" data-streset>'+t("filterReset")+'</button>' : '')+'</div></div></details>';
  var html = '<div class="st-gruppe"><div class="section-title">'+esc(t("stFavs"))+'</div>'+
      (favs.length ? '<div class="fig-grid">'+favs.map(studioKachel).join("")+'</div>' : '<div class="fav-empty">'+esc(t("stFavHint"))+'</div>')+'</div>'+
    (zuletzt.length ? '<div class="st-gruppe"><div class="section-title">'+esc(t("stRecent"))+'</div><div class="fig-grid">'+zuletzt.map(studioKachel).join("")+'</div></div>' : '');
  gruppen.forEach(function(g){
    if(!g.ids.length && !g.eigene) return;
    if(fGr.length && fGr.indexOf(g.id) < 0) return;
    var ids = g.ids.filter(artOk);
    if(!ids.length && (!g.eigene || filterAn)) return;
    html += '<div class="st-gruppe"><div class="section-title">'+esc(g.name)+' <span class="lbl-hint">'+ids.length+'</span></div><div class="fig-grid">'+
      ids.map(studioKachel).join("")+
      (g.eigene ? '<button type="button" class="fig-karte st-neu" data-stnew>'+ICON_PLUS+'<span class="fig-name">'+esc(t("stOwnNew"))+'</span></button>' : '')+
    '</div></div>';
  });
  app.innerHTML =
    topbar(t("timers"), { back:"#home" }) +
    '<div class="page-hint">'+esc(t("studioHint"))+'</div>'+
    searchHTML(studioQuery, "st", t("stSearch"))+
    kacheln +
    html +
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("stNone"))+'</div>'+
    '<div style="height:40px"></div>';
  bindCommon();
  app.querySelectorAll("[data-studio]").forEach(function(b){
    function oeffnen(){ go("#studio/"+b.getAttribute("data-studio")); }
    b.addEventListener("click", oeffnen);
    b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); oeffnen(); } });
  });
  app.querySelectorAll("[data-exfav]").forEach(function(b){ b.addEventListener("click", function(e){
    e.stopPropagation(); toggleExFav(b.getAttribute("data-exfav"));
    var y = window.scrollY; renderStudio(); window.scrollTo(0, y);
  }); });
  function neuZeichnen(){ var y = window.scrollY; renderStudio(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-stgr]").forEach(function(b){ b.addEventListener("click", function(){ s.stGruppen = selToggle(fGr, b.getAttribute("data-stgr")); save(); neuZeichnen(); }); });
  app.querySelectorAll("[data-start]").forEach(function(b){ b.addEventListener("click", function(){ s.stArten = selToggle(fArt, b.getAttribute("data-start")); save(); neuZeichnen(); }); });
  var fk = app.querySelector("[data-stfilter]");
  fk.addEventListener("toggle", function(){ if(!!s.stFilterZu === !fk.open) return; s.stFilterZu = !fk.open; save(); });   // „toggle“ kommt auch beim Zeichnen
  app.querySelector("#st-air").addEventListener("change", function(e){
    s.stAir = e.target.checked;
    if(!s.stAir) s.stGruppen = selArr(s.stGruppen).filter(function(g){ return ["frei", "stange", "air"].indexOf(g) < 0; });
    save(); neuZeichnen();
  });
  var zur = app.querySelector("[data-streset]");
  if(zur) zur.addEventListener("click", function(){ s.stGruppen = []; s.stArten = []; save(); neuZeichnen(); });
  var neu = app.querySelector("[data-stnew]");
  if(neu) neu.addEventListener("click", function(){ exEditVorgabe = { equip:["gym"], cats:["weight"], reps:3, work:40, rest:60 }; go("#exedit/new"); });
  var q = app.querySelector("#st-q");
  function suchen(){
    app.querySelectorAll(".fav-empty").forEach(function(x){ x.style.display = studioQuery ? "none" : ""; });
    applySearch(app, studioQuery);
    // leere Gruppen ausblenden, „Zuletzt“ nur ohne Suche
    app.querySelectorAll(".st-gruppe").forEach(function(g){
      var sichtbar = Array.prototype.some.call(g.querySelectorAll("[data-q]"), function(k){ return k.style.display !== "none"; });
      g.style.display = sichtbar || (!studioQuery && g.querySelector("[data-stnew]")) ? "" : "none";
    });
  }
  q.addEventListener("input", function(){ studioQuery = q.value; suchen(); });
  if(studioQuery) suchen();
}

/* Vorschlag für den nächsten Satz: heute der letzte Satz, sonst Arbeitsgewicht bzw. letztes Mal */
function studioVorschlag(id){
  var e = studioEintrag(id) || {}, z = studioZiel(id), log = e.log || [], heute = studioTag(Date.now());
  var h = log.length && studioTag(log[log.length-1].at) === heute ? log[log.length-1] : null;
  if(h && h.s.length) return { kg:h.s[h.s.length-1][0], wdh:h.s[h.s.length-1][1] };
  var vor = log.length ? log[log.length-1] : null;
  return { kg: e.kg != null ? e.kg : (vor && vor.s.length ? vor.s[0][0] : 0), wdh: vor && vor.s.length ? vor.s[0][1] : z.wdh };
}
/* Doppelte Progression: in den letzten zwei Einheiten mit dem Arbeitsgewicht alle Ziel-Sätze mit Ziel-Wdh. */
function studioSteigern(id){
  var e = studioEintrag(id), z = studioZiel(id);
  if(!e || !e.log || e.log.length < 2) return null;
  var kg = e.kg != null ? e.kg : e.log[e.log.length-1].s[0][0];
  if(!(kg > 0)) return null;
  var zwei = e.log.slice(-2);
  var ok = zwei.every(function(l){
    var gute = l.s.filter(function(x){ return x[0] >= kg && x[1] >= z.wdh; });
    return gute.length >= z.saetze;
  });
  if(!ok || (e.erhoeht && e.erhoeht >= zwei[1].at)) return null;
  return { kg:Math.round((kg + z.schritt)*100)/100, ziel:z.saetze+" × "+z.wdh };
}
function studioPauseStop(){
  if(!studioPause) return;
  clearInterval(studioPause.uhr);
  schedCancel();
  studioPause = null;
}
var ICON_STATS = '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>';
/* Leiste oben in der Karte: „Statistik“, Kurzfassung, kleine Kurve - ein Tipp öffnet das Statistik-Fenster */
/* Statistik-Kachel für Studio und Summit: immer sichtbar, eigene Zeile über dem Inhalt (so überdeckt sie keine Figur).
   Ohne Kurve steht eine gestrichelte Platzhalterlinie, ein Tipp öffnet in jedem Fall das Statistik-Fenster. */
function statsLeisteHTML(attr, kurz, pts, farbe){
  var kurve = wochenKurve(pts, "ssl-kurve") ||
    '<svg class="wo-kurve ssl-kurve leer" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,15 100,15"/></svg>';
  return '<button type="button" class="st-stats-leiste" '+attr+(farbe ? ' style="--cat:'+farbe+'"' : '')+'>'+
    '<span class="ssl-ico">'+svgIcon(ICON_STATS)+'</span>'+
    '<span class="ssl-text"><b>'+esc(t("stStats"))+'</b><small>'+esc(kurz)+'</small></span>'+
    kurve+
    '<span class="ssl-chev">'+ICON_CHEV+'</span></button>';
}
function studioStatsLeiste(id){
  var e = studioEintrag(id) || {}, log = (e.log || []).filter(function(l){ return l.s.length; }), kurz = t("stStatsNone");
  if(log.length){
    var best = 0;
    log.forEach(function(l){ l.s.forEach(function(x){ if(x[0] > best) best = x[0]; }); });
    kurz = t("stStatsKurz", { kg:studioKg(best), n:log.length });
  }
  return statsLeisteHTML("data-ststats", kurz, studioWochen(id));
}
/* Diagramm je Woche. fmt formatiert die Achsenwerte (Standard: Gewicht), schritt ist der Abstand, wenn alle Werte gleich sind.
   Ohne Punkte zeichnet es nur das leere Gerüst - dann sieht man trotzdem, was hier entsteht. */
function wochenDiagramm(pts, einheit, fmt, schritt){
  fmt = fmt || studioKg; schritt = schritt || 1;
  var B = 300, H = 130, l = 34, r = 10, o = 10, u = 22, leer = !pts.length;
  var vs = pts.map(function(q){ return q.v; }), mx = leer ? 0 : Math.max.apply(null, vs), mn = leer ? 0 : Math.min.apply(null, vs);
  if(mx === mn){ mx += schritt; mn = Math.max(0, mn - schritt); }
  var w0 = leer ? 0 : pts[0].w, wb = leer ? 1 : (pts[pts.length-1].w - w0 || 1);
  function X(q){ return l + (pts.length === 1 ? .5 : (q.w - w0)/wb) * (B - l - r); }
  function Y(q){ return o + (1 - (q.v - mn)/(mx - mn)) * (H - o - u); }
  function datum(w){ return new Date(w * 6048e5 - 216e6).toLocaleDateString(currentLang(), { day:"numeric", month:"numeric" }); }
  return '<svg class="wo-diagramm'+(leer ? ' leer' : '')+'" viewBox="0 0 '+B+' '+H+'" role="img" aria-label="'+esc(t("stWeekly"))+'">'+
    '<path class="wd-gitter" d="M'+l+' '+o+'H'+(B-r)+'M'+l+' '+((o+H-u)/2)+'H'+(B-r)+'M'+l+' '+(H-u)+'H'+(B-r)+'"/>'+
    '<text class="wd-txt" x="'+(l-5)+'" y="'+(o+4)+'" text-anchor="end">'+(leer ? '–' : fmt(mx))+'</text>'+
    '<text class="wd-txt" x="'+(l-5)+'" y="'+(H-u+4)+'" text-anchor="end">'+(leer ? '–' : fmt(mn))+'</text>'+
    (leer ? '' : '<text class="wd-txt" x="'+l+'" y="'+(H-5)+'">'+datum(pts[0].w)+'</text>')+
    (pts.length > 1 ? '<text class="wd-txt" x="'+(B-r)+'" y="'+(H-5)+'" text-anchor="end">'+datum(pts[pts.length-1].w)+'</text>' : '')+
    '<text class="wd-txt" x="'+(B/2)+'" y="'+(H-5)+'" text-anchor="middle">'+esc(einheit)+'</text>'+
    (pts.length > 1 ? '<polyline class="wd-linie" points="'+pts.map(function(q){ return X(q).toFixed(1)+","+Y(q).toFixed(1); }).join(" ")+'"/>' : '')+
    pts.map(function(q){ return '<circle class="wd-punkt" cx="'+X(q).toFixed(1)+'" cy="'+Y(q).toFixed(1)+'" r="3.5"/>'; }).join("")+'</svg>';
}
/* Statistik-Fenster für Studio und Summit. o: { titel, farbe, zahlen:[[Wert, Beschriftung] …], wochen, fmt, schritt, einheit,
   suffix (hinter dem Verlauf, z. B. " kg"), seit, hatDaten, leerText, letzteTitel, letzte:[[links, rechts] …] }.
   Ohne Daten bleibt alles stehen (Zahlen als „–“, leeres Diagramm), dazu ein kurzer Hinweis. */
function openStatistik(o){
  var root = document.getElementById("overlayRoot"), wo = o.wochen || [], fmt = o.fmt || studioKg;
  var hinweis = !o.hatDaten ? o.leerText : wo.length < 2 ? t("stOneWeek") : "";
  var innen = '<div class="st-stats-zahlen">'+o.zahlen.map(function(z){
      return '<div><b>'+esc(o.hatDaten ? z[0] : "–")+'</b><span>'+esc(z[1])+'</span></div>'; }).join("")+'</div>'+
    '<div class="wo-kopf"><span>'+esc(o.verlaufTitel)+(o.seit ? SEP+esc(t("stSince", { d:o.seit })) : '')+'</span>'+
      (wo.length > 1 ? '<b>'+fmt(wo[0].v)+' → '+fmt(wo[wo.length-1].v)+(o.suffix || '')+'</b>' : '')+'</div>'+
    wochenDiagramm(wo, o.einheit, fmt, o.schritt)+
    (hinweis ? '<p class="st-stats-hinweis">'+esc(hinweis)+'</p>' : '')+
    (o.letzte && o.letzte.length ? '<div class="info-title">'+esc(o.letzteTitel)+'</div>'+o.letzte.map(function(z){
      return '<div class="st-v-zeile"><span>'+esc(z[0])+'</span><b>'+esc(z[1])+'</b></div>'; }).join("") : '');
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet st-stats" role="dialog" aria-label="'+esc(t("stStats"))+'" style="--cat:'+o.farbe+'">'+
    '<h3>'+esc(t("stStats"))+SEP+esc(o.titel)+'</h3>'+innen+
    '<button type="button" class="btn btn-secondary" data-cancel style="margin-top:14px;">'+t("close")+'</button></div></div>';
  function zu(){ root.innerHTML = ""; }
  root.querySelector("[data-cancel]").addEventListener("click", zu);
  root.querySelector(".confirm-overlay").addEventListener("click", function(ev){ if(ev.target.classList.contains("confirm-overlay")) zu(); });
}
function openStudioStats(id){
  var ex = findExercise(id), e = studioEintrag(id) || {}, log = (e.log || []).filter(function(l){ return l.s.length; });
  var saetze = 0, best = 0;
  log.forEach(function(l){ saetze += l.s.length; l.s.forEach(function(x){ if(x[0] > best) best = x[0]; }); });
  openStatistik({
    titel:tplText(ex.name), farbe:studioFarbe(ex), hatDaten:log.length > 0, leerText:t("stStatsEmpty"),
    zahlen:[[studioKg(best)+" kg", t("stBestKg")], [String(log.length), t("stSessions")], [String(saetze), t("stSetsAll")]],
    verlaufTitel:t("stWeekly"), wochen:studioWochen(id), einheit:"kg", suffix:" kg",
    seit:log.length ? new Date(log[0].at).toLocaleDateString(currentLang(), { day:"numeric", month:"numeric", year:"2-digit" }) : "",
    letzteTitel:t("stLastN"),
    letzte:log.slice(-8).reverse().map(function(l){
      return [new Date(l.at).toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" }),
              l.s.map(function(x){ return studioKg(x[0])+"×"+x[1]; }).join(" · ")];
    })
  });
}
/* Summit: dieselbe Statistik für ein Programm (Bestzeit, Läufe, Zeit je Woche) */
function openRepStats(id, name){
  var b = repBestOf(id), log = (b && b.log) || [];
  openStatistik({
    titel:name, farbe:"var(--rep-color)", hatDaten:!!b, leerText:t("repStatsEmpty"),
    zahlen:[[b ? repUhr(b.best) : "", t("repBestZeit")], [b ? String(b.n) : "", t("repLaeufe")], [b ? repUhr(b.last) : "", t("repLetzte")]],
    verlaufTitel:t("repWeekly"), wochen:repWochen(id), fmt:repUhr, schritt:1000, einheit:"min",
    seit:log.length ? new Date(log[0][0]).toLocaleDateString(currentLang(), { day:"numeric", month:"numeric", year:"2-digit" }) : "",
    letzteTitel:t("repLastRuns"),
    letzte:log.slice(-8).reverse().map(function(x){
      return [new Date(x[0]).toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" }),
              repUhr(x[1])+(b && x[1] === b.best ? " ★" : "")];
    })
  });
}
function studioTimerKarte(id, titel, hinweis){
  var tm = studioTimer(id);
  return (titel ? '<div class="section-title">'+esc(titel)+'</div>' : '')+
    '<div class="card st-timer"><p class="st-timer-hint">'+esc(hinweis)+'</p>'+
      '<label>'+esc(t("stSets"))+'</label>'+stepperHTML("stt-reps", tm.reps, 1, 20, 1)+
      '<label>'+esc(t("stWork"))+'</label>'+stepperHTML("stt-work", tm.work, 5, 600, 5)+
      '<label>'+esc(t("stRest"))+'</label>'+stepperHTML("stt-rest", tm.rest, 0, 600, 5)+
      '<button type="button" class="btn btn-primary" data-sttimer style="margin-top:14px;">'+ICON_PLAY+' '+esc(t("stTimerStart"))+'</button>'+
    '</div>';
}
function studioTimerBinden(id, eintrag){
  var stt = app.querySelector(".st-timer");
  stt.querySelector("[data-sttimer]").addEventListener("click", function(){ studioPauseStop(); go("#playst/"+id); });
  bindSteppers(stt, function(){
    eintrag().timer = { reps:clamp(parseInt(stt.querySelector("#stt-reps").value)||3, 1, 20),
                        work:clamp(parseInt(stt.querySelector("#stt-work").value)||40, 5, 600),
                        rest:clamp(parseInt(stt.querySelector("#stt-rest").value)||0, 0, 600) };
    save();
  });
}
function studioInfoHTML(id, ex){
  var info = EX_INFO[id], lang = currentLang()==="en" ? 1 : 0;
  return info ? '<div class="section-title">'+esc(t("stInfo"))+'</div><div class="card st-info">'+
      (EX_MUSCLES[id] ? '<div class="info-mus"><div><b>'+esc(musclesLabel(ex))+':</b> '+esc(musclesMain(ex))+'</div>'+
        (musclesAssist(ex) ? '<div class="info-mus-2">'+esc(t("musAssist"))+': '+esc(musclesAssist(ex))+'</div>' : '')+'</div>' : '')+
      '<div class="info-title">'+t("howTo")+'</div><ol class="info-steps">'+info[lang].split("|").map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ol>'+
      (EX_POSTURE[id] ? '<div class="info-title">'+t("posture")+'</div><ul class="info-posture">'+EX_POSTURE[id][lang*2].split("|").map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul>'+
        '<div class="info-avoid"><b>'+t("avoid")+':</b> '+esc(EX_POSTURE[id][lang*2+1])+'</div>' : '')+
      (ILLU2[id] ? '<button type="button" class="btn btn-secondary" data-stinfo>'+esc(t("infoLong"))+'</button>' : '')+
    '</div>' : '';
}
/* Air-Übung im Studio: kein Gewicht, nur ein Block (Runden, Arbeit, Pause) zum Starten, dazu Notiz und Anleitung */
function renderStudioBlockKarte(id, ex){
  var e = studioEintrag(id) || {};
  app.innerHTML =
    topbar(tplText(ex.name), { back:"#timers", right:exFavBtn(id) }) +
    '<div class="card st-hero" style="--cat:'+studioFarbe(ex)+'">'+
      (ILLU[id] ? '<div class="st-figur">'+illuHTML(id, "st-illu")+'</div>' : '')+
    '</div>'+
    studioTimerKarte(id, t("stBlock"), t("stBlockHint"))+
    '<div class="section-title">'+esc(t("stNote"))+'</div>'+
    '<div class="card"><textarea id="st-notiz" rows="2" placeholder="'+esc(t("stNotePh"))+'">'+esc(e.notiz || "")+'</textarea></div>'+
    studioInfoHTML(id, ex)+
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a></p>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function eintrag(){ var a = studioAlle(); return a[id] || (a[id] = { log:[] }); }
  var fav = app.querySelector(".topbar [data-exfav]");
  if(fav) fav.addEventListener("click", function(){ toggleExFav(id); var y = window.scrollY; renderStudioKarte(id); window.scrollTo(0, y); });
  var inf = app.querySelector("[data-stinfo]");
  if(inf) inf.addEventListener("click", function(){ openExInfo(id, false); });
  var notiz = app.querySelector("#st-notiz");
  notiz.addEventListener("input", function(){ eintrag().notiz = notiz.value; save(); });
  studioTimerBinden(id, eintrag);
}
function renderStudioKarte(id){
  var ex = findExercise(id);
  if(!ex){ go("#timers"); return; }
  if(studioNurBlock(ex)) return renderStudioBlockKarte(id, ex);
  if(studioPause && studioPause.id !== id) studioPauseStop();
  var e = studioEintrag(id) || {}, z = studioZiel(id), log = e.log || [], heute = studioTag(Date.now());
  var h = log.length && studioTag(log[log.length-1].at) === heute ? log[log.length-1] : null;
  var v = studioVorschlag(id), stg = studioSteigern(id), pause = e.pause || 90;
  if(e.kg != null && !h) v.kg = e.kg;
  var info = EX_INFO[id], lang = currentLang()==="en" ? 1 : 0;
  var verlauf = log.slice(-8).reverse().map(function(l){
    var d = new Date(l.at);
    return '<div class="st-v-zeile"><span>'+d.toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" })+'</span>'+
      '<b>'+l.s.map(function(x){ return studioKg(x[0])+"×"+x[1]; }).join(" · ")+'</b></div>';
  }).join("");
  // Kurve: bestes Gewicht je Woche
  var wo = studioWochen(id), kurve = "";
  if(wo.length > 1) kurve = '<div class="wo-kopf"><span>'+esc(t("stWeekly"))+SEP+esc(t("weeksN", { n:wo[wo.length-1].w - wo[0].w + 1 }))+'</span>'+
    '<b>'+studioKg(wo[0].v)+' → '+studioKg(wo[wo.length-1].v)+' kg</b></div>'+wochenKurve(wo, "st-kurve");
  app.innerHTML =
    topbar(tplText(ex.name), { back:"#timers", right:exFavBtn(id) }) +
    '<div class="card st-hero" style="--cat:'+studioFarbe(ex)+'">'+
      studioStatsLeiste(id)+
      (ILLU[id] ? '<div class="st-figur">'+illuHTML(id, "st-illu")+'</div>' : '')+
      '<div class="st-ziel">'+esc(t("stGoal"))+' '+z.saetze+' × '+z.wdh+
        (e.kg != null ? SEP+esc(t("stWeight"))+' '+studioKg(e.kg)+' kg' : '')+'</div>'+
      (stg ? '<div class="st-steigern"><span>'+esc(t("stSuggest", { z:stg.ziel, kg:studioKg(stg.kg) }))+'</span>'+
        '<button type="button" class="btn btn-primary" data-stup>'+esc(t("stSuggestYes"))+'</button></div>' : '')+
      '<div class="st-heute"><b>'+esc(t("stToday"))+':</b> '+(h && h.s.length ? h.s.map(function(x, i){
        return '<span class="st-satz">'+(i+1)+'. '+studioKg(x[0])+' × '+x[1]+'</span>'; }).join("") : '<span class="st-leer">–</span>')+'</div>'+
      '<div class="st-eingabe">'+
        '<div class="st-feld"><label>'+esc(t("stKg"))+'</label><div class="stepper st-step" data-min="0" data-max="500" data-step="'+z.schritt+'">'+
          '<button type="button" data-kgminus>&minus;</button><input type="text" inputmode="decimal" id="st-kg" value="'+studioKg(v.kg)+'"><button type="button" data-kgplus>&plus;</button></div></div>'+
        '<div class="st-feld"><label>'+esc(t("stReps"))+'</label><div class="stepper st-step">'+
          '<button type="button" data-wminus>&minus;</button><input type="number" inputmode="numeric" id="st-w" value="'+v.wdh+'"><button type="button" data-wplus>&plus;</button></div></div>'+
      '</div>'+
      '<button type="button" class="btn btn-primary st-los" data-stset>✓ '+esc(t("stSetDone"))+' '+((h ? h.s.length : 0)+1)+'</button>'+
      '<div class="st-pause" id="st-pause"'+(studioPause && studioPause.id === id ? '' : ' hidden')+'>'+
        '<span>'+esc(t("stPause"))+'</span><b id="st-pause-zeit"></b><button type="button" class="btn btn-secondary" data-stskip>'+esc(t("stSkip"))+'</button></div>'+
      '<div class="st-pausewahl">'+esc(t("stPause"))+': '+[60, 90, 120, 180].map(function(sec){
        return '<button type="button" class="fc-chip'+(pause === sec ? ' on' : '')+'" data-stpause="'+sec+'">'+(sec < 120 ? sec+" s" : (sec/60)+" min")+'</button>'; }).join("")+'</div>'+
      (h && h.s.length ? '<button type="button" class="st-undo" data-stundo>'+esc(t("stUndo"))+'</button>' : '')+
    '</div>'+
    '<div class="section-title">'+esc(t("stNote"))+'</div>'+
    '<div class="card"><textarea id="st-notiz" rows="2" placeholder="'+esc(t("stNotePh"))+'">'+esc(e.notiz || "")+'</textarea></div>'+
    '<details class="opt-mehr st-timer-auf"'+(state.db.settings.stTimerAuf ? ' open' : '')+'><summary>'+
      '<span class="om-ico">'+ICON_PLAY+'</span><span class="meta"><span class="name">'+esc(t("stTimer"))+'</span>'+
      '<span class="sub">'+studioTimer(id).reps+' × '+studioTimer(id).work+' s · '+esc(t("stRestKurz"))+' '+studioTimer(id).rest+' s</span></span>'+
      '<span class="om-pfeil" aria-hidden="true">▾</span></summary>'+studioTimerKarte(id, "", t("stTimerHint"))+'</details>'+
    studioInfoHTML(id, ex)+
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a></p>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderStudioKarte(id); window.scrollTo(0, y); }
  function eintrag(){ var a = studioAlle(); return a[id] || (a[id] = { log:[] }); }
  var kgIn = app.querySelector("#st-kg"), wIn = app.querySelector("#st-w");
  function kgWert(){ var x = parseFloat(String(kgIn.value).replace(",", ".")); return isFinite(x) && x >= 0 ? Math.min(500, x) : 0; }
  function an(sel, fn){ var el = app.querySelector(sel); if(el) el.addEventListener("click", fn); }
  an("[data-kgminus]", function(){ kgIn.value = studioKg(Math.max(0, kgWert() - z.schritt)); });
  an("[data-kgplus]", function(){ kgIn.value = studioKg(kgWert() + z.schritt); });
  an("[data-wminus]", function(){ wIn.value = Math.max(1, (parseInt(wIn.value) || 0) - 1); });
  an("[data-wplus]", function(){ wIn.value = Math.min(100, (parseInt(wIn.value) || 0) + 1); });
  kgIn.addEventListener("focus", function(){ kgIn.select(); });
  wIn.addEventListener("focus", function(){ wIn.select(); });
  an("[data-stset]", function(){
    var en = eintrag(), jetzt = Date.now(), kg = kgWert(), w = Math.max(1, Math.min(100, parseInt(wIn.value) || 1));
    var l = en.log.length && studioTag(en.log[en.log.length-1].at) === studioTag(jetzt) ? en.log[en.log.length-1] : null;
    if(!l){ l = { at:jetzt, s:[] }; en.log.push(l); if(en.log.length > 60) en.log = en.log.slice(-60); }
    l.s.push([kg, w]);
    en.kg = kg; en.zuletzt = jetzt;
    studioVerlauf(id, jetzt);
    save();
    vibrate([30]);
    studioPauseStart(id, pause);
    neu();
  });
  an("[data-stundo]", function(){
    var en = eintrag(), l = en.log[en.log.length-1];
    if(l && studioTag(l.at) === heute){ l.s.pop(); if(!l.s.length) en.log.pop(); }
    studioPauseStop(); save(); neu();
  });
  an("[data-stup]", function(){ var en = eintrag(); en.kg = stg.kg; en.erhoeht = Date.now(); save(); showToast(t("stRaised", { kg:studioKg(stg.kg) })); neu(); });
  an("[data-stskip]", function(){ studioPauseStop(); neu(); });
  an("[data-stinfo]", function(){ openExInfo(id, false); });
  an("[data-ststats]", function(){ openStudioStats(id); });
  an(".topbar [data-exfav]", function(){ toggleExFav(id); neu(); });
  studioTimerBinden(id, eintrag);
  var auf = app.querySelector(".st-timer-auf");
  auf.addEventListener("toggle", function(){ if(!!state.db.settings.stTimerAuf === auf.open) return; state.db.settings.stTimerAuf = auf.open; save(); });
  auf.querySelector(".st-timer").addEventListener("click", function(){   // Kopfzeile nachführen
    var tm = studioTimer(id); auf.querySelector("summary .sub").textContent = tm.reps+" × "+tm.work+" s · "+t("stRestKurz")+" "+tm.rest+" s";
  });
  app.querySelectorAll("[data-stpause]").forEach(function(b){ b.addEventListener("click", function(){ eintrag().pause = +b.getAttribute("data-stpause"); save(); neu(); }); });
  var notiz = app.querySelector("#st-notiz");
  notiz.addEventListener("input", function(){ eintrag().notiz = notiz.value; save(); });
  studioPauseZeigen();
  window.scrollTo(0, 0);   // Karte öffnet oben bei der Eingabe (neu() stellt beim Nachzeichnen die Position wieder her)
}
/* Pause nach einem Satz: Countdown auf der Karte, Signalton über den Audio-Takt (klingt auch bei aus-
   geschaltetem Bildschirm), Countdown-Töne 3-2-1 wie im Timer */
function studioPauseStart(id, sek){
  studioPauseStop();
  var ende = Date.now() + sek*1000;
  studioPause = { id:id, ende:ende, uhr:setInterval(studioPauseZeigen, 250) };
  if(state.db.settings.sound && audioCtx()){
    for(var k=3; k>=1; k--) schedNotes(tickNotes(), ende - k*1000);
    schedNotes(currentSoundStyle().work, ende);
  }
}
function studioPauseZeigen(){
  var box = document.getElementById("st-pause"), zeit = document.getElementById("st-pause-zeit");
  if(!studioPause){ if(box) box.hidden = true; return; }
  var rest = studioPause.ende - Date.now();
  if(rest <= 0){
    clearInterval(studioPause.uhr);
    studioPause = null;
    vibrate([60, 80, 60]);
    if(box){ box.hidden = false; box.classList.add("vorbei"); if(zeit) zeit.textContent = t("stPauseEnd"); }
    return;
  }
  if(box){ box.hidden = false; box.classList.remove("vorbei"); }
  if(zeit) zeit.textContent = fmtTime(Math.ceil(rest/1000));
}
/* Studio zählt für die Wochenzeile: ein Eintrag je Tag, die Dauer vom ersten bis zum letzten Satz */
function studioVerlauf(id, jetzt){
  pruneHistory(state.db);
  var hs = state.db.history, tag = studioTag(jetzt), e = null;
  for(var i=hs.length-1; i>=0; i--) if(hs[i].studio && studioTag(hs[i].studio) === tag){ e = hs[i]; break; }
  if(!e){ e = { at:jetzt, ex:[], dur:0, studio:jetzt }; hs.push(e); }
  if(e.ex.indexOf(id) < 0) e.ex.push(id);
  e.dur = Math.round((jetzt - e.studio)/1000) + 60;
}

/* Play- und Stern-Knöpfe in Listen (Startseite, Timer-Seite) */
function bindFavItems(refresh){
  app.querySelectorAll("[data-favstart]").forEach(function(el){
    function los(){ if(el.getAttribute("aria-disabled")) return; go(el.getAttribute("data-favstart")); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); los(); } });
  });
  var more = app.querySelector("[data-favall]");
  if(more) more.addEventListener("click", function(){ favShowAll = !favShowAll; var y = window.scrollY; refresh(); window.scrollTo(0, y); });
  app.querySelectorAll("[data-favgo]").forEach(function(el){
    el.addEventListener("click", function(e){
      e.stopPropagation();
      coverDraft = null;
      go("#cover/"+el.getAttribute("data-favgo"));
    });
  });
  app.querySelectorAll("[data-fav]").forEach(function(el){
    el.addEventListener("click", function(e){ e.stopPropagation(); toggleFav(el.getAttribute("data-fav")); refresh(); });
  });
  app.querySelectorAll("[data-play]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      if(btn.disabled) return;
      go("#play/"+btn.getAttribute("data-play"));
    });
  });
  app.querySelectorAll("[data-playblock]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      go("#playblock/"+btn.getAttribute("data-playblock"));
    });
  });
}

/* ============ Install tip (iOS / Android) ============ */
function isStandalone(){
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function isIOS(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
}
function isAndroid(){
  return /android/i.test(navigator.userAgent);
}
function installTipHTML(){
  if(isStandalone()) return "";
  if(localStorage.getItem("sporttimer-tip-hidden")==="1") return "";
  if(deferredInstallPrompt){
    return '<div class="installtip"><div><b>'+t("installTitle")+'</b><br>'+t("installText")+
      '<div style="margin-top:10px;"><button type="button" class="btn btn-primary" style="margin:0;width:auto;padding:11px 18px;font-size:14px;" data-install-now>'+ICON_DOWNLOAD+' '+t("installNow")+'</button></div></div>'+
      '<button data-hidetip>&times;</button></div>';
  }
  if(!isIOS() && !isAndroid()) return "";
  var txt = isIOS() ? t("tipIOS") : t("tipAndroid");
  return '<div class="installtip"><div>'+txt+' <a href="#install">'+t("viewGuide")+'</a></div>'+
    '<button data-hidetip>&times;</button></div>';
}
function maybeShowInstallTip(){}

/* ============ Common bindings ============ */
function bindCommon(){
  app.querySelectorAll("[data-nav]").forEach(function(el){
    el.addEventListener("click", function(ev){
      if(ev.target.closest("[data-play]") || ev.target.closest("[data-playblock]") || ev.target.closest("[data-del]") || ev.target.closest("[data-twplus]")) return;
      go(el.getAttribute("data-nav"));
    });
  });
  var backBtn = app.querySelector("[data-back]");
  if(backBtn) backBtn.addEventListener("click", function(){
    goBack(backBtn.getAttribute("data-back"));
  });
  var tip = app.querySelector("[data-hidetip]");
  if(tip) tip.addEventListener("click", function(e){
    e.stopPropagation();
    localStorage.setItem("sporttimer-tip-hidden","1");
    render();
  });
  app.querySelectorAll("[data-install-now]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      triggerInstall();
    });
  });
  app.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(ev){
      ev.preventDefault();
      go(a.getAttribute("href"));
    });
  });
}

/* ============ Block list ============ */
function createBlock(){
  var b = { id:uid(), name:t("newBlock"), reps:6, workSec:30, restSec:10, updatedAt:Date.now() };
  neuEntwurf = { liste:"blocks", obj:b };
  return b;
}
/* ============ Block edit ============ */
function renderBlockEdit(id){
  var istNeu = !!entwurf("blocks", id);
  var b = findBlock(id) || entwurf("blocks", id);
  if(!b){ goBack("#library"); return; }
  app.innerHTML =
    topbar(t("editBlock"), { back:"#library" }) +
    '<div class="card">'+
      '<label for="f-name">'+t("name")+'</label>'+
      '<input type="text" id="f-name" value="'+esc(b.name)+'" maxlength="40">'+

      '<label>'+t("reps")+'</label>'+
      stepperHTML("f-reps", b.reps, 1, 99, 1) +

      '<label>'+t("workSec")+'</label>'+
      stepperHTML("f-work", b.workSec, 1, 3600, 5) +

      '<label>'+t("restSec")+'</label>'+
      stepperHTML("f-rest", b.restSec, 0, 3600, 5) +

      '<div class="section-title" style="margin:16px 4px 0;">'+t("total")+' <span id="f-total">'+fmtDuration(blockDuration(b))+'</span></div>'+
    '</div>'+
    '<button class="btn btn-primary" data-save>'+ICON_SAVE+' '+t("save")+'</button>'+
    '<button class="btn btn-danger" data-delete>'+ICON_TRASH+' '+t("deleteBlock")+'</button>';
  bindCommon();

  function refreshTotal(){
    var reps = parseInt(app.querySelector("#f-reps").value)||1;
    var work = parseInt(app.querySelector("#f-work").value)||0;
    var rest = parseInt(app.querySelector("#f-rest").value)||0;
    app.querySelector("#f-total").textContent = fmtDuration(reps*work + Math.max(0,reps-1)*rest);
  }
  function persist(){
    b.name = app.querySelector("#f-name").value.trim() || t("untitled");
    b.reps = clamp(parseInt(app.querySelector("#f-reps").value)||1, 1, 99);
    b.workSec = clamp(parseInt(app.querySelector("#f-work").value)||1, 1, 3600);
    b.restSec = clamp(parseInt(app.querySelector("#f-rest").value)||0, 0, 3600);
    b.updatedAt = Date.now();
    if(!istNeu) save();
    refreshTotal();
  }
  bindSteppers(app, persist);
  app.querySelector("#f-name").addEventListener("input", persist);
  app.querySelector("#f-name").addEventListener("blur", persist);

  /* Nach dem Speichern/Löschen zurück dorthin, woher man kam (Startseite, Blockliste oder Workout) */
  app.querySelector("[data-save]").addEventListener("click", function(){
    persist();
    entwurfSichern("blocks", b);
    goBack("#home");
  });

  app.querySelector("[data-delete]").addEventListener("click", function(){
    if(istNeu){ neuEntwurf = null; goBack("#home"); return; }   // noch nicht gespeichert: einfach verwerfen
    confirmSheet(t("deleteBlockQ"), t("deleteBlockText", { name:b.name }), t("del"), function(){
      deleteBlockNow(id);
      goBack("#home");
    });
  });
}

function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }

function stepperHTML(name, value, min, max, step){
  return '<div class="stepper" data-min="'+min+'" data-max="'+max+'" data-step="'+step+'">'+
    '<button type="button" data-dec>&minus;</button>'+
    '<input type="number" id="'+name+'" value="'+value+'" inputmode="numeric">'+
    '<button type="button" data-inc>&plus;</button>'+
    '</div>';
}
function bindSteppers(root, onChange){
  root.querySelectorAll(".stepper").forEach(function(st){
    var input = st.querySelector("input");
    var min = parseInt(st.getAttribute("data-min")), max = parseInt(st.getAttribute("data-max")), step = parseInt(st.getAttribute("data-step"));
    st.querySelector("[data-dec]").addEventListener("click", function(){
      input.value = clamp((parseInt(input.value)||0) - step, min, max);
      onChange();
    });
    st.querySelector("[data-inc]").addEventListener("click", function(){
      input.value = clamp((parseInt(input.value)||0) + step, min, max);
      onChange();
    });
    input.addEventListener("change", function(){
      input.value = clamp(parseInt(input.value)||min, min, max);
      onChange();
    });
    input.addEventListener("focus", function(){ input.select(); });
  });
}

/* ============ Workout edit ============ */
function renderWorkoutEdit(id){
  var istNeu = !!entwurf("workouts", id);
  var w = findWorkout(id) || entwurf("workouts", id);
  function save(){ if(!istNeu) speichereDB(); }   // Entwurf: erst „Speichern“ legt ihn an
  if(!w){ goBack("#library"); return; }

  var itemsHTML = w.items.map(function(it, idx){
    var b = findBlock(it.blockId);
    var name = b ? b.name : t("deletedBlock");
    var sub = b ? (blockSpec(b)+' &middot; '+fmtDuration(blockDuration(b))) : "";
    var gap = "";
    if(idx < w.items.length-1){
      gap = '<div class="gap-row">'+t("restAfter")+' <input type="number" inputmode="numeric" data-gap="'+idx+'" value="'+(it.restAfterSec||0)+'"> '+t("sec")+'</div>';
    }
    return '<div class="wblock">'+
      '<div class="wblock-top">'+
        '<div class="meta"><div class="name">'+esc(name)+'</div><div class="sub">'+sub+'</div></div>'+
        '<div class="wblock-actions">'+
          '<button data-up="'+idx+'" '+(idx===0?'disabled':'')+'>&#8593;</button>'+
          '<button data-down="'+idx+'" '+(idx===w.items.length-1?'disabled':'')+'>&#8595;</button>'+
          '<button data-remove="'+idx+'">&times;</button>'+
        '</div>'+
      '</div>'+
      gap+
    '</div>';
  }).join("");

  var pickerHTML = state.db.blocks.map(function(b){
    return '<div class="block-pick" data-addblock="'+b.id+'">'+
      '<div class="meta"><div class="name">'+esc(b.name)+'</div><div class="sub">'+blockSpec(b)+'</div></div>'+
      '<span class="chip">+</span></div>';
  }).join("") || '<div class="empty">'+t("noBlocksAvail")+' <br><a href="#blocks" style="color:var(--accent)">'+t("createBlockFirst")+'</a></div>';

  var pickCat = state.db.settings.libPickCat || "all";
  if(pickCat === "stretch") pickCat = "all";
  var exPos = {};
  w.items.forEach(function(it, i){ var b = findBlock(it.blockId); if(b && b.ex) (exPos[b.ex] = exPos[b.ex] || []).push(i+1); });
  var libPickHTML = catChipsHTML(pickCat, "data-pickcat", ["stretch"]) +
    '<div class="fig-grid">'+EXERCISES.filter(function(ex){
      return fuerWorkout(ex) && !libHidden("ex:"+ex.id) && (pickCat==="all" || ex.cats.indexOf(pickCat) > -1);
    }).map(function(ex){
      return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:'data-addex="'+ex.id+'"', cat:catVar(ex.cats[0]), nr:exPos[ex.id] || [],
        unter:'<span class="st-sub">'+blockSpec(exBlock(ex))+'</span>' });
    }).join("")+'</div>';

  app.innerHTML =
    topbar(t("workout"), { back:"#library", right:istNeu ? '' : '<button class="iconbtn" data-play title="'+t("start")+'">'+ICON_PLAY+'</button>' }) +
    '<div class="card">'+
      '<label for="w-name">'+t("name")+'</label>'+
      '<input type="text" id="w-name" value="'+esc(w.name)+'" maxlength="40">'+
    '</div>'+
    '<div class="section-title">'+t("workoutBlocks", { n:w.items.length, d:fmtDuration(workoutDuration(w)) })+'</div>'+
    (itemsHTML || '<div class="empty">'+t("noBlocksInWorkout")+'</div>') +
    '<div class="section-title">'+t("addBlock")+'</div>'+
    pickerHTML +
    '<div class="section-title">'+t("addFromLibrary")+'</div>'+
    libPickHTML +
    '<button class="btn btn-primary" data-save>'+ICON_SAVE+' '+t("save")+'</button>'+
    '<button class="btn btn-danger" data-delete>'+ICON_TRASH+' '+t("deleteWorkout")+'</button>';

  bindCommon();

  app.querySelector("#w-name").addEventListener("input", function(){
    w.name = app.querySelector("#w-name").value.trim() || t("untitled");
    w.updatedAt = Date.now();
    save();
  });

  app.querySelectorAll("[data-pickcat]").forEach(function(el){
    el.addEventListener("click", function(){
      state.db.settings.libPickCat = el.getAttribute("data-pickcat");
      save();
      var y = window.scrollY;
      renderWorkoutEdit(id);
      window.scrollTo(0, y);
    });
  });
  kachelKlick(app, "[data-addex]", function(el){
    var ex = findExercise(el.getAttribute("data-addex"));
    if(!ex) return;
    if(exPos[ex.id]) w.items = w.items.filter(function(it){ var b = findBlock(it.blockId); return !(b && b.ex === ex.id); });   // nochmal = raus
    else w.items.push({ blockId: adoptExercise(ex, istNeu ? neuEntwurf.bloecke : null).id, restAfterSec: 30 });
    w.updatedAt = Date.now();
    save();
    var y = window.scrollY; renderWorkoutEdit(id); window.scrollTo(0, y);
  });
  app.querySelectorAll("[data-addblock]").forEach(function(el){
    el.addEventListener("click", function(){
      w.items.push({ blockId: el.getAttribute("data-addblock"), restAfterSec: 30 });
      w.updatedAt = Date.now();
      save();
      renderWorkoutEdit(id);
    });
  });
  app.querySelectorAll("[data-up]").forEach(function(el){
    el.addEventListener("click", function(){
      var i = parseInt(el.getAttribute("data-up"));
      if(i>0){ var tmp=w.items[i-1]; w.items[i-1]=w.items[i]; w.items[i]=tmp; save(); renderWorkoutEdit(id); }
    });
  });
  app.querySelectorAll("[data-down]").forEach(function(el){
    el.addEventListener("click", function(){
      var i = parseInt(el.getAttribute("data-down"));
      if(i<w.items.length-1){ var tmp=w.items[i+1]; w.items[i+1]=w.items[i]; w.items[i]=tmp; save(); renderWorkoutEdit(id); }
    });
  });
  app.querySelectorAll("[data-remove]").forEach(function(el){
    el.addEventListener("click", function(){
      var i = parseInt(el.getAttribute("data-remove"));
      w.items.splice(i,1); save(); renderWorkoutEdit(id);
    });
  });
  app.querySelectorAll("[data-gap]").forEach(function(el){
    el.addEventListener("change", function(){
      var i = parseInt(el.getAttribute("data-gap"));
      w.items[i].restAfterSec = clamp(parseInt(el.value)||0, 0, 3600);
      save();
      renderWorkoutEdit(id);
    });
  });
  var playBtn = app.querySelector("[data-play]");
  if(playBtn) playBtn.addEventListener("click", function(){
    if(!w.items.length) return;
    go("#play/"+w.id);
  });

  app.querySelector("[data-save]").addEventListener("click", function(){
    w.name = app.querySelector("#w-name").value.trim() || t("untitled");
    w.updatedAt = Date.now();
    entwurfSichern("workouts", w);
    goBack("#library");
  });

  app.querySelector("[data-delete]").addEventListener("click", function(){
    if(istNeu){ neuEntwurf = null; goBack("#library"); return; }
    confirmSheet(t("deleteWorkoutQ"), t("cantUndo"), t("del"), function(){
      deleteTimerWorkoutNow(id);
      goBack("#library");
    });
  });
}

/* Fertige Programme gehören zu Aufwärmen & Dehnen (Aufwärm- und Dehnprogramme) oder zur Workouts-Bibliothek */
function libIstWarmDehn(lw){ return !!lw && (lw.focus === "stretch" || AUFWAERM_IDS.indexOf(lw.id) > -1); }

/* ============ Favoriten ============ */
/* Schlüssel "lib:<id>" (fertiges Workout oder Dehnprogramm) bzw. "my:<id>" (eigenes Workout) */
function isFav(k){ return (state.db.settings.favs || []).indexOf(k) > -1; }
function toggleFav(k){
  var f = (state.db.settings.favs || []).slice(), i = f.indexOf(k);
  if(i > -1) f.splice(i, 1); else f.push(k);
  state.db.settings.favs = f; save();
  showToast(t(i > -1 ? "favRemoved" : "favAdded"));
}
function favBtn(k){
  var on = isFav(k);
  return '<button type="button" class="fav-btn'+(on?' on':'')+'" data-fav="'+k+'" aria-pressed="'+on+'" title="'+t("favorite")+'" aria-label="'+t("favorite")+'">'+(on?'\u2605':'\u2606')+'</button>';
}
/* Favoriten auf der Startseite als kompakte Kacheln (zwei nebeneinander).
   Reihenfolge: zuletzt gestartete zuerst (settings.favUsed), nie gestartete in der Reihenfolge
   des Markierens. Sichtbar sind höchstens FAV_LIMIT, der Rest per „Alle anzeigen“. */
var FAV_LIMIT = 4;
var favShowAll = false;
function favEntries(){
  var used = state.db.settings.favUsed || {}, out = [];
  (state.db.settings.favs || []).forEach(function(k, order){
    var kind = k.split(":")[0], id = k.slice(kind.length+1), e = null;
    if(kind==="tw"){
      var tw = findWorkout(id);
      if(tw) e = { name:tw.name || t("untitled"), sub:fmtDuration(workoutDuration(tw)), cls:"bl", go:"#play/"+id, ok:tw.items.length > 0 };
    } else if(kind==="bl"){
      var bl = findBlock(id);
      if(bl && state.db.blocks.indexOf(bl) > -1) e = { name:bl.name, sub:blockSpec(bl), cls:"bl", go:"#playblock/"+id, ok:true };
    } else if(kind==="lib"){
      var lw = findLibWorkout(id);
      if(lw) e = { name:tplText(lw.name), sub:fmtDuration(workoutDuration(libWorkoutRun(lw))), cls:libIstWarmDehn(lw) ? "ws" : "tp", cover:"lib/"+id, ok:true };
    } else if(kind==="my"){
      var mw = findMy(id);
      if(mw) e = { name:mw.name, sub:fmtDuration(workoutDuration(myRun(mw))), cls:"tp", cover:"my/"+id, ok:mw.items.length > 0 };
    }
    if(e){ e.key = k; e.used = used[k] || 0; e.order = order; out.push(e); }
  });
  out.sort(function(a, b){ return (b.used - a.used) || (a.order - b.order); });
  return out;
}
function favItemsHTML(){
  var list = favEntries();
  if(!list.length) return "";
  var shown = favShowAll ? list : list.slice(0, FAV_LIMIT);
  return '<div class="fav-grid">'+shown.map(function(e){
    return '<div class="list-item fav-tile" role="button" tabindex="0" '+(e.cover ? 'data-favgo="'+e.cover+'"' : 'data-favstart="'+e.go+'"')+
        (e.cat ? ' style="--cat:'+e.cat+'"' : '')+(e.ok ? '' : ' aria-disabled="true"')+'>'+
      '<span class="playbtn '+e.cls+' ft-play" aria-hidden="true">'+ICON_PLAY+'</span>'+
      '<span class="ft-text"><b class="ft-name">'+esc(e.name)+'</b><small class="ft-sub">'+e.sub+'</small></span>'+
      '<span class="ft-star" aria-hidden="true">'+svgIcon(ICON_STAR)+'</span>'+
    '</div>';
  }).join("")+'</div>';
}
/* merkt sich, wann ein Favorit zuletzt gestartet wurde (für die Reihenfolge auf der Startseite) */
function markFavUsed(source){
  var k = null;
  if(source.type==="workout") k = "tw:"+source.id;
  else if(source.type==="block") k = "bl:"+source.id;
  else if(source.type==="libworkout") k = "lib:"+source.id;
  else if(source.type==="mine") k = "my:"+source.id;
  else if(source.type==="draft" && coverDraft && /^(lib|my):/.test(coverDraft.key || "")) k = coverDraft.key;
  if(!k) return;
  var u = state.db.settings.favUsed || {};
  u[k] = Date.now();
  state.db.settings.favUsed = u;
}

/* ============ Bibliothek-Seite ============ */
function catChipsHTML(active, attr, ohne){
  var sel = selArr(active);
  var cats = [{ id:"all" }].concat(LIB_CATS.filter(function(c){ return !ohne || ohne.indexOf(c.id) < 0; }));
  return '<div class="lib-chips">'+cats.map(function(c){
    var label = c.id==="all" ? t("catAll") : tplText(c);
    var on = c.id==="all" ? !sel.length : sel.indexOf(c.id) > -1;
    return '<button type="button" class="lib-chip'+(on?' active':'')+'" '+attr+'="'+c.id+'" aria-pressed="'+on+'">'+catIcon(c.id)+esc(label)+'</button>';
  }).join("")+'</div>';
}
function showToast(text){
  var old = document.getElementById("toast");
  if(old) old.remove();
  var el = document.createElement("div");
  el.id = "toast"; el.className = "toast"; el.setAttribute("role","status");
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function(){ el.classList.add("weg"); }, 2600);
  setTimeout(function(){ el.remove(); }, 3000);
}
var ICON_EYE_OFF = '<path d="M3 3l18 18"/><path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c5.5 0 9 5.5 9.5 7-.3.8-1.2 2.4-2.7 3.9M6.6 6.6C4.5 8 3 10.3 2.5 12c.5 1.5 4 7 9.5 7 1.8 0 3.4-.6 4.8-1.4"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>';
var ICON_EYE = '<path d="M2.5 12c.5-1.5 4-7 9.5-7s9 5.5 9.5 7c-.5 1.5-4 7-9.5 7s-9-5.5-9.5-7z"/><circle cx="12" cy="12" r="3"/>';
var ICON_EDIT = '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>';
var ICON_FILTER = '<path d="M4 6h16M7 12h10M10 18h4"/>';
var ICON_INFO = '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>';
var ICON_COPY = '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>';
var ICON_TIMERBLOCK = '<circle cx="12" cy="14" r="7.5"/><path d="M12 14v-4M9.5 2.5h5M12 2.5v4"/>';
var ICON_DOTS = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';

/* ⋯-Menü: Nebenaktionen einer Karte als Liste mit großen Tipp-Flächen */
function openActionSheet(title, acts){
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet act-sheet" role="dialog" aria-label="'+esc(title)+'">'+
    '<h3>'+esc(title)+'</h3>'+
    acts.map(function(a, i){
      return '<button type="button" class="fs-opt act-opt'+(a.danger?' danger':'')+'" data-act="'+i+'"><span class="fs-ico">'+svgIcon(a.ico)+'</span><span>'+esc(a.label)+'</span></button>';
    }).join("")+
    '<button class="btn btn-secondary" data-actclose style="margin-top:8px;">'+t("cancel")+'</button>'+
  '</div></div>';
  function close(){ root.innerHTML = ""; }
  root.querySelectorAll("[data-act]").forEach(function(b){
    b.addEventListener("click", function(){ close(); acts[parseInt(b.getAttribute("data-act"))].fn(); });
  });
  root.querySelector("[data-actclose]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}
function moreBtn(attr, val, label){
  return '<button type="button" class="more-btn" '+attr+'="'+esc(val)+'" title="'+esc(label||t("more"))+'" aria-label="'+esc(label||t("more"))+'">'+ICON_DOTS+'</button>';
}

/* Suche + Filter-Knopf in einer Zeile; die Filter selbst liegen in einem Einblendfenster.
   Aktive Filter stehen als kurze Zeile darunter (mit „Zurücksetzen“). */
function filterCount(cat, equip){ return selArr(cat).length + selArr(equip).length; }
/* Filter-Zeile unter den Kategorie-Kacheln: Fokus, Ausrüstung, Sortierung - klappt direkt darunter auf */
function filterZeileHTML(attr, n, offen){
  return '<button type="button" class="filter-zeile'+(n || offen ? ' on' : '')+'" '+attr+' aria-expanded="'+!!offen+'">'+svgIcon(ICON_FILTER)+
    '<span class="fz-text">'+esc(t("filterMehr"))+'</span>'+(n ? '<span class="filter-n">'+n+'</span>' : '')+
    '<span class="tpl-chev'+(offen ? '' : ' zu')+'" aria-hidden="true">&#9662;</span></button>';
}
function activeFiltersHTML(cat, equip, pre){
  cat = selArr(cat); equip = selArr(equip);
  if(!cat.length && !equip.length) return "";
  var parts = [];
  if(cat.length) parts.push(t("fCat")+": "+cat.map(catName).join(", "));
  if(equip.length) parts.push(t("equipHave")+": "+equip.map(equipName).join(", "));
  return '<div class="active-filters"><span>'+esc(parts.join(" · "))+'</span>'+
    '<button type="button" class="tpl-hide" data-'+pre+'freset>'+t("filterReset")+'</button></div>';
}

function hiddenBlockHTML(n, cards){
  if(!n) return "";
  return '<div class="section-title hid-head">'+svgIcon(ICON_EYE_OFF)+t("hiddenSection", { n:n })+'</div>'+
    '<div class="hid-note">'+esc(t("hiddenSectionHint"))+'</div>'+cards;
}
/* Fertige Workouts, die Stangenübungen brauchen, erscheinen bei einem anderen Fokus nur mit passender Ausrüstung */
function woGearOk(exs, cat, equip, mains){ return exs.every(function(ex){ return gearOk(ex, cat, equip, mains); }); }

/* Schlanke Karten: links Start, in der Mitte Name + eine Infozeile (+ Muskeln klein),
   rechts Bild, ☆ und ⋯ (alle Nebenaktionen). Ausgeblendete: nur „Einblenden“. */
function woSearchText(name, exs){
  return [name].concat(exs.map(function(ex){ return ex.name.de+" "+ex.name.en+" "+(EX_SUCH_ALIAS[ex.id] || ""); })).join(" ").toLowerCase();
}
function mainTagsHTML(mains){
  return mains.map(function(m){ var c = mainCat(m); return '<span class="main-dot" title="'+esc(tplText(c))+'">'+svgIcon(c.ico)+'</span>'; }).join("");
}
function libWoCard(lw, exs, hidden, dur, mains){
  // --bereich: gesetzt auf Seiten eines anderen Bereichs (Aufwärmen & Dehnen), sonst Workouts-Grün
  return '<div class="list-item entry tpl-item lib-card'+(hidden?' is-hidden':'')+'" style="--cat:var(--bereich, var(--tp-color))" data-cover="lib/'+lw.id+'" data-q="'+esc(woSearchText(lw.name.de+" "+lw.name.en, exs))+'">'+
    '<button class="playbtn cat" data-cover="lib/'+lw.id+'" title="'+t("startTemplate")+'" aria-label="'+t("startTemplate")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(tplText(lw.name))+'</div>'+
    '<div class="sub">'+mainTagsHTML(mains)+t("exCount", { n:exs.length })+SEP+fmtDuration(dur)+'</div>'+
    '</div>'+
    '<div class="card-aside"><div class="card-acts">'+
      (hidden ? '<button type="button" class="tpl-adopt" data-unhideone="wo:'+lw.id+'">'+svgIcon(ICON_EYE)+' '+t("unhide")+'</button>'
              : favBtn("lib:"+lw.id)+moreBtn("data-womore", lw.id))+
    '</div></div></div>';
}
function libExCard(ex, hidden, sub){
  var bild = ILLU[ex.id]
    ? '<button type="button" class="illu-btn" data-info="'+ex.id+'" aria-label="'+t("info")+'">'+illuHTML(ex.id, "lib-illu")+'</button>'
    : (ex.custom ? '<button type="button" class="illu-btn" data-exedit="'+ex.id+'" aria-label="'+t("edit")+'"><span class="custom-ico">'+catIcon(ex.cats[0])+'</span></button>' : '');
  var mus = musclesMain(ex);
  return '<div class="list-item entry tpl-item lib-card'+(ex.id==="russian-twists"?' ua':'')+(isExFav(ex.id)?' ex-fav-on':'')+(hidden?' is-hidden':'')+'" style="--cat:var(--bereich, '+catVar(ex.cats[0])+')" data-q="'+esc(exSearchText(ex))+'">'+
    '<button class="playbtn cat" data-playex="'+ex.id+'" title="'+t("startBlock")+'" aria-label="'+t("startBlock")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(tplText(ex.name))+'</div>'+
    '<div class="sub">'+mainTagsHTML([ex.main])+sub+'</div>'+
    (mus ? '<div class="card-mus">'+esc(mus)+'</div>' : '')+
    '</div>'+
    '<div class="card-aside">'+bild+'<div class="card-acts">'+
      (hidden ? '<button type="button" class="tpl-adopt" data-unhideone="ex:'+ex.id+'">'+svgIcon(ICON_EYE)+' '+t("unhide")+'</button>'
              : exFavBtn(ex.id)+(ex.custom ? trashBtn("ex", ex.id, tplText(ex.name)) : '')+moreBtn("data-exmore", ex.id))+
    '</div></div></div>';
}
function exSubText(ex){
  if(ex.cats.indexOf("stretch") > -1) return stretchSubText(ex);
  return (ex.custom ? '<i>'+esc(t("customTag"))+'</i>'+SEP : '')+
    svgIcon(EQUIP_ICON[ex.equip[0]] || "", "ico sub-ico")+esc(exEquipText(ex))+SEP+
    esc(ex.cats.map(catName).join(", "));
}
function stretchSubText(ex){
  return ex.perSide
    ? (ex.setReps > 1 ? t("holdSideN", { n:ex.setReps, s:ex.workSec }) : t("holdSide", { s:ex.workSec }))
    : (ex.reps > 1 ? t("holdN", { n:ex.reps, s:ex.workSec }) : t("hold1", { s:ex.workSec }));
}

/* Kacheln der Hauptkategorien (Mehrfachauswahl, nichts gewählt = alle) */
function mainTilesHTML(sel, counts, attr, ohne){
  sel = selArr(sel);
  var kats = ohne ? MAIN_CATS.filter(function(c){ return ohne.indexOf(c.id) < 0; }) : MAIN_CATS;
  return '<div class="main-tiles"'+(ohne ? ' style="grid-template-columns:repeat('+kats.length+', minmax(0, 1fr))"' : '')+'>'+kats.map(function(c){
    var on = sel.indexOf(c.id) > -1;
    return '<button type="button" class="main-tile'+(on?' on':'')+(sel.length && !on ? ' off':'')+'" '+attr+'="'+c.id+'" aria-pressed="'+on+'">'+
      '<span class="mt-ico">'+svgIcon(c.ico)+'</span><span class="mt-name">'+esc(tplText(c))+'</span>'+
      (counts ? '<span class="mt-n">'+(counts[c.id] || 0)+'</span>' : '')+'</button>';
  }).join("")+'</div>';
}
var ICON_RESET = '<path d="M4 4v5h5"/><path d="M4.6 14a8 8 0 1 0 1.9-7.9L4 9"/>';
/* Filterfeld direkt auf der Seite (Fokus, Ausrüstung, Sortierung) - auf- und zuklappbar über den Filter-Knopf */
function filterCardHTML(pre, cat, equip, sort, sortOpts, ohneCats, ohneEquip){
  cat = selArr(cat); equip = selArr(equip);
  return '<div class="card filter-card">'+
    '<div class="fc-head"><b>'+t("filter")+'</b><button type="button" class="fc-reset" data-'+pre+'freset>'+svgIcon(ICON_RESET)+t("filterReset")+'</button></div>'+
    '<div class="fc-lbl">'+t("fCat")+' <span>'+t("multiOk")+'</span></div>'+
    '<div class="fc-chips">'+LIB_CATS.filter(function(c){ return !ohneCats || ohneCats.indexOf(c.id) < 0; }).map(function(c){
      var on = cat.indexOf(c.id) > -1;
      return '<button type="button" class="fc-chip'+(on?' on':'')+'" data-'+pre+'fcat="'+c.id+'" aria-pressed="'+on+'">'+catIcon(c.id)+esc(tplText(c))+'</button>';
    }).join("")+'</div>'+
    '<div class="fc-lbl">'+t("equipHave")+' <span>'+t("multiOk")+'</span></div>'+
    '<div class="fc-chips">'+EQUIPS.filter(function(e){ return !ohneEquip || ohneEquip.indexOf(e.id) < 0; }).map(function(e){
      var on = equip.indexOf(e.id) > -1;
      return '<button type="button" class="fc-chip'+(on?' on':'')+'" data-'+pre+'fequip="'+e.id+'" aria-pressed="'+on+'">'+svgIcon(EQUIP_ICON[e.id])+esc(tplText(e))+'</button>';
    }).join("")+'</div>'+
    (sortOpts ? '<div class="fc-lbl">'+t("sortLabel")+'</div><div class="fc-seg">'+sortOpts.map(function(o){
      return '<button type="button" class="'+(o[0]===sort?'on':'')+'" data-'+pre+'fsort="'+o[0]+'">'+o[1]+'</button>';
    }).join("")+'</div>' : '')+
  '</div>';
}
/* Fokus eines Workouts: passt, wenn der Workout-Fokus gewählt ist oder mindestens ein Drittel der Übungen passt */
function woFocusOk(focus, exs, cat, id){
  cat = selArr(cat);
  var tausch = id && LIB_FOKUS_TAUSCH[id];   // einzelne Workouts gezielt umsortiert (daten.js)
  if(tausch && cat.length){
    if(cat.indexOf(tausch.dazu) > -1) return true;
    cat = cat.filter(function(c){ return c !== tausch.weg; });
    if(!cat.length) return false;
  }
  if(!cat.length || cat.indexOf(focus) > -1) return true;
  var n = exs.filter(function(ex){ return catMatch(cat, ex.cats); }).length;
  return n > 0 && n >= exs.length/3;
}
/* Workouts automatisch nach Dauer (kürzeste zuerst) oder alphabetisch */
function libWoSort(list, sort){
  return list.sort(sort === "az"
    ? function(a, b){ return a.name.localeCompare(b.name, currentLang()); }
    : function(a, b){ return (a.dur - b.dur) || a.name.localeCompare(b.name, currentLang()); });
}

/* Bibliothek: Reiter Workouts (fertige Programme) · Übungen · Meine.
   Darunter Suche mit Filter-Knopf, die Kacheln der Hauptkategorien und - aufgeklappt - das Filterfeld. */
function renderLibrary(){
  var s = state.db.settings;
  if(s.libTab === "calis" || s.libTab === "stretch") s.libTab = "workouts";   // frühere Reiter Calisthenics und Dehnen
  var tab = ["exercises","mine"].indexOf(s.libTab) > -1 ? s.libTab : "workouts";
  /* Dehnen und Aufwärmen stehen seit 2026-09 unter „Aufwärmen & Dehnen“ - hier nicht mehr */
  function ohneStretch(x){ return x !== "stretch"; }
  var cat = selArr(s.libCats || s.libCat).filter(ohneStretch);
  var equip = selArr(s.libEquips);
  var mains = selArr(s.libMains).filter(ohneStretch);
  var exSort = s.libSort === "az" ? "az" : "std";
  var woSort = s.libWoSort === "az" ? "az" : "dur";
  var open = !!s.libFilterOpen;
  var counts = {}, hiddenCount = 0, hiddenCards = "", list = "", fab = "";
  MAIN_CATS.forEach(function(c){ counts[c.id] = 0; });

  if(tab === "workouts" || tab === "mine"){
    var rows = [];
    if(tab === "workouts"){
      LIB_WORKOUTS.forEach(function(lw){
        if(libIstWarmDehn(lw)) return;
        var exs = lw.exercises.map(findExercise).filter(Boolean);
        rows.push({ lw:lw, exs:exs, name:tplText(lw.name), focus:lw.focus, dur:workoutDuration(libWorkoutRun(lw)), hidden:libHidden("wo:"+lw.id) });
      });
    } else {
      (state.db.myWorkouts || []).map(normMy).forEach(function(mw){
        var exs = mw.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
        rows.push({ mw:mw, exs:exs, name:mw.name, focus:"", dur:workoutDuration(myRun(mw)) });
      });
    }
    // erst Fokus und Ausrüstung (bestimmt die Zahlen auf den Kacheln), dann die Kacheln selbst
    rows = rows.filter(function(r){
      r.mains = woMains(r.exs);
      if(tab === "mine") return true;   // eigene Programme: ungefiltert
      if(!woFocusOk(r.focus, r.exs, cat, r.lw && r.lw.id) || !woFits(r.exs, equip) || !woGearOk(r.exs, cat, equip, mains)) return false;
      if(!r.hidden) r.mains.forEach(function(m){ counts[m]++; });
      return !mains.length || r.mains.some(function(m){ return mains.indexOf(m) > -1; });
    });
    libWoSort(rows, woSort).forEach(function(r){
      if(r.lw){
        if(r.hidden){ hiddenCount++; hiddenCards += libWoCard(r.lw, r.exs, true, r.dur, r.mains); }
        else list += libWoCard(r.lw, r.exs, false, r.dur, r.mains);
      } else {
        var mw = r.mw;
        list += '<div class="list-item entry tpl-item lib-card my-item" data-nav="#mybuild/'+mw.id+'" data-q="'+esc(woSearchText(mw.name, r.exs))+'">'+
          '<button class="playbtn tp" data-cover="my/'+mw.id+'" '+(r.exs.length?'':'disabled style="opacity:.3"')+' title="'+t("startTemplate")+'" aria-label="'+t("startTemplate")+'">'+ICON_PLAY+'</button>'+
          '<div class="meta"><div class="name">'+esc(mw.name)+'</div>'+
          '<div class="sub">'+mainTagsHTML(r.mains)+t("exCount", { n:r.exs.length })+SEP+fmtDuration(r.dur)+'</div>'+
          '</div><div class="card-aside"><div class="card-acts">'+favBtn("my:"+mw.id)+trashBtn("my", mw.id, mw.name)+'</div></div></div>';
      }
    });
    if(tab === "mine"){
      var tws = state.db.workouts.slice().sort(function(a,b){ return (b.updatedAt||0)-(a.updatedAt||0); });
      var bls = state.db.blocks.slice().sort(function(a,b){ return (b.updatedAt||0)-(a.updatedAt||0); });
      var eigene = list;
      list = "";
      if(eigene) list += (tws.length || bls.length ? '<div class="section-title">'+t("mineMy")+'</div>' : '') + eigene;
      if(tws.length) list += '<div class="section-title">'+t("mineTimer")+'</div>'+tws.map(timerWorkoutRow).join("");
      if(bls.length) list += '<div class="section-title">'+t("mineBlocks")+'</div>'+bls.map(blockRow).join("");
      if(!list) list = '<div class="empty" style="padding:30px 20px;">'+t("myEmpty")+'</div>';
      fab = fabMenuHTML([{ key:"new", label:t("myNew"), ico:ICON_PLUS, cls:"tp" },
                         { key:"timerwo", label:t("fabTimerWo"), ico:ICON_WORKOUT, cls:"wo" },
                         { key:"block", label:t("fabBlock"), ico:ICON_BLOCK, cls:"bl" }]);
    }
  } else {
    EXERCISES.forEach(function(ex){
      if(ex.main === "stretch") return;
      if(!exPasses(ex, cat, equip, [])) return;
      if(libHidden("ex:"+ex.id)){
        if(mainMatch(mains, ex.main)){ hiddenCount++; hiddenCards += libExCard(ex, true, exSubText(ex)); }
        return;
      }
      counts[ex.main]++;
    });
    sortedExercises(cat, exSort, equip, mains).forEach(function(ex){ if(ex.main !== "stretch") list += libExCard(ex, false, exSubText(ex)); });
    fab = fabMenuHTML([{ key:"new", label:t("exNew"), ico:ICON_PLUS, cls:"tp" }]);
  }
  if(!list) list = '<div class="empty" style="padding:40px 20px;">'+t("libEmpty")+'</div>';
  list += '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+t("noResult")+'</div>';
  var nf = filterCount(cat, equip);

  app.innerHTML =
    topbar(t("library"), { back:"#home", right:'<button type="button" class="sp-top" data-surprise>'+svgIcon(ICON_SPARK)+esc(t("surprise"))+'</button>' }) +
    '<div class="card lib-tabs-card"><div class="theme-pick lib-tabs seg-3">'+
      '<button data-libtab="workouts" class="'+(tab==="workouts"?"active":"")+'">'+t("tabWorkouts")+'</button>'+
      '<button data-libtab="exercises" class="'+(tab==="exercises"?"active":"")+'">'+t("libExercises")+'</button>'+
      '<button data-libtab="mine" class="'+(tab==="mine"?"active":"")+'">'+t("tabMine")+'</button>'+
    '</div></div>'+
    (tab === "mine" ? '' :
    searchHTML(libQuery, "l", tab==="exercises" ? t("searchPh") : t("searchWoPh"))+
    mainTilesHTML(mains, counts, "data-lmain", ["stretch"])+
    filterZeileHTML("data-ltoggle", nf, open)+
    (open ? filterCardHTML("l", cat, equip, tab==="exercises" ? exSort : woSort,
              tab==="exercises" ? [["std", t("sortStd")], ["az", "A&ndash;Z"]] : [["dur", t("sortDur")], ["az", "A&ndash;Z"]], ["stretch"])
          : activeFiltersHTML(cat, equip, "l")))+
    list + hiddenBlockHTML(hiddenCount, hiddenCards) +
    '<div style="height:90px"></div>' + fab;
  bindCommon();

  function neu(){ var y = window.scrollY; renderLibrary(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  on("[data-libtab]", function(el){ s.libTab = el.getAttribute("data-libtab"); save(); renderLibrary(); window.scrollTo(0,0); });
  on("[data-ltoggle]", function(){ s.libFilterOpen = !open; save(); neu(); });
  on("[data-lmain]", function(el){ s.libMains = selToggle(mains, el.getAttribute("data-lmain")); save(); neu(); });
  on("[data-lfcat]", function(el){ s.libCats = selToggle(cat, el.getAttribute("data-lfcat")); save(); neu(); });
  on("[data-lfequip]", function(el){ s.libEquips = selToggle(equip, el.getAttribute("data-lfequip")); save(); neu(); });
  on("[data-lfsort]", function(el){ if(tab==="exercises") s.libSort = el.getAttribute("data-lfsort"); else s.libWoSort = el.getAttribute("data-lfsort"); save(); neu(); });
  on("[data-lfreset]", function(){ s.libCats = []; s.libEquips = []; s.libMains = []; save(); neu(); });
  on("[data-exfav]", function(el){ toggleExFav(el.getAttribute("data-exfav")); neu(); });
  bindTrash(neu);
  var lq = app.querySelector("#l-q");
  if(lq){
    applySearch(app, libQuery);
    lq.addEventListener("input", function(){ libQuery = lq.value; applySearch(app, libQuery); });
  }
  bindFabMenu({ "new": function(){ if(tab==="mine") go("#mybuild/new"); else go("#exedit/new"); },
                "timerwo": function(){ go("#workout/"+createTimerWorkout().id); },
                "block": function(){ go("#block/"+createBlock().id); } });
  // Timer-Workouts und Blöcke unter „Meine“: starten und per „Überrasch mich“ füllen
  on("[data-play]", function(el){ if(!el.disabled) go("#play/"+el.getAttribute("data-play")); });
  on("[data-playblock]", function(el){ go("#playblock/"+el.getAttribute("data-playblock")); });
  on("[data-twplus]", function(el){ openSurprise(el.getAttribute("data-twplus")); });

  on("[data-cover]", function(el){ if(el.disabled) return; coverDraft = null; go("#cover/"+el.getAttribute("data-cover")); });
  on("[data-playex]", function(el){ go("#playex/"+el.getAttribute("data-playex")); });
  on("[data-exedit]", function(el){ go("#exedit/"+el.getAttribute("data-exedit")); });
  on("[data-surprise]", function(){ openSurprise(); });
  on("[data-info]", function(el){ openExInfo(el.getAttribute("data-info"), false, { onChange:neu }); });
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  on("[data-unhideone]", function(el){
    var k = el.getAttribute("data-unhideone");
    s.hiddenLib = (s.hiddenLib||[]).filter(function(x){ return x !== k; });
    save(); neu();
  });
  on("[data-womore]", function(el){
    var lw = findLibWorkout(el.getAttribute("data-womore"));
    if(!lw) return;
    openActionSheet(tplText(lw.name), [
      { ico:ICON_COPY, label:t("adoptMine"), fn:function(){ adoptLibWorkout(lw); } },
      { ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("wo:"+lw.id); showToast(t("hiddenToast")); neu(); } }
    ]);
  });
  on("[data-exmore]", function(el){
    var ex = findExercise(el.getAttribute("data-exmore"));
    if(!ex) return;
    var acts = [];
    if(ex.custom) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go("#exedit/"+ex.id); } });
    if(EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false, { onChange:neu }); } });
    acts.push({ ico:ICON_TIMERBLOCK, label:t("adoptBlockTitle"), fn:function(){ adoptExercise(ex); showToast(t("adoptedBlock", { n:tplText(ex.name) })); } });
    acts.push({ ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("ex:"+ex.id); showToast(t("hiddenToast")); neu(); } });
    openActionSheet(tplText(ex.name), acts);
  });
}

/* ============ Eigene Übung anlegen / bearbeiten ============ */
var exEditVorgabe = null;   // Vorgaben für eine neue eigene Übung (z. B. aus dem Studio: Ausrüstung Fitnessstudio)
function renderExEdit(id){
  var isNew = id === "new";
  var c = isNew ? null : findCustom(id);
  if(!isNew && !c){ goBack("#library"); return; }
  // Entwurf nur im Speicher, bis „Speichern“ getippt wird
  var d = c ? JSON.parse(JSON.stringify(c)) : Object.assign({ name:"", cats:[], equip:["none"], perSide:false, reps:4, work:30, rest:15, hint:"" }, exEditVorgabe || {});
  exEditVorgabe = null;
  function draw(){
    app.innerHTML =
      topbar(t(isNew ? "exNewTitle" : "exEditTitle"), { back:"#library" }) +
      '<div class="card">'+
        '<label for="x-name">'+t("exName")+'</label>'+
        '<input type="text" id="x-name" value="'+esc(d.name)+'" maxlength="40" placeholder="'+esc(t("exName"))+'">'+
        '<label>'+t("exFocus")+' <span class="lbl-hint">'+esc(t("exFocusHint"))+'</span></label>'+
        '<div class="sp-chips">'+LIB_CATS.map(function(cc){
          return '<button type="button" class="lib-chip'+(d.cats.indexOf(cc.id)>-1?' active':'')+'" data-xcat="'+cc.id+'" aria-pressed="'+(d.cats.indexOf(cc.id)>-1)+'">'+catIcon(cc.id)+esc(tplText(cc))+'</button>';
        }).join("")+'</div>'+
        '<label>'+t("exEquip")+'</label>'+
        '<div class="sp-chips">'+EQUIPS.map(function(e){
          return '<button type="button" class="lib-chip'+(d.equip.indexOf(e.id)>-1?' active':'')+'" data-xequip="'+e.id+'" aria-pressed="'+(d.equip.indexOf(e.id)>-1)+'">'+svgIcon(EQUIP_ICON[e.id])+esc(tplText(e))+'</button>';
        }).join("")+'</div>'+
      '</div>'+
      '<div class="card">'+
        toggleRow("x-side", t("exPerSide"), t("exPerSideDesc"), d.perSide)+
        '<label>'+t("exReco")+'</label>'+
        '<div class="tm-grid"><div><label>'+t("tmReps")+'</label>'+stepperHTML("x-reps", d.reps, 1, 30, 1)+'</div>'+
        '<div><label>'+t("tmWork")+'</label>'+stepperHTML("x-work", d.work, 5, 600, 5)+'</div>'+
        '<div><label>'+t("tmRest")+'</label>'+stepperHTML("x-rest", d.rest, 0, 300, 5)+'</div></div>'+
        '<label for="x-hint">'+t("exHint")+'</label>'+
        '<input type="text" id="x-hint" value="'+esc(d.hint||"")+'" maxlength="80" placeholder="'+esc(t("exHintPh"))+'">'+
      '</div>'+
      '<button class="btn btn-primary" data-xsave>'+ICON_SAVE+' '+t("exSave")+'</button>'+
      (isNew ? '' : '<button class="btn btn-danger" data-xdel>'+ICON_TRASH+' '+t("exDelete")+'</button>')+
      '<div style="height:60px"></div>';
    bindCommon();
    var nameIn = app.querySelector("#x-name"), hintIn = app.querySelector("#x-hint");
    nameIn.addEventListener("input", function(){ d.name = nameIn.value; });
    hintIn.addEventListener("input", function(){ d.hint = hintIn.value; });
    function lesen(){
      d.reps = parseInt(app.querySelector("#x-reps").value)||1;
      d.work = parseInt(app.querySelector("#x-work").value)||5;
      d.rest = parseInt(app.querySelector("#x-rest").value)||0;
    }
    bindSteppers(app.querySelector(".tm-grid"), lesen);
    bindToggle("x-side", function(v){ d.perSide = v; });
    app.querySelectorAll("[data-xcat]").forEach(function(b){ b.addEventListener("click", function(){
      lesen(); d.cats = selToggle(d.cats, b.getAttribute("data-xcat")); var y = window.scrollY; draw(); window.scrollTo(0, y);
    }); });
    app.querySelectorAll("[data-xequip]").forEach(function(b){ b.addEventListener("click", function(){
      lesen(); d.equip = selToggle(d.equip, b.getAttribute("data-xequip")); var y = window.scrollY; draw(); window.scrollTo(0, y);
    }); });
    app.querySelector("[data-xsave]").addEventListener("click", function(){
      lesen();
      d.name = (d.name || "").trim();
      if(!d.name){ showToast(t("exNameMissing")); nameIn.focus(); return; }
      d.hint = (d.hint || "").trim();
      if(!state.db.customEx) state.db.customEx = [];
      if(isNew){ d.id = "my-"+uid(); state.db.customEx.push(d); }
      else {
        for(var i=0;i<state.db.customEx.length;i++) if(state.db.customEx[i].id===id) state.db.customEx[i] = d;
      }
      save(); syncCustomEx();
      showToast(t("exSaved"));
      goBack("#library");
    });
    var del = app.querySelector("[data-xdel]");
    if(del) del.addEventListener("click", function(){
      confirmSheet(t("exDeleteQ"), t("exDeleteText"), t("del"), function(){
        deleteCustomExNow(id);
        goBack("#library");
      });
    });
  }
  draw();
}

/* ============ Kurzes Trainings-Gedächtnis ============ */
/* Kein Verlauf und keine Statistik mehr (Kalender, Streak & Co. wurden entfernt). Gemerkt werden
   nur die Übungen der letzten Tage, damit „Überrasch mich“ sie meiden kann, und die Dauer für die
   schlanke Wochenzeile auf der Startseite:
   state.db.history = [{ at, ex:[Übungs-IDs], dur:Sekunden }], ältere Einträge als 14 Tage fallen weg. */
/* Achtung: pruneHistory läuft schon in loadDB, also bevor diese Zeile ausgeführt wird - deshalb eine Funktion
   statt einer Variablen (eine var wäre dann noch undefined, und der ganze Verlauf fiele beim Laden weg) */
function histKeepDays(){ return 14; }
function pruneHistory(db){
  var since = Date.now() - histKeepDays()*86400000;
  db.history = (db.history || []).filter(function(e){ return e && e.at >= since; })
    .map(function(e){ var x = { at:e.at, ex:e.ex || [], dur:+e.dur || 0 }; if(e.studio) x.studio = e.studio; return x; });
}
function logHistory(partial){
  if(!playerState || playerState.logged) return;
  var steps = playerState.steps, idx = playerState.idx, ex = [], work = 0, dur = 0;
  steps.slice(0, idx+1).forEach(function(st, i){
    if(i < idx || st.phase === "done") dur += st.duration || 0;
    if(st.phase!=="work" || !st.ex) return;
    work += st.duration;
    if(ex.indexOf(st.ex) < 0) ex.push(st.ex);
  });
  if(partial && work < 60) return;   // kurz reingeschnuppert zählt nicht
  playerState.logged = true;
  pruneHistory(state.db);
  state.db.history.push({ at:Date.now(), ex:ex, dur:dur });
  save();
}
/* Übungen der letzten n Tage (für den Generator) */
/* Wochenzeile: welche Tage (Mo–So) trainiert, wie oft und wie lange - ohne Statistik, nur ein Blick */
function wocheDaten(){
  var d = new Date(); d.setHours(0, 0, 0, 0);
  var start = d.getTime() - ((d.getDay() + 6) % 7)*86400000;   // Montag 0:00
  var tage = [0,0,0,0,0,0,0], n = 0, sek = 0;
  (state.db.history || []).forEach(function(e){
    if(!e || e.at < start) return;
    var tag = Math.floor((e.at - start)/86400000);
    if(tag > 6) return;
    tage[tag] = 1; n++; sek += +e.dur || 0;
  });
  return { tage:tage, n:n, sek:sek, heute:(d.getDay() + 6) % 7 };
}
function wocheHTML(){
  var w = wocheDaten(), namen = t("weekDays").split(" ");
  var dauer = w.sek >= 60 ? " · "+fmtDuration(Math.round(w.sek/60)*60) : "";   // unter einer Minute keine Zeitangabe
  return '<div class="woche" aria-label="'+esc(t("weekTitle")+": "+(w.n ? (w.n === 1 ? t("weekOne") : t("weekN", { n:w.n }))+dauer : t("weekNone")))+'">'+
    '<span class="wo-links" aria-hidden="true"><b class="wo-titel">'+esc(t("weekTitle"))+'</b>'+
      '<span class="wo-summe">'+esc(w.n ? (w.n === 1 ? t("weekOne") : t("weekN", { n:w.n }))+dauer : t("weekNone"))+'</span></span>'+
    '<span class="wo-tage" aria-hidden="true">'+w.tage.map(function(an, i){
      return '<span class="wo-tag'+(an ? ' an' : '')+(i === w.heute ? ' heute' : '')+'"><i></i><small>'+esc(namen[i] || "")+'</small></span>'; }).join("")+'</span>'+
  '</div>';
}
function recentExercises(days){
  var since = Date.now() - days*86400000, out = {};
  (state.db.history || []).forEach(function(e){ if(e.at >= since) (e.ex||[]).forEach(function(id){ out[id] = true; }); });
  return out;
}

/* ============ Workouts per Link teilen ============ */
/* Das Workout steckt komprimiert in der Adresse (#import/…): kein Server, kein Konto.
   Erstes Zeichen: "z" = deflate-komprimiert, "j" = reines JSON (Fallback für alte Browser). */
function b64urlFromBytes(bytes){
  var bin = "";
  for(var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function bytesFromB64url(str){
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while(str.length % 4) str += "=";
  var bin = atob(str), out = new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i);
  return out;
}
function pipeBytes(bytes, stream){
  return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function(b){ return new Uint8Array(b); });
}
function encodeShare(obj){
  var raw = new TextEncoder().encode(JSON.stringify(obj));
  if(window.CompressionStream){
    return pipeBytes(raw, new CompressionStream("deflate-raw"))
      .then(function(b){ return "z"+b64urlFromBytes(b); })
      .catch(function(){ return "j"+b64urlFromBytes(raw); });
  }
  return Promise.resolve("j"+b64urlFromBytes(raw));
}
function decodeShare(str){
  try{
    var kind = str.charAt(0), bytes = bytesFromB64url(str.slice(1));
    var p = kind==="z"
      ? (window.DecompressionStream ? pipeBytes(bytes, new DecompressionStream("deflate-raw")) : Promise.reject(new Error("no-inflate")))
      : Promise.resolve(bytes);
    return p.then(function(b){ return JSON.parse(new TextDecoder().decode(b)); });
  }catch(e){ return Promise.reject(e); }
}
function customDefOf(ex){
  var c = findCustom(ex.id);
  if(c) return { id:c.id, name:c.name, cats:c.cats, equip:c.equip, perSide:!!c.perSide, reps:c.reps, work:c.work, rest:c.rest, hint:c.hint||"" };
  return { id:ex.id, name:tplText(ex.name), cats:ex.cats, equip:ex.equip, perSide:ex.perSide, reps:ex.setReps, work:ex.workSec, rest:ex.restSec, hint:tplText(ex.hint) };
}
function sharePayload(d){
  var custom = [];
  d.items.forEach(function(it){
    var ex = findExercise(it.ex);
    if(ex && ex.custom && !custom.some(function(c){ return c.id===ex.id; })) custom.push(customDefOf(ex));
  });
  var p = { v:1, n:d.name, b:d.blockRest||0 };
  if(d.mode==="uniform"){ p.u = [d.reps, d.work, d.rest]; p.i = d.items.map(function(it){ return it.ex; }); }
  else p.i = d.items.map(function(it){ return [it.ex, it.reps, it.work, it.rest]; });
  if(custom.length) p.c = custom;
  return p;
}
function copyText(text, okMsg){
  function ok(){ showToast(okMsg); }
  function fallback(){
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); ok(); }catch(e){}
    document.body.removeChild(ta);
  }
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
  else fallback();
}
function shareDraft(d){
  if(!d || !d.items.length) return;
  encodeShare(sharePayload(d)).then(function(code){
    var url = appUrl()+"#import/"+code, msg = t("shareMsg", { n:d.name });
    if(navigator.share){
      navigator.share({ title:d.name, text:msg, url:url }).catch(function(err){
        if(!err || err.name !== "AbortError") copyText(url, t("shareLinkCopied"));
      });
    } else copyText(msg+" "+url, t("shareLinkCopied"));
  });
}
/* Link öffnen: Workout auf dem Deckblatt zeigen - speichern erst mit „Als Eigenes speichern“ */
function draftFromShare(p){
  if(!p || !Array.isArray(p.i)) return null;
  (p.c || []).forEach(function(c){
    if(c && c.id && c.name && !findExercise(c.id)){
      var ex = customToEx(c); ex.sharedDef = c; EXERCISES.push(ex);
    }
  });
  var uni = Array.isArray(p.u);
  var items = [], missing = 0;
  p.i.forEach(function(x){
    var id = uni ? x : (x && x[0]);
    var ex = typeof id === "string" && findExercise(id);
    if(!ex){ missing++; return; }
    items.push(uni ? itemFromEx(id) : { ex:id, reps:clamp(parseInt(x[1])||ex.reps, 1, 60), work:clamp(parseInt(x[2])||ex.workSec, 5, 600), rest:clamp(parseInt(x[3])||0, 0, 300) });
  });
  if(!items.length) return null;
  return { key:"shared:", src:"shared", name:String(p.n || t("myDefaultName")).slice(0, 40),
           mode: uni ? "uniform" : "individual",
           reps: uni ? clamp(parseInt(p.u[0])||6, 1, 60) : 6, work: uni ? clamp(parseInt(p.u[1])||30, 5, 600) : 30,
           rest: uni ? clamp(parseInt(p.u[2])||0, 0, 300) : 10, blockRest: clamp(parseInt(p.b)||0, 0, 600),
           items:items, _missing:missing };
}
function renderImport(code){
  app.innerHTML = topbar(t("kindShared"), { back:"#home" })+'<div class="empty" style="padding:40px 20px;">…</div>';
  bindCommon();
  decodeShare(code || "").then(function(p){
    var d = draftFromShare(p);
    if(!d) throw new Error("empty");
    coverDraft = d;
    if(navTop().indexOf("#import/") === 0){ navStack[navStack.length-1] = "#cover/shared"; setUrl("#cover/shared"); }
    render();
    if(d._missing) showToast(t("sharedMissing", { n:d._missing }));
  }).catch(function(){
    if(navTop().indexOf("#import/") !== 0) return;
    app.innerHTML = topbar(t("kindShared"), { back:"#home" })+'<div class="empty" style="padding:40px 20px;">'+t("shareBad")+'</div>';
    bindCommon();
  });
}
/* Eigene Übungen aus einem geteilten Link werden erst beim Speichern übernommen */
function adoptSharedCustoms(d){
  var changed = false;
  d.items.forEach(function(it){
    var ex = findExercise(it.ex);
    if(ex && ex.sharedDef && !findCustom(ex.id)){
      if(!state.db.customEx) state.db.customEx = [];
      state.db.customEx.push(ex.sharedDef); changed = true;
    }
  });
  if(changed){ save(); syncCustomEx(); }
}

/* ============ Eigenes Workout und Deckblatt: gemeinsamer Editor mit Drag & Drop ============ */
var ICON_GRIP = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.8"/><circle cx="15" cy="6" r="1.8"/><circle cx="9" cy="12" r="1.8"/><circle cx="15" cy="12" r="1.8"/><circle cx="9" cy="18" r="1.8"/><circle cx="15" cy="18" r="1.8"/></svg>';

/* Baukasten: Arbeitskopie - erst „Speichern“ (oder Start) legt das Workout an bzw. überschreibt es.
   Zurück ohne Speichern verwirft die Änderungen; neu = noch nicht in der Liste. */
var bauEntwurf = null;
function renderMyBuild(id){
  if(!bauEntwurf || bauEntwurf.key !== id){
    if(id === "new") bauEntwurf = { key:id, neu:true, d:{ id:uid(), name:t("myDefaultName"), mode:"uniform", reps:6, work:30, rest:10, blockRest:45, items:[] } };
    else { var mw = findMy(id); if(!mw){ go("#library"); return; } bauEntwurf = { key:id, d:draftCopy(mw) }; }
  }
  renderDraftPage(bauEntwurf.d, { cover:false, back:"#library", id:bauEntwurf.d.id, bau:bauEntwurf });
}
function bauSpeichern(b){
  var d = b.d, l = state.db.myWorkouts || (state.db.myWorkouts = []), mw = null;
  for(var i=0;i<l.length;i++) if(l[i].id === d.id) mw = l[i];
  if(!mw){ mw = { id:d.id }; l.push(mw); }
  mw.name = d.name; mw.mode = d.mode; mw.reps = d.reps; mw.work = d.work; mw.rest = d.rest; mw.blockRest = d.blockRest;
  mw.items = draftCopy(d.items); mw.updatedAt = Date.now();
  save();
  if(b.neu){   // ab jetzt ein normales Workout: Adresse und Zurück-Verlauf zeigen darauf
    b.neu = false; b.key = d.id;
    navStack[navStack.length-1] = "#mybuild/"+d.id; setUrl(navTop());
  }
  b.dirty = false;
}
function renderCover(kind, id){
  var key = kind+":"+(id||"");
  if(!coverDraft || coverDraft.key !== key){
    if(kind==="lib"){ var lw = findLibWorkout(id); if(!lw){ go("#library"); return; } coverDraft = draftFromLib(lw); }
    else if(kind==="my"){ var mw = findMy(id); if(!mw){ go("#library"); return; } coverDraft = draftFromMy(mw); }
    else { go("#library"); return; }
  }
  renderDraftPage(coverDraft, { cover:true, back:"#library" });
}

/* cfg.cover: Deckblatt (Änderungen nur für dieses Training) - sonst Baukasten (speichert sofort).
   Aufbau (2026-09): Übungen als große Kacheln mit Figur und Namen. Antippen = hinzufügen (Kachel wird blau und
   zeigt ihre Position), nochmal antippen = entfernen. Der Ablauf steht als schmaler Streifen oben; ein Tipp auf
   eine Übung darin öffnet Zeiten, Verschieben, Tauschen, Entfernen. „Sinnvoll ordnen“ sortiert fachlich:
   große Übungen zuerst, Unter- und Oberkörper und Rumpf im Wechsel, Dehnen am Ende. */
function wbSinnvollOrdnen(items){
  var dehn = [], topf = { full:[], lower:[], upper:[], core:[] };
  items.forEach(function(it){
    var ex = findExercise(it.ex);
    if(!ex || exIsMobility(it.ex)){ dehn.push(it); return; }
    var r = exProfile(ex).region;
    (topf[r] || topf.full).push(it);
  });
  // schwere Übungen (Stufe) innerhalb jeder Gruppe zuerst - solange die Kraft noch frisch ist
  Object.keys(topf).forEach(function(k){ topf[k].sort(function(a, b){ return (findExercise(b.ex).level||2) - (findExercise(a.ex).level||2); }); });
  var aus = topf.full.slice(), reihe = ["lower", "upper", "core"], i = 0;
  while(topf.lower.length || topf.upper.length || topf.core.length){
    var k = reihe[i++ % 3];
    if(topf[k].length) aus.push(topf[k].shift());
  }
  return aus.concat(dehn);
}
function wbTauschKandidat(d, i){
  var alt = findExercise(d.items[i].ex);
  if(!alt) return null;
  var drin = {}; d.items.forEach(function(it){ drin[it.ex] = true; });
  var p = d._params, equips = p && p.equips ? p.equips : null, reg = exProfile(alt).region;
  var pool = EXERCISES.filter(function(ex){
    return !drin[ex.id] && !STUDIO_NUR[ex.id] && !libHidden("ex:"+ex.id) && ex.main === alt.main && (!equips || equipMatch(equips, ex));
  });
  var gleich = pool.filter(function(ex){ return exProfile(ex).region === reg; });
  var wahl = gleich.length ? gleich : pool;
  return wahl.length ? wahl[Math.floor(Math.random()*wahl.length)] : null;
}
function renderDraftPage(d, cfg){
  var s = state.db.settings;
  // Dehn- und Mobility-Übungen stehen immer am Ende
  var geordnet = stretchLast(d.items, function(it){ return it.ex; });
  if(geordnet.some(function(it, i){ return it !== d.items[i]; })){
    d.items = geordnet;
  }
  function ohne(l, x){ return l.filter(function(v){ return v !== x; }); }
  var cat = ohne(selArr(s.buildCats || s.buildCat), "stretch"), sort = s.libSort === "az" ? "az" : "std";
  var equip = ohne(selArr(s.buildEquips), "gym"), bmains = ohne(selArr(s.buildMains), "stretch");
  var run = draftRun(d);
  var exs = d.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
  var cats = [];
  exs.forEach(function(ex){ ex.cats.forEach(function(c){ if(cats.indexOf(c)<0) cats.push(c); }); });
  var hasSides = exs.some(function(ex){ return ex.perSide; });
  var dauer = fmtDuration(workoutDuration(run));

  // Position(en) jeder Übung im Ablauf - für die blaue Markierung der Kacheln
  var pos = {};
  d.items.forEach(function(it, i){ (pos[it.ex] = pos[it.ex] || []).push(i+1); });
  function kachel(ex){
    return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:'data-wbex="'+ex.id+'"', q:exSearchText(ex), cat:'var(--bereich, '+catVar(ex.cats[0])+')', nr:pos[ex.id] || [],
      innen:'<button type="button" class="wb-i" data-exinfo="'+ex.id+'" aria-label="'+esc(t("info"))+'">i</button>'+exFavBtn(ex.id) });
  }
  // Ablauf: Deckblatt = große Kacheln in Reihenfolge, Baukasten = schmaler Streifen
  function ablaufKachel(it, i){
    var ex = findExercise(it.ex);
    if(!ex) return "";
    var tm = itemTiming(d, it);
    return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:'data-wbitem="'+i+'"', cat:'var(--bereich, '+catVar(ex.cats[0])+')', klasse:"wb-ablauf",
      innen:'<span class="wb-nr">'+(i+1)+'</span>', unter:'<span class="st-sub">'+timingText(tm, ex.perSide)+'</span>' });
  }
  var streifen = d.items.map(function(it, i){
    var ex = findExercise(it.ex);
    if(!ex) return "";
    return '<button type="button" class="wb-mini" data-wbitem="'+i+'" style="--cat:var(--bereich, '+catVar(ex.cats[0])+')" aria-label="'+esc((i+1)+". "+tplText(ex.name))+'">'+
      (ILLU[ex.id] ? illuStillHTML(ex.id, "wb-mini-illu") : '')+'<span class="wb-mini-nr">'+(i+1)+'</span>'+
      '<span class="wb-mini-name">'+esc(tplText(ex.name))+'</span></button>';
  }).join("");

  // Zeiten: Vorlagen, einheitlich/individuell, Pause zwischen Übungen (auf dem Deckblatt zugeklappt)
  var rests = [0,15,30,45,60,90,120];
  if(rests.indexOf(d.blockRest) < 0) rests.push(d.blockRest);
  var optInner =
    '<label>'+t("timesLabel")+'</label>'+
    '<div class="seg-row">'+
      '<button type="button" data-mode="uniform" class="'+(d.mode==="uniform"?"active":"")+'">'+t("modeUniform")+'</button>'+
      '<button type="button" data-mode="individual" class="'+(d.mode==="individual"?"active":"")+'">'+t("modeIndividual")+'</button>'+
    '</div>'+
    (d.mode==="uniform"
      ? '<div class="tm-grid"><div><label>'+t("tmReps")+'</label>'+stepperHTML("d-reps", d.reps, 1, 30, 1)+'</div>'+
        '<div><label>'+t("tmWork")+'</label>'+stepperHTML("d-work", d.work, 5, 600, 5)+'</div>'+
        '<div><label>'+t("tmRest")+'</label>'+stepperHTML("d-rest", d.rest, 0, 300, 5)+'</div></div>'
      : '<div class="tm-hint">'+t("modeIndividualHint")+'</div>')+
    (hasSides ? '<div class="tm-hint">'+t("sidesNote")+'</div>' : '')+
    '<label for="d-br">'+t("myRest")+'</label>'+
    '<select id="d-br">'+rests.sort(function(a,b){return a-b;}).map(function(v){
      return '<option value="'+v+'"'+(v===d.blockRest?' selected':'')+'>'+v+' s</option>'; }).join("")+'</select>'+
    (cfg.cover ? '<div class="opt-sep"></div>'+toggleRow("c-voice", t("voice"), t("voiceDesc"), s.voice !== false) : '');
  var optOpen = !!s.coverOpts;
  var optSummary = (d.mode==="uniform" ? t("modeUniform")+' '+timingText({ reps:d.reps, work:d.work, rest:d.rest }, false) : t("modeIndividual"))+
    SEP+t("optRestShort", { n:d.blockRest })+(cfg.cover ? SEP+t(s.voice !== false ? "optVoiceOn" : "optVoiceOff") : '');
  var optionsHTML = '<div class="card opt-card">'+
      '<div class="opt-head" data-opttoggle role="button" tabindex="0" aria-expanded="'+optOpen+'">'+
        '<div><div class="opt-title">'+t("optTitle")+'</div><div class="opt-sum">'+optSummary+'</div></div>'+
        '<span class="tpl-chev'+(optOpen?'':' zu')+'" aria-hidden="true">&#9662;</span></div>'+
      (optOpen ? '<div class="opt-body">'+optInner+'</div>' : '')+
    '</div>';

  // Übungsauswahl: große Kacheln, gefiltert wie in der Bibliothek
  var palOpen = !cfg.cover || d._pal;
  var palHTML = "";
  if(palOpen){
    var palCounts = {};
    MAIN_CATS.forEach(function(c){ palCounts[c.id] = 0; });
    EXERCISES.forEach(function(ex){ if(fuerWorkout(ex) && !libHidden("ex:"+ex.id) && exPasses(ex, cat, equip, [])) palCounts[ex.main]++; });
    palHTML = '<div class="section-title">'+t("wbWaehlen")+'</div>'+
      '<div class="page-hint">'+esc(t("wbTippen"))+'</div>'+
      searchHTML(buildQuery, "b")+
      mainTilesHTML(bmains, palCounts, "data-bmain", ["stretch"])+
      filterZeileHTML("data-bfilter", filterCount(cat, equip), !!s.buildFilterOpen)+
      (s.buildFilterOpen ? filterCardHTML("b", cat, equip, sort, [["std", t("sortStd")], ["az", "A&ndash;Z"]], ["stretch"], ["gym"])
                         : activeFiltersHTML(cat, equip, "b"))+
      '<div class="fig-grid" id="dz-pal">'+(sortedExercises(cat, sort, equip, bmains).filter(fuerWorkout).map(function(ex){ return kachel(ex); }).join("") ||
        '<div class="empty" style="padding:20px;">'+t("libEmpty")+'</div>')+'</div>'+
      '<div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div>';
  }

  /* Deckblatt-Aktionen: nur „Los geht's“ ist groß; bei „Überrasch mich“ zusätzlich groß „Nochmal mischen“ */
  function coverAct(attrs, ico, label, cls){
    return '<button type="button" class="cover-act'+(cls?' '+cls:'')+'" '+attrs+(exs.length?'':' disabled')+'><span class="ca-ico">'+ico+'</span><span>'+esc(label)+'</span></button>';
  }
  var ICON_MISCHEN = svgIcon('<path d="M3 7h3c2.6 0 4 1.6 5.2 3.9l1.6 3C14 16.3 15.5 17 18 17h3M3 17h3c1.5 0 2.6-.5 3.4-1.5M14.3 7.9C15.2 7.3 16.4 7 18 7h3M18 4l3 3-3 3M18 14l3 3-3 3"/>');
  var favOn = isFav(d.key);
  var coverActs = '<div class="cover-acts">'+
    (d.src!=="surprise" && d.src!=="shared" ? coverAct('data-fav="'+d.key+'" aria-pressed="'+favOn+'"', favOn ? '★' : '☆', t("favorite"), favOn ? 'on' : '') : '')+
    coverAct('data-savemy', svgIcon(ICON_COPY), t(d.src==="my" ? "actCopy" : "actSave"))+
    coverAct('data-share', ICON_SHARE, t("share"))+
    (d.src==="lib" ? coverAct('data-coverhide', svgIcon(ICON_EYE_OFF), t("hideShort")) : '')+
  '</div>';
  var kind = d.src==="lib" ? "kindLib" : d.src==="surprise" ? "kindSurprise" : d.src==="shared" ? "kindShared" : "kindMy";
  var warmDehn = d.src==="lib" && libIstWarmDehn(findLibWorkout(d.key.slice(4)));
  var head = cfg.cover
    ? '<div class="card cover-hero">'+
        '<div class="cover-kicker">'+t(kind)+'</div>'+
        '<h2 class="cover-name">'+esc(d.name)+'</h2>'+
        '<div class="cover-meta">'+t("exCount", { n:exs.length })+SEP+dauer+'</div>'+
        (exs.length ? '<div class="cat-tags">'+catTags(cats)+'</div>' : '')+
        (exs.length ? '<div class="cover-equip">'+esc(t("equipLabel"))+': '+esc(woEquipText(exs))+'</div>' : '')+
        '<button class="btn btn-primary" data-go '+(exs.length?'':'disabled')+'>'+ICON_PLAY+' '+t("letsGo")+'</button>'+
        (d.src==="surprise" ? '<button class="btn btn-secondary wb-mischen" data-reroll>'+ICON_MISCHEN+' '+t("wbMischen")+'</button>' : '')+
        coverActs+
        '<div class="cover-note">'+t(d._dirty ? "coverDirty" : "coverHint")+'</div>'+
      '</div>'
    : '<div class="card"><label for="m-name">'+t("name")+'</label>'+
        '<input type="text" id="m-name" value="'+esc(d.name)+'" maxlength="40"></div>';

  var ablaufHTML = cfg.cover
    ? '<div class="section-title wb-kopf"><span>'+t("myInWorkout", { n:exs.length, d:dauer })+'</span>'+
        (exs.length > 2 ? '<button type="button" class="sec-link" data-wbordnen>'+esc(t("wbOrdnen"))+'</button>' : '')+'</div>'+
      '<div class="page-hint">'+esc(t("wbAblaufHint"))+'</div>'+
      '<div class="fig-grid">'+d.items.map(ablaufKachel).join("")+'</div>'+
      (palOpen ? '' : '<button type="button" class="my-new" data-palopen>'+ICON_PLUS+' '+t("myAdd")+'</button>')
    : '<div class="section-title wb-kopf"><span>'+t("wbAblauf")+'</span>'+
        (exs.length > 2 ? '<button type="button" class="sec-link" data-wbordnen>'+esc(t("wbOrdnen"))+'</button>' : '')+'</div>'+
      (d.items.length ? '<div class="wb-streifen">'+streifen+'</div>' : '<div class="fav-empty">'+esc(t("wbLeer"))+'</div>');

  app.innerHTML =
    topbar(cfg.cover ? t("coverTitle") : t("myWorkout"), { back:cfg.back, right: cfg.cover ? "" :
      '<button class="iconbtn" data-share title="'+t("shareWo")+'" aria-label="'+t("shareWo")+'" '+(d.items.length?'':'disabled style="opacity:.35"')+'>'+ICON_SHARE+'</button>' }) +
    // Aufwärm- und Dehnprogramme: Überschrift, Kacheln und Figuren in der Farbe von Aufwärmen & Dehnen
    (warmDehn ? '<div style="--bereich:var(--ws-color)">' : '<div>') + head + ablaufHTML + optionsHTML + palHTML + '</div>' +
    (cfg.cover || cfg.bau.neu ? '' : '<button class="btn btn-danger" data-mydel style="margin-top:18px;">'+ICON_TRASH+' '+t("myDelete")+'</button>')+
    '<div style="height:'+(cfg.cover ? 40 : 96)+'px"></div>'+
    (cfg.cover ? '' : '<div class="wb-leiste"><div class="wb-leiste-in"><span><b>'+t("exCount", { n:exs.length })+'</b><br>'+dauer+'</span>'+
      '<span class="wb-knoepfe">'+speicherKnopf()+
      '<button type="button" class="btn '+(cfg.bau.dirty ? 'btn-secondary' : 'btn-primary')+'" data-tocover'+(d.items.length ? '' : ' disabled')+'>'+ICON_PLAY+' '+t("start")+'</button></span></div></div>');
  function speicherKnopf(){
    var offen = cfg.bau.dirty;
    return '<button type="button" class="btn '+(offen ? 'btn-primary' : 'btn-secondary')+'" data-wbsave'+(offen ? '' : ' disabled')+'>'+
      ICON_SAVE+' '+t(offen ? "save" : "wbGespeichert")+'</button>';
  }
  if(!cfg.cover){   // Zurück mit ungespeicherten Änderungen: erst nachfragen
    var zur = app.querySelector("[data-back]");
    if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){
      if(!cfg.bau.dirty) return goBack(cfg.back);
      confirmSheet(t("wbVerwerfenQ"), t("wbVerwerfenText"), t("wbVerwerfen"), function(){ bauEntwurf = null; goBack(cfg.back); });
    }); }
  }
  bindCommon();

  function speichern(){
    if(cfg.cover) d._dirty = true;
    else {
      cfg.bau.dirty = true;
      var alt = app.querySelector("[data-wbsave]");   // Knopf sofort umstellen (z. B. beim Tippen des Namens)
      if(alt && alt.disabled){ alt.outerHTML = speicherKnopf(); app.querySelector("[data-wbsave]").addEventListener("click", sichern); }
    }
  }
  function sichern(){ bauSpeichern(cfg.bau); showToast(t("wbGespeichert")); neu(); }
  function neu(){ var y = window.scrollY; renderDraftPage(d, cfg); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ fn(el, e); }); }); }

  var nameIn = app.querySelector("#m-name");
  if(nameIn) nameIn.addEventListener("input", function(){ d.name = nameIn.value.trim() || t("myDefaultName"); speichern(); });
  on("[data-mode]", function(el){ d.mode = el.getAttribute("data-mode"); speichern(); neu(); });
  bindSteppers(app, function(){
    var r = app.querySelector("#d-reps"), w = app.querySelector("#d-work"), rs = app.querySelector("#d-rest");
    if(r) d.reps = parseInt(r.value)||d.reps;
    if(w) d.work = parseInt(w.value)||d.work;
    if(rs) d.rest = parseInt(rs.value)||0;
    speichern(); neu();
  });
  var brSel = app.querySelector("#d-br");
  if(brSel) brSel.addEventListener("change", function(){ d.blockRest = parseInt(this.value)||0; speichern(); neu(); });
  var optT = app.querySelector("[data-opttoggle]");
  function optUm(){ s.coverOpts = !s.coverOpts; save(); neu(); }
  if(optT){
    optT.addEventListener("click", optUm);
    optT.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); optUm(); } });
  }
  if(cfg.cover && app.querySelector("#c-voice")) bindToggle("c-voice", function(v){ s.voice = v; save(); neu(); });

  // Kachel antippen: hinzufügen bzw. wieder herausnehmen
  function kachelTipp(el){
    var id = el.getAttribute("data-wbex");
    if(pos[id]){ d.items = d.items.filter(function(it){ return it.ex !== id; }); }
    else {
      d.items.push(itemFromEx(id));
      var neuOrd = stretchLast(d.items, function(it){ return it.ex; }); d.items = neuOrd;
    }
    speichern(); neu();
  }
  kachelKlick(app, "[data-wbex]", kachelTipp);
  on("[data-exinfo]", function(el, e){ e.stopPropagation(); openExInfo(el.getAttribute("data-exinfo"), false); });
  on("[data-exfav]", function(el, e){ e.stopPropagation(); toggleExFav(el.getAttribute("data-exfav")); neu(); });   // Stern: steht dann oben

  // Übung im Ablauf: Aktionen
  function ablaufMenue(i){
    var it = d.items[i], ex = findExercise(it.ex);
    if(!ex) return;
    var acts = [];
    if(d.mode === "individual" || exIsStretch(it.ex)) acts.push({ ico:ICON_TIMERBLOCK, label:t("wbZeiten"), fn:function(){ openTimingSheet(d, i, function(){ speichern(); neu(); }); } });
    if(i > 0) acts.push({ ico:'<path d="M12 19V5M5 12l7-7 7 7"/>', label:t("wbNachVorn"), fn:function(){ var x = d.items.splice(i, 1)[0]; d.items.splice(i-1, 0, x); speichern(); neu(); } });
    if(i < d.items.length-1) acts.push({ ico:'<path d="M12 5v14M5 12l7 7 7-7"/>', label:t("wbNachHinten"), fn:function(){ var x = d.items.splice(i, 1)[0]; d.items.splice(i+1, 0, x); speichern(); neu(); } });
    if(cfg.cover) acts.push({ ico:'<path d="M3 7h3c2.6 0 4 1.6 5.2 3.9l1.6 3C14 16.3 15.5 17 18 17h3M18 14l3 3-3 3M3 17h3c1.5 0 2.6-.5 3.4-1.5M14.3 7.9C15.2 7.3 16.4 7 18 7h3M18 4l3 3-3 3"/>', label:t("wbTauschen"), fn:function(){
      var nx = wbTauschKandidat(d, i);
      if(!nx){ showToast(t("wbKeinTausch")); return; }
      var alt = d.items[i], neuIt = itemFromEx(nx.id);
      if(d.mode === "individual" && !exIsStretch(nx.id)){ neuIt.reps = alt.reps; neuIt.work = alt.work; neuIt.rest = alt.rest; }
      d.items[i] = neuIt; speichern(); neu();
    } });
    if(cfg.cover && EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false); } });
    acts.push({ ico:ICON_TRASH, label:t("del"), danger:true, fn:function(){ d.items.splice(i, 1); speichern(); neu(); } });
    openActionSheet((i+1)+". "+tplText(ex.name), acts);
  }
  app.querySelectorAll("[data-wbitem]").forEach(function(el){
    function los(){ ablaufMenue(parseInt(el.getAttribute("data-wbitem"))); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); los(); } });
  });
  on("[data-wbordnen]", function(){ d.items = wbSinnvollOrdnen(d.items); speichern(); neu(); showToast(t("wbGeordnet")); });

  on("[data-bfilter]", function(){ s.buildFilterOpen = !s.buildFilterOpen; save(); neu(); });
  on("[data-bfcat]", function(el){ s.buildCats = selToggle(cat, el.getAttribute("data-bfcat")); save(); neu(); });
  on("[data-bfequip]", function(el){ s.buildEquips = selToggle(equip, el.getAttribute("data-bfequip")); save(); neu(); });
  on("[data-bfsort]", function(el){ s.libSort = el.getAttribute("data-bfsort"); save(); neu(); });
  on("[data-bfreset]", function(){ s.buildCats = []; s.buildEquips = []; save(); neu(); });
  on("[data-bmain]", function(el){ s.buildMains = selToggle(bmains, el.getAttribute("data-bmain")); save(); neu(); });
  var bq = app.querySelector("#b-q");
  if(bq){
    applySearch(app.querySelector("#dz-pal") || app, buildQuery);
    bq.addEventListener("input", function(){ buildQuery = bq.value; applySearch(app.querySelector("#dz-pal") || app, buildQuery); });
  }
  on("[data-palopen]", function(){ d._pal = true; neu(); });
  on("[data-share]", function(){ shareDraft(d); });
  on("[data-wbsave]", sichern);
  on("[data-tocover]", function(){ if(d.items.length){ if(cfg.bau.dirty || cfg.bau.neu) bauSpeichern(cfg.bau); coverDraft = null; go("#cover/my/"+cfg.id); } });
  on("[data-mydel]", function(){
    confirmSheet(t("myDeleteQ"), t("cantUndo"), t("del"), function(){
      deleteMyNow(cfg.id); bauEntwurf = null; go("#library");
    });
  });
  if(cfg.cover){
    on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
    on("[data-coverhide]", function(){ libHide("wo:"+d.key.slice(4)); showToast(t("hiddenToast")); go("#library"); });
    on("[data-go]", function(){
      if(!d.items.length) return;
      // Sprachausgabe im Tipp freischalten (iOS erlaubt sie sonst nicht)
      if(window.speechSynthesis && s.voice !== false){
        tonMischen(true);   // erst mischen, dann sprechen - sonst hält iOS die Musik an
        try{ var u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); }catch(e){}
      }
      go("#playdraft");
    });
    on("[data-savemy]", function(){
      if(!d.items.length) return;
      if(d.src==="shared") adoptSharedCustoms(d);
      createMyFromDraft(d);
      showToast(t("savedMy"));
    });
    on("[data-reroll]", function(){
      var nd = buildSurprise(d._params);
      if(nd){ coverDraft = nd; renderDraftPage(nd, cfg); window.scrollTo(0,0); }
    });
  }
}

/* Zeiten einer einzelnen Übung anpassen */
function openTimingSheet(d, i, onDone){
  var it = d.items[i], ex = findExercise(it.ex);
  if(!ex) return;
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet tm-sheet">'+
    '<h3>'+esc(tplText(ex.name))+'</h3>'+
    '<label>'+t("reps")+'</label>'+stepperHTML("t-reps", it.reps, 1, 30, 1)+
    (ex.perSide ? '<div class="tm-hint">'+t("repsBothSides")+'</div>' : '')+
    '<label>'+t("workSec")+'</label>'+stepperHTML("t-work", it.work, 5, 600, 5)+
    '<label>'+t("restSec")+'</label>'+stepperHTML("t-rest", it.rest, 0, 300, 5)+
    '<div class="btn-row" style="margin-top:16px;"><button class="btn btn-secondary" data-reco>'+t("recommended")+'</button>'+
    '<button class="btn btn-primary" data-ok>'+t("timeDone")+'</button></div>'+
    '</div></div>';
  function lesen(){
    it.reps = parseInt(root.querySelector("#t-reps").value)||1;
    it.work = parseInt(root.querySelector("#t-work").value)||5;
    it.rest = parseInt(root.querySelector("#t-rest").value)||0;
  }
  function close(){ lesen(); root.innerHTML = ""; onDone(); }
  bindSteppers(root, lesen);
  root.querySelector("[data-reco]").addEventListener("click", function(){
    root.querySelector("#t-reps").value = ex.reps;
    root.querySelector("#t-work").value = ex.workSec;
    root.querySelector("#t-rest").value = ex.restSec;
  });
  root.querySelector("[data-ok]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}

/* „Überrasch mich“: Dauer, Körperbereiche, Schwierigkeit, Ausrüstung */
var SP_TIMING = {
  1: { reps:4, work:30, rest:15, blockRest:60 },
  2: { reps:6, work:30, rest:10, blockRest:45 },
  3: { reps:6, work:40, rest:10, blockRest:30 }
};
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j = Math.floor(Math.random()*(i+1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
/* Einordnung jeder Übung für den Generator, abgeleitet aus den Hauptmuskeln (EX_MUSCLES):
   Bereich "lower" / "upper" / "core" / "full" und Bewegungsmuster "push" / "pull" / "". */
var EX_PROFILE = {};
function exProfile(ex){
  if(EX_PROFILE[ex.id]) return EX_PROFILE[ex.id];
  var m = ((EX_MUSCLES[ex.id] || [])[0] || "").toLowerCase(), region = "", first = 999;
  [["lower", /gesäß|oberschenkel|waden|adduktor/], ["core", /bauch|rumpf/],
   ["upper", /brust|trizeps|schulter|rücken|bizeps|trapez|rauten|unterarm|nacken/]].forEach(function(r){
    var i = m.search(r[1]);
    if(i > -1 && i < first){ first = i; region = r[0]; }
  });
  if(!region){
    region = ex.cats.indexOf("legs") > -1 ? "lower" : ex.cats.indexOf("core") > -1 ? "core"
      : (ex.cats.indexOf("back") > -1 || ex.cats.indexOf("arms") > -1) ? "upper" : "full";
  }
  if(ex.cats.indexOf("cardio") > -1 && region !== "lower") region = "full";
  // Hauptmuskeln aus Unter- und Oberkörper (z. B. Burpees: Beine, Brust, Schultern) = Ganzkörper
  if(/gesäß|oberschenkel|waden/.test(m) && /brust|trizeps|schulter|rücken|bizeps/.test(m)) region = "full";
  var pull = /breiter rückenmuskel|oberer rücken|bizeps|rauten|trapez|hintere schulter|unterarme \(griff\)/.test(m) ||
             (!m && ex.cats.indexOf("back") > -1);
  var push = /brust|trizeps|vordere schulter|^schultern/.test(m);
  var prof = { region:region, pattern: pull && !push ? "pull" : push && !pull ? "push" : "" };
  if(!ex.custom) EX_PROFILE[ex.id] = prof;
  return prof;
}
/* „Überrasch mich“ mit Regeln statt reinem Würfeln:
   - erst nach Hauptkategorie eingrenzen (nichts gewählt = Kraft, Ausdauer, Rumpf), dann Fokus und Ausrüstung
   - Stangen- und Barrenübungen nur, wenn Stangenpark gewählt ist
   - alle gewählten Fokus-Bereiche bzw. Kategorien kommen reihum vor
   - direkt aufeinander folgende Übungen trainieren möglichst verschiedene Bereiche
   - Drücken und Ziehen halten sich die Waage
   - Übungen aus den Trainings der letzten 7 Tage kommen nur, wenn sonst zu wenig passt
   - zum Einstieg lieber etwas Leichteres
   - Stretch zusammen mit anderem gewählt: Dehnübungen (mit ihren eigenen Haltezeiten) immer am Ende */
function spNormalize(p){
  if(!p.mains){   // gespeichert von einer älteren Fassung: damals gab es nur den Fokus
    var alt = selArr(p.cats);
    p.mains = alt.indexOf("calis") > -1 ? ["stange"] : [];
    p.cats = alt.filter(function(c){ return c !== "calis" && c !== "stretch"; });
  }
  p.mains = selArr(p.mains).filter(function(m){ return m !== "stretch"; });   // Stretch gibt es hier nicht mehr
  p.cats = selArr(p.cats).filter(function(c){ return c !== "stretch"; });
  if(!p.equips) p.equips = selArr(p.equip && p.equip!=="all" ? [p.equip] : ["none"]);
  return p;
}
function spDuration(it){ return it.reps*it.work + Math.max(0, it.reps-1)*it.rest; }
function buildSurprise(p){
  p = spNormalize(p);
  var tm = SP_TIMING[p.level] || SP_TIMING[2];
  var mains = p.mains.length ? p.mains.slice() : ["kraft","ausdauer","rumpf"];
  var fokus = p.cats.filter(function(c){ return c !== "stretch"; });
  var wantStretch = mains.indexOf("stretch") > -1 || p.cats.indexOf("stretch") > -1;
  var trainMains = mains.filter(function(m){ return m !== "stretch"; });
  var equips = p.equips;
  var recent = p.avoid === false ? {} : recentExercises(7);
  var total = p.dur*60;

  /* Dehnteil: nur Stretch gewählt = das ganze Training, sonst etwa ein Sechstel (mindestens zwei Übungen) */
  var stretchPool = !wantStretch ? [] : EXERCISES.filter(function(ex){ return ex.main === "stretch" && !libHidden("ex:"+ex.id); });
  var stretchBudget = !stretchPool.length ? 0 : (trainMains.length ? Math.max(140, Math.round(total/6)) : total);
  // feste Anzahl (Timer-Workout füllen): Dehnübungen zählen mit, etwa jede fünfte
  var anzahl = p.anzahl > 0 ? p.anzahl : 0;
  var stretchAnzahl = !anzahl || !stretchPool.length ? 0 : (trainMains.length ? Math.max(2, Math.round(anzahl/5)) : anzahl);

  var picked = [];
  if(trainMains.length){
    var block = tm.reps*tm.work + (tm.reps-1)*tm.rest;
    var trainSec = Math.max(block, total - stretchBudget);
    var n = anzahl ? Math.max(1, anzahl - stretchAnzahl) : Math.max(2, Math.round((trainSec + tm.blockRest) / (block + tm.blockRest)));
    var pool = EXERCISES.filter(function(ex){
      return !libHidden("ex:"+ex.id) && fuerWorkout(ex) && trainMains.indexOf(ex.main) > -1 && catMatch(fokus, ex.cats) &&
        equipMatch(equips, ex) && gearOk(ex, fokus, equips, trainMains);
    });
    if(!pool.length && !stretchPool.length) return null;
    var fresh = pool.filter(function(ex){ return !recent[ex.id]; }).length;
    var avoidRecent = fresh >= Math.min(n, pool.length);   // nur meiden, wenn genug andere da sind
    // reihum: bei mehreren Fokus-Bereichen über den Fokus, sonst über die Kategorien
    var rotate = fokus.length > 1 ? fokus : trainMains.length > 1 ? trainMains : [];
    function keys(ex){ return fokus.length > 1 ? ex.cats : [ex.main]; }
    var push = 0, pull = 0, covered = {};
    // Sternchen-Übungen: immer etwa ein Drittel des Workouts (soweit genug passende markiert sind)
    var favZiel = Math.min(pool.filter(function(ex){ return isExFav(ex.id); }).length, Math.round(n/3)), favDrin = 0;
    shuffle(pool);
    while(picked.length < n && picked.length < pool.length){
      var prev = picked.length ? exProfile(picked[picked.length-1]) : null;
      var prev2 = picked.length > 1 ? exProfile(picked[picked.length-2]) : null;
      var best = null, bestScore = -Infinity;
      pool.forEach(function(ex){
        if(picked.indexOf(ex) > -1) return;
        var pr = exProfile(ex), sc = Math.random()*1.5;
        if(prev && pr.region === prev.region && pr.region !== "full") sc -= 3;
        if(prev2 && pr.region === prev2.region && pr.region !== "full") sc -= 1;
        if(pr.pattern === "push") sc += push > pull ? -2 : push < pull ? 1.5 : 0;
        if(pr.pattern === "pull") sc += pull > push ? -2 : pull < push ? 1.5 : 0;
        if(avoidRecent && recent[ex.id]) sc -= 5;
        if(rotate.length && keys(ex).some(function(c){ return rotate.indexOf(c) > -1 && !covered[c]; })) sc += 2;
        if(!picked.length) sc += ex.level === 1 ? 1 : ex.level === 3 ? -1.5 : 0;
        // Intensität: Intensiv meidet lockere Übungen, Locker meidet die intensiven (EX_INT, sonst 2)
        var bel = EX_INT[ex.id] || 2;
        if(p.level === 3) sc += bel === 3 ? .6 : bel === 1 ? -4 : 0;
        else if(p.level === 1) sc += bel === 3 ? -4 : bel === 1 ? .6 : 0;
        if(favZiel){
          // über das Workout verteilt: Bonus nur, wenn die Sternchen hinter ihrem Anteil bis zu dieser Stelle liegen
          var favOffen = favZiel - favDrin, platzFrei = n - picked.length, favSoll = favZiel * (picked.length + 1) / n;
          if(isExFav(ex.id)) sc += favOffen <= 0 ? -50 : favOffen >= platzFrei ? 50 : favDrin < favSoll - .5 ? 4 : 0;
          else if(favOffen >= platzFrei) sc -= 50;   // die restlichen Plätze gehören den Sternchen
        }
        if(sc > bestScore){ bestScore = sc; best = ex; }
      });
      if(!best) break;
      picked.push(best);
      if(isExFav(best.id)) favDrin++;
      var bp = exProfile(best);
      if(bp.pattern === "push") push++;
      if(bp.pattern === "pull") pull++;
      keys(best).forEach(function(c){ covered[c] = true; });
      if(rotate.every(function(c){ return covered[c]; })) covered = {};   // nächste Runde reihum
    }
  }
  /* Jedes zweite „Überrasch mich“ enthält eine Burpee-Variante (passend zu Ausrüstung und Stufe) */
  if(picked.length && !anzahl){
    var st = state.db.settings;
    st.spZahl = (st.spZahl || 0) + 1; save();
    var istBurpee = function(ex){ return /burpee/.test(ex.id); };
    if(st.spZahl % 2 === 0 && !picked.some(istBurpee)){
      var bur = EXERCISES.filter(function(ex){
        return istBurpee(ex) && fuerWorkout(ex) && !libHidden("ex:"+ex.id) && equipMatch(equips, ex) && gearOk(ex, fokus, equips, trainMains) &&
          (p.level !== 1 || (EX_INT[ex.id] || 2) < 3);   // locker: nur die sanften
      });
      var frisch = bur.filter(function(ex){ return !recent[ex.id]; });
      bur = frisch.length ? frisch : bur;
      if(bur.length){
        var neuB = bur[Math.floor(Math.random()*bur.length)];
        // ersetzt am liebsten eine Ausdauer- oder Ganzkörperübung, sonst die zweite - nie eine Sternchen-Übung
        var frei = picked.map(function(ex, i){ return isExFav(ex.id) ? -1 : i; }).filter(function(i){ return i > -1; }), platz = -1;
        frei.forEach(function(i){ if(platz < 0 && (picked[i].main === "ausdauer" || exProfile(picked[i]).region === "full")) platz = i; });
        if(platz < 0 && frei.length) platz = frei[Math.min(1, frei.length - 1)];
        if(platz > -1) picked[platz] = neuB;
      }
    }
  }
  var items = picked.map(function(ex){ return { ex:ex.id, reps:tm.reps, work:tm.work, rest:tm.rest }; });

  /* Dehnübungen: passend zu den trainierten Bereichen, jede nur einmal, 10 s zum Umsetzen */
  if(stretchPool.length && stretchBudget > 0){
    var regions = {};
    picked.forEach(function(ex){ regions[exProfile(ex).region] = true; });
    var sp = shuffle(stretchPool.slice()), used = 0, sItems = [];
    sp.sort(function(a, b){
      var ra = regions[exProfile(a).region] ? 1 : 0, rb = regions[exProfile(b).region] ? 1 : 0;
      return (rb - ra) + ((recent[a.id] ? 1 : 0) - (recent[b.id] ? 1 : 0))*.5;
    });
    for(var i=0;i<sp.length;i++){
      var it = itemFromEx(sp[i].id), d = spDuration(it) + 10;
      if(anzahl ? sItems.length >= stretchAnzahl : (sItems.length >= 2 && used + d > stretchBudget)) break;
      it.after = 10;
      sItems.push(it); used += d;
    }
    items = items.concat(sItems);
  }
  if(!items.length) return null;
  var d = { key:"surprise:", src:"surprise", name:"", mode:"individual",
            reps:tm.reps, work:tm.work, rest:tm.rest, blockRest:tm.blockRest,
            items:items, _params:p };
  if(!anzahl) spDauerTreffen(d, total, tm);
  d.name = t("spName", { n:Math.max(1, Math.round(workoutDuration(draftRun(d))/60)) });
  return d;
}
/* Gesamtdauer möglichst nah an die gewählte Dauer bringen (die Pausen zwischen den Übungen zählen mit):
   einzelne Übungen bekommen eine Runde mehr oder weniger (beidseitige zwei, damit beide Seiten gleich oft drankommen),
   höchstens zwei vom Standard weg. Bei Gleichstand bleibt die Übung dran, die am nächsten am Standard liegt. */
function spDauerTreffen(d, ziel, tm){
  function abweichung(){ return Math.abs(workoutDuration(draftRun(d)) - ziel); }
  for(var runde=0; runde<40; runde++){
    var bestWert = abweichung(), best = null;
    d.items.forEach(function(it){
      var ex = findExercise(it.ex);
      if(!ex || exIsStretch(it.ex)) return;
      var schritt = ex.perSide ? 2 : 1;
      [-schritt, schritt].forEach(function(s){
        var neu = it.reps + s;
        if(neu < Math.max(2, tm.reps-2) || neu > tm.reps+2) return;
        it.reps = neu;
        var wert = abweichung() + Math.abs(neu - tm.reps)*.01;
        it.reps = neu - s;
        if(wert < bestWert - .001){ bestWert = wert; best = { it:it, s:s }; }
      });
    });
    if(!best) break;
    best.it.reps += best.s;
  }
}
var spFeinOffen = false;   // Feinauswahl in „Überrasch mich“ aufgeklappt (bleibt so, solange die App offen ist)
function openSurprise(twId){
  var s = state.db.settings, tw = twId ? findWorkout(twId) : null;
  var p = spNormalize(JSON.parse(JSON.stringify(s.surprise || { dur:20, mains:["kraft","rumpf"], cats:[], level:2, equips:["none"] })));
  if(tw) p.anzahl = s.surpriseAnzahl || 8; else delete p.anzahl;
  var root = document.getElementById("overlayRoot");
  var fokusCats = LIB_CATS.filter(function(c){ return c.id!=="stretch" && c.id!=="calis"; });
  function feinText(){   // Zusammenfassung der zugeklappten Feinauswahl
    var f = fokusCats.filter(function(c){ return p.cats.indexOf(c.id) > -1; }).map(function(c){ return tplText(c); });
    return t("int"+p.level)+" · "+(f.length ? f.join(", ") : t("spNoFocus"));
  }
  function draw(){
    // Neu zeichnen ohne Springen: die Scrollposition im Fenster bleibt erhalten
    var alt = root.querySelector(".sp-sheet"), scrollAlt = alt ? alt.scrollTop : 0;
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet sp-sheet">'+
      '<h3>'+svgIcon(ICON_SPARK, "ico sp-h-ico")+' '+t("surprise")+'</h3>'+
      (tw ? '<div class="tm-hint" style="margin-top:0">'+esc(t("spFillHint", { n:tw.name || t("untitled") }))+'</div>'+
            '<label>'+t("spCount")+'</label><div class="sp-chips">'+[4,6,8,10,12,15].map(function(v){
        return '<button type="button" class="fc-chip'+(p.anzahl===v?' on':'')+'" data-spanz="'+v+'">'+v+' '+t("spCountUnit")+'</button>'; }).join("")+'</div>'
          : '<label>'+t("spDur")+'</label><div class="sp-chips">'+[10,15,20,30,45,60].map(function(v){
        return '<button type="button" class="fc-chip'+(p.dur===v?' on':'')+'" data-spdur="'+v+'">'+v+' Min</button>'; }).join("")+'</div>')+
      '<label>'+t("mainCat")+' <span class="lbl-hint">'+esc(t("multiOk"))+'</span></label>'+
      mainTilesHTML(p.mains, null, "data-spmain", ["stretch"])+
      '<div class="tm-hint" style="margin-top:-4px;">'+esc(t("spMainHint"))+'</div>'+
      '<label>'+t("equipHave")+'</label><div class="sp-chips">'+EQUIPS.filter(function(e){ return e.id !== "gym"; }).map(function(e){
        return '<button type="button" class="fc-chip'+(p.equips.indexOf(e.id)>-1?' on':'')+'" data-spequip="'+e.id+'">'+svgIcon(EQUIP_ICON[e.id])+esc(tplText(e))+'</button>'; }).join("")+'</div>'+
      // Fokus, Intensität und die Regeln sind selten nötig: zugeklappt, die Zusammenfassung zeigt die aktuelle Wahl
      '<button type="button" class="sp-more'+(spFeinOffen?' open':'')+'" data-spmore aria-expanded="'+spFeinOffen+'">'+
        '<span><b>'+t("spMore")+'</b><small>'+esc(feinText())+'</small></span>'+ICON_CHEV+'</button>'+
      (spFeinOffen ? '<div class="sp-more-body">'+
        '<label>'+t("spAreas")+' <span class="lbl-hint">'+esc(t("spFocusHint"))+'</span></label><div class="sp-chips">'+
          fokusCats.map(function(c){
          return '<button type="button" class="fc-chip'+(p.cats.indexOf(c.id)>-1?' on':'')+'" data-spcat="'+c.id+'">'+catIcon(c.id)+esc(tplText(c))+'</button>'; }).join("")+'</div>'+
        '<label>'+t("spLevel")+'</label><div class="seg-row">'+[1,2,3].map(function(l){
          return '<button type="button" class="'+(p.level===l?'active':'')+'" data-splevel="'+l+'">'+esc(t("int"+l))+'</button>'; }).join("")+'</div>'+
        '<div class="sp-avoid">'+toggleRow("sp-avoid", t("spAvoid"), t("spAvoidDesc"), p.avoid !== false)+'</div>'+
        '<div class="tm-hint">'+esc(t("spRules"))+'</div>'+
      '</div>' : '')+
      '<div class="btn-row sp-foot"><button class="btn btn-secondary" data-cancel>'+t("cancel")+'</button>'+
      '<button class="btn btn-primary" data-spgo>'+t("spGo")+'</button></div>'+
    '</div></div>';
    root.querySelector(".sp-sheet").scrollTop = scrollAlt;
    function on(sel, fn){ root.querySelectorAll(sel).forEach(function(b){ b.addEventListener("click", function(){ fn(b); draw(); }); }); }
    on("[data-spmore]", function(){ spFeinOffen = !spFeinOffen; });
    on("[data-spdur]", function(b){ p.dur = parseInt(b.getAttribute("data-spdur")); });
    on("[data-spanz]", function(b){ p.anzahl = parseInt(b.getAttribute("data-spanz")); });
    on("[data-spmain]", function(b){ p.mains = selToggle(p.mains, b.getAttribute("data-spmain")); });
    on("[data-spcat]", function(b){ p.cats = selToggle(p.cats, b.getAttribute("data-spcat")); });
    on("[data-splevel]", function(b){ p.level = parseInt(b.getAttribute("data-splevel")); });
    on("[data-spequip]", function(b){ p.equips = selToggle(p.equips, b.getAttribute("data-spequip")); });
    var avoid = root.querySelector("#sp-avoid");
    if(avoid) avoid.addEventListener("change", function(e){ p.avoid = e.target.checked; });
    root.querySelector("[data-cancel]").addEventListener("click", function(){ root.innerHTML = ""; });
    root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) root.innerHTML = ""; });
    root.querySelector("[data-spgo]").addEventListener("click", function(){
      if(tw){ s.surpriseAnzahl = p.anzahl; var q = JSON.parse(JSON.stringify(p)); delete q.anzahl; s.surprise = q; }
      else s.surprise = p;
      save();
      var d = buildSurprise(p);
      if(!d){ showToast(t("spNone")); return; }
      if(tw){ root.innerHTML = ""; timerWorkoutFuellen(tw, d); return; }
      root.innerHTML = "";
      coverDraft = d;
      go("#cover/surprise");
    });
  }
  draw();
}

/* ============ Einführung ============
   Fünf Seiten: Willkommen und je Bereich eine Seite in dessen Farbe mit dessen Symbol. Die Zahlen zählt die App
   selbst, damit sie mit neuen Übungen und Programmen stimmen. Beim ersten Start von selbst, sonst über die Einstellungen. */
var ICON_BAUSTEINE = '<rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="8" y="3" width="8" height="8" rx="1.5"/>';
function introSeiten(){
  var mitgeliefert = EXERCISES.filter(function(ex){ return !ex.custom; });
  var wsEx = {};
  AUFWAERM_UEBUNGEN.forEach(function(id){ if(findExercise(id)) wsEx[id] = true; });
  mitgeliefert.forEach(function(ex){ if(ex.main === "stretch") wsEx[ex.id] = true; });
  var einheiten = Array.isArray(REP_EINHEITEN) ? REP_EINHEITEN.length : Object.keys(REP_EINHEITEN).length;
  return [
    { ico:ICON_BAUSTEINE, farbe:"var(--accent)", titel:t("in1T"), text:t("in1"), notiz:t("in1N") },
    { ico:HOME_ICON.lib, farbe:"var(--tp-color)", titel:t("library"),
      text:t("in3", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length, e:mitgeliefert.filter(fuerWorkout).length }) },
    { ico:HOME_ICON.timer, farbe:"var(--bl-color)", titel:t("timers"), text:t("in2", { s:Object.keys(STUDIO_NUR).length }) },
    { ico:HOME_ICON.reps, farbe:"var(--rep-color)", titel:t("repTitle"), text:t("in4", { c:REP_WORKOUT_ROWS.length, u:einheiten }) },
    { ico:HOME_ICON.warm, farbe:"var(--ws-color)", titel:t("warmTitle"),
      text:t("in5", { p:LIB_WORKOUTS.filter(libIstWarmDehn).length, d:Object.keys(wsEx).length }) }
  ];
}
function openIntro(){
  var seiten = introSeiten(), nr = 0, root = document.getElementById("overlayRoot");
  function schliessen(){
    root.innerHTML = "";
    if(!state.db.settings.introGesehen){ state.db.settings.introGesehen = true; save(); }
  }
  function blaettern(d){ var n = nr + d; if(n < 0 || n >= seiten.length) return; nr = n; draw(); }
  function draw(){
    var s = seiten[nr], letzte = nr === seiten.length - 1;
    root.innerHTML = '<div class="confirm-overlay intro-overlay"><div class="confirm-sheet intro-sheet" role="dialog" aria-label="'+esc(t("introTitle"))+'" style="--intro-farbe:'+s.farbe+'">'+
      '<div class="intro-kopf"><div class="intro-punkte" aria-hidden="true">'+seiten.map(function(x, i){ return '<i class="'+(i === nr ? 'an' : '')+'"></i>'; }).join("")+'</div>'+
        (letzte ? '' : '<button type="button" class="intro-weg" data-introweg>'+esc(t("introSkip"))+'</button>')+'</div>'+
      '<div class="intro-seite"><span class="intro-ico">'+svgIcon(s.ico)+'</span>'+
        '<h2>'+esc(s.titel)+'</h2><p>'+esc(s.text)+'</p>'+(s.notiz ? '<p class="intro-notiz">'+esc(s.notiz)+'</p>' : '')+'</div>'+
      '<div class="intro-knoepfe">'+(nr ? '<button type="button" class="btn btn-secondary" data-introzurueck>'+esc(t("back"))+'</button>' : '')+
        '<button type="button" class="btn btn-primary" data-introweiter>'+esc(t(letzte ? "letsGo" : "introNext"))+'</button></div>'+
    '</div></div>';
    var sheet = root.querySelector(".intro-sheet");
    root.querySelector("[data-introweiter]").addEventListener("click", function(){ if(letzte) schliessen(); else blaettern(1); });
    var z = root.querySelector("[data-introzurueck]"); if(z) z.addEventListener("click", function(){ blaettern(-1); });
    var w = root.querySelector("[data-introweg]"); if(w) w.addEventListener("click", schliessen);
    root.querySelector(".intro-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("intro-overlay")) schliessen(); });   // daneben tippen, Android-Zurück
    // wischen: nach links weiter, nach rechts zurück
    var x0 = null;
    sheet.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, { passive:true });
    sheet.addEventListener("touchend", function(e){
      if(x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if(Math.abs(dx) > 50) blaettern(dx < 0 ? 1 : -1);
    });
    root.querySelector("[data-introweiter]").focus();
  }
  draw();
}

/* ---------- Sprachansagen (immer Englisch) in Vorbereitung und Pausen ---------- */
function voiceOn(){
  return !!(window.speechSynthesis && playerState && playerState.source && playerState.source.type==="draft" && state.db.settings.voice !== false);
}
function sayEN(text){
  try{
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB"; u.rate = 1; u.volume = 1;
    var voices = speechSynthesis.getVoices() || [];
    var v = voices.filter(function(x){ return /^en[-_]GB/i.test(x.lang) && x.localService; })[0] ||
            voices.filter(function(x){ return /^en/i.test(x.lang) && x.localService; })[0] ||
            voices.filter(function(x){ return /^en/i.test(x.lang); })[0];
    if(v) u.voice = v;
    setTimeout(function(){ if(playerState){ tonStandard(); speechSynthesis.speak(u); } }, 650);   // nach dem Signalton
  }catch(e){}
}
function announceStep(idx){
  if(!voiceOn()) return;
  var steps = playerState.steps, cur = steps[idx], nx = steps[idx+1];
  if(cur.phase==="done"){ sayEN("Workout complete. Well done!"); return; }
  if(!nx || nx.phase!=="work") return;
  var ex = findExercise(nx.ex), name = ex ? ex.name.en : nx.label;
  var side = nx.side ? (nx.side==="left" ? " Left side." : " Right side.") : "";
  var text = "";
  if(cur.phase==="prep") text = "Get ready. First up: "+name+"."+side;
  else if(cur.phase==="blockrest") text = "Rest. Next up: "+name+"."+side;
  else if(cur.phase==="rest"){
    if(nx.side && cur.side !== nx.side) text = "Switch sides.";
    if(nx.rep === nx.totalReps && nx.totalReps > 1) text += (text ? " " : "")+"Last round.";
  }
  if(text) sayEN(text);
}

/* ============ Datensicherung: Export, Schnappschuss, Erinnerung ============ */
/* Export als Datei; der Zeitpunkt wird für die Erinnerung auf der Startseite gemerkt */
/* Teilen: die Sicherungsdatei direkt an Drive, Mail, Messenger … übergeben (Android/iOS-Teilen-Menü).
   Chrome teilt nicht jede Dateiart - geht JSON nicht, dieselbe Datei als .txt (Import liest beides). */
function backupTeilDatei(){
  var name = "bloc-sicherung-"+new Date().toISOString().slice(0,10), inhalt = JSON.stringify(state.db,null,2);
  try{
    var f = new File([inhalt], name+".json", { type:"application/json" });
    if(navigator.canShare && navigator.canShare({ files:[f] })) return f;
    f = new File([inhalt], name+".txt", { type:"text/plain" });
    if(navigator.canShare && navigator.canShare({ files:[f] })) return f;
  }catch(e){}
  return null;
}
function kannBackupTeilen(){ return !!(navigator.share && backupTeilDatei()); }
function shareBackup(danach){
  var f = backupTeilDatei();
  if(!f || !navigator.share){ exportBackup(); if(danach) danach(); return; }
  navigator.share({ files:[f], title:"BLOC" }).then(function(){
    state.db.settings.lastExport = Date.now();
    save();
    showToast(t("backupShared"));
    if(danach) danach();
  }).catch(function(e){
    if(e && e.name === "AbortError") return;   // im Teilen-Menü abgebrochen
    exportBackup(); if(danach) danach();
  });
}
function exportBackup(){
  var blob = new Blob([JSON.stringify(state.db,null,2)], {type:"application/json"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = "sporttimer-backup-"+new Date().toISOString().slice(0,10)+".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  state.db.settings.lastExport = Date.now();
  save();
}
function hatEigenes(db){
  var st = (db && db.settings) || {};
  return !!(db && ((db.blocks||[]).length || (db.workouts||[]).length || (db.myWorkouts||[]).length || (db.customEx||[]).length ||
    Object.keys(st.studio || {}).length || (st.myReps || []).length));   // auch Gewichte im Freien Training und eigene Challenges
}
/* Erinnerung: eigene Inhalte, aber seit 14 Tagen (oder nie) exportiert. Der Installations-Hinweis hat Vorrang,
   × blendet sie nur für diese Sitzung aus. */
var BACKUP_TAGE = 14;
function backupTipHTML(){
  if(installTipHTML()) return "";
  try{ if(sessionStorage.getItem("bloc-backup-tip-weg") === "1") return ""; }catch(e){}
  if(!hatEigenes(state.db)) return "";
  var zuletzt = state.db.settings.lastExport || 0;
  if(Date.now() - zuletzt < BACKUP_TAGE*86400000) return "";
  return '<div class="installtip"><div><b>'+t("backupTipTitle")+'</b><br>'+t("backupTipText")+
    '<div style="margin-top:10px;"><button type="button" class="btn btn-primary" style="margin:0;width:auto;padding:11px 18px;font-size:14px;" data-backup-now>'+ICON_DOWNLOAD+' '+t("backupNow")+'</button></div></div>'+
    '<button data-hidebackup aria-label="'+t("close")+'">&times;</button></div>';
}
function bindBackupTip(){
  var jetzt = app.querySelector("[data-backup-now]");
  if(jetzt) jetzt.addEventListener("click", function(){ if(kannBackupTeilen()) shareBackup(render); else { exportBackup(); render(); } });
  var weg = app.querySelector("[data-hidebackup]");
  if(weg) weg.addEventListener("click", function(){
    try{ sessionStorage.setItem("bloc-backup-tip-weg", "1"); }catch(e){}
    render();
  });
}

/* Schnappschuss: alle 7 Tage eine vollständige Kopie von state.db in IndexedDB (nicht in localStorage -
   der Platz dort gehört den eigentlichen Daten). Es gibt immer nur einen, der alte wird überschrieben.
   Klappt das Speichern nicht (voll, gesperrt), wird still beim nächsten Start neu versucht. */
var SNAP_TAGE = 7, SNAP_DB = "bloc-sicherung", SNAP_STORE = "stand", SNAP_KEY = "schnappschuss";
var snapZeit = null;   // null = noch nicht nachgesehen, 0 = keiner vorhanden, sonst Zeitpunkt (ms)
function snapOeffnen(){
  return new Promise(function(ok, fehler){
    if(!window.indexedDB){ fehler(); return; }
    var req;
    try{ req = indexedDB.open(SNAP_DB, 1); }catch(e){ fehler(e); return; }
    req.onupgradeneeded = function(){ req.result.createObjectStore(SNAP_STORE); };
    req.onsuccess = function(){ ok(req.result); };
    req.onerror = function(){ fehler(req.error); };
    req.onblocked = function(){ fehler(); };
  });
}
function snapLesen(){
  return snapOeffnen().then(function(db){
    return new Promise(function(ok, fehler){
      try{
        var q = db.transaction(SNAP_STORE, "readonly").objectStore(SNAP_STORE).get(SNAP_KEY);
        q.onsuccess = function(){ ok(q.result || null); };
        q.onerror = function(){ fehler(q.error); };
      }catch(e){ fehler(e); }
    });
  });
}
function snapSchreiben(wert){
  return snapOeffnen().then(function(db){
    return new Promise(function(ok, fehler){
      try{
        var tx = db.transaction(SNAP_STORE, "readwrite");
        tx.objectStore(SNAP_STORE).put(wert, SNAP_KEY);
        tx.oncomplete = function(){ ok(); };
        tx.onerror = tx.onabort = function(){ fehler(tx.error); };
      }catch(e){ fehler(e); }
    });
  });
}
/* Beim Start: älter als 7 Tage (oder keiner) -> neuen ablegen. Nur wenn die gespeicherten Daten
   lesbar sind - und ein leerer Stand überschreibt nie einen Schnappschuss mit eigenen Inhalten
   (sonst wäre nach versehentlichem Löschen eine Woche später auch die Kopie weg). */
function snapPruefen(){
  var lesbar = false;
  try{ var roh = localStorage.getItem(DB_KEY); lesbar = !!roh && !!JSON.parse(roh); }catch(e){}
  snapLesen().then(function(alt){
    snapZeit = alt ? alt.zeit : 0;
    if(!lesbar) return;
    if(alt && Date.now() - alt.zeit < SNAP_TAGE*86400000) return;
    if(alt && hatEigenes(alt.daten) && !hatEigenes(state.db)) return;
    var neu = { zeit:Date.now(), daten:JSON.parse(JSON.stringify(state.db)) };
    return snapSchreiben(neu).then(function(){ snapZeit = neu.zeit; });
  }).catch(function(){}).then(snapZeileAktualisieren);
}
window.addEventListener("load", snapPruefen);
function snapDatum(zeit){
  return new Date(zeit).toLocaleDateString(currentLang()==="en" ? "en-GB" : "de-DE", { day:"2-digit", month:"2-digit", year:"numeric" });
}
function snapZeileHTML(){
  if(snapZeit === null) return '<small>'+t("snapInfo")+'</small>';
  if(!snapZeit) return t("snapNone")+'<small>'+t("snapInfo")+'</small>';
  var heute = new Date(); heute.setHours(0,0,0,0);
  var tag = new Date(snapZeit); tag.setHours(0,0,0,0);
  var n = Math.round((heute - tag) / 86400000);
  var wann = n <= 0 ? t("snapToday") : n === 1 ? t("snapYesterday") : t("snapDays", { n:n });
  return t("snapAgo", { x:wann })+'<small>'+t("snapInfo")+'</small>'+
    '<button type="button" class="btn btn-secondary" data-snaprestore>'+esc(t("snapRestore", { d:snapDatum(snapZeit) }))+'</button>';
}
function snapZeileAktualisieren(){
  var el = document.getElementById("snap-zeile");
  if(!el) return;
  el.innerHTML = snapZeileHTML();
}
function bindSnapZeile(){
  var el = document.getElementById("snap-zeile");
  if(!el) return;
  if(snapZeit === null) snapLesen().then(function(s){ snapZeit = s ? s.zeit : 0; }).catch(function(){ snapZeit = 0; }).then(snapZeileAktualisieren);
  el.addEventListener("click", function(ev){
    if(!ev.target.closest("[data-snaprestore]")) return;
    snapLesen().then(function(snap){
      if(!snap || !snap.daten) return;
      var d = snapDatum(snap.zeit);
      confirmSheet(t("snapQ"), t("snapText", { d:d }), t("snapBtn"), function(){
        var parsed = snap.daten;
        var db = defaultDB();
        db.blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
        db.workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];
        db.myWorkouts = Array.isArray(parsed.myWorkouts) ? parsed.myWorkouts : [];
        db.customEx = Array.isArray(parsed.customEx) ? parsed.customEx : [];
        db.history = Array.isArray(parsed.history) ? parsed.history : [];
        pruneHistory(db);
        if(parsed.settings) Object.assign(db.settings, parsed.settings);
        db.settings.theme = migrateTheme(db.settings.theme);
        db.settings.soundStyle = migrateSound(db.settings.soundStyle);
        migrateExIds(db);
        state.db = db; save(); syncCustomEx(); applyTheme(); applyLang(); applySpace();
        go("#home");
      });
    }).catch(function(){});
  });
}

/* ============ Rep-Workouts ============
   Ohne Intervalle: alle Wiederholungen so schnell wie möglich, eine Stoppuhr läuft mit. Eigener, schlichter
   Ablauf in der Seite - der Intervall-Timer bleibt unberührt. Programme stehen in daten.js (REP_WORKOUT_ROWS).
   Bestzeiten: settings.repBest[id] = { best, last, n, at } (Millisekunden). */
var repFilter = { lvl:"all", bar:"all", tab:"einheiten", stufe:"standard" };
var repRun = null;
function repRow(id){ for(var i=0;i<REP_WORKOUT_ROWS.length;i++) if(REP_WORKOUT_ROWS[i][0]===id) return REP_WORKOUT_ROWS[i]; return null; }
function repName(row){ return currentLang()==="en" ? row[2] : row[1]; }
function repRunden(row){ var n = 0; row[4].forEach(function(x){ n = Math.max(n, x[1].length); }); return n; }
function repWdh(row){ var n = 0; row[4].forEach(function(x){ x[1].forEach(function(m){ if(typeof m === "number") n += m; }); }); return n; }
function repBrauchtStange(row){
  return row[4].some(function(x){ var ex = REP_PSEUDO[x[0]] ? null : findExercise(x[0]); return !!(ex && ex.equip.indexOf("bar") > -1); });
}
function repExName(id){ var ex = REP_PSEUDO[id] ? null : findExercise(id); return ex ? tplText(ex.name) : tplText(REP_PSEUDO[id]); }
function repIllu(id){ return REP_PSEUDO[id] ? REP_PSEUDO[id].illu : id; }
function repSek(m){ return typeof m === "string" && /^\d+s$/.test(m) ? parseInt(m, 10) : 0; }
function repUhr(ms){
  var s = Math.max(0, Math.floor(ms/1000)), h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60;
  return (h ? h+":"+(m<10?"0":"")+m : m)+":"+(x<10?"0":"")+x;
}
function repMenge(m){
  if(typeof m === "number") return "×"+m;
  var sek = repSek(m);
  if(sek) return repUhr(sek*1000);
  return String(m).replace(/(\d)(k?m)$/, "$1 $2").replace("×", " × ");
}
/* Quelle eines Ablaufs: ein Programm („saentis“) oder eine Einheit aus mehreren Programmen („e1-standard-2“).
   teile = [{ row, von, bis, f }] - Runden von..bis, f = Faktor für Wiederholungen/Strecken */
var REP_STUFEN = ["leicht", "standard", "fortgeschritten"];
function repTeilParse(e){
  var m = /^([a-z0-9-]+)(?::(\d+)-(\d+))?(?:\*([\d.]+))?$/.exec(e) || [];
  var row = repRow(m[1]);
  if(!row) return null;
  var R = repRunden(row);
  return { row:row, von:m[2] ? +m[2] : 1, bis:Math.min(m[3] ? +m[3] : R, R), f:m[4] ? +m[4] : 1 };
}
/* „3 · Stufenweg“ bzw. mit Route „3 · Stufenweg · Südroute“ (ohne Namen: „Einheit 3“) */
function repEinheitTitel(eid, variante, varianten){
  var n = REP_EINHEIT_NAMEN[eid], en = currentLang() === "en" ? 1 : 0, nr = eid.slice(1);
  var titel = n ? nr+" · "+n[en] : t("unitN", { n:nr });
  if(varianten > 1) titel += " · "+(REP_ROUTEN[variante-1] ? REP_ROUTEN[variante-1][en] : t("variant", { n:variante }));
  return titel;
}
function repEinheit(eid){ for(var i=0;i<REP_EINHEITEN.length;i++) if(REP_EINHEITEN[i][0]===eid) return REP_EINHEITEN[i]; return null; }
/* Eigene Challenges: settings.myReps = [{ id:"my-…", name, runden, zeilen:[{ ex, art:"wdh"|"sek", m:[Menge je Runde] }] }].
   Sie werden zu einer Programmzeile wie in REP_WORKOUT_ROWS - Ablauf, Tabelle und Bestzeit bleiben dieselben. */
function myRep(id){ var l = state.db.settings.myReps || []; for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i]; return null; }
function myRepRow(c){
  return [c.id, c.name, c.name, 0, c.zeilen.map(function(z){
    return [z.ex, z.m.slice(0, c.runden).map(function(v){ v = +v || 0; return v > 0 ? (z.art === "sek" ? v+"s" : v) : 0; })];
  })];
}
function repQuelle(id){
  if(/^my-/.test(id || "")){
    var c = myRep(id);
    if(!c) return null;
    var mr = myRepRow(c);
    return { id:id, name:c.name || t("reDefaultName"), einzel:true, eigen:true, lvl:0, teile:[{ row:mr, von:1, bis:repRunden(mr), f:1 }] };
  }
  var row = repRow(id);
  if(row) return { id:id, name:repName(row), einzel:true, lvl:row[3], teile:[{ row:row, von:1, bis:repRunden(row), f:1 }] };
  var m = /^(e\d+)-(leicht|standard|fortgeschritten)-(\d+)$/.exec(id || "");
  var e = m && repEinheit(m[1]);
  if(!e) return null;
  var varianten = e[1 + REP_STUFEN.indexOf(m[2])], v = varianten[+m[3] - 1];
  if(!v) return null;
  return { id:id, einzel:false, stufe:m[2], nr:m[1].slice(1), variante:+m[3], varianten:varianten.length,
           name:repEinheitTitel(m[1], +m[3], varianten.length)+" · "+t("stufe_"+m[2]),
           teile:v.map(repTeilParse).filter(Boolean) };
}
function repMengeMal(m, f){
  if(f === 1) return m;
  if(typeof m === "number") return Math.max(1, Math.round(m*f));
  var d = /^(\d+(?:\.\d+)?)(m|km)$/.exec(m);
  if(!d) return m;
  var v = +d[1]*f;
  if(d[2] === "km" && v < 1) return Math.round(v*1000)+"m";
  return (Math.round(v*10)/10)+d[2];
}
function repTeilName(tl){
  var n = repName(tl.row), R = repRunden(tl.row);
  if(tl.von > 1 || tl.bis < R) n += " ("+(tl.von === tl.bis ? t("runde1Teil", { a:tl.von }) : t("rundenTeil", { a:tl.von, b:tl.bis }))+")";
  if(tl.f !== 1) n += " ("+t("halb")+")";
  return n;
}
function repQSchritte(q){
  var st = [];
  q.teile.forEach(function(tl){
    for(var r=tl.von-1; r<tl.bis; r++) tl.row[4].forEach(function(x){
      var m = x[1][r];
      if(m) st.push({ ex:x[0], m:repMengeMal(m, tl.f), r:r-(tl.von-1), R:tl.bis-tl.von+1, prog:q.einzel ? "" : repName(tl.row) });
    });
  });
  return st;
}
function repQWdh(q){ var n = 0; repQSchritte(q).forEach(function(x){ if(typeof x.m === "number") n += x.m; }); return n; }
function repQRunden(q){ var n = 0; q.teile.forEach(function(tl){ n += tl.bis - tl.von + 1; }); return n; }
function repQStange(q){ return q.teile.some(function(tl){ return repBrauchtStange(tl.row); }); }
function repBestOf(id){ var b = state.db.settings.repBest; return b && b[id] ? b[id] : null; }
function repWochen(id){ var b = repBestOf(id); return wochenWerte(b && b.log || [], true).slice(-16); }
/* Auf den Karten: was zu tun ist - je Übung die Menge über die Runden („21 · 15 · 9“, gleich bleibend „5 × 20“) */
function repPlanEin(m){ if(typeof m === "number") return String(m); var sek = repSek(m); return sek ? repUhr(sek*1000) : repMenge(m); }
function repPlanHTML(q){
  var zeilen = [];
  q.teile.forEach(function(tl){
    tl.row[4].forEach(function(x){
      var w = [];
      for(var r=tl.von-1; r<tl.bis; r++){ var m = x[1][r]; if(m) w.push(repMengeMal(m, tl.f)); }
      if(!w.length) return;
      var gleich = w.every(function(v){ return String(v) === String(w[0]); });
      var txt = w.length === 1 ? repPlanEin(w[0]) : gleich ? w.length+" × "+repPlanEin(w[0])
        : w.length > 6 ? w.slice(0, 5).map(repPlanEin).join(" · ")+" …" : w.map(repPlanEin).join(" · ");
      zeilen.push('<span class="rpl-ex">'+esc(repExName(x[0]))+'</span><span class="rpl-m">'+esc(txt)+'</span>');
    });
  });
  if(!zeilen.length) return "";
  var max = 6;
  if(zeilen.length > max) zeilen = zeilen.slice(0, max-1).concat(['<span class="rpl-mehr">'+esc(t("repMore", { n:zeilen.length-(max-1) }))+'</span>']);
  return '<div class="rep-plan">'+zeilen.join("")+'</div>';
}

/* ============ Aufwärmen & Dehnen ============
   Eigene Kachel, weil beides zu Workouts und Challenges passt. Oben Aufwärmen | Dehnen, darunter wie in der
   Bibliothek Workouts | Übungen. Aufwärmen: AUFWAERM_IDS bzw. AUFWAERM_UEBUNGEN, Dehnen: übrige Dehnprogramme
   bzw. alle Übungen der Hauptkategorie Stretch. Karten und Knöpfe wie in der Bibliothek. */
function renderWarmStretch(){
  var s = state.db.settings;
  var art = s.wsArt === "dehn" ? "dehn" : "warm", tab = s.wsTab === "uebungen" ? "uebungen" : "workouts";
  var liste;
  if(tab === "workouts"){
    var wos = art === "warm" ? AUFWAERM_IDS.map(findLibWorkout).filter(Boolean)
                             : LIB_WORKOUTS.filter(function(lw){ return lw.focus === "stretch" && AUFWAERM_IDS.indexOf(lw.id) < 0; });
    liste = wos.filter(function(lw){ return !libHidden("wo:"+lw.id); }).map(function(lw){
      var exs = lw.exercises.map(findExercise).filter(Boolean);
      return { lw:lw, exs:exs, dur:workoutDuration(libWorkoutRun(lw)) };
    }).sort(function(a, b){ return a.dur - b.dur; }).map(function(r){
      return libWoCard(r.lw, r.exs, false, r.dur, woMains(r.exs));
    }).join("");
  } else {
    var exs = art === "warm" ? AUFWAERM_UEBUNGEN.map(findExercise).filter(Boolean)
                             : EXERCISES.filter(function(ex){ return ex.main === "stretch"; });
    liste = exs.filter(function(ex){ return !libHidden("ex:"+ex.id); }).map(function(ex){ return libExCard(ex, false, exSubText(ex)); }).join("");
  }
  function knopf(attr, wert, aktiv, text){ return '<button data-'+attr+'="'+wert+'" class="'+(aktiv ? "active" : "")+'">'+esc(text)+'</button>'; }
  app.innerHTML =
    topbar(t("warmTitle"), { back:"#home" }) +
    '<div class="card lib-tabs-card"><div class="theme-pick lib-tabs seg-2">'+
      knopf("wsart", "warm", art === "warm", t("wsWarm"))+knopf("wsart", "dehn", art === "dehn", t("wsDehn"))+
    '</div><div class="theme-pick lib-tabs seg-2 unter-tabs">'+
      knopf("wstab", "workouts", tab === "workouts", t("tabWorkouts"))+knopf("wstab", "uebungen", tab === "uebungen", t("libExercises"))+
    '</div></div>'+
    '<div class="rep-intro">'+esc(t(art === "warm" ? "wsIntroWarm" : "wsIntroDehn"))+'</div>'+
    // Start-Knöpfe und Figuren in der Farbe des Bereichs (wie die Kachel auf der Startseite)
    (liste ? '<div style="--bereich:var(--ws-color)">'+liste+'</div>' : '<div class="empty">'+t("libEmpty")+'</div>') +
    '<div style="height:40px"></div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderWarmStretch(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  on("[data-wsart]", function(el){ s.wsArt = el.getAttribute("data-wsart"); save(); renderWarmStretch(); window.scrollTo(0, 0); });
  on("[data-wstab]", function(el){ s.wsTab = el.getAttribute("data-wstab"); save(); renderWarmStretch(); window.scrollTo(0, 0); });
  on("[data-cover]", function(el){ if(el.disabled) return; coverDraft = null; go("#cover/"+el.getAttribute("data-cover")); });
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  on("[data-womore]", function(el){
    var lw = findLibWorkout(el.getAttribute("data-womore"));
    if(!lw) return;
    openActionSheet(tplText(lw.name), [
      { ico:ICON_COPY, label:t("adoptMine"), fn:function(){ adoptLibWorkout(lw); } },
      { ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("wo:"+lw.id); showToast(t("hiddenToast")); neu(); } }
    ]);
  });
  on("[data-playex]", function(el){ go("#playex/"+el.getAttribute("data-playex")); });
  on("[data-exedit]", function(el){ go("#exedit/"+el.getAttribute("data-exedit")); });
  on("[data-info]", function(el){ openExInfo(el.getAttribute("data-info"), false, { onChange:neu }); });
  on("[data-exfav]", function(el){ toggleExFav(el.getAttribute("data-exfav")); neu(); });
  on("[data-exmore]", function(el){
    var ex = findExercise(el.getAttribute("data-exmore"));
    if(!ex) return;
    var acts = [];
    if(ex.custom) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go("#exedit/"+ex.id); } });
    if(EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false, { onChange:neu }); } });
    acts.push({ ico:ICON_TIMERBLOCK, label:t("adoptBlockTitle"), fn:function(){ adoptExercise(ex); showToast(t("adoptedBlock", { n:tplText(ex.name) })); } });
    acts.push({ ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("ex:"+ex.id); showToast(t("hiddenToast")); neu(); } });
    openActionSheet(tplText(ex.name), acts);
  });
  bindTrash(neu);
}

/* Liste: Reiter Einheiten (Stufe Leicht/Standard/Fortgeschritten) und Programme A–Z (Stufe 1-3), beide optional ohne Stange */
function renderReps(){
  function knopf(art, wert, text){
    return '<button type="button" data-repf="'+art+':'+wert+'" class="'+(String(repFilter[art])===String(wert) ? "active" : "")+'">'+esc(text)+'</button>';
  }
  function karte(id, name, zeile1, zeile2, plan){
    var best = repBestOf(id);
    return '<div class="list-item rep-karte" data-nav="#rep/'+id+'"><div class="meta"><div class="name">'+esc(name)+'</div>'+
      (zeile1 ? '<div class="sub rep-teile">'+zeile1+'</div>' : '')+'<div class="sub">'+zeile2+'</div>'+(plan || '')+'</div>'+
      (best ? wochenKurve(repWochen(id), "rep-spark")+'<span class="chip">'+repUhr(best.best)+'</span>' : '')+
      '<span class="chip chev">'+ICON_CHEV+'</span></div>';
  }
  var html = topbar(t("repTitle"), { back:"#home" }) +
    '<div class="card lib-tabs-card"><div class="theme-pick lib-tabs seg-3">'+
      '<button data-repf="tab:einheiten" class="'+(repFilter.tab==="einheiten"?"active":"")+'">'+esc(t("repTabUnits"))+'</button>'+
      '<button data-repf="tab:programme" class="'+(repFilter.tab==="programme"?"active":"")+'">'+esc(t("repTabProgs"))+'</button>'+
      '<button data-repf="tab:meine" class="'+(repFilter.tab==="meine"?"active":"")+'">'+esc(t("tabMine"))+'</button>'+
    '</div></div>';
  var liste = "";
  if(repFilter.tab === "einheiten"){
    var stufe = REP_STUFEN.indexOf(repFilter.stufe) > -1 ? repFilter.stufe : "standard";
    html += '<div class="rep-intro">'+esc(t("repUnitsIntro"))+'</div>'+
      '<div class="theme-pick rep-pick">'+knopf("stufe","leicht",t("stufe_leicht"))+knopf("stufe","standard",t("stufe_standard"))+knopf("stufe","fortgeschritten",t("stufe_fortgeschritten"))+'</div>';
    REP_EINHEITEN.forEach(function(e){
      var varianten = e[1 + REP_STUFEN.indexOf(stufe)];
      varianten.forEach(function(v, k){
        var q = repQuelle(e[0]+"-"+stufe+"-"+(k+1));
        if(!q || !q.teile.length) return;
        if(repFilter.bar === "none" && repQStange(q)) return;
        var R = repQRunden(q);
        liste += karte(q.id, repEinheitTitel(e[0], k+1, varianten.length),
          esc(q.teile.map(repTeilName).join(" + ")),
          esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+(repQStange(q) ? SEP+esc(t("repBar")) : ""),
          repPlanHTML(q));
      });
    });
  } else if(repFilter.tab === "meine"){
    html += '<div class="rep-intro">'+esc(t("repMineIntro"))+'</div>';
    (state.db.settings.myReps || []).forEach(function(c){
      var q = repQuelle(c.id);
      if(!q) return;
      var R = repQRunden(q);
      liste += karte(q.id, q.name, "", repQSchritte(q).length
        ? esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+(repQStange(q) ? SEP+esc(t("repBar")) : "")
        : esc(t("reNoEx")), repPlanHTML(q));
    });
    liste = (liste || '<div class="empty" style="padding:24px 20px 4px;">'+esc(t("repMineEmpty"))+'</div>')+
      '<div style="text-align:center"><button type="button" class="btn btn-primary empty-btn" data-repnew>'+ICON_PLUS+' '+esc(t("repNew"))+'</button></div>';
  } else {
    html += '<div class="rep-intro">'+esc(t("repIntro"))+'</div>'+
      '<div class="theme-pick rep-pick">'+knopf("lvl","all",t("repAll"))+knopf("lvl",1,t("lvl1"))+knopf("lvl",2,t("lvl2"))+knopf("lvl",3,t("lvl3"))+'</div>';
    REP_WORKOUT_ROWS.filter(function(r){
      if(repFilter.lvl !== "all" && r[3] !== +repFilter.lvl) return false;
      if(repFilter.bar === "none" && repBrauchtStange(r)) return false;
      return true;
    }).map(function(r, i){ return { r:r, i:i }; }).sort(function(a, b){ return a.r[3] - b.r[3] || a.i - b.i; }).forEach(function(o){
      var r = o.r, R = repRunden(r);
      liste += karte(r[0], repName(r), "",
        esc(t("lvl"+r[3]))+SEP+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repWdh(r) }))+(repBrauchtStange(r) ? SEP+esc(t("repBar")) : ""),
        repPlanHTML(repQuelle(r[0])));
    });
  }
  html += (repFilter.tab === "meine" ? '' : '<div class="theme-pick rep-pick zwei">'+knopf("bar","all",t("repAllEquip"))+knopf("bar","none",t("repNoBar"))+'</div>') +
    (liste || '<div class="empty">'+esc(t("repNone"))+'</div>') + '<div style="height:40px"></div>';
  app.innerHTML = html;
  bindCommon();
  var neuBtn = app.querySelector("[data-repnew]");
  if(neuBtn) neuBtn.addEventListener("click", function(){
    var c = { id:"my-"+uid(), name:t("reDefaultName"), runden:3, zeilen:[], updatedAt:Date.now() };
    (state.db.settings.myReps || (state.db.settings.myReps = [])).push(c);
    save();
    go("#repedit/"+c.id);
  });
  app.querySelectorAll("[data-repf]").forEach(function(b){
    b.addEventListener("click", function(){
      var p = b.getAttribute("data-repf").split(":");
      repFilter[p[0]] = p[1];
      renderReps();
    });
  });
}

/* Detail: je Programm eine Tabelle Übungen × Runden, Bestzeit, Start */
function renderRepDetail(id){
  var q = repQuelle(id);
  if(!q) return go("#reps");
  var R = repQRunden(q), best = repBestOf(id);
  function tabelle(tl){
    var runden = [];
    for(var r=tl.von; r<=tl.bis; r++) runden.push(r);
    var kopf = '<tr><th></th>'+runden.map(function(r){ return '<th>'+r+'</th>'; }).join("")+'</tr>';
    var zeilen = tl.row[4].filter(function(x){ return runden.some(function(r){ return x[1][r-1]; }); }).map(function(x){
      var bild = repIllu(x[0]) ? illuStillHTML(repIllu(x[0]), "") : "";
      return '<tr><td class="rep-ex"><div class="rep-ex-in">'+(bild || '<span class="rep-leer"></span>')+'<span>'+esc(repExName(x[0]))+'</span></div></td>'+
        runden.map(function(r){ var m = x[1][r-1]; return '<td>'+(m ? esc(repMenge(repMengeMal(m, tl.f))) : '–')+'</td>'; }).join("")+'</tr>';
    }).join("");
    return '<div class="card"><div class="rep-tab-wrap"><table class="rep-tab">'+kopf+zeilen+'</table></div></div>';
  }
  var schritte = repQSchritte(q).length;
  app.innerHTML =
    topbar(q.name, { back:"#reps", right: q.eigen ? '<button class="iconbtn" data-nav="#repedit/'+id+'" title="'+esc(t("edit"))+'" aria-label="'+esc(t("edit"))+'">'+svgIcon(ICON_EDIT)+'</button>' : '' }) +
    '<div class="rep-meta">'+(q.einzel && !q.eigen ? esc(t("lvl"+q.lvl))+SEP : '')+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+
      (repQStange(q) ? SEP+esc(t("repBar")) : "")+
      (best ? SEP+esc(t("repBestIs", { z:repUhr(best.best) }))+(best.n > 1 ? ', '+esc(t("repLastIs", { z:repUhr(best.last) })) : '') : '')+'</div>'+
    statsLeisteHTML("data-repstats", best ? t("repStatsKurz", { z:repUhr(best.best), n:best.n }) : t("repStatsNone"), repWochen(id), "var(--rep-color)")+
    q.teile.map(function(tl, i){
      return '<div class="section-title">'+esc(q.einzel ? t("repTable") : (i+1)+". "+repTeilName(tl))+'</div>'+tabelle(tl);
    }).join("")+
    '<div class="rep-intro">'+esc(t("repHint"))+'</div>'+
    (schritte ? '' : '<div class="empty">'+esc(t("reLeer"))+'</div>')+
    '<button type="button" class="btn btn-primary" data-repstart'+(schritte ? '' : ' disabled')+'>'+ICON_PLAY+' '+esc(t("repStart"))+'</button>'+
    (q.eigen ? '<button type="button" class="btn btn-secondary" data-nav="#repedit/'+id+'" style="margin-top:10px;">'+svgIcon(ICON_EDIT)+' '+esc(t("edit"))+'</button>' : '');
  bindCommon();
  app.querySelector("[data-repstart]").addEventListener("click", function(){ repRun = null; go("#repplay/"+id); });
  app.querySelector("[data-repstats]").addEventListener("click", function(){ openRepStats(id, q.name); });
}

/* Eigene Challenge bearbeiten: Name, Runden, je Übung Wiederholungen oder Sekunden pro Runde. Speichert sofort. */
var RE_HALTEN = ["plank","side-plank","wall-sit","dead-hang","l-sit","hanging-l-sit","support-hold","squat-hold","hollow-hold","superman-hold","farmer-carry","front-rack-carry","pause","lauf","sprint"];
function renderRepEdit(id){
  var c = myRep(id);
  if(!c) return go("#reps");
  var R = c.runden;
  var zeilen = c.zeilen.map(function(z, i){
    var bild = repIllu(z.ex) ? illuStillHTML(repIllu(z.ex), "") : "";
    var felder = "";
    for(var r=0; r<R; r++) felder += '<div class="re-feld"><span>'+esc(t("repRound"))+' '+(r+1)+'</span>'+
      '<input type="number" inputmode="numeric" min="0" max="9999" data-rem="'+i+':'+r+'" value="'+(+z.m[r] || 0)+'" aria-label="'+esc(repExName(z.ex)+", "+t("repRound")+" "+(r+1))+'"></div>';
    return '<div class="card re-zeile">'+
      '<div class="re-kopf"><div class="rep-ex-in">'+(bild || '<span class="rep-leer"></span>')+'<b>'+esc(repExName(z.ex))+'</b></div>'+
        '<button type="button" class="dz-btn" data-rerm="'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></div>'+
      '<div class="seg-row re-art">'+["wdh", "sek"].map(function(a){
        return '<button type="button" class="'+(z.art===a ? 'active' : '')+'" data-reart="'+i+':'+a+'">'+esc(t(a==="wdh" ? "reWdh" : "reSek"))+'</button>'; }).join("")+'</div>'+
      '<div class="re-felder">'+felder+'</div></div>';
  }).join("");
  app.innerHTML =
    topbar(t("reTitle"), { back:"#reps" }) +
    '<div class="card"><label for="re-name">'+t("name")+'</label><input type="text" id="re-name" value="'+esc(c.name)+'" maxlength="40">'+
      '<label>'+t("reRunden")+'</label>'+stepperHTML("re-runden", R, 1, 10, 1)+'</div>'+
    '<div class="section-title">'+t("reUebungen")+'</div>'+
    (zeilen || '<div class="empty" style="padding:16px 20px;">'+esc(t("reLeer"))+'</div>')+
    '<button type="button" class="my-new" data-readd>'+ICON_PLUS+' '+t("myAdd")+'</button>'+
    '<div class="tm-hint" style="margin:10px 4px 16px;">'+esc(t("reHint"))+'</div>'+
    '<button type="button" class="btn btn-primary" data-refertig>'+esc(t("reFertig"))+'</button>'+
    '<button type="button" class="btn btn-danger" data-redel style="margin-top:10px;">'+ICON_TRASH+' '+esc(t("reDelete"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function speichern(){ c.updatedAt = Date.now(); save(); }
  function neu(){ var y = window.scrollY; renderRepEdit(id); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(){ fn(el); }); }); }
  var nameIn = app.querySelector("#re-name");
  nameIn.addEventListener("input", function(){ c.name = nameIn.value.trim() || t("reDefaultName"); speichern(); });
  bindSteppers(app, function(){
    var n = clamp(parseInt(app.querySelector("#re-runden").value) || 1, 1, 10);
    if(n === c.runden) return;
    c.runden = n;
    c.zeilen.forEach(function(z){ while(z.m.length < n) z.m.push(z.m.length ? z.m[z.m.length-1] : (z.art === "sek" ? 30 : 10)); });
    speichern(); neu();
  });
  app.querySelectorAll("[data-rem]").forEach(function(inp){
    inp.addEventListener("focus", function(){ inp.select(); });
    inp.addEventListener("change", function(){
      var p = inp.getAttribute("data-rem").split(":"), z = c.zeilen[+p[0]], r = +p[1];
      var v = clamp(parseInt(inp.value) || 0, 0, 9999), alt = +z.m[r] || 0;
      inp.value = v;
      z.m[r] = v;
      // Runde 1 geändert: die folgenden Runden, die noch den alten Wert hatten, ziehen mit
      if(r === 0) for(var k=1; k<c.runden; k++) if((+z.m[k] || 0) === alt){
        z.m[k] = v;
        var f = app.querySelector('[data-rem="'+p[0]+':'+k+'"]');
        if(f) f.value = v;
      }
      speichern();
    });
  });
  on("[data-reart]", function(el){ var p = el.getAttribute("data-reart").split(":"); c.zeilen[+p[0]].art = p[1]; speichern(); neu(); });
  on("[data-rerm]", function(el){ c.zeilen.splice(+el.getAttribute("data-rerm"), 1); speichern(); neu(); });
  on("[data-readd]", function(){
    repExPicker(function(ex){
      var sek = RE_HALTEN.indexOf(ex) > -1, m = [];
      for(var r=0; r<c.runden; r++) m.push(sek ? 30 : 10);
      c.zeilen.push({ ex:ex, art:sek ? "sek" : "wdh", m:m });
      speichern(); neu();
    });
  });
  // Fertig: zur Übersicht der Challenge, ohne den Editor im Zurück-Verlauf zu lassen
  on("[data-refertig]", function(){ navStack.pop(); go("#rep/"+id); });
  on("[data-redel]", function(){
    confirmSheet(t("reDelQ"), "„"+(c.name || t("reDefaultName"))+"“ – "+t("cantUndo"), t("del"), function(){
      state.db.settings.myReps = (state.db.settings.myReps || []).filter(function(x){ return x.id !== id; });
      if(state.db.settings.repBest) delete state.db.settings.repBest[id];
      save();
      navStack = navStack.filter(function(h){ return h.indexOf(id) < 0; });
      go("#reps");
    });
  });
}
/* Auswahl einer Übung (mit Suche): Laufen, Sprint, Pause und alle Übungen außer Dehnen */
function repExPicker(onPick){
  var root = document.getElementById("overlayRoot");
  var ex = EXERCISES.filter(function(e){ return e.main !== "stretch" && !libHidden("ex:"+e.id); }).map(function(e){
    return { id:e.id, name:tplText(e.name), q:exSearchText(e) };
  }).sort(function(a, b){ return a.name.localeCompare(b.name, currentLang()); });
  var liste = Object.keys(REP_PSEUDO).map(function(k){ var n = tplText(REP_PSEUDO[k]); return { id:k, name:n, q:n.toLowerCase() }; }).concat(ex);
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet re-pick" role="dialog" aria-label="'+esc(t("myAdd"))+'">'+
    '<h3>'+esc(t("myAdd"))+'</h3>'+searchHTML("", "re", t("searchPh"))+
    '<div class="re-pick-liste"><div class="fig-grid">'+liste.map(function(o){
      var e = findExercise(o.id);
      return uebKachel({ bild:repIllu(o.id), name:o.name, attr:'data-repick="'+o.id+'"', q:o.q, cat:e ? catVar(e.cats[0]) : "" });
    }).join("")+'</div><div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div></div>'+
    '<button class="btn btn-secondary" data-reclose>'+t("cancel")+'</button>'+
  '</div></div>';
  function close(){ root.innerHTML = ""; }
  var box = root.querySelector(".re-pick-liste"), q = root.querySelector("#re-q");
  q.addEventListener("input", function(){ applySearch(box, q.value); });
  kachelKlick(root, "[data-repick]", function(b){ var id = b.getAttribute("data-repick"); close(); onPick(id); });
  root.querySelector("[data-reclose]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}

/* Ablauf: vor dem Start -> (Einzählen) -> Schritt für Schritt mit „Geschafft“ -> Ergebnis.
   Die Zeit wird aus Zeitstempeln berechnet, stimmt also auch nach dem Wechsel in eine andere App. */
function repVerstrichen(){
  var r = repRun;
  if(!r || !r.start) return 0;
  return (r.ende || r.pauseAb || Date.now()) - r.start - r.pausenMs;
}
function renderRepPlayer(id){
  var q = repQuelle(id);
  if(!q) return go("#reps");
  if(!repQSchritte(q).length) return go("#rep/"+id);   // eigene Challenge ohne Übungen
  if(!repRun || repRun.id !== id){
    repStop();
    repRun = { id:id, q:q, steps:repQSchritte(q), i:-1, start:0, pausenMs:0, pauseAb:0, ende:0, zaehlt:0, stepEnde:0, uhr:null, zaehler:null };
  }
  repZeichnen();
}
function repStepStarten(){
  var r = repRun, st = r.steps[r.i], sek = st ? repSek(st.m) : 0;
  r.stepEnde = sek ? Date.now() + sek*1000 : 0;
}
function repLos(){
  var r = repRun;
  r.zaehlt = 0;
  r.start = Date.now();
  r.i = 0;
  repStepStarten();
  phaseBeep("work");
  requestWakeLock();
  r.uhr = setInterval(repTick, 200);
  repZeichnen();
}
function repStarten(){
  var r = repRun;
  if(!state.db.settings.countIn){ repLos(); return; }
  r.zaehlt = 3;
  phaseBeep("tick");
  repZeichnen();
  r.zaehler = setInterval(function(){
    if(!repRun || repRun !== r){ clearInterval(r.zaehler); return; }
    r.zaehlt--;
    if(r.zaehlt <= 0){ clearInterval(r.zaehler); r.zaehler = null; repLos(); return; }
    phaseBeep("tick");
    repZeichnen();
  }, 1000);
}
function repTick(){
  var r = repRun;
  if(!r || r.ende) return;
  var uhr = document.getElementById("rp-uhr");
  if(uhr) uhr.textContent = repUhr(repVerstrichen());
  if(r.pauseAb || !r.stepEnde) return;
  var rest = r.stepEnde - Date.now();
  var cd = document.getElementById("rp-countdown");
  if(cd) cd.textContent = repUhr(rest + 999);
  if(rest <= 0){
    phaseBeep("work");
    if(state.db.settings.vibration && navigator.vibrate) navigator.vibrate(120);
    repWeiter();
  }
}
function repWeiter(){
  var r = repRun;
  if(!r || r.ende || r.pauseAb) return;
  r.i++;
  if(r.i >= r.steps.length){ repFertig(); return; }
  repStepStarten();
  repZeichnen();
}
function repZurueck(){
  var r = repRun;
  if(!r || r.ende || r.i <= 0) return;
  r.i--;
  repStepStarten();
  if(r.pauseAb && r.stepEnde) r.stepEnde += Date.now() - r.pauseAb;   // Countdown steht während der Pause
  repZeichnen();
}
function repPause(){
  var r = repRun;
  if(!r || !r.start || r.ende) return;
  var jetzt = Date.now();
  if(r.pauseAb){
    r.pausenMs += jetzt - r.pauseAb;
    if(r.stepEnde) r.stepEnde += jetzt - r.pauseAb;
    r.pauseAb = 0;
    requestWakeLock();
  } else {
    r.pauseAb = jetzt;
  }
  repZeichnen();
}
function repFertig(){
  var r = repRun;
  r.ende = Date.now();
  clearInterval(r.uhr); r.uhr = null;
  var zeit = repVerstrichen();
  var alle = state.db.settings.repBest || (state.db.settings.repBest = {});
  var alt = alle[r.id];
  r.neueBest = !!alt && zeit < alt.best;
  var rlog = alt && alt.log ? alt.log.slice(-59) : (alt ? [[alt.at || Date.now(), alt.last]] : []);   // ältere Stände: wenigstens die letzte Zeit
  rlog.push([Date.now(), zeit]);
  alle[r.id] = { best: alt ? Math.min(alt.best, zeit) : zeit, last: zeit, n: (alt ? alt.n : 0) + 1, at: Date.now(), log: rlog };
  // für die Wochenzeile und „Überrasch mich“ (Übungen der letzten Tage)
  pruneHistory(state.db);
  state.db.history.push({ at:Date.now(), dur:Math.round(zeit/1000),
    ex:r.steps.map(function(x){ return x.ex; }).filter(function(id, i, a){ return !REP_PSEUDO[id] && a.indexOf(id) === i; }) });
  save();
  phaseBeep("done");
  releaseWakeLock();
  repZeichnen();
}
function repStop(){
  if(!repRun) return;
  clearInterval(repRun.uhr); clearInterval(repRun.zaehler);
  repRun = null;
  releaseWakeLock();
}
function repBeenden(){
  var r = repRun;
  function raus(){ repStop(); goBack("#reps"); }
  if(r && r.start && !r.ende) confirmSheet(t("repEndQ"), t("repEndText"), t("repEndBtn"), raus);
  else raus();
}
function repZeichnen(){
  var r = repRun;
  if(!r) return;
  var n = r.steps.length;
  var html = topbar(r.q.name, { back:"#reps" });
  if(r.ende){
    var best = repBestOf(r.id);
    html += '<div class="rp-karte" style="margin-top:8px;"><div class="rp-name">'+esc(t("repFinish"))+'</div>'+
      '<div class="rp-uhr">'+repUhr(repVerstrichen())+'</div>'+
      (r.neueBest ? '<div class="rp-best">'+esc(t("repNewBest"))+'</div>' :
        (best && best.n > 1 ? '<div class="rp-sub">'+esc(t("repBestIs", { z:repUhr(best.best) }))+'</div>' : ''))+'</div>'+
      '<div class="rp-leiste"><button type="button" class="btn btn-secondary" data-repagain>'+ICON_RESTART+' '+esc(t("repAgain"))+'</button>'+
      '<button type="button" class="btn btn-primary" data-repend>'+esc(t("repToList"))+'</button></div>';
  } else {
    var i = Math.max(0, r.i), st = r.steps[i], nx = r.steps[i+1];
    var sek = repSek(st.m), illu = repIllu(st.ex);
    var menge = r.i >= 0 && sek ? '<span id="rp-countdown">'+repUhr(Math.max(0, r.stepEnde - (r.pauseAb || Date.now())) + 999)+'</span>' : esc(repMenge(st.m));
    var laeuft = r.i >= 0;
    var goText = !laeuft ? (r.zaehlt ? String(r.zaehlt) : t("repStart")) : r.pauseAb ? t("repResume") : sek ? t("repSkip") : t("repDone");
    html +=
      '<div class="rp-uhr" id="rp-uhr">'+repUhr(repVerstrichen())+'</div>'+
      '<div class="rp-runde">'+(laeuft ? esc((st.prog ? st.prog+" · " : "")+t("repRound")+" "+(st.r+1)+" / "+st.R) : esc(r.zaehlt ? t("repReady") : t("repHint")))+'</div>'+
      '<div class="rp-fort"><i style="width:'+Math.round((laeuft ? r.i : 0)/n*100)+'%"></i></div>'+
      '<div class="rp-karte">'+(illu ? illuHTML(illu, "") : '<div class="rp-leer"></div>')+
        '<div class="rp-menge">'+menge+'</div><div class="rp-name">'+esc(repExName(st.ex))+'</div></div>'+
      '<div class="rp-next">'+esc(nx ? t("repNext", { x:repExName(nx.ex)+" "+repMenge(nx.m) }) : t("repLastStep"))+'</div>'+
      '<button type="button" class="btn btn-primary rp-go" data-repgo'+(r.zaehlt ? ' disabled' : '')+'>'+esc(goText)+'</button>'+
      '<div class="rp-leiste">'+
        '<button type="button" class="btn btn-secondary" data-repback'+(laeuft && r.i > 0 ? '' : ' disabled')+'>'+esc(t("repUndo"))+'</button>'+
        '<button type="button" class="btn btn-secondary" data-reppause'+(laeuft ? '' : ' disabled')+'>'+esc(r.pauseAb ? t("repResume") : t("repPause"))+'</button>'+
        '<button type="button" class="btn btn-secondary" data-repend>'+esc(t("repEnd"))+'</button>'+
      '</div>';
  }
  app.innerHTML = html;
  // eigener Zurück-Knopf: läuft die Uhr, erst nachfragen
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", repBeenden); }
  bindCommon();
  function an(sel, fn){ var el = app.querySelector(sel); if(el) el.addEventListener("click", fn); }
  an("[data-repgo]", function(){
    if(r.i < 0){ if(!r.zaehlt) repStarten(); return; }
    if(r.pauseAb) repPause(); else repWeiter();
  });
  an("[data-repback]", repZurueck);
  an("[data-reppause]", repPause);
  an("[data-repend]", function(){ if(r.ende){ repStop(); goBack("#reps"); } else repBeenden(); });
  an("[data-repagain]", function(){ var id = r.id; repStop(); renderRepPlayer(id); });
}
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState === "visible" && repRun && repRun.start && !repRun.ende && !repRun.pauseAb) requestWakeLock();
});

/* ============ Figuren prüfen ============
   Alle Übungen mit Figur, nach Hauptkategorie. Tippen öffnet die Übungsinfo (bewegt, ggf. zweite Ansicht).
   „Unklar“ markiert eine Figur, optional mit Notiz: settings.figurNotiz = { Übungs-ID: "Notiz" }.
   „Markierte teilen“ gibt die Liste als Text weiter (Teilen-Menü, sonst Zwischenablage). */
var figNurMarkierte = false;
function renderFiguren(){
  var s = state.db.settings, notiz = s.figurNotiz || (s.figurNotiz = {});
  var n = Object.keys(notiz).length;
  if(!n) figNurMarkierte = false;
  var html = "";
  MAIN_CATS.forEach(function(c){
    var exs = EXERCISES.filter(function(ex){ return ex.main === c.id && ILLU[ex.id] && (!figNurMarkierte || ex.id in notiz); });
    if(!exs.length) return;
    html += '<div class="section-title">'+esc(tplText(c))+' <span class="lbl-hint">'+exs.length+'</span></div><div class="fig-grid">'+
      exs.map(function(ex){
        var an = ex.id in notiz;
        return '<div class="fig-karte'+(an ? ' an' : '')+'" style="--cat:var(--tp-color)">'+
          '<button type="button" class="fig-bild" data-figinfo="'+ex.id+'" aria-label="'+esc(tplText(ex.name))+'">'+illuStillHTML(ex.id, "fig-illu")+
            (ILLU2[ex.id] ? '<span class="fig-2" aria-hidden="true">2</span>' : '')+'</button>'+
          '<div class="fig-name">'+esc(tplText(ex.name))+'</div>'+
          '<button type="button" class="fig-flag'+(an ? ' an' : '')+'" data-figflag="'+ex.id+'" aria-pressed="'+an+'">'+(an ? '⚑ ' : '')+esc(t("figFlag"))+'</button>'+
          (an ? '<input type="text" class="fig-notiz" data-fignotiz="'+ex.id+'" value="'+esc(notiz[ex.id] || "")+'" placeholder="'+esc(t("figNotePh"))+'" maxlength="140">' : '')+
        '</div>';
      }).join("")+'</div>';
  });
  app.innerHTML =
    topbar(t("figTitle"), { back:"#settings" }) +
    '<div class="rep-intro">'+esc(t("figIntro"))+'</div>'+
    '<div class="theme-pick rep-pick zwei"><button type="button" class="'+(figNurMarkierte ? '' : 'active')+'" data-figfilter="alle">'+esc(t("figAll"))+'</button>'+
      '<button type="button" class="'+(figNurMarkierte ? 'active' : '')+'" data-figfilter="markiert"'+(n ? '' : ' disabled')+'>'+esc(t("figMarked", { n:n }))+'</button></div>'+
    (html || '<div class="empty">'+esc(t("figNone"))+'</div>')+
    '<div style="height:90px"></div>'+
    '<div class="fig-leiste"><button type="button" class="btn btn-primary" data-figshare'+(n ? '' : ' disabled')+'>'+ICON_SHARE+' '+esc(t("figShare", { n:n }))+'</button></div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderFiguren(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-figinfo]").forEach(function(b){ b.addEventListener("click", function(){ openExInfo(b.getAttribute("data-figinfo"), false); }); });
  app.querySelectorAll("[data-figflag]").forEach(function(b){ b.addEventListener("click", function(){
    var id = b.getAttribute("data-figflag");
    if(id in notiz) delete notiz[id]; else notiz[id] = "";
    save(); neu();
    if(id in notiz){ var f = app.querySelector('[data-fignotiz="'+id+'"]'); if(f) f.focus(); }
  }); });
  app.querySelectorAll("[data-fignotiz]").forEach(function(f){ f.addEventListener("input", function(){ notiz[f.getAttribute("data-fignotiz")] = f.value.trim(); save(); }); });
  app.querySelectorAll("[data-figfilter]").forEach(function(b){ b.addEventListener("click", function(){ figNurMarkierte = b.getAttribute("data-figfilter") === "markiert"; renderFiguren(); window.scrollTo(0, 0); }); });
  var teilen = app.querySelector("[data-figshare]");
  teilen.addEventListener("click", function(){
    var zeilen = Object.keys(notiz).map(function(id){ var ex = findExercise(id); return "- "+(ex ? tplText(ex.name) : id)+" ("+id+")"+(notiz[id] ? ": "+notiz[id] : ""); });
    var text = t("figShareHead")+"\n"+zeilen.join("\n");
    if(navigator.share) navigator.share({ title:t("figShareHead"), text:text }).catch(function(e){ if(!e || e.name !== "AbortError") copyText(text, t("figCopied")); });
    else copyText(text, t("figCopied"));
  });
}

/* Adresse der App ohne # und Parameter - die Seite, die man weitergeben kann */
/* Als Datei geöffnet (file://) gibt es keine teilbare Adresse - dann die veröffentlichte App */
var APP_PUBLIC_URL = "https://kevinhbrck.github.io/BLOC/";
/* Versionsnummer steht nur in sw.js: die App fragt den Service Worker danach und zeigt sie unten in den
   Einstellungen. Keine Antwort (als Datei geöffnet, Service Worker noch nicht aktiv): Zeile bleibt leer. */
var appFassung = "";
function fassungZeigen(){
  var el = document.getElementById("app-version");
  if(!el) return;
  if(appFassung){ el.textContent = "Version "+appFassung; return; }
  var sw = navigator.serviceWorker && navigator.serviceWorker.controller;
  if(!sw || !window.MessageChannel) return;
  var kanal = new MessageChannel();
  kanal.port1.onmessage = function(e){
    if(!e.data || !e.data.fassung) return;
    appFassung = String(e.data.fassung);
    var ziel = document.getElementById("app-version");
    if(ziel) ziel.textContent = "Version "+appFassung;
  };
  try{ sw.postMessage({ frage:"fassung" }, [kanal.port2]); }catch(e){}
}
function appUrl(){
  if(!/^https?:$/.test(location.protocol)) return APP_PUBLIC_URL;
  return location.origin + location.pathname.replace(/index\.html$/, "");
}
/* Einstellungen: oben offen, was man regelmäßig braucht („Wichtig“), darunter thematisch gruppiert und zugeklappt („Mehr“).
   Aufgeklappte Gruppen bleiben offen, solange man auf der Seite bleibt (die Seite zeichnet sich bei jeder Änderung neu). */
var einstOffen = {};
function einstMehr(key, titel, unter, inhalt, ico){
  return '<details class="opt-mehr" data-mehr="'+key+'"'+(einstOffen[key] ? ' open' : '')+'>'+
    '<summary>'+(ico ? '<span class="om-ico">'+svgIcon(ico)+'</span>' : '')+
      '<span class="meta"><span class="name">'+esc(titel)+'</span><span class="sub">'+esc(unter)+'</span></span>'+
      '<span class="om-chev">'+ICON_CHEV+'</span></summary>'+
    '<div class="om-inhalt">'+inhalt+'</div></details>';
}
function renderSettings(){
  var s = state.db.settings;
  function zeile(attr, name, sub){
    return '<div class="list-item" '+attr+'>'+
      '<div class="meta"><div class="name">'+name+'</div><div class="sub">'+sub+'</div></div>'+
      '<span class="chip chev">'+ICON_CHEV+'</span></div>';
  }
  app.innerHTML =
    topbar(t("settings"), { back:"#home" }) +
    '<div class="section-title">'+t("optWichtig")+'</div>'+
    '<div class="card"><div class="opt-label">'+t("appearance")+'</div><div class="theme-pick">'+
      themeBtn("system",t("thSystem"))+themeBtn("light",t("thLight"))+themeBtn("dark",t("thDark"))+
      themeBtn("nacht",t("thNacht"),"halb")+themeBtn("kodak",t("thKodak"),"vintage halb")+
    '</div>'+
    '<div style="font-size:12px;color:var(--text-dim);margin-top:10px;">'+t("themeInfo")+'</div>'+
    '</div>'+
    '<div class="card"><div class="opt-label">'+t("optTraining")+'</div>'+
      '<div class="range-row"><div class="label">'+t("volume")+' <span id="f-volume-label">'+Math.round(s.volume*100)+'%</span></div>'+
      '<input type="range" id="f-volume" min="0" max="100" step="5" value="'+Math.round(s.volume*100)+'">'+
      '<div class="range-scale"><span>0</span><span>100</span></div>'+
      '<div class="range-hint">'+t("volMusicHint")+'</div></div>'+
      toggleRow("f-voice",t("voice"), t("voiceDesc"), s.voice !== false)+
    '</div>'+
    '<div class="card"><div class="opt-label">'+t("data")+'</div>'+
      '<div class="snap-zeile" id="snap-zeile">'+snapZeileHTML()+'</div>'+
      (kannBackupTeilen() ? '<button class="btn btn-secondary" data-sharebackup>'+ICON_SHARE+' '+t("shareBackup")+'</button>' : '')+
      '<button class="btn btn-secondary" data-export>'+t("exportBackup")+'</button>'+
      '<button class="btn btn-secondary" data-import>'+t("importBackup")+'</button>'+
      '<input type="file" id="import-file" style="display:none">'+
    '</div>'+
    '<div class="section-title">'+t("optMehr")+'</div>'+
    einstMehr("timer", t("mehrTimer"), t("mehrTimerSub"),
      toggleRow("f-sound",t("sound"), t("soundDesc"), s.sound)+
      '<div class="range-row" data-opensounds style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;">'+
        '<div><div class="label" style="margin:0 0 2px;">'+t("soundStyle")+'</div><div style="font-size:13px;color:var(--text-dim);">'+esc(soundLabel(s.soundStyle))+'</div></div>'+
        '<span class="chip chev">'+ICON_CHEV+'</span>'+
      '</div>'+
      toggleRow("f-space",t("space"), t("spaceDesc"), s.space)+
      toggleRow("f-countin",t("countIn"), t("countInDesc"), s.countIn)+
      toggleRow("f-vibration",t("vibration"), t("vibrationDesc"), s.vibration)+
      toggleRow("f-keepawake",t("keepAwake"), t("keepAwakeDesc"), s.keepAwake), HOME_ICON.intervall)+
    einstMehr("sprache", t("language"), currentLang() === "en" ? "English" : "Deutsch",
      '<div class="theme-pick lang-pick">'+langBtn("de","Deutsch")+langBtn("en","English")+'</div>',
      '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>')+
    einstMehr("app", t("mehrApp"), t("mehrAppSub"),
      zeile('data-intro role="button" tabindex="0"', t("introRow"), t("introRowSub"))+
      zeile('data-nav="#install"', t("installRow"), t("installRowSub"))+
      '<div class="opt-label" style="margin-top:6px">'+t("shareTitle")+'</div>'+
      '<div class="share-card"><div class="share-url" id="share-url">'+esc(appUrl())+'</div>'+
      '<button type="button" class="btn btn-secondary" data-sharecopy>'+t("shareCopy")+'</button></div>',
      '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>')+
    '<div class="list-item" data-nav="#figuren"><div class="meta"><div class="name">'+esc(t("figTitle"))+'</div>'+
      '<div class="sub">'+esc(t("figSub"))+'</div></div><span class="chip chev">'+ICON_CHEV+'</span></div>'+
    '<a class="list-item" href="privacy.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">'+
      '<div class="meta"><div class="name">'+t("privacyRow")+'</div>'+
      '<div class="sub">'+t("privacyRowSub")+'</div></div>'+
      '<span class="chip chev">'+ICON_CHEV+'</span>'+
    '</a>'+
    einstMehr("loeschen", t("deleteAll"), t("mehrLoeschenSub"),
      '<button class="btn btn-danger" data-reset>'+t("deleteAll")+'</button>', '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/>')+
    '<div class="empty" style="padding:20px 8px;">'+t("localNote")+'<br><small class="app-version" id="app-version"></small></div>';
  app.querySelectorAll("details[data-mehr]").forEach(function(d){
    d.addEventListener("toggle", function(){ einstOffen[d.getAttribute("data-mehr")] = d.open; });
  });

  bindCommon();

  function themeBtn(val, label, cls){
    var classes = (cls||"") + (s.theme===val ? " active" : "");
    return '<button data-theme="'+val+'" class="'+classes.trim()+'">'+label+'</button>';
  }
  function langBtn(val, label){
    return '<button data-lang="'+val+'" class="'+(currentLang()===val ? "active" : "")+'">'+label+'</button>';
  }
  app.querySelectorAll("[data-theme]").forEach(function(btn){
    btn.addEventListener("click", function(){
      s.theme = btn.getAttribute("data-theme");
      save(); applyTheme(); renderSettings();
    });
  });
  app.querySelectorAll("[data-lang]").forEach(function(btn){
    btn.addEventListener("click", function(){
      s.lang = btn.getAttribute("data-lang");
      save(); applyLang(); renderSettings();
    });
  });

  /* App teilen: Link kopieren, per WhatsApp oder über das Teilen-Menü des Handys */
  app.querySelector("[data-sharecopy]").addEventListener("click", function(){ copyText(appUrl(), t("shareCopied")); });
  app.querySelector("[data-intro]").addEventListener("click", openIntro);
  app.querySelector("[data-opensounds]").addEventListener("click", function(){
    openSoundSheet(function(){ renderSettings(); });
  });

  bindToggle("f-sound", function(v){ s.sound=v; save(); });
  bindToggle("f-space", function(v){ s.space=v; save(); applySpace(); phaseBeep("work"); });
  bindToggle("f-countin", function(v){ s.countIn=v; save(); });
  bindToggle("f-vibration", function(v){ s.vibration=v; save(); });
  bindToggle("f-keepawake", function(v){ s.keepAwake=v; save(); });
  bindToggle("f-voice", function(v){ s.voice=v; save(); });

  var volEl = app.querySelector("#f-volume");
  var volLabel = app.querySelector("#f-volume-label");
  volEl.addEventListener("input", function(){
    s.volume = parseInt(volEl.value)/100;
    volLabel.textContent = volEl.value+"%";
    save();
  });
  volEl.addEventListener("change", function(){
    phaseBeep("work");
  });

  app.querySelector("[data-export]").addEventListener("click", exportBackup);
  var teilBtn = app.querySelector("[data-sharebackup]");
  if(teilBtn) teilBtn.addEventListener("click", function(){ shareBackup(); });
  bindSnapZeile();
  fassungZeigen();
  app.querySelector("[data-import]").addEventListener("click", function(){
    app.querySelector("#import-file").click();
  });
  app.querySelector("#import-file").addEventListener("change", function(ev){
    var file = ev.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      try{
        var parsed = JSON.parse(reader.result);
        // nur echte BLOC-Sicherungen (z. B. nicht versehentlich die Sicherung des Vokabelkastens) - sonst wäre alles weg
        var istBloc = parsed && typeof parsed === "object" && !Array.isArray(parsed.cards) &&
          (Array.isArray(parsed.blocks) || Array.isArray(parsed.workouts) || Array.isArray(parsed.myWorkouts) || (parsed.settings && typeof parsed.settings === "object"));
        if(!istBloc){ showToast(t("fileError")); return; }
        confirmSheet(t("importQ"), t("importText"), t("importBtn"), function(){
          var db = defaultDB();
          db.blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
          db.workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];
          db.myWorkouts = Array.isArray(parsed.myWorkouts) ? parsed.myWorkouts : [];
          db.customEx = Array.isArray(parsed.customEx) ? parsed.customEx : [];
          db.history = Array.isArray(parsed.history) ? parsed.history : [];
    pruneHistory(db);
          if(parsed.settings) Object.assign(db.settings, parsed.settings);
          db.settings.theme = migrateTheme(db.settings.theme);
          db.settings.soundStyle = migrateSound(db.settings.soundStyle);
          migrateExIds(db);
          state.db = db; save(); syncCustomEx(); applyTheme(); applyLang(); applySpace();
          go("#home");
        });
      }catch(e){ showToast(t("fileError")); }
    };
    reader.readAsText(file);
  });
  app.querySelector("[data-reset]").addEventListener("click", function(){
    confirmSheet(t("deleteAllQ"), t("deleteAllText"), t("deleteAllBtn"), function(){
      state.db = defaultDB(); save(); syncCustomEx(); applyTheme(); applyLang(); applySpace();
      go("#home");
    });
  });
}
function toggleRow(id, label, desc, checked){
  return '<div class="toggle-row"><div><div class="label">'+label+'</div><div class="desc">'+desc+'</div></div>'+
    '<label class="switch"><input type="checkbox" id="'+id+'" '+(checked?"checked":"")+'><span class="track"></span><span class="thumb"></span></label></div>';
}
function bindToggle(id, cb){
  app.querySelector("#"+id).addEventListener("change", function(e){ cb(e.target.checked); });
}

/* ============ Install guide ============ */
function stepRow(n, text){
  return '<div class="step-row"><div class="step-num">'+n+'</div><div class="step-text">'+text+'</div></div>';
}
function renderInstallGuide(){
  var androidQuick = (isAndroid() && deferredInstallPrompt) ?
    '<div class="card" style="text-align:center;">'+
      '<button type="button" class="btn btn-primary" data-install-now>'+ICON_DOWNLOAD+' '+t("installNow")+'</button>'+
      '<div style="font-size:13px;color:var(--text-dim);margin-top:8px;">'+t("androidQuickNote")+'</div>'+
    '</div>' : "";
  function steps(list){ return list.map(function(text, i){ return stepRow(i+1, text); }).join(""); }
  app.innerHTML =
    topbar(t("installApp"), { back:"#settings" }) +
    '<div class="section-title">iPhone &amp; iPad (Safari)</div>'+
    '<div class="card">'+steps(t("iosSteps"))+'</div>'+
    '<div class="section-title">Android (Chrome)</div>'+
    androidQuick+
    '<div class="card">'+steps(t("androidSteps"))+'</div>'+
    '<div class="empty" style="padding:16px 8px;">'+t("installOutro")+'</div>';
  bindCommon();
}

/* ============ Confirm sheet ============ */
function confirmSheet(title, desc, actionLabel, onConfirm){
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet">'+
    '<h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p>'+
    '<div class="btn-row"><button class="btn btn-secondary" data-cancel>'+t("cancel")+'</button>'+
    '<button class="btn btn-danger" style="background:var(--danger);color:#fff" data-ok>'+esc(actionLabel)+'</button></div>'+
    '</div></div>';
  function close(){ root.innerHTML=""; }
  root.querySelector("[data-cancel]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
  root.querySelector("[data-ok]").addEventListener("click", function(){ close(); onConfirm(); });
}

/* ============ Sound-Kachel-Menü ============ */
function openSoundSheet(onClose){
  var root = document.getElementById("overlayRoot");
  var current = state.db.settings.soundStyle;
  function tiles(natural){
    return Object.keys(SOUND_STYLES).filter(function(key){ return !!SOUND_STYLES[key].natural === natural; }).map(function(key){
      return '<button type="button" class="sound-tile'+(key===current?" active":"")+'" data-pick="'+key+'">'+esc(soundLabel(key))+'</button>';
    }).join("");
  }
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet">'+
    '<h3>'+t("chooseSound")+'</h3>'+
    '<div class="sound-group">'+t("natural")+'</div>'+
    '<div class="sound-tiles">'+tiles(true)+'</div>'+
    '<div class="sound-group">'+t("electronic")+'</div>'+
    '<div class="sound-tiles">'+tiles(false)+'</div>'+
    '<button type="button" class="btn btn-secondary" data-cancel style="margin-top:4px;">'+t("close")+'</button>'+
    '</div></div>';
  function close(){ root.innerHTML=""; if(onClose) onClose(); }
  root.querySelector("[data-cancel]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
  root.querySelectorAll("[data-pick]").forEach(function(btn){
    btn.addEventListener("click", function(){
      state.db.settings.soundStyle = btn.getAttribute("data-pick");
      save();
      phaseBeep("work");
      root.querySelectorAll(".sound-tile").forEach(function(t){ t.classList.remove("active"); });
      btn.classList.add("active");
    });
  });
}

/* ============ Audio & Haptics ============ */
var actx = null, audioBus = null;
function audioCtx(){
  tonStandard();
  if(!actx){ var AC = window.AudioContext || window.webkitAudioContext; if(AC) actx = new AC(); }
  return actx;
}
/* Musik anderer Apps (Spotify & Co.) soll weiterlaufen: Signaltöne und Ansagen mischen sich dazu.
   iPhone/iPad (Safari 16.4+): Audio-Sitzung "ambient" statt Wiedergabe, die andere Apps anhält.
   Nachteil dort: Bei eingeschaltetem Stumm-Schalter bleiben die Töne stumm.
   (Die frühere „Anzeige auf dem Sperrbildschirm“ spielte dafür eine stumme Endlosschleife ab -
   die hielt Spotify an und wurde deshalb 2026-09 ganz entfernt.) */
function tonMischen(mischen){
  try{
    var soll = mischen ? "ambient" : "playback";
    if(navigator.audioSession && navigator.audioSession.type !== soll) navigator.audioSession.type = soll;
  }catch(e){}
}
/* Vor JEDEM Ton und jeder Ansage: mischen.
   Wichtig: auch vor der stummen Freischalt-Ansage beim Tipp auf „Los geht's“ - die kam früher
   vor dem Einstellen der Audio-Sitzung und hielt dadurch Spotify an. */
function tonStandard(){ tonMischen(true); }
/* Gemeinsamer Ausgang aller Klänge: trockenes Signal + Raumhall, am Ende ein Begrenzer,
   der nur kurz vor Übersteuern eingreift (normale Lautstärke bleibt unverändert) */
function soundOut(ctx){
  if(audioBus) return audioBus.input;
  var input = ctx.createGain();
  var wet = ctx.createGain();
  var limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -3; limiter.knee.value = 0; limiter.ratio.value = 20;
  limiter.attack.value = 0.002; limiter.release.value = 0.12;
  input.connect(limiter);
  if(ctx.createConvolver){
    var room = ctx.createConvolver();
    room.buffer = roomImpulse(ctx);
    input.connect(room); room.connect(wet); wet.connect(limiter);
  }
  limiter.connect(ctx.destination);
  audioBus = { input:input, wet:wet };
  applySpace();
  return input;
}
/* 0.6: Nachhall kurzer Töne etwa 11 dB unter dem Direktschall - hörbarer Raum, noch nicht verwaschen */
function applySpace(){ if(audioBus) audioBus.wet.gain.value = state.db.settings.space ? 0.6 : 0; }
/* Künstlicher Raum als Impulsantwort: kurze Vorverzögerung, einzelne frühe Reflexionen, dann
   abklingendes Rauschen, das mit der Zeit dumpfer wird. Links und rechts verschieden - das
   ergibt die räumliche Breite. */
function roomImpulse(ctx){
  var rate = ctx.sampleRate, len = Math.floor(rate*1.8), pre = Math.floor(rate*0.012);
  var ir = ctx.createBuffer(2, len, rate);
  for(var ch=0; ch<2; ch++){
    var data = ir.getChannelData(ch), lp = 0;
    for(var i=pre; i<len; i++){
      var t = (i-pre)/(len-pre);
      lp += (0.8 - 0.65*t) * ((Math.random()*2-1) - lp);
      data[i] = lp * Math.pow(1-t, 3.2);
    }
    [0.017, 0.026, 0.039, 0.052, 0.071].forEach(function(s, j){
      var idx = Math.floor(rate*(s + ch*0.0035));
      if(idx < len) data[idx] += (j%2 ? -1 : 1) * 0.6 * Math.pow(0.78, j);
    });
  }
  return ir;
}
function withPan(ctx, dest, pan){
  if(!pan || !ctx.createStereoPanner) return dest;
  var p = ctx.createStereoPanner();
  p.pan.value = pan;
  p.connect(dest);
  return p;
}
/* Ein Teilton mit eigenem Ausklingen; mit "beat" zwei leicht verstimmte Töne, die schweben */
function addPartial(ctx, dest, freq, amp, att, decayS, now, beat, pan){
  var g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(amp, now + att);
  g.gain.exponentialRampToValueAtTime(0.0001, now + att + decayS);
  g.connect(withPan(ctx, dest, pan));
  var freqs = beat ? [freq, freq + beat] : [freq];
  freqs.forEach(function(fr){
    var o = ctx.createOscillator();
    var share = ctx.createGain();
    o.frequency.value = fr;
    share.gain.value = 1/freqs.length;
    o.connect(share); share.connect(g);
    o.start(now); o.stop(now + att + decayS + 0.05);
  });
}
/* Anschlaggeräusch: metallisch (Hammer auf Glocke) oder weich (Schlegel auf Holz) */
function strikeNoise(ctx, dest, amp, now, soft){
  var len = soft ? 0.02 : 0.035;
  var g = ctx.createGain();
  g.gain.setValueAtTime(amp, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + len);
  g.connect(dest);
  noiseBurst(ctx, g, soft ? { f:1400, dur:len*1000, filterType:"bandpass", q:.9 }
                          : { f:2600, dur:len*1000, filterType:"highpass", q:.7 }, now);
}
/* Wellenformen alter Spielkonsolen: Rechteck mit schmalem Puls (12,5 / 25 / 50 %) und das
   stufige 4-Bit-Dreieck des Bass-Kanals (als Fourier-Reihe, damit nichts klirrt) */
var chipWaves = {};
function chipWave(ctx, name){
  if(chipWaves[name]) return chipWaves[name];
  var N = 64, real = new Float32Array(N), imag = new Float32Array(N), k;
  if(name === "tri4"){
    var M = 512, steps = [];
    for(var j=0;j<M;j++){ var s = Math.floor(j/16); steps.push(((s < 16 ? 15 - s : s - 16)/7.5) - 1); }
    for(k=1;k<N;k++){
      var re = 0, im = 0;
      for(j=0;j<M;j++){ re += steps[j]*Math.cos(2*Math.PI*k*j/M); im += steps[j]*Math.sin(2*Math.PI*k*j/M); }
      real[k] = re*2/M; imag[k] = im*2/M;
    }
  } else {
    var duty = name === "pulse12" ? .125 : name === "pulse25" ? .25 : .5;
    for(k=1;k<N;k++) real[k] = 2/(k*Math.PI) * Math.sin(k*Math.PI*duty);
  }
  chipWaves[name] = ctx.createPeriodicWave(real, imag);
  return chipWaves[name];
}
function noiseBurst(ctx, gain, n, now){
  var durSec = n.dur/1000;
  var buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate*(durSec+0.05)), ctx.sampleRate);
  var data = buf.getChannelData(0);
  for(var i=0;i<data.length;i++){ data[i] = Math.random()*2-1; }
  var src = ctx.createBufferSource();
  src.buffer = buf;
  var filter = ctx.createBiquadFilter();
  filter.type = n.filterType || "bandpass";
  filter.frequency.value = n.f || 1200;
  filter.Q.value = n.q || 1;
  src.connect(filter); filter.connect(gain);
  src.start(now);
  src.stop(now + durSec + 0.05);
}
/* Spielt eine Notiz {f,dur,v,type,sweepTo,noise,filterType,q}: einfacher Ton, Pitch-Sweep oder
   gefiltertes Rauschen. Für die natürlichen Klänge zusätzlich:
   partials (Teiltöne mit eigenem Ausklingen), beat (Schwebung), strike (metallischer Anschlag),
   mallet (weicher Schlegel-Anschlag), att (Anschlagzeit ms), hold (Ton halten ms),
   trill (Flattern/Vibrato), breath (Atemrauschen), lp (Tiefpass gegen Schärfe),
   bursts (mehrere schnelle Rauschstöße, z.B. Klatschen), wave (Soundchip-Wellenform),
   pan (Position im Stereobild).
   at: Startzeit im Audio-Takt (ctx.currentTime-Skala) - so lassen sich Töne im Voraus einplanen.
   Rückgabe: der Ausgangsregler des Tons; disconnect() darauf bringt einen geplanten Ton zum Schweigen. */
function tone(n, at){
  if(!state.db.settings.sound) return null;
  var ctx = audioCtx();
  if(!ctx) return null;
  if(ctx.state==="suspended") ctx.resume();
  var level = (n.v==null?0.7:n.v) * (state.db.settings.volume!=null ? state.db.settings.volume : 1);
  if(level<=0) return null;
  var now = at != null ? Math.max(at, ctx.currentTime) : ctx.currentTime, durS = n.dur/1000, att = (n.att||8)/1000, end = now + durS;
  var gain = ctx.createGain();
  gain.connect(withPan(ctx, soundOut(ctx), n.pan));

  if(n.partials){
    gain.gain.value = level;
    if(n.strike) strikeNoise(ctx, gain, n.strike, now);
    if(n.mallet) strikeNoise(ctx, gain, n.mallet, now, true);
    var sum = n.partials.reduce(function(a, p){ return a + p[1]; }, 0);
    n.partials.forEach(function(p, i){
      /* Obertöne leicht links/rechts verteilt: der Klang bekommt Breite */
      var spread = i ? (i%2 ? -1 : 1) * Math.min(.3, .1*i) : 0;
      addPartial(ctx, gain, n.f*p[0], p[1]*1.4/sum, att, durS*p[2], now, n.beat||0, spread);
    });
    return gain;
  }

  if(n.bursts){
    /* Stöße sample-genau im Audio-Takt geplant - ein Timer wäre für 9 ms Abstand zu ungenau */
    n.bursts.forEach(function(ms, i){
      var t0 = now + ms/1000, last = i === n.bursts.length-1, len = last ? durS : 0.011;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(level*(last ? 1 : .8), t0 + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
      g.connect(gain);
      noiseBurst(ctx, g, { f:n.f, q:n.q, filterType:n.filterType, dur:len*1000 }, t0);
    });
    return gain;
  }

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(level, now+att);
  if(n.hold) gain.gain.setValueAtTime(level, now + n.hold/1000);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  if(n.noise){
    noiseBurst(ctx, gain, n, now);
    return gain;
  }
  var osc = ctx.createOscillator();
  if(n.wave) osc.setPeriodicWave(chipWave(ctx, n.wave));
  else osc.type = n.type || "sine";
  osc.frequency.setValueAtTime(n.f, now);
  if(n.sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1,n.sweepTo), end);
  if(n.trill){
    var lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = n.trill.rate;
    depth.gain.value = n.trill.depth;
    lfo.connect(depth); depth.connect(osc.frequency);
    lfo.start(now); lfo.stop(end + 0.05);
  }
  if(n.lp){
    var soft = ctx.createBiquadFilter();
    soft.type = "lowpass";
    soft.frequency.value = n.lp;
    osc.connect(soft); soft.connect(gain);
  } else {
    osc.connect(gain);
  }
  osc.start(now);
  osc.stop(end + 0.02);
  if(n.breath){
    var air = ctx.createGain();
    air.gain.value = n.breath;
    air.connect(gain);
    noiseBurst(ctx, air, { f:n.f, dur:n.dur, filterType:"bandpass", q:2.5 }, now);
  }
  return gain;
}
function currentSoundStyle(){
  return SOUND_STYLES[state.db.settings.soundStyle] || SOUND_STYLES.sanft;
}
function playNotes(notes){
  tonStandard();
  if(!notes) return;
  notes.forEach(function(n){
    setTimeout(function(){ tone(n); }, n.d);
  });
}
/* Countdown-Töne (3, 2, 1) etwa so laut wie der Signalton danach: je Klangstil einmal hochgerechnet
   (lauteste Note des Starttons ÷ lauteste Note des Ticks, höchstens ×3, nie leiser als vorher) */
function tickNotes(style){
  style = style || currentSoundStyle();
  if(!style._tickLaut){
    function maxV(ns){ return (ns || []).reduce(function(m, n){ return Math.max(m, n.v == null ? .7 : n.v); }, 0); }
    var tv = maxV(style.tick), f = tv ? clamp(maxV(style.work)*.9/tv, 1, 3) : 1;
    style._tickLaut = (style.tick || []).map(function(n){ return Object.assign({}, n, { v:(n.v == null ? .7 : n.v)*f }); });
  }
  return style._tickLaut;
}
function tick(){ playNotes(tickNotes()); }
function phaseBeep(kind){ playNotes(kind === "tick" ? tickNotes() : currentSoundStyle()[kind]); }
function vibrate(pattern){
  if(!state.db.settings.vibration) return;
  if(navigator.vibrate) try{ navigator.vibrate(pattern); }catch(e){}
}

/* ============ Vorausgeplante Signaltöne ============
   Browser drosseln Timer, sobald die App im Hintergrund ist oder der Bildschirm aus geht -
   ein Signalton per setTimeout käme dann zu spät oder gar nicht. Deshalb werden alle Töne
   der nächsten Minuten (Phasenwechsel + Countdown-Piepsen) direkt im Audio-Takt eingeplant.
   Die Audio-Engine spielt sie pünktlich ab, auch wenn die Seite selbst gerade nicht rechnet.
   Pause, Weiter, "Phase neu", Lautstärke: Plan verwerfen und neu erstellen. */
var AUDIO_HORIZON_MS = 10*60*1000;
var sched = { list:[], upto:-1 };   // list: { at, node }; upto: letzter eingeplanter Schritt
function schedCancel(){
  var now = actx ? actx.currentTime : 0;
  sched.list.forEach(function(x){ if(x.at > now + 0.02) try{ x.node.disconnect(); }catch(e){} });
  sched.list = [];
  sched.upto = -1;
}
function schedNotes(notes, wallMs){
  var ctx = audioCtx();
  if(!ctx || !notes) return;
  var base = ctx.currentTime + (wallMs - Date.now())/1000;
  notes.forEach(function(n){
    var at = base + (n.d||0)/1000;
    if(at < ctx.currentTime - 0.08) return;   // schon vorbei
    var g = tone(n, at);
    if(g) sched.list.push({ at:at, node:g });
  });
}
function schedCountdown(endMs, step){
  if(!state.db.settings.countIn || step.phase==="done") return;
  for(var k=3;k>=1;k--){
    var at = endMs - k*1000;
    if(step.duration > k && at >= Date.now() - 50) schedNotes(tickNotes(), at);
  }
}
/* full=true: alles Künftige neu planen (Countdown des laufenden Schritts inklusive);
   full=false: nur hinten anhängen, wenn der Plan zur Neige geht */
function planAudio(full){
  if(!playerState || playerState.paused) return;
  if(!state.db.settings.sound || !audioCtx()) return;
  var steps = playerState.steps, i = playerState.idx;
  if(full) schedCancel();
  else if(sched.upto > -1 && sched.upto - i >= 4) return;
  var style = currentSoundStyle(), horizon = Date.now() + AUDIO_HORIZON_MS;
  if(full) schedCountdown(playerState.endAt, steps[i]);
  var tEnd = playerState.endAt;
  for(var j=i+1; j<steps.length; j++){
    var st = steps[j];
    if(j > sched.upto){
      schedNotes(style[st.phase], tEnd);
      schedCountdown(tEnd + st.duration*1000, st);
      sched.upto = j;
    }
    if(st.phase==="done") break;
    tEnd += st.duration*1000;
    if(tEnd > horizon && j > i+4) break;
  }
  // abgespielte Einträge vergessen
  var now = actx.currentTime;
  sched.list = sched.list.filter(function(x){ return x.at > now - 5; });
}

/* ============ Wake Lock ============ */
var wakeLock = null;
function requestWakeLock(){
  if(!state.db.settings.keepAwake) return;
  if(!("wakeLock" in navigator)) return;
  navigator.wakeLock.request("screen").then(function(wl){ wakeLock = wl; }).catch(function(){});
}
function releaseWakeLock(){
  if(wakeLock){ wakeLock.release().catch(function(){}); wakeLock = null; }
}
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState==="visible" && playerState && playerState.running) requestWakeLock();
});

/* ============ Timer engine ============ */
function buildSteps(w){
  var steps = [];
  var b0 = findBlock(w.items[0] ? w.items[0].blockId : null);
  steps.push({ phase:"prep", label:"Bereit machen", duration:5, blockName: b0 ? b0.name : "", ex: b0 && b0.ex || "", exNr:1 });
  var exNr = 0;   // die wievielte Übung (Block) im Workout - nur für die Anzeige oben
  for(var i=0;i<w.items.length;i++){
    var it = w.items[i];
    var b = findBlock(it.blockId);
    if(!b) continue;
    exNr++;
    for(var r=0;r<b.reps;r++){
      var bn = b.sides ? b.name+" · "+(r%2===0 ? t("left") : t("right")) : b.name;
      steps.push({ phase:"work", label:b.name, blockName:bn, duration:b.workSec, rep:r+1, totalReps:b.reps,
                   hint:b.hint||"", ex:b.ex||"", side: b.sides ? (r%2===0 ? "left" : "right") : "", stretch: exIsStretch(b.ex), exNr:exNr });
      if(r < b.reps-1){
        steps.push({ phase:"rest", label:b.name, blockName:b.name, duration:b.restSec, rep:r+1, totalReps:b.reps, ex:b.ex||"",
                     side: b.sides ? (r%2===0 ? "left" : "right") : "", stretch: exIsStretch(b.ex), exNr:exNr });
      }
    }
    if(i < w.items.length-1 && it.restAfterSec>0){
      var nb = findBlock(w.items[i+1].blockId);
      steps.push({ phase:"blockrest", label:"Blockpause", blockName: nb?nb.name:"", duration:it.restAfterSec, ex: nb && nb.ex || "", exNr:exNr+1 });
    }
  }
  steps.push({ phase:"done", label:"Fertig", duration:0, exNr:exNr+1 });
  steps.exCount = exNr;
  /* Zähler oben im Timer: nur Übungseinheiten (Arbeitsphasen), Pausen zählen nicht mit.
     In Vorbereitung und Pausen steht die Nummer der nächsten Einheit. */
  var units = 0;
  steps.forEach(function(st){ if(st.phase==="work") st.unit = ++units; });
  var next = units;
  for(var k=steps.length-1;k>=0;k--){
    if(steps[k].phase==="work") next = steps[k].unit;
    else steps[k].unit = steps[k].phase==="done" ? units : next;
  }
  steps.units = units;
  return steps;
}

var playerState = null;

function workoutForSource(source){
  if(!source) return null;
  if(source.type==="draft"){
    return coverDraft && coverDraft.items.length ? draftRun(coverDraft) : null;
  }
  if(source.type==="mine"){
    var mw = findMy(source.id);
    return mw ? myRun(mw) : null;
  }
  if(source.type==="libworkout"){
    var lw = findLibWorkout(source.id);
    return lw ? libWorkoutRun(lw) : null;
  }
  if(source.type==="exercise"){
    var ex = findExercise(source.id);
    return ex ? exerciseRun(ex) : null;
  }
  if(source.type==="studio"){
    var sx = findExercise(source.id);
    return sx ? studioRun(sx) : null;
  }
  if(source.type==="block"){
    var b = findBlock(source.id);
    return b ? { id:"quick-"+b.id, name:b.name, items:[{blockId:b.id, restAfterSec:0}] } : null;
  }
  return findWorkout(source.id);
}

function startPlayer(workoutId){ launchFromSource({ type:"workout", id:workoutId }); }
function startBlockPlayer(blockId){ launchFromSource({ type:"block", id:blockId }); }

function launchFromSource(source){
  var w = workoutForSource(source);
  if(!w || !w.items.length){ go("#home"); return; }
  launchPlayer(w, source);
}

function launchPlayer(w, source){
  var steps = buildSteps(w);
  playerState = {
    workout: w, steps: steps, idx: 0,
    running: true, paused: false,
    endAt: 0, remainingMs: steps[0].duration*1000,
    rafId: null, source: source
  };
  document.getElementById("playerRoot").innerHTML = playerTemplate();
  bindPlayerControls();
  odo = null; // Walzen drehen beim Start von 0:00 auf die erste Phase
  var ctx = audioCtx();   // noch im Tipp freischalten (iOS)
  if(ctx && ctx.state==="suspended") try{ ctx.resume(); }catch(e){}
  schedCancel();
  rememberLastRun(w, source);
  enterStep(0, { manual:true });
  requestWakeLock();
  startBgTicker();
}


/* Zuletzt gestartet: bestimmt die Reihenfolge der Favoriten auf der Startseite.
   (Die frühere Karte „Nochmal wie letztes Mal“ gibt es auf der neuen Startseite nicht mehr.) */
function rememberLastRun(w, source){
  if(!source) return;
  markFavUsed(source);
  delete state.db.settings.lastRun;
  save();
}

function phaseVars(phase){
  if(phase==="work") return { bg:"var(--accent)", text:"var(--accent-text)", label:t("phWork") };
  if(phase==="rest") return { bg:"var(--rest)", text:"var(--rest-text)", label:t("phRest") };
  if(phase==="blockrest") return { bg:"var(--blockrest)", text:"#ffffff", label:t("phBlockrest") };
  if(phase==="prep") return { bg:"var(--blockrest)", text:"#ffffff", label:t("phPrep") };
  return { bg:"var(--bg)", text:"var(--text)", label:"" };
}

function playerTemplate(){
  var vol = Math.round((state.db.settings.volume!=null?state.db.settings.volume:1)*100);
  return '<div class="player" id="playerEl">'+
    '<div id="pl-bgs" aria-hidden="true"></div>'+
    '<div class="player-top">'+
      '<button class="exit" data-exit title="'+t("endBtn")+'">&times;</button>'+
      '<div class="pl-mitte"><div class="ex-dots" id="pl-exdots" role="img"></div></div>'+
      '<button class="exit" data-vol-toggle title="'+t("volume")+'">'+ICON_VOLUME+'</button>'+
    '</div>'+
    '<div class="vol-popover hidden" id="pl-vol-pop">'+ICON_VOLUME+
      '<input type="range" id="pl-vol-range" min="0" max="100" step="5" value="'+vol+'">'+
      '<span id="pl-vol-val">'+vol+'%</span>'+
    '</div>'+
    '<div class="progressbar"><div class="progressbar-fill" id="pl-progress" style="width:0%"></div></div>'+
    '<div id="pl-body" class="player-mid"></div>'+
    KODAK_BADGE +
    '</div>';
}

/* Fortschrittsring (modernes Design): zwei Halbkreise, die sich hinter einer Halbmaske drehen.
   Der Ring zeigt die Restzeit ab 12 Uhr im Uhrzeigersinn; bewegt wird nur per rotate (transform),
   ein Punkt am Ende sorgt für die runde Kappe. */
function ringHTML(){
  return '<svg class="ring2" viewBox="0 0 120 120" aria-hidden="true">'+
    '<defs><clipPath id="rc-r"><rect x="60" y="0" width="61" height="120"/></clipPath>'+
      '<clipPath id="rc-l"><rect x="-1" y="0" width="61" height="120"/></clipPath></defs>'+
    '<circle class="ring-bg" cx="60" cy="60" r="54"></circle>'+
    '<g clip-path="url(#rc-r)"><path class="ring-half" id="pl-ring-r" d="M60 114A54 54 0 0 1 60 6"/></g>'+
    '<g clip-path="url(#rc-l)"><path class="ring-half" id="pl-ring-l" d="M60 6A54 54 0 0 1 60 114"/></g>'+
    '<circle class="ring-cap" id="pl-ring-c0" cx="60" cy="6" r="3"/>'+
    '<circle class="ring-cap" id="pl-ring-c1" cx="60" cy="6" r="3"/>'+
    '<circle class="ring-cap ring-seam" id="pl-ring-c2" cx="60" cy="114" r="3"/>'+   // deckt die Naht bei 6 Uhr ab
  '</svg>';
}
function ringSet(frac){
  var r = document.getElementById("pl-ring-r");
  if(!r) return;
  var a = clamp(frac, 0, 1)*360;
  r.setAttribute("transform", "rotate("+Math.min(a, 180).toFixed(2)+" 60 60)");
  document.getElementById("pl-ring-l").setAttribute("transform", "rotate("+Math.max(0, a-180).toFixed(2)+" 60 60)");
  var c1 = document.getElementById("pl-ring-c1");
  c1.setAttribute("transform", "rotate("+a.toFixed(2)+" 60 60)");
  var sichtbar = a > .5 ? "1" : "0";
  c1.style.opacity = sichtbar; document.getElementById("pl-ring-c0").style.opacity = sichtbar;
  document.getElementById("pl-ring-c2").style.opacity = a > 181 ? "1" : "0";
}
var UA_FLAG_BG = "linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), var(--ua-flag) center / cover no-repeat";
/* Phasenfarbe weich überblenden: neue Farbfläche blendet über der alten ein (nur opacity) */
function phaseBg(color){
  var host = document.getElementById("pl-bgs");
  if(!host) return;
  var top = host.lastElementChild;
  if(top && top.getAttribute("data-c") === color) return;
  var el = document.createElement("div");
  el.className = "pl-bg"; el.style.background = color; el.setAttribute("data-c", color);
  host.appendChild(el);
  var alte = Array.prototype.slice.call(host.children, 0, -1);
  setTimeout(function(){ alte.forEach(function(o){ o.remove(); }); }, 650);
}

function stepBodyHTML(step){
  if(step.phase==="done"){
    var total = fmtDuration(workoutDuration(playerState.workout));
    return '<div class="done-screen"><h2>'+t("doneTitle")+'</h2><p>'+esc(playerState.workout.name)+' &middot; '+total+'</p>'+
      '<div class="btn-row" style="width:100%;max-width:300px;">'+
        '<button class="btn btn-secondary" data-again>'+ICON_RESTART+' '+t("again")+'</button>'+
        '<button class="btn btn-primary" data-finish>'+t("finish")+'</button>'+
      '</div></div>';
  }
  var pv = phaseVars(step.phase);
  var repInfo = step.totalReps ? '<div class="rep-dots" id="pl-dots"></div>' : "";
  // Vorbereitung und Blockpause: die Figur macht die kommende Übung vor und steht im Mittelpunkt
  var vorschau = (step.phase==="blockrest" || step.phase==="prep") && step.ex && ILLU[step.ex];
  var timeHTML = isVintageTheme()
    ? '<div class="time" id="pl-time">'+odoHTML(step.duration)+'</div>'
    : '<div class="ring-wrap'+(vorschau ? ' mit-figur' : '')+'" id="pl-ringwrap">'+ringHTML()+
        (vorschau ? illuHTML(step.ex, "pl-vorschau") : '')+'<div class="time" id="pl-time">'+esc(fmtTime(step.duration))+'</div></div>';
  var phLabel = pv.label;
  if(step.stretch){
    if(step.phase==="work") phLabel = t("phHold");
    else if(step.phase==="rest") phLabel = t(step.side ? "phSwitch" : "phRelax");
  }
  /* pl-a / pl-b sind im Hochformat unsichtbar (display:contents) - im Querformat
     steht die Uhr links, Beschriftung und Tasten rechts daneben */
  return '<div class="pl-a"><div class="phase-label">'+phLabel+'</div>'+
    '<div class="block-label">'+esc(step.blockName||"")+
      (step.ex && EX_INFO[step.ex] ? ' <button type="button" class="info-btn" data-plinfo="'+step.ex+'" title="'+t("info")+'" aria-label="'+t("info")+'">i</button>' : '')+'</div>'+
    (step.phase==="work" && step.ex && ILLU[step.ex] ? illuHTML(step.ex, "pl-illu") : "")+
    (vorschau && isVintageTheme() ? illuHTML(step.ex, "pl-illu pl-vorschau-v") : "")+
    '</div>'+   // Hinweis zur Übung steht in der Info (ⓘ), im Timer bleibt es ruhig
    timeHTML+
    '<div class="pl-b">'+repInfo+
    '<div class="next-up" id="pl-next"></div>'+
    '<div class="player-controls">'+
      '<button class="ctrl-btn" data-skip title="'+t("skip")+'">'+ICON_SKIP+'</button>'+
      '<button class="ctrl-btn main" id="pl-playpause" title="'+t("pause")+'"><span>'+ICON_PAUSE+'</span></button>'+
      '<button class="ctrl-btn" data-restart title="'+t("restartPhase")+'">'+ICON_RESTART+'</button>'+
    '</div></div>';
}

function nextStepPreview(idx){
  var steps = playerState.steps;
  if(idx+1 >= steps.length) return "";
  var n = steps[idx+1];
  if(n.phase==="done") return t("thenDone");
  function welche(st){ return st.phase==="prep" || st.phase==="blockrest" ? st.blockName : st.label; }
  if(welche(n) === welche(steps[idx])) return "";
  var time = " ("+fmtTime(n.duration)+")";
  /* Bei Arbeitsphasen nur der Blockname - „Als nächstes: Los!“ klänge holprig */
  if(n.phase==="work") return t("upNext")+" "+esc(n.blockName||"")+time;
  return t("upNext")+" "+phaseVars(n.phase).label+(n.blockName? SEP+esc(n.blockName):"")+time;
}

/* opt.manual: Start/Weiter - Signalton sofort spielen und Tonplan neu erstellen.
   Sonst (Zeit abgelaufen) kam der Signalton schon aus dem Tonplan.
   opt.startAt: wann der Schritt eigentlich begann (Date.now()-Skala) - beim Aufholen
   nach dem Hintergrund liegt das in der Vergangenheit, die Restzeit stimmt trotzdem.
   opt.quiet: keine Vibration/Ansage (übersprungene Schritte im Hintergrund) */
function enterStep(idx, opt){
  opt = opt || {};
  var steps = playerState.steps;
  if(idx >= steps.length) idx = steps.length-1;
  playerState.idx = idx;
  var step = steps[idx];
  var el = document.getElementById("playerEl");
  var pv = phaseVars(step.phase);
  el.style.setProperty("--phase-bg", pv.bg);
  el.style.setProperty("--phase-text", pv.text);
  el.setAttribute("data-phase", step.phase);
  // Ukraine Twist: während der ganzen Übung die wehende Flagge als Hintergrund
  var ua = step.ex === "russian-twists" && (step.phase === "work" || step.phase === "rest");
  el.classList.toggle("ua", ua);
  if(ua) el.style.setProperty("--phase-text", "#ffffff");
  phaseBg(ua ? UA_FLAG_BG : pv.bg);
  var body = document.getElementById("pl-body");
  body.innerHTML = stepBodyHTML(step);
  body.classList.remove("step-in"); void body.offsetWidth; body.classList.add("step-in");   // neuer Schritt blendet ein
  ringSet(1);
  var infoBtn = document.querySelector("#pl-body [data-plinfo]");
  if(infoBtn) infoBtn.addEventListener("click", function(){ openExInfo(infoBtn.getAttribute("data-plinfo"), true); });
  if(step.phase!=="done" && isVintageTheme()) odoInit(document.getElementById("pl-time"), step.duration);
  updateExDots(step);

  if(step.phase!=="done"){
    playerState.endAt = (opt.startAt || Date.now()) + step.duration*1000;
    playerState.remainingMs = playerState.endAt - Date.now();
    playerState.paused = false;
    document.getElementById("pl-next").innerHTML = nextStepPreview(idx);
    updateDots(step);
    if(opt.manual){ phaseBeep(step.phase); planAudio(true); }
    else planAudio(false);
    if(!opt.quiet){
      vibrate(step.phase==="work" ? [40] : [20,60,20]);
      if(step.phase!=="work") announceStep(idx);
    }
    bindPlayPause();
    tickLoop();
  } else {
    releaseWakeLock();
    stopBgTicker();
    if(opt.manual) phaseBeep("done");
    logHistory(false);
    announceStep(idx);
    vibrate([60,80,60,80,120]);
    var doneBody = document.getElementById("pl-body");
    var finishBtn = doneBody.querySelector("[data-finish]");
    if(finishBtn) finishBtn.addEventListener("click", exitPlayer);
    var againBtn = doneBody.querySelector("[data-again]");
    if(againBtn) againBtn.addEventListener("click", function(){
      var source = playerState.source;
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      launchFromSource(source);
    });
  }
  updateProgress();
}

function updateDots(step){
  var wrap = document.getElementById("pl-dots");
  if(!wrap) return;
  /* So groß wie der Platz erlaubt (bis 34 px); bei vielen Wiederholungen kleiner, notfalls zweireihig */
  var n = step.totalReps, gap = n > 12 ? 6 : 10;
  var host = wrap.parentNode.clientWidth ? wrap.parentNode : wrap.closest(".player-mid");   // pl-b ist im Hochformat display:contents
  var avail = Math.min(host.clientWidth - 70, 340);
  var size = Math.max(14, Math.min(34, Math.floor((avail - (n-1)*gap)/n)));
  wrap.style.gap = gap+"px";
  var html = "";
  var cur = step.phase === "rest" ? step.rep+1 : step.rep;   // Pause: der kommende Satz blinkt, der gerade geschaffte ist erledigt
  for(var i=1;i<=n;i++){
    var cls = i<cur ? "done" : (i===cur ? "now":"");
    html += '<span class="'+cls+'" style="width:'+size+'px;height:'+size+'px;border-radius:'+Math.max(3, Math.round(size*.15))+'px"></span>';
  }
  wrap.innerHTML = html;
}

/* Oben: ein Kreis je Übung - erledigte kräftig, die aktuelle größer, kommende blass.
   In der Pause vor einer neuen Übung pulsiert deren Kreis. Nur bei Workouts mit mehreren Übungen. */
function updateExDots(step){
  var wrap = document.getElementById("pl-exdots");
  if(!wrap) return;
  var n = playerState.steps.exCount || 0;
  if(n < 2 || n > 30){ wrap.innerHTML = ""; wrap.style.display = "none"; return; }
  wrap.style.display = "";
  var cur = step.exNr || 1, bald = step.phase === "blockrest" || step.phase === "prep";
  var avail = Math.max(60, (wrap.parentNode.clientWidth || 220) - 4), gap = n > 12 ? 5 : 8;
  var size = Math.max(6, Math.min(14, Math.floor((avail - (n-1)*gap)/n)));
  wrap.setAttribute("aria-label", t("exOf", { i:Math.min(cur, n), n:n }));
  wrap.style.gap = gap+"px";
  var html = "";
  for(var i=1;i<=n;i++){
    var cls = i < cur ? "done" : i === cur ? "now"+(bald ? " bald" : "") : "";
    html += '<span class="'+cls+'" style="width:'+size+'px;height:'+size+'px"></span>';
  }
  wrap.innerHTML = html;
}

function updateProgress(){
  var steps = playerState.steps;
  var totalDur = 0, elapsed = 0;
  for(var i=0;i<steps.length-1;i++){ totalDur += steps[i].duration; }
  for(i=0;i<playerState.idx;i++){ elapsed += steps[i].duration; }
  var step = steps[playerState.idx];
  if(step && step.phase!=="done"){
    var doneMs = (step.duration*1000 - Math.max(0,playerState.remainingMs));
    elapsed += doneMs/1000;
  } else {
    elapsed = totalDur;
  }
  var pct = totalDur>0 ? Math.min(100, elapsed/totalDur*100) : 100;
  var bar = document.getElementById("pl-progress");
  if(bar) bar.style.width = pct+"%";
}

/* ============ Walzenzähler (Vintage-Designs) ============
   Jede Stelle ist eine 3D-Walze mit rundum aufgedruckten Ziffern, die per rotateX gedreht wird.
   Das Verhalten ist einem mechanischen Kilometerzähler nachempfunden:
   - Die Einer-Walze rastet jede Sekunde mit leichtem Überschwingen in die nächste Ziffer ein;
     die neue Ziffer kommt von oben, die alte dreht nach unten weg.
   - Höhere Walzen bahnen ihren Wechsel an: schon einige Sekunden vorher drehen sie langsam ein
     Stück vor, sodass die nächste Ziffer oben ins Fenster lugt - wie das Übertragsritzel eines
     echten Zählwerks, das allmählich eingreift.
   - Beim Übertrag rastet zuerst die rechte Walze ein, jede Stelle weiter links etwas später.
   - Jede Walze sitzt minimal schief (Spiel im Getriebe).
   - Beim Start, bei "Phase neu" und beim Phasenwechsel drehen die Walzen sichtbar auf den neuen
     Stand, statt zu springen. */
var ODO_FACE_H = 1.1;      // Höhe einer Ziffernfläche (em) - bestimmt den Walzenradius
var ODO_ROLL_MS = 380;     // Dauer des Einrastens nach einem Wechsel
var ODO_STAGGER_MS = 45;   // jede Stelle weiter links rastet so viel später ein
var ODO_JUMP_MS = 750;     // Drehen auf einen neuen Stand (Start, "Phase neu", Phasenwechsel)
var odo = null;

/* Walzen von rechts nach links:
   P      - alle wie viele Sekunden die Walze um eine Ziffer weiterdreht
   period - Anzahl verschiedener Ziffern (Zehner-Sekunden: 0-5)
   faces  - aufgedruckte Flächen (die 0-5-Walze trägt ihre Ziffern zweimal, wie bei Uhren-Zählwerken)
   win    - wie viele Sekunden vor dem Wechsel die Walze anfängt, ihn anzubahnen
   creep  - wie weit sie bis zum Wechsel schon vorgedreht hat (Anteil einer Ziffer)
   play   - Getriebespiel: bleibender kleiner Versatz */
function odoSpecs(durationSec){
  var specs = [
    { P:1,  period:10, faces:10, win:0.6, creep:0.07, play:0 },
    { P:10, period:6,  faces:12, win:3,   creep:0.12, play:0.02 }
  ];
  var minDigits = String(Math.floor(Math.max(0, durationSec)/60)).length;
  var plays = [-0.025, 0.015];
  for(var i=0;i<minDigits;i++){
    specs.push({ P:60*Math.pow(10,i), period:10, faces:10, win:15, creep:0.24, play:plays[i%2] });
  }
  return specs;
}
/* Radius, bei dem die Ziffernflächen lückenlos ein Vieleck bilden */
function odoRadius(faces){ return ODO_FACE_H/2/Math.tan(Math.PI/faces); }

function odoHTML(durationSec){
  var specs = odoSpecs(durationSec);
  var html = "";
  for(var k=specs.length-1;k>=0;k--){
    var sp = specs[k], angle = 360/sp.faces, r = odoRadius(sp.faces).toFixed(4), faces = "";
    for(var i=0;i<sp.faces;i++){
      faces += '<span class="odo-face" style="transform:rotateX('+(-i*angle)+'deg) translateZ('+r+'em)">'+(i%sp.period)+'</span>';
    }
    html += '<span class="tc"><span class="tc-window"><span class="odo-drum">'+faces+'</span></span></span>';
    if(k===2) html += '<span class="tc sep">:</span>';
  }
  return html;
}

/* Neue Phase: die Walzen starten auf dem bisherigen Stand (beim Start des Players auf 0:00)
   und drehen von dort auf die neue Dauer */
function odoInit(container, durationSec){
  var specs = odoSpecs(durationSec);
  var drums = container.querySelectorAll(".odo-drum");
  var prev = odo ? odo.wheels.map(function(w){ return w.value; }) : [];
  odo = {
    lastV: null,
    wheels: specs.map(function(sp, k){
      return { spec:sp, drum:drums[drums.length-1-k], r:odoRadius(sp.faces), angle:360/sp.faces,
               value:prev[k]||0, pendingFrom:prev[k]||0, anim:null };
    })
  };
}

function easeOutBack(x){ var c = 1.2; return 1 + (c+1)*Math.pow(x-1,3) + c*Math.pow(x-1,2); }
function easeInOutCubic(x){ return x<.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2; }
/* Kürzester Drehweg auf einer Walze mit n Ziffern, Ergebnis in [-n/2, n/2) */
function odoShortest(d, n){ return ((d % n) + n*1.5) % n - n/2; }

/* Ruhestellung einer Walze in Ziffern (Bruchteile = Walze steht zwischen zwei Ziffern) */
function odoWheelValue(sp, V, f){
  var v = Math.floor(V/sp.P) % sp.period;
  /* Anbahnen: kurz vor dem nächsten Wechsel schon langsam vordrehen (erst kaum, dann zunehmend) */
  if(V >= sp.P){
    var x = clamp(1 - ((V % sp.P) + 1 - f)/sp.win, 0, 1);
    v -= sp.creep * x * x;
  }
  return v + sp.play;
}

/* Setzt alle Walzen auf den Stand der Restzeit. Wechsel werden als Drehung animiert, die nach
   Uhrzeit (nicht nach Timerzeit) abläuft - so dreht eine angefangene Bewegung auch bei Pause
   zu Ende. Gibt zurück, ob noch eine Walze in Bewegung ist. */
function odoUpdate(remMs){
  if(!odo) return false;
  var s = Math.max(0, remMs)/1000;
  var V = Math.max(1, Math.ceil(s));   // angezeigte Sekunden
  var f = V - s;                       // 0 direkt nach einem Sekundenwechsel, gegen 1 kurz vor dem nächsten
  var now = performance.now();
  var ticked = odo.lastV != null && V === odo.lastV - 1;          // normaler Sekundenwechsel
  var jumped = odo.lastV != null && V !== odo.lastV && !ticked;   // "Phase neu" o.ä.
  odo.lastV = V;
  var moving = false;
  odo.wheels.forEach(function(w, k){
    var sp = w.spec, model = odoWheelValue(sp, V, f), from = null, snap = false;
    if(w.pendingFrom != null){ from = w.pendingFrom; w.pendingFrom = null; }
    else if(jumped) from = w.value;
    else if(ticked && (V+1) % sp.P === 0){ from = w.value; snap = true; }
    if(from != null){
      var offset = odoShortest(from - model, sp.period);
      if(Math.abs(offset) > 0.001){
        /* Einrasten mit leichtem Überschwingen, rechte Stelle zuerst - bzw. ruhiges Drehen auf neuen Stand */
        w.anim = snap
          ? { start:now + k*ODO_STAGGER_MS, dur:ODO_ROLL_MS, offset:offset, ease:easeOutBack }
          : { start:now + k*ODO_STAGGER_MS*1.5, dur:ODO_JUMP_MS, offset:offset, ease:easeInOutCubic };
      }
    }
    var v = model;
    if(w.anim){
      var p = clamp((now - w.anim.start)/w.anim.dur, 0, 1);
      v += w.anim.offset * (1 - w.anim.ease(p));
      if(p >= 1) w.anim = null; else moving = true;
    }
    w.value = v;
    w.drum.style.transform = "translateZ(-"+w.r.toFixed(4)+"em) rotateX("+(v*w.angle).toFixed(3)+"deg)";
  });
  return moving;
}
/* Während der Pause laufende Drehungen zu Ende bringen, statt sie einzufrieren */
function odoSettle(){
  if(!odo || !playerState || !playerState.paused) return;
  if(odoUpdate(playerState.remainingMs)) requestAnimationFrame(odoSettle);
}

/* Abgelaufene Schritte nachholen. War die App länger im Hintergrund, können mehrere
   Schritte vorbei sein - dann direkt zum richtigen springen (nicht nur einen weiter).
   Gibt true zurück, wenn gewechselt wurde. */
function advanceIfDue(){
  if(!playerState || playerState.paused) return false;
  var steps = playerState.steps, now = Date.now();
  if(!steps[playerState.idx] || steps[playerState.idx].phase==="done" || playerState.endAt > now) return false;
  var idx = playerState.idx + 1, startAt = playerState.endAt, skipped = 0;
  while(steps[idx] && steps[idx].phase!=="done" && startAt + steps[idx].duration*1000 <= now){
    startAt += steps[idx].duration*1000; idx++; skipped++;
  }
  if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
  enterStep(idx, { startAt:startAt, quiet: skipped > 0 });
  if(skipped > 0 && playerState && !playerState.paused) planAudio(true);   // Tonplan an die echte Position anpassen
  return true;
}
/* Im Hintergrund läuft requestAnimationFrame nicht - ein Intervall hält die Logik
   (Schrittwechsel, Vibration, Ansagen, Tonplan verlängern) trotzdem am Laufen. */
var bgTicker = null;
function startBgTicker(){
  stopBgTicker();
  bgTicker = setInterval(function(){
    if(!playerState){ stopBgTicker(); return; }
    if(document.hidden) advanceIfDue();
  }, 500);
}
function stopBgTicker(){ if(bgTicker){ clearInterval(bgTicker); bgTicker = null; } }
/* Beim Drehen des Handys die Wiederholungs-Quadrate an die neue Breite anpassen */
window.addEventListener("resize", function(){
  if(playerState && playerState.steps[playerState.idx]) updateDots(playerState.steps[playerState.idx]);
});
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState!=="visible" || !playerState || playerState.paused) return;
  var ctx = audioCtx();
  if(ctx && ctx.state!=="running") try{ ctx.resume(); }catch(e){}
  if(!advanceIfDue()) planAudio(true);   // Uhr und Audio-Takt neu abgleichen
});

function tickLoop(){
  if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
  function frame(){
    if(!playerState || playerState.paused){ return; }
    var step = playerState.steps[playerState.idx];
    if(!step || step.phase==="done") return;
    if(advanceIfDue()) return;
    var remaining = playerState.endAt - Date.now();
    playerState.remainingMs = remaining;
    var remSec = Math.ceil(remaining/1000);
    if(isVintageTheme()){
      odoUpdate(remaining);
    } else {
      var timeEl = document.getElementById("pl-time");
      if(timeEl) timeEl.textContent = fmtTime(remSec);
    }
    ringSet(step.duration ? remaining / (step.duration*1000) : 0);
    // letzte 3 Sekunden: Ring pulsiert im Sekundentakt
    var rw = document.getElementById("pl-ringwrap");
    if(rw) rw.classList.toggle("pulse", remaining <= 3000 && remaining > 0);
    updateProgress();
    playerState.rafId = requestAnimationFrame(frame);
  }
  frame();
}

function bindPlayPause(){
  var btn = document.getElementById("pl-playpause");
  if(!btn) return;
  btn.onclick = function(){
    if(playerState.paused){
      playerState.paused = false;
      playerState.endAt = Date.now() + playerState.remainingMs;
      btn.querySelector("span").innerHTML = ICON_PAUSE;
      requestWakeLock();
      planAudio(true);
      tickLoop();
    } else {
      playerState.remainingMs = Math.max(0, playerState.endAt - Date.now());
      playerState.paused = true;
      schedCancel();
      btn.querySelector("span").innerHTML = ICON_PLAY;
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      odoSettle();
    }
  };
}

function bindPlayerControls(){
  var root = document.getElementById("playerRoot");
  root.addEventListener("click", function(e){
    if(e.target.closest("[data-exit]")){
      confirmSheet(t("endQ"), t("endText"), t("endBtn"), exitPlayer);
    }
    if(e.target.closest("[data-skip]")){
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      enterStep(playerState.idx+1, { manual:true });
    }
    if(e.target.closest("[data-restart]")){
      var step = playerState.steps[playerState.idx];
      playerState.remainingMs = step.duration*1000;
      playerState.endAt = Date.now() + playerState.remainingMs;
      playerState.paused = false;
      var ppBtn = document.getElementById("pl-playpause");
      if(ppBtn) ppBtn.querySelector("span").innerHTML = ICON_PAUSE;
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      planAudio(true);
      tickLoop();
    }
    if(e.target.closest("[data-vol-toggle]")){
      document.getElementById("pl-vol-pop").classList.toggle("hidden");
    }
  });
  var volRange = document.getElementById("pl-vol-range");
  var volVal = document.getElementById("pl-vol-val");
  volRange.addEventListener("input", function(){
    state.db.settings.volume = parseInt(volRange.value)/100;
    volVal.textContent = volRange.value+"%";
    save();
  });
  volRange.addEventListener("change", function(){
    phaseBeep(playerState.steps[playerState.idx].phase==="done" ? "done" : "work");
    planAudio(true);   // eingeplante Töne mit der neuen Lautstärke
  });
}

function exitPlayer(){
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  schedCancel();
  stopBgTicker();
  if(playerState && playerState.steps[playerState.idx].phase!=="done") logHistory(true);
  if(playerState && playerState.rafId) cancelAnimationFrame(playerState.rafId);
  playerState = null;
  odo = null;
  releaseWakeLock();
  document.getElementById("playerRoot").innerHTML = "";
  go("#home");
}

/* ============ Service worker ============ */
function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
}

})();
