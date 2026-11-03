-- Dhun database schema (SQLite / Cloudflare D1).
-- The server also creates these tables automatically on first request, so running this file is optional.

CREATE TABLE IF NOT EXISTS files (sid TEXT, q TEXT, file_id TEXT, mid INTEGER, title TEXT, artist TEXT, album TEXT, dur INTEGER, thumb TEXT, bytes INTEGER, at INTEGER, PRIMARY KEY (sid, q));
CREATE TABLE IF NOT EXISTS users (code TEXT PRIMARY KEY, chat_id INTEGER, username TEXT, name TEXT, created INTEGER, linked INTEGER);
CREATE TABLE IF NOT EXISTS dls (chat_id INTEGER, id TEXT, sid TEXT, q TEXT, file_id TEXT, dm_mid INTEGER, title TEXT, artist TEXT, album TEXT, dur INTEGER, thumb TEXT, bytes INTEGER, at INTEGER, PRIMARY KEY (chat_id, id));
CREATE TABLE IF NOT EXISTS ev (kind TEXT, at INTEGER);
CREATE TABLE IF NOT EXISTS people (chat_id INTEGER PRIMARY KEY, username TEXT, name TEXT, first_at INTEGER, last_seen INTEGER, blocked INTEGER DEFAULT 0, connected INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS udata (chat_id INTEGER PRIMARY KEY, liked TEXT, playlists TEXT, recent TEXT, rev INTEGER DEFAULT 0, at INTEGER);
CREATE TABLE IF NOT EXISTS dlog (chat_id INTEGER, sid TEXT, title TEXT, artist TEXT, at INTEGER);
CREATE TABLE IF NOT EXISTS bcast (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, text TEXT, from_chat INTEGER, msg_id INTEGER, status TEXT, total INTEGER DEFAULT 0, sent INTEGER DEFAULT 0, failed INTEGER DEFAULT 0, blocked INTEGER DEFAULT 0, lease INTEGER DEFAULT 0, created INTEGER, done_at INTEGER);
CREATE TABLE IF NOT EXISTS bq (bid INTEGER, chat_id INTEGER, state INTEGER DEFAULT 0, PRIMARY KEY (bid, chat_id));
-- logs channel: per-minute counter for the 20/min cap, and small key/value state (last log ok/error)
CREATE TABLE IF NOT EXISTS logm (minute INTEGER PRIMARY KEY, n INTEGER DEFAULT 0, dropped INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT);
-- v1.0.9: anonymous usage heartbeat (random install id per app/browser; no personal data): first/last seen, platform, version, listening seconds, linked Telegram chat (0 = guest)
CREATE TABLE IF NOT EXISTS devices (did TEXT PRIMARY KEY, first_at INTEGER, last_at INTEGER, pf TEXT, v TEXT, listen INTEGER DEFAULT 0, chat_id INTEGER DEFAULT 0, lday INTEGER DEFAULT 0, ltoday INTEGER DEFAULT 0, pings INTEGER DEFAULT 0);
