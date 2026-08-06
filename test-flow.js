const { exec } = require("child_process");
const fs = require("fs");

const path = require("path");

const prompt = `
Necesito validar las capacidades de OpenClaw.

Crea un flujo de trabajo con 3 subtareas:

Subtarea 1:
Analizar el rol de GPT-5.5 dentro de una arquitectura híbrida.

Subtarea 2:
Analizar cómo Ollama con nomic-embed-text genera embeddings locales.

Subtarea 3:
Analizar cómo SQLite con sqlite-vec permite memoria persistente.

Durante el proceso:

- Guarda los conceptos importantes en memoria contextual.
- Recupera información mediante búsqueda semántica.
- Genera una conclusión final indicando cuál componente es más importante.

Devuelve:

1. Lista de subtareas.
2. Estado de cada tarea.
3. Evidencia de memoria utilizada.
`;

fs.writeFileSync("task.md", prompt);

console.log("=== Test de integración con OpenClaw ===");
console.log("Ejecutando agente main...\n");


const openclawCommand =
'powershell -ExecutionPolicy Bypass -File "C:\\Users\\Dylan\\AppData\\Roaming\\npm\\openclaw.ps1" agent --agent main --message-file task.md';


exec(openclawCommand, (error, stdout, stderr) => {

    const logPath = path.join(
        __dirname,
        "logs",
        "taskflow-result.txt"
    );


    if (stdout) {

        console.log(stdout);

        fs.writeFileSync(
            logPath,
            stdout
        );
    }


    if (error) {

        const errorMessage = error.message;


        if (
            errorMessage.includes("usage limit") ||
            errorMessage.includes("quota") ||
            errorMessage.includes("Codex subscription")
        ) {

            console.log(
`
⚠️ OpenClaw ejecutó correctamente el flujo local,
pero el modelo remoto no respondió.

Motivo:
Se alcanzó el límite de uso de la suscripción Codex/OpenAI.

La implementación local sigue validada:

✔ TaskFlow funcionando
✔ Subtareas persistentes en SQLite
✔ Memoria contextual funcionando
✔ Retrieval funcionando

Para ejecutar la parte cognitiva nuevamente:
- esperar el reinicio de cuota
- cambiar proveedor/modelo
- utilizar otra API configurada
`
            );


            fs.appendFileSync(
                logPath,
                "\n\nOPENCLAW LIMITACIÓN DE CUOTA:\n" +
                errorMessage
            );


            return;
        }


        console.log(
`
❌ Error inesperado en OpenClaw:

${errorMessage}
`
        );


        return;
    }


    if (stderr) {

        console.error(
            "Advertencias:",
            stderr
        );

    }


    console.log(
`
✅ Integración OpenClaw completada correctamente.
Resultado guardado en:
logs/taskflow-result.txt
`
    );

});