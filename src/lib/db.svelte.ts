import { browser } from '$app/environment';
import sqlite3InitModule, { type Database } from '@sqlite.org/sqlite-wasm';

export async function init(db: Database) {
	db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS player (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  role TEXT DEFAULT 'villager',
  is_alive INTEGER DEFAULT 1,
	FOREIGN KEY (role) REFERENCES roles(id)
);
CREATE TABLE IF NOT EXISTS action (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phase INTEGER,
  player INTEGER,
  action TEXT,
  target INTEGER,
  FOREIGN KEY (player) REFERENCES player(id)
);
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT
);
CREATE TABLE IF NOT EXISTS sheriff (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	player INTEGER,
	FOREIGN KEY (player) REFERENCES player(id)
`);
	triggerRerender();
}

export async function start(db: Database, playerCount: number) {
	db.exec(`
BEGIN TRANSACTION;
INSERT INTO roles (id, name, description) VALUES ('werewolf', '狼人', '每晚將一位玩家殺害');
INSERT INTO roles (id, name, description) VALUES ('king', '王', '每晚將一位玩家殺害');
INSERT INTO roles (id, name, description) VALUES ('witch', '女巫', '有解藥和毒藥各一瓶，不可同一晚使用，不可自救');
INSERT INTO roles (id, name, description) VALUES ('seer', '預言家', '每晚查閱一位存活玩家身份');
INSERT INTO roles (id, name, description) VALUES ('hunter', '獵人', '每晚將一位玩家殺害');
INSERT INTO roles (id, name, description) VALUES ('knight', '騎士', '每晚將一位玩家殺害');
INSERT INTO roles (id, name, description) VALUES ('villager', '村民', '每晚將一位玩家殺害');
COMMIT;
`);
	db.exec(`
BEGIN TRANSACTION;
${Array.from(
	{ length: playerCount },
	(_, i) => `
INSERT INTO player (name) VALUES ('玩家${i + 1}');
`
).join('')}
COMMIT;
`);
	triggerRerender();
}

export const rerender: Record<string, number> = $state({});
export let db: { db: Database | null } = $state({ db: null });

if (browser) {
	(async () => {
		const sqlite3 = await sqlite3InitModule();
		db.db = new sqlite3.oo1.JsStorageDb('local');
		init(db.db);
		start(db.db, 15);

		// @ts-ignore
		window.db = db;
	})();
}

export function triggerRerender(key: string = 'all') {
	rerender[key] ??= 0;
	rerender[key]++;
	console.log(rerender[key]);
}
