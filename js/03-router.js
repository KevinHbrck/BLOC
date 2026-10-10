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
    katOffen = {};         // Katalog: beim nächsten Besuch stehen wieder nur die Überschriften
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
    return renderKatalog();   // Studio ist jetzt der Katalog
  }
  if(route==="studioplan"){   // Favorit auf der Startseite: Katalog › Meine › Plan direkt geöffnet
    var sp0 = state.db.settings;
    if(stPlanFind(parts[1])){ sp0.katTab = "meine"; stPlanAktiv = parts[1]; stPlanBauen = false; stGen = null; stPlanQuery = ""; }
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

