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
    var handlers = {};

    // 3b) Home-screen widget (native "DhunWidget" plugin): mirror title/artist/art/play state, and route
    //     the widget's prev / play-pause / next to the same handlers the lock screen uses.
    var DW = P.DhunWidget;
    var wTitle = "", wArtist = "";
    var lyr = ""; // v32: the lyric line being sung right now ("" = show the artist), set by app.js through DhunNative.lyric()
    // ~256px JPEG data URL for the widget. Remote https art is passed as the URL (native downloads it,
    // avoids canvas CORS); blob:/same-origin art is drawn to a canvas here.
    var widgetArt = function (src) {
      if (!src) return Promise.resolve("");
      if (/^https:/i.test(src) && src.indexOf(location.origin) !== 0) return Promise.resolve(src);
      return new Promise(function (res) {
        var img = new Image();
        img.onload = function () {
          try {
            var s = Math.min(img.naturalWidth, img.naturalHeight) || 1, o = Math.min(256, s);
            var c = document.createElement("canvas"); c.width = c.height = o;
            c.getContext("2d").drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, o, o);
            res(c.toDataURL("image/jpeg", 0.85));
          } catch (e) { res(/^https:/i.test(src) ? src : ""); }
        };
        img.onerror = function () { res(/^https:/i.test(src) ? src : ""); };
        img.src = src;
      });
    };
    var widgetMeta = function (m, art) {
      if (!DW) return;
      wTitle = m.title || ""; wArtist = m.artist || "";
      var pick = null; // smallest artwork that is still >= 200px, else the largest (MediaMetadata artwork objects are frozen: never write to them)
      var sized = art.map(function (a) { return { a: a, n: parseInt(String((a && a.sizes) || "0"), 10) || 0 }; });
      sized.sort(function (x, y) { return x.n - y.n; }).forEach(function (x) { if (!pick && x.n >= 200) pick = x.a; });
      if (!pick) pick = art[art.length - 1];
      var my = metaSeq;
      quiet(DW.update({ title: wTitle, artist: lyr || wArtist, playing: state === "playing" })); // text now
      widgetArt(pick && pick.src).then(function (src) { if (my === metaSeq) quiet(DW.update({ title: wTitle, artist: lyr || wArtist, playing: state === "playing", art: src || "" })); });
    };
    var widgetState = function () { if (DW && wTitle) quiet(DW.update({ title: wTitle, artist: lyr || wArtist, playing: state === "playing" })); };
    var widgetDo = function (a) {
      var f = a === "prev" ? handlers.previoustrack : a === "next" ? handlers.nexttrack : a === "toggle" ? (state === "playing" ? handlers.pause : handlers.play) : null;
      if (f) { try { f({ action: a }); } catch (e) {} } else widgetState(); // nothing to do → put the real icon back
    };
    if (DW) {
      try { quiet(DW.addListener("widgetAction", function (d) { widgetDo(d && d.action); })); } catch (e) {}
      // A widget tap that started the app: act once app.js has registered its handlers and restored the queue.
      var tries = 0, pend = function () {
        if (!handlers.play && ++tries < 40) return setTimeout(pend, 250);
        quiet(DW.getPendingAction().then(function (r) { if (r && r.action) setTimeout(function () { widgetDo(r.action); }, 300); }));
      };
      if (document.readyState === "complete") pend(); else window.addEventListener("load", pend);
    }
    var shim = {
      get metadata() { return meta; },
      set metadata(m) {
        meta = m; lyr = ""; if (!m) return; var my = ++metaSeq;
        var art = Array.prototype.slice.call(m.artwork || []); var best = art[art.length - 1];
        var base = { title: m.title || "", artist: m.artist || "", album: m.album || "" };
        quiet(MS.setMetadata(Object.assign({ artwork: [] }, base)));
        if (best && best.src) toData(best.src).then(function (src) { if (my === metaSeq && src) quiet(MS.setMetadata(Object.assign({ artwork: [{ src: src, sizes: best.sizes || "512x512", type: best.type || "image/jpeg" }] }, base, { artist: lyr || base.artist }))); });
        try { widgetMeta(m, art); } catch (e) {}
      },
      get playbackState() { return state; },
      set playbackState(s) { if (s === state) return; state = s; quiet(MS.setPlaybackState({ playbackState: s })); widgetState(); },
      setActionHandler: function (action, handler) {
        handlers[action] = handler || null;
        if (!handler) return;
        try { quiet(MS.setActionHandler({ action: action }, function (d) { try { handler(Object.assign({ action: action }, d || {})); } catch (e) {} })); } catch (e) {}
      },
      setPositionState: function (p) {
        if (!p) return; var now = Date.now(); if (now - lastPos < 900) return; lastPos = now;
        quiet(MS.setPositionState({ duration: p.duration || 0, position: p.position || 0, playbackRate: p.playbackRate || 1 }));
      }
    };
    try { Object.defineProperty(navigator, "mediaSession", { value: shim, configurable: true }); } catch (e) {}
    // v32: lyric line → widget subtitle + notification / lock-screen text (no artwork in the call: the plugin keeps the current
    // picture and the play/pause/next controls are untouched). app.js calls this once per line change; "" = back to the artist.
    window.__dhunLyric = function (line) {
      line = String(line || "").replace(/\s+/g, " ").trim().slice(0, 140);
      if (line === lyr || !meta) return; lyr = line;
      var a = lyr || meta.artist || "";
      quiet(MS.setMetadata({ title: meta.title || "", artist: a, album: meta.album || "" }));
      if (DW && wTitle) quiet(DW.update({ title: wTitle, artist: lyr || wArtist, playing: state === "playing" }));
    };
    if (typeof window.MediaMetadata !== "function") window.MediaMetadata = function (o) { o = o || {}; this.title = o.title; this.artist = o.artist; this.album = o.album; this.artwork = o.artwork || []; };
  }

  // 4) Voice search (system speech dialog, no mic permission) + sharing images (Share card).
  //    window.DhunNative.voice.available() → Promise<boolean>
  //    window.DhunNative.voice.listen("hi-IN"|"en-IN") → Promise<string>  (rejects: code "cancelled" | "no_match" | "unavailable")
  //    window.DhunNative.shareImage(canvas|Blob|dataURL, text?) → Promise<true>
  var SP = P.DhunSpeech, SH = P.DhunShare;
  var blobToB64 = function (b) { return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(String(fr.result)); }; fr.onerror = rej; fr.readAsDataURL(b); }); };
  window.DhunNative = {
    voice: {
      available: function () { return SP ? SP.available().then(function (r) { return !!(r && r.ok); }).catch(function () { return false; }) : Promise.resolve(false); },
      listen: function (lang, prompt) { return SP.listen({ lang: lang || "hi-IN", prompt: prompt || "" }).then(function (r) { return (r && r.text) || ""; }); }
    },
    lyric: function (line) { if (window.__dhunLyric) window.__dhunLyric(line); },
    shareImage: function (src, text) {
      if (!SH) return Promise.reject(new Error("share unavailable"));
      var p = typeof src === "string" ? Promise.resolve(src)
        : src && src.toDataURL ? Promise.resolve(src.toDataURL("image/jpeg", 0.92)) // JPEG keeps a 1080×1920 card ~0.5–1 MB
        : blobToB64(src);
      return p.then(function (d) {
        var mime = (d.match(/^data:([^;]+);/) || [])[1] || "image/png";
        return SH.shareImage({ base64: d.slice(d.indexOf(",") + 1), mime: mime, filename: mime === "image/png" ? "dhun-story.png" : "dhun-story.jpg", text: text || "" });
      }).then(function () { return true; });
    }
  };
})();
