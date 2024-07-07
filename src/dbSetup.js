import Database from 'better-sqlite3';
const db = new Database('fci.db')
db.pragma('journal_mode = WAL');

const query = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name STRING NOT NULL,
        username STRING NOT NULL UNIQUE,
        password STRING NOT NULL,
        progress INTEGER NOT NULL DEFAULT 1
    )
`;

db.exec(query);

