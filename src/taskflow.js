const db = require("./database");
const { randomUUID } = require("crypto");


function createTask(title, subtasks) {

    const taskId = randomUUID();

    db.prepare(
        "INSERT INTO tasks VALUES (?, ?, ?)"
    ).run(
        taskId,
        title,
        "pending"
    );


    const insert = db.prepare(
        "INSERT INTO subtasks VALUES (?, ?, ?, ?)"
    );


    for (const subtask of subtasks) {

        insert.run(
            randomUUID(),
            taskId,
            subtask,
            "pending"
        );

    }


    return taskId;

}



function executeTask(taskId) {


    const subtasks =
        db.prepare(
            "SELECT * FROM subtasks WHERE task_id = ?"
        )
        .all(taskId);



    for (const subtask of subtasks) {


        db.prepare(
            `
            UPDATE subtasks
            SET status = ?
            WHERE id = ?
            `
        )
        .run(
            "running",
            subtask.id
        );


        db.prepare(
            `
            UPDATE subtasks
            SET status = ?
            WHERE id = ?
            `
        )
        .run(
            "completed",
            subtask.id
        );

    }



    db.prepare(
        `
        UPDATE tasks
        SET status = ?
        WHERE id = ?
        `
    )
    .run(
        "completed",
        taskId
    );

}



function getSubtasks(taskId) {

    return db.prepare(
        "SELECT * FROM subtasks WHERE task_id = ?"
    )
    .all(taskId);

}



module.exports = {
    createTask,
    executeTask,
    getSubtasks
};