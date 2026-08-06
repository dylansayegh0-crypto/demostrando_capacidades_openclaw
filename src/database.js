const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const storageDir = path.join(__dirname, "..", "storage");

if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
}

const db = new Database(path.join(storageDir, "taskflow.db"));

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
`);

module.exports = db;