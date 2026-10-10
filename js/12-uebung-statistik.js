"use strict";
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
/* Air (lib) und Studio (timer) sind seit dem Workout-Bereich eine Karte; gespeichert wird weiter getrennt, die Statistik fasst beim Anzeigen zusammen */
function statGruppe(k){ return k === "lib" || k === "timer" ? "katalog" : k; }
function statGruppen(keys){ var out = []; keys.forEach(function(k){ var g = statGruppe(k); if(out.indexOf(g) < 0) out.push(g); }); return out; }
/* Ein „Besuch“ (= ein Training): alle Timer-Einträge, zwischen denen höchstens BESUCH_LUECKE liegt; die Zeit läuft vom ersten Start bis zum Ende des letzten.
   Spanne eines Eintrags: Studio und Run speichern den Start (at), Air, Summit und Mobility das Ende. Läufe zählen immer einzeln. */
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
    Object.keys(ar).forEach(function(b){ if(aktiv.indexOf(b) > -1){ var g = statGruppe(b), x = w.a[g] || (w.a[g] = { n:0, s:0 }); x.n += ar[b].n || 0; x.s += ar[b].s || 0; } });
    if(ohneRun && src.bn != null){   // archivierte Besuche (alle Bereiche außer Run zusammengefasst)
      w.n = src.bn; w.s = src.bs || 0;
      if(aktiv.indexOf("run") > -1 && ar.run){ w.n += ar.run.n || 0; w.s += ar.run.s || 0; }
    } else Object.keys(w.a).forEach(function(b){ w.n += w.a[b].n; w.s += w.a[b].s; });
    idx[key] = w; out.push(w);
  }
  var live = (state.db.history || []).filter(function(e){ return e && aktiv.indexOf(bereichVonEintrag(e)) > -1; });
  statGruppen(aktiv).forEach(function(k){
    besuche(live.filter(function(e){ return statGruppe(bereichVonEintrag(e)) === k; })).forEach(function(b){
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
  function eintraege(k, tage){ return hist.filter(function(e){ return statGruppe(bereichVonEintrag(e)) === k && e.at >= jetzt - tage*tag; }); }
  function bes(k, tage){ return besuche(hist.filter(function(e){ return statGruppe(bereichVonEintrag(e)) === k; })).filter(function(b){ return b.von >= jetzt - tage*tag; }); }
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
  var html = topbar(t("tabStats"), { back:"#home" });
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
  var folge = statGruppen(aktiv).map(function(k, i){ return { k:k, n:bes(k, 28).length, i:i }; }).sort(function(a, b){
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
    if(k === "katalog"){
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

/* (Rest der Verlauf-Logik steht in 12-uebung-statistik.js) */
