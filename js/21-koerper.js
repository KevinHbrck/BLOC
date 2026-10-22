"use strict";
/* ============ Arena: Trainingspläne · Fortschritt (dritter Reiter der unteren Leiste) ============
   Zwei Seiten unter einem Reiter (die Wahl merkt sich settings.koerperTab):
   - Trainingspläne: Einträge, die der Reihe nach abgearbeitet werden. Ein Trainingsplan hat einen Namen, eine Liste von Einträgen (nur aus Vorhandenem: BLOCs,
     Favoriten, Workouts aus dem Katalog; Rubriken Mobility, Workout, Run, Stretch) und einen Wochenplan (Wochentage + 4/6/8/12 Wochen), der als normale
     Kalender-Einträge übernommen wird. Gespeichert wird settings.programme = [{ id, name, items:["my:ID" | "lib:ID" | "plan:ID" | "run" | "zufall"],
     tage:[0-6], wochen, pos, fav, updatedAt }]; pos = nächster Eintrag. Die Karten stehen zugeklappt; Kopieren · Teilen · Löschen per langem Drücken.
   - Fortschritt: die Statistik (renderStats).
   Alles bleibt auf dem Gerät. */
var KP_WOCHEN = [4, 6, 8, 12];
var PG_RUBRIKEN = ["mobility", "workout", "run", "stretch"];
var pgOffen = {};   // aufgeklappte Karten und Wochenpläne (nur für diesen Besuch)

function koerperTab(){
  return state.db.settings.koerperTab === "fortschritt" ? "fortschritt" : "programm";   // früher „plan“ und „uebungen“ führen zu den Trainingsplänen
}
function koerperSegHTML(){
  function b(k, label){ return '<button type="button" data-koerpertab="'+k+'" class="'+(koerperTab() === k ? 'active' : '')+'" aria-pressed="'+(koerperTab() === k)+'">'+esc(label)+'</button>'; }
  return '<div class="rz koerper-rz" role="group">'+b("programm", t("arenaProgramm"))+b("fortschritt", t("arenaFortschritt"))+'</div>';
}
function renderKoerper(){
  if(koerperTab() === "fortschritt") renderStats(); else renderProgramme();
  var tb = app.querySelector(".topbar");
  if(tb){ tb.insertAdjacentHTML("afterend", koerperSegHTML()); var bk = tb.querySelector(".back"); if(bk) bk.classList.add("zeigen"); }   // Zurück-Knopf auch in der Arena (wie Training und Kalender)
  app.querySelectorAll("[data-koerpertab]").forEach(function(b){
    b.addEventListener("click", function(){ state.db.settings.koerperTab = b.getAttribute("data-koerpertab"); save(); tabLeiste("koerper"); renderKoerper(); window.scrollTo(0, 0); });
  });
}

/* ---------- Daten ---------- */
/* Der frühere „Plan“ (Wochentage mit Workouts, settings.planBau) wird beim ersten Öffnen zum ersten Trainingsplan; der alte Eintrag bleibt unberührt liegen */
function programmAusAltPlan(){
  var b = state.db.settings.planBau, out = [];
  if(!b || typeof b !== "object" || !b.wahl || !Array.isArray(b.tage)) return out;
  var items = [], tage = [];
  b.tage.slice().sort(function(x, y){ return x - y; }).forEach(function(d){
    var l = Array.isArray(b.wahl[d]) ? b.wahl[d].filter(Boolean) : (b.wahl[d] ? [b.wahl[d]] : []);
    if(l.length){ tage.push(d); items = items.concat(l); }
  });
  if(items.length) out.push({ id:uid(), name:t("progName", { n:1 }), items:items, tage:tage, wochen:KP_WOCHEN.indexOf(b.wochen) > -1 ? b.wochen : 6, pos:0, updatedAt:Date.now() });
  return out;
}
function programmListe(){
  var s = state.db.settings;
  if(!Array.isArray(s.programme)){ s.programme = programmAusAltPlan(); save(); }
  return s.programme;
}
function programmFinde(id){ var l = programmListe(); for(var i = 0; i < l.length; i++) if(l[i].id === id) return l[i]; return null; }
function programmNeu(){
  var l = programmListe(), p = { id:uid(), name:t("progName", { n:l.length + 1 }), items:[], tage:[0, 2, 4], wochen:6, pos:0, updatedAt:Date.now() };
  l.push(p); save();
  pgOffen[p.id] = true;
  return p;
}
/* Eintrag eines Trainingsplans (ref) als Kalender-Eintrag: „my:“ eigenes Workout, „lib:“ Katalog, „plan:“ BLOC (Nach Sätzen), „run“, „zufall“ */
function progEintrag(ref){
  ref = String(ref || "");
  if(ref.indexOf("my:") === 0) return { art:"workout", ref:ref.slice(3) };
  if(ref.indexOf("lib:") === 0) return { art:"lib", ref:ref.slice(4) };
  if(ref.indexOf("plan:") === 0) return { art:"plan", ref:ref.slice(5) };
  if(ref === "run") return { art:"run" };
  return { art:"zufall" };
}
function progTagName(d){   // 0 = Montag
  return new Date(2024, 0, 1 + d, 12).toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { weekday:"short" }).replace(/\.$/, "");
}
function progSortiert(){
  return programmListe().map(function(p, i){ return { p:p, i:i }; })
    .sort(function(a, b){ return (b.p.fav ? 1 : 0) - (a.p.fav ? 1 : 0) || a.i - b.i; }).map(function(x){ return x.p; });
}
/* Wochenplan in den Kalender: ab heute, an den gewählten Wochentagen, der Reihe nach durch die Einträge (bei mehr Einträgen als Tagen geht es in der
   nächsten Woche weiter). Frühere, noch nicht erledigte Termine dieses Trainingsplans ab heute werden dabei ersetzt. */
function programmUebernehmen(p){
  var n = p.items.length;
  if(!n || !p.tage.length) return 0;
  var heute = kalTagKey(Date.now()), start = new Date(); start.setHours(12, 0, 0, 0);
  state.db.settings.kalender = { e:kalListe().filter(function(e){ return !(e.prog && e.prog.id === p.id && e.tag >= heute && e.erledigt !== true); }) };
  var idx = p.pos || 0, anzahl = 0;
  for(var d = 0; d < p.wochen*7; d++){
    var tag = kalPlus(start, d);
    if(p.tage.indexOf((tag.getDay() + 6) % 7) < 0) continue;
    var i = idx % n, o = progEintrag(p.items[i]), e = kalHinzu(kalTagKey(tag), { art:o.art, ref:o.ref });
    e.prog = { id:p.id, i:i };
    idx++; anzahl++;
  }
  save();
  return anzahl;
}
/* „Weiter mit …“ nach einem erledigten Eintrag: der Trainingsplan, in dem er vorkommt (heutiger Termin zuerst, dann Favoriten), und der nächste Eintrag darin */
var progKontext = null;   // { pid, i }: der Trainingsplan, aus dem das laufende Training gestartet wurde (Karte, „Weiter mit …“, Kalender-Termin, Hauptknopf)
function programmStarten(p, i){
  if(!p || !p.items[i]) return;
  var o = progEintrag(p.items[i]);
  if(!kalAufloesen(o).ok) return;
  p.pos = i; save();
  progKontext = { pid:p.id, i:i };
  progDirektStarten(o);
}
/* Antippen eines Eintrags: die Karte öffnet sich im Kontext der Arena (BLOC mit Sätzen, Wiederholungen, Zeit/Sätze-Wahl und LOS GEHTS; Workouts mit dem Deckblatt);
   Änderungen dort gelten für den BLOC bzw. das Workout selbst. Zurück führt in die Arena. Das kleine '�� startet dagegen gleich. */
function programmOeffnen(p, i){
  if(!p || !p.items[i]) return;
  var o = progEintrag(p.items[i]);
  if(!kalAufloesen(o).ok) return;
  p.pos = i; save();
  progKontext = { pid:p.id, i:i };
  if(o.art === "plan"){
    var pl = stPlanFind(o.ref);
    if(pl){ stPlanHerkunft = "#koerper"; stPlanAktiv = pl.id; stPlanBauen = false; stPlanQuery = ""; stPlanSel = -1; katZuMeine(); go("#katalog"); return; }
  } else if(o.art === "workout"){ coverDraft = null; go("#cover/my/"+o.ref); return; }
  else if(o.art === "lib"){ coverDraft = null; go("#cover/lib/"+o.ref); return; }
  progDirektStarten(o);
}
/* Ein Eintrag eines Trainingsplans startet gleich (ohne Deckblatt, ohne Umweg über Workout › BLOCs): BLOC als Timer oder Satz-Training, Workouts direkt, Run und Zufall wie im Kalender */
function progDirektStarten(o){
  if(o.art === "plan"){
    var pl = stPlanFind(o.ref);
    if(pl && stPlanIds(pl).length){ if(planStartArt(pl) === "timer") planAlsWorkout(pl, true); else go("#satz/"+pl.id+"/0"); return; }
  } else if(o.art === "workout"){ go("#playmy/"+o.ref); return; }
  else if(o.art === "lib"){ go("#playlib/"+o.ref); return; }
  kalStarten(o);
}
/* Gehört ref zum Eintrag? Gleich, oder ref ist ein BLOC (plan:), der aus diesem Workout entstanden ist (Train by sets auf dem Deckblatt) */
function progRefPasst(eintrag, ref){
  if(eintrag === ref) return true;
  if(String(ref).indexOf('plan:') === 0){ var pl = stPlanFind(ref.slice(5)); return !!(pl && pl.fromWo && pl.fromWo === eintrag); }
  return false;
}
/* Läuft gerade ein Eintrag eines Trainingsplans? Dann { p, i } (nur wenn ref zum gemerkten Eintrag passt) */
function programmKontextFuer(ref){
  if(!progKontext || !ref) return null;
  var p = programmFinde(progKontext.pid);
  return p && progRefPasst(p.items[progKontext.i], ref) ? { p:p, i:progKontext.i } : null;
}
/* Kleine Zeile im Training: „Trainingsplan · Name · 2/3“; Antippen zeigt die Einträge zum Wechseln */
function progChipHTML(ref){
  var k = programmKontextFuer(ref);
  if(!k) return "";
  return '<button type="button" class="pl-prog" data-plprog>'+svgIcon('<ellipse cx="12" cy="12" rx="9" ry="6.5"/><ellipse cx="12" cy="12" rx="4.2" ry="2.5"/>')+'<span>'+esc(k.p.name)+' · '+(k.i + 1)+'/'+k.p.items.length+'</span></button>';
}
function progChipBinden(box, ref, vorher){
  var b = box.querySelector("[data-plprog]"), k = programmKontextFuer(ref);
  if(!b || !k) return;
  b.addEventListener("click", function(){
    openActionSheet(k.p.name, k.p.items.map(function(r, j){
      return { ico:j === k.i ? P_CHECK : P_PLAY, label:(j + 1)+". "+kalAufloesen(progEintrag(r)).name, fn:function(){ if(j === k.i) return; if(vorher) vorher(); programmStarten(k.p, j); } };
    }));
  });
}
function programmWeiter(ref){
  var heute = kalTagKey(Date.now()), best = null, bi = -1;
  var kx = programmKontextFuer(ref);
  if(kx){ best = kx.p; bi = kx.i; }
  if(!best) kalAn(heute).forEach(function(e){
    if(best || !e.prog) return;
    var p = programmFinde(e.prog.id);
    if(p && p.items[e.prog.i] === ref){ best = p; bi = e.prog.i; }
  });
  if(!best) progSortiert().forEach(function(p){
    if(best) return;
    var i = p.items.indexOf(ref);
    if(i > -1){ best = p; bi = i; }
  });
  if(!best) return null;
  best.pos = (bi + 1) % best.items.length; save();
  if(bi + 1 >= best.items.length) return null;
  var next = best.items[bi + 1], o = kalAufloesen(progEintrag(next));
  var bp = best, bn = bi + 1;
  return o.ok ? { name:o.name, ref:next, start:function(){ programmStarten(bp, bn); } } : null;
}
/* Quelle eines gerade beendeten Trainings als Eintrag: BLOC („plan:“), eigenes Workout („my:“) oder Katalog („lib:“) */
function programmRefAusQuelle(src){
  if(!src) return "";
  if(src.type === "mine"){ var mw = findMy(src.id); return mw ? (mw.fromPlan ? "plan:"+mw.fromPlan : "my:"+src.id) : ""; }
  if(src.type === "libworkout") return "lib:"+src.id;
  return "";
}
/* Der runde Hauptknopf auf Heute: ein Eintrag aus einem Trainingsplan, dessen Wochentage auf heute fallen (ohne Kalender-Termin) */
function programmHeute(){
  var wt = (new Date().getDay() + 6) % 7, p = null;
  progSortiert().forEach(function(x){ if(!p && x.items.length && x.tage.indexOf(wt) > -1) p = x; });
  if(!p) return null;
  var i = (p.pos || 0) % p.items.length;
  return { p:p, i:i, ref:p.items[i] };
}

/* ---------- Trainingspläne ---------- */
var PG_ICON_PFEIL = '<path d="M7 10l5 5 5-5"/>';
function progZeileHTML(p, ref, i){
  var o = kalAufloesen(progEintrag(ref));
  return '<li class="pg-eintrag'+(o.ok ? '' : ' fehlt')+'" style="--kc:'+o.farbe+'" data-pgz="'+esc(p.id)+':'+i+'" role="button" tabindex="0">'+
    '<i class="pg-nr">'+(i + 1)+'</i><span class="pg-text"><b>'+esc(o.name)+'</b><small>'+esc(o.ok ? o.sub : t("kalFehlt"))+'</small></span>'+
    '<span class="pg-los" aria-hidden="true">'+svgIcon(P_PLAY)+'</span></li>';
}
function progKarteHTML(p){
  var offen = !!pgOffen[p.id], tage = p.tage.slice().sort(function(a, b){ return a - b; });
  var farben = p.items.slice(0, 4).map(function(r){ return '<i style="background:'+kalAufloesen(progEintrag(r)).farbe+'"></i>'; }).join("");
  return '<details class="pg-karte" data-pg="'+esc(p.id)+'"'+(offen ? ' open' : '')+'><summary>'+
      '<span class="pg-farben" aria-hidden="true">'+(farben || '<i></i>')+'</span>'+
      '<span class="pg-kt"><b>'+esc(p.name)+'</b><small>'+esc((p.items.length === 1 ? t("progMeta1") : t("progMeta", { n:p.items.length }))+(tage.length ? " · "+tage.map(progTagName).join(" ") : ""))+'</small></span>'+
      '<button type="button" class="fav-btn'+(p.fav ? ' on' : '')+'" data-pgfav="'+esc(p.id)+'" aria-pressed="'+(!!p.fav)+'" title="'+esc(t("favorite"))+'" aria-label="'+esc(t("favorite"))+'">'+(p.fav ? '★' : '☆')+'</button>'+
      '<span class="pg-pfeil" aria-hidden="true">'+svgIcon(PG_ICON_PFEIL)+'</span></summary>'+
    '<div class="pg-innen">'+
      (p.items.length ? '<button type="button" class="btn btn-primary pg-go" data-pggo="'+esc(p.id)+'">'+ICON_PLAY+' '+esc(t("letsGoBig"))+'</button>' : '')+
      (p.items.length ? '<ol class="pg-liste">'+p.items.map(function(r, i){ return progZeileHTML(p, r, i); }).join("")+'</ol>' : '')+
      '<button type="button" class="pg-plus" data-pgplus="'+esc(p.id)+'">'+ICON_PLUS+'<span>'+esc(t("progPlus"))+'</span></button>'+
      '<details class="pg-woche" data-pgwoche="'+esc(p.id)+'"'+(pgOffen["w"+p.id] ? ' open' : '')+'><summary><span>'+esc(t("progWochenplan"))+'</span><small>'+
        esc(t("progWochenN", { n:p.wochen }))+'</small><span class="pg-pfeil" aria-hidden="true">'+svgIcon(PG_ICON_PFEIL)+'</span></summary>'+
        '<div class="kp-chips" role="group" aria-label="'+esc(t("progTage"))+'">'+[0, 1, 2, 3, 4, 5, 6].map(function(d){
          var an = p.tage.indexOf(d) > -1;
          return '<button type="button" class="kp-chip'+(an ? ' an' : '')+'" data-pgtag="'+esc(p.id)+':'+d+'" aria-pressed="'+an+'">'+esc(progTagName(d))+'</button>'; }).join("")+'</div>'+
        '<div class="kp-chips" role="group" aria-label="'+esc(t("planWochen"))+'">'+KP_WOCHEN.map(function(w){
          return '<button type="button" class="kp-chip'+(p.wochen === w ? ' an' : '')+'" data-pgwochen="'+esc(p.id)+':'+w+'" aria-pressed="'+(p.wochen === w)+'">'+esc(t("progWochenN", { n:w }))+'</button>'; }).join("")+'</div>'+
        '<button type="button" class="btn btn-primary kp-ok" data-pgok="'+esc(p.id)+'"'+(p.items.length && p.tage.length ? '' : ' disabled')+'>'+esc(t("progUebernehmen"))+'</button></details>'+
    '</div></details>';
}
function renderProgramme(){
  var liste = progSortiert();
  app.innerHTML =
    topbar(t("tabKoerper"), { back:"#home", right:kopfSymboleNeu("stats") }) +
    (liste.length ? '<div class="pg-liste-karten">'+liste.map(progKarteHTML).join("")+'</div>' : '<div class="pg-leerseite">'+svgIcon('<ellipse cx="12" cy="12" rx="9" ry="6.5"/><ellipse cx="12" cy="12" rx="4.2" ry="2.5"/>')+'<p>'+esc(t("progLeer"))+'</p></div>')+
    '<button type="button" class="btn btn-primary pg-neu" data-pgneu>'+ICON_PLUS+' '+esc(t("progNeu"))+'</button>'+
    '<div style="height:90px"></div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderKoerper(); window.scrollTo(0, y); }
  function teile(v){ var a = v.split(":"); return { p:programmFinde(a[0]), n:+a[1] }; }
  app.querySelectorAll("[data-pgneu]").forEach(function(b){ b.addEventListener("click", function(){ programmNeu(); renderKoerper(); window.scrollTo(0, 0); }); });
  app.querySelectorAll("[data-pgfav]").forEach(function(b){ b.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); var p = programmFinde(b.getAttribute("data-pgfav")); if(!p) return; p.fav = !p.fav; save(); showToast(t(p.fav ? "favAdded" : "favRemoved")); neu(); }); });
  app.querySelectorAll("[data-pgplus]").forEach(function(b){ b.addEventListener("click", function(){ var p = programmFinde(b.getAttribute("data-pgplus")); if(p) openProgrammWahl(p, neu); }); });
  app.querySelectorAll("[data-pggo]").forEach(function(b){ b.addEventListener("click", function(){ var p = programmFinde(b.getAttribute("data-pggo")); if(p) programmOeffnen(p, (p.pos || 0) % p.items.length); }); });
  // Karten und Wochenpläne: Antippen klappt auf/zu (selbst umgeschaltet, damit der Zustand beim Neuzeichnen bleibt)
  app.querySelectorAll("details.pg-karte > summary").forEach(function(sm){
    sm.addEventListener("click", function(e){ e.preventDefault(); var d = sm.parentNode; d.open = !d.open; pgOffen[d.getAttribute("data-pg")] = d.open; });
  });
  app.querySelectorAll("details.pg-woche > summary").forEach(function(sm){
    sm.addEventListener("click", function(e){ e.preventDefault(); var d = sm.parentNode; d.open = !d.open; pgOffen["w"+d.getAttribute("data-pgwoche")] = d.open; });
  });
  // Eintrag: Antippen startet ihn, langes Drücken: nach oben · nach unten · entfernen
  app.querySelectorAll("[data-pgz]").forEach(function(el){
    var x = teile(el.getAttribute("data-pgz")); if(!x.p) return;
    el.addEventListener("click", function(){
      if(Date.now() < langDruckSperre) return;
      programmOeffnen(x.p, x.n);
    });
    langDruck(el, function(){
      var acts = [];
      if(x.n > 0) acts.push({ ico:'<path d="M12 19V5M6 11l6-6 6 6"/>', label:t("moveUp"), fn:function(){ var a = x.p.items.splice(x.n, 1)[0]; x.p.items.splice(x.n - 1, 0, a); save(); neu(); } });
      if(x.n < x.p.items.length - 1) acts.push({ ico:'<path d="M12 5v14M6 13l6 6 6-6"/>', label:t("moveDown"), fn:function(){ var a = x.p.items.splice(x.n, 1)[0]; x.p.items.splice(x.n + 1, 0, a); save(); neu(); } });
      acts.push({ ico:P_TRASH, label:t("del"), danger:true, fn:function(){ x.p.items.splice(x.n, 1); x.p.pos = 0; x.p.updatedAt = Date.now(); save(); neu(); } });
      openActionSheet(kalAufloesen(progEintrag(x.p.items[x.n])).name, acts);
    });
  });
  app.querySelectorAll("[data-pgtag]").forEach(function(b){ b.addEventListener("click", function(){
    var x = teile(b.getAttribute("data-pgtag")); if(!x.p) return;
    var i = x.p.tage.indexOf(x.n); if(i > -1) x.p.tage.splice(i, 1); else x.p.tage.push(x.n);
    x.p.updatedAt = Date.now(); save(); pgOffen[x.p.id] = true; pgOffen["w"+x.p.id] = true; neu();
  }); });
  app.querySelectorAll("[data-pgwochen]").forEach(function(b){ b.addEventListener("click", function(){ var x = teile(b.getAttribute("data-pgwochen")); if(!x.p) return; x.p.wochen = x.n; x.p.updatedAt = Date.now(); save(); pgOffen[x.p.id] = true; pgOffen["w"+x.p.id] = true; neu(); }); });
  app.querySelectorAll("[data-pgok]").forEach(function(b){ b.addEventListener("click", function(){
    var p = programmFinde(b.getAttribute("data-pgok")); if(!p) return;
    if(!p.tage.length){ showToast(t("progKeinTag")); return; }
    var n = programmUebernehmen(p);
    if(!n) return;
    kalBasis = null; kalAnsicht = "woche"; showToast(t("progUebernommen", { n:n }));
    go("#kalender");
  }); });
  // langes Drücken auf eine Karte: Kopieren · Teilen · Löschen (sichtbar bleibt nur der Stern)
  app.querySelectorAll("summary").forEach(function(sm){
    var el = sm.parentNode;
    if(!el.getAttribute || !el.classList.contains("pg-karte")) return;
    var p = programmFinde(el.getAttribute("data-pg"));
    if(p) langDruck(sm, function(){ programmMenue(p, neu); });
  });
}
/* Umbenennen per langem Drücken (Trainingsplan, BLOC, eigenes Workout): kleines Fenster mit Namensfeld */
function umbenennenSheet(alt, fn){
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet" role="dialog" aria-label="' + esc(t("umbenennen")) + '"><h3>' + esc(t("umbenennen")) + '</h3>' +
    '<input type="text" id="umb-name" maxlength="60" value="' + esc(alt) + '"><div class="btn-row"><button class="btn btn-secondary" data-cancel>' + esc(t("cancel")) + '</button>' +
    '<button class="btn btn-primary" data-ok>' + esc(t("save")) + '</button></div></div></div>';
  function zu(){ root.innerHTML = ""; }
  var inp = root.querySelector("#umb-name"); inp.focus(); inp.select();
  function ok(){ var v = inp.value.trim(); zu(); if(v && v !== alt) fn(v); }
  root.querySelector("[data-cancel]").addEventListener("click", zu);
  root.querySelector("[data-ok]").addEventListener("click", ok);
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); ok(); } });
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) zu(); });
}function programmText(p){
  return p.name+"\n"+p.items.map(function(r, i){ var o = kalAufloesen(progEintrag(r)); return (i + 1)+". "+o.name; }).join("\n");
}
function programmMenue(p, neu){
  openActionSheet(p.name, [
    { ico:ICON_EDIT, label:t("umbenennen"), fn:function(){ umbenennenSheet(p.name, function(v){ p.name = v; p.updatedAt = Date.now(); save(); neu(); }); } },
    { ico:P_SHARE, label:t("share"), fn:function(){
      var text = programmText(p);
      if(navigator.share) navigator.share({ title:p.name, text:text }).catch(function(err){ if(!err || err.name !== "AbortError") copyText(text, t("shareLinkCopied")); });
      else copyText(text, t("shareLinkCopied"));
    } },
    { ico:ICON_COPY, label:t("actCopy"), fn:function(){
      var q = JSON.parse(JSON.stringify(p)); q.id = uid(); q.name = t("planKopieName", { n:p.name }); q.fav = false; q.updatedAt = Date.now();
      programmListe().push(q); save(); showToast(t("planKopiert", { n:q.name })); neu();
    } },
    { ico:P_TRASH, label:t("del"), danger:true, fn:function(){
      confirmSheet(t("progDelQ"), "„"+p.name+"“ – "+t("cantUndo"), t("del"), function(){
        state.db.settings.programme = programmListe().filter(function(x){ return x.id !== p.id; }); save(); neu();
        showToast(t("deletedToast", { n:p.name }));
      });
    } }
  ]);
}
var P_SHARE = '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/>';

/* ---------- „Hinzufügen“: nur aus Vorhandenem wählen - oben die Rubrik (Mobility · Workout · Run · Stretch), darunter Favoriten · BLOCs · Katalog ---------- */
function pgWsArt(ref){   // „warm“ | „dehn“ | „“ (Workout) eines Eintrags
  if(ref.indexOf("my:") === 0){ var mw = findMy(ref.slice(3)); return mw && mw.ws ? mw.ws : ""; }
  if(ref.indexOf("lib:") === 0){ var lw = findLibWorkout(ref.slice(4)); return lw && libIstWarmDehn(lw) ? (AUFWAERM_IDS.indexOf(lw.id) > -1 ? "warm" : "dehn") : ""; }
  return "";
}
function pgListen(rub){
  var ws = rub === "mobility" ? "warm" : rub === "stretch" ? "dehn" : "";
  function passt(ref){ return pgWsArt(ref) === ws; }
  var favs = (state.db.settings.favs || []).filter(function(k){ return /^(my|lib|plan):/.test(k) && kalAufloesen(progEintrag(k)).ok && passt(k); });
  var blocs = [];
  if(rub === "workout") stPlaene().forEach(function(p){ if(!p.entwurf && stPlanIds(p).length) blocs.push("plan:"+p.id); });
  (state.db.myWorkouts || []).map(normMy).forEach(function(mw){ if(mw.items.length && passt("my:"+mw.id)) blocs.push("my:"+mw.id); });
  var katalog = [];   // [{ name, ico, refs }]
  if(rub === "workout"){
    var je = {};
    LIB_WORKOUTS.forEach(function(lw){
      if(libIstWarmDehn(lw) || libHidden("wo:"+lw.id)) return;
      var b = katWoBereich(lw, lw.exercises.map(findExercise).filter(Boolean));
      (je[b] = je[b] || []).push("lib:"+lw.id);
    });
    KAT_WO_BEREICHE.forEach(function(b){
      if(je[b]) katalog.push({ name:b === "ganz" ? t("katGanz") : t(KAT_GRUPPEN.filter(function(g){ return g.id === b; })[0].key), ico:b === "ganz" ? HOME_ICON.katalog : katIcon(b), refs:je[b] });
    });
  } else if(ws){
    var wos = ws === "warm" ? AUFWAERM_IDS.map(findLibWorkout).filter(Boolean) : LIB_WORKOUTS.filter(function(lw){ return lw.focus === "stretch" && AUFWAERM_IDS.indexOf(lw.id) < 0; });
    var refs = wos.filter(function(lw){ return !libHidden("wo:"+lw.id); }).map(function(lw){ return "lib:"+lw.id; });
    if(refs.length) katalog.push({ name:t("katTabKatalog"), ico:HOME_ICON.warm, refs:refs });
  }
  return { favs:favs, blocs:blocs, katalog:katalog };
}
/* Übungen hinter einem Eintrag: höchstens sechs als kleine bewegte Figuren, der Rest als „+n“ */
function pgUebungen(ref){
  if(ref.indexOf("plan:") === 0){ var p = stPlanFind(ref.slice(5)); return p ? stPlanIds(p) : []; }
  if(ref.indexOf("my:") === 0){ var mw = findMy(ref.slice(3)); return mw ? normMy(mw).items.map(function(it){ return it.ex; }) : []; }
  if(ref.indexOf("lib:") === 0){ var lw = findLibWorkout(ref.slice(4)); return lw ? lw.exercises : []; }
  return [];
}
function pgFiguren(ref){
  var ids = pgUebungen(ref).filter(function(id){ return ILLU[id]; }), h = ids.slice(0, 6).map(function(id){ return illuHTML(id, "pg-fig"); }).join("");
  return h + (ids.length > 6 ? '<i class="pg-mehr">+'+(ids.length - 6)+'</i>' : '');
}
function openProgrammWahl(p, neu){
  var root = document.getElementById("overlayRoot"), rub = "workout";
  function zu(){ root.innerHTML = ""; }
  var offenSek = {};   // Favoriten · BLOCs · Katalog stehen zunächst zugeklappt
  function ortFarbe(ref){   // Fitnessstudio rot, Freiluft blau (wie im Katalog)
    var ids = pgUebungen(ref);
    if(!ids.length) return "";
    var s = ids.map(findExercise).filter(Boolean).filter(exIstStudio).length;
    return s*2 >= ids.length ? "var(--gym-color)" : "var(--tp-color)";
  }
  function opt(ref){
    var o = kalAufloesen(progEintrag(ref)), oc = ortFarbe(ref);
    return '<button type="button" class="bloc-opt" data-pgpick="'+esc(ref)+'"'+(oc ? ' style="--oc:'+oc+'"' : '')+'><span><b>'+esc(o.name)+'</b><small>'+esc(o.sub)+'</small><span class="pg-figs" data-pgf="'+esc(ref)+'"></span></span></button>';
  }
  function abschnitt(key, titel, n, inhalt){
    return n ? '<details class="pg-sek" data-pgsek="'+key+'"'+(offenSek[key] ? ' open' : '')+'><summary><b>'+esc(titel)+'</b><span class="lbl-hint">'+n+'</span><span class="pg-pfeil" aria-hidden="true">'+svgIcon(PG_ICON_PFEIL)+'</span></summary>'+inhalt+'</details>' : '';
  }
  function draw(){
    var sc = root.querySelector(".bloc-sheet"), y = sc ? sc.scrollTop : 0, l = pgListen(rub), html = "";
    if(rub === "run") html = opt("run");
    else {
      html += abschnitt("fav", t("pgFav"), l.favs.length, l.favs.map(opt).join(""));
      html += abschnitt("bloc", t("pgBlocs"), l.blocs.length, l.blocs.map(opt).join(""));
      html += abschnitt("kat", t("bauKatalog"), l.katalog.length, l.katalog.map(function(g){
        var gym = g.refs.length > 0 && g.refs.every(function(r){ return ortFarbe(r) === "var(--gym-color)"; });   // nur Fitnessstudio: farbiges Symbol wie im Katalog
        return katZeileHTML("pgk-"+rub+"-"+g.name, g.ico, g.name, g.refs.length, '<div class="kat-inhalt">'+g.refs.map(opt).join("")+'</div>', false, "", gym); }).join(""));
      if(rub === "workout") html += opt("zufall");
      if(!l.favs.length && !l.blocs.length && !l.katalog.length) html = '<div class="pg-leer">'+esc(t("pgNichts"))+'</div>';
    }
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet bloc-sheet" role="dialog" aria-label="'+esc(t("progPlus"))+'"><h3>'+esc(t("progPlus"))+'</h3>'+
      '<div class="pg-rub" role="group">'+PG_RUBRIKEN.map(function(r){ return '<button type="button" data-pgrub="'+r+'" class="'+(rub === r ? 'active' : '')+'" aria-pressed="'+(rub === r)+'">'+esc(t("pgRub_"+r))+'</button>'; }).join("")+'</div>'+
      html+'<div class="btn-row"><button class="btn btn-secondary" data-cancel>'+esc(t("cancel"))+'</button></div></div></div>';
    var neuSc = root.querySelector(".bloc-sheet"); if(neuSc) neuSc.scrollTop = y;
    root.querySelector("[data-cancel]").addEventListener("click", zu);
    root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) zu(); });
    // kleine bewegte Figuren der Übungen: erst füllen, wenn die Zeile zu sehen ist (zugeklappte Bereiche beim Aufklappen)
    function fuellen(box){ box.querySelectorAll(".pg-figs:not([data-fertig])").forEach(function(el){ if(el.closest("details:not([open])")) return; el.setAttribute("data-fertig", "1"); el.innerHTML = pgFiguren(el.getAttribute("data-pgf")); }); }
    fuellen(root);
    root.querySelectorAll("details").forEach(function(dt){ dt.addEventListener("toggle", function(){ if(dt.hasAttribute("data-pgsek")) offenSek[dt.getAttribute("data-pgsek")] = dt.open; if(dt.open) fuellen(dt); }); });
    root.querySelectorAll("[data-pgrub]").forEach(function(b){ b.addEventListener("click", function(){ rub = b.getAttribute("data-pgrub"); draw(); }); });
    root.querySelectorAll("[data-pgpick]").forEach(function(b){ b.addEventListener("click", function(){
      p.items.push(b.getAttribute("data-pgpick")); p.updatedAt = Date.now(); pgOffen[p.id] = true; save(); zu(); neu();
    }); });
  }
  draw();
}

/* ---------- Langes Drücken auf BLOCs und eigene Workouts: Kopieren · Teilen · Löschen (sichtbar bleibt nur der Stern) ---------- */
function myKopie(mw){
  var q = JSON.parse(JSON.stringify(mw));
  q.id = uid(); q.name = t("planKopieName", { n:mw.name }); q.updatedAt = Date.now(); delete q.fromPlan;
  state.db.myWorkouts.push(q); save();
  return q;
}
function blocMenueBinden(neu){
  function menue(titel, kopie, teilen, el, umb){
    openActionSheet(titel, [
      { ico:ICON_EDIT, label:t("umbenennen"), fn:function(){ umbenennenSheet(titel, function(v){ umb(v); save(); neu(); }); } },
      { ico:ICON_COPY, label:t("actCopy"), fn:function(){ var q = kopie(); showToast(t("planKopiert", { n:q.name })); neu(); } },
      { ico:P_SHARE, label:t("share"), fn:teilen },
      { ico:P_TRASH, label:t("del"), danger:true, fn:function(){ var d = el.querySelector("[data-del]"); if(d) d.click(); } }
    ]);
  }
  app.querySelectorAll(".plan-item[data-plan]").forEach(function(el){
    var p = stPlanFind(el.getAttribute("data-plan"));
    if(p) langDruck(el, function(){ menue(p.name, function(){ return planKopie(p); }, function(){ shareDraft(draftFromMy(planMw(p))); }, el, function(v){ p.name = v; p.updatedAt = Date.now(); }); });
  });
  app.querySelectorAll(".my-item[data-cover]").forEach(function(el){
    var mw = findMy(el.getAttribute("data-cover").replace(/^my\//, ""));
    if(mw) langDruck(el, function(){ menue(mw.name, function(){ return myKopie(mw); }, function(){ shareDraft(draftFromMy(normMy(mw))); }, el, function(v){ mw.name = v; mw.updatedAt = Date.now(); }); });
  });
}
