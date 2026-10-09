"use strict";
/* ============ Einführung ============
   Fünf Seiten: Willkommen und je Bereich eine Seite in dessen Farbe mit dessen Symbol. Die Zahlen zählt die App
   selbst, damit sie mit neuen Übungen und Programmen stimmen. Beim ersten Start von selbst, sonst über die Einstellungen. */
var ICON_BAUSTEINE = '<rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="8" y="3" width="8" height="8" rx="1.5"/>';
function introSeiten(){
  var mitgeliefert = EXERCISES.filter(function(ex){ return !ex.custom; });
  var wsEx = {};
  AUFWAERM_UEBUNGEN.forEach(function(id){ if(findExercise(id)) wsEx[id] = true; });
  mitgeliefert.forEach(function(ex){ if(ex.main === "stretch") wsEx[ex.id] = true; });
  var einheiten = Array.isArray(REP_EINHEITEN) ? REP_EINHEITEN.length : Object.keys(REP_EINHEITEN).length;
  return [
    { ico:ICON_BAUSTEINE, farbe:"var(--accent)", titel:t("in1T"), text:t("in1"), notiz:t("in1N") },
    { ico:HOME_ICON.lib, farbe:"var(--tp-color)", titel:t("library"),
      text:t("in3", { w:LIB_WORKOUTS.filter(function(lw){ return !libIstWarmDehn(lw); }).length, e:mitgeliefert.filter(fuerWorkout).length }) },
    { ico:HOME_ICON.timer, farbe:"var(--bl-color)", titel:t("timers"), text:t("in2", { s:Object.keys(STUDIO_NUR).length }) },
    { ico:HOME_ICON.reps, farbe:"var(--rep-color)", titel:t("repTitle"), text:t("in4", { c:REP_WORKOUT_ROWS.length, u:einheiten }) },
    { ico:HOME_ICON.warm, farbe:"var(--ws-color)", titel:t("warmTitle"),
      text:t("in5", { p:LIB_WORKOUTS.filter(libIstWarmDehn).length, d:Object.keys(wsEx).length }) }
  ];
}
function openIntro(){
  var seiten = introSeiten(), nr = 0, root = document.getElementById("overlayRoot");
  function schliessen(){
    root.innerHTML = "";
    if(!state.db.settings.introGesehen){ state.db.settings.introGesehen = true; save(); }
  }
  function blaettern(d){ var n = nr + d; if(n < 0 || n >= seiten.length) return; nr = n; draw(); }
  function draw(){
    var s = seiten[nr], letzte = nr === seiten.length - 1;
    root.innerHTML = '<div class="confirm-overlay intro-overlay"><div class="confirm-sheet intro-sheet" role="dialog" aria-label="'+esc(t("introTitle"))+'" style="--intro-farbe:'+s.farbe+'">'+
      '<div class="intro-kopf"><div class="intro-punkte" aria-hidden="true">'+seiten.map(function(x, i){ return '<i class="'+(i === nr ? 'an' : '')+'"></i>'; }).join("")+'</div>'+
        (letzte ? '' : '<button type="button" class="intro-weg" data-introweg>'+esc(t("introSkip"))+'</button>')+'</div>'+
      '<div class="intro-seite"><span class="intro-ico">'+svgIcon(s.ico)+'</span>'+
        '<h2>'+esc(s.titel)+'</h2><p>'+esc(s.text)+'</p>'+(s.notiz ? '<p class="intro-notiz">'+esc(s.notiz)+'</p>' : '')+'</div>'+
      '<div class="intro-knoepfe">'+(nr ? '<button type="button" class="btn btn-secondary" data-introzurueck>'+esc(t("back"))+'</button>' : '')+
        '<button type="button" class="btn btn-primary" data-introweiter>'+esc(t(letzte ? "letsGo" : "introNext"))+'</button></div>'+
    '</div></div>';
    var sheet = root.querySelector(".intro-sheet");
    root.querySelector("[data-introweiter]").addEventListener("click", function(){ if(letzte) schliessen(); else blaettern(1); });
    var z = root.querySelector("[data-introzurueck]"); if(z) z.addEventListener("click", function(){ blaettern(-1); });
    var w = root.querySelector("[data-introweg]"); if(w) w.addEventListener("click", schliessen);
    root.querySelector(".intro-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("intro-overlay")) schliessen(); });   // daneben tippen, Android-Zurück
    // wischen: nach links weiter, nach rechts zurück
    var x0 = null;
    sheet.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, { passive:true });
    sheet.addEventListener("touchend", function(e){
      if(x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if(Math.abs(dx) > 50) blaettern(dx < 0 ? 1 : -1);
    });
    root.querySelector("[data-introweiter]").focus();
  }
  draw();
}

/* ---------- Sprachansagen (immer Englisch) in Vorbereitung und Pausen ---------- */
function voiceOn(){
  return !!(window.speechSynthesis && playerState && playerState.source && playerState.source.type==="draft" && state.db.settings.voice !== false);
}
function sayEN(text){
  try{
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB"; u.rate = 1; u.volume = 1;
    var voices = speechSynthesis.getVoices() || [];
    var v = voices.filter(function(x){ return /^en[-_]GB/i.test(x.lang) && x.localService; })[0] ||
            voices.filter(function(x){ return /^en/i.test(x.lang) && x.localService; })[0] ||
            voices.filter(function(x){ return /^en/i.test(x.lang); })[0];
    if(v) u.voice = v;
    setTimeout(function(){ if(playerState){ tonStandard(); speechSynthesis.speak(u); } }, 650);   // nach dem Signalton
  }catch(e){}
}
function announceStep(idx){
  if(!voiceOn()) return;
  var steps = playerState.steps, cur = steps[idx], nx = steps[idx+1];
  if(cur.phase==="done"){ sayEN("Workout complete. Well done!"); return; }
  if(!nx || nx.phase!=="work") return;
  var ex = findExercise(nx.ex), name = ex ? ex.name.en : nx.label;
  var side = nx.side ? (nx.side==="left" ? " Left side." : " Right side.") : "";
  var text = "";
  if(cur.phase==="prep") text = "Get ready. First up: "+name+"."+side;
  else if(cur.phase==="blockrest") text = "Rest. Next up: "+name+"."+side;
  else if(cur.phase==="rest"){
    if(nx.side && cur.side !== nx.side) text = "Switch sides.";
    if(nx.rep === nx.totalReps && nx.totalReps > 1) text += (text ? " " : "")+"Last round.";
  }
  if(text) sayEN(text);
}

/* ============ Datensicherung: Export, Schnappschuss, Erinnerung ============ */
/* Export als Datei; der Zeitpunkt wird für die Erinnerung auf der Startseite gemerkt */
/* Teilen: die Sicherungsdatei direkt an Drive, Mail, Messenger … übergeben (Android/iOS-Teilen-Menü).
   Chrome teilt nicht jede Dateiart - geht JSON nicht, dieselbe Datei als .txt (Import liest beides). */
function backupTeilDatei(){
  var name = "bloc-sicherung-"+new Date().toISOString().slice(0,10), inhalt = JSON.stringify(state.db,null,2);
  try{
    var f = new File([inhalt], name+".json", { type:"application/json" });
    if(navigator.canShare && navigator.canShare({ files:[f] })) return f;
    f = new File([inhalt], name+".txt", { type:"text/plain" });
    if(navigator.canShare && navigator.canShare({ files:[f] })) return f;
  }catch(e){}
  return null;
}
function kannBackupTeilen(){ return !!(navigator.share && backupTeilDatei()); }
function shareBackup(danach){
  var f = backupTeilDatei();
  if(!f || !navigator.share){ exportBackup(); if(danach) danach(); return; }
  navigator.share({ files:[f], title:"BLOC" }).then(function(){
    state.db.settings.lastExport = Date.now();
    save();
    showToast(t("backupShared"));
    if(danach) danach();
  }).catch(function(e){
    if(e && e.name === "AbortError") return;   // im Teilen-Menü abgebrochen
    exportBackup(); if(danach) danach();
  });
}
function exportBackup(){
  var blob = new Blob([JSON.stringify(state.db,null,2)], {type:"application/json"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = "sporttimer-backup-"+new Date().toISOString().slice(0,10)+".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  state.db.settings.lastExport = Date.now();
  save();
}
function hatEigenes(db){
  var st = (db && db.settings) || {};
  return !!(db && ((db.blocks||[]).length || (db.workouts||[]).length || (db.myWorkouts||[]).length || (db.customEx||[]).length ||
    Object.keys(st.studio || {}).length || (st.myReps || []).length || (st.myRepUnits || []).length));   // auch Gewichte im Freien Training und eigene Challenges
}
/* Erinnerung: eigene Inhalte, aber seit 14 Tagen (oder nie) exportiert. Der Installations-Hinweis hat Vorrang,
   × blendet sie nur für diese Sitzung aus. */
var BACKUP_TAGE = 14;
function backupTipHTML(){
  if(installTipHTML()) return "";
  try{ if(sessionStorage.getItem("bloc-backup-tip-weg") === "1") return ""; }catch(e){}
  if(!hatEigenes(state.db)) return "";
  var zuletzt = state.db.settings.lastExport || 0;
  if(Date.now() - zuletzt < BACKUP_TAGE*86400000) return "";
  return '<div class="installtip"><div><b>'+t("backupTipTitle")+'</b><br>'+t("backupTipText")+
    '<div style="margin-top:10px;"><button type="button" class="btn btn-primary" style="margin:0;width:auto;padding:11px 18px;font-size:14px;" data-backup-now>'+ICON_DOWNLOAD+' '+t("backupNow")+'</button></div></div>'+
    '<button data-hidebackup aria-label="'+t("close")+'">&times;</button></div>';
}
function bindBackupTip(){
  var jetzt = app.querySelector("[data-backup-now]");
  if(jetzt) jetzt.addEventListener("click", function(){ if(kannBackupTeilen()) shareBackup(render); else { exportBackup(); render(); } });
  var weg = app.querySelector("[data-hidebackup]");
  if(weg) weg.addEventListener("click", function(){
    try{ sessionStorage.setItem("bloc-backup-tip-weg", "1"); }catch(e){}
    render();
  });
}

/* Schnappschuss: alle 7 Tage eine vollständige Kopie von state.db in IndexedDB (nicht in localStorage -
   der Platz dort gehört den eigentlichen Daten). Es gibt immer nur einen, der alte wird überschrieben.
   Klappt das Speichern nicht (voll, gesperrt), wird still beim nächsten Start neu versucht. */
var SNAP_TAGE = 7, SNAP_DB = "bloc-sicherung", SNAP_STORE = "stand", SNAP_KEY = "schnappschuss";
var snapZeit = null;   // null = noch nicht nachgesehen, 0 = keiner vorhanden, sonst Zeitpunkt (ms)
function snapOeffnen(){
  return new Promise(function(ok, fehler){
    if(!window.indexedDB){ fehler(); return; }
    var req;
    try{ req = indexedDB.open(SNAP_DB, 1); }catch(e){ fehler(e); return; }
    req.onupgradeneeded = function(){ req.result.createObjectStore(SNAP_STORE); };
    req.onsuccess = function(){ ok(req.result); };
    req.onerror = function(){ fehler(req.error); };
    req.onblocked = function(){ fehler(); };
  });
}
function snapLesen(){
  return snapOeffnen().then(function(db){
    return new Promise(function(ok, fehler){
      try{
        var q = db.transaction(SNAP_STORE, "readonly").objectStore(SNAP_STORE).get(SNAP_KEY);
        q.onsuccess = function(){ ok(q.result || null); };
        q.onerror = function(){ fehler(q.error); };
      }catch(e){ fehler(e); }
    });
  });
}
function snapSchreiben(wert){
  return snapOeffnen().then(function(db){
    return new Promise(function(ok, fehler){
      try{
        var tx = db.transaction(SNAP_STORE, "readwrite");
        tx.objectStore(SNAP_STORE).put(wert, SNAP_KEY);
        tx.oncomplete = function(){ ok(); };
        tx.onerror = tx.onabort = function(){ fehler(tx.error); };
      }catch(e){ fehler(e); }
    });
  });
}
/* Beim Start: älter als 7 Tage (oder keiner) -> neuen ablegen. Nur wenn die gespeicherten Daten
   lesbar sind - und ein leerer Stand überschreibt nie einen Schnappschuss mit eigenen Inhalten
   (sonst wäre nach versehentlichem Löschen eine Woche später auch die Kopie weg). */
function snapPruefen(){
  var lesbar = false;
  try{ var roh = localStorage.getItem(DB_KEY); lesbar = !!roh && !!JSON.parse(roh); }catch(e){}
  snapLesen().then(function(alt){
    snapZeit = alt ? alt.zeit : 0;
    if(!lesbar) return;
    if(alt && Date.now() - alt.zeit < SNAP_TAGE*86400000) return;
    if(alt && hatEigenes(alt.daten) && !hatEigenes(state.db)) return;
    var neu = { zeit:Date.now(), daten:JSON.parse(JSON.stringify(state.db)) };
    return snapSchreiben(neu).then(function(){ snapZeit = neu.zeit; });
  }).catch(function(){}).then(snapZeileAktualisieren);
}
window.addEventListener("load", snapPruefen);
function snapDatum(zeit){
  return new Date(zeit).toLocaleDateString(currentLang()==="en" ? "en-GB" : "de-DE", { day:"2-digit", month:"2-digit", year:"numeric" });
}
function snapZeileHTML(){
  if(snapZeit === null) return '<small>'+t("snapInfo")+'</small>';
  if(!snapZeit) return t("snapNone")+'<small>'+t("snapInfo")+'</small>';
  var heute = new Date(); heute.setHours(0,0,0,0);
  var tag = new Date(snapZeit); tag.setHours(0,0,0,0);
  var n = Math.round((heute - tag) / 86400000);
  var wann = n <= 0 ? t("snapToday") : n === 1 ? t("snapYesterday") : t("snapDays", { n:n });
  return t("snapAgo", { x:wann })+'<small>'+t("snapInfo")+'</small>'+
    '<button type="button" class="btn btn-secondary" data-snaprestore>'+esc(t("snapRestore", { d:snapDatum(snapZeit) }))+'</button>';
}
function snapZeileAktualisieren(){
  var el = document.getElementById("snap-zeile");
  if(!el) return;
  el.innerHTML = snapZeileHTML();
}
function bindSnapZeile(){
  var el = document.getElementById("snap-zeile");
  if(!el) return;
  if(snapZeit === null) snapLesen().then(function(s){ snapZeit = s ? s.zeit : 0; }).catch(function(){ snapZeit = 0; }).then(snapZeileAktualisieren);
  el.addEventListener("click", function(ev){
    if(!ev.target.closest("[data-snaprestore]")) return;
    snapLesen().then(function(snap){
      if(!snap || !snap.daten) return;
      var d = snapDatum(snap.zeit);
      confirmSheet(t("snapQ"), t("snapText", { d:d }), t("snapBtn"), function(){
        var parsed = snap.daten;
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
    }).catch(function(){});
  });
}

