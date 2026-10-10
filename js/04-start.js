"use strict";
/* ============ Startseite ============ */
var HOME_ICON = {
  timer:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',   /* Freies Training: Hantel */
  intervall:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5M18 7l1.5-1.5"/>',   /* Timer: Stoppuhr */
  lib:'<path d="M3 8.5h10a3 3 0 1 0-3-3"/><path d="M3 12.5h15a3 3 0 1 1-3 3"/><path d="M3 16.5h6"/>',   /* Air: Wind (nur noch Statistik) */
  katalog:'<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',   /* Katalog: vier Kacheln */
  reps:'<path d="M2.5 20l6.5-11.5 3.8 6.3 2.7-4.3 6 9.5z"/><path d="M9 8.5V3.5l3.5 1.5L9 6.5"/>',   /* Summit: Gipfel mit Fahne */
  warm:'<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 2 7-2M12 10.5v4.5l-4.5 5.5M12 15l4.5 5.5"/>',   /* Mobility & Stretch: Figur streckt sich */
  run:'<circle cx="14" cy="4.5" r="2"/><path d="M6 21l3-6 3 2v5M9 15l1-4 4-1 2 3 3 1M10 11L8 8"/>'   /* Lauf: Läufer */
};
/* „Überrasch mich“: Zauberstab mit Funken (klarer und moderner als die beiden Sterne davor) */
var ICON_UEBERRASCH = '<path d="M4.5 19.5L14.5 9.5"/><path d="M13 3.5l.9 2.2 2.2.9-2.2.9L13 9.7l-.9-2.2-2.2-.9 2.2-.9z"/><path d="M19.5 11.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/><path d="M6 5l.5 1.2 1.2.5-1.2.5L6 8.4l-.5-1.2-1.2-.5 1.2-.5z"/>';
var ICON_STAR = '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>';
/* Bereichs-Kachel (zwei nebeneinander): Symbol oben, Titel, Kurzbeschreibung, Pfeil */
/* art: "gross" (Workouts, der wichtigste Bereich) oder "zeile" (die übrigen, als ruhige Liste) */
function areaTile(key, href, titel, unter, farbe, art){
  return '<div class="area-tile'+(art ? ' '+art : '')+'" data-nav="'+href+'" data-bereich="'+key+'" role="button" tabindex="0" style="--c:'+farbe+'">'+
      '<span class="at-ico">'+svgIcon(HOME_ICON[key])+'</span>'+
      '<span class="at-text"><b class="at-name">'+esc(titel)+'</b><small class="at-sub">'+esc(unter)+'</small></span>'+
      '<span class="at-chev">'+ICON_CHEV+'</span>'+
    '</div>';
}
/* Bereiche der Startseite: Reihenfolge per langem Drücken änderbar (settings.bereiche), der oberste steht groß vorn */
var BEREICH_KEYS = ["lib", "timer", "intervall", "reps", "run", "warm"];   // Bereiche der Statistik (Verlauf kennt Air und Studio weiter getrennt)
var HOME_KEYS = ["katalog", "intervall", "reps", "run", "warm"];   // Startseite, Sortierung, Fokus: Air und Studio sind der Katalog
function bereichDaten(k){
  if(k === "katalog") return ["#katalog", t("katalog"), t("htKatalog", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length,
    e:EXERCISES.filter(function(ex){ return !ex.custom && ex.main !== "stretch"; }).length }), "var(--tp-color)"];
  if(k === "lib") return ["#library", t("library"), t("htLibN", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length,
    e:EXERCISES.filter(function(ex){ return !ex.custom && fuerWorkout(ex); }).length }), "var(--tp-color)"];
  if(k === "intervall"){ var tw = state.db.workouts.length, tb = state.db.blocks.length; return ["#intervall", t("tabTimer"), tw || tb ? t("tmQuick", { w:tw, b:tb }) : t("tmQuickLeer"), "var(--ti-color)"]; }
  if(k === "timer") return ["#timers", t("timers"), t("htTimers", { n:Object.keys(STUDIO_NUR).length }), "var(--bl-color)"];
  if(k === "reps") return ["#reps", t("repTitle"), t("htReps"), "var(--rep-color)"];
  if(k === "run") return ["#run", t("runTitle"), run ? t("runLaeuft", { km:runKm(run.dist) }) : t("runTeaser"), "var(--run-color, #e5573f)"];
  return ["#warmstretch", t("warmTitle"), t("htWarm", { p:LIB_WORKOUTS.filter(libIstWarmDehn).length }), "var(--ws-color)"];
}
/* Gespeicherte Reihenfolgen kennen noch „lib“ (Air) und „timer“ (Studio): beide stehen jetzt als „katalog“ an der Stelle des ersten */
function bereichReihe(){
  var r = [];
  selArr(state.db.settings.bereiche).forEach(function(k){
    if(k === "lib" || k === "timer") k = "katalog";
    if(HOME_KEYS.indexOf(k) > -1 && r.indexOf(k) < 0) r.push(k);
  });
  HOME_KEYS.forEach(function(k){ if(r.indexOf(k) < 0) r.push(k); });
  return r;
}
/* Fokus (Einstellungen): Bereiche, die man nicht braucht, verschwinden von der Startseite (settings.fokusAus = Liste der Schlüssel); die Daten bleiben, die Suche findet weiterhin alles.
   Der Katalog ist nur aus, wenn Air und Studio beide aus sind (die Statistik kennt die beiden weiter einzeln). */
function fokusAusRoh(k){ return selArr(state.db.settings.fokusAus).indexOf(k) > -1; }
function fokusAus(k){ return k === "katalog" ? fokusAusRoh("lib") && fokusAusRoh("timer") : fokusAusRoh(k); }
function bereicheHTML(){
  var r = bereichReihe().filter(function(k){ return !fokusAus(k); });
  if(!r.length) return '<div class="card fokus-leer"><div>'+esc(t("fokusAlleAus"))+'</div><button type="button" class="btn btn-secondary" data-nav="#settings">'+esc(t("fokusAendern"))+'</button></div>';
  function kachel(k, art){ var d = bereichDaten(k); return areaTile(k, d[0], d[1], d[2], d[3], art); }
  return '<div class="area-bereiche">'+kachel(r[0], "gross")+
    '<div class="area-gruppe">'+r.slice(1).map(function(k){ return kachel(k, "zeile"); }).join("")+'</div></div>';
}
/* Langes Drücken (0,5 s, ohne zu wischen); der Klick danach wird geschluckt, damit die Seite nicht wechselt */
var langDruckSperre = 0;
document.addEventListener("click", function(e){ if(Date.now() < langDruckSperre){ e.stopPropagation(); e.preventDefault(); } }, true);
function langDruck(el, fn){
  var tm = 0, x0 = 0, y0 = 0;
  function stop(){ if(tm){ clearTimeout(tm); tm = 0; } }
  el.addEventListener("pointerdown", function(e){
    x0 = e.clientX; y0 = e.clientY; stop();
    tm = setTimeout(function(){
      tm = 0; langDruckSperre = Date.now() + 700;
      try { if(navigator.vibrate) navigator.vibrate(15); } catch(err){}
      fn();
    }, 500);
  });
  el.addEventListener("pointermove", function(e){ if(tm && Math.abs(e.clientX-x0) + Math.abs(e.clientY-y0) > 10) stop(); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ el.addEventListener(ev, stop); });
  el.addEventListener("contextmenu", function(e){ e.preventDefault(); });
}
function openBereicheSheet(){
  var root = document.getElementById("overlayRoot"), r = bereichReihe();
  function zeichnen(){
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet bereiche-sheet">'+
      '<h3>'+esc(t("areasSort"))+'</h3><p>'+esc(t("areasSortHint"))+'</p>'+
      '<div class="bs-liste">'+r.map(function(k, i){
        var d = bereichDaten(k);
        return '<div class="bs-zeile" style="--c:'+d[3]+'"><span class="at-ico">'+svgIcon(HOME_ICON[k])+'</span><b>'+esc(d[1])+'</b>'+
          '<button type="button" class="bs-pfeil" data-hoch="'+i+'"'+(i === 0 ? ' disabled' : '')+' aria-label="'+esc(t("moveUp"))+'">&#8593;</button>'+
          '<button type="button" class="bs-pfeil" data-runter="'+i+'"'+(i === r.length-1 ? ' disabled' : '')+' aria-label="'+esc(t("moveDown"))+'">&#8595;</button></div>';
      }).join("")+'</div>'+
      '<div class="btn-row"><button class="btn btn-secondary" data-cancel>'+t("cancel")+'</button>'+
      '<button class="btn btn-primary" data-ok>'+ICON_SAVE+' '+t("save")+'</button></div>'+
      '</div></div>';
    function tausch(i, j){ var x = r[i]; r[i] = r[j]; r[j] = x; zeichnen(); }
    root.querySelectorAll("[data-hoch]").forEach(function(b){ b.addEventListener("click", function(){ var i = +b.getAttribute("data-hoch"); if(i > 0) tausch(i, i-1); }); });
    root.querySelectorAll("[data-runter]").forEach(function(b){ b.addEventListener("click", function(){ var i = +b.getAttribute("data-runter"); if(i < r.length-1) tausch(i, i+1); }); });
    root.querySelector("[data-cancel]").addEventListener("click", schliessen);
    root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) schliessen(); });
    root.querySelector("[data-ok]").addEventListener("click", function(){
      state.db.settings.bereiche = r.slice(); save(); schliessen();
      if((parseHash()[0] || "home") === "home") renderHome();
    });
  }
  function schliessen(){ root.innerHTML = ""; }
  zeichnen();
}
/* „Überrasch mich“: schmale Leiste (eine Zeile) direkt unter den Reitern von Air - das Alleinstellungsmerkmal, aber ohne viel Höhe zu kosten */
function surpriseLeisteHTML(){
  return '<button type="button" class="sp-leiste" data-surprise title="'+esc(t("spSub"))+'">'+svgIcon(ICON_UEBERRASCH)+'<b>'+esc(t("surprise"))+'</b>'+
    '<span class="sp-chev">'+ICON_CHEV+'</span></button>';
}
/* Reiterzeile: schlanke Reiter mit Unterstrich in der Farbe des Bereichs (Air, Studio, Mobility & Stretch, Summit) */
function reiterZeileHTML(farbe, knoepfe){ return '<div class="rz" style="--rz:'+farbe+'">'+knoepfe+'</div>'; }
