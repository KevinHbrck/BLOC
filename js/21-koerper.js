"use strict";
/* ============ Plan-Bausteine ============
   Gemeinsame Hilfen für den PLAN-Builder im Baukasten (js/23-baukasten.js): ein PLAN besteht aus Wochen, Trainingstagen und je Tag einer Liste von Einträgen.
   Eintrag: "wk:<id>" (Workout aus dem Baukasten), "plan:<id>" bzw. "my:<id>" (BLOC), "lib:<id>" (Katalog), "run", "zufall".
   „Start“ legt daraus normale Kalender-Einträge an (settings.kalender). */
var KP_WOCHEN = [4, 6, 8, 12];
/* Je Trainingstag eine Liste von Einträgen (früher genau einer als Text): beides wird gelesen */
function planWahlListe(v){ return Array.isArray(v) ? v.filter(Boolean) : (v ? [v] : []); }
function planWahlName(v){
  if(v === "run") return t("planOptRun");
  if(v === "zufall") return t("planOptZufall");
  if(v.indexOf("wk:") === 0){ var wk = bkWkFind(v.slice(3)); return wk ? wk.name : t("bkFehlt"); }
  if(v.indexOf("plan:") === 0){ var sp = stPlanFind(v.slice(5)); return sp ? sp.name : t("bkFehlt"); }
  if(v.indexOf("my:") === 0){ var m = (state.db.myWorkouts || []).filter(function(x){ return x && x.id === v.slice(3); })[0]; return m ? m.name : t("untitled"); }
  if(v.indexOf("lib:") === 0){ var lw = findLibWorkout(v.slice(4)); return lw ? tplText(lw.name) : t("untitled"); }
  return v;
}
function planWahlArt(v){ return v === "run" ? "run" : v === "zufall" ? "zufall" : "kraft"; }
/* Auswahl je Trainingstag: Meine Workouts und BLOCs, Workoutkatalog, Mobility & Stretch, Run, Zufallstraining */
function planOptionenHTML(wert, leer){
  function opt(v, label){ return '<option value="'+esc(v)+'"'+(v === wert ? ' selected' : '')+'>'+esc(label)+'</option>'; }
  var wks = state.db.bkWorkouts.filter(function(w){ return !w.entwurf; }).sort(bkNeuerst).map(function(w){ return opt("wk:"+w.id, w.name); }).join("");
  var blocs = bkBloecke().map(function(b){ return opt(b.typ+":"+b.id, b.name); }).join("");
  var kat = LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).map(function(lw){ return opt("lib:"+lw.id, tplText(lw.name)); }).join("");
  var mob = LIB_WORKOUTS.filter(function(lw){ return libIstWarmDehn(lw); }).map(function(lw){ return opt("lib:"+lw.id, tplText(lw.name)); }).join("");
  return '<option value="">+ '+esc(leer || t("planWahlLeer"))+'</option>'+
    (wks ? '<optgroup label="'+esc(t("bkOptWk"))+'">'+wks+'</optgroup>' : '')+
    (blocs ? '<optgroup label="'+esc(t("bkOptBloc"))+'">'+blocs+'</optgroup>' : '')+
    '<optgroup label="'+esc(t("planOptKatalog"))+'">'+kat+'</optgroup>'+
    '<optgroup label="'+esc(t("kalMob"))+'">'+mob+'</optgroup>'+
    '<optgroup label="'+esc(t("planOptAndere"))+'">'+opt("run", t("planOptRun"))+opt("zufall", t("planOptZufall"))+'</optgroup>';
}
/* Erster Tag des Plans: der heutige Montag, sonst der nächste */
function planStart(){
  var mo = kalMontag(Date.now());
  return kalTagKey(mo) < kalTagKey(Date.now()) ? kalPlus(mo, 7) : mo;
}
/* Einträge, die der Plan anlegen würde: [{ tag, art, ref }] */
function planEintraege(p){
  var out = [], start = planStart();
  for(var w = 0; w < p.wochen; w++){
    p.tage.slice().sort(function(a, b){ return a - b; }).forEach(function(d){
      planWahlListe(p.wahl[d]).forEach(function(v){
        var tag = kalTagKey(kalPlus(start, w*7 + d)), e = null;
        if(v.indexOf("wk:") === 0) e = { art:"wk", ref:v.slice(3) };
        else if(v.indexOf("plan:") === 0) e = { art:"plan", ref:v.slice(5) };
        else if(v.indexOf("my:") === 0) e = { art:"workout", ref:v.slice(3) };
        else if(v.indexOf("lib:") === 0) e = { art:"lib", ref:v.slice(4) };
        else if(v === "run") e = { art:"run" };
        else if(v === "zufall") e = { art:"zufall" };
        if(e){ e.tag = tag; out.push(e); }
      });
    });
  }
  return out;
}
/* Plan sichtbar machen: je Woche eine Zeile, je Tag ein Feld (Fläche = Einheiten an dem Tag, Punkte = Art: Kraft, Run, Zufall) */
function planVisHTML(p, namen){
  var tage = p.tage.slice().sort(function(a, b){ return a - b; });
  function zelle(d){
    var l = planWahlListe(p.wahl[d]);
    if(tage.indexOf(d) < 0) return '<span class="kv-z aus" aria-hidden="true"></span>';
    return '<span class="kv-z'+(l.length ? ' an' : ' leer')+'" title="'+esc(l.map(planWahlName).join(", "))+'">'+
      (l.length ? l.map(function(v){ return '<i class="kv-p '+planWahlArt(v)+'"></i>'; }).join("") : '')+'</span>';
  }
  var kopf = '<div class="kv-reihe kv-kopf"><span></span>'+[0, 1, 2, 3, 4, 5, 6].map(function(d){ return '<span class="'+(tage.indexOf(d) > -1 ? 'an' : '')+'">'+esc(namen(d).slice(0, 2))+'</span>'; }).join("")+'</div>';
  var zeilen = "";
  for(var w = 0; w < p.wochen; w++){
    zeilen += '<div class="kv-reihe"><span class="kv-w">'+(w + 1)+'</span>'+[0, 1, 2, 3, 4, 5, 6].map(zelle).join("")+'</div>';
  }
  return '<div class="kp-vis" role="img" aria-label="'+esc(t("planVisAria", { w:p.wochen, n:planEintraege(p).length }))+'">'+kopf+zeilen+
    '<div class="kv-legende"><span><i class="kv-p kraft"></i>'+esc(t("planVisKraft"))+'</span><span><i class="kv-p run"></i>'+esc(t("planOptRun"))+'</span><span><i class="kv-p zufall"></i>'+esc(t("planOptZufall"))+'</span></div></div>';
}
