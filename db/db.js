/*This file's job: connect to the database and make sure the tables (like spreadsheets, but structured) we need exist.*/
const Database = require('better-sqlite3');

const db = new Database('db/recipes.sql');

db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    time_needed TEXT
    )
    `);