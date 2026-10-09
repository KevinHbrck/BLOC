"use strict";
/* ============ Rep-Workouts ============
   Ohne Intervalle: alle Wiederholungen so schnell wie möglich, eine Stoppuhr läuft mit. Eigener, schlichter
   Ablauf in der Seite - der Intervall-Timer bleibt unberührt. Programme stehen in daten.js (REP_WORKOUT_ROWS).
   Bestzeiten: settings.repBest[id] = { best, last, n, at } (Millisekunden). */
var repFilter = { lvl:"all", bar:"all", tab:"einheiten", stufe:"standard" };
var repRun = null, repQuery = "";
function repRow(id){ for(var i=0;i<REP_WORKOUT_ROWS.length;i++) if(REP_WORKOUT_ROWS[i][0]===id) return REP_WORKOUT_ROWS[i]; return null; }
function repName(row){ return currentLang()==="en" ? row[2] : row[1]; }
function repRunden(row){ var n = 0; row[4].forEach(function(x){ n = Math.max(n, x[1].length); }); return n; }
function repWdh(row){ var n = 0; row[4].forEach(function(x){ x[1].forEach(function(m){ if(typeof m === "number") n += m; }); }); return n; }
function repBrauchtStange(row){
  return row[4].some(function(x){ var ex = REP_PSEUDO[x[0]] ? null : findExercise(x[0]); return !!(ex && ex.equip.indexOf("bar") > -1); });
}
function repExName(id){ var ex = REP_PSEUDO[id] ? null : findExercise(id); return ex ? tplText(ex.name) : tplText(REP_PSEUDO[id]); }
function repIllu(id){ return REP_PSEUDO[id] ? REP_PSEUDO[id].illu : id; }
function repSek(m){ return typeof m === "string" && /^\d+s$/.test(m) ? parseInt(m, 10) : 0; }
function repUhr(ms){
  var s = Math.max(0, Math.floor(ms/1000)), h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60;
  return (h ? h+":"+(m<10?"0":"")+m : m)+":"+(x<10?"0":"")+x;
}
function repMenge(m){
  if(typeof m === "number") return "×"+m;
  var sek = repSek(m);
  if(sek) return repUhr(sek*1000);
  return String(m).replace(/(\d)(k?m)$/, "$1 $2").replace("×", " × ");
}
/* Quelle eines Ablaufs: ein Programm („saentis“) oder eine Einheit aus mehreren Programmen („e1-standard-2“).
   teile = [{ row, von, bis, f }] - Runden von..bis, f = Faktor für Wiederholungen/Strecken */
var REP_STUFEN = ["leicht", "standard", "fortgeschritten"];
function repTeilParse(e){
  var m = /^([a-z0-9-]+)(?::(\d+)-(\d+))?(?:\*([\d.]+))?$/.exec(e) || [];
  var row = repRow(m[1]);
  if(!row) return null;
  var R = repRunden(row);
  return { row:row, von:m[2] ? +m[2] : 1, bis:Math.min(m[3] ? +m[3] : R, R), f:m[4] ? +m[4] : 1 };
}
/* „3 · Stufenweg“ bzw. mit Route „3 · Stufenweg · Südroute“ (ohne Namen: „Einheit 3“) */
function repEinheitTitel(eid, variante, varianten){
  var n = REP_EINHEIT_NAMEN[eid], en = currentLang() === "en" ? 1 : 0, nr = eid.slice(1);
  var titel = n ? nr+" · "+n[en] : t("unitN", { n:nr });
  if(varianten > 1) titel += " · "+(REP_ROUTEN[variante-1] ? REP_ROUTEN[variante-1][en] : t("variant", { n:variante }));
  return titel;
}
function repEinheit(eid){ for(var i=0;i<REP_EINHEITEN.length;i++) if(REP_EINHEITEN[i][0]===eid) return REP_EINHEITEN[i]; return null; }
/* Eigene Challenges: settings.myReps = [{ id:"my-…", name, runden, zeilen:[{ ex, art:"wdh"|"sek", m:[Menge je Runde] }] }].
   Sie werden zu einer Programmzeile wie in REP_WORKOUT_ROWS - Ablauf, Tabelle und Bestzeit bleiben dieselben. */
function myRep(id){ var l = state.db.settings.myReps || []; for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i]; return null; }
function myRepRow(c){
  return [c.id, c.name, c.name, 0, c.zeilen.map(function(z){
    return [z.ex, z.m.slice(0, c.runden).map(function(v){ v = +v || 0; return v > 0 ? (z.art === "sek" ? v+"s" : z.art === "m" ? v+"m" : v) : 0; })];
  })];
}
/* Programm oder Einheit als Kopie unter „Meine“ ablegen (Runden hintereinander, Strecken in Metern, Zeiten in Sekunden) */
function repZuMeine(id){
  var q = repQuelle(id);
  if(!q) return;
  var R = repQRunden(q), zeilen = [], off = 0;
  q.teile.forEach(function(tl){
    tl.row[4].forEach(function(x){
      var art = "wdh", m = [];
      for(var r=0; r<R; r++) m.push(0);
      x[1].slice(tl.von-1, tl.bis).forEach(function(v, k){
        if(!v) return;
        v = repMengeMal(v, tl.f);
        var sek = repSek(v), d = /^(\d+(?:\.\d+)?)(m|km)$/.exec(v);
        if(sek){ art = "sek"; v = sek; }
        else if(d){ art = "m"; v = Math.round(+d[1]*(d[2] === "km" ? 1000 : 1)); }
        else v = +v || 0;
        m[off+k] = v;
      });
      var z = null;
      zeilen.forEach(function(y){ if(y.ex === x[0] && y.art === art) z = y; });   // gleiche Übung in einem anderen Teil: eine Zeile
      if(z) m.forEach(function(v, i){ if(v) z.m[i] = v; });
      else zeilen.push({ ex:x[0], art:art, m:m });
    });
    off += tl.bis - tl.von + 1;
  });
  var c = { id:"my-"+uid(), name:q.name, runden:R, zeilen:zeilen, updatedAt:Date.now() };
  (state.db.settings.myReps || (state.db.settings.myReps = [])).push(c);
  save();
  showToast(t("repKopiert", { n:q.name }));
}
function repMenue(id){
  var q = repQuelle(id);
  if(!q) return;
  var acts = [];
  if(q.eigen) acts.push({ ico:ICON_EDIT, label:t("edit"), fn:function(){ go(repEditRoute(q)+id); } });
  if(!q.unit || !q.eigen) acts.push({ ico:ICON_COPY, label:t(q.eigen ? "actCopy" : "adoptMine"), fn:function(){ repZuMeine(id); } });
  openActionSheet(q.name, acts);
}
/* Eigene Einheiten (mehrere Programme hintereinander): settings.myRepUnits = [{ id:"myu-…", name, teile:[{ prog, von, bis, f }], updatedAt }]
   prog = Programm-ID (fest oder eigen „my-…“), von/bis = Runden, f = 1 oder 0.5 (halbe Menge). Sie erscheinen unter Einheiten und Meine. */
function myRepUnit(id){ var l = state.db.settings.myRepUnits || []; for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i]; return null; }
function repProgRow(id){
  if(/^my-/.test(id || "")){ var c = myRep(id); return c ? myRepRow(c) : null; }
  return repRow(id);
}
function repEditRoute(q){ return q.unit ? "#repunitedit/" : "#repedit/"; }
function repQuelle(id){
  if(/^myu-/.test(id || "")){
    var u = myRepUnit(id);
    if(!u) return null;
    var tt = (u.teile || []).map(function(p){
      var row = repProgRow(p.prog);
      if(!row) return null;
      var R = repRunden(row), von = clamp(+p.von || 1, 1, Math.max(R, 1)), bis = clamp(+p.bis || R, von, Math.max(R, 1));
      return { row:row, von:von, bis:bis, f:p.f === 0.5 ? 0.5 : 1 };
    }).filter(Boolean);
    return { id:id, name:u.name || t("reUnitDefault"), einzel:false, eigen:true, unit:true, lvl:0, teile:tt };
  }
  if(/^my-/.test(id || "")){
    var c = myRep(id);
    if(!c) return null;
    var mr = myRepRow(c);
    return { id:id, name:c.name || t("reDefaultName"), einzel:true, eigen:true, lvl:0, teile:[{ row:mr, von:1, bis:repRunden(mr), f:1 }] };
  }
  var row = repRow(id);
  if(row) return { id:id, name:repName(row), einzel:true, lvl:row[3], teile:[{ row:row, von:1, bis:repRunden(row), f:1 }] };
  var m = /^(e\d+)-(leicht|standard|fortgeschritten)-(\d+)$/.exec(id || "");
  var e = m && repEinheit(m[1]);
  if(!e) return null;
  var varianten = e[1 + REP_STUFEN.indexOf(m[2])], v = varianten[+m[3] - 1];
  if(!v) return null;
  return { id:id, einzel:false, stufe:m[2], nr:m[1].slice(1), variante:+m[3], varianten:varianten.length,
           name:repEinheitTitel(m[1], +m[3], varianten.length)+" · "+t("stufe_"+m[2]),
           teile:v.map(repTeilParse).filter(Boolean) };
}
function repMengeMal(m, f){
  if(f === 1) return m;
  if(typeof m === "number") return Math.max(1, Math.round(m*f));
  var d = /^(\d+(?:\.\d+)?)(m|km)$/.exec(m);
  if(!d) return m;
  var v = +d[1]*f;
  if(d[2] === "km" && v < 1) return Math.round(v*1000)+"m";
  return (Math.round(v*10)/10)+d[2];
}
function repTeilName(tl){
  var n = repName(tl.row), R = repRunden(tl.row);
  if(tl.von > 1 || tl.bis < R) n += " ("+(tl.von === tl.bis ? t("runde1Teil", { a:tl.von }) : t("rundenTeil", { a:tl.von, b:tl.bis }))+")";
  if(tl.f !== 1) n += " ("+t("halb")+")";
  return n;
}
function repQSchritte(q){
  var st = [];
  q.teile.forEach(function(tl){
    for(var r=tl.von-1; r<tl.bis; r++) tl.row[4].forEach(function(x){
      var m = x[1][r];
      if(m) st.push({ ex:x[0], m:repMengeMal(m, tl.f), r:r-(tl.von-1), R:tl.bis-tl.von+1, prog:q.einzel ? "" : repName(tl.row) });
    });
  });
  return st;
}
function repQWdh(q){ var n = 0; repQSchritte(q).forEach(function(x){ if(typeof x.m === "number") n += x.m; }); return n; }
function repQRunden(q){ var n = 0; q.teile.forEach(function(tl){ n += tl.bis - tl.von + 1; }); return n; }
function repQStange(q){ return q.teile.some(function(tl){ return repBrauchtStange(tl.row); }); }
function repBestOf(id){ var b = state.db.settings.repBest; return b && b[id] ? b[id] : null; }
function repWochen(id){ var b = repBestOf(id); return wochenWerte(b && b.log || [], true).slice(-16); }
/* Auf den Karten immer: Bestzeit, letzte Zeit und Anzahl der Läufe (ohne Lauf mit „–“) */
function repZeitenHTML(best){
  function z(wert, label){ return '<span class="rz"><b>'+(wert == null ? "–" : esc(String(wert)))+'</b>'+esc(label)+'</span>'; }
  return '<div class="rep-zeiten">'+z(best ? repUhr(best.best) : null, t("repBestZeit"))+z(best ? repUhr(best.last) : null, t("repLetzte"))+z(best ? best.n : null, t("repLaeufe"))+'</div>';
}
/* Auf den Karten: was zu tun ist - je Übung die Menge über die Runden („21 · 15 · 9“, gleich bleibend „5 × 20“) */
function repPlanEin(m){ if(typeof m === "number") return String(m); var sek = repSek(m); return sek ? repUhr(sek*1000) : repMenge(m); }
function repPlanHTML(q){
  var zeilen = [];
  q.teile.forEach(function(tl){
    tl.row[4].forEach(function(x){
      var w = [];
      for(var r=tl.von-1; r<tl.bis; r++){ var m = x[1][r]; if(m) w.push(repMengeMal(m, tl.f)); }
      if(!w.length) return;
      var gleich = w.every(function(v){ return String(v) === String(w[0]); });
      var txt = w.length === 1 ? repPlanEin(w[0]) : gleich ? w.length+" × "+repPlanEin(w[0])
        : w.length > 6 ? w.slice(0, 5).map(repPlanEin).join(" · ")+" …" : w.map(repPlanEin).join(" · ");
      zeilen.push('<span class="rpl-ex">'+esc(repExName(x[0]))+'</span><span class="rpl-m">'+esc(txt)+'</span>');
    });
  });
  if(!zeilen.length) return "";
  var max = 6;
  if(zeilen.length > max) zeilen = zeilen.slice(0, max-1).concat(['<span class="rpl-mehr">'+esc(t("repMore", { n:zeilen.length-(max-1) }))+'</span>']);
  return '<div class="rep-plan">'+zeilen.join("")+'</div>';
}

