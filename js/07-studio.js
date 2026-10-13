"use strict";
/* ============ Studio ============
   Übungen an Geräten und mit freien Gewichten als Kacheln. Jede Übung hat „ihre Karte“ (#studio/<id>):
   Gewicht × Wiederholungen eintragen (vorausgefüllt), danach läuft die Pause, Verlauf, Notiz und
   Steigerung nach der doppelten Progression (Ziel zweimal hintereinander geschafft -> Gewicht hoch).
   Daten: settings.studio[id] = { kg, pause, notiz, zuletzt, log:[{ at, s:[[kg, wdh], …] }], ziel:{ saetze, wdh }, timer:{ reps, work, rest },
   modus:"timer" } - nur auf dem Gerät. kg, pause und ziel stellt man im Plan (Zeile je Übung) oder auf der Übungskarte ein, beides ist dasselbe. */
var studioQuery = "", studioPause = null;
function studioAlle(){ return state.db.settings.studio || (state.db.settings.studio = {}); }
function studioEintrag(id){ return (state.db.settings.studio || {})[id] || null; }
/* Ziel einer Übung: Sätze × Wiederholungen. Voreinstellung aus STUDIO_ZIEL, überschrieben von dem, was im Plan oder auf der Karte eingestellt wurde
   (settings.studio[id].ziel = { saetze, wdh }) - es gilt überall gleich: Plan, Übungskarte, Timer und die Steigerung nach der doppelten Progression. */
function studioZiel(id){
  var z = STUDIO_ZIEL[id] || [3, 12, 2.5], e = studioEintrag(id), g = e && e.ziel;
  // schritt: Gewichtsschritt der +/−-Knöpfe, je Übung einstellbar (Karte), sonst die Voreinstellung
  return { saetze:g && g.saetze > 0 ? g.saetze : z[0], wdh:g && g.wdh > 0 ? g.wdh : z[1], schritt:e && e.schritt > 0 ? e.schritt : z[2] };
}
/* Arbeitsgewicht: was zuletzt eingestellt oder benutzt wurde (sonst das Gewicht des ersten Satzes der letzten Einheit, sonst 0) */
function studioArbeitsKg(id){
  var e = studioEintrag(id) || {};
  if(e.kg != null) return e.kg;
  var l = e.log && e.log.length ? e.log[e.log.length-1] : null, a = l ? arbeitsSaetze(l) : [];
  return a.length ? a[0][0] : (l && l.s.length ? l.s[0][0] : 0);
}
/* Jüngste Einheit mit Sätzen; mitHeute = false überspringt heutige Sätze („Letztes Mal“ auf der Karte, wo „Heute“ schon dasteht) */
function studioLetzte(id, mitHeute){
  var e = studioEintrag(id), log = (e && e.log) || [], heute = studioTag(Date.now());
  for(var i = log.length-1; i >= 0; i--){
    if(log[i].s.length && (mitHeute || studioTag(log[i].at) !== heute)) return log[i];
  }
  return null;
}
function studioLetzteText(l){   // „40×12 · 40×11 · 38×10“
  return l.s.map(satzText).join(" · ");
}
function studioTagText(ts){
  return new Date(ts).toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" });
}
/* Fortschritt je Woche: aus [[Zeitpunkt, Wert], …] wird je Kalenderwoche (Montag) der beste Wert -
   beim Gewicht der höchste, bei Zeiten der niedrigste. Die Kurve zeigt echte Wochenabstände. */
function wochenWerte(liste, niedrigGut, summe){   // summe: je Woche zusammenzählen (Volumen) statt den besten Wert nehmen
  var je = {};
  liste.forEach(function(x){
    var d = new Date(x[0]); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    var w = Math.round(d.getTime() / 6048e5);
    if(summe) je[w] = (je[w] || 0) + x[1];
    else je[w] = w in je ? (niedrigGut ? Math.min(je[w], x[1]) : Math.max(je[w], x[1])) : x[1];
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
/* Wochenwerte je Sicht: "kg" bestes Gewicht, "rm" geschätztes 1RM, "vol" Volumen (Gewicht × Wiederholungen, alle Arbeitssätze der Woche) */
function studioWochen(id, sicht){
  var e = studioEintrag(id), log = (e && e.log || []).filter(function(l){ return arbeitsSaetze(l).length; });
  if(sicht === "vol") return wochenWerte(log.map(function(l){ return [l.at, studioVolumen(l)]; }), false, true).slice(-16);
  return wochenWerte(log.map(function(l){
    var a = arbeitsSaetze(l);
    return [l.at, Math.max.apply(null, a.map(function(x){ return sicht === "rm" ? satzSchaetzung1RM(x) : x[0]; }))];
  }), false).slice(-16);
}
/* Satztypen: ein Satz ist [kg, wdh] oder [kg, wdh, typ] mit typ "w" (Aufwärmen), "d" (Drop) oder "f" (bis Versagen). Aufwärmsätze zählen nicht
   in Bestgewicht, Volumen, geschätztes 1RM und die Steigerung. */
var SATZ_TYPEN = ["n", "w", "d", "f"];   // normal · Aufwärmen · Drop · bis Versagen
function satzTyp(x){ return x[2] === "w" || x[2] === "d" || x[2] === "f" ? x[2] : "n"; }
function arbeitsSaetze(l){ return (l.s || []).filter(function(x){ return satzTyp(x) !== "w"; }); }
function satzSchaetzung1RM(x){ return x[1] <= 1 ? x[0] : x[0]*(1 + x[1]/30); }   // Epley
function studioVolumen(l){ return arbeitsSaetze(l).reduce(function(a, x){ return a + x[0]*x[1]; }, 0); }
function satzText(x){   // „40×12“, bei besonderen Sätzen mit Kürzel davor („Aufw. 20×10“)
  var ty = satzTyp(x);
  return (ty === "n" ? "" : t("satzTyp_"+ty)+" ")+studioKg(x[0])+"×"+x[1];
}
/* Geschätztes 1RM und Bestgewicht über alle Einheiten (nur Arbeitssätze); davor = nur Einheiten vor dem Index i */
function studioBestwerte(log, bis){
  var kg = 0, rm = 0, vol = 0;
  log.forEach(function(l, i){
    if(bis != null && i >= bis) return;
    arbeitsSaetze(l).forEach(function(x){ kg = Math.max(kg, x[0]); rm = Math.max(rm, satzSchaetzung1RM(x)); });
    vol = Math.max(vol, studioVolumen(l));
  });
  return { kg:kg, rm:rm, vol:vol };
}
function studioTag(ts){ var d = new Date(ts); return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate(); }
function studioNurBlock(ex){
  return !!ex && !STUDIO_NUR[ex.id] && !ex.custom && ex.equip.every(function(q){ return ["db", "kb", "gym"].indexOf(q) < 0; });
}
function studioTimer(id){
  var e = studioEintrag(id) || {}, tm = e.timer || {}, ex = findExercise(id);
  if(studioNurBlock(ex))   // Vorgabe wie in Air
    return { reps:tm.reps || ex.setReps || ex.reps, work:tm.work || ex.workSec, rest:tm.rest != null ? tm.rest : ex.restSec };
  // Runden = die Sätze des Ziels (im Plan oder auf der Karte eingestellt); eine ältere Timer-Einstellung gilt, solange kein Ziel gesetzt ist
  return { reps:(e.ziel && e.ziel.saetze) || tm.reps || studioZiel(id).saetze, work:tm.work || 40, rest:tm.rest != null ? tm.rest : (e.pause || 90) };
}
function studioRun(ex){
  var tm = studioTimer(ex.id), b = exBlock(ex);
  b.id = "st-"+ex.id; b.reps = ex.perSide ? tm.reps*2 : tm.reps; b.workSec = tm.work; b.restSec = tm.rest;
  var r = libQuickWorkout([b], 0, tplText(ex.name), "studio-"+ex.id);
  r.mitGewicht = !studioNurBlock(ex);   // Übung mit Gewicht: nach jedem Satz Gewicht und Wiederholungen eintragen (auch Freiluft-Hanteln)
  return r;
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
/* Ausrüstung einer Übung - für die Chips im Filter. „Fitnessstudio“ fasst alles zusammen, was es dort gibt (Geräte, Kabel, Langhantel,
   Bank mit Kurzhanteln); die übrigen Arten sind das, was man auch zuhause oder draußen hat. */
function studioArt(id){
  var eq = (findExercise(id) || {}).equip || [];
  if(eq.indexOf("gym") > -1) return "geraet";
  if(eq.indexOf("band") > -1) return "band";
  if(eq.indexOf("bar") > -1 || eq.indexOf("dip") > -1) return "stange";
  return (eq.indexOf("db") > -1 || eq.indexOf("kb") > -1) ? "frei" : "koerper";
}
var STUDIO_ARTEN = ["geraet", "frei", "stange", "band", "koerper"];
/* Gewählte Ausrüstungs-Chips der Filterkarte. „Fitnessstudio“ (geraet) regelt der Ort-Schalter und ist kein Chip mehr (sonst stünde es doppelt);
   im Fitnessstudio gibt es keine Ausrüstungswahl (alles dort ist Gerät), die Chips gelten also nur bei Freiluft. */
function studioArtenWahl(){
  if(katOrt() === "studio") return [];
  return selArr(state.db.settings.stArten).filter(function(a){ return STUDIO_ARTEN.indexOf(a) > -1 && a !== "geraet"; });
}
var STUDIO_ART_ICON = { geraet:CAT_ICON.weight, frei:EQUIP_ICON.kb, stange:EQUIP_ICON.bar, band:EQUIP_ICON.band, koerper:EQUIP_ICON.none };
/* Frühere Gruppen-Chips, die jetzt zur Ausrüstung gehören (Langhantel, Kurzhantel & Kettlebell, Stange & Barren, Körpergewicht), in die Ausrüstung umziehen;
   die früheren Chips „Kabel“ und „Langhantel“ stehen jetzt unter „Fitnessstudio“ */
function studioFilterAlt(){
  var s = state.db.settings, umzug = { lh:"geraet", frei:"frei", stange:"stange", air:"koerper" }, gr = selArr(s.stGruppen), neu = [], arten = selArr(s.stArten), geaendert = false;
  gr.forEach(function(id){ if(umzug[id]){ if(arten.indexOf(umzug[id]) < 0) arten.push(umzug[id]); geaendert = true; } else neu.push(id); });
  var arten2 = [];
  arten.forEach(function(a){ var n = (a === "kabel" || a === "lh") ? "geraet" : a; if(n !== a) geaendert = true; if(arten2.indexOf(n) < 0) arten2.push(n); });
  if(geaendert){ s.stGruppen = neu; s.stArten = arten2; save(); }
}
var STUDIO_GRUPPEN_ICON = { beine:CAT_ICON.legs, brust:'<path d="M4 8c2.5-2 5.5-2 8 0 2.5-2 5.5-2 8 0v5c-2 3-5.5 4-8 1.5C9.5 17 6 16 4 13z"/>',
  ruecken:CAT_ICON.back, schulter:'<circle cx="12" cy="6" r="2.5"/><path d="M4 18c0-5 3.5-8.5 8-8.5s8 3.5 8 8.5"/>', arme:CAT_ICON.arms,
  bauch:CAT_ICON.core, lh:CAT_ICON.weight, frei:EQUIP_ICON.kb, stange:EQUIP_ICON.bar, band:EQUIP_ICON.band, air:HOME_ICON.lib, eigene:'<path d="M12 5v14M5 12h14"/>' };
function studioKachel(id){
  var ex = findExercise(id);
  if(!ex) return "";
  var e = studioEintrag(id), last = e && e.log && e.log.length ? e.log[e.log.length-1] : null;
  var la = last ? arbeitsSaetze(last) : [], sub = la.length ? studioKg(la[0][0])+" kg · "+la.length+" × "+la[0][1] : t("stNoData");
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
function studioFilterHTML(gruppen, fGr, fArt, anzahl, zonen, opt){
  var s = state.db.settings;
  opt = opt || {};   // opt.art: "Wo" für die fertigen Workouts (Katalog), opt.extra: Schalter neben der Kopfzeile (A–Z)
  var namen = fGr.map(function(id){ var g = gruppen.filter(function(x){ return x.id === id; })[0]; return g ? g.name : id; })
    .concat(fArt.map(function(a){ return t("stArt_"+a); }), zonen.map(kkName));
  return filterKarteHTML({ offen:!!s.stFilterOpen, toggle:"data-sttoggle", reset:"data-streset", n:namen.length,
    summe:namen.length ? namen.join(", ") : t(opt.art === "Wo" ? "afAlleWo" : "afAlleEx"),
    zeigen:filterZeigenText(anzahl, opt.art || "Ex"), extra:opt.extra,
    inhalt:filterChipsHTML(t("afGruppe"), "", gruppen.filter(function(g){ return g.ids.length && !g.air; }).map(function(g){
        return filterChip("data-stgr", g.id, fGr.indexOf(g.id) > -1, svgIcon(STUDIO_GRUPPEN_ICON[g.id] || CAT_ICON.weight), g.name); }).join(""))+
      (katOrt() === "studio" ? "" : filterChipsHTML(t("equipHave"), "", STUDIO_ARTEN.filter(function(a){ return a !== "geraet"; }).map(function(a){
        return filterChip("data-start", a, fArt.indexOf(a) > -1, STUDIO_ART_ICON[a] ? svgIcon(STUDIO_ART_ICON[a]) : "", t("stArt_"+a)); }).join("")))+
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
/* Studio und Air sind der Katalog (js/11b-katalog.js): renderStudio zeigt den Reiter bzw. die Plan-Seite, die gerade dran ist */
function renderStudio(){ return renderKatalog(); }

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
/* Timer: eigene Seite (früher je ein Reiter in Air und Studio, mit derselben Liste). Erreichbar über die Schnellwahl auf der Startseite.
   Blöcke (eine Übung mit Runden, Arbeit, Pause) und Timer-Workouts (mehrere Blöcke hintereinander) in der Timer-Farbe (--ti-color);
   angelegt werden sie über das Plus. */
function renderIntervall(){
  var hw = hinweise("timer", ["timerHint"]);
  app.innerHTML = topbar(t("tabTimer"), { back:"#home", right:hw.knopf }) + bereichBildHTML("intervall") + timerPanelHTML(hw) + '<div style="height:90px"></div>' + timerFabHTML();
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
var stPlanOrtFuer = null;   // der Plan, dessen Ort schon aus den Übungen übernommen wurde
var stPlanAktiv = null, stPlanBauen = false, stPlanQuery = "", stPlanSel = -1;   // stPlanSel: im Plan-Bau ausgewählte Übung des Plans (zum Verschieben)
function stPlaene(){ var s = state.db.settings; if(!Array.isArray(s.stPlaene)) s.stPlaene = []; return s.stPlaene; }
function stPlanFind(id){ var l = stPlaene(); for(var i=0;i<l.length;i++) if(l[i].id === id) return l[i]; return null; }
function stPlanIds(p){   // nur Übungen, die es noch gibt, jede nur einmal
  var da = {};
  return (Array.isArray(p.ids) ? p.ids : []).filter(function(id){ if(da[id] || !findExercise(id)) return false; da[id] = true; return true; });
}
/* So heißen Sätze überall: „3 Sätze × 12“ (mit Gewicht) bzw. „3 Sätze × 40 s“ (ohne Gewicht, Block); nach einem Eintrag „40 kg · 3 Sätze × 12“ */
function satzName(n){ return n === 1 ? t("satzEins") : t("satzMehr", { n:n }); }
function satzZiel(id){
  var ex = findExercise(id);
  if(studioNurBlock(ex)){ var tb = studioTimer(id); return satzName(tb.reps)+" × "+tb.work+" s"; }
  var z = studioZiel(id);
  return satzName(z.saetze)+" × "+z.wdh;
}
function satzKurz(id){   // „3×12“ bzw. „3×40 s“ für die kleinen Plan-Kacheln
  var ex = findExercise(id);
  if(studioNurBlock(ex)){ var tb = studioTimer(id); return tb.reps+"×"+tb.work+" s"; }
  var z = studioZiel(id);
  return z.saetze+"×"+z.wdh;
}
function satzLetzter(id){
  var e = studioEintrag(id), last = e && e.log && e.log.length ? e.log[e.log.length-1] : null;
  var la = last ? arbeitsSaetze(last) : [];
  return la.length ? studioKg(la[0][0])+" kg · "+satzName(la.length)+" × "+la[0][1] : "";
}
function studioSub(id){
  var ex = findExercise(id);
  if(studioNurBlock(ex)) return satzZiel(id);
  return satzLetzter(id) || t("stNoData");
}
/* Fitnessstudio-Übung in einem Workout mit Timer: vorn steht Gewicht × Wiederholungen („40 kg · 3 × 12“, ohne Eintrag das Ziel „3 × 12“);
   leer bei allen anderen Übungen */
function gymSatzText(id, auchFrei){   // auchFrei: im Plan-Workout zählen auch Freiluft-Übungen mit Gewicht (Kurzhantel, Kettlebell)
  var ex = findExercise(id);
  if(!exIstStudio(ex) && !(auchFrei && ex && !studioNurBlock(ex) && ex.main !== "stretch")) return "";
  return satzLetzter(id) || satzZiel(id);
}
/* Unter dem Namen einer Kachel: wofür die Übung da ist - die ersten zwei Hauptmuskeln in Kurzform, klein. Ohne Muskeldaten (eigene Übungen) entfällt die Zeile. */
function kachelMuskel(ex){ var m = ex && musclesMain(ex); return m ? '<span class="st-mus">'+esc(m.split(", ").slice(0, 2).join(", "))+'</span>' : ''; }
/* Studio-Kacheln im Plan: Muskeln und - falls schon eingetragen - der letzte Satz bzw. die Zeit (kein „–“ mehr ohne Daten) */
function studioUnter(id){
  var sub = studioSub(id);
  if(sub === t("stNoData")) sub = satzZiel(id);   // ohne Eintrag: das Ziel („3 Sätze × 12“) statt nichts
  return kachelMuskel(findExercise(id))+(sub === t("stNoData") ? '' : '<span class="st-sub">'+esc(sub)+'</span>');
}
function planAnzahl(n){ return n === 1 ? t("planOne") : t("planN", { n:n }); }
/* Der Plan als Programm (wie in Heavy): je Übung eine Zeile mit Sätzen, Wiederholungen, Gewicht und Pause zum schnellen Einstellen, darunter das letzte Mal.
   Die Werte stehen je Übung (studioZiel, Arbeitsgewicht, Pause) und gelten damit auch auf der Übungskarte und im Timer. Übungen ohne Gewicht (nur Block)
   haben Sätze, Arbeitszeit und Pause. */
function planFeldHTML(feld, label, wert, min, max, schritt){
  return '<div class="st-feld"><label>'+esc(label)+'</label><div class="stepper st-step pz-step" data-feld="'+feld+'" data-min="'+min+'" data-max="'+max+'" data-schritt="'+schritt+'">'+
    '<button type="button" data-dec aria-label="&minus;">&minus;</button>'+
    '<input type="text" inputmode="decimal" value="'+esc(studioKg(wert))+'" aria-label="'+esc(label)+'">'+
    '<button type="button" data-inc aria-label="&plus;">&plus;</button></div></div>';
}
function planZeileHTML(id, nr){
  var ex = findExercise(id);
  if(!ex) return "";
  var block = studioNurBlock(ex), z = studioZiel(id), tm = studioTimer(id), e = studioEintrag(id) || {}, l = studioLetzte(id, true);
  var timerModus = !block && e.modus === "timer";   // je Übung: Satz für Satz eintragen oder diese Übung mit dem Timer laufen lassen
  var felder = block
    ? planFeldHTML("reps", t("planSaetze"), tm.reps, 1, 20, 1)+planFeldHTML("work", t("planArbeit"), tm.work, 5, 600, 5)+
      planFeldHTML("rest", t("planPause"), tm.rest, 0, 600, 5)
    : planFeldHTML("saetze", t("planSaetze"), z.saetze, 1, 20, 1)+
      (timerModus ? planFeldHTML("work", t("planArbeit"), tm.work, 5, 600, 5) : planFeldHTML("wdh", t("stReps"), z.wdh, 1, 100, 1))+
      planFeldHTML("kg", t("planKg"), studioArbeitsKg(id), 0, 500, z.schritt)+planFeldHTML("pause", t("planPause"), e.pause || 90, 0, 600, 15);
  return '<div class="pz-zeile" data-pz="'+id+'" style="--cat:'+studioFarbe(ex)+'">'+
    '<div class="pz-kopf" role="button" tabindex="0" data-studio="'+id+'" aria-label="'+esc(tplText(ex.name))+'">'+
      '<span class="pz-bild">'+(ILLU[id] ? illuStillHTML(id, "pz-illu") : '<span class="st-ohne">'+svgIcon(EQUIP_ICON.gym || EQUIP_ICON.db)+'</span>')+'</span>'+
      '<span class="pz-text"><span class="pz-name"><i>'+nr+'</i> '+esc(tplText(ex.name))+'</span>'+kachelMuskel(ex)+
        '<span class="pz-letzte'+(l ? ' an' : '')+'">'+(l ? esc(t("planZuletzt", { d:studioTagText(l.at), s:studioLetzteText(l) })) : esc(t("planNochNie")))+'</span>'+
        (e.notiz && e.notiz.trim() ? '<span class="pz-notiz">'+esc(e.notiz.trim())+'</span>' : '')+'</span>'+   // die Notiz der Übung erscheint beim nächsten Mal wieder
      '<span class="pz-pfeil" aria-hidden="true">'+ICON_CHEV+'</span></div>'+
    (block ? '' : '<div class="seg-row pz-modus" role="group" aria-label="'+esc(t("stModusTitel"))+'">'+
      '<button type="button" data-pzmodus="saetze" class="'+(timerModus ? '' : 'active')+'" aria-pressed="'+!timerModus+'">'+esc(t("stModusSaetze"))+'</button>'+
      '<button type="button" data-pzmodus="timer" class="'+(timerModus ? 'active' : '')+'" aria-pressed="'+timerModus+'">'+ICON_PLAY+' '+esc(t("stModusTimer"))+'</button></div>')+
    '<div class="st-eingabe pz-felder'+(block ? ' drei' : '')+'">'+felder+'</div>'+
    (timerModus || block ? '<button type="button" class="btn btn-secondary pz-start" data-pzstart="'+id+'">'+ICON_PLAY+' '+esc(t("planTimerStart"))+'</button>' : '')+'</div>';
}
function planSaetzeSumme(ids){
  return ids.reduce(function(a, id){
    var ex = findExercise(id);
    return a + (ex && studioNurBlock(ex) ? studioTimer(id).reps : studioZiel(id).saetze);
  }, 0);
}
function planSummeText(ids){
  return planAnzahl(ids.length)+(ids.length ? " · "+t("planSaetzeGesamt", { n:planSaetzeSumme(ids) }) : "");
}
/* fn() läuft nach jeder Änderung (Summe oben nachführen); gespeichert wird sofort. neuZeichnen: Seite neu aufbauen (nach dem Umschalten Satz ↔ Timer) */
function planZeilenBinden(root, fn, neuZeichnen){
  root.querySelectorAll(".pz-zeile").forEach(function(zeile){
    var id = zeile.getAttribute("data-pz");
    function eintrag(){ var a = studioAlle(); return a[id] || (a[id] = { log:[] }); }
    function setzen(feld, v){
      var en = eintrag();
      if(feld === "saetze" || feld === "wdh"){ en.ziel = en.ziel || {}; en.ziel[feld] = v; }
      else if(feld === "kg") en.kg = v;
      else if(feld === "pause"){ en.pause = v; if(en.timer) delete en.timer.rest; }   // die Pause des Timers folgt der Pause der Übung
      else {   // Runden, Arbeit, Pause des Timers: nur was gesetzt wurde, der Rest folgt weiter den Voreinstellungen
        var alt = en.timer || {};
        en.timer = {};
        ["reps", "work", "rest"].forEach(function(k){ if(alt[k] != null) en.timer[k] = alt[k]; });
        en.timer[feld] = v;
      }
      save();
      fn();
    }
    zeile.querySelectorAll("[data-pzmodus]").forEach(function(b){   // je Übung: Satz für Satz oder mit Timer
      b.addEventListener("click", function(){
        var m = b.getAttribute("data-pzmodus") === "timer" ? "timer" : "saetze";
        if((eintrag().modus || "saetze") === m) return;
        eintrag().modus = m; save();
        if(neuZeichnen) neuZeichnen();
      });
    });
    var start = zeile.querySelector("[data-pzstart]");   // nur diese Übung mit dem Timer starten
    if(start) start.addEventListener("click", function(){ go("#playst/"+id); });
    zeile.querySelectorAll(".pz-step").forEach(function(st){
      var feld = st.getAttribute("data-feld"), input = st.querySelector("input");
      var min = parseFloat(st.getAttribute("data-min")), max = parseFloat(st.getAttribute("data-max")), sch = parseFloat(st.getAttribute("data-schritt"));
      function wert(){ var x = parseFloat(String(input.value).replace(",", ".")); return isFinite(x) ? x : min; }
      function los(v){
        v = Math.round(Math.min(max, Math.max(min, v))*100)/100;
        input.value = studioKg(v);
        setzen(feld, v);
      }
      st.querySelector("[data-dec]").addEventListener("click", function(){ los(wert() - sch); });
      st.querySelector("[data-inc]").addEventListener("click", function(){ los(wert() + sch); });
      input.addEventListener("change", function(){ los(wert()); });
      input.addEventListener("focus", function(){ input.select(); });
    });
  });
}
function renderStudioPlan(){
  var p = stPlanAktiv && stPlanFind(stPlanAktiv);
  if(!p){ stPlanAktiv = null; stPlanBauen = false; return renderKatalog(); }
  var ids = stPlanIds(p), pos = {}, html;
  ids.forEach(function(id, i){ pos[id] = [i+1]; });
  var hw = stPlanBauen ? hinweise("planbau", ["planTippen"]) : hinweise("planzeilen", ["planZeilenHint"]);
  html = topbar(p.name, { back:"#katalog", right:hw.knopf+(stPlanBauen ? lupeHTML("pl", stPlanQuery) : "") });
  if(stPlanBauen){
    /* Plan-Bau auf dem Katalog: dieselben Bereiche und Filter wie unter Übungen (Air und Studio gemeinsam), zugeklappt mit „n gewählt“;
       oben die Körperkarte des Plans (viel, am Rande, Lücken), damit man beim Antippen sieht, was noch fehlt */
    var gruppen = katalogGruppen(), da = katGruppeIds(gruppen), gueltig = {};
    gruppen.forEach(function(g){ gueltig[g.id] = true; });
    var s = state.db.settings; studioFilterAlt();
    if(stPlanOrtFuer !== p.id){
      stPlanOrtFuer = p.id;
      var oEx = ids.map(findExercise).filter(Boolean);
      if(oEx.length){ var oNeu = oEx.filter(exIstStudio).length*2 > oEx.length ? "studio" : "frei"; if(!katOrtPasst(oNeu)){ s.katOrt = oNeu; save(); } }
    }
    var fGr = selArr(s.stGruppen).filter(function(id){ return gueltig[id]; });
    var fArt = studioArtenWahl();
    var zonen = kkNorm(s.stZonen), filterAn = !!(fGr.length || fArt.length || zonen.length);
    // beim Bauen immer nach Ort getrennt (Fitnessstudio oder Freiluft, derselbe Schalter wie im Baukasten)
    function artOk(id){ var ex = findExercise(id); return !!ex && katOrtPasst(exOrt(ex)) && (!fArt.length || fArt.indexOf(studioArt(id)) > -1) && (!zonen.length || zonePasst(ex, zonen)); }
    var rest = ids.filter(function(id){ return !da[id]; });   // Übungen im Plan, die in keinem Bereich stehen (z. B. ausgeblendete)
    html += '<div class="card"><label for="plan-name">'+t("name")+'</label><input type="text" id="plan-name" value="'+esc(p.name)+'" maxlength="60"></div>'+
      (ids.length ? kkKopfHTML(ids) : '')+
      // Der Plan selbst: die gewählten Übungen in ihrer Reihenfolge. Bleibt beim Scrollen oben stehen; antippen wählt eine Übung aus,
      // dann verschieben ◀ ▶ sie und ✕ nimmt sie heraus.
      '<div class="plan-sticky" id="plan-sticky"><div class="plan-sticky-kopf"><b>'+esc(t("planKopf"))+'</b><span>'+esc(ids.length ? planAnzahl(ids.length) : t("planNochLeer"))+'</span></div>'+
        (ids.length ? '<div class="wb-streifen">'+ids.map(function(id, i){
          var ex = findExercise(id);
          return ex ? '<button type="button" class="wb-mini'+(stPlanSel === i ? ' sel' : '')+'" data-plansel="'+i+'" style="--cat:'+studioFarbe(ex)+'" aria-pressed="'+(stPlanSel === i)+'" aria-label="'+esc((i+1)+". "+tplText(ex.name)+", "+satzZiel(id))+'">'+
            (ILLU[id] ? illuStillHTML(id, "wb-mini-illu") : '')+'<span class="wb-mini-nr">'+(i+1)+'</span><span class="wb-mini-name">'+esc(tplText(ex.name))+'</span><span class="wb-mini-sub">'+esc(satzKurz(id))+'</span></button>' : "";
        }).join("")+'</div>'+
          (stPlanSel > -1 && stPlanSel < ids.length ? '<div class="plan-ctrl"><button type="button" data-planmv="-1" aria-label="'+esc(t("moveLeft"))+'"'+(stPlanSel === 0 ? ' disabled' : '')+'>&#9664;</button>'+
            '<button type="button" class="del" data-plandelsel>'+ICON_TRASH+' '+esc(t("planRaus"))+'</button>'+
            '<button type="button" data-planmv="1" aria-label="'+esc(t("moveRight"))+'"'+(stPlanSel === ids.length-1 ? ' disabled' : '')+'>&#9654;</button></div>' : '') : '')+'</div>'+
      bauOrtHTML()+bauArtHTML("gewicht", false)+hw.z(0, "page-hint")+suchFeldHTML(stPlanQuery, "pl", t("stSearch"))+
      studioFilterHTML(gruppen, fGr, fArt, studioAnzahl(gruppen, fGr, artOk), zonen);
    if(rest.length) gruppen = gruppen.concat([{ id:"rest", name:t("planSonst"), ids:rest, immer:true }]);
    function planKachel(id){
      var ex = findExercise(id);
      // Angaben wie bei Übungen: letzter Satz bzw. Zeit unter dem Namen
      return ex ? uebKachel({ bild:id, name:tplText(ex.name), attr:'data-planex="'+id+'"', q:exSearchText(ex), cat:studioFarbe(ex), nr:pos[id] || [],
        unter:studioUnter(id) }) : "";
    }
    gruppen.forEach(function(g){
      if(!g.immer && fGr.length && fGr.indexOf(g.id) < 0) return;
      var gids = g.immer ? g.ids : g.ids.filter(artOk);
      if(!gids.length) return;
      var gewaehlt = gids.filter(function(id){ return pos[id]; }).length;
      html += katZeileHTML("pl-"+g.id, katIcon(g.id), g.name, gids.length,
        '<div class="fig-grid">'+gids.map(planKachel).join("")+'</div>', katOffenStd("pl-"+g.id, !!g.immer),
        gewaehlt ? '<span class="kat-n">'+esc(t("katGewaehlt", { n:gewaehlt }))+'</span>' : '',
        gids.every(function(id){ return exIstStudio(findExercise(id)); }));
    });
    html += '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("stNone"))+'</div>'+
      (p.entwurf ? '' : '<button type="button" class="btn btn-danger" data-plandel style="margin-top:18px;">'+ICON_TRASH+' '+t("planDel")+'</button>')+
      '<div style="height:96px"></div>'+
      '<div class="wb-leiste"><div class="wb-leiste-in"><span><b>'+esc(planAnzahl(ids.length))+'</b></span>'+
      '<span class="wb-knoepfe"><button type="button" class="btn btn-primary" data-plandone'+(p.entwurf && !ids.length ? ' disabled' : '')+'>'+ICON_SAVE+' '+t(p.entwurf ? "save" : "planDone")+'</button></span></div></div>';
  } else {
    // Plan = Programm: je Übung Sätze, Wiederholungen, Gewicht und Pause gleich hier einstellen; das letzte Mal steht darunter
    html += '<div class="plan-kopf"><b id="plan-summe">'+esc(planSummeText(ids))+'</b><button type="button" class="ghost plan-edit" data-planedit>'+svgIcon(ICON_EDIT)+' '+t("planEdit")+'</button></div>'+
      (ids.length ? hw.z(0, "page-hint") : '')+
      (ids.length ? '<button type="button" class="btn btn-primary plan-start" data-planwo>'+ICON_PLAY+' '+esc(t("planAlleTimer"))+'</button>' : '')+
      (ids.length ? '<div class="pz-liste">'+ids.map(function(id, i){ return planZeileHTML(id, i+1); }).join("")+'</div>' : '<div class="fav-empty">'+esc(t("planEmpty"))+'</div>')+
      (ids.length ? auswertungHTML(ids) : '')+
      (ids.length ? trainingLeisteHTML({ plan:p, ids:ids }) : '')+
      '<div style="height:'+(ids.length ? 96 : 40)+'px"></div>';
  }
  app.innerHTML = html;
  // Zurück führt zur Liste unter „Meine“, nicht aus dem Katalog heraus
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){
    planVerlassen(p, function(){ stPlanAktiv = null; stPlanBauen = false; stPlanQuery = ""; renderKatalog(); window.scrollTo(0, 0); });   // ein neuer, nicht gespeicherter Plan fragt nach
  }); }
  bindCommon();
  function neu(){ var y = window.scrollY; renderKatalog(); window.scrollTo(0, y); }
  function an(sel, fn){ var el = app.querySelector(sel); if(el) el.addEventListener("click", fn); }
  an("[data-planedit]", function(){ stPlanBauen = true; stPlanSel = -1; stPlanQuery = ""; renderKatalog(); window.scrollTo(0, 0); });
  if(!stPlanBauen && ids.length) trainingLeisteBinden({ plan:p, ids:ids }, neu);
  if(!stPlanBauen) planZeilenBinden(app, function(){   // Summe der Sätze oben nachführen
    var su = app.querySelector("#plan-summe");
    if(su) su.textContent = planSummeText(stPlanIds(p));
  }, neu);
  an("[data-plandone]", function(){
    if(p.entwurf){ delete p.entwurf; p.updatedAt = Date.now(); save(); showToast(t("planGespeichert")); }   // erst jetzt steht der neue Plan unter Meine
    stPlanBauen = false; stPlanSel = -1; stPlanQuery = ""; renderKatalog(); window.scrollTo(0, 0);
  });
  /* Plan als Workout mit Timer: Air- und Studio-Übungen laufen hintereinander (Studio-Übungen mit ihren Satz- und Pausenwerten);
     eine Kopie unter Meine, die beim erneuten Starten aktualisiert wird */
  an("[data-planwo]", function(){
    var items = ids.map(function(id){
      var ex = findExercise(id), tm = studioTimer(id);
      return { ex:id, reps:ex.perSide ? tm.reps*2 : tm.reps, work:tm.work, rest:tm.rest };
    });
    var mw = (state.db.myWorkouts || []).filter(function(x){ return x.fromPlan === p.id; })[0];
    if(mw){ mw.name = p.name; mw.items = items; mw.updatedAt = Date.now(); save(); }
    else { mw = createMyFromDraft({ name:p.name, mode:"individual", reps:6, work:30, rest:10, blockRest:45, items:items }); mw.fromPlan = p.id; save(); }
    go("#cover/my/"+mw.id);
  });
  an("[data-plandel]", function(){
    confirmSheet(t("planDelQ"), "„"+p.name+"“ – "+t("cantUndo"), t("del"), function(){
      state.db.settings.stPlaene = stPlaene().filter(function(x){ return x.id !== p.id; });
      stPlanAktiv = null; stPlanBauen = false; save(); renderKatalog(); window.scrollTo(0, 0);
      showToast(t("deletedToast", { n:p.name }));
    });
  });
  var nm = app.querySelector("#plan-name");
  if(nm) nm.addEventListener("input", function(){ p.name = nm.value.trim() || t("planDefault", { n:stPlaene().indexOf(p)+1 }); p.updatedAt = Date.now(); save(); });
  kachelKlick(app, "[data-planex]", function(el){
    var id = el.getAttribute("data-planex"), l = stPlanIds(p), i = l.indexOf(id);
    if(i > -1) l.splice(i, 1); else l.push(id);
    stPlanSel = -1;
    p.ids = l; p.updatedAt = Date.now(); save(); neu();
  });
  // Plan oben: Übung antippen = auswählen, ◀ ▶ verschieben, Papierkorb nimmt sie heraus
  bauOrtBinden(neu);
  if(stPlanBauen) bauArtBinden("gewicht", function(){ planNachZeit(p); });   // nach Zeit: dieselben Übungen als Workout mit Timer
  app.querySelectorAll("[data-plansel]").forEach(function(b){
    b.addEventListener("click", function(){ var i = +b.getAttribute("data-plansel"); stPlanSel = stPlanSel === i ? -1 : i; neu(); });
  });
  app.querySelectorAll("[data-planmv]").forEach(function(b){
    b.addEventListener("click", function(){
      var l = stPlanIds(p), j = stPlanSel + (+b.getAttribute("data-planmv"));
      if(stPlanSel < 0 || j < 0 || j >= l.length) return;
      var x = l.splice(stPlanSel, 1)[0]; l.splice(j, 0, x);
      p.ids = l; p.updatedAt = Date.now(); stPlanSel = j; save(); neu();
    });
  });
  an("[data-plandelsel]", function(){
    var l = stPlanIds(p);
    if(stPlanSel > -1 && stPlanSel < l.length){ l.splice(stPlanSel, 1); p.ids = l; p.updatedAt = Date.now(); save(); }
    stPlanSel = -1; neu();
  });
  kachelKlick(app, "[data-studio]", function(el){ go("#studio/"+el.getAttribute("data-studio")); });
  app.querySelectorAll("[data-planex]").forEach(function(el){ var id = el.getAttribute("data-planex"); langDruck(el, function(){ openExInfo(id, false); }); });   // Info nur per Langdruck
  if(stPlanBauen){
    var stPl = app.querySelector("#plan-sticky"), tbPl = app.querySelector(".topbar");   // der Plan klebt direkt unter der Kopfzeile
    if(stPl && tbPl) stPl.style.top = Math.max(0, Math.round(tbPl.getBoundingClientRect().height) - 2)+"px";
    var sb = state.db.settings, gb = katalogGruppen(), gv = {}, filterB;
    gb.forEach(function(g){ gv[g.id] = true; });
    var fgB = selArr(sb.stGruppen).filter(function(id){ return gv[id]; }), faB = studioArtenWahl();
    filterB = !!(fgB.length || faB.length || kkNorm(sb.stZonen).length);
    studioFilterBinden(fgB, faB, kkNorm(sb.stZonen), neu);
    katBinden(function(){ return stPlanQuery; });
    var q = app.querySelector("#pl-q");
    if(q){
      var suchen = function(){
        applySearch(app, stPlanQuery);
        katSuche(stPlanQuery, false);
      };
      q.addEventListener("input", function(){ stPlanQuery = q.value; suchen(); });
      if(stPlanQuery) suchen();
    }
  }
}

