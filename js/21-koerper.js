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
/* Auswahl je Trainingstag: Meine Workouts, Workoutkatalog (ohne Aufwärmen/Dehnen), Run, Zufallstraining */
function planOptionenHTML(wert){
  function opt(v, label){ return '<option value="'+esc(v)+'"'+(v === wert ? ' selected' : '')+'>'+esc(label)+'</option>'; }
  var meine = (state.db.myWorkouts || []).filter(function(m){ return m && m.id && m.name; }).map(function(m){ return opt("my:"+m.id, m.name); }).join("");
  var kat = LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).map(function(lw){ return opt("lib:"+lw.id, tplText(lw.name)); }).join("");
  return '<option value="">'+esc(t("planWahlLeer"))+'</option>'+
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
      var v = p.wahl[d] || "";
      if(!v) return;
      var tag = kalTagKey(kalPlus(start, w*7 + d)), e = null;
      if(v.indexOf("my:") === 0) e = { art:"workout", ref:v.slice(3) };
      else if(v.indexOf("lib:") === 0) e = { art:"lib", ref:v.slice(4) };
      else if(v === "run") e = { art:"run" };
      else if(v === "zufall") e = { art:"zufall" };
      if(e){ e.tag = tag; out.push(e); }
    });
  }
  return out;
}
function renderPlanSeite(){
  var p = planEinst(), lang = currentLang() === "en" ? "en-GB" : "de-DE", n = planEintraege(p).length;
  function namen(d){ return kalPlus(planStart(), d).toLocaleDateString(lang, { weekday:"short" }).replace(/\.$/, ""); }
  var datum = planStart().toLocaleDateString(lang, { day:"numeric", month:"long" });
  app.innerHTML =
    topbar(t("tabKoerper"), { right:kopfSymboleNeu("stats") }) +
    '<div class="card kp-tipps"><div class="kp-titel">'+esc(t("planTippsTitel"))+'</div>'+
      '<ul>'+["planTipp1", "planTipp2", "planTipp3", "planTipp4"].map(function(k){ return '<li>'+esc(t(k))+'</li>'; }).join("")+'</ul>'+
      '<div class="kp-fuss">'+esc(t("planTippsFuss"))+'</div></div>'+
    '<div class="card kp-bau">'+
      '<div class="kp-titel">'+esc(t("planWochen"))+'</div>'+
      '<div class="kp-chips" role="group" aria-label="'+esc(t("planWochen"))+'">'+KP_WOCHEN.map(function(w){ return '<button type="button" class="kp-chip'+(p.wochen === w ? ' an' : '')+'" data-planwochen="'+w+'" aria-pressed="'+(p.wochen === w)+'">'+w+'</button>'; }).join("")+'</div>'+
      '<div class="kp-titel">'+esc(t("planTage"))+'</div>'+
      '<div class="kp-chips" role="group" aria-label="'+esc(t("planTage"))+'">'+[0, 1, 2, 3, 4, 5, 6].map(function(d){ var an = p.tage.indexOf(d) > -1; return '<button type="button" class="kp-chip'+(an ? ' an' : '')+'" data-plantag="'+d+'" aria-pressed="'+an+'">'+esc(namen(d))+'</button>'; }).join("")+'</div>'+
      (p.tage.length ? '<div class="kp-zeilen">'+p.tage.slice().sort(function(a, b){ return a - b; }).map(function(d){
        return '<label class="kp-zeile"><span>'+esc(namen(d))+'</span><select data-planwahl="'+d+'" aria-label="'+esc(namen(d))+'">'+planOptionenHTML(p.wahl[d] || "")+'</select></label>';
      }).join("")+'</div>' : '<div class="kp-leer">'+esc(t("planTageLeer"))+'</div>')+
      '<button type="button" class="btn btn-primary kp-ok" data-planok'+(n ? '' : ' disabled')+'>'+esc(t("planEintragen"))+'</button>'+
      '<div class="kp-fuss">'+esc(n ? t("planInfo", { n:n, datum:datum }) : t("planInfoLeer"))+'</div>'+
    '</div>'+
    '<div class="card kp-danach"><div class="kp-titel">'+esc(t("planDanachTitel"))+'</div><div class="kp-text">'+esc(t("planDanach"))+'</div></div>'+
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
    sel.addEventListener("change", function(){ p.wahl[sel.getAttribute("data-planwahl")] = sel.value; save(); renderKoerper(); });
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
