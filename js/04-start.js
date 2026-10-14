"use strict";
/* ============ Startseite ============ */
var HOME_ICON = {
  timer:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',   /* Freies Training: Hantel */
  intervall:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5M18 7l1.5-1.5"/>',   /* Timer: Stoppuhr */
  lib:'<path d="M3 8.5h10a3 3 0 1 0-3-3"/><path d="M3 12.5h15a3 3 0 1 1-3 3"/><path d="M3 16.5h6"/>',   /* Air: Wind (Menüs beim langen Drücken) */
  katalog:'<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',   /* Katalog: vier Kacheln */
  reps:'<path d="M2.5 20l6.5-11.5 3.8 6.3 2.7-4.3 6 9.5z"/><path d="M9 8.5V3.5l3.5 1.5L9 6.5"/>',   /* Summit: Gipfel mit Fahne */
  warm:'<circle cx="18.4" cy="6.7" r="2.2"/><path d="M3.5 18.3H11c2.4 0 4.4-1.7 5.3-5.9l1.2-3.2M16.3 12.6l-.5 6.9M3 21h18"/>',   /* Mobility & Stretch: Figur liegt auf dem Boden und drückt den Oberkörper nach oben (Kobra) */
  run:'<circle cx="14" cy="4.5" r="2"/><path d="M6 21l3-6 3 2v5M9 15l1-4 4-1 2 3 3 1M10 11L8 8"/>'   /* Lauf: Läufer */
};
/* „Überrasch mich“: ein schlichter Würfel (erwachsener als der frühere Zauberstab mit Funken) */
var ICON_UEBERRASCH = '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none"/>';
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
var BEREICH_KEYS = ["lib", "timer", "intervall", "reps", "run", "warm"];   // Bereiche im Verlauf (gespeichert bleibt Air = lib und Studio = timer); die Statistik zeigt beide gemeinsam als „Workout“
var HOME_KEYS = ["katalog", "warm", "intervall", "reps", "run"];   // Startseite, Sortierung, Fokus: Air und Studio sind der Katalog
var HOME_GROSS = ["katalog"];   // steht fest vorn und ist als Kopfblock „Bereit für dein Training?“ (heroHTML) die große Kachel; Mobility & Stretch, Timer, Summit und Run sind „Weitere Bereiche“ als Liste
function bereichDaten(k){
  if(k === "katalog") return ["#katalog", t("katalog"), t("htKatalog", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length,
    e:EXERCISES.filter(function(ex){ return !ex.custom && ex.main !== "stretch"; }).length }), "var(--accent)"];
  if(k === "intervall"){ var tw = state.db.workouts.length, tb = state.db.blocks.length; return ["#intervall", t("tabTimer"), tw || tb ? t("tmQuick", { w:tw, b:tb }) : t("tmQuickLeer"), "var(--ti-color)"]; }
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
   Der Katalog ist nur aus, wenn Air und Studio beide aus sind (im Verlauf bleiben sie getrennt gespeichert). */
function fokusAusRoh(k){ return selArr(state.db.settings.fokusAus).indexOf(k) > -1; }
function fokusAus(k){ return k === "katalog" ? fokusAusRoh("lib") && fokusAusRoh("timer") : fokusAusRoh(k); }
/* „Weitere Bereiche“: Mobility & Stretch, Timer, Summit und Run als eine ruhige Liste in der gewählten Reihenfolge; Workout ist der Kopfblock darüber.
   Leer, wenn nur Workout übrig ist; die Hinweiskarte erscheint erst, wenn gar nichts mehr eingeblendet ist (auch Workout nicht). */
function bereicheHTML(){
  var r = bereichReihe().filter(function(k){ return !fokusAus(k); });
  if(!r.length) return '<div class="card fokus-leer"><div>'+esc(t("fokusAlleAus"))+'</div><button type="button" class="btn btn-secondary" data-nav="#settings">'+esc(t("fokusAendern"))+'</button></div>';
  var klein = r.filter(function(k){ return HOME_GROSS.indexOf(k) < 0; });
  if(!klein.length) return "";
  return '<div class="area-bereiche"><div class="area-gruppe">'+klein.map(function(k){ var d = bereichDaten(k); return areaTile(k, d[0], d[1], d[2], d[3], "zeile"); }).join("")+'</div></div>';
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
  /* sortiert werden nur Timer, Summit und Run; Workout und Mobility & Stretch stehen fest oben */
  var root = document.getElementById("overlayRoot"), r = bereichReihe().filter(function(k){ return HOME_GROSS.indexOf(k) < 0; });
  function zeichnen(){
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet bereiche-sheet">'+
      '<h3>'+esc(t("areasSort"))+'</h3><p>'+esc(t("areasSortHint"))+'</p>'+
      '<div class="bs-liste">'+r.map(function(k, i){
        var d = bereichDaten(k);
        return '<div class="bs-zeile" data-bereich="'+k+'" style="--c:'+d[3]+'"><span class="at-ico">'+svgIcon(HOME_ICON[k])+'</span><b>'+esc(d[1])+'</b>'+
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
      state.db.settings.bereiche = HOME_GROSS.concat(r); save(); schliessen();
      if((parseHash()[0] || "home") === "home") renderHome();
    });
  }
  function schliessen(){ root.innerHTML = ""; }
  zeichnen();
}
/* „Überrasch mich“: schmale Leiste (eine Zeile) direkt unter den Reitern vom Workout-Bereich - das Alleinstellungsmerkmal, aber ohne viel Höhe zu kosten */
/* Bild-Kopf der Bereichsseiten (Mobility & Stretch, Summit, Run): ein schmales Foto direkt unter der Kopfzeile. Fotos: Pexels (siehe quellen.html) */
var BEREICH_BILD = { suche:"img/bereich-suche.jpg", warm:"img/bereich-mobility.jpg", intervall:"img/bereich-timer.jpg", reps:"img/bereich-summit.jpg", run:"img/bereich-run.jpg" };
function bereichBildHTML(key){
  return '<div class="bereich-bild"><img src="'+BEREICH_BILD[key]+'" alt="" draggable="false"></div>';
}
/* Kopfblock der Startseite („Bereit für dein Training?“): ein Tipp führt direkt in den Baukasten (Workout › Baukasten). Foto: Pexels (siehe quellen.html) */
function heroHTML(){
  if(fokusAus("katalog")) return "";   // Workout in den Einstellungen ausgeblendet: dann auch kein Kopfblock
  var tag =new Date().toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { weekday:"long" });
  return '<section class="home-hero">'+
    '<img class="hh-bild" src="img/start-halle.jpg" alt="" draggable="false">'+
    '<button type="button" class="hh-main" data-herostart>'+
      '<span class="hh-label">'+esc(t("heroHeute", { d:tag }))+'</span>'+
      '<b class="hh-titel">'+esc(t("heroTitel"))+'</b>'+
      '<span class="hh-los">'+ICON_PLAY+'<span>'+esc(t("heroLos"))+'</span></span>'+
    '</button>'+
  '</section>';
}
/* Reiterzeile: schlanke Reiter mit Unterstrich in der Farbe des Bereichs (Workout, Mobility & Stretch, Summit) */
function reiterZeileHTML(farbe, knoepfe){ return '<div class="rz" style="--rz:'+farbe+'">'+knoepfe+'</div>'; }
