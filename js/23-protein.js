/* ============ Protein-Tracker (Tools › Protein, 2026-10-24) ============
   Tagessumme in Gramm als Hauptanzeige, Schnellbuttons mit einem Tipp, eigene Buttons, Eingabe in Gramm,
   Ziel nach Körpergewicht und Stufe, Wochenblick. Alles lokal in settings.protein - nichts verlässt das Gerät.
   Keine Erinnerung ums Training, keine Zeitfenster, keine rote Warnung. Texte dieser Seite stehen in PROT_T (Deutsch und Englisch). */
var PROT_T = {
  de: {
    titel:"Protein", kachelSub:"Tagesziel, Schnellbuttons, Wochenblick", heute:"Heute", von:"von {g} g", noch:"noch {g} g", erreicht:"Ziel erreicht",
    rueck:"Rückgängig", schnell:"Schnellbuttons", schnellHint:"Ein Tipp erfasst die Portion. Häufig genutzte Buttons rutschen nach oben.",
    manuell:"Gramm eintippen", manuellHint:"Für Restaurant oder Schätzungen: Protein direkt in Gramm.", manuellName:"Manuell",
    name:"Name (optional)", hinzu:"Hinzufügen", eigen:"Eigenen Button anlegen",
    eigenHint:"Protein pro 100 g steht auf jeder Packung. Die Seite rechnet die Portion aus.", portion:"Portion (g)",
    je100:"Protein je 100 g", vorschau:"ergibt {g} g Protein", anlegen:"Button anlegen", fehlEingabe:"Name, Portion und Protein eintragen.",
    liste:"Heute erfasst", leer:"Noch nichts erfasst.", loeschen:"Eintrag löschen",
    faktor:"Portion wählen", suche:"Lebensmittel suchen", sucheHint:"Mitgelieferte Liste, Protein je 100 g. Suchen, Menge eingeben, antippen.",
    sucheLeer:"Nicht in der Liste: eigenen Button anlegen oder Gramm eintippen.", suchePh:"z. B. Quark, Ei, Linsen", menge:"Menge (g)", je100kurz:"{g} g / 100 g",
    kombi:"Kombi-Button", kombiHint:"Mehrere Buttons in einem Tipp, z. B. ein Standard-Frühstück.", kombiWahl:"Buttons wählen",
    kombiAnlegen:"Kombi anlegen", kombiFehl:"Name und mindestens zwei Buttons wählen.",
    verteilung:"Verteilung heute", morgens:"Morgens", mittags:"Mittags", abends:"Abends",
    woche:"Letzte 7 Tage", schnitt:"Schnitt an erfassten Tagen", gkg:"in g/kg",
    fehlt:"Im Schnitt fehlen {g} g pro Tag, etwa ein Skyr oder Shake.", ok:"Ziel im Wochenschnitt erreicht.",
    viel:"Über 2,2 g/kg im Schnitt: mehr bringt kaum zusätzlichen Nutzen.",
    ziel:"Tagesziel", gewicht:"Körpergewicht (kg)", gewichtAus:"Übernommen aus den Körperdaten in den Einstellungen.",
    keinKg:"Gib dein Körpergewicht ein, dann rechnet die Seite das Tagesziel aus.",
    basis:"Basis", training:"Training", intensiv:"Intensiv", basisS:"0,83 g/kg · WHO", trainS:"1,6 g/kg", intensivS:"2,0 g/kg",
    proMahl:"pro Mahlzeit (0,3–0,4 g/kg)",
    quelle:"Basis entspricht der WHO/FAO-Referenz, Training und Intensiv den Empfehlungen von ACSM und ISSN (1,2–2,0 g/kg).",
    info:"So rechnet die Seite",
    infoListe:[
      "Die Tagessumme ist die Hauptanzeige. Die Gesamtmenge am Tag macht den größten Teil des Effekts aus.",
      "Verteilung: 3 bis 5 Mahlzeiten mit je etwa 0,3 bis 0,4 g/kg wirken etwas besser als alles auf einmal.",
      "Timing: Ein Zeitfenster nach dem Training gibt es nicht. Eine proteinreiche Mahlzeit bald nach dem Training zählt vor allem, wenn man nüchtern trainiert.",
      "Obergrenze: Über etwa 2,2 g/kg im Wochenschnitt bringt mehr kaum Nutzen. Die Seite warnt deshalb nicht hart, sie gibt nur einen Hinweis.",
      "Nieren: Wer eine eingeschränkte Nierenfunktion hat, sollte die Menge mit einer Ärztin oder einem Arzt klären.",
      "Quelle: Verarbeitetes rotes Fleisch wie Wurst oder Schinken ist ungünstiger als Milchprodukte, Fisch, Hülsenfrüchte oder Geflügel.",
      "Genauigkeit: Angaben aus Packungen und Listen sind auf etwa ±10 bis 20 % genau. Das reicht zur Orientierung, nicht für exakte Planung.",
      "Trinken: Mehr Protein braucht etwas mehr Flüssigkeit.",
      "Keine medizinische Beratung. Die Seite ersetzt keine Ärztin und keine Ernährungsberatung."
    ]
  },
  en: {
    titel:"Protein", kachelSub:"Daily goal, quick buttons, weekly view", heute:"Today", von:"of {g} g", noch:"{g} g to go", erreicht:"Goal reached",
    rueck:"Undo", schnell:"Quick buttons", schnellHint:"One tap logs the portion. Often used buttons move up.",
    manuell:"Type in grams", manuellHint:"For restaurants or estimates: protein directly in grams.", manuellName:"Manual",
    name:"Name (optional)", hinzu:"Add", eigen:"Create own button",
    eigenHint:"Protein per 100 g is printed on every pack. The page works out the portion.", portion:"Portion (g)",
    je100:"Protein per 100 g", vorschau:"gives {g} g protein", anlegen:"Create button", fehlEingabe:"Enter a name, portion and protein.",
    liste:"Logged today", leer:"Nothing logged yet.", loeschen:"Delete entry",
    faktor:"Choose portion", suche:"Search foods", sucheHint:"Built-in list, protein per 100 g. Search, enter the amount, tap.",
    sucheLeer:"Not in the list: create your own button or type in grams.", suchePh:"e.g. quark, egg, lentils", menge:"Amount (g)", je100kurz:"{g} g / 100 g",
    kombi:"Combo button", kombiHint:"Several buttons in one tap, e.g. a standard breakfast.", kombiWahl:"Choose buttons",
    kombiAnlegen:"Create combo", kombiFehl:"Enter a name and choose at least two buttons.",
    verteilung:"Spread today", morgens:"Morning", mittags:"Midday", abends:"Evening",
    woche:"Last 7 days", schnitt:"Average on logged days", gkg:"in g/kg",
    fehlt:"On average {g} g a day are missing, about one skyr or shake.", ok:"Weekly average reaches the goal.",
    viel:"Above 2.2 g/kg on average: more brings little extra benefit.",
    ziel:"Daily goal", gewicht:"Body weight (kg)", gewichtAus:"Taken from the body data in settings.",
    keinKg:"Enter your body weight and the page works out the daily goal.",
    basis:"Basic", training:"Training", intensiv:"Intensive", basisS:"0.83 g/kg · WHO", trainS:"1.6 g/kg", intensivS:"2.0 g/kg",
    proMahl:"per meal (0.3–0.4 g/kg)",
    quelle:"Basic follows the WHO/FAO reference, Training and Intensive the ACSM and ISSN recommendations (1.2–2.0 g/kg).",
    info:"How the page calculates",
    infoListe:[
      "The daily total is the main figure. The total for the day makes up most of the effect.",
      "Spread: 3 to 5 meals with about 0.3 to 0.4 g/kg each work a bit better than all at once.",
      "Timing: there is no window after training. A protein-rich meal soon after training matters mainly when you train fasted.",
      "Upper limit: above about 2.2 g/kg on average, more brings little extra benefit. So the page gives a hint, not a hard warning.",
      "Kidneys: if your kidney function is reduced, clarify the amount with a doctor.",
      "Source: processed red meat such as sausage or ham is less favourable than dairy, fish, legumes or poultry.",
      "Accuracy: figures from packs and lists are about ±10 to 20 % accurate. Good for orientation, not for exact planning.",
      "Fluids: more protein needs a little more fluid.",
      "No medical advice. This page does not replace a doctor or a nutrition consultant."
    ]
  }
};
/* Schnellbuttons zum Start (Werte aus dem Konzept: Portion in g, Protein in g) */
var PROT_START = [
  { n:"Skyr", a:500, p:55 }, { n:"Magerquark", a:250, p:30 }, { n:"Whey-Shake", a:30, p:24 }, { n:"Eier (3 Stk)", a:180, p:21 },
  { n:"Hähnchenbrust", a:150, p:35 }, { n:"Linsen, gekocht", a:200, p:18 }, { n:"Haferflocken", a:80, p:11 }, { n:"Thunfisch (Dose)", a:130, p:32 }
];
/* Mitgelieferte Lebensmittel: Protein in g je 100 g (grobe Richtwerte, Packungsangabe geht vor) */
var PROT_FOODS = [
  ["Magerquark", 12], ["Skyr", 11], ["Griech. Joghurt (10 %)", 6], ["Hüttenkäse", 12], ["Milch (1,5 %)", 3.4],
  ["Ei", 13], ["Hähnchenbrust, roh", 23], ["Rinderhack, mager", 21], ["Lachs", 20], ["Thunfisch, abgetropft", 26],
  ["Tofu", 14], ["Tempeh", 19], ["Linsen, gekocht", 9], ["Kichererbsen, gekocht", 9], ["Haferflocken", 13],
  ["Erdnüsse", 26], ["Mandeln", 21], ["Gouda", 25], ["Vollkornbrot", 8], ["Whey-Pulver", 80]
];
function protT(key, vars){
  var s = (PROT_T[currentLang()] || PROT_T.de)[key];
  if(s == null) s = PROT_T.de[key];
  if(vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, function(m, k){ return vars[k] != null ? vars[k] : m; });
  return s;
}
/* Einstellungen des Protein-Trackers: Stufe (g/kg), Gewicht (nur wenn es keine Körperdaten gibt), Schnellbuttons, Einträge je Tag */
function protDaten(){
  var s = state.db.settings;
  if(!s.protein || typeof s.protein !== "object"){
    s.protein = { stufe:1.6, kg:0, knoepfe:PROT_START.map(function(k){ return { id:uid(), n:k.n, a:k.a, p:k.p, nutz:0 }; }), tage:{} };
    save();
  }
  return s.protein;
}
function protKg(){
  var kd = koerperDaten();
  return kd ? kd.kg : (protDaten().kg || null);
}
function protZiel(){
  var kg = protKg();
  return kg ? Math.round(kg * protDaten().stufe) : 0;
}
function protTag(key){ var p = protDaten(); return p.tage[key] || []; }
function protSumme(eintraege){ return eintraege.reduce(function(a, e){ return a + e.p; }, 0); }
/* Schnellbuttons: die häufig genutzten zuerst (gleiche Nutzung bleibt in der angelegten Reihenfolge) */
function protKnoepfe(){
  return protDaten().knoepfe.map(function(b, i){ return { b:b, i:i }; })
    .sort(function(x, y){ return (y.b.nutz || 0) - (x.b.nutz || 0) || x.i - y.i; }).map(function(x){ return x.b; });
}
function protEintragen(n, g, a){
  var p = protDaten(), key = kalTagKey(Date.now());
  (p.tage[key] || (p.tage[key] = [])).push({ id:uid(), n:n, p:Math.round(g), a:a || 0, at:Date.now() });
  save();
}
function protZeit(at){
  return new Date(at).toLocaleTimeString(currentLang() === "en" ? "en-GB" : "de-DE", { hour:"2-digit", minute:"2-digit" });
}
function renderProtein(){
  var p = protDaten(), heute = kalTagKey(Date.now()), eint = protTag(heute), summe = protSumme(eint);
  var ziel = protZiel(), kg = protKg(), rest = ziel - summe, lang = currentLang() === "en" ? "en-GB" : "de-DE";
  var proz = ziel ? Math.min(100, Math.round(summe / ziel * 100)) : 0;
  /* Wochenblick: die letzten sieben Tage, heute rechts */
  var tage = [];
  for(var i = 6; i >= 0; i--){
    var k = kalTagKey(kalPlus(new Date(), -i)), e = protTag(k);
    tage.push({ key:k, sum:protSumme(e), n:e.length });
  }
  var max = Math.max.apply(null, [ziel, 1].concat(tage.map(function(x){ return x.sum; }))) * 1.1;
  var erfasst = tage.filter(function(x){ return x.n > 0; }), avg = erfasst.length ? Math.round(erfasst.reduce(function(a, x){ return a + x.sum; }, 0) / erfasst.length) : null;
  var avgKg = avg && kg ? avg / kg : null, hinweis = "";
  if(avgKg && avgKg > 2.2) hinweis = '<div class="prot-tip">'+esc(protT("viel"))+'</div>';
  else if(avg && ziel && avg >= ziel * 0.95) hinweis = '<div class="prot-tip">'+esc(protT("ok"))+'</div>';
  else if(avg && ziel) hinweis = '<div class="prot-tip">'+esc(protT("fehlt", { g:ziel - avg }))+'</div>';
  var saeulen = tage.map(function(x){
    var d = kalTagDatum(x.key);
    return '<div class="prot-saeule"><div class="prot-s-bal'+(x.n ? '' : ' leer')+'" style="height:calc((100% - 22px) * '+(x.sum / max).toFixed(3)+')"></div>'+
      '<small>'+esc(d.toLocaleDateString(lang, { weekday:"short" }).replace(/\.$/, ""))+'</small></div>';
  }).join("");
  var linie = ziel ? '<div class="prot-ziel" style="bottom:calc(22px + (100% - 22px) * '+(ziel / max).toFixed(3)+')"></div>' : "";
  var kopf = '<div class="prot-gross"><b>'+summe+' g</b>'+(ziel ? '<span>'+esc(protT("von", { g:ziel }))+'</span>' : '')+'</div>'+
    '<div class="prot-bar"><i style="width:'+proz+'%"></i></div>'+
    '<div class="prot-zeile">'+(ziel ? esc(rest > 0 ? protT("noch", { g:rest }) : protT("erreicht")) : esc(protT("keinKg")))+'</div>';
  var knopf = protKnoepfe().map(function(b){
    return '<button type="button" class="prot-kn" data-pbtn="'+esc(b.id)+'"><b>'+esc(b.n)+'</b><small>'+b.a+' g</small><em>+'+b.p+' g</em></button>';
  }).join("");
  var liste = eint.length ? eint.slice().reverse().map(function(e){
    return '<div class="prot-eintrag"><div class="prot-e-links"><b>'+esc(e.n)+'</b><small>'+protZeit(e.at)+(e.a ? ' · '+e.a+' g' : '')+'</small></div>'+
      '<div class="prot-e-rechts">'+e.p+' g <button type="button" class="prot-x" data-pdel="'+esc(e.id)+'" aria-label="'+esc(protT("loeschen"))+'">×</button></div></div>';
  }).join("") : '<p class="prot-leer">'+esc(protT("leer"))+'</p>';
  var vt = [0, 0, 0];
  eint.forEach(function(e){ var h = new Date(e.at).getHours(); vt[h < 11 ? 0 : h < 16 ? 1 : 2] += e.p; });
  var verteil = eint.length > 1 ? '<h3 style="margin-top:14px">'+esc(protT("verteilung"))+'</h3><div class="prot-verteil">'+
    ["morgens", "mittags", "abends"].map(function(k, i){ return '<div><b>'+vt[i]+' g</b><small>'+esc(protT(k))+'</small></div>'; }).join("")+'</div>' : "";
  var stufen = [["basis", 0.83, "basisS"], ["training", 1.6, "trainS"], ["intensiv", 2, "intensivS"]].map(function(s){
    return '<button type="button" class="prot-stufe'+(p.stufe === s[1] ? ' an' : '')+'" data-pstufe="'+s[1]+'" aria-pressed="'+(p.stufe === s[1])+'">'+esc(protT(s[0]))+'<small>'+esc(protT(s[2]))+'</small></button>';
  }).join("");
  var gewicht = koerperDaten()
    ? '<p class="prot-hint-txt">'+esc(protT("gewichtAus"))+' '+(kg ? kg + ' kg' : '')+'</p>'
    : '<label>'+esc(protT("gewicht"))+'</label><input type="number" inputmode="decimal" min="30" max="250" id="pKg" value="'+(p.kg || '')+'">';
  var proMahl = kg ? '<p class="prot-hint-txt">'+esc(protT("proMahl"))+': '+Math.round(kg * 0.3)+'–'+Math.round(kg * 0.4)+' g</p>' : '';
  var infos = protT("infoListe").map(function(z){ return '<li>'+esc(z)+'</li>'; }).join("");
  app.innerHTML = topbar(protT("titel"), { back:"#training", right:kopfSymboleNeu("training") }) +
    '<div class="prot-seite">'+
      '<section class="prot-karte" aria-label="'+esc(protT("heute"))+'"><h3>'+esc(protT("heute"))+'</h3>'+kopf+
        '<div style="margin-top:10px"><button type="button" class="prot-btn ghost" data-prueck'+(eint.length ? '' : ' disabled')+'>'+esc(protT("rueck"))+'</button></div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("schnell"))+'</h3><p class="prot-hint-txt">'+esc(protT("schnellHint"))+'</p>'+
        '<div class="prot-raster">'+knopf+'</div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("manuell"))+'</h3><p class="prot-hint-txt">'+esc(protT("manuellHint"))+'</p>'+
        '<div class="prot-form"><div class="voll"><label>'+esc(protT("name"))+'</label><input id="pManN" maxlength="40"></div>'+
        '<div><label>g</label><input id="pManG" type="number" inputmode="decimal" min="1" max="300" placeholder="25"></div>'+
        '<button type="button" class="prot-btn" data-pmanu>'+esc(protT("hinzu"))+'</button></div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("eigen"))+'</h3><p class="prot-hint-txt">'+esc(protT("eigenHint"))+'</p>'+
        '<div class="prot-form"><div class="voll"><label>'+esc(protT("name"))+'</label><input id="pEN" maxlength="40"></div>'+
        '<div><label>'+esc(protT("portion"))+'</label><input id="pEA" type="number" inputmode="decimal" placeholder="200"></div>'+
        '<div><label>'+esc(protT("je100"))+'</label><input id="pEP" type="number" inputmode="decimal" placeholder="12"></div>'+
        '<div class="voll" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="prot-hint-txt" id="pEVor" style="margin:0">'+esc(protT("vorschau", { g:"–" }))+'</span>'+
        '<button type="button" class="prot-btn" data-peneu>'+esc(protT("anlegen"))+'</button></div></div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("suche"))+'</h3><p class="prot-hint-txt">'+esc(protT("sucheHint"))+'</p>'+
        '<div class="prot-form"><div><label>'+esc(protT("suche"))+'</label><input id="pFS" type="search" placeholder="'+esc(protT("suchePh"))+'"></div>'+
        '<div><label>'+esc(protT("menge"))+'</label><input id="pFG" type="number" inputmode="decimal" value="100"></div></div>'+
        '<div id="pFRes" style="margin-top:6px"></div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("kombi"))+'</h3><p class="prot-hint-txt">'+esc(protT("kombiHint"))+'</p>'+
        '<div class="prot-form"><div class="voll"><label>'+esc(protT("name"))+'</label><input id="pKN" maxlength="40"></div></div>'+
        '<p class="prot-hint-txt" style="margin:10px 0 6px">'+esc(protT("kombiWahl"))+'</p>'+
        '<div class="prot-stufen" style="grid-template-columns:repeat(2,1fr)">'+protDaten().knoepfe.map(function(b){
          return '<button type="button" class="prot-stufe" data-pkc="'+esc(b.id)+'" aria-pressed="false">'+esc(b.n)+'<small>+'+b.p+' g</small></button>'; }).join("")+'</div>'+
        '<button type="button" class="prot-btn" data-pkombi>'+esc(protT("kombiAnlegen"))+'</button></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("liste"))+'</h3>'+liste+verteil+'</section>'+
      '<section class="prot-karte"><h3>'+esc(protT("woche"))+'</h3>'+
        '<div class="prot-wochen">'+saeulen+linie+'</div>'+
        '<div class="prot-gross" style="margin-top:14px"><span>'+esc(protT("schnitt"))+'</span></div>'+
        '<div class="prot-gross"><b>'+(avg ? avg : '–')+' g</b>'+(avgKg ? '<span>'+avgKg.toFixed(2).replace('.', ',')+' '+esc(protT("gkg"))+'</span>' : '')+'</div>'+
        hinweis+'</section>'+
      '<section class="prot-karte"><h3>'+esc(protT("ziel"))+'</h3>'+
        '<div class="prot-stufen">'+stufen+'</div>'+gewicht+proMahl+
        '<div class="prot-gross" style="margin-top:10px"><b>'+(ziel ? ziel : '–')+' g</b></div>'+
        '<p class="prot-hint-txt" style="margin-top:8px">'+esc(protT("quelle"))+'</p></section>'+
      '<details class="prot-karte prot-info"><summary>'+esc(protT("info"))+'</summary><ul>'+infos+'</ul></details>'+
    '</div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderProtein(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-pbtn]").forEach(function(b){
    b.addEventListener("click", function(){
      var id = b.getAttribute("data-pbtn"), kn = protDaten().knoepfe.filter(function(x){ return x.id === id; })[0];
      if(!kn) return;
      kn.nutz = (kn.nutz || 0) + 1;
      protEintragen(kn.n, kn.p, kn.a);
      neu();
    });
  });
  /* Lange drücken: Portionsfaktor ½ × / 1 × / 1,5 × / 2 × */
  app.querySelectorAll("[data-pbtn]").forEach(function(b){
    langDruck(b, function(){
      var kn = protDaten().knoepfe.filter(function(x){ return x.id === b.getAttribute("data-pbtn"); })[0];
      if(!kn) return;
      openActionSheet(kn.n+" · "+protT("faktor"), [[0.5, "½"], [1, "1"], [1.5, "1,5"], [2, "2"]].map(function(f){
        return { ico:'<path d="M12 5v14M5 12h14"/>', label:f[1]+" × · +"+Math.round(kn.p * f[0])+" g", fn:function(){
          kn.nutz = (kn.nutz || 0) + 1; protEintragen(kn.n, kn.p * f[0], Math.round(kn.a * f[0])); neu(); } };
      }));
    });
  });
  /* Lebensmittelliste: suchen, Menge eingeben, antippen */
  var fS = document.getElementById("pFS"), fG = document.getElementById("pFG"), fRes = document.getElementById("pFRes");
  if(fS) fS.addEventListener("input", function(){
    var q = fS.value.toLowerCase().trim(), hits = q ? PROT_FOODS.filter(function(f){ return f[0].toLowerCase().indexOf(q) > -1; }).slice(0, 6) : [];
    fRes.innerHTML = q ? (hits.length ? hits.map(function(f){
      return '<button type="button" class="prot-eintrag" style="width:100%;background:none;border:0;border-bottom:1px solid var(--border);color:var(--text);font:inherit;cursor:pointer;text-align:left" data-pfood="'+PROT_FOODS.indexOf(f)+'">'+
        '<span>'+esc(f[0])+'</span><span class="prot-hint-txt" style="margin:0">'+esc(protT("je100kurz", { g:String(f[1]).replace(".", ",") }))+'</span></button>';
    }).join("") : '<p class="prot-leer">'+esc(protT("sucheLeer"))+'</p>') : "";
    fRes.querySelectorAll("[data-pfood]").forEach(function(b){
      b.addEventListener("click", function(){
        var f = PROT_FOODS[+b.getAttribute("data-pfood")], g = +fG.value;
        if(!f || !(g > 0 && g <= 2000)) return;
        protEintragen(f[0], g * f[1] / 100, Math.round(g));
        neu();
      });
    });
  });
  /* Kombi-Button: Summe mehrerer Buttons als ein neuer */
  app.querySelectorAll("[data-pkc]").forEach(function(b){
    b.addEventListener("click", function(){ var an = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", an); b.classList.toggle("an", an); });
  });
  var kombi = app.querySelector("[data-pkombi]");
  if(kombi) kombi.addEventListener("click", function(){
    var n = document.getElementById("pKN").value.trim(), ids = [];
    app.querySelectorAll("[data-pkc].an").forEach(function(b){ ids.push(b.getAttribute("data-pkc")); });
    if(!n || ids.length < 2){ showToast(protT("kombiFehl")); return; }
    var teile = protDaten().knoepfe.filter(function(x){ return ids.indexOf(x.id) > -1; });
    protDaten().knoepfe.unshift({ id:uid(), n:n, a:teile.reduce(function(s, x){ return s + x.a; }, 0), p:teile.reduce(function(s, x){ return s + x.p; }, 0), nutz:0 });
    save(); neu();
  });
  app.querySelectorAll("[data-pdel]").forEach(function(b){
    b.addEventListener("click", function(){
      var id = b.getAttribute("data-pdel"), p2 = protDaten(), k = kalTagKey(Date.now());
      p2.tage[k] = (p2.tage[k] || []).filter(function(e){ return e.id !== id; });
      save(); neu();
    });
  });
  var rueck = app.querySelector("[data-prueck]");
  if(rueck) rueck.addEventListener("click", function(){
    var p2 = protDaten(), k = kalTagKey(Date.now());
    if(p2.tage[k] && p2.tage[k].length){ p2.tage[k].pop(); save(); neu(); }
  });
  var manu = app.querySelector("[data-pmanu]");
  if(manu) manu.addEventListener("click", function(){
    var g = +document.getElementById("pManG").value, n = document.getElementById("pManN").value.trim();
    if(!(g > 0 && g <= 300)) return;
    protEintragen(n || protT("manuellName"), g, 0);
    neu();
  });
  var eN = document.getElementById("pEN"), eA = document.getElementById("pEA"), eP = document.getElementById("pEP"), vor = document.getElementById("pEVor");
  function eVorschau(){ var a = +eA.value, per = +eP.value; vor.textContent = protT("vorschau", { g:(a > 0 && per > 0 ? Math.round(a * per / 100) : "–") }); }
  if(eA && eP){ eA.addEventListener("input", eVorschau); eP.addEventListener("input", eVorschau); }
  var neuB = app.querySelector("[data-peneu]");
  if(neuB) neuB.addEventListener("click", function(){
    var a = +eA.value, per = +eP.value, n = eN.value.trim();
    if(!n || !(a > 0) || !(per > 0)){ showToast(protT("fehlEingabe")); return; }
    protDaten().knoepfe.unshift({ id:uid(), n:n, a:Math.round(a), p:Math.round(a * per / 100), nutz:0 });
    save(); neu();
  });
  app.querySelectorAll("[data-pstufe]").forEach(function(b){
    b.addEventListener("click", function(){ protDaten().stufe = +b.getAttribute("data-pstufe"); save(); neu(); });
  });
  var kgIn = document.getElementById("pKg");
  if(kgIn) kgIn.addEventListener("change", function(){
    var v = +kgIn.value;
    if(v >= 30 && v <= 250){ protDaten().kg = v; save(); neu(); }
  });
}
