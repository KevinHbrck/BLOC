"use strict";
/* ============ Gesamtsuche ============
   Lupe auf der Startseite (neben dem Zahnrad): durchsucht Übungen, Workouts (Air und eigene), Challenges (Summit),
   Timer-Workouts, Blöcke, die Bereiche und Aktionen wie „Neuer Block“. Das Feld bleibt stehen, nur die Treffer werden neu gezeichnet. */
var gesamtQuery = "";
/* Kategorien der Suche: ordnet die Gruppen der Treffer sechs Kategorien zu (Chips unter dem Suchfeld) */
var suchKat = "alle", suchZonen = [], suchKoerperAuf = false;   // Körper-Filter der Suche: gewählte Muskelgruppen, Karte offen
var SUCH_KATEGORIEN = ["alle", "uebungen", "workouts", "challenges", "timer", "bereiche", "erstellen"];
function suchKategorie(gruppe){
  if(gruppe === t("libExercises")) return "uebungen";
  if(gruppe === t("workouts") || gruppe === t("mineMy")) return "workouts";
  if(gruppe === t("srChallenges") || gruppe === t("srOwnChall")) return "challenges";
  if(gruppe === t("mineTimer") || gruppe === t("mineBlocks")) return "timer";
  if(gruppe === t("srAreas")) return "bereiche";
  return "erstellen";
}
function gesamtEintraege(){
  var l = [];
  function add(gruppe, titel, sub, text, fn){ l.push({ g:gruppe, k:suchKategorie(gruppe), titel:titel, sub:sub || "", text:titel+" "+(sub || "")+" "+(text || ""), fn:fn }); }
  var s = state.db.settings, neu = t("create");
  // Aktionen (auch Erstellen von Blöcken, Timer-Workouts, Workouts, Übungen, Challenges)
  add(neu, t("newBlock"), t("mineBlocks"), "block timer intervall erstellen anlegen neu create new", function(){ go("#block/"+createBlock().id); });
  add(neu, t("newWorkout"), t("mineTimer"), "timer workout intervall erstellen anlegen neu create new", function(){ go("#workout/"+createTimerWorkout().id); });
  add(neu, t("myNew"), t("tabMine"), "workout bauen baukasten erstellen anlegen neu create build", function(){ go("#mybuild/new"); });
  add(neu, t("exNew"), t("libExercises"), "uebung übung erstellen anlegen neu create exercise", function(){ go("#exedit/new"); });
  add(neu, t("repNew"), t("repTitle"), "challenge summit erstellen anlegen neu create", function(){
    var c = { id:"my-"+uid(), name:t("reDefaultName"), runden:3, zeilen:[], updatedAt:Date.now() };
    (s.myReps || (s.myReps = [])).push(c); save(); go("#repedit/"+c.id);
  });
  // Bereiche
  [["#library", t("library")], ["#intervall", t("tabTimer")], ["#reps", t("repTitle")], ["#run", t("runTitle")], ["#timers", t("timers")], ["#warmstretch", t("warmTitle")], ["#settings", t("settings")]].forEach(function(p){
    add(t("srAreas"), p[1], "", "", function(){ go(p[0]); });
  });
  // Workouts aus Air und eigene Workouts
  LIB_WORKOUTS.forEach(function(lw){
    if(libHidden("wo:"+lw.id)) return;
    var exs = lw.exercises.map(findExercise).filter(Boolean);
    add(t("workouts"), tplText(lw.name), t("exCount", { n:exs.length })+" · "+fmtDauerKurz(workoutDuration(libWorkoutRun(lw))), woSearchText("", exs), function(){ go("#cover/lib/"+lw.id); });
  });
  (state.db.myWorkouts || []).map(normMy).forEach(function(mw){
    var exs = mw.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
    add(t("mineMy"), mw.name, t("exCount", { n:exs.length }), woSearchText("", exs), function(){ go("#mybuild/"+mw.id); });
  });
  // Übungen
  EXERCISES.forEach(function(ex){
    if(libHidden("ex:"+ex.id)) return;
    add(t("libExercises"), tplText(ex.name), ex.cats.map(catName).join(", "), exSearchText(ex), function(){
      if(EX_INFO[ex.id]) openExInfo(ex.id, false, {});
      else go(ex.custom ? "#exedit/"+ex.id : "#playex/"+ex.id);
    });
    l[l.length-1].ex = ex.id;   // für den Körper-Filter der Suche
  });
  // Summit: Einheiten, Programme, eigene Challenges
  function rep(id, gruppe){
    var q = repQuelle(id);
    if(!q || !q.teile.length) return;
    var ex = [];
    q.teile.forEach(function(tl){ tl.row[4].forEach(function(x){ ex.push(repExName(x[0])); }); });
    add(gruppe, q.name, q.einzel ? "" : q.teile.map(repTeilName).join(" + "), ex.join(" "), function(){ go("#rep/"+id); });
  }
  REP_EINHEITEN.forEach(function(e){
    REP_STUFEN.forEach(function(st, i){ (e[1 + i] || []).forEach(function(v, k){ rep(e[0]+"-"+st+"-"+(k+1), t("srChallenges")); }); });
  });
  REP_WORKOUT_ROWS.forEach(function(r){ rep(r[0], t("srChallenges")); });
  (s.myRepUnits || []).forEach(function(u){ rep(u.id, t("srOwnChall")); });
  (s.myReps || []).forEach(function(c){ rep(c.id, t("srOwnChall")); });
  // Timer-Workouts und Blöcke
  state.db.workouts.forEach(function(w){ add(t("mineTimer"), w.name || t("untitled"), "", "", function(){ go("#workout/"+w.id); }); });
  state.db.blocks.forEach(function(b){ add(t("mineBlocks"), b.name, blockSpec(b), "", function(){ go("#block/"+b.id); }); });
  return l;
}
function renderSearch(){
  var alle = gesamtEintraege();
  suchZonen = kkNorm(suchZonen);   // nach dem Umschalten der Detailansicht passen
  app.innerHTML =
    topbar(t("srTitle"), { back:"#home" }) +
    searchHTML(gesamtQuery, "gs", t("srPh")) +
    '<div class="lib-chips sr-kats">'+SUCH_KATEGORIEN.map(function(k){
      return '<button type="button" class="lib-chip'+(suchKat === k ? ' active' : '')+'" data-srkat="'+k+'" aria-pressed="'+(suchKat === k)+'">'+esc(t("srKat_"+k))+'</button>';
    }).join("")+'</div>'+
    '<button type="button" class="sr-koerper-knopf" data-srkk aria-expanded="'+suchKoerperAuf+'">'+esc(t("kkFilter"))+(suchZonen.length ? ' · '+suchZonen.map(kkName).join(', ') : '')+'<span class="tpl-chev'+(suchKoerperAuf ? '' : ' zu')+'" aria-hidden="true">&#9662;</span></button>'+
    '<div class="sr-koerper" id="sr-kk"'+(suchKoerperAuf ? '' : ' hidden')+'>'+kkFilterHTML('data-srzone', suchZonen)+'</div>'+
    '<div id="gs-res"></div><div style="height:40px"></div>';
  bindCommon();
  var feld = app.querySelector("#gs-q"), res = app.querySelector("#gs-res");
  function zeigen(){
    var w = suchNorm(gesamtQuery), zon = suchZonen.length > 0, gewaehlt = suchKat !== "alle" || zon;
    if(!w && !gewaehlt){ res.innerHTML = '<div class="rep-intro">'+esc(t("srHint"))+'</div>'; return; }
    // Muskelgruppen gewählt: nur Übungen, die diese Gruppen als Hauptmuskeln haben
    var treffer = alle.filter(function(e){
      if(zon && !(e.ex && zonePasst(findExercise(e.ex), suchZonen))) return false;
      return (suchKat === "alle" || e.k === suchKat) && (!w || suchPasst(e.text, gesamtQuery));   // ohne Suchwort zeigt eine Kategorie alle ihre Einträge
    });
    if(!treffer.length){ res.innerHTML = '<div class="empty" style="padding:30px 20px;">'+esc(t("noResult"))+'</div>'; return; }
    var html = "", gruppe = null, n = 0, reihe = [];
    treffer.forEach(function(e){ if(reihe.indexOf(e.g) < 0) reihe.push(e.g); e.n = suchPasst(e.titel, gesamtQuery) ? 0 : 1; });
    // je Gruppe zuerst die Treffer im Namen, danach die über Übungen/Hinweise (stabil)
    treffer = treffer.map(function(e, i){ return { e:e, i:i }; }).sort(function(a, b){
      return reihe.indexOf(a.e.g) - reihe.indexOf(b.e.g) || a.e.n - b.e.n || a.i - b.i; }).map(function(o){ return o.e; });
    var kacheln = "", zeilen = "";   // Air-, Studio- und Dehnübungen erscheinen als quadratische Kacheln wie unter Air › Übungen (zuerst), alles andere als Zeile
    function raster(){ if(kacheln) html += '<div class="fig-grid">'+kacheln+'</div>'; html += zeilen; kacheln = ""; zeilen = ""; }
    treffer.forEach(function(e, i){
      if(e.g !== gruppe){ raster(); gruppe = e.g; n = 0; html += '<div class="section-title">'+esc(gruppe)+'</div>'; }
      if(!gewaehlt && ++n > 12) return;   // je Gruppe die ersten zwölf; genauer tippen grenzt ein (mit gewählter Kategorie alle)
      var ex = e.ex && findExercise(e.ex);
      if(ex && (fuerAir(ex) || ex.main === "stretch") && ILLU[ex.id]){ kacheln += ex.main === "stretch" ? '<div style="display:contents;--bereich:var(--ws-color)">'+libExKachel(ex)+'</div>' : libExKachel(ex); return; }   // Dehnübungen in der Farbe von Mobility & Stretch
      if(ex && STUDIO_NUR[ex.id]){ kacheln += studioKachel(ex.id); return; }   // Studio-Übungen ebenfalls als Kacheln (antippen = Studio-Seite)
      zeilen += '<div class="list-item entry" role="button" tabindex="0" data-sr="'+i+'"><div class="meta"><div class="name">'+esc(e.titel)+'</div>'+
        (e.sub ? '<div class="sub">'+esc(e.sub)+'</div>' : '')+'</div><span class="chip chev">'+ICON_CHEV+'</span></div>';
    });
    raster();
    res.innerHTML = html;
    // Kacheln wie in Air: antippen = Übungsinfo, ▶ = starten, ☆ = merken, lange drücken = in Workout oder Plan legen
    res.querySelectorAll("[data-info]").forEach(function(el){
      el.addEventListener("click", function(){ var id = el.getAttribute("data-info"); openExInfo(id, false, { onChange:zeigen, zu:function(){ exZuProgramm(id); } }); });
    });
    res.querySelectorAll("[data-playex]").forEach(function(el){
      el.addEventListener("click", function(ev){ ev.stopPropagation(); go("#playex/"+el.getAttribute("data-playex")); });
    });
    res.querySelectorAll("[data-exfav]").forEach(function(el){
      el.addEventListener("click", function(ev){ ev.stopPropagation(); toggleExFav(el.getAttribute("data-exfav")); zeigen(); });
    });
    res.querySelectorAll("[data-exlang]").forEach(function(el){ langDruck(el, function(){ exZuProgramm(el.getAttribute("data-exlang")); }); });
    res.querySelectorAll("[data-studio]").forEach(function(el){
      function oeffnen(){ go("#studio/"+el.getAttribute("data-studio")); }
      el.addEventListener("click", oeffnen);
      el.addEventListener("keydown", function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); oeffnen(); } });
      langDruck(el, function(){ exZuProgramm(el.getAttribute("data-studio")); });
    });
    airKachelBinden();
    res.querySelectorAll("[data-sr]").forEach(function(el){
      function los(){ treffer[+el.getAttribute("data-sr")].fn(); }
      el.addEventListener("click", los);
      el.addEventListener("keydown", function(ev){ if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); los(); } });
    });
  }
  feld.addEventListener("input", function(){ gesamtQuery = feld.value; zeigen(); });
  app.querySelectorAll("[data-srkat]").forEach(function(b){
    b.addEventListener("click", function(){
      suchKat = b.getAttribute("data-srkat");
      app.querySelectorAll("[data-srkat]").forEach(function(x){ var an = x === b; x.classList.toggle("active", an); x.setAttribute("aria-pressed", String(an)); });
      zeigen();
    });
  });
  // Körperkarte der Suche: aufklappen, Muskelgruppen antippen (mehrere möglich)
  var kkKnopf = app.querySelector("[data-srkk]");
  kkKnopf.addEventListener("click", function(){ suchKoerperAuf = !suchKoerperAuf; renderSearch(); });
  app.querySelectorAll("[data-srzone]").forEach(function(el){
    el.addEventListener("click", function(){ suchZonen = selToggle(suchZonen, el.getAttribute("data-srzone")); renderSearch(); });
  });
  zeigen();
  if(!gesamtQuery && !suchKoerperAuf) feld.focus();
}
/* Startseite: Favoriten als Kacheln, „Überrasch mich“, darunter die zwei Bereiche Timer und Bibliothek */
function renderHome(){
  var favHTML = favItemsHTML();
  var nFav = favEntries().length;
  app.innerHTML =
    topbar("BLOC", { home:true, sub:"Modular Training Builder" }) +
    installTipHTML() + backupTipHTML() + wocheHTML() +
    '<div class="sec-head"><div class="section-title">'+t("favorites")+(favHTML ? '' : ' <span class="lbl-hint bs-hinweis">'+esc(t("favEmptyKurz"))+'</span>')+'</div>'+
      (nFav > FAV_LIMIT ? '<button type="button" class="sec-link" data-favall>'+(favShowAll ? t("favLess") : t("favAllShort"))+
        '<span class="sec-link-chev'+(favShowAll?' up':'')+'">'+ICON_CHEV+'</span></button>' : '')+
    '</div>'+
    favHTML +
    /* Bereiche: Workouts zuerst und hervorgehoben, die übrigen drei als ruhige Liste („Überrasch mich“ gehört zu den Workouts) */
    '<div class="sec-head"><div class="section-title">'+t("areas")+'</div>'+
      '<button type="button" class="sec-link" data-wasistwas>'+esc(t("wiLink"))+'</button></div>'+
    bereicheHTML() +
    KODAK_BADGE;
  bindCommon();
  app.querySelectorAll("[data-bereich]").forEach(function(el){ langDruck(el, openBereicheSheet); });
  var sp = app.querySelector("[data-surprise]");
  if(sp) sp.addEventListener("click", openSurprise);
  bindFavItems(renderHome);
  bindBackupTip();
  var wib = app.querySelector("[data-wasistwas]");
  if(wib) wib.addEventListener("click", openWasIstWas);
}
/* „Was ist was?“: fünf Zeilen Klartext zu den Bereichen (nur Lesen, nichts wird geändert) */
function openWasIstWas(){
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet wi-sheet" role="dialog" aria-label="'+esc(t("wiTitel"))+'">'+
    '<h3>'+esc(t("wiTitel"))+'</h3>'+
    BEREICH_KEYS.map(function(k){
      var d = bereichDaten(k);
      return '<div class="wi-zeile" style="--c:'+d[3]+'"><span class="at-ico">'+svgIcon(HOME_ICON[k])+'</span><div><b>'+esc(d[1])+'</b><small>'+esc(t("wi_"+k))+'</small></div></div>';
    }).join("")+
    '<p class="hw-zeile" style="margin-top:12px">'+esc(t("wiSort"))+'</p>'+
    '<button class="btn btn-secondary" data-ok style="margin-top:12px">'+esc(t("wiOk"))+'</button>'+
  '</div></div>';
  function zu(){ root.innerHTML = ""; }
  root.querySelector("[data-ok]").addEventListener("click", zu);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) zu(); });
}

function timersSubText(){
  var w = state.db.workouts.length, b = state.db.blocks.length;
  return (w===1 ? t("oneTimerWo") : t("nTimerWo", { n:w }))+" · "+(b===1 ? t("oneBlock") : t("nBlocks", { n:b }));
}
/* Plus-Knopf mit Auswahlmenü (Startseite) bzw. als einfacher Knopf (eine Option) */
function fabMenuHTML(opts){
  if(opts.length === 1){
    return '<button class="fab" data-fabopt="'+opts[0].key+'" title="'+esc(opts[0].label)+'" aria-label="'+esc(opts[0].label)+'">'+ICON_PLUS+'</button>';
  }
  return '<div class="fab-backdrop hidden" data-fabclose></div>' +
    '<div class="fab-menu hidden" id="fab-menu">'+opts.map(function(o){
      return '<button type="button" class="fab-opt" data-fabopt="'+o.key+'">'+esc(o.label)+'<span class="ico '+o.cls+'">'+o.ico+'</span></button>';
    }).join("")+'</div>'+
    '<button class="fab" data-fab title="'+t("create")+'" aria-label="'+t("create")+'" aria-expanded="false">'+ICON_PLUS+'</button>';
}
function bindFabMenu(actions){
  var fab = app.querySelector("[data-fab]"), menu = app.querySelector("#fab-menu"), bd = app.querySelector("[data-fabclose]");
  function set(open){
    if(!fab) return;
    fab.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    menu.classList.toggle("hidden", !open);
    bd.classList.toggle("hidden", !open);
  }
  if(fab) fab.addEventListener("click", function(){ set(menu.classList.contains("hidden")); });
  if(bd) bd.addEventListener("click", function(){ set(false); });
  app.querySelectorAll("[data-fabopt]").forEach(function(b){
    b.addEventListener("click", function(){ set(false); var fn = actions[b.getAttribute("data-fabopt")]; if(fn) fn(); });
  });
}

