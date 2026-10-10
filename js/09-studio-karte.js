"use strict";
/* Plan nach Gewichtung: Reglerwerte 0-10 je Gruppe, Anzahl der Übungen; verteilt nach größtem Rest und zieht passende Studio-Übungen */
var stGen = null;   // { w:{gruppe:0-10}, n } solange die Seite offen ist
function stGenBauen(w, n){
  var tot = MUSKEL_GRP.reduce(function(a, g){ return a + (w[g.id] || 0); }, 0);
  if(!tot) return [];
  var q = MUSKEL_GRP.map(function(g){ var raw = (w[g.id] || 0)*n/tot; return { g:g.id, k:Math.floor(raw), rest:raw - Math.floor(raw) }; });
  var diff = n - q.reduce(function(a, x){ return a + x.k; }, 0);
  q.slice().sort(function(a, b){ return b.rest - a.rest; }).slice(0, diff).forEach(function(x){ x.k++; });
  var pools = {}, dazu = {};
  studioIds().filter(function(gr){ return !gr.air; }).forEach(function(gr){ gr.ids.forEach(function(id){   // nur Studio-Übungen, keine Air-Gruppen
    var ex = findExercise(id); if(!ex || ex.main === "stretch" || dazu[id]) return;
    dazu[id] = true;
    var v = mgVerteilung(ex), best = null;
    Object.keys(v).forEach(function(g){ if(best === null || v[g] > v[best]) best = g; });
    if(best) (pools[best] = pools[best] || []).push(id);
  }); });
  var aus = [];
  q.forEach(function(x){ shuffle(pools[x.g] || []).slice(0, x.k).forEach(function(id){ aus.push(id); }); });
  return aus;
}
function renderStudioPlanGen(){
  var w = stGen.w;
  var html = topbar(t("genTitle"), { back:"#katalog" }) + '<div class="page-hint">'+esc(t("genHint"))+'</div><div class="card gen-card">'+
    MUSKEL_GRP.map(function(g){
      return '<div class="gen-row"><label for="gw-'+g.id+'">'+esc(t(g.key))+'</label><input type="range" id="gw-'+g.id+'" data-gw="'+g.id+'" min="0" max="100" step="1" value="'+(w[g.id] || 0)+'">'+
        '<b data-gp="'+g.id+'">'+(w[g.id] || 0)+'%</b></div>';
    }).join("")+
    '<div class="gen-row"><label for="gw-n">'+esc(t("genAnz"))+'</label><input type="range" id="gw-n" min="3" max="20" step="1" value="'+stGen.n+'"><b data-gn>'+stGen.n+'</b></div></div>'+
    '<button type="button" class="btn btn-primary" data-genmake>'+ICON_SAVE+' '+t("genMake")+'</button><div style="height:40px"></div>';
  app.innerHTML = html;
  var zur = app.querySelector("[data-back]");
  if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){ stGen = null; renderStudio(); window.scrollTo(0, 0); }); }
  bindCommon();
  /* Es sind immer genau 100 % zu verteilen: Wer einen Regler verschiebt, nimmt den anderen im gleichen Verhältnis etwas weg bzw. gibt ihnen etwas */
  function verteilen(id, v){
    var andere = MUSKEL_GRP.filter(function(g){ return g.id !== id; }), rest = 100 - v;
    var so = andere.reduce(function(a, g){ return a + (w[g.id] || 0); }, 0), sum = 0, gross = andere[0];
    andere.forEach(function(g){
      w[g.id] = so ? Math.round((w[g.id] || 0)*rest/so) : Math.round(rest/andere.length);
      sum += w[g.id];
      if(w[g.id] > w[gross.id]) gross = g;
    });
    w[gross.id] = Math.max(0, w[gross.id] + rest - sum);   // Rundungsrest
    w[id] = v;
    MUSKEL_GRP.forEach(function(g){
      var r = app.querySelector("#gw-"+g.id), b = app.querySelector('[data-gp="'+g.id+'"]');
      if(r) r.value = w[g.id];
      if(b) b.textContent = w[g.id]+"%";
    });
  }
  app.querySelectorAll("[data-gw]").forEach(function(el){ el.addEventListener("input", function(){ verteilen(el.getAttribute("data-gw"), +el.value); }); });  var nn = app.querySelector("#gw-n");
  nn.addEventListener("input", function(){ stGen.n = +nn.value; app.querySelector("[data-gn]").textContent = nn.value; });
  app.querySelector("[data-genmake]").addEventListener("click", function(){
    var ids = stGenBauen(w, stGen.n);
    if(!ids.length){ showToast(t("genZero")); return; }
    var p = { id:uid(), name:t("genName"), ids:ids, updatedAt:Date.now() };
    stPlaene().push(p); save();
    stGen = null; stPlanAktiv = p.id; stPlanBauen = false; stPlanQuery = "";
    renderStudio(); window.scrollTo(0, 0);
  });
}

/* Vorschlag für den nächsten Satz: heute der letzte Satz, sonst Arbeitsgewicht bzw. letztes Mal */
function studioVorschlag(id){
  if(studioPR && studioPR.id !== id) studioPR = null;
  var e = studioEintrag(id) || {}, z = studioZiel(id), log = e.log || [], heute = studioTag(Date.now());
  var h = log.length && studioTag(log[log.length-1].at) === heute ? log[log.length-1] : null;
  if(h && h.s.length) return { kg:h.s[h.s.length-1][0], wdh:h.s[h.s.length-1][1] };
  var vor = log.length ? log[log.length-1] : null;
  return { kg: e.kg != null ? e.kg : (vor && vor.s.length ? vor.s[0][0] : 0), wdh: vor && vor.s.length ? vor.s[0][1] : z.wdh };
}
/* Doppelte Progression: in den letzten zwei Einheiten mit dem Arbeitsgewicht alle Ziel-Sätze mit Ziel-Wdh. */
function studioSteigern(id){
  var e = studioEintrag(id), z = studioZiel(id);
  if(!e || !e.log || e.log.length < 2) return null;
  var kg = e.kg != null ? e.kg : e.log[e.log.length-1].s[0][0];
  if(!(kg > 0)) return null;
  var zwei = e.log.slice(-2);
  var ok = zwei.every(function(l){
    var gute = l.s.filter(function(x){ return x[0] >= kg && x[1] >= z.wdh; });
    return gute.length >= z.saetze;
  });
  if(!ok || (e.erhoeht && e.erhoeht >= zwei[1].at)) return null;
  return { kg:Math.round((kg + z.schritt)*100)/100, ziel:z.saetze+" × "+z.wdh };
}
function studioPauseStop(){
  if(!studioPause) return;
  clearInterval(studioPause.uhr);
  schedCancel();
  studioPause = null;
}
var ICON_STATS = '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>';
/* Leiste oben in der Karte: „Statistik“, Kurzfassung, kleine Kurve - ein Tipp öffnet das Statistik-Fenster */
/* Statistik-Kachel für Studio und Summit: immer sichtbar, eigene Zeile über dem Inhalt (so überdeckt sie keine Figur).
   Ohne Kurve steht eine gestrichelte Platzhalterlinie, ein Tipp öffnet in jedem Fall das Statistik-Fenster. */
function statsLeisteHTML(attr, kurz, pts, farbe){
  var kurve = wochenKurve(pts, "ssl-kurve") ||
    '<svg class="wo-kurve ssl-kurve leer" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,15 100,15"/></svg>';
  return '<button type="button" class="st-stats-leiste" '+attr+(farbe ? ' style="--cat:'+farbe+'"' : '')+'>'+
    '<span class="ssl-ico">'+svgIcon(ICON_STATS)+'</span>'+
    '<span class="ssl-text"><b>'+esc(t("stStats"))+'</b><small>'+esc(kurz)+'</small></span>'+
    kurve+
    '<span class="ssl-chev">'+ICON_CHEV+'</span></button>';
}
function studioStatsLeiste(id){
  var e = studioEintrag(id) || {}, log = (e.log || []).filter(function(l){ return l.s.length; }), kurz = t("stStatsNone");
  if(log.length){
    var best = 0;
    log.forEach(function(l){ l.s.forEach(function(x){ if(x[0] > best) best = x[0]; }); });
    kurz = t("stStatsKurz", { kg:studioKg(best), n:log.length });
  }
  return statsLeisteHTML("data-ststats", kurz, studioWochen(id));
}
/* Diagramm je Woche. fmt formatiert die Achsenwerte (Standard: Gewicht), schritt ist der Abstand, wenn alle Werte gleich sind.
   Ohne Punkte zeichnet es nur das leere Gerüst - dann sieht man trotzdem, was hier entsteht. */
function wochenDiagramm(pts, einheit, fmt, schritt){
  fmt = fmt || studioKg; schritt = schritt || 1;
  var B = 300, H = 130, l = 34, r = 10, o = 10, u = 22, leer = !pts.length;
  var vs = pts.map(function(q){ return q.v; }), mx = leer ? 0 : Math.max.apply(null, vs), mn = leer ? 0 : Math.min.apply(null, vs);
  if(mx === mn){ mx += schritt; mn = Math.max(0, mn - schritt); }
  var w0 = leer ? 0 : pts[0].w, wb = leer ? 1 : (pts[pts.length-1].w - w0 || 1);
  function X(q){ return l + (pts.length === 1 ? .5 : (q.w - w0)/wb) * (B - l - r); }
  function Y(q){ return o + (1 - (q.v - mn)/(mx - mn)) * (H - o - u); }
  function datum(w){ return new Date(w * 6048e5 - 216e6).toLocaleDateString(currentLang(), { day:"numeric", month:"numeric" }); }
  return '<svg class="wo-diagramm'+(leer ? ' leer' : '')+'" viewBox="0 0 '+B+' '+H+'" role="img" aria-label="'+esc(t("stWeekly"))+'">'+
    '<path class="wd-gitter" d="M'+l+' '+o+'H'+(B-r)+'M'+l+' '+((o+H-u)/2)+'H'+(B-r)+'M'+l+' '+(H-u)+'H'+(B-r)+'"/>'+
    '<text class="wd-txt" x="'+(l-5)+'" y="'+(o+4)+'" text-anchor="end">'+(leer ? '–' : fmt(mx))+'</text>'+
    '<text class="wd-txt" x="'+(l-5)+'" y="'+(H-u+4)+'" text-anchor="end">'+(leer ? '–' : fmt(mn))+'</text>'+
    (leer ? '' : '<text class="wd-txt" x="'+l+'" y="'+(H-5)+'">'+datum(pts[0].w)+'</text>')+
    (pts.length > 1 ? '<text class="wd-txt" x="'+(B-r)+'" y="'+(H-5)+'" text-anchor="end">'+datum(pts[pts.length-1].w)+'</text>' : '')+
    '<text class="wd-txt" x="'+(B/2)+'" y="'+(H-5)+'" text-anchor="middle">'+esc(einheit)+'</text>'+
    (pts.length > 1 ? '<polyline class="wd-linie" points="'+pts.map(function(q){ return X(q).toFixed(1)+","+Y(q).toFixed(1); }).join(" ")+'"/>' : '')+
    pts.map(function(q){ return '<circle class="wd-punkt" cx="'+X(q).toFixed(1)+'" cy="'+Y(q).toFixed(1)+'" r="3.5"/>'; }).join("")+'</svg>';
}
/* Statistik-Fenster für Studio und Summit. o: { titel, farbe, zahlen:[[Wert, Beschriftung] …], wochen, fmt, schritt, einheit,
   suffix (hinter dem Verlauf, z. B. " kg"), seit, hatDaten, leerText, letzteTitel, letzte:[[links, rechts] …] }.
   Ohne Daten bleibt alles stehen (Zahlen als „–“, leeres Diagramm), dazu ein kurzer Hinweis. */
function openStatistik(o){
  var root = document.getElementById("overlayRoot"), wo = o.wochen || [], fmt = o.fmt || studioKg;
  var hinweis = !o.hatDaten ? o.leerText : wo.length < 2 ? t("stOneWeek") : "";
  var innen = '<div class="st-stats-zahlen">'+o.zahlen.map(function(z){
      return '<div><b>'+esc(o.hatDaten ? z[0] : "–")+'</b><span>'+esc(z[1])+'</span></div>'; }).join("")+'</div>'+
    '<div class="wo-kopf"><span>'+esc(o.verlaufTitel)+(o.seit ? SEP+esc(t("stSince", { d:o.seit })) : '')+'</span>'+
      (wo.length > 1 ? '<b>'+fmt(wo[0].v)+' → '+fmt(wo[wo.length-1].v)+(o.suffix || '')+'</b>' : '')+'</div>'+
    wochenDiagramm(wo, o.einheit, fmt, o.schritt)+
    (hinweis ? '<p class="st-stats-hinweis">'+esc(hinweis)+'</p>' : '')+
    (o.letzte && o.letzte.length ? '<div class="info-title">'+esc(o.letzteTitel)+'</div>'+o.letzte.map(function(z){
      return '<div class="st-v-zeile"><span>'+esc(z[0])+'</span><b>'+esc(z[1])+'</b></div>'; }).join("") : '');
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet st-stats" role="dialog" aria-label="'+esc(t("stStats"))+'" style="--cat:'+o.farbe+'">'+
    '<h3>'+esc(t("stStats"))+SEP+esc(o.titel)+'</h3>'+innen+
    '<button type="button" class="btn btn-secondary" data-cancel style="margin-top:14px;">'+t("close")+'</button></div></div>';
  function zu(){ root.innerHTML = ""; }
  root.querySelector("[data-cancel]").addEventListener("click", zu);
  root.querySelector(".confirm-overlay").addEventListener("click", function(ev){ if(ev.target.classList.contains("confirm-overlay")) zu(); });
}
function openStudioStats(id){
  var ex = findExercise(id), e = studioEintrag(id) || {}, log = (e.log || []).filter(function(l){ return l.s.length; });
  var saetze = 0, best = 0;
  log.forEach(function(l){ saetze += l.s.length; l.s.forEach(function(x){ if(x[0] > best) best = x[0]; }); });
  openStatistik({
    titel:tplText(ex.name), farbe:studioFarbe(ex), hatDaten:log.length > 0, leerText:t("stStatsEmpty"),
    zahlen:[[studioKg(best)+" kg", t("stBestKg")], [String(log.length), t("stSessions")], [String(saetze), t("stSetsAll")]],
    verlaufTitel:t("stWeekly"), wochen:studioWochen(id), einheit:"kg", suffix:" kg",
    seit:log.length ? new Date(log[0].at).toLocaleDateString(currentLang(), { day:"numeric", month:"numeric", year:"2-digit" }) : "",
    letzteTitel:t("stLastN"),
    letzte:log.slice(-8).reverse().map(function(l){
      return [new Date(l.at).toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" }),
              l.s.map(function(x){ return studioKg(x[0])+"×"+x[1]; }).join(" · ")];
    })
  });
}
/* Summit: dieselbe Statistik für ein Programm (Bestzeit, Läufe, Zeit je Woche) */
function openRepStats(id, name){
  var b = repBestOf(id), log = (b && b.log) || [];
  openStatistik({
    titel:name, farbe:"var(--rep-color)", hatDaten:!!b, leerText:t("repStatsEmpty"),
    zahlen:[[b ? repUhr(b.best) : "", t("repBestZeit")], [b ? String(b.n) : "", t("repLaeufe")], [b ? repUhr(b.last) : "", t("repLetzte")]],
    verlaufTitel:t("repWeekly"), wochen:repWochen(id), fmt:repUhr, schritt:1000, einheit:"min",
    seit:log.length ? new Date(log[0][0]).toLocaleDateString(currentLang(), { day:"numeric", month:"numeric", year:"2-digit" }) : "",
    letzteTitel:t("repLastRuns"),
    letzte:log.slice(-8).reverse().map(function(x){
      return [new Date(x[0]).toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" }),
              repUhr(x[1])+(b && x[1] === b.best ? " ★" : "")];
    })
  });
}
function studioTimerKarte(id, titel, hinweis){
  var tm = studioTimer(id);
  return (titel ? '<div class="section-title">'+esc(titel)+'</div>' : '')+
    '<div class="card st-timer"><p class="st-timer-hint">'+esc(hinweis)+'</p>'+
      '<label>'+esc(t("stSets"))+'</label>'+stepperHTML("stt-reps", tm.reps, 1, 20, 1)+
      '<label>'+esc(t("stWork"))+'</label>'+stepperHTML("stt-work", tm.work, 5, 600, 5)+
      '<label>'+esc(t("stRest"))+'</label>'+stepperHTML("stt-rest", tm.rest, 0, 600, 5)+
      '<button type="button" class="btn btn-primary" data-sttimer style="margin-top:14px;">'+ICON_PLAY+' '+esc(t("stTimerStart"))+'</button>'+
    '</div>';
}
function studioTimerBinden(id, eintrag){
  var stt = app.querySelector(".st-timer");
  stt.querySelector("[data-sttimer]").addEventListener("click", function(){ studioPauseStop(); go("#playst/"+id); });
  bindSteppers(stt, function(){
    eintrag().timer = { reps:clamp(parseInt(stt.querySelector("#stt-reps").value)||3, 1, 20),
                        work:clamp(parseInt(stt.querySelector("#stt-work").value)||40, 5, 600),
                        rest:clamp(parseInt(stt.querySelector("#stt-rest").value)||0, 0, 600) };
    save();
  });
}
function studioInfoHTML(id, ex){
  var info = EX_INFO[id], lang = currentLang()==="en" ? 1 : 0;
  return info ? '<div class="section-title">'+esc(t("stInfo"))+'</div><div class="card st-info">'+
      (EX_MUSCLES[id] ? '<div class="info-mus"><div class="info-mus-t"><div><b>'+esc(musclesLabel(ex))+':</b> '+esc(musclesMain(ex))+'</div>'+
        (musclesAssist(ex) ? '<div class="info-mus-2">'+esc(t("musAssist"))+': '+esc(musclesAssist(ex))+'</div>' : '')+'</div>'+kkInfoHTML(ex)+'</div>' : '')+
      '<div class="info-title">'+t("howTo")+'</div><ol class="info-steps">'+info[lang].split("|").map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ol>'+
      (EX_POSTURE[id] ? '<div class="info-title">'+t("posture")+'</div><ul class="info-posture">'+EX_POSTURE[id][lang*2].split("|").map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul>'+
        '<div class="info-avoid"><b>'+t("avoid")+':</b> '+esc(EX_POSTURE[id][lang*2+1])+'</div>' : '')+
      (ILLU2[id] ? '<button type="button" class="btn btn-secondary" data-stinfo>'+esc(t("infoLong"))+'</button>' : '')+
    '</div>' : '';
}
/* Air-Übung im Studio: kein Gewicht, nur ein Block (Runden, Arbeit, Pause) zum Starten, dazu Notiz und Anleitung */
function renderStudioBlockKarte(id, ex){
  var e = studioEintrag(id) || {};
  app.innerHTML =
    topbar(tplText(ex.name), { back:"#timers", right:exFavBtn(id) }) +
    '<div class="card st-hero" style="--cat:'+studioFarbe(ex)+'">'+
      (ILLU[id] ? '<div class="st-figur">'+illuHTML(id, "st-illu")+'</div>' : '')+
    '</div>'+
    studioTimerKarte(id, t("stBlock"), t("stBlockHint"))+
    '<div class="section-title">'+esc(t("stNote"))+'</div>'+
    '<div class="card"><textarea id="st-notiz" rows="2" placeholder="'+esc(t("stNotePh"))+'">'+esc(e.notiz || "")+'</textarea></div>'+
    studioInfoHTML(id, ex)+
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a> · <a href="quellen.html" target="_blank" rel="noopener">'+t("sourcesLink")+'</a></p>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function eintrag(){ var a = studioAlle(); return a[id] || (a[id] = { log:[] }); }
  var fav = app.querySelector(".topbar [data-exfav]");
  if(fav) fav.addEventListener("click", function(){ toggleExFav(id); var y = window.scrollY; renderStudioKarte(id); window.scrollTo(0, y); });
  var inf = app.querySelector("[data-stinfo]");
  if(inf) inf.addEventListener("click", function(){ openExInfo(id, false); });
  var notiz = app.querySelector("#st-notiz");
  notiz.addEventListener("input", function(){ eintrag().notiz = notiz.value; save(); });
  studioTimerBinden(id, eintrag);
}
var studioPR = null;   // { id, kg, w, vorher } - zeigt nach einem Satz mit neuem Bestgewicht eine ruhige Zeile auf der Karte
function renderStudioKarte(id){
  var ex = findExercise(id);
  if(!ex){ go("#timers"); return; }
  if(studioNurBlock(ex)) return renderStudioBlockKarte(id, ex);
  if(studioPause && studioPause.id !== id) studioPauseStop();
  var e = studioEintrag(id) || {}, z = studioZiel(id), log = e.log || [], heute = studioTag(Date.now());
  var h = log.length && studioTag(log[log.length-1].at) === heute ? log[log.length-1] : null;
  var v = studioVorschlag(id), stg = studioSteigern(id), pause = e.pause || 90;
  if(e.kg != null && !h) v.kg = e.kg;
  var info = EX_INFO[id], lang = currentLang()==="en" ? 1 : 0;
  var verlauf = log.slice(-8).reverse().map(function(l){
    var d = new Date(l.at);
    return '<div class="st-v-zeile"><span>'+d.toLocaleDateString(currentLang(), { weekday:"short", day:"numeric", month:"numeric" })+'</span>'+
      '<b>'+l.s.map(function(x){ return studioKg(x[0])+"×"+x[1]; }).join(" · ")+'</b></div>';
  }).join("");
  // Kurve: bestes Gewicht je Woche
  var wo = studioWochen(id), kurve = "";
  if(wo.length > 1) kurve = '<div class="wo-kopf"><span>'+esc(t("stWeekly"))+SEP+esc(t("weeksN", { n:wo[wo.length-1].w - wo[0].w + 1 }))+'</span>'+
    '<b>'+studioKg(wo[0].v)+' → '+studioKg(wo[wo.length-1].v)+' kg</b></div>'+wochenKurve(wo, "st-kurve");
  app.innerHTML =
    topbar(tplText(ex.name), { back:"#timers", right:exFavBtn(id) }) +
    '<div class="card st-hero" style="--cat:'+studioFarbe(ex)+'">'+
      studioStatsLeiste(id)+
      (ILLU[id] ? '<div class="st-figur">'+illuHTML(id, "st-illu")+'</div>' : '')+
      '<div class="st-ziel">'+esc(t("stGoal"))+' '+z.saetze+' × '+z.wdh+
        (e.kg != null ? SEP+esc(t("stWeight"))+' '+studioKg(e.kg)+' kg' : '')+'</div>'+
      (stg ? '<div class="st-steigern"><span>'+esc(t("stSuggest", { z:stg.ziel, kg:studioKg(stg.kg) }))+'</span>'+
        '<button type="button" class="btn btn-primary" data-stup>'+esc(t("stSuggestYes"))+'</button></div>' : '')+
      '<div class="st-heute"><b>'+esc(t("stToday"))+':</b> '+(h && h.s.length ? h.s.map(function(x, i){
        return '<span class="st-satz">'+(i+1)+'. '+studioKg(x[0])+' × '+x[1]+'</span>'; }).join("") : '<span class="st-leer">–</span>')+'</div>'+
      '<div class="st-eingabe">'+
        '<div class="st-feld"><label>'+esc(t("stKg"))+'</label><div class="stepper st-step" data-min="0" data-max="500" data-step="'+z.schritt+'">'+
          '<button type="button" data-kgminus>&minus;</button><input type="text" inputmode="decimal" id="st-kg" value="'+studioKg(v.kg)+'"><button type="button" data-kgplus>&plus;</button></div></div>'+
        '<div class="st-feld"><label>'+esc(t("stReps"))+'</label><div class="stepper st-step">'+
          '<button type="button" data-wminus>&minus;</button><input type="number" inputmode="numeric" id="st-w" value="'+v.wdh+'"><button type="button" data-wplus>&plus;</button></div></div>'+
      '</div>'+
      '<button type="button" class="btn btn-primary st-los" data-stset>✓ '+esc(t("stSetDone"))+' '+((h ? h.s.length : 0)+1)+'</button>'+
      (studioPR ? '<div class="st-pr" role="status"><span class="st-pr-stern" aria-hidden="true">★</span><div><b>'+esc(t("stPrTitel"))+'</b><small>'+esc(t("stPrText", { kg:studioKg(studioPR.kg), w:studioPR.w, v:studioKg(studioPR.vorher) }))+'</small></div></div>' : '')+
      '<div class="st-pause" id="st-pause"'+(studioPause && studioPause.id === id ? '' : ' hidden')+'>'+
        '<span>'+esc(t("stPause"))+'</span><b id="st-pause-zeit"></b><button type="button" class="btn btn-secondary" data-stskip>'+esc(t("stSkip"))+'</button></div>'+
      '<div class="st-pausewahl">'+esc(t("stPause"))+': '+[60, 90, 120, 180].map(function(sec){
        return '<button type="button" class="fc-chip'+(pause === sec ? ' on' : '')+'" data-stpause="'+sec+'">'+(sec < 120 ? sec+" s" : (sec/60)+" min")+'</button>'; }).join("")+'</div>'+
      (h && h.s.length ? '<button type="button" class="st-undo" data-stundo>'+esc(t("stUndo"))+'</button>' : '')+
    '</div>'+
    '<div class="section-title">'+esc(t("stNote"))+'</div>'+
    '<div class="card"><textarea id="st-notiz" rows="2" placeholder="'+esc(t("stNotePh"))+'">'+esc(e.notiz || "")+'</textarea></div>'+
    '<details class="opt-mehr st-timer-auf"'+(state.db.settings.stTimerAuf ? ' open' : '')+'><summary>'+
      '<span class="om-ico">'+ICON_PLAY+'</span><span class="meta"><span class="name">'+esc(t("stTimer"))+'</span>'+
      '<span class="sub">'+studioTimer(id).reps+' × '+studioTimer(id).work+' s · '+esc(t("stRestKurz"))+' '+studioTimer(id).rest+' s</span></span>'+
      '<span class="om-pfeil" aria-hidden="true">▾</span></summary>'+studioTimerKarte(id, "", t("stTimerHint"))+'</details>'+
    studioInfoHTML(id, ex)+
    '<p class="info-risk">'+esc(t("ownRisk"))+' <a href="privacy.html#haftung" target="_blank" rel="noopener">'+t("ownRiskMore")+'</a> · <a href="quellen.html" target="_blank" rel="noopener">'+t("sourcesLink")+'</a></p>'+
    '<div style="height:40px"></div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderStudioKarte(id); window.scrollTo(0, y); }
  function eintrag(){ var a = studioAlle(); return a[id] || (a[id] = { log:[] }); }
  var kgIn = app.querySelector("#st-kg"), wIn = app.querySelector("#st-w");
  function kgWert(){ var x = parseFloat(String(kgIn.value).replace(",", ".")); return isFinite(x) && x >= 0 ? Math.min(500, x) : 0; }
  function an(sel, fn){ var el = app.querySelector(sel); if(el) el.addEventListener("click", fn); }
  an("[data-kgminus]", function(){ kgIn.value = studioKg(Math.max(0, kgWert() - z.schritt)); });
  an("[data-kgplus]", function(){ kgIn.value = studioKg(kgWert() + z.schritt); });
  an("[data-wminus]", function(){ wIn.value = Math.max(1, (parseInt(wIn.value) || 0) - 1); });
  an("[data-wplus]", function(){ wIn.value = Math.min(100, (parseInt(wIn.value) || 0) + 1); });
  kgIn.addEventListener("focus", function(){ kgIn.select(); });
  wIn.addEventListener("focus", function(){ wIn.select(); });
  an("[data-stset]", function(){
    var en = eintrag(), jetzt = Date.now(), kg = kgWert(), w = Math.max(1, Math.min(100, parseInt(wIn.value) || 1));
    var l = en.log.length && studioTag(en.log[en.log.length-1].at) === studioTag(jetzt) ? en.log[en.log.length-1] : null;
    var vorher = 0;   // bisheriges Bestgewicht (vor diesem Satz)
    en.log.forEach(function(lg){ lg.s.forEach(function(x){ if(x[0] > vorher) vorher = x[0]; }); });
    if(!l){ l = { at:jetzt, s:[] }; en.log.push(l); if(en.log.length > 60) en.log = en.log.slice(-60); }
    l.s.push([kg, w]);
    studioPR = vorher > 0 && kg > vorher ? { id:id, kg:kg, w:w, vorher:vorher } : null;
    en.kg = kg; en.zuletzt = jetzt;
    studioVerlauf(id, jetzt);
    save();
    vibrate([30]);
    studioPauseStart(id, pause);
    neu();
  });
  an("[data-stundo]", function(){
    var en = eintrag(), l = en.log[en.log.length-1];
    if(l && studioTag(l.at) === heute){ l.s.pop(); if(!l.s.length) en.log.pop(); }
    studioPR = null;
    studioPauseStop(); save(); neu();
  });
  an("[data-stup]", function(){ var en = eintrag(); en.kg = stg.kg; en.erhoeht = Date.now(); save(); showToast(t("stRaised", { kg:studioKg(stg.kg) })); neu(); });
  an("[data-stskip]", function(){ studioPauseStop(); neu(); });
  an("[data-stinfo]", function(){ openExInfo(id, false); });
  an("[data-ststats]", function(){ openStudioStats(id); });
  an(".topbar [data-exfav]", function(){ toggleExFav(id); neu(); });
  studioTimerBinden(id, eintrag);
  var auf = app.querySelector(".st-timer-auf");
  auf.addEventListener("toggle", function(){ if(!!state.db.settings.stTimerAuf === auf.open) return; state.db.settings.stTimerAuf = auf.open; save(); });
  auf.querySelector(".st-timer").addEventListener("click", function(){   // Kopfzeile nachführen
    var tm = studioTimer(id); auf.querySelector("summary .sub").textContent = tm.reps+" × "+tm.work+" s · "+t("stRestKurz")+" "+tm.rest+" s";
  });
  app.querySelectorAll("[data-stpause]").forEach(function(b){ b.addEventListener("click", function(){ eintrag().pause = +b.getAttribute("data-stpause"); save(); neu(); }); });
  var notiz = app.querySelector("#st-notiz");
  notiz.addEventListener("input", function(){ eintrag().notiz = notiz.value; save(); });
  studioPauseZeigen();
  window.scrollTo(0, 0);   // Karte öffnet oben bei der Eingabe (neu() stellt beim Nachzeichnen die Position wieder her)
}
/* Pause nach einem Satz: Countdown auf der Karte, Signalton über den Audio-Takt (klingt auch bei aus-
   geschaltetem Bildschirm), Countdown-Töne 3-2-1 wie im Timer */
function studioPauseStart(id, sek){
  studioPauseStop();
  var ende = Date.now() + sek*1000;
  studioPause = { id:id, ende:ende, uhr:setInterval(studioPauseZeigen, 250) };
  if(state.db.settings.sound && audioCtx()){
    for(var k=3; k>=1; k--) schedNotes(tickNotes(), ende - k*1000);
    schedNotes(currentSoundStyle().work, ende);
  }
}
function studioPauseZeigen(){
  var box = document.getElementById("st-pause"), zeit = document.getElementById("st-pause-zeit");
  if(!studioPause){ if(box) box.hidden = true; return; }
  var rest = studioPause.ende - Date.now();
  if(rest <= 0){
    clearInterval(studioPause.uhr);
    studioPause = null;
    vibrate([60, 80, 60]);
    if(box){ box.hidden = false; box.classList.add("vorbei"); if(zeit) zeit.textContent = t("stPauseEnd"); }
    return;
  }
  if(box){ box.hidden = false; box.classList.remove("vorbei"); }
  if(zeit) zeit.textContent = fmtTime(Math.ceil(rest/1000));
}
/* Studio zählt für die Wochenzeile: ein Eintrag je Tag, die Dauer vom ersten bis zum letzten Satz */
function studioVerlauf(id, jetzt){
  pruneHistory(state.db);
  var hs = state.db.history, tag = studioTag(jetzt), e = null;
  for(var i=hs.length-1; i>=0; i--) if(hs[i].studio && studioTag(hs[i].studio) === tag){ e = hs[i]; break; }
  if(!e){ e = { at:jetzt, ex:[], dur:0, studio:jetzt, b:"timer" }; hs.push(e); }
  if(e.ex.indexOf(id) < 0) e.ex.push(id);
  e.dur = Math.round((jetzt - e.studio)/1000) + 60;
}

/* Play- und Stern-Knöpfe in Listen (Startseite, Timer-Seite) */
function bindFavItems(refresh){
  app.querySelectorAll("[data-favstart]").forEach(function(el){
    function los(){ if(el.getAttribute("aria-disabled")) return; go(el.getAttribute("data-favstart")); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); los(); } });
  });
  var more = app.querySelector("[data-favall]");
  if(more) more.addEventListener("click", function(){ favShowAll = !favShowAll; var y = window.scrollY; refresh(); window.scrollTo(0, y); });
  app.querySelectorAll("[data-favgo]").forEach(function(el){
    el.addEventListener("click", function(e){
      e.stopPropagation();
      coverDraft = null;
      go("#cover/"+el.getAttribute("data-favgo"));
    });
  });
  app.querySelectorAll("[data-fav]").forEach(function(el){
    el.addEventListener("click", function(e){ e.stopPropagation(); toggleFav(el.getAttribute("data-fav")); refresh(); });
  });
  app.querySelectorAll("[data-play]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      if(btn.disabled) return;
      go("#play/"+btn.getAttribute("data-play"));
    });
  });
  app.querySelectorAll("[data-playblock]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      go("#playblock/"+btn.getAttribute("data-playblock"));
    });
  });
}

