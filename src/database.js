const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const storageDir = path.join(__dirname, "..", "storage");

if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
}

const dbPath = path.join(storageDir, "taskflow.db");

const db = new Database(dbPath);


db.exec(`

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS subtasks (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(task_id) REFERENCES tasks(id)
);


-- Memoria contextual vectorial
CREATE TABLE IF NOT EXISTS memories (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    text TEXT NOT NULL,

    embedding TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

`);


module.exports = db;