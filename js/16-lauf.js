"use strict";
/* ============ Lauf-Tracker ============
   GPS-Lauf mit Zeit, Kilometern, Pace, Kilometer-Zwischenzeiten und Routenlinie. Bewusst ohne Hintergrundkarte:
   Die Position wird nur auf dem Gerät verarbeitet, nichts geht ins Internet. Der Bildschirm bleibt an (Wake Lock);
   im Hintergrund oder bei gesperrtem Handy zeichnet eine Web-App nicht zuverlässig auf - dafür gibt es „Abdunkeln“.
   Gespeichert: settings.runs = [{ id, at, dur (ms, ohne Pausen), dist (m), pts:[[lat,lon]…], splits:[ms bis km 1, 2, …] }].
   Ein laufender Lauf wird alle 10 s als settings.runLive gesichert (falls die Seite beendet wird). */
var RUN_GENAU = 35;   // Fixes mit schlechterer Genauigkeit (m) werden ignoriert
var RUN_MAX_MS = 12;  // schneller als 12 m/s (43 km/h) gilt als GPS-Sprung
var run = null;       // laufende Aufzeichnung
var runWake = null;
function runMeter(a, b){   // Haversine
  var R = 6371000, r = Math.PI/180, dLat = (b[0]-a[0])*r, dLon = (b[1]-a[1])*r;
  var h = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2*R*Math.asin(Math.min(1, Math.sqrt(h)));
}
function runPace(sek, m){   // „5:32“ min/km
  if(!m || m < 20 || !sek) return "–:––";
  var p = sek/(m/1000), min = Math.floor(p/60), s = Math.round(p%60);
  if(s === 60){ min++; s = 0; }
  return min > 59 ? "–:––" : min+":"+(s < 10 ? "0" : "")+s;
}
/* Einstellungen: Auto-Pause (settings.runAuto = Sekunden Stillstand, 0 = aus) und Intervall (settings.runIv = { an, lauf, geh } in Sekunden) */
function runAutoSek(){ var v = +state.db.settings.runAuto; return v >= 5 && v <= 20 ? Math.round(v) : 0; }
function runIvEinst(){
  var a = state.db.settings.runIv || {};
  return { an:!!a.an, lauf:clamp(Math.round(+a.lauf) || 60, 10, 900), geh:clamp(Math.round(+a.geh) || 60, 10, 900) };
}
function runKm(m){ return (m/1000).toFixed(2).replace(".", currentLang() === "en" ? "." : ","); }
function runZeit(r){ return (r.pauseAb || Date.now()) - r.start - r.pausenMs; }
function runWachen(an){
  if(!an){ if(runWake){ try{ runWake.release(); }catch(e){} runWake = null; } return; }
  if(!("wakeLock" in navigator)) return;
  navigator.wakeLock.request("screen").then(function(wl){ runWake = wl; }).catch(function(){});
}
document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "visible" && run && !run.pauseAb) runWachen(true); });

/* Ein GPS-Punkt: filtert Ungenaues, Stillstand-Rauschen und Sprünge, zählt Strecke und Kilometer-Zwischenzeiten */
function runPunkt(lat, lon, acc, ts, speed){
  var r = run;
  if(!r) return;
  if(r.pauseAb){
    if(r.auto){ r.gps = acc; r.fehler = 0; runAutoWeiter(lat, lon, acc, speed); }
    return;
  }
  r.gps = acc; r.fehler = 0; r.n++; r.sumAcc += acc;
  if(acc > RUN_GENAU) return;
  if(speed != null && speed >= 1) r.lastMove = Date.now();   // das Gerät meldet selbst Bewegung
  var p = [Math.round(lat*1e5)/1e5, Math.round(lon*1e5)/1e5];
  if(!r.letzte){ r.letzte = { p:p, ts:ts }; if(!r.pts.length) r.pts.push(p); return; }
  var dt = (ts - r.letzte.ts)/1000;
  if(dt <= 0) return;
  var d = runMeter(r.letzte.p, p);
  if(d < Math.max(3, acc*0.5)) return;   // Rauschen im Stand
  if(d/dt > RUN_MAX_MS) return;           // Sprung
  var vor = r.dist, nun = runZeit(r);
  if(speed == null || speed >= 0.5) r.lastMove = Date.now();   // Zittern im Stand (Tempo ~0) zählt nicht als Bewegung
  r.dist += d; r.letzte = { p:p, ts:ts };
  while(Math.floor(r.dist/1000) > r.splits.length){   // Kilometer-Marke überschritten: Zeit anteilig berechnen
    var k = r.splits.length + 1, anteil = (k*1000 - vor)/(r.dist - vor);
    r.splits.push(Math.round(r.tZ + anteil*(nun - r.tZ)));
    runAnsage(k);
  }
  r.tZ = nun;
  if(!r.pts.length || runMeter(r.pts[r.pts.length-1], p) >= 5) r.pts.push(p);
  r.verlauf.push({ t:nun, d:r.dist });
  while(r.verlauf.length > 2 && nun - r.verlauf[1].t > 60000) r.verlauf.shift();   // nur die letzte Minute für „Tempo jetzt“
}
/* Auto-Pause: steht man länger als die eingestellte Zeit (Strecke wächst nicht, Gerät meldet kaum Tempo), pausiert der Lauf.
   Die Stehzeit wird herausgerechnet (die Pause beginnt beim letzten Schritt, nicht erst bei der Erkennung). Weiter geht es von selbst,
   sobald man sich ≥ 10 m vom Pausenort entfernt oder das Gerät ≥ 1,5 m/s meldet. GPS zittert im Stand, daher mindestens 5 s. */
function runAutoPruefen(){
  var r = run, sek = runAutoSek();
  if(!r || !sek || r.pauseAb || !r.letzte || r.fehler) return;
  if(Date.now() - r.lastMove < sek*1000) return;
  r.pauseAb = r.lastMove; r.auto = true; r.pausePos = r.letzte.p;
  vibrate(120);
  runAnzeige();
}
function runAutoWeiter(lat, lon, acc, speed){
  var r = run;
  if(acc > RUN_GENAU) return;
  var weg = r.pausePos ? runMeter(r.pausePos, [lat, lon]) : 0;
  if(weg < Math.max(10, acc) && !(speed != null && speed >= 1.5)) return;
  r.pausenMs += Date.now() - r.pauseAb; r.pauseAb = 0; r.auto = false; r.letzte = null; r.lastMove = Date.now();
  vibrate(120);
  runAnzeige();
}
/* Intervall-Lauf: Laufen und Gehen im Wechsel nach der Laufzeit (ohne Pausen); Signalton, Vibration und Ansage beim Wechsel, Tick in den letzten 3 s */
function runIvTick(){
  var r = run, iv = r && r.iv;
  if(!iv || r.pauseAb) return;
  var sek = runZeit(r)/1000, zyk = iv.lauf + iv.geh, pos = sek % zyk, lauf = pos < iv.lauf;
  var rest = Math.ceil((lauf ? iv.lauf : zyk) - pos), runde = Math.floor(sek/zyk) + 1, ph = (lauf ? "l" : "g") + runde;
  if(r.ivPhase !== ph){
    var erst = r.ivPhase == null;
    r.ivPhase = ph; r.ivTick = null;
    if(!erst){
      try{ phaseBeep(lauf ? "work" : "rest"); }catch(e){}
      vibrate(lauf ? [150, 80, 150] : 250);
      if(runAnsageEinst().every && !r.stumm) runSag(t(lauf ? "runSagLauf" : "runSagGeh"));
    }
  } else if(rest <= 3 && r.ivTick !== rest){ r.ivTick = rest; try{ phaseBeep("tick"); }catch(e){} }
  var el = document.getElementById("run-iv");
  if(el){
    var txt = t(lauf ? "runIvLauf" : "runIvGeh")+" · "+repUhr(rest*1000)+" · "+t("runIvRunde", { n:runde });
    if(el.textContent !== txt) el.textContent = txt;
    el.className = "run-iv "+(lauf ? "lauf" : "geh");
  }
}
/* Ansagen alle N Kilometer (settings.runAnsage = { every:0|1|2|3|5, was:"km"|"pace"|"alles" }); 0 = aus.
   Gesprochen wird in der App-Sprache. „Pace“ ist die der letzten N Kilometer, „alles“ nimmt Gesamtzeit und Ø-Pace dazu. */
function runAnsageEinst(){
  var a = state.db.settings.runAnsage || {};
  return { every:[0, 1, 2, 3, 5].indexOf(+a.every) > -1 ? +a.every : 1, was:["km", "pace", "alles"].indexOf(a.was) > -1 ? a.was : "pace" };
}
function runSag(text, sprache){
  try{
    if(!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text), de = (sprache || currentLang()) !== "en";
    u.lang = de ? "de-DE" : "en-GB"; u.rate = 1; u.volume = 1;
    var voices = speechSynthesis.getVoices() || [];
    var v = voices.filter(function(x){ return x.lang && x.lang.toLowerCase().indexOf(de ? "de" : "en") === 0 && x.localService; })[0] ||
            voices.filter(function(x){ return x.lang && x.lang.toLowerCase().indexOf(de ? "de" : "en") === 0; })[0];
    if(v) u.voice = v;
    speechSynthesis.speak(u);
  }catch(e){}
}
function runSprechPace(sek, m, de){   // „6 Minuten 7 Sekunden“
  var p = Math.round(sek/(m/1000)), min = Math.floor(p/60), s = p%60;
  return de ? min+" Minuten"+(s ? " "+s+" Sekunden" : "") : min+" minutes"+(s ? " "+s+" seconds" : "");
}
function runSprechZeit(ms, de){
  var s = Math.round(ms/1000), h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60, out = [];
  if(de){ if(h) out.push(h+" Stunden"); if(m) out.push(m+" Minuten"); if(x && !h) out.push(x+" Sekunden"); }
  else { if(h) out.push(h+" hours"); if(m) out.push(m+" minutes"); if(x && !h) out.push(x+" seconds"); }
  return out.join(" ");
}
function runAnsageText(k, splits, e, de){
  var seg = splits[k-1] - (k - e.every > 0 ? splits[k-e.every-1] : 0);
  var txt = de ? k+(k === 1 ? " Kilometer." : " Kilometer.") : k+(k === 1 ? " kilometre." : " kilometres.");
  if(e.was !== "km") txt += de ? " Pace "+runSprechPace(seg/1000, e.every*1000, true)+" pro Kilometer." : " Pace "+runSprechPace(seg/1000, e.every*1000, false)+" per kilometre.";
  if(e.was === "alles"){
    txt += de ? " Zeit "+runSprechZeit(splits[k-1], true)+"." : " Time "+runSprechZeit(splits[k-1], false)+".";
    if(k > e.every) txt += de ? " Durchschnitt "+runSprechPace(splits[k-1]/1000, k*1000, true)+"." : " Average "+runSprechPace(splits[k-1]/1000, k*1000, false)+".";
  }
  return txt;
}
function runAnsage(k){
  var r = run, e = runAnsageEinst();
  if(!r || !e.every || r.stumm || k % e.every !== 0) return;
  var txt = runAnsageText(k, r.splits, e, currentLang() !== "en");
  (r.gesagt || (r.gesagt = [])).push(txt);
  runSag(txt);
}
/* „Lauf starten“: erst ein Countdown (20 s, beliebig oft +10 s), damit man das Handy wegstecken kann und das GPS Zeit zum Finden hat.
   Während des Countdowns läuft nur die Suche nach dem Signal - Zeit und Strecke zählen erst ab „Los“. */
var RUN_VORLAUF = 20;
var runVor = null;   // { ende (ms), uhr, watch, gps, fehler, piep }
function runStart(){
  if(!navigator.geolocation){ showToast(t("runNoGps")); return; }
  if(runAnsageEinst().every && window.speechSynthesis){ try{ var u0 = new SpeechSynthesisUtterance(" "); u0.volume = 0; speechSynthesis.speak(u0); }catch(e){} }   // Sprache im Tipp freischalten (iOS)
  runVor = { ende:Date.now() + RUN_VORLAUF*1000, gps:null, fehler:0, piep:null };
  runVor.watch = navigator.geolocation.watchPosition(function(pos){ if(runVor){ runVor.gps = pos.coords.accuracy; runVor.fehler = 0; } },
    function(err){ if(runVor) runVor.fehler = err && err.code || 2; }, { enableHighAccuracy:true, maximumAge:1000, timeout:20000 });
  runWachen(true);
  runVor.uhr = setInterval(runVorTick, 250);
  renderRun();
}
function runVorStop(){
  if(!runVor) return;
  if(runVor.uhr) clearInterval(runVor.uhr);
  if(runVor.watch != null) try{ navigator.geolocation.clearWatch(runVor.watch); }catch(e){}
  runVor = null;
}
function runVorText(){
  var v = runVor;
  return v.fehler === 1 ? t("runGpsDenied") : v.fehler ? t("runGpsLost") : v.gps == null ? t("runGpsWait") : t(v.gps <= 15 ? "runGpsOk" : "runGpsWeak", { m:Math.round(v.gps) });
}
function runVorTick(){
  var v = runVor;
  if(!v) return;
  var rest = Math.ceil((v.ende - Date.now())/1000);
  if(rest <= 0) return runVorLos();
  var z = document.getElementById("run-vor"), g = document.getElementById("run-vor-gps");
  if(z && z.textContent !== String(rest)) z.textContent = rest;
  var dz = document.getElementById("run-dz"); if(dz && !run && dz.textContent !== String(rest)) dz.textContent = rest;
  if(g) g.textContent = runVorText();
  if(rest <= 3 && v.piep !== rest){ v.piep = rest; try{ phaseBeep("tick"); }catch(e){} }
}
function runVorLos(){
  runVorStop();
  try{ phaseBeep("work"); if(navigator.vibrate) navigator.vibrate(200); }catch(e){}
  if(runAnsageEinst().every) runSag(t("runLos"));
  runLosgehts();
}
function runLosgehts(){
  run = { id:uid(), start:Date.now(), pauseAb:0, pausenMs:0, dist:0, pts:[], letzte:null, splits:[], tZ:0, verlauf:[], gps:null, fehler:0, stumm:false, gesagt:[], n:0, sumAcc:0,
    lastMove:Date.now(), auto:false, iv:runIvEinst().an ? runIvEinst() : null, ivPhase:null };
  runLauschen();
  runWachen(true);
  run.uhr = setInterval(function(){ runAutoPruefen(); runAnzeige(); runSichern(); }, 1000);
  renderRun();
}
function runLauschen(){
  var r = run;
  r.watch = navigator.geolocation.watchPosition(function(pos){
    runPunkt(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, pos.timestamp || Date.now(), pos.coords.speed);
    runAnzeige();
  }, function(err){ r.fehler = err && err.code || 2; runAnzeige(); }, { enableHighAccuracy:true, maximumAge:1000, timeout:20000 });
}
function runStopWatch(){
  if(!run) return;
  if(run.watch != null) try{ navigator.geolocation.clearWatch(run.watch); }catch(e){}
  if(run.uhr) clearInterval(run.uhr);
  run.watch = null; run.uhr = 0;
}
function runPause(){
  if(!run) return;
  if(run.pauseAb){ run.pausenMs += Date.now() - run.pauseAb; run.pauseAb = 0; run.auto = false; run.letzte = null; run.lastMove = Date.now(); runWachen(true); }   // Lücke zählt nicht als Strecke
  else { run.pauseAb = Date.now(); run.auto = false; }
  renderRun();
}
var runSichernAm = 0;
function runSichern(){   // alle 10 s eine Kopie, damit ein beendeter Browser den Lauf nicht verschluckt
  var r = run;
  if(!r || Date.now() - runSichernAm < 10000) return;
  runSichernAm = Date.now();
  state.db.settings.runLive = { id:r.id, start:r.start, dur:runZeit(r), dist:r.dist, pts:r.pts, splits:r.splits, at:Date.now() };
  save();
}
function runSpeichern(d){   // d: { id, start, dur, dist, pts, splits } -> in den Verlauf; zu kurze Läufe werden nicht behalten
  var s = state.db.settings;
  if(d.dist < 50){ showToast(t("runShort")); return false; }
  var x = { id:d.id, at:d.start, dur:Math.round(d.dur), dist:Math.round(d.dist), pts:d.pts, splits:d.splits };
  if(d.pause > 1000) x.pause = Math.round(d.pause);   // herausgerechnete Pausen/Stehzeit (ms)
  if(d.iv) x.iv = { lauf:d.iv.lauf, geh:d.iv.geh };
  (s.runs || (s.runs = [])).push(x);
  pruneHistory(state.db);
  state.db.history.push({ at:d.start, dur:Math.round(d.dur/1000), ex:[], b:"run" });   // zählt in der Wochenzeile
  save();
  showToast(t("runSaved"));
  return true;
}
function runBeenden(speichern){
  var r = run;
  if(!r) return;
  var dauer = runZeit(r), pausen = r.pausenMs + (r.pauseAb ? Date.now() - r.pauseAb : 0), iv = r.iv;
  runStopWatch(); runWachen(false);
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  var dunkel = document.getElementById("run-dunkel"); if(dunkel) dunkel.remove();
  run = null;
  delete state.db.settings.runLive;
  var ok = speichern ? runSpeichern({ id:r.id, start:r.start, dur:dauer, dist:r.dist, pts:r.pts, splits:r.splits, pause:pausen, iv:iv }) : (save(), false);
  if(ok){ runNeu = r.id; go("#rundetail/"+r.id); } else renderRun();   // runNeu: Abschlusskarte oben im Detail
}
var runNeu = null;
function runBesterKm(r){   // schnellster einzelner Kilometer (ms) oder null
  var sp = r.splits || [], best = null;
  sp.forEach(function(ms, i){ var d = ms - (i ? sp[i-1] : 0); if(best === null || d < best) best = d; });
  return best;
}
/* Was bei diesem Lauf besonders war - im Vergleich zu den früheren Läufen */
function runHighlights(x){
  var others = (state.db.settings.runs || []).filter(function(o){ return o.id !== x.id; }), out = [];
  if(!others.length) out.push(t("runErster"));
  else {
    if(x.dist > Math.max.apply(null, others.map(function(o){ return o.dist; }))) out.push(t("runLaengster"));
    var bk = runBesterKm(x), ok = others.map(runBesterKm).filter(function(v){ return v !== null; });
    if(bk !== null && (!ok.length || bk < Math.min.apply(null, ok))) out.push(t("runSchnellsterKm", { z:repUhr(bk) }));
    var lang = others.filter(function(o){ return o.dist >= 1000; });
    if(x.dist >= 1000 && lang.length && x.dur/x.dist < Math.min.apply(null, lang.map(function(o){ return o.dur/o.dist; }))) out.push(t("runSchnellstePace"));
  }
  [[5000, "runM5"], [10000, "runM10"], [21097, "runMHalb"]].forEach(function(m){
    if(x.dist >= m[0] && !others.some(function(o){ return o.dist >= m[0]; })) out.push(t(m[1]));
  });
  return out;
}
function runOptionenHTML(){
  var iv = runIvEinst(), a = runAutoSek();
  return '<div class="card run-opt">'+
    toggleRow("run-iv-an", esc(t("runIvAn")), esc(t("runIvHint")), iv.an)+
    (iv.an ? '<div class="ru-felder"><div><label>'+esc(t("runIvLaufS"))+'</label>'+stepperHTML("run-iv-lauf", iv.lauf, 10, 900, 10)+'</div>'+
      '<div><label>'+esc(t("runIvGehS"))+'</label>'+stepperHTML("run-iv-geh", iv.geh, 10, 900, 10)+'</div></div>' : '')+
    '<div class="run-auto"><div class="label">'+esc(t("runAutoTitel"))+'<b id="run-auto-wert">'+esc(a ? t("runAutoNach", { s:a }) : t("runAus"))+'</b></div>'+
      '<input type="range" id="run-auto" min="0" max="16" step="1" value="'+(a ? a - 4 : 0)+'" aria-label="'+esc(t("runAutoTitel"))+'">'+
      '<div class="desc">'+esc(t("runAutoHint"))+'</div></div></div>';
}
function runAnsageHTML(){
  var e = runAnsageEinst();
  function kn(attr, wert, aktiv, text){ return '<button type="button" data-'+attr+'="'+wert+'" class="'+(aktiv ? "active" : "")+'">'+esc(text)+'</button>'; }
  return '<div class="card run-ansage"><label>'+esc(t("runAnsagen"))+'</label><div class="theme-pick rep-pick">'+
      [0, 1, 2, 3, 5].map(function(n){ return kn("runevery", n, e.every === n, n ? n+" km" : t("runAus")); }).join("")+'</div>'+
    (e.every ? '<label>'+esc(t("runInhalt"))+'</label><div class="theme-pick rep-pick">'+
      kn("runwas", "km", e.was === "km", t("runWasKm"))+kn("runwas", "pace", e.was === "pace", t("runWasPace"))+kn("runwas", "alles", e.was === "alles", t("runWasAlles"))+'</div>'+
      '<button type="button" class="btn btn-secondary" data-runtest>'+esc(t("runTest"))+'</button>' : '')+
    '<div class="tm-hint">'+esc(t("runAnsageHint"))+'</div></div>';
}
/* Pace je Kilometer als Balken: je schneller, desto länger; der schnellste ist kräftig. Ein angefangener Rest-Kilometer (ab 100 m) steht zuletzt */
function runKmZeilen(x){
  var sp = x.splits || [], zeilen = [], bk = runBesterKm(x);
  sp.forEach(function(ms, i){ var dauer = ms - (i ? sp[i-1] : 0); zeilen.push({ n:String(i+1), dauer:dauer, text:repUhr(dauer), schnell:dauer === bk && sp.length > 1 }); });
  var rest = x.dist - sp.length*1000, rz = x.dur - (sp.length ? sp[sp.length-1] : 0);
  if(rest >= 100 && rz > 0) zeilen.push({ n:"+"+runKm(rest), dauer:rz/rest*1000, text:runPace(rz/1000, rest), rest:true });
  var best = Math.min.apply(null, zeilen.map(function(z){ return z.dauer; }));
  return zeilen.map(function(z){
    var w = Math.max(25, Math.round(100*best/z.dauer));
    return '<div class="rk'+(z.schnell ? ' schnell' : '')+(z.rest ? ' rest' : '')+'"><span class="rk-n">'+esc(z.n)+'</span><span class="rk-bar"><i style="width:'+w+'%"></i></span><span class="rk-p">'+esc(z.rest ? z.text : z.text)+'<small> /km</small></span></div>';
  }).join("");
}
function runById(id){ var l = state.db.settings.runs || []; for(var i=0;i<l.length;i++) if(l[i].id === id) return l[i]; return null; }

/* Routenlinie als SVG (ohne Karte): Länge und Breite im richtigen Verhältnis */
function runSvg(pts){
  if(!pts || pts.length < 2) return '<div class="run-leer">'+esc(t("runRoutePh"))+'</div>';
  var minLa = 90, maxLa = -90, minLo = 180, maxLo = -180;
  pts.forEach(function(p){ minLa = Math.min(minLa, p[0]); maxLa = Math.max(maxLa, p[0]); minLo = Math.min(minLo, p[1]); maxLo = Math.max(maxLo, p[1]); });
  var kx = Math.cos((minLa + maxLa)/2*Math.PI/180), W = 300, H = 200, pad = 14;
  var bw = Math.max((maxLo - minLo)*kx, 1e-6), bh = Math.max(maxLa - minLa, 1e-6);
  var sk = Math.min((W - 2*pad)/bw, (H - 2*pad)/bh), ox = (W - bw*sk)/2, oy = (H - bh*sk)/2;
  function xy(p){ return [(ox + (p[1] - minLo)*kx*sk).toFixed(1), (oy + (maxLa - p[0])*sk).toFixed(1)]; }
  var a = xy(pts[0]), z = xy(pts[pts.length-1]), pl = pts.map(function(p){ return xy(p).join(","); }).join(" ");
  return '<svg class="run-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(t("runRoute"))+'">'+
    '<polyline points="'+pl+'" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="5" class="run-start"/>'+
    '<circle cx="'+z[0]+'" cy="'+z[1]+'" r="9" class="run-ring"/><circle cx="'+z[0]+'" cy="'+z[1]+'" r="5" class="run-ziel"/></svg>';
}
function runGpxText(r){
  var pts = (r.pts || []).map(function(p){ return '<trkpt lat="'+p[0]+'" lon="'+p[1]+'"/>'; }).join("");
  return '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="BLOC" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>BLOC '+new Date(r.at).toISOString().slice(0, 10)+
    '</name><trkseg>'+pts+'</trkseg></trk></gpx>';
}
function runTempoJetzt(r){
  var v = r.verlauf;
  if(v.length < 2) return "–:––";
  var a = v[0], b = v[v.length-1];
  return runPace((b.t - a.t)/1000, b.d - a.d);
}
/* Anzeige im Aufzeichnen-Fenster aktualisieren (ohne neu zu zeichnen) */
function runAnzeige(){
  var r = run;
  if(!r) return;
  var sek = runZeit(r)/1000;
  function setze(id, txt){ var el = document.getElementById(id); if(el && el.textContent !== txt) el.textContent = txt; }
  var zeit = repUhr(runZeit(r));
  setze("run-zeit", zeit); setze("run-km", runKm(r.dist)); setze("run-pace", runPace(sek, r.dist)); setze("run-jetzt", runTempoJetzt(r));
  setze("run-dz", zeit); setze("run-dk", runKm(r.dist)+" km");
  var gps = r.fehler === 1 ? t("runGpsDenied") : r.fehler ? t("runGpsLost") : r.gps == null ? t("runGpsWait") :
    t(r.gps <= 15 ? "runGpsOk" : "runGpsWeak", { m:Math.round(r.gps) });
  setze("run-gps", r.pauseAb ? t(r.auto ? "runAutoPausiert" : "runPaused") : gps);
  var pb = app.querySelector("[data-runpause]");
  if(pb){ var pt = t(r.pauseAb ? "runResume" : "runPause"); if(pb.textContent !== pt) pb.textContent = pt; }
  runIvTick();
  var gz = document.getElementById("run-gps");
  if(gz) gz.className = "run-gps " + (r.pauseAb ? "pause" : r.fehler ? "aus" : r.gps == null ? "suche" : r.gps <= 15 ? "gut" : "mittel");
  var karte = document.getElementById("run-karte");
  if(karte && +karte.getAttribute("data-n") !== r.pts.length){ karte.setAttribute("data-n", r.pts.length); karte.innerHTML = runSvg(r.pts); }
}
function runDunkel(){
  var d = document.createElement("div");
  d.id = "run-dunkel"; d.className = "run-dunkel";
  d.innerHTML = '<div id="run-dz" class="rd-z"></div><div id="run-dk" class="rd-k"></div><div class="rd-h">'+esc(t("runDarkHint"))+'</div><div class="rd-balken"><i></i></div>';
  // Gegen versehentliche Berührungen in der Tasche: erst 2 s gedrückt halten (Balken füllt sich), ein kurzer Tipp tut nichts
  var tm = 0;
  function los(){ if(tm){ clearTimeout(tm); tm = 0; } d.classList.remove("halten"); }
  d.addEventListener("pointerdown", function(e){ e.preventDefault(); los(); d.classList.add("halten"); tm = setTimeout(function(){ tm = 0; d.remove(); }, 2000); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ d.addEventListener(ev, los); });
  d.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  document.body.appendChild(d);
  if(runVor && !run){ var dz0 = d.querySelector("#run-dz"); dz0.textContent = Math.max(1, Math.ceil((runVor.ende - Date.now())/1000)); }
  runAnzeige();
}
/* Im Lauf (nicht abgedunkelt) lösen alle Knöpfe erst nach 3 s Gedrückthalten aus - gegen Fehlbedienung in der Tasche oder mit nassen Händen.
   Der Knopf füllt sich währenddessen (.halten). Ein Tastatur-Klick (detail 0) löst sofort aus, damit die Bedienung ohne Touch erreichbar bleibt. */
var RUN_HALTEN = 3000;
function runHalten(el, fn){
  if(!el) return;
  var tm = 0, fertig = false;
  function los(){ if(tm){ clearTimeout(tm); tm = 0; } el.classList.remove("halten"); }
  el.classList.add("hold");
  el.addEventListener("pointerdown", function(e){
    if(e.button) return;
    los(); fertig = false; el.classList.add("halten");
    tm = setTimeout(function(){ tm = 0; fertig = true; el.classList.remove("halten"); vibrate(60); fn(); }, RUN_HALTEN);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ el.addEventListener(ev, los); });
  el.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  el.addEventListener("click", function(e){ if(e.detail === 0 && !fertig) fn(); });
}
function runDunkelWeg(){ var d = document.getElementById("run-dunkel"); if(d) d.remove(); }

/* Countdown vor dem Start: große Zahl, +10 s, sofort starten, abbrechen */
function renderRunVor(){
  var v = runVor;
  app.innerHTML =
    topbar(t("runTitle"), { back:"#home" }) +
    '<div class="run-gross"><div class="rg-label">'+esc(t("runVorTitel"))+'</div><div id="run-vor" class="rg-zeit rg-vor">'+Math.max(1, Math.ceil((v.ende - Date.now())/1000))+'</div></div>'+
    '<div class="run-gps" id="run-vor-gps">'+esc(runVorText())+'</div>'+
    '<div class="run-knoepfe"><button type="button" class="btn btn-secondary run-dunkelbtn" data-rundark>'+svgIcon(ICON_MOON)+' '+esc(t("runDark"))+'</button>'+
      '<button type="button" class="btn btn-secondary" data-runplus>'+esc(t("runPlus10"))+'</button>'+
      '<button type="button" class="btn btn-primary" data-runjetzt>'+esc(t("runJetzt"))+'</button>'+
      '<button type="button" class="btn btn-danger" data-runabbr>'+esc(t("runAbbrechen"))+'</button></div>'+
    '<div style="height:40px"></div>';
  var zur = app.querySelector("[data-back]");
  function weg(){ runVorStop(); runDunkelWeg(); runWachen(false); renderRun(); }
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){ runVorStop(); runDunkelWeg(); runWachen(false); goBack("#home"); }); }
  bindCommon();
  app.querySelector("[data-rundark]").addEventListener("click", runDunkel);
  app.querySelector("[data-runplus]").addEventListener("click", function(){ if(runVor){ runVor.ende += 10000; runVor.piep = null; runVorTick(); } });
  app.querySelector("[data-runjetzt]").addEventListener("click", runVorLos);
  app.querySelector("[data-runabbr]").addEventListener("click", weg);
}
function renderRun(){
  var s = state.db.settings;
  if(!run && !runVor) runDunkelWeg();
  if(run) return renderRunLive();
  if(runVor) return renderRunVor();
  var runs = (s.runs || []).slice().sort(function(a, b){ return b.at - a.at; });
  var km = runs.reduce(function(a, x){ return a + x.dist; }, 0)/1000;
  var live = s.runLive;
  app.innerHTML =
    topbar(t("runTitle"), { back:"#home" }) +
    (live ? '<div class="card run-live"><b>'+esc(t("runBroken"))+'</b><div class="sub">'+esc(t("runBrokenText", { km:runKm(live.dist) }))+'</div>'+
      '<div class="btn-row"><button type="button" class="btn btn-secondary" data-runlivedel>'+esc(t("runDiscard"))+'</button>'+
      '<button type="button" class="btn btn-primary" data-runlivesave>'+esc(t("runRecover"))+'</button></div></div>' : '')+
    '<div class="card run-hero"><div class="rh-km">'+esc(runKm(km*1000))+'<small>km</small></div><div class="rh-sub">'+esc(runs.length ? t("runLaeufe", { n:runs.length }) : t("runTeaser"))+'</div>'+
      '<button type="button" class="btn btn-primary run-startbtn" data-runstart>'+ICON_PLAY+' '+esc(t("runStart"))+'</button></div>'+
    (runs.length ? '<div class="section-title">'+esc(t("runVerlauf"))+'</div>' : '')+
    (runs.length ? runs.map(function(x){
      var d = new Date(x.at);
      return '<div class="list-item entry run-item" data-nav="#rundetail/'+x.id+'"><div class="meta"><div class="name">'+esc(runKm(x.dist))+' km'+(x.name ? '<span class="run-name"> · '+esc(x.name)+'</span>' : '')+'</div>'+
        '<div class="sub">'+esc(d.toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { weekday:"short", day:"numeric", month:"short" }))+SEP+esc(repUhr(x.dur))+SEP+esc(runPace(x.dur/1000, x.dist))+' /km</div></div>'+
        '<div class="card-aside"><div class="card-acts">'+trashBtn("run", x.id, runKm(x.dist)+" km")+'</div></div></div>';
    }).join("") : '<div class="empty" style="padding:24px 20px;">'+esc(t("runNone"))+'</div>')+
    runOptionenHTML()+runAnsageHTML()+
    '<div class="page-hint">'+esc(t("runBetaHint"))+'</div>'+
    '<div style="height:40px"></div>';
  bindCommon();
  bindTrash(function(){ renderRun(); });
  bindToggle("run-iv-an", function(v){ var e = runIvEinst(); s.runIv = { an:v, lauf:e.lauf, geh:e.geh }; save(); renderRun(); });
  bindSteppers(app, function(){
    var l = app.querySelector("#run-iv-lauf"), g = app.querySelector("#run-iv-geh");
    if(l && g){ s.runIv = { an:true, lauf:clamp(parseInt(l.value) || 60, 10, 900), geh:clamp(parseInt(g.value) || 60, 10, 900) }; save(); }
  });
  var au = app.querySelector("#run-auto");
  au.addEventListener("input", function(){
    var v = +au.value, sek = v ? v + 4 : 0;
    s.runAuto = sek; save();
    app.querySelector("#run-auto-wert").textContent = sek ? t("runAutoNach", { s:sek }) : t("runAus");
  });
  app.querySelector("[data-runstart]").addEventListener("click", runStart);
  app.querySelectorAll("[data-runevery]").forEach(function(b){
    b.addEventListener("click", function(){ var e = runAnsageEinst(); s.runAnsage = { every:+b.getAttribute("data-runevery"), was:e.was }; save(); renderRun(); });
  });
  app.querySelectorAll("[data-runwas]").forEach(function(b){
    b.addEventListener("click", function(){ var e = runAnsageEinst(); s.runAnsage = { every:e.every, was:b.getAttribute("data-runwas") }; save(); renderRun(); });
  });
  var rt = app.querySelector("[data-runtest]");
  if(rt) rt.addEventListener("click", function(){   // Hörprobe: so klänge die Ansage bei 6:12 min/km
    var e = runAnsageEinst(), sp = [], k = Math.max(e.every, 1);
    for(var i = 1; i <= k; i++) sp.push(i*372000);
    runSag(runAnsageText(k, sp, e, currentLang() !== "en"));
  });
  var lv = app.querySelector("[data-runlivesave]");
  if(lv) lv.addEventListener("click", function(){
    var l = s.runLive; delete s.runLive;
    if(runSpeichern({ id:l.id, start:l.start, dur:l.dur, dist:l.dist, pts:l.pts, splits:l.splits })) go("#rundetail/"+l.id); else renderRun();
  });
  var ld = app.querySelector("[data-runlivedel]");
  if(ld) ld.addEventListener("click", function(){ delete s.runLive; save(); renderRun(); });
}
function renderRunLive(){
  var r = run;
  app.innerHTML =
    topbar(t("runTitle"), { back:"#home" }) +
    '<div class="run-gross"><div class="rg-label">'+esc(t("runTime"))+'</div><div id="run-zeit" class="rg-zeit">0:00</div><div class="run-gps" id="run-gps"></div>'+(r.iv ? '<div class="run-iv" id="run-iv"></div>' : '')+'</div>'+
    '<div class="run-raster">'+
      '<div><b id="run-km">0,00</b><small>'+esc(t("runDist"))+' (km)</small></div>'+
      '<div><b id="run-pace">–:––</b><small>'+esc(t("runPaceAvg"))+' /km</small></div>'+
      '<div><b id="run-jetzt">–:––</b><small>'+esc(t("runPaceNow"))+' /km</small></div></div>'+
    '<div id="run-karte" class="run-karte" data-n="-1"></div>'+
    '<div class="run-knoepfe"><button type="button" class="btn btn-secondary" data-runpause>'+esc(t(r.pauseAb ? "runResume" : "runPause"))+'</button>'+
      '<button type="button" class="btn btn-secondary run-dunkelbtn" data-rundark>'+svgIcon(ICON_MOON)+' '+esc(t("runDark"))+'</button>'+
      (runAnsageEinst().every ? '<button type="button" class="btn btn-secondary run-stumm" data-runstumm aria-pressed="'+!!r.stumm+'">'+esc(t(r.stumm ? "runStummAus" : "runStummAn"))+'</button>' : '')+
      '<button type="button" class="btn btn-danger run-ende" data-runend>'+esc(t("runEnd"))+'</button></div>'+
    '<div class="tm-hint run-haltehint">'+esc(t("runHaltenHint"))+'</div>'+
    '<div style="height:40px"></div>';
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){
    openActionSheet(t("runLeaveQ"), [
      { ico:P_PLAY, label:t("runKeep"), fn:function(){} },
      { ico:P_CHECK, label:t("runSave"), fn:function(){ runBeenden(true); } },
      { ico:P_TRASH, label:t("runDiscard"), danger:true, fn:function(){ runBeenden(false); } }
    ]);
  }); }
  bindCommon();   // erst nach dem Entfernen von data-back, sonst würde „Zurück“ zusätzlich die Seite verlassen
  runHalten(app.querySelector("[data-runpause]"), runPause);
  runHalten(app.querySelector("[data-rundark]"), runDunkel);
  var stm = app.querySelector("[data-runstumm]");
  if(stm) runHalten(stm, function(){   // Ansagen für diesen Lauf aus/an (die Einstellung bleibt)
    r.stumm = !r.stumm;
    if(r.stumm) try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    renderRunLive();
  });
  runHalten(app.querySelector("[data-runend]"), function(){
    confirmSheet(t("runEndQ"), t("runEndText"), t("runSave"), function(){ runBeenden(true); });
  });
  runAnzeige();
}
function renderRunDetail(id){
  runDunkelWeg();
  var x = runById(id);
  if(!x) return go("#run");
  var d = new Date(x.at), sp = x.splits || [], bk = runBesterKm(x);
  var neu = runNeu === x.id;
  runNeu = null;
  var hl = neu ? runHighlights(x) : [];
  app.innerHTML =
    topbar(t("runDetail"), { back:"#run" }) +
    // Abschlusskarte direkt nach dem Lauf: was geschafft wurde (der Lauf ist schon gespeichert)
    (neu ? '<div class="card run-fertig"><div class="rf-titel">'+esc(t("runGeschafft"))+'</div><div class="rf-km">'+esc(runKm(x.dist))+' <small>km</small></div>'+
      '<div class="rf-zeile">'+esc(repUhr(x.dur))+SEP+esc(runPace(x.dur/1000, x.dist))+' /km</div>'+
      (hl.length ? '<ul class="rf-liste">'+hl.map(function(h){ return '<li>'+svgIcon(ICON_STAR)+'<span>'+esc(h)+'</span></li>'; }).join("")+'</ul>' : '')+
      '<div class="rf-gespeichert">'+esc(t("runGespeichert"))+'</div></div>' : '')+
    '<div class="rep-meta">'+esc(d.toLocaleDateString(currentLang() === "en" ? "en-GB" : "de-DE", { weekday:"long", day:"numeric", month:"long", year:"numeric" }))+
      (x.iv ? SEP+esc(t("runIvMeta", { l:repUhr(x.iv.lauf*1000), g:repUhr(x.iv.geh*1000) })) : '')+(x.pause ? SEP+esc(t("runPausenMeta", { z:repUhr(x.pause) })) : '')+'</div>'+
    '<div class="card run-notiz"><input type="text" id="run-name" maxlength="40" value="'+esc(x.name || "")+'" placeholder="'+esc(t("runNamePh"))+'" aria-label="'+esc(t("runNamePh"))+'">'+
      '<textarea id="run-note" rows="2" maxlength="400" placeholder="'+esc(t("runNotePh"))+'" aria-label="'+esc(t("runNotePh"))+'">'+esc(x.note || "")+'</textarea></div>'+
    '<div class="run-raster"><div><b>'+esc(runKm(x.dist))+'</b><small>'+esc(t("runDist"))+' (km)</small></div><div><b>'+esc(repUhr(x.dur))+'</b><small>'+esc(t("runTime"))+'</small></div>'+
      '<div><b>'+esc(runPace(x.dur/1000, x.dist))+'</b><small>'+esc(t("runPaceAvg"))+' /km</small></div></div>'+
    '<div class="section-title">'+esc(t("runRoute"))+'</div><div class="run-karte">'+runSvg(x.pts)+'</div>'+
    (sp.length ? '<div class="section-title">'+esc(t("runSplits"))+'</div><div class="card run-kms">'+runKmZeilen(x)+'</div>' : '')+
    '<button type="button" class="btn btn-secondary" data-rungpx style="margin-top:14px;">'+esc(t("runGpx"))+'</button>'+
    '<div style="height:40px"></div>';
  bindCommon();
  var nm = app.querySelector("#run-name"), nt = app.querySelector("#run-note");
  nm.addEventListener("input", function(){ x.name = nm.value.trim(); if(!x.name) delete x.name; save(); });
  nt.addEventListener("input", function(){ x.note = nt.value.trim(); if(!x.note) delete x.note; save(); });
  app.querySelector("[data-rungpx]").addEventListener("click", function(){
    var blob = new Blob([runGpxText(x)], { type:"application/gpx+xml" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "bloc-lauf-"+new Date(x.at).toISOString().slice(0, 10)+".gpx";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
  });
}

/* Eigenes Workout als Karte (Air › Meine und Mobility & Stretch › Meine) */
function myWoCard(mw, exs, mains, dur){
  return '<div class="list-item entry tpl-item lib-card my-item" data-nav="#mybuild/'+mw.id+'" data-q="'+esc(woSearchText(mw.name, exs))+'">'+
    '<button class="playbtn tp" data-cover="my/'+mw.id+'" '+(exs.length?'':'disabled style="opacity:.3"')+' title="'+t("startTemplate")+'" aria-label="'+t("startTemplate")+'">'+ICON_PLAY+'</button>'+
    '<div class="meta"><div class="name">'+esc(mw.name)+'</div>'+
    '<div class="sub">'+mainTagsHTML(mains)+t("exCount", { n:exs.length })+SEP+fmtDauerKurz(dur)+'</div>'+
    '</div><div class="card-aside"><div class="card-acts">'+favBtn("my:"+mw.id)+trashBtn("my", mw.id, mw.name)+'</div></div></div>';
}
/* Menü eines fertigen Workouts (⋯ und langes Drücken): unter „Meine“ speichern, ausblenden. ws: aus Mobility & Stretch */
function woMenue(lw, neu, ws){
  openActionSheet(tplText(lw.name), [
    { ico:ICON_COPY, label:t("adoptMine"), fn:function(){ adoptLibWorkout(lw, ws); } },
    { ico:ICON_EYE_OFF, label:t("hideShort"), fn:function(){ libHide("wo:"+lw.id); showToast(t("hiddenToast")); neu(); } }
  ]);
}
