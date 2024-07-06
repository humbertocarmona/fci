import Database from "better-sqlite3";
const db = new Database("fci.db");

export function addUser(name, username) {
  const stmt = db.prepare("INSERT INTO users (name, username) VALUES (?, ?)");
  stmt.run(name, username);
}


console.log("dbAddUsers.js loaded");
