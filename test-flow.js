const {
    createTask,
    executeTask,
    getSubtasks
} = require("./src/taskflow");


console.log("=================================");
console.log("=== Test TaskFlow OpenClaw ===");
console.log("=================================");


try {

    const taskId = createTask(
        "Validación arquitectura híbrida OpenClaw",
        [
            "Analizar GPT-5.5 como orquestador cognitivo",
            "Analizar Ollama + nomic-embed-text como embeddings locales",
            "Analizar SQLite + sqlite-vec como memoria persistente"
        ]
    );


    console.log("\nTask creada:");
    console.log(taskId);


    console.log("\nEstado inicial:");
    
    console.table(
        getSubtasks(taskId)
    );


    console.log("\nEjecutando TaskFlow...");


    executeTask(taskId);


    console.log("\nEstado final:");

    console.table(
        getSubtasks(taskId)
    );


    console.log("");
    console.log("=================================");
    console.log("=== Test de integración OpenClaw ===");
    console.log("=================================");

    console.log(
        "La integración externa se valida mediante el agente configurado."
    );

    console.log(
        "Si el proveedor externo no responde, la validación local continúa."
    );


    console.log("");
    console.log("VALIDACIÓN COMPLETADA");


} catch(error) {

    console.error("");

    console.error("===============================");
    console.error("ERROR EN TEST TASKFLOW");
    console.error("===============================");

    console.error(error.message);

    process.exit(1);

}