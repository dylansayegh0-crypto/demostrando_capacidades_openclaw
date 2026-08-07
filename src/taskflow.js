const db = require("./database");
const { randomUUID } = require("crypto");
const { retrieval } = require("./memory");



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


        updateSubtaskStatus.run(
            "running",
            subtask.id
        );



        console.log(
            `\nEjecutando subtarea: ${subtask.description}`
        );



        /*
        Antes de ejecutar la subtarea,
        el agente consulta memoria contextual
        */

        const context =
            await retrieval(
                subtask.description
            );



        console.log(
            "Contexto recuperado:"
        );


        console.table(
            context.slice(0,3)
        );



        /*
        Simulación de procesamiento
        utilizando contexto recuperado
        */


        await new Promise(
            resolve => setTimeout(resolve,300)
        );



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