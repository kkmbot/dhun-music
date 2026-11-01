
// Music PWA backend. PRIMARY: JioSaavn (direct AAC files, 320 kbps). FALLBACK: YouTube Music search + Invidious/Piped/iframe.
const YTM = "https://music.youtube.com/youtubei/v1/";
const YTM_CTX = { client: { clientName: "WEB_REMIX", clientVersion: "1.20250310.01.00", hl: "en", gl: "IN" } };
const SONGS = "EgWKAQIIAWoKEAkQBRAKEAMQBA%3D%3D", VIDEOS = "EgWKAQIQAWoKEAkQChAFEAMQBA%3D%3D";
const INV_FIXED = ["https://yt.chocolatemoo53.com","https://invidious.materialio.us","https://inv.nadeko.net","https://invidious.nerdvpn.de","https://yewtu.be","https://invidious.tiekoetter.com","https://invidious.f5.si","https://invidious.ducks.party","https://inv.perditum.com","https://iv.melmac.space","https://invidious.privacyredirect.com","https://invidious.reallyaweso.me"];
const PIPED = ["https://pipedapi.ducks.party","https://api.piped.private.coffee","https://pipedapi.kavin.rocks","https://pipedapi.adminforge.de","https://pipedapi.reallyaweso.me","https://pipedapi.leptons.xyz","https://pipedapi.drgns.space","https://pipedapi.nosebs.ru"];
const J = (o, s = 200, maxAge = 0) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": maxAge ? `public, max-age=${maxAge}` : "no-store", "access-control-allow-origin": "*" } });
const tfetch = (url, opt = {}, ms = 6000) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return fetch(url, { ...opt, signal: c.signal }).finally(() => clearTimeout(t)); };
const txt = r => (r?.runs || []).map(x => x.text).join("") || r?.simpleText || "";
const big = u => u ? u.replace(/=w\d+-h\d+.*$/, "=w544-h544-l90-rj").replace(/\/(default|mqdefault|sddefault)\.jpg/, "/hqdefault.jpg") : u;
function walk(o, key, acc = []) { if (o && typeof o === "object") { if (Array.isArray(o)) { for (const v of o) walk(v, key, acc); } else for (const k in o) { if (k === key) acc.push(o[k]); walk(o[k], key, acc); } } return acc; }
const durSec = s => s ? s.split(":").reduce((a, b) => a * 60 + (+b || 0), 0) : 0;

async function ytm(ep, body) {
  const r = await tfetch(YTM + ep + "?prettyPrint=false", { method: "POST", headers: { "content-type": "application/json", origin: "https://music.youtube.com", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15" }, body: JSON.stringify({ context: YTM_CTX, ...body }) }, 8000);
  if (!r.ok) throw new Error("ytm " + r.status);
  return r.json();
}
function parseListItem(it) {
  const id = it.playlistItemData?.videoId || walk(it, "watchEndpoint")[0]?.videoId;
  if (!id) return null;
  const cols = (it.flexColumns || []).map(c => c.musicResponsiveListItemFlexColumnRenderer?.text);
  const title = txt(cols[0]);
  const parts = txt(cols[1]).split(" • ");
  let artist = parts[0] || "", album = "", dur = "";
  if (/^(Song|Video)$/.test(artist)) parts.shift(), artist = parts[0] || "";
  for (const p of parts.slice(1)) { if (/^\d+:\d\d(:\d\d)?$/.test(p)) dur = p; else if (!/views|plays/.test(p) && !album) album = p; }
  const th = it.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
  const fixed = (it.fixedColumns || []).map(c => txt(c.musicResponsiveListItemFixedColumnRenderer?.text)).find(t => /^\d+:\d\d/.test(t));
  dur = dur || fixed || "";
  return { id, title, artist, album, dur: durSec(dur), thumb: big(th[th.length - 1]?.url) || `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
}
async function searchYTM(q, kind) {
  const j = await ytm("search", { query: q, params: kind === "videos" ? VIDEOS : SONGS });
  return walk(j, "musicResponsiveListItemRenderer").map(parseListItem).filter(Boolean);
}
const MEM = new Map();
const memGet = k => { const e = MEM.get(k); return e && e.exp > Date.now() ? e.v : null; };
const memSet = (k, v, sec) => { MEM.set(k, { v, exp: Date.now() + sec * 1000 }); if (MEM.size > 500) MEM.delete(MEM.keys().next().value); };
async function invList() {
  const hit = memGet("invlist"); if (hit) return hit;
  let list = [];
  try { const j = await (await tfetch("https://api.invidious.io/instances.json?sort_by=health", {}, 5000)).json(); list = j.filter(i => i[1].type === "https" && i[1].api !== false).map(i => i[1].uri); } catch (e) {}
  list = [...new Set([...INV_FIXED, ...list])];
  memSet("invlist", list, 3600);
  return list;
}
async function searchFallback(q) {
  const inv = await invList();
  const tries = [
    ...inv.map(b => tfetch(`${b}/api/v1/search?q=${encodeURIComponent(q)}&type=video`, {}, 7000).then(r => r.ok ? r.json() : Promise.reject()).then(a => { if (!Array.isArray(a) || !a.length) throw 0; return a.filter(x => x.type === "video").map(x => ({ id: x.videoId, title: x.title, artist: (x.author || "").replace(/ - Topic$/, ""), album: "", dur: x.lengthSeconds || 0, thumb: `https://i.ytimg.com/vi/${x.videoId}/hqdefault.jpg` })); })),
    ...PIPED.map(b => tfetch(`${b}/search?q=${encodeURIComponent(q)}&filter=music_songs`, {}, 7000).then(r => r.ok ? r.json() : Promise.reject()).then(j => { const a = (j.items || []).filter(x => x.url?.includes("watch")); if (!a.length) throw 0; return a.map(x => { const id = x.url.split("v=")[1]; return { id, title: x.title, artist: (x.uploaderName || "").replace(/ - Topic$/, ""), album: "", dur: x.duration || 0, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }; }); }))
  ];
  return Promise.any(tries);
}
async function probeInv(b, v) {
  const t0 = Date.now();
  const r = await tfetch(`${b}/api/v1/videos/${v}?fields=adaptiveFormats,title&local=true`, {}, 7000);
  if (!r.ok) throw new Error(b + " " + r.status);
  const j = await r.json();
  const a = (j.adaptiveFormats || []).filter(f => (f.type || "").startsWith("audio/mp4"));
  if (!a.length) throw new Error(b + " no audio");
  const f = a.find(x => x.itag == "140") || a[a.length - 1];
  return { url: `${b}/latest_version?id=${v}&itag=${f.itag}&local=true`, via: new URL(b).host, ms: Date.now() - t0 };
}
async function probePiped(b, v) {
  const t0 = Date.now();
  const r = await tfetch(`${b}/streams/${v}`, {}, 8000);
  if (!r.ok) throw new Error(b + " " + r.status);
  const j = await r.json();
  const a = (j.audioStreams || []).filter(s => (s.mimeType || "").includes("mp4")).sort((x, y) => y.bitrate - x.bitrate);
  if (!a.length) throw new Error(b + " no audio");
  return { url: a[0].url, via: new URL(b).host, ms: Date.now() - t0 };
}
async function sources(v) {
  const hit = memGet("src" + v); if (hit) return hit;
  const inv = await invList();
  const ps = [...inv.map(b => probeInv(b, v)), ...PIPED.map(b => probePiped(b, v))];
  // wait for first success, then give stragglers a short grace window
  const out = [];
  const tagged = ps.map(p => p.then(x => { out.push(x); return x; }));
  try { await Promise.any(tagged); } catch (e) { return []; }
  await Promise.race([Promise.allSettled(tagged), new Promise(r => setTimeout(r, 1200))]);
  out.sort((a, b) => a.ms - b.ms);
  memSet("src" + v, out, 1800);
  return out;
}
async function radio(v) {
  const j = await ytm("next", { videoId: v, playlistId: "RDAMVM" + v, isAudioOnly: true });
  return walk(j, "playlistPanelVideoRenderer").map(p => {
    const th = p.thumbnail?.thumbnails || [];
    const parts = txt(p.longBylineText).split(" • ");
    return { id: p.videoId, title: txt(p.title), artist: parts[0] || txt(p.shortBylineText), album: parts.length > 2 ? parts[1] : "", dur: durSec(txt(p.lengthText)), thumb: big(th[th.length - 1]?.url) || `https://i.ytimg.com/vi/${p.videoId}/hqdefault.jpg` };
  }).filter(x => x.id);
}
async function suggest(q) {
  const j = await ytm("music/get_search_suggestions", { input: q });
  return walk(j, "searchSuggestionRenderer").map(s => txt(s.suggestion)).filter(Boolean).slice(0, 8);
}

// Minimal DES-ECB decrypt (JioSaavn media URL obfuscation; key "38346591").
const DES = (() => {
  const PC1=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
  const PC2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
  const SH=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
  const IP=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
  const FP=[40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
  const E=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
  const P=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
  const S=[
  [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
  [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
  [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
  [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
  [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
  [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
  [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
  [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]];
  const bits = (bytes) => { const b = []; for (const x of bytes) for (let i = 7; i >= 0; i--) b.push((x >> i) & 1); return b; };
  const perm = (b, t) => t.map(i => b[i - 1]);
  function keys(key) {
    const k = perm(bits(key), PC1); let C = k.slice(0, 28), D = k.slice(28); const out = [];
    for (let r = 0; r < 16; r++) { for (let s = 0; s < SH[r]; s++) { C.push(C.shift()); D.push(D.shift()); } out.push(perm(C.concat(D), PC2)); }
    return out;
  }
  function block(b64, ks) {
    let b = perm(b64, IP), L = b.slice(0, 32), R = b.slice(32);
    for (let r = 0; r < 16; r++) {
      const x = perm(R, E).map((v, i) => v ^ ks[r][i]); const f = [];
      for (let s = 0; s < 8; s++) { const c = x.slice(s * 6, s * 6 + 6); const row = (c[0] << 1) | c[5], col = (c[1] << 3) | (c[2] << 2) | (c[3] << 1) | c[4]; const v = S[s][row * 16 + col]; f.push((v >> 3) & 1, (v >> 2) & 1, (v >> 1) & 1, v & 1); }
      const pf = perm(f, P); const nR = L.map((v, i) => v ^ pf[i]); L = R; R = nR;
    }
    return perm(R.concat(L), FP);
  }
  const KS = keys(new TextEncoder().encode("38346591")).reverse();
  return function decrypt(b64) {
    const bin = atob(b64); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const out = [];
    for (let o = 0; o + 8 <= bytes.length; o += 8) { const bb = block(bits(bytes.slice(o, o + 8)), KS); for (let i = 0; i < 8; i++) { let v = 0; for (let j = 0; j < 8; j++) v = (v << 1) | bb[i * 8 + j]; out.push(v); } }
    const pad = out[out.length - 1]; if (pad > 0 && pad <= 8) out.length -= pad;
    return new TextDecoder().decode(new Uint8Array(out));
  };
})();

const INDIA_IP = "49.36.0.1"; // JioSaavn shows its full India catalogue (international labels included) for Indian addresses
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
async function sv(call, params = {}, ctx = "web6dot0") {
  const u = new URL("https://www.jiosaavn.com/api.php");
  for (const [k, v] of Object.entries({ __call: call, _format: "json", _marker: "0", api_version: "4", ctx, ...params })) u.searchParams.set(k, v);
  const r = await tfetch(u.toString(), { headers: { "user-agent": UA, accept: "application/json", "x-forwarded-for": INDIA_IP, cookie: "L=hindi%2Cenglish%2Cpunjabi; DL=english; gdpr_acceptance=true" } }, 8000);
  if (!r.ok) throw new Error("saavn " + r.status);
  const t = await r.text(); const i = t.search(/[\[{]/);
  return JSON.parse(i > 0 ? t.slice(i) : t);
}
const ent = s => { let o = String(s ?? ""); for (let k = 0; k < 2; k++) o = o.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"); return o; };
function svTrack(x) {
  if (!x || (x.type && x.type !== "song")) return null;
  const m = x.more_info || {}; const enc = m.encrypted_media_url; if (!enc) return null;
  let url = ""; try { url = DES(enc); } catch (e) {}
  if (!/^https:\/\//.test(url)) return null;
  url = url.replace(/^https:\/\/[^/]+/, "https://aac.saavncdn.com").replace(/_96(_p)?\.mp4/, m["320kbps"] === "true" ? "_320.mp4" : "_160.mp4");
  const pa = (m.artistMap?.primary_artists || []).map(a => ent(a.name));
  const sub = ent(x.subtitle || "").split(" - ")[0];
  return { id: x.id, src: "saavn", title: ent(x.title || x.song), artist: pa.slice(0, 3).join(", ") || sub, album: ent(m.album || ""), dur: +m.duration || 0, thumb: (x.image || "").replace(/(150x150|50x50)/, "500x500"), url, lang: x.language || "" };
}
const svList = a => (a || []).map(svTrack).filter(Boolean);
async function svSearch(q, n = 40) { const j = await sv("search.getResults", { q, n: String(n), p: "1" }); return svList(j.results); }
async function svPlaylistByQuery(q, n = 25) {
  const pr = await sv("search.getPlaylistResults", { q, n: "3", p: "1" });
  for (const pl of (pr.results || []).slice(0, 2)) {
    try { const d = await sv("playlist.getDetails", { listid: pl.id, n: String(n), p: "1" }); const items = svList(d.list); if (items.length >= 6) return items; } catch (e) {}
  }
  return svSearch(q, n);
}
async function svTrending() { const j = await sv("content.getTrending", { entity_type: "song", entity_language: "hindi" }); return svList(Array.isArray(j) ? j : j.data); }
async function svSong(id) { const j = await sv("song.getDetails", { pids: id }); const x = j.songs ? j.songs[0] : j[id]; return svTrack(x); }
async function svRadio(id, artist, lang) {
  let items = [];
  try { const r = await sv("reco.getreco", { pid: id }); items = svList(Array.isArray(r) ? r : []); } catch (e) {}
  if (items.length < 5 && artist) { try { items = items.concat(await svSearch(artist.split(",")[0].trim(), 30)); } catch (e) {} }
  if (items.length < 5) { try { items = items.concat(await svTrending()); } catch (e) {} }
  const seen = new Set([id]); return items.filter(t => !seen.has(t.id) && seen.add(t.id));
}
async function svSuggest(q) {
  const j = await sv("autocomplete.get", { query: q });
  const out = [];
  for (const sec of ["topquery", "songs", "artists", "albums"]) for (const x of (j[sec]?.data || [])) { const t = ent(x.title); if (t && !out.includes(t)) out.push(t); }
  return out.slice(0, 8);
}
const SHELVES = [["Trending Now", "trending", ""], ["Trending Bollywood", "pl", "Now Trending"], ["Arijit Singh", "search", "arijit singh"], ["Romantic Hindi", "pl", "romantic hindi"], ["Punjabi Hits", "pl", "punjabi hit songs"], ["Lofi & Chill", "pl", "lofi india hits"], ["90s Bollywood", "pl", "90s romance hindi"], ["Devotional", "pl", "bhakti bhajan"], ["Global Hits", "pl", "top english songs"]];


// ---------- Telegram downloads: each song goes to the user's own DM with the bot; a private storage group is the shared file cache. ----------
// All secrets and IDs come from environment variables (see .env.example and README). Nothing secret is hard-coded here,
// and none of these values are ever sent to the browser.
let TG_TOKEN = "", TG_GROUP = 0, TG_ADMIN = 0, TG_BOT = "", HOOK_SECRET = "", SITE = "/", TG = "", TG_FILE = "";
function loadConfig(env, req) {
  SUPPORT_TG = String(env.SUPPORT_TG || "Memer_guru").replace(/^@/, "");
  TG_TOKEN = String(env.BOT_TOKEN || "");
  TG_GROUP = Number(env.STORAGE_CHAT_ID || 0);
  TG_ADMIN = Number(env.ADMIN_ID || 0);
  TG_BOT = String(env.BOT_USERNAME || "").replace(/^@/, "");
  HOOK_SECRET = String(env.WEBHOOK_SECRET || "");
  SITE = String(env.PUBLIC_URL || (req ? new URL(req.url).origin + "/" : "/")).replace(/\/?$/, "/");
  TG = "https://api.telegram.org/bot" + TG_TOKEN + "/";
  TG_FILE = "https://api.telegram.org/file/bot" + TG_TOKEN + "/";
}
const TG_MAX = 20 * 1024 * 1024 - 64 * 1024; // bot API getFile limit is 20 MB; stay under it so songs also stream back in the app
const scrub = s => TG_TOKEN ? String(s ?? "").split(TG_TOKEN).join("***") : String(s ?? "");
async function tg(method, body, isForm) {
  const r = await fetch(TG + method, isForm ? { method: "POST", body } : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) });
  let j = null; try { j = await r.json(); } catch (e) { throw new Error("telegram " + r.status); }
  if (!j.ok) { const e = new Error("telegram: " + scrub(j.description || r.status)); e.code = j.error_code; throw e; }
  return j.result;
}
let dbReady = null;
function db(env) {
  if (!env.DB) throw new Error("library store missing");
  if (!dbReady) dbReady = env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS files (sid TEXT, q TEXT, file_id TEXT, mid INTEGER, title TEXT, artist TEXT, album TEXT, dur INTEGER, thumb TEXT, bytes INTEGER, at INTEGER, PRIMARY KEY (sid, q))"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS users (code TEXT PRIMARY KEY, chat_id INTEGER, username TEXT, name TEXT, created INTEGER, linked INTEGER)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS dls (chat_id INTEGER, id TEXT, sid TEXT, q TEXT, file_id TEXT, dm_mid INTEGER, title TEXT, artist TEXT, album TEXT, dur INTEGER, thumb TEXT, bytes INTEGER, at INTEGER, PRIMARY KEY (chat_id, id))"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS ev (kind TEXT, at INTEGER)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS people (chat_id INTEGER PRIMARY KEY, username TEXT, name TEXT, first_at INTEGER, last_seen INTEGER, blocked INTEGER DEFAULT 0, connected INTEGER DEFAULT 0)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS udata (chat_id INTEGER PRIMARY KEY, liked TEXT, playlists TEXT, recent TEXT, rev INTEGER DEFAULT 0, at INTEGER)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS dlog (chat_id INTEGER, sid TEXT, title TEXT, artist TEXT, at INTEGER)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS bcast (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, text TEXT, from_chat INTEGER, msg_id INTEGER, status TEXT, total INTEGER DEFAULT 0, sent INTEGER DEFAULT 0, failed INTEGER DEFAULT 0, blocked INTEGER DEFAULT 0, lease INTEGER DEFAULT 0, created INTEGER, done_at INTEGER)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS logm (minute INTEGER PRIMARY KEY, n INTEGER DEFAULT 0, dropped INTEGER DEFAULT 0)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS bq (bid INTEGER, chat_id INTEGER, state INTEGER DEFAULT 0, PRIMARY KEY (bid, chat_id))"),
    env.DB.prepare("INSERT OR IGNORE INTO people (chat_id, username, name, first_at, last_seen, blocked, connected) SELECT chat_id, MAX(username), MAX(name), MIN(COALESCE(NULLIF(linked,0), created)), MAX(COALESCE(NULLIF(linked,0), created)), 0, 1 FROM users WHERE chat_id IS NOT NULL AND chat_id > 0 GROUP BY chat_id"),
    env.DB.prepare("INSERT INTO dlog (chat_id, sid, title, artist, at) SELECT chat_id, sid, title, artist, at FROM dls WHERE NOT EXISTS (SELECT 1 FROM dlog)"),
  ]).catch(e => { dbReady = null; throw e; });
  return dbReady.then(() => env.DB);
}
async function evCount(d, kind, sinceMs) { const r = await d.prepare("SELECT COUNT(*) AS n FROM ev WHERE kind = ? AND at > ?").bind(kind, Date.now() - sinceMs).first(); return r ? r.n : 0; }
async function evAdd(d, kind) { await d.prepare("INSERT INTO ev (kind, at) VALUES (?, ?)").bind(kind, Date.now()).run(); if (Math.random() < 0.05) await d.prepare("DELETE FROM ev WHERE at < ?").bind(Date.now() - 3 * 86400e3).run(); }

// ---------- logs channel: fire-and-forget, throttled; a log can never block or break the user action ----------
// optional: Telegram channel/group id for logs (bot must be admin there and allowed to post); empty = logging off
const logCh = env => String((env && env.LOG_CHANNEL_ID) || "").trim();
const LOG_PER_MIN = 20;
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cut = (s, n) => { s = String(s ?? ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const hm = (ms = Date.now()) => new Date(ms + 5.5 * 3600e3).toISOString().slice(11, 16) + " IST";
const who = x => { x = x || {}; const id = x.chat_id || x.id; const nm = cut(x.name || [x.first_name, x.last_name].filter(Boolean).join(" "), 50); return `${id ? `<a href="tg://user?id=${id}">${esc(nm || "user")}</a>` : esc(nm || "?")}${x.username ? " @" + esc(x.username) : ""}${id ? ` · <code>${id}</code>` : ""}`; };
async function kvGet(d, k) { const r = await d.prepare("SELECT v FROM kv WHERE k = ?").bind(k).first(); return r ? r.v : null; }
async function kvSet(d, k, v) { await d.prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(k, String(v)).run(); }
async function logSend(env, html, opt = {}) {
  const ch = logCh(env); if (!ch) return { skipped: "no log channel" };
  const d = await db(env); const now = Date.now(), min = Math.floor(now / 60e3);
  if (opt.dedupe) { // same kind of error at most once per window
    const g = await d.prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v WHERE CAST(kv.v AS INTEGER) < ?").bind("dd:" + opt.dedupe, String(now), now - (opt.every || 600e3)).run();
    if (!g.meta || !g.meta.changes) return { deduped: true };
  }
  await d.prepare("INSERT INTO logm (minute, n, dropped) VALUES (?, 1, 0) ON CONFLICT(minute) DO UPDATE SET n = logm.n + 1").bind(min).run();
  if (!opt.force) {
    const row = await d.prepare("SELECT n FROM logm WHERE minute = ?").bind(min).first();
    if (((row && row.n) || 0) > LOG_PER_MIN) { await d.prepare("UPDATE logm SET dropped = dropped + 1 WHERE minute = ?").bind(min).run(); return { throttled: true }; }
  }
  let extra = "";
  const old = await d.prepare("SELECT SUM(dropped) AS s FROM logm WHERE minute < ? AND dropped > 0").bind(min).first();
  if (old && old.s > 0) { const cl = await d.prepare("UPDATE logm SET dropped = 0 WHERE minute < ? AND dropped > 0").bind(min).run(); if (cl.meta && cl.meta.changes) extra = `\n\n<i>➕ ${old.s} aur log skip hue (limit ${LOG_PER_MIN}/min)</i>`; }
  if (Math.random() < 0.03) await d.prepare("DELETE FROM logm WHERE minute < ? AND dropped = 0").bind(min - 3 * 1440).run().catch(() => {});
  const text = cut(html, 3900) + extra;
  let m;
  try { m = await tg("sendMessage", { chat_id: ch, text, parse_mode: "HTML", disable_web_page_preview: true, disable_notification: !!opt.silent }); }
  catch (e) {
    if (e.code === 400 && /parse|entit/i.test(e.message)) { m = await tg("sendMessage", { chat_id: ch, text: text.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"), disable_web_page_preview: true }); }
    else { await kvSet(d, "log_err", JSON.stringify({ at: now, e: scrub(e.message).slice(0, 200) })).catch(() => {}); throw e; }
  }
  await kvSet(d, "log_ok", JSON.stringify({ at: now, mid: m.message_id, title: (m.chat && m.chat.title) || "" })).catch(() => {});
  return { ok: true, message_id: m.message_id };
}
// ctx.test (simulations) marks the line as a test; ctx.collect gathers the promise so a test can read the message id
function logEv(env, ctx, html, opt) {
  const p = (async () => {
    return logSend(env, (ctx && ctx.test ? "🧪 <b>TEST</b> · " : "") + html, opt);
  })().catch(e => ({ error: scrub(e && e.message || e) }));
  if (ctx && ctx.collect) ctx.collect.push(p); else if (ctx && ctx.waitUntil) ctx.waitUntil(p);
  return p;
}
const logNewUser = (env, ctx, from, how) => logEv(env, ctx, `👤 <b>New user</b> · ${how}\n${who(from)}\n🕒 ${istDate(Date.now())} ${hm()}`);
async function logStatus(env) {
  const ch = logCh(env); if (!ch) return "📝 Logs channel: set nahi hai";
  let line = "";
  try { const c = memGet("logchat") || await tg("getChat", { chat_id: ch }); memSet("logchat", c, 600); line = `📝 Logs channel: ✅ ${c.title || ch}`; }
  catch (e) { line = `📝 Logs channel: ❌ ${scrub(e.message).slice(0, 120)}`; }
  try {
    const d = await db(env);
    const today = ((await d.prepare("SELECT SUM(n) AS s FROM logm WHERE minute >= ?").bind(Math.floor(dayStart() / 60e3)).first()) || {}).s || 0;
    const ok = JSON.parse((await kvGet(d, "log_ok")) || "null"), er = JSON.parse((await kvGet(d, "log_err")) || "null");
    line += `\n    aaj ${today} log${today === 1 ? "" : "s"}` + (ok ? ` · last ok ${hm(ok.at)}` : "") + (er && (!ok || er.at > ok.at) ? `\n    ⚠️ last error ${hm(er.at)}: ${er.e}` : "");
  } catch (e) {}
  return line;
}
const dlOut = r => ({ id: r.id, sid: r.sid, title: r.title, artist: r.artist, album: r.album, dur: r.dur, thumb: r.thumb, q: r.q, bytes: r.bytes, at: r.at, src: "saavn", tgmid: r.dm_mid });
async function headLen(url) { try { const r = await fetch(url, { method: "HEAD", headers: { "user-agent": UA } }); if (!r.ok) return -1; return +r.headers.get("content-length") || 0; } catch (e) { return -1; } }
async function userOf(d, code, ctx) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(code || "")) return null;
  const u = await d.prepare("SELECT u.*, p.last_seen AS seen FROM users u LEFT JOIN people p ON p.chat_id = u.chat_id WHERE u.code = ?").bind(code).first();
  if (u && u.chat_id && u.linked && (!u.seen || Date.now() - u.seen > 600e3)) { const w = d.prepare("UPDATE people SET last_seen = ? WHERE chat_id = ?").bind(Date.now(), u.chat_id).run().catch(() => {}); if (ctx) ctx.waitUntil(w); else await w; }
  return u;
}
// ---------- Telegram display names (first name + @username), cached per user; refreshed from each bot message and, for users stored before names were kept, from getChat (server-side only) ----------
async function nameGet(d, chatId) { try { const r = await d.prepare("SELECT v FROM kv WHERE k = ?").bind("tgn:" + chatId).first(); return r ? JSON.parse(r.v) : null; } catch (e) { return null; } }
async function namePut(d, chatId, f) {
  const n = { first: String(f.first_name || "").slice(0, 60), last: String(f.last_name || "").slice(0, 60), username: String(f.username || ""), at: Date.now() };
  const full = [n.first, n.last].filter(Boolean).join(" ").slice(0, 60);
  await d.batch([
    d.prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind("tgn:" + chatId, JSON.stringify(n)),
    d.prepare("UPDATE users SET username = ?, name = ? WHERE chat_id = ?").bind(n.username, full, chatId),
    d.prepare("UPDATE people SET username = ?, name = ? WHERE chat_id = ?").bind(n.username, full, chatId),
  ]);
  return n;
}
async function nameFetch(d, chatId) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 3500);
  try { const r = await fetch(TG + "getChat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chatId }), signal: ac.signal }); const j = await r.json(); if (!j.ok || !j.result) return null; return await namePut(d, chatId, j.result); }
  catch (e) { return null; } finally { clearTimeout(t); }
}
async function nameOf(d, u, ctx) { // -> { first, username } for a linked user
  if (!u || !u.chat_id || !u.linked) return null;
  let n = await nameGet(d, u.chat_id);
  if (!n) n = await nameFetch(d, u.chat_id); // backfill once, inline, for users stored before names were kept
  else if (Date.now() - (n.at || 0) > 12 * 3600e3 && ctx) ctx.waitUntil(nameFetch(d, u.chat_id)); // keep it fresh in the background
  return n || { first: String(u.name || "").split(/\s+/)[0], username: u.username || "" };
}
async function personSeen(d, from, connected) {
  if (!from || !from.id || from.id < 0) return;
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ").slice(0, 60), now = Date.now();
  const was = await d.prepare("SELECT connected, blocked FROM people WHERE chat_id = ?").bind(from.id).first();
  if (from.first_name || from.username) await d.prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind("tgn:" + from.id, JSON.stringify({ first: String(from.first_name || "").slice(0, 60), last: String(from.last_name || "").slice(0, 60), username: String(from.username || ""), at: now })).run().catch(() => {});
  await d.prepare("INSERT INTO people (chat_id, username, name, first_at, last_seen, blocked, connected) VALUES (?, ?, ?, ?, ?, 0, ?) ON CONFLICT(chat_id) DO UPDATE SET username = excluded.username, name = excluded.name, last_seen = excluded.last_seen, blocked = 0, connected = MAX(people.connected, excluded.connected)").bind(from.id, from.username || "", name, now, now, connected ? 1 : 0).run();
  return { isNew: !was, wasConnected: !!(was && was.connected), wasBlocked: !!(was && was.blocked) };
}
const markBlocked = (d, chatId) => d.prepare("UPDATE people SET blocked = 1 WHERE chat_id = ?").bind(chatId).run().catch(() => {});
const cleanName = s => String(s || "").replace(/[\\/:*?"<>|]/g, " ").slice(0, 80).trim();
// Upload once to the storage group; every later download by anyone reuses the file_id.
async function cachedFile(d, sid, want) {
  const order = ["320", "160", "96", "48"].filter(q => +q <= +want);
  const hit = await d.prepare(`SELECT * FROM files WHERE sid = ? AND q IN (${order.map(() => "?").join(",")}) ORDER BY CAST(q AS INTEGER) DESC LIMIT 1`).bind(sid, ...order).first();
  if (hit && hit.q === order[0]) return hit;
  const t = await svSong(sid); if (!t || !t.url) { if (hit) return hit; const e = new Error("Song not found"); e.http = 404; throw e; }
  let buf = null, used = "";
  for (const q of order) {
    const url = t.url.replace(/_(320|160|96|48|12)\.mp4/, `_${q}.mp4`);
    const n = await headLen(url); if (n > TG_MAX) continue; if (n < 0 && q !== "160") continue;
    const r = await fetch(url, { headers: { "user-agent": UA } }); if (!r.ok) continue;
    const b = await r.arrayBuffer(); if (b.byteLength < 10000 || b.byteLength > TG_MAX) continue;
    buf = b; used = q; break;
  }
  if (!buf) { if (hit) return hit; const e = new Error("Couldn't fetch the song file"); e.http = 502; throw e; }
  const again = await d.prepare("SELECT * FROM files WHERE sid = ? AND q = ?").bind(sid, used).first(); if (again) return again;
  let thumb = null; try { const r = await fetch((t.thumb || "").replace("500x500", "150x150"), { headers: { "user-agent": UA } }); if (r.ok) { const b = await r.arrayBuffer(); if (b.byteLength < 200000) thumb = b; } } catch (e) {}
  const fd = new FormData();
  fd.append("chat_id", String(TG_GROUP));
  fd.append("audio", new Blob([buf], { type: "audio/mp4" }), `${cleanName(t.title)} - ${cleanName(t.artist)}.m4a`);
  fd.append("title", t.title.slice(0, 120)); fd.append("performer", t.artist.slice(0, 120));
  if (t.dur) fd.append("duration", String(t.dur));
  fd.append("caption", `🎵 ${t.title}\n👤 ${t.artist}${t.album ? `\n💿 ${t.album}` : ""}\n🎧 ${used} kbps\n#dhun id:${sid}`.slice(0, 1000));
  fd.append("disable_notification", "true");
  if (thumb) { fd.append("thumbnail", "attach://cover"); fd.append("cover", new Blob([thumb], { type: "image/jpeg" }), "cover.jpg"); }
  const m = await tg("sendAudio", fd, true);
  const fileId = (m.audio || m.document || {}).file_id; if (!fileId) throw new Error("Telegram didn't keep it as audio");
  const row = { sid, q: used, file_id: fileId, mid: m.message_id, title: t.title, artist: t.artist, album: t.album || "", dur: t.dur || 0, thumb: t.thumb || "", bytes: buf.byteLength, at: Date.now() };
  await d.prepare("INSERT OR REPLACE INTO files (sid, q, file_id, mid, title, artist, album, dur, thumb, bytes, at) VALUES (?,?,?,?,?,?,?,?,?,?,?)").bind(row.sid, row.q, row.file_id, row.mid, row.title, row.artist, row.album, row.dur, row.thumb, row.bytes, row.at).run();
  return row;
}
async function tgDl(env, body) {
  const d = await db(env); const u = await userOf(d, body.c);
  if (!u || !u.chat_id) return J({ error: "not_linked" }, 401);
  const id = String(body.id || "").slice(0, 80), sid = String(body.sid || body.id || "").slice(0, 80);
  if (!id || !/^[\w-]+$/.test(sid)) return J({ error: "bad song" }, 400);
  const had = await d.prepare("SELECT * FROM dls WHERE chat_id = ? AND id = ?").bind(u.chat_id, id).first();
  if (had && !body.force) return J({ ok: true, item: dlOut(had), already: true });
  const k = "dl:" + u.chat_id;
  if (u.chat_id !== TG_ADMIN && (await evCount(d, k, 600e3) >= 30 || await evCount(d, k, 86400e3) >= 300)) return J({ error: "Bahut saare downloads ho gaye, thodi der baad try karo (max 30 songs / 10 min)" }, 429);
  if (u.chat_id === TG_ADMIN && await evCount(d, k, 600e3) >= 120) return J({ error: "Too many downloads in 10 min, try again shortly" }, 429);
  const want = ["320", "160", "96"].includes(String(body.q)) ? String(body.q) : "320";
  let f; try { f = await cachedFile(d, sid, want); } catch (e) { return J({ error: e.http ? e.message : "Couldn't save it: " + scrub(e.message) }, e.http || 502); }
  await evAdd(d, k);
  let m;
  if (had && had.dm_mid) { try { await tg("deleteMessage", { chat_id: u.chat_id, message_id: had.dm_mid }); } catch (e) {} }
  try { m = await tg("sendAudio", { chat_id: u.chat_id, audio: f.file_id, caption: `🎵 ${f.title}\n👤 ${f.artist}\n🎧 ${f.q} kbps · Dhun`, title: f.title, performer: f.artist, duration: f.dur || undefined }); }
  catch (e) { if (e.code === 403 || /chat not found|blocked|deactivated/i.test(e.message)) { await d.prepare("UPDATE users SET linked = 0 WHERE chat_id = ?").bind(u.chat_id).run(); await markBlocked(d, u.chat_id); return J({ error: "not_linked", why: "blocked" }, 401); } return J({ error: "Telegram didn't take it: " + scrub(e.message) }, 502); }
  const row = { chat_id: u.chat_id, id, sid, q: f.q, file_id: (m.audio || {}).file_id || f.file_id, dm_mid: m.message_id, title: f.title, artist: f.artist, album: f.album, dur: f.dur, thumb: f.thumb, bytes: f.bytes, at: Date.now() };
  await d.prepare("INSERT OR REPLACE INTO dls (chat_id, id, sid, q, file_id, dm_mid, title, artist, album, dur, thumb, bytes, at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(row.chat_id, row.id, row.sid, row.q, row.file_id, row.dm_mid, row.title, row.artist, row.album, row.dur, row.thumb, row.bytes, row.at).run();
  await d.prepare("INSERT INTO dlog (chat_id, sid, title, artist, at) VALUES (?,?,?,?,?)").bind(row.chat_id, row.sid, row.title, row.artist, row.at).run().catch(() => {});
  return J({ ok: true, item: dlOut(row) });
}
async function tgPath(fileId) {
  const c = memGet("tgf:" + fileId); if (c) return c;
  const f = await tg("getFile", { file_id: fileId }); if (!f.file_path) throw new Error("no file path");
  memSet("tgf:" + fileId, f.file_path, 50 * 60); return f.file_path;
}
async function tgStream(env, req, code, id) {
  const d = await db(env); const u = await userOf(d, code); if (!u || !u.chat_id) return J({ error: "not_linked" }, 401);
  const r = await d.prepare("SELECT file_id FROM dls WHERE chat_id = ? AND id = ?").bind(u.chat_id, id).first();
  if (!r) return J({ error: "not in your downloads" }, 404);
  const hd = {}; const rg = req.headers.get("range"); if (rg) hd.range = rg;
  let path = await tgPath(r.file_id);
  let up = await fetch(TG_FILE + path, { headers: hd });
  if (up.status === 404 || up.status === 400) { MEM.delete("tgf:" + r.file_id); path = await tgPath(r.file_id); up = await fetch(TG_FILE + path, { headers: hd }); }
  if (!up.ok) return J({ error: "Telegram file unavailable (" + up.status + ")" }, 502);
  const out = new Headers({ "content-type": "audio/mp4", "accept-ranges": "bytes", "cache-control": "private, max-age=3600" });
  for (const k of ["content-length", "content-range"]) { const v = up.headers.get(k); if (v) out.set(k, v); }
  return new Response(up.body, { status: up.status, headers: out });
}
// ---------- admin bot commands (only from.id == TG_ADMIN) + broadcast ----------
const IST = 5.5 * 3600e3;
const dayStart = () => Math.floor((Date.now() + IST) / 86400e3) * 86400e3 - IST;
const istDate = ms => new Date(ms + IST).toISOString().slice(0, 10).split("-").reverse().join("-");
const ADMIN_CMDS = /^\/(admin|panel|stats|users|top|broadcast|confirm|cancel|dryrun|testlog|help)(?:@\w+)?(?:\s|$)/i;
async function adminStats(d, env) {
  const t0 = dayStart(), w0 = Date.now() - 7 * 86400e3;
  const one = async (q, ...b) => ((await d.prepare(q).bind(...b).first()) || {}).n || 0;
  const [conn, starters, newT, new7, actT, blk, dlAll, dlT, cache] = await Promise.all([
    one("SELECT COUNT(*) AS n FROM people WHERE connected = 1"), one("SELECT COUNT(*) AS n FROM people"),
    one("SELECT COUNT(*) AS n FROM people WHERE first_at >= ?", t0), one("SELECT COUNT(*) AS n FROM people WHERE first_at >= ?", w0),
    one("SELECT COUNT(*) AS n FROM people WHERE last_seen >= ?", t0), one("SELECT COUNT(*) AS n FROM people WHERE blocked = 1"),
    one("SELECT COUNT(*) AS n FROM dlog"), one("SELECT COUNT(*) AS n FROM dlog WHERE at >= ?", t0), one("SELECT COUNT(*) AS n FROM files")]);
  const top = ((await d.prepare("SELECT sid, MAX(title) AS title, MAX(artist) AS artist, COUNT(*) AS n FROM dlog GROUP BY sid ORDER BY n DESC, MAX(at) DESC LIMIT 10").all()).results || []);
  return `📊 Dhun stats (${istDate(Date.now())})\n\n👥 Connected users: ${conn}${starters > conn ? ` (+${starters - conn} started bot only)` : ""}\n🆕 New today: ${newT} · last 7 days: ${new7}\n🟢 Active today: ${actT}\n🚫 Blocked the bot: ${blk}\n\n⬇️ Total downloads: ${dlAll}\n📅 Downloads today: ${dlT}\n🗂 Songs in storage group: ${cache}\n\n🏆 Top 10 songs:\n` + (top.length ? top.map((r, i) => `${i + 1}. ${r.title} – ${r.artist} (${r.n})`).join("\n") : "abhi koi download nahi") + (env ? "\n\n" + await logStatus(env) : "");
}
async function testLog(env, from) {
  try { return await logSend(env, `🧪 <b>Test log</b> · Dhun logs channel kaam kar raha hai ✅\nAdmin: ${who(from)}\n🕒 ${istDate(Date.now())} ${hm()}`, { force: true }); }
  catch (e) { return { error: scrub(e && e.message || e) }; }
}
async function adminUsers(d) {
  const rs = ((await d.prepare("SELECT p.*, (SELECT COUNT(*) FROM dlog l WHERE l.chat_id = p.chat_id) AS dl FROM people p ORDER BY p.first_at DESC LIMIT 20").all()).results || []);
  const tot = ((await d.prepare("SELECT COUNT(*) AS n FROM people").first()) || {}).n || 0;
  if (!rs.length) return "👥 Abhi koi user nahi hai.";
  return `👥 Last ${rs.length} of ${tot} users (newest first)\n\n` + rs.map((r, i) => `${i + 1}. ${r.username ? "@" + r.username : ""}${r.username && r.name ? " · " : ""}${r.name || (r.username ? "" : "id " + r.chat_id)}${r.blocked ? " 🚫" : ""}${r.connected ? "" : " (bot only)"}\n    joined ${istDate(r.first_at || 0)} · ${r.dl} downloads`).join("\n");
}
const ADMIN_HELP = `🛠 Admin commands (sirf aapke liye)\n\n/admin – buttons wala admin panel\n/stats – users, downloads, top songs\n/users – last 20 users\n/broadcast <text> – sab users ko message\n   ya kisi photo/audio/video/text message ko reply karke /broadcast likho – wo message sabko copy hoga\n/confirm – pending broadcast bhejo\n/dryrun – check karo kitno ko jayega (kuch nahi bhejta)\n/cancel – pending broadcast cancel\n/testlog – logs channel me test message\n/help – ye list\n\n📝 Logs channel me sirf naye users ka log jata hai.`;
const recipientsSQL = "SELECT chat_id FROM people WHERE blocked = 0 AND chat_id > 0";

// ---------- /admin button panel (inline keyboard + callback_query) ----------
const kb = rows => ({ inline_keyboard: rows.map(r => r.map(([text, data]) => ({ text, callback_data: data }))) });
const PANEL_KB = kb([[["📊 Stats", "a:stats"], ["👥 Users", "a:users"]], [["🎵 Top songs", "a:top"], ["📢 Broadcast", "a:bc"]], [["🔄 Refresh", "a:refresh"], ["❓ Help", "a:help"]], [["🧪 Test log", "a:testlog"]]]);
const backKb = refresh => kb([...(refresh ? [[["🔄 Refresh", refresh]]] : []), [["« Back", "a:panel"]]]);
const istTime = ms => new Date(ms + IST).toISOString().slice(11, 19);
async function panelText(d) {
  const t0 = dayStart(); const one = async (q, ...b) => ((await d.prepare(q).bind(...b).first()) || {}).n || 0;
  const [conn, actT, dlAll, dlT, newT] = await Promise.all([one("SELECT COUNT(*) AS n FROM people WHERE connected = 1"), one("SELECT COUNT(*) AS n FROM people WHERE last_seen >= ?", t0), one("SELECT COUNT(*) AS n FROM dlog"), one("SELECT COUNT(*) AS n FROM dlog WHERE at >= ?", t0), one("SELECT COUNT(*) AS n FROM people WHERE connected = 1 AND first_at >= ?", t0)]);
  return `🛠 Dhun Admin Panel\n\n👥 Users: ${conn} (aaj naye: ${newT})\n🟢 Aaj active: ${actT}\n⬇️ Downloads: ${dlAll} (aaj: ${dlT})\n\nNeeche button dabao 👇\n🕒 Updated ${istTime(Date.now())} IST`;
}
async function adminTop(d) {
  const top = ((await d.prepare("SELECT sid, MAX(title) AS title, MAX(artist) AS artist, COUNT(*) AS n FROM dlog GROUP BY sid ORDER BY n DESC, MAX(at) DESC LIMIT 15").all()).results || []);
  return "🎵 Top songs (sabse zyada download)\n\n" + (top.length ? top.map((r, i) => `${i + 1}. ${r.title} – ${r.artist} (${r.n})`).join("\n") : "Abhi koi download nahi hua.");
}
const ADMIN_HELP_BTN = `❓ Help\n\n📊 Stats – users, downloads, top 10\n👥 Users – last 20 users\n🎵 Top songs – sabse zyada download\n📢 Broadcast – button dabao, phir jo message bhejna hai (text/photo/audio/video) wo bhejo, preview aayega, phir ✅ Send dabao\n🔄 Refresh – numbers update\n🧪 Test log – logs channel me ek test line (naye users ka log wahan jata hai)\n\nText commands bhi chalte hain:\n/admin /stats /users /broadcast /dryrun /cancel /testlog /help`;
const nRecipients = async d => ((await d.prepare(`SELECT COUNT(*) AS n FROM (${recipientsSQL})`).first()) || {}).n || 0;
const nBlocked = async d => ((await d.prepare("SELECT COUNT(*) AS n FROM people WHERE blocked = 1").first()) || {}).n || 0;
// 'await' = waiting for the admin's next message to become the broadcast; 'pending' = waiting for Send/confirm
async function startAwait(d, chatId) {
  const running = await d.prepare("SELECT id FROM bcast WHERE status IN ('running','starting')").first();
  if (running) return 0;
  await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE status IN ('pending','await')").run();
  const r = await d.prepare("INSERT INTO bcast (kind, text, from_chat, msg_id, status, created) VALUES ('copy', '', ?, NULL, 'await', ?)").bind(chatId, Date.now()).run();
  return (r.meta && r.meta.last_row_id) || ((await d.prepare("SELECT MAX(id) AS id FROM bcast").first()) || {}).id;
}
const AWAIT_TEXT = "📢 Ab jo message bhejna hai wo yahan bhejo (text/photo/audio/video)…\n\nAgla message hi broadcast banega. Pehle preview aayega, bina ✅ Send dabaye kisi ko nahi jayega.";
// pending -> starting -> running (guarded, so a double tap can't send twice)
async function confirmBcast(env, ctx, d, bid) {
  const g = await d.prepare("UPDATE bcast SET status = 'starting' WHERE id = ? AND status = 'pending'").bind(bid).run();
  if (!g.meta || !g.meta.changes) return -1;
  await d.prepare(`INSERT OR IGNORE INTO bq (bid, chat_id) SELECT ?, chat_id FROM (${recipientsSQL})`).bind(bid).run();
  const n = ((await d.prepare("SELECT COUNT(*) AS n FROM bq WHERE bid = ?").bind(bid).first()) || {}).n || 0;
  await d.prepare("UPDATE bcast SET status = 'running', total = ? WHERE id = ?").bind(n, bid).run();
  ctx.waitUntil(runBroadcast(env, ctx, bid));
  return n;
}
async function previewBcast(d, m, act) {
  const w = await d.prepare("SELECT * FROM bcast WHERE status = 'await' ORDER BY id DESC LIMIT 1").first();
  if (!w) return false;
  if (Date.now() - w.created > 15 * 60e3) { await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE id = ?").bind(w.id).run(); return false; }
  const what = m.photo ? "📷 Photo" : m.audio ? "🎵 Audio" : m.video ? "🎬 Video" : m.voice ? "🎤 Voice" : m.document ? "📄 File" : m.animation ? "🎞 GIF" : m.sticker ? "Sticker" : "💬 Text";
  await d.prepare("UPDATE bcast SET status = 'pending', kind = 'copy', from_chat = ?, msg_id = ?, text = ?, created = ? WHERE id = ?").bind(m.chat.id, m.message_id, String(m.text || m.caption || "").slice(0, 4000), Date.now(), w.id).run();
  const n = await nRecipients(d), blk = await nBlocked(d);
  await act("sendMessage", { chat_id: m.chat.id, reply_to_message_id: m.message_id, text: `📣 Preview 👆 (${what})\n\nYe message ${n} user${n === 1 ? "" : "s"} ko jayega${blk ? ` (${blk} blocked skip honge)` : ""}. Bilkul aisa hi dikhega.`, reply_markup: kb([[[`✅ Send to ${n} user${n === 1 ? "" : "s"}`, "b:send:" + w.id]], [["🧪 Dry run", "b:dry:" + w.id], ["❌ Cancel", "b:x:" + w.id]]]) });
  return true;
}
async function tgCallback(env, ctx, d, q, dry) {
  const act = (method, body) => dry ? (dry.push({ method, ...body }), Promise.resolve({})) : tg(method, body).catch(e => ({ error: e.message || "?" }));
  let answered = false;
  const ans = (text, alert) => { answered = true; return act("answerCallbackQuery", { callback_query_id: q.id, text: text || undefined, show_alert: !!alert }); };
  try {
    const from = q.from || {}; const msg = q.message || {}; const chat_id = (msg.chat && msg.chat.id) || from.id; const mid = msg.message_id;
    if (from.id !== TG_ADMIN) { await ans("Sorry 🙏 ye sirf bot admin ke liye hai.", true); return; }
    const data = String(q.data || "");
    const edit = async (text, markup) => {
      if (mid) { const r = await act("editMessageText", { chat_id, message_id: mid, text, reply_markup: markup, disable_web_page_preview: true }); if (!r || !r.error || /not modified/i.test(r.error)) return; }
      await act("sendMessage", { chat_id, text, reply_markup: markup, disable_web_page_preview: true });
    };
    if (data === "a:panel" || data === "a:refresh") { await edit(await panelText(d), PANEL_KB); return ans(data === "a:refresh" ? "🔄 Updated" : ""); }
    if (data === "a:stats") { await edit(await adminStats(d, env), backKb("a:stats")); return ans(""); }
    if (data === "a:users") { await edit(await adminUsers(d), backKb("a:users")); return ans(""); }
    if (data === "a:top") { await edit(await adminTop(d), backKb("a:top")); return ans(""); }
    if (data === "a:testlog") { const r = await testLog(env, from); return ans(r.message_id ? `✅ Test log bheja (msg #${r.message_id})` : `❌ Log nahi gaya: ${(r.error || "?").slice(0, 150)}`, true); }
    if (data === "a:help") { await edit(ADMIN_HELP_BTN, backKb("")); return ans(""); }
    if (data === "a:bc") {
      const id = await startAwait(d, chat_id);
      if (!id) return ans("Ek broadcast abhi chal raha hai, khatam hone do.", true);
      await act("sendMessage", { chat_id, text: AWAIT_TEXT, reply_markup: kb([[["❌ Cancel", "b:x:" + id]]]) });
      return ans("📢 Message bhejo");
    }
    const b = /^b:(send|dry|x):(\d+)$/.exec(data);
    if (b) {
      const row = await d.prepare("SELECT * FROM bcast WHERE id = ?").bind(+b[2]).first();
      if (b[1] === "x") {
        if (!row || !["await", "pending"].includes(row.status)) { if (mid) await act("editMessageReplyMarkup", { chat_id, message_id: mid, reply_markup: { inline_keyboard: [] } }); return ans("Ye broadcast pehle hi band/bheja ja chuka hai.", true); }
        await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE id = ? AND status IN ('await','pending')").bind(row.id).run();
        await edit("❌ Broadcast cancelled. Kisi ko kuch nahi gaya.", { inline_keyboard: [] }); return ans("Cancelled");
      }
      if (!row || row.status !== "pending") { if (mid) await act("editMessageReplyMarkup", { chat_id, message_id: mid, reply_markup: { inline_keyboard: [] } }); return ans(row && (row.status === "running" || row.status === "done" || row.status === "starting") ? "Ye broadcast already bheja ja chuka hai." : "Ye purana button hai. Naya broadcast: /admin → 📢 Broadcast", true); }
      if (Date.now() - row.created > 15 * 60e3) { await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE id = ?").bind(row.id).run(); await edit("⌛ Ye broadcast 15 min purana ho gaya, cancel kar diya. Dobara: /admin → 📢 Broadcast", { inline_keyboard: [] }); return ans("Expired", true); }
      if (b[1] === "dry") { const n = await nRecipients(d), blk = await nBlocked(d); return ans(`🧪 Dry run: ${n} user${n === 1 ? "" : "s"} ko jayega (${blk} blocked skip). ~${Math.max(1, Math.ceil(n / 25))} sec. Kuch bheja nahi gaya.`, true); }
      if (dry) { const n = await nRecipients(d); dry.push({ test_would_send_to: n, bid: row.id }); return ans("(test) not sent"); }
      const n = await confirmBcast(env, ctx, d, row.id);
      if (n < 0) return ans("Ye broadcast already bheja ja chuka hai.", true);
      await edit(`🚀 Sending to ${n} user${n === 1 ? "" : "s"}… khatam hone pe report bhejunga.`, { inline_keyboard: [] });
      return ans("🚀 Sending");
    }
    return ans("Ye purana button hai. /admin dobara likho.", true);
  } finally { if (!answered) await act("answerCallbackQuery", { callback_query_id: q.id }).catch(() => {}); }
}
async function adminCmd(env, ctx, d, m, text, say) {
  const cmd = text.split(/\s/)[0].replace(/@\w+$/, "").toLowerCase();
  if (cmd === "/admin" || cmd === "/panel") return say(await panelText(d), { reply_markup: PANEL_KB });
  if (cmd === "/top") return say(await adminTop(d));
  if (cmd === "/help") return say(ADMIN_HELP);
  if (cmd === "/testlog") { const r = await testLog(env, m.from); return say(r.message_id ? `✅ Test log bheja logs channel me (msg #${r.message_id})` : `❌ Log nahi gaya: ${r.error || "?"}`); }
  if (cmd === "/stats") return say(await adminStats(d, env));
  if (cmd === "/users") return say(await adminUsers(d));
  const nRecip = async () => ((await d.prepare(`SELECT COUNT(*) AS n FROM (${recipientsSQL})`).first()) || {}).n || 0;
  if (cmd === "/broadcast") {
    const body = text.replace(/^\/broadcast(@\w+)?/i, "").trim(); const rep = m.reply_to_message;
    if (!body && !rep) { const id = await startAwait(d, m.chat.id); if (!id) return say("Ek broadcast abhi chal raha hai, khatam hone ke baad try karo."); return say(AWAIT_TEXT + "\n\n(Ya seedha: /broadcast Aapka message)", { reply_markup: kb([[["❌ Cancel", "b:x:" + id]]]) }); }
    const running = await d.prepare("SELECT id FROM bcast WHERE status IN ('running','starting')").first();
    if (running) return say("Ek broadcast abhi chal raha hai, khatam hone ke baad try karo.");
    await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE status IN ('pending','await')").run();
    const kind = body ? "text" : "copy";
    const ins = await d.prepare("INSERT INTO bcast (kind, text, from_chat, msg_id, status, created) VALUES (?, ?, ?, ?, 'pending', ?)").bind(kind, body.slice(0, 4000), m.chat.id, rep ? rep.message_id : null, Date.now()).run();
    const bidNew = (ins.meta && ins.meta.last_row_id) || ((await d.prepare("SELECT MAX(id) AS id FROM bcast").first()) || {}).id;
    const n = await nRecip();
    return say(`📣 Send to ${n} user${n === 1 ? "" : "s"}?\n\n${kind === "text" ? "Message:\n" + body.slice(0, 600) + (body.length > 600 ? "…" : "") : "Aapka reply kiya hua message (copy hoga)."}\n\nReply /confirm to send, /cancel to cancel, /dryrun to just check.`, { reply_markup: kb([[[`✅ Send to ${n} user${n === 1 ? "" : "s"}`, "b:send:" + bidNew]], [["🧪 Dry run", "b:dry:" + bidNew], ["❌ Cancel", "b:x:" + bidNew]]]) });
  }
  const pend = await d.prepare("SELECT * FROM bcast WHERE status = 'pending' ORDER BY id DESC LIMIT 1").first();
  if (cmd === "/cancel") { const aw = await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE status = 'await'").run(); if (!pend) return say(aw.meta && aw.meta.changes ? "❌ Broadcast cancelled." : "Koi pending broadcast nahi hai."); await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE id = ?").bind(pend.id).run(); return say("❌ Broadcast cancelled."); }
  if (cmd === "/dryrun") {
    const n = await nRecip(); const blk = ((await d.prepare("SELECT COUNT(*) AS n FROM people WHERE blocked = 1").first()) || {}).n || 0;
    return say(`🧪 Dry run: ${pend ? "pending broadcast" : "a broadcast"} would go to ${n} user${n === 1 ? "" : "s"} (${blk} blocked skipped). ~${Math.max(1, Math.ceil(n / 25))} sec. Nothing was sent.${pend ? "\nReply /confirm to really send." : ""}`);
  }
  if (cmd === "/confirm") {
    if (!pend) return say("Koi pending broadcast nahi hai. Pehle /broadcast <message> bhejo.");
    if (Date.now() - pend.created > 15 * 60e3) { await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE id = ?").bind(pend.id).run(); return say("Ye broadcast 15 min purana ho gaya, dobara /broadcast bhejo."); }
    if (say.dry) { say.dry.push({ test_would_send_to: await nRecipients(d), bid: pend.id }); return; }
    const n = await confirmBcast(env, ctx, d, pend.id);
    if (n < 0) return say("Ye broadcast already bheja ja chuka hai.");
    await say(`🚀 Sending to ${n} user${n === 1 ? "" : "s"}… khatam hone pe report bhejunga.`);
    return;
  }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function runBroadcast(env, ctx, bid) {
  const d = await db(env); const t0 = Date.now();
  const got = await d.prepare("UPDATE bcast SET lease = ? WHERE id = ? AND status = 'running' AND lease < ?").bind(t0 + 40e3, bid, t0).run();
  if (!got.meta || !got.meta.changes) return; // someone else is running it
  const b = await d.prepare("SELECT * FROM bcast WHERE id = ?").bind(bid).first(); if (!b) return;
  let sent = 0, failed = 0, blocked = 0, calls = 0;
  while (Date.now() - t0 < 24e3 && calls < 700) {
    const batch = ((await d.prepare("SELECT chat_id FROM bq WHERE bid = ? AND state = 0 LIMIT 25").bind(bid).all()).results || []);
    if (!batch.length) break;
    const upd = [];
    for (const r of batch) {
      if (Date.now() - t0 > 24e3) break;
      let st = 0;
      for (let tries = 0; tries < 3 && !st; tries++) {
        calls++;
        try {
          if (b.kind === "text") await tg("sendMessage", { chat_id: r.chat_id, text: b.text, disable_web_page_preview: false });
          else await tg("copyMessage", { chat_id: r.chat_id, from_chat_id: b.from_chat, message_id: b.msg_id });
          st = 1;
        } catch (e) {
          const ra = /retry after (\d+)/i.exec(e.message || "");
          if (e.code === 429 && ra && +ra[1] <= 10) { await sleep(+ra[1] * 1000 + 200); continue; }
          if (e.code === 403 || /chat not found|blocked|deactivated|user is deactivated/i.test(e.message || "")) st = 3; else st = 2;
        }
      }
      if (!st) st = 2;
      if (st === 1) sent++; else if (st === 3) { blocked++; upd.push(d.prepare("UPDATE people SET blocked = 1 WHERE chat_id = ?").bind(r.chat_id)); } else failed++;
      upd.push(d.prepare("UPDATE bq SET state = ? WHERE bid = ? AND chat_id = ?").bind(st, bid, r.chat_id));
      await sleep(40); // ~25 msgs/s
    }
    upd.push(d.prepare("UPDATE bcast SET sent = sent + ?, failed = failed + ?, blocked = blocked + ?, lease = ? WHERE id = ?").bind(sent, failed, blocked, Date.now() + 40e3, bid));
    await d.batch(upd); sent = failed = blocked = 0;
  }
  const left = ((await d.prepare("SELECT COUNT(*) AS n FROM bq WHERE bid = ? AND state = 0").bind(bid).first()) || {}).n || 0;
  if (!left) {
    const f = await d.prepare("SELECT * FROM bcast WHERE id = ?").bind(bid).first();
    const fin = await d.prepare("UPDATE bcast SET status = 'done', done_at = ?, lease = 0 WHERE id = ? AND status = 'running'").bind(Date.now(), bid).run();
    if (fin.meta && fin.meta.changes) await tg("sendMessage", { chat_id: f.from_chat, text: `✅ Broadcast done\n\nSent: ${f.sent}\nFailed: ${f.failed}\nBlocked (marked inactive): ${f.blocked}\nTotal: ${f.total}` }).catch(() => {});
    return;
  }
  await d.prepare("UPDATE bcast SET lease = 0 WHERE id = ?").bind(bid).run();
  // continue in a fresh request (each request gets its own time budget); any later request also resumes it
  ctx.waitUntil(fetch(SITE + "api/tg/ops", { method: "POST", headers: { "content-type": "application/json", "x-dhun-ops": HOOK_SECRET }, body: JSON.stringify({ op: "bjob" }) }).catch(() => {}));
}
async function resumeBroadcast(env, ctx) {
  try { const d = await db(env); const b = await d.prepare("SELECT id FROM bcast WHERE status = 'running' AND lease < ? LIMIT 1").bind(Date.now()).first(); if (b) ctx.waitUntil(runBroadcast(env, ctx, b.id)); } catch (e) {}
}
const APK_PATH = "dhun.apk";
let SUPPORT_TG = "Memer_guru"; // Telegram handle shown as support contact in bot messages (env SUPPORT_TG)
const LINKS = site => `🌐 Web app (iPhone / any phone): ${site}\n📱 Android app (offline download bhi): ${site}${APK_PATH}\n\n💬 Support: @${SUPPORT_TG}`;
const LINK_BTNS = site => ({ parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🌐 Open Dhun", url: site }, { text: "📱 Android App", url: site + APK_PATH }]] } });
const WELCOME = (n, site = SITE) => `Namaste..! 🎶 <b>Dhun connected</b> ✅\n\nAb app me jo bhi song <b>Download</b> karoge, wo yahin is chat me aa jayega. Phone storage use nahi hoga, Telegram me safe rahega.\n\nAapke liked songs, playlists aur history bhi aapke account me save rahenge — kisi bhi phone pe connect karo, sab wapas aa jayega.\n\n${LINKS(site)}`;
const HELLO = (site = SITE) => `Namaste..! 🎶 Main <b>Dhun</b> ka bot hoon.\n\nSongs yahan paane ke liye Dhun app kholo → Library → "Connect Telegram".\n\n${LINKS(site)}`;
async function tgHook(env, req, ctx) {
  if (!HOOK_SECRET || req.headers.get("x-telegram-bot-api-secret-token") !== HOOK_SECRET) return new Response("no", { status: 403 });
  const dry = HOOK_SECRET && req.headers.get("x-dhun-dry") === HOOK_SECRET ? [] : null; // test mode: replies come back in the response instead of being sent
  const upd = await req.json().catch(() => ({}));
  const d = await db(env);
  ctx.waitUntil(resumeBroadcast(env, ctx));
  const lctx = dry ? { test: true, collect: [] } : ctx; // simulations: log line marked TEST and its message id returned
  if (upd.my_chat_member) { const c = upd.my_chat_member; if (c.chat && c.chat.type === "private") { const st = c.new_chat_member && c.new_chat_member.status; if (st === "kicked") await markBlocked(d, c.chat.id); else if (st === "member") await d.prepare("UPDATE people SET blocked = 0 WHERE chat_id = ?").bind(c.chat.id).run(); } return J({ ok: true }); }
  if (upd.callback_query) { await tgCallback(env, ctx, d, upd.callback_query, dry); return J(dry ? { ok: true, calls: dry } : { ok: true }); }
  const m = upd.message; if (!m || !m.chat || m.chat.type !== "private") return J({ ok: true });
  const text = String(m.text || m.caption || "").trim(); const from = m.from || {};
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ").slice(0, 60);
  const say = (t, extra) => { if (dry) { dry.push(extra ? { text: t, ...extra } : t); return Promise.resolve(); } return m.chat.id < 0 ? Promise.resolve() : tg("sendMessage", { chat_id: m.chat.id, text: t, disable_web_page_preview: true, ...(extra || {}) }).catch(() => {}); };
  say.dry = dry;
  const done = async () => J(dry ? { ok: true, replies: dry, logs: await Promise.all(lctx.collect) } : { ok: true });
  const st = /^\/start(?:@\w+)?\s+([A-Za-z0-9_-]{16,64})$/.exec(text);
  if (st) {
    const u = await d.prepare("SELECT * FROM users WHERE code = ?").bind(st[1]).first();
    if (!u) { await say("Ye link purana ho gaya. Dhun app me \"Connect Telegram\" dobara tap karo 🙏\n" + SITE); return done(); }
    if (u.chat_id && u.chat_id !== m.chat.id) { await say("Ye link kisi aur Telegram account se already juda hai. Dhun app me \"Connect Telegram\" dobara tap karo."); return done(); }
    await d.prepare("UPDATE users SET chat_id = ?, username = ?, name = ?, linked = ? WHERE code = ?").bind(m.chat.id, from.username || "", name, Date.now(), st[1]).run();
    const ps = await personSeen(d, { ...from, id: m.chat.id }, true);
    if (ps && ps.isNew) logNewUser(env, lctx, { ...from, id: m.chat.id }, "app se 🔗 Connect Telegram");
    await say(WELCOME(from.first_name || ""), LINK_BTNS(SITE)); return done();
  }
  const ps = await personSeen(d, { ...from, id: m.chat.id }, false).catch(() => null);
  if (ps && ps.isNew) logNewUser(env, lctx, { ...from, id: m.chat.id }, /^\/start/.test(text) ? "bot me ▶️ /start" : "bot me pehla message");
  if (ADMIN_CMDS.test(text)) {
    const isAdmin = from.id === TG_ADMIN && m.chat.id === TG_ADMIN;
    if (isAdmin) { await adminCmd(env, ctx, d, m, text, say); return done(); }
    if (!/^\/help/i.test(text)) { await say("Sorry 🙏 ye command sirf bot admin ke liye hai."); return done(); }
  }
  if (from.id === TG_ADMIN && m.chat.id === TG_ADMIN && !/^\//.test(text)) {
    const act = (method, body) => dry ? (dry.push({ method, ...body }), Promise.resolve({})) : tg(method, body).catch(() => ({}));
    if (await previewBcast(d, m, act)) return done();
    await say("Ye message sab users ko bhejna hai? Isi message ko reply karke /broadcast likho, ya /admin → 📢 Broadcast. Saare commands: /help"); return done(); }
  if (/^\/start/.test(text) || /^\/help/i.test(text)) await say(HELLO(SITE), LINK_BTNS(SITE));
  else await say(`Songs download karne ke liye Dhun app use karo: ${SITE}`);
  return done();
}
// ---------- per-user library sync (likes, playlists, recently played), keyed to the Telegram user; authorised only by the session token ----------
const SYNC_KEYS = ["liked", "playlists", "recent"];
async function userData(env, ctx, body) {
  const d = await db(env); const u = await userOf(d, body.c, ctx);
  if (!u || !u.chat_id || !u.linked) return J({ error: "not_linked" }, 401);
  const row = await d.prepare("SELECT * FROM udata WHERE chat_id = ?").bind(u.chat_id).first();
  const cur = { liked: [], playlists: [], recent: [], rev: 0, at: 0 };
  if (row) { for (const k of SYNC_KEYS) { try { cur[k] = JSON.parse(row[k] || "[]"); } catch (e) {} } cur.rev = row.rev || 0; cur.at = row.at || 0; }
  if (body.op === "put") {
    const ch = {};
    for (const k of SYNC_KEYS) if (Array.isArray(body[k])) {
      const j = JSON.stringify(body[k]); if (j.length > 400000) return J({ error: "too big: " + k }, 413);
      ch[k] = j; cur[k] = body[k];
    }
    if (!Object.keys(ch).length) return J({ error: "nothing to save" }, 400);
    const now = Date.now(); cur.rev++; cur.at = now;
    await d.prepare("INSERT INTO udata (chat_id, liked, playlists, recent, rev, at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(chat_id) DO UPDATE SET liked = COALESCE(?, udata.liked), playlists = COALESCE(?, udata.playlists), recent = COALESCE(?, udata.recent), rev = udata.rev + 1, at = ?")
      .bind(u.chat_id, ch.liked || "[]", ch.playlists || "[]", ch.recent || "[]", 1, now, ch.liked ?? null, ch.playlists ?? null, ch.recent ?? null, now).run();
    const r2 = await d.prepare("SELECT rev FROM udata WHERE chat_id = ?").bind(u.chat_id).first(); cur.rev = r2 ? r2.rev : cur.rev;
    return J({ ok: true, rev: cur.rev, at: cur.at });
  }
  const n = await nameOf(d, u, ctx);
  return J({ ok: true, ...cur, username: n ? n.username : (u.username || ""), name: u.name || "", first: n?.first || "", uid: String(u.chat_id) });
}
async function tgRoute(p, req, env, u, ctx) {
  if (p === "/api/tg/hook") return tgHook(env, req, ctx);
  if (p === "/api/tg/ops") { // server-side maintenance; secret header only (never in the app)
    if (req.method !== "POST" || !HOOK_SECRET || req.headers.get("x-dhun-ops") !== HOOK_SECRET) return new Response("no", { status: 403 });
    const b = await req.json().catch(() => ({})); const d = await db(env);
    if (b.op === "bjob") { await resumeBroadcast(env, ctx); return J({ ok: true }); }
    if (b.op === "purge" && Array.isArray(b.chat_ids)) { const ids = b.chat_ids.map(Number).filter(x => x && x !== TG_ADMIN); for (const id of ids) await d.batch(["users", "people", "udata", "dls", "dlog"].map(t => d.prepare(`DELETE FROM ${t} WHERE chat_id = ?`).bind(id))); return J({ ok: true, purged: ids }); }
    if (b.op === "peek") { const n = async q => ((await d.prepare(q).first()) || {}).n; return J({ people: await n("SELECT COUNT(*) AS n FROM people"), recipients: await n(`SELECT COUNT(*) AS n FROM (${recipientsSQL})`), admin_in: !!(await d.prepare("SELECT 1 AS x FROM people WHERE chat_id = ?").bind(TG_ADMIN).first()), ids: ((await d.prepare("SELECT chat_id, connected, blocked FROM people").all()).results || []), bcast: ((await d.prepare("SELECT id, kind, status, total, sent, failed, blocked FROM bcast ORDER BY id DESC LIMIT 5").all()).results || []) }); }
    if (b.op === "cancel_pending") { await d.prepare("UPDATE bcast SET status = 'cancelled' WHERE status = 'pending'").run(); return J({ ok: true }); }
    return J({ error: "op?" }, 400);
  }
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const code = body.c || u.searchParams.get("c") || "";
  const d = await db(env);
  if (p === "/api/tg/new" && req.method === "POST") {
    const ip = req.headers.get("cf-connecting-ip") || "?";
    if (await evCount(d, "new:" + ip, 3600e3) >= 12) return J({ error: "Too many tries, wait a bit" }, 429);
    await evAdd(d, "new:" + ip);
    const a = new Uint8Array(24); crypto.getRandomValues(a); const c = btoa(String.fromCharCode(...a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    await d.prepare("INSERT INTO users (code, created) VALUES (?, ?)").bind(c, Date.now()).run();
    return J({ code: c, link: `https://t.me/${TG_BOT}?start=${c}`, bot: TG_BOT });
  }
  if (p === "/api/tg/me") { const x = await userOf(d, code, ctx); const n = await nameOf(d, x, ctx); return J({ linked: !!(x && x.chat_id && x.linked), username: n ? n.username : (x?.username || ""), name: n ? [n.first, n.last].filter(Boolean).join(" ") : (x?.name || ""), first: n?.first || "", uid: x && x.linked && x.chat_id ? String(x.chat_id) : "", bot: TG_BOT, known: !!x }); }
  if (p === "/api/u/data" && req.method === "POST") return userData(env, ctx, body);
  if (p === "/api/tg/dl" && req.method === "POST") return tgDl(env, body);
  if (p === "/api/tg/mine") { const x = await userOf(d, code, ctx); if (!x || !x.chat_id) return J({ items: [], linked: false }); const rs = await d.prepare("SELECT * FROM dls WHERE chat_id = ? ORDER BY at DESC").bind(x.chat_id).all(); return J({ items: (rs.results || []).map(dlOut), linked: !!x.linked }); }
  if (p === "/api/tg/rm" && req.method === "POST") {
    const x = await userOf(d, code); if (!x || !x.chat_id) return J({ error: "not_linked" }, 401);
    const r = await d.prepare("SELECT * FROM dls WHERE chat_id = ? AND id = ?").bind(x.chat_id, String(body.id || "")).first(); if (!r) return J({ ok: true });
    let tgDeleted = false; try { await tg("deleteMessage", { chat_id: x.chat_id, message_id: r.dm_mid }); tgDeleted = true; } catch (e) {}
    await d.prepare("DELETE FROM dls WHERE chat_id = ? AND id = ?").bind(x.chat_id, r.id).run();
    return J({ ok: true, tgDeleted });
  }
  if (p === "/api/tg/stream") return tgStream(env, req, code, u.searchParams.get("id") || "");
  if (p === "/api/tg/unlink" && req.method === "POST") { await d.prepare("DELETE FROM users WHERE code = ?").bind(code).run(); return J({ ok: true }); }
  return J({ error: "not found" }, 404);
}

export default {
  async fetch(req, env, ctx) {
    loadConfig(env, req);
    const u = new URL(req.url), p = u.pathname, q = (u.searchParams.get("q") || "").slice(0, 200), v = u.searchParams.get("v") || "", id = u.searchParams.get("id") || "";
    try {
      if (p.startsWith("/api/tg/") || p.startsWith("/api/u/")) return await tgRoute(p, req, env, u, ctx);
      if (p === "/api/app-version") { // Android in-app updater; values live in /app-version.json (edit that file + swap /dhun.apk to ship a new version)
        let v = {}; try { const r = await env.ASSETS.fetch(new Request(new URL("/app-version.json", u), { headers: { "cache-control": "no-cache" } })); v = await r.json(); } catch (e) {}
        return new Response(JSON.stringify({ versionCode: Number(v.versionCode) || 0, versionName: String(v.versionName || ""), apkUrl: String(v.apkUrl || SITE + "dhun.apk"), notes: String(v.notes || ""), force: !!v.force, sha256: v.sha256 || "", bytes: v.bytes || 0 }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-cache, no-store, must-revalidate", "access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS" } });
      }
      if (p === "/dhun.apk") { const r = await env.ASSETS.fetch(new Request(new URL("/files/dhun-app.apk", u), req)); const h = new Headers(r.headers); h.set("content-type", "application/vnd.android.package-archive"); h.set("content-disposition", 'attachment; filename="Dhun.apk"'); h.set("cache-control", "no-cache"); h.set("access-control-allow-origin", "*"); return new Response(r.body, { status: r.status, headers: h }); }
      if (p === "/api/search") {
        if (!q) return J({ items: [] });
        const kind = u.searchParams.get("kind") || "songs";
        let items = [], via = "saavn";
        if (kind !== "videos") { try { items = await svSearch(q); } catch (e) {} }
        if (!items.length) { via = "youtube"; try { items = await searchYTM(q, kind); } catch (e) {} if (!items.length) { try { items = await searchFallback(q); } catch (e) {} } items = items.map(x => ({ ...x, src: "yt" })); }
        return J({ items, via }, 200, items.length ? 600 : 0);
      }
      if (p === "/api/match") { // best JioSaavn track for a title (old YouTube library entries, YT-only results)
        let t = null; try { t = (await svSearch(q, 5))[0] || null; } catch (e) {}
        return J({ track: t }, 200, t ? 3600 : 0);
      }
      if (p === "/api/song") { let t = null; try { t = await svSong(id); } catch (e) {} return J({ track: t }); }
      if (p === "/api/yt") { // last resort: find a YouTube id for a song
        let items = []; try { items = await searchYTM(q, "songs"); } catch (e) {} if (!items.length) { try { items = await searchFallback(q); } catch (e) {} }
        return J({ id: items[0]?.id || null }, 200, items.length ? 3600 : 0);
      }
      if (p === "/api/suggest") { try { return J({ items: await svSuggest(q) }, 200, 3600); } catch (e) { try { return J({ items: await suggest(q) }, 200, 3600); } catch (e2) { return J({ items: [] }); } } }
      if (p === "/api/radio") {
        const src = u.searchParams.get("src") || "";
        if (src === "saavn" || !/^[\w-]{11}$/.test(v)) { try { return J({ items: await svRadio(v || id, u.searchParams.get("artist") || "", "") }, 200, 1800); } catch (e) { return J({ items: [], error: String(e) }); } }
        // legacy YouTube track: recommend from JioSaavn by artist
        try { return J({ items: await svRadio("", u.searchParams.get("artist") || q, "") }, 200, 1800); } catch (e) { return J({ items: [] }); }
      }
      if (p === "/api/home") {
        const shelves = await Promise.all(SHELVES.map(async ([title, how, query]) => {
          try { const items = how === "trending" ? await svTrending() : how === "pl" ? await svPlaylistByQuery(query) : await svSearch(query, 25); return { title, query: query || "trending hindi songs", items: items.slice(0, 20) }; } catch (e) { return { title, query, items: [] }; }
        }));
        return J({ shelves: shelves.filter(s => s.items.length) }, 200, 10800);
      }
      if (p === "/api/sources") {
        if (!/^[\w-]{11}$/.test(v)) return J({ error: "bad id" }, 400);
        return J({ sources: await sources(v) });
      }
      if (p === "/api/p") { // CORS pass-through for YouTube-fallback audio while the equalizer is on
        const t = u.searchParams.get("u") || ""; let host = ""; try { host = new URL(t).hostname; } catch (e) { return J({ error: "bad url" }, 400); }
        const base = h => h.split(".").slice(-2).join(".");
        const ok = /(^|\.)(saavncdn\.com|googlevideo\.com)$/.test(host) || [...(await invList()), ...PIPED].some(b => { try { return base(new URL(b).hostname) === base(host); } catch (e) { return false; } });
        if (!ok) return J({ error: "host not allowed" }, 403);
        const hd = {}; const rg = req.headers.get("range"); if (rg) hd.range = rg;
        const r = await fetch(t, { headers: hd }); const out = new Headers();
        for (const k of ["content-type", "content-length", "content-range", "accept-ranges"]) { const v = r.headers.get(k); if (v) out.set(k, v); }
        out.set("access-control-allow-origin", "*"); return new Response(r.body, { status: r.status, headers: out });
      }
      if (p === "/api/where") { let ip = ""; try { ip = await (await tfetch("https://api.ipify.org", {}, 4000)).text(); } catch (e) {} return J({ colo: req.cf?.colo, country: req.cf?.country, egress: ip }); }
    } catch (e) { return J({ error: scrub(e && e.message || e) }, 500); }
    return env.ASSETS.fetch(req);
  }
};
