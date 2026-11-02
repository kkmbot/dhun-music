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
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200); }
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
  let h = `<div class="brandBar"><img src="/logo-h.webp?v=16" alt="Dhun" width="104" height="48"></div><h1 class="hrow">Listen Now<button class="icon gear" data-act="settings" aria-label="Settings">${ICON.gear}</button></h1>${installCard()}${dealsHomeHTML()}${fyHomeHTML()}`;
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
  ${footHTML()}<div class="verTag">v1.0.1 · web</div>`;
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
})();
