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



async function executeTask(taskId) {


    const updateTaskStatus =
        db.prepare(
            `
            UPDATE tasks
            SET status = ?
            WHERE id = ?
            `
        );


    const updateSubtaskStatus =
        db.prepare(
            `
            UPDATE subtasks
            SET status = ?
            WHERE id = ?
            `
        );



    // La tarea comienza ejecución

    updateTaskStatus.run(
        "running",
        taskId
    );



    const subtasks =
        db.prepare(
            "SELECT * FROM subtasks WHERE task_id = ?"
        )
        .all(taskId);



    for (const subtask of subtasks) {


        // Estado inicial

        updateSubtaskStatus.run(
            "running",
            subtask.id
        );



        console.log(
            `Ejecutando subtarea: ${subtask.description}`
        );



       // Simulación de procesamiento del agente sin bloquear el proceso

	await new Promise(resolve => setTimeout(resolve, 300));



        // Finalización

        updateSubtaskStatus.run(
            "completed",
            subtask.id
        );

    }



    updateTaskStatus.run(
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