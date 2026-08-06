const { exec } = require("child_process");
const fs = require("fs");

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

exec(
  "openclaw agent --agent main --message-file task.md",
  (error, stdout, stderr) => {

    if(error){
      console.error(error.message);
      return;
    }

    console.log(stdout);

    if(stderr){
      console.error(stderr);
    }

  }
);