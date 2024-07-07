import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database("fci.db");

export function addUser(name, username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    "INSERT INTO users (name, username, password) VALUES (?, ?, ?)"
  );
  stmt.run(name, username, hashedPassword);
}

export function updateUserProgress(username, progress) {
  const stmt = db.prepare("UPDATE users SET progress = ? WHERE username = ?");
  stmt.run(progress, username);
}

export function getUserByUsername(username) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  return stmt.get(username);
}


export function getUserProgress(username) {
  const stmt = db.prepare("SELECT progress FROM users WHERE username = ?");
  const user = stmt.get(username);
  return user ? user.progress : null;
}