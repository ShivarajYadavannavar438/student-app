// db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'students.db');
const MIGRATION_SQL = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');

const db = new Database(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');
db.exec(MIGRATION_SQL);

module.exports = db;
