"use strict";
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

