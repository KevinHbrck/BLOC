"use strict";
/* ============ Baukasten (Seite „Training“) ============
   Aufbau: Übung → BLOC → Workout → PLAN.
   - BLOC: ein Baustein aus Übungen. Das sind die Pläne aus „Meine“ (settings.stPlaene, gebaut mit „Selber bauen“) und die eigenen Workouts
     mit Timer (db.myWorkouts, ohne die automatischen Kopien von Plänen). Der BLOC-Builder selbst ist der bestehende (katPlanNeu).
   - Workout (db.bkWorkouts): Abfolge von BLOCs, Läufen und Kataloginhalten. Eintrag { typ:"plan"|"my"|"run", ref, runden, pause } bzw. { typ:"run", min, name }.
     BLOCs aus „Meine“ stehen als Verweis darin (Änderung wirkt überall); aus einem Katalog übernommen wird eine Kopie unter „Meine“.
   - PLAN (db.plaene): Wochen und Wochentage mit Workouts { id, name, wochen, tage:[0-6], wahl:{ Tag:["wk:id" | "plan:id" | "my:id" | "lib:id" | "run" | "zufall"] } };
     „Start“ trägt ihn in den Kalender ein, dort erscheint er auf Heute wie bisher.
   Neue Workouts und PLÄNE speichern sich bei jeder Änderung selbst; leere Entwürfe (entwurf:true) räumt bkAufraeumen weg. */
var BK_SEGS = ["bloc", "workout", "plan"];
var BK_PAUSE = 30;                 // Pause nach einem Eintrag im neuen Workout, bis man sie ändert
var bkNeuFuer = null;              // { wk, vor:[Schlüssel] }: für dieses Workout wird gerade ein BLOC gebaut; danach hängt ihn das Workout an
var bkQuelle = "bloc", bkSuchtext = "";   // Workout-Builder: gewählte Quelle und Suche

function bkSeg(){ var s = state.db.settings.bkSeg; return BK_SEGS.indexOf(s) > -1 ? s : "bloc"; }
function bkNeuerst(a, b){ return Math.max(b.usedAt || 0, b.updatedAt || 0) - Math.max(a.usedAt || 0, a.updatedAt || 0); }   // zuletzt benutzt (oder geändert) zuerst
function bkWkFind(id){ var l = state.db.bkWorkouts; for(var i = 0; i < l.length; i++) if(l[i].id === id) return l[i]; return null; }
function bkPlFind(id){ var l = state.db.plaene; for(var i = 0; i < l.length; i++) if(l[i].id === id) return l[i]; return null; }
function bkAufraeumen(){   // leere Entwürfe, die nicht offen sind
  var d = state.db, vorher = d.bkWorkouts.length + d.plaene.length;
  d.bkWorkouts = d.bkWorkouts.filter(function(w){ return !(w.entwurf && !w.items.length); });
  d.plaene = d.plaene.filter(function(p){ return !(p.entwurf && !bkPlanAnzahl(p)); });
  if(d.bkWorkouts.length + d.plaene.length !== vorher) save();
}
function bkPlanAnzahl(p){ var n = 0; (p.tage || []).forEach(function(d){ n += planWahlListe((p.wahl || {})[d]).length; }); return n; }

/* ---------- BLOCs ---------- */
function bkPlanLauf(p){ return draftRun({ name:p.name, mode:"individual", reps:6, work:30, rest:10, blockRest:p.blockRest != null ? p.blockRest : 45, items:planMitItems(p) }); }
function bkBlocUebungen(typ, o){   // Übungs-IDs eines BLOCs
  if(typ === "plan") return stPlanIds(o);
  return normMy(o).items.map(function(it){ return it.ex; }).filter(function(id){ return findExercise(id); });
}
function bkBlocVon(typ, o){
  var ids = bkBlocUebungen(typ, o);
  return { key:typ+":"+o.id, typ:typ, id:o.id, name:o.name || t("untitled"), usedAt:o.usedAt || 0, updatedAt:o.updatedAt || 0, ids:ids,
           dauer:workoutDuration(typ === "plan" ? bkPlanLauf(o) : myRun(o)) };
}
function bkBloecke(){
  var out = [];
  stPlaene().forEach(function(p){ if(!p.entwurf && stPlanIds(p).length) out.push(bkBlocVon("plan", p)); });
  (state.db.myWorkouts || []).forEach(function(m){ if(m && !m.fromPlan && normMy(m).items.length) out.push(bkBlocVon("my", m)); });
  return out.sort(bkNeuerst);
}
function bkBlocFind(typ, id){
  var o = typ === "plan" ? stPlanFind(id) : findMy(id);
  return o ? bkBlocVon(typ, o) : null;
}
function bkBlocFarbe(b){ var ex = b.ids.length ? findExercise(b.ids[0]) : null; return ex ? studioFarbe(ex) : "var(--accent)"; }
function bkAnzahlBlocs(n){ return n === 1 ? t("bkAnzBloc1") : t("bkAnzBlocN", { n:n }); }

/* ---------- Workouts ---------- */
function bkWkItem(it){   // ein Eintrag des Workouts, aufgelöst: { ok, name, sub, dauer (ein Durchgang), farbe }
  if(it.typ === "run") return { ok:true, name:it.name || t("bkRunName", { n:it.min }), sub:t("bkRunName", { n:it.min }), dauer:(+it.min || 0)*60, farbe:"var(--run-color, #e5573f)" };
  var b = bkBlocFind(it.typ, it.ref);
  if(!b) return { ok:false, name:t("bkFehlt"), sub:"", dauer:0, farbe:"var(--text-dim)" };
  return { ok:true, name:b.name, sub:t("exCount", { n:b.ids.length })+SEP+fmtDauerKurz(b.dauer), dauer:b.dauer, farbe:bkBlocFarbe(b) };
}
function bkRunden(it){ return clamp(Math.round(+it.runden) || 1, 1, 99); }
function bkWkDauer(wk){   // Pause nach jedem Durchgang außer dem allerletzten
  var sum = 0, n = wk.items.length;
  wk.items.forEach(function(it, i){
    var r = bkRunden(it), p = Math.max(0, +it.pause || 0);
    sum += bkWkItem(it).dauer*r + p*(r - 1 + (i < n - 1 ? 1 : 0));
  });
  return sum;
}
/* Die Pause zwischen den Übungen eines BLOCs gilt weiter, wenn er in einem Workout läuft (zwischen zwei Dehnübungen reichen 10 s) */
function bkPausen(l, br){
  l.forEach(function(x, i){
    if(x.after != null || i === l.length - 1) return;
    x.after = exIsStretch(x.ex) && exIsStretch(l[i + 1].ex) ? Math.min(10, br) : br;
  });
  return l;
}
function bkItemsFuer(it){   // die Übungen eines Eintrags für den Timer (ein Durchgang)
  if(it.typ === "run") return [{ lauf:true, name:it.name || t("bkRunName", { n:it.min }), reps:1, work:Math.max(1, +it.min || 1)*60, rest:0 }];
  if(it.typ === "plan"){ var p = stPlanFind(it.ref); return p ? bkPausen(planMitItems(p), p.blockRest != null ? p.blockRest : 45) : []; }
  var m = findMy(it.ref);
  if(!m) return [];
  return bkPausen(m.items.map(function(x){ var tm = itemTiming(m, x), o = JSON.parse(JSON.stringify(x)); o.reps = tm.reps; o.work = tm.work; o.rest = tm.rest; return o; }), m.blockRest != null ? m.blockRest : 45);
}
/* Das Workout als Entwurf für den Timer: die Einträge hintereinander, je Runde; nach jedem Durchgang die Pause. Ab 30 s Pause fragt der Timer „Bereit für …?“ */
function bkWkDraft(wk){
  var items = [], mitGew = false, n = wk.items.length, vor = 0;   // vor: die Pause vor dem nächsten Durchgang
  wk.items.forEach(function(it, i){
    var r = bkRunden(it), pause = Math.max(0, +it.pause || 0), name = bkWkItem(it).name;
    for(var k = 0; k < r; k++){
      var l = JSON.parse(JSON.stringify(bkItemsFuer(it)));
      if(!l.length) continue;
      if(items.length && vor >= 30) l[0].bloc = name;
      if(!(i === n - 1 && k === r - 1)) l[l.length - 1].after = pause;
      vor = pause;
      items = items.concat(l);
    }
    if(it.typ === "plan") mitGew = true;
  });
  return { key:"bk:"+wk.id, src:"bk", name:wk.name, mode:"individual", reps:6, work:30, rest:10, blockRest:0, items:items, mitGewicht:mitGew, fest:true };
}
function bkWkStart(wk){
  var d = bkWkDraft(wk);
  if(!d.items.length){ showToast(t("bkWkLeerStart")); return; }
  wk.usedAt = Date.now(); save();
  coverDraft = d;
  launchFromSource({ type:"draft", bk:wk.id });
}
function bkBlocStart(typ, id){
  var o = typ === "plan" ? stPlanFind(id) : findMy(id);
  if(!o) return;
  o.usedAt = Date.now(); save();
  if(typ === "plan") planAlsWorkout(o, true); else { coverDraft = null; go("#playmy/"+id); }
}
function bkWorkoutsMit(typ, id){ return state.db.bkWorkouts.filter(function(w){ return w.items.some(function(it){ return it.typ === typ && it.ref === id; }); }); }
function bkPlaeneMit(wkId){ return state.db.plaene.filter(function(p){ return (p.tage || []).some(function(d){ return planWahlListe((p.wahl || {})[d]).indexOf("wk:"+wkId) > -1; }); }); }
function bkNamen(l){ return l.slice(0, 4).map(function(x){ return "„"+x.name+"“"; }).join(", ")+(l.length > 4 ? " …" : ""); }
/* Löschen: Hinweis, wo der Eintrag noch steckt (für die Rückfrage), und danach überall entfernen */
function bkLoeschText(typ, id){
  var l = typ === "wk" ? bkPlaeneMit(id) : bkWorkoutsMit(typ, id);
  return l.length ? " "+t(typ === "wk" ? "bkLoeschWarnWk" : "bkLoeschWarn", { l:bkNamen(l) }) : "";
}
function bkRefWeg(typ, id){
  state.db.bkWorkouts.forEach(function(w){ w.items = w.items.filter(function(it){ return !(it.typ === typ && it.ref === id); }); });
  if(typ === "wk") state.db.plaene.forEach(function(p){ Object.keys(p.wahl || {}).forEach(function(d){ p.wahl[d] = planWahlListe(p.wahl[d]).filter(function(v){ return v !== "wk:"+id; }); }); });
}

/* ---------- Karten ---------- */
function bkStreifen(teile){
  return '<span class="bk-streifen" aria-hidden="true">'+teile.map(function(x){ return '<i style="flex:'+Math.max(1, Math.round(x.w))+';background:'+x.farbe+'"></i>'; }).join("")+'</span>';
}
function bkTageZellen(p){
  var tage = p.tage || [];
  return '<span class="bk-wtage" aria-hidden="true">'+[0, 1, 2, 3, 4, 5, 6].map(function(d){
    var n = tage.indexOf(d) > -1 ? planWahlListe((p.wahl || {})[d]).length : 0;
    return '<i class="'+(n ? 'an' : '')+'"></i>';
  }).join("")+'</span>';
}
/* Karten eines Segments: { typ, id, name, meta, vor (Vorschau-HTML), neu (Sortierwert) } */
function bkKarten(seg){
  if(seg === "bloc") return bkBloecke().map(function(b){
    return { typ:b.typ, id:b.id, name:b.name, meta:fmtDauerKurz(b.dauer)+" · "+t("exCount", { n:b.ids.length }),
             vor:bkStreifen(b.ids.slice(0, 16).map(function(id){ var ex = findExercise(id); return { farbe:studioFarbe(ex), w:1 }; })) };
  });
  if(seg === "workout") return state.db.bkWorkouts.filter(function(w){ return !w.entwurf; }).sort(bkNeuerst).map(function(w){
    var n = w.items.length;
    return { typ:"wk", id:w.id, name:w.name, meta:fmtDauerKurz(bkWkDauer(w))+" · "+bkAnzahlBlocs(n),
             vor:bkStreifen(w.items.map(function(it){ var x = bkWkItem(it); return { farbe:x.farbe, w:Math.max(30, x.dauer*bkRunden(it))/30 }; })) };
  });
  return state.db.plaene.filter(function(p){ return !p.entwurf; }).sort(bkNeuerst).map(function(p){
    return { typ:"pl", id:p.id, name:p.name, meta:t("bkPlanMeta", { d:(p.tage || []).length, w:p.wochen }), vor:bkTageZellen(p) };
  });
}
function bkKarteHTML(k, klasse){
  return '<button type="button" class="'+(klasse || "bk-karte")+'" data-bkopen="'+k.typ+'/'+esc(k.id)+'">'+
    '<span class="bk-k-typ">'+esc(t("bkTyp_"+k.typ))+'</span>'+
    '<b class="bk-k-name">'+esc(k.name)+'</b>'+
    '<span class="bk-k-meta">'+esc(k.meta)+'</span>'+k.vor+'</button>';
}
function bkKarussellHTML(seg, l){
  var n = l.length;
  if(!n) return '<div class="bk-leer"><p>'+esc(t("bkLeer_"+seg))+'</p><button type="button" class="btn btn-primary" data-bkbau>'+esc(t("bkBau_"+seg))+'</button></div>';
  var loop = n >= 3, karten = loop ? l.concat(l, l) : l;   // ab drei Elementen dreimal hintereinander: beim Auslaufen springt die Ansicht unbemerkt in die Mitte
  return '<div class="bk-kar'+(loop ? ' endlos' : '')+'" data-bkkar data-n="'+n+'"'+(loop ? ' data-loop' : '')+' role="group" aria-label="'+esc(t("bkSeg_"+seg))+'">'+
      '<div class="bk-spur">'+karten.map(function(k){ return bkKarteHTML(k); }).join("")+'</div></div>'+
    '<div class="bk-fuss"><span class="bk-pos" data-bkpos aria-live="polite">1 / '+n+'</span>'+
    '<button type="button" class="bk-alle" data-bkalle>'+esc(t("bkAlle"))+'</button></div>';
}
/* Der ganze Baukasten für die Seite „Training“ */
function bkHTML(){
  var seg = bkSeg();
  return '<section class="bk" data-bk>'+
    '<div class="bk-kopf"><span class="bk-kicker">'+esc(t("bkTitel"))+'</span>'+
      '<div class="bk-seg" role="tablist" aria-label="'+esc(t("bkTitel"))+'">'+BK_SEGS.map(function(s){
        return '<button type="button" role="tab" data-bkseg="'+s+'" class="'+(s === seg ? 'on' : '')+'" aria-selected="'+(s === seg)+'">'+esc(t("bkSeg_"+s))+'</button>'; }).join("")+'</div>'+
      '<button type="button" class="bk-bau" data-bkbau>'+esc(t("bkBau_"+seg))+'</button></div>'+
    '<div class="bk-koerper" data-bkkoerper>'+bkKarussellHTML(seg, bkKarten(seg))+'</div></section>';
}
function bkBauen(seg){
  if(seg === "bloc"){ go("#katalog"); katPlanNeu(); }   // der bestehende BLOC-Builder („Selber bauen“)
  else go(seg === "workout" ? "#wbau/neu" : "#pbau/neu");
}
function bkOeffnen(wert){ var p = wert.split("/"); go("#bkd/"+p[0]+"/"+p[1]); }
/* Klick auf eine Karte, aber nicht nach einem Wisch */
function bkKartenKlick(root){
  var x0 = 0;
  root.addEventListener("pointerdown", function(e){ x0 = e.clientX; });
  root.addEventListener("click", function(e){
    var k = e.target.closest("[data-bkopen]");
    if(!k || Math.abs(e.clientX - x0) > 8) return;
    bkOeffnen(k.getAttribute("data-bkopen"));
  });
}
function bkKarBinden(){
  var kar = app.querySelector("[data-bkkar]");
  if(!kar) return;
  var n = +kar.getAttribute("data-n"), loop = kar.hasAttribute("data-loop"), karten = kar.querySelectorAll(".bk-karte"), pos = app.querySelector("[data-bkpos]"), tm = 0;
  function mitte(i){ var k = karten[i]; return k.offsetLeft + k.offsetWidth/2; }
  function aktuell(){
    var c = kar.scrollLeft + kar.clientWidth/2, best = 0, d = Infinity;
    for(var i = 0; i < karten.length; i++){ var dd = Math.abs(mitte(i) - c); if(dd < d){ d = dd; best = i; } }
    return best;
  }
  function springe(i){ kar.style.scrollSnapType = "none"; kar.scrollLeft = mitte(i) - kar.clientWidth/2; kar.style.scrollSnapType = ""; }
  function zeige(){ pos.textContent = (aktuell() % n + 1)+" / "+n; }
  function sicher(){ var i = aktuell(); if(i < n) springe(i + n); else if(i >= 2*n) springe(i - n); }
  if(loop) springe(n);
  kar.addEventListener("scroll", function(){ zeige(); if(loop){ clearTimeout(tm); tm = setTimeout(sicher, 140); } }, { passive:true });
  window.addEventListener("resize", function(){ if(document.body.contains(kar)) springe(aktuell()); }, { passive:true });
  bkKartenKlick(kar);
}
function bkBinden(){
  var sec = app.querySelector("[data-bk]");
  if(!sec) return;
  sec.querySelectorAll("[data-bkseg]").forEach(function(b){
    b.addEventListener("click", function(){
      state.db.settings.bkSeg = b.getAttribute("data-bkseg"); save();
      sec.outerHTML = bkHTML(); bkBinden();
    });
  });
  sec.querySelectorAll("[data-bkbau]").forEach(function(b){ b.addEventListener("click", function(){ bkBauen(bkSeg()); }); });
  var alle = sec.querySelector("[data-bkalle]");
  if(alle) alle.addEventListener("click", function(){ go("#bkalle/"+bkSeg()); });
  bkKarBinden();
}

/* ---------- Alle anzeigen: Liste mit Suche ---------- */
function bkAlleZeilen(seg, q){
  var l = bkKarten(seg), s = q.trim().toLowerCase();
  if(s) l = l.filter(function(k){ return (k.name+" "+k.meta).toLowerCase().indexOf(s) > -1; });
  return l.length ? '<div class="bk-raster">'+l.map(function(k){ return bkKarteHTML(k, "bk-karte gitter"); }).join("")+'</div>' : '<div class="empty">'+esc(t("bkNichts"))+'</div>';
}
function renderBkAlle(seg){
  if(BK_SEGS.indexOf(seg) < 0) seg = "bloc";
  app.innerHTML = topbar(t("bkSeg_"+seg), { back:"#training" })+
    '<div class="bk-suchzeile"><input type="search" id="bk-q" placeholder="'+esc(t("bkSuche"))+'" aria-label="'+esc(t("bkSuche"))+'"></div>'+
    '<div id="bk-liste">'+bkAlleZeilen(seg, "")+'</div>'+
    '<button type="button" class="btn btn-primary bk-bau-unten" data-bkbau>'+esc(t("bkBau_"+seg))+'</button><div style="height:30px"></div>';
  bindCommon();
  var liste = app.querySelector("#bk-liste");
  app.querySelector("#bk-q").addEventListener("input", function(e){ liste.innerHTML = bkAlleZeilen(seg, e.target.value); });
  bkKartenKlick(liste);
  app.querySelector("[data-bkbau]").addEventListener("click", function(){ bkBauen(seg); });
}

/* ---------- Detailansicht ---------- */
function bkDetailDaten(typ, id){
  if(typ === "plan" || typ === "my"){
    var b = bkBlocFind(typ, id);
    if(!b) return null;
    var o = typ === "plan" ? stPlanFind(id) : normMy(findMy(id));
    return { name:b.name, meta:fmtDauerKurz(b.dauer)+" · "+t("exCount", { n:b.ids.length }), vor:bkStreifen(b.ids.slice(0, 16).map(function(x){ return { farbe:studioFarbe(findExercise(x)), w:1 }; })),
      zeilen:b.ids.map(function(x){
        var ex = findExercise(x), sub = typ === "plan" ? satzKurz(x) : timingText(itemTiming(o, o.items.filter(function(it){ return it.ex === x; })[0]), ex.perSide);
        return { name:tplText(ex.name), sub:sub, farbe:studioFarbe(ex) };
      }), start:function(){ bkBlocStart(typ, id); } };
  }
  if(typ === "wk"){
    var wk = bkWkFind(id);
    if(!wk) return null;
    return { name:wk.name, meta:fmtDauerKurz(bkWkDauer(wk))+" · "+bkAnzahlBlocs(wk.items.length),
      vor:bkStreifen(wk.items.map(function(it){ var x = bkWkItem(it); return { farbe:x.farbe, w:Math.max(30, x.dauer*bkRunden(it))/30 }; })),
      zeilen:wk.items.map(function(it){ var x = bkWkItem(it); return { name:x.name, sub:t("bkWbRunden")+": "+bkRunden(it)+" × · "+t("bkWbPause")+" "+(+it.pause || 0)+" s", farbe:x.farbe }; }),
      start:function(){ bkWkStart(wk); } };
  }
  var p = bkPlFind(id);
  if(!p) return null;
  var tage = (p.tage || []).slice().sort(function(a, c){ return a - c; }), lang = currentLang() === "en" ? "en-GB" : "de-DE";
  return { name:p.name, meta:t("bkPlanMeta", { d:tage.length, w:p.wochen }), vor:bkTageZellen(p),
    zeilen:tage.map(function(d){
      return { name:kalPlus(planStart(), d).toLocaleDateString(lang, { weekday:"long" }), sub:esc(planWahlListe((p.wahl || {})[d]).map(planWahlName).join(", ") || "–"), farbe:"var(--accent)" };
    }),
    start:function(){ bkPlanStart(p); } };
}
function bkKopieAnlegen(typ, id){   // Kopie einer Karte; gibt die neue ID zurück
  var name = function(n){ return t("planKopieName", { n:n }); };
  if(typ === "plan"){ var p = stPlanFind(id); return p ? planKopie(p).id : null; }
  if(typ === "my"){ var m = findMy(id); if(!m) return null; var c = createMyFromDraft(draftFromMy(m)); c.name = name(m.name); save(); return c.id; }
  var w = typ === "wk" ? bkWkFind(id) : bkPlFind(id);
  if(!w) return null;
  var k = JSON.parse(JSON.stringify(w)); k.id = uid(); k.name = name(w.name); k.updatedAt = Date.now(); delete k.usedAt;
  state.db[typ === "wk" ? "bkWorkouts" : "plaene"].push(k); save();
  return k.id;
}
function bkLoeschen(typ, id, danach){
  var name = typ === "plan" ? (stPlanFind(id) || {}).name : typ === "my" ? (findMy(id) || {}).name : typ === "wk" ? (bkWkFind(id) || {}).name : (bkPlFind(id) || {}).name;
  if(!name) return;
  confirmSheet(t(typ === "plan" ? "planDelQ" : typ === "my" ? "myDeleteQ" : typ === "wk" ? "deleteWorkoutQ" : "planDelQ"), "„"+name+"“ – "+t("cantUndo")+bkLoeschText(typ, id), t("del"), function(){
    if(typ === "plan") state.db.settings.stPlaene = stPlaene().filter(function(x){ return x.id !== id; });
    else if(typ === "my") deleteMyNow(id);
    else if(typ === "wk") state.db.bkWorkouts = state.db.bkWorkouts.filter(function(x){ return x.id !== id; });
    else state.db.plaene = state.db.plaene.filter(function(x){ return x.id !== id; });
    bkRefWeg(typ, id);
    unfav((typ === "plan" ? "plan:" : typ === "my" ? "my:" : "bk:")+id);
    save(); showToast(t("deletedToast", { n:name })); danach();
  });
}
/* Bearbeiten: ein BLOC, der in mehreren Workouts steckt, fragt erst nach (Kopie oder hier ändern); wkId: das Workout, aus dem man kommt - es bekommt die Kopie */
function bkBearbeiten(typ, id, wkId){
  function los(zielTyp, zielId){
    if(zielTyp === "wk") go("#wbau/"+zielId);
    else if(zielTyp === "pl") go("#pbau/"+zielId);
    else if(zielTyp === "plan"){ katZuMeine(); stPlanAktiv = zielId; stPlanBauen = false; stPlanQuery = ""; go("#katalog"); }
    else go("#mybuild/"+zielId);
  }
  var l = (typ === "plan" || typ === "my") ? bkWorkoutsMit(typ, id) : [];
  if(l.length < 2) return los(typ, id);
  openActionSheet(t("bkVerwendetN", { n:l.length })+": "+bkNamen(l), [
    { ico:ICON_COPY, label:t("bkAlsKopie"), fn:function(){
      var neu = bkKopieAnlegen(typ, id);
      if(!neu) return;
      if(wkId){ var wk = bkWkFind(wkId); if(wk){ wk.items.forEach(function(it){ if(it.typ === typ && it.ref === id) it.ref = neu; }); wk.updatedAt = Date.now(); save(); } }
      showToast(t("planKopiert", { n:t("planKopieName", { n:(bkBlocFind(typ, neu) || {}).name || "" }) }));
      los(typ, neu);
    } },
    { ico:ICON_EDIT, label:t("bkTrotzdem"), fn:function(){ los(typ, id); } }
  ]);
}
function renderBkDetail(typ, id){
  var d = bkDetailDaten(typ, id);
  if(!d){ goBack("#training"); return; }
  app.innerHTML = topbar(d.name, { back:"#training", right:'<button class="iconbtn" data-bkmenue aria-label="'+esc(t("more"))+'">'+ICON_DOTS+'</button>' })+
    '<section class="bk-detail"><div class="bk-d-kopf"><span class="bk-k-typ">'+esc(t("bkTyp_"+typ))+'</span><b>'+esc(d.name)+'</b><span class="bk-k-meta">'+esc(d.meta)+'</span>'+d.vor+'</div>'+
    '<div class="btn-row bk-d-knoepfe"><button type="button" class="btn btn-primary" data-bkstart>'+ICON_PLAY+' '+esc(t("start"))+'</button>'+
    '<button type="button" class="btn btn-secondary" data-bkedit>'+svgIcon(ICON_EDIT)+' '+esc(t("edit"))+'</button></div>'+
    (typ === "pl" ? '<p class="bk-d-info">'+esc(t("planInfo", { n:planEintraege(bkPlFind(id)).length, datum:planStart().toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { day:"numeric", month:"long" }) }))+'</p>' : '')+
    '<div class="section-title">'+esc(t("bkDetailInhalt"))+'</div>'+
    '<div class="bk-d-liste">'+(d.zeilen.length ? d.zeilen.map(function(z, i){
      return '<div class="bk-d-zeile" style="--c:'+z.farbe+'"><i>'+(i + 1)+'</i><span><b>'+esc(z.name)+'</b><small>'+z.sub+'</small></span></div>'; }).join("") : '<div class="empty">'+esc(t(typ === "pl" ? "bkPlanLeerStart" : "bkWkLeerStart"))+'</div>')+'</div></section>'+
    '<div style="height:30px"></div>';
  bindCommon();
  app.querySelector("[data-bkstart]").addEventListener("click", d.start);
  app.querySelector("[data-bkedit]").addEventListener("click", function(){ bkBearbeiten(typ, id); });
  app.querySelector("[data-bkmenue]").addEventListener("click", function(){
    openActionSheet(d.name, [
      { ico:ICON_COPY, label:t("actCopy"), fn:function(){ var n = bkKopieAnlegen(typ, id); if(n){ showToast(t("planKopiert", { n:t("planKopieName", { n:d.name }) })); go("#bkd/"+typ+"/"+n); } } },
      { ico:P_TRASH, label:t("del"), danger:true, fn:function(){ bkLoeschen(typ, id, function(){ goBack("#training"); }); } }
    ]);
  });
}

/* ---------- Workout-Builder ---------- */
function bkWkAender(wk){ wk.updatedAt = Date.now(); if(wk.items.length) delete wk.entwurf; save(); }
function bkKatalogKopie(lw){   // fertiges Workout → eigener BLOC mit denselben Übungen (ohne Dehnen); gibt es die Kopie schon, wird sie genommen
  var key = "lib:"+lw.id, da = stPlaene().filter(function(x){ return x.fromWo === key && !x.entwurf; })[0];
  if(da) return { p:da, neu:false };
  var ids = lw.exercises.filter(function(id){ var ex = findExercise(id); return ex && ex.main !== "stretch"; });
  var p = { id:uid(), name:tplText(lw.name), ids:ids, updatedAt:Date.now(), fromWo:key, standard:"saetze" };
  stPlaene().push(p); save();
  return { p:p, neu:true };
}
function bkMobilityKopie(lw){   // Mobility & Stretch → eigenes Workout mit Timer in Mobility & Stretch › Meine
  var da = (state.db.myWorkouts || []).filter(function(m){ return m && m.fromLib === lw.id; })[0];
  if(da) return { m:da, neu:false };
  var d = draftFromLib(lw); d.ws = AUFWAERM_IDS.indexOf(lw.id) > -1 ? "warm" : "dehn";
  var m = createMyFromDraft(d); m.fromLib = lw.id; save();
  return { m:m, neu:true };
}
/* Zeilen der gewählten Quelle (oder aller bei einer Suche): { quelle, name, sub, add:→ Eintrag, kopie:Hinweis? } */
function bkQuellenZeilen(quelle, q){
  var s = q.trim().toLowerCase(), alle = !!s, out = [];
  function nimm(k){ return !alle || k.such.indexOf(s) > -1; }
  if(alle || quelle === "bloc") bkBloecke().forEach(function(b){
    var k = { quelle:"bloc", name:b.name, sub:t("exCount", { n:b.ids.length })+SEP+fmtDauerKurz(b.dauer), such:(b.name+" "+b.ids.map(function(id){ var ex = findExercise(id); return ex ? ex.name.de+" "+ex.name.en : ""; }).join(" ")).toLowerCase(),
             add:function(){ return { typ:b.typ, ref:b.id }; } };
    if(nimm(k)) out.push(k);
  });
  if(alle || quelle === "katalog") LIB_WORKOUTS.forEach(function(lw){
    if(libIstWarmDehn(lw) || libHidden("wo:"+lw.id)) return;
    var exs = lw.exercises.map(findExercise).filter(Boolean);
    var k = { quelle:"katalog", name:tplText(lw.name), sub:t("exCount", { n:exs.length })+SEP+fmtDauerKurz(workoutDuration(libWorkoutRun(lw))), such:woSearchText(lw.name.de+" "+lw.name.en, exs),
              add:function(){ var r = bkKatalogKopie(lw); return { typ:"plan", ref:r.p.id, kopie:r.neu, name:r.p.name }; } };
    if(nimm(k)) out.push(k);
  });
  if(alle || quelle === "warm") LIB_WORKOUTS.forEach(function(lw){
    if(!libIstWarmDehn(lw) || libHidden("wo:"+lw.id)) return;
    var exs = lw.exercises.map(findExercise).filter(Boolean);
    var k = { quelle:"warm", name:tplText(lw.name), sub:t("exCount", { n:exs.length })+SEP+fmtDauerKurz(workoutDuration(libWorkoutRun(lw))), such:woSearchText(lw.name.de+" "+lw.name.en, exs),
              add:function(){ var r = bkMobilityKopie(lw); return { typ:"my", ref:r.m.id, kopie:r.neu, name:r.m.name }; } };
    if(nimm(k)) out.push(k);
  });
  if(alle || quelle === "run"){
    var laeufe = [15, 20, 30, 45, 60].map(function(min){ return { min:min, name:t("bkRunName", { n:min }) }; });
    runWorkouts().filter(function(w){ return !w.rad && w.km > 0; }).forEach(function(w){ laeufe.push({ min:Math.max(1, Math.round(w.km*(w.pace || 360)/60)), name:runWoName(w) }); });
    laeufe.forEach(function(r){
      var k = { quelle:"run", name:r.name, sub:t("bkRunName", { n:r.min }), such:(r.name+" run lauf").toLowerCase(), add:function(){ return { typ:"run", min:r.min, name:r.name }; } };
      if(nimm(k)) out.push(k);
    });
  }
  return out;
}
function bkAbfolgeHTML(wk){
  if(!wk.items.length) return '<div class="empty bk-ab-leer">'+esc(t("bkWbLeer"))+'</div>';
  return wk.items.map(function(it, i){
    var x = bkWkItem(it), r = bkRunden(it), p = +it.pause || 0;
    return '<div class="bk-ab'+(x.ok ? '' : ' fehlt')+'" data-i="'+i+'" style="--c:'+x.farbe+'">'+
      '<button type="button" class="bk-griff" data-griff aria-label="'+esc(t("moveUp")+" / "+t("moveDown"))+'">'+svgIcon('<path d="M8 6h.01M16 6h.01M8 12h.01M16 12h.01M8 18h.01M16 18h.01" stroke-width="3.4"/>')+'</button>'+
      '<div class="bk-ab-text" data-abtext><b>'+esc(x.name)+'</b><small>'+x.sub+'</small></div>'+
      '<button type="button" class="bk-weg" data-weg="'+i+'" aria-label="'+esc(t("bkWeg")+": "+x.name)+'">&times;</button>'+
      '<div class="bk-ab-reg">'+
        '<span class="bk-mini" data-reg="runden"><small>'+esc(t("bkWbRunden"))+'</small><button type="button" data-minus aria-label="&minus;">&minus;</button><output>'+r+' ×</output><button type="button" data-plus aria-label="&plus;">&plus;</button></span>'+
        '<span class="bk-mini" data-reg="pause"><small>'+esc(t("bkWbPause"))+'</small><button type="button" data-minus aria-label="&minus;">&minus;</button><output>'+p+' s</output><button type="button" data-plus aria-label="&plus;">&plus;</button></span>'+
      '</div></div>';
  }).join("");
}
function bkQuellenHTML(q){
  var l = bkQuellenZeilen(bkQuelle, q);
  return l.length ? l.map(function(k, i){
    return '<button type="button" class="bk-q-zeile" data-qi="'+i+'"><span class="bk-q-text"><b>'+esc(k.name)+'</b><small>'+(q.trim() ? esc(t("bkQ_"+k.quelle))+SEP : '')+k.sub+'</small></span><span class="chip">+</span></button>';
  }).join("") : '<div class="empty">'+esc(t("bkNichts"))+'</div>';
}
function renderWbau(id){
  var wk;
  if(id === "neu"){
    wk = { id:uid(), name:t("bkWkDefault", { n:state.db.bkWorkouts.length + 1 }), items:[], updatedAt:Date.now(), entwurf:true };
    state.db.bkWorkouts.push(wk); save();
    navStack[navStack.length-1] = "#wbau/"+wk.id; setUrl("#wbau/"+wk.id);
  } else wk = bkWkFind(id);
  if(!wk){ goBack("#training"); return; }
  /* Ein BLOC, den man aus diesem Workout heraus gebaut hat, kommt automatisch ans Ende */
  if(bkNeuFuer && bkNeuFuer.wk === wk.id){
    var neue = bkBloecke().filter(function(b){ return bkNeuFuer.vor.indexOf(b.key) < 0; });
    bkNeuFuer = null;
    if(neue.length){ var nb = neue[0]; wk.items.push({ typ:nb.typ, ref:nb.id, runden:1, pause:BK_PAUSE }); bkWkAender(wk); showToast(t("bkAngehaengt", { n:nb.name })); }
  }
  var h = '<div class="bk-wb">'+topbar(t("bkWbTitel"), { back:"#training", right:'<button class="iconbtn" data-wbstart title="'+esc(t("start"))+'" aria-label="'+esc(t("start"))+'">'+ICON_PLAY+'</button>' })+
    '<div class="card bk-wb-kopf"><label for="wb-name">'+esc(t("bkWbName"))+'</label><input type="text" id="wb-name" value="'+esc(wk.name)+'" maxlength="40">'+
      '<div class="bk-summe" data-summe></div></div>'+
    '<div class="section-title">'+esc(t("bkWbAbfolge"))+'</div>'+
    '<div class="bk-abfolge" data-abfolge>'+bkAbfolgeHTML(wk)+'</div>'+
    '<p class="bk-hinweis">'+esc(t("bkWbWischen"))+'</p>'+
    '<div class="section-title">'+esc(t("bkWbHinzu"))+'</div>'+
    '<div class="bk-quellen" role="group">'+["bloc", "katalog", "warm", "run"].map(function(q){
      return '<button type="button" class="bk-qchip'+(q === bkQuelle ? ' on' : '')+'" data-quelle="'+q+'" aria-pressed="'+(q === bkQuelle)+'">'+esc(t("bkQ_"+q))+'</button>'; }).join("")+'</div>'+
    '<div class="bk-suchzeile"><input type="search" id="wb-q" value="'+esc(bkSuchtext)+'" placeholder="'+esc(t("bkSuche"))+'" aria-label="'+esc(t("bkSuche"))+'"></div>'+
    '<p class="bk-hinweis" data-runhinweis'+(bkQuelle === "run" && !bkSuchtext ? '' : ' hidden')+'>'+esc(t("bkRunHinweis"))+'</p>'+
    '<div class="bk-quelle" data-quellenliste>'+bkQuellenHTML(bkSuchtext)+'</div>'+
    '<button type="button" class="btn btn-secondary bk-neubloc" data-neubloc>'+esc(t("bkNeuBloc"))+'</button>'+
    '<div style="height:90px"></div>'+
    '<div class="wb-leiste"><div class="wb-leiste-in"><span data-summe2></span><button type="button" class="btn btn-primary" data-fertig>'+ICON_SAVE+' '+esc(t("bkFertig"))+'</button></div></div></div>';
  app.innerHTML = h;
  bindCommon();
  var liste = app.querySelector("[data-abfolge]");
  function summe(){
    var txt = t("bkWbGesamt", { d:fmtDuration(bkWkDauer(wk)) })+" · "+bkAnzahlBlocs(wk.items.length);
    app.querySelector("[data-summe]").textContent = txt; app.querySelector("[data-summe2]").textContent = fmtDuration(bkWkDauer(wk));
  }
  function neuAbfolge(){ liste.innerHTML = bkAbfolgeHTML(wk); abfolgeBinden(); summe(); }
  function abfolgeBinden(){
    liste.querySelectorAll(".bk-ab").forEach(function(row){
      var i = +row.getAttribute("data-i");
      row.querySelectorAll("[data-reg]").forEach(function(reg){
        var feld = reg.getAttribute("data-reg"), out = reg.querySelector("output");
        function los(dv){
          var it = wk.items[i];
          if(feld === "runden") it.runden = clamp(bkRunden(it) + dv, 1, 99);
          else it.pause = clamp((+it.pause || 0) + dv*5, 0, 600);
          out.textContent = feld === "runden" ? bkRunden(it)+" ×" : (+it.pause || 0)+" s";
          bkWkAender(wk); summe();
        }
        reg.querySelector("[data-minus]").addEventListener("click", function(){ los(-1); });
        reg.querySelector("[data-plus]").addEventListener("click", function(){ los(1); });
      });
      row.querySelector("[data-weg]").addEventListener("click", function(){ entfernen(i); });
      row.querySelector("[data-abtext]").addEventListener("click", function(){
        var it = wk.items[i];
        if(it.typ === "run") return;
        if(bkBlocFind(it.typ, it.ref)) bkBearbeiten(it.typ, it.ref, wk.id);
      });
      wischen(row, i); ziehen(row);
    });
  }
  function entfernen(i){ wk.items.splice(i, 1); bkWkAender(wk); neuAbfolge(); }
  /* Nach links wischen entfernt den Eintrag */
  function wischen(row, i){
    var feld = row.querySelector("[data-abtext]"), x0 = 0, y0 = 0, dx = 0, an = false;
    feld.addEventListener("pointerdown", function(e){ x0 = e.clientX; y0 = e.clientY; dx = 0; an = true; });
    feld.addEventListener("pointermove", function(e){
      if(!an) return;
      var ddx = e.clientX - x0, ddy = e.clientY - y0;
      if(Math.abs(ddy) > Math.abs(ddx) && Math.abs(ddy) > 10){ an = false; row.style.transform = ""; return; }
      dx = Math.min(0, ddx);
      if(dx < -8) row.style.transform = "translateX("+dx+"px)";
    });
    function ende(){
      if(!an) return;
      an = false;
      if(dx < -90){ row.classList.add("raus"); setTimeout(function(){ entfernen(i); }, 160); }
      else row.style.transform = "";
    }
    feld.addEventListener("pointerup", ende); feld.addEventListener("pointercancel", function(){ an = false; row.style.transform = ""; });
  }
  /* Am Griff ziehen sortiert um (auch mit den Pfeiltasten) */
  function ziehen(row){
    var griff = row.querySelector("[data-griff]");
    function neueReihenfolge(){
      var rows = Array.prototype.slice.call(liste.querySelectorAll(".bk-ab")), alt = wk.items.slice();
      wk.items = rows.map(function(r){ return alt[+r.getAttribute("data-i")]; });
      bkWkAender(wk); neuAbfolge();
    }
    griff.addEventListener("pointerdown", function(e){
      e.preventDefault();
      griff.setPointerCapture(e.pointerId);
      var grab = e.clientY - row.getBoundingClientRect().top;
      row.classList.add("zieht");
      function bewegen(ev){
        var sibs = Array.prototype.slice.call(liste.querySelectorAll(".bk-ab")).filter(function(r){ return r !== row; }), ziel = null;
        for(var k = 0; k < sibs.length; k++){ var rc = sibs[k].getBoundingClientRect(); if(ev.clientY < rc.top + rc.height/2){ ziel = sibs[k]; break; } }
        if(ziel !== row.nextElementSibling) liste.insertBefore(row, ziel);
        row.style.transform = "";
        row.style.transform = "translateY("+(ev.clientY - grab - row.getBoundingClientRect().top)+"px)";
      }
      function fertig(){
        griff.removeEventListener("pointermove", bewegen); griff.removeEventListener("pointerup", fertig); griff.removeEventListener("pointercancel", fertig);
        row.classList.remove("zieht"); row.style.transform = "";
        neueReihenfolge();
      }
      griff.addEventListener("pointermove", bewegen); griff.addEventListener("pointerup", fertig); griff.addEventListener("pointercancel", fertig);
    });
    griff.addEventListener("keydown", function(e){
      var i = +row.getAttribute("data-i"), j = e.key === "ArrowUp" ? i - 1 : e.key === "ArrowDown" ? i + 1 : -1;
      if(j < 0 || j >= wk.items.length) return;
      e.preventDefault();
      var x = wk.items[i]; wk.items[i] = wk.items[j]; wk.items[j] = x;
      bkWkAender(wk); neuAbfolge();
      var neu = liste.querySelector('.bk-ab[data-i="'+j+'"] [data-griff]'); if(neu) neu.focus();
    });
  }
  abfolgeBinden(); summe();
  var nm = app.querySelector("#wb-name");
  nm.addEventListener("input", function(){ wk.name = nm.value.trim() || t("untitled"); wk.updatedAt = Date.now(); save(); });
  var ql = app.querySelector("[data-quellenliste]"), qe = app.querySelector("#wb-q"), rh = app.querySelector("[data-runhinweis]"), qz = [];
  function quellenZeigen(){
    qz = bkQuellenZeilen(bkQuelle, bkSuchtext);
    ql.innerHTML = bkQuellenHTML(bkSuchtext);
    rh.hidden = !(bkQuelle === "run" && !bkSuchtext.trim());
  }
  ql.addEventListener("click", function(e){
    var b = e.target.closest("[data-qi]");
    if(!b) return;
    var k = qz[+b.getAttribute("data-qi")];
    if(!k) return;
    var it = k.add(), name = it.name || bkWkItem(it).name, kopie = it.kopie;
    wk.items.push({ typ:it.typ, ref:it.ref, min:it.min, name:it.typ === "run" ? it.name : undefined, runden:1, pause:BK_PAUSE });
    bkWkAender(wk); neuAbfolge();
    showToast(t(kopie ? "bkKopieAngelegt" : "bkAngehaengt", { n:name }));
    if(kopie) quellenZeigen();   // die Kopie steht jetzt auch unter „Meine BLOCs“
  });
  qz = bkQuellenZeilen(bkQuelle, bkSuchtext);
  qe.addEventListener("input", function(){ bkSuchtext = qe.value; quellenZeigen(); });
  app.querySelectorAll("[data-quelle]").forEach(function(b){
    b.addEventListener("click", function(){
      bkQuelle = b.getAttribute("data-quelle");
      app.querySelectorAll("[data-quelle]").forEach(function(c){ var an = c === b; c.classList.toggle("on", an); c.setAttribute("aria-pressed", an); });
      quellenZeigen();
    });
  });
  app.querySelector("[data-neubloc]").addEventListener("click", function(){
    bkNeuFuer = { wk:wk.id, vor:bkBloecke().map(function(b){ return b.key; }) };
    go("#katalog"); katPlanNeu();
  });
  app.querySelector("[data-wbstart]").addEventListener("click", function(){ bkWkStart(wk); });
  app.querySelector("[data-fertig]").addEventListener("click", function(){ goBack("#training"); });
}

/* ---------- PLAN-Builder ---------- */
function bkPlanStart(p){
  var l = planEintraege(p);
  if(!l.length){ showToast(t("bkPlanLeerStart")); return; }
  l.forEach(function(e){ kalHinzu(e.tag, { art:e.art, ref:e.ref }); });
  p.usedAt = Date.now(); save();
  kalBasis = planStart(); kalAnsicht = "woche";
  showToast(t("planFertig", { n:l.length }));
  go("#kalender");
}
function renderPbau(id){
  var p;
  if(id === "neu"){
    p = { id:uid(), name:t("bkPlanDefault", { n:state.db.plaene.length + 1 }), wochen:6, tage:[0, 2, 4], wahl:{}, updatedAt:Date.now(), entwurf:true };
    state.db.plaene.push(p); save();
    navStack[navStack.length-1] = "#pbau/"+p.id; setUrl("#pbau/"+p.id);
  } else p = bkPlFind(id);
  if(!p){ goBack("#training"); return; }
  function aender(){ p.updatedAt = Date.now(); if(bkPlanAnzahl(p)) delete p.entwurf; save(); }
  function neu(){ var y = window.scrollY; renderPbau(p.id); window.scrollTo(0, y); }
  var lang = currentLang() === "en" ? "en-GB" : "de-DE", n = planEintraege(p).length;
  function namen(d){ return kalPlus(planStart(), d).toLocaleDateString(lang, { weekday:"short" }).replace(/\.$/, ""); }
  var datum = planStart().toLocaleDateString(lang, { day:"numeric", month:"long" }), tage = (p.tage || []).slice().sort(function(a, b){ return a - b; });
  app.innerHTML = topbar(t("bkPbTitel"), { back:"#training" })+
    '<div class="card bk-wb-kopf"><label for="pb-name">'+esc(t("bkWbName"))+'</label><input type="text" id="pb-name" value="'+esc(p.name)+'" maxlength="40"></div>'+
    '<div class="card kp-bau">'+
      '<div class="kp-titel">'+esc(t("planWochen"))+'</div>'+
      '<div class="kp-chips" role="group" aria-label="'+esc(t("planWochen"))+'">'+KP_WOCHEN.map(function(w){ return '<button type="button" class="kp-chip'+(p.wochen === w ? ' an' : '')+'" data-planwochen="'+w+'" aria-pressed="'+(p.wochen === w)+'">'+w+'</button>'; }).join("")+'</div>'+
      '<div class="kp-titel">'+esc(t("planTage"))+'</div>'+
      '<div class="kp-chips" role="group" aria-label="'+esc(t("planTage"))+'">'+[0, 1, 2, 3, 4, 5, 6].map(function(d){ var an = tage.indexOf(d) > -1; return '<button type="button" class="kp-chip'+(an ? ' an' : '')+'" data-plantag="'+d+'" aria-pressed="'+an+'">'+esc(namen(d))+'</button>'; }).join("")+'</div>'+
      (tage.length ? '<div class="kp-zeilen">'+tage.map(function(d){
        var l = planWahlListe(p.wahl[d]);
        return '<div class="kp-zeile"><span>'+esc(namen(d))+'</span><div class="kp-tag">'+
          l.map(function(v, i){ return '<span class="kp-wahl '+planWahlArt(v)+'"><i class="kv-p '+planWahlArt(v)+'"></i><b>'+esc(planWahlName(v))+'</b>'+
            '<button type="button" data-planweg="'+d+':'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></span>'; }).join("")+
          '<select data-planwahl="'+d+'" aria-label="'+esc(namen(d))+'">'+planOptionenHTML("", l.length ? t("planWeitere") : t("planWahlLeer"))+'</select></div></div>';
      }).join("")+'</div>' : '<div class="kp-leer">'+esc(t("planTageLeer"))+'</div>')+
    '</div>'+
    (tage.length ? '<div class="card kp-visk"><div class="kp-titel">'+esc(t("planVisTitel"))+'</div>'+planVisHTML(p, namen)+
      '<button type="button" class="btn btn-primary kp-ok" data-planok'+(n ? '' : ' disabled')+'>'+ICON_PLAY+' '+esc(t("start"))+'</button>'+
      '<div class="kp-fuss">'+esc(n ? t("planInfo", { n:n, datum:datum }) : t("planInfoLeer"))+'</div></div>' : '')+
    '<button type="button" class="btn btn-secondary" data-fertig>'+ICON_SAVE+' '+esc(t("bkFertig"))+'</button><div style="height:40px"></div>';
  bindCommon();
  var nm = app.querySelector("#pb-name");
  nm.addEventListener("input", function(){ p.name = nm.value.trim() || t("untitled"); p.updatedAt = Date.now(); save(); });
  app.querySelectorAll("[data-planwochen]").forEach(function(b){ b.addEventListener("click", function(){ p.wochen = +b.getAttribute("data-planwochen"); aender(); neu(); }); });
  app.querySelectorAll("[data-plantag]").forEach(function(b){
    b.addEventListener("click", function(){
      var d = +b.getAttribute("data-plantag"), i = p.tage.indexOf(d);
      if(i > -1) p.tage.splice(i, 1); else p.tage.push(d);
      aender(); neu();
    });
  });
  app.querySelectorAll("[data-planwahl]").forEach(function(sel){
    sel.addEventListener("change", function(){
      if(!sel.value) return;
      var d = sel.getAttribute("data-planwahl"), l = planWahlListe(p.wahl[d]);
      l.push(sel.value); p.wahl[d] = l; aender(); neu();
    });
  });
  app.querySelectorAll("[data-planweg]").forEach(function(b){
    b.addEventListener("click", function(){
      var a = b.getAttribute("data-planweg").split(":"), l = planWahlListe(p.wahl[a[0]]);
      l.splice(+a[1], 1); p.wahl[a[0]] = l; aender(); neu();
    });
  });
  var ok = app.querySelector("[data-planok]");
  if(ok) ok.addEventListener("click", function(){ bkPlanStart(p); });
  app.querySelector("[data-fertig]").addEventListener("click", function(){ goBack("#training"); });
}
