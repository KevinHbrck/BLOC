/* ============ Protein-Tracker (Tools › Protein, 2026-10-24) ============
   Oben: Tagessumme in Gramm und Kalorienbedarf (Schätzung), darunter Schnellbuttons mit einem Tipp, die heutigen Einträge und die Suche.
   Seltenes (eigener Button, Kombi, Gramm eintippen, Woche, Bedarf, Erklärung) steht eingeklappt darunter.
   Beim ersten Öffnen fragt ein Bildschirm Gewicht, Größe, Alter, Geschlecht und Aktivität (dieselben Körperdaten wie unter Fortschritt, settings.koerper).
   Alles lokal in settings.protein - nichts verlässt das Gerät. Kein Barcode-Scanner: Er bräuchte eine Produktdatenbank im Netz und bräche das Versprechen.
   Keine Erinnerung ums Training, keine rote Warnung. Texte dieser Seite stehen in PROT_T (Deutsch und Englisch). */
var PROT_T = {
  de: {
    titel:"Protein", kachelSub:"Tagesziel, Kalorienbedarf, Schnellbuttons", heute:"Heute", von:"von {g} g", noch:"noch {g} g", erreicht:"Ziel erreicht",
    rueck:"Rückgängig", schnell:"Schnellbuttons", schnellHint:"",
    onbTitel:"Dein Bedarf", onbText:"Für dein Proteinziel und deinen Kalorienbedarf.",
    onbFertig:"Fertig", onbSpaeter:"Später", onbFehl:"Bitte mindestens das Gewicht eintragen.", onbOffen:"Bedarf noch offen",
    kcal:"Kalorienbedarf", kcalWert:"ca. {k} kcal pro Tag · ±10 %", kcalHint:"",
    kcalOffen:"Für den Kalorienbedarf fehlen Größe und Alter.",
    bedarf:"Mein Bedarf", bedarfHint:"", stufeTitel:"Proteinziel pro kg Körpergewicht",
    manuell:"Gramm eintippen", manuellHint:"", manuellName:"Manuell",
    name:"Name (optional)", hinzu:"Hinzufügen", eigenDetails:"Eigenes hinzufügen", eigen:"Eigener Button",
    eigenHint:"Protein je 100 g steht auf der Packung.", portion:"Portion (g)",
    je100:"Protein je 100 g", vorschau:"ergibt {g} g Protein", anlegen:"Button anlegen", fehlEingabe:"Name, Portion und Protein eintragen.",
    liste:"Heute erfasst", leer:"Noch nichts erfasst.", loeschen:"Eintrag löschen",
    faktor:"Portion wählen", suche:"Lebensmittel suchen", sucheHint:"",
    sucheLeer:"Nicht in der Liste: eigenen Button anlegen oder Gramm eintippen.", suchePh:"z. B. Quark, Ei, Linsen", menge:"Menge (g)", je100kurz:"{g} g / 100 g",
    alsButton:"Als Button speichern", angelegt:"Button angelegt.",
    kombi:"Kombi-Button", kombiHint:"", kombiWahl:"Buttons wählen",
    kombiAnlegen:"Kombi anlegen", kombiFehl:"Name und mindestens zwei Buttons wählen.",
    wocheDetails:"Woche und Verteilung", verteilung:"Verteilung heute", morgens:"Morgens", mittags:"Mittags", abends:"Abends",
    woche:"Letzte 7 Tage", schnitt:"Schnitt an erfassten Tagen", gkg:"in g/kg",
    fehlt:"Im Schnitt fehlen {g} g pro Tag, etwa ein Skyr oder Shake.", ok:"Ziel im Wochenschnitt erreicht.",
    viel:"Über 2,2 g/kg im Schnitt: mehr bringt kaum zusätzlichen Nutzen.",
    basis:"Basis", training:"Training", intensiv:"Intensiv", basisS:"0,83 g/kg · WHO", trainS:"1,6 g/kg", intensivS:"2,0 g/kg",
    proMahl:"pro Mahlzeit (0,3–0,4 g/kg)",
    quelle:"",
    info:"So rechnet die Seite",
    quellenTitel:"Quellen",
    infoListe:[
      "Die Tagessumme zählt am meisten.",
      "Kalorien: Grundumsatz (Mifflin-St-Jeor) mal Aktivität, eine Schätzung mit etwa ±10 %.",
      "Verteilung: 3 bis 5 Mahlzeiten mit je 0,3 bis 0,4 g/kg sind etwas besser als alles auf einmal.",
      "Timing: Ein Zeitfenster nach dem Training gibt es nicht.",
      "Über 2,2 g/kg im Wochenschnitt bringt mehr kaum Nutzen.",
      "Nieren: Bei eingeschränkter Funktion die Menge mit einer Ärztin oder einem Arzt klären.",
      "Werte aus Packungen und Listen sind auf etwa ±10 bis 20 % genau.",
      "Keine medizinische Beratung."
    ],
    quellen:[
      "WHO/FAO/UNU: Protein and amino acid requirements in human nutrition (2007)",
      "ISSN Position Stand: Protein and exercise (Jäger et al., 2017)",
      "ACSM/AND/DC Position Stand: Nutrition and athletic performance (2016)",
      "EFSA: Dietary Reference Values for protein (2012)",
      "Mifflin et al.: A new predictive equation for resting energy expenditure (1990)"
    ]
  },
  en: {
    titel:"Protein", kachelSub:"Daily goal, calorie need, quick buttons", heute:"Today", von:"of {g} g", noch:"{g} g to go", erreicht:"Goal reached",
    rueck:"Undo", schnell:"Quick buttons", schnellHint:"",
    onbTitel:"Your needs", onbText:"For your protein goal and calorie need.",
    onbFertig:"Done", onbSpaeter:"Later", onbFehl:"Please enter at least your weight.", onbOffen:"Needs not set yet",
    kcal:"Calorie need", kcalWert:"about {k} kcal per day · ±10 %", kcalHint:"",
    kcalOffen:"Height and age are missing for the calorie need.",
    bedarf:"My needs", bedarfHint:"", stufeTitel:"Protein goal per kg body weight",
    manuell:"Type in grams", manuellHint:"", manuellName:"Manual",
    name:"Name (optional)", hinzu:"Add", eigenDetails:"Add your own", eigen:"Own button",
    eigenHint:"Protein per 100 g is on the pack.", portion:"Portion (g)",
    je100:"Protein per 100 g", vorschau:"gives {g} g protein", anlegen:"Create button", fehlEingabe:"Enter a name, portion and protein.",
    liste:"Logged today", leer:"Nothing logged yet.", loeschen:"Delete entry",
    faktor:"Choose portion", suche:"Search foods", sucheHint:"",
    sucheLeer:"Not in the list: create your own button or type in grams.", suchePh:"e.g. quark, egg, lentils", menge:"Amount (g)", je100kurz:"{g} g / 100 g",
    alsButton:"Save as button", angelegt:"Button created.",
    kombi:"Combo button", kombiHint:"", kombiWahl:"Choose buttons",
    kombiAnlegen:"Create combo", kombiFehl:"Enter a name and choose at least two buttons.",
    wocheDetails:"Week and spread", verteilung:"Spread today", morgens:"Morning", mittags:"Midday", abends:"Evening",
    woche:"Last 7 days", schnitt:"Average on logged days", gkg:"in g/kg",
    fehlt:"On average {g} g a day are missing, about one skyr or shake.", ok:"Weekly average reaches the goal.",
    viel:"Above 2.2 g/kg on average: more brings little extra benefit.",
    basis:"Basic", training:"Training", intensiv:"Intensive", basisS:"0.83 g/kg · WHO", trainS:"1.6 g/kg", intensivS:"2.0 g/kg",
    proMahl:"per meal (0.3–0.4 g/kg)",
    quelle:"",
    info:"How the page calculates",
    quellenTitel:"Sources",
    infoListe:[
      "The daily total counts most.",
      "Calories: basal rate (Mifflin-St Jeor) times activity, an estimate with about ±10 %.",
      "Spread: 3 to 5 meals with 0.3 to 0.4 g/kg each are a bit better than all at once.",
      "Timing: there is no window after training.",
      "Above 2.2 g/kg on average, more brings little extra benefit.",
      "Kidneys: with reduced function, clarify the amount with a doctor.",
      "Values from packs and lists are about ±10 to 20 % accurate.",
      "No medical advice."
    ],
    quellen:[
      "WHO/FAO/UNU: Protein and amino acid requirements in human nutrition (2007)",
      "ISSN Position Stand: Protein and exercise (Jäger et al., 2017)",
      "ACSM/AND/DC Position Stand: Nutrition and athletic performance (2016)",
      "EFSA: Dietary Reference Values for protein (2012)",
      "Mifflin et al.: A new predictive equation for resting energy expenditure (1990)"
    ]
  }
};
/* Schnellbuttons zum Start (Portion in g, Protein in g) */
var PROT_START = [
  { n:"Skyr", a:500, p:55 }, { n:"Magerquark", a:250, p:30 }, { n:"Whey-Shake", a:30, p:24 }, { n:"Eier (3 Stk)", a:180, p:21 },
  { n:"Hähnchenbrust", a:150, p:35 }, { n:"Linsen, gekocht", a:200, p:18 }, { n:"Haferflocken", a:80, p:11 }, { n:"Thunfisch (Dose)", a:130, p:32 }
];
/* Mitgelieferte Lebensmittel: „Name|Protein in g je 100 g“. Eigene Auswahl mit grob gerundeten Richtwerten; die Packungsangabe geht vor.
   Neue Einträge einfach als weitere Zeile anhängen. */
var PROT_FOODS = ("Magerquark|12;Quark 20 % Fett|11;Skyr|11;Griechischer Joghurt 10 %|6;Naturjoghurt 3,5 %|4;Joghurt fettarm|4;Hüttenkäse|12;Frischkäse|6;Milch 1,5 %|3,4;Buttermilch|3,5;Kefir|3,5;"+
  "Gouda|25;Emmentaler|29;Mozzarella|18;Parmesan|36;Feta|15;Harzer Käse|30;Camembert|20;Proteinpudding|10;Sojadrink|3,3;Haferdrink|1;"+
  "Whey-Pulver|80;Casein-Pulver|80;Erbsenprotein-Pulver|78;Proteinriegel|35;Protein-Shake fertig|15;"+
  "Ei|13;Eiklar|11;"+
  "Hähnchenbrust, roh|23;Hähnchenschenkel|19;Putenbrust|24;Rinderhack, mager|21;Rindersteak|22;Schweinefilet|22;Schweinehack|17;Schinken, gekocht|20;"+
  "Putenaufschnitt|17;Salami|20;Leberkäse|12;Bratwurst|13;Lammfleisch|20;"+
  "Lachs|20;Thunfisch, abgetropft|26;Forelle|20;Kabeljau|18;Seelachs|18;Garnelen|18;Hering|17;Makrele|19;Sardinen, Dose|21;"+
  "Tofu|14;Räuchertofu|16;Tempeh|19;Seitan|25;Sojagranulat, trocken|50;Edamame|12;Sojabohnen, gekocht|16;Quorn|14;"+
  "Linsen, gekocht|9;Linsen, trocken|24;Kichererbsen, gekocht|9;Kidneybohnen, gekocht|8;Weiße Bohnen, gekocht|7;Erbsen|6;Hummus|8;"+
  "Haferflocken|13;Müsli|10;Vollkornbrot|8;Weißbrot|8;Toast|8;Brötchen|9;Nudeln, trocken|12;Nudeln, gekocht|5;Reis, gekocht|3;Quinoa, gekocht|4;Couscous, gekocht|4;"+
  "Kartoffeln|2;Brokkoli|3;Spinat|3;Mais|3;"+
  "Erdnüsse|26;Erdnussmus|25;Mandeln|21;Walnüsse|15;Cashews|18;Haselnüsse|15;Kürbiskerne|30;Sonnenblumenkerne|21;Chiasamen|17;Leinsamen|18;Hanfsamen|32").split(";").map(function(z){
  var x = z.split("|"); return [x[0], parseFloat(x[1].replace(",", "."))];
});
var protOffen = {};   // eingeklappte Karten, die der Nutzer geöffnet hat (bleiben beim Neuzeichnen offen)
function protT(key, vars){
  var s = (PROT_T[currentLang()] || PROT_T.de)[key];
  if(s == null) s = PROT_T.de[key];
  if(vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, function(m, k){ return vars[k] != null ? vars[k] : m; });
  return s;
}
/* Einstellungen des Protein-Trackers: Version, Stufe (g/kg), Schnellbuttons, Einträge je Tag, „später“ (Onboarding übersprungen) */
function protDaten(){
  var s = state.db.settings;
  if(!s.protein || typeof s.protein !== "object"){
    s.protein = { v:1, stufe:1.6, kg:0, knoepfe:PROT_START.map(function(k){ return { id:uid(), n:k.n, a:k.a, p:k.p, nutz:0 }; }), tage:{} };
    save();
  } else if(!s.protein.v){ s.protein.v = 1; save(); }
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
/* Grundumsatz nach Mifflin-St-Jeor; ohne Angabe zum Geschlecht der Mittelwert beider Formeln. Ohne Größe und Alter: 0 */
function protGrundumsatz(kd){
  if(!kd || !(kd.cm >= 120 && kd.cm <= 230) || !(kd.alter >= 10)) return 0;
  return 10*kd.kg + 6.25*kd.cm - 5*kd.alter + (kd.sex === "m" ? 5 : kd.sex === "w" ? -161 : -78);
}
/* Kalorienbedarf = Grundumsatz × Aktivität (ohne Angabe 1,65), auf 50 kcal gerundet - eine Schätzung mit etwa ±10 % */
function protKcal(){
  var kd = koerperDaten(), b = protGrundumsatz(kd);
  return b > 0 ? Math.round(b * (kd.pal || 1.65) / 50) * 50 : 0;
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
/* Kopfkarte: Protein von Ziel, Balken, Kalorienbedarf - wird auch nach Änderung der Körperdaten allein neu gezeichnet */
function protKopfHTML(summe){
  var ziel = protZiel(), rest = ziel - summe, proz = ziel ? Math.min(100, Math.round(summe / ziel * 100)) : 0, kcal = protKcal(), kd = koerperDaten();
  return '<div class="prot-gross"><b>'+summe+' g</b>'+(ziel ? '<span>'+esc(protT("von", { g:ziel }))+'</span>' : '')+'</div>'+
    '<div class="prot-bar"><i style="width:'+proz+'%"></i></div>'+
    '<div class="prot-zeile">'+esc(ziel ? (rest > 0 ? protT("noch", { g:rest }) : protT("erreicht")) : protT("onbOffen"))+'</div>'+
    (kcal ? '<div class="prot-kcal"><b>'+esc(protT("kcalWert", { k:kcal.toLocaleString(currentLang() === "en" ? "en-GB" : "de-DE") }))+'</b><small>'+esc(protT("kcalHint"))+'</small></div>'
          : kd ? '<div class="prot-kcal"><small>'+esc(protT("kcalOffen"))+'</small></div>' : '');
}
function protKarte(key, titel, inhalt){
  return '<details class="prot-karte prot-info" data-pdet="'+key+'"'+(protOffen[key] ? ' open' : '')+'><summary>'+esc(titel)+'</summary>'+inhalt+'</details>';
}
function renderProtein(){
  var p = protDaten(), heute = kalTagKey(Date.now()), eint = protTag(heute), summe = protSumme(eint);
  var kg = protKg(), lang = currentLang() === "en" ? "en-GB" : "de-DE", s = state.db.settings;
  var onboarding = !koerperDaten() && !p.spaeter;
  /* Wochenblick: die letzten sieben Tage, heute rechts */
  var tage = [], ziel = protZiel();
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
  var vt = [0, 0, 0];
  eint.forEach(function(e){ var h = new Date(e.at).getHours(); vt[h < 11 ? 0 : h < 16 ? 1 : 2] += e.p; });
  var verteil = eint.length > 1 ? '<h3 style="margin-top:14px">'+esc(protT("verteilung"))+'</h3><div class="prot-verteil">'+
    ["morgens", "mittags", "abends"].map(function(k2, i2){ return '<div><b>'+vt[i2]+' g</b><small>'+esc(protT(k2))+'</small></div>'; }).join("")+'</div>' : "";
  var knopf = protKnoepfe().map(function(b){
    return '<button type="button" class="prot-kn" data-pbtn="'+esc(b.id)+'"><b>'+esc(b.n)+'</b><small>'+b.a+' g</small><em>+'+b.p+' g</em></button>';
  }).join("");
  var liste = eint.length ? eint.slice().reverse().map(function(e){
    return '<div class="prot-eintrag"><div class="prot-e-links"><b>'+esc(e.n)+'</b><small>'+protZeit(e.at)+(e.a ? ' · '+e.a+' g' : '')+'</small></div>'+
      '<div class="prot-e-rechts">'+e.p+' g <button type="button" class="prot-x" data-pdel="'+esc(e.id)+'" aria-label="'+esc(protT("loeschen"))+'">×</button></div></div>';
  }).join("") : '<p class="prot-leer">'+esc(protT("leer"))+'</p>';
  var stufen = [["basis", 0.83, "basisS"], ["training", 1.6, "trainS"], ["intensiv", 2, "intensivS"]].map(function(x){
    return '<button type="button" class="prot-stufe'+(p.stufe === x[1] ? ' an' : '')+'" data-pstufe="'+x[1]+'" aria-pressed="'+(p.stufe === x[1])+'">'+esc(protT(x[0]))+'<small>'+esc(protT(x[2]))+'</small></button>';
  }).join("");
  var proMahl = kg ? '<p class="prot-hint-txt">'+esc(protT("proMahl"))+': '+Math.round(kg * 0.3)+'–'+Math.round(kg * 0.4)+' g</p>' : '';
  var profilForm = koerperFormHTML(s, { ohneName:true });
  var onb = onboarding
    ? '<section class="prot-karte prot-onb"><h3>'+esc(protT("onbTitel"))+'</h3><p class="prot-hint-txt">'+esc(protT("onbText"))+'</p>'+profilForm+
      '<div class="prot-onb-knoepfe"><button type="button" class="prot-btn" data-ponbfertig>'+esc(protT("onbFertig"))+'</button>'+
      '<button type="button" class="prot-btn ghost" data-ponbspaeter>'+esc(protT("onbSpaeter"))+'</button></div></section>' : '';
  var eigenes =
    '<h4>'+esc(protT("manuell"))+'</h4><p class="prot-hint-txt">'+esc(protT("manuellHint"))+'</p>'+
    '<div class="prot-form"><div class="voll"><label>'+esc(protT("name"))+'</label><input id="pManN" maxlength="40"></div>'+
    '<div><label>g</label><input id="pManG" type="number" inputmode="decimal" min="1" max="300" placeholder="25"></div>'+
    '<button type="button" class="prot-btn" data-pmanu>'+esc(protT("hinzu"))+'</button></div>'+
    '<h4>'+esc(protT("eigen"))+'</h4><p class="prot-hint-txt">'+esc(protT("eigenHint"))+'</p>'+
    '<div class="prot-form"><div class="voll"><label>'+esc(protT("name"))+'</label><input id="pEN" maxlength="40"></div>'+
    '<div><label>'+esc(protT("portion"))+'</label><input id="pEA" type="number" inputmode="decimal" placeholder="200"></div>'+
    '<div><label>'+esc(protT("je100"))+'</label><input id="pEP" type="number" inputmode="decimal" placeholder="12"></div>'+
    '<div class="voll prot-zeile-flex"><span class="prot-hint-txt" id="pEVor" style="margin:0">'+esc(protT("vorschau", { g:"–" }))+'</span>'+
    '<button type="button" class="prot-btn" data-peneu>'+esc(protT("anlegen"))+'</button></div></div>'+
    '<h4>'+esc(protT("kombi"))+'</h4><p class="prot-hint-txt">'+esc(protT("kombiHint"))+'</p>'+
    '<div class="prot-form"><div class="voll"><label>'+esc(protT("name"))+'</label><input id="pKN" maxlength="40"></div></div>'+
    '<p class="prot-hint-txt" style="margin:10px 0 6px">'+esc(protT("kombiWahl"))+'</p>'+
    '<div class="prot-stufen" style="grid-template-columns:repeat(2,1fr)">'+p.knoepfe.map(function(b){
      return '<button type="button" class="prot-stufe" data-pkc="'+esc(b.id)+'" aria-pressed="false">'+esc(b.n)+'<small>+'+b.p+' g</small></button>'; }).join("")+'</div>'+
    '<button type="button" class="prot-btn" data-pkombi>'+esc(protT("kombiAnlegen"))+'</button>';
  var woche = '<div class="prot-wochen">'+saeulen+linie+'</div>'+
    '<div class="prot-gross" style="margin-top:14px"><span>'+esc(protT("schnitt"))+'</span></div>'+
    '<div class="prot-gross"><b>'+(avg ? avg : '–')+' g</b>'+(avgKg ? '<span>'+avgKg.toFixed(2).replace('.', ',')+' '+esc(protT("gkg"))+'</span>' : '')+'</div>'+hinweis+verteil;
  var bedarf = '<p class="prot-hint-txt">'+esc(protT("bedarfHint"))+'</p>'+(onboarding ? '' : profilForm)+
    '<h4>'+esc(protT("stufeTitel"))+'</h4><div class="prot-stufen">'+stufen+'</div>'+proMahl+
    '<p class="prot-hint-txt">'+esc(protT("quelle"))+'</p>';
  app.innerHTML = topbar(protT("titel"), { back:"#training", right:kopfSymboleNeu("training") }) +
    '<div class="prot-seite">'+
      '<div class="prot-bild" role="img" aria-label="'+esc(protT("titel"))+'"></div>'+
      onb+
      '<section class="prot-karte prot-heute" aria-label="'+esc(protT("heute"))+'"><div id="pKopf">'+protKopfHTML(summe)+'</div>'+
        '<button type="button" class="prot-rueck" data-prueck'+(eint.length ? '' : ' disabled')+'>'+esc(protT("rueck"))+'</button></section>'+
      '<section class="prot-karte" aria-label="'+esc(protT("schnell"))+'"><div class="prot-raster">'+knopf+'</div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("suche"))+'</h3>'+
        '<div class="prot-form"><div><input id="pFS" type="search" aria-label="'+esc(protT("suche"))+'" placeholder="'+esc(protT("suchePh"))+'"></div>'+
        '<div><input id="pFG" type="number" inputmode="decimal" value="100" aria-label="'+esc(protT("menge"))+'" placeholder="'+esc(protT("menge"))+'"></div></div>'+
        '<div id="pFRes" style="margin-top:6px"></div></section>'+
      '<section class="prot-karte"><h3>'+esc(protT("liste"))+'</h3>'+liste+'</section>'+
      protKarte("eigen", protT("eigenDetails"), eigenes)+
      protKarte("woche", protT("wocheDetails"), woche)+
      protKarte("bedarf", protT("bedarf"), bedarf)+
      protKarte("info", protT("info"), '<ul>'+protT("infoListe").map(function(z){ return '<li>'+esc(z)+'</li>'; }).join("")+'</ul><h4>'+esc(protT("quellenTitel"))+'</h4><ul>'+protT("quellen").map(function(z){ return '<li>'+esc(z)+'</li>'; }).join("")+'</ul>')+
    '</div>';
  bindCommon();
  function neu(){ var y = window.scrollY; renderProtein(); window.scrollTo(0, y); }
  app.querySelectorAll("[data-pdet]").forEach(function(d){ d.addEventListener("toggle", function(){ protOffen[d.getAttribute("data-pdet")] = d.open; }); });
  /* Körperdaten (Gewicht, Größe, Alter, Geschlecht, Aktivität): gemeinsam mit Fortschritt; nach jeder Änderung nur die Kopfkarte aktualisieren (Eingabe behält den Fokus) */
  koerperBinden(app);
  function kopfAktualisieren(){ var kopf = document.getElementById("pKopf"); if(kopf) kopf.innerHTML = protKopfHTML(protSumme(protTag(kalTagKey(Date.now())))); }
  app.querySelectorAll(".koerper-form input, .koerper-form button").forEach(function(el){
    el.addEventListener("change", function(){ setTimeout(kopfAktualisieren, 0); });
    el.addEventListener("click", function(){ setTimeout(kopfAktualisieren, 0); });
    el.addEventListener("blur", function(){ setTimeout(kopfAktualisieren, 0); });
  });
  var fertig = app.querySelector("[data-ponbfertig]");
  if(fertig) fertig.addEventListener("click", function(){
    var kg2 = parseFloat(String(document.getElementById("k-kg").value).replace(",", "."));
    if(!(kg2 >= 30 && kg2 <= 250)){ showToast(protT("onbFehl")); return; }
    document.getElementById("k-kg").dispatchEvent(new Event("change"));   // speichert alle Felder über koerperBinden
    neu();
  });
  var spaeter = app.querySelector("[data-ponbspaeter]");
  if(spaeter) spaeter.addEventListener("click", function(){ p.spaeter = true; save(); neu(); });
  app.querySelectorAll("[data-pbtn]").forEach(function(b){
    b.addEventListener("click", function(){
      var id = b.getAttribute("data-pbtn"), kn = protDaten().knoepfe.filter(function(x){ return x.id === id; })[0];
      if(!kn) return;
      kn.nutz = (kn.nutz || 0) + 1;
      protEintragen(kn.n, kn.p, kn.a);
      neu();
    });
    /* Lange drücken: Portionsfaktor ½ × / 1 × / 1,5 × / 2 × */
    langDruck(b, function(){
      var kn = protDaten().knoepfe.filter(function(x){ return x.id === b.getAttribute("data-pbtn"); })[0];
      if(!kn) return;
      openActionSheet(kn.n+" · "+protT("faktor"), [[0.5, "½"], [1, "1"], [1.5, "1,5"], [2, "2"]].map(function(f){
        return { ico:'<path d="M12 5v14M5 12h14"/>', label:f[1]+" × · +"+Math.round(kn.p * f[0])+" g", fn:function(){
          kn.nutz = (kn.nutz || 0) + 1; protEintragen(kn.n, kn.p * f[0], Math.round(kn.a * f[0])); neu(); } };
      }));
    });
  });
  /* Lebensmittelliste: suchen, Menge eingeben, Treffer antippen; „Als Button speichern“ legt daraus einen Schnellbutton an */
  var fS = document.getElementById("pFS"), fG = document.getElementById("pFG"), fRes = document.getElementById("pFRes");
  if(fS) fS.addEventListener("input", function(){
    var q = fS.value.toLowerCase().trim(), hits = q ? PROT_FOODS.filter(function(f){ return f[0].toLowerCase().indexOf(q) > -1; }).slice(0, 8) : [];
    fRes.innerHTML = q ? (hits.length ? hits.map(function(f){
      var idx = PROT_FOODS.indexOf(f);
      return '<div class="prot-eintrag"><button type="button" class="prot-treffer" data-pfood="'+idx+'"><b>'+esc(f[0])+'</b><small>'+esc(protT("je100kurz", { g:String(f[1]).replace(".", ",") }))+'</small></button>'+
        '<button type="button" class="prot-x" data-pfbtn="'+idx+'" aria-label="'+esc(protT("alsButton"))+'" title="'+esc(protT("alsButton"))+'">＋</button></div>';
    }).join("") : '<p class="prot-leer">'+esc(protT("sucheLeer"))+'</p>') : "";
    fRes.querySelectorAll("[data-pfood]").forEach(function(b){
      b.addEventListener("click", function(){
        var f = PROT_FOODS[+b.getAttribute("data-pfood")], g = +fG.value;
        if(!f || !(g > 0 && g <= 2000)) return;
        protEintragen(f[0], g * f[1] / 100, Math.round(g));
        neu();
      });
    });
    fRes.querySelectorAll("[data-pfbtn]").forEach(function(b){
      b.addEventListener("click", function(){
        var f = PROT_FOODS[+b.getAttribute("data-pfbtn")], g = +fG.value;
        if(!f || !(g > 0 && g <= 2000)) return;
        protDaten().knoepfe.unshift({ id:uid(), n:f[0], a:Math.round(g), p:Math.round(g * f[1] / 100), nutz:0 });
        save(); showToast(protT("angelegt")); neu();
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
    protDaten().knoepfe.unshift({ id:uid(), n:n, a:teile.reduce(function(sum, x){ return sum + x.a; }, 0), p:teile.reduce(function(sum, x){ return sum + x.p; }, 0), nutz:0 });
    save(); neu();
  });
  app.querySelectorAll("[data-pdel]").forEach(function(b){
    b.addEventListener("click", function(){
      var id = b.getAttribute("data-pdel"), p2 = protDaten(), k2 = kalTagKey(Date.now());
      p2.tage[k2] = (p2.tage[k2] || []).filter(function(e){ return e.id !== id; });
      save(); neu();
    });
  });
  var rueck = app.querySelector("[data-prueck]");
  if(rueck) rueck.addEventListener("click", function(){
    var p2 = protDaten(), k2 = kalTagKey(Date.now());
    if(p2.tage[k2] && p2.tage[k2].length){ p2.tage[k2].pop(); save(); neu(); }
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
}
