const db = require("./database");
const { randomUUID } = require("crypto");

function createTask(title, subtasks) {

    const taskId = randomUUID();

    db.prepare(
        "INSERT INTO tasks VALUES (?, ?, ?)"
    ).run(taskId, title, "completed");

    const insert = db.prepare(
        "INSERT INTO subtasks VALUES (?, ?, ?, ?)"
    );

    for (const subtask of subtasks) {
        insert.run(
            randomUUID(),
            taskId,
            subtask,
            "completed"
        );
    }

    return taskId;
}

function getSubtasks(taskId) {

    return db.prepare(
        "SELECT * FROM subtasks WHERE task_id = ?"
    ).all(taskId);

}

module.exports = {
    createTask,
    getSubtasks
};