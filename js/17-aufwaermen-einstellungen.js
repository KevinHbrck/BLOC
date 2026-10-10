"use strict";
/* ============ Aufwärmen & Dehnen ============
   Eigene Kachel, weil beides zu Workouts und Challenges passt. Aufbau wie Air: Lupe oben rechts, oben Aufwärmen | Dehnen,
   darunter Workouts | Übungen | Meine. Bei Dehnen mit Körperregionen als Filter (Nacken, Schultern, Rücken, Hüfte, Beine …).
   Meine = eigene Workouts dieses Bereichs (mw.ws = „warm“ / „dehn“); Übungen lassen sich per langem Drücken oder ⋯ dort einbauen. */
var wsQuery = "";
function renderWarmStretch(){
  var s = state.db.settings;
  var art = s.wsArt === "dehn" ? "dehn" : "warm", tab = ["uebungen", "meine"].indexOf(s.wsTab) > -1 ? s.wsTab : "workouts";
  var regSel = art === "dehn" && tab !== "meine" ? selArr(s.wsRegionen).filter(function(r){ return WS_REGIONEN.indexOf(r) > -1; }) : [];
  var zonSel = tab !== "meine" ? kkNorm(s.wsZonen) : [];   // Körperkarte
  var liste = "", fab = "", anzahl = 0;   // anzahl: sichtbare Karten (für „N … anzeigen“)
  if(tab === "workouts"){
    var wos = art === "warm" ? AUFWAERM_IDS.map(findLibWorkout).filter(Boolean)
                             : LIB_WORKOUTS.filter(function(lw){ return lw.focus === "stretch" && AUFWAERM_IDS.indexOf(lw.id) < 0; });
    var rows = wos.filter(function(lw){ return !libHidden("wo:"+lw.id); }).map(function(lw){
      var exs = lw.exercises.map(findExercise).filter(Boolean);
      return { lw:lw, exs:exs, dur:workoutDuration(libWorkoutRun(lw)) };
    });
    rows = rows.filter(function(r){ return (!regSel.length || r.exs.some(function(ex){ return wsRegionOk(ex.id, regSel); })) &&
      (!zonSel.length || r.exs.some(function(ex){ return zonePasst(ex, zonSel); })); }).sort(function(a, b){ return a.dur - b.dur; });
    anzahl = rows.length;
    liste = rows.map(function(r){ return libWoCard(r.lw, r.exs, false, r.dur, woMains(r.exs)); }).join("");
  } else if(tab === "uebungen"){
    var exl = wsUebungen(art).filter(function(ex){ return (art !== "dehn" || wsRegionOk(ex.id, regSel)) && zonePasst(ex, zonSel); });
    anzahl = exl.length;
    liste = exl.length ? '<div class="fig-grid">'+exl.map(function(ex){ return libExKachel(ex); }).join("")+'</div>' : "";
  } else {
    (state.db.myWorkouts || []).map(normMy).filter(function(mw){ return mw.ws === art; }).forEach(function(mw){
      var exs = mw.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
      liste += myWoCard(mw, exs, woMains(exs), workoutDuration(myRun(mw)));
    });
    if(!liste) liste = '<div class="empty" style="padding:30px 20px;">'+esc(t("wsMineEmpty"))+'</div>';
    fab = fabMenuHTML([{ key:"new", label:t("wsNew"), ico:ICON_PLUS, cls:"tp" }]);
  }
  function knopf(attr, wert, aktiv, text){ return '<button data-'+attr+'="'+wert+'" class="'+(aktiv ? "active" : "")+'">'+esc(text)+'</button>'; }
  var hw = hinweise("ws", [tab === "meine" ? "wsMineIntro" : art === "warm" ? "wsIntroWarm" : "wsIntroDehn"].concat(tab === "uebungen" ? ["zpHintWs"] : []));
  app.innerHTML =
    topbar(t("warmTitle"), { back:"#home", right:hw.knopf+lupeHTML("ws", wsQuery) }) +
    '<div class="theme-pick lib-tabs seg-2 ws-art">'+
      knopf("wsart", "warm", art === "warm", t("wsWarm"))+knopf("wsart", "dehn", art === "dehn", t("wsDehn"))+
    '</div>'+
    reiterZeileHTML("var(--ws-color)",
      knopf("wstab", "workouts", tab === "workouts", t("katTabKatalog"))+knopf("wstab", "uebungen", tab === "uebungen", t("libExercises"))+knopf("wstab", "meine", tab === "meine", t("tabMine")))+
    hw.z(0, "rep-intro")+
    suchFeldHTML(wsQuery, "ws", t("wsSearchPh"))+
    (tab === "uebungen" ? hw.z(1, "page-hint") : '')+
    (tab !== "meine" ? wsRegionFilterHTML(regSel, anzahl, tab === "uebungen" ? "Ex" : "Wo", zonSel, art === "dehn") : '')+
    // Start-Knöpfe und Figuren in der Farbe des Bereichs (wie die Kachel auf der Startseite)
    '<div style="--bereich:var(--ws-color)">'+(liste || '<div class="empty">'+t("libEmpty")+'</div>')+'</div>'+
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+t("noResult")+'</div>'+
    '<div style="height:'+(fab ? 90 : 40)+'px"></div>'+fab;
  bindCommon();
  function neu(){ var y = window.scrollY; renderWarmStretch(); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ e.stopPropagation(); fn(el, e); }); }); }
  on("[data-wsart]", function(el){ s.wsArt = el.getAttribute("data-wsart"); save(); renderWarmStretch(); window.scrollTo(0, 0); });
  on("[data-wstab]", function(el){ s.wsTab = el.getAttribute("data-wstab"); save(); renderWarmStretch(); window.scrollTo(0, 0); });
  wsRegionBinden(neu);
  var wq = app.querySelector("#ws-q");
  if(wq){
    applySearch(app, wsQuery);
    wq.addEventListener("input", function(){ wsQuery = wq.value; applySearch(app, wsQuery); });
  }
  bindFabMenu({ "new": function(){ bauNeuWs = art; go("#mybuild/new"); } });
  on("[data-cover]", function(el){ if(el.disabled) return; coverDraft = null; go("#cover/"+el.getAttribute("data-cover")); });
  on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
  on("[data-womore]", function(el){
    var lw = findLibWorkout(el.getAttribute("data-womore"));
    if(lw) woMenue(lw, neu, art);
  });
  // langes Drücken wie in Air: Workout-Karte = Menü (⋯), Übungskarte = in ein eigenes Workout einbauen
  app.querySelectorAll(".lib-card [data-womore]").forEach(function(b){
    var lw = findLibWorkout(b.getAttribute("data-womore"));
    if(lw) langDruck(b.closest(".lib-card"), function(){ woMenue(lw, neu, art); });
  });
  app.querySelectorAll("[data-exlang]").forEach(function(el){ langDruck(el, function(){ exZuProgramm(el.getAttribute("data-exlang"), art); }); });
  on("[data-playex]", function(el){ go("#playex/"+el.getAttribute("data-playex")); });
  on("[data-exedit]", function(el){ go("#exedit/"+el.getAttribute("data-exedit")); });
  on("[data-info]", function(el){ var id = el.getAttribute("data-info"); openExInfo(id, false, { onChange:neu, zu:function(){ exZuProgramm(id, art); } }); });
  airKachelBinden();
  on("[data-exfav]", function(el){ toggleExFav(el.getAttribute("data-exfav")); neu(); });
  on("[data-exmore]", function(el){
    var ex = findExercise(el.getAttribute("data-exmore"));
    if(!ex) return;
    var acts = [];
    if(ex.custom) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go("#exedit/"+ex.id); } });
    if(EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false, { onChange:neu }); } });
    acts.push({ ico:P_PLUS, label:t("zpWs"), fn:function(){ exZuProgramm(ex.id, art); } });
    acts.push({ ico:ICON_TIMERBLOCK, label:t("adoptBlockTitle"), fn:function(){ adoptExercise(ex); showToast(t("adoptedBlock", { n:tplText(ex.name) })); } });
    acts.push({ ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("ex:"+ex.id); showToast(t("hiddenToast")); neu(); } });
    openActionSheet(tplText(ex.name), acts);
  });
  bindTrash(neu);
}

/* Liste: Reiter Einheiten (Stufe Leicht/Standard/Fortgeschritten) und Programme A–Z (Stufe 1-3), beide optional ohne Stange */
function renderReps(){
  function knopf(art, wert, text){
    return '<button type="button" data-repf="'+art+':'+wert+'" class="'+(String(repFilter[art])===String(wert) ? "active" : "")+'">'+esc(text)+'</button>';
  }
  var anzahl = 0;   // sichtbare Karten (für „N … anzeigen“)
  function karte(id, name, zeile1, zeile2, plan, eigen){
    anzahl++;
    var best = repBestOf(id), qq = repQuelle(id), such = [name, zeile1 || ""];
    if(qq) qq.teile.forEach(function(tl){ tl.row[4].forEach(function(x){ such.push(repExName(x[0])); }); });
    return '<div class="list-item rep-karte'+(eigen ? ' eigen' : '')+'" data-repid="'+id+'" data-nav="#rep/'+id+'" data-q="'+esc(such.join(" "))+'"><div class="meta"><div class="name">'+esc(name)+'</div>'+
      (zeile1 ? '<div class="sub rep-teile">'+zeile1+'</div>' : '')+'<div class="sub">'+zeile2+'</div>'+(plan || '')+repZeitenHTML(best)+'</div>'+
      (best ? wochenKurve(repWochen(id), "rep-spark") : '')+
      (eigen ? '<div class="card-aside"><div class="card-acts">'+favBtn("rep:"+id)+trashBtn("rep", id, name)+'</div></div>' : moreBtn("data-repmore", id))+
      '<span class="chip chev">'+ICON_CHEV+'</span></div>';
  }
  var hw = hinweise("reps", [repFilter.tab === "einheiten" ? "repUnitsIntro" : repFilter.tab === "meine" ? "repMineIntro2" : "repIntro"]);
  var html = topbar(t("repTitle"), { back:"#home", right:hw.knopf+lupeHTML("rs", repQuery) }) +
    reiterZeileHTML("var(--rep-color)",
      '<button data-repf="tab:einheiten" class="'+(repFilter.tab==="einheiten"?"active":"")+'">'+esc(t("repTabUnits"))+'</button>'+
      '<button data-repf="tab:programme" class="'+(repFilter.tab==="programme"?"active":"")+'">'+esc(t("repTabProgs"))+'</button>'+
      '<button data-repf="tab:meine" class="'+(repFilter.tab==="meine"?"active":"")+'">'+esc(t("tabMine"))+'</button>')+suchFeldHTML(repQuery, "rs", t("repSearchPh"));
  var liste = "", fab = "";
  /* Karte einer eigenen Challenge; mitTag: „Meine ·“ davor (in den Reitern Einheiten und Programme) */
  function eigeneKarte(q, mitTag){
    var R = repQRunden(q), tag = mitTag ? esc(t("repOwnTag"))+SEP : "";
    return karte(q.id, q.name, q.unit && q.teile.length ? esc(q.teile.map(repTeilName).join(" + ")) : "", repQSchritte(q).length
      ? tag+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+(repQStange(q) ? SEP+esc(t("repBar")) : "")
      : tag+esc(t("reNoEx")), repPlanHTML(q), true);
  }
  function eigeneListe(arten, mitTag){   // arten: „prog“ und/oder „unit“; Einheiten zuerst
    var s = state.db.settings, out = "";
    if(arten.indexOf("unit") > -1) (s.myRepUnits || []).forEach(function(u){
      var q = repQuelle(u.id);
      if(q && !(repFilter.bar === "none" && repQStange(q))) out += eigeneKarte(q, mitTag);
    });
    if(arten.indexOf("prog") > -1) (s.myReps || []).forEach(function(c){
      var q = repQuelle(c.id);
      if(q && !(repFilter.bar === "none" && repQStange(q))) out += eigeneKarte(q, mitTag);
    });
    return out;
  }
  if(repFilter.tab === "einheiten"){
    var stufe = REP_STUFEN.indexOf(repFilter.stufe) > -1 ? repFilter.stufe : "standard";
    html += hw.z(0, "rep-intro")+
      '<div class="theme-pick rep-pick">'+knopf("stufe","leicht",t("stufe_leicht"))+knopf("stufe","standard",t("stufe_standard"))+knopf("stufe","fortgeschritten",t("stufe_fortgeschritten"))+'</div>';
    liste += eigeneListe(["unit"], true);   // eigene Einheiten stehen oben
    fab = fabMenuHTML([{ key:"unit", label:t("repNewUnit"), ico:ICON_PLUS, cls:"tp" }]);
    REP_EINHEITEN.forEach(function(e){
      var varianten = e[1 + REP_STUFEN.indexOf(stufe)];
      varianten.forEach(function(v, k){
        var q = repQuelle(e[0]+"-"+stufe+"-"+(k+1));
        if(!q || !q.teile.length) return;
        if(repFilter.bar === "none" && repQStange(q)) return;
        var R = repQRunden(q);
        liste += karte(q.id, repEinheitTitel(e[0], k+1, varianten.length),
          esc(q.teile.map(repTeilName).join(" + ")),
          esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+(repQStange(q) ? SEP+esc(t("repBar")) : ""),
          repPlanHTML(q));
      });
    });
  } else if(repFilter.tab === "meine"){
    html += hw.z(0, "rep-intro");
    liste = eigeneListe(["unit", "prog"], false) || '<div class="empty" style="padding:24px 20px 4px;">'+esc(t("repMineEmpty"))+'</div>';
    fab = fabMenuHTML([{ key:"prog", label:t("repNewProg"), ico:ICON_PLUS, cls:"tp" }, { key:"unit", label:t("repNewUnit"), ico:ICON_PLUS, cls:"tp" }]);
  } else {
    html += hw.z(0, "rep-intro")+
      '<div class="theme-pick rep-pick">'+knopf("lvl","all",t("repAll"))+knopf("lvl",1,t("lvl1"))+knopf("lvl",2,t("lvl2"))+knopf("lvl",3,t("lvl3"))+'</div>';
    liste += eigeneListe(["prog"], true);   // eigene Programme stehen oben
    fab = fabMenuHTML([{ key:"prog", label:t("repNewProg"), ico:ICON_PLUS, cls:"tp" }]);
    REP_WORKOUT_ROWS.filter(function(r){
      if(repFilter.lvl !== "all" && r[3] !== +repFilter.lvl) return false;
      if(repFilter.bar === "none" && repBrauchtStange(r)) return false;
      return true;
    }).map(function(r, i){ return { r:r, i:i }; }).sort(function(a, b){ return a.r[3] - b.r[3] || a.i - b.i; }).forEach(function(o){
      var r = o.r, R = repRunden(r);
      liste += karte(r[0], repName(r), "",
        esc(t("lvl"+r[3]))+SEP+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repWdh(r) }))+(repBrauchtStange(r) ? SEP+esc(t("repBar")) : ""),
        repPlanHTML(repQuelle(r[0])));
    });
  }
  /* Filterkarte (dieselbe wie in Air) mit der Ausrüstung. Stufe bzw. Level stehen als Hauptwahl sichtbar darüber. Unter „Meine“ gibt es nichts zu filtern. */
  function repFilterKarte(){
    var ein = repFilter.tab === "einheiten", ohneStange = repFilter.bar === "none";
    function chip(wert, text){ return filterChip("data-repf", "bar:"+wert, repFilter.bar === wert, "", text); }
    return filterKarteHTML({ offen:!!state.db.settings.repFilterOpen, toggle:"data-reptoggle", reset:"data-repfreset", n:ohneStange ? 1 : 0,
      summe:t(ohneStange ? "repNoBar" : "repAllEquip"),
      zeigen:filterZeigenText(anzahl, ein ? "Ei" : "Pr"),
      inhalt:filterChipsHTML(t("equipHave"), "", chip("all", t("repAllEquip"))+chip("none", t("repNoBar"))) });
  }
  html += (repFilter.tab === "meine" ? '' : repFilterKarte()) +
    (liste || '<div class="empty">'+esc(t("repNone"))+'</div>') +
    '<div class="empty" data-noresult style="display:none;padding:30px 20px;">'+esc(t("noResult"))+'</div><div style="height:'+(fab ? 90 : 40)+'px"></div>'+fab;
  app.innerHTML = html;
  bindCommon();
  var rq = app.querySelector("#rs-q");
  if(rq){
    if(repQuery) applySearch(app, repQuery);
    rq.addEventListener("input", function(){ repQuery = rq.value; applySearch(app, repQuery); });
  }
  // ⋯ und langes Drücken auf eine Karte: unter „Meine“ ablegen (wie bei Air)
  app.querySelectorAll("[data-repmore]").forEach(function(b){
    b.addEventListener("click", function(e){ e.stopPropagation(); repMenue(b.getAttribute("data-repmore")); });
  });
  app.querySelectorAll(".rep-karte").forEach(function(k){ langDruck(k, function(){ repMenue(k.getAttribute("data-repid")); }); });
  function neuRep(){ var y = window.scrollY; renderReps(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-fav]").forEach(function(el){
    el.addEventListener("click", function(e){ e.stopPropagation(); toggleFav(el.getAttribute("data-fav")); neuRep(); });
  });
  bindTrash(neuRep);
  // Plus unter „Meine“: neues Programm (Übungen × Runden) oder neue Einheit (mehrere Programme hintereinander)
  bindFabMenu({ "prog": function(){
    var c = { id:"my-"+uid(), name:t("reDefaultName"), runden:3, zeilen:[], updatedAt:Date.now() };
    (state.db.settings.myReps || (state.db.settings.myReps = [])).push(c);
    save();
    go("#repedit/"+c.id);
  }, "unit": function(){
    var u = { id:"myu-"+uid(), name:t("reUnitDefault"), teile:[], updatedAt:Date.now() };
    (state.db.settings.myRepUnits || (state.db.settings.myRepUnits = [])).push(u);
    save();
    go("#repunitedit/"+u.id);
  } });
  app.querySelectorAll("[data-repf]").forEach(function(b){
    b.addEventListener("click", function(){
      var p = b.getAttribute("data-repf").split(":"), y = window.scrollY;
      repFilter[p[0]] = p[1];
      renderReps();
      if(p[0] !== "tab") window.scrollTo(0, y);   // Filter-Chips: Seite bleibt, wo sie ist
    });
  });
  app.querySelectorAll("[data-reptoggle]").forEach(function(b){
    b.addEventListener("click", function(){ var s = state.db.settings; s.repFilterOpen = !s.repFilterOpen; save(); neuRep(); });
  });
  var rz = app.querySelector("[data-repfreset]");
  if(rz) rz.addEventListener("click", function(){ repFilter.bar = "all"; neuRep(); });
}

/* Detail: je Programm eine Tabelle Übungen × Runden, Bestzeit, Start */
function renderRepDetail(id){
  var q = repQuelle(id);
  if(!q) return go("#reps");
  var R = repQRunden(q), best = repBestOf(id);
  function tabelle(tl){
    var runden = [];
    for(var r=tl.von; r<=tl.bis; r++) runden.push(r);
    var kopf = '<tr><th></th>'+runden.map(function(r){ return '<th>'+r+'</th>'; }).join("")+'</tr>';
    var zeilen = tl.row[4].filter(function(x){ return runden.some(function(r){ return x[1][r-1]; }); }).map(function(x){
      var bild = repIllu(x[0]) ? illuStillHTML(repIllu(x[0]), "") : "";
      return '<tr><td class="rep-ex"><div class="rep-ex-in">'+(bild || '<span class="rep-leer"></span>')+'<span>'+esc(repExName(x[0]))+'</span></div></td>'+
        runden.map(function(r){ var m = x[1][r-1]; return '<td>'+(m ? esc(repMenge(repMengeMal(m, tl.f))) : '–')+'</td>'; }).join("")+'</tr>';
    }).join("");
    return '<div class="card"><div class="rep-tab-wrap"><table class="rep-tab">'+kopf+zeilen+'</table></div></div>';
  }
  var schritte = repQSchritte(q).length;
  app.innerHTML =
    topbar(q.name, { back:"#reps", right: q.eigen ? '<button class="iconbtn" data-nav="'+repEditRoute(q)+id+'" title="'+esc(t("edit"))+'" aria-label="'+esc(t("edit"))+'">'+svgIcon(ICON_EDIT)+'</button>' : '' }) +
    '<div class="rep-meta">'+(q.einzel && !q.eigen ? esc(t("lvl"+q.lvl))+SEP : '')+esc(R===1 ? t("repRound1") : t("repRoundsN", { n:R }))+SEP+esc(t("repReps", { n:repQWdh(q) }))+
      (repQStange(q) ? SEP+esc(t("repBar")) : "")+
      (best ? SEP+esc(t("repBestIs", { z:repUhr(best.best) }))+(best.n > 1 ? ', '+esc(t("repLastIs", { z:repUhr(best.last) })) : '') : '')+'</div>'+
    statsLeisteHTML("data-repstats", best ? t("repStatsKurz", { z:repUhr(best.best), n:best.n }) : t("repStatsNone"), repWochen(id), "var(--rep-color)")+
    q.teile.map(function(tl, i){
      return '<div class="section-title">'+esc(q.einzel ? t("repTable") : (i+1)+". "+repTeilName(tl))+'</div>'+tabelle(tl);
    }).join("")+
    '<div class="rep-intro">'+esc(t("repHint"))+'</div>'+
    (schritte ? '' : '<div class="empty">'+esc(t(q.unit ? "reUnitEmpty" : "reLeer"))+'</div>')+
    '<button type="button" class="btn btn-primary" data-repstart'+(schritte ? '' : ' disabled')+'>'+ICON_PLAY+' '+esc(t("repStart"))+'</button>'+
    (q.eigen ? '<button type="button" class="btn btn-secondary" data-nav="'+repEditRoute(q)+id+'" style="margin-top:10px;">'+svgIcon(ICON_EDIT)+' '+esc(t("edit"))+'</button>' : '');
  bindCommon();
  app.querySelector("[data-repstart]").addEventListener("click", function(){ repRun = null; go("#repplay/"+id); });
  app.querySelector("[data-repstats]").addEventListener("click", function(){ openRepStats(id, q.name); });
}

/* Eigene Challenge bearbeiten: Name, Runden, je Übung Wiederholungen oder Sekunden pro Runde. Speichert sofort. */
var RE_HALTEN = ["plank","side-plank","wall-sit","dead-hang","l-sit","hanging-l-sit","support-hold","squat-hold","hollow-hold","superman-hold","farmer-carry","front-rack-carry","pause","lauf","sprint"];
function renderRepEdit(id){
  var c = myRep(id);
  if(!c) return go("#reps");
  var R = c.runden;
  var zeilen = c.zeilen.map(function(z, i){
    var bild = repIllu(z.ex) ? illuStillHTML(repIllu(z.ex), "") : "";
    var felder = "";
    for(var r=0; r<R; r++) felder += '<div class="re-feld"><span>'+esc(t("repRound"))+' '+(r+1)+'</span>'+
      '<input type="number" inputmode="numeric" min="0" max="9999" data-rem="'+i+':'+r+'" value="'+(+z.m[r] || 0)+'" aria-label="'+esc(repExName(z.ex)+", "+t("repRound")+" "+(r+1))+'"></div>';
    return '<div class="card re-zeile">'+
      '<div class="re-kopf"><div class="rep-ex-in">'+(bild || '<span class="rep-leer"></span>')+'<b>'+esc(repExName(z.ex))+'</b></div>'+
        '<button type="button" class="dz-btn" data-rerm="'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></div>'+
      '<div class="seg-row re-art">'+["wdh", "sek", "m"].map(function(a){
        return '<button type="button" class="'+(z.art===a ? 'active' : '')+'" data-reart="'+i+':'+a+'">'+esc(t(a==="wdh" ? "reWdh" : a==="sek" ? "reSek" : "reMeter"))+'</button>'; }).join("")+'</div>'+
      '<div class="re-felder">'+felder+'</div></div>';
  }).join("");
  app.innerHTML =
    topbar(t("reTitle"), { back:"#reps" }) +
    '<div class="card"><label for="re-name">'+t("name")+'</label><input type="text" id="re-name" value="'+esc(c.name)+'" maxlength="40">'+
      '<label>'+t("reRunden")+'</label>'+stepperHTML("re-runden", R, 1, 20, 1)+'</div>'+
    '<div class="section-title">'+t("reUebungen")+'</div>'+
    (zeilen || '<div class="empty" style="padding:16px 20px;">'+esc(t("reLeer"))+'</div>')+
    '<button type="button" class="my-new" data-readd>'+ICON_PLUS+' '+t("myAdd")+'</button>'+
    '<div class="tm-hint" style="margin:10px 4px 16px;">'+esc(t("reHint"))+'</div>'+
    '<button type="button" class="btn btn-primary" data-refertig>'+esc(t("reFertig"))+'</button>'+
    '<button type="button" class="btn btn-danger" data-redel style="margin-top:10px;">'+ICON_TRASH+' '+esc(t("reDelete"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function speichern(){ c.updatedAt = Date.now(); save(); }
  function neu(){ var y = window.scrollY; renderRepEdit(id); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(){ fn(el); }); }); }
  var nameIn = app.querySelector("#re-name");
  nameIn.addEventListener("input", function(){ c.name = nameIn.value.trim() || t("reDefaultName"); speichern(); });
  bindSteppers(app, function(){
    var n = clamp(parseInt(app.querySelector("#re-runden").value) || 1, 1, 20);
    if(n === c.runden) return;
    c.runden = n;
    c.zeilen.forEach(function(z){ while(z.m.length < n) z.m.push(z.m.length ? z.m[z.m.length-1] : (z.art === "sek" ? 30 : 10)); });
    speichern(); neu();
  });
  app.querySelectorAll("[data-rem]").forEach(function(inp){
    inp.addEventListener("focus", function(){ inp.select(); });
    inp.addEventListener("change", function(){
      var p = inp.getAttribute("data-rem").split(":"), z = c.zeilen[+p[0]], r = +p[1];
      var v = clamp(parseInt(inp.value) || 0, 0, 9999), alt = +z.m[r] || 0;
      inp.value = v;
      z.m[r] = v;
      // Runde 1 geändert: die folgenden Runden, die noch den alten Wert hatten, ziehen mit
      if(r === 0) for(var k=1; k<c.runden; k++) if((+z.m[k] || 0) === alt){
        z.m[k] = v;
        var f = app.querySelector('[data-rem="'+p[0]+':'+k+'"]');
        if(f) f.value = v;
      }
      speichern();
    });
  });
  on("[data-reart]", function(el){ var p = el.getAttribute("data-reart").split(":"); c.zeilen[+p[0]].art = p[1]; speichern(); neu(); });
  on("[data-rerm]", function(el){ c.zeilen.splice(+el.getAttribute("data-rerm"), 1); speichern(); neu(); });
  on("[data-readd]", function(){
    repExPicker(function(ex){
      var sek = RE_HALTEN.indexOf(ex) > -1, m = [];
      for(var r=0; r<c.runden; r++) m.push(sek ? 30 : 10);
      c.zeilen.push({ ex:ex, art:sek ? "sek" : "wdh", m:m });
      speichern(); neu();
    });
  });
  // Fertig: zur Übersicht der Challenge, ohne den Editor im Zurück-Verlauf zu lassen
  on("[data-refertig]", function(){ navStack.pop(); go("#rep/"+id); });
  on("[data-redel]", function(){
    confirmSheet(t("reDelQ"), "„"+(c.name || t("reDefaultName"))+"“ – "+t("cantUndo"), t("del"), function(){
      state.db.settings.myReps = (state.db.settings.myReps || []).filter(function(x){ return x.id !== id; });
      if(state.db.settings.repBest) delete state.db.settings.repBest[id];
      save();
      navStack = navStack.filter(function(h){ return h.indexOf(id) < 0; });
      go("#reps");
    });
  });
}
/* Auswahl einer Übung (mit Suche): Laufen, Sprint, Pause und alle Übungen außer Dehnen */
function repExPicker(onPick){
  var root = document.getElementById("overlayRoot");
  var ex = EXERCISES.filter(function(e){ return fuerWorkout(e) && e.equip.indexOf("gym") < 0 && !libHidden("ex:"+e.id); }).map(function(e){
    return { id:e.id, name:tplText(e.name), q:exSearchText(e) };
  }).sort(function(a, b){ return a.name.localeCompare(b.name, currentLang()); });
  var liste = Object.keys(REP_PSEUDO).map(function(k){ var n = tplText(REP_PSEUDO[k]); return { id:k, name:n, q:n.toLowerCase() }; }).concat(ex);
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet re-pick" role="dialog" aria-label="'+esc(t("myAdd"))+'">'+
    '<h3>'+esc(t("myAdd"))+'</h3>'+searchHTML("", "re", t("searchPh"))+
    '<div class="re-pick-liste"><div class="fig-grid">'+liste.map(function(o){
      var e = findExercise(o.id);
      return uebKachel({ bild:repIllu(o.id), name:o.name, attr:'data-repick="'+o.id+'"', q:o.q, cat:e ? catVar(e.cats[0]) : "" });
    }).join("")+'</div><div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div></div>'+
    '<button class="btn btn-secondary" data-reclose>'+t("cancel")+'</button>'+
  '</div></div>';
  function close(){ root.innerHTML = ""; }
  var box = root.querySelector(".re-pick-liste"), q = root.querySelector("#re-q");
  q.addEventListener("input", function(){ applySearch(box, q.value); });
  kachelKlick(root, "[data-repick]", function(b){ var id = b.getAttribute("data-repick"); close(); onPick(id); });
  root.querySelector("[data-reclose]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}

/* Auswahl eines Programms für eine eigene Einheit (mit Suche): erst eigene, dann die mitgelieferten */
function repProgPicker(onPick){
  var root = document.getElementById("overlayRoot");
  var l = (state.db.settings.myReps || []).map(function(c){ var r = myRepRow(c); return { id:c.id, name:c.name || t("reDefaultName"), sub:t("repOwnTag")+SEP+repRunden(r)+" "+t("reRunden"), R:repRunden(r) }; })
    .concat(REP_WORKOUT_ROWS.map(function(r){ return { id:r[0], name:repName(r), sub:t("lvl"+r[3])+SEP+repRunden(r)+" "+t("reRunden"), R:repRunden(r) }; }));
  l = l.filter(function(o){ return o.R > 0; });
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet re-pick" role="dialog" aria-label="'+esc(t("rePickProg"))+'">'+
    '<h3>'+esc(t("rePickProg"))+'</h3>'+searchHTML("", "rp", t("repSearchPh"))+
    '<div class="re-pick-liste">'+l.map(function(o){
      return '<div class="list-item entry" role="button" tabindex="0" data-rpick="'+esc(o.id)+'" data-q="'+esc(o.name)+'"><div class="meta"><div class="name">'+esc(o.name)+'</div><div class="sub">'+o.sub+'</div></div></div>';
    }).join("")+'<div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div></div>'+
    '<button class="btn btn-secondary" data-reclose>'+t("cancel")+'</button>'+
  '</div></div>';
  function close(){ root.innerHTML = ""; }
  var box = root.querySelector(".re-pick-liste"), q = root.querySelector("#rp-q");
  q.addEventListener("input", function(){ applySearch(box, q.value); });
  root.querySelectorAll("[data-rpick]").forEach(function(b){
    function los(){ var id = b.getAttribute("data-rpick"); close(); onPick(id); }
    b.addEventListener("click", los);
    b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); los(); } });
  });
  root.querySelector("[data-reclose]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}
/* Eigene Einheit bearbeiten: Name, Programme hintereinander (je mit Von/Bis-Runde und halber Menge). Speichert sofort. */
function renderRepUnitEdit(id){
  var u = myRepUnit(id);
  if(!u) return go("#reps");
  var teile = (u.teile || []).map(function(p, i){
    var row = repProgRow(p.prog);
    if(!row) return "";
    var R = repRunden(row);
    return '<div class="card re-zeile">'+
      '<div class="re-kopf"><div class="rep-ex-in"><b>'+esc((i+1)+". "+repName(row))+'</b></div>'+
        '<button type="button" class="dz-btn" data-rurm="'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></div>'+
      '<div class="ru-felder"><div><label>'+esc(t("reFrom"))+'</label>'+stepperHTML("ru-von-"+i, clamp(+p.von || 1, 1, R), 1, R, 1)+'</div>'+
        '<div><label>'+esc(t("reTo"))+'</label>'+stepperHTML("ru-bis-"+i, clamp(+p.bis || R, 1, R), 1, R, 1)+'</div></div>'+
      toggleRow("ru-half-"+i, esc(t("reHalf")), "", p.f === 0.5)+'</div>';
  }).join("");
  app.innerHTML =
    topbar(t("reUnitTitle"), { back:"#reps" }) +
    '<div class="card"><label for="ru-name">'+t("name")+'</label><input type="text" id="ru-name" value="'+esc(u.name)+'" maxlength="40"></div>'+
    '<div class="section-title">'+t("reUnitParts")+'</div>'+
    (teile || '<div class="empty" style="padding:16px 20px;">'+esc(t("reUnitEmpty"))+'</div>')+
    '<button type="button" class="my-new" data-ruadd>'+ICON_PLUS+' '+t("reUnitAdd")+'</button>'+
    '<div class="tm-hint" style="margin:10px 4px 16px;">'+esc(t("reUnitHint"))+'</div>'+
    '<button type="button" class="btn btn-primary" data-refertig>'+esc(t("reFertig"))+'</button>'+
    '<button type="button" class="btn btn-danger" data-redel style="margin-top:10px;">'+ICON_TRASH+' '+esc(t("reDelete"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function speichern(){ u.updatedAt = Date.now(); save(); }
  function neu(){ var y = window.scrollY; renderRepUnitEdit(id); window.scrollTo(0, y); }
  var nameIn = app.querySelector("#ru-name");
  nameIn.addEventListener("input", function(){ u.name = nameIn.value.trim() || t("reUnitDefault"); speichern(); });
  bindSteppers(app, function(){
    u.teile.forEach(function(p, i){
      var v = app.querySelector("#ru-von-"+i), b = app.querySelector("#ru-bis-"+i);
      if(!v || !b) return;
      var von = parseInt(v.value) || 1, bis = parseInt(b.value) || 1;
      if(von > bis){ bis = von; b.value = bis; }
      p.von = von; p.bis = bis;
    });
    speichern();
  });
  u.teile.forEach(function(p, i){
    if(app.querySelector("#ru-half-"+i)) bindToggle("ru-half-"+i, function(v){ p.f = v ? 0.5 : 1; speichern(); });
  });
  app.querySelectorAll("[data-rurm]").forEach(function(b){
    b.addEventListener("click", function(){ u.teile.splice(+b.getAttribute("data-rurm"), 1); speichern(); neu(); });
  });
  app.querySelector("[data-ruadd]").addEventListener("click", function(){
    repProgPicker(function(pid){
      var row = repProgRow(pid);
      if(!row) return;
      u.teile.push({ prog:pid, von:1, bis:repRunden(row), f:1 });
      speichern(); neu();
    });
  });
  app.querySelector("[data-refertig]").addEventListener("click", function(){ navStack.pop(); go("#rep/"+id); });
  app.querySelector("[data-redel]").addEventListener("click", function(){
    confirmSheet(t("reUnitDelQ"), "„"+(u.name || t("reUnitDefault"))+"“ – "+t("cantUndo"), t("del"), function(){
      state.db.settings.myRepUnits = (state.db.settings.myRepUnits || []).filter(function(x){ return x.id !== id; });
      if(state.db.settings.repBest) delete state.db.settings.repBest[id];
      save();
      navStack = navStack.filter(function(h){ return h.indexOf(id) < 0; });
      go("#reps");
    });
  });
}

/* Ablauf: vor dem Start -> (Einzählen) -> Schritt für Schritt mit „Geschafft“ -> Ergebnis.
   Die Zeit wird aus Zeitstempeln berechnet, stimmt also auch nach dem Wechsel in eine andere App. */
function repVerstrichen(){
  var r = repRun;
  if(!r || !r.start) return 0;
  return (r.ende || r.pauseAb || Date.now()) - r.start - r.pausenMs;
}
function renderRepPlayer(id){
  var q = repQuelle(id);
  if(!q) return go("#reps");
  if(!repQSchritte(q).length) return go("#rep/"+id);   // eigene Challenge ohne Übungen
  if(!repRun || repRun.id !== id){
    repStop();
    repRun = { id:id, q:q, steps:repQSchritte(q), i:-1, start:0, pausenMs:0, pauseAb:0, ende:0, zaehlt:0, stepEnde:0, uhr:null, zaehler:null };
  }
  repZeichnen();
}
function repStepStarten(){
  var r = repRun, st = r.steps[r.i], sek = st ? repSek(st.m) : 0;
  r.stepEnde = sek ? Date.now() + sek*1000 : 0;
}
function repLos(){
  var r = repRun;
  r.zaehlt = 0;
  r.start = Date.now();
  r.i = 0;
  repStepStarten();
  phaseBeep("work");
  requestWakeLock();
  r.uhr = setInterval(repTick, 200);
  repZeichnen();
}
function repStarten(){
  var r = repRun;
  if(!state.db.settings.countIn){ repLos(); return; }
  r.zaehlt = 3;
  phaseBeep("tick");
  repZeichnen();
  r.zaehler = setInterval(function(){
    if(!repRun || repRun !== r){ clearInterval(r.zaehler); return; }
    r.zaehlt--;
    if(r.zaehlt <= 0){ clearInterval(r.zaehler); r.zaehler = null; repLos(); return; }
    phaseBeep("tick");
    repZeichnen();
  }, 1000);
}
function repTick(){
  var r = repRun;
  if(!r || r.ende) return;
  var uhr = document.getElementById("rp-uhr");
  if(uhr) uhr.textContent = repUhr(repVerstrichen());
  if(r.pauseAb || !r.stepEnde) return;
  var rest = r.stepEnde - Date.now();
  var cd = document.getElementById("rp-countdown");
  if(cd) cd.textContent = repUhr(rest + 999);
  if(rest <= 0){
    phaseBeep("work");
    if(state.db.settings.vibration && navigator.vibrate) navigator.vibrate(120);
    repWeiter();
  }
}
function repWeiter(){
  var r = repRun;
  if(!r || r.ende || r.pauseAb) return;
  r.i++;
  if(r.i >= r.steps.length){ repFertig(); return; }
  repStepStarten();
  repZeichnen();
}
function repZurueck(){
  var r = repRun;
  if(!r || r.ende || r.i <= 0) return;
  r.i--;
  repStepStarten();
  if(r.pauseAb && r.stepEnde) r.stepEnde += Date.now() - r.pauseAb;   // Countdown steht während der Pause
  repZeichnen();
}
function repPause(){
  var r = repRun;
  if(!r || !r.start || r.ende) return;
  var jetzt = Date.now();
  if(r.pauseAb){
    r.pausenMs += jetzt - r.pauseAb;
    if(r.stepEnde) r.stepEnde += jetzt - r.pauseAb;
    r.pauseAb = 0;
    requestWakeLock();
  } else {
    r.pauseAb = jetzt;
  }
  repZeichnen();
}
function repFertig(){
  var r = repRun;
  r.ende = Date.now();
  clearInterval(r.uhr); r.uhr = null;
  var zeit = repVerstrichen();
  var alle = state.db.settings.repBest || (state.db.settings.repBest = {});
  var alt = alle[r.id];
  r.neueBest = !!alt && zeit < alt.best;
  var rlog = alt && alt.log ? alt.log.slice(-59) : (alt ? [[alt.at || Date.now(), alt.last]] : []);   // ältere Stände: wenigstens die letzte Zeit
  rlog.push([Date.now(), zeit]);
  alle[r.id] = { best: alt ? Math.min(alt.best, zeit) : zeit, last: zeit, n: (alt ? alt.n : 0) + 1, at: Date.now(), log: rlog };
  // für die Wochenzeile und „Überrasch mich“ (Übungen der letzten Tage)
  pruneHistory(state.db);
  state.db.history.push({ at:Date.now(), dur:Math.round(zeit/1000), b:"reps",
    ex:r.steps.map(function(x){ return x.ex; }).filter(function(id, i, a){ return !REP_PSEUDO[id] && a.indexOf(id) === i; }) });
  save();
  phaseBeep("done");
  releaseWakeLock();
  repZeichnen();
}
function repStop(){
  if(!repRun) return;
  clearInterval(repRun.uhr); clearInterval(repRun.zaehler);
  repRun = null;
  releaseWakeLock();
}
function repBeenden(){
  var r = repRun;
  function raus(){ repStop(); goBack("#reps"); }
  if(r && r.start && !r.ende) confirmSheet(t("repEndQ"), t("repEndText"), t("repEndBtn"), raus);
  else raus();
}
function repZeichnen(){
  var r = repRun;
  if(!r) return;
  var n = r.steps.length;
  var html = topbar(r.q.name, { back:"#reps" });
  if(r.ende){
    var best = repBestOf(r.id);
    html += '<div class="rp-karte" style="margin-top:8px;"><div class="rp-name">'+esc(t("repFinish"))+'</div>'+
      '<div class="rp-uhr">'+repUhr(repVerstrichen())+'</div>'+
      (r.neueBest ? '<div class="rp-best">'+esc(t("repNewBest"))+'</div>' :
        (best && best.n > 1 ? '<div class="rp-sub">'+esc(t("repBestIs", { z:repUhr(best.best) }))+'</div>' : ''))+'</div>'+
      '<div class="rp-leiste"><button type="button" class="btn btn-secondary" data-repagain>'+ICON_RESTART+' '+esc(t("repAgain"))+'</button>'+
      '<button type="button" class="btn btn-primary" data-repend>'+esc(t("repToList"))+'</button></div>';
  } else {
    var i = Math.max(0, r.i), st = r.steps[i], nx = r.steps[i+1];
    var sek = repSek(st.m), illu = repIllu(st.ex);
    var menge = r.i >= 0 && sek ? '<span id="rp-countdown">'+repUhr(Math.max(0, r.stepEnde - (r.pauseAb || Date.now())) + 999)+'</span>' : esc(repMenge(st.m));
    var laeuft = r.i >= 0;
    var goText = !laeuft ? (r.zaehlt ? String(r.zaehlt) : t("repStart")) : r.pauseAb ? t("repResume") : sek ? t("repSkip") : t("repDone");
    html +=
      '<div class="rp-uhr" id="rp-uhr">'+repUhr(repVerstrichen())+'</div>'+
      '<div class="rp-runde">'+(laeuft ? esc((st.prog ? st.prog+" · " : "")+t("repRound")+" "+(st.r+1)+" / "+st.R) : esc(r.zaehlt ? t("repReady") : t("repHint")))+'</div>'+
      '<div class="rp-fort"><i style="width:'+Math.round((laeuft ? r.i : 0)/n*100)+'%"></i></div>'+
      '<div class="rp-karte">'+(illu ? illuHTML(illu, "") : '<div class="rp-leer"></div>')+
        '<div class="rp-menge">'+menge+'</div><div class="rp-name">'+esc(repExName(st.ex))+'</div></div>'+
      '<div class="rp-next">'+esc(nx ? t("repNext", { x:repExName(nx.ex)+" "+repMenge(nx.m) }) : t("repLastStep"))+'</div>'+
      '<button type="button" class="btn btn-primary rp-go" data-repgo'+(r.zaehlt ? ' disabled' : '')+'>'+esc(goText)+'</button>'+
      '<div class="rp-leiste">'+
        '<button type="button" class="btn btn-secondary" data-repback'+(laeuft && r.i > 0 ? '' : ' disabled')+'>'+esc(t("repUndo"))+'</button>'+
        '<button type="button" class="btn btn-secondary" data-reppause'+(laeuft ? '' : ' disabled')+'>'+esc(r.pauseAb ? t("repResume") : t("repPause"))+'</button>'+
        '<button type="button" class="btn btn-secondary" data-repend>'+esc(t("repEnd"))+'</button>'+
      '</div>';
  }
  app.innerHTML = html;
  // eigener Zurück-Knopf: läuft die Uhr, erst nachfragen
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", repBeenden); }
  bindCommon();
  function an(sel, fn){ var el = app.querySelector(sel); if(el) el.addEventListener("click", fn); }
  an("[data-repgo]", function(){
    if(r.i < 0){ if(!r.zaehlt) repStarten(); return; }
    if(r.pauseAb) repPause(); else repWeiter();
  });
  an("[data-repback]", repZurueck);
  an("[data-reppause]", repPause);
  an("[data-repend]", function(){ if(r.ende){ repStop(); goBack("#reps"); } else repBeenden(); });
  an("[data-repagain]", function(){ var id = r.id; repStop(); renderRepPlayer(id); });
}
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState === "visible" && repRun && repRun.start && !repRun.ende && !repRun.pauseAb) requestWakeLock();
});


/* Adresse der App ohne # und Parameter - die Seite, die man weitergeben kann */
/* Als Datei geöffnet (file://) gibt es keine teilbare Adresse - dann die veröffentlichte App */
var APP_PUBLIC_URL = "https://kevinhbrck.github.io/BLOC/";
/* Versionsnummer steht nur in sw.js: die App fragt den Service Worker danach und zeigt sie unten in den
   Einstellungen. Keine Antwort (als Datei geöffnet, Service Worker noch nicht aktiv): Zeile bleibt leer. */
var appFassung = "";
function fassungZeigen(){
  var el = document.getElementById("app-version");
  if(!el) return;
  if(appFassung){ el.textContent = "Version "+appFassung; return; }
  var sw = navigator.serviceWorker && navigator.serviceWorker.controller;
  if(!sw || !window.MessageChannel) return;
  var kanal = new MessageChannel();
  kanal.port1.onmessage = function(e){
    if(!e.data || !e.data.fassung) return;
    appFassung = String(e.data.fassung);
    var ziel = document.getElementById("app-version");
    if(ziel) ziel.textContent = "Version "+appFassung;
  };
  try{ sw.postMessage({ frage:"fassung" }, [kanal.port2]); }catch(e){}
}
function appUrl(){
  if(!/^https?:$/.test(location.protocol)) return APP_PUBLIC_URL;
  return location.origin + location.pathname.replace(/index\.html$/, "");
}
/* Einstellungen: oben offen, was man regelmäßig braucht („Wichtig“), darunter thematisch gruppiert und zugeklappt („Mehr“).
   Aufgeklappte Gruppen bleiben offen, solange man auf der Seite bleibt (die Seite zeichnet sich bei jeder Änderung neu). */
var einstOffen = {};
/* Einstellungen: alle Gruppen und Zeilen nach demselben Muster - Symbol links, Titel (+ Zeile darunter), rechts Pfeil */
var EINST_ICON = {
  fokus:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  darstellung:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  training:'<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  daten:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  quellen:'<path d="M5 4.5h10a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3z"/><path d="M5 16.5a3 3 0 0 1 3-3h10"/>',
  schutz:'<path d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V6z"/><path d="M9 12l2 2 4-4"/>'
};
var ICON_UPLOAD = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M4 19h16"/></svg>';
function einstKopf(ico, titel){
  return '<div class="opt-kopf"><span class="om-ico">'+svgIcon(ico)+'</span><span class="opt-t">'+esc(titel)+'</span></div>';
}
function einstLink(href, titel, unter, ico){
  return '<a class="opt-mehr opt-link" href="'+href+'" target="_blank" rel="noopener"><span class="opt-zeile"><span class="om-ico">'+svgIcon(ico)+'</span>'+
    '<span class="meta"><span class="name">'+esc(titel)+'</span><span class="sub">'+esc(unter)+'</span></span><span class="om-chev">'+ICON_CHEV+'</span></span></a>';
}
function einstMehr(key, titel, unter, inhalt, ico, cls){
  return '<details class="opt-mehr'+(cls ? ' '+cls : '')+'" data-mehr="'+key+'"'+(einstOffen[key] ? ' open' : '')+'>'+
    '<summary>'+(ico ? '<span class="om-ico">'+svgIcon(ico)+'</span>' : '')+
      '<span class="meta"><span class="name">'+esc(titel)+'</span><span class="sub">'+esc(unter)+'</span></span>'+
      '<span class="om-chev">'+ICON_CHEV+'</span></summary>'+
    '<div class="om-inhalt">'+inhalt+'</div></details>';
}
function renderSettings(){
  var s = state.db.settings;
  function zeile(attr, name, sub){
    return '<div class="list-item" '+attr+'>'+
      '<div class="meta"><div class="name">'+name+'</div><div class="sub">'+sub+'</div></div>'+
      '<span class="chip chev">'+ICON_CHEV+'</span></div>';
  }
  app.innerHTML =
    topbar(t("settings"), { back:"#home" }) +
    '<div class="section-title">'+esc(t("fokusTitel"))+'</div>'+
    '<div class="card">'+einstKopf(EINST_ICON.fokus, t("fokusLabel"))+'<div class="theme-pick">'+HOME_KEYS.map(function(k, i){
      return '<button type="button" data-fokus="'+k+'" aria-pressed="'+!fokusAus(k)+'" class="'+(i > 1 ? 'halb' : '')+(fokusAus(k) ? '' : ' active')+'">'+esc(bereichDaten(k)[1])+'</button>';
    }).join("")+'</div><div style="font-size:12px;color:var(--text-dim);margin-top:10px;">'+esc(t("fokusHint"))+'</div></div>'+
    '<div class="section-title">'+t("optWichtig")+'</div>'+
    '<div class="card">'+einstKopf(EINST_ICON.darstellung, t("appearance"))+'<div class="theme-pick">'+
      themeBtn("system",t("thSystem"))+themeBtn("light",t("thLight"))+themeBtn("dark",t("thDark"))+
      themeBtn("nacht",t("thNacht"),"halb")+themeBtn("kodak",t("thKodak"),"vintage halb")+
    '</div>'+
    '<div style="font-size:12px;color:var(--text-dim);margin-top:10px;">'+t("themeInfo")+'</div>'+
    '</div>'+
    '<div class="card">'+einstKopf(EINST_ICON.training, t("optTraining"))+
      '<div class="range-row"><div class="label">'+t("volume")+' <span id="f-volume-label">'+Math.round(s.volume*100)+'%</span></div>'+
      '<input type="range" id="f-volume" min="0" max="100" step="5" value="'+Math.round(s.volume*100)+'">'+
      '<div class="range-scale"><span>0</span><span>100</span></div>'+
      '<div class="range-hint">'+t("volMusicHint")+'</div></div>'+
      toggleRow("f-voice",t("voice"), t("voiceDesc"), s.voice !== false)+
    '</div>'+
    '<div class="card">'+einstKopf(EINST_ICON.daten, t("data"))+
      '<div class="snap-zeile" id="snap-zeile">'+snapZeileHTML()+'</div>'+
      (kannBackupTeilen() ? '<button class="btn btn-secondary" data-sharebackup>'+ICON_SHARE+' '+t("shareBackup")+'</button>' : '')+
      '<button class="btn btn-secondary" data-export>'+ICON_DOWNLOAD+' '+t("exportBackup")+'</button>'+
      '<button class="btn btn-secondary" data-import>'+ICON_UPLOAD+' '+t("importBackup")+'</button>'+
      '<input type="file" id="import-file" style="display:none">'+
    '</div>'+
    '<div class="section-title">'+t("optMehr")+'</div>'+
    einstMehr("timer", t("mehrTimer"), t("mehrTimerSub"),
      toggleRow("f-sound",t("sound"), t("soundDesc"), s.sound)+
      '<div class="range-row" data-opensounds style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;">'+
        '<div><div class="label" style="margin:0 0 2px;">'+t("soundStyle")+'</div><div style="font-size:13px;color:var(--text-dim);">'+esc(soundLabel(s.soundStyle))+'</div></div>'+
        '<span class="chip chev">'+ICON_CHEV+'</span>'+
      '</div>'+
      toggleRow("f-space",t("space"), t("spaceDesc"), s.space)+
      toggleRow("f-countin",t("countIn"), t("countInDesc"), s.countIn)+
      toggleRow("f-vibration",t("vibration"), t("vibrationDesc"), s.vibration)+
      toggleRow("f-keepawake",t("keepAwake"), t("keepAwakeDesc"), s.keepAwake), HOME_ICON.intervall)+
    einstMehr("sprache", t("language"), currentLang() === "en" ? "English" : "Deutsch",
      '<div class="theme-pick lang-pick">'+langBtn("de","Deutsch")+langBtn("en","English")+'</div>',
      '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>')+
    einstMehr("app", t("mehrApp"), t("mehrAppSub"),
      zeile('data-intro role="button" tabindex="0"', t("introRow"), t("introRowSub"))+
      zeile('data-nav="#install"', t("installRow"), t("installRowSub"))+
      '<div class="opt-label" style="margin-top:6px">'+t("shareTitle")+'</div>'+
      '<div class="share-card"><div class="share-url" id="share-url">'+esc(appUrl())+'</div>'+
      '<button type="button" class="btn btn-secondary" data-sharecopy>'+t("shareCopy")+'</button></div>',
      '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>')+
    einstLink("quellen.html", t("sourcesRow"), t("sourcesRowSub"), EINST_ICON.quellen)+
    einstLink("privacy.html", t("privacyRow"), t("privacyRowSub"), EINST_ICON.schutz)+
    einstMehr("loeschen", t("deleteAll"), t("mehrLoeschenSub"),
      '<button class="btn btn-danger" data-reset>'+t("deleteAll")+'</button>', '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/>', "opt-danger")+
    '<div class="empty" style="padding:20px 8px;">'+t("localNote")+'<br><small class="app-version" id="app-version"></small></div>';
  app.querySelectorAll("details[data-mehr]").forEach(function(d){
    d.addEventListener("toggle", function(){ einstOffen[d.getAttribute("data-mehr")] = d.open; });
  });

  bindCommon();
  app.querySelectorAll("[data-fokus]").forEach(function(b){
    b.addEventListener("click", function(){
      var k = b.getAttribute("data-fokus"), an = !b.classList.contains("active");
      var ks = k === "katalog" ? ["lib", "timer"] : [k];   // der Katalog schaltet Air und Studio zusammen
      var aus = selArr(s.fokusAus).filter(function(x){ return ks.indexOf(x) < 0; });
      if(!an) ks.forEach(function(x){ aus.push(x); });
      s.fokusAus = aus; save();
      b.classList.toggle("active", an); b.setAttribute("aria-pressed", String(an));
    });
  });

  function themeBtn(val, label, cls){
    var classes = (cls||"") + (s.theme===val ? " active" : "");
    return '<button data-theme="'+val+'" class="'+classes.trim()+'">'+label+'</button>';
  }
  function langBtn(val, label){
    return '<button data-lang="'+val+'" class="'+(currentLang()===val ? "active" : "")+'">'+label+'</button>';
  }
  app.querySelectorAll("[data-theme]").forEach(function(btn){
    btn.addEventListener("click", function(){
      s.theme = btn.getAttribute("data-theme");
      save(); applyTheme(); renderSettings();
    });
  });
  app.querySelectorAll("[data-lang]").forEach(function(btn){
    btn.addEventListener("click", function(){
      s.lang = btn.getAttribute("data-lang");
      save(); applyLang(); renderSettings();
    });
  });

  /* App teilen: Link kopieren, per WhatsApp oder über das Teilen-Menü des Handys */
  app.querySelector("[data-sharecopy]").addEventListener("click", function(){ copyText(appUrl(), t("shareCopied")); });
  app.querySelector("[data-intro]").addEventListener("click", openIntro);
  app.querySelector("[data-opensounds]").addEventListener("click", function(){
    openSoundSheet(function(){ renderSettings(); });
  });

  bindToggle("f-sound", function(v){ s.sound=v; save(); });
  bindToggle("f-space", function(v){ s.space=v; save(); applySpace(); phaseBeep("work"); });
  bindToggle("f-countin", function(v){ s.countIn=v; save(); });
  bindToggle("f-vibration", function(v){ s.vibration=v; save(); });
  bindToggle("f-keepawake", function(v){ s.keepAwake=v; save(); });
  bindToggle("f-voice", function(v){ s.voice=v; save(); });

  var volEl = app.querySelector("#f-volume");
  var volLabel = app.querySelector("#f-volume-label");
  volEl.addEventListener("input", function(){
    s.volume = parseInt(volEl.value)/100;
    volLabel.textContent = volEl.value+"%";
    save();
  });
  volEl.addEventListener("change", function(){
    phaseBeep("work");
  });

  app.querySelector("[data-export]").addEventListener("click", exportBackup);
  var teilBtn = app.querySelector("[data-sharebackup]");
  if(teilBtn) teilBtn.addEventListener("click", function(){ shareBackup(); });
  bindSnapZeile();
  fassungZeigen();
  app.querySelector("[data-import]").addEventListener("click", function(){
    app.querySelector("#import-file").click();
  });
  app.querySelector("#import-file").addEventListener("change", function(ev){
    var file = ev.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      try{
        var parsed = JSON.parse(reader.result);
        // nur echte BLOC-Sicherungen (z. B. nicht versehentlich die Sicherung des Vokabelkastens) - sonst wäre alles weg
        var istBloc = parsed && typeof parsed === "object" && !Array.isArray(parsed.cards) &&
          (Array.isArray(parsed.blocks) || Array.isArray(parsed.workouts) || Array.isArray(parsed.myWorkouts) || (parsed.settings && typeof parsed.settings === "object"));
        if(!istBloc){ showToast(t("fileError")); return; }
        confirmSheet(t("importQ"), t("importText"), t("importBtn"), function(){
          var db = defaultDB();
          db.blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
          db.workouts = Array.isArray(parsed.workouts) ? parsed.workouts : [];
          db.myWorkouts = Array.isArray(parsed.myWorkouts) ? parsed.myWorkouts : [];
          db.customEx = Array.isArray(parsed.customEx) ? parsed.customEx : [];
          db.history = Array.isArray(parsed.history) ? parsed.history : [];
    pruneHistory(db);
          if(parsed.settings) Object.assign(db.settings, parsed.settings);
          db.settings.theme = migrateTheme(db.settings.theme);
          db.settings.soundStyle = migrateSound(db.settings.soundStyle);
          migrateExIds(db);
          state.db = db; save(); syncCustomEx(); applyTheme(); applyLang(); applySpace();
          go("#home");
        });
      }catch(e){ showToast(t("fileError")); }
    };
    reader.readAsText(file);
  });
  app.querySelector("[data-reset]").addEventListener("click", function(){
    confirmSheet(t("deleteAllQ"), t("deleteAllText"), t("deleteAllBtn"), function(){
      state.db = defaultDB(); save(); syncCustomEx(); applyTheme(); applyLang(); applySpace();
      go("#home");
    });
  });
}
function toggleRow(id, label, desc, checked){
  return '<div class="toggle-row"><div><div class="label">'+label+'</div><div class="desc">'+desc+'</div></div>'+
    '<label class="switch"><input type="checkbox" id="'+id+'" '+(checked?"checked":"")+'><span class="track"></span><span class="thumb"></span></label></div>';
}
function bindToggle(id, cb){
  app.querySelector("#"+id).addEventListener("change", function(e){ cb(e.target.checked); });
}

