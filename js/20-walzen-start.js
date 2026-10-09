"use strict";
/* ============ Walzenzähler (Vintage-Designs) ============
   Jede Stelle ist eine 3D-Walze mit rundum aufgedruckten Ziffern, die per rotateX gedreht wird.
   Das Verhalten ist einem mechanischen Kilometerzähler nachempfunden:
   - Die Einer-Walze rastet jede Sekunde mit leichtem Überschwingen in die nächste Ziffer ein;
     die neue Ziffer kommt von oben, die alte dreht nach unten weg.
   - Höhere Walzen bahnen ihren Wechsel an: schon einige Sekunden vorher drehen sie langsam ein
     Stück vor, sodass die nächste Ziffer oben ins Fenster lugt - wie das Übertragsritzel eines
     echten Zählwerks, das allmählich eingreift.
   - Beim Übertrag rastet zuerst die rechte Walze ein, jede Stelle weiter links etwas später.
   - Jede Walze sitzt minimal schief (Spiel im Getriebe).
   - Beim Start, bei "Phase neu" und beim Phasenwechsel drehen die Walzen sichtbar auf den neuen
     Stand, statt zu springen. */
var ODO_FACE_H = 1.1;      // Höhe einer Ziffernfläche (em) - bestimmt den Walzenradius
var ODO_ROLL_MS = 380;     // Dauer des Einrastens nach einem Wechsel
var ODO_STAGGER_MS = 45;   // jede Stelle weiter links rastet so viel später ein
var ODO_JUMP_MS = 750;     // Drehen auf einen neuen Stand (Start, "Phase neu", Phasenwechsel)
var odo = null;

/* Walzen von rechts nach links:
   P      - alle wie viele Sekunden die Walze um eine Ziffer weiterdreht
   period - Anzahl verschiedener Ziffern (Zehner-Sekunden: 0-5)
   faces  - aufgedruckte Flächen (die 0-5-Walze trägt ihre Ziffern zweimal, wie bei Uhren-Zählwerken)
   win    - wie viele Sekunden vor dem Wechsel die Walze anfängt, ihn anzubahnen
   creep  - wie weit sie bis zum Wechsel schon vorgedreht hat (Anteil einer Ziffer)
   play   - Getriebespiel: bleibender kleiner Versatz */
function odoSpecs(durationSec){
  var specs = [
    { P:1,  period:10, faces:10, win:0.6, creep:0.07, play:0 },
    { P:10, period:6,  faces:12, win:3,   creep:0.12, play:0.02 }
  ];
  var minDigits = String(Math.floor(Math.max(0, durationSec)/60)).length;
  var plays = [-0.025, 0.015];
  for(var i=0;i<minDigits;i++){
    specs.push({ P:60*Math.pow(10,i), period:10, faces:10, win:15, creep:0.24, play:plays[i%2] });
  }
  return specs;
}
/* Radius, bei dem die Ziffernflächen lückenlos ein Vieleck bilden */
function odoRadius(faces){ return ODO_FACE_H/2/Math.tan(Math.PI/faces); }

function odoHTML(durationSec){
  var specs = odoSpecs(durationSec);
  var html = "";
  for(var k=specs.length-1;k>=0;k--){
    var sp = specs[k], angle = 360/sp.faces, r = odoRadius(sp.faces).toFixed(4), faces = "";
    for(var i=0;i<sp.faces;i++){
      faces += '<span class="odo-face" style="transform:rotateX('+(-i*angle)+'deg) translateZ('+r+'em)">'+(i%sp.period)+'</span>';
    }
    html += '<span class="tc"><span class="tc-window"><span class="odo-drum">'+faces+'</span></span></span>';
    if(k===2) html += '<span class="tc sep">:</span>';
  }
  return html;
}

/* Neue Phase: die Walzen starten auf dem bisherigen Stand (beim Start des Players auf 0:00)
   und drehen von dort auf die neue Dauer */
function odoInit(container, durationSec){
  var specs = odoSpecs(durationSec);
  var drums = container.querySelectorAll(".odo-drum");
  var prev = odo ? odo.wheels.map(function(w){ return w.value; }) : [];
  odo = {
    lastV: null,
    wheels: specs.map(function(sp, k){
      return { spec:sp, drum:drums[drums.length-1-k], r:odoRadius(sp.faces), angle:360/sp.faces,
               value:prev[k]||0, pendingFrom:prev[k]||0, anim:null };
    })
  };
}

function easeOutBack(x){ var c = 1.2; return 1 + (c+1)*Math.pow(x-1,3) + c*Math.pow(x-1,2); }
function easeInOutCubic(x){ return x<.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2; }
/* Kürzester Drehweg auf einer Walze mit n Ziffern, Ergebnis in [-n/2, n/2) */
function odoShortest(d, n){ return ((d % n) + n*1.5) % n - n/2; }

/* Ruhestellung einer Walze in Ziffern (Bruchteile = Walze steht zwischen zwei Ziffern) */
function odoWheelValue(sp, V, f){
  var v = Math.floor(V/sp.P) % sp.period;
  /* Anbahnen: kurz vor dem nächsten Wechsel schon langsam vordrehen (erst kaum, dann zunehmend) */
  if(V >= sp.P){
    var x = clamp(1 - ((V % sp.P) + 1 - f)/sp.win, 0, 1);
    v -= sp.creep * x * x;
  }
  return v + sp.play;
}

/* Setzt alle Walzen auf den Stand der Restzeit. Wechsel werden als Drehung animiert, die nach
   Uhrzeit (nicht nach Timerzeit) abläuft - so dreht eine angefangene Bewegung auch bei Pause
   zu Ende. Gibt zurück, ob noch eine Walze in Bewegung ist. */
function odoUpdate(remMs){
  if(!odo) return false;
  var s = Math.max(0, remMs)/1000;
  var V = Math.max(1, Math.ceil(s));   // angezeigte Sekunden
  var f = V - s;                       // 0 direkt nach einem Sekundenwechsel, gegen 1 kurz vor dem nächsten
  var now = performance.now();
  var ticked = odo.lastV != null && V === odo.lastV - 1;          // normaler Sekundenwechsel
  var jumped = odo.lastV != null && V !== odo.lastV && !ticked;   // "Phase neu" o.ä.
  odo.lastV = V;
  var moving = false;
  odo.wheels.forEach(function(w, k){
    var sp = w.spec, model = odoWheelValue(sp, V, f), from = null, snap = false;
    if(w.pendingFrom != null){ from = w.pendingFrom; w.pendingFrom = null; }
    else if(jumped) from = w.value;
    else if(ticked && (V+1) % sp.P === 0){ from = w.value; snap = true; }
    if(from != null){
      var offset = odoShortest(from - model, sp.period);
      if(Math.abs(offset) > 0.001){
        /* Einrasten mit leichtem Überschwingen, rechte Stelle zuerst - bzw. ruhiges Drehen auf neuen Stand */
        w.anim = snap
          ? { start:now + k*ODO_STAGGER_MS, dur:ODO_ROLL_MS, offset:offset, ease:easeOutBack }
          : { start:now + k*ODO_STAGGER_MS*1.5, dur:ODO_JUMP_MS, offset:offset, ease:easeInOutCubic };
      }
    }
    var v = model;
    if(w.anim){
      var p = clamp((now - w.anim.start)/w.anim.dur, 0, 1);
      v += w.anim.offset * (1 - w.anim.ease(p));
      if(p >= 1) w.anim = null; else moving = true;
    }
    w.value = v;
    w.drum.style.transform = "translateZ(-"+w.r.toFixed(4)+"em) rotateX("+(v*w.angle).toFixed(3)+"deg)";
  });
  return moving;
}
/* Während der Pause laufende Drehungen zu Ende bringen, statt sie einzufrieren */
function odoSettle(){
  if(!odo || !playerState || !playerState.paused) return;
  if(odoUpdate(playerState.remainingMs)) requestAnimationFrame(odoSettle);
}

/* Abgelaufene Schritte nachholen. War die App länger im Hintergrund, können mehrere
   Schritte vorbei sein - dann direkt zum richtigen springen (nicht nur einen weiter).
   Gibt true zurück, wenn gewechselt wurde. */
function advanceIfDue(){
  if(!playerState || playerState.paused) return false;
  var steps = playerState.steps, now = Date.now();
  if(!steps[playerState.idx] || steps[playerState.idx].phase==="done" || playerState.endAt > now) return false;
  var idx = playerState.idx + 1, startAt = playerState.endAt, skipped = 0;
  while(steps[idx] && steps[idx].phase!=="done" && startAt + steps[idx].duration*1000 <= now){
    startAt += steps[idx].duration*1000; idx++; skipped++;
  }
  if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
  enterStep(idx, { startAt:startAt, quiet: skipped > 0 });
  if(skipped > 0 && playerState && !playerState.paused) planAudio(true);   // Tonplan an die echte Position anpassen
  return true;
}
/* Im Hintergrund läuft requestAnimationFrame nicht - ein Intervall hält die Logik
   (Schrittwechsel, Vibration, Ansagen, Tonplan verlängern) trotzdem am Laufen. */
var bgTicker = null;
function startBgTicker(){
  stopBgTicker();
  bgTicker = setInterval(function(){
    if(!playerState){ stopBgTicker(); return; }
    if(document.hidden) advanceIfDue();
  }, 500);
}
function stopBgTicker(){ if(bgTicker){ clearInterval(bgTicker); bgTicker = null; } }
/* Beim Drehen des Handys die Wiederholungs-Quadrate an die neue Breite anpassen */
window.addEventListener("resize", function(){
  if(playerState && playerState.steps[playerState.idx]) updateDots(playerState.steps[playerState.idx]);
});
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState!=="visible" || !playerState || playerState.paused) return;
  var ctx = audioCtx();
  if(ctx && ctx.state!=="running") try{ ctx.resume(); }catch(e){}
  if(!advanceIfDue()) planAudio(true);   // Uhr und Audio-Takt neu abgleichen
});

function tickLoop(){
  if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
  function frame(){
    if(!playerState || playerState.paused){ return; }
    var step = playerState.steps[playerState.idx];
    if(!step || step.phase==="done") return;
    if(advanceIfDue()) return;
    var remaining = playerState.endAt - Date.now();
    playerState.remainingMs = remaining;
    var remSec = Math.ceil(remaining/1000);
    if(isVintageTheme()){
      odoUpdate(remaining);
    } else {
      var timeEl = document.getElementById("pl-time");
      if(timeEl) timeEl.textContent = fmtTime(remSec);
    }
    ringSet(step.duration ? remaining / (step.duration*1000) : 0);
    // letzte 3 Sekunden: Ring pulsiert im Sekundentakt
    var rw = document.getElementById("pl-ringwrap");
    if(rw) rw.classList.toggle("pulse", remaining <= 3000 && remaining > 0);
    updateProgress();
    playerState.rafId = requestAnimationFrame(frame);
  }
  frame();
}

function bindPlayPause(){
  var btn = document.getElementById("pl-playpause");
  if(!btn) return;
  btn.onclick = function(){
    if(playerState.paused){
      playerState.paused = false;
      playerState.endAt = Date.now() + playerState.remainingMs;
      btn.querySelector("span").innerHTML = ICON_PAUSE;
      requestWakeLock();
      planAudio(true);
      tickLoop();
    } else {
      playerState.remainingMs = Math.max(0, playerState.endAt - Date.now());
      playerState.paused = true;
      schedCancel();
      btn.querySelector("span").innerHTML = ICON_PLAY;
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      odoSettle();
    }
  };
}

function bindPlayerControls(){
  var root = document.getElementById("playerRoot");
  root.addEventListener("click", function(e){
    if(e.target.closest("[data-exit]")){
      confirmSheet(t("endQ"), t("endText"), t("endBtn"), exitPlayer);
    }
    if(e.target.closest("[data-skip]")){
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      enterStep(playerState.idx+1, { manual:true });
    }
    if(e.target.closest("[data-restart]")){
      var step = playerState.steps[playerState.idx];
      playerState.remainingMs = step.duration*1000;
      playerState.endAt = Date.now() + playerState.remainingMs;
      playerState.paused = false;
      var ppBtn = document.getElementById("pl-playpause");
      if(ppBtn) ppBtn.querySelector("span").innerHTML = ICON_PAUSE;
      if(playerState.rafId) cancelAnimationFrame(playerState.rafId);
      planAudio(true);
      tickLoop();
    }
    if(e.target.closest("[data-vol-toggle]")){
      document.getElementById("pl-vol-pop").classList.toggle("hidden");
    }
  });
  var volRange = document.getElementById("pl-vol-range");
  var volVal = document.getElementById("pl-vol-val");
  volRange.addEventListener("input", function(){
    state.db.settings.volume = parseInt(volRange.value)/100;
    volVal.textContent = volRange.value+"%";
    save();
  });
  volRange.addEventListener("change", function(){
    phaseBeep(playerState.steps[playerState.idx].phase==="done" ? "done" : "work");
    planAudio(true);   // eingeplante Töne mit der neuen Lautstärke
  });
}

function exitPlayer(){
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  schedCancel();
  stopBgTicker();
  if(playerState && playerState.steps[playerState.idx].phase!=="done") logHistory(true);
  if(playerState && playerState.rafId) cancelAnimationFrame(playerState.rafId);
  playerState = null;
  odo = null;
  releaseWakeLock();
  document.getElementById("playerRoot").innerHTML = "";
  go("#home");
}

/* ============ Service worker ============ */
function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
}


/* Start: ab hier sind alle Teile geladen */
tonMischen(true);   // von Anfang an: Musik anderer Apps läuft weiter
