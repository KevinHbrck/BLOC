"use strict";
/* ============ Workouts per Link teilen ============ */
/* Das Workout steckt komprimiert in der Adresse (#import/…): kein Server, kein Konto.
   Erstes Zeichen: "z" = deflate-komprimiert, "j" = reines JSON (Fallback für alte Browser). */
function b64urlFromBytes(bytes){
  var bin = "";
  for(var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function bytesFromB64url(str){
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while(str.length % 4) str += "=";
  var bin = atob(str), out = new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i);
  return out;
}
function pipeBytes(bytes, stream){
  return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function(b){ return new Uint8Array(b); });
}
function encodeShare(obj){
  var raw = new TextEncoder().encode(JSON.stringify(obj));
  if(window.CompressionStream){
    return pipeBytes(raw, new CompressionStream("deflate-raw"))
      .then(function(b){ return "z"+b64urlFromBytes(b); })
      .catch(function(){ return "j"+b64urlFromBytes(raw); });
  }
  return Promise.resolve("j"+b64urlFromBytes(raw));
}
function decodeShare(str){
  try{
    var kind = str.charAt(0), bytes = bytesFromB64url(str.slice(1));
    var p = kind==="z"
      ? (window.DecompressionStream ? pipeBytes(bytes, new DecompressionStream("deflate-raw")) : Promise.reject(new Error("no-inflate")))
      : Promise.resolve(bytes);
    return p.then(function(b){ return JSON.parse(new TextDecoder().decode(b)); });
  }catch(e){ return Promise.reject(e); }
}
function customDefOf(ex){
  var c = findCustom(ex.id);
  if(c) return { id:c.id, name:c.name, cats:c.cats, equip:c.equip, perSide:!!c.perSide, reps:c.reps, work:c.work, rest:c.rest, hint:c.hint||"" };
  return { id:ex.id, name:tplText(ex.name), cats:ex.cats, equip:ex.equip, perSide:ex.perSide, reps:ex.setReps, work:ex.workSec, rest:ex.restSec, hint:tplText(ex.hint) };
}
function sharePayload(d){
  var custom = [];
  d.items.forEach(function(it){
    var ex = findExercise(it.ex);
    if(ex && ex.custom && !custom.some(function(c){ return c.id===ex.id; })) custom.push(customDefOf(ex));
  });
  var p = { v:1, n:d.name, b:d.blockRest||0 };
  if(d.mode==="uniform"){ p.u = [d.reps, d.work, d.rest]; p.i = d.items.map(function(it){ return it.ex; }); }
  else p.i = d.items.map(function(it){ return [it.ex, it.reps, it.work, it.rest]; });
  if(custom.length) p.c = custom;
  return p;
}
function copyText(text, okMsg){
  function ok(){ showToast(okMsg); }
  function fallback(){
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); ok(); }catch(e){}
    document.body.removeChild(ta);
  }
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
  else fallback();
}
function shareDraft(d){
  if(!d || !d.items.length) return;
  encodeShare(sharePayload(d)).then(function(code){
    var url = appUrl()+"#import/"+code, msg = t("shareMsg", { n:d.name });
    if(navigator.share){
      navigator.share({ title:d.name, text:msg, url:url }).catch(function(err){
        if(!err || err.name !== "AbortError") copyText(url, t("shareLinkCopied"));
      });
    } else copyText(msg+" "+url, t("shareLinkCopied"));
  });
}
/* Link öffnen: Workout auf dem Deckblatt zeigen - speichern erst mit „Als Eigenes speichern“ */
function draftFromShare(p){
  if(!p || !Array.isArray(p.i)) return null;
  (p.c || []).forEach(function(c){
    if(c && c.id && c.name && !findExercise(c.id)){
      var ex = customToEx(c); ex.sharedDef = c; EXERCISES.push(ex);
    }
  });
  var uni = Array.isArray(p.u);
  var items = [], missing = 0;
  p.i.forEach(function(x){
    var id = uni ? x : (x && x[0]);
    var ex = typeof id === "string" && findExercise(id);
    if(!ex){ missing++; return; }
    items.push(uni ? itemFromEx(id) : { ex:id, reps:clamp(parseInt(x[1])||ex.reps, 1, 60), work:clamp(parseInt(x[2])||ex.workSec, 5, 600), rest:clamp(parseInt(x[3])||0, 0, 300) });
  });
  if(!items.length) return null;
  return { key:"shared:", src:"shared", name:String(p.n || t("myDefaultName")).slice(0, 40),
           mode: uni ? "uniform" : "individual",
           reps: uni ? clamp(parseInt(p.u[0])||6, 1, 60) : 6, work: uni ? clamp(parseInt(p.u[1])||30, 5, 600) : 30,
           rest: uni ? clamp(parseInt(p.u[2])||0, 0, 300) : 10, blockRest: clamp(parseInt(p.b)||0, 0, 600),
           items:items, _missing:missing };
}
function renderImport(code){
  app.innerHTML = topbar(t("kindShared"), { back:"#home" })+'<div class="empty" style="padding:40px 20px;">…</div>';
  bindCommon();
  decodeShare(code || "").then(function(p){
    var d = draftFromShare(p);
    if(!d) throw new Error("empty");
    coverDraft = d;
    if(navTop().indexOf("#import/") === 0){ navStack[navStack.length-1] = "#cover/shared"; setUrl("#cover/shared"); }
    render();
    if(d._missing) showToast(t("sharedMissing", { n:d._missing }));
  }).catch(function(){
    if(navTop().indexOf("#import/") !== 0) return;
    app.innerHTML = topbar(t("kindShared"), { back:"#home" })+'<div class="empty" style="padding:40px 20px;">'+t("shareBad")+'</div>';
    bindCommon();
  });
}
/* Eigene Übungen aus einem geteilten Link werden erst beim Speichern übernommen */
function adoptSharedCustoms(d){
  var changed = false;
  d.items.forEach(function(it){
    var ex = findExercise(it.ex);
    if(ex && ex.sharedDef && !findCustom(ex.id)){
      if(!state.db.customEx) state.db.customEx = [];
      state.db.customEx.push(ex.sharedDef); changed = true;
    }
  });
  if(changed){ save(); syncCustomEx(); }
}

/* ============ Eigenes Workout und Deckblatt: gemeinsamer Editor mit Drag & Drop ============ */
var ICON_GRIP = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.8"/><circle cx="15" cy="6" r="1.8"/><circle cx="9" cy="12" r="1.8"/><circle cx="15" cy="12" r="1.8"/><circle cx="9" cy="18" r="1.8"/><circle cx="15" cy="18" r="1.8"/></svg>';

/* Baukasten: Arbeitskopie, die sich selbst speichert - sobald mindestens eine Übung drin ist, wird jede Änderung sofort gesichert
   (kein „Speichern“-Knopf nötig). Ein neues Workout ohne Übung bleibt unangelegt (neu = noch nicht in der Liste). */
var bauEntwurf = null;
function renderMyBuild(id){
  if(!bauEntwurf || bauEntwurf.key !== id){
    if(id === "new"){
      bauEntwurf = { key:id, neu:true, d:{ id:uid(), name:t("myDefaultName"), mode:"uniform", reps:6, work:30, rest:10, blockRest:45, items:[] } };
      if(bauNeuWs){ bauEntwurf.d.ws = bauNeuWs; if(bauNeuWs === "dehn") bauEntwurf.d.work = 30; }
      bauNeuWs = "";
    }
    else { var mw = findMy(id); if(!mw){ go("#library"); return; } bauEntwurf = { key:id, d:draftCopy(mw) }; }
  }
  renderDraftPage(bauEntwurf.d, { cover:false, back:bauEntwurf.d.ws ? "#warmstretch" : "#library", id:bauEntwurf.d.id, bau:bauEntwurf });
}
function bauSpeichern(b){
  var d = b.d, l = state.db.myWorkouts || (state.db.myWorkouts = []), mw = null;
  for(var i=0;i<l.length;i++) if(l[i].id === d.id) mw = l[i];
  if(!mw){ mw = { id:d.id }; l.push(mw); }
  mw.name = d.name; mw.mode = d.mode; mw.reps = d.reps; mw.work = d.work; mw.rest = d.rest; mw.blockRest = d.blockRest;
  mw.items = draftCopy(d.items); mw.updatedAt = Date.now();
  if(d.ws) mw.ws = d.ws; else delete mw.ws;
  save();
  if(b.neu){   // ab jetzt ein normales Workout: Adresse und Zurück-Verlauf zeigen darauf
    b.neu = false; b.key = d.id;
    navStack[navStack.length-1] = "#mybuild/"+d.id; setUrl(navTop());
  }
  b.dirty = false;
}
function renderCover(kind, id){
  var key = kind+":"+(id||"");
  if(!coverDraft || coverDraft.key !== key){
    if(kind==="lib"){ var lw = findLibWorkout(id); if(!lw){ go("#library"); return; } coverDraft = draftFromLib(lw); }
    else if(kind==="my"){ var mw = findMy(id); if(!mw){ go("#library"); return; } coverDraft = draftFromMy(mw); }
    else { go("#library"); return; }
  }
  renderDraftPage(coverDraft, { cover:true, back:coverDraft.ws ? "#warmstretch" : "#library" });
}

/* cfg.cover: Deckblatt (Änderungen nur für dieses Training) - sonst Baukasten (speichert sofort).
   Aufbau (2026-09): Übungen als große Kacheln mit Figur und Namen. Antippen = hinzufügen (Kachel wird blau und
   zeigt ihre Position), nochmal antippen = entfernen. Der Ablauf steht als schmaler Streifen oben; ein Tipp auf
   eine Übung darin öffnet Zeiten, Verschieben, Tauschen, Entfernen. „Sinnvoll ordnen“ sortiert fachlich:
   große Übungen zuerst, Unter- und Oberkörper und Rumpf im Wechsel, Dehnen am Ende. */
function wbSinnvollOrdnen(items){
  var dehn = [], topf = { full:[], lower:[], upper:[], core:[] };
  items.forEach(function(it){
    var ex = findExercise(it.ex);
    if(!ex || exIsMobility(it.ex)){ dehn.push(it); return; }
    var r = exProfile(ex).region;
    (topf[r] || topf.full).push(it);
  });
  // schwere Übungen (Stufe) innerhalb jeder Gruppe zuerst - solange die Kraft noch frisch ist
  Object.keys(topf).forEach(function(k){ topf[k].sort(function(a, b){ return (findExercise(b.ex).level||2) - (findExercise(a.ex).level||2); }); });
  var aus = topf.full.slice(), reihe = ["lower", "upper", "core"], i = 0;
  while(topf.lower.length || topf.upper.length || topf.core.length){
    var k = reihe[i++ % 3];
    if(topf[k].length) aus.push(topf[k].shift());
  }
  return aus.concat(dehn);
}
function wbTauschKandidat(d, i){
  var alt = findExercise(d.items[i].ex);
  if(!alt) return null;
  var drin = {}; d.items.forEach(function(it){ drin[it.ex] = true; });
  var p = d._params, equips = p && p.equips ? p.equips : null, reg = exProfile(alt).region;
  var pool = EXERCISES.filter(function(ex){
    return !drin[ex.id] && !STUDIO_NUR[ex.id] && !libHidden("ex:"+ex.id) && ex.main === alt.main && (!equips || equipMatch(equips, ex));
  });
  var gleich = pool.filter(function(ex){ return exProfile(ex).region === reg; });
  var wahl = gleich.length ? gleich : pool;
  return wahl.length ? wahl[Math.floor(Math.random()*wahl.length)] : null;
}
function renderDraftPage(d, cfg){
  var s = state.db.settings;
  // Dehn- und Mobility-Übungen stehen immer am Ende
  var geordnet = stretchLast(d.items, function(it){ return it.ex; });
  if(geordnet.some(function(it, i){ return it !== d.items[i]; })){
    d.items = geordnet;
  }
  function ohne(l, x){ return l.filter(function(v){ return v !== x; }); }
  var cat = ohne(selArr(s.buildCats || s.buildCat), "stretch"), sort = s.libSort === "az" ? "az" : "std";
  var equip = ohne(selArr(s.buildEquips), "gym");
  var zonen = kkNorm(s.buildZonen);
  var run = draftRun(d);
  var exs = d.items.map(function(it){ return findExercise(it.ex); }).filter(Boolean);
  var cats = [];
  exs.forEach(function(ex){ ex.cats.forEach(function(c){ if(cats.indexOf(c)<0) cats.push(c); }); });
  var hasSides = exs.some(function(ex){ return ex.perSide; });
  var dauer = fmtDuration(workoutDuration(run));

  // Position(en) jeder Übung im Ablauf - für die blaue Markierung der Kacheln
  var pos = {};
  d.items.forEach(function(it, i){ (pos[it.ex] = pos[it.ex] || []).push(i+1); });
  function kachel(ex){
    return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:'data-wbex="'+ex.id+'"', q:exSearchText(ex), cat:'var(--bereich, '+catVar(ex.cats[0])+')', nr:pos[ex.id] || [], unter:kachelMuskel(ex),
      innen:'<button type="button" class="wb-i" data-exinfo="'+ex.id+'" aria-label="'+esc(t("info"))+'">i</button>'+exFavBtn(ex.id) });
  }
  // Ablauf: Deckblatt = große Kacheln in Reihenfolge, Baukasten = schmaler Streifen
  function ablaufKachel(it, i){
    var ex = findExercise(it.ex);
    if(!ex) return "";
    var tm = itemTiming(d, it);
    return uebKachel({ bild:ex.id, name:tplText(ex.name), attr:'data-wbitem="'+i+'"', cat:'var(--bereich, '+catVar(ex.cats[0])+')', klasse:"wb-ablauf",
      innen:'<span class="wb-nr">'+(i+1)+'</span>', unter:'<span class="st-sub">'+timingText(tm, ex.perSide)+'</span>' });
  }
  var streifen = d.items.map(function(it, i){
    var ex = findExercise(it.ex);
    if(!ex) return "";
    return '<button type="button" class="wb-mini" data-wbitem="'+i+'" style="--cat:var(--bereich, '+catVar(ex.cats[0])+')" aria-label="'+esc((i+1)+". "+tplText(ex.name))+'">'+
      (ILLU[ex.id] ? illuStillHTML(ex.id, "wb-mini-illu") : '')+'<span class="wb-mini-nr">'+(i+1)+'</span>'+
      '<span class="wb-mini-name">'+esc(tplText(ex.name))+'</span></button>';
  }).join("");

  // Zeiten: Vorlagen, einheitlich/individuell, Pause zwischen Übungen (auf dem Deckblatt zugeklappt)
  var rests = [0,15,30,45,60,90,120];
  if(rests.indexOf(d.blockRest) < 0) rests.push(d.blockRest);
  var optInner =
    '<label>'+t("timesLabel")+'</label>'+
    '<div class="seg-row">'+
      '<button type="button" data-mode="uniform" class="'+(d.mode==="uniform"?"active":"")+'">'+t("modeUniform")+'</button>'+
      '<button type="button" data-mode="individual" class="'+(d.mode==="individual"?"active":"")+'">'+t("modeIndividual")+'</button>'+
    '</div>'+
    (d.mode==="uniform"
      ? '<div class="tm-grid"><div><label>'+t("tmReps")+'</label>'+stepperHTML("d-reps", d.reps, 1, 30, 1)+'</div>'+
        '<div><label>'+t("tmWork")+'</label>'+stepperHTML("d-work", d.work, 5, 600, 5)+'</div>'+
        '<div><label>'+t("tmRest")+'</label>'+stepperHTML("d-rest", d.rest, 0, 300, 5)+'</div></div>'
      : '<div class="tm-hint">'+t("modeIndividualHint")+'</div>')+
    (hasSides ? '<div class="tm-hint">'+t("sidesNote")+'</div>' : '')+
    '<label for="d-br">'+t("myRest")+'</label>'+
    '<select id="d-br">'+rests.sort(function(a,b){return a-b;}).map(function(v){
      return '<option value="'+v+'"'+(v===d.blockRest?' selected':'')+'>'+v+' s</option>'; }).join("")+'</select>'+
    (cfg.cover ? '<div class="opt-sep"></div>'+toggleRow("c-voice", t("voice"), t("voiceDesc"), s.voice !== false) : '');
  var optOpen = !!s.coverOpts;
  var optSummary = (d.mode==="uniform" ? t("modeUniform")+' '+timingText({ reps:d.reps, work:d.work, rest:d.rest }, false) : t("modeIndividual"))+
    SEP+t("optRestShort", { n:d.blockRest })+(cfg.cover ? SEP+t(s.voice !== false ? "optVoiceOn" : "optVoiceOff") : '');
  var optionsHTML = '<div class="card opt-card">'+
      '<div class="opt-head" data-opttoggle role="button" tabindex="0" aria-expanded="'+optOpen+'">'+
        '<div><div class="opt-title">'+t("optTitle")+'</div><div class="opt-sum">'+optSummary+'</div></div>'+
        '<span class="tpl-chev'+(optOpen?'':' zu')+'" aria-hidden="true">&#9662;</span></div>'+
      (optOpen ? '<div class="opt-body">'+optInner+'</div>' : '')+
    '</div>';

  // Übungsauswahl: große Kacheln, gefiltert wie in der Bibliothek
  var palOpen = !cfg.cover || d._pal;
  var palHTML = "", hw = hinweise("", []);
  if(palOpen && d.ws){   // Mobility & Stretch: nur Aufwärm- bzw. Dehnübungen, bei Dehnen mit Körperregionen
    var wsSel = selArr(s.wsRegionen), wsAlle = wsUebungen(d.ws);
    var wsZon = kkNorm(s.wsZonen);
    var wsListe = wsAlle.filter(function(ex){ return (d.ws !== "dehn" || wsRegionOk(ex.id, wsSel)) && zonePasst(ex, wsZon); })
      .sort(function(a, b){ return (isExFav(b.id) ? 1 : 0) - (isExFav(a.id) ? 1 : 0); });
    hw = hinweise("bau", ["wbTippen"].concat(d.ws === "dehn" ? ["wsRegionHint"] : []));
    palHTML = '<div class="section-title">'+t("wbWaehlen")+'</div>'+
      hw.z(0, "page-hint")+
      suchFeldHTML(buildQuery, "b")+
      (d.ws === "dehn" ? hw.z(1, "page-hint") : '')+wsRegionFilterHTML(wsSel, wsListe.length, "Ex", wsZon, d.ws === "dehn")+
      '<div class="fig-grid" id="dz-pal">'+(wsListe.map(function(ex){ return kachel(ex); }).join("") ||
        '<div class="empty" style="padding:20px;">'+t("libEmpty")+'</div>')+'</div>'+
      '<div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div>';
  } else if(palOpen){
    var palListe = sortedExercises(cat, sort, equip, [], zonen).filter(fuerAir);
    hw = hinweise("bau", ["wbTippen"]);
    palHTML = '<div class="section-title">'+t("wbWaehlen")+'</div>'+
      hw.z(0, "page-hint")+
      suchFeldHTML(buildQuery, "b")+
      airFilterHTML("b", !!s.buildFilterOpen, cat, equip, sort, [["std", t("sortStd")], ["az", "A&ndash;Z"]], palListe.length, true, zonen)+
      '<div class="fig-grid" id="dz-pal">'+(palListe.map(function(ex){ return kachel(ex); }).join("") ||
        '<div class="empty" style="padding:20px;">'+t("libEmpty")+'</div>')+'</div>'+
      '<div class="empty" data-noresult style="display:none;padding:20px;">'+t("noResult")+'</div>';
  }

  /* Deckblatt-Aktionen: nur „Los geht's“ ist groß; bei „Überrasch mich“ zusätzlich groß „Nochmal mischen“ */
  function coverAct(attrs, ico, label, cls){
    return '<button type="button" class="cover-act'+(cls?' '+cls:'')+'" '+attrs+(exs.length?'':' disabled')+'><span class="ca-ico">'+ico+'</span><span>'+esc(label)+'</span></button>';
  }
  var ICON_MISCHEN = svgIcon('<path d="M3 7h3c2.6 0 4 1.6 5.2 3.9l1.6 3C14 16.3 15.5 17 18 17h3M3 17h3c1.5 0 2.6-.5 3.4-1.5M14.3 7.9C15.2 7.3 16.4 7 18 7h3M18 4l3 3-3 3M18 14l3 3-3 3"/>');
  var favOn = isFav(d.key);
  var coverActs = '<div class="cover-acts">'+
    (d.src!=="surprise" && d.src!=="shared" ? coverAct('data-fav="'+d.key+'" aria-pressed="'+favOn+'"', favOn ? '★' : '☆', t("favorite"), favOn ? 'on' : '') : '')+
    coverAct('data-savemy', svgIcon(ICON_COPY), t(d.src==="my" ? "actCopy" : "actSave"))+
    coverAct('data-share', ICON_SHARE, t("share"))+
    (d.src==="lib" ? coverAct('data-coverhide', svgIcon(ICON_EYE_OFF), t("hideShort")) : '')+
  '</div>';
  var kind = d.src==="lib" ? "kindLib" : d.src==="surprise" ? "kindSurprise" : d.src==="shared" ? "kindShared" : "kindMy";
  var warmDehn = d.src==="lib" && libIstWarmDehn(findLibWorkout(d.key.slice(4)));
  var head = cfg.cover
    ? '<div class="card cover-hero">'+
        '<div class="cover-kicker">'+t(kind)+'</div>'+
        '<h2 class="cover-name">'+esc(d.name)+'</h2>'+
        '<div class="cover-meta">'+t("exCount", { n:exs.length })+SEP+dauer+'</div>'+
        (exs.length ? '<div class="cat-tags">'+catTags(cats)+'</div>' : '')+
        (exs.length ? '<div class="cover-equip">'+esc(t("equipLabel"))+': '+esc(woEquipText(exs))+'</div>' : '')+
        (exs.length ? kkKopfHTML(d.items.map(function(it){ return it.ex; }), !!(warmDehn || d.ws)) : '')+
        '<button class="btn btn-primary" data-go'+(exs.length?'':'disabled')+'>'+ICON_PLAY+' '+t("letsGo")+'</button>'+
        (d.src==="surprise" ? '<button class="btn btn-secondary wb-mischen" data-reroll>'+ICON_MISCHEN+' '+t("wbMischen")+'</button>' : '')+
        coverActs+
        '<div class="cover-note">'+t(d._dirty ? "coverDirty" : "coverHint")+'</div>'+
      '</div>'
    : '<div class="card"><label for="m-name">'+t("name")+'</label>'+
        '<input type="text" id="m-name" value="'+esc(d.name)+'" maxlength="40">'+
        (exs.length ? kkKopfHTML(d.items.map(function(it){ return it.ex; }), !!d.ws) : '')+'</div>';

  var ablaufHTML = cfg.cover
    ? '<div class="section-title wb-kopf"><span>'+t("myInWorkout", { n:exs.length, d:dauer })+'</span>'+
        (exs.length > 2 ? '<button type="button" class="sec-link" data-wbordnen>'+esc(t("wbOrdnen"))+'</button>' : '')+'</div>'+
      '<div class="page-hint">'+esc(t("wbAblaufHint"))+'</div>'+
      '<div class="fig-grid">'+d.items.map(ablaufKachel).join("")+'</div>'+
      (palOpen ? '' : '<button type="button" class="my-new" data-palopen>'+ICON_PLUS+' '+t("myAdd")+'</button>')
    : '<div class="section-title wb-kopf"><span>'+t("wbAblauf")+'</span>'+
        (exs.length > 2 ? '<button type="button" class="sec-link" data-wbordnen>'+esc(t("wbOrdnen"))+'</button>' : '')+'</div>'+
      (d.items.length ? '<div class="wb-streifen">'+streifen+'</div>' : '<div class="fav-empty">'+esc(t("wbLeer"))+'</div>');

  app.innerHTML =
    topbar(cfg.cover ? t("coverTitle") : t("myWorkout"), { back:cfg.back, right: hw.knopf + (palOpen ? lupeHTML("b", buildQuery) : "") + (cfg.cover ? "" :
      '<button class="iconbtn" data-share title="'+t("shareWo")+'" aria-label="'+t("shareWo")+'" '+(d.items.length?'':'disabled style="opacity:.35"')+'>'+ICON_SHARE+'</button>') }) +
    // Aufwärm- und Dehnprogramme: Überschrift, Kacheln und Figuren in der Farbe von Aufwärmen & Dehnen
    (warmDehn ? '<div style="--bereich:var(--ws-color)">' : '<div>') + head + ablaufHTML + (warmDehn || !exs.length ? '' : auswertungHTML(d.items.map(function(it){ return it.ex; }), { offen:palOpen })) + optionsHTML + palHTML + '</div>' +
    (cfg.cover || cfg.bau.neu ? '' : '<button class="btn btn-danger" data-mydel style="margin-top:18px;">'+ICON_TRASH+' '+t("myDelete")+'</button>')+
    '<div style="height:'+(cfg.cover ? 40 : 96)+'px"></div>'+
    (cfg.cover ? '' : '<div class="wb-leiste"><div class="wb-leiste-in"><span><b>'+t("exCount", { n:exs.length })+'</b><br>'+dauer+'</span>'+
      '<span class="wb-knoepfe">'+speicherKnopf()+
      '<button type="button" class="btn '+(cfg.bau.dirty ? 'btn-secondary' : 'btn-primary')+'" data-tocover'+(d.items.length ? '' : ' disabled')+'>'+ICON_PLAY+' '+t("start")+'</button></span></div></div>');
  function speicherKnopf(){   // nur Anzeige: der Baukasten speichert selbst
    return '<button type="button" class="btn btn-secondary" data-wbsave disabled>'+ICON_SAVE+' '+t(cfg.bau.neu ? "wbAutoSpeichern" : "wbGespeichert")+'</button>';
  }
  if(!cfg.cover){   // Zurück: es gibt nichts zu verwerfen, alles ist schon gesichert
    var zur = app.querySelector("[data-back]");
    if(zur){ zur.removeAttribute("data-back"); zur.addEventListener("click", function(){ bauEntwurf = null; goBack(cfg.back); }); }
  }
  bindCommon();

  function speichern(){
    if(cfg.cover){ d._dirty = true; return; }
    if(cfg.bau.neu && !d.items.length) return;   // ein neues Workout ohne Übung wird erst mit der ersten Übung angelegt
    bauSpeichern(cfg.bau);
  }
  function sichern(){ bauSpeichern(cfg.bau); showToast(t("wbGespeichert")); neu(); }
  function neu(){ var y = window.scrollY; renderDraftPage(d, cfg); window.scrollTo(0, y); }
  function on(sel, fn){ app.querySelectorAll(sel).forEach(function(el){ el.addEventListener("click", function(e){ fn(el, e); }); }); }

  var nameIn = app.querySelector("#m-name");
  if(nameIn) nameIn.addEventListener("input", function(){ d.name = nameIn.value.trim() || t("myDefaultName"); speichern(); });
  on("[data-mode]", function(el){ d.mode = el.getAttribute("data-mode"); speichern(); neu(); });
  bindSteppers(app, function(){
    var r = app.querySelector("#d-reps"), w = app.querySelector("#d-work"), rs = app.querySelector("#d-rest");
    if(r) d.reps = parseInt(r.value)||d.reps;
    if(w) d.work = parseInt(w.value)||d.work;
    if(rs) d.rest = parseInt(rs.value)||0;
    speichern(); neu();
  });
  var brSel = app.querySelector("#d-br");
  if(brSel) brSel.addEventListener("change", function(){ d.blockRest = parseInt(this.value)||0; speichern(); neu(); });
  var optT = app.querySelector("[data-opttoggle]");
  function optUm(){ s.coverOpts = !s.coverOpts; save(); neu(); }
  if(optT){
    optT.addEventListener("click", optUm);
    optT.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); optUm(); } });
  }
  if(cfg.cover && app.querySelector("#c-voice")) bindToggle("c-voice", function(v){ s.voice = v; save(); neu(); });

  // Kachel antippen: hinzufügen bzw. wieder herausnehmen
  function kachelTipp(el){
    var id = el.getAttribute("data-wbex");
    if(pos[id]){ d.items = d.items.filter(function(it){ return it.ex !== id; }); }
    else {
      d.items.push(itemFromEx(id));
      var neuOrd = stretchLast(d.items, function(it){ return it.ex; }); d.items = neuOrd;
    }
    speichern(); neu();
  }
  kachelKlick(app, "[data-wbex]", kachelTipp);
  on("[data-exinfo]", function(el, e){ e.stopPropagation(); openExInfo(el.getAttribute("data-exinfo"), false); });
  on("[data-exfav]", function(el, e){ e.stopPropagation(); toggleExFav(el.getAttribute("data-exfav")); neu(); });   // Stern: steht dann oben

  // Übung im Ablauf: Aktionen
  function ablaufMenue(i){
    var it = d.items[i], ex = findExercise(it.ex);
    if(!ex) return;
    var acts = [];
    if(d.mode === "individual" || exIsStretch(it.ex)) acts.push({ ico:ICON_TIMERBLOCK, label:t("wbZeiten"), fn:function(){ openTimingSheet(d, i, function(){ speichern(); neu(); }); } });
    if(i > 0) acts.push({ ico:'<path d="M12 19V5M5 12l7-7 7 7"/>', label:t("wbNachVorn"), fn:function(){ var x = d.items.splice(i, 1)[0]; d.items.splice(i-1, 0, x); speichern(); neu(); } });
    if(i < d.items.length-1) acts.push({ ico:'<path d="M12 5v14M5 12l7 7 7-7"/>', label:t("wbNachHinten"), fn:function(){ var x = d.items.splice(i, 1)[0]; d.items.splice(i+1, 0, x); speichern(); neu(); } });
    if(cfg.cover) acts.push({ ico:'<path d="M3 7h3c2.6 0 4 1.6 5.2 3.9l1.6 3C14 16.3 15.5 17 18 17h3M18 14l3 3-3 3M3 17h3c1.5 0 2.6-.5 3.4-1.5M14.3 7.9C15.2 7.3 16.4 7 18 7h3M18 4l3 3-3 3"/>', label:t("wbTauschen"), fn:function(){
      var nx = wbTauschKandidat(d, i);
      if(!nx){ showToast(t("wbKeinTausch")); return; }
      var alt = d.items[i], neuIt = itemFromEx(nx.id);
      if(d.mode === "individual" && !exIsStretch(nx.id)){ neuIt.reps = alt.reps; neuIt.work = alt.work; neuIt.rest = alt.rest; }
      d.items[i] = neuIt; speichern(); neu();
    } });
    if(cfg.cover && EX_INFO[ex.id]) acts.push({ ico:ICON_INFO, label:t("infoLong"), fn:function(){ openExInfo(ex.id, false); } });
    acts.push({ ico:P_TRASH, label:t("del"), danger:true, fn:function(){ d.items.splice(i, 1); speichern(); neu(); } });
    openActionSheet((i+1)+". "+tplText(ex.name), acts);
  }
  app.querySelectorAll("[data-wbitem]").forEach(function(el){
    function los(){ ablaufMenue(parseInt(el.getAttribute("data-wbitem"))); }
    el.addEventListener("click", los);
    el.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); los(); } });
  });
  on("[data-wbordnen]", function(){ d.items = wbSinnvollOrdnen(d.items); speichern(); neu(); showToast(t("wbGeordnet")); });

  on("[data-btoggle]", function(){ s.buildFilterOpen = !s.buildFilterOpen; save(); neu(); });
  on("[data-bfcat]", function(el){ s.buildCats = selToggle(cat, el.getAttribute("data-bfcat")); save(); neu(); });
  on("[data-bfequip]", function(el){ s.buildEquips = selToggle(equip, el.getAttribute("data-bfequip")); save(); neu(); });
  on("[data-bfzone]", function(el){ s.buildZonen = selToggle(zonen, el.getAttribute("data-bfzone")); save(); neu(); });
  on("[data-bfsort]", function(el){ s.libSort = el.getAttribute("data-bfsort"); save(); neu(); });
  on("[data-bfreset]", function(){ s.buildCats = []; s.buildEquips = []; s.buildZonen = []; save(); neu(); });
  wsRegionBinden(neu);
  var bq = app.querySelector("#b-q");
  if(bq){
    applySearch(app.querySelector("#dz-pal") || app, buildQuery);
    bq.addEventListener("input", function(){ buildQuery = bq.value; applySearch(app.querySelector("#dz-pal") || app, buildQuery); });
  }
  on("[data-palopen]", function(){ d._pal = true; neu(); });
  on("[data-share]", function(){ shareDraft(d); });
  on("[data-wbsave]", sichern);
  on("[data-tocover]", function(){ if(d.items.length){ if(cfg.bau.dirty || cfg.bau.neu) bauSpeichern(cfg.bau); coverDraft = null; go("#cover/my/"+cfg.id); } });
  on("[data-mydel]", function(){
    confirmSheet(t("myDeleteQ"), t("cantUndo"), t("del"), function(){
      deleteMyNow(cfg.id); bauEntwurf = null; go("#library");
    });
  });
  if(cfg.cover){
    on("[data-fav]", function(el){ toggleFav(el.getAttribute("data-fav")); neu(); });
    on("[data-coverhide]", function(){ libHide("wo:"+d.key.slice(4)); showToast(t("hiddenToast")); go("#library"); });
    on("[data-go]", function(){
      if(!d.items.length) return;
      // Sprachausgabe im Tipp freischalten (iOS erlaubt sie sonst nicht)
      if(window.speechSynthesis && s.voice !== false){
        tonMischen(true);   // erst mischen, dann sprechen - sonst hält iOS die Musik an
        try{ var u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); }catch(e){}
      }
      go("#playdraft");
    });
    on("[data-savemy]", function(){
      if(!d.items.length) return;
      if(d.src==="shared") adoptSharedCustoms(d);
      createMyFromDraft(d);
      showToast(t("savedMy"));
    });
    on("[data-reroll]", function(){
      var nd = buildSurprise(d._params);
      if(nd){ coverDraft = nd; renderDraftPage(nd, cfg); window.scrollTo(0,0); }
    });
  }
}

/* Zeiten einer einzelnen Übung anpassen */
function openTimingSheet(d, i, onDone){
  var it = d.items[i], ex = findExercise(it.ex);
  if(!ex) return;
  var root = document.getElementById("overlayRoot");
  root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet tm-sheet">'+
    '<h3>'+esc(tplText(ex.name))+'</h3>'+
    '<label>'+t("reps")+'</label>'+stepperHTML("t-reps", it.reps, 1, 30, 1)+
    (ex.perSide ? '<div class="tm-hint">'+t("repsBothSides")+'</div>' : '')+
    '<label>'+t("workSec")+'</label>'+stepperHTML("t-work", it.work, 5, 600, 5)+
    '<label>'+t("restSec")+'</label>'+stepperHTML("t-rest", it.rest, 0, 300, 5)+
    '<div class="btn-row" style="margin-top:16px;"><button class="btn btn-secondary" data-reco>'+t("recommended")+'</button>'+
    '<button class="btn btn-primary" data-ok>'+t("timeDone")+'</button></div>'+
    '</div></div>';
  function lesen(){
    it.reps = parseInt(root.querySelector("#t-reps").value)||1;
    it.work = parseInt(root.querySelector("#t-work").value)||5;
    it.rest = parseInt(root.querySelector("#t-rest").value)||0;
  }
  function close(){ lesen(); root.innerHTML = ""; onDone(); }
  bindSteppers(root, lesen);
  root.querySelector("[data-reco]").addEventListener("click", function(){
    root.querySelector("#t-reps").value = ex.reps;
    root.querySelector("#t-work").value = ex.workSec;
    root.querySelector("#t-rest").value = ex.restSec;
  });
  root.querySelector("[data-ok]").addEventListener("click", close);
  root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) close(); });
}

/* „Überrasch mich“: Dauer, Körperbereiche, Schwierigkeit, Ausrüstung */
var SP_TIMING = {
  1: { reps:4, work:30, rest:15, blockRest:60 },
  2: { reps:6, work:30, rest:10, blockRest:45 },
  3: { reps:6, work:40, rest:10, blockRest:30 }
};
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j = Math.floor(Math.random()*(i+1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
/* Einordnung jeder Übung für den Generator, abgeleitet aus den Hauptmuskeln (EX_MUSCLES):
   Bereich "lower" / "upper" / "core" / "full" und Bewegungsmuster "push" / "pull" / "". */
var EX_PROFILE = {};
function exProfile(ex){
  if(EX_PROFILE[ex.id]) return EX_PROFILE[ex.id];
  var m = ((EX_MUSCLES[ex.id] || [])[0] || "").toLowerCase(), region = "", first = 999;
  [["lower", /gesäß|oberschenkel|waden|adduktor/], ["core", /bauch|rumpf/],
   ["upper", /brust|trizeps|schulter|rücken|bizeps|trapez|rauten|unterarm|nacken/]].forEach(function(r){
    var i = m.search(r[1]);
    if(i > -1 && i < first){ first = i; region = r[0]; }
  });
  if(!region){
    region = ex.cats.indexOf("legs") > -1 ? "lower" : ex.cats.indexOf("core") > -1 ? "core"
      : (ex.cats.indexOf("back") > -1 || ex.cats.indexOf("arms") > -1) ? "upper" : "full";
  }
  if(ex.cats.indexOf("cardio") > -1 && region !== "lower") region = "full";
  // Hauptmuskeln aus Unter- und Oberkörper (z. B. Burpees: Beine, Brust, Schultern) = Ganzkörper
  if(/gesäß|oberschenkel|waden/.test(m) && /brust|trizeps|schulter|rücken|bizeps/.test(m)) region = "full";
  var pull = /breiter rückenmuskel|oberer rücken|bizeps|rauten|trapez|hintere schulter|unterarme \(griff\)/.test(m) ||
             (!m && ex.cats.indexOf("back") > -1);
  var push = /brust|trizeps|vordere schulter|^schultern/.test(m);
  var prof = { region:region, pattern: pull && !push ? "pull" : push && !pull ? "push" : "" };
  if(!ex.custom) EX_PROFILE[ex.id] = prof;
  return prof;
}
/* „Überrasch mich“ mit Regeln statt reinem Würfeln:
   - erst nach Hauptkategorie eingrenzen (nichts gewählt = Kraft, Ausdauer, Rumpf), dann Fokus und Ausrüstung
   - Stangen- und Barrenübungen nur, wenn Stangenpark gewählt ist
   - alle gewählten Fokus-Bereiche bzw. Kategorien kommen reihum vor
   - direkt aufeinander folgende Übungen trainieren möglichst verschiedene Bereiche
   - Drücken und Ziehen halten sich die Waage
   - Übungen aus den Trainings der letzten 7 Tage kommen nur, wenn sonst zu wenig passt
   - zum Einstieg lieber etwas Leichteres
   - Stretch zusammen mit anderem gewählt: Dehnübungen (mit ihren eigenen Haltezeiten) immer am Ende */
function spNormalize(p){
  if(!p.mains){   // gespeichert von einer älteren Fassung: damals gab es nur den Fokus
    var alt = selArr(p.cats);
    p.mains = alt.indexOf("calis") > -1 ? ["stange"] : [];
    p.cats = alt.filter(function(c){ return c !== "calis" && c !== "stretch"; });
  }
  p.mains = selArr(p.mains).filter(function(m){ return m !== "stretch"; });   // Stretch gibt es hier nicht mehr
  p.cats = selArr(p.cats).filter(function(c){ return c !== "stretch"; });
  if(!p.equips) p.equips = selArr(p.equip && p.equip!=="all" ? [p.equip] : ["none"]);
  return p;
}
function spDuration(it){ return it.reps*it.work + Math.max(0, it.reps-1)*it.rest; }
function buildSurprise(p){
  p = spNormalize(p);
  var tm = SP_TIMING[p.level] || SP_TIMING[2];
  var mains = p.mains.length ? p.mains.slice() : ["kraft","ausdauer","rumpf"];
  var fokus = p.cats.filter(function(c){ return c !== "stretch"; });
  var wantStretch = mains.indexOf("stretch") > -1 || p.cats.indexOf("stretch") > -1;
  var trainMains = mains.filter(function(m){ return m !== "stretch"; });
  var equips = p.equips;
  var recent = p.avoid === false ? {} : recentExercises(7);
  var total = p.dur*60;

  /* Dehnteil: nur Stretch gewählt = das ganze Training, sonst etwa ein Sechstel (mindestens zwei Übungen) */
  var stretchPool = !wantStretch ? [] : EXERCISES.filter(function(ex){ return ex.main === "stretch" && !libHidden("ex:"+ex.id); });
  var stretchBudget = !stretchPool.length ? 0 : (trainMains.length ? Math.max(140, Math.round(total/6)) : total);
  // feste Anzahl (Timer-Workout füllen): Dehnübungen zählen mit, etwa jede fünfte
  var anzahl = p.anzahl > 0 ? p.anzahl : 0;
  var stretchAnzahl = !anzahl || !stretchPool.length ? 0 : (trainMains.length ? Math.max(2, Math.round(anzahl/5)) : anzahl);

  var picked = [];
  if(trainMains.length){
    var block = tm.reps*tm.work + (tm.reps-1)*tm.rest;
    var trainSec = Math.max(block, total - stretchBudget);
    var n = anzahl ? Math.max(1, anzahl - stretchAnzahl) : Math.max(2, Math.round((trainSec + tm.blockRest) / (block + tm.blockRest)));
    var pool = EXERCISES.filter(function(ex){
      return !libHidden("ex:"+ex.id) && fuerWorkout(ex) && trainMains.indexOf(ex.main) > -1 && catMatch(fokus, ex.cats) &&
        equipMatch(equips, ex) && gearOk(ex, fokus, equips, trainMains);
    });
    if(!pool.length && !stretchPool.length) return null;
    var fresh = pool.filter(function(ex){ return !recent[ex.id]; }).length;
    var avoidRecent = fresh >= Math.min(n, pool.length);   // nur meiden, wenn genug andere da sind
    // reihum: bei mehreren Fokus-Bereichen über den Fokus, sonst über die Kategorien
    var rotate = fokus.length > 1 ? fokus : trainMains.length > 1 ? trainMains : [];
    function keys(ex){ return fokus.length > 1 ? ex.cats : [ex.main]; }
    var push = 0, pull = 0, covered = {};
    // Sternchen-Übungen: immer etwa ein Drittel des Workouts (soweit genug passende markiert sind)
    var favZiel = Math.min(pool.filter(function(ex){ return isExFav(ex.id); }).length, Math.round(n/3)), favDrin = 0;
    shuffle(pool);
    while(picked.length < n && picked.length < pool.length){
      var prev = picked.length ? exProfile(picked[picked.length-1]) : null;
      var prev2 = picked.length > 1 ? exProfile(picked[picked.length-2]) : null;
      var best = null, bestScore = -Infinity;
      pool.forEach(function(ex){
        if(picked.indexOf(ex) > -1) return;
        var pr = exProfile(ex), sc = Math.random()*1.5;
        if(prev && pr.region === prev.region && pr.region !== "full") sc -= 3;
        if(prev2 && pr.region === prev2.region && pr.region !== "full") sc -= 1;
        if(pr.pattern === "push") sc += push > pull ? -2 : push < pull ? 1.5 : 0;
        if(pr.pattern === "pull") sc += pull > push ? -2 : pull < push ? 1.5 : 0;
        if(avoidRecent && recent[ex.id]) sc -= 5;
        if(rotate.length && keys(ex).some(function(c){ return rotate.indexOf(c) > -1 && !covered[c]; })) sc += 2;
        if(!picked.length) sc += ex.level === 1 ? 1 : ex.level === 3 ? -1.5 : 0;
        // Intensität: Intensiv meidet lockere Übungen, Locker meidet die intensiven (EX_INT, sonst 2)
        var bel = EX_INT[ex.id] || 2;
        if(p.level === 3) sc += bel === 3 ? .6 : bel === 1 ? -4 : 0;
        else if(p.level === 1) sc += bel === 3 ? -4 : bel === 1 ? .6 : 0;
        if(favZiel){
          // über das Workout verteilt: Bonus nur, wenn die Sternchen hinter ihrem Anteil bis zu dieser Stelle liegen
          var favOffen = favZiel - favDrin, platzFrei = n - picked.length, favSoll = favZiel * (picked.length + 1) / n;
          if(isExFav(ex.id)) sc += favOffen <= 0 ? -50 : favOffen >= platzFrei ? 50 : favDrin < favSoll - .5 ? 4 : 0;
          else if(favOffen >= platzFrei) sc -= 50;   // die restlichen Plätze gehören den Sternchen
        }
        if(sc > bestScore){ bestScore = sc; best = ex; }
      });
      if(!best) break;
      picked.push(best);
      if(isExFav(best.id)) favDrin++;
      var bp = exProfile(best);
      if(bp.pattern === "push") push++;
      if(bp.pattern === "pull") pull++;
      keys(best).forEach(function(c){ covered[c] = true; });
      if(rotate.every(function(c){ return covered[c]; })) covered = {};   // nächste Runde reihum
    }
  }
  /* Jedes zweite „Überrasch mich“ enthält eine Burpee-Variante (passend zu Ausrüstung und Stufe) */
  if(picked.length && !anzahl){
    var st = state.db.settings;
    st.spZahl = (st.spZahl || 0) + 1; save();
    var istBurpee = function(ex){ return /burpee/.test(ex.id); };
    if(st.spZahl % 2 === 0 && !picked.some(istBurpee)){
      var bur = EXERCISES.filter(function(ex){
        return istBurpee(ex) && fuerWorkout(ex) && !libHidden("ex:"+ex.id) && equipMatch(equips, ex) && gearOk(ex, fokus, equips, trainMains) &&
          (p.level !== 1 || (EX_INT[ex.id] || 2) < 3);   // locker: nur die sanften
      });
      var frisch = bur.filter(function(ex){ return !recent[ex.id]; });
      bur = frisch.length ? frisch : bur;
      if(bur.length){
        var neuB = bur[Math.floor(Math.random()*bur.length)];
        // ersetzt am liebsten eine Ausdauer- oder Ganzkörperübung, sonst die zweite - nie eine Sternchen-Übung
        var frei = picked.map(function(ex, i){ return isExFav(ex.id) ? -1 : i; }).filter(function(i){ return i > -1; }), platz = -1;
        frei.forEach(function(i){ if(platz < 0 && (picked[i].main === "ausdauer" || exProfile(picked[i]).region === "full")) platz = i; });
        if(platz < 0 && frei.length) platz = frei[Math.min(1, frei.length - 1)];
        if(platz > -1) picked[platz] = neuB;
      }
    }
  }
  var items = picked.map(function(ex){ return { ex:ex.id, reps:tm.reps, work:tm.work, rest:tm.rest }; });

  /* Dehnübungen: passend zu den trainierten Bereichen, jede nur einmal, 10 s zum Umsetzen */
  if(stretchPool.length && stretchBudget > 0){
    var regions = {};
    picked.forEach(function(ex){ regions[exProfile(ex).region] = true; });
    var sp = shuffle(stretchPool.slice()), used = 0, sItems = [];
    sp.sort(function(a, b){
      var ra = regions[exProfile(a).region] ? 1 : 0, rb = regions[exProfile(b).region] ? 1 : 0;
      return (rb - ra) + ((recent[a.id] ? 1 : 0) - (recent[b.id] ? 1 : 0))*.5;
    });
    for(var i=0;i<sp.length;i++){
      var it = itemFromEx(sp[i].id), d = spDuration(it) + 10;
      if(anzahl ? sItems.length >= stretchAnzahl : (sItems.length >= 2 && used + d > stretchBudget)) break;
      it.after = 10;
      sItems.push(it); used += d;
    }
    items = items.concat(sItems);
  }
  if(!items.length) return null;
  var d = { key:"surprise:", src:"surprise", name:"", mode:"individual",
            reps:tm.reps, work:tm.work, rest:tm.rest, blockRest:tm.blockRest,
            items:items, _params:p };
  if(!anzahl) spDauerTreffen(d, total, tm);
  d.name = t("spName", { n:Math.max(1, Math.round(workoutDuration(draftRun(d))/60)) });
  return d;
}
/* Gesamtdauer möglichst nah an die gewählte Dauer bringen (die Pausen zwischen den Übungen zählen mit):
   einzelne Übungen bekommen eine Runde mehr oder weniger (beidseitige zwei, damit beide Seiten gleich oft drankommen),
   höchstens zwei vom Standard weg. Bei Gleichstand bleibt die Übung dran, die am nächsten am Standard liegt. */
function spDauerTreffen(d, ziel, tm){
  function abweichung(){ return Math.abs(workoutDuration(draftRun(d)) - ziel); }
  for(var runde=0; runde<40; runde++){
    var bestWert = abweichung(), best = null;
    d.items.forEach(function(it){
      var ex = findExercise(it.ex);
      if(!ex || exIsStretch(it.ex)) return;
      var schritt = ex.perSide ? 2 : 1;
      [-schritt, schritt].forEach(function(s){
        var neu = it.reps + s;
        if(neu < Math.max(2, tm.reps-2) || neu > tm.reps+2) return;
        it.reps = neu;
        var wert = abweichung() + Math.abs(neu - tm.reps)*.01;
        it.reps = neu - s;
        if(wert < bestWert - .001){ bestWert = wert; best = { it:it, s:s }; }
      });
    });
    if(!best) break;
    best.it.reps += best.s;
  }
}
var spFeinOffen = false;   // Feinauswahl in „Überrasch mich“ aufgeklappt (bleibt so, solange die App offen ist)
function openSurprise(twId){
  var s = state.db.settings, tw = twId ? findWorkout(twId) : null;
  var p = spNormalize(JSON.parse(JSON.stringify(s.surprise || { dur:20, mains:["kraft","rumpf"], cats:[], level:2, equips:["none"] })));
  if(tw) p.anzahl = s.surpriseAnzahl || 8; else delete p.anzahl;
  var root = document.getElementById("overlayRoot");
  var fokusCats = LIB_CATS.filter(function(c){ return c.id!=="stretch" && c.id!=="calis"; });
  function feinText(){   // Zusammenfassung der zugeklappten Feinauswahl
    var f = fokusCats.filter(function(c){ return p.cats.indexOf(c.id) > -1; }).map(function(c){ return tplText(c); });
    return t("int"+p.level)+" · "+(f.length ? f.join(", ") : t("spNoFocus"));
  }
  function draw(){
    // Neu zeichnen ohne Springen: die Scrollposition im Fenster bleibt erhalten
    var alt = root.querySelector(".sp-sheet"), scrollAlt = alt ? alt.scrollTop : 0;
    root.innerHTML = '<div class="confirm-overlay"><div class="confirm-sheet sp-sheet">'+
      '<h3>'+svgIcon(ICON_UEBERRASCH, "ico sp-h-ico")+' '+t("surprise")+'</h3>'+
      (tw ? '<div class="tm-hint" style="margin-top:0">'+esc(t("spFillHint", { n:tw.name || t("untitled") }))+'</div>'+
            '<label>'+t("spCount")+'</label><div class="sp-chips">'+[4,6,8,10,12,15].map(function(v){
        return '<button type="button" class="fc-chip'+(p.anzahl===v?' on':'')+'" data-spanz="'+v+'">'+v+' '+t("spCountUnit")+'</button>'; }).join("")+'</div>'
          : '<label>'+t("spDur")+'</label><div class="sp-chips">'+[10,15,20,30,45,60].map(function(v){
        return '<button type="button" class="fc-chip'+(p.dur===v?' on':'')+'" data-spdur="'+v+'">'+v+' Min</button>'; }).join("")+'</div>')+
      '<label>'+t("mainCat")+'</label>'+
      mainTilesHTML(p.mains, null, "data-spmain", ["stretch"])+
      '<div class="tm-hint" style="margin-top:-4px;">'+esc(t("spMainHint"))+'</div>'+
      '<label>'+t("equipHave")+'</label><div class="sp-chips">'+EQUIPS.filter(function(e){ return e.id !== "gym"; }).map(function(e){
        return '<button type="button" class="fc-chip'+(p.equips.indexOf(e.id)>-1?' on':'')+'" data-spequip="'+e.id+'">'+svgIcon(EQUIP_ICON[e.id])+esc(tplText(e))+'</button>'; }).join("")+'</div>'+
      // Fokus, Intensität und die Regeln sind selten nötig: zugeklappt, die Zusammenfassung zeigt die aktuelle Wahl
      '<button type="button" class="sp-more'+(spFeinOffen?' open':'')+'" data-spmore aria-expanded="'+spFeinOffen+'">'+
        '<span><b>'+t("spMore")+'</b><small>'+esc(feinText())+'</small></span>'+ICON_CHEV+'</button>'+
      (spFeinOffen ? '<div class="sp-more-body">'+
        '<label>'+t("spAreas")+' <span class="lbl-hint">'+esc(t("spFocusHint"))+'</span></label><div class="sp-chips">'+
          fokusCats.map(function(c){
          return '<button type="button" class="fc-chip'+(p.cats.indexOf(c.id)>-1?' on':'')+'" data-spcat="'+c.id+'">'+catIcon(c.id)+esc(tplText(c))+'</button>'; }).join("")+'</div>'+
        '<label>'+t("spLevel")+'</label><div class="seg-row">'+[1,2,3].map(function(l){
          return '<button type="button" class="'+(p.level===l?'active':'')+'" data-splevel="'+l+'">'+esc(t("int"+l))+'</button>'; }).join("")+'</div>'+
        '<div class="sp-avoid">'+toggleRow("sp-avoid", t("spAvoid"), t("spAvoidDesc"), p.avoid !== false)+'</div>'+
        '<div class="tm-hint">'+esc(t("spRules"))+'</div>'+
      '</div>' : '')+
      '<div class="btn-row sp-foot"><button class="btn btn-secondary" data-cancel>'+t("cancel")+'</button>'+
      '<button class="btn btn-primary" data-spgo>'+t("spGo")+'</button></div>'+
    '</div></div>';
    root.querySelector(".sp-sheet").scrollTop = scrollAlt;
    function on(sel, fn){ root.querySelectorAll(sel).forEach(function(b){ b.addEventListener("click", function(){ fn(b); draw(); }); }); }
    on("[data-spmore]", function(){ spFeinOffen = !spFeinOffen; });
    on("[data-spdur]", function(b){ p.dur = parseInt(b.getAttribute("data-spdur")); });
    on("[data-spanz]", function(b){ p.anzahl = parseInt(b.getAttribute("data-spanz")); });
    on("[data-spmain]", function(b){ p.mains = selToggle(p.mains, b.getAttribute("data-spmain")); });
    on("[data-spcat]", function(b){ p.cats = selToggle(p.cats, b.getAttribute("data-spcat")); });
    on("[data-splevel]", function(b){ p.level = parseInt(b.getAttribute("data-splevel")); });
    on("[data-spequip]", function(b){ p.equips = selToggle(p.equips, b.getAttribute("data-spequip")); });
    var avoid = root.querySelector("#sp-avoid");
    if(avoid) avoid.addEventListener("change", function(e){ p.avoid = e.target.checked; });
    root.querySelector("[data-cancel]").addEventListener("click", function(){ root.innerHTML = ""; });
    root.querySelector(".confirm-overlay").addEventListener("click", function(e){ if(e.target.classList.contains("confirm-overlay")) root.innerHTML = ""; });
    root.querySelector("[data-spgo]").addEventListener("click", function(){
      if(tw){ s.surpriseAnzahl = p.anzahl; var q = JSON.parse(JSON.stringify(p)); delete q.anzahl; s.surprise = q; }
      else s.surprise = p;
      save();
      var d = buildSurprise(p);
      if(!d){ showToast(t("spNone")); return; }
      if(tw){ root.innerHTML = ""; timerWorkoutFuellen(tw, d); return; }
      root.innerHTML = "";
      coverDraft = d;
      go("#cover/surprise");
    });
  }
  draw();
}

