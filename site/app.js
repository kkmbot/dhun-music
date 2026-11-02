(() => {
"use strict";
const $ = s => document.querySelector(s);
let audio = $("#audio");
const ICON = {
  gear: '<svg viewBox="0 0 24 24"><path d="M19.4 13a7.5 7.5 0 000-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 00-1.7-1l-.4-2.6h-4l-.4 2.7a7.6 7.6 0 00-1.7 1l-2.5-1-2 3.4L4.6 11a7.5 7.5 0 000 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 001.7 1l.4 2.6h4l.4-2.7a7.6 7.6 0 001.7-1l2.5 1 2-3.4zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>',
  dl: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 3v6.6l-2.3-2.3-1.4 1.4L12 17.4l4.7-4.7-1.4-1.4-2.3 2.3V7z"/></svg>',
  dlDone: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.2l-4.1-4.1 1.4-1.4 2.7 2.7 5.5-5.5 1.4 1.4z"/></svg>',
  eq: '<svg viewBox="0 0 24 24"><path d="M5 3h2v7h2v2H3v-2h2zm2 11v7H5v-7zm4-11h2v3h2v2H9V6h2zm2 7v11h-2V10zm4-7h2v11h2v2h-6v-2h2zm2 15v3h-2v-3z"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15a1 1 0 001.5.86l12.5-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M3 6.2v11.6a.8.8 0 001.2.7L12 13.4v4.4a.8.8 0 001.2.7l8.6-5.8a.8.8 0 000-1.4L13.2 5.5a.8.8 0 00-1.2.7v4.4L4.2 5.5A.8.8 0 003 6.2z"/></svg>',
  prev: '<svg viewBox="0 0 24 24"><path d="M21 6.2v11.6a.8.8 0 01-1.2.7L12 13.4v4.4a.8.8 0 01-1.2.7l-8.6-5.8a.8.8 0 010-1.4l8.6-5.8a.8.8 0 011.2.7v4.4l7.8-5.1a.8.8 0 011.2.7z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4 7 4c2.2 0 3.6 1.3 5 3 1.4-1.7 2.8-3 5-3 4 0 6.1 4.2 4.6 7.7C19.5 16.4 12 21 12 21z"/></svg>',
  heartO: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4 7 4c2.2 0 3.6 1.3 5 3 1.4-1.7 2.8-3 5-3 4 0 6.1 4.2 4.6 7.7C19.5 16.4 12 21 12 21zm0-2.4c2.4-1.6 6.3-4.6 7.8-7.7C21 8.3 19.6 6 17 6c-1.6 0-2.7 1.1-4.2 3l-.8 1-.8-1C9.7 7.1 8.6 6 7 6 4.4 6 3 8.3 4.2 10.9c1.5 3.1 5.4 6.1 7.8 7.7z"/></svg>',
  dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  search: '<svg viewBox="0 0 24 24"><path d="M10 3a7 7 0 015.6 11.2l4.6 4.6-1.4 1.4-4.6-4.6A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24"><path d="M17 3l4 4-4 4V8h-2.6l-7 9H3v-2h3.4l7-9H17V3zm0 10l4 4-4 4v-3h-3.6l-2.2-2.8 1.3-1.6 1.9 2.4H17v-3zM3 6h4.4l2.2 2.8-1.3 1.6L6.4 8H3V6z"/></svg>',
  repeat: '<svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>',
  repeat1: '<svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><path d="M11 9.5h1.6V15H11v-3.8l-1 .4V10.3z"/></svg>',
  queue: '<svg viewBox="0 0 24 24"><path d="M3 5h13v2H3zm0 4h13v2H3zm0 4h8v2H3zm13 0v6l5-3z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/></svg>',
  playNext: '<svg viewBox="0 0 24 24"><path d="M3 5h12v2H3zm0 4h12v2H3zm0 4h7v2H3zm11-1v8l6-4z"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/></svg>',
  note: '<svg viewBox="0 0 24 24"><path d="M9 3v10.6A4 4 0 107 17V7h8V3H9z"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm1 3v5l4 2-1 1.7-5-2.7V7z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h4v2H4V5h4zm-3 6h12l-1 12H7z"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M15.4 4.6L8 12l7.4 7.4-1.4 1.4L5.2 12 14 3.2z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 2l5 5-1.4 1.4L13 5.8V15h-2V5.8L8.4 8.4 7 7zM5 11h2v8h10v-8h2v10H5z"/></svg>',
  pl: '<svg viewBox="0 0 24 24"><path d="M3 6h12v2H3zm0 4h12v2H3zm0 4h8v2H3zm14-4h2v4h4v2h-4v4h-2v-4h-4v-2h4z"/></svg>',
};

const SPICON = '<svg class="spI" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1ed760"/><path d="M17.3 16.6a.75.75 0 01-1 .25c-2.8-1.7-6.3-2.1-10.4-1.2a.75.75 0 11-.33-1.46c4.5-1 8.4-.6 11.5 1.3.35.21.46.67.24 1.1zm1.4-3.2a.94.94 0 01-1.3.31c-3.2-2-8.1-2.5-11.9-1.4a.94.94 0 11-.54-1.8c4.3-1.3 9.7-.7 13.4 1.6.44.27.58.85.31 1.3zm.13-3.3C15 7.8 8.6 7.6 5 8.7a1.13 1.13 0 11-.66-2.16C8.5 5.3 15.6 5.5 20 8.2a1.13 1.13 0 11-1.16 1.94z" fill="#000"/></svg>';
const AMICON = '<svg class="amI" viewBox="0 0 24 24"><defs><linearGradient id="amG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fa5c74"/><stop offset="1" stop-color="#fa233b"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#amG)"/><path d="M16.6 5.2l-6.7 1.4c-.3.07-.5.33-.5.64v7.5a2.3 2.3 0 00-1.2-.2c-1.2.1-2.1.9-2.1 1.9 0 1.1 1.1 1.8 2.3 1.6 1.1-.15 1.9-1 1.9-2V10l5.4-1.15v4.6a2.3 2.3 0 00-1.2-.2c-1.2.1-2.1.9-2.1 1.9 0 1.1 1.1 1.8 2.3 1.6 1.1-.15 1.9-1 1.9-2V5.8c0-.4-.37-.68-.76-.6z" fill="#fff"/></svg>';
// ---------- storage ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem("m_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("m_" + k, JSON.stringify(v)); } catch (e) {} },
};
let liked = store.get("liked", []);
let playlists = store.get("playlists", []);
let recent = store.get("recent", []);
let searches = store.get("searches", []);
// listening history / For You / Recap / import state (declared early: render functions use them on first paint)
const dayKey = (ts = Date.now()) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
let hist = (() => { const h = store.get("hist", null); return h && Array.isArray(h.songs) && h.days ? h : { songs: [], days: {} }; })();
let histDirty = false, histSyncT = 0, histBusy = false;
let histCurId = null, histCounted = false, histLastT = 0, histSecs = 0;
let fy = store.get("fyCache", null), fyLoading = false;
const svPls = {}; let svBackHome = false;
let recapPeriod = store.get("recapPeriod", "week");
const RECAP = { week: [7, "Week"], month: [30, "Month"], year: [365, "Year"] };
const cap1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const IMP_BASE = /(^|\.)tab\.bot$/.test(location.hostname) ? "" : "https://dhun.sites.tab.bot"; // the Android app has no own server
const slim = t => { const o = { id: t.id, title: t.title, artist: t.artist, album: t.album || "", dur: t.dur || 0, thumb: t.thumb }; if (t.src) o.src = t.src; if (t.url) o.url = t.url; if (t.sid) o.sid = t.sid; if (t.tg) o.tg = 1; if (t.src) o.src = t.src; return o; };
const isLiked = id => liked.some(t => t.id === id);
function toggleLike(t) {
  if (isLiked(t.id)) { liked = liked.filter(x => x.id !== t.id); toast("Removed from Liked Songs"); }
  else { liked.unshift(slim(t)); toast("Added to Liked Songs ♥"); }
  store.set("liked", liked); syncLike(); if (curTab === "library") rerender();
}
function addRecent(t) { recent = [slim(t), ...recent.filter(x => x.id !== t.id)].slice(0, 60); store.set("recent", recent); }

// ---------- utils ----------
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = s => { s = Math.max(0, Math.floor(s || 0)); const m = Math.floor(s / 60), h = Math.floor(m / 60); return h ? `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` : `${m}:${String(s % 60).padStart(2, "0")}`; };
const small = u => u ? u.replace(/=w544-h544/, "=w226-h226") : u;
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
let toastT;
function toast(msg, ms) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), ms || 2200); }
// ---- Deals (her Telegram deals channel) — small, dismissible, never blocking ----
const DEALS_JOIN_DEFAULT = "https://t.me/bestdeal_shoppingonline";
let deals = (() => { const c = store.get("dealsCache", null); return c && Array.isArray(c.items) ? c : { items: [], join: DEALS_JOIN_DEFAULT, at: 0 }; })();
let dealIdx = 0, dealTimer = 0, dealLoading = false;
async function api(path) { const r = await fetch(path); if (!r.ok) throw new Error(r.status); return r.json(); }
const trackMap = new Map(); // id -> track, for click handlers
function reg(list) { list.forEach(t => trackMap.set(t.id, t)); return list; }

// ---------- rendering helpers ----------
function rowHTML(t, i, ctx) {
  const cur = queue[qi] && queue[qi].id === t.id; const j = dlJobs.get(t.id);
  const mark = isDl(t.id) ? `<i class="dlm">${ICON.dlDone}</i>` : j ? `<i class="dlm busy">…</i>` : "";
  return `<div class="row${cur ? " playing" : ""}${!navigator.onLine ? " dim" : ""}" data-ctx="${ctx}" data-i="${i}" data-id="${esc(t.id)}"><img loading="lazy" src="${esc(artUrls.get(t.id) || small(t.thumb) || ytThumb(t.id))}" onerror="this.onerror=null;this.src='/icon-192.png'"><div class="t"><div class="t1">${esc(t.title)}</div><div class="t2">${mark}${esc([t.artist, t.album && t.album !== t.title ? t.album : ""].filter(Boolean).join(" · "))}${t.dur ? " · " + fmt(t.dur) : ""}</div></div><button class="icon more" data-more="${esc(t.id)}">${ICON.dots}</button></div>`;
}
function tileHTML(t, i, ctx) {
  return `<button class="tile" data-ctx="${ctx}" data-i="${i}" data-id="${esc(t.id)}"><img loading="lazy" src="${esc(small(t.thumb) || ytThumb(t.id))}" onerror="this.onerror=null;this.src='/icon-192.png'"><div class="t1">${esc(t.title)}</div><div class="t2">${esc(t.artist)}</div></button>`;
}
const lists = {}; // ctx -> array of tracks (for play-from-list)
function bindList(ctx, arr) { lists[ctx] = reg(arr); }
function plArtHTML(pl) {
  const imgs = pl.tracks.slice(0, 4).map(t => `<img src="${esc(small(t.thumb) || ytThumb(t.id))}">`);
  if (!imgs.length) return `<div class="plArt one"><div class="ph">${ICON.note}</div></div>`;
  if (imgs.length < 4) return `<div class="plArt one">${imgs[0]}</div>`;
  return `<div class="plArt">${imgs.join("")}</div>`;
}

// ---------- views ----------
const view = $("#view");
let curTab = "home", subView = null, searchState = { q: "", kind: "songs", items: [], loading: false };
const tabs = document.querySelectorAll("#tabs button");
tabs.forEach(b => b.onclick = () => { if (curTab === b.dataset.tab) { subView = null; view.scrollTo({ top: 0, behavior: "smooth" }); } go(b.dataset.tab); });
function go(tab, sub = null) { curTab = tab; subView = sub; tabs.forEach(b => b.classList.toggle("on", b.dataset.tab === tab)); rerender(); view.scrollTop = 0; }
function rerender() { const y = view.scrollTop; ({ home: renderHome, search: renderSearch, library: renderLibrary })[curTab](); view.scrollTop = y; }

let homeData = store.get("homeCache", null);
let homeLoading = false;
function installCard() {
  const standalone = window.navigator.standalone || matchMedia("(display-mode: standalone)").matches;
  if (standalone || store.get("hideInstall", false)) return "";
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  return `<div class="install"><button data-act="hideInstall">×</button><b>Make it an app:</b> ${ios ? "tap the Share button <b>⎋</b> in Safari, then <b>Add to Home Screen</b>." : "open your browser menu and choose <b>Add to Home Screen</b> / <b>Install app</b>."} It opens full-screen, no ads, keeps playing when you lock your phone.</div>`;
}
function renderHome() {
  let h = `<div class="brandBar"><img src="/logo-h2.webp?v=23" alt="Dhun" width="90" height="36"></div><h1 class="hrow">Listen Now<button class="icon gear" data-act="settings" aria-label="Settings">${ICON.gear}</button></h1>${installCard()}${dealsHomeHTML()}${fyHomeHTML()}`;
  if (!navigator.onLine) h += `<div class="install offline"><b>You're offline.</b> Dhun needs internet to play. Your downloaded songs are safe in Telegram.</div>`;
  if (recent.length) { bindList("recent", recent.slice(0, 20)); h += `<h2>Recently Played</h2><div class="car">${recent.slice(0, 20).map((t, i) => tileHTML(t, i, "recent")).join("")}</div>`; }
  if (homeData) {
    homeData.shelves.forEach((s, si) => { bindList("shelf" + si, s.items); h += `<h2>${esc(s.title)} <a data-q="${esc(s.query)}">See All</a></h2><div class="car">${s.items.map((t, i) => tileHTML(t, i, "shelf" + si)).join("")}</div>`; });
  } else {
    h += `<h2>Top Picks</h2><div class="car">${Array(5).fill('<div class="tile"><img class="skel"></div>').join("")}</div>`;
  }
  view.innerHTML = h;
  if (!homeLoading && (!homeData || Date.now() - (homeData.at || 0) > 6 * 3600e3)) {
    homeLoading = true;
    api("/api/home").then(d => { homeData = { ...d, at: Date.now() }; store.set("homeCache", homeData); if (curTab === "home") renderHome(); }).catch(() => {}).finally(() => homeLoading = false);
  }
}

const CHIPS = [["Bollywood", "#e0245e,#9b1b4a"], ["Arijit Singh", "#6e3bd6,#3a1f7a"], ["Punjabi", "#f0932b,#b35400"], ["Romantic", "#e84393,#8e1a5a"], ["Lofi", "#0984e3,#073a6b"], ["Old is Gold", "#b8860b,#6b4e00"], ["Bhajan", "#e17055,#8a3420"], ["Workout", "#00b894,#00634f"], ["Sad Songs", "#636e72,#2d3436"], ["English Pop", "#fd79a8,#a2325f"]];
let suggT, suggestions = [];
function renderSearch() {
  const s = searchState;
  let body = "";
  if (s.typing && suggestions.length) {
    body = `<div class="sugg">${suggestions.map(x => `<button data-sq="${esc(x)}">${ICON.search}${esc(x)}</button>`).join("")}</div>`;
  } else if (s.q) {
    body = `<div class="seg"><button data-kind="songs" class="${s.kind === "songs" ? "on" : ""}">Songs</button><button data-kind="videos" class="${s.kind === "videos" ? "on" : ""}">YouTube</button></div>`;
    if (s.loading) body += `<div class="spin"></div>`;
    else if (s.error) body += `<div class="empty">Couldn't search right now (${esc(s.error)}).<br>Check your connection and try again.</div>`;
    else if (!s.items.length) body += `<div class="empty">No results for “${esc(s.q)}”.${s.kind === "songs" ? `<br><a data-kind="videos" style="color:var(--accent,#fa2d48)">Search YouTube instead</a>` : ""}</div>`;
    else { bindList("search", s.items); body += s.items.map((t, i) => rowHTML(t, i, "search")).join(""); if (s.kind === "songs") body += `<div class="empty" style="padding:18px 16px 28px">Not the version you wanted? <a data-kind="videos" style="color:var(--accent,#fa2d48)">Search YouTube instead</a></div>`; }
  } else {
    if (searches.length) body += `<h2>Recent Searches <a data-act="clearSearches">Clear</a></h2><div class="sugg">${searches.slice(0, 6).map(x => `<button data-sq="${esc(x)}">${ICON.clock}${esc(x)}</button>`).join("")}</div>`;
    body += `<h2>Browse</h2><div class="chips">${CHIPS.map(([n, g]) => `<button class="chip" data-sq="${esc(n === "Old is Gold" ? "old hindi songs" : n + " songs")}" style="background:linear-gradient(135deg,${g})">${esc(n)}</button>`).join("")}</div>`;
  }
  const had = document.activeElement && document.activeElement.id === "q";
  const caret = had ? document.activeElement.selectionStart : null;
  view.innerHTML = `<div class="searchBar"><div class="searchBox">${ICON.search}<input id="q" type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Songs, artists, lyrics" value="${esc(s.typing ? s.typed : s.q)}"></div></div><div id="sbody">${body}</div>`;
  const q = $("#q");
  if (had) { q.focus(); try { q.setSelectionRange(caret, caret); } catch (e) {} }
  q.oninput = () => {
    s.typing = true; s.typed = q.value; clearTimeout(suggT);
    const v = q.value.trim();
    if (!v) { suggestions = []; s.typing = false; s.q = ""; return renderSearchBody(); }
    suggT = setTimeout(() => api("/api/suggest?q=" + encodeURIComponent(v)).then(d => { if (s.typing && q.value.trim() === v) { suggestions = d.items; renderSearchBody(); } }).catch(() => {}), 180);
  };
  q.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); doSearch(q.value); q.blur(); } };
}
function renderSearchBody() { // re-render without killing focus
  const q = $("#q"); const val = q ? q.value : ""; const focused = document.activeElement === q;
  renderSearch(); const q2 = $("#q"); if (q2) { q2.value = val; if (focused) q2.focus(); }
}
async function doSearch(text, kind) {
  const s = searchState; text = (text || "").trim(); if (!text) return;
  s.q = text; s.typing = false; s.kind = kind || s.kind; s.loading = true; s.error = null; suggestions = [];
  searches = [text, ...searches.filter(x => x.toLowerCase() !== text.toLowerCase())].slice(0, 10); store.set("searches", searches);
  if (curTab !== "search") go("search"); else renderSearch();
  const my = (s.token = Math.random());
  try { const d = await api(`/api/search?kind=${s.kind}&q=${encodeURIComponent(text)}`); if (my !== s.token) return; s.items = d.items || []; }
  catch (e) { if (my !== s.token) return; s.error = e.message; s.items = []; }
  s.loading = false; if (curTab === "search") renderSearch();
}

function renderLibrary() {
  if (subView === "settings") return renderSettings();
  if (subView === "recap") return renderRecap();
  if (subView) return renderPlaylistView(subView);
  const nd = Object.keys(dlIdx).length;
  let h = `<h1 class="hrow">Library<button class="icon gear" data-act="settings" aria-label="Settings">${ICON.gear}</button></h1>${acctHTML(true)}<div class="libLinks">
    <button data-open="liked">${ICON.heart}<span>Liked Songs <small class="sub">${liked.length}</small></span></button>
    <button data-open="downloads" class="tgLink">${TGICON}<span>Telegram Downloads <small class="sub">${tgMe.linked ? `${nd} song${nd === 1 ? "" : "s"}${tgMe.username ? " · @" + esc(tgMe.username) : ""}` : "Not connected"}${dlJobs.size ? ` · ${dlJobs.size} sending` : ""}</small></span></button>
    <button data-open="recent">${ICON.clock}<span>Recently Played</span></button>
    <button data-act="newPlaylist">${ICON.plus}<span>New Playlist…</span></button>
    <button data-act="importPl" class="impRow"><i class="impLogos">${SPICON}${AMICON}</i><span>Import Playlist <small class="sub">Spotify · Apple Music</small></span></button>
    <button data-act="recap" class="rcLib"><i class="rcLibI">📊</i><span>Your Recap <small class="sub">Week · Month · Year</small></span></button></div>`;
  if (playlists.length) {
    h += `<h2>Playlists</h2><div class="grid">${playlists.map(pl => `<button class="tile" data-open="${esc(pl.id)}">${plArtHTML(pl)}<div class="t1">${esc(pl.name)}</div><div class="t2">${pl.tracks.length} song${pl.tracks.length === 1 ? "" : "s"}</div></button>`).join("")}</div>`;
  }
  h += dealsJoinHTML() + footHTML();
  view.innerHTML = h;
}
function dlTracks() { return Object.values(dlIdx).sort((a, b) => b.at - a.at).map(x => x.t); }
function getPlaylist(id) { if (String(id).startsWith("sv:")) return svPlGet(String(id).slice(3)); if (id === "downloads") return { id, name: "Telegram Downloads", tracks: dlTracks(), fixed: true, dl: true }; if (id === "liked") return { id, name: "Liked Songs", tracks: liked, fixed: true }; if (id === "recent") return { id, name: "Recently Played", tracks: recent, fixed: true }; return playlists.find(p => p.id === id); }
function renderPlaylistView(id) {
  const pl = getPlaylist(id); if (!pl) { subView = null; return renderLibrary(); }
  bindList("pl:" + id, pl.tracks);
  view.innerHTML = `<button class="back" data-act="back">${ICON.chev}${pl.remote && svBackHome ? "Listen Now" : "Library"}</button>
  <div class="hero">${plArtHTML(pl)}<h3>${esc(pl.name)}</h3><div class="sub">${pl.tracks.length} song${pl.tracks.length === 1 ? "" : "s"}</div></div>
  ${pl.tracks.length ? `<div class="btnRow"><button data-act="plPlay">${ICON.play}Play</button><button data-act="plShuffle">${ICON.shuffle}Shuffle</button></div>` : ""}
  ${pl.dl ? dlInfoHTML() : pl.tracks.length && id !== "recent" ? dlAllHTML(pl.tracks) : ""}
  ${pl.tracks.map((t, i) => rowHTML(t, i, "pl:" + id)).join("") || (pl.dl ? `<div class="empty">${tgMe.linked ? "Nothing here yet. Tap “···” on a song and choose Download to Telegram, or use Download All on Liked Songs or a playlist." : ""}</div>` : `<div class="empty">No songs yet. Tap “···” on any song and choose Add to Playlist.</div>`)}
  ${pl.dl && tgMe.linked ? `<div class="btnRow" style="margin-top:20px"><button data-act="tgOff" style="color:#ff453a">Log out</button></div>` : ""}
  ${pl.remote ? (pl.tracks.length ? `<div class="btnRow" style="margin-top:20px"><button data-act="savePl">${ICON.plus}Add to Library</button></div>` : pl.loading ? `<div class="empty">Loading…</div>` : "") : pl.fixed ? "" : `<div class="btnRow" style="margin-top:20px"><button data-act="renamePl">Rename</button><button data-act="deletePl" style="color:#ff453a">Delete Playlist</button></div>`}`;
}


function dlAllHTML(tracks) {
  const can = tracks.filter(t => !isYT(t)); const done = can.filter(t => isDl(t.id)).length; const busy = can.filter(t => dlJobs.has(t.id)).length;
  if (!can.length) return "";
  const label = done === can.length ? `${ICON.dlDone}All in Telegram` : busy ? `${TGICON}Sending ${done}/${can.length}…` : `${TGICON}Download All to Telegram${done ? ` (${can.length - done} left)` : ""}`;
  return `<div class="btnRow" style="margin-top:0"><button data-act="dlAll" class="${done === can.length ? "done" : ""}">${label}</button></div>`;
}
function dlInfoHTML() {
  if (!tgMe.linked) return `<div class="setNote tgNote" style="margin:0 20px 12px">Downloads go to <b>your own Telegram</b> (chat with @${esc(tgBot)}), not your phone storage.<div class="btnRow" style="padding:12px 0 0;margin:0"><button data-act="tgConnect" class="tgB">${TGICON}Connect Telegram</button></div></div>`;
  const n = Object.keys(dlIdx).length;
  return `<div class="setNote tgNote" style="margin:0 20px 12px">Connected${tgMe.username ? ` as <b>@${esc(tgMe.username)}</b>` : ""} ✅ · ${n} song${n === 1 ? "" : "s"}${dlJobs.size ? ` · ${dlJobs.size} sending` : ""}<br>Songs are saved in your Telegram chat with @${esc(tgBot)}, <b>not on this phone</b>. Tap a song here to play it from Telegram (needs internet).<div class="btnRow" style="padding:12px 0 0;margin:0"><a class="tgB" href="https://t.me/${esc(tgBot)}" target="_blank" rel="noopener">${TGICON}Open in Telegram</a></div></div>`;
}
function segHTML(k, opts) { return `<div class="seg">${opts.map(v => `<button data-act="q" data-k="${k}" data-v="${v}" class="${cfg[k] === v ? "on" : ""}">${QNAME[v]}<small>${v}</small></button>`).join("")}</div>`; }
function footHTML() {
  return `<div class="dhunFoot"><img src="/dhun-mark.webp?v=16" alt="Dhun" width="30" height="30"><div class="f0">Created with</div><div class="f1">Support &amp; Love</div><div class="sig">Mavi💖</div><a class="contactPill" href="https://t.me/Memer_guru" target="_blank" rel="noopener">${TGICON}<span>Contact us</span></a></div>`;
}
function renderSettings() {
  const auto = autoNet(), c = conn(), cell = netKind() === "cell";
  const n = Object.keys(dlIdx).length, bytes = Object.values(dlIdx).reduce((a, x) => a + (x.bytes || 0), 0);
  view.innerHTML = `<button class="back" data-act="back">${ICON.chev}Library</button><h1>Settings</h1>
  <h2>Account</h2>
  ${acctHTML(false)}
  <h2>Streaming quality</h2>
  <div class="setCard">
    <div class="setLbl">On Wi‑Fi</div>${segHTML("qWifi", ["320", "160", "96"])}
    <div class="setLbl">On mobile data</div>${segHTML("qCell", ["320", "160", "96", "48"])}
    <button class="setRow" data-act="saver"><span><b>Data saver mode</b><small>Use the mobile data quality right now</small></span><i class="sw${cfg.saver ? " on" : ""}"></i></button>
    <div class="setNote">${auto ? `Your browser says you're on <b>${c.type === "cellular" ? "mobile data" : "Wi‑Fi"}</b>, so quality switches automatically.` : `iPhone doesn't tell websites if you're on Wi‑Fi or mobile data, so <b>turn on Data saver when you leave Wi‑Fi</b>. Quick switch: tap the quality badge under the progress bar on the Now Playing screen.`}<br>Playing now at: <b>${cell ? "Data saver" : "Wi‑Fi"} · ${curQ()} kbps</b></div>
  </div>
  <h2>Download to Telegram</h2>
  <div class="setCard">${segHTML("qDl", ["320", "160", "96"])}<div class="setNote">About ${cfg.qDl === "320" ? "10" : cfg.qDl === "160" ? "5" : "3"} MB for a 4-minute song, stored in Telegram, not on your phone.</div>
    <button class="setRow" data-act="${tgMe.linked ? "tgOpen" : "tgConnect"}"><span><b>Telegram</b><small>${tgMe.linked ? `Connected${tgMe.username ? " · @" + esc(tgMe.username) : ""} ✅` : "Not connected · tap to connect"}</small></span>${TGICON}</button></div>
  <h2>AutoMix</h2>
  <div class="setCard"><button class="setRow" data-act="automix"><span><b>AutoMix 🎚️</b><small>Gaane ek dusre me mix hote hain, Apple Music jaise. Kitna mix, Dhun har gaane ke hisaab se khud decide karta hai</small></span><i class="sw${cfg.automix !== false ? " on" : ""}"></i></button>${mixVolOK ? "" : `<div class="setNote">iPhone browser me AutoMix nahi chal sakta (Safari volume change nahi karne deta) — gaane normal tarike se badlenge.</div>`}<div class="setNote">Listen Together me AutoMix band rehta hai, taaki sabka gaana ek saath chale.</div></div>
  <h2>Equalizer</h2>
  <div class="setCard">
    <button class="setRow" data-act="eqToggle"><span><b>Equalizer</b><small>${eqOn ? eqPreset : "Off"}</small></span><i class="sw${eqOn ? " on" : ""}"></i></button>
    <div class="setNote warn">⚠️ On iPhone, the equalizer can make music stop when you lock the screen or switch apps. Keep it <b>off</b> for background listening.</div>
    <div class="pchips">${Object.keys(EQP).map(p => `<button class="pchip${eqOn && eqPreset === p ? " on" : ""}" data-act="preset" data-p="${esc(p)}">${esc(p)}</button>`).join("")}${eqPreset === "Custom" ? `<button class="pchip on">Custom</button>` : ""}</div>
    <canvas id="eqCanvas"></canvas>
    <div class="bands${eqOn ? "" : " off"}">${EQF.map((f, i) => `<div class="band"><span>${f >= 1000 ? f / 1000 + "k" : f}</span><input type="range" min="-12" max="12" step="1" value="${eqGains[i]}" data-band="${i}"><b id="bv${i}">${eqGains[i] > 0 ? "+" : ""}${eqGains[i]}</b></div>`).join("")}</div>
    <div class="btnRow" style="padding:6px 0 4px;margin:0"><button data-act="eqReset">Reset to Flat</button></div>
  </div>
  <div class="libLinks" style="margin-top:18px"><button data-open="downloads" class="tgLink">${TGICON}<span>Telegram Downloads <small class="sub">${n} songs</small></span></button><a class="dealRow" href="${esc(deals.join || DEALS_JOIN_DEFAULT)}" target="_blank" rel="noopener"><i class="dealEmoji">🛍️</i><span>Join Deals channel <small class="sub">Daily deals</small></span></a></div>
  ${footHTML()}<div class="verTag">v1.0.3 · web</div>`;
  requestAnimationFrame(drawEq);
}
view.addEventListener("input", e => {
  const r = e.target.closest("[data-band]"); if (!r) return;
  const i = +r.dataset.band; eqGains[i] = +r.value; eqPreset = "Custom";
  const b = $("#bv" + i); if (b) b.textContent = (eqGains[i] > 0 ? "+" : "") + eqGains[i];
  if (!eqOn) { setEq(true); } eqApply(); drawEq();
  document.querySelectorAll(".bands").forEach(x => x.classList.remove("off"));
});
view.addEventListener("change", e => { if (e.target.closest("[data-band]")) { store.set("eqGains", eqGains); store.set("eqPreset", eqPreset); if (curTab === "library" && subView === "settings") { const y = view.scrollTop; rerender(); view.scrollTop = y; } } });

// ---------- delegated clicks ----------
view.addEventListener("click", e => {
  const more = e.target.closest("[data-more]");
  if (more) { e.stopPropagation(); const row = more.closest("[data-ctx]"); return openTrackSheet(trackMap.get(more.dataset.more), row && row.dataset.ctx, row && +row.dataset.i); }
  const sq = e.target.closest("[data-sq]"); if (sq) return doSearch(sq.dataset.sq);
  const kind = e.target.closest("[data-kind]"); if (kind) return doSearch(searchState.q, kind.dataset.kind);
  const qa = e.target.closest("a[data-q]"); if (qa) return doSearch(qa.dataset.q);
  const open = e.target.closest("[data-open]"); if (open) return go("library", open.dataset.open);
  const act = e.target.closest("[data-act]");
  if (act) {
    const a = act.dataset.act;
    if (a === "hideInstall") { store.set("hideInstall", true); return rerender(); }
    if (a === "clearSearches") { searches = []; store.set("searches", searches); return rerender(); }
    if (a === "newPlaylist") return newPlaylist();
    if (a === "back") { subView = null; return rerender(); }
    if (a === "settings") return go("library", "settings");
    if (a === "dlAll") { const p = subView && getPlaylist(subView); if (p) downloadAll(p.tracks); return; }
    if (a === "tgConnect") return tgConnectSheet();
    if (a === "acctConnect") return tgConnectSheet("Sign in to save your likes, playlists & history to your own account, on any phone");
    if (a === "syncNow") { syncPull(true).then(() => toast(syncErr ? "Couldn't sync, check internet" : "Synced ✅")); acctUi(); return; }
    if (a === "tgOpen") { window.open(`https://t.me/${tgBot}`, "_blank"); return; }
    if (a === "tgOff") { if (confirm("Log out of your Dhun account on this phone? Your likes, playlists and Telegram songs stay saved in your account — connect again to get them back.")) tgDisconnect(); return; }
    if (a === "rmDl") return removeDl(act.dataset.id);
    if (a === "eqToggle") { setEq(!eqOn); return rerender(); }
    if (a === "automix") { cfg.automix = cfg.automix === false; saveCfg(); if (cfg.automix === false) mixAbort(); toast(cfg.automix ? "AutoMix on 🎚️" : "AutoMix off"); return rerender(); }
    if (a === "saver") return setSaver(!cfg.saver);
    if (a === "preset") { if (!eqOn) setEq(true); setPreset(act.dataset.p); return rerender(); }
    if (a === "eqReset") { setPreset("Flat"); return rerender(); }
    if (a === "q") { cfg[act.dataset.k] = act.dataset.v; saveCfg(); applyQualityNow(); return rerender(); }
    const pl = subView && getPlaylist(subView);
    if (a === "plPlay" && pl) return playList(pl.tracks, 0);
    if (a === "plShuffle" && pl) { shuffle = true; syncModes(); return playList(shuffled(pl.tracks), 0); }
    if (a === "renamePl" && pl) { const n = prompt("Playlist name", pl.name); if (n && n.trim()) { pl.name = n.trim(); store.set("playlists", playlists); rerender(); } return; }
    if (a === "deletePl" && pl) { if (confirm(`Delete “${pl.name}”?`)) { playlists = playlists.filter(p => p.id !== pl.id); store.set("playlists", playlists); subView = null; rerender(); } return; }
  }
  const item = e.target.closest("[data-ctx]");
  if (item) { const list = lists[item.dataset.ctx]; if (list) { if (item.dataset.ctx === "search" && list[+item.dataset.i]) return playList([list[+item.dataset.i]], 0); playList(list, +item.dataset.i); } } // a song from search plays, then similar songs (autoplay) — not the other search results, which are mostly other copies of the same song
});
function newPlaylist(thenAdd) {
  const n = prompt("New playlist name", "My Playlist"); if (!n || !n.trim()) return null;
  const pl = { id: "p" + Date.now().toString(36), name: n.trim(), tracks: [] };
  if (thenAdd) pl.tracks.push(slim(thenAdd));
  playlists.unshift(pl); store.set("playlists", playlists);
  toast(thenAdd ? `Added to “${pl.name}”` : `Created “${pl.name}”`); if (curTab === "library") rerender(); return pl;
}

// ---------- sheets ----------
const sheet = $("#sheet"), sheetBack = $("#sheetBack");
function closeSheet() { sheet.classList.add("hidden"); sheetBack.classList.add("hidden"); }
sheetBack.onclick = closeSheet;
function showSheet(html, handlers) {
  sheet.innerHTML = html + `<div class="sgroup cancel"><button data-s="cancel">Cancel</button></div>`;
  sheet.classList.remove("hidden"); sheetBack.classList.remove("hidden");
  sheet.onclick = e => { const b = e.target.closest("[data-s]"); if (!b) return; const k = b.dataset.s; if (k === "cancel") return closeSheet(); const keep = handlers[k] && handlers[k](b); if (!keep) closeSheet(); };
}
function openTrackSheet(t, ctx, idx) {
  if (!t) return;
  const inPl = ctx && ctx.startsWith("pl:p") ? getPlaylist(ctx.slice(3)) : null;
  showSheet(`<div class="sgroup"><div class="shead"><img src="${esc(small(t.thumb) || ytThumb(t.id))}"><div><div class="t1">${esc(t.title)}</div><div class="sub">${esc(t.artist)}</div></div></div>
    <button data-s="next">Play Next ${ICON.playNext}</button>
    <button data-s="last">Play Last ${ICON.queue}</button>
    <button data-s="radio">📻 Radio shuru karo ${ICON.note}</button>
    ${isYT(t) && np.classList.contains("open") ? `<button data-s="lyr">🎤 Lyrics ${ICON.note}</button>` : ""}
    ${t.artist && !isYT(t) ? `<button data-s="artist">Artist dekho: ${esc(String(t.artist).split(/,|&| x /).map(x => x.trim()).filter(Boolean).slice(0, 2).join(", "))} ${typeof PERSON_ICON === "string" ? PERSON_ICON : ""}</button>` : ""}
    ${t.src === "saavn" ? `<button data-s="album">Album dekho${t.album ? ": " + esc(t.album) : ""} ${typeof DISC_ICON === "string" ? DISC_ICON : ""}</button>` : ""}
    <button data-s="like">${isLiked(t.id) ? "Unlike" : "Love"} ${isLiked(t.id) ? ICON.heart : ICON.heartO}</button>
    <button data-s="addpl">Add to Playlist… ${ICON.pl}</button>
    ${isYT(t) ? "" : isDl(t.id) ? `<button data-s="undl" class="danger">Remove from Telegram ${ICON.trash}</button>` : dlJobs.has(t.id) ? `<button data-s="noop">Sending to Telegram… ${TGICON}</button>` : `<button data-s="dl">Download to Telegram ${TGICON}</button>`}
    <button data-s="share">Share Song ${ICON.share}</button>
    ${inPl ? `<button data-s="rm" class="danger">Remove from Playlist ${ICON.trash}</button>` : ""}
    ${ctx === "pl:recent" ? `<button data-s="rmr" class="danger">Remove from Recently Played ${ICON.trash}</button>` : ""}</div>`, {
    next: () => { addToQueue(t, true); },
    last: () => { addToQueue(t, false); },
    radio: () => { startRadio(t); },
    lyr: () => { lyrToggle(true); },
    artist: () => { closeNP(); collOpenArtist(t.artist); },
    album: () => { closeNP(); collOpen("als:" + t.id); },
    dl: () => download(t), undl: () => removeDl(t.id), noop: () => {},
    like: () => toggleLike(t),
    addpl: () => { setTimeout(() => openAddToPlaylist(t), 50); },
    share: () => { const url = isYT(t) || isLegacy(t) ? "https://music.youtube.com/watch?v=" + t.id : "https://www.jiosaavn.com/search/song/" + encodeURIComponent(t.title + " " + t.artist); if (navigator.share) navigator.share({ title: t.title, text: `${t.title} — ${t.artist}`, url }).catch(() => {}); else { navigator.clipboard && navigator.clipboard.writeText(url); toast("Link copied"); } },
    rm: () => { inPl.tracks.splice(idx, 1); store.set("playlists", playlists); rerender(); toast("Removed"); },
    rmr: () => { recent.splice(idx, 1); store.set("recent", recent); rerender(); },
  });
}
function openAddToPlaylist(t) {
  showSheet(`<div class="sgroup"><div class="shead"><div class="t1">Add to Playlist</div></div><button data-s="new">New Playlist… ${ICON.plus}</button>${playlists.map(p => `<button data-s="p" data-id="${esc(p.id)}">${esc(p.name)} <span class="sub">${p.tracks.length}</span></button>`).join("")}</div>`, {
    new: () => { newPlaylist(t); },
    p: b => { const pl = playlists.find(p => p.id === b.dataset.id); if (!pl) return; if (pl.tracks.some(x => x.id === t.id)) toast(`Already in “${pl.name}”`); else { pl.tracks.push(slim(t)); store.set("playlists", playlists); toast(`Added to “${pl.name}”`); } if (curTab === "library") rerender(); },
  });
}

// ---------- player ----------
let queue = store.get("queue", []), qi = store.get("qi", 0), shuffle = store.get("shuffle", false), repeat = store.get("repeat", 0); // 0 off,1 all,2 one
let autoplayAdded = new Set();
let mode = "audio"; // or "yt"
let ytPlayer = null, ytReady = false, ytTimer = null;
let loadToken = 0, stallTimer = null, userPaused = false;
// Resolved JioSaavn audio for library entries saved by the old YouTube version (keeps their ids so likes/playlists stay intact)
let resolved = store.get("resolved", {}); // oldId -> { url, sid } | { none: ts }

// ---------- settings: quality ----------
const cfg = Object.assign({ qWifi: "320", qCell: "96", qDl: "320", saver: false, automix: true }, store.get("cfg", {}));
const saveCfg = () => store.set("cfg", cfg);
const QNAME = { "320": "High", "160": "Normal", "96": "Data saver", "48": "Lowest" };
const conn = () => navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
const autoNet = () => { const c = conn(); return !!(c && c.type && c.type !== "unknown" && c.type !== "other"); };
function netKind() { if (cfg.saver) return "cell"; const c = conn(); if (c && (c.type === "cellular" || c.saveData)) return "cell"; return "wifi"; }
const curQ = () => netKind() === "cell" ? cfg.qCell : cfg.qWifi;
function withQ(u, q) { if (!u || !/saavncdn\.com/.test(u)) return u; if (q === "320" && /_160\.mp4/.test(u) && !/_320/.test(u)) q = "160"; return u.replace(/_(320|160|96|48|12)\.mp4/, `_${q}.mp4`); }
const kbpsOf = u => { const m = /_(320|160|96|48|12)\.mp4/.exec(u || ""); return m ? m[1] : ""; };

// ---------- downloads = Telegram (song goes to the user's own chat with the Dhun bot; nothing stored on the phone) ----------
try { localStorage.removeItem("m_dl"); if (window.indexedDB) indexedDB.deleteDatabase("dhun"); } catch (e) {} // clear the old on-phone downloads
let tgCode = store.get("tgCode", ""), tgMe = store.get("tgMe", { linked: false }), tgBot = "Musicxrg_bot";
let dlIdx = store.get("tgList", {}); // id -> { t, q, bytes, at }  (mirror of the server's list, for instant display)
const saveDl = () => store.set("tgList", dlIdx);
const dlJobs = new Map(); let dlWait = [], dlActive = 0, dlBatch = null, tgPending = [];
const blobUrls = new Map(), artUrls = new Map();
const isDl = id => !!dlIdx[id];
const mb = b => b >= 1e9 ? (b / 1e9).toFixed(2) + " GB" : (b / 1e6).toFixed(1) + " MB";
const tgUrl = id => `/api/tg/stream?c=${encodeURIComponent(tgCode)}&id=${encodeURIComponent(id)}`;
const TGICON = '<svg viewBox="0 0 24 24"><path d="M21.9 4.3l-3.2 15.1c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.6.2 1.4 1.5z"/></svg>';
async function post(path, body) { const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) }); let j = {}; try { j = await r.json(); } catch (e) {} j.status = r.status; return j; }
function tgItem(x) { return { t: { id: x.id, sid: x.sid, src: "saavn", tg: true, title: x.title, artist: x.artist, album: x.album, dur: x.dur, thumb: x.thumb }, q: x.q, bytes: x.bytes, at: x.at }; }
async function tgRefresh(silent) {
  if (!tgCode) return false;
  try {
    const me = await api("/api/tg/me?c=" + encodeURIComponent(tgCode)); tgBot = me.bot || tgBot;
    if (!me.known) { tgCode = ""; store.set("tgCode", ""); }
    const was = tgMe.linked; tgMe = { linked: me.linked, username: me.username, name: me.name, first: me.first || "", uid: me.uid || "" }; store.set("tgMe", tgMe);
    if (me.linked) { const l = await api("/api/tg/mine?c=" + encodeURIComponent(tgCode)); dlIdx = {}; (l.items || []).forEach(x => dlIdx[x.id] = tgItem(x)); saveDl(); syncPull(); }
    if (!silent || was !== me.linked) dlUi();
    return me.linked;
  } catch (e) { return tgMe.linked; }
}
let tgPoll = 0;
async function tgConnectSheet(why) {
  if (!tgCode) { try { const r = await post("/api/tg/new"); if (!r.code) throw 0; tgCode = r.code; tgBot = r.bot || tgBot; store.set("tgCode", tgCode); syncInit = false; store.set("syncInit", false); } catch (e) { return toast("Couldn't reach the server, try again"); } }
  const link = `https://t.me/${tgBot}?start=${tgCode}`;
  await new Promise(r => setTimeout(r, 60));
  showSheet(`<div class="sgroup tgc"><div class="shead"><div class="tgPair"><img class="dm" src="/dhun-mark.webp?v=16" alt="Dhun"><span class="x">⇄</span><div class="tgLogo">${TGICON}</div></div><div><div class="t1">Connect Telegram</div><div class="sub">${esc(why || "Your own account: likes, playlists & history saved on any phone. Downloads go to your Telegram, not phone storage")}</div></div></div>
    <div class="tgSteps">1. Tap <b>Open Telegram</b><br>2. Tap <b>Start</b> in the bot chat<br>3. Come back here — your library syncs and downloads start on their own</div>
    <a class="tgBtn" href="${esc(link)}" target="_blank" rel="noopener">${TGICON}Open Telegram</a>
    <button data-s="check">I've tapped Start ✓</button></div>`, { check: async () => { const ok = await tgRefresh(); if (ok) tgLinked(); else setTimeout(() => tgConnectSheet("Not connected yet — open Telegram and tap Start"), 60); } });
  clearInterval(tgPoll); let n = 0;
  tgPoll = setInterval(async () => { if (++n > 60) return clearInterval(tgPoll); if (document.hidden) return; if (await tgRefresh(true)) { clearInterval(tgPoll); tgLinked(); } }, 3000);
}
function tgLinked() {
  clearInterval(tgPoll); try { closeSheet(); } catch (e) {}
  toast(`Telegram connected ✅${tgMe.username ? " @" + tgMe.username : ""}`); syncPull(true);
  const p = tgPending; tgPending = []; if (p.length === 1) download(p[0]); else if (p.length) downloadAll(p);
  dlUi();
}
document.addEventListener("visibilitychange", () => { if (!document.hidden && tgMe.linked) syncPull(); else if (document.hidden && Object.keys(syncDirty).length) syncPush(); if (!document.hidden && tgCode && (!tgMe.linked || tgPoll)) tgRefresh(true).then(ok => { if (ok && tgPending.length) tgLinked(); }); });
function download(t, quiet) {
  if (!t) return;
  if (isYT(t)) { if (!quiet) toast("This one is from YouTube, it can't be downloaded"); return; }
  if (!tgMe.linked) { if (!tgPending.some(x => x.id === t.id)) tgPending.push(t); if (!quiet) tgConnectSheet(); return; }
  if (isDl(t.id)) { if (!quiet) toast("Already in your Telegram ✓"); return; }
  if (dlJobs.has(t.id)) return;
  if (!navigator.onLine) { if (!quiet) toast("You're offline"); return; }
  dlJobs.set(t.id, { p: 0, t: slim(t) }); dlWait.push(t); pumpDl();
  if (!quiet) toast(`Sending “${t.title}” to Telegram…`);
  dlUi();
}
function downloadAll(list) {
  const todo = list.filter(t => !isYT(t) && !isDl(t.id) && !dlJobs.has(t.id));
  if (!tgMe.linked) { tgPending = todo; return tgConnectSheet(); }
  if (!todo.length) return toast("All already in your Telegram ✓");
  dlBatch = { n: todo.length, ok: 0, fail: 0 };
  todo.forEach(t => download(t, true)); toast(`Sending ${todo.length} song${todo.length > 1 ? "s" : ""} to Telegram…`);
}
function pumpDl() {
  while (dlActive < 2 && dlWait.length) {
    const t = dlWait.shift(); dlActive++;
    doDl(t).then(r => {
      if (dlBatch) { dlBatch.ok++; } else toast(r === "already" ? "Already in your Telegram ✓" : "Telegram pe bhej diya ✅");
    }).catch(e => {
      dlJobs.delete(t.id);
      if (e.message === "not_linked") { tgMe.linked = false; store.set("tgMe", tgMe); tgPending.push(t, ...dlWait.splice(0)); dlJobs.clear(); dlBatch = null; return tgConnectSheet("Telegram se connection toot gaya, dobara connect karo"); }
      if (dlBatch) dlBatch.fail++; else toast(e.message && e.message.length < 90 ? e.message : `Couldn't send “${t.title}”`);
    }).finally(() => {
      dlActive--;
      if (dlBatch && dlBatch.ok + dlBatch.fail >= dlBatch.n) { toast(dlBatch.fail ? `${dlBatch.ok} sent to Telegram ✅ · ${dlBatch.fail} failed` : `${dlBatch.ok} songs Telegram pe bhej diye ✅`); dlBatch = null; }
      dlUi(); pumpDl();
    });
  }
}
async function doDl(t) {
  let sid = t.sid || (t.src === "saavn" ? t.id : resolved[t.id] && resolved[t.id].sid);
  if (!sid) { await resolveTrack(t); sid = resolved[t.id] && resolved[t.id].sid; }
  if (!sid) throw new Error(`“${t.title}” isn't on JioSaavn, can't send it`);
  const r = await post("/api/tg/dl", { c: tgCode, id: t.id, sid, q: cfg.qDl });
  if (r.status === 401) throw new Error("not_linked");
  if (!r.ok) throw new Error(r.error || "Couldn't send it");
  dlIdx[t.id] = tgItem({ ...r.item, thumb: r.item.thumb || t.thumb }); saveDl(); dlJobs.delete(t.id);
  return r.already ? "already" : "sent";
}
async function removeDl(id) {
  const d = dlIdx[id]; delete dlIdx[id]; saveDl(); dlUi();
  try { const r = await post("/api/tg/rm", { c: tgCode, id }); toast(r.tgDeleted ? "Removed (Telegram chat se bhi)" : "Removed from Dhun"); } catch (e) { if (d) { dlIdx[id] = d; saveDl(); dlUi(); } toast("Couldn't remove, check internet"); }
}
async function tgDisconnect() {
  if (tgMe.linked && Object.keys(syncDirty).length) { try { await syncPush(); } catch (e) {} }
  try { await post("/api/tg/unlink", { c: tgCode }); } catch (e) {}
  tgCode = ""; tgMe = { linked: false }; dlIdx = {}; store.set("tgCode", ""); store.set("tgMe", tgMe); saveDl();
  // this phone forgets the account's library; it stays saved in the account and comes back on the next connect
  syncApplying = true; liked = []; playlists = []; recent = []; store.set("liked", liked); store.set("playlists", playlists); store.set("recent", recent); syncApplying = false;
  try { hist = { songs: [], days: {} }; store.set("hist", hist); fy = null; store.set("fyCache", null); } catch (e) {}
  syncInit = false; syncDirty = {}; syncAt = 0; store.set("syncInit", false); store.set("syncDirty", syncDirty); store.set("syncAt", 0);
  dlUi(); syncLike(); toast("Logged out. Your library is safe in your account");
}
// ---------- account sync: likes, playlists, recently played live in the user's server account once Telegram is connected ----------
const SYNC_KEYS = ["liked", "playlists", "recent"];
let syncDirty = store.get("syncDirty", {}), syncInit = store.get("syncInit", false), syncAt = store.get("syncAt", 0), syncRev = store.get("syncRev", -1);
let syncApplying = false, syncT = 0, syncBusy = null, syncPullAt = 0, syncErr = "";
const syncVal = k => k === "liked" ? liked : k === "playlists" ? playlists : recent;
{ const raw = store.set.bind(store); store.set = (k, v) => { raw(k, v); if (SYNC_KEYS.includes(k) && !syncApplying && tgMe.linked && syncInit) { syncDirty[k] = 1; raw("syncDirty", syncDirty); clearTimeout(syncT); syncT = setTimeout(syncPush, 1200); } }; }
const byId = arr => { const seen = new Set(); return (arr || []).filter(t => t && t.id && !seen.has(t.id) && seen.add(t.id)); };
function mergePls(local, remote) {
  const out = (remote || []).map(p => ({ ...p, tracks: [...(p.tracks || [])] }));
  for (const p of local || []) {
    const m = out.find(x => x.id === p.id) || out.find(x => (x.name || "").trim().toLowerCase() === (p.name || "").trim().toLowerCase());
    if (m) m.tracks = byId([...m.tracks, ...(p.tracks || [])]); else out.push({ ...p, tracks: [...(p.tracks || [])] });
  }
  return out;
}
function syncPush() {
  if (syncBusy) return syncBusy.then(() => Object.keys(syncDirty).length ? syncPush() : null);
  const keys = Object.keys(syncDirty); if (!keys.length || !tgMe.linked || !tgCode) return Promise.resolve();
  const body = { op: "put", c: tgCode }; keys.forEach(k => body[k] = syncVal(k));
  syncDirty = {}; store.set("syncDirty", syncDirty);
  syncBusy = post("/api/u/data", body).then(r => {
    if (r.ok) { syncRev = r.rev; syncAt = Date.now(); syncErr = ""; store.set("syncRev", syncRev); store.set("syncAt", syncAt); }
    else { keys.forEach(k => syncDirty[k] = 1); store.set("syncDirty", syncDirty); syncErr = r.status === 401 ? "not_linked" : (r.error || "sync failed"); if (r.status === 401) { tgMe.linked = false; store.set("tgMe", tgMe); } }
  }).catch(() => { keys.forEach(k => syncDirty[k] = 1); store.set("syncDirty", syncDirty); syncErr = "offline"; })
    .finally(() => { syncBusy = null; acctUi(); });
  return syncBusy;
}
async function syncPull(force) {
  if (!tgMe.linked || !tgCode) return;
  if (!force && Date.now() - syncPullAt < 15000) return; syncPullAt = Date.now();
  if (syncInit && Object.keys(syncDirty).length) await syncPush();
  let r; try { r = await post("/api/u/data", { op: "get", c: tgCode }); } catch (e) { syncErr = "offline"; return acctUi(); }
  if (r.status === 401) { tgMe.linked = false; store.set("tgMe", tgMe); syncErr = "not_linked"; return acctUi(); }
  if (!r.ok) return;
  const had = (r.liked || []).length + (r.playlists || []).length + (r.recent || []).length;
  syncApplying = true;
  if (!syncInit) { // first connect on this phone: merge what was saved here into the account
    liked = byId([...liked, ...(r.liked || [])]); playlists = mergePls(playlists, r.playlists); recent = byId([...recent, ...(r.recent || [])]).slice(0, 60);
  } else if (r.rev !== syncRev) { liked = byId(r.liked); playlists = r.playlists || []; recent = byId(r.recent).slice(0, 60); }
  store.set("liked", liked); store.set("playlists", playlists); store.set("recent", recent); syncApplying = false;
  syncRev = r.rev; store.set("syncRev", syncRev);
  if (!syncInit) {
    syncInit = true; store.set("syncInit", true); syncDirty = { liked: 1, playlists: 1, recent: 1 }; store.set("syncDirty", syncDirty); await syncPush();
    if (had) toast("Your library is back ✅ (likes, playlists, history)");
  }
  syncAt = Date.now(); syncErr = ""; store.set("syncAt", syncAt);
  syncLike(); acctUi();
}
function acctUi() { if (curTab === "library" && (!subView || subView === "settings")) { const y = view.scrollTop; rerender(); view.scrollTop = y; } }
const ago = ms => { const s = (Date.now() - ms) / 1000; return s < 60 ? "just now" : s < 3600 ? Math.floor(s / 60) + " min ago" : s < 86400 ? Math.floor(s / 3600) + " h ago" : Math.floor(s / 86400) + " d ago"; };
// a Telegram name with no letters or digits (e.g. ".. ..") reads as nothing; show "Telegram user" instead
const realName = s => { s = String(s || "").trim(); return /[\p{L}\p{N}]/u.test(s) ? s : ""; };
function tgNames(m) { m = m || {}; const first = realName(m.first) || realName(String(m.name || "").split(/\s+/)[0]) || realName(m.name) || "Telegram user"; return { first }; }
function acctHTML(compact) {
  if (!tgMe.linked) return compact
    ? `<div class="acct off"><div class="acctTxt"><b>Sign in with Telegram</b><small>Save your likes & playlists to your own account, get them back on any phone</small></div><button data-act="acctConnect" class="tgB">${TGICON}Connect</button></div>`
    : `<div class="setCard acctCard"><div class="acctHead"><div class="tgPair"><img class="dm" src="/dhun-mark.webp?v=16" alt="Dhun"><div class="tgLogo">${TGICON}</div></div><div><b>Not signed in</b><small>Connect Telegram to get your own account: likes, playlists, recently played and downloads are saved to it and come back on any phone.</small></div></div><div class="btnRow" style="padding:12px 0 2px;margin:0"><button data-act="acctConnect" class="tgB">${TGICON}Connect Telegram</button></div><div class="setNote">Until you connect, everything stays only on this phone.</div></div>`;
  const nm = tgNames(tgMe), who = esc(nm.first), handle = tgMe.username ? "@" + esc(tgMe.username) : (tgMe.uid ? "ID " + esc(tgMe.uid) : "");
  const st = syncBusy ? "Syncing…" : Object.keys(syncDirty).length ? (syncErr === "offline" ? "Offline, will sync later" : "Saving…") : syncAt ? `Synced ${ago(syncAt)}` : "Syncing…";
  if (compact) return `<button class="acct on" data-act="settings"><div class="acctTxt"><b>☁️ ${who}${handle ? ` <span class="acctAt">${handle}</span>` : ""}</b><small>${st} · ${liked.length} liked · ${playlists.length} playlist${playlists.length === 1 ? "" : "s"}</small></div></button>`;
  return `<div class="setCard acctCard"><div class="acctHead"><div class="tgPair"><img class="dm" src="/dhun-mark.webp?v=16" alt="Dhun"><div class="tgLogo">${TGICON}</div></div><div><b>${who}</b><small>${handle ? handle + " · " : ""}Signed in with Telegram ✅</small></div></div>
    <div class="setNote">☁️ ${st}<br>Your likes (${liked.length}), playlists (${playlists.length}), recently played and Telegram downloads (${Object.keys(dlIdx).length}) are saved to your account. Connect Telegram on any other phone to get them back.</div>
    <div class="btnRow" style="padding:10px 0 2px;margin:0"><button data-act="syncNow">Sync now</button><button data-act="tgOff" style="color:#ff453a">Log out</button></div></div>`;
}
async function loadArtUrls() { tgRefresh(true); }
let dlUiT = 0;
function dlUi(progress) {
  syncDlBtn();
  if (progress) { if (Date.now() - dlUiT < 600) return; dlUiT = Date.now(); }
  if (curTab === "library" || curTab === "search" || progress === undefined) { const y = view.scrollTop; rerender(); view.scrollTop = y; }
}
function syncDlBtn() {
  const b = $("#npDl"); if (!b) return; const t = queue[qi];
  const j = t && dlJobs.get(t.id);
  b.innerHTML = t && isDl(t.id) ? ICON.dlDone : ICON.dl; b.classList.toggle("on", !!(t && isDl(t.id)));
  b.dataset.p = j ? "…" : "";
}

// ---------- equalizer (Web Audio; OFF = plain <audio>, never touches Web Audio) ----------
const EQF = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQP = { "Flat": [0,0,0,0,0,0,0,0,0,0], "Bass Boost": [7,6,5,3,1,0,0,0,0,0], "Vocal": [-2,-2,-1,1,3,4,4,2,0,-1], "Treble": [0,0,0,0,0,1,2,4,6,7], "Bass + Treble": [6,5,3,1,0,0,1,3,5,6], "Pop": [-1,1,3,4,3,0,-1,-1,0,1], "Rock": [5,4,2,0,-1,-1,1,3,4,5], "Party": [6,5,2,0,-1,0,1,3,5,5], "Soft": [-1,0,1,2,2,1,0,-2,-3,-4] };
let eqOn = store.get("eqOn", false), eqPreset = store.get("eqPreset", "Flat"), eqGains = store.get("eqGains", EQP.Flat.slice());
let actx = null, eqNodes = [], preGain = null, analyser = null, eqRouted = false;
const eqType = i => i === 0 ? "lowshelf" : i === EQF.length - 1 ? "highshelf" : "peaking";
function eqRoute() {
  if (eqRouted) { if (actx.state !== "running") actx.resume().catch(() => {}); return true; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
  const hadSrc = !!audio.getAttribute("src") && !/^blob:|^\//.test(audio.getAttribute("src")) && audio.crossOrigin !== "anonymous";
  const was = !audio.paused, at = audio.currentTime;
  audio.crossOrigin = "anonymous";
  actx = new AC();
  const src = actx.createMediaElementSource(audio);
  preGain = actx.createGain();
  eqNodes = EQF.map((f, i) => { const b = actx.createBiquadFilter(); b.type = eqType(i); b.frequency.value = f; b.Q.value = 1.1; return b; });
  analyser = actx.createAnalyser(); analyser.fftSize = 2048;
  let n = src; n.connect(preGain); n = preGain; for (const b of eqNodes) { n.connect(b); n = b; } n.connect(analyser); analyser.connect(actx.destination);
  eqRouted = true; eqApply(); actx.resume().catch(() => {});
  if (hadSrc && queue[qi] && mode === "audio") loadCurrent(was, at); // reload with CORS so the EQ can hear it
  return true;
}
function eqApply() {
  if (!eqRouted) return;
  eqNodes.forEach((b, i) => { b.gain.value = eqOn ? (eqGains[i] || 0) : 0; });
  const mx = Math.max(0, ...eqGains); preGain.gain.value = eqOn ? Math.pow(10, -mx * 0.6 / 20) : 1; // headroom so boosts don't clip
}
function eqUnroute() { // fresh plain <audio> element: audio no longer goes through Web Audio at all
  const old = audio, was = !old.paused && mode === "audio", at = old.currentTime;
  const a = document.createElement("audio"); a.setAttribute("playsinline", ""); a.preload = "auto"; a.id = "audio";
  old.onerror = null; old.onplaying = null; try { old.pause(); old.removeAttribute("src"); old.load(); } catch (e) {}
  old.replaceWith(a); audio = a; wireAudio(a);
  try { actx.close(); } catch (e) {} actx = null; eqNodes = []; preGain = null; analyser = null; eqRouted = false;
  if (queue[qi] && mode === "audio") loadCurrent(was, at); else syncPlay();
}
function setEq(on) { eqOn = on; store.set("eqOn", on); if (on) { eqRoute(); eqApply(); } else if (eqRouted) eqUnroute(); }
function setPreset(name) { eqPreset = name; eqGains = EQP[name].slice(); store.set("eqPreset", name); store.set("eqGains", eqGains); eqApply(); }
document.addEventListener("visibilitychange", () => { if (eqRouted && document.visibilityState === "visible" && actx.state !== "running") actx.resume().catch(() => {}); });
function drawEq() {
  const c = $("#eqCanvas"); if (!c) return;
  const W = c.clientWidth || 340, H = 120, dpr = window.devicePixelRatio || 1; c.width = W * dpr; c.height = H * dpr;
  const g = c.getContext("2d"); g.scale(dpr, dpr); g.clearRect(0, 0, W, H);
  g.strokeStyle = "#38383a"; g.lineWidth = 1; for (const db of [-12, -6, 0, 6, 12]) { const y = H / 2 - db / 15 * (H / 2); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  const N = 160, fr = new Float32Array(N); for (let i = 0; i < N; i++) fr[i] = 20 * Math.pow(1000, i / (N - 1));
  const tot = new Float32Array(N);
  try {
    if (!drawEq.ctx) drawEq.ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 256, 44100);
    EQF.forEach((f, i) => { const b = drawEq.ctx.createBiquadFilter(); b.type = eqType(i); b.frequency.value = f; b.Q.value = 1.1; b.gain.value = eqGains[i]; const m = new Float32Array(N), ph = new Float32Array(N); b.getFrequencyResponse(fr, m, ph); for (let k = 0; k < N; k++) tot[k] += 20 * Math.log10(Math.max(1e-6, m[k])); });
  } catch (e) { return; }
  g.strokeStyle = eqOn ? "#fa2d48" : "#8e8e93"; g.lineWidth = 2.5; g.beginPath();
  for (let k = 0; k < N; k++) { const x = k / (N - 1) * W, y = H / 2 - Math.max(-15, Math.min(15, tot[k])) / 15 * (H / 2); k ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke();
}

const saveQ = () => { store.set("queue", queue.slice(0, 300)); store.set("qi", qi); };
const shuffled = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const isYT = t => t.src === "yt";
const isLegacy = t => !t.src && !t.url && /^[\w-]{11}$/.test(t.id);
function urlOf(t) { if (!t) return ""; if (t.url) return t.url; const r = resolved[t.id]; return r && r.url ? r.url : ""; }
const inflight = {};
function resolveTrack(t) { // legacy YouTube entry -> best JioSaavn match
  if (urlOf(t)) return Promise.resolve(urlOf(t));
  if (isYT(t)) return Promise.resolve("");
  const r = resolved[t.id]; if (r && r.none && Date.now() - r.none < 864e5) return Promise.resolve("");
  if (inflight[t.id]) return inflight[t.id];
  const q = `${t.title} ${(t.artist || "").split(/,|&| x /)[0]}`.replace(/\(.*?\)|\[.*?\]|official|video|lyrical|full song|audio/gi, " ").replace(/\s+/g, " ").trim();
  return inflight[t.id] = api("/api/match?q=" + encodeURIComponent(q)).then(d => {
    delete inflight[t.id];
    if (d.track && d.track.url) { resolved[t.id] = { url: d.track.url, sid: d.track.id }; store.set("resolved", resolved); return d.track.url; }
    resolved[t.id] = { none: Date.now() }; store.set("resolved", resolved); return "";
  }).catch(() => { delete inflight[t.id]; return ""; });
}
// Quietly pre-resolve old saved songs so they start instantly (and can auto-advance while the phone is locked)
async function migrateLibrary() {
  const all = [...queue, ...liked, ...recent, ...playlists.flatMap(p => p.tracks || [])].filter(t => isLegacy(t) && !resolved[t.id]);
  const seen = new Set(); const todo = all.filter(t => !seen.has(t.id) && seen.add(t.id));
  for (let i = 0; i < todo.length; i += 4) await Promise.all(todo.slice(i, i + 4).map(resolveTrack));
}
setTimeout(() => migrateLibrary().catch(() => {}), 2500);

// the song in the player right now (same id), not finished: picking it again keeps its place instead of restarting at 0:00
function keepCur(t) { const c = queue[qi]; if (!c || !t || c.id !== t.id) return false; const d = P.dur(); if (mode !== "yt" && audio.src && (audio.ended || (d && audio.currentTime > d - 1.5))) return false; return true; }
function curPos() { const t = queue[qi]; if (!t) return 0; if (mode === "yt" || audio.src) return P.time() || 0; return resumeAt(); }
function keepPlaying() { renderQueue(); highlightRows(); prepNext(); if (!P.playing()) P.play(); else syncPlay(); }
function playList(list, i) {
  const j = Math.max(0, Math.min(i, list.length - 1));
  if (keepCur(list[j])) { const cur = queue[qi]; queue = list.map(slim); qi = j; queue[qi] = cur; autoplayAdded = new Set(); saveQ(); keepPlaying(); maybeAutoplayFill(); return; }
  queue = list.map(slim); qi = j; autoplayAdded = new Set();
  saveQ(); loadCurrent(true);
}
function addToQueue(t, next) {
  if (!queue.length) return playList([t], 0);
  if (next) queue.splice(qi + 1, 0, slim(t)); else queue.push(slim(t));
  saveQ(); renderQueue(); prepNext(); toast(next ? "Playing next" : "Added to queue");
}
const radioURL = t => `/api/radio?src=${t.src === "saavn" ? "saavn" : ""}&v=${encodeURIComponent(t.src === "saavn" ? t.id : (resolved[t.id] && resolved[t.id].sid) || t.id)}&artist=${encodeURIComponent(t.artist || "")}&title=${encodeURIComponent(t.title || "")}`;
async function startRadio(t) {
  toast("📻 Radio shuru ho raha hai…");
  if (keepCur(t)) { queue = [queue[qi]]; qi = 0; autoplayAdded = new Set(); saveQ(); keepPlaying(); } // same song keeps playing from where it is
  else playList([t], 0);
  try { const d = await api(radioURL(t) + "&long=1"); const more = freshSongs(d.items, [t, queue[0]]); queue = [queue[0], ...more.map(slim)]; qi = 0; saveQ(); renderQueue(); prepNext(); } catch (e) {}
}
// Make sure the NEXT song already has a playable URL, so 'ended' can switch instantly (iOS freezes timers when locked)
function prepNext() { const n = queue[qi + 1]; if (!n) return; if (n.tg && isDl(n.id)) return; if (!urlOf(n) && !isYT(n) && navigator.onLine) resolveTrack(n); }
function status(msg) { $("#npStatus").textContent = msg || ""; }

function loadCurrent(autoplay, startAt = 0) {
  const t = queue[qi]; if (!t) return;
  mixAbort();
  const my = ++loadToken; userPaused = !autoplay;
  clearTimeout(stallTimer); stopYT(); mode = "audio";
  if (!navigator.onLine) { updateMeta(t); renderQueue(); highlightRows(); try { audio.pause(); } catch (e) {} userPaused = true; syncPlay(); status("You're offline — Dhun needs internet"); return; }
  if (eqOn && !eqRouted) eqRoute();
  updateMeta(t); addRecent(t);
  renderQueue(); highlightRows(); maybeAutoplayFill(); syncDlBtn();
  if (t.tg && isDl(t.id) && tgCode && !/forceyt=1/.test(location.search)) return playUrl(t, tgUrl(t.id), my, autoplay, startAt, 0); // stream from her Telegram
  const url = /forceyt=1/.test(location.search) ? "" : withQ(urlOf(t), curQ());
  if (url) return playUrl(t, url, my, autoplay, startAt, 0); // synchronous: works inside 'ended' while locked
  if (isYT(t) || /forceyt=1/.test(location.search)) return ytFallback(t, my, startAt, autoplay);
  status("Finding song…");
  resolveTrack(t).then(u => { if (my !== loadToken) return; if (u) playUrl(t, withQ(u, curQ()), my, autoplay, startAt, 0); else ytFallback(t, my, startAt, autoplay); });
}
function playUrl(t, url, my, autoplay, startAt, attempt) {
  clearTimeout(stallTimer);
  audio.onerror = () => { if (my === loadToken) onFail(t, url, my, startAt, autoplay, attempt); };
  audio.onplaying = () => { if (my !== loadToken) return; clearTimeout(stallTimer); status(""); prepNext(); syncQ(); };
  audio.src = url; syncQ(url);
  if (startAt) { const s = startAt; audio.addEventListener("loadedmetadata", () => { try { audio.currentTime = s; } catch (e) {} }, { once: true }); }
  if (autoplay) {
    const p = audio.play(); if (p) p.catch(err => { if (err.name === "NotAllowedError") { userPaused = true; syncPlay(); status("Tap play to start"); clearTimeout(stallTimer); } });
    stallTimer = setTimeout(() => { if (my === loadToken && audio.readyState < 3 && !userPaused && !audio.paused) onFail(t, url, my, startAt, autoplay, attempt); }, 15000);
  } else audio.load();
}
async function onFail(t, url, my, startAt, autoplay, attempt) {
  clearTimeout(stallTimer);
  if (/\/api\/tg\/stream/.test(url)) { status("Telegram copy didn't load, playing from JioSaavn…"); const sid = t.sid || t.id; try { const d = await api("/api/song?id=" + encodeURIComponent(sid)); if (my === loadToken && d.track && d.track.url) return playUrl({ ...t, tg: false }, withQ(d.track.url, curQ()), my, autoplay, startAt, 0); } catch (e) {} status("This song couldn't play"); return; }
  if (attempt === 0 && /_(320|96|48)\.mp4/.test(url)) { status("Trying another quality…"); return playUrl(t, url.replace(/_(320|96|48)\.mp4/, "_160.mp4"), my, autoplay, startAt, 1); }
  if (attempt <= 1 && (t.src === "saavn" || (resolved[t.id] && resolved[t.id].sid))) {
    const sid = t.src === "saavn" ? t.id : resolved[t.id].sid;
    try { const d = await api("/api/song?id=" + encodeURIComponent(sid)); if (my !== loadToken) return; if (d.track && d.track.url && d.track.url !== url) { if (t.src === "saavn") t.url = d.track.url; else { resolved[t.id].url = d.track.url; store.set("resolved", resolved); } saveQ(); return playUrl(t, d.track.url, my, autoplay, startAt, 2); } } catch (e) {}
  }
  if (my === loadToken) ytFallback(t, my, startAt, autoplay);
}
// Last resort: YouTube (ad-free proxy audio if one answers, else the YouTube player which needs the app open)
async function ytFallback(t, my, startAt, autoplay) {
  status("Not on the main source — trying YouTube…");
  let ytid = isYT(t) || isLegacy(t) ? t.id : (t.ytid || "");
  if (!ytid) { try { ytid = (await api("/api/yt?q=" + encodeURIComponent(`${t.title} ${t.artist}`))).id; } catch (e) {} if (my !== loadToken) return; if (ytid) t.ytid = ytid; }
  if (!ytid) { status("This song can't play right now — skipping"); return setTimeout(() => my === loadToken && next(true), 1500); }
  let srcs = []; try { srcs = (await api("/api/sources?v=" + ytid)).sources || []; } catch (e) {}
  if (my !== loadToken) return;
  if (srcs.length && !/forceyt=1/.test(location.search)) {
    audio.onerror = () => { if (my === loadToken) playYT({ ...t, id: ytid }, my, startAt, autoplay); };
    audio.onplaying = () => { if (my === loadToken) { clearTimeout(stallTimer); status(""); prepNext(); } };
    audio.src = eqRouted ? "/api/p?u=" + encodeURIComponent(srcs[0].url) : srcs[0].url; syncQ();
    if (autoplay) { audio.play().catch(() => {}); stallTimer = setTimeout(() => { if (my === loadToken && audio.readyState < 3 && !userPaused) playYT({ ...t, id: ytid }, my, startAt, autoplay); }, 9000); }
    return;
  }
  playYT({ ...t, id: ytid }, my, startAt, autoplay);
}

// YouTube IFrame fallback (last resort; foreground only)
function loadYTApi() { return new Promise(res => { if (window.YT && YT.Player) return res(); window.onYouTubeIframeAPIReady = res; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); }); }
async function playYT(t, my, startAt, autoplay) {
  mode = "yt"; audio.pause(); audio.removeAttribute("src");
  await loadYTApi(); if (my !== loadToken) return;
  $("#yt").classList.add("on");
  const vars = { autoplay: autoplay ? 1 : 0, playsinline: 1, controls: 1, start: Math.floor(startAt || 0), rel: 0, modestbranding: 1 };
  const onState = e => { if (my !== loadToken) return; if (e.data === 0) next(true); syncPlay(); };
  if (ytPlayer && ytReady) { ytPlayer.loadVideoById({ videoId: t.id, startSeconds: startAt || 0 }); if (!autoplay) ytPlayer.pauseVideo(); }
  else {
    $("#yt").innerHTML = '<div id="ytp"></div>';
    ytPlayer = new YT.Player("ytp", { videoId: t.id, host: "https://www.youtube-nocookie.com", playerVars: vars, events: { onReady: () => { ytReady = true; if (autoplay) ytPlayer.playVideo(); }, onStateChange: onState, onError: () => { status("This song can't play right now — skipping"); setTimeout(() => my === loadToken && next(true), 1500); } } });
  }
  status("Playing via YouTube player — keep the app open for this one");
  clearInterval(ytTimer); ytTimer = setInterval(tick, 500);
}
function stopYT() { clearInterval(ytTimer); if (ytPlayer && ytReady) { try { ytPlayer.stopVideo(); } catch (e) {} } $("#yt").classList.remove("on"); }

const P = {
  playing() { return mode === "yt" ? (ytPlayer && ytReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === 1) : !audio.paused; },
  time() { return mode === "yt" ? (ytPlayer && ytReady && ytPlayer.getCurrentTime ? ytPlayer.getCurrentTime() : 0) : audio.currentTime; },
  dur() { const t = queue[qi]; const d = mode === "yt" ? (ytPlayer && ytReady && ytPlayer.getDuration ? ytPlayer.getDuration() : 0) : audio.duration; return isFinite(d) && d > 0 ? d : (t && t.dur) || 0; },
  play() { userPaused = false; if (eqOn && mode === "audio") eqRoute(); if (mode === "yt") { ytPlayer && ytReady && ytPlayer.playVideo(); return; } if (!audio.src) return loadCurrent(true, resumeAt()); audio.play().catch(() => {}); },
  pause() { userPaused = true; mixAbort(); if (mode === "yt") { ytPlayer && ytReady && ytPlayer.pauseVideo(); return; } audio.pause(); },
  seek(s) { mixAbort(); if (mode === "yt") { ytPlayer && ytReady && ytPlayer.seekTo(s, true); } else { try { audio.currentTime = s; } catch (e) {} } tick(); },
};
const toggle = () => P.playing() ? P.pause() : P.play();
// Same song, another release: JioSaavn lists one song many times ("Kesariya", "Kesariya (From \"Brahmastra\")", a compilation copy, "Zara Sa" ×2…).
// songKey() is the song's name without the brackets / " - New Version" tail, so a copy of the song that just ended is never played next.
function songKey(t) { const s = String((t && t.title) || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s*[\(\[][^\)\]]*[\)\]]/g, " ").split(/\s+[-\u2013\u2014|]\s+/)[0].replace(/\s+(eclipsa audio|dolby atmos|spatial audio|8d audio|8d|lo-?fi( flip| mix| version)?|slowed( and| &| \+)?( reverb)?|reverb|sped up|remix(ed)?|unplugged|reprise|acoustic|(female|male|sad|duet|new) version|version|title track)(?=\s|$)/g, " ").replace(/[^\p{L}\p{N}]+/gu, ""); return s || "id:" + String(t && t.id); }
function freshSongs(items, have) { const ids = new Set((have || []).filter(Boolean).map(x => x.id)), keys = new Set((have || []).filter(Boolean).map(songKey)); return (items || []).filter(x => x && x.id && !ids.has(x.id) && !keys.has(songKey(x)) && keys.add(songKey(x))); }
// queue finished with repeat off: keep going with similar songs (Apple Music style autoplay) instead of stopping / replaying
function autoEnd() {
  userPaused = true; syncPlay();
  const t = queue[qi]; if (!t || !navigator.onLine) return;
  api(radioURL(t)).then(d => { if (queue[qi] !== t || P.playing()) return; const add = freshSongs(d.items, queue).slice(0, 20).map(slim); if (!add.length) return; queue.push(...add); qi++; saveQ(); loadCurrent(true); }).catch(() => {});
}

// ---------- AutoMix: songs blend into each other (Apple Music style) ----------
// The next song starts on a second <audio> near the end of this one; both volumes move on an equal-power curve.
// Length per transition is decided from the songs themselves: a cheap 48 kbps copy is decoded at 8 kHz to find
// where the outro fades / goes silent and where the next song's sound really starts (clamped 2–10 s, 5 s when unknown).
// Skipped (normal 'ended' switch, never a stop): Listen Together, repeat one, EQ on, YouTube songs, page hidden / locked,
// iPhone browsers (Safari can't change an <audio> volume), and whenever the second song can't start.
const mixVolOK = (() => { try { const x = document.createElement("audio"); x.volume = 0.5; return Math.abs(x.volume - 0.5) < 0.01; } catch (e) { return false; } })();
let mixFade = null, mixPre = null, mixBusy = false; const mixPrepped = new Set();
const mixInfo = new Map();
const mixOn = () => cfg.automix !== false && mixVolOK;
function mixSrcOf(t) {
  if (!t) return "";
  if (typeof isOff === "function" && isOff(t.id)) return offSrc(t.id);
  if (!navigator.onLine || /forceyt=1/.test(location.search)) return "";
  if (t.tg && isDl(t.id) && tgCode) return tgUrl(t.id);
  const u = urlOf(t); return u && /^https?:/.test(u) ? withQ(u, curQ()) : "";
}
function mixAnaSrc(t) {
  if (typeof isOff === "function" && isOff(t.id)) return offSrc(t.id); // file on the phone: free to read
  if (cfg.saver || !navigator.onLine) return "";
  const u = urlOf(t); return /saavncdn\.com\/.*_(320|160|96|48)\.mp4/.test(u || "") ? u.replace(/_(320|160|96|48)\.mp4/, "_48.mp4") : "";
}
function mixAnalyse(t) {
  if (!t || !mixOn()) return null;
  if (mixInfo.has(t.id)) return mixInfo.get(t.id);
  const box = { v: undefined }; mixInfo.set(t.id, box);
  if (mixInfo.size > 40) mixInfo.delete(mixInfo.keys().next().value);
  const src = mixAnaSrc(t); if (!src) { box.v = null; return box; }
  (async () => {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC) return null;
    const r = await fetch(src); if (!r.ok) return null; const ab = await r.arrayBuffer();
    const ctx = new OAC(1, 1, 8000);
    const buf = await new Promise((res, rej) => { const p = ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
    const sr = buf.sampleRate, w = Math.max(1, Math.round(sr * 0.1)), chs = [];
    for (let c = 0; c < buf.numberOfChannels; c++) chs.push(buf.getChannelData(c));
    const n = Math.floor(chs[0].length / w); if (n < 150) return null;
    const db = new Float32Array(n);
    for (let i = 0; i < n; i++) { let s = 0; for (const ch of chs) for (let k = i * w, e = k + w; k < e; k++) s += ch[k] * ch[k]; db[i] = 10 * Math.log10(s / (w * chs.length) + 1e-12); }
    const ref = Array.from(db).sort((x, y) => x - y)[Math.floor(n * 0.7)]; // the song's usual loudness
    const sil = Math.max(ref - 30, -65);
    let h = 0; while (h < n && db[h] < sil) h++;
    let e = n - 1; while (e > h && db[e] < sil) e--;
    const avg = i => { let s = 0, c = 0; for (let k = Math.max(0, i - 9); k <= i; k++) { s += db[k]; c++; } return s / c; };
    let o = e; while (o > h && e - o < 150 && avg(o) < ref - 9) o--; // outro = quiet tail before the sound ends
    return { head: Math.min(h * 0.1, 8), end: (e + 1) * 0.1, outro: (e - o) * 0.1, dur: buf.duration };
  })().then(v => { box.v = v || null; }, () => { box.v = null; });
  return box;
}
function mixNextIndex() { // the song 'ended' would play next, or -1
  if (repeat === 2 || !queue.length) return -1;
  const k = songKey(queue[qi]); let j = qi + 1;
  while (j < queue.length && songKey(queue[j]) === k) j++;
  if (j < queue.length) return j;
  if (repeat === 1 && queue.length > 1 && songKey(queue[0]) !== k) return 0;
  return -1;
}
function mixDrop(el) { if (!el) return; try { el.pause(); el.removeAttribute("src"); el.load(); } catch (e) {} try { el.remove(); } catch (e) {} }
function mixAbort() { // a seek / pause / skip mid-blend: the outgoing song stops, the new one goes to full volume
  if (!mixFade) return; clearInterval(mixFade.iv); const o = mixFade.old; mixFade = null; mixDrop(o); try { audio.volume = 1; } catch (e) {}
}
function mixMaybe() {
  if (mixFade || mixBusy || !mixOn() || mode !== "audio" || eqRouted || document.hidden || userPaused || audio.paused || (typeof jamOn === "function" && jamOn())) return;
  const t = queue[qi], d = audio.duration; if (!t || !isFinite(d) || d < 40) return;
  const ti = mixAnalyse(t), info = ti && ti.v;
  const j = mixNextIndex(); if (j < 0) return;
  const n = queue[j], url = mixSrcOf(n); if (!url) { if (!mixPrepped.has(n.id)) { mixPrepped.add(n.id); prepNext(); } return; }
  const end = info ? Math.min(d, info.end) : d;
  const L = info ? Math.min(10, Math.max(2, info.outro + 1)) : 5;
  const rem = end - audio.currentTime;
  if (rem > L + 30 || rem < 1) return;
  const ni = mixAnalyse(n); // start reading the next song's intro now
  if (!mixPre || mixPre.dataset.id !== n.id || mixPre.dataset.url !== url) { mixDrop(mixPre); mixPre = document.createElement("audio"); mixPre.setAttribute("playsinline", ""); mixPre.preload = "auto"; mixPre.dataset.id = n.id; mixPre.dataset.url = url; mixPre.volume = 0; mixPre.src = url; try { mixPre.load(); } catch (e) {} }
  if (rem > L) return;
  mixStart(j, n, url, Math.max(1, Math.min(L, rem)), ni && ni.v ? ni.v.head : 0);
}
function mixStart(j, n, url, L, head) {
  const el = mixPre; mixPre = null; if (!el) return; mixBusy = true; const tok = loadToken;
  el.volume = 0;
  if (head > 0.3) { if (el.readyState >= 1) { try { el.currentTime = head; } catch (e) {} } else el.addEventListener("loadedmetadata", () => { try { if (el.currentTime < head) el.currentTime = head; } catch (e) {} }, { once: true }); }
  let p; try { p = el.play(); } catch (e) { p = Promise.reject(e); }
  Promise.resolve(p).then(() => {
    mixBusy = false;
    if (tok !== loadToken || mixFade || queue[j] !== n || audio.paused || userPaused || mode !== "audio") { mixDrop(el); return; } // something changed meanwhile (skip, pause, song already ended)
    mixCommit(j, n, url, el, L);
  }, () => { mixBusy = false; mixDrop(el); }); // couldn't start: the normal 'ended' switch takes over
}
function mixCommit(j, t, url, el, L) {
  const old = audio;
  qi = j; saveQ();
  const my = ++loadToken; userPaused = false; clearTimeout(stallTimer);
  old.onerror = null; old.onplaying = null; old.id = "audioOut";
  el.id = "audio"; old.after(el); audio = el; wireAudio(el);
  el.onerror = () => { if (my === loadToken) onFail(t, url, my, 0, true, 0); };
  el.onplaying = () => { if (my !== loadToken) return; clearTimeout(stallTimer); status(""); prepNext(); syncQ(); };
  updateMeta(t); addRecent(t); renderQueue(); highlightRows(); maybeAutoplayFill(); syncDlBtn(); syncQ(url); syncPlay(); prepNext();
  const v0 = old.volume, t0 = Date.now(), ms = L * 1000;
  const step = () => {
    const x = Math.min(1, (Date.now() - t0) / ms);
    try { old.volume = v0 * Math.cos(x * Math.PI / 2); el.volume = Math.sin(x * Math.PI / 2); } catch (e) {}
    if (x >= 1 || old.ended) { const f = mixFade; mixFade = null; if (f) clearInterval(f.iv); mixDrop(old); try { el.volume = 1; } catch (e) {} }
  };
  mixFade = { old, el, iv: setInterval(step, 50) }; step();
  mixAnalyse(t);
}
setInterval(() => { if (!document.hidden && !audio.paused) mixMaybe(); }, 500);
function next(auto) {
  if (!queue.length) return;
  if (auto && repeat === 2) { P.seek(0); return P.play(); }
  let j = qi + 1;
  if (auto) { const k = songKey(queue[qi]); while (j < queue.length && songKey(queue[j]) === k) j++; } // skip copies of the song that just ended
  if (j < queue.length) qi = j;
  else if (repeat === 1 || !auto) qi = 0;
  else return autoEnd();
  saveQ(); loadCurrent(true);
}
function prev() { if (P.time() > 3 || qi === 0) { P.seek(0); return; } qi--; saveQ(); loadCurrent(true); }
async function maybeAutoplayFill() {
  // Like Apple Music autoplay: when near the end of the queue, add similar songs.
  const t = queue[qi]; if (!t || queue.length - qi > 2 || repeat === 2 || (repeat === 1 && queue.length > 1) || autoplayAdded.has(t.id)) return;
  autoplayAdded.add(t.id);
  try { const d = await api(radioURL(t)); const add = freshSongs(d.items, queue).slice(0, 20).map(slim); if (add.length) { queue.push(...add); saveQ(); renderQueue(); prepNext(); } } catch (e) {}
}

// ---------- UI sync ----------
const np = $("#np");
function updateMeta(t) {
  const art = (!navigator.onLine && artUrls.get(t.id)) || t.thumb || ytThumb(t.id);
  $("#mini").classList.remove("hidden");
  $("#miniArt").src = small(art); $("#miniTitle").textContent = t.title; $("#miniArtist").textContent = t.artist;
  $("#npArt").src = art; $("#npArt").onerror = function () { this.onerror = null; this.src = ytThumb(t.id); };
  $("#npBg").style.backgroundImage = `url("${small(art)}")`;
  $("#npTitle").textContent = t.title; $("#npArtist").textContent = t.artist;
  document.title = `${t.title} · ${t.artist}`;
  syncLike(); status("");
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist, album: t.album || "", artwork: /^blob:/.test(art) ? [{ src: art, sizes: "500x500", type: "image/jpeg" }] : /saavncdn/.test(art) ? [["150x150", "150x150"], ["500x500", "512x512"]].map(([k, s]) => ({ src: art.replace("500x500", k), sizes: s, type: "image/jpeg" })) : [96, 256, 512].map(s => ({ src: art.replace(/=w544-h544/, `=w${s}-h${s}`), sizes: `${s}x${s}`, type: "image/jpeg" })) });
  }
  tick();
}
function syncLike() { const t = queue[qi]; const on = t && isLiked(t.id); const b = $("#npLike"); b.innerHTML = on ? ICON.heart : ICON.heartO; b.classList.toggle("on", !!on); }
function syncPlay() {
  const p = P.playing();
  $("#miniPlay").innerHTML = p ? ICON.pause : ICON.play; $("#npPlay").innerHTML = p ? ICON.pause : ICON.play;
  np.classList.toggle("paused", !p);
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = p ? "playing" : "paused";
}
let seeking = false, lastPosSave = 0;
function tick() {
  const cur = P.time(), d = P.dur(); const pct = d ? Math.min(100, cur / d * 100) : 0;
  $("#miniProg div").style.width = pct + "%";
  if (!seeking) { const s = $("#seek"); s.value = d ? Math.round(cur / d * 1000) : 0; s.style.setProperty("--p", pct + "%"); $("#tCur").textContent = fmt(cur); $("#tDur").textContent = "-" + fmt(Math.max(0, d - cur)); }
  if ("mediaSession" in navigator && navigator.mediaSession.setPositionState && d && isFinite(d)) { try { navigator.mediaSession.setPositionState({ duration: d, position: Math.min(cur, d), playbackRate: 1 }); } catch (e) {} }
  if (Date.now() - lastPosSave > 3000) { lastPosSave = Date.now(); savePos(); } // resume point (saved only once a song is really loaded)
}
function highlightRows() { const id = queue[qi] && queue[qi].id; document.querySelectorAll("#view .row").forEach(r => r.classList.toggle("playing", r.dataset.id === id)); }
function renderQueue() {
  const up = queue.slice(qi + 1, qi + 61); reg(up);
  $("#queueList").innerHTML = up.map((t, i) => rowHTML(t, qi + 1 + i, "queue")).join("") || `<div class="empty" style="padding:16px">Nothing up next — similar songs get added automatically.</div>`;
  $("#autoplayNote").textContent = repeat ? "" : "Autoplay on";
  lists.queue = queue;
}
$("#queueList").addEventListener("click", e => {
  const more = e.target.closest("[data-more]"); if (more) { e.stopPropagation(); const row = more.closest("[data-i]"); const i = +row.dataset.i; const t = queue[i];
    return showSheet(`<div class="sgroup"><div class="shead"><div class="t1">${esc(t.title)}</div></div><button data-s="top">Move to Top ${ICON.playNext}</button><button data-s="like">${isLiked(t.id) ? "Unlike" : "Love"} ${ICON.heartO}</button><button data-s="addpl">Add to Playlist… ${ICON.pl}</button><button data-s="rm" class="danger">Remove from Queue ${ICON.trash}</button></div>`, {
      top: () => { queue.splice(i, 1); queue.splice(qi + 1, 0, t); saveQ(); renderQueue(); }, like: () => toggleLike(t), addpl: () => setTimeout(() => openAddToPlaylist(t), 50), rm: () => { queue.splice(i, 1); saveQ(); renderQueue(); } }); }
  const row = e.target.closest("[data-i]"); if (row) { const ni = +row.dataset.i; if (keepCur(queue[ni])) { qi = ni; saveQ(); return keepPlaying(); } qi = ni; saveQ(); loadCurrent(true); }
});
function syncModes() {
  $("#npShuffle").classList.toggle("on", shuffle); $("#npRepeat").classList.toggle("on", repeat > 0);
  $("#npRepeat").innerHTML = repeat === 2 ? ICON.repeat1 : ICON.repeat; store.set("shuffle", shuffle); store.set("repeat", repeat);
}

// controls
$("#npPrev").innerHTML = ICON.prev; $("#npNext").innerHTML = ICON.next; $("#miniNext").innerHTML = ICON.next; $("#npMore").innerHTML = ICON.dots;
$("#npShuffle").innerHTML = ICON.shuffle; $("#npQueueBtn").innerHTML = ICON.queue; $("#npRepeat").innerHTML = ICON.repeat;
$("#miniPlay").onclick = e => { e.stopPropagation(); toggle(); };
$("#miniNext").onclick = e => { e.stopPropagation(); next(false); };
$("#mini").onclick = () => openNP();
$("#npPlay").onclick = toggle; $("#npNext").onclick = () => next(false); $("#npPrev").onclick = prev;
$("#npClose").onclick = closeNP;
$("#npLike").onclick = () => queue[qi] && toggleLike(queue[qi]);
$("#npMore").onclick = () => queue[qi] && openTrackSheet(queue[qi], "np", qi);
$("#npQueueBtn").onclick = () => { const open = $("#queuePanel").classList.toggle("hidden") === false; $("#npQueueBtn").classList.toggle("on", open); np.classList.toggle("qopen", open); renderQueue(); };
$("#npShuffle").onclick = () => { shuffle = !shuffle; if (shuffle && queue.length > qi + 1) { const rest = shuffled(queue.slice(qi + 1)); queue = queue.slice(0, qi + 1).concat(rest); saveQ(); renderQueue(); } syncModes(); toast(shuffle ? "Shuffle on" : "Shuffle off"); };
$("#npRepeat").onclick = () => { repeat = (repeat + 1) % 3; syncModes(); renderQueue(); toast(["Repeat off", "Repeat all", "Repeat one"][repeat]); };
const seek = $("#seek");
seek.oninput = () => { seeking = true; const d = P.dur(); const s = seek.value / 1000 * d; seek.style.setProperty("--p", seek.value / 10 + "%"); $("#tCur").textContent = fmt(s); $("#tDur").textContent = "-" + fmt(d - s); };
seek.onchange = () => { const d = P.dur(); P.seek(seek.value / 1000 * d); seeking = false; };
function openNP() { np.classList.add("open"); np.setAttribute("aria-hidden", "false"); renderQueue(); }
function closeNP() { np.classList.remove("open"); np.setAttribute("aria-hidden", "true"); }
// swipe down to close
let sy = null;
np.addEventListener("touchstart", e => { if (e.target.closest("#seek,#queuePanel,#yt")) return; sy = e.touches[0].clientY; }, { passive: true });
np.addEventListener("touchmove", e => { if (sy == null) return; const dy = e.touches[0].clientY - sy; if (dy > 0) { np.style.transition = "none"; np.style.transform = `translateY(${dy}px)`; } }, { passive: true });
np.addEventListener("touchend", e => { if (sy == null) return; const dy = e.changedTouches[0].clientY - sy; sy = null; np.style.transition = ""; np.style.transform = ""; if (dy > 120) closeNP(); });

function wireAudio(a) {
  a.addEventListener("play", syncPlay); a.addEventListener("pause", syncPlay); a.addEventListener("playing", syncPlay);
  a.addEventListener("timeupdate", tick); a.addEventListener("durationchange", tick);
  a.addEventListener("waiting", () => { if (mode === "audio" && a === audio) status("Loading…"); });
  a.addEventListener("canplay", () => { if ($("#npStatus").textContent === "Loading…") status(""); });
  a.addEventListener("ended", () => { if (a === audio) next(true); });
  a.addEventListener("pause", () => { if (a === audio && typeof savePos === "function") savePos(); }); a.addEventListener("seeked", () => { if (a === audio && typeof savePos === "function") savePos(); });
}
wireAudio(audio);
// quality badge on Now Playing = the quick Wi-Fi / Data saver switch
function syncQ(u) {
  const b = $("#npQ"); if (!b) return; u = u || audio.getAttribute("src") || "";
  if (/\/api\/tg\/stream/.test(u)) { const d = queue[qi] && dlIdx[queue[qi].id]; b.textContent = "Telegram" + (d && d.q ? " · " + d.q + " kbps" : ""); b.className = "qpill dl"; return; }
  if (mode === "yt" || (u && !/saavncdn|^blob:/.test(u))) { b.textContent = "YouTube"; b.className = "qpill"; return; }
  if (/^blob:/.test(u)) { const d = queue[qi] && dlIdx[queue[qi].id]; b.textContent = "Downloaded" + (d && d.q ? " · " + d.q + " kbps" : ""); b.className = "qpill dl"; return; }
  const k = kbpsOf(u) || curQ(); const cell = netKind() === "cell";
  b.textContent = (cell ? "Data saver" : "Wi‑Fi") + " · " + k + " kbps"; b.className = "qpill" + (cell ? " saver" : "");
}
function applyQualityNow() {
  const t = queue[qi]; syncQ();
  if (t && mode === "audio" && !isDl(t.id) && urlOf(t) && audio.getAttribute("src") && kbpsOf(audio.getAttribute("src")) !== kbpsOf(withQ(urlOf(t), curQ()))) { const was = !audio.paused, at = audio.currentTime; loadCurrent(was, at); }
}
function setSaver(on) { cfg.saver = on; saveCfg(); applyQualityNow(); toast(on ? `Data saver on · ${cfg.qCell} kbps` : `Wi‑Fi quality · ${cfg.qWifi} kbps`); if (curTab === "library" && subView === "settings") rerender(); }
$("#npQ").onclick = () => setSaver(!cfg.saver);
$("#npDl").onclick = () => { const t = queue[qi]; if (!t) return; if (isDl(t.id)) showSheet(`<div class="sgroup"><div class="shead"><div class="t1">${esc(t.title)}</div><div class="sub">In your Telegram ✓</div></div><a class="tgBtn" href="https://t.me/${esc(tgBot)}" target="_blank" rel="noopener">${TGICON}Open in Telegram</a><button data-s="rm" class="danger">Remove from Telegram ${ICON.trash}</button></div>`, { rm: () => removeDl(t.id) }); else download(t); };
$("#npDl").innerHTML = ICON.dl;
const _c = conn(); if (_c && _c.addEventListener) _c.addEventListener("change", () => syncQ());
window.addEventListener("online", () => { rerender(); syncQ(); });
window.addEventListener("offline", () => { rerender(); syncQ(); });
loadArtUrls();

if ("mediaSession" in navigator) {
  const ms = navigator.mediaSession;
  const h = (a, f) => { try { ms.setActionHandler(a, f); } catch (e) {} };
  h("play", () => P.play()); h("pause", () => P.pause());
  h("previoustrack", prev); h("nexttrack", () => next(false));
  h("seekto", d => P.seek(d.seekTime));
  h("seekbackward", null); h("seekforward", null); // keep next/prev buttons on the lock screen
}

// restore last session (paused) so the mini player is there on reopen
if (queue[qi]) { updateMeta(queue[qi]); syncPlay(); renderQueue(); }
syncModes();
window.addEventListener("keydown", e => { if (e.code === "Space" && e.target.tagName !== "INPUT") { e.preventDefault(); toggle(); } });
(function(){const s=document.getElementById("splash");if(!s)return;const hide=()=>{s.classList.add("out");setTimeout(()=>s.remove(),400)};setTimeout(hide,650);})();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
window.__m = { P, queue: () => queue, get audio() { return audio; }, doSearch, playList, lists, get mode() { return mode; }, cfg, setSaver, setEq, setPreset, download, dl: () => dlIdx, dlJobs, removeDl,
  eq() { const o = { on: eqOn, routed: eqRouted, ctx: actx && actx.state, gains: eqNodes.map(n => +n.gain.value.toFixed(2)), types: eqNodes.map(n => n.type), pre: preGain && +preGain.gain.value.toFixed(3) }; if (analyser) { const d = new Float32Array(analyser.fftSize); analyser.getFloatTimeDomainData(d); let sq = 0; for (const x of d) sq += x * x; o.rms = +Math.sqrt(sq / d.length).toFixed(4); } return o; } };
rerender(); syncPlay();
// ---- Deals UI ----
function dealsHidden() { return false; } // deals can no longer be closed (her 4:08 PM ask)
try { localStorage.removeItem("m_dealsHideUntil"); } catch (e) {}
function dealHref(d) { const u = String((d && d.url) || ""); return /^https:\/\//.test(u) ? u : (deals.join || DEALS_JOIN_DEFAULT); }
function dealImg(d, cls) { return d && d.img && /^https:\/\//.test(d.img) ? `<img class="${cls}" src="${esc(d.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('i'),{className:'${cls} ph',textContent:'🛍️'}))">` : `<i class="${cls} ph">🛍️</i>`; }
function dealCur() { const it = deals.items || []; return it.length ? it[dealIdx % it.length] : null; }
function dealsHomeHTML() {
  if (dealsHidden() || !(deals.items || []).length) return "";
  const d = dealCur();
  return `<div id="dealCard" class="dealCard"><a class="dcLink" href="${esc(dealHref(d))}" target="_blank" rel="noopener">${dealImg(d, "dcImg")}<span class="dcBody"><b>🔥 Deals</b><span class="dcT">${esc(d.text)}</span></span></a></div>`;
}
function dealsJoinHTML() {
  const join = deals.join || DEALS_JOIN_DEFAULT, d = dealCur();
  return `<div class="dealsJoin"><div class="djHead"><i class="djIcon">🛍️</i><span><b>Deals channel</b><small>Best shopping deals, daily · on Telegram</small></span></div>${d ? `<div class="djList djOne"><a id="djOne" href="${esc(dealHref(d))}" target="_blank" rel="noopener">${dealImg(d, "djImg")}<span class="djT">${esc(d.text)}</span></a></div>` : ""}<a class="djBtn" href="${esc(join)}" target="_blank" rel="noopener">${TGICON}<span>Join Deals channel 🛍️</span></a></div>`;
}
function dealsTick() {
  const el = document.getElementById("dealTick"); if (!el) return;
  const d = dealCur(), show = !!d && !dealsHidden();
  el.classList.toggle("hidden", !show); document.body.classList.toggle("hasTick", show);
  if (!show) return;
  const a = el.querySelector("a"); a.href = dealHref(d); el.querySelector(".dtT").textContent = d.text;
}
function dealsRotate() {
  const one = document.getElementById("djOne");
  if (document.hidden || (deals.items || []).length < 2 || (dealsHidden() && !one)) return;
  dealIdx = (dealIdx + 1) % deals.items.length;
  const d = dealCur(), card = document.getElementById("dealCard"), tick = document.getElementById("dealTick");
  [card, tick, one].forEach(x => x && x.classList.add("fade"));
  setTimeout(() => {
    if (card && card.isConnected) { const l = card.querySelector(".dcLink"); l.href = dealHref(d); const old = l.querySelector(".dcImg"); if (old) old.outerHTML = dealImg(d, "dcImg"); card.querySelector(".dcT").textContent = d.text; card.classList.remove("fade"); }
    if (one && one.isConnected) { one.href = dealHref(d); const oi = one.querySelector(".djImg"); if (oi) oi.outerHTML = dealImg(d, "djImg"); one.querySelector(".djT").textContent = d.text; one.classList.remove("fade"); }
    dealsTick(); if (tick) tick.classList.remove("fade");
  }, 220);
}
function dealsHide() {
  store.set("dealsHideUntil", Date.now() + 24 * 3600e3);
  const c = document.getElementById("dealCard"); if (c) c.remove();
  dealsTick();
}
function dealsLoad() {
  if (dealLoading || Date.now() - (deals.at || 0) < 20 * 60e3) return;
  dealLoading = true;
  api("/api/deals").then(j => {
    if (!j || !Array.isArray(j.items)) return;
    const had = (deals.items || []).length;
    deals = { items: j.items.filter(d => d && d.text).slice(0, 10), join: /^https:\/\/t\.me\/\w+$/.test(j.join || "") ? j.join : DEALS_JOIN_DEFAULT, at: Date.now() };
    store.set("dealsCache", deals);
    if (dealIdx >= deals.items.length) dealIdx = 0;
    dealsTick();
    if (!had && deals.items.length && ((curTab === "library" && !subView) || (curTab === "home" && performance.now() < 3000 && !document.getElementById("dealCard") && view.scrollTop < 40))) rerender(); // first-ever load only; later visits render from cache with no jump
  }).catch(() => {}).finally(() => dealLoading = false);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) dealsLoad(); });
dealsTick(); dealsLoad();
dealTimer = setInterval(dealsRotate, 6000);
setInterval(dealsLoad, 5 * 60e3);
// ---- Import playlist from Spotify / Apple Music (public link -> match on JioSaavn -> new Dhun playlist) ----
let impJob = null; // { phase: "load"|"match"|"done"|"error", name, cover, source, total, done, found, missing:[], plId, msg }
function impSheetHTML() {
  const j = impJob;
  let body;
  if (!j || j.phase === "error") {
    body = `<div class="impPaste"><input id="impUrl" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://open.spotify.com/playlist/…" value="${esc((j && j.url) || "")}">
      <div class="impBtns">${navigator.clipboard && navigator.clipboard.readText ? `<button data-s="impPaste" class="impSec">Paste</button>` : ""}<button data-s="impGo" class="impPri">Import</button></div>
      ${j && j.msg ? `<div class="impErr">${esc(j.msg)}</div>` : ""}
      <div class="impHint">Spotify / Apple Music me playlist kholo → Share → <b>Copy link</b> → yahan paste karo. Playlist public honi chahiye.</div></div>`;
  } else {
    const pct = j.total ? Math.round((j.done / j.total) * 100) : 0;
    const head = `<div class="impPl">${j.cover ? `<img src="${esc(j.cover)}" alt="" referrerpolicy="no-referrer">` : `<div class="impPh">${j.source === "apple" ? AMICON : SPICON}</div>`}<div><b>${esc(j.name || "Playlist")}</b><small>${j.source === "apple" ? "Apple Music" : j.source === "spotify" ? "Spotify" : ""}${j.total ? ` · ${j.total} songs` : ""}</small></div></div>`;
    if (j.phase === "load") body = `<div class="impRun"><div class="impBig">Playlist khol rahe hain…</div><div class="impBar"><i class="indet"></i></div></div>`;
    else if (j.phase === "match") body = `${head}<div class="impRun"><div class="impBig" id="impBig">${j.found}/${j.total} mile</div><div class="impBar"><i id="impFill" style="width:${pct}%"></i></div><div class="impSub" id="impSub">JioSaavn pe dhoondh rahe hain · ${j.done}/${j.total} check hue</div><div class="impSub">Sheet band kar do to bhi chalta rahega</div></div>`;
    else body = `${head}<div class="impRun"><div class="impBig">✅ ${j.found}/${j.total} mile</div><div class="impSub">“${esc(j.name)}” playlist ban gayi${j.capped ? ` (pehle ${j.total} gaane)` : ""}</div>
      <div class="impBtns"><button data-s="impOpen" class="impPri">Open Playlist</button><button data-s="impAgain" class="impSec">Aur import karo</button></div>
      ${j.missing.length ? `<details class="impMiss"><summary>Not found (${j.missing.length})</summary><ol>${j.missing.map(t => `<li>${esc(t.title)}<small>${esc(t.artists)}</small></li>`).join("")}</ol></details>` : ""}</div>`;
  }
  return `<div class="sgroup impSheet" id="impBox"><div class="shead impHead"><div class="impLogos">${SPICON}${AMICON}</div><div><div class="t1">Import Playlist</div><div class="sub">Spotify ya Apple Music se</div></div></div>${body}</div>`;
}
function impShow() {
  showSheet(impSheetHTML(), {
    impGo: () => { const v = ($("#impUrl") || {}).value || ""; impStart(v); return true; },
    impPaste: () => { navigator.clipboard.readText().then(t => { const i = $("#impUrl"); if (i && t) { i.value = t.trim(); impStart(i.value); } }).catch(() => { toast("Paste nahi hua, link khud paste karo"); const i = $("#impUrl"); if (i) i.focus(); }); return true; },
    impOpen: () => { const id = impJob && impJob.plId; impJob = null; if (id) go("library", id); },
    impAgain: () => { impJob = null; impShow(); return true; },
  });
  const i = $("#impUrl"); if (i) { i.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); impStart(i.value); } }); }
}
function impRefresh() { // update the sheet only if it is open and showing import
  const box = document.getElementById("impBox"); if (!box || sheet.classList.contains("hidden")) return;
  if (impJob && impJob.phase === "match" && document.getElementById("impBig")) {
    const j = impJob; $("#impBig").textContent = `${j.found}/${j.total} mile`; $("#impFill").style.width = Math.round((j.done / j.total) * 100) + "%"; $("#impSub").textContent = `JioSaavn pe dhoondh rahe hain · ${j.done}/${j.total} check hue`; return;
  }
  impShow();
}
async function impPost(path, body) {
  const r = await fetch(IMP_BASE + path, { method: "POST", headers: { "content-type": "text/plain;charset=UTF-8" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("HTTP " + r.status); return r.json();
}
async function impStart(raw) {
  raw = String(raw || "").trim();
  if (impJob && (impJob.phase === "load" || impJob.phase === "match")) return;
  if (!raw) { toast("Pehle playlist ka link paste karo"); return; }
  if (!/spotify|apple\.com|spoti\.fi/i.test(raw)) { impJob = { phase: "error", url: raw, msg: "Ye Spotify / Apple Music link nahi lag raha. Playlist → Share → Copy link karke paste karo." }; return impRefresh(); }
  impJob = { phase: "load", url: raw, done: 0, found: 0, missing: [] }; impRefresh();
  let pl;
  try { pl = await impPost("/api/import", { url: raw }); } catch (e) { impJob = { phase: "error", url: raw, msg: navigator.onLine === false ? "Internet nahi hai, check karke dobara try karo." : "Abhi playlist load nahi ho payi, thodi der me try karo." }; return impRefresh(); }
  if (!pl || !pl.ok) { impJob = { phase: "error", url: raw, msg: (pl && pl.msg) || "Playlist nahi khuli. Playlist public karo (share link)." }; return impRefresh(); }
  const tracks = pl.tracks || [];
  const job = impJob = { phase: "match", url: raw, name: pl.name, cover: pl.cover, source: pl.source, total: tracks.length, capped: !!pl.capped, done: 0, found: 0, missing: [], res: new Array(tracks.length).fill(null) };
  impRefresh();
  const B = 6; const batches = []; for (let i = 0; i < tracks.length; i += B) batches.push(i);
  let next = 0;
  const worker = async () => {
    while (next < batches.length) {
      const s = batches[next++]; const part = tracks.slice(s, s + B);
      let res = null;
      for (let a = 0; a < 2 && !res; a++) { try { res = (await impPost("/api/import/match", { tracks: part })).results; } catch (e) { await new Promise(r => setTimeout(r, 800)); } }
      part.forEach((t, k) => { const m = res && res[k]; job.res[s + k] = m || null; job.done++; if (m) job.found++; });
      if (impJob === job) impRefresh();
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  if (impJob !== job) return;
  const seen = new Set(); const out = [];
  job.res.forEach((m, k) => { if (!m) { job.missing.push(tracks[k]); return; } if (seen.has(m.id)) return; seen.add(m.id); out.push(slim({ ...m, src: "saavn" })); });
  if (!out.length) { impJob = { phase: "error", url: raw, msg: "Is playlist ka koi gaana JioSaavn pe nahi mila 😕" }; return impRefresh(); }
  let name = String(pl.name || "Imported").trim().slice(0, 80) || "Imported", n = 2;
  const taken = x => playlists.some(p => (p.name || "").trim().toLowerCase() === x.toLowerCase());
  while (taken(name)) name = `${String(pl.name || "Imported").trim().slice(0, 74)} (${n++})`;
  const np = { id: "p" + Date.now().toString(36), name, tracks: out, from: pl.source };
  playlists.unshift(np); store.set("playlists", playlists);
  job.phase = "done"; job.name = name; job.plId = np.id;
  if (curTab === "library" && !subView) rerender();
  if (document.getElementById("impBox") && !sheet.classList.contains("hidden")) impShow(); else toast(`✅ “${name}” ready · ${job.found}/${job.total} gaane`);
}
document.addEventListener("click", e => { const b = e.target.closest("[data-act=importPl]"); if (b) { e.preventDefault(); e.stopPropagation(); if (impJob && (impJob.phase === "done" || impJob.phase === "error")) impJob = null; impShow(); } }, true);
// ---- Listening history (per user), For You, Your Recap ----
function histMergeL(a, b) {
  const by = new Map();
  for (const src of [a, b]) for (const s of ((src && src.songs) || [])) {
    if (!s || !s.id) continue; const o = by.get(s.id);
    if (!o) by.set(s.id, { ...s }); else { o.n = Math.max(o.n || 0, s.n || 0); o.first = Math.min(o.first || s.first || 0, s.first || o.first || 0); if ((s.last || 0) > (o.last || 0)) { o.last = s.last; for (const k of ["title", "artist", "album", "lang", "thumb"]) if (s[k]) o[k] = s[k]; } }
  }
  const days = {};
  for (const src of [a, b]) for (const [k, v] of Object.entries((src && src.days) || {})) {
    if (!v) continue; const o = days[k] || (days[k] = { t: 0, p: 0, s: {} });
    o.t = Math.max(o.t, +v.t || 0); o.p = Math.max(o.p, +v.p || 0); for (const [id, n] of Object.entries(v.s || {})) o.s[id] = Math.max(o.s[id] || 0, +n || 0);
  }
  return histTrim({ songs: [...by.values()], days });
}
function histTrim(h) {
  h.songs.sort((x, y) => (y.last || 0) - (x.last || 0)); if (h.songs.length > 1000) h.songs.length = 1000;
  const ks = Object.keys(h.days).sort(); for (const k of ks.slice(0, Math.max(0, ks.length - 380))) delete h.days[k];
  return h;
}
function histSave() { store.set("hist", hist); }
function histToday() { const k = dayKey(); return hist.days[k] || (hist.days[k] = { t: 0, p: 0, s: {} }); }
function histPlay(t) { // a play counts once the song has played 30 s
  if (!t || !t.id) return; const now = Date.now();
  let s = hist.songs.find(x => x.id === t.id);
  if (!s) { s = { id: t.id, title: t.title || "", artist: t.artist || "", album: t.album || "", lang: t.lang || "", thumb: t.thumb || "", n: 0, first: now, last: now }; hist.songs.unshift(s); }
  s.n = (s.n || 0) + 1; s.last = now; if (t.lang) s.lang = t.lang; if (t.thumb) s.thumb = t.thumb;
  const d = histToday(); d.p++; d.s[t.id] = (d.s[t.id] || 0) + 1;
  histTrim(hist); histSave(); histMark();
}
function histMark() { histDirty = true; clearTimeout(histSyncT); histSyncT = setTimeout(histSync, 45000); }
async function histSync() {
  if (!tgMe.linked || !tgCode || histBusy) return; histBusy = true;
  try {
    const sent = histDirty; histDirty = false;
    const r = await post("/api/u/hist", sent ? { op: "put", c: tgCode, h: hist } : { op: "get", c: tgCode });
    if (r && r.ok && r.h) { hist = histMergeL(r.h, hist); histSave(); }
    else if (sent) histDirty = true;
  } catch (e) { histDirty = true; } finally { histBusy = false; }
}
setInterval(() => {
  const t = queue[qi], a = audio; if (!t || !a) return;
  const ct = a.currentTime || 0;
  if (histCurId !== t.id || (ct + 3 < histLastT && ct < 5)) { histCurId = t.id; histCounted = false; }
  histLastT = ct;
  if (a.paused || a.ended) return;
  histSecs += 2; if (histSecs >= 10) { histToday().t += histSecs; histSecs = 0; histSave(); histDirty = true; }
  if (!histCounted && ct >= 30) { histCounted = true; histPlay(t); }
}, 2000);
document.addEventListener("visibilitychange", () => { if (document.hidden && histDirty) histSync(); });
setTimeout(histSync, 4000);

// For You
function fyProfile() {
  const now = Date.now(); const sc = s => (s.n || 0) * (1 + Math.max(0, 1 - (now - (s.last || 0)) / (30 * 864e5)));
  const top = hist.songs.filter(s => (s.n || 0) > 0).sort((a, b) => sc(b) - sc(a));
  const art = {}, lg = {};
  for (const s of hist.songs) { for (const a of String(s.artist || "").split(",").map(x => x.trim()).filter(Boolean).slice(0, 4)) art[a] = (art[a] || 0) + sc(s); if (s.lang) lg[s.lang] = (lg[s.lang] || 0) + (s.n || 0); }
  return { seeds: top.slice(0, 5).map(s => s.id), artists: Object.entries(art).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]), langs: Object.entries(lg).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]), exclude: hist.songs.filter(s => (s.n || 0) >= 3).map(s => s.id).slice(0, 300), day: dayKey() };
}
function fyLoad(force) {
  const prof = fyProfile(); const sig = JSON.stringify([prof.seeds, prof.artists, prof.langs]);
  const fresh = fy && fy.day === prof.day && (fy.sig === sig || Date.now() - (fy.at || 0) < 30 * 60e3);
  if ((!force && fresh) || fyLoading) return;
  fyLoading = true;
  impPost("/api/foryou", prof).then(r => {
    if (!r || !Array.isArray(r.songs) || (!r.songs.length && fy)) return;
    fy = { mode: r.mode, songs: r.songs.slice(0, 20), playlists: (r.playlists || []).slice(0, 10), sig, day: prof.day, at: Date.now() };
    store.set("fyCache", fy);
    if (curTab === "home") { if (force || view.scrollTop < 60 || !document.getElementById("fyRow")) rerender(); }
  }).catch(() => {}).finally(() => { fyLoading = false; });
}
function fyHomeHTML() {
  let h = recapCardHTML();
  if (!fy || !(fy.songs || []).length) { setTimeout(() => fyLoad(), 0); return h + `<h2>For You</h2><div class="car">${Array(4).fill('<div class="tile"><img class="skel"></div>').join("")}</div>`; }
  setTimeout(() => fyLoad(), 0);
  bindList("foryou", fy.songs);
  h += `<h2 id="fyRow">${fy.mode === "personal" ? "For You" : "Top Picks For You"} <a data-act="fyRefresh">Refresh</a></h2><div class="car">${fy.songs.map((t, i) => tileHTML(t, i, "foryou")).join("")}</div>`;
  if ((fy.playlists || []).length) h += `<h2>Playlists for You</h2><div class="car">${fy.playlists.map(p => `<button class="tile" data-svpl="${esc(p.id)}"><img loading="lazy" src="${esc(p.image || "/icon-192.png")}" onerror="this.onerror=null;this.src='/icon-192.png'" alt=""><div class="t1">${esc(p.title)}</div><div class="t2">${p.count ? p.count + " songs" : "Playlist"}</div></button>`).join("")}</div>`;
  return h;
}
// JioSaavn playlists opened from "Playlists for You"
function svPlGet(pid) {
  const c = svPls[pid]; if (c && c.tracks) return c;
  if (!c) { svPls[pid] = { id: "sv:" + pid, name: "Loading…", tracks: [], fixed: true, remote: true, loading: true };
    fetch(IMP_BASE + "/api/svpl?id=" + encodeURIComponent(pid)).then(r => r.json()).then(d => { svPls[pid] = { id: "sv:" + pid, name: d.title || "Playlist", tracks: (d.items || []), fixed: true, remote: true }; if (subView === "sv:" + pid) rerender(); })
      .catch(() => { svPls[pid] = { id: "sv:" + pid, name: "Couldn't load playlist", tracks: [], fixed: true, remote: true }; if (subView === "sv:" + pid) rerender(); }); }
  return svPls[pid];
}
// Recap (Week / Month / Year)
function recapCalc(period) {
  const days = RECAP[period][0]; const since = Date.now() - days * 864e5; const sinceKey = dayKey(since + 864e5);
  let secs = 0, plays = 0; const cnt = {}, perDay = {};
  for (const [k, v] of Object.entries(hist.days)) { if (k < sinceKey) continue; secs += v.t || 0; plays += v.p || 0; perDay[k] = v.t || 0; for (const [id, n] of Object.entries(v.s || {})) cnt[id] = (cnt[id] || 0) + n; }
  const meta = new Map(hist.songs.map(s => [s.id, s]));
  const topSongs = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, n]) => ({ ...(meta.get(id) || { id, title: "Song", artist: "" }), plays: n }));
  const ac = {}, lc = {};
  for (const [id, n] of Object.entries(cnt)) { const s = meta.get(id); if (!s) continue; for (const a of String(s.artist || "").split(",").map(x => x.trim()).filter(Boolean).slice(0, 3)) ac[a] = (ac[a] || 0) + n; if (s.lang) lc[s.lang] = (lc[s.lang] || 0) + n; }
  const topArtists = Object.entries(ac).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, n]) => ({ name, plays: n }));
  const lang = Object.entries(lc).sort((a, b) => b[1] - a[1])[0];
  const best = Object.entries(perDay).sort((a, b) => b[1] - a[1])[0];
  const discoveries = hist.songs.filter(s => (s.first || 0) >= since).length;
  return { period, days, minutes: Math.round(secs / 60), plays, songs: Object.keys(cnt).length, topSongs, topArtists, lang: lang ? lang[0] : "", bestDay: best && best[1] > 0 ? best[0] : "", bestMin: best ? Math.round(best[1] / 60) : 0, discoveries };
}
function bestDayLabel(k) { if (!k) return "—"; const [y, m, d] = k.split("-").map(Number); const dt = new Date(y, m - 1, d); return dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }); }
function recapCardHTML() {
  const r = recapCalc("week");
  return `<button class="recapCard" data-act="recap"><span class="rcL"><b>Your Week in Dhun 🎧</b><small>${r.plays ? `${r.minutes} min · ${r.plays} plays · top: ${esc((r.topSongs[0] || {}).title || "")}` : "Gaane suno, aapka weekly recap yahan banega"}</small></span><span class="rcGo">${ICON.chev}</span></button>`;
}
function renderRecap() {
  const r = recapCalc(recapPeriod); const lbl = RECAP[recapPeriod][1];
  let h = `<button class="back" data-act="back">${ICON.chev}${svBackHome ? "Listen Now" : "Library"}</button><h1>Your Recap</h1>
  <div class="rcTabs">${Object.keys(RECAP).map(k => `<button data-act="recapP" data-p="${k}" class="${k === recapPeriod ? "on" : ""}">${RECAP[k][1]}</button>`).join("")}</div>`;
  if (!r.plays) {
    h += `<div class="rcBox rcEmpty"><div class="rcEm">🎧</div><b>Abhi recap khaali hai</b><p>Is ${lbl.toLowerCase()} koi gaana 30 sec se zyada nahi suna. Gaane suno, aapka “Your ${lbl} in Dhun” yahan apne aap banega.</p></div>`;
    view.innerHTML = h; return;
  }
  h += `<div class="rcBox rcHero"><small>Your ${lbl} in Dhun</small><div class="rcMin">${r.minutes.toLocaleString("en-IN")}</div><div class="rcMinL">minutes listened</div>
    <div class="rcStats"><div><b>${r.plays}</b><small>plays</small></div><div><b>${r.songs}</b><small>songs</small></div><div><b>${r.discoveries}</b><small>new discoveries</small></div></div></div>
  <div class="rcBox"><h3>Top Songs</h3>${r.topSongs.map((s, i) => `<div class="rcRow" data-rcplay="${i}"><span class="rcN">${i + 1}</span><img src="${esc(small(s.thumb) || "/icon-192.png")}" onerror="this.onerror=null;this.src='/icon-192.png'" alt=""><span class="rcT"><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span><span class="rcC">${s.plays}×</span></div>`).join("")}</div>
  <div class="rcBox"><h3>Top Artists</h3>${r.topArtists.map((a, i) => `<div class="rcRow"><span class="rcN">${i + 1}</span><span class="rcT"><b>${esc(a.name)}</b></span><span class="rcC">${a.plays} plays</span></div>`).join("")}</div>
  <div class="rcGrid"><div class="rcBox"><small>Top language</small><b>${esc(cap1(r.lang) || "—")}</b></div><div class="rcBox"><small>Most-played day</small><b>${esc(bestDayLabel(r.bestDay))}</b>${r.bestMin ? `<small>${r.bestMin} min</small>` : ""}</div></div>
  <div class="btnRow" style="margin-top:16px"><button data-act="recapShare">${ICON.share}Share my Recap</button></div>`;
  view.innerHTML = h;
  bindList("recapTop", r.topSongs.map(s => ({ ...s, src: s.src || "saavn" })));
}
async function recapShare() {
  const r = recapCalc(recapPeriod), lbl = RECAP[recapPeriod][1];
  try { await document.fonts.load('700 40px "DhunComic"'); } catch (e) {}
  const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#fa2d48"); g.addColorStop(0.55, "#7a1235"); g.addColorStop(1, "#141414"); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const F = (w, s) => `${w} ${s}px "Comic Sans MS","Comic Neue","DhunComic",sans-serif`;
  x.fillStyle = "#fff"; x.textAlign = "left";
  x.font = F(700, 44); x.fillText(`Your ${lbl} in Dhun 🎧`, 80, 130);
  x.font = F(700, 150); x.fillText(r.minutes.toLocaleString("en-IN"), 80, 310); x.font = F(400, 40); x.fillText("minutes listened", 86, 370);
  x.font = F(700, 46); x.fillText(`${r.plays} plays · ${r.songs} songs · ${r.discoveries} new`, 80, 460);
  const fit = (s, w) => { s = String(s || ""); while (s.length > 3 && x.measureText(s).width > w) s = s.slice(0, -2); return s === String(s) ? s : s; };
  x.font = F(700, 44); x.fillText("Top Songs", 80, 560);
  r.topSongs.forEach((s, i) => { x.font = F(700, 38); x.fillText(`${i + 1}. ${fit(s.title, 820)}`, 80, 625 + i * 62); });
  x.font = F(700, 44); x.fillText("Top Artists", 80, 980);
  x.font = F(400, 36); x.fillText(fit(r.topArtists.slice(0, 3).map(a => a.name).join(" · "), 920), 80, 1040);
  x.font = F(400, 34); x.fillText(`Top language: ${cap1(r.lang) || "—"}   ·   Best day: ${bestDayLabel(r.bestDay)}`.slice(0, 70), 80, 1120);
  x.font = F(700, 40); x.fillStyle = "rgba(255,255,255,.85)"; x.fillText("Dhun · dhun.sites.tab.bot", 80, 1260);
  const blob = await new Promise(res => c.toBlob(res, "image/png"));
  const file = new File([blob], `dhun-recap-${recapPeriod}.png`, { type: "image/png" });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: `My ${lbl} in Dhun` }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); toast("Recap image saved 📸");
}
document.addEventListener("click", e => {
  const sp = e.target.closest("[data-svpl]"); if (sp) { e.preventDefault(); e.stopPropagation(); svBackHome = curTab === "home"; go("library", "sv:" + sp.dataset.svpl); return; }
  const rp = e.target.closest("[data-rcplay]"); if (rp) { e.preventDefault(); e.stopPropagation(); const l = lists.recapTop; if (l) playList(l, +rp.dataset.rcplay); return; }
  const b = e.target.closest("[data-act]"); if (!b) return; const a = b.dataset.act;
  if (a === "fyRefresh") { e.preventDefault(); e.stopPropagation(); toast("For You refresh ho raha hai…"); fyLoad(true); return; }
  if (a === "recap") { e.preventDefault(); e.stopPropagation(); svBackHome = curTab === "home"; go("library", "recap"); return; }
  if (a === "recapP") { e.preventDefault(); e.stopPropagation(); recapPeriod = b.dataset.p; store.set("recapPeriod", recapPeriod); rerender(); return; }
  if (a === "recapShare") { e.preventDefault(); e.stopPropagation(); recapShare(); return; }
  if (a === "savePl") { e.preventDefault(); e.stopPropagation(); const pl = subView && getPlaylist(subView); if (!pl || !pl.tracks.length) return; const np = { id: "p" + Date.now().toString(36), name: pl.name, tracks: pl.tracks.map(slim) }; playlists.unshift(np); store.set("playlists", playlists); toast(`“${pl.name}” Library me add ho gayi ✅`); return; }
  if (a === "back" && (svBackHome && (String(subView || "").startsWith("sv:") || subView === "recap"))) { e.preventDefault(); e.stopPropagation(); svBackHome = false; go("home"); return; }
}, true);


// ---------- Resume where you left off (app closed / swiped away / reloaded) ----------
// The resume point is {id, pos} of the song in the player; it is never written before a song is actually loaded,
// so a fresh start can no longer overwrite it with 0:00.
function savePos() {
  try {
    const t = queue[qi]; if (!t) return;
    if (mode !== "yt" && (!audio.src || audio.readyState < 1)) return;
    const cur = P.time(); if (!isFinite(cur)) return;
    store.set("pos", cur); store.set("posInfo", { id: t.id, pos: Math.round(cur * 10) / 10, at: Date.now() });
  } catch (e) {}
}
function resumeAt() {
  const t = queue[qi]; if (!t) return 0;
  const pi = store.get("posInfo", null);
  if (pi && pi.id === t.id) return Math.max(0, Number(pi.pos) || 0);
  return pi ? 0 : Math.max(0, Number(store.get("pos", 0)) || 0); // older builds kept only "pos"
}
function showResumePoint() { // restored song: show where it will continue from
  const t = queue[qi]; if (!t || audio.src) return;
  const p = resumeAt(), d = Number(t.dur) || 0; if (!p) return;
  const pct = d ? Math.min(100, p / d * 100) : 0;
  $("#miniProg div").style.width = pct + "%";
  const s = $("#seek"); s.value = d ? Math.round(p / d * 1000) : 0; s.style.setProperty("--p", pct + "%");
  $("#tCur").textContent = fmt(p); if (d) $("#tDur").textContent = "-" + fmt(Math.max(0, d - p));
}
showResumePoint();
document.addEventListener("visibilitychange", () => { if (document.hidden) savePos(); });
window.addEventListener("pagehide", savePos); window.addEventListener("beforeunload", savePos);
document.addEventListener("pause", savePos); // Android: app sent to background
// ---------- Listen Together (Jam): shared room on the server; every device streams the song itself and follows the room's clock ----------
const JAM_BASE = IMP_BASE, JAM_SITE = "https://dhun.sites.tab.bot/";
const JAM_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3a8 8 0 00-8 8v5.5A2.5 2.5 0 006.5 19H8v-7H6v-1a6 6 0 0112 0v1h-2v7h1.5a2.5 2.5 0 002.5-2.5V11a8 8 0 00-8-8z"/><circle cx="12" cy="21" r="1.2"/><circle cx="8.2" cy="21" r="1.2"/><circle cx="15.8" cy="21" r="1.2"/></svg>';
let jam = null; // {code, rev, st, mem, lastOk}
let jamMid = store.get("jamMid", ""); if (!/^[\w-]{6,40}$/.test(jamMid)) { jamMid = "m" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); store.set("jamMid", jamMid); }
let jamApplying = false, jamPollT = 0, jamHbAt = 0, jamOffs = [], jamOff = 0, jamSeekAt = 0, jamLoadAt = 0, jamBusy = false, jamFill = null, jamFillFor = "", jamPend = 0, jamFail = 0, jamPeek = null;
const jamOn = () => !!(jam && jam.code);
const jamNow = () => Date.now() + jamOff;
const jamName = () => String(store.get("jamName", "") || tgMe.first || (tgMe.name || "").split(" ")[0] || "").slice(0, 24);
const jamExp = st => !st || !st.song ? 0 : Math.max(0, st.playing ? st.pos + (jamNow() - st.at) / 1000 : st.pos);
const jamLink = c => JAM_SITE + "?jam=" + c;
const jamColor = s => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 360; return `hsl(${h},62%,46%)`; };
const jamAv = (m, big) => `<i class="jamAv${big ? " big" : ""}" style="background:${jamColor(m.m)}">${esc((m.n || "?").trim().charAt(0).toUpperCase() || "?")}</i>`;
function jamSample(t0, t1, now) { if (!now) return; const rtt = t1 - t0; jamOffs.push({ rtt, off: now - (t0 + t1) / 2 }); if (jamOffs.length > 16) jamOffs.shift(); const best = jamOffs.slice().sort((a, b) => a.rtt - b.rtt)[0]; jamOff = best.off; }
async function jamReq(path, body) {
  const t0 = Date.now();
  const r = await fetch(JAM_BASE + path, body ? { method: "POST", headers: { "content-type": "text/plain;charset=UTF-8" }, body: JSON.stringify(body), cache: "no-store" } : { cache: "no-store" });
  const t1 = Date.now(); if (!r.ok && r.status !== 409) throw new Error("HTTP " + r.status);
  const j = await r.json(); jamSample(t0, t1, j.now); return j;
}
async function jamClock() { for (let k = 0; k < 4; k++) { try { await jamReq("/api/jam/t?_=" + Math.random()); } catch (e) {} } }
const jamSlim = t => { const o = slim(t); delete o.tg; if (!o.url) { const u = urlOf(t); if (/^https:/.test(u)) o.url = u; } return o; };
function jamUnlock() { // inside the tap: lets later play() calls start audio (iOS / Chrome autoplay rules)
  try { if (audio.paused && mode !== "yt") { const p = audio.play(); if (p) p.catch(() => {}); audio.pause(); } } catch (e) {} // a paused song stays paused, at its place
}
// ----- applying the room's state to this device -----
function jamApply(st, fromServer) {
  if (!st) return;
  const prevSt = jam.st; jam.st = st;
  const want = st.song, cur = queue[qi];
  if (!want) { renderJamUI(); return; }
  jamApplying = true;
  try {
    if (!cur || cur.id !== want.id) {
      queue = [want].concat(st.queue || []).map(slim); qi = 0; autoplayAdded = new Set(); saveQ();
      jamLoadAt = Date.now(); jamSeekAt = Date.now(); if (audio.playbackRate !== 1) audio.playbackRate = 1;
      loadCurrent(!!st.playing, jamExp(st));
      if (!st.playing) { userPaused = true; syncPlay(); }
      jamPrefetchFill();
    } else {
      const ids = (st.queue || []).map(x => x.id).join(","), mine = queue.slice(qi + 1).map(x => x.id).join(",");
      if (qi !== 0 || ids !== mine) { queue = [cur].concat((st.queue || []).map(slim)); qi = 0; saveQ(); renderQueue(); prepNext(); jamPrefetchFill(); }
      jamCheck(true);
    }
  } finally { jamApplying = false; }
  renderJamUI();
}
function jamCheck(force) { // keep this device on the room's clock: play/pause + drift correction
  if (!jamOn() || !jam.st || !jam.st.song) return;
  const st = jam.st, cur = queue[qi]; if (!cur || cur.id !== st.song.id) return;
  const exp = jamExp(st), now = Date.now();
  jamApplying = true;
  try {
    if (!st.playing) {
      if (P.playing()) rawPause();
      if (audio.playbackRate !== 1) audio.playbackRate = 1;
      if (Math.abs(P.time() - exp) > 1 && now - jamSeekAt > 1500 && (mode === "yt" || audio.readyState >= 1)) { jamSeekAt = now; rawSeek(exp); }
      return;
    }
    const d = P.dur(); if (d && exp > d + 1) return; // song over on the room's clock; whoever hits 'ended' first moves the room on
    if (!P.playing()) { if (!userPaused || force) { if (mode !== "yt" && !audio.src) loadCurrent(true, exp); else rawPlay(); } return; }
    if (mode === "yt") { const dd = P.time() - exp; if (Math.abs(dd) > 1.5 && now - jamSeekAt > 4000) { jamSeekAt = now; rawSeek(exp); } return; }
    if (audio.readyState < 3 || now - jamLoadAt < 1200) return; // still buffering
    const drift = audio.currentTime - exp;
    if (Math.abs(drift) > 1.5) { if (now - jamSeekAt > 3500) { jamSeekAt = now; audio.playbackRate = 1; rawSeek(exp + 0.1); } return; }
    // small drift: nudge the speed a little until it is back in step (pitch is preserved)
    const r = Math.abs(drift) < 0.12 ? 1 : (drift > 0 ? 0.95 : 1.05);
    if (Math.abs(drift) < 0.35 && audio.playbackRate === 1) return;
    if (audio.playbackRate !== r) audio.playbackRate = r;
  } finally { jamApplying = false; }
}
setInterval(() => { if (jamOn()) jamCheck(false); }, 700);
// ----- talking to the room -----
async function jamAct(a, optimistic) {
  if (!jamOn()) return;
  if (optimistic) { try { optimistic(); } catch (e) {} }
  jamPend++;
  try {
    const j = await jamReq("/api/jam/act", { c: jam.code, m: jamMid, n: jamName(), a });
    if (j.gone) return jamGone(j.ended);
    if (j.ok && j.st && j.rev >= (jam.rev || 0)) { jam.rev = j.rev; if (j.mem) jamMembers(j.mem); jamApply(j.st, true); }
  } catch (e) { toast("Listen Together: connection slow, retry ho raha hai…"); }
  finally { jamPend--; }
}
function jamPredict(mut) { // apply a change on this phone right away; the server's answer confirms it
  const st = JSON.parse(JSON.stringify(jam.st || {})); if (st.song) st.pos = jamExp(st); st.at = jamNow(); // carry the room's clock forward first, so queue/shuffle/etc. never pull the song back
  mut(st); st.at = jamNow(); jamApply(st, false);
}
async function jamPoll() {
  clearTimeout(jamPollT); if (!jamOn()) return;
  const code = jam.code;
  if (!jamBusy && !jamPend) {
    jamBusy = true;
    try {
      const hb = Date.now() - jamHbAt > 8000; if (hb) jamHbAt = Date.now();
      const j = await jamReq(`/api/jam/get?c=${code}&m=${jamMid}&r=${jam.rev || 0}&k=${jamChatK}${hb ? "&hb=1&n=" + encodeURIComponent(jamName()) : ""}&_=${Date.now() % 1e6}`);
      if (!jamOn() || jam.code !== code) return;
      jamFail = 0;
      if (j.gone) return jamGone(j.ended);
      if (j.chat) jamChatIn(j.chat, false);
      if (j.mem) jamMembers(j.mem);
      if (!j.same && j.st && j.rev > (jam.rev || 0) && !jamPend) { const ev = j.st.ev, by = j.st.by; jam.rev = j.rev; jamToast(ev, by); jamApply(j.st, true); }
    } catch (e) { jamFail++; if (jamFail === 4) toast("Listen Together: internet slow hai…"); }
    finally { jamBusy = false; }
  }
  jamPollT = setTimeout(jamPoll, document.hidden ? 3000 : 1400);
}
function jamToast(ev, by) {
  if (!ev || !by || by.m === jamMid) return; const n = by.n || "Koi";
  const T = { song: `${n} ne gaana badla: ${ev.title || ""}`, next: `${n} ne next gaana lagaya`, prev: `${n} ne pichhla gaana lagaya`, pause: `${n} ne pause kiya ⏸`, play: `${n} ne play kiya ▶️`,
    seek: `${n} ne gaana ${ev.to > ev.from ? "aage" : "peeche"} kiya`, add: `${n} ne queue me add kiya: ${ev.title || ""}`, rm: `${n} ne queue se hataya: ${ev.title || ""}`, top: `${n} ne ${ev.title || "gaana"} next kiya`, shuffle: `${n} ne queue shuffle ki`, station: `${n} ne station shuru kiya: ${ev.title || ""}` }[ev.t];
  if (T) toast(T);
}
function jamMembers(mem) {
  const old = jam.mem || [], had = new Set(old.map(m => m.m)), has = new Set(mem.map(m => m.m));
  if (jam.memInit) {
    mem.forEach(m => { if (!had.has(m.m) && m.m !== jamMid) toast(`${m.n} join hue 🎧`); });
    old.forEach(m => { if (!has.has(m.m) && m.m !== jamMid) toast(`${m.n} chale gaye`); });
  }
  jam.memInit = true; const changed = old.map(m => m.m + m.n).join() !== mem.map(m => m.m + m.n).join(); jam.mem = mem; if (changed) renderJamUI();
}
function jamGone(ended) { // the room is over: this phone goes back to solo, the song keeps playing from where it is
  const by = ended && ended.n && ended.m !== jamMid ? ended.n : "";
  jamStop(); if (!sheet.classList.contains("hidden") && document.getElementById("jamBox")) closeSheet();
  toast(by ? `${by} ne Listen Together band kiya` : "Listen Together session khatam ho gaya");
}
function jamStop() { clearTimeout(jamPollT); jam = null; store.set("jam", null); if (audio.playbackRate !== 1) audio.playbackRate = 1; jamChatReset(); renderJamUI(); if (curTab === "library" || curTab === "home") rerender(); }
async function jamEnd() { // Stop for everyone
  if (!jamOn()) return; const code = jam.code;
  jamStop(); toast("Listen Together band kar diya (sabke liye) — gaana aapke phone pe chalta rahega");
  for (let k = 0; k < 3; k++) { try { const j = await jamReq("/api/jam/end", { c: code, m: jamMid, n: jamName() }); if (j.ok || j.gone) return; } catch (e) {} await new Promise(r => setTimeout(r, 800)); }
}
function jamEndConfirm() {
  if (!jamOn()) return;
  showSheet(`<div class="sgroup jamSheet"><div class="jamHead"><i class="jamIco">${JAM_ICON}</i><div><b>Listen Together band karein?</b><div class="sub">Session sabke liye khatam ho jayega (${(jam.mem || []).length} log). Gaana sabke phone pe chalta rahega.</div></div></div>
    <button data-s="jamEndGo" class="danger">Haan, sabke liye band karo</button><button data-s="jamLeave">Sirf main nikalun (Leave)</button></div>`, { jamEndGo: () => { jamEnd(); }, jamLeave: () => { jamLeave(false); } });
}
async function jamStart() {
  const nm = jamName(); if (!nm) return toast("Pehle apna naam likho");
  const cur = queue[qi];
  const st = cur ? { song: jamSlim(cur), playing: P.playing(), pos: curPos(), queue: queue.slice(qi + 1, qi + 51).map(jamSlim) } : {}; // the song keeps its place
  jamClock();
  try {
    const j = await jamReq("/api/jam/new", { m: jamMid, n: nm, st });
    if (!j.ok) throw new Error(j.msg || "fail");
    jam = { code: j.code, rev: j.rev, st: j.st, mem: j.mem, memInit: true }; store.set("jam", { code: j.code }); jamChatReset(); if (j.chat) jamChatIn(j.chat, true);
    jamApply(j.st, true); jamHbAt = Date.now(); jamPoll(); jamPrefetchFill();
    jamSheet(); if (curTab === "library" || curTab === "home") rerender();
    toast("Listen Together shuru 🎧 code: " + j.code);
  } catch (e) { toast("Session start nahi hua, internet check karo"); }
}
async function jamJoin(code, quiet) {
  code = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== 6) { if (!quiet) jamErr("6 letter ka code daalo"); return; }
  const nm = jamName(); if (!nm && !quiet) { jamErr("Pehle apna naam likho"); return; }
  if (jamOn() && jam.code !== code) await jamLeave(true);
  jamOffs = []; await jamClock();
  try {
    const j = await jamReq("/api/jam/join", { c: code, m: jamMid, n: nm || "Dost" });
    if (!j.ok) { if (quiet) { store.set("jam", null); if (j.ended && j.ended.n) toast(`${j.ended.n} ne Listen Together band kiya`); return; } return jamErr(j.msg || "Join nahi hua"); }
    jam = { code, rev: j.rev, st: null, mem: j.mem, memInit: true }; store.set("jam", { code }); jamChatReset(); if (j.chat) jamChatIn(j.chat, true);
    jamApply(j.st, true); jamHbAt = Date.now(); jamPoll();
    if (!quiet) { closeSheet(); openNP(); const host = (j.st.by && j.st.by.n) || ""; toast(j.st.song ? `Listen Together me aa gaye 🎧 ${j.mem.length} log sun rahe hain` : `Join ho gaye 🎧 ${host ? host + " " : ""}gaana lagayenge to yahan bajega`); }
    if (curTab === "library" || curTab === "home") rerender();
  } catch (e) { if (!quiet) jamErr("Internet slow hai, dobara try karo"); }
}
async function jamLeave(silent) {
  if (!jamOn()) return; const code = jam.code;
  jamStop();
  try { await jamReq("/api/jam/leave", { c: code, m: jamMid }); } catch (e) {}
  if (!silent) toast("Listen Together se nikal gaye — gaana aapke phone pe chalta rahega");
}
function jamErr(msg) { const e = document.getElementById("jamErr"); if (e) { e.textContent = msg; e.hidden = false; } else toast(msg); }
// when the room's queue is empty, have the next song ready so 'ended' can switch instantly even with the screen locked
async function jamPrefetchFill() {
  const st = jam && jam.st; if (!st || !st.song || (st.queue || []).length || jamFillFor === st.song.id) return;
  const sid = st.song.id; jamFillFor = sid; jamFill = null;
  try { const d = await api(radioURL(st.song)); if (jamFillFor === sid) jamFill = freshSongs(d.items, [st.song]).slice(0, 15).map(jamSlim); } catch (e) { jamFillFor = ""; }
}
// ----- the player's controls, routed through the room while a session is on -----
const rawPlay = P.play, rawPause = P.pause, rawSeek = P.seek;
P.play = function () {
  if (!jamOn() || jamApplying) return rawPlay();
  const st = jam.st;
  if (!st || !st.song) return rawPlay();
  if (st.playing) { userPaused = false; rawPlay(); jamSeekAt = 0; setTimeout(() => jamCheck(true), 300); return; } // already playing in the room: just catch up
  const pos = P.time() || st.pos || 0; rawPlay();
  jamAct({ t: "play", pos }, () => { st.playing = true; st.pos = pos; st.at = jamNow(); });
};
P.pause = function () {
  if (!jamOn() || jamApplying) return rawPause();
  const st = jam.st, pos = P.time(); rawPause();
  if (!st || !st.song) return;
  jamAct({ t: "pause", pos }, () => { st.playing = false; st.pos = pos; st.at = jamNow(); });
};
P.seek = function (s) {
  if (!jamOn() || jamApplying) return rawSeek(s);
  const st = jam.st; rawSeek(s); jamSeekAt = Date.now();
  if (!st || !st.song) return;
  jamAct({ t: "seek", pos: s }, () => { st.pos = s; st.at = jamNow(); });
};
const rawNext = next, rawPrev = prev, rawPlayList = playList, rawAddToQueue = addToQueue, rawStartRadio = startRadio, rawFill = maybeAutoplayFill;
next = function (auto) {
  if (!jamOn()) return rawNext(auto);
  const st = jam.st; if (!st || !st.song) return;
  const k = songKey(st.song); let q0 = st.queue || [];
  if (auto) { let i = 0; while (i < q0.length && songKey(q0[i]) === k) i++; q0 = q0.slice(i); } // never "next" into a copy of the song that just ended
  const fill = q0.length ? null : (jamFillFor === st.song.id ? (jamFill || []) : []).filter(x => songKey(x) !== k);
  const nx = q0[0] || (fill && fill[0]);
  if (!nx && auto) { // room queue empty and no similar songs ready yet: fetch them now, then move the room on
    userPaused = true; syncPlay(); const sid = st.song.id;
    api(radioURL(st.song)).then(d => { if (!jamOn() || !jam.st || !jam.st.song || jam.st.song.id !== sid) return; jamFillFor = sid; jamFill = freshSongs(d.items, [st.song]).slice(0, 15).map(jamSlim); if (jamFill.length) next(true); else jamAct({ t: "ended", id: sid }); }).catch(() => jamAct({ t: "ended", id: sid }));
    return;
  }
  if (!nx) { toast("Queue khali hai — koi gaana chalao"); jamAct({ t: "next" }); return; }
  const a = auto ? { t: "ended", id: st.song.id } : { t: "next" }; if (fill) a.fill = fill;
  jamPredict(s => { if (s.song) s.hist = (s.hist || []).concat([s.song]).slice(-30); const q = q0.length ? q0.map(x => JSON.parse(JSON.stringify(x))) : (fill || []); s.song = q[0]; s.queue = q.slice(1); s.pos = 0; s.playing = true; s.by = { m: jamMid, n: jamName() }; });
  jamAct(a);
};
prev = function () {
  if (!jamOn()) return rawPrev();
  const st = jam.st; if (!st || !st.song) return;
  if (P.time() > 3 || !(st.hist || []).length) return P.seek(0);
  jamPredict(s => { const h = s.hist || []; const p = h.pop(); s.hist = h; s.queue = [s.song].concat(s.queue || []); s.song = p; s.pos = 0; s.playing = true; });
  jamAct({ t: "prev" });
};
playList = function (list, i) {
  if (!jamOn()) return rawPlayList(list, i);
  i = Math.max(0, Math.min(i, list.length - 1)); const t = list[i]; if (!t) return;
  const track = jamSlim(t), rest = list.slice(i + 1, i + 51).map(jamSlim);
  if (jam.st && jam.st.song && jam.st.song.id === track.id && keepCur(track)) { // same song: everyone keeps their place
    jamPredict(s => { const q = rest.filter(x => x.id !== track.id); if (!(s.queue || []).length) s.queue = q; s.pos = jamExp(s); s.playing = true; });
    return jamAct({ t: "song", track, list: rest });
  }
  jamPredict(s => { s.queue = (s.queue || []).filter(x => x.id !== track.id); if (!s.queue.length) s.queue = rest.filter(x => x.id !== track.id); if (s.song) s.hist = (s.hist || []).concat([s.song]).slice(-30); s.song = track; s.pos = 0; s.playing = true; });
  jamAct({ t: "song", track, list: rest });
};
addToQueue = function (t, nx) {
  if (!jamOn()) return rawAddToQueue(t, nx);
  const track = jamSlim(t);
  if (!jam.st || !jam.st.song) return playList([t], 0);
  jamPredict(s => { s.queue = s.queue || []; if (nx) s.queue.unshift(track); else s.queue.push(track); });
  toast(nx ? "Sabke liye next me laga diya 🎧" : "Sabki queue me add ho gaya 🎧");
  jamAct({ t: "add", track, next: !!nx });
};
startRadio = function (t) {
  if (!jamOn()) return rawStartRadio(t);
  toast("📻 Radio shuru ho raha hai…");
  const track = jamSlim(t), same = !!(jam.st && jam.st.song && jam.st.song.id === track.id && keepCur(track));
  api(radioURL(t) + "&long=1").then(d => {
    const more = freshSongs(d.items, [t]).slice(0, 50).map(jamSlim);
    if (!jamOn()) return rawStartRadio(t);
    jamPredict(s => { if (same) { s.pos = jamExp(s); s.playing = true; } else { if (s.song) s.hist = (s.hist || []).concat([s.song]).slice(-30); s.song = track; s.pos = 0; s.playing = true; } s.queue = more; });
    jamAct({ t: "song", track, list: more, rq: 1 });
  }).catch(() => { if (!same) playList([t], 0); else toast("Station nahi mila, internet check karo"); });
};
maybeAutoplayFill = function () { if (jamOn()) return; return rawFill(); };
// queue panel: rows act on the room's queue
$("#queueList").addEventListener("click", e => {
  if (!jamOn() || !jam.st) return;
  const row = e.target.closest("[data-i]"); if (!row) return;
  e.stopPropagation(); e.preventDefault();
  const i = +row.dataset.i - qi - 1, t = (jam.st.queue || [])[i]; if (!t) return;
  if (e.target.closest("[data-more]")) {
    return showSheet(`<div class="sgroup"><div class="shead"><div class="t1">${esc(t.title)}</div></div><button data-s="play">Abhi chalao ${ICON.play || ""}</button><button data-s="top">Next me lagao ${ICON.playNext}</button><button data-s="rm" class="danger">Queue se hatao ${ICON.trash}</button></div>`, {
      play: () => { jamPredict(s => { s.queue.splice(i, 1); if (s.song) s.hist = (s.hist || []).concat([s.song]); s.song = t; s.pos = 0; s.playing = true; }); jamAct({ t: "qplay", i, id: t.id }); },
      top: () => { jamPredict(s => { s.queue.splice(i, 1); s.queue.unshift(t); }); jamAct({ t: "top", i, id: t.id }); },
      rm: () => { jamPredict(s => { s.queue.splice(i, 1); }); jamAct({ t: "rm", i, id: t.id }); } });
  }
  jamPredict(s => { s.queue.splice(i, 1); if (s.song) s.hist = (s.hist || []).concat([s.song]); s.song = t; s.pos = 0; s.playing = true; });
  jamAct({ t: "qplay", i, id: t.id });
}, true);
$("#npShuffle").addEventListener("click", e => { if (!jamOn()) return; e.stopImmediatePropagation(); jamPredict(s => { const q = s.queue || []; for (let k = q.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [q[k], q[j]] = [q[j], q[k]]; } }); jamAct({ t: "shuffle" }); toast("Sabki queue shuffle ho gayi"); }, true);
if ("mediaSession" in navigator) { try { navigator.mediaSession.setActionHandler("previoustrack", () => prev()); navigator.mediaSession.setActionHandler("nexttrack", () => next(false)); } catch (e) {} }
document.addEventListener("visibilitychange", () => { if (!document.hidden && jamOn()) { jamOffs = jamOffs.slice(-4); jamPoll(); setTimeout(() => jamCheck(true), 400); } });
window.addEventListener("online", () => { if (jamOn()) jamPoll(); });
// ----- UI -----
const npJamBtn = document.createElement("button"); npJamBtn.id = "npJam"; npJamBtn.className = "icon small"; npJamBtn.setAttribute("aria-label", "Listen Together"); npJamBtn.innerHTML = JAM_ICON + '<b class="jamBadge"></b>';
$(".npBottom").insertBefore(npJamBtn, $("#npRepeat")); npJamBtn.onclick = () => jamSheet();
const npJamBar = document.createElement("button"); npJamBar.id = "npJamBar"; npJamBar.className = "hidden"; $("#npStatus").insertAdjacentElement("afterend", npJamBar); npJamBar.onclick = e => { if (e.target.closest(".jamBarChat")) return jamChatOpen(); jamSheet(); };
function jamAvs(max) { const mem = (jam && jam.mem) || []; return mem.slice(0, max).map(m => jamAv(m)).join("") + (mem.length > max ? `<i class="jamAv more">+${mem.length - max}</i>` : ""); }
function renderJamUI() {
  const on = jamOn(), n = on ? (jam.mem || []).length : 0;
  npJamBtn.classList.toggle("on", on); npJamBtn.querySelector(".jamBadge").textContent = on && n ? n : ""; npJamBtn.classList.toggle("unread", on && jamUnread > 0);
  npJamBar.classList.toggle("hidden", !on);
  if (on) npJamBar.innerHTML = `<span class="jamAvs">${jamAvs(5)}</span><span class="jamBarT">Listen Together · ${n} ${n === 1 ? "person" : "log"}</span><span class="jamCodeS">${esc(jam.code)}</span><span class="jamBarChat" role="button" aria-label="Chat">💬<b class="jamUnread">${jamUnread || ""}</b></span>`;
  $("#mini").classList.toggle("jamming", on);
  const sh = document.getElementById("jamBox"); if (sh && !sheet.classList.contains("hidden") && sh.dataset.on === String(on)) { const ml = document.getElementById("jamMem"); if (ml && on) ml.innerHTML = jamMemHTML(); }
}
function jamMemHTML() { return (jam.mem || []).map(m => `<div class="jamMemRow">${jamAv(m, true)}<span>${esc(m.n)}${m.m === jamMid ? ' <small>(aap)</small>' : ""}</span>${jam.st && jam.st.by && jam.st.by.m === m.m && jam.st.ev && jam.st.ev.t !== "start" ? '<small class="jamLast">abhi chalaya</small>' : ""}</div>`).join(""); }
function jamShareText(c) { return `Mere saath Dhun pe ek saath gaane suno 🎧\nLink kholo: ${jamLink(c)}\nYa code daalo: ${c}`; }
function jamSheet(joinCode) {
  if (jamOn() && (!joinCode || joinCode === jam.code)) {
    const c = jam.code, txt = encodeURIComponent(jamShareText(c));
    showSheet(`<div class="sgroup jamSheet" id="jamBox" data-on="true"><div class="jamHead"><i class="jamIco">${JAM_ICON}</i><div><b>Listen Together <span class="jamLive">LIVE</span></b><div class="sub">Sab koi gaana badal, pause, aage-peeche kar sakta hai</div></div></div>
      <div class="jamCodeBox"><small>Session code</small><div class="jamCodeBig">${esc(c)}</div><small>Dost ko ye code ya link bhejo</small></div>
      <div class="jamShare"><a class="jamWa" href="https://wa.me/?text=${txt}" target="_blank" rel="noopener">WhatsApp</a><a class="jamTg" href="https://t.me/share/url?url=${encodeURIComponent(jamLink(c))}&text=${encodeURIComponent("Mere saath Dhun pe ek saath gaane suno 🎧 Code: " + c)}" target="_blank" rel="noopener">Telegram</a><button data-s="jamCopy">${navigator.share ? "Share…" : "Copy link"}</button></div>
      <button class="jamChatBtn" data-s="jamChat">💬 Chat<b class="jamUnread">${jamUnread || ""}</b></button>
      <div class="jamMemH">Sun rahe hain</div><div id="jamMem">${jamMemHTML()}</div></div>
      <div class="sgroup"><button data-s="jamEnd" class="danger">Stop Listen Together (sabke liye)</button><button data-s="jamLeave">Leave (sirf main)</button></div>`, {
      jamChat: () => { closeSheet(); jamChatOpen(); return true; },
      jamEnd: () => { jamEndConfirm(); return true; },
      jamCopy: () => { const l = jamLink(c); if (navigator.share) { navigator.share({ title: "Dhun · Listen Together", text: jamShareText(c).split("\n")[0] + " Code: " + c, url: l }).catch(() => {}); return true; } (navigator.clipboard ? navigator.clipboard.writeText(l) : Promise.reject()).then(() => toast("Link copy ho gaya ✅")).catch(() => toast(l)); return true; },
      jamLeave: () => { jamLeave(false); },
    });
    return;
  }
  const nm = jamName(), code = joinCode || "";
  const peek = joinCode && jamPeek && jamPeek.code === joinCode ? jamPeek : null;
  const inv = joinCode ? `<div class="jamInv">${peek && peek.mem && peek.mem.length ? `<span class="jamAvs">${peek.mem.slice(0, 5).map(m => jamAv(m)).join("")}</span> <b>${esc(peek.mem[0].n)}</b>${peek.mem.length > 1 ? ` + ${peek.mem.length - 1}` : ""} aapko bula rahe hain` : "Aapko Listen Together me bulaya gaya hai"}${peek && peek.st && peek.st.song ? `<div class="jamNow">${peek.st.song.thumb ? `<img src="${esc(peek.st.song.thumb)}" alt="">` : ""}<span><b>${esc(peek.st.song.title)}</b><small>${esc(peek.st.song.artist)}</small></span></div>` : ""}</div>` : "";
  showSheet(`<div class="sgroup jamSheet" id="jamBox" data-on="false"><div class="jamHead"><i class="jamIco">${JAM_ICON}</i><div><b>Listen Together</b><div class="sub">Dosto ke saath ek hi gaana, ek hi time pe — kahin bhi ho, koi bhi phone ho. Sab gaana badal / pause kar sakte hain.</div></div></div>
    <div class="jamBody">${inv}<label for="jamNameIn">Aapka naam</label><input id="jamNameIn" maxlength="24" placeholder="Naam likho" value="${esc(nm)}" autocomplete="off">
    ${joinCode ? `<button class="jamPri" data-s="jamJoinGo">Join karo 🎧</button>` : `<button class="jamPri" data-s="jamStartGo">Start Listen Together</button><div class="jamOr"><span>ya code se join karo</span></div><div class="jamJoinRow"><input id="jamCodeIn" maxlength="6" placeholder="CODE" value="${esc(code)}" autocapitalize="characters" autocomplete="off" spellcheck="false"><button class="jamSec" data-s="jamJoinGo">Join</button></div>`}
    <div class="impErr" id="jamErr" hidden></div></div></div>`, {
    jamStartGo: () => { if (!jamSaveName()) return true; jamUnlock(); jamStart(); return true; },
    jamJoinGo: () => { if (!jamSaveName()) return true; const c = joinCode || (($("#jamCodeIn") || {}).value || ""); jamUnlock(); jamJoin(c); return true; },
  });
}
function jamSaveName() { const i = $("#jamNameIn"); const v = String(i ? i.value : "").replace(/[<>]/g, "").trim().slice(0, 24); if (!v) { jamErr("Pehle apna naam likho"); if (i) i.focus(); return false; } store.set("jamName", v); return true; }
document.addEventListener("click", e => { const b = e.target.closest("[data-act=jam]"); if (b) { e.preventDefault(); e.stopPropagation(); jamSheet(); } }, true);
function jamRowHTML() { const on = jamOn(); return `<button data-act="jam" class="jamRow${on ? " on" : ""}"><i class="jamRowI">${JAM_ICON}</i><span>Listen Together <small class="sub">${on ? `Live · ${esc(jam.code)} · ${(jam.mem || []).length} log` : "Dosto ke saath ek saath suno"}</small></span>${on ? `<span class="jamAvs">${jamAvs(3)}</span>` : ""}</button>`; }
const rawRenderLibrary = renderLibrary;
renderLibrary = function () { rawRenderLibrary(); if (subView) return; const ll = view.querySelector(".libLinks"); if (ll) { const imp = ll.querySelector("[data-act=importPl]"); const tmp = document.createElement("div"); tmp.innerHTML = jamRowHTML(); const el = tmp.firstElementChild; if (imp) ll.insertBefore(el, imp); else ll.appendChild(el); } };
const rawRenderHome = renderHome;
renderHome = function () { rawRenderHome(); if (!jamOn()) return; const tmp = document.createElement("div"); tmp.innerHTML = `<button data-act="jam" class="jamHome"><span class="jamAvs">${jamAvs(4)}</span><span><b>Listen Together live 🎧</b><small>${(jam.mem || []).length} log · code ${esc(jam.code)}</small></span></button>`; const h1 = view.querySelector("h1"); if (h1) h1.insertAdjacentElement("afterend", tmp.firstElementChild); };
// ----- chat inside a Listen Together session (rides the room's polling; last 100 messages per room) -----
let jamChatK = 0, jamMsgs = [], jamUnread = 0, jamChatIsOpen = false, jamPendMsgs = [];
const JAM_CHAT_MAX = 300;
const jamHM = t => { const d = new Date(t || Date.now()); return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
function jamChatReset() { jamChatK = 0; jamMsgs = []; jamUnread = 0; jamPendMsgs = []; jamChatClose(); }
function jamChatIn(list, initial) {
  let fresh = [];
  for (const m of list || []) { if (!m || !(m.i > jamChatK)) continue; jamChatK = m.i; jamMsgs.push(m); fresh.push(m); jamPendMsgs = jamPendMsgs.filter(p => !(m.m === jamMid && p.x === m.x)); }
  if (!fresh.length) return;
  if (jamMsgs.length > 100) jamMsgs = jamMsgs.slice(-100);
  const others = fresh.filter(m => m.m !== jamMid);
  if (!initial && others.length) {
    if (!jamChatIsOpen) { jamUnread += others.length; const m = others[others.length - 1]; toast(`💬 ${m.n}: ${m.x}`); }
  }
  jamChatRender(); renderJamUI(); jamUnreadUI();
}
function jamUnreadUI() { document.querySelectorAll(".jamUnread").forEach(b => { b.textContent = jamUnread ? (jamUnread > 99 ? "99+" : jamUnread) : ""; }); }
const jamChatEl = document.createElement("div"); jamChatEl.id = "jamChatWrap"; jamChatEl.className = "hidden";
jamChatEl.innerHTML = `<div id="jamChatBack"></div><section id="jamChat" role="dialog" aria-label="Listen Together chat">
  <header class="jamChatHead"><i class="jamIco">💬</i><div class="jcT"><b>Chat</b><small id="jamChatSub"></small></div><button id="jamChatX" class="icon" aria-label="Close chat">✕</button></header>
  <div id="jamChatList" aria-live="polite"></div>
  <div class="jamChatQuick">${["🔥", "❤️", "😂", "👏", "🎶", "😍"].map(e => `<button type="button" data-q="${e}">${e}</button>`).join("")}</div>
  <form id="jamChatForm" autocomplete="off"><input id="jamChatIn" maxlength="${JAM_CHAT_MAX}" placeholder="Message likho…" enterkeyhint="send" autocomplete="off"><button type="submit" id="jamChatSend" aria-label="Send">➤</button></form>
</section>`;
document.body.appendChild(jamChatEl);
function jamChatOpen() {
  if (!jamOn()) return;
  jamChatIsOpen = true; jamUnread = 0; jamUnreadUI(); renderJamUI();
  jamChatEl.classList.remove("hidden"); jamChatRender(true);
}
function jamChatClose() { jamChatIsOpen = false; jamChatEl.classList.add("hidden"); const i = document.getElementById("jamChatIn"); if (i) i.blur(); }
function jamChatRender(scroll) {
  const list = document.getElementById("jamChatList"); if (!list) return;
  const sub = document.getElementById("jamChatSub"); if (sub && jam) sub.textContent = `Listen Together · ${jam.code} · ${(jam.mem || []).length} log`;
  if (!jamChatIsOpen) return;
  const atEnd = scroll || list.scrollHeight - list.scrollTop - list.clientHeight < 60;
  const all = jamMsgs.concat(jamPendMsgs.map(p => ({ m: jamMid, n: jamName(), x: p.x, t: p.t, pend: 1 })));
  let prev = "";
  list.innerHTML = all.length ? all.map(m => { const me = m.m === jamMid, show = !me && prev !== m.m; prev = m.m;
    return `<div class="jcMsg${me ? " me" : ""}${m.pend ? " pend" : ""}">${me ? "" : show ? jamAv({ m: m.m, n: m.n }) : '<i class="jamAv sp"></i>'}<div class="jcB">${show ? `<small class="jcN" style="color:${jamColor(m.m)}">${esc(m.n)}</small>` : ""}<span class="jcX">${esc(m.x)}</span><small class="jcTm">${m.pend ? "…" : jamHM(m.t)}</small></div></div>`; }).join("")
    : `<div class="jcEmpty">Abhi koi message nahi. Kuch likho — sab ko dikhega 👋</div>`;
  if (atEnd) list.scrollTop = list.scrollHeight;
}
async function jamChatSend(text) {
  const x = String(text || "").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, JAM_CHAT_MAX);
  if (!x || !jamOn()) return;
  const p = { x, t: Date.now() }; jamPendMsgs.push(p); jamChatRender(true);
  const code = jam.code;
  for (let k = 0; k < 2; k++) {
    try {
      const j = await jamReq("/api/jam/chat", { c: code, m: jamMid, n: jamName(), x, k: jamChatK });
      if (!jamOn() || jam.code !== code) return;
      if (j.gone) return jamGone(j.ended);
      if (j.ok) { jamPendMsgs = jamPendMsgs.filter(q => q !== p); if (j.chat) jamChatIn(j.chat, false); jamChatRender(true); return; }
      if (j.msg) { toast(j.msg); break; }
    } catch (e) {}
  }
  jamPendMsgs = jamPendMsgs.filter(q => q !== p); jamChatRender(); toast("Message nahi gaya, dobara bhejo");
  const i = document.getElementById("jamChatIn"); if (i && !i.value) i.value = x;
}
document.getElementById("jamChatX").onclick = jamChatClose;
document.getElementById("jamChatBack").onclick = jamChatClose;
document.getElementById("jamChatForm").addEventListener("submit", e => { e.preventDefault(); const i = document.getElementById("jamChatIn"); const v = i.value; i.value = ""; jamChatSend(v); i.focus(); });
jamChatEl.querySelector(".jamChatQuick").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (b) jamChatSend(b.dataset.q); });
document.addEventListener("click", e => { if (e.target.closest("[data-act=jamChat]")) { e.preventDefault(); e.stopPropagation(); jamChatOpen(); } }, true);
// join from a link (?jam=CODE), or rejoin the session this phone was in
(async () => {
  let c = ""; try { c = (new URLSearchParams(location.search).get("jam") || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); } catch (e) {}
  if (c) { try { history.replaceState(null, "", location.pathname); } catch (e) {} }
  const saved = store.get("jam", null);
  if (c && c.length === 6) {
    if (saved && saved.code === c) return jamJoin(c, true);
    try { const j = await jamReq(`/api/jam/get?c=${c}`); if (j.gone) { toast("Ye Listen Together session khatam ho gaya"); return; } jamPeek = { code: c, mem: j.mem, st: j.st }; } catch (e) {}
    jamSheet(c); return;
  }
  if (saved && saved.code) jamJoin(saved.code, true);
})();
window.__mix = { info: id => { const b = mixInfo.get(id); return b ? b.v : undefined; }, get on() { return mixOn(); } };
window.__jam = { get jam() { return jam; }, get off() { return jamOff; }, exp: () => jam && jamExp(jam.st), check: jamCheck, get chat() { return jamMsgs; }, get unread() { return jamUnread; } };
// ================= v21: Artist / Album / Charts / Mood pages ("Sab chalao"), Song radio, Sleep timer, Lyrics =================
// ---------- collection pages: one view for an artist, an album, a chart or a mood mix: big "Sab chalao" (play all) + Shuffle ----------
const colls = {}; // key -> {id,name,image,items,...} | {loading} | {error}
const artistIds = {}; // artist name -> id (from the player's artist link)
const arSearch = {}; // search text -> {items: artists, albums}
const PERSON_ICON = '<svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z"/></svg>';
const DISC_ICON = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>';
const CHART_TILES = [["hindi", "Hindi", "#e0245e,#6b0f2f"], ["punjabi", "Punjabi", "#f0932b,#7a3b00"], ["english", "English", "#0984e3,#062f57"], ["bhojpuri", "Bhojpuri", "#00b894,#004d3d"], ["haryanvi", "Haryanvi", "#a55eea,#43206b"], ["trending", "Trending Today", "#fd9644,#8a2d00"]];
const MOOD_TILES = [["romantic", "Romantic", "💕", "#e84393,#6d1440"], ["sad", "Sad", "💔", "#636e72,#1e2427"], ["party", "Party", "🎉", "#fdcb6e,#b35400"], ["gym", "Gym", "💪", "#d63031,#4d0b0b"], ["bhakti", "Bhakti", "🙏", "#e17055,#7a2a12"], ["lofi", "Lofi", "🌙", "#6c5ce7,#221a5c"]];
function collURL(key) {
  const i = key.indexOf(":"), k = key.slice(0, i), v = encodeURIComponent(key.slice(i + 1));
  return { ar: "/api/artist?id=", arn: "/api/artist?name=", al: "/api/album?id=", als: "/api/album?song=", chart: "/api/chart?l=", mood: "/api/mood?m=" }[k] + v;
}
function collLoad(key) {
  const c = colls[key]; if (c && (c.items || c.loading)) return c;
  colls[key] = { loading: true };
  api(collURL(key)).then(d => { colls[key] = d && d.items && d.items.length ? d : { error: 1 }; if (d && d.id && key.startsWith("arn:")) artistIds[key.slice(4)] = d.id; })
    .catch(() => { colls[key] = { error: 1 }; })
    .then(() => { if (subView === "c:" + key) rerender(); });
  return colls[key];
}
function collOpen(key) {
  if (key.startsWith("arn:")) { const id = artistIds[key.slice(4)]; if (id) { colls["ar:" + id] = colls["ar:" + id] || colls[key]; key = "ar:" + id; } }
  collLoad(key); go(curTab === "home" ? "home" : "search", "c:" + key);
}
const artistNames = name => [...new Set(String(name || "").split(/,|&| x | feat\.? | ft\.? /i).map(x => x.trim()).filter(Boolean))].slice(0, 6);
function collOpenArtist(name) { // one artist -> their page; a song with several -> pick one
  const l = artistNames(name); if (!l.length) return;
  if (l.length === 1) return collOpen("arn:" + l[0]);
  setTimeout(() => showSheet(`<div class="sgroup"><div class="shead"><div><div class="t1">Kis artist ka page kholna hai?</div></div></div>${l.map((n, i) => `<button data-s="a" data-i="${i}">${esc(n)} ${PERSON_ICON}</button>`).join("")}</div>`, { a: b => { collOpen("arn:" + l[+b.dataset.i]); } }), 60);
}
function collTitle(key, c) {
  const k = key.slice(0, key.indexOf(":")), v = key.slice(key.indexOf(":") + 1);
  if (k === "mood") { const m = MOOD_TILES.find(x => x[0] === v); return m ? `${m[2]} ${m[1]} Mix` : "Mix"; }
  if (k === "chart") { const ch = CHART_TILES.find(x => x[0] === v); return ch ? (v === "trending" ? "🔥 Trending Today" : `🔥 ${ch[1]} Top 50`) : (c && c.name) || "Top Charts"; }
  return (c && c.name) || (k === "arn" ? v : "");
}
const fmtK = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n);
function renderColl(key) {
  const k = key.slice(0, key.indexOf(":")), c = colls[key] || collLoad(key);
  const round = k === "ar" || k === "arn";
  const back = `<button class="back" data-act="back">${ICON.chev}${curTab === "home" ? "Listen Now" : searchState.q ? "Search" : "Back"}</button>`;
  const title = collTitle(key, c);
  let art;
  if (k === "mood" || k === "chart") { const t = k === "mood" ? MOOD_TILES.find(x => x[0] === key.slice(5)) : CHART_TILES.find(x => x[0] === key.slice(6)); art = c && c.image && k === "chart" ? `<span class="cPic big"><img src="${esc(c.image)}" onerror="this.remove()"></span>` : `<span class="cPic big grad" style="background:linear-gradient(135deg,${t ? t[t.length - 1] : "#444,#111"})"><b>${t && k === "mood" ? t[2] : "🔥"}</b></span>`; }
  else art = `<span class="${round ? "arPic" : "cPic"} big">${c && c.image ? `<img src="${esc(c.image)}" onerror="this.remove()">` : ""}${round ? PERSON_ICON : DISC_ICON}</span>`;
  if (!c || c.loading) { view.innerHTML = `${back}<div class="arHero">${art}<h1>${esc(title)}</h1></div><div class="spin"></div>`; return; }
  if (c.error || !c.items) { view.innerHTML = `${back}<div class="arHero">${art}<h1>${esc(title)}</h1></div><div class="empty">Gaane abhi nahi mil paaye 😕<br>Internet check karke dobara try karo.</div><div class="btnRow"><button data-act="collRetry">Dobara try karo</button></div>`; return; }
  bindList("c:" + key, c.items);
  const n = c.items.length;
  const sub = k === "al" || k === "als" ? [c.artist, c.year, `${n} gaane`].filter(Boolean).join(" · ") : `${n} gaane${round && c.followers ? ` · ${fmtK(c.followers)} followers` : ""}`;
  view.innerHTML = `${back}<div class="arHero">${art}<h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div></div>
  <div class="btnRow arBtns"><button data-act="collPlay" class="arAll">${ICON.play}Sab chalao</button><button data-act="collShuffle">${ICON.shuffle}Shuffle</button></div>
  <div class="arList">${c.items.map((t, i) => rowHTML(t, i, "c:" + key)).join("")}</div>`;
}
function collPlayAll(c, mix, title) {
  if (!c || !c.items || !c.items.length) return;
  shuffle = !!mix; syncModes();
  const list = mix ? shuffled(c.items) : c.items.slice();
  if (jamOn()) { // Listen Together: everyone's queue becomes this list (the room keeps the next 100)
    const track = jamSlim(list[0]), more = list.slice(1, 101).map(jamSlim);
    jamPredict(s => { if (!s.song || s.song.id !== track.id) { if (s.song) s.hist = (s.hist || []).concat([s.song]).slice(-30); s.pos = 0; } s.song = track; s.playing = true; s.queue = more; });
    jamAct({ t: "song", track, list: more, rq: 1 });
  } else playList(list, 0);
  toast(`${mix ? "🔀" : "▶️"} ${title ? title + ": " : ""}${list.length} gaane ${mix ? "shuffle me" : "chal rahe hain"}`);
}
function searchExtraHTML(x) {
  let h = "";
  if (x.items && x.items.length) h += `<h2 class="arH">Artists</h2><div class="car arCar">${x.items.map(a => `<button class="arTile" data-coll="ar:${esc(a.id)}"><span class="arPic">${a.image ? `<img loading="lazy" src="${esc(a.image)}" onerror="this.remove()">` : ""}${PERSON_ICON}</span><span class="t1">${esc(a.name)}</span></button>`).join("")}</div>`;
  if (x.albums && x.albums.length) h += `<h2 class="arH">Albums</h2><div class="car arCar">${x.albums.map(a => `<button class="tile alTile" data-coll="al:${esc(a.id)}"><img loading="lazy" src="${esc(a.image)}" onerror="this.onerror=null;this.src='/icon-192.png'"><div class="t1">${esc(a.name)}</div><div class="t2">${esc([a.year, a.sub].filter(Boolean).join(" · "))}</div></button>`).join("")}</div>`;
  if (h) h += `<h2 class="arH">Songs</h2>`;
  return h;
}
function homeExtraHTML() {
  return `<h2>🔥 Top Charts</h2><div class="car">${CHART_TILES.map(([l, n, g]) => `<button class="tile cTile" data-coll="chart:${l}"><span class="cArt" style="background:linear-gradient(135deg,${g})"><b>${esc(n)}</b><small>${l === "trending" ? "Aaj ke hits" : "Top 50"}</small></span><div class="t1">${esc(l === "trending" ? n : n + " Top 50")}</div></button>`).join("")}</div>
  <h2>😊 Mood Mixes</h2><div class="car">${MOOD_TILES.map(([m, n, e, g]) => `<button class="tile cTile" data-coll="mood:${m}"><span class="cArt" style="background:linear-gradient(135deg,${g})"><i>${e}</i><b>${esc(n)}</b></span><div class="t1">${esc(n)} Mix</div></button>`).join("")}</div>`;
}
const rawRenderHomeV21 = renderHome;
renderHome = function () {
  if (subView && String(subView).startsWith("c:")) { const y = view.scrollTop; renderColl(subView.slice(2)); view.scrollTop = y; return; }
  rawRenderHomeV21();
  if (view.querySelector(".cTile")) return;
  const tmp = document.createElement("div"); tmp.innerHTML = homeExtraHTML();
  const shelf = [...view.querySelectorAll("h2")].find(h => h.querySelector("a[data-q]"));
  if (shelf) shelf.before(...tmp.childNodes); else view.append(...tmp.childNodes);
};
const rawRenderSearchV21 = renderSearch;
renderSearch = function () {
  if (subView && String(subView).startsWith("c:")) { const y = view.scrollTop; renderColl(subView.slice(2)); view.scrollTop = y; return; }
  rawRenderSearchV21();
  const s = searchState, x = arSearch[s.q];
  if (s.q && !s.typing && s.kind === "songs" && !s.loading && !s.error && x && ((x.items || []).length || (x.albums || []).length)) {
    const sb = $("#sbody"), seg = sb && sb.querySelector(".seg"); if (!seg) return;
    const tmp = document.createElement("div"); tmp.innerHTML = searchExtraHTML(x);
    seg.after(...tmp.childNodes);
  }
};
const rawDoSearchV21 = doSearch;
doSearch = function (text, kind) {
  const q = (text || "").trim();
  if (q && (kind || searchState.kind) !== "videos" && !arSearch[q]) {
    api("/api/artists?q=" + encodeURIComponent(q)).then(d => { arSearch[q] = { items: (d && d.items) || [], albums: (d && d.albums) || [] }; if (curTab === "search" && !subView && searchState.q === q && !searchState.loading) renderSearchBody(); }).catch(() => {});
  }
  return rawDoSearchV21(text, kind);
};
view.addEventListener("click", e => {
  const t = e.target.closest("[data-coll]"); if (t) { e.preventDefault(); e.stopPropagation(); return collOpen(t.dataset.coll); }
  const b = e.target.closest("[data-act]"); if (!b) return; const act = b.dataset.act;
  if (act !== "collPlay" && act !== "collShuffle" && act !== "collRetry") return;
  e.preventDefault(); e.stopPropagation();
  const key = subView && String(subView).startsWith("c:") ? subView.slice(2) : ""; if (!key) return;
  if (act === "collRetry") { delete colls[key]; collLoad(key); return rerender(); }
  collPlayAll(colls[key], act === "collShuffle", collTitle(key, colls[key]));
}, true);
{ // player: tap the artist name -> their page
  const el = $("#npArtist");
  if (el) { el.classList.add("arLink"); el.setAttribute("role", "link"); el.addEventListener("click", e => { e.stopPropagation(); const t = queue[qi]; if (!t || !t.artist) return; closeNP(); collOpenArtist(t.artist); }); }
}

// ---------- 😴 Sleep timer: 15/30/45/60 min or "gaana khatam hone pe"; fades out, then pauses. Timestamps, so a locked phone catches up on the next tick ----------
let sleep = null; // {at, min} | {end: songId}
let sleepFade = 0; const SLEEP_FADE = 8000;
const sleepLeft = () => !sleep ? 0 : sleep.at ? Math.max(0, sleep.at - Date.now()) : Math.max(0, ((P.dur() || 0) - (P.time() || 0)) * 1000);
const fmtLeft = ms => { const s = Math.ceil(ms / 1000), m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` : `${m}:${String(s % 60).padStart(2, "0")}`; };
function sleepLabel() { if (!sleep) return "Off"; return sleep.end ? "Gaana khatam hone pe" : `${fmtLeft(sleepLeft())} baaki`; }
function sleepSet(v) {
  sleepFade = 0; try { audio.volume = 1; } catch (e) {}
  if (v === "end") { const t = queue[qi]; if (!t) { toast("Pehle koi gaana chalao"); return; } sleep = { end: t.id }; toast("😴 Ye gaana khatam hote hi music band"); }
  else { sleep = { at: Date.now() + v * 60e3, min: v }; toast(`😴 Sleep timer: ${v} min`); }
  sleepUI();
}
function sleepCancel(quiet) { const had = !!sleep; sleep = null; if (sleepFade) { sleepFade = 0; try { audio.volume = 1; } catch (e) {} } sleepUI(); if (had && !quiet) toast("Sleep timer band"); }
function sleepStop() { // time's up
  sleep = null; sleepFade = 0;
  if (jamOn()) { jamLeave(true); toast("😴 Sleep timer: Listen Together se nikal ke music band kiya"); } else toast("😴 Sleep timer: music band. Good night!");
  P.pause(); setTimeout(() => { try { audio.volume = 1; } catch (e) {} }, 300);
  sleepUI();
}
function sleepTick() {
  if (!sleep) return;
  if (sleep.at) {
    const now = Date.now();
    if (!P.playing() && now >= sleep.at) { sleepCancel(true); return; } // already paused when the time came
    if (now >= sleep.at - SLEEP_FADE && P.playing()) {
      if (mode !== "audio" || !mixVolOK) { if (now >= sleep.at) sleepStop(); }
      else { if (!sleepFade) { sleepFade = now; mixAbort(); } const k = Math.min(1, (now - sleepFade) / SLEEP_FADE); try { audio.volume = Math.max(0, 1 - k); } catch (e) {} if (k >= 1 || now >= sleep.at + 1000) sleepStop(); }
    }
  }
  sleepUIText();
}
function sleepUIText() {
  const b = $("#npSleep"); if (b) { const sp = b.querySelector("small"); const txt = !sleep ? "" : sleep.end ? "♪" : String(Math.ceil(sleepLeft() / 60e3)); if (sp && sp.textContent !== txt) sp.textContent = txt; }
  document.querySelectorAll("[data-sleepleft]").forEach(el => { const t = sleepLabel(); if (el.textContent !== t) el.textContent = t; });
}
function sleepUI() { const b = $("#npSleep"); if (b) b.classList.toggle("on", !!sleep); sleepUIText(); }
function sleepSheet() {
  showSheet(`<div class="sgroup"><div class="shead"><div><div class="t1">😴 Sleep timer</div><div class="sub" data-sleepleft>${esc(sleepLabel())}</div></div></div>
    ${[15, 30, 45, 60].map(m => `<button data-s="m" data-m="${m}">${m} minute${sleep && sleep.min === m ? " ✓" : ""}</button>`).join("")}
    <button data-s="end">Gaana khatam hone pe${sleep && sleep.end ? " ✓" : ""}</button>
    ${sleep ? `<button data-s="off" class="danger">Timer band karo</button>` : ""}</div>`, {
    m: b => sleepSet(+b.dataset.m), end: () => sleepSet("end"), off: () => sleepCancel(),
  });
}
const rawMixNextIndexV21 = mixNextIndex;
mixNextIndex = function () { if (sleep && (sleep.end || (sleep.at && sleep.at - Date.now() < 45e3))) return -1; return rawMixNextIndexV21(); }; // no AutoMix into a song that the timer would stop
const rawNextV21 = next;
next = function (auto) {
  if (auto && sleep && sleep.end) { sleep = null; sleepUI(); if (jamOn()) jamLeave(true); P.pause(); toast("😴 Gaana khatam — music band. Good night!"); return; }
  return rawNextV21(auto);
};
// ---------- 🎤 Lyrics: synced (karaoke highlight + auto-scroll) from lrclib, else plain text ----------
const lyrCache = new Map(); // track id -> {synced:[{t,x}], plain, none} | {loading}
let lyrOpenNow = false, lyrFor = "", lyrCur = -1, lyrUserScroll = 0;
const MIC_ICON = '<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>';
const MOON_ICON = '<svg viewBox="0 0 24 24"><path d="M12.3 2a9.5 9.5 0 1 0 9.7 11.6A7.5 7.5 0 0 1 12.3 2z"/></svg>';
function parseLRC(s) {
  const out = [];
  for (const line of String(s || "").split(/\r?\n/)) { const tags = [...line.matchAll(/\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g)]; if (!tags.length) continue; const x = line.replace(/\[[^\]]*\]/g, "").trim(); for (const m of tags) out.push({ t: +m[1] * 60 + parseFloat(m[2].replace(":", ".")), x }); }
  return out.sort((a, b) => a.t - b.t);
}
function lyrLoad(t) {
  if (!t) return;
  lyrFor = t.id; lyrCur = -1;
  const c = lyrCache.get(t.id); if (c && !c.err) { lyrRender(); return; }
  lyrCache.set(t.id, { loading: 1 }); lyrRender();
  const q = `/api/lyrics?id=${encodeURIComponent(t.src === "saavn" ? t.id : "")}&title=${encodeURIComponent(t.title || "")}&artist=${encodeURIComponent(t.artist || "")}&dur=${Math.round(t.dur || P.dur() || 0)}`;
  api(q).then(d => { const syn = parseLRC(d && d.synced); lyrCache.set(t.id, syn.length > 2 ? { synced: syn, plain: d.plain || "" } : d && d.plain ? { plain: String(d.plain) } : { none: 1, err: d && d.error ? 1 : 0 }); })
    .catch(() => lyrCache.set(t.id, { none: 1, err: 1 }))
    .then(() => { if (lyrFor === t.id) lyrRender(); });
}
function lyrRender() {
  const p = $("#lyrPanel"); if (!p) return;
  const t = queue[qi], c = lyrCache.get(lyrFor) || {};
  const head = "";
  if (!t) { p.innerHTML = `<div class="lyrNone">Pehle koi gaana chalao</div>`; return; }
  if (c.loading) p.innerHTML = head + `<div class="lyrNone lyrLoad"><div class="spin"></div>Lyrics la raha hoon…</div>`;
  else if (c.synced) p.innerHTML = head + `<div class="lyrBody synced">${c.synced.map((l, i) => `<p data-li="${i}"${l.x ? "" : ' class="gap"'}>${l.x ? esc(l.x) : "♪"}</p>`).join("")}</div>`;
  else if (c.plain) p.innerHTML = head + `<div class="lyrBody plain">${esc(c.plain).replace(/\n/g, "<br>")}</div>`;
  else p.innerHTML = head + `<div class="lyrNone">Lyrics nahi mile 😕${c.err ? `<br><button class="lyrRetry" data-lyr="retry">Dobara try karo</button>` : ""}</div>`;
  lyrCur = -1; lyrTick(true);
}
function lyrTick(force) {
  if (!lyrOpenNow) return;
  const c = lyrCache.get(lyrFor); if (!c || !c.synced) return;
  const tm = (P.time() || 0) + 0.25; let i = -1;
  for (let j = 0; j < c.synced.length; j++) { if (c.synced[j].t <= tm) i = j; else break; }
  if (i === lyrCur && !force) return;
  const p = $("#lyrPanel"); if (!p) return;
  const old = p.querySelector("p.cur"); if (old) old.classList.remove("cur");
  lyrCur = i; const el = i >= 0 ? p.querySelector(`p[data-li="${i}"]`) : null;
  if (el) { el.classList.add("cur"); if (Date.now() - lyrUserScroll > 3500) p.scrollTo({ top: Math.max(0, el.offsetTop - p.clientHeight / 2 + el.clientHeight / 2), behavior: force ? "auto" : "smooth" }); }
}
function lyrToggle(open) {
  lyrOpenNow = open === undefined ? !lyrOpenNow : !!open;
  const p = $("#lyrPanel"), b = $("#npLyr"); if (!p) return;
  if (b) b.classList.toggle("on", lyrOpenNow); np.classList.toggle("lopen", lyrOpenNow);
  const aw = $("#npArtWrap"); if (aw) aw.setAttribute("aria-label", lyrOpenNow ? "Photo dikhao" : "Lyrics dikhao");
  if (lyrOpenNow) { store.set("lyrHint", 1); lyrThumb();
    if (!$("#queuePanel").classList.contains("hidden")) { $("#queuePanel").classList.add("hidden"); $("#npQueueBtn").classList.remove("on"); np.classList.remove("qopen"); }
    const t = queue[qi]; if (t) lyrLoad(t); else p.innerHTML = `<div class="lyrNone">Pehle koi gaana chalao</div>`;
  }
}
{ // now-playing: 😴 Sleep button; 🎤 Lyrics open by tapping the artwork (v22, Apple Music style) — the lyrics take the artwork's place
  const nb = document.querySelector("#np .npBottom"), qp = $("#queuePanel"), aw = $("#npArtWrap"), meta = document.querySelector("#np .npMeta");
  if (nb && qp && aw && !$("#lyrPanel")) {
    const sb = document.createElement("button"); sb.id = "npSleep"; sb.className = "icon small"; sb.setAttribute("aria-label", "Sleep timer"); sb.innerHTML = MOON_ICON + "<small></small>";
    const qb = $("#npQueueBtn"); nb.appendChild(sb);
    sb.onclick = () => sleepSheet();
    const lp = document.createElement("div"); lp.id = "lyrPanel"; aw.appendChild(lp);
    if (meta && !$("#npThumb")) { const th = document.createElement("img"); th.id = "npThumb"; th.alt = ""; th.setAttribute("aria-label", "Photo dikhao"); th.onclick = e => { e.stopPropagation(); lyrToggle(false); }; meta.insertBefore(th, meta.firstChild); }
    aw.setAttribute("role", "button"); aw.tabIndex = 0; aw.setAttribute("aria-label", "Lyrics dikhao");
    ["touchstart", "touchmove", "touchend"].forEach(ev => lp.addEventListener(ev, e => { e.stopPropagation(); if (ev !== "touchend") lyrUserScroll = Date.now(); }, { passive: true }));
    lp.addEventListener("wheel", () => { lyrUserScroll = Date.now(); }, { passive: true });
    lp.addEventListener("scroll", () => { if (lyrTap) lyrTap.m = 99; }, { passive: true });
    // a tap (not a swipe / drag / scroll) on the artwork toggles lyrics; on the lyrics a line seeks, anything else goes back to the photo
    let lyrTap = null;
    const tapStart = (x, y) => { lyrTap = { x, y, t: Date.now(), m: 0 }; };
    const tapMove = (x, y) => { if (lyrTap) lyrTap.m = Math.max(lyrTap.m, Math.abs(x - lyrTap.x) + Math.abs(y - lyrTap.y)); };
    aw.addEventListener("pointerdown", e => tapStart(e.clientX, e.clientY), true);
    aw.addEventListener("pointermove", e => tapMove(e.clientX, e.clientY), true);
    aw.addEventListener("touchstart", e => { const p = e.touches[0]; if (p && !lyrTap) tapStart(p.clientX, p.clientY); }, { capture: true, passive: true });
    aw.addEventListener("touchmove", e => { const p = e.touches[0]; if (p) tapMove(p.clientX, p.clientY); }, { capture: true, passive: true });
    aw.addEventListener("click", e => {
      const s = lyrTap; lyrTap = null;
      if (s && (s.m > 12 || Date.now() - s.t > 800)) return; // that was a swipe / long press, not a tap
      if (e.target.closest("#yt")) return;
      if (!lyrOpenNow) { if (queue[qi]) lyrToggle(true); return; }
      const r = e.target.closest("[data-lyr=retry]"); if (r) { const t = queue[qi]; if (t) { lyrCache.delete(t.id); lyrLoad(t); } return; }
      const l = e.target.closest("p[data-li]"); const c = lyrCache.get(lyrFor);
      if (l && c && c.synced) { const x = c.synced[+l.dataset.li]; if (x) { lyrUserScroll = 0; P.seek(x.t); } return; }
      lyrToggle(false);
    });
    aw.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === aw) { e.preventDefault(); if (lyrOpenNow || queue[qi]) lyrToggle(); } });
    if (qb) { const oq = qb.onclick; qb.onclick = function (e) { if (lyrOpenNow) lyrToggle(false); return oq && oq.call(this, e); }; }
    // one-time hint the first time the player opens with a song
    new MutationObserver(() => { if (np.classList.contains("open") && queue[qi] && !store.get("lyrHint", 0)) { store.set("lyrHint", 1); setTimeout(() => toast("🎤 Lyrics ke liye photo pe tap karo", 3800), 500); } }).observe(np, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(lyrThumb).observe($("#npArt"), { attributes: true, attributeFilter: ["src"] });
  }
}
function lyrThumb() { const th = $("#npThumb"), a = $("#npArt"); if (th && a && a.getAttribute("src") && th.getAttribute("src") !== a.getAttribute("src")) th.src = a.getAttribute("src"); }
const rawUpdateMetaV21 = updateMeta;
updateMeta = function (t) { rawUpdateMetaV21(t); if (lyrOpenNow && t && t.id !== lyrFor) lyrLoad(t); };
// one clock for the timer + lyrics: every 'timeupdate' of whichever <audio> is playing (AutoMix swaps them), and once a second
const v21Wired = new WeakSet();
function v21Tick() { if (!v21Wired.has(audio)) { v21Wired.add(audio); audio.addEventListener("timeupdate", v21Tick); } sleepTick(); lyrTick(); }
setInterval(v21Tick, 1000); v21Tick();
document.addEventListener("visibilitychange", v21Tick);
// Settings: Sleep timer row
const rawRenderLibraryV21 = renderLibrary;
renderLibrary = function () {
  rawRenderLibraryV21();
  if (subView !== "settings" || view.querySelector("[data-act=sleepSet]")) return;
  const card = [...view.querySelectorAll(".setCard")].find(c => c.querySelector("[data-act=automix]"));
  const tmp = document.createElement("div"); tmp.innerHTML = `<div class="setCard"><button class="setRow" data-act="sleepSet"><span><b>😴 Sleep timer</b><small data-sleepleft>${esc(sleepLabel())}</small></span><i class="chevR">${ICON.chev}</i></button></div>`;
  const hd = card && card.previousElementSibling && /^H[1-3]$/.test(card.previousElementSibling.tagName) ? card.previousElementSibling : card;
  if (hd) hd.before(tmp.firstChild); else view.append(tmp.firstChild);
};
view.addEventListener("click", e => { const b = e.target.closest("[data-act=sleepSet]"); if (b) { e.preventDefault(); e.stopPropagation(); sleepSheet(); } }, true);
window.__v21 = { colls, arSearch, collOpen, get sleep() { return sleep; }, sleepSet, sleepCancel, get lyr() { return { open: lyrOpenNow, id: lyrFor, cur: lyrCur, data: lyrCache.get(lyrFor) }; }, lyrToggle };
// ================= v22: time-based greeting on Listen Now (Telegram first name when signed in) =================
const GREET_SUB = {
  morning: ["Aaj kya sunoge? 🎧", "Chai ke saath kuch mast sa? ☕", "Din ki shuruaat ek acche gaane se 🎶", "Fresh mood, fresh music ✨"],
  afternoon: ["Aaj kya sunoge? 🎧", "Chalo kuch mast bajate hain 🎶", "Thoda break, thoda music 🎵", "Aaj ka vibe kya hai? 💫"],
  evening: ["Chalo kuch mast bajate hain 🎶", "Shaam ho gayi, music on karo 🌇", "Aaj kya sunoge? 🎧", "Thoda music, thoda sukoon 🎵"],
  night: ["Sone se pehle kuch soft sa? 🌙", "Raat, headphones aur aapke gaane 🎧", "Thoda music, thoda sukoon 🎵", "Aaj kya sunoge? 🎧"],
};
let greetSeq = (store.get("greetSeq", 0) + 1) % 1000; store.set("greetSeq", greetSeq);
function greetData() {
  const h = new Date().getHours();
  const k = h >= 5 && h < 12 ? "morning" : h >= 12 && h < 17 ? "afternoon" : h >= 17 && h < 21 ? "evening" : "night";
  const title = { morning: "Good Morning ☀️", afternoon: "Good Afternoon 🌤️", evening: "Good Evening 🌆", night: "Good Night 🌙" }[k];
  let name = "";
  try { if (tgMe && tgMe.linked) name = realName(tgMe.first) || realName(String(tgMe.name || "").split(/\s+/)[0]); } catch (e) {}
  name = name.split(/\s+/)[0].slice(0, 18);
  const subs = GREET_SUB[k];
  return { k, title: name ? title.replace(/ (\S+)$/, `, ${name} $1`) : title, sub: subs[greetSeq % subs.length] };
}
function greetHTML() { const g = greetData(); return `<div class="greet ${g.k}" data-greet><b>${esc(g.title)}</b><small>${esc(g.sub)}</small></div>`; }
function greetPaint() { const el = view.querySelector("[data-greet]"); if (!el) return; const g = greetData(); el.className = "greet " + g.k; el.querySelector("b").textContent = g.title; el.querySelector("small").textContent = g.sub; }
const rawRenderHomeV22 = renderHome;
renderHome = function () {
  const r = rawRenderHomeV22.apply(this, arguments);
  if (curTab === "home" && !view.querySelector("[data-greet]")) { const hd = view.querySelector("h1.hrow"); if (hd) hd.insertAdjacentHTML("afterend", greetHTML()); }
  return r;
};
new MutationObserver(() => { if (curTab === "home" && !view.querySelector("[data-greet]")) { const hd = view.querySelector(":scope > h1.hrow"); if (hd) hd.insertAdjacentHTML("afterend", greetHTML()); } }).observe(view, { childList: true });
function greetEnsure() { if (curTab === "home" && !view.querySelector("[data-greet]")) { const hd = view.querySelector(":scope > h1.hrow"); if (hd) hd.insertAdjacentHTML("afterend", greetHTML()); } }
greetEnsure();
let greetHiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { greetHiddenAt = Date.now(); return; }
  if (greetHiddenAt && Date.now() - greetHiddenAt > 60000) { greetSeq = (greetSeq + 1) % 1000; store.set("greetSeq", greetSeq); }
  greetPaint();
});
setInterval(() => { if (!document.hidden) { const el = view.querySelector("[data-greet]"); if (el && !el.classList.contains(greetData().k)) greetPaint(); } }, 60000);
window.__v22 = { greetData, get lyrOpen() { return lyrOpenNow; }, lyrToggle };

// ================= v23: language · Apple-style lyrics · AutoMix 2 · song info · follow · share card · queue edit · speed · voice search · widget =================
const V23_API = typeof API_BASE === "string" ? API_BASE : "";
const V23_NATIVE = typeof NATIVE !== "undefined" && !!NATIVE;
const capP = n => { try { const C = window.Capacitor; return C && C.Plugins && C.isNativePlatform && C.isNativePlatform() ? C.Plugins[n] || null : null; } catch (e) { return null; } };
const reduceMotion = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };

// ---------- 1) App language: Hinglish (default) / हिन्दी / English ----------
// One string table, applied to every UI text node / placeholder / aria-label as the app renders (so every screen, sheet and toast follows).
// Song titles, artist names, lyrics, chat and other content are never touched.
const LANGS = [["en", "English"], ["hinglish", "Hinglish"], ["hi", "हिन्दी"]];
let appLang = store.get("lang", "en"); if (!LANGS.some(l => l[0] === appLang)) appLang = "en"; // English is the default for anyone who never picked
const I18N = new Map();
const I18N_TABLE = `Listen Now|अभी सुनें|Listen Now
Search|खोजें|Search
Library|लाइब्रेरी|Library
Settings|सेटिंग्स|Settings
Account|अकाउंट|Account
Back|वापस|Back
Cancel|रद्द करें|Cancel
Close|बंद करें|Close
Clear|साफ़ करें|Clear
Next|अगला|Next
Previous|पिछला|Previous
Play|चलाएँ|Play
Play/Pause|चलाएँ/रोकें|Play/Pause
Like|पसंद|Like
Love|पसंद करें|Love
Unlike|पसंद हटाएँ|Unlike
More|और|More
Repeat|रिपीट|Repeat
Shuffle|शफ़ल|Shuffle
Shuffle on|शफ़ल चालू|Shuffle on
Shuffle off|शफ़ल बंद|Shuffle off
Download|डाउनलोड|Download
Songs|गाने|Songs
Albums|एल्बम|Albums
Artists|कलाकार|Artists
Playlists|प्लेलिस्ट|Playlists
Browse|ब्राउज़ करें|Browse
See All|सब देखें|See All
Top Picks|टॉप पसंद|Top Picks
Top Picks For You|आपके लिए टॉप पसंद|Top Picks For You
For You|आपके लिए|For You
Playlists for You|आपके लिए प्लेलिस्ट|Playlists for You
Recently Played|हाल ही में सुने|Recently Played
Recent Searches|हाल की खोजें|Recent Searches
Liked Songs|पसंदीदा गाने|Liked Songs
Telegram Downloads|टेलीग्राम डाउनलोड|Telegram Downloads
New Playlist…|नई प्लेलिस्ट…|New Playlist…
Import Playlist|प्लेलिस्ट इम्पोर्ट करें|Import Playlist
Your Recap|आपका रीकैप|Your Recap
Week · Month · Year|हफ़्ता · महीना · साल|Week · Month · Year
Songs, artists, lyrics|गाने, कलाकार, बोल|Songs, artists, lyrics
Search YouTube instead|YouTube पर खोजें|Search YouTube instead
Not the version you wanted?|यह वर्ज़न नहीं चाहिए?|Not the version you wanted?
Playing Next|आगे बजेगा|Playing Next
Up Next|आगे|Up Next
Autoplay on|ऑटोप्ले चालू|Autoplay on
Nothing up next — similar songs get added automatically.|आगे कुछ नहीं — मिलते-जुलते गाने अपने आप जुड़ेंगे।|Nothing up next — similar songs get added automatically.
Play Next|अगला चलाएँ|Play Next
Play Last|आख़िर में चलाएँ|Play Last
Add to Playlist…|प्लेलिस्ट में जोड़ें…|Add to Playlist…
Add to Playlist|प्लेलिस्ट में जोड़ें|Add to Playlist
Share Song|गाना शेयर करें|Share Song
Download to Telegram|टेलीग्राम पर डाउनलोड करें|Download to Telegram
Remove from Telegram|टेलीग्राम से हटाएँ|Remove from Telegram
Remove from Playlist|प्लेलिस्ट से हटाएँ|Remove from Playlist
Remove from Recently Played|हाल ही में सुने से हटाएँ|Remove from Recently Played
Remove from Queue|क्यू से हटाएँ|Remove from Queue
Move to Top|सबसे ऊपर करें|Move to Top
Sending to Telegram…|टेलीग्राम पर भेज रहे हैं…|Sending to Telegram…
Download to phone|फ़ोन में डाउनलोड करें|Download to phone
Download to phone (offline)|फ़ोन में डाउनलोड (ऑफ़लाइन)|Download to phone (offline)
Remove from phone|फ़ोन से हटाएँ|Remove from phone
Download All to phone|सब फ़ोन में डाउनलोड करें|Download All to phone
Download All to Telegram|सब टेलीग्राम पर डाउनलोड करें|Download All to Telegram
Downloaded|डाउनलोड किए गए|Downloaded
Downloaded songs|डाउनलोड किए गाने|Downloaded songs
Downloading…|डाउनलोड हो रहा है…|Downloading…
Downloading to phone…|फ़ोन में डाउनलोड हो रहा है…|Downloading to phone…
Delete Playlist|प्लेलिस्ट हटाएँ|Delete Playlist
Rename|नाम बदलें|Rename
Open Playlist|प्लेलिस्ट खोलें|Open Playlist
Add to Library|लाइब्रेरी में जोड़ें|Add to Library
Added to queue|क्यू में जोड़ा|Added to queue
Playing next|अगला बजेगा|Playing next
Removed|हटा दिया|Removed
Link copied|लिंक कॉपी हुआ|Link copied
Added to Liked Songs ♥|पसंदीदा गानों में जोड़ा ♥|Added to Liked Songs ♥
Removed from Liked Songs|पसंदीदा गानों से हटाया|Removed from Liked Songs
Loading…|लोड हो रहा है…|Loading…
Finding song…|गाना ढूँढ रहे हैं…|Finding song…
Tap play to start|शुरू करने के लिए प्ले दबाएँ|Tap play to start
Trying another quality…|दूसरी क्वालिटी आज़मा रहे हैं…|Trying another quality…
This song couldn't play|यह गाना नहीं चल सका|This song couldn't play
This song can't play right now — skipping|यह गाना अभी नहीं चल रहा — अगला चला रहे हैं|This song can't play right now — skipping
Not on the main source — trying YouTube…|मुख्य स्रोत पर नहीं — YouTube आज़मा रहे हैं…|Not on the main source — trying YouTube…
Playing via YouTube player — keep the app open for this one|YouTube प्लेयर से चल रहा है — इसके लिए ऐप खुला रखें|Playing via YouTube player — keep the app open for this one
You're offline|आप ऑफ़लाइन हैं|You're offline
You're offline.|आप ऑफ़लाइन हैं।|You're offline.
You're offline — Dhun needs internet|आप ऑफ़लाइन हैं — Dhun को इंटरनेट चाहिए|You're offline — Dhun needs internet
Dhun needs internet to play. Your downloaded songs are safe in Telegram.|Dhun चलाने के लिए इंटरनेट चाहिए। आपके डाउनलोड किए गाने टेलीग्राम में सुरक्षित हैं।|Dhun needs internet to play. Your downloaded songs are safe in Telegram.
Your downloaded songs still play.|आपके डाउनलोड किए गाने फिर भी चलेंगे।|Your downloaded songs still play.
Open Downloaded ›|डाउनलोड किए खोलें ›|Open Downloaded ›
Check your connection and try again.|कनेक्शन देखकर फिर कोशिश करें।|Check your connection and try again.
Streaming quality|स्ट्रीमिंग क्वालिटी|Streaming quality
On Wi‑Fi|वाई-फ़ाई पर|On Wi‑Fi
On mobile data|मोबाइल डेटा पर|On mobile data
Data saver mode|डेटा सेवर मोड|Data saver mode
Data saver|डेटा सेवर|Data saver
Use the mobile data quality right now|अभी मोबाइल डेटा वाली क्वालिटी इस्तेमाल करें|Use the mobile data quality right now
Playing now at:|अभी चल रहा है:|Playing now at:
Download quality|डाउनलोड क्वालिटी|Download quality
Equalizer|इक्वलाइज़र|Equalizer
Reset to Flat|फ़्लैट पर रीसेट करें|Reset to Flat
Custom|कस्टम|Custom
Off|बंद|Off
AutoMix off|ऑटोमिक्स बंद|AutoMix off
AutoMix on 🎚️|ऑटोमिक्स चालू 🎚️|AutoMix on 🎚️
AutoMix 🎚️|ऑटोमिक्स 🎚️|AutoMix 🎚️
Gaane ek dusre me mix hote hain, Apple Music jaise. Kitna mix, Dhun har gaane ke hisaab se khud decide karta hai|गाने एक-दूसरे में मिक्स होते हैं, Apple Music जैसे। कितना मिक्स, Dhun हर गाने के हिसाब से ख़ुद तय करता है|Songs blend into each other, like Apple Music. Dhun decides how much to mix for every song
iPhone browser me AutoMix nahi chal sakta (Safari volume change nahi karne deta) — gaane normal tarike se badlenge.|iPhone ब्राउज़र में ऑटोमिक्स नहीं चल सकता (Safari वॉल्यूम बदलने नहीं देता) — गाने सामान्य तरीक़े से बदलेंगे।|AutoMix can't run in the iPhone browser (Safari doesn't allow volume changes) — songs will change normally.
Listen Together me AutoMix band rehta hai, taaki sabka gaana ek saath chale.|लिसन टुगेदर में ऑटोमिक्स बंद रहता है, ताकि सबका गाना एक साथ चले।|AutoMix stays off in Listen Together, so everyone's song stays in sync.
Connect Telegram|टेलीग्राम जोड़ें|Connect Telegram
Sign in with Telegram|टेलीग्राम से साइन इन करें|Sign in with Telegram
Signed in with Telegram ✅|टेलीग्राम से साइन इन ✅|Signed in with Telegram ✅
Not signed in|साइन इन नहीं|Not signed in
Log out|लॉग आउट|Log out
Sync now|अभी सिंक करें|Sync now
Synced ✅|सिंक हो गया ✅|Synced ✅
Couldn't sync, check internet|सिंक नहीं हुआ, इंटरनेट देखें|Couldn't sync, check internet
Connected|जुड़ा हुआ|Connected
Save your likes & playlists to your own account, get them back on any phone|अपनी पसंद और प्लेलिस्ट अपने अकाउंट में सेव करें, किसी भी फ़ोन पर वापस पाएँ|Save your likes & playlists to your own account, get them back on any phone
Until you connect, everything stays only on this phone.|जोड़ने तक सब कुछ सिर्फ़ इसी फ़ोन पर रहेगा।|Until you connect, everything stays only on this phone.
Open Telegram|टेलीग्राम खोलें|Open Telegram
Open in Telegram|टेलीग्राम में खोलें|Open in Telegram
Created with|बनाया गया|Created with
Support &amp; Love|सपोर्ट और प्यार|Support & Love
Support & Love|सपोर्ट और प्यार|Support & Love
Contact us|संपर्क करें|Contact us
Deals channel|डील्स चैनल|Deals channel
Join Deals channel|डील्स चैनल जॉइन करें|Join Deals channel
Join Deals channel 🛍️|डील्स चैनल जॉइन करें 🛍️|Join Deals channel 🛍️
Daily deals|रोज़ की डील्स|Daily deals
Best shopping deals, daily · on Telegram|सबसे अच्छी शॉपिंग डील्स, रोज़ · टेलीग्राम पर|Best shopping deals, daily · on Telegram
Install app|ऐप इंस्टॉल करें|Install app
Add to Home Screen|होम स्क्रीन पर जोड़ें|Add to Home Screen
Make it an app:|इसे ऐप बनाएँ:|Make it an app:
Listen Together|साथ में सुनें|Listen Together
Start Listen Together|साथ में सुनना शुरू करें|Start Listen Together
Listen Together chat|साथ में सुनें — चैट|Listen Together chat
Listen Together live 🎧|साथ में सुनें लाइव 🎧|Listen Together live 🎧
Stop Listen Together (sabke liye)|साथ में सुनना बंद करें (सबके लिए)|Stop Listen Together (for everyone)
Leave (sirf main)|छोड़ें (सिर्फ़ मैं)|Leave (just me)
Sirf main nikalun (Leave)|सिर्फ़ मैं निकलूँ|Just me (Leave)
Haan, sabke liye band karo|हाँ, सबके लिए बंद करें|Yes, stop for everyone
Listen Together band karein?|साथ में सुनना बंद करें?|Stop Listen Together?
Join karo 🎧|जॉइन करें 🎧|Join 🎧
Join|जॉइन|Join
Start|शुरू|Start
Send|भेजें|Send
Chat|चैट|Chat
💬 Chat|💬 चैट|💬 Chat
Close chat|चैट बंद करें|Close chat
Copy link|लिंक कॉपी करें|Copy link
Session code|सेशन कोड|Session code
Aapka naam|आपका नाम|Your name
Naam likho|नाम लिखें|Type your name
Pehle apna naam likho|पहले अपना नाम लिखें|Type your name first
Message likho…|मैसेज लिखें…|Type a message…
Message nahi gaya, dobara bhejo|मैसेज नहीं गया, फिर भेजें|Message not sent, send again
Abhi koi message nahi. Kuch likho — sab ko dikhega 👋|अभी कोई मैसेज नहीं। कुछ लिखें — सबको दिखेगा 👋|No messages yet. Write something — everyone will see it 👋
Dost ko ye code ya link bhejo|दोस्त को यह कोड या लिंक भेजें|Send this code or link to a friend
ya code se join karo|या कोड से जॉइन करें|or join with a code
Sun rahe hain|सुन रहे हैं|Listening
Sab koi gaana badal, pause, aage-peeche kar sakta hai|कोई भी गाना बदल, रोक, आगे-पीछे कर सकता है|Anyone can change, pause or skip the song
Dosto ke saath ek hi gaana, ek hi time pe — kahin bhi ho, koi bhi phone ho. Sab gaana badal / pause kar sakte hain.|दोस्तों के साथ एक ही गाना, एक ही समय पर — कहीं भी हों, कोई भी फ़ोन हो। सब गाना बदल / रोक सकते हैं।|The same song at the same moment with friends — anywhere, any phone. Everyone can change / pause it.
Sheet band kar do to bhi chalta rahega|शीट बंद करने पर भी चलता रहेगा|Keeps going even if you close this sheet
Ye Listen Together session khatam ho gaya|यह साथ में सुनने का सेशन ख़त्म हो गया|This Listen Together session has ended
Session start nahi hua, internet check karo|सेशन शुरू नहीं हुआ, इंटरनेट देखें|Couldn't start the session, check your internet
Listen Together: internet slow hai…|साथ में सुनें: इंटरनेट धीमा है…|Listen Together: internet is slow…
Listen Together: connection slow, retry ho raha hai…|साथ में सुनें: कनेक्शन धीमा, फिर कोशिश हो रही है…|Listen Together: connection slow, retrying…
Listen Together se nikal gaye — gaana aapke phone pe chalta rahega|साथ में सुनने से निकल गए — गाना आपके फ़ोन पर चलता रहेगा|You left Listen Together — the song keeps playing on your phone
Listen Together band kar diya (sabke liye) — gaana aapke phone pe chalta rahega|साथ में सुनना बंद (सबके लिए) — गाना आपके फ़ोन पर चलता रहेगा|Listen Together stopped (for everyone) — the song keeps playing on your phone
Sabki queue shuffle ho gayi|सबकी क्यू शफ़ल हो गई|Everyone's queue was shuffled
Sabki queue me add ho gaya 🎧|सबकी क्यू में जुड़ गया 🎧|Added to everyone's queue 🎧
Sabke liye next me laga diya 🎧|सबके लिए अगला लगा दिया 🎧|Playing next for everyone 🎧
Queue khali hai — koi gaana chalao|क्यू ख़ाली है — कोई गाना चलाएँ|Queue is empty — play a song
Station nahi mila, internet check karo|स्टेशन नहीं मिला, इंटरनेट देखें|Couldn't find a station, check your internet
📻 Radio shuru karo|📻 रेडियो शुरू करें|📻 Start radio
📻 Radio shuru ho raha hai…|📻 रेडियो शुरू हो रहा है…|📻 Starting radio…
Album dekho|एल्बम देखें|View album
Artist dekho:|कलाकार देखें:|View artist:
Kis artist ka page kholna hai?|किस कलाकार का पेज खोलना है?|Which artist's page?
Sab chalao|सब चलाएँ|Play all
Gaane abhi nahi mil paaye 😕|गाने अभी नहीं मिल पाए 😕|Couldn't load songs right now 😕
Internet check karke dobara try karo.|इंटरनेट देखकर फिर कोशिश करें।|Check your internet and try again.
Internet nahi hai, check karke dobara try karo.|इंटरनेट नहीं है, देखकर फिर कोशिश करें।|No internet, check and try again.
Dobara try karo|फिर कोशिश करें|Try again
Try again|फिर कोशिश करें|Try again
🔥 Top Charts|🔥 टॉप चार्ट्स|🔥 Top Charts
😊 Mood Mixes|😊 मूड मिक्स|😊 Mood Mixes
Top 50|टॉप 50|Top 50
Aaj ke hits|आज के हिट्स|Today's hits
😴 Sleep timer|😴 स्लीप टाइमर|😴 Sleep timer
Sleep timer|स्लीप टाइमर|Sleep timer
Sleep timer band|स्लीप टाइमर बंद|Sleep timer off
Timer band karo|टाइमर बंद करें|Turn off timer
Gaana khatam hone pe|गाना ख़त्म होने पर|End of song
😴 Ye gaana khatam hote hi music band|😴 यह गाना ख़त्म होते ही संगीत बंद|😴 Music stops when this song ends
😴 Sleep timer: music band. Good night!|😴 स्लीप टाइमर: संगीत बंद। शुभ रात्रि!|😴 Sleep timer: music stopped. Good night!
😴 Gaana khatam — music band. Good night!|😴 गाना ख़त्म — संगीत बंद। शुभ रात्रि!|😴 Song over — music stopped. Good night!
😴 Sleep timer: Listen Together se nikal ke music band kiya|😴 स्लीप टाइमर: साथ में सुनने से निकलकर संगीत बंद किया|😴 Sleep timer: left Listen Together and stopped the music
🎤 Lyrics ke liye photo pe tap karo|🎤 बोल देखने के लिए फ़ोटो पर टैप करें|🎤 Tap the photo for lyrics
🎤 Lyrics|🎤 बोल|🎤 Lyrics
Lyrics la raha hoon…|बोल ला रहे हैं…|Loading lyrics…
Lyrics nahi mile 😕|बोल नहीं मिले 😕|No lyrics found 😕
Pehle koi gaana chalao|पहले कोई गाना चलाएँ|Play a song first
Lyrics dikhao|बोल दिखाएँ|Show lyrics
Photo dikhao|फ़ोटो दिखाएँ|Show photo
Abhi recap khaali hai|अभी रीकैप ख़ाली है|Your recap is empty for now
Most-played day|सबसे ज़्यादा सुना गया दिन|Most-played day
Top Songs|टॉप गाने|Top Songs
Top Artists|टॉप कलाकार|Top Artists
Top language|टॉप भाषा|Top language
minutes listened|मिनट सुने|minutes listened
new discoveries|नई खोजें|new discoveries
Share my Recap|मेरा रीकैप शेयर करें|Share my Recap
Recap image saved 📸|रीकैप फ़ोटो सेव हुई 📸|Recap image saved 📸
Your Week in Dhun 🎧|Dhun में आपका हफ़्ता 🎧|Your Week in Dhun 🎧
Import|इम्पोर्ट|Import
Paste|पेस्ट|Paste
Aur import karo|और इम्पोर्ट करें|Import more
Spotify ya Apple Music se|Spotify या Apple Music से|From Spotify or Apple Music
Pehle playlist ka link paste karo|पहले प्लेलिस्ट का लिंक पेस्ट करें|Paste the playlist link first
Paste nahi hua, link khud paste karo|पेस्ट नहीं हुआ, लिंक ख़ुद पेस्ट करें|Couldn't paste, paste the link yourself
Playlist khol rahe hain…|प्लेलिस्ट खोल रहे हैं…|Opening playlist…
Abhi playlist load nahi ho payi, thodi der me try karo.|अभी प्लेलिस्ट लोड नहीं हो पाई, थोड़ी देर में कोशिश करें।|Couldn't load the playlist, try again in a bit.
For You refresh ho raha hai…|आपके लिए रिफ़्रेश हो रहा है…|Refreshing For You…
Refresh|रिफ़्रेश|Refresh
Abhi chalao|अभी चलाएँ|Play now
Next me lagao|अगला लगाएँ|Play next
Queue se hatao|क्यू से हटाएँ|Remove from queue
Mix|मिक्स|Mix
Check for updates|अपडेट देखें|Check for updates
Checking for updates…|अपडेट देख रहे हैं…|Checking for updates…
Already up to date ✅|पहले से अपडेटेड ✅|Already up to date ✅
Naya update available 🎉|नया अपडेट उपलब्ध 🎉|New update available 🎉
Update now|अभी अपडेट करें|Update now
Update|अपडेट|Update
Baad me|बाद में|Later
Couldn't check for updates, try later|अपडेट नहीं देख पाए, बाद में कोशिश करें|Couldn't check for updates, try later
About|जानकारी|About
Settings kholo|सेटिंग्स खोलें|Open Settings
Delete all phone downloads|फ़ोन के सारे डाउनलोड हटाएँ|Delete all phone downloads
All phone downloads deleted|फ़ोन के सारे डाउनलोड हटा दिए|All phone downloads deleted
Removed from phone|फ़ोन से हटाया|Removed from phone
Already on your phone ✓|पहले से फ़ोन में है ✓|Already on your phone ✓
All already on your phone ✓|सब पहले से फ़ोन में हैं ✓|All already on your phone ✓
Already in your Telegram ✓|पहले से टेलीग्राम में है ✓|Already in your Telegram ✓
All already in your Telegram ✓|सब पहले से टेलीग्राम में हैं ✓|All already in your Telegram ✓
In your Telegram ✓|टेलीग्राम में है ✓|In your Telegram ✓
Telegram pe bhej diya ✅|टेलीग्राम पर भेज दिया ✅|Sent to Telegram ✅
Couldn't reach the server, try again|सर्वर से संपर्क नहीं हुआ, फिर कोशिश करें|Couldn't reach the server, try again
Couldn't remove, check internet|हटा नहीं पाए, इंटरनेट देखें|Couldn't remove, check internet
Logged out. Your library is safe in your account|लॉग आउट हो गए। आपकी लाइब्रेरी अकाउंट में सुरक्षित है|Logged out. Your library is safe in your account
Your library is back ✅ (likes, playlists, history)|आपकी लाइब्रेरी वापस आ गई ✅ (पसंद, प्लेलिस्ट, इतिहास)|Your library is back ✅ (likes, playlists, history)
Offline, will sync later|ऑफ़लाइन, बाद में सिंक होगा|Offline, will sync later
Saving…|सेव हो रहा है…|Saving…
Share…|शेयर…|Share…
This one is from YouTube, it can't be downloaded|यह YouTube से है, डाउनलोड नहीं हो सकता|This one is from YouTube, it can't be downloaded
Telegram copy didn't load, playing from JioSaavn…|टेलीग्राम कॉपी लोड नहीं हुई, JioSaavn से चला रहे हैं…|Telegram copy didn't load, playing from JioSaavn…
No songs yet. Tap “···” on any song and choose Add to Playlist.|अभी कोई गाना नहीं। किसी भी गाने पर “···” दबाएँ और प्लेलिस्ट में जोड़ें चुनें।|No songs yet. Tap “···” on any song and choose Add to Playlist.
abhi chalaya|अभी चलाया|just played
shuffle me|शफ़ल में|on shuffle
chal rahe hain|चल रहे हैं|playing
Good Morning ☀️|सुप्रभात ☀️|Good Morning ☀️
Good Afternoon 🌤️|नमस्ते 🌤️|Good Afternoon 🌤️
Good Evening 🌆|शुभ संध्या 🌆|Good Evening 🌆
Good Night 🌙|शुभ रात्रि 🌙|Good Night 🌙
Aaj kya sunoge? 🎧|आज क्या सुनेंगे? 🎧|What will you listen to today? 🎧
Chai ke saath kuch mast sa? ☕|चाय के साथ कुछ बढ़िया सा? ☕|Something nice with your chai? ☕
Din ki shuruaat ek acche gaane se 🎶|दिन की शुरुआत एक अच्छे गाने से 🎶|Start the day with a great song 🎶
Fresh mood, fresh music ✨|ताज़ा मूड, ताज़ा संगीत ✨|Fresh mood, fresh music ✨
Chalo kuch mast bajate hain 🎶|चलो कुछ बढ़िया बजाते हैं 🎶|Let's play something great 🎶
Thoda break, thoda music 🎵|थोड़ा ब्रेक, थोड़ा संगीत 🎵|A little break, a little music 🎵
Aaj ka vibe kya hai? 💫|आज का मूड क्या है? 💫|What's today's vibe? 💫
Shaam ho gayi, music on karo 🌇|शाम हो गई, संगीत चालू करें 🌇|It's evening, turn the music on 🌇
Thoda music, thoda sukoon 🎵|थोड़ा संगीत, थोड़ा सुकून 🎵|A little music, a little peace 🎵
Sone se pehle kuch soft sa? 🌙|सोने से पहले कुछ धीमा सा? 🌙|Something soft before sleep? 🌙
Raat, headphones aur aapke gaane 🎧|रात, हेडफ़ोन और आपके गाने 🎧|Night, headphones and your songs 🎧
🌐 Language|🌐 भाषा|🌐 Language
App ki bhasha|ऐप की भाषा|App language
Bhasha badal di ✅|भाषा बदल दी ✅|Language changed ✅
ℹ️ Song info|ℹ️ गाने की जानकारी|ℹ️ Song info
Song info|गाने की जानकारी|Song info
Singer|गायक|Singer
Singers|गायक|Singers
Music|संगीत|Music
Lyricist|गीतकार|Lyricist
Lyrics by|गीतकार|Lyrics by
Starring|कलाकार|Starring
Album|एल्बम|Album
Label|लेबल|Label
Release|रिलीज़|Release
Language|भाषा|Language
Duration|अवधि|Duration
Plays|प्ले|Plays
Info la raha hoon…|जानकारी ला रहे हैं…|Loading info…
Info nahi mili 😕|जानकारी नहीं मिली 😕|Couldn't get the info 😕
⭐ Follow|⭐ फ़ॉलो करें|⭐ Follow
✓ Following|✓ फ़ॉलो कर रहे हैं|✓ Following
⭐ Following|⭐ फ़ॉलो किए कलाकार|⭐ Following
Following|फ़ॉलो किए कलाकार|Following
⭐ Naye gaane — aapke artists|⭐ नए गाने — आपके कलाकार|⭐ New from artists you follow
Abhi kisi artist ko follow nahi kiya. Artist page pe ⭐ Follow dabao — unka naya gaana aate hi bataenge.|अभी किसी कलाकार को फ़ॉलो नहीं किया। कलाकार पेज पर ⭐ फ़ॉलो दबाएँ — उनका नया गाना आते ही बताएँगे।|You don't follow any artists yet. Tap ⭐ Follow on an artist page — we'll tell you when they release something new.
Naya gaana aate hi Telegram bot pe message aayega 🔔|नया गाना आते ही टेलीग्राम बॉट पर मैसेज आएगा 🔔|You'll get a Telegram bot message when they release a new song 🔔
Telegram se sign in karo to naye gaane ka message bot pe bhi aayega|टेलीग्राम से साइन इन करें तो नए गाने का मैसेज बॉट पर भी आएगा|Sign in with Telegram to also get new-song messages from the bot
Unfollow|अनफ़ॉलो|Unfollow
📸 Share card|📸 शेयर कार्ड|📸 Share card
Share card|शेयर कार्ड|Share card
Card bana raha hoon…|कार्ड बना रहे हैं…|Making the card…
Share karo|शेयर करें|Share
Save karo|सेव करें|Save
Card save ho gaya 📸|कार्ड सेव हो गया 📸|Card saved 📸
Lyric line ke saath|बोल की लाइन के साथ|With lyric line
Line hatao|लाइन हटाएँ|Remove line
Card nahi ban paya 😕|कार्ड नहीं बन पाया 😕|Couldn't make the card 😕
⏩ Speed|⏩ स्पीड|⏩ Speed
Playback speed|प्लेबैक स्पीड|Playback speed
Awaaz ki pitch same rahegi|आवाज़ की पिच वही रहेगी|The voice pitch stays the same
Listen Together me speed 1× rehti hai|साथ में सुनने में स्पीड 1× रहती है|Speed stays 1× in Listen Together
🔊 Bass Boost|🔊 बेस बूस्ट|🔊 Bass Boost
Bass Boost on 🔊|बेस बूस्ट चालू 🔊|Bass Boost on 🔊
Bass Boost off|बेस बूस्ट बंद|Bass Boost off
Bass Boost on — AutoMix tab tak band rahega (EQ ke saath mix nahi hota)|बेस बूस्ट चालू — तब तक ऑटोमिक्स बंद रहेगा (EQ के साथ मिक्स नहीं होता)|Bass Boost on — AutoMix pauses while it's on (no mixing with EQ)
Clear queue|क्यू साफ़ करें|Clear queue
Queue saaf ✅|क्यू साफ़ ✅|Queue cleared ✅
Hata diya|हटा दिया|Removed
Wapas lao|वापस लाएँ|Undo
Bolo… gaane ka naam|बोलिए… गाने का नाम|Speak… the song name
Sun raha hoon…|सुन रहे हैं…|Listening…
Awaaz samajh nahi aayi, dobara bolo|आवाज़ समझ नहीं आई, फिर बोलें|Didn't catch that, try again
Voice search|आवाज़ से खोजें|Voice search
Pehchan raha hoon…|पहचान रहे हैं…|Identifying…
Remove|हटाएँ|Remove
Clear all|सब साफ़ करें|Clear all
Naya gaana|नया गाना|New song
Telegram se sign in karo|टेलीग्राम से साइन इन करें|Sign in with Telegram
open your browser menu and choose|अपने ब्राउज़र का मेन्यू खोलें और चुनें|open your browser menu and choose
. It opens full-screen, no ads, keeps playing when you lock your phone.|। यह फ़ुल-स्क्रीन खुलता है, कोई विज्ञापन नहीं, फ़ोन लॉक होने पर भी चलता है।|. It opens full-screen, no ads, keeps playing when you lock your phone.
Gaane suno, aapka weekly recap yahan banega|गाने सुनें, आपका साप्ताहिक रीकैप यहाँ बनेगा|Listen to songs, your weekly recap will appear here
Trending Now|अभी ट्रेंडिंग|Trending Now
Trending Bollywood|ट्रेंडिंग बॉलीवुड|Trending Bollywood
Romantic Hindi|रोमांटिक हिंदी|Romantic Hindi
Punjabi Hits|पंजाबी हिट्स|Punjabi Hits
Lofi & Chill|लो-फ़ाई और चिल|Lofi & Chill
90s Bollywood|90 के दशक का बॉलीवुड|90s Bollywood
Devotional|भक्ति|Devotional
Global Hits|ग्लोबल हिट्स|Global Hits
Connect|जोड़ें|Connect
Not connected|जुड़ा नहीं|Not connected
Not connected · tap to connect|जुड़ा नहीं · जोड़ने के लिए टैप करें|Not connected · tap to connect
Dosto ke saath ek saath suno|दोस्तों के साथ एक साथ सुनें|Listen together with friends
High|हाई|High
Normal|नॉर्मल|Normal
Lowest|सबसे कम|Lowest
Connect Telegram to get your own account: likes, playlists, recently played and downloads are saved to it and come back on any phone.|अपना अकाउंट पाने के लिए टेलीग्राम जोड़ें: पसंद, प्लेलिस्ट, हाल ही में सुने और डाउनलोड उसमें सेव होंगे और किसी भी फ़ोन पर वापस मिलेंगे।|Connect Telegram to get your own account: likes, playlists, recently played and downloads are saved to it and come back on any phone.
iPhone doesn't tell websites if you're on Wi‑Fi or mobile data, so|iPhone वेबसाइटों को नहीं बताता कि आप वाई-फ़ाई पर हैं या मोबाइल डेटा पर, इसलिए|iPhone doesn't tell websites if you're on Wi‑Fi or mobile data, so
turn on Data saver when you leave Wi‑Fi|वाई-फ़ाई से बाहर जाते ही डेटा सेवर चालू करें|turn on Data saver when you leave Wi‑Fi
. Quick switch: tap the quality badge under the progress bar on the Now Playing screen.|। जल्दी बदलने के लिए: अभी चल रहा स्क्रीन पर प्रोग्रेस बार के नीचे क्वालिटी बैज दबाएँ।|. Quick switch: tap the quality badge under the progress bar on the Now Playing screen.
AutoMix|ऑटोमिक्स|AutoMix
⚠️ On iPhone, the equalizer can make music stop when you lock the screen or switch apps. Keep it|⚠️ iPhone पर, स्क्रीन लॉक करने या ऐप बदलने पर इक्वलाइज़र से संगीत रुक सकता है। बैकग्राउंड में सुनने के लिए इसे|⚠️ On iPhone, the equalizer can make music stop when you lock the screen or switch apps. Keep it
off|बंद रखें|off
for background listening.|।|for background listening.
Flat|फ़्लैट|Flat
Vocal|वोकल|Vocal
Party|पार्टी|Party
Soft|सॉफ़्ट|Soft
Wi‑Fi|वाई-फ़ाई|Wi‑Fi
mobile data|मोबाइल डेटा|mobile data
Your browser says you're on|आपका ब्राउज़र बताता है कि आप|Your browser says you're on
, so quality switches automatically.|पर हैं, इसलिए क्वालिटी अपने आप बदलती है।|, so quality switches automatically.
Install Dhun on your iPhone|Dhun को अपने iPhone पर इंस्टॉल करें|Install Dhun on your iPhone
Install Dhun|Dhun इंस्टॉल करें|Install Dhun
Podcasts|पॉडकास्ट|Podcasts
🎙️ Podcasts|🎙️ पॉडकास्ट|🎙️ Podcasts
Kahaniyan, comedy, gyaan — sab free|कहानियाँ, कॉमेडी, ज्ञान — सब मुफ़्त|Stories, comedy, knowledge — all free
Kahaniyan, comedy, gyaan|कहानियाँ, कॉमेडी, ज्ञान|Stories, comedy, knowledge
Podcast dhoondo…|पॉडकास्ट खोजें…|Search podcasts…
Continue listening|सुनना जारी रखें|Continue listening
Aapke podcasts|आपके पॉडकास्ट|Your podcasts
Categories|श्रेणियाँ|Categories
Kuch nahi mila 😕|कुछ नहीं मिला 😕|Nothing found 😕
Load nahi hua — internet check karo|लोड नहीं हुआ — इंटरनेट देखें|Couldn't load — check your internet
La raha hoon…|ला रहे हैं…|Loading…
＋ Follow|＋ फ़ॉलो करें|＋ Follow
Follow kar liya 🎙️|फ़ॉलो कर लिया 🎙️|Following 🎙️
Unfollow kar diya|अनफ़ॉलो कर दिया|Unfollowed
Latest episode|नया एपिसोड|Latest episode
Resume|जारी रखें|Resume
Episodes|एपिसोड|Episodes
Aur episodes|और एपिसोड|More episodes
✓ Played|✓ सुन लिया|✓ Played
aur padho|और पढ़ें|read more
kam dikhao|कम दिखाएँ|show less
Is episode ke notes nahi hain|इस एपिसोड के नोट्स नहीं हैं|This episode has no notes
🎙️ Episode notes|🎙️ एपिसोड नोट्स|🎙️ Episode notes
Listen Together me podcast nahi chalta — pehle session band karo|साथ में सुनने में पॉडकास्ट नहीं चलता — पहले सेशन बंद करें|Podcasts don't play in Listen Together — stop the session first
Episode nahi chal paya 😕 thodi der baad try karo|एपिसोड नहीं चल पाया 😕 थोड़ी देर बाद कोशिश करें|Episode couldn't play 😕 try again in a bit
🎙️ Show kholo|🎙️ शो खोलें|🎙️ Open show
✓ Played mark karo|✓ सुना हुआ मार्क करें|✓ Mark as played
↺ Unplayed mark karo|↺ बिना सुना मार्क करें|↺ Mark as unplayed
Podcast episodes Liked Songs me nahi jaate|पॉडकास्ट एपिसोड पसंदीदा गानों में नहीं जाते|Podcast episodes don't go into Liked Songs
Podcast episodes Telegram pe download nahi hote|पॉडकास्ट एपिसोड टेलीग्राम पर डाउनलोड नहीं होते|Podcast episodes can't be downloaded to Telegram
Episode khatam ✓|एपिसोड ख़त्म ✓|Episode finished ✓
Iske baad koi episode nahi — queue khatam pe ruk jayega|इसके बाद कोई एपिसोड नहीं — क्यू ख़त्म होने पर रुक जाएगा|No episode after this — playback stops at the end
Aaj|आज|Today
Kal|कल|Yesterday
tap the Share button|Safari में शेयर बटन|tap the Share button
in Safari, then|दबाएँ, फिर|in Safari, then`;

I18N_TABLE.split("\n").forEach(l => { const a = l.split("|"); if (a.length === 3) I18N.set(a[0].trim(), [a[1].trim(), a[2].trim() || a[0].trim()]); });
const GREET_HI = { Morning: "सुप्रभात", Afternoon: "नमस्ते", Evening: "शुभ संध्या", Night: "शुभ रात्रि" };
const I18N_RX = [ // [pattern, hindi, english]  (strings with numbers / names inside)
  [/^Good (Morning|Afternoon|Evening|Night), (.+) (\S+)$/u, (m, a, n, e) => `${GREET_HI[a]}, ${n} ${e}`, null],
  [/^(\d+) gaane$/, "$1 गाने", "$1 songs"],
  [/^(\d+) episodes?$/, "$1 एपिसोड", null],
  [/^(\d+) din pehle$/, "$1 दिन पहले", "$1 days ago"],
  [/^“(.+)” ke results$/u, "“$1” के नतीजे", "Results for “$1”"],
  [/^(\d+) follow kiye$/, "$1 फ़ॉलो किए", "$1 followed"],
  [/^(.+) baaki$/u, "$1 बाक़ी", "$1 left"],
  [/^(Wi‑Fi|Data saver) · (\d+) kbps$/u, (m, a, k) => `${a === "Wi‑Fi" ? "वाई-फ़ाई" : "डेटा सेवर"} · ${k} kbps`, null],
  [/^About (\d+) MB for a 4-minute song, stored in Telegram, not on your phone\.$/, "4 मिनट के गाने के लिए लगभग $1 MB, टेलीग्राम में सेव, आपके फ़ोन में नहीं।", null],
  [/^(\d+) songs?$/, "$1 गाने", null],
  [/^(\d+) song(s?) · (.+)$/, "$1 गाने · $3", null],
  [/^(.+) followers$/, "$1 फ़ॉलोअर्स", null],
  [/^(\d+) gaane · (.+)$/, "$1 गाने · $2", "$1 songs · $2"],
  [/^(.+) · (\d+) gaane$/, "$1 · $2 गाने", "$1 · $2 songs"],
  [/^Artist dekho: (.+)$/u, "कलाकार देखें: $1", "View artist: $1"],
  [/^Album dekho: (.+)$/u, "एल्बम देखें: $1", "View album: $1"],
  [/^⏩ Speed: (.+)$/u, "⏩ स्पीड: $1", null],
  [/^🔊 Bass Boost: On$/u, "🔊 बेस बूस्ट: चालू", null],
  [/^🔊 Bass Boost: Off$/u, "🔊 बेस बूस्ट: बंद", null],
  [/^😴 Sleep timer: (\d+) min$/u, "😴 स्लीप टाइमर: $1 मिनट", null],
  [/^(\d+) min baaki$/, "$1 मिनट बाक़ी", "$1 min left"],
  [/^Speed (.+)× ⏩$/u, "स्पीड $1× ⏩", null],
  [/^⭐ (.+) ko follow kiya$/u, "⭐ $1 को फ़ॉलो किया", "⭐ Following $1"],
  [/^(.+) ko unfollow kiya$/u, "$1 को अनफ़ॉलो किया", "Unfollowed $1"],
  [/^(\d+) artists?$/, "$1 कलाकार", null],
  [/^(\d+) gaane hataye$/, "$1 गाने हटाए", "$1 songs removed"],
  [/^“(.+)” queue se hataya$/u, "“$1” क्यू से हटाया", "Removed “$1” from the queue"],
];
function tr(s) {
  if (appLang === "hinglish" || !s) return s;
  const k = s.trim(); if (!k || k.length > 300) return s;
  let out = null; const e = I18N.get(k);
  if (e) out = appLang === "hi" ? e[0] : e[1];
  else for (const r of I18N_RX) { if (r[0].test(k)) { const rep = appLang === "hi" ? r[1] : r[2]; if (rep != null) out = k.replace(r[0], rep); break; } }
  if (out == null || out === k) return s;
  const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0];
  return lead + out + tail;
}
const trOrig = new WeakMap(), trMine = new WeakMap(), trAttrO = new WeakMap();
const TR_SKIP = "#npTitle,#npArtist,#miniTitle,#miniArtist,.lyrBody,#lyrPanel p,.row .t,.tile .t1,.tile .t2,.shead .t1,.shead .sub,.arHero h1,.dtT,.dealsHome,.djOne,.jamChat .jcList,.jcMsg,script,style,textarea,input,.siVal,.qT,.scPrev,[data-notr]";
function trText(n) {
  const p = n.parentElement; if (!p || p.closest(TR_SKIP)) return;
  let o = trOrig.get(n);
  if (o === undefined || n.data !== trMine.get(n)) { o = n.data; trOrig.set(n, o); }
  const v = tr(o);
  trMine.set(n, v);
  if (v !== n.data) n.data = v;
}
function trAttrs(el) {
  for (const a of ["placeholder", "aria-label", "title"]) {
    if (!el.hasAttribute || !el.hasAttribute(a)) continue;
    let m = trAttrO.get(el); if (!m) { m = {}; trAttrO.set(el, m); }
    const cur = el.getAttribute(a);
    if (m[a] === undefined || cur !== m[a + "$"]) m[a] = cur;
    const v = tr(m[a]); m[a + "$"] = v; if (v !== cur) el.setAttribute(a, v);
  }
}
function trTree(root) {
  if (!root) return;
  if (root.nodeType === 3) return trText(root);
  if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
  if (root.nodeType === 1) { if (root.closest(TR_SKIP) && !root.matches("input,textarea")) return; trAttrs(root); }
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n; while ((n = w.nextNode())) { if (n.nodeType === 3) trText(n); else trAttrs(n); }
}
let trBusy = false, trEver = appLang !== "hinglish";
const trObs = new MutationObserver(muts => {
  if (trBusy || !trEver) return; trBusy = true;
  try { for (const m of muts) { if (m.type === "characterData") trText(m.target); else if (m.type === "attributes") trAttrs(m.target); else m.addedNodes.forEach(trTree); } } finally { trBusy = false; }
});
trObs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title"] });
function setLang(l) {
  if (!LANGS.some(x => x[0] === l)) return;
  appLang = l; store.set("lang", l); trEver = true;
  document.documentElement.lang = l === "hi" ? "hi" : "en";
  trBusy = true; try { trTree(document.body); } finally { trBusy = false; }
  try { rerender(); } catch (e) {}
  try { renderQueue(); } catch (e) {}
}
if (appLang !== "hinglish") { document.documentElement.lang = appLang === "hi" ? "hi" : "en"; trBusy = true; try { trTree(document.body); } finally { trBusy = false; } }
const T = s => tr(s); // for strings built in code (alerts, share text)

// ---------- 2) Lyrics, Apple Music style ----------
// Big bold lines; the sung line is bright, slightly larger and fills left→right over its duration (word timing when the LRC has
// <mm:ss.xx> word tags, else spread across the line); other lines dim + softly blurred; spring scroll keeps the line in the upper third;
// instrumental gaps show • • • that fill up until the next line. Only transform / opacity / a CSS variable change per frame.
function lyrBuild(syn) { // -> display items
  const items = [], est = l => Math.max(0.9, Math.min(7, 0.75 + l.x.length * 0.075));
  if (syn.length && syn[0].t > 4) items.push({ dots: 1, t: 0.4, end: syn[0].t, li: 0 });
  syn.forEach((l, i) => {
    const nx = syn[i + 1], nt = nx ? nx.t : l.t + 8;
    if (!l.x || /^[♪♫\s.…-]*$/.test(l.x)) { if (nt - l.t > 2.5) items.push({ dots: 1, t: l.t, end: nt, li: i + 1 < syn.length ? i + 1 : i }); return; }
    const words = l.w && l.w.length ? l.w : null;
    let d = words ? Math.max(0.5, (l.wEnd || words[words.length - 1].t + 0.6) - l.t) : Math.min(nt - l.t, est(l));
    d = Math.max(0.4, Math.min(d, nt - l.t));
    items.push({ x: l.x, t: l.t, end: l.t + d, li: i, w: words });
    if (nx && nt - (l.t + d) > 6) items.push({ dots: 1, t: l.t + d + 0.6, end: nt, li: i + 1 });
  });
  return items;
}
const parseLRCRaw = parseLRC;
parseLRC = function (s) { // keeps v21 output, adds word timings from enhanced LRC (<mm:ss.xx>word)
  const out = [];
  for (const line of String(s || "").split(/\r?\n/)) {
    const tags = [...line.matchAll(/\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g)]; if (!tags.length) continue;
    const body = line.replace(/\[[^\]]*\]/g, "");
    const wt = [...body.matchAll(/<(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)>([^<]*)/g)];
    let x = body.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(), w = null, wEnd = 0;
    if (wt.length > 1) { w = []; let c = 0; for (const m of wt) { const tt = +m[1] * 60 + parseFloat(m[2].replace(":", ".")), txt = m[3]; if (txt.trim()) { w.push({ t: tt, c, n: txt.trim().length }); } else wEnd = tt; c += txt.replace(/\s+/g, " ").length; } x = wt.map(m => m[3]).join("").replace(/\s+/g, " ").trim(); }
    for (const m of tags) out.push({ t: +m[1] * 60 + parseFloat(m[2].replace(":", ".")), x, w, wEnd });
  }
  return out.sort((a, b) => a.t - b.t);
};
const lyr2 = { items: null, id: null, cur: -2, raf: 0, y: 0, v: 0, target: null, lastT: 0, curEl: null };
const lyrRenderV22 = lyrRender;
lyrRender = function () {
  const p = $("#lyrPanel"); if (!p) return;
  const c = lyrCache.get(lyrFor) || {};
  lyr2.items = null; lyr2.cur = -2; lyr2.curEl = null;
  if (!queue[qi] || c.loading || !c.synced) { lyrRenderV22(); p.classList.toggle("lyrPlainMode", !!c.plain && !c.synced); return; }
  p.classList.remove("lyrPlainMode");
  const items = lyrBuild(c.synced); lyr2.items = items; lyr2.id = lyrFor;
  p.innerHTML = `<div class="lyrBody synced am"><div class="lyrPad"></div>${items.map((it, k) => it.dots
    ? `<p class="ldots fut" data-li="${it.li}" data-k="${k}" style="--i:${Math.min(k, 14)}"><i></i><i></i><i></i></p>`
    : `<p class="lline fut" data-li="${it.li}" data-k="${k}" style="--i:${Math.min(k, 14)}"><span>${esc(it.x)}</span></p>`).join("")}<div class="lyrPad end"></div></div>`;
  lyr2.y = p.scrollTop; lyr2.v = 0; lyr2.target = null;
  lyrKick(true);
};
lyrTick = function (force) { lyrKick(force); };
function lyrActive(tm) { const it = lyr2.items; let k = -1; for (let j = 0; j < it.length; j++) { if (it[j].t <= tm) k = j; else break; } return k; }
function lyrKick(force) {
  if (!lyrOpenNow || !lyr2.items) return;
  if (force) lyr2.cur = -2;
  if (!lyr2.raf) { lyr2.lastT = performance.now(); lyr2.raf = requestAnimationFrame(lyrFrame); }
}
function lyrFrame(now) {
  lyr2.raf = 0;
  const p = $("#lyrPanel");
  if (!p || !lyrOpenNow || !lyr2.items || lyr2.id !== lyrFor || !np.classList.contains("open") || document.hidden) return;
  const dt = Math.min(0.05, (now - lyr2.lastT) / 1000); lyr2.lastT = now;
  const rm = reduceMotion();
  const tm = (P.time() || 0) + 0.15, k = lyrActive(tm), it = lyr2.items;
  if (k !== lyr2.cur) {
    const els = p.querySelectorAll(".lyrBody > p");
    lyr2.cur = k; lyr2.curEl = k >= 0 ? els[k] : null;
    for (let j = 0; j < els.length; j++) { const d = j - k, e = els[j]; e.className = (it[j].dots ? "ldots " : "lline ") + (d === 0 ? "cur" : d < 0 ? "past" : "fut") + (Math.abs(d) === 1 ? " d1" : Math.abs(d) === 2 ? " d2" : Math.abs(d) >= 3 ? " d3" : ""); if (d !== 0) e.style.removeProperty("--p"); }
    if (lyr2.curEl) lyr2.target = Math.max(0, lyr2.curEl.offsetTop - p.clientHeight * 0.3);
    else lyr2.target = 0;
    if (rm && Date.now() - lyrUserScroll > 3500) { p.scrollTop = lyr2.target; lyr2.y = lyr2.target; }
  }
  // fill progress of the active line / dots
  if (k >= 0 && lyr2.curEl) {
    const a = it[k]; let pr;
    if (a.w) { const tot = Math.max(1, a.x.length); let c = 0; for (let j = 0; j < a.w.length; j++) { const w = a.w[j], nx = a.w[j + 1], we = nx ? nx.t : a.end; if (tm >= w.t) c = w.c + w.n * Math.min(1, (tm - w.t) / Math.max(0.15, we - w.t)); } pr = c / tot; }
    else pr = (tm - a.t) / Math.max(0.3, a.end - a.t);
    pr = Math.max(0, Math.min(1, pr));
    lyr2.curEl.style.setProperty("--p", pr.toFixed(3));
    if (a.dots) lyr2.curEl.classList.toggle("bye", a.end - tm < 0.7);
  }
  // spring scroll (critically damped) unless the user is scrolling by hand
  if (!rm && lyr2.target != null && Date.now() - lyrUserScroll > 3500) {
    if (Math.abs(p.scrollTop - lyr2.y) > 2) { lyr2.y = p.scrollTop; lyr2.v = 0; } // something else moved it
    const w = 9, x = lyr2.y - lyr2.target; const acc = -w * w * x - 2 * w * lyr2.v; lyr2.v += acc * dt; lyr2.y += lyr2.v * dt;
    if (Math.abs(lyr2.y - lyr2.target) < 0.5 && Math.abs(lyr2.v) < 5) { lyr2.y = lyr2.target; lyr2.v = 0; }
    p.scrollTop = lyr2.y;
  } else lyr2.y = p.scrollTop;
  lyr2.raf = requestAnimationFrame(lyrFrame);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) lyrKick(true); });
new MutationObserver(() => { if (np.classList.contains("open")) lyrKick(true); }).observe(np, { attributes: true, attributeFilter: ["class"] });
// long-press a lyric line -> share card with that line
(() => {
  const aw = $("#npArtWrap"); if (!aw) return; let lp = null;
  const clear = () => { if (lp) { clearTimeout(lp.t); lp = null; } };
  aw.addEventListener("touchstart", e => { const l = e.target.closest && e.target.closest("#lyrPanel p.lline"); if (!l) return; const p = e.touches[0]; clear(); lp = { x: p.clientX, y: p.clientY, t: setTimeout(() => { lp = null; const txt = l.textContent.trim(); if (txt && queue[qi]) { lyrLongPressed = Date.now(); shareCard(queue[qi], txt); } }, 550) }; }, { passive: true, capture: true });
  aw.addEventListener("touchmove", e => { if (!lp) return; const p = e.touches[0]; if (Math.abs(p.clientX - lp.x) + Math.abs(p.clientY - lp.y) > 10) clear(); }, { passive: true, capture: true });
  aw.addEventListener("touchend", clear, { passive: true, capture: true });
  aw.addEventListener("contextmenu", e => { const l = e.target.closest && e.target.closest("#lyrPanel p.lline"); if (l) e.preventDefault(); });
  aw.addEventListener("click", e => { if (Date.now() - lyrLongPressed < 900) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
})();
var lyrLongPressed = 0;

// ---------- 3) AutoMix 2: DJ-style transitions ----------
// Per song (from the cheap 48 kbps copy, decoded at 8 kHz): where the sound really starts / ends, how long the fade-out tail is,
// and the beat grid (tempo by autocorrelation of an onset envelope + beat phase). The blend then starts ON a beat, the next song
// starts on its first beat (leading silence skipped), volumes cross on an equal-power curve and the outgoing song's bass is swept
// out with a high-pass filter (bass swap) when the browser lets us route it (CORS-clean JioSaavn audio, Web Audio running).
// No tempo change (time-stretching both songs is not safe enough on phones). Same exclusions as before.
mixAnalyse = function (t) {
  if (!t || !mixOn()) return null;
  if (mixInfo.has(t.id)) return mixInfo.get(t.id);
  const box = { v: undefined }; mixInfo.set(t.id, box);
  if (mixInfo.size > 40) mixInfo.delete(mixInfo.keys().next().value);
  const src = mixAnaSrc(t); if (!src) { box.v = null; return box; }
  (async () => {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC) return null;
    const r = await fetch(src); if (!r.ok) return null; const ab = await r.arrayBuffer();
    const ctx = new OAC(1, 1, 8000);
    const buf = await new Promise((res, rej) => { const p = ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
    return mixAnaBuf(buf);
  })().then(v => { box.v = v || null; }, () => { box.v = null; });
  return box;
};
function mixAnaBuf(buf) {
  const sr = buf.sampleRate, L0 = buf.length, nc = buf.numberOfChannels;
  const x = new Float32Array(L0); for (let c = 0; c < nc; c++) { const ch = buf.getChannelData(c); for (let i = 0; i < L0; i++) x[i] += ch[i] / nc; }
  // loudness every 50 ms
  const w = Math.max(1, Math.round(sr * 0.05)), n = Math.floor(L0 / w); if (n < 300) return null;
  const db = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let k = i * w, e = k + w; k < e; k++) s += x[k] * x[k]; db[i] = 10 * Math.log10(s / w + 1e-12); }
  const ref = Array.from(db).sort((a, b) => a - b)[Math.floor(n * 0.7)], sil = Math.max(ref - 30, -65);
  let h = 0; while (h < n && db[h] < sil) h++;
  let e = n - 1; while (e > h && db[e] < sil) e--;
  const avg = i => { let s = 0, c = 0; for (let k = Math.max(0, i - 19); k <= i; k++) { s += db[k]; c++; } return s / c; };
  let o = e; while (o > h && e - o < 300 && avg(o) < ref - 8) o--;
  // onset envelope (16 ms hop, first difference = transient emphasis)
  const hop = 128, m = Math.floor(L0 / hop), env = new Float32Array(m), fl = new Float32Array(m);
  for (let k = 1; k < m; k++) { let s = 0; for (let i = k * hop, z = i + hop; i < z; i++) { const d = x[i] - x[i - 1]; s += d * d; } env[k] = Math.log(1e-9 + s); }
  for (let k = 2; k < m; k++) { const d = env[k] - env[k - 1]; fl[k] = d > 0 ? d : 0; }
  const fps = sr / hop, a0 = Math.floor(m * 0.12), a1 = Math.floor(m * 0.88);
  let bpm = 0, per = 0, phase = 0, conf = 0;
  if (a1 - a0 > fps * 30) {
    const lo = Math.floor(fps * 60 / 180), hi = Math.ceil(fps * 60 / 70), ac = new Float32Array(hi + 2);
    let mean = 0; for (let k = a0; k < a1; k++) mean += fl[k]; mean /= (a1 - a0);
    for (let lag = lo; lag <= hi + 1; lag++) { let s = 0; for (let k = a0; k < a1 - lag; k++) s += (fl[k] - mean) * (fl[k + lag] - mean); ac[lag] = s / (a1 - a0 - lag); }
    let best = -1, bl = 0; for (let lag = lo; lag <= hi; lag++) { const b = 60 * fps / lag, wgt = Math.exp(-0.5 * Math.pow(Math.log2(b / 118) / 0.9, 2)); const v = ac[lag] * wgt; if (v > best) { best = v; bl = lag; } }
    let sum = 0, cnt = 0; for (let lag = lo; lag <= hi; lag++) { sum += Math.max(0, ac[lag]); cnt++; }
    conf = sum > 0 ? Math.max(0, ac[bl]) / (sum / cnt) : 0;
    const y0 = ac[bl - 1] || 0, y1 = ac[bl], y2 = ac[bl + 1] || 0, den = y0 - 2 * y1 + y2; const off = den ? Math.max(-0.5, Math.min(0.5, 0.5 * (y0 - y2) / den)) : 0;
    per = bl + off; bpm = 60 * fps / per;
    let bp = 0, bs = -1; const steps = Math.max(8, Math.round(per));
    for (let s = 0; s < steps; s++) { const ph = s * per / steps; let v = 0; for (let k = a0 + ph; k < a1; k += per) v += fl[Math.round(k)]; if (v > bs) { bs = v; bp = ph; } }
    phase = (bp % per) / fps; per = per / fps;
    if (conf < 1.6) { bpm = 0; per = 0; }
  }
  // first clear onset after the leading silence (where the next song should come in)
  let first = h * 0.05;
  if (per) { const k0 = Math.floor(h * 0.05 * fps), k1 = Math.min(m, k0 + Math.floor(fps * 3)); let mx = 0; for (let k = k0; k < k1; k++) mx = Math.max(mx, fl[k]); for (let k = k0; k < k1; k++) if (fl[k] > mx * 0.5) { first = k / fps; break; } }
  return { head: Math.min(h * 0.05, 8), first: Math.min(first, 9), end: (e + 1) * 0.05, outro: (e - o) * 0.05, dur: buf.duration, bpm: Math.round(bpm * 10) / 10, per, phase, conf: Math.round(conf * 100) / 100 };
}
function mixPlan(info, d) { // when to start blending and for how long
  const end = info ? Math.min(d, info.end) : d;
  let L;
  if (info && info.outro >= 5) L = Math.max(4, Math.min(12, info.outro * 0.8 + 1)); // song fades out by itself: blend over the fade
  else if (info && info.per) { L = info.per * 16; while (L > 10) L /= 2; if (L < 4) L *= 2; } // hard ending: 4 bars (or 2/8)
  else L = info ? Math.min(10, Math.max(3, info.outro + 2)) : 5;
  let at = end - L;
  if (info && info.per) { const b = Math.round((at - info.phase) / info.per); const snapped = info.phase + b * info.per; if (Math.abs(snapped - at) < info.per) at = snapped; L = end - at; }
  return { at: Math.max(0, at), L: Math.max(2, Math.min(13, L)), end };
}
let mixSched = null;
const mixAbortV22 = mixAbort;
mixAbort = function () { if (mixSched) { clearTimeout(mixSched.t); mixSched = null; } return mixAbortV22.apply(this, arguments); };
mixMaybe = function () {
  if (mixFade || mixBusy || mixSched || !mixOn() || mode !== "audio" || eqRouted || document.hidden || userPaused || audio.paused || (typeof jamOn === "function" && jamOn())) return;
  const t = queue[qi], d = audio.duration; if (!t || !isFinite(d) || d < 40) return;
  const ti = mixAnalyse(t), info = ti && ti.v;
  const j = mixNextIndex(); if (j < 0) return;
  const n = queue[j], url = mixSrcOf(n); if (!url) { if (!mixPrepped.has(n.id)) { mixPrepped.add(n.id); prepNext(); } return; }
  const plan = mixPlan(info, d), rate = audio.playbackRate || 1;
  const left = (plan.at - audio.currentTime) / rate;
  if (plan.end - audio.currentTime > plan.L + 40 || plan.end - audio.currentTime < 1) return;
  const ni = mixAnalyse(n);
  if (!mixPre || mixPre.dataset.id !== n.id || mixPre.dataset.url !== url) {
    mixDrop(mixPre); mixPre = document.createElement("audio"); mixPre.setAttribute("playsinline", ""); mixPre.preload = "auto"; mixPre.dataset.id = n.id; mixPre.dataset.url = url; mixPre.volume = 0;
    if (/^https:\/\/[^/]*saavncdn\.com\//.test(url)) mixPre.crossOrigin = "anonymous"; // so its own ending can be bass-swapped later
    mixPre.src = url; try { mixPre.load(); } catch (e) {}
  }
  if (left > 1.3) return;
  const tok = loadToken, go = () => {
    mixSched = null;
    if (tok !== loadToken || mixFade || mixBusy || audio.paused || userPaused || document.hidden || queue[j] !== n) return;
    const nv = ni && ni.v, head = nv ? (nv.per ? Math.max(0, nv.first - 0.03) : nv.head) : 0;
    const L = Math.max(1, Math.min(plan.L, (plan.end - audio.currentTime)));
    mixStart(j, n, url, L, head);
  };
  if (left <= 0.03) go(); else mixSched = { t: setTimeout(go, left * 1000) };
};
// bass swap on the outgoing song
let mixCtxA = null;
function mixCtx() {
  if (mixCtxA) return mixCtxA;
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
  try { mixCtxA = new AC({ latencyHint: "playback" }); } catch (e) { try { mixCtxA = new AC(); } catch (e2) { return null; } }
  return mixCtxA;
}
document.addEventListener("pointerdown", () => { if (!mixOn() || eqOn) return; const c = mixCtx(); if (c && c.state !== "running") c.resume().catch(() => {}); }, true);
function mixFx(old, L) {
  try {
    if (!old || old.crossOrigin !== "anonymous" || !/saavncdn\.com/.test(old.currentSrc || old.src || "")) return false;
    const c = mixCtx(); if (!c || c.state !== "running") return false;
    const s = c.createMediaElementSource(old), hp = c.createBiquadFilter(), g = c.createGain();
    hp.type = "highpass"; hp.Q.value = 0.71; s.connect(hp); hp.connect(g); g.connect(c.destination);
    const t0 = c.currentTime;
    hp.frequency.setValueAtTime(25, t0); hp.frequency.setValueAtTime(25, t0 + L * 0.3);
    hp.frequency.exponentialRampToValueAtTime(320, t0 + L * 0.55); hp.frequency.exponentialRampToValueAtTime(1200, t0 + L);
    old._fx = { s, hp, g }; return true;
  } catch (e) { return false; }
}
const mixDropV22 = mixDrop;
mixDrop = function (el) { if (el && el._fx) { try { el._fx.g.disconnect(); el._fx.hp.disconnect(); el._fx.s.disconnect(); } catch (e) {} el._fx = null; } return mixDropV22(el); };
const mixCommitV22 = mixCommit;
mixCommit = function (j, t, url, el, L) {
  const old = audio;
  mixCommitV22.apply(this, arguments);
  window.__mix2 = { at: Date.now(), L, fx: mixFx(old, L), bpm: (mixInfo.get(t.id) || {}).v ? mixInfo.get(t.id).v.bpm : 0 };
};
// main <audio>: load JioSaavn files CORS-clean while AutoMix can run (so their ending can be bass-swapped); never for other sources
const loadCurrentV22 = loadCurrent;
loadCurrent = function () { try { if (!eqRouted) audio.removeAttribute("crossorigin"); } catch (e) {} return loadCurrentV22.apply(this, arguments); };
const playUrlV22 = playUrl;
playUrl = function (t, url, my, autoplay, startAt, attempt) {
  try { if (!eqRouted) { if (mixOn() && !attempt && /^https:\/\/[^/]*saavncdn\.com\//.test(url || "")) audio.crossOrigin = "anonymous"; else audio.removeAttribute("crossorigin"); } } catch (e) {}
  return playUrlV22.apply(this, arguments);
};

// ---------- 4) Song info (JioSaavn details: singers, music, lyricist, album, label, year, language, plays) ----------
const siCache = new Map();
function fmtPlays(n) { n = +n || 0; if (!n) return ""; if (n >= 1e7) return (n / 1e7).toFixed(n >= 1e8 ? 0 : 1).replace(/\.0$/, "") + " Cr"; if (n >= 1e5) return (n / 1e5).toFixed(1).replace(/\.0$/, "") + " L"; if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K"; return String(n); }
const LANG_NAME = { hindi: ["Hindi", "हिन्दी"], punjabi: ["Punjabi", "पंजाबी"], english: ["English", "अंग्रेज़ी"], bhojpuri: ["Bhojpuri", "भोजपुरी"], haryanvi: ["Haryanvi", "हरियाणवी"], tamil: ["Tamil", "तमिल"], telugu: ["Telugu", "तेलुगु"], marathi: ["Marathi", "मराठी"], gujarati: ["Gujarati", "गुजराती"], bengali: ["Bengali", "बंगाली"], kannada: ["Kannada", "कन्नड़"], malayalam: ["Malayalam", "मलयालम"], rajasthani: ["Rajasthani", "राजस्थानी"], urdu: ["Urdu", "उर्दू"] };
function songInfo(t) {
  if (!t) return;
  const sid = t.src === "saavn" ? t.id : (typeof resolved !== "undefined" && resolved[t.id] && resolved[t.id].sid) || t.sid || "";
  const head = `<div class="shead"><img src="${esc(small(t.thumb) || ytThumb(t.id))}"><div><div class="t1">${esc(t.title)}</div><div class="sub">${esc(t.artist || "")}</div></div></div>`;
  const paint = d => {
    const ppl = (l, role) => l && l.length ? `<div class="siRow"><span class="siK">${esc(tr(role))}</span><span class="siVal">${l.map(a => a.id ? `<a data-s="ar" data-id="${esc(a.id)}" data-n="${esc(a.name)}">${esc(a.name)}</a>` : esc(a.name)).join(", ")}</span></div>` : "";
    const row = (k, v, act) => v ? `<div class="siRow"><span class="siK">${esc(tr(k))}</span><span class="siVal">${act ? `<a data-s="${act}">${esc(v)}</a>` : esc(v)}</span></div>` : "";
    const ln = d.language ? (LANG_NAME[String(d.language).toLowerCase()] || [d.language, d.language])[appLang === "hi" ? 1 : 0] : "";
    let rel = d.release_date || d.year || "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(rel)) { try { rel = new Date(rel + "T00:00:00").toLocaleDateString(appLang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch (e) {} }
    return `<div class="sgroup siBox">${head}${d.loading ? `<div class="siNote"><div class="spin"></div>${esc(tr("Info la raha hoon…"))}</div>` : d.error ? `<div class="siNote">${esc(tr("Info nahi mili 😕"))}</div>` :
      ppl(d.singers, "Singers") + ppl(d.music, "Music") + ppl(d.lyricists, "Lyricist") + ppl(d.starring, "Starring") +
      row("Album", d.album, d.albumId ? "al" : "") + row("Release", String(rel || "")) + row("Label", d.label) + row("Language", ln) +
      row("Duration", d.duration ? fmt(+d.duration) : "") + row("Plays", fmtPlays(d.play_count))}</div>`;
  };
  const handlers = { ar: b => { closeNP(); collOpen("ar:" + b.dataset.id); }, al: () => { const d = siCache.get(sid) || {}; if (d.albumId) { closeNP(); collOpen("al:" + d.albumId); } } };
  if (!sid) { // YouTube / unknown source: what we know locally
    showSheet(`<div class="sgroup siBox">${head}<div class="siRow"><span class="siK">${esc(tr("Album"))}</span><span class="siVal">${esc(t.album || "—")}</span></div>${t.dur ? `<div class="siRow"><span class="siK">${esc(tr("Duration"))}</span><span class="siVal">${fmt(t.dur)}</span></div>` : ""}<div class="siRow"><span class="siK">Source</span><span class="siVal">${isYT(t) ? "YouTube" : "—"}</span></div></div>`, {});
    return;
  }
  const c = siCache.get(sid);
  showSheet(paint(c || { loading: 1 }), handlers);
  if (c && !c.error) return;
  api("/api/songinfo?id=" + encodeURIComponent(sid)).then(d => { siCache.set(sid, d && !d.error ? d : { error: 1 }); }).catch(() => siCache.set(sid, { error: 1 }))
    .then(() => { if (!sheet.classList.contains("hidden") && sheet.querySelector(".siBox")) { sheet.innerHTML = paint(siCache.get(sid)) + `<div class="sgroup cancel"><button data-s="cancel">Cancel</button></div>`; } });
}

// ---------- 5) Follow artists ⭐ + "New from artists you follow" + Telegram bot alert (server) ----------
let follows = store.get("follows", []); // [{id,name,image,at}]
const isFollow = id => follows.some(a => a.id === String(id));
function followSync() {
  if (!tgCode || !tgMe.linked) return;
  post("/api/u/follow", { c: tgCode, op: "put", list: follows.map(a => ({ id: a.id, name: a.name })) }).catch(() => {});
}
function followPull() {
  if (!tgCode || !tgMe.linked) return;
  post("/api/u/follow", { c: tgCode, op: "get" }).then(d => {
    if (!d || !Array.isArray(d.list)) return;
    let ch = false; for (const a of d.list) if (a && a.id && !isFollow(a.id)) { follows.push({ id: String(a.id), name: a.name || "", image: "", at: Date.now() }); ch = true; }
    if (ch) { store.set("follows", follows); if (curTab === "library" && subView === "following") rerender(); }
    if (follows.length && (!d.list.length || ch)) followSync();
  }).catch(() => {});
}
function followToggle(a) {
  if (!a || !a.id) return;
  const id = String(a.id);
  if (isFollow(id)) { follows = follows.filter(x => x.id !== id); toast(tr(`${a.name} ko unfollow kiya`)); }
  else { follows.unshift({ id, name: a.name || "", image: a.image || "", at: Date.now() }); toast(tr(`⭐ ${a.name} ko follow kiya`)); if (!tgMe.linked && !store.get("folHint", 0)) { store.set("folHint", 1); setTimeout(() => toast(tr("Telegram se sign in karo to naye gaane ka message bot pe bhi aayega"), 4200), 2400); } }
  store.set("follows", follows); followSync(); relLast = 0; store.set("relCache", null);
}
function followBtnHTML(c, key) {
  const k = key.slice(0, key.indexOf(":")); if (k !== "ar" && k !== "arn") return "";
  const id = String((c && c.id) || (k === "ar" ? key.slice(3) : "")); if (!id) return "";
  return `<button data-act="follow" data-id="${esc(id)}" class="folBtn${isFollow(id) ? " on" : ""}">${isFollow(id) ? "✓ Following" : "⭐ Follow"}</button>`;
}
const renderCollV22 = renderColl;
renderColl = function (key) {
  const r = renderCollV22.apply(this, arguments);
  const c = colls[key]; const row = view.querySelector(".arBtns");
  if (row && c && !c.loading && !c.error && !row.querySelector("[data-act=follow]")) { const h = followBtnHTML(c, key); if (h) row.insertAdjacentHTML("beforeend", h); }
  return r;
};
view.addEventListener("click", e => {
  const b = e.target.closest("[data-act=follow]");
  if (b) { e.preventDefault(); e.stopPropagation(); const key = String(subView || "").slice(2), c = colls[key] || {}; followToggle({ id: b.dataset.id, name: c.name || collTitle(key, c), image: c.image || "" }); const on = isFollow(b.dataset.id); b.classList.toggle("on", on); b.textContent = tr(on ? "✓ Following" : "⭐ Follow"); return; }
  const u = e.target.closest("[data-act=unfollow]");
  if (u) { e.preventDefault(); e.stopPropagation(); const a = follows.find(x => x.id === u.dataset.id); if (a) followToggle(a); rerender(); return; }
  const fa = e.target.closest("[data-fol]");
  if (fa) { e.preventDefault(); e.stopPropagation(); collOpen("ar:" + fa.dataset.fol); return; }
  const rl = e.target.closest("[data-rel]");
  if (rl) { e.preventDefault(); e.stopPropagation(); collOpen("al:" + rl.dataset.rel); return; }
}, true);
function renderFollowing() {
  view.innerHTML = `<button class="back" data-act="back">${ICON.chev}Library</button><h1>⭐ Following</h1>
    ${follows.length ? `<div class="setNote folNote">${tgMe.linked ? "Naya gaana aate hi Telegram bot pe message aayega 🔔" : "Telegram se sign in karo to naye gaane ka message bot pe bhi aayega"}</div><div class="folList">${follows.map(a => `<div class="folRow" data-fol="${esc(a.id)}"><span class="arPic">${a.image ? `<img src="${esc(a.image)}" onerror="this.remove()">` : ""}${typeof PERSON_ICON === "string" ? PERSON_ICON : ""}</span><b>${esc(a.name)}</b><button class="folX" data-act="unfollow" data-id="${esc(a.id)}">Unfollow</button></div>`).join("")}</div>`
      : `<div class="empty">Abhi kisi artist ko follow nahi kiya. Artist page pe ⭐ Follow dabao — unka naya gaana aate hi bataenge.</div>`}`;
  relHomeRow(view, true); relLoad();
}
const renderLibraryV22 = renderLibrary;
renderLibrary = function () {
  if (subView === "following") return renderFollowing();
  const r = renderLibraryV22.apply(this, arguments);
  if (!subView && !view.querySelector("[data-open=following]")) {
    const links = view.querySelector(".libLinks"); const rec = links && links.querySelector("[data-open=recent]");
    const h = `<button data-open="following" class="folLib"><i class="folI">⭐</i><span>Following <small class="sub">${follows.length ? tr(`${follows.length} artist${follows.length === 1 ? "" : "s"}`) : "Artists"}</small></span></button>`;
    if (rec) rec.insertAdjacentHTML("afterend", h); else if (links) links.insertAdjacentHTML("beforeend", h);
  }
  return r;
};
// new releases of followed artists (server keeps per-artist state + sends the bot alerts; this call also triggers that check)
let relData = store.get("relCache", null), relLast = relData ? relData.at || 0 : 0, relBusy = false;
function relLoad(force) {
  if (!follows.length || relBusy || !navigator.onLine) return;
  if (!force && Date.now() - relLast < 30 * 60e3) return;
  relBusy = true; relLast = Date.now();
  post("/api/follow/new", { ids: follows.slice(0, 60).map(a => a.id) }).then(d => {
    if (d && Array.isArray(d.items)) { relData = { at: Date.now(), items: d.items.slice(0, 20) }; store.set("relCache", relData); if (curTab === "home" && !subView) relHomeRow(view); if (curTab === "library" && subView === "following") relHomeRow(view, true); }
    if (d && Array.isArray(d.artists)) { let ch = false; for (const a of d.artists) { const f = follows.find(x => x.id === String(a.id)); if (f && a.image && f.image !== a.image) { f.image = a.image; ch = true; } } if (ch) store.set("follows", follows); }
  }).catch(() => {}).finally(() => { relBusy = false; });
}
function relHomeRow(root, inFollowing) {
  if (!root) return; const old = root.querySelector(".relRow"); if (old) { old.previousElementSibling && old.previousElementSibling.classList.contains("relH") && old.previousElementSibling.remove(); old.remove(); }
  const items = relData && relData.items ? relData.items.filter(x => follows.some(a => a.id === String(x.aid))) : [];
  if (!follows.length || !items.length) return;
  const h = `<h2 class="relH">⭐ Naye gaane — aapke artists</h2><div class="car relRow">${items.slice(0, 15).map(x => `<button class="tile" data-rel="${esc(x.id)}"><img loading="lazy" src="${esc(x.image || "/icon-192.png")}" onerror="this.onerror=null;this.src='/icon-192.png'">${x.isNew ? `<i class="relNew">${esc(tr("Naya gaana"))}</i>` : ""}<div class="t1">${esc(x.title)}</div><div class="t2">${esc(x.aname || x.artist || "")}${x.year ? " · " + esc(x.year) : ""}</div></button>`).join("")}</div>`;
  const tmp = document.createElement("div"); tmp.innerHTML = h;
  if (inFollowing) { root.append(...tmp.childNodes); return; }
  const anchor = root.querySelector("[data-greet]") || root.querySelector("h1.hrow");
  const after = root.querySelector(".fyHome, .fy, h2"); // place after the greeting, before the first shelf
  if (after && after.parentNode === root) root.insertBefore(tmp.firstChild, after), root.insertBefore(tmp.firstChild, after);
  else if (anchor) anchor.after(...tmp.childNodes);
}
const renderHomeV22b = renderHome;
renderHome = function () { const r = renderHomeV22b.apply(this, arguments); try { relHomeRow(view); relLoad(); } catch (e) {} return r; };
setTimeout(() => { followPull(); relLoad(); }, 4000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) relLoad(); });

// deep links from the bot / share card: ?song=<JioSaavn id> plays it, ?al=<album id> opens the album
(() => {
  let sp; try { sp = new URLSearchParams(location.search); } catch (e) { return; }
  const sid = (sp.get("song") || "").replace(/[^\w-]/g, "").slice(0, 40), al = (sp.get("al") || "").replace(/\D/g, "").slice(0, 15);
  if (!sid && !al) return;
  try { history.replaceState(null, "", location.pathname); } catch (e) {}
  if (al) setTimeout(() => collOpen("al:" + al), 300);
  if (sid) api("/api/song?id=" + encodeURIComponent(sid)).then(d => { if (d && d.track) { playList([d.track], 0); setTimeout(openNP, 400); } }).catch(() => {});
})();

// ---------- 6) Share card 📸 (1080×1920 story image) ----------
function scLoadImg(src) { return new Promise(res => { if (!src) return res(null); const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }); }
function scWrap(ctx, text, maxW, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean), lines = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; } }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { const l = lines.slice(0, maxLines); let s = l[maxLines - 1]; while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1); l[maxLines - 1] = s + "…"; return l; }
  return lines.map(s => { let x = s; if (ctx.measureText(x).width <= maxW) return x; while (x.length > 1 && ctx.measureText(x + "…").width > maxW) x = x.slice(0, -1); return x + "…"; });
}
function scRound(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
async function shareCardDraw(t, line) {
  const W = 1080, H = 1920, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
  const big = String(t.thumb || "").replace(/(150x150|50x50)/, "500x500") || ytThumb(t.id);
  try { await Promise.all([document.fonts.load('700 64px "DhunComic"'), document.fonts.load('400 40px "DhunComic"')]); } catch (e) {}
  const [art, mark] = await Promise.all([scLoadImg(big), scLoadImg(V23_NATIVE ? "/dhun-mark.png" : "/dhun-mark.webp?v=16")]);
  ctx.fillStyle = "#0b0710"; ctx.fillRect(0, 0, W, H);
  if (art) { // blurred background: draw tiny, scale up (works everywhere, no canvas filter needed)
    const s = document.createElement("canvas"); s.width = 18; s.height = 32; const sx = s.getContext("2d"); sx.drawImage(art, art.width * 0.2, 0, art.width * 0.6, art.height, 0, 0, 18, 32);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.globalAlpha = 0.95; ctx.drawImage(s, -40, -40, W + 80, H + 80); ctx.globalAlpha = 1;
  }
  let g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(10,6,16,.25)"); g.addColorStop(0.55, "rgba(10,6,16,.45)"); g.addColorStop(1, "rgba(8,5,12,.92)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const A = 760, ax = (W - A) / 2, ay = line ? 230 : 330;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 70; ctx.shadowOffsetY = 30; scRound(ctx, ax, ay, A, A, 44); ctx.fillStyle = "#222"; ctx.fill(); ctx.restore();
  ctx.save(); scRound(ctx, ax, ay, A, A, 44); ctx.clip(); if (art) ctx.drawImage(art, ax, ay, A, A); else { ctx.fillStyle = "#2a2030"; ctx.fillRect(ax, ay, A, A); } ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 2; scRound(ctx, ax + 1, ay + 1, A - 2, A - 2, 43); ctx.stroke();
  let y = ay + A + 110; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
  ctx.font = '700 66px "DhunComic", "Comic Neue", system-ui, sans-serif';
  for (const l of scWrap(ctx, t.title, W - 160, 2)) { ctx.fillText(l, W / 2, y); y += 78; }
  ctx.font = '400 42px "DhunComic", "Comic Neue", system-ui, sans-serif'; ctx.fillStyle = "rgba(255,255,255,.72)";
  for (const l of scWrap(ctx, t.artist || "", W - 200, 1)) { ctx.fillText(l, W / 2, y + 4); y += 56; }
  if (line) { // lyric line on a glass card
    ctx.font = 'italic 700 52px "DhunComic", "Comic Neue", system-ui, sans-serif';
    const ls = scWrap(ctx, "“" + line + "”", W - 260, 4), ch = ls.length * 66 + 70, cy = y + 30;
    ctx.save(); scRound(ctx, 90, cy, W - 180, ch, 40); ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    const gl = ctx.createLinearGradient(90, cy, 90, cy + 40); gl.addColorStop(0, "rgba(255,255,255,.18)"); gl.addColorStop(1, "rgba(255,255,255,0)"); ctx.save(); scRound(ctx, 90, cy, W - 180, ch, 40); ctx.clip(); ctx.fillStyle = gl; ctx.fillRect(90, cy, W - 180, 40); ctx.restore();
    ctx.fillStyle = "#fff"; let ly = cy + 76; for (const l of ls) { ctx.fillText(l, W / 2, ly); ly += 66; }
  }
  // footer: logo + Dhun + Mavi💖 + link
  const fy = H - 170;
  if (mark) { const mh = 86, mw = mark.width * mh / mark.height; ctx.drawImage(mark, W / 2 - mw - 70, fy - mh + 18, mw, mh); }
  ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = '700 58px "DhunComic", "Comic Neue", system-ui, sans-serif'; ctx.fillText("Dhun", W / 2 - 50, fy);
  ctx.font = '400 30px "DhunComic", "Comic Neue", system-ui, sans-serif'; ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillText("Mavi💖", W / 2 + 100, fy - 4);
  ctx.textAlign = "center"; ctx.font = '700 36px "DhunComic", "Comic Neue", system-ui, sans-serif'; ctx.fillStyle = "#fa2d48"; ctx.fillText("dhun.sites.tab.bot", W / 2, fy + 78);
  return cv;
}
async function shareCard(t, line) {
  if (!t) return;
  toast(tr("Card bana raha hoon…"));
  let cv; try { cv = await shareCardDraw(t, line); } catch (e) { toast(tr("Card nahi ban paya 😕")); return; }
  const url = cv.toDataURL("image/png");
  const link = t.src === "saavn" ? `https://dhun.sites.tab.bot/?song=${encodeURIComponent(t.id)}` : "https://dhun.sites.tab.bot/";
  showSheet(`<div class="sgroup scBox"><img class="scPrev" src="${url}" alt=""><div class="scBtns"><button data-s="share" class="scGo">${esc(tr("Share karo"))} ${ICON.share}</button><button data-s="save">${esc(tr("Save karo"))} ${ICON.dl || ""}</button></div>${line ? `<button data-s="noline">${esc(tr("Line hatao"))}</button>` : ""}</div>`, {
    share: () => { scShare(cv, t, link); },
    save: () => { scSave(cv, t); },
    noline: () => { setTimeout(() => shareCard(t, ""), 60); },
  });
  window.__v23sc = { w: cv.width, h: cv.height, line: line || "", link };
}
function scName(t) { return "dhun-" + String(t.title || "song").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) + ".png"; }
function scShare(cv, t, link) {
  if (V23_NATIVE && window.DhunNative && window.DhunNative.shareImage) { window.DhunNative.shareImage(cv, `${t.title} — ${t.artist} 🎶\n${link}`).catch(() => toast(tr("Card nahi ban paya 😕"))); return; }
  cv.toBlob(b => {
    if (!b) return toast(tr("Card nahi ban paya 😕"));
    const f = new File([b], scName(t), { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: t.title, text: `${t.title} — ${t.artist} 🎶 ${link}` }).catch(() => {});
    else scSave(cv, t);
  }, "image/png");
}
function scSave(cv, t) {
  if (V23_NATIVE && window.DhunNative && window.DhunNative.shareImage) { window.DhunNative.shareImage(cv, "").catch(() => {}); return; } // Android: the share sheet has "Save to gallery / Files"
  cv.toBlob(b => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = scName(t); document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast(tr("Card save ho gaya 📸")); }, "image/png");
}

// ---------- 7) Playback speed ⏩ + Bass Boost 🔊 ----------
let pbRate = +store.get("rate", 1) || 1;
const RATES = [0.75, 0.9, 1, 1.1, 1.25, 1.5];
const rateLabel = r => (Math.round(r * 100) / 100).toString().replace(/^0\./, ".") + "×";
function rateWant() { if (typeof jamOn === "function" && jamOn()) return null; if (window.__pod && queue[qi] && queue[qi].src === "pod") return null; return pbRate; }
function rateApply() {
  const r = rateWant(); if (r == null) return;
  for (const el of [audio, mixPre]) { if (!el) continue; try { el.preservesPitch = true; el.mozPreservesPitch = true; el.webkitPreservesPitch = true; if (Math.abs(el.playbackRate - r) > 0.001) el.playbackRate = r; el.defaultPlaybackRate = r; } catch (e) {} }
}
const rateWired = new WeakSet();
setInterval(() => { if (!rateWired.has(audio)) { rateWired.add(audio); ["loadedmetadata", "playing", "ratechange"].forEach(ev => audio.addEventListener(ev, () => setTimeout(rateApply, 0))); } rateApply(); }, 1000);
function setRate(r) { pbRate = r; store.set("rate", r); rateApply(); toast(tr(`Speed ${rateLabel(r)} ⏩`)); }
function speedSheet() {
  const jam = typeof jamOn === "function" && jamOn();
  showSheet(`<div class="sgroup"><div class="shead"><div><div class="t1">⏩ ${esc(tr("Playback speed"))}</div><div class="sub">${esc(tr(jam ? "Listen Together me speed 1× rehti hai" : "Awaaz ki pitch same rahegi"))}</div></div></div><div class="pchips rateChips">${RATES.map(r => `<button class="pchip${Math.abs(r - pbRate) < 0.001 ? " on" : ""}" data-s="r" data-r="${r}">${rateLabel(r)}</button>`).join("")}</div></div>`, { r: b => { setRate(+b.dataset.r); } });
}
function bassOn() { return eqOn && eqPreset === "Bass Boost"; }
function bassToggle() {
  if (bassOn()) { setEq(false); toast(tr("Bass Boost off")); }
  else { setPreset("Bass Boost"); setEq(true); toast(tr(cfg.automix !== false && mixVolOK ? "Bass Boost on — AutoMix tab tak band rahega (EQ ke saath mix nahi hota)" : "Bass Boost on 🔊"), 3600); }
  if (curTab === "library" && subView === "settings") rerender();
}

// ---------- song menu additions (ℹ️ info, 📸 share card, ⏩ speed, 🔊 bass) ----------
const openTrackSheetV22 = openTrackSheet;
openTrackSheet = function (t, ctx, idx) {
  const r = openTrackSheetV22.apply(this, arguments);
  if (!t) return r;
  const grp = sheet.querySelector(".sgroup"); if (!grp) return r;
  const isNp = ctx === "np" && queue[qi] && queue[qi].id === t.id, pod = t.src === "pod";
  const add = (key, html, fn, before) => { const tmp = document.createElement("div"); tmp.innerHTML = html; const b = tmp.firstChild; const ref = before && grp.querySelector(before); if (ref) grp.insertBefore(b, ref); else grp.appendChild(b); extra[key] = fn; };
  const extra = {};
  if (!pod) add("info", `<button data-s="v23info">ℹ️ Song info ${ICON.note}</button>`, () => songInfo(t), "[data-s=like]");
  add("card", `<button data-s="v23card">📸 Share card ${ICON.share}</button>`, () => { const lt = isNp && lyrOpenNow && lyr2.items && lyr2.cur >= 0 && lyr2.items[lyr2.cur] && lyr2.items[lyr2.cur].x || ""; setTimeout(() => shareCard(t, lt), 60); }, "[data-s=share]");
  if (isNp && !pod) {
    add("speed", `<button data-s="v23speed">${esc(tr("⏩ Speed: " + rateLabel(pbRate)))} <i class="sbI">⏩</i></button>`, () => setTimeout(speedSheet, 60));
    add("bass", `<button data-s="v23bass">${esc(tr("🔊 Bass Boost: " + (bassOn() ? "On" : "Off")))} <i class="sbI">🔊</i></button>`, () => bassToggle());
  }
  const oc = sheet.onclick;
  sheet.onclick = e => {
    const b = e.target.closest("[data-s]"); const k = b && b.dataset.s;
    const map = { v23info: "info", v23card: "card", v23speed: "speed", v23bass: "bass" };
    if (k && map[k] && extra[map[k]]) { closeSheet(); extra[map[k]](); return; }
    return oc && oc(e);
  };
  return r;
};

// ---------- 8) Queue edit 📋: drag to reorder, swipe left to remove, Clear queue ----------
const renderQueueV22 = renderQueue;
renderQueue = function () {
  const r = renderQueueV22.apply(this, arguments);
  const list = $("#queueList"), head = document.querySelector("#queuePanel .qHead"); if (!list) return r;
  const jam = typeof jamOn === "function" && jamOn();
  list.classList.toggle("qEdit", !jam);
  if (!jam) list.querySelectorAll(".row[data-ctx=queue]").forEach(row => { if (!row.querySelector(".qh")) row.insertAdjacentHTML("beforeend", `<i class="qh" aria-label="Drag"><svg viewBox="0 0 24 24"><path d="M4 7h16v2H4zm0 4h16v2H4zm0 4h16v2H4z"/></svg></i>`); });
  if (head && !head.querySelector(".qClear")) head.insertAdjacentHTML("beforeend", `<button class="qClear" data-qclear>${esc(tr("Clear queue"))}</button>`);
  const qc = head && head.querySelector(".qClear"); if (qc) qc.style.display = !jam && queue.length - qi > 1 ? "" : "none";
  return r;
};
(() => {
  const list = $("#queueList"), panel = $("#queuePanel"); if (!list || !panel) return;
  panel.addEventListener("click", e => { if (e.target.closest("[data-qclear]")) { e.stopPropagation(); if (typeof jamOn === "function" && jamOn()) return; const n = queue.length - qi - 1; if (n <= 0) return; queue = queue.slice(0, qi + 1); autoplayAdded.delete && queue[qi] && autoplayAdded.add(queue[qi].id); saveQ(); renderQueue(); toast(tr("Queue saaf ✅")); } });
  let g = null, sup = 0;
  const rowsOf = () => [...list.querySelectorAll(".row[data-ctx=queue]")];
  list.addEventListener("click", e => { if (Date.now() - sup < 400) { e.stopPropagation(); e.preventDefault(); } }, true);
  list.addEventListener("touchstart", e => {
    if (typeof jamOn === "function" && jamOn()) return;
    const row = e.target.closest(".row[data-ctx=queue]"); if (!row || e.touches.length > 1) return;
    const p = e.touches[0], handle = e.target.closest(".qh");
    g = { row, handle: !!handle, x: p.clientX, y: p.clientY, dx: 0, dy: 0, mode: handle ? "drag" : null, rows: rowsOf(), h: row.offsetHeight, from: rowsOf().indexOf(row), to: -1 };
    if (handle) { row.classList.add("qLift"); g.to = g.from; }
  }, { passive: true });
  list.addEventListener("touchmove", e => {
    if (!g) return; const p = e.touches[0]; g.dx = p.clientX - g.x; g.dy = p.clientY - g.y;
    if (!g.mode) { if (Math.abs(g.dx) > 14 && Math.abs(g.dx) > Math.abs(g.dy) * 1.4) g.mode = "swipe"; else if (Math.abs(g.dy) > 10) { g = null; return; } }
    if (g.mode === "drag") {
      e.preventDefault();
      g.row.style.transform = `translateY(${g.dy}px) scale(1.02)`;
      const to = Math.max(0, Math.min(g.rows.length - 1, g.from + Math.round(g.dy / g.h))); g.to = to;
      g.rows.forEach((r, i) => { if (r === g.row) return; let s = 0; if (g.from < to && i > g.from && i <= to) s = -g.h; if (g.from > to && i < g.from && i >= to) s = g.h; r.style.transform = s ? `translateY(${s}px)` : ""; });
    } else if (g.mode === "swipe") {
      e.preventDefault();
      const dx = Math.min(0, g.dx); g.row.style.transform = `translateX(${dx}px)`; g.row.style.opacity = String(Math.max(0.25, 1 + dx / 320)); g.row.classList.toggle("qDel", dx < -90);
    }
  }, { passive: false });
  const end = () => {
    if (!g) return; const s = g; g = null;
    s.rows.forEach(r => { r.style.transform = ""; r.style.opacity = ""; }); s.row.classList.remove("qLift", "qDel");
    if (s.mode === "drag") {
      sup = Date.now();
      if (s.to >= 0 && s.to !== s.from) { const a = qi + 1 + s.from, b = qi + 1 + s.to; const [m] = queue.splice(a, 1); queue.splice(b, 0, m); saveQ(); renderQueue(); prepNext(); }
    } else if (s.mode === "swipe") {
      sup = Date.now();
      if (s.dx < -90) { const i = qi + 1 + s.from, t = queue[i]; if (t) { queue.splice(i, 1); saveQ(); renderQueue(); prepNext(); toast(tr(`“${t.title}” queue se hataya`)); } }
    }
  };
  list.addEventListener("touchend", end, { passive: true }); list.addEventListener("touchcancel", end, { passive: true });
})();

// Next on the last song (repeat off): continue with similar songs (autoplay) instead of jumping back to the first song
const nextV22 = next;
next = function (auto) {
  const t = queue[qi];
  if (!auto && repeat === 0 && t && qi === queue.length - 1 && navigator.onLine && t.src !== "pod" && !(typeof jamOn === "function" && jamOn())) {
    status("Loading…");
    api(radioURL(t)).then(d => { if (queue[qi] !== t) return; const add = freshSongs(d.items, queue).slice(0, 20).map(slim); if (!add.length) return nextV22(auto); queue.push(...add); qi++; saveQ(); loadCurrent(true); }).catch(() => { if (queue[qi] === t) nextV22(auto); });
    return;
  }
  return nextV22.apply(this, arguments);
};

// ---------- 9) Search: recent searches (remove one / clear all) + voice search 🎙️ ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceNative = () => (V23_NATIVE && window.DhunNative && window.DhunNative.voice) || null;
let voiceNatOK = false; if (voiceNative()) voiceNative().available().then(ok => { voiceNatOK = !!ok; if (ok && curTab === "search") renderSearchBody(); }).catch(() => {});
const voiceOK = () => V23_NATIVE ? voiceNatOK : !!SR;
const renderSearchV22 = renderSearch;
renderSearch = function () {
  const r = renderSearchV22.apply(this, arguments);
  const box = view.querySelector(".searchBox");
  if (box && voiceOK() && !box.querySelector(".micBtn")) box.insertAdjacentHTML("beforeend", `<button class="icon micBtn" data-act="voice" aria-label="Voice search"><svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z"/></svg></button>`);
  const s = searchState, sb = $("#sbody");
  if (sb && !s.q && !(s.typing && suggestions.length)) {
    const h2 = [...sb.querySelectorAll("h2")].find(h => h.querySelector("[data-act=clearSearches]"));
    if (h2 && h2.nextElementSibling && h2.nextElementSibling.classList.contains("sugg")) {
      h2.nextElementSibling.outerHTML = `<div class="sugg recentS">${searches.slice(0, 8).map((x, i) => `<div class="rsRow"><button data-sq="${esc(x)}">${ICON.clock}${esc(x)}</button><button class="rsX" data-act="rmSearch" data-i="${i}" aria-label="Remove">✕</button></div>`).join("")}</div>`;
      const c = h2.querySelector("[data-act=clearSearches]"); if (c) c.textContent = tr("Clear all");
    }
  }
  return r;
};
view.addEventListener("click", e => {
  const a = e.target.closest("[data-act]"); if (!a) return; const k = a.dataset.act;
  if (k === "rmSearch") { e.preventDefault(); e.stopPropagation(); searches.splice(+a.dataset.i, 1); store.set("searches", searches); renderSearchBody(); return; }
  if (k === "voice") { e.preventDefault(); e.stopPropagation(); voiceSearch(); return; }
}, true);
let voiceRec = null;
function voiceUI(txt, sub) {
  let o = $("#v23voice");
  if (txt == null) { if (o) o.remove(); return; }
  if (!o) { o = document.createElement("div"); o.id = "v23voice"; o.innerHTML = `<div class="vvBox"><div class="vvPulse"><i></i><svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z"/></svg></div><b></b><small></small><button class="vvX">${esc(tr("Cancel"))}</button></div>`; document.body.appendChild(o); o.querySelector(".vvX").onclick = () => { try { voiceRec && voiceRec.abort(); } catch (e) {} try { pehStop && pehStop(true); } catch (e) {} voiceUI(null); }; }
  o.querySelector("b").textContent = tr(txt); o.querySelector("small").textContent = sub ? tr(sub) : "";
}
async function voiceSearch() {
  const lang = appLang === "hi" ? "hi-IN" : "en-IN";
  const nat = voiceNative();
  if (nat) { try { const tx = await nat.listen(lang, tr("Bolo… gaane ka naam")); if (tx) doSearch(tx); } catch (e) { const m = String((e && (e.code || e.message)) || e); if (!/cancel/i.test(m)) toast(tr(/unavailable/i.test(m) ? "Ye feature abhi band hai" : "Awaaz samajh nahi aayi, dobara bolo")); } return; }
  if (!SR) return;
  try { voiceRec && voiceRec.abort(); } catch (e) {}
  const rec = new SR(); voiceRec = rec; rec.lang = lang; rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
  let final = "", heard = "";
  voiceUI("Bolo… gaane ka naam", "Sun raha hoon…");
  rec.onresult = ev => { let s = ""; for (let i = 0; i < ev.results.length; i++) { s += ev.results[i][0].transcript; if (ev.results[i].isFinal) final = s; } heard = s; const o = $("#v23voice small"); if (o) o.textContent = s; };
  rec.onerror = ev => { voiceUI(null); toast(tr(ev && /not-allowed|service-not-allowed/.test(ev.error) ? "Mic ki permission chahiye" : "Awaaz samajh nahi aayi, dobara bolo")); };
  rec.onend = () => { voiceUI(null); const q = (final || heard).trim(); if (q) doSearch(q); voiceRec = null; };
  try { rec.start(); } catch (e) { voiceUI(null); }
}
// ---------- 10) Android home-screen widget: wired in native.js through the lock-screen (media session) shim ----------

// ---------- 11) Settings: language row; AutoMix note; Android app banner on the website ----------
const renderLibraryV23a = renderLibrary;
renderLibrary = function () {
  const r = renderLibraryV23a.apply(this, arguments);
  if (subView !== "settings" || view.querySelector(".langCard")) return r;
  const first = view.querySelector("h2");
  const h = `<h2>🌐 Language</h2><div class="setCard langCard"><div class="setLbl">App ki bhasha</div><div class="seg langSeg" data-notr>${LANGS.map(([k, n]) => `<button data-act="lang" data-l="${k}" class="${appLang === k ? "on" : ""}">${esc(n)}</button>`).join("")}</div></div>`;
  if (first) first.insertAdjacentHTML("beforebegin", h); else view.insertAdjacentHTML("beforeend", h);
  const am = view.querySelector("[data-act=automix]");
  if (am && mixVolOK && !view.querySelector(".mixNote2")) am.insertAdjacentHTML("afterend", `<div class="setNote mixNote2">${appLang === "hi" ? "नया: बीट पर मिक्स, अगले गाने की ख़ामोशी छोड़ी जाती है, और जाते गाने का बेस धीरे-धीरे हटता है (DJ जैसा)। EQ / बेस बूस्ट चालू हो तो ऑटोमिक्स बंद रहता है।" : appLang === "en" ? "New: blends start on the beat, the next song's silence is skipped and the outgoing song's bass sweeps out (DJ-style). AutoMix pauses while EQ / Bass Boost is on." : "Naya: beat pe mix, agle gaane ki khamoshi skip, aur jaate gaane ka bass dheere-dheere hat-ta hai (DJ jaisa). EQ / Bass Boost on ho to AutoMix band rehta hai."}</div>`);
  return r;
};
view.addEventListener("click", e => { const b = e.target.closest("[data-act=lang]"); if (!b) return; e.preventDefault(); e.stopPropagation(); setLang(b.dataset.l); toast(tr("Bhasha badal di ✅")); }, true);
(() => { // website on an Android phone browser (not the app): suggest the app
  if (V23_NATIVE) return;
  const ua = navigator.userAgent || ""; if (!/Android/i.test(ua) || /; wv\)|DhunApp/i.test(ua)) return;
  if (Date.now() < +store.get("appBanUntil", 0)) return;
  setTimeout(() => {
    api("/api/app-version").then(v => {
      const mb = v && (v.size || v.bytes) ? (Math.round((v.size || v.bytes) / 1048576 * 10) / 10) + " MB" : "";
      const el = document.createElement("div"); el.id = "appBan";
      el.innerHTML = `<img src="/icon-192.png" alt=""><div><b>${esc(appLang === "hi" ? "Dhun ऐप डाउनलोड करें" : appLang === "en" ? "Get the Dhun app" : "Dhun app download karo")}</b><small>${esc(appLang === "hi" ? "बेहतर आवाज़, ऑफ़लाइन गाने, होम-स्क्रीन विजेट" : appLang === "en" ? "Better sound, offline songs, home-screen widget" : "Better sound, offline gaane, home-screen widget")}${mb ? " · " + mb : ""}</small></div><a href="/dhun.apk" class="abGo" download>${esc(appLang === "hi" ? "डाउनलोड" : "Download")}</a><button class="abX" aria-label="Close">✕</button>`;
      document.body.appendChild(el); requestAnimationFrame(() => el.classList.add("show"));
      const bye = () => { store.set("appBanUntil", Date.now() + 7 * 864e5); el.classList.remove("show"); setTimeout(() => el.remove(), 400); };
      el.querySelector(".abX").onclick = bye; el.querySelector(".abGo").addEventListener("click", () => setTimeout(bye, 300));
      setTimeout(() => { if (el.isConnected) { el.classList.remove("show"); setTimeout(() => el.remove(), 400); } }, 20000); // shows again next visit unless dismissed
    }).catch(() => {});
  }, 3500);
})();
window.__v23 = { tr, setLang, get lang() { return appLang; }, lyr: lyr2, lyrBuild, mixAnaBuf, mixPlan, songInfo, shareCard, shareCardDraw, followToggle, get follows() { return follows; }, relLoad, get rel() { return relData; }, setRate, get rate() { return pbRate; }, bassToggle, bassOn, voiceOK };

// ---------- 12) Liquid Glass chrome: tab bar shrinks while scrolling down, large titles collapse into a glass nav bar; weak-phone mode ----------
(() => {
  try { if ((navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) document.documentElement.classList.add("lite"); } catch (e) {}
  const nav = document.createElement("div"); nav.id = "v23nav"; nav.setAttribute("aria-hidden", "true"); document.getElementById("app").appendChild(nav);
  let lastY = 0, raf = 0;
  const upd = () => {
    raf = 0; const y = view.scrollTop, dy = y - lastY; lastY = y;
    if (y < 40 || dy < -6) document.body.classList.remove("tabsMini"); else if (dy > 6 && y > 120) document.body.classList.add("tabsMini");
    const h1 = view.querySelector("h1"); const show = !!h1 && h1.getBoundingClientRect().bottom < (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--st")) || 0) + 30;
    if (show) { const t = (h1.childNodes[0] && h1.childNodes[0].nodeType === 3 ? h1.childNodes[0].textContent : h1.textContent).trim(); if (nav.textContent !== t) nav.textContent = t; }
    nav.classList.toggle("show", show);
  };
  view.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  new MutationObserver(() => { lastY = view.scrollTop; document.body.classList.remove("tabsMini"); if (!raf) raf = requestAnimationFrame(upd); }).observe(view, { childList: true });
})();

// ================= v23: Podcasts 🎙️ =================
// ---------- 🎙️ Podcasts (Apple Podcasts directory; episodes play through the same player) ----------
// Episode track: {id:"pod:<hash>", src:"pod", title, artist:<show>, album:<show>, thumb, url:<enclosure>, dur}
// Stored: m_podSubs [{id,title,author,image}], m_podPos {id:{pos,dur,at,done,t,s,n,d}}, m_podRate, m_podHomeCache
const POD_S = { // all podcast UI words in one place (for the language switch)
  title: "Podcasts", sub: "Kahaniyan, comedy, gyaan — sab free", lib: "Podcasts", libSub: n => n ? `${n} follow kiye` : "Kahaniyan, comedy, gyaan",
  search: "Podcast dhoondo…", cont: "Continue listening", yours: "Aapke podcasts", cats: "Categories", results: q => `“${q}” ke results`,
  none: "Kuch nahi mila 😕", err: "Load nahi hua — internet check karo", retry: "Dobara try karo", loading: "La raha hoon…",
  follow: "＋ Follow", following: "✓ Following", followed: "Follow kar liya 🎙️", unfollowed: "Unfollow kar diya",
  latest: "Latest episode", resume: "Resume", eps: n => `${n} episode${n === 1 ? "" : "s"}`, episodes: "Episodes", more: "Aur episodes",
  played: "✓ Played", left: m => `${m} baaki`, back: "Podcasts", backLib: "Library", backSearch: "Search",
  showMore: "aur padho", showLess: "kam dikhao", noNotes: "Is episode ke notes nahi hain", notesHead: "🎙️ Episode notes",
  jam: "Listen Together me podcast nahi chalta — pehle session band karo", fail: "Episode nahi chal paya 😕 thodi der baad try karo",
  speed: r => `Speed ${r}×`, openShow: "🎙️ Show kholo", markPlayed: "✓ Played mark karo", markUnplayed: "↺ Unplayed mark karo",
  noLike: "Podcast episodes Liked Songs me nahi jaate", noDl: "Podcast episodes Telegram pe download nahi hote", queueEnd: "Episode khatam ✓",
  upNext: "Iske baad koi episode nahi — queue khatam pe ruk jayega", today: "Aaj", yday: "Kal", daysAgo: n => `${n} din pehle`,
};
const POD_ICON = '<svg viewBox="0 0 24 24"><path d="M12 2a3.5 3.5 0 013.5 3.5v6a3.5 3.5 0 01-7 0v-6A3.5 3.5 0 0112 2zm6.5 9.5h2a8.5 8.5 0 01-7.5 8.44V22h-2v-2.06A8.5 8.5 0 013.5 11.5h2a6.5 6.5 0 0013 0z"/></svg>';
const POD_B15 = '<svg viewBox="0 0 24 24"><path d="M12 4.5V1.5L7.5 5.5l4.5 4V6.5a6.5 6.5 0 11-6.5 6.5h-2a8.5 8.5 0 108.5-8.5z"/><text x="12.2" y="16.6" font-size="6.6" font-weight="700" text-anchor="middle" font-family="-apple-system,Roboto,sans-serif">15</text></svg>';
const POD_F30 = '<svg viewBox="0 0 24 24"><path d="M12 4.5V1.5l4.5 4-4.5 4V6.5a6.5 6.5 0 106.5 6.5h2A8.5 8.5 0 1112 4.5z"/><text x="11.8" y="16.6" font-size="6.6" font-weight="700" text-anchor="middle" font-family="-apple-system,Roboto,sans-serif">30</text></svg>';
const POD_RATES = [1, 1.25, 1.5, 1.75, 2, 0.75];
const isPod = t => !!(t && (t.src === "pod" || /^pod:/.test(String(t.id || ""))));
let podSubs = store.get("podSubs", []), podPos = store.get("podPos", {}), podRate = +store.get("podRate", 1) || 1;
if (!POD_RATES.includes(podRate)) podRate = 1;
let podHome = store.get("podHomeCache", null), podHomeBusy = false, podHomeErr = false;
const podShows = new Map(); // show id -> {data} | {loading} | {err}
const podSt = { q: "", items: null, busy: false, err: false, gkey: "", gtitle: "", show: 50, descOpen: false };
const podProxy = u => (typeof API_BASE === "string" ? API_BASE : "") + "/api/pod/a?u=" + encodeURIComponent(u);
const podSrc = u => !u ? "" : (eqRouted || (/^http:/i.test(u) && location.protocol !== "http:")) ? podProxy(u) : u;
const podSavePos = () => { const ks = Object.keys(podPos); if (ks.length > 400) ks.sort((a, b) => (podPos[a].at || 0) - (podPos[b].at || 0)).slice(0, ks.length - 400).forEach(k => delete podPos[k]); store.set("podPos", podPos); };
const podMin = s => { s = Math.max(0, Math.round(s || 0)); if (s < 60) return s ? `${s} sec` : ""; const m = Math.round(s / 60), h = Math.floor(m / 60); return h ? `${h} hr${m % 60 ? " " + (m % 60) + " min" : ""}` : `${m} min`; };
const podDate = ms => { if (!ms) return ""; const d = new Date(ms), now = new Date(), day = 864e5; const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(), b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); const n = Math.round((a - b) / day); if (n === 0) return POD_S.today; if (n === 1) return POD_S.yday; if (n > 1 && n < 7) return POD_S.daysAgo(n); return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: d.getFullYear() === now.getFullYear() ? undefined : "numeric" }); };
const podArtS = (u, s = 300) => String(u || "").replace(/\/600x600bb\.jpg$/, `/${s}x${s}bb.jpg`);
const podSubbed = id => podSubs.some(x => x.id === String(id));
function podTrack(show, e) { return { id: "pod:" + e.k, src: "pod", title: e.title || "Episode", artist: show.title || "Podcast", album: show.title || "", dur: e.dur || 0, thumb: e.image || show.image || "", url: e.url }; }
function podRemember(show, e, t) { const o = podPos[t.id] || (podPos[t.id] = { pos: 0 }); o.t = slim(t); o.s = String(show.id || ""); o.n = e.desc || ""; o.d = e.date || 0; o.dur = o.dur || e.dur || 0; if (!o.at) o.at = Date.now(); }
function podResume(id) { const o = podPos[id]; if (!o || o.done) return 0; const d = o.dur || 0; return o.pos > 5 && (!d || o.pos < d - 8) ? Math.max(0, o.pos - 2) : 0; }
function podProgress(id, dur) { const o = podPos[id]; if (!o) return null; const d = o.dur || dur || 0; return { pos: o.pos || 0, dur: d, done: !!o.done, pct: d ? Math.min(100, (o.pos || 0) / d * 100) : 0 }; }
function podRecord(force) { // remember where the episode is (every few seconds while it plays, on pause/seek)
  const t = queue[qi]; if (!isPod(t) || mode !== "audio" || !audio.src || audio.readyState < 1) return;
  const cur = audio.currentTime || 0, d = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (t.dur || 0);
  const o = podPos[t.id] || (podPos[t.id] = { t: slim(t) });
  if (cur < 1 && (o.pos || 0) > 5 && !force) return; // freshly loaded, not yet at its resume point
  o.pos = Math.round(cur); if (d) o.dur = Math.round(d); o.at = Date.now(); if (!o.t) o.t = slim(t);
  if (d && cur / d > 0.95) o.done = 1; else if (o.done && cur > 5 && d && cur < d * 0.9) o.done = 0;
  podSavePos();
}
function podMarkDone(id, on) { const o = podPos[id] || (podPos[id] = { pos: 0 }); if (on === false) { o.done = 0; o.pos = 0; } else { o.done = 1; if (o.dur) o.pos = o.dur; } o.at = Date.now(); podSavePos(); }
function podContinue() { return Object.entries(podPos).filter(([id, o]) => o && o.t && !o.done && (o.pos || 0) >= 10).sort((a, b) => (b[1].at || 0) - (a[1].at || 0)).slice(0, 12).map(([id, o]) => ({ id, ...o })); }

// ----- data -----
function podLoadHome(force) {
  if (podHomeBusy || (!force && podHome && Date.now() - (podHome.at || 0) < 6 * 3600e3)) return;
  podHomeBusy = true; podHomeErr = false;
  api("/api/pod/top").then(d => { if (d && d.rows && d.rows.length) { podHome = { rows: d.rows, genres: d.genres || [], at: Date.now() }; store.set("podHomeCache", podHome); } else podHomeErr = !podHome; })
    .catch(() => { podHomeErr = !podHome; }).finally(() => { podHomeBusy = false; podRefresh("pods"); });
}
function podLoadShow(id, force) {
  const c = podShows.get(id); if (c && (c.loading || (c.data && !force))) return;
  podShows.set(id, { loading: 1, data: c && c.data });
  api("/api/pod/show?id=" + encodeURIComponent(id)).then(d => { if (!d || d.error || !d.episodes) throw new Error(d && d.error || "x"); podShows.set(id, { data: d }); const s = podSubs.find(x => x.id === id); if (s && d.image) { s.image = d.image; s.title = d.title || s.title; store.set("podSubs", podSubs); } })
    .catch(() => podShows.set(id, { err: 1, data: c && c.data })).finally(() => podRefresh("pod:" + id));
}
function podSearchRun(q) {
  q = String(q || "").trim(); podSt.q = q; podSt.gkey = ""; podSt.items = null; podSt.err = false; podSt.show = 50;
  if (!q) return podRefresh("pods");
  podSt.busy = true; podRefresh("pods"); const my = (podSt.tok = Math.random());
  api("/api/pod/search?q=" + encodeURIComponent(q)).then(d => { if (my === podSt.tok) podSt.items = d.items || []; }).catch(() => { if (my === podSt.tok) podSt.err = true; })
    .finally(() => { if (my === podSt.tok) { podSt.busy = false; podRefresh("pods"); } });
}
function podGenre(key, title) {
  podSt.q = ""; podSt.gkey = key; podSt.gtitle = title || key; podSt.items = null; podSt.err = false; podSt.busy = true; podRefresh("pods"); view.scrollTop = 0;
  const my = (podSt.tok = Math.random());
  api("/api/pod/top?genre=" + encodeURIComponent(key)).then(d => { if (my === podSt.tok) podSt.items = d.items || []; }).catch(() => { if (my === podSt.tok) podSt.err = true; })
    .finally(() => { if (my === podSt.tok) { podSt.busy = false; podRefresh("pods"); } });
}
function podRefresh(which) { if (!podIsView()) return; if (which && which !== subView && !(which === "pods" && subView === "pods")) return; podRender(); }
const podIsView = () => (curTab === "library" || curTab === "search") && typeof subView === "string" && (subView === "pods" || subView.startsWith("pod:"));

// ----- views -----
function podTileHTML(s, big) { return `<button class="podTile${big ? " big" : ""}" data-pod="show" data-id="${esc(s.id)}"><img loading="lazy" src="${esc(podArtS(s.image))}" onerror="this.onerror=null;this.src='/icon-192.png'" alt=""><div class="t1">${esc(s.title)}</div><div class="t2">${esc(s.author || s.genre || "")}</div></button>`; }
function podContHTML() {
  const c = podContinue(); if (!c.length) return "";
  return `<h2>${esc(POD_S.cont)}</h2><div class="podCar">${c.map(o => { const d = o.dur || o.t.dur || 0, pct = d ? Math.min(100, o.pos / d * 100) : 0, cur = queue[qi] && queue[qi].id === o.id;
    return `<div class="podCont${cur ? " cur" : ""}" data-pod="cplay" data-id="${esc(o.id)}"><button class="podX" data-pod="cdel" data-id="${esc(o.id)}" aria-label="Hatao">✕</button><img loading="lazy" src="${esc(podArtS(o.t.thumb, 200))}" onerror="this.onerror=null;this.src='/icon-192.png'" alt=""><div class="podContTx"><div class="t2">${esc(o.t.artist)}</div><div class="t1">${esc(o.t.title)}</div><div class="podBarRow"><i class="podBar"><b style="width:${pct.toFixed(1)}%"></b></i><span>${esc(d ? POD_S.left(podMin(d - o.pos)) : podMin(o.pos))}</span></div></div></div>`; }).join("")}</div>`;
}
function podHomeHTML(backLabel) {
  let h = `<button class="back" data-pod="back">${ICON.chev}${esc(backLabel)}</button><h1 class="podH1">${POD_ICON}${esc(POD_S.title)}</h1>
  <div class="podSearch">${ICON.search}<input id="podQ" type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${esc(POD_S.search)}" value="${esc(podSt.q)}">${podSt.q || podSt.gkey ? `<button class="podClr" data-pod="clear" aria-label="Clear">✕</button>` : ""}</div>`;
  if (podSt.q || podSt.gkey) {
    h += `<h2>${esc(podSt.q ? POD_S.results(podSt.q) : podSt.gtitle)}</h2>`;
    if (podSt.busy) h += `<div class="spin"></div>`;
    else if (podSt.err) h += `<div class="empty">${esc(POD_S.err)}<br><button class="podPill" data-pod="${podSt.q ? "research" : "regenre"}">${esc(POD_S.retry)}</button></div>`;
    else if (!podSt.items || !podSt.items.length) h += `<div class="empty">${esc(POD_S.none)}</div>`;
    else h += `<div class="podGrid">${podSt.items.map(s => podTileHTML(s)).join("")}</div>`;
    return h;
  }
  h += podContHTML();
  if (podSubs.length) h += `<h2>${esc(POD_S.yours)}</h2><div class="podCar">${podSubs.map(s => podTileHTML(s, true)).join("")}</div>`;
  if (podHome && podHome.rows) {
    podHome.rows.forEach(r => { h += `<h2>${esc(r.title)}${r.key && r.key !== "top" ? ` <a data-pod="genre" data-k="${esc(r.key)}" data-t="${esc(r.title)}">See All</a>` : ""}</h2><div class="podCar">${r.items.slice(0, 20).map(s => podTileHTML(s)).join("")}</div>`; });
    if (podHome.genres && podHome.genres.length) h += `<h2>${esc(POD_S.cats)}</h2><div class="podChips">${podHome.genres.map(g => `<button class="podChip" data-pod="genre" data-k="${esc(g.key)}" data-t="${esc(g.title)}">${esc(g.title)}</button>`).join("")}</div>`;
  } else if (podHomeErr) h += `<div class="empty">${esc(POD_S.err)}<br><button class="podPill" data-pod="rehome">${esc(POD_S.retry)}</button></div>`;
  else h += `<h2>&nbsp;</h2><div class="podCar">${Array(4).fill('<div class="podTile"><div class="podSkel"></div></div>').join("")}</div>`;
  return h;
}
function podEpHTML(show, e) {
  const id = "pod:" + e.k, pr = podProgress(id, e.dur), cur = queue[qi] && queue[qi].id === id, playing = cur && P.playing();
  const d = (pr && pr.dur) || e.dur || 0;
  const lab = pr && pr.done ? POD_S.played : pr && pr.pos >= 10 && d ? POD_S.left(podMin(d - pr.pos)) : podMin(d);
  return `<div class="podEp${cur ? " cur" : ""}${pr && pr.done ? " done" : ""}" data-pod="ep" data-k="${esc(e.k)}"><div class="podEpDate">${esc(podDate(e.date))}</div><div class="podEpT">${esc(e.title)}</div>${e.desc ? `<div class="podEpD">${esc(e.desc)}</div>` : ""}
    <div class="podEpRow"><span class="podEpPlay">${playing ? ICON.pause : ICON.play}</span>${pr && !pr.done && pr.pos >= 10 ? `<i class="podBar"><b style="width:${pr.pct.toFixed(1)}%"></b></i>` : ""}<span class="podEpLab">${esc(lab || "")}</span></div></div>`;
}
function podShowHTML(id) {
  const c = podShows.get(id) || {}, s = c.data, sub = podSubbed(id);
  let h = `<button class="back" data-pod="back">${ICON.chev}${esc(POD_S.back)}</button>`;
  if (!s) return h + (c.err ? `<div class="empty">${esc(POD_S.err)}<br><button class="podPill" data-pod="reshow">${esc(POD_S.retry)}</button></div>` : `<div class="spin"></div>`);
  const inProg = s.episodes.find(e => { const p = podPos["pod:" + e.k]; return p && !p.done && p.pos >= 10; });
  h += `<div class="podHero"><img src="${esc(s.image)}" onerror="this.onerror=null;this.src='/icon-192.png'" alt=""><div class="podHeroTx"><h3>${esc(s.title)}</h3><div class="podAuthor">${esc(s.author)}</div><div class="sub">${esc([s.genre, POD_S.eps(s.episodes.length)].filter(Boolean).join(" · "))}</div></div></div>
  <div class="podBtns">${s.episodes.length ? `<button class="podPlayBtn" data-pod="playtop">${ICON.play}${esc(inProg ? POD_S.resume : POD_S.latest)}</button>` : ""}<button class="podSub${sub ? " on" : ""}" data-pod="sub">${esc(sub ? POD_S.following : POD_S.follow)}</button></div>`;
  if (s.description) h += `<div class="podDesc${podSt.descOpen ? " open" : ""}" data-pod="desc">${esc(s.description).replace(/\n/g, "<br>")}<span class="podMore">${esc(podSt.descOpen ? POD_S.showLess : POD_S.showMore)}</span></div>`;
  h += `<h2>${esc(POD_S.episodes)}</h2><div class="podEps">${s.episodes.slice(0, podSt.show).map(e => podEpHTML(s, e)).join("")}</div>`;
  if (s.episodes.length > podSt.show) h += `<div style="text-align:center;padding:10px 0 20px"><button class="podPill" data-pod="moreeps">${esc(POD_S.more)} (${s.episodes.length - podSt.show})</button></div>`;
  return h;
}
function podRender() {
  if (!podIsView()) return;
  const y = view.scrollTop, focused = document.activeElement && document.activeElement.id === "podQ";
  const caret = focused ? document.activeElement.selectionStart : null;
  const backLabel = curTab === "search" ? POD_S.backSearch : POD_S.backLib;
  if (subView === "pods") { view.innerHTML = `<div class="podView">${podHomeHTML(backLabel)}</div>`; podLoadHome(); }
  else { const id = subView.slice(4); view.innerHTML = `<div class="podView">${podShowHTML(id)}</div>`; podLoadShow(id); }
  view.scrollTop = y;
  const q = $("#podQ"); if (q) {
    if (focused) { q.focus(); try { q.setSelectionRange(caret, caret); } catch (e) {} }
    q.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(podSt.qt); podSearchRun(q.value); q.blur(); } };
    q.oninput = () => { clearTimeout(podSt.qt); const v = q.value; podSt.qt = setTimeout(() => { if (v.trim().length >= 2 || !v.trim()) podSearchRun(v); }, 600); };
  }
}
function podOpenShow(id) { id = String(id); podSt.show = 50; podSt.descOpen = false; go(curTab === "search" ? "search" : "library", "pod:" + id); }
function podOpenHome() { go(curTab === "search" ? "search" : "library", "pods"); }

// ----- playback -----
function podPlayEp(show, k) {
  if (typeof jamOn === "function" && jamOn()) return toast(POD_S.jam);
  const eps = show.episodes || [], i = eps.findIndex(e => e.k === k); if (i < 0) return;
  const id = "pod:" + k, cur = queue[qi];
  if (cur && cur.id === id && mode === "audio" && audio.getAttribute("src")) { if (P.playing()) P.pause(); else P.play(); return setTimeout(() => podRefresh(subView), 60); }
  // after this one: the newer episodes in order (serials), else the older unplayed ones (episodic)
  let rest = eps.slice(Math.max(0, i - 20), i).reverse(); if (!rest.length) rest = eps.slice(i + 1).filter(e => { const p = podPos["pod:" + e.k]; return !(p && p.done); }).slice(0, 20);
  const list = [eps[i], ...rest].map(e => { const t = podTrack(show, e); podRemember(show, e, t); return t; });
  podSavePos();
  queue = list.map(slim); qi = 0; autoplayAdded = new Set(); saveQ();
  loadCurrent(true, podResume(id));
  setTimeout(() => podRefresh(subView), 80);
}
function podPlayStored(id) { // continue-listening card
  if (typeof jamOn === "function" && jamOn()) return toast(POD_S.jam);
  const o = podPos[id]; if (!o || !o.t) return;
  const cur = queue[qi]; if (cur && cur.id === id && audio.getAttribute("src")) { if (!P.playing()) P.play(); return; }
  queue = [slim(o.t)]; qi = 0; autoplayAdded = new Set(); saveQ(); loadCurrent(true, podResume(id));
  setTimeout(() => podRefresh(subView), 80);
}
function podSkip(sec) { const d = P.dur(), t = P.time() || 0; P.seek(Math.max(0, Math.min(d ? d - 1 : t + sec, t + sec))); podRecord(true); }
function podSetRate(r) { podRate = r; store.set("podRate", r); podApplyRate(); podUi(true); toast(POD_S.speed(r)); }
function podApplyRate() {
  const a = audio; if (!a) return; const pod = isPod(queue[qi]);
  const want = pod ? podRate : (window.__pod && typeof window.__pod.songRate === "function" ? (+window.__pod.songRate() || 1) : 1);
  if (!pod && !podUi.wasPod) return; // songs: leave the rate to the song speed setting
  try { if (a.playbackRate !== want) a.playbackRate = want; if (a.defaultPlaybackRate !== want) a.defaultPlaybackRate = want; a.preservesPitch = true; a.webkitPreservesPitch = true; a.mozPreservesPitch = true; } catch (e) {}
}
function podUi(force) { // now-playing / mini player controls for podcasts vs songs
  const pod = isPod(queue[qi]);
  if (pod !== podUi.on || force) {
    const was = podUi.on; podUi.on = pod; document.body.classList.toggle("podOn", pod);
    if (!pod && was) { podUi.wasPod = true; podApplyRate(); podUi.wasPod = false; } else if (pod) podApplyRate();
    if ("mediaSession" in navigator) { const ms = navigator.mediaSession, h = (a, f) => { try { ms.setActionHandler(a, f); } catch (e) {} };
      if (pod) { h("seekbackward", () => { if (isPod(queue[qi])) podSkip(-15); }); h("seekforward", () => { if (isPod(queue[qi])) podSkip(30); }); } else if (was) { h("seekbackward", null); h("seekforward", null); } }
  }
  const rb = $("#podRate"); if (rb) { const txt = (podRate % 1 ? String(podRate) : podRate + "") + "×"; if (rb.textContent !== txt) rb.textContent = txt; rb.classList.toggle("on", podRate !== 1); }
  if (pod) { const b = $("#npQ"); if (b && b.textContent !== "🎙️ Podcast") { b.textContent = "🎙️ Podcast"; b.className = "qpill podQ"; } }
}
podUi.on = false; podUi.wasPod = false;
(function podControls() { // extra buttons; shown only while a podcast plays (CSS: body.podOn)
  const pp = $("#npPrev"), pn = $("#npNext"), mn = $("#miniNext"), bot = document.querySelector(".npBottom");
  const mk = (id, cls, html, label, fn) => { const b = document.createElement("button"); b.id = id; b.className = cls; b.innerHTML = html; b.setAttribute("aria-label", label); b.onclick = e => { e.stopPropagation(); fn(); }; return b; };
  if (pp) pp.after(mk("podB15", "icon big podCtl", POD_B15, "15 sec peeche", () => podSkip(-15)));
  if (pn) pn.before(mk("podF30", "icon big podCtl", POD_F30, "30 sec aage", () => podSkip(30)));
  if (mn) mn.after(mk("podMiniF", "icon podCtl", POD_F30, "30 sec aage", () => podSkip(30)));
  if (bot) bot.prepend(mk("podRate", "icon small podCtl podRateBtn", "1×", "Speed", () => podSetRate(POD_RATES[(POD_RATES.indexOf(podRate) + 1) % POD_RATES.length])));
  const ar = $("#npArtist"); if (ar) ar.addEventListener("click", e => { const t = queue[qi]; if (!isPod(t)) return; const o = podPos[t.id]; if (o && o.s) { e.stopPropagation(); closeNP(); podOpenShow(o.s); } });
})();
setInterval(() => { podUi(); if (isPod(queue[qi])) { podApplyRate(); if (!audio.paused) { podRecord(); if (podIsView() && subView.startsWith("pod:") && Date.now() - (podSt.rt || 0) > 15000) { podSt.rt = Date.now(); podRender(); } } } }, 1000);
["pause", "seeked", "ended"].forEach(ev => document.addEventListener(ev, e => { if (e.target === audio && isPod(queue[qi])) { podRecord(true); if (ev !== "seeked" && podIsView()) setTimeout(podRender, 50); } }, true));
document.addEventListener("loadedmetadata", e => { if (e.target === audio && isPod(queue[qi])) podApplyRate(); }, true);
document.addEventListener("play", e => { if (e.target === audio && isPod(queue[qi])) { podApplyRate(); if (podIsView()) setTimeout(podRender, 50); } }, true);

// ----- integration with the player (wrapping; no existing lines edited) -----
const rawUrlOfPod = urlOf; urlOf = function (t) { if (isPod(t)) return podSrc(t.url); return rawUrlOfPod.apply(this, arguments); };
const rawSongKeyPod = songKey; songKey = function (t) { if (isPod(t)) return "pod:" + t.id; return rawSongKeyPod.apply(this, arguments); }; // every episode is its own "song"
const rawLoadCurrentPod = loadCurrent; loadCurrent = function (autoplay, startAt) { const t = queue[qi]; if (isPod(t) && !startAt) startAt = podResume(t.id); const r = rawLoadCurrentPod.call(this, autoplay, startAt); podUi(); podApplyRate(); return r; };
const rawOnFailPod = onFail; onFail = function (t, url, my, startAt, autoplay, attempt) {
  if (!isPod(t)) return rawOnFailPod.apply(this, arguments);
  clearTimeout(stallTimer); if (my !== loadToken) return;
  if (!/\/api\/pod\/a\?/.test(url || "") && t.url) { status(POD_S.loading); return playUrl(t, podProxy(t.url), my, autoplay, startAt, 1); } // try the pass-through once
  userPaused = true; syncPlay(); status(POD_S.fail);
};
const rawYtFallbackPod = ytFallback; ytFallback = function (t) { if (isPod(t)) { userPaused = true; syncPlay(); status(POD_S.fail); return; } return rawYtFallbackPod.apply(this, arguments); };
const rawAutoEndPod = autoEnd; autoEnd = function () { if (isPod(queue[qi])) { userPaused = true; syncPlay(); return; } return rawAutoEndPod.apply(this, arguments); }; // no "similar songs" after an episode
const rawFillPod = maybeAutoplayFill; maybeAutoplayFill = function () { if (isPod(queue[qi])) return; return rawFillPod.apply(this, arguments); };
const rawNextPod = next; next = function (auto) { const t = queue[qi]; if (auto && isPod(t)) podMarkDone(t.id); return rawNextPod.apply(this, arguments); };
const rawMixNextPod = mixNextIndex; mixNextIndex = function () { if (isPod(queue[qi])) return -1; const j = rawMixNextPod.apply(this, arguments); return j >= 0 && isPod(queue[j]) ? -1 : j; }; // AutoMix never blends podcasts
const rawMixMaybePod = mixMaybe; mixMaybe = function () { if (isPod(queue[qi])) return; return rawMixMaybePod.apply(this, arguments); };
const rawAddRecentPod = addRecent; addRecent = function (t) { if (isPod(t)) return; return rawAddRecentPod.apply(this, arguments); };
const rawHistPlayPod = histPlay; histPlay = function (t) { if (isPod(t)) return; return rawHistPlayPod.apply(this, arguments); }; // podcasts are not song plays / Recap
const rawHistTodayPod = histToday; histToday = function () { if (isPod(queue[qi])) return { t: 0, p: 0, s: {} }; return rawHistTodayPod.apply(this, arguments); }; // listening minutes count songs only
const rawStartRadioPod = startRadio; startRadio = function (t) { if (isPod(t)) return; return rawStartRadioPod.apply(this, arguments); };
const rawToggleLikePod = toggleLike; toggleLike = function (t) { if (isPod(t)) return toast(POD_S.noLike); return rawToggleLikePod.apply(this, arguments); };
const rawDownloadPod = download; download = function (t) { if (isPod(t)) return toast(POD_S.noDl); return rawDownloadPod.apply(this, arguments); };
const rawDownloadAllPod = downloadAll; downloadAll = function (list) { return rawDownloadAllPod.call(this, (list || []).filter(t => !isPod(t))); };
if (typeof offDownload === "function") { const rawOffDl = offDownload; offDownload = function (t) { if (isPod(t)) return toast(POD_S.noDl); return rawOffDl.apply(this, arguments); }; } // Android phone downloads
if (typeof openAddToPlaylist === "function") { const rawAddPl = openAddToPlaylist; openAddToPlaylist = function (t) { if (isPod(t)) return; return rawAddPl.apply(this, arguments); }; }
const rawSyncQPod = syncQ; syncQ = function () { if (isPod(queue[qi])) return podUi(true); return rawSyncQPod.apply(this, arguments); };
const rawRenderQueuePod = renderQueue; renderQueue = function () { rawRenderQueuePod.apply(this, arguments); if (!isPod(queue[qi])) return; const n = $("#autoplayNote"); if (n) n.textContent = ""; const ql = $("#queueList"); if (ql && !queue[qi + 1]) ql.innerHTML = `<div class="empty" style="padding:16px">${esc(POD_S.upNext)}</div>`; };
const rawOpenTrackSheetPod = openTrackSheet; openTrackSheet = function (t) {
  if (!isPod(t)) return rawOpenTrackSheetPod.apply(this, arguments);
  const o = podPos[t.id] || {};
  showSheet(`<div class="sgroup"><div class="shead"><img src="${esc(podArtS(t.thumb, 200))}"><div><div class="t1">${esc(t.title)}</div><div class="sub">${esc(t.artist)}</div></div></div>
    ${o.s ? `<button data-s="show">${esc(POD_S.openShow)}</button>` : ""}<button data-s="done">${esc(o.done ? POD_S.markUnplayed : POD_S.markPlayed)}</button>
    <button data-s="rate">${esc(POD_S.speed(podRate))}</button></div>`, {
    show: () => { closeNP(); podOpenShow(o.s); }, done: () => { podMarkDone(t.id, !o.done); if (podIsView()) podRender(); },
    rate: () => { podSetRate(POD_RATES[(POD_RATES.indexOf(podRate) + 1) % POD_RATES.length]); return true; },
  });
};
if (typeof lyrLoad === "function" && typeof lyrCache !== "undefined") { // tap on the artwork: episode notes instead of lyrics
  const rawLyrLoadPod = lyrLoad; lyrLoad = function (t) {
    if (!isPod(t)) return rawLyrLoadPod.apply(this, arguments);
    const o = podPos[t.id] || {}; lyrCache.set(t.id, { plain: POD_S.notesHead + "\n\n" + (o.n || POD_S.noNotes) }); return rawLyrLoadPod.apply(this, arguments);
  };
}
const podRoute = () => { if (!podIsView()) return false; podRender(); return true; };
const rawRenderLibraryPod = renderLibrary; renderLibrary = function () {
  if (podRoute()) return;
  rawRenderLibraryPod.apply(this, arguments);
  if (subView) return; const ll = view.querySelector(".libLinks"); if (!ll || ll.querySelector(".podLib")) return;
  const tmp = document.createElement("div"); tmp.innerHTML = `<button data-pod="home" class="podLib"><i class="podLibI">🎙️</i><span>${esc(POD_S.lib)} <small class="sub">${esc(POD_S.libSub(podSubs.length))}</small></span></button>`;
  const after = ll.querySelector("[data-open=recent]"); if (after) after.after(tmp.firstChild); else ll.appendChild(tmp.firstChild);
};
const rawRenderSearchPod = renderSearch; renderSearch = function () {
  if (podRoute()) return;
  rawRenderSearchPod.apply(this, arguments);
  const s = searchState; if (subView || s.q || s.typing) return; const sb = $("#sbody"); if (!sb || sb.querySelector(".podEntry")) return;
  const card = `<button class="podEntry" data-pod="home"><i class="podEntryI">${POD_ICON}</i><span><b>🎙️ ${esc(POD_S.title)}</b><small>${esc(POD_S.sub)}</small></span><i class="podEntryC">›</i></button>`;
  const h2 = [...sb.querySelectorAll("h2")].find(x => /Browse/i.test(x.textContent)) || sb.querySelector(".chips");
  if (h2) h2.insertAdjacentHTML("beforebegin", card); else sb.insertAdjacentHTML("afterbegin", card);
};
view.addEventListener("click", e => {
  const b = e.target.closest("[data-pod]"); if (!b || !view.contains(b)) return;
  e.stopPropagation(); e.preventDefault();
  const a = b.dataset.pod, sid = typeof subView === "string" && subView.startsWith("pod:") ? subView.slice(4) : "";
  const show = sid && podShows.get(sid) && podShows.get(sid).data;
  if (a === "home") { podSt.q = ""; podSt.gkey = ""; return podOpenHome(); }
  if (a === "back") { if (sid) { subView = "pods"; rerender(); } else if (podSt.q || podSt.gkey) { podSt.q = ""; podSt.gkey = ""; podSt.items = null; podRender(); } else { subView = null; rerender(); } return; }
  if (a === "clear") { podSt.q = ""; podSt.gkey = ""; podSt.items = null; return podRender(); }
  if (a === "show") return podOpenShow(b.dataset.id);
  if (a === "genre") return podGenre(b.dataset.k, b.dataset.t);
  if (a === "research") return podSearchRun(podSt.q);
  if (a === "regenre") return podGenre(podSt.gkey, podSt.gtitle);
  if (a === "rehome") { podLoadHome(true); return podRender(); }
  if (a === "reshow" && sid) { podLoadShow(sid, true); return podRender(); }
  if (a === "cdel") { const o = podPos[b.dataset.id]; if (o) { o.pos = 0; podSavePos(); } return podRender(); }
  if (a === "cplay") return podPlayStored(b.dataset.id);
  if (a === "desc") { podSt.descOpen = !podSt.descOpen; return podRender(); }
  if (a === "moreeps") { podSt.show += 100; return podRender(); }
  if (a === "sub" && show) {
    if (podSubbed(sid)) { podSubs = podSubs.filter(x => x.id !== sid); toast(POD_S.unfollowed); }
    else { podSubs.unshift({ id: sid, title: show.title, author: show.author, image: show.image }); toast(POD_S.followed); }
    store.set("podSubs", podSubs); return podRender();
  }
  if (a === "playtop" && show) { const e0 = show.episodes.find(e => { const p = podPos["pod:" + e.k]; return p && !p.done && p.pos >= 10; }) || show.episodes[0]; return e0 && podPlayEp(show, e0.k); }
  if (a === "ep" && show) return podPlayEp(show, b.dataset.k);
}, true);
// Android back button: call window.__pod.back() first (returns true when it handled the tap)
window.__pod = {
  get rate() { return podRate; }, set rate(r) { if (POD_RATES.includes(+r)) podSetRate(+r); }, rates: POD_RATES, songRate: null,
  isPod, subs: () => podSubs, pos: () => podPos, shows: podShows, open: podOpenHome, openShow: podOpenShow, search: podSearchRun, skip: podSkip,
  playEp: (showId, k) => { const c = podShows.get(String(showId)); if (c && c.data) podPlayEp(c.data, k); }, playStored: podPlayStored, record: podRecord,
  back() { if (!podIsView()) return false; if (subView.startsWith("pod:")) subView = "pods"; else if (podSt.q || podSt.gkey) { podSt.q = ""; podSt.gkey = ""; podSt.items = null; } else subView = null; rerender(); return true; },
};
if (queue[qi]) podUi(true);

try { if (window.__pod) window.__pod.songRate = () => pbRate; } catch (e) {}


// ===================== v25 (Dhun 1.0.3): Apple-style song menu (fits + scrolls), Bass Boost never blocks playback, "Powered by Guru" header, podcasts on Home, search history on tap =====================
const v25L = (en, hg, hi) => appLang === "hi" ? hi : appLang === "hinglish" ? hg : en;
const v25IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const v25Api = typeof API_BASE === "string" ? API_BASE : "";
const V25I = {
  aa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 14.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm0-5.6a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z"/></svg>',
  person: '<svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 2c-3.3 0-9 1.7-9 5v2h18v-2c0-3.3-5.7-5-9-5z"/></svg>',
  radio: '<svg viewBox="0 0 24 24"><path d="M3.24 6.15A2 2 0 002 8v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20a3 3 0 110-6 3 3 0 010 6zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>',
  info: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
  lyr: '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>',
  card: '<svg viewBox="0 0 24 24"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>',
  speed: '<svg viewBox="0 0 24 24"><path d="M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19a2 2 0 001.72 1h13.85a2 2 0 001.74-1 10 10 0 00-.27-10.44zm-9.79 6.84a2 2 0 002.83 0l5.66-8.49-8.49 5.66a2 2 0 000 2.83z"/></svg>',
  bass: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M17 1H7a2 2 0 00-2 2v18a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2zm0 18H7V5h10v14zm-5-2l4-4h-3V8h-2v5H8z"/></svg>',
};

// ---------- 1) Every sheet fits on screen and scrolls (her iPhone: the long song menu ran under the status bar and couldn't scroll) ----------
const showSheetV24 = showSheet;
showSheet = function () { sheet.classList.remove("v25s"); const r = showSheetV24.apply(this, arguments); sheet.scrollTop = 0; return r; };
const closeSheetV24 = closeSheet;
closeSheet = function () { sheet.classList.remove("v25s"); return closeSheetV24.apply(this, arguments); };

// ---------- 2) Song menu, Apple Music style ----------
// Built from the buttons the existing menu chain made (so every handler — Telegram, phone downloads, playlists, info, card — keeps working),
// re-laid out: header, 4 quick actions, grouped rows with icons on the left, playback controls inline, Cancel pinned at the bottom.
const openTrackSheetV24 = openTrackSheet;
openTrackSheet = function (t, ctx, idx) {
  const r = openTrackSheetV24.apply(this, arguments);
  try { if (t && !(typeof isPod === "function" && isPod(t))) v25Menu(t, ctx); } catch (e) { console.warn("v25 menu", e); }
  return r;
};
function v25Menu(t, ctx) {
  if (sheet.classList.contains("hidden")) return;
  const grp = sheet.querySelector(".sgroup"); if (!grp || grp.classList.contains("cancel")) return;
  const btns = [...grp.querySelectorAll(":scope > button[data-s]")];
  const used = new Set(), take = k => { const b = btns.find(x => x.dataset.s === k && !used.has(x)); if (b) used.add(b); return b; };
  const img = grp.querySelector(".shead img"), art = img ? img.getAttribute("src") : "";
  const liked = isLiked(t.id), jam = typeof jamOn === "function" && jamOn();
  const qa = (k, ico, label, on) => `<button class="v25q${on ? " on" : ""}" data-s="${k}" data-notr><i>${ico}</i><span>${esc(label)}</span></button>`;
  const row = (k, ico, label, o = {}) => `<button class="v25r${o.cls ? " " + o.cls : ""}" data-s="${k}" data-notr><i class="v25i">${ico}</i><span class="v25l">${esc(label)}</span>${o.chev ? '<b class="v25c">›</b>' : ""}</button>`;
  let qh = "";
  if (take("next")) qh += qa("next", ICON.playNext, v25L("Play Next", "Next chalao", "अगला चलाएँ"));
  if (take("last")) qh += qa("last", ICON.queue, v25L("Play Last", "Last me", "आख़िर में"));
  if (take("like")) qh += qa("like", liked ? ICON.heart : ICON.heartO, liked ? v25L("Loved", "Liked", "पसंद है") : v25L("Love", "Love", "पसंद"), liked);
  if (take("share")) qh += qa("share", ICON.share, v25L("Share", "Share", "शेयर"));
  const sub = [t.artist, t.album && t.album !== t.title ? t.album : ""].filter(Boolean).join(" · ");
  const groups = [];
  const ar = take("artist"), al = take("album");
  if (ar || al) groups.push(row("v25aa", ar && al ? V25I.aa : ar ? V25I.person : V25I.aa, ar && al ? v25L("Artist & Album", "Artist & Album", "कलाकार और एल्बम") : ar ? v25L("Go to Artist", "Artist dekho", "कलाकार देखें") : v25L("Go to Album", "Album dekho", "एल्बम देखें"), { chev: 1 }));
  let g = "";
  if (take("radio")) g += row("radio", V25I.radio, v25L("Start Radio", "Radio shuru karo", "रेडियो शुरू करें"));
  if (take("v23info")) g += row("v23info", V25I.info, v25L("Song Info", "Song info", "गाने की जानकारी"), { chev: 1 });
  if (take("lyr")) g += row("lyr", V25I.lyr, v25L("Lyrics", "Lyrics", "बोल"));
  if (g) groups.push(g);
  g = "";
  if (take("addpl")) g += row("addpl", ICON.pl, v25L("Add to Playlist", "Playlist me daalo", "प्लेलिस्ट में जोड़ें"), { chev: 1 });
  const tail = [], danger = [];
  const KNOWN = { dl: [TGICON, () => v25L("Download to Telegram", "Telegram pe download", "टेलीग्राम पर डाउनलोड")], undl: [TGICON, () => v25L("Remove from Telegram", "Telegram se hatao", "टेलीग्राम से हटाएँ"), "danger"],
    off: [V25I.phone, () => v25L("Download to Phone", "Phone me download", "फ़ोन में डाउनलोड")], unoff: [V25I.phone, () => v25L("Remove from Phone", "Phone se hatao", "फ़ोन से हटाएँ"), "danger"],
    v23card: [V25I.card, () => v25L("Share Card", "Share card", "शेयर कार्ड")], rm: [ICON.trash, () => v25L("Remove from Playlist", "Playlist se hatao", "प्लेलिस्ट से हटाएँ"), "danger", 1],
    rmr: [ICON.trash, () => v25L("Remove from History", "History se hatao", "इतिहास से हटाएँ"), "danger", 1] };
  let speedB = null, bassB = null;
  for (const b of btns) {
    if (used.has(b)) continue; used.add(b); const k = b.dataset.s;
    if (k === "v23speed") { speedB = b; continue; }
    if (k === "v23bass") { bassB = b; continue; }
    const kn = KNOWN[k];
    if (kn) { (kn[3] ? danger : tail).push(row(k, kn[0], kn[1](), { cls: kn[2] || "" })); continue; }
    b.classList.add("v25r", "v25carry"); tail.push(b); // anything else (e.g. "Sending to Telegram… / Downloading 45%") moves over as-is, live labels intact
  }
  let pb = "";
  if (speedB || bassB) {
    const opts = [0.75, 1, 1.25, 1.5]; if (!opts.some(r => Math.abs(r - pbRate) < 0.001)) { opts.push(pbRate); opts.sort((a, b) => a - b); }
    if (speedB) pb += `<div class="v25pr${jam ? " off" : ""}"><i class="v25i">${V25I.speed}</i><span class="v25l" data-notr>${esc(v25L("Speed", "Speed", "स्पीड"))}</span><div class="v25seg">${opts.map(r => `<button data-s="v25rate" data-r="${r}" class="${!jam && Math.abs(r - pbRate) < 0.001 || jam && r === 1 ? "on" : ""}" data-notr>${rateLabel(r)}</button>`).join("")}</div></div>`;
    if (bassB) pb += `<div class="v25pr"><i class="v25i">${V25I.bass}</i><span class="v25l" data-notr>${esc(v25L("Bass Boost", "Bass Boost", "बेस बूस्ट"))}</span><button class="v25sw${bassOn() ? " on" : ""}" data-s="v25bass" role="switch" aria-checked="${bassOn()}" aria-label="Bass Boost"></button></div>`;
  }
  const cancel = sheet.querySelector(".sgroup.cancel");
  const wrap = document.createElement("div"); wrap.className = "v25m";
  wrap.innerHTML = `<div class="sgroup v25top"><div class="v25hd"><img src="${esc(art || "/icon-192.png")}" alt="" onerror="this.onerror=null;this.src='/icon-192.png'"><div class="v25ht"><div class="t1">${esc(t.title)}</div><div class="sub">${esc(sub)}</div></div></div>${qh ? `<div class="v25qa">${qh}</div>` : ""}</div>`
    + groups.map(x => `<div class="sgroup v25g">${x}</div>`).join("")
    + (g || tail.length ? `<div class="sgroup v25g v25tail">${g}</div>` : "")
    + (pb ? `<div class="sgroup v25g v25pbg">${pb}</div>` : "")
    + (danger.length ? `<div class="sgroup v25g">${danger.join("")}</div>` : "");
  const tg = wrap.querySelector(".v25tail");
  if (tg) for (const x of tail) { if (typeof x === "string") tg.insertAdjacentHTML("beforeend", x); else tg.appendChild(x); }
  sheet.innerHTML = ""; sheet.appendChild(wrap); if (cancel) sheet.appendChild(cancel);
  sheet.classList.add("v25s"); wrap.scrollTop = 0;
  const oc = sheet.onclick;
  sheet.onclick = e => {
    const b = e.target.closest("[data-s]"); const k = b && b.dataset.s;
    if (k === "v25aa") { closeSheet(); setTimeout(() => v25ArtistAlbum(t, !!ar, !!al), 40); return; }
    if (k === "v25rate") { if (jam) return toast(tr("Listen Together me speed 1× rehti hai")); setRate(+b.dataset.r); sheet.querySelectorAll("[data-s=v25rate]").forEach(x => x.classList.toggle("on", x === b)); return; }
    if (k === "v25bass") { bassToggle(); b.classList.toggle("on", bassOn()); b.setAttribute("aria-checked", String(bassOn())); return; }
    return oc && oc(e);
  };
}
// "View album and view artist ek karo": one row; with both, a small chooser (album first, then each artist)
function v25ArtistAlbum(t, hasAr, hasAl) {
  const names = hasAr ? artistNames(t.artist) : [];
  const goAl = () => { closeNP(); collOpen("als:" + t.id); }, goAr = n => { closeNP(); collOpen("arn:" + n); };
  if (hasAl && !names.length) return goAl();
  if (!hasAl && names.length === 1) return goAr(names[0]);
  showSheet(`<div class="sgroup v25g v25ch"><div class="shead"><div><div class="t1">${esc(t.title)}</div><div class="sub">${esc(v25L("Go to", "Kahan jaana hai?", "कहाँ जाएँ?"))}</div></div></div>
    ${hasAl ? `<button class="v25r" data-s="al" data-notr><i class="v25i">${V25I.aa}</i><span class="v25l">${esc(v25L("Album", "Album", "एल्बम"))}${t.album ? `<small>${esc(t.album)}</small>` : ""}</span><b class="v25c">›</b></button>` : ""}
    ${names.map((n, i) => `<button class="v25r" data-s="a" data-i="${i}" data-notr><i class="v25i">${V25I.person}</i><span class="v25l">${esc(v25L("Artist", "Artist", "कलाकार"))}<small>${esc(n)}</small></span><b class="v25c">›</b></button>`).join("")}</div>`, { al: goAl, a: b => goAr(names[+b.dataset.i]) });
}

// ---------- 3) Bass Boost / EQ never blocks a song ----------
// Web Audio only hears a source that is CORS-clean (same origin, our /api proxy, aac.saavncdn.com). Anything else is proxied or played plain.
// On iPhone an AudioContext made without a tap stays suspended = silence, so: one context reused across songs, created/resumed only on a tap,
// and a watchdog: if the routed song is silent (suspended context or CORS-zeroed output) for 5 s, it switches to the plain player at the same spot.
const v25Src = new WeakMap(); let v25NoEqId = "", v25InLoad = 0, v25Sil = 0, v25LastT = -1, v25NoteId = "";
const v25CorsOK = u => { u = String(u || ""); if (!u || /^(blob:|data:)/.test(u)) return true; if (u[0] === "/" && u[1] !== "/") return true; try { const x = new URL(u, location.href); return x.origin === location.origin || (x.protocol === "https:" && /(^|\.)aac\.saavncdn\.com$/.test(x.hostname)) || (!!v25Api && u.indexOf(v25Api + "/api/") === 0); } catch (e) { return false; } };
const v25Proxyable = u => { try { return /(^|\.)(saavncdn\.com|googlevideo\.com)$/.test(new URL(u).hostname); } catch (e) { return false; } };
function v25Note(why) {
  const t = queue[qi], id = t ? t.id : ""; if (v25NoteId === id) return; v25NoteId = id;
  toast(v25L("Bass Boost isn't available for this song — playing normally 🎵", "Bass Boost is gaane pe available nahi — normal chal raha hai 🎵", "इस गाने पर बेस बूस्ट उपलब्ध नहीं — सामान्य चल रहा है 🎵"), 3400);
  window.__v25.lastBypass = { why, id, at: Date.now() };
}
eqRoute = function () {
  const t = queue[qi];
  if (t && t.id !== v25NoEqId && v25NoEqId && !eqRouted) v25NoEqId = "";
  if (t && t.id === v25NoEqId) return false; // this song plays without Web Audio
  if (eqRouted && v25Src.has(audio)) { if (actx && actx.state !== "running") actx.resume().catch(() => {}); return true; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
  const gesture = !navigator.userActivation || navigator.userActivation.isActive;
  if (actx && actx.state === "closed") actx = null;
  if (!actx) {
    if (v25IOS && !gesture) return false; // made without a tap it would stay silent on iPhone: play plain until the next tap
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try { actx = new AC(); } catch (e) { actx = null; return false; }
    preGain = actx.createGain();
    eqNodes = EQF.map((f, i) => { const b = actx.createBiquadFilter(); b.type = eqType(i); b.frequency.value = f; b.Q.value = 1.1; return b; });
    analyser = actx.createAnalyser(); analyser.fftSize = 2048;
    let n = preGain; for (const b of eqNodes) { n.connect(b); n = b; } n.connect(analyser); analyser.connect(actx.destination);
  }
  if (actx.state !== "running") { actx.resume().catch(() => {}); if (v25IOS && !gesture) return false; }
  const cur = audio.getAttribute("src") || "";
  const hadSrc = !!cur && !/^blob:|^\//.test(cur) && audio.crossOrigin !== "anonymous";
  const was = !audio.paused, at = audio.currentTime;
  try { audio.crossOrigin = "anonymous"; const s = actx.createMediaElementSource(audio); s.connect(preGain); v25Src.set(audio, s); } catch (e) { console.warn("eq route", e); return false; }
  eqRouted = true; v25Sil = 0; eqApply();
  if (hadSrc && !v25InLoad && queue[qi] && mode === "audio") loadCurrent(was, at); // reload CORS-clean so the EQ can hear it
  return true;
};
function v25Swap() { // fresh plain <audio> (the routed one can't be un-routed); the AudioContext is kept for the next song
  const old = audio;
  const a = document.createElement("audio"); a.setAttribute("playsinline", ""); a.preload = "auto"; a.id = "audio";
  old.onerror = null; old.onplaying = null; try { old.pause(); old.removeAttribute("src"); old.load(); } catch (e) {}
  try { const s = v25Src.get(old); if (s) s.disconnect(); } catch (e) {}
  if (old.parentNode) old.replaceWith(a); else document.body.appendChild(a);
  audio = a; wireAudio(a); eqRouted = false; v25Sil = 0; v25LastT = -1;
  const t = queue[qi]; v25NoEqId = t ? t.id : "";
}
function v25Bypass(why) {
  if (!eqRouted) return;
  const was = !audio.paused && mode === "audio" && !userPaused, at = audio.currentTime;
  v25Swap();
  if (queue[qi] && mode === "audio") loadCurrent(was, at); else syncPlay();
  v25Note(why);
}
const loadCurrentV24 = loadCurrent;
loadCurrent = function () {
  const t = queue[qi]; if (t && v25NoEqId && t.id !== v25NoEqId) v25NoEqId = "";
  v25InLoad++; try { return loadCurrentV24.apply(this, arguments); } finally { v25InLoad--; }
};
const playUrlV24 = playUrl;
playUrl = function (t, url, my, autoplay, startAt, attempt) {
  try {
    if (eqRouted && url && !v25CorsOK(url)) {
      if (v25Proxyable(url)) url = v25Api + "/api/p?u=" + encodeURIComponent(url); // CORS pass-through: Bass Boost keeps working
      else { v25Swap(); v25Note("src"); } // unknown host: play it plain
    }
  } catch (e) {}
  return playUrlV24.call(this, t, url, my, autoplay, startAt, attempt);
};
if (typeof playYT === "function") { const playYTV24 = playYT; playYT = function () { if (eqOn) v25Note("yt"); return playYTV24.apply(this, arguments); }; }
["touchend", "click", "keydown"].forEach(ev => document.addEventListener(ev, () => { if (eqOn && actx && actx.state !== "running" && actx.state !== "closed") actx.resume().catch(() => {}); }, true));
const v25Buf = new Uint8Array(1024);
setInterval(() => {
  if (!eqRouted || mode !== "audio" || !audio || audio.paused || !analyser || !actx) { v25Sil = 0; v25LastT = -1; return; }
  const ct = audio.currentTime, adv = v25LastT >= 0 && ct > v25LastT + 0.2; v25LastT = ct;
  let bad = false;
  if (actx.state !== "running") { actx.resume().catch(() => {}); bad = audio.readyState >= 2 || adv; }
  else if (adv && ct > 1.5) { try { analyser.getByteTimeDomainData(v25Buf); bad = v25Buf.every(v => v === 128); } catch (e) {} }
  v25Sil = bad ? v25Sil + 1 : 0;
  if (v25Sil >= 5) v25Bypass(actx.state !== "running" ? "ctx" : "silent");
}, 1000);

// ---------- 4) Home header: "Powered by Guru" + gear inside the logo row ----------
function v25Home() {
  if (curTab !== "home" || subView) return;
  let bb = view.querySelector(":scope > .brandBar"); const h1 = view.querySelector(":scope > h1.hrow");
  if (!bb && h1) { h1.insertAdjacentHTML("beforebegin", `<div class="brandBar"><img src="/logo-h2.webp?v=23" alt="Dhun" width="90" height="36"></div>`); bb = view.querySelector(":scope > .brandBar"); } // the app had no logo row
  if (bb && h1 && !h1.classList.contains("v25pbh")) {
    const gear = h1.querySelector(".gear");
    bb.classList.add("v25bb"); if (gear && !bb.querySelector(".gear")) bb.appendChild(gear);
    h1.classList.add("v25pbh"); h1.setAttribute("data-notr", ""); h1.setAttribute("aria-label", "Powered by Guru");
    h1.innerHTML = `<span class="v25by">Powered by</span> <span class="v25guru">Guru</span>`;
  }
  v25PodHome();
}
// ---------- 5) Home: Continue listening (podcasts) + Recommended Podcasts 🎙️ ----------
function v25PodRec() {
  const rows = (podHome && podHome.rows) || []; const seen = new Set(), out = [];
  const pri = rows.filter(r => /hindi|india|q:/i.test((r.key || "") + " " + (r.title || ""))); const use = pri.length ? pri : rows;
  for (let i = 0; i < 20 && out.length < 14; i++) for (const r of use) { const s = r.items && r.items[i]; if (s && s.id && !seen.has(String(s.id))) { seen.add(String(s.id)); out.push(s); } }
  return out;
}
function v25PodHome() {
  if (curTab !== "home" || subView || typeof podHome === "undefined") return;
  if (!podHome && typeof podLoadHome === "function") podLoadHome();
  const rec = v25PodRec(); let cont = "";
  try { cont = podContHTML(); } catch (e) {}
  let h = "";
  if (cont) h += cont.replace(/<button class="podX"[^>]*>✕<\/button>/g, "").replace(/<h2>([^<]*)<\/h2>/, (m, x) => `<h2>🎙️ ${x}</h2>`);
  if (rec.length) h += `<h2>${esc(v25L("Recommended Podcasts 🎙️", "Recommended Podcasts 🎙️", "सुझाए गए पॉडकास्ट 🎙️"))} <a data-pod="home" data-notr>${esc(v25L("See All", "Sab dekho", "सभी देखें"))}</a></h2><div class="podCar">${rec.map(s => podTileHTML(s)).join("")}</div>`;
  let box = view.querySelector(":scope > .v25pod");
  if (!h) { if (box) box.remove(); return; }
  if (box && box.dataset.h === String(h.length) + (queue[qi] ? queue[qi].id : "")) return;
  if (!box) {
    box = document.createElement("div"); box.className = "v25pod";
    const shelves = [...view.querySelectorAll(":scope > h2")].filter(x => x.querySelector("a[data-q]"));
    const ref = shelves[1] || shelves[0] || null; // after the first music shelf, so music stays first
    if (ref) view.insertBefore(box, ref); else view.appendChild(box);
  }
  box.dataset.h = String(h.length) + (queue[qi] ? queue[qi].id : ""); box.innerHTML = h;
}
const renderHomeV24 = renderHome;
renderHome = function () { const r = renderHomeV24.apply(this, arguments); try { v25Home(); } catch (e) { console.warn("v25 home", e); } return r; };
if (typeof podRefresh === "function") { const podRefreshV24 = podRefresh; podRefresh = function () { const r = podRefreshV24.apply(this, arguments); try { if (curTab === "home" && !subView) v25PodHome(); } catch (e) {} return r; }; }
new MutationObserver(() => { if (curTab === "home" && !subView) { const h1 = view.querySelector(":scope > h1.hrow"); if (h1 && !h1.classList.contains("v25pbh")) v25Home(); } }).observe(view, { childList: true });
try { v25Home(); } catch (e) {}

// ---------- 6) Search: tap the search bar → recent searches drop down (even while results are showing) ----------
function v25HistShow() {
  const q = $("#q"), bar = view.querySelector(".searchBar"); if (!q || !bar || !searches.length) return v25HistHide();
  const s = searchState; if (!s.q && !(s.typing && q.value.trim())) return v25HistHide(); // empty page already lists them
  if (q.value.trim() && q.value.trim() !== s.q) return v25HistHide(); // typing: suggestions take over
  let box = bar.querySelector(".v25hist");
  const h = `<div class="v25hh"><b>${esc(tr("Recent Searches"))}</b><a data-v25h="clear">${esc(tr("Clear all"))}</a></div>${searches.slice(0, 8).map((x, i) => `<div class="v25hr"><button data-v25h="go" data-i="${i}">${ICON.clock}<span>${esc(x)}</span></button><button class="v25hx" data-v25h="rm" data-i="${i}" aria-label="Remove">✕</button></div>`).join("")}`;
  if (!box) { box = document.createElement("div"); box.className = "v25hist"; bar.appendChild(box); }
  box.innerHTML = h;
}
function v25HistHide() { const b = view.querySelector(".v25hist"); if (b) b.remove(); }
view.addEventListener("focusin", e => { if (e.target && e.target.id === "q") v25HistShow(); });
view.addEventListener("input", e => { if (e.target && e.target.id === "q") { if (!e.target.value.trim() || e.target.value.trim() === searchState.q) v25HistShow(); else v25HistHide(); } });
view.addEventListener("focusout", e => { if (e.target && e.target.id === "q") setTimeout(() => { if (document.activeElement && document.activeElement.id === "q") return; v25HistHide(); }, 350); });
view.addEventListener("pointerdown", e => { if (e.target.closest(".v25hist")) e.preventDefault(); }, true); // keep the keyboard/focus while tapping a row
view.addEventListener("click", e => {
  const b = e.target.closest("[data-v25h]"); if (!b) return; e.preventDefault(); e.stopPropagation();
  const k = b.dataset.v25h, i = +b.dataset.i;
  if (k === "go") { const x = searches[i]; v25HistHide(); const q = $("#q"); if (q) q.blur(); if (x) doSearch(x); return; }
  if (k === "rm") { searches.splice(i, 1); store.set("searches", searches); return searches.length ? v25HistShow() : v25HistHide(); }
  if (k === "clear") { searches = []; store.set("searches", searches); v25HistHide(); if (!searchState.q) renderSearchBody(); }
}, true);

window.__v25 = { _ctx: () => actx, _play: url => playUrl(queue[qi], url, loadToken, true, 0, 0), menu: v25Menu, corsOK: v25CorsOK, bypass: v25Bypass, home: v25Home, podRec: v25PodRec, hist: v25HistShow, st: () => ({ eqOn, eqRouted, ctx: actx && actx.state, noEq: v25NoEqId, sil: v25Sil, src: audio && audio.getAttribute("src"), co: audio && audio.crossOrigin }) };

// ---------- v26: header variant D (approved by owner) — no title line; tiny "DHUN · BY GURU" caption inside the greeting card ----------
function hdrD(view) {
  if (curTab !== "home" || subView) return;
  const h1 = view.querySelector(":scope > h1.hrow.v25pbh");
  if (h1) { if (h1.textContent !== "Dhun") h1.textContent = "Dhun"; if (h1.getAttribute("aria-label") !== "Dhun") h1.setAttribute("aria-label", "Dhun"); } // 0-height anchor so the compact top bar reads "Dhun" when scrolled
  const g = view.querySelector("[data-greet]"); if (!g || g.querySelector(".hdrCap")) return;
  g.insertAdjacentHTML("afterbegin", '<span class="hdrCap" data-notr>Dhun · by <em>Guru</em></span>');
}
// greetPaint() only rewrites <b> and <small>, so the caption survives repaints.
const renderHomeHdrD = renderHome;
renderHome = function () { const r = renderHomeHdrD.apply(this, arguments); try { hdrD(view); } catch (e) {} return r; };
new MutationObserver(() => { if (curTab === "home" && !subView) try { hdrD(view); } catch (e) {} }).observe(view, { childList: true });
try { hdrD(view); } catch (e) {}
// v26: repaint the greeting once Telegram answers, so the real first name shows without waiting for the next Home render
if (typeof tgRefresh === "function") { const tgRefreshV26 = tgRefresh; tgRefresh = async function () { const r = await tgRefreshV26.apply(this, arguments); try { greetPaint(); } catch (e) {} return r; }; }
window.__v26 = { hdr: () => hdrD(view) };

})();
