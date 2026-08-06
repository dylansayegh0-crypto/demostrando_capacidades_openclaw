const { createTask, getSubtasks } = require("./src/taskflow");

const id = createTask(
    "Checkpoint OpenClaw",
    [
        "Analizar GPT-5.5",
        "Analizar Ollama",
        "Analizar SQLite"
    ]
);

console.log("Task:", id);

console.table(
    getSubtasks(id)
);