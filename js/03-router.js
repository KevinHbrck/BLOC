"use strict";
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
  // 1b. Neues, nicht gespeichertes Workout: erst fragen (Speichern · Verwerfen)
  if(bauVerlassenFrage()){ syncGuard(); return; }
  // 1c. Plan-Bau und Gewichtung liegen auf der Katalogseite: Zurück geht erst zur Liste (wie der Pfeil oben), nicht gleich zur Startseite
  if(katPlanVerlassen()){ syncGuard(); return; }
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
  if(DB_GERETTET) setTimeout(function(){ showToast(t("datenGerettet")); }, 600);
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
var THEME_BAR_COLORS = { light:"#f5f5f2", dark:"#121214", nacht:"#16110d" };
function applyTheme(){
  var t = state.db.settings.theme;
  var root = document.documentElement;
  if(THEME_BAR_COLORS[t]) root.setAttribute("data-theme", t);
  else root.removeAttribute("data-theme");
  root.removeAttribute("data-vintage");   // früheres C60-Design, gibt es nicht mehr
  /* Aussehen: Klassik (Standard, fehlt in alten Ständen) oder New - unabhängig von Hell/Dunkel/Nacht */
  if(state.db.settings.layout === "new") root.setAttribute("data-layout", "new");
  else root.removeAttribute("data-layout");
  var dunkel = !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  var bar = THEME_BAR_COLORS[t] || (dunkel ? THEME_BAR_COLORS.dark : THEME_BAR_COLORS.light);
  var meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", bar);
}
applyTheme();
applyLang();

/* ============ Render dispatch ============ */
var app = document.getElementById("app");

/* Leiste unten: Start · Suche · Statistik · Einstellungen - nur auf diesen Hauptseiten, nicht im Training oder in Listen und Editoren */
var TAB_ROUTEN = { home:"#home", training:"#training", search:"#search", kalender:"#kalender", stats:"#stats", settings:"#settings" };
/* Aussehen „New“ (settings.layout): vier Ziele (Heute · Training · Kalender · Fortschritt), Suche und Einstellungen als Symbole in der Kopfzeile */
function layoutNeu(){ return state.db.settings.layout === "new"; }
var builderAuto = null;   // "zufall" | "selber": der Workout-Builder auf Heute löst im Baukasten gleich die Wahl aus
/* Kopfzeilen-Symbole im Aussehen „New“ wie im Entwurf: Heute = Hell/Dunkel + Suche + Einstellungen, Training = Suche + Einstellungen,
   Fortschritt = Einstellungen */
var SYM_SUCHE = '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>';
var SYM_SONNE = '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>';
function themeIstDunkel(){
  var th = state.db.settings.theme;
  if(th === "dark" || th === "nacht") return true;
  if(th === "light") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}
function kopfSymboleNeu(art){
  if(!layoutNeu()) return "";
  var s = "";
  if(art === "home"){
    var d = themeIstDunkel();
    s += '<button type="button" class="iconbtn kopf-sym" data-themetoggle aria-label="'+esc(t(d ? "thLight" : "thDark"))+'">'+svgIcon(d ? SYM_SONNE : ICON_MOON)+'</button>';
  }
  if(art === "home" || art === "training")
    s += '<button type="button" class="iconbtn kopf-sym" data-nav="#search" aria-label="'+esc(t("search"))+'">'+svgIcon(SYM_SUCHE)+'</button>';
  s += '<button type="button" class="iconbtn kopf-sym" data-nav="#settings" aria-label="'+esc(t("settings"))+'">'+ICON_SETTINGS+'</button>';
  return s;
}
function bindThemeToggle(){
  var b = app.querySelector("[data-themetoggle]");
  if(b) b.addEventListener("click", function(){
    state.db.settings.theme = themeIstDunkel() ? "light" : "dark";
    save(); applyTheme(); render();
  });
}
/* Runder Hauptknopf rechts neben der Leiste (New): Heute = Training starten, Training = Bauen, Kalender = Einplanen, Fortschritt = keiner */
function hauptAktionNeu(route){
  if(route === "home") return { svg:P_PLAY, label:t("hauptStart"), fn:function(){
    var hk = app.querySelector("[data-herostart]");
    if(hk && hk.getAttribute("data-herostart") === "plan"){ hk.click(); return; }   // heute eingeplant: dieses Training starten
    builderAuto = "zufall"; katTabSetzen("baukasten"); go("#katalog");               // sonst gleich „Überrasch mich“
  } };
  if(route === "training") return { svg:P_PLUS, label:t("hauptBauen"), fn:function(){
    openActionSheet(t("hauptBauen"), [
      { ico:HOME_ICON.katalog, label:t("builderZufall"), fn:function(){ builderAuto = "zufall"; katTabSetzen("baukasten"); go("#katalog"); } },
      { ico:P_PLUS, label:t("builderSelber"), fn:function(){ builderAuto = "selber"; katTabSetzen("baukasten"); go("#katalog"); } },
      { ico:HOME_ICON.intervall, label:t("tabTimer"), fn:function(){ go("#intervall"); } },
      { ico:HOME_ICON.reps, label:t("repTitle"), fn:function(){ go("#reps"); } }
    ]);
  } };
  if(route === "kalender") return { svg:P_PLUS, label:t("kalAdd"), fn:function(){ kalHinzuMenue(kalAuswahl || kalTagKey(Date.now())); } };
  return null;
}
var NEU_TABS = { home:"#home", training:"#training", kalender:"#kalender", stats:"#stats" };
/* Der Workout-Bereich zeigt die Leiste auf seinen Listen (Katalog, Übungen, Meine), nicht im Plan-Bau, in der Gewichtung und in Details */
var BEREICH_LEISTE = { katalog:1, library:1, timers:1, uebungskatalog:1 };
function tabLeiste(route){
  var el = document.getElementById("tabbar");
  if(!el) return;
  var imBereich = !!BEREICH_LEISTE[route] && !(stPlanAktiv && stPlanFind(stPlanAktiv));
  var neu = layoutNeu();
  /* New: die Leiste steht nur auf den vier Hauptseiten (wie im Entwurf); Klassik: auch auf Suche, Einstellungen und den Bereichslisten */
  var aktiv = neu ? (NEU_TABS[route] || null) : (TAB_ROUTEN[route] || (imBereich ? "#home" : null));
  if(!aktiv){ el.innerHTML = ""; el.classList.add("hidden"); document.body.classList.remove("mit-tabs"); return; }
  var eintraege = neu ? [
    ["#home", t("tabHeute"), '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'],
    ["#training", t("tabTraining"), '<path d="M6 7v10M3 10v4M18 7v10M21 10v4M6 12h12"/>'],
    ["#kalender", t("tabKalender"), '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'],
    ["#stats", t("tabFortschritt"), '<path d="M5 20V11M12 20V4M19 20v-6"/>']
  ] : [
    ["#home", t("tabStart"), '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'],
    ["#search", t("search"), '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>'],
    ["#kalender", t("tabKalender"), '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'],
    ["#stats", t("tabStats"), '<path d="M5 20V11M12 20V4M19 20v-6"/>'],
    ["#settings", t("settings"), null]
  ];
  var tabsHTML = eintraege.map(function(x){
    return '<button type="button" class="tab'+(x[0] === aktiv ? ' active' : '')+'" data-nav="'+x[0]+'"'+(x[0] === aktiv ? ' aria-current="page"' : '')+'>'+
      (x[2] ? svgIcon(x[2]) : '<span class="ico">'+ICON_SETTINGS+'</span>')+'<span>'+esc(x[1])+'</span></button>';
  }).join("");
  var haupt = neu ? hauptAktionNeu(route) : null;
  el.innerHTML = neu
    ? '<div class="pille">'+tabsHTML+'</div>'+(haupt ? '<button type="button" class="hauptknopf" data-haupt aria-label="'+esc(haupt.label)+'" title="'+esc(haupt.label)+'">'+svgIcon(haupt.svg)+'</button>' : '')
    : tabsHTML;
  el.classList.toggle("mit-haupt", !!haupt);
  el.classList.remove("hidden"); document.body.classList.add("mit-tabs");
  var hb = el.querySelector("[data-haupt]");
  if(hb) hb.addEventListener("click", function(){ haupt.fn(); });
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
  if(route==="home" || route==="training"){   // Filter und aufklappbare Bereiche (Air-Filter, Studio-Filter, Studio-Timer) beginnen bei jedem neuen Besuch zugeklappt
    stPlanAktiv = null; stPlanBauen = false;   // ein zuletzt geöffneter Plan gilt nicht weiter (Satz-/Timer-Wahl und Training speichern folgen sonst einem alten Plan)
    var sz = state.db.settings; delete sz.libFilterOpen; delete sz.stFilterOpen; delete sz.wsFilterOpen; delete sz.repFilterOpen; delete sz.buildFilterOpen; delete sz.stTimerAuf;
    /* Gewählte Filter (Gruppe, Ausrüstung, Körperkarte; Mobility & Stretch; Übungsauswahl; Summit) werden nicht aufbewahrt: jeder neue Besuch beginnt ohne Filter.
       Ort, Sortierung A–Z und die Art des Bauens bleiben als Einstellungen stehen. */
    ["stGruppen", "stArten", "stZonen", "wsRegionen", "wsZonen", "buildCats", "buildCat", "buildEquips", "buildZonen"].forEach(function(k){ delete sz[k]; });
    if(typeof repFilter === "object"){ repFilter.lvl = "all"; repFilter.bar = "all"; repFilter.stufe = "standard"; }
    hinweisBesucht = {};   // Erklärtexte: der nächste Besuch einer Seite zählt wieder
    katOffen = {};         // Katalog: beim nächsten Besuch stehen wieder nur die Überschriften
  }
  if(repRun && route !== "repplay") repStop();   // Rep-Workout verlassen: Stoppuhr aus
  if(studioPause && route !== "studio") studioPauseStop();
  if(route==="home") return renderHome();
  if(route==="training") return renderTraining();
  if(route==="reps") return renderReps();
  if(route==="warmstretch") return renderWarmStretch();
  if(route==="rep") return renderRepDetail(parts[1]);
  if(route==="repplay") return renderRepPlayer(parts[1]);
  if(route==="repedit") return renderRepEdit(parts[1]);
  if(route==="repunitedit") return renderRepUnitEdit(parts[1]);
  if(route==="kalender") return renderKalender();
  if(route==="run") return renderRun();
  if(route==="rundetail") return renderRunDetail(parts[1]);
  if(route==="intervall") return renderIntervall();   // Timer: eigene Seite (früher je ein Reiter in Air und Studio)
  if(route==="timers"){
    if(parts[1] === "workouts" || parts[1] === "blocks"){   // frühere Timer-Reiter: jetzt die Timer-Seite
      navStack[navStack.length-1] = "#intervall"; setUrl("#intervall");
      return renderIntervall();
    }
    return renderKatalog();   // Studio ist jetzt der Katalog
  }
  if(route==="studioplan"){   // Favorit auf der Startseite: Katalog › Meine › Plan direkt geöffnet
    var sp0 = state.db.settings;
    if(stPlanFind(parts[1])){ sp0.katTab = "workouts"; sp0.katAbt = "meine"; stPlanAktiv = parts[1]; stPlanBauen = false; stPlanQuery = ""; }
    navStack[navStack.length-1] = "#katalog"; setUrl("#katalog");
    return renderKatalog();
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
  if(route==="katalog" || route==="library") return renderKatalog();   // „#library“ (Air) und „#timers“ (Studio) sind jetzt der Katalog
  if(route==="uebungskatalog"){ state.db.settings.katTab = "workouts"; state.db.settings.katAbt = "uebungen"; return renderKatalog(); }
  if(route==="exedit") return renderExEdit(parts[1]);
  if(route==="import") return renderImport(parts[1]);
  if(route==="mybuild") return renderMyBuild(parts[1]);
  if(!(coverDraft && coverDraft.src === "neu" && (route === "cover" || route === "playdraft"))) bauEntwurf = null;   // Baukasten verlassen (das Deckblatt eines noch nicht gespeicherten Workouts behält den Entwurf zum Zurückkehren)
  if(route==="playmy") return launchFromSource({ type:"mine", id:parts[1] });
  if(route==="cover") return parts[1]==="surprise" || parts[1]==="shared" || parts[1]==="neu"
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
  return '<div class="topbar'+(opts.home?' home':'')+'">'+back+'<h1><span class="ttl">'+esc(title)+'</span>'+
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

