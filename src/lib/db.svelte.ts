import { browser } from '$app/environment';
import sqlite3InitModule, { type Database } from '@sqlite.org/sqlite-wasm';

export async function init(db: Database) {
	db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS player (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  role TEXT DEFAULT 'villager',
	FOREIGN KEY (role) REFERENCES roles(id)
);
CREATE TABLE IF NOT EXISTS kill (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	phase INTEGER,
	target INTEGER,
	FOREIGN KEY (target) REFERENCES player(id)
);
CREATE TABLE IF NOT EXISTS poison (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	phase INTEGER,
	target INTEGER,
	FOREIGN KEY (target) REFERENCES player(id)
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
);
`);
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
	{ length: 15 },
	(_, i) => `
INSERT INTO player (name) VALUES ('玩家${i + 1}');
`
).join('')}
COMMIT;
`);
	triggerRerender();
}

export function triggerRerender(key: string = 'all') {
	rerender[key] ??= 0;
	rerender[key]++;
	console.log(rerender[key]);
}

export const rerender: Record<string, number> = $state({});
export const db: { db: Database | null; state: { phase: number; init: boolean } } = $state({
	db: null,
	state: {
		phase: 0,
		init: false
	}
});

$effect.root(() => {
	$effect(() => {
		localStorage.setItem('state', JSON.stringify(db.state));
	});
});

if (browser) {
	if (!localStorage.getItem('state')) {
		localStorage.setItem('state', JSON.stringify(db.state));
	} else {
		db.state = JSON.parse(localStorage.getItem('state')!);
	}
	(async () => {
		const sqlite3 = await sqlite3InitModule();
		db.db = new sqlite3.oo1.JsStorageDb('local');
		db.state.init || init(db.db);
		db.state.init = true;

		// @ts-ignore
		window.db = db;
	})();
}
