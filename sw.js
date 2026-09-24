/* Sport Timer - Offline-Unterstuetzung
 *
 * Strategie: zuerst das Netz, dann der Zwischenspeicher.
 * Online siehst du immer sofort die neueste Fassung,
 * ohne Verbindung startet die zuletzt geladene aus dem Speicher.
 *
 * Schriften (Google Fonts) aendern sich nie und kommen deshalb direkt aus
 * einem eigenen Speicher, der Versionswechsel ueberdauert.
 */

var FASSUNG = "2026-09-24-8";
var SPEICHER = "sporttimer-" + FASSUNG;
var SCHRIFTEN = "sporttimer-schriften";
var SCHRIFT_QUELLEN = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
var GRUNDGERUEST = ["./", "./index.html", "./manifest.json", "./icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(SPEICHER)
      .then(function (c) { return c.addAll(GRUNDGERUEST); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen.map(function (n) {
        if (n !== SPEICHER && n !== SCHRIFTEN) return caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var anfrage = e.request;
  if (anfrage.method !== "GET") return;

  var ziel;
  try { ziel = new URL(anfrage.url); } catch (err) { return; }

  if (SCHRIFT_QUELLEN.indexOf(ziel.origin) !== -1) {
    e.respondWith(
      caches.open(SCHRIFTEN).then(function (c) {
        return c.match(anfrage).then(function (treffer) {
          if (treffer) return treffer;
          return fetch(anfrage).then(function (antwort) {
            if (antwort && (antwort.ok || antwort.type === "opaque")) c.put(anfrage, antwort.clone());
            return antwort;
          });
        });
      })
    );
    return;
  }

  if (ziel.origin !== self.location.origin) return;

  e.respondWith(
    fetch(anfrage).then(function (antwort) {
      if (antwort && antwort.status === 200 && antwort.type === "basic") {
        var kopie = antwort.clone();
        caches.open(SPEICHER).then(function (c) { c.put(anfrage, kopie); });
      }
      return antwort;
    }).catch(function () {
      return caches.match(anfrage).then(function (treffer) {
        if (treffer) return treffer;
        if (anfrage.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "offline" });
      });
    })
  );
});
