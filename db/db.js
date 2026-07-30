/*This file's job: connect to the database and make sure the tables (like spreadsheets, but structured) we need exist.*/
const Database = require('better-sqlite3');

const db = new Database('db/recipes.sqlite');

db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    time_needed TEXT
    )
    `);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
    )
`);
    
module.exports = db; //makes this db connection available to other files in the project, so server.js can require('./db/db') and use it.
