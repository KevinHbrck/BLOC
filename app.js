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
    LIB_WORKOUT_ROWS = BLOC_DATEN.LIB_WORKOUT_ROWS, EX_LEVEL = BLOC_DATEN.EX_LEVEL, EX_EQUIP = BLOC_DATEN.EX_EQUIP, LZ_KETTEN = BLOC_DATEN.LZ_KETTEN || [], MAIN_CATS = BLOC_DATEN.MAIN_CATS,
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
var ICON_MOON = '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>';
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
    if(parsed.settings) Object.assign(db.settings, parsed.settings);
    pruneHistory(db);
    if(db.settings.bereicheV !== 3){   // einmalig: der Timer ist wieder ein eigener Bereich - bei bestehender Reihenfolge direkt nach Studio einsortieren, sonst Standard
      var br0 = db.settings.bereicheV === 2 ? selArr(db.settings.bereiche) : [];
      if(!br0.length) br0 = ["lib", "timer", "intervall", "reps", "run", "warm"];
      else if(br0.indexOf("intervall") < 0){ var nach = br0.indexOf("timer") > -1 ? br0.indexOf("timer") : br0.indexOf("lib"); br0.splice(nach + 1, 0, "intervall"); }
      db.settings.bereiche = br0; db.settings.bereicheV = 3;
    }
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
var I18N = window.BLOC_TEXTE;   // Texte stehen in texte.js (ein Schlüssel pro Zeile)
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
/* Kurzform für Karten: „12:20 Min“ bricht nicht mehr mit einem einzelnen „Sek“ um (ab einer Stunde wie fmtDuration) */
function fmtDauerKurz(totalSec){
  totalSec = Math.max(0, Math.round(totalSec));
  if(totalSec >= 3600) return fmtDuration(totalSec);
  var s = totalSec%60;
  return Math.floor(totalSec/60) + ":" + (s<10?"0":"") + s + " " + t("unitMin");   // geschütztes Leerzeichen: „12:20 Min“ bricht nie in der Mitte um
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
/* Bodyweight = alles ohne GerÃ¤t: jede Ãbung ohne AusrÃ¼stung (auch Burpees, Jumping Jacks â¦) zÃ¤hlt dazu, nur DehnÃ¼bungen nicht */
function bwDazu(ex){ if(ex.equip.every(function(e){ return e === "none"; }) && ex.cats.indexOf("stretch") < 0 && ex.cats.indexOf("bw") < 0) ex.cats.push("bw"); }
EXERCISES.forEach(bwDazu);

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
/* Air zeigt keine Studio-Übungen (Geräte, Langhantel, alles mit Ausrüstung „Fitnessstudio“) - die gehören nur zu Studio */
function fuerAir(ex){ return fuerWorkout(ex) && ex.equip.indexOf("gym") < 0; }
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
  if(d.ws) mw.ws = d.ws;   // „warm“ / „dehn“: gehört zu Mobility & Stretch (Reiter Meine dort), nicht zu Air
  if(!state.db.myWorkouts) state.db.myWorkouts = [];
  state.db.myWorkouts.push(mw); save();
  return mw;
}
/* Fertiges Workout übernehmen: Kopie unter „Eigene“, danach im Baukasten öffnen (ws: aus Mobility & Stretch) */
function adoptLibWorkout(lw, ws){
  var d = draftFromLib(lw);
  if(ws) d.ws = ws;
  var mw = createMyFromDraft(d);
  go("#mybuild/"+mw.id);
}
var bauNeuWs = "";   // beim Anlegen aus Mobility & Stretch: „warm“ bzw. „dehn“
/* Körperregionen der Dehnübungen (Attribute für Filter in Mobility & Stretch) */
var WS_REGIONEN = ["nacken", "schulter", "arme", "brust", "ruecken", "rumpf", "huefte", "beine"];
var WS_REGION_VON = {
  "neck-stretch":["nacken"], "shoulder-stretch":["schulter"], "triceps-stretch":["arme", "schulter"], "biceps-stretch":["arme", "brust"],
  "chest-stretch":["brust", "schulter"], "wrist-stretch":["arme"], "side-bend":["rumpf"], "cat-cow":["ruecken", "rumpf"],
  "childs-pose":["ruecken", "huefte"], "sphinx-stretch":["rumpf", "ruecken"], "cobra-lift":["rumpf", "ruecken"],
  "downward-dog":["ruecken", "beine", "schulter"], "spinal-twist":["ruecken", "huefte"], "forward-fold":["ruecken", "beine"],
  "hip-flexor-stretch":["huefte"], "quad-stretch":["beine"], "hamstring-stretch":["beine"], "calf-stretch":["beine"],
  "figure-four":["huefte"], "pigeon-stretch":["huefte"], "butterfly-stretch":["huefte"], "worlds-greatest":["huefte", "beine", "schulter", "ruecken"]
};
function wsRegionenVon(id){ return WS_REGION_VON[id] || []; }
function wsRegionOk(id, sel){ return !sel.length || wsRegionenVon(id).some(function(r){ return sel.indexOf(r) > -1; }); }
/* Übungen eines Mobility-Bereichs: Aufwärmen (feste Liste) bzw. alle Dehnübungen */
function wsUebungen(art){
  var l = art === "warm" ? AUFWAERM_UEBUNGEN.map(findExercise) : EXERCISES.filter(function(ex){ return ex.main === "stretch"; });
  return l.filter(function(ex){ return ex && !libHidden("ex:"+ex.id); });
}
/* Filterkarte der Körperregionen (Dehnen), dieselbe Karte wie in Air. anzahl: wie viele Einträge gerade zu sehen sind; art: Wo (Workouts) oder Ex (Übungen) */
function wsRegionFilterHTML(sel, anzahl, art, zonen, dehn){
  zonen = kkNorm(zonen);
  var ico = { nacken:'<circle cx="12" cy="7" r="3"/><path d="M8 21v-5a4 4 0 0 1 8 0v5"/>', schulter:STUDIO_GRUPPEN_ICON.schulter, arme:CAT_ICON.arms, brust:STUDIO_GRUPPEN_ICON.brust,
    ruecken:CAT_ICON.back, rumpf:CAT_ICON.core, huefte:'<path d="M6 5c0 6 2 8 6 8s6-2 6-8M9 13l-2 8M15 13l2 8"/>', beine:CAT_ICON.legs };
  var namen = sel.map(function(r){ return t("rg_"+r); }).concat(zonen.map(kkName));
  return filterKarteHTML({ offen:!!state.db.settings.wsFilterOpen, toggle:"data-wstoggle", reset:"data-wsfreset", n:namen.length,
    summe:namen.length ? namen.join(", ") : t(art === "Ex" ? "afAlleEx" : "afAlleWo"),
    zeigen:filterZeigenText(anzahl, art),
    inhalt:(dehn ? filterChipsHTML(t("afRegion"), "", WS_REGIONEN.map(function(r){
      return filterChip("data-wsreg", r, sel.indexOf(r) > -1, svgIcon(ico[r]), t("rg_"+r)); }).join("")) : '')+
      kkFilterHTML("data-wszone", zonen) });
}
function wsRegionBinden(neu){
  app.querySelectorAll("[data-wsreg]").forEach(function(b){
    b.addEventListener("click", function(e){ e.stopPropagation(); var s = state.db.settings; s.wsRegionen = selToggle(s.wsRegionen, b.getAttribute("data-wsreg")); save(); neu(); });
  });
  app.querySelectorAll("[data-wszone]").forEach(function(b){
    b.addEventListener("click", function(e){ e.stopPropagation(); var s = state.db.settings; s.wsZonen = selToggle(kkNorm(s.wsZonen), b.getAttribute("data-wszone")); save(); neu(); });
  });
  app.querySelectorAll("[data-wstoggle]").forEach(function(b){
    b.addEventListener("click", function(e){ e.stopPropagation(); var s = state.db.settings; s.wsFilterOpen = !s.wsFilterOpen; save(); neu(); });
  });
  var zur = app.querySelector("[data-wsfreset]");
  if(zur) zur.addEventListener("click", function(e){ e.stopPropagation(); state.db.settings.wsRegionen = []; state.db.settings.wsZonen = []; save(); neu(); });
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
  band:'<path d="M4 12c0-3.5 3.5-6 8-6s8 2.5 8 6-3.5 6-8 6-8-2.5-8-6z"/><path d="M8 12c2-2 6-2 8 0"/>',
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
/* Suche überall wie in Air: Lupe oben rechts in der Leiste klappt das Suchfeld auf (bleibt offen, solange etwas gesucht wird) */
function lupeHTML(pre, q){
  return '<button type="button" class="iconbtn lib-lupe'+(q ? ' an' : '')+'" data-lupe="'+pre+'" title="'+esc(t("search"))+'" aria-label="'+esc(t("search"))+'">'+
    svgIcon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>')+'</button>';
}
function suchFeldHTML(q, pre, ph){
  return '<div class="lib-suche'+(q ? ' offen' : '')+'" data-lsw="'+pre+'">'+searchHTML(q, pre, ph)+'</div>';
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
    '<span class="fig-bild">'+(ILLU[o.bild] ? illuHTML(o.bild, "fig-illu") : '<span class="st-ohne">'+(o.ico || svgIcon(EQUIP_ICON.none))+'</span>')+
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
function exPasses(ex, cat, equip, mains, zonen){
  return mainMatch(mains, ex.main) && catMatch(cat, ex.cats) && equipMatch(equip, ex) && gearOk(ex, cat, equip, mains) && zonePasst(ex, zonen);
}
function sortedExercises(cat, sort, equip, mains, zonen){
  var list = EXERCISES.filter(function(ex){ return !libHidden("ex:"+ex.id) && exPasses(ex, cat, equip, mains, zonen); });
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
/* Bänder mit der Klasse gv (z. B. Band zwischen den Händen vor der Brust) werden über dem Körper gezeichnet, nicht dahinter */
function qSVG(q){
  var vorn = "", x = (q.x || "").replace(/<path class="ip gb gv"[^>]*\/>/g, function(m){ vorn += m; return ""; });
  if(!vorn) return qSVG0(q);
  var c = {}; for(var k in q) c[k] = q[k];
  c.x = x;
  return qSVG0(c) + vorn;
}
function qSVG0(q){
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
/* Entwicklungshilfe zum Prüfen der Figuren: nur mit ?dev in der Adresse (kein Einfluss auf die App) */
if(/[?&](dev|schnelltest)\b/.test(location.search)) window.BLOC_DEV = { qSVG:qSVG, illuIds:illuIds, POSES:ILLU_POSES, SEQ:ILLU_SEQ, kkUnbekannt:function(){ return kkUnbekannt(); } };   // schnelltest: der Test prüft damit die Muskelnamen
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
/* Widerstandsband in der Animation: Linien mit data-bd (Marken: h = Hand, f = Fuß, k = Knie, sonst fester Punkt) werden aus den festen Geräteteilen
   gelöst und in jedem Bild neu gezeichnet. Je länger das Band, desto dünner (gedehnt); ist es kürzer als in Ruhe, hängt es leicht durch. */
function bandSplit(gs){
  var re = /<path class="ip gb( gv)?" d="[^"]*" data-bd="([^"]+)"\/>/g, alle = [];
  gs.forEach(function(g){
    var l = [];
    g.fest.replace(re, function(m, v, d){
      var arr = d.split("|").map(function(s){
        var m2 = /^([hfk])(\d)$/.exec(s);
        if(m2) return { a:m2[1], i:+m2[2] };
        var xy = s.split(","); return { x:+xy[0], y:+xy[1] };
      }); arr.v = !!v; l.push(arr);
      return m;
    });
    alle.push(l);
  });
  var n = alle[0].length;
  if(!n || alle.some(function(l){ return l.length !== n || l.some(function(b, i){ return b.length !== alle[0][i].length; }); })) return null;
  gs.forEach(function(g){ g.fest = g.fest.replace(re, ""); });
  return alle;   // alle[Pose][Band] = Marken
}
function bandPunkte(spez, P){
  return spez.map(function(m){
    if(m.a === "h"){ var a = P.arms[m.i] || P.arms[0]; return a[a.length-1]; }
    if(m.a === "f"){ var l = P.legs[m.i] || P.legs[0]; return l[Math.min(1, l.length-1)]; }
    if(m.a === "k"){ var l2 = P.legs[m.i] || P.legs[0]; return l2[0]; }
    return [m.x, m.y];
  });
}
function bandLaenge(pts){ var L = 0; for(var i=1;i<pts.length;i++) L += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); return L; }
function bandPfad(pts, ruhe){
  var L = bandLaenge(pts), hang = Math.max(0, ruhe*1.08 - L)*.5, d = "M"+pts[0][0].toFixed(1)+" "+pts[0][1].toFixed(1);
  for(var i=1;i<pts.length;i++){
    var a = pts[i-1], b = pts[i], sl = Math.hypot(b[0]-a[0], b[1]-a[1]) || 1;
    if(hang > .6){
      var nx = -(b[1]-a[1])/sl, ny = (b[0]-a[0])/sl, s = hang*sl/(L || 1);
      if(ny < 0){ nx = -nx; ny = -ny; }   // Durchhang nach unten
      d += "Q"+((a[0]+b[0])/2 + nx*s).toFixed(1)+" "+((a[1]+b[1])/2 + ny*s).toFixed(1)+" "+b[0].toFixed(1)+" "+b[1].toFixed(1);
    } else d += "L"+b[0].toFixed(1)+" "+b[1].toFixed(1);
  }
  return { d:d, w:Math.max(1.5, Math.min(2.8, 2.6*Math.pow(ruhe*1.08/Math.max(L, 1), .9))) };
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
  var bands = bandSplit(gs);   // Band-Linien laufen mit den Gliedern mit (siehe bandSplit)
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
  var bandVorn = "";   // Bänder mit gv liegen vor dem Körper (z. B. zwischen den Händen vor der Brust)
  if(bands) bands[0].forEach(function(b, i){ var el = '<path class="ip gb" data-band="'+i+'"/>'; if(b.v) bandVorn += el; else html += el; });
  var vorn = "";
  gears.forEach(function(g, i){
    var el = '<g class="gear" data-g="'+i+'">'+g.svg+'</g>';
    if(g.arm === 0 || g.leg === 0) vorn += el; else html += el;
  });
  vorn += bandVorn;
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
              gxa:svg.querySelector(".gx-a"), gxb:svg.querySelector(".gx-b"), bands:bands, bandEls:[], bandRuhe:[] };
  A.legs.forEach(function(k, i){ fig.legs[i] = svg.querySelector('[data-leg="'+i+'"]'); fig.fersen[i] = svg.querySelector('[data-ferse="'+i+'"]'); });
  A.arms.forEach(function(k, i){ fig.arms[i] = svg.querySelector('[data-arm="'+i+'"]'); fig.hands[i] = svg.querySelector('[data-hand="'+i+'"]'); });
  gears.forEach(function(g, i){ fig.gearEls[i] = svg.querySelector('[data-g="'+i+'"]'); });
  if(bands) bands[0].forEach(function(b, i){
    fig.bandEls[i] = svg.querySelector('[data-band="'+i+'"]');
    fig.bandRuhe[i] = Math.min.apply(null, bands.map(function(sp, k){ return bandLaenge(bandPunkte(sp[i], P[k])); }));
  });
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
  if(f.bands) f.bandEls.forEach(function(el, n){
    var a = bandPunkte(f.bands[b.i][n], P), c = bandPunkte(f.bands[b.j][n], P), pts = a.map(function(p, m){ return [p[0] + (c[m][0]-p[0])*t, p[1] + (c[m][1]-p[1])*t]; });
    var r = bandPfad(pts, f.bandRuhe[n]);
    el.setAttribute("d", r.d); el.style.strokeWidth = r.w.toFixed(2);
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
/* Nachbarn in den Leichter/Schwerer-Ketten (Daten: LZ_KETTEN in daten.js) */
function leichterSchwerer(id){
  for(var i = 0; i < LZ_KETTEN.length; i++){
    var k = LZ_KETTEN[i], j = k.indexOf(id);
    if(j < 0) continue;
    var l = j > 0 ? k[j-1] : null, s = j < k.length-1 ? k[j+1] : null;
    if(l && !(findExercise(l) && EX_INFO[l])) l = null;
    if(s && !(findExercise(s) && EX_INFO[s])) s = null;
    return l || s ? { l:l, s:s } : null;
  }
  return null;
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
    (EX_MUSCLES[exId] ? '<div class="info-mus"><div class="info-mus-t"><div><b>'+esc(musclesLabel(ex))+':</b> '+esc(musclesMain(ex))+'</div>'+
      (musclesAssist(ex) ? '<div class="info-mus-2">'+esc(t("musAssist"))+': '+esc(musclesAssist(ex))+'</div>' : '')+'</div>'+
      kkInfoHTML(ex)+'</div>' : '')+
    '<div class="info-title">'+t("howTo")+'</div><ol class="info-steps">'+steps+'</ol>'+
    (function(){
      var p = EX_POSTURE[exId];
      if(!p) return "";
      var cues = p[lang*2].split("|").map(function(c){ return '<li>'+esc(c)+'</li>'; }).join("");
      return '<div class="info-title">'+t("posture")+'</div><ul class="info-posture">'+cues+'</ul>'+
        '<div class="info-avoid"><b>'+t("avoid")+':</b> '+esc(p[lang*2+1])+'</div>';
    })()+
    '<div class="info-tip"><b>'+t("tip")+':</b> '+esc(tplText(ex.hint))+'</div>'+
    (ex.equip.indexOf("band") > -1 ? '<div class="info-title">'+t("bandTitel")+'</div><ul class="info-posture info-band">'+["bandS1", "bandS2", "bandS3", "bandS4"].map(function(k){ return '<li>'+esc(t(k))+'</li>'; }).join("")+'</ul>' : '')+
    (function(){   // Passt es nicht? Eine Zeile mit der leichteren und der schwereren Variante
      var lz = live ? null : leichterSchwerer(exId);
      if(!lz) return "";
      function knopf(id, richtung){ return id ? '<button type="button" class="lz-btn '+richtung+'" data-lz="'+id+'"><small>'+(richtung === "l" ? '‹ '+esc(t("lzLeichter")) : esc(t("lzSchwerer"))+' ›')+'</small><b>'+esc(tplText(findExercise(id).name))+'</b></button>' : '<span class="lz-leer"></span>'; }
      return '<div class="info-title">'+esc(t("lzTitel"))+'</div><div class="info-lz">'+knopf(lz.l, "l")+knopf(lz.s, "s")+'</div>';
    })()+
    (lib ? '<div class="info-lib">'+
      '<button type="button" class="tpl-adopt" data-infoblock>'+ICON_PLUS+' '+t("adoptBlock")+'</button>'+
      (lib.zu ? '<button type="button" class="tpl-adopt" data-infozu>'+ICON_PLUS+' '+t("zpAdd")+'</button>' : '')+
      '<button type="button" class="tpl-hide" data-infohide>'+t("hideEx")+'</button></div>' : '')+
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a> · <a href="quellen.html" target="_blank" rel="noopener">'+t("sourcesLink")+'</a></p>'+
    '<button class="btn btn-secondary" data-close>'+t("close")+'</button>'+
  '</div></div>';
  if(lib){
    root.querySelector("[data-infoblock]").addEventListener("click", function(){
      adoptExercise(ex); showToast(t("adoptedBlock", { n:tplText(ex.name) }));
    });
    if(lib.zu) root.querySelector("[data-infozu]").addEventListener("click", function(){ close(); lib.zu(); });
    root.querySelector("[data-infohide]").addEventListener("click", function(){
      libHide("ex:"+exId); close(); if(lib.onChange) lib.onChange();
    });
  }
  function close(){
    if(infoTimer){ clearInterval(infoTimer); infoTimer = null; }
    root.innerHTML = "";
  }
  root.querySelectorAll("[data-close]").forEach(function(b){ b.addEventListener("click", close); });
  root.querySelectorAll("[data-lz]").forEach(function(b){ b.addEventListener("click", function(){ var nach = b.getAttribute("data-lz"); close(); openExInfo(nach, false, lib); }); });
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

/* Leiste unten: Start · Suche · Statistik · Einstellungen - nur auf diesen Hauptseiten, nicht im Training oder in Listen und Editoren */
var TAB_ROUTEN = { home:"#home", search:"#search", stats:"#stats", settings:"#settings" };
function tabLeiste(route){
  var el = document.getElementById("tabbar");
  if(!el) return;
  var aktiv = TAB_ROUTEN[route];
  if(!aktiv){ el.innerHTML = ""; el.classList.add("hidden"); document.body.classList.remove("mit-tabs"); return; }
  var eintraege = [
    ["#home", t("tabStart"), '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'],
    ["#search", t("search"), '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>'],
    ["#stats", t("tabStats"), '<path d="M5 20V11M12 20V4M19 20v-6"/>'],
    ["#settings", t("settings"), null]
  ];
  el.innerHTML = eintraege.map(function(x){
    return '<button type="button" class="tab'+(x[0] === aktiv ? ' active' : '')+'" data-nav="'+x[0]+'"'+(x[0] === aktiv ? ' aria-current="page"' : '')+'>'+
      (x[2] ? svgIcon(x[2]) : '<span class="ico">'+ICON_SETTINGS+'</span>')+'<span>'+esc(x[1])+'</span></button>';
  }).join("");
  el.classList.remove("hidden"); document.body.classList.add("mit-tabs");
  el.querySelectorAll("[data-nav]").forEach(function(b){
    b.addEventListener("click", function(){
      var h = b.getAttribute("data-nav");
      if(navTop() === h) return;
      if(h !== "#home") navStack = ["#home"];
      go(h);
    });
  });
}
function render(){
  if(document.getElementById("playerRoot").innerHTML) return; // don't re-render behind active player
  var parts = parseHash();
  var route = parts[0] || "home";
  tabLeiste(route);
  if(route==="home"){   // Filter und aufklappbare Bereiche (Air-Filter, Studio-Filter, Studio-Timer) beginnen bei jedem neuen Besuch zugeklappt
    var sz = state.db.settings; delete sz.libFilterOpen; delete sz.stFilterOpen; delete sz.wsFilterOpen; delete sz.repFilterOpen; delete sz.buildFilterOpen; delete sz.stTimerAuf;
    hinweisBesucht = {};   // Erklärtexte: der nächste Besuch einer Seite zählt wieder
  }
  if(repRun && route !== "repplay") repStop();   // Rep-Workout verlassen: Stoppuhr aus
  if(studioPause && route !== "studio") studioPauseStop();
  if(route==="home") return renderHome();
  if(route==="reps") return renderReps();
  if(route==="warmstretch") return renderWarmStretch();
  if(route==="rep") return renderRepDetail(parts[1]);
  if(route==="repplay") return renderRepPlayer(parts[1]);
  if(route==="repedit") return renderRepEdit(parts[1]);
  if(route==="repunitedit") return renderRepUnitEdit(parts[1]);
  if(route==="run") return renderRun();
  if(route==="rundetail") return renderRunDetail(parts[1]);
  if(route==="intervall") return renderIntervall();   // Timer: eigene Seite (früher je ein Reiter in Air und Studio)
  if(route==="timers"){
    if(parts[1] === "workouts" || parts[1] === "blocks"){   // frühere Timer-Reiter: jetzt die Timer-Seite
      navStack[navStack.length-1] = "#intervall"; setUrl("#intervall");
      return renderIntervall();
    }
    return renderTimers();
  }
  if(route==="studioplan"){   // Favorit auf der Startseite: Studio › Plan direkt geöffnet
    var sp0 = state.db.settings;
    if(stPlanFind(parts[1])){ sp0.stTab = "plan"; stPlanAktiv = parts[1]; stPlanBauen = false; stGen = null; stPlanQuery = ""; }
    navStack[navStack.length-1] = "#timers"; setUrl("#timers");
    return renderTimers();
  }
  if(route==="blocks"){ navStack[navStack.length-1] = "#intervall"; setUrl("#intervall"); return renderIntervall(); }
  if(route==="block") return renderBlockEdit(parts[1]);
  if(route==="workout") return renderWorkoutEdit(parts[1]);
  if(route==="settings") return renderSettings();
  if(route==="search") return renderSearch();
  if(route==="stats") return renderStats();
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

/* Erklärtexte über den Listen: bei den ersten Besuchen einer Seite stehen sie da, danach genügt ein „?“ in der Kopfzeile, das sie in einem Fenster öffnet.
   Ein Besuch = die Seite von der Startseite aus betreten (Reiter, Filter und Zurück zählen nicht); gezählt wird in settings.hinweise.
   hinweise(key, [Textschlüssel …]) gibt { knopf: das „?“ (nur wenn die Texte eingeklappt sind), z(i, klasse): Zeile i (nur solange sie noch stehen) } zurück. */
var HINWEIS_BESUCHE = 3;
var hinweisBesucht = {};   // seit dem letzten Besuch der Startseite schon gezählte Seiten
var hinweisTexte = [];     // Texte der gerade gezeigten Seite (für das Fenster)
var ICON_HILFE = '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8M12 17v.2"/>';
function hinweise(key, keys){
  var texte = hinweisTexte = keys.map(function(k){ return t(k); });
  if(!keys.length) return { knopf:"", z:function(){ return ""; } };
  var h = state.db.settings.hinweise || (state.db.settings.hinweise = {});
  if(!hinweisBesucht[key]){ hinweisBesucht[key] = true; h[key] = (h[key] || 0) + 1; save(); }
  var offen = h[key] <= HINWEIS_BESUCHE;
  return {
    knopf: offen ? "" : '<button type="button" class="iconbtn" data-hinweis title="'+esc(t("hwKnopf"))+'" aria-label="'+esc(t("hwKnopf"))+'">'+svgIcon(ICON_HILFE)+'</button>',
    z: function(i, klasse){ return offen ? '<div class="'+klasse+'">'+esc(texte[i])+'</div>' : ''; }
  };
}
function openHinweise(){
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet wi-sheet" role="dialog" aria-label="'+esc(t("hwTitel"))+'">'+
    '<h3>'+esc(t("hwTitel"))+'</h3>'+
    hinweisTexte.map(function(x){ return '<p class="hw-zeile">'+esc(x)+'</p>'; }).join("")+
    '<button class="btn btn-secondary" data-ok style="margin-top:12px">'+esc(t("wiOk"))+'</button>'+
  '</div></div>';
  function zu(){ root.innerHTML = ""; }
  root.querySelector("[data-ok]").addEventListener("click", zu);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) zu(); });
}

/* ============ Startseite ============ */
var HOME_ICON = {
  timer:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',   /* Freies Training: Hantel */
  intervall:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5M18 7l1.5-1.5"/>',   /* Timer: Stoppuhr */
  lib:'<path d="M3 8.5h10a3 3 0 1 0-3-3"/><path d="M3 12.5h15a3 3 0 1 1-3 3"/><path d="M3 16.5h6"/>',   /* Air: Wind */
  reps:'<path d="M2.5 20l6.5-11.5 3.8 6.3 2.7-4.3 6 9.5z"/><path d="M9 8.5V3.5l3.5 1.5L9 6.5"/>',   /* Summit: Gipfel mit Fahne */
  warm:'<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 2 7-2M12 10.5v4.5l-4.5 5.5M12 15l4.5 5.5"/>',   /* Mobility & Stretch: Figur streckt sich */
  run:'<circle cx="14" cy="4.5" r="2"/><path d="M6 21l3-6 3 2v5M9 15l1-4 4-1 2 3 3 1M10 11L8 8"/>'   /* Lauf: Läufer */
};
/* „Überrasch mich“: Zauberstab mit Funken (klarer und moderner als die beiden Sterne davor) */
var ICON_UEBERRASCH = '<path d="M4.5 19.5L14.5 9.5"/><path d="M13 3.5l.9 2.2 2.2.9-2.2.9L13 9.7l-.9-2.2-2.2-.9 2.2-.9z"/><path d="M19.5 11.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/><path d="M6 5l.5 1.2 1.2.5-1.2.5L6 8.4l-.5-1.2-1.2-.5 1.2-.5z"/>';
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
var BEREICH_KEYS = ["lib", "timer", "intervall", "reps", "run", "warm"];   // Standard-Reihenfolge: Air, Studio, Timer, Summit, Run, Mobility & Stretch
function bereichDaten(k){
  if(k === "lib") return ["#library", t("library"), t("htLibN", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length,
    e:EXERCISES.filter(function(ex){ return !ex.custom && fuerWorkout(ex); }).length }), "var(--tp-color)"];
  if(k === "intervall"){ var tw = state.db.workouts.length, tb = state.db.blocks.length; return ["#intervall", t("tabTimer"), tw || tb ? t("tmQuick", { w:tw, b:tb }) : t("tmQuickLeer"), "var(--ti-color)"]; }
  if(k === "timer") return ["#timers", t("timers"), t("htTimers", { n:Object.keys(STUDIO_NUR).length }), "var(--bl-color)"];
  if(k === "reps") return ["#reps", t("repTitle"), t("htReps"), "var(--rep-color)"];
  if(k === "run") return ["#run", t("runTitle"), run ? t("runLaeuft", { km:runKm(run.dist) }) : t("runTeaser"), "var(--run-color, #e5573f)"];
  return ["#warmstretch", t("warmTitle"), t("htWarm", { p:LIB_WORKOUTS.filter(libIstWarmDehn).length }), "var(--ws-color)"];
}
function bereichReihe(){
  var r = selArr(state.db.settings.bereiche).filter(function(k){ return BEREICH_KEYS.indexOf(k) > -1; });
  BEREICH_KEYS.forEach(function(k){ if(r.indexOf(k) < 0) r.push(k); });
  return r;
}
/* Fokus (Einstellungen): Bereiche, die man nicht braucht, verschwinden von der Startseite (settings.fokusAus = Liste der Schlüssel); die Daten bleiben, die Suche findet weiterhin alles */
function fokusAus(k){ return selArr(state.db.settings.fokusAus).indexOf(k) > -1; }
function bereicheHTML(){
  var r = bereichReihe().filter(function(k){ return !fokusAus(k); });
  if(!r.length) return '<div class="card fokus-leer"><div>'+esc(t("fokusAlleAus"))+'</div><button type="button" class="btn btn-secondary" data-nav="#settings">'+esc(t("fokusAendern"))+'</button></div>';
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
/* „Überrasch mich“: schmale Leiste (eine Zeile) direkt unter den Reitern von Air - das Alleinstellungsmerkmal, aber ohne viel Höhe zu kosten */
function surpriseLeisteHTML(){
  return '<button type="button" class="sp-leiste" data-surprise title="'+esc(t("spSub"))+'">'+svgIcon(ICON_UEBERRASCH)+'<b>'+esc(t("surprise"))+'</b>'+
    '<span class="sp-chev">'+ICON_CHEV+'</span></button>';
}
/* Reiterzeile: schlanke Reiter mit Unterstrich in der Farbe des Bereichs (Air, Studio, Mobility & Stretch, Summit) */
function reiterZeileHTML(farbe, knoepfe){ return '<div class="rz" style="--rz:'+farbe+'">'+knoepfe+'</div>'; }
/* ============ Gesamtsuche ============
   Lupe auf der Startseite (neben dem Zahnrad): durchsucht Übungen, Workouts (Air und eigene), Challenges (Summit),
   Timer-Workouts, Blöcke, die Bereiche und Aktionen wie „Neuer Block“. Das Feld bleibt stehen, nur die Treffer werden neu gezeichnet. */
var gesamtQuery = "";
/* Kategorien der Suche: ordnet die Gruppen der Treffer sechs Kategorien zu (Chips unter dem Suchfeld) */
var suchKat = "alle", suchZonen = [], suchKoerperAuf = false;   // Körper-Filter der Suche: gewählte Muskelgruppen, Karte offen
var SUCH_KATEGORIEN = ["alle", "uebungen", "workouts", "challenges", "timer", "bereiche", "erstellen"];
function suchKategorie(gruppe){
  if(gruppe === t("libExercises")) return "uebungen";
  if(gruppe === t("workouts") || gruppe === t("mineMy")) return "workouts";
  if(gruppe === t("srChallenges") || gruppe === t("srOwnChall")) return "challenges";
  if(gruppe === t("mineTimer") || gruppe === t("mineBlocks")) return "timer";
  if(gruppe === t("srAreas")) return "bereiche";
  return "erstellen";
}
function gesamtEintraege(){
  var l = [];
  function add(gruppe, titel, sub, text, fn){ l.push({ g:gruppe, k:suchKategorie(gruppe), titel:titel, sub:sub || "", text:titel+" "+(sub || "")+" "+(text || ""), fn:fn }); }
  var s = state.db.settings, neu = t("create");
  // Aktionen (auch Erstellen von Blöcken, Timer-Workouts, Workouts, Übungen, Challenges)
  add(neu, t("newBlock"), t("mineBlocks"), "block timer intervall erstellen anlegen neu create new", function(){ go("#block/"+createBlock().id); });
  add(neu, t("newWorkout"), t("mineTimer"), "timer workout intervall erstellen anlegen neu create new", function(){ go("#workout/"+createTimerWorkout().id); });
  add(neu, t("myNew"), t("tabMine"), "workout bauen baukasten erstellen anlegen neu create build", function(){ go("#mybuild/new"); });
  add(neu, t("exNew"), t("libExercises"), "uebung übung erstellen anlegen neu create exercise", function(){ go("#exedit/new"); });
  add(neu, t("repNew"), t("repTitle"), "challenge summit erstellen anlegen neu create", function(){
    var c = { id:"my-"+uid(), name:t("reDefaultName"), runden:3, zeilen:[], updatedAt:Date.now() };
    (s.myReps || (s.myReps = [])).push(c); save(); go("#repedit/"+c.id);
  });
  // Bereiche
  [["#library", t("library")], ["#intervall", t("tabTimer")], ["#reps", t("repTitle")], ["#run", t("runTitle")], ["#timers", t("timers")], ["#warmstretch", t("warmTitle")], ["#settings", t("settings")]].forEach(function(p){
    add(t("srAreas"), p[1], "", "", function(){ go(p[0]); });
  });
  // Workouts aus Air und eigene Workouts
  LIB_WORKOUTS.forEach(function(lw){
    if(libHidden("wo:"+lw.id)) return;
    var exs = lw.exercises.map(findExercise).filter(Boolean);
    add(t("workouts"), tplText(lw.name), t("exCount", { n:exs.length })+" · "+fmtDauerKurz(workoutDuration(libWorkoutRun(lw))), woSearchText("", exs), function(){ go("#cover/lib/"+lw.id); });
  });
  (state.db.myWorkouts || []).map(normMy).forEach(function(mw){
    var exs = mw.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
    add(t("mineMy"), mw.name, t("exCount", { n:exs.length }), woSearchText("", exs), function(){ go("#mybuild/"+mw.id); });
  });
  // Übungen
  EXERCISES.forEach(function(ex){
    if(libHidden("ex:"+ex.id)) return;
    add(t("libExercises"), tplText(ex.name), ex.cats.map(catName).join(", "), exSearchText(ex), function(){
      if(EX_INFO[ex.id]) openExInfo(ex.id, false, {});
      else go(ex.custom ? "#exedit/"+ex.id : "#playex/"+ex.id);
    });
    l[l.length-1].ex = ex.id;   // für den Körper-Filter der Suche
  });
  // Summit: Einheiten, Programme, eigene Challenges
  function rep(id, gruppe){
    var q = repQuelle(id);
    if(!q || !q.teile.length) return;
    var ex = [];
    q.teile.forEach(function(tl){ tl.row[4].forEach(function(x){ ex.push(repExName(x[0])); }); });
    add(gruppe, q.name, q.einzel ? "" : q.teile.map(repTeilName).join(" + "), ex.join(" "), function(){ go("#rep/"+id); });
  }
  REP_EINHEITEN.forEach(function(e){
    REP_STUFEN.forEach(function(st, i){ (e[1 + i] || []).forEach(function(v, k){ rep(e[0]+"-"+st+"-"+(k+1), t("srChallenges")); }); });
  });
  REP_WORKOUT_ROWS.forEach(function(r){ rep(r[0], t("srChallenges")); });
  (s.myRepUnits || []).forEach(function(u){ rep(u.id, t("srOwnChall")); });
  (s.myReps || []).forEach(function(c){ rep(c.id, t("srOwnChall")); });
  // Timer-Workouts und Blöcke
  state.db.workouts.forEach(function(w){ add(t("mineTimer"), w.name || t("untitled"), "", "", function(){ go("#workout/"+w.id); }); });
  state.db.blocks.forEach(function(b){ add(t("mineBlocks"), b.name, blockSpec(b), "", function(){ go("#block/"+b.id); }); });
  return l;
}
function renderSearch(){
  var alle = gesamtEintraege();
  suchZonen = kkNorm(suchZonen);   // nach dem Umschalten Grob · Fein passen
  app.innerHTML =
    topbar(t("srTitle"), { back:"#home" }) +
    searchHTML(gesamtQuery, "gs", t("srPh")) +
    '<div class="lib-chips sr-kats">'+SUCH_KATEGORIEN.map(function(k){
      return '<button type="button" class="lib-chip'+(suchKat === k ? ' active' : '')+'" data-srkat="'+k+'" aria-pressed="'+(suchKat === k)+'">'+esc(t("srKat_"+k))+'</button>';
    }).join("")+'</div>'+
    '<button type="button" class="sr-koerper-knopf" data-srkk aria-expanded="'+suchKoerperAuf+'">'+esc(t("kkFilter"))+(suchZonen.length ? ' · '+suchZonen.map(kkName).join(', ') : '')+'<span class="tpl-chev'+(suchKoerperAuf ? '' : ' zu')+'" aria-hidden="true">&#9662;</span></button>'+
    '<div class="sr-koerper" id="sr-kk"'+(suchKoerperAuf ? '' : ' hidden')+'>'+kkFilterHTML('data-srzone', suchZonen)+'</div>'+
    '<div id="gs-res"></div><div style="height:40px"></div>';
  bindCommon();
  var feld = app.querySelector("#gs-q"), res = app.querySelector("#gs-res");
  function zeigen(){
    var w = suchNorm(gesamtQuery), zon = suchZonen.length > 0, gewaehlt = suchKat !== "alle" || zon;
    if(!w && !gewaehlt){ res.innerHTML = '<div class="rep-intro">'+esc(t("srHint"))+'</div>'; return; }
    // Muskelgruppen gewählt: nur Übungen, die diese Gruppen als Hauptmuskeln haben
    var treffer = alle.filter(function(e){
      if(zon && !(e.ex && zonePasst(findExercise(e.ex), suchZonen))) return false;
      return (suchKat === "alle" || e.k === suchKat) && (!w || suchPasst(e.text, gesamtQuery));   // ohne Suchwort zeigt eine Kategorie alle ihre Einträge
    });
    if(!treffer.length){ res.innerHTML = '<div class="empty" style="padding:30px 20px;">'+esc(t("noResult"))+'</div>'; return; }
    var html = "", gruppe = null, n = 0, reihe = [];
    treffer.forEach(function(e){ if(reihe.indexOf(e.g) < 0) reihe.push(e.g); e.n = suchPasst(e.titel, gesamtQuery) ? 0 : 1; });
    // je Gruppe zuerst die Treffer im Namen, danach die über Übungen/Hinweise (stabil)
    treffer = treffer.map(function(e, i){ return { e:e, i:i }; }).sort(function(a, b){
      return reihe.indexOf(a.e.g) - reihe.indexOf(b.e.g) || a.e.n - b.e.n || a.i - b.i; }).map(function(o){ return o.e; });
    var kacheln = "", zeilen = "";   // Air-Übungen erscheinen als quadratische Kacheln wie unter Air › Übungen (zuerst), alles andere als Zeile
    function raster(){ if(kacheln) html += '<div class="fig-grid">'+kacheln+'</div>'; html += zeilen; kacheln = ""; zeilen = ""; }
    treffer.forEach(function(e, i){
      if(e.g !== gruppe){ raster(); gruppe = e.g; n = 0; html += '<div class="section-title">'+esc(gruppe)+'</div>'; }
      if(!gewaehlt && ++n > 12) return;   // je Gruppe die ersten zwölf; genauer tippen grenzt ein (mit gewählter Kategorie alle)
      var ex = e.ex && findExercise(e.ex);
      if(ex && fuerAir(ex) && ILLU[ex.id]){ kacheln += libExKachel(ex); return; }
      zeilen += '<div class="list-item entry" role="button" tabindex="0" data-sr="'+i+'"><div class="meta"><div class="name">'+esc(e.titel)+'</div>'+
        (e.sub ? '<div class="sub">'+esc(e.sub)+'</div>' : '')+'</div><span class="chip chev">'+ICON_CHEV+'</span></div>';
    });
    raster();
    res.innerHTML = html;
    // Kacheln wie in Air: antippen = Übungsinfo, ▶ = starten, ☆ = merken, lange drücken = in Workout oder Plan legen
    res.querySelectorAll("[data-info]").forEach(function(el){
      el.addEventListener("click", function(){ var id = el.getAttribute("data-info"); openExInfo(id, false, { onChange:zeigen, zu:function(){ exZuProgramm(id); } }); });
    });
    res.querySelectorAll("[data-playex]").forEach(function(el){
      el.addEventListener("click", function(ev){ ev.stopPropagation(); go("#playex/"+el.getAttribute("data-playex")); });
    });
    res.querySelectorAll("[data-exfav]").forEach(function(el){
      el.addEventListener("click", function(ev){ ev.stopPropagation(); toggleExFav(el.getAttribute("data-exfav")); zeigen(); });
    });
    res.querySelectorAll("[data-exlang]").forEach(function(el){ langDruck(el, function(){ exZuProgramm(el.getAttribute("data-exlang")); }); });
    airKachelBinden();
    res.querySelectorAll("[data-sr]").forEach(function(el){
      function los(){ treffer[+el.getAttribute("data-sr")].fn(); }
      el.addEventListener("click", los);
      el.addEventListener("keydown", function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); los(); } });
    });
  }
  feld.addEventListener("input", function(){ gesamtQuery = feld.value; zeigen(); });
  app.querySelectorAll("[data-srkat]").forEach(function(b){
    b.addEventListener("click", function(){
      suchKat = b.getAttribute("data-srkat");
      app.querySelectorAll("[data-srkat]").forEach(function(x){ var an = x === b; x.classList.toggle("active", an); x.setAttribute("aria-pressed", String(an)); });
      zeigen();
    });
  });
  // Körperkarte der Suche: aufklappen, Muskelgruppen antippen (mehrere möglich)
  var kkKnopf = app.querySelector("[data-srkk]");
  kkKnopf.addEventListener("click", function(){ suchKoerperAuf = !suchKoerperAuf; renderSearch(); });
  app.querySelectorAll("[data-srzone]").forEach(function(el){
    el.addEventListener("click", function(){ suchZonen = selToggle(suchZonen, el.getAttribute("data-srzone")); renderSearch(); });
  });
  zeigen();
  if(!gesamtQuery && !suchKoerperAuf) feld.focus();
}
/* Startseite: Favoriten als Kacheln, „Überrasch mich“, darunter die zwei Bereiche Timer und Bibliothek */
function renderHome(){
  var favHTML = favItemsHTML();
  var nFav = favEntries().length;
  app.innerHTML =
    topbar("BLOC", { home:true, sub:"Modular Training Builder" }) +
    installTipHTML() + backupTipHTML() + wocheHTML() +
    '<div class="sec-head"><div class="section-title">'+t("favorites")+(favHTML ? '' : ' <span class="lbl-hint bs-hinweis">'+esc(t("favEmptyKurz"))+'</span>')+'</div>'+
      (nFav > FAV_LIMIT ? '<button type="button" class="sec-link" data-favall>'+(favShowAll ? t("favLess") : t("favAllShort"))+
        '<span class="sec-link-chev'+(favShowAll?' up':'')+'">'+ICON_CHEV+'</span></button>' : '')+
    '</div>'+
    favHTML +
    /* Bereiche: Workouts zuerst und hervorgehoben, die übrigen drei als ruhige Liste („Überrasch mich“ gehört zu den Workouts) */
    '<div class="sec-head"><div class="section-title">'+t("areas")+'</div>'+
      '<button type="button" class="sec-link" data-wasistwas>'+esc(t("wiLink"))+'</button></div>'+
    bereicheHTML() +
    KODAK_BADGE;
  bindCommon();
  app.querySelectorAll("[data-bereich]").forEach(function(el){ langDruck(el, openBereicheSheet); });
  var sp = app.querySelector("[data-surprise]");
  if(sp) sp.addEventListener("click", openSurprise);
  bindFavItems(renderHome);
  bindBackupTip();
  var wib = app.querySelector("[data-wasistwas]");
  if(wib) wib.addEventListener("click", openWasIstWas);
}
/* „Was ist was?“: fünf Zeilen Klartext zu den Bereichen (nur Lesen, nichts wird geändert) */
function openWasIstWas(){
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet wi-sheet" role="dialog" aria-label="'+esc(t("wiTitel"))+'">'+
    '<h3>'+esc(t("wiTitel"))+'</h3>'+
    BEREICH_KEYS.map(function(k){
      var d = bereichDaten(k);
      return '<div class="wi-zeile" style="--c:'+d[3]+'"><span class="at-ico">'+svgIcon(HOME_ICON[k])+'</span><div><b>'+esc(d[1])+'</b><small>'+esc(t("wi_"+k))+'</small></div></div>';
    }).join("")+
    '<p class="hw-zeile" style="margin-top:12px">'+esc(t("wiSort"))+'</p>'+
    '<button class="btn btn-secondary" data-ok style="margin-top:12px">'+esc(t("wiOk"))+'</button>'+
  '</div></div>';
  function zu(){ root.innerHTML = ""; }
  root.querySelector("[data-ok]").addEventListener("click", zu);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) zu(); });
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
      } else if(kind === "run"){    // Lauf-Tracker
        var lf = runById(id); if(!lf) return;
        confirmSheet(t("runDelQ"), "„"+runKm(lf.dist)+" km“ – "+t("cantUndo"), t("del"), function(){
          state.db.settings.runs = (state.db.settings.runs || []).filter(function(x){ return x.id !== id; });
          save(); refresh(); showToast(t("deletedToast", { n:runKm(lf.dist)+" km" }));
        });
      } else if(kind === "plan"){   // Studio › Mein Plan
        var pl = stPlanFind(id); if(!pl) return;
        confirmSheet(t("planDelQ"), "„"+pl.name+"“ – "+t("cantUndo"), t("del"), function(){
          state.db.settings.stPlaene = stPlaene().filter(function(x){ return x.id !== id; });
          save(); refresh(); showToast(t("deletedToast", { n:pl.name }));
        });
      } else if(kind === "rep"){    // Summit › eigenes Programm / eigene Einheit
        var rq = repQuelle(id); if(!rq) return;
        confirmSheet(t(rq.unit ? "reUnitDelQ" : "reDelQ"), "„"+rq.name+"“ – "+t("cantUndo"), t("del"), function(){
          var st = state.db.settings;
          if(rq.unit) st.myRepUnits = (st.myRepUnits || []).filter(function(x){ return x.id !== id; });
          else st.myReps = (st.myReps || []).filter(function(x){ return x.id !== id; });
          if(st.repBest) delete st.repBest[id];
          save(); refresh(); showToast(t("deletedToast", { n:rq.name }));
        });
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
    '<div class="sub">'+count+' '+(count===1?t("blockOne"):t("blockMany"))+SEP+fmtDauerKurz(workoutDuration(w))+'</div></div>'+
    '<button type="button" class="plus-btn" data-twplus="'+w.id+'" title="'+esc(t("spFill"))+'" aria-label="'+esc(t("spFill")+": "+(w.name || t("untitled")))+'">'+ICON_PLUS+'</button>'+
    favBtn("tw:"+w.id)+trashBtn("tw", w.id, w.name)+'</div>';
}
function blockRow(b){
  return '<div class="list-item entry" data-nav="#block/'+b.id+'">'+
    '<button class="playbtn bl" data-playblock="'+b.id+'" title="'+t("startBlock")+'" aria-label="'+t("startBlock")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(b.name)+'</div>'+
    '<div class="sub">'+blockSpec(b)+SEP+fmtDauerKurz(blockDuration(b))+'</div></div>'+
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
  gruppen.push({ id:"eigene", name:t("stOwn"), ids:EXERCISES.filter(function(ex){ return ex.custom; }).map(function(ex){ return ex.id; }), eigene:true });
  // Die Air-Gruppen (air:true) sind immer dabei, kein Schalter: in der Liste stehen sie zugeklappt unter „Aus Air“ (studioAirBlockHTML)
  gruppen.push({ id:"frei", name:t("stFree"), ids:mit(["db", "kb"]), air:true });
  gruppen.push({ id:"stange", name:t("stBar"), ids:mit(["bar", "dip"]).filter(function(id){ return gruppen[gruppen.length-1].ids.indexOf(id) < 0; }), air:true });
  var schon = {};
  gruppen.forEach(function(g){ g.ids.forEach(function(id){ schon[id] = true; }); });
  var bandIds = EXERCISES.filter(function(ex){ return !ex.custom && !schon[ex.id] && fuerWorkout(ex) && ex.equip.indexOf("band") > -1; }).map(function(ex){ return ex.id; });
  var imBand = {};
  bandIds.forEach(function(id){ imBand[id] = true; });
  gruppen.push({ id:"air", name:t("stAirGr"), ids:EXERCISES.filter(function(ex){ return !ex.custom && !schon[ex.id] && !imBand[ex.id] && fuerWorkout(ex); }).map(function(ex){ return ex.id; }), air:true });
  gruppen.push({ id:"band", name:t("stBand"), ids:bandIds, air:true });
  return gruppen;
}
/* Welche Air-Gruppen gerade aufgeklappt sind - nur für diesen Besuch gemerkt, nichts davon wird gespeichert */
var studioAirOffen = {};
/* Air-Übungen im Studio ohne Schalter: Ohne Gruppenwahl stehen die drei Air-Gruppen am Ende der Liste als schmale, zugeklappte Zeilen
   („Kurzhantel & Kettlebell · 34“) - die Liste bleibt kurz, nichts ist versteckt. Gruppen-Chip oder Suche zeigen sie offen.
   liste: [{ g:Gruppe, ids:[…] }], kachel: Funktion id -> HTML der Kachel */
function studioAirBlockHTML(liste, kachel){
  if(!liste.length) return "";
  return '<div class="st-gruppe st-air-block"><div class="section-title">'+esc(t("stAirBlock"))+'</div>'+liste.map(function(x){
    return '<details class="st-air-gr" data-airgr="'+x.g.id+'"'+(studioAirOffen[x.g.id] ? ' open' : '')+'><summary>'+
      '<span class="sag-ico">'+svgIcon(STUDIO_GRUPPEN_ICON[x.g.id] || CAT_ICON.weight)+'</span><b>'+esc(x.g.name)+'</b>'+
      '<span class="lbl-hint">'+x.ids.length+'</span><span class="tpl-chev" aria-hidden="true">&#9662;</span></summary>'+
      '<div class="fig-grid">'+x.ids.map(kachel).join("")+'</div></details>';
  }).join("")+'</div>';
}
/* Auf/zu per Antippen (selbst umgeschaltet, damit der Zustand für das Neuzeichnen bekannt ist); während einer Suche sind alle offen.
   suche: Funktion, die den aktuellen Suchtext liefert */
function studioAirBinden(suche){
  app.querySelectorAll("details.st-air-gr > summary").forEach(function(sm){
    sm.addEventListener("click", function(e){
      e.preventDefault();
      if(suche()) return;
      var d = sm.parentNode; d.open = !d.open; studioAirOffen[d.getAttribute("data-airgr")] = d.open;
    });
  });
}
/* Nach applySearch aufrufen: bei Suche alle Air-Gruppen mit Treffern offen, ohne Treffer ausgeblendet; ohne Suche wieder wie gemerkt */
function studioAirSuche(q){
  app.querySelectorAll("details.st-air-gr").forEach(function(d){
    d.open = !!q || !!studioAirOffen[d.getAttribute("data-airgr")];
    d.style.display = !q || Array.prototype.some.call(d.querySelectorAll("[data-q]"), function(k){ return k.style.display !== "none"; }) ? "" : "none";
  });
}
/* Ausrüstung einer Studio-Übung - für die Chips über den Gruppen */
function studioArt(id){
  if(/cable|pulldown|pushdown|face-pull|woodchop|crossover/.test(id)) return "kabel";
  if(/^barbell|bench-press|t-bar|hip-thrust/.test(id)) return "lh";
  var eq = (findExercise(id) || {}).equip || [];
  if(eq.indexOf("gym") < 0){
    if(eq.indexOf("band") > -1) return "band";
    if(eq.indexOf("bar") > -1 || eq.indexOf("dip") > -1) return "stange";
    return (eq.indexOf("db") > -1 || eq.indexOf("kb") > -1) ? "frei" : "koerper";
  }
  return eq.indexOf("db") > -1 ? "frei" : "geraet";
}
var STUDIO_ARTEN = ["geraet", "kabel", "frei", "lh", "stange", "band", "koerper"];
var STUDIO_ART_ICON = { frei:EQUIP_ICON.kb, lh:CAT_ICON.weight, stange:EQUIP_ICON.bar, band:EQUIP_ICON.band, koerper:EQUIP_ICON.none };
/* Frühere Gruppen-Chips, die jetzt zur Ausrüstung gehören (Langhantel, Kurzhantel & Kettlebell, Stange & Barren, Körpergewicht), in die Ausrüstung umziehen */
function studioFilterAlt(){
  var s = state.db.settings, umzug = { lh:"lh", frei:"frei", stange:"stange", air:"koerper" }, gr = selArr(s.stGruppen), neu = [], arten = selArr(s.stArten);
  gr.forEach(function(id){ if(umzug[id]){ if(arten.indexOf(umzug[id]) < 0) arten.push(umzug[id]); } else neu.push(id); });
  if(neu.length !== gr.length){ s.stGruppen = neu; s.stArten = arten; save(); }
}
var STUDIO_GRUPPEN_ICON = { beine:CAT_ICON.legs, brust:'<path d="M4 8c2.5-2 5.5-2 8 0 2.5-2 5.5-2 8 0v5c-2 3-5.5 4-8 1.5C9.5 17 6 16 4 13z"/>',
  ruecken:CAT_ICON.back, schulter:'<circle cx="12" cy="6" r="2.5"/><path d="M4 18c0-5 3.5-8.5 8-8.5s8 3.5 8 8.5"/>', arme:CAT_ICON.arms,
  bauch:CAT_ICON.core, lh:CAT_ICON.weight, frei:EQUIP_ICON.kb, stange:EQUIP_ICON.bar, band:EQUIP_ICON.band, air:HOME_ICON.lib, eigene:'<path d="M12 5v14M5 12h14"/>' };
function studioKachel(id){
  var ex = findExercise(id);
  if(!ex) return "";
  var e = studioEintrag(id), last = e && e.log && e.log.length ? e.log[e.log.length-1] : null;
  var sub = last && last.s.length ? studioKg(last.s[0][0])+" kg · "+last.s.length+" × "+last.s[0][1] : t("stNoData");
  if(studioNurBlock(ex)){ var tb = studioTimer(id); sub = tb.reps+" × "+tb.work+" s"; last = null; }
  return '<div class="fig-karte st-kachel" role="button" tabindex="0" data-studio="'+id+'" data-q="'+esc(exSearchText(ex))+'" style="--cat:'+studioFarbe(ex)+'">'+
    '<span class="fig-bild">'+(ILLU[id] ? illuHTML(id, "fig-illu") : '<span class="st-ohne">'+svgIcon(EQUIP_ICON.gym || EQUIP_ICON.db)+'</span>')+exFavBtn(id)+'</span>'+
    '<span class="fig-name">'+esc(tplText(ex.name))+'</span>'+kachelMuskel(ex)+(sub === t("stNoData") ? '' : '<span class="st-sub'+(last ? ' an' : '')+'">'+esc(sub)+'</span>')+
    (last ? wochenKurve(studioWochen(id), "st-spark") : '')+'</div>';
}
/* Anzahl der Übungen, die der Studio-Filter gerade zeigt (ohne Doppelte aus Favoriten/Zuletzt) */
function studioAnzahl(gruppen, fGr, artOk){
  var n = 0;
  gruppen.forEach(function(g){ if(!fGr.length || fGr.indexOf(g.id) > -1) n += g.ids.filter(artOk).length; });
  return n;
}
/* Filter der Studio-Übungen (Gruppen inkl. der Air-Gruppen, Ausrüstung) - auch beim Zusammenstellen eines Plans; dieselbe Filterkarte wie in Air */
function studioFilterHTML(gruppen, fGr, fArt, anzahl, zonen){
  var s = state.db.settings;
  var namen = fGr.map(function(id){ var g = gruppen.filter(function(x){ return x.id === id; })[0]; return g ? g.name : id; })
    .concat(fArt.map(function(a){ return t("stArt_"+a); }), zonen.map(kkName));
  return filterKarteHTML({ offen:!!s.stFilterOpen, toggle:"data-sttoggle", reset:"data-streset", n:namen.length,
    summe:namen.length ? namen.join(", ") : t("afAlleEx"),
    zeigen:filterZeigenText(anzahl, "Ex"),
    inhalt:filterChipsHTML(t("afGruppe"), "", gruppen.filter(function(g){ return g.ids.length && !g.air; }).map(function(g){
        return filterChip("data-stgr", g.id, fGr.indexOf(g.id) > -1, svgIcon(STUDIO_GRUPPEN_ICON[g.id] || CAT_ICON.weight), g.name); }).join(""))+
      filterChipsHTML(t("equipHave"), "", STUDIO_ARTEN.map(function(a){
        return filterChip("data-start", a, fArt.indexOf(a) > -1, STUDIO_ART_ICON[a] ? svgIcon(STUDIO_ART_ICON[a]) : "", t("stArt_"+a)); }).join(""))+
      kkFilterHTML("data-stzone", zonen) });
}
function studioFilterBinden(fGr, fArt, zonen, neuZeichnen){
  var s = state.db.settings;
  app.querySelectorAll("[data-stzone]").forEach(function(b){ b.addEventListener("click", function(){ s.stZonen = selToggle(zonen, b.getAttribute("data-stzone")); save(); neuZeichnen(); }); });
  app.querySelectorAll("[data-stgr]").forEach(function(b){ b.addEventListener("click", function(){ s.stGruppen = selToggle(fGr, b.getAttribute("data-stgr")); save(); neuZeichnen(); }); });
  app.querySelectorAll("[data-start]").forEach(function(b){ b.addEventListener("click", function(){ s.stArten = selToggle(fArt, b.getAttribute("data-start")); save(); neuZeichnen(); }); });
  // Auf/zu steht in den Einstellungen, damit die Karte beim Neuzeichnen (nach jedem Antippen) offen bleibt - Mehrfachauswahl ohne ständiges Aufklappen
  app.querySelectorAll("[data-sttoggle]").forEach(function(b){ b.addEventListener("click", function(){ s.stFilterOpen = !s.stFilterOpen; save(); neuZeichnen(); }); });
  var zur = app.querySelector("[data-streset]");
  if(zur) zur.addEventListener("click", function(){ s.stGruppen = []; s.stArten = []; s.stZonen = []; save(); neuZeichnen(); });
}
function renderStudio(){
  var s = state.db.settings, alle = studioAlle();
  // Reiter oben: Übungen · Mein Plan · Timer
  if(s.stTab === "timer") s.stTab = "uebungen";   // der frühere Reiter „Timer“ ist jetzt eine eigene Seite
  if(s.stTab === "plan") return renderStudioPlan();
  // Filter: Gruppen-Kacheln (mehrere möglich) und Ausrüstung (mehrere möglich)
  studioFilterAlt();
  var fGr = selArr(s.stGruppen), fArt = selArr(s.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1; });
  var zonen = kkNorm(s.stZonen);   // Körperkarte: gewählte Muskelzonen
  function artOk(id){ return (!fArt.length || fArt.indexOf(studioArt(id)) > -1) && (!zonen.length || zonePasst(findExercise(id), zonen)); }
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
  var filterAn = fGr.length || fArt.length || zonen.length;
  var kacheln = studioFilterHTML(gruppen, fGr, fArt, studioAnzahl(gruppen, fGr, artOk), zonen);
  var hw = hinweise("studio", ["studioHint"]);
  var html = '<div class="st-gruppe"><div class="section-title">'+esc(t("stFavs"))+'</div>'+
      (favs.length ? '<div class="fig-grid">'+favs.map(studioKachel).join("")+'</div>' : '<div class="fav-empty">'+esc(t("stFavHint"))+'</div>')+'</div>'+
    (zuletzt.length ? '<div class="st-gruppe"><div class="section-title">'+esc(t("stRecent"))+'</div><div class="fig-grid">'+zuletzt.map(studioKachel).join("")+'</div></div>' : '');
  var airZu = [];   // Air-Gruppen ohne Gruppenwahl: zugeklappt am Ende
  gruppen.forEach(function(g){
    if(!g.ids.length && !g.eigene) return;
    if(fGr.length && fGr.indexOf(g.id) < 0) return;
    var ids = g.ids.filter(artOk);
    if(!ids.length && (!g.eigene || filterAn)) return;
    if(g.air && !fGr.length && !fArt.length){ airZu.push({ g:g, ids:ids }); return; }   // mit Ausrüstungs-Chip stehen sie offen
    html += '<div class="st-gruppe"><div class="section-title">'+esc(g.name)+' <span class="lbl-hint">'+ids.length+'</span></div><div class="fig-grid">'+
      ids.map(studioKachel).join("")+
      (g.eigene ? '<button type="button" class="fig-karte st-neu" data-stnew>'+ICON_PLUS+'<span class="fig-name">'+esc(t("stOwnNew"))+'</span></button>' : '')+
    '</div></div>';
  });
  html += studioAirBlockHTML(airZu, studioKachel);
  app.innerHTML =
    topbar(t("timers"), { back:"#home", right:hw.knopf+lupeHTML("st", studioQuery) }) +
    studioTabsHTML("uebungen") +
    hw.z(0, "page-hint")+
    suchFeldHTML(studioQuery, "st", t("stSearch"))+
    kacheln +
    html +
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("stNone"))+'</div>'+
    '<div style="height:40px"></div>';
  bindCommon();
  bindStudioTabs();
  app.querySelectorAll("[data-studio]").forEach(function(b){
    function oeffnen(){ go("#studio/"+b.getAttribute("data-studio")); }
    b.addEventListener("click", oeffnen);
    b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); oeffnen(); } });
    langDruck(b, function(){ exZuProgramm(b.getAttribute("data-studio")); });   // lange drücken: in einen Plan legen
  });
  app.querySelectorAll("[data-exfav]").forEach(function(b){ b.addEventListener("click", function(e){
    e.stopPropagation(); toggleExFav(b.getAttribute("data-exfav"));
    var y = window.scrollY; renderStudio(); window.scrollTo(0, y);
  }); });
  function neuZeichnen(){ var y = window.scrollY; renderStudio(); window.scrollTo(0, y); }
  studioFilterBinden(fGr, fArt, zonen, neuZeichnen);
  var neu = app.querySelector("[data-stnew]");
  if(neu) neu.addEventListener("click", function(){ exEditVorgabe = { equip:["gym"], cats:["weight"], reps:3, work:40, rest:60 }; go("#exedit/new"); });
  var q = app.querySelector("#st-q");
  studioAirBinden(function(){ return studioQuery; });
  function suchen(){
    app.querySelectorAll(".fav-empty").forEach(function(x){ x.style.display = studioQuery ? "none" : ""; });
    applySearch(app, studioQuery);
    studioAirSuche(studioQuery);
    // leere Gruppen ausblenden, „Zuletzt“ nur ohne Suche
    app.querySelectorAll(".st-gruppe").forEach(function(g){
      var sichtbar = Array.prototype.some.call(g.querySelectorAll("[data-q]"), function(k){ return k.style.display !== "none"; });
      g.style.display = sichtbar || (!studioQuery && g.querySelector("[data-stnew]")) ? "" : "none";
    });
  }
  q.addEventListener("input", function(){ studioQuery = q.value; suchen(); });
  if(studioQuery) suchen();
}

/* ============ Timer ============
   Blöcke und Timer-Workouts haben eine eigene Seite (renderIntervall, Schnellwahl auf der Startseite); die Liste baut timerPanelHTML. */
function timerPanelHTML(hw){
  var tws = state.db.workouts.slice().sort(function(a,b){ return (b.updatedAt||0)-(a.updatedAt||0); });
  var bls = state.db.blocks.slice().sort(function(a,b){ return (b.updatedAt||0)-(a.updatedAt||0); });
  return '<div class="timer-panel">'+hw.z(0, "page-hint")+
    '<div class="section-title">'+t("mineTimer")+'</div>'+(tws.length ? tws.map(timerWorkoutRow).join("") : '<div class="fav-empty">'+esc(t("timerNoWo"))+'</div>')+
    '<div class="section-title">'+t("mineBlocks")+'</div>'+(bls.length ? bls.map(blockRow).join("") : '<div class="fav-empty">'+esc(t("timerNoBl"))+'</div>')+'</div>';
}
function timerFabHTML(){
  return fabMenuHTML([{ key:"timerwo", label:t("fabTimerWo"), ico:ICON_WORKOUT, cls:"ti" }, { key:"block", label:t("fabBlock"), ico:ICON_BLOCK, cls:"ti" }]);
}
function studioTabsHTML(tab){
  function b(k, label){ return '<button data-sttab="'+k+'" class="'+(tab === k ? 'active' : '')+'">'+esc(label)+'</button>'; }
  return reiterZeileHTML("var(--bl-color)", b("uebungen", t("libExercises"))+b("plan", t("tabPlan")));
}
function bindStudioTabs(){
  app.querySelectorAll("[data-sttab]").forEach(function(b){
    b.addEventListener("click", function(){
      state.db.settings.stTab = b.getAttribute("data-sttab"); stPlanAktiv = null; stPlanBauen = false;
      save(); renderStudio(); window.scrollTo(0, 0);
    });
  });
}
/* Timer: eigene Seite (früher je ein Reiter in Air und Studio, mit derselben Liste). Erreichbar über die Schnellwahl auf der Startseite.
   Blöcke (eine Übung mit Runden, Arbeit, Pause) und Timer-Workouts (mehrere Blöcke hintereinander) in der Timer-Farbe (--ti-color);
   angelegt werden sie über das Plus. */
function renderIntervall(){
  var hw = hinweise("timer", ["timerHint"]);
  app.innerHTML = topbar(t("tabTimer"), { back:"#home", right:hw.knopf }) + timerPanelHTML(hw) + '<div style="height:90px"></div>' + timerFabHTML();
  bindCommon();
  function neu(){ var y = window.scrollY; renderIntervall(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  on("[data-play]", function(el){ if(!el.disabled) go("#play/"+el.getAttribute("data-play")); });
  on("[data-playblock]", function(el){ go("#playblock/"+el.getAttribute("data-playblock")); });
  on("[data-twplus]", function(el){ openSurprise(el.getAttribute("data-twplus")); });
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  bindTrash(neu);
  bindFabMenu({ "timerwo": function(){ go("#workout/"+createTimerWorkout().id); }, "block": function(){ go("#block/"+createBlock().id); } });
}

/* ============ Studio: Mein Plan ============
   Mehrere eigene Pläne aus Studio-Übungen: settings.stPlaene = [{ id, name, ids:[Übungs-IDs in Reihenfolge], updatedAt }].
   Das Plus legt einen neuen Plan an; Übungen werden wie im Workout-Baukasten von Air durch Antippen gewählt (Nummer = Reihenfolge,
   nochmal antippen = raus). Ein Tipp auf eine Übung im fertigen Plan öffnet ihre Karte zum Eintragen. */
var stPlanAktiv = null, stPlanBauen = false, stPlanQuery = "";
function stPlaene(){ var s = state.db.settings; if(!Array.isArray(s.stPlaene)) s.stPlaene = []; return s.stPlaene; }
function stPlanFind(id){ var l = stPlaene(); for(var i=0;i<l.length;i++) if(l[i].id === id) return l[i]; return null; }
function stPlanIds(p){   // nur Übungen, die es noch gibt, jede nur einmal
  var da = {};
  return (Array.isArray(p.ids) ? p.ids : []).filter(function(id){ if(da[id] || !findExercise(id)) return false; da[id] = true; return true; });
}
function studioSub(id){
  var ex = findExercise(id), e = studioEintrag(id), last = e && e.log && e.log.length ? e.log[e.log.length-1] : null;
  if(studioNurBlock(ex)){ var tb = studioTimer(id); return tb.reps+" × "+tb.work+" s"; }
  return last && last.s.length ? studioKg(last.s[0][0])+" kg · "+last.s.length+" × "+last.s[0][1] : t("stNoData");
}
/* Unter dem Namen einer Kachel: wofür die Übung da ist - die ersten zwei Hauptmuskeln in Kurzform, klein. Ohne Muskeldaten (eigene Übungen) entfällt die Zeile. */
function kachelMuskel(ex){ var m = ex && musclesMain(ex); return m ? '<span class="st-mus">'+esc(m.split(", ").slice(0, 2).join(", "))+'</span>' : ''; }
/* Studio-Kacheln im Plan: Muskeln und - falls schon eingetragen - der letzte Satz bzw. die Zeit (kein „–“ mehr ohne Daten) */
function studioUnter(id){
  var sub = studioSub(id);
  return kachelMuskel(findExercise(id))+(sub === t("stNoData") ? '' : '<span class="st-sub">'+esc(sub)+'</span>');
}
function planAnzahl(n){ return n === 1 ? t("planOne") : t("planN", { n:n }); }
function renderStudioPlan(){
  if(stGen) return renderStudioPlanGen();
  var p = stPlanAktiv && stPlanFind(stPlanAktiv);
  if(!p){ stPlanAktiv = null; return renderStudioPlanListe(); }
  var ids = stPlanIds(p), pos = {}, html;
  ids.forEach(function(id, i){ pos[id] = [i+1]; });
  var hw = stPlanBauen ? hinweise("planbau", ["planTippen"]) : hinweise("", []);
  html = topbar(p.name, { back:"#timers", right:hw.knopf+(stPlanBauen ? lupeHTML("pl", stPlanQuery) : "") }) + studioTabsHTML("plan");
  if(stPlanBauen){
    var gruppen = studioIds(), da = {};
    gruppen.forEach(function(g){ g.ids.forEach(function(id){ da[id] = true; }); });
    // dieselben Filter wie bei Studio › Übungen (Gruppen, Ausrüstung); die Air-Gruppen stehen auch hier zugeklappt unter „Aus Air“
    var s = state.db.settings; studioFilterAlt();
    var fGr = selArr(s.stGruppen), fArt = selArr(s.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1; });
    var zonen = kkNorm(s.stZonen);
    function artOk(id){ return (!fArt.length || fArt.indexOf(studioArt(id)) > -1) && (!zonen.length || zonePasst(findExercise(id), zonen)); }
    var rest = ids.filter(function(id){ return !da[id]; });   // Übungen im Plan, die in keiner Gruppe stehen
    html += '<div class="card"><label for="plan-name">'+t("name")+'</label><input type="text" id="plan-name" value="'+esc(p.name)+'" maxlength="30"></div>'+
      hw.z(0, "page-hint")+suchFeldHTML(stPlanQuery, "pl", t("stSearch"))+
      studioFilterHTML(gruppen, fGr, fArt, studioAnzahl(gruppen, fGr, artOk), zonen);
    if(rest.length) gruppen = gruppen.concat([{ id:"rest", name:t("planSonst"), ids:rest, immer:true }]);
    function planKachel(id){
      var ex = findExercise(id);
      // Angaben wie bei Studio › Übungen: letzter Satz bzw. Zeit unter dem Namen, dazu die Wochenkurve
      return ex ? uebKachel({ bild:id, name:tplText(ex.name), attr:'data-planex="'+id+'"', q:exSearchText(ex), cat:studioFarbe(ex), nr:pos[id] || [],
        unter:studioUnter(id) }) : "";
    }
    var airZu = [];
    gruppen.forEach(function(g){
      if(!g.immer && fGr.length && fGr.indexOf(g.id) < 0) return;
      var gids = g.immer ? g.ids : g.ids.filter(artOk);
      if(!gids.length) return;
      if(g.air && !fGr.length && !fArt.length){ airZu.push({ g:g, ids:gids }); return; }
      html += '<div class="st-gruppe"><div class="section-title">'+esc(g.name)+' <span class="lbl-hint">'+gids.length+'</span></div><div class="fig-grid">'+gids.map(planKachel).join("")+'</div></div>';
    });
    html += studioAirBlockHTML(airZu, planKachel);
    html += '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("stNone"))+'</div>'+
      '<button type="button" class="btn btn-danger" data-plandel style="margin-top:18px;">'+ICON_TRASH+' '+t("planDel")+'</button>'+
      '<div style="height:96px"></div>'+
      '<div class="wb-leiste"><div class="wb-leiste-in"><span><b>'+esc(planAnzahl(ids.length))+'</b></span>'+
      '<span class="wb-knoepfe"><button type="button" class="btn btn-primary" data-plandone>'+ICON_SAVE+' '+t("planDone")+'</button></span></div></div>';
  } else {
    html += '<div class="plan-kopf"><b>'+esc(planAnzahl(ids.length))+'</b><button type="button" class="ghost plan-edit" data-planedit>'+svgIcon(ICON_EDIT)+' '+t("planEdit")+'</button></div>'+
      (ids.length ? auswertungHTML(ids) : '')+
      (ids.length ? '<div class="fig-grid">'+ids.map(function(id, i){
        var ex = findExercise(id);
        return uebKachel({ bild:id, name:tplText(ex.name), attr:'data-studio="'+id+'"', cat:studioFarbe(ex), nr:[i+1], unter:studioUnter(id) });
      }).join("")+'</div>' : '<div class="fav-empty">'+esc(t("planEmpty"))+'</div>')+
      '<div style="height:40px"></div>';
  }
  app.innerHTML = html;
  // Zurück führt zur Plan-Liste, nicht aus dem Studio heraus
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){ stPlanAktiv = null; stPlanBauen = false; stPlanQuery = ""; renderStudio(); window.scrollTo(0, 0); }); }
  bindCommon(); bindStudioTabs();
  function neu(){ var y = window.scrollY; renderStudio(); window.scrollTo(0, y); }
  function an(sel, fn){ var el = app.querySelector(sel); if(el) el.addEventListener("click", fn); }
  an("[data-planedit]", function(){ stPlanBauen = true; stPlanQuery = ""; renderStudio(); window.scrollTo(0, 0); });
  an("[data-plandone]", function(){ stPlanBauen = false; stPlanQuery = ""; renderStudio(); window.scrollTo(0, 0); });
  an("[data-plandel]", function(){
    confirmSheet(t("planDelQ"), "„"+p.name+"“ – "+t("cantUndo"), t("del"), function(){
      state.db.settings.stPlaene = stPlaene().filter(function(x){ return x.id !== p.id; });
      stPlanAktiv = null; stPlanBauen = false; save(); renderStudio(); window.scrollTo(0, 0);
      showToast(t("deletedToast", { n:p.name }));
    });
  });
  var nm = app.querySelector("#plan-name");
  if(nm) nm.addEventListener("input", function(){ p.name = nm.value.trim() || t("planDefault", { n:stPlaene().indexOf(p)+1 }); p.updatedAt = Date.now(); save(); });
  kachelKlick(app, "[data-planex]", function(el){
    var id = el.getAttribute("data-planex"), l = stPlanIds(p), i = l.indexOf(id);
    if(i > -1) l.splice(i, 1); else l.push(id);
    p.ids = l; p.updatedAt = Date.now(); save(); neu();
  });
  kachelKlick(app, "[data-studio]", function(el){ go("#studio/"+el.getAttribute("data-studio")); });
  if(stPlanBauen) studioFilterBinden(selArr(state.db.settings.stGruppen), selArr(state.db.settings.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1; }), kkNorm(state.db.settings.stZonen), neu);
  var q = app.querySelector("#pl-q");
  if(q){
    studioAirBinden(function(){ return stPlanQuery; });
    function suchen(){
      applySearch(app, stPlanQuery);
      studioAirSuche(stPlanQuery);
      app.querySelectorAll(".st-gruppe").forEach(function(g){   // leere Gruppen ausblenden
        g.style.display = Array.prototype.some.call(g.querySelectorAll("[data-q]"), function(k){ return k.style.display !== "none"; }) ? "" : "none";
      });
    }
    q.addEventListener("input", function(){ stPlanQuery = q.value; suchen(); });
    if(stPlanQuery) suchen();
  }
}
function renderStudioPlanListe(){
  var pl = stPlaene().slice().sort(function(a, b){ return (b.updatedAt || 0) - (a.updatedAt || 0); });
  var hw = hinweise("plan", ["planHint"]);
  var html = topbar(t("timers"), { back:"#home", right:hw.knopf }) + studioTabsHTML("plan") + hw.z(0, "page-hint")+
    (pl.length ? pl.map(function(p){
      var ids = stPlanIds(p), namen = ids.slice(0, 3).map(function(id){ return tplText(findExercise(id).name); }).join(", ")+(ids.length > 3 ? " …" : "");
      return '<div class="list-item entry plan-item" data-plan="'+esc(p.id)+'" role="button" tabindex="0">'+
        '<div class="meta"><div class="name">'+esc(p.name)+'</div><div class="sub">'+esc(planAnzahl(ids.length))+(ids.length ? SEP+esc(namen) : '')+'</div></div>'+
        '<div class="card-aside"><div class="card-acts">'+favBtn("plan:"+p.id)+trashBtn("plan", p.id, p.name)+'</div></div></div>';
    }).join("") : '<div class="fav-empty">'+esc(t("planNone"))+'</div>')+
    (pl.length > 1 ? auswertungHTML(pl.reduce(function(a, p){ return a.concat(stPlanIds(p)); }, []), { gesamt:true, titel:t("ausAll") }) : '')+
    '<div style="height:90px"></div>'+fabMenuHTML([{ key:"neu", label:t("planNew"), ico:ICON_PLUS, cls:"bl" }, { key:"gen", label:t("genNew"), ico:ICON_PLUS, cls:"bl" }]);
  app.innerHTML = html;
  bindCommon(); bindStudioTabs();
  function oeffnen(id, bauen){ stPlanAktiv = id; stPlanBauen = bauen; stPlanQuery = ""; renderStudio(); window.scrollTo(0, 0); }
  app.querySelectorAll("[data-plan]").forEach(function(el){
    function los(){ oeffnen(el.getAttribute("data-plan"), false); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.target === el && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); los(); } });
  });
  function neuPl(){ var y = window.scrollY; renderStudio(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-fav]").forEach(function(el){
    el.addEventListener("click", function(e){ e.stopPropagation(); toggleFav(el.getAttribute("data-fav")); neuPl(); });
  });
  bindTrash(neuPl);
  bindFabMenu({ "gen": function(){
    stGen = { w:{ brust:15, ruecken:15, schulter:10, arme:10, rumpf:15, beine:35 }, n:8 };
    renderStudio(); window.scrollTo(0, 0);
  }, "neu": function(){
    var p = { id:uid(), name:t("planDefault", { n:stPlaene().length+1 }), ids:[], updatedAt:Date.now() };
    stPlaene().push(p); save(); oeffnen(p.id, true);
  } });
}

/* ============ Auswertung: Verteilung auf Muskelgruppen ============
   Aus den Hauptmuskeln (EX_MUSCLES) jeder Übung; Hauptmuskeln zählen voll, Hilfsmuskeln mit 0,35.
   Ohne Muskeldaten entscheidet die Kategorie. Nur Anzeige - bewertet wird nichts, ein Leg Day bleibt ein Leg Day. */
var MUSKEL_GRP = [
  { id:"brust",    key:"mgBrust",   re:/brust/ },
  { id:"ruecken",  key:"mgRuecken", re:/rücken|latissimus|rauten|trapez|nacken/ },
  { id:"schulter", key:"mgSchulter", re:/schulter/ },
  { id:"arme",     key:"mgArme",    re:/bizeps|trizeps|unterarm|griff/ },
  { id:"rumpf",    key:"mgRumpf",   re:/bauch|rumpf|schräg|core/ },
  { id:"beine",    key:"mgBeine",   re:/gesäß|oberschenkel|waden|adduktor|abduktor|hüft|schienbein|fuß|bein/ }
];
var MUSKEL_KAT = { chest:"brust", back:"ruecken", arms:"arme", core:"rumpf", legs:"beine" };
function mgVerteilung(ex){
  var res = {}, m = EX_MUSCLES[ex.id];
  function add(text, w){
    var tr = MUSKEL_GRP.filter(function(g){ return g.re.test(text.toLowerCase()); });
    tr.forEach(function(g){ res[g.id] = (res[g.id] || 0) + w/tr.length; });
  }
  if(m){ add(m[0] || "", 1); if(m[1]) add(m[1], 0.35); }
  if(!Object.keys(res).length){
    ex.cats.forEach(function(c){ if(MUSKEL_KAT[c]) res[MUSKEL_KAT[c]] = 1; });
    if(!Object.keys(res).length && ex.cats.indexOf("cardio") > -1) res.beine = 1;
  }
  return res;
}
function mgProzent(ids){   // Zeilen in fester Reihenfolge, Summe 100 (größter Rest)
  var sum = {}, tot = 0;
  ids.forEach(function(id){
    var ex = findExercise(id);
    if(!ex || ex.main === "stretch") return;
    var v = mgVerteilung(ex);
    Object.keys(v).forEach(function(g){ sum[g] = (sum[g] || 0) + v[g]; tot += v[g]; });
  });
  var rows = MUSKEL_GRP.map(function(g){ var raw = tot ? (sum[g.id] || 0)*100/tot : 0; return { g:g.id, key:g.key, pct:Math.floor(raw), rest:raw - Math.floor(raw) }; });
  var diff = tot ? 100 - rows.reduce(function(a, r){ return a + r.pct; }, 0) : 0;
  rows.slice().sort(function(a, b){ return b.rest - a.rest; }).slice(0, diff).forEach(function(r){ r.pct++; });
  return { rows:rows, leer:!tot };
}
/* ============ Körperkarte ============
   Zwei Silhouetten (vorn, hinten), wahlweise grob (10 Zonen) oder fein (21 Zonen, größer dargestellt); gespeichert in settings.kkFein, überall gleich.
   Gerechnet wird immer fein (KK_REGELN über die Muskelnamen in EX_MUSCLES); die grobe Ansicht fasst die feinen Zonen zusammen (KK_F2G).
   Verwendet in der Übungsinfo (trainiert / unterstützt), im Kopf und in der Auswertung eines Workouts (Summe: je öfter, desto kräftiger)
   und als Filter in Air, Studio, Baukasten, Suche und Mobility & Stretch (Zonen antippen). Die Balken der Auswertung bleiben bei den sechs groben Gruppen (MUSKEL_GRP). */
var KK_ZONEN_G = {
  vorn:   { schulter:[[21,32,18,13,6],[61,32,18,13,6]], brust:[[39,34,22,21,8]],
            arme:[[13,45,10,29,5],[77,45,10,29,5],[11,76,9,27,4.5],[80,76,9,27,4.5]],
            rumpf:[[36,57,28,31,9],[40,88,20,8,4]], quad:[[35,99,14,44,6],[51,99,14,44,6]],
            waden:[[37,147,12,44,5],[51,147,12,44,5]] },
  hinten: { schulter:[[21,32,18,13,6],[61,32,18,13,6]], ruecken:[[35,31,30,34,9]], ruecken_u:[[40,67,20,20,7]],
            arme:[[13,45,10,29,5],[77,45,10,29,5],[11,76,9,27,4.5],[80,76,9,27,4.5]],
            gesaess:[[34,89,16,18,7],[50,89,16,18,7]],
            hamstring:[[35,108,14,38,6],[51,108,14,38,6]], waden:[[37,148,12,43,5],[51,148,12,43,5]] }
};
var KK_ZONEN_F = {
  vorn:   { schulter_v:[[29,32,10,13,5],[61,32,10,13,5]], schulter_s:[[21,32,8,13,5],[71,32,8,13,5]],
            brust_o:[[39,34,22,9,5]], brust:[[39,43,22,12,6]],
            bizeps:[[13,45,10,29,5],[77,45,10,29,5]], unterarm:[[11,76,9,27,4.5],[80,76,9,27,4.5]],
            bauch:[[43,57,14,29,6]], schraeg:[[35.5,57,6.5,29,3],[58,57,6.5,29,3]], huefte:[[40,88,20,8,4]],
            abduktor:[[32,90,4.5,13,2.2],[63.5,90,4.5,13,2.2]], quad:[[36,99,9.5,44,5],[54.5,99,9.5,44,5]],
            adduktor:[[45.8,99,3.8,32,1.9],[50.4,99,3.8,32,1.9]], waden:[[38,147,10,44,5],[52,147,10,44,5]] },
  hinten: { schulter_s:[[21,32,7,13,5],[72,32,7,13,5]], schulter_h:[[28,32,11,13,5],[61,32,11,13,5]],
            trapez_o:[[39,29,22,10,6]], rauten:[[41,40,18,16,5]], lat:[[33,47,9,23,4.5],[58,47,9,23,4.5]],
            ruecken_u:[[42,68,16,19,6]], trizeps:[[13,45,10,29,5],[77,45,10,29,5]], unterarm:[[11,76,9,27,4.5],[80,76,9,27,4.5]],
            gesaess:[[37,89,13,17,7],[50,89,13,17,7]], abduktor:[[32,90,4.5,13,2.2],[63.5,90,4.5,13,2.2]],
            hamstring:[[36,108,12,38,6],[52,108,12,38,6]], waden:[[38,148,10,43,5],[52,148,10,43,5]] }
};
/* Reihenfolge der Chips; wichtig = taucht in „Noch nicht dabei“ auf (kleine Hilfsmuskeln nicht) */
var KK_REIHE_G = ["schulter", "brust", "arme", "ruecken", "ruecken_u", "rumpf", "gesaess", "quad", "hamstring", "waden"];
var KK_REIHE_F = ["schulter_v", "schulter_s", "schulter_h", "brust_o", "brust", "bizeps", "trizeps", "unterarm", "trapez_o", "rauten", "lat", "ruecken_u",
                  "bauch", "schraeg", "huefte", "gesaess", "abduktor", "adduktor", "quad", "hamstring", "waden"];
var KK_WICHTIG_G = { schulter:1, brust:1, arme:1, ruecken:1, ruecken_u:1, rumpf:1, gesaess:1, quad:1, hamstring:1, waden:1 };
var KK_WICHTIG_F = { schulter_v:1, schulter_s:1, schulter_h:1, brust:1, bizeps:1, trizeps:1, rauten:1, lat:1, ruecken_u:1, bauch:1, schraeg:1, gesaess:1, quad:1, hamstring:1, waden:1 };
/* feine Zone -> grobe Zone und zurück */
var KK_F2G = { schulter_v:"schulter", schulter_s:"schulter", schulter_h:"schulter", brust_o:"brust", bizeps:"arme", trizeps:"arme", unterarm:"arme",
               trapez_o:"ruecken", rauten:"ruecken", lat:"ruecken", bauch:"rumpf", schraeg:"rumpf", huefte:"rumpf", abduktor:"gesaess", adduktor:"quad" };
var KK_G2F = { schulter:["schulter_v", "schulter_s", "schulter_h"], brust:["brust_o", "brust"], arme:["bizeps", "trizeps", "unterarm"], ruecken:["trapez_o", "rauten", "lat"],
               rumpf:["bauch", "schraeg", "huefte"], gesaess:["gesaess", "abduktor"], quad:["quad", "adduktor"] };
function kkFeinAn(){ return !!state.db.settings.kkFein; }
function kkReihe(){ return kkFeinAn() ? KK_REIHE_F : KK_REIHE_G; }
function kkKarte(){ return kkFeinAn() ? KK_ZONEN_F : KK_ZONEN_G; }
function kkWichtig(z){ return !!(kkFeinAn() ? KK_WICHTIG_F : KK_WICHTIG_G)[z]; }
var KK_SCHULTER = ["schulter_v", "schulter_s"];   // „Schultern“ ohne Zusatz: Drücken und Heben = vorn und seitlich
/* Muskelname (kleingeschrieben) -> feine Zonen; die erste passende Regel gilt, mehrere Zonen teilen sich das Gewicht.
   „§S“ = allgemeine Schultern: bei Ausnahmen (KK_AUSNAHME) werden die Zonen der Übung genommen, sonst KK_SCHULTER */
var KK_REGELN = [
  [/^(ausdauer|gleichgewicht|beweglichkeit|–|-)$/, []],
  [/oberschenkel vorn und hinten/, ["quad", "hamstring"]],
  [/tiefe und schräge bauch/, ["bauch", "schraeg"]],
  [/schräg|sägemuskel/, ["schraeg"]],
  [/seitliche und hintere schulter/, ["schulter_s", "schulter_h"]],
  [/rotatorenmanschette/, ["schulter_h"]],
  [/hüftrotatoren|piriformis/, ["gesaess"]],
  [/hüftstabilisatoren|seitliche[rs]? gesäß|abduktoren|oberschenkel außen/, ["abduktor"]],
  [/adduktoren|innenschenkel/, ["adduktor"]],
  [/gesäß/, ["gesaess"]],
  [/hüftbeuger|^hüfte$/, ["huefte"]],
  [/oberschenkel vorn/, ["quad"]],
  [/oberschenkel hinten/, ["hamstring"]],
  [/oberschenkel/, ["quad", "hamstring"]],
  [/waden|achilles|fuß|schollen|schienbein/, ["waden"]],
  [/^beine$/, ["quad", "hamstring", "gesaess", "waden"]],
  [/wirbelsäule|rückenstrecker|unterer rücken/, ["ruecken_u"]],
  [/breiter rückenmuskel|latissimus/, ["lat"]],
  [/oberer trapez|nacken/, ["trapez_o"]],
  [/mittlerer trapez|unterer trapez|rauten|mittlerer rücken|schulterblatt/, ["rauten"]],
  [/trapez|oberer rücken/, ["trapez_o", "rauten"]],
  [/^rücken$/, ["trapez_o", "rauten", "lat", "ruecken_u"]],
  [/vordere schulter/, ["schulter_v"]],
  [/seitliche schulter/, ["schulter_s"]],
  [/hintere schulter/, ["schulter_h"]],
  [/schulterstabilität|schulterbeweglichkeit/, ["schulter_v", "schulter_s", "schulter_h"]],
  [/schnellkraft/, ["schulter_v", "schulter_s"]],
  [/armschwung/, ["schulter_s"]],
  [/schulter/, ["§S"]],
  [/obere brust/, ["brust_o"]],
  [/brust/, ["brust"]],
  [/trizeps/, ["trizeps"]],
  [/bizeps|oberarmmuskel/, ["bizeps"]],
  [/unterarm/, ["unterarm"]],
  [/gerader bauch|tiefe bauch|^bauch$/, ["bauch"]],
  [/rumpf|bauch/, ["bauch", "schraeg"]]
];
/* Übungen, bei denen „Schultern“ etwas Bestimmtes meint */
var KK_AUSNAHME = {
  "swimmers":["schulter_h"], "mountain-climbers":["schulter_v"], "bear-crawl":["schulter_v"], "plank-steps":["schulter_v"], "plank-shoulder-taps":["schulter_v"],
  "burpees":["schulter_v"], "jump-forward-burpees":["schulter_v"], "muscle-ups":["schulter_v", "schulter_h"], "skin-the-cat":["schulter_v", "schulter_h"],
  "archer-push-ups":["schulter_v"], "kb-clean":["schulter_v", "schulter_s"], "jumping-jacks":["schulter_s"]
};
/* gespeicherte Auswahl (egal ob grob oder fein, auch ältere Namen) in die Zonen der gewählten Ansicht übersetzen; Unbekanntes fällt weg */
var KK_ALT = { trapez:["trapez_o", "rauten"], beine:["quad", "hamstring", "gesaess", "waden"] };
function kkNorm(zonen){
  var out = [], fein = kkFeinAn(), reihe = kkReihe();
  selArr(zonen).forEach(function(z){
    (KK_ALT[z] || [z]).forEach(function(x){
      (fein ? (KK_G2F[x] || [x]) : [KK_F2G[x] || x]).forEach(function(y){ if(reihe.indexOf(y) > -1 && out.indexOf(y) < 0) out.push(y); });
    });
  });
  return out;
}
function kkName(zone){ return t("kkZ_"+zone); }
/* feine Werte in die gewählte Ansicht übertragen (grob: je Gruppe addiert) */
function kkAgg(m){
  if(kkFeinAn()) return m;
  var o = {};
  Object.keys(m).forEach(function(z){ var g = KK_F2G[z] || z; o[g] = (o[g] || 0) + m[z]; });
  return o;
}
/* Zonen eines Muskeltextes („Oberschenkel vorn, Gesäß“); gew = Gewicht je Muskelname; unb sammelt Namen ohne Regel;
   schulter = Zonen für allgemeine „Schultern“ (aus KK_AUSNAHME) */
function kkZonenVon(text, gew, unb, schulter){
  var res = {};
  String(text || "").toLowerCase().split(/,\s*/).forEach(function(teil){
    teil = teil.trim();
    if(!teil) return;
    for(var i = 0; i < KK_REGELN.length; i++){
      if(KK_REGELN[i][0].test(teil)){
        var z = KK_REGELN[i][1];
        if(z[0] === "§S") z = schulter || KK_SCHULTER;
        z.forEach(function(x){ res[x] = (res[x] || 0) + gew/z.length; });
        return;
      }
    }
    if(unb) unb.push(teil);
  });
  return res;
}
var KK_GRUPPE_ZONEN = { brust:["brust_o", "brust"], ruecken:["trapez_o", "rauten", "lat", "ruecken_u"], schulter:["schulter_v", "schulter_s"], arme:["bizeps", "trizeps", "unterarm"], rumpf:["bauch", "schraeg"], beine:["quad", "hamstring", "gesaess", "waden"] };
/* Haupt- und Hilfszonen (fein) einer Übung; ohne Muskeltext entscheidet die grobe Gruppe (Kategorie) */
function kkFein(ex){
  var m = EX_MUSCLES[ex.id], haupt = {}, hilfe = {}, sch = KK_AUSNAHME[ex.id];
  if(m){ haupt = kkZonenVon(m[0], 1, null, sch); hilfe = kkZonenVon(m[1], .35, null, sch); }
  if(!Object.keys(haupt).length){
    Object.keys(mgVerteilung(ex)).forEach(function(g){
      var z = KK_GRUPPE_ZONEN[g] || [];
      z.forEach(function(x){ haupt[x] = (haupt[x] || 0) + 1/z.length; });
    });
  }
  return { haupt:haupt, hilfe:hilfe };
}
/* Muskelnamen in EX_MUSCLES, für die keine Regel passt (der Schnelltest prüft, dass es keine gibt) */
function kkUnbekannt(){
  var unb = [];
  Object.keys(EX_MUSCLES).forEach(function(id){ kkZonenVon(EX_MUSCLES[id][0], 1, unb); kkZonenVon(EX_MUSCLES[id][1], 1, unb); });
  return unb;
}
/* wert: { zone: 0..1 } (Anteil der Akzentfarbe); opt.sel: gewählte Zonen; opt.attr: z. B. "data-lfzone" macht die Zonen antippbar */
function koerperSVG(seite, wert, opt){
  opt = opt || {}; wert = wert || {};
  var karte = kkKarte(), sel = selArr(opt.sel), s = '<svg class="kk" viewBox="0 0 100 200" role="img" aria-label="'+esc(t(seite === "vorn" ? "kkVorn" : "kkHinten"))+'">'+
    '<circle class="hd" cx="50" cy="14" r="10"/><rect class="hd" x="45" y="23" width="10" height="8" rx="3"/>';
  Object.keys(karte[seite]).forEach(function(z){
    var v = Math.max(0, Math.min(1, wert[z] || 0)), an = sel.indexOf(z) > -1;
    s += '<g class="z'+(v ? ' an' : '')+(an ? ' sel' : '')+'" style="--p:'+Math.round(v*100)+'%"'+(opt.attr ? ' '+opt.attr+'="'+z+'" role="button" tabindex="0" aria-pressed="'+an+'" aria-label="'+esc(kkName(z))+'"' : '')+'>'+
      karte[seite][z].map(function(r){ return '<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx="'+r[4]+'"/>'; }).join("")+'</g>';
  });
  return s+'</svg>';
}
function koerperPaar(wert, opt){
  return '<div class="kk-paar'+(kkFeinAn() ? ' fein' : '')+'"><figure>'+koerperSVG("vorn", wert, opt)+'<figcaption>'+esc(t("kkVorn"))+'</figcaption></figure>'+
    '<figure>'+koerperSVG("hinten", wert, opt)+'<figcaption>'+esc(t("kkHinten"))+'</figcaption></figure></div>';
}
/* Umschalter Grob · Fein (Unterstrich wie die anderen Schalter); gilt überall, ex = Übung, wenn er in einer Übungsinfo steht */
function kkModusHTML(ex){
  var f = kkFeinAn();
  function knopf(wert, an, text){ return '<button type="button" data-kkmodus="'+wert+'" class="'+(an ? 'on' : '')+'" aria-pressed="'+an+'">'+esc(text)+'</button>'; }
  return '<div class="kk-modus" role="group" aria-label="'+esc(t("kkDetail"))+'"'+(ex ? ' data-kkex="'+esc(ex.id)+'"' : '')+'>'+
    knopf("grob", !f, t("kkGrob"))+knopf("fein", f, t("kkFein"))+'</div>';
}
/* Hauptzonen und unterstützende Zonen einer Übung als Mengen (in der gewählten Ansicht) */
function kkTeile(ex){
  var f = kkFein(ex), h = kkAgg(f.haupt), l = kkAgg(f.hilfe), haupt = {}, hilfe = {};
  Object.keys(h).forEach(function(z){ if(h[z] > 0) haupt[z] = 1; });
  Object.keys(l).forEach(function(z){ if(l[z] > 0 && !haupt[z]) hilfe[z] = 1; });
  return { haupt:haupt, hilfe:hilfe };
}
/* Übungsinfo: kleine Silhouetten; antippen vergrößert sie und nennt die Zonen beim Namen (kkInfoBinden) */
function kkInfoHTML(ex){
  var tl = kkTeile(ex), w = {};
  Object.keys(tl.hilfe).forEach(function(z){ w[z] = .38; });
  Object.keys(tl.haupt).forEach(function(z){ w[z] = 1; });
  function namen(m){ return kkReihe().filter(function(z){ return m[z]; }).map(kkName).join(", "); }
  return '<button type="button" class="info-kk-knopf'+(kkFeinAn() ? ' fein' : '')+'" data-kkgross aria-expanded="false" aria-label="'+esc(t("kkGross"))+'">'+koerperPaar(w)+'</button>'+
    '<div class="info-kk-liste" hidden><div><span class="kk-punkt haupt"></span><b>'+esc(t("kkTrainiert"))+':</b> '+esc(namen(tl.haupt))+'</div>'+
    (Object.keys(tl.hilfe).length ? '<div><span class="kk-punkt hilfe"></span><b>'+esc(t("musAssist"))+':</b> '+esc(namen(tl.hilfe))+'</div>' : '')+'</div>'+
    kkModusHTML(ex);
}
/* Ein Tipp auf die kleinen Silhouetten vergrößert sie und zeigt die Zonen mit Namen (gilt für alle Übungsinfos, auch im Studio) */
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-kkgross]");
  if(!b) return;
  var box = b.closest(".info-mus"), auf = !box.classList.contains("gross");
  box.classList.toggle("gross", auf);
  b.setAttribute("aria-expanded", String(auf));
  box.querySelector(".info-kk-liste").hidden = !auf;
});
/* Grob · Fein umschalten: gilt für die ganze App; eine offene Übungsinfo wird an Ort und Stelle neu gezeichnet, sonst die Seite */
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-kkmodus]");
  if(!b) return;
  var fein = b.getAttribute("data-kkmodus") === "fein";
  if(fein === kkFeinAn()) return;
  state.db.settings.kkFein = fein; save();
  var box = b.closest(".info-mus"), id = b.parentNode.getAttribute("data-kkex"), ex = id && findExercise(id);
  if(box && ex){
    var gross = box.classList.contains("gross");
    ["info-kk-knopf", "info-kk-liste", "kk-modus"].forEach(function(c){ var el = box.querySelector("."+c); if(el) el.parentNode.removeChild(el); });
    box.insertAdjacentHTML("beforeend", kkInfoHTML(ex));
    if(gross){ box.querySelector(".info-kk-knopf").setAttribute("aria-expanded", "true"); box.querySelector(".info-kk-liste").hidden = false; }
    return;
  }
  var y = window.scrollY; render(); window.scrollTo(0, y);
});
/* Summe über mehrere Übungen: Hauptmuskeln zählen voll, Hilfsmuskeln mit 0,35 (wie die Auswertung); je höher die Summe, desto kräftiger.
   Dehnübungen zählen nur, wenn auchDehnen gesetzt ist (Mobility & Stretch) */
function kkSumme(ids, auchDehnen){
  var sum = {};
  ids.forEach(function(id){
    var ex = findExercise(id);
    if(!ex || (ex.main === "stretch" && !auchDehnen)) return;
    var f = kkFein(ex);
    Object.keys(f.haupt).forEach(function(z){ sum[z] = (sum[z] || 0) + f.haupt[z]; });
    Object.keys(f.hilfe).forEach(function(z){ sum[z] = (sum[z] || 0) + f.hilfe[z]; });
  });
  return kkAgg(sum);
}
function kkStufe(summe){ return 1 - Math.pow(.55, summe || 0); }
function kkSummeHTML(ids){
  var sum = kkSumme(ids), w = {}, leer = [];
  kkReihe().forEach(function(z){ w[z] = kkStufe(sum[z]); if(kkWichtig(z) && (sum[z] || 0) < .3) leer.push(kkName(z)); });
  return '<div class="kk-summe">'+kkModusHTML()+koerperPaar(w)+'<p class="kk-note">'+esc(leer.length ? t("kkLuecken", { n:leer.join(", ") }) : t("kkAlle"))+'</p>'+
    '<div class="kk-skala" aria-hidden="true"><span>'+esc(t("kkWenig"))+'</span><i></i><span>'+esc(t("kkOft"))+'</span></div></div>';
}
/* Kompakte Körperkarte für den Kopf eines Workouts (Deckblatt, Baukasten): Silhouetten plus drei Zeilen - viel trainiert, nur am Rande, Lücken */
function kkKopfHTML(ids, auchDehnen){
  var sum = kkSumme(ids, auchDehnen), w = {}, viel = [], rand = [], leer = [], max = 0, reihe = kkReihe();
  reihe.forEach(function(z){ max = Math.max(max, sum[z] || 0); });
  if(!max) return "";
  var schwelle = Math.max(1.8, max*.7);
  reihe.forEach(function(z){
    var v = sum[z] || 0;
    w[z] = kkStufe(v);
    if(v >= schwelle) viel.push(z); else if(v < .3){ if(kkWichtig(z)) leer.push(z); } else if(v < 1) rand.push(z);
  });
  function zeile(kl, key, zonen){ return zonen.length ? '<div class="kk-zeile '+kl+'"><b>'+esc(t(key))+'</b> '+esc(zonen.map(kkName).join(", "))+'</div>' : ''; }
  return '<div class="kk-kopf">'+koerperPaar(w)+'<div class="kk-kopf-txt">'+
    zeile("viel", "kkViel", viel)+zeile("rand", "kkRand", rand)+
    (leer.length ? zeile("luecke", "kkLueckeKurz", leer) : '<div class="kk-zeile ok">'+esc(t("kkKeineLuecke"))+'</div>')+
    '<div class="kk-skala" aria-hidden="true"><span>'+esc(t("kkWenig"))+'</span><i></i><span>'+esc(t("kkOft"))+'</span></div>'+kkModusHTML()+'</div></div>';
}
/* Filter: Zonen antippen (mehrere möglich) */
function zonePasst(ex, zonen){
  zonen = kkNorm(zonen);
  if(!zonen.length) return true;
  if(!ex) return false;
  var h = kkTeile(ex).haupt;
  return zonen.some(function(z){ return h[z]; });
}
function kkFilterHTML(attr, sel){
  sel = kkNorm(sel);
  var w = {};
  sel.forEach(function(z){ w[z] = 1; });
  return '<div class="af-lbl">'+esc(t("kkFilter"))+' <span>'+esc(t("kkMehrere"))+'</span></div>'+kkModusHTML()+
    '<div class="kk-filter">'+koerperPaar(w, { sel:sel, attr:attr })+'</div>'+
    '<div class="fc-chips kk-chips">'+kkReihe().map(function(z){ return filterChip(attr, z, sel.indexOf(z) > -1, "", kkName(z)); }).join("")+'</div>';
}
function auswertungHTML(ids, opt){
  opt = opt || {};
  var r = mgProzent(ids), notiz;
  if(r.leer) notiz = t("ausEmpty");
  else if(opt.gesamt || opt.woche){
    var wenig = r.rows.filter(function(x){ return x.pct < 8; }).map(function(x){ return t(x.key); });
    notiz = wenig.length ? t(opt.woche ? "ausWoNote" : "ausAllNote", { n:wenig.join(", ") }) : t(opt.woche ? "ausWoOk" : "ausAllOk");
  } else notiz = t("ausNote");
  return '<details class="ausw card"'+(opt.offen ? ' open' : '')+'><summary><span class="ausw-t">'+esc(opt.titel || t("ausTitle"))+'</span><span class="ausw-s">'+esc(opt.sub || t("ausSum"))+'</span></summary>'+
    (r.leer ? '' : kkSummeHTML(ids))+
    (r.leer ? '' : r.rows.map(function(x){
      return '<div class="ausw-row'+(x.pct ? '' : ' null')+'"><span class="ausw-n">'+esc(t(x.key))+'</span>'+
        '<span class="ausw-bar"><i style="width:'+x.pct+'%"></i></span><b>'+x.pct+'%</b></div>';
    }).join(""))+
    '<div class="ausw-note">'+esc(notiz)+'</div></details>';
}
/* Plan nach Gewichtung: Reglerwerte 0-10 je Gruppe, Anzahl der Übungen; verteilt nach größtem Rest und zieht passende Studio-Übungen */
var stGen = null;   // { w:{gruppe:0-10}, n } solange die Seite offen ist
function stGenBauen(w, n){
  var tot = MUSKEL_GRP.reduce(function(a, g){ return a + (w[g.id] || 0); }, 0);
  if(!tot) return [];
  var q = MUSKEL_GRP.map(function(g){ var raw = (w[g.id] || 0)*n/tot; return { g:g.id, k:Math.floor(raw), rest:raw - Math.floor(raw) }; });
  var diff = n - q.reduce(function(a, x){ return a + x.k; }, 0);
  q.slice().sort(function(a, b){ return b.rest - a.rest; }).slice(0, diff).forEach(function(x){ x.k++; });
  var pools = {}, dazu = {};
  studioIds().filter(function(gr){ return !gr.air; }).forEach(function(gr){ gr.ids.forEach(function(id){   // nur Studio-Übungen, keine Air-Gruppen
    var ex = findExercise(id); if(!ex || ex.main === "stretch" || dazu[id]) return;
    dazu[id] = true;
    var v = mgVerteilung(ex), best = null;
    Object.keys(v).forEach(function(g){ if(best === null || v[g] > v[best]) best = g; });
    if(best) (pools[best] = pools[best] || []).push(id);
  }); });
  var aus = [];
  q.forEach(function(x){ shuffle(pools[x.g] || []).slice(0, x.k).forEach(function(id){ aus.push(id); }); });
  return aus;
}
function renderStudioPlanGen(){
  var w = stGen.w;
  var html = topbar(t("genTitle"), { back:"#timers" }) + studioTabsHTML("plan") + '<div class="page-hint">'+esc(t("genHint"))+'</div><div class="card gen-card">'+
    MUSKEL_GRP.map(function(g){
      return '<div class="gen-row"><label for="gw-'+g.id+'">'+esc(t(g.key))+'</label><input type="range" id="gw-'+g.id+'" data-gw="'+g.id+'" min="0" max="100" step="1" value="'+(w[g.id] || 0)+'">'+
        '<b data-gp="'+g.id+'">'+(w[g.id] || 0)+'%</b></div>';
    }).join("")+
    '<div class="gen-row"><label for="gw-n">'+esc(t("genAnz"))+'</label><input type="range" id="gw-n" min="3" max="20" step="1" value="'+stGen.n+'"><b data-gn>'+stGen.n+'</b></div></div>'+
    '<button type="button" class="btn btn-primary" data-genmake>'+ICON_SAVE+' '+t("genMake")+'</button><div style="height:40px"></div>';
  app.innerHTML = html;
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){ stGen = null; renderStudio(); window.scrollTo(0, 0); }); }
  bindCommon(); bindStudioTabs();
  /* Es sind immer genau 100 % zu verteilen: Wer einen Regler verschiebt, nimmt den anderen im gleichen Verhältnis etwas weg bzw. gibt ihnen etwas */
  function verteilen(id, v){
    var andere = MUSKEL_GRP.filter(function(g){ return g.id !== id; }), rest = 100 - v;
    var so = andere.reduce(function(a, g){ return a + (w[g.id] || 0); }, 0), sum = 0, gross = andere[0];
    andere.forEach(function(g){
      w[g.id] = so ? Math.round((w[g.id] || 0)*rest/so) : Math.round(rest/andere.length);
      sum += w[g.id];
      if(w[g.id] > w[gross.id]) gross = g;
    });
    w[gross.id] = Math.max(0, w[gross.id] + rest - sum);   // Rundungsrest
    w[id] = v;
    MUSKEL_GRP.forEach(function(g){
      var r = app.querySelector("#gw-"+g.id), b = app.querySelector('[data-gp="'+g.id+'"]');
      if(r) r.value = w[g.id];
      if(b) b.textContent = w[g.id]+"%";
    });
  }
  app.querySelectorAll("[data-gw]").forEach(function(el){ el.addEventListener("input", function(){ verteilen(el.getAttribute("data-gw"), +el.value); }); });  var nn = app.querySelector("#gw-n");
  nn.addEventListener("input", function(){ stGen.n = +nn.value; app.querySelector("[data-gn]").textContent = nn.value; });
  app.querySelector("[data-genmake]").addEventListener("click", function(){
    var ids = stGenBauen(w, stGen.n);
    if(!ids.length){ showToast(t("genZero")); return; }
    var p = { id:uid(), name:t("genName"), ids:ids, updatedAt:Date.now() };
    stPlaene().push(p); save();
    stGen = null; stPlanAktiv = p.id; stPlanBauen = false; stPlanQuery = "";
    renderStudio(); window.scrollTo(0, 0);
  });
}

/* Vorschlag für den nächsten Satz: heute der letzte Satz, sonst Arbeitsgewicht bzw. letztes Mal */
function studioVorschlag(id){
  if(studioPR && studioPR.id !== id) studioPR = null;
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
      (EX_MUSCLES[id] ? '<div class="info-mus"><div class="info-mus-t"><div><b>'+esc(musclesLabel(ex))+':</b> '+esc(musclesMain(ex))+'</div>'+
        (musclesAssist(ex) ? '<div class="info-mus-2">'+esc(t("musAssist"))+': '+esc(musclesAssist(ex))+'</div>' : '')+'</div>'+kkInfoHTML(ex)+'</div>' : '')+
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
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a> · <a href="quellen.html" target="_blank" rel="noopener">'+t("sourcesLink")+'</a></p>'+
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
var studioPR = null;   // { id, kg, w, vorher } - zeigt nach einem Satz mit neuem Bestgewicht eine ruhige Zeile auf der Karte
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
      (studioPR ? '<div class="st-pr" role="status"><span class="st-pr-stern" aria-hidden="true">★</span><div><b>'+esc(t("stPrTitel"))+'</b><small>'+esc(t("stPrText", { kg:studioKg(studioPR.kg), w:studioPR.w, v:studioKg(studioPR.vorher) }))+'</small></div></div>' : '')+
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
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a> · <a href="quellen.html" target="_blank" rel="noopener">'+t("sourcesLink")+'</a></p>'+
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
    var vorher = 0;   // bisheriges Bestgewicht (vor diesem Satz)
    en.log.forEach(function(lg){ lg.s.forEach(function(x){ if(x[0] > vorher) vorher = x[0]; }); });
    if(!l){ l = { at:jetzt, s:[] }; en.log.push(l); if(en.log.length > 60) en.log = en.log.slice(-60); }
    l.s.push([kg, w]);
    studioPR = vorher > 0 && kg > vorher ? { id:id, kg:kg, w:w, vorher:vorher } : null;
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
    studioPR = null;
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
  if(!e){ e = { at:jetzt, ex:[], dur:0, studio:jetzt, b:"timer" }; hs.push(e); }
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
  app.querySelectorAll("[data-hinweis]").forEach(function(b){ b.addEventListener("click", openHinweise); });
  app.querySelectorAll("[data-lupe]").forEach(function(b){
    b.addEventListener("click", function(){
      var pre = b.getAttribute("data-lupe"), w = app.querySelector('.lib-suche[data-lsw="'+pre+'"]'), q = app.querySelector("#"+pre+"-q");
      if(!w) return;
      if(w.classList.toggle("offen") && q) q.focus();
    });
  });
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
  if(!b){ goBack("#intervall"); return; }
  app.innerHTML =
    topbar(t("editBlock"), { back:"#intervall" }) +
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
  if(!w){ goBack("#intervall"); return; }

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
    topbar(t("workout"), { back:"#intervall", right:istNeu ? '' : '<button class="iconbtn" data-play title="'+t("start")+'">'+ICON_PLAY+'</button>' }) +
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
    goBack("#intervall");
  });

  app.querySelector("[data-delete]").addEventListener("click", function(){
    if(istNeu){ neuEntwurf = null; goBack("#intervall"); return; }
    confirmSheet(t("deleteWorkoutQ"), t("cantUndo"), t("del"), function(){
      deleteTimerWorkoutNow(id);
      goBack("#intervall");
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
      if(tw) e = { name:tw.name || t("untitled"), sub:fmtDuration(workoutDuration(tw)), cls:"ti", go:"#play/"+id, ok:tw.items.length > 0 };
    } else if(kind==="bl"){
      var bl = findBlock(id);
      if(bl && state.db.blocks.indexOf(bl) > -1) e = { name:bl.name, sub:blockSpec(bl), cls:"ti", go:"#playblock/"+id, ok:true };
    } else if(kind==="lib"){
      var lw = findLibWorkout(id);
      if(lw) e = { name:tplText(lw.name), sub:fmtDuration(workoutDuration(libWorkoutRun(lw))), cls:libIstWarmDehn(lw) ? "ws" : "tp", cover:"lib/"+id, ok:true };
    } else if(kind==="my"){
      var mw = findMy(id);
      if(mw) e = { name:mw.name, sub:fmtDuration(workoutDuration(myRun(mw))), cls:mw.ws ? "ws" : "tp", cover:"my/"+id, ok:mw.items.length > 0 };
    } else if(kind==="plan"){   // Studio › Mein Plan
      var pl = stPlanFind(id);
      if(pl) e = { name:pl.name, sub:planAnzahl(stPlanIds(pl).length), cls:"st", go:"#studioplan/"+id, ok:true };
    } else if(kind==="rep"){    // Summit › eigenes Programm bzw. eigene Einheit
      var rq = repQuelle(id);
      if(rq){ var rr = repQRunden(rq); e = { name:rq.name, sub:(rr===1 ? t("repRound1") : t("repRoundsN", { n:rr }))+" · "+t("repReps", { n:repQWdh(rq) }), cls:"rep", go:"#rep/"+id, ok:true }; }
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
/* Pfad-Symbole für Menüs (openActionSheet setzt sie in ein eigenes SVG) */
var P_PLUS = '<path d="M12 5v14M5 12h14"/>', P_PLAY = '<path d="M7 4l13 8-13 8z"/>', P_CHECK = '<path d="M5 12.5l4.5 4.5L19 7"/>', P_TRASH = '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>';
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
/* Übung per Langdruck in ein bestehendes Programm legen: Air-Übungen in eigene Air-Workouts und in Studio-Pläne,
   Studio-Geräte (nur im Studio) ausschließlich in Studio-Pläne - Air bekommt nie Studio-Übungen */
function exZuProgramm(id, ws){   // ws: „warm“ / „dehn“ aus Mobility & Stretch - dann nur eigene Workouts dieses Bereichs
  var ex = findExercise(id);
  if(!ex || (ex.main === "stretch" && !ws)) return;
  var name = tplText(ex.name), s = state.db.settings;
  function fertig(pname, schon){ showToast(t(schon ? "zpAlready" : "zpAdded", { e:name, p:pname })); }
  function inWorkout(mw){
    mw = normMy(mw);
    if(mw.items.some(function(it){ return it.ex === id; })) return fertig(mw.name, true);
    mw.items.push(itemFromEx(id)); mw.updatedAt = Date.now(); save(); fertig(mw.name);
  }
  function inPlan(p){
    var l = stPlanIds(p);
    if(l.indexOf(id) > -1) return fertig(p.name, true);
    l.push(id); p.ids = l; p.updatedAt = Date.now(); save(); fertig(p.name);
  }
  function workoutWahl(){
    var acts = (state.db.myWorkouts || []).filter(function(mw){ return (mw.ws || "") === (ws || ""); })
      .map(function(mw){ return { ico:HOME_ICON.lib, label:mw.name, fn:function(){ inWorkout(mw); } }; });
    acts.push({ ico:P_PLUS, label:t(ws ? "wsNew" : "myNew"), fn:function(){
      var mw = createMyFromDraft({ name:t("myDefaultName"), mode:"individual", reps:6, work:30, rest:10, blockRest:45, items:[itemFromEx(id)], ws:ws });
      fertig(mw.name);
    } });
    openActionSheet(t("zpPickWo"), acts);
  }
  function planWahl(){
    var acts = stPlaene().slice().sort(function(a, b){ return (b.updatedAt || 0) - (a.updatedAt || 0); })
      .map(function(p){ return { ico:HOME_ICON.timer, label:p.name, fn:function(){ inPlan(p); } }; });
    acts.push({ ico:P_PLUS, label:t("planNew"), fn:function(){
      var p = { id:uid(), name:t("planDefault", { n:stPlaene().length+1 }), ids:[id], updatedAt:Date.now() };
      stPlaene().push(p); save(); fertig(p.name);
    } });
    openActionSheet(t("zpPickPlan"), acts);
  }
  if(ws) return workoutWahl();   // Mobility & Stretch: direkt die eigenen Workouts dieses Bereichs
  var acts = [];
  if(fuerWorkout(ex)) acts.push({ ico:HOME_ICON.lib, label:t("zpAir"), fn:workoutWahl });
  acts.push({ ico:HOME_ICON.timer, label:t("zpStudio"), fn:planWahl });
  openActionSheet(name, acts);
}
function moreBtn(attr, val, label){
  return '<button type="button" class="more-btn" '+attr+'="'+esc(val)+'" title="'+esc(label||t("more"))+'" aria-label="'+esc(label||t("more"))+'">'+ICON_DOTS+'</button>';
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
    '<div class="sub">'+mainTagsHTML(mains)+t("exCount", { n:exs.length })+SEP+fmtDauerKurz(dur)+'</div>'+
    '</div>'+
    '<div class="card-aside"><div class="card-acts">'+
      (hidden ? '<button type="button" class="tpl-adopt" data-unhideone="wo:'+lw.id+'">'+svgIcon(ICON_EYE)+' '+t("unhide")+'</button>'
              : favBtn("lib:"+lw.id)+moreBtn("data-womore", lw.id))+
    '</div></div></div>';
}
/* Quadratische Übungskachel wie im Studio (Air › Übungen, Mobility & Stretch › Übungen): Figur, Name, darunter die Hauptmuskeln in Kurzform.
   Tippen = Übungsinfo (eigene Übung: bearbeiten), ▶ unten links = starten, ☆ = merken, lange drücken = in Workout oder Plan legen;
   unten rechts auf der Figur das Gerät, falls eines gebraucht wird. */
function libExKachel(ex){
  var g = ex.equip[0], geraet = g && g !== "none" && EQUIP_ICON[g]
    ? '<span class="air-gear" aria-label="'+esc(exEquipText(ex))+'">'+svgIcon(EQUIP_ICON[g])+'</span>' : '';   // Kurzhantel, Kettlebell, Stange, Dip-Barren; ohne Geräte nichts
  return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:(ex.custom ? 'data-exedit="' : 'data-info="')+ex.id+'" data-exlang="'+ex.id+'"', q:exSearchText(ex),
    cat:'var(--bereich, '+catVar(ex.cats[0])+')', klasse:'air-kachel', ico:ex.custom ? catIcon(ex.cats[0]) : "",
    innen:exFavBtn(ex.id)+geraet+'<button type="button" class="air-start" data-playex="'+ex.id+'" title="'+esc(t("startBlock"))+'" aria-label="'+esc(t("startBlock"))+'">'+ICON_PLAY+'</button>',
    unter:kachelMuskel(ex) });
}
function airKachelBinden(){   // Enter/Leertaste wie ein Tippen
  app.querySelectorAll(".air-kachel").forEach(function(el){
    el.addEventListener("keydown", function(e){ if(e.target === el && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); el.click(); } });
  });
}
function libExCard(ex, hidden, sub){
  var bild = ILLU[ex.id]
    ? '<button type="button" class="illu-btn" data-info="'+ex.id+'" aria-label="'+t("info")+'">'+illuHTML(ex.id, "lib-illu")+'</button>'
    : (ex.custom ? '<button type="button" class="illu-btn" data-exedit="'+ex.id+'" aria-label="'+t("edit")+'"><span class="custom-ico">'+catIcon(ex.cats[0])+'</span></button>' : '');
  var mus = musclesMain(ex);
  return '<div class="list-item entry tpl-item lib-card'+(ex.id==="russian-twists"?' ua':'')+(isExFav(ex.id)?' ex-fav-on':'')+(hidden?' is-hidden':'')+'" style="--cat:var(--bereich, '+catVar(ex.cats[0])+')" data-q="'+esc(exSearchText(ex))+'"'+' data-exlang="'+ex.id+'">'+
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
/* Gemeinsame Filterkarte (Air, Baukasten, Studio, Mobility & Stretch, Summit). Zu: eine Zeile mit Zusammenfassung, was gerade gilt.
   Auf: Gruppen von Chips (Training, Ausrüstung …) und unten „Zurücksetzen“ + „N … anzeigen“ (klappt zu). Auf/Zu merkt sich der Bereich selbst.
   o: { offen, toggle:"data-xtoggle", reset:"data-xfreset", n:Anzahl aktiver Filter, summe:Text der Kopfzeile, inhalt:HTML, zeigen:Text des Knopfes } */
function filterKarteHTML(o){
  var body = '';
  if(o.offen){
    body = '<div class="af-body">'+o.inhalt+
      '<div class="btn-row af-fuss">'+
        '<button type="button" class="btn btn-secondary af-reset" '+o.reset+(o.n ? '' : ' disabled')+'>'+svgIcon(ICON_RESET)+t("filterReset")+'</button>'+
        '<button type="button" class="btn btn-primary" '+o.toggle+'>'+esc(o.zeigen)+'</button>'+
      '</div></div>';
  }
  return '<div class="card air-filter'+(o.offen ? ' offen' : '')+'">'+
    '<div class="af-reihe">'+
    '<button type="button" class="af-kopf" '+o.toggle+' aria-expanded="'+!!o.offen+'">'+svgIcon(ICON_FILTER)+
      '<span class="af-titel"><b>'+t("filter")+'</b><small>'+esc(o.summe)+'</small></span>'+
      (o.n ? '<span class="af-n">'+o.n+'</span>' : '')+
      '<span class="tpl-chev'+(o.offen ? '' : ' zu')+'" aria-hidden="true">&#9662;</span></button>'+
    (o.extra || '')+
    '</div>'+
    body+
  '</div>';
}
function filterChipsHTML(lbl, hint, chips){
  return '<div class="af-lbl">'+esc(lbl)+(hint ? ' <span>'+esc(hint)+'</span>' : '')+'</div><div class="fc-chips">'+chips+'</div>';
}
function filterChip(attr, wert, an, ico, text){
  return '<button type="button" class="fc-chip'+(an ? ' on' : '')+'" '+attr+'="'+wert+'" aria-pressed="'+!!an+'">'+(ico || '')+esc(text)+'</button>';
}
/* Text des unteren Knopfes: „12 Workouts anzeigen“. art: Wo (Workouts) · Ex (Übungen) · Ei (Einheiten) · Pr (Programme) */
function filterZeigenText(n, art){ return n ? t("af"+art+(n === 1 ? "1" : "N"), { n:n }) : t("afNull"); }
/* Air (Bibliothek und Baukasten): Training, Ausrüstung, Sortierung. Studio-Ausrüstung („Fitnessstudio“) gibt es hier nicht. */
function airFilterHTML(pre, offen, cat, equip, sort, sortOpts, n, uebung, zonen){
  cat = selArr(cat); equip = selArr(equip); var mitZonen = zonen !== undefined; zonen = selArr(zonen);
  var namen = cat.map(catName).concat(equip.map(equipName), zonen.map(kkName));
  return filterKarteHTML({ offen:offen, toggle:'data-'+pre+'toggle', reset:'data-'+pre+'freset', n:namen.length,
    summe:namen.length ? namen.join(", ") : t(uebung ? "afAlleEx" : "afAlleWo"),
    zeigen:filterZeigenText(n, uebung ? "Ex" : "Wo"),
    inhalt:filterChipsHTML(t("afTraining"), "", LIB_CATS.filter(function(c){ return c.id !== "stretch"; }).map(function(c){
        return filterChip('data-'+pre+'fcat', c.id, cat.indexOf(c.id) > -1, catIcon(c.id), tplText(c)); }).join(""))+
      filterChipsHTML(t("equipHave"), "", EQUIPS.filter(function(e){ return e.id !== "gym"; }).map(function(e){
        return filterChip('data-'+pre+'fequip', e.id, equip.indexOf(e.id) > -1, svgIcon(EQUIP_ICON[e.id]), tplText(e)); }).join(""))+
      (mitZonen ? kkFilterHTML('data-'+pre+'fzone', zonen) : ''),
    /* Sortierung: kein Block mehr in der Karte, nur ein Schalter „A–Z“ neben der Kopfzeile (aus = die Standardreihenfolge der Liste: Standard bzw. Dauer) */
    extra:'<button type="button" class="af-az'+(sort === "az" ? ' on' : '')+'" data-'+pre+'fsort="'+(sort === "az" ? sortOpts[0][0] : "az")+'" aria-pressed="'+(sort === "az")+
      '" title="'+esc(t("afSortAz"))+'" aria-label="'+esc(t("afSortAz"))+'">A&ndash;Z</button>' });
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
   Darunter die Suche und die einklappbare Filterkarte (Training, Ausrüstung, Sortierung). */
function renderLibrary(){
  var s = state.db.settings;
  if(s.libTab === "calis" || s.libTab === "stretch") s.libTab = "workouts";   // frühere Reiter Calisthenics und Dehnen
  var tab = ["exercises","mine"].indexOf(s.libTab) > -1 ? s.libTab : "workouts";   // der frühere Reiter „Timer“ ist jetzt eine eigene Seite
  /* Dehnen und Aufwärmen stehen seit 2026-09 unter „Aufwärmen & Dehnen“ - hier nicht mehr */
  function ohneStretch(x){ return x !== "stretch"; }
  var cat = selArr(s.libCats || s.libCat).filter(ohneStretch);
  var equip = selArr(s.libEquips).filter(function(x){ return x !== "gym"; });   // Studio-Ausrüstung gibt es in Air nicht
  var zonen = kkNorm(s.libZonen);   // Körperkarte: gewählte Muskelzonen
  var mains = [];   // die Kacheln der Hauptkategorien gibt es in Air nicht mehr; ein früher gespeicherter Wert wirkt nicht mehr
  var exSort = s.libSort === "az" ? "az" : "std";
  var woSort = s.libWoSort === "az" ? "az" : "dur";
  var open = !!s.libFilterOpen;
  var hiddenCount = 0, hiddenCards = "", list = "", fab = "", anzahl = 0;   // anzahl: sichtbare Karten (für „N … anzeigen“)
  var hw = tab === "exercises" ? hinweise("air", ["zpHint"]) : hinweise("", []);

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
        if(mw.ws) return;   // Aufwärm- und Dehn-Workouts liegen unter Mobility & Stretch › Meine
        var exs = mw.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
        rows.push({ mw:mw, exs:exs, name:mw.name, focus:"", dur:workoutDuration(myRun(mw)) });
      });
    }
    rows = rows.filter(function(r){
      r.mains = woMains(r.exs);
      if(tab === "mine") return true;   // eigene Programme: ungefiltert
      return woFocusOk(r.focus, r.exs, cat, r.lw && r.lw.id) && woFits(r.exs, equip) && woGearOk(r.exs, cat, equip, mains);
    });
    libWoSort(rows, woSort).forEach(function(r){
      if(r.lw){
        if(r.hidden){ hiddenCount++; hiddenCards += libWoCard(r.lw, r.exs, true, r.dur, r.mains); }
        else { list += libWoCard(r.lw, r.exs, false, r.dur, r.mains); anzahl++; }
      } else {
        list += myWoCard(r.mw, r.exs, r.mains, r.dur);
      }
    });
    if(tab === "mine"){   // Timer-Workouts und Blöcke haben seit 2026-10 ihren eigenen Reiter „Timer“ - hier nur noch eigene Workouts
      if(!list) list = '<div class="empty" style="padding:30px 20px;">'+t("myEmpty")+'</div>';
      fab = fabMenuHTML([{ key:"new", label:t("myNew"), ico:ICON_PLUS, cls:"tp" }]);
    }
  } else {
    EXERCISES.forEach(function(ex){
      if(!fuerAir(ex) || !exPasses(ex, cat, equip, [], zonen)) return;
      if(libHidden("ex:"+ex.id)){ hiddenCount++; hiddenCards += libExCard(ex, true, exSubText(ex)); }
    });
    var kacheln = "";
    sortedExercises(cat, exSort, equip, mains, zonen).forEach(function(ex){ if(fuerAir(ex)){ kacheln += libExKachel(ex); anzahl++; } });
    if(kacheln) list = '<div class="fig-grid">'+kacheln+'</div>';
    fab = fabMenuHTML([{ key:"new", label:t("exNew"), ico:ICON_PLUS, cls:"tp" }]);
  }
  if(!list) list = '<div class="empty" style="padding:40px 20px;">'+t("libEmpty")+'</div>';
  list += '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+t("noResult")+'</div>';

  app.innerHTML =
    topbar(t("library"), { back:"#home", right: hw.knopf + (tab === "mine" ? '' : lupeHTML("l", libQuery)) }) +
    reiterZeileHTML("var(--tp-color)",
      '<button data-libtab="workouts" class="'+(tab==="workouts"?"active":"")+'">'+t("tabWorkouts")+'</button>'+
      '<button data-libtab="exercises" class="'+(tab==="exercises"?"active":"")+'">'+t("libExercises")+'</button>'+
      '<button data-libtab="mine" class="'+(tab==="mine"?"active":"")+'">'+t("tabMine")+'</button>')+
    surpriseLeisteHTML() +   // das Alleinstellungsmerkmal von Air: eine schmale Zeile unter den Reitern
    (tab === "mine" ? '' :
    suchFeldHTML(libQuery, "l", tab==="exercises" ? t("searchPh") : t("searchWoPh"))+
    (tab === "exercises" ? hw.z(0, "page-hint") : '')+
    airFilterHTML("l", open, cat, equip, tab==="exercises" ? exSort : woSort,
      tab==="exercises" ? [["std", t("sortStd")], ["az", "A&ndash;Z"]] : [["dur", t("sortDur")], ["az", "A&ndash;Z"]], anzahl, tab==="exercises", tab==="exercises" ? zonen : undefined))+
    list + hiddenBlockHTML(hiddenCount, hiddenCards) +
    '<div style="height:90px"></div>' + fab;
  bindCommon();

  function neu(){ var y = window.scrollY; renderLibrary(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  on("[data-libtab]", function(el){ s.libTab = el.getAttribute("data-libtab"); save(); renderLibrary(); window.scrollTo(0,0); });
  on("[data-ltoggle]", function(){ s.libFilterOpen = !open; save(); neu(); });
  on("[data-lfcat]", function(el){ s.libCats = selToggle(cat, el.getAttribute("data-lfcat")); save(); neu(); });
  on("[data-lfequip]", function(el){ s.libEquips = selToggle(equip, el.getAttribute("data-lfequip")); save(); neu(); });
  on("[data-lfzone]", function(el){ s.libZonen = selToggle(zonen, el.getAttribute("data-lfzone")); save(); neu(); });
  on("[data-lfsort]", function(el){ if(tab==="exercises") s.libSort = el.getAttribute("data-lfsort"); else s.libWoSort = el.getAttribute("data-lfsort"); save(); neu(); });
  on("[data-lfreset]", function(){ s.libCats = []; s.libEquips = []; s.libZonen = []; save(); neu(); });
  on("[data-exfav]", function(el){ toggleExFav(el.getAttribute("data-exfav")); neu(); });
  bindTrash(neu);
  var lq = app.querySelector("#l-q");
  if(lq){
    applySearch(app, libQuery);
    lq.addEventListener("input", function(){ libQuery = lq.value; applySearch(app, libQuery); });
  }
  bindFabMenu({ "new": function(){ if(tab==="mine") go("#mybuild/new"); else go("#exedit/new"); } });

  on("[data-cover]", function(el){ if(el.disabled) return; coverDraft = null; go("#cover/"+el.getAttribute("data-cover")); });
  on("[data-playex]", function(el){ go("#playex/"+el.getAttribute("data-playex")); });
  on("[data-exedit]", function(el){ go("#exedit/"+el.getAttribute("data-exedit")); });
  app.querySelectorAll("[data-exlang]").forEach(function(el){ langDruck(el, function(){ exZuProgramm(el.getAttribute("data-exlang")); }); });   // lange drücken: in Workout oder Plan legen
  on("[data-surprise]", function(){ openSurprise(); });
  on("[data-info]", function(el){ var id = el.getAttribute("data-info"); openExInfo(id, false, { onChange:neu, zu:function(){ exZuProgramm(id); } }); });
  airKachelBinden();
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  on("[data-unhideone]", function(el){
    var k = el.getAttribute("data-unhideone");
    s.hiddenLib = (s.hiddenLib||[]).filter(function(x){ return x !== k; });
    save(); neu();
  });
  on("[data-womore]", function(el){
    var lw = findLibWorkout(el.getAttribute("data-womore"));
    if(lw) woMenue(lw, neu);
  });
  // langes Drücken auf eine fertige Workout-Karte = dasselbe Menü wie ⋯
  app.querySelectorAll(".lib-card [data-womore]").forEach(function(b){
    var lw = findLibWorkout(b.getAttribute("data-womore"));
    if(lw) langDruck(b.closest(".lib-card"), function(){ woMenue(lw, neu); });
  });
  on("[data-exmore]", function(el){
    var ex = findExercise(el.getAttribute("data-exmore"));
    if(!ex) return;
    var acts = [];
    if(ex.custom) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go("#exedit/"+ex.id); } });
    if(EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false, { onChange:neu }); } });
    acts.push({ ico:P_PLUS, label:t("zpAdd"), fn:function(){ exZuProgramm(ex.id); } });
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
function histKeepDays(){ return 31; }   // für die Statistik der letzten Wochen; „Überrasch mich“ schaut nur auf wenige Tage zurück
/* Bereich eines Eintrags: b = "lib" (Air) | "intervall" (Timer) | "timer" (Studio) | "reps" (Summit) | "warm" (Mobility & Stretch) | "run". Ältere Einträge ohne b werden geschätzt
   (Timer-Workouts und Blöcke, die vor 2026-10-07 gelaufen sind, stehen als Air). */
function bereichVonEintrag(e){ return e.b || (e.studio ? "timer" : (e.ex && e.ex.length ? "lib" : "run")); }
function bereichVonQuelle(src){
  var ty = src && src.type;
  if(ty === "studio") return "timer";
  if(ty === "workout" || ty === "block") return "intervall";   // eigene Timer-Workouts und Blöcke
  if(ty === "libworkout"){ var lw = findLibWorkout(src.id); return libIstWarmDehn(lw) ? "warm" : "lib"; }
  if(ty === "mine"){ var mw = (state.db.myWorkouts || []).filter(function(x){ return x.id === src.id; })[0]; return mw && (mw.ws === "warm" || mw.ws === "dehn") ? "warm" : "lib"; }
  if(ty === "exercise") return exIsMobility(src.id) ? "warm" : "lib";
  return "lib";
}
/* Wochensummen für die Statistik: Einträge, die aus dem Kurz-Verlauf fallen, wandern als Summe in settings.statW[Montag] = { bn, bs, a:{ bereich:{ n, s } } } (über Jahre) -
   so bleibt der Fortschritt über Monate sichtbar, ohne einzelne Trainings aufzubewahren. Nur lokal. */
function wocheKey(ts){
  var d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
}
function pruneHistory(db){
  var since = Date.now() - histKeepDays()*86400000;
  var sw = db.settings && (db.settings.statW || (db.settings.statW = {}));
  if(sw){
    var alt = (db.history || []).filter(function(e){ return e && e.at < since; });
    if(alt.length){
      var woche = function(ts){ var k = wocheKey(ts); return sw[k] || (sw[k] = { bn:0, bs:0, a:{} }); };
      // bn/bs: Besuche aller Bereiche außer Run zusammen; a[bereich]: Besuche je Bereich (Run: jeder Lauf einzeln)
      besuche(alt.filter(function(e){ return bereichVonEintrag(e) !== "run"; })).forEach(function(b){ var w = woche(b.von); w.bn = (w.bn || 0) + 1; w.bs = (w.bs || 0) + b.s; });
      ["lib", "intervall", "timer", "reps", "warm", "run"].forEach(function(k){
        var l = alt.filter(function(e){ return bereichVonEintrag(e) === k; });
        (k === "run" ? l.map(function(e){ return besuche([e])[0]; }) : besuche(l)).forEach(function(b){
          var w = woche(b.von), a = w.a[k] || (w.a[k] = { n:0, s:0 }); a.n++; a.s += b.s;
        });
      });
    }
    var keys = Object.keys(sw).sort();
    while(keys.length > 1040) delete sw[keys.shift()];   // gut 20 Jahre; eine Woche ist nur wenige Byte groß
  }
  db.history = (db.history || []).filter(function(e){ return e && e.at >= since; })
    .map(function(e){ var x = { at:e.at, ex:e.ex || [], dur:+e.dur || 0 }; if(e.studio) x.studio = e.studio; if(e.b) x.b = e.b; return x; });
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
  state.db.history.push({ at:Date.now(), ex:ex, dur:dur, b:bereichVonQuelle(playerState.source) });
  save();
}
/* Übungen der letzten n Tage (für den Generator) */
/* Wochenzeile: welche Tage (Mo–So) trainiert, wie oft und wie lange - ohne Statistik, nur ein Blick */
function wocheDaten(){
  var d = new Date(); d.setHours(0, 0, 0, 0);
  var start = d.getTime() - ((d.getDay() + 6) % 7)*86400000;   // Montag 0:00
  var tage = [0,0,0,0,0,0,0], n = 0, sek = 0;
  besucheAlle((state.db.history || []).filter(function(e){ return e; })).forEach(function(b){   // ein Besuch = ein Training (Timer bis 60 Minuten Abstand)
    if(b.von < start) return;
    var tag = Math.floor((b.von - start)/86400000);
    if(tag > 6) return;
    tage[tag] = 1; n++; sek += b.s;
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
function wocheMuskelHTML(){   // letzte 7 Tage aus dem Kurz-Gedächtnis (Air, Studio, Summit); nichts Neues wird gespeichert
  var since = Date.now() - 7*86400000, ids = [];
  (state.db.history || []).forEach(function(e){ if(e && e.at >= since) (e.ex || []).forEach(function(id){ ids.push(id); }); });
  return ids.length ? auswertungHTML(ids, { woche:true, titel:t("ausWoche"), sub:t("ausWocheSum") }) : "";
}
/* ============ Statistik ============
   Alles aus den lokal gespeicherten Daten, nichts verlässt das Gerät. Zeigt nur Bereiche, die im Fokus (Einstellungen) eingeschaltet sind;
   der in den letzten 4 Wochen am meisten genutzte steht oben. Grundlage: Kurz-Verlauf (31 Tage) + Wochensummen (statW), bei Run die Läufe selbst. */
var statKalOffen = false;   // Kalender startet zugeklappt (nur innerhalb des Besuchs gemerkt)
var statModus = "zeit";   // Verlauf-Diagramm: "zeit" | "n"
var statGran = "woche";   // Zeitraum je Balken: "woche" | "monat" | "jahr"
function statTage(n){ return n <= 0 ? t("statHeute") : n === 1 ? t("statGestern") : t("statVorTagen", { n:n }); }
/* Ein „Besuch“ (= ein Training): alle Timer-Einträge, zwischen denen höchstens BESUCH_LUECKE liegt; die Zeit läuft vom ersten Start bis zum Ende des letzten.
   Spanne eines Eintrags: Studio und Run speichern den Start (at), Air, Summit und Mobility das Ende. Läufe zählen immer einzeln. */
function besuchLuecke(){ return 60*60*1000; }   // Funktion statt Variable: loadDB läuft vor dieser Stelle
function eintragSpanne(e){
  var b = bereichVonEintrag(e), d = (+e.dur || 0)*1000;
  return (b === "timer" || b === "run") ? [e.at, e.at + d] : [e.at - d, e.at];
}
function besuche(list){
  var sp = list.map(function(e){ var x = eintragSpanne(e); return { von:x[0], bis:x[1], b:bereichVonEintrag(e) }; }).sort(function(a, b){ return a.von - b.von; }), out = [];
  sp.forEach(function(x){
    var l = out[out.length-1];
    if(l && x.von - l.bis <= besuchLuecke()){ l.bis = Math.max(l.bis, x.bis); l.n++; l.areas[x.b] = true; }
    else { var a = {}; a[x.b] = true; out.push({ von:x.von, bis:x.bis, n:1, areas:a }); }
  });
  out.forEach(function(b){ b.s = Math.max(0, (b.bis - b.von)/1000); });
  return out;
}
function besucheAlle(list){
  var lauf = list.filter(function(e){ return bereichVonEintrag(e) === "run"; }).map(function(e){ return besuche([e])[0]; });
  return besuche(list.filter(function(e){ return bereichVonEintrag(e) !== "run"; })).concat(lauf).sort(function(a, b){ return a.von - b.von; });
}
function statWochenReihe(n, aktiv){
  var mo = new Date(); mo.setHours(0, 0, 0, 0); mo.setDate(mo.getDate() - (mo.getDay() + 6) % 7);
  var sw = state.db.settings.statW || {}, out = [], idx = {};
  var ohneRun = ["lib", "intervall", "timer", "reps", "warm"].every(function(k){ return aktiv.indexOf(k) > -1; });
  for(var i = n-1; i >= 0; i--){
    var d = new Date(mo); d.setDate(d.getDate() - 7*i); var key = wocheKey(d.getTime()), src = sw[key] || {}, ar = src.a || {}, w = { key:key, ab:d.getTime(), n:0, s:0, a:{} };
    Object.keys(ar).forEach(function(b){ if(aktiv.indexOf(b) > -1) w.a[b] = { n:ar[b].n || 0, s:ar[b].s || 0 }; });
    if(ohneRun && src.bn != null){   // archivierte Besuche (alle Bereiche außer Run zusammengefasst)
      w.n = src.bn; w.s = src.bs || 0;
      if(aktiv.indexOf("run") > -1 && ar.run){ w.n += ar.run.n || 0; w.s += ar.run.s || 0; }
    } else Object.keys(w.a).forEach(function(b){ w.n += w.a[b].n; w.s += w.a[b].s; });
    idx[key] = w; out.push(w);
  }
  var live = (state.db.history || []).filter(function(e){ return e && aktiv.indexOf(bereichVonEintrag(e)) > -1; });
  aktiv.forEach(function(k){
    besuche(live.filter(function(e){ return bereichVonEintrag(e) === k; })).forEach(function(b){
      var w = idx[wocheKey(b.von)]; if(!w) return;
      var a = w.a[k] || (w.a[k] = { n:0, s:0 }); a.n++; a.s += b.s;
    });
  });
  besucheAlle(live).forEach(function(b){ var w = idx[wocheKey(b.von)]; if(w){ w.n++; w.s += b.s; } });
  return out;
}
/* Wochen zu Balken je Woche/Monat/Jahr zusammenfassen (Monat/Jahr nach dem Montag der Woche); davor leere Balken, damit mindestens minN da sind */
function statBuckets(weeks, gran, minN){
  var out = [], lang = currentLang() === "en" ? "en-GB" : "de-DE", dayMs = 86400000;
  if(gran === "woche"){
    out = weeks.map(function(w){ var d = new Date(w.ab); return { ab:w.ab, bis:w.ab + 7*dayMs, n:w.n, s:w.s, a:w.a, label:d.getDate()+"."+(d.getMonth()+1)+"." }; });
  } else {
    var idx = {};
    weeks.forEach(function(w){
      var d = new Date(w.ab), key = gran === "jahr" ? String(d.getFullYear()) : d.getFullYear()+"-"+d.getMonth();
      var b = idx[key];
      if(!b){
        var ab = gran === "jahr" ? new Date(d.getFullYear(), 0, 1) : new Date(d.getFullYear(), d.getMonth(), 1), bis = gran === "jahr" ? new Date(d.getFullYear()+1, 0, 1) : new Date(d.getFullYear(), d.getMonth()+1, 1);
        b = idx[key] = { ab:ab.getTime(), bis:bis.getTime(), n:0, s:0, a:{}, label:gran === "jahr" ? String(d.getFullYear()) : d.toLocaleDateString(lang, { month:"short" }).replace(".", "")+" "+String(d.getFullYear()).slice(-2) };
        out.push(b);
      }
      b.n += w.n; b.s += w.s;
      Object.keys(w.a).forEach(function(k){ var x = b.a[k] || (b.a[k] = { n:0, s:0 }); x.n += w.a[k].n; x.s += w.a[k].s; });
    });
  }
  while(out.length < (minN || 0)){   // links auffüllen
    var f = out[0], ab = new Date(f.ab);
    if(gran === "woche") ab.setDate(ab.getDate() - 7); else if(gran === "monat") ab.setMonth(ab.getMonth() - 1); else ab.setFullYear(ab.getFullYear() - 1);
    var lab = gran === "woche" ? ab.getDate()+"."+(ab.getMonth()+1)+"." : gran === "jahr" ? String(ab.getFullYear()) : ab.toLocaleDateString(lang, { month:"short" }).replace(".", "")+" "+String(ab.getFullYear()).slice(-2);
    out.unshift({ ab:ab.getTime(), bis:f.ab, n:0, s:0, a:{}, label:lab });
  }
  if(gran !== "jahr" && out.length) out[out.length-1].label = t("statJetzt");
  return out;
}
/* Balkendiagramm: vals (Zahlen), labels (Text darunter), kurz (Text über dem Balken); der letzte Balken ist der laufende Zeitraum */
function statBalken(vals, labels, kurz, farbe){
  var mx = Math.max.apply(null, vals.concat([1]));
  return '<div class="bscroll"><div class="bchart'+(farbe ? ' farbe' : '')+'"'+(farbe ? ' style="--c:'+farbe+'"' : '')+'>'+vals.map(function(v, i){
    return '<div class="bc'+(i === vals.length-1 ? ' jetzt' : '')+(v ? '' : ' leer')+'" style="--i:'+Math.max(0, i - Math.max(0, vals.length - 12))+'"><span class="bw">'+(v ? esc(kurz(v)) : "")+'</span><span class="bs"><i style="height:'+(v ? Math.max(5, Math.round(100*v/mx)) : 0)+'%"></i></span><small>'+esc(labels[i])+'</small></div>';
  }).join("")+'</div></div>';
}
function statPz(sek){ var s = Math.round(sek); return Math.floor(s/60)+":"+("0"+s%60).slice(-2); }
function statMin(sek){ return sek > 0 && sek < 30 ? "<1" : String(Math.round(sek/60)); }
/* Pace-Verlauf der letzten Läufe als Linie (schneller = höher) */
function statPaceSvg(runs){
  var p = runs.map(function(x){ return x.dur/1000/(x.dist/1000); }), mn = Math.min.apply(null, p), mx = Math.max.apply(null, p), W = Math.max(300, p.length*40 + 28), H = 120, px = 14, py = 18;
  var sp = Math.max(mx - mn, 10);
  function xy(v, i){ return [(px + (p.length === 1 ? (W - 2*px)/2 : i*(W - 2*px)/(p.length - 1))).toFixed(1), (py + (v - mn)/sp*(H - 2*py)).toFixed(1)]; }   // kleine Pace (schnell) = oben
  var pts = p.map(function(v, i){ return xy(v, i); }), last = pts[pts.length-1];
  return '<div class="bscroll"><svg class="stat-linie" style="width:'+W+'px" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(t("statPaceTitel"))+'">'+
    '<line x1="'+px+'" x2="'+(W-px)+'" y1="'+(H-py/2)+'" y2="'+(H-py/2)+'" class="sl-basis"/>'+
    '<polyline points="'+pts.map(function(q){ return q.join(","); }).join(" ")+'" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'+
    pts.map(function(q, i){ return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(i === pts.length-1 ? 5 : 3)+'" class="'+(i === pts.length-1 ? 'sl-jetzt' : 'sl-punkt')+'"/>'; }).join("")+
    '<text x="'+Math.min(+last[0], W-px)+'" y="'+Math.max(10, +last[1]-9)+'" text-anchor="end" class="sl-text">'+esc(statPz(p[p.length-1]))+'</text></svg></div>';
}
function renderStats(){
  var s = state.db.settings, jetzt = Date.now(), tag = 86400000, runs = s.runs || [];
  pruneHistory(state.db);
  var aktiv = BEREICH_KEYS.filter(function(k){ return !fokusAus(k); });
  var hist = (state.db.history || []).filter(function(e){ return e && aktiv.indexOf(bereichVonEintrag(e)) > -1; });
  function eintraege(k, tage){ return hist.filter(function(e){ return bereichVonEintrag(e) === k && e.at >= jetzt - tage*tag; }); }
  function bes(k, tage){ return besuche(hist.filter(function(e){ return bereichVonEintrag(e) === k; })).filter(function(b){ return b.von >= jetzt - tage*tag; }); }
  function summe(l){ return l.reduce(function(a, b){ return a + b.s; }, 0); }
  function dauer(sek){ return sek >= 60 ? fmtDuration(Math.round(sek/60)*60) : sek > 0 ? "<1 Min" : "–"; }
  var besA = besucheAlle(hist);
  var montag = new Date(); montag.setHours(0, 0, 0, 0); montag = montag.getTime() - ((new Date().getDay() + 6) % 7)*tag;
  function trainingsTage(von, bis){   // verschiedene Tage mit Training (nicht Einheiten): ein Tag zählt einmal, egal wie viele Trainings
    var o = {}; besA.forEach(function(b){ if(b.von >= von && b.von < bis){ var dd = new Date(b.von); o[dd.getFullYear()+"-"+dd.getMonth()+"-"+dd.getDate()] = 1; } });
    return Object.keys(o).length;
  }
  var n7 = trainingsTage(montag, jetzt + tag), nV = trainingsTage(montag - 7*tag, montag);   // Trainingstage diese Woche (ab Montag) und in der Woche davor
  var ziel = clamp(Math.round(+s.wochenZiel) || 3, 1, 7);
  var fr = jetzt;
  Object.keys(s.statW || {}).forEach(function(k){ var tt = new Date(k+"T00:00:00").getTime(); if(tt < fr) fr = tt; });
  (state.db.history || []).forEach(function(e){ if(e && e.at < fr) fr = e.at; });
  if(aktiv.indexOf("run") > -1) runs.forEach(function(x){ if(x.at < fr) fr = x.at; });
  var voll = statWochenReihe(Math.min(1040, Math.max(8, Math.ceil((jetzt - fr)/(7*tag)) + 1)), aktiv);   // alle Wochen, soweit Daten da sind
  var reihe = statBuckets(statGran === "woche" ? voll.slice(-104) : voll, statGran, statGran === "woche" ? 8 : statGran === "monat" ? 6 : 3);
  var gesamt = voll.reduce(function(a, w){ return a + w.n; }, 0);
  var serie = 0, si = voll.length - 1;
  if(si >= 0 && !voll[si].n) si--;
  while(si >= 0 && voll[si].n){ serie++; si--; }
  var einheit = t(statGran === "woche" ? "statUWoche" : statGran === "monat" ? "statUMonat" : "statUJahr");
  var labels = reihe.map(function(b){ return b.label; });
  var html = topbar(t("tabStats"), {});
  if(!aktiv.length){
    app.innerHTML = html + '<div class="card fokus-leer"><div>'+esc(t("statAlleAus"))+'</div><button type="button" class="btn btn-secondary" data-nav="#settings">'+esc(t("fokusAendern"))+'</button></div>';
    return bindCommon();
  }
  // Willkommen / Kopf
  if(!gesamt && !(aktiv.indexOf("run") > -1 && runs.length)){
    html += '<div class="card stat-hero leer"><div class="sh-text">'+esc(t("statStart"))+'</div>'+
      statBalken([0, 0, 0, 0, 0, 0, 0, 0], labels.slice(-8), function(){ return ""; }).replace('class="bchart"', 'class="bchart geist"')+'</div>';
  } else {
    var delta = n7 > nV ? t("statMehr", { n:n7 - nV }) : n7 === nV ? (n7 ? t("statGleich") : "") : t("statWeniger", { n:nV });
    var anteil = Math.min(1, n7/ziel), R = 74, U = 2*Math.PI*R, geschafft = n7 >= ziel;
    html += '<div class="card stat-hero'+(geschafft ? ' geschafft' : '')+'"><div class="stat-ring" style="--u:'+U.toFixed(1)+';--p:'+(U*anteil).toFixed(1)+'">'+
      '<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="'+R+'" class="sr-bg"/>'+(anteil > 0 ? '<circle cx="100" cy="100" r="'+R+'" class="sr-bar" transform="rotate(-90 100 100)"/>' : '')+'</svg>'+
      '<div class="sr-mitte"><b>'+n7+'</b><small>'+esc(t("statRing", { z:ziel }))+'</small></div></div>'+
      '<div class="sh-text">'+esc(t(geschafft ? "statZielGeschafft" : "statHeroWoche"))+'</div>'+
      '<div class="sh-chips">'+(delta ? '<span class="sh-delta'+(n7 > nV ? ' auf' : '')+'">'+(n7 > nV ? svgIcon('<path d="M6 15l6-6 6 6"/>') : '')+esc(delta)+'</span>' : '')+
        (serie >= 2 ? '<span class="sh-serie">'+svgIcon('<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>')+esc(t("statSerie", { n:serie }))+'</span>' : '')+'</div>'+
      '<div class="sh-ziel"><span>'+esc(t("statZiel"))+'</span><button type="button" data-ziel="-1" aria-label="−">&minus;</button><b>'+ziel+'</b><button type="button" data-ziel="1" aria-label="+">&plus;</button></div></div>';
    // Bewegungsempfehlung (WHO 2020 und Nationale Empfehlungen 2016): Orientierung, keine Diagnose
    var woche = besA.filter(function(b){ return b.von >= montag && Object.keys(b.areas).some(function(k){ return k !== "warm"; }); }), kraftTage = {}, minWo = 0;
    woche.forEach(function(b){ minWo += b.s/60; if(b.areas.lib || b.areas.timer || b.areas.reps){ var dd = new Date(b.von); kraftTage[dd.getFullYear()+"-"+dd.getMonth()+"-"+dd.getDate()] = 1; } });
    var nKraft = Object.keys(kraftTage).length, nMin = Math.round(minWo);
    function whoZeile(label, wert, ziel, text){ var p = Math.min(100, Math.round(100*wert/ziel)); return '<div class="who-zeile'+(wert >= ziel ? ' ok' : '')+'"><span>'+esc(label)+'</span><b>'+esc(text)+(wert >= ziel ? ' ✓' : '')+'</b><i class="who-bar"><u style="width:'+p+'%"></u></i></div>'; }
    html += '<div class="card stat-karte stat-who"><div class="sk-kopf"><b>'+esc(t("statWhoTitel"))+'</b><a class="sk-link" href="quellen.html#belegt" target="_blank" rel="noopener">'+esc(t("sourcesLink"))+'</a></div>'+
      whoZeile(t("statWhoMin"), nMin, 150, nMin+" / 150 min")+whoZeile(t("statWhoKraft"), nKraft, 2, nKraft+" / 2")+
      '<div class="sk-unter">'+esc(t("statWhoHint"))+'</div></div>';
    // Verlauf: Woche / Monat / Jahr, nach links wischen für früher
    var zeit = statModus === "zeit";
    function knopf(attr, wert, aktivWert, text){ return '<button type="button" data-'+attr+'="'+wert+'" class="'+(aktivWert === wert ? 'active' : '')+'">'+esc(text)+'</button>'; }
    html += '<div class="card stat-karte"><div class="sk-kopf"><b>'+esc(t("statVerlauf"))+'</b><span class="stat-seg">'+
      knopf("statmodus", "zeit", statModus, t("statModusZeit"))+knopf("statmodus", "n", statModus, t("statModusN"))+'</span></div>'+
      '<div class="sk-kopf stat-gran"><span class="stat-seg">'+knopf("statgran", "woche", statGran, t("statGranWoche"))+knopf("statgran", "monat", statGran, t("statGranMonat"))+knopf("statgran", "jahr", statGran, t("statGranJahr"))+'</span></div>'+
      statBalken(reihe.map(function(b){ return zeit ? b.s : b.n; }), labels, function(v){ return zeit ? statMin(v) : String(v); })+
      '<div class="sk-unter">'+esc(t(zeit ? "statMinHint" : "statNHint", { u:einheit })+" – "+t("statWischen"))+'</div>'+
      '<div class="sk-unter">'+esc(t("statBesuchHint"))+'</div></div>';
    // Kalender: letzte 4 Wochen (Tag = Start des Trainings)
    var tage = {}, mo = new Date(); mo.setHours(0, 0, 0, 0); mo.setDate(mo.getDate() - (mo.getDay() + 6) % 7 - 21);
    besA.forEach(function(b){ var d = new Date(b.von); var k = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate(); tage[k] = (tage[k] || 0) + b.s; });
    var namen = t("weekDays").split(" "), heute = new Date(); heute.setHours(0, 0, 0, 0);
    var zellen = "", aktTage = 0;
    for(var i = 0; i < 28; i++){
      var d = new Date(mo); d.setDate(d.getDate() + i);
      var sek = tage[d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()] || 0, zukunft = d.getTime() > heute.getTime(), lv = sek <= 0 ? 0 : sek < 1200 ? 1 : sek < 2700 ? 2 : 3;
      if(sek > 0 && !zukunft) aktTage++;
      zellen += '<i class="hz l'+lv+(zukunft ? ' z' : '')+(d.getTime() === heute.getTime() ? ' heute' : '')+'" title="'+esc(d.getDate()+"."+(d.getMonth()+1)+". "+(sek ? statMin(sek)+" min" : ""))+'"></i>';
    }
    html += '<details class="card stat-karte stat-kal" data-statkal'+(statKalOffen ? ' open' : '')+'><summary><b>'+esc(t("statKalender"))+'</b><span class="sk-sub">'+esc(t("statTageAktiv", { n:aktTage }))+'</span><span class="sk-chev">'+ICON_CHEV+'</span></summary>'+
      '<div class="heat"><div class="heat-tage">'+namen.map(function(x){ return '<small>'+esc(x)+'</small>'; }).join("")+'</div><div class="heat-raster">'+zellen+'</div>'+
      '<div class="heat-legende"><small>'+esc(t("statWeniger2"))+'</small><i class="hz l0"></i><i class="hz l1"></i><i class="hz l2"></i><i class="hz l3"></i><small>'+esc(t("statMehr2"))+'</small></div></div></details>';
  }
  // Bereiche: Run und Mobility & Stretch immer ganz unten (Run zweitletzter), davor der in den letzten 4 Wochen am meisten genutzte zuerst
  var folge = aktiv.map(function(k, i){ return { k:k, n:bes(k, 28).length, i:i }; }).sort(function(a, b){
    var fix = function(k){ return k === "run" ? 1 : k === "warm" ? 2 : 0; };
    return fix(a.k) - fix(b.k) || b.n - a.n || a.i - b.i;
  });
  folge.forEach(function(r){
    var k = r.k, d = bereichDaten(k), l = bes(k, 28), letzte = l.length ? Math.max.apply(null, l.map(function(b){ return b.bis; })) : 0;
    var vk = reihe.map(function(b){ return (b.a[k] || {}).s || 0; });
    var tageSeit = letzte ? Math.floor((new Date(jetzt).setHours(0, 0, 0, 0) - new Date(letzte).setHours(0, 0, 0, 0))/tag + 0.5) : 0;
    var sub = k === "run" && runs.length ? t("statRunSub", { n:runs.length, km:runKm(runs.reduce(function(a, x){ return a + x.dist; }, 0)) })
      : l.length ? t("statBereichSub", { n:l.length, z:dauer(summe(l)) })+" · "+statTage(tageSeit) : t("statNichts");
    var chipsK = k === "run" && runs.length ? [[String(runs.length), t("statLaeufe")], [runKm(runs.reduce(function(a, x){ return a + x.dist; }, 0)), "km"], [letzte ? statTage(tageSeit) : "–", t("statZuletzt")]]
      : l.length ? [[String(l.length), t("statChipTrainings")], [dauer(summe(l)), t("statChipZeit")], [statTage(tageSeit), t("statZuletzt")]] : null;
    html += '<div class="card stat-karte stat-bereichkarte" style="--c:'+d[3]+'"><div class="sk-kopf"><b class="sb-name"><i></i>'+esc(d[1])+'</b><span class="sk-sub">'+esc(t("statLetzte4"))+'</span></div>'+
      (chipsK ? '<div class="chips-stat">'+chipsK.map(function(c){ return '<span><b>'+esc(c[0])+'</b><small>'+esc(c[1])+'</small></span>'; }).join("")+'</div>' : '<div class="sk-sub">'+esc(sub)+'</div>');
    if(k !== "run" && vk.some(function(v){ return v > 0; })) html += statBalken(vk, labels, statMin, d[3]);
    if(k === "run" && runs.length){
      var gut = runs.filter(function(x){ return x.dist >= 1000; }).sort(function(a, b){ return a.at - b.at; }), letzteL = gut.slice(-60);
      var wk = reihe.map(function(b){ return runs.filter(function(x){ return x.at >= b.ab && x.at < b.bis; }).reduce(function(a, x){ return a + x.dist; }, 0); });
      if(wk.some(function(v){ return v > 0; })) html += '<div class="sk-unter titel">'+esc(t("statKmPro", { u:einheit }))+'</div>'+statBalken(wk, labels, function(v){ return runKm(v).replace(/[,.]00$/, ""); }, d[3]);
      if(letzteL.length >= 2){
        html += '<div class="sk-unter titel">'+esc(t("statPaceTitel"))+'</div>'+statPaceSvg(letzteL);
        var pace = letzteL.slice(-12).map(function(x){ return x.dur/1000/(x.dist/1000); }), halb2 = Math.max(1, Math.floor(pace.length/2));
        var davor = pace.slice(0, pace.length - halb2), neu = pace.slice(-halb2);
        function avg(a){ return a.reduce(function(x, y){ return x + y; }, 0)/a.length; }
        var diff = avg(davor) - avg(neu);
        html += '<div class="sk-unter">'+esc(diff > 3 ? t("statPaceBesser", { z:statPz(diff) }) : diff < -3 ? t("statPaceLangsamer", { z:statPz(-diff) }) : t("statPaceGleich"))+'</div>';
      }
      var rek = [];
      var l1 = runs.reduce(function(m, x){ return !m || x.dist > m.dist ? x : m; }, null);
      if(l1) rek.push([t("statRekLang"), runKm(l1.dist)+" km", l1.at]);
      var bk = null; runs.forEach(function(x){ var b = runBesterKm(x); if(b !== null && (!bk || b < bk.v)) bk = { v:b, at:x.at }; });
      if(bk) rek.push([t("statRekKm"), repUhr(bk.v)+" /km", bk.at]);
      var bp = gut.reduce(function(m, x){ return !m || x.dur/x.dist < m.dur/m.dist ? x : m; }, null);
      if(bp) rek.push([t("statRekPace"), runPace(bp.dur/1000, bp.dist)+" /km", bp.at]);
      if(rek.length) html += '<div class="sk-unter titel">'+esc(t("statRekorde"))+'</div><div class="rekorde">'+rek.map(function(x){
        return '<div><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b><small>'+esc(new Date(x[2]).toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { day:"numeric", month:"short" }))+'</small></div>'; }).join("")+'</div>';
    }
    if(k === "reps"){
      var bestAll = s.repBest || {}, vb = [];
      Object.keys(bestAll).forEach(function(id){
        var b = bestAll[id], lg = b && b.log || [];
        if(lg.length < 2) return;
        var erst = lg[0][1], q = repQuelle(id);
        if(q && erst > b.best) vb.push({ name:q.name, erst:erst, best:b.best });
      });
      vb.sort(function(a, b){ return (b.erst - b.best) - (a.erst - a.best); });
      if(vb.length) html += '<div class="sk-unter titel">'+esc(t("statVerb"))+'</div><div class="rekorde verb">'+vb.slice(0, 3).map(function(x){
        return '<div><span>'+esc(x.name)+'</span><b>'+esc(repUhr(x.erst)+" → "+repUhr(x.best))+'</b><small>−'+esc(repUhr(x.erst - x.best))+'</small></div>'; }).join("")+'</div>';
    }
    if(k === "lib" || k === "timer"){
      var ids = []; eintraege(k, 7).forEach(function(e){ (e.ex || []).forEach(function(id){ ids.push(id); }); });
      if(ids.length) html += auswertungHTML(ids, { woche:true, titel:t("ausWoche"), sub:t("ausWocheSum") });
    }
    html += '</div>';
  });
  app.innerHTML = html + '<div style="height:40px"></div>';
  bindCommon();
  app.querySelectorAll(".bscroll").forEach(function(b){ b.scrollLeft = b.scrollWidth; });
  var kal = app.querySelector("[data-statkal]");
  if(kal) kal.addEventListener("toggle", function(){ statKalOffen = kal.open; });
  function neu(){ var y = window.scrollY; renderStats(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-statmodus]").forEach(function(b){ b.addEventListener("click", function(){ statModus = b.getAttribute("data-statmodus"); neu(); }); });
  app.querySelectorAll("[data-ziel]").forEach(function(b){ b.addEventListener("click", function(){ s.wochenZiel = clamp(ziel + (+b.getAttribute("data-ziel")), 1, 7); save(); neu(); }); });
  app.querySelectorAll("[data-statgran]").forEach(function(b){ b.addEventListener("click", function(){ statGran = b.getAttribute("data-statgran"); neu(); }); });
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
    if(id === "new"){
      bauEntwurf = { key:id, neu:true, d:{ id:uid(), name:t("myDefaultName"), mode:"uniform", reps:6, work:30, rest:10, blockRest:45, items:[] } };
      if(bauNeuWs){ bauEntwurf.d.ws = bauNeuWs; if(bauNeuWs === "dehn") bauEntwurf.d.work = 30; }
      bauNeuWs = "";
    }
    else { var mw = findMy(id); if(!mw){ go("#library"); return; } bauEntwurf = { key:id, d:draftCopy(mw) }; }
  }
  renderDraftPage(bauEntwurf.d, { cover:false, back:bauEntwurf.d.ws ? "#warmstretch" : "#library", id:bauEntwurf.d.id, bau:bauEntwurf });
}
function bauSpeichern(b){
  var d = b.d, l = state.db.myWorkouts || (state.db.myWorkouts = []), mw = null;
  for(var i=0;i<l.length;i++) if(l[i].id === d.id) mw = l[i];
  if(!mw){ mw = { id:d.id }; l.push(mw); }
  mw.name = d.name; mw.mode = d.mode; mw.reps = d.reps; mw.work = d.work; mw.rest = d.rest; mw.blockRest = d.blockRest;
  mw.items = draftCopy(d.items); mw.updatedAt = Date.now();
  if(d.ws) mw.ws = d.ws; else delete mw.ws;
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
  renderDraftPage(coverDraft, { cover:true, back:coverDraft.ws ? "#warmstretch" : "#library" });
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
  var equip = ohne(selArr(s.buildEquips), "gym");
  var zonen = kkNorm(s.buildZonen);
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
    return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:'data-wbex="'+ex.id+'"', q:exSearchText(ex), cat:'var(--bereich, '+catVar(ex.cats[0])+')', nr:pos[ex.id] || [], unter:kachelMuskel(ex),
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
  var palHTML = "", hw = hinweise("", []);
  if(palOpen && d.ws){   // Mobility & Stretch: nur Aufwärm- bzw. Dehnübungen, bei Dehnen mit Körperregionen
    var wsSel = selArr(s.wsRegionen), wsAlle = wsUebungen(d.ws);
    var wsZon = kkNorm(s.wsZonen);
    var wsListe = wsAlle.filter(function(ex){ return (d.ws !== "dehn" || wsRegionOk(ex.id, wsSel)) && zonePasst(ex, wsZon); })
      .sort(function(a, b){ return (isExFav(b.id) ? 1 : 0) - (isExFav(a.id) ? 1 : 0); });
    hw = hinweise("bau", ["wbTippen"].concat(d.ws === "dehn" ? ["wsRegionHint"] : []));
    palHTML = '<div class="section-title">'+t("wbWaehlen")+'</div>'+
      hw.z(0, "page-hint")+
      suchFeldHTML(buildQuery, "b")+
      (d.ws === "dehn" ? hw.z(1, "page-hint") : '')+wsRegionFilterHTML(wsSel, wsListe.length, "Ex", wsZon, d.ws === "dehn")+
      '<div class="fig-grid" id="dz-pal">'+(wsListe.map(function(ex){ return kachel(ex); }).join("") ||
        '<div class="empty" style="padding:20px;">'+t("libEmpty")+'</div>')+'</div>'+
      '<div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div>';
  } else if(palOpen){
    var palListe = sortedExercises(cat, sort, equip, [], zonen).filter(fuerAir);
    hw = hinweise("bau", ["wbTippen"]);
    palHTML = '<div class="section-title">'+t("wbWaehlen")+'</div>'+
      hw.z(0, "page-hint")+
      suchFeldHTML(buildQuery, "b")+
      airFilterHTML("b", !!s.buildFilterOpen, cat, equip, sort, [["std", t("sortStd")], ["az", "A&ndash;Z"]], palListe.length, true, zonen)+
      '<div class="fig-grid" id="dz-pal">'+(palListe.map(function(ex){ return kachel(ex); }).join("") ||
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
        (exs.length ? kkKopfHTML(d.items.map(function(it){ return it.ex; }), !!(warmDehn || d.ws)) : '')+
        '<button class="btn btn-primary" data-go'+(exs.length?'':'disabled')+'>'+ICON_PLAY+' '+t("letsGo")+'</button>'+
        (d.src==="surprise" ? '<button class="btn btn-secondary wb-mischen" data-reroll>'+ICON_MISCHEN+' '+t("wbMischen")+'</button>' : '')+
        coverActs+
        '<div class="cover-note">'+t(d._dirty ? "coverDirty" : "coverHint")+'</div>'+
      '</div>'
    : '<div class="card"><label for="m-name">'+t("name")+'</label>'+
        '<input type="text" id="m-name" value="'+esc(d.name)+'" maxlength="40">'+
        (exs.length ? kkKopfHTML(d.items.map(function(it){ return it.ex; }), !!d.ws) : '')+'</div>';

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
    topbar(cfg.cover ? t("coverTitle") : t("myWorkout"), { back:cfg.back, right: hw.knopf + (palOpen ? lupeHTML("b", buildQuery) : "") + (cfg.cover ? "" :
      '<button class="iconbtn" data-share title="'+t("shareWo")+'" aria-label="'+t("shareWo")+'" '+(d.items.length?'':'disabled style="opacity:.35"')+'>'+ICON_SHARE+'</button>') }) +
    // Aufwärm- und Dehnprogramme: Überschrift, Kacheln und Figuren in der Farbe von Aufwärmen & Dehnen
    (warmDehn ? '<div style="--bereich:var(--ws-color)">' : '<div>') + head + ablaufHTML + (warmDehn || !exs.length ? '' : auswertungHTML(d.items.map(function(it){ return it.ex; }), { offen:palOpen })) + optionsHTML + palHTML + '</div>' +
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
    acts.push({ ico:P_TRASH, label:t("del"), danger:true, fn:function(){ d.items.splice(i, 1); speichern(); neu(); } });
    openActionSheet((i+1)+". "+tplText(ex.name), acts);
  }
  app.querySelectorAll("[data-wbitem]").forEach(function(el){
    function los(){ ablaufMenue(parseInt(el.getAttribute("data-wbitem"))); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); los(); } });
  });
  on("[data-wbordnen]", function(){ d.items = wbSinnvollOrdnen(d.items); speichern(); neu(); showToast(t("wbGeordnet")); });

  on("[data-btoggle]", function(){ s.buildFilterOpen = !s.buildFilterOpen; save(); neu(); });
  on("[data-bfcat]", function(el){ s.buildCats = selToggle(cat, el.getAttribute("data-bfcat")); save(); neu(); });
  on("[data-bfequip]", function(el){ s.buildEquips = selToggle(equip, el.getAttribute("data-bfequip")); save(); neu(); });
  on("[data-bfzone]", function(el){ s.buildZonen = selToggle(zonen, el.getAttribute("data-bfzone")); save(); neu(); });
  on("[data-bfsort]", function(el){ s.libSort = el.getAttribute("data-bfsort"); save(); neu(); });
  on("[data-bfreset]", function(){ s.buildCats = []; s.buildEquips = []; s.buildZonen = []; save(); neu(); });
  wsRegionBinden(neu);
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
      '<h3>'+svgIcon(ICON_UEBERRASCH, "ico sp-h-ico")+' '+t("surprise")+'</h3>'+
      (tw ? '<div class="tm-hint" style="margin-top:0">'+esc(t("spFillHint", { n:tw.name || t("untitled") }))+'</div>'+
            '<label>'+t("spCount")+'</label><div class="sp-chips">'+[4,6,8,10,12,15].map(function(v){
        return '<button type="button" class="fc-chip'+(p.anzahl===v?' on':'')+'" data-spanz="'+v+'">'+v+' '+t("spCountUnit")+'</button>'; }).join("")+'</div>'
          : '<label>'+t("spDur")+'</label><div class="sp-chips">'+[10,15,20,30,45,60].map(function(v){
        return '<button type="button" class="fc-chip'+(p.dur===v?' on':'')+'" data-spdur="'+v+'">'+v+' Min</button>'; }).join("")+'</div>')+
      '<label>'+t("mainCat")+'</label>'+
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
    Object.keys(st.studio || {}).length || (st.myReps || []).length || (st.myRepUnits || []).length));   // auch Gewichte im Freien Training und eigene Challenges
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
var repRun = null, repQuery = "";
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
    return [z.ex, z.m.slice(0, c.runden).map(function(v){ v = +v || 0; return v > 0 ? (z.art === "sek" ? v+"s" : z.art === "m" ? v+"m" : v) : 0; })];
  })];
}
/* Programm oder Einheit als Kopie unter „Meine“ ablegen (Runden hintereinander, Strecken in Metern, Zeiten in Sekunden) */
function repZuMeine(id){
  var q = repQuelle(id);
  if(!q) return;
  var R = repQRunden(q), zeilen = [], off = 0;
  q.teile.forEach(function(tl){
    tl.row[4].forEach(function(x){
      var art = "wdh", m = [];
      for(var r=0; r<R; r++) m.push(0);
      x[1].slice(tl.von-1, tl.bis).forEach(function(v, k){
        if(!v) return;
        v = repMengeMal(v, tl.f);
        var sek = repSek(v), d = /^(\d+(?:\.\d+)?)(m|km)$/.exec(v);
        if(sek){ art = "sek"; v = sek; }
        else if(d){ art = "m"; v = Math.round(+d[1]*(d[2] === "km" ? 1000 : 1)); }
        else v = +v || 0;
        m[off+k] = v;
      });
      var z = null;
      zeilen.forEach(function(y){ if(y.ex === x[0] && y.art === art) z = y; });   // gleiche Übung in einem anderen Teil: eine Zeile
      if(z) m.forEach(function(v, i){ if(v) z.m[i] = v; });
      else zeilen.push({ ex:x[0], art:art, m:m });
    });
    off += tl.bis - tl.von + 1;
  });
  var c = { id:"my-"+uid(), name:q.name, runden:R, zeilen:zeilen, updatedAt:Date.now() };
  (state.db.settings.myReps || (state.db.settings.myReps = [])).push(c);
  save();
  showToast(t("repKopiert", { n:q.name }));
}
function repMenue(id){
  var q = repQuelle(id);
  if(!q) return;
  var acts = [];
  if(q.eigen) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go(repEditRoute(q)+id); } });
  if(!q.unit || !q.eigen) acts.push({ ico:ICON_COPY, label:t(q.eigen ? "actCopy" : "adoptMine"), fn:function(){ repZuMeine(id); } });
  openActionSheet(q.name, acts);
}
/* Eigene Einheiten (mehrere Programme hintereinander): settings.myRepUnits = [{ id:"myu-…", name, teile:[{ prog, von, bis, f }], updatedAt }]
   prog = Programm-ID (fest oder eigen „my-…“), von/bis = Runden, f = 1 oder 0.5 (halbe Menge). Sie erscheinen unter Einheiten und Meine. */
function myRepUnit(id){ var l = state.db.settings.myRepUnits || []; for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i]; return null; }
function repProgRow(id){
  if(/^my-/.test(id || "")){ var c = myRep(id); return c ? myRepRow(c) : null; }
  return repRow(id);
}
function repEditRoute(q){ return q.unit ? "#repunitedit/" : "#repedit/"; }
function repQuelle(id){
  if(/^myu-/.test(id || "")){
    var u = myRepUnit(id);
    if(!u) return null;
    var tt = (u.teile || []).map(function(p){
      var row = repProgRow(p.prog);
      if(!row) return null;
      var R = repRunden(row), von = clamp(+p.von || 1, 1, Math.max(R, 1)), bis = clamp(+p.bis || R, von, Math.max(R, 1));
      return { row:row, von:von, bis:bis, f:p.f === 0.5 ? 0.5 : 1 };
    }).filter(Boolean);
    return { id:id, name:u.name || t("reUnitDefault"), einzel:false, eigen:true, unit:true, lvl:0, teile:tt };
  }
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
/* Auf den Karten immer: Bestzeit, letzte Zeit und Anzahl der Läufe (ohne Lauf mit „–“) */
function repZeitenHTML(best){
  function z(wert, label){ return '<span class="rz"><b>'+(wert == null ? "–" : esc(String(wert)))+'</b>'+esc(label)+'</span>'; }
  return '<div class="rep-zeiten">'+z(best ? repUhr(best.best) : null, t("repBestZeit"))+z(best ? repUhr(best.last) : null, t("repLetzte"))+z(best ? best.n : null, t("repLaeufe"))+'</div>';
}
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

/* ============ Lauf-Tracker ============
   GPS-Lauf mit Zeit, Kilometern, Pace, Kilometer-Zwischenzeiten und Routenlinie. Bewusst ohne Hintergrundkarte:
   Die Position wird nur auf dem Gerät verarbeitet, nichts geht ins Internet. Der Bildschirm bleibt an (Wake Lock);
   im Hintergrund oder bei gesperrtem Handy zeichnet eine Web-App nicht zuverlässig auf - dafür gibt es „Abdunkeln“.
   Gespeichert: settings.runs = [{ id, at, dur (ms, ohne Pausen), dist (m), pts:[[lat,lon]…], splits:[ms bis km 1, 2, …] }].
   Ein laufender Lauf wird alle 10 s als settings.runLive gesichert (falls die Seite beendet wird). */
var RUN_GENAU = 35;   // Fixes mit schlechterer Genauigkeit (m) werden ignoriert
var RUN_MAX_MS = 12;  // schneller als 12 m/s (43 km/h) gilt als GPS-Sprung
var run = null;       // laufende Aufzeichnung
var runWake = null;
function runMeter(a, b){   // Haversine
  var R = 6371000, r = Math.PI/180, dLat = (b[0]-a[0])*r, dLon = (b[1]-a[1])*r;
  var h = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2*R*Math.asin(Math.min(1, Math.sqrt(h)));
}
function runPace(sek, m){   // „5:32“ min/km
  if(!m || m < 20 || !sek) return "–:––";
  var p = sek/(m/1000), min = Math.floor(p/60), s = Math.round(p%60);
  if(s === 60){ min++; s = 0; }
  return min > 59 ? "–:––" : min+":"+(s < 10 ? "0" : "")+s;
}
/* Einstellungen: Auto-Pause (settings.runAuto = Sekunden Stillstand, 0 = aus) und Intervall (settings.runIv = { an, lauf, geh } in Sekunden) */
function runAutoSek(){ var v = +state.db.settings.runAuto; return v >= 5 && v <= 20 ? Math.round(v) : 0; }
function runIvEinst(){
  var a = state.db.settings.runIv || {};
  return { an:!!a.an, lauf:clamp(Math.round(+a.lauf) || 60, 10, 900), geh:clamp(Math.round(+a.geh) || 60, 10, 900) };
}
function runKm(m){ return (m/1000).toFixed(2).replace(".", currentLang() === "en" ? "." : ","); }
function runZeit(r){ return (r.pauseAb || Date.now()) - r.start - r.pausenMs; }
function runWachen(an){
  if(!an){ if(runWake){ try{ runWake.release(); }catch(e){} runWake = null; } return; }
  if(!("wakeLock" in navigator)) return;
  navigator.wakeLock.request("screen").then(function(wl){ runWake = wl; }).catch(function(){});
}
document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "visible" && run && !run.pauseAb) runWachen(true); });

/* Ein GPS-Punkt: filtert Ungenaues, Stillstand-Rauschen und Sprünge, zählt Strecke und Kilometer-Zwischenzeiten */
function runPunkt(lat, lon, acc, ts, speed){
  var r = run;
  if(!r) return;
  if(r.pauseAb){
    if(r.auto){ r.gps = acc; r.fehler = 0; runAutoWeiter(lat, lon, acc, speed); }
    return;
  }
  r.gps = acc; r.fehler = 0; r.n++; r.sumAcc += acc;
  if(acc > RUN_GENAU) return;
  if(speed != null && speed >= 1) r.lastMove = Date.now();   // das Gerät meldet selbst Bewegung
  var p = [Math.round(lat*1e5)/1e5, Math.round(lon*1e5)/1e5];
  if(!r.letzte){ r.letzte = { p:p, ts:ts }; if(!r.pts.length) r.pts.push(p); return; }
  var dt = (ts - r.letzte.ts)/1000;
  if(dt <= 0) return;
  var d = runMeter(r.letzte.p, p);
  if(d < Math.max(3, acc*0.5)) return;   // Rauschen im Stand
  if(d/dt > RUN_MAX_MS) return;           // Sprung
  var vor = r.dist, nun = runZeit(r);
  if(speed == null || speed >= 0.5) r.lastMove = Date.now();   // Zittern im Stand (Tempo ~0) zählt nicht als Bewegung
  r.dist += d; r.letzte = { p:p, ts:ts };
  while(Math.floor(r.dist/1000) > r.splits.length){   // Kilometer-Marke überschritten: Zeit anteilig berechnen
    var k = r.splits.length + 1, anteil = (k*1000 - vor)/(r.dist - vor);
    r.splits.push(Math.round(r.tZ + anteil*(nun - r.tZ)));
    runAnsage(k);
  }
  r.tZ = nun;
  if(!r.pts.length || runMeter(r.pts[r.pts.length-1], p) >= 5) r.pts.push(p);
  r.verlauf.push({ t:nun, d:r.dist });
  while(r.verlauf.length > 2 && nun - r.verlauf[1].t > 60000) r.verlauf.shift();   // nur die letzte Minute für „Tempo jetzt“
}
/* Auto-Pause: steht man länger als die eingestellte Zeit (Strecke wächst nicht, Gerät meldet kaum Tempo), pausiert der Lauf.
   Die Stehzeit wird herausgerechnet (die Pause beginnt beim letzten Schritt, nicht erst bei der Erkennung). Weiter geht es von selbst,
   sobald man sich ≥ 10 m vom Pausenort entfernt oder das Gerät ≥ 1,5 m/s meldet. GPS zittert im Stand, daher mindestens 5 s. */
function runAutoPruefen(){
  var r = run, sek = runAutoSek();
  if(!r || !sek || r.pauseAb || !r.letzte || r.fehler) return;
  if(Date.now() - r.lastMove < sek*1000) return;
  r.pauseAb = r.lastMove; r.auto = true; r.pausePos = r.letzte.p;
  vibrate(120);
  runAnzeige();
}
function runAutoWeiter(lat, lon, acc, speed){
  var r = run;
  if(acc > RUN_GENAU) return;
  var weg = r.pausePos ? runMeter(r.pausePos, [lat, lon]) : 0;
  if(weg < Math.max(10, acc) && !(speed != null && speed >= 1.5)) return;
  r.pausenMs += Date.now() - r.pauseAb; r.pauseAb = 0; r.auto = false; r.letzte = null; r.lastMove = Date.now();
  vibrate(120);
  runAnzeige();
}
/* Intervall-Lauf: Laufen und Gehen im Wechsel nach der Laufzeit (ohne Pausen); Signalton, Vibration und Ansage beim Wechsel, Tick in den letzten 3 s */
function runIvTick(){
  var r = run, iv = r && r.iv;
  if(!iv || r.pauseAb) return;
  var sek = runZeit(r)/1000, zyk = iv.lauf + iv.geh, pos = sek % zyk, lauf = pos < iv.lauf;
  var rest = Math.ceil((lauf ? iv.lauf : zyk) - pos), runde = Math.floor(sek/zyk) + 1, ph = (lauf ? "l" : "g") + runde;
  if(r.ivPhase !== ph){
    var erst = r.ivPhase == null;
    r.ivPhase = ph; r.ivTick = null;
    if(!erst){
      try{ phaseBeep(lauf ? "work" : "rest"); }catch(e){}
      vibrate(lauf ? [150, 80, 150] : 250);
      if(runAnsageEinst().every && !r.stumm) runSag(t(lauf ? "runSagLauf" : "runSagGeh"));
    }
  } else if(rest <= 3 && r.ivTick !== rest){ r.ivTick = rest; try{ phaseBeep("tick"); }catch(e){} }
  var el = document.getElementById("run-iv");
  if(el){
    var txt = t(lauf ? "runIvLauf" : "runIvGeh")+" · "+repUhr(rest*1000)+" · "+t("runIvRunde", { n:runde });
    if(el.textContent !== txt) el.textContent = txt;
    el.className = "run-iv "+(lauf ? "lauf" : "geh");
  }
}
/* Ansagen alle N Kilometer (settings.runAnsage = { every:0|1|2|3|5, was:"km"|"pace"|"alles" }); 0 = aus.
   Gesprochen wird in der App-Sprache. „Pace“ ist die der letzten N Kilometer, „alles“ nimmt Gesamtzeit und Ø-Pace dazu. */
function runAnsageEinst(){
  var a = state.db.settings.runAnsage || {};
  return { every:[0, 1, 2, 3, 5].indexOf(+a.every) > -1 ? +a.every : 1, was:["km", "pace", "alles"].indexOf(a.was) > -1 ? a.was : "pace" };
}
function runSag(text, sprache){
  try{
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text), de = (sprache || currentLang()) !== "en";
    u.lang = de ? "de-DE" : "en-GB"; u.rate = 1; u.volume = 1;
    var voices = speechSynthesis.getVoices() || [];
    var v = voices.filter(function(x){ return x.lang && x.lang.toLowerCase().indexOf(de ? "de" : "en") === 0 && x.localService; })[0] ||
            voices.filter(function(x){ return x.lang && x.lang.toLowerCase().indexOf(de ? "de" : "en") === 0; })[0];
    if(v) u.voice = v;
    speechSynthesis.speak(u);
  }catch(e){}
}
function runSprechPace(sek, m, de){   // „6 Minuten 7 Sekunden“
  var p = Math.round(sek/(m/1000)), min = Math.floor(p/60), s = p%60;
  return de ? min+" Minuten"+(s ? " "+s+" Sekunden" : "") : min+" minutes"+(s ? " "+s+" seconds" : "");
}
function runSprechZeit(ms, de){
  var s = Math.round(ms/1000), h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60, out = [];
  if(de){ if(h) out.push(h+" Stunden"); if(m) out.push(m+" Minuten"); if(x && !h) out.push(x+" Sekunden"); }
  else { if(h) out.push(h+" hours"); if(m) out.push(m+" minutes"); if(x && !h) out.push(x+" seconds"); }
  return out.join(" ");
}
function runAnsageText(k, splits, e, de){
  var seg = splits[k-1] - (k - e.every > 0 ? splits[k-e.every-1] : 0);
  var txt = de ? k+(k === 1 ? " Kilometer." : " Kilometer.") : k+(k === 1 ? " kilometre." : " kilometres.");
  if(e.was !== "km") txt += de ? " Pace "+runSprechPace(seg/1000, e.every*1000, true)+" pro Kilometer." : " Pace "+runSprechPace(seg/1000, e.every*1000, false)+" per kilometre.";
  if(e.was === "alles"){
    txt += de ? " Zeit "+runSprechZeit(splits[k-1], true)+"." : " Time "+runSprechZeit(splits[k-1], false)+".";
    if(k > e.every) txt += de ? " Durchschnitt "+runSprechPace(splits[k-1]/1000, k*1000, true)+"." : " Average "+runSprechPace(splits[k-1]/1000, k*1000, false)+".";
  }
  return txt;
}
function runAnsage(k){
  var r = run, e = runAnsageEinst();
  if(!r || !e.every || r.stumm || k % e.every !== 0) return;
  var txt = runAnsageText(k, r.splits, e, currentLang() !== "en");
  (r.gesagt || (r.gesagt = [])).push(txt);
  runSag(txt);
}
/* „Lauf starten“: erst ein Countdown (20 s, beliebig oft +10 s), damit man das Handy wegstecken kann und das GPS Zeit zum Finden hat.
   Während des Countdowns läuft nur die Suche nach dem Signal - Zeit und Strecke zählen erst ab „Los“. */
var RUN_VORLAUF = 20;
var runVor = null;   // { ende (ms), uhr, watch, gps, fehler, piep }
function runStart(){
  if(!navigator.geolocation){ showToast(t("runNoGps")); return; }
  if(runAnsageEinst().every && window.speechSynthesis){ try{ var u0 = new SpeechSynthesisUtterance(" "); u0.volume = 0; speechSynthesis.speak(u0); }catch(e){} }   // Sprache im Tipp freischalten (iOS)
  runVor = { ende:Date.now() + RUN_VORLAUF*1000, gps:null, fehler:0, piep:null };
  runVor.watch = navigator.geolocation.watchPosition(function(pos){ if(runVor){ runVor.gps = pos.coords.accuracy; runVor.fehler = 0; } },
    function(err){ if(runVor) runVor.fehler = err && err.code || 2; }, { enableHighAccuracy:true, maximumAge:1000, timeout:20000 });
  runWachen(true);
  runVor.uhr = setInterval(runVorTick, 250);
  renderRun();
}
function runVorStop(){
  if(!runVor) return;
  if(runVor.uhr) clearInterval(runVor.uhr);
  if(runVor.watch != null) try{ navigator.geolocation.clearWatch(runVor.watch); }catch(e){}
  runVor = null;
}
function runVorText(){
  var v = runVor;
  return v.fehler === 1 ? t("runGpsDenied") : v.fehler ? t("runGpsLost") : v.gps == null ? t("runGpsWait") : t(v.gps <= 15 ? "runGpsOk" : "runGpsWeak", { m:Math.round(v.gps) });
}
function runVorTick(){
  var v = runVor;
  if(!v) return;
  var rest = Math.ceil((v.ende - Date.now())/1000);
  if(rest <= 0) return runVorLos();
  var z = document.getElementById("run-vor"), g = document.getElementById("run-vor-gps");
  if(z && z.textContent !== String(rest)) z.textContent = rest;
  var dz = document.getElementById("run-dz"); if(dz && !run && dz.textContent !== String(rest)) dz.textContent = rest;
  if(g) g.textContent = runVorText();
  if(rest <= 3 && v.piep !== rest){ v.piep = rest; try{ phaseBeep("tick"); }catch(e){} }
}
function runVorLos(){
  runVorStop();
  try{ phaseBeep("work"); if(navigator.vibrate) navigator.vibrate(200); }catch(e){}
  if(runAnsageEinst().every) runSag(t("runLos"));
  runLosgehts();
}
function runLosgehts(){
  run = { id:uid(), start:Date.now(), pauseAb:0, pausenMs:0, dist:0, pts:[], letzte:null, splits:[], tZ:0, verlauf:[], gps:null, fehler:0, stumm:false, gesagt:[], n:0, sumAcc:0,
    lastMove:Date.now(), auto:false, iv:runIvEinst().an ? runIvEinst() : null, ivPhase:null };
  runLauschen();
  runWachen(true);
  run.uhr = setInterval(function(){ runAutoPruefen(); runAnzeige(); runSichern(); }, 1000);
  renderRun();
}
function runLauschen(){
  var r = run;
  r.watch = navigator.geolocation.watchPosition(function(pos){
    runPunkt(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, pos.timestamp || Date.now(), pos.coords.speed);
    runAnzeige();
  }, function(err){ r.fehler = err && err.code || 2; runAnzeige(); }, { enableHighAccuracy:true, maximumAge:1000, timeout:20000 });
}
function runStopWatch(){
  if(!run) return;
  if(run.watch != null) try{ navigator.geolocation.clearWatch(run.watch); }catch(e){}
  if(run.uhr) clearInterval(run.uhr);
  run.watch = null; run.uhr = 0;
}
function runPause(){
  if(!run) return;
  if(run.pauseAb){ run.pausenMs += Date.now() - run.pauseAb; run.pauseAb = 0; run.auto = false; run.letzte = null; run.lastMove = Date.now(); runWachen(true); }   // Lücke zählt nicht als Strecke
  else { run.pauseAb = Date.now(); run.auto = false; }
  renderRun();
}
var runSichernAm = 0;
function runSichern(){   // alle 10 s eine Kopie, damit ein beendeter Browser den Lauf nicht verschluckt
  var r = run;
  if(!r || Date.now() - runSichernAm < 10000) return;
  runSichernAm = Date.now();
  state.db.settings.runLive = { id:r.id, start:r.start, dur:runZeit(r), dist:r.dist, pts:r.pts, splits:r.splits, at:Date.now() };
  save();
}
function runSpeichern(d){   // d: { id, start, dur, dist, pts, splits } -> in den Verlauf; zu kurze Läufe werden nicht behalten
  var s = state.db.settings;
  if(d.dist < 50){ showToast(t("runShort")); return false; }
  var x = { id:d.id, at:d.start, dur:Math.round(d.dur), dist:Math.round(d.dist), pts:d.pts, splits:d.splits };
  if(d.pause > 1000) x.pause = Math.round(d.pause);   // herausgerechnete Pausen/Stehzeit (ms)
  if(d.iv) x.iv = { lauf:d.iv.lauf, geh:d.iv.geh };
  (s.runs || (s.runs = [])).push(x);
  pruneHistory(state.db);
  state.db.history.push({ at:d.start, dur:Math.round(d.dur/1000), ex:[], b:"run" });   // zählt in der Wochenzeile
  save();
  showToast(t("runSaved"));
  return true;
}
function runBeenden(speichern){
  var r = run;
  if(!r) return;
  var dauer = runZeit(r), pausen = r.pausenMs + (r.pauseAb ? Date.now() - r.pauseAb : 0), iv = r.iv;
  runStopWatch(); runWachen(false);
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  var dunkel = document.getElementById("run-dunkel"); if(dunkel) dunkel.remove();
  run = null;
  delete state.db.settings.runLive;
  var ok = speichern ? runSpeichern({ id:r.id, start:r.start, dur:dauer, dist:r.dist, pts:r.pts, splits:r.splits, pause:pausen, iv:iv }) : (save(), false);
  if(ok){ runNeu = r.id; go("#rundetail/"+r.id); } else renderRun();   // runNeu: Abschlusskarte oben im Detail
}
var runNeu = null;
function runBesterKm(r){   // schnellster einzelner Kilometer (ms) oder null
  var sp = r.splits || [], best = null;
  sp.forEach(function(ms, i){ var d = ms - (i ? sp[i-1] : 0); if(best === null || d < best) best = d; });
  return best;
}
/* Was bei diesem Lauf besonders war - im Vergleich zu den früheren Läufen */
function runHighlights(x){
  var others = (state.db.settings.runs || []).filter(function(o){ return o.id !== x.id; }), out = [];
  if(!others.length) out.push(t("runErster"));
  else {
    if(x.dist > Math.max.apply(null, others.map(function(o){ return o.dist; }))) out.push(t("runLaengster"));
    var bk = runBesterKm(x), ok = others.map(runBesterKm).filter(function(v){ return v !== null; });
    if(bk !== null && (!ok.length || bk < Math.min.apply(null, ok))) out.push(t("runSchnellsterKm", { z:repUhr(bk) }));
    var lang = others.filter(function(o){ return o.dist >= 1000; });
    if(x.dist >= 1000 && lang.length && x.dur/x.dist < Math.min.apply(null, lang.map(function(o){ return o.dur/o.dist; }))) out.push(t("runSchnellstePace"));
  }
  [[5000, "runM5"], [10000, "runM10"], [21097, "runMHalb"]].forEach(function(m){
    if(x.dist >= m[0] && !others.some(function(o){ return o.dist >= m[0]; })) out.push(t(m[1]));
  });
  return out;
}
function runOptionenHTML(){
  var iv = runIvEinst(), a = runAutoSek();
  return '<div class="card run-opt">'+
    toggleRow("run-iv-an", esc(t("runIvAn")), esc(t("runIvHint")), iv.an)+
    (iv.an ? '<div class="ru-felder"><div><label>'+esc(t("runIvLaufS"))+'</label>'+stepperHTML("run-iv-lauf", iv.lauf, 10, 900, 10)+'</div>'+
      '<div><label>'+esc(t("runIvGehS"))+'</label>'+stepperHTML("run-iv-geh", iv.geh, 10, 900, 10)+'</div></div>' : '')+
    '<div class="run-auto"><div class="label">'+esc(t("runAutoTitel"))+'<b id="run-auto-wert">'+esc(a ? t("runAutoNach", { s:a }) : t("runAus"))+'</b></div>'+
      '<input type="range" id="run-auto" min="0" max="16" step="1" value="'+(a ? a - 4 : 0)+'" aria-label="'+esc(t("runAutoTitel"))+'">'+
      '<div class="desc">'+esc(t("runAutoHint"))+'</div></div></div>';
}
function runAnsageHTML(){
  var e = runAnsageEinst();
  function kn(attr, wert, aktiv, text){ return '<button type="button" data-'+attr+'="'+wert+'" class="'+(aktiv ? "active" : "")+'">'+esc(text)+'</button>'; }
  return '<div class="card run-ansage"><label>'+esc(t("runAnsagen"))+'</label><div class="theme-pick rep-pick">'+
      [0, 1, 2, 3, 5].map(function(n){ return kn("runevery", n, e.every === n, n ? n+" km" : t("runAus")); }).join("")+'</div>'+
    (e.every ? '<label>'+esc(t("runInhalt"))+'</label><div class="theme-pick rep-pick">'+
      kn("runwas", "km", e.was === "km", t("runWasKm"))+kn("runwas", "pace", e.was === "pace", t("runWasPace"))+kn("runwas", "alles", e.was === "alles", t("runWasAlles"))+'</div>'+
      '<button type="button" class="btn btn-secondary" data-runtest>'+esc(t("runTest"))+'</button>' : '')+
    '<div class="tm-hint">'+esc(t("runAnsageHint"))+'</div></div>';
}
/* Pace je Kilometer als Balken: je schneller, desto länger; der schnellste ist kräftig. Ein angefangener Rest-Kilometer (ab 100 m) steht zuletzt */
function runKmZeilen(x){
  var sp = x.splits || [], zeilen = [], bk = runBesterKm(x);
  sp.forEach(function(ms, i){ var dauer = ms - (i ? sp[i-1] : 0); zeilen.push({ n:String(i+1), dauer:dauer, text:repUhr(dauer), schnell:dauer === bk && sp.length > 1 }); });
  var rest = x.dist - sp.length*1000, rz = x.dur - (sp.length ? sp[sp.length-1] : 0);
  if(rest >= 100 && rz > 0) zeilen.push({ n:"+"+runKm(rest), dauer:rz/rest*1000, text:runPace(rz/1000, rest), rest:true });
  var best = Math.min.apply(null, zeilen.map(function(z){ return z.dauer; }));
  return zeilen.map(function(z){
    var w = Math.max(25, Math.round(100*best/z.dauer));
    return '<div class="rk'+(z.schnell ? ' schnell' : '')+(z.rest ? ' rest' : '')+'"><span class="rk-n">'+esc(z.n)+'</span><span class="rk-bar"><i style="width:'+w+'%"></i></span><span class="rk-p">'+esc(z.rest ? z.text : z.text)+'<small> /km</small></span></div>';
  }).join("");
}
function runById(id){ var l = state.db.settings.runs || []; for(var i=0;i<l.length;i++) if(l[i].id === id) return l[i]; return null; }

/* Routenlinie als SVG (ohne Karte): Länge und Breite im richtigen Verhältnis */
function runSvg(pts){
  if(!pts || pts.length < 2) return '<div class="run-leer">'+esc(t("runRoutePh"))+'</div>';
  var minLa = 90, maxLa = -90, minLo = 180, maxLo = -180;
  pts.forEach(function(p){ minLa = Math.min(minLa, p[0]); maxLa = Math.max(maxLa, p[0]); minLo = Math.min(minLo, p[1]); maxLo = Math.max(maxLo, p[1]); });
  var kx = Math.cos((minLa + maxLa)/2*Math.PI/180), W = 300, H = 200, pad = 14;
  var bw = Math.max((maxLo - minLo)*kx, 1e-6), bh = Math.max(maxLa - minLa, 1e-6);
  var sk = Math.min((W - 2*pad)/bw, (H - 2*pad)/bh), ox = (W - bw*sk)/2, oy = (H - bh*sk)/2;
  function xy(p){ return [(ox + (p[1] - minLo)*kx*sk).toFixed(1), (oy + (maxLa - p[0])*sk).toFixed(1)]; }
  var a = xy(pts[0]), z = xy(pts[pts.length-1]), pl = pts.map(function(p){ return xy(p).join(","); }).join(" ");
  return '<svg class="run-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(t("runRoute"))+'">'+
    '<polyline points="'+pl+'" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="5" class="run-start"/>'+
    '<circle cx="'+z[0]+'" cy="'+z[1]+'" r="9" class="run-ring"/><circle cx="'+z[0]+'" cy="'+z[1]+'" r="5" class="run-ziel"/></svg>';
}
function runGpxText(r){
  var pts = (r.pts || []).map(function(p){ return '<trkpt lat="'+p[0]+'" lon="'+p[1]+'"/>'; }).join("");
  return '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="BLOC" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>BLOC '+new Date(r.at).toISOString().slice(0, 10)+
    '</name><trkseg>'+pts+'</trkseg></trk></gpx>';
}
function runTempoJetzt(r){
  var v = r.verlauf;
  if(v.length < 2) return "–:––";
  var a = v[0], b = v[v.length-1];
  return runPace((b.t - a.t)/1000, b.d - a.d);
}
/* Anzeige im Aufzeichnen-Fenster aktualisieren (ohne neu zu zeichnen) */
function runAnzeige(){
  var r = run;
  if(!r) return;
  var sek = runZeit(r)/1000;
  function setze(id, txt){ var el = document.getElementById(id); if(el && el.textContent !== txt) el.textContent = txt; }
  var zeit = repUhr(runZeit(r));
  setze("run-zeit", zeit); setze("run-km", runKm(r.dist)); setze("run-pace", runPace(sek, r.dist)); setze("run-jetzt", runTempoJetzt(r));
  setze("run-dz", zeit); setze("run-dk", runKm(r.dist)+" km");
  var gps = r.fehler === 1 ? t("runGpsDenied") : r.fehler ? t("runGpsLost") : r.gps == null ? t("runGpsWait") :
    t(r.gps <= 15 ? "runGpsOk" : "runGpsWeak", { m:Math.round(r.gps) });
  setze("run-gps", r.pauseAb ? t(r.auto ? "runAutoPausiert" : "runPaused") : gps);
  var pb = app.querySelector("[data-runpause]");
  if(pb){ var pt = t(r.pauseAb ? "runResume" : "runPause"); if(pb.textContent !== pt) pb.textContent = pt; }
  runIvTick();
  var gz = document.getElementById("run-gps");
  if(gz) gz.className = "run-gps " + (r.pauseAb ? "pause" : r.fehler ? "aus" : r.gps == null ? "suche" : r.gps <= 15 ? "gut" : "mittel");
  var karte = document.getElementById("run-karte");
  if(karte && +karte.getAttribute("data-n") !== r.pts.length){ karte.setAttribute("data-n", r.pts.length); karte.innerHTML = runSvg(r.pts); }
}
function runDunkel(){
  var d = document.createElement("div");
  d.id = "run-dunkel"; d.className = "run-dunkel";
  d.innerHTML = '<div id="run-dz" class="rd-z"></div><div id="run-dk" class="rd-k"></div><div class="rd-h">'+esc(t("runDarkHint"))+'</div><div class="rd-balken"><i></i></div>';
  // Gegen versehentliche Berührungen in der Tasche: erst 2 s gedrückt halten (Balken füllt sich), ein kurzer Tipp tut nichts
  var tm = 0;
  function los(){ if(tm){ clearTimeout(tm); tm = 0; } d.classList.remove("halten"); }
  d.addEventListener("pointerdown", function(e){ e.preventDefault(); los(); d.classList.add("halten"); tm = setTimeout(function(){ tm = 0; d.remove(); }, 2000); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ d.addEventListener(ev, los); });
  d.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  document.body.appendChild(d);
  if(runVor && !run){ var dz0 = d.querySelector("#run-dz"); dz0.textContent = Math.max(1, Math.ceil((runVor.ende - Date.now())/1000)); }
  runAnzeige();
}
/* Im Lauf (nicht abgedunkelt) lösen alle Knöpfe erst nach 3 s Gedrückthalten aus - gegen Fehlbedienung in der Tasche oder mit nassen Händen.
   Der Knopf füllt sich währenddessen (.halten). Ein Tastatur-Klick (detail 0) löst sofort aus, damit die Bedienung ohne Touch erreichbar bleibt. */
var RUN_HALTEN = 3000;
function runHalten(el, fn){
  if(!el) return;
  var tm = 0, fertig = false;
  function los(){ if(tm){ clearTimeout(tm); tm = 0; } el.classList.remove("halten"); }
  el.classList.add("hold");
  el.addEventListener("pointerdown", function(e){
    if(e.button) return;
    los(); fertig = false; el.classList.add("halten");
    tm = setTimeout(function(){ tm = 0; fertig = true; el.classList.remove("halten"); vibrate(60); fn(); }, RUN_HALTEN);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ el.addEventListener(ev, los); });
  el.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  el.addEventListener("click", function(e){ if(e.detail === 0 && !fertig) fn(); });
}
function runDunkelWeg(){ var d = document.getElementById("run-dunkel"); if(d) d.remove(); }

/* Countdown vor dem Start: große Zahl, +10 s, sofort starten, abbrechen */
function renderRunVor(){
  var v = runVor;
  app.innerHTML =
    topbar(t("runTitle"), { back:"#home" }) +
    '<div class="run-gross"><div class="rg-label">'+esc(t("runVorTitel"))+'</div><div id="run-vor" class="rg-zeit rg-vor">'+Math.max(1, Math.ceil((v.ende - Date.now())/1000))+'</div></div>'+
    '<div class="run-gps" id="run-vor-gps">'+esc(runVorText())+'</div>'+
    '<div class="run-knoepfe"><button type="button" class="btn btn-secondary run-dunkelbtn" data-rundark>'+svgIcon(ICON_MOON)+' '+esc(t("runDark"))+'</button>'+
      '<button type="button" class="btn btn-secondary" data-runplus>'+esc(t("runPlus10"))+'</button>'+
      '<button type="button" class="btn btn-primary" data-runjetzt>'+esc(t("runJetzt"))+'</button>'+
      '<button type="button" class="btn btn-danger" data-runabbr>'+esc(t("runAbbrechen"))+'</button></div>'+
    '<div style="height:40px"></div>';
  var zur = app.querySelector("[data-back]");
  function weg(){ runVorStop(); runDunkelWeg(); runWachen(false); renderRun(); }
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){ runVorStop(); runDunkelWeg(); runWachen(false); goBack("#home"); }); }
  bindCommon();
  app.querySelector("[data-rundark]").addEventListener("click", runDunkel);
  app.querySelector("[data-runplus]").addEventListener("click", function(){ if(runVor){ runVor.ende += 10000; runVor.piep = null; runVorTick(); } });
  app.querySelector("[data-runjetzt]").addEventListener("click", runVorLos);
  app.querySelector("[data-runabbr]").addEventListener("click", weg);
}
function renderRun(){
  var s = state.db.settings;
  if(!run && !runVor) runDunkelWeg();
  if(run) return renderRunLive();
  if(runVor) return renderRunVor();
  var runs = (s.runs || []).slice().sort(function(a, b){ return b.at - a.at; });
  var km = runs.reduce(function(a, x){ return a + x.dist; }, 0)/1000;
  var live = s.runLive;
  app.innerHTML =
    topbar(t("runTitle"), { back:"#home" }) +
    (live ? '<div class="card run-live"><b>'+esc(t("runBroken"))+'</b><div class="sub">'+esc(t("runBrokenText", { km:runKm(live.dist) }))+'</div>'+
      '<div class="btn-row"><button type="button" class="btn btn-secondary" data-runlivedel>'+esc(t("runDiscard"))+'</button>'+
      '<button type="button" class="btn btn-primary" data-runlivesave>'+esc(t("runRecover"))+'</button></div></div>' : '')+
    '<div class="card run-hero"><div class="rh-km">'+esc(runKm(km*1000))+'<small>km</small></div><div class="rh-sub">'+esc(runs.length ? t("runLaeufe", { n:runs.length }) : t("runTeaser"))+'</div>'+
      '<button type="button" class="btn btn-primary run-startbtn" data-runstart>'+ICON_PLAY+' '+esc(t("runStart"))+'</button></div>'+
    (runs.length ? '<div class="section-title">'+esc(t("runVerlauf"))+'</div>' : '')+
    (runs.length ? runs.map(function(x){
      var d = new Date(x.at);
      return '<div class="list-item entry run-item" data-nav="#rundetail/'+x.id+'"><div class="meta"><div class="name">'+esc(runKm(x.dist))+' km'+(x.name ? '<span class="run-name"> · '+esc(x.name)+'</span>' : '')+'</div>'+
        '<div class="sub">'+esc(d.toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { weekday:"short", day:"numeric", month:"short" }))+SEP+esc(repUhr(x.dur))+SEP+esc(runPace(x.dur/1000, x.dist))+' /km</div></div>'+
        '<div class="card-aside"><div class="card-acts">'+trashBtn("run", x.id, runKm(x.dist)+" km")+'</div></div></div>';
    }).join("") : '<div class="empty" style="padding:24px 20px;">'+esc(t("runNone"))+'</div>')+
    runOptionenHTML()+runAnsageHTML()+
    '<div class="page-hint">'+esc(t("runBetaHint"))+'</div>'+
    '<div style="height:40px"></div>';
  bindCommon();
  bindTrash(function(){ renderRun(); });
  bindToggle("run-iv-an", function(v){ var e = runIvEinst(); s.runIv = { an:v, lauf:e.lauf, geh:e.geh }; save(); renderRun(); });
  bindSteppers(app, function(){
    var l = app.querySelector("#run-iv-lauf"), g = app.querySelector("#run-iv-geh");
    if(l && g){ s.runIv = { an:true, lauf:clamp(parseInt(l.value) || 60, 10, 900), geh:clamp(parseInt(g.value) || 60, 10, 900) }; save(); }
  });
  var au = app.querySelector("#run-auto");
  au.addEventListener("input", function(){
    var v = +au.value, sek = v ? v + 4 : 0;
    s.runAuto = sek; save();
    app.querySelector("#run-auto-wert").textContent = sek ? t("runAutoNach", { s:sek }) : t("runAus");
  });
  app.querySelector("[data-runstart]").addEventListener("click", runStart);
  app.querySelectorAll("[data-runevery]").forEach(function(b){
    b.addEventListener("click", function(){ var e = runAnsageEinst(); s.runAnsage = { every:+b.getAttribute("data-runevery"), was:e.was }; save(); renderRun(); });
  });
  app.querySelectorAll("[data-runwas]").forEach(function(b){
    b.addEventListener("click", function(){ var e = runAnsageEinst(); s.runAnsage = { every:e.every, was:b.getAttribute("data-runwas") }; save(); renderRun(); });
  });
  var rt = app.querySelector("[data-runtest]");
  if(rt) rt.addEventListener("click", function(){   // Hörprobe: so klänge die Ansage bei 6:12 min/km
    var e = runAnsageEinst(), sp = [], k = Math.max(e.every, 1);
    for(var i = 1; i <= k; i++) sp.push(i*372000);
    runSag(runAnsageText(k, sp, e, currentLang() !== "en"));
  });
  var lv = app.querySelector("[data-runlivesave]");
  if(lv) lv.addEventListener("click", function(){
    var l = s.runLive; delete s.runLive;
    if(runSpeichern({ id:l.id, start:l.start, dur:l.dur, dist:l.dist, pts:l.pts, splits:l.splits })) go("#rundetail/"+l.id); else renderRun();
  });
  var ld = app.querySelector("[data-runlivedel]");
  if(ld) ld.addEventListener("click", function(){ delete s.runLive; save(); renderRun(); });
}
function renderRunLive(){
  var r = run;
  app.innerHTML =
    topbar(t("runTitle"), { back:"#home" }) +
    '<div class="run-gross"><div class="rg-label">'+esc(t("runTime"))+'</div><div id="run-zeit" class="rg-zeit">0:00</div><div class="run-gps" id="run-gps"></div>'+(r.iv ? '<div class="run-iv" id="run-iv"></div>' : '')+'</div>'+
    '<div class="run-raster">'+
      '<div><b id="run-km">0,00</b><small>'+esc(t("runDist"))+' (km)</small></div>'+
      '<div><b id="run-pace">–:––</b><small>'+esc(t("runPaceAvg"))+' /km</small></div>'+
      '<div><b id="run-jetzt">–:––</b><small>'+esc(t("runPaceNow"))+' /km</small></div></div>'+
    '<div id="run-karte" class="run-karte" data-n="-1"></div>'+
    '<div class="run-knoepfe"><button type="button" class="btn btn-secondary" data-runpause>'+esc(t(r.pauseAb ? "runResume" : "runPause"))+'</button>'+
      '<button type="button" class="btn btn-secondary run-dunkelbtn" data-rundark>'+svgIcon(ICON_MOON)+' '+esc(t("runDark"))+'</button>'+
      (runAnsageEinst().every ? '<button type="button" class="btn btn-secondary run-stumm" data-runstumm aria-pressed="'+!!r.stumm+'">'+esc(t(r.stumm ? "runStummAus" : "runStummAn"))+'</button>' : '')+
      '<button type="button" class="btn btn-danger run-ende" data-runend>'+esc(t("runEnd"))+'</button></div>'+
    '<div class="tm-hint run-haltehint">'+esc(t("runHaltenHint"))+'</div>'+
    '<div style="height:40px"></div>';
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){
    openActionSheet(t("runLeaveQ"), [
      { ico:P_PLAY, label:t("runKeep"), fn:function(){} },
      { ico:P_CHECK, label:t("runSave"), fn:function(){ runBeenden(true); } },
      { ico:P_TRASH, label:t("runDiscard"), danger:true, fn:function(){ runBeenden(false); } }
    ]);
  }); }
  bindCommon();   // erst nach dem Entfernen von data-back, sonst würde „Zurück“ zusätzlich die Seite verlassen
  runHalten(app.querySelector("[data-runpause]"), runPause);
  runHalten(app.querySelector("[data-rundark]"), runDunkel);
  var stm = app.querySelector("[data-runstumm]");
  if(stm) runHalten(stm, function(){   // Ansagen für diesen Lauf aus/an (die Einstellung bleibt)
    r.stumm = !r.stumm;
    if(r.stumm) try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    renderRunLive();
  });
  runHalten(app.querySelector("[data-runend]"), function(){
    confirmSheet(t("runEndQ"), t("runEndText"), t("runSave"), function(){ runBeenden(true); });
  });
  runAnzeige();
}
function renderRunDetail(id){
  runDunkelWeg();
  var x = runById(id);
  if(!x) return go("#run");
  var d = new Date(x.at), sp = x.splits || [], bk = runBesterKm(x);
  var neu = runNeu === x.id;
  runNeu = null;
  var hl = neu ? runHighlights(x) : [];
  app.innerHTML =
    topbar(t("runDetail"), { back:"#run" }) +
    // Abschlusskarte direkt nach dem Lauf: was geschafft wurde (der Lauf ist schon gespeichert)
    (neu ? '<div class="card run-fertig"><div class="rf-titel">'+esc(t("runGeschafft"))+'</div><div class="rf-km">'+esc(runKm(x.dist))+' <small>km</small></div>'+
      '<div class="rf-zeile">'+esc(repUhr(x.dur))+SEP+esc(runPace(x.dur/1000, x.dist))+' /km</div>'+
      (hl.length ? '<ul class="rf-liste">'+hl.map(function(h){ return '<li>'+svgIcon(ICON_STAR)+'<span>'+esc(h)+'</span></li>'; }).join("")+'</ul>' : '')+
      '<div class="rf-gespeichert">'+esc(t("runGespeichert"))+'</div></div>' : '')+
    '<div class="rep-meta">'+esc(d.toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { weekday:"long", day:"numeric", month:"long", year:"numeric" }))+
      (x.iv ? SEP+esc(t("runIvMeta", { l:repUhr(x.iv.lauf*1000), g:repUhr(x.iv.geh*1000) })) : '')+(x.pause ? SEP+esc(t("runPausenMeta", { z:repUhr(x.pause) })) : '')+'</div>'+
    '<div class="card run-notiz"><input type="text" id="run-name" maxlength="40" value="'+esc(x.name || "")+'" placeholder="'+esc(t("runNamePh"))+'" aria-label="'+esc(t("runNamePh"))+'">'+
      '<textarea id="run-note" rows="2" maxlength="400" placeholder="'+esc(t("runNotePh"))+'" aria-label="'+esc(t("runNotePh"))+'">'+esc(x.note || "")+'</textarea></div>'+
    '<div class="run-raster"><div><b>'+esc(runKm(x.dist))+'</b><small>'+esc(t("runDist"))+' (km)</small></div><div><b>'+esc(repUhr(x.dur))+'</b><small>'+esc(t("runTime"))+'</small></div>'+
      '<div><b>'+esc(runPace(x.dur/1000, x.dist))+'</b><small>'+esc(t("runPaceAvg"))+' /km</small></div></div>'+
    '<div class="section-title">'+esc(t("runRoute"))+'</div><div class="run-karte">'+runSvg(x.pts)+'</div>'+
    (sp.length ? '<div class="section-title">'+esc(t("runSplits"))+'</div><div class="card run-kms">'+runKmZeilen(x)+'</div>' : '')+
    '<button type="button" class="btn btn-secondary" data-rungpx style="margin-top:14px;">'+esc(t("runGpx"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  var nm = app.querySelector("#run-name"), nt = app.querySelector("#run-note");
  nm.addEventListener("input", function(){ x.name = nm.value.trim(); if(!x.name) delete x.name; save(); });
  nt.addEventListener("input", function(){ x.note = nt.value.trim(); if(!x.note) delete x.note; save(); });
  app.querySelector("[data-rungpx]").addEventListener("click", function(){
    var blob = new Blob([runGpxText(x)], { type:"application/gpx+xml" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "bloc-lauf-"+new Date(x.at).toISOString().slice(0, 10)+".gpx";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
  });
}

/* Eigenes Workout als Karte (Air › Meine und Mobility & Stretch › Meine) */
function myWoCard(mw, exs, mains, dur){
  return '<div class="list-item entry tpl-item lib-card my-item" data-nav="#mybuild/'+mw.id+'" data-q="'+esc(woSearchText(mw.name, exs))+'">'+
    '<button class="playbtn tp" data-cover="my/'+mw.id+'" '+(exs.length?'':'disabled style="opacity:.3"')+' title="'+t("startTemplate")+'" aria-label="'+t("startTemplate")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(mw.name)+'</div>'+
    '<div class="sub">'+mainTagsHTML(mains)+t("exCount", { n:exs.length })+SEP+fmtDauerKurz(dur)+'</div>'+
    '</div><div class="card-aside"><div class="card-acts">'+favBtn("my:"+mw.id)+trashBtn("my", mw.id, mw.name)+'</div></div></div>';
}
/* Menü eines fertigen Workouts (⋯ und langes Drücken): unter „Meine“ speichern, ausblenden. ws: aus Mobility & Stretch */
function woMenue(lw, neu, ws){
  openActionSheet(tplText(lw.name), [
    { ico:ICON_COPY, label:t("adoptMine"), fn:function(){ adoptLibWorkout(lw, ws); } },
    { ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("wo:"+lw.id); showToast(t("hiddenToast")); neu(); } }
  ]);
}
/* ============ Aufwärmen & Dehnen ============
   Eigene Kachel, weil beides zu Workouts und Challenges passt. Aufbau wie Air: Lupe oben rechts, oben Aufwärmen | Dehnen,
   darunter Workouts | Übungen | Meine. Bei Dehnen mit Körperregionen als Filter (Nacken, Schultern, Rücken, Hüfte, Beine …).
   Meine = eigene Workouts dieses Bereichs (mw.ws = „warm“ / „dehn“); Übungen lassen sich per langem Drücken oder ⋯ dort einbauen. */
var wsQuery = "";
function renderWarmStretch(){
  var s = state.db.settings;
  var art = s.wsArt === "dehn" ? "dehn" : "warm", tab = ["uebungen", "meine"].indexOf(s.wsTab) > -1 ? s.wsTab : "workouts";
  var regSel = art === "dehn" && tab !== "meine" ? selArr(s.wsRegionen).filter(function(r){ return WS_REGIONEN.indexOf(r) > -1; }) : [];
  var zonSel = tab !== "meine" ? kkNorm(s.wsZonen) : [];   // Körperkarte
  var liste = "", fab = "", anzahl = 0;   // anzahl: sichtbare Karten (für „N … anzeigen“)
  if(tab === "workouts"){
    var wos = art === "warm" ? AUFWAERM_IDS.map(findLibWorkout).filter(Boolean)
                             : LIB_WORKOUTS.filter(function(lw){ return lw.focus === "stretch" && AUFWAERM_IDS.indexOf(lw.id) < 0; });
    var rows = wos.filter(function(lw){ return !libHidden("wo:"+lw.id); }).map(function(lw){
      var exs = lw.exercises.map(findExercise).filter(Boolean);
      return { lw:lw, exs:exs, dur:workoutDuration(libWorkoutRun(lw)) };
    });
    rows = rows.filter(function(r){ return (!regSel.length || r.exs.some(function(ex){ return wsRegionOk(ex.id, regSel); })) &&
      (!zonSel.length || r.exs.some(function(ex){ return zonePasst(ex, zonSel); })); }).sort(function(a, b){ return a.dur - b.dur; });
    anzahl = rows.length;
    liste = rows.map(function(r){ return libWoCard(r.lw, r.exs, false, r.dur, woMains(r.exs)); }).join("");
  } else if(tab === "uebungen"){
    var exl = wsUebungen(art).filter(function(ex){ return (art !== "dehn" || wsRegionOk(ex.id, regSel)) && zonePasst(ex, zonSel); });
    anzahl = exl.length;
    liste = exl.length ? '<div class="fig-grid">'+exl.map(function(ex){ return libExKachel(ex); }).join("")+'</div>' : "";
  } else {
    (state.db.myWorkouts || []).map(normMy).filter(function(mw){ return mw.ws === art; }).forEach(function(mw){
      var exs = mw.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
      liste += myWoCard(mw, exs, woMains(exs), workoutDuration(myRun(mw)));
    });
    if(!liste) liste = '<div class="empty" style="padding:30px 20px;">'+esc(t("wsMineEmpty"))+'</div>';
    fab = fabMenuHTML([{ key:"new", label:t("wsNew"), ico:ICON_PLUS, cls:"tp" }]);
  }
  function knopf(attr, wert, aktiv, text){ return '<button data-'+attr+'="'+wert+'" class="'+(aktiv ? "active" : "")+'">'+esc(text)+'</button>'; }
  var hw = hinweise("ws", [tab === "meine" ? "wsMineIntro" : art === "warm" ? "wsIntroWarm" : "wsIntroDehn"].concat(tab === "uebungen" ? ["zpHintWs"] : []));
  app.innerHTML =
    topbar(t("warmTitle"), { back:"#home", right:hw.knopf+lupeHTML("ws", wsQuery) }) +
    '<div class="theme-pick lib-tabs seg-2 ws-art">'+
      knopf("wsart", "warm", art === "warm", t("wsWarm"))+knopf("wsart", "dehn", art === "dehn", t("wsDehn"))+
    '</div>'+
    reiterZeileHTML("var(--ws-color)",
      knopf("wstab", "workouts", tab === "workouts", t("tabWorkouts"))+knopf("wstab", "uebungen", tab === "uebungen", t("libExercises"))+knopf("wstab", "meine", tab === "meine", t("tabMine")))+
    hw.z(0, "rep-intro")+
    suchFeldHTML(wsQuery, "ws", t("wsSearchPh"))+
    (tab === "uebungen" ? hw.z(1, "page-hint") : '')+
    (tab !== "meine" ? wsRegionFilterHTML(regSel, anzahl, tab === "uebungen" ? "Ex" : "Wo", zonSel, art === "dehn") : '')+
    // Start-Knöpfe und Figuren in der Farbe des Bereichs (wie die Kachel auf der Startseite)
    '<div style="--bereich:var(--ws-color)">'+(liste || '<div class="empty">'+t("libEmpty")+'</div>')+'</div>'+
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+t("noResult")+'</div>'+
    '<div style="height:'+(fab ? 90 : 40)+'px"></div>'+fab;
  bindCommon();
  function neu(){ var y = window.scrollY; renderWarmStretch(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  on("[data-wsart]", function(el){ s.wsArt = el.getAttribute("data-wsart"); save(); renderWarmStretch(); window.scrollTo(0, 0); });
  on("[data-wstab]", function(el){ s.wsTab = el.getAttribute("data-wstab"); save(); renderWarmStretch(); window.scrollTo(0, 0); });
  wsRegionBinden(neu);
  var wq = app.querySelector("#ws-q");
  if(wq){
    applySearch(app, wsQuery);
    wq.addEventListener("input", function(){ wsQuery = wq.value; applySearch(app, wsQuery); });
  }
  bindFabMenu({ "new": function(){ bauNeuWs = art; go("#mybuild/new"); } });
  on("[data-cover]", function(el){ if(el.disabled) return; coverDraft = null; go("#cover/"+el.getAttribute("data-cover")); });
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  on("[data-womore]", function(el){
    var lw = findLibWorkout(el.getAttribute("data-womore"));
    if(lw) woMenue(lw, neu, art);
  });
  // langes Drücken wie in Air: Workout-Karte = Menü (⋯), Übungskarte = in ein eigenes Workout einbauen
  app.querySelectorAll(".lib-card [data-womore]").forEach(function(b){
    var lw = findLibWorkout(b.getAttribute("data-womore"));
    if(lw) langDruck(b.closest(".lib-card"), function(){ woMenue(lw, neu, art); });
  });
  app.querySelectorAll("[data-exlang]").forEach(function(el){ langDruck(el, function(){ exZuProgramm(el.getAttribute("data-exlang"), art); }); });
  on("[data-playex]", function(el){ go("#playex/"+el.getAttribute("data-playex")); });
  on("[data-exedit]", function(el){ go("#exedit/"+el.getAttribute("data-exedit")); });
  on("[data-info]", function(el){ var id = el.getAttribute("data-info"); openExInfo(id, false, { onChange:neu, zu:function(){ exZuProgramm(id, art); } }); });
  airKachelBinden();
  on("[data-exfav]", function(el){ toggleExFav(el.getAttribute("data-exfav")); neu(); });
  on("[data-exmore]", function(el){
    var ex = findExercise(el.getAttribute("data-exmore"));
    if(!ex) return;
    var acts = [];
    if(ex.custom) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go("#exedit/"+ex.id); } });
    if(EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false, { onChange:neu }); } });
    acts.push({ ico:P_PLUS, label:t("zpWs"), fn:function(){ exZuProgramm(ex.id, art); } });
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
  var anzahl = 0;   // sichtbare Karten (für „N … anzeigen“)
  function karte(id, name, zeile1, zeile2, plan, eigen){
    anzahl++;
    var best = repBestOf(id), qq = repQuelle(id), such = [name, zeile1 || ""];
    if(qq) qq.teile.forEach(function(tl){ tl.row[4].forEach(function(x){ such.push(repExName(x[0])); }); });
    return '<div class="list-item rep-karte'+(eigen ? ' eigen' : '')+'" data-repid="'+id+'" data-nav="#rep/'+id+'" data-q="'+esc(such.join(" "))+'"><div class="meta"><div class="name">'+esc(name)+'</div>'+
      (zeile1 ? '<div class="sub rep-teile">'+zeile1+'</div>' : '')+'<div class="sub">'+zeile2+'</div>'+(plan || '')+repZeitenHTML(best)+'</div>'+
      (best ? wochenKurve(repWochen(id), "rep-spark") : '')+
      (eigen ? '<div class="card-aside"><div class="card-acts">'+favBtn("rep:"+id)+trashBtn("rep", id, name)+'</div></div>' : moreBtn("data-repmore", id))+
      '<span class="chip chev">'+ICON_CHEV+'</span></div>';
  }
  var hw = hinweise("reps", [repFilter.tab === "einheiten" ? "repUnitsIntro" : repFilter.tab === "meine" ? "repMineIntro2" : "repIntro"]);
  var html = topbar(t("repTitle"), { back:"#home", right:hw.knopf+lupeHTML("rs", repQuery) }) +
    reiterZeileHTML("var(--rep-color)",
      '<button data-repf="tab:einheiten" class="'+(repFilter.tab==="einheiten"?"active":"")+'">'+esc(t("repTabUnits"))+'</button>'+
      '<button data-repf="tab:programme" class="'+(repFilter.tab==="programme"?"active":"")+'">'+esc(t("repTabProgs"))+'</button>'+
      '<button data-repf="tab:meine" class="'+(repFilter.tab==="meine"?"active":"")+'">'+esc(t("tabMine"))+'</button>')+suchFeldHTML(repQuery, "rs", t("repSearchPh"));
  var liste = "", fab = "";
  /* Karte einer eigenen Challenge; mitTag: „Meine ·“ davor (in den Reitern Einheiten und Programme) */
  function eigeneKarte(q, mitTag){
    var R = repQRunden(q), tag = mitTag ? esc(t("repOwnTag"))+SEP : "";
    return karte(q.id, q.name, q.unit && q.teile.length ? esc(q.teile.map(repTeilName).join(" + ")) : "", repQSchritte(q).length
      ? tag+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+(repQStange(q) ? SEP+esc(t("repBar")) : "")
      : tag+esc(t("reNoEx")), repPlanHTML(q), true);
  }
  function eigeneListe(arten, mitTag){   // arten: „prog“ und/oder „unit“; Einheiten zuerst
    var s = state.db.settings, out = "";
    if(arten.indexOf("unit") > -1) (s.myRepUnits || []).forEach(function(u){
      var q = repQuelle(u.id);
      if(q && !(repFilter.bar === "none" && repQStange(q))) out += eigeneKarte(q, mitTag);
    });
    if(arten.indexOf("prog") > -1) (s.myReps || []).forEach(function(c){
      var q = repQuelle(c.id);
      if(q && !(repFilter.bar === "none" && repQStange(q))) out += eigeneKarte(q, mitTag);
    });
    return out;
  }
  if(repFilter.tab === "einheiten"){
    var stufe = REP_STUFEN.indexOf(repFilter.stufe) > -1 ? repFilter.stufe : "standard";
    html += hw.z(0, "rep-intro")+
      '<div class="theme-pick rep-pick">'+knopf("stufe","leicht",t("stufe_leicht"))+knopf("stufe","standard",t("stufe_standard"))+knopf("stufe","fortgeschritten",t("stufe_fortgeschritten"))+'</div>';
    liste += eigeneListe(["unit"], true);   // eigene Einheiten stehen oben
    fab = fabMenuHTML([{ key:"unit", label:t("repNewUnit"), ico:ICON_PLUS, cls:"tp" }]);
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
    html += hw.z(0, "rep-intro");
    liste = eigeneListe(["unit", "prog"], false) || '<div class="empty" style="padding:24px 20px 4px;">'+esc(t("repMineEmpty"))+'</div>';
    fab = fabMenuHTML([{ key:"prog", label:t("repNewProg"), ico:ICON_PLUS, cls:"tp" }, { key:"unit", label:t("repNewUnit"), ico:ICON_PLUS, cls:"tp" }]);
  } else {
    html += hw.z(0, "rep-intro")+
      '<div class="theme-pick rep-pick">'+knopf("lvl","all",t("repAll"))+knopf("lvl",1,t("lvl1"))+knopf("lvl",2,t("lvl2"))+knopf("lvl",3,t("lvl3"))+'</div>';
    liste += eigeneListe(["prog"], true);   // eigene Programme stehen oben
    fab = fabMenuHTML([{ key:"prog", label:t("repNewProg"), ico:ICON_PLUS, cls:"tp" }]);
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
  /* Filterkarte (dieselbe wie in Air) mit der Ausrüstung. Stufe bzw. Level stehen als Hauptwahl sichtbar darüber. Unter „Meine“ gibt es nichts zu filtern. */
  function repFilterKarte(){
    var ein = repFilter.tab === "einheiten", ohneStange = repFilter.bar === "none";
    function chip(wert, text){ return filterChip("data-repf", "bar:"+wert, repFilter.bar === wert, "", text); }
    return filterKarteHTML({ offen:!!state.db.settings.repFilterOpen, toggle:"data-reptoggle", reset:"data-repfreset", n:ohneStange ? 1 : 0,
      summe:t(ohneStange ? "repNoBar" : "repAllEquip"),
      zeigen:filterZeigenText(anzahl, ein ? "Ei" : "Pr"),
      inhalt:filterChipsHTML(t("equipHave"), "", chip("all", t("repAllEquip"))+chip("none", t("repNoBar"))) });
  }
  html += (repFilter.tab === "meine" ? '' : repFilterKarte()) +
    (liste || '<div class="empty">'+esc(t("repNone"))+'</div>') +
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("noResult"))+'</div><div style="height:'+(fab ? 90 : 40)+'px"></div>'+fab;
  app.innerHTML = html;
  bindCommon();
  var rq = app.querySelector("#rs-q");
  if(rq){
    if(repQuery) applySearch(app, repQuery);
    rq.addEventListener("input", function(){ repQuery = rq.value; applySearch(app, repQuery); });
  }
  // ⋯ und langes Drücken auf eine Karte: unter „Meine“ ablegen (wie bei Air)
  app.querySelectorAll("[data-repmore]").forEach(function(b){
    b.addEventListener("click", function(e){ e.stopPropagation(); repMenue(b.getAttribute("data-repmore")); });
  });
  app.querySelectorAll(".rep-karte").forEach(function(k){ langDruck(k, function(){ repMenue(k.getAttribute("data-repid")); }); });
  function neuRep(){ var y = window.scrollY; renderReps(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-fav]").forEach(function(el){
    el.addEventListener("click", function(e){ e.stopPropagation(); toggleFav(el.getAttribute("data-fav")); neuRep(); });
  });
  bindTrash(neuRep);
  // Plus unter „Meine“: neues Programm (Übungen × Runden) oder neue Einheit (mehrere Programme hintereinander)
  bindFabMenu({ "prog": function(){
    var c = { id:"my-"+uid(), name:t("reDefaultName"), runden:3, zeilen:[], updatedAt:Date.now() };
    (state.db.settings.myReps || (state.db.settings.myReps = [])).push(c);
    save();
    go("#repedit/"+c.id);
  }, "unit": function(){
    var u = { id:"myu-"+uid(), name:t("reUnitDefault"), teile:[], updatedAt:Date.now() };
    (state.db.settings.myRepUnits || (state.db.settings.myRepUnits = [])).push(u);
    save();
    go("#repunitedit/"+u.id);
  } });
  app.querySelectorAll("[data-repf]").forEach(function(b){
    b.addEventListener("click", function(){
      var p = b.getAttribute("data-repf").split(":"), y = window.scrollY;
      repFilter[p[0]] = p[1];
      renderReps();
      if(p[0] !== "tab") window.scrollTo(0, y);   // Filter-Chips: Seite bleibt, wo sie ist
    });
  });
  app.querySelectorAll("[data-reptoggle]").forEach(function(b){
    b.addEventListener("click", function(){ var s = state.db.settings; s.repFilterOpen = !s.repFilterOpen; save(); neuRep(); });
  });
  var rz = app.querySelector("[data-repfreset]");
  if(rz) rz.addEventListener("click", function(){ repFilter.bar = "all"; neuRep(); });
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
    topbar(q.name, { back:"#reps", right: q.eigen ? '<button class="iconbtn" data-nav="'+repEditRoute(q)+id+'" title="'+esc(t("edit"))+'" aria-label="'+esc(t("edit"))+'">'+svgIcon(ICON_EDIT)+'</button>' : '' }) +
    '<div class="rep-meta">'+(q.einzel && !q.eigen ? esc(t("lvl"+q.lvl))+SEP : '')+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+
      (repQStange(q) ? SEP+esc(t("repBar")) : "")+
      (best ? SEP+esc(t("repBestIs", { z:repUhr(best.best) }))+(best.n > 1 ? ', '+esc(t("repLastIs", { z:repUhr(best.last) })) : '') : '')+'</div>'+
    statsLeisteHTML("data-repstats", best ? t("repStatsKurz", { z:repUhr(best.best), n:best.n }) : t("repStatsNone"), repWochen(id), "var(--rep-color)")+
    q.teile.map(function(tl, i){
      return '<div class="section-title">'+esc(q.einzel ? t("repTable") : (i+1)+". "+repTeilName(tl))+'</div>'+tabelle(tl);
    }).join("")+
    '<div class="rep-intro">'+esc(t("repHint"))+'</div>'+
    (schritte ? '' : '<div class="empty">'+esc(t(q.unit ? "reUnitEmpty" : "reLeer"))+'</div>')+
    '<button type="button" class="btn btn-primary" data-repstart'+(schritte ? '' : ' disabled')+'>'+ICON_PLAY+' '+esc(t("repStart"))+'</button>'+
    (q.eigen ? '<button type="button" class="btn btn-secondary" data-nav="'+repEditRoute(q)+id+'" style="margin-top:10px;">'+svgIcon(ICON_EDIT)+' '+esc(t("edit"))+'</button>' : '');
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
      '<div class="seg-row re-art">'+["wdh", "sek", "m"].map(function(a){
        return '<button type="button" class="'+(z.art===a ? 'active' : '')+'" data-reart="'+i+':'+a+'">'+esc(t(a==="wdh" ? "reWdh" : a==="sek" ? "reSek" : "reMeter"))+'</button>'; }).join("")+'</div>'+
      '<div class="re-felder">'+felder+'</div></div>';
  }).join("");
  app.innerHTML =
    topbar(t("reTitle"), { back:"#reps" }) +
    '<div class="card"><label for="re-name">'+t("name")+'</label><input type="text" id="re-name" value="'+esc(c.name)+'" maxlength="40">'+
      '<label>'+t("reRunden")+'</label>'+stepperHTML("re-runden", R, 1, 20, 1)+'</div>'+
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
    var n = clamp(parseInt(app.querySelector("#re-runden").value) || 1, 1, 20);
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
  var ex = EXERCISES.filter(function(e){ return fuerWorkout(e) && e.equip.indexOf("gym") < 0 && !libHidden("ex:"+e.id); }).map(function(e){
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

/* Auswahl eines Programms für eine eigene Einheit (mit Suche): erst eigene, dann die mitgelieferten */
function repProgPicker(onPick){
  var root = document.getElementById("overlayRoot");
  var l = (state.db.settings.myReps || []).map(function(c){ var r = myRepRow(c); return { id:c.id, name:c.name || t("reDefaultName"), sub:t("repOwnTag")+SEP+repRunden(r)+" "+t("reRunden"), R:repRunden(r) }; })
    .concat(REP_WORKOUT_ROWS.map(function(r){ return { id:r[0], name:repName(r), sub:t("lvl"+r[3])+SEP+repRunden(r)+" "+t("reRunden"), R:repRunden(r) }; }));
  l = l.filter(function(o){ return o.R > 0; });
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet re-pick" role="dialog" aria-label="'+esc(t("rePickProg"))+'">'+
    '<h3>'+esc(t("rePickProg"))+'</h3>'+searchHTML("", "rp", t("repSearchPh"))+
    '<div class="re-pick-liste">'+l.map(function(o){
      return '<div class="list-item entry" role="button" tabindex="0" data-rpick="'+esc(o.id)+'" data-q="'+esc(o.name)+'"><div class="meta"><div class="name">'+esc(o.name)+'</div><div class="sub">'+o.sub+'</div></div></div>';
    }).join("")+'<div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div></div>'+
    '<button class="btn btn-secondary" data-reclose>'+t("cancel")+'</button>'+
  '</div></div>';
  function close(){ root.innerHTML = ""; }
  var box = root.querySelector(".re-pick-liste"), q = root.querySelector("#rp-q");
  q.addEventListener("input", function(){ applySearch(box, q.value); });
  root.querySelectorAll("[data-rpick]").forEach(function(b){
    function los(){ var id = b.getAttribute("data-rpick"); close(); onPick(id); }
    b.addEventListener("click", los);
    b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); los(); } });
  });
  root.querySelector("[data-reclose]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}
/* Eigene Einheit bearbeiten: Name, Programme hintereinander (je mit Von/Bis-Runde und halber Menge). Speichert sofort. */
function renderRepUnitEdit(id){
  var u = myRepUnit(id);
  if(!u) return go("#reps");
  var teile = (u.teile || []).map(function(p, i){
    var row = repProgRow(p.prog);
    if(!row) return "";
    var R = repRunden(row);
    return '<div class="card re-zeile">'+
      '<div class="re-kopf"><div class="rep-ex-in"><b>'+esc((i+1)+". "+repName(row))+'</b></div>'+
        '<button type="button" class="dz-btn" data-rurm="'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></div>'+
      '<div class="ru-felder"><div><label>'+esc(t("reFrom"))+'</label>'+stepperHTML("ru-von-"+i, clamp(+p.von || 1, 1, R), 1, R, 1)+'</div>'+
        '<div><label>'+esc(t("reTo"))+'</label>'+stepperHTML("ru-bis-"+i, clamp(+p.bis || R, 1, R), 1, R, 1)+'</div></div>'+
      toggleRow("ru-half-"+i, esc(t("reHalf")), "", p.f === 0.5)+'</div>';
  }).join("");
  app.innerHTML =
    topbar(t("reUnitTitle"), { back:"#reps" }) +
    '<div class="card"><label for="ru-name">'+t("name")+'</label><input type="text" id="ru-name" value="'+esc(u.name)+'" maxlength="40"></div>'+
    '<div class="section-title">'+t("reUnitParts")+'</div>'+
    (teile || '<div class="empty" style="padding:16px 20px;">'+esc(t("reUnitEmpty"))+'</div>')+
    '<button type="button" class="my-new" data-ruadd>'+ICON_PLUS+' '+t("reUnitAdd")+'</button>'+
    '<div class="tm-hint" style="margin:10px 4px 16px;">'+esc(t("reUnitHint"))+'</div>'+
    '<button type="button" class="btn btn-primary" data-refertig>'+esc(t("reFertig"))+'</button>'+
    '<button type="button" class="btn btn-danger" data-redel style="margin-top:10px;">'+ICON_TRASH+' '+esc(t("reDelete"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function speichern(){ u.updatedAt = Date.now(); save(); }
  function neu(){ var y = window.scrollY; renderRepUnitEdit(id); window.scrollTo(0, y); }
  var nameIn = app.querySelector("#ru-name");
  nameIn.addEventListener("input", function(){ u.name = nameIn.value.trim() || t("reUnitDefault"); speichern(); });
  bindSteppers(app, function(){
    u.teile.forEach(function(p, i){
      var v = app.querySelector("#ru-von-"+i), b = app.querySelector("#ru-bis-"+i);
      if(!v || !b) return;
      var von = parseInt(v.value) || 1, bis = parseInt(b.value) || 1;
      if(von > bis){ bis = von; b.value = bis; }
      p.von = von; p.bis = bis;
    });
    speichern();
  });
  u.teile.forEach(function(p, i){
    if(app.querySelector("#ru-half-"+i)) bindToggle("ru-half-"+i, function(v){ p.f = v ? 0.5 : 1; speichern(); });
  });
  app.querySelectorAll("[data-rurm]").forEach(function(b){
    b.addEventListener("click", function(){ u.teile.splice(+b.getAttribute("data-rurm"), 1); speichern(); neu(); });
  });
  app.querySelector("[data-ruadd]").addEventListener("click", function(){
    repProgPicker(function(pid){
      var row = repProgRow(pid);
      if(!row) return;
      u.teile.push({ prog:pid, von:1, bis:repRunden(row), f:1 });
      speichern(); neu();
    });
  });
  app.querySelector("[data-refertig]").addEventListener("click", function(){ navStack.pop(); go("#rep/"+id); });
  app.querySelector("[data-redel]").addEventListener("click", function(){
    confirmSheet(t("reUnitDelQ"), "„"+(u.name || t("reUnitDefault"))+"“ – "+t("cantUndo"), t("del"), function(){
      state.db.settings.myRepUnits = (state.db.settings.myRepUnits || []).filter(function(x){ return x.id !== id; });
      if(state.db.settings.repBest) delete state.db.settings.repBest[id];
      save();
      navStack = navStack.filter(function(h){ return h.indexOf(id) < 0; });
      go("#reps");
    });
  });
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
  state.db.history.push({ at:Date.now(), dur:Math.round(zeit/1000), b:"reps",
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
    '<div class="section-title">'+esc(t("fokusTitel"))+'</div>'+
    '<div class="card"><div class="opt-label">'+esc(t("fokusLabel"))+'</div><div class="theme-pick">'+BEREICH_KEYS.map(function(k, i){
      return '<button type="button" data-fokus="'+k+'" aria-pressed="'+!fokusAus(k)+'" class="'+(i > 2 ? 'halb' : '')+(fokusAus(k) ? '' : ' active')+'">'+esc(bereichDaten(k)[1])+'</button>';
    }).join("")+'</div><div style="font-size:12px;color:var(--text-dim);margin-top:10px;">'+esc(t("fokusHint"))+'</div></div>'+
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
    '<a class="list-item" href="quellen.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">'+
      '<div class="meta"><div class="name">'+t("sourcesRow")+'</div>'+
      '<div class="sub">'+t("sourcesRowSub")+'</div></div>'+
      '<span class="chip chev">'+ICON_CHEV+'</span>'+
    '</a>'+
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
  app.querySelectorAll("[data-fokus]").forEach(function(b){
    b.addEventListener("click", function(){
      var k = b.getAttribute("data-fokus"), an = !b.classList.contains("active");
      var aus = selArr(s.fokusAus).filter(function(x){ return x !== k; });
      if(!an) aus.push(k);
      s.fokusAus = aus; save();
      b.classList.toggle("active", an); b.setAttribute("aria-pressed", String(an));
    });
  });

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
