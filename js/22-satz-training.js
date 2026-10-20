"use strict";
/* ============ Training nach Sätzen: Glas-Bereich zum Wischen ============
   Ein BLOC (mit seinen weiteren BLOCs) als Reihe von Karten: nach links oder rechts wischen wechselt die Übung, oben zeigen Punkte, bei welcher man ist.
   Je Karte: Gewicht und Wiederholungen per Zähler, „Satz eintragen“ speichert wie die Übungskarte (studioSatzLog), danach läuft die Pause.
   Erklärungen stehen eingeklappt darunter. Route: #satz/<BLOC-ID>/<Nummer>. */
var satzUhr = 0;   // Zähler der Satzpause (nur eine zugleich)
function satzListe(p){
  var l = stPlanIds(p).slice();
  planFolge(p).forEach(function(q){ stPlanIds(q).forEach(function(id){ if(l.indexOf(id) < 0) l.push(id); }); });
  return l;
}
function satzKarteHTML(id, i, n){
  var ex = findExercise(id);
  if(!ex) return "";
  var koerper = studioNurBlock(ex), z = studioZiel(id), e = studioEintrag(id) || {}, log = e.log || [], heute = studioTag(Date.now());
  var h = log.length && studioTag(log[log.length-1].at) === heute ? log[log.length-1] : null;
  var v = studioVorschlag(id), letzte = studioLetzte(id, false), fertig = h && h.s.length >= z.saetze, lang = currentLang() === "en" ? 1 : 0;
  if(e.kg != null && !h) v.kg = e.kg;
  var info = EX_INFO[id], post = EX_POSTURE[id];
  return '<section class="satz-karte" data-satzk="'+i+'" data-id="'+esc(id)+'" aria-label="'+esc((i+1)+"/"+n+" "+tplText(ex.name))+'">'+
    '<div class="satz-glas">'+
      '<h2 class="satz-name">'+esc(tplText(ex.name))+(info ? ' <button type="button" class="info-btn" data-satzinfo="'+esc(id)+'" aria-label="'+esc(t("info"))+'">i</button>' : '')+'</h2>'+
      (kachelMuskel(ex) ? '<div class="satz-mus">'+kachelMuskel(ex)+'</div>' : '')+
      (ILLU[id] ? '<div class="satz-figur">'+illuHTML(id, "satz-illu")+'</div>' : '')+
      '<div class="satz-ziel">'+esc(t("stGoal"))+' <b>'+satzName(z.saetze)+' × '+z.wdh+'</b>'+(e.kg != null && !koerper ? ' · <b>'+studioKg(e.kg)+' kg</b>' : '')+'</div>'+
      (letzte ? '<div class="satz-zeile"><span>'+esc(t("stLetztes"))+'</span>'+letzte.s.map(function(x){
        return '<button type="button" class="satz-chip" data-ukg="'+x[0]+'" data-uw="'+x[1]+'" aria-label="'+esc(t("stUebernehmen")+" "+studioKg(x[0])+" × "+x[1])+'">'+esc(satzText(x).replace("×", " × "))+'</button>'; }).join("")+'</div>' : '')+
      '<div class="satz-zeile"><span>'+esc(t("stToday"))+'</span>'+(h && h.s.length ? h.s.map(function(x, k){ return '<span class="satz-chip an">'+(k+1)+'. '+esc(satzText(x).replace("×", " × "))+'</span>'; }).join("") : '<span class="satz-leer">–</span>')+'</div>'+
      '<div class="satz-eingabe'+(koerper ? ' eins' : '')+'">'+
        (koerper ? '' : '<div class="satz-feld"><label>'+esc(t("stKg"))+'</label><div class="satz-zaehler"><button type="button" data-kgminus aria-label="&minus;">&minus;</button>'+
          '<input type="text" inputmode="decimal" class="satz-kg" value="'+studioKg(v.kg)+'" aria-label="'+esc(t("stKg"))+'"><button type="button" data-kgplus aria-label="&plus;">&plus;</button></div></div>')+
        '<div class="satz-feld"><label>'+esc(t("stReps"))+'</label><div class="satz-zaehler"><button type="button" data-wminus aria-label="&minus;">&minus;</button>'+
          '<input type="number" inputmode="numeric" class="satz-w" value="'+v.wdh+'" aria-label="'+esc(t("stReps"))+'"><button type="button" data-wplus aria-label="&plus;">&plus;</button></div></div>'+
      '</div>'+
      '<button type="button" class="satz-los" data-satzset>✓ '+esc(t("stSetDone"))+' '+((h ? h.s.length : 0)+1)+'</button>'+
      '<div class="satz-pause" hidden><span>'+esc(t("stPause"))+'</span><b></b><button type="button" data-satzskip>'+esc(t("stSkip"))+'</button></div>'+
      (h && h.s.length ? '<button type="button" class="satz-undo" data-satzundo>'+esc(t("stUndo"))+'</button>' : '')+
      (fertig ? '<button type="button" class="satz-weiter" data-satzweiter>'+esc(i < n-1 ? t("satzNaechste") : t("trSpeichern"))+' ›</button>' : '')+
      (info ? '<details class="satz-info"><summary>'+esc(t("stInfo"))+'<span class="tpl-chev" aria-hidden="true">&#9662;</span></summary>'+
        '<ol>'+info[lang].split("|").map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ol>'+
        (post ? '<ul>'+post[lang*2].split("|").map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul><p><b>'+esc(t("avoid"))+':</b> '+esc(post[lang*2+1])+'</p>' : '')+'</details>' : '')+
    '</div></section>';
}
function renderSatzTraining(planId, start){
  var p = stPlanFind(planId), ids = p ? satzListe(p) : [];
  if(!p || !ids.length){ go("#katalog"); return; }
  start = clamp(parseInt(start) || 0, 0, ids.length - 1);
  var pt = stPlanAktiv && stPlanFind(stPlanAktiv) ? stPlanAktiv : (stPlanAktiv = p.id);
  app.innerHTML =
    '<div class="satz-root" id="satzRoot"><div class="satz-bg" aria-hidden="true"></div>'+
      '<div class="satz-top"><button type="button" class="exit" data-satzexit aria-label="'+esc(t("endBtn"))+'">&times;</button>'+
        '<div class="satz-punkte" role="tablist" aria-label="'+esc(p.name)+'">'+ids.map(function(id, i){
          var ex = findExercise(id); return '<button type="button" class="satz-punkt" data-satzgo="'+i+'" role="tab" aria-label="'+esc((i+1)+". "+(ex ? tplText(ex.name) : ""))+'"></button>'; }).join("")+'</div>'+
        '<button type="button" class="exit" data-satzsave aria-label="'+esc(t("trSpeichern"))+'">'+ICON_SAVE+'</button></div>'+
      '<div class="satz-logo" aria-hidden="true">BLOC · <span id="satz-nr"></span></div>'+
      '<div class="satz-wisch" id="satzWisch">'+ids.map(function(id, i){ return satzKarteHTML(id, i, ids.length); }).join("")+'</div>'+
    '</div>';
  var root = document.getElementById("satzRoot"), wisch = document.getElementById("satzWisch"), aktuell = -1;
  function breite(){ return wisch.clientWidth || 1; }
  function nr(i){
    if(i === aktuell) return; aktuell = i;
    root.querySelectorAll(".satz-punkt").forEach(function(d, k){ d.classList.toggle("an", k === i); d.setAttribute("aria-selected", k === i); });
    var el = document.getElementById("satz-nr"); if(el) el.textContent = (i+1)+" / "+ids.length;
  }
  function geheZu(i, weich){ i = clamp(i, 0, ids.length - 1); wisch.scrollTo({ left:i*breite(), behavior:weich ? "smooth" : "auto" }); nr(i); }
  wisch.addEventListener("scroll", function(){ nr(clamp(Math.round(wisch.scrollLeft/breite()), 0, ids.length - 1)); });
  root.querySelectorAll("[data-satzgo]").forEach(function(b){ b.addEventListener("click", function(){ geheZu(+b.getAttribute("data-satzgo"), true); }); });
  function raus(){ studioPauseStop(); if(satzUhr){ clearInterval(satzUhr); satzUhr = 0; } goBack("#katalog"); }
  root.querySelector("[data-satzexit]").addEventListener("click", raus);
  root.querySelector("[data-satzsave]").addEventListener("click", function(){ openTrainingSpeichern({ plan:p, ids:ids }, function(){}); });
  function pauseZeigen(){
    var el = root.querySelector(".satz-pause:not([hidden])");
    if(!studioPause){ if(el){ el.classList.add("vorbei"); el.querySelector("b").textContent = t("stPauseEnd"); } return; }
    var k = root.querySelector('.satz-karte[data-id="'+studioPause.id+'"] .satz-pause');
    if(!k) return;
    k.hidden = false; k.classList.remove("vorbei"); k.querySelector("b").textContent = fmtTime(Math.max(0, Math.ceil((studioPause.ende - Date.now())/1000)));
  }
  function karteNeu(i){
    var alt = wisch.children[i], neu = document.createElement("div"), id = ids[i];
    neu.innerHTML = satzKarteHTML(id, i, ids.length);
    wisch.replaceChild(neu.firstChild, alt); bindKarte(wisch.children[i]);
  }
  function bindKarte(k){
    var id = k.getAttribute("data-id"), i = +k.getAttribute("data-satzk"), ex = findExercise(id), z = studioZiel(id), koerper = studioNurBlock(ex);
    var kgIn = k.querySelector(".satz-kg"), wIn = k.querySelector(".satz-w");
    function kgWert(){ if(!kgIn) return 0; var x = parseFloat(String(kgIn.value).replace(",", ".")); return isFinite(x) && x >= 0 ? Math.min(500, x) : 0; }
    function tipp(){ vibrate(12); }
    var a;
    if((a = k.querySelector("[data-kgminus]"))) a.addEventListener("click", function(){ tipp(); kgIn.value = studioKg(Math.max(0, kgWert() - z.schritt)); });
    if((a = k.querySelector("[data-kgplus]"))) a.addEventListener("click", function(){ tipp(); kgIn.value = studioKg(kgWert() + z.schritt); });
    k.querySelector("[data-wminus]").addEventListener("click", function(){ tipp(); wIn.value = Math.max(1, (parseInt(wIn.value) || 0) - 1); });
    k.querySelector("[data-wplus]").addEventListener("click", function(){ tipp(); wIn.value = Math.min(100, (parseInt(wIn.value) || 0) + 1); });
    [kgIn, wIn].forEach(function(f){ if(f) f.addEventListener("focus", function(){ f.select(); }); });
    k.querySelectorAll("[data-ukg]").forEach(function(b){ b.addEventListener("click", function(){ tipp(); if(kgIn) kgIn.value = studioKg(+b.getAttribute("data-ukg")); wIn.value = b.getAttribute("data-uw"); }); });
    k.querySelector("[data-satzset]").addEventListener("click", function(){
      var kg = koerper ? 0 : kgWert(), w = Math.max(1, Math.min(100, parseInt(wIn.value) || 1)), e = studioEintrag(id) || {};
      studioSatzLog(id, kg, w);
      vibrate([40, 30, 70]);
      var h = (studioEintrag(id).log || []).slice(-1)[0], nSatz = h ? h.s.length : 1;
      satzFeedback(nSatz, satzText([kg, w]), false);
      var pause = e.pause || (koerper ? 60 : 90);
      studioPauseStart(id, pause);
      karteNeu(i); pauseZeigen();
      if(nSatz >= z.saetze && i < ids.length - 1) setTimeout(function(){ if(aktuell === i) geheZu(i + 1, true); }, 900);   // Ziel erreicht: weiter zur nächsten Übung
    });
    if((a = k.querySelector("[data-satzundo]"))) a.addEventListener("click", function(){
      var en = studioEintrag(id), l = en && en.log && en.log[en.log.length-1];
      if(l && studioTag(l.at) === studioTag(Date.now())){ l.s.pop(); if(!l.s.length) en.log.pop(); }
      studioPauseStop(); save(); trainingNachSatz(id); karteNeu(i);
    });
    if((a = k.querySelector("[data-satzskip]"))) a.addEventListener("click", function(){ studioPauseStop(); k.querySelector(".satz-pause").hidden = true; });
    if((a = k.querySelector("[data-satzweiter]"))) a.addEventListener("click", function(){
      if(i < ids.length - 1) geheZu(i + 1, true); else openTrainingSpeichern({ plan:p, ids:ids }, function(){});
    });
    if((a = k.querySelector("[data-satzinfo]"))) a.addEventListener("click", function(){ openExInfo(id, false); });
  }
  Array.prototype.forEach.call(wisch.children, bindKarte);
  if(satzUhr) clearInterval(satzUhr);
  satzUhr = setInterval(function(){ if(!document.getElementById("satzRoot")){ clearInterval(satzUhr); satzUhr = 0; return; } pauseZeigen(); }, 300);
  geheZu(start, false);
  requestAnimationFrame(function(){ geheZu(start, false); });   // nach dem ersten Layout nochmals, falls die Breite erst jetzt feststeht
}
