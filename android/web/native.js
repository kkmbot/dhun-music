/* Dhun Android glue: runs before app.js, only inside the Capacitor app. */
(function () {
  "use strict";
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var API = "https://dhun.sites.tab.bot"; // the live Dhun server (search, Telegram, accounts)
  window.DHUN_NATIVE = true;
  window.DHUN_API = API;
  var P = C.Plugins;

  // 1) "/api/..." calls go to the live server. POSTs are sent as text/plain so no CORS preflight is needed.
  var origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (typeof input === "string" && input.indexOf("/api/") === 0) {
      input = API + input;
      if (init && init.method && init.method.toUpperCase() === "POST") {
        init = Object.assign({}, init, { headers: Object.assign({}, init.headers || {}, { "content-type": "text/plain;charset=UTF-8" }) });
      }
    }
    return origFetch(input, init);
  };

  // 2) Links to Telegram / other sites open in the right app (Telegram, browser), not inside Dhun.
  function openExt(url) {
    try { if (P.AppLauncher) return P.AppLauncher.openUrl({ url: url }).catch(function () { location.href = url; }); } catch (e) {}
    location.href = url;
  }
  window.open = function (url) { if (url) openExt(String(url)); return null; };
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null; if (!a) return;
    var h = a.getAttribute("href") || "";
    if (/^(https?:|tg:|mailto:|intent:)/i.test(h) && a.href.indexOf(location.origin + "/") !== 0) { e.preventDefault(); openExt(a.href); }
  }, true);

  // 3) Lock-screen / notification controls + background playback (foreground media service).
  var MS = P.MediaSession;
  if (MS) {
    var toData = function (src) {
      if (!src || src.indexOf(location.origin) !== 0) return Promise.resolve(src || "");
      return origFetch(src).then(function (r) { return r.blob(); }).then(function (b) {
        return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = function () { res(""); }; fr.readAsDataURL(b); });
      }).catch(function () { return ""; });
    };
    var meta = null, state = "none", lastPos = 0, metaSeq = 0, quiet = function (p) { try { Promise.resolve(p).catch(function () {}); } catch (e) {} };
    var shim = {
      get metadata() { return meta; },
      set metadata(m) {
        meta = m; if (!m) return; var my = ++metaSeq;
        var art = Array.prototype.slice.call(m.artwork || []); var best = art[art.length - 1];
        var base = { title: m.title || "", artist: m.artist || "", album: m.album || "" };
        quiet(MS.setMetadata(Object.assign({ artwork: [] }, base)));
        if (best && best.src) toData(best.src).then(function (src) { if (my === metaSeq && src) quiet(MS.setMetadata(Object.assign({ artwork: [{ src: src, sizes: best.sizes || "512x512", type: best.type || "image/jpeg" }] }, base))); });
      },
      get playbackState() { return state; },
      set playbackState(s) { if (s === state) return; state = s; quiet(MS.setPlaybackState({ playbackState: s })); },
      setActionHandler: function (action, handler) {
        if (!handler) return;
        try { quiet(MS.setActionHandler({ action: action }, function (d) { try { handler(Object.assign({ action: action }, d || {})); } catch (e) {} })); } catch (e) {}
      },
      setPositionState: function (p) {
        if (!p) return; var now = Date.now(); if (now - lastPos < 900) return; lastPos = now;
        quiet(MS.setPositionState({ duration: p.duration || 0, position: p.position || 0, playbackRate: p.playbackRate || 1 }));
      }
    };
    try { Object.defineProperty(navigator, "mediaSession", { value: shim, configurable: true }); } catch (e) {}
    if (typeof window.MediaMetadata !== "function") window.MediaMetadata = function (o) { o = o || {}; this.title = o.title; this.artist = o.artist; this.album = o.album; this.artwork = o.artwork || []; };
  }
})();
