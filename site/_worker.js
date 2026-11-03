
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
const songKey = t => String((t && t.title) || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s*[\(\[][^\)\]]*[\)\]]/g, " ").split(/\s+[-\u2013\u2014|]\s+/)[0].replace(/\s+(eclipsa audio|dolby atmos|spatial audio|8d audio|8d|lo-?fi( flip| mix| version)?|slowed( and| &| \+)?( reverb)?|reverb|sped up|remix(ed)?|unplugged|reprise|acoustic|(female|male|sad|duet|new) version|version|title track)(?=\s|$)/g, " ").replace(/[^\p{L}\p{N}]+/gu, "") || "id:" + String(t && t.id); // same song, other release ("(From …)", compilation copy, " - New Version")
async function svRadio(id, artist, lang, title) {
  const seen = new Set([id]), keys = new Set(title ? [songKey({ title })] : []), out = []; // one copy of each song, never the seed song again
  const add = l => { for (const t of l || []) if (t && !seen.has(t.id) && seen.add(t.id) && !keys.has(songKey(t)) && keys.add(songKey(t))) out.push(t); };
  if (id) { try { const r = await sv("reco.getreco", { pid: id }, "android"); add(svList(Array.isArray(r) ? r : (r && r[id]) || [])); } catch (e) {} } // real "similar songs" (the web ctx answers [])
  if (out.length < 5 && id) { try { const r = await sv("reco.getreco", { pid: id }); add(svList(Array.isArray(r) ? r : (r && r[id]) || [])); } catch (e) {} }
  if (out.length < 12 && artist) { try { add(await svSearch(artist.split(",")[0].trim(), 40)); } catch (e) {} }
  if (out.length < 5) { try { add(await svTrending()); } catch (e) {} }
  return out;
}
// ---------- Artists: "Artists" row in search + artist page with every song ("Sab chalao") ----------
const AR_COMBO = /[,&|;+]|\s(feat\.?|ft\.?|x|and|with)\s/i; // "Pritam & Arijit Singh", "A, B" are song credits, not one artist
const AR_STOP = new Set(["songs", "song", "gaane", "gane", "gaana", "gana", "hits", "hit", "best", "top", "new", "latest", "all", "of", "by", "ke", "ki", "ka", "mp3", "music", "lyrics", "video", "audio", "playlist", "jukebox"]);
const arNorm = s => ent(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const arImg = (s, z) => (!s || /artist-default|\/_i\//.test(s)) ? "" : String(s).replace(/(50x50|150x150|500x500)/, z || "500x500");
async function svArtists(q) {
  const words = arNorm(q).split(" ").filter(w => w && !AR_STOP.has(w));
  if (!words.length || words.join("").length < 2) return [];
  const k = "ars:" + words.join(" "); const h = memGet(k); if (h) return h;
  const j = await sv("search.getArtistResults", { q: words.join(" "), n: "20", p: "1" });
  const out = [];
  for (const x of (j && j.results) || []) {
    const name = ent(x.name || "").replace(/[\u2060\u200b\u200c\u200d\ufeff]/g, "").trim();
    if (!name || x.type && x.type !== "artist" || AR_COMBO.test(" " + name + " ")) continue;
    const nw = arNorm(name).split(" ");
    if (!words.every(w => nw.some(n => n.startsWith(w)))) continue; // every word of the search is in the name
    const image = arImg(x.image, "150x150"), ctr = +x.ctr || 0;
    if (!image && !ctr) continue; // nameless duplicates JioSaavn keeps for credits
    out.push({ id: String(x.id), name, image, ctr });
  }
  out.sort((a, b) => (b.ctr > 0) - (a.ctr > 0) || b.ctr - a.ctr);
  const r = (out.some(a => a.image) ? out.filter(a => a.image) : out).slice(0, 8).map(({ id, name, image }) => ({ id, name, image }));
  memSet(k, r, r.length ? 3600 : 30); /* v30: never hold an empty answer for an hour */ return r;
}
// All of an artist's songs: JioSaavn pages of 50 (android ctx; the web ctx gives ~10), one copy of each song (songKey), the artist's own songs first
const AR_MAX = 300;
async function svArtist(id, ctx) {
  const k = "ar2:" + id; const h = memGet(k); if (h) return h;
  const ck = new Request("https://dhun.sites.tab.bot/__cache/ar2/" + id);
  try { const c = await caches.default.match(ck); if (c) { const j = await c.json(); if (j && Array.isArray(j.items) && j.items.length) { memSet(k, j, 1800); return j; } } } catch (e) {}
  const page = p => sv("artist.getArtistPageDetails", { artistId: id, page: String(p), category: "", sort_order: "", n_song: "50", n_album: "0" }, "android").catch(() => null);
  const songsOf = r => { const t = r && r.topSongs; return (Array.isArray(t) ? t : (t && t.songs)) || []; };
  const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);
  let pages = await Promise.all(range(0, 12).map(page));
  const head = pages.find(Boolean);
  if (!head) throw new Error("artist not found");
  const seen = new Set(), keys = new Set(), own = [], feat = [];
  const add = list => { for (const x of list) { if (!x || !x.id || seen.has(x.id) || (x.type && x.type !== "song")) continue; seen.add(x.id); const sk = songKey({ title: ent(x.title || x.song), id: x.id }); if (keys.has(sk)) continue; keys.add(sk); const m = x.more_info || {}; const pa = (m.artistMap && m.artistMap.primary_artists) || []; (pa.some(a => String(a.id) === id) ? own : feat).push(x); } };
  for (const p of pages) add(songsOf(p));
  if (own.length + feat.length < AR_MAX && songsOf(pages[11]).length >= 50) { pages = await Promise.all(range(12, 24).map(page)); for (const p of pages) add(songsOf(p)); }
  const items = svList(own.concat(feat).slice(0, AR_MAX));
  const tt = head.topSongs && !Array.isArray(head.topSongs) ? +head.topSongs.total || 0 : 0;
  const o = { id, name: ent(head.name || ""), image: arImg(head.image, "500x500"), followers: +head.follower_count || +head.fan_count || 0, verified: !!head.isVerified, lang: head.dominantLanguage || "", total: tt, items };
  if (items.length) {
    memSet(k, o, 3 * 3600);
    try { const p = caches.default.put(ck, new Response(JSON.stringify(o), { headers: { "content-type": "application/json", "cache-control": "public, max-age=21600" } })); if (ctx && ctx.waitUntil) ctx.waitUntil(p.catch(() => {})); } catch (e) {}
  }
  return o;
}
async function svArtistByName(name, ctx) { // the now-playing artist name -> that artist's page
  const first = String(name || "").split(/,|&| x | feat\.? | ft\.? /i)[0].trim(); if (!first) throw new Error("no name");
  const l = await svArtists(first); const n = arNorm(first);
  const hit = l.find(a => arNorm(a.name) === n) || l[0]; if (!hit) throw new Error("artist not found");
  return svArtist(hit.id, ctx);
}
// Album page: JioSaavn album (by id, or by one of its songs)
async function svAlbum(id, songId) {
  if (!id && songId) { const j = await sv("song.getDetails", { pids: songId }); const x = j.songs ? j.songs[0] : j[songId]; id = String((x && x.more_info && x.more_info.album_id) || ""); }
  if (!/^\d{1,15}$/.test(id || "")) throw new Error("no album");
  const k = "al:" + id; const h = memGet(k); if (h) return h;
  const d = await sv("content.getAlbumDetails", { albumid: id });
  const m = d.more_info || {}; const pa = ((m.artistMap && m.artistMap.primary_artists) || []).map(a => ent(a.name).trim()).filter(Boolean).slice(0, 3).join(", ");
  const o = { id, kind: "album", name: ent(d.title || "Album"), image: arImg(d.image, "500x500"), year: d.year || "", artist: pa || ent(m.music || d.subtitle || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 3).join(", "), lang: d.language || "", items: svList(d.list) };
  if (o.items.length) memSet(k, o, 6 * 3600); return o;
}
// A JioSaavn playlist as a play-all list (charts): one copy of each song, up to 100
const CHARTS = { hindi: ["1134543272", "Hindi: India Superhits Top 50"], punjabi: ["1134543511", "Punjabi: India Superhits Top 50"], english: ["1134595537", "International : India Superhits Top 50"], bhojpuri: ["1134768973", "Bhojpuri: India Superhits Top 50"], haryanvi: ["1134770917", "Haryanvi: India Superhits Top 50"], trending: ["110858205", "Trending Today"], "80s": ["824691088", "Best Of 80s - Hindi", "best of 80s hindi"], "90s": ["1069828550", "90s Hits - Hindi", "90s hits hindi"], "2000s": ["1167751270", "Hindi 2000s", "hindi 2000s"], "2010s": ["1164340768", "Best Of 2010s - Hindi", "best of 2010s hindi"] }; // v32: decade charts
const dedupeSongs = (l, max) => { const ids = new Set(), keys = new Set(), out = []; for (const t of l) { if (!t || ids.has(t.id)) continue; ids.add(t.id); const sk = songKey(t); if (keys.has(sk)) continue; keys.add(sk); out.push(t); if (out.length >= max) break; } return out; };
async function svPlFull(id, n = 100) {
  const d = await sv("playlist.getDetails", { listid: id, n: String(n), p: "1" });
  return { id, name: ent(d.title || d.listname || "Playlist"), image: arImg(d.image, "500x500"), items: dedupeSongs(svList(d.list), n) };
}
async function svChart(lang) {
  const c = CHARTS[lang]; if (!c) throw new Error("no chart");
  const k = "chart:" + lang; const h = memGet(k); if (h) return h;
  let o = null; try { o = await svPlFull(c[0], 100); } catch (e) {}
  if (!o || o.items.length < 10) { const pr = await sv("search.getPlaylistResults", { q: c[2] || lang + " top 50", n: "3", p: "1" }); const pl = (pr.results || [])[0]; if (pl) o = await svPlFull(pl.id, 100); }
  if (!o || !o.items.length) throw new Error("empty chart");
  o = { ...o, kind: "chart" }; memSet(k, o, 3 * 3600); return o;
}
// Mood mixes: 2-3 editorial JioSaavn playlists for the mood, interleaved, one copy of each song
const MOODS = { romantic: ["romantic hindi", "love songs hindi"], sad: ["sad songs hindi", "heartbreak hindi"], party: ["party hindi", "bollywood party"], gym: ["workout hindi", "gym motivation"], bhakti: ["bhakti songs hindi", "bhajan"], lofi: ["lofi hindi", "lofi bollywood"] };
async function svMood(m) {
  const qs = MOODS[m]; if (!qs) throw new Error("no mood");
  const k = "mood:" + m; const h = memGet(k); if (h) return h;
  const found = [];
  for (const q of qs) { try { const pr = await sv("search.getPlaylistResults", { q, n: "8", p: "1" }); const l = (pr.results || []).filter(x => x && x.id && +((x.more_info || {}).song_count || 0) >= 10); l.sort((a, b) => (((b.more_info || {}).firstname === "JioSaavn") - ((a.more_info || {}).firstname === "JioSaavn"))); for (const x of l) if (!found.includes(x.id)) found.push(x.id); } catch (e) {} if (found.length >= 3) break; }
  const lists = (await Promise.all(found.slice(0, 3).map(id => sv("playlist.getDetails", { listid: id, n: "60", p: "1" }).then(d => svList(d.list)).catch(() => [])))).filter(l => l.length);
  const mixed = []; for (let i = 0; i < 60; i++) for (const l of lists) if (l[i]) mixed.push(l[i]);
  const items = dedupeSongs(mixed, 150);
  if (!items.length) throw new Error("empty mood");
  const o = { id: m, kind: "mood", name: m, image: "", items }; memSet(k, o, 6 * 3600); return o;
}
// Lyrics: lrclib.net (synced LRC when it has it) -> JioSaavn plain lyrics
const lyrClean = s => ent(s).replace(/\s*[\(\[][^\)\]]*[\)\]]/g, " ").split(/\s+[-\u2013\u2014|]\s+/)[0].replace(/\s+/g, " ").trim();
async function lrclib(path, params) {
  const u = new URL("https://lrclib.net/api/" + path); for (const [a, b] of Object.entries(params)) if (b) u.searchParams.set(a, b);
  const r = await tfetch(u.toString(), { headers: { "user-agent": "Dhun/1.0 (https://dhun.sites.tab.bot)", accept: "application/json" } }, 6000);
  if (r.status === 404) return null; if (!r.ok) throw new Error("lrclib " + r.status); return r.json();
}
async function getLyrics(b, ctx) {
  const title = lyrClean(b.title || ""), artist = ent(b.artist || "").split(/,|&| x | feat\.? | ft\.? /i)[0].trim(), dur = Math.round(+b.dur || 0), sid = /^[\w-]{6,12}$/.test(b.id || "") ? b.id : "";
  if (!title) return { synced: "", plain: "", source: "" };
  const k = "lyr2:" + (sid || "") + ":" + title.toLowerCase() + "|" + artist.toLowerCase() + "|" + dur;
  const h = memGet(k); if (h) return h;
  const ck = new Request("https://dhun.sites.tab.bot/__cache/lyr2/" + encodeURIComponent(k));
  try { const c = await caches.default.match(ck); if (c) { const j = await c.json(); memSet(k, j, 3600); return j; } } catch (e) {}
  let hit = null, upstreamOk = false;
  const okDur = x => !dur || !x.duration || Math.abs(x.duration - dur) <= 6;
  const arts = ent(b.artist || "").split(/,|&| x | feat\.? | ft\.? /i).map(x => x.trim()).filter(Boolean).slice(0, 2);
  for (const a of (dur ? arts : [])) { if (hit) break; try { const g = await lrclib("get", { track_name: title, artist_name: a, duration: String(dur) }); upstreamOk = true; if (g && (g.syncedLyrics || g.plainLyrics) && !g.instrumental) hit = g; } catch (e) {} }
  if (!hit || !hit.syncedLyrics) { try { const l = await lrclib("search", { track_name: title, artist_name: artist }); upstreamOk = true; const c = (l || []).filter(x => x && !x.instrumental && (x.syncedLyrics || x.plainLyrics) && okDur(x)); const best = c.find(x => x.syncedLyrics) || c[0]; if (best && (!hit || best.syncedLyrics)) hit = best; } catch (e) {} }
  if (!hit && dur) { try { const l = await lrclib("search", { track_name: title }); upstreamOk = true; const c = (l || []).filter(x => x && !x.instrumental && (x.syncedLyrics || x.plainLyrics) && x.duration && Math.abs(x.duration - dur) <= 3); hit = c.find(x => x.syncedLyrics) || c[0] || null; } catch (e) {} }
  if (!hit) { try { const l = await lrclib("search", { q: title + " " + artist }); upstreamOk = true; const tn = title.toLowerCase(); const c = (l || []).filter(x => x && !x.instrumental && (x.syncedLyrics || x.plainLyrics) && okDur(x) && String(x.trackName || "").toLowerCase().includes(tn)); hit = c.find(x => x.syncedLyrics) || c[0] || null; } catch (e) {} }
  let o = hit ? { synced: hit.syncedLyrics || "", plain: hit.plainLyrics || "", source: "lrclib" } : null;
  if (!o && sid) { try { const j = await sv("lyrics.getLyrics", { lyrics_id: sid }); upstreamOk = true; const t = ent(String((j && j.lyrics) || "")).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim(); if (t) o = { synced: "", plain: t, source: "jiosaavn" }; } catch (e) {} }
  if (!o) o = { synced: "", plain: "", source: "" };
  if (o.plain || o.synced || upstreamOk) {
    memSet(k, o, o.plain || o.synced ? 6 * 3600 : 1800);
    try { const p = caches.default.put(ck, new Response(JSON.stringify(o), { headers: { "content-type": "application/json", "cache-control": `public, max-age=${o.plain || o.synced ? 86400 : 3600}` } })); if (ctx && ctx.waitUntil) ctx.waitUntil(p.catch(() => {})); } catch (e) {}
  }
  return o;
}
async function svAlbumsSearch(q) {
  const words = arNorm(q).split(" ").filter(w => w && !AR_STOP.has(w)); if (!words.length) return [];
  const k = "als:" + words.join(" "); const h = memGet(k); if (h) return h;
  const j = await sv("search.getAlbumResults", { q: words.join(" "), n: "10", p: "1" });
  const r = ((j && j.results) || []).filter(x => x && x.id && (!x.type || x.type === "album")).map(x => ({ id: String(x.id), name: ent(x.title || ""), image: arImg(x.image, "150x150"), year: x.year || "", sub: ent((x.more_info && x.more_info.music) || x.subtitle || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 2).join(", ") })).filter(a => a.name && a.image).filter((a, i, l) => l.findIndex(b => b.name.toLowerCase() === a.name.toLowerCase() && b.year === a.year) === i).slice(0, 8);
  memSet(k, r, 3600); return r;
}
async function svRadioLong(id, artist, lang, title) { // "Radio shuru karo": a long queue — similar songs, then songs similar to those, then the artist's hits
  const out = await svRadio(id, artist, lang, title);
  const seen = new Set([id, ...out.map(t => t.id)]), keys = new Set([songKey({ title }), ...out.map(songKey)]);
  const add = l => { for (const t of l || []) if (t && !seen.has(t.id) && !keys.has(songKey(t))) { seen.add(t.id); keys.add(songKey(t)); out.push(t); } };
  const pick = out.filter((t, i) => i % 2 === 0).slice(0, 6);
  const more = await Promise.all(pick.map(t => sv("reco.getreco", { pid: t.id }, "android").then(r => svList(Array.isArray(r) ? r : (r && r[t.id]) || [])).catch(() => [])));
  for (let i = 0; i < 20; i++) add(more.map(l => l[i]));
  const names = [...new Set([artist, ...out.slice(0, 6).map(t => t.artist)].map(a => String(a || "").split(",")[0].trim()).filter(Boolean))].slice(0, 3);
  if (out.length < 60 && names.length) { const l = await Promise.all(names.slice(0, 2).map(n => svArtistTop(n).catch(() => []))); for (let i = 0; i < 60; i++) add(l.map(x => x[i])); }
  return out.slice(0, 100);
}
async function svArtistTop(name) { // an artist's most played songs (2 pages), for radio
  const k = "art:" + arNorm(name); const h = memGet(k); if (h) return h;
  const l = await svArtists(name); const n = arNorm(name); const a = l.find(x => arNorm(x.name) === n) || l[0]; if (!a) return [];
  const full = memGet("ar2:" + a.id); if (full) return full.items.slice(0, 80);
  const pages = await Promise.all([0, 1].map(p => sv("artist.getArtistPageDetails", { artistId: a.id, page: String(p), category: "", sort_order: "", n_song: "50", n_album: "0" }, "android").catch(() => null)));
  const raw = []; for (const r of pages) { const t = r && r.topSongs; for (const x of (Array.isArray(t) ? t : (t && t.songs)) || []) raw.push(x); }
  const items = dedupeSongs(svList(raw), 80); memSet(k, items, 3 * 3600); return items;
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
const LINK_BTNS = site => ({ parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🌐 Open Dhun", url: site }, { text: "📱 Android App", url: site + APK_PATH }], [{ text: "📢 Updates Channel", url: "https://t.me/rg_botz" }]] } });
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
      const j = JSON.stringify(body[k]); if (j.length > (k === "playlists" ? 1500000 : 400000)) return J({ error: "too big: " + k }, 413);
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

// ---- Deals: latest posts of a public Telegram channel (t.me/s web preview), cached ~20 min, fail soft ----
const DEALS_DEFAULT = "bestdeal_shoppingonline";
const dealsChannel = env => (String((env && env.DEALS_CHANNEL) || DEALS_DEFAULT).replace(/^@/, "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 64)) || DEALS_DEFAULT;
const dUnesc = s => String(s || "").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (m, n) => { try { return String.fromCodePoint(+n); } catch (e) { return ""; } }).replace(/&#x([0-9a-f]+);/gi, (m, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch (e) { return ""; } }).replace(/&amp;/g, "&");
const dealCut = (s, n) => { const a = Array.from(s); return a.length <= n ? s : a.slice(0, n - 1).join("").replace(/[\s·|,:-]+\S*$/u, "").trim() + "…"; };
function parseDeals(html, ch) {
  const out = [];
  for (const m of String(html).split('class="tgme_widget_message_wrap').slice(1)) {
    const pm = m.match(/data-post="[A-Za-z0-9_]+\/(\d+)"/); if (!pm) continue;
    const postUrl = `https://t.me/${ch}/${pm[1]}`;
    const tm = m.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/); if (!tm) continue;
    const th = tm[1];
    const links = [...new Set([...th.matchAll(/<a\s[^>]*?href="([^"]+)"/g)].map(x => dUnesc(x[1]).trim()))].filter(h => /^https:\/\/[^\s"'<>]+$/.test(h) && !/^https:\/\/(t\.me|telegram\.me|telegram\.org)\//i.test(h)).slice(0, 8);
    const raw = dUnesc(th.replace(/<br\s*\/?>/gi, "\n").replace(/<i class="emoji"[^>]*>\s*<b>([^<]*)<\/b>\s*<\/i>/g, "$1").replace(/<[^>]+>/g, ""));
    const lines = raw.split("\n").map(l => l.replace(/https?:\/\/\S+/g, "").replace(/(^|\s)#\w+/g, " ").replace(/prices?\s*\/\s*stock may change/ig, "").replace(/\b(link|buy now|shop now|grab now|order now|click here)\s*[:\-]?\s*$/i, "").replace(/\s+/g, " ").replace(/^[\s|:•·\-–🔗👉➡]+|[\s|:•·\-–🔗👉➡]+$/gu, "").trim()).filter(l => Array.from(l).length > 2 && !/commission|maximi[sz]e earnings|affiliate/i.test(l));
    if (!lines.length) continue;
    const text = dealCut(lines.join(" · "), 90);
    const im = m.match(/tgme_widget_message_(?:photo_wrap|video_thumb|link_preview_image)[^>]*?background-image:url\('([^']+)'\)/);
    let img = im ? dUnesc(im[1]) : ""; if (img.startsWith("//")) img = "https:" + img;
    if (!/^https:\/\/[a-z0-9.-]*(telesco\.pe|telegram\.org|telegram-cdn\.org)\/[^\s"'<>()]+$/i.test(img)) img = "";
    out.push({ text, url: links.length === 1 ? links[0] : postUrl, postUrl, img: img || undefined, links: links.length });
  }
  return out.reverse().slice(0, 10); // newest first
}
async function getDeals(env, ctx) {
  const ch = dealsChannel(env), key = "deals:" + ch;
  const hit = memGet(key); if (hit) return hit;
  const ck = new Request("https://dhun.sites.tab.bot/__cache/deals/" + ch);
  try { const c = await caches.default.match(ck); if (c) { const j = await c.json(); if (j && Array.isArray(j.items) && j.items.length) { memSet(key, j, 300); return j; } } } catch (e) {}
  let items = [], err = "";
  try { const r = await tfetch(`https://t.me/s/${ch}`, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36", "accept-language": "en" } }, 8000); if (r.ok) items = parseDeals(await r.text(), ch); else err = "http " + r.status; } catch (e) { err = String((e && e.message) || e); }
  if (!items.length) { const last = memGet("dealsLast:" + ch); if (last) { memSet(key, last, 120); return last; } }
  const out = { channel: ch, join: `https://t.me/${ch}`, items, at: Date.now(), ...(items.length ? {} : { note: err || "no public posts" }) };
  memSet(key, out, items.length ? 1200 : 120);
  if (items.length) {
    memSet("dealsLast:" + ch, out, 86400);
    try { const p = caches.default.put(ck, new Response(JSON.stringify(out), { headers: { "content-type": "application/json", "cache-control": "public, max-age=1200" } })); if (ctx && ctx.waitUntil) ctx.waitUntil(p.catch(() => {})); } catch (e) {}
  }
  return out;
}


// ---------- Playlist import: public Spotify / Apple Music links -> track list; JioSaavn matching ----------
const IMP_MAX = 300;
const DESK_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
class ImpErr extends Error { constructor(code, msg) { super(msg || code); this.code = code; } }
function impParse(raw) {
  let s = String(raw || "").trim();
  const sm = s.match(/spotify:(playlist|album):([A-Za-z0-9]{10,40})/); if (sm) return { src: "spotify", kind: sm[1], id: sm[2] };
  const m = s.match(/https?:\/\/[^\s<>"']+/); if (m) s = m[0]; else if (/^[a-z0-9.-]+\.[a-z]{2,}\//i.test(s)) s = "https://" + s;
  let u; try { u = new URL(s); } catch (e) { return null; }
  const h = u.hostname.toLowerCase();
  if (/(^|\.)spotify\.link$/.test(h) || /(^|\.)spotify\.app\.link$/.test(h) || h === "spoti.fi") return { src: "spotify", short: u.href };
  if (/(^|\.)spotify\.com$/.test(h)) {
    const mm = u.pathname.match(/\/(playlist|album)\/([A-Za-z0-9]{10,40})/); if (mm) return { src: "spotify", kind: mm[1], id: mm[2] };
    if (/\/(track|artist|episode|show)\//.test(u.pathname)) return { src: "spotify", bad: "kind" };
    return null;
  }
  if (/(^|\.)music\.apple\.com$/.test(h) || h === "itunes.apple.com") {
    const mm = u.pathname.match(/^\/([a-z]{2})\/(playlist|album)\/(?:[^/]+\/)?(pl\.[A-Za-z0-9._-]+|\d{3,})/i);
    if (mm) return { src: "apple", sf: mm[1].toLowerCase(), kind: mm[2].toLowerCase(), id: mm[3] };
    const m2 = u.pathname.match(/^\/(playlist|album)\/(?:[^/]+\/)?(pl\.[A-Za-z0-9._-]+|\d{3,})/i);
    if (m2) return { src: "apple", sf: "in", kind: m2[1].toLowerCase(), id: m2[2] };
    if (/\/(song|artist|station|music-video)\//.test(u.pathname)) return { src: "apple", bad: "kind" };
    return null;
  }
  return null;
}
const impArtists = s => String(s || "").replace(/\u00a0/g, " ").trim();
async function spResolveShort(href) {
  const r = await tfetch(href, { headers: { "user-agent": DESK_UA }, redirect: "follow" }, 8000);
  const fin = impParse(r.url); if (fin && fin.id) return fin;
  const body = await r.text(); const m = body.match(/https:\/\/open\.spotify\.com\/(playlist|album)\/([A-Za-z0-9]{10,40})/);
  if (m) return { src: "spotify", kind: m[1], id: m[2] };
  throw new ImpErr("bad_url", "Short link khul nahi raha");
}
async function spImport(kind, id) {
  const r = await tfetch(`https://open.spotify.com/embed/${kind}/${id}`, { headers: { "user-agent": DESK_UA, "accept-language": "en" } }, 9000);
  if (r.status === 404) throw new ImpErr("private");
  if (!r.ok) throw new ImpErr("upstream", "Spotify " + r.status);
  const html = await r.text();
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new ImpErr("upstream", "Spotify page changed");
  const pp = (JSON.parse(m[1]).props || {}).pageProps || {};
  const st = pp.state || {}, e = st.data && st.data.entity;
  if (!e || pp.status === 404) throw new ImpErr("private");
  const tracks = (e.trackList || []).filter(t => t && t.title && (!t.entityType || t.entityType === "track")).map(t => ({ title: t.title, artists: impArtists(t.subtitle), dur: Math.round((t.duration || 0) / 1000) }));
  const srcs = (e.coverArt && e.coverArt.sources) || [];
  const cover = (srcs.slice().sort((a, b) => (b.width || 0) - (a.width || 0))[0] || {}).url || "";
  const out = { source: "spotify", kind, id, name: e.name || e.title || "Spotify playlist", owner: impArtists(e.subtitle), cover, tracks, total: tracks.length };
  const tok = st.settings && st.settings.session && st.settings.session.accessToken;
  if (kind === "playlist" && tracks.length >= 100 && tok) { // embed shows 100 — page the rest through the web player's public query (fail soft)
    try {
      for (let off = 100; off < IMP_MAX; off += 100) {
        const qs = new URLSearchParams({ operationName: "fetchPlaylist", variables: JSON.stringify({ uri: `spotify:playlist:${id}`, offset: off, limit: 100 }), extensions: JSON.stringify({ persistedQuery: { version: 1, sha256Hash: "76849d094f1ac9870ac9dbd5731bde5dc228264574b5f5d8cbc8f5a8f2f26116" } }) });
        const pr = await tfetch("https://api-partner.spotify.com/pathfinder/v1/query?" + qs, { headers: { authorization: "Bearer " + tok, "user-agent": DESK_UA, "app-platform": "WebPlayer" } }, 9000);
        if (!pr.ok) break;
        const pj = await pr.json(); const c = pj && pj.data && pj.data.playlistV2 && pj.data.playlistV2.content; if (!c) break;
        if (c.totalCount) out.total = c.totalCount;
        const items = (c.items || []).map(x => x && x.itemV2 && x.itemV2.data).filter(d => d && d.name && d.__typename === "Track");
        for (const d of items) out.tracks.push({ title: d.name, artists: ((d.artists && d.artists.items) || []).map(a => a.profile && a.profile.name).filter(Boolean).join(", "), dur: Math.round(((d.trackDuration && d.trackDuration.totalMilliseconds) || 0) / 1000) });
        if ((c.items || []).length < 100) break;
      }
    } catch (e2) {}
  }
  return out;
}
async function amToken(env, fresh) {
  const k = "amtok"; if (!fresh) { const h = memGet(k); if (h) return h; }
  let d = null; try { d = await db(env); } catch (e) {}
  if (!fresh && d) { try { const v = await kvGet(d, k); if (v) { const o = JSON.parse(v); if (o.exp > Date.now() / 1000 + 3600) { memSet(k, o.t, 3600); return o.t; } } } catch (e) {} }
  const r = await tfetch("https://music.apple.com/us/browse", { headers: { "user-agent": DESK_UA } }, 9000); const html = await r.text();
  const js = (html.match(/\/assets\/index[^"'\s]*?\.js/) || [])[0]; if (!js) throw new ImpErr("upstream", "Apple Music page changed");
  const src = await (await tfetch("https://music.apple.com" + js, { headers: { "user-agent": DESK_UA } }, 12000)).text();
  const i = src.indexOf('"eyJ'); if (i < 0) throw new ImpErr("upstream", "Apple Music token not found");
  const t = src.slice(i + 1, src.indexOf('"', i + 1));
  let exp = Date.now() / 1000 + 7 * 86400; try { exp = JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).exp || exp; } catch (e) {}
  memSet(k, t, 3600); if (d) { try { await kvSet(d, k, JSON.stringify({ t, exp })); } catch (e) {} }
  return t;
}
async function amGet(env, path) {
  for (let i = 0; i < 2; i++) {
    const tok = await amToken(env, i > 0);
    const r = await tfetch("https://amp-api.music.apple.com" + path, { headers: { authorization: "Bearer " + tok, origin: "https://music.apple.com", "user-agent": DESK_UA } }, 9000);
    if (r.status === 401 || r.status === 403) continue;
    if (r.status === 404) throw new ImpErr("private");
    if (!r.ok) throw new ImpErr("upstream", "Apple Music " + r.status);
    return r.json();
  }
  throw new ImpErr("upstream", "Apple Music refused");
}
async function amImport(env, sf, kind, id) {
  const typ = kind === "album" ? "albums" : "playlists";
  const j = await amGet(env, `/v1/catalog/${sf}/${typ}/${encodeURIComponent(id)}?include=tracks&l=en-GB`);
  const d = j && j.data && j.data[0]; if (!d) throw new ImpErr("private");
  const a = d.attributes || {}, rel = (d.relationships && d.relationships.tracks) || {};
  const map = x => { const t = x.attributes || {}; return { title: t.name, artists: t.artistName || "", dur: Math.round((t.durationInMillis || 0) / 1000), album: t.albumName || "" }; };
  const tracks = (rel.data || []).filter(x => x && x.attributes && x.attributes.name).map(map);
  let next = rel.next;
  while (next && tracks.length < IMP_MAX) {
    try { const p = await amGet(env, next + (next.includes("?") ? "&" : "?") + "l=en-GB"); (p.data || []).filter(x => x && x.attributes && x.attributes.name).forEach(x => tracks.push(map(x))); next = p.next; } catch (e) { break; }
  }
  const art = a.artwork && a.artwork.url ? a.artwork.url.replace("{w}", "500").replace("{h}", "500").replace("{f}", "jpg").replace("{c}", "cc") : "";
  return { source: "apple", kind, id, name: a.name || "Apple Music playlist", owner: a.curatorName || a.artistName || "", cover: art, tracks, total: a.trackCount || tracks.length };
}
async function impFetch(env, raw) {
  let p = impParse(raw);
  if (!p) throw new ImpErr("bad_url");
  if (p.bad) throw new ImpErr("kind");
  if (p.short) p = await spResolveShort(p.short);
  const key = `imp:${p.src}:${p.kind}:${p.id}`; const hit = memGet(key); if (hit) return hit;
  const o = p.src === "spotify" ? await spImport(p.kind, p.id) : await amImport(env, p.sf, p.kind, p.id);
  if (!o.tracks.length) throw new ImpErr("empty");
  o.tracks = o.tracks.slice(0, IMP_MAX); o.capped = o.total > o.tracks.length;
  memSet(key, o, 600);
  return o;
}
const IMP_MSG = { bad_url: "Ye Spotify / Apple Music playlist link nahi lag raha. Playlist → Share → Copy link karke paste karo.", kind: "Ye ek gaane/artist ka link hai. Poori playlist ya album ka link paste karo.", private: "Playlist nahi khuli. Playlist public karo (share link) aur dobara try karo.", empty: "Is playlist me koi gaana nahi mila.", upstream: "Abhi playlist load nahi ho payi, thodi der me try karo." };
// --- matching ---
const impNorm = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/[’'`]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function impCleanTitle(s) {
  return String(s || "")
    .replace(/\s*[\(\[][^\)\]]*\b(from|feat\.?|ft\.?|featuring|with|remaster(ed)?|version|edit|mix|live|lofi|lo-fi|slowed|reverb|sped up|bonus|explicit|clean|original|soundtrack|ost)\b[^\)\]]*[\)\]]/gi, " ")
    .replace(/\s+-\s+(from|feat|ft|remaster|remastered|\d{4} remaster|live|radio edit|single version|.*\bversion\b).*$/i, " ")
    .replace(/\s+(feat\.?|ft\.?|featuring)\s.+$/i, " ")
    .replace(/\s{2,}/g, " ").trim() || String(s || "").trim();
}
const impToks = s => impNorm(s).split(" ").filter(Boolean);
function impDice(a, b) {
  const A = impToks(a), B = impToks(b); if (!A.length || !B.length) return 0;
  const sa = A.join(""), sb = B.join(""); if (sa === sb) return 1;
  const big = x => { const m = new Map(); for (let i = 0; i < x.length - 1; i++) { const g = x.slice(i, i + 2); m.set(g, (m.get(g) || 0) + 1); } return m; };
  const ma = big(sa), mb = big(sb); let inter = 0; for (const [g, n] of ma) inter += Math.min(n, mb.get(g) || 0);
  const tot = Math.max(1, sa.length - 1 + sb.length - 1); let d = 2 * inter / tot;
  if (sa.length >= 4 && sb.length >= 4 && (sa.startsWith(sb) || sb.startsWith(sa))) d = Math.max(d, 0.85);
  return d;
}
const impArtList = s => String(s || "").split(/\s*(?:,|&|\band\b|\bx\b|\bfeat\.?|\bft\.?|\bwith\b|\/)\s*/i).map(impNorm).filter(x => x.length > 1);
function impScore(t, c) {
  const ts = impDice(impCleanTitle(t.title), impCleanTitle(c.title));
  const want = impArtList(t.artists), have = impNorm(c.artist + " " + (c.album || ""));
  let as = 0.5; if (want.length) { const hit = want.filter(w => have.includes(w) || w.split(" ").filter(p => p.length > 2).some(p => have.split(" ").includes(p))).length; as = hit / want.length; }
  let ds = 0; if (t.dur && c.dur) { const df = Math.abs(t.dur - c.dur); ds = df <= 4 ? 0.12 : df <= 12 ? 0.05 : df > 40 ? -0.2 : 0; }
  let sc = 0.62 * ts + 0.3 * as + ds;
  if (want.length && as === 0) sc -= (ds >= 0.12 && ts >= 0.95) ? 0.22 : 0.3; // same title, different singer = usually a cover / another song
  const vt = impNorm(t.title), vc = impNorm(c.title); for (const w of ["unplugged", "remix", "lofi", "slowed", "reprise", "cover", "instrumental", "karaoke", "acoustic", "female", "sad", "extended", "mashup", "live", "8d"]) { const re = new RegExp("\\b" + w + "\\b"); if (re.test(vc) !== re.test(vt)) sc -= 0.12; }
  return sc;
}
async function impMatchOne(t) {
  const title = impCleanTitle(t.title), art1 = impArtList(t.artists)[0] || "";
  const mk = "impm:" + impNorm(title) + "|" + art1 + "|" + (t.dur || 0); const hit = memGet(mk); if (hit !== null && hit !== undefined) return hit.t;
  let best = null, bs = -1;
  const consider = list => { for (const c of list || []) { const s = impScore(t, c); if (s > bs) { bs = s; best = c; } } };
  try { consider(await svSearch(`${title} ${String(t.artists || "").split(",")[0]}`.trim(), 8)); } catch (e) {}
  if (bs < 0.78) { try { consider(await svSearch(title, 10)); } catch (e) {} }
  const arts = String(t.artists || "").split(/\s*(?:,|&)\s*/).filter(Boolean);
  if (bs < 0.7 && arts.length > 1) { try { consider(await svSearch(`${title} ${arts[1]}`, 8)); } catch (e) {} }
  const out = bs >= 0.55 ? { ...best, score: Math.round(bs * 100) / 100 } : null;
  memSet(mk, { t: out }, 3600);
  return out;
}
async function impMatch(tracks) {
  const list = (Array.isArray(tracks) ? tracks : []).slice(0, 10).map(t => ({ title: String((t && t.title) || "").slice(0, 200), artists: String((t && t.artists) || "").slice(0, 300), dur: +(t && t.dur) || 0 }));
  return Promise.all(list.map(t => t.title ? impMatchOne(t).catch(() => null) : null));
}
async function impBody(req) { try { const t = await req.text(); return t ? JSON.parse(t) : {}; } catch (e) { return {}; } }

// ---------- Per-user listening history (signed-in users; kept in D1 kv "uh:<chat_id>", never mixed between users) ----------
function histMerge(a, b) { // {songs:[{id,title,artist,album,lang,thumb,n,first,last}], days:{"YYYY-MM-DD":{t: seconds listened, p: plays, s:{id:plays}}}}
  const out = { songs: [], days: {} }; const by = new Map();
  for (const src of [a, b]) for (const s of ((src && src.songs) || [])) {
    if (!s || !s.id) continue; const o = by.get(s.id);
    if (!o) by.set(s.id, { ...s }); else { o.n = Math.max(o.n || 0, s.n || 0); o.first = Math.min(o.first || s.first || 0, s.first || o.first || 0); if ((s.last || 0) > (o.last || 0)) { o.last = s.last; for (const k of ["title", "artist", "album", "lang", "thumb"]) if (s[k]) o[k] = s[k]; } }
  }
  out.songs = [...by.values()].sort((x, y) => (y.last || 0) - (x.last || 0)).slice(0, 1500);
  for (const src of [a, b]) for (const [day, v] of Object.entries((src && src.days) || {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !v) continue; const o = out.days[day] || (out.days[day] = { t: 0, p: 0, s: {} });
    o.t = Math.max(o.t || 0, +v.t || 0); o.p = Math.max(o.p, +v.p || 0); for (const [id, n] of Object.entries(v.s || {})) o.s[id] = Math.max(o.s[id] || 0, +n || 0);
  }
  const keep = Object.keys(out.days).sort().slice(-400); const nd = {}; for (const k of keep) nd[k] = out.days[k]; out.days = nd;
  return out;
}
async function userHist(env, ctx, body) {
  const d = await db(env); const u = await userOf(d, body.c, ctx);
  if (!u || !u.chat_id || !u.linked) return J({ error: "not_linked" }, 401);
  const k = "uh:" + u.chat_id; let cur = { songs: [], days: {} };
  try { const v = await kvGet(d, k); if (v) cur = JSON.parse(v); } catch (e) {}
  if (body.op === "put" && body.h && typeof body.h === "object") {
    cur = histMerge(cur, body.h);
    let j = JSON.stringify(cur);
    while (j.length > 1800000 && cur.songs.length > 200) { cur.songs = cur.songs.slice(0, Math.floor(cur.songs.length * 0.8)); j = JSON.stringify(cur); }
    await kvSet(d, k, j);
  }
  return J({ ok: true, h: cur });
}
// ---------- For You: recommendations from the user's own top songs / artists / languages ----------
const svImg = s => String(s || "").replace(/(150x150|50x50)/, "500x500");
const svPl = x => x && x.id ? { id: String(x.id), title: ent(x.title || x.listname || ""), image: svImg(x.image), count: +((x.more_info && x.more_info.song_count) || x.count || 0) || 0 } : null;
function dayShuffle(arr, seed) { let h = 2166136261; for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
async function svCharts() { const k = "svcharts"; const h = memGet(k); if (h) return h; let out = []; try { const r = await sv("content.getCharts", {}); out = (Array.isArray(r) ? r : []).map(svPl).filter(Boolean); } catch (e) {} if (out.length) memSet(k, out, 6 * 3600); return out; }
async function svFeatured() { const k = "svfeat"; const h = memGet(k); if (h) return h; let out = []; try { const r = await sv("content.getFeaturedPlaylists", { n: "50", p: "1" }); out = ((r && r.data) || []).map(svPl).filter(Boolean); } catch (e) {} if (out.length) memSet(k, out, 6 * 3600); return out; }
async function forYou(b) {
  const seeds = (Array.isArray(b.seeds) ? b.seeds : []).map(String).filter(x => /^[\w-]{4,20}$/.test(x)).slice(0, 6);
  const artists = (Array.isArray(b.artists) ? b.artists : []).map(x => String(x).slice(0, 60)).filter(Boolean).slice(0, 3);
  const langs = (Array.isArray(b.langs) ? b.langs : []).map(x => String(x).toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean).slice(0, 2);
  const excl = new Set([...(Array.isArray(b.exclude) ? b.exclude : []).map(String).slice(0, 400), ...seeds]);
  const day = String(b.day || "").slice(0, 10);
  const key = "fy:" + JSON.stringify([seeds, artists, langs, day]); const hit = memGet(key);
  let songs = [], playlists = [], mode = seeds.length ? "personal" : "trending";
  if (hit) { songs = hit.songs; playlists = hit.playlists; mode = hit.mode; }
  else {
    const jobs = [];
    if (seeds.length) {
      jobs.push((async () => { const st = await sv("webradio.createEntityStation", { entity_id: JSON.stringify(seeds.slice(0, 5)), entity_type: "queue" }, "android"); if (!st || !st.stationid) return []; const r = await sv("webradio.getSong", { stationid: st.stationid, k: "30", next: "1" }, "android"); return svList(Object.values(r || {}).map(x => x && x.song).filter(Boolean)); })().catch(() => []));
      for (const id of seeds.slice(0, 3)) jobs.push(sv("reco.getreco", { pid: id }, "android").then(r => svList(Array.isArray(r) ? r : (r && r[id]) || [])).catch(() => []));
    }
    for (const a of artists.slice(0, 2)) jobs.push(svSearch(a, 15).catch(() => []));
    if (!seeds.length) jobs.push(svTrending().catch(() => []));
    const res = await Promise.all(jobs);
    const seen = new Set(); const pool = [];
    // interleave sources so one seed doesn't dominate
    const tk = t => impNorm(impCleanTitle(t.title)) + "|" + impNorm(String(t.artist || "").split(",")[0]);
    for (let i = 0; i < 40; i++) for (const list of res) { const t = list[i]; if (t && !seen.has(t.id) && !seen.has(tk(t)) && !excl.has(t.id)) { seen.add(t.id); seen.add(tk(t)); pool.push(t); } }
    songs = seeds.length ? dayShuffle(pool.slice(0, 36), day + seeds.join()).slice(0, 20) : pool.slice(0, 20);
    if (songs.length < 8) { try { const tr = await svTrending(); for (const t of tr) if (!seen.has(t.id) && songs.length < 20) { seen.add(t.id); songs.push(t); } } catch (e) {} }
    // playlists: artist playlists + charts/featured in the user's languages
    const pls = []; const pseen = new Set(); const addP = p => { if (p && !pseen.has(p.id) && p.title) { pseen.add(p.id); pls.push(p); } };
    const pj = artists.slice(0, 3).map(a => { const an = impNorm(a); return sv("search.getPlaylistResults", { q: a, n: "6", p: "1" }).then(r => ((r && r.results) || []).map(svPl).filter(p => p && impNorm(p.title).includes(an)).slice(0, 2)).catch(() => []); });
    const [charts, feat, ...ap] = await Promise.all([svCharts(), svFeatured(), ...pj]);
    ap.forEach(l => l.forEach(addP));
    const langRe = langs.length ? new RegExp("\\b(" + langs.join("|") + ")\\b", "i") : null;
    for (const p of charts) if (!langRe || langRe.test(p.title)) addP(p);
    for (const p of feat) if (langRe && langRe.test(p.title)) addP(p);
    if (pls.length < 6) for (const p of charts.concat(feat)) { if (pls.length >= 10) break; addP(p); }
    playlists = pls.slice(0, 10);
    memSet(key, { songs, playlists, mode }, 3 * 3600);
  }
  return { mode, songs, playlists };
}
async function svPlaylist(id) {
  const k = "svpl:" + id; const h = memGet(k); if (h) return h;
  const d = await sv("playlist.getDetails", { listid: id, n: "60", p: "1" });
  const o = { id, title: ent(d.title || d.listname || "Playlist"), image: svImg(d.image), items: svList(d.list) };
  if (o.items.length) memSet(k, o, 3600); return o;
}

// ---------- Listen Together (Jam): shared rooms in D1, clients poll ~1.5 s and sync by server time ----------
const JAM_MAX = 10, JAM_TTL = 6 * 3600e3, JAM_ALIVE = 30e3, JAM_ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
let jamReady = null;
function jamDb(env) {
  if (!env.DB) throw new Error("store missing");
  const d = env.DB;
  if (!jamReady) jamReady = d.batch([
    d.prepare("CREATE TABLE IF NOT EXISTS jam (code TEXT PRIMARY KEY, st TEXT, rev INTEGER, created INTEGER, upd INTEGER)"),
    d.prepare("CREATE TABLE IF NOT EXISTS jamm (code TEXT, mid TEXT, name TEXT, seen INTEGER, joined INTEGER, PRIMARY KEY (code, mid))"),
    d.prepare("CREATE TABLE IF NOT EXISTS jamc (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, mid TEXT, name TEXT, txt TEXT, ts INTEGER)"),
    d.prepare("CREATE INDEX IF NOT EXISTS jamc_code ON jamc (code, id)"),
  ]).catch(e => { jamReady = null; throw e; });
  return jamReady.then(() => d);
}
const jamStr = (s, n) => String(s ?? "").slice(0, n);
const jamHttps = (s, n) => { s = jamStr(s, n); return /^https:\/\//.test(s) ? s : ""; };
function jamTrack(t) {
  if (!t || typeof t !== "object" || !t.id) return null;
  const o = { id: jamStr(t.id, 80), title: jamStr(t.title, 200), artist: jamStr(t.artist, 200), album: jamStr(t.album, 200), dur: Math.max(0, Math.min(36000, Number(t.dur) || 0)), thumb: jamHttps(t.thumb, 600) };
  const url = jamHttps(t.url, 1200); if (url) o.url = url;
  if (t.src) o.src = jamStr(t.src, 12); if (t.sid) o.sid = jamStr(t.sid, 80); if (t.lang) o.lang = jamStr(t.lang, 30);
  return o;
}
const jamList = (a, n) => (Array.isArray(a) ? a : []).map(jamTrack).filter(Boolean).slice(0, n);
const jamName = s => jamStr(String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim(), 24) || "Dost";
const jamMid = s => /^[\w-]{6,40}$/.test(String(s || "")) ? String(s) : "";
const jamPos = (st, now) => !st.song ? 0 : Math.max(0, st.playing ? st.pos + (now - st.at) / 1000 : st.pos);
function jamApply(st, a, who, now) { // returns true if the state changed
  const t = String(a && a.t || ""), cur = jamPos(st, now);
  const ev = (x, extra) => { st.ev = Object.assign({ t: x }, extra || {}); st.by = who; };
  const startSong = (song, x) => { if (st.song && (!song || song.id !== st.song.id)) { st.hist = (st.hist || []).concat([st.song]).slice(-30); } st.song = song; st.pos = 0; st.at = now; st.playing = !!song; ev(x, { title: song ? song.title : "" }); };
  const fillQ = f => { const l = jamList(f, 30); return l; };
  if (t === "play") { if (!st.song) return false; st.pos = a.pos != null && isFinite(+a.pos) ? Math.max(0, +a.pos) : cur; st.at = now; st.playing = true; ev("play"); return true; }
  if (t === "pause") { if (!st.song) return false; st.pos = a.pos != null && isFinite(+a.pos) ? Math.max(0, +a.pos) : cur; st.at = now; st.playing = false; ev("pause"); return true; }
  if (t === "seek") { if (!st.song || !isFinite(+a.pos)) return false; st.pos = Math.max(0, +a.pos); st.at = now; ev("seek", { from: Math.round(cur), to: Math.round(st.pos) }); return true; }
  if (t === "song") {
    const s = jamTrack(a.track); if (!s) return false;
    const lst = a.list ? jamList(a.list, 100).filter(x => x.id !== s.id) : null, ev2 = a.rq ? "station" : "song";
    if (st.song && st.song.id === s.id && !(st.song.dur && cur > st.song.dur - 1.5)) { // the song already playing: keep its place (never back to 0:00)
      if (lst && (a.rq || !(st.queue || []).length)) st.queue = lst;
      st.pos = cur; st.at = now; st.playing = true; ev(ev2, { title: s.title, same: 1 }); return true;
    }
    st.queue = a.rq && lst ? lst : (st.queue || []).filter(x => x.id !== s.id); if (!st.queue.length && lst) st.queue = lst; startSong(s, ev2); return true;
  }
  if (t === "next" || t === "ended") {
    if (t === "ended" && (!st.song || st.song.id !== String(a.id || ""))) return false; // someone already moved on
    let q = st.queue || [];
    if (t === "ended" && st.song) { const k = songKey(st.song); let i = 0; while (i < q.length && songKey(q[i]) === k) i++; q = q.slice(i); if (!q.length) q = fillQ(a.fill).filter(x => songKey(x) !== k); } // never 'next' into a copy of the song that just ended
    if (!q.length) q = fillQ(a.fill);
    const s = q[0] || null; st.queue = q.slice(1);
    if (!s) { if (t === "ended") { st.pos = 0; st.at = now; st.playing = false; ev("stop"); return true; } return false; }
    startSong(s, t); return true;
  }
  if (t === "prev") { const h = st.hist || []; if (!h.length) { st.pos = 0; st.at = now; ev("seek", { from: Math.round(cur), to: 0 }); return true; } const s = h.pop(); st.hist = h; if (st.song) st.queue = [st.song].concat(st.queue || []).slice(0, 100); st.song = s; st.pos = 0; st.at = now; st.playing = true; ev("prev", { title: s.title }); return true; }
  if (t === "add") { const s = jamTrack(a.track); if (!s) return false; if (!st.song) { st.queue = st.queue || []; startSong(s, "song"); return true; } st.queue = st.queue || []; if (st.queue.length >= 100) return false; if (a.next) st.queue.unshift(s); else st.queue.push(s); ev("add", { title: s.title, next: !!a.next }); return true; }
  if (t === "rm" || t === "qplay" || t === "top") {
    const q = st.queue || [], i = Number(a.i); if (!(i >= 0 && i < q.length) || q[i].id !== String(a.id || "")) return false;
    const [s] = q.splice(i, 1);
    if (t === "rm") { st.queue = q; ev("rm", { title: s.title }); return true; }
    if (t === "top") { q.unshift(s); st.queue = q; ev("top", { title: s.title }); return true; }
    st.queue = q; startSong(s, "song"); return true;
  }
  if (t === "shuffle") { const q = (st.queue || []).slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } st.queue = q; ev("shuffle"); return true; }
  if (t === "clear") { st.queue = []; ev("clear"); return true; }
  return false;
}
async function jamRead(d, code, now) {
  const [r, m] = await d.batch([
    d.prepare("SELECT st, rev, upd FROM jam WHERE code = ?").bind(code),
    d.prepare("SELECT mid, name, seen, joined FROM jamm WHERE code = ? AND seen > ? ORDER BY joined").bind(code, now - JAM_ALIVE),
  ]);
  const row = r.results && r.results[0]; if (!row) return null;
  const mem = (m.results || []).map(x => ({ m: x.mid, n: x.name, j: x.joined }));
  if (row.upd < now - JAM_TTL && !mem.length) return null;
  let st = {}; try { st = JSON.parse(row.st) || {}; } catch (e) {}
  if (st.ended) return { ended: st.ended, rev: row.rev, st, mem: [] };
  return { rev: row.rev, st, mem };
}
const JAM_CHAT_MAX = 300;
const jamChatClean = s => String(s ?? "").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, JAM_CHAT_MAX);
async function jamChatSince(d, code, k) { // newest 100 messages after id k, oldest first
  const r = await d.prepare("SELECT id, mid, name, txt, ts FROM jamc WHERE code = ? AND id > ? ORDER BY id DESC LIMIT 100").bind(code, Math.max(0, Number(k) || 0)).all();
  return (r.results || []).reverse().map(x => ({ i: x.id, m: x.mid, n: x.name, x: x.txt, t: x.ts }));
}
const jamGoneOut = x => J({ ok: false, gone: true, ended: x && x.ended ? { m: x.ended.m, n: x.ended.n, at: x.ended.at } : undefined, msg: x && x.ended ? `${x.ended.n} ne Listen Together band kar diya` : "Ye session khatam ho gaya ya code galat hai", now: Date.now() });
const jamOut = (code, x, extra) => J(Object.assign({ ok: true, code, rev: x.rev, st: x.st, mem: x.mem, now: Date.now() }, extra || {}));
async function jamRoute(p, req, env, u) {
  const now0 = Date.now();
  if (p === "/api/jam/t") return J({ now: Date.now() });
  const d = await jamDb(env);
  const b = req.method === "POST" ? await impBody(req) : {};
  const code = jamStr(b.c || u.searchParams.get("c") || "", 12).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const mid = jamMid(b.m || u.searchParams.get("m")), name = jamName(b.n || u.searchParams.get("n"));
  const touch = () => d.prepare("INSERT INTO jamm (code, mid, name, seen, joined) VALUES (?, ?, ?, ?, ?) ON CONFLICT(code, mid) DO UPDATE SET seen = excluded.seen, name = excluded.name").bind(code, mid, name, Date.now(), Date.now()).run();
  if (p === "/api/jam/new" && req.method === "POST") {
    if (!mid) return J({ ok: false, msg: "bad member" }, 400);
    const now = Date.now(), s0 = b.st || {}, song = jamTrack(s0.song);
    const st = { song, playing: !!(song && s0.playing), pos: song ? Math.max(0, Number(s0.pos) || 0) : 0, at: now, queue: jamList(s0.queue, 100), hist: [], by: { m: mid, n: name }, ev: { t: "start" } };
    let code2 = "";
    for (let k = 0; k < 6 && !code2; k++) {
      const c = Array.from(crypto.getRandomValues(new Uint8Array(6)), x => JAM_ABC[x % JAM_ABC.length]).join("");
      const r = await d.prepare("INSERT OR IGNORE INTO jam (code, st, rev, created, upd) VALUES (?, ?, 1, ?, ?)").bind(c, JSON.stringify(st), now, now).run();
      if (r.meta && r.meta.changes) code2 = c;
    }
    if (!code2) return J({ ok: false, msg: "try again" }, 503);
    await d.prepare("INSERT OR REPLACE INTO jamm (code, mid, name, seen, joined) VALUES (?, ?, ?, ?, ?)").bind(code2, mid, name, now, now).run();
    if (Math.random() < 0.2) { const old = now - JAM_TTL; try { await d.batch([d.prepare("DELETE FROM jam WHERE upd < ? AND code NOT IN (SELECT code FROM jamm WHERE seen > ?)").bind(old, old), d.prepare("DELETE FROM jamm WHERE seen < ?").bind(old), d.prepare("DELETE FROM jamc WHERE ts < ?").bind(old)]); } catch (e) {} }
    return jamOut(code2, await jamRead(d, code2, Date.now()));
  }
  if (!/^[A-Z0-9]{6}$/.test(code)) return J({ ok: false, gone: true, msg: "Code galat hai" });
  if (p === "/api/jam/get") {
    if (mid && (b.hb || u.searchParams.get("hb"))) { const x = await d.prepare("SELECT 1 AS k FROM jamm WHERE code = ? AND mid = ?").bind(code, mid).first(); if (x) await touch(); }
    const x = await jamRead(d, code, Date.now()); if (!x || x.ended) return jamGoneOut(x);
    const r = Number(u.searchParams.get("r") || b.r || 0), kq = u.searchParams.get("k");
    const chat = kq != null && kq !== "" ? await jamChatSince(d, code, kq) : null, cx = chat && chat.length ? { chat } : {};
    if (r && r === x.rev) return J(Object.assign({ ok: true, code, rev: x.rev, same: 1, mem: x.mem, now: Date.now() }, cx));
    return jamOut(code, x, cx);
  }
  if (!mid) return J({ ok: false, msg: "bad member" }, 400);
  if (p === "/api/jam/join" && req.method === "POST") {
    const x = await jamRead(d, code, Date.now()); if (!x || x.ended) return jamGoneOut(x);
    if (x.mem.length >= JAM_MAX && !x.mem.some(m => m.m === mid)) return J({ ok: false, full: true, msg: `Session full hai (${JAM_MAX} log)` });
    await touch();
    return jamOut(code, await jamRead(d, code, Date.now()), { chat: await jamChatSince(d, code, 0) });
  }
  if (p === "/api/jam/chat" && req.method === "POST") { // chat message from a member
    const x = await jamRead(d, code, Date.now()); if (!x || x.ended) return jamGoneOut(x);
    const txt = jamChatClean(b.x); if (!txt) return J({ ok: false, msg: "Khali message" });
    const now = Date.now();
    const last = await d.prepare("SELECT COUNT(*) AS n FROM jamc WHERE code = ? AND mid = ? AND ts > ?").bind(code, mid, now - 10e3).first();
    if (last && last.n >= 12) return J({ ok: false, msg: "Thoda dheere 🙂 bahut tez message ho rahe hain" });
    await d.batch([
      d.prepare("INSERT INTO jamc (code, mid, name, txt, ts) VALUES (?, ?, ?, ?, ?)").bind(code, mid, name, txt, now),
      d.prepare("DELETE FROM jamc WHERE code = ? AND id <= (SELECT id FROM jamc WHERE code = ? ORDER BY id DESC LIMIT 1 OFFSET 100)").bind(code, code),
      d.prepare("INSERT INTO jamm (code, mid, name, seen, joined) VALUES (?, ?, ?, ?, ?) ON CONFLICT(code, mid) DO UPDATE SET seen = excluded.seen, name = excluded.name").bind(code, mid, name, now, now),
    ]);
    return J({ ok: true, chat: await jamChatSince(d, code, b.k), now: Date.now() });
  }
  if (p === "/api/jam/end" && req.method === "POST") { // Stop Listen Together for everyone
    for (let k = 0; k < 5; k++) {
      const x = await jamRead(d, code, Date.now()); if (!x || x.ended) return J({ ok: true, already: true });
      const now = Date.now(), st = x.st; st.ended = { m: mid, n: name, at: now }; st.playing = false; st.ev = { t: "end" }; st.by = { m: mid, n: name };
      const r = await d.prepare("UPDATE jam SET st = ?, rev = rev + 1, upd = ? WHERE code = ? AND rev = ?").bind(JSON.stringify(st), now, code, x.rev).run();
      if (r.meta && r.meta.changes) { try { await d.batch([d.prepare("DELETE FROM jamm WHERE code = ?").bind(code), d.prepare("DELETE FROM jamc WHERE code = ?").bind(code)]); } catch (e) {} return J({ ok: true, now: Date.now() }); }
    }
    return J({ ok: false, msg: "busy" }, 409);
  }
  if (p === "/api/jam/leave" && req.method === "POST") { await d.prepare("DELETE FROM jamm WHERE code = ? AND mid = ?").bind(code, mid).run(); return J({ ok: true }); }
  if (p === "/api/jam/act" && req.method === "POST") {
    for (let k = 0; k < 5; k++) {
      const x = await jamRead(d, code, Date.now()); if (!x || x.ended) return jamGoneOut(x);
      const now = Date.now(), st = x.st;
      if (!jamApply(st, b.a || {}, { m: mid, n: name }, now)) return jamOut(code, x, { nochange: true });
      const r = await d.prepare("UPDATE jam SET st = ?, rev = rev + 1, upd = ? WHERE code = ? AND rev = ?").bind(JSON.stringify(st), now, code, x.rev).run();
      if (r.meta && r.meta.changes) { try { await touch(); } catch (e) {} return jamOut(code, { rev: x.rev + 1, st, mem: x.mem }); }
    }
    return J({ ok: false, msg: "busy" }, 409);
  }
  return J({ ok: false }, 404);
}


// ================= v23: song info · follow artists (new-release alerts on the bot) =================
async function songInfoOf(id) {
  const k = "si:" + id; const h = memGet(k); if (h) return h;
  const j = await sv("song.getDetails", { pids: id }); const x = j.songs ? j.songs[0] : j[id]; if (!x) throw new Error("not found");
  const m = x.more_info || {}, am = m.artistMap || {}, all = [...(am.artists || []), ...(am.primary_artists || []), ...(am.featured_artists || [])];
  const by = role => { const seen = new Set(), out = []; for (const a of all) { if (!a || String(a.role || "").toLowerCase() !== role) continue; const nm = ent(a.name).trim(); if (!nm || seen.has(nm)) continue; seen.add(nm); out.push({ id: String(a.id || ""), name: nm }); } return out; };
  const crew = new Set([...by("music"), ...by("lyricist")].map(a => a.name));
  let singers = by("singer"); if (!singers.length) { const pa = (am.primary_artists || []).concat(am.featured_artists || []).map(a => ({ id: String(a.id || ""), name: ent(a.name).trim() })).filter((a, i, l) => a.name && l.findIndex(b => b.name === a.name) === i); singers = pa.filter(a => !crew.has(a.name)); if (!singers.length) singers = pa; }
  let music = by("music"); if (!music.length && m.music) music = ent(m.music).split(",").map(s => ({ id: "", name: s.trim() })).filter(a => a.name);
  const o = { id, title: ent(x.title || x.song || ""), album: ent(m.album || ""), albumId: String(m.album_id || ""), year: x.year || "", release_date: m.release_date || "", label: ent(m.label || ""), language: x.language || "", duration: +m.duration || 0, play_count: +x.play_count || 0, copyright: ent(m.copyright_text || ""), singers, music, lyricists: by("lyricist"), starring: by("starring").slice(0, 6), image: arImg(x.image, "500x500") };
  memSet(k, o, 6 * 3600); return o;
}
let folReady = null;
function folDb(env) { const d = env.DB; if (!folReady) folReady = d.batch([d.prepare("CREATE TABLE IF NOT EXISTS fol (cid TEXT, aid TEXT, name TEXT, at INTEGER, PRIMARY KEY (cid, aid))"), d.prepare("CREATE INDEX IF NOT EXISTS fol_aid ON fol (aid)")]).catch(e => { folReady = null; throw e; }); return folReady.then(() => d); }
async function userFollow(env, ctx, body) {
  const d = await db(env); const u = await userOf(d, body.c, ctx);
  if (!u || !u.chat_id || !u.linked) return J({ error: "not_linked" }, 401);
  const f = await folDb(env), cid = String(u.chat_id);
  if (body.op === "put" && Array.isArray(body.list)) {
    const list = body.list.filter(a => a && /^\d{1,12}$/.test(String(a.id))).slice(0, 300);
    const st = [f.prepare("DELETE FROM fol WHERE cid = ?").bind(cid)];
    for (const a of list) st.push(f.prepare("INSERT OR REPLACE INTO fol (cid, aid, name, at) VALUES (?, ?, ?, ?)").bind(cid, String(a.id), String(a.name || "").slice(0, 120), Date.now()));
    await f.batch(st);
  }
  const r = await f.prepare("SELECT aid, name FROM fol WHERE cid = ? ORDER BY at DESC").bind(cid).all();
  return J({ ok: true, list: (r.results || []).map(x => ({ id: x.aid, name: x.name })) });
}
async function artistReleases(aid) { // newest releases (albums / singles) of one artist
  const d = await sv("artist.getArtistPageDetails", { artistId: aid, n_song: "1", n_album: "1", page: "0", sort_order: "desc", category: "latest" });
  const rel = (d.latest_release || []).concat(d.singles || []).filter(x => x && /^\d+$/.test(String(x.id)));
  const seen = new Set(), out = [];
  for (const x of rel) { if (seen.has(x.id)) continue; seen.add(x.id); out.push({ id: String(x.id), title: ent(x.title || ""), image: arImg(x.image, "500x500"), year: x.year || "", artist: ent(x.subtitle || "").split(" - ")[0] }); }
  out.sort((a, b) => +b.id - +a.id);
  return { name: ent(d.name || ""), image: arImg(d.image, "500x500"), rel: out.slice(0, 8) };
}
async function followNew(env, ctx, body) {
  const ids = [...new Set((Array.isArray(body.ids) ? body.ids : []).map(String).filter(x => /^\d{1,12}$/.test(x)))].slice(0, 60);
  if (!ids.length) return J({ items: [], artists: [] });
  const d = await db(env); const now = Date.now(), items = [], artists = [], todo = [];
  let budget = 6; // artists refreshed per call (the rest come from stored state; every artist is re-checked at most once per 6 h)
  for (const aid of ids) {
    let st = null; try { const v = await kvGet(d, "far:" + aid); if (v) st = JSON.parse(v); } catch (e) {}
    if ((!st || now - st.at > 6 * 3600e3) && budget > 0) {
      budget--;
      try {
        const r = await artistReleases(aid); const max = st ? +st.max || 0 : 0;
        const fresh = st && max ? r.rel.filter(x => +x.id > max) : []; // first look at an artist only sets the baseline
        const nmax = Math.max(max, ...r.rel.map(x => +x.id));
        const seenAt = Object.assign({}, (st && st.seenAt) || {}); for (const x of fresh) seenAt[x.id] = now;
        for (const k of Object.keys(seenAt)) if (now - seenAt[k] > 30 * 864e5) delete seenAt[k];
        st = { at: now, max: nmax, name: r.name, image: r.image, rel: r.rel, seenAt };
        await kvSet(d, "far:" + aid, JSON.stringify(st));
        if (fresh.length) todo.push({ aid, name: r.name, fresh: fresh.slice(0, 3) });
      } catch (e) { if (st) { st.at = now - 5 * 3600e3; try { await kvSet(d, "far:" + aid, JSON.stringify(st)); } catch (e2) {} } }
    }
    if (st) { artists.push({ id: aid, name: st.name, image: st.image }); for (const x of st.rel || []) items.push({ ...x, aid, aname: st.name, isNew: !!(st.seenAt && st.seenAt[x.id] && now - st.seenAt[x.id] < 14 * 864e5) }); }
  }
  if (todo.length) ctx.waitUntil(followNotify(env, todo).catch(() => {}));
  items.sort((a, b) => (b.isNew - a.isNew) || (+b.id - +a.id));
  const seen = new Set(); const out = items.filter(x => !seen.has(x.id) && seen.add(x.id)).slice(0, 24);
  return J({ items: out, artists });
}
async function followNotify(env, todo) {
  const d = await db(env), f = await folDb(env);
  for (const a of todo) {
    const r = await f.prepare("SELECT cid FROM fol WHERE aid = ? LIMIT 500").bind(a.aid).all(); const cids = (r.results || []).map(x => x.cid);
    if (!cids.length) continue;
    for (const rel of a.fresh) {
      const dk = "fan:" + a.aid + ":" + rel.id; if (await kvGet(d, dk)) continue; await kvSet(d, dk, String(Date.now()));
      let song = null; try { const al = await svAlbum(rel.id); song = al.items && al.items[0]; } catch (e) {}
      const link = song ? SITE + "?song=" + encodeURIComponent(song.id) : SITE + "?al=" + rel.id;
      const html = `⭐ <b>${escH(a.name)}</b> ka naya gaana aaya! 🎶\n\n🎵 <b>${escH(song ? song.title : rel.title)}</b>${song && song.artist ? "\n👤 " + escH(song.artist) : ""}\n\n▶️ Dhun pe suno: ${link}`;
      for (let i = 0; i < cids.length; i += 20) await Promise.all(cids.slice(i, i + 20).map(cid => tg("sendMessage", { chat_id: cid, text: html, parse_mode: "HTML", disable_web_page_preview: false }).catch(() => {})));
    }
  }
}
const escH = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- 🎙️ Podcasts (Apple Podcasts directory + the show's own public RSS feed) ----------
const POD_UA = { "user-agent": "Mozilla/5.0 (Dhun Podcasts; +https://dhun.sites.tab.bot)", accept: "application/rss+xml, application/xml, text/xml, */*" };
const POD_GENRES = { comedy: [1303, "😂 Comedy"], society: [1324, "🧑‍🤝‍🧑 Society & Culture"], education: [1304, "📚 Education"], spiritual: [1314, "🙏 Dharm & Spirituality"], crime: [1488, "🕵️ True Crime"], kids: [1305, "🧸 Kids & Family"], health: [1512, "💪 Health"], business: [1321, "💼 Business"], arts: [1301, "🎭 Arts"], sports: [1545, "🏏 Sports"], news: [1489, "📰 News"], history: [1487, "🏛️ History"] };
const POD_ROWS = [["top", "🇮🇳 Top India"], ["q:hindi podcast", "🎙️ Hindi Podcasts"], ["q:hindi kahaniyan", "📖 Hindi Kahaniyan"], ["q:bollywood podcast", "🎬 Bollywood"], ["g:comedy"], ["g:spiritual"], ["q:hindi motivation", "🔥 Motivation"], ["g:crime"]];
async function podCached(key, sec, fn) {
  const m = memGet("pod:" + key); if (m) return m;
  const ck = new Request("https://dhun.sites.tab.bot/__cache/pod1/" + encodeURIComponent(key));
  try { const c = await caches.default.match(ck); if (c) { const v = await c.json(); memSet("pod:" + key, v, Math.min(sec, 600)); return v; } } catch (e) {}
  const v = await fn();
  if (v && !v.error) { memSet("pod:" + key, v, Math.min(sec, 600)); try { await caches.default.put(ck, new Response(JSON.stringify(v), { headers: { "content-type": "application/json", "cache-control": "public, max-age=" + sec } })); } catch (e) {} }
  return v;
}
const podArt = (u, s = 600) => String(u || "").replace(/\/\d+x\d+(bb)?\.(jpg|jpeg|png|webp)$/i, `/${s}x${s}bb.jpg`);
const podShowOf = r => ({ id: String(r.collectionId || r.id || ""), title: r.collectionName || r.name || "", author: r.artistName || "", image: podArt(r.artworkUrl600 || r.artworkUrl100 || ""), feed: r.feedUrl || "", genre: r.primaryGenreName || (r.genres && r.genres[0] && (r.genres[0].name || r.genres[0])) || "" });
async function podSearch(q, limit = 30) {
  if (!q) return { items: [] };
  const r = await tfetch(`https://itunes.apple.com/search?media=podcast&entity=podcast&country=IN&limit=${limit}&term=${encodeURIComponent(q)}`, {}, 8000);
  if (!r.ok) throw new Error("search " + r.status);
  const d = await r.json();
  return { items: (d.results || []).filter(x => x.collectionId && x.feedUrl).map(podShowOf) };
}
async function podChartRss(gid) {
  const r = await tfetch(`https://itunes.apple.com/in/rss/toppodcasts/limit=50${gid ? "/genre=" + gid : ""}/json`, {}, 8000);
  const d = await r.json(); const es = (d.feed && d.feed.entry) || [];
  return (Array.isArray(es) ? es : [es]).map(e => ({ id: String(e.id && e.id.attributes && e.id.attributes["im:id"] || ""), title: (e["im:name"] || {}).label || "", author: (e["im:artist"] || {}).label || "", image: podArt(((e["im:image"] || []).slice(-1)[0] || {}).label || ""), feed: "", genre: (e.category && e.category.attributes && e.category.attributes.label) || "" })).filter(x => x.id);
}
async function podChart(genre) {
  if (genre && POD_GENRES[genre]) { try { return await podChartRss(POD_GENRES[genre][0]); } catch (e) { return await podChartRss(POD_GENRES[genre][0]); } }
  try {
    const r = await tfetch("https://rss.marketingtools.apple.com/api/v2/in/podcasts/top/50/podcasts.json", {}, 8000);
    const d = await r.json(); const out = ((d.feed && d.feed.results) || []).map(podShowOf).filter(x => x.id);
    if (out.length) return out;
  } catch (e) {}
  return podChartRss(0);
}
async function podTop(genre) {
  if (genre) return podCached("top:" + genre, 6 * 3600, async () => ({ items: (genre.startsWith("q:") ? (await podSearch(genre.slice(2), 30)).items : await podChart(genre)) }));
  return podCached("home", 6 * 3600, async () => {
    const rows = await Promise.all(POD_ROWS.map(async ([k, title]) => {
      try {
        const g = k.startsWith("g:") ? k.slice(2) : k === "top" ? "" : null;
        const items = g !== null ? await podChart(g) : (await podSearch(k.slice(2), 25)).items;
        return { key: g ? g : k, title: title || (POD_GENRES[g] || [])[1] || k, items: items.slice(0, 25) };
      } catch (e) { return null; }
    }));
    const out = rows.filter(r => r && r.items.length);
    return out.length ? { rows: out, genres: Object.entries(POD_GENRES).map(([k, v]) => ({ key: k, title: v[1] })) } : { error: "no rows" };
  });
}
function podHostOk(u) {
  let x; try { x = new URL(u); } catch (e) { return false; }
  if (!/^https?:$/.test(x.protocol) || x.username || x.password) return false;
  const h = x.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!h.includes(".") || /(^|\.)(localhost|local|internal|lan|home|intranet|corp)$/.test(h)) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) { const [a, b] = h.split(".").map(Number); if (a === 10 || a === 127 || a === 0 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127)) return false; }
  if (h.includes(":")) return false; // raw IPv6 literal
  return true;
}
async function podFetchSafe(url, opt = {}, ms = 10000) { // follows redirects itself so every hop is checked
  let u = url;
  for (let i = 0; i < 6; i++) {
    if (!podHostOk(u)) throw new Error("feed host not allowed");
    const r = await tfetch(u, { ...opt, redirect: "manual" }, ms);
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")) { u = new URL(r.headers.get("location"), u).href; continue; }
    return r;
  }
  throw new Error("too many redirects");
}
async function podReadCapped(r, cap = 5 * 1024 * 1024) {
  if (!r.body || !r.body.getReader) return (await r.text()).slice(0, cap);
  const rd = r.body.getReader(), dec = new TextDecoder("utf-8"); let s = "", n = 0;
  for (;;) { const { done, value } = await rd.read(); if (done) break; n += value.length; s += dec.decode(value, { stream: true }); if (n >= cap) { try { rd.cancel(); } catch (e) {} break; } }
  return s + dec.decode();
}
const POD_ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", copy: "©", reg: "®", trade: "™" };
const podDec = s => String(s || "").replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => e[0] === "#" ? (() => { try { return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)); } catch (x) { return m; } })() : (POD_ENT[e.toLowerCase()] ?? m));
const podCdata = s => String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (m, x) => x);
const podPlain = (s, max) => { let t = podCdata(s); if (/&lt;/.test(t) && !/</.test(t)) t = podDec(t); t = t.replace(/<(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "); t = podDec(t).replace(/[ \t\r\f\v\u00a0]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim(); return max && t.length > max ? t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…" : t; };
const podTag = (x, tag) => { const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i").exec(x); return m ? m[1] : ""; };
const podAttr = (x, tag, attr) => { const m = new RegExp(`<${tag}\\s[^>]*?\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(x); return m ? podDec(m[2] ?? m[3] ?? "") : ""; };
const podText = (x, tag) => podDec(podCdata(podTag(x, tag))).replace(/\s+/g, " ").trim();
const podDur = s => { s = String(s || "").trim(); if (!s) return 0; if (/^\d+(\.\d+)?$/.test(s)) return Math.round(+s); const p = s.split(":").map(Number); if (p.some(isNaN)) return 0; return Math.round(p.reduce((a, b) => a * 60 + b, 0)); };
const podH36 = s => { let h1 = 5381, h2 = 52711; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = (h1 * 33) ^ c; h2 = (h2 * 33) ^ c; } return (h1 >>> 0).toString(36) + (h2 >>> 0).toString(36); };
function podParse(xml, max = 300) {
  const first = xml.search(/<item[\s>]/i), ch = first > 0 ? xml.slice(0, first) : xml;
  const chImg = podAttr(ch, "itunes:image", "href") || podText(podTag(ch, "image"), "url");
  const show = { title: podText(ch, "title"), author: podText(ch, "itunes:author") || podText(ch, "managingEditor"), image: chImg, description: podPlain(podTag(ch, "description") || podTag(ch, "itunes:summary"), 1500) };
  const eps = []; const re = /<item[\s>][\s\S]*?<\/item>/gi; let m;
  while ((m = re.exec(xml)) && eps.length < 2000) {
    const it = m[0], url = podAttr(it, "enclosure", "url"); if (!url || !/^https?:\/\//i.test(url)) continue;
    const type = podAttr(it, "enclosure", "type"); if (type && /^(video|image|text)\//i.test(type) && !/mp4|m4v/i.test(type)) continue;
    const guid = podText(it, "guid") || url, date = Date.parse(podText(it, "pubDate") || podText(it, "dc:date")) || 0;
    eps.push({ guid, k: podH36(guid), title: podText(it, "title") || "Episode", date, dur: podDur(podText(it, "itunes:duration")), url, image: podAttr(it, "itunes:image", "href") || "", desc: podPlain(podTag(it, "description") || podTag(it, "itunes:summary") || podTag(it, "content:encoded"), 400) });
  }
  eps.sort((a, b) => b.date - a.date);
  show.episodes = eps.slice(0, max);
  return show;
}
async function podShow(id, feed) {
  if (id && !/^\d{1,15}$/.test(id)) return { error: "bad id" };
  return podCached("show:" + (id || podH36(feed || "")), 3600, async () => {
    let meta = { id: id || "", title: "", author: "", image: "", feed: feed || "", genre: "" };
    if (id) { try { const r = await tfetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast&country=IN`, {}, 8000); const d = await r.json(); const x = (d.results || []).find(z => z.collectionId) || null; if (x) meta = { ...podShowOf(x), feed: feed || x.feedUrl || "" }; } catch (e) {} }
    if (!meta.feed) return { error: "no feed" };
    if (!podHostOk(meta.feed)) return { error: "feed host not allowed" };
    const r = await podFetchSafe(meta.feed, { headers: POD_UA }, 12000);
    if (!r.ok) return { error: "feed " + r.status };
    const s = podParse(await podReadCapped(r));
    if (!s.episodes.length && !s.title) return { error: "feed unreadable" };
    return { id: meta.id, title: meta.title || s.title, author: meta.author || s.author, image: meta.image || s.image, description: s.description, feed: meta.feed, genre: meta.genre, episodes: s.episodes };
  });
}
async function podAudio(req, t) { // CORS + range pass-through for episode audio: http:// files on the https site / app, and the equalizer (Web Audio needs CORS)
  if (!podHostOk(t)) return J({ error: "host not allowed" }, 403);
  const hd = { "user-agent": POD_UA["user-agent"] }; const rg = req.headers.get("range"); if (rg) hd.range = rg;
  const r = await podFetchSafe(t, { headers: hd }, 20000);
  const ct = r.headers.get("content-type") || "";
  if (r.ok && ct && !/^(audio|video)\/|octet-stream|binary|mpeg|x-m4a/i.test(ct)) return J({ error: "not audio" }, 415);
  const out = new Headers();
  for (const k of ["content-type", "content-length", "content-range", "accept-ranges"]) { const v = r.headers.get(k); if (v) out.set(k, v); }
  out.set("access-control-allow-origin", "*"); out.set("cache-control", "no-store");
  return new Response(r.body, { status: r.status, headers: out });
}
async function podRoute(p, req, u) {
  const sp = u.searchParams;
  if (p === "/api/pod/search") { const q = (sp.get("q") || "").trim().slice(0, 120); if (!q) return J({ items: [] }); try { return J(await podCached("s:" + q.toLowerCase(), 3 * 3600, () => podSearch(q)), 200, 1800); } catch (e) { return J({ items: [], error: "search failed" }, 502); } }
  if (p === "/api/pod/top") { const g = (sp.get("genre") || "").slice(0, 60); if (g && !POD_GENRES[g] && !g.startsWith("q:")) return J({ error: "bad genre" }, 400); try { const v = await podTop(g); return J(v, v.error ? 502 : 200, v.error ? 0 : 3600); } catch (e) { return J({ rows: [], error: "chart failed" }, 502); } }
  if (p === "/api/pod/show") { const f = sp.get("feed") || ""; try { const v = await podShow(sp.get("id") || "", f); return J(v, v.error ? 502 : 200, v.error ? 0 : 1800); } catch (e) { return J({ error: String(e && e.message || e).slice(0, 120) }, 502); } }
  if (p === "/api/pod/a") return podAudio(req, sp.get("u") || "");
  return J({ error: "not found" }, 404);
}

export default {
  async fetch(req, env, ctx) {
    loadConfig(env, req);
    const u = new URL(req.url), p = u.pathname, q = (u.searchParams.get("q") || "").slice(0, 200), v = u.searchParams.get("v") || "", id = u.searchParams.get("id") || "";
    try {
      if (p === "/api/songinfo") { if (!/^[\w-]{3,40}$/.test(id)) return J({ error: "bad id" }, 400); try { return J(await songInfoOf(id), 200, 21600); } catch (e) { return J({ error: 1 }); } }
      if (p === "/api/u/follow") return await userFollow(env, ctx, await impBody(req));
      if (p === "/api/follow/new") { try { return await followNew(env, ctx, req.method === "POST" ? await impBody(req) : { ids: (u.searchParams.get("ids") || "").split(",") }); } catch (e) { return J({ items: [], artists: [] }); } }
      if (p.startsWith("/api/jam/")) return await jamRoute(p, req, env, u); // Listen Together
      if (p.startsWith("/api/pod/")) return await podRoute(p, req, u); // 🎙️ Podcasts
      if (p === "/api/u/hist") return await userHist(env, ctx, await impBody(req)); // per-user listening history (signed-in)
      if (p === "/api/u/taste") return await userTaste(env, ctx, await impBody(req)); // v32: onboarding picks + language (signed-in)
      if (p === "/api/artnew") { try { return await artNew(env, ctx, req.method === "POST" ? await impBody(req) : { ids: (u.searchParams.get("ids") || "").split(",") }); } catch (e) { return J({ items: [] }); } } // v32: New from your artists
      if (p.startsWith("/api/tg/") || p.startsWith("/api/u/")) return await tgRoute(p, req, env, u, ctx);
      if (p === "/api/app-version") { // Android in-app updater; values live in /app-version.json (edit that file + swap /dhun.apk to ship a new version)
        let v = {}; try { const r = await env.ASSETS.fetch(new Request(new URL("/app-version.json", u), { headers: { "cache-control": "no-cache" } })); v = await r.json(); } catch (e) {}
        return new Response(JSON.stringify({ versionCode: Number(v.versionCode) || 0, versionName: String(v.versionName || ""), apkUrl: String(v.apkUrl || SITE + "dhun.apk"), notes: String(v.notes || ""), force: !!v.force, sha256: v.sha256 || "", bytes: Number(v.bytes || v.size) || 0, ...(Number(v.size) > 0 ? { size: Number(v.size) } : {}) }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-cache, no-store, must-revalidate", "access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS" } });
      }
      if (p === "/api/foryou") { const b = req.method === "POST" ? await impBody(req) : {}; try { return J(await forYou(b)); } catch (e) { return J({ mode: "error", songs: [], playlists: [] }); } }
      if (p === "/api/svpl") { if (!/^\d{1,15}$/.test(id)) return J({ error: "bad id" }, 400); try { return J(await svPlaylist(id), 200, 1800); } catch (e) { return J({ id, title: "", items: [] }); } }
      if (p === "/api/import") { // public Spotify / Apple Music playlist -> {name, cover, tracks:[{title, artists, dur}]}
        const b = req.method === "POST" ? await impBody(req) : {}; const link = String(b.url || u.searchParams.get("url") || "").slice(0, 600);
        try { const o = await impFetch(env, link); return J({ ok: true, ...o }); }
        catch (e) { const code = (e && e.code) || "upstream"; return J({ ok: false, error: code, msg: IMP_MSG[code] || IMP_MSG.upstream, detail: code === "upstream" ? String((e && e.message) || e).slice(0, 120) : undefined }, 200); }
      }
      if (p === "/api/import/match") { // POST {tracks:[{title, artists, dur}] (max 10)} -> {results:[track|null]}
        const b = await impBody(req); return J({ results: await impMatch(b.tracks) });
      }
      if (req.method === "OPTIONS" && p.startsWith("/api/import")) return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" } });
      if (p === "/api/deals") { let o; try { o = await getDeals(env, ctx); } catch (e) { o = { channel: dealsChannel(env), join: "https://t.me/" + dealsChannel(env), items: [] }; } return J(o, 200, 300); }
      if (p === "/dhun.apk") { const r = await env.ASSETS.fetch(new Request(new URL("/files/dhun-app.apk", u), req)); const h = new Headers(r.headers); h.set("content-type", "application/vnd.android.package-archive"); h.set("content-disposition", 'attachment; filename="Dhun.apk"'); h.set("cache-control", "no-cache"); h.set("access-control-allow-origin", "*"); return new Response(r.body, { status: r.status, headers: h }); }
      if (p === "/api/artists") { if (!q) return J({ items: [], albums: [] }); const [ar, al] = await Promise.all([svArtists(q).catch(() => []), svAlbumsSearch(q).catch(() => [])]); return J({ items: ar, albums: al }, 200, ar.length || al.length ? 3600 : 0); }
      if (p === "/api/artist") { // ?id=<JioSaavn artist id> or ?name=<artist name> -> {id,name,image,followers,items:[up to 300 tracks]}
        const nm = (u.searchParams.get("name") || "").slice(0, 120);
        if (id && !/^\d{1,12}$/.test(id)) return J({ error: "bad id", items: [] }, 400);
        if (!id && !nm) return J({ error: "id or name", items: [] }, 400);
        try { const o = id ? await svArtist(id, ctx) : await svArtistByName(nm, ctx); return J(o, 200, o.items.length ? 3600 : 0); } catch (e) { return J({ id, name: "", items: [], error: "not found" }); }
      }
      if (p === "/api/album") { try { const o = await svAlbum(/^\d{1,15}$/.test(id) ? id : "", u.searchParams.get("song") || ""); return J(o, 200, o.items.length ? 3600 : 0); } catch (e) { return J({ id, name: "", items: [], error: "not found" }); } }
      if (p === "/api/chart") { try { return J(await svChart(u.searchParams.get("l") || ""), 200, 1800); } catch (e) { return J({ items: [], error: "not found" }); } }
      if (p === "/api/mood") { try { return J(await svMood(u.searchParams.get("m") || ""), 200, 3600); } catch (e) { return J({ items: [], error: "not found" }); } }
      if (p === "/api/lyrics") { const sp = u.searchParams; try { const o = await getLyrics({ id, title: sp.get("title"), artist: sp.get("artist"), dur: sp.get("dur") }, ctx); return J(o, 200, o.plain || o.synced ? 86400 : 600); } catch (e) { return J({ synced: "", plain: "", source: "", error: 1 }); } }
      if (p === "/api/search") {
        if (!q) return J({ items: [] });
        const kind = u.searchParams.get("kind") || "songs";
        let items = [], via = "saavn";
        let fix = ""; if (kind !== "videos") { try { const r = await svSearchFix(q); items = r.items; fix = r.fix; } catch (e) {} }
        if (!items.length) { via = "youtube"; try { items = await searchYTM(q, kind); } catch (e) {} if (!items.length) { try { items = await searchFallback(q); } catch (e) {} } items = items.map(x => ({ ...x, src: "yt" })); }
        return J(fix && via === "saavn" ? { items, via, fix } : { items, via }, 200, items.length ? 600 : 0);
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
        if (src === "saavn" || !/^[\w-]{11}$/.test(v)) { try { return J({ items: await (u.searchParams.get("long") ? svRadioLong : svRadio)(v || id, u.searchParams.get("artist") || "", "", u.searchParams.get("title") || "") }, 200, 1800); } catch (e) { return J({ items: [], error: String(e) }); } }
        // legacy YouTube track: recommend from JioSaavn by artist
        try { return J({ items: await svRadio("", u.searchParams.get("artist") || q, "", u.searchParams.get("title") || "") }, 200, 1800); } catch (e) { return J({ items: [] }); }
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

// ===== v32: taste sync, typo-tolerant search, new releases of your artists (last 30 days) =====
// Taste (onboarding picks + language) per signed-in user, D1 kv "ut:<chat_id>"; newest "at" wins.
async function userTaste(env, ctx, body) {
  const d = await db(env); const u = await userOf(d, body.c, ctx);
  if (!u || !u.chat_id || !u.linked) return J({ error: "not_linked" }, 401);
  const k = "ut:" + u.chat_id; let cur = null;
  try { const v = await kvGet(d, k); if (v) cur = JSON.parse(v); } catch (e) {}
  if (body.op === "put" && body.t && typeof body.t === "object") {
    const t = body.t, j = JSON.stringify(t);
    if (j.length > 80000) return J({ error: "too big" }, 413);
    if (!cur || (+t.at || 0) >= (+cur.at || 0)) { cur = t; await kvSet(d, k, j); }
  }
  return J({ ok: true, t: cur });
}
// Typo-tolerant search: JioSaavn already forgives most spellings; we (1) say "Showing results for X" when the top results
// spell the query differently, (2) when the answer is thin, also try spelling variants + JioSaavn autocomplete (parallel, cached).
const fxNorm = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const fxSkel = s => fxNorm(s).replace(/ph/g, "f").replace(/w/g, "v").replace(/z/g, "j").replace(/sh/g, "s").replace(/([bcdgjkpt])h/g, "$1").replace(/h\b/g, "").replace(/ee/g, "i").replace(/oo/g, "u").replace(/(.)\1+/g, "$1").replace(/y/g, "i").replace(/(.)\1+/g, "$1");
const fxCons = s => fxSkel(s).replace(/\B[aeiou]+/g, "");
function fxLev(a, b) { if (a === b) return 0; const m = a.length, n = b.length; if (!m || !n) return m || n; let p = Array.from({ length: n + 1 }, (_, i) => i); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
const fxSim = (a, b) => 1 - fxLev(a, b) / Math.max(a.length, b.length, 1);
const fxTitle = s => String(s || "").replace(/\s*[\(\[][^\)\]]*[\)\]]/g, " ").split(/\s+[-\u2013\u2014|]\s+/)[0].replace(/\s+/g, " ").trim();
function fxCands(items) { const out = []; for (const t of (items || []).slice(0, 6)) { out.push(fxTitle(t.title)); for (const a of String(t.artist || "").split(/,|&/)) if (a.trim()) out.push(a.trim()); if (t.album) out.push(fxTitle(t.album)); } return out.filter(Boolean); }
// -> {fix, score}: fix = the spelling the results use ("" when the query already matches one exactly / nothing is close)
function fxPick(q, items) {
  const nq = fxNorm(q); if (nq.length < 3) return { fix: "", score: 1 };
  const qw = nq.split(" ").length, cq = fxCons(nq), sq = fxSkel(nq); let best = null, any = 0;
  for (const c of fxCands(items)) {
    const nc = fxNorm(c); if (!nc) continue;
    if (nc === nq) return { fix: "", score: 1 };
    any = Math.max(any, fxSim(sq, fxSkel(nc)), nc.includes(nq) || nq.includes(nc) ? 0.9 : 0);
    if (nc.split(" ").length !== qw) continue;
    const s = fxCons(nc) === cq ? 1 : fxSim(sq, fxSkel(nc));
    if (s >= 0.75 && fxSim(nq, nc) >= 0.6 && (!best || s > best.s)) best = { c, s };
  }
  return best ? { fix: best.c, score: best.s } : { fix: "", score: any };
}
function fxVariants(q) {
  const n = fxNorm(q), v = new Set();
  v.add(n.replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u").replace(/(.)\1+/g, "$1"));
  v.add(n.replace(/([bcdgjkpt])h/g, "$1").replace(/sh/g, "s").replace(/w/g, "v").replace(/z/g, "j").replace(/ph/g, "f"));
  v.add(n.replace(/([^aeiou\s])([aeiou])([^aeiou\s])(?=[aeiou])/g, "$1$2$2$3"));
  v.delete(n); v.delete(""); return [...v].slice(0, 2);
}
async function svSearchFix(q) {
  const mk = "fx:" + fxNorm(q); const hit = memGet(mk); if (hit) return hit;
  let items = []; try { items = await svSearch(q); } catch (e) {}
  let pk = fxPick(q, items), out = { items, fix: pk.fix };
  if (fxNorm(q).length >= 4 && (items.length < 8 || (!pk.fix && pk.score < 0.6))) {
    const alt = new Set(fxVariants(q));
    try { const ac = await sv("autocomplete.get", { query: q }); for (const g of ["topquery", "songs", "artists", "albums"]) { const x = ac && ac[g] && ac[g].data && ac[g].data[0]; if (x && x.title) { alt.add(fxTitle(ent(x.title))); if (alt.size >= 4) break; } } } catch (e) {}
    alt.delete(fxNorm(q));
    const tries = await Promise.all([...alt].slice(0, 3).map(v => svSearch(v, 30).then(it => ({ v, it, p: fxPick(v, it), s: fxPick(q, it) })).catch(() => null)));
    let bestT = null; for (const t of tries) if (t && t.it.length) { const sc = (t.s.fix ? t.s.score : t.s.score * 0.8) + Math.min(t.it.length, 20) / 100; if (!bestT || sc > bestT.sc) bestT = { ...t, sc }; }
    const baseSc = (pk.fix ? pk.score : pk.score * 0.8) + Math.min(items.length, 20) / 100;
    if (bestT && bestT.sc > baseSc + 0.05) {
      const seen = new Set(), merged = [];
      for (const t of [...bestT.it, ...items]) if (t && !seen.has(t.id)) { seen.add(t.id); merged.push(t); }
      const f = bestT.s.fix || fxPick(bestT.v, bestT.it).fix || (fxCands(bestT.it)[0] && fxSim(fxSkel(q), fxSkel(fxCands(bestT.it)[0])) >= 0.6 ? fxCands(bestT.it)[0] : "");
      out = { items: merged.slice(0, 40), fix: f && fxNorm(f) !== fxNorm(q) ? f : "" };
    }
  }
  if (out.items.length) memSet(mk, out, 3600);
  return out;
}
// "New from your artists": releases (albums / singles) of the given artists from the last 30 days, newest first.
// Per artist state in D1 kv "anr:<aid>" (refreshed at most every 3 h, shared by everyone).
async function artNew(env, ctx, body) {
  const ids = [...new Set((Array.isArray(body.ids) ? body.ids : []).map(String).filter(x => /^\d{1,12}$/.test(x)))].slice(0, 12);
  if (!ids.length) return J({ items: [] });
  const d = await db(env); const now = Date.now(), out = [], cy = new Date().getFullYear(); let budget = 8;
  const one = async aid => {
    const k = "anr:" + aid; let st = null; try { const v = await kvGet(d, k); if (v) st = JSON.parse(v); } catch (e) {}
    if ((!st || now - st.at > 3 * 3600e3) && budget-- > 0) {
      try {
        const r = await artistReleases(aid);
        const cand = r.rel.filter(x => +x.year >= cy - 1 && !/vocals only|instrumental|karaoke|slowed|reverb|lo-?fi|sped up|\b8d\b/i.test(x.title)).slice(0, 4);
        const rel = [];
        await Promise.all(cand.map(async x => { try { const a = await sv("content.getAlbumDetails", { albumid: x.id }); const l = a.list || []; const songs = svList(l); const rd = (l[0] && l[0].more_info && l[0].more_info.release_date) || ""; if (songs.length && rd) rel.push({ id: x.id, title: x.title, image: x.image, rd, n: songs.length, t: songs[0] }); } catch (e) {} }));
        st = { at: now, name: r.name, image: r.image, rel };
        await kvSet(d, k, JSON.stringify(st));
      } catch (e) { if (!st) return; }
    }
    if (st) for (const x of st.rel || []) out.push({ ...x, aid, aname: st.name });
  };
  for (let i = 0; i < ids.length; i += 4) await Promise.all(ids.slice(i, i + 4).map(one));
  const cut = now - 30 * 864e5, seen = new Set(), keys = new Set();
  const items = out.filter(x => { const t = Date.parse(x.rd); return t >= cut && t <= now + 2 * 864e5; })
    .sort((a, b) => (Date.parse(b.rd) - Date.parse(a.rd)) || (+b.id - +a.id))
    .filter(x => { const sk = songKey(x.t); if (seen.has(x.id) || keys.has(sk)) return false; seen.add(x.id); keys.add(sk); return true; });
  return J({ items: items.slice(0, 20) });
}
