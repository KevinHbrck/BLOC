"use strict";
/* ============ Körper: Plan · Fortschritt (vierter Reiter der unteren Leiste) ============
   Zwei Seiten unter einem Reiter: „Plan“ (Trainingsplan für die nächsten Wochen bauen und in den Kalender eintragen) und „Fortschritt“ (die bisherige
   Statistik). Die Auswahl merkt sich settings.koerperTab. Der Plan nutzt nur vorhandene Bausteine: eigene Workouts, Workoutkatalog, Run, Zufallstraining
   und legt am Ende normale Kalender-Einträge an (settings.kalender); gespeichert wird nur die letzte Auswahl in settings.planBau. */
var KP_WOCHEN = [4, 6, 8, 12];

function koerperTab(){ return state.db.settings.koerperTab === "plan" ? "plan" : "fortschritt"; }
function koerperSegHTML(){
  function b(k, label){ return '<button type="button" data-koerpertab="'+k+'" class="'+(koerperTab() === k ? 'active' : '')+'" aria-pressed="'+(koerperTab() === k)+'">'+esc(label)+'</button>'; }
  return '<div class="rz koerper-rz" role="group">'+b("plan", t("planTab"))+b("fortschritt", t("tabFortschritt"))+'</div>';
}
function renderKoerper(){
  if(koerperTab() === "plan") renderPlanSeite(); else renderStats();
  var tb = app.querySelector(".topbar");
  if(tb) tb.insertAdjacentHTML("afterend", koerperSegHTML());
  app.querySelectorAll("[data-koerpertab]").forEach(function(b){
    b.addEventListener("click", function(){ state.db.settings.koerperTab = b.getAttribute("data-koerpertab"); save(); renderKoerper(); window.scrollTo(0, 0); });
  });
}

function planEinst(){
  var s = state.db.settings;
  if(!s.planBau || typeof s.planBau !== "object") s.planBau = { wochen:6, tage:[0, 2, 4], wahl:{} };
  var p = s.planBau;
  if(KP_WOCHEN.indexOf(p.wochen) < 0) p.wochen = 6;
  if(!Array.isArray(p.tage)) p.tage = [0, 2, 4];
  if(!p.wahl || typeof p.wahl !== "object") p.wahl = {};
  return p;
}
/* Je Trainingstag eine Liste von Einträgen (früher genau einer als Text): beides wird gelesen */
function planWahlListe(v){ return Array.isArray(v) ? v.filter(Boolean) : (v ? [v] : []); }
function planWahlName(v){
  if(v === "run") return t("planOptRun");
  if(v === "zufall") return t("planOptZufall");
  if(v.indexOf("my:") === 0){ var m = (state.db.myWorkouts || []).filter(function(x){ return x && x.id === v.slice(3); })[0]; return m ? m.name : t("untitled"); }
  if(v.indexOf("lib:") === 0){ var lw = findLibWorkout(v.slice(4)); return lw ? tplText(lw.name) : t("untitled"); }
  return v;
}
function planWahlArt(v){ return v === "run" ? "run" : v === "zufall" ? "zufall" : "kraft"; }
/* Auswahl je Trainingstag: Meine Workouts, Workoutkatalog (ohne Aufwärmen/Dehnen), Run, Zufallstraining */
function planOptionenHTML(wert, leer){
  function opt(v, label){ return '<option value="'+esc(v)+'"'+(v === wert ? ' selected' : '')+'>'+esc(label)+'</option>'; }
  var meine = (state.db.myWorkouts || []).filter(function(m){ return m && m.id && m.name; }).map(function(m){ return opt("my:"+m.id, m.name); }).join("");
  var kat = LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).map(function(lw){ return opt("lib:"+lw.id, tplText(lw.name)); }).join("");
  return '<option value="">+ '+esc(leer || t("planWahlLeer"))+'</option>'+
    (meine ? '<optgroup label="'+esc(t("planOptMeine"))+'">'+meine+'</optgroup>' : '')+
    '<optgroup label="'+esc(t("planOptKatalog"))+'">'+kat+'</optgroup>'+
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
        if(v.indexOf("my:") === 0) e = { art:"workout", ref:v.slice(3) };
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
function renderPlanSeite(){
  var p = planEinst(), lang = currentLang() === "en" ? "en-GB" : "de-DE", n = planEintraege(p).length;
  function namen(d){ return kalPlus(planStart(), d).toLocaleDateString(lang, { weekday:"short" }).replace(/\.$/, ""); }
  var datum = planStart().toLocaleDateString(lang, { day:"numeric", month:"long" });
  app.innerHTML =
    topbar(t("tabKoerper"), { back:"#home", right:kopfSymboleNeu("stats") }) +
    '<details class="card kp-tipps kp-klapp"><summary><span>'+esc(t("planTippsTitel"))+'</span><span class="tpl-chev" aria-hidden="true">&#9662;</span></summary>'+
      '<ul>'+["planTipp1", "planTipp2", "planTipp3", "planTipp4"].map(function(k){ return '<li>'+esc(t(k))+'</li>'; }).join("")+'</ul>'+
      '<div class="kp-text"><b>'+esc(t("planDanachTitel"))+'</b> '+esc(t("planDanach"))+'</div>'+
      '<div class="kp-fuss">'+esc(t("planTippsFuss"))+'</div>'+
      '<button type="button" class="btn btn-secondary kp-faq" data-nav="#training">'+esc(t("planZurFaq"))+'</button></details>'+
    '<div class="card kp-bau">'+
      '<div class="kp-titel">'+esc(t("planWochen"))+'</div>'+
      '<div class="kp-chips" role="group" aria-label="'+esc(t("planWochen"))+'">'+KP_WOCHEN.map(function(w){ return '<button type="button" class="kp-chip'+(p.wochen === w ? ' an' : '')+'" data-planwochen="'+w+'" aria-pressed="'+(p.wochen === w)+'">'+w+'</button>'; }).join("")+'</div>'+
      '<div class="kp-titel">'+esc(t("planTage"))+'</div>'+
      '<div class="kp-chips" role="group" aria-label="'+esc(t("planTage"))+'">'+[0, 1, 2, 3, 4, 5, 6].map(function(d){ var an = p.tage.indexOf(d) > -1; return '<button type="button" class="kp-chip'+(an ? ' an' : '')+'" data-plantag="'+d+'" aria-pressed="'+an+'">'+esc(namen(d))+'</button>'; }).join("")+'</div>'+
      (p.tage.length ? '<div class="kp-zeilen">'+p.tage.slice().sort(function(a, b){ return a - b; }).map(function(d){
        var l = planWahlListe(p.wahl[d]);
        return '<div class="kp-zeile"><span>'+esc(namen(d))+'</span><div class="kp-tag">'+
          l.map(function(v, i){ return '<span class="kp-wahl '+planWahlArt(v)+'"><i class="kv-p '+planWahlArt(v)+'"></i><b>'+esc(planWahlName(v))+'</b>'+
            '<button type="button" data-planweg="'+d+':'+i+'" aria-label="'+esc(t("del"))+'">&times;</button></span>'; }).join("")+
          '<select data-planwahl="'+d+'" aria-label="'+esc(namen(d))+'">'+planOptionenHTML("", l.length ? t("planWeitere") : t("planWahlLeer"))+'</select></div></div>';
      }).join("")+'</div>' : '<div class="kp-leer">'+esc(t("planTageLeer"))+'</div>')+
    '</div>'+
    (p.tage.length ? '<div class="card kp-visk"><div class="kp-titel">'+esc(t("planVisTitel"))+'</div>'+planVisHTML(p, namen)+
      '<button type="button" class="btn btn-primary kp-ok" data-planok'+(n ? '' : ' disabled')+'>'+esc(t("planEintragen"))+'</button>'+
      '<div class="kp-fuss">'+esc(n ? t("planInfo", { n:n, datum:datum }) : t("planInfoLeer"))+'</div></div>' : '')+
    '<div style="height:40px"></div>';
  bindCommon();
  app.querySelectorAll("[data-planwochen]").forEach(function(b){
    b.addEventListener("click", function(){ p.wochen = +b.getAttribute("data-planwochen"); save(); renderKoerper(); });
  });
  app.querySelectorAll("[data-plantag]").forEach(function(b){
    b.addEventListener("click", function(){
      var d = +b.getAttribute("data-plantag"), i = p.tage.indexOf(d);
      if(i > -1) p.tage.splice(i, 1); else p.tage.push(d);
      save(); renderKoerper();
    });
  });
  app.querySelectorAll("[data-planwahl]").forEach(function(sel){
    sel.addEventListener("change", function(){
      if(!sel.value) return;
      var d = sel.getAttribute("data-planwahl"), l = planWahlListe(p.wahl[d]);
      l.push(sel.value); p.wahl[d] = l; save(); renderKoerper();
    });
  });
  app.querySelectorAll("[data-planweg]").forEach(function(b){
    b.addEventListener("click", function(){
      var a = b.getAttribute("data-planweg").split(":"), l = planWahlListe(p.wahl[a[0]]);
      l.splice(+a[1], 1); p.wahl[a[0]] = l; save(); renderKoerper();
    });
  });
  var ok = app.querySelector("[data-planok]");
  if(ok) ok.addEventListener("click", function(){
    var l = planEintraege(p);
    if(!l.length) return;
    l.forEach(function(e){ kalHinzu(e.tag, { art:e.art, ref:e.ref }); });
    kalBasis = planStart(); kalAnsicht = "woche";
    showToast(t("planFertig", { n:l.length }));
    go("#kalender");
  });
}
