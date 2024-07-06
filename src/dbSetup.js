import Database from 'better-sqlite3';
const db = new Database('fci.db')
db.pragma('journal_mode = WAL');

const query = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name STRING NOT NULL,
        username STRING NOT NULL UNIQUE 
    )
`;

db.exec(query);

// const data = [
//     {name: "Carmona", username:"humberto"},
// ];

// const insert = db.prepare("INSERT INTO users (name, username) VALUES (?, ? )")

// db.transaction(()=>{
//     for (const user of data) {
//         insert.run(user.name, user.username);
//     }
// })();

console.log('Database setup complete');