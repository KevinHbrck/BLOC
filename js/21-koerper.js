"use strict";
/* ============ Arena: Programm · Fortschritt · Meine Übungen (dritter Reiter der unteren Leiste) ============
   Drei Seiten unter einem Reiter (die Wahl merkt sich settings.koerperTab):
   - Programm: Trainingspläne, die der Reihe nach abgearbeitet werden. Ein Programm hat einen Namen, eine Liste von Einträgen (BLOCs, Favoriten, Workouts aus dem
     Katalog, Run, Mobility, Stretch) und einen Wochenplan (Wochentage + 4/6/8/12 Wochen), der als normale Kalender-Einträge übernommen wird. Gespeichert wird
     settings.programme = [{ id, name, items:["my:ID" | "lib:ID" | "plan:ID" | "run" | "zufall"], tage:[0-6], wochen, pos, fav, updatedAt }]; pos = nächster Eintrag.
   - Fortschritt: die Statistik (renderStats).
   - Meine Übungen: Favoriten und eigene Übungen aus Workout und Mobility & Stretch.
   Alles bleibt auf dem Gerät. */
var KP_WOCHEN = [4, 6, 8, 12];
var PG_RUBRIKEN = ["workout", "run", "mobility", "stretch"];
var pgOffen = {};   // aufgeklappte Wochenpläne (nur für diesen Besuch)

function koerperTab(){
  var k = state.db.settings.koerperTab;
  return k === "fortschritt" || k === "uebungen" ? k : "programm";   // früher „plan“ = Programm
}
function koerperSegHTML(){
  function b(k, label){ return '<button type="button" data-koerpertab="'+k+'" class="'+(koerperTab() === k ? 'active' : '')+'" aria-pressed="'+(koerperTab() === k)+'">'+esc(label)+'</button>'; }
  return '<div class="rz koerper-rz" role="group">'+b("programm", t("arenaProgramm"))+b("fortschritt", t("arenaFortschritt"))+b("uebungen", t("arenaUebungen"))+'</div>';
}
function renderKoerper(){
  var tab = koerperTab();
  if(tab === "fortschritt") renderStats();
  else if(tab === "uebungen") renderMeineUebungen();
  else renderProgramme();
  var tb = app.querySelector(".topbar");
  if(tb) tb.insertAdjacentHTML("afterend", koerperSegHTML());
  app.querySelectorAll("[data-koerpertab]").forEach(function(b){
    b.addEventListener("click", function(){ state.db.settings.koerperTab = b.getAttribute("data-koerpertab"); save(); renderKoerper(); window.scrollTo(0, 0); });
  });
}

/* ---------- Daten ---------- */
/* Der frühere „Plan“ (Wochentage mit Workouts, settings.planBau) wird beim ersten Öffnen zum ersten Programm; der alte Eintrag bleibt unberührt liegen */
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
/* Eintrag eines Programms (ref) als Kalender-Eintrag: „my:“ eigenes Workout, „lib:“ Katalog, „plan:“ BLOC (Nach Sätzen), „run“, „zufall“ */
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
   nächsten Woche weiter). Frühere, noch nicht erledigte Termine dieses Programms ab heute werden dabei ersetzt. */
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
/* „Weiter mit …“ nach einem erledigten Eintrag: das Programm, in dem er vorkommt (heutiger Termin zuerst, dann Favoriten), und der nächste Eintrag darin */
function programmWeiter(ref){
  var heute = kalTagKey(Date.now()), best = null, bi = -1;
  kalAn(heute).forEach(function(e){
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
  return o.ok ? { name:o.name, ref:next, start:function(){ kalStarten(progEintrag(next)); } } : null;
}
/* Quelle eines gerade beendeten Trainings als Eintrag: BLOC („plan:“), eigenes Workout („my:“) oder Katalog („lib:“) */
function programmRefAusQuelle(src){
  if(!src) return "";
  if(src.type === "mine"){ var mw = findMy(src.id); return mw ? (mw.fromPlan ? "plan:"+mw.fromPlan : "my:"+src.id) : ""; }
  if(src.type === "libworkout") return "lib:"+src.id;
  return "";
}
/* Der runde Hauptknopf auf Heute: ein Eintrag aus einem Programm, dessen Wochentage auf heute fallen (ohne Kalender-Termin) */
function programmHeute(){
  var wt = (new Date().getDay() + 6) % 7, p = null;
  progSortiert().forEach(function(x){ if(!p && x.items.length && x.tage.indexOf(wt) > -1) p = x; });
  if(!p) return null;
  var i = (p.pos || 0) % p.items.length;
  return { p:p, i:i, ref:p.items[i] };
}

/* ---------- Programm-Seite ---------- */
function progZeileHTML(p, ref, i){
  var o = kalAufloesen(progEintrag(ref));
  return '<li class="pg-eintrag'+(o.ok ? '' : ' fehlt')+'" style="--kc:'+o.farbe+'"><button type="button" class="pg-start" data-pgstart="'+esc(p.id)+':'+i+'">'+
    '<i class="pg-nr">'+(i + 1)+'</i><span class="pg-text"><b>'+esc(o.name)+'</b><small>'+esc(o.ok ? o.sub : t("kalFehlt"))+'</small></span></button>'+
    '<button type="button" class="pg-weg" data-pgweg="'+esc(p.id)+':'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></li>';
}
function progKarteHTML(p){
  var offen = !!pgOffen[p.id], tage = p.tage.slice().sort(function(a, b){ return a - b; });
  return '<section class="card pg-karte" data-pg="'+esc(p.id)+'">'+
    '<div class="pg-kopf"><input type="text" class="pg-name" data-pgname="'+esc(p.id)+'" value="'+esc(p.name)+'" maxlength="40" aria-label="'+esc(t("name"))+'">'+
      '<button type="button" class="fav-btn'+(p.fav ? ' on' : '')+'" data-pgfav="'+esc(p.id)+'" aria-pressed="'+(!!p.fav)+'" title="'+esc(t("favorite"))+'" aria-label="'+esc(t("favorite"))+'">'+(p.fav ? '★' : '☆')+'</button></div>'+
    (p.items.length ? '<ol class="pg-liste">'+p.items.map(function(r, i){ return progZeileHTML(p, r, i); }).join("")+'</ol>' : '<div class="pg-leer">'+esc(t("progItemsLeer"))+'</div>')+
    '<button type="button" class="pg-plus" data-pgplus="'+esc(p.id)+'">'+ICON_PLUS+'<span>'+esc(t("progPlus"))+'</span></button>'+
    '<details class="pg-woche" data-pgwoche="'+esc(p.id)+'"'+(offen ? ' open' : '')+'><summary><span>'+esc(t("progWochenplan"))+'</span><small>'+
      esc(tage.map(progTagName).join(" ")+" · "+t("progWochenN", { n:p.wochen }))+'</small><span class="tpl-chev" aria-hidden="true">&#9662;</span></summary>'+
      '<div class="kp-titel">'+esc(t("progTage"))+'</div><div class="kp-chips" role="group">'+[0, 1, 2, 3, 4, 5, 6].map(function(d){
        var an = p.tage.indexOf(d) > -1;
        return '<button type="button" class="kp-chip'+(an ? ' an' : '')+'" data-pgtag="'+esc(p.id)+':'+d+'" aria-pressed="'+an+'">'+esc(progTagName(d))+'</button>'; }).join("")+'</div>'+
      '<div class="kp-titel">'+esc(t("planWochen"))+'</div><div class="kp-chips" role="group">'+KP_WOCHEN.map(function(w){
        return '<button type="button" class="kp-chip'+(p.wochen === w ? ' an' : '')+'" data-pgwochen="'+esc(p.id)+':'+w+'" aria-pressed="'+(p.wochen === w)+'">'+w+'</button>'; }).join("")+'</div>'+
      '<button type="button" class="btn btn-primary kp-ok" data-pgok="'+esc(p.id)+'"'+(p.items.length && p.tage.length ? '' : ' disabled')+'>'+esc(t("progUebernehmen"))+'</button>'+
      '<div class="kp-fuss">'+esc(t("progFuss"))+'</div></details></section>';
}
function renderProgramme(){
  var liste = progSortiert();
  app.innerHTML =
    topbar(t("tabKoerper"), { back:"#home", right:kopfSymboleNeu("stats") }) +
    (liste.length ? liste.map(progKarteHTML).join("") : '<div class="fav-empty">'+esc(t("progLeer"))+'</div>')+
    '<button type="button" class="btn btn-secondary pg-neu" data-pgneu>'+ICON_PLUS+' '+esc(t("progNeu"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderKoerper(); window.scrollTo(0, y); }
  function teile(v){ var a = v.split(":"); return { p:programmFinde(a[0]), n:+a[1] }; }
  app.querySelectorAll("[data-pgneu]").forEach(function(b){ b.addEventListener("click", function(){ programmNeu(); renderKoerper(); window.scrollTo(0, 0); }); });
  app.querySelectorAll("[data-pgname]").forEach(function(inp){
    inp.addEventListener("change", function(){ var p = programmFinde(inp.getAttribute("data-pgname")); if(!p) return; p.name = inp.value.trim() || t("progName", { n:programmListe().indexOf(p) + 1 }); p.updatedAt = Date.now(); save(); inp.value = p.name; });
  });
  app.querySelectorAll("[data-pgfav]").forEach(function(b){ b.addEventListener("click", function(){ var p = programmFinde(b.getAttribute("data-pgfav")); if(!p) return; p.fav = !p.fav; save(); showToast(t(p.fav ? "favAdded" : "favRemoved")); neu(); }); });
  app.querySelectorAll("[data-pgplus]").forEach(function(b){ b.addEventListener("click", function(){ var p = programmFinde(b.getAttribute("data-pgplus")); if(p) openProgrammWahl(p, neu); }); });
  app.querySelectorAll("[data-pgstart]").forEach(function(b){ b.addEventListener("click", function(){
    var x = teile(b.getAttribute("data-pgstart")); if(!x.p) return;
    var o = progEintrag(x.p.items[x.n]); if(!kalAufloesen(o).ok) return;
    x.p.pos = x.n; save(); kalStarten(o);
  }); });
  app.querySelectorAll("[data-pgweg]").forEach(function(b){ b.addEventListener("click", function(){ var x = teile(b.getAttribute("data-pgweg")); if(!x.p) return; x.p.items.splice(x.n, 1); x.p.pos = 0; x.p.updatedAt = Date.now(); save(); neu(); }); });
  app.querySelectorAll("details.pg-woche > summary").forEach(function(sm){
    sm.addEventListener("click", function(e){ e.preventDefault(); var d = sm.parentNode; d.open = !d.open; pgOffen[d.getAttribute("data-pgwoche")] = d.open; });
  });
  app.querySelectorAll("[data-pgtag]").forEach(function(b){ b.addEventListener("click", function(){
    var x = teile(b.getAttribute("data-pgtag")); if(!x.p) return;
    var i = x.p.tage.indexOf(x.n); if(i > -1) x.p.tage.splice(i, 1); else x.p.tage.push(x.n);
    x.p.updatedAt = Date.now(); save(); pgOffen[x.p.id] = true; neu();
  }); });
  app.querySelectorAll("[data-pgwochen]").forEach(function(b){ b.addEventListener("click", function(){ var x = teile(b.getAttribute("data-pgwochen")); if(!x.p) return; x.p.wochen = x.n; x.p.updatedAt = Date.now(); save(); pgOffen[x.p.id] = true; neu(); }); });
  app.querySelectorAll("[data-pgok]").forEach(function(b){ b.addEventListener("click", function(){
    var p = programmFinde(b.getAttribute("data-pgok")); if(!p) return;
    if(!p.tage.length){ showToast(t("progKeinTag")); return; }
    var n = programmUebernehmen(p);
    if(!n) return;
    kalBasis = null; kalAnsicht = "woche"; showToast(t("progUebernommen", { n:n }));
    go("#kalender");
  }); });
  // langes Drücken auf ein Programm: Teilen · Löschen (sichtbar bleibt nur der Stern)
  app.querySelectorAll("[data-pg]").forEach(function(el){
    var p = programmFinde(el.getAttribute("data-pg"));
    if(p) langDruck(el, function(){ programmMenue(p, neu); });
  });
}
function programmText(p){
  return p.name+"\n"+p.items.map(function(r, i){ var o = kalAufloesen(progEintrag(r)); return (i + 1)+". "+o.name; }).join("\n");
}
function programmMenue(p, neu){
  openActionSheet(p.name, [
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

/* ---------- „+“: Eintrag wählen - Rubrik (Workout · Run · Mobility · Stretch), dann Favoriten · BLOCs · Katalog ---------- */
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
  var katalog = [];   // [{ name, refs }]
  if(rub === "workout"){
    var je = {};
    LIB_WORKOUTS.forEach(function(lw){
      if(libIstWarmDehn(lw) || libHidden("wo:"+lw.id)) return;
      var b = katWoBereich(lw, lw.exercises.map(findExercise).filter(Boolean));
      (je[b] = je[b] || []).push("lib:"+lw.id);
    });
    KAT_WO_BEREICHE.forEach(function(b){
      if(je[b]) katalog.push({ name:b === "ganz" ? t("katGanz") : t(KAT_GRUPPEN.filter(function(g){ return g.id === b; })[0].key), refs:je[b] });
    });
  } else if(ws){
    var wos = ws === "warm" ? AUFWAERM_IDS.map(findLibWorkout).filter(Boolean) : LIB_WORKOUTS.filter(function(lw){ return lw.focus === "stretch" && AUFWAERM_IDS.indexOf(lw.id) < 0; });
    var refs = wos.filter(function(lw){ return !libHidden("wo:"+lw.id); }).map(function(lw){ return "lib:"+lw.id; });
    if(refs.length) katalog.push({ name:t("katTabKatalog"), refs:refs });
  }
  return { favs:favs, blocs:blocs, katalog:katalog };
}
function openProgrammWahl(p, neu){
  var root = document.getElementById("overlayRoot"), rub = "workout";
  function zu(){ root.innerHTML = ""; }
  function opt(ref){
    var o = kalAufloesen(progEintrag(ref));
    return '<button type="button" class="bloc-opt" data-pgpick="'+esc(ref)+'"><span><b>'+esc(o.name)+'</b><small>'+esc(o.sub)+'</small></span></button>';
  }
  function draw(){
    var sc = root.querySelector(".bloc-sheet"), y = sc ? sc.scrollTop : 0, l = pgListen(rub), html = "";
    if(rub === "run"){
      html = opt("run");
    } else {
      html += '<div class="af-lbl">'+esc(t("pgFav"))+'</div>'+(l.favs.length ? l.favs.map(opt).join("") : '<div class="pg-leer">'+esc(t("pgNichts"))+'</div>');
      html += '<div class="af-lbl">'+esc(t("pgBlocs"))+'</div>'+(l.blocs.length ? l.blocs.map(opt).join("") : '<div class="pg-leer">'+esc(t("pgNichts"))+'</div>');
      html += '<div class="af-lbl">'+esc(t("bauKatalog"))+'</div>'+(l.katalog.length ? l.katalog.map(function(g){
        return '<details class="pg-gr"><summary><b>'+esc(g.name)+'</b><span class="lbl-hint">'+g.refs.length+'</span><span class="tpl-chev" aria-hidden="true">&#9662;</span></summary>'+g.refs.map(opt).join("")+'</details>'; }).join("") : '<div class="pg-leer">'+esc(t("pgNichts"))+'</div>');
      if(rub === "workout") html += '<div class="af-lbl">'+esc(t("surprise"))+'</div>'+opt("zufall");
    }
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet bloc-sheet" role="dialog" aria-label="'+esc(t("progPlus"))+'"><h3>'+esc(t("progPlus"))+'</h3>'+
      '<div class="seg-row pg-rub" role="group">'+PG_RUBRIKEN.map(function(r){ return '<button type="button" data-pgrub="'+r+'" class="'+(rub === r ? 'active' : '')+'" aria-pressed="'+(rub === r)+'">'+esc(t("pgRub_"+r))+'</button>'; }).join("")+'</div>'+
      html+'<div class="btn-row"><button class="btn btn-secondary" data-cancel>'+esc(t("cancel"))+'</button></div></div></div>';
    var neuSc = root.querySelector(".bloc-sheet"); if(neuSc) neuSc.scrollTop = y;
    root.querySelector("[data-cancel]").addEventListener("click", zu);
    root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) zu(); });
    root.querySelectorAll("[data-pgrub]").forEach(function(b){ b.addEventListener("click", function(){ rub = b.getAttribute("data-pgrub"); draw(); }); });
    root.querySelectorAll("[data-pgpick]").forEach(function(b){ b.addEventListener("click", function(){
      p.items.push(b.getAttribute("data-pgpick")); p.updatedAt = Date.now(); save(); zu(); neu();
    }); });
  }
  draw();
}

/* ---------- Meine Übungen: Favoriten und eigene Übungen ---------- */
function ueZeileHTML(ex){
  var sub = ex.main === "stretch" ? t("warmTitle") : ex.cats.map(catName).join(", ");
  return '<button type="button" class="list-item entry ue-zeile" data-uebung="'+esc(ex.id)+'"><div class="meta"><div class="name">'+esc(tplText(ex.name))+'</div><div class="sub">'+esc(sub)+'</div></div>'+ICON_CHEV+'</button>';
}
function renderMeineUebungen(){
  var favs = (state.db.settings.exFavs || []).map(findExercise).filter(function(ex){ return ex && !libHidden("ex:"+ex.id); });
  var eigene = EXERCISES.filter(function(ex){ return ex.custom && !libHidden("ex:"+ex.id); });
  app.innerHTML =
    topbar(t("tabKoerper"), { back:"#home", right:kopfSymboleNeu("stats") }) +
    '<button type="button" class="btn btn-secondary kat-eigene" data-uenew>'+ICON_PLUS+' '+esc(t("exNew"))+'</button>'+
    '<div class="section-title">'+esc(t("arenaUebEigen"))+'</div>'+(eigene.length ? eigene.map(ueZeileHTML).join("") : '<div class="fav-empty">'+esc(t("arenaUebLeer"))+'</div>')+
    '<div class="section-title" style="margin-top:18px">'+esc(t("arenaUebFav"))+'</div>'+(favs.length ? favs.map(ueZeileHTML).join("") : '<div class="fav-empty">'+esc(t("arenaUebFavLeer"))+'</div>')+
    '<div style="height:40px"></div>';
  bindCommon();
  var nb = app.querySelector("[data-uenew]");
  if(nb) nb.addEventListener("click", function(){ go("#exedit/new"); });
  app.querySelectorAll("[data-uebung]").forEach(function(b){ b.addEventListener("click", function(){
    var ex = findExercise(b.getAttribute("data-uebung")); if(!ex) return;
    if(EX_INFO[ex.id]) openExInfo(ex.id, false, {});
    else go(ex.custom ? "#exedit/"+ex.id : "#playex/"+ex.id);
  }); });
}

/* ---------- Langes Drücken auf BLOCs und eigene Workouts: Kopieren · Teilen · Löschen (sichtbar bleibt nur der Stern) ---------- */
function myKopie(mw){
  var q = JSON.parse(JSON.stringify(mw));
  q.id = uid(); q.name = t("planKopieName", { n:mw.name }); q.updatedAt = Date.now(); delete q.fromPlan;
  state.db.myWorkouts.push(q); save();
  return q;
}
function blocMenueBinden(neu){
  function menue(titel, kopie, teilen, el){
    openActionSheet(titel, [
      { ico:ICON_COPY, label:t("actCopy"), fn:function(){ var q = kopie(); showToast(t("planKopiert", { n:q.name })); neu(); } },
      { ico:P_SHARE, label:t("share"), fn:teilen },
      { ico:P_TRASH, label:t("del"), danger:true, fn:function(){ var d = el.querySelector("[data-del]"); if(d) d.click(); } }
    ]);
  }
  app.querySelectorAll(".plan-item[data-plan]").forEach(function(el){
    var p = stPlanFind(el.getAttribute("data-plan"));
    if(p) langDruck(el, function(){ menue(p.name, function(){ return planKopie(p); }, function(){ shareDraft(draftFromMy(planMw(p))); }, el); });
  });
  app.querySelectorAll(".my-item[data-cover]").forEach(function(el){
    var mw = findMy(el.getAttribute("data-cover").replace(/^my\//, ""));
    if(mw) langDruck(el, function(){ menue(mw.name, function(){ return myKopie(mw); }, function(){ shareDraft(draftFromMy(normMy(mw))); }, el); });
  });
}
