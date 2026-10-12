"use strict";
/* ============ Katalog ============
   Air und Studio unter einem Dach (2026-10-10), seit 2026-10-12 mit den Reitern Katalog · Baukasten:
   - Katalog: zwei Abteilungen „Meine“ (eigene Workouts mit Timer und Pläne mit Gewicht × Wiederholungen) und „Workoutkatalog“
     (fertige Workouts nach Fokus, mit Ort-Schalter und Filter); dazu eine Karte „Übungskatalog“ (eigene Seite #uebungskatalog:
     alle Übungen nach Bereichen, Filter, eigene Übung anlegen).
   - Baukasten: „Überrasch mich“ (Zufall oder nach Gewichtung) oder „Selber bauen“ (mit Timer oder mit Gewicht), groß und vorn.
   Die Seiten selbst liegen in renderKatalogWorkouts, renderLibrary (Meine), renderKatalogUebungen und renderKatalogBaukasten; die Plan-Seiten
   (renderStudioPlan, renderStudioPlanGen) öffnen sich aus „Meine“. Hier stehen Kopf, Reiter, aufklappbare Bereiche und die Zuordnung. */
var KAT_TABS = ["workouts", "baukasten"];
var katOffen = {};   // Bereiche: true = aufgeklappt, false = zugeklappt, fehlt = Standard (offen bei Filter oder Suche, sonst zu); nur für diesen Besuch

/* Letzter Reiter; Nutzer der früheren Seiten Air und Studio landen dort, wo sie zuletzt waren */
function katTab(){
  var s = state.db.settings;
  // frühere Reiter: „Meine“ ist jetzt eine Abteilung des Katalogs, „Übungen“ heißt Baukasten
  if(s.katTab === "meine"){ s.katTab = "workouts"; s.katAbt = "meine"; }
  else if(s.katTab === "uebungen") s.katTab = "baukasten";
  if(KAT_TABS.indexOf(s.katTab) > -1) return s.katTab;
  if(s.libTab === "mine"){ s.katAbt = "meine"; return "workouts"; }
  return s.libTab === "exercises" ? "baukasten" : "workouts";
}
/* Abteilung im Katalog: „workouts“ (Workoutkatalog) oder „meine“ (eigene Workouts und Pläne) */
function katAbt(){ var a = state.db.settings.katAbt; return a === "meine" || a === "uebungen" ? a : "workouts"; }   // „meine“ | „workouts“ (Workoutkatalog) | „uebungen“ (Übungskatalog)
function katZuMeine(){ var s = state.db.settings; s.katTab = "workouts"; s.katAbt = "meine"; }
function katTabSetzen(tab){
  var s = state.db.settings;
  s.katTab = tab; stPlanAktiv = null; stPlanBauen = false; stGen = null; stPlanQuery = "";
  save();
}

/* ---------- Zuordnung der Übungen zu Bereichen ----------
   Studio-Übungen behalten ihre Gruppe aus STUDIO_GRUPPEN. Alle anderen (Air) kommen dorthin, wo ihr erster Hauptmuskel liegt;
   Ausdauerübungen bilden den Bereich Cardio. So steht jede Übung genau einmal da, und die Gruppen-Chips des Filters gelten für alle. */
var KAT_GRUPPEN = [
  { id:"brust", key:"mgBrust" }, { id:"ruecken", key:"mgRuecken" }, { id:"schulter", key:"mgSchulter" }, { id:"arme", key:"mgArme" },
  { id:"bauch", key:"mgRumpf" }, { id:"beine", key:"mgBeine" }, { id:"cardio", key:"katCardio" }
];
var KAT_VON_MUSKEL = { brust:"brust", ruecken:"ruecken", schulter:"schulter", arme:"arme", rumpf:"bauch", beine:"beine" };
var katKurat = null;
function katKuratiert(){
  if(!katKurat){ katKurat = {}; STUDIO_GRUPPEN.forEach(function(g){ g.ids.split(" ").forEach(function(id){ katKurat[id] = g.id; }); }); }
  return katKurat;
}
function katGruppeVon(ex){
  if(ex.custom) return "eigene";
  var k = katKuratiert()[ex.id];
  if(k) return k;
  if(ex.main === "ausdauer") return "cardio";
  var m = EX_MUSCLES[ex.id], griff = "";
  if(m && m[0]){
    var teile = m[0].toLowerCase().split(/[,;\/·]| und /);
    for(var i = 0; i < teile.length; i++){
      for(var j = 0; j < MUSKEL_GRP.length; j++){
        if(!MUSKEL_GRP[j].re.test(teile[i])) continue;
        // „Unterarme (Griff)“ allein macht eine Übung nicht zur Armübung, solange etwas Besseres folgt
        if(MUSKEL_GRP[j].id === "arme" && /unterarm|griff/.test(teile[i]) && !/bizeps|trizeps/.test(teile[i])){ griff = "arme"; break; }
        return KAT_VON_MUSKEL[MUSKEL_GRP[j].id];
      }
    }
    if(griff) return griff;
  }
  var v = mgVerteilung(ex), best = "", bw = 0;
  Object.keys(v).forEach(function(g){ if(v[g] > bw){ bw = v[g]; best = g; } });
  return KAT_VON_MUSKEL[best] || (ex.main === "rumpf" ? "bauch" : "beine");
}
var KAT_ICON_UHR = '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>';
function katIcon(id){ return STUDIO_GRUPPEN_ICON[id] || CAT_ICON[id] || CAT_ICON.weight; }
/* Bereiche der Übungen: [{ id, name, ids }] in der Reihenfolge Brust, Rücken, Schultern, Arme, Bauch, Beine, Cardio, Eigene.
   Ohne Dehnübungen (die stehen unter Mobility & Stretch) und ohne ausgeblendete. */
function katalogGruppen(){
  var out = KAT_GRUPPEN.map(function(g){ return { id:g.id, name:t(g.key), ids:[] }; }), by = {};
  out.forEach(function(g){ by[g.id] = g; });
  var eigene = { id:"eigene", name:t("stOwn"), ids:[], eigene:true };
  EXERCISES.forEach(function(ex){
    if(ex.main === "stretch" || libHidden("ex:"+ex.id)) return;
    var g = katGruppeVon(ex);
    if(g === "eigene") eigene.ids.push(ex.id); else (by[g] || by.beine).ids.push(ex.id);
  });
  out.push(eigene);
  return out;
}
function katGruppeIds(gruppen){   // Übungs-ID -> Bereich
  var m = {};
  gruppen.forEach(function(g){ g.ids.forEach(function(id){ m[id] = g.id; }); });
  return m;
}

/* ---------- Aufklappbare Bereiche ---------- */
/* extra: HTML vor der Anzahl (z. B. „2 gewählt“); gym: nur Fitnessstudio-Inhalt - das Symbol ist dann hellgrün, sonst blau (Freiluft) */
function katZeileHTML(id, ico, name, n, inhalt, offen, extra, gym){
  return '<details class="st-air-gr kat-gr'+(gym ? ' kat-gym' : '')+'" data-katgr="'+esc(id)+'"'+(offen ? ' open' : '')+'><summary>'+
    '<span class="sag-ico">'+svgIcon(ico)+'</span><b>'+esc(name)+'</b>'+(extra || '')+
    '<span class="lbl-hint">'+n+'</span><span class="tpl-chev" aria-hidden="true">&#9662;</span></summary>'+inhalt+'</details>';
}
function katOffenStd(id, standard){ return katOffen[id] === undefined ? !!standard : !!katOffen[id]; }
/* Antippen klappt auf/zu (selbst umgeschaltet, damit der Zustand fürs Neuzeichnen bekannt ist); während einer Suche bleiben alle offen.
   suche: Funktion, die den aktuellen Suchtext liefert (oder weggelassen) */
function katBinden(suche){
  app.querySelectorAll("details.kat-gr > summary").forEach(function(sm){
    sm.addEventListener("click", function(e){
      e.preventDefault();
      if(suche && suche()) return;
      var d = sm.parentNode; d.open = !d.open; katOffen[d.getAttribute("data-katgr")] = d.open;
    });
  });
}
/* Nach applySearch: bei einer Suche alle Bereiche mit Treffern offen, ohne Treffer weg; ohne Suche wieder wie gemerkt. standard: offen bei Filter */
function katSuche(q, standard){
  app.querySelectorAll("details.kat-gr").forEach(function(d){
    var id = d.getAttribute("data-katgr");
    d.open = !!q || katOffenStd(id, standard);
    d.style.display = !q || Array.prototype.some.call(d.querySelectorAll("[data-q]"), function(k){ return k.style.display !== "none"; }) ? "" : "none";
  });
}

/* ---------- Kopf: Titel, Reiter, Überrasch mich ---------- */
function katKopfHTML(tab, right){
  function b(k, label){ return '<button type="button" data-kattab="'+k+'" class="'+(tab === k ? 'active' : '')+'">'+esc(label)+'</button>'; }
  var kopf = topbar(t("katalog"), { back:"#home", right:right || "" }) +
    '<div class="rz kat-rz" style="--rz:var(--text)">'+b("workouts", t("katTabKatalog"))+b("baukasten", t("katTabBaukasten"))+'</div>';
  if(tab !== "workouts") return kopf;
  // Katalog: drei gleichrangige Abteilungen Meine · Workoutkatalog · Übungskatalog, im Workoutkatalog ganz vorn der Ort
  var abt = katAbt();
  function a(k, label){ return '<button type="button" data-katabt="'+k+'" class="'+(abt === k ? 'active' : '')+'" aria-pressed="'+(abt === k)+'">'+esc(label)+'</button>'; }
  return kopf +
    '<div class="seg-row kat-abt" role="group">'+a("meine", t("tabMine"))+a("workouts", t("katAbtWorkouts"))+a("uebungen", t("katUebKatalog"))+'</div>' +
    (abt === "workouts" ? katOrtHTML() : '');
}
/* Ort: Fitnessstudio (Workouts mit Geräten oder Langhantel) oder Freiluft (alles andere: zuhause, draußen, mit Kurzhantel, Band, Stange) */
var KAT_ICON_STUDIO = '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>';
var KAT_ICON_FREI = '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>';
function katOrt(){ return state.db.settings.katOrt === "studio" ? "studio" : "frei"; }
function katWoOrt(exs){ return exs.some(function(ex){ return ex.equip.indexOf("gym") > -1; }) ? "studio" : "frei"; }
/* Ort einer Übung: Fitnessstudio (Geräte, Kabel, Langhantel, alles mit Ausrüstung „Fitnessstudio“) oder Freiluft (alles andere) */
function exOrt(ex){ return exIstStudio(ex) ? "studio" : "frei"; }
/* Schalter Fitnessstudio · Freiluft. Ohne Angaben: der Ort des Katalogs mit der Zahl der Workouts je Ort; für „Plan nach Gewichtung“ mit
   eigenem Ort (attr = "data-genort") und Zahl der Übungen */
function katOrtHTML(sel, zahl, attr, textKey){
  var o = sel || katOrt(), n = zahl;
  attr = attr || "data-katort"; textKey = textKey || "katOrtAnz";
  if(!n){
    n = { studio:0, frei:0 };
    LIB_WORKOUTS.forEach(function(lw){
      if(libIstWarmDehn(lw) || libHidden("wo:"+lw.id)) return;
      n[katWoOrt(lw.exercises.map(findExercise).filter(Boolean))]++;
    });
  }
  function b(k, label, ico){
    return '<button type="button" '+attr+'="'+k+'" class="'+(o === k ? 'on' : '')+'" aria-pressed="'+(o === k)+'">'+svgIcon(ico)+
      '<span class="ko-t"><b>'+esc(label)+'</b><small>'+esc(t(textKey, { n:n[k] }))+'</small></span></button>';
  }
  return '<div class="kat-ort" role="group" aria-label="'+esc(t("katOrt"))+'">'+b("studio", t("katOrtStudio"), KAT_ICON_STUDIO)+b("frei", t("katOrtFrei"), KAT_ICON_FREI)+'</div>';
}
/* Beim Bauen wird immer nach Ort unterschieden: die Auswahl zeigt nur die Übungen des gewählten Ortes (derselbe Ort wie im Workoutkatalog,
   settings.katOrt); der Schalter wechselt. Schon gewählte Übungen bleiben im Plan, auch wenn sie zum anderen Ort gehören. */
function bauOrtHTML(){
  var n = { studio:0, frei:0 };
  EXERCISES.forEach(function(ex){ if(ex.main === "stretch" || libHidden("ex:"+ex.id)) return; n[exOrt(ex)]++; });
  return katOrtHTML(katOrt(), n, "data-bauort", "katOrtUebAnz");
}
function bauOrtBinden(neu, box){
  (box || app).querySelectorAll("[data-bauort]").forEach(function(b){
    b.addEventListener("click", function(){
      var o = b.getAttribute("data-bauort");
      if(o === katOrt()) return;
      state.db.settings.katOrt = o; delete state.db.settings.bauModusOrt; save(); neu();
    });
  });
}
/* Neuer Plan: sofort angelegt (es muss nichts gespeichert werden) und gleich im Plan-Bau geöffnet.
   Bleibt er ohne Übung liegen, wird er beim Verlassen wieder entfernt, damit keine leeren Pläne herumliegen. */
var stPlanNeuId = null;
function katPlanNeu(){
  katPlanAufraeumen();
  var p = { id:uid(), name:t("planDefault", { n:stPlaene().length+1 }), ids:[], updatedAt:Date.now() };
  stPlaene().push(p); save();
  stPlanNeuId = p.id;
  katZuMeine();
  stPlanAktiv = p.id; stPlanBauen = true; stPlanSel = -1; stPlanQuery = ""; stGen = null;
  renderKatalog(); window.scrollTo(0, 0);
}
function katPlanAufraeumen(){
  var id = stPlanNeuId;
  if(!id || stPlanAktiv === id) return;
  stPlanNeuId = null;
  var p = stPlanFind(id);
  if(p && !stPlanIds(p).length){ state.db.settings.stPlaene = stPlaene().filter(function(x){ return x.id !== id; }); save(); }
}
function katKopfBinden(){
  app.querySelectorAll("[data-kattab]").forEach(function(b){
    b.addEventListener("click", function(){
      var k = b.getAttribute("data-kattab");
      if(k === katTab() && !stPlanAktiv && !stGen) return;
      katTabSetzen(k); renderKatalog(); window.scrollTo(0, 0);
    });
  });
  // Abteilung des Katalogs: Meine · Workoutkatalog
  app.querySelectorAll("[data-katabt]").forEach(function(b){
    b.addEventListener("click", function(){
      var a = b.getAttribute("data-katabt");
      if(a === katAbt()) return;
      state.db.settings.katAbt = a; save(); katOffen = {};
      renderKatalog(); window.scrollTo(0, 0);
    });
  });
  app.querySelectorAll("[data-katort]").forEach(function(b){
    b.addEventListener("click", function(){
      var o = b.getAttribute("data-katort");
      if(o === katOrt()) return;
      state.db.settings.katOrt = o; delete state.db.settings.bauModusOrt; save(); katOffen = {};
      renderKatalog(); window.scrollTo(0, 0);
    });
  });
}

/* ---------- Einstieg: die richtige Seite zum Reiter ---------- */
function renderKatalog(){
  katPlanAufraeumen();
  if(stPlanAktiv && !stPlanFind(stPlanAktiv)){ stPlanAktiv = null; stPlanBauen = false; }
  tabLeiste("katalog");   // untere Leiste auf den Listen des Bereichs, nicht im Plan-Bau (Reiterwechsel rendern nicht über render())
  if(stGen) return renderStudioPlanGen();
  if(stPlanAktiv && stPlanFind(stPlanAktiv)) return renderStudioPlan();
  stPlanAktiv = null; stPlanBauen = false;
  var tab = katTab();
  if(tab === "baukasten") return renderKatalogBaukasten();
  var abt = katAbt();
  return abt === "meine" ? renderLibrary() : abt === "uebungen" ? renderKatalogUebungen() : renderKatalogWorkouts();
}

/* Art im Baukasten: Freiluft läuft standardmäßig mit Timer (Zeit pro Übung), Fitnessstudio mit Gewicht. Der Kippschalter „Mit Gewicht“ stellt um (auch
   Freiluft mit Gewicht, Fitnessstudio mit Zeit); die Wahl gilt für den gewählten Ort, beim Ortswechsel gilt wieder der Standard. */
function bauModus(){
  var s = state.db.settings;
  if(s.bauModusOrt === katOrt() && (s.bauModus === "gewicht" || s.bauModus === "timer")) return s.bauModus;
  return katOrt() === "studio" ? "gewicht" : "timer";
}
/* ---------- Baukasten: Überrasch mich oder selber bauen ---------- */
function renderKatalogBaukasten(){
  var s = state.db.settings, modus = bauModus();
  var hw = hinweise("bau2", ["katBauHint"]);
  app.innerHTML =
    katKopfHTML("baukasten", hw.knopf) +
    hw.z(0, "page-hint") +
    bauOrtHTML() +
    '<div class="bau-toggle">'+toggleRow("bau-gewicht", esc(t("bauGewichtToggle")), esc(t(modus === "timer" ? "bauModusTimerSub" : "bauModusGewichtSub")), modus === "gewicht")+'</div>'+
    '<button type="button" class="bau-karte bau-sp" data-surprise><span class="bk-ico">'+svgIcon(ICON_UEBERRASCH)+'</span><span class="bk-t"><b>'+esc(t("surprise"))+'</b><small>'+esc(t("bauUeberraschSub"))+'</small></span><span class="bk-pfeil">'+ICON_CHEV+'</span></button>'+
    '<button type="button" class="bau-karte" data-bauselber><span class="bk-ico">'+ICON_PLUS+'</span><span class="bk-t"><b>'+esc(t("bauSelber"))+'</b><small>'+esc(t("bauSelberSub"))+'</small></span><span class="bk-pfeil">'+ICON_CHEV+'</span></button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  katKopfBinden();
  bindToggle("bau-gewicht", function(v){ s.bauModus = v ? "gewicht" : "timer"; s.bauModusOrt = katOrt(); save(); renderKatalog(); });
  bauOrtBinden(function(){ renderKatalog(); });
  app.querySelector("[data-surprise]").addEventListener("click", function(){ openSurprise(); });
  app.querySelector("[data-bauselber]").addEventListener("click", function(){
    if(modus === "timer") go("#mybuild/new"); else katPlanNeu();
  });
}

/* ---------- Übungskatalog (dritte Abteilung des Katalogs; #uebungskatalog führt dorthin) ---------- */
function renderKatalogUebungen(){
  tabLeiste("katalog");
  var s = state.db.settings, alle = studioAlle();
  studioFilterAlt();
  var gruppen = katalogGruppen(), vonId = katGruppeIds(gruppen), gueltig = {};
  gruppen.forEach(function(g){ gueltig[g.id] = true; });
  var fGr = selArr(s.stGruppen).filter(function(id){ return gueltig[id]; });
  var fArt = selArr(s.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1; });
  var zonen = kkNorm(s.stZonen);   // Körperkarte: gewählte Muskelzonen
  function artOk(id){ return (!fArt.length || fArt.indexOf(studioArt(id)) > -1) && (!zonen.length || zonePasst(findExercise(id), zonen)); }
  function passt(id){ return !!vonId[id] && (!fGr.length || fGr.indexOf(vonId[id]) > -1) && artOk(id); }
  var filterAn = !!(fGr.length || fArt.length || zonen.length);
  var favs = (s.exFavs || []).filter(function(id){ return !!findExercise(id) && passt(id); });
  var zuletzt = Object.keys(alle).filter(function(id){ return alle[id].zuletzt && findExercise(id) && passt(id) && favs.indexOf(id) < 0; })
    .sort(function(a, b){ return alle[b].zuletzt - alle[a].zuletzt; }).slice(0, 6);
  var anzahl = 0;
  gruppen.forEach(function(g){ if(!fGr.length || fGr.indexOf(g.id) > -1) anzahl += g.ids.filter(artOk).length; });
  var hw = hinweise("katueb", ["katUebHint"]);
  var html = "";
  function zeile(id, ico, name, ids, offen, extra, innenPlus){
    var gym = ids.length > 0 && ids.every(function(id){ return exIstStudio(findExercise(id)); });   // nur Fitnessstudio: hellgrünes Symbol
    return katZeileHTML(id, ico, name, ids.length, '<div class="fig-grid">'+ids.map(studioKachel).join("")+(innenPlus || "")+'</div>', katOffenStd(id, offen), extra, gym);
  }
  if(favs.length) html += zeile("fav", ICON_STAR, t("stFavs"), favs, false);
  if(zuletzt.length) html += zeile("zuletzt", KAT_ICON_UHR, t("stRecent"), zuletzt, false);
  gruppen.forEach(function(g){
    if(fGr.length && fGr.indexOf(g.id) < 0) return;
    var ids = g.ids.filter(artOk);
    if(!ids.length && (!g.eigene || filterAn)) return;
    var neu = g.eigene ? '<button type="button" class="fig-karte st-neu" data-stnew>'+ICON_PLUS+'<span class="fig-name">'+esc(t("stOwnNew"))+'</span></button>' : '';
    html += zeile(g.id, katIcon(g.id), g.name, ids, false, "", neu);   // Bereiche stehen immer zugeklappt da (auch mit Filter); nur eine Suche klappt Treffer auf
  });
  // früher (in Air) ausgeblendete Übungen: unten gesammelt, mit „Einblenden“
  var verborgen = EXERCISES.filter(function(ex){ return ex.main !== "stretch" && libHidden("ex:"+ex.id); });
  app.innerHTML =
    katKopfHTML("workouts", hw.knopf+lupeHTML("st", studioQuery)) +
    '<button type="button" class="btn btn-secondary kat-eigene" data-stnew2>'+ICON_PLUS+' '+esc(t("exNew"))+'</button>' +
    hw.z(0, "page-hint") +
    suchFeldHTML(studioQuery, "st", t("stSearch")) +
    studioFilterHTML(gruppen, fGr, fArt, anzahl, zonen) +
    html +
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("stNone"))+'</div>' +
    hiddenBlockHTML(verborgen.length, verborgen.map(function(ex){ return libExCard(ex, true, exSubText(ex)); }).join("")) +
    '<button type="button" class="btn btn-secondary kat-link" data-nav="#warmstretch">'+svgIcon(HOME_ICON.warm)+' '+esc(t("katLinkMobility"))+'</button>' +
    '<div style="height:40px"></div>';
  bindCommon();
  katKopfBinden();
  app.querySelectorAll("[data-unhideone]").forEach(function(b){
    b.addEventListener("click", function(e){
      e.stopPropagation();
      var k = b.getAttribute("data-unhideone");
      s.hiddenLib = (s.hiddenLib || []).filter(function(x){ return x !== k; });
      save(); var y = window.scrollY; renderKatalogUebungen(); window.scrollTo(0, y);
    });
  });
  app.querySelectorAll("[data-studio]").forEach(function(b){
    function oeffnen(){ go("#studio/"+b.getAttribute("data-studio")); }
    b.addEventListener("click", oeffnen);
    b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); oeffnen(); } });
    langDruck(b, function(){ exZuProgramm(b.getAttribute("data-studio")); });   // lange drücken: in ein Workout oder einen Plan legen
  });
  app.querySelectorAll("[data-exfav]").forEach(function(b){ b.addEventListener("click", function(e){
    e.stopPropagation(); toggleExFav(b.getAttribute("data-exfav"));
    var y = window.scrollY; renderKatalogUebungen(); window.scrollTo(0, y);
  }); });
  function neuZeichnen(){ var y = window.scrollY; renderKatalogUebungen(); window.scrollTo(0, y); }
  studioFilterBinden(fGr, fArt, zonen, neuZeichnen);
  var neu = app.querySelector("[data-stnew]");
  if(neu) neu.addEventListener("click", function(){ exEditVorgabe = { equip:["gym"], cats:["weight"], reps:3, work:40, rest:60 }; go("#exedit/new"); });
  var neu2 = app.querySelector("[data-stnew2]");   // oben auf der Seite: eigene Übung anlegen
  if(neu2) neu2.addEventListener("click", function(){ go("#exedit/new"); });
  katBinden(function(){ return studioQuery; });
  var q = app.querySelector("#st-q");
  function suchen(){
    applySearch(app, studioQuery);
    katSuche(studioQuery, false);   // bei einer Suche alle Bereiche mit Treffern offen, die übrigen weg
  }
  q.addEventListener("input", function(){ studioQuery = q.value; suchen(); });
  if(studioQuery) suchen();
}

/* ---------- Meine: Pläne ---------- */
function katPlaeneHTML(){
  var pl = stPlaene().slice().sort(function(a, b){ return (b.updatedAt || 0) - (a.updatedAt || 0); });
  return '<div class="section-title">'+esc(t("katPlaene"))+'</div>'+
    (pl.length ? pl.map(function(p){
      var ids = stPlanIds(p), namen = ids.slice(0, 3).map(function(id){ return tplText(findExercise(id).name); }).join(", ")+(ids.length > 3 ? " …" : "");
      return '<div class="list-item entry plan-item" data-plan="'+esc(p.id)+'" role="button" tabindex="0">'+
        '<div class="meta"><div class="name">'+esc(p.name)+'</div><div class="sub">'+esc(planAnzahl(ids.length))+(ids.length ? SEP+esc(namen) : '')+'</div></div>'+
        '<div class="card-aside"><div class="card-acts">'+favBtn("plan:"+p.id)+trashBtn("plan", p.id, p.name)+'</div></div></div>';
    }).join("") : '<div class="fav-empty">'+esc(t("planNone"))+'</div>')+
    (pl.length > 1 ? auswertungHTML(pl.reduce(function(a, p){ return a.concat(stPlanIds(p)); }, []), { gesamt:true, titel:t("ausAll") }) : '');
}
function katPlaeneBinden(){
  app.querySelectorAll("[data-plan]").forEach(function(el){
    function los(){ stPlanAktiv = el.getAttribute("data-plan"); stPlanBauen = false; stPlanSel = -1; stPlanQuery = ""; renderKatalog(); window.scrollTo(0, 0); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.target === el && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); los(); } });
  });
}
/* Deckblatt eines Fitnessstudio-Workouts: „Mit Gewichten trainieren“ legt einen Plan mit denselben Übungen an (einmal je Workout, danach wird er
   nur geöffnet) und zeigt ihn - dort stehen Gewicht × Wiederholungen vorn, „Mit Timer starten“ ist der optionale zweite Knopf */
function katPlanAusDraft(d){
  var ids = [];
  d.items.forEach(function(it){ var ex = findExercise(it.ex); if(ex && ex.main !== "stretch" && ids.indexOf(it.ex) < 0) ids.push(it.ex); });
  if(!ids.length) return;
  var l = stPlaene(), p = null;
  l.forEach(function(x){ if(x.fromWo === d.key) p = x; });
  if(!p){
    p = { id:uid(), name:d.name || t("planDefault", { n:l.length+1 }), ids:ids, updatedAt:Date.now(), fromWo:d.key };
    l.push(p);
  }
  save();
  katZuMeine();
  stPlanAktiv = p.id; stPlanBauen = false; stPlanQuery = ""; stGen = null;
  go("#katalog");
}
/* Plan nach Gewichtung: Seite mit den Reglern; der Ort (Fitnessstudio oder Freiluft) entscheidet, aus welchen Übungen gezogen wird */
function katPlanGenNeu(){
  stPlanAktiv = null; stPlanBauen = false;
  stGen = { w:{ brust:15, ruecken:15, schulter:10, arme:10, rumpf:15, beine:35 }, n:8, ort:katOrt() };
  katZuMeine();
  renderKatalog(); window.scrollTo(0, 0);
}
/* ---------- Katalog: fertige Workouts (derselbe Filter wie bei den Übungen) ----------
   Überschriften sind dieselben Bereiche wie bei den Übungen, dazu „Ganzkörper“. Ein Workout steht dort, wohin sein Fokus zeigt
   (Cardio, Beine, Rücken, Arme, Bauch) oder wo klar die meisten seiner Übungen liegen (mindestens 40 % und mehr als im zweiten Bereich); sonst unter Ganzkörper.
   Filter (gespeichert wie bei den Übungen: settings.stGruppen, stArten, stZonen):
   - Gruppe und Körperkarte: mindestens ein Drittel der Übungen passt
   - Ausrüstung: jede Übung geht mit der gewählten Ausrüstung (Körpergewicht braucht nichts) - „was hast du dabei?“ */
var KAT_WO_FOKUS_BEREICH = { cardio:"cardio", legs:"beine", back:"ruecken", arms:"arme", core:"bauch" };
var KAT_WO_BEREICHE = ["ganz", "brust", "ruecken", "schulter", "arme", "bauch", "beine", "cardio"];
function katWoBereich(lw, exs){
  var f = KAT_WO_FOKUS_BEREICH[lw.focus];
  if(f) return f;
  var n = {};
  exs.forEach(function(ex){ var g = katGruppeVon(ex); n[g] = (n[g] || 0) + 1; });
  var l = Object.keys(n).sort(function(a, b){ return n[b] - n[a]; });
  var best = l[0], bn = n[best] || 0, zweit = l[1] ? n[l[1]] : 0;
  // klar vorn: mindestens 40 % und mehr als der zweite - sonst ein Workout für den ganzen Körper
  return exs.length && bn >= exs.length*0.4 && bn > zweit && KAT_WO_BEREICHE.indexOf(best) > -1 ? best : "ganz";
}
function katWoPasst(exs, fGr, fArt, zonen){
  var n = exs.length;
  if(!n) return false;
  var drittel = Math.max(1, n/3);
  if(fGr.length && exs.filter(function(ex){ return fGr.indexOf(katGruppeVon(ex)) > -1; }).length < drittel) return false;
  if(zonen.length && exs.filter(function(ex){ return zonePasst(ex, zonen); }).length < drittel) return false;
  if(fArt.length && !exs.every(function(ex){ var a = studioArt(ex.id); return a === "koerper" || fArt.indexOf(a) > -1; })) return false;
  return true;
}
function renderKatalogWorkouts(){
  var s = state.db.settings;
  studioFilterAlt();
  var gruppen = katalogGruppen(), gueltig = {};
  gruppen.forEach(function(g){ gueltig[g.id] = true; });
  var fGr = selArr(s.stGruppen).filter(function(id){ return gueltig[id]; });
  var fArt = selArr(s.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1; });
  var zonen = kkNorm(s.stZonen), ort = katOrt();
  var filterAn = !!(fGr.length || fArt.length || zonen.length);
  var woSort = s.libWoSort === "az" ? "az" : "dur";
  var hw = hinweise("katwo", ["katWoHint"]);

  var rows = [];
  LIB_WORKOUTS.forEach(function(lw){
    if(libIstWarmDehn(lw)) return;
    var exs = lw.exercises.map(findExercise).filter(Boolean);
    rows.push({ lw:lw, exs:exs, name:tplText(lw.name), dur:workoutDuration(libWorkoutRun(lw)), hidden:libHidden("wo:"+lw.id),
      ort:katWoOrt(exs), bereich:katWoBereich(lw, exs), mains:woMains(exs) });
  });
  var sichtbar = rows.filter(function(r){ return !r.hidden && r.ort === ort && katWoPasst(r.exs, fGr, fArt, zonen); });
  var versteckt = rows.filter(function(r){ return r.hidden; });
  libWoSort(sichtbar, woSort);
  var je = {};
  sichtbar.forEach(function(r){ (je[r.bereich] = je[r.bereich] || []).push(libWoCard(r.lw, r.exs, false, r.dur, r.mains)); });
  var liste = "";
  KAT_WO_BEREICHE.forEach(function(b){
    if(!je[b]) return;
    var name = b === "ganz" ? t("katGanz") : t(KAT_GRUPPEN.filter(function(g){ return g.id === b; })[0].key);
    liste += katZeileHTML("wo-"+b, b === "ganz" ? HOME_ICON.katalog : katIcon(b), name, je[b].length, '<div class="kat-inhalt">'+je[b].join("")+'</div>', katOffenStd("wo-"+b, false), "", ort === "studio");
  });
  if(!liste) liste = '<div class="empty" style="padding:34px 20px;">'+esc(t("katWoNone"))+'</div>';
  liste += '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("noResult"))+'</div>';
  var az = '<button type="button" class="af-az'+(woSort === "az" ? ' on' : '')+'" data-lfsort="'+(woSort === "az" ? "dur" : "az")+'" aria-pressed="'+(woSort === "az")+
    '" title="'+esc(t("afSortAz"))+'" aria-label="'+esc(t("afSortAz"))+'">A&ndash;Z</button>';

  app.innerHTML =
    katKopfHTML("workouts", hw.knopf + lupeHTML("l", libQuery)) +
    suchFeldHTML(libQuery, "l", t("searchWoPh")) +
    hw.z(0, "page-hint") +
    studioFilterHTML(gruppen, fGr, fArt, sichtbar.length, zonen, { art:"Wo", extra:az }) +
    liste +
    hiddenBlockHTML(versteckt.length, versteckt.map(function(r){ return libWoCard(r.lw, r.exs, true, r.dur, r.mains); }).join("")) +
    '<div style="height:60px"></div>';
  bindCommon();
  katKopfBinden();
  function neu(){ var y = window.scrollY; renderKatalog(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  studioFilterBinden(fGr, fArt, zonen, neu);
  on("[data-lfsort]", function(el){ s.libWoSort = el.getAttribute("data-lfsort"); save(); neu(); });
  katBinden(function(){ return libQuery; });
  var lq = app.querySelector("#l-q");
  if(lq){
    var suchen = function(){ applySearch(app, libQuery); katSuche(libQuery, false); };
    lq.addEventListener("input", function(){ libQuery = lq.value; suchen(); });
    if(libQuery) suchen();
  }
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  on("[data-cover]", function(el){ if(el.disabled) return; coverDraft = null; go("#cover/"+el.getAttribute("data-cover")); });
  on("[data-unhideone]", function(el){
    var k = el.getAttribute("data-unhideone");
    s.hiddenLib = (s.hiddenLib || []).filter(function(x){ return x !== k; });
    save(); neu();
  });
  on("[data-womore]", function(el){ var lw = findLibWorkout(el.getAttribute("data-womore")); if(lw) woMenue(lw, neu); });
  app.querySelectorAll(".lib-card [data-womore]").forEach(function(b){   // langes Drücken auf eine Karte = dasselbe Menü wie ⋯
    var lw = findLibWorkout(b.getAttribute("data-womore"));
    if(lw) langDruck(b.closest(".lib-card"), function(){ woMenue(lw, neu); });
  });
}
